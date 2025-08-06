import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ResponsiveZoneManager } from '../clear-lode/responsive-zone-manager.js';
import { FragmentAnimationController } from '../clear-lode/fragment-animation-controller.js';
import { MovementPath } from '../clear-lode/movement-path.js';

// Mock consciousness module
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        recordEvent: vi.fn(),
        getState: vi.fn().mockReturnValue({
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        })
    }
}));

// Mock ResourceGuardian
vi.mock('../src/consciousness/resource-guardian.js', () => ({
    ResourceGuardian: vi.fn().mockImplementation(() => ({
        register: vi.fn(),
        cleanupAll: vi.fn()
    }))
}));

// Mock GSAP
vi.mock('gsap', () => ({
    gsap: {
        to: vi.fn().mockReturnValue({ kill: vi.fn() }),
        timeline: vi.fn().mockReturnValue({
            to: vi.fn().mockReturnThis(),
            kill: vi.fn()
        })
    }
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

// Create a mock fragment element
const createMockFragment = () => {
    const fragment = document.createElement('div');
    fragment.className = 'fragment';
    fragment.textContent = 'Test fragment';
    fragment.dataset.birthTime = Date.now().toString();
    document.body.appendChild(fragment);
    return fragment;
};

describe('Mobile-Specific Positioning Optimizations', () => {
    let animationController;
    let restoreUserAgent;
    let mockFragment;

    beforeEach(() => {
        vi.useFakeTimers();
        mockWindow(1920, 1080);
        mockTouchCapability(false);
        restoreUserAgent = mockUserAgent(false);
        mockReducedMotion(false);
        mockBattery(1.0, true);
        
        mockFragment = createMockFragment();
    });

    afterEach(() => {
        if (animationController) {
            animationController.destroy();
        }
        
        if (mockFragment && mockFragment.parentNode) {
            mockFragment.parentNode.removeChild(mockFragment);
        }
        
        vi.useRealTimers();
        vi.restoreAllMocks();
        restoreUserAgent();
    });

    describe('Mobile device detection', () => {
        it('should correctly detect mobile devices', () => {
            // Setup desktop environment
            mockWindow(1920, 1080);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(false);
            mockTouchCapability(false);
            
            animationController = new FragmentAnimationController();
            expect(animationController.mobileSettings.isMobileDevice).toBe(false);
            
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            const mobileController = new FragmentAnimationController();
            expect(mobileController.mobileSettings.isMobileDevice).toBe(true);
            mobileController.destroy();
        });
    });

    describe('Battery-conscious animations', () => {
        it('should apply battery optimizations for low battery', async () => {
            // Setup mobile environment with low battery
            mockWindow(375, 667);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            mockBattery(0.15, false);
            
            animationController = new FragmentAnimationController();
            await vi.runAllTimersAsync();
            
            // Force update of mobile settings
            animationController.updateMobileSettings();
            
            // Check that battery-conscious settings are applied
            expect(animationController.mobileSettings.durationMultiplier).toBeLessThanOrEqual(0.6);
            expect(animationController.mobileSettings.maxWaypoints).toBeLessThanOrEqual(2);
            expect(animationController.mobileSettings.enableCenterEffects).toBe(false);
        });

        it('should use normal settings for charged battery', async () => {
            // Setup mobile environment with good battery
            mockWindow(375, 667);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            mockBattery(0.8, true);
            
            animationController = new FragmentAnimationController();
            await vi.runAllTimersAsync();
            
            // Force update of mobile settings
            animationController.updateMobileSettings();
            
            // Check that normal mobile settings are applied
            expect(animationController.mobileSettings.durationMultiplier).toBeGreaterThanOrEqual(0.7);
            expect(animationController.mobileSettings.maxWaypoints).toBeGreaterThanOrEqual(3);
        });
    });

    describe('Path optimization for mobile', () => {
        it('should reduce waypoints for complex paths on mobile', () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            animationController = new FragmentAnimationController();
            
            // Create a complex path with many waypoints
            const complexPath = new MovementPath({
                pathType: 'test',
                duration: 3,
                easing: 'power2.inOut',
                centerTraversal: true
            });
            
            // Add 10 waypoints
            for (let i = 0; i < 10; i++) {
                complexPath.addWaypoint(i * 50, i * 30);
            }
            
            // Optimize path for mobile
            const optimizedPath = animationController.optimizePathForMobile(complexPath);
            
            // Check that waypoints were reduced
            expect(optimizedPath.waypoints.length).toBeLessThanOrEqual(animationController.mobileSettings.maxWaypoints);
            expect(optimizedPath.waypoints.length).toBeLessThan(complexPath.waypoints.length);
            
            // Check that duration was adjusted
            expect(optimizedPath.duration).toBe(complexPath.duration * animationController.mobileSettings.durationMultiplier);
        });

        it('should preserve center waypoints when possible', () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            animationController = new FragmentAnimationController();
            
            // Create a path with a center waypoint
            const path = new MovementPath({
                pathType: 'test',
                duration: 3,
                easing: 'power2.inOut',
                centerTraversal: true
            });
            
            // Add waypoints with one near center
            path.addWaypoint(0, 0);
            path.addWaypoint(100, 100);
            path.addWaypoint(375/2, 667/2); // Center point
            path.addWaypoint(200, 300);
            path.addWaypoint(300, 400);
            path.addWaypoint(350, 500);
            path.addWaypoint(375, 667);
            
            // Optimize path for mobile
            const optimizedPath = animationController.optimizePathForMobile(path);
            
            // Check that at least one waypoint is near center
            const centerX = 375/2;
            const centerY = 667/2;
            const hasCenterWaypoint = optimizedPath.waypoints.some(wp => {
                const distance = Math.sqrt(Math.pow(wp.x - centerX, 2) + Math.pow(wp.y - centerY, 2));
                return distance < 100; // Within 100px of center
            });
            
            expect(hasCenterWaypoint).toBe(true);
        });
    });

    describe('Reduced motion support', () => {
        it('should apply reduced motion optimizations', () => {
            // Setup mobile environment with reduced motion preference
            mockWindow(375, 667);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            mockReducedMotion(true);
            
            animationController = new FragmentAnimationController();
            
            // Check that reduced motion settings are applied
            expect(animationController.mobileSettings.durationMultiplier).toBeLessThanOrEqual(0.5);
            expect(animationController.mobileSettings.maxWaypoints).toBeLessThanOrEqual(2);
            expect(animationController.mobileSettings.enableCenterEffects).toBe(false);
        });
    });

    describe('Animation behavior', () => {
        it('should use simplified animations for low battery', async () => {
            // Setup mobile environment with low battery
            mockWindow(375, 667);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            mockBattery(0.15, false);
            
            animationController = new FragmentAnimationController();
            await vi.runAllTimersAsync();
            
            // Spy on AnimationGuardian.safeAnimate
            const safeAnimateSpy = vi.spyOn(animationController, 'animateSimplePath');
            
            // Animate a simple path
            animationController.animateFragmentMovement(mockFragment, { x: 100, y: 100 }, 2, () => {});
            
            // Check that simplified animation was used
            expect(safeAnimateSpy).toHaveBeenCalled();
        });

        it('should optimize complex paths for mobile', async () => {
            // Setup mobile environment
            mockWindow(375, 667);
            restoreUserAgent();
            restoreUserAgent = mockUserAgent(true);
            mockTouchCapability(true);
            
            animationController = new FragmentAnimationController();
            
            // Spy on optimizePathForMobile
            const optimizePathSpy = vi.spyOn(animationController, 'optimizePathForMobile');
            
            // Create a complex path
            const complexPath = new MovementPath({
                pathType: 'test',
                duration: 3,
                easing: 'power2.inOut',
                centerTraversal: true
            });
            
            // Add waypoints
            for (let i = 0; i < 8; i++) {
                complexPath.addWaypoint(i * 50, i * 30);
            }
            
            // Animate with complex path
            animationController.animateFragmentMovement(mockFragment, complexPath, 3, () => {});
            
            // Check that path optimization was called
            expect(optimizePathSpy).toHaveBeenCalledWith(complexPath);
        });
    });
});