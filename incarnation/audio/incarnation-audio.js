/**
 * INCARNATION AUDIO ENGINE - The Soundtrack to Bureaucratic Purgatory
 * 
 * "Every great suffering needs its soundtrack. The DMV of the afterlife
 * comes complete with hold music that slowly drives you insane, notification
 * sounds that trigger Pavlovian responses, and the ambient hum of fluorescent
 * lights and dying dreams.
 * 
 * This is the audio that plays while you wait for eternity to process
 * your paperwork. It's designed to be just pleasant enough that you don't
 * complain, but just annoying enough that you never forget where you are."
 */

import { ResourceGuardian } from '../../src/consciousness/resource-guardian.js';

export class IncarnationAudioEngine {
    constructor() {
        this.guardian = new ResourceGuardian();
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
        
        // Audio state
        this.currentlyPlaying = new Map(); // Track active audio sources
        this.audioVolume = 0.3; // Conservative default
        this.mutedByUser = false;
        
        // Hold music generation parameters
        this.holdMusicParams = {
            baseFreq: 440,           // A4
            tempo: 72,               // Slow, bureaucratic tempo
            volume: 0.15,            // Quiet but persistent
            fadeInDuration: 2000,    // Gradual entry
            loopDuration: 45000      // 45 second loop (eternity feels shorter)
        };
        
        // Bureaucratic sound effects
        this.soundEffects = {
            formSubmit: {
                frequencies: [800, 1200, 600],
                duration: 500,
                volume: 0.2
            },
            errorBeep: {
                frequencies: [300, 280, 260],
                duration: 200,
                volume: 0.3
            },
            queueAdvance: {
                frequencies: [600, 800],
                duration: 300,
                volume: 0.15
            },
            ticketPrint: {
                frequencies: [1000, 1200, 1400, 1000],
                duration: 800,
                volume: 0.25
            },
            loadingComplete: {
                frequencies: [400, 600, 800, 1000],
                duration: 1000,
                volume: 0.2
            },
            stamp: {
                frequencies: [200],
                duration: 100,
                volume: 0.4
            }
        };
        
        // Ambient bureaucracy sounds
        this.ambientSounds = {
            fluorescentHum: {
                frequency: 120,     // 60Hz AC hum doubled
                volume: 0.05,       // Barely audible but persistent
                modulation: 0.3     // Slight flickering
            },
            keyboardClacking: {
                frequencies: [800, 1200, 600, 900],
                interval: 1200,     // Average typing speed
                volume: 0.08,
                variation: 0.4      // Rhythm variation
            },
            printerWhir: {
                baseFreq: 150,
                volume: 0.06,
                duration: 3000,     // Long bureaucratic prints
                interval: 15000     // Every 15 seconds
            },
            phoneRing: {
                frequencies: [800, 1000],
                volume: 0.12,
                ringDuration: 500,
                intervalBetweenRings: 1000,
                totalRings: 4,
                frequency: 0.1      // 10% chance per minute
            }
        };
        
        console.log('[IncarnationAudio] Bureaucratic soundtrack engine initialized');
    }
    
    /**
     * Initialize the Web Audio API context
     */
    async init() {
        try {
            // Create audio context with proper user gesture handling
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 44100,
                latencyHint: 'interactive'
            });
            
            // Handle audio context state
            if (this.audioContext.state === 'suspended') {
                console.log('[IncarnationAudio] Audio context suspended, waiting for user interaction');
            }
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.setValueAtTime(this.audioVolume, this.audioContext.currentTime);
            
            // Register for cleanup
            this.guardian.register(this.audioContext, () => this.audioContext.close());
            
            this.isInitialized = true;
            console.log('[IncarnationAudio] Audio context initialized successfully');
            
            return true;
        } catch (error) {
            console.error('[IncarnationAudio] Failed to initialize audio:', error);
            return false;
        }
    }
    
    /**
     * Ensure audio context is running (handle browser autoplay policies)
     */
    async ensureAudioContext() {
        if (!this.audioContext) {
            await this.init();
        }
        
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('[IncarnationAudio] Audio context resumed');
            } catch (error) {
                console.error('[IncarnationAudio] Failed to resume audio context:', error);
                return false;
            }
        }
        
        return this.audioContext.state === 'running';
    }
    
    /**
     * Generate and play eternal hold music
     */
    async playHoldMusic() {
        if (!await this.ensureAudioContext()) {
            console.warn('[IncarnationAudio] Cannot play hold music - audio context not available');
            return;
        }
        
        // Stop any existing hold music
        this.stopHoldMusic();
        
        try {
            const holdMusicSource = this.generateHoldMusicLoop();
            this.currentlyPlaying.set('holdMusic', holdMusicSource);
            
            console.log('[IncarnationAudio] Starting eternal hold music');
            
            // Auto-restart if it somehow ends (it shouldn't)
            holdMusicSource.onended = () => {
                if (this.currentlyPlaying.has('holdMusic')) {
                    console.log('[IncarnationAudio] Hold music ended unexpectedly, restarting...');
                    setTimeout(() => this.playHoldMusic(), 1000);
                }
            };
            
        } catch (error) {
            console.error('[IncarnationAudio] Failed to generate hold music:', error);
        }
    }
    
    /**
     * Generate the hold music loop using Web Audio API
     */
    generateHoldMusicLoop() {
        const now = this.audioContext.currentTime;
        const { baseFreq, tempo, volume, fadeInDuration, loopDuration } = this.holdMusicParams;
        
        // Create gain node for hold music
        const holdGain = this.audioContext.createGain();
        holdGain.connect(this.masterGain);
        holdGain.gain.setValueAtTime(0, now);
        holdGain.gain.linearRampToValueAtTime(volume, now + (fadeInDuration / 1000));
        
        // Generate a simple, mind-numbing melody
        const melody = [
            { freq: baseFreq,      duration: 1000, delay: 0 },      // A
            { freq: baseFreq * 1.25, duration: 800,  delay: 1000 },  // C#
            { freq: baseFreq * 1.5,  duration: 1200, delay: 1800 },  // E
            { freq: baseFreq * 1.33, duration: 800,  delay: 3000 },  // D
            { freq: baseFreq,        duration: 1600, delay: 3800 },  // A
            { freq: baseFreq * 0.75, duration: 1200, delay: 5400 },  // D below
            { freq: baseFreq * 1.125,duration: 1000, delay: 6600 },  // B
            { freq: baseFreq,        duration: 2000, delay: 7600 }   // A (resolution)
        ];
        
        // Create oscillators for each note
        melody.forEach(note => {
            this.scheduleHoldMusicNote(holdGain, note.freq, note.duration, now + (note.delay / 1000));
        });
        
        // Schedule the next loop
        const nextLoopTime = now + (loopDuration / 1000);
        setTimeout(() => {
            if (this.currentlyPlaying.has('holdMusic')) {
                this.generateHoldMusicLoop(); // Recursive eternal loop
            }
        }, loopDuration);
        
        return { onended: null }; // Placeholder for consistent interface
    }
    
    /**
     * Schedule individual hold music note
     */
    scheduleHoldMusicNote(gainNode, frequency, duration, startTime) {
        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();
        
        // Configure oscillator
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine'; // Smooth, inoffensive sine waves
        
        // Configure note envelope (ADSR)
        const attackTime = 0.1;
        const decayTime = 0.2;
        const sustainLevel = 0.6;
        const releaseTime = 0.3;
        const noteEnd = startTime + (duration / 1000);
        
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(1, startTime + attackTime);
        noteGain.gain.linearRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
        noteGain.gain.setValueAtTime(sustainLevel, noteEnd - releaseTime);
        noteGain.gain.linearRampToValueAtTime(0, noteEnd);
        
        // Connect audio graph
        oscillator.connect(noteGain);
        noteGain.connect(gainNode);
        
        // Schedule playback
        oscillator.start(startTime);
        oscillator.stop(noteEnd);
        
        // Register for cleanup
        this.guardian.register(oscillator, () => {
            try { oscillator.stop(); } catch (e) { /* Already stopped */ }
        });
    }
    
    /**
     * Stop hold music
     */
    stopHoldMusic() {
        if (this.currentlyPlaying.has('holdMusic')) {
            this.currentlyPlaying.delete('holdMusic');
            console.log('[IncarnationAudio] Hold music stopped');
        }
    }
    
    /**
     * Play bureaucratic sound effects
     */
    async playSound(soundName, options = {}) {
        if (!await this.ensureAudioContext()) return;
        
        const soundDef = this.soundEffects[soundName];
        if (!soundDef) {
            console.warn(`[IncarnationAudio] Unknown sound: ${soundName}`);
            return;
        }
        
        try {
            const volume = options.volume || soundDef.volume;
            const duration = options.duration || soundDef.duration;
            
            if (soundDef.frequencies.length === 1) {
                // Single frequency sound
                this.playSingleTone(soundDef.frequencies[0], duration, volume);
            } else {
                // Multi-frequency sequence
                this.playToneSequence(soundDef.frequencies, duration, volume);
            }
            
            console.log(`[IncarnationAudio] Playing sound: ${soundName}`);
            
        } catch (error) {
            console.error(`[IncarnationAudio] Failed to play sound ${soundName}:`, error);
        }
    }
    
    /**
     * Play a single tone
     */
    playSingleTone(frequency, duration, volume) {
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(frequency, now);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, now + (duration / 1000));
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start(now);
        oscillator.stop(now + (duration / 1000));
        
        this.guardian.register(oscillator, () => {
            try { oscillator.stop(); } catch (e) { /* Already stopped */ }
        });
    }
    
    /**
     * Play a sequence of tones
     */
    playToneSequence(frequencies, totalDuration, volume) {
        const toneDuration = totalDuration / frequencies.length;
        
        frequencies.forEach((frequency, index) => {
            const delay = index * toneDuration;
            setTimeout(() => {
                if (this.audioContext.state === 'running') {
                    this.playSingleTone(frequency, toneDuration, volume);
                }
            }, delay);
        });
    }
    
    /**
     * Start ambient bureaucratic sounds
     */
    async startAmbientSounds() {
        if (!await this.ensureAudioContext()) return;
        
        console.log('[IncarnationAudio] Starting ambient bureaucratic atmosphere');
        
        // Fluorescent hum (continuous)
        this.startFluorescentHum();
        
        // Periodic keyboard clacking
        this.startKeyboardClacking();
        
        // Occasional printer sounds
        this.startPrinterSounds();
        
        // Rare phone rings (that nobody answers)
        this.startPhoneRings();
    }
    
    /**
     * Start continuous fluorescent light hum
     */
    startFluorescentHum() {
        const { frequency, volume, modulation } = this.ambientSounds.fluorescentHum;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const lfo = this.audioContext.createOscillator(); // Low frequency oscillator for modulation
        const lfoGain = this.audioContext.createGain();
        
        // Main hum
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Modulation for flickering effect
        lfo.frequency.setValueAtTime(0.3, this.audioContext.currentTime); // Slow flicker
        lfo.type = 'sine';
        lfoGain.gain.setValueAtTime(modulation, this.audioContext.currentTime);
        
        // Connect modulation
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        
        // Set base gain
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        
        // Connect main audio path
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // Start oscillators
        oscillator.start();
        lfo.start();
        
        // Store for cleanup
        this.currentlyPlaying.set('fluorescentHum', { oscillator, lfo });
        
        this.guardian.register(oscillator, () => {
            try { oscillator.stop(); } catch (e) { /* Already stopped */ }
        });
        this.guardian.register(lfo, () => {
            try { lfo.stop(); } catch (e) { /* Already stopped */ }
        });
    }
    
    /**
     * Start periodic keyboard clacking sounds
     */
    startKeyboardClacking() {
        const { frequencies, interval, volume, variation } = this.ambientSounds.keyboardClacking;
        
        const playKeystroke = () => {
            if (!this.audioContext || this.audioContext.state !== 'running') return;
            
            const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
            this.playSingleTone(freq, 50, volume);
            
            // Schedule next keystroke with variation
            const nextInterval = interval * (1 + (Math.random() - 0.5) * variation);
            setTimeout(playKeystroke, nextInterval);
        };
        
        // Start the recursive scheduling
        setTimeout(playKeystroke, Math.random() * interval);
    }
    
    /**
     * Start periodic printer sounds
     */
    startPrinterSounds() {
        const { baseFreq, volume, duration, interval } = this.ambientSounds.printerWhir;
        
        const playPrinterSound = () => {
            if (!this.audioContext || this.audioContext.state !== 'running') return;
            
            // Create printer whir sound
            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(baseFreq, now);
            oscillator.frequency.linearRampToValueAtTime(baseFreq * 0.7, now + (duration / 1000));
            oscillator.type = 'sawtooth'; // Mechanical sound
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(volume, now + 0.1);
            gainNode.gain.setValueAtTime(volume * 0.8, now + (duration / 1000) - 0.2);
            gainNode.gain.linearRampToValueAtTime(0, now + (duration / 1000));
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + (duration / 1000));
            
            this.guardian.register(oscillator, () => {
                try { oscillator.stop(); } catch (e) { /* Already stopped */ }
            });
            
            // Schedule next printer sound
            setTimeout(playPrinterSound, interval * (0.8 + Math.random() * 0.4));
        };
        
        // Start with random delay
        setTimeout(playPrinterSound, Math.random() * interval);
    }
    
    /**
     * Start occasional phone rings (that nobody answers)
     */
    startPhoneRings() {
        const { frequencies, volume, ringDuration, intervalBetweenRings, totalRings, frequency } = this.ambientSounds.phoneRing;
        
        const playPhoneRing = () => {
            if (!this.audioContext || this.audioContext.state !== 'running') return;
            
            // Only ring occasionally
            if (Math.random() > frequency) {
                setTimeout(playPhoneRing, 60000); // Check again in a minute
                return;
            }
            
            let ringCount = 0;
            const ringTimer = setInterval(() => {
                // Alternate between two frequencies for classic ring sound
                const freq = frequencies[ringCount % frequencies.length];
                this.playSingleTone(freq, ringDuration, volume);
                
                ringCount++;
                if (ringCount >= totalRings) {
                    clearInterval(ringTimer);
                    // Nobody answered, try again later
                    setTimeout(playPhoneRing, 300000 + Math.random() * 300000); // 5-10 minutes
                }
            }, ringDuration + intervalBetweenRings);
        };
        
        // Start with random delay
        setTimeout(playPhoneRing, Math.random() * 120000); // 0-2 minutes
    }
    
    /**
     * Stop all ambient sounds
     */
    stopAmbientSounds() {
        console.log('[IncarnationAudio] Stopping ambient sounds');
        
        // Stop fluorescent hum
        if (this.currentlyPlaying.has('fluorescentHum')) {
            const { oscillator, lfo } = this.currentlyPlaying.get('fluorescentHum');
            try {
                oscillator.stop();
                lfo.stop();
            } catch (e) {
                // Already stopped
            }
            this.currentlyPlaying.delete('fluorescentHum');
        }
    }
    
    /**
     * Set master volume
     */
    setVolume(volume) {
        if (!this.masterGain) return;
        
        this.audioVolume = Math.max(0, Math.min(1, volume));
        this.masterGain.gain.setValueAtTime(
            this.mutedByUser ? 0 : this.audioVolume, 
            this.audioContext.currentTime
        );
        
        console.log(`[IncarnationAudio] Volume set to ${this.audioVolume}`);
    }
    
    /**
     * Mute/unmute audio
     */
    toggleMute() {
        this.mutedByUser = !this.mutedByUser;
        
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(
                this.mutedByUser ? 0 : this.audioVolume,
                this.audioContext.currentTime
            );
        }
        
        console.log(`[IncarnationAudio] Audio ${this.mutedByUser ? 'muted' : 'unmuted'}`);
        return !this.mutedByUser; // Return current state (playing = true)
    }
    
    /**
     * Play notification sound for form events
     */
    async playFormNotification(type) {
        const soundMap = {
            'submit': 'formSubmit',
            'error': 'errorBeep', 
            'advance': 'queueAdvance',
            'print': 'ticketPrint',
            'complete': 'loadingComplete',
            'stamp': 'stamp'
        };
        
        const soundName = soundMap[type];
        if (soundName) {
            await this.playSound(soundName);
        }
    }
    
    /**
     * Create audio UI controls
     */
    createAudioControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'audio-controls';
        controlsContainer.innerHTML = `
            <div class="audio-control-panel">
                <button id="audio-mute-toggle" class="audio-control-btn" title="Toggle Audio">
                    🔊
                </button>
                <input type="range" id="audio-volume-slider" 
                       class="audio-volume-slider" 
                       min="0" max="100" value="${this.audioVolume * 100}"
                       title="Volume">
                <span class="audio-status">Hold Music: Active</span>
            </div>
        `;
        
        // Add event listeners
        const muteToggle = controlsContainer.querySelector('#audio-mute-toggle');
        const volumeSlider = controlsContainer.querySelector('#audio-volume-slider');
        const statusSpan = controlsContainer.querySelector('.audio-status');
        
        muteToggle.addEventListener('click', () => {
            const isPlaying = this.toggleMute();
            muteToggle.textContent = isPlaying ? '🔊' : '🔇';
            statusSpan.textContent = `Hold Music: ${isPlaying ? 'Active' : 'Muted'}`;
        });
        
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.setVolume(volume);
        });
        
        return controlsContainer;
    }
    
    /**
     * Get current audio status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            audioContextState: this.audioContext?.state,
            volume: this.audioVolume,
            muted: this.mutedByUser,
            activeAudioSources: this.currentlyPlaying.size,
            holdMusicActive: this.currentlyPlaying.has('holdMusic')
        };
    }
    
    /**
     * Clean up all audio resources
     */
    destroy() {
        console.log('[IncarnationAudio] Shutting down bureaucratic audio systems...');
        
        // Stop all playing audio
        this.stopHoldMusic();
        this.stopAmbientSounds();
        
        // Clear all active sources
        this.currentlyPlaying.clear();
        
        // Clean up all registered resources
        this.guardian.cleanupAll();
        
        // Close audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(e => {
                console.error('Error closing audio context:', e);
            });
        }
        
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
        
        console.log('[IncarnationAudio] Audio systems terminated');
    }
}

// Export for use in incarnation engine
if (typeof window !== 'undefined') {
    window.IncarnationAudioEngine = IncarnationAudioEngine;
    
    // Debug mode exposure
    if (window.location?.search?.includes('debug')) {
        window.audio = {
            testHoldMusic: () => {
                const engine = new IncarnationAudioEngine();
                engine.init().then(() => engine.playHoldMusic());
            },
            testSound: (soundName) => {
                const engine = new IncarnationAudioEngine();
                engine.init().then(() => engine.playSound(soundName));
            }
        };
    }
}