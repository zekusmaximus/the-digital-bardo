import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ResponsiveZoneManager } from '../clear-lode/responsive-zone-manager.js';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';

// Mock consciousness module
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        recordEvent: vi.fn()
    }
}));

// Mock ResourceGuardian
vi.mock('../src/consciousness/resource-guardian.js', () => ({
    ResourceGuardian: vi.fn().mockImplementation(() => ({
        register: vi.fn((callback, cleanup) => {
            // Store the cleanup function for later use
            return { callback, cleanup };
        }),
        cleanupAll: vi.fn()
    }))
}));

// Mock window dimensions
const mockWindow = (width = 1920, height = 1080) => {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height,
    });
};

// Mock user agent
const mockUserAgent = (isMobile = false) => {
    const originalUserAgent = navigator.userAgent;
    Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        configurable: true,
        value: isMobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    });
    return () => {
        Object.defineProperty(navigator, 'userAgent', {
            value: originalUserAgent
        });
    };
};

// Mock touch capability
const mockTouchCapability = (hasTouch = false) => {
    if (hasTouch) {
        window.ontouchstart = () => {};
        Object.defineProperty(navigator, 'maxTouchPoints', {
            writable: true,
            configurable: true,
            value: 5,
        });
    } else {
        delete window.ontouchstart;
        Object.defineProperty(navigator, 'maxTouchPoints', {
            writable: true,
            configurable: true,
            value: 0,
        });
    }
};

// Mock battery API
const mockBattery = (level = 1.0, charging = true) => {
    const battery = {
        level,
        charging,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    };
    
    navigator.getBattery = vi.fn().mockResolvedValue(battery);
    return battery;
};

// Mock reduced motion preference
const mockReducedMotion = (preferReducedMotion = false) => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: preferReducedMotion && query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    }));
};

describe('ResponsiveZoneManager', () => {
    let manager;
    let restoreUserAgent;

    beforeEach(() => {
        vi.useFakeTimers();
        mockWindow(1920, 1080);
        mockTouchCapability(false);
        restoreUserAgent = mockUserAgent(false);
        mockReducedMotion(false);
        
        // Store original AnimationGuardian settings
        AnimationGuardian._testOriginalTiers = JSON.parse(JSON.stringify(AnimationGuardian.performanceTiers || {}));
    });

    afterEach(() => {
        if (manager) {
            manager.destroy();
        }
        vi.useRealTimers();
        vi.restoreAllMocks();
        restoreUserAgent();
        
        // Restore original AnimationGuardian settings
        if (AnimationGuardian._testOriginalTiers) {
            AnimationGuardian.performanceTiers = JSON.parse(JSON.stringify(AnimationGuardian._testOriginalTiers));
            delete AnimationGuardian._testOriginalTiers;
        }
    });

    describe('mobile detection', () => {
        it('should detect mobile devices based on viewport size and user agent', () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            manager = new ResponsiveZoneManager();
            expect(manager.isMobileDevice).toBe(true);
            
            // Setup desktop environment
            mockWindow(1920, 1080);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(false);
            mockTouchCapability(false);
            
            const desktopManager = new ResponsiveZoneManager();
            expect(desktopManager.isMobileDevice).toBe(false);
            desktopManager.destroy();
        });

        it('should detect tablets as mobile devices', () => {
            // Setup tablet environment
            mockWindow(768, 1024);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            manager = new ResponsiveZoneManager();
            expect(manager.isMobileDevice).toBe(true);
        });
    });

    describe('touch-friendly positioning', () => {
        it('should create larger touch zones on mobile devices', () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            manager = new ResponsiveZoneManager();
            
            // Check that edge margin is at least the minimum touch zone size
            const minTouchZonePercentage = manager.mobileConfig.minTouchZoneSize / Math.min(375, 667);
            expect(manager.config.edgeMargin).toBeGreaterThanOrEqual(minTouchZonePercentage);
            
            // Check that center zone is larger on mobile
            expect(manager.config.centerZoneSize).toBeGreaterThanOrEqual(0.5);
        });

        it('should adjust zone weights to favor center zones on mobile', () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            manager = new ResponsiveZoneManager();
            
            // Get center and edge zones
            const centerZone = manager.getZone('center');
            const edgeZone = manager.getZone('edge-top');
            
            // Check that center zone has higher weight than edge zone
            expect(centerZone.weight).toBeGreaterThan(edgeZone.weight);
        });
    });

    describe('battery-conscious animations', () => {
        it('should apply battery optimizations when battery level is low', async () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            // Mock low battery
            const battery = mockBattery(0.15, false);
            
            manager = new ResponsiveZoneManager();
            
            // Wait for battery status to be processed
            await vi.runAllTimersAsync();
            
            // Manually trigger battery update
            manager.updateBatteryStatus(battery);
            
            // Check that battery status is updated
            expect(manager.batteryStatus.level).toBe(0.15);
            expect(manager.batteryStatus.charging).toBe(false);
            
            // Check that animation settings are adjusted for low battery
            expect(AnimationGuardian.performanceTiers.medium.durationMultiplier)
                .toBeLessThan(AnimationGuardian._testOriginalTiers.medium.durationMultiplier);
        });

        it('should not apply battery optimizations when battery level is high', async () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            // Mock high battery
            const battery = mockBattery(0.8, true);
            
            manager = new ResponsiveZoneManager();
            
            // Wait for battery status to be processed
            await vi.runAllTimersAsync();
            
            // Manually trigger battery update
            manager.updateBatteryStatus(battery);
            
            // Check that battery status is updated
            expect(manager.batteryStatus.level).toBe(0.8);
            expect(manager.batteryStatus.charging).toBe(true);
            
            // Check that animation settings are not overly reduced
            expect(AnimationGuardian.performanceTiers.medium.durationMultiplier)
                .toBeGreaterThan(0.5);
        });
    });

    describe('reduced motion support', () => {
        it('should detect and apply reduced motion preferences', () => {
            // Setup mobile environment with reduced motion preference
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            mockReducedMotion(true);
            
            manager = new ResponsiveZoneManager();
            
            // Check that reduced motion is detected
            expect(manager.reducedMotionEnabled).toBe(true);
            
            // Check that animation settings are adjusted for reduced motion
            expect(AnimationGuardian.performanceTiers.medium.durationMultiplier)
                .toBeLessThan(AnimationGuardian._testOriginalTiers.medium.durationMultiplier);
            expect(AnimationGuardian.performanceTiers.medium.complexityLevel)
                .toBe('minimal');
        });
    });

    describe('mobile zone selection', () => {
        it('should use mobile-optimized zone selection strategies', () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            manager = new ResponsiveZoneManager();
            
            // Spy on mobile zone selection methods
            vi.spyOn(manager, 'selectMobileBalancedZone');
            vi.spyOn(manager, 'selectMobileCenterWeightedZone');
            vi.spyOn(manager, 'selectMobileOrganicZone');
            
            // Test different selection strategies
            manager.selectZone('balanced');
            expect(manager.selectMobileBalancedZone).toHaveBeenCalled();
            
            manager.selectZone('center-weighted');
            expect(manager.selectMobileCenterWeightedZone).toHaveBeenCalled();
            
            manager.selectZone('organic');
            expect(manager.selectMobileOrganicZone).toHaveBeenCalled();
        });

        it('should favor edge zones when battery is low', async () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            // Mock low battery
            const battery = mockBattery(0.15, false);
            
            manager = new ResponsiveZoneManager();
            
            // Wait for battery status to be processed
            await vi.runAllTimersAsync();
            
            // Manually trigger battery update
            manager.updateBatteryStatus(battery);
            
            // Spy on edge zone selection
            vi.spyOn(manager, 'selectEdgeZone');
            
            // Test zone selection with low battery
            manager.selectZone('center-weighted');
            expect(manager.selectEdgeZone).toHaveBeenCalled();
        });
    });

    describe('small screen optimizations', () => {
        it('should apply special optimizations for very small screens', () => {
            // Setup very small screen environment
            mockWindow(320, 480);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            manager = new ResponsiveZoneManager();
            
            // Check that center zone is extra large on very small screens
            expect(manager.config.centerZoneSize).toBe(0.6);
        });
    });

    describe('mobile status reporting', () => {
        it('should provide accurate mobile status information', async () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            mockReducedMotion(true);
            
            // Mock battery
            const battery = mockBattery(0.15, false);
            
            manager = new ResponsiveZoneManager();
            
            // Wait for battery status to be processed
            await vi.runAllTimersAsync();
            
            // Manually trigger battery update
            manager.updateBatteryStatus(battery);
            
            // Get mobile status
            const status = manager.getMobileStatus();
            
            // Check status properties
            expect(status.isMobileDevice).toBe(true);
            expect(status.batteryStatus.level).toBe(0.15);
            expect(status.batteryStatus.charging).toBe(false);
            expect(status.reducedMotionEnabled).toBe(true);
            expect(status.optimizationsApplied.touchFriendly).toBe(true);
            expect(status.optimizationsApplied.batteryConscious).toBe(true);
            expect(status.optimizationsApplied.lowBatteryMode).toBe(true);
            expect(status.optimizationsApplied.reducedMotion).toBe(true);
        });
    });
});