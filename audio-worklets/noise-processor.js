// Noise generator worklet processor
class NoiseProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.isPlaying = true;
        this.noiseLevel = 0.1; // Default noise level
        this.degradationLevel = 0;

        this.port.onmessage = (event) => {
            if (event.data.type === 'setNoiseLevel') {
                this.noiseLevel = event.data.value;
            }
            if (event.data.type === 'setDegradationLevel') {
                this.degradationLevel = event.data.value;
            }
        };
    }
    
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        
        // Generate noise based on current karma and degradation
        output.forEach(channel => {
            for (let i = 0; i < channel.length; i++) {
                // Base noise controlled by void karma
                let noise = (Math.random() * 2 - 1) * this.noiseLevel;

                // Add degradation artifacts
                const glitchChance = this.degradationLevel * 0.05;
                if (Math.random() < glitchChance) {
                    noise *= (1 + this.degradationLevel * 10);
                }

                channel[i] = Math.max(-1, Math.min(1, noise)); // Clamp the output
            }
        });
        
        // Return true to keep processor alive
        return this.isPlaying;
    }
}

// Register the processor
registerProcessor('noise-processor', NoiseProcessor);