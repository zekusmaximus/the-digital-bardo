/**
 * @file Recognition Guide Controller - Progressive hint and guidance system
 *
 * This class provides comprehensive visual guidance for users during the recognition
 * window, including progressive hints, method instructions, and visual feedback.
 * It implements the requirements for clear user guidance without breaking immersion.
 */

import { manifestElement } from '../src/security/consciousness-purification.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

export class RecognitionGuideController {
    /**
     * @param {object} dependencies
     * @param {import('./event-bridge.js').ClearLodeEventBridge} dependencies.eventBridge
     * @param {import('../src/consciousness/resource-guardian.js').ResourceGuardian} dependencies.guardian
     * @param {object} dependencies.config
     */
    constructor({ eventBridge, guardian, config }) {
        if (!eventBridge || !guardian || !config) {
            throw new Error('RecognitionGuideController requires eventBridge, guardian, and config.');
        }

        /** @private */
        this.eventBridge = eventBridge;
        /** @private */
        this.guardian = guardian;
        /** @private */
        this.config = config;
        /** @private */
        this.isDestroyed = false;
        /** @private */
        this.isActive = false;

        // Timing and state tracking
        /** @private */
        this.recognitionStartTime = null;
        /** @private */
        this.currentHintIndex = 0;
        /** @private */
        this.hintTimers = [];
        /** @private */
        this.timeExtensions = 0;
        /** @private */
        this.maxTimeExtensions = this.config.recognitionWindow.maxExtensions || 2;
        /** @private */
        this.baseWindowDuration = this.config.recognitionWindow.baseWindowDuration || 15000;
        /** @private */
        this.extensionDuration = this.config.recognitionWindow.extensionDuration || 5000;
        /** @private */
        this.warningThreshold = this.config.recognitionWindow.warningThreshold || 0.75;
        /** @private */
        this.timeoutTimer = null;
        /** @private */
        this.warningTimer = null;
        /** @private */
        this.isUserActive = false;
        /** @private */
        this.lastActivityTime = null;

        // UI elements
        /** @private */
        this.guideContainer = null;
        /** @private */
        this.methodIndicators = null;
        /** @private */
        this.progressIndicator = null;
        /** @private */
        this.timeoutWarning = null;

        // Recognition methods configuration
        /** @private */
        this.recognitionMethods = [
            {
                id: 'center-click',
                name: 'Center Recognition',
                instruction: 'Click the center of the light',
                icon: '⊙',
                description: 'Direct recognition through focused attention'
            },
            {
                id: 'keyword-typing',
                name: 'Verbal Recognition',
                instruction: 'Type: RECOGNIZE, SELF, or HOME',
                icon: '⌨',
                description: 'Recognition through sacred words'
            },
            {
                id: 'spacebar-hold',
                name: 'Sustained Recognition',
                instruction: 'Hold spacebar for 3 seconds',
                icon: '⏳',
                description: 'Recognition through sustained attention'
            }
        ];

        // Progressive hint system
        /** @private */
        this.hintProgression = [
            {
                delay: 2000,
                text: "The clear light appears...",
                type: 'introduction',
                urgency: 'low'
            },
            {
                delay: 4000,
                text: "Recognition is possible in this moment",
                type: 'awareness',
                urgency: 'low'
            },
            {
                delay: 7000,
                text: "Three paths of recognition are available",
                type: 'guidance',
                urgency: 'medium'
            },
            {
                delay: 10000,
                text: "Click the center • Type sacred words • Hold spacebar",
                type: 'instruction',
                urgency: 'medium'
            },
            {
                delay: 13000,
                text: "Time grows short - choose your method",
                type: 'warning',
                urgency: 'high'
            }
        ];
    }

    /**
     * Initializes the guide controller by setting up event listeners
     */
    init() {
        console.log('[RecognitionGuideController] Initializing...');
        
        const listeners = [
            ['state:recognitionWindowOpened', this.startGuidance.bind(this)],
            ['state:recognitionSucceeded', this.handleRecognitionSuccess.bind(this)],
            ['state:recognitionFailed', this.handleRecognitionFailure.bind(this)],
            ['recognition:attachment', this.handleAttachmentFeedback.bind(this)],
            ['recognition:attempt', this.handleRecognitionAttempt.bind(this)],
            ['recognition:attemptFailed', this.handleAttemptFailure.bind(this)]
        ];

        listeners.forEach(([eventName, handler]) => {
            this.eventBridge.on(eventName, handler);
            this.guardian.registerCleanup(() => this.eventBridge.off(eventName, handler));
        });

        console.log('[RecognitionGuideController] Initialized.');
    }

    /**
     * Starts the guidance system when recognition window opens
     * @private
     */
    startGuidance() {
        if (this.isActive || this.isDestroyed) return;
        
        console.log('[RecognitionGuideController] Starting recognition guidance...');
        this.isActive = true;
        this.recognitionStartTime = Date.now();
        this.currentHintIndex = 0;
        this.timeExtensions = 0;

        // Create UI elements
        this.createGuideContainer();
        this.createMethodIndicators();
        this.createProgressIndicator();

        // Start progressive hint system
        this.startProgressiveHints();

        // Set up activity tracking
        this.setupActivityTracking();

        // Set up timeout warning system
        this.scheduleTimeoutWarning();

        // Record guidance start
        consciousness.recordEvent('recognition_guidance_started', {
            timestamp: this.recognitionStartTime,
            baseWindowDuration: this.baseWindowDuration
        });
    }

    /**
     * Creates the main guide container
     * @private
     */
    createGuideContainer() {
        this.guideContainer = manifestElement('div', {
            attributes: {
                id: 'recognition-guide',
                class: 'recognition-guide-container',
                'aria-live': 'polite',
                style: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1000;
                    font-family: 'Courier New', monospace;
                `
            }
        });

        document.body.appendChild(this.guideContainer);
        this.guardian.registerCleanup(() => {
            if (this.guideContainer) {
                this.guideContainer.remove();
                this.guideContainer = null;
            }
        });
    }

    /**
     * Creates visual indicators for each recognition method
     * @private
     */
    createMethodIndicators() {
        const indicatorsContainer = manifestElement('div', {
            attributes: {
                class: 'method-indicators',
                style: `
                    position: absolute;
                    bottom: 20%;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 40px;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                `
            }
        });

        this.recognitionMethods.forEach(method => {
            const indicator = manifestElement('div', {
                attributes: {
                    class: `method-indicator method-${method.id}`,
                    'data-method': method.id,
                    style: `
                        text-align: center;
                        color: rgba(255, 255, 255, 0.8);
                        background: rgba(0, 0, 0, 0.3);
                        padding: 15px;
                        border-radius: 8px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        min-width: 120px;
                        transition: all 0.3s ease;
                    `
                }
            });

            const icon = manifestElement('div', {
                attributes: {
                    class: 'method-icon',
                    style: `
                        font-size: 24px;
                        margin-bottom: 8px;
                    `
                }
            });
            icon.textContent = method.icon;

            const instruction = manifestElement('div', {
                attributes: {
                    class: 'method-instruction',
                    style: `
                        font-size: 12px;
                        line-height: 1.3;
                        opacity: 0.9;
                    `
                }
            });
            instruction.textContent = method.instruction;

            indicator.appendChild(icon);
            indicator.appendChild(instruction);
            indicatorsContainer.appendChild(indicator);
        });

        this.guideContainer.appendChild(indicatorsContainer);
        this.methodIndicators = indicatorsContainer;

        // Animate indicators in after a delay
        setTimeout(() => {
            if (this.methodIndicators && this.isActive) {
                this.methodIndicators.style.opacity = '1';
            }
        }, 3000);
    }

    /**
     * Creates a progress indicator showing time remaining
     * @private
     */
    createProgressIndicator() {
        this.progressIndicator = manifestElement('div', {
            attributes: {
                class: 'recognition-progress',
                style: `
                    position: absolute;
                    top: 15%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 300px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 2px;
                    overflow: hidden;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                `
            }
        });

        const progressBar = manifestElement('div', {
            attributes: {
                class: 'progress-bar',
                style: `
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50, #FFC107, #F44336);
                    transform: translateX(-100%);
                    transition: transform linear;
                `
            }
        });

        this.progressIndicator.appendChild(progressBar);
        this.guideContainer.appendChild(this.progressIndicator);

        // Start progress animation
        setTimeout(() => {
            if (this.progressIndicator && this.isActive) {
                this.progressIndicator.style.opacity = '1';
                const bar = progressBar;
                bar.style.transitionDuration = `${this.baseWindowDuration}ms`;
                bar.style.transform = 'translateX(0%)';
            }
        }, 1000);
    }

    /**
     * Starts the progressive hint system
     * @private
     */
    startProgressiveHints() {
        this.hintProgression.forEach((hint, index) => {
            const timer = setTimeout(() => {
                if (this.isActive && !this.isDestroyed) {
                    this.showHint(hint, index);
                }
            }, hint.delay);

            this.hintTimers.push(timer);
            this.guardian.registerTimer(timer);
        });
    }

    /**
     * Displays a progressive hint
     * @private
     * @param {object} hint - The hint configuration
     * @param {number} index - The hint index
     */
    showHint(hint, index) {
        const hintElement = manifestElement('div', {
            attributes: {
                class: `recognition-hint hint-${hint.type} hint-urgency-${hint.urgency}`,
                style: `
                    position: absolute;
                    top: 30%;
                    left: 50%;
                    transform: translateX(-50%);
                    color: ${this.getHintColor(hint.urgency)};
                    font-size: ${this.getHintSize(hint.urgency)};
                    text-align: center;
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    max-width: 80%;
                    line-height: 1.4;
                `
            }
        });

        hintElement.textContent = hint.text;
        this.guideContainer.appendChild(hintElement);

        // Animate hint in
        requestAnimationFrame(() => {
            hintElement.style.opacity = '1';
        });

        // Animate hint out after duration
        const fadeOutTimer = setTimeout(() => {
            if (hintElement.parentNode) {
                hintElement.style.opacity = '0';
                setTimeout(() => {
                    if (hintElement.parentNode) {
                        hintElement.remove();
                    }
                }, 500);
            }
        }, 3000);

        this.guardian.registerTimer(fadeOutTimer);

        // Update current hint index
        this.currentHintIndex = index;

        // Record hint display
        consciousness.recordEvent('recognition_hint_shown', {
            hintIndex: index,
            hintType: hint.type,
            urgency: hint.urgency,
            text: hint.text,
            timestamp: Date.now()
        });
    }

    /**
     * Gets the color for a hint based on urgency
     * @private
     * @param {string} urgency - The urgency level
     * @returns {string} CSS color value
     */
    getHintColor(urgency) {
        switch (urgency) {
            case 'low': return 'rgba(255, 255, 255, 0.8)';
            case 'medium': return 'rgba(255, 255, 255, 0.9)';
            case 'high': return 'rgba(255, 200, 200, 1)';
            default: return 'rgba(255, 255, 255, 0.8)';
        }
    }

    /**
     * Gets the font size for a hint based on urgency
     * @private
     * @param {string} urgency - The urgency level
     * @returns {string} CSS font-size value
     */
    getHintSize(urgency) {
        switch (urgency) {
            case 'low': return '16px';
            case 'medium': return '18px';
            case 'high': return '20px';
            default: return '16px';
        }
    }

    /**
     * Sets up activity tracking to detect user engagement
     * @private
     */
    setupActivityTracking() {
        const activityEvents = ['click', 'keydown', 'touchstart', 'mousemove'];
        
        const activityHandler = () => {
            this.isUserActive = true;
            this.lastActivityTime = Date.now();
        };

        activityEvents.forEach(eventType => {
            document.addEventListener(eventType, activityHandler, { passive: true });
            this.guardian.registerCleanup(() => {
                document.removeEventListener(eventType, activityHandler);
            });
        });

        // Reset activity flag periodically
        const activityResetTimer = setInterval(() => {
            if (this.lastActivityTime && Date.now() - this.lastActivityTime > 2000) {
                this.isUserActive = false;
            }
        }, 1000);

        this.guardian.registerTimer(activityResetTimer);
    }

    /**
     * Schedules timeout warning system with dynamic extensions
     * @private
     */
    scheduleTimeoutWarning() {
        // Clear any existing timers
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
        }

        const currentWindowDuration = this.baseWindowDuration + (this.timeExtensions * this.extensionDuration);
        
        // Warning at configured threshold of time elapsed
        const warningTime = currentWindowDuration * this.warningThreshold;
        this.warningTimer = setTimeout(() => {
            if (this.isActive && !this.isDestroyed) {
                this.showTimeoutWarning();
            }
        }, warningTime);

        // Final timeout
        this.timeoutTimer = setTimeout(() => {
            if (this.isActive && !this.isDestroyed) {
                this.handleTimeout();
            }
        }, currentWindowDuration);

        this.guardian.registerTimer(this.warningTimer);
        this.guardian.registerTimer(this.timeoutTimer);

        console.log(`[RecognitionGuideController] Scheduled timeout warning at ${warningTime}ms, timeout at ${currentWindowDuration}ms`);
    }

    /**
     * Shows timeout warning to user with countdown
     * @private
     */
    showTimeoutWarning() {
        // Remove any existing warning
        if (this.timeoutWarning) {
            this.timeoutWarning.remove();
            this.timeoutWarning = null;
        }

        this.timeoutWarning = manifestElement('div', {
            attributes: {
                class: 'timeout-warning',
                style: `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 100, 100, 0.15);
                    border: 2px solid rgba(255, 150, 150, 0.8);
                    color: rgba(255, 220, 220, 1);
                    padding: 25px 35px;
                    border-radius: 12px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: bold;
                    opacity: 0;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 20px rgba(255, 100, 100, 0.3);
                    z-index: 1001;
                `
            }
        });

        const currentWindowDuration = this.baseWindowDuration + (this.timeExtensions * this.extensionDuration);
        const elapsedTime = Date.now() - this.recognitionStartTime;
        const remainingTime = Math.ceil((currentWindowDuration - elapsedTime) / 1000);

        // Create warning content
        const warningContent = manifestElement('div', {
            attributes: {
                class: 'warning-content'
            }
        });

        const warningTitle = manifestElement('div', {
            attributes: {
                style: 'font-size: 22px; margin-bottom: 10px; color: rgba(255, 200, 200, 1);'
            }
        });
        warningTitle.textContent = '⚠ Recognition Window Closing';

        const countdownDisplay = manifestElement('div', {
            attributes: {
                class: 'countdown-display',
                style: 'font-size: 28px; margin: 15px 0; color: rgba(255, 255, 255, 1);'
            }
        });

        const extensionInfo = manifestElement('div', {
            attributes: {
                style: 'font-size: 14px; margin-top: 10px; opacity: 0.8;'
            }
        });

        if (this.timeExtensions < this.maxTimeExtensions) {
            extensionInfo.textContent = `Continue attempting recognition to extend time (${this.maxTimeExtensions - this.timeExtensions} extensions remaining)`;
        } else {
            extensionInfo.textContent = 'No more extensions available';
            extensionInfo.style.color = 'rgba(255, 150, 150, 1)';
        }

        warningContent.appendChild(warningTitle);
        warningContent.appendChild(countdownDisplay);
        warningContent.appendChild(extensionInfo);
        this.timeoutWarning.appendChild(warningContent);

        this.guideContainer.appendChild(this.timeoutWarning);

        // Start countdown animation
        this.startCountdownAnimation(countdownDisplay, remainingTime);

        requestAnimationFrame(() => {
            if (this.timeoutWarning) {
                this.timeoutWarning.style.opacity = '1';
                this.timeoutWarning.style.transform = 'translate(-50%, -50%) scale(1.05)';
            }
        });

        // Add pulsing animation
        const pulseKeyframes = `
            @keyframes timeout-pulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1.05); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
            }
        `;
        
        if (!document.querySelector('#timeout-pulse-style')) {
            const style = manifestElement('style', {
                attributes: { id: 'timeout-pulse-style' }
            });
            style.textContent = pulseKeyframes;
            document.head.appendChild(style);
        }

        this.timeoutWarning.style.animation = 'timeout-pulse 1.5s ease-in-out infinite';

        // Record timeout warning
        consciousness.recordEvent('recognition_timeout_warning', {
            remainingTime: remainingTime,
            extensionsUsed: this.timeExtensions,
            extensionsRemaining: this.maxTimeExtensions - this.timeExtensions,
            timestamp: Date.now()
        });
    }

    /**
     * Starts countdown animation for timeout warning
     * @private
     * @param {HTMLElement} countdownElement - Element to update with countdown
     * @param {number} initialTime - Initial countdown time in seconds
     */
    startCountdownAnimation(countdownElement, initialTime) {
        let timeRemaining = initialTime;
        
        const updateCountdown = () => {
            if (!this.isActive || !countdownElement.parentNode) return;
            
            countdownElement.textContent = `${timeRemaining}s`;
            
            // Change color as time gets critical
            if (timeRemaining <= 3) {
                countdownElement.style.color = 'rgba(255, 100, 100, 1)';
                countdownElement.style.textShadow = '0 0 10px rgba(255, 100, 100, 0.8)';
            } else if (timeRemaining <= 5) {
                countdownElement.style.color = 'rgba(255, 200, 100, 1)';
            }
            
            timeRemaining--;
            
            if (timeRemaining >= 0) {
                setTimeout(updateCountdown, 1000);
            }
        };
        
        updateCountdown();
    }

    /**
     * Handles recognition timeout with intelligent extension logic
     * @private
     */
    handleTimeout() {
        // Check if user has been active and extensions are available
        if (this.timeExtensions < this.maxTimeExtensions && this.isUserActive) {
            console.log('[RecognitionGuideController] User is active - extending recognition window');
            this.extendRecognitionWindow();
        } else if (this.timeExtensions < this.maxTimeExtensions) {
            // Show final chance warning
            this.showFinalChanceWarning();
        } else {
            console.log('[RecognitionGuideController] Recognition window timeout - no more extensions available');
            this.showTransitionIndicator();
            
            // Delay the actual timeout to show transition
            setTimeout(() => {
                if (this.isActive && !this.isDestroyed) {
                    this.eventBridge.emit('recognition:timeout');
                }
            }, 2000);
        }
    }

    /**
     * Shows final chance warning when user is inactive but extensions remain
     * @private
     */
    showFinalChanceWarning() {
        const finalWarning = manifestElement('div', {
            attributes: {
                class: 'final-chance-warning',
                style: `
                    position: absolute;
                    top: 45%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 50, 50, 0.2);
                    border: 3px solid rgba(255, 100, 100, 0.9);
                    color: rgba(255, 255, 255, 1);
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                    opacity: 0;
                    transition: all 0.5s ease;
                    box-shadow: 0 0 30px rgba(255, 50, 50, 0.5);
                    z-index: 1002;
                `
            }
        });

        finalWarning.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px;">⚠ FINAL CHANCE ⚠</div>
            <div style="margin-bottom: 10px;">Recognition window is closing</div>
            <div style="font-size: 16px; opacity: 0.9;">Make any recognition attempt to extend time</div>
        `;

        this.guideContainer.appendChild(finalWarning);

        requestAnimationFrame(() => {
            finalWarning.style.opacity = '1';
            finalWarning.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });

        // Give user 3 seconds to respond
        setTimeout(() => {
            if (this.isUserActive && this.timeExtensions < this.maxTimeExtensions) {
                this.extendRecognitionWindow();
                if (finalWarning.parentNode) {
                    finalWarning.remove();
                }
            } else {
                // No activity - proceed to timeout
                this.showTransitionIndicator();
                setTimeout(() => {
                    if (this.isActive && !this.isDestroyed) {
                        this.eventBridge.emit('recognition:timeout');
                    }
                }, 2000);
            }
        }, 3000);

        consciousness.recordEvent('recognition_final_chance_warning', {
            timestamp: Date.now(),
            extensionsRemaining: this.maxTimeExtensions - this.timeExtensions
        });
    }

    /**
     * Shows clear transition indicator when recognition phase ends
     * @private
     */
    showTransitionIndicator() {
        // Remove any existing warnings
        if (this.timeoutWarning) {
            this.timeoutWarning.remove();
            this.timeoutWarning = null;
        }

        const transitionIndicator = manifestElement('div', {
            attributes: {
                class: 'transition-indicator',
                style: `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: rgba(255, 255, 255, 0.9);
                    padding: 40px;
                    border-radius: 20px;
                    text-align: center;
                    font-size: 20px;
                    opacity: 0;
                    transition: all 0.8s ease;
                    z-index: 1003;
                `
            }
        });

        transitionIndicator.innerHTML = `
            <div style="font-size: 28px; margin-bottom: 20px;">Recognition Phase Complete</div>
            <div style="font-size: 16px; opacity: 0.8; margin-bottom: 15px;">The window of clear light has closed</div>
            <div style="font-size: 14px; opacity: 0.6;">Transitioning to next phase...</div>
        `;

        this.guideContainer.appendChild(transitionIndicator);

        requestAnimationFrame(() => {
            transitionIndicator.style.opacity = '1';
            transitionIndicator.style.transform = 'translate(-50%, -50%) scale(1.05)';
        });

        // Add fade-out animation
        setTimeout(() => {
            if (transitionIndicator.parentNode) {
                transitionIndicator.style.opacity = '0';
                transitionIndicator.style.transform = 'translate(-50%, -50%) scale(0.95)';
            }
        }, 1500);

        consciousness.recordEvent('recognition_transition_indicator_shown', {
            timestamp: Date.now(),
            totalExtensionsUsed: this.timeExtensions
        });
    }

    /**
     * Extends the recognition window if user is actively engaging
     * @private
     */
    extendRecognitionWindow() {
        if (this.timeExtensions >= this.maxTimeExtensions) {
            console.log('[RecognitionGuideController] Maximum extensions reached');
            return;
        }

        this.timeExtensions++;
        console.log(`[RecognitionGuideController] Extending recognition window (${this.timeExtensions}/${this.maxTimeExtensions})`);

        // Remove any existing warnings
        if (this.timeoutWarning) {
            this.timeoutWarning.remove();
            this.timeoutWarning = null;
        }

        // Show extension notification
        this.showExtensionNotification();

        // Update progress bar to reflect new duration
        this.updateProgressBar();

        // Schedule next timeout with extended duration
        this.scheduleTimeoutWarning();

        // Record extension
        consciousness.recordEvent('recognition_window_extended', {
            extensionNumber: this.timeExtensions,
            newTotalDuration: this.baseWindowDuration + (this.timeExtensions * this.extensionDuration),
            timestamp: Date.now()
        });
    }

    /**
     * Updates progress bar to reflect extended duration
     * @private
     */
    updateProgressBar() {
        if (!this.progressIndicator) return;

        const progressBar = this.progressIndicator.querySelector('.progress-bar');
        if (!progressBar) return;

        const elapsedTime = Date.now() - this.recognitionStartTime;
        const newTotalDuration = this.baseWindowDuration + (this.timeExtensions * this.extensionDuration);
        const remainingTime = newTotalDuration - elapsedTime;

        // Reset and restart progress bar with new duration
        progressBar.style.transition = 'none';
        progressBar.style.transform = `translateX(-${(elapsedTime / newTotalDuration) * 100}%)`;
        
        requestAnimationFrame(() => {
            progressBar.style.transition = `transform ${remainingTime}ms linear`;
            progressBar.style.transform = 'translateX(0%)';
        });
    }

    /**
     * Shows notification that window has been extended
     * @private
     */
    showExtensionNotification() {
        const notification = manifestElement('div', {
            attributes: {
                class: 'extension-notification',
                style: `
                    position: absolute;
                    top: 35%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(100, 255, 100, 0.15);
                    border: 2px solid rgba(150, 255, 150, 0.8);
                    color: rgba(200, 255, 200, 1);
                    padding: 20px 30px;
                    border-radius: 12px;
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                    opacity: 0;
                    transition: all 0.5s ease;
                    box-shadow: 0 0 20px rgba(100, 255, 100, 0.3);
                    z-index: 1001;
                `
            }
        });

        const extensionContent = manifestElement('div');
        
        const title = manifestElement('div', {
            attributes: {
                style: 'font-size: 20px; margin-bottom: 8px;'
            }
        });
        title.textContent = '⏰ Time Extended';

        const details = manifestElement('div', {
            attributes: {
                style: 'font-size: 16px; margin-bottom: 5px;'
            }
        });
        details.textContent = `+${this.extensionDuration / 1000} seconds added`;

        const remaining = manifestElement('div', {
            attributes: {
                style: 'font-size: 14px; opacity: 0.8;'
            }
        });
        remaining.textContent = `${this.maxTimeExtensions - this.timeExtensions} extensions remaining`;

        extensionContent.appendChild(title);
        extensionContent.appendChild(details);
        extensionContent.appendChild(remaining);
        notification.appendChild(extensionContent);

        this.guideContainer.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, -50%) scale(1.05)';
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translate(-50%, -50%) scale(0.95)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 4000);
    }

    /**
     * Provides visual feedback for recognition attempts
     * @param {object} detail - Event detail containing attempt information
     */
    provideFeedback(method, progress = null) {
        if (!this.isActive || this.isDestroyed) return;

        const methodIndicator = this.methodIndicators?.querySelector(`[data-method="${method}"]`);
        if (methodIndicator) {
            // Highlight the method being attempted
            methodIndicator.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            methodIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            methodIndicator.style.transform = 'scale(1.05)';

            // Reset after a short time
            setTimeout(() => {
                if (methodIndicator && this.isActive) {
                    methodIndicator.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    methodIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    methodIndicator.style.transform = 'scale(1)';
                }
            }, 1000);
        }

        // Show progress feedback if provided
        if (progress !== null) {
            this.showProgressFeedback(method, progress);
        }

        // Record feedback event
        consciousness.recordEvent('recognition_feedback_provided', {
            method: method,
            progress: progress,
            timestamp: Date.now()
        });
    }

    /**
     * Shows progress feedback for recognition attempts
     * @private
     * @param {string} method - The recognition method
     * @param {number} progress - Progress value (0-1)
     */
    showProgressFeedback(method, progress) {
        // Remove any existing progress feedback for this method
        const existingFeedback = this.guideContainer?.querySelector(`.progress-feedback.progress-${method}`);
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create method-specific progress feedback
        switch (method) {
            case 'spacebar-hold':
                this.showSpacebarProgressFeedback(progress);
                break;
            case 'keyword-typing':
                this.showKeywordProgressFeedback(progress);
                break;
            case 'center-click':
                this.showCenterClickProgressFeedback(progress);
                break;
            default:
                this.showGenericProgressFeedback(method, progress);
        }
    }

    /**
     * Shows enhanced progress feedback for spacebar hold method
     * @private
     * @param {number} progress - Progress value (0-1)
     */
    showSpacebarProgressFeedback(progress) {
        // Create or update the spacebar progress indicator
        let progressContainer = this.guideContainer?.querySelector('.spacebar-progress-container');
        
        if (!progressContainer) {
            progressContainer = manifestElement('div', {
                attributes: {
                    class: 'spacebar-progress-container progress-feedback progress-spacebar-hold',
                    style: `
                        position: absolute;
                        top: 65%;
                        left: 50%;
                        transform: translateX(-50%);
                        text-align: center;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    `
                }
            });

            // Progress bar background
            const progressBg = manifestElement('div', {
                attributes: {
                    class: 'spacebar-progress-bg',
                    style: `
                        width: 200px;
                        height: 8px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 4px;
                        margin: 0 auto 10px;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    `
                }
            });

            // Progress bar fill
            const progressFill = manifestElement('div', {
                attributes: {
                    class: 'spacebar-progress-fill',
                    style: `
                        height: 100%;
                        width: 0%;
                        background: linear-gradient(90deg, #4CAF50, #8BC34A, #CDDC39);
                        border-radius: 3px;
                        transition: width 0.1s ease, background-color 0.3s ease;
                        box-shadow: 0 0 10px rgba(139, 195, 74, 0.5);
                    `
                }
            });

            // Progress text
            const progressText = manifestElement('div', {
                attributes: {
                    class: 'spacebar-progress-text',
                    style: `
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    `
                }
            });

            // Hold instruction
            const holdInstruction = manifestElement('div', {
                attributes: {
                    class: 'spacebar-hold-instruction',
                    style: `
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 12px;
                        margin-top: 5px;
                    `
                }
            });

            progressBg.appendChild(progressFill);
            progressContainer.appendChild(progressText);
            progressContainer.appendChild(progressBg);
            progressContainer.appendChild(holdInstruction);
            this.guideContainer.appendChild(progressContainer);

            requestAnimationFrame(() => {
                progressContainer.style.opacity = '1';
            });
        }

        // Update progress
        const progressFill = progressContainer.querySelector('.spacebar-progress-fill');
        const progressText = progressContainer.querySelector('.spacebar-progress-text');
        const holdInstruction = progressContainer.querySelector('.spacebar-hold-instruction');

        if (progressFill && progressText && holdInstruction) {
            const progressPercent = Math.round(progress * 100);
            progressFill.style.width = `${progressPercent}%`;
            
            // Update text based on progress
            if (progress < 0.3) {
                progressText.textContent = 'Hold spacebar...';
                holdInstruction.textContent = 'Keep holding for recognition';
                progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            } else if (progress < 0.7) {
                progressText.textContent = `${progressPercent}% - Keep holding...`;
                holdInstruction.textContent = 'You\'re making progress!';
                progressFill.style.background = 'linear-gradient(90deg, #8BC34A, #CDDC39)';
            } else if (progress < 0.9) {
                progressText.textContent = `${progressPercent}% - Almost there!`;
                holdInstruction.textContent = 'Recognition imminent...';
                progressFill.style.background = 'linear-gradient(90deg, #CDDC39, #FFC107)';
                progressFill.style.boxShadow = '0 0 15px rgba(255, 193, 7, 0.7)';
            } else {
                progressText.textContent = `${progressPercent}% - Perfect!`;
                holdInstruction.textContent = 'Recognition achieved!';
                progressFill.style.background = 'linear-gradient(90deg, #FFC107, #FF9800)';
                progressFill.style.boxShadow = '0 0 20px rgba(255, 152, 0, 0.9)';
            }
        }

        // Auto-remove after delay if progress stops
        setTimeout(() => {
            if (progressContainer && progressContainer.parentNode && this.isActive) {
                progressContainer.style.opacity = '0';
                setTimeout(() => {
                    if (progressContainer.parentNode) {
                        progressContainer.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    /**
     * Shows enhanced progress feedback for keyword typing method
     * @private
     * @param {number} progress - Progress value (0-1)
     */
    showKeywordProgressFeedback(progress) {
        let feedbackElement = this.guideContainer?.querySelector('.keyword-progress-feedback');
        
        if (!feedbackElement) {
            feedbackElement = manifestElement('div', {
                attributes: {
                    class: 'keyword-progress-feedback progress-feedback progress-keyword-typing',
                    style: `
                        position: absolute;
                        top: 65%;
                        left: 50%;
                        transform: translateX(-50%);
                        text-align: center;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        background: rgba(0, 0, 0, 0.4);
                        padding: 15px 25px;
                        border-radius: 8px;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    `
                }
            });

            this.guideContainer.appendChild(feedbackElement);
            
            requestAnimationFrame(() => {
                feedbackElement.style.opacity = '1';
            });
        }

        const progressPercent = Math.round(progress * 100);
        let feedbackText = '';
        let color = 'rgba(255, 255, 255, 0.9)';

        if (progress < 0.3) {
            feedbackText = `Typing progress: ${progressPercent}%`;
            color = 'rgba(255, 255, 255, 0.8)';
        } else if (progress < 0.7) {
            feedbackText = `${progressPercent}% - Keep typing...`;
            color = 'rgba(200, 255, 200, 0.9)';
        } else {
            feedbackText = `${progressPercent}% - Almost complete!`;
            color = 'rgba(255, 255, 100, 1)';
        }

        feedbackElement.innerHTML = `
            <div style="color: ${color}; font-size: 14px; font-weight: bold; margin-bottom: 5px;">
                ${feedbackText}
            </div>
            <div style="color: rgba(255, 255, 255, 0.7); font-size: 12px;">
                Type: RECOGNIZE, SELF, or HOME
            </div>
        `;

        // Auto-remove after delay
        setTimeout(() => {
            if (feedbackElement && feedbackElement.parentNode && this.isActive) {
                feedbackElement.style.opacity = '0';
                setTimeout(() => {
                    if (feedbackElement.parentNode) {
                        feedbackElement.remove();
                    }
                }, 300);
            }
        }, 2500);
    }

    /**
     * Shows enhanced progress feedback for center click method
     * @private
     * @param {number} progress - Progress value (0-1)
     */
    showCenterClickProgressFeedback(progress) {
        const feedbackElement = manifestElement('div', {
            attributes: {
                class: 'center-click-progress-feedback progress-feedback progress-center-click',
                style: `
                    position: absolute;
                    top: 65%;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `
            }
        });

        const progressPercent = Math.round(progress * 100);
        let feedbackText = '';
        let color = 'rgba(255, 255, 255, 0.9)';

        if (progress < 0.5) {
            feedbackText = `${progressPercent}% - Click closer to center`;
            color = 'rgba(255, 200, 200, 0.9)';
        } else if (progress < 0.8) {
            feedbackText = `${progressPercent}% - Getting closer!`;
            color = 'rgba(255, 255, 200, 0.9)';
        } else {
            feedbackText = `${progressPercent}% - Very close!`;
            color = 'rgba(200, 255, 200, 0.9)';
        }

        feedbackElement.innerHTML = `
            <div style="color: ${color}; font-size: 14px; font-weight: bold;">
                ${feedbackText}
            </div>
        `;

        this.guideContainer.appendChild(feedbackElement);

        requestAnimationFrame(() => {
            feedbackElement.style.opacity = '1';
        });

        setTimeout(() => {
            if (feedbackElement.parentNode) {
                feedbackElement.style.opacity = '0';
                setTimeout(() => {
                    if (feedbackElement.parentNode) {
                        feedbackElement.remove();
                    }
                }, 300);
            }
        }, 1500);
    }

    /**
     * Shows generic progress feedback for other methods
     * @private
     * @param {string} method - The recognition method
     * @param {number} progress - Progress value (0-1)
     */
    showGenericProgressFeedback(method, progress) {
        const feedbackElement = manifestElement('div', {
            attributes: {
                class: `progress-feedback progress-${method}`,
                style: `
                    position: absolute;
                    top: 60%;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 14px;
                    text-align: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `
            }
        });

        const progressPercent = Math.round(progress * 100);
        feedbackElement.textContent = `${method} progress: ${progressPercent}%`;

        this.guideContainer.appendChild(feedbackElement);

        requestAnimationFrame(() => {
            feedbackElement.style.opacity = '1';
        });

        setTimeout(() => {
            if (feedbackElement.parentNode) {
                feedbackElement.style.opacity = '0';
                setTimeout(() => {
                    if (feedbackElement.parentNode) {
                        feedbackElement.remove();
                    }
                }, 300);
            }
        }, 2000);
    }

    /**
     * Handles successful recognition
     * @private
     * @param {object} detail - Event detail
     */
    handleRecognitionSuccess(detail) {
        console.log('[RecognitionGuideController] Recognition successful - stopping guidance');
        this.showSuccessFeedback(detail);
        this.stopGuidance();
    }

    /**
     * Shows enhanced success feedback animation with confirmation
     * @private
     * @param {object} detail - Recognition success details
     */
    showSuccessFeedback(detail) {
        // Clear any existing progress feedback
        const existingFeedback = this.guideContainer?.querySelectorAll('.progress-feedback');
        existingFeedback?.forEach(element => element.remove());

        // Create main success container
        const successContainer = manifestElement('div', {
            attributes: {
                class: 'recognition-success-container',
                style: `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    opacity: 0;
                    transition: all 0.8s ease;
                    z-index: 1001;
                `
            }
        });

        // Success icon with animation
        const successIcon = manifestElement('div', {
            attributes: {
                class: 'success-icon',
                style: `
                    font-size: 48px;
                    color: rgba(100, 255, 100, 1);
                    text-shadow: 0 0 30px rgba(100, 255, 100, 0.8);
                    margin-bottom: 15px;
                    transform: scale(0);
                    transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                `
            }
        });
        successIcon.textContent = '✓';

        // Success message
        const successMessage = manifestElement('div', {
            attributes: {
                class: 'success-message',
                style: `
                    color: rgba(200, 255, 200, 1);
                    font-size: 24px;
                    font-weight: bold;
                    text-shadow: 0 0 20px rgba(200, 255, 200, 0.8);
                    margin-bottom: 10px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s ease 0.3s;
                `
            }
        });
        successMessage.textContent = 'Recognition Achieved';

        // Method-specific confirmation
        const methodMessage = manifestElement('div', {
            attributes: {
                class: 'method-confirmation',
                style: `
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 16px;
                    margin-bottom: 15px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s ease 0.5s;
                `
            }
        });

        // Set method-specific message
        const method = detail?.method || 'unknown';
        switch (method) {
            case 'center-click':
            case 'center-click-perfect':
            case 'center-click-near':
                methodMessage.textContent = 'Perfect focus achieved through direct recognition';
                break;
            case 'perfect-hold':
                methodMessage.textContent = 'Sustained attention mastered';
                break;
            case 'typed-recognize':
            case 'typed-self':
            case 'typed-home':
                methodMessage.textContent = 'Sacred word recognition successful';
                break;
            default:
                methodMessage.textContent = 'Consciousness recognition complete';
        }

        // Karma bonus indicator if applicable
        const karmaBonus = detail?.karmaData?.bonus || 0;
        let bonusMessage = null;
        if (karmaBonus > 0) {
            bonusMessage = manifestElement('div', {
                attributes: {
                    class: 'karma-bonus',
                    style: `
                        color: rgba(255, 215, 0, 1);
                        font-size: 14px;
                        font-style: italic;
                        opacity: 0;
                        transform: translateY(20px);
                        transition: all 0.6s ease 0.7s;
                    `
                }
            });
            bonusMessage.textContent = `+${karmaBonus} karma bonus`;
        }

        // Transition indicator
        const transitionMessage = manifestElement('div', {
            attributes: {
                class: 'transition-message',
                style: `
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    margin-top: 20px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s ease 0.9s;
                `
            }
        });
        transitionMessage.textContent = 'Consciousness state preserved...';

        // Assemble success container
        successContainer.appendChild(successIcon);
        successContainer.appendChild(successMessage);
        successContainer.appendChild(methodMessage);
        if (bonusMessage) {
            successContainer.appendChild(bonusMessage);
        }
        successContainer.appendChild(transitionMessage);

        this.guideContainer.appendChild(successContainer);

        // Create particle effect background
        this.createSuccessParticles();

        // Animate elements in sequence
        requestAnimationFrame(() => {
            successContainer.style.opacity = '1';
            
            // Icon bounces in
            setTimeout(() => {
                successIcon.style.transform = 'scale(1)';
            }, 100);

            // Messages fade in with stagger
            setTimeout(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
            }, 400);

            setTimeout(() => {
                methodMessage.style.opacity = '1';
                methodMessage.style.transform = 'translateY(0)';
            }, 600);

            if (bonusMessage) {
                setTimeout(() => {
                    bonusMessage.style.opacity = '1';
                    bonusMessage.style.transform = 'translateY(0)';
                }, 800);
            }

            setTimeout(() => {
                transitionMessage.style.opacity = '1';
                transitionMessage.style.transform = 'translateY(0)';
            }, 1000);
        });

        // Record success feedback
        consciousness.recordEvent('recognition_success_feedback_shown', {
            method: method,
            karmaBonus: karmaBonus,
            timestamp: Date.now()
        });
    }

    /**
     * Creates particle effect for success feedback
     * @private
     */
    createSuccessParticles() {
        const particleContainer = manifestElement('div', {
            attributes: {
                class: 'success-particles',
                style: `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 300px;
                    height: 300px;
                    pointer-events: none;
                    z-index: 1000;
                `
            }
        });

        // Create multiple particles
        for (let i = 0; i < 12; i++) {
            const particle = manifestElement('div', {
                attributes: {
                    class: 'success-particle',
                    style: `
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: rgba(200, 255, 200, 0.8);
                        border-radius: 50%;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        opacity: 0;
                    `
                }
            });

            particleContainer.appendChild(particle);

            // Animate particle outward
            const angle = (i / 12) * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const duration = 1000 + Math.random() * 500;

            setTimeout(() => {
                particle.style.transition = `all ${duration}ms ease-out`;
                particle.style.opacity = '1';
                particle.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                }, duration * 0.7);
            }, i * 50);
        }

        this.guideContainer.appendChild(particleContainer);

        // Clean up particles
        setTimeout(() => {
            if (particleContainer.parentNode) {
                particleContainer.remove();
            }
        }, 2000);
    }

    /**
     * Handles recognition failure with clear feedback
     * @private
     * @param {object} detail - Failure event detail
     */
    handleRecognitionFailure(detail) {
        console.log('[RecognitionGuideController] Recognition failed - showing failure feedback');
        this.showFailureFeedback(detail);
        
        // Delay stopping guidance to show feedback
        setTimeout(() => {
            this.stopGuidance();
        }, 3000);
    }

    /**
     * Shows clear feedback for failed recognition attempts
     * @private
     * @param {object} detail - Failure details
     */
    showFailureFeedback(detail) {
        // Clear any existing progress feedback
        const existingFeedback = this.guideContainer?.querySelectorAll('.progress-feedback');
        existingFeedback?.forEach(element => element.remove());

        // Create failure feedback container
        const failureContainer = manifestElement('div', {
            attributes: {
                class: 'recognition-failure-container',
                style: `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    opacity: 0;
                    transition: all 0.6s ease;
                    z-index: 1001;
                `
            }
        });

        // Failure icon
        const failureIcon = manifestElement('div', {
            attributes: {
                class: 'failure-icon',
                style: `
                    font-size: 36px;
                    color: rgba(255, 150, 150, 0.9);
                    text-shadow: 0 0 20px rgba(255, 150, 150, 0.5);
                    margin-bottom: 15px;
                    transform: scale(0);
                    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                `
            }
        });
        failureIcon.textContent = '○';

        // Main failure message
        const failureMessage = manifestElement('div', {
            attributes: {
                class: 'failure-message',
                style: `
                    color: rgba(255, 200, 200, 0.9);
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s ease 0.2s;
                `
            }
        });
        failureMessage.textContent = 'Recognition Window Closed';

        // Explanation message
        const explanationMessage = manifestElement('div', {
            attributes: {
                class: 'explanation-message',
                style: `
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 16px;
                    margin-bottom: 15px;
                    line-height: 1.4;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s ease 0.4s;
                `
            }
        });
        explanationMessage.textContent = 'The clear light has passed without recognition';

        // Karmic consequence message
        const karmaMessage = manifestElement('div', {
            attributes: {
                class: 'karma-message',
                style: `
                    color: rgba(255, 180, 100, 0.9);
                    font-size: 14px;
                    font-style: italic;
                    margin-bottom: 20px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s ease 0.6s;
                `
            }
        });
        karmaMessage.textContent = 'Consciousness will now experience degradation';

        // Transition message
        const transitionMessage = manifestElement('div', {
            attributes: {
                class: 'transition-message',
                style: `
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 14px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s ease 0.8s;
                `
            }
        });
        transitionMessage.textContent = 'Entering intermediate state...';

        // Assemble failure container
        failureContainer.appendChild(failureIcon);
        failureContainer.appendChild(failureMessage);
        failureContainer.appendChild(explanationMessage);
        failureContainer.appendChild(karmaMessage);
        failureContainer.appendChild(transitionMessage);

        this.guideContainer.appendChild(failureContainer);

        // Animate elements in sequence
        requestAnimationFrame(() => {
            failureContainer.style.opacity = '1';
            
            // Icon appears
            setTimeout(() => {
                failureIcon.style.transform = 'scale(1)';
            }, 100);

            // Messages fade in with stagger
            setTimeout(() => {
                failureMessage.style.opacity = '1';
                failureMessage.style.transform = 'translateY(0)';
            }, 300);

            setTimeout(() => {
                explanationMessage.style.opacity = '1';
                explanationMessage.style.transform = 'translateY(0)';
            }, 500);

            setTimeout(() => {
                karmaMessage.style.opacity = '1';
                karmaMessage.style.transform = 'translateY(0)';
            }, 700);

            setTimeout(() => {
                transitionMessage.style.opacity = '1';
                transitionMessage.style.transform = 'translateY(0)';
            }, 900);
        });

        // Add subtle fade effect to background
        const fadeOverlay = manifestElement('div', {
            attributes: {
                class: 'failure-fade-overlay',
                style: `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.1);
                    opacity: 0;
                    transition: opacity 1s ease;
                    pointer-events: none;
                    z-index: 999;
                `
            }
        });

        this.guideContainer.appendChild(fadeOverlay);

        setTimeout(() => {
            fadeOverlay.style.opacity = '1';
        }, 1000);

        // Record failure feedback
        consciousness.recordEvent('recognition_failure_feedback_shown', {
            reason: detail?.reason || 'timeout',
            timestamp: Date.now()
        });
    }

    /**
     * Handles attachment feedback
     * @private
     * @param {object} detail - Attachment event detail
     */
    handleAttachmentFeedback(detail) {
        if (!this.isActive || this.isDestroyed) return;

        // Show subtle warning for attachment behavior
        const warningElement = manifestElement('div', {
            attributes: {
                class: 'attachment-warning',
                style: `
                    position: absolute;
                    top: 70%;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(255, 200, 100, 0.8);
                    font-size: 14px;
                    text-align: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `
            }
        });

        warningElement.textContent = 'Attachment detected - return to center';
        this.guideContainer.appendChild(warningElement);

        requestAnimationFrame(() => {
            warningElement.style.opacity = '1';
        });

        setTimeout(() => {
            if (warningElement.parentNode) {
                warningElement.style.opacity = '0';
                setTimeout(() => {
                    if (warningElement.parentNode) {
                        warningElement.remove();
                    }
                }, 300);
            }
        }, 2000);
    }

    /**
     * Handles recognition attempt events
     * @private
     * @param {object} detail - Attempt event detail
     */
    handleRecognitionAttempt(detail) {
        const { method, progress } = detail;
        this.provideFeedback(method, progress);

        // Mark user as active
        this.isUserActive = true;
        this.lastActivityTime = Date.now();

        // If user is actively attempting and making meaningful progress, consider extending window
        if (this.timeExtensions < this.maxTimeExtensions && progress > 0.2) {
            const timeElapsed = Date.now() - this.recognitionStartTime;
            const currentWindowDuration = this.baseWindowDuration + (this.timeExtensions * this.extensionDuration);
            const timeRemaining = currentWindowDuration - timeElapsed;
            
            // If less than 4 seconds remaining and user is making good progress
            if (timeRemaining < 4000) {
                console.log(`[RecognitionGuideController] User making progress (${Math.round(progress * 100)}%) - extending window`);
                this.extendRecognitionWindow();
            }
        }

        // Record attempt for analytics
        consciousness.recordEvent('recognition_attempt_tracked', {
            method: method,
            progress: progress,
            timeElapsed: Date.now() - this.recognitionStartTime,
            extensionsUsed: this.timeExtensions,
            timestamp: Date.now()
        });
    }

    /**
     * Handles failed recognition attempts with immediate feedback
     * @private
     * @param {object} detail - Failed attempt event detail
     */
    handleAttemptFailure(detail) {
        if (!this.isActive || this.isDestroyed) return;

        const { method, reason } = detail;
        this.showAttemptFailureFeedback(method, reason, detail);

        // Record attempt failure
        consciousness.recordEvent('recognition_attempt_failed', {
            method: method,
            reason: reason,
            detail: detail,
            timestamp: Date.now()
        });
    }

    /**
     * Shows immediate feedback for failed recognition attempts
     * @private
     * @param {string} method - The recognition method that failed
     * @param {string} reason - The reason for failure
     * @param {object} detail - Additional failure details
     */
    showAttemptFailureFeedback(method, reason, detail) {
        // Remove any existing attempt failure feedback
        const existingFailure = this.guideContainer?.querySelector('.attempt-failure-feedback');
        if (existingFailure) {
            existingFailure.remove();
        }

        const failureFeedback = manifestElement('div', {
            attributes: {
                class: 'attempt-failure-feedback',
                style: `
                    position: absolute;
                    top: 70%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 100, 100, 0.15);
                    border: 1px solid rgba(255, 150, 150, 0.6);
                    color: rgba(255, 200, 200, 0.9);
                    padding: 12px 20px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 14px;
                    opacity: 0;
                    transition: all 0.4s ease;
                    backdrop-filter: blur(5px);
                    box-shadow: 0 0 15px rgba(255, 100, 100, 0.2);
                `
            }
        });

        // Create method-specific failure messages
        let failureMessage = '';
        let helpText = '';

        switch (method) {
            case 'center-click':
                if (reason === 'too_far_from_center') {
                    failureMessage = '✗ Click closer to the center';
                    helpText = 'Aim for the bright core of the light';
                }
                break;
            case 'keyword-typing':
                if (reason === 'invalid_keyword') {
                    failureMessage = '✗ Invalid word';
                    helpText = 'Type: RECOGNIZE, SELF, or HOME';
                }
                break;
            case 'spacebar-hold':
                if (reason === 'released_too_early') {
                    failureMessage = '✗ Released too early';
                    helpText = 'Hold for 3 seconds in the sweet spot';
                } else if (reason === 'held_too_long') {
                    failureMessage = '✗ Held too long';
                    helpText = 'Release after 3 seconds for perfect timing';
                }
                break;
            default:
                failureMessage = '✗ Recognition attempt failed';
                helpText = 'Try again with focus';
        }

        failureFeedback.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">
                ${failureMessage}
            </div>
            <div style="font-size: 12px; opacity: 0.8;">
                ${helpText}
            </div>
        `;

        this.guideContainer.appendChild(failureFeedback);

        // Animate in
        requestAnimationFrame(() => {
            failureFeedback.style.opacity = '1';
            failureFeedback.style.transform = 'translateX(-50%) translateY(-5px)';
        });

        // Auto-remove after delay
        setTimeout(() => {
            if (failureFeedback.parentNode) {
                failureFeedback.style.opacity = '0';
                failureFeedback.style.transform = 'translateX(-50%) translateY(5px)';
                setTimeout(() => {
                    if (failureFeedback.parentNode) {
                        failureFeedback.remove();
                    }
                }, 400);
            }
        }, 2500);

        // Provide corrective guidance by highlighting the correct method
        this.highlightCorrectMethod(method);
    }

    /**
     * Highlights the correct method indicator after a failed attempt
     * @private
     * @param {string} method - The method that failed
     */
    highlightCorrectMethod(method) {
        const methodIndicator = this.methodIndicators?.querySelector(`[data-method="${method}"]`);
        if (methodIndicator) {
            // Add corrective highlighting
            methodIndicator.style.borderColor = 'rgba(255, 200, 100, 0.8)';
            methodIndicator.style.backgroundColor = 'rgba(255, 200, 100, 0.1)';
            methodIndicator.style.boxShadow = '0 0 15px rgba(255, 200, 100, 0.3)';

            // Reset after delay
            setTimeout(() => {
                if (methodIndicator && this.isActive) {
                    methodIndicator.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    methodIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    methodIndicator.style.boxShadow = 'none';
                }
            }, 3000);
        }
    }

    /**
     * Stops the guidance system and cleans up
     * @private
     */
    stopGuidance() {
        if (!this.isActive) return;

        console.log('[RecognitionGuideController] Stopping guidance system...');
        this.isActive = false;

        // Clear all timers
        this.hintTimers.forEach(timer => clearTimeout(timer));
        this.hintTimers = [];
        
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
        
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
        }

        // Fade out guide container
        if (this.guideContainer) {
            this.guideContainer.style.opacity = '0';
            setTimeout(() => {
                if (this.guideContainer && this.guideContainer.parentNode) {
                    this.guideContainer.remove();
                    this.guideContainer = null;
                }
            }, 500);
        }

        // Reset state
        this.methodIndicators = null;
        this.progressIndicator = null;
        this.timeoutWarning = null;
        this.recognitionStartTime = null;
        this.currentHintIndex = 0;
        this.timeExtensions = 0;
        this.isUserActive = false;
        this.lastActivityTime = null;
        this.warningTimer = null;
        this.timeoutTimer = null;

        // Record guidance end
        consciousness.recordEvent('recognition_guidance_ended', {
            timestamp: Date.now()
        });
    }

    /**
     * Destroys the guide controller and cleans up all resources
     */
    destroy() {
        if (this.isDestroyed) return;

        console.log('[RecognitionGuideController] Destroying...');
        this.isDestroyed = true;

        this.stopGuidance();

        // Nullify references
        this.eventBridge = null;
        this.guardian = null;
        this.config = null;
        this.recognitionMethods = null;
        this.hintProgression = null;

        console.log('[RecognitionGuideController] Destroyed.');
    }
}