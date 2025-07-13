// Enhanced Noise Processor with Dynamic Coloration and Granular Processing
// Supports white, pink, and brown noise with smooth transitions and time dissolution effects

class NoiseProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        
        // Core parameters from karma-to-audio system
        this.noiseLevel = 0;        // 0-1 from void karma sigmoid curve
        this.noiseColor = 0;        // 0=white, 0.5=pink, 1=brown
        this.grainSize = 0.1;       // 0.01-0.1 seconds for time dissolution
        
        // Smooth transition parameters
        this.smoothingFactor = 0.95; // Exponential smoothing coefficient
        this.smoothedNoiseLevel = 0;
        this.smoothedNoiseColor = 0;
        this.smoothedGrainSize = 0.1;
        
        // Pink noise state (Voss-McCartney algorithm)
        this.pinkNoiseState = new Array(16).fill(0);
        this.pinkNoiseCounter = 0;
        
        // Brown noise state (Brownian motion)
        this.brownNoiseState = 0;
        
        // Granular processing state
        this.grainPosition = 0;
        this.grainPhase = 1; // 1 or -1 for phase inversion
        this.sampleRate = 44100; // Will be updated from context
        
        // Message handling for parameter updates
        this.port.onmessage = (event) => {
            this.handleMessage(event.data);
        };
    }
    
    /**
     * Handle incoming parameter messages from audio engine
     */
    handleMessage(data) {
        try {
            switch (data.type) {
                case 'updateNoise':
                    this.noiseLevel = this.clamp(data.noiseLevel || 0, 0, 1);
                    this.noiseColor = this.clamp(data.noiseColor || 0, 0, 1);
                    this.grainSize = this.clamp(data.grainSize || 0.1, 0.01, 0.1);
                    break;
                    
                case 'setSampleRate':
                    this.sampleRate = data.sampleRate || 44100;
                    break;
                    
                // Legacy support for existing audio engine
                case 'setNoiseLevel':
                    this.noiseLevel = this.clamp(data.value || 0, 0, 1);
                    break;
                    
                case 'setDegradationLevel':
                    // Map degradation to noise color for backward compatibility
                    this.noiseColor = this.clamp(data.value || 0, 0, 1);
                    break;
            }
        } catch (error) {
            // Graceful error handling - continue with current parameters
            console.warn('NoiseProcessor: Parameter update error:', error);
        }
    }
    
    /**
     * Main audio processing loop
     */
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        
        if (!output || output.length === 0) {
            return true;
        }
        
        // Update sample rate from context if available
        if (this.sampleRate !== sampleRate) {
            this.sampleRate = sampleRate;
        }
        
        // Apply exponential smoothing for organic parameter transitions
        this.updateSmoothedParameters();
        
        // Process each channel
        for (let channel = 0; channel < output.length; channel++) {
            const outputChannel = output[channel];
            this.processChannel(outputChannel);
        }
        
        return true; // Keep processor alive
    }
    
    /**
     * Update smoothed parameters using exponential smoothing
     */
    updateSmoothedParameters() {
        const alpha = 1 - this.smoothingFactor;
        
        this.smoothedNoiseLevel = this.smoothedNoiseLevel * this.smoothingFactor + 
                                 this.noiseLevel * alpha;
        this.smoothedNoiseColor = this.smoothedNoiseColor * this.smoothingFactor + 
                                 this.noiseColor * alpha;
        this.smoothedGrainSize = this.smoothedGrainSize * this.smoothingFactor + 
                                this.grainSize * alpha;
    }
    
    /**
     * Process a single audio channel
     */
    processChannel(outputChannel) {
        const bufferLength = outputChannel.length;
        const grainSamples = Math.floor(this.smoothedGrainSize * this.sampleRate);
        
        for (let i = 0; i < bufferLength; i++) {
            // Generate colored noise sample
            const whiteSample = this.generateWhiteNoise();
            const pinkSample = this.generatePinkNoise();
            const brownSample = this.generateBrownNoise();
            
            // Mix noise colors based on smoothed color parameter
            const mixedNoise = this.mixNoiseColors(
                whiteSample, 
                pinkSample, 
                brownSample, 
                this.smoothedNoiseColor
            );
            
            // Apply granular processing for time dissolution
            const grainedNoise = this.applyGranularProcessing(
                mixedNoise, 
                grainSamples
            );
            
            // Apply smoothed noise level and clamp output
            outputChannel[i] = this.clamp(
                grainedNoise * this.smoothedNoiseLevel, 
                -1, 
                1
            );
        }
    }
    
    /**
     * Generate white noise sample
     */
    generateWhiteNoise() {
        return Math.random() * 2 - 1;
    }
    
    /**
     * Generate pink noise using Voss-McCartney algorithm
     * Implements 16-state filter for proper 1/f frequency response
     */
    generatePinkNoise() {
        let output = 0;
        
        // Update states based on bit pattern
        for (let i = 0; i < 16; i++) {
            if ((this.pinkNoiseCounter & (1 << i)) !== 0) {
                this.pinkNoiseState[i] = Math.random() * 2 - 1;
            }
            output += this.pinkNoiseState[i];
        }
        
        this.pinkNoiseCounter++;
        
        // Normalize and return
        return output / 16;
    }
    
    /**
     * Generate brown noise using Brownian motion
     * Implements integrated white noise with drift prevention
     */
    generateBrownNoise() {
        // Integration with drift prevention
        const whiteNoise = Math.random() * 2 - 1;
        this.brownNoiseState += whiteNoise * 0.02; // Integration constant
        this.brownNoiseState *= 0.997; // Drift prevention (decay factor)
        
        // Clamp to prevent unbounded growth
        this.brownNoiseState = this.clamp(this.brownNoiseState, -1, 1);
        
        return this.brownNoiseState;
    }
    
    /**
     * Mix noise colors with smooth transitions
     * Implements three-zone mixing: white→pink→brown
     */
    mixNoiseColors(white, pink, brown, colorParam) {
        if (colorParam < 0.33) {
            // White to pink transition (0 to 0.33)
            const mix = colorParam * 3;
            return white * (1 - mix) + pink * mix;
        } else if (colorParam < 0.67) {
            // Pink to brown transition (0.33 to 0.67)
            const mix = (colorParam - 0.33) * 3;
            return pink * (1 - mix) + brown * mix;
        } else {
            // Mostly brown with some pink (0.67 to 1.0)
            const mix = (colorParam - 0.67) * 3;
            return brown * (0.7 + mix * 0.3) + pink * (0.3 - mix * 0.3);
        }
    }
    
    /**
     * Apply granular processing for time dissolution effects
     * Creates grain envelopes and discontinuities for reality breakdown
     */
    applyGranularProcessing(sample, grainSamples) {
        // Skip granular processing if grain size is at maximum (minimal dissolution)
        if (grainSamples >= this.sampleRate * 0.09) {
            return sample;
        }
        
        // Calculate grain envelope using sine wave windowing
        const grainProgress = this.grainPosition / grainSamples;
        const envelope = Math.sin(grainProgress * Math.PI);
        
        // Apply grain envelope
        let processedSample = sample * envelope;
        
        // Apply phase inversion for discontinuity effects
        processedSample *= this.grainPhase;
        
        // Update grain position
        this.grainPosition++;
        
        // Check for grain boundary
        if (this.grainPosition >= grainSamples) {
            this.grainPosition = 0;
            
            // 50% chance of phase inversion for discontinuity generation
            if (Math.random() < 0.5) {
                this.grainPhase *= -1;
            }
        }
        
        return processedSample;
    }
    
    /**
     * Utility function to clamp values to a range
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
}

// Register the enhanced processor
registerProcessor('noise-processor', NoiseProcessor);