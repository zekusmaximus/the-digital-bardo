import { gsap } from 'gsap';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';
import { AnimationGuardianPathExtension } from '../src/utils/animation-guardian-path-extension.js';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { MovementPath } from './movement-path.js';
import { PathInterpolation } from './path-interpolation.js';
import { ResponsiveZoneManager } from './responsive-zone-manager.js';

/**
 * Handles all fragment animation logic including waypoint-based movement
 */
export class FragmentAnimationController {
    constructor() {
        this.activeAnimations = new Map();
        
        // Initialize responsive manager for mobile optimizations
        this.responsiveManager = new ResponsiveZoneManager();
        
        // Mobile-specific animation settings
        this.mobileSettings = {
            // Track if we're on a mobile device
            isMobileDevice: this.responsiveManager.isMobileDevice,
            // Battery-conscious animation settings
            batteryAware: true,
            // Animation duration multipliers
            durationMultiplier: this.responsiveManager.isMobileDevice ? 0.8 : 1.0,
            // Waypoint limits for mobile
            maxWaypoints: this.responsiveManager.isMobileDevice ? 4 : 12,
            // Center effects settings
            enableCenterEffects: !this.responsiveManager.isMobileDevice || 
                                !this.responsiveManager.reducedMotionEnabled
        };
        
        // Apply initial mobile optimizations if needed
        if (this.mobileSettings.isMobileDevice) {
            this.applyMobileAnimationOptimizations();
        }
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

        // Update mobile settings if needed
        if (this.mobileSettings.isMobileDevice) {
            this.updateMobileSettings();
        }
        
        // Apply mobile optimizations to the path if on mobile device
        const optimizedPath = this.mobileSettings.isMobileDevice ? 
            this.optimizePathForMobile(movementPath) : movementPath;

        // Record path usage
        optimizedPath.recordUsage(fragment);

        // Get karma state for animation adjustments
        const karmaState = AnimationGuardian.getKarmaState();
        
        // Determine if we should use enhanced path animation
        const useEnhancedAnimation = optimizedPath.centerTraversal || 
                                    (optimizedPath.waypoints.length > 2) || 
                                    optimizedPath.curveType !== null;
        
        // Add mobile-specific animation options
        const animationOptions = {
            karmaState: karmaState,
            recordKarmaEvents: true,
            onComplete: () => this.handleAnimationComplete(fragment, optimizedPath, onComplete, startTime)
        };
        
        // Add mobile-specific performance settings
        if (this.mobileSettings.isMobileDevice) {
            animationOptions.performanceTier = this.mobileSettings.batteryStatus?.level <= 0.2 && !this.mobileSettings.batteryStatus?.charging ? 
                'low' : (this.mobileSettings.reducedMotion ? 'low' : 'medium');
                
            // Add mobile-specific settings
            animationOptions.mobileOptimized = true;
            animationOptions.centerEffects = this.mobileSettings.enableCenterEffects;
        }
        
        let timeline;
        
        if (useEnhancedAnimation) {
            // Use enhanced path animation for complex paths with center traversal
            timeline = AnimationGuardianPathExtension.createEnhancedPathAnimation(fragment, optimizedPath, animationOptions);
        } else {
            // Use standard path animation for simpler paths
            timeline = AnimationGuardian.safePathAnimation(fragment, optimizedPath, animationOptions);
        }

        // Store timeline for cleanup
        this.activeAnimations.set(fragment, timeline);
    }



    /**
     * Animates fragment along complex path with waypoints
     */
    animateComplexPath(fragment, drift, animationDuration, onComplete) {
        const startTime = performance.now();
        
        // Update mobile settings if needed
        if (this.mobileSettings.isMobileDevice) {
            this.updateMobileSettings();
        }
        
        // Apply mobile duration adjustment if needed
        const adjustedDuration = this.mobileSettings.isMobileDevice ? 
            animationDuration * this.mobileSettings.durationMultiplier : animationDuration;
        
        // Convert legacy drift format to MovementPath for enhanced animation
        const movementPath = new MovementPath({
            waypoints: [...drift.waypoints],
            duration: adjustedDuration,
            easing: this.getWaypointEasing(drift.curveType, 0.5),
            centerTraversal: this.isCenterTraversal(drift.waypoints),
            pathType: 'complex-legacy',
            curveType: drift.curveType || 'linear'
        });
        
        // Add final destination as last waypoint if not already included
        if (drift.x !== undefined && drift.y !== undefined) {
            movementPath.addWaypoint(drift.x, drift.y);
        }
        
        // Apply mobile optimizations to the path if on mobile device
        const optimizedPath = this.mobileSettings.isMobileDevice ? 
            this.optimizePathForMobile(movementPath) : movementPath;
        
        // Get karma state for animation adjustments
        const karmaState = AnimationGuardian.getKarmaState();
        
        // Add mobile-specific animation options
        const animationOptions = {
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
                        centerTraversal: optimizedPath.centerTraversal,
                        waypointCount: optimizedPath.waypoints.length,
                        animationDuration: performance.now() - startTime,
                        mobileOptimized: this.mobileSettings.isMobileDevice
                    });
                    if (onComplete) onComplete(fragment);
                }
            }
        };
        
        // Add mobile-specific performance settings
        if (this.mobileSettings.isMobileDevice) {
            animationOptions.performanceTier = this.mobileSettings.batteryStatus?.level <= 0.2 && !this.mobileSettings.batteryStatus?.charging ? 
                'low' : (this.mobileSettings.reducedMotion ? 'low' : 'medium');
                
            // Add mobile-specific settings
            animationOptions.mobileOptimized = true;
            animationOptions.centerEffects = this.mobileSettings.enableCenterEffects;
        }
        
        // Use enhanced path animation for complex paths
        const timeline = AnimationGuardianPathExtension.createEnhancedPathAnimation(fragment, optimizedPath, animationOptions);

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
        // Update mobile settings if needed
        if (this.mobileSettings.isMobileDevice) {
            this.updateMobileSettings();
        }
        
        // Apply mobile duration adjustment if needed
        const adjustedDuration = this.mobileSettings.isMobileDevice ? 
            animationDuration * this.mobileSettings.durationMultiplier : animationDuration;
        
        // Get karma state for animation adjustments
        const karmaState = AnimationGuardian.getKarmaState();
        
        // Create animation options with mobile-specific settings
        const animOptions = {
            karmaState: karmaState,
            pathType: 'simple',
            recordKarmaEvents: true
        };
        
        // Add mobile-specific performance settings
        if (this.mobileSettings.isMobileDevice) {
            animOptions.performanceTier = this.mobileSettings.batteryStatus?.level <= 0.2 && !this.mobileSettings.batteryStatus?.charging ? 
                'low' : (this.mobileSettings.reducedMotion ? 'low' : 'medium');
            animOptions.mobileOptimized = true;
        }
        
        // For very low battery or reduced motion, use simplified single-stage animation
        if (this.mobileSettings.isMobileDevice && 
            (this.mobileSettings.reducedMotion || 
             (this.mobileSettings.batteryStatus?.level <= 0.2 && !this.mobileSettings.batteryStatus?.charging))) {
            
            // Simplified single-stage animation for battery saving
            const anim = AnimationGuardian.safeAnimate(fragment, {
                x: drift.x * 0.4,
                y: drift.y * 0.4,
                opacity: 0,
                duration: adjustedDuration,
                ease: 'power1.in',
                delay: 0.5,
                onComplete: () => {
                    if (fragment.parentNode) {
                        consciousness.recordEvent('memory_dissolved', {
                            content: fragment.textContent,
                            timeVisible: Date.now() - fragment.dataset.birthTime,
                            naturalDissolution: false,
                            reason: 'animation_complete',
                            pathType: 'simple',
                            mobileOptimized: true,
                            batteryOptimized: true
                        });
                        if (onComplete) onComplete(fragment);
                    }
                }
            }, animOptions);
            
            // Store animation for cleanup
            this.activeAnimations.set(fragment, anim);
            
        } else {
            // Traditional two-stage animation with karma integration
            const anim1 = AnimationGuardian.safeAnimate(fragment, {
                x: drift.x * 0.2,
                y: drift.y * 0.2,
                duration: adjustedDuration * 0.7,
                ease: 'none',
                delay: this.mobileSettings.isMobileDevice ? 0.5 : 1 // Shorter delay on mobile
            }, animOptions);
    
            const anim2 = AnimationGuardian.safeAnimate(fragment, {
                x: drift.x * 0.5,
                y: drift.y * 0.5,
                opacity: 0,
                duration: adjustedDuration * 0.3,
                ease: 'power2.in',
                delay: (this.mobileSettings.isMobileDevice ? 0.5 : 1) + (adjustedDuration * 0.7) - 0.5,
                onComplete: () => {
                    if (fragment.parentNode) {
                        consciousness.recordEvent('memory_dissolved', {
                            content: fragment.textContent,
                            timeVisible: Date.now() - fragment.dataset.birthTime,
                            naturalDissolution: false,
                            reason: 'animation_complete',
                            pathType: 'simple',
                            mobileOptimized: this.mobileSettings.isMobileDevice
                        });
                        if (onComplete) onComplete(fragment);
                    }
                }
            }, animOptions);
    
            // Store animations for cleanup
            this.activeAnimations.set(fragment, [anim1, anim2]);
        }
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
     * Applies mobile-specific animation optimizations
     */
    applyMobileAnimationOptimizations() {
        console.log('[FragmentAnimationController] Applying mobile animation optimizations');
        
        // Get mobile status from responsive manager
        const mobileStatus = this.responsiveManager.getMobileStatus();
        
        // Update mobile settings based on device status
        this.mobileSettings.batteryStatus = mobileStatus.batteryStatus;
        this.mobileSettings.reducedMotion = mobileStatus.reducedMotionEnabled;
        
        // Apply battery-conscious optimizations
        if (this.mobileSettings.batteryAware && mobileStatus.batteryStatus) {
            const batteryLevel = mobileStatus.batteryStatus.level;
            const isCharging = mobileStatus.batteryStatus.charging;
            
            // Adjust animation settings based on battery level
            if (batteryLevel <= 0.2 && !isCharging) {
                // Critical battery level - aggressive optimizations
                this.mobileSettings.durationMultiplier = 0.6;
                this.mobileSettings.maxWaypoints = 2;
                this.mobileSettings.enableCenterEffects = false;
            } else if (batteryLevel <= 0.5 && !isCharging) {
                // Low battery level - moderate optimizations
                this.mobileSettings.durationMultiplier = 0.7;
                this.mobileSettings.maxWaypoints = 3;
                this.mobileSettings.enableCenterEffects = false;
            } else {
                // Normal battery level - standard mobile optimizations
                this.mobileSettings.durationMultiplier = 0.8;
                this.mobileSettings.maxWaypoints = 4;
                this.mobileSettings.enableCenterEffects = !mobileStatus.reducedMotionEnabled;
            }
        }
        
        // Apply reduced motion optimizations
        if (mobileStatus.reducedMotionEnabled) {
            this.mobileSettings.durationMultiplier = 0.5;
            this.mobileSettings.maxWaypoints = 2;
            this.mobileSettings.enableCenterEffects = false;
        }
        
        // Record mobile optimization event
        consciousness.recordEvent('mobile_animation_optimizations_applied', {
            durationMultiplier: this.mobileSettings.durationMultiplier,
            maxWaypoints: this.mobileSettings.maxWaypoints,
            enableCenterEffects: this.mobileSettings.enableCenterEffects,
            batteryLevel: mobileStatus.batteryStatus?.level,
            isCharging: mobileStatus.batteryStatus?.charging,
            reducedMotion: mobileStatus.reducedMotionEnabled
        });
    }
    
    /**
     * Optimizes a movement path for mobile devices
     * @param {MovementPath} movementPath The path to optimize
     * @returns {MovementPath} Optimized path for mobile
     */
    optimizePathForMobile(movementPath) {
        // If not a mobile device or path is already simple, return original
        if (!this.mobileSettings.isMobileDevice || 
            movementPath.waypoints.length <= 2) {
            return movementPath;
        }
        
        // Create a copy of the path to optimize
        const optimizedPath = new MovementPath({
            id: movementPath.id,
            pathType: movementPath.pathType,
            duration: movementPath.duration * this.mobileSettings.durationMultiplier,
            easing: movementPath.easing,
            centerTraversal: movementPath.centerTraversal && this.mobileSettings.enableCenterEffects,
            curveType: this.mobileSettings.enableCenterEffects ? movementPath.curveType : 'linear'
        });
        
        // Limit number of waypoints for mobile
        const maxWaypoints = this.mobileSettings.maxWaypoints;
        
        if (movementPath.waypoints.length > maxWaypoints) {
            // Keep first and last waypoints
            const first = movementPath.waypoints[0];
            const last = movementPath.waypoints[movementPath.waypoints.length - 1];
            
            // For paths with center traversal, try to keep at least one center waypoint
            if (movementPath.centerTraversal && this.mobileSettings.enableCenterEffects) {
                // Find a waypoint near the center
                const viewport = { width: window.innerWidth, height: window.innerHeight };
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                
                // Find the waypoint closest to center
                let centerWaypoint = null;
                let minDistance = Infinity;
                
                for (let i = 1; i < movementPath.waypoints.length - 1; i++) {
                    const waypoint = movementPath.waypoints[i];
                    const distance = Math.sqrt(
                        Math.pow(waypoint.x - centerX, 2) + 
                        Math.pow(waypoint.y - centerY, 2)
                    );
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        centerWaypoint = waypoint;
                    }
                }
                
                // Add first waypoint
                optimizedPath.addWaypoint(first.x, first.y);
                
                // Add center waypoint if found
                if (centerWaypoint) {
                    optimizedPath.addWaypoint(centerWaypoint.x, centerWaypoint.y);
                }
                
                // If we need more waypoints, add evenly spaced ones
                const remainingSlots = maxWaypoints - 2 - (centerWaypoint ? 1 : 0);
                if (remainingSlots > 0 && movementPath.waypoints.length > 3) {
                    const step = Math.floor(movementPath.waypoints.length / (remainingSlots + 1));
                    for (let i = 1; i <= remainingSlots; i++) {
                        const index = Math.min(i * step, movementPath.waypoints.length - 2);
                        const waypoint = movementPath.waypoints[index];
                        optimizedPath.addWaypoint(waypoint.x, waypoint.y);
                    }
                }
                
                // Add last waypoint
                optimizedPath.addWaypoint(last.x, last.y);
            } else {
                // Simple path optimization - just keep evenly spaced waypoints
                optimizedPath.addWaypoint(first.x, first.y);
                
                const step = Math.floor(movementPath.waypoints.length / (maxWaypoints - 1));
                for (let i = 1; i < maxWaypoints - 1; i++) {
                    const index = Math.min(i * step, movementPath.waypoints.length - 2);
                    const waypoint = movementPath.waypoints[index];
                    optimizedPath.addWaypoint(waypoint.x, waypoint.y);
                }
                
                optimizedPath.addWaypoint(last.x, last.y);
            }
        } else {
            // Path is already within waypoint limit, just copy all waypoints
            for (const waypoint of movementPath.waypoints) {
                optimizedPath.addWaypoint(waypoint.x, waypoint.y);
            }
        }
        
        return optimizedPath;
    }
    
    /**
     * Updates mobile settings based on current device state
     */
    updateMobileSettings() {
        // Only update if we're on a mobile device
        if (!this.mobileSettings.isMobileDevice) return;
        
        // Get latest mobile status
        const mobileStatus = this.responsiveManager.getMobileStatus();
        
        // Check if battery status has changed significantly
        const oldBatteryLevel = this.mobileSettings.batteryStatus?.level || 1.0;
        const newBatteryLevel = mobileStatus.batteryStatus?.level || 1.0;
        const batteryChanged = Math.abs(oldBatteryLevel - newBatteryLevel) > 0.1 ||
                              this.mobileSettings.batteryStatus?.charging !== mobileStatus.batteryStatus?.charging;
        
        // Check if reduced motion setting has changed
        const motionChanged = this.mobileSettings.reducedMotion !== mobileStatus.reducedMotionEnabled;
        
        // Update settings if needed
        if (batteryChanged || motionChanged) {
            this.applyMobileAnimationOptimizations();
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
        
        // Clean up responsive manager
        if (this.responsiveManager) {
            this.responsiveManager.destroy();
        }
    }
}