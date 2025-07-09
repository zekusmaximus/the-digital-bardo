import { gsap } from 'gsap';
import { consciousness } from '../src/consciousness/digital-soul.js';

export class FragmentGenerator {
    constructor() {
        this.activeFragments = [];
        this.fragmentInterval = null;
        this.isActive = false;
        this.performanceMode = 'normal'; // 'normal', 'reduced', 'minimal'

        // Feature availability flags
        this.features = {
            intersectionObserver: false,
            performanceMemory: false,
            requestAnimationFrame: false
        };

        // Initialize viewport detection optimization with error handling
        this.initializeIntersectionObserver();

        // Performance monitoring
        this.performanceMetrics = {
            fragmentsCreated: 0,
            fragmentsRemoved: 0,
            averageLifetime: 0,
            memoryPressure: 0
        };

        // Adaptive monitoring state
        this.monitoringState = {
            currentInterval: 2000, // Start with 2 second interval
            minInterval: 500,      // Minimum 0.5 seconds for critical situations
            maxInterval: 10000,    // Maximum 10 seconds when stable
            stabilityCounter: 0,   // Count stable readings
            lastMemoryPressure: 0,
            lastPerformanceMode: 'normal',
            intervalId: null
        };

        // Adaptive performance adjustment
        this.initPerformanceMonitoring();

        // Log browser compatibility on initialization
        console.log('🔧 Fragment Generator Browser Compatibility:', this.getBrowserCompatibility());

        // Last thoughts database
        this.thoughtFragments = [
            "I remember...", "Was I ever...", "The light...", "Mother's voice...",
            "That summer day...", "The taste of...", "Her smile...", "My name was...",
            "I loved...", "I feared...", "The sound of rain...", "Home...",
            "Forgive me...", "I should have...", "One more time...", "Beautiful...",
            "Why did I...", "I'm sorry...", "Thank you...", "Goodbye..."
        ];
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

    initPerformanceMonitoring() {
        // Check for performance.memory availability with error handling
        this.initializeMemoryMonitoring();

        // Check for requestAnimationFrame availability and monitor frame rate
        this.initializeFrameRateMonitoring();
    }

    initializeMemoryMonitoring() {
        try {
            if ('memory' in performance && performance.memory) {
                // Test if we can actually access memory properties
                const testMemory = performance.memory.usedJSHeapSize;
                if (typeof testMemory === 'number') {
                    this.features.performanceMemory = true;
                    this.startAdaptiveMemoryMonitoring();
                    console.log('Performance.memory monitoring initialized - memory optimization available');
                } else {
                    throw new Error('Memory properties not accessible');
                }
            } else {
                throw new Error('Performance.memory not available');
            }
        } catch (error) {
            console.log('Performance.memory not available, using simplified performance monitoring:', error.message);
            this.features.performanceMemory = false;
            // Fallback: use basic performance monitoring without memory metrics
            this.startBasicPerformanceMonitoring();
        }
    }

    initializeFrameRateMonitoring() {
        try {
            if ('requestAnimationFrame' in window) {
                this.features.requestAnimationFrame = true;

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

                        // FPS changes also affect monitoring frequency
                        this.adjustMonitoringFrequency('fps', fps);
                    }

                    if (this.isActive) {
                        requestAnimationFrame(checkFrameRate);
                    }
                };

                requestAnimationFrame(checkFrameRate);
                console.log('RequestAnimationFrame monitoring initialized - smooth performance tracking available');
            } else {
                throw new Error('RequestAnimationFrame not available');
            }
        } catch (error) {
            console.log('RequestAnimationFrame not available, using timer-based monitoring:', error.message);
            this.features.requestAnimationFrame = false;
            // Fallback: use setInterval for basic performance monitoring
            this.startTimerBasedMonitoring();
        }
    }

    startBasicPerformanceMonitoring() {
        // Simplified performance monitoring without memory metrics
        console.log('Using basic performance monitoring without memory metrics');

        // Use a simple timer to periodically check performance
        setInterval(() => {
            if (!this.isActive) return;

            // Basic heuristics based on fragment count and timing
            const fragmentCount = this.activeFragments.length;
            const maxFragments = 15; // Conservative limit

            if (fragmentCount > maxFragments * 0.8) {
                this.performanceMode = 'reduced';
            } else if (fragmentCount > maxFragments * 0.6) {
                this.performanceMode = 'normal';
            }

            consciousness.recordEvent('basic_performance_check', {
                fragmentCount,
                performanceMode: this.performanceMode
            });
        }, 3000); // Check every 3 seconds
    }

    startTimerBasedMonitoring() {
        // Fallback monitoring using setInterval instead of requestAnimationFrame
        console.log('Using timer-based performance monitoring');

        let frameCount = 0;
        let lastTime = Date.now();

        const checkPerformance = () => {
            frameCount++;
            const currentTime = Date.now();

            if (currentTime - lastTime >= 1000) {
                // Estimate "FPS" based on timer frequency
                const estimatedFPS = frameCount;
                frameCount = 0;
                lastTime = currentTime;

                // Adjust performance mode based on estimated performance
                if (estimatedFPS < 30 && this.performanceMode === 'normal') {
                    this.performanceMode = 'reduced';
                } else if (estimatedFPS < 20) {
                    this.performanceMode = 'minimal';
                }

                consciousness.recordEvent('timer_performance_check', {
                    estimatedFPS,
                    performanceMode: this.performanceMode
                });
            }

            if (this.isActive) {
                setTimeout(checkPerformance, 16); // ~60fps equivalent
            }
        };

        setTimeout(checkPerformance, 16);
    }

    startAdaptiveMemoryMonitoring() {
        const monitorMemory = () => {
            try {
                const memInfo = performance.memory;

                // Safely access memory properties with additional checks
                if (!memInfo || typeof memInfo.usedJSHeapSize !== 'number' || typeof memInfo.jsHeapSizeLimit !== 'number') {
                    throw new Error('Memory properties not accessible');
                }

                const pressure = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
                const previousPressure = this.performanceMetrics.memoryPressure;
                const previousMode = this.performanceMode;

                this.performanceMetrics.memoryPressure = pressure;

                // Adjust performance mode based on memory pressure
                if (pressure > 0.8) {
                    this.performanceMode = 'minimal';
                } else if (pressure > 0.6) {
                    this.performanceMode = 'reduced';
                } else {
                    this.performanceMode = 'normal';
                }

                // Determine if performance is stable
                const pressureChange = Math.abs(pressure - previousPressure);
                const modeChanged = this.performanceMode !== previousMode;

                this.adjustMonitoringFrequency('memory', {
                    pressure,
                    pressureChange,
                    modeChanged
                });

                // Schedule next monitoring check
                this.monitoringState.intervalId = setTimeout(monitorMemory, this.monitoringState.currentInterval);

            } catch (error) {
                console.log('Memory monitoring failed, falling back to basic monitoring:', error.message);
                this.features.performanceMemory = false;
                // Switch to basic monitoring
                this.startBasicPerformanceMonitoring();
            }
        };

        // Start the adaptive monitoring
        monitorMemory();
    }

    adjustMonitoringFrequency(source, data) {
        const state = this.monitoringState;
        let shouldIncrease = false;
        let shouldDecrease = false;

        if (source === 'memory') {
            const { pressure, pressureChange, modeChanged } = data;

            // Increase frequency (decrease interval) if:
            // - High memory pressure
            // - Rapid changes in memory pressure
            // - Performance mode changed
            if (pressure > 0.7 || pressureChange > 0.05 || modeChanged) {
                shouldIncrease = true;
                state.stabilityCounter = 0;
            } else if (pressureChange < 0.01 && !modeChanged) {
                // Stable conditions
                state.stabilityCounter++;
                if (state.stabilityCounter >= 5) { // 5 stable readings
                    shouldDecrease = true;
                }
            }
        } else if (source === 'fps') {
            // Increase frequency if low FPS
            if (data < 30) {
                shouldIncrease = true;
                state.stabilityCounter = 0;
            } else if (data > 50) {
                // Good FPS, can reduce monitoring frequency
                state.stabilityCounter++;
                if (state.stabilityCounter >= 3) {
                    shouldDecrease = true;
                }
            }
        }

        // Adjust the monitoring interval
        if (shouldIncrease && state.currentInterval > state.minInterval) {
            state.currentInterval = Math.max(
                state.minInterval,
                state.currentInterval * 0.7 // Decrease interval by 30%
            );
            console.log(`🔍 Increased monitoring frequency: ${state.currentInterval}ms (${source})`);
        } else if (shouldDecrease && state.currentInterval < state.maxInterval) {
            state.currentInterval = Math.min(
                state.maxInterval,
                state.currentInterval * 1.5 // Increase interval by 50%
            );
            state.stabilityCounter = 0; // Reset counter after adjustment
            console.log(`😌 Decreased monitoring frequency: ${state.currentInterval}ms (stable performance)`);
        }
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

        // Start observing for viewport exit (if available)
        if (this.features.intersectionObserver && this.fragmentObserver) {
            this.fragmentObserver.observe(fragment);
        }

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

        // Clear adaptive monitoring
        if (this.monitoringState.intervalId) {
            clearTimeout(this.monitoringState.intervalId);
        }

        // Remove all fragments
        this.activeFragments.forEach(fragment => {
            this.removeFragment(fragment);
        });

        // Disconnect observer (if available)
        if (this.features.intersectionObserver && this.fragmentObserver) {
            this.fragmentObserver.disconnect();
        }

        consciousness.recordEvent('fragment_generator_destroyed', {
            metrics: this.performanceMetrics,
            monitoringStats: {
                finalInterval: this.monitoringState.currentInterval,
                stabilityCounter: this.monitoringState.stabilityCounter
            }
        });
    }

    // Get current performance statistics
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            activeFragments: this.activeFragments.length,
            performanceMode: this.performanceMode,
            features: this.features,
            adaptiveMonitoring: {
                currentInterval: this.monitoringState.currentInterval,
                stabilityCounter: this.monitoringState.stabilityCounter,
                monitoringEfficiency: this.calculateMonitoringEfficiency()
            }
        };
    }

    // Calculate monitoring efficiency (lower intervals when needed, higher when stable)
    calculateMonitoringEfficiency() {
        const intervalRange = this.monitoringState.maxInterval - this.monitoringState.minInterval;
        const currentPosition = this.monitoringState.currentInterval - this.monitoringState.minInterval;
        const efficiency = currentPosition / intervalRange;

        // Return efficiency score (0 = most frequent monitoring, 1 = least frequent)
        return Math.round(efficiency * 100) / 100;
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

    // Configure adaptive monitoring sensitivity
    setMonitoringSensitivity(sensitivity = 'normal') {
        const configs = {
            'low': {
                minInterval: 1000,
                maxInterval: 30000,
                stabilityThreshold: 10
            },
            'normal': {
                minInterval: 500,
                maxInterval: 10000,
                stabilityThreshold: 5
            },
            'high': {
                minInterval: 250,
                maxInterval: 5000,
                stabilityThreshold: 3
            },
            'realtime': {
                minInterval: 100,
                maxInterval: 2000,
                stabilityThreshold: 2
            }
        };

        if (configs[sensitivity]) {
            const config = configs[sensitivity];
            this.monitoringState.minInterval = config.minInterval;
            this.monitoringState.maxInterval = config.maxInterval;
            this.monitoringState.stabilityThreshold = config.stabilityThreshold;

            // Adjust current interval to fit within new bounds
            this.monitoringState.currentInterval = Math.max(
                config.minInterval,
                Math.min(config.maxInterval, this.monitoringState.currentInterval)
            );

            consciousness.recordEvent('monitoring_sensitivity_changed', {
                sensitivity: sensitivity,
                config: config
            });

            console.log(`🎛️ Monitoring sensitivity set to: ${sensitivity}`, config);
        }
    }

    // Get browser compatibility information
    getBrowserCompatibility() {
        return {
            features: this.features,
            capabilities: {
                viewportOptimization: this.features.intersectionObserver ? 'IntersectionObserver' : 'Timer-based fallback',
                memoryMonitoring: this.features.performanceMemory ? 'Performance.memory API' : 'Basic heuristics',
                frameRateMonitoring: this.features.requestAnimationFrame ? 'RequestAnimationFrame' : 'Timer-based',
                overallCompatibility: this.calculateCompatibilityScore()
            },
            recommendations: this.getCompatibilityRecommendations()
        };
    }

    calculateCompatibilityScore() {
        const featureCount = Object.values(this.features).filter(Boolean).length;
        const totalFeatures = Object.keys(this.features).length;
        const score = (featureCount / totalFeatures) * 100;

        if (score >= 100) return 'Excellent';
        if (score >= 66) return 'Good';
        if (score >= 33) return 'Limited';
        return 'Basic';
    }

    getCompatibilityRecommendations() {
        const recommendations = [];

        if (!this.features.intersectionObserver) {
            recommendations.push('Consider updating browser for better viewport optimization');
        }

        if (!this.features.performanceMemory) {
            recommendations.push('Memory monitoring unavailable - performance adjustments will be basic');
        }

        if (!this.features.requestAnimationFrame) {
            recommendations.push('Frame rate monitoring will be less accurate');
        }

        if (recommendations.length === 0) {
            recommendations.push('All features available - optimal performance expected');
        }

        return recommendations;
    }
}