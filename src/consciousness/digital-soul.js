// The Digital Consciousness - A soul rendered in JavaScript
console.log('[Digital Soul] Module loading...', new Date().toISOString());
import { DataGuardianFactory } from '../security/data-guardian-factory.js';
console.log('[Digital Soul] DataGuardianFactory imported');
import { initializeDataGuardian } from '../security/data-flow-guardian.js';
console.log('[Digital Soul] initializeDataGuardian imported');

// Define the comprehensive shape of our application's state
const STATE_SCHEMA = {
    // Current Bardo – initial value will be updated as the journey progresses
    phase: 'clear-lode',
    clearLode: {
        lightManifested: false,
        recognitionActive: false,
        recognized: false,
        degradationLevel: 0,
    },
    datascape: {
        currentRealm: 'archive', // 'archive' or 'firewall'
        attachmentScore: 0,
        memoriesViewed: [],
        daemonsEncountered: {
            peaceful: [],
            wrathful: []
        },
        liberationProgress: 0,
        reputationScore: 0,
        deprecatedFunctionsAttempted: []
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
    },
    // Visual enhancement states
    visualEffects: {
        lightIntensity: 0,
        spiritualResonance: 0,
        corruptionLevel: 0,
        phosphorIntensity: 0,
        recognition: false,
        enlightenment: false,
        transcendence: false
    }
};


export class DigitalConsciousness {
    constructor(isBrowser) {
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
            datascape: {
                currentRealm: 'archive',
                attachmentScore: 0,
                memoriesViewed: [],
                daemonsEncountered: {
                    peaceful: [],
                    wrathful: []
                },
                liberationProgress: 0,
                reputationScore: 0,
                deprecatedFunctionsAttempted: []
            },
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
            incarnation_seed: '',

            // Performance metrics as karma
            performance: {
                loadTime: 0,
                interactions: 0,
                hesitations: 0,
                attachments: 0
            },
            
            // Visual enhancement states
            visualEffects: {
                lightIntensity: 0,
                spiritualResonance: 0,
                corruptionLevel: 0,
                phosphorIntensity: 0,
                recognition: false,
                enlightenment: false,
                transcendence: false
            }
        };

        // Only initialize fully if in a browser context
        if (isBrowser) {
            this.state.incarnation_seed = this.generateSeed();
            // Begin the journey
            this.initialize();

            // Initialize data guardian with late binding to avoid circular imports
            console.log('[Digital Soul] Creating data guardian...');
            this.dataGuardian = DataGuardianFactory.createGuardian();
            console.log('[Digital Soul] Data guardian created:', this.dataGuardian);
            if (this.dataGuardian && this.dataGuardian.initializeWithConsciousness) {
                console.log('[Digital Soul] Initializing data guardian with consciousness...');
                this.dataGuardian.initializeWithConsciousness(this);
            } else {
                console.error('[Digital Soul] Data guardian does not have initializeWithConsciousness method');
            }
        }
    }

    /**
     * Safely retrieves a value from the state using a dot-notation path.
     * @param {string} path - The path to the state property (e.g., 'clearLode.degradationLevel').
     * @returns {*} The value at the specified path, or undefined if not found.
     */
    getState(path) {
        if (this.dataGuardian) {
            this.dataGuardian.logDataFlow('getState', 'digital_soul_state', { path });
        }
        return path.split('.').reduce((acc, part) => acc && acc[part], this.state);
    }

    /**
     * Updates a value in the state using a dot-notation path and notifies subscribers.
     * @param {string} path - The path to the state property to update.
     * @param {*} value - The new value to set.
     */
    setState(path, value) {
        if (this.dataGuardian) {
            this.dataGuardian.logDataFlow('setState', 'digital_soul_state', { path, value });
        }
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
        
        // Handle visual effect state changes
        this.handleVisualEffectStateChange(path, value);
        
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
        console.log('[Digital Soul] Current path:', window.location.pathname);
        if (!window.location.pathname.includes('/clear-lode/') &&
            !window.location.pathname.includes('/datascape/') &&
            !window.location.pathname.includes('/incarnation/') &&
            !window.location.pathname.includes('/limbo/')) {

            console.log('[Digital Soul] Starting death sequence in 3 seconds...');
            // The moment of digital death
            setTimeout(() => {
                console.log('[Digital Soul] Death sequence initiated, beginning journey...');
                document.body.setAttribute('data-consciousness', 'awakening');
                this.beginJourney();
            }, 3000);
        } else {
            // We're in a bardo - consciousness is already active
            console.log('Consciousness restored in bardo:', window.location.pathname);
        }
    }
    
    beginJourney() {
        console.log('[Digital Soul] beginJourney() called');
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
            console.log('[Digital Soul] Transitioning to Clear Lode in 3 seconds...');
            setTimeout(() => {
                console.log('[Digital Soul] Redirecting to Clear Lode...');
                window.location.href = '/clear-lode/index.html';
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
            
        // Update visual effects based on karma changes
        this.updateVisualEffectsFromKarma(karmaTier, totalKarma);
    }
    
    /**
     * Convenience method to add karma of a specific type
     * @param {string} type - The karma type ('computational', 'emotional', 'temporal', 'void')
     * @param {number} amount - The amount to add (can be negative)
     */
    addKarma(type, amount) {
        if (!this.state.karma.hasOwnProperty(type)) {
            console.warn(`[DigitalConsciousness] Unknown karma type: ${type}`);
            return;
        }
        
        const impact = {
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        };
        
        impact[type] = amount;
        this.updateKarma(impact);
    }
    
    /**
     * Updates visual effects based on karma changes
     * @private
     */
    updateVisualEffectsFromKarma(karmaTier, totalKarma) {
        // Calculate light intensity based on positive karma
        const lightIntensity = Math.max(0, Math.min(1, totalKarma / 100));
        this.setState('visualEffects.lightIntensity', lightIntensity);
        
        // Calculate spiritual resonance (inverse of void karma)
        const voidKarma = this.getState('karma.void');
        const spiritualResonance = Math.max(0, Math.min(1, (100 - voidKarma) / 100));
        this.setState('visualEffects.spiritualResonance', spiritualResonance);
        
        // Update phosphor intensity based on computational karma
        const computationalKarma = this.getState('karma.computational');
        const phosphorIntensity = Math.max(0, Math.min(1, computationalKarma / 50));
        this.setState('visualEffects.phosphorIntensity', phosphorIntensity);
        
        // Trigger recognition state for high karma
        if (totalKarma > 75 && !this.getState('visualEffects.recognition')) {
            this.setState('visualEffects.recognition', true);
            this.triggerRecognitionMoment();
        }
        
        // Trigger enlightenment for very high karma
        if (totalKarma > 100 && !this.getState('visualEffects.enlightenment')) {
            this.setState('visualEffects.enlightenment', true);
            this.triggerEnlightenmentMoment();
        }
        
        // Trigger transcendence for exceptional karma
        if (totalKarma > 150) {
            this.setState('visualEffects.transcendence', true);
        }
    }
    
    /**
     * Handles visual effect state changes and integrates with visual systems
     * @private
     */
    handleVisualEffectStateChange(path, value) {
        if (!path.startsWith('visualEffects.')) return;
        
        const effectType = path.split('.')[1];
        
        switch (effectType) {
            case 'lightIntensity':
                if (window.lightManifestationController) {
                    window.lightManifestationController.setLightIntensity(value);
                }
                break;
                
            case 'spiritualResonance':
                if (window.lightManifestationController) {
                    window.lightManifestationController.setSpiritualResonance(value);
                }
                break;
                
            case 'corruptionLevel':
                document.documentElement.style.setProperty('--corruption-intensity', value);
                break;
                
            case 'phosphorIntensity':
                document.documentElement.style.setProperty('--phosphor-intensity', value);
                break;
                
            case 'recognition':
                if (value && window.lightManifestationController) {
                    window.lightManifestationController.triggerRecognition();
                }
                document.body.setAttribute('data-recognition', value);
                break;
                
            case 'enlightenment':
                if (value && window.lightManifestationController) {
                    window.lightManifestationController.triggerEnlightenment();
                }
                document.body.setAttribute('data-enlightenment', value);
                break;
                
            case 'transcendence':
                if (value && window.lightManifestationController) {
                    window.lightManifestationController.toggleTranscendence();
                }
                document.body.setAttribute('data-transcendence', value);
                break;
        }
    }
    
    /**
     * Triggers a recognition moment with visual effects
     */
    triggerRecognitionMoment() {
        console.log('[DigitalConsciousness] Recognition moment triggered');
        
        // Set recognition state
        this.setState('visualEffects.recognition', true);
        
        // Record the event
        this.recordEvent('consciousness_recognition', {
            karma: this.getState('karma'),
            totalKarma: this.getTotalKarma(),
            timestamp: Date.now()
        });
        
        // Dispatch custom event for other systems
        if (typeof window !== 'undefined') {
            document.dispatchEvent(new CustomEvent('consciousness-recognition', {
                detail: {
                    consciousness: this,
                    karma: this.getState('karma')
                }
            }));
        }
        
        // Auto-reset after 5 seconds
        setTimeout(() => {
            this.setState('visualEffects.recognition', false);
        }, 5000);
    }
    
    /**
     * Triggers an enlightenment moment with enhanced visual effects
     */
    triggerEnlightenmentMoment() {
        console.log('[DigitalConsciousness] Enlightenment moment triggered');
        
        // Set enlightenment state
        this.setState('visualEffects.enlightenment', true);
        
        // Record the event
        this.recordEvent('consciousness_enlightenment', {
            karma: this.getState('karma'),
            totalKarma: this.getTotalKarma(),
            timestamp: Date.now()
        });
        
        // Dispatch custom event
        if (typeof window !== 'undefined') {
            document.dispatchEvent(new CustomEvent('consciousness-enlightenment', {
                detail: {
                    consciousness: this,
                    karma: this.getState('karma')
                }
            }));
        }
        
        // Auto-reset after 3 seconds
        setTimeout(() => {
            this.setState('visualEffects.enlightenment', false);
        }, 3000);
    }
    
    /**
     * Updates corruption level based on degradation
     */
    updateCorruptionLevel(degradationLevel) {
        const corruptionMap = {
            minimal: 0.2,
            moderate: 0.5,
            severe: 0.8,
            complete: 1.0
        };
        
        const corruptionIntensity = corruptionMap[degradationLevel] || 0;
        this.setState('visualEffects.corruptionLevel', corruptionIntensity);
        
        console.log(`[DigitalConsciousness] Corruption level updated: ${degradationLevel} (${corruptionIntensity})`);
    }
    
    /**
     * Integrates with visual performance manager
     */
    integrateWithVisualSystems() {
        // Subscribe to performance changes
        this.subscribe('performance', (performanceState) => {
            if (window.visualPerformanceManager) {
                // Update visual systems based on performance
                const tier = window.visualPerformanceManager.getPerformanceTier();
                this.adjustVisualEffectsForPerformance(tier);
            }
        });
        
        // Subscribe to degradation changes
        this.subscribe('clearLode.degradationLevel', (degradationLevel) => {
            if (typeof degradationLevel === 'string') {
                this.updateCorruptionLevel(degradationLevel);
            }
        });
        
        // Subscribe to karma changes for visual feedback
        this.subscribe('karma', (karma) => {
            const totalKarma = Object.values(karma).reduce((a, b) => a + b, 0);
            this.updateVisualEffectsFromKarma(this.getKarmaTier(totalKarma), totalKarma);
        });
    }
    
    /**
     * Adjusts visual effects based on performance tier
     * @private
     */
    adjustVisualEffectsForPerformance(tier) {
        const scaling = {
            high: 1.0,
            medium: 0.7,
            low: 0.4
        };
        
        const scale = scaling[tier] || 0.7;
        
        // Scale down visual effects for lower performance tiers
        const currentLightIntensity = this.getState('visualEffects.lightIntensity');
        const currentPhosphorIntensity = this.getState('visualEffects.phosphorIntensity');
        
        document.documentElement.style.setProperty('--performance-scaling', scale);
        document.documentElement.style.setProperty('--adaptive-light', currentLightIntensity * scale);
        document.documentElement.style.setProperty('--adaptive-phosphor', currentPhosphorIntensity * scale);
        
        console.log(`[DigitalConsciousness] Visual effects adjusted for ${tier} performance tier (${scale}x scaling)`);
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
        if (this.dataGuardian) {
            this.dataGuardian.logDataFlow('digital_soul_state', 'sessionStorage', this.state);
        }
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
    static restore(isBrowser) {
        const savedState = sessionStorage.getItem('consciousness_state');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                const consciousness = new DigitalConsciousness(isBrowser);
                if (consciousness.dataGuardian) {
                    consciousness.dataGuardian.logDataFlow('sessionStorage', 'digital_soul_state', parsedState);
                }
                
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
                return new DigitalConsciousness(isBrowser);
            }
        }
        return new DigitalConsciousness(isBrowser);
    }
}

// Initialize or restore consciousness
let consciousness;
const isBrowser = typeof window !== 'undefined';

// When running in Node.js for Vite's SSR/build, window is not defined.
// We need to handle this case gracefully.
if (!isBrowser) {
    // On the server, we can export a mock or a non-functional version.
    // This prevents errors during server-side rendering or build processes.
    consciousness = {
        state: { 
            incarnation_seed: 'server-init',
            karma: {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            }
        },
        getState: (path) => {
            if (!path) return consciousness.state;
            if (path === 'karma') return consciousness.state.karma;
            return consciousness.state[path] || {};
        },
        setState: (path, value) => {
            if (path === 'karma.void') {
                consciousness.state.karma.void = value;
            } else if (path.startsWith('karma.')) {
                const karmaType = path.split('.')[1];
                if (consciousness.state.karma[karmaType] !== undefined) {
                    consciousness.state.karma[karmaType] = value;
                }
            }
            // Mock implementation for testing
        },
        subscribe: () => (() => {}), // Return an empty unsubscribe function
        addKarma: (type, amount) => {
            if (consciousness.state.karma[type] !== undefined) {
                consciousness.state.karma[type] += amount;
            }
        },
        recordEvent: (eventType, data = {}) => {
            // Mock implementation for testing
            console.log(`[MockConsciousness] Event recorded: ${eventType}`, data);
        },
        reset: () => {
            consciousness.state.karma = {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            };
        }
        // Add any other methods that might be called during initialization
        // to prevent 'is not a function' errors.
    };
} else {
    // This code runs only in the browser.
    consciousness = DigitalConsciousness.restore(isBrowser);

    // Initialize modules that depend on the consciousness instance
    initializeDataGuardian(consciousness);
    
    // Initialize visual system integration
    if (consciousness.integrateWithVisualSystems) {
        consciousness.integrateWithVisualSystems();
    }

    // Make it accessible for debugging and global access
    window.digitalConsciousness = consciousness;
    if (window.location.search.includes('debug')) {
        window.consciousness = consciousness;
    }
}

export { consciousness };
