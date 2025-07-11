/**
 * Consciousness Compatibility Module
 * Provides fine-grained capability detection and safe integration with the global
 * `consciousness` state object.
 *
 * NOTE: Legacy static methods `checkCapabilities` and `createFallbackExperience`
 * are retained for backward-compatibility but now delegate to the richer API.
 */

import { consciousness } from '../consciousness/digital-soul.js';

class ConsciousnessCompatibility {
  /* ---------------------------------------------------------------------------
   * Capability Detection
   * ------------------------------------------------------------------------ */

  /**
   * Detects and returns a rich capabilities object that is safe for storage in
   * the global state tree.  The structure is intentionally stable so that
   * downstream modules can depend on the same shape across versions.
   *
   * @returns {object} capabilities
   */
  static getDetailedCapabilities() {
    const webAudioSupported =
      typeof window !== 'undefined' &&
      (window.AudioContext || window.webkitAudioContext);

    const capabilities = {
      webAudio: {
        supported: !!webAudioSupported,
        contextType: webAudioSupported
          ? (window.AudioContext ? 'AudioContext' : 'webkitAudioContext')
          : null
      },
      intersectionObserver: {
        supported:
          typeof window !== 'undefined' && 'IntersectionObserver' in window
      },
      touch: {
        supported:
          typeof window !== 'undefined' &&
          ('ontouchstart' in window || navigator.maxTouchPoints > 0),
        points: typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0
      },
      performance: (() => {
        if (typeof window === 'undefined') {
          return { supported: false, tier: 'unknown', hardwareConcurrency: null, memory: null };
        }
        const { hardwareConcurrency, deviceMemory } = navigator;
        let tier = 'unknown';
        if (hardwareConcurrency >= 8 && deviceMemory >= 8) tier = 'high';
        else if (hardwareConcurrency >= 4 && deviceMemory >= 4) tier = 'medium';
        else if (hardwareConcurrency >= 2) tier = 'low';

        return {
          supported: !!window.performance,
          tier,
          hardwareConcurrency: hardwareConcurrency ?? null,
          memory: deviceMemory ?? null
        };
      })(),
      accessibility: {
        reducedMotion:
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast:
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-contrast: more)').matches
      }
    };

    return capabilities;
  }

  /**
   * Generalised feature detection wrapper with conservative fallback logic and
   * consciousness-level logging.
   *
   * @param {string} featureName
   * @param {function[]} detectionMethods – ordered list of predicate functions
   * @returns {boolean}
   */
  static detectCapabilityWithFallback(featureName, detectionMethods) {
    try {
      const result = detectionMethods.some((fn) => {
        try {
          return !!fn();
        } catch (err) {
          return false;
        }
      });
      this.safeSetState(`compatibility.detectedCapabilities.${featureName}`, result);
      return result;
    } catch (error) {
      console.error(`[Compatibility] Detection failed for ${featureName}`, error);
      const fallback = this.getConservativeFallback(featureName);
      this.safeSetState(`compatibility.detectedCapabilities.${featureName}`, fallback);
      return fallback;
    }
  }

  /**
   * Conservative (fail-safe) fallback value for a feature.
   * @param {string} featureName
   * @returns {boolean}
   */
  static getConservativeFallback(featureName) {
    // Default fallback is false – refine as needed per feature
    const conservative = {
      webAudio: false,
      intersectionObserver: false,
      touch: false
    };
    return conservative[featureName] ?? false;
  }

  /**
   * Example specialised detector for the WebAudio API.
   * @returns {boolean}
   */
  static detectWebAudioCapability() {
    return this.detectCapabilityWithFallback('webAudio', [
      () => typeof window !== 'undefined' && 'AudioContext' in window,
      () => typeof window !== 'undefined' && 'webkitAudioContext' in window
    ]);
  }

  /* ---------------------------------------------------------------------------
   * Adaptive Experience Layer
   * ------------------------------------------------------------------------ */

  /**
   * Chooses the appropriate experience level builder based on the supplied
   * capabilities object.
   * @param {object} capabilities
   */
  static createAdaptiveExperience(capabilities) {
    if (
      capabilities.accessibility.reducedMotion ||
      capabilities.accessibility.highContrast
    ) {
      return this.createAccessibleExperience(capabilities);
    }
    if (
      capabilities.webAudio.supported &&
      capabilities.intersectionObserver.supported &&
      capabilities.performance.tier === 'high'
    ) {
      return this.createFullExperience(capabilities);
    }
    if (capabilities.performance.tier === 'medium') {
      return this.createEnhancedExperience(capabilities);
    }
    if (capabilities.performance.tier === 'low') {
      return this.createBasicExperience(capabilities);
    }
    return this.createMinimalExperience(capabilities);
  }

  /* Experience builders – stubs for now */
  static createFullExperience() {
    console.log('[Compatibility] Full experience selected');
  }
  static createEnhancedExperience() {
    console.log('[Compatibility] Enhanced experience selected');
  }
  static createBasicExperience() {
    console.log('[Compatibility] Basic experience selected');
  }
  static createMinimalExperience() {
    console.log('[Compatibility] Minimal experience selected – rendering fallback screen');
    if (typeof document !== 'undefined') {
      document.body.innerHTML = `
        <div style="color:#fff;text-align:center;padding-top:20%">
          <h1>The Digital Bardo</h1>
          <p>Your vessel is not yet ready to traverse this realm.</p>
          <p>Please consider upgrading to a more modern browser to begin the journey.</p>
        </div>`;
    }
  }
  static createAccessibleExperience() {
    console.log('[Compatibility] Accessible experience selected');
  }

  /* ---------------------------------------------------------------------------
   * Safe State Integration
   * ------------------------------------------------------------------------ */

  /**
   * Wrapper around consciousness.setState with error boundary & logging.
   * @param {string} path
   * @param {*} value
   * @param {string} [context='compatibility']
   */
  static safeSetState(path, value, context = 'compatibility') {
    try {
      consciousness.setState(path, value);
    } catch (err) {
      console.error(`[Compatibility] State update failed in ${context}:`, err);
      this.attemptStateRecovery(path, value, err);
    }
  }

  /**
   * Attempts rudimentary state recovery after a failed setState.
   */
  static attemptStateRecovery(path, value, originalError) {
    try {
      console.warn('[Compatibility] Attempting state recovery for', path);
      // Fallback strategy: shallow merge at root if path fails.
      const rootKey = path.split('.')[0];
      const rootObj = consciousness.getState(rootKey) || {};
      consciousness.setState(rootKey, { ...rootObj, _recovered: true });
    } catch (err) {
      console.error('[Compatibility] State recovery failed', { originalError, err });
    }
  }

  /* ---------------------------------------------------------------------------
   * Legacy API Shims
   * ------------------------------------------------------------------------ */

  /**
   * DEPRECATED – retained for modules that still expect a boolean map.
   */
  static checkCapabilities() {
    const det = this.getDetailedCapabilities();
    return {
      webAudio: det.webAudio.supported,
      intersectionObserver: det.intersectionObserver.supported,
      es6: true // modern environments assumed – ES6 check removed
    };
  }

  /**
   * DEPRECATED – delegates to minimal experience builder.
   */
  static createFallbackExperience() {
    this.createMinimalExperience(this.getDetailedCapabilities());
  }
}

/* ---------------------------------------------------------------------------
 * Initialisation – integrate with consciousness on module load
 * ------------------------------------------------------------------------ */
(function initialIntegration() {
  const capabilities = ConsciousnessCompatibility.getDetailedCapabilities();
  ConsciousnessCompatibility.safeSetState('compatibility', {
    detectedCapabilities: capabilities,
    experienceLevel: 'unknown',
    activeAdaptations: [],
    userPreferences: {
      reducedMotion: capabilities.accessibility.reducedMotion,
      highContrast: capabilities.accessibility.highContrast,
      audioEnabled: true
    },
    performanceTier: capabilities.performance.tier,
    errorRecoveryCount: 0
  });
})();

export { ConsciousnessCompatibility };