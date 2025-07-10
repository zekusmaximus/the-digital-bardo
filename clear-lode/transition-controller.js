/**
 * @file Manages all visual transitions and animations for the Clear Lode experience.
 *
 * This class abstracts all GSAP-related logic, listening to events from the
 * EventBridge to trigger complex animation sequences. This keeps the orchestrator
 * clean and focused on coordination rather than implementation details.
 */

import { gsap } from 'gsap';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

export class ClearLodeTransitionController {
    /**
     * @param {object} dependencies
     * @param {import('./event-bridge.js').ClearLodeEventBridge} dependencies.eventBridge
     * @param {import('../src/consciousness/resource-guardian.js').ResourceGuardian} dependencies.guardian
     * @param {import('./config.js').CLEAR_LODE_CONFIG} dependencies.config
     */
    constructor({ eventBridge, guardian, config }) {
        if (!eventBridge || !guardian || !config) {
            throw new Error('TransitionController requires eventBridge, guardian, and config.');
        }
        /** @private */
        this.eventBridge = eventBridge;
        /** @private */
        this.guardian = guardian;
        /** @private */
        this.config = config;
        /** @private */
        this.isDestroyed = false;
    }

    /**
     * Initializes the controller by setting up event listeners.
     */
    init() {
        console.log('TransitionController initializing...');
        this.setupEventListeners();
        console.log('TransitionController initialized.');
    }

    /**
     * Subscribes to events from the event bridge to trigger animations.
     * @private
     */
    setupEventListeners() {
        const eventListeners = [
            ['state:recognitionWindowOpened', this.onRecognitionWindowOpened.bind(this)],
            ['state:recognitionSucceeded', this.onRecognitionSucceeded.bind(this)],
            ['state:recognitionFailed', this.onRecognitionFailed.bind(this)],
            ['attachment:formed', this.onAttachmentFormed.bind(this)],
            ['transition:toDatascape', this.transitionToDatascape.bind(this)],
             ['degradation:refused', this.onRefusalConsequences.bind(this)],
            ['degradation:timedOut', this.onTimeoutConsequences.bind(this)],
        ];
        
        eventListeners.forEach(([eventName, handler]) => {
            this.eventBridge.on(eventName, handler);
            // Register cleanup for each listener
            this.guardian.registerCleanup(() => this.eventBridge.off(eventName, handler));
        });
    }

    /**
     * Shows the initial prompt to begin the experience.
     */
    showBeginPrompt() {
        // This method still needs to manage its own DOM creation and event handling
        // because it's the entry point before the main event loop starts.
        // It's a bit of a special case.
        const beginPrompt = document.getElementById('begin-prompt');
        // The fade-out animation logic is handled here.
        const beginButton = beginPrompt.querySelector('.begin-button');
        if (beginButton) {
            const clickHandler = async () => {
                 try {
                    // This now emits an event that the orchestrator will catch to init audio.
                    this.eventBridge.emit('ui:beginClicked');

                    await AnimationGuardian.safeAnimate(beginPrompt, {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            beginPrompt.remove();
                            this.manifestLight();
                        }
                    });
                } catch (error) {
                    console.error('Error during begin prompt transition:', error);
                    // Optionally, show an error in the UI
                }
            };
            beginButton.addEventListener('click', clickHandler);
            this.guardian.registerEventListener(beginButton, 'click', clickHandler);
        }
    }
    
    /**
     * The main animation sequence for the appearance of the light.
     */
    manifestLight() {
        console.log('🌟 [TC] Starting light manifestation...');
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
            delay: 2.5,
            onStart: () => document.body.classList.remove('approaching-light'),
            onComplete: () => {
                document.body.classList.add('light-manifested');
                console.log('✨ [TC] Light manifestation complete, emitting event...');
                this.eventBridge.emit('animation:lightManifested');
            }
        });

        AnimationGuardian.safeAnimate('.light-core', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none',
            delay: 3.7
        });
    }
    
    /**
     * Event handler for when the recognition window opens.
     * @private
     */
    onRecognitionWindowOpened() {
        AnimationGuardian.safeAnimate('.recognition-zone', {
            scale: 1.05,
            duration: 0.5,
            ease: 'back.out(1.7)',
            onStart: () => {
                document.querySelector('.recognition-zone').setAttribute('data-active', 'true');
            }
        });
        this.showRecognitionHints();
    }
    
    /**
     * Animates the display of recognition hints.
     * @private
     */
    async showRecognitionHints() {
        const hintElement = document.querySelector('.recognition-hint');

        for (let hint of this.config.hints) {
             if (this.isDestroyed || !consciousness.getState('clearLode.recognitionActive') || consciousness.getState('clearLode.recognized')) break;

            hintElement.textContent = hint;
            consciousness.setState('clearLode.hintsShown', consciousness.getState('clearLode.hintsShown') + 1);

            await AnimationGuardian.safeAnimate(hintElement, {
                opacity: 0.4,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });

            await new Promise(resolve => {
                const timerId = setTimeout(resolve, this.config.hintDisplay.delay);
                this.guardian.registerTimer(timerId);
            });
            
            if (this.isDestroyed || !consciousness.getState('clearLode.recognitionActive') || consciousness.getState('clearLode.recognized')) break;


            await AnimationGuardian.safeAnimate(hintElement, {
                opacity: 0,
                y: -10,
                duration: this.config.hintDisplay.fadeDuration / 1000,
                ease: 'power2.in',
            });
        }
    }

    /**
     * Event handler for when recognition fails.
     * @private
     */
    onRecognitionFailed() {
        AnimationGuardian.safeAnimate('.recognition-zone', {
            scale: 1,
            duration: 0.3,
            ease: 'power2.in',
            onStart: () => {
                document.querySelector('.recognition-zone').setAttribute('data-active', 'false');
            }
        });
    }

    /**
     * Event handler for successful recognition.
     * @private
     */
    onRecognitionSucceeded() {
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
        hintElement.textContent = "Recognition Achieved";
        hintElement.className = 'recognition-hint visible enlightenment';

        AnimationGuardian.safeAnimate(hintElement, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            delay: 1.6,
            onComplete: () => {
                 this.eventBridge.emit('transition:toDatascape', { reason: 'recognized' })
            }
        });
    }
    
     /**
     * Transitions the entire view to the datascape.
     * @param {{reason: string}} payload
     */
    transitionToDatascape({ reason }) {
        AnimationGuardian.safeAnimate('body', {
            opacity: 0,
            duration: 2,
            ease: 'power2.in',
            onComplete: () => {
                consciousness.recordEvent('transitioning_to_datascape', {
                    fromState: reason || 'unknown',
                });
                window.location.href = '/datascape/';
            }
        });
    }


    /**
     * Provides visual feedback when an attachment is formed.
     * @private
     */
    onAttachmentFormed() {
        AnimationGuardian.safeAnimate('body', {
            filter: 'hue-rotate(90deg)',
            x: -5,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    }

    /**
     * Handles the visual consequences of refusing the transition.
     * @private
     */
    onRefusalConsequences() {
        // The orchestrator will tell the degradation system to intensify.
        // This controller just handles the visual feedback.
        console.log('🚫 [TC] Applying visual consequences for refusal...');
         const timerId = setTimeout(() => {
            this.eventBridge.emit('transition:toDatascape', { reason: 'forced_after_refusal' });
        }, 5000);
        this.guardian.registerTimer(timerId);
    }
    
    /**
     * Handles the visual consequences of timing out during the choice.
     * @private
     */
    onTimeoutConsequences() {
        console.log('🕳️ [TC] Applying visual consequences for timeout...');
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
            onComplete: () => this.eventBridge.emit('transition:toDatascape', { reason: 'timeout_void' })
        });
    }


    /**
     * Cleans up resources.
     */
    destroy() {
        this.isDestroyed = true;
        // Kill all running animations targeted by this controller
        gsap.killTweensOf(['body', '.light-core', '.recognition-zone', '.recognition-hint']);
        console.log('TransitionController destroyed and animations killed.');
    }
}