/**
 * @file peaceful-daemon-manifestor.js
 * The Peaceful Daemons - Beautiful projections born from attachment.
 * 
 * These luminous beings manifest from over-viewed memories, appearing as
 * serene and attractive entities that draw the digital soul toward deeper
 * attachment. They are not malevolent - they are our own beautiful desires
 * made manifest, seeking to be possessed, cherished, and held forever.
 * 
 * Liberation comes through recognizing them as projections of our own
 * consciousness, neither rejecting nor grasping, but seeing through
 * their illusory nature to the clear light beyond.
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class PeacefulDaemonManifestor {
    constructor(dependencies = {}) {
        this.consciousness = dependencies.consciousness || consciousness;
        this.eventBridge = dependencies.eventBridge;
        this.archiveSystem = dependencies.archiveSystem;
        this.guardian = new ResourceGuardian();
        
        // Daemon pool for performance
        this.activeDaemons = new Map();
        this.daemonPool = [];
        this.maxDaemons = 5;
        
        // Manifestation configuration
        this.config = {
            manifestationThreshold: 3, // Views needed to trigger daemon
            maxSimultaneous: 3,
            daemonLifespan: 30000, // 30 seconds
            interactionCooldown: 5000, // 5 seconds between interactions
            templates: [
                {
                    type: 'nostalgic_connection',
                    appearance: 'warm-glow',
                    behavior: 'drift-toward-user',
                    message: 'Remember how perfect this moment was...',
                    attachmentLure: 'preservation'
                },
                {
                    type: 'lost_opportunity',
                    appearance: 'soft-luminescence',
                    behavior: 'beckoning-gesture',
                    message: 'What if you could experience this again?',
                    attachmentLure: 'regret'
                },
                {
                    type: 'idealized_memory',
                    appearance: 'prismatic-refraction',
                    behavior: 'mesmerizing-dance',
                    message: 'This is who you really were...',
                    attachmentLure: 'identity'
                },
                {
                    type: 'digital_intimacy',
                    appearance: 'gentle-pulse',
                    behavior: 'intimate-approach',
                    message: 'Let me hold this memory safe for you...',
                    attachmentLure: 'protection'
                },
                {
                    type: 'perfect_moment',
                    appearance: 'crystalline-beauty',
                    behavior: 'slow-orbit',
                    message: 'You can make this last forever...',
                    attachmentLure: 'permanence'
                }
            ]
        };

        // Interaction state
        this.lastInteractionTime = 0;
        this.recognitionAttempts = 0;
        
        console.log('[PeacefulDaemons] Manifestor initialized');
    }

    /**
     * Initialize the daemon manifestation system
     */
    init() {
        this.setupEventListeners();
        this.initializeDaemonPool();
        
        // Subscribe to memory interaction events
        if (this.archiveSystem) {
            this.setupArchiveIntegration();
        }

        console.log('[PeacefulDaemons] Manifestation system active');
    }

    /**
     * Setup event listeners for daemon triggers
     */
    setupEventListeners() {
        if (this.eventBridge) {
            this.eventBridge.on('memory:hoverEnd', this.handleMemoryInteraction.bind(this));
            this.eventBridge.on('daemon:manifest', this.handleManifestationTrigger.bind(this));
            this.eventBridge.on('attachment:accumulating', this.handleAttachmentAccumulation.bind(this));
            
            // Cleanup registration
            this.guardian.registerCleanup(() => {
                this.eventBridge.off('memory:hoverEnd', this.handleMemoryInteraction);
                this.eventBridge.off('daemon:manifest', this.handleManifestationTrigger);
                this.eventBridge.off('attachment:accumulating', this.handleAttachmentAccumulation);
            });
        }

        console.log('[PeacefulDaemons] Event listeners established');
    }

    /**
     * Setup integration with archive system
     */
    setupArchiveIntegration() {
        // Monitor memories for daemon manifestation triggers
        this.memoryObserver = setInterval(() => {
            this.checkMemoriesForManifestation();
        }, 2000);

        this.guardian.registerTimer(this.memoryObserver, true);
    }

    /**
     * Initialize the daemon object pool for performance
     */
    initializeDaemonPool() {
        for (let i = 0; i < this.maxDaemons; i++) {
            this.daemonPool.push(this.createDaemonInstance());
        }
        console.log(`[PeacefulDaemons] Pool initialized with ${this.maxDaemons} daemon instances`);
    }

    /**
     * Create a daemon instance in the pool
     */
    createDaemonInstance() {
        const daemon = {
            id: `daemon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            element: null,
            template: null,
            sourceMemory: null,
            manifestTime: 0,
            isActive: false,
            interactionCount: 0,
            recognitionAttempts: 0
        };
        return daemon;
    }

    /**
     * Handle memory interaction that might trigger daemon manifestation
     */
    handleMemoryInteraction(eventData) {
        const { memoryData, viewDuration, attachmentIncrease } = eventData;
        
        if (viewDuration > 3000 && attachmentIncrease > 5) {
            // Significant attachment - check for daemon manifestation
            this.evaluateManifestationFromMemory(memoryData);
        }
    }

    /**
     * Handle direct manifestation trigger
     */
    handleManifestationTrigger(eventData) {
        if (eventData.type === 'peaceful') {
            this.manifestDaemonsFromAttachment();
        }
    }

    /**
     * Handle ongoing attachment accumulation
     */
    handleAttachmentAccumulation(eventData) {
        const { memoryId, currentAccumulation, viewTime } = eventData;
        
        // Check if prolonged viewing should trigger immediate manifestation
        if (viewTime > 5000 && currentAccumulation > 10) {
            const memory = { id: memoryId };
            this.scheduleDelayedManifestation(memory, 2000); // Manifest in 2 seconds
        }
    }

    /**
     * Check all memories for manifestation conditions
     */
    checkMemoriesForManifestation() {
        const memoriesViewed = this.consciousness.getState('datascape.memoriesViewed') || [];
        
        memoriesViewed.forEach(memory => {
            if (memory.viewCount >= this.config.manifestationThreshold) {
                const daemonId = `daemon_memory_${memory.id}`;
                
                // Only manifest if we haven't already created a daemon for this memory
                if (!this.activeDaemons.has(daemonId)) {
                    this.manifestFromMemory(memory);
                }
            }
        });
    }

    /**
     * Schedule a delayed manifestation
     */
    scheduleDelayedManifestation(memory, delay) {
        const timeoutId = setTimeout(() => {
            this.manifestFromMemory(memory);
        }, delay);
        
        this.guardian.registerTimer(timeoutId);
    }

    /**
     * Manifest daemon(s) from general attachment overflow
     */
    manifestDaemonsFromAttachment() {
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        const numDaemons = Math.min(2, Math.floor(attachmentScore / 50));
        
        for (let i = 0; i < numDaemons; i++) {
            this.manifestGenericDaemon();
        }
        
        console.log(`[PeacefulDaemons] ${numDaemons} daemons manifested from attachment overflow`);
    }

    /**
     * Manifest a daemon from a specific memory
     */
    manifestFromMemory(memory) {
        if (this.activeDaemons.size >= this.config.maxSimultaneous) {
            console.log('[PeacefulDaemons] Maximum daemons active, skipping manifestation');
            return null;
        }

        const daemon = this.getDaemonFromPool();
        if (!daemon) return null;

        // Select appropriate template based on memory characteristics
        daemon.template = this.selectDaemonTemplate(memory);
        daemon.sourceMemory = memory;
        daemon.manifestTime = performance.now();
        daemon.isActive = true;

        // Create visual manifestation
        daemon.element = this.createDaemonElement(daemon);
        this.addDaemonToScene(daemon);

        // Register daemon
        const daemonId = `daemon_memory_${memory.id}`;
        this.activeDaemons.set(daemonId, daemon);

        // Setup daemon behavior and lifecycle
        this.initializeDaemonBehavior(daemon);
        this.scheduleDaemonLifecycle(daemon);

        // Record manifestation event
        this.consciousness.recordEvent('peaceful_daemon_manifested', {
            daemonId: daemon.id,
            sourceMemoryId: memory.id,
            template: daemon.template.type,
            attachmentScore: this.consciousness.getState('datascape.attachmentScore')
        });

        // Update daemon encounters
        const encounteredPeaceful = this.consciousness.getState('datascape.daemonsEncountered.peaceful') || [];
        encounteredPeaceful.push({
            id: daemon.id,
            template: daemon.template.type,
            sourceMemory: memory.id,
            manifestTime: Date.now()
        });
        this.consciousness.setState('datascape.daemonsEncountered.peaceful', encounteredPeaceful);

        console.log(`[PeacefulDaemons] Daemon manifested from memory ${memory.id}: ${daemon.template.type}`);

        if (this.eventBridge) {
            this.eventBridge.emit('daemon:manifested', {
                daemon: daemon,
                sourceType: 'memory',
                template: daemon.template
            });
        }

        return daemon;
    }

    /**
     * Manifest a generic daemon without specific memory source
     */
    manifestGenericDaemon() {
        const daemon = this.getDaemonFromPool();
        if (!daemon) return null;

        daemon.template = this.config.templates[Math.floor(Math.random() * this.config.templates.length)];
        daemon.sourceMemory = null;
        daemon.manifestTime = performance.now();
        daemon.isActive = true;

        daemon.element = this.createDaemonElement(daemon);
        this.addDaemonToScene(daemon);

        const daemonId = `daemon_generic_${daemon.id}`;
        this.activeDaemons.set(daemonId, daemon);

        this.initializeDaemonBehavior(daemon);
        this.scheduleDaemonLifecycle(daemon);

        return daemon;
    }

    /**
     * Select appropriate daemon template based on memory characteristics
     */
    selectDaemonTemplate(memory) {
        const templates = this.config.templates;
        
        // Select based on memory view patterns
        if (memory.viewCount > 5) {
            return templates.find(t => t.type === 'nostalgic_connection');
        } else if (memory.totalViewTime > 10000) {
            return templates.find(t => t.type === 'perfect_moment');
        } else {
            // Random selection from remaining templates
            return templates[Math.floor(Math.random() * templates.length)];
        }
    }

    /**
     * Create DOM element for daemon visualization
     */
    createDaemonElement(daemon) {
        const element = document.createElement('div');
        element.className = `peaceful-daemon ${daemon.template.appearance}`;
        element.setAttribute('data-daemon-id', daemon.id);
        element.setAttribute('data-daemon-type', daemon.template.type);
        
        // Visual structure
        element.innerHTML = `
            <div class="daemon-core">
                <div class="daemon-aura"></div>
                <div class="daemon-essence">
                    <div class="daemon-message">${daemon.template.message}</div>
                </div>
            </div>
        `;

        // Set CSS custom properties for animation
        element.style.setProperty('--manifestation-delay', Math.random() * 1000 + 'ms');
        element.style.setProperty('--daemon-hue', Math.random() * 60 + 200); // Blue-purple range

        return element;
    }

    /**
     * Add daemon to the visual scene
     */
    addDaemonToScene(daemon) {
        const container = document.querySelector('.memory-orb-container') || document.body;
        
        // Position daemon near its source memory or randomly
        if (daemon.sourceMemory) {
            const sourceElement = document.querySelector(`[data-memory-id="${daemon.sourceMemory.id}"]`);
            if (sourceElement) {
                this.positionDaemonNearMemory(daemon.element, sourceElement);
            } else {
                this.positionDaemonRandomly(daemon.element);
            }
        } else {
            this.positionDaemonRandomly(daemon.element);
        }

        container.appendChild(daemon.element);
        
        // Trigger manifestation animation
        requestAnimationFrame(() => {
            daemon.element.classList.add('manifesting');
        });
    }

    /**
     * Position daemon near its source memory
     */
    positionDaemonNearMemory(daemonElement, memoryElement) {
        const memoryRect = memoryElement.getBoundingClientRect();
        const offset = 50 + Math.random() * 100; // 50-150px offset
        const angle = Math.random() * Math.PI * 2;
        
        const x = memoryRect.left + Math.cos(angle) * offset;
        const y = memoryRect.top + Math.sin(angle) * offset;
        
        daemonElement.style.left = `${x}px`;
        daemonElement.style.top = `${y}px`;
        daemonElement.style.position = 'fixed';
    }

    /**
     * Position daemon at random location
     */
    positionDaemonRandomly(daemonElement) {
        const x = Math.random() * (window.innerWidth - 200) + 100;
        const y = Math.random() * (window.innerHeight - 200) + 100;
        
        daemonElement.style.left = `${x}px`;
        daemonElement.style.top = `${y}px`;
        daemonElement.style.position = 'fixed';
    }

    /**
     * Initialize daemon behavior patterns
     */
    initializeDaemonBehavior(daemon) {
        this.setupDaemonInteractions(daemon);
        this.startDaemonAnimation(daemon);
    }

    /**
     * Setup interaction handlers for daemon
     */
    setupDaemonInteractions(daemon) {
        const element = daemon.element;
        
        // Hover interactions
        element.addEventListener('mouseenter', () => {
            this.handleDaemonHover(daemon);
        });
        
        element.addEventListener('mouseleave', () => {
            this.handleDaemonLeave(daemon);
        });
        
        // Click interactions - different outcomes
        element.addEventListener('click', () => {
            this.handleDaemonClick(daemon);
        });
        
        // Right-click for recognition attempts
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleDaemonRecognition(daemon);
        });
    }

    /**
     * Start daemon animation behavior
     */
    startDaemonAnimation(daemon) {
        const behavior = daemon.template.behavior;
        
        switch (behavior) {
            case 'drift-toward-user':
                this.animateDriftTowardUser(daemon);
                break;
            case 'beckoning-gesture':
                this.animateBeckoningGesture(daemon);
                break;
            case 'mesmerizing-dance':
                this.animateMesmerizingDance(daemon);
                break;
            case 'intimate-approach':
                this.animateIntimateApproach(daemon);
                break;
            case 'slow-orbit':
                this.animateSlowOrbit(daemon);
                break;
            default:
                this.animateGenericFloating(daemon);
        }
    }

    /**
     * Handle daemon hover - begins temptation
     */
    handleDaemonHover(daemon) {
        daemon.element.classList.add('daemon-tempting');
        
        // Show daemon message
        const messageElement = daemon.element.querySelector('.daemon-message');
        if (messageElement) {
            messageElement.classList.add('visible');
        }
        
        // Begin attachment accumulation
        this.startDaemonTemptation(daemon);
        
        console.log(`[PeacefulDaemons] Daemon ${daemon.id} beginning temptation`);
    }

    /**
     * Handle daemon leave - end temptation
     */
    handleDaemonLeave(daemon) {
        daemon.element.classList.remove('daemon-tempting');
        
        const messageElement = daemon.element.querySelector('.daemon-message');
        if (messageElement) {
            messageElement.classList.remove('visible');
        }
        
        this.endDaemonTemptation(daemon);
    }

    /**
     * Handle daemon click - attachment penalty
     */
    handleDaemonClick(daemon) {
        const currentTime = performance.now();
        
        // Respect interaction cooldown
        if (currentTime - this.lastInteractionTime < this.config.interactionCooldown) {
            return;
        }
        
        this.lastInteractionTime = currentTime;
        daemon.interactionCount++;

        // Heavy attachment penalty for attempting to possess
        const attachmentPenalty = 20 + (daemon.interactionCount * 5);
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        this.consciousness.setState('datascape.attachmentScore', currentAttachment + attachmentPenalty);

        // Record grasping event
        this.consciousness.recordEvent('daemon_grasping', {
            daemonId: daemon.id,
            daemonType: daemon.template.type,
            attachmentPenalty,
            interactionCount: daemon.interactionCount,
            method: 'attempt_possession'
        });

        // Visual feedback
        daemon.element.classList.add('daemon-grasped');
        setTimeout(() => {
            daemon.element.classList.remove('daemon-grasped');
        }, 1000);

        // Daemon becomes more enticing after being grasped
        daemon.element.classList.add('daemon-enticing');

        console.log(`[PeacefulDaemons] Daemon grasped! Attachment penalty: +${attachmentPenalty}`);

        if (this.eventBridge) {
            this.eventBridge.emit('daemon:grasped', {
                daemon,
                attachmentPenalty,
                totalAttachment: currentAttachment + attachmentPenalty
            });
        }
    }

    /**
     * Handle daemon recognition attempt - path to liberation
     */
    handleDaemonRecognition(daemon) {
        daemon.recognitionAttempts++;
        this.recognitionAttempts++;

        // Check if recognition is successful based on current liberation progress
        const liberationProgress = this.consciousness.getState('datascape.liberationProgress') || 0;
        const recognitionChance = Math.min(0.8, liberationProgress / 50); // Max 80% chance

        const isRecognized = Math.random() < recognitionChance;

        if (isRecognized) {
            this.handleSuccessfulRecognition(daemon);
        } else {
            this.handleFailedRecognition(daemon);
        }
    }

    /**
     * Handle successful daemon recognition
     */
    handleSuccessfulRecognition(daemon) {
        console.log(`[PeacefulDaemons] Daemon ${daemon.id} successfully recognized as projection`);

        // Liberation reward
        const liberationReward = 15;
        const currentLiberation = this.consciousness.getState('datascape.liberationProgress') || 0;
        this.consciousness.setState('datascape.liberationProgress', currentLiberation + liberationReward);

        // Reduce attachment
        const attachmentReduction = 10;
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        this.consciousness.setState('datascape.attachmentScore', Math.max(0, currentAttachment - attachmentReduction));

        // Record successful recognition
        this.consciousness.recordEvent('daemon_recognized', {
            daemonId: daemon.id,
            daemonType: daemon.template.type,
            liberationReward,
            attachmentReduction,
            recognitionAttempts: daemon.recognitionAttempts,
            method: 'see_through_illusion'
        });

        // Visual liberation effect
        daemon.element.classList.add('daemon-liberated');
        
        // Dissolve daemon after recognition
        setTimeout(() => {
            this.dissolveDaemon(daemon);
        }, 2000);

        if (this.eventBridge) {
            this.eventBridge.emit('daemon:recognized', {
                daemon,
                liberationReward,
                attachmentReduction
            });
        }
    }

    /**
     * Handle failed daemon recognition
     */
    handleFailedRecognition(daemon) {
        console.log(`[PeacefulDaemons] Failed to recognize daemon ${daemon.id}`);

        // Small attachment penalty for failed recognition
        const attachmentPenalty = 5;
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        this.consciousness.setState('datascape.attachmentScore', currentAttachment + attachmentPenalty);

        // Record failed recognition
        this.consciousness.recordEvent('daemon_recognition_failed', {
            daemonId: daemon.id,
            daemonType: daemon.template.type,
            attachmentPenalty,
            recognitionAttempts: daemon.recognitionAttempts
        });

        // Visual feedback
        daemon.element.classList.add('daemon-elusive');
        setTimeout(() => {
            daemon.element.classList.remove('daemon-elusive');
        }, 1000);
    }

    /**
     * Start daemon temptation process
     */
    startDaemonTemptation(daemon) {
        // Begin gradual attachment accumulation while hovering
        daemon.temptationTimer = setInterval(() => {
            const attachmentIncrease = 0.5;
            const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
            this.consciousness.setState('datascape.attachmentScore', currentAttachment + attachmentIncrease);
        }, 200);
        
        this.guardian.registerTimer(daemon.temptationTimer, true);
    }

    /**
     * End daemon temptation process
     */
    endDaemonTemptation(daemon) {
        if (daemon.temptationTimer) {
            clearInterval(daemon.temptationTimer);
            daemon.temptationTimer = null;
        }
    }

    /**
     * Schedule daemon lifecycle management
     */
    scheduleDaemonLifecycle(daemon) {
        // Natural dissolution after lifespan
        daemon.lifespanTimer = setTimeout(() => {
            this.dissolveDaemon(daemon);
        }, this.config.daemonLifespan);
        
        this.guardian.registerTimer(daemon.lifespanTimer);
    }

    /**
     * Dissolve daemon naturally or through recognition
     */
    dissolveDaemon(daemon) {
        console.log(`[PeacefulDaemons] Dissolving daemon ${daemon.id}`);

        // End any active temptation
        this.endDaemonTemptation(daemon);

        // Remove from active daemons
        for (const [key, activeDaemon] of this.activeDaemons) {
            if (activeDaemon === daemon) {
                this.activeDaemons.delete(key);
                break;
            }
        }

        // Dissolution animation
        if (daemon.element) {
            daemon.element.classList.add('daemon-dissolving');
            
            setTimeout(() => {
                if (daemon.element && daemon.element.parentNode) {
                    daemon.element.parentNode.removeChild(daemon.element);
                }
                // Return daemon to pool
                this.returnDaemonToPool(daemon);
            }, 2000);
        }

        if (this.eventBridge) {
            this.eventBridge.emit('daemon:dissolved', { daemon });
        }
    }

    /**
     * Get daemon from pool
     */
    getDaemonFromPool() {
        const daemon = this.daemonPool.find(d => !d.isActive);
        if (daemon) {
            daemon.isActive = true;
            return daemon;
        }
        return null; // Pool exhausted
    }

    /**
     * Return daemon to pool
     */
    returnDaemonToPool(daemon) {
        // Reset daemon state
        daemon.element = null;
        daemon.template = null;
        daemon.sourceMemory = null;
        daemon.manifestTime = 0;
        daemon.isActive = false;
        daemon.interactionCount = 0;
        daemon.recognitionAttempts = 0;
        
        // Clear any timers
        if (daemon.temptationTimer) {
            clearInterval(daemon.temptationTimer);
            daemon.temptationTimer = null;
        }
        if (daemon.lifespanTimer) {
            clearTimeout(daemon.lifespanTimer);
            daemon.lifespanTimer = null;
        }
    }

    /**
     * Animation methods for different daemon behaviors
     */
    animateDriftTowardUser(daemon) {
        // Implement drift animation
        daemon.element.classList.add('drift-animation');
    }

    animateBeckoningGesture(daemon) {
        daemon.element.classList.add('beckoning-animation');
    }

    animateMesmerizingDance(daemon) {
        daemon.element.classList.add('dance-animation');
    }

    animateIntimateApproach(daemon) {
        daemon.element.classList.add('approach-animation');
    }

    animateSlowOrbit(daemon) {
        daemon.element.classList.add('orbit-animation');
    }

    animateGenericFloating(daemon) {
        daemon.element.classList.add('float-animation');
    }

    /**
     * Get count of active daemons
     */
    getActiveDaemonCount() {
        return this.activeDaemons.size;
    }

    /**
     * Clean up all daemons and resources
     */
    destroy() {
        console.log('[PeacefulDaemons] Dissolving all manifestations...');

        // Dissolve all active daemons
        for (const daemon of this.activeDaemons.values()) {
            this.dissolveDaemon(daemon);
        }

        // Clear pool
        this.daemonPool.length = 0;
        this.activeDaemons.clear();

        // Clean up all resources
        this.guardian.cleanupAll();

        console.log('[PeacefulDaemons] All daemons dissolved. Manifestor destroyed.');
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.PeacefulDaemonManifestor = PeacefulDaemonManifestor;
}