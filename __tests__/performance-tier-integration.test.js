import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PerformanceTierIntegration } from '../clear-lode/performance-tier-integration.js';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';

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

// Mock AnimationGuardian
vi.mock('../src/utils/animation-guardian.js', () => ({
    AnimationGuardian: {
        detectPerformanceTier: vi.fn().mockReturnValue('medium'),
        performanceTiers: {
            high: { durationMultiplier: 1.0, complexityLevel: 'full', centerEffects: true },
            medium: { durationMultiplier: 0.75, complexityLevel: 'reduced', centerEffects: true },
            low: { durationMultiplier: 0.6, complexityLevel: 'minimal', centerEffects: false }
        }
    }
}));

// Mock position zones
const createMockZones = () => {
    const zones = new Map();
    
    // Add center zones
    zones.set('center', { id: 'center', type: 'center', weight: 1.0 });
    zones.set('center-top', { id: 'center-top', type: 'center', weight: 1.0 });
    
    // Add edge zones
    zones.set('edge-top', { id: 'edge-top', type: 'edge', weight: 1.0 });
    zones.set('edge-bottom', { id: 'edge-bottom', type: 'edge', weight: 1.0 });
    
    // Add transition zones
    zones.set('transition-top-left', { id: 'transition-top-left', type: 'transition', weight: 1.0 });
    zones.set('transition-bottom-right', { id: 'transition-bottom-right', type: 'transition', weight: 1.0 });
    
    return zones;
};

describe('Performance Tier Integration', () => {
    let tierIntegration;
    let mockZones;
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockZones = createMockZones();
        tierIntegration = new PerformanceTierIntegration();
    });
    
    afterEach(() => {
        vi.restoreAllMocks();
    });
    
    describe('Tier detection and configuration', () => {
        it('should detect the current performance tier', () => {
            expect(tierIntegration.getCurrentTier()).toBe('medium');
            expect(AnimationGuardian.detectPerformanceTier).toHaveBeenCalled();
        });
        
        it('should provide tier-specific configuration', () => {
            const config = tierIntegration.getCurrentConfig();
            expect(config).toBeDefined();
            expect(config.distributionStrategy).toBe('balanced');
            expect(config.centerTraversalEnabled).toBe(true);
            expect(config.maxActiveFragments).toBe(20);
        });
        
        it('should allow manual tier setting', () => {
            tierIntegration.setTier('low');
            expect(tierIntegration.getCurrentTier()).toBe('low');
            
            const config = tierIntegration.getCurrentConfig();
            expect(config.distributionStrategy).toBe('edge-only');
            expect(config.centerTraversalEnabled).toBe(false);
        });
    });
    
    describe('Zone weight management', () => {
        it('should update zone weights based on performance tier', () => {
            // Set to high tier
            tierIntegration.setTier('high');
            tierIntegration.updateZoneWeights(mockZones);
            
            // Check high tier weights
            expect(mockZones.get('center').weight).toBe(tierIntegration.getCurrentConfig().centerZoneWeight);
            expect(mockZones.get('edge-top').weight).toBe(tierIntegration.getCurrentConfig().edgeZoneWeight);
            
            // Set to low tier
            tierIntegration.setTier('low');
            tierIntegration.updateZoneWeights(mockZones);
            
            // Check low tier weights - should favor edges
            expect(mockZones.get('center').weight).toBe(0.5); // Low weight for center
            expect(mockZones.get('edge-top').weight).toBe(1.5); // High weight for edges
        });
    });
    
    describe('Distribution strategy selection', () => {
        it('should provide tier-appropriate distribution strategy', () => {
            tierIntegration.setTier('high');
            expect(tierIntegration.getDistributionStrategy()).toBe('organic');
            
            tierIntegration.setTier('medium');
            expect(tierIntegration.getDistributionStrategy()).toBe('balanced');
            
            tierIntegration.setTier('low');
            expect(tierIntegration.getDistributionStrategy()).toBe('edge-only');
        });
        
        it('should control center traversal based on tier', () => {
            tierIntegration.setTier('high');
            expect(tierIntegration.isCenterTraversalEnabled()).toBe(true);
            
            tierIntegration.setTier('low');
            expect(tierIntegration.isCenterTraversalEnabled()).toBe(false);
        });
    });
    
    describe('Path complexity management', () => {
        it('should limit waypoints based on tier', () => {
            tierIntegration.setTier('high');
            expect(tierIntegration.getMaxWaypoints()).toBe(8);
            
            tierIntegration.setTier('medium');
            expect(tierIntegration.getMaxWaypoints()).toBe(5);
            
            tierIntegration.setTier('low');
            expect(tierIntegration.getMaxWaypoints()).toBe(2);
        });
        
        it('should control complex path usage based on tier', () => {
            tierIntegration.setTier('high');
            expect(tierIntegration.useComplexPaths()).toBe(true);
            
            tierIntegration.setTier('low');
            expect(tierIntegration.useComplexPaths()).toBe(false);
        });
    });
    
    describe('Performance monitoring', () => {
        it('should detect when fragment count exceeds tier limit', () => {
            tierIntegration.setTier('medium');
            const maxFragments = tierIntegration.getMaxActiveFragments();
            
            // Should return false when under limit
            expect(tierIntegration.monitorPerformance(60, maxFragments - 1)).toBe(false);
            
            // Should return true when over limit
            expect(tierIntegration.monitorPerformance(60, maxFragments + 5)).toBe(true);
        });
        
        it('should degrade tier after sustained poor performance', () => {
            tierIntegration.setTier('high');
            
            // Mock the lastCheckTime to ensure checks happen
            tierIntegration.monitoringState.lastCheckTime = 0;
            
            // Set degradation count to trigger tier change on next check
            tierIntegration.monitoringState.degradationCount = 2;
            
            // Simulate poor performance to trigger degradation
            tierIntegration.monitorPerformance(20, 10);
            
            // Should have degraded from high to medium
            expect(tierIntegration.getCurrentTier()).toBe('medium');
            
            // Reset degradation count to trigger tier change on next check
            tierIntegration.monitoringState.degradationCount = 2;
            
            // Simulate poor performance to trigger degradation
            tierIntegration.monitorPerformance(15, 10);
            
            // Should have degraded from medium to low
            expect(tierIntegration.getCurrentTier()).toBe('low');
        });
        
        it('should upgrade tier after sustained good performance', () => {
            tierIntegration.setTier('low');
            
            // Mock the lastCheckTime to ensure checks happen
            tierIntegration.monitoringState.lastCheckTime = 0;
            
            // Set upgrade count to trigger tier change on next check
            tierIntegration.monitoringState.upgradeCount = 4;
            
            // Simulate good performance to trigger upgrade
            tierIntegration.monitorPerformance(60, 5);
            
            // Should have upgraded from low to medium
            expect(tierIntegration.getCurrentTier()).toBe('medium');
            
            // Reset upgrade count to trigger tier change on next check
            tierIntegration.monitoringState.upgradeCount = 4;
            
            // Simulate good performance to trigger upgrade
            tierIntegration.monitorPerformance(60, 5);
            
            // Should have upgraded from medium to high
            expect(tierIntegration.getCurrentTier()).toBe('high');
        });
    });
    
    describe('AnimationGuardian integration', () => {
        it('should update AnimationGuardian settings when tier changes', () => {
            // Set to low tier
            tierIntegration.setTier('low');
            
            // Check that AnimationGuardian settings were updated
            expect(AnimationGuardian.performanceTiers.low.centerEffects).toBe(false);
            expect(AnimationGuardian.performanceTiers.low.maxWaypoints).toBe(2);
            
            // Set to high tier
            tierIntegration.setTier('high');
            
            // Check that AnimationGuardian settings were updated
            expect(AnimationGuardian.performanceTiers.high.centerEffects).toBe(true);
            expect(AnimationGuardian.performanceTiers.high.maxWaypoints).toBe(8);
        });
    });
});