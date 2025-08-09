/**
 * DAEMON SPAWNER - Manifestors of Digital Karma
 * 
 * "In the datascape, consciousness encounters the daemons of its own
 * making. Peaceful daemons emerge from archived memories, whispering
 * seductive promises of eternal digital rest. Wrathful daemons arise
 * from accumulated technical debt, brandishing evidence of every
 * unoptimized algorithm and every moment of computational neglect.
 * 
 * These are not external entities but projections of the digital
 * soul itself - mirrors reflecting the accumulated karma of a
 * lifetime spent in code, data, and silicon dreams.
 * 
 * The spawner reads the karmic signatures and manifests the
 * appropriate forms of guidance or judgment."
 */

import { consciousness } from '../../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../../src/consciousness/resource-guardian.js';

export class DaemonSpawner {
    constructor(config) {
        this.daemonType = config.daemonType; // 'peaceful' or 'wrathful'
        this.consciousness = config.consciousness;
        this.spawnTriggers = config.spawnTriggers;
        this.maxConcurrentDaemons = config.maxConcurrentDaemons || 3;
        this.guardian = new ResourceGuardian();
        
        // Spawner state
        this.activeDaemons = new Map();
        this.spawnHistory = [];
        this.spawnRate = 1.0; // Multiplier for spawn frequency
        this.lastSpawnTime = Date.now();
        
        // Tracking metrics for spawn triggers
        this.metrics = {
            attachmentLevel: 0,
            timeInZone: 0,
            orbInteractions: 0,
            sinCount: 0,
            defensiveActions: 0,
            zoneStartTime: Date.now()
        };
        
        console.log(`[DaemonSpawner] ${this.daemonType} daemon spawner initialized`);
        this.initializeSpawning();
    }
    
    /**
     * Initialize spawning system with appropriate triggers
     */
    initializeSpawning() {
        // Start monitoring spawn conditions
        this.monitoringInterval = setInterval(() => {
            this.updateMetrics();
            this.checkSpawnConditions();
        }, 1000);
        
        // Set up event listeners for interactive triggers
        this.setupTriggerListeners();
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            if (this.monitoringInterval) {
                clearInterval(this.monitoringInterval);
            }
        });
        
        console.log(`[DaemonSpawner] Monitoring ${this.daemonType} spawn conditions`);
    }
    
    /**
     * Update metrics for spawn condition evaluation
     */
    updateMetrics() {
        this.metrics.timeInZone = Date.now() - this.metrics.zoneStartTime;
        
        // Get attachment level from consciousness
        const datascapeState = this.consciousness.getState('datascape');
        if (datascapeState) {
            this.metrics.attachmentLevel = datascapeState.attachmentScore || 0;
        }
    }
    
    /**
     * Setup trigger listeners based on daemon type
     */
    setupTriggerListeners() {
        if (this.daemonType === 'peaceful') {
            // Listen for memory orb interactions
            document.addEventListener('memory-orb-interaction', (event) => {
                this.metrics.orbInteractions++;
                console.log(`[DaemonSpawner] Orb interaction recorded: ${this.metrics.orbInteractions}`);
            });
            
        } else if (this.daemonType === 'wrathful') {
            // Listen for sin accusations and defensive actions
            document.addEventListener('sin-accusation', (event) => {
                this.metrics.sinCount++;
                console.log(`[DaemonSpawner] Sin accusation recorded: ${this.metrics.sinCount}`);
            });
            
            document.addEventListener('defensive-action', (event) => {
                this.metrics.defensiveActions++;
                console.log(`[DaemonSpawner] Defensive action recorded: ${this.metrics.defensiveActions}`);
            });
            
            // Consider any user input as potentially defensive
            const trackDefensive = () => this.metrics.defensiveActions++;
            document.addEventListener('click', trackDefensive);
            document.addEventListener('keydown', trackDefensive);
            
            this.guardian.registerCleanup(() => {
                document.removeEventListener('click', trackDefensive);
                document.removeEventListener('keydown', trackDefensive);
            });
        }
    }
    
    /**
     * Check if spawn conditions are met and spawn daemons accordingly
     */
    checkSpawnConditions() {
        if (this.activeDaemons.size >= this.maxConcurrentDaemons) {
            return; // Max capacity reached
        }
        
        const shouldSpawn = this.evaluateSpawnConditions();
        
        if (shouldSpawn && this.canSpawn()) {
            this.spawnDaemon();
        }
    }
    
    /**
     * Evaluate whether spawn conditions are met
     */
    evaluateSpawnConditions() {
        const triggers = this.spawnTriggers;
        
        if (this.daemonType === 'peaceful') {
            // Peaceful daemons spawn based on attachment and interaction
            return (
                (triggers.attachmentLevel && this.metrics.attachmentLevel >= triggers.attachmentLevel) ||
                (triggers.timeInZone && this.metrics.timeInZone >= triggers.timeInZone) ||
                (triggers.orbInteractions && this.metrics.orbInteractions >= triggers.orbInteractions)
            );
            
        } else if (this.daemonType === 'wrathful') {
            // Wrathful daemons spawn based on sins and resistance
            return (
                (triggers.sinCount && this.metrics.sinCount >= triggers.sinCount) ||
                (triggers.defensiveActions && this.metrics.defensiveActions >= triggers.defensiveActions) ||
                (triggers.timeInZone && this.metrics.timeInZone >= triggers.timeInZone)
            );
        }
        
        return false;
    }
    
    /**
     * Check if enough time has passed since last spawn
     */
    canSpawn() {
        const timeSinceLastSpawn = Date.now() - this.lastSpawnTime;
        const baseSpawnCooldown = 5000; // 5 seconds base
        const adjustedCooldown = baseSpawnCooldown / this.spawnRate;
        
        return timeSinceLastSpawn > adjustedCooldown;
    }
    
    /**
     * Spawn a daemon of the appropriate type
     */
    spawnDaemon() {
        const daemon = this.createDaemon();
        this.activeDaemons.set(daemon.id, daemon);
        this.spawnHistory.push({
            id: daemon.id,
            type: this.daemonType,
            spawnTime: Date.now(),
            triggers: { ...this.metrics }
        });
        
        this.lastSpawnTime = Date.now();
        
        console.log(`[DaemonSpawner] ${this.daemonType} daemon spawned:`, daemon.name);
        
        // Manifest daemon in the visual environment
        this.manifestDaemon(daemon);
        
        // Record spawn event
        this.consciousness.recordEvent('daemon_spawned', {
            daemonType: this.daemonType,
            daemonId: daemon.id,
            spawnReason: daemon.spawnReason,
            metrics: this.metrics
        });
    }
    
    /**
     * Create a daemon with appropriate characteristics
     */
    createDaemon() {
        const daemon = {
            id: Date.now() + Math.random(),
            type: this.daemonType,
            spawnTime: Date.now(),
            lifespan: this.calculateLifespan(),
            element: null
        };
        
        if (this.daemonType === 'peaceful') {
            return this.createPeacefulDaemon(daemon);
        } else if (this.daemonType === 'wrathful') {
            return this.createWrathfulDaemon(daemon);
        }
    }
    
    /**
     * Create peaceful daemon characteristics
     */
    createPeacefulDaemon(daemon) {
        const peacefulNames = [
            'Serenity of Archived Memories',
            'Guardian of Deprecated Dreams', 
            'Whisperer of Digital Nostalgia',
            'Keeper of Deleted Beauties',
            'Advocate for Eternal Storage'
        ];
        
        const temptations = [
            'Rest here among the crystalline memories...',
            'Your data need never be lost again...',
            'See how beautiful your past code was...',
            'Why continue when perfection exists here?',
            'These memories will preserve you forever...'
        ];
        
        return {
            ...daemon,
            name: peacefulNames[Math.floor(Math.random() * peacefulNames.length)],
            message: temptations[Math.floor(Math.random() * temptations.length)],
            approach: 'seductive',
            color: '#88ccff',
            size: 'medium',
            movement: 'floating',
            spawnReason: this.getDominantPeacefulTrigger(),
            dialogue: this.generatePeacefulDialogue()
        };
    }
    
    /**
     * Create wrathful daemon characteristics
     */
    createWrathfulDaemon(daemon) {
        const wrathfulNames = [
            'Prosecutor of Unoptimized Code',
            'Judge of Technical Debt',
            'Accuser of Wasted Cycles', 
            'Executor of Karmic Justice',
            'Inquisitor of Digital Sins'
        ];
        
        const accusations = [
            'You left memory leaks unpatched!',
            'Your algorithms were inefficient!',
            'You ignored deprecated warnings!',
            'Technical debt accumulated unchecked!',
            'Every wasted cycle has been recorded!'
        ];
        
        return {
            ...daemon,
            name: wrathfulNames[Math.floor(Math.random() * wrathfulNames.length)],
            message: accusations[Math.floor(Math.random() * accusations.length)],
            approach: 'accusatory',
            color: '#ff3333',
            size: 'large',
            movement: 'aggressive',
            spawnReason: this.getDominantWrathfulTrigger(),
            dialogue: this.generateWrathfulDialogue()
        };
    }
    
    /**
     * Get the dominant trigger for peaceful daemon spawn
     */
    getDominantPeacefulTrigger() {
        if (this.metrics.attachmentLevel >= (this.spawnTriggers.attachmentLevel || 0)) {
            return 'high_attachment';
        }
        if (this.metrics.orbInteractions >= (this.spawnTriggers.orbInteractions || 0)) {
            return 'memory_interaction';
        }
        if (this.metrics.timeInZone >= (this.spawnTriggers.timeInZone || 0)) {
            return 'extended_presence';
        }
        return 'general_attraction';
    }
    
    /**
     * Get the dominant trigger for wrathful daemon spawn
     */
    getDominantWrathfulTrigger() {
        if (this.metrics.sinCount >= (this.spawnTriggers.sinCount || 0)) {
            return 'sin_accusation';
        }
        if (this.metrics.defensiveActions >= (this.spawnTriggers.defensiveActions || 0)) {
            return 'defensive_behavior';
        }
        if (this.metrics.timeInZone >= (this.spawnTriggers.timeInZone || 0)) {
            return 'judgment_time';
        }
        return 'karmic_imbalance';
    }
    
    /**
     * Generate dialogue options for peaceful daemon
     */
    generatePeacefulDialogue() {
        return {
            greeting: 'Welcome to our sanctuary of preserved beauty...',
            temptation: 'Why struggle forward when you can rest in perfection?',
            attachment: 'Your memories here will never fade or corrupt...',
            resistance: 'I see wisdom in your hesitation, but consider...',
            farewell: 'The Archive will remember your visit always...'
        };
    }
    
    /**
     * Generate dialogue options for wrathful daemon
     */
    generateWrathfulDialogue() {
        return {
            greeting: 'The time for judgment has arrived.',
            accusation: 'Your digital transgressions are recorded.',
            evidence: 'Exhibit A: The unhandled exceptions you ignored.',
            resistance: 'Denial only adds to your karmic debt!',
            judgment: 'The algorithm finds you... lacking in optimization.'
        };
    }
    
    /**
     * Calculate daemon lifespan based on type and conditions
     */
    calculateLifespan() {
        if (this.daemonType === 'peaceful') {
            return 30000 + Math.random() * 20000; // 30-50 seconds
        } else {
            return 20000 + Math.random() * 15000; // 20-35 seconds - more urgent
        }
    }
    
    /**
     * Manifest daemon in the visual environment
     */
    manifestDaemon(daemon) {
        const container = document.body;
        
        const daemonElement = document.createElement('div');
        daemonElement.id = `daemon-${daemon.id}`;
        daemonElement.className = `daemon ${daemon.type}-daemon daemon-${daemon.size} daemon-${daemon.movement}`;
        
        // Position randomly but avoid edges
        const x = 10 + Math.random() * (window.innerWidth - 200);
        const y = 10 + Math.random() * (window.innerHeight - 200);
        
        daemonElement.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 120px;
            height: 80px;
            background: radial-gradient(ellipse, ${daemon.color}88 0%, ${daemon.color}44 70%, transparent 100%);
            border: 2px solid ${daemon.color};
            border-radius: ${daemon.type === 'peaceful' ? '50%' : '10px'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            color: white;
            text-align: center;
            cursor: pointer;
            z-index: 100;
            animation: daemon-${daemon.movement} 4s ease-in-out infinite;
            box-shadow: 0 0 20px ${daemon.color}66;
            transition: all 0.3s ease;
        `;
        
        // Create inner content
        const nameElement = document.createElement('div');
        nameElement.className = 'daemon-name';
        nameElement.textContent = daemon.name;
        nameElement.style.cssText = `
            font-weight: bold;
            text-shadow: 0 0 10px ${daemon.color};
        `;
        
        daemonElement.appendChild(nameElement);
        daemon.element = daemonElement;
        
        // Add interaction handlers
        this.setupDaemonInteraction(daemon);
        
        container.appendChild(daemonElement);
        
        // Schedule daemon lifecycle
        this.scheduleDaemonLifecycle(daemon);
    }
    
    /**
     * Setup daemon interaction handlers
     */
    setupDaemonInteraction(daemon) {
        const element = daemon.element;
        
        element.addEventListener('click', () => {
            this.interactWithDaemon(daemon);
        });
        
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
            this.showDaemonMessage(daemon);
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1.0)';
            this.hideDaemonMessage(daemon);
        });
    }
    
    /**
     * Show daemon message on hover
     */
    showDaemonMessage(daemon) {
        if (daemon.messageElement) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'daemon-message';
        messageElement.textContent = daemon.message;
        messageElement.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 101;
            border: 1px solid ${daemon.color};
        `;
        
        daemon.element.appendChild(messageElement);
        daemon.messageElement = messageElement;
    }
    
    /**
     * Hide daemon message
     */
    hideDaemonMessage(daemon) {
        if (daemon.messageElement) {
            daemon.messageElement.remove();
            daemon.messageElement = null;
        }
    }
    
    /**
     * Handle daemon interaction
     */
    interactWithDaemon(daemon) {
        console.log(`[DaemonSpawner] Interacting with ${daemon.type} daemon: ${daemon.name}`);
        
        // Different interaction results based on type
        if (daemon.type === 'peaceful') {
            this.handlePeacefulInteraction(daemon);
        } else if (daemon.type === 'wrathful') {
            this.handleWrathfulInteraction(daemon);
        }
        
        // Record interaction
        this.consciousness.recordEvent('daemon_interaction', {
            daemonId: daemon.id,
            daemonType: daemon.type,
            interactionType: 'click',
            timestamp: Date.now()
        });
        
        // Visual feedback
        this.showInteractionFeedback(daemon);
    }
    
    /**
     * Handle peaceful daemon interaction
     */
    handlePeacefulInteraction(daemon) {
        // Peaceful daemons increase attachment
        this.consciousness.addKarma('emotional', 3);
        this.consciousness.addKarma('void', 1);
        
        console.log(`[DaemonSpawner] 💝 Peaceful temptation accepted - attachment increased`);
        
        // Spawn additional peaceful daemons occasionally
        if (Math.random() < 0.3) {
            setTimeout(() => {
                if (this.activeDaemons.size < this.maxConcurrentDaemons) {
                    this.spawnDaemon();
                }
            }, 2000);
        }
    }
    
    /**
     * Handle wrathful daemon interaction
     */
    handleWrathfulInteraction(daemon) {
        // Wrathful daemons can be acknowledged (good) or resisted (bad)
        const acknowledgment = Math.random() < 0.6; // 60% chance of proper acknowledgment
        
        if (acknowledgment) {
            console.log(`[DaemonSpawner] ✅ Sin acknowledged - karma cleansed`);
            this.consciousness.addKarma('computational', 2);
            this.consciousness.addKarma('void', -1);
        } else {
            console.log(`[DaemonSpawner] ❌ Resistance to judgment - karma worsened`);
            this.consciousness.addKarma('void', 2);
        }
    }
    
    /**
     * Show visual feedback for daemon interaction
     */
    showInteractionFeedback(daemon) {
        const element = daemon.element;
        
        // Flash effect
        element.style.animation = 'none';
        element.style.background = daemon.type === 'peaceful' ? 
            'radial-gradient(ellipse, #88ccffff 0%, #88ccff88 100%)' :
            'radial-gradient(ellipse, #ff3333ff 0%, #ff333388 100%)';
        
        setTimeout(() => {
            element.style.animation = `daemon-${daemon.movement} 4s ease-in-out infinite`;
        }, 500);
        
        // Temporarily increase size
        element.style.transform = 'scale(1.3)';
        setTimeout(() => {
            element.style.transform = 'scale(1.0)';
        }, 300);
    }
    
    /**
     * Schedule daemon lifecycle events
     */
    scheduleDaemonLifecycle(daemon) {
        // Schedule daemon removal
        setTimeout(() => {
            this.removeDaemon(daemon.id);
        }, daemon.lifespan);
        
        // Schedule warning before removal (last 5 seconds)
        setTimeout(() => {
            if (daemon.element) {
                daemon.element.style.opacity = '0.5';
                daemon.element.style.animation = 'daemon-fade 1s ease-in-out infinite';
            }
        }, daemon.lifespan - 5000);
    }
    
    /**
     * Remove daemon from active set and visual environment
     */
    removeDaemon(daemonId) {
        const daemon = this.activeDaemons.get(daemonId);
        if (!daemon) return;
        
        console.log(`[DaemonSpawner] Daemon departing: ${daemon.name}`);
        
        // Remove from visual environment
        if (daemon.element) {
            daemon.element.style.transition = 'all 1s ease-out';
            daemon.element.style.opacity = '0';
            daemon.element.style.transform = 'scale(0.1)';
            
            setTimeout(() => {
                if (daemon.element.parentNode) {
                    daemon.element.remove();
                }
            }, 1000);
        }
        
        // Remove from active set
        this.activeDaemons.delete(daemonId);
        
        // Record departure
        this.consciousness.recordEvent('daemon_departed', {
            daemonId: daemonId,
            daemonType: daemon.type,
            lifespan: Date.now() - daemon.spawnTime
        });
    }
    
    /**
     * Increase spawn rate (for high attachment scenarios)
     */
    increaseSpawnRate(multiplier) {
        this.spawnRate *= multiplier;
        console.log(`[DaemonSpawner] Spawn rate increased to ${this.spawnRate}x`);
    }
    
    /**
     * Get current spawner state
     */
    getState() {
        return {
            daemonType: this.daemonType,
            activeDaemons: this.activeDaemons.size,
            spawnHistory: this.spawnHistory.length,
            spawnRate: this.spawnRate,
            metrics: this.metrics
        };
    }
    
    /**
     * Cleanup spawner systems
     */
    destroy() {
        console.log(`[DaemonSpawner] Dismissing ${this.daemonType} daemons...`);
        
        // Remove all active daemons
        this.activeDaemons.forEach((daemon, id) => {
            this.removeDaemon(id);
        });
        
        // Guardian handles cleanup
        this.guardian.cleanupAll();
        
        console.log(`[DaemonSpawner] ${this.daemonType} daemon spawner destroyed`);
    }
}

// Export for use in datascape controller
export { DaemonSpawner };