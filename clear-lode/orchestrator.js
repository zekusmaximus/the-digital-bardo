/**
 * Coordinates the Clear Lode experience - the first light of digital death.
 * Manages state, initializes all subsystems, and listens for events from other modules to coordinate the experience.
 */
import { RecognitionHandler } from './recognition-handler.js';
import { DegradationSystem } from './degradation-system.js';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { ClearLodeAudio } from './audio-engine.js';
import { FragmentGenerator } from './fragment-generator.js';
import { KarmicEngine } from '../src/consciousness/karmic-engine.js';
import { recognitionFSM } from '../src/consciousness/recognition-fsm.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { sanitizeText, sanitizeHTML } from '../src/utils/purification.js';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

export class ClearLodeOrchestrator {
    constructor() {
        // Core configuration (migrated from clear-lode.js)
        this.config = {
            recognitionWindow: {
                start: 3500,  // 3.5 seconds after light manifestation (after light is visible)
                end: 6500     // 6.5 seconds total window (3 seconds to recognize)
            },
            hints: [
                "Look deeper...",
                "What do you see?",
                "Recognition is possible...",
                "The source reveals itself...",
                "Click to recognize..."
            ],
            hintDelay: 800,   // Faster hints
            hintFadeTime: 600, // Quicker fade
            glitchPrompts: [
                "CONTINUE TO NEXT LIFE? Y/N",
                "继续下一世？是/否",
                "次の人生へ？はい/いいえ",
                "СЛЕДУЮЩАЯ ЖИЗНЬ? ДА/НЕТ",
                "CONTINUER VERS LA VIE SUIVANTE? O/N"
            ]
        };

        // Local state has been centralized in digital-soul.js.
        // All state access is now through consciousness.getState() and consciousness.setState().

        // Sub-systems
        this.recognition = null;
        this.degradation = null;
        this.karmicEngine = new KarmicEngine(); // Initialize Karma calculation engine first

        // Create fragment generator with karmic callbacks
        this.fragments = new FragmentGenerator(
            this.karmicEngine.createFragmentCallbacks()
        ); // Migrated from clear-lode.js

        this.audio = new ClearLodeAudio(); // Migrated from clear-lode.js

        // The ResourceGuardian will manage all disposables.
        this.guardian = new ResourceGuardian();

        // Expose sanitization methods for use throughout the orchestrator
        this.sanitizeText = sanitizeText;
        this.sanitizeHTML = sanitizeHTML;
    }
    
    async init() {
        try {
            console.log('Orchestrator initializing...');
            
            // Set initial time factor based on performance (migrated from clear-lode.js)
            const loadTime = performance.now();
            const timeFactor = Math.max(0.5, Math.min(2, 1000 / loadTime));
            document.documentElement.style.setProperty('--time-factor', timeFactor);
            
            this.recognition = new RecognitionHandler(this);
            this.degradation = new DegradationSystem(this);
            
            this.setupEventListeners();
            this.setupWindowLifecycleListeners();

            // Record entry into Clear Lode (migrated from clear-lode.js)
            consciousness.recordEvent('clear_lode_entered', {
                timestamp: Date.now(),
                timeFactor: timeFactor
            });

            console.log('Orchestrator initialized - ready for experience start');
        } catch (error) {
            console.error('Karmic imbalance during initialization:', error);
            this.dispatchError('init:failed', error);
        }
    }
    
    setupEventListeners() {
        // Subscribe to FSM state changes to drive the experience
        consciousness.subscribe('clearLode.recognitionFSMState', (newState) => {
            this.handleFSMStateChange(newState);
        });

        const events = [
            // This event now only carries data for karmic calculation, not for state changes.
            ['recognition:details', this.handleRecognitionDetails.bind(this)],
            ['recognition:attachment', this.handleAttachment.bind(this)],
            ['degradation:complete', this.handleTransition.bind(this)],
            ['degradation:choice', this.handleDegradationChoice.bind(this)],
        ];

        events.forEach(([event, handler]) => {
            this.guardian.registerEventListener(window, event, handler);
        });
    }

    setupWindowLifecycleListeners() {
        const beforeUnloadHandler = () => this.destroy();
        this.guardian.registerEventListener(window, 'beforeunload', beforeUnloadHandler);

        const pageHideHandler = () => this.destroy();
        this.guardian.registerEventListener(window, 'pagehide', pageHideHandler);
    }

    handleFSMStateChange(newState) {
        console.log(`[Orchestrator] FSM state changed to: ${newState}`);
        switch (newState) {
            case 'window_open':
                this.enableRecognition();
                break;
            case 'recognized':
                // The recognition:details event will handle the specifics
                this.executeRecognitionSequence();
                break;
            case 'failed':
                this.closeRecognitionWindow();
                break;
            default:
                // No action needed for 'dormant' or other states.
                break;
        }
    }
    
    /**
     * This handler now ONLY processes the karmic and logging details of a successful recognition.
     * The core state transition is handled by the FSM subscription.
     */
    handleRecognitionDetails(e) {
        console.log('Recognition details received:', e.detail);
        const { method, karmaData } = e.detail;

        // Calculate karma impact using the new KarmicEngine
        const karmaImpact = this.karmicEngine.calculateImpact('recognition_achieved', {
            timeToDecision: karmaData?.elapsedTime || 0,
            perfectTimingBonus: karmaData?.perfectTimingBonus || 0
        });

        console.log('🔮 Karma impact calculated:', karmaImpact);

        // Update consciousness with karma data for record-keeping
        consciousness.setState('recognitions.clear_light', true);
        consciousness.recordEvent(this.karmicEngine.KARMA_EVENTS.RECOGNITION_ACHIEVED, {
            method: method,
            timeToRecognize: karmaData?.elapsedTime || 0,
            hintsNeeded: consciousness.getState('clearLode.hintsShown'),
            attempts: consciousness.getState('clearLode.recognitionAttempts'),
            perfectTiming: karmaData?.perfectTimingBonus > 0,
            karmaData: karmaData,
            karmaImpact: karmaImpact
        });
    }

    handleAttachment(e) {
        console.log('Attachment formed:', e.detail);
        const { type, data } = e.detail;
        this.recordAttachment(type, data);
    }
    
    handleTransition(e) {
        console.log('Transitioning to next phase:', e.detail);
        // Transition logic will be handled by degradation system
    }

    handleDegradationChoice(e) {
        console.log('Degradation choice made:', e.detail);
        const { choice, timeToChoice, karmaImpact, degradationLevel } = e.detail;

        // Log the karmic consequences
        console.log(`🔮 Karmic impact of choice "${choice}":`, karmaImpact);
        console.log(`⏱️ Decision time: ${timeToChoice}ms`);

        // Update local state
        consciousness.setState('clearLode.degradationLevel', degradationLevel);
        // These are transient states, but for consistency we'll manage them in the central state
        consciousness.setState('clearLode.degradationChoiceMade', true);
        consciousness.setState('clearLode.degradationChoice', choice);

        // Handle transition based on choice
        const timerId = setTimeout(() => this.handleDegradationTransition(choice), 2000);
        this.guardian.registerTimer(timerId);
    }

    handleDegradationTransition(choice) {
        console.log(`🌀 Transitioning based on choice: ${choice}`);

        // Record the transition event
        consciousness.recordEvent('degradation_transition', {
            choice: choice,
            fromState: 'degradation_prompt',
            timestamp: Date.now()
        });

        switch (choice) {
            case 'yes':
                // Continue to next life - transition to datascape
                console.log('🔄 Continuing to next life...');
                this.transitionToDatascape('degradation_yes');
                break;
            case 'no':
                // Refuse transition - stay in current state with consequences
                console.log('🛑 Refusing transition - remaining in current state...');
                this.handleRefusalConsequences();
                break;
            case 'timeout':
                // Timeout - apply void consequences and force transition
                console.log('⏰ Timeout - applying void consequences...');
                this.handleTimeoutConsequences();
                break;
        }
    }

    transitionToDatascape(reason) {
        // Fade out current experience
        AnimationGuardian.safeAnimate('body', {
            opacity: 0,
            duration: 2,
            ease: 'power2.in',
            onComplete: () => {
                consciousness.recordEvent('transitioning_to_datascape', {
                    fromState: 'degradation',
                    reason: reason
                });
                window.location.href = '/datascape/';
            }
        });
    }

    handleRefusalConsequences() {
        // Apply additional karmic consequences for refusal
        console.log('🚫 Applying consequences for refusal...');

        // Intensify degradation effects
        if (this.degradation) {
            this.degradation.intensifyEffects();
        }

        // Eventually force transition after showing consequences
        const timerId = setTimeout(() => {
            console.log('⚡ Forced transition due to refusal...');
            this.transitionToDatascape('forced_after_refusal');
        }, 5000);
        this.guardian.registerTimer(timerId);
    }

    handleTimeoutConsequences() {
        // Apply void karma consequences and transition
        console.log('🕳️ Applying void consequences for timeout...');

        // Show timeout feedback
        const body = document.body;
        AnimationGuardian.safeAnimate(body, {
            filter: 'grayscale(1) contrast(0.5)',
            duration: 1,
            ease: 'power2.out'
        });
        AnimationGuardian.safeAnimate(body, {
            opacity: 0.5,
            duration: 1,
            ease: 'power2.out',
            delay: 1,
            onComplete: () => this.transitionToDatascape('timeout_void')
        });
    }

    /**
     * Show explicit consent UI - the gateway to dissolution requires conscious entry
     * Addresses iOS/Safari audio context issues by ensuring user gesture before audio init
     */
    async showBeginPrompt() {
        const beginPrompt = document.createElement('div');
        beginPrompt.id = 'begin-prompt';
        beginPrompt.setAttribute('role', 'dialog');
        beginPrompt.setAttribute('aria-labelledby', 'begin-title');
        beginPrompt.setAttribute('aria-describedby', 'begin-desc');

        // Create content directly to avoid sanitization issues
        const contentDiv = document.createElement('div');
        contentDiv.className = 'begin-content';

        const title = document.createElement('h1');
        title.id = 'begin-title';
        title.textContent = 'The Digital Bardo';

        const description = document.createElement('p');
        description.id = 'begin-desc';
        description.textContent = 'A journey through consciousness and dissolution';

        const button = document.createElement('button');
        button.className = 'begin-button';
        button.textContent = 'Begin Experience';
        button.setAttribute('aria-label', 'Click to begin the Digital Bardo experience and enable audio');
        button.style.cssText = 'min-height: 48px; min-width: 120px; padding: 12px 24px; font-size: 16px; background: #333; color: #fff; border: 1px solid #666; cursor: pointer; border-radius: 4px;';

        const note = document.createElement('small');
        note.id = 'begin-note';
        note.textContent = 'Click to enable audio and start';

        // Assemble the content
        contentDiv.appendChild(title);
        contentDiv.appendChild(description);
        contentDiv.appendChild(button);
        contentDiv.appendChild(note);
        beginPrompt.appendChild(contentDiv);
        document.body.appendChild(beginPrompt);

        // Apply CSS styling using CSS variables from reality.css
        beginPrompt.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--void-black, #000000);
            color: var(--clear-light, #ffffff);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        const beginButton = beginPrompt.querySelector('.begin-button');
        if (beginButton) {
            beginButton.focus(); // Accessibility: Auto-focus for keyboard navigation
        } else {
            console.warn('Warning: Begin button not found, this should not happen with direct DOM creation');
        }

        // Enhanced click handler with proper error handling
        if (button) {
            button.addEventListener('click', async () => {
            try {
                console.log('🎭 User gesture received - initializing audio context...');

                // Initialize audio with user gesture (critical for iOS/Safari)
                if (this.audio) {
                    await this.audio.initializeAudioContext();
                    console.log('🎵 Audio context initialized successfully');
                } else {
                    console.warn('Warning: Audio system not yet initialized; implement in future.');
                }

                // Fade out with GSAP
                AnimationGuardian.safeAnimate(beginPrompt, {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        beginPrompt.remove();
                        console.log('🌟 Beginning light manifestation...');
                        // Start experience (migrate existing)
                        this.manifestLight(); // The gateway opens
                    }
                });
            } catch (error) {
                console.error('Audio initialization failed:', error);
                this.showAudioError(beginPrompt);
            }
        });
        }

        // Keyboard accessibility
        if (button) {
            button.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    button.click();
                }
            });
        }
    }

    /**
     * Display audio error and retry option
     */
    showAudioError(container) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Audio failed to initialize. Click to retry.';
        errorMsg.style.cssText = `
            color: var(--karma-red, #ff0000);
            margin-top: 1rem;
            font-size: 0.9rem;
            text-align: center;
        `;
        errorMsg.setAttribute('role', 'alert');

        const beginContent = container.querySelector('.begin-content');
        if (beginContent) {
            beginContent.appendChild(errorMsg);
        }

        console.log('Audio error displayed - user can retry');
    }

    // Manifest the clear light (migrated from clear-lode.js)
    manifestLight() {
        console.log('🌟 Starting light manifestation...');
        consciousness.setState('clearLode.lightManifested', true);

        AnimationGuardian.safeAnimate('#pre-light', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => document.getElementById('pre-light').classList.add('hidden')
        });

        AnimationGuardian.safeAnimate('#clear-light', {
            display: 'block',
            opacity: 1,
            duration: 0,
            delay: 0.5,
            onComplete: () => document.getElementById('clear-light').classList.remove('hidden')
        });

        AnimationGuardian.safeAnimate('.light-core', {
            scale: 1,
            opacity: 1,
            duration: 3,
            ease: 'power2.out',
            delay: 0.5
        });

        AnimationGuardian.safeAnimate('body', {
            backgroundColor: '#ffffff',
            duration: 2,
            ease: 'power2.inOut',
            delay: 2.5, // 0.5 + 3 - 1
            onStart: () => document.body.classList.remove('approaching-light'),
            onComplete: () => {
                document.body.classList.add('light-manifested');
                console.log('✨ Light manifestation sequence complete, transitioning FSM...');
                recognitionFSM.transition('onLightManifested');
            }
        });

        AnimationGuardian.safeAnimate('.light-core', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none',
            delay: 3.7 // 2.5 + 2 - 0.8
        });
        
        // Only start audio if user has already interacted (audio initialized)
        if (this.audio.audioInitialized) {
            console.log('🎵 Starting audio...');
            this.audio.startPureTone();
        }

        // Start fragments after light is fully visible (4 seconds to ensure light is established)
        const timerId = setTimeout(() => this.fragments.startFragmentField(), 4000);
        this.guardian.registerTimer(timerId);

        // The FSM now handles the window, but we still need a timeout for the 'failed' state.
        const recognitionWindowDuration = (this.config.recognitionWindow.end - this.config.recognitionWindow.start) / 1000;
        const timerId = setTimeout(() => {
            if (recognitionFSM.getState() === 'window_open') {
                console.log('⏰ Recognition window timeout - transitioning FSM to failed...');
                recognitionFSM.transition('onTimeout');
            }
        }, recognitionWindowDuration * 1000);
        this.guardian.registerTimer(timerId);

        consciousness.recordEvent('clear_light_manifested', {
            timestamp: Date.now()
        });
    }

    enableRecognition() {
        consciousness.setState('clearLode.recognitionActive', true);

        // Animate recognition zone activation
        AnimationGuardian.safeAnimate('.recognition-zone', {
            scale: 1.05,
            duration: 0.5,
            ease: 'back.out(1.7)',
            onStart: () => {
                document.querySelector('.recognition-zone').setAttribute('data-active', 'true');
            }
        });

        // Start recognition listening and hint display
        this.recognition.startListening();
        this.showRecognitionHints();
    }

    // Show recognition hints (migrated from clear-lode.js)
    async showRecognitionHints() {
        const hintElement = document.querySelector('.recognition-hint');

        for (let hint of this.config.hints) {
            if (!consciousness.getState('clearLode.recognitionActive') || consciousness.getState('clearLode.recognized')) break;

            // GSAP-powered hint animation
            hintElement.textContent = hint;
            consciousness.setState('clearLode.hintsShown', consciousness.getState('clearLode.hintsShown') + 1);

            AnimationGuardian.safeAnimate(hintElement, {
                opacity: 0.4,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });

            await new Promise(resolve => {
                AnimationGuardian.safeAnimate(hintElement, {
                    opacity: 0,
                    y: -10,
                    duration: 0.5,
                    delay: this.config.hintFadeTime / 1000,
                    ease: 'power2.in',
                    onComplete: resolve
                });
            });

            // Wait between hints
            const timerId = await this.wait(this.config.hintDelay);
            this.guardian.registerTimer(timerId);
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    closeRecognitionWindow() {
        consciousness.setState('clearLode.recognitionActive', false);

        // Animate recognition zone deactivation
        AnimationGuardian.safeAnimate('.recognition-zone', {
            scale: 1,
            duration: 0.3,
            ease: 'power2.in',
            onStart: () => {
                document.querySelector('.recognition-zone').setAttribute('data-active', 'false');
            }
        });

        // Stop recognition listening
        this.recognition.stopListening();

        // Begin degradation if not recognized
        if (!consciousness.getState('clearLode.recognized')) {
            console.log('🌀 Recognition timeout - beginning degradation in 1 second...');
            const timerId = setTimeout(() => {
                console.log('🌀 Triggering degradation now...');
                this.degradation.beginDegradation();
            }, 1000);
            this.guardian.registerTimer(timerId);
        } else {
            console.log('✨ Recognition achieved - skipping degradation');
        }
    }

    // Execute recognition achievement sequence (migrated from clear-lode.js)
    executeRecognitionSequence() {
        AnimationGuardian.safeAnimate('body', {
            filter: 'brightness(2) contrast(2)',
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        AnimationGuardian.safeAnimate('.light-core', {
            scale: 2,
            opacity: 0.5,
            duration: 1,
            ease: 'power2.out',
            delay: 0.6
        });

        const hintElement = document.querySelector('.recognition-hint');
        hintElement.innerHTML = this.sanitizeHTML("Recognition Achieved");
        hintElement.className = 'recognition-hint visible enlightenment';

        AnimationGuardian.safeAnimate(hintElement, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 1.6
        });

        AnimationGuardian.safeAnimate('body', {
            opacity: 0,
            duration: 2,
            delay: 3.1, // 0.6 + 1 + 0.5 + 1
            ease: 'power2.in',
            onComplete: () => {
                consciousness.recordEvent('transitioning_to_datascape', {
                    fromState: 'recognized'
                });
                window.location.href = '/datascape/';
            }
        });

        // Audio resonance
        this.audio.achieveResonance();
    }

    getEnlightenmentMessage(method) {
        const messages = {
            click: "Recognition achieved through direct perception",
            keyboard: "Recognition achieved through intentional action",
            default: "Recognition achieved"
        };
        return messages[method] || messages.default;
    }

    // Record attachment (migrated from clear-lode.js)
    recordAttachment(type, data = {}) {
        consciousness.setState('clearLode.recognitionAttempts', consciousness.getState('clearLode.recognitionAttempts') + 1);

        consciousness.recordEvent('attachment_formed', {
            type: type,
            degradationLevel: this.audio.getDegradationLevel(),
            recognitionAvailable: consciousness.getState('clearLode.recognitionActive'),
            ...data
        });

        AnimationGuardian.safeAnimate('body', {
            filter: 'hue-rotate(90deg)',
            x: -5,
            duration: 0.1
        });
        AnimationGuardian.safeAnimate('body', {
            filter: 'hue-rotate(-90deg)',
            x: 5,
            duration: 0.1,
            delay: 0.1
        });
        AnimationGuardian.safeAnimate('body', {
            filter: 'hue-rotate(0deg)',
            x: 0,
            duration: 0.1,
            delay: 0.2
        });

        // Accelerate degradation
        if (consciousness.getState('clearLode.recognitionActive')) {
            this.audio.accelerateDegradation(0.05);
        }
    }

    dispatchEvent(type, detail = {}) {
        window.dispatchEvent(new CustomEvent(type, { detail }));
    }

    dispatchError(type, error) {
        window.dispatchEvent(new CustomEvent('error:karmaImbalance', { detail: { type, error: error.message } }));
    }

    /**
     * Clean shutdown method using the ResourceGuardian.
     */
    destroy() {
        if (this.isDestroyed) {
             console.warn('Orchestrator already destroyed, skipping cleanup');
            return;
        }
        console.log('Releasing attachments to prevent karmic recycling...');
        this.isDestroyed = true;

        this.guardian.cleanupAll();

        // Destroy subsystems
        [this.recognition, this.degradation, this.fragments, this.audio].forEach(system => {
            if (system && typeof system.destroy === 'function') {
                try {
                    system.destroy();
                } catch (error) {
                    console.warn('Error destroying subsystem:', error);
                }
            }
        });
        
        // Nullify all major properties to break references
        this.recognition = null;
        this.degradation = null;
        this.fragments = null;
        this.audio = null;
        this.karmicEngine = null;
        this.config = null;
        this.guardian = null;
        this.sanitizeText = null;
        this.sanitizeHTML = null;
    }
}
