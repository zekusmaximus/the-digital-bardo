/**
 * ARCHIVE AUDIO ENGINE - Crystalline Soundscape of Digital Memory
 * 
 * "In the Archive, sound itself becomes crystalline—each tone a faceted memory,
 * each harmonic a refracted emotion. The audio landscape shifts with attachment,
 * growing warmer and more seductive as the user lingers, until the very air
 * hums with the golden frequency of digital desire.
 * 
 * Here, silence is not absence but potential—the moment before memory speaks,
 * the breath before the daemon whispers, the pause before temptation blooms
 * into irresistible sonic embrace."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class ArchiveAudioEngine {
    constructor(dependencies = {}) {
        this.consciousness = dependencies.consciousness || consciousness;
        this.eventBridge = dependencies.eventBridge;
        this.guardian = new ResourceGuardian();
        
        // Web Audio API setup
        this.audioContext = null;
        this.masterGain = null;
        this.analyser = null;
        
        // Core sound generators
        this.ambientDrone = null;
        this.crystallineChimes = new Map();
        this.memoryResonators = new Map();
        this.attachmentHum = null;
        
        // Audio parameters
        this.config = {
            masterVolume: 0.4,
            ambientVolume: 0.6,
            chimeVolume: 0.8,
            resonatorVolume: 0.3,
            attachmentVolume: 0.5,
            spatialRange: 100, // Distance for 3D audio effects
            
            frequencies: {
                baseDrone: 110,     // Low A - fundamental frequency
                crystalline: [261.63, 329.63, 392.00, 523.25], // C, E, G, C (crystal harmonics)
                memory: [174, 285, 396, 417, 528, 639, 741, 852], // Solfeggio healing frequencies
                attachment: 40,     // Very low subharmonic for seductive pull
                corruption: [66.17, 72.83]  // Dissonant low frequencies
            },
            
            effects: {
                reverb: {
                    roomSize: 0.8,
                    damping: 0.3,
                    decay: 4.0
                },
                delay: {
                    time: 0.3,
                    feedback: 0.4,
                    mix: 0.2
                },
                chorus: {
                    rate: 0.5,
                    depth: 0.3,
                    delay: 0.02
                }
            }
        };
        
        // State tracking
        this.isInitialized = false;
        this.currentAttachment = 0;
        this.memoryViewCount = 0;
        this.daemonPresence = 0;
        
        // Spatial audio for 3D positioning
        this.spatialSources = new Map();
        
        console.log('[ArchiveAudioEngine] Crystalline soundscape initialized');
    }
    
    /**
     * Initialize the Web Audio API and create the soundscape
     */
    async init() {
        try {
            console.log('[ArchiveAudioEngine] Initializing crystalline audio...');
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Handle autoplay policy by requiring user interaction
            if (this.audioContext.state === 'suspended') {
                console.log('[ArchiveAudioEngine] Audio context suspended - awaiting user interaction');
                this.setupUserInteractionHandler();
            }
            
            // Create master gain
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.config.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            // Create analyser for visual feedback
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.masterGain.connect(this.analyser);
            
            // Create core sound components
            await this.createAmbientDrone();
            await this.createCrystallineHarmonics();
            await this.createAttachmentResonance();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            this.isInitialized = true;
            console.log('[ArchiveAudioEngine] Crystalline soundscape ready');
            
        } catch (error) {
            console.error('[ArchiveAudioEngine] Initialization failed:', error);
            this.handleAudioError(error);
        }
    }
    
    /**
     * Setup user interaction handler for autoplay policy
     */
    setupUserInteractionHandler() {
        const resumeAudio = async () => {
            if (this.audioContext.state === 'suspended') {
                try {
                    await this.audioContext.resume();
                    console.log('[ArchiveAudioEngine] Audio context resumed');
                } catch (error) {
                    console.error('[ArchiveAudioEngine] Failed to resume audio:', error);
                }
            }
            // Remove handlers after first interaction
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
        };
        
        document.addEventListener('click', resumeAudio);
        document.addEventListener('keydown', resumeAudio);
        
        this.guardian.registerCleanup(() => {
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
        });
    }
    
    /**
     * Create the foundational ambient drone
     */
    async createAmbientDrone() {
        console.log('[ArchiveAudioEngine] Creating ambient drone...');
        
        // Primary oscillator - fundamental frequency
        const primaryOsc = this.audioContext.createOscillator();
        primaryOsc.type = 'sine';
        primaryOsc.frequency.value = this.config.frequencies.baseDrone;
        
        // Secondary oscillator - perfect fifth harmony
        const harmonyOsc = this.audioContext.createOscillator();
        harmonyOsc.type = 'triangle';
        harmonyOsc.frequency.value = this.config.frequencies.baseDrone * 1.5; // Perfect fifth
        
        // Subtle detuning oscillator for richness
        const detuneOsc = this.audioContext.createOscillator();
        detuneOsc.type = 'sine';
        detuneOsc.frequency.value = this.config.frequencies.baseDrone * 1.003; // Slight detune
        
        // Create filter for warmth
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;
        
        // Gain control
        const droneGain = this.audioContext.createGain();
        droneGain.gain.value = this.config.ambientVolume * 0.3;
        
        // LFO for subtle modulation
        const lfo = this.audioContext.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05; // Very slow modulation
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 3; // Subtle frequency modulation
        
        // Connect LFO
        lfo.connect(lfoGain);
        lfoGain.connect(primaryOsc.frequency);
        
        // Connect oscillators
        primaryOsc.connect(filter);
        harmonyOsc.connect(filter);
        detuneOsc.connect(filter);
        
        filter.connect(droneGain);
        droneGain.connect(this.masterGain);
        
        // Start all oscillators
        primaryOsc.start();
        harmonyOsc.start();
        detuneOsc.start();
        lfo.start();
        
        this.ambientDrone = {
            primary: primaryOsc,
            harmony: harmonyOsc,
            detune: detuneOsc,
            filter: filter,
            gain: droneGain,
            lfo: lfo,
            lfoGain: lfoGain
        };
        
        // Register for cleanup
        this.guardian.registerCleanup(() => {
            if (this.ambientDrone) {
                this.ambientDrone.primary.stop();
                this.ambientDrone.harmony.stop();
                this.ambientDrone.detune.stop();
                this.ambientDrone.lfo.stop();
            }
        });
    }
    
    /**
     * Create crystalline harmonic chimes
     */
    async createCrystallineHarmonics() {
        console.log('[ArchiveAudioEngine] Creating crystalline harmonics...');
        
        // Create a harmonic series based on crystal frequencies
        this.config.frequencies.crystalline.forEach((freq, index) => {
            const chime = this.createChimeVoice(freq, index);
            this.crystallineChimes.set(`crystal_${index}`, chime);
        });
    }
    
    /**
     * Create individual chime voice
     */
    createChimeVoice(frequency, index) {
        // Oscillator with bell-like timbre
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        
        // Add harmonics for bell sound
        const harmonic2 = this.audioContext.createOscillator();
        harmonic2.type = 'sine';
        harmonic2.frequency.value = frequency * 2.76; // Bell harmonic ratio
        
        const harmonic3 = this.audioContext.createOscillator();
        harmonic3.type = 'sine';
        harmonic3.frequency.value = frequency * 5.40; // Bell harmonic ratio
        
        // Envelope generator
        const envelope = this.audioContext.createGain();
        envelope.gain.value = 0;
        
        // Filter for brightness control
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 200 + index * 100;
        filter.Q.value = 2;
        
        // Individual gain control
        const chimeGain = this.audioContext.createGain();
        chimeGain.gain.value = this.config.chimeVolume * 0.1;
        
        // Connect audio graph
        osc.connect(filter);
        harmonic2.connect(filter);
        harmonic3.connect(filter);
        filter.connect(envelope);
        envelope.connect(chimeGain);
        chimeGain.connect(this.masterGain);
        
        // Start oscillators
        osc.start();
        harmonic2.start();
        harmonic3.start();
        
        return {
            oscillator: osc,
            harmonic2: harmonic2,
            harmonic3: harmonic3,
            envelope: envelope,
            filter: filter,
            gain: chimeGain,
            frequency: frequency
        };
    }
    
    /**
     * Create attachment resonance - the seductive hum that grows with attachment
     */
    async createAttachmentResonance() {
        console.log('[ArchiveAudioEngine] Creating attachment resonance...');
        
        // Very low frequency for subconscious influence
        const subOsc = this.audioContext.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.value = this.config.frequencies.attachment;
        
        // Golden ratio modulation for harmonic attraction
        const goldenOsc = this.audioContext.createOscillator();
        goldenOsc.type = 'triangle';
        goldenOsc.frequency.value = this.config.frequencies.attachment * 1.618; // Golden ratio
        
        // Warm filter
        const warmthFilter = this.audioContext.createBiquadFilter();
        warmthFilter.type = 'lowpass';
        warmthFilter.frequency.value = 200;
        warmthFilter.Q.value = 5;
        
        // Attachment gain (starts at 0, grows with attachment)
        const attachmentGain = this.audioContext.createGain();
        attachmentGain.gain.value = 0;
        
        // Modulation LFO for hypnotic effect
        const hypnoLFO = this.audioContext.createOscillator();
        hypnoLFO.type = 'sine';
        hypnoLFO.frequency.value = 0.1; // Slow hypnotic pulse
        const hypnoGain = this.audioContext.createGain();
        hypnoGain.gain.value = 5;
        
        // Connect graph
        subOsc.connect(warmthFilter);
        goldenOsc.connect(warmthFilter);
        warmthFilter.connect(attachmentGain);
        attachmentGain.connect(this.masterGain);
        
        // Connect modulation
        hypnoLFO.connect(hypnoGain);
        hypnoGain.connect(subOsc.frequency);
        
        // Start oscillators
        subOsc.start();
        goldenOsc.start();
        hypnoLFO.start();
        
        this.attachmentHum = {
            sub: subOsc,
            golden: goldenOsc,
            filter: warmthFilter,
            gain: attachmentGain,
            lfo: hypnoLFO,
            lfoGain: hypnoGain
        };
        
        // Register for cleanup
        this.guardian.registerCleanup(() => {
            if (this.attachmentHum) {
                this.attachmentHum.sub.stop();
                this.attachmentHum.golden.stop();
                this.attachmentHum.lfo.stop();
            }
        });
    }
    
    /**
     * Setup event handlers for dynamic audio response
     */
    setupEventHandlers() {
        if (!this.eventBridge) return;
        
        // Memory orb interactions
        this.eventBridge.on('orb:viewed', (data) => {
            this.playMemoryChime(data.memoryType, data.attachmentIncrease);
        });
        
        this.eventBridge.on('orb:corrupted', (data) => {
            this.addCorruptionDissonance(data.corruptionLevel);
        });
        
        this.eventBridge.on('orb:liberated', (data) => {
            this.playLiberationHarmonic(data.memoryType);
        });
        
        // Daemon manifestations
        this.eventBridge.on('daemon:manifest', (data) => {
            if (data.type === 'peaceful') {
                this.addDaemonWhisper(data.daemonType);
            }
        });
        
        this.eventBridge.on('daemon:recognized', (data) => {
            this.playRecognitionChord();
        });
        
        // Attachment level changes
        this.eventBridge.on('attachment:updated', (data) => {
            this.updateAttachmentResonance(data.level);
        });
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            if (this.eventBridge) {
                this.eventBridge.off('orb:viewed');
                this.eventBridge.off('orb:corrupted');
                this.eventBridge.off('orb:liberated');
                this.eventBridge.off('daemon:manifest');
                this.eventBridge.off('daemon:recognized');
                this.eventBridge.off('attachment:updated');
            }
        });
    }
    
    /**
     * Play memory chime when orb is viewed
     */
    playMemoryChime(memoryType, attachmentIncrease) {
        if (!this.isInitialized) return;
        
        // Select frequency based on memory type
        const frequencyIndex = this.getFrequencyIndexForMemoryType(memoryType);
        const chime = this.crystallineChimes.get(`crystal_${frequencyIndex}`);
        
        if (!chime) return;
        
        // Create transient chime
        const now = this.audioContext.currentTime;
        
        // Envelope attack and decay
        chime.envelope.gain.cancelScheduledValues(now);
        chime.envelope.gain.setValueAtTime(0, now);
        chime.envelope.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
        chime.envelope.gain.exponentialRampToValueAtTime(0.01, now + 2.0); // Decay
        chime.envelope.gain.linearRampToValueAtTime(0, now + 2.1); // Release
        
        // Modulate brightness based on attachment
        const brightness = 200 + attachmentIncrease * 500;
        chime.filter.frequency.exponentialRampToValueAtTime(brightness, now + 0.1);
        chime.filter.frequency.exponentialRampToValueAtTime(200, now + 1.5);
        
        console.log(`[ArchiveAudioEngine] Memory chime played for ${memoryType}`);
    }
    
    /**
     * Update attachment resonance based on current attachment level
     */
    updateAttachmentResonance(attachmentLevel) {
        if (!this.isInitialized || !this.attachmentHum) return;
        
        this.currentAttachment = attachmentLevel;
        const normalizedAttachment = Math.min(1.0, attachmentLevel / 200);
        
        // Increase attachment hum volume
        const targetVolume = normalizedAttachment * this.config.attachmentVolume;
        const now = this.audioContext.currentTime;
        
        this.attachmentHum.gain.gain.cancelScheduledValues(now);
        this.attachmentHum.gain.gain.exponentialRampToValueAtTime(
            Math.max(0.001, targetVolume), now + 1.0
        );
        
        // Increase warmth filter frequency for more seductive sound
        const warmth = 200 + normalizedAttachment * 300;
        this.attachmentHum.filter.frequency.exponentialRampToValueAtTime(warmth, now + 1.0);
        
        // Speed up hypnotic modulation
        const hypnoSpeed = 0.1 + normalizedAttachment * 0.3;
        this.attachmentHum.lfo.frequency.exponentialRampToValueAtTime(hypnoSpeed, now + 1.0);
        
        console.log(`[ArchiveAudioEngine] Attachment resonance updated: ${attachmentLevel}`);
    }
    
    /**
     * Add dissonance for corruption effects
     */
    addCorruptionDissonance(corruptionLevel) {
        if (!this.isInitialized) return;
        
        // Create temporary dissonant tones
        const dissonance1 = this.audioContext.createOscillator();
        const dissonance2 = this.audioContext.createOscillator();
        
        dissonance1.type = 'sawtooth';
        dissonance2.type = 'square';
        
        dissonance1.frequency.value = this.config.frequencies.corruption[0];
        dissonance2.frequency.value = this.config.frequencies.corruption[1];
        
        // Harsh filter
        const harshFilter = this.audioContext.createBiquadFilter();
        harshFilter.type = 'bandpass';
        harshFilter.frequency.value = 100;
        harshFilter.Q.value = 10;
        
        // Corruption gain
        const corruptionGain = this.audioContext.createGain();
        const volume = corruptionLevel * 0.1;
        corruptionGain.gain.value = volume;
        
        // Connect
        dissonance1.connect(harshFilter);
        dissonance2.connect(harshFilter);
        harshFilter.connect(corruptionGain);
        corruptionGain.connect(this.masterGain);
        
        // Play for short duration
        const now = this.audioContext.currentTime;
        dissonance1.start(now);
        dissonance2.start(now);
        dissonance1.stop(now + 0.5);
        dissonance2.stop(now + 0.5);
        
        console.log(`[ArchiveAudioEngine] Corruption dissonance added: ${corruptionLevel}`);
    }
    
    /**
     * Play liberation harmonic when memory is freed
     */
    playLiberationHarmonic(memoryType) {
        if (!this.isInitialized) return;
        
        // Create pure, ascending harmonic series
        const liberationFreqs = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major pentatonic
        
        liberationFreqs.forEach((freq, index) => {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                const now = this.audioContext.currentTime;
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
                
                osc.connect(gain);
                gain.connect(this.masterGain);
                
                osc.start(now);
                osc.stop(now + 2.1);
            }, index * 100);
        });
        
        console.log(`[ArchiveAudioEngine] Liberation harmonic played for ${memoryType}`);
    }
    
    /**
     * Add daemon whisper effect
     */
    addDaemonWhisper(daemonType) {
        if (!this.isInitialized) return;
        
        // Create whisper-like filtered noise
        const bufferSize = 2 * this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate pink noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        // Shape with filter
        const whisperFilter = this.audioContext.createBiquadFilter();
        whisperFilter.type = 'bandpass';
        whisperFilter.frequency.value = 500 + Math.random() * 1000;
        whisperFilter.Q.value = 5;
        
        // Envelope
        const whisperGain = this.audioContext.createGain();
        whisperGain.gain.value = 0;
        
        const now = this.audioContext.currentTime;
        whisperGain.gain.setValueAtTime(0, now);
        whisperGain.gain.linearRampToValueAtTime(0.05, now + 0.5);
        whisperGain.gain.linearRampToValueAtTime(0, now + 3.0);
        
        // Connect
        noise.connect(whisperFilter);
        whisperFilter.connect(whisperGain);
        whisperGain.connect(this.masterGain);
        
        noise.start(now);
        noise.stop(now + 3.1);
        
        console.log(`[ArchiveAudioEngine] Daemon whisper added for ${daemonType}`);
    }
    
    /**
     * Play recognition chord when user recognizes illusions
     */
    playRecognitionChord() {
        if (!this.isInitialized) return;
        
        // Perfect major chord for recognition
        const chordFreqs = [261.63, 329.63, 392.00]; // C major
        
        chordFreqs.forEach(freq => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const now = this.audioContext.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(now);
            osc.stop(now + 3.1);
        });
        
        console.log('[ArchiveAudioEngine] Recognition chord played');
    }
    
    /**
     * Get frequency index for memory type
     */
    getFrequencyIndexForMemoryType(memoryType) {
        const typeMap = {
            'nostalgic': 0,
            'achievement': 1, 
            'connection': 2,
            'creative': 3,
            'painful': 0,
            'lost_opportunity': 1
        };
        
        return typeMap[memoryType] || 0;
    }
    
    /**
     * Get audio analysis data for visualizations
     */
    getAudioAnalysis() {
        if (!this.analyser) return null;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        return {
            frequencies: dataArray,
            sampleRate: this.audioContext.sampleRate,
            attachment: this.currentAttachment,
            memoryViews: this.memoryViewCount
        };
    }
    
    /**
     * Pause audio engine
     */
    pause() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
            console.log('[ArchiveAudioEngine] Audio paused');
        }
    }
    
    /**
     * Resume audio engine
     */
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
            console.log('[ArchiveAudioEngine] Audio resumed');
        }
    }
    
    /**
     * Handle audio errors gracefully
     */
    handleAudioError(error) {
        console.error('[ArchiveAudioEngine] Audio error:', error);
        
        // Record error event
        if (this.consciousness) {
            this.consciousness.recordEvent('archive_audio_error', {
                error: error.message,
                timestamp: Date.now()
            });
        }
        
        // Attempt graceful degradation
        this.isInitialized = false;
    }
    
    /**
     * Clean up all audio resources
     */
    destroy() {
        console.log('[ArchiveAudioEngine] Dissolving crystalline soundscape...');
        
        // Stop and disconnect all audio nodes
        if (this.audioContext) {
            if (this.audioContext.state !== 'closed') {
                this.audioContext.close();
            }
        }
        
        // Clear collections
        this.crystallineChimes.clear();
        this.memoryResonators.clear();
        this.spatialSources.clear();
        
        // Cleanup all registered resources
        this.guardian.cleanupAll();
        
        this.isInitialized = false;
        console.log('[ArchiveAudioEngine] Soundscape dissolved into digital silence');
    }
}

// Export for debugging in development
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.ArchiveAudioEngine = ArchiveAudioEngine;
}