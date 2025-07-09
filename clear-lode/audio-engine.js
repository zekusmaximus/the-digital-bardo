// Audio subsystem for the Clear Lode
export class ClearLodeAudio {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillator = null;
        this.gainNode = null;
        this.degradationLevel = 0;
        this.baseFrequency = 528; // "Love frequency" / DNA repair
        
        // Track if worklet is available
        this.workletAvailable = false;
        this.noiseWorklet = null;
        
        // Initialize worklet support
        this.initializeWorklet();
    }
    
    async initializeWorklet() {
        try {
            // Check if AudioWorklet is supported
            if (this.audioContext.audioWorklet) {
                await this.audioContext.audioWorklet.addModule('/audio-worklets/noise-processor.js');
                this.workletAvailable = true;
                console.log('AudioWorklet initialized - enhanced performance available');
            }
        } catch (error) {
            console.log('AudioWorklet not available, falling back to ScriptProcessor');
            this.workletAvailable = false;
        }
    }
    
    // ... existing methods (startPureTone, startDegradation, etc.) ...
    
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
        try {
            // Create noise using AudioWorklet (better performance)
            this.noiseWorklet = new AudioWorkletNode(this.audioContext, 'noise-processor');
            
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
        // Fallback to ScriptProcessor (deprecated but widely supported)
        const bufferSize = 4096;
        const noiseNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        
        noiseNode.onaudioprocess = (e) => {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * 0.1;
            }
        };
        
        // Create gain node for volume control
        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        // Connect the nodes
        noiseNode.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);
        
        console.log('Digital static achieved through ScriptProcessor (legacy)');
    }
    
    // Enhanced glitch burst using worklet if available
    async createGlitchBurst() {
        if (this.workletAvailable) {
            // Create temporary worklet noise burst
            const burstWorklet = new AudioWorkletNode(this.audioContext, 'noise-processor');
            const burstGain = this.audioContext.createGain();
            
            burstGain.gain.setValueAtTime(0.1 * this.degradationLevel, this.audioContext.currentTime);
            burstGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);
            
            burstWorklet.connect(burstGain);
            burstGain.connect(this.audioContext.destination);
            
            // Stop after burst
            setTimeout(() => {
                burstWorklet.disconnect();
            }, 50);
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
    
    // ... rest of existing methods ...
}