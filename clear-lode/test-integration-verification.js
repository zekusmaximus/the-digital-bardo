/**
 * Integration verification test for Clear Lode Orchestrator
 * Tests that all UX enhancement systems are properly integrated
 */

import { ClearLodeOrchestrator } from './orchestrator.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

// Mock window.matchMedia for testing environment
if (!window.matchMedia) {
    window.matchMedia = function(query) {
        return {
            matches: false,
            media: query,
            onchange: null,
            addListener: function() {},
            removeListener: function() {},
            addEventListener: function() {},
            removeEventListener: function() {},
            dispatchEvent: function() {}
        };
    };
}

class IntegrationVerifier {
    constructor() {
        this.testResults = {};
        this.orchestrator = null;
    }

    async runAllTests() {
        console.log('🧪 Starting Clear Lode Orchestrator Integration Tests...');
        
        try {
            await this.testOrchestratorInitialization();
            await this.testSystemIntegration();
            await this.testEventCoordination();
            await this.testKarmaIntegration();
            await this.testResourceManagement();
            
            this.reportResults();
        } catch (error) {
            console.error('❌ Integration test suite failed:', error);
        }
    }

    async testOrchestratorInitialization() {
        console.log('📋 Testing orchestrator initialization...');
        
        try {
            this.orchestrator = new ClearLodeOrchestrator();
            await this.orchestrator.init();
            
            // Verify all systems are initialized
            const requiredSystems = [
                'fragmentPositionManager',
                'fragmentSpeedController', 
                'recognitionGuide',
                'synchronizedDegradation',
                'corruptionProgression',
                'audio',
                'recognition',
                'fragments',
                'eventBridge',
                'stateManager'
            ];
            
            const missingSystems = requiredSystems.filter(system => !this.orchestrator[system]);
            
            if (missingSystems.length === 0) {
                console.log('✅ All required systems initialized');
                this.testResults.initialization = true;
            } else {
                console.log('❌ Missing systems:', missingSystems);
                this.testResults.initialization = false;
            }
            
        } catch (error) {
            console.error('❌ Orchestrator initialization failed:', error);
            this.testResults.initialization = false;
        }
    }

    async testSystemIntegration() {
        console.log('🔗 Testing system integration...');
        
        try {
            // Test that positioning and speed systems are integrated with fragment generator
            const hasPositionManager = this.orchestrator.fragments.positionManager !== undefined;
            const hasSpeedController = this.orchestrator.fragments.speedController !== undefined;
            
            // Test that corruption progression is accessible
            const hasCorruptionProgression = this.orchestrator.corruptionProgression !== undefined;
            
            // Test that synchronized degradation has all dependencies
            const syncDeps = this.orchestrator.synchronizedDegradation;
            const hasSyncDependencies = syncDeps && 
                syncDeps.audioEngine && 
                syncDeps.corruptionProgression;
            
            if (hasPositionManager && hasSpeedController && hasCorruptionProgression && hasSyncDependencies) {
                console.log('✅ System integration verified');
                this.testResults.systemIntegration = true;
            } else {
                console.log('❌ System integration issues detected');
                console.log('  Position Manager:', hasPositionManager);
                console.log('  Speed Controller:', hasSpeedController);
                console.log('  Corruption Progression:', hasCorruptionProgression);
                console.log('  Sync Dependencies:', hasSyncDependencies);
                this.testResults.systemIntegration = false;
            }
            
        } catch (error) {
            console.error('❌ System integration test failed:', error);
            this.testResults.systemIntegration = false;
        }
    }

    async testEventCoordination() {
        console.log('📡 Testing event coordination...');
        
        try {
            let eventsReceived = 0;
            const expectedEvents = [
                'recognition:windowOpened',
                'recognition:timeExtended', 
                'karma:changed',
                'degradation:levelChanged',
                'recognition:succeeded'
            ];
            
            // Set up event listeners to verify coordination
            expectedEvents.forEach(eventName => {
                this.orchestrator.eventBridge.on(eventName, () => {
                    eventsReceived++;
                    console.log(`📨 Event received: ${eventName}`);
                });
            });
            
            // Trigger events to test coordination
            this.orchestrator.eventBridge.emit('recognition:windowOpened');
            this.orchestrator.eventBridge.emit('recognition:timeExtended');
            this.orchestrator.eventBridge.emit('karma:changed', { type: 'computational', delta: 5 });
            this.orchestrator.eventBridge.emit('degradation:levelChanged', { level: 0.3 });
            this.orchestrator.eventBridge.emit('recognition:succeeded');
            
            // Allow time for event processing
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (eventsReceived === expectedEvents.length) {
                console.log('✅ Event coordination working correctly');
                this.testResults.eventCoordination = true;
            } else {
                console.log(`❌ Event coordination issues: ${eventsReceived}/${expectedEvents.length} events received`);
                this.testResults.eventCoordination = false;
            }
            
        } catch (error) {
            console.error('❌ Event coordination test failed:', error);
            this.testResults.eventCoordination = false;
        }
    }

    async testKarmaIntegration() {
        console.log('🔮 Testing karma engine integration...');
        
        try {
            // Test karma engine is accessible
            const hasKarmaEngine = this.orchestrator.karmicEngine !== undefined;
            
            // Test consciousness state integration
            consciousness.setState('clearLode.recognitionAttempts', 0);
            const initialAttempts = consciousness.getState('clearLode.recognitionAttempts');
            
            // Simulate recognition event to test karma integration
            this.orchestrator.eventBridge.emit('recognition:details', {
                method: 'center-click-perfect',
                karmaData: { distance: 5, bonus: 5, elapsedTime: 2000 }
            });
            
            // Allow time for processing
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Check if consciousness state was updated
            const recognitionState = consciousness.getState('recognitions.clear_light');
            
            if (hasKarmaEngine && typeof initialAttempts === 'number' && recognitionState !== undefined) {
                console.log('✅ Karma engine integration verified');
                this.testResults.karmaIntegration = true;
            } else {
                console.log('❌ Karma integration issues detected');
                console.log('  Has Karma Engine:', hasKarmaEngine);
                console.log('  Initial Attempts:', initialAttempts);
                console.log('  Recognition State:', recognitionState);
                this.testResults.karmaIntegration = false;
            }
            
        } catch (error) {
            console.error('❌ Karma integration test failed:', error);
            this.testResults.karmaIntegration = false;
        }
    }

    async testResourceManagement() {
        console.log('🧹 Testing resource management...');
        
        try {
            // Check that guardian is properly set up
            const hasGuardian = this.orchestrator.guardian !== undefined;
            const hasCleanupTasks = this.orchestrator.guardian && 
                this.orchestrator.guardian.cleanupTasks && 
                this.orchestrator.guardian.cleanupTasks.length > 0;
            
            // Test destroy method
            const initialCleanupCount = this.orchestrator.guardian.cleanupTasks.length;
            this.orchestrator.destroy();
            
            // Verify destruction
            const isDestroyed = this.orchestrator.isDestroyed;
            
            if (hasGuardian && hasCleanupTasks && isDestroyed) {
                console.log('✅ Resource management verified');
                console.log(`  Initial cleanup tasks: ${initialCleanupCount}`);
                this.testResults.resourceManagement = true;
            } else {
                console.log('❌ Resource management issues detected');
                console.log('  Has Guardian:', hasGuardian);
                console.log('  Has Cleanup Tasks:', hasCleanupTasks);
                console.log('  Is Destroyed:', isDestroyed);
                this.testResults.resourceManagement = false;
            }
            
        } catch (error) {
            console.error('❌ Resource management test failed:', error);
            this.testResults.resourceManagement = false;
        }
    }

    reportResults() {
        console.log('\n📊 Integration Test Results:');
        console.log('================================');
        
        const tests = [
            { name: 'Orchestrator Initialization', key: 'initialization' },
            { name: 'System Integration', key: 'systemIntegration' },
            { name: 'Event Coordination', key: 'eventCoordination' },
            { name: 'Karma Integration', key: 'karmaIntegration' },
            { name: 'Resource Management', key: 'resourceManagement' }
        ];
        
        let passedTests = 0;
        
        tests.forEach(test => {
            const passed = this.testResults[test.key];
            const status = passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${status} ${test.name}`);
            if (passed) passedTests++;
        });
        
        console.log('================================');
        console.log(`Overall: ${passedTests}/${tests.length} tests passed`);
        
        if (passedTests === tests.length) {
            console.log('🎉 All integration tests passed! Task 8 is complete.');
        } else {
            console.log('⚠️  Some integration tests failed. Review the issues above.');
        }
        
        return passedTests === tests.length;
    }
}

// Export for use in other test files
export { IntegrationVerifier };

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
    const verifier = new IntegrationVerifier();
    verifier.runAllTests().then(success => {
        if (success) {
            console.log('✅ Integration verification complete - all systems properly integrated');
        } else {
            console.log('❌ Integration verification failed - some issues need to be addressed');
        }
    });
}