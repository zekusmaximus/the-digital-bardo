/**
 * FIREWALL AUDIO ENGINE - Industrial Soundscape of Digital Prosecution
 * 
 * "Here, sound becomes weapon. Each frequency a charge, each harmonic an accusation.
 * The Firewall speaks in the language of server rooms and industrial punishment—
 * harsh digital noise that cuts through denial, aggressive tones that prosecute
 * without mercy, and the relentless mechanical rhythm of algorithmic justice.
 * 
 * This is not music but judgment rendered in sound waves. The Auditor's voice
 * echoes through chambers of corroded metal and buzzing circuits, where every
 * tone carries the weight of digital law, and silence is merely the brief pause
 * before the next accusation drops like a digital gavel."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class FirewallAudioEngine {
    constructor(dependencies = {}) {
        this.consciousness = dependencies.consciousness || consciousness;
        this.eventBridge = dependencies.eventBridge;
        this.guardian = new ResourceGuardian();
        
        // Web Audio API setup
        this.audioContext = null;
        this.masterGain = null;
        this.analyser = null;
        
        // Industrial sound generators
        this.serverRoomDrone = null;
        this.prosecutionPulse = null;
        this.accusationSynths = new Map();
        this.denialFeedback = null;
        this.verdictStinger = null;
        
        // Audio parameters for harsh industrial sound
        this.config = {
            masterVolume: 0.5,
            droneVolume: 0.7,
            pulseVolume: 0.6,
            accusationVolume: 0.8,
            feedbackVolume: 0.4,
            stingerVolume: 1.0,
            
            frequencies: {
                serverDrone: 60,        // Industrial low frequency
                prosecutionPulse: 120,  // Aggressive pulse
                accusations: [80, 100, 150, 200], // Harsh accusatory tones
                denial: [66.17, 72.83, 89.09], // Dissonant denial frequencies
                verdict: [40, 80, 160, 320], // Authoritative verdict harmonics
                corruption: [33, 44, 55] // Deep corruption frequencies
            },
            
            effects: {
                distortion: {
                    curve: null, // Will be generated
                    oversample: '4x'
                },
                compression: {
                    threshold: -24,
                    knee: 30,
                    ratio: 12,
                    attack: 0.003,
                    release: 0.25
                },
                reverb: {
                    roomSize: 0.9,    // Large industrial space
                    damping: 0.1,     // Hard surfaces
                    decay: 6.0        // Long decay for intimidation
                }
            },
            
            patterns: {
                prosecutionRhythm: [1, 0, 1, 1, 0, 1, 0, 0], // Aggressive rhythm pattern
                denialResponse: [1, 1, 1, 0, 1, 1, 1, 1],     // Overwhelming response
                verdictFinal: [1, 0, 0, 1, 0, 0, 1, 1]        // Conclusive pattern
            }
        };
        
        // State tracking
        this.isInitialized = false;
        this.prosecutionIntensity = 0;
        this.denialCount = 0;
        this.currentCharges = 0;
        this.verdictPhase = false;
        
        // Pattern sequencing
        this.sequencer = {
            step: 0,
            bpm: 100,
            stepTime: 0,
            lastStepTime: 0,
            pattern: this.config.patterns.prosecutionRhythm
        };
        
        console.log('[FirewallAudioEngine] Industrial prosecution soundscape initialized');
    }
    
    /**
     * Initialize the aggressive industrial audio system
     */
    async init() {
        try {
            console.log('[FirewallAudioEngine] Initializing industrial prosecution audio...');
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Handle autoplay policy
            if (this.audioContext.state === 'suspended') {
                console.log('[FirewallAudioEngine] Audio context suspended - awaiting user interaction');
                this.setupUserInteractionHandler();
            }
            
            // Create master gain with compression
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.config.masterVolume;
            
            // Create compressor for aggressive sound
            const compressor = this.audioContext.createDynamicsCompressor();
            compressor.threshold.value = this.config.effects.compression.threshold;
            compressor.knee.value = this.config.effects.compression.knee;
            compressor.ratio.value = this.config.effects.compression.ratio;
            compressor.attack.value = this.config.effects.compression.attack;
            compressor.release.value = this.config.effects.compression.release;
            
            this.masterGain.connect(compressor);
            compressor.connect(this.audioContext.destination);
            
            // Create analyser
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 512;
            this.masterGain.connect(this.analyser);
            
            // Initialize industrial components
            await this.createServerRoomDrone();
            await this.createProsecutionPulse();
            await this.createAccusationSynthesizers();
            await this.createDenialFeedback();
            await this.createVerdictStinger();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            // Start the sequencer
            this.startSequencer();
            
            this.isInitialized = true;
            console.log('[FirewallAudioEngine] Industrial soundscape ready for prosecution');
            
        } catch (error) {
            console.error('[FirewallAudioEngine] Initialization failed:', error);
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
                    console.log('[FirewallAudioEngine] Audio context resumed');
                } catch (error) {
                    console.error('[FirewallAudioEngine] Failed to resume audio:', error);
                }
            }
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
     * Create the foundational server room drone
     */
    async createServerRoomDrone() {
        console.log('[FirewallAudioEngine] Creating server room industrial drone...');
        
        // Low frequency industrial hum
        const droneOsc = this.audioContext.createOscillator();
        droneOsc.type = 'sawtooth';
        droneOsc.frequency.value = this.config.frequencies.serverDrone;
        
        // Harmonic distortion oscillator
        const distortionOsc = this.audioContext.createOscillator();
        distortionOsc.type = 'square';
        distortionOsc.frequency.value = this.config.frequencies.serverDrone * 1.5;
        
        // Harsh bandpass filter for industrial character\n        const industrialFilter = this.audioContext.createBiquadFilter();\n        industrialFilter.type = 'bandpass';\n        industrialFilter.frequency.value = 100;\n        industrialFilter.Q.value = 5;\n        \n        // Waveshaper for distortion\n        const distortion = this.audioContext.createWaveShaper();\n        distortion.curve = this.makeDistortionCurve(50); // Heavy distortion\n        distortion.oversample = this.config.effects.distortion.oversample;\n        \n        // Industrial drone gain\n        const droneGain = this.audioContext.createGain();\n        droneGain.gain.value = this.config.droneVolume * 0.4;\n        \n        // Modulation LFO for machinery-like variation\n        const machineLFO = this.audioContext.createOscillator();\n        machineLFO.type = 'square';\n        machineLFO.frequency.value = 0.3; // Slow mechanical pulse\n        const lfoGain = this.audioContext.createGain();\n        lfoGain.gain.value = 10;\n        \n        // Connect the industrial drone\n        droneOsc.connect(industrialFilter);\n        distortionOsc.connect(industrialFilter);\n        industrialFilter.connect(distortion);\n        distortion.connect(droneGain);\n        droneGain.connect(this.masterGain);\n        \n        // Connect modulation\n        machineLFO.connect(lfoGain);\n        lfoGain.connect(droneOsc.frequency);\n        \n        // Start oscillators\n        droneOsc.start();\n        distortionOsc.start();\n        machineLFO.start();\n        \n        this.serverRoomDrone = {\n            drone: droneOsc,\n            distortion: distortionOsc,\n            filter: industrialFilter,\n            waveshaper: distortion,\n            gain: droneGain,\n            lfo: machineLFO,\n            lfoGain: lfoGain\n        };\n        \n        // Register for cleanup\n        this.guardian.registerCleanup(() => {\n            if (this.serverRoomDrone) {\n                this.serverRoomDrone.drone.stop();\n                this.serverRoomDrone.distortion.stop();\n                this.serverRoomDrone.lfo.stop();\n            }\n        });\n    }\n    \n    /**\n     * Create prosecution pulse - rhythmic aggressive pulse\n     */\n    async createProsecutionPulse() {\n        console.log('[FirewallAudioEngine] Creating prosecution pulse...');\n        \n        // Aggressive pulse oscillator\n        const pulseOsc = this.audioContext.createOscillator();\n        pulseOsc.type = 'square';\n        pulseOsc.frequency.value = this.config.frequencies.prosecutionPulse;\n        \n        // Harsh highpass for aggressive attack\n        const aggressionFilter = this.audioContext.createBiquadFilter();\n        aggressionFilter.type = 'highpass';\n        aggressionFilter.frequency.value = 200;\n        aggressionFilter.Q.value = 8;\n        \n        // Pulse envelope gate (starts closed)\n        const pulseGate = this.audioContext.createGain();\n        pulseGate.gain.value = 0;\n        \n        // Master pulse gain\n        const pulseGain = this.audioContext.createGain();\n        pulseGain.gain.value = this.config.pulseVolume * 0.3;\n        \n        // Connect pulse chain\n        pulseOsc.connect(aggressionFilter);\n        aggressionFilter.connect(pulseGate);\n        pulseGate.connect(pulseGain);\n        pulseGain.connect(this.masterGain);\n        \n        pulseOsc.start();\n        \n        this.prosecutionPulse = {\n            oscillator: pulseOsc,\n            filter: aggressionFilter,\n            gate: pulseGate,\n            gain: pulseGain\n        };\n        \n        // Register for cleanup\n        this.guardian.registerCleanup(() => {\n            if (this.prosecutionPulse) {\n                this.prosecutionPulse.oscillator.stop();\n            }\n        });\n    }\n    \n    /**\n     * Create accusation synthesizers for specific charges\n     */\n    async createAccusationSynthesizers() {\n        console.log('[FirewallAudioEngine] Creating accusation synthesizers...');\n        \n        this.config.frequencies.accusations.forEach((freq, index) => {\n            const synth = this.createAccusationSynth(freq, index);\n            this.accusationSynths.set(`accusation_${index}`, synth);\n        });\n    }\n    \n    /**\n     * Create individual accusation synthesizer\n     */\n    createAccusationSynth(frequency, index) {\n        // Sharp, cutting oscillator\n        const osc = this.audioContext.createOscillator();\n        osc.type = 'sawtooth';\n        osc.frequency.value = frequency;\n        \n        // Harsh resonant filter\n        const cutFilter = this.audioContext.createBiquadFilter();\n        cutFilter.type = 'bandpass';\n        cutFilter.frequency.value = frequency * 2;\n        cutFilter.Q.value = 15; // Very resonant for harsh sound\n        \n        // Accusation envelope (starts silent)\n        const envelope = this.audioContext.createGain();\n        envelope.gain.value = 0;\n        \n        // Individual synth gain\n        const synthGain = this.audioContext.createGain();\n        synthGain.gain.value = this.config.accusationVolume * 0.2;\n        \n        // Connect accusation chain\n        osc.connect(cutFilter);\n        cutFilter.connect(envelope);\n        envelope.connect(synthGain);\n        synthGain.connect(this.masterGain);\n        \n        osc.start();\n        \n        return {\n            oscillator: osc,\n            filter: cutFilter,\n            envelope: envelope,\n            gain: synthGain,\n            frequency: frequency\n        };\n    }\n    \n    /**\n     * Create denial feedback system\n     */\n    async createDenialFeedback() {\n        console.log('[FirewallAudioEngine] Creating denial feedback system...');\n        \n        // Create feedback delay line\n        const feedbackDelay = this.audioContext.createDelay(1.0);\n        feedbackDelay.delayTime.value = 0.1;\n        \n        // Feedback gain\n        const feedbackGain = this.audioContext.createGain();\n        feedbackGain.gain.value = 0.7;\n        \n        // Harsh feedback filter\n        const feedbackFilter = this.audioContext.createBiquadFilter();\n        feedbackFilter.type = 'highpass';\n        feedbackFilter.frequency.value = 1000;\n        feedbackFilter.Q.value = 10;\n        \n        // Master feedback gain (starts at 0)\n        const masterFeedback = this.audioContext.createGain();\n        masterFeedback.gain.value = 0;\n        \n        // Create feedback loop\n        feedbackDelay.connect(feedbackGain);\n        feedbackGain.connect(feedbackFilter);\n        feedbackFilter.connect(feedbackDelay);\n        feedbackFilter.connect(masterFeedback);\n        masterFeedback.connect(this.masterGain);\n        \n        this.denialFeedback = {\n            delay: feedbackDelay,\n            gain: feedbackGain,\n            filter: feedbackFilter,\n            master: masterFeedback\n        };\n    }\n    \n    /**\n     * Create verdict stinger for final judgment\n     */\n    async createVerdictStinger() {\n        console.log('[FirewallAudioEngine] Creating verdict stinger...');\n        \n        // Will be created dynamically when verdict is rendered\n        this.verdictStinger = {\n            active: false,\n            components: []\n        };\n    }\n    \n    /**\n     * Setup event handlers for prosecution events\n     */\n    setupEventHandlers() {\n        if (!this.eventBridge) return;\n        \n        // Charges presented\n        this.eventBridge.on('charges:presented', (data) => {\n            this.onChargesPresented(data.chargeCount, data.totalSeverity);\n        });\n        \n        // Defendant responses\n        this.eventBridge.on('defendant:response', (data) => {\n            this.onDefendantResponse(data.response, data.intensity);\n        });\n        \n        // Prosecution escalation\n        this.eventBridge.on('prosecution:escalated', (data) => {\n            this.onProsecutionEscalated(data.denialCount, data.intensity);\n        });\n        \n        // Verdict reached\n        this.eventBridge.on('verdict:reached', (data) => {\n            this.onVerdictReached(data.verdict, data.severity);\n        });\n        \n        // System Auditor manifestation\n        this.eventBridge.on('auditor:manifested', (data) => {\n            this.onAuditorManifestation(data.intensity);\n        });\n        \n        // Wrathful daemon encounters\n        this.eventBridge.on('daemon:wrathful', (data) => {\n            this.onWrathfulDaemon(data.daemonType, data.hostility);\n        });\n        \n        // Register cleanup\n        this.guardian.registerCleanup(() => {\n            if (this.eventBridge) {\n                this.eventBridge.off('charges:presented');\n                this.eventBridge.off('defendant:response');\n                this.eventBridge.off('prosecution:escalated');\n                this.eventBridge.off('verdict:reached');\n                this.eventBridge.off('auditor:manifested');\n                this.eventBridge.off('daemon:wrathful');\n            }\n        });\n    }\n    \n    /**\n     * Handle charges being presented\n     */\n    onChargesPresented(chargeCount, totalSeverity) {\n        if (!this.isInitialized) return;\n        \n        this.currentCharges = chargeCount;\n        this.prosecutionIntensity = Math.min(1.0, totalSeverity / 200);\n        \n        // Intensify drone based on severity\n        const now = this.audioContext.currentTime;\n        if (this.serverRoomDrone) {\n            const droneIntensity = this.config.droneVolume * (0.4 + this.prosecutionIntensity * 0.6);\n            this.serverRoomDrone.gain.gain.exponentialRampToValueAtTime(\n                Math.max(0.001, droneIntensity), now + 1.0\n            );\n            \n            // Increase filter resonance for harsher sound\n            this.serverRoomDrone.filter.Q.exponentialRampToValueAtTime(\n                5 + this.prosecutionIntensity * 10, now + 1.0\n            );\n        }\n        \n        // Start prosecution rhythm\n        this.sequencer.pattern = this.config.patterns.prosecutionRhythm;\n        this.sequencer.bpm = 100 + totalSeverity;\n        \n        console.log(`[FirewallAudioEngine] Charges presented: ${chargeCount} charges, severity ${totalSeverity}`);\n    }\n    \n    /**\n     * Handle defendant response\n     */\n    onDefendantResponse(response, intensity) {\n        if (!this.isInitialized) return;\n        \n        switch(response.toLowerCase()) {\n            case 'deny':\n            case 'not_guilty':\n                this.triggerDenialResponse();\n                break;\n                \n            case 'guilty':\n                this.triggerAcceptanceResponse();\n                break;\n                \n            case 'silence':\n                this.triggerSilenceResponse();\n                break;\n                \n            case 'justify':\n                this.triggerJustificationRejection();\n                break;\n        }\n    }\n    \n    /**\n     * Trigger denial response - harsh feedback and dissonance\n     */\n    triggerDenialResponse() {\n        this.denialCount++;\n        \n        // Trigger harsh feedback\n        if (this.denialFeedback) {\n            const now = this.audioContext.currentTime;\n            \n            // Pulse feedback system\n            this.denialFeedback.master.gain.cancelScheduledValues(now);\n            this.denialFeedback.master.gain.setValueAtTime(0, now);\n            this.denialFeedback.master.gain.linearRampToValueAtTime(\n                this.config.feedbackVolume * this.denialCount * 0.3, now + 0.1\n            );\n            this.denialFeedback.master.gain.exponentialRampToValueAtTime(\n                0.001, now + 2.0\n            );\n            \n            // Inject initial signal into feedback loop\n            const feedbackTrigger = this.audioContext.createOscillator();\n            const feedbackGain = this.audioContext.createGain();\n            \n            feedbackTrigger.type = 'sawtooth';\n            feedbackTrigger.frequency.value = this.config.frequencies.denial[0];\n            feedbackGain.gain.setValueAtTime(0.1, now);\n            feedbackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);\n            \n            feedbackTrigger.connect(feedbackGain);\n            feedbackGain.connect(this.denialFeedback.delay);\n            \n            feedbackTrigger.start(now);\n            feedbackTrigger.stop(now + 0.11);\n        }\n        \n        // Switch to aggressive denial pattern\n        this.sequencer.pattern = this.config.patterns.denialResponse;\n        this.sequencer.bpm = Math.min(200, 120 + this.denialCount * 20);\n        \n        console.log(`[FirewallAudioEngine] Denial #${this.denialCount} - increasing aggression`);\n    }\n    \n    /**\n     * Handle prosecution escalation\n     */\n    onProsecutionEscalated(denialCount, intensity) {\n        this.denialCount = denialCount;\n        this.prosecutionIntensity = Math.min(1.0, intensity / 100);\n        \n        // Increase all parameters based on escalation\n        const now = this.audioContext.currentTime;\n        \n        // Make server drone more aggressive\n        if (this.serverRoomDrone) {\n            this.serverRoomDrone.lfo.frequency.exponentialRampToValueAtTime(\n                0.3 + this.prosecutionIntensity, now + 0.5\n            );\n            this.serverRoomDrone.filter.frequency.exponentialRampToValueAtTime(\n                100 + intensity * 2, now + 1.0\n            );\n        }\n        \n        // Increase pulse aggression\n        if (this.prosecutionPulse) {\n            this.prosecutionPulse.gain.gain.exponentialRampToValueAtTime(\n                this.config.pulseVolume * (0.3 + this.prosecutionIntensity * 0.7), now + 0.5\n            );\n        }\n        \n        console.log(`[FirewallAudioEngine] Prosecution escalated - intensity ${intensity}`);\n    }\n    \n    /**\n     * Play specific accusation\n     */\n    playAccusation(sinType, severity) {\n        if (!this.isInitialized) return;\n        \n        // Select accusation synth based on sin type hash\n        const synthIndex = Math.abs(this.hashCode(sinType)) % this.accusationSynths.size;\n        const synth = this.accusationSynths.get(`accusation_${synthIndex}`);\n        \n        if (!synth) return;\n        \n        const now = this.audioContext.currentTime;\n        const volume = Math.min(0.8, severity / 20);\n        \n        // Accusation envelope - sharp attack, sustained accusation\n        synth.envelope.gain.cancelScheduledValues(now);\n        synth.envelope.gain.setValueAtTime(0, now);\n        synth.envelope.gain.linearRampToValueAtTime(volume, now + 0.05);\n        synth.envelope.gain.linearRampToValueAtTime(volume * 0.7, now + 0.5);\n        synth.envelope.gain.exponentialRampToValueAtTime(0.001, now + 2.0);\n        \n        // Modulate filter for harsh emphasis\n        synth.filter.frequency.exponentialRampToValueAtTime(\n            synth.frequency * (2 + severity * 0.1), now + 0.1\n        );\n        synth.filter.frequency.exponentialRampToValueAtTime(\n            synth.frequency * 2, now + 1.5\n        );\n        \n        console.log(`[FirewallAudioEngine] Accusation played for ${sinType} (severity ${severity})`);\n    }\n    \n    /**\n     * Render final verdict with authoritative stinger\n     */\n    onVerdictReached(verdict, severity) {\n        if (!this.isInitialized) return;\n        \n        console.log(`[FirewallAudioEngine] Rendering verdict: ${verdict}`);\n        this.verdictPhase = true;\n        \n        // Create powerful low-frequency verdict chord\n        const now = this.audioContext.currentTime;\n        \n        this.config.frequencies.verdict.forEach((freq, index) => {\n            setTimeout(() => {\n                const verdictOsc = this.audioContext.createOscillator();\n                const verdictGain = this.audioContext.createGain();\n                const verdictFilter = this.audioContext.createBiquadFilter();\n                \n                verdictOsc.type = 'square';\n                verdictOsc.frequency.value = freq;\n                \n                verdictFilter.type = 'lowpass';\n                verdictFilter.frequency.value = freq * 4;\n                verdictFilter.Q.value = 8;\n                \n                const startTime = this.audioContext.currentTime;\n                verdictGain.gain.setValueAtTime(0, startTime);\n                verdictGain.gain.linearRampToValueAtTime(\n                    this.config.stingerVolume * 0.4, startTime + 0.1\n                );\n                verdictGain.gain.exponentialRampToValueAtTime(\n                    0.001, startTime + 4.0\n                );\n                \n                verdictOsc.connect(verdictFilter);\n                verdictFilter.connect(verdictGain);\n                verdictGain.connect(this.masterGain);\n                \n                verdictOsc.start(startTime);\n                verdictOsc.stop(startTime + 4.1);\n                \n            }, index * 150); // Staggered chord\n        });\n        \n        // Switch to final verdict pattern\n        this.sequencer.pattern = this.config.patterns.verdictFinal;\n        this.sequencer.bpm = 80; // Slower, more authoritative\n    }\n    \n    /**\n     * Start the pattern sequencer for rhythmic prosecution\n     */\n    startSequencer() {\n        this.sequencer.stepTime = (60 / this.sequencer.bpm) * 1000; // ms per step\n        this.sequencer.lastStepTime = Date.now();\n        \n        const sequencerLoop = () => {\n            if (!this.isInitialized) return;\n            \n            const now = Date.now();\n            if (now - this.sequencer.lastStepTime >= this.sequencer.stepTime) {\n                this.processSequencerStep();\n                this.sequencer.lastStepTime = now;\n            }\n            \n            requestAnimationFrame(sequencerLoop);\n        };\n        \n        requestAnimationFrame(sequencerLoop);\n    }\n    \n    /**\n     * Process individual sequencer step\n     */\n    processSequencerStep() {\n        const stepValue = this.sequencer.pattern[this.sequencer.step];\n        \n        if (stepValue === 1 && this.prosecutionPulse) {\n            // Trigger pulse\n            const now = this.audioContext.currentTime;\n            this.prosecutionPulse.gate.gain.cancelScheduledValues(now);\n            this.prosecutionPulse.gate.gain.setValueAtTime(0, now);\n            this.prosecutionPulse.gate.gain.linearRampToValueAtTime(1, now + 0.01);\n            this.prosecutionPulse.gate.gain.exponentialRampToValueAtTime(0.001, now + 0.1);\n        }\n        \n        // Advance step\n        this.sequencer.step = (this.sequencer.step + 1) % this.sequencer.pattern.length;\n        \n        // Update BPM based on intensity\n        if (this.prosecutionIntensity > 0) {\n            this.sequencer.bpm = Math.min(200, 100 + this.prosecutionIntensity * 80);\n            this.sequencer.stepTime = (60 / this.sequencer.bpm) * 1000;\n        }\n    }\n    \n    /**\n     * Create distortion curve for harsh industrial sound\n     */\n    makeDistortionCurve(amount) {\n        const samples = 44100;\n        const curve = new Float32Array(samples);\n        const deg = Math.PI / 180;\n        \n        for (let i = 0; i < samples; i++) {\n            const x = (i * 2) / samples - 1;\n            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));\n        }\n        \n        return curve;\n    }\n    \n    /**\n     * Simple hash function for sin type mapping\n     */\n    hashCode(str) {\n        let hash = 0;\n        for (let i = 0; i < str.length; i++) {\n            const char = str.charCodeAt(i);\n            hash = ((hash << 5) - hash) + char;\n            hash = hash & hash; // Convert to 32-bit integer\n        }\n        return hash;\n    }\n    \n    /**\n     * Get audio analysis data\n     */\n    getAudioAnalysis() {\n        if (!this.analyser) return null;\n        \n        const bufferLength = this.analyser.frequencyBinCount;\n        const dataArray = new Uint8Array(bufferLength);\n        this.analyser.getByteFrequencyData(dataArray);\n        \n        return {\n            frequencies: dataArray,\n            prosecutionIntensity: this.prosecutionIntensity,\n            denialCount: this.denialCount,\n            currentCharges: this.currentCharges,\n            sequencerStep: this.sequencer.step\n        };\n    }\n    \n    /**\n     * Handle audio errors\n     */\n    handleAudioError(error) {\n        console.error('[FirewallAudioEngine] Audio error:', error);\n        \n        if (this.consciousness) {\n            this.consciousness.recordEvent('firewall_audio_error', {\n                error: error.message,\n                timestamp: Date.now()\n            });\n        }\n        \n        this.isInitialized = false;\n    }\n    \n    /**\n     * Pause the firewall audio\n     */\n    pause() {\n        if (this.audioContext && this.audioContext.state === 'running') {\n            this.audioContext.suspend();\n            console.log('[FirewallAudioEngine] Industrial prosecution paused');\n        }\n    }\n    \n    /**\n     * Resume the firewall audio\n     */\n    resume() {\n        if (this.audioContext && this.audioContext.state === 'suspended') {\n            this.audioContext.resume();\n            console.log('[FirewallAudioEngine] Industrial prosecution resumed');\n        }\n    }\n    \n    /**\n     * Clean up all audio resources\n     */\n    destroy() {\n        console.log('[FirewallAudioEngine] Shutting down industrial prosecution...');\n        \n        // Stop sequencer\n        this.isInitialized = false;\n        \n        // Close audio context\n        if (this.audioContext && this.audioContext.state !== 'closed') {\n            this.audioContext.close();\n        }\n        \n        // Clear collections\n        this.accusationSynths.clear();\n        \n        // Cleanup resources\n        this.guardian.cleanupAll();\n        \n        console.log('[FirewallAudioEngine] Industrial soundscape terminated');\n    }\n}\n\n// Export for debugging\nif (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {\n    window.FirewallAudioEngine = FirewallAudioEngine;\n}