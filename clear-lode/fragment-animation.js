import { gsap } from 'gsap';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

/**
 * Handles fragment animation logic including waypoint-based movement
 */
export class FragmentAnimation {
    /**
     * Animates fragment movement with support for waypoints and complex paths
     */
    static animateFragmentMovement(fragment, drift, animationDuration, onComplete) {
        // Initial appearance animation
        AnimationGuardian.safeAnimate(fragment, {
            opacity: 0.8,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            delay: 0
        });

        if (drift.waypoints && drift.waypoints.length > 0) {
            // Complex path animation with waypoints
            this.animateComplexPath(fragment, drift, animationDuration, onComplete);
        } else {
            // Simple linear animation (traditional behavior)
            this.animateSimplePath(fragment, drift, animationDuration, onComplete);
        }
    }

    /**
     * Animates fragment along complex path with waypoints
     */
    static animateComplexPath(fragment, drift, animationDuration, onComplete) {
        const timeline = gsap.timeline();
        const totalDuration = animationDuration;
        const waypoints = drift.waypoints;
        const segmentDuration = totalDuration / (waypoints.length + 1);

        // Animate through each waypoint
        waypoints.forEach((waypoint, index) => {
            const progress = (index + 1) / (waypoints.length + 1);
            const easing = this.getWaypointEasing(drift.curveType, progress);
            
            timeline.to(fragment, {
                x: waypoint.x,
                y: waypoint.y,
                duration: segmentDuration * 0.7,
                ease: easing
            });
        });

        // Final destination with fade out
        timeline.to(fragment, {
            x: drift.x,
            y: drift.y,
            opacity: 0,
            duration: segmentDuration * 0.3,
            ease: 'power2.in',
            onComplete: () => {
                if (fragment.parentNode) {
                    consciousness.recordEvent('memory_dissolved', {
                        content: fragment.textContent,
                        timeVisible: Date.now() - fragment.dataset.birthTime,
                        naturalDissolution: false,
                        reason: 'animation_complete',
                        pathType: 'complex'
                    });
                    onComplete(fragment);
                }
            }
        });
    }

    /**
     * Animates fragment along simple linear path
     */
    static animateSimplePath(fragment, drift, animationDuration, onComplete) {
        // Traditional two-stage animation
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
                if (fragment.parentNode) {
                    consciousness.recordEvent('memory_dissolved', {
                        content: fragment.textContent,
                        timeVisible: Date.now() - fragment.dataset.birthTime,
                        naturalDissolution: false,
                        reason: 'animation_complete',
                        pathType: 'simple'
                    });
                    onComplete(fragment);
                }
            }
        });
    }

    /**
     * Gets appropriate easing function for waypoint animations
     */
    static getWaypointEasing(curveType, progress) {
        switch (curveType) {
            case 'bezier':
                return 'power2.inOut';
            case 'orbital':
                return 'sine.inOut';
            case 'radial':
                return 'power1.out';
            default:
                return 'none';
        }
    }
}