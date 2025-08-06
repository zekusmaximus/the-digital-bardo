import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FragmentSpeedController } from '../clear-lode/fragment-speed-controller.js';

// Mock consciousness
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        recordEvent: vi.fn(),
        getState: vi.fn(() => ({}))
    }
}));

// Mock ResourceGuardian
vi.mock('../src/consciousness/resource-guardian.js', () => ({
    ResourceGuardian: vi.fn(() => ({
        register: vi.fn(),
        registerCleanup: vi.fn(),
        cleanupAll: vi.fn()
    }))
}));

describe('FragmentSpeedController', () => {
    let speedController;
    let mockFragment;

    beforeEach(() => {
        // Setup DOM environment
        global.window = {
            innerWidth: 1024,
            innerHeight: 768
        };
        global.document = {
            querySelector: vi.fn()
        };
        global.navigator = {
            deviceMemory: 4,
            hardwareConcurrency: 4,
            getBattery: null
        };

        speedController = new FragmentSpeedController();
        
        mockFragment = {
            textContent: 'This is a test fragment with some content',
            dataset: {},
            parentNode: { nodeType: 1 }, // Mock parent node
            getBoundingClientRect: () => ({ left: 100, top: 100, width: 200, height: 50 })
        };
    });

    afterEach(() => {
        if (speedController) {
            speedController.destroy();
        }
    });

    describe('Speed Calculation', () => {
        it('should calculate optimal speed based on content length', () => {
            const shortText = 'Hi';
            const longText = 'This is a much longer piece of text that should move slower for readability because it takes more time to read';
            
            const shortSpeed = speedController.calculateOptimalSpeed(shortText);
            const longSpeed = speedController.calculateOptimalSpeed(longText);
            
            expect(longSpeed).toBeLessThan(shortSpeed);
            expect(shortSpeed).toBeLessThanOrEqual(120); // maxSpeed
            expect(longSpeed).toBeGreaterThanOrEqual(20); // minSpeed
        });

        it('should handle empty or invalid content', () => {
            expect(speedController.calculateOptimalSpeed('')).toBe(20);
            expect(speedController.calculateOptimalSpeed(null)).toBe(20);
            expect(speedController.calculateOptimalSpeed(undefined)).toBe(20);
        });

        it('should respect speed limits', () => {
            const veryShortText = 'A';
            const veryLongText = 'A'.repeat(1000);
            
            const shortSpeed = speedController.calculateOptimalSpeed(veryShortText);
            const longSpeed = speedController.calculateOptimalSpeed(veryLongText);
            
            expect(shortSpeed).toBeLessThanOrEqual(120); // maxSpeed
            expect(longSpeed).toBeGreaterThanOrEqual(20); // minSpeed
        });

        it('should consider reading time in speed calculation', () => {
            const mediumText = 'This is a medium length text that should have a reasonable speed';
            const speed = speedController.calculateOptimalSpeed(mediumText);
            
            expect(speed).toBeGreaterThanOrEqual(20);
            expect(speed).toBeLessThanOrEqual(120);
        });
    });

    describe('Smooth Transitions', () => {
        it('should calculate smooth transitions between speeds', () => {
            const currentSpeed = 60;
            const targetSpeed = 80;
            
            const transitionedSpeed = speedController.calculateSmoothTransition(currentSpeed, targetSpeed);
            
            // Should be between current and target, but not jump immediately
            expect(transitionedSpeed).toBeGreaterThan(currentSpeed);
            expect(transitionedSpeed).toBeLessThanOrEqual(targetSpeed);
        });

        it('should not transition if speed difference is small', () => {
            const currentSpeed = 60;
            const targetSpeed = 62; // Small difference
            
            const transitionedSpeed = speedController.calculateSmoothTransition(currentSpeed, targetSpeed);
            
            expect(transitionedSpeed).toBe(targetSpeed);
        });

        it('should respect acceleration limits', () => {
            const currentSpeed = 20;
            const targetSpeed = 120; // Large jump
            
            const transitionedSpeed = speedController.calculateSmoothTransition(currentSpeed, targetSpeed);
            
            // Should not jump to target immediately
            expect(transitionedSpeed).toBeGreaterThan(currentSpeed);
            expect(transitionedSpeed).toBeLessThan(targetSpeed);
        });
    });

    describe('Animation Duration Calculation', () => {
        it('should convert speed to duration correctly', () => {
            const speed = 60; // pixels per second
            const distance = 300; // pixels
            
            const duration = speedController.speedToDuration(speed, distance);
            
            expect(duration).toBe(5); // 300/60 = 5 seconds
        });

        it('should handle edge cases in duration calculation', () => {
            expect(speedController.speedToDuration(0, 100)).toBe(5); // fallback
            expect(speedController.speedToDuration(100, 0)).toBe(5); // fallback
            expect(speedController.speedToDuration(-10, 100)).toBe(5); // fallback
        });

        it('should enforce duration bounds', () => {
            const veryFastSpeed = 1000;
            const verySlowSpeed = 1;
            const distance = 100;
            
            const fastDuration = speedController.speedToDuration(veryFastSpeed, distance);
            const slowDuration = speedController.speedToDuration(verySlowSpeed, distance);
            
            expect(fastDuration).toBeGreaterThanOrEqual(1); // minimum
            expect(slowDuration).toBeLessThanOrEqual(30); // maximum
        });

        it('should calculate animation duration based on content and distance', () => {
            const shortText = 'Hi';
            const longText = 'This is a longer text that needs more time to read';
            const distance = 400;
            
            const shortDuration = speedController.calculateAnimationDuration(shortText, distance);
            const longDuration = speedController.calculateAnimationDuration(longText, distance);
            
            expect(longDuration).toBeGreaterThan(shortDuration);
        });
    });

    describe('Fragment Registration and Tracking', () => {
        it('should register fragments for speed monitoring', () => {
            const fragmentId = 'test-fragment-1';
            const initialSpeed = 50;
            
            const optimalSpeed = speedController.registerFragment(fragmentId, mockFragment, initialSpeed);
            
            expect(optimalSpeed).toBeGreaterThan(0);
            expect(mockFragment.dataset.speed).toBe(optimalSpeed.toString());
            expect(speedController.getFragmentSpeed(fragmentId)).toBe(optimalSpeed);
        });

        it('should update fragment speeds', () => {
            const fragmentId = 'test-fragment-1';
            const initialOptimalSpeed = speedController.registerFragment(fragmentId, mockFragment, 50);
            
            const newSpeed = 80;
            speedController.updateFragmentSpeed(fragmentId, newSpeed);
            
            expect(speedController.getFragmentSpeed(fragmentId)).toBe(newSpeed);
            expect(mockFragment.dataset.speed).toBe(newSpeed.toString());
        });

        it('should unregister fragments', () => {
            const fragmentId = 'test-fragment-1';
            speedController.registerFragment(fragmentId, mockFragment, 50);
            
            speedController.unregisterFragment(fragmentId);
            
            expect(speedController.getFragmentSpeed(fragmentId)).toBeNull();
        });
    });

    describe('Speed Validation', () => {
        it('should validate fragment speeds correctly', () => {
            // Use the optimal speed for this fragment's content to ensure validation passes
            const optimalSpeed = speedController.calculateOptimalSpeed(mockFragment.textContent);
            const validation = speedController.validateFragmentSpeed(mockFragment, optimalSpeed);
            
            expect(validation.isValid).toBe(true);
            expect(validation.issues).toHaveLength(0);
        });

        it('should detect speed violations', () => {
            const tooFastSpeed = 200; // Above maxSpeed of 120
            const validation = speedController.validateFragmentSpeed(mockFragment, tooFastSpeed);
            
            expect(validation.isValid).toBe(false);
            expect(validation.issues.length).toBeGreaterThan(0);
            expect(validation.issues[0]).toContain('Speed too high');
        });

        it('should detect slow speed violations', () => {
            const tooSlowSpeed = 10; // Below minSpeed of 20
            const validation = speedController.validateFragmentSpeed(mockFragment, tooSlowSpeed);
            
            expect(validation.isValid).toBe(false);
            expect(validation.issues.length).toBeGreaterThan(0);
            expect(validation.issues[0]).toContain('Speed too low');
        });

        it('should provide recommended speeds for invalid fragments', () => {
            const invalidSpeed = 200;
            const validation = speedController.validateFragmentSpeed(mockFragment, invalidSpeed);
            
            expect(validation.recommendedSpeed).toBeDefined();
            expect(validation.recommendedSpeed).toBeLessThanOrEqual(120);
            expect(validation.recommendedSpeed).toBeGreaterThanOrEqual(20);
            expect(validation.isValid).toBe(false);
        });
    });

    describe('Speed Control System', () => {
        it('should start and stop speed control', () => {
            speedController.startSpeedControl();
            expect(speedController.updateInterval).toBeDefined();
            
            speedController.stopSpeedControl();
            expect(speedController.updateInterval).toBeNull();
        });

        it('should handle performance optimization', () => {
            // Test with many fragments to trigger performance optimization
            for (let i = 0; i < 25; i++) {
                speedController.registerFragment(`fragment-${i}`, mockFragment, 50);
            }
            
            const shouldSkip = speedController.shouldSkipUpdate();
            // With 25 fragments, should sometimes skip updates
            expect(typeof shouldSkip).toBe('boolean');
        });
    });

    describe('Performance Metrics', () => {
        it('should track performance statistics', () => {
            speedController.calculateOptimalSpeed('test content');
            speedController.calculateOptimalSpeed('another test');
            
            const stats = speedController.getPerformanceStats();
            
            expect(stats.speedCalculations).toBe(2);
            expect(stats.averageSpeed).toBeGreaterThan(0);
            expect(stats.trackedFragments).toBe(0); // No fragments registered
        });

        it('should update average speed correctly', () => {
            speedController.calculateOptimalSpeed('short');
            speedController.calculateOptimalSpeed('this is a much longer text');
            
            const stats = speedController.getPerformanceStats();
            
            expect(stats.averageSpeed).toBeGreaterThan(0);
            expect(stats.speedCalculations).toBe(2);
        });
    });

    describe('Configuration', () => {
        it('should use custom configuration', () => {
            const customConfig = {
                speedLimits: {
                    maxSpeed: 100,
                    minSpeed: 30
                }
            };
            
            const customController = new FragmentSpeedController(customConfig);
            
            const speed = customController.calculateOptimalSpeed('test');
            expect(speed).toBeLessThanOrEqual(100);
            expect(speed).toBeGreaterThanOrEqual(30);
            
            customController.destroy();
        });

        it('should merge configurations correctly', () => {
            const customConfig = {
                speedLimits: {
                    maxSpeed: 100 // Only override maxSpeed
                }
            };
            
            const customController = new FragmentSpeedController(customConfig);
            
            // Should use custom maxSpeed but default minSpeed
            expect(customController.config.speedLimits.maxSpeed).toBe(100);
            expect(customController.config.speedLimits.minSpeed).toBe(20); // default
            
            customController.destroy();
        });
    });

    describe('Resource Management', () => {
        it('should clean up resources on destroy', () => {
            speedController.startSpeedControl();
            speedController.registerFragment('test', mockFragment, 50);
            
            const guardianCleanupSpy = vi.spyOn(speedController.guardian, 'cleanupAll');
            
            speedController.destroy();
            
            expect(guardianCleanupSpy).toHaveBeenCalled();
            expect(speedController.updateInterval).toBeNull();
        });
    });
});