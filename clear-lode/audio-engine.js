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

export class ClearLodeAudio {
    /**
     * @param {object} dependencies
     * @param {import('./event-bridge.js').ClearLodeEventBridge} dependencies.eventBridge
     * @param {import('../src/consciousness/resource-guardian.js').ResourceGuardian} dependencies.guardian
     */
    constructor({ eventBridge, guardian }) {
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

        this.validateAudioParams = createKarmicValidator(audioParamsSchema);
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
            }

            this.isInitialized = true;
             console.log('[AudioEngine] AudioContext initialized successfully.');

            await this.initializeWorklet();

            // If the orchestrator requested a tone before the gesture, start it now.
            if (this.pendingPureTone) {
                this.startPureTone();
                this.pendingPureTone = false;
            }
        } catch (error) {
            console.error('[AudioEngine] AudioContext initialization failed:', error);
            this.isInitialized = false;
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
            this.gainNode.connect(this.audioContext.destination);

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
                burstGain.connect(this.audioContext.destination);

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
        noiseGain.connect(this.audioContext.destination);

        whiteNoise.start();
        whiteNoise.stop(this.audioContext.currentTime + 0.05);
    }
    
    async completeDigitalStatic() {
        console.log('🎵 [AudioEngine] Starting tone decay sequence...');

        // First, decay the pure tone over 2 seconds
        if (this.oscillator) {
            const gainNode = this.audioContext.createGain();
            this.oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

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
        // Ensure the noise worklet is running so it can respond to karma changes
        if (!this.noiseWorklet) {
            if (this.workletAvailable) {
                await this.createWorkletNoise();
            } else {
                this.createScriptProcessorNoise();
            }
        }
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
    
    achieveResonance() {
        if (this.silentMode || !this.oscillator) return;
        // Perfect recognition: the tone becomes a celestial chord
        
        const chord = [528, 639, 741]; // Solfeggio frequencies
        const oscillators = [];
        
        chord.forEach(freq => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            if (!this.validateAudioParams({ frequency: freq, gain: 0.2 })) {
                console.error(`Karmic validation failed for resonance frequency ${freq}. Skipping chord note.`);
                return;
            }
            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start();
            oscillators.push(osc);
        });
        
        // Fade out after 3 seconds
        setTimeout(() => {
            oscillators.forEach(osc => osc.stop());
        }, 3000);
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

        this.guardian.cleanupAll();
        
        // Final nullification
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.noiseWorklet = null;
        this.harmonicOscillators = [];
    }

    /**
     * Translates the current karma state into real-time audio parameter adjustments.
     * @param {object} karmaState - The full karma object from the consciousness.
     */
    updateAudioFromKarma(karmaState) {
        if (!this.isInitialized || !this.oscillator) return;

        // 1. Computational Karma -> Pitch Stability
        // Higher computational karma = more pitch instability (vibrato/detune)
        const computationalKarma = karmaState.computational || 0;
        const maxPitchWobble = 20; // Max deviation in Hz
        const pitchWobble = (computationalKarma / 100) * maxPitchWobble; // Assuming karma is 0-100 scale
        const frequencyShift = Math.sin(Date.now() * 0.005) * pitchWobble;
        const newFrequency = this.baseFrequency + frequencyShift;
        if (this.validateAudioParams({ frequency: newFrequency })) {
            this.oscillator.frequency.setTargetAtTime(newFrequency, this.audioContext.currentTime, 0.1);
        }

        // 2. Emotional Karma -> Harmonic Richness
        // Higher emotional karma = more complex harmonics
        const emotionalKarma = karmaState.emotional || 0;
        const targetHarmonics = Math.floor((emotionalKarma / 100) * 4); // 0 to 4 harmonics
        this.updateHarmonics(targetHarmonics);

        // 3. Void Karma -> Background Static Volume
        // Higher void karma = louder static noise
        const voidKarma = karmaState.void || 0;
        const noiseLevel = Math.min(0.5, (voidKarma / 100) * 0.5); // Cap noise level
        if (this.noiseWorklet && this.noiseWorklet.port) {
            this.noiseWorklet.port.postMessage({
                type: 'setNoiseLevel',
                value: noiseLevel
            });
        }
    }

    /**
     * Manages the creation and destruction of harmonic oscillators based on emotional karma.
     * @param {number} targetCount - The desired number of harmonic oscillators.
     */
    updateHarmonics(targetCount) {
        // Remove excess harmonics
        while (this.harmonicOscillators.length > targetCount) {
            const oscInfo = this.harmonicOscillators.pop();
            oscInfo.gain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.5);
            oscInfo.osc.stop(this.audioContext.currentTime + 1);
            this.guardian.cleanup(oscInfo.osc);
            this.guardian.cleanup(oscInfo.gain);
        }

        // Add needed harmonics
        while (this.harmonicOscillators.length < targetCount) {
            const harmonicNumber = this.harmonicOscillators.length + 2; // Start with 2nd harmonic
            const freq = this.baseFrequency * harmonicNumber;
            const gainLevel = 0.1 / harmonicNumber; // Higher harmonics are quieter

            if (!this.validateAudioParams({ frequency: freq, gain: gainLevel})) continue;

            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.setTargetAtTime(gainLevel, this.audioContext.currentTime, 0.5);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();

            this.guardian.register(osc, o => o.disconnect());
            this.guardian.register(gain, g => g.disconnect());
            this.harmonicOscillators.push({ osc, gain });
        }
    }

    /**
     * Triggers immediate, noticeable audio cues for specific karma events.
     * @param {object} event - The event object from the consciousness.
     */
    respondToKarmaEvent(event) {
        if (!this.isInitialized) return;

        switch (event.name) {
            case 'recognition_achieved':
                // A clear, resonant chime
                this.achieveResonance();
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
}