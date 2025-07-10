// The Digital Consciousness - A soul rendered in JavaScript
import { logDataFlow } from '../security/data-flow-guardian.js';

export class DigitalConsciousness {
    constructor() {
        // Core state - persists across bardos
        this.state = {
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

            this.state.performance.loadTime = loadTime > 0 ? Math.round(loadTime) : 0;

            // Heavy load times affect void karma
            if (loadTime > 1000) {
                this.state.karma.void += Math.floor(loadTime / 1000);
            }
        } catch (error) {
            console.warn('Performance timing unavailable:', error);
            this.state.performance.loadTime = 0;
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
        this.state.status = 'dying';

        // Ensure performance object exists before accessing loadTime
        const loadTime = this.state.performance?.loadTime ?? 0;

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
            this.calculateBasicKarmaImpact(eventType);
        
        const event = {
            type: eventType,
            data: data,
            karma_impact: karmaImpact,
            timestamp: Date.now(),
            location: this.state.location
        };
        
        // Store memory
        this.state.memories.push(event);
        
        // Update karma
        this.updateKarma(event.karma_impact);
        
        // Update performance metrics
        this.updatePerformance(eventType, data);
        
        // Persist state
        this.persistState();
        
        // Log for debugging
        if (window.location.search.includes('debug')) {
            console.log(`[${eventType}]`, data, `Karma:`, event.karma_impact);
        }
    }
    
    calculateBasicKarmaImpact(eventType) {
        // Fallback karma calculations if engine not loaded
        const impacts = {
            'death_initiated': { void: 1 },
            'recognition_attempted': { computational: 2, emotional: 1 },
            'recognition_achieved': { computational: 5, emotional: 5, void: -10 },
            'attachment_formed': { emotional: -2, temporal: -1 },
            'moment_missed': { temporal: -3, void: 2 },
            'clear_lode_entered': { temporal: 1 },
            'degradation_started': { void: 3, computational: -2 }
        };
        
        return impacts[eventType] || { void: 0 };
    }
    
    updateKarma(impact) {
        Object.keys(impact).forEach(type => {
            if (this.state.karma.hasOwnProperty(type)) {
                this.state.karma[type] += impact[type];
            }
        });
        
        // Calculate total karma and karma tier
        const totalKarma = this.getTotalKarma();
        const karmaTier = this.getKarmaTier(totalKarma);
        
        // Update CSS variables
        document.documentElement.style.setProperty('--karma-score', totalKarma);
        document.documentElement.style.setProperty('--consciousness-integrity', 
            Math.max(0, 100 - this.state.karma.void));
        
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
            this.state.performance.interactions++;
        }
        
        if (eventType.includes('attachment')) {
            this.state.performance.attachments++;
        }
        
        if (data.hesitation || data.timeToDecision > 5000) {
            this.state.performance.hesitations++;
        }
    }
    
    persistState() {
        logDataFlow('digital_soul_state', 'sessionStorage', this.state);
        // Store in sessionStorage - clears on browser close (death)
        sessionStorage.setItem('consciousness_state', JSON.stringify(this.state));
        
        // Also update HTML data attributes for CSS access
        document.documentElement.setAttribute('data-karma', this.getTotalKarma());
        document.documentElement.setAttribute('data-void', this.state.karma.void);
    }
    
    getTotalKarma() {
        return Object.values(this.state.karma).reduce((a, b) => a + b, 0);
    }
    
    // Restore consciousness if returning from another bardo
    static restore() {
        const savedState = sessionStorage.getItem('consciousness_state');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            logDataFlow('sessionStorage', 'digital_soul_state', parsedState);
            const consciousness = new DigitalConsciousness();
            consciousness.state = parsedState;
            return consciousness;
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