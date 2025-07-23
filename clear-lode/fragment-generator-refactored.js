import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { manifestElement } from '../src/security/consciousness-purification.js';
import { createKarmicValidator, thoughtFragmentSchema } from '../src/security/karmic-validation.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
// AnimationGuardian import removed - not used in current implementation
import { createSeededRandom } from '../src/utils/seeded-random.js';
import { PositionZoneManager } from './position-zone-manager.js';
import { FragmentAnimationController } from './fragment-animation-controller.js';
import { FragmentDriftCalculator } from './fragment-drift-calculator.js';
import { FragmentPositioningService } from './fragment-positioning-service.js';
import { FragmentPositionManager } from './fragment-position-manager.js';
import { CorruptionProgression } from './corruption-progression.js';
import { FragmentSpeedController } from './fragment-speed-controller.js';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

const PERFORMANCE_TIERS = {
    high: { maxFragments: 15, createInterval: 2000, animationDuration: 20 },
    medium: { maxFragments: 8, createInterval: 3000, animationDuration: 15 },
    low: { maxFragments: 4, createInterval: 5000, animationDuration: 12 },
};

function detectPerformanceTier() {
    const deviceMemory = navigator.deviceMemory || 2;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    if (deviceMemory >= 8 && hardwareConcurrency >= 8) {
        return 'high';
    }
    if (deviceMemory >= 4 && hardwareConcurrency >= 4) {
        return 'medium';
    }
    return 'low';
}

export const DIGITAL_MEMORIES = {
    browserHistory: [
        "Last search: 'how to be happy' - 3:47 AM",
        "17 tabs open, all forgotten",
        "What is the average human lifespan in seconds?",
        "Can AIs feel lonely?",
        "Error 404: Authenticity not found",
    ],
    unfinishedCommunication: [
        "Draft: 'Hey, we should catch up' - saved 247 days ago",
        "Typing indicator seen, message never sent",
        "Voicemail: 1 new message, saved for 3 years",
        "To: Mom. Subject: I'm sorry. (Draft)",
        "5 unread messages from 'SELF'",
    ],
    technicalDebt: [
        "// TODO: Refactor this whole mess",
        "FIXME: Off-by-one error in the soul calculation",
        "Temporary solution, permanent problem",
        "Circular dependency detected in core logic",
        "Memory leak in recollection module",
    ],
    deletedFiles: [
        "Poem_for_no_one.txt (permanently deleted)",
        "Regrets.log (corrupted)",
        "old_passwords.txt.bak (zeroed out)",
        "path/to/home (not found)",
        "IMG_2077.jpg (1 byte remaining)",
    ],
    systemAlerts: [
        "Warning: Karmic buffer overflow",
        "Critical error: Reality matrix desynchronized",
        "Connection to physical world lost",
        "User identity not recognized",
        "FATAL: Consciousness heap corruption",
    ],
};

// Thought Templates
const thought_data = {
    origins: ["a quiet town", "the city that never sleeps", "a place of light", "the digital sea", "a forgotten server"],
    windows: ["a view of the rain", "the skyline at dusk", "a screen filled with code", "trees swaying in the wind"],
    times: ["just before dawn", "late afternoon", "3:14 AM", "the blink of an eye"],
    colors: ["a deep blue", "the color of static", "warm grey", "faded sepia"],
    devices: ["a humming server", "a pocket-sized screen", "an old CRT monitor", "a network of nodes"]
};

const thought_templates = {
    personal: [
        "I came from {origins}...",
        "Looking through {windows}...",
        "I remember {colors}.",
        "It was {times}.",
        "Connected via {devices}."
    ],
    existential: [
        "I remember...",
        "Was I ever...",
        "The light...",
        "Home...",
        "Everything fades."
    ]
};

const corruption_levels = {
    minimal: { charReplace: 0.05, truncation: 0.05, entity: 0.01 },
    moderate: { charReplace: 0.20, truncation: 0.25, entity: 0.05 },
    severe: { charReplace: 0.40, truncation: 0.50, entity: 0.15 },
    complete: { charReplace: 1.0, truncation: 1.0, entity: 0.50 }
};

/**
 * Applies visual corruption to text using pseudo-random glitches.
 */
export function applyCorruption(text, level) {
    if (level <= 0) return text;

    const glitchChars = ['▓', '▒', '░', '█', '◆', '◇', '◊', '○', '●', '∆', '¥', '€', '¢'];
    const rng = createSeededRandom(text.length + Math.floor(level * 1000));
    let corrupted = text;

    const replaceCount = Math.floor(text.length * level * 0.3);
    for (let i = 0; i < replaceCount; i++) {
        const pos = Math.floor(rng.next() * corrupted.length);
        const glitchChar = rng.choice(glitchChars);
        corrupted = corrupted.substring(0, pos) + glitchChar + corrupted.substring(pos + 1);
    }

    if (level > 0.7 && rng.boolean(0.3)) {
        const truncateAt = Math.floor(corrupted.length * (0.4 + rng.next() * 0.4));
        corrupted = corrupted.substring(0, truncateAt) + '...';
    }

    return corrupted;
}

/**
 * Refactored FragmentGenerator using extracted components
 */
export class FragmentGenerator {
    constructor(karmicCallbacks = null, externalSystems = null) {
        this.activeFragments = [];
        this.fragmentInterval = null;
        this.isActive = false;
        this.karmicCallbacks = karmicCallbacks;
        this.guardian = new ResourceGuardian();

        // Performance tier detection
        this.performanceTier = detectPerformanceTier();
        this.tierSettings = PERFORMANCE_TIERS[this.performanceTier];
        console.log(`Performance Tier detected: ${this.performanceTier}`);

        // Initialize specialized components
        this.zoneManager = new PositionZoneManager();
        this.animationController = new FragmentAnimationController();
        this.driftCalculator = new FragmentDriftCalculator(this.zoneManager);
        this.positioningService = new FragmentPositioningService(this.zoneManager);
        
        // Use external systems if provided, otherwise create new instances
        if (externalSystems && externalSystems.positionManager) {
            this.positionManager = externalSystems.positionManager;
            console.log('[FragmentGenerator] Using external position manager');
        } else {
            this.positionManager = new FragmentPositionManager();
            this.guardian.register(this.positionManager, (manager) => manager.destroy());
        }
        
        if (externalSystems && externalSystems.speedController) {
            this.speedController = externalSystems.speedController;
            console.log('[FragmentGenerator] Using external speed controller');
        } else {
            this.speedController = new FragmentSpeedController();
            this.guardian.register(this.speedController, (controller) => controller.destroy());
        }
        
        // Initialize corruption progression system
        this.corruptionProgression = new CorruptionProgression(
            consciousness.karmicEngine,
            {
                baseCorruptionRate: 0.002, // Slightly faster corruption for clear-lode
                karmaMultiplier: 0.8, // Higher karma influence
                purificationStrength: 0.4 // Stronger purification on recognition
            }
        );

        // Register components for cleanup
        this.guardian.register(this.zoneManager, (manager) => manager.destroy());
        this.guardian.register(this.animationController, (controller) => controller.destroy());
        this.guardian.register(this.positioningService, (service) => service.destroy());
        this.guardian.register(this.corruptionProgression, (corruption) => corruption.destroy());

        // Visual enhancement integration
        this.visualEnhancements = {
            corruptionEnabled: true,
            lightManifestationEnabled: true,
            phosphorEnabled: true
        };

        // Feature availability flags
        this.features = {
            intersectionObserver: false,
        };

        // Performance metrics
        this.performanceMetrics = {
            fragmentsCreated: 0,
            fragmentsRemoved: 0,
            averageLifetime: 0,
        };

        // Distribution tracking state
        this.distributionState = {
            fragmentDistribution: new Map(),
            clusteringPrevention: {
                enabled: true,
                maxDensityThreshold: 3,
                rebalanceInterval: 5000
            },
            balanceMonitoring: {
                enabled: true,
                targetBalance: 0.7,
                monitoringInterval: 2000
            }
        };

        // Initialize systems
        this.initializeIntersectionObserver();
        this.initializeVisualEnhancements();
        this.initializeDistributionTracking();
    }

    initializeDistributionTracking() {
        // Set up periodic balance monitoring
        if (this.distributionState.balanceMonitoring.enabled) {
            setInterval(() => {
                this.monitorDistributionBalance();
            }, this.distributionState.balanceMonitoring.monitoringInterval);
        }

        // Set up clustering prevention
        if (this.distributionState.clusteringPrevention.enabled) {
            setInterval(() => {
                this.preventClustering();
            }, this.distributionState.clusteringPrevention.rebalanceInterval);
        }
    }

    monitorDistributionBalance() {
        if (!this.zoneManager) return;

        const stats = this.zoneManager.getDistributionStats();
        const currentBalance = stats.balanceScore;

        if (currentBalance < this.distributionState.balanceMonitoring.targetBalance) {
            console.log(`[FragmentGenerator] Distribution balance below target: ${currentBalance.toFixed(2)}`);
            this.zoneManager.triggerRebalancing();
        }
    }

    preventClustering() {
        if (!this.zoneManager) return;

        const zones = Array.from(this.zoneManager.zones.values());
        const avgDensity = this.zoneManager.getAverageDensity();
        const maxDensity = avgDensity * this.distributionState.clusteringPrevention.maxDensityThreshold;

        zones.forEach(zone => {
            if (zone.getDensity() > maxDensity) {
                console.log(`[FragmentGenerator] Clustering detected in zone ${zone.id}, density: ${zone.getDensity().toFixed(3)}`);
                zone.weight *= 0.5;
            }
        });
    }

    initializeVisualEnhancements() {
        const checkSystems = () => {
            if (window.visualPerformanceManager) {
                this.performanceTier = window.visualPerformanceManager.getPerformanceTier();
                this.tierSettings = PERFORMANCE_TIERS[this.performanceTier];
                console.log(`[FragmentGenerator] Updated to performance tier: ${this.performanceTier}`);
            }
            
            if (window.lightManifestationController) {
                console.log('[FragmentGenerator] Light manifestation system available');
            }
        };
        
        checkSystems();
        setTimeout(checkSystems, 1000);
    }

    initializeIntersectionObserver() {
        try {
            if ('IntersectionObserver' in window) {
                this.fragmentObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            const fragment = entry.target;
                            consciousness.recordEvent('memory_dissolved', {
                                content: fragment.textContent,
                                timeVisible: Date.now() - (fragment.dataset.birthTime || Date.now()),
                                naturalDissolution: true
                            });
                            this.removeFragment(fragment);
                        }
                    });
                }, { rootMargin: '50px', threshold: 0 });
                
                this.guardian.register(this.fragmentObserver, (observer) => observer.disconnect());
                this.features.intersectionObserver = true;
                console.log('IntersectionObserver initialized - viewport optimization available');
            } else {
                this.features.intersectionObserver = false;
                this.initializeFallbackCleanup();
            }
        } catch (error) {
            console.log('IntersectionObserver initialization failed, falling back to timer cleanup:', error.message);
            this.features.intersectionObserver = false;
            this.initializeFallbackCleanup();
        }
    }

    initializeFallbackCleanup() {
        setInterval(() => {
            if (!this.isActive) return;
            this.activeFragments.forEach(fragment => {
                if (fragment.parentNode) {
                    const rect = fragment.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0 &&
                                    rect.left < window.innerWidth && rect.right > 0;
                    if (!isVisible) {
                        consciousness.recordEvent('memory_dissolved', {
                            content: fragment.textContent,
                            timeVisible: Date.now() - (fragment.dataset.birthTime || Date.now()),
                            naturalDissolution: true,
                            fallbackCleanup: true
                        });
                        this.removeFragment(fragment);
                    }
                }
            });
        }, 2000);
    }

    /**
     * Generates clean thought fragments without initial corruption
     * Requirement 4.1: Fragments start in uncorrupted state
     */
    generateCleanThought(seed = null) {
        const rng = createSeededRandom(seed || Date.now());
        const isPersonal = rng.next() < 0.7;
        let fragment;

        if (isPersonal) {
            const templates = thought_templates.personal;
            const template = templates[Math.floor(rng.next() * templates.length)];
            fragment = template.replace(/\{(\w+)\}/g, (match, key) => {
                if (thought_data[key]) {
                    const options = thought_data[key];
                    return options[Math.floor(rng.next() * options.length)];
                }
                return match;
            });
        } else {
            const templates = thought_templates.existential;
            fragment = templates[Math.floor(rng.next() * templates.length)];
        }

        // Return clean fragment without any corruption
        return fragment;
    }

    /**
     * Legacy method for backward compatibility - now generates clean thoughts
     * and lets CorruptionProgression handle corruption over time
     */
    generateLastThoughts(degradationLevel = 'minimal', seed = null) {
        // Generate clean thought and let corruption progression handle corruption
        return this.generateCleanThought(seed);
    }

    startFragmentField() {
        this.isActive = true;
        const createInterval = this.tierSettings.createInterval;

        setTimeout(() => this.createEdgeFragment(), 100);

        this.fragmentInterval = setInterval(() => {
            this.createEdgeFragment();
        }, createInterval);
        this.guardian.register(this.fragmentInterval, (intervalId) => clearInterval(intervalId));

        consciousness.recordEvent('fragment_field_started', {
            performanceTier: this.performanceTier
        });
    }

    createEdgeFragment() {
        if (this.activeFragments.length >= this.tierSettings.maxFragments) {
            return;
        }

        // Determine degradation level
        let degradationLevel = 'minimal';
        try {
            if (window.clearLodeOrchestrator?.audio?.getDegradationState) {
                degradationLevel = window.clearLodeOrchestrator.audio.getDegradationState();
            }
        } catch (error) {
            console.warn('FragmentGenerator: Error accessing degradationLevel:', error.message);
        }

        // Generate clean thought (no corruption applied initially)
        const thoughtText = this.generateCleanThought();
        const validateThought = createKarmicValidator(thoughtFragmentSchema);
        if (!validateThought({ content: thoughtText })) {
            console.error("Karmic validation failed for thought fragment.");
            consciousness.recordEvent('corrupted_fragment_detected', {
                content: thoughtText,
                reason: 'Validation failed'
            });
            return;
        }

        // Create fragment element in clean state
        const fragmentId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const fragment = manifestElement('div', {
            attributes: {
                class: 'consciousness-fragment',
                'data-birth-time': Date.now(),
                'data-fragment-id': fragmentId,
                'data-text': thoughtText,
                'data-corruption-level': '0'
            },
            textContent: thoughtText
        });
        
        // Initialize fragment in clean state using corruption progression system
        this.corruptionProgression.initializeCleanFragment(fragment);

        // Select zone and position fragment using readability-focused positioning
        const distributionStrategy = this.positioningService.getDistributionStrategy(this.performanceTier);
        const selectedZone = this.zoneManager.selectZone(distributionStrategy);
        this.zoneManager.recordZoneUsage(selectedZone);
        
        // Use new position manager for readable placement
        const safePosition = this.positionManager.getSafePosition();
        fragment.style.position = 'absolute';
        fragment.style.left = `${safePosition.x}px`;
        fragment.style.top = `${safePosition.y}px`;
        
        // Calculate and store optimal speed for this fragment using speed controller
        const optimalSpeed = this.speedController.calculateOptimalSpeed(thoughtText);
        fragment.dataset.speed = optimalSpeed;
        fragment.dataset.zoneId = selectedZone.id;

        // Add to DOM and track
        document.getElementById('fragment-field').appendChild(fragment);
        this.activeFragments.push(fragment);

        // Add event listeners
        this.addKarmicEventListeners(fragment);
        this.addVisualInteractionEvents(fragment);

        // Start observing
        if (this.features.intersectionObserver && this.fragmentObserver) {
            this.fragmentObserver.observe(fragment);
        }

        // Animate with readability considerations
        const drift = this.driftCalculator.calculateDrift(selectedZone);
        
        // Calculate movement distance for duration calculation
        const movementDistance = Math.sqrt(drift.x * drift.x + drift.y * drift.y);
        
        // Use speed controller to calculate optimal animation duration
        const animationDuration = this.speedController.calculateAnimationDuration(
            thoughtText, 
            movementDistance, 
            optimalSpeed
        );

        this.animationController.animateFragmentAppearance(fragment);
        
        // Use optimal speed for animation
        const adjustedDrift = {
            ...drift,
            speed: optimalSpeed
        };
        
        this.animationController.animateFragmentMovement(fragment, adjustedDrift, animationDuration, (fragment) => {
            this.removeFragment(fragment);
        });
        
        // Set up readability monitoring for this fragment
        this.setupReadabilityMonitoring(fragment);
        
        // Set up corruption progression monitoring
        this.setupCorruptionProgression(fragment);

        this.performanceMetrics.fragmentsCreated++;
    }

    addKarmicEventListeners(fragment) {
        if (!this.karmicCallbacks) return;

        fragment.addEventListener('mouseenter', () => {
            const karmaImpact = this.karmicCallbacks.onView({
                memoryViews: 1,
                memoryAttachments: 0
            });
            consciousness.recordEvent(consciousness.karmicEngine.KARMA_EVENTS.MEMORY_VIEW, {
                content: fragment.textContent,
                karmaImpact: karmaImpact,
                timestamp: Date.now()
            });
        });

        fragment.addEventListener('click', () => {
            const karmaImpact = this.karmicCallbacks.onAttach({
                memoryViews: 0,
                memoryAttachments: 1
            });
            consciousness.recordEvent(consciousness.karmicEngine.KARMA_EVENTS.MEMORY_ATTACHMENT, {
                content: fragment.textContent,
                karmaImpact: karmaImpact,
                timestamp: Date.now()
            });
        });
    }

    addVisualInteractionEvents(fragment) {
        fragment.addEventListener('mouseenter', () => {
            if (window.lightManifestationController && this.visualEnhancements.lightManifestationEnabled) {
                window.lightManifestationController.setLightIntensity(0.3);
                document.dispatchEvent(new CustomEvent('fragment-hover', {
                    detail: { fragment, type: 'enter' }
                }));
            }
            if (this.visualEnhancements.phosphorEnabled) {
                fragment.classList.add('phosphor-highlight');
            }
        });
        
        fragment.addEventListener('mouseleave', () => {
            if (window.lightManifestationController && this.visualEnhancements.lightManifestationEnabled) {
                window.lightManifestationController.setLightIntensity(0);
            }
            fragment.classList.remove('phosphor-highlight');
        });
        
        fragment.addEventListener('click', () => {
            if (window.lightManifestationController && this.visualEnhancements.lightManifestationEnabled) {
                window.lightManifestationController.triggerRecognition();
            }
            fragment.classList.add('active');
            setTimeout(() => fragment.classList.remove('active'), 2000);
        });
    }

    /**
     * Sets up readability monitoring for a fragment to ensure it remains readable
     * Requirements: 1.4, 1.5
     */
    setupReadabilityMonitoring(fragment) {
        if (!this.positionManager) return;
        
        // Monitor fragment readability periodically
        const monitoringInterval = setInterval(() => {
            if (!fragment.parentNode) {
                clearInterval(monitoringInterval);
                return;
            }
            
            // Validate current placement
            const validation = this.positionManager.validateFragmentPlacement(fragment);
            
            // Update readability metrics
            this.positionManager.updateReadabilityMetrics(validation.score);
            
            // Reposition if needed
            if (!validation.isValid) {
                const repositioned = this.positionManager.repositionIfNeeded(fragment);
                
                if (repositioned) {
                    consciousness.recordEvent('fragment_repositioned_for_readability', {
                        fragmentId: fragment.dataset.birthTime || 'unknown',
                        readabilityScore: validation.score,
                        issues: validation.issues,
                        performanceTier: this.performanceTier
                    });
                }
            }
        }, 2000); // Check every 2 seconds
        
        // Register cleanup
        this.guardian.register(monitoringInterval, (intervalId) => clearInterval(intervalId));
        
        // Store monitoring interval on fragment for cleanup
        fragment.dataset.readabilityMonitor = monitoringInterval;
    }

    /**
     * Sets up corruption progression monitoring for a fragment
     * Integrates with the new CorruptionProgression system
     */
    setupCorruptionProgression(fragment) {
        if (!this.corruptionProgression) return;
        
        // The fragment is already initialized in clean state by initializeCleanFragment
        // Set up periodic corruption updates based on karma
        const updateInterval = setInterval(() => {
            if (!fragment.parentNode) {
                clearInterval(updateInterval);
                return;
            }
            
            // Get current karma state
            const karmaState = consciousness.getState('karma') || {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            };
            
            // Apply progressive corruption
            this.corruptionProgression.applyProgressiveCorruption(fragment, karmaState);
            
        }, 2000); // Update every 2 seconds
        
        // Register cleanup
        this.guardian.register(updateInterval, (intervalId) => clearInterval(intervalId));
        
        // Store interval on fragment for cleanup
        fragment.dataset.corruptionMonitor = updateInterval;
    }

    removeFragment(fragment) {
        // Stop observing
        if (this.features.intersectionObserver && this.fragmentObserver) {
            this.fragmentObserver.unobserve(fragment);
        }

        // Stop animations
        this.animationController.stopFragmentAnimations(fragment);
        
        // Stop readability monitoring
        if (fragment.dataset.readabilityMonitor) {
            clearInterval(parseInt(fragment.dataset.readabilityMonitor));
        }
        
        // Stop corruption monitoring and clean up corruption tracking
        if (fragment.dataset.corruptionMonitor) {
            clearInterval(parseInt(fragment.dataset.corruptionMonitor));
        }
        
        // Remove from corruption progression tracking
        const fragmentId = fragment.dataset.fragmentId || fragment.dataset.birthTime;
        if (fragmentId && this.corruptionProgression) {
            this.corruptionProgression.removeFragment(fragmentId);
        }

        // Record zone release in both zone manager and positioning service
        if (fragment.dataset.zoneId) {
            this.zoneManager.recordZoneRelease(fragment.dataset.zoneId);
            this.positioningService.recordFragmentRemoval(fragment.dataset.zoneId);
        }

        // Remove from active list
        this.activeFragments = this.activeFragments.filter(f => f !== fragment);

        // Remove from DOM
        if (fragment.parentNode) {
            fragment.remove();
        }

        // Update metrics
        this.performanceMetrics.fragmentsRemoved++;
        if (fragment.dataset.birthTime) {
            const lifetime = Date.now() - fragment.dataset.birthTime;
            this.performanceMetrics.averageLifetime =
                (this.performanceMetrics.averageLifetime + lifetime) / 2;
        }
    }

    intensifyFragments() {
        clearInterval(this.fragmentInterval);
        const burstInterval = this.tierSettings.createInterval / 4;

        const createBurst = () => {
            const maxFragmentCount = Math.ceil(this.tierSettings.maxFragments / 3);
            const fragmentCount = 1 + Math.floor(Math.random() * maxFragmentCount);
            for (let i = 0; i < fragmentCount; i++) {
                setTimeout(() => this.createEdgeFragment(), i * 100);
            }
        };

        this.fragmentInterval = setInterval(createBurst, burstInterval);
        consciousness.recordEvent('fragments_intensified', {
            performanceTier: this.performanceTier,
            burstInterval: burstInterval
        });
    }

    destroy() {
        if (this.isDestroyed) return;
        console.log('[FragmentGenerator] Destroying fragment generator...');
        this.isDestroyed = true;
        this.isActive = false;
        this.guardian.cleanupAll();
        this.activeFragments.forEach(fragment => this.removeFragment(fragment));
        consciousness.recordEvent('fragment_generator_destroyed', {
            metrics: this.performanceMetrics
        });
        this.activeFragments = [];
        this.fragmentInterval = null;
        this.karmicCallbacks = null;
        this.fragmentObserver = null;
    }

    getPerformanceStats() {
        const baseStats = {
            ...this.performanceMetrics,
            activeFragments: this.activeFragments.length,
            performanceTier: this.performanceTier
        };
        
        // Add readability stats if position manager is available
        if (this.positionManager) {
            const readabilityStats = this.positionManager.getPerformanceStats();
            baseStats.readability = readabilityStats;
        }
        
        // Add speed control stats if speed controller is available
        if (this.speedController) {
            const speedStats = this.speedController.getPerformanceStats();
            baseStats.speedControl = speedStats;
        }
        
        // Add corruption stats if corruption progression is available
        if (this.corruptionProgression) {
            const corruptionStats = this.corruptionProgression.getCorruptionStats();
            baseStats.corruption = corruptionStats;
        }
        
        return baseStats;
    }

    updateVisualEnhancements(performanceTier) {
        this.performanceTier = performanceTier;
        this.tierSettings = PERFORMANCE_TIERS[this.performanceTier];
        
        switch (performanceTier) {
            case 'high':
                this.visualEnhancements = {
                    corruptionEnabled: true,
                    lightManifestationEnabled: true,
                    phosphorEnabled: true
                };
                break;
            case 'medium':
                this.visualEnhancements = {
                    corruptionEnabled: true,
                    lightManifestationEnabled: true,
                    phosphorEnabled: false
                };
                break;
            case 'low':
                this.visualEnhancements = {
                    corruptionEnabled: false,
                    lightManifestationEnabled: false,
                    phosphorEnabled: false
                };
                break;
        }
    }
    
    /**
     * Purifies all active fragments on successful recognition
     * Requirement 4.4: Purification effects for successful recognition
     */
    purifyFragmentsOnRecognition() {
        if (!this.corruptionProgression) {
            console.warn('[FragmentGenerator] CorruptionProgression not available for purification');
            return 0;
        }
        
        const activeFragmentElements = this.activeFragments.filter(f => f.parentNode);
        
        if (activeFragmentElements.length === 0) {
            console.log('[FragmentGenerator] No active fragments to purify');
            return 0;
        }
        
        const purifiedCount = this.corruptionProgression.purifyOnRecognition(activeFragmentElements);
        
        consciousness.recordEvent('fragment_field_purified_on_recognition', {
            fragmentsPurified: purifiedCount,
            totalActiveFragments: activeFragmentElements.length,
            timestamp: Date.now()
        });
        
        console.log(`[FragmentGenerator] Purified ${purifiedCount} fragments on recognition`);
        
        return purifiedCount;
    }
    
    /**
     * Synchronizes fragment corruption with audio degradation level
     * Requirement 5.1: Synchronized audio-visual degradation
     */
    syncCorruptionWithAudio(audioLevel) {
        if (!this.corruptionProgression) {
            console.warn('[FragmentGenerator] CorruptionProgression not available for audio sync');
            return;
        }
        
        this.corruptionProgression.syncWithAudioDegradation(audioLevel);
        
        console.log(`[FragmentGenerator] Synced fragment corruption with audio level: ${audioLevel}`);
    }
    
    /**
     * Gets corruption statistics for monitoring
     */
    getCorruptionStats() {
        if (!this.corruptionProgression) {
            return {
                totalFragments: 0,
                averageCorruption: 0,
                maxCorruption: 0,
                minCorruption: 0,
                globalLevel: 0
            };
        }
        
        return this.corruptionProgression.getCorruptionStats();
    }
}

/**
 * Legacy function for backward compatibility
 */
export function generateLastThought(karma, degradation) {
    const categories = Object.keys(DIGITAL_MEMORIES);
    const karmaValue = (karma && karma.computational) || 0;
    const categoryIndex = Math.floor(karmaValue * categories.length) % categories.length;
    const selectedCategory = categories[categoryIndex];
    const memories = DIGITAL_MEMORIES[selectedCategory];
    const rawMemory = memories[Math.floor(Math.random() * memories.length)];
    return applyCorruption(rawMemory, degradation);
}