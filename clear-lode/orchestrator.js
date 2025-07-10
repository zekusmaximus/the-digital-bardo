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

        // State variables (migrated from clear-lode.js)
        this.localState = {
            startTime: Date.now(),
            lightManifested: false,
            recognitionAvailable: false,
            recognized: false,
            degradationStarted: false,
            hintsShown: 0,
            recognitionAttempts: 0
        };

        // GSAP timelines for complex animations
        this.timelines = {
            manifestation: null,
            recognition: null,
            degradation: null
        };
        
        // Sub-systems
        this.recognition = null;
        this.degradation = null;
        this.karmicEngine = new KarmicEngine(); // Initialize Karma calculation engine first

        // Create fragment generator with karmic callbacks
        this.fragments = new FragmentGenerator(
            this.karmicEngine.createFragmentCallbacks()
        ); // Migrated from clear-lode.js

        this.audio = new ClearLodeAudio(); // Migrated from clear-lode.js

        // Resource tracking for cleanup
        this.eventListeners = new Map();
        this.timers = new Set();
        this.windowEventListeners = new Map(); // Track window lifecycle listeners

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
        const events = [
            ['recognition:success', this.handleRecognitionSuccess.bind(this)],
            ['recognition:failed', this.handleRecognitionFailed.bind(this)],
            ['recognition:attachment', this.handleAttachment.bind(this)],
            ['degradation:complete', this.handleTransition.bind(this)],
            ['degradation:choice', this.handleDegradationChoice.bind(this)],
            ['light:manifestation:complete', this.handleLightManifested.bind(this)]
        ];

        events.forEach(([event, handler]) => {
            window.addEventListener(event, handler);
            this.eventListeners.set(event, handler);
        });
    }

    setupWindowLifecycleListeners() {
        // Set up automatic cleanup on page unload/navigation
        const beforeUnloadHandler = () => {
            console.log('Page unloading - triggering cleanup...');
            this.destroy();
        };

        const pageHideHandler = () => {
            console.log('Page hiding (iOS compatibility) - triggering cleanup...');
            this.destroy();
        };

        window.addEventListener('beforeunload', beforeUnloadHandler);
        window.addEventListener('pagehide', pageHideHandler);

        // Store for cleanup in destroy method
        this.windowEventListeners.set('beforeunload', beforeUnloadHandler);
        this.windowEventListeners.set('pagehide', pageHideHandler);
    }

    handleRecognitionSuccess(e) {
        console.log('Recognition success:', e.detail);
        const { method, karmaData } = e.detail;

        if (this.localState.recognized) return;

        this.localState.recognized = true;

        // Update recognition visual properties (migrated from clear-lode.js)
        document.documentElement.style.setProperty('--recognition-scale', '1.2');
        document.documentElement.style.setProperty('--recognition-opacity', '1');

        // Calculate karma impact using the new KarmicEngine
        const karmaImpact = this.karmicEngine.calculateImpact('recognition_achieved', {
            timeToDecision: karmaData?.elapsedTime || 0,
            perfectTimingBonus: karmaData?.perfectTimingBonus || 0
        });

        console.log('🔮 Karma impact calculated:', karmaImpact);
        console.log('📊 Recognition timing:', {
            timeToDecision: karmaData?.elapsedTime,
            perfectTimingBonus: karmaData?.perfectTimingBonus,
            wasQuickDecision: (karmaData?.elapsedTime || 0) < 5000,
            hadRushPenalty: (karmaData?.elapsedTime || 0) < 3000
        });

        // Update consciousness with karma data
        consciousness.state.recognitions.clear_light = true;
        consciousness.recordEvent('recognition_achieved', {
            method: method,
            timeToRecognize: karmaData?.elapsedTime || 0,
            hintsNeeded: this.localState.hintsShown,
            attempts: this.localState.recognitionAttempts,
            perfectTiming: karmaData?.perfectTimingBonus > 0,
            karmaData: karmaData, // Store full karma data for future use
            karmaImpact: karmaImpact // Store calculated karma impact
        });

        this.executeRecognitionSequence(method);
    }
    
    handleRecognitionFailed(e) {
        console.log('Recognition failed:', e.detail);
        // Close recognition window and begin degradation if not recognized
        this.closeRecognitionWindow();
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
    
    handleLightManifested(e) {
        console.log('Light manifestation complete:', e.detail);
        // Enable recognition after light is manifested
        this.scheduleRecognitionWindow();
    }

    handleDegradationChoice(e) {
        console.log('Degradation choice made:', e.detail);
        const { choice, timeToChoice, karmaImpact, degradationLevel } = e.detail;

        // Log the karmic consequences
        console.log(`🔮 Karmic impact of choice "${choice}":`, karmaImpact);
        console.log(`⏱️ Decision time: ${timeToChoice}ms`);

        // Update local state
        this.localState.degradationLevel = degradationLevel;
        this.localState.degradationChoiceMade = true;
        this.localState.degradationChoice = choice;

        // Handle transition based on choice
        gsap.delayedCall(2, () => {
            this.handleDegradationTransition(choice);
        });
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
        gsap.to('body', {
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
        gsap.delayedCall(5, () => {
            console.log('⚡ Forced transition due to refusal...');
            this.transitionToDatascape('forced_after_refusal');
        });
    }

    handleTimeoutConsequences() {
        // Apply void karma consequences and transition
        console.log('🕳️ Applying void consequences for timeout...');

        // Show timeout feedback
        const body = document.body;
        gsap.timeline()
            .to(body, {
                filter: 'grayscale(1) contrast(0.5)',
                duration: 1,
                ease: 'power2.out'
            })
            .to(body, {
                opacity: 0.5,
                duration: 1,
                ease: 'power2.out'
            })
            .call(() => {
                this.transitionToDatascape('timeout_void');
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
                gsap.to(beginPrompt, {
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
        this.localState.lightManifested = true;

        // Create GSAP timeline for light manifestation
        this.timelines.manifestation = gsap.timeline({
            onComplete: () => {
                console.log('✨ Light fully manifested');
                this.dispatchEvent('light:manifestation:complete', {});
            }
        });
        
        // Orchestrate the transition with GSAP - keep background dark while light grows
        this.timelines.manifestation
            // Fade out the void first
            .to('#pre-light', {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    document.getElementById('pre-light').classList.add('hidden');
                }
            })
            // Immediately show the light container but invisible
            .set('#clear-light', {
                display: 'block',
                opacity: 1,
                onComplete: () => {
                    document.getElementById('clear-light').classList.remove('hidden');
                }
            })
            // Start with light core at center, very small
            .set('.light-core', {
                scale: 0,
                opacity: 0
            })
            // Grow the light from center outward FIRST (much slower)
            .to('.light-core', {
                scale: 1,
                opacity: 1,
                duration: 3,
                ease: 'power2.out'
            })
            // THEN transition background to white (after light is visible, much later)
            .to('body', {
                backgroundColor: '#ffffff',
                duration: 2,
                ease: 'power2.inOut',
                onStart: () => {
                    document.body.classList.remove('approaching-light');
                    // Don't add light-manifested class immediately - it changes background
                }
            }, '-=1')
            // Add the light-manifested class after background transition
            .call(() => {
                document.body.classList.add('light-manifested');
            })
            // Start the gentle rotation
            .to('.light-core', {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none'
            }, '-=0.8');
        
        // Only start audio if user has already interacted (audio initialized)
        if (this.audio.audioInitialized) {
            console.log('🎵 Starting audio...');
            this.audio.startPureTone();
        }

        // Start fragments after light is fully visible (4 seconds to ensure light is established)
        gsap.delayedCall(4, () => {
            this.fragments.startFragmentField();
        });
        
        consciousness.recordEvent('clear_light_manifested', {
            timestamp: Date.now()
        });
    }

    scheduleRecognitionWindow() {
        // Enable recognition window with GSAP delay
        gsap.delayedCall(this.config.recognitionWindow.start / 1000, () => {
            this.enableRecognition();
        });
        
        // Close recognition window
        gsap.delayedCall(this.config.recognitionWindow.end / 1000, () => {
            this.closeRecognitionWindow();
        });
    }

    enableRecognition() {
        this.localState.recognitionAvailable = true;

        // Animate recognition zone activation
        gsap.to('.recognition-zone', {
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
            if (!this.localState.recognitionAvailable || this.localState.recognized) break;

            // GSAP-powered hint animation
            await gsap.timeline()
                .set(hintElement, {
                    opacity: 0,
                    y: 10
                })
                .call(() => {
                    hintElement.innerHTML = this.sanitizeHTML(hint);
                    this.localState.hintsShown++;
                })
                .to(hintElement, {
                    opacity: 0.4,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                })
                .to(hintElement, {
                    opacity: 0,
                    y: -10,
                    duration: 0.5,
                    delay: this.config.hintFadeTime / 1000,
                    ease: 'power2.in'
                })
                .then();

            // Wait between hints
            await this.wait(this.config.hintDelay);
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    closeRecognitionWindow() {
        this.localState.recognitionAvailable = false;

        // Animate recognition zone deactivation
        gsap.to('.recognition-zone', {
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
        if (!this.localState.recognized) {
            gsap.delayedCall(1, () => {
                this.degradation.beginDegradation();
            });
        }
    }

    // Execute recognition achievement sequence (migrated from clear-lode.js)
    executeRecognitionSequence(method) {
        // Create recognition achievement timeline
        this.timelines.recognition = gsap.timeline();

        this.timelines.recognition
            // Flash of enlightenment
            .to('body', {
                filter: 'brightness(2) contrast(2)',
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            })
            // Expand the light
            .to('.light-core', {
                scale: 2,
                opacity: 0.5,
                duration: 1,
                ease: 'power2.out'
            })
            // Show enlightenment message
            .set('.recognition-hint', {
                innerHTML: this.sanitizeHTML(this.getEnlightenmentMessage(method)),
                className: 'recognition-hint visible enlightenment'
            })
            .fromTo('.recognition-hint',
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            )
            // Prepare for transition
            .to('body', {
                opacity: 0,
                duration: 2,
                delay: 1,
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
        this.localState.recognitionAttempts++;

        consciousness.recordEvent('attachment_formed', {
            type: type,
            degradationLevel: this.audio.getDegradationLevel(),
            recognitionAvailable: this.localState.recognitionAvailable,
            ...data
        });

        // GSAP-powered glitch effect
        gsap.timeline()
            .to('body', {
                filter: 'hue-rotate(90deg)',
                x: -5,
                duration: 0.1
            })
            .to('body', {
                filter: 'hue-rotate(-90deg)',
                x: 5,
                duration: 0.1
            })
            .to('body', {
                filter: 'hue-rotate(0deg)',
                x: 0,
                duration: 0.1
            });

        // Accelerate degradation
        if (this.localState.recognitionAvailable) {
            this.audio.accelerateDegradation(0.05);
        }
    }

    dispatchEvent(type, detail = {}) {
        window.dispatchEvent(new CustomEvent(type, { detail }));
    }

    dispatchError(type, error) {
        window.dispatchEvent(new CustomEvent('error:karmaImbalance', { detail: { type, error: error.message } }));
    }

    // Clean shutdown method (migrated from clear-lode.js)
    destroy() {
        console.log('Releasing attachments to prevent karmic recycling...');

        // Prevent multiple destroy calls
        if (this._destroyed) {
            console.warn('Orchestrator already destroyed, skipping cleanup');
            return;
        }
        this._destroyed = true;

        // Stop all GSAP timelines
        Object.values(this.timelines).forEach(timeline => {
            if (timeline) {
                timeline.kill();
                timeline = null;
            }
        });

        // Kill any global GSAP animations that might be running
        if (window.gsap) {
            window.gsap.killTweensOf('body');
            window.gsap.killTweensOf('.recognition-zone');
            window.gsap.killTweensOf('#choice-prompt');
        }

        // Remove custom event listeners
        this.eventListeners.forEach((handler, event) => window.removeEventListener(event, handler));
        this.eventListeners.clear();

        // Remove window lifecycle listeners
        this.windowEventListeners.forEach((handler, event) => window.removeEventListener(event, handler));
        this.windowEventListeners.clear();

        // Clear all timers
        this.timers.forEach(id => {
            clearTimeout(id);
            clearInterval(id);
        });
        this.timers.clear();

        // Destroy subsystems in reverse order of creation
        [this.recognition, this.degradation, this.fragments, this.audio].forEach(system => {
            if (system && typeof system.destroy === 'function') {
                try {
                    system.destroy();
                } catch (error) {
                    console.warn('Error destroying subsystem:', error);
                }
            }
        });

        // Remove DOM elements created by orchestrator
        const elementsToRemove = ['clear-light', 'begin-prompt'];
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });

        // Record final state before nullifying
        if (consciousness && typeof consciousness.recordEvent === 'function') {
            try {
                consciousness.recordEvent('clear_lode_destroyed', {
                    finalState: this.localState,
                    fragmentStats: this.fragments?.getPerformanceStats?.() || null
                });
            } catch (error) {
                console.warn('Error recording destruction event:', error);
            }
        }

        // Nullify all major properties to break references
        this.recognition = null;
        this.degradation = null;
        this.fragments = null;
        this.audio = null;
        this.karmicEngine = null;
        this.timelines = null;
        this.localState = null;
        this.config = null;
        this.eventListeners = null;
        this.windowEventListeners = null;
        this.timers = null;
        this.sanitizeText = null;
        this.sanitizeHTML = null;
    }
}
