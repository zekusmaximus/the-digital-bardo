// Noise generator worklet processor
class NoiseProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.isPlaying = true;
    }
    
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        
        // Generate white noise
        output.forEach(channel => {
            for (let i = 0; i < channel.length; i++) {
                channel[i] = (Math.random() * 2 - 1) * 0.1;
            }
        });
        
        // Return true to keep processor alive
        return this.isPlaying;
    }
}

// Register the processor
registerProcessor('noise-processor', NoiseProcessor);