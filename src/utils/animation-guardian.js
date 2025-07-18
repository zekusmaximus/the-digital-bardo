import { gsap } from 'gsap';
import { consciousness } from '../consciousness/digital-soul.js';

/**
 * A utility class to provide a safe wrapper around GSAP animations.
 * It handles errors gracefully, provides fallbacks if GSAP is unavailable,
 * and integrates with karma-driven behavior and performance tiers.
 */
export class AnimationGuardian {
    static performanceTiers = {
        high: { durationMultiplier: 1.0, complexityLevel: 'full' },
        medium: { durationMultiplier: 0.75, complexityLevel: 'reduced' },
        low: { durationMultiplier: 0.6, complexityLevel: 'minimal' }
    };

    /**
     * A safe wrapper for GSAP's `gsap.to()` method with performance tier adjustments.
     * @param {object} target The target element to animate.
     * @param {object} properties The GSAP properties for the animation.
     * @param {object} options Additional options for karma and performance integration.
     */
    static safeAnimate(target, properties, options = {}) {
        try {
            if (typeof gsap === 'undefined' || !gsap) {
                console.warn('GSAP is not available. Using CSS transition fallback.');
                return this.fallbackAnimate(target, properties, options);
            }

            // Apply performance tier adjustments
            const adjustedProperties = this.applyPerformanceTierAdjustments(properties, options);
            
            // Apply karma-driven modifications
            const karmaAdjustedProperties = this.applyKarmaAdjustments(adjustedProperties, options);

            // Enhanced properties with error handling
            const animationProps = {
                ...karmaAdjustedProperties,
                onError: (e) => {
                    // Only log if it's a meaningful error (not just 0)
                    if (e && e !== 0) {
                        console.warn('GSAP animation error:', e, 'Target:', target, 'Props:', karmaAdjustedProperties);
                    }
                    // Record karma event for animation errors
                    if (options.recordKarmaEvents) {
                        consciousness.recordEvent('animation_error', {
                            error: e,
                            target: target.className || 'unknown',
                            pathType: options.pathType || 'simple'
                        });
                    }
                    // Call original error handler if provided
                    if (properties.onError) {
                        properties.onError(e);
                    }
                },
                onComplete: (...args) => {
                    // Record karma event for successful animation completion
                    if (options.recordKarmaEvents) {
                        consciousness.recordEvent('animation_completed', {
                            target: target.className || 'unknown',
                            pathType: options.pathType || 'simple',
                            duration: karmaAdjustedProperties.duration || 1,
                            performanceTier: options.performanceTier || 'medium'
                        });
                    }
                    // Call original completion handler if provided
                    if (properties.onComplete) {
                        properties.onComplete(...args);
                    }
                }
            };

            return gsap.to(target, animationProps);

        } catch (error) {
            console.error('Error in safeAnimate:', error);
            // Record karma event for critical animation failures
            if (options.recordKarmaEvents) {
                consciousness.recordEvent('animation_critical_error', {
                    error: error.message,
                    target: target.className || 'unknown',
                    pathType: options.pathType || 'simple'
                });
            }
            return this.fallbackAnimate(target, properties, options);
        }
    }

    /**
     * Creates a safe GSAP timeline with performance and karma integration.
     * @param {object} options Timeline options including performance tier and karma settings.
     */
    static safeTimeline(options = {}) {
        try {
            if (typeof gsap === 'undefined' || !gsap) {
                console.warn('GSAP timeline not available. Using sequential fallback.');
                return this.createFallbackTimeline(options);
            }

            const timelineOptions = this.applyPerformanceTierAdjustments({}, options);
            const timeline = gsap.timeline(timelineOptions);

            // Add karma tracking to timeline
            if (options.recordKarmaEvents) {
                timeline.eventCallback('onComplete', () => {
                    consciousness.recordEvent('timeline_completed', {
                        pathType: options.pathType || 'complex',
                        performanceTier: options.performanceTier || 'medium',
                        waypointCount: options.waypointCount || 0
                    });
                });
            }

            return timeline;

        } catch (error) {
            console.error('Error creating GSAP timeline:', error);
            return this.createFallbackTimeline(options);
        }
    }

    /**
     * Creates a safe animation timeline for MovementPath objects with full karma and performance integration.
     * @param {object} target The target element to animate.
     * @param {MovementPath} movementPath The MovementPath instance defining the animation path.
     * @param {object} options Additional options for karma and performance integration.
     */
    static safePathAnimation(target, movementPath, options = {}) {
        try {
            if (typeof gsap === 'undefined' || !gsap) {
                console.warn('GSAP not available for path animation. Using fallback.');
                return this.fallbackPathAnimation(target, movementPath, options);
            }

            // Get karma state for adjustments
            const karmaState = options.karmaState || this.getKarmaState();
            
            // Apply performance tier adjustments to the path duration
            const performanceTier = options.performanceTier || this.detectPerformanceTier();
            const tierSettings = this.performanceTiers[performanceTier];
            const adjustedDuration = movementPath.duration * tierSettings.durationMultiplier;

            // Apply karma adjustments to duration and easing
            let finalDuration = adjustedDuration;
            let finalEasing = movementPath.easing;

            // Temporal karma affects animation timing
            if (karmaState.temporal < -3) {
                finalDuration *= 0.7; // Speed up for impatience
            } else if (karmaState.temporal > 3) {
                finalDuration *= 1.3; // Slow down for patience
            }

            // Emotional karma affects easing
            if (karmaState.emotional < -5 && finalEasing === 'none') {
                finalEasing = 'rough({ template: none, strength: 1, points: 10, taper: "none", randomize: true })';
            } else if (karmaState.emotional > 5 && finalEasing === 'none') {
                finalEasing = 'power2.inOut';
            }

            // Create timeline with enhanced options
            const timelineOptions = {
                ...options,
                pathType: movementPath.pathType,
                performanceTier: performanceTier,
                waypointCount: movementPath.waypoints.length,
                recordKarmaEvents: options.recordKarmaEvents !== false
            };

            const timeline = this.safeTimeline(timelineOptions);
            const waypoints = movementPath.getWaypoints();

            // Handle different complexity levels based on performance tier
            if (tierSettings.complexityLevel === 'minimal') {
                // Simplified animation for low-end devices
                return this.createSimplifiedPathAnimation(timeline, target, waypoints, finalDuration, finalEasing, options);
            } else if (tierSettings.complexityLevel === 'reduced') {
                // Moderate complexity animation
                return this.createReducedPathAnimation(timeline, target, waypoints, finalDuration, finalEasing, movementPath, options);
            } else {
                // Full complexity animation
                return this.createFullPathAnimation(timeline, target, waypoints, finalDuration, finalEasing, movementPath, karmaState, options);
            }

        } catch (error) {
            console.error('Error in safePathAnimation:', error);
            if (options.recordKarmaEvents) {
                consciousness.recordEvent('path_animation_critical_error', {
                    error: error.message,
                    pathType: movementPath.pathType,
                    target: target.className || 'unknown'
                });
            }
            return this.fallbackPathAnimation(target, movementPath, options);
        }
    }

    /**
     * Creates a simplified path animation for low-end devices.
     * @private
     */
    static createSimplifiedPathAnimation(timeline, target, waypoints, duration, easing, options) {
        if (waypoints.length === 0) {
            // Just fade out
            timeline.to(target, {
                opacity: 0,
                duration: duration * 0.3,
                ease: easing
            });
            return timeline;
        }

        // Simple linear movement to final waypoint
        const finalWaypoint = waypoints[waypoints.length - 1];
        timeline.to(target, {
            x: finalWaypoint.x,
            y: finalWaypoint.y,
            duration: duration * 0.7,
            ease: 'power1.out'
        });

        timeline.to(target, {
            opacity: 0,
            duration: duration * 0.3,
            ease: 'power2.in'
        });

        return timeline;
    }

    /**
     * Creates a reduced complexity path animation for mid-range devices.
     * @private
     */
    static createReducedPathAnimation(timeline, target, waypoints, duration, easing, movementPath, options) {
        if (waypoints.length === 0) {
            timeline.to(target, {
                opacity: 0,
                duration: duration * 0.3,
                ease: easing
            });
            return timeline;
        }

        // Animate through key waypoints only (every other waypoint for performance)
        const keyWaypoints = waypoints.filter((_, index) => index % 2 === 0 || index === waypoints.length - 1);
        const segmentDuration = duration / (keyWaypoints.length + 1);

        keyWaypoints.forEach((waypoint, index) => {
            const progress = (index + 1) / (keyWaypoints.length + 1);
            const segmentEasing = this.getProgressiveEasing(easing, progress);
            
            timeline.to(target, {
                x: waypoint.x,
                y: waypoint.y,
                duration: segmentDuration * 0.8,
                ease: segmentEasing
            });
        });

        // Final fade out
        timeline.to(target, {
            opacity: 0,
            duration: segmentDuration * 0.2,
            ease: 'power2.in'
        });

        return timeline;
    }

    /**
     * Creates a full complexity path animation with all features.
     * @private
     */
    static createFullPathAnimation(timeline, target, waypoints, duration, easing, movementPath, karmaState, options) {
        if (waypoints.length === 0) {
            timeline.to(target, {
                opacity: 0,
                duration: duration * 0.3,
                ease: easing
            });
            return timeline;
        }

        const segmentDuration = duration / (waypoints.length + 1);
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const centerPoint = { x: viewport.width / 2, y: viewport.height / 2 };

        waypoints.forEach((waypoint, index) => {
            const progress = (index + 1) / (waypoints.length + 1);
            const segmentEasing = this.getProgressiveEasing(easing, progress);
            
            // Calculate distance from center for special effects
            const distanceFromCenter = Math.sqrt(
                Math.pow(waypoint.x - centerPoint.x, 2) + 
                Math.pow(waypoint.y - centerPoint.y, 2)
            );
            const centerRadius = Math.min(viewport.width, viewport.height) * 0.2;
            const isInCenterRegion = distanceFromCenter <= centerRadius;

            // Base animation properties
            const animProps = {
                x: waypoint.x,
                y: waypoint.y,
                duration: segmentDuration * 0.8,
                ease: segmentEasing
            };

            // Add center traversal effects if applicable
            if (movementPath.centerTraversal && isInCenterRegion) {
                animProps.scale = 1.1;
                animProps.filter = 'brightness(1.2)';
                
                // Void karma enhances center effects
                if (karmaState.void > 5) {
                    animProps.scale = 1.15;
                    animProps.filter = 'brightness(1.3) blur(0.5px)';
                }
            }

            // Computational karma affects precision
            if (karmaState.computational < -3) {
                // Add slight randomness for negative computational karma
                animProps.x += (Math.random() - 0.5) * 10;
                animProps.y += (Math.random() - 0.5) * 10;
            }

            timeline.to(target, animProps);
        });

        // Final fade out with karma-influenced effects
        const fadeProps = {
            opacity: 0,
            duration: segmentDuration * 0.2,
            ease: 'power2.in'
        };

        // Reset any center effects
        if (movementPath.centerTraversal) {
            fadeProps.scale = 1;
            fadeProps.filter = 'brightness(1)';
        }

        // Void karma affects final dissolution
        if (karmaState.void > 10) {
            fadeProps.opacity = 0;
            fadeProps.scale = 0.8;
            fadeProps.filter = 'blur(2px)';
        }

        timeline.to(target, fadeProps);

        return timeline;
    }

    /**
     * Gets progressive easing based on animation progress.
     * @private
     */
    static getProgressiveEasing(baseEasing, progress) {
        if (baseEasing === 'none') return 'none';
        
        // Different easing for different phases
        if (progress < 0.3) {
            return 'power2.out'; // Entry phase
        } else if (progress > 0.7) {
            return 'power2.in';  // Exit phase
        } else {
            return baseEasing;   // Middle phase uses base easing
        }
    }

    /**
     * Fallback path animation using CSS transitions.
     * @private
     */
    static fallbackPathAnimation(target, movementPath, options) {
        const waypoints = movementPath.getWaypoints();
        if (waypoints.length === 0) {
            return this.fallbackAnimate(target, { opacity: 0, duration: 1 }, options);
        }

        // Simple animation to final waypoint
        const finalWaypoint = waypoints[waypoints.length - 1];
        const performanceTier = options.performanceTier || this.detectPerformanceTier();
        const duration = movementPath.duration * this.performanceTiers[performanceTier].durationMultiplier;

        return this.fallbackAnimate(target, {
            x: finalWaypoint.x,
            y: finalWaypoint.y,
            opacity: 0,
            duration: duration
        }, options);
    }

    /**
     * Applies performance tier adjustments to animation properties.
     * @private
     */
    static applyPerformanceTierAdjustments(properties, options) {
        const performanceTier = options.performanceTier || this.detectPerformanceTier();
        const tierSettings = this.performanceTiers[performanceTier];
        
        const adjusted = { ...properties };

        // Adjust animation duration based on performance tier
        if (adjusted.duration !== undefined) {
            adjusted.duration *= tierSettings.durationMultiplier;
        }

        // Reduce complexity for lower performance tiers
        if (tierSettings.complexityLevel === 'minimal') {
            // Simplify easing for low-end devices
            if (adjusted.ease && typeof adjusted.ease === 'string' && adjusted.ease.includes('elastic')) {
                adjusted.ease = 'power2.out';
            }
            // Remove complex filters for low-end devices
            if (adjusted.filter) {
                delete adjusted.filter;
            }
        } else if (tierSettings.complexityLevel === 'reduced') {
            // Moderate complexity reduction
            if (adjusted.scale && Math.abs(adjusted.scale - 1) > 0.2) {
                adjusted.scale = adjusted.scale > 1 ? 1.1 : 0.9; // Limit scale changes
            }
        }

        return adjusted;
    }

    /**
     * Applies karma-driven modifications to animation properties.
     * @private
     */
    static applyKarmaAdjustments(properties, options) {
        if (!options.karmaState) {
            return properties;
        }

        const adjusted = { ...properties };
        const karmaState = options.karmaState;

        // Emotional karma affects animation smoothness
        if (karmaState.emotional < -5) {
            // High negative emotional karma creates more erratic animations
            if (adjusted.ease === 'none' || !adjusted.ease) {
                adjusted.ease = 'rough({ template: none, strength: 2, points: 20, taper: "none", randomize: true })';
            }
        } else if (karmaState.emotional > 5) {
            // High positive emotional karma creates smoother animations
            if (!adjusted.ease || adjusted.ease === 'none') {
                adjusted.ease = 'power2.inOut';
            }
        }

        // Temporal karma affects animation timing
        if (karmaState.temporal < -3) {
            // Negative temporal karma speeds up animations (impatience)
            if (adjusted.duration) {
                adjusted.duration *= 0.7;
            }
        } else if (karmaState.temporal > 3) {
            // Positive temporal karma slows down animations (patience)
            if (adjusted.duration) {
                adjusted.duration *= 1.3;
            }
        }

        // Void karma affects opacity and dissolution effects
        if (karmaState.void > 10) {
            // High void karma enhances dissolution effects
            if (adjusted.opacity !== undefined && adjusted.opacity < 0.5) {
                adjusted.opacity *= 0.8; // Fade more dramatically
            }
        }

        return adjusted;
    }

    /**
     * Fallback animation using CSS transitions.
     * @private
     */
    static fallbackAnimate(target, properties, options) {
        const duration = (properties.duration || 1) * (this.performanceTiers[options.performanceTier || 'medium'].durationMultiplier);
        const delay = properties.delay || 0;

        // Apply CSS transition
        Object.assign(target.style, {
            transition: `all ${duration}s ease`,
            transitionDelay: `${delay}s`
        });

        // Apply properties after a brief delay to trigger transition
        setTimeout(() => {
            Object.keys(properties).forEach(key => {
                if (key !== 'duration' && key !== 'delay' && key !== 'ease' && key !== 'onComplete' && key !== 'onError') {
                    if (key === 'x') {
                        target.style.transform = `translateX(${properties[key]}px)`;
                    } else if (key === 'y') {
                        target.style.transform = `translateY(${properties[key]}px)`;
                    } else if (key === 'scale') {
                        target.style.transform = `scale(${properties[key]})`;
                    } else {
                        target.style[key] = properties[key];
                    }
                }
            });
        }, 10);

        // Handle completion callback
        if (properties.onComplete) {
            setTimeout(() => {
                properties.onComplete();
            }, (duration + delay) * 1000);
        }

        return { kill: () => {} }; // Return object with kill method for compatibility
    }

    /**
     * Creates a fallback timeline for sequential animations.
     * @private
     */
    static createFallbackTimeline(options) {
        const animations = [];
        let totalDuration = 0;

        return {
            to: (target, properties, position) => {
                const delay = typeof position === 'number' ? position : totalDuration;
                const duration = properties.duration || 1;
                
                animations.push({
                    target,
                    properties,
                    delay,
                    duration
                });

                totalDuration = Math.max(totalDuration, delay + duration);
                return this;
            },
            play: () => {
                animations.forEach(anim => {
                    setTimeout(() => {
                        this.fallbackAnimate(anim.target, anim.properties, options);
                    }, anim.delay * 1000);
                });
            },
            kill: () => {
                // Simple cleanup - in a real implementation, we'd track and cancel timeouts
            }
        };
    }

    /**
     * Detects the current performance tier based on device capabilities.
     * @private
     */
    static detectPerformanceTier() {
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

    /**
     * Gets karma state from consciousness for animation adjustments.
     * @private
     */
    static getKarmaState() {
        try {
            return consciousness.getState('karma') || {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            };
        } catch (error) {
            console.warn('Could not retrieve karma state for animation adjustments:', error);
            return {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            };
        }
    }
}