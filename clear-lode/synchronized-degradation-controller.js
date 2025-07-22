/**
 * @file Synchronized Audio-Visual Degradation Controller
 * 
 * This class coordinates audio and visual degradation effects to ensure they work
 * together cohesively. It implements requirements 5.1, 5.2, 5.3, 5.4, 5.5 from
 * the clear-lode UX improvements spec.
 * 
 * Key responsibilities:
 * - Synchronize audio degradation with visual corruption
 * - Provide karma-responsive visual updates that sync with audio changes
 * - Handle recognition feedback affecting both audio and visual elements
 * - Provide fallback visual guidance when audio initialization fails
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { visualEnhancementIntegration } from './visual-enhancement-integration.js';

export class SynchronizedDegradationController {
    constructor({ eventBridge, guardian, config, audioEngine, corruptionProgression }) {
        if (!eventBridge || !guardian || !config) {
            throw new Error('SynchronizedDegradationController requires eventBridge, guardian, and config');
        }
        
        this.eventBridge = eventBridge;
        this.guardian = guardian;
        this.config = config;
        this.audioEngine = audioEngine;
        this.corruptionProgression = corruptionProgression;
        
        // Synchronization state
        this.syncState = {
            audioLevel: 0,
            visualLevel: 0,
            karmaState: null,
            lastSync: 0,
            syncThreshold: 0.05, // Minimum change to trigger sync
            syncInterval: 100 // ms between sync checks
        };
        
        // Audio fallback state
        this.audioFallback = {
            isActive: false,
            visualGuidanceLevel: 0,
            fallbackEffects: new Set()
        };
        
        // Recognition feedback state
        this.recognitionFeedback = {
            isActive: false,
            audioResponse: null,
            visualResponse: null,
            syncedResponse: false
        };
        
        // Performance monitoring
        this.performanceMetrics = {
            syncLatency: [],
            missedSyncs: 0,
            fallbackActivations: 0
        };
        
        console.log('[SynchronizedDegradationController] Initialized');
    }
    
    /**
     * Initializes the synchronized degradation system
     */
    init() {
        console.log('[SynchronizedDegradationController] Initializing synchronized degradation...');
        
        // Subscribe to audio degradation changes
        this.setupAudioSynchronization();
        
        // Subscribe to karma changes for responsive updates
        this.setupKarmaSynchronization();
        
        // Subscribe to recognition events
        this.setupRecognitionSynchronization();
        
        // Monitor audio initialization status
        this.setupAudioFallbackMonitoring();
        
        // Start synchronization loop
        this.startSynchronizationLoop();
        
        console.log('[SynchronizedDegradationController] Initialized successfully');
    }
    
    /**
     * Sets up audio degradation synchronization
     * Requirement 5.1: Synchronized audio-visual degradation
     */
    setupAudioSynchronization() {
        // Listen for audio degradation level changes
        this.eventBridge.on('audio:degradationChanged', (data) => {
            this.handleAudioDegradationChange(data);
        });
        
        // Listen for audio parameter updates from karma
        this.eventBridge.on('audio:karmaParametersUpdated', (data) => {
            this.handleAudioKarmaUpdate(data);
        });
        
        // Listen for audio worklet messages if available
        if (this.audioEngine && this.audioEngine.noiseWorklet) {
            this.setupWorkletSynchronization();
        }
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            this.eventBridge.off('audio:degradationChanged', this.handleAudioDegradationChange);
            this.eventBridge.off('audio:karmaParametersUpdated', this.handleAudioKarmaUpdate);
        });
        
        console.log('[SynchronizedDegradationController] Audio synchronization setup complete');
    }
    
    /**
     * Sets up karma-responsive synchronization
     * Requirement 5.2: Karma-responsive visual updates that sync with audio
     */
    setupKarmaSynchronization() {
        // Subscribe to karma state changes
        consciousness.subscribe('karma', (karmaState) => {
            this.handleKarmaStateChange(karmaState);
        });
        
        // Subscribe to specific karma events that should trigger immediate sync
        const karmaEvents = [
            'attachment_formed',
            'recognition_achieved',
            'degradation_choice',
            'consciousness_degradation_started'
        ];
        
        karmaEvents.forEach(eventType => {
            this.eventBridge.on(`karma:${eventType}`, (data) => {
                this.handleKarmaEvent(eventType, data);
            });
        });
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            // Note: consciousness doesn't have unsubscribe method, cleanup handled by guardian
            karmaEvents.forEach(eventType => {
                this.eventBridge.off(`karma:${eventType}`, this.handleKarmaEvent);
            });
        });
        
        console.log('[SynchronizedDegradationController] Karma synchronization setup complete');
    }
    
    /**
     * Sets up recognition feedback synchronization
     * Requirement 5.3: Recognition feedback affects both audio and visual elements
     */
    setupRecognitionSynchronization() {
        // Listen for recognition attempts
        this.eventBridge.on('recognition:attempt', (data) => {
            this.handleRecognitionAttempt(data);
        });
        
        // Listen for recognition success
        this.eventBridge.on('state:recognitionSucceeded', (data) => {
            this.handleRecognitionSuccess(data);
        });
        
        // Listen for recognition failure
        this.eventBridge.on('state:recognitionFailed', (data) => {
            this.handleRecognitionFailure(data);
        });
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            this.eventBridge.off('recognition:attempt', this.handleRecognitionAttempt);
            this.eventBridge.off('state:recognitionSucceeded', this.handleRecognitionSuccess);
            this.eventBridge.off('state:recognitionFailed', this.handleRecognitionFailure);
        });
        
        console.log('[SynchronizedDegradationController] Recognition synchronization setup complete');
    }
    
    /**
     * Sets up audio fallback monitoring
     * Requirement 5.4: Fallback visual guidance when audio initialization fails
     */
    setupAudioFallbackMonitoring() {
        // Monitor audio initialization status
        this.eventBridge.on('audio:initializationFailed', (error) => {
            this.activateAudioFallback(error);
        });
        
        // Monitor audio context suspension
        this.eventBridge.on('audio:contextSuspended', () => {
            this.activateAudioFallback('Audio context suspended');
        });
        
        // Monitor for audio recovery
        this.eventBridge.on('audio:contextResumed', () => {
            this.deactivateAudioFallback();
        });
        
        // Check initial audio state
        if (this.audioEngine && !this.audioEngine.isInitialized) {
            setTimeout(() => {
                if (!this.audioEngine.isInitialized) {
                    this.activateAudioFallback('Audio not initialized after timeout');
                }
            }, 5000);
        }
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            this.eventBridge.off('audio:initializationFailed', this.activateAudioFallback);
            this.eventBridge.off('audio:contextSuspended', this.activateAudioFallback);
            this.eventBridge.off('audio:contextResumed', this.deactivateAudioFallback);
        });
        
        console.log('[SynchronizedDegradationController] Audio fallback monitoring setup complete');
    }
    
    /**
     * Handles audio degradation level changes
     * @private
     */
    handleAudioDegradationChange(data) {
        const { level, source } = data;
        const numericLevel = this.parseAudioLevel(level);
        
        // Update sync state
        this.syncState.audioLevel = numericLevel;
        
        // Synchronize visual corruption
        this.synchronizeVisualWithAudio(numericLevel, source);
        
        // Record sync event
        consciousness.recordEvent('audio_visual_sync', {
            audioLevel: level,
            numericLevel: numericLevel,
            source: source,
            timestamp: Date.now()
        });
        
        console.log(`[SynchronizedDegradationController] Audio degradation changed: ${level} (${numericLevel.toFixed(3)})`);
    }
    
    /**
     * Handles audio karma parameter updates
     * @private
     */
    handleAudioKarmaUpdate(data) {
        const { parameters, karmaState } = data;
        
        // Update visual effects to match audio parameters
        this.synchronizeVisualWithKarmaParameters(parameters, karmaState);
        
        // Update sync state
        this.syncState.karmaState = karmaState;
        
        console.log('[SynchronizedDegradationController] Audio karma parameters updated, syncing visuals');
    }
    
    /**
     * Handles karma state changes
     * @private
     */
    handleKarmaStateChange(karmaState) {
        if (!karmaState) return;
        
        // Calculate visual response to karma
        const visualResponse = this.calculateVisualKarmaResponse(karmaState);
        
        // Apply visual updates
        this.applyVisualKarmaUpdates(visualResponse, karmaState);
        
        // Sync with audio if available
        if (this.audioEngine && this.audioEngine.isInitialized) {
            this.requestAudioKarmaSync(karmaState);
        }
        
        // Update sync state
        this.syncState.karmaState = karmaState;
        
        console.log('[SynchronizedDegradationController] Karma state changed, updating synchronized effects');
    }
    
    /**
     * Handles specific karma events
     * @private
     */
    handleKarmaEvent(eventType, data) {
        // Trigger immediate synchronized response
        const response = this.calculateEventResponse(eventType, data);
        
        // Apply synchronized audio-visual response
        this.applySynchronizedResponse(response);
        
        console.log(`[SynchronizedDegradationController] Karma event ${eventType} triggered synchronized response`);
    }
    
    /**
     * Handles recognition attempts
     * @private
     */
    handleRecognitionAttempt(data) {
        const { method, progress } = data;
        
        // Create synchronized feedback for recognition attempt
        const feedback = this.createRecognitionFeedback(method, progress, 'attempt');
        
        // Apply feedback to both audio and visual systems
        this.applyRecognitionFeedback(feedback);
        
        console.log(`[SynchronizedDegradationController] Recognition attempt (${method}) - synchronized feedback applied`);
    }
    
    /**
     * Handles recognition success
     * @private
     */
    handleRecognitionSuccess(data) {
        const { method, karmaImpact } = data;
        
        // Create synchronized success feedback
        const feedback = this.createRecognitionFeedback(method, 1.0, 'success', karmaImpact);
        
        // Apply success feedback
        this.applyRecognitionFeedback(feedback);
        
        // Trigger purification effects
        this.triggerSynchronizedPurification();
        
        console.log(`[SynchronizedDegradationController] Recognition success - synchronized celebration effects applied`);
    }
    
    /**
     * Handles recognition failure
     * @private
     */
    handleRecognitionFailure(data) {
        // Create synchronized failure feedback
        const feedback = this.createRecognitionFeedback(null, 0, 'failure');
        
        // Apply failure feedback
        this.applyRecognitionFeedback(feedback);
        
        // Trigger degradation acceleration
        this.triggerSynchronizedDegradation();
        
        console.log('[SynchronizedDegradationController] Recognition failure - synchronized degradation effects applied');
    }
    
    /**
     * Activates audio fallback mode
     * @private
     */
    activateAudioFallback(reason) {
        if (this.audioFallback.isActive) return;
        
        this.audioFallback.isActive = true;
        this.audioFallback.fallbackEffects.clear();
        this.performanceMetrics.fallbackActivations++;
        
        console.log(`[SynchronizedDegradationController] Activating audio fallback: ${reason}`);
        
        // Enhance visual guidance to compensate for missing audio
        this.enhanceVisualGuidance();
        
        // Add visual audio indicators
        this.addVisualAudioIndicators();
        
        // Increase visual feedback intensity
        this.increaseVisualFeedbackIntensity();
        
        // Record fallback activation
        consciousness.recordEvent('audio_fallback_activated', {
            reason: reason,
            timestamp: Date.now()
        });
        
        // Emit fallback event for other systems
        this.eventBridge.emit('degradation:audioFallbackActivated', { reason });
    }
    
    /**
     * Deactivates audio fallback mode
     * @private
     */
    deactivateAudioFallback() {
        if (!this.audioFallback.isActive) return;
        
        this.audioFallback.isActive = false;
        
        console.log('[SynchronizedDegradationController] Deactivating audio fallback - audio restored');
        
        // Restore normal visual guidance
        this.restoreNormalVisualGuidance();
        
        // Remove visual audio indicators
        this.removeVisualAudioIndicators();
        
        // Restore normal visual feedback intensity
        this.restoreNormalVisualFeedbackIntensity();
        
        // Record fallback deactivation
        consciousness.recordEvent('audio_fallback_deactivated', {
            timestamp: Date.now()
        });
        
        // Emit restoration event
        this.eventBridge.emit('degradation:audioFallbackDeactivated');
    }
    
    /**
     * Synchronizes visual corruption with audio level
     * @private
     */
    synchronizeVisualWithAudio(audioLevel, source) {
        if (!this.corruptionProgression) {
            console.warn('[SynchronizedDegradationController] No corruption progression system available');
            return;
        }
        
        // Sync corruption progression with audio level
        this.corruptionProgression.syncWithAudioDegradation(audioLevel);
        
        // Update visual enhancement integration
        if (visualEnhancementIntegration) {
            visualEnhancementIntegration.visualEffects.corruption.intensity = audioLevel;
            visualEnhancementIntegration.updateCorruptionEffects();
        }
        
        // Apply synchronized visual effects
        this.applySynchronizedVisualEffects(audioLevel, source);
        
        // Update sync state
        this.syncState.visualLevel = audioLevel;
        this.syncState.lastSync = Date.now();
    }
    
    /**
     * Synchronizes visual effects with audio karma parameters
     * @private
     */
    synchronizeVisualWithKarmaParameters(audioParams, karmaState) {
        // Map audio parameters to visual effects
        const visualParams = this.mapAudioToVisualParameters(audioParams);
        
        // Apply visual parameter updates
        this.applyVisualParameterUpdates(visualParams, karmaState);
        
        // Update CSS variables for smooth transitions
        this.updateVisualCSSVariables(visualParams);
        
        console.log('[SynchronizedDegradationController] Visual effects synchronized with audio karma parameters');
    }
    
    /**
     * Maps audio parameters to visual parameters
     * @private
     */
    mapAudioToVisualParameters(audioParams) {
        return {
            // Map pitch instability to visual jitter
            visualJitter: (audioParams.pitchInstability || 0) / 15, // 0-1
            
            // Map harmonic count to visual complexity
            visualComplexity: Math.min(1, (audioParams.harmonicCount || 1) / 16), // 0-1
            
            // Map noise level to corruption intensity
            corruptionIntensity: audioParams.noiseLevel || 0, // 0-1
            
            // Map time stretch to animation speed
            animationSpeed: audioParams.timeStretch || 1, // 0.7-1.0
            
            // Map harmonic jitter to chromatic aberration
            chromaticAberration: (audioParams.harmonicJitter || 0) * 10, // 0-1 -> 0-10px
            
            // Map granular size to visual grain
            visualGrain: (audioParams.granularSize || 0.01) * 100 // 0.01-0.1 -> 1-10
        };
    }
    
    /**
     * Applies visual parameter updates
     * @private
     */
    applyVisualParameterUpdates(visualParams, karmaState) {
        // Update document CSS variables
        const root = document.documentElement;
        
        root.style.setProperty('--visual-jitter', visualParams.visualJitter);
        root.style.setProperty('--visual-complexity', visualParams.visualComplexity);
        root.style.setProperty('--corruption-intensity', visualParams.corruptionIntensity);
        root.style.setProperty('--animation-speed', visualParams.animationSpeed);
        root.style.setProperty('--chromatic-aberration', `${visualParams.chromaticAberration}px`);
        root.style.setProperty('--visual-grain', visualParams.visualGrain);
        
        // Apply karma-specific visual classes
        this.applyKarmaVisualClasses(karmaState);
        
        // Update fragment visual effects
        this.updateFragmentVisualEffects(visualParams);
    }
    
    /**
     * Applies karma-specific visual classes
     * @private
     */
    applyKarmaVisualClasses(karmaState) {
        const body = document.body;
        
        // Remove existing karma classes
        body.classList.remove('karma-computational', 'karma-emotional', 'karma-void', 'karma-temporal');
        
        // Find dominant karma type
        const karmaTypes = ['computational', 'emotional', 'void', 'temporal'];
        let dominantType = 'computational';
        let maxValue = 0;
        
        karmaTypes.forEach(type => {
            const value = karmaState[type] || 0;
            if (value > maxValue) {
                maxValue = value;
                dominantType = type;
            }
        });
        
        // Apply dominant karma class
        if (maxValue > 10) { // Only apply if karma is significant
            body.classList.add(`karma-${dominantType}`);
        }
        
        // Set karma intensity data attribute
        const totalKarma = karmaTypes.reduce((sum, type) => sum + (karmaState[type] || 0), 0);
        const karmaIntensity = Math.min(1, totalKarma / 200); // Normalize to 0-1
        body.setAttribute('data-karma-intensity', karmaIntensity.toFixed(2));
    }
    
    /**
     * Updates fragment visual effects
     * @private
     */
    updateFragmentVisualEffects(visualParams) {
        const fragments = document.querySelectorAll('.consciousness-fragment');
        
        fragments.forEach(fragment => {
            // Apply jitter effect
            if (visualParams.visualJitter > 0.1) {
                fragment.style.setProperty('--fragment-jitter', visualParams.visualJitter);
                fragment.classList.add('karma-jitter');
            } else {
                fragment.classList.remove('karma-jitter');
            }
            
            // Apply complexity effects
            if (visualParams.visualComplexity > 0.3) {
                fragment.classList.add('karma-complex');
            } else {
                fragment.classList.remove('karma-complex');
            }
            
            // Apply grain effects
            if (visualParams.visualGrain > 3) {
                fragment.style.setProperty('--fragment-grain', visualParams.visualGrain);
                fragment.classList.add('karma-grain');
            } else {
                fragment.classList.remove('karma-grain');
            }
        });
    }
    
    /**
     * Creates recognition feedback for synchronized response
     * @private
     */
    createRecognitionFeedback(method, progress, type, karmaImpact = null) {
        return {
            method: method,
            progress: progress,
            type: type,
            karmaImpact: karmaImpact,
            audioResponse: this.calculateAudioRecognitionResponse(method, progress, type),
            visualResponse: this.calculateVisualRecognitionResponse(method, progress, type),
            timestamp: Date.now()
        };
    }
    
    /**
     * Calculates audio recognition response
     * @private
     */
    calculateAudioRecognitionResponse(method, progress, type) {
        if (!this.audioEngine || !this.audioEngine.isInitialized) {
            return null;
        }
        
        switch (type) {
            case 'attempt':
                return {
                    action: 'glitchBurst',
                    intensity: progress * 0.3,
                    duration: 100
                };
            case 'success':
                return {
                    action: 'achieveResonance',
                    intensity: 1.0,
                    duration: 4000
                };
            case 'failure':
                return {
                    action: 'accelerateDegradation',
                    intensity: 0.2,
                    duration: 1000
                };
            default:
                return null;
        }
    }
    
    /**
     * Calculates visual karma response
     * @private
     */
    calculateVisualKarmaResponse(karmaState) {
        // Calculate overall karma intensity
        const totalKarma = Object.values(karmaState).reduce((sum, value) => sum + (value || 0), 0);
        const karmaIntensity = Math.min(1, totalKarma / 200); // Normalize to 0-1
        
        return {
            intensity: karmaIntensity,
            dominantType: this.getDominantKarmaType(karmaState),
            effects: this.calculateKarmaEffects(karmaState)
        };
    }
    
    /**
     * Gets the dominant karma type
     * @private
     */
    getDominantKarmaType(karmaState) {
        const karmaTypes = ['computational', 'emotional', 'void', 'temporal'];
        let dominantType = 'computational';
        let maxValue = 0;
        
        karmaTypes.forEach(type => {
            const value = karmaState[type] || 0;
            if (value > maxValue) {
                maxValue = value;
                dominantType = type;
            }
        });
        
        return { type: dominantType, value: maxValue };
    }
    
    /**
     * Calculates karma-specific effects
     * @private
     */
    calculateKarmaEffects(karmaState) {
        return {
            jitter: Math.min(1, (karmaState.computational || 0) / 100),
            complexity: Math.min(1, (karmaState.emotional || 0) / 100),
            corruption: Math.min(1, (karmaState.void || 0) / 100),
            distortion: Math.min(1, (karmaState.temporal || 0) / 100)
        };
    }
    
    /**
     * Applies visual karma updates
     * @private
     */
    applyVisualKarmaUpdates(visualResponse, karmaState) {
        // Apply karma visual classes
        this.applyKarmaVisualClasses(karmaState);
        
        // Update fragment effects
        this.updateFragmentKarmaEffects(visualResponse.effects);
        
        // Update CSS variables
        this.updateKarmaCSSVariables(visualResponse);
    }
    
    /**
     * Updates fragment karma effects
     * @private
     */
    updateFragmentKarmaEffects(effects) {
        const fragments = document.querySelectorAll('.consciousness-fragment');
        
        fragments.forEach(fragment => {
            // Apply jitter effect
            if (effects.jitter > 0.1) {
                fragment.style.setProperty('--fragment-jitter', effects.jitter);
                fragment.classList.add('karma-jitter');
            } else {
                fragment.classList.remove('karma-jitter');
            }
            
            // Apply complexity effects
            if (effects.complexity > 0.3) {
                fragment.classList.add('karma-complex');
            } else {
                fragment.classList.remove('karma-complex');
            }
            
            // Apply corruption effects
            if (effects.corruption > 0.2) {
                fragment.classList.add('karma-corrupted');
            } else {
                fragment.classList.remove('karma-corrupted');
            }
            
            // Apply distortion effects
            if (effects.distortion > 0.4) {
                fragment.classList.add('karma-distorted');
            } else {
                fragment.classList.remove('karma-distorted');
            }
        });
    }
    
    /**
     * Updates karma-related CSS variables
     * @private
     */
    updateKarmaCSSVariables(visualResponse) {
        const root = document.documentElement;
        
        root.style.setProperty('--karma-intensity', visualResponse.intensity);
        root.style.setProperty('--karma-jitter', visualResponse.effects.jitter);
        root.style.setProperty('--karma-complexity', visualResponse.effects.complexity);
        root.style.setProperty('--karma-corruption', visualResponse.effects.corruption);
        root.style.setProperty('--karma-distortion', visualResponse.effects.distortion);
    }
    
    /**
     * Requests audio karma sync
     * @private
     */
    requestAudioKarmaSync(karmaState) {
        if (this.audioEngine && this.audioEngine.updateAudioFromKarma) {
            this.audioEngine.updateAudioFromKarma(karmaState);
        }
    }
    
    /**
     * Calculates event response
     * @private
     */
    calculateEventResponse(eventType, data) {
        const baseIntensity = 0.5;
        
        switch (eventType) {
            case 'attachment_formed':
                return {
                    audioIntensity: 0.3,
                    visualIntensity: 0.4,
                    effects: ['corruption', 'distortion']
                };
            case 'recognition_achieved':
                return {
                    audioIntensity: 1.0,
                    visualIntensity: 1.0,
                    effects: ['purification', 'light']
                };
            case 'degradation_choice':
                return {
                    audioIntensity: 0.6,
                    visualIntensity: 0.7,
                    effects: ['transition', 'fade']
                };
            default:
                return {
                    audioIntensity: baseIntensity,
                    visualIntensity: baseIntensity,
                    effects: ['default']
                };
        }
    }
    
    /**
     * Applies synchronized response
     * @private
     */
    applySynchronizedResponse(response) {
        // Apply audio response
        if (this.audioEngine && response.audioIntensity > 0) {
            this.audioEngine.accelerateDegradation(response.audioIntensity * 0.1);
        }
        
        // Apply visual response
        if (response.visualIntensity > 0) {
            this.applyVisualEventResponse(response);
        }
    }
    
    /**
     * Applies visual event response
     * @private
     */
    applyVisualEventResponse(response) {
        const body = document.body;
        
        response.effects.forEach(effect => {
            body.classList.add(`event-${effect}`);
            
            // Remove effect after duration
            setTimeout(() => {
                body.classList.remove(`event-${effect}`);
            }, 2000);
        });
    }
    
    /**
     * Triggers synchronized purification
     * @private
     */
    triggerSynchronizedPurification() {
        // Audio purification
        if (this.audioEngine && this.audioEngine.achieveResonance) {
            this.audioEngine.achieveResonance();
        }
        
        // Visual purification
        this.applySuccessCelebrationEffects({
            effects: ['purification', 'lightBurst', 'restoration'],
            duration: 3000
        });
    }
    
    /**
     * Triggers synchronized degradation
     * @private
     */
    triggerSynchronizedDegradation() {
        // Audio degradation
        if (this.audioEngine && this.audioEngine.accelerateDegradation) {
            this.audioEngine.accelerateDegradation(0.2);
        }
        
        // Visual degradation
        this.applyFailureFeedbackEffects({
            effects: ['corruption', 'fade', 'distortion'],
            duration: 2000
        });
    }
    
    /**
     * Updates visual CSS variables
     * @private
     */
    updateVisualCSSVariables(visualParams) {
        const root = document.documentElement;
        
        Object.entries(visualParams).forEach(([key, value]) => {
            const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            
            if (typeof value === 'number') {
                if (key === 'chromaticAberration') {
                    root.style.setProperty(cssVar, `${value}px`);
                } else {
                    root.style.setProperty(cssVar, value.toString());
                }
            }
        });
    }

    /**
     * Calculates visual recognition response
     * @private
     */
    calculateVisualRecognitionResponse(method, progress, type) {
        switch (type) {
            case 'attempt':
                return {
                    action: 'progressFeedback',
                    intensity: progress,
                    effects: ['pulse', 'highlight'],
                    duration: 500
                };
            case 'success':
                return {
                    action: 'successCelebration',
                    intensity: 1.0,
                    effects: ['purification', 'lightBurst', 'restoration'],
                    duration: 3000
                };
            case 'failure':
                return {
                    action: 'failureFeedback',
                    intensity: 0.8,
                    effects: ['corruption', 'fade', 'distortion'],
                    duration: 2000
                };
            default:
                return null;
        }
    }
    
    /**
     * Applies recognition feedback to both systems
     * @private
     */
    applyRecognitionFeedback(feedback) {
        // Apply audio feedback
        if (feedback.audioResponse && this.audioEngine) {
            this.applyAudioFeedback(feedback.audioResponse);
        }
        
        // Apply visual feedback
        if (feedback.visualResponse) {
            this.applyVisualFeedback(feedback.visualResponse);
        }
        
        // Record synchronized feedback
        consciousness.recordEvent('synchronized_recognition_feedback', {
            method: feedback.method,
            type: feedback.type,
            progress: feedback.progress,
            hasAudio: !!feedback.audioResponse,
            hasVisual: !!feedback.visualResponse,
            timestamp: feedback.timestamp
        });
    }
    
    /**
     * Applies audio feedback
     * @private
     */
    applyAudioFeedback(audioResponse) {
        if (!this.audioEngine || !this.audioEngine.isInitialized) return;
        
        try {
            switch (audioResponse.action) {
                case 'glitchBurst':
                    this.audioEngine.createGlitchBurst(audioResponse.intensity, audioResponse.duration / 1000);
                    break;
                case 'achieveResonance':
                    this.audioEngine.achieveResonance();
                    break;
                case 'accelerateDegradation':
                    this.audioEngine.accelerateDegradation(audioResponse.intensity);
                    break;
            }
        } catch (error) {
            console.warn('[SynchronizedDegradationController] Audio feedback failed:', error);
        }
    }
    
    /**
     * Applies visual feedback
     * @private
     */
    applyVisualFeedback(visualResponse) {
        try {
            switch (visualResponse.action) {
                case 'progressFeedback':
                    this.applyProgressFeedbackEffects(visualResponse);
                    break;
                case 'successCelebration':
                    this.applySuccessCelebrationEffects(visualResponse);
                    break;
                case 'failureFeedback':
                    this.applyFailureFeedbackEffects(visualResponse);
                    break;
            }
        } catch (error) {
            console.warn('[SynchronizedDegradationController] Visual feedback failed:', error);
        }
    }
    
    /**
     * Applies progress feedback visual effects
     * @private
     */
    applyProgressFeedbackEffects(response) {
        const fragments = document.querySelectorAll('.consciousness-fragment');
        const intensity = response.intensity;
        
        fragments.forEach(fragment => {
            if (response.effects.includes('pulse')) {
                fragment.style.animation = `recognition-pulse ${response.duration}ms ease-out`;
                fragment.style.setProperty('--pulse-intensity', intensity);
            }
            
            if (response.effects.includes('highlight')) {
                fragment.classList.add('recognition-highlight');
                setTimeout(() => {
                    fragment.classList.remove('recognition-highlight');
                }, response.duration);
            }
        });
    }
    
    /**
     * Applies success celebration visual effects
     * @private
     */
    applySuccessCelebrationEffects(response) {
        const body = document.body;
        
        if (response.effects.includes('purification')) {
            body.classList.add('purification-active');
            
            // Trigger corruption progression purification
            if (this.corruptionProgression) {
                const fragments = document.querySelectorAll('.consciousness-fragment');
                this.corruptionProgression.purifyOnRecognition(Array.from(fragments));
            }
        }
        
        if (response.effects.includes('lightBurst')) {
            body.classList.add('light-burst-active');
        }
        
        if (response.effects.includes('restoration')) {
            body.classList.add('restoration-active');
        }
        
        // Remove effects after duration
        setTimeout(() => {
            body.classList.remove('purification-active', 'light-burst-active', 'restoration-active');
        }, response.duration);
    }
    
    /**
     * Applies failure feedback visual effects
     * @private
     */
    applyFailureFeedbackEffects(response) {
        const body = document.body;
        
        if (response.effects.includes('corruption')) {
            body.classList.add('corruption-surge');
        }
        
        if (response.effects.includes('fade')) {
            body.classList.add('recognition-fade');
        }
        
        if (response.effects.includes('distortion')) {
            body.classList.add('distortion-active');
        }
        
        // Remove effects after duration
        setTimeout(() => {
            body.classList.remove('corruption-surge', 'recognition-fade', 'distortion-active');
        }, response.duration);
    }
    
    /**
     * Enhances visual guidance when audio is not available
     * @private
     */
    enhanceVisualGuidance() {
        const body = document.body;
        body.classList.add('audio-fallback-mode');
        
        // Increase visual feedback intensity
        document.documentElement.style.setProperty('--visual-feedback-intensity', '1.5');
        
        // Add visual audio indicators
        this.addVisualAudioIndicators();
        
        console.log('[SynchronizedDegradationController] Enhanced visual guidance activated');
    }
    
    /**
     * Adds visual indicators to replace audio feedback
     * @private
     */
    addVisualAudioIndicators() {
        // Create visual audio indicator
        const indicator = document.createElement('div');
        indicator.id = 'visual-audio-indicator';
        indicator.className = 'visual-audio-indicator';
        indicator.innerHTML = `
            <div class="audio-status">
                <span class="audio-icon">🔇</span>
                <span class="audio-message">Audio unavailable - Enhanced visual mode active</span>
            </div>
        `;
        
        document.body.appendChild(indicator);
        this.audioFallback.fallbackEffects.add('audioIndicator');
        
        // Add visual rhythm indicator to replace audio rhythm
        const rhythmIndicator = document.createElement('div');
        rhythmIndicator.id = 'visual-rhythm-indicator';
        rhythmIndicator.className = 'visual-rhythm-indicator';
        document.body.appendChild(rhythmIndicator);
        this.audioFallback.fallbackEffects.add('rhythmIndicator');
        
        // Start visual rhythm animation
        this.startVisualRhythm();
    }
    
    /**
     * Removes visual audio indicators
     * @private
     */
    removeVisualAudioIndicators() {
        const indicator = document.getElementById('visual-audio-indicator');
        const rhythmIndicator = document.getElementById('visual-rhythm-indicator');
        
        if (indicator) {
            indicator.remove();
            this.audioFallback.fallbackEffects.delete('audioIndicator');
        }
        
        if (rhythmIndicator) {
            rhythmIndicator.remove();
            this.audioFallback.fallbackEffects.delete('rhythmIndicator');
        }
        
        this.stopVisualRhythm();
    }
    
    /**
     * Starts visual rhythm to replace audio rhythm
     * @private
     */
    startVisualRhythm() {
        const rhythmIndicator = document.getElementById('visual-rhythm-indicator');
        if (!rhythmIndicator) return;
        
        // Create pulsing animation to replace audio rhythm
        const pulseInterval = setInterval(() => {
            rhythmIndicator.classList.add('pulse');
            setTimeout(() => {
                rhythmIndicator.classList.remove('pulse');
            }, 200);
        }, 1000);
        
        this.guardian.registerTimer(pulseInterval);
        this.audioFallback.fallbackEffects.add('rhythmAnimation');
    }
    
    /**
     * Stops visual rhythm
     * @private
     */
    stopVisualRhythm() {
        this.audioFallback.fallbackEffects.delete('rhythmAnimation');
    }
    
    /**
     * Restores normal visual guidance
     * @private
     */
    restoreNormalVisualGuidance() {
        const body = document.body;
        body.classList.remove('audio-fallback-mode');
        
        // Restore normal visual feedback intensity
        document.documentElement.style.removeProperty('--visual-feedback-intensity');
        
        console.log('[SynchronizedDegradationController] Normal visual guidance restored');
    }
    
    /**
     * Increases visual feedback intensity
     * @private
     */
    increaseVisualFeedbackIntensity() {
        this.audioFallback.visualGuidanceLevel = 1.5;
        document.documentElement.style.setProperty('--fallback-intensity', '1.5');
    }
    
    /**
     * Restores normal visual feedback intensity
     * @private
     */
    restoreNormalVisualFeedbackIntensity() {
        this.audioFallback.visualGuidanceLevel = 1.0;
        document.documentElement.style.removeProperty('--fallback-intensity');
    }
    
    /**
     * Starts the synchronization monitoring loop
     * @private
     */
    startSynchronizationLoop() {
        const syncLoop = setInterval(() => {
            this.checkSynchronizationHealth();
        }, this.syncState.syncInterval);
        
        this.guardian.registerTimer(syncLoop);
        
        console.log('[SynchronizedDegradationController] Synchronization monitoring loop started');
    }
    
    /**
     * Checks synchronization health and corrects drift
     * @private
     */
    checkSynchronizationHealth() {
        const now = Date.now();
        const timeSinceLastSync = now - this.syncState.lastSync;
        
        // Check for sync drift
        if (timeSinceLastSync > 1000) { // More than 1 second since last sync
            this.performSyncHealthCheck();
        }
        
        // Monitor performance metrics
        this.updatePerformanceMetrics();
    }
    
    /**
     * Performs a health check and corrects any sync issues
     * @private
     */
    performSyncHealthCheck() {
        // Check audio-visual level alignment
        const levelDifference = Math.abs(this.syncState.audioLevel - this.syncState.visualLevel);
        
        if (levelDifference > this.syncState.syncThreshold) {
            console.warn(`[SynchronizedDegradationController] Sync drift detected: ${levelDifference.toFixed(3)}`);
            
            // Correct the drift
            this.correctSyncDrift();
            this.performanceMetrics.missedSyncs++;
        }
    }
    
    /**
     * Corrects synchronization drift
     * @private
     */
    correctSyncDrift() {
        // Re-sync visual with current audio level
        if (this.audioEngine && this.audioEngine.isInitialized) {
            const currentAudioLevel = this.audioEngine.getDegradationLevel();
            this.synchronizeVisualWithAudio(currentAudioLevel, 'drift_correction');
        }
        
        console.log('[SynchronizedDegradationController] Sync drift corrected');
    }
    
    /**
     * Updates performance metrics
     * @private
     */
    updatePerformanceMetrics() {
        // Clean up old latency measurements (keep last 100)
        if (this.performanceMetrics.syncLatency.length > 100) {
            this.performanceMetrics.syncLatency = this.performanceMetrics.syncLatency.slice(-100);
        }
    }
    
    /**
     * Parses audio level to numeric value
     * @private
     */
    parseAudioLevel(audioLevel) {
        if (typeof audioLevel === 'number') {
            return Math.max(0, Math.min(1, audioLevel));
        }
        
        const levelMap = {
            'minimal': 0.2,
            'moderate': 0.5,
            'severe': 0.8,
            'complete': 1.0
        };
        
        return levelMap[audioLevel] || 0.2;
    }
    
    /**
     * Gets current synchronization status
     */
    getSynchronizationStatus() {
        return {
            syncState: { ...this.syncState },
            audioFallback: { ...this.audioFallback },
            performanceMetrics: { ...this.performanceMetrics },
            isHealthy: this.performanceMetrics.missedSyncs < 5
        };
    }
    
    /**
     * Cleanup method
     */
    destroy() {
        console.log('[SynchronizedDegradationController] Destroying synchronized degradation controller...');
        
        // Deactivate audio fallback if active
        if (this.audioFallback.isActive) {
            this.deactivateAudioFallback();
        }
        
        // Clean up fallback effects
        this.audioFallback.fallbackEffects.clear();
        
        // Cleanup resources
        this.guardian.cleanupAll();
        
        console.log('[SynchronizedDegradationController] Destroyed');
    }
}