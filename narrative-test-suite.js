import { ClearLodeOrchestrator } from './clear-lode/orchestrator.js';
import { consciousness } from './src/consciousness/digital-soul.js';
import { recognitionFSM } from './src/consciousness/recognition-fsm.js';

console.log("--- NARRATIVE TEST SUITE ---");

// Mocking necessary DOM elements
document.body.innerHTML = `
    <div id="pre-light"></div>
    <div id="clear-light" class="hidden">
        <div class="light-core"></div>
        <div class="recognition-zone"></div>
        <div class="recognition-hint"></div>
    </div>
    <div id="choice-prompt" class="hidden">
        <div class="glitching-text"></div>
    </div>
`;

// Helper to wait for a specific event
const waitForEvent = (eventName, timeout = 2000) => {
    return new Promise((resolve, reject) => {
        const handler = (e) => {
            window.removeEventListener(eventName, handler);
            resolve(e);
        };
        window.addEventListener(eventName, handler);
        setTimeout(() => {
            window.removeEventListener(eventName, handler);
            reject(new Error(`Timeout waiting for event: ${eventName}`));
        }, timeout);
    });
};

// --- Test Execution ---
(async () => {
    const orchestrator = new ClearLodeOrchestrator();
    await orchestrator.init();

    // Test 1: Keyword Recognition
    console.log("\n--- Testing Keyword Recognition ---");
    try {
        // Manually trigger the recognition window
        recognitionFSM.transition('onLightManifested');
        await new Promise(res => setTimeout(res, 100)); // allow listeners to attach

        if (consciousness.getState('clearLode.recognitionActive')) {
            console.log("Recognition window is active.");
            
            // Simulate typing 'HOME'
            'HOME'.split('').forEach(char => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
            });

            const recognitionDetails = await waitForEvent('recognition:details');
            if (recognitionDetails.detail.method === 'typed-home') {
                console.log("✅ PASSED: Keyword 'HOME' triggered recognition.");
            } else {
                console.error("❌ FAILED: Keyword did not trigger correct recognition method.");
            }
        } else {
             console.error("❌ FAILED: Recognition window did not become active for keyword test.");
        }
    } catch (error) {
        console.error("❌ FAILED: Keyword recognition test threw an error.", error);
    }
    
    // Reset state for next test
    recognitionFSM.transition('onReset');
    orchestrator.recognition.stopListening();


    // Test 2: Spacebar Hold Recognition
    console.log("\n--- Testing Spacebar Hold Recognition ---");
    try {
        recognitionFSM.transition('onLightManifested');
        await new Promise(res => setTimeout(res, 100));

        if (consciousness.getState('clearLode.recognitionActive')) {
            console.log("Recognition window is active.");

            // Simulate holding spacebar for the "sweet spot" duration
            document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
            await new Promise(res => setTimeout(res, 3000));
            document.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
            
            const recognitionDetails = await waitForEvent('recognition:details');
            if (recognitionDetails.detail.method === 'perfect-hold') {
                console.log("✅ PASSED: Spacebar hold triggered 'perfect-hold' recognition.");
            } else {
                console.error("❌ FAILED: Spacebar hold did not trigger correct recognition method.");
            }
        } else {
            console.error("❌ FAILED: Recognition window did not become active for spacebar test.");
        }
    } catch (error) {
        console.error("❌ FAILED: Spacebar hold test threw an error.", error);
    }
      
    // Reset state
    recognitionFSM.transition('onReset');
    orchestrator.recognition.stopListening();


    // Test 3: Karma-Audio Link
    console.log("\n--- Testing Karma-Audio Link ---");
    try {
        const audio = orchestrator.audio;
        // Mock the updateAudioFromKarma function to check if it's called
        let karmaUpdateDetected = false;
        audio.updateAudioFromKarma = (karmaState) => {
            console.log("Mock updateAudioFromKarma called with:", karmaState);
            if (karmaState.void > 0) {
                karmaUpdateDetected = true;
            }
        };

        // Manually trigger a karma change
        consciousness.setState('karma', { void: 10, computational: 5, emotional: 0 });

        if (karmaUpdateDetected) {
            console.log("✅ PASSED: Karma state change triggered audio update.");
        } else {
            console.error("❌ FAILED: Audio engine did not respond to karma state change.");
        }
    } catch (error) {
        console.error("❌ FAILED: Karma-audio link test threw an error.", error);
    }

    orchestrator.destroy();
    console.log("\n--- Test Suite Complete ---");
})();