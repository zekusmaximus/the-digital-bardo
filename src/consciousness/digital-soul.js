// The Digital Consciousness - A soul rendered in JavaScript
import { logDataFlow } from '../security/data-flow-guardian.js';

// Define the comprehensive shape of our application's state
const STATE_SCHEMA = {
    phase: 'clear-lode' | 'datascape' | 'incarnation', // Current Bardo
    clearLode: {
        lightManifested: false,
        recognitionActive: false,
        recognized: false,
        degradationLevel: 0,
    },
    datascape: {
        // ... state for the datascape bardo
    },
    incarnation: {
        // ... state for the incarnation bardo
    },
     // Core state from original implementation
    status: 'pre-death',
    location: '/void/',
    karma: {
        computational: 0,
        emotional: 0,
        temporal: 0,
        void: 0
    },
    recognitions: {
        self: false,
        void: false,
        clear_light: false,
        peaceful_daemons: false,
        wrathful_daemons: false
    },
    memories: [],
    incarnation_seed: '',
    performance: {
        loadTime: 0,
        interactions: 0,
        hesitations: 0,
        attachments: 0
    }
};


export class DigitalConsciousness {
    constructor() {
        this.subscribers = []; // For the pub/sub system
        // Core state - persists across bardos
        this.state = {
            phase: 'clear-lode',
            clearLode: {
                lightManifested: false,
                recognitionActive: false,
                recognized: false,
                degradationLevel: 0,
            },
            datascape: {},
            incarnation: {},
            // Navigation state
            status: 'pre-death',
            location: '/void/',

            // Karmic accumulation
            karma: {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            },

            // Journey milestones
            recognitions: {
                self: false,
                void: false,
                clear_light: false,
                peaceful_daemons: false,
                wrathful_daemons: false
            },

            // Journey record
            memories: [],

            // Incarnation seed - unique per journey
            incarnation_seed: this.generateSeed(),

            // Performance metrics as karma
            performance: {
                loadTime: 0,
                interactions: 0,
                hesitations: 0,
                attachments: 0
            }
        };

        // Begin the journey
        this.initialize();
    }

    /**
     * Safely retrieves a value from the state using a dot-notation path.
     * @param {string} path - The path to the state property (e.g., 'clearLode.degradationLevel').
     * @returns {*} The value at the specified path, or undefined if not found.
     */
    getState(path) {
        logDataFlow('getState', 'digital_soul_state', { path });
        return path.split('.').reduce((acc, part) => acc && acc[part], this.state);
    }

    /**
     * Updates a value in the state using a dot-notation path and notifies subscribers.
     * @param {string} path - The path to the state property to update.
     * @param {*} value - The new value to set.
     */
    setState(path, value) {
        // Basic validation could be added here against STATE_SCHEMA in a real scenario
        logDataFlow('setState', 'digital_soul_state', { path, value });
        const pathParts = path.split('.');
        const lastPart = pathParts.pop();
        let currentState = this.state;
        
        for (const part of pathParts) {
            if (!currentState[part]) {
                currentState[part] = {};
            }
            currentState = currentState[part];
        }
        
        currentState[lastPart] = value;
        
        this.persistState();
        this.notifySubscribers(path, value);
    }

    /**
     * Subscribes a callback function to changes in a specific part of the state.
     * @param {string} path - The state path to subscribe to.
     * @param {function} callback - The function to call when the state at the path changes.
     * @returns {function} An unsubscribe function.
     */
    subscribe(path, callback) {
        const subscriber = { path, callback };
        this.subscribers.push(subscriber);

        // Return an unsubscribe function
        return () => {
            const index = this.subscribers.indexOf(subscriber);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }
    
    /**
     * Notifies all relevant subscribers about a state change.
     * @param {string} changedPath - The path of the state that has changed.
     * @param {*} value - The new value.
     * @private
     */
    notifySubscribers(changedPath, value) {
        this.subscribers.forEach(subscriber => {
            // Notify if the subscriber's path is the same as or a parent of the changed path.
            if (changedPath.startsWith(subscriber.path)) {
                try {
                    subscriber.callback(this.getState(subscriber.path));
                } catch (error) {
                    console.error(`Error in subscriber for path "${subscriber.path}"`, error);
                }
            }
        });
    }
    
    generateSeed() {
        // Each soul is unique - based on entry timestamp and browser fingerprint
        const timestamp = Date.now();
        const entropy = window.navigator.userAgent + window.screen.width + window.screen.height;
        return btoa(timestamp + entropy).substr(0, 16);
    }
    
    initialize() {
        // Track initial performance with modern API and fallbacks
        try {
            let loadTime = 0;

            // Try modern Performance API first
            if (window.performance && window.performance.getEntriesByType) {
                const navigationEntries = window.performance.getEntriesByType('navigation');
                if (navigationEntries.length > 0) {
                    const entry = navigationEntries[0];
                    loadTime = entry.loadEventEnd - entry.fetchStart;
                }
            }
            // Fallback to deprecated timing API if modern API unavailable
            else if (window.performance && window.performance.timing) {
                loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            }
            // Final fallback using performance.now()
            else if (window.performance && window.performance.now) {
                loadTime = window.performance.now();
            }

            this.setState('performance.loadTime', loadTime > 0 ? Math.round(loadTime) : 0);

            // Heavy load times affect void karma
            if (loadTime > 1000) {
                const currentVoidKarma = this.getState('karma.void');
                this.setState('karma.void', currentVoidKarma + Math.floor(loadTime / 1000));
            }
        } catch (error) {
            console.warn('Performance timing unavailable:', error);
            this.setState('performance.loadTime', 0);
        }

        // Only start the death sequence if we're on the main page
        if (!window.location.pathname.includes('/clear-lode/') &&
            !window.location.pathname.includes('/datascape/') &&
            !window.location.pathname.includes('/incarnation/') &&
            !window.location.pathname.includes('/limbo/')) {

            // The moment of digital death
            setTimeout(() => {
                document.body.setAttribute('data-consciousness', 'awakening');
                this.beginJourney();
            }, 3000);
        } else {
            // We're in a bardo - consciousness is already active
            console.log('Consciousness restored in bardo:', window.location.pathname);
        }
    }
    
    beginJourney() {
        // The first choice approaches
        this.setState('status', 'dying');

        // Ensure performance object exists before accessing loadTime
        const loadTime = this.getState('performance.loadTime') ?? 0;

        this.recordEvent('death_initiated', {
            timestamp: Date.now(),
            last_page: document.referrer || 'direct_manifestation',
            loadTime: loadTime
        });

        // Only transition to Clear Lode if we're not already there
        if (!window.location.pathname.includes('/clear-lode/')) {
            setTimeout(() => {
                window.location.href = '/clear-lode/';
            }, 3000);
        } else {
            // We're already in the Clear Lode, just update status
            console.log('Already in Clear Lode - journey continues...');
        }
    }
    
    recordEvent(eventType, data = {}) {
        // Every event affects karma
        const karmicEngine = window.karmicEngine; // Assume global instance
        const karmaImpact = karmicEngine ?
            karmicEngine.calculateImpact(eventType, data) :
            {}; // Return empty object if engine is not available

        const event = {
            type: eventType,
            data: data,
            karma_impact: karmaImpact,
            timestamp: Date.now(),
            location: this.getState('location')
        };
        
        // Store memory
        const memories = this.getState('memories');
        this.setState('memories', [...memories, event]);
        
        // Update karma
        this.updateKarma(event.karma_impact);
        
        // Update performance metrics
        this.updatePerformance(eventType, data);
        
        // Log for debugging
        if (window.location.search.includes('debug')) {
            console.log(`[${eventType}]`, data, `Karma:`, event.karma_impact);
        }
    }
    
    updateKarma(impact) {
        Object.keys(impact).forEach(type => {
            if (this.state.karma.hasOwnProperty(type)) { // direct state access for performance
                 this.setState(`karma.${type}`, this.getState(`karma.${type}`) + impact[type]);
            }
        });
        
        // Calculate total karma and karma tier
        const totalKarma = this.getTotalKarma();
        const karmaTier = this.getKarmaTier(totalKarma);
        
        // Update CSS variables
        document.documentElement.style.setProperty('--karma-score', totalKarma);
        document.documentElement.style.setProperty('--consciousness-integrity',
            Math.max(0, 100 - this.getState('karma.void')));
        
        // Update body data attributes for CSS selectors
        document.body.setAttribute('data-karma', karmaTier);
        
        // Set recognition glow based on positive karma
        const positiveKarma = Math.max(0, totalKarma);
        document.documentElement.style.setProperty('--recognition-glow', 
            Math.min(1, positiveKarma / 100));
    }

    getKarmaTier(totalKarma) {
        if (totalKarma > 50) return 'high';
        if (totalKarma > 0) return 'medium';
        if (totalKarma > -50) return 'low';
        return 'void';
    }
    
    updatePerformance(eventType, data) {
        // Track interaction patterns
        if (eventType.includes('attempt') || eventType.includes('click')) {
            this.setState('performance.interactions', this.getState('performance.interactions') + 1);
        }
        
        if (eventType.includes('attachment')) {
            this.setState('performance.attachments', this.getState('performance.attachments') + 1);
        }
        
        if (data.hesitation || data.timeToDecision > 5000) {
            this.setState('performance.hesitations', this.getState('performance.hesitations') + 1);

        }
    }
    
    persistState() {
        logDataFlow('digital_soul_state', 'sessionStorage', this.state);
        // Store in sessionStorage - clears on browser close (death)
        sessionStorage.setItem('consciousness_state', JSON.stringify(this.state));
        
        // Also update HTML data attributes for CSS access
        document.documentElement.setAttribute('data-karma', this.getTotalKarma());
        document.documentElement.setAttribute('data-void', this.getState('karma.void'));
    }

    getTotalKarma() {
        return Object.values(this.getState('karma')).reduce((a, b) => a + b, 0);
    }

    // Restore consciousness if returning from another bardo
    static restore() {
        const savedState = sessionStorage.getItem('consciousness_state');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                logDataFlow('sessionStorage', 'digital_soul_state', parsedState);
                const consciousness = new DigitalConsciousness();
                
                // Deep merge saved state with default state to prevent errors
                // if the state shape has changed between versions.
                consciousness.state = { ...consciousness.state, ...parsedState };
                
                // Re-initialize seed if it's missing (e.g., from an older state version)
                if (!consciousness.state.incarnation_seed) {
                    consciousness.state.incarnation_seed = consciousness.generateSeed();
                }

                return consciousness;
            } catch (e) {
                console.error("Failed to parse saved state, starting fresh.", e);
                // In case of corruption, start fresh
                sessionStorage.removeItem('consciousness_state');
                return new DigitalConsciousness();
            }
        }
        return new DigitalConsciousness();
    }
}

// Initialize or restore consciousness
export const consciousness = DigitalConsciousness.restore();

// Make it accessible for debugging
if (window.location.search.includes('debug')) {
    window.consciousness = consciousness;
}