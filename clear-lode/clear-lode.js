// The Clear Lode - First encounter with digital dissolution
// Refactored entry point - imports and initializes the orchestrator
import { ClearLodeOrchestrator } from './orchestrator.js';
import { ConsciousnessCompatibility } from '../src/utils/consciousness-compatibility.js';

// Initialize and start the Clear Lode experience
document.addEventListener('DOMContentLoaded', async () => {
    const capabilities = ConsciousnessCompatibility.checkCapabilities();
    if (!capabilities.webAudio || !capabilities.intersectionObserver || !capabilities.es6) {
        ConsciousnessCompatibility.createFallbackExperience();
        return; // Halt execution
    }

    const orchestrator = new ClearLodeOrchestrator();
    await orchestrator.init();

    // Start immediately with a click-to-begin prompt instead of long black screen
    orchestrator.showBeginPrompt();

    // Store instance globally for debugging
    window.clearLodeOrchestrator = orchestrator;
});