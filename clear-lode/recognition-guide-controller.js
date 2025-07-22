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
        this.maxTimeExtensions = 2;
        /** @private */
        this.baseWindowDuration = 15000; // 15 seconds minimum
        /** @private */
        this.extensionDuration = 5000; // 5 seconds per extension

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
            ['recognition:attempt', this.handleRecognitionAttempt.bind(this)]
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
     * Schedules timeout warning system
     * @private
     */
    scheduleTimeoutWarning() {
        // Warning at 75% of time elapsed
        const warningTime = this.baseWindowDuration * 0.75;
        const warningTimer = setTimeout(() => {
            if (this.isActive && !this.isDestroyed) {
                this.showTimeoutWarning();
            }
        }, warningTime);

        this.guardian.registerTimer(warningTimer);

        // Final timeout
        const timeoutTimer = setTimeout(() => {
            if (this.isActive && !this.isDestroyed) {
                this.handleTimeout();
            }
        }, this.baseWindowDuration);

        this.guardian.registerTimer(timeoutTimer);
    }

    /**
     * Shows timeout warning to user
     * @private
     */
    showTimeoutWarning() {
        this.timeoutWarning = manifestElement('div', {
            attributes: {
                class: 'timeout-warning',
                style: `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 0, 0, 0.1);
                    border: 2px solid rgba(255, 0, 0, 0.5);
                    color: rgba(255, 200, 200, 1);
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 18px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    animation: pulse 1s infinite;
                `
            }
        });

        const remainingTime = Math.ceil((this.baseWindowDuration - (Date.now() - this.recognitionStartTime)) / 1000);
        this.timeoutWarning.textContent = `Recognition window closing in ${remainingTime} seconds...`;

        this.guideContainer.appendChild(this.timeoutWarning);

        requestAnimationFrame(() => {
            if (this.timeoutWarning) {
                this.timeoutWarning.style.opacity = '1';
            }
        });

        // Record timeout warning
        consciousness.recordEvent('recognition_timeout_warning', {
            remainingTime: remainingTime,
            timestamp: Date.now()
        });
    }

    /**
     * Handles recognition timeout
     * @private
     */
    handleTimeout() {
        if (this.timeExtensions < this.maxTimeExtensions) {
            this.extendRecognitionWindow();
        } else {
            console.log('[RecognitionGuideController] Recognition window timeout - no more extensions available');
            this.eventBridge.emit('recognition:timeout');
        }
    }

    /**
     * Extends the recognition window if user is actively engaging
     * @private
     */
    extendRecognitionWindow() {
        this.timeExtensions++;
        console.log(`[RecognitionGuideController] Extending recognition window (${this.timeExtensions}/${this.maxTimeExtensions})`);

        // Remove timeout warning
        if (this.timeoutWarning) {
            this.timeoutWarning.remove();
            this.timeoutWarning = null;
        }

        // Show extension notification
        this.showExtensionNotification();

        // Schedule next timeout
        this.scheduleTimeoutWarning();

        // Record extension
        consciousness.recordEvent('recognition_window_extended', {
            extensionNumber: this.timeExtensions,
            timestamp: Date.now()
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
                    top: 40%;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(200, 255, 200, 1);
                    font-size: 16px;
                    text-align: center;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                `
            }
        });

        notification.textContent = `Recognition window extended (+${this.extensionDuration / 1000} seconds)`;
        this.guideContainer.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 3000);
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
     * Shows success feedback animation
     * @private
     * @param {object} detail - Recognition success details
     */
    showSuccessFeedback(detail) {
        const successElement = manifestElement('div', {
            attributes: {
                class: 'recognition-success',
                style: `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: rgba(200, 255, 200, 1);
                    font-size: 24px;
                    text-align: center;
                    text-shadow: 0 0 20px rgba(200, 255, 200, 0.8);
                    opacity: 0;
                    transition: all 0.5s ease;
                `
            }
        });

        successElement.textContent = '✓ Recognition Achieved';
        this.guideContainer.appendChild(successElement);

        requestAnimationFrame(() => {
            successElement.style.opacity = '1';
            successElement.style.transform = 'translate(-50%, -50%) scale(1.2)';
        });

        // Record success feedback
        consciousness.recordEvent('recognition_success_feedback_shown', {
            method: detail?.method || 'unknown',
            timestamp: Date.now()
        });
    }

    /**
     * Handles recognition failure
     * @private
     */
    handleRecognitionFailure() {
        console.log('[RecognitionGuideController] Recognition failed - stopping guidance');
        this.stopGuidance();
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

        // If user is actively attempting, consider extending window
        if (this.timeExtensions < this.maxTimeExtensions) {
            const timeElapsed = Date.now() - this.recognitionStartTime;
            const timeRemaining = this.baseWindowDuration - timeElapsed;
            
            // If less than 3 seconds remaining and user is actively trying
            if (timeRemaining < 3000 && progress > 0.1) {
                this.extendRecognitionWindow();
            }
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

        // Clear all hint timers
        this.hintTimers.forEach(timer => clearTimeout(timer));
        this.hintTimers = [];

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