/**
 * @file Handles user input for recognition during the Clear Lode experience.
 *
 * This class is responsible for detecting specific user interactions (e.g., clicks,
 * key presses) that signify "recognition." It no longer manages its own state
 * but instead listens for state change events from the EventBridge to know when
 * to activate or deactivate its listeners. Upon successful recognition or forming
 * an attachment, it emits events back to the bridge.
 */

import { manifestElement } from '../src/security/consciousness-purification.js';
import { createKarmicValidator, mouseEventSchema, keyboardEventSchema, touchEventSchema } from '../src/security/karmic-validation.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

// Configuration for recognition methods
const CENTER_RADIUS = 50; // px
const HOLD_SWEET_SPOT = { min: 2800, max: 3200 }; // ms
const KEYWORDS = ['RECOGNIZE', 'SELF', 'HOME']; // Case-insensitive

export class RecognitionHandler {
    /**
     * @param {object} dependencies
     * @param {import('./event-bridge.js').ClearLodeEventBridge} dependencies.eventBridge
     * @param {import('../src/consciousness/resource-guardian.js').ResourceGuardian} dependencies.guardian
     */
    constructor({ eventBridge, guardian }) {
        if (!eventBridge || !guardian) {
            throw new Error('RecognitionHandler requires an eventBridge and a guardian.');
        }
        /** @private */
        this.eventBridge = eventBridge;
        /** @private */
        this.guardian = guardian;
        /** @private */
        this.isListening = false;
        /** @private */
        this.isDestroyed = false;

        /** @private */
        this.centerPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        /** @private */
        this.typedBuffer = '';
        /** @private */
        this.lastKeyTime = 0;
        /** @private */
        this.spacebarDownTime = null;
        /** @private */
        this.progressCircle = null;
        /** @private */
        this.progressAnimation = null;
        /** @private */
        this.typingTimeout = null;


        // Debounced resize handler
        this.handleResize = this.debounce(this.updateCenterPoint.bind(this), 200);
    }

    /**
     * Initializes the handler by subscribing to application state events.
     */
    init() {
        console.log('[RecognitionHandler] Initializing...');
        const listeners = [
            ['state:recognitionWindowOpened', this.startListening.bind(this)],
            ['state:recognitionSucceeded', this.stopListening.bind(this)],
            ['state:recognitionFailed', this.stopListening.bind(this)],
        ];

        listeners.forEach(([eventName, handler]) => {
            this.eventBridge.on(eventName, handler);
            this.guardian.registerCleanup(() => this.eventBridge.off(eventName, handler));
        });
        console.log('[RecognitionHandler] Initialized.');
    }

    /**
     * Activates all recognition listeners. Called when the recognition window opens.
     * @private
     */
    startListening() {
        if (this.isListening || this.isDestroyed) return;
        console.log('[RecognitionHandler] Starting recognition listeners...');
        this.isListening = true;

        const cleanupTasks = [
            ...this.bindCenterClick(),
            ...this.bindKeywordTyping(),
            ...this.bindSpacebarHold(),
            ...this.bindAttachmentDetectors(),
        ];
        
        // Register a single cleanup function that will execute all individual cleanup tasks.
        this.guardian.registerCleanup(() => {
            cleanupTasks.forEach(task => task());
        });
    }

    /**
     * Deactivates all recognition listeners and cleans up UI.
     * @private
     */
    stopListening() {
        if (!this.isListening) return;
        console.log('[RecognitionHandler] Stopping recognition listeners...');
        this.isListening = false;

        // The ResourceGuardian will handle removing the event listeners.
        // We just need to clean up any UI or animations we created.
        if (this.progressAnimation) {
            this.progressAnimation.kill();
            this.progressAnimation = null;
        }

        if (window.gsap) {
            window.gsap.killTweensOf(['#recognition-typing', '#progress-circle', '.recognition-ripple']);
        }
        
        this.cleanupUI();
    }
    
    /**
     * Binds listeners that detect "attachment" behaviors.
     * @private
     * @returns {Array<Function>} An array of cleanup functions. 
     */
    bindAttachmentDetectors() {
        const mouseMoveHandler = (e) => this.handleMouseMove(e);
        document.addEventListener('mousemove', mouseMoveHandler);

        const blurHandler = () => this.handleWindowBlur();
        window.addEventListener('blur', blurHandler);
        
        const resizeHandler = this.handleResize;
        window.addEventListener('resize', resizeHandler);

        return [
            () => document.removeEventListener('mousemove', mouseMoveHandler),
            () => window.removeEventListener('blur', blurHandler),
            () => window.removeEventListener('resize', resizeHandler),
        ];
    }
    
    handleMouseMove(e) {
        if (this.isInWindow()) {
            // This is a simplistic check for "attachment" via frantic movement.
            // A more sophisticated implementation could be used.
            this.recordAttachment('excessive_movement', { x: e.clientX, y: e.clientY });
        }
    }
    
    handleWindowBlur() {
        if (this.isInWindow()) {
            this.recordAttachment('distraction_blur');
        }
    }


    /**
     * Emits a `recognition:details` event to the event bridge.
     * @private
     */
    achieveRecognition(method, karmaData = {}) {
        if (!this.isInWindow()) {
            console.warn(`[RecognitionHandler] Recognition attempted in invalid state.`);
            return;
        }
        
        const startTime = consciousness.getState('clearLode.recognitionWindowStartTime') || Date.now();
        const elapsed = Date.now() - startTime;
        karmaData.elapsedTime = elapsed;

        karmaData.perfectTiming = (elapsed >= HOLD_SWEET_SPOT.min && elapsed <= HOLD_SWEET_SPOT.max);
        
        console.log(`🌟 [RecognitionHandler] Recognition achieved via ${method}. Emitting details.`);
        
        this.eventBridge.emit('recognition:details', {
            method,
            timestamp: Date.now(),
            karmaData,
        });
    }

    /**
     * Emits a `recognition:attachment` event to the event bridge.
     * @private
     */
    recordAttachment(type, data = {}) {
        console.log(`⚠️ [RecognitionHandler] Attachment formed: ${type}`, data);
        this.eventBridge.emit('recognition:attachment', {
            type,
            data,
            timestamp: Date.now(),
        });
    }
    
    /**
     * Cleans up all resources. Registered with the guardian.
     */
    destroy() {
        this.isDestroyed = true;
        this.stopListening(); // Ensure listeners are off
        // Nullify properties to help with GC
        this.eventBridge = null;
        this.guardian = null;
        this.progressCircle = null;
        this.progressAnimation = null;
        console.log('[RecognitionHandler] Destroyed.');
    }

    // --- RECOGNITION METHODS ---

    /**
     * Check if we're currently in the recognition window.
     * @private
     */
    isInWindow() {
        // This now defers to the centrally-managed state.
        return consciousness.getState('clearLode.recognitionActive') && !consciousness.getState('clearLode.recognized');
    }

    /**
     * @private
     */
    bindCenterClick() {
        const handler = (e) => {
            if (!this.isInWindow()) return;

            const isTouch = e.type.includes('touch');
            const validateEvent = createKarmicValidator(isTouch ? touchEventSchema : mouseEventSchema);

            if (!validateEvent(e)) {
                console.error("Karmic validation failed for click/touch event. Aborting.", e);
                this.recordAttachment('invalid_event_stream', { eventType: e.type });
                return;
            }

            const point = isTouch ?
                { x: e.touches[0].clientX, y: e.touches[0].clientY } :
                { x: e.clientX, y: e.clientY };

            const dist = Math.hypot(point.x - this.centerPoint.x, point.y - this.centerPoint.y);

            if (dist <= CENTER_RADIUS) {
                const method = dist < 10 ? 'center-click-perfect' : 'center-click-near';
                this.achieveRecognition(method, {
                    distance: dist,
                    bonus: dist < 10 ? 5 : 0
                });
            } else {
                this.createRipple(point);
                // Emit recognition attempt event for guidance system
                this.eventBridge.emit('recognition:attempt', {
                    method: 'center-click',
                    progress: Math.max(0, 1 - (dist / CENTER_RADIUS)),
                    timestamp: Date.now()
                });
            }
        };

        document.addEventListener('click', handler);
        document.addEventListener('touchstart', handler);

        return [
            () => document.removeEventListener('click', handler),
            () => document.removeEventListener('touchstart', handler),
        ];

    }

    /**
     * @private
     */
    createRipple(point) {
        const ripple = manifestElement('span', {
           attributes: {
               class: 'recognition-ripple',
               style: `position: fixed; left: ${point.x}px; top: ${point.y}px; width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.6); border-radius: 50%; pointer-events: none; z-index: 1000; transform: translate(-50%, -50%); animation: ripple-expand 0.6s ease-out forwards;`
           }
        });
        document.body.appendChild(ripple);
        
        const cleanup = () => ripple.remove();
        ripple.addEventListener('animationend', cleanup);
        this.guardian.registerCleanup(cleanup); // Ensure even abandoned ripples are cleaned up
    }

    /**
     * @private
     */
    bindKeywordTyping() {
        const display = manifestElement('div', {
           attributes: {
               id: 'recognition-typing',
               'aria-live': 'polite',
               style: `position: fixed; top: 60%; left: 50%; transform: translateX(-50%); font-family: monospace; font-size: 18px; color: rgba(0,0,0,0.7); background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 4px; pointer-events: none; z-index: 1000; opacity: 0; transition: opacity 0.3s ease;`
           }
       });
        document.body.appendChild(display);
        this.guardian.registerCleanup(() => display.remove());

        const handler = (e) => {
            if (!this.isInWindow() || !e.key.match(/^[a-zA-Z]$/)) return;

            const now = Date.now();
            if (now - this.lastKeyTime > 2000) this.typedBuffer = '';

            this.typedBuffer += e.key.toUpperCase();
            this.lastKeyTime = now;

            display.textContent = this.typedBuffer;
            display.style.opacity = '1';

            if (this.typingTimeout) clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
                display.style.opacity = '0';
            }, 2000);
            this.guardian.registerTimer(this.typingTimeout);

            if (KEYWORDS.includes(this.typedBuffer)) {
                this.achieveRecognition(`typed-${this.typedBuffer.toLowerCase()}`, { word: this.typedBuffer });
            } else if (!KEYWORDS.some(k => k.startsWith(this.typedBuffer))) {
                this.typedBuffer = '';
                display.classList.add('error-flash');
                setTimeout(() => display.classList.remove('error-flash'), 200);
            } else {
                // Emit recognition attempt event for partial keyword matches
                const bestMatch = KEYWORDS.find(k => k.startsWith(this.typedBuffer));
                const progress = bestMatch ? this.typedBuffer.length / bestMatch.length : 0;
                this.eventBridge.emit('recognition:attempt', {
                    method: 'keyword-typing',
                    progress: progress,
                    partialWord: this.typedBuffer,
                    timestamp: Date.now()
                });
            }
        };

        document.addEventListener('keydown', handler);
        return [() => document.removeEventListener('keydown', handler)];
    }

    /**
     * @private
     */
    bindSpacebarHold() {
        this.createProgressCircle();

        const downHandler = (e) => {
            if ((e.code === 'Space' || e.type === 'touchstart') && !this.spacebarDownTime && this.isInWindow()) {
                e.preventDefault();
                this.spacebarDownTime = Date.now();
                this.animateProgress();
            }
        };

        const upHandler = (e) => {
            if ((e.code === 'Space' || e.type === 'touchend') && this.spacebarDownTime) {
                const duration = Date.now() - this.spacebarDownTime;
                if (duration >= HOLD_SWEET_SPOT.min && duration <= HOLD_SWEET_SPOT.max) {
                    this.achieveRecognition('perfect-hold', { duration });
                } else {
                    this.resetProgress();
                    // Emit recognition attempt event for incomplete holds
                    const progress = Math.min(1, duration / HOLD_SWEET_SPOT.min);
                    this.eventBridge.emit('recognition:attempt', {
                        method: 'spacebar-hold',
                        progress: progress,
                        duration: duration,
                        timestamp: Date.now()
                    });
                }
                this.spacebarDownTime = null;
            }
        };

        const centerEl = document.querySelector('.light-core') || document.body;
        document.addEventListener('keydown', downHandler);
        document.addEventListener('keyup', upHandler);
        centerEl.addEventListener('touchstart', downHandler, { passive: false });
        centerEl.addEventListener('touchend', upHandler);

        return [
            () => document.removeEventListener('keydown', downHandler),
            () => document.removeEventListener('keyup', upHandler),
            () => centerEl.removeEventListener('touchstart', downHandler),
            () => centerEl.removeEventListener('touchend', upHandler),
        ];

    }

    /**
     * @private
     */
    createProgressCircle() {
        const svg = manifestElement('svg', {
           attributes: {
               id: 'progress-circle',
               viewBox: '0 0 402 402',
               style: `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; pointer-events: none; z-index: 999;`
           }
        });

        this.progressCircle = manifestElement('circle', {
           attributes: {
               cx: '201', cy: '201', r: '200', fill: 'none', 'stroke-width': '2',
               stroke: '#ffffff', 'stroke-dasharray': `${2 * Math.PI * 200}`, 'stroke-dashoffset': `${2 * Math.PI * 200}`
           }
        });

        svg.appendChild(this.progressCircle);
        const container = document.querySelector('.light-core') || document.body;
        container.appendChild(svg);
        this.guardian.registerCleanup(() => svg.remove());
    }

    /**
     * @private
     */
    animateProgress() {
        if (!this.progressCircle) return;
        if (window.gsap) {
            this.progressAnimation = window.gsap.fromTo(this.progressCircle, { strokeDashoffset: 2 * Math.PI * 200 }, {
                strokeDashoffset: 0,
                duration: 3,
                ease: 'none',
                onUpdate: () => {
                    // Emit progress updates for the guide system
                    if (this.spacebarDownTime) {
                        const elapsed = Date.now() - this.spacebarDownTime;
                        const progress = Math.min(1, elapsed / HOLD_SWEET_SPOT.max);
                        this.eventBridge.emit('recognition:attempt', {
                            method: 'spacebar-hold',
                            progress: progress,
                            duration: elapsed,
                            timestamp: Date.now()
                        });
                    }
                }
            });
        }
    }

    /**
     * @private
     */
    resetProgress() {
        if (this.progressAnimation) {
            this.progressAnimation.kill();
            this.progressAnimation = null;
        }
        if (this.progressCircle) {
            gsap.to(this.progressCircle, { strokeDashoffset: 2 * Math.PI * 200, duration: 0.3 });
        }
    }

    /**
     * @private
     */
    updateCenterPoint() {
        this.centerPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    /**
     * @private
     */
    debounce(fn, ms) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), ms);
        };
    }
    
    /**
     * @private
     */
    cleanupUI() {
        const typingDisplay = document.getElementById('recognition-typing');
        if (typingDisplay) typingDisplay.remove();

        const progressSvg = document.getElementById('progress-circle');
        if (progressSvg) progressSvg.remove();

        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
    }
}
