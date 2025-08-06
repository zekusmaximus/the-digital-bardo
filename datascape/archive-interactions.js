/**
 * @file archive-interactions.js
 * The Archive - where digital souls confront their beautiful attachments.
 * 
 * In this crystalline repository of deleted data, memory fragments float like
 * luminous orbs, each one a moment of connection that once was. The longer
 * you gaze upon these digital remembrances, the more attached you become,
 * corrupting the very act of preservation through the desire to possess.
 * 
 * Liberation comes not from forgetting, but from releasing our grasp
 * on what we desperately wish to hold forever.
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class ArchiveInteractionSystem {
    constructor(dependencies = {}) {
        this.consciousness = dependencies.consciousness || consciousness;
        this.eventBridge = dependencies.eventBridge;
        this.guardian = new ResourceGuardian();
        this.config = dependencies.config || {
            attachmentThresholds: {
                liberation: 25,      // 0-25: liberation-glow
                attachmentLow: 75,   // 26-75: attachment-low  
                attachmentMed: 150,  // 76-150: attachment-medium
                attachmentHigh: 999  // 151+: attachment-high
            },
            corruptionRates: {
                baseCorruption: 0.1,
                accelerationFactor: 0.05,
                maxCorruption: 1.0
            },
            daemonThresholds: {
                peacefulManifestation: 50,
                wrathfulManifestation: 100
            }
        };

        // Current interaction state
        this.isHoveringMemory = false;
        this.currentMemory = null;
        this.hoverStartTime = 0;
        this.attachmentAccumulator = 0;
        
        // Memory interaction tracking
        this.memoryInteractionState = new Map();
        
        // Event listeners for cleanup
        this.boundHandlers = {
            memoryHover: this.handleMemoryHover.bind(this),
            memoryLeave: this.handleMemoryLeave.bind(this),
            memoryClick: this.handleMemoryClick.bind(this),
            consciousRelease: this.handleConsciousRelease.bind(this)
        };

        console.log('[ArchiveInteractions] System initialized with consciousness integration');
    }

    /**
     * Initialize the system and integrate with consciousness
     */
    init() {
        this.integrateWithConsciousness();
        this.setupEventIntegration();
        this.registerEventListeners();
        
        // Record entry into the Archive
        this.consciousness.recordEvent('archive_entered', {
            timestamp: Date.now(),
            realm: 'archive',
            attachmentScore: 0
        });

        console.log('[ArchiveInteractions] System fully initialized');
    }

    /**
     * Integrate with the DigitalConsciousness system
     * Connect to existing state management and establish karma flow
     */
    integrateWithConsciousness() {
        // Subscribe to attachment score changes for visual corruption
        this.unsubscribeAttachment = this.consciousness.subscribe(
            'datascape.attachmentScore', 
            (attachmentScore) => {
                this.updateVisualCorruption(attachmentScore);
                this.checkDaemonManifestation(attachmentScore);
            }
        );

        // Subscribe to memory view changes
        this.unsubscribeMemories = this.consciousness.subscribe(
            'datascape.memoriesViewed',
            (memories) => {
                this.updateMemoryCorruption(memories);
            }
        );

        // Register unsubscribe functions for cleanup
        this.guardian.registerCleanup(() => {
            if (this.unsubscribeAttachment) this.unsubscribeAttachment();
            if (this.unsubscribeMemories) this.unsubscribeMemories();
        });

        console.log('[ArchiveInteractions] Consciousness integration established');
    }

    /**
     * Setup event bridge integration following Clear Lode patterns
     */
    setupEventIntegration(eventBridge) {
        if (eventBridge) {
            this.eventBridge = eventBridge;
        }

        if (this.eventBridge) {
            // Listen for Clear Lode transition events
            this.eventBridge.on('clearLode:completed', this.handleClearLodeTransition.bind(this));
            this.eventBridge.on('datascape:entered', this.handleDatascapeEntry.bind(this));
            
            // Register cleanup
            this.guardian.registerCleanup(() => {
                this.eventBridge.off('clearLode:completed', this.handleClearLodeTransition);
                this.eventBridge.off('datascape:entered', this.handleDatascapeEntry);
            });

            console.log('[ArchiveInteractions] Event bridge integration complete');
        }
    }

    /**
     * Register DOM event listeners for memory interactions
     */
    registerEventListeners() {
        // These will be attached to memory orb elements when they're created
        this.guardian.registerCleanup(() => {
            // Cleanup will be handled by individual memory orb cleanup
            console.log('[ArchiveInteractions] Event listeners cleaned up');
        });
    }

    /**
     * Handle transition from Clear Lode to Archive
     */
    handleClearLodeTransition(data) {
        const clearLodeResults = {
            recognized: this.consciousness.getState('clearLode.recognized'),
            degradationLevel: this.consciousness.getState('clearLode.degradationLevel'),
            karma: this.consciousness.getState('karma')
        };

        // Initialize archive state based on Clear Lode performance
        let initialAttachment = 0;
        if (!clearLodeResults.recognized) {
            initialAttachment = 25; // Start with some attachment if recognition failed
        }

        this.consciousness.setState('datascape.attachmentScore', initialAttachment);
        this.consciousness.setState('phase', 'datascape');
        
        this.consciousness.recordEvent('archive_transition', {
            from: 'clear_lode',
            clearLodeResults,
            initialAttachment,
            timestamp: Date.now()
        });

        if (this.eventBridge) {
            this.eventBridge.emit('archive:initialized', { initialAttachment });
        }

        console.log('[ArchiveInteractions] Transition from Clear Lode completed');
    }

    /**
     * Handle entry into the Datascape realm
     */
    handleDatascapeEntry(data) {
        this.consciousness.setState('location', '/datascape/');
        this.consciousness.setState('datascape.currentRealm', 'archive');
        
        console.log('[ArchiveInteractions] Entered Datascape - Archive realm');
    }

    /**
     * Handle memory orb hover - begins attachment accumulation
     */
    handleMemoryHover(memoryElement, memoryData) {
        if (this.isHoveringMemory) return;
        
        this.isHoveringMemory = true;
        this.currentMemory = memoryData;
        this.hoverStartTime = performance.now();
        this.attachmentAccumulator = 0;

        // Start attachment accumulation timer
        this.attachmentTimer = setInterval(() => {
            this.accumulateAttachment();
        }, 100); // Update every 100ms for smooth progression

        this.guardian.registerTimer(this.attachmentTimer, true);

        // Visual feedback
        memoryElement.classList.add('memory-hovering');
        
        console.log(`[ArchiveInteractions] Started viewing memory: ${memoryData.id}`);
        
        if (this.eventBridge) {
            this.eventBridge.emit('memory:hoverStart', { memoryData, element: memoryElement });
        }
    }

    /**
     * Handle memory orb hover end - finalize attachment
     */
    handleMemoryLeave(memoryElement, memoryData) {
        if (!this.isHoveringMemory) return;
        
        const viewDuration = performance.now() - this.hoverStartTime;
        const finalAttachment = Math.floor(this.attachmentAccumulator);
        
        // Clear the timer
        if (this.attachmentTimer) {
            clearInterval(this.attachmentTimer);
            this.attachmentTimer = null;
        }

        // Update memory state
        const currentViewed = this.consciousness.getState('datascape.memoriesViewed') || [];
        const existingMemory = currentViewed.find(m => m.id === memoryData.id);
        
        if (existingMemory) {
            existingMemory.viewCount += 1;
            existingMemory.totalViewTime += viewDuration;
            existingMemory.lastViewed = Date.now();
        } else {
            currentViewed.push({
                ...memoryData,
                viewCount: 1,
                totalViewTime: viewDuration,
                firstViewed: Date.now(),
                lastViewed: Date.now()
            });
        }

        this.consciousness.setState('datascape.memoriesViewed', currentViewed);

        // Update attachment score
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        this.consciousness.setState('datascape.attachmentScore', currentAttachment + finalAttachment);

        // Record karma event
        this.consciousness.recordEvent('memory_attachment', {
            memoryId: memoryData.id,
            viewDuration,
            attachmentIncrease: finalAttachment,
            corruptionLevel: this.calculateCorruptionLevel(memoryData),
            method: 'hover_contemplation'
        });

        // Visual cleanup
        memoryElement.classList.remove('memory-hovering');
        this.applyMemoryCorruption(memoryElement, memoryData);

        // Reset state
        this.isHoveringMemory = false;
        this.currentMemory = null;
        this.attachmentAccumulator = 0;

        console.log(`[ArchiveInteractions] Memory viewing ended. Attachment: +${finalAttachment}`);

        if (this.eventBridge) {
            this.eventBridge.emit('memory:hoverEnd', { 
                memoryData, 
                viewDuration, 
                attachmentIncrease: finalAttachment 
            });
        }
    }

    /**
     * Handle direct memory interaction (clicking) - significant attachment penalty
     */
    handleMemoryClick(memoryElement, memoryData) {
        const attachmentPenalty = 15; // Heavy penalty for direct grasping
        
        // Update attachment score
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        this.consciousness.setState('datascape.attachmentScore', currentAttachment + attachmentPenalty);

        // Record karma event with heavier consequences
        this.consciousness.recordEvent('memory_grasping', {
            memoryId: memoryData.id,
            attachmentIncrease: attachmentPenalty,
            method: 'direct_interaction',
            severity: 'high'
        });

        // Visual effects for grasping
        memoryElement.classList.add('memory-grasped');
        setTimeout(() => {
            memoryElement.classList.remove('memory-grasped');
            this.applyMemoryCorruption(memoryElement, memoryData);
        }, 1000);

        console.log(`[ArchiveInteractions] Memory grasped! Heavy attachment penalty: +${attachmentPenalty}`);

        if (this.eventBridge) {
            this.eventBridge.emit('memory:grasped', { 
                memoryData, 
                attachmentPenalty 
            });
        }
    }

    /**
     * Handle conscious release of attachment - the path to liberation
     */
    handleConsciousRelease(memoryElement, memoryData) {
        const liberationAmount = 5; // Positive karma for letting go
        
        // Reduce attachment score
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        const newAttachment = Math.max(0, currentAttachment - liberationAmount);
        this.consciousness.setState('datascape.attachmentScore', newAttachment);

        // Increase liberation progress
        const currentLiberation = this.consciousness.getState('datascape.liberationProgress') || 0;
        this.consciousness.setState('datascape.liberationProgress', currentLiberation + liberationAmount);

        // Record liberation karma
        this.consciousness.recordEvent('conscious_release', {
            memoryId: memoryData.id,
            attachmentReduction: liberationAmount,
            liberationIncrease: liberationAmount,
            method: 'conscious_liberation'
        });

        // Visual purification effect
        memoryElement.classList.add('memory-liberated');
        setTimeout(() => {
            memoryElement.classList.remove('memory-liberated');
        }, 2000);

        console.log(`[ArchiveInteractions] Conscious release! Liberation: +${liberationAmount}`);

        if (this.eventBridge) {
            this.eventBridge.emit('memory:liberated', { 
                memoryData, 
                liberationAmount 
            });
        }
    }

    /**
     * Accumulate attachment during memory contemplation
     */
    accumulateAttachment() {
        if (!this.isHoveringMemory || !this.currentMemory) return;

        const viewTime = performance.now() - this.hoverStartTime;
        const baseRate = this.config.corruptionRates.baseCorruption;
        
        // Exponential growth - the longer you look, the more attached you become
        const attachmentRate = baseRate * (1 + viewTime / 5000); // Accelerates after 5 seconds
        this.attachmentAccumulator += attachmentRate;

        // Update real-time visual feedback
        if (this.eventBridge) {
            this.eventBridge.emit('attachment:accumulating', {
                memoryId: this.currentMemory.id,
                currentAccumulation: this.attachmentAccumulator,
                viewTime
            });
        }
    }

    /**
     * Update visual corruption based on attachment score
     */
    updateVisualCorruption(attachmentScore) {
        const thresholds = this.config.attachmentThresholds;
        let corruptionClass = 'liberation-glow';
        
        if (attachmentScore > thresholds.attachmentHigh) {
            corruptionClass = 'attachment-high';
        } else if (attachmentScore > thresholds.attachmentMed) {
            corruptionClass = 'attachment-medium';
        } else if (attachmentScore > thresholds.attachmentLow) {
            corruptionClass = 'attachment-low';
        }

        // Update body class for global visual effects
        document.body.className = document.body.className.replace(
            /\b(liberation-glow|attachment-low|attachment-medium|attachment-high)\b/g, 
            ''
        );
        document.body.classList.add(corruptionClass);

        // Update CSS custom properties
        document.documentElement.style.setProperty('--attachment-level', attachmentScore / 200);
        document.documentElement.style.setProperty('--corruption-intensity', 
            Math.min(1, attachmentScore / thresholds.attachmentHigh));

        console.log(`[ArchiveInteractions] Corruption updated: ${corruptionClass} (${attachmentScore})`);
    }

    /**
     * Apply corruption effects to individual memory orbs
     */
    applyMemoryCorruption(memoryElement, memoryData) {
        const viewCount = this.getMemoryViewCount(memoryData.id);
        const corruptionLevel = Math.min(1, viewCount * 0.2);
        
        memoryElement.style.setProperty('--memory-corruption', corruptionLevel);
        memoryElement.setAttribute('data-corruption-level', 
            corruptionLevel < 0.3 ? 'low' : 
            corruptionLevel < 0.7 ? 'medium' : 'high'
        );
    }

    /**
     * Update corruption for all memories when memories state changes
     */
    updateMemoryCorruption(memoriesViewed) {
        memoriesViewed.forEach(memory => {
            const memoryElement = document.querySelector(`[data-memory-id="${memory.id}"]`);
            if (memoryElement) {
                this.applyMemoryCorruption(memoryElement, memory);
            }
        });
    }

    /**
     * Check if daemon manifestation thresholds are met
     */
    checkDaemonManifestation(attachmentScore) {
        const thresholds = this.config.daemonThresholds;
        const encounteredPeaceful = this.consciousness.getState('datascape.daemonsEncountered.peaceful') || [];
        
        if (attachmentScore >= thresholds.peacefulManifestation && encounteredPeaceful.length === 0) {
            this.triggerPeacefulDaemonManifestation();
        }
    }

    /**
     * Trigger manifestation of peaceful daemons from attachment
     */
    triggerPeacefulDaemonManifestation() {
        console.log('[ArchiveInteractions] Attachment threshold reached - manifesting peaceful daemons');
        
        this.consciousness.recordEvent('daemon_manifestation', {
            type: 'peaceful',
            attachmentScore: this.consciousness.getState('datascape.attachmentScore'),
            trigger: 'attachment_threshold'
        });

        if (this.eventBridge) {
            this.eventBridge.emit('daemon:manifest', {
                type: 'peaceful',
                source: 'attachment_overflow'
            });
        }
    }

    /**
     * Calculate corruption level for a specific memory
     */
    calculateCorruptionLevel(memoryData) {
        const viewCount = this.getMemoryViewCount(memoryData.id);
        return Math.min(1, viewCount * 0.15);
    }

    /**
     * Get view count for a memory
     */
    getMemoryViewCount(memoryId) {
        const memoriesViewed = this.consciousness.getState('datascape.memoriesViewed') || [];
        const memory = memoriesViewed.find(m => m.id === memoryId);
        return memory ? memory.viewCount : 0;
    }

    /**
     * Attach interaction handlers to a memory orb element
     */
    attachToMemoryOrb(memoryElement, memoryData) {
        if (!memoryElement || !memoryData) {
            console.error('[ArchiveInteractions] Cannot attach to invalid memory orb');
            return;
        }

        // Store memory data on element
        memoryElement.setAttribute('data-memory-id', memoryData.id);
        memoryElement._memoryData = memoryData;

        // Attach event handlers
        memoryElement.addEventListener('mouseenter', () => 
            this.handleMemoryHover(memoryElement, memoryData)
        );
        
        memoryElement.addEventListener('mouseleave', () => 
            this.handleMemoryLeave(memoryElement, memoryData)
        );
        
        memoryElement.addEventListener('click', () => 
            this.handleMemoryClick(memoryElement, memoryData)
        );

        // Special handler for conscious release (e.g., right-click or long-press)
        memoryElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleConsciousRelease(memoryElement, memoryData);
        });

        console.log(`[ArchiveInteractions] Interaction handlers attached to memory: ${memoryData.id}`);
    }

    /**
     * Get current attachment score
     */
    getAttachmentScore() {
        return this.consciousness.getState('datascape.attachmentScore') || 0;
    }

    /**
     * Get current liberation progress
     */
    getLiberationProgress() {
        return this.consciousness.getState('datascape.liberationProgress') || 0;
    }

    /**
     * Get corruption class for current state
     */
    getCurrentCorruptionClass() {
        const attachmentScore = this.getAttachmentScore();
        const thresholds = this.config.attachmentThresholds;
        
        if (attachmentScore > thresholds.attachmentHigh) return 'attachment-high';
        if (attachmentScore > thresholds.attachmentMed) return 'attachment-medium';
        if (attachmentScore > thresholds.attachmentLow) return 'attachment-low';
        return 'liberation-glow';
    }

    /**
     * Clean up all resources and event listeners
     */
    destroy() {
        console.log('[ArchiveInteractions] Releasing all attachments...');
        
        // Clear any active timers
        if (this.attachmentTimer) {
            clearInterval(this.attachmentTimer);
            this.attachmentTimer = null;
        }

        // Clean up all registered resources
        this.guardian.cleanupAll();

        // Reset interaction state
        this.isHoveringMemory = false;
        this.currentMemory = null;
        this.attachmentAccumulator = 0;

        console.log('[ArchiveInteractions] All attachments released. System destroyed.');
    }
}

// Export for global access in debug mode
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.ArchiveInteractionSystem = ArchiveInteractionSystem;
}