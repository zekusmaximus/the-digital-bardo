// Audio subsystem for the Clear Lode
import { createKarmicValidator, audioParamsSchema } from '../src/security/karmic-validation.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

export class ClearLodeAudio {
    constructor() {
        this.guardian = new ResourceGuardian();
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.degradationLevel = 0;
        this.baseFrequency = 528; // "Love frequency" / DNA repair
        this.audioInitialized = false;
        this.userGestureReceived = false;
        this.pendingPureTone = false;
        this.harmonicOscillators = [];

        // Track if worklet is available
        this.workletAvailable = false;
        this.noiseWorklet = null;

        // Set up user gesture listener
        this.setupUserGestureListener();

        // Karmic Validator for Audio Params
        this.validateAudioParams = createKarmicValidator(audioParamsSchema);

        // Subscribe to karma state changes
        consciousness.subscribe('karma', (newKarmaState) => {
            if (this.audioInitialized) {
                this.updateAudioFromKarma(newKarmaState);
            }
        });

        // Subscribe to specific, impactful events
        consciousness.subscribe('lastEvent', (event) => {
            if (this.audioInitialized && event) {
                this.respondToKarmaEvent(event);
            }
        });
    }

    setupUserGestureListener() {
        const initAudio = async () => {
            if (!this.userGestureReceived) {
                this.userGestureReceived = true;
                await this.initializeAudioContext();

                // Remove listeners after first gesture
                document.removeEventListener('click', initAudio);
                document.removeEventListener('keydown', initAudio);
                document.removeEventListener('touchstart', initAudio);
            }
        };

        // Listen for any user gesture
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
        document.addEventListener('touchstart', initAudio);
    }

    async initializeAudioContext() {
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

            this.audioInitialized = true;
            console.log('AudioContext initialized successfully');

            // Initialize worklet support
            await this.initializeWorklet();

            // Start pure tone if it was requested before audio was ready
            if (this.pendingPureTone) {
                await this.startPureTone();
            }
        } catch (error) {
            console.warn('AudioContext initialization failed:', error);
            this.audioInitialized = false;
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
        if (!this.audioInitialized) {
            console.log('Audio not initialized - queueing pure tone start');
            this.pendingPureTone = true;
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
        console.log('🔊 Starting audio degradation...');
        // This function is now a trigger. The actual degradation is handled by updateAudioFromKarma.
        
        // If audio isn't initialized, try to start it first
        if (!this.audioInitialized) {
            console.log('Audio not initialized - attempting to initialize for degradation');
            this.initializeAudioContext().then(() => {
                if (this.audioInitialized && !this.oscillator) {
                    console.log('Starting pure tone for degradation');
                    this.startPureTone().then(() => this.completeDigitalStatic());
                } else if (this.audioInitialized) {
                    this.completeDigitalStatic();
                }
            });
        } else {
             this.completeDigitalStatic();
        }

        // The old interval-based degradation is removed. Karma is now the driver.
    }
    
    // Enhanced glitch burst using worklet if available
    async createGlitchBurst() {
        if (!this.audioInitialized) return;

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
        // Replace pure tone with digital noise
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }

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
        if (!this.audioInitialized || !this.audioContext) return;

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
        if (!this.audioInitialized || !this.audioContext) return;

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
        // Perfect recognition: the tone becomes a celestial chord
        if (!this.oscillator) return;
        
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
        if (!this.audioInitialized || !this.oscillator) return;

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
        if (!this.audioInitialized) return;

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