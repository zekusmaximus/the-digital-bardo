import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { manifestElement } from '../src/security/consciousness-purification.js';
import { createKarmicValidator, thoughtFragmentSchema } from '../src/security/karmic-validation.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

const PERFORMANCE_TIERS = {
    high: { maxFragments: 15, createInterval: 2000, animationDuration: 20 },
    medium: { maxFragments: 8, createInterval: 3000, animationDuration: 15 },
    low: { maxFragments: 4, createInterval: 5000, animationDuration: 12 },
};

function detectPerformanceTier() {
    // Basic heuristics: These values are just examples
    const deviceMemory = navigator.deviceMemory || 2; // Default to 2GB if not available
    const hardwareConcurrency = navigator.hardwareConcurrency || 4; // Default to 4 cores

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

/**
 * Applies corruption to a text string based on a degradation level.
 * Placeholder implementation.
 * @param {string} text The text to corrupt.
 * @param {number} level The degradation level (e.g., 0 to 1).
 * @returns {string} The corrupted text.
 */
function applyCorruption(text, level) {
    const GLITCH_CHARS = ['▓', '░', '█', '▒', '#', '§', '¶'];
    return text.split('').map(char => {
        if (char.trim() === '') return char;

        // random removal
        if (Math.random() < level * 0.1) {
            return '';
        }

        // replace with glitch character
        if (Math.random() < level * 0.4) {
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }

        // insert html entity corruption
        if (Math.random() < level * 0.2) {
            return `&#x${char.charCodeAt(0).toString(16)};`;
        }

        return char;
    }).join('');
}


/**
 * Generates a final thought fragment based on karma and degradation.
 * @param {object} karma - The karmic state of the consciousness.
 * @param {number} degradation - The current level of system degradation.
 * @returns {string} A corrupted thought fragment.
 */
export function generateLastThought(karma, degradation) {
    const categories = Object.keys(DIGITAL_MEMORIES);
    
    // Placeholder karma-based category selection
    // Use computational karma to cycle through categories.
    const karmaValue = (karma && karma.computational) || 0;
    const categoryIndex = Math.floor(karmaValue * categories.length) % categories.length;
    const selectedCategory = categories[categoryIndex];

    const memories = DIGITAL_MEMORIES[selectedCategory];
    const rawMemory = memories[Math.floor(Math.random() * memories.length)];

    return applyCorruption(rawMemory, degradation);
}

// Simulated Personal Data (privacy-preserving)
const thought_data = {
    origins: ["a quiet town", "the city that never sleeps", "a place of light", "the digital sea", "a forgotten server"],
    windows: ["a view of the rain", "the skyline at dusk", "a screen filled with code", "trees swaying in the wind"],
    times: ["just before dawn", "late afternoon", "3:14 AM", "the blink of an eye"],
    colors: ["a deep blue", "the color of static", "warm grey", "faded sepia"],
    devices: ["a humming server", "a pocket-sized screen", "an old CRT monitor", "a network of nodes"]
};

// Thought Templates
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

// Corruption Effects
const corruption_levels = {
    minimal: { charReplace: 0.05, truncation: 0.05, entity: 0.01 },
    moderate: { charReplace: 0.20, truncation: 0.25, entity: 0.05 },
    severe: { charReplace: 0.40, truncation: 0.50, entity: 0.15 },
    complete: { charReplace: 1.0, truncation: 1.0, entity: 0.50 }
};

export class FragmentGenerator {
    constructor(karmicCallbacks = null) {
        this.activeFragments = [];
        this.fragmentInterval = null;
        this.isActive = false;
        this.karmicCallbacks = karmicCallbacks; // Callbacks for karma tracking
        this.guardian = new ResourceGuardian();

        this.performanceTier = detectPerformanceTier();
        this.tierSettings = PERFORMANCE_TIERS[this.performanceTier];
        console.log(`Performance Tier detected: ${this.performanceTier}`);


        // Feature availability flags
        this.features = {
            intersectionObserver: false,
        };

        // Initialize viewport detection optimization with error handling
        this.initializeIntersectionObserver();

        // Performance metrics
        this.performanceMetrics = {
            fragmentsCreated: 0,
            fragmentsRemoved: 0,
            averageLifetime: 0,
        };
    }

    initializeIntersectionObserver() {
        try {
            if ('IntersectionObserver' in window) {
                this.fragmentObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            // Fragment has drifted beyond perception
                            const fragment = entry.target;
                            const content = fragment.textContent;

                            // Record the dissolution event
                            consciousness.recordEvent('memory_dissolved', {
                                content: content,
                                timeVisible: Date.now() - (fragment.dataset.birthTime || Date.now()),
                                naturalDissolution: true
                            });

                            // Clean removal
                            this.removeFragment(fragment);
                        }
                    });
                }, {
                    rootMargin: '50px',
                    threshold: 0
                });
                this.guardian.register(this.fragmentObserver, (observer) => observer.disconnect());

                this.features.intersectionObserver = true;
                console.log('IntersectionObserver initialized - viewport optimization available');
            } else {
                console.log('IntersectionObserver not available, using fallback cleanup method');
                this.features.intersectionObserver = false;
                // Fallback: use timer-based cleanup
                this.initializeFallbackCleanup();
            }
        } catch (error) {
            console.log('IntersectionObserver initialization failed, falling back to timer cleanup:', error.message);
            this.features.intersectionObserver = false;
            this.initializeFallbackCleanup();
        }
    }

    initializeFallbackCleanup() {
        // Fallback cleanup method for browsers without IntersectionObserver
        setInterval(() => {
            if (!this.isActive) return;

            this.activeFragments.forEach(fragment => {
                if (fragment.parentNode) {
                    const rect = fragment.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight &&
                                    rect.bottom > 0 &&
                                    rect.left < window.innerWidth &&
                                    rect.right > 0;

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
        }, 2000); // Check every 2 seconds
    }


    generateLastThoughts(degradationLevel = 'minimal', seed = null) {
        // Seeded random number generator for reproducible testing
        let currentSeed = seed || Date.now();
        const seededRandom = () => {
            const x = Math.sin(currentSeed++) * 10000;
            return x - Math.floor(x);
        };

        // Mix ratio: 70% personal, 30% existential
        const isPersonal = seededRandom() < 0.7;
        let fragment;

        if (isPersonal) {
            // Select random personal template
            const templates = thought_templates.personal;
            const template = templates[Math.floor(seededRandom() * templates.length)];

            // Fill template placeholders
            fragment = template.replace(/\{(\w+)\}/g, (match, key) => {
                if (thought_data[key]) {
                    const options = thought_data[key];
                    return options[Math.floor(seededRandom() * options.length)];
                }
                return match; // Return original if no data found
            });
        } else {
            // Select random existential template
            const templates = thought_templates.existential;
            fragment = templates[Math.floor(seededRandom() * templates.length)];
        }

        // Apply corruption effects based on degradation level
        const corruption = corruption_levels[degradationLevel] || corruption_levels.minimal;

        // Character replacement corruption
        if (seededRandom() < corruption.charReplace) {
            const chars = fragment.split('');
            const numToReplace = Math.floor(chars.length * corruption.charReplace * seededRandom());
            for (let i = 0; i < numToReplace; i++) {
                const index = Math.floor(seededRandom() * chars.length);
                chars[index] = seededRandom() < 0.5 ? '▒' : '-';
            }
            fragment = chars.join('');
        }

        // Truncation corruption
        if (seededRandom() < corruption.truncation) {
            const truncateAt = Math.floor(fragment.length * (0.3 + seededRandom() * 0.4));
            fragment = fragment.substring(0, truncateAt) + '...';
        }

        // Entity corruption a bit differently; we will handle this sanely later
        if (seededRandom() < corruption.entity) {
            const entity = '&#x2620;'; // Skull and crossbones
            const insertAt = Math.floor(seededRandom() * fragment.length);
            fragment = fragment.substring(0, insertAt) + entity + fragment.substring(insertAt);
        }

        return fragment;
    }

    startFragmentField() {
        this.isActive = true;

        // Initial fragment creation is now based on performance tier
        const createInterval = this.tierSettings.createInterval;

        // Create an immediate test fragment
        setTimeout(() => {
            this.createEdgeFragment();
        }, 100);

        this.fragmentInterval = setInterval(() => {
            this.createEdgeFragment();
        }, createInterval);
        this.guardian.register(this.fragmentInterval, (intervalId) => clearInterval(intervalId));

        consciousness.recordEvent('fragment_field_started', {
            performanceTier: this.performanceTier
        });
    }

    createEdgeFragment() {
        // Use maxFragments from the detected performance tier
        if (this.activeFragments.length >= this.tierSettings.maxFragments) {
            return;
        }

        // Determine degradation level from orchestrator or default to minimal
        let degradationLevel = 'minimal';
        try {
            // Try to access degradation level from global orchestrator
            if (window.clearLodeOrchestrator && window.clearLodeOrchestrator.audio &&
                typeof window.clearLodeOrchestrator.audio.getDegradationState === 'function') {
                degradationLevel = window.clearLodeOrchestrator.audio.getDegradationState();
            } else {
                console.warn('FragmentGenerator: Cannot access degradationLevel from orchestrator, defaulting to minimal corruption');
            }
        } catch (error) {
            console.warn('FragmentGenerator: Error accessing degradationLevel, defaulting to minimal corruption:', error.message);
        }

        // Generate and sanitize the corrupted thought
        const thoughtText = this.generateLastThoughts(degradationLevel);

        // Karmic Validation for the generated thought
        const validateThought = createKarmicValidator(thoughtFragmentSchema);
        if (!validateThought({ content: thoughtText })) {
            console.error("Karmic validation failed for thought fragment. Aborting creation.", { content: thoughtText });
            consciousness.recordEvent('corrupted_fragment_detected', {
                content: thoughtText,
                reason: 'Validation failed'
            });
            return; // Stop processing this fragment
        }

        const fragment = manifestElement('div', {
            attributes: {
                class: 'consciousness-fragment',
                'data-birth-time': Date.now()
            },
            textContent: thoughtText
        });

        // Random position along screen edge
        const edge = Math.floor(Math.random() * 4);
        const offset = Math.random() * 100;

        // Position fragment
        this.positionFragment(fragment, edge, offset);

        // Add to DOM
        document.getElementById('fragment-field').appendChild(fragment);
        this.activeFragments.push(fragment);

        // Add karmic event listeners if callbacks are available
        if (this.karmicCallbacks) {
            // Track memory views (mouseenter)
            fragment.addEventListener('mouseenter', () => {
                const karmaImpact = this.karmicCallbacks.onView({
                    memoryViews: 1,
                    memoryAttachments: 0
                });
                console.log('👁️ Memory view karma impact:', karmaImpact);

                // Record the event in consciousness
                consciousness.recordEvent(consciousness.karmicEngine.KARMA_EVENTS.MEMORY_VIEW, {
                    content: fragment.textContent,
                    karmaImpact: karmaImpact,
                    timestamp: Date.now()
                });
            });

            // Track memory attachments (click)
            fragment.addEventListener('click', () => {
                const karmaImpact = this.karmicCallbacks.onAttach({
                    memoryViews: 0,
                    memoryAttachments: 1
                });
                console.log('🔗 Memory attachment karma impact:', karmaImpact);

                // Record the event in consciousness
                consciousness.recordEvent(consciousness.karmicEngine.KARMA_EVENTS.MEMORY_ATTACHMENT, {
                    content: fragment.textContent,
                    karmaImpact: karmaImpact,
                    timestamp: Date.now()
                });
            });
        }

        // Start observing for viewport exit (if available)
        if (this.features.intersectionObserver && this.fragmentObserver) {
            this.fragmentObserver.observe(fragment);
        }

        // Animate with GSAP, using duration from the performance tier
        const drift = this.calculateDrift(edge);
        const { animationDuration } = this.tierSettings;

        // Animate with the guardian
        AnimationGuardian.safeAnimate(fragment, {
            opacity: 0.8,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            delay: 0
        });

        AnimationGuardian.safeAnimate(fragment, {
            x: drift.x * 0.2,
            y: drift.y * 0.2,
            duration: animationDuration * 0.7,
            ease: 'none',
            delay: 1
        });

        AnimationGuardian.safeAnimate(fragment, {
            x: drift.x * 0.5,
            y: drift.y * 0.5,
            opacity: 0,
            duration: animationDuration * 0.3,
            ease: 'power2.in',
            delay: 1 + (animationDuration * 0.7) - 0.5,
            onComplete: () => {
                // Only remove if still in DOM (might have been removed by observer)
                if (fragment.parentNode) {
                    consciousness.recordEvent('memory_dissolved', {
                        content: fragment.textContent,
                        timeVisible: Date.now() - fragment.dataset.birthTime,
                        naturalDissolution: false,
                        reason: 'animation_complete'
                    });
                    this.removeFragment(fragment);
                }
            }
        });

        // Update metrics
        this.performanceMetrics.fragmentsCreated++;
    }

    removeFragment(fragment) {
        // Stop observing (if available)
        if (this.features.intersectionObserver && this.fragmentObserver) {
            this.fragmentObserver.unobserve(fragment);
        }

        // Remove from active list
        this.activeFragments = this.activeFragments.filter(f => f !== fragment);

        // Remove from DOM
        if (fragment.parentNode) {
            fragment.remove();
        }

        // Update metrics
        this.performanceMetrics.fragmentsRemoved++;

        // Calculate average lifetime
        if (fragment.dataset.birthTime) {
            const lifetime = Date.now() - fragment.dataset.birthTime;
            this.performanceMetrics.averageLifetime =
                (this.performanceMetrics.averageLifetime + lifetime) / 2;
        }
    }

    positionFragment(fragment, edge, offset) {
        // Add some margin from the very edge to avoid bunching
        const edgeMargin = 5; // 5% margin from screen edge
        const usableSpace = 100 - (edgeMargin * 2); // 90% of screen space
        const adjustedOffset = edgeMargin + (offset * usableSpace / 100);

        const positions = {
            0: { top: '0px', left: `${adjustedOffset}%`, right: 'auto', bottom: 'auto' }, // Top edge
            1: { top: `${adjustedOffset}%`, left: 'auto', right: '0px', bottom: 'auto' }, // Right edge
            2: { top: 'auto', left: `${adjustedOffset}%`, right: 'auto', bottom: '0px' }, // Bottom edge
            3: { top: `${adjustedOffset}%`, left: '0px', right: 'auto', bottom: 'auto' }  // Left edge
        };

        const pos = positions[edge];

        AnimationGuardian.safeAnimate(fragment, {
            position: 'absolute',
            ...pos,
            duration: 0 // Instant change
        });
    }

    calculateDrift(edge) {
        // Drift is now based on tiers, but we'll simplify and make it less performance-dependent
        const baseDistance = 80; // Let's use a medium value for all tiers for now
        const distance = baseDistance + Math.random() * 50;

        // Much more conservative spread to prevent viewport overflow
        const spread = (Math.random() - 0.5) * 40; // Further reduced from 60 to 40

        switch(edge) {
            case 0: // Top - drift toward center and down
                return { x: spread, y: distance };
            case 1: // Right - drift toward center and left
                return { x: -distance, y: spread };
            case 2: // Bottom - drift toward center and up
                return { x: spread, y: -distance };
            case 3: // Left - drift toward center and right
                return { x: distance, y: spread };
        }
    }

    intensifyFragments() {
        // Clear existing interval
        clearInterval(this.fragmentInterval);

        // Adjust intensity based on performance tier - using inverted createInterval
        const burstInterval = this.tierSettings.createInterval / 4;

        // Create fragments more rapidly with GSAP stagger
        const createBurst = () => {
            const maxFragmentCount = Math.ceil(this.tierSettings.maxFragments / 3);
            const fragmentCount = 1 + Math.floor(Math.random() * maxFragmentCount);

            for (let i = 0; i < fragmentCount; i++) {
                setTimeout(() => this.createEdgeFragment(), i * 100);
            }
        };

        // Create bursts of fragments
        this.fragmentInterval = setInterval(createBurst, burstInterval);

        consciousness.recordEvent('fragments_intensified', {
            performanceTier: this.performanceTier,
            burstInterval: burstInterval
        });
    }

    /**
     * Shuts down the fragment generator and releases all associated resources.
     */
    destroy() {
        if (this.isDestroyed) {
            return;
        }
    
        console.log('[FragmentGenerator] Destroying fragment generator...');
        this.isDestroyed = true;
        this.isActive = false;
    
        this.guardian.cleanupAll();
    
        // Remove all fragments
        this.activeFragments.forEach(fragment => {
            this.removeFragment(fragment);
        });
    
        consciousness.recordEvent('fragment_generator_destroyed', {
            metrics: this.performanceMetrics
        });
    
        // Nullify properties
        this.activeFragments = [];
        this.fragmentInterval = null;
        this.karmicCallbacks = null;
        this.fragmentObserver = null;
    }

    // Get current performance statistics
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            activeFragments: this.activeFragments.length,
            performanceTier: this.performanceTier
        };
    }
}