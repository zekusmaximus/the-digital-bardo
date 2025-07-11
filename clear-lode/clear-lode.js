// The Clear Lode - First encounter with digital dissolution
// Refactored entry point - imports and initializes the orchestrator
import { ClearLodeOrchestrator } from './orchestrator.js';
import { ConsciousnessCompatibility } from '../src/utils/consciousness-compatibility.js';

// Initialize and start the Clear Lode experience
document.addEventListener('DOMContentLoaded', async () => {
    const capabilities = ConsciousnessCompatibility.checkCapabilities();
    console.log('[Clear Lode] Browser capabilities:', capabilities);

    // Capability gating disabled: proceed regardless of initial API detection.
    // Some browsers expose Web Audio or IntersectionObserver only after a
    // user gesture or polyfill load, leading to false negatives at load time.
    // Any real runtime issues will be caught by orchestrator.init() error‐handling.

    if (!capabilities.es6) {
        console.warn('[Clear Lode] ES6 support detection failed, but continuing anyway...');
    }

    const orchestrator = new ClearLodeOrchestrator();
    await orchestrator.init();

    // Start immediately with a click-to-begin prompt instead of long black screen
    orchestrator.showBeginPrompt();

    // Store instance globally for debugging
    window.clearLodeOrchestrator = orchestrator;
});