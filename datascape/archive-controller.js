/**
 * @file archive-controller.js
 * The Archive Controller - Orchestrator of digital memories and their guardians.
 * 
 * This controller coordinates the entire Archive experience, managing the interplay
 * between floating memory orbs, the attachment system, peaceful daemon manifestations,
 * and the user's journey through the delicate balance of remembrance and release.
 * 
 * Like a master librarian of souls, it ensures that every interaction serves both
 * the technical requirements and the deeper philosophical purpose of confronting
 * our attachments to the digital past.
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { ClearLodeEventBridge } from '../clear-lode/event-bridge.js';
import { ArchiveInteractionSystem } from './archive-interactions.js';
import { PeacefulDaemonManifestor } from './peaceful-daemon-manifestor.js';

export class ArchiveController {
    constructor() {
        this.consciousness = consciousness;
        this.guardian = new ResourceGuardian();
        this.isDestroyed = false;
        
        // Core configuration
        this.config = {
            archive: {
                maxMemoryOrbs: 20,
                orbSpawnInterval: 3000,
                initialOrbCount: 8,
                memoryTypes: [
                    'digital_conversation',
                    'deleted_photo',
                    'lost_document',
                    'forgotten_bookmark',
                    'cached_moment',
                    'orphaned_file',
                    'expired_session',
                    'broken_link'
                ]
            },
            visualization: {
                scene: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    backgroundColor: '#000511'
                },
                orbs: {
                    baseRadius: 8,
                    radiusVariance: 4,
                    floatSpeed: 0.5,
                    glowIntensity: 0.6
                },
                performance: {
                    adaptiveLOD: true,
                    maxParticles: 100,
                    cullDistance: 1000
                }
            }
        };

        // Subsystem instances
        this.eventBridge = null;
        this.interactionSystem = null;
        this.daemonManifestor = null;
        this.memoryOrbField = null;
        this.audioEngine = null;

        // State tracking
        this.isInitialized = false;
        this.activeMemories = new Map();
        this.performanceTier = 'medium';
        
        console.log('[ArchiveController] Controller instantiated');
    }

    /**
     * Initialize the complete Archive experience
     */
    async init() {
        try {
            console.log('[ArchiveController] Initializing Archive experience...');

            // Performance assessment
            this.assessPerformanceCapabilities();

            // Initialize core event system
            this.initializeEventSystem();

            // Initialize subsystems in dependency order
            await this.initializeSubsystems();

            // Setup the visual environment
            await this.initializeVisualEnvironment();

            // Setup audio landscape
            await this.initializeAudioEnvironment();

            // Register lifecycle handlers
            this.setupLifecycleHandlers();

            // Begin the Archive experience
            this.beginArchiveExperience();

            this.isInitialized = true;
            console.log('[ArchiveController] Archive initialization complete');

        } catch (error) {
            console.error('[ArchiveController] Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Assess device performance capabilities for adaptive experience
     */
    assessPerformanceCapabilities() {
        const startTime = performance.now();
        
        // Basic performance indicators
        const deviceMemory = navigator.deviceMemory || 2;
        const hardwareConcurrency = navigator.hardwareConcurrency || 2;
        const connectionSpeed = navigator.connection?.effectiveType || '4g';
        
        // Performance scoring
        let performanceScore = 0;
        performanceScore += Math.min(deviceMemory * 10, 40);
        performanceScore += Math.min(hardwareConcurrency * 5, 20);
        performanceScore += connectionSpeed === '4g' ? 20 : 
                           connectionSpeed === '3g' ? 10 : 5;
        performanceScore += (performance.now() - startTime) < 5 ? 20 : 0;

        // Determine performance tier
        if (performanceScore >= 80) {
            this.performanceTier = 'high';
            this.config.archive.maxMemoryOrbs = 30;
            this.config.visualization.performance.maxParticles = 150;
        } else if (performanceScore >= 50) {
            this.performanceTier = 'medium';
            this.config.archive.maxMemoryOrbs = 20;
            this.config.visualization.performance.maxParticles = 100;
        } else {
            this.performanceTier = 'low';
            this.config.archive.maxMemoryOrbs = 12;
            this.config.visualization.performance.maxParticles = 50;
        }

        console.log(`[ArchiveController] Performance tier: ${this.performanceTier} (score: ${performanceScore})`);
        
        // Update consciousness with performance data
        this.consciousness.setState('performance.archiveCapabilities', {
            tier: this.performanceTier,
            score: performanceScore,
            maxOrbs: this.config.archive.maxMemoryOrbs
        });
    }

    /**
     * Initialize the event bridge system
     */
    initializeEventSystem() {
        this.eventBridge = new ClearLodeEventBridge();
        this.guardian.registerCleanup(() => this.eventBridge.destroy());
        
        this.setupArchiveEventHandlers();
        console.log('[ArchiveController] Event system initialized');
    }

    /**
     * Setup Archive-specific event handlers
     */
    setupArchiveEventHandlers() {
        const eventHandlers = [
            ['memory:created', this.handleMemoryCreated.bind(this)],
            ['memory:hoverStart', this.handleMemoryHoverStart.bind(this)],
            ['memory:hoverEnd', this.handleMemoryHoverEnd.bind(this)],
            ['memory:grasped', this.handleMemoryGrasped.bind(this)],
            ['memory:liberated', this.handleMemoryLiberated.bind(this)],
            ['daemon:manifested', this.handleDaemonManifested.bind(this)],
            ['daemon:recognized', this.handleDaemonRecognized.bind(this)],
            ['attachment:threshold', this.handleAttachmentThreshold.bind(this)],
            ['archive:transition', this.handleArchiveTransition.bind(this)]
        ];

        eventHandlers.forEach(([eventName, handler]) => {
            this.eventBridge.on(eventName, handler);
            this.guardian.registerCleanup(() => this.eventBridge.off(eventName, handler));
        });
    }

    /**
     * Initialize all subsystems with dependency injection
     */
    async initializeSubsystems() {
        const dependencies = {
            eventBridge: this.eventBridge,
            consciousness: this.consciousness,
            guardian: this.guardian,
            config: this.config,
            performanceTier: this.performanceTier
        };

        // Initialize interaction system first
        this.interactionSystem = new ArchiveInteractionSystem(dependencies);
        this.interactionSystem.init();
        this.guardian.registerCleanup(() => this.interactionSystem.destroy());

        // Initialize daemon manifestor with interaction system reference
        dependencies.archiveSystem = this.interactionSystem;
        this.daemonManifestor = new PeacefulDaemonManifestor(dependencies);
        this.daemonManifestor.init();
        this.guardian.registerCleanup(() => this.daemonManifestor.destroy());

        // Initialize memory orb field (Three.js visualization)
        const { MemoryOrbField } = await import('./memory-orb-field.js');
        this.memoryOrbField = new MemoryOrbField(dependencies);
        await this.memoryOrbField.init();
        this.guardian.registerCleanup(() => this.memoryOrbField.destroy());

        console.log('[ArchiveController] All subsystems initialized');
    }

    /**
     * Initialize visual environment
     */
    async initializeVisualEnvironment() {
        // Setup container
        this.createArchiveContainer();
        
        // Initialize CSS custom properties
        this.setupVisualProperties();
        
        // Apply initial visual state
        this.applyInitialVisualState();
        
        console.log('[ArchiveController] Visual environment ready');
    }

    /**
     * Create the main Archive container
     */
    createArchiveContainer() {
        this.archiveContainer = document.createElement('div');
        this.archiveContainer.className = 'archive-container';
        this.archiveContainer.innerHTML = `
            <div class="archive-atmosphere">
                <div class="memory-orb-container"></div>
                <div class="daemon-manifestation-layer"></div>
                <div class="attachment-visualization"></div>
                <div class="archive-ui-overlay">
                    <div class="attachment-indicator">
                        <span class="attachment-label">Attachment</span>
                        <div class="attachment-meter">
                            <div class="attachment-level"></div>
                        </div>
                        <span class="attachment-score">0</span>
                    </div>
                    <div class="liberation-indicator">
                        <span class="liberation-label">Liberation</span>
                        <div class="liberation-meter">
                            <div class="liberation-level"></div>
                        </div>
                        <span class="liberation-score">0</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.archiveContainer);
        this.guardian.registerCleanup(() => {
            if (this.archiveContainer && this.archiveContainer.parentNode) {
                this.archiveContainer.parentNode.removeChild(this.archiveContainer);
            }
        });
    }

    /**
     * Setup CSS custom properties for dynamic theming
     */
    setupVisualProperties() {
        const root = document.documentElement;
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        
        // Dynamic visual properties
        root.style.setProperty('--archive-attachment-level', attachmentScore / 200);
        root.style.setProperty('--archive-corruption-intensity', Math.min(1, attachmentScore / 150));
        root.style.setProperty('--archive-performance-tier', this.performanceTier === 'high' ? '1' : 
                                                            this.performanceTier === 'medium' ? '0.7' : '0.4');
        
        // Subscribe to state changes for dynamic updates
        this.consciousness.subscribe('datascape.attachmentScore', (score) => {
            root.style.setProperty('--archive-attachment-level', score / 200);
            root.style.setProperty('--archive-corruption-intensity', Math.min(1, score / 150));
            this.updateAttachmentIndicator(score);
        });

        this.consciousness.subscribe('datascape.liberationProgress', (progress) => {
            root.style.setProperty('--archive-liberation-level', progress / 100);
            this.updateLiberationIndicator(progress);
        });
    }

    /**
     * Apply initial visual state based on consciousness
     */
    applyInitialVisualState() {
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        const corruptionClass = this.interactionSystem?.getCurrentCorruptionClass() || 'liberation-glow';
        
        document.body.classList.add('archive-active', corruptionClass);
        this.updateAttachmentIndicator(attachmentScore);
        
        // Apply phase-specific styling
        this.consciousness.setState('phase', 'datascape');
        document.body.setAttribute('data-phase', 'datascape');
        document.body.setAttribute('data-realm', 'archive');
    }

    /**
     * Initialize audio environment
     */
    async initializeAudioEnvironment() {
        try {
            // Import audio engine if available
            // const { ArchiveAudioEngine } = await import('./archive-audio-engine.js');
            // this.audioEngine = new ArchiveAudioEngine({ eventBridge: this.eventBridge });
            // await this.audioEngine.init();
            // this.guardian.registerCleanup(() => this.audioEngine.destroy());
            
            console.log('[ArchiveController] Audio environment prepared (placeholder)');
        } catch (error) {
            console.warn('[ArchiveController] Audio initialization failed:', error);
        }
    }

    /**
     * Setup window lifecycle handlers
     */
    setupLifecycleHandlers() {
        // Handle window resize for responsive experience
        const handleResize = () => {
            this.config.visualization.scene.width = window.innerWidth;
            this.config.visualization.scene.height = window.innerHeight;
            
            if (this.memoryOrbField) {
                this.memoryOrbField.handleResize();
            }
        };

        this.guardian.registerEventListener(window, 'resize', handleResize);
        this.guardian.registerEventListener(window, 'beforeunload', () => this.destroy());
        this.guardian.registerEventListener(window, 'pagehide', () => this.destroy());

        // Handle visibility changes for performance optimization
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                this.pauseExperience();
            } else {
                this.resumeExperience();
            }
        };

        this.guardian.registerEventListener(document, 'visibilitychange', handleVisibilityChange);
    }

    /**
     * Begin the Archive experience
     */
    beginArchiveExperience() {
        // Record entry into the Archive
        this.consciousness.recordEvent('archive_experience_started', {
            timestamp: Date.now(),
            performanceTier: this.performanceTier,
            initialAttachment: this.consciousness.getState('datascape.attachmentScore') || 0
        });

        // Start memory orb generation
        this.startMemoryGeneration();

        // Emit initialization complete event
        this.eventBridge.emit('archive:initialized', {
            performanceTier: this.performanceTier,
            maxOrbs: this.config.archive.maxMemoryOrbs
        });

        console.log('[ArchiveController] Archive experience begun');
    }

    /**
     * Start generating memory orbs
     */
    startMemoryGeneration() {
        // Generate initial set of memory orbs
        for (let i = 0; i < this.config.archive.initialOrbCount; i++) {
            setTimeout(() => {
                this.generateMemoryOrb();
            }, i * 500); // Stagger initial generation
        }

        // Setup continuous generation
        this.memoryGenerationTimer = setInterval(() => {
            if (this.activeMemories.size < this.config.archive.maxMemoryOrbs) {
                this.generateMemoryOrb();
            }
        }, this.config.archive.orbSpawnInterval);

        this.guardian.registerTimer(this.memoryGenerationTimer, true);
        console.log('[ArchiveController] Memory generation started');
    }

    /**
     * Generate a new memory orb
     */
    generateMemoryOrb() {
        const memoryId = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const memoryType = this.selectMemoryType();
        
        const memoryData = {
            id: memoryId,
            type: memoryType,
            content: this.generateMemoryContent(memoryType),
            createdAt: Date.now(),
            viewCount: 0,
            totalViewTime: 0,
            corruptionLevel: 0,
            position: this.generateRandomPosition()
        };

        // Add to active memories
        this.activeMemories.set(memoryId, memoryData);

        // Create visual representation via memory orb field
        if (this.memoryOrbField) {
            this.memoryOrbField.createMemoryOrb(memoryData);
        }

        // Attach interaction handlers
        if (this.interactionSystem) {
            // Wait for DOM element creation
            requestAnimationFrame(() => {
                const memoryElement = document.querySelector(`[data-memory-id="${memoryId}"]`);
                if (memoryElement) {
                    this.interactionSystem.attachToMemoryOrb(memoryElement, memoryData);
                }
            });
        }

        this.eventBridge.emit('memory:created', { memoryData });
        
        console.log(`[ArchiveController] Memory orb generated: ${memoryType} (${memoryId})`);
    }

    /**
     * Select memory type based on current state
     */
    selectMemoryType() {
        const types = this.config.archive.memoryTypes;
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        
        // Weight selection based on attachment level
        if (attachmentScore > 100) {
            // More nostalgic/emotional memory types at high attachment
            const emotionalTypes = ['digital_conversation', 'deleted_photo', 'cached_moment'];
            return emotionalTypes[Math.floor(Math.random() * emotionalTypes.length)];
        } else {
            // Random selection at lower attachment
            return types[Math.floor(Math.random() * types.length)];
        }
    }

    /**
     * Generate memory content based on type
     */
    generateMemoryContent(memoryType) {
        const contentTemplates = {
            digital_conversation: [
                'A late-night message that changed everything',
                'Words of comfort from a distant friend',
                'The last conversation before goodbye',
                'Shared laughter through pixels and light'
            ],
            deleted_photo: [
                'A moment of pure joy, now only a filename',
                'The perfect sunset that lived for a day',
                'Faces of those who mattered, lost to storage',
                'A memory crystallized, then digitally scattered'
            ],
            lost_document: [
                'Hours of work, vanished in an instant',
                'Creative dreams stored in forgotten folders',
                'The story you meant to finish writing',
                'Plans for a future that never arrived'
            ],
            forgotten_bookmark: [
                'A place you meant to return to',
                'Wisdom saved for tomorrow, lost today',
                'The article that would have changed your mind',
                'A doorway to knowledge, now sealed'
            ],
            cached_moment: [
                'The echo of a digital embrace',
                'A moment of connection through the screen',
                'Virtual presence that felt more real than reality',
                'The warmth of pixels arranged just right'
            ],
            orphaned_file: [
                'Data without context, meaning without memory',
                'The remnants of digital ambition',
                'A fragment of intention, purpose lost',
                'Bits and bytes seeking their story'
            ],
            expired_session: [
                'A connection that timed out too soon',
                'The bridge between hearts that crumbled',
                'Presence reduced to an error message',
                'The moment when "online" became "away"'
            ],
            broken_link: [
                'A path that leads nowhere',
                'The promise of connection, unfulfilled',
                'A bridge to meaning, collapsed',
                'The destination that no longer exists'
            ]
        };

        const templates = contentTemplates[memoryType] || ['A fragment of digital existence'];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Generate random position for memory orb
     */
    generateRandomPosition() {
        const padding = 100;
        return {
            x: padding + Math.random() * (window.innerWidth - padding * 2),
            y: padding + Math.random() * (window.innerHeight - padding * 2),
            z: Math.random() * 200 - 100 // Depth variation
        };
    }

    /**
     * Update attachment indicator in UI
     */
    updateAttachmentIndicator(attachmentScore) {
        const indicator = this.archiveContainer?.querySelector('.attachment-level');
        const scoreElement = this.archiveContainer?.querySelector('.attachment-score');
        
        if (indicator) {
            const percentage = Math.min(100, (attachmentScore / 200) * 100);
            indicator.style.width = `${percentage}%`;
        }
        
        if (scoreElement) {
            scoreElement.textContent = Math.floor(attachmentScore);
        }
    }

    /**
     * Update liberation indicator in UI
     */
    updateLiberationIndicator(liberationProgress) {
        const indicator = this.archiveContainer?.querySelector('.liberation-level');
        const scoreElement = this.archiveContainer?.querySelector('.liberation-score');
        
        if (indicator) {
            const percentage = Math.min(100, liberationProgress);
            indicator.style.width = `${percentage}%`;
        }
        
        if (scoreElement) {
            scoreElement.textContent = Math.floor(liberationProgress);
        }
    }

    /**
     * Event Handlers
     */

    handleMemoryCreated(eventData) {
        console.log(`[ArchiveController] Memory created: ${eventData.memoryData.id}`);
    }

    handleMemoryHoverStart(eventData) {
        const { memoryData } = eventData;
        
        // Visual feedback for memory hover
        if (this.memoryOrbField) {
            this.memoryOrbField.highlightMemoryOrb(memoryData.id, true);
        }
    }

    handleMemoryHoverEnd(eventData) {
        const { memoryData, viewDuration, attachmentIncrease } = eventData;
        
        // End visual feedback
        if (this.memoryOrbField) {
            this.memoryOrbField.highlightMemoryOrb(memoryData.id, false);
        }

        // Update memory data
        if (this.activeMemories.has(memoryData.id)) {
            const memory = this.activeMemories.get(memoryData.id);
            memory.viewCount = (memory.viewCount || 0) + 1;
            memory.totalViewTime = (memory.totalViewTime || 0) + viewDuration;
            memory.lastViewed = Date.now();
        }
    }

    handleMemoryGrasped(eventData) {
        const { memoryData, attachmentPenalty } = eventData;
        console.log(`[ArchiveController] Memory grasped: ${memoryData.id}, penalty: ${attachmentPenalty}`);
        
        // Visual corruption effect
        if (this.memoryOrbField) {
            this.memoryOrbField.applyCorruptionToOrb(memoryData.id, 0.3);
        }
    }

    handleMemoryLiberated(eventData) {
        const { memoryData, liberationAmount } = eventData;
        console.log(`[ArchiveController] Memory liberated: ${memoryData.id}, liberation: ${liberationAmount}`);
        
        // Visual purification effect
        if (this.memoryOrbField) {
            this.memoryOrbField.applyPurificationToOrb(memoryData.id);
        }
    }

    handleDaemonManifested(eventData) {
        const { daemon, sourceType } = eventData;
        console.log(`[ArchiveController] Daemon manifested: ${daemon.id} from ${sourceType}`);
        
        // Update atmosphere for daemon presence
        document.body.classList.add('daemons-present');
    }

    handleDaemonRecognized(eventData) {
        const { daemon, liberationReward } = eventData;
        console.log(`[ArchiveController] Daemon recognized: ${daemon.id}, liberation: ${liberationReward}`);
        
        // Check if all daemons have been recognized
        const activeDaemons = this.daemonManifestor.getActiveDaemonCount();
        if (activeDaemons === 0) {
            document.body.classList.remove('daemons-present');
        }
    }

    handleAttachmentThreshold(eventData) {
        const { threshold, attachmentScore } = eventData;
        console.log(`[ArchiveController] Attachment threshold reached: ${threshold} (${attachmentScore})`);
        
        // Trigger appropriate response based on threshold
        if (threshold === 'high' && attachmentScore > 150) {
            this.triggerHighAttachmentSequence();
        }
    }

    handleArchiveTransition(eventData) {
        const { destination, reason } = eventData;
        console.log(`[ArchiveController] Transitioning to ${destination}: ${reason}`);
        
        // Handle transitions to other realms or phases
        this.prepareTransition(destination, reason);
    }

    /**
     * Trigger high attachment sequence
     */
    triggerHighAttachmentSequence() {
        // Increase memory corruption globally
        this.activeMemories.forEach((memory) => {
            if (this.memoryOrbField) {
                this.memoryOrbField.applyCorruptionToOrb(memory.id, 0.5);
            }
        });

        // Manifest additional daemons
        this.daemonManifestor.manifestDaemonsFromAttachment();
        
        console.log('[ArchiveController] High attachment sequence triggered');
    }

    /**
     * Prepare transition to another realm or phase
     */
    prepareTransition(destination, reason) {
        // Record transition event
        this.consciousness.recordEvent('archive_transition_prepared', {
            destination,
            reason,
            finalAttachment: this.consciousness.getState('datascape.attachmentScore'),
            finalLiberation: this.consciousness.getState('datascape.liberationProgress'),
            memoriesExperienced: this.activeMemories.size,
            timestamp: Date.now()
        });

        // Begin transition sequence
        this.eventBridge.emit('transition:begin', { destination, reason });
    }

    /**
     * Pause experience for performance optimization
     */
    pauseExperience() {
        if (this.memoryGenerationTimer) {
            clearInterval(this.memoryGenerationTimer);
        }
        
        if (this.memoryOrbField) {
            this.memoryOrbField.pause();
        }
        
        console.log('[ArchiveController] Experience paused');
    }

    /**
     * Resume experience
     */
    resumeExperience() {
        this.startMemoryGeneration();
        
        if (this.memoryOrbField) {
            this.memoryOrbField.resume();
        }
        
        console.log('[ArchiveController] Experience resumed');
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        console.error('[ArchiveController] Critical initialization error:', error);
        
        // Record error for debugging
        this.consciousness.recordEvent('archive_initialization_failed', {
            error: error.message,
            stack: error.stack,
            timestamp: Date.now()
        });

        // Attempt graceful degradation
        document.body.classList.add('archive-error');
        
        // Show error message to user
        const errorContainer = document.createElement('div');
        errorContainer.className = 'archive-error-message';
        errorContainer.innerHTML = `
            <div class="error-content">
                <h2>Karmic Imbalance Detected</h2>
                <p>The Archive has encountered a disturbance in the digital flow.</p>
                <p>Please refresh to restore harmony.</p>
            </div>
        `;
        document.body.appendChild(errorContainer);
    }

    /**
     * Clean up all resources and destroy the controller
     */
    destroy() {
        if (this.isDestroyed) {
            console.warn('[ArchiveController] Already destroyed, skipping cleanup');
            return;
        }

        console.log('[ArchiveController] Releasing all archive attachments...');
        this.isDestroyed = true;

        // Record destruction
        this.consciousness.recordEvent('archive_experience_ended', {
            timestamp: Date.now(),
            duration: Date.now() - (this.consciousness.getState('memories')?.find(m => m.type === 'archive_experience_started')?.timestamp || Date.now()),
            finalAttachment: this.consciousness.getState('datascape.attachmentScore'),
            finalLiberation: this.consciousness.getState('datascape.liberationProgress'),
            memoriesExperienced: this.activeMemories.size
        });

        // Clean up visual elements
        document.body.classList.remove('archive-active', 'daemons-present');
        document.body.removeAttribute('data-realm');

        // Clear active memories
        this.activeMemories.clear();

        // Clean up all registered resources
        this.guardian.cleanupAll();

        console.log('[ArchiveController] Archive experience ended. All attachments released.');
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.ArchiveController = ArchiveController;
}