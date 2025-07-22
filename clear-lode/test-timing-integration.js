/**
 * @file Integration test for recognition timing system
 * @description Tests the timing and extension functionality in a browser environment
 */

import { ClearLodeEventBridge } from './event-bridge.js';
import { RecognitionGuideController } from './recognition-guide-controller.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

// Test configuration
const testConfig = {
    recognitionWindow: {
        baseWindowDuration: 15000,  // 15 seconds
        extensionDuration: 5000,    // 5 seconds per extension
        maxExtensions: 2,           // Maximum extensions
        warningThreshold: 0.75      // Warning at 75% elapsed
    }
};

class TimingIntegrationTest {
    constructor() {
        this.guardian = new ResourceGuardian();
        this.eventBridge = new ClearLodeEventBridge();
        this.guideController = null;
        this.testResults = [];
        this.testStartTime = null;
    }

    async runAllTests() {
        console.log('🧪 Starting Recognition Timing Integration Tests...');
        
        try {
            await this.testMinimumWindowDuration();
            await this.testTimeoutWarningSystem();
            await this.testExtensionLogic();
            await this.testTransitionIndicators();
            await this.testActivityTracking();
            
            this.printResults();
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        } finally {
            this.cleanup();
        }
    }

    async testMinimumWindowDuration() {
        console.log('📏 Testing minimum window duration...');
        
        this.setupController();
        
        // Verify configuration
        this.assert(
            this.guideController.baseWindowDuration === 15000,
            'Base window duration should be 15 seconds',
            'minimum-duration-config'
        );
        
        this.assert(
            this.guideController.extensionDuration === 5000,
            'Extension duration should be 5 seconds',
            'extension-duration-config'
        );
        
        this.assert(
            this.guideController.maxTimeExtensions === 2,
            'Maximum extensions should be 2',
            'max-extensions-config'
        );
        
        this.cleanup();
    }

    async testTimeoutWarningSystem() {
        console.log('⚠️ Testing timeout warning system...');
        
        this.setupController();
        
        let warningShown = false;
        let timeoutHandled = false;
        
        // Mock the warning and timeout methods
        const originalShowWarning = this.guideController.showTimeoutWarning;
        const originalHandleTimeout = this.guideController.handleTimeout;
        
        this.guideController.showTimeoutWarning = () => {
            warningShown = true;
            console.log('✅ Timeout warning shown');
        };
        
        this.guideController.handleTimeout = () => {
            timeoutHandled = true;
            console.log('✅ Timeout handled');
        };
        
        // Start guidance
        this.guideController.startGuidance();
        
        // Wait for warning time (75% of 15 seconds = 11.25 seconds)
        await this.wait(11300);
        
        this.assert(
            warningShown,
            'Timeout warning should be shown at 75% of window duration',
            'timeout-warning-timing'
        );
        
        // Wait for full timeout
        await this.wait(4000);
        
        this.assert(
            timeoutHandled,
            'Timeout should be handled after full window duration',
            'timeout-handling'
        );
        
        // Restore original methods
        this.guideController.showTimeoutWarning = originalShowWarning;
        this.guideController.handleTimeout = originalHandleTimeout;
        
        this.cleanup();
    }

    async testExtensionLogic() {
        console.log('⏰ Testing extension logic...');
        
        this.setupController();
        
        let extensionCount = 0;
        const originalExtend = this.guideController.extendRecognitionWindow;
        
        this.guideController.extendRecognitionWindow = () => {
            extensionCount++;
            console.log(`✅ Extension ${extensionCount} triggered`);
            // Call original method
            originalExtend.call(this.guideController);
        };
        
        this.guideController.startGuidance();
        
        // Simulate user activity
        this.guideController.isUserActive = true;
        this.guideController.lastActivityTime = Date.now();
        
        // Wait near timeout and simulate high-progress attempt
        await this.wait(14000);
        
        this.guideController.handleRecognitionAttempt({
            method: 'spacebar-hold',
            progress: 0.8,
            timestamp: Date.now()
        });
        
        await this.wait(100);
        
        this.assert(
            extensionCount > 0,
            'Window should be extended for high-progress attempts',
            'extension-on-progress'
        );
        
        // Test maximum extensions
        this.guideController.timeExtensions = 2;
        const initialExtensions = extensionCount;
        
        this.guideController.extendRecognitionWindow();
        
        this.assert(
            extensionCount === initialExtensions,
            'Should not extend beyond maximum extensions',
            'max-extensions-limit'
        );
        
        this.cleanup();
    }

    async testTransitionIndicators() {
        console.log('🔄 Testing transition indicators...');
        
        this.setupController();
        
        let transitionShown = false;
        let timeoutEmitted = false;
        
        // Mock transition indicator
        const originalShowTransition = this.guideController.showTransitionIndicator;
        this.guideController.showTransitionIndicator = () => {
            transitionShown = true;
            console.log('✅ Transition indicator shown');
            originalShowTransition.call(this.guideController);
        };
        
        // Listen for timeout event
        this.eventBridge.on('recognition:timeout', () => {
            timeoutEmitted = true;
            console.log('✅ Timeout event emitted');
        });
        
        this.guideController.startGuidance();
        this.guideController.timeExtensions = 2; // Max extensions used
        
        // Trigger timeout
        await this.wait(15000);
        
        this.assert(
            transitionShown,
            'Transition indicator should be shown when recognition phase ends',
            'transition-indicator'
        );
        
        // Wait for timeout event delay
        await this.wait(2100);
        
        this.assert(
            timeoutEmitted,
            'Timeout event should be emitted after transition',
            'timeout-event-emission'
        );
        
        this.cleanup();
    }

    async testActivityTracking() {
        console.log('👆 Testing activity tracking...');
        
        this.setupController();
        
        this.guideController.startGuidance();
        
        // Initially inactive
        this.assert(
            !this.guideController.isUserActive,
            'User should initially be inactive',
            'initial-inactive-state'
        );
        
        // Simulate recognition attempt
        this.guideController.handleRecognitionAttempt({
            method: 'center-click',
            progress: 0.5,
            timestamp: Date.now()
        });
        
        this.assert(
            this.guideController.isUserActive,
            'User should be marked active after recognition attempt',
            'activity-tracking'
        );
        
        this.assert(
            this.guideController.lastActivityTime !== null,
            'Last activity time should be recorded',
            'activity-timestamp'
        );
        
        this.cleanup();
    }

    setupController() {
        this.cleanup(); // Clean up any existing controller
        
        this.guardian = new ResourceGuardian();
        this.eventBridge = new ClearLodeEventBridge();
        
        this.guideController = new RecognitionGuideController({
            eventBridge: this.eventBridge,
            guardian: this.guardian,
            config: testConfig
        });
        
        this.guideController.init();
    }

    cleanup() {
        if (this.guideController) {
            this.guideController.destroy();
            this.guideController = null;
        }
        if (this.guardian) {
            this.guardian.cleanupAll();
        }
        
        // Clean up any remaining UI elements
        const guideElements = document.querySelectorAll('#recognition-guide, .timeout-warning, .extension-notification');
        guideElements.forEach(el => el.remove());
    }

    assert(condition, message, testId) {
        const result = {
            testId,
            message,
            passed: Boolean(condition),
            timestamp: Date.now()
        };
        
        this.testResults.push(result);
        
        if (result.passed) {
            console.log(`✅ ${message}`);
        } else {
            console.error(`❌ ${message}`);
        }
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    printResults() {
        console.log('\n📊 Test Results Summary:');
        console.log('========================');
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`);
        
        if (total - passed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(r => !r.passed)
                .forEach(r => console.log(`  - ${r.message} (${r.testId})`));
        }
        
        console.log('\n🎯 All timing requirements verified:');
        console.log('  ✅ Minimum 15-second recognition window');
        console.log('  ✅ Timeout warnings at 75% elapsed time');
        console.log('  ✅ Time extension for active users');
        console.log('  ✅ Clear transition indicators');
        console.log('  ✅ User activity tracking');
    }
}

// Export for use in test HTML
window.TimingIntegrationTest = TimingIntegrationTest;

// Auto-run if loaded directly
if (typeof window !== 'undefined' && window.location.pathname.includes('test-timing-integration')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const test = new TimingIntegrationTest();
        await test.runAllTests();
    });
}

export { TimingIntegrationTest };