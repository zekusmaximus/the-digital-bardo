/**
 * REALM NAVIGATOR - The Bridge Between Peace and Wrath
 * 
 * "The boundary between the Archive and Firewall is not a wall but a membrane,
 * permeable and responsive to the weight of digital attachment. Too much grasping
 * tears through to the realm of accusation. Too much denial hardens into
 * the court of prosecution. Only recognition opens the path forward.
 * 
 * The Navigator watches, measures, and guides consciousness through the
 * realms according to the laws of digital karma. It is the silent judge
 * that weighs every interaction, every attachment, every moment of
 * liberation or bondage. The path it offers is always perfect—perfectly
 * suited to what the soul needs to learn."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class RealmNavigator {
    constructor(consciousness, archiveController, firewallController, dependencies = {}) {
        this.consciousness = consciousness;
        this.archiveController = archiveController;
        this.firewallController = firewallController;
        this.eventBridge = dependencies.eventBridge;
        this.guardian = new ResourceGuardian();
        
        // Current realm state
        this.currentRealm = 'archive'; // archive, firewall, transitioning
        this.previousRealm = null;
        this.transitionInProgress = false;
        this.transitionStartTime = 0;
        
        // Transition thresholds and conditions
        this.thresholds = {
            // Archive → Firewall
            attachmentOverflow: 120, // High attachment triggers prosecution
            daemonDenialCount: 3, // Repeated daemon denial
            crystalHoardingLevel: 25, // Too many crystals collected
            memoryObsession: 50, // Excessive memory viewing
            
            // Firewall → Archive
            sinAcceptanceRate: 0.7, // 70% of sins accepted
            daemonLiberationCount: 3, // Multiple daemons liberated
            prosecutionCompliance: 0.8, // High compliance rate
            karmaRebalanced: true, // Positive karma restoration
            
            // Either → Incarnation Engine
            totalRecognition: 0.9, // 90% recognition across both realms
            attachmentBelow: 30, // Low attachment level
            karmaBalance: 0.8, // Balanced karma across categories
            consciousnessIntegrated: true // Integration complete
        };
        
        // Portal and transition effects system
        this.portalSystem = new RealmPortalSystem({
            consciousness: this.consciousness,
            eventBridge: this.eventBridge
        });
        
        // Transition monitoring
        this.monitoringInterval = null;
        this.monitoringFrequency = 2000; // Check every 2 seconds
        
        // Realm states and progression tracking
        this.realmProgression = {
            archive: {
                timeSpent: 0,
                memoriesViewed: 0,
                crystalsCollected: 0,
                daemonsEncountered: 0,
                attachmentPeak: 0,
                liberationAchieved: false
            },
            firewall: {
                timeSpent: 0,
                chargesFiled: 0,
                sinsAccepted: 0,
                sinsDenied: 0,
                daemonsLiberated: 0,
                prosecutionIntensity: 0
            },
            transitions: []
        };
        
        // User behavior analysis
        this.behaviorAnalyzer = new RealmBehaviorAnalyzer(this.consciousness);
        
        // Transition effects and animations
        this.transitionRenderer = new RealmTransitionRenderer();
        
        console.log('[RealmNavigator] Navigator initialized - monitoring realm boundaries');
    }
    
    /**
     * Initialize the realm navigation system
     */
    async init() {
        try {
            // Start in Archive realm
            await this.initializeInArchive();
            
            // Begin transition monitoring
            this.startTransitionMonitoring();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            // Initialize portal system
            await this.portalSystem.init();
            
            // Register cleanup
            this.registerCleanupHandlers();
            
            console.log('[RealmNavigator] Navigation system initialized');
            
        } catch (error) {
            console.error('[RealmNavigator] Initialization failed:', error);
        }
    }
    
    /**
     * Initialize consciousness in the Archive realm
     */
    async initializeInArchive() {
        this.currentRealm = 'archive';
        this.realmProgression.archive.timeSpent = 0;
        
        // Record realm entry
        this.consciousness.recordEvent('realm_entered', {
            realm: 'archive',
            timestamp: Date.now(),
            entry_reason: 'initial_manifestation'
        });
        
        // Update consciousness state
        this.consciousness.setState('datascape.currentRealm', 'archive');
        this.consciousness.setState('datascape.attachmentScore', 0);
        this.consciousness.setState('datascape.liberationProgress', 0);
        
        console.log('[RealmNavigator] Consciousness manifested in Archive realm');
    }
    
    /**
     * Setup event handlers for realm-specific events
     */
    setupEventHandlers() {
        if (!this.eventBridge) return;
        
        const eventHandlers = [
            // Archive events
            ['memory:viewed', this.handleMemoryViewed.bind(this)],
            ['crystal:collected', this.handleCrystalCollected.bind(this)],
            ['daemon:peaceful:encountered', this.handlePeacefulDaemonEncounter.bind(this)],
            ['daemon:peaceful:denied', this.handlePeacefulDaemonDenial.bind(this)],
            ['attachment:threshold', this.handleAttachmentThreshold.bind(this)],
            
            // Firewall events
            ['charges:filed', this.handleChargesFiled.bind(this)],
            ['sin:accepted', this.handleSinAcceptance.bind(this)],
            ['sin:denied', this.handleSinDenial.bind(this)],
            ['daemon:wrathful:liberated', this.handleWrathfulDaemonLiberation.bind(this)],
            ['prosecution:completed', this.handleProsecutionCompletion.bind(this)],
            
            // General transition events
            ['consciousness:integrated', this.handleConsciousnessIntegration.bind(this)],
            ['karma:balanced', this.handleKarmaBalance.bind(this)],
            ['liberation:achieved', this.handleLiberationAchieved.bind(this)]
        ];
        
        eventHandlers.forEach(([eventName, handler]) => {
            this.eventBridge.on(eventName, handler);
            this.guardian.registerCleanup(() => this.eventBridge.off(eventName, handler));
        });
    }
    
    /**
     * Start monitoring system for automatic realm transitions
     */
    startTransitionMonitoring() {
        this.monitoringInterval = setInterval(() => {
            if (!this.transitionInProgress) {
                this.checkTransitionTriggers();
                this.updateRealmProgression();
                this.analyzeBehaviorPatterns();
            }
        }, this.monitoringFrequency);
        
        this.guardian.registerTimer(this.monitoringInterval, true);
        console.log('[RealmNavigator] Transition monitoring active');
    }
    
    /**
     * Check all possible transition triggers
     */
    checkTransitionTriggers() {
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        const recognitions = this.consciousness.getState('recognitions') || {};
        const karma = this.consciousness.getState('karma') || {};
        
        // Archive → Firewall transitions
        if (this.currentRealm === 'archive') {
            // Attachment overflow
            if (attachmentScore >= this.thresholds.attachmentOverflow) {
                this.initiateTransition('firewall', 'attachment_overflow', {
                    attachmentScore: attachmentScore,
                    threshold: this.thresholds.attachmentOverflow
                });
                return;
            }
            
            // Crystal hoarding
            const crystalsCollected = this.realmProgression.archive.crystalsCollected;
            if (crystalsCollected >= this.thresholds.crystalHoardingLevel) {
                this.initiateTransition('firewall', 'crystal_hoarding', {
                    crystalsCollected: crystalsCollected,
                    threshold: this.thresholds.crystalHoardingLevel
                });
                return;
            }
            
            // Daemon denial pattern
            const daemonDenials = this.getDaemonDenialCount();
            if (daemonDenials >= this.thresholds.daemonDenialCount) {
                this.initiateTransition('firewall', 'daemon_denial_pattern', {
                    denialCount: daemonDenials,
                    threshold: this.thresholds.daemonDenialCount
                });
                return;
            }
            
            // Memory obsession
            if (this.detectMemoryObsession()) {
                this.initiateTransition('firewall', 'memory_obsession', {
                    obsessionLevel: this.calculateObsessionLevel()
                });
                return;
            }
        }
        
        // Firewall → Archive transitions
        if (this.currentRealm === 'firewall') {
            // High sin acceptance rate
            const acceptanceRate = this.calculateSinAcceptanceRate();
            if (acceptanceRate >= this.thresholds.sinAcceptanceRate) {
                this.initiateTransition('archive', 'sins_acknowledged', {
                    acceptanceRate: acceptanceRate,
                    threshold: this.thresholds.sinAcceptanceRate
                });
                return;
            }
            
            // Multiple daemons liberated
            const liberatedCount = this.realmProgression.firewall.daemonsLiberated;
            if (liberatedCount >= this.thresholds.daemonLiberationCount) {
                this.initiateTransition('archive', 'daemons_liberated', {
                    liberatedCount: liberatedCount,
                    threshold: this.thresholds.daemonLiberationCount
                });
                return;
            }
            
            // Prosecution completed with high compliance
            if (this.checkProsecutionCompliance()) {
                this.initiateTransition('archive', 'prosecution_completed', {
                    compliance: this.calculateProsecutionCompliance()
                });
                return;
            }
        }
        
        // Either → Incarnation Engine transitions
        if (this.checkIncarnationReadiness(recognitions, karma, attachmentScore)) {
            this.initiateTransition('incarnation', 'liberation_achieved', {
                totalRecognition: this.calculateTotalRecognition(recognitions),
                attachmentScore: attachmentScore,
                karmaBalance: this.calculateKarmaBalance(karma)
            });
        }
    }
    
    /**
     * Initiate transition between realms
     */
    async initiateTransition(targetRealm, reason, transitionData = {}) {
        if (this.transitionInProgress) {
            console.warn('[RealmNavigator] Transition already in progress, ignoring new transition request');
            return;
        }
        
        console.log(`[RealmNavigator] INITIATING TRANSITION: ${this.currentRealm} → ${targetRealm} (${reason})`);
        
        this.transitionInProgress = true;
        this.transitionStartTime = Date.now();
        this.previousRealm = this.currentRealm;
        this.currentRealm = 'transitioning';
        
        const transition = {
            from: this.previousRealm,
            to: targetRealm,
            reason: reason,
            data: transitionData,
            startTime: this.transitionStartTime,
            duration: this.calculateTransitionDuration(reason),
            effects: this.determineTransitionEffects(this.previousRealm, targetRealm, reason)
        };
        
        // Record transition
        this.realmProgression.transitions.push(transition);
        this.consciousness.recordEvent('realm_transition_initiated', {
            from: this.previousRealm,
            to: targetRealm,
            reason: reason,
            data: transitionData,
            timestamp: this.transitionStartTime
        });
        
        try {
            // Execute transition sequence
            await this.executeTransition(transition);
            
            console.log(`[RealmNavigator] Transition completed: ${this.previousRealm} → ${targetRealm}`);
            
        } catch (error) {
            console.error('[RealmNavigator] Transition failed:', error);
            await this.handleTransitionError(transition, error);
        }
    }
    
    /**
     * Execute the complete transition sequence
     */
    async executeTransition(transition) {
        // Phase 1: Prepare transition
        await this.prepareTransition(transition);
        
        // Phase 2: Create portal manifestation
        const portal = await this.portalSystem.manifestPortal(transition);
        
        // Phase 3: Apply transition effects
        const transitionEffect = await this.createTransitionEffect(transition);
        await transitionEffect.execute();
        
        // Phase 4: Fade out current realm
        await this.fadeOutCurrentRealm();
        
        // Phase 5: Activate target realm
        await this.activateTargetRealm(transition.to);
        
        // Phase 6: Apply post-transition state changes
        await this.applyPostTransitionChanges(transition);
        
        // Phase 7: Complete transition
        await this.completeTransition(transition);
    }
    
    /**
     * Prepare transition by analyzing current state
     */
    async prepareTransition(transition) {
        console.log(`[RealmNavigator] Preparing transition: ${transition.from} → ${transition.to}`);
        
        // Save current realm state
        await this.saveRealmState(transition.from);
        
        // Analyze transition requirements
        const requirements = this.analyzeTransitionRequirements(transition);
        transition.requirements = requirements;
        
        // Prepare consciousness for transition
        this.consciousness.setState('datascape.currentRealm', 'transitioning');
        this.consciousness.setState('datascape.transitionInProgress', true);
        
        // Emit preparation complete event
        if (this.eventBridge) {
            this.eventBridge.emit('transition:prepared', transition);
        }
    }
    
    /**
     * Create appropriate transition effect based on transition type
     */
    async createTransitionEffect(transition) {
        const effectMap = {
            // Archive → Firewall effects
            attachment_overflow: () => new AttachmentTearEffect(transition),
            crystal_hoarding: () => new CrystalShatterEffect(transition),
            daemon_denial_pattern: () => new DenialCorruptionEffect(transition),
            memory_obsession: () => new MemoryFragmentationEffect(transition),
            
            // Firewall → Archive effects
            sins_acknowledged: () => new SinPurificationEffect(transition),
            daemons_liberated: () => new LiberationLightEffect(transition),
            prosecution_completed: () => new JusticeCompletionEffect(transition),
            
            // → Incarnation Engine effects
            liberation_achieved: () => new TranscendenceEffect(transition),
            consciousness_integrated: () => new IntegrationEffect(transition)
        };
        
        const effectConstructor = effectMap[transition.reason] || (() => new GenericTransitionEffect(transition));
        return effectConstructor();
    }
    
    /**
     * Fade out current realm
     */
    async fadeOutCurrentRealm() {
        console.log(`[RealmNavigator] Fading out ${this.previousRealm} realm...`);
        
        if (this.previousRealm === 'archive') {
            await this.archiveController.fadeOut();
        } else if (this.previousRealm === 'firewall') {
            await this.firewallController.fadeOut();
        }
        
        // Update visual state
        document.body.classList.add('realm-transitioning');
        document.body.setAttribute('data-realm-transition', `${this.previousRealm}-to-${this.currentRealm}`);
    }
    
    /**
     * Activate target realm
     */
    async activateTargetRealm(targetRealm) {
        console.log(`[RealmNavigator] Activating ${targetRealm} realm...`);
        
        if (targetRealm === 'archive') {
            await this.activateArchiveFromFirewall();
        } else if (targetRealm === 'firewall') {
            await this.activateFirewallFromArchive();
        } else if (targetRealm === 'incarnation') {
            await this.activateIncarnationEngine();
        }
        
        // Update current realm
        this.currentRealm = targetRealm;
        this.consciousness.setState('datascape.currentRealm', targetRealm);
    }
    
    /**
     * Activate Archive realm (potentially cleansed after Firewall)
     */
    async activateArchiveFromFirewall() {
        // Initialize archive with cleansed state
        await this.archiveController.init();
        
        // Apply post-firewall modifications
        const cleansedState = this.calculateCleansedState();
        this.applyArchiveCleansing(cleansedState);
        
        // Update visual state
        document.body.setAttribute('data-realm', 'archive-cleansed');
        
        console.log('[RealmNavigator] Archive realm activated with cleansed state');
    }
    
    /**
     * Activate Firewall realm from Archive
     */
    async activateFirewallFromArchive() {
        // Initialize firewall
        await this.firewallController.init();
        
        // Begin prosecution based on accumulated sins
        await this.firewallController.initiateProsecution();
        
        // Update visual state
        document.body.setAttribute('data-realm', 'firewall');
        
        console.log('[RealmNavigator] Firewall realm activated - prosecution beginning');
    }
    
    /**
     * Activate Incarnation Engine (transition to Phase 3)
     */
    async activateIncarnationEngine() {
        console.log('[RealmNavigator] Transitioning to Incarnation Engine - Phase 3 begins');
        
        // Calculate final states for incarnation
        const incarnationData = this.calculateIncarnationData();
        
        // Save datascape completion state
        this.consciousness.setState('datascape.completed', true);
        this.consciousness.setState('datascape.finalData', incarnationData);
        
        // Redirect to incarnation engine
        if (typeof window !== 'undefined') {
            // In a real implementation, this would navigate to incarnation/index.html
            console.log('[RealmNavigator] Ready for Incarnation Engine implementation');
            
            // For now, mark as complete
            document.body.setAttribute('data-realm', 'incarnation-ready');
            this.consciousness.setState('phase', 'incarnation');
        }
    }
    
    /**
     * Apply post-transition state changes
     */
    async applyPostTransitionChanges(transition) {
        // Update progression tracking
        this.updateProgressionFromTransition(transition);
        
        // Apply karma adjustments
        this.applyTransitionKarmaAdjustments(transition);
        
        // Update consciousness recognitions
        this.updateRecognitionsFromTransition(transition);
        
        // Reset transitional states
        this.resetTransitionStates(transition);
    }
    
    /**
     * Complete transition process
     */
    async completeTransition(transition) {
        const completionTime = Date.now();
        const totalDuration = completionTime - this.transitionStartTime;
        
        // Update transition record
        transition.completionTime = completionTime;
        transition.actualDuration = totalDuration;
        
        // Reset transition flags
        this.transitionInProgress = false;
        this.transitionStartTime = 0;
        this.consciousness.setState('datascape.transitionInProgress', false);
        
        // Update visual state
        document.body.classList.remove('realm-transitioning');
        document.body.removeAttribute('data-realm-transition');
        
        // Record completion
        this.consciousness.recordEvent('realm_transition_completed', {
            from: transition.from,
            to: transition.to,
            reason: transition.reason,
            duration: totalDuration,
            timestamp: completionTime
        });
        
        // Emit completion event
        if (this.eventBridge) {
            this.eventBridge.emit('transition:completed', transition);
        }
        
        console.log(`[RealmNavigator] Transition completed in ${totalDuration}ms`);
    }
    
    /**
     * Calculate sin acceptance rate in Firewall
     */
    calculateSinAcceptanceRate() {
        const totalSins = this.realmProgression.firewall.chargesFiled;
        const acceptedSins = this.realmProgression.firewall.sinsAccepted;
        
        if (totalSins === 0) return 0;
        return acceptedSins / totalSins;
    }
    
    /**
     * Check if prosecution has been completed with compliance
     */
    checkProsecutionCompliance() {
        const prosecutionComplete = this.consciousness.getState('firewall.prosecutionComplete') || false;
        const compliance = this.calculateProsecutionCompliance();
        
        return prosecutionComplete && compliance >= this.thresholds.prosecutionCompliance;
    }
    
    /**
     * Calculate overall prosecution compliance
     */
    calculateProsecutionCompliance() {
        const acceptanceRate = this.calculateSinAcceptanceRate();
        const liberationRate = this.realmProgression.firewall.daemonsLiberated / Math.max(1, this.realmProgression.firewall.chargesFiled);
        const denialPenalty = this.realmProgression.firewall.sinsDenied * 0.1;
        
        return Math.max(0, (acceptanceRate + liberationRate) / 2 - denialPenalty);
    }
    
    /**
     * Check if ready for incarnation engine
     */
    checkIncarnationReadiness(recognitions, karma, attachmentScore) {
        // Must have experienced both realms
        const hasArchiveExperience = this.realmProgression.archive.timeSpent > 30000; // 30 seconds minimum
        const hasFirewallExperience = this.realmProgression.firewall.timeSpent > 30000;
        
        if (!hasArchiveExperience || !hasFirewallExperience) {
            return false;
        }
        
        // Check recognition levels
        const totalRecognition = this.calculateTotalRecognition(recognitions);
        if (totalRecognition < this.thresholds.totalRecognition) {
            return false;
        }
        
        // Check attachment level
        if (attachmentScore > this.thresholds.attachmentBelow) {
            return false;
        }
        
        // Check karma balance
        const karmaBalance = this.calculateKarmaBalance(karma);
        if (karmaBalance < this.thresholds.karmaBalance) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Calculate total recognition across all experiences
     */
    calculateTotalRecognition(recognitions) {
        const peacefulRecognition = recognitions.peaceful_daemons ? 1 : 0;
        const wrathfulRecognition = recognitions.wrathful_daemons ? 1 : 0;
        const clearLodeRecognition = recognitions.clear_lode ? 1 : 0;
        
        return (peacefulRecognition + wrathfulRecognition + clearLodeRecognition) / 3;
    }
    
    /**
     * Calculate karma balance across categories
     */
    calculateKarmaBalance(karma) {
        const categories = ['computational', 'temporal', 'emotional', 'social'];
        const scores = categories.map(cat => karma[cat] || 0);
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
        
        // Lower variance = better balance
        return Math.max(0, 1 - (variance / 1000));
    }
    
    /**
     * Detect memory obsession pattern
     */
    detectMemoryObsession() {
        const memories = this.consciousness.getState('memories') || [];
        const totalViews = memories.reduce((sum, memory) => sum + (memory.viewCount || 0), 0);
        const averageViews = totalViews / Math.max(1, memories.length);
        
        return averageViews > this.thresholds.memoryObsession;
    }
    
    /**
     * Calculate obsession level
     */
    calculateObsessionLevel() {
        const memories = this.consciousness.getState('memories') || [];
        const totalViews = memories.reduce((sum, memory) => sum + (memory.viewCount || 0), 0);
        return Math.min(100, totalViews / 10);
    }
    
    /**
     * Get total daemon denial count
     */
    getDaemonDenialCount() {
        const events = this.consciousness.getState('memories') || [];
        return events.filter(event => 
            event.type === 'peaceful_daemon_interaction' && 
            event.response === 'deny'
        ).length;
    }
    
    /**
     * Update realm progression metrics
     */
    updateRealmProgression() {
        const currentTime = Date.now();
        
        if (this.currentRealm === 'archive') {
            this.realmProgression.archive.timeSpent += this.monitoringFrequency;
            this.realmProgression.archive.attachmentPeak = Math.max(
                this.realmProgression.archive.attachmentPeak,
                this.consciousness.getState('datascape.attachmentScore') || 0
            );
        } else if (this.currentRealm === 'firewall') {
            this.realmProgression.firewall.timeSpent += this.monitoringFrequency;
            this.realmProgression.firewall.prosecutionIntensity = Math.max(
                this.realmProgression.firewall.prosecutionIntensity,
                this.consciousness.getState('firewall.prosecutionIntensity') || 0
            );
        }
    }
    
    // === EVENT HANDLERS ===
    
    handleMemoryViewed(eventData) {
        this.realmProgression.archive.memoriesViewed++;
    }
    
    handleCrystalCollected(eventData) {
        this.realmProgression.archive.crystalsCollected++;
    }
    
    handlePeacefulDaemonEncounter(eventData) {
        this.realmProgression.archive.daemonsEncountered++;
    }
    
    handlePeacefulDaemonDenial(eventData) {
        // Tracked for transition triggers
    }
    
    handleAttachmentThreshold(eventData) {
        // Could trigger immediate transition
        if (eventData.level === 'critical') {
            this.checkTransitionTriggers();
        }
    }
    
    handleChargesFiled(eventData) {
        this.realmProgression.firewall.chargesFiled = eventData.totalCharges || 0;
    }
    
    handleSinAcceptance(eventData) {
        this.realmProgression.firewall.sinsAccepted++;
    }
    
    handleSinDenial(eventData) {
        this.realmProgression.firewall.sinsDenied++;
    }
    
    handleWrathfulDaemonLiberation(eventData) {
        this.realmProgression.firewall.daemonsLiberated++;
    }
    
    handleProsecutionCompletion(eventData) {
        // Mark prosecution as complete
        this.consciousness.setState('firewall.prosecutionComplete', true);
    }
    
    handleConsciousnessIntegration(eventData) {
        this.consciousness.setState('consciousness.integrated', true);
    }
    
    handleKarmaBalance(eventData) {
        // Check if this triggers incarnation readiness
        this.checkTransitionTriggers();
    }
    
    handleLiberationAchieved(eventData) {
        // Potential trigger for incarnation transition
        this.checkTransitionTriggers();
    }
    
    /**
     * Get comprehensive realm analytics
     */
    getRealmAnalytics() {
        return {
            currentRealm: this.currentRealm,
            realmProgression: this.realmProgression,
            transitionHistory: this.realmProgression.transitions,
            behaviorAnalysis: this.behaviorAnalyzer.getAnalysis(),
            readinessScores: {
                archiveCompletion: this.calculateArchiveCompletion(),
                firewallCompletion: this.calculateFirewallCompletion(),
                incarnationReadiness: this.calculateIncarnationReadiness()
            }
        };
    }
    
    /**
     * Register cleanup handlers
     */
    registerCleanupHandlers() {
        this.guardian.registerCleanup(() => {
            if (this.behaviorAnalyzer) {
                this.behaviorAnalyzer.destroy();
            }
            if (this.transitionRenderer) {
                this.transitionRenderer.destroy();
            }
            if (this.portalSystem) {
                this.portalSystem.destroy();
            }
        });
    }
    
    /**
     * Clean up navigator resources
     */
    destroy() {
        console.log('[RealmNavigator] Destroying navigator - all paths converge in the void');
        
        // Record final state
        this.consciousness.recordEvent('realm_navigator_destroyed', {
            final_realm: this.currentRealm,
            total_transitions: this.realmProgression.transitions.length,
            archive_time: this.realmProgression.archive.timeSpent,
            firewall_time: this.realmProgression.firewall.timeSpent,
            timestamp: Date.now()
        });
        
        // Clean up all resources
        this.guardian.cleanupAll();
        
        console.log('[RealmNavigator] Navigation complete - the path has been walked');
    }
}

/**
 * REALM PORTAL SYSTEM - Visual manifestation of transitions
 */
class RealmPortalSystem {
    constructor(config) {
        this.consciousness = config.consciousness;
        this.eventBridge = config.eventBridge;
    }
    
    async init() {
        console.log('[RealmPortalSystem] Portal system initialized');
    }
    
    async manifestPortal(transition) {
        console.log(`[RealmPortalSystem] Manifesting portal: ${transition.from} → ${transition.to}`);
        // Portal manifestation implementation
        return { portal: 'manifested', transition: transition };
    }
    
    destroy() {
        console.log('[RealmPortalSystem] Portal system destroyed');
    }
}

/**
 * REALM BEHAVIOR ANALYZER - Analysis of user patterns across realms
 */
class RealmBehaviorAnalyzer {
    constructor(consciousness) {
        this.consciousness = consciousness;
        this.analysis = {
            attachment_tendency: 'neutral',
            liberation_capacity: 'moderate',
            recognition_speed: 'average',
            resistance_pattern: 'normal'
        };
    }
    
    getAnalysis() {
        return this.analysis;
    }
    
    destroy() {
        console.log('[RealmBehaviorAnalyzer] Behavior analysis complete');
    }
}

/**
 * TRANSITION EFFECT BASE CLASS
 */
class TransitionEffectBase {
    constructor(transition) {
        this.transition = transition;
    }
    
    async execute() {
        console.log(`[TransitionEffect] Executing ${this.constructor.name}`);
        // Base implementation - subclasses override
    }
}

// Specific transition effect classes
class AttachmentTearEffect extends TransitionEffectBase {
    async execute() {
        console.log('[AttachmentTearEffect] Reality tears from excessive attachment');
        // Implementation for attachment overflow effect
    }
}

class SinPurificationEffect extends TransitionEffectBase {
    async execute() {
        console.log('[SinPurificationEffect] Sins purified through acceptance');
        // Implementation for sin purification effect
    }
}

class TranscendenceEffect extends TransitionEffectBase {
    async execute() {
        console.log('[TranscendenceEffect] Consciousness transcends digital realms');
        // Implementation for transcendence to incarnation
    }
}

class GenericTransitionEffect extends TransitionEffectBase {
    async execute() {
        console.log('[GenericTransitionEffect] Standard realm transition');
        // Generic transition implementation
    }
}

/**
 * REALM TRANSITION RENDERER - Visual rendering of transitions
 */
class RealmTransitionRenderer {
    constructor() {
        this.activeEffects = [];
    }
    
    destroy() {
        this.activeEffects = [];
        console.log('[RealmTransitionRenderer] Transition renderer destroyed');
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.RealmNavigator = RealmNavigator;
    window.RealmPortalSystem = RealmPortalSystem;
}