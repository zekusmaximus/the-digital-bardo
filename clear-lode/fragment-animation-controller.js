import { gsap } from 'gsap';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';
import { AnimationGuardianPathExtension } from '../src/utils/animation-guardian-path-extension.js';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { MovementPath } from './movement-path.js';
import { PathInterpolation } from './path-interpolation.js';

/**
 * Handles all fragment animation logic including waypoint-based movement
 */
export class FragmentAnimationController {
    constructor() {
        this.activeAnimations = new Map();
    }

    /**
     * Animates fragment movement with support for waypoints and complex paths
     */
    animateFragmentMovement(fragment, drift, animationDuration, onComplete) {
        // Check if drift is a MovementPath instance
        if (drift instanceof MovementPath) {
            this.animateMovementPath(fragment, drift, onComplete);
        } else if (drift.waypoints && drift.waypoints.length > 0) {
            // Complex path animation with waypoints (legacy format)
            this.animateComplexPath(fragment, drift, animationDuration, onComplete);
        } else {
            // Simple linear animation (traditional behavior)
            this.animateSimplePath(fragment, drift, animationDuration, onComplete);
        }
    }

    /**
     * Animates fragment along a MovementPath with center-traversal support
     */
    animateMovementPath(fragment, movementPath, onComplete) {
        const startTime = performance.now();
        
        // Validate the path
        const validation = movementPath.validate();
        if (!validation.valid) {
            console.warn('[FragmentAnimationController] Invalid movement path:', validation.errors);
            // Fallback to simple animation
            this.animateSimplePath(fragment, { x: 100, y: 100 }, movementPath.duration, onComplete);
            return;
        }

        // Record path usage
        movementPath.recordUsage(fragment);

        // Get karma state for animation adjustments
        const karmaState = AnimationGuardian.getKarmaState();
        
        // Determine if we should use enhanced path animation
        const useEnhancedAnimation = movementPath.centerTraversal || 
                                    (movementPath.waypoints.length > 2) || 
                                    movementPath.curveType !== null;
        
        let timeline;
        
        if (useEnhancedAnimation) {
            // Use enhanced path animation for complex paths with center traversal
            timeline = AnimationGuardianPathExtension.createEnhancedPathAnimation(fragment, movementPath, {
                karmaState: karmaState,
                recordKarmaEvents: true,
                onComplete: () => this.handleAnimationComplete(fragment, movementPath, onComplete, startTime)
            });
        } else {
            // Use standard path animation for simpler paths
            timeline = AnimationGuardian.safePathAnimation(fragment, movementPath, {
                karmaState: karmaState,
                recordKarmaEvents: true,
                onComplete: () => this.handleAnimationComplete(fragment, movementPath, onComplete, startTime)
            });
        }

        // Store timeline for cleanup
        this.activeAnimations.set(fragment, timeline);
    }



    /**
     * Animates fragment along complex path with waypoints
     */
    animateComplexPath(fragment, drift, animationDuration, onComplete) {
        const startTime = performance.now();
        
        // Convert legacy drift format to MovementPath for enhanced animation
        const movementPath = new MovementPath({
            waypoints: [...drift.waypoints],
            duration: animationDuration,
            easing: this.getWaypointEasing(drift.curveType, 0.5),
            centerTraversal: this.isCenterTraversal(drift.waypoints),
            pathType: 'complex-legacy',
            curveType: drift.curveType || 'linear'
        });
        
        // Add final destination as last waypoint if not already included
        if (drift.x !== undefined && drift.y !== undefined) {
            movementPath.addWaypoint(drift.x, drift.y);
        }
        
        // Get karma state for animation adjustments
        const karmaState = AnimationGuardian.getKarmaState();
        
        // Use enhanced path animation for complex paths
        const timeline = AnimationGuardianPathExtension.createEnhancedPathAnimation(fragment, movementPath, {
            karmaState: karmaState,
            recordKarmaEvents: true,
            onComplete: () => {
                if (fragment.parentNode) {
                    consciousness.recordEvent('memory_dissolved', {
                        content: fragment.textContent,
                        timeVisible: Date.now() - fragment.dataset.birthTime,
                        naturalDissolution: false,
                        reason: 'animation_complete',
                        pathType: 'complex-legacy',
                        centerTraversal: movementPath.centerTraversal,
                        waypointCount: movementPath.waypoints.length,
                        animationDuration: performance.now() - startTime
                    });
                    if (onComplete) onComplete(fragment);
                }
            }
        });

        // Store timeline for cleanup
        this.activeAnimations.set(fragment, timeline);
    }
    
    /**
     * Determines if a path traverses through the center of the screen
     */
    isCenterTraversal(waypoints) {
        if (!waypoints || waypoints.length === 0) return false;
        
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        const centerRadius = Math.min(viewport.width, viewport.height) * 0.25;
        
        // Check if any waypoint is near the center
        return waypoints.some(waypoint => {
            const distanceFromCenter = Math.sqrt(
                Math.pow(waypoint.x - centerX, 2) + 
                Math.pow(waypoint.y - centerY, 2)
            );
            return distanceFromCenter <= centerRadius;
        });
    }

    /**
     * Animates fragment along simple linear path
     */
    animateSimplePath(fragment, drift, animationDuration, onComplete) {
        // Get karma state for animation adjustments
        const karmaState = AnimationGuardian.getKarmaState();
        
        // Traditional two-stage animation with karma integration
        const anim1 = AnimationGuardian.safeAnimate(fragment, {
            x: drift.x * 0.2,
            y: drift.y * 0.2,
            duration: animationDuration * 0.7,
            ease: 'none',
            delay: 1
        }, {
            karmaState: karmaState,
            pathType: 'simple',
            recordKarmaEvents: true
        });

        const anim2 = AnimationGuardian.safeAnimate(fragment, {
            x: drift.x * 0.5,
            y: drift.y * 0.5,
            opacity: 0,
            duration: animationDuration * 0.3,
            ease: 'power2.in',
            delay: 1 + (animationDuration * 0.7) - 0.5,
            onComplete: () => {
                if (fragment.parentNode) {
                    consciousness.recordEvent('memory_dissolved', {
                        content: fragment.textContent,
                        timeVisible: Date.now() - fragment.dataset.birthTime,
                        naturalDissolution: false,
                        reason: 'animation_complete',
                        pathType: 'simple'
                    });
                    if (onComplete) onComplete(fragment);
                }
            }
        }, {
            karmaState: karmaState,
            pathType: 'simple',
            recordKarmaEvents: true
        });

        // Store animations for cleanup
        this.activeAnimations.set(fragment, [anim1, anim2]);
    }

    /**
     * Animates fragment appearance
     */
    animateFragmentAppearance(fragment, delay = 0) {
        // Get karma state for animation adjustments
        const karmaState = AnimationGuardian.getKarmaState();
        
        return AnimationGuardian.safeAnimate(fragment, {
            opacity: 0.8,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            delay: delay
        }, {
            karmaState: karmaState,
            pathType: 'appearance',
            recordKarmaEvents: true
        });
    }

    /**
     * Gets appropriate easing function for waypoint animations
     */
    getWaypointEasing(curveType, progress) {
        switch (curveType) {
            case 'bezier':
                return 'power2.inOut';
            case 'orbital':
                return 'sine.inOut';
            case 'radial':
                return 'power1.out';
            case 'catmull-rom':
                return 'power1.inOut';
            default:
                return 'none';
        }
    }



    /**
     * Handles animation completion with performance tracking
     */
    handleAnimationComplete(fragment, movementPath, onComplete, startTime) {
        if (fragment.parentNode) {
            const animationDuration = performance.now() - startTime;
            
            consciousness.recordEvent('memory_dissolved', {
                content: fragment.textContent,
                timeVisible: Date.now() - (fragment.dataset.birthTime || Date.now()),
                naturalDissolution: false,
                reason: 'animation_complete',
                pathType: movementPath.pathType,
                centerTraversal: movementPath.centerTraversal,
                waypointCount: movementPath.waypoints.length,
                animationDuration: animationDuration,
                pathId: movementPath.id
            });
            
            if (onComplete) {
                onComplete(fragment);
            }
        }
    }

    /**
     * Stops all animations for a fragment
     */
    stopFragmentAnimations(fragment) {
        const animations = this.activeAnimations.get(fragment);
        if (animations) {
            if (Array.isArray(animations)) {
                animations.forEach(anim => {
                    if (anim && anim.kill) anim.kill();
                });
            } else if (animations.kill) {
                animations.kill();
            }
            this.activeAnimations.delete(fragment);
        }
    }

    /**
     * Cleanup all animations
     */
    destroy() {
        for (const [fragment, animations] of this.activeAnimations) {
            this.stopFragmentAnimations(fragment);
        }
        this.activeAnimations.clear();
    }
}