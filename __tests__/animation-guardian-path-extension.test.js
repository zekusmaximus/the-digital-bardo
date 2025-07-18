import { describe, it, expect, vi } from 'vitest';
import { AnimationGuardianPathExtension } from '../src/utils/animation-guardian-path-extension.js';
import { MovementPath } from '../clear-lode/movement-path.js';

// Mock AnimationGuardian
vi.mock('../src/utils/animation-guardian.js', () => ({
    AnimationGuardian: {
        performanceTiers: {
            high: { durationMultiplier: 1.0, complexityLevel: 'full' },
            medium: { durationMultiplier: 0.75, complexityLevel: 'reduced' },
            low: { durationMultiplier: 0.6, complexityLevel: 'minimal' }
        },
        safeTimeline: vi.fn(() => ({
            to: vi.fn().mockReturnThis(),
            kill: vi.fn()
        })),
        getKarmaState: vi.fn(() => ({
            computational: 0,
            emotional: 0,
            temporal: 0,
            void: 0
        })),
        detectPerformanceTier: vi.fn(() => 'high')
    }
}));

// Mock consciousness
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        recordEvent: vi.fn()
    }
}));

// Mock PathInterpolation
vi.mock('../../clear-lode/path-interpolation.js', () => ({
    PathInterpolation: {
        adaptiveSample: vi.fn(() => [
            { t: 0, point: { x: 0, y: 0 } },
            { t: 0.5, point: { x: 100, y: 100 } },
            { t: 1, point: { x: 200, y: 200 } }
        ]),
        recordUsage: vi.fn()
    }
}));

describe('AnimationGuardianPathExtension', () => {
    // Mock window for tests that need it
    global.window = {
        innerWidth: 1920,
        innerHeight: 1080
    };

    it('should handle progressive easing based on animation progress', () => {
        // Test different progress values
        const earlyEasing = AnimationGuardianPathExtension.getProgressiveEasing('power1.inOut', 0.2);
        const midEasing = AnimationGuardianPathExtension.getProgressiveEasing('power1.inOut', 0.5);
        const lateEasing = AnimationGuardianPathExtension.getProgressiveEasing('power1.inOut', 0.8);
        const noneEasing = AnimationGuardianPathExtension.getProgressiveEasing('none', 0.5);
        
        expect(earlyEasing).toBe('power2.out'); // Entry phase
        expect(midEasing).toBe('power1.inOut'); // Middle phase
        expect(lateEasing).toBe('power2.in'); // Exit phase
        expect(noneEasing).toBe('none'); // None should stay none
    });

    it('should apply karma-driven effects to path animations', () => {
        const movementPath = new MovementPath({
            waypoints: [{ x: 100, y: 100 }],
            centerTraversal: true
        });

        // Test high void karma
        const highVoidKarma = {
            void: 10,
            temporal: 0,
            emotional: 0
        };
        const highVoidEffects = AnimationGuardianPathExtension.getKarmaPathEffects(movementPath, highVoidKarma);
        expect(highVoidEffects.scaleMultiplier).toBe(1.2);
        expect(highVoidEffects.filterEffects).toBeTruthy();
        
        // Test negative temporal karma
        const negativeTemporalKarma = {
            void: 0,
            temporal: -4,
            emotional: 0
        };
        const temporalEffects = AnimationGuardianPathExtension.getKarmaPathEffects(movementPath, negativeTemporalKarma);
        expect(temporalEffects.durationMultiplier).toBe(0.7);
        
        // Test positive emotional karma
        const positiveEmotionalKarma = {
            void: 0,
            temporal: 0,
            emotional: 6
        };
        const emotionalEffects = AnimationGuardianPathExtension.getKarmaPathEffects(movementPath, positiveEmotionalKarma);
        expect(emotionalEffects.easingOverride).toBe('power2.inOut');
        
        // Test no karma
        const noKarma = null;
        const noEffects = AnimationGuardianPathExtension.getKarmaPathEffects(movementPath, noKarma);
        expect(noEffects.durationMultiplier).toBe(1);
        expect(noEffects.scaleMultiplier).toBe(1);
    });

    it('should apply path-specific optimizations based on performance tier', () => {
        const complexPath = new MovementPath({
            waypoints: Array(10).fill().map((_, i) => ({ x: i * 100, y: i * 100 })),
            curveType: 'catmull-rom'
        });

        // Test low tier
        const lowTierOpts = AnimationGuardianPathExtension.getPathOptimizations(complexPath, 'low');
        expect(lowTierOpts.waypointReduction).toBe(true);
        expect(lowTierOpts.simplifyInterpolation).toBe(true);
        expect(lowTierOpts.skipCenterEffects).toBe(true);
        
        // Test medium tier with complex path
        const mediumTierOpts = AnimationGuardianPathExtension.getPathOptimizations(complexPath, 'medium');
        expect(mediumTierOpts.waypointReduction).toBe(true);
        expect(mediumTierOpts.simplifyInterpolation).toBe(true);
        
        // Test medium tier with simple path
        const simplePath = new MovementPath({
            waypoints: [{ x: 100, y: 100 }, { x: 200, y: 200 }],
            curveType: 'linear'
        });
        const mediumSimpleOpts = AnimationGuardianPathExtension.getPathOptimizations(simplePath, 'medium');
        expect(mediumSimpleOpts.waypointReduction).toBe(false);
        
        // Test high tier
        const highTierOpts = AnimationGuardianPathExtension.getPathOptimizations(complexPath, 'high');
        expect(highTierOpts.waypointReduction).toBe(false);
        expect(highTierOpts.simplifyInterpolation).toBe(false);
        expect(highTierOpts.skipCenterEffects).toBe(false);
    });
});