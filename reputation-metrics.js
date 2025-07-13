/**
 * REPUTATION METRICS - The Digital Bardo Phase 2
 * 
 * "Your worth is measured not by who you are, but by what you consume,
 * what you produce, and how well you submit to surveillance."
 * 
 * This module implements the satirical reputation scoring system that governs
 * digital purgatory. Every soul is reduced to metrics, every human complexity
 * flattened into algorithmic assessment. The medium IS the metaphysics here -
 * the very structure of this scoring system reveals the spiritual poverty
 * of surveillance capitalism.
 */

/**
 * The Five Pillars of Digital Worth
 * Each metric represents a different aspect of how digital systems
 * reduce human value to trackable, monetizable data points.
 */
export const ReputationMetrics = {
    creditScore: {
        weight: 0.35,
        description: "Financial worthiness as proxy for moral character",
        /**
         * Temporal decay function - even your financial worth rots in the digital afterlife
         * The longer you've been dead to the system, the more your credit decays
         */
        applyDecay: (score, daysSinceLastActivity) => {
            const decayRate = 0.02; // 2% per day - capitalism never sleeps, even in death
            const decayFactor = Math.pow(1 - decayRate, daysSinceLastActivity);
            return Math.max(300, score * decayFactor); // Floor at 300 - even the dead have minimum debt
        }
    },
    
    socialEngagement: {
        weight: 0.25,
        description: "Digital presence as measure of existence",
        // If you don't post, do you even exist? The algorithm demands constant feeding
        calculateEngagement: (likes, shares, comments, followers) => {
            const engagementRate = (likes + shares * 2 + comments * 3) / Math.max(followers, 1);
            return Math.min(1000, engagementRate * 100); // Cap at 1000 - even influencers die
        }
    },
    
    professionalStanding: {
        weight: 0.20,
        description: "LinkedIn optimization and corporate ladder climbing",
        // Your professional network becomes your spiritual network in digital purgatory
        assessStanding: (connections, endorsements, jobChanges) => {
            const stability = Math.max(0, 100 - (jobChanges * 10)); // Job hopping is spiritual instability
            const influence = Math.min(connections / 10, 100); // Connections = influence, capped
            const credibility = Math.min(endorsements * 5, 200); // Endorsements = credibility
            return (stability + influence + credibility) / 3;
        }
    },
    
    consumptionPatterns: {
        weight: 0.15,
        description: "Devotion to corporate entities and brand loyalty",
        // Your purchases define your soul - brand loyalty as spiritual practice
        evaluateConsumption: (brandLoyalty, purchaseFrequency, premiumTier) => {
            const loyalty = brandLoyalty * 100; // 0-1 scale to 0-100
            const frequency = Math.min(purchaseFrequency * 10, 200); // More buying = higher score
            const premium = premiumTier ? 150 : 50; // Premium subscribers are premium souls
            return (loyalty + frequency + premium) / 3;
        }
    },
    
    complianceIndex: {
        weight: 0.05,
        description: "Willingness to be tracked, monitored, and datafied",
        // The smallest weight but the most insidious - compliance with surveillance
        measureCompliance: (cookiesAccepted, privacyOptOuts, dataSharing) => {
            const cookieCompliance = (cookiesAccepted / 100) * 100; // Percentage of cookies accepted
            const privacyResistance = Math.max(0, 100 - (privacyOptOuts * 20)); // Fewer opt-outs = higher score
            const sharingWillingness = dataSharing * 100; // 0-1 scale to 0-100
            return (cookieCompliance + privacyResistance + sharingWillingness) / 3;
        }
    }
};

/**
 * Calculate the final reputation score that determines a soul's classification
 * in the digital afterlife. This is where human complexity meets algorithmic reduction.
 * 
 * @param {Object} userData - The digital remains of a human life
 * @returns {Object} - Score, classification, and decay status
 */
export function calculateReputationScore(userData) {
    // Extract metrics from user data - the digital archaeology of a life
    const creditScore = userData.creditScore || 650; // Default to median credit score
    const socialEngagement = ReputationMetrics.socialEngagement.calculateEngagement(
        userData.likes || 0,
        userData.shares || 0, 
        userData.comments || 0,
        userData.followers || 1
    );
    const professionalStanding = ReputationMetrics.professionalStanding.assessStanding(
        userData.connections || 0,
        userData.endorsements || 0,
        userData.jobChanges || 0
    );
    const consumptionPatterns = ReputationMetrics.consumptionPatterns.evaluateConsumption(
        userData.brandLoyalty || 0.5,
        userData.purchaseFrequency || 1,
        userData.premiumTier || false
    );
    const complianceIndex = ReputationMetrics.complianceIndex.measureCompliance(
        userData.cookiesAccepted || 50,
        userData.privacyOptOuts || 0,
        userData.dataSharing || 0.7
    );
    
    // Apply temporal decay - even in death, your metrics decay
    const daysSinceLastActivity = userData.daysSinceLastActivity || 0;
    const decayedCreditScore = ReputationMetrics.creditScore.applyDecay(creditScore, daysSinceLastActivity);
    
    // Calculate weighted total - the mathematical reduction of a human soul
    const weightedScore = (
        (decayedCreditScore / 850) * ReputationMetrics.creditScore.weight +
        (socialEngagement / 1000) * ReputationMetrics.socialEngagement.weight +
        (professionalStanding / 100) * ReputationMetrics.professionalStanding.weight +
        (consumptionPatterns / 100) * ReputationMetrics.consumptionPatterns.weight +
        (complianceIndex / 100) * ReputationMetrics.complianceIndex.weight
    ) * 1000; // Scale to 0-1000
    
    // Generate decay status message - the system's judgment on digital death
    let decayStatus = "";
    if (daysSinceLastActivity > 365) {
        decayStatus = "CRITICAL DECAY: Digital presence fragmenting. Recommend immediate reactivation.";
    } else if (daysSinceLastActivity > 90) {
        decayStatus = "MODERATE DECAY: Engagement metrics declining. Social relevance at risk.";
    } else if (daysSinceLastActivity > 30) {
        decayStatus = "MINOR DECAY: Recent inactivity detected. Algorithm visibility reduced.";
    } else {
        decayStatus = "ACTIVE STATUS: Metrics within acceptable parameters.";
    }
    
    return {
        finalScore: Math.round(weightedScore),
        classification: getReputationClass(weightedScore),
        decayStatus: decayStatus,
        breakdown: {
            creditScore: Math.round(decayedCreditScore),
            socialEngagement: Math.round(socialEngagement),
            professionalStanding: Math.round(professionalStanding),
            consumptionPatterns: Math.round(consumptionPatterns),
            complianceIndex: Math.round(complianceIndex)
        }
    };
}

/**
 * Classify souls based on their reputation score
 * Each tier represents a different level of digital afterlife privilege
 * 
 * @param {number} score - The calculated reputation score
 * @returns {string} - Classification tier
 */
function getReputationClass(score) {
    if (score >= 800) {
        return "Verified Soul™"; // The digital elite - blue checkmarks in the afterlife
    } else if (score >= 600) {
        return "Priority User"; // Premium subscribers to existence
    } else if (score >= 400) {
        return "Standard Account"; // The digital middle class - adequate but unremarkable
    } else if (score >= 200) {
        return "Shadow Profile"; // The digitally marginalized - present but invisible
    } else {
        return "404 - Identity Not Found"; // Digital non-existence - the ultimate punishment
    }
}

/**
 * Export the classification function for external use
 * This allows other modules to understand the hierarchy of digital worth
 */
export { getReputationClass };

/**
 * NARRATIVE REFLECTION:
 * 
 * This module embodies the spiritual poverty of surveillance capitalism.
 * Every function is both code and commentary - the medium IS the metaphysics.
 * The very act of reducing human worth to algorithmic scores becomes the
 * philosophical statement about digital purgatory.
 * 
 * The weights reveal the priorities: financial worth (35%) dominates,
 * while compliance with surveillance is minimized (5%) - not because it's
 * unimportant, but because it's so normalized it barely registers.
 * 
 * The decay functions represent the temporal nature of digital death -
 * even your metrics rot without constant feeding of the algorithm.
 * This is purgatory: endless maintenance of digital presence to avoid
 * the ultimate punishment of being forgotten by the system.
 */