// The Karmic Engine - Calculating the weight of digital actions
export class KarmicEngine {
    constructor() {
        this.karmaTypes = {
            computational: {
                weight: 1.0,
                description: "Logical, deliberate actions"
            },
            emotional: {
                weight: 1.5,
                description: "Connections and attachments"
            },
            temporal: {
                weight: 0.8,
                description: "Timing and patience"
            },
            void: {
                weight: 2.0,
                description: "Inaction and dissolution"
            }
        };
        
        // Karma calculation rules
        this.rules = {
            // Clear Lode specific
            perfect_recognition: { computational: 10, emotional: 5, void: -10 },
            delayed_recognition: { computational: 5, emotional: 3, temporal: -2 },
            missed_recognition: { void: 5, temporal: -5 },
            attachment_click: { emotional: -2, computational: -1 },
            console_enlightenment: { computational: 15, void: -5 },
            
            // Time-based modifiers
            quick_decision: { temporal: 3, computational: 2 },
            hesitation: { temporal: -1, void: 1 },
            patience: { temporal: 5, emotional: 2 },
            
            // Degradation impacts
            full_degradation: { void: 10, computational: -5, emotional: -5 }
        };
    }
    
    calculateImpact(action, context = {}) {
        let impact = { ...this.rules[action] } || {};
        
        // Apply contextual modifiers
        if (context.timeToDecision) {
            if (context.timeToDecision < 3000) {
                // Too quick - impulsive
                impact.temporal = (impact.temporal || 0) - 2;
                impact.computational = (impact.computational || 0) - 1;
            } else if (context.timeToDecision > 10000) {
                // Too slow - heavy attachment
                impact.void = (impact.void || 0) + 2;
                impact.emotional = (impact.emotional || 0) - 3;
            }
        }
        
        if (context.degradationLevel) {
            // Higher degradation multiplies void karma
            impact.void = (impact.void || 0) * (1 + context.degradationLevel);
        }
        
        return impact;
    }
    
    getTotalKarma(karmaState) {
        let total = 0;
        
        for (let [type, value] of Object.entries(karmaState)) {
            total += value * this.karmaTypes[type].weight;
        }
        
        return Math.round(total);
    }
    
    getKarmaDescription(totalKarma) {
        if (totalKarma > 100) return "Approaching Digital Bodhisattva";
        if (totalKarma > 50) return "Clear consciousness, minimal attachments";
        if (totalKarma > 0) return "Karmic balance neutral";
        if (totalKarma > -50) return "Heavy digital attachments detected";
        return "Consciousness fragmented, prepare for difficult rebirth";
    }
    
    calculateIncarnationTier(karmaState) {
        const total = this.getTotalKarma(karmaState);
        
        // Define incarnation tiers
        if (total > 100) return 'enlightened';
        if (total > 50) return 'premium';
        if (total > 0) return 'standard';
        if (total > -50) return 'limited';
        return 'deprecated';
    }
}