// Audio subsystem for the Clear Lode
export class ClearLodeAudio {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.degradationLevel = 0;
        this.baseFrequency = 528; // "Love frequency" / DNA repair
        this.audioInitialized = false;
        this.userGestureReceived = false;
        this.pendingPureTone = false;

        // Track if worklet is available
        this.workletAvailable = false;
        this.noiseWorklet = null;

        // Set up user gesture listener
        this.setupUserGestureListener();
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
            this.gainNode = this.audioContext.createGain();

            this.oscillator.type = 'sine';
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
        if (!this.oscillator || !this.audioInitialized) return;

        // Gradually introduce noise and frequency shifts
        const degradeInterval = setInterval(() => {
            this.degradationLevel += 0.05;

            // Update CSS custom property for visual degradation
            document.documentElement.style.setProperty('--degradation-level',
                this.degradationLevel);

            // Update body attribute for degradation state
            const degradationState = this.getDegradationState();
            document.body.setAttribute('data-degradation', degradationState);

            // Frequency starts to waver (only if audio is available)
            if (this.oscillator && this.audioContext) {
                try {
                    const frequencyShift = Math.sin(Date.now() * 0.001) * this.degradationLevel * 50;
                    this.oscillator.frequency.setValueAtTime(
                        this.baseFrequency + frequencyShift,
                        this.audioContext.currentTime
                    );
                } catch (error) {
                    console.warn('Audio degradation failed:', error);
                }
            }

            // Volume decreases
            const newGain = Math.max(0.05, 0.3 - (this.degradationLevel * 0.1));
            this.gainNode.gain.setValueAtTime(newGain, this.audioContext.currentTime);

            // Add digital artifacts (create noise bursts)
            if (Math.random() < this.degradationLevel * 0.1) {
                this.createGlitchBurst();
            }

            if (this.degradationLevel >= 1) {
                clearInterval(degradeInterval);
                this.completeDigitalStatic();
            }
        }, 100);
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

        // Use worklet if available, otherwise fall back
        if (this.workletAvailable) {
            await this.createWorkletNoise();
        } else {
            this.createScriptProcessorNoise();
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

    // Add method to clean up audio resources
    cleanup() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }

        if (this.noiseWorklet) {
            this.noiseWorklet.disconnect();
            this.noiseWorklet = null;
        }

        // Close audio context if needed
        if (this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}