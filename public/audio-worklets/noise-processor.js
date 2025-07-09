// AudioWorklet processor for generating digital noise
// This replaces the deprecated ScriptProcessorNode

class NoiseProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        
        // Initialize noise parameters
        this.noiseLevel = 0.1;
        this.degradationLevel = 0;
        
        // Listen for parameter updates from main thread
        this.port.onmessage = (event) => {
            const { type, value } = event.data;
            
            switch (type) {
                case 'setNoiseLevel':
                    this.noiseLevel = Math.max(0, Math.min(1, value));
                    break;
                case 'setDegradationLevel':
                    this.degradationLevel = Math.max(0, Math.min(1, value));
                    break;
            }
        };
    }
    
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        
        // Generate noise for each channel
        for (let channel = 0; channel < output.length; channel++) {
            const outputChannel = output[channel];
            
            for (let i = 0; i < outputChannel.length; i++) {
                // Generate white noise
                let noise = (Math.random() * 2 - 1) * this.noiseLevel;
                
                // Apply degradation effects
                if (this.degradationLevel > 0) {
                    // Add digital artifacts based on degradation level
                    const glitchChance = this.degradationLevel * 0.01;
                    if (Math.random() < glitchChance) {
                        // Digital spike
                        noise *= (1 + this.degradationLevel * 5);
                    }
                    
                    // Bit crushing effect
                    const bitDepth = Math.max(1, 16 - (this.degradationLevel * 12));
                    const step = Math.pow(2, bitDepth - 1);
                    noise = Math.round(noise * step) / step;
                }
                
                outputChannel[i] = noise;
            }
        }
        
        // Keep the processor alive
        return true;
    }
}

// Register the processor
registerProcessor('noise-processor', NoiseProcessor);
