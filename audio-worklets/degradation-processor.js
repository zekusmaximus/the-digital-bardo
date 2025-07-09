// Advanced degradation processor with glitch effects
class DegradationProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.degradationLevel = 0;
        this.sampleCount = 0;
        
        // Listen for degradation level updates
        this.port.onmessage = (event) => {
            if (event.data.type === 'updateDegradation') {
                this.degradationLevel = event.data.level;
            }
        };
    }
    
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        
        if (input.length > 0) {
            const inputChannel = input[0];
            const outputChannel = output[0];
            
            for (let i = 0; i < outputChannel.length; i++) {
                this.sampleCount++;
                
                // Base signal (if any input)
                let sample = inputChannel ? inputChannel[i] : 0;
                
                // Add digital artifacts based on degradation
                if (this.degradationLevel > 0) {
                    // Bit crushing effect
                    const bitDepth = Math.max(1, 16 - Math.floor(this.degradationLevel * 15));
                    const step = 2 / Math.pow(2, bitDepth);
                    sample = Math.round(sample / step) * step;
                    
                    // Random dropouts
                    if (Math.random() < this.degradationLevel * 0.01) {
                        sample = 0;
                    }
                    
                    // Digital noise
                    sample += (Math.random() * 2 - 1) * this.degradationLevel * 0.1;
                }
                
                outputChannel[i] = sample;
            }
        }
        
        return true;
    }
}

registerProcessor('degradation-processor', DegradationProcessor);