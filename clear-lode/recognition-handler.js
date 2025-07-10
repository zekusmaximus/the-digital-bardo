/**
 * Handles all paths to recognition - the precise moment of recognition at the universe's center point.
 * Listens for all user inputs (clicks, keys, mouse movement) that constitute "recognition."
 * Dispatches events on success or failure.
 */

// Recognition window configuration per critique requirements
const RECOGNITION_WINDOW = { min: 3000, max: 7000 }; // ms per critique
const CENTER_RADIUS = 50; // px
const HOLD_SWEET_SPOT = { min: 2800, max: 3200 }; // ms
const KEYWORDS = ['RECOGNIZE', 'SELF', 'HOME']; // Case-insensitive

export class RecognitionHandler {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.listeners = []; // Changed to array for easier cleanup
        this.isListening = false;

        // Mouse movement tracking for attachment detection
        this.lastMouseMove = null;
        this.mouseMovements = 0;

        // Shared state for 3-7s window and recognition methods
        this.recognitionWindowActive = false;
        this.windowStartTime = null;
        this.methodsEnabled = true;
        this.recognitionAchieved = false;

        // Center-click method state
        this.centerPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        // Keyword typing method state
        this.typedBuffer = '';
        this.lastKeyTime = 0;

        // Spacebar hold method state
        this.spacebarDownTime = null;
        this.progressCircle = null;
        this.progressAnimation = null;

        // Resize handler for center point updates
        this.handleResize = this.debounce(this.updateCenterPoint.bind(this), 200);
    }
    
    startListening() {
        if (this.isListening) return;

        console.log('Starting recognition listening...');
        this.isListening = true;
        this.recognitionWindowActive = true;
        this.windowStartTime = Date.now();
        this.recognitionAchieved = false;

        // Set up recognition window timing
        this.setupRecognitionWindow();

        // Bind all three recognition methods
        this.bindCenterClick();
        this.bindKeywordTyping();
        this.bindSpacebarHold();

        // Legacy handlers for attachment detection
        const mousemoveHandler = (e) => this.handleMouseMove(e);
        document.addEventListener('mousemove', mousemoveHandler);
        this.listeners.push({ type: 'mousemove', handler: mousemoveHandler });

        const blurHandler = () => this.handleWindowBlur();
        window.addEventListener('blur', blurHandler);
        this.listeners.push({ type: 'blur', handler: blurHandler, element: window });

        // Add resize listener for center point updates
        window.addEventListener('resize', this.handleResize);
        this.listeners.push({ type: 'resize', handler: this.handleResize, element: window });
    }
    
    stopListening() {
        if (!this.isListening) return;

        console.log('Stopping recognition listening...');
        this.isListening = false;
        this.recognitionWindowActive = false;

        // Clean up all event listeners
        this.listeners.forEach(({ type, handler, element }) => {
            const target = element || document;
            target.removeEventListener(type, handler);
        });
        this.listeners = [];

        // Clean up UI elements
        this.cleanupUI();

        // Kill any active animations
        if (this.progressAnimation) {
            this.progressAnimation.kill();
            this.progressAnimation = null;
        }
    }
    
    // === LEGACY HANDLERS (Migrated to new specific methods) ===

    handleRecognitionClick(e) {
        // Warning: This generic click handler has been replaced by bindCenterClick()
        console.warn('Warning: Legacy click handler called; new center-click method should handle this');
        // Legacy fallback for compatibility
        if (this.orchestrator.localState.recognitionAvailable && !this.orchestrator.localState.recognized) {
            this.achieveRecognition('legacy-click');
        } else if (!this.orchestrator.localState.recognitionAvailable) {
            this.recordAttachment('premature_click', {
                target: e.target.tagName,
                timeFromStart: Date.now() - this.orchestrator.localState.startTime
            });
        }
    }

    handleKeydown(e) {
        // Warning: This generic keydown handler conflicts with new typing/spacebar methods
        console.warn('Warning: Legacy keydown handler called; new methods should handle this');
        // Legacy fallback disabled to prevent conflicts with new methods
        // if (this.orchestrator.localState.recognitionAvailable && !this.orchestrator.localState.recognized) {
        //     if (e.code === 'Space' || e.code === 'Enter') {
        //         this.achieveRecognition('keyboard');
        //     }
        // }
    }
    
    handleMouseMove(e) {
        if (this.orchestrator.localState.recognitionAvailable && !this.orchestrator.localState.recognized) {
            // Track excessive mouse movement as attachment
            if (!this.lastMouseMove) {
                this.lastMouseMove = Date.now();
                this.mouseMovements = 0;
            }

            this.mouseMovements++;

            if (Date.now() - this.lastMouseMove > 1000) {
                if (this.mouseMovements > 50) {
                    this.recordAttachment('excessive_movement', {
                        movements: this.mouseMovements
                    });
                }
                this.lastMouseMove = Date.now();
                this.mouseMovements = 0;
            }
        }
    }
    
    handleWindowBlur() {
        if (this.orchestrator.localState.recognitionAvailable && !this.orchestrator.localState.recognized) {
            this.recordAttachment('distraction', {
                type: 'window_blur'
            });
        }
    }
    
    achieveRecognition(method, karmaData = {}) {
        if (this.recognitionAchieved) return;

        this.recognitionAchieved = true;
        this.stopListening();

        const elapsed = Date.now() - this.windowStartTime;
        karmaData.elapsedTime = elapsed;
        karmaData.perfectTimingBonus = (elapsed >= 3000 && elapsed <= 5000) ? 5 : 0;

        console.log(`🌟 Recognition achieved through ${method} at ${elapsed}ms`);
        console.log('Karma data placeholder:', karmaData); // For later calculations

        // Dispatch recognition success event with karma data
        this.dispatchEvent('recognition:success', {
            method: method,
            timestamp: Date.now(),
            karmaData: karmaData
        });
    }
    
    recordAttachment(type, data = {}) {
        console.log(`⚠️ Attachment formed: ${type}`, data);
        
        // Dispatch attachment event
        this.dispatchEvent('recognition:attachment', {
            type: type,
            data: data,
            timestamp: Date.now()
        });
    }
    
    dispatchEvent(type, detail = {}) {
        window.dispatchEvent(new CustomEvent(type, { detail }));
    }
    
    destroy() {
        this.stopListening();
        this.cleanupUI();
        this.orchestrator = null;
        this.lastMouseMove = null;
        this.mouseMovements = 0;
    }

    // === NEW RECOGNITION METHODS ===

    /**
     * Set up the recognition window timing - the shared 3-7 second window
     */
    setupRecognitionWindow() {
        // Enable recognition after minimum window time
        setTimeout(() => {
            this.recognitionWindowActive = true;
        }, RECOGNITION_WINDOW.min);

        // Close recognition window after maximum time
        setTimeout(() => {
            if (!this.recognitionAchieved) {
                this.recognitionWindowActive = false;
                console.log('Recognition window closed - opportunity missed');
            }
        }, RECOGNITION_WINDOW.max);
    }

    /**
     * Check if we're currently in the recognition window
     */
    isInWindow() {
        if (!this.windowStartTime || this.recognitionAchieved) return false;
        const elapsed = Date.now() - this.windowStartTime;
        return elapsed >= RECOGNITION_WINDOW.min && elapsed <= RECOGNITION_WINDOW.max;
    }

    /**
     * The precise moment of recognition at the universe's center point
     * Buddhist concept: Finding the center of existence
     */
    bindCenterClick() {
        const handler = (e) => {
            if (!this.isInWindow() || this.recognitionAchieved) return;

            const point = e.type.includes('touch') ?
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
            }
        };

        document.addEventListener('click', handler);
        document.addEventListener('touchstart', handler);
        this.listeners.push(
            { type: 'click', handler },
            { type: 'touchstart', handler }
        );
    }

    /**
     * Create visual ripple effect for near-miss clicks
     */
    createRipple(point) {
        requestAnimationFrame(() => {
            const ripple = document.createElement('span');
            ripple.className = 'recognition-ripple';
            ripple.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255,255,255,0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                transform: translate(-50%, -50%);
                animation: ripple-expand 0.6s ease-out forwards;
            `;
            document.body.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    }

    /**
     * Speaking the true name into the void - keyword typing recognition
     * Buddhist concept: Mantras and sacred words
     */
    bindKeywordTyping() {
        // Create typing display element
        const display = document.createElement('div');
        display.id = 'recognition-typing';
        display.setAttribute('aria-live', 'polite');
        display.style.cssText = `
            position: fixed;
            top: 60%;
            left: 50%;
            transform: translateX(-50%);
            font-family: monospace;
            font-size: 18px;
            color: rgba(0,0,0,0.7);
            background: rgba(255,255,255,0.1);
            padding: 8px 16px;
            border-radius: 4px;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(display);

        const handler = (e) => {
            if (!this.isInWindow() || this.recognitionAchieved || !e.key.match(/^[a-zA-Z]$/)) return;

            const now = Date.now();
            if (now - this.lastKeyTime > 2000) this.typedBuffer = '';

            this.typedBuffer += e.key.toUpperCase();
            this.lastKeyTime = now;

            // Update display
            display.textContent = this.typedBuffer;
            display.style.opacity = '1';

            // Auto-fade after 2 seconds
            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
                display.style.opacity = '0';
                setTimeout(() => {
                    this.typedBuffer = '';
                    display.textContent = '';
                }, 300);
            }, 2000);

            // Check for keyword match
            if (KEYWORDS.includes(this.typedBuffer)) {
                this.achieveRecognition(`typed-${this.typedBuffer.toLowerCase()}`, {
                    word: this.typedBuffer
                });
            } else if (!KEYWORDS.some(k => k.startsWith(this.typedBuffer))) {
                // Invalid sequence - reset with error feedback
                this.typedBuffer = '';
                display.classList.add('error-flash');
                setTimeout(() => display.classList.remove('error-flash'), 200);
            }
        };

        document.addEventListener('keydown', handler);
        this.listeners.push({ type: 'keydown', handler });
    }

    /**
     * The breath held at the moment of dissolution - spacebar hold recognition
     * Buddhist concept: Breath control and mindful timing
     */
    bindSpacebarHold() {
        this.createProgressCircle();

        const downHandler = (e) => {
            if ((e.code === 'Space' || e.type === 'touchstart') &&
                !this.spacebarDownTime &&
                this.isInWindow() &&
                !this.recognitionAchieved) {

                e.preventDefault();
                this.spacebarDownTime = Date.now();
                this.animateProgress();
            }
        };

        const upHandler = (e) => {
            if ((e.code === 'Space' || e.type === 'touchend') && this.spacebarDownTime) {
                const duration = Date.now() - this.spacebarDownTime;

                if (duration >= HOLD_SWEET_SPOT.min && duration <= HOLD_SWEET_SPOT.max) {
                    this.achieveRecognition('perfect-hold', {
                        duration,
                        precision: Math.abs(3000 - duration)
                    });
                } else {
                    this.resetProgress();
                }
                this.spacebarDownTime = null;
            }
        };

        document.addEventListener('keydown', downHandler);
        document.addEventListener('keyup', upHandler);

        // Mobile support - touch on light core
        const centerEl = document.querySelector('.light-core') || document.body;
        centerEl.addEventListener('touchstart', downHandler);
        centerEl.addEventListener('touchend', upHandler);

        this.listeners.push(
            { type: 'keydown', handler: downHandler },
            { type: 'keyup', handler: upHandler },
            { type: 'touchstart', handler: downHandler, element: centerEl },
            { type: 'touchend', handler: upHandler, element: centerEl }
        );
    }

    /**
     * Create SVG progress circle around the light core
     */
    createProgressCircle() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'progress-circle';
        svg.setAttribute('viewBox', '0 0 402 402');
        svg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            pointer-events: none;
            z-index: 999;
        `;

        this.progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.progressCircle.setAttribute('cx', '201');
        this.progressCircle.setAttribute('cy', '201');
        this.progressCircle.setAttribute('r', '200');
        this.progressCircle.setAttribute('fill', 'none');
        this.progressCircle.setAttribute('stroke-width', '2');
        this.progressCircle.setAttribute('stroke', '#ffffff');
        this.progressCircle.setAttribute('stroke-dasharray', `${2 * Math.PI * 200}`);
        this.progressCircle.setAttribute('stroke-dashoffset', `${2 * Math.PI * 200}`);

        svg.appendChild(this.progressCircle);
        (document.querySelector('.light-core') || document.body).appendChild(svg);
    }

    /**
     * Animate the progress circle during spacebar hold
     */
    animateProgress() {
        if (!this.progressCircle) return;

        const circ = 2 * Math.PI * 200;

        // Use GSAP if available, fallback to CSS animation
        if (window.gsap) {
            this.progressAnimation = window.gsap.fromTo(this.progressCircle,
                { strokeDashoffset: circ },
                {
                    strokeDashoffset: 0,
                    duration: 3,
                    ease: 'none',
                    onUpdate: () => {
                        const progress = (circ - this.progressCircle.getAttribute('stroke-dashoffset')) / circ * 3000;
                        let color = '#ffffff';
                        if (progress >= HOLD_SWEET_SPOT.min && progress <= HOLD_SWEET_SPOT.max) {
                            color = 'var(--bardo-gold, #ffd700)';
                        } else if (progress > HOLD_SWEET_SPOT.max) {
                            color = 'var(--bardo-red, #ff0000)';
                        }
                        this.progressCircle.setAttribute('stroke', color);
                    }
                }
            );
        } else {
            // Fallback CSS animation
            this.progressCircle.style.animation = 'progress-fill 3s linear forwards';
        }
    }

    /**
     * Reset progress circle animation
     */
    resetProgress() {
        if (this.progressAnimation) {
            this.progressAnimation.kill();
            this.progressAnimation = null;
        }
        if (this.progressCircle) {
            this.progressCircle.setAttribute('stroke-dashoffset', 2 * Math.PI * 200);
            this.progressCircle.setAttribute('stroke', '#ffffff');
            this.progressCircle.style.animation = '';
        }
    }

    /**
     * Update center point on window resize
     */
    updateCenterPoint() {
        this.centerPoint = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
    }

    /**
     * Debounce utility function
     */
    debounce(fn, ms) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    /**
     * Clean up UI elements created by recognition methods
     */
    cleanupUI() {
        // Remove typing display
        const typingDisplay = document.getElementById('recognition-typing');
        if (typingDisplay) typingDisplay.remove();

        // Remove progress circle
        const progressSvg = document.getElementById('progress-circle');
        if (progressSvg) progressSvg.remove();

        // Clear typing timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
    }
}
