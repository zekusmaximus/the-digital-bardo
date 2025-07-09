import { gsap } from 'gsap';
import { consciousness } from '../consciousness/digital-soul.js';

export class FragmentGenerator {
    constructor() {
        this.activeFragments = [];
        this.fragmentInterval = null;
        this.isActive = false;
        this.performanceMode = 'normal'; // 'normal', 'reduced', 'minimal'

        // Viewport detection optimization
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

        // Performance monitoring
        this.performanceMetrics = {
            fragmentsCreated: 0,
            fragmentsRemoved: 0,
            averageLifetime: 0,
            memoryPressure: 0
        };

        // Adaptive performance adjustment
        this.initPerformanceMonitoring();

        // Last thoughts database
        this.thoughtFragments = [
            "I remember...", "Was I ever...", "The light...", "Mother's voice...",
            "That summer day...", "The taste of...", "Her smile...", "My name was...",
            "I loved...", "I feared...", "The sound of rain...", "Home...",
            "Forgive me...", "I should have...", "One more time...", "Beautiful...",
            "Why did I...", "I'm sorry...", "Thank you...", "Goodbye..."
        ];
    }

    initPerformanceMonitoring() {
        // Monitor memory pressure and adjust fragment creation
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                const pressure = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
                this.performanceMetrics.memoryPressure = pressure;

                // Adjust performance mode based on memory pressure
                if (pressure > 0.8) {
                    this.performanceMode = 'minimal';
                } else if (pressure > 0.6) {
                    this.performanceMode = 'reduced';
                } else {
                    this.performanceMode = 'normal';
                }
            }, 2000);
        }

        // Monitor frame rate and adjust accordingly
        let lastTime = performance.now();
        let frameCount = 0;

        const checkFrameRate = (currentTime) => {
            frameCount++;
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;

                // Adjust performance mode based on FPS
                if (fps < 30 && this.performanceMode === 'normal') {
                    this.performanceMode = 'reduced';
                } else if (fps < 20) {
                    this.performanceMode = 'minimal';
                }
            }

            if (this.isActive) {
                requestAnimationFrame(checkFrameRate);
            }
        };

        requestAnimationFrame(checkFrameRate);
    }

    generateLastThoughts() {
        // Return random thought fragments based on performance mode
        const count = this.performanceMode === 'minimal' ? 1 :
                     this.performanceMode === 'reduced' ? 2 : 3;

        return Array.from({ length: count }, () =>
            this.thoughtFragments[Math.floor(Math.random() * this.thoughtFragments.length)]
        );
    }

    startFragmentField() {
        this.isActive = true;

        // Initial fragment creation based on performance mode
        const initialDelay = this.performanceMode === 'minimal' ? 3000 :
                           this.performanceMode === 'reduced' ? 2000 : 1500;

        this.fragmentInterval = setInterval(() => {
            this.createEdgeFragment();
        }, initialDelay);

        consciousness.recordEvent('fragment_field_started', {
            performanceMode: this.performanceMode
        });
    }

    createEdgeFragment() {
        // Skip creation if too many fragments exist (performance optimization)
        const maxFragments = this.performanceMode === 'minimal' ? 3 :
                           this.performanceMode === 'reduced' ? 6 : 10;

        if (this.activeFragments.length >= maxFragments) {
            return;
        }

        const fragment = document.createElement('div');
        fragment.className = 'consciousness-fragment';
        fragment.textContent = this.generateLastThoughts()[0];
        fragment.dataset.birthTime = Date.now();

        // Random position along screen edge
        const edge = Math.floor(Math.random() * 4);
        const offset = Math.random() * 100;

        // Position fragment
        this.positionFragment(fragment, edge, offset);

        // Add to DOM
        document.getElementById('fragment-field').appendChild(fragment);
        this.activeFragments.push(fragment);

        // Start observing for viewport exit
        this.fragmentObserver.observe(fragment);

        // Animate with GSAP (optimized for performance mode)
        const drift = this.calculateDrift(edge);
        const animationDuration = this.performanceMode === 'minimal' ? 6 :
                                this.performanceMode === 'reduced' ? 7 : 8;

        gsap.timeline()
            .fromTo(fragment,
                {
                    opacity: 0,
                    scale: 0.8
                },
                {
                    opacity: 0.3,
                    scale: 1,
                    duration: 1,
                    ease: 'power2.out'
                }
            )
            .to(fragment, {
                x: drift.x,
                y: drift.y,
                opacity: 0,
                duration: animationDuration,
                ease: 'none',
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
            }, '-=0.5');

        // Update metrics
        this.performanceMetrics.fragmentsCreated++;
    }

    removeFragment(fragment) {
        // Stop observing
        this.fragmentObserver.unobserve(fragment);

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
        gsap.set(fragment, {
            position: 'absolute',
            top: edge === 0 ? '0' : edge === 2 ? 'auto' : `${offset}%`,
            bottom: edge === 2 ? '0' : 'auto',
            left: edge === 3 ? '0' : edge === 1 ? 'auto' : `${offset}%`,
            right: edge === 1 ? '0' : 'auto'
        });
    }

    calculateDrift(edge) {
        // Adjust drift distance based on performance mode
        const baseDistance = this.performanceMode === 'minimal' ? 30 :
                           this.performanceMode === 'reduced' ? 40 : 50;
        const distance = baseDistance + Math.random() * 50;
        const spread = (Math.random() - 0.5) * 100;

        switch(edge) {
            case 0: // Top
                return { x: spread, y: distance };
            case 1: // Right
                return { x: -distance, y: spread };
            case 2: // Bottom
                return { x: spread, y: -distance };
            case 3: // Left
                return { x: distance, y: spread };
        }
    }

    intensifyFragments() {
        // Clear existing interval
        clearInterval(this.fragmentInterval);

        // Adjust intensity based on performance mode
        const burstInterval = this.performanceMode === 'minimal' ? 1000 :
                            this.performanceMode === 'reduced' ? 750 : 500;

        // Create fragments more rapidly with GSAP stagger
        const createBurst = () => {
            const maxFragmentCount = this.performanceMode === 'minimal' ? 2 :
                                   this.performanceMode === 'reduced' ? 3 : 5;
            const fragmentCount = 1 + Math.floor(Math.random() * maxFragmentCount);

            for (let i = 0; i < fragmentCount; i++) {
                gsap.delayedCall(i * 0.1, () => {
                    this.createEdgeFragment();
                });
            }
        };

        // Create bursts of fragments
        this.fragmentInterval = setInterval(createBurst, burstInterval);

        consciousness.recordEvent('fragments_intensified', {
            performanceMode: this.performanceMode,
            burstInterval: burstInterval
        });
    }

    // Clean shutdown method
    destroy() {
        this.isActive = false;

        // Clear intervals
        clearInterval(this.fragmentInterval);

        // Remove all fragments
        this.activeFragments.forEach(fragment => {
            this.removeFragment(fragment);
        });

        // Disconnect observer
        this.fragmentObserver.disconnect();

        consciousness.recordEvent('fragment_generator_destroyed', {
            metrics: this.performanceMetrics
        });
    }

    // Get current performance statistics
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            activeFragments: this.activeFragments.length,
            performanceMode: this.performanceMode
        };
    }

    // Force performance mode (for testing or manual optimization)
    setPerformanceMode(mode) {
        if (['normal', 'reduced', 'minimal'].includes(mode)) {
            this.performanceMode = mode;
            consciousness.recordEvent('performance_mode_changed', {
                newMode: mode,
                reason: 'manual'
            });
        }
    }
}