/**
 * @file Manages the system degradation sequence that occurs when recognition fails.
 *
 * This class handles the visual and audio degradation effects and presents the
 * multilingual, corrupting choice prompt to the user. It is activated by a
 * `state:recognitionFailed` event from the EventBridge and, in turn, emits
 * `degradation:choice` events based on user input.
 */
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';
import { KarmicEngine } from '../src/consciousness/karmic-engine.js'

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

export class DegradationSystem {
    /**
     * @param {object} dependencies
     * @param {import('./event-bridge.js').ClearLodeEventBridge} dependencies.eventBridge
     * @param {import('../src/consciousness/resource-guardian.js').ResourceGuardian} dependencies.guardian
     * @param {import('./config.js').CLEAR_LODE_CONFIG} dependencies.config
     */
    constructor({ eventBridge, guardian, config }) {
         if (!eventBridge || !guardian || !config) {
            throw new Error('DegradationSystem requires eventBridge, guardian, and config.');
        }

        /** @private */
        this.eventBridge = eventBridge;
        /** @private */
        this.guardian = guardian;
        /** @private */
        this.config = config;
        /** @private */
        this.karmicEngine = new KarmicEngine();

        /** @private */
        this.degradationActive = false;
        /** @private */
        this.glitchSequenceInterval = null;
        /** @private */
        this.corruptionLevel = 0;
        /** @private */
        this.activePrompt = null;
        /** @private */
        this.choiceMade = false;
        /** @private */
        this.isDestroyed = false;
    }
    
     /**
     * Initializes the system by subscribing to application events.
     */
    init() {
        console.log('[DegradationSystem] Initializing...');
        this.eventBridge.on('state:recognitionFailed', () => this.beginDegradation());
        this.guardian.registerCleanup(() => this.eventBridge.off('state:recognitionFailed', () => this.beginDegradation()));

        // Listen for white noise starting to trigger degradation (alternative trigger)
        this.eventBridge.on('audio:whiteNoiseStarted', () => this.beginDegradation());
        this.guardian.registerCleanup(() => this.eventBridge.off('audio:whiteNoiseStarted', () => this.beginDegradation()));

        console.log('[DegradationSystem] Initialized.');
    }
    
    /**
     * @private
     */
    beginDegradation() {
        if (consciousness.getState('clearLode.recognized') || this.degradationActive) return;

        console.log('🌀 [DegradationSystem] Beginning consciousness degradation...');
        this.degradationActive = true;
        consciousness.setState('clearLode.degradationStarted', true);
        
        this.eventBridge.emit('degradation:started');

        const choicePrompt = document.getElementById('choice-prompt');
        if (choicePrompt) choicePrompt.classList.remove('hidden');

        AnimationGuardian.safeAnimate('#choice-prompt', {
            display: 'block',
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => this.showInteractivePrompt()
        });
        
        consciousness.recordEvent('consciousness_degradation_started', {
            recognitionMissed: true,
            hintsShown: consciousness.getState('clearLode.hintsShown'),
            attempts: consciousness.getState('clearLode.recognitionAttempts')
        });
    }
    
    /**
     * Starts the cycling, multilingual, and corrupting glitch prompt sequence.
     * This is the heart of the interactive degradation experience.
     */
    startGlitchSequence() {
        if (this.glitchSequenceInterval) return;

        const glitchPrompts = this.config.glitchPrompts;
        if (!glitchPrompts || glitchPrompts.length === 0) {
            console.error("[DegradationSystem] No glitch prompts found in config.");
            return;
        }

        const promptElement = document.querySelector('.glitching-text');
        if (!promptElement) {
            console.error("'.glitching-text' element not found.");
            return;
        }

        let promptIndex = 0;
        this.corruptionLevel = 0;
        this.choiceMade = false;

        const intervalId = setInterval(() => {
            if (this.choiceMade) {
                clearInterval(intervalId);
                return;
            }

            // Cycle through prompts
            this.activePrompt = glitchPrompts[promptIndex];
            promptIndex = (promptIndex + 1) % glitchPrompts.length;

            // Increase corruption and apply it
            this.corruptionLevel += 0.05; // Slower corruption rate
            const corruptedText = this.applyTextCorruption(this.activePrompt, this.corruptionLevel);
            promptElement.textContent = corruptedText;

        }, 2000); // Switch language every 2 seconds
        this.guardian.registerTimer(intervalId, true);
        this.glitchSequenceInterval = intervalId;

        this.setupChoiceListener();
    }

    /**
     * Applies character-level corruption to a string based on a corruption level.
     * @param {string} text The input text.
     * @param {number} corruptionLevel A value from 0 (no corruption) to 1+ (max corruption).
     * @returns {string} The corrupted text.
     */
    applyTextCorruption(text, corruptionLevel) {
        const GLITCH_CHARS = ['▓', '░', '█', '▒', '?', '§', '¶'];
        
        return text.split('').map(char => {
            if (char.trim() === '') return char; // Preserve whitespace

            const roll = Math.random();
            const corruptionThreshold = corruptionLevel * 0.7; // Adjust multiplier to control intensity

            if (roll < corruptionThreshold) {
                // Increasingly likely to replace with glitch characters
                return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            }
            return char;
        }).join('');
    }

    /**
     * Creates interactive Y/N prompt elements and sets up event listeners.
     * This method creates the clickable elements that tests expect to find.
     */
    showInteractivePrompt() {
        console.log('🌀 [DegradationSystem] Showing interactive Y/N prompt...');

        // Create the interactive choice elements
        const choicePrompt = document.getElementById('choice-prompt');
        if (!choicePrompt) {
            console.error('choice-prompt element not found');
            return;
        }

        // Clear existing content and add interactive elements
        const glitchingText = choicePrompt.querySelector('.glitching-text');
        if (glitchingText) {
            glitchingText.innerHTML = `
                CONTINUE TO NEXT LIFE?
                <span id="degradation-choice-yes" class="choice-option" data-choice="yes">Y</span>/
                <span id="degradation-choice-no" class="choice-option" data-choice="no">N</span>
            `;
        }

        // Set up click listeners for the choice elements
        const yesChoice = document.getElementById('degradation-choice-yes');
        const noChoice = document.getElementById('degradation-choice-no');

        if (yesChoice && noChoice) {
            this.yesClickListener = () => this.handleChoiceSelection('yes');
            this.noClickListener = () => this.handleChoiceSelection('no');

            this.guardian.registerEventListener(yesChoice, 'click', this.yesClickListener);
            this.guardian.registerEventListener(noChoice, 'click', this.noClickListener);

            // Add visual feedback on hover
            yesChoice.style.cursor = 'pointer';
            noChoice.style.cursor = 'pointer';
        }

        // Set up keyboard listener as well
        this.setupChoiceListener();

        // Mark prompt as active and record start time
        this.promptActive = true;
        this.choiceStartTime = Date.now();

        // Start the timeout timer (30 seconds as per memory)
        this.timeoutTimer = setTimeout(() => {
            if (!this.choiceMade) {
                console.log('🕳️ [DegradationSystem] Choice timeout - defaulting to void');
                this.handleChoiceSelection('timeout');
            }
        }, 30000);
        this.guardian.registerTimer(this.timeoutTimer);
    }

    /**
     * Sets up a single, unified keyboard listener for handling multilingual choices.
     */
    setupChoiceListener() {
        // Mappings for different languages to a unified 'yes' or 'no'
        const CHOICE_MAP = {
            'y': 'yes', '是': 'yes', 'はい': 'yes', 'д': 'yes', 'o': 'yes',
            'n': 'no',  '否': 'no',  'いいえ': 'no', 'н': 'no'
        };

        this.choiceListener = (e) => {
            if (this.choiceMade) return;

            const key = e.key.toLowerCase();
            const choice = CHOICE_MAP[key];

            if (choice) {
                this.handleChoiceSelection(choice);
            }
        };

        this.guardian.registerEventListener(document, 'keydown', this.choiceListener);
    }

    /**
     * Public method for handling choice selection (used by tests and external calls).
     * @param {string} choice - The choice ('yes', 'no', or 'timeout').
     */
    handleChoice(choice) {
        this.handleChoiceSelection(choice);
    }

    /**
     * Handles the final choice selection, calculates karma, and stops the sequence.
     * @param {string} choice - The unified choice ('yes', 'no', or 'timeout').
     */
    handleChoiceSelection(choice) {
        if (this.choiceMade) return;
        this.choiceMade = true;
        this.promptActive = false;

        // Clear timeout timer
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
        }

        // Stop the sequence
        clearInterval(this.glitchSequenceInterval);
        this.glitchSequenceInterval = null;
        if (this.choiceListener) {
            document.removeEventListener('keydown', this.choiceListener);
            this.choiceListener = null;
        }

        // Calculate time to choice for karma
        const timeToChoice = this.choiceStartTime ? Date.now() - this.choiceStartTime : 0;

        console.log(`User selected: ${choice} (time: ${timeToChoice}ms)`);

        // Calculate Karma based on choice type
        let eventType = 'degradation_choice';
        if (choice === 'timeout') {
            eventType = 'degradation_timeout';
        } else {
            eventType = `degradation_choice_${choice}`;
        }

        const karmaImpact = this.karmicEngine.calculateImpact(eventType, {
            choice,
            timeToChoice
        });

        consciousness.recordEvent(eventType, {
            choice: choice,
            timeToChoice: timeToChoice,
            promptLanguage: this.activePrompt,
            corruptionLevel: this.corruptionLevel,
            karmaImpact: karmaImpact
        });

        this.eventBridge.emit('degradation:choice', {
            choice,
            timeToChoice,
            karmaImpact,
            degradationLevel: (consciousness.getState('clearLode.degradationLevel') || 0) + 1
        });

        // Visual feedback for the choice
        this.showChoiceFeedback(choice);
    }

    // Show visual feedback for the user's choice
    showChoiceFeedback(choice) {
        const promptElement = document.querySelector('.glitching-text');
        if (!promptElement) return;

        let feedbackText;
        switch (choice) {
            case 'yes':
                feedbackText = '...CONTINUING...';
                break;
            case 'no':
                feedbackText = '...DISSOLVING...';
                break;
            case 'timeout':
                feedbackText = '...VOID CLAIMS YOU...';
                break;
            default:
                feedbackText = '...UNKNOWN...';
        }

        AnimationGuardian.safeAnimate(promptElement, {
            duration: 0.5,
            text: { value: feedbackText, speed: 0.5 },
            ease: "none",
            onComplete: () => {
                AnimationGuardian.safeAnimate(promptElement, {
                    opacity: 0,
                    duration: 1,
                    delay: 1
                });
            }
        });
    }


    // Intensify degradation effects for refusal consequences
    intensifyEffects() {
        console.log('🌀 Intensifying degradation effects...');

        // Add more intense visual effects
        AnimationGuardian.safeAnimate('body', {
            filter: 'contrast(1.5) saturate(0.5) hue-rotate(45deg)',
            duration: 1,
            ease: 'power2.out'
        });

        // Intensify audio degradation if available
        if (this.orchestrator.audio) {
            this.orchestrator.audio.accelerateDegradation(0.2);
        }

        // Add screen shake effect
        AnimationGuardian.safeAnimate('body', {
            x: () => Math.random() * 10 - 5,
            y: () => Math.random() * 10 - 5,
            duration: 0.1,
            repeat: 20,
            yoyo: true,
            ease: 'power2.inOut',
            onComplete: () => {
                AnimationGuardian.safeAnimate('body', { x: 0, y: 0, duration: 0 });
            }
        });
    }

    /**
     * Cleans up all resources.
     */
    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        
        console.log('[DegradationSystem] Destroying...');
        if (this.glitchSequenceInterval) {
            clearInterval(this.glitchSequenceInterval);
            this.glitchSequenceInterval = null;
        }

        // The guardian will handle removing the keydown listener if it was registered.
        // Nullify references to help GC
        this.eventBridge = null;
        this.guardian = null;
        this.config = null;
        this.karmicEngine = null;
    }
}
