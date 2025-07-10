/**
 * Manages consciousness degradation - the breath held at the moment of dissolution.
 * Handles all visual and audio degradation effects and displays the non-interactive glitch prompt.
 */
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { manifestElement } from '../src/security/consciousness-purification.js';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

export class DegradationSystem {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.degradationActive = false;
        this.glitchTimeline = null;

        // The degradation system now listens for the FSM to enter the 'failed' state.
        consciousness.subscribe('clearLode.recognitionFSMState', (newState) => {
            if (newState === 'failed') {
                this.beginDegradation();
            }
        });
    }
    
    beginDegradation() {
        if (consciousness.getState('clearLode.recognized') || this.degradationActive) return;

        console.log('🌀 Beginning consciousness degradation...');
        this.degradationActive = true;
        consciousness.setState('clearLode.degradationStarted', true);
        
        // Create degradation timeline (migrated from clear-lode.js)
        this.orchestrator.timelines.degradation = gsap.timeline({
            repeat: -1
        });
        
        // Increasingly chaotic visual degradation
        this.orchestrator.timelines.degradation
            .to('body', {
                filter: 'contrast(1.2) saturate(0.8)',
                duration: 2,
                ease: 'sine.inOut'
            })
            .to('body', {
                filter: 'contrast(0.8) saturate(1.2) hue-rotate(10deg)',
                duration: 2,
                ease: 'sine.inOut'
            });
        
        // Start audio degradation
        this.orchestrator.audio.startDegradation();
        
        // Show glitching prompt with GSAP (migrated from clear-lode.js)
        const choicePrompt = document.getElementById('choice-prompt');
        if (choicePrompt) {
            choicePrompt.classList.remove('hidden'); // Remove hidden class first
        }

        gsap.set('#choice-prompt', {
            display: 'block',
            opacity: 0,
            y: 50
        });
        
        gsap.to('#choice-prompt', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                this.showInteractivePrompt();
            }
        });
        
        // Increase fragments (migrated from clear-lode.js)
        this.orchestrator.fragments.intensifyFragments();
        
        // Record degradation event
        consciousness.recordEvent('consciousness_degradation_started', {
            recognitionMissed: true,
            hintsShown: consciousness.getState('clearLode.hintsShown'),
            attempts: consciousness.getState('clearLode.recognitionAttempts')
        });
        
        // Dispatch degradation complete event
        this.dispatchEvent('degradation:complete', {
            level: consciousness.getState('clearLode.degradationLevel') + 1
        });
    }
    
    // Show interactive Y/N prompt with full input handling and karma integration
    showInteractivePrompt() {
        console.log('🎯 Showing interactive Y/N prompt...');
        const glitchText = document.querySelector('.glitching-text');
        if (!glitchText) {
            console.warn('Warning: .glitching-text element not found in degradation-system.js');
            return;
        }
        console.log('✅ Found glitching-text element, setting up prompt...');

        // Initialize prompt state
        this.promptStartTime = Date.now();
        this.promptActive = true;
        this.typingBuffer = '';
        this.timeoutId = null;
        this.inputListeners = [];

        // Create interactive HTML structure with clickable Y/N spans
        glitchText.textContent = 'CONTINUE TO NEXT LIFE? ';
        const yesSpan = manifestElement('span', { attributes: { id: 'degradation-choice-yes', class: 'choice-option' }, textContent: 'Y' });
        const noSpan = manifestElement('span', { attributes: { id: 'degradation-choice-no', class: 'choice-option' }, textContent: 'N' });
        glitchText.appendChild(yesSpan);
        glitchText.append('/');
        glitchText.appendChild(noSpan);

        // Get choice elements
        const yesChoice = document.getElementById('degradation-choice-yes');
        const noChoice = document.getElementById('degradation-choice-no');

        if (!yesChoice || !noChoice) {
            console.warn('Warning: Choice elements not found after HTML creation');
            return;
        }

        // Set up input handling
        this.setupInputHandling(yesChoice, noChoice);

        // Set up 30-second timeout
        this.setupTimeout();

        // Add subtle glitch effect to the prompt (less intense than before)
        this.glitchTimeline = gsap.timeline({ repeat: -1 });
        this.glitchTimeline.to(glitchText, {
            skewX: () => Math.random() * 1 - 0.5,
            skewY: () => Math.random() * 0.5 - 0.25,
            x: () => Math.random() * 1 - 0.5,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'steps(2)',
            delay: 2
        });
    }

    // Set up comprehensive input handling for keyboard and click events
    setupInputHandling(yesChoice, noChoice) {
        // Keyboard event handler
        const keyboardHandler = (e) => {
            if (!this.promptActive) return;

            const key = e.key.toLowerCase();

            // Handle single key presses
            if (key === 'y') {
                this.handleChoice('yes');
            } else if (key === 'n') {
                this.handleChoice('no');
            } else if (key === 'enter') {
                // Handle typed words
                const buffer = this.typingBuffer.toLowerCase();
                if (buffer.includes('yes') || buffer.includes('ye')) {
                    this.handleChoice('yes');
                } else if (buffer.includes('no')) {
                    this.handleChoice('no');
                }
                this.typingBuffer = '';
            } else if (key.length === 1 && /[a-z]/.test(key)) {
                // Build typing buffer for word input
                this.typingBuffer += key;
                // Clear buffer after 3 seconds of inactivity
                clearTimeout(this.bufferClearTimeout);
                this.bufferClearTimeout = setTimeout(() => {
                    this.typingBuffer = '';
                }, 3000);
            }
        };

        // Click event handlers with visual feedback
        const yesClickHandler = (e) => {
            e.preventDefault();
            if (this.promptActive) {
                this.handleChoice('yes');
            }
        };

        const noClickHandler = (e) => {
            e.preventDefault();
            if (this.promptActive) {
                this.handleChoice('no');
            }
        };

        // Hover effects for visual feedback
        const addHoverEffects = (element) => {
            const mouseEnterHandler = () => {
                if (this.promptActive) {
                    element.classList.add('choice-selected');
                    gsap.to(element, {
                        scale: 1.2,
                        duration: 0.2,
                        ease: 'back.out(1.7)'
                    });
                }
            };

            const mouseLeaveHandler = () => {
                if (this.promptActive) {
                    element.classList.remove('choice-selected');
                    gsap.to(element, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                }
            };

            element.addEventListener('mouseenter', mouseEnterHandler);
            element.addEventListener('mouseleave', mouseLeaveHandler);

            // Store for cleanup
            this.inputListeners.push(
                { element, event: 'mouseenter', handler: mouseEnterHandler },
                { element, event: 'mouseleave', handler: mouseLeaveHandler }
            );
        };

        // Add all event listeners
        document.addEventListener('keydown', keyboardHandler);
        yesChoice.addEventListener('click', yesClickHandler);
        noChoice.addEventListener('click', noClickHandler);

        addHoverEffects(yesChoice);
        addHoverEffects(noChoice);

        // Store listeners for cleanup
        this.inputListeners.push(
            { element: document, event: 'keydown', handler: keyboardHandler },
            { element: yesChoice, event: 'click', handler: yesClickHandler },
            { element: noChoice, event: 'click', handler: noClickHandler }
        );
    }

    // Set up 30-second timeout mechanism
    setupTimeout() {
        this.timeoutId = setTimeout(() => {
            if (this.promptActive) {
                console.log('Degradation choice timeout - applying void karma penalty');
                this.handleChoice('timeout');
            }
        }, 30000); // 30 seconds
    }

    // Handle user choice and calculate karma impact
    handleChoice(choice) {
        if (!this.promptActive) return;

        // Deactivate prompt immediately
        this.promptActive = false;
        const timeToChoice = Date.now() - this.promptStartTime;

        // Clean up event listeners and timers
        this.cleanupPrompt();

        // Calculate karma impact based on choice and timing
        let karmaImpact = { computational: 0, emotional: 0, temporal: 0, void: 0 };
        let eventName = '';

        switch (choice) {
            case 'yes':
                karmaImpact.emotional = -3;
                karmaImpact.temporal = timeToChoice < 10000 ? 2 : -1; // +2 if <10s, -1 if >=10s
                eventName = 'degradation_choice_yes';
                break;
            case 'no':
                karmaImpact.void = 10;
                karmaImpact.computational = 3;
                eventName = 'degradation_choice_no';
                break;
            case 'timeout':
                karmaImpact.void = 20;
                karmaImpact.temporal = -10;
                eventName = 'degradation_choice_timeout';
                break;
        }

        // Record karma event using consciousness system
        consciousness.recordEvent(this.orchestrator.karmicEngine.KARMA_EVENTS.DEGRADATION_CHOICE, {
            choice: choice,
            timeToChoice: timeToChoice,
            karmaImpact: karmaImpact,
            degradationLevel: consciousness.getState('clearLode.degradationLevel') || 0
        });

        // Provide visual feedback for the choice
        this.showChoiceFeedback(choice);

        // Dispatch custom event with comprehensive detail
        this.dispatchEvent('degradation:choice', {
            choice: choice,
            timeToChoice: timeToChoice,
            karmaImpact: karmaImpact,
            degradationLevel: consciousness.getState('clearLode.degradationLevel') || 0
        });

        console.log(`🔮 Degradation choice made: ${choice} (${timeToChoice}ms)`, karmaImpact);
    }

    // Show visual feedback for the user's choice
    showChoiceFeedback(choice) {
        const choiceElement = choice === 'yes'
            ? document.getElementById('degradation-choice-yes')
            : choice === 'no'
            ? document.getElementById('degradation-choice-no')
            : null;

        if (choiceElement) {
            choiceElement.classList.add('choice-selected');
            gsap.to(choiceElement, {
                scale: 1.5,
                opacity: 0.8,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        }

        // Fade out the entire prompt after feedback
        gsap.to('.glitching-text', {
            opacity: 0.3,
            duration: 1,
            ease: 'power2.out'
        });
    }

    // Clean up all event listeners and timers
    cleanupPrompt() {
        // Clear timeout
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Clear buffer timeout
        if (this.bufferClearTimeout) {
            clearTimeout(this.bufferClearTimeout);
            this.bufferClearTimeout = null;
        }

        // Remove all event listeners
        this.inputListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.inputListeners = [];

        // Clear typing buffer
        this.typingBuffer = '';
    }

    dispatchEvent(type, detail = {}) {
        window.dispatchEvent(new CustomEvent(type, { detail }));
    }

    // Intensify degradation effects for refusal consequences
    intensifyEffects() {
        console.log('🌀 Intensifying degradation effects...');

        // Increase visual degradation
        if (this.orchestrator.timelines.degradation) {
            this.orchestrator.timelines.degradation.timeScale(2); // Double speed
        }

        // Add more intense visual effects
        gsap.to('body', {
            filter: 'contrast(1.5) saturate(0.5) hue-rotate(45deg)',
            duration: 1,
            ease: 'power2.out'
        });

        // Intensify audio degradation if available
        if (this.orchestrator.audio) {
            this.orchestrator.audio.accelerateDegradation(0.2);
        }

        // Add screen shake effect
        gsap.to('body', {
            x: () => Math.random() * 10 - 5,
            y: () => Math.random() * 10 - 5,
            duration: 0.1,
            repeat: 20,
            yoyo: true,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.set('body', { x: 0, y: 0 });
            }
        });
    }

    destroy() {
        console.log('Dissolving degradation system...');

        // Prevent multiple destroy calls
        if (this._destroyed) {
            console.warn('Degradation system already destroyed, skipping cleanup');
            return;
        }
        this._destroyed = true;

        // Clean up interactive prompt if active
        if (this.promptActive) {
            this.promptActive = false;
            this.cleanupPrompt();
        }

        // Stop glitch timeline
        if (this.glitchTimeline) {
            this.glitchTimeline.kill();
            this.glitchTimeline = null;
        }

        // Kill any GSAP animations on degradation elements
        if (window.gsap) {
            window.gsap.killTweensOf('#choice-prompt');
            window.gsap.killTweensOf('.glitch-text');
            window.gsap.killTweensOf('body'); // For screen shake and filter effects
        }

        // Kill degradation timeline from orchestrator if it exists
        if (this.orchestrator && this.orchestrator.timelines && this.orchestrator.timelines.degradation) {
            this.orchestrator.timelines.degradation.kill();
            this.orchestrator.timelines.degradation = null;
        }

        // Clear any remaining timeouts
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        if (this.bufferClearTimeout) {
            clearTimeout(this.bufferClearTimeout);
            this.bufferClearTimeout = null;
        }

        // Remove DOM elements created by degradation system
        const choicePrompt = document.getElementById('choice-prompt');
        if (choicePrompt) {
            choicePrompt.remove();
        }

        // Clean up any remaining event listeners (safety check)
        this.inputListeners.forEach(({ element, event, handler }) => {
            try {
                element.removeEventListener(event, handler);
            } catch (error) {
                console.warn('Error removing event listener:', error);
            }
        });

        // Nullify all properties to break references
        this.degradationActive = false;
        this.orchestrator = null;
        this.glitchTimeline = null;
        this.promptActive = false;
        this.promptStartTime = null;
        this.typingBuffer = '';
        this.timeoutId = null;
        this.bufferClearTimeout = null;
        this.inputListeners = null;
    }
}
