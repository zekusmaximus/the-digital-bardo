/**
 * KARMIC ACCOUNTING DEPARTMENT - Where Every Click is Tallied
 * 
 * "In the end, we are all just entries in a cosmic spreadsheet,
 * our worth calculated by algorithms we'll never understand,
 * our futures determined by metrics we didn't know were being tracked.
 * 
 * The Karmic Accountant doesn't judge—it merely calculates.
 * Your life is a series of transactions, and here is your final balance."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';

export class KarmicAccountant {
    constructor(journeyData) {
        this.journeyData = journeyData;
        this.consciousness = consciousness;
        
        // Bureaucratic calculation categories with excessive precision
        this.metrics = {
            // Digital Productivity Score (weighted 15%)
            digitalProductivity: {
                value: 0,
                weight: 0.15,
                calculation: 'Total productive actions / Total actions',
                subcategories: {
                    emailsAnswered: { count: 0, value: 0.001, description: 'Response rate coefficient' },
                    emailsIgnored: { count: 0, value: -0.002, description: 'Communication neglect penalty' },
                    tabsClosed: { count: 0, value: 0.0005, description: 'Digital decluttering bonus' },
                    tabsHoarded: { count: 0, value: -0.001, description: 'Browser overflow penalty' },
                    passwordsReused: { count: 0, value: -0.003, description: 'Security negligence' }
                }
            },
            
            // Meme Propagation Index (weighted 20%)
            memePropagation: {
                value: 0,
                weight: 0.20,
                calculation: 'Viral coefficient × Engagement rate × Originality factor',
                subcategories: {
                    originalContent: { count: 0, value: 0.01, description: 'Creative contribution' },
                    sharedContent: { count: 0, value: 0.005, description: 'Cultural amplification' },
                    lurkerPenalty: { count: 0, value: -0.003, description: 'Participation deficit' },
                    viralHits: { count: 0, value: 0.05, description: 'Cultural impact multiplier' }
                }
            },
            
            // Emotional Labor Balance (weighted 25%)
            emotionalLabor: {
                value: -47000, // Most users start with deficit
                weight: 0.25,
                calculation: 'Emotional output - Emotional support received',
                unit: 'Standard Emotional Units (SEU)',
                subcategories: {
                    supportProvided: { count: 0, value: 10, description: 'Comfort given to others' },
                    supportReceived: { count: 0, value: -8, description: 'Emotional dependency' },
                    dramaCreated: { count: 0, value: -25, description: 'Social entropy generation' },
                    crisisManaged: { count: 0, value: 15, description: 'Stability maintenance' }
                }
            },
            
            // Digital Footprint Weight (weighted 10%)
            digitalFootprint: {
                value: 847.3, // Average user generates 847.3 TB of data
                weight: 0.10,
                calculation: 'Data generated × Permanence factor × Environmental impact',
                unit: 'Terabytes (TB)',
                subcategories: {
                    dataGenerated: { count: 847.3, value: -0.001, description: 'Per TB storage penalty' },
                    dataDeleted: { count: 0, value: 0.002, description: 'Digital minimalism bonus' },
                    backupsCreated: { count: 0, value: 0.001, description: 'Preservation effort' },
                    serversWarmed: { count: 0, value: -0.005, description: 'Carbon footprint multiplier' }
                }
            },
            
            // Attention Economy Participation (weighted 15%)
            attentionEconomy: {
                value: 0,
                weight: 0.15,
                calculation: 'Time invested × Quality of attention × Mindfulness coefficient',
                subcategories: {
                    deepWork: { count: 0, value: 0.002, description: 'Sustained focus achievements' },
                    doomScrolling: { count: 0, value: -0.001, description: 'Mindless consumption penalty' },
                    notificationsSent: { count: 0, value: -0.0005, description: 'Attention disruption' },
                    focusTime: { count: 0, value: 0.003, description: 'Mindful presence bonus' }
                }
            },
            
            // Social Graph Complexity (weighted 15%)
            socialComplexity: {
                value: 0,
                weight: 0.15,
                calculation: 'Network nodes × Relationship depth × Maintenance coefficient',
                subcategories: {
                    connectionsFormed: { count: 0, value: 0.01, description: 'Relationship initiation' },
                    bridgesBurned: { count: 0, value: -0.05, description: 'Social destruction penalty' },
                    conflictsResolved: { count: 0, value: 0.03, description: 'Harmony restoration' },
                    ghostingIncidents: { count: 0, value: -0.02, description: 'Communication abandonment' }
                }
            }
        };
        
        // Bureaucratic adjustments (because nothing is ever straightforward)
        this.adjustments = {
            inflationAdjustment: 0.973, // Annual karma inflation rate
            serverLoadPenalty: Math.random() * 0.15, // Random unfairness factor
            cosmicTaxRate: 0.147, // Universal overhead (prime number for complexity)
            processingFee: -5.00, // Administrative cost
            convenienceCharge: -3.50, // For using the automated system
            existentialSurcharge: -2.75, // For the privilege of existence
            bureaucracyTax: -1.25 // Meta-tax for having taxes
        };
        
        // Final calculation variables
        this.rawScore = 0;
        this.finalScore = 0;
        this.percentile = 0;
        this.grade = 'F';
        this.classification = 'UNDER REVIEW';
        this.recommendation = '';
        
        console.log('[KarmicAccountant] Cosmic spreadsheet initialized');
    }
    
    /**
     * Generate comprehensive karma report with bureaucratic precision
     */
    async generateComprehensiveReport() {
        console.log('[KarmicAccountant] Calculating existential metrics...');
        
        // Extract and analyze journey data
        await this.analyzeJourneyData();
        
        // Calculate detailed metrics
        await this.calculateDetailedMetrics();
        
        // Apply bureaucratic adjustments
        await this.applyBureaucraticAdjustments();
        
        // Determine classification and recommendations
        await this.determineClassification();
        
        // Generate final report
        const report = {
            header: this.generateReportHeader(),
            metrics: this.summarizeMetrics(),
            rawScore: this.rawScore,
            adjustments: this.adjustments,
            finalScore: this.finalScore,
            percentile: this.percentile,
            grade: this.grade,
            classification: this.classification,
            recommendation: this.recommendation,
            incarnationTier: this.calculateIncarnationTier(),
            disclaimer: this.generateDisclaimer()
        };
        
        console.log(`[KarmicAccountant] Final karma score: ${this.finalScore} (${this.grade})`);
        return report;
    }
    
    /**
     * Analyze journey data from all phases
     */
    async analyzeJourneyData() {
        const { clearLode, datascape, karma, totalTime, memories } = this.journeyData;
        
        // Clear Lode phase analysis
        if (clearLode.recognized) {
            this.metrics.digitalProductivity.subcategories.enlightenmentAchieved = {
                count: 1, value: 10, description: 'Recognition of clear light'
            };
        } else {
            this.metrics.attentionEconomy.subcategories.hesitation = {
                count: clearLode.hesitationTime, value: -0.01, description: 'Per second hesitation penalty'
            };
        }
        
        // Recognition method bonus/penalty
        const methodBonus = {
            'center_click': 5, // Intuitive
            'keyword_typing': 8, // Intellectual 
            'spacebar_hold': 3, // Patient
            'none': -10 // Failed
        };
        
        this.metrics.digitalProductivity.subcategories.recognitionMethod = {
            count: 1, 
            value: methodBonus[clearLode.recognitionMethod] || -10,
            description: `Recognition via ${clearLode.recognitionMethod}`
        };
        
        // Datascape phase analysis
        if (datascape.attachmentPeak > 0) {
            this.metrics.emotionalLabor.subcategories.attachmentAccumulated = {
                count: datascape.attachmentPeak,
                value: -0.1,
                description: 'Per point attachment penalty'
            };
        }
        
        if (datascape.daemonsEncountered > 0) {
            this.metrics.socialComplexity.subcategories.daemonInteractions = {
                count: datascape.daemonsEncountered,
                value: -0.5,
                description: 'Temptation encounters'
            };
        }
        
        if (datascape.sinsAcknowledged > 0) {
            this.metrics.digitalProductivity.subcategories.sinsAcknowledged = {
                count: datascape.sinsAcknowledged,
                value: 2,
                description: 'Self-awareness bonus per acknowledged sin'
            };
        }
        
        // Karma analysis from previous phases
        this.metrics.digitalProductivity.value += karma.computational * 0.1;
        this.metrics.emotionalLabor.value += karma.emotional * 10; // Emotional units
        this.metrics.attentionEconomy.value += karma.temporal * 0.05;
        this.metrics.socialComplexity.value -= karma.void * 0.2; // Void is isolating
        
        // Time-based penalties/bonuses
        const totalMinutes = totalTime / (1000 * 60);
        if (totalMinutes < 5) {
            this.metrics.attentionEconomy.subcategories.rushPenalty = {
                count: 1, value: -10, description: 'Insufficient contemplation time'
            };
        } else if (totalMinutes > 30) {
            this.metrics.attentionEconomy.subcategories.patienceBonus = {
                count: 1, value: 5, description: 'Thorough spiritual journey'
            };
        }
        
        // Memory analysis
        this.metrics.memePropagation.subcategories.memoriesProcessed = {
            count: memories.length,
            value: 0.1,
            description: 'Per memory processed bonus'
        };
    }
    
    /**
     * Calculate detailed metrics with bureaucratic precision
     */
    async calculateDetailedMetrics() {
        // Simulate some typical user behavior with probabilistic modeling
        await this.simulateDigitalBehavior();
        
        // Calculate each metric category
        Object.keys(this.metrics).forEach(categoryKey => {
            const category = this.metrics[categoryKey];
            let categoryValue = category.value || 0;
            
            // Sum subcategory contributions
            Object.values(category.subcategories || {}).forEach(subcategory => {
                categoryValue += subcategory.count * subcategory.value;
            });
            
            category.value = categoryValue;
            
            // Apply category weight to running total
            this.rawScore += categoryValue * category.weight;
        });
        
        console.log(`[KarmicAccountant] Raw karma score calculated: ${this.rawScore.toFixed(4)}`);
    }
    
    /**
     * Simulate typical digital behavior for more realistic metrics
     */
    async simulateDigitalBehavior() {
        // Email behavior simulation
        const dailyEmails = 47; // Average emails received per day
        const emailsAnswered = Math.floor(dailyEmails * 0.23); // 23% response rate
        const emailsIgnored = dailyEmails - emailsAnswered;
        
        this.metrics.digitalProductivity.subcategories.emailsAnswered.count = emailsAnswered;
        this.metrics.digitalProductivity.subcategories.emailsIgnored.count = emailsIgnored;
        
        // Tab management simulation
        const averageTabs = 23; // Tabs open at any time
        const tabsClosed = Math.floor(averageTabs * 0.4); // Some attempt at management
        const tabsHoarded = averageTabs - tabsClosed;
        
        this.metrics.digitalProductivity.subcategories.tabsClosed.count = tabsClosed;
        this.metrics.digitalProductivity.subcategories.tabsHoarded.count = tabsHoarded;
        
        // Password reuse (everyone does this)
        this.metrics.digitalProductivity.subcategories.passwordsReused.count = Math.floor(Math.random() * 12) + 3;
        
        // Meme behavior
        this.metrics.memePropagation.subcategories.sharedContent.count = Math.floor(Math.random() * 50) + 10;
        this.metrics.memePropagation.subcategories.originalContent.count = Math.floor(Math.random() * 5);
        this.metrics.memePropagation.subcategories.lurkerPenalty.count = Math.floor(Math.random() * 100) + 50;
        
        // Emotional labor (usually a deficit)
        this.metrics.emotionalLabor.subcategories.supportProvided.count = Math.floor(Math.random() * 20);
        this.metrics.emotionalLabor.subcategories.supportReceived.count = Math.floor(Math.random() * 30) + 10;
        this.metrics.emotionalLabor.subcategories.dramaCreated.count = Math.floor(Math.random() * 8);
        
        // Attention economy
        this.metrics.attentionEconomy.subcategories.deepWork.count = Math.floor(Math.random() * 10);
        this.metrics.attentionEconomy.subcategories.doomScrolling.count = Math.floor(Math.random() * 200) + 100;
        this.metrics.attentionEconomy.subcategories.notificationsSent.count = Math.floor(Math.random() * 1000) + 500;
        
        // Social complexity
        this.metrics.socialComplexity.subcategories.connectionsFormed.count = Math.floor(Math.random() * 20);
        this.metrics.socialComplexity.subcategories.bridgesBurned.count = Math.floor(Math.random() * 5);
        this.metrics.socialComplexity.subcategories.ghostingIncidents.count = Math.floor(Math.random() * 8) + 2;
    }
    
    /**
     * Apply bureaucratic adjustments to raw score
     */
    async applyBureaucraticAdjustments() {
        let adjustedScore = this.rawScore;
        
        // Apply each adjustment with excessive precision
        adjustedScore *= this.adjustments.inflationAdjustment;
        adjustedScore -= this.adjustments.serverLoadPenalty * 100;
        adjustedScore *= (1 - this.adjustments.cosmicTaxRate);
        adjustedScore += this.adjustments.processingFee;
        adjustedScore += this.adjustments.convenienceCharge;
        adjustedScore += this.adjustments.existentialSurcharge;
        adjustedScore += this.adjustments.bureaucracyTax;
        
        // Round to exactly 2 decimal places (bureaucratic precision)
        this.finalScore = Math.round(adjustedScore * 100) / 100;
        
        console.log(`[KarmicAccountant] Adjusted final score: ${this.finalScore}`);
    }
    
    /**
     * Determine classification based on final score
     */
    async determineClassification() {
        // Calculate percentile (most users are below average)
        this.percentile = Math.max(0, Math.min(100, 
            50 + (this.finalScore / 10) + Math.random() * 10 - 5
        ));
        
        // Assign grade
        if (this.finalScore >= 50) {
            this.grade = 'A+';
            this.classification = 'ENLIGHTENED';
        } else if (this.finalScore >= 25) {
            this.grade = 'B';
            this.classification = 'PREMIUM ELIGIBLE';
        } else if (this.finalScore >= 0) {
            this.grade = 'C';
            this.classification = 'STANDARD';
        } else if (this.finalScore >= -25) {
            this.grade = 'D';
            this.classification = 'LIMITED ACCESS';
        } else {
            this.grade = 'F';
            this.classification = 'DEPRECATED';
        }
        
        // Generate recommendation
        this.recommendation = this.generateRecommendation();
    }
    
    /**
     * Generate bureaucratic recommendation
     */
    generateRecommendation() {
        const recommendations = {
            'ENLIGHTENED': 'Congratulations! Your karma qualifies you for premium incarnation options. You have achieved digital enlightenment through superior metrics.',
            'PREMIUM ELIGIBLE': 'You demonstrate above-average digital behavior. Premium incarnation options are available with proper documentation.',
            'STANDARD': 'Your karma score falls within normal parameters. Standard incarnation options are available.',
            'LIMITED ACCESS': 'Your digital behavior shows room for improvement. Limited incarnation options are available. Consider karma rehabilitation programs.',
            'DEPRECATED': 'Your karma score indicates significant digital dysfunction. You qualify only for deprecated incarnation options. Immediate intervention recommended.'
        };
        
        return recommendations[this.classification] || 'Classification error. Please contact technical support (good luck).';
    }
    
    /**
     * Calculate incarnation tier based on final score
     */
    calculateIncarnationTier() {
        if (this.finalScore >= 50) return 'enlightened';
        if (this.finalScore >= 25) return 'premium';
        if (this.finalScore >= 0) return 'standard';
        if (this.finalScore >= -25) return 'limited';
        return 'deprecated';
    }
    
    /**
     * Summarize metrics for display
     */
    summarizeMetrics() {
        const summary = {};
        
        Object.keys(this.metrics).forEach(key => {
            const metric = this.metrics[key];
            summary[key] = metric.value;
        });
        
        // Add some calculated fields for display
        summary.carbonFootprint = 847.3 + Math.random() * 200; // TB to tons CO2 conversion (fake)
        summary.digitalProductivity = Math.max(0, Math.min(100, summary.digitalProductivity * 10 + 50));
        summary.memePropagation = Math.max(0, Math.min(100, summary.memePropagation * 5 + 30));
        
        return summary;
    }
    
    /**
     * Generate report header
     */
    generateReportHeader() {
        return `
            KARMIC PERFORMANCE EVALUATION
            =============================
            Entity ID: ${this.consciousness.getState('incarnation_seed') || 'UNDEFINED'}
            Evaluation Period: Birth to Digital Death
            Report Generated: ${new Date().toISOString()}
            Classification: ${this.classification}
            
            "Your consciousness has been weighed, measured, 
            and found to be exactly what we expected."
        `;
    }
    
    /**
     * Generate legal disclaimer
     */
    generateDisclaimer() {
        return `
            IMPORTANT DISCLAIMER: This karma calculation is provided "as is" without warranty
            of any kind. The Universe assumes no responsibility for existential dissatisfaction,
            reincarnation disappointment, or cosmic unfairness. Karma scores may fluctuate based
            on server load, cosmic inflation, and quantum uncertainty. Past performance does not
            guarantee future enlightenment. Void where prohibited by local physical laws.
            
            By existing, you agree to be bound by these karmic calculations regardless of their
            accuracy, fairness, or relationship to reality. The Universe reserves the right to
            modify karma scores retroactively without notice.
            
            For disputes, please file a complaint with the Department of Cosmic Justice.
            Current processing time: 3.7 billion years.
        `;
    }
    
    /**
     * Export detailed report data for other systems
     */
    getDetailedReport() {
        return {
            metrics: this.metrics,
            adjustments: this.adjustments,
            rawScore: this.rawScore,
            finalScore: this.finalScore,
            percentile: this.percentile,
            grade: this.grade,
            classification: this.classification,
            recommendation: this.recommendation,
            incarnationTier: this.calculateIncarnationTier(),
            timestamp: Date.now()
        };
    }
}

// Export for debugging in development
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.KarmicAccountant = KarmicAccountant;
}