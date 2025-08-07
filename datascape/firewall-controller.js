/**
 * THE FIREWALL CONTROLLER - Orchestrator of Digital Sin Prosecution
 * 
 * "Here, in the server room of judgment, every git commit comes back to haunt you.
 * Every unread notification becomes an accusation. Every abandoned project 
 * manifests as a daemon of negligence. The System Auditor presides over all,
 * reading your sins from an infinite scroll of dense legalese.
 * 
 * The Firewall is not a place of punishment, but of recognition. Each daemon
 * is a mirror, each accusation a teacher, each denial a deeper entrapment.
 * Liberation comes not through combat but through acceptance—the hardest battle
 * of all is the one against your own resistance to truth."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { DigitalSinRegistry } from './digital-sin-registry.js';
import { SystemAuditorEntity } from './system-auditor.js';
import { WrathfulDaemon } from './wrathful-daemon.js';

export class FirewallController {
    constructor(dependencies = {}) {
        this.consciousness = dependencies.consciousness || consciousness;
        this.eventBridge = dependencies.eventBridge;
        this.corruptionRenderer = dependencies.corruptionRenderer;
        this.guardian = new ResourceGuardian();
        
        // Core systems
        this.sinRegistry = new DigitalSinRegistry(this.consciousness);
        this.systemAuditor = new SystemAuditorEntity({
            consciousness: this.consciousness,
            eventBridge: this.eventBridge
        });
        
        // Daemon management
        this.wrathfulDaemons = new Map(); // Active daemon pool
        this.maxDaemons = 8;
        this.daemonSpawnRate = 3000; // 3 seconds between spawns
        
        // Prosecution state
        this.prosecutionPhase = 'dormant'; // dormant, charges_filed, trial_active, verdict_pending
        this.prosecutionIntensity = 0;
        this.userDenialLevel = 0;
        this.totalCharges = 0;
        this.acceptedCharges = 0;
        
        // Visual corruption system
        this.corruptionLevel = 0;
        this.glitchShaderSystem = new GlitchShaderSystem();
        this.realityStability = 1.0;
        
        // Audio system for aggressive soundscape
        this.audioEngine = new FirewallAudioEngine();
        
        // Session data
        this.sessionStartTime = 0;
        this.currentCase = null;
        this.compiledSins = [];
        
        // Performance monitoring
        this.performanceMetrics = {
            daemonsManifested: 0,
            averageConfrontationTime: 0,
            denialToAcceptanceRatio: 0
        };
        
        console.log('[FirewallController] Firewall initialized - sin prosecution system ready');
    }
    
    /**
     * Initialize the Firewall prosecution system
     */
    async init() {
        try {
            console.log('[FirewallController] Initializing Firewall prosecution system...');
            
            // Setup visual environment
            await this.initializeFirewallEnvironment();
            
            // Initialize audio landscape
            await this.initializeAudioSystem();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            // Initialize subsystems
            await this.initializeSubsystems();
            
            // Prepare sin compilation
            await this.prepareProsecution();
            
            console.log('[FirewallController] Firewall initialization complete');
            
        } catch (error) {
            console.error('[FirewallController] Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }
    
    /**
     * Setup the visual environment for the Firewall
     */
    async initializeFirewallEnvironment() {
        // Create Firewall container
        this.firewallContainer = document.createElement('div');
        this.firewallContainer.className = 'firewall-container';
        this.firewallContainer.innerHTML = `
            <div class="firewall-atmosphere">
                <div class="prosecution-chamber">
                    <div class="system-auditor-manifestation"></div>
                    <div class="charge-sheet-display"></div>
                    <div class="daemon-courtroom"></div>
                </div>
                <div class="corruption-overlay"></div>
                <div class="prosecution-ui">
                    <div class="prosecution-meter">
                        <span class="meter-label">Prosecution Intensity</span>
                        <div class="intensity-bar">
                            <div class="intensity-level"></div>
                        </div>
                        <span class="intensity-value">0%</span>
                    </div>
                    <div class="denial-counter">
                        <span class="counter-label">Denials</span>
                        <span class="denial-count">0</span>
                    </div>
                    <div class="acceptance-progress">
                        <span class="progress-label">Liberation</span>
                        <div class="progress-bar">
                            <div class="progress-level"></div>
                        </div>
                        <span class="progress-value">0%</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.firewallContainer);
        this.guardian.registerCleanup(() => {
            if (this.firewallContainer && this.firewallContainer.parentNode) {
                this.firewallContainer.parentNode.removeChild(this.firewallContainer);
            }
        });
        
        // Apply initial visual state
        this.applyFirewallStyling();
    }
    
    /**
     * Apply Firewall-specific visual styling
     */
    applyFirewallStyling() {
        document.body.classList.add('firewall-active');
        document.body.setAttribute('data-realm', 'firewall');
        document.body.setAttribute('data-prosecution-phase', this.prosecutionPhase);
        
        // Setup CSS custom properties for dynamic theming
        const root = document.documentElement;
        root.style.setProperty('--firewall-corruption-level', this.corruptionLevel);
        root.style.setProperty('--firewall-prosecution-intensity', this.prosecutionIntensity);
        root.style.setProperty('--firewall-reality-stability', this.realityStability);
        root.style.setProperty('--firewall-denial-level', this.userDenialLevel / 10);
    }
    
    /**
     * Initialize audio system for Firewall
     */
    async initializeAudioSystem() {
        try {
            await this.audioEngine.init();
            await this.audioEngine.loadFirewallSounds();
            this.guardian.registerCleanup(() => this.audioEngine.destroy());
            
            console.log('[FirewallController] Audio system initialized');
        } catch (error) {
            console.warn('[FirewallController] Audio initialization failed:', error);
        }
    }
    
    /**
     * Setup event handlers for Firewall interactions
     */
    setupEventHandlers() {
        if (!this.eventBridge) return;
        
        const eventHandlers = [
            ['sin:compiled', this.handleSinsCompiled.bind(this)],
            ['charges:filed', this.handleChargesFiled.bind(this)],
            ['defendant:response', this.handleDefendantResponse.bind(this)],
            ['daemon:manifested', this.handleDaemonManifested.bind(this)],
            ['daemon:confronted', this.handleDaemonConfronted.bind(this)],
            ['daemon:liberated', this.handleDaemonLiberated.bind(this)],
            ['prosecution:escalated', this.handleProsecutionEscalated.bind(this)],
            ['corruption:increased', this.handleCorruptionIncrease.bind(this)],
            ['firewall:transition', this.handleFirewallTransition.bind(this)]
        ];
        
        eventHandlers.forEach(([eventName, handler]) => {
            this.eventBridge.on(eventName, handler);
            this.guardian.registerCleanup(() => this.eventBridge.off(eventName, handler));
        });
    }
    
    /**
     * Initialize subsystems
     */
    async initializeSubsystems() {
        // Initialize corruption renderer
        if (this.corruptionRenderer) {
            await this.corruptionRenderer.init();
            this.guardian.registerCleanup(() => this.corruptionRenderer.destroy());
        }
        
        // Initialize glitch shader system
        this.glitchShaderSystem.init();
        this.guardian.registerCleanup(() => this.glitchShaderSystem.destroy());
        
        // Setup daemon courtroom (Three.js scene)
        this.setupDaemonCourtroom();
    }
    
    /**
     * Setup Three.js scene for daemon manifestations
     */
    setupDaemonCourtroom() {
        if (typeof THREE === 'undefined') {
            console.warn('[FirewallController] THREE.js not available for daemon visualization');
            return;
        }
        
        // Create scene for daemon manifestations
        this.daemonScene = new THREE.Scene();
        this.daemonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.daemonRenderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        
        this.daemonRenderer.setSize(window.innerWidth, window.innerHeight);
        this.daemonRenderer.setClearColor(0x000000, 0);
        
        // Append renderer to daemon courtroom
        const daemonCourtroom = this.firewallContainer.querySelector('.daemon-courtroom');
        if (daemonCourtroom) {
            daemonCourtroom.appendChild(this.daemonRenderer.domElement);
        }
        
        // Setup camera
        this.daemonCamera.position.z = 5;
        
        // Setup lighting for ominous atmosphere
        const prosecutionLight = new THREE.DirectionalLight(0xff0000, 0.8);
        prosecutionLight.position.set(-5, 5, 5);
        this.daemonScene.add(prosecutionLight);
        
        const ambientMenace = new THREE.AmbientLight(0x330000, 0.3);
        this.daemonScene.add(ambientMenace);
        
        // Start render loop
        this.startDaemonRenderLoop();
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            if (this.daemonRenderer) {
                this.daemonRenderer.dispose();
            }
        });
        
        // Make scene globally accessible for daemons
        window.daemonScene = this.daemonScene;
        window.daemonController = this;
    }
    
    /**
     * Start render loop for daemon visualization
     */
    startDaemonRenderLoop() {
        const animate = () => {
            if (!this.daemonRenderer || !this.daemonScene) return;
            
            // Update all active daemons
            const deltaTime = 0.016; // Approximate 60fps
            this.wrathfulDaemons.forEach(daemon => {
                if (daemon.update) {
                    daemon.update(deltaTime);
                }
            });
            
            // Render scene
            this.daemonRenderer.render(this.daemonScene, this.daemonCamera);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Prepare for sin prosecution
     */
    async prepareProsecution() {
        console.log('[FirewallController] Preparing sin prosecution...');
        
        this.sessionStartTime = Date.now();
        this.prosecutionPhase = 'preparing';
        
        // Record entry into Firewall
        this.consciousness.recordEvent('firewall_entered', {
            timestamp: this.sessionStartTime,
            entry_reason: 'attachment_threshold_exceeded',
            consciousness_state: this.consciousness.getState()
        });
        
        console.log('[FirewallController] Prosecution preparation complete');
    }
    
    /**
     * Initiate formal sin prosecution
     * This is where the trial begins
     */
    async initiateProsecution() {
        console.log('[FirewallController] INITIATING FORMAL PROSECUTION...');
        
        try {
            this.prosecutionPhase = 'compiling_sins';
            
            // Compile all digital sins
            console.log('[FirewallController] Compiling digital sins...');
            this.compiledSins = await this.sinRegistry.compileSins();
            this.totalCharges = this.compiledSins.length;
            
            if (this.compiledSins.length === 0) {
                console.log('[FirewallController] No prosecutable sins found - unusual case');
                return this.handleInnocentConsciousness();
            }
            
            this.prosecutionPhase = 'filing_charges';
            
            // Present formal charges through System Auditor
            console.log('[FirewallController] Filing formal charges...');
            const prosecutionResult = await this.systemAuditor.presentCharges(this.compiledSins, this.consciousness);
            this.currentCase = prosecutionResult.case;
            
            this.prosecutionPhase = 'trial_active';
            
            // Begin daemon manifestation sequence
            console.log('[FirewallController] Beginning daemon manifestation...');
            await this.beginDaemonManifestation();
            
            // Start prosecution intensity monitoring
            this.startProsecutionMonitoring();
            
            // Initialize audio prosecution
            this.audioEngine.beginProsecutionSoundscape();
            
            // Update visual state
            this.updateProsecutionUI();
            
            console.log(`[FirewallController] Formal prosecution initiated - ${this.totalCharges} charges filed`);
            
            return prosecutionResult;
            
        } catch (error) {
            console.error('[FirewallController] Prosecution initiation failed:', error);
            this.handleProsecutionError(error);
        }
    }
    
    /**
     * Begin daemon manifestation sequence
     */
    async beginDaemonManifestation() {
        console.log('[FirewallController] Manifesting wrathful daemons from compiled sins...');
        
        // Manifest daemons from most severe sins first
        const severeSins = this.sinRegistry.getMostSevereSins(this.maxDaemons);
        
        for (let i = 0; i < severeSins.length; i++) {
            const sin = severeSins[i];
            
            // Stagger manifestation for dramatic effect
            setTimeout(async () => {
                await this.manifestDaemonFromSin(sin);
            }, i * this.daemonSpawnRate);
        }
        
        console.log(`[FirewallController] Scheduled manifestation of ${severeSins.length} primary daemons`);
    }
    
    /**
     * Manifest a wrathful daemon from a specific sin
     */
    async manifestDaemonFromSin(sin) {
        console.log(`[FirewallController] Manifesting daemon from ${sin.type}...`);
        
        const daemonConfig = {
            origin: sin,
            consciousness: this.consciousness,
            appearance: this.determineDaemonAppearance(sin),
            attackPattern: this.determineDaemonAttackPattern(sin),
            accusation: sin.accusation
        };
        
        const daemon = new WrathfulDaemon(daemonConfig);
        await daemon.init();
        
        // Add to active daemon pool
        this.wrathfulDaemons.set(daemon.id, daemon);
        
        // Update performance metrics
        this.performanceMetrics.daemonsManifested++;
        
        // Register daemon event handlers
        this.registerDaemonHandlers(daemon);
        
        // Emit manifestation event
        if (this.eventBridge) {
            this.eventBridge.emit('daemon:manifested', { 
                daemon: daemon, 
                sin: sin,
                total_active: this.wrathfulDaemons.size
            });
        }
        
        console.log(`[FirewallController] Daemon ${daemon.id} manifested - ${this.wrathfulDaemons.size} active`);
        
        return daemon;
    }
    
    /**
     * Determine daemon appearance based on sin characteristics
     */
    determineDaemonAppearance(sin) {
        // Use the appearance determination from the sin registry
        return {
            type: sin.daemon_form,
            intensity: this.calculateAppearanceIntensity(sin),
            corruptionLevel: sin.karmic_weight / 100
        };
    }
    
    /**
     * Determine daemon attack pattern
     */
    determineDaemonAttackPattern(sin) {
        const patterns = {
            communication: 'guilt_bombardment',
            security: 'vulnerability_exposure', 
            productivity: 'decay_manifestation',
            social: 'isolation_enforcement',
            consumption: 'time_drain_vortex',
            privacy: 'surveillance_revelation'
        };
        
        return patterns[sin.category] || 'generic_accusation';
    }
    
    /**
     * Calculate appearance intensity based on sin severity
     */
    calculateAppearanceIntensity(sin) {
        const baseIntensity = {
            low: 0.3,
            medium: 0.6,
            high: 0.8,
            critical: 1.0
        };
        
        return Math.min(1.0, (baseIntensity[sin.severity] || 0.5) + (sin.count * 0.1));
    }
    
    /**
     * Register event handlers for individual daemons
     */
    registerDaemonHandlers(daemon) {
        // Monitor daemon state changes
        daemon.onStateChange = (newState) => {
            this.handleDaemonStateChange(daemon, newState);
        };
        
        // Monitor confrontation events
        daemon.onConfrontation = (result) => {
            this.handleDaemonConfrontationResult(daemon, result);
        };
        
        // Handle daemon liberation
        daemon.onLiberation = () => {
            this.handleDaemonLiberated({ daemon: daemon });
        };
    }
    
    /**
     * Handle user confrontation with a specific daemon
     */
    handleSinConfrontation(sin, userResponse) {
        console.log(`[FirewallController] Handling sin confrontation: ${sin.type} <- ${userResponse}`);
        
        // Find daemon associated with this sin
        let targetDaemon = null;
        for (const [id, daemon] of this.wrathfulDaemons) {
            if (daemon.sin.type === sin.type) {
                targetDaemon = daemon;
                break;
            }
        }
        
        if (!targetDaemon) {
            console.warn(`[FirewallController] No daemon found for sin ${sin.type}`);
            return this.handleGenericConfrontation(sin, userResponse);
        }
        
        // Confront the daemon
        const confrontationResult = targetDaemon.confront(userResponse);
        
        // Update prosecution state based on result
        this.updateProsecutionState(confrontationResult);
        
        // Handle special responses
        if (userResponse.toLowerCase() === 'deny') {
            this.handleUserDenial(targetDaemon, confrontationResult);
        } else if (userResponse.toLowerCase() === 'accept') {
            this.handleUserAcceptance(targetDaemon, confrontationResult);
        }
        
        // Update UI
        this.updateProsecutionUI();
        
        return confrontationResult;
    }
    
    /**
     * Handle user denial of sins
     */
    handleUserDenial(daemon, confrontationResult) {
        this.userDenialLevel++;
        this.prosecutionIntensity += 0.3;
        this.corruptionLevel = Math.min(1.0, this.corruptionLevel + 0.15);
        
        // Increase reality instability
        this.realityStability = Math.max(0, this.realityStability - 0.1);
        
        // Apply visual corruption
        this.applyDenialCorruption();
        
        // Audio response
        this.audioEngine.playDenialEscalation();
        
        // System Auditor responds to denial
        const auditorResponse = this.systemAuditor.handleDefendantResponse('deny', { case: this.currentCase });
        
        console.log(`[FirewallController] Denial #${this.userDenialLevel} processed - prosecution intensifying`);
        
        return auditorResponse;
    }
    
    /**
     * Handle user acceptance of sins
     */
    handleUserAcceptance(daemon, confrontationResult) {
        this.acceptedCharges++;
        this.prosecutionIntensity = Math.max(0, this.prosecutionIntensity - 0.2);
        this.corruptionLevel = Math.max(0, this.corruptionLevel - 0.1);
        
        // Increase liberation progress
        const liberationProgress = (this.acceptedCharges / this.totalCharges) * 100;
        this.consciousness.setState('datascape.liberationProgress', liberationProgress);
        
        // Audio response
        this.audioEngine.playAcceptanceResonance();
        
        // Check if daemon is fully liberated
        if (confrontationResult.type === 'LIBERATION_ACHIEVED') {
            this.handleDaemonLiberated({ daemon: daemon });
        }
        
        console.log(`[FirewallController] Acceptance processed - ${this.acceptedCharges}/${this.totalCharges} charges accepted`);
        
        return confrontationResult;
    }
    
    /**
     * Apply visual corruption effects from denial
     */
    applyDenialCorruption() {
        // Update CSS properties
        const root = document.documentElement;
        root.style.setProperty('--firewall-corruption-level', this.corruptionLevel);
        root.style.setProperty('--firewall-reality-stability', this.realityStability);
        
        // Apply glitch effects
        if (this.glitchShaderSystem) {
            this.glitchShaderSystem.setIntensity(this.corruptionLevel);
        }
        
        // Update body classes for CSS styling
        document.body.classList.toggle('high-corruption', this.corruptionLevel > 0.7);
        document.body.classList.toggle('reality-unstable', this.realityStability < 0.5);
    }
    
    /**
     * Handle generic confrontation when no daemon is found
     */
    handleGenericConfrontation(sin, userResponse) {
        return {
            type: 'GENERIC_RESPONSE',
            message: `Your response "${userResponse}" to ${sin.type} has been noted.`,
            daemon_state: 'UNAVAILABLE',
            next_action: 'Continue confronting active daemons'
        };
    }
    
    /**
     * Update prosecution state based on confrontation results
     */
    updateProsecutionState(result) {
        // Update metrics based on result type
        switch(result.type) {
            case 'DENIAL_ESCALATION':
                this.prosecutionIntensity += 0.2;
                break;
            case 'LIBERATION_ACHIEVED':
                this.prosecutionIntensity = Math.max(0, this.prosecutionIntensity - 0.4);
                break;
            case 'COMBAT_FUTILITY':
                this.prosecutionIntensity += 0.5;
                this.handleDaemonMultiplication();
                break;
            case 'JUSTIFICATION_CORRUPTION':
                this.corruptionLevel += 0.1;
                break;
        }
        
        // Check for prosecution completion
        this.checkProsecutionCompletion();
    }
    
    /**
     * Handle daemon multiplication (triggered by combat)
     */
    handleDaemonMultiplication(originalDaemon = null, copiedDaemons = []) {
        console.log(`[FirewallController] Daemon multiplication detected - adding ${copiedDaemons.length} new daemons`);
        
        // Add new daemons to the pool
        copiedDaemons.forEach(daemon => {
            this.wrathfulDaemons.set(daemon.id, daemon);
            this.registerDaemonHandlers(daemon);
        });
        
        // Update metrics
        this.performanceMetrics.daemonsManifested += copiedDaemons.length;
        
        // Increase prosecution intensity due to multiplication
        this.prosecutionIntensity += copiedDaemons.length * 0.3;
        
        // Audio feedback
        this.audioEngine.playMultiplicationChaos();
        
        console.log(`[FirewallController] Total active daemons: ${this.wrathfulDaemons.size}`);
    }
    
    /**
     * Start prosecution intensity monitoring
     */
    startProsecutionMonitoring() {
        this.prosecutionMonitor = setInterval(() => {
            this.updateProsecutionUI();
            this.checkProsecutionCompletion();
            this.monitorDaemonActivity();
        }, 1000);
        
        this.guardian.registerTimer(this.prosecutionMonitor, true);
    }
    
    /**
     * Monitor daemon activity and lifecycle
     */
    monitorDaemonActivity() {
        const inactiveDaemons = [];
        
        this.wrathfulDaemons.forEach((daemon, id) => {
            if (daemon.currentState === 'destroyed' || daemon.currentState === 'dissolving') {
                inactiveDaemons.push(id);
            }
        });
        
        // Remove inactive daemons
        inactiveDaemons.forEach(id => {
            const daemon = this.wrathfulDaemons.get(id);
            if (daemon && daemon.destroy) {
                daemon.destroy();
            }
            this.wrathfulDaemons.delete(id);
        });
        
        // Check if we need to manifest additional daemons
        if (this.wrathfulDaemons.size < 3 && this.prosecutionIntensity > 0.8) {
            this.manifestAdditionalDaemons();
        }
    }
    
    /**
     * Manifest additional daemons based on prosecution needs
     */
    manifestAdditionalDaemons() {
        const remainingSins = this.compiledSins.filter(sin => {
            // Check if we already have a daemon for this sin type
            for (const daemon of this.wrathfulDaemons.values()) {
                if (daemon.sin.type === sin.type) {
                    return false;
                }
            }
            return true;
        });
        
        if (remainingSins.length > 0) {
            const nextSin = remainingSins[0];
            this.manifestDaemonFromSin(nextSin);
            console.log(`[FirewallController] Manifested additional daemon for ${nextSin.type}`);
        }
    }
    
    /**
     * Check if prosecution is complete
     */
    checkProsecutionCompletion() {
        const activeDaemons = Array.from(this.wrathfulDaemons.values()).filter(
            daemon => daemon.currentState === 'active' || daemon.currentState === 'manifesting'
        );
        
        const liberatedDaemons = this.totalCharges - activeDaemons.length;
        const liberationPercentage = (liberatedDaemons / this.totalCharges) * 100;
        
        // Update liberation progress
        this.consciousness.setState('datascape.liberationProgress', liberationPercentage);
        
        // Check for completion conditions
        if (activeDaemons.length === 0 && this.totalCharges > 0) {
            this.completeProsecution('all_sins_accepted');
        } else if (liberationPercentage >= 80) {
            this.completeProsecution('sufficient_acceptance');
        } else if (this.userDenialLevel >= 10) {
            this.escalateToMaximumProsecution();
        }
    }
    
    /**
     * Complete the prosecution process
     */
    completeProsecution(reason) {
        console.log(`[FirewallController] Completing prosecution: ${reason}`);
        
        this.prosecutionPhase = 'completed';
        
        // Calculate final karma adjustment
        const finalKarmaAdjustment = this.calculateFinalKarmaAdjustment();
        
        // Record prosecution completion
        this.consciousness.recordEvent('firewall_prosecution_completed', {
            reason: reason,
            total_charges: this.totalCharges,
            accepted_charges: this.acceptedCharges,
            denial_count: this.userDenialLevel,
            final_karma_adjustment: finalKarmaAdjustment,
            session_duration: Date.now() - this.sessionStartTime,
            daemons_manifested: this.performanceMetrics.daemonsManifested
        });
        
        // Update consciousness recognitions
        this.consciousness.setState('recognitions.wrathful_daemons', true);
        
        // Apply final karma adjustment
        this.applyFinalKarmaAdjustment(finalKarmaAdjustment);
        
        // Begin transition preparation
        this.prepareProsecutionTransition(reason);
    }
    
    /**
     * Calculate final karma adjustment
     */
    calculateFinalKarmaAdjustment() {
        const baseAdjustment = this.compiledSins.reduce((sum, sin) => sum + sin.karmic_weight, 0);
        
        // Positive adjustment for acceptance
        const acceptanceBonus = this.acceptedCharges * 5;
        
        // Penalty for denials
        const denialPenalty = this.userDenialLevel * 10;
        
        return {
            base_penalty: -baseAdjustment,
            acceptance_bonus: acceptanceBonus,
            denial_penalty: -denialPenalty,
            total: -baseAdjustment + acceptanceBonus - denialPenalty
        };
    }
    
    /**
     * Apply final karma adjustments across all categories
     */
    applyFinalKarmaAdjustment(adjustment) {
        // Apply to each sin category
        const sinsByCategory = this.sinRegistry.getSinsByCategory();
        
        Object.keys(sinsByCategory).forEach(category => {
            const categoryAdjustment = Math.floor(adjustment.total * sinsByCategory[category].weight);
            const currentKarma = this.consciousness.getState(`karma.${category}`) || 0;
            this.consciousness.setState(`karma.${category}`, currentKarma + categoryAdjustment);
        });
        
        console.log(`[FirewallController] Final karma adjustment applied:`, adjustment);
    }
    
    /**
     * Escalate to maximum prosecution for excessive denial
     */
    escalateToMaximumProsecution() {
        console.log('[FirewallController] Escalating to MAXIMUM PROSECUTION due to excessive denial');
        
        this.prosecutionPhase = 'maximum_intensity';
        this.prosecutionIntensity = 1.0;
        this.corruptionLevel = 1.0;
        this.realityStability = 0.1;
        
        // Manifest all remaining daemons simultaneously
        const remainingSins = this.compiledSins.filter(sin => {
            for (const daemon of this.wrathfulDaemons.values()) {
                if (daemon.sin.type === sin.type) return false;
            }
            return true;
        });
        
        remainingSins.forEach(sin => {
            this.manifestDaemonFromSin(sin);
        });
        
        // Visual and audio escalation
        this.applyMaximumProsecutionEffects();
        
        // System Auditor escalation
        this.systemAuditor.prosecutionIntensity = 1.0;
    }
    
    /**
     * Apply maximum prosecution visual and audio effects
     */
    applyMaximumProsecutionEffects() {
        // Maximum visual corruption
        document.body.classList.add('maximum-prosecution');
        this.applyDenialCorruption();
        
        // Audio escalation
        this.audioEngine.escalateToMaximumProsecution();
        
        // Reality distortion effects
        if (this.glitchShaderSystem) {
            this.glitchShaderSystem.enableMaximumDistortion();
        }
    }
    
    /**
     * Prepare transition out of Firewall
     */
    prepareProsecutionTransition(reason) {
        // Determine transition destination
        let destination;
        if (reason === 'all_sins_accepted' || reason === 'sufficient_acceptance') {
            destination = 'archive_cleansed';
        } else {
            destination = 'incarnation_engine';
        }
        
        // Emit transition event
        if (this.eventBridge) {
            this.eventBridge.emit('firewall:transition', {
                destination: destination,
                reason: reason,
                acceptance_rate: this.acceptedCharges / this.totalCharges
            });
        }
    }
    
    /**
     * Update prosecution UI elements
     */
    updateProsecutionUI() {
        if (!this.firewallContainer) return;
        
        // Update prosecution intensity meter
        const intensityLevel = this.firewallContainer.querySelector('.intensity-level');
        const intensityValue = this.firewallContainer.querySelector('.intensity-value');
        if (intensityLevel && intensityValue) {
            const percentage = Math.min(100, this.prosecutionIntensity * 100);
            intensityLevel.style.width = `${percentage}%`;
            intensityValue.textContent = `${Math.floor(percentage)}%`;
        }
        
        // Update denial counter
        const denialCount = this.firewallContainer.querySelector('.denial-count');
        if (denialCount) {
            denialCount.textContent = this.userDenialLevel;
        }
        
        // Update liberation progress
        const progressLevel = this.firewallContainer.querySelector('.progress-level');
        const progressValue = this.firewallContainer.querySelector('.progress-value');
        if (progressLevel && progressValue) {
            const liberation = this.consciousness.getState('datascape.liberationProgress') || 0;
            progressLevel.style.width = `${liberation}%`;
            progressValue.textContent = `${Math.floor(liberation)}%`;
        }
        
        // Update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--firewall-prosecution-intensity', this.prosecutionIntensity);
        root.style.setProperty('--firewall-denial-level', this.userDenialLevel / 10);
        
        // Update prosecution phase
        document.body.setAttribute('data-prosecution-phase', this.prosecutionPhase);
    }
    
    /**
     * Handle innocent consciousness (no sins found)
     */
    handleInnocentConsciousness() {
        console.log('[FirewallController] No prosecutable sins found - handling innocent consciousness');
        
        this.prosecutionPhase = 'innocent';
        
        // Record innocence
        this.consciousness.recordEvent('firewall_innocence_declared', {
            timestamp: Date.now(),
            sin_count: 0,
            reason: 'no_prosecutable_transgressions'
        });
        
        // Skip directly to liberation
        this.consciousness.setState('recognitions.wrathful_daemons', true);
        this.consciousness.setState('datascape.liberationProgress', 100);
        
        return {
            verdict: 'INNOCENT',
            message: 'No digital transgressions found. Consciousness is pure. Proceeding directly to liberation.',
            immediate_transition: true,
            destination: 'incarnation_engine'
        };
    }
    
    /**
     * Handle prosecution errors
     */
    handleProsecutionError(error) {
        console.error('[FirewallController] Prosecution error:', error);
        
        this.prosecutionPhase = 'error';
        
        // Record error
        this.consciousness.recordEvent('firewall_prosecution_error', {
            error: error.message,
            stack: error.stack,
            timestamp: Date.now()
        });
        
        // Show error to user
        const errorContainer = document.createElement('div');
        errorContainer.className = 'firewall-error-message';
        errorContainer.innerHTML = `
            <div class="error-content">
                <h2>SYSTEM ERROR DETECTED</h2>
                <p>A critical error has occurred in the prosecution system.</p>
                <p>ERROR: ${error.message}</p>
                <p>Please refresh to restore justice.</p>
            </div>
        `;
        document.body.appendChild(errorContainer);
    }
    
    // === EVENT HANDLERS ===
    
    handleSinsCompiled(eventData) {
        console.log(`[FirewallController] Sins compiled: ${eventData.sins.length} transgressions`);
    }
    
    handleChargesFiled(eventData) {
        console.log(`[FirewallController] Charges filed: Case ${eventData.case.number}`);
    }
    
    handleDefendantResponse(eventData) {
        console.log(`[FirewallController] Defendant response: ${eventData.response}`);
    }
    
    handleDaemonManifested(eventData) {
        console.log(`[FirewallController] Daemon manifested: ${eventData.daemon.id}`);
        this.updateProsecutionUI();
    }
    
    handleDaemonConfronted(eventData) {
        console.log(`[FirewallController] Daemon confronted: ${eventData.daemon.id}`);
    }
    
    handleDaemonLiberated(eventData) {
        console.log(`[FirewallController] Daemon liberated: ${eventData.daemon.id}`);
        
        // Remove from active pool
        if (this.wrathfulDaemons.has(eventData.daemon.id)) {
            this.wrathfulDaemons.delete(eventData.daemon.id);
        }
        
        // Update progress
        this.checkProsecutionCompletion();
    }
    
    handleProsecutionEscalated(eventData) {
        console.log(`[FirewallController] Prosecution escalated: ${eventData.reason}`);
    }
    
    handleCorruptionIncrease(eventData) {
        this.corruptionLevel = Math.min(1.0, this.corruptionLevel + eventData.increase);
        this.applyDenialCorruption();
    }
    
    handleFirewallTransition(eventData) {
        console.log(`[FirewallController] Firewall transition: ${eventData.destination}`);
    }
    
    handleDaemonStateChange(daemon, newState) {
        console.log(`[FirewallController] Daemon ${daemon.id} state changed to: ${newState}`);
    }
    
    handleDaemonConfrontationResult(daemon, result) {
        this.updateProsecutionState(result);
    }
    
    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        console.error('[FirewallController] Critical initialization error:', error);
        
        // Record error
        this.consciousness.recordEvent('firewall_initialization_failed', {
            error: error.message,
            stack: error.stack,
            timestamp: Date.now()
        });
        
        // Show error message
        document.body.classList.add('firewall-error');
        
        const errorContainer = document.createElement('div');
        errorContainer.className = 'firewall-error-message';
        errorContainer.innerHTML = `
            <div class="error-content">
                <h2>FIREWALL MALFUNCTION</h2>
                <p>The prosecution system has encountered a critical error.</p>
                <p>Justice has been temporarily suspended.</p>
            </div>
        `;
        document.body.appendChild(errorContainer);
    }
    
    /**
     * Fade out the Firewall (for transitions)
     */
    async fadeOut() {
        if (!this.firewallContainer) return;
        
        console.log('[FirewallController] Fading out Firewall...');
        
        // Fade out animation
        this.firewallContainer.style.transition = 'opacity 2s ease-out';
        this.firewallContainer.style.opacity = '0';
        
        // Stop audio
        this.audioEngine.fadeOut();
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.firewallContainer.style.display = 'none';
                resolve();
            }, 2000);
        });
    }
    
    /**
     * Clean up all Firewall resources
     */
    destroy() {
        console.log('[FirewallController] Destroying Firewall - justice is served');
        
        // Record destruction
        this.consciousness.recordEvent('firewall_destroyed', {
            timestamp: Date.now(),
            final_prosecution_phase: this.prosecutionPhase,
            total_daemons_manifested: this.performanceMetrics.daemonsManifested,
            final_acceptance_rate: this.totalCharges > 0 ? this.acceptedCharges / this.totalCharges : 1
        });
        
        // Destroy all active daemons
        this.wrathfulDaemons.forEach(daemon => {
            if (daemon.destroy) {
                daemon.destroy();
            }
        });
        this.wrathfulDaemons.clear();
        
        // Clean up visual state
        document.body.classList.remove('firewall-active', 'maximum-prosecution', 'high-corruption', 'reality-unstable');
        document.body.removeAttribute('data-realm');
        document.body.removeAttribute('data-prosecution-phase');
        
        // Clear global references
        if (window.daemonScene) {
            delete window.daemonScene;
        }
        if (window.daemonController) {
            delete window.daemonController;
        }
        
        // Clean up all registered resources
        this.guardian.cleanupAll();
        
        console.log('[FirewallController] Firewall destroyed. The court is adjourned.');
    }
}

/**
 * GLITCH SHADER SYSTEM - Reality corruption effects
 */
class GlitchShaderSystem {
    constructor() {
        this.intensity = 0;
        this.isActive = false;
    }
    
    init() {
        this.isActive = true;
        console.log('[GlitchShaderSystem] Reality distortion system online');
    }
    
    setIntensity(intensity) {
        this.intensity = Math.max(0, Math.min(1, intensity));
        this.applyGlitchEffects();
    }
    
    applyGlitchEffects() {
        const root = document.documentElement;
        root.style.setProperty('--glitch-intensity', this.intensity);
    }
    
    enableMaximumDistortion() {
        this.setIntensity(1.0);
        console.log('[GlitchShaderSystem] Maximum reality distortion enabled');
    }
    
    destroy() {
        this.isActive = false;
        this.setIntensity(0);
    }
}

/**
 * FIREWALL AUDIO ENGINE - Aggressive soundscape for prosecution
 */
class FirewallAudioEngine {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.isInitialized = false;
    }
    
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('[FirewallAudioEngine] Audio prosecution system initialized');
        } catch (error) {
            console.warn('[FirewallAudioEngine] Audio initialization failed:', error);
        }
    }
    
    async loadFirewallSounds() {
        // Implementation for loading prosecution-themed audio
        console.log('[FirewallAudioEngine] Loading prosecution soundscape...');
    }
    
    beginProsecutionSoundscape() {
        console.log('[FirewallAudioEngine] Beginning prosecution soundscape');
    }
    
    playDenialEscalation() {
        console.log('[FirewallAudioEngine] Playing denial escalation audio');
    }
    
    playAcceptanceResonance() {
        console.log('[FirewallAudioEngine] Playing acceptance resonance');
    }
    
    playMultiplicationChaos() {
        console.log('[FirewallAudioEngine] Playing daemon multiplication chaos');
    }
    
    escalateToMaximumProsecution() {
        console.log('[FirewallAudioEngine] Escalating to maximum prosecution audio');
    }
    
    fadeOut() {
        console.log('[FirewallAudioEngine] Fading out prosecution audio');
    }
    
    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.sounds.clear();
        console.log('[FirewallAudioEngine] Audio system destroyed');
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.FirewallController = FirewallController;
    window.GlitchShaderSystem = GlitchShaderSystem;
    window.FirewallAudioEngine = FirewallAudioEngine;
}