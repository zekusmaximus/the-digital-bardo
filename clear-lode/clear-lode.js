// The Clear Lode - First encounter with digital dissolution
// Refactored entry point - imports and initializes the orchestrator
import { ClearLodeOrchestrator } from './orchestrator.js';
import { ConsciousnessCompatibility } from '../src/utils/consciousness-compatibility.js';

// Initialize and start the Clear Lode experience
document.addEventListener('DOMContentLoaded', async () => {
    const capabilities = ConsciousnessCompatibility.checkCapabilities();
    console.log('[Clear Lode] Browser capabilities:', capabilities);

    // For now, make ES6 optional since the detection might be overly strict
    if (!capabilities.webAudio || !capabilities.intersectionObserver) {
        console.error('[Clear Lode] Missing required capabilities:', {
            webAudio: capabilities.webAudio,
            intersectionObserver: capabilities.intersectionObserver,
            es6: capabilities.es6
        });
        ConsciousnessCompatibility.createFallbackExperience();
        return; // Halt execution
    }

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