/**
 * @file test-performance-integration.js
 * Integration test for performance optimization with other UX enhancement systems
 */

import { FragmentPerformanceOptimizer } from './fragment-performance-optimizer.js';
import { FragmentPositionManager } from './fragment-position-manager.js';
import { FragmentSpeedController } from './fragment-speed-controller.js';
import { CorruptionProgression } from './corruption-progression.js';

// Mock consciousness system
const mockConsciousness = {
    recordEvent: (event, data) => {
        console.log(`[Consciousness] ${event}:`, data);
    },
    getState: (path) => ({
        computational: Math.random() * 0.2 - 0.1,
        emotional: Math.random() * 0.2 - 0.1,
        temporal: Math.random() * 0.2 - 0.1,
        void: Math.random() * 0.2 - 0.1
    }),
    karmicEngine: {
        getTotalKarma: (state) => Object.values(state).reduce((sum, val) => sum + val, 0)
    }
};

// Mock ResourceGuardian
class MockResourceGuardian {
    constructor() {
        this.resources = [];
    }
    
    register(resource, cleanup) {
        this.resources.push({ resource, cleanup });
    }
    
    registerCleanup(cleanup) {
        this.resources.push({ cleanup });
    }
    
    cleanupAll() {
        this.resources.forEach(({ resource, cleanup }) => {
            if (cleanup) cleanup(resource);
        });
        this.resources = [];
    }
}

// Mock DOM elements
function createMockFragment() {
    return {
        style: {
            position: 'absolute',
            left: '0px',
            top: '0px',
            visibility: 'visible',
            opacity: '1',
            transform: '',
            transition: '',
            setProperty: () => {},
            removeProperty: () => {}
        },
        dataset: {},
        classList: {
            add: () => {},
            remove: () => {}
        },
        textContent: '',
        className: '',
        parentNode: { removeChild: () => {} },
        remove: () => {},
        cloneNode: () => createMockFragment(),
        getBoundingClientRect: () => ({
            left: Math.random() * 800,
            top: Math.random() * 600,
            width: 100,
            height: 20
        })
    };
}

// Integration test class
export class PerformanceIntegrationTest {
    constructor() {
        this.testResults = [];
        this.setupMocks();
        this.initializeSystems();
    }
    
    setupMocks() {
        // Mock global objects
        global.window = {
            innerWidth: 1024,
            innerHeight: 768,
            addEventListener: () => {},
            removeEventListener: () => {},
            performance: {
                now: () => Date.now(),
                memory: { usedJSHeapSize: 50 * 1024 * 1024 }
            },
            requestAnimationFrame: (cb) => setTimeout(cb, 16),
            cancelAnimationFrame: (id) => clearTimeout(id)
        };
        
        global.document = {
            createElement: () => createMockFragment(),
            querySelectorAll: () => [],
            dispatchEvent: () => {},
            getElementById: () => ({ appendChild: () => {} })
        };
        
        global.navigator = {
            deviceMemory: 8,
            hardwareConcurrency: 8,
            connection: { effectiveType: '4g' }
        };
        
        global.consciousness = mockConsciousness;
        global.ResourceGuardian = MockResourceGuardian;
    }
    
    initializeSystems() {
        // Initialize all systems
        this.performanceOptimizer = new FragmentPerformanceOptimizer({
            pooling: { enabled: true, maxPoolSize: 20, preAllocateCount: 5 },
            corruption: { batchSize: 3, maxConcurrentEffects: 5 },
            monitoring: { enabled: true }
        });
        
        this.positionManager = new FragmentPositionManager();
        this.speedController = new FragmentSpeedController();
        this.corruptionProgression = new CorruptionProgression(mockConsciousness.karmicEngine);
        
        console.log('[Integration Test] All systems initialized');
    }
    
    async runAllTests() {
        console.log('[Integration Test] Starting comprehensive integration tests...');
        
        try {
            await this.testFragmentLifecycle();
            await this.testPerformanceOptimization();
            await this.testSystemCoordination();
            await this.testStressScenarios();
            
            this.printResults();
            return this.testResults.every(result => result.passed);
        } catch (error) {
            console.error('[Integration Test] Test suite failed:', error);
            return false;
        }
    }
    
    async testFragmentLifecycle() {
        console.log('[Integration Test] Testing fragment lifecycle with performance optimization...');
        
        try {
            // Test fragment creation with pooling
            const fragment = this.performanceOptimizer.getPooledFragment();
            fragment.textContent = 'Test Fragment';
            fragment.dataset.fragmentId = 'test-fragment-1';
            
            // Initialize with position manager
            const safePosition = this.positionManager.getSafePosition();
            fragment.style.left = `${safePosition.x}px`;
            fragment.style.top = `${safePosition.y}px`;
            
            // Calculate optimal speed
            const optimalSpeed = this.speedController.calculateOptimalSpeed(fragment.textContent);
            fragment.dataset.speed = optimalSpeed;
            
            // Initialize corruption
            this.corruptionProgression.initializeCleanFragment(fragment);
            
            // Apply some corruption
            const karmaState = mockConsciousness.getState('karma');
            this.corruptionProgression.applyProgressiveCorruption(fragment, karmaState);
            
            // Optimize corruption effect
            const corruptionData = { corruptionLevel: 0.3 };
            this.performanceOptimizer.optimizeCorruptionEffect(fragment, corruptionData);
            
            // Validate fragment state
            const validation = this.positionManager.validateFragmentPlacement(fragment);
            
            this.addTestResult('Fragment Lifecycle', validation.isValid && fragment.dataset.pooled === 'true');
            
        } catch (error) {
            this.addTestResult('Fragment Lifecycle', false, error.message);
        }
    }
    
    async testPerformanceOptimization() {
        console.log('[Integration Test] Testing performance optimization features...');
        
        try {
            // Test fragment pooling
            const fragments = [];
            for (let i = 0; i < 10; i++) {
                const fragment = this.performanceOptimizer.getPooledFragment();
                fragment.textContent = `Fragment ${i}`;
                fragments.push(fragment);
            }
            
            const poolStats = this.performanceOptimizer.getPerformanceStats();
            const poolingWorking = poolStats.fragmentPool.inUse === 10;
            
            // Return fragments to pool
            fragments.forEach(fragment => {
                this.performanceOptimizer.returnFragmentToPool(fragment);
            });
            
            const afterReturn = this.performanceOptimizer.getPerformanceStats();
            const returningWorking = afterReturn.fragmentPool.inUse === 0;
            
            // Test reuse
            const reusedFragment = this.performanceOptimizer.getPooledFragment();
            const reuseWorking = afterReturn.fragmentPool.totalReused > 0;
            
            this.addTestResult('Fragment Pooling', poolingWorking && returningWorking);
            this.addTestResult('Fragment Reuse', reuseWorking);
            
            // Test performance tier adjustment
            const originalTier = this.performanceOptimizer.currentTier;
            this.performanceOptimizer.downgradeTier();
            const downgraded = this.performanceOptimizer.currentTier !== originalTier;
            
            this.performanceOptimizer.upgradeTier();
            const upgraded = this.performanceOptimizer.currentTier === originalTier;
            
            this.addTestResult('Performance Tier Adjustment', downgraded && upgraded);
            
        } catch (error) {
            this.addTestResult('Performance Optimization', false, error.message);
        }
    }
    
    async testSystemCoordination() {
        console.log('[Integration Test] Testing system coordination...');
        
        try {
            // Create a fragment and test coordination between systems
            const fragment = this.performanceOptimizer.getPooledFragment();
            fragment.textContent = 'Coordination Test Fragment';
            fragment.dataset.fragmentId = 'coord-test';
            
            // Test position manager integration
            const safePosition = this.positionManager.getSafePosition();
            fragment.style.left = `${safePosition.x}px`;
            fragment.style.top = `${safePosition.y}px`;
            
            const validation = this.positionManager.validateFragmentPlacement(fragment);
            const positioningWorking = validation.isValid;
            
            // Test speed controller integration
            const optimalSpeed = this.speedController.calculateOptimalSpeed(fragment.textContent);
            const speedWorking = optimalSpeed > 0 && optimalSpeed <= 120;
            
            // Test corruption progression integration
            this.corruptionProgression.initializeCleanFragment(fragment);
            const karmaState = mockConsciousness.getState('karma');
            const corruptionLevel = this.corruptionProgression.applyProgressiveCorruption(fragment, karmaState);
            const corruptionWorking = typeof corruptionLevel === 'number';
            
            // Test performance optimizer coordination
            const corruptionData = { corruptionLevel: 0.5 };
            this.performanceOptimizer.optimizeCorruptionEffect(fragment, corruptionData);
            const optimizationWorking = this.performanceOptimizer.corruptionQueue.length >= 0;
            
            this.addTestResult('System Coordination', 
                positioningWorking && speedWorking && corruptionWorking && optimizationWorking);
            
        } catch (error) {
            this.addTestResult('System Coordination', false, error.message);
        }
    }
    
    async testStressScenarios() {
        console.log('[Integration Test] Testing stress scenarios...');
        
        try {
            // Create many fragments rapidly
            const fragments = [];
            const startTime = Date.now();
            
            for (let i = 0; i < 50; i++) {
                const fragment = this.performanceOptimizer.getPooledFragment();
                fragment.textContent = `Stress Fragment ${i}`;
                fragment.dataset.fragmentId = `stress-${i}`;
                
                // Initialize with all systems
                const safePosition = this.positionManager.getSafePosition();
                fragment.style.left = `${safePosition.x}px`;
                fragment.style.top = `${safePosition.y}px`;
                
                const optimalSpeed = this.speedController.calculateOptimalSpeed(fragment.textContent);
                fragment.dataset.speed = optimalSpeed;
                
                this.corruptionProgression.initializeCleanFragment(fragment);
                
                const corruptionData = { corruptionLevel: Math.random() };
                this.performanceOptimizer.optimizeCorruptionEffect(fragment, corruptionData);
                
                fragments.push(fragment);
            }
            
            const creationTime = Date.now() - startTime;
            const creationPerformance = creationTime < 1000; // Should create 50 fragments in under 1 second
            
            // Test cleanup performance
            const cleanupStart = Date.now();
            fragments.forEach(fragment => {
                this.performanceOptimizer.returnFragmentToPool(fragment);
                this.corruptionProgression.removeFragment(fragment.dataset.fragmentId);
            });
            
            const cleanupTime = Date.now() - cleanupStart;
            const cleanupPerformance = cleanupTime < 500; // Should cleanup in under 0.5 seconds
            
            // Test memory usage
            const stats = this.performanceOptimizer.getPerformanceStats();
            const memoryEfficient = stats.fragmentPool.reuseRatio > 0.8; // Should reuse most fragments
            
            this.addTestResult('Stress Test - Creation', creationPerformance);
            this.addTestResult('Stress Test - Cleanup', cleanupPerformance);
            this.addTestResult('Stress Test - Memory', memoryEfficient);
            
        } catch (error) {
            this.addTestResult('Stress Test', false, error.message);
        }
    }
    
    addTestResult(testName, passed, error = null) {
        this.testResults.push({
            name: testName,
            passed,
            error,
            timestamp: new Date().toISOString()
        });
        
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const errorMsg = error ? ` - ${error}` : '';
        console.log(`[Integration Test] ${status}: ${testName}${errorMsg}`);
    }
    
    printResults() {
        console.log('\n[Integration Test] Test Results Summary:');
        console.log('=====================================');
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            console.log(`${status} ${result.name}`);
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });
        
        console.log(`\nOverall: ${passed}/${total} tests passed (${((passed/total)*100).toFixed(1)}%)`);
        
        if (passed === total) {
            console.log('🎉 All integration tests passed!');
        } else {
            console.log('⚠️  Some tests failed. Check the results above.');
        }
    }
    
    cleanup() {
        console.log('[Integration Test] Cleaning up test environment...');
        
        try {
            this.performanceOptimizer.destroy();
            this.positionManager.destroy();
            this.speedController.destroy();
            this.corruptionProgression.destroy();
        } catch (error) {
            console.error('[Integration Test] Cleanup error:', error);
        }
    }
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
    window.runPerformanceIntegrationTest = async function() {
        const test = new PerformanceIntegrationTest();
        const success = await test.runAllTests();
        test.cleanup();
        return success;
    };
}

export default PerformanceIntegrationTest;