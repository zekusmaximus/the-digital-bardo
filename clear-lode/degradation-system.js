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

        /** @private */
        this.randomSeed = Date.now();
        
        /** @private */
        this.visualEnhancements = {
            corruptionEffectsEnabled: true,
            lightManifestationEnabled: true,
            phosphorEffectsEnabled: true
        };
        
        /** @private */
        this.degradationLevels = ['minimal', 'moderate', 'severe', 'complete'];
        /** @private */
        this.currentDegradationIndex = 0;
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

        // Initialize visual enhancement integration
        this.initializeVisualEnhancements();

        console.log('[DegradationSystem] Initialized.');
    }
    
    /**
     * Initializes integration with visual enhancement systems
     * @private
     */
    initializeVisualEnhancements() {
        // Check for visual performance manager
        if (window.visualPerformanceManager) {
            const tier = window.visualPerformanceManager.getPerformanceTier();
            this.adjustVisualEnhancementsForPerformance(tier);
        }
        
        // Set up consciousness state integration
        if (consciousness) {
            consciousness.subscribe('performance', (state) => {
                if (state.tier) {
                    this.adjustVisualEnhancementsForPerformance(state.tier);
                }
            });
        }
    }
    
    /**
     * Adjusts visual enhancements based on performance tier
     * @private
     */
    adjustVisualEnhancementsForPerformance(tier) {
        switch (tier) {
            case 'high':
                this.visualEnhancements = {
                    corruptionEffectsEnabled: true,
                    lightManifestationEnabled: true,
                    phosphorEffectsEnabled: true
                };
                break;
            case 'medium':
                this.visualEnhancements = {
                    corruptionEffectsEnabled: true,
                    lightManifestationEnabled: true,
                    phosphorEffectsEnabled: false
                };
                break;
            case 'low':
                this.visualEnhancements = {
                    corruptionEffectsEnabled: false,
                    lightManifestationEnabled: false,
                    phosphorEffectsEnabled: false
                };
                break;
        }
        
        console.log(`[DegradationSystem] Visual enhancements adjusted for ${tier} tier:`, this.visualEnhancements);
    }
    
    /**
     * @private
     */
    beginDegradation() {
        if (consciousness.getState('clearLode.recognized') || this.degradationActive) return;

        console.log('🌀 [DegradationSystem] Beginning consciousness degradation...');
        this.degradationActive = true;
        consciousness.setState('clearLode.degradationStarted', true);
        
        // Initialize degradation level
        const currentLevel = this.degradationLevels[this.currentDegradationIndex];
        consciousness.setState('clearLode.degradationLevel', currentLevel);
        
        // Apply visual degradation effects
        this.applyVisualDegradationEffects(currentLevel);
        
        this.eventBridge.emit('degradation:started');

        const choicePrompt = document.getElementById('choice-prompt');
        if (choicePrompt) {
            choicePrompt.classList.remove('hidden');
            choicePrompt.style.display = 'block';
            choicePrompt.style.opacity = '0';
            
            // Add degradation class for visual effects
            choicePrompt.setAttribute('data-degradation', currentLevel);
        }

        AnimationGuardian.safeAnimate('#choice-prompt', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            onStart: () => {
                console.log('🌀 [DegradationSystem] Choice prompt animation started');
            },
            onComplete: () => {
                console.log('🌀 [DegradationSystem] Choice prompt visible, starting interactive prompt');
                this.showInteractivePrompt();
            }
        });
        
        consciousness.recordEvent('consciousness_degradation_started', {
            recognitionMissed: true,
            hintsShown: consciousness.getState('clearLode.hintsShown'),
            attempts: consciousness.getState('clearLode.recognitionAttempts'),
            degradationLevel: currentLevel
        });
    }
    
    /**
     * Applies visual degradation effects based on current level
     * @private
     */
    applyVisualDegradationEffects(level) {
        // Update body data attribute for CSS targeting
        document.body.setAttribute('data-degradation', level);
        
        // Update consciousness state for other systems
        consciousness.setState('degradation', level);
        
        // Apply corruption effects if enabled
        if (this.visualEnhancements.corruptionEffectsEnabled) {
            this.applyCorruptionEffects(level);
        }
        
        // Trigger light manifestation effects if enabled
        if (this.visualEnhancements.lightManifestationEnabled && window.lightManifestationController) {
            this.triggerLightDegradationEffects(level);
        }
        
        // Apply phosphor effects if enabled
        if (this.visualEnhancements.phosphorEffectsEnabled) {
            this.applyPhosphorDegradationEffects(level);
        }
        
        console.log(`[DegradationSystem] Applied visual effects for degradation level: ${level}`);
    }
    
    /**
     * Applies corruption visual effects
     * @private
     */
    applyCorruptionEffects(level) {
        const intensityMap = {
            minimal: 0.2,
            moderate: 0.5,
            severe: 0.8,
            complete: 1.0
        };
        
        const intensity = intensityMap[level] || 0.2;
        
        // Update CSS variables for corruption effects
        document.documentElement.style.setProperty('--corruption-intensity', intensity);
        document.documentElement.style.setProperty('--zalgo-probability', intensity * 0.6);
        document.documentElement.style.setProperty('--chromatic-aberration', `${intensity * 4}px`);
        document.documentElement.style.setProperty('--digital-noise', intensity * 0.3);
        
        // Add corruption classes to existing fragments
        const fragments = document.querySelectorAll('.consciousness-fragment');
        fragments.forEach(fragment => {
            fragment.classList.add('corrupted-text');
            if (intensity >= 0.5) {
                fragment.classList.add('chromatic-aberration');
            }
            if (intensity >= 0.8) {
                fragment.classList.add('zalgo', 'digital-noise');
            }
        });
    }
    
    /**
     * Triggers light manifestation effects for degradation
     * @private
     */
    triggerLightDegradationEffects(level) {
        const lightController = window.lightManifestationController;
        if (!lightController) return;
        
        const intensityMap = {
            minimal: 0.1,
            moderate: 0.3,
            severe: 0.6,
            complete: 0.9
        };
        
        const intensity = intensityMap[level] || 0.1;
        
        // Set light intensity based on degradation
        lightController.setLightIntensity(intensity);
        
        // Adjust spiritual resonance inversely to degradation
        lightController.setSpiritualResonance(1 - intensity);
        
        // Trigger specific effects for severe degradation
        if (level === 'severe' || level === 'complete') {
            lightController.toggleTranscendence();
        }
    }
    
    /**
     * Applies phosphor degradation effects
     * @private
     */
    applyPhosphorDegradationEffects(level) {
        const intensityMap = {
            minimal: 0.1,
            moderate: 0.3,
            severe: 0.6,
            complete: 0.9
        };
        
        const intensity = intensityMap[level] || 0.1;
        
        // Update phosphor effect variables
        document.documentElement.style.setProperty('--phosphor-intensity', intensity);
        document.documentElement.style.setProperty('--scanline-opacity', intensity * 0.2);
        document.documentElement.style.setProperty('--crt-distortion', intensity);
        document.documentElement.style.setProperty('--bloom-intensity', intensity * 0.8);
    }
    
    /**
     * Starts the cycling, multilingual, and corrupting glitch prompt sequence.
     * This is the heart of the interactive degradation experience.
     */
    startGlitchSequence() {
        if (this.glitchSequenceInterval) return;

        const glitchPrompts = this.config.glitchPrompts;
        if (!glitchPrompts || glitchPrompts.length === 0) {
            console.error('[DegradationSystem] No glitch prompts found in config.');
            return;
        }

        const promptTextEl = document.querySelector('.glitching-text .prompt-text');
        if (!promptTextEl) {
            console.error("'.prompt-text' element not found.");
            return;
        }

        let promptIndex = 0;
        let corruptionLevel = 0;

        // Display the first prompt immediately
        this.activePrompt = glitchPrompts[0];
        this.corruptionLevel = corruptionLevel;
        this.updatePromptDisplay(this.activePrompt);

        const cycleInterval = setInterval(() => {
            if (this.choiceMade) {
                clearInterval(cycleInterval);
                return;
            }

            // Cycle through languages
            this.activePrompt = glitchPrompts[promptIndex % glitchPrompts.length];

            // Apply increasing corruption
            const corruptedPrompt = this.applyTextCorruption(this.activePrompt, corruptionLevel);

            // Update UI
            this.updatePromptDisplay(corruptedPrompt);

            // Increment counters
            promptIndex++;
            corruptionLevel = Math.min(1.0, corruptionLevel + 0.1);
            this.corruptionLevel = corruptionLevel;
        }, 1500);

        this.guardian.registerTimer(cycleInterval, true);
        this.glitchSequenceInterval = cycleInterval;
    }

    /**
     * Applies character-level corruption to a string based on a corruption level.
     * @param {string} text The input text.
     * @param {number} corruptionLevel A value from 0 (no corruption) to 1+ (max corruption).
     * @returns {string} The corrupted text.
     */
    applyTextCorruption(text, corruptionLevel) {
        const GLITCH_CHARS = ['▓', '▒', '░', '█', '◆', '◇', '◊', '○', '●', '∆', '¥', '€', '¢'];

        // Locate choice brackets to optionally preserve them
        const bracketMatch = text.match(/\[.*?\]/);
        const bracketStart = bracketMatch ? bracketMatch.index : -1;
        const bracketEnd = bracketMatch ? bracketStart + bracketMatch[0].length : -1;

        const corruptedText = text.split('').map((char, idx) => {
            if (char.trim() === '') return char; // Preserve whitespace

            if (idx >= bracketStart && idx < bracketEnd && corruptionLevel < 0.6) {
                // Keep choice brackets readable until heavy corruption
                return char;
            }

            const roll = this.seededRandom();
            const threshold = corruptionLevel;

            if (roll < threshold) {
                const replacement = GLITCH_CHARS[Math.floor(this.seededRandom() * GLITCH_CHARS.length)];
                return replacement;
            }
            return char;
        }).join('');
        
        // Update visual corruption level in real-time
        if (this.visualEnhancements.corruptionEffectsEnabled) {
            document.documentElement.style.setProperty('--corruption-intensity', corruptionLevel);
            
            // Apply Zalgo effects for high corruption
            if (corruptionLevel > 0.7) {
                const promptElement = document.querySelector('.prompt-text');
                if (promptElement) {
                    promptElement.classList.add('corrupted-text', 'zalgo');
                }
            }
        }
        
        return corruptedText;
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
                <span class="prompt-text"></span>
                <br>
                <span id="degradation-choice-yes" class="choice-option" data-choice="yes" title="Press Y or click to continue">Y</span>
                <span style="color: #666; margin: 0 8px;">/</span>
                <span id="degradation-choice-no" class="choice-option" data-choice="no" title="Press N or click to refuse">N</span>
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

        // Begin the multilingual glitch sequence
        this.startGlitchSequence();
        
        // Ensure immediate visibility with a fallback
        setTimeout(() => {
            const choicePrompt = document.getElementById('choice-prompt');
            const yesChoice = document.getElementById('degradation-choice-yes');
            const noChoice = document.getElementById('degradation-choice-no');
            
            console.log('🔍 [DegradationSystem] Visibility check:', {
                choicePrompt: choicePrompt ? 'found' : 'missing',
                yesChoice: yesChoice ? 'found' : 'missing',
                noChoice: noChoice ? 'found' : 'missing',
                promptVisible: choicePrompt ? getComputedStyle(choicePrompt).display : 'N/A',
                promptOpacity: choicePrompt ? getComputedStyle(choicePrompt).opacity : 'N/A'
            });
            
            if (choicePrompt && getComputedStyle(choicePrompt).opacity === '0') {
                console.log('⚠️ [DegradationSystem] Prompt not visible, forcing visibility');
                choicePrompt.style.opacity = '1';
                choicePrompt.style.display = 'block';
            }
        }, 100);
    }

    /**
     * Sets up a single, unified keyboard listener for handling multilingual choices.
     */
    setupChoiceListener() {
        // Mappings for different languages to a unified 'yes' or 'no'
        const CHOICE_MAP = {
            'y': 'yes', 's': 'yes', 'o': 'yes', 'j': 'yes',
            'はい': 'yes', 'д': 'yes', 'ن': 'yes',
            'n': 'no', 'l': 'no', 'н': 'no',
            '否': 'no', 'いいえ': 'no'
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

        // Progress degradation level based on choice
        this.progressDegradationLevel(choice);

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

        // Narrative-driven karma modifications
        if (timeToChoice < 5000) {
            karmaImpact.computational += 1; // quick decisive action
        } else if (timeToChoice > 10000) {
            karmaImpact.void += 1; // hesitation
        }
        if (this.corruptionLevel > 0.6 && choice !== 'timeout') {
            karmaImpact.temporal -= 1; // acting under heavy corruption
        }

        consciousness.recordEvent(eventType, {
            choice: choice,
            timeToChoice: timeToChoice,
            promptLanguage: this.activePrompt,
            corruptionLevel: this.corruptionLevel,
            karmaImpact: karmaImpact,
            degradationLevel: this.degradationLevels[this.currentDegradationIndex]
        });

        this.eventBridge.emit('degradation:choice', {
            choice,
            timeToChoice,
            karmaImpact,
            degradationLevel: this.degradationLevels[this.currentDegradationIndex]
        });

        // Visual feedback for the choice with enhanced effects
        this.showEnhancedChoiceFeedback(choice);
    }
    
    /**
     * Progresses the degradation level based on user choice
     * @private
     */
    progressDegradationLevel(choice) {
        if (choice === 'yes' || choice === 'timeout') {
            // Progress to next degradation level
            this.currentDegradationIndex = Math.min(
                this.currentDegradationIndex + 1,
                this.degradationLevels.length - 1
            );
        }
        // 'no' choice doesn't progress degradation
        
        const newLevel = this.degradationLevels[this.currentDegradationIndex];
        consciousness.setState('clearLode.degradationLevel', newLevel);
        
        // Apply new visual effects
        this.applyVisualDegradationEffects(newLevel);
        
        console.log(`[DegradationSystem] Degradation progressed to: ${newLevel}`);
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
    
    /**
     * Enhanced visual feedback with new visual effects
     * @private
     */
    showEnhancedChoiceFeedback(choice) {
        // Call original feedback
        this.showChoiceFeedback(choice);
        
        // Add enhanced visual effects based on choice
        if (this.visualEnhancements.lightManifestationEnabled && window.lightManifestationController) {
            switch (choice) {
                case 'yes':
                    // Trigger recognition moment for acceptance
                    window.lightManifestationController.triggerRecognition();
                    break;
                case 'no':
                    // Trigger enlightenment burst for refusal
                    window.lightManifestationController.triggerEnlightenment();
                    break;
                case 'timeout':
                    // Activate transcendence field for void
                    window.lightManifestationController.toggleTranscendence();
                    break;
            }
        }
        
        // Apply choice-specific corruption effects
        if (this.visualEnhancements.corruptionEffectsEnabled) {
            this.applyChoiceCorruptionEffects(choice);
        }
        
        // Trigger custom events for other systems
        document.dispatchEvent(new CustomEvent('degradation-choice-made', {
            detail: {
                choice,
                degradationLevel: this.degradationLevels[this.currentDegradationIndex],
                corruptionLevel: this.corruptionLevel
            }
        }));
    }
    
    /**
     * Applies choice-specific corruption effects
     * @private
     */
    applyChoiceCorruptionEffects(choice) {
        const choicePrompt = document.getElementById('choice-prompt');
        if (!choicePrompt) return;
        
        switch (choice) {
            case 'yes':
                // Intensify corruption for acceptance
                choicePrompt.classList.add('corrupted-severe');
                document.documentElement.style.setProperty('--corruption-intensity', '0.8');
                break;
            case 'no':
                // Purification effect for refusal
                choicePrompt.classList.add('corruption-purification');
                document.documentElement.style.setProperty('--corruption-intensity', '0.2');
                break;
            case 'timeout':
                // Complete corruption for void
                choicePrompt.classList.add('corrupted-complete');
                document.documentElement.style.setProperty('--corruption-intensity', '1.0');
                break;
        }
    }
    
    /**
     * Gets the current degradation level
     * @returns {string} Current degradation level
     */
    getDegradationLevel() {
        return this.degradationLevels[this.currentDegradationIndex];
    }
    
    /**
     * Gets the current degradation state for external systems
     * @returns {string} Current degradation state
     */
    getDegradationState() {
        return this.getDegradationLevel();
    }

    /**
     * Updates the visible prompt text while keeping choice options intact.
     * Also sets an aria-label for screen readers using the uncorrupted text.
     * @param {string} corruptedText
     */
    updatePromptDisplay(corruptedText) {
        const textEl = document.querySelector('.glitching-text .prompt-text');
        if (!textEl) return;
        
        textEl.textContent = corruptedText;
        textEl.setAttribute('aria-label', this.activePrompt);
        
        // Ensure the choice prompt is visible
        const choicePrompt = document.getElementById('choice-prompt');
        if (choicePrompt && choicePrompt.classList.contains('hidden')) {
            choicePrompt.classList.remove('hidden');
        }
        
        // Add visual emphasis to choice options during heavy corruption
        const yesChoice = document.getElementById('degradation-choice-yes');
        const noChoice = document.getElementById('degradation-choice-no');
        
        if (this.corruptionLevel > 0.7) {
            if (yesChoice) yesChoice.style.animation = 'choice-pulse 1s infinite';
            if (noChoice) noChoice.style.animation = 'choice-pulse 1s infinite';
        }
    }

    /**
     * Deterministic pseudo-random number generator for consistent corruption.
     * @private
     */
    seededRandom() {
        const x = Math.sin(this.randomSeed++) * 10000;
        return x - Math.floor(x);
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
