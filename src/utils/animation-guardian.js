import { gsap } from 'gsap';

/**
 * A utility class to provide a safe wrapper around GSAP animations.
 * It handles errors gracefully and provides fallbacks if GSAP is unavailable.
 */
export class AnimationGuardian {
    /**
     * A safe wrapper for GSAP's `gsap.to()` method.
     * @param {object} target The target element to animate.
     * @param {object} properties The GSAP properties for the animation.
     */
    static safeAnimate(target, properties) {
        try {
            if (typeof gsap === 'undefined' || !gsap) {
                console.warn('GSAP is not available. Using CSS transition fallback.');
                // Simple CSS transition fallback
                Object.assign(target.style, {
                    transition: `all ${properties.duration || 1}s ease`,
                    ...properties,
                });
                return;
            }

            // Enhanced properties with error handling
            const animationProps = {
                ...properties,
                onError: (e) => {
                    console.error('GSAP animation error:', e);
                    // Optionally, add more robust error reporting here
                    if (properties.onError) {
                        properties.onError(e);
                    }
                },
            };

            gsap.to(target, animationProps);

        } catch (error) {
            console.error('Error in safeAnimate:', error);
        }
    }
}