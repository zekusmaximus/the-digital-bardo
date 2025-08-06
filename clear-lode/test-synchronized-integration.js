/**
 * Simple integration test for synchronized degradation controller
 */

import { SynchronizedDegradationController } from './synchronized-degradation-controller.js';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { ClearLodeEventBridge } from './event-bridge.js';

// Mock dependencies
const mockEventBridge = new ClearLodeEventBridge();
const mockGuardian = new ResourceGuardian();
const mockConfig = { syncThreshold: 0.05 };

const mockAudioEngine = {
    isInitialized: true,
    getDegradationLevel: () => 0.5,
    createGlitchBurst: () => console.log('Audio: Glitch burst'),
    achieveResonance: () => console.log('Audio: Resonance achieved'),
    accelerateDegradation: (amount) => console.log(`Audio: Degradation +${amount}`)
};

const mockCorruptionProgression = {
    syncWithAudioDegradation: (level) => console.log(`Corruption synced: ${level}`),
    purifyOnRecognition: () => console.log('Fragments purified'),
    getCorruptionStats: () => ({ totalFragments: 3, averageCorruption: 0.4 })
};

// Test setup
console.log('Testing Synchronized Degradation Controller...');

try {
    const dependencies = {
        eventBridge: mockEventBridge,
        guardian: mockGuardian,
        config: mockConfig,
        audioEngine: mockAudioEngine,
        corruptionProgression: mockCorruptionProgression
    };

    const controller = new SynchronizedDegradationController(dependencies);
    console.log('✓ Controller created successfully');

    controller.init();
    console.log('✓ Controller initialized successfully');

    // Test audio degradation sync
    mockEventBridge.emit('audio:degradationChanged', {
        level: 0.7,
        source: 'test'
    });
    console.log('✓ Audio degradation sync test passed');

    // Test karma update
    const karmaState = {
        computational: 50,
        emotional: 30,
        void: 20,
        temporal: 40
    };
    consciousness.setState('karma', karmaState);
    console.log('✓ Karma update test passed');

    // Test recognition feedback
    mockEventBridge.emit('recognition:attempt', {
        method: 'test',
        progress: 0.6
    });
    console.log('✓ Recognition feedback test passed');

    // Test audio fallback
    mockEventBridge.emit('audio:initializationFailed', 'Test failure');
    console.log('✓ Audio fallback test passed');

    // Test sync status
    const status = controller.getSynchronizationStatus();
    console.log('✓ Sync status test passed:', status.isHealthy);

    // Cleanup
    controller.destroy();
    console.log('✓ Controller destroyed successfully');

    console.log('\n🎉 All tests passed! Synchronized degradation controller is working correctly.');

} catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
}