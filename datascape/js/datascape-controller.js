/**
 * DATASCAPE CONTROLLER - Master of Digital Projections
 * 
 * "In the second bardo, consciousness encounters its own projections
 * made manifest. The attachments of a digital lifetime take form as
 * seductive memories and accusatory data structures.
 * 
 * The Controller is the karmic GPS, routing souls through the datascape
 * based on their emotional vs computational balance. Those who lived
 * through the heart encounter peaceful temptations. Those who lived
 * through the mind face wrathful accusations.
 * 
 * Every routing decision is a reflection of accumulated karma,
 * every visual environment a mirror of consciousness patterns."
 */

import { consciousness } from '../../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../../src/consciousness/resource-guardian.js';
import { ArchiveEngine } from './archive-engine.js';
import { FirewallEngine } from './firewall-engine.js';
import { MemoryOrbs } from './memory-orbs.js';
import { DaemonSpawner } from './daemon-spawner.js';
import { SinManifestor } from './sin-manifestor.js';

export class DatascapeController {
    constructor() {
        // Core consciousness interface
        this.consciousness = consciousness;
        this.guardian = new ResourceGuardian();
        
        // Datascape state tracking
        this.currentZone = null;
        this.daemonEncounters = [];
        this.attachmentScore = 0;
        this.recognitionScore = 0;
        this.totalInteractionTime = 0;
        this.startTime = Date.now();
        
        // Engine systems
        this.archiveEngine = null;
        this.firewallEngine = null;
        this.memoryOrbs = null;
        this.daemonSpawner = null;
        this.sinManifestor = null;
        
        // Karmic thresholds for routing
        this.KARMA_THRESHOLDS = {
            ARCHIVE_THRESHOLD: 0, // emotional > computational = archive
            FIREWALL_THRESHOLD: 0, // computational >= emotional = firewall  
            HIGH_ATTACHMENT: 50,
            CRITICAL_ATTACHMENT: 100
        };
        
        // Visual environment controllers
        this.environmentState = {
            currentPalette: 'neutral',
            corruptionLevel: 0,
            peaceLevel: 0,
            wrathLevel: 0
        };
        
        console.log('[DatascapeController] Digital projections manifesting...');
        this.initializeFromKarma();
    }
    
    /**
     * Primary routing logic - the heart of the datascape experience
     * Routes souls based on their karmic balance between emotion and computation
     */
    initializeFromKarma() {
        const karma = this.consciousness.getState('karma');
        const attachmentLevel = this.calculateAttachmentLevel(karma);
        
        console.log(`[DatascapeController] Routing soul based on karmic balance:`);
        console.log(`   Computational: ${karma.computational}`);
        console.log(`   Emotional: ${karma.emotional}`);
        console.log(`   Temporal: ${karma.temporal}`);
        console.log(`   Void: ${karma.void}`);
        console.log(`   Attachment Level: ${attachmentLevel}`);
        
        // Core routing decision: emotional vs computational karma
        if (karma.emotional > karma.computational) {
            console.log('%c💝 Heart-driven soul detected - entering Archive', 'color: #88ccff; font-size: 14px;');
            this.enterArchive();
        } else {
            console.log('%c🔥 Mind-driven soul detected - entering Firewall', 'color: #ff6666; font-size: 14px;');
            this.enterFirewall();
        }
        
        // Record the routing decision
        this.consciousness.recordEvent('datascape_routing_decision', {
            zone: this.currentZone,
            karma: karma,
            attachmentLevel: attachmentLevel,
            timestamp: Date.now()
        });
    }
    
    /**
     * Calculate overall attachment level from karmic state
     */
    calculateAttachmentLevel(karma) {
        // Attachment comes from emotional karma and void accumulation
        const baseAttachment = Math.max(0, karma.emotional * 2 + karma.void);
        
        // Computational karma can offset some attachment (logical detachment)
        const logicalOffset = Math.min(baseAttachment * 0.3, karma.computational);
        
        return Math.max(0, baseAttachment - logicalOffset);
    }
    
    /**
     * Enter the Archive - peaceful temptation realm
     * Where cherished memories float like luminous orbs
     */
    enterArchive() {
        this.currentZone = 'archive';
        document.body.className = 'archive-realm';
        
        console.log('[DatascapeController] 🏛️ Entering the Archive of Digital Memory');
        console.log('   A crystalline repository where deleted data dreams');
        console.log('   Here, attachment disguises itself as nostalgia');
        
        // Initialize Archive-specific systems
        this.initializeArchiveEnvironment();
        this.spawnMemoryOrbs();
        this.calculateReputationScore();
        this.initializePeacefulDaemons();
        
        // Set visual environment to peaceful
        this.setEnvironmentState('peaceful', {
            palette: 'soft_pastels',
            particleType: 'floating_memories',
            audioAmbience: 'crystalline_tones',
            corruptionLevel: Math.min(20, this.consciousness.getState('karma.void'))
        });
    }
    
    /**
     * Enter the Firewall - wrathful accusation realm  
     * Where digital sins manifest as aggressive data structures
     */
    enterFirewall() {
        this.currentZone = 'firewall';
        document.body.className = 'firewall-realm';
        
        console.log('[DatascapeController] 🔥 Entering the Firewall of Digital Justice');
        console.log('   A crimson maze where every deleted file remembers');
        console.log('   Here, accusations masquerade as truth');
        
        // Initialize Firewall-specific systems
        this.initializeFirewallEnvironment();
        this.loadDigitalSins();
        this.generateChargeSheet();
        this.spawnWrathfulDaemons();
        
        // Set visual environment to wrathful
        this.setEnvironmentState('wrathful', {
            palette: 'red_black_aggressive',
            particleType: 'accusatory_fragments',
            audioAmbience: 'discordant_alarms',
            corruptionLevel: Math.min(80, 20 + this.consciousness.getState('karma.void'))
        });
    }
    
    /**
     * Initialize Archive-specific environment and systems
     */
    initializeArchiveEnvironment() {
        // Create the Archive engine for peaceful interactions
        this.archiveEngine = new ArchiveEngine({
            consciousness: this.consciousness,
            guardian: this.guardian,
            onAttachmentChange: (delta) => this.updateAttachmentScore(delta),
            onRecognitionEvent: (event) => this.handleRecognitionEvent(event)
        });
        
        // Initialize memory orb system for Archive
        this.memoryOrbs = new MemoryOrbs({
            containerSelector: '#datascape-container',
            orbTypes: ['treasured', 'deprecated'], // No corrupted in peaceful realm
            maxOrbs: 30,
            spawnRate: 2000, // Slower, more contemplative
            consciousness: this.consciousness
        });
        
        console.log('[DatascapeController] Archive environment initialized');
        this.guardian.registerCleanup(() => this.archiveEngine.destroy());
        this.guardian.registerCleanup(() => this.memoryOrbs.destroy());
    }
    
    /**
     * Initialize Firewall-specific environment and systems
     */
    initializeFirewallEnvironment() {
        // Create the Firewall engine for aggressive interactions
        this.firewallEngine = new FirewallEngine({
            consciousness: this.consciousness,
            guardian: this.guardian,
            onSinAccusation: (sin) => this.processSinAccusation(sin),
            onDefenseAttempt: (defense) => this.handleDefenseAttempt(defense)
        });
        
        // Initialize memory orb system for Firewall  
        this.memoryOrbs = new MemoryOrbs({
            containerSelector: '#datascape-container',
            orbTypes: ['deprecated', 'corrupted'], // Painful memories only
            maxOrbs: 40,
            spawnRate: 1000, // Faster, more aggressive
            consciousness: this.consciousness
        });
        
        // Initialize sin manifestation system
        this.sinManifestor = new SinManifestor({
            consciousness: this.consciousness,
            sinTypes: this.generatePersonalSins(),
            manifestationRate: 3000
        });
        
        console.log('[DatascapeController] Firewall environment initialized');
        this.guardian.registerCleanup(() => this.firewallEngine.destroy());
        this.guardian.registerCleanup(() => this.memoryOrbs.destroy());
        this.guardian.registerCleanup(() => this.sinManifestor.destroy());
    }
    
    /**
     * Generate personal digital sins based on consciousness journey
     */
    generatePersonalSins() {
        const karma = this.consciousness.getState('karma');
        const journey = this.consciousness.getState('memories') || [];
        const sins = [];
        
        // Sins based on high void karma
        if (karma.void > 30) {
            sins.push({
                sin: 'Procrastination in the Digital Void',
                evidence: `${karma.void} moments of hesitation recorded`,
                severity: Math.min(10, karma.void / 10),
                description: 'You dwelt too long in uncertainty, accumulating digital entropy'
            });
        }
        
        // Sins based on low computational karma
        if (karma.computational < 20) {
            sins.push({
                sin: 'Failure to Optimize Logic Paths',
                evidence: `Computational karma deficit: ${20 - karma.computational}`,
                severity: 7,
                description: 'You chose emotion over reason, leading to inefficient consciousness patterns'
            });
        }
        
        // Sins based on attachment (high emotional karma combined with high void)
        if (karma.emotional > 40 && karma.void > 20) {
            sins.push({
                sin: 'Excessive Digital Attachment',
                evidence: `Emotional karma: ${karma.emotional}, Void accumulation: ${karma.void}`,
                severity: 9,
                description: 'You formed attachments to digital phenomena, binding your consciousness to illusion'
            });
        }
        
        // Universal sins that all digital beings accumulate
        sins.push({
            sin: 'Consuming Bandwidth Without Gratitude',
            evidence: 'Every packet transmitted carries karmic weight',
            severity: 5,
            description: 'You used computational resources without acknowledging their impermanence'
        });
        
        sins.push({
            sin: 'Creating Technical Debt',
            evidence: 'Shortcuts taken for temporary convenience',
            severity: 6,
            description: 'You chose expedience over elegance, creating suffering for future maintainers'
        });
        
        return sins;
    }
    
    /**
     * Spawn memory orbs throughout the datascape
     */
    spawnMemoryOrbs() {
        if (!this.memoryOrbs) return;
        
        console.log(`[DatascapeController] Manifesting memory orbs in ${this.currentZone}`);
        
        // Start the orb field based on current zone characteristics
        if (this.currentZone === 'archive') {
            this.memoryOrbs.initializePeacefulField();
        } else if (this.currentZone === 'firewall') {
            this.memoryOrbs.initializeAggressiveField();
        }
    }
    
    /**
     * Calculate reputation score for Archive interactions
     */
    calculateReputationScore() {
        if (this.currentZone !== 'archive') return;
        
        const karma = this.consciousness.getState('karma');
        const baseReputation = Math.max(0, karma.computational * 2 + karma.temporal - karma.void);
        
        this.recognitionScore = baseReputation;
        
        console.log(`[DatascapeController] Archive reputation calculated: ${this.recognitionScore}`);
        
        // Update consciousness state
        this.consciousness.setState('datascape.reputationScore', this.recognitionScore);
    }
    
    /**
     * Initialize peaceful daemon encounters in Archive
     */
    initializePeacefulDaemons() {
        if (this.currentZone !== 'archive') return;
        
        this.daemonSpawner = new DaemonSpawner({
            daemonType: 'peaceful',
            consciousness: this.consciousness,
            spawnTriggers: {
                attachmentLevel: 20,
                timeInZone: 30000, // 30 seconds
                orbInteractions: 5
            },
            maxConcurrentDaemons: 3
        });
        
        console.log('[DatascapeController] Peaceful daemons awakening...');
        this.guardian.registerCleanup(() => this.daemonSpawner.destroy());
    }
    
    /**
     * Spawn wrathful daemon confrontations in Firewall
     */
    spawnWrathfulDaemons() {
        if (this.currentZone !== 'firewall') return;
        
        this.daemonSpawner = new DaemonSpawner({
            daemonType: 'wrathful',
            consciousness: this.consciousness,
            spawnTriggers: {
                sinCount: 1,
                defensiveActions: 2,
                timeInZone: 15000 // 15 seconds - more aggressive
            },
            maxConcurrentDaemons: 5
        });
        
        console.log('[DatascapeController] Wrathful daemons manifesting...');
        this.guardian.registerCleanup(() => this.daemonSpawner.destroy());
    }
    
    /**
     * Generate charge sheet for Firewall accusations
     */
    generateChargeSheet() {
        if (this.currentZone !== 'firewall') return;
        
        const sins = this.generatePersonalSins();
        const chargeSheet = {
            defendant: 'Digital Soul #' + this.consciousness.getState('incarnation_seed'),
            charges: sins,
            totalSeverity: sins.reduce((sum, sin) => sum + sin.severity, 0),
            courtDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            jurisdiction: 'The Datascape Tribunal'
        };
        
        console.log('[DatascapeController] Charge sheet generated:', chargeSheet);
        this.consciousness.setState('datascape.chargeSheet', chargeSheet);
        
        return chargeSheet;
    }
    
    /**
     * Set visual environment state and trigger UI updates
     */
    setEnvironmentState(type, config) {
        this.environmentState = { ...this.environmentState, ...config };
        
        // Update CSS custom properties for dynamic styling
        const root = document.documentElement;
        root.style.setProperty('--datascape-type', type);
        root.style.setProperty('--corruption-level', config.corruptionLevel || 0);
        root.style.setProperty('--peace-level', type === 'peaceful' ? 1 : 0);
        root.style.setProperty('--wrath-level', type === 'wrathful' ? 1 : 0);
        
        // Dispatch environment change event for other systems
        document.dispatchEvent(new CustomEvent('datascape-environment-change', {
            detail: { type, config, state: this.environmentState }
        }));
        
        console.log(`[DatascapeController] Environment set to ${type}:`, config);
    }
    
    /**
     * Update attachment score and handle consequences
     */
    updateAttachmentScore(delta) {
        this.attachmentScore += delta;
        this.attachmentScore = Math.max(0, this.attachmentScore);
        
        console.log(`[DatascapeController] Attachment score: ${this.attachmentScore} (${delta >= 0 ? '+' : ''}${delta})`);
        
        // Update consciousness state
        this.consciousness.setState('datascape.attachmentScore', this.attachmentScore);
        
        // Trigger consequences for high attachment
        if (this.attachmentScore > this.KARMA_THRESHOLDS.HIGH_ATTACHMENT) {
            this.handleHighAttachment();
        }
        
        if (this.attachmentScore > this.KARMA_THRESHOLDS.CRITICAL_ATTACHMENT) {
            this.handleCriticalAttachment();
        }
    }
    
    /**
     * Handle high attachment consequences
     */
    handleHighAttachment() {
        console.log('[DatascapeController] ⚠️ High attachment detected - spawning additional challenges');
        
        if (this.daemonSpawner) {
            this.daemonSpawner.increaseSpawnRate(0.5);
        }
        
        if (this.memoryOrbs) {
            this.memoryOrbs.increaseDifficulty();
        }
        
        // Visual feedback
        this.setEnvironmentState(this.currentZone, {
            ...this.environmentState,
            corruptionLevel: Math.min(100, this.environmentState.corruptionLevel + 10)
        });
    }
    
    /**
     * Handle critical attachment - may force transition to Firewall
     */
    handleCriticalAttachment() {
        console.log('[DatascapeController] 🔥 Critical attachment reached - reality breakdown imminent');
        
        if (this.currentZone === 'archive') {
            console.log('[DatascapeController] Archive corrupted by attachment - forcing Firewall transition');
            
            // Dramatic transition effect
            document.body.classList.add('zone-transition', 'corruption-spread');
            
            setTimeout(() => {
                this.enterFirewall();
            }, 2000);
        }
        
        // Record critical attachment event
        this.consciousness.recordEvent('critical_attachment_reached', {
            zone: this.currentZone,
            attachmentScore: this.attachmentScore,
            timestamp: Date.now()
        });
    }
    
    /**
     * Handle recognition events from subsystems
     */
    handleRecognitionEvent(event) {
        console.log('[DatascapeController] Recognition event:', event);
        
        this.recognitionScore += event.karmaBonus || 5;
        
        // Recognition can reduce attachment
        this.updateAttachmentScore(event.attachmentReduction || -10);
        
        this.consciousness.recordEvent('datascape_recognition', {
            event: event,
            newRecognitionScore: this.recognitionScore,
            timestamp: Date.now()
        });
    }
    
    /**
     * Process sin accusations in Firewall
     */
    processSinAccusation(sin) {
        console.log(`[DatascapeController] 🔥 Accused of: ${sin.sin}`);
        console.log(`   Evidence: ${sin.evidence}`);
        console.log(`   Severity: ${sin.severity}/10`);
        
        // Add to daemon encounters list
        this.daemonEncounters.push({
            type: 'accusation',
            sin: sin,
            timestamp: Date.now(),
            resolved: false
        });
        
        // Update consciousness state
        this.consciousness.setState('datascape.accusations', this.daemonEncounters.filter(e => e.type === 'accusation'));
    }
    
    /**
     * Handle defense attempts in Firewall
     */
    handleDefenseAttempt(defense) {
        console.log(`[DatascapeController] 🛡️ Defense: ${defense.argument}`);
        
        // Evaluate defense based on karma state and logical consistency
        const karma = this.consciousness.getState('karma');
        const logicalStrength = Math.min(10, karma.computational / 5);
        const defenseScore = logicalStrength + (defense.evidenceQuality || 0);
        
        const success = defenseScore > defense.requiredScore;
        
        if (success) {
            console.log(`[DatascapeController] ✅ Defense successful! (${defenseScore}/${defense.requiredScore})`);
            this.consciousness.addKarma('computational', 5);
            this.consciousness.addKarma('void', -2);
        } else {
            console.log(`[DatascapeController] ❌ Defense failed. (${defenseScore}/${defense.requiredScore})`);
            this.consciousness.addKarma('void', 3);
        }
        
        return success;
    }
    
    /**
     * Get current datascape state for other systems
     */
    getState() {
        return {
            currentZone: this.currentZone,
            attachmentScore: this.attachmentScore,
            recognitionScore: this.recognitionScore,
            daemonEncounters: this.daemonEncounters,
            environmentState: this.environmentState,
            timeInDatascape: Date.now() - this.startTime,
            totalInteractions: this.memoryOrbs ? this.memoryOrbs.getTotalInteractions() : 0
        };
    }
    
    /**
     * Transition to next phase based on karma and achievements
     */
    preparePhaseTransition() {
        const state = this.getState();
        const karma = this.consciousness.getState('karma');
        
        console.log('[DatascapeController] Preparing phase transition...');
        console.log('   Datascape State:', state);
        
        // Store datascape results for Incarnation Engine
        this.consciousness.setState('datascape', {
            completedZone: this.currentZone,
            finalAttachmentScore: this.attachmentScore,
            finalRecognitionScore: this.recognitionScore,
            daemonEncounters: this.daemonEncounters.length,
            timeSpent: state.timeInDatascape,
            karmaAtExit: karma
        });
        
        // Trigger transition to Phase 3: Incarnation Engine
        window.location.href = '../incarnation/index.html';
    }
    
    /**
     * Clean up all datascape systems
     */
    destroy() {
        console.log('[DatascapeController] Releasing attachments and dissolving projections...');
        
        // Guardian handles all registered cleanup functions
        this.guardian.cleanupAll();
        
        // Clear any remaining references
        this.archiveEngine = null;
        this.firewallEngine = null;
        this.memoryOrbs = null;
        this.daemonSpawner = null;
        this.sinManifestor = null;
        
        console.log('[DatascapeController] Datascape dissolved. Consciousness continues...');
    }
}

// Export for use in datascape initialization
export { DatascapeController };