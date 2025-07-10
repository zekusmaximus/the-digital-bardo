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
        this.glitchSequenceInterval = null;
        this.corruptionLevel = 0;
        this.activePrompt = null;
        this.choiceMade = false;
        this.choiceListener = null;

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
                this.startGlitchSequence();
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
    
    /**
     * Starts the cycling, multilingual, and corrupting glitch prompt sequence.
     * This is the heart of the interactive degradation experience.
     */
    startGlitchSequence() {
        if (this.glitchSequenceInterval) return;

        const glitchPrompts = this.orchestrator.config.glitchPrompts;
        if (!glitchPrompts || glitchPrompts.length === 0) {
            console.error("No glitch prompts found in orchestrator config.");
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

        this.glitchSequenceInterval = setInterval(() => {
            if (this.choiceMade) {
                clearInterval(this.glitchSequenceInterval);
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

        document.addEventListener('keydown', this.choiceListener);
    }

    /**
     * Handles the final choice selection, calculates karma, and stops the sequence.
     * @param {string} choice - The unified choice ('yes' or 'no').
     */
    handleChoiceSelection(choice) {
        if (this.choiceMade) return;
        this.choiceMade = true;

        // Stop the sequence
        clearInterval(this.glitchSequenceInterval);
        this.glitchSequenceInterval = null;
        if (this.choiceListener) {
            document.removeEventListener('keydown', this.choiceListener);
            this.choiceListener = null;
        }

        console.log(`User selected: ${choice} (mapped from multilingual input)`);
        
        // Calculate Karma
        let karmaImpact = { computational: 0, emotional: 0, temporal: 0, void: 0 };
        if (choice === 'yes') {
            karmaImpact.emotional -= 5; // Yearning for form
            karmaImpact.temporal += 2;
        } else { // 'no'
            karmaImpact.void += 10; // Embracing the void
            karmaImpact.computational += 5; // Acknowledging the system
        }

        // Record karma event
        consciousness.recordEvent(this.orchestrator.karmicEngine.KARMA_EVENTS.DEGRADATION_CHOICE, {
            choice: choice,
            promptLanguage: this.activePrompt,
            corruptionLevel: this.corruptionLevel,
            karmaImpact: karmaImpact
        });

        // Dispatch event for orchestrator to handle transition
        this.dispatchEvent('degradation:choice', {
            choice: choice,
            karmaImpact: karmaImpact,
            degradationLevel: consciousness.getState('clearLode.degradationLevel') || 0
        });

        // Visual feedback for the choice
        this.showChoiceFeedback(choice);
    }

    // Show visual feedback for the user's choice
    showChoiceFeedback(choice) {
        const promptElement = document.querySelector('.glitching-text');
        if (!promptElement) return;

        let feedbackText = choice === 'yes' ? '...CONTINUING...' : '...DISSOLVING...';
        
        gsap.timeline()
            .to(promptElement, {
                duration: 0.5,
                text: { value: feedbackText, speed: 0.5 },
                ease: "none"
            })
            .to(promptElement, {
                opacity: 0,
                duration: 1,
                delay: 1
            });
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

        // Clean up glitch sequence
        if (this.glitchSequenceInterval) {
            clearInterval(this.glitchSequenceInterval);
            this.glitchSequenceInterval = null;
        }
        if (this.choiceListener) {
            document.removeEventListener('keydown', this.choiceListener);
            this.choiceListener = null;
        }

        // Stop glitch timeline (if any other part uses it)
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

        // Clear any remaining timeouts (if re-introduced later)
        if (this.timeoutId) { // Safety check
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        if (this.bufferClearTimeout) {
            clearTimeout(this.bufferClearTimeout);
            this.bufferClearTimeout = null;
        }

        // Nullify all properties to break references
        this.orchestrator = null;
        this.glitchTimeline = null;
        this.glitchSequenceInterval = null;
        this.corruptionLevel = 0;
        this.activePrompt = null;
        this.choiceMade = false;
        this.choiceListener = null;
    }
}
