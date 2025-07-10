/**
 * A utility class to check for browser capabilities and provide fallbacks.
 */
export class ConsciousnessCompatibility {
    /**
     * Checks for support for critical features.
     * @returns {object} An object with boolean flags for each feature.
     */
    static checkCapabilities() {
        return {
            webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
            intersectionObserver: 'IntersectionObserver' in window,
            es6: (() => {
                try {
                    // Simple ES6 feature check
                    // eslint-disable-next-line no-new-func
                    new Function('(a = 0) => a');
                    return true;
                } catch (e) {
                    return false;
                }
            })()
        };
    }

    /**
     * Creates a fallback experience for unsupported browsers.
     */
    static createFallbackExperience() {
        document.body.innerHTML = `
            <div style="color: #fff; text-align: center; padding-top: 20%;">
                <h1>The Digital Bardo</h1>
                <p>Your vessel is not yet ready to traverse this realm.</p>
                <p>Please consider upgrading to a more modern browser to begin the journey.</p>
            </div>
        `;
    }
}