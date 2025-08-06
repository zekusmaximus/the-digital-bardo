import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';
import { MovementPath } from '../clear-lode/movement-path.js';

// Mock GSAP
const mockTimeline = {
    to: vi.fn().mockReturnThis(),
    eventCallback: vi.fn().mockReturnThis(),
    kill: vi.fn()
};

const mockGsap = {
    timeline: vi.fn(() => mockTimeline),
    to: vi.fn(() => ({ kill: vi.fn() }))
};

// Mock consciousness
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        recordEvent: vi.fn(),
        getState: vi.fn(() => ({
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        }))
    }
}));

describe('AnimationGuardian Integration', () => {
    let mockTarget;

    beforeEach(() => {
        // Mock window dimensions first
        global.window = {
            innerWidth: 1920,
            innerHeight: 1080
        };

        // Setup global gsap mock
        global.gsap = mockGsap;
        
        // Create mock DOM element
        mockTarget = {
            className: 'test-fragment',
            style: {},
            getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 50 })
        };

        // Mock navigator for performance tier detection
        global.navigator = {
            deviceMemory: 8,
            hardwareConcurrency: 8
        };

        // Clear all mocks
        vi.clearAllMocks();
    });

    afterEach(() => {
        delete global.gsap;
        delete global.window;
        delete global.navigator;
    });

    it('should create path animations with karma integration', () => {
        const movementPath = new MovementPath({
            waypoints: [
                { x: 100, y: 100 },
                { x: 200, y: 200 },
                { x: 300, y: 300 }
            ],
            duration: 15,
            easing: 'power2.out',
            centerTraversal: true,
            pathType: 'edge-to-center'
        });

        const options = {
            karmaState: {
                computational: 0,
                emotional: 5,
                temporal: -2,
                void: 3
            },
            recordKarmaEvents: true
        };

        const result = AnimationGuardian.safePathAnimation(mockTarget, movementPath, options);

        // Verify timeline was created
        expect(mockGsap.timeline).toHaveBeenCalled();
        
        // Verify the timeline was returned
        expect(result).toBe(mockTimeline);
        
        // Verify timeline.to was called for waypoints
        expect(mockTimeline.to).toHaveBeenCalled();
    });

    it('should apply performance tier adjustments to path animations', () => {
        const movementPath = new MovementPath({
            waypoints: [{ x: 100, y: 100 }],
            duration: 20,
            pathType: 'simple'
        });

        // Mock low performance tier
        global.navigator = {
            deviceMemory: 2,
            hardwareConcurrency: 2
        };

        AnimationGuardian.safePathAnimation(mockTarget, movementPath, {});

        // Verify timeline was created (simplified path for low-end devices)
        expect(mockGsap.timeline).toHaveBeenCalled();
        expect(mockTimeline.to).toHaveBeenCalled();
    });

    it('should handle karma adjustments for timing and easing', () => {
        const movementPath = new MovementPath({
            waypoints: [{ x: 100, y: 100 }],
            duration: 15,
            easing: 'none',
            pathType: 'test'
        });

        const karmaState = {
            computational: 0,
            emotional: 6, // Should improve easing
            temporal: -4, // Should speed up animation
            void: 0
        };

        AnimationGuardian.safePathAnimation(mockTarget, movementPath, { karmaState });

        expect(mockGsap.timeline).toHaveBeenCalled();
        expect(mockTimeline.to).toHaveBeenCalled();
    });

    it('should fallback gracefully when GSAP is unavailable', () => {
        delete global.gsap;

        const movementPath = new MovementPath({
            waypoints: [{ x: 100, y: 100 }],
            duration: 10,
            pathType: 'fallback'
        });

        const result = AnimationGuardian.safePathAnimation(mockTarget, movementPath, {});

        // Should return fallback animation object
        expect(result).toHaveProperty('kill');
        expect(typeof result.kill).toBe('function');
    });

    it('should handle center traversal effects', () => {
        const movementPath = new MovementPath({
            waypoints: [
                { x: 960, y: 540 } // Center of 1920x1080 screen
            ],
            duration: 15,
            centerTraversal: true,
            pathType: 'center-traversal'
        });

        const karmaState = {
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 8 // Should enhance center effects
        };

        AnimationGuardian.safePathAnimation(mockTarget, movementPath, { karmaState });

        expect(mockGsap.timeline).toHaveBeenCalled();
        expect(mockTimeline.to).toHaveBeenCalled();
    });

    it('should integrate with existing safeAnimate method', () => {
        const properties = {
            x: 100,
            y: 200,
            duration: 2,
            ease: 'power2.out'
        };

        const options = {
            karmaState: {
                computational: 0,
                emotional: 0,
                temporal: 2,
                void: 0
            },
            pathType: 'simple',
            recordKarmaEvents: true
        };

        const result = AnimationGuardian.safeAnimate(mockTarget, properties, options);

        expect(mockGsap.to).toHaveBeenCalled();
        expect(result).toHaveProperty('kill');
    });
});