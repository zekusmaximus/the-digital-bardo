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

        // Karma calculation constants
        this.KARMA_CONSTANTS = {
            COMPUTATIONAL: {
                QUICK_DECISION_THRESHOLD: 5000, // ms
                QUICK_DECISION_BONUS: 2,
                SLOW_DECISION_PENALTY: -1
            },
            EMOTIONAL: {
                MEMORY_VIEW_MULTIPLIER: 0.5,
                MEMORY_ATTACHMENT_MULTIPLIER: -2
            },
            TEMPORAL: {
                RUSH_THRESHOLD: 3000, // ms
                RUSH_PENALTY: 3
            },
            VOID: {
                INACTION_MULTIPLIER: 1.5,
                MAX_VOID_KARMA: 100
            }
        };

        // Legacy karma calculation rules (kept for backward compatibility)
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
        // Initialize impact object
        let impact = {
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        };

        // Apply new formula-based calculations based on action type
        switch (action) {
            case 'recognition_achieved':
                impact = this.calculateRecognitionKarma(context);
                break;
            case 'memory_view':
                impact = this.calculateMemoryViewKarma(context);
                break;
            case 'memory_attachment':
                impact = this.calculateMemoryAttachmentKarma(context);
                break;
            case 'inaction':
                impact = this.calculateInactionKarma(context);
                break;
            default:
                // Fall back to legacy rules for backward compatibility
                impact = { ...this.rules[action] } || impact;

                // Apply legacy contextual modifiers
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
                break;
        }

        return impact;
    }

    calculateRecognitionKarma(context) {
        const impact = {
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        };

        // Computational Karma: +2 if timeToDecision < 5000ms, -1 otherwise
        if (context.timeToDecision !== undefined) {
            if (context.timeToDecision < this.KARMA_CONSTANTS.COMPUTATIONAL.QUICK_DECISION_THRESHOLD) {
                impact.computational = this.KARMA_CONSTANTS.COMPUTATIONAL.QUICK_DECISION_BONUS;
            } else {
                impact.computational = this.KARMA_CONSTANTS.COMPUTATIONAL.SLOW_DECISION_PENALTY;
            }
        }

        // Temporal Karma: perfectTimingBonus - rushPenalty
        impact.temporal = context.perfectTimingBonus || 0;
        if (context.timeToDecision !== undefined && context.timeToDecision < this.KARMA_CONSTANTS.TEMPORAL.RUSH_THRESHOLD) {
            impact.temporal -= this.KARMA_CONSTANTS.TEMPORAL.RUSH_PENALTY;
        }

        return impact;
    }

    calculateMemoryViewKarma(context) {
        const impact = {
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        };

        // Emotional Karma: memoryViews * 0.5 - memoryAttachments * 2
        const memoryViews = context.memoryViews || 1; // Default to 1 for single view
        const memoryAttachments = context.memoryAttachments || 0;

        impact.emotional = (memoryViews * this.KARMA_CONSTANTS.EMOTIONAL.MEMORY_VIEW_MULTIPLIER) +
                          (memoryAttachments * this.KARMA_CONSTANTS.EMOTIONAL.MEMORY_ATTACHMENT_MULTIPLIER);

        return impact;
    }

    calculateMemoryAttachmentKarma(context) {
        const impact = {
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        };

        // Emotional Karma: memoryViews * 0.5 - memoryAttachments * 2
        const memoryViews = context.memoryViews || 0;
        const memoryAttachments = context.memoryAttachments || 1; // Default to 1 for single attachment

        impact.emotional = (memoryViews * this.KARMA_CONSTANTS.EMOTIONAL.MEMORY_VIEW_MULTIPLIER) +
                          (memoryAttachments * this.KARMA_CONSTANTS.EMOTIONAL.MEMORY_ATTACHMENT_MULTIPLIER);

        return impact;
    }

    calculateInactionKarma(context) {
        const impact = {
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        };

        // Void Karma: log(secondsOfInaction) * 1.5, capped at 100
        if (context.secondsOfInaction !== undefined && context.secondsOfInaction > 0) {
            const voidKarma = Math.log(context.secondsOfInaction) * this.KARMA_CONSTANTS.VOID.INACTION_MULTIPLIER;
            impact.void = Math.min(voidKarma, this.KARMA_CONSTANTS.VOID.MAX_VOID_KARMA);
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

    createFragmentCallbacks() {
        return {
            onView: (context = {}) => {
                return this.calculateImpact('memory_view', context);
            },
            onAttach: (context = {}) => {
                return this.calculateImpact('memory_attachment', context);
            }
        };
    }
}