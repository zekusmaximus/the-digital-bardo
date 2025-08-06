import { AnimationGuardian } from './animation-guardian.js';
import { PathInterpolation } from '../../clear-lode/path-interpolation.js';
import { consciousness } from '../consciousness/digital-soul.js';

/**
 * Extension to AnimationGuardian that adds enhanced support for complex path animations
 * with center traversal and integration with the karma system.
 */
export class AnimationGuardianPathExtension {
    /**
     * Creates an enhanced animation timeline for MovementPath objects with advanced center traversal support.
     * @param {object} target The target element to animate.
     * @param {MovementPath} movementPath The MovementPath instance defining the animation path.
     * @param {object} options Additional options for karma and performance integration.
     */
    static createEnhancedPathAnimation(target, movementPath, options = {}) {
        try {
            // Get karma state for adjustments
            const karmaState = options.karmaState || AnimationGuardian.getKarmaState();
            
            // Apply performance tier adjustments to the path duration
            const performanceTier = options.performanceTier || AnimationGuardian.detectPerformanceTier();
            const tierSettings = AnimationGuardian.performanceTiers[performanceTier];
            const adjustedDuration = movementPath.duration * tierSettings.durationMultiplier;

            // Create timeline with enhanced options
            const timelineOptions = {
                ...options,
                pathType: movementPath.pathType,
                performanceTier: performanceTier,
                waypointCount: movementPath.waypoints.length,
                recordKarmaEvents: options.recordKarmaEvents !== false
            };

            const timeline = AnimationGuardian.safeTimeline(timelineOptions);
            const waypoints = movementPath.getWaypoints();

            // Handle different complexity levels based on performance tier
            if (tierSettings.complexityLevel === 'minimal') {
                // Simplified animation for low-end devices
                return this.createSimplifiedPathAnimation(timeline, target, waypoints, adjustedDuration, movementPath.easing, options);
            } else if (tierSettings.complexityLevel === 'reduced') {
                // Moderate complexity animation
                return this.createReducedPathAnimation(timeline, target, waypoints, adjustedDuration, movementPath.easing, movementPath, options);
            } else {
                // Full complexity animation with center traversal support
                return this.createFullPathAnimation(timeline, target, waypoints, adjustedDuration, movementPath.easing, movementPath, karmaState, options);
            }

        } catch (error) {
            console.error('Error in createEnhancedPathAnimation:', error);
            if (options.recordKarmaEvents) {
                consciousness.recordEvent('enhanced_path_animation_error', {
                    error: error.message,
                    pathType: movementPath.pathType,
                    target: target.className || 'unknown'
                });
            }
            return AnimationGuardian.fallbackPathAnimation(target, movementPath, options);
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

        // For center traversal paths, add special handling
        const isCenterTraversal = movementPath.centerTraversal;
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const centerPoint = { x: viewport.width / 2, y: viewport.height / 2 };
        const centerRadius = Math.min(viewport.width, viewport.height) * 0.2;

        keyWaypoints.forEach((waypoint, index) => {
            const progress = (index + 1) / (keyWaypoints.length + 1);
            const segmentEasing = this.getProgressiveEasing(easing, progress);
            
            // Calculate distance from center for special effects
            const distanceFromCenter = Math.sqrt(
                Math.pow(waypoint.x - centerPoint.x, 2) + 
                Math.pow(waypoint.y - centerPoint.y, 2)
            );
            const isInCenterRegion = distanceFromCenter <= centerRadius;
            
            // Base animation properties
            const animProps = {
                x: waypoint.x,
                y: waypoint.y,
                duration: segmentDuration * 0.8,
                ease: segmentEasing
            };

            // Add center traversal effects if applicable
            if (isCenterTraversal && isInCenterRegion) {
                animProps.scale = 1.05;
                animProps.filter = 'brightness(1.1)';
            }
            
            timeline.to(target, animProps);
        });

        // Final fade out
        const fadeProps = {
            opacity: 0,
            duration: segmentDuration * 0.2,
            ease: 'power2.in'
        };

        // Reset any center effects
        if (isCenterTraversal) {
            fadeProps.scale = 1;
            fadeProps.filter = 'brightness(1)';
        }

        timeline.to(target, fadeProps);

        return timeline;
    }

    /**
     * Creates a full complexity path animation with all features including center traversal.
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
        const centerRadius = Math.min(viewport.width, viewport.height) * 0.2;

        // For curved paths, use path interpolation for smoother animation
        const useInterpolation = movementPath.curveType && 
                               ['bezier', 'catmull-rom'].includes(movementPath.curveType) && 
                               waypoints.length >= 3;
        
        let interpolationMethod = 'linear';
        if (movementPath.curveType === 'bezier') {
            interpolationMethod = waypoints.length >= 4 ? 'cubicBezier' : 'quadraticBezier';
        } else if (movementPath.curveType === 'catmull-rom') {
            interpolationMethod = 'catmullRom';
        }

        // For complex paths with many waypoints, use adaptive sampling
        let animationWaypoints = waypoints;
        if (useInterpolation && waypoints.length > 5) {
            const startTime = performance.now();
            const samples = PathInterpolation.adaptiveSample(waypoints, interpolationMethod, 1.0, 8);
            animationWaypoints = samples.map(sample => sample.point);
            
            // Record interpolation usage
            const computationTime = performance.now() - startTime;
            PathInterpolation.recordUsage(interpolationMethod, waypoints.length, computationTime);
        }

        // Create animation through waypoints
        animationWaypoints.forEach((waypoint, index) => {
            const progress = (index + 1) / (animationWaypoints.length + 1);
            const segmentEasing = this.getProgressiveEasing(easing, progress);
            
            // Calculate distance from center for special effects
            const distanceFromCenter = Math.sqrt(
                Math.pow(waypoint.x - centerPoint.x, 2) + 
                Math.pow(waypoint.y - centerPoint.y, 2)
            );
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
                
                // Emotional karma affects visual intensity
                if (karmaState.emotional > 7) {
                    animProps.filter = 'brightness(1.3) contrast(1.1)';
                }
            }

            // Computational karma affects precision
            if (karmaState.computational < -3) {
                // Add slight randomness for negative computational karma
                animProps.x += (Math.random() - 0.5) * 10;
                animProps.y += (Math.random() - 0.5) * 10;
            } else if (karmaState.computational > 5) {
                // Enhanced precision for positive computational karma
                delete animProps.filter; // Remove any blur effects
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
     * Applies karma-driven effects to path animations based on path characteristics.
     * @param {MovementPath} movementPath The path being animated
     * @param {object} karmaState Current karma state
     * @returns {object} Karma-specific animation modifiers
     */
    static getKarmaPathEffects(movementPath, karmaState) {
        const effects = {
            durationMultiplier: 1,
            scaleMultiplier: 1,
            filterEffects: null,
            easingOverride: null
        };
        
        // Skip if no karma state available
        if (!karmaState) return effects;
        
        // Center traversal paths are more affected by void karma
        if (movementPath.centerTraversal && karmaState.void !== 0) {
            // Void karma affects visual intensity of center traversal
            if (karmaState.void > 8) {
                effects.scaleMultiplier = 1.2;
                effects.filterEffects = 'brightness(1.3) contrast(1.1) blur(0.7px)';
            } else if (karmaState.void > 4) {
                effects.scaleMultiplier = 1.1;
                effects.filterEffects = 'brightness(1.2)';
            } else if (karmaState.void < -5) {
                effects.scaleMultiplier = 0.9;
                effects.filterEffects = 'brightness(0.9)';
            }
        }
        
        // Temporal karma affects animation timing
        if (karmaState.temporal < -3) {
            // Negative temporal karma speeds up animations (impatience)
            effects.durationMultiplier = 0.7;
        } else if (karmaState.temporal > 3) {
            // Positive temporal karma slows down animations (patience)
            effects.durationMultiplier = 1.3;
        }
        
        // Emotional karma affects easing
        if (karmaState.emotional < -5) {
            // High negative emotional karma creates more erratic animations
            effects.easingOverride = 'rough({ template: none, strength: 2, points: 20, taper: "none", randomize: true })';
        } else if (karmaState.emotional > 5) {
            // High positive emotional karma creates smoother animations
            effects.easingOverride = 'power2.inOut';
        }
        
        return effects;
    }

    /**
     * Applies path-specific optimizations based on path characteristics and performance tier.
     * @param {MovementPath} movementPath The path being animated
     * @param {string} performanceTier Current performance tier
     * @returns {object} Path-specific optimizations
     */
    static getPathOptimizations(movementPath, performanceTier) {
        const optimizations = {
            waypointReduction: false,
            simplifyInterpolation: false,
            skipCenterEffects: false
        };
        
        // Apply optimizations based on performance tier
        if (performanceTier === 'low') {
            optimizations.waypointReduction = true;
            optimizations.simplifyInterpolation = true;
            optimizations.skipCenterEffects = true;
        } else if (performanceTier === 'medium') {
            // For medium tier, only reduce waypoints for very complex paths
            if (movementPath.waypoints.length > 8) {
                optimizations.waypointReduction = true;
            }
            
            // Skip complex interpolation for medium tier
            if (movementPath.curveType === 'catmull-rom' || movementPath.curveType === 'bSpline') {
                optimizations.simplifyInterpolation = true;
            }
        }
        
        return optimizations;
    }
}