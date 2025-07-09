// Audio subsystem for the Clear Lode
export class ClearLodeAudio {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillator = null;
        this.gainNode = null;
        this.degradationLevel = 0;
        this.baseFrequency = 528; // "Love frequency" / DNA repair
    }
    
    startPureTone() {
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
    }
    
    startDegradation() {
        if (!this.oscillator) return;
        
        // Gradually introduce noise and frequency shifts
        const degradeInterval = setInterval(() => {
            this.degradationLevel += 0.05;
            
            // Frequency starts to waver
            const frequencyShift = Math.sin(Date.now() * 0.001) * this.degradationLevel * 50;
            this.oscillator.frequency.setValueAtTime(
                this.baseFrequency + frequencyShift, 
                this.audioContext.currentTime
            );
            
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
    
    createGlitchBurst() {
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
        whiteNoise.stop(this.audioContext.currentTime + 0.05); // Brief burst
    }
    
    completeDigitalStatic() {
        // Replace pure tone with digital noise
        if (this.oscillator) {
            this.oscillator.stop();
        }
        
        // Create continuous static
        const noiseNode = this.createNoiseGenerator();
        noiseNode.connect(this.audioContext.destination);
    }
    
    createNoiseGenerator() {
        const bufferSize = 4096;
        const noiseNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        
        noiseNode.onaudioprocess = (e) => {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * 0.1;
            }
        };
        
        return noiseNode;
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
}