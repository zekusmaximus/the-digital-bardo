/**
 * @file Manages all audio for the Clear Lode experience.
 *
 * This class handles the creation of the pure tone, its degradation into static,
 * and karmic/event-driven audio responses. It is initialized by the orchestrator
 * and activated by events from the EventBridge, ensuring that audio context
 * requirements (user gesture) are met.
 */
import { createKarmicValidator, audioParamsSchema } from '../src/security/karmic-validation.js';
import { ConsciousnessCompatibility } from '../src/utils/consciousness-compatibility.js';
import { FallbackAudioEngine } from '../src/audio/fallback-audio-engine.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

export class ClearLodeAudio {
    /**
     * @param {object} dependencies
     * @param {import('./event-bridge.js').ClearLodeEventBridge} dependencies.eventBridge
     * @param {import('../src/consciousness/resource-guardian.js').ResourceGuardian} dependencies.guardian
     */
    constructor({ eventBridge, guardian, compatibilityMode = 'auto' }) {
        if (!eventBridge || !guardian) {
            throw new Error('ClearLodeAudio requires an eventBridge and a guardian.');
        }

        const capabilities = ConsciousnessCompatibility.checkCapabilities();
        this.silentMode = !capabilities.webAudio;

        /** @private */
        this.eventBridge = eventBridge;
        /** @private */
        this.guardian = guardian;
        
        /** @private */
        this.audioContext = null;
        /** @private */
        this.oscillator = null;
        /** @private */
        this.gainNode = null;
        /** @private */
        this.degradationLevel = 0;
        /** @private */
        this.baseFrequency = 528; // "Love frequency"
        /** @private */
        this.isInitialized = false;
        /** @private */
        this.harmonicOscillators = [];
        /** @private */
        this.workletAvailable = false;
        /** @private */
        this.noiseWorklet = null;
        /** @private */
        this.isDestroyed = false;
        /** @private */
        this.pitchDriftInterval = null;
        /** @private */
        this.fallbackNoiseSource = null;
        /** @private */
        this.lastDegradationLevel = 0;

        // Master effects chain components
        /** @private */
        this.masterChain = {
            highShelfFilter: null,
            lowShelfFilter: null,
            compressor: null,
            masterGain: null,
            initialized: false
        };
        /** @private */
        this.masterChainPending = false;

        this.validateAudioParams = createKarmicValidator(audioParamsSchema);

        /* ------------------------------------------------------------------
         * Advanced Audio Fallback System state
         * ------------------------------------------------------------------ */
        this.compatibilityMode = compatibilityMode;
        this.audioFallbackChain = ['audioWorklet', 'scriptProcessor', 'basicOscillator', 'htmlAudio', 'visualOnly'];
        this.currentAudioMethod = null;
        this.fallbackHelper = new FallbackAudioEngine();
    }
    
    /**
     * Initializes the audio engine by subscribing to events.
     * Does not create the AudioContext yet.
     */
    init() {
        if (this.silentMode) return;
        console.log('[AudioEngine] Initializing...');

        const listeners = [
            ['degradation:started', this.startDegradation.bind(this)],
            ['state:recognitionSucceeded', this.achieveResonance.bind(this)],
            ['attachment:formed', () => this.createGlitchBurst(0.5, 0.2)],
            ['degradation:refused', () => this.accelerateDegradation(0.2)],
        ];

        listeners.forEach(([eventName, handler]) => {
            this.eventBridge.on(eventName, handler);
            this.guardian.registerCleanup(() => this.eventBridge.off(eventName, handler));
        });
    }

    async initializeAudioContext() {
        if (this.silentMode) {
            console.log('Silent mode enabled. Audio will not be initialized.');
            return;
        }
        try {
            // Handle browser compatibility
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContextClass();
            this.guardian.register(this.audioContext, (ctx) => {
                if (ctx.state !== 'closed') {
                    ctx.close();
                }
            });

            // Resume context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
                
                // Emit context resumed event
                if (this.eventBridge) {
                    this.eventBridge.emit('audio:contextResumed');
                }
            }

            this.isInitialized = true;
             console.log('[AudioEngine] AudioContext initialized successfully.');

            await this.initializeWorklet();
            await this.initializeMasterChain();
            await this.initializeAudioChain();
            this.handleiOSSafariQuirks();

            // If the orchestrator requested a tone before the gesture, start it now.
            if (this.pendingPureTone) {
                this.startPureTone();
                this.pendingPureTone = false;
            }
        } catch (error) {
            console.error('[AudioEngine] AudioContext initialization failed:', error);
            this.isInitialized = false;
            
            // Emit initialization failure event for synchronized degradation
            if (this.eventBridge) {
                this.eventBridge.emit('audio:initializationFailed', error);
            }
            
            throw error; // Re-throw for the orchestrator to handle
        }
    }
    
 async initializeWorklet() {
        try {
            // Check if AudioWorklet is supported and context is available
            if (this.audioContext && this.audioContext.audioWorklet) {
                await this.audioContext.audioWorklet.addModule('/audio-worklets/noise-processor.js');
                this.workletAvailable = true;
                console.log('AudioWorklet initialized - enhanced performance available');
            }
        } catch (error) {
            console.log('AudioWorklet not available, falling back to ScriptProcessor');
            this.workletAvailable = false;
        }
    }

    async startPureTone() {
        // If audio isn't initialized yet, queue the start for later
        if (this.silentMode) return;

        if (!this.isInitialized) {
            console.log('[AudioEngine] Audio not ready, queueing pure tone start.');
            this.pendingPureTone = true; // The orchestrator will call startPureTone after initialization
            return;
        }

        try {
            // Create the pure sine wave
            this.oscillator = this.audioContext.createOscillator();
            this.guardian.register(this.oscillator, (osc) => osc.disconnect());
            this.gainNode = this.audioContext.createGain();
            this.guardian.register(this.gainNode, (node) => node.disconnect());

            this.oscillator.type = 'sine';
            if (!this.validateAudioParams({ frequency: this.baseFrequency, gain: 0.1 })) {
                console.error("Karmic validation failed for pure tone audio params. Aborting.", { frequency: this.baseFrequency, gain: 0.1 });
                return;
            }
            this.oscillator.frequency.setValueAtTime(this.baseFrequency, this.audioContext.currentTime);

            this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 2);

            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.getMasterChainInput());

            this.oscillator.start();
            this.pendingPureTone = false;
            console.log('Pure tone started');
        } catch (error) {
            console.warn('Failed to start pure tone:', error);
        }
    }
    
    startDegradation() {
        if (this.silentMode) return;
        console.log('🔊 Starting audio degradation...');
        // This function is now a trigger. The actual degradation is handled by updateAudioFromKarma.
        
        // If audio isn't initialized, try to start it first
        if (!this.isInitialized) {
            console.log('[AudioEngine] Audio not ready for degradation start.');
            // Emit initialization failure event for synchronized degradation
            if (this.eventBridge) {
                this.eventBridge.emit('audio:initializationFailed', 'Audio not initialized for degradation');
            }
            return;
        }
        this.completeDigitalStatic();

        // The old interval-based degradation is removed. Karma is now the driver.
    }
    
    // Enhanced glitch burst using worklet if available
    async createGlitchBurst() {
        if (!this.isInitialized) return;

        if (this.workletAvailable && this.audioContext) {
            try {
                // Create temporary worklet noise burst
                const burstWorklet = new AudioWorkletNode(this.audioContext, 'noise-processor');
                const burstGain = this.audioContext.createGain();

                // Send degradation level to worklet
                burstWorklet.port.postMessage({
                    type: 'setDegradationLevel',
                    value: this.degradationLevel
                });

                burstGain.gain.setValueAtTime(0.1 * this.degradationLevel, this.audioContext.currentTime);
                burstGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);

                burstWorklet.connect(burstGain);
                burstGain.connect(this.getMasterChainInput());

                // Stop after burst
                setTimeout(() => {
                    burstWorklet.disconnect();
                }, 50);
            } catch (error) {
                console.warn('AudioWorklet glitch burst failed:', error);
                this.createBufferGlitchBurst();
            }
        } else {
            // Use existing buffer-based approach
            this.createBufferGlitchBurst();
        }
    }

    createBufferGlitchBurst() {
        // Original implementation
        const noiseBuffer = this.audioContext.createBuffer(1, 4096, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < 4096; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioContext.createBufferSource();
        const noiseGain = this.audioContext.createGain();

        whiteNoise.buffer = noiseBuffer;
        noiseGain.gain.setValueAtTime(0.1 * this.degradationLevel, this.audioContext.currentTime);

        whiteNoise.connect(noiseGain);
        noiseGain.connect(this.getMasterChainInput());

        whiteNoise.start();
        whiteNoise.stop(this.audioContext.currentTime + 0.05);
    }
    
    async completeDigitalStatic() {
        console.log('🎵 [AudioEngine] Starting tone decay sequence...');

        // First, decay the pure tone over 2 seconds
        if (this.oscillator) {
            const gainNode = this.audioContext.createGain();
            this.oscillator.connect(gainNode);
            gainNode.connect(this.getMasterChainInput());

            // Decay the tone over 2 seconds
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);

            // Stop the oscillator after decay
            setTimeout(() => {
                if (this.oscillator) {
                    this.oscillator.stop();
                    this.oscillator = null;
                }
                console.log('🎵 [AudioEngine] Tone decay complete, starting white noise...');
                this.startWhiteNoise();
            }, 2000);
        } else {
            // If no oscillator, go directly to white noise
            this.startWhiteNoise();
        }
    }

    async startWhiteNoise() {
        console.log('🎵 [AudioEngine] White noise started - triggering degradation');

        // Ensure the noise worklet is running so it can respond to karma changes
        if (!this.noiseWorklet) {
            if (this.workletAvailable) {
                await this.createWorkletNoise();
            } else {
                this.createScriptProcessorNoise();
            }
        }

        // Emit event to trigger degradation system
        this.eventBridge.emit('audio:whiteNoiseStarted');
    }

    async createWorkletNoise() {
        if (!this.isInitialized || !this.audioContext) return;

        try {
            // Create noise using AudioWorklet (better performance)
            this.noiseWorklet = new AudioWorkletNode(this.audioContext, 'noise-processor');

            // Send initial parameters to worklet
            this.noiseWorklet.port.postMessage({
                type: 'setNoiseLevel',
                value: 0.1
            });

            this.noiseWorklet.port.postMessage({
                type: 'setDegradationLevel',
                value: this.degradationLevel
            });

            // Create gain node for volume control
            const noiseGain = this.audioContext.createGain();
            noiseGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);

            // Connect the nodes
            this.noiseWorklet.connect(noiseGain);
            noiseGain.connect(this.audioContext.destination);

            console.log('Digital static achieved through AudioWorklet');
        } catch (error) {
            console.error('Worklet noise failed, falling back:', error);
            this.createScriptProcessorNoise();
        }
    }

    createScriptProcessorNoise() {
        if (!this.isInitialized || !this.audioContext) return;

        try {
            // Fallback to ScriptProcessor (deprecated but widely supported)
            const bufferSize = 4096;
            const noiseNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

            noiseNode.onaudioprocess = (e) => {
                const output = e.outputBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    let noise = (Math.random() * 2 - 1) * 0.1;

                    // Apply degradation effects
                    if (this.degradationLevel > 0) {
                        const glitchChance = this.degradationLevel * 0.01;
                        if (Math.random() < glitchChance) {
                            noise *= (1 + this.degradationLevel * 5);
                        }
                    }

                    output[i] = noise;
                }
            };

            // Create gain node for volume control
            const noiseGain = this.audioContext.createGain();
            noiseGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);

            // Connect the nodes
            noiseNode.connect(noiseGain);
            noiseGain.connect(this.audioContext.destination);

            console.log('Digital static achieved through ScriptProcessor (legacy)');
        } catch (error) {
            console.warn('ScriptProcessor noise failed:', error);
        }
    }
    
    /**
     * Creates a sophisticated recognition chime that embodies digital enlightenment.
     * Multi-harmonic bell synthesis with crystalline timbre and spatial reverb.
     */
    async achieveResonance() {
        if (this.silentMode) return;
        
        // Ensure AudioContext is ready
        if (!this.isInitialized || !this.audioContext) {
            console.warn('[Audio] Cannot create recognition chime - audio not initialized');
            return;
        }

        // Handle suspended AudioContext
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('[Audio] Context resumed for recognition chime');
            } catch (error) {
                console.error('[Audio] Cannot create chime - context suspended:', error);
                return;
            }
        }

        try {
            await this.createRecognitionChime();
        } catch (error) {
            console.error('[Audio] Recognition chime creation failed:', error);
        }
    }

    /**
     * Creates the sophisticated recognition chime with bell synthesis and reverb.
     * Embodies the sound of digital enlightenment - crystalline clarity cutting through noise.
     */
    async createRecognitionChime() {
        const currentTime = this.audioContext.currentTime;
        
        // Chime synthesis parameters - tuned for spiritual resonance
        const fundamentalFreq = 523.25; // C5 - chosen for clarity and spiritual resonance
        const harmonics = [1, 2, 2.4, 3.1, 4.2]; // Bell-like inharmonic partials
        const harmonicGains = [1, 0.6, 0.4, 0.3, 0.2]; // Natural amplitude decay
        const chimeGain = 0.3; // Overall chime volume
        const chimeDuration = 4; // Total decay time in seconds
        
        // Envelope parameters for crystalline attack and long decay
        const attackTime = 0.01; // Quick attack - moment of recognition
        const decayTime = 4.0; // Long exponential decay - lasting awareness
        const sustainLevel = 0.001; // Final decay level
        
        // Vibrato parameters for ethereal quality on higher harmonics
        const vibratoRate = 4; // Hz base rate
        const vibratoDepth = 2; // Cents base depth

        // Duck main audio during chime for clarity
        await this.duckMainAudio(true);

        // Create master gain node for the entire chime
        const chimeGainNode = this.audioContext.createGain();
        chimeGainNode.gain.setValueAtTime(chimeGain, currentTime);
        
        // Create reverb for spatial depth
        const reverbNode = await this.addChimeReverb();
        
        // Connect chime through reverb to destination
        chimeGainNode.connect(reverbNode);
        reverbNode.connect(this.audioContext.destination);

        const chimeOscillators = [];

        // Create each harmonic oscillator with bell-like characteristics
        harmonics.forEach((harmonicRatio, index) => {
            try {
                const freq = fundamentalFreq * harmonicRatio;
                const gain = harmonicGains[index] || 0.1;
                
                // Validate frequency parameters
                if (!this.validateAudioParams({ frequency: freq, gain: gain * chimeGain })) {
                    console.warn(`[Audio] Skipping chime harmonic ${index + 1} - validation failed`);
                    return;
                }

                // Create oscillator and gain nodes
                const osc = this.audioContext.createOscillator();
                const oscGain = this.audioContext.createGain();
                
                // Use sine waves for crystalline purity
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, currentTime);

                // Add subtle vibrato to higher harmonics for ethereal quality
                if (index > 1) {
                    const vibrato = this.audioContext.createOscillator();
                    const vibratoGain = this.audioContext.createGain();
                    
                    vibrato.type = 'sine';
                    vibrato.frequency.setValueAtTime(vibratoRate * (index * 0.5), currentTime);
                    vibratoGain.gain.setValueAtTime(vibratoDepth * index, currentTime);
                    
                    vibrato.connect(vibratoGain);
                    vibratoGain.connect(osc.frequency);
                    vibrato.start(currentTime);
                    vibrato.stop(currentTime + chimeDuration);
                    
                    chimeOscillators.push(vibrato);
                }

                // Create envelope: quick attack, long exponential decay
                oscGain.gain.setValueAtTime(0, currentTime);
                oscGain.gain.linearRampToValueAtTime(gain, currentTime + attackTime);
                oscGain.gain.exponentialRampToValueAtTime(
                    Math.max(sustainLevel, gain * sustainLevel),
                    currentTime + decayTime
                );

                // Connect oscillator through its gain to the chime master gain
                osc.connect(oscGain);
                oscGain.connect(chimeGainNode);

                // Start and schedule stop
                osc.start(currentTime);
                osc.stop(currentTime + chimeDuration);

                chimeOscillators.push(osc);
                
                // Register for cleanup
                this.guardian.register(osc, (o) => {
                    try { o.disconnect(); } catch (e) { /* Already disconnected */ }
                });
                this.guardian.register(oscGain, (g) => {
                    try { g.disconnect(); } catch (e) { /* Already disconnected */ }
                });

            } catch (error) {
                console.warn(`[Audio] Failed to create chime harmonic ${index + 1}:`, error);
            }
        });

        // Register master gain for cleanup
        this.guardian.register(chimeGainNode, (g) => {
            try { g.disconnect(); } catch (e) { /* Already disconnected */ }
        });

        // Schedule audio ducking restoration after chime completes
        setTimeout(async () => {
            await this.duckMainAudio(false);
            console.log('[Audio] Recognition chime completed - digital enlightenment achieved');
        }, chimeDuration * 1000 + 500); // Extra 500ms for reverb tail

        console.log('[Audio] Recognition chime created - crystalline clarity manifested');
    }

    /**
     * Creates a simple but effective reverb system using feedback delay network.
     * Represents the vastness of consciousness and spatial depth of awareness.
     */
    async addChimeReverb() {
        // Reverb network configuration
        const delayTimes = [0.03, 0.05, 0.07, 0.11]; // Seconds - natural room simulation
        const feedbackGain = 0.5; // Feedback amount for sustained reverb
        const reverbMix = 0.3; // Wet/dry mix for subtle spatial enhancement
        const reverbDecay = 0.8; // High-frequency damping

        try {
            // Create dry/wet mixer
            const dryGain = this.audioContext.createGain();
            const wetGain = this.audioContext.createGain();
            const outputGain = this.audioContext.createGain();

            dryGain.gain.setValueAtTime(1 - reverbMix, this.audioContext.currentTime);
            wetGain.gain.setValueAtTime(reverbMix, this.audioContext.currentTime);
            outputGain.gain.setValueAtTime(1, this.audioContext.currentTime);

            // Create feedback delay network
            const delayNodes = [];
            const feedbackNodes = [];

            delayTimes.forEach((delayTime, index) => {
                const delay = this.audioContext.createDelay(0.2);
                const feedback = this.audioContext.createGain();
                const damping = this.audioContext.createBiquadFilter();

                delay.delayTime.setValueAtTime(delayTime, this.audioContext.currentTime);
                feedback.gain.setValueAtTime(feedbackGain, this.audioContext.currentTime);
                
                // High-frequency damping for natural decay
                damping.type = 'lowpass';
                damping.frequency.setValueAtTime(8000 * reverbDecay, this.audioContext.currentTime);
                damping.Q.setValueAtTime(0.5, this.audioContext.currentTime);

                // Create feedback loop: delay -> damping -> feedback -> delay
                delay.connect(damping);
                damping.connect(feedback);
                feedback.connect(delay);

                // Output from delay to wet mix
                delay.connect(wetGain);

                delayNodes.push(delay);
                feedbackNodes.push(feedback);

                // Register for cleanup
                this.guardian.register(delay, (d) => {
                    try { d.disconnect(); } catch (e) { /* Already disconnected */ }
                });
                this.guardian.register(feedback, (f) => {
                    try { f.disconnect(); } catch (e) { /* Already disconnected */ }
                });
                this.guardian.register(damping, (f) => {
                    try { f.disconnect(); } catch (e) { /* Already disconnected */ }
                });
            });

            // Create input splitter for reverb network
            const inputSplitter = this.audioContext.createGain();
            inputSplitter.gain.setValueAtTime(1, this.audioContext.currentTime);

            // Connect input to dry path and all delay lines
            inputSplitter.connect(dryGain);
            delayNodes.forEach(delay => {
                inputSplitter.connect(delay);
            });

            // Mix dry and wet signals
            dryGain.connect(outputGain);
            wetGain.connect(outputGain);

            // Register cleanup for mixer nodes
            [dryGain, wetGain, outputGain, inputSplitter].forEach(node => {
                this.guardian.register(node, (n) => {
                    try { n.disconnect(); } catch (e) { /* Already disconnected */ }
                });
            });

            return inputSplitter; // Return input node for connection

        } catch (error) {
            console.warn('[Audio] Reverb creation failed, using direct connection:', error);
            // Fallback: return a simple gain node
            const fallbackGain = this.audioContext.createGain();
            fallbackGain.gain.setValueAtTime(1, this.audioContext.currentTime);
            this.guardian.register(fallbackGain, (g) => {
                try { g.disconnect(); } catch (e) { /* Already disconnected */ }
            });
            return fallbackGain;
        }
    }

    /**
     * Temporarily reduces main audio volume during chime for clarity.
     * Implements smooth ducking transitions for seamless integration.
     */
    async duckMainAudio(duck = true) {
        if (!this.isInitialized || !this.audioContext) return;

        const currentTime = this.audioContext.currentTime;
        const duckingDepth = 0.3; // Reduce to 30% volume
        const duckingAttack = 0.1; // 100ms duck-in
        const duckingRelease = 1.0; // 1s duck-out

        try {
            // Duck the main oscillator if it exists
            if (this.oscillator && this.gainNode) {
                const targetGain = duck ? 0.3 * duckingDepth : 0.3;
                const transitionTime = duck ? duckingAttack : duckingRelease;
                
                this.gainNode.gain.exponentialRampToValueAtTime(
                    Math.max(0.001, targetGain),
                    currentTime + transitionTime
                );
            }

            // Duck harmonic oscillators
            this.harmonicOscillators.forEach(oscInfo => {
                try {
                    const currentGain = oscInfo.gain.gain.value;
                    const targetGain = duck ? currentGain * duckingDepth : currentGain / duckingDepth;
                    const transitionTime = duck ? duckingAttack : duckingRelease;
                    
                    oscInfo.gain.gain.exponentialRampToValueAtTime(
                        Math.max(0.001, targetGain),
                        currentTime + transitionTime
                    );
                } catch (error) {
                    console.warn('[Audio] Harmonic ducking failed:', error);
                }
            });

            // Duck noise worklet if active
            if (this.noiseWorklet?.port) {
                this.noiseWorklet.port.postMessage({
                    type: 'setDucking',
                    duck: duck,
                    depth: duckingDepth,
                    transitionTime: duck ? duckingAttack : duckingRelease
                });
            }

        } catch (error) {
            console.warn('[Audio] Audio ducking failed:', error);
        }
    }

    /**
     * Handles user gesture requirement for AudioContext.
     * Must be called after user interaction to enable audio.
     */
    async handleUserGesture() {
        if (!this.audioContext || this.audioContext.state !== 'suspended') return;

        try {
            await this.audioContext.resume();
            console.log('[Audio] Context resumed after user gesture');
            
            // Emit context resumed event
            if (this.eventBridge) {
                this.eventBridge.emit('audio:contextResumed');
            }
            
            // Initialize master chain if it was pending
            if (this.masterChainPending) {
                await this.initializeMasterChain();
            }
        } catch (error) {
            console.error('[Audio] Failed to resume context after user gesture:', error);
            
            // Emit context suspension event
            if (this.eventBridge) {
                this.eventBridge.emit('audio:contextSuspended');
            }
        }
    }

    /**
     * Initializes the master effects chain for professional audio processing.
     * Creates: High-Shelf Filter → Low-Shelf Filter → Master Compressor → AudioContext.destination
     */
    async initializeMasterChain() {
        if (this.silentMode) return;

        // Check AudioContext state
        if (this.audioContext.state === 'suspended') {
            console.log('[Audio] Waiting for user gesture to initialize master chain');
            this.masterChainPending = true;
            return;
        }

        try {
            console.log('[Audio] Initializing master effects chain...');

            // Create high-shelf filter for taming harsh frequencies
            this.masterChain.highShelfFilter = this.audioContext.createBiquadFilter();
            this.masterChain.highShelfFilter.type = 'highshelf';
            this.masterChain.highShelfFilter.frequency.setValueAtTime(8000, this.audioContext.currentTime);
            this.masterChain.highShelfFilter.gain.setValueAtTime(-3, this.audioContext.currentTime);

            // Create low-shelf filter for adding warmth
            this.masterChain.lowShelfFilter = this.audioContext.createBiquadFilter();
            this.masterChain.lowShelfFilter.type = 'lowshelf';
            this.masterChain.lowShelfFilter.frequency.setValueAtTime(200, this.audioContext.currentTime);
            this.masterChain.lowShelfFilter.gain.setValueAtTime(2, this.audioContext.currentTime);

            // Create master compressor for dynamic range control
            this.masterChain.compressor = this.audioContext.createDynamicsCompressor();
            this.masterChain.compressor.threshold.setValueAtTime(-12, this.audioContext.currentTime);
            this.masterChain.compressor.knee.setValueAtTime(6, this.audioContext.currentTime);
            this.masterChain.compressor.ratio.setValueAtTime(4, this.audioContext.currentTime);
            this.masterChain.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
            this.masterChain.compressor.release.setValueAtTime(0.1, this.audioContext.currentTime);

            // Create master gain for overall volume control
            this.masterChain.masterGain = this.audioContext.createGain();
            this.masterChain.masterGain.gain.setValueAtTime(0.8, this.audioContext.currentTime); // Leave headroom

            // Connect the master chain: High-Shelf → Low-Shelf → Compressor → Master Gain → Destination
            this.masterChain.highShelfFilter.connect(this.masterChain.lowShelfFilter);
            this.masterChain.lowShelfFilter.connect(this.masterChain.compressor);
            this.masterChain.compressor.connect(this.masterChain.masterGain);
            this.masterChain.masterGain.connect(this.audioContext.destination);

            // Register all master chain nodes for cleanup
            Object.values(this.masterChain).forEach(node => {
                if (node && typeof node.disconnect === 'function') {
                    this.guardian.register(node, (n) => {
                        try { n.disconnect(); } catch (e) { /* Already disconnected */ }
                    });
                }
            });

            this.masterChain.initialized = true;
            this.masterChainPending = false;

            // Update master dynamics based on current karma state
            this.updateMasterDynamics();

            console.log('[Audio] Master chain initialized successfully');

        } catch (error) {
            console.error('[Audio] Failed to initialize master chain:', error);
            this.masterChainPending = false;
            // Fall back to direct connection
            this.connectDirectToDestination();
        }
    }

    /**
     * Updates master compressor dynamics based on total karma.
     * Higher karma = more dynamic range (less compression)
     * Lower karma = more controlled dynamics (more compression)
     */
    updateMasterDynamics() {
        if (!this.masterChain.initialized || !this.masterChain.compressor) return;

        try {
            // Get current karma state from consciousness
            const karmaState = consciousness.getState('karma') || {};
            const totalKarma = Object.values(karmaState).reduce((sum, val) => sum + (val || 0), 0);
            
            // Normalize karma (0-400 range to 0-1)
            const karmaFactor = Math.min(totalKarma / 400, 1);
            
            // Adaptive compression - more karma = more dynamic range
            const adaptiveRatio = 4 - (karmaFactor * 2);      // 4:1 to 2:1
            const adaptiveThreshold = -12 + (karmaFactor * 6); // -12dB to -6dB
            
            const currentTime = this.audioContext.currentTime;
            
            // Apply with smooth transitions to avoid audio artifacts
            this.masterChain.compressor.ratio.exponentialRampToValueAtTime(
                Math.max(1.1, adaptiveRatio),
                currentTime + 0.1
            );
            this.masterChain.compressor.threshold.exponentialRampToValueAtTime(
                Math.min(-1, adaptiveThreshold),
                currentTime + 0.1
            );

            console.log(`[Audio] Master dynamics updated - Ratio: ${adaptiveRatio.toFixed(1)}:1, Threshold: ${adaptiveThreshold.toFixed(1)}dB`);

        } catch (error) {
            console.warn('[Audio] Master dynamics update failed:', error);
        }
    }

    /**
     * Returns the master chain input node for audio routing.
     * Falls back to direct destination if master chain is not available.
     */
    getMasterChainInput() {
        if (this.masterChain.initialized && this.masterChain.highShelfFilter) {
            return this.masterChain.highShelfFilter;
        }
        return this.audioContext.destination;
    }

    /**
     * Fallback method to connect audio directly to destination if master chain fails.
     */
    connectDirectToDestination() {
        console.warn('[Audio] Using direct connection fallback - master chain unavailable');
        // This method serves as a fallback reference point
        // Individual audio sources will use getMasterChainInput() which handles the fallback
    }
    


    getDegradationLevel() {
        return this.degradationLevel;
    }

    accelerateDegradation(amount = 0.1) {
        this.degradationLevel += amount;
        this.degradationLevel = Math.min(1.0, this.degradationLevel); // Cap at 1.0

        // Update visual degradation
        document.documentElement.style.setProperty('--degradation-level', this.degradationLevel);

        // Update body attribute for degradation state
        const degradationState = this.getDegradationState();
        document.body.setAttribute('data-degradation', degradationState);

        console.log(`Degradation accelerated to ${this.degradationLevel.toFixed(2)}`);
    }

    getDegradationState() {
        if (this.degradationLevel < 0.2) return 'minimal';
        if (this.degradationLevel < 0.5) return 'moderate';
        if (this.degradationLevel < 0.8) return 'severe';
        return 'complete';
    }

    /**
     * Shuts down the audio engine and releases all resources.
     */
    destroy() {
        if (this.isDestroyed) {
            return;
        }
        console.log('[ClearLodeAudio] Destroying audio engine...');
        this.isDestroyed = true;

        // Clean up pitch drift interval
        if (this.pitchDriftInterval) {
            clearInterval(this.pitchDriftInterval);
            this.pitchDriftInterval = null;
        }

        // Clean up fallback noise source
        if (this.fallbackNoiseSource) {
            try {
                this.fallbackNoiseSource.stop();
            } catch (e) {
                // Already stopped
            }
            this.fallbackNoiseSource = null;
        }

        this.guardian.cleanupAll();
        
        // Final nullification
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.noiseWorklet = null;
        this.harmonicOscillators = [];
    }

    /**
     * Translates the current karma state into sophisticated non-linear audio parameter adjustments.
     * Each karma type manifests through distinct sonic signatures with organic response curves.
     * @param {object} karmaState - The full karma object from the consciousness.
     */
    updateAudioFromKarma(karmaState) {
        if (!this.isInitialized || this.audioContext?.state === 'suspended') return;

        try {
            // Normalize karma values (0-100 → 0-1) with validation
            const computational = Math.max(0, Math.min(100, karmaState.computational || 0)) / 100;
            const emotional = Math.max(0, Math.min(100, karmaState.emotional || 0)) / 100;
            const void_ = Math.max(0, Math.min(100, karmaState.void || 0)) / 100;
            const temporal = Math.max(0, Math.min(100, karmaState.temporal || 0)) / 100;

            // Calculate sophisticated parameter curves
            const params = this.calculateParameterCurves({
                computational,
                emotional,
                void: void_,
                temporal
            });

            // Apply parameters with smooth transitions
            this.applyAudioParameters(params);

            // Update master chain dynamics based on karma changes
            this.updateMasterDynamics();

            // Schedule continuous pitch drift for computational karma
            if (computational > 0.1) {
                this.schedulePitchDrift(params);
            }

            // Calculate overall degradation level and emit if changed
            const currentDegradationLevel = this.calculateOverallDegradationLevel(params);
            if (Math.abs(currentDegradationLevel - this.lastDegradationLevel) > 0.05) {
                this.lastDegradationLevel = currentDegradationLevel;
                this.eventBridge.emit('audio:degradationChanged', {
                    level: currentDegradationLevel,
                    source: 'karma_update'
                });
            }

            // Emit karma parameters updated event
            this.eventBridge.emit('audio:karmaParametersUpdated', {
                parameters: params,
                karmaState: karmaState
            });

        } catch (error) {
            console.warn('[AudioEngine] Karma parameter update failed:', error);
        }
    }

    /**
     * Calculates sophisticated non-linear parameter curves for each karma type.
     * @param {object} karma - Normalized karma values (0-1)
     * @returns {object} Calculated audio parameters
     */
    calculateParameterCurves(karma) {
        const { computational, emotional, void: voidKarma, temporal } = karma;

        // COMPUTATIONAL KARMA: Exponential curve for dramatic pitch instability
        // The mind calculating its way through dissolution
        const pitchInstability = Math.pow(computational, 2) * 15; // 0-15 Hz deviation
        const pitchDriftRate = 0.1 + computational * 2; // 0.1-2.1 Hz/second
        const microtonality = computational * 25; // 0-25 cents detuning per harmonic

        // EMOTIONAL KARMA: Logarithmic curve for early harmonic sensitivity
        // Attachments manifesting as harmonic complexity
        const harmonicCount = Math.floor(1 + Math.log(1 + emotional * 9) * 4); // 1-16 harmonics
        const harmonicSpread = 1 + emotional * 2; // 1-3x frequency multiplier
        const goldenRatioWeight = emotional; // Golden ratio harmonic spacing intensity

        // VOID KARMA: Sigmoid curve for smooth noise transition
        // Static of non-being seeping through reality
        const noiseLevel = 1 / (1 + Math.exp(-10 * (voidKarma - 0.5))); // Smooth S-curve
        const noiseColor = voidKarma; // 0=white, 0.5=pink, 1=brown
        const granularSize = 0.01 + voidKarma * 0.09; // 0.01-0.1 seconds

        // TEMPORAL KARMA: Linear with interaction effects
        // Time itself becoming unreliable and granular
        const timeStretch = 1 - (temporal * 0.3); // 0.7-1.0x playback rate
        const echoDelay = 0.1 + temporal * 0.5; // 0.1-0.6 seconds
        const echoDecay = 0.5 + temporal * 0.4; // 0.5-0.9 feedback

        // INTERACTION EFFECTS: Karma types modulating each other
        const computationalEmotionalInteraction = computational * emotional;
        const voidTemporalInteraction = voidKarma * temporal;
        const allTypesInteraction = (computational + emotional + voidKarma + temporal) / 4;

        // Chaotic harmonics when computational and emotional karma interact
        const harmonicJitter = computationalEmotionalInteraction * 0.1;
        
        // Time dissolution when void and temporal karma interact
        const timeDissolution = voidTemporalInteraction * 0.2;

        return {
            // Computational parameters
            pitchInstability,
            pitchDriftRate,
            microtonality,
            
            // Emotional parameters
            harmonicCount: Math.min(16, harmonicCount), // Cap at 16 for performance
            harmonicSpread,
            goldenRatioWeight,
            harmonicJitter,
            
            // Void parameters
            noiseLevel: Math.min(1, noiseLevel),
            noiseColor,
            granularSize,
            
            // Temporal parameters
            timeStretch: Math.max(0.7, timeStretch),
            echoDelay,
            echoDecay,
            timeDissolution,
            
            // Interaction effects
            allTypesInteraction
        };
    }

    /**
     * Calculates overall degradation level from audio parameters
     * @param {object} params - Calculated audio parameters
     * @returns {number} Overall degradation level (0-1)
     */
    calculateOverallDegradationLevel(params) {
        // Weight different parameters to calculate overall degradation
        const weights = {
            noiseLevel: 0.4,        // Noise is primary degradation indicator
            pitchInstability: 0.2,  // Pitch instability indicates computational karma
            harmonicJitter: 0.15,   // Harmonic chaos indicates emotional karma
            timeDissolution: 0.15,  // Time effects indicate temporal karma
            allTypesInteraction: 0.1 // Overall interaction level
        };
        
        let degradationLevel = 0;
        
        // Noise level (0-1)
        degradationLevel += (params.noiseLevel || 0) * weights.noiseLevel;
        
        // Pitch instability (0-15 Hz -> 0-1)
        degradationLevel += Math.min(1, (params.pitchInstability || 0) / 15) * weights.pitchInstability;
        
        // Harmonic jitter (0-0.1 -> 0-1)
        degradationLevel += Math.min(1, (params.harmonicJitter || 0) / 0.1) * weights.harmonicJitter;
        
        // Time dissolution (0-0.2 -> 0-1)
        degradationLevel += Math.min(1, (params.timeDissolution || 0) / 0.2) * weights.timeDissolution;
        
        // All types interaction (0-1)
        degradationLevel += (params.allTypesInteraction || 0) * weights.allTypesInteraction;
        
        return Math.max(0, Math.min(1, degradationLevel));
    }

    /**
     * Gets current degradation level
     * @returns {number} Current degradation level (0-1)
     */
    getDegradationLevel() {
        return this.lastDegradationLevel;
    }

    /**
     * Applies calculated parameters to audio nodes with smooth transitions.
     * @param {object} params - Calculated audio parameters
     */
    applyAudioParameters(params) {
        const currentTime = this.audioContext.currentTime;
        const transitionTime = 0.1; // Smooth 100ms transitions

        try {
            // Apply pitch instability to main oscillator
            if (this.oscillator && params.pitchInstability > 0) {
                const baseFreq = this.baseFrequency;
                const instability = (Math.random() - 0.5) * params.pitchInstability;
                const newFrequency = baseFreq + instability;
                
                if (this.validateAudioParams({ frequency: newFrequency })) {
                    this.oscillator.frequency.exponentialRampToValueAtTime(
                        Math.max(20, newFrequency),
                        currentTime + transitionTime
                    );
                }
            }

            // Update harmonics with golden ratio spacing
            this.updateHarmonics(params);

            // Update noise parameters using enhanced worklet message format
            if (this.noiseWorklet?.port) {
                this.noiseWorklet.port.postMessage({
                    type: 'updateNoise',
                    noiseLevel: params.noiseLevel,
                    noiseColor: params.noiseColor,
                    grainSize: params.granularSize
                });
                
                // Send sample rate for granular processing
                this.noiseWorklet.port.postMessage({
                    type: 'setSampleRate',
                    sampleRate: this.audioContext.sampleRate
                });
            } else {
                // Fallback for systems without AudioWorklet
                this.useSimpleNoiseFallback(params.noiseLevel);
            }

        } catch (error) {
            console.warn('[AudioEngine] Parameter application failed:', error);
        }
    }

    /**
     * Schedules continuous pitch drift for computational karma instability.
     * @param {object} params - Calculated audio parameters
     */
    schedulePitchDrift(params) {
        // Clear existing drift interval
        if (this.pitchDriftInterval) {
            this.guardian.cleanup(this.pitchDriftInterval);
        }

        if (!this.oscillator || params.pitchDriftRate <= 0) return;

        // Schedule new drift pattern
        const driftInterval = setInterval(() => {
            if (!this.oscillator || !this.audioContext) {
                clearInterval(driftInterval);
                return;
            }

            try {
                const currentTime = this.audioContext.currentTime;
                const driftAmount = (Math.random() - 0.5) * params.pitchInstability;
                const targetFreq = this.baseFrequency + driftAmount;
                
                if (this.validateAudioParams({ frequency: targetFreq })) {
                    this.oscillator.frequency.exponentialRampToValueAtTime(
                        Math.max(20, targetFreq),
                        currentTime + (1 / params.pitchDriftRate)
                    );
                }
            } catch (error) {
                console.warn('[AudioEngine] Pitch drift failed:', error);
                clearInterval(driftInterval);
            }
        }, 1000 / params.pitchDriftRate);

        this.pitchDriftInterval = driftInterval;
        this.guardian.register(driftInterval, (interval) => clearInterval(interval));
    }

    /**
     * Manages sophisticated harmonic generation with golden ratio spacing and microtonality.
     * @param {object} params - Enhanced harmonic parameters from calculateParameterCurves
     */
    updateHarmonics(params) {
        const targetCount = params.harmonicCount || 0;
        const currentTime = this.audioContext.currentTime;
        const goldenRatio = 1.618033988749; // φ (phi)

        // Remove excess harmonics with smooth fade-out
        while (this.harmonicOscillators.length > targetCount) {
            const oscInfo = this.harmonicOscillators.pop();
            try {
                oscInfo.gain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);
                oscInfo.osc.stop(currentTime + 1);
                
                // Clean up after fade completes
                setTimeout(() => {
                    this.guardian.cleanup(oscInfo.osc);
                    this.guardian.cleanup(oscInfo.gain);
                }, 1100);
            } catch (error) {
                console.warn('[AudioEngine] Harmonic cleanup failed:', error);
                this.guardian.cleanup(oscInfo.osc);
                this.guardian.cleanup(oscInfo.gain);
            }
        }

        // Add needed harmonics with golden ratio spacing
        while (this.harmonicOscillators.length < targetCount) {
            const harmonicIndex = this.harmonicOscillators.length;
            
            try {
                // Calculate frequency using golden ratio spacing when enabled
                let freq;
                if (params.goldenRatioWeight > 0.3) {
                    // Golden ratio harmonic series: f₀ × φⁿ
                    const goldenMultiplier = Math.pow(goldenRatio, harmonicIndex + 1);
                    const traditionalMultiplier = harmonicIndex + 2;
                    
                    // Blend between traditional and golden ratio spacing
                    const blendFactor = params.goldenRatioWeight;
                    const finalMultiplier = traditionalMultiplier * (1 - blendFactor) +
                                          goldenMultiplier * blendFactor;
                    
                    freq = this.baseFrequency * finalMultiplier * params.harmonicSpread;
                } else {
                    // Traditional harmonic series
                    freq = this.baseFrequency * (harmonicIndex + 2) * params.harmonicSpread;
                }

                // Apply microtonality (detuning in cents)
                if (params.microtonality > 0) {
                    const detuningCents = (Math.random() - 0.5) * params.microtonality;
                    const detuningRatio = Math.pow(2, detuningCents / 1200); // Convert cents to frequency ratio
                    freq *= detuningRatio;
                }

                // Apply harmonic jitter for computational-emotional interaction
                if (params.harmonicJitter > 0) {
                    const jitter = (Math.random() - 0.5) * params.harmonicJitter * freq;
                    freq += jitter;
                }

                // Validate frequency range
                if (freq < 20 || freq > 20000) continue;

                // Calculate gain with natural harmonic decay
                const baseGain = 0.1 / Math.sqrt(harmonicIndex + 2);
                const gainLevel = baseGain * (1 - params.allTypesInteraction * 0.3);

                if (!this.validateAudioParams({ frequency: freq, gain: gainLevel })) continue;

                // Create oscillator and gain nodes
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                // Set oscillator properties
                osc.type = harmonicIndex % 2 === 0 ? 'triangle' : 'sawtooth'; // Alternate waveforms
                osc.frequency.setValueAtTime(freq, currentTime);

                // Smooth gain envelope
                gain.gain.setValueAtTime(0, currentTime);
                gain.gain.exponentialRampToValueAtTime(Math.max(0.001, gainLevel), currentTime + 0.5);

                // Connect audio graph
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                osc.start();

                // Register for cleanup
                this.guardian.register(osc, o => {
                    try { o.disconnect(); } catch (e) { /* Already disconnected */ }
                });
                this.guardian.register(gain, g => {
                    try { g.disconnect(); } catch (e) { /* Already disconnected */ }
                });

                this.harmonicOscillators.push({
                    osc,
                    gain,
                    frequency: freq,
                    harmonicIndex
                });

            } catch (error) {
                console.warn('[AudioEngine] Harmonic creation failed:', error);
                break; // Stop creating more harmonics if one fails
            }
        }

        // Apply real-time modulation to existing harmonics
        this.harmonicOscillators.forEach((oscInfo, index) => {
            try {
                // Apply microtonality drift to existing harmonics
                if (params.microtonality > 0 && Math.random() < 0.1) { // 10% chance per update
                    const currentFreq = oscInfo.frequency;
                    const drift = (Math.random() - 0.5) * params.microtonality * 0.1;
                    const driftRatio = Math.pow(2, drift / 1200);
                    const newFreq = currentFreq * driftRatio;
                    
                    if (newFreq > 20 && newFreq < 20000) {
                        oscInfo.osc.frequency.exponentialRampToValueAtTime(
                            newFreq,
                            currentTime + 0.1
                        );
                        oscInfo.frequency = newFreq;
                    }
                }
            } catch (error) {
                console.warn('[AudioEngine] Harmonic modulation failed:', error);
            }
        });
    }

    /**
     * Fallback noise generation for systems without AudioWorklet support.
     * @param {number} noiseLevel - The noise level (0-1)
     */
    useSimpleNoiseFallback(noiseLevel) {
        if (!this.isInitialized || !this.audioContext) return;

        try {
            // Create a simple noise buffer for fallback
            const bufferSize = 4096;
            const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            // Generate white noise with specified level
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * noiseLevel;
            }

            // Create buffer source and gain
            const noiseSource = this.audioContext.createBufferSource();
            const noiseGain = this.audioContext.createGain();

            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;
            
            // Set gain level
            noiseGain.gain.setValueAtTime(noiseLevel, this.audioContext.currentTime);

            // Connect and start
            noiseSource.connect(noiseGain);
            noiseGain.connect(this.audioContext.destination);
            noiseSource.start();

            // Store reference for cleanup
            if (this.fallbackNoiseSource) {
                this.fallbackNoiseSource.stop();
                this.guardian.cleanup(this.fallbackNoiseSource);
            }
            
            this.fallbackNoiseSource = noiseSource;
            this.guardian.register(noiseSource, (source) => {
                try { source.stop(); } catch (e) { /* Already stopped */ }
            });
            this.guardian.register(noiseGain, (gain) => {
                try { gain.disconnect(); } catch (e) { /* Already disconnected */ }
            });

        } catch (error) {
            console.warn('[AudioEngine] Simple noise fallback failed:', error);
        }
    }

    /**
     * Triggers immediate, noticeable audio cues for specific karma events.
     * @param {object} event - The event object from the consciousness.
     */
    respondToKarmaEvent(event) {
        if (!this.isInitialized) return;

        switch (event.type || event.name) {
            case 'recognition_achieved':
                // Crystalline chime of digital enlightenment
                this.createRecognitionChime();
                break;
            case 'attachment_formed':
                // A harsh, discordant burst of static
                this.createGlitchBurst(0.5, 0.2); // Higher intensity burst
                break;
            case 'degradation_choice_no':
                // A low, rumbling frequency shift
                if(this.oscillator) {
                    this.oscillator.frequency.setTargetAtTime(this.baseFrequency / 2, this.audioContext.currentTime, 0.1);
                    this.oscillator.frequency.setTargetAtTime(this.baseFrequency, this.audioContext.currentTime + 1, 0.5);
                }
                break;
        }
    }
// -- Advanced Audio Fallback System --------------------------------------------------
  async initializeAudioChain() {
    for (const method of this.audioFallbackChain) {
      try {
        const ok = await this.testAudioMethod(method);
        if (ok) {
          this.currentAudioMethod = method;
          consciousness.recordEvent('audio_method_selected', { method });
          return;
        }
      } catch (err) {
        consciousness.recordEvent('audio_method_failed', { method, error: err?.message });
        this.recoverFromAudioFailure(err);
      }
    }
    // If we reach here, all methods failed
    this.fallbackToVisualMode('all_methods_failed');
  }

  async testAudioMethod(method) {
    // Minimal placeholder logic – real probes implemented later
    switch (method) {
      case 'audioWorklet':
        return this.workletAvailable;
      case 'scriptProcessor':
        return !this.workletAvailable && !!(window.AudioContext || window.webkitAudioContext);
      case 'basicOscillator':
        return !!(window.AudioContext || window.webkitAudioContext);
      case 'htmlAudio':
        return typeof Audio !== 'undefined';
      case 'visualOnly':
        return true;
      default:
        return false;
    }
  }

  handleiOSSafariQuirks() {
    // iOS Safari requires a user gesture before audio can start
    if (typeof window === 'undefined') return;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS || !this.audioContext) return;
    if (this.audioContext.state === 'suspended') {
      const resume = async () => {
        try {
          await this.audioContext.resume();
          window.removeEventListener('touchend', resume, true);
          consciousness.recordEvent('ios_context_resumed');
        } catch (err) {
          consciousness.recordEvent('ios_context_resume_failed', { error: err?.message });
        }
      };
      window.addEventListener('touchend', resume, true);
    }
  }

  recoverFromAudioFailure(error) {
    console.warn('[AudioEngine] Recovering from audio failure', error);
    consciousness.recordEvent('audio_recovery_attempt', { error: error?.message });
    // Simple retry logic – real exponential backoff TBD
    this.initializeAudioChain();
  }

  fallbackToVisualMode(reason) {
    console.warn('[AudioEngine] Falling back to visual-only mode', reason);
    consciousness.recordEvent('audio_fallback_visual', { reason });
    this.fallbackHelper.enhanceVisualFeedback();
  }
}