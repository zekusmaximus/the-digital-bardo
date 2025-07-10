/**
 * Handles all paths to recognition - the precise moment of recognition at the universe's center point.
 * Listens for all user inputs (clicks, keys, mouse movement) that constitute "recognition."
 * Dispatches events on success or failure.
 */
export class RecognitionHandler {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.listeners = new Map(); // Track event listeners for cleanup
        this.isListening = false;
        
        // Mouse movement tracking for attachment detection
        this.lastMouseMove = null;
        this.mouseMovements = 0;
    }
    
    startListening() {
        if (this.isListening) return;
        
        console.log('Starting recognition listening...');
        this.isListening = true;
        
        // Recognition click handler (migrated from clear-lode.js)
        const clickHandler = (e) => this.handleRecognitionClick(e);
        document.addEventListener('click', clickHandler);
        this.listeners.set('click', clickHandler);
        
        // Keyboard recognition (migrated from clear-lode.js)
        const keydownHandler = (e) => this.handleKeydown(e);
        document.addEventListener('keydown', keydownHandler);
        this.listeners.set('keydown', keydownHandler);
        
        // Mouse movement tracking for attachment detection (migrated from clear-lode.js)
        const mousemoveHandler = (e) => this.handleMouseMove(e);
        document.addEventListener('mousemove', mousemoveHandler);
        this.listeners.set('mousemove', mousemoveHandler);
        
        // Window focus/blur for attachment tracking (migrated from clear-lode.js)
        const blurHandler = () => this.handleWindowBlur();
        window.addEventListener('blur', blurHandler);
        this.listeners.set('blur', blurHandler);
    }
    
    stopListening() {
        if (!this.isListening) return;
        
        console.log('Stopping recognition listening...');
        this.isListening = false;
        
        this.listeners.forEach((handler, type) => {
            if (type === 'blur') {
                window.removeEventListener(type, handler);
            } else {
                document.removeEventListener(type, handler);
            }
        });
        this.listeners.clear();
    }
    
    handleRecognitionClick(e) {
        if (this.orchestrator.localState.recognitionAvailable && !this.orchestrator.localState.recognized) {
            this.achieveRecognition('click');
        } else if (!this.orchestrator.localState.recognitionAvailable) {
            this.recordAttachment('premature_click', {
                target: e.target.tagName,
                timeFromStart: Date.now() - this.orchestrator.localState.startTime
            });
        }
    }
    
    handleKeydown(e) {
        if (this.orchestrator.localState.recognitionAvailable && !this.orchestrator.localState.recognized) {
            if (e.code === 'Space' || e.code === 'Enter') {
                this.achieveRecognition('keyboard');
            }
        }
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
    
    achieveRecognition(method) {
        if (this.orchestrator.localState.recognized) return;
        
        const recognitionTime = Date.now() - this.orchestrator.localState.startTime;
        
        console.log(`🌟 Recognition achieved through ${method} at ${recognitionTime}ms`);
        
        // Stop listening immediately to prevent duplicate recognition
        this.stopListening();
        
        // Dispatch recognition success event
        this.dispatchEvent('recognition:success', {
            method: method,
            recognitionTime: recognitionTime,
            timestamp: Date.now()
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
        this.orchestrator = null;
        this.lastMouseMove = null;
        this.mouseMovements = 0;
    }
}
