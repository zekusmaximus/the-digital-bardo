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
                    // Simple ES6 feature checks that don't require eval
                    // Check if arrow functions are supported by testing syntax
                    const testArrow = () => true;
                    // Check if const/let are supported
                    const testConst = 1;
                    let testLet = 2;
                    // Check if template literals work
                    const testTemplate = `test ${testConst + testLet}`;

                    return testArrow() && testConst === 1 && testLet === 2 && testTemplate === 'test 3';
                } catch (e) {
                    console.warn('[Compatibility] ES6 check failed:', e);
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