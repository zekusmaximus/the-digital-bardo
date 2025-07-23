/**
 * @file fragment-performance-optimizer.test.js
 * Unit tests for FragmentPerformanceOptimizer
 */

import { FragmentPerformanceOptimizer } from '../clear-lode/fragment-performance-optimizer.js';

// Mock dependencies
global.consciousness = {
    recordEvent: jest.fn()
};

global.ResourceGuardian = class {
    constructor() {
        this.resources = [];
    }
    register(resource, cleanup) {
        this.resources.push({ resource, cleanup });
    }
    cleanupAll() {
        this.resources.forEach(({ resource, cleanup }) => cleanup(resource));
        this.resources = [];
    }
};

// Mock performance API
global.performance = {
    now: jest.fn(() => Date.now()),
    memory: {
        usedJSHeapSize: 50 * 1024 * 1024 // 50MB
    }
};

// Mock navigator
global.navigator = {
    deviceMemory: 8,
    hardwareConcurrency: 8,
    connection: {
        effectiveType: '4g'
    }
};

// Mock DOM
global.document = {
    createElement: jest.fn(() => ({
        className: '',
        style: {
            position: '',
            visibility: '',
            opacity: '',
            transform: '',
            transition: '',
            setProperty: jest.fn(),
            removeProperty: jest.fn()
        },
        dataset: {},
        classList: {
            add: jest.fn(),
            remove: jest.fn()
        },
        cloneNode: jest.fn(function() { return this; }),
        remove: jest.fn(),
        parentNode: null,
        textContent: ''
    })),
    querySelectorAll: jest.fn(() => []),
    dispatchEvent: jest.fn()
};

global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

describe('FragmentPerformanceOptimizer', () => {
    let optimizer;

    beforeEach(() => {
        jest.clearAllMocks();
        optimizer = new FragmentPerformanceOptimizer();
    });

    afterEach(() => {
        if (optimizer) {
            optimizer.destroy();
        }
    });

    describe('Initialization', () => {
        test('should initialize with correct performance tier', () => {
            expect(optimizer.currentTier).toBe('high');
        });

        test('should initialize fragment pool when enabled', () => {
            const config = { pooling: { enabled: true, preAllocateCount: 5 } };
            const testOptimizer = new FragmentPerformanceOptimizer(config);
            
            expect(testOptimizer.fragmentPool.available.length).toBe(5);
            expect(testOptimizer.fragmentPool.totalCreated).toBe(5);
            
            testOptimizer.destroy();
        });

        test('should detect performance tier correctly', () => {
            // Test high tier
            global.navigator.deviceMemory = 8;
            global.navigator.hardwareConcurrency = 8;
            let testOptimizer = new FragmentPerformanceOptimizer();
            expect(testOptimizer.currentTier).toBe('high');
            testOptimizer.destroy();

            // Test medium tier
            global.navigator.deviceMemory = 4;
            global.navigator.hardwareConcurrency = 4;
            testOptimizer = new FragmentPerformanceOptimizer();
            expect(testOptimizer.currentTier).toBe('medium');
            testOptimizer.destroy();

            // Test low tier
            global.navigator.deviceMemory = 2;
            global.navigator.hardwareConcurrency = 2;
            testOptimizer = new FragmentPerformanceOptimizer();
            expect(testOptimizer.currentTier).toBe('low');
            testOptimizer.destroy();
        });
    });

    describe('Fragment Pooling', () => {
        test('should get fragment from pool', () => {
            const fragment = optimizer.getPooledFragment();
            
            expect(fragment).toBeDefined();
            expect(fragment.dataset.pooled).toBe('true');
            expect(optimizer.fragmentPool.inUse.has(fragment)).toBe(true);
        });

        test('should return fragment to pool', () => {
            const fragment = optimizer.getPooledFragment();
            const initialAvailable = optimizer.fragmentPool.available.length;
            
            optimizer.returnFragmentToPool(fragment);
            
            expect(optimizer.fragmentPool.inUse.has(fragment)).toBe(false);
            expect(optimizer.fragmentPool.available.length).toBe(initialAvailable + 1);
        });

        test('should reuse fragments from pool', () => {
            const fragment1 = optimizer.getPooledFragment();
            optimizer.returnFragmentToPool(fragment1);
            
            const fragment2 = optimizer.getPooledFragment();
            
            expect(optimizer.fragmentPool.totalReused).toBe(1);
        });

        test('should reset fragment state when returning to pool', () => {
            const fragment = optimizer.getPooledFragment();
            fragment.textContent = 'test content';
            fragment.className = 'test-class';
            fragment.dataset.testData = 'test';
            
            optimizer.returnFragmentToPool(fragment);
            
            expect(fragment.textContent).toBe('');
            expect(fragment.className).toBe('consciousness-fragment pooled');
            expect(fragment.dataset.testData).toBeUndefined();
            expect(fragment.dataset.pooled).toBe('true');
        });
    });

    describe('Corruption Optimization', () => {
        test('should queue corruption effects for batched processing', () => {
            const fragment = optimizer.getPooledFragment();
            const corruptionData = { corruptionLevel: 0.5 };
            
            optimizer.optimizeCorruptionEffect(fragment, corruptionData);
            
            expect(optimizer.corruptionQueue.length).toBe(1);
            expect(optimizer.corruptionQueue[0].fragment).toBe(fragment);
            expect(optimizer.corruptionQueue[0].corruptionData).toBe(corruptionData);
        });

        test('should apply tiered corruption based on performance tier', () => {
            const fragment = optimizer.getPooledFragment();
            const corruptionData = { corruptionLevel: 0.8 };
            
            // Test high tier
            optimizer.currentTier = 'high';
            optimizer.applyCorruptionImmediate(fragment, corruptionData);
            expect(fragment.style.setProperty).toHaveBeenCalledWith('--corruption-intensity', 0.8);
            
            // Test medium tier
            optimizer.currentTier = 'medium';
            optimizer.applyCorruptionImmediate(fragment, corruptionData);
            expect(fragment.style.setProperty).toHaveBeenCalledWith('--corruption-intensity', 0.64); // 0.8 * 0.8
            
            // Test low tier
            optimizer.currentTier = 'low';
            optimizer.applyCorruptionImmediate(fragment, corruptionData);
            expect(fragment.style.setProperty).toHaveBeenCalledWith('--corruption-intensity', 0.4); // 0.8 * 0.5
        });

        test('should limit concurrent corruption effects', () => {
            const maxEffects = optimizer.config.corruption.maxConcurrentEffects;
            
            // Fill up to max concurrent effects
            for (let i = 0; i < maxEffects + 2; i++) {
                const fragment = optimizer.getPooledFragment();
                fragment.dataset.fragmentId = `fragment-${i}`;
                optimizer.applyCorruptionImmediate(fragment, { corruptionLevel: 0.5 });
            }
            
            expect(optimizer.activeCorruptionEffects.size).toBeLessThanOrEqual(maxEffects);
        });
    });

    describe('Performance Monitoring', () => {
        test('should track performance metrics', () => {
            expect(optimizer.performanceMetrics).toHaveProperty('fps');
            expect(optimizer.performanceMetrics).toHaveProperty('memoryUsage');
            expect(optimizer.performanceMetrics).toHaveProperty('fragmentCount');
            expect(optimizer.performanceMetrics).toHaveProperty('corruptionEffectsActive');
        });

        test('should downgrade tier when performance is poor', () => {
            optimizer.currentTier = 'high';
            optimizer.performanceMetrics.fps = 20; // Below threshold
            
            optimizer.downgradeTier();
            
            expect(optimizer.currentTier).toBe('medium');
        });

        test('should upgrade tier when performance is good', () => {
            optimizer.currentTier = 'medium';
            optimizer.performanceMetrics.fps = 50; // Above threshold
            optimizer.performanceMetrics.memoryUsage = 30; // Below threshold
            optimizer.performanceMetrics.fragmentCount = 5; // Below threshold
            
            optimizer.upgradeTier();
            
            expect(optimizer.currentTier).toBe('high');
        });

        test('should not upgrade tier if performance is not good enough', () => {
            optimizer.currentTier = 'medium';
            optimizer.performanceMetrics.fps = 25; // Not good enough
            
            expect(optimizer.canUpgradeTier()).toBe(false);
        });
    });

    describe('Fragment Positioning Optimization', () => {
        test('should limit fragments based on tier', () => {
            const fragments = [];
            for (let i = 0; i < 25; i++) {
                fragments.push(optimizer.getPooledFragment());
            }
            
            optimizer.currentTier = 'medium'; // Max 12 fragments
            optimizer.optimizeFragmentPositioning(fragments);
            
            // Should have returned excess fragments to pool
            expect(optimizer.fragmentPool.inUse.size).toBeLessThanOrEqual(12);
        });

        test('should cache expensive calculations', () => {
            const fragment = optimizer.getPooledFragment();
            fragment.getBoundingClientRect = jest.fn(() => ({
                left: 100, top: 200, width: 50, height: 30
            }));
            
            optimizer.optimizeFragmentCalculations(fragment);
            
            expect(fragment.dataset.cachedBounds).toBeDefined();
            const cached = JSON.parse(fragment.dataset.cachedBounds);
            expect(cached.x).toBe(100);
            expect(cached.y).toBe(200);
        });
    });

    describe('Performance Statistics', () => {
        test('should provide comprehensive performance stats', () => {
            const stats = optimizer.getPerformanceStats();
            
            expect(stats).toHaveProperty('fps');
            expect(stats).toHaveProperty('memoryUsage');
            expect(stats).toHaveProperty('currentTier');
            expect(stats).toHaveProperty('fragmentPool');
            expect(stats).toHaveProperty('corruptionQueue');
            
            expect(stats.fragmentPool).toHaveProperty('available');
            expect(stats.fragmentPool).toHaveProperty('inUse');
            expect(stats.fragmentPool).toHaveProperty('reuseRatio');
        });

        test('should calculate reuse ratio correctly', () => {
            // Create and reuse some fragments
            const fragment1 = optimizer.getPooledFragment();
            optimizer.returnFragmentToPool(fragment1);
            const fragment2 = optimizer.getPooledFragment(); // This should be reused
            
            const stats = optimizer.getPerformanceStats();
            expect(stats.fragmentPool.reuseRatio).toBeGreaterThan(0);
        });
    });

    describe('Cleanup and Destruction', () => {
        test('should clean up resources on destroy', () => {
            const initialAvailable = optimizer.fragmentPool.available.length;
            
            optimizer.destroy();
            
            expect(optimizer.corruptionQueue).toEqual([]);
            expect(optimizer.fragmentPool.available).toEqual([]);
            expect(optimizer.fragmentPool.inUse.size).toBe(0);
        });

        test('should clean up old fragments from pool', () => {
            // Mock old fragments
            const oldFragment = optimizer.getPooledFragment();
            oldFragment.dataset.poolId = (Date.now() - 120000) + '.test'; // 2 minutes old
            optimizer.returnFragmentToPool(oldFragment);
            
            const initialCount = optimizer.fragmentPool.available.length;
            optimizer.cleanupFragmentPool();
            
            expect(optimizer.fragmentPool.available.length).toBeLessThan(initialCount);
        });
    });

    describe('Integration with External Systems', () => {
        test('should dispatch performance tier change events', () => {
            optimizer.currentTier = 'high';
            optimizer.applyTierSettings();
            
            expect(document.dispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'performance-tier-changed'
                })
            );
        });

        test('should record consciousness events for tier changes', () => {
            optimizer.downgradeTier();
            
            expect(consciousness.recordEvent).toHaveBeenCalledWith(
                'performance_tier_downgraded',
                expect.objectContaining({
                    newTier: expect.any(String),
                    metrics: expect.any(Object)
                })
            );
        });
    });
});