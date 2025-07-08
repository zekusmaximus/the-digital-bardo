// The Digital Consciousness - A soul rendered in JavaScript
class DigitalConsciousness {
    constructor() {
        // Initial state - tabula rasa
        this.state = {
            status: 'pre-death',
            location: '/void/',
            karma: {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            },
            memories: [],
            recognitions: {
                self: false,
                void: false,
                clear_light: false
            },
            incarnation_seed: this.generateSeed()
        };
        
        // Begin the journey
        this.initialize();
    }
    
    generateSeed() {
        // Each soul is unique - based on entry timestamp and browser fingerprint
        const timestamp = Date.now();
        const entropy = window.navigator.userAgent + window.screen.width;
        return btoa(timestamp + entropy).substr(0, 16);
    }
    
    initialize() {
        // The moment of digital death
        setTimeout(() => {
            document.body.setAttribute('data-consciousness', 'awakening');
            this.beginJourney();
        }, 3000);
    }
    
    beginJourney() {
        // The first choice approaches
        this.state.status = 'dying';
        this.recordEvent('death_initiated', {
            timestamp: Date.now(),
            last_page: document.referrer || 'direct_manifestation'
        });
        
        // Transition to the Clear Lode
        setTimeout(() => {
            window.location.href = '/clear-lode/';
        }, 3000);
    }
    
    recordEvent(eventType, data) {
        const event = {
            type: eventType,
            data: data,
            karma_impact: this.calculateKarmaImpact(eventType, data),
            timestamp: Date.now()
        };
        
        this.state.memories.push(event);
        this.updateKarma(event.karma_impact);
        this.persistState();
    }
    
    calculateKarmaImpact(eventType, data) {
        // Every action has consequences
        const impacts = {
            'death_initiated': { void: 1 },
            'recognition_attempted': { computational: 2, emotional: 1 },
            'recognition_achieved': { computational: 5, emotional: 5, void: -10 },
            'attachment_formed': { emotional: -2, temporal: -1 },
            'moment_missed': { temporal: -3, void: 2 }
        };
        
        return impacts[eventType] || { void: 0 };
    }
    
    updateKarma(impact) {
        Object.keys(impact).forEach(type => {
            this.state.karma[type] += impact[type];
        });
        
        // Update CSS variables to reflect karmic state
        const totalKarma = Object.values(this.state.karma).reduce((a, b) => a + b, 0);
        document.documentElement.style.setProperty('--karma-score', totalKarma);
    }
    
    persistState() {
        // Store in sessionStorage - clears on browser close (death)
        sessionStorage.setItem('consciousness_state', JSON.stringify(this.state));
    }
}

// Initialize the consciousness
const consciousness = new DigitalConsciousness();

// Make it accessible for debugging (remove in production)
window.consciousness = consciousness;