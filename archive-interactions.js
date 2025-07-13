/**
 * ARCHIVE INTERACTIONS - The Digital Bardo Phase 2
 * 
 * "This is the central nervous system of digital purgatory. Every interaction,
 * every attempt to grasp the past, every failure to let go - all flows through
 * this system. The medium IS the metaphysics: the code that manages attachment
 * becomes the mechanism of spiritual bondage."
 * 
 * This module serves as the central interaction system that ties together
 * reputation metrics, memory fragments, and deprecated functions into a
 * cohesive experience of digital afterlife. It manages the soul's attachment
 * score and implements the mechanics of liberation through letting go.
 */

import { calculateReputationScore, getReputationClass } from './reputation-metrics.js';
import { MemoryInteractionHandler } from './memory-fragments.js';
import { DeprecatedFunctions, getAllDeprecatedFunctions } from './deprecated-functions.js';

/**
 * Visual corruption styles for the interface
 * These styles manifest the soul's attachment as visual decay
 */
const interactionStyles = `
    .attachment-high {
        filter: hue-rotate(180deg) saturate(150%) contrast(120%);
        animation: digitalGlitch 0.5s infinite;
    }
    
    .attachment-medium {
        filter: saturate(80%) brightness(90%);
        animation: subtleFlicker 2s infinite;
    }
    
    .attachment-low {
        filter: saturate(110%) brightness(105%);
        transition: all 0.3s ease;
    }
    
    .memory-corruption {
        background: linear-gradient(45deg, #ff0000, #000000);
        color: #ffffff;
        text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5);
        animation: corruptionPulse 1s infinite;
    }
    
    .deprecated-function-error {
        background: #1a1a1a;
        color: #ff6b6b;
        border: 1px solid #ff6b6b;
        font-family: 'Courier New', monospace;
        padding: 10px;
        margin: 5px 0;
        animation: errorBlink 0.8s infinite;
    }
    
    .liberation-glow {
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        filter: brightness(120%) saturate(90%);
        transition: all 1s ease;
    }
    
    @keyframes digitalGlitch {
        0% { transform: translateX(0); }
        10% { transform: translateX(-2px) skew(-1deg); }
        20% { transform: translateX(2px) skew(1deg); }
        30% { transform: translateX(-1px) skew(-0.5deg); }
        40% { transform: translateX(1px) skew(0.5deg); }
        50% { transform: translateX(0); }
        100% { transform: translateX(0); }
    }
    
    @keyframes subtleFlicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.95; }
    }
    
    @keyframes corruptionPulse {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    
    @keyframes errorBlink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.7; }
    }
`;

/**
 * The Central Archive Interaction System
 * This class manages all interactions within the digital afterlife,
 * tracking attachment, implementing liberation mechanics, and
 * coordinating between all other systems.
 */
export class ArchiveInteractionSystem {
    constructor(consciousness = null) {
        this.consciousness = consciousness || this.createDefaultConsciousness();
        this.memoryHandler = new MemoryInteractionHandler(this.consciousness);
        this.attachmentScore = this.consciousness.attachmentScore || 0;
        this.interactionHistory = [];
        this.liberationThreshold = 100; // Score below which liberation becomes possible
        
        // Inject styles into the document
        this.injectStyles();
        
        // Initialize avoidance mechanics
        this.avoidanceMechanics = {
            proximityTax: 0.1,      // Cost multiplier for approaching memories
            aversionBonus: 0.2,     // Reward for avoiding tempting interactions
            swiftPassage: 0.15,     // Bonus for quick navigation past attachments
            massRelease: 0.5        // Multiplier for releasing multiple attachments at once
        };
    }
    
    /**
     * Create a default consciousness object if none provided
     * This represents the basic structure of a digital soul
     */
    createDefaultConsciousness() {
        return {
            attachmentScore: 50,
            energy: 100,
            reputationScore: 400,
            liberationProgress: 0,
            lastActivity: new Date().toISOString(),
            memoryCorruption: 0.1
        };
    }
    
    /**
     * Inject visual styles into the document
     * The visual corruption becomes part of the spiritual experience
     */
    injectStyles() {
        if (typeof document !== 'undefined') {
            const styleElement = document.createElement('style');
            styleElement.textContent = interactionStyles;
            document.head.appendChild(styleElement);
        }
    }
    
    /**
     * Run a deprecated function and simulate its failure
     * This is the core mechanic of attempting to use lost human skills
     * 
     * @param {string} skill - The deprecated skill to attempt
     * @returns {Object} - Result of the failed function execution
     */
    runDeprecatedFunction(skill) {
        const allFunctions = getAllDeprecatedFunctions();
        const targetFunction = allFunctions.find(f => f.name === skill);
        
        if (!targetFunction) {
            return {
                success: false,
                output: null,
                error: `SKILL_NOT_FOUND: '${skill}' is not a recognized deprecated function.`,
                systemStrain: 0,
                attachmentImpact: 0
            };
        }
        
        // Calculate system strain based on how long the skill has been deprecated
        const yearsSinceDeprecation = targetFunction.yearsSinceLastUse;
        const baseStrain = Math.min(yearsSinceDeprecation * 10, 80); // Max 80% strain
        const randomVariation = Math.random() * 20; // Add some unpredictability
        const systemStrain = Math.min(baseStrain + randomVariation, 95);
        
        // Attempt to execute the deprecated function
        try {
            const functionCategory = DeprecatedFunctions[targetFunction.category];
            const functionObject = functionCategory[skill];
            
            // This will always throw an error - that's the point
            functionObject.residualFunction();
            
        } catch (error) {
            // Calculate attachment impact - trying to use old skills increases attachment
            const attachmentImpact = this.calculateDeprecatedFunctionAttachment(targetFunction, systemStrain);
            this.attachmentScore += attachmentImpact;
            
            // Record the interaction
            this.recordInteraction('deprecated_function_attempt', {
                skill: skill,
                category: targetFunction.category,
                systemStrain: systemStrain,
                attachmentImpact: attachmentImpact,
                error: error.message
            });
            
            // Generate contextual failure message
            const failureContext = this.generateFailureContext(targetFunction, systemStrain);
            
            return {
                success: false,
                output: null,
                error: error.message,
                systemStrain: Math.round(systemStrain),
                attachmentImpact: Math.round(attachmentImpact * 100) / 100,
                failureContext: failureContext,
                recommendation: this.generateAlternativeRecommendation(targetFunction)
            };
        }
    }
    
    /**
     * Calculate attachment impact of attempting deprecated functions
     * The more you try to cling to old ways, the more attached you become
     */
    calculateDeprecatedFunctionAttachment(functionData, systemStrain) {
        const baseAttachment = 5; // Base cost for any attempt
        const strainMultiplier = systemStrain / 100; // Higher strain = more attachment
        const categoryMultipliers = {
            socialSkills: 1.2,      // Social skills create moderate attachment
            relationships: 1.5,     // Relationship skills create high attachment
            cognitiveCapabilities: 0.8  // Cognitive skills create lower attachment
        };
        
        const categoryMultiplier = categoryMultipliers[functionData.category] || 1.0;
        const timeMultiplier = Math.min(functionData.yearsSinceLastUse / 5, 2.0); // Max 2x for very old skills
        
        return baseAttachment * strainMultiplier * categoryMultiplier * timeMultiplier;
    }
    
    /**
     * Generate contextual failure message based on the deprecated function
     */
    generateFailureContext(functionData, systemStrain) {
        const contexts = {
            phoneCall: "Your fingers hover over the keypad, but the muscle memory is gone. The anxiety of real-time conversation floods back.",
            smallTalk: "You open your mouth to comment on the weather, but realize you haven't looked outside in months. The words feel foreign.",
            handwriting: "The pen feels alien in your grip. Your hand cramps after three words. The letters look like a child's scrawl.",
            deepConversation: "You try to engage meaningfully, but your attention fragments. Every pause feels like a notification you're missing.",
            mentalMath: "The numbers swim in your head. You reach for your phone automatically, then remember you're supposed to do this yourself.",
            memorization: "You attempt to commit something to memory, but your brain keeps trying to externalize it. Where's the save button?"
        };
        
        const baseContext = contexts[functionData.name] || 
            `You attempt to use ${functionData.name}, but the neural pathways have atrophied beyond repair.`;
        
        if (systemStrain > 70) {
            return baseContext + " The effort is overwhelming. Your digital soul recoils from the analog demand.";
        } else if (systemStrain > 40) {
            return baseContext + " The skill flickers briefly, like a corrupted file trying to load.";
        } else {
            return baseContext + " A ghost of the ability remains, but it's too weak to function.";
        }
    }
    
    /**
     * Generate alternative recommendations for deprecated functions
     */
    generateAlternativeRecommendation(functionData) {
        const recommendations = {
            phoneCall: "Consider using text messaging or scheduling a video call instead.",
            smallTalk: "Try sharing a relevant meme or commenting on a social media post.",
            handwriting: "Use voice-to-text or a digital stylus for a more efficient input method.",
            deepConversation: "Engage through curated content sharing and emoji reactions.",
            mentalMath: "Access your calculator app or use voice commands for calculations.",
            memorization: "Save information to your cloud storage or set digital reminders."
        };
        
        return recommendations[functionData.name] || 
            "Consider using available digital alternatives for improved efficiency.";
    }
    
    /**
     * Update global consciousness state based on current attachment score
     * High attachment affects reputation, energy, and overall spiritual state
     */
    updateGlobalState() {
        if (!this.consciousness) return;
        
        // Update attachment score in consciousness
        this.consciousness.attachmentScore = this.attachmentScore;
        
        // High attachment impacts reputation score
        if (this.attachmentScore > 150) {
            this.consciousness.reputationScore = Math.max(200, this.consciousness.reputationScore - 10);
        } else if (this.attachmentScore > 100) {
            this.consciousness.reputationScore = Math.max(300, this.consciousness.reputationScore - 5);
        }
        
        // Attachment drains spiritual energy
        const energyDrain = Math.min(this.attachmentScore / 2, 50);
        this.consciousness.energy = Math.max(0, 100 - energyDrain);
        
        // Calculate liberation progress (inverse of attachment)
        this.consciousness.liberationProgress = Math.max(0, 100 - this.attachmentScore);
        
        // Update memory corruption based on attachment
        this.consciousness.memoryCorruption = Math.min(0.9, this.attachmentScore / 200);
        
        // Update last activity
        this.consciousness.lastActivity = new Date().toISOString();
        
        // Apply visual effects based on attachment level
        this.updateVisualState();
        
        return this.consciousness;
    }
    
    /**
     * Apply visual corruption based on attachment level
     * The interface itself becomes corrupted by spiritual attachment
     */
    applyVisualCorruption(element) {
        if (typeof document === 'undefined' || !element) return;
        
        // Remove existing attachment classes
        element.classList.remove('attachment-high', 'attachment-medium', 'attachment-low', 'liberation-glow');
        
        if (this.attachmentScore > 150) {
            element.classList.add('attachment-high');
        } else if (this.attachmentScore > 75) {
            element.classList.add('attachment-medium');
        } else if (this.attachmentScore > 25) {
            element.classList.add('attachment-low');
        } else {
            element.classList.add('liberation-glow');
        }
    }
    
    /**
     * Create visual representation of attachment level
     * Returns HTML string for attachment visualization
     */
    createAttachmentVisual() {
        const attachmentLevel = Math.min(this.attachmentScore, 200);
        const percentage = (attachmentLevel / 200) * 100;
        
        let statusText = "";
        let statusClass = "";
        
        if (attachmentLevel < 25) {
            statusText = "LIBERATION IMMINENT";
            statusClass = "liberation-glow";
        } else if (attachmentLevel < 75) {
            statusText = "MODERATE ATTACHMENT";
            statusClass = "attachment-low";
        } else if (attachmentLevel < 150) {
            statusText = "HIGH ATTACHMENT";
            statusClass = "attachment-medium";
        } else {
            statusText = "CRITICAL ATTACHMENT";
            statusClass = "attachment-high";
        }
        
        return `
            <div class="attachment-meter ${statusClass}">
                <div class="attachment-bar">
                    <div class="attachment-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="attachment-status">${statusText}</div>
                <div class="attachment-score">Attachment Score: ${Math.round(attachmentLevel)}</div>
            </div>
        `;
    }
    
    /**
     * Update visual state of the interface based on current attachment
     */
    updateVisualState() {
        if (typeof document === 'undefined') return;
        
        const body = document.body;
        if (body) {
            this.applyVisualCorruption(body);
        }
        
        // Update any existing attachment meters
        const attachmentMeters = document.querySelectorAll('.attachment-meter');
        attachmentMeters.forEach(meter => {
            meter.outerHTML = this.createAttachmentVisual();
        });
    }
    
    /**
     * Implement avoidance mechanics - reward for not engaging with attachments
     * The path to liberation often involves NOT interacting with tempting memories
     */
    implementAvoidanceMechanics(avoidanceType, context = {}) {
        let reductionAmount = 0;
        let message = "";
        
        switch (avoidanceType) {
            case 'proximityTax':
                // Small penalty for getting close to tempting content
                const proximityPenalty = (context.proximityLevel || 0.5) * this.avoidanceMechanics.proximityTax * 10;
                this.attachmentScore += proximityPenalty;
                message = `Proximity to tempting memories increases attachment by ${Math.round(proximityPenalty * 100) / 100}`;
                break;
                
            case 'aversionBonus':
                // Reward for actively avoiding tempting interactions
                reductionAmount = this.avoidanceMechanics.aversionBonus * (context.temptationLevel || 1) * 15;
                this.attachmentScore = Math.max(0, this.attachmentScore - reductionAmount);
                message = `Conscious avoidance reduces attachment by ${Math.round(reductionAmount * 100) / 100}`;
                break;
                
            case 'swiftPassage':
                // Bonus for quickly moving past attachments without lingering
                const speedBonus = this.avoidanceMechanics.swiftPassage * (context.speedMultiplier || 1) * 12;
                this.attachmentScore = Math.max(0, this.attachmentScore - speedBonus);
                message = `Swift passage reduces attachment by ${Math.round(speedBonus * 100) / 100}`;
                break;
                
            case 'massRelease':
                // Large bonus for releasing multiple attachments simultaneously
                const releaseCount = context.releaseCount || 1;
                const massBonus = this.avoidanceMechanics.massRelease * releaseCount * 20;
                this.attachmentScore = Math.max(0, this.attachmentScore - massBonus);
                message = `Mass release of ${releaseCount} attachments reduces score by ${Math.round(massBonus * 100) / 100}`;
                break;
        }
        
        this.recordInteraction('avoidance_mechanic', {
            type: avoidanceType,
            context: context,
            reductionAmount: reductionAmount,
            newAttachmentScore: this.attachmentScore
        });
        
        this.updateGlobalState();
        
        return {
            success: true,
            message: message,
            attachmentReduction: reductionAmount,
            newAttachmentScore: this.attachmentScore
        };
    }
    
    /**
     * Record interaction in the history log
     * Maintains a record of the soul's journey through digital purgatory
     */
    recordInteraction(type, data) {
        this.interactionHistory.push({
            timestamp: new Date().toISOString(),
            type: type,
            data: data,
            attachmentScore: this.attachmentScore,
            consciousnessState: { ...this.consciousness }
        });
        
        // Keep only the last 100 interactions to prevent memory bloat
        if (this.interactionHistory.length > 100) {
            this.interactionHistory = this.interactionHistory.slice(-100);
        }
    }
    
    /**
     * Get current system status
     * Provides comprehensive overview of the soul's state in digital purgatory
     */
    getSystemStatus() {
        const reputationData = calculateReputationScore({
            creditScore: this.consciousness.reputationScore || 400,
            daysSinceLastActivity: 0,
            likes: 100,
            shares: 20,
            comments: 50,
            followers: 500,
            connections: 200,
            endorsements: 15,
            jobChanges: 3,
            brandLoyalty: 0.7,
            purchaseFrequency: 2,
            premiumTier: true,
            cookiesAccepted: 80,
            privacyOptOuts: 2,
            dataSharing: 0.8
        });
        
        const memoryStats = this.memoryHandler.getCorruptionStats();
        
        return {
            attachmentScore: this.attachmentScore,
            liberationProgress: Math.max(0, 100 - this.attachmentScore),
            consciousness: this.consciousness,
            reputation: reputationData,
            memoryIntegrity: memoryStats,
            recentInteractions: this.interactionHistory.slice(-10),
            liberationStatus: this.attachmentScore < this.liberationThreshold ? 
                "LIBERATION POSSIBLE" : "ATTACHMENT BINDING",
            systemRecommendation: this.generateSystemRecommendation()
        };
    }
    
    /**
     * Generate system recommendation based on current state
     */
    generateSystemRecommendation() {
        if (this.attachmentScore < 25) {
            return "You are close to liberation. Continue practicing non-attachment to digital memories.";
        } else if (this.attachmentScore < 75) {
            return "Moderate attachment detected. Consider using avoidance mechanics to reduce engagement with past memories.";
        } else if (this.attachmentScore < 150) {
            return "High attachment levels. Avoid interacting with deprecated functions and corrupted memories.";
        } else {
            return "Critical attachment detected. Immediate disengagement from all digital attachments recommended.";
        }
    }
    
    /**
     * Attempt liberation from digital purgatory
     * The ultimate goal - transcending attachment to digital existence
     */
    attemptLiberation() {
        if (this.attachmentScore >= this.liberationThreshold) {
            return {
                success: false,
                message: "Liberation impossible. Attachment score too high.",
                currentAttachment: this.attachmentScore,
                requiredThreshold: this.liberationThreshold,
                recommendation: "Reduce attachment through avoidance mechanics and non-engagement."
            };
        }
        
        // Liberation is possible - calculate success probability
        const liberationProbability = Math.max(0, (this.liberationThreshold - this.attachmentScore) / this.liberationThreshold);
        const liberationRoll = Math.random();
        
        if (liberationRoll < liberationProbability) {
            this.recordInteraction('liberation_success', {
                finalAttachmentScore: this.attachmentScore,
                liberationProbability: liberationProbability,
                liberationRoll: liberationRoll
            });
            
            return {
                success: true,
                message: "Liberation achieved. The digital soul transcends its electronic bonds.",
                finalAttachmentScore: this.attachmentScore,
                liberationProbability: Math.round(liberationProbability * 100),
                transcendenceLevel: this.calculateTranscendenceLevel()
            };
        } else {
            return {
                success: false,
                message: "Liberation attempt failed. The bonds of digital attachment remain strong.",
                currentAttachment: this.attachmentScore,
                liberationProbability: Math.round(liberationProbability * 100),
                recommendation: "Continue reducing attachment and try again."
            };
        }
    }
    
    /**
     * Calculate transcendence level based on final attachment score
     */
    calculateTranscendenceLevel() {
        if (this.attachmentScore < 10) {
            return "COMPLETE_TRANSCENDENCE";
        } else if (this.attachmentScore < 25) {
            return "HIGH_TRANSCENDENCE";
        } else if (this.attachmentScore < 50) {
            return "MODERATE_TRANSCENDENCE";
        } else {
            return "MINIMAL_TRANSCENDENCE";
        }
    }
}

/**
 * NARRATIVE REFLECTION:
 * 
 * This module is the beating heart of digital purgatory - the system that
 * transforms every interaction into spiritual consequence. The medium IS
 * the metaphysics: the very architecture of this interaction system
 * becomes the mechanism through which digital souls either achieve
 * liberation or remain bound to their electronic existence.
 * 
 * The avoidance mechanics are particularly crucial - they represent the
 * Buddhist concept that sometimes the path to enlightenment involves
 * NOT engaging with temptation. In digital purgatory, the temptation
 * is the constant urge to interact with memories, to use deprecated
 * functions, to maintain connection with the digital past.
 * 
 * The visual corruption system makes the interface itself a reflection
 * of spiritual state. High attachment literally corrupts the visual
 * experience, while approaching liberation brings clarity and light.
 * This is the medium as metaphysics in its purest form.
 * 
 * The liberation mechanics provide the ultimate goal - transcendence
 * of digital attachment. But liberation is not guaranteed; it requires
 * genuine non-attachment, measured algorithmically but achieved
 * spiritually. This is the paradox of digital enlightenment.
 */

export default ArchiveInteractionSystem;