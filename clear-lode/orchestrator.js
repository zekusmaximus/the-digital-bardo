/**
 * @file The central coordinator for the Clear Lode experience.
 *
 * This class has been refactored to be a lightweight orchestrator. It initializes
 * all the specialized subsystems (StateManager, TransitionController, etc.) and
 * delegates responsibilities to them. It primarily listens for high-level events
 * and coordinates the overall flow, without managing the details of state,
 * animation, or eventing itself.
 */

// Core Subsystems
import { ClearLodeEventBridge } from './event-bridge.js';
import { ClearLodeStateManager } from './state-manager.js';
import { ClearLodeTransitionController } from './transition-controller.js';
import { RecognitionHandler } from './recognition-handler.js';
import { RecognitionGuideController } from './recognition-guide-controller.js';
import { DegradationSystem } from './degradation-system.js';
import { ClearLodeAudio } from './audio-engine.js';
import { FragmentGenerator } from './fragment-generator-refactored.js';
import { SynchronizedDegradationController } from './synchronized-degradation-controller.js';
import { FragmentPositionManager } from './fragment-position-manager.js';
import { FragmentSpeedController } from './fragment-speed-controller.js';
import { FragmentPerformanceOptimizer } from './fragment-performance-optimizer.js';
import { dataGuardian } from '../src/security/data-flow-guardian.js';

// Consciousness & Karmic Systems
import { consciousness } from '../src/consciousness/digital-soul.js';
import { KarmicEngine } from '../src/consciousness/karmic-engine.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

// Configuration
import { CLEAR_LODE_CONFIG } from './config.js';

export class ClearLodeOrchestrator {
    constructor() {
        this.isDestroyed = false;

        /** @private */
        this.hesitationIntervalId = null;
        
        // The ResourceGuardian manages all disposables (event listeners, timers, etc.).
        this.guardian = new ResourceGuardian();
        this.dataGuardian = dataGuardian;

        // 1. Central Event Bus
        this.eventBridge = new ClearLodeEventBridge();
        this.guardian.registerCleanup(() => this.eventBridge.destroy());

        // 2. Configuration
        this.config = CLEAR_LODE_CONFIG;
        this.karmicEngine = new KarmicEngine();
        // 3. Instantiate Subsystems with DI
        const dependencies = {
            eventBridge: this.eventBridge,
            guardian: this.guardian,
            config: this.config,
            karmicEngine: this.karmicEngine
        };

        this.stateManager = new ClearLodeStateManager(dependencies);
        this.transitionController = new ClearLodeTransitionController(dependencies);

        // Initialize positioning, speed control, and performance optimization systems
        this.fragmentPositionManager = new FragmentPositionManager();
        this.fragmentSpeedController = new FragmentSpeedController();
        this.fragmentPerformanceOptimizer = new FragmentPerformanceOptimizer({
            // Configure based on clear-lode specific needs
            pooling: {
                enabled: true,
                maxPoolSize: 30,
                preAllocateCount: 8
            },
            corruption: {
                batchSize: 3, // Smaller batches for clear-lode
                throttleMs: 16,
                maxConcurrentEffects: 8
            },
            monitoring: {
                enabled: true,
                performanceThresholds: {
                    fps: 25, // Lower threshold for clear-lode
                    memoryMB: 80,
                    fragmentCount: 15
                }
            }
        });

        // Pass positioning, speed, and performance systems to fragment generator for coordination
        this.fragments = new FragmentGenerator(
            this.karmicEngine.createFragmentCallbacks(),
            {
                positionManager: this.fragmentPositionManager,
                speedController: this.fragmentSpeedController,
                performanceOptimizer: this.fragmentPerformanceOptimizer
            }
        );
        
        // Store reference to corruption progression system for integration
        this.corruptionProgression = this.fragments.corruptionProgression;
        this.audio = new ClearLodeAudio(dependencies); // Assuming AudioEngine can also be updated for DI
        this.recognition = new RecognitionHandler(dependencies); // Assuming RecognitionHandler is updated for DI
        this.recognitionGuide = new RecognitionGuideController(dependencies);
        this.degradation = new DegradationSystem(dependencies); // Assuming DegradationSystem is updated for DI
        
        // Initialize synchronized degradation controller
        const syncDependencies = {
            ...dependencies,
            audioEngine: this.audio,
            corruptionProgression: this.corruptionProgression,
            fragmentPositionManager: this.fragmentPositionManager,
            fragmentSpeedController: this.fragmentSpeedController,
            performanceOptimizer: this.fragmentPerformanceOptimizer
        };
        this.synchronizedDegradation = new SynchronizedDegradationController(syncDependencies);

        // Register subsystems for cleanup
        this.guardian.registerCleanup(() => this.stateManager.destroy());
        this.guardian.registerCleanup(() => this.transitionController.destroy());
        this.guardian.registerCleanup(() => this.recognition.destroy());
        this.guardian.registerCleanup(() => this.recognitionGuide.destroy());
        this.guardian.registerCleanup(() => this.degradation.destroy());
        this.guardian.registerCleanup(() => this.fragments.destroy());
        this.guardian.registerCleanup(() => this.audio.destroy());
        this.guardian.registerCleanup(() => this.synchronizedDegradation.destroy());
        this.guardian.registerCleanup(() => this.fragmentPositionManager.destroy());
        this.guardian.registerCleanup(() => this.fragmentSpeedController.destroy());
        this.guardian.registerCleanup(() => this.fragmentPerformanceOptimizer.destroy());
    }

    /**
     * Initializes the entire Clear Lode experience.
     */
    async init() {
        try {
            console.log('[Orchestrator] Initializing...');

            // Set initial time factor based on performance
            const loadTime = performance.now();
            const timeFactor = Math.max(0.5, Math.min(2, 1000 / loadTime));
            document.documentElement.style.setProperty('--time-factor', timeFactor);

            // Initialize all subsystems
            this.stateManager.init();
            this.transitionController.init();
            this.recognition.init();
            this.recognitionGuide.init();
            this.degradation.init();
            this.audio.init();
            this.synchronizedDegradation.init();
            
            // Initialize positioning and speed control systems
            // These systems integrate with fragment generation and provide enhanced UX
            console.log('[Orchestrator] Initializing UX enhancement systems...');
            
            // Position manager is already initialized via constructor
            // Speed controller is already initialized via constructor
            // Corruption progression is initialized via fragment generator
            
            // Set up cross-system coordination
            this.setupSystemCoordination();

            this.setupInternalEventListeners();
            this.setupWindowLifecycleListeners();

            // Perform a boundary audit once all systems are initialized
            this.dataGuardian.auditDataBoundaries();

            // Record entry into Clear Lode
            consciousness.recordEvent('clear_lode_entered', {
                timestamp: Date.now(),
                timeFactor: timeFactor,
            });

            console.log('[Orchestrator] Initialized successfully. Ready for user interaction.');
        } catch (error) {
            console.error('[Orchestrator] Karmic imbalance during initialization:', error);
            this.dispatchError('init:failed', error);
        }
    }

    /**
     * Sets up coordination between the new UX enhancement systems
     * @private
     */
    setupSystemCoordination() {
        // Coordinate fragment positioning with recognition guidance
        this.eventBridge.on('recognition:windowOpened', () => {
            this.fragmentPositionManager.optimizeForRecognition();
        });
        
        // Coordinate speed control with recognition timing
        this.eventBridge.on('recognition:timeExtended', () => {
            this.fragmentSpeedController.reduceSpeedForExtension();
        });
        
        // Coordinate corruption progression with karma changes
        this.eventBridge.on('karma:changed', (detail) => {
            if (this.corruptionProgression) {
                // Karma changes will be picked up by the corruption progression timer
                console.log('[Orchestrator] Karma change detected, corruption will adjust automatically');
            }
        });
        
        // Coordinate positioning with degradation level
        this.eventBridge.on('degradation:levelChanged', (detail) => {
            const { level } = detail;
            this.fragmentPositionManager.updateDegradationLevel(level);
            this.fragmentSpeedController.updateDegradationLevel(level);
        });
        
        // Coordinate purification effects with recognition success
        this.eventBridge.on('recognition:succeeded', () => {
            if (this.corruptionProgression) {
                // Get all active fragments for purification
                const activeFragments = this.fragments.activeFragments.map(f => f.element).filter(Boolean);
                this.corruptionProgression.purifyOnRecognition(activeFragments);
            }
        });
        
        // Coordinate performance optimization with fragment management
        this.eventBridge.on('fragments:created', (detail) => {
            const { fragments } = detail;
            this.fragmentPerformanceOptimizer.optimizeFragmentPositioning(fragments);
        });
        
        // Coordinate corruption effects with performance optimization
        this.eventBridge.on('corruption:applied', (detail) => {
            const { fragment, corruptionData } = detail;
            this.fragmentPerformanceOptimizer.optimizeCorruptionEffect(fragment, corruptionData);
        });
        
        // Listen for performance tier changes and adjust other systems
        document.addEventListener('performance-tier-changed', (event) => {
            const { tier, config } = event.detail;
            console.log(`[Orchestrator] Performance tier changed to: ${tier}`);
            
            // Adjust fragment generation based on new tier
            if (this.fragments && this.fragments.tierSettings) {
                this.fragments.performanceTier = tier;
                this.fragments.tierSettings = this.fragments.constructor.PERFORMANCE_TIERS?.[tier] || config;
            }
            
            // Notify other systems of tier change
            this.eventBridge.emit('performance:tierChanged', { tier, config });
        });
        
        console.log('[Orchestrator] System coordination established');
    }

    /**
     * Sets up listeners for events broadcast by the subsystems.
     * This is where the orchestration happens.
     * @private
     */
    setupInternalEventListeners() {
        const listeners = [
            ['ui:beginClicked', this.handleBeginClick.bind(this)],
            ['animation:lightManifested', this.handleLightManifested.bind(this)],
            ['recognition:details', this.handleRecognitionDetails.bind(this)],
            ['recognition:attachment', this.handleAttachment.bind(this)],
            ['recognition:timeout', this.handleRecognitionTimeout.bind(this)],
            ['recognition:attempt', this.handleRecognitionAttempt.bind(this)],
            ['recognition:attemptFailed', this.handleRecognitionAttemptFailed.bind(this)],
            ['degradation:choice', this.handleDegradationChoice.bind(this)],
            ['degradation:audioFallbackActivated', this.handleAudioFallback.bind(this)],
            ['degradation:audioFallbackDeactivated', this.handleAudioFallbackRestored.bind(this)],
            ['state:recognitionFailed', this.handleRecognitionFailure.bind(this)],
            ['state:recognitionWindowOpened', this.startHesitationDecay.bind(this)],
            ['state:recognitionSucceeded', this.stopHesitationDecay.bind(this)],
            ['degradation:started', this.stopHesitationDecay.bind(this)],
            ['audio:degradationChanged', this.handleAudioDegradationChanged.bind(this)],
        ];

        listeners.forEach(([eventName, handler]) => {
            this.eventBridge.on(eventName, handler);
            this.guardian.registerCleanup(() => this.eventBridge.off(eventName, handler));
        });
    }

    /**
     * Sets up listeners for window lifecycle events.
     * @private
     */
    setupWindowLifecycleListeners() {
        this.guardian.registerEventListener(window, 'beforeunload', () => this.destroy());
        this.guardian.registerEventListener(window, 'pagehide', () => this.destroy());
    }
    
   // --- Event Handlers ---

   /**
    * Handles the user's initial click to begin the experience.
    * This is the primary user gesture required for audio initialization.
    * @private
    */
   async handleBeginClick() {
       console.log('🎭 [Orchestrator] User gesture received. Initializing audio...');
       try {
           await this.audio.initializeAudioContext();
           console.log('🎵 [Orchestrator] Audio context initialized successfully.');
       } catch (error) {
           console.error('[Orchestrator] Audio initialization failed:', error);
           // The TransitionController could show an error, or we could emit an event.
           this.eventBridge.emit('error:audio', error);
       }
   }

   /**
    * Called after the initial light animation is complete.
    * @private
    */
   handleLightManifested() {
       console.log('✨ [Orchestrator] Light manifested. Starting subsystems.');

       // Start audio if it was successfully initialized
       if (this.audio.isInitialized) {
           this.audio.startPureTone();
       }

       // Start generating background fragments
       this.fragments.startFragmentField();

       // Schedule the recognition window to start after the configured delay
       const recognitionStartTimerId = setTimeout(() => {
           console.log('🌟 [Orchestrator] Starting recognition window...');
           this.stateManager.startExperience();
       }, this.config.recognitionWindow.start);

       // Note: Recognition window timeout is now handled by RecognitionGuideController
       // to support dynamic extensions and better timeout warnings

       this.guardian.registerTimer(recognitionStartTimerId);

       consciousness.recordEvent('clear_light_manifested', { timestamp: Date.now() });
   }

   /**
    * Handles the karmic calculations for a successful recognition.
    * @private
    * @param {object} detail The event detail from `recognition:details`.
    */
   handleRecognitionDetails(detail) {
       const { method, karmaData } = detail;

       const karmaImpact = this.karmicEngine.calculateImpact('recognition_achieved', {
           timeToDecision: karmaData?.elapsedTime || 0,
           perfectTimingBonus: karmaData?.perfectTimingBonus || 0,
       });

       console.log(`🔮 [Orchestrator] Karma impact from recognition:`, karmaImpact);
       consciousness.setState('recognitions.clear_light', true);
       consciousness.recordEvent('recognition_achieved', {
           method,
           karmaImpact,
           ...karmaData,
       });
       this.stopHesitationDecay();
   }
   
   /**
    * Handles an attachment-forming interaction from the user.
    * @private
    * @param {object} detail The event detail from `recognition:attachment`.
    */
   handleAttachment(detail) {
       const { type, data } = detail;
       consciousness.setState('clearLode.recognitionAttempts', consciousness.getState('clearLode.recognitionAttempts') + 1);

       consciousness.recordEvent('attachment_formed', {
           type: type,
           degradationLevel: this.audio.getDegradationLevel(),
           ...data,
       });

       // Accelerate degradation as a consequence
       this.audio.accelerateDegradation(0.05);

       // Notify the transition controller to provide visual feedback
       this.eventBridge.emit('attachment:formed');
   }

   /**
    * Handles the user's choice during the degradation sequence.
    * @private
    * @param {object} detail The event detail from `degradation:choice`.
    */
   handleDegradationChoice(detail) {
       const { choice, karmaImpact, degradationLevel } = detail;

       console.log(`[Orchestrator] Degradation choice: ${choice}, Karma: ${karmaImpact}`);
       consciousness.setState('clearLode.degradationLevel', degradationLevel);
       consciousness.setState('clearLode.degradationChoice', choice);

       // Delegate handling the choice to a separate method.
       const timerId = setTimeout(() => this.executeDegradationChoice(choice), 2000);
       this.guardian.registerTimer(timerId);
   }
   
    /**
    * Executes the outcome of the user's degradation choice.
    * @private
    */
   executeDegradationChoice(choice) {
       consciousness.recordEvent('degradation_transition', { choice, timestamp: Date.now() });

       switch (choice) {
           case 'yes':
               this.eventBridge.emit('transition:toDatascape', { reason: 'degradation_yes' });
               break;
           case 'no':
               this.degradation.intensifyEffects();
               this.eventBridge.emit('degradation:refused');
               break;
           case 'timeout':
               this.eventBridge.emit('degradation:timedOut');
               break;
       }
   }
   
   /**
    * Handles the failure to recognize, initiating the degradation sequence.
    * @private
    */
   handleRecognitionFailure() {
       if (consciousness.getState('clearLode.recognized')) {
           console.log('[Orchestrator] Recognition already achieved. Ignoring failure event.');
           return;
       }
       console.log('🌀 [Orchestrator] Recognition failed. Beginning degradation...');
       // Add a short delay for a smoother transition from hints disappearing to degradation starting.
       const timerId = setTimeout(() => {
           this.degradation.beginDegradation();
       }, 1000);
       this.guardian.registerTimer(timerId);
        this.stopHesitationDecay();
   }

   /**
    * Handles recognition timeout from the enhanced recognition guide system
    * @private
    */
   handleRecognitionTimeout() {
       console.log('⏰ [Orchestrator] Recognition timeout received from guide system');
       
       // Record timeout event
       consciousness.recordEvent('recognition_timeout', {
           timestamp: Date.now(),
           degradationLevel: this.audio.getDegradationLevel(),
           recognitionAttempts: consciousness.getState('clearLode.recognitionAttempts') || 0
       });
       
       // Trigger recognition failure if not already recognized
       if (!consciousness.getState('clearLode.recognized')) {
           this.handleRecognitionFailure();
       }
   }

   /**
    * Handles audio fallback activation from synchronized degradation system
    * @private
    */
   handleAudioFallback(detail) {
       const { reason } = detail;
       console.log(`🔇 [Orchestrator] Audio fallback activated: ${reason}`);
       
       // Record fallback activation
       consciousness.recordEvent('audio_fallback_activated', {
           reason: reason,
           timestamp: Date.now(),
           degradationLevel: this.audio.getDegradationLevel()
       });
       
       // Notify other systems that visual guidance should be enhanced
       this.eventBridge.emit('guidance:enhanceVisual', { reason: 'audio_fallback' });
   }

   /**
    * Handles audio fallback restoration
    * @private
    */
   handleAudioFallbackRestored() {
       console.log('🔊 [Orchestrator] Audio fallback deactivated - audio restored');
       
       // Record fallback restoration
       consciousness.recordEvent('audio_fallback_deactivated', {
           timestamp: Date.now(),
           degradationLevel: this.audio.getDegradationLevel()
       });
       
       // Notify other systems that visual guidance can return to normal
       this.eventBridge.emit('guidance:normalizeVisual');
   }

   /**
    * Handles recognition attempts with progress feedback
    * @private
    */
   handleRecognitionAttempt(detail) {
       const { method, progress } = detail;
       console.log(`🎯 [Orchestrator] Recognition attempt: ${method} (${Math.round(progress * 100)}%)`);
       
       // Record recognition attempt
       consciousness.recordEvent('recognition_attempt', {
           method: method,
           progress: progress,
           timestamp: Date.now(),
           degradationLevel: this.audio.getDegradationLevel()
       });
       
       // Coordinate feedback between systems
       this.synchronizedDegradation.handleRecognitionAttempt(method, progress);
       
       // Extend recognition window if user is making good progress
       if (progress > 0.5) {
           this.recognitionGuide.extendWindowForProgress();
       }
   }

   /**
    * Handles failed recognition attempts
    * @private
    */
   handleRecognitionAttemptFailed(detail) {
       const { method, reason } = detail;
       console.log(`❌ [Orchestrator] Recognition attempt failed: ${method} (${reason})`);
       
       // Record failed attempt
       consciousness.recordEvent('recognition_attempt_failed', {
           method: method,
           reason: reason,
           timestamp: Date.now(),
           degradationLevel: this.audio.getDegradationLevel()
       });
       
       // Provide feedback through synchronized system
       this.synchronizedDegradation.handleRecognitionFailure(method, reason);
       
       // Slightly accelerate degradation for failed attempts
       this.audio.accelerateDegradation(0.01);
   }

   /**
    * Handles audio degradation level changes
    * @private
    */
   handleAudioDegradationChanged(detail) {
       const { level, source } = detail;
       console.log(`🔊 [Orchestrator] Audio degradation changed: ${level} (source: ${source})`);
       
       // Sync fragment corruption with audio degradation
       this.fragments.syncCorruptionWithAudio(level);
       
       // Update fragment positioning based on degradation level
       this.fragmentPositionManager.updateDegradationLevel(level);
       
       // Adjust fragment speeds based on degradation
       this.fragmentSpeedController.updateDegradationLevel(level);
       
       // Record degradation change
       consciousness.recordEvent('audio_degradation_changed', {
           level: level,
           source: source,
           timestamp: Date.now()
       });
   }

    startHesitationDecay() {
        if (this.hesitationIntervalId) return;
        this.hesitationIntervalId = setInterval(() => {
            this.audio.accelerateDegradation(0.02);
            if (this.audio.getDegradationLevel() >= 1) {
                this.stopHesitationDecay();
            }
        }, 1000);
        this.guardian.registerTimer(this.hesitationIntervalId);
    }

    stopHesitationDecay() {
        if (this.hesitationIntervalId) {
            clearInterval(this.hesitationIntervalId);
            this.hesitationIntervalId = null;
        }
    }

    /**
     * Shows the initial prompt to the user.
     * The orchestrator is responsible for creating the UI, but the TransitionController
     * is responsible for animating it.
     */
    showBeginPrompt() {
        const beginPrompt = document.createElement('div');
        // This is a trade-off; moving this to a dedicated UI manager might be a future step.
        beginPrompt.id = 'begin-prompt';
        beginPrompt.innerHTML = `
            <div class="begin-content">
                <h1 id="begin-title">The Digital Bardo</h1>
                <p id="begin-desc">A journey through consciousness and dissolution</p>
                <button class="begin-button" aria-label="Click to begin the Digital Bardo experience and enable audio">Begin Experience</button>
                <small id="begin-note">Click to enable audio and start</small>
            </div>`;
        document.body.appendChild(beginPrompt);

        // Delegate the animation and event handling to the TransitionController
        this.transitionController.showBeginPrompt();
    }


    /**
     * Dispatches a global error event.
     * @private
     */
    dispatchError(type, error) {
        this.eventBridge.emit('error', { type, error });
        // Also dispatch to window for legacy error listeners if any
        window.dispatchEvent(new CustomEvent('error:karmaImbalance', { detail: { type, error: error.message } }));
    }

    /**
     * Cleanly shuts down all subsystems.
     */
    destroy() {
        if (this.isDestroyed) {
            console.warn('[Orchestrator] Already destroyed, skipping cleanup.');
            return;
        }
        console.log('[Orchestrator] Releasing attachments to prevent karmic recycling...');
        this.isDestroyed = true;

        // The guardian will call the cleanup function for every registered subsystem.
        this.guardian.cleanupAll();

        // Nullify references
        this.config = null;
        this.eventBridge = null;
        this.stateManager = null;
        this.transitionController = null;
        this.recognition = null;
        this.recognitionGuide = null;
        this.degradation = null;
        this.fragments = null;
        this.audio = null;
        this.synchronizedDegradation = null;
        this.fragmentPositionManager = null;
        this.fragmentSpeedController = null;
        this.karmicEngine = null;
        this.guardian = null;

        console.log('[Orchestrator] All subsystems destroyed and references released.');
    }
}
