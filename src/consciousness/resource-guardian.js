/**
 * @file resource-guardian.js
 * @description A centralized utility for tracking and cleaning up resources to prevent memory leaks.
 * This guardian ensures that event listeners, GSAP animations, observers, and other resources
 * are properly disposed of when they are no longer needed.
 */

export class ResourceGuardian {
    constructor() {
        this.resources = new Set();
        this.isDestroyed = false;
    }

    /**
     * Registers a resource and its corresponding cleanup function.
     * @param {object} resource - The resource to track (e.g., a GSAP timeline, an event listener).
     * @param {function} cleanupFn - The function to call to clean up the resource.
     */
    register(resource, cleanupFn) {
        if (this.isDestroyed) {
            console.warn('[ResourceGuardian] Cannot register a new resource, guardian has been destroyed.');
            // Immediately clean up the resource if the guardian is already destroyed.
            try {
                cleanupFn(resource);
            } catch (error) {
                console.error('[ResourceGuardian] Error cleaning up resource during post-destroy registration:', error);
            }
            return;
        }
        this.resources.add({ resource, cleanupFn });
    }

    /**
     * Registers an event listener and ensures it's cleaned up.
     * @param {EventTarget} element - The DOM element.
     * @param {string} event - The event name.
     * @param {function} handler - The event handler.
     */
    registerEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.register({ element, event, handler }, res => {
            res.element.removeEventListener(res.event, res.handler);
        });
    }

    /**
     * Registers a timer (setTimeout or setInterval).
     * @param {number} timerId - The ID of the timer.
     * @param {boolean} isInterval - True if it's a setInterval timer.
     */
    registerTimer(timerId, isInterval = false) {
        const cleanupFn = isInterval ? clearInterval : clearTimeout;
        this.register(timerId, cleanupFn);
    }

    /**
     * Registers an observer (e.g., IntersectionObserver).
     * @param {object} observerInstance - The observer instance.
     */
    registerObserver(observerInstance) {
        this.register(observerInstance, observer => observer.disconnect());
    }

    /**
     * Registers an AudioContext.
     * @param {AudioContext} audioContext - The AudioContext instance.
     */
    registerAudioContext(audioContext) {
        this.register(audioContext, ctx => {
            if (ctx.state !== 'closed') {
                ctx.close();
            }
        });
    }

    /**
     * Executes all registered cleanup functions and clears the resource list.
     * This method is idempotent and can be called multiple times without error.
     */
    cleanupAll() {
        if (this.isDestroyed) {
            return;
        }
        console.log(`[ResourceGuardian] Cleaning up ${this.resources.size} registered resources...`);
        this.resources.forEach(({ resource, cleanupFn }) => {
            try {
                cleanupFn(resource);
            } catch (error) {
                console.error('[ResourceGuardian] Error during resource cleanup:', { resource, error });
            }
        });
        this.resources.clear();
        this.isDestroyed = true;
        console.log('[ResourceGuardian] All resources have been released.');
    }
}