import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

/**
 * FragmentSpeedController - Controls fragment movement speed for optimal readability
 * 
 * This class implements the requirements for speed control:
 * - Speed calculation based on fragment content length
 * - Maximum speed limits to ensure fragments remain readable
 * - Smooth speed transitions to avoid jarring movement changes
 * 
 * Requirements addressed: 1.3
 */
export class FragmentSpeedController {
    constructor(config = null) {
        this.guardian = new ResourceGuardian();
        
        // Speed control configuration
        this.config = {
            speedLimits: {
                maxSpeed: 120,        // pixels per second maximum
                minSpeed: 20,         // pixels per second minimum
                baseSpeedFactor: 0.8, // base speed multiplier
                lengthSpeedRatio: 2   // characters per pixel/second reduction
            },
            readability: {
                wordsPerMinute: 200,  // average reading speed
                charactersPerWord: 5, // average characters per word
                readingBuffer: 1.5,   // extra time multiplier for comfortable reading
                minReadingTime: 3     // minimum seconds to read any fragment
            },
            transitions: {
                smoothingEnabled: true,
                transitionDuration: 0.5, // seconds for speed transitions
                accelerationLimit: 50,   // max pixels/second² acceleration
                decelerationLimit: 30    // max pixels/second² deceleration
            },
            performance: {
                updateInterval: 100,  // milliseconds between speed updates
                adaptiveAdjustment: true, // adjust based on performance
                batteryOptimization: true // reduce calculations on low battery
            }
        };
        
        // Override with provided config
        if (config) {
            this.config = this.mergeConfig(this.config, config);
        }
        
        // Fragment speed tracking
        this.fragmentSpeeds = new Map();
        this.speedTransitions = new Map();
        
        // Performance monitoring
        this.performanceMetrics = {
            speedCalculations: 0,
            transitionsApplied: 0,
            averageSpeed: 0,
            speedViolations: 0
        };
        
        // Speed update interval
        this.updateInterval = null;
        
        console.log('[FragmentSpeedController] Initialized with config:', this.config);
    }

    /**
     * Calculates optimal speed for a fragment based on content length and readability
     * Requirements: 1.3
     */
    calculateOptimalSpeed(fragmentContent, currentSpeed = null) {
        if (!fragmentContent || typeof fragmentContent !== 'string') {
            return this.config.speedLimits.minSpeed;
        }
        
        const contentLength = fragmentContent.length;
        const { speedLimits, readability } = this.config;
        
        // Calculate reading time based on content
        const wordsEstimate = contentLength / readability.charactersPerWord;
        const readingTimeSeconds = Math.max(
            (wordsEstimate / readability.wordsPerMinute) * 60 * readability.readingBuffer,
            readability.minReadingTime
        );
        
        // Calculate speed based on reading time and typical movement distance
        const typicalDistance = Math.min(window.innerWidth, window.innerHeight) * 0.6;
        const readabilityBasedSpeed = typicalDistance / readingTimeSeconds;
        
        // Apply length-based speed reduction
        const lengthPenalty = contentLength * speedLimits.lengthSpeedRatio;
        const lengthAdjustedSpeed = Math.max(
            speedLimits.minSpeed,
            speedLimits.maxSpeed - lengthPenalty
        );
        
        // Use the more restrictive of the two calculations
        const baseSpeed = Math.min(readabilityBasedSpeed, lengthAdjustedSpeed);
        
        // Apply speed factor
        const adjustedSpeed = baseSpeed * speedLimits.baseSpeedFactor;
        
        // Ensure within limits
        const finalSpeed = Math.max(
            speedLimits.minSpeed,
            Math.min(speedLimits.maxSpeed, adjustedSpeed)
        );
        
        // Apply smooth transition if current speed exists
        let transitionedSpeed = finalSpeed;
        if (currentSpeed !== null && this.config.transitions.smoothingEnabled) {
            transitionedSpeed = this.calculateSmoothTransition(currentSpeed, finalSpeed);
        }
        
        // Update metrics
        this.performanceMetrics.speedCalculations++;
        this.updateAverageSpeed(transitionedSpeed);
        
        return transitionedSpeed;
    }

    /**
     * Calculates smooth speed transition to avoid jarring changes
     * Requirements: 1.3 (smooth speed transitions)
     */
    calculateSmoothTransition(currentSpeed, targetSpeed) {
        const speedDifference = Math.abs(targetSpeed - currentSpeed);
        const { transitions } = this.config;
        
        // If difference is small, no transition needed
        if (speedDifference < 5) {
            return targetSpeed;
        }
        
        // Calculate maximum allowed change based on acceleration limits
        const timeStep = this.config.performance.updateInterval / 1000; // convert to seconds
        const maxAcceleration = currentSpeed < targetSpeed ? 
            transitions.accelerationLimit : transitions.decelerationLimit;
        
        const maxSpeedChange = maxAcceleration * timeStep;
        
        // Apply speed change limit
        let transitionedSpeed;
        if (currentSpeed < targetSpeed) {
            // Accelerating
            transitionedSpeed = Math.min(targetSpeed, currentSpeed + maxSpeedChange);
        } else {
            // Decelerating
            transitionedSpeed = Math.max(targetSpeed, currentSpeed - maxSpeedChange);
        }
        
        // Track transition
        this.performanceMetrics.transitionsApplied++;
        
        return transitionedSpeed;
    }

    /**
     * Converts speed (pixels/second) to animation duration for a given distance
     */
    speedToDuration(speed, distance) {
        if (speed <= 0 || distance <= 0) {
            return 5; // fallback duration
        }
        
        const duration = distance / speed;
        
        // Ensure reasonable duration bounds
        return Math.max(1, Math.min(30, duration));
    }

    /**
     * Calculates animation duration based on fragment content and movement distance
     */
    calculateAnimationDuration(fragmentContent, movementDistance, baseSpeed = null) {
        const optimalSpeed = baseSpeed || this.calculateOptimalSpeed(fragmentContent);
        const duration = this.speedToDuration(optimalSpeed, movementDistance);
        
        console.log(`[FragmentSpeedController] Content: "${fragmentContent.substring(0, 30)}..." | Distance: ${movementDistance.toFixed(1)}px | Speed: ${optimalSpeed.toFixed(1)}px/s | Duration: ${duration.toFixed(1)}s`);
        
        return duration;
    }

    /**
     * Validates that a fragment's speed is within acceptable limits
     */
    validateFragmentSpeed(fragment, currentSpeed) {
        const { speedLimits } = this.config;
        const issues = [];
        
        if (currentSpeed > speedLimits.maxSpeed) {
            issues.push(`Speed too high: ${currentSpeed.toFixed(1)} > ${speedLimits.maxSpeed}`);
            this.performanceMetrics.speedViolations++;
        }
        
        if (currentSpeed < speedLimits.minSpeed) {
            issues.push(`Speed too low: ${currentSpeed.toFixed(1)} < ${speedLimits.minSpeed}`);
            this.performanceMetrics.speedViolations++;
        }
        
        // Check readability based on content
        if (fragment.textContent) {
            const optimalSpeed = this.calculateOptimalSpeed(fragment.textContent);
            const speedDifference = Math.abs(currentSpeed - optimalSpeed);
            
            if (speedDifference > optimalSpeed * 0.5) {
                issues.push(`Speed significantly different from optimal: ${currentSpeed.toFixed(1)} vs ${optimalSpeed.toFixed(1)}`);
            }
        }
        
        return {
            isValid: issues.length === 0,
            issues: issues,
            recommendedSpeed: issues.length > 0 ? this.calculateOptimalSpeed(fragment.textContent) : currentSpeed
        };
    }

    /**
     * Starts monitoring and controlling fragment speeds
     */
    startSpeedControl() {
        if (this.updateInterval) {
            return; // Already running
        }
        
        this.updateInterval = setInterval(() => {
            this.updateFragmentSpeeds();
        }, this.config.performance.updateInterval);
        
        this.guardian.register(this.updateInterval, (intervalId) => clearInterval(intervalId));
        
        consciousness.recordEvent('fragment_speed_control_started', {
            config: this.config,
            performanceMetrics: this.performanceMetrics
        });
        
        console.log('[FragmentSpeedController] Speed control started');
    }

    /**
     * Stops speed control monitoring
     */
    stopSpeedControl() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        consciousness.recordEvent('fragment_speed_control_stopped', {
            finalMetrics: this.performanceMetrics
        });
        
        console.log('[FragmentSpeedController] Speed control stopped');
    }

    /**
     * Updates speeds for all tracked fragments
     */
    updateFragmentSpeeds() {
        // Skip updates if performance optimization is needed
        if (this.shouldSkipUpdate()) {
            return;
        }
        
        for (const [fragmentId, speedData] of this.fragmentSpeeds) {
            const fragment = document.querySelector(`[data-fragment-id="${fragmentId}"]`);
            
            if (!fragment || !fragment.parentNode) {
                // Fragment no longer exists, clean up
                this.fragmentSpeeds.delete(fragmentId);
                this.speedTransitions.delete(fragmentId);
                continue;
            }
            
            // Recalculate optimal speed
            const currentSpeed = speedData.currentSpeed;
            const optimalSpeed = this.calculateOptimalSpeed(fragment.textContent, currentSpeed);
            
            // Update speed if it has changed significantly
            if (Math.abs(optimalSpeed - currentSpeed) > 2) {
                this.updateFragmentSpeed(fragmentId, optimalSpeed);
            }
        }
    }

    /**
     * Registers a fragment for speed monitoring
     */
    registerFragment(fragmentId, fragment, initialSpeed) {
        const optimalSpeed = this.calculateOptimalSpeed(fragment.textContent, initialSpeed);
        
        this.fragmentSpeeds.set(fragmentId, {
            fragment: fragment,
            currentSpeed: optimalSpeed,
            targetSpeed: optimalSpeed,
            lastUpdate: Date.now(),
            contentLength: fragment.textContent.length
        });
        
        // Store speed on fragment for external access
        fragment.dataset.speed = optimalSpeed.toString();
        
        console.log(`[FragmentSpeedController] Registered fragment ${fragmentId} with speed ${optimalSpeed.toFixed(1)}px/s`);
        
        return optimalSpeed;
    }

    /**
     * Updates speed for a specific fragment
     */
    updateFragmentSpeed(fragmentId, newSpeed) {
        const speedData = this.fragmentSpeeds.get(fragmentId);
        if (!speedData) return;
        
        const oldSpeed = speedData.currentSpeed;
        speedData.currentSpeed = newSpeed;
        speedData.targetSpeed = newSpeed;
        speedData.lastUpdate = Date.now();
        
        // Update fragment dataset
        if (speedData.fragment && speedData.fragment.parentNode) {
            speedData.fragment.dataset.speed = newSpeed.toString();
        }
        
        // Record speed change event
        consciousness.recordEvent('fragment_speed_updated', {
            fragmentId: fragmentId,
            oldSpeed: oldSpeed,
            newSpeed: newSpeed,
            contentLength: speedData.contentLength,
            reason: 'readability_optimization'
        });
        
        console.log(`[FragmentSpeedController] Updated fragment ${fragmentId} speed: ${oldSpeed.toFixed(1)} -> ${newSpeed.toFixed(1)}px/s`);
    }

    /**
     * Unregisters a fragment from speed monitoring
     */
    unregisterFragment(fragmentId) {
        this.fragmentSpeeds.delete(fragmentId);
        this.speedTransitions.delete(fragmentId);
        
        console.log(`[FragmentSpeedController] Unregistered fragment ${fragmentId}`);
    }

    /**
     * Gets current speed for a fragment
     */
    getFragmentSpeed(fragmentId) {
        const speedData = this.fragmentSpeeds.get(fragmentId);
        return speedData ? speedData.currentSpeed : null;
    }

    /**
     * Determines if speed updates should be skipped for performance
     */
    shouldSkipUpdate() {
        if (!this.config.performance.adaptiveAdjustment) {
            return false;
        }
        
        // Skip if too many fragments are being tracked
        if (this.fragmentSpeeds.size > 20) {
            return Math.random() < 0.5; // Skip 50% of updates
        }
        
        // Skip if battery is low (if battery API is available)
        if (this.config.performance.batteryOptimization && navigator.getBattery) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 && !battery.charging) {
                    return Math.random() < 0.7; // Skip 70% of updates
                }
            });
        }
        
        return false;
    }

    /**
     * Updates average speed metric
     */
    updateAverageSpeed(newSpeed) {
        const currentAverage = this.performanceMetrics.averageSpeed;
        const calculationCount = this.performanceMetrics.speedCalculations;
        
        this.performanceMetrics.averageSpeed = 
            (currentAverage * (calculationCount - 1) + newSpeed) / calculationCount;
    }

    /**
     * Merges configuration objects recursively
     */
    mergeConfig(defaultConfig, userConfig) {
        const merged = { ...defaultConfig };
        
        for (const key in userConfig) {
            if (userConfig[key] && typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
                merged[key] = this.mergeConfig(defaultConfig[key] || {}, userConfig[key]);
            } else {
                merged[key] = userConfig[key];
            }
        }
        
        return merged;
    }

    /**
     * Gets performance statistics
     */
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            trackedFragments: this.fragmentSpeeds.size,
            activeTransitions: this.speedTransitions.size,
            config: this.config
        };
    }

    /**
     * Destroys the speed controller and cleans up resources
     */
    destroy() {
        console.log('[FragmentSpeedController] Destroying speed controller');
        
        this.stopSpeedControl();
        this.guardian.cleanupAll();
        this.fragmentSpeeds.clear();
        this.speedTransitions.clear();
        
        consciousness.recordEvent('fragment_speed_controller_destroyed', {
            finalStats: this.getPerformanceStats()
        });
    }
}