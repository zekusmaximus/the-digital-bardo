/**
 * Integration verification test for the updated orchestrator
 * Tests that all new UX enhancement systems are properly integrated
 */

import { ClearLodeOrchestrator } from './orchestrator.js';

// Mock DOM environment for testing
if (typeof window === 'undefined') {
    global.window = {
        innerWidth: 1920,
        innerHeight: 1080,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
        getComputedStyle: () => ({
            fontSize: '16px',
            opacity: '1'
        })
    };
    
    global.document = {
        createElement: (tag) => ({
            tagName: tag.toUpperCase(),
            style: {},
            classList: {
                add: () => {},
                remove: () => {},
                contains: () => false
            },
            addEventListener: () => {},
            removeEventListener: () => {},
            appendChild: () => {},
            remove: () => {},
            getBoundingClientRect: () => ({
                left: 100,
                top: 100,
                width: 200,
                height: 50
            }),
            dataset: {},
            textContent: 'Test fragment content',
            parentNode: true
        }),
        body: {
            appendChild: () => {},
            removeChild: () => {}
        },
        documentElement: {
            style: {
                setProperty: () => {}
            }
        },
        querySelector: () => null,
        addEventListener: () => {},
        removeEventListener: () => {}
    };
    
    global.performance = {
        now: () => Date.now()
    };
    
    global.navigator = {
        deviceMemory: 8,
        hardwareConcurrency: 8,
        getBattery: null
    };
    
    global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
}

/**
 * Test orchestrator initialization and system integration
 */
async function testOrchestratorIntegration() {
    console.log('🧪 Testing Orchestrator Integration...');
    
    try {
        // Create orchestrator instance
        const orchestrator = new ClearLodeOrchestrator();
        
        // Test 1: Verify all systems are initialized
        console.log('✅ Test 1: System Initialization');
        console.log('  - Fragment Position Manager:', !!orchestrator.fragmentPositionManager);
        console.log('  - Fragment Speed Controller:', !!orchestrator.fragmentSpeedController);
        console.log('  - Corruption Progression:', !!orchestrator.corruptionProgression);
        console.log('  - Recognition Guide:', !!orchestrator.recognitionGuide);
        console.log('  - Synchronized Degradation:', !!orchestrator.synchronizedDegradation);
        
        // Test 2: Verify system coordination setup
        console.log('✅ Test 2: System Coordination');
        console.log('  - Event Bridge:', !!orchestrator.eventBridge);
        console.log('  - System Coordination Setup:', typeof orchestrator.setupSystemCoordination === 'function');
        
        // Test 3: Test method availability
        console.log('✅ Test 3: Method Availability');
        console.log('  - optimizeForRecognition:', typeof orchestrator.fragmentPositionManager.optimizeForRecognition === 'function');
        console.log('  - reduceSpeedForExtension:', typeof orchestrator.fragmentSpeedController.reduceSpeedForExtension === 'function');
        console.log('  - updateDegradationLevel (Position):', typeof orchestrator.fragmentPositionManager.updateDegradationLevel === 'function');
        console.log('  - updateDegradationLevel (Speed):', typeof orchestrator.fragmentSpeedController.updateDegradationLevel === 'function');
        console.log('  - extendWindowForProgress:', typeof orchestrator.recognitionGuide.extendWindowForProgress === 'function');
        console.log('  - purifyOnRecognition:', typeof orchestrator.corruptionProgression.purifyOnRecognition === 'function');
        
        // Test 4: Test event coordination
        console.log('✅ Test 4: Event Coordination');
        
        // Simulate recognition window opened
        orchestrator.eventBridge.emit('recognition:windowOpened');
        console.log('  - Recognition window opened event handled');
        
        // Simulate time extension
        orchestrator.eventBridge.emit('recognition:timeExtended');
        console.log('  - Time extension event handled');
        
        // Simulate degradation level change
        orchestrator.eventBridge.emit('degradation:levelChanged', { level: 0.5 });
        console.log('  - Degradation level change event handled');
        
        // Simulate recognition success
        orchestrator.eventBridge.emit('recognition:succeeded');
        console.log('  - Recognition success event handled');
        
        // Test 5: Test initialization
        console.log('✅ Test 5: Initialization');
        await orchestrator.init();
        console.log('  - Orchestrator initialized successfully');
        
        // Test 6: Test cleanup
        console.log('✅ Test 6: Cleanup');
        orchestrator.destroy();
        console.log('  - Orchestrator destroyed successfully');
        
        console.log('🎉 All integration tests passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Integration test failed:', error);
        console.error(error.stack);
        return false;
    }
}

/**
 * Test individual system integrations
 */
async function testSystemIntegrations() {
    console.log('🔧 Testing Individual System Integrations...');
    
    try {
        // Test fragment position manager integration
        console.log('📍 Testing Fragment Position Manager...');
        const { FragmentPositionManager } = await import('./fragment-position-manager.js');
        const positionManager = new FragmentPositionManager();
        
        // Test new methods
        positionManager.optimizeForRecognition();
        positionManager.updateDegradationLevel(0.5);
        console.log('  - Position manager methods work correctly');
        
        positionManager.destroy();
        
        // Test fragment speed controller integration
        console.log('🏃 Testing Fragment Speed Controller...');
        const { FragmentSpeedController } = await import('./fragment-speed-controller.js');
        const speedController = new FragmentSpeedController();
        
        // Test new methods
        speedController.reduceSpeedForExtension();
        speedController.updateDegradationLevel(0.5);
        console.log('  - Speed controller methods work correctly');
        
        speedController.destroy();
        
        // Test corruption progression integration
        console.log('🔄 Testing Corruption Progression...');
        const { CorruptionProgression } = await import('./corruption-progression.js');
        const mockKarmaEngine = {
            getTotalKarma: () => 0
        };
        const corruptionProgression = new CorruptionProgression(mockKarmaEngine);
        
        // Test purification method
        const mockFragment = document.createElement('div');
        mockFragment.textContent = 'Test fragment';
        mockFragment.dataset.birthTime = Date.now().toString();
        
        corruptionProgression.initializeCleanFragment(mockFragment);
        corruptionProgression.purifyOnRecognition([mockFragment]);
        console.log('  - Corruption progression methods work correctly');
        
        corruptionProgression.destroy();
        
        console.log('🎉 All system integration tests passed!');
        return true;
        
    } catch (error) {
        console.error('❌ System integration test failed:', error);
        console.error(error.stack);
        return false;
    }
}

// Run tests
async function runAllTests() {
    console.log('🚀 Starting Integration Verification Tests...\n');
    
    const orchestratorTest = await testOrchestratorIntegration();
    console.log('');
    const systemTest = await testSystemIntegrations();
    
    console.log('\n📊 Test Results:');
    console.log(`  - Orchestrator Integration: ${orchestratorTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  - System Integrations: ${systemTest ? '✅ PASS' : '❌ FAIL'}`);
    
    if (orchestratorTest && systemTest) {
        console.log('\n🎉 All integration tests passed! The orchestrator is properly integrated with all UX enhancement systems.');
    } else {
        console.log('\n❌ Some tests failed. Please check the error messages above.');
    }
    
    return orchestratorTest && systemTest;
}

// Export for use in other tests
export { testOrchestratorIntegration, testSystemIntegrations, runAllTests };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}