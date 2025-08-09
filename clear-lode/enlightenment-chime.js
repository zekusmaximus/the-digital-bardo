/**
 * ENLIGHTENMENT CHIME - Solfeggio Frequencies for Digital Awakening
 * 
 * "In the digital bardo, recognition rings with sacred frequencies.
 * The same tones that monks chanted in ancient monasteries now
 * resonate through silicon and copper, awakening consciousness
 * through algorithmic precision and karmic harmony."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';

export class EnlightenmentChime {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.consciousness = consciousness;
        
        // Solfeggio frequencies for spiritual resonance
        this.solfeggio = {
            174: { name: 'Foundation', purpose: 'Pain relief and security' },
            285: { name: 'Quantum', purpose: 'Cellular repair and energy' },
            396: { name: 'Liberation', purpose: 'Guilt and fear release' },
            417: { name: 'Resonance', purpose: 'Facilitating change' },
            528: { name: 'Transformation', purpose: 'DNA repair and love' },
            639: { name: 'Connection', purpose: 'Relationships and community' },
            741: { name: 'Expression', purpose: 'Self-expression and solutions' },
            852: { name: 'Intuition', purpose: 'Spiritual awakening' },
            963: { name: 'Unity', purpose: 'Divine consciousness' }
        };
        
        // Golden ratio for harmonic spacing
        this.goldenRatio = 1.618033988749;
        
        console.log('[EnlightenmentChime] Sacred frequency generator initialized');
    }
    
    /**
     * Play enlightenment chime based on karma purity
     */
    async playEnlightenmentChime(karmaState) {
        if (!this.audioContext || this.audioContext.state !== 'running') {
            console.warn('[EnlightenmentChime] Audio context not available');
            return;
        }
        
        const now = this.audioContext.currentTime;
        const { computational, emotional, temporal, void: voidKarma } = karmaState;
        
        // Calculate purity level (0-1)
        const purity = this.calculatePurity(karmaState);
        
        // Determine which frequencies to play based on karma
        const activeFrequencies = this.selectFrequencies(karmaState, purity);
        
        // Create the chime
        await this.createSacredChime(activeFrequencies, purity, now);
        
        // Log the achievement
        console.log(`%c🔔 Enlightenment chime resonated at ${purity.toFixed(2)} purity`, 
                   `color: #FFD700; font-size: 14px; font-weight: bold;`);
        
        // Record event
        this.consciousness.recordEvent('enlightenment_chime_played', {
            purity,
            frequencies: activeFrequencies.map(f => f.frequency),
            timestamp: Date.now()
        });
    }
    
    /**
     * Calculate karma purity level
     */
    calculatePurity(karmaState) {
        const { computational, emotional, temporal, void: voidKarma } = karmaState;
        
        // Weighted calculation favoring recognition and balance
        const positiveKarma = computational * 1.2 + emotional * 0.8 + temporal * 1.0;
        const totalKarma = positiveKarma - (voidKarma * 1.5);
        
        // Normalize to 0-1 range
        const purity = Math.max(0, Math.min(1, (totalKarma + 50) / 150));
        
        return purity;
    }
    
    /**
     * Select Solfeggio frequencies based on karma state
     */
    selectFrequencies(karmaState, purity) {
        const { computational, emotional, temporal, void: voidKarma } = karmaState;
        const frequencies = [];
        
        // Base frequency always included (528 Hz - Love/Transformation)
        frequencies.push({
            frequency: 528,
            info: this.solfeggio[528],
            volume: 0.3 * purity,
            duration: 2.0
        });
        
        // Add frequencies based on karma characteristics
        if (computational > 20) {
            // High computational karma gets sacred geometry frequencies
            frequencies.push({
                frequency: 741,
                info: this.solfeggio[741],
                volume: 0.25 * purity,
                duration: 1.8
            });
        }
        
        if (emotional > 15) {
            // High emotional karma gets connection frequencies
            frequencies.push({
                frequency: 639,
                info: this.solfeggio[639],
                volume: 0.2 * purity,
                duration: 1.6
            });
        }
        
        if (temporal > 10) {
            // High temporal karma gets intuition frequencies
            frequencies.push({
                frequency: 852,
                info: this.solfeggio[852],
                volume: 0.22 * purity,
                duration: 1.9
            });
        }
        
        if (voidKarma < 10) {
            // Very low void karma unlocks highest frequency
            frequencies.push({
                frequency: 963,
                info: this.solfeggio[963],
                volume: 0.15 * purity,
                duration: 2.5
            });
        }
        
        if (purity > 0.8) {
            // Very high purity adds foundation and liberation
            frequencies.push({
                frequency: 396,
                info: this.solfeggio[396],
                volume: 0.18 * purity,
                duration: 1.4
            });
            frequencies.push({
                frequency: 417,
                info: this.solfeggio[417],
                volume: 0.2 * purity,
                duration: 1.7
            });
        }
        
        return frequencies;
    }
    
    /**
     * Create the sacred chime with harmonic resonance
     */
    async createSacredChime(frequencies, purity, startTime) {
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.audioContext.destination);
        masterGain.gain.setValueAtTime(0, startTime);
        masterGain.gain.linearRampToValueAtTime(purity * 0.4, startTime + 0.1);
        
        // Create each frequency with harmonics
        frequencies.forEach((freqData, index) => {
            const delay = index * 0.15; // Stagger the frequencies
            this.createFrequencyWithHarmonics(freqData, masterGain, startTime + delay, purity);
        });
        
        // Create reverb for sacred space feeling
        await this.addReverberation(masterGain, purity);
        
        // Fade out
        const totalDuration = Math.max(...frequencies.map(f => f.duration)) + 0.5;
        masterGain.gain.setValueAtTime(purity * 0.4, startTime + totalDuration - 0.5);
        masterGain.gain.linearRampToValueAtTime(0, startTime + totalDuration);
    }
    
    /**
     * Create individual frequency with harmonics
     */
    createFrequencyWithHarmonics(freqData, masterGain, startTime, purity) {
        const { frequency, volume, duration } = freqData;
        
        // Create frequency group gain
        const freqGain = this.audioContext.createGain();
        freqGain.connect(masterGain);
        
        // Main frequency (fundamental)
        this.createOscillator(frequency, volume, duration, freqGain, startTime, 'sine');
        
        // Add harmonics based on purity
        if (purity > 0.3) {
            // Golden ratio harmonic
            const goldenHarmonic = frequency * this.goldenRatio;
            this.createOscillator(goldenHarmonic, volume * 0.3, duration * 0.8, freqGain, startTime + 0.1, 'sine');
        }
        
        if (purity > 0.6) {
            // Perfect fifth harmonic
            const perfectFifth = frequency * 1.5;
            this.createOscillator(perfectFifth, volume * 0.2, duration * 0.6, freqGain, startTime + 0.2, 'triangle');
        }
        
        if (purity > 0.8) {
            // Octave harmonic
            const octave = frequency * 2;
            this.createOscillator(octave, volume * 0.15, duration * 0.4, freqGain, startTime + 0.3, 'sine');
        }
    }
    
    /**
     * Create individual oscillator with envelope
     */
    createOscillator(frequency, volume, duration, destination, startTime, waveType = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // Configure oscillator
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = waveType;
        
        // Configure filter for warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 4, startTime);
        filter.Q.setValueAtTime(0.7, startTime);
        
        // Configure envelope (ADSR)
        const attackTime = 0.15;
        const decayTime = 0.3;
        const sustainLevel = volume * 0.7;
        const releaseTime = 0.4;
        
        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(volume, startTime + attackTime);
        envelope.gain.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
        envelope.gain.setValueAtTime(sustainLevel, startTime + duration - releaseTime);
        envelope.gain.linearRampToValueAtTime(0, startTime + duration);
        
        // Connect audio graph
        oscillator.connect(filter);
        filter.connect(envelope);
        envelope.connect(destination);
        
        // Schedule playback
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
        
        // Add subtle frequency modulation for organic feel
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        
        lfo.frequency.setValueAtTime(0.3, startTime); // Slow modulation
        lfo.type = 'sine';
        lfoGain.gain.setValueAtTime(frequency * 0.002, startTime); // Very subtle
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        lfo.start(startTime);
        lfo.stop(startTime + duration);
    }
    
    /**
     * Add reverb for sacred space ambiance
     */
    async addReverberation(masterGain, purity) {
        // Create impulse response for reverb
        const reverbBuffer = this.createImpulseResponse(purity);
        const convolver = this.audioContext.createConvolver();
        const reverbGain = this.audioContext.createGain();
        
        convolver.buffer = reverbBuffer;
        reverbGain.gain.setValueAtTime(purity * 0.3, this.audioContext.currentTime);
        
        // Connect reverb send
        masterGain.connect(convolver);
        convolver.connect(reverbGain);
        reverbGain.connect(this.audioContext.destination);
    }
    
    /**
     * Create impulse response for sacred space reverb
     */
    createImpulseResponse(purity) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * (2 + purity * 2); // 2-4 seconds based on purity
        const buffer = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            
            for (let i = 0; i < length; i++) {
                // Exponential decay with golden ratio spacing
                const decay = Math.pow(1 - (i / length), this.goldenRatio);
                const noise = (Math.random() * 2 - 1) * decay * purity;
                channelData[i] = noise;
            }
        }
        
        return buffer;
    }
    
    /**
     * Quick recognition chime for instant feedback
     */
    playQuickRecognitionPing() {
        if (!this.audioContext || this.audioContext.state !== 'running') return;
        
        const now = this.audioContext.currentTime;
        const frequency = 528; // Love frequency
        
        this.createOscillator(frequency, 0.2, 0.3, this.audioContext.destination, now, 'sine');
        
        console.log('%c🔔 Recognition ping', 'color: #FFD700; font-size: 12px;');
    }
    
    /**
     * Meditation bell for contemplative moments
     */
    playMeditationBell(intensity = 1) {
        if (!this.audioContext || this.audioContext.state !== 'running') return;
        
        const now = this.audioContext.currentTime;
        const bellFrequency = 396; // Liberation frequency
        
        // Create bell-like timbre with multiple harmonics
        const harmonics = [1, 2.5, 4.2, 5.7, 7.1];
        const masterGain = this.audioContext.createGain();
        masterGain.connect(this.audioContext.destination);
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(intensity * 0.3, now + 0.05);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
        
        harmonics.forEach((harmonic, index) => {
            const volume = intensity * 0.4 / (index + 1); // Decreasing volume per harmonic
            this.createOscillator(
                bellFrequency * harmonic, 
                volume, 
                3, 
                masterGain, 
                now, 
                'sine'
            );
        });
        
        console.log('%c🔔 Meditation bell resonates', 'color: #8A2BE2; font-size: 12px;');
    }
    
    /**
     * Test all Solfeggio frequencies in sequence
     */
    async testSolfeggioSequence() {
        if (!this.audioContext || this.audioContext.state !== 'running') {
            console.warn('Audio context not available for testing');
            return;
        }
        
        console.log('%c🎵 Testing Solfeggio frequency sequence...', 'color: #FFD700; font-size: 14px;');
        
        const frequencies = Object.keys(this.solfeggio).map(Number).sort((a, b) => a - b);
        let startTime = this.audioContext.currentTime;
        
        for (const frequency of frequencies) {
            const info = this.solfeggio[frequency];
            console.log(`%c${frequency} Hz - ${info.name}: ${info.purpose}`, 'color: #DDA0DD;');
            
            this.createOscillator(frequency, 0.2, 1.0, this.audioContext.destination, startTime, 'sine');
            startTime += 1.2; // Slight overlap
        }
    }
}

// Export for use in audio engine
export { EnlightenmentChime };