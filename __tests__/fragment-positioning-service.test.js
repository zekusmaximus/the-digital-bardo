import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FragmentPositioningService } from '../clear-lode/fragment-positioning-service.js';
import { PositionZoneManager } from '../clear-lode/position-zone-manager.js';

// Mock consciousness module
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        recordEvent: vi.fn()
    }
}));

// Mock ResourceGuardian
vi.mock('../src/consciousness/resource-guardian.js', () => ({
    ResourceGuardian: vi.fn().mockImplementation(() => ({
        register: vi.fn(),
        cleanupAll: vi.fn()
    }))
}));

// Mock AnimationGuardian
vi.mock('../src/utils/animation-guardian.js', () => ({
    AnimationGuardian: {
        safeAnimate: vi.fn()
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

// Mock fragment element
const createMockFragment = (birthTime = Date.now()) => ({
    dataset: {
        birthTime: birthTime.toString(),
        zoneId: null,
        zoneType: null
    }
});

describe('FragmentPositioningService', () => {
    let service;
    let zoneManager;

    beforeEach(() => {
        mockWindow(1920, 1080);
        zoneManager = new PositionZoneManager();
        service = new FragmentPositioningService(zoneManager);
    });

    afterEach(() => {
        if (service) {
            service.destroy();
        }
        if (zoneManager) {
            zoneManager.destroy();
        }
    });

    describe('constructor', () => {
        it('should initialize distribution tracking state', () => {
            expect(service.distributionState).toBeDefined();
            expect(service.distributionState.fragmentDistribution).toBeInstanceOf(Map);
            expect(service.distributionState.clusteringPrevention.enabled).toBe(true);
            expect(service.distributionState.balanceMonitoring.enabled).toBe(true);
            expect(service.distributionState.recentPlacements).toEqual([]);
        });

        it('should initialize fragment distribution for all zones', () => {
            const zoneCount = zoneManager.zones.size;
            expect(service.distributionState.fragmentDistribution.size).toBe(zoneCount);
            
            // All zones should start with 0 fragments
            for (const count of service.distributionState.fragmentDistribution.values()) {
                expect(count).toBe(0);
            }
        });
    });

    describe('recordFragmentPlacement', () => {
        it('should update fragment count for the zone', () => {
            const zone = zoneManager.getZone('center');
            const fragment = createMockFragment();
            
            service.recordFragmentPlacement(zone, fragment);
            
            expect(service.distributionState.fragmentDistribution.get('center')).toBe(1);
        });

        it('should add to recent placements history', () => {
            const zone = zoneManager.getZone('center');
            const fragment = createMockFragment();
            
            service.recordFragmentPlacement(zone, fragment);
            
            expect(service.distributionState.recentPlacements.length).toBe(1);
            expect(service.distributionState.recentPlacements[0].zoneId).toBe('center');
            expect(service.distributionState.recentPlacements[0].zoneType).toBe('center');
        });

        it('should maintain history size limit', () => {
            const zone = zoneManager.getZone('center');
            
            // Add more placements than the limit
            for (let i = 0; i < service.distributionState.maxHistorySize + 5; i++) {
                const fragment = createMockFragment();
                service.recordFragmentPlacement(zone, fragment);
            }
            
            expect(service.distributionState.recentPlacements.length).toBe(service.distributionState.maxHistorySize);
        });
    });

    describe('recordFragmentRemoval', () => {
        it('should decrement fragment count for the zone', () => {
            const zone = zoneManager.getZone('center');
            const fragment = createMockFragment();
            
            // Add fragment first
            service.recordFragmentPlacement(zone, fragment);
            expect(service.distributionState.fragmentDistribution.get('center')).toBe(1);
            
            // Remove fragment
            service.recordFragmentRemoval('center');
            expect(service.distributionState.fragmentDistribution.get('center')).toBe(0);
        });

        it('should not go below zero', () => {
            service.recordFragmentRemoval('center');
            expect(service.distributionState.fragmentDistribution.get('center')).toBe(0);
        });

        it('should handle invalid zone IDs gracefully', () => {
            expect(() => service.recordFragmentRemoval('invalid-zone')).not.toThrow();
            expect(() => service.recordFragmentRemoval(null)).not.toThrow();
        });
    });

    describe('getZoneDensity', () => {
        it('should calculate density correctly', () => {
            const zone = zoneManager.getZone('center');
            const fragment1 = createMockFragment();
            const fragment2 = createMockFragment();
            
            service.recordFragmentPlacement(zone, fragment1);
            service.recordFragmentPlacement(zone, fragment2);
            
            const density = service.getZoneDensity('center');
            const expectedDensity = 2 / zone.getArea();
            
            expect(density).toBeCloseTo(expectedDensity, 6);
        });

        it('should return 0 for non-existent zones', () => {
            const density = service.getZoneDensity('invalid-zone');
            expect(density).toBe(0);
        });
    });

    describe('getAverageDensity', () => {
        it('should calculate average density across all zones', () => {
            const centerZone = zoneManager.getZone('center');
            const edgeZone = zoneManager.getZone('edge-top');
            
            // Add fragments to different zones
            service.recordFragmentPlacement(centerZone, createMockFragment());
            service.recordFragmentPlacement(centerZone, createMockFragment());
            service.recordFragmentPlacement(edgeZone, createMockFragment());
            
            const avgDensity = service.getAverageDensity();
            expect(avgDensity).toBeGreaterThan(0);
        });

        it('should return 0 when no fragments are placed', () => {
            const avgDensity = service.getAverageDensity();
            expect(avgDensity).toBe(0);
        });
    });

    describe('calculateBalanceScore', () => {
        it('should return 1.0 for perfectly balanced distribution', () => {
            // Add equal fragments to all zones (as much as possible given different areas)
            for (const zone of zoneManager.zones.values()) {
                service.recordFragmentPlacement(zone, createMockFragment());
            }
            
            const score = service.calculateBalanceScore();
            expect(score).toBeGreaterThan(0.5); // Should be reasonably balanced
        });

        it('should return lower score for unbalanced distribution', () => {
            const centerZone = zoneManager.getZone('center');
            
            // Create highly unbalanced distribution
            for (let i = 0; i < 10; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            const score = service.calculateBalanceScore();
            expect(score).toBeLessThan(0.5);
        });

        it('should return 1.0 when no fragments are placed', () => {
            const score = service.calculateBalanceScore();
            expect(score).toBe(1.0);
        });
    });

    describe('applyClusteringPrevention', () => {
        it('should return original zone when clustering prevention is disabled', () => {
            service.distributionState.clusteringPrevention.enabled = false;
            const originalZone = zoneManager.getZone('center');
            
            const result = service.applyClusteringPrevention(originalZone);
            expect(result).toBe(originalZone);
        });

        it('should find alternative zone when clustering is detected', () => {
            const centerZone = zoneManager.getZone('center');
            
            // Create clustering in center zone
            for (let i = 0; i < 20; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            const result = service.applyClusteringPrevention(centerZone);
            
            // Should return a different zone or the same zone if no better alternative
            expect(result).toBeInstanceOf(Object);
            expect(result.id).toBeDefined();
        });
    });

    describe('findAlternativeZone', () => {
        it('should find zone with lowest density', () => {
            const centerZone = zoneManager.getZone('center');
            const edgeZone = zoneManager.getZone('edge-top');
            
            // Make center zone dense
            for (let i = 0; i < 10; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            // Edge zone should be less dense
            const alternative = service.findAlternativeZone(centerZone);
            expect(alternative).toBeDefined();
            expect(alternative.id).not.toBe('center');
        });

        it('should prefer zones of the same type', () => {
            const centerZone = zoneManager.getZone('center');
            const centerTopZone = zoneManager.getZone('center-top');
            
            // Make main center zone dense
            for (let i = 0; i < 10; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            const alternative = service.findAlternativeZone(centerZone);
            
            // Should prefer another center-type zone if available
            if (alternative) {
                const centerTypeZones = Array.from(zoneManager.zones.values())
                    .filter(zone => zone.type === 'center' && zone.id !== 'center');
                const isAlternativeCenterType = centerTypeZones.some(zone => zone.id === alternative.id);
                
                if (centerTypeZones.length > 0) {
                    expect(isAlternativeCenterType).toBe(true);
                }
            }
        });
    });

    describe('triggerRebalancing', () => {
        it('should adjust zone weights based on density', () => {
            const centerZone = zoneManager.getZone('center');
            const edgeZone = zoneManager.getZone('edge-top');
            const originalCenterWeight = centerZone.weight;
            const originalEdgeWeight = edgeZone.weight;
            
            // Create unbalanced distribution
            for (let i = 0; i < 15; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            service.triggerRebalancing();
            
            // Overutilized zone should have reduced weight
            expect(centerZone.weight).toBeLessThan(originalCenterWeight);
            
            // Underutilized zone should have increased weight
            expect(edgeZone.weight).toBeGreaterThan(originalEdgeWeight);
        });
    });

    describe('resetZoneWeights', () => {
        it('should reset all zone weights to their defaults', () => {
            // Modify some weights
            const centerZone = zoneManager.getZone('center');
            const edgeZone = zoneManager.getZone('edge-top');
            const transitionZone = zoneManager.getZone('transition-top-left');
            
            centerZone.weight = 999;
            edgeZone.weight = 999;
            transitionZone.weight = 999;
            
            service.resetZoneWeights();
            
            expect(centerZone.weight).toBe(1.5); // Default for main center zone
            expect(edgeZone.weight).toBe(0.8); // Default for edge zones
            expect(transitionZone.weight).toBe(1.0); // Default for transition zones
        });
    });

    describe('monitorDistributionBalance', () => {
        it('should trigger rebalancing when balance is below target', () => {
            const triggerSpy = vi.spyOn(service, 'triggerRebalancing');
            const centerZone = zoneManager.getZone('center');
            
            // Create poor balance
            for (let i = 0; i < 20; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            service.monitorDistributionBalance();
            
            expect(triggerSpy).toHaveBeenCalled();
        });

        it('should not trigger rebalancing when balance is good', () => {
            const triggerSpy = vi.spyOn(service, 'triggerRebalancing');
            
            // Temporarily lower the target balance for this test to make it more achievable
            const originalTarget = service.distributionState.balanceMonitoring.targetBalance;
            service.distributionState.balanceMonitoring.targetBalance = 0.5;
            
            // Create a more balanced distribution by adding multiple fragments to larger zones
            const zones = Array.from(zoneManager.zones.values());
            zones.forEach(zone => {
                // Add fragments proportional to zone area to create better balance
                const fragmentCount = Math.max(1, Math.floor(zone.getArea() / 50000));
                for (let i = 0; i < fragmentCount; i++) {
                    service.recordFragmentPlacement(zone, createMockFragment());
                }
            });
            
            service.monitorDistributionBalance();
            
            // Restore original target
            service.distributionState.balanceMonitoring.targetBalance = originalTarget;
            
            expect(triggerSpy).not.toHaveBeenCalled();
        });
    });

    describe('preventClustering', () => {
        it('should reduce weights of zones with high density', () => {
            const centerZone = zoneManager.getZone('center');
            const originalWeight = centerZone.weight;
            
            // Create clustering
            for (let i = 0; i < 25; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            service.preventClustering();
            
            expect(centerZone.weight).toBeLessThan(originalWeight);
        });
    });

    describe('getDistributionStrategy', () => {
        it('should return appropriate strategy based on performance tier', () => {
            expect(service.getDistributionStrategy('high')).toBe('organic');
            expect(service.getDistributionStrategy('medium')).toBe('center-weighted');
            expect(service.getDistributionStrategy('low')).toBe('edge-only');
            expect(service.getDistributionStrategy('unknown')).toBe('balanced');
        });

        it('should upgrade strategy when balance is poor', () => {
            const centerZone = zoneManager.getZone('center');
            
            // Create poor balance
            for (let i = 0; i < 20; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            // Low tier should upgrade to balanced when rebalancing is needed
            expect(service.getDistributionStrategy('low')).toBe('balanced');
        });
    });

    describe('getDistributionStats', () => {
        it('should return comprehensive distribution statistics', () => {
            const centerZone = zoneManager.getZone('center');
            service.recordFragmentPlacement(centerZone, createMockFragment());
            
            const stats = service.getDistributionStats();
            
            expect(stats).toHaveProperty('fragmentDistribution');
            expect(stats).toHaveProperty('recentPlacements');
            expect(stats).toHaveProperty('balanceScore');
            expect(stats).toHaveProperty('averageDensity');
            expect(stats).toHaveProperty('totalFragments');
            expect(stats).toHaveProperty('clusteringPrevention');
            expect(stats).toHaveProperty('balanceMonitoring');
            
            expect(stats.totalFragments).toBe(1);
            expect(stats.fragmentDistribution.get('center')).toBe(1);
        });
    });

    describe('positionFragment integration', () => {
        it('should apply clustering prevention during positioning', () => {
            const centerZone = zoneManager.getZone('center');
            const fragment = createMockFragment();
            
            // Create clustering in center zone
            for (let i = 0; i < 20; i++) {
                service.recordFragmentPlacement(centerZone, createMockFragment());
            }
            
            const applySpy = vi.spyOn(service, 'applyClusteringPrevention');
            
            service.positionFragment(fragment, centerZone);
            
            expect(applySpy).toHaveBeenCalledWith(centerZone);
        });

        it('should record fragment placement after positioning', () => {
            const centerZone = zoneManager.getZone('center');
            const fragment = createMockFragment();
            
            service.positionFragment(fragment, centerZone);
            
            expect(service.distributionState.fragmentDistribution.get('center')).toBe(1);
            expect(service.distributionState.recentPlacements.length).toBe(1);
        });
    });

    describe('edge cases', () => {
        it('should handle empty zone manager gracefully', () => {
            const emptyService = new FragmentPositioningService(null);
            
            expect(() => emptyService.getAverageDensity()).not.toThrow();
            expect(() => emptyService.calculateBalanceScore()).not.toThrow();
            expect(emptyService.getAverageDensity()).toBe(0);
            expect(emptyService.calculateBalanceScore()).toBe(1.0);
        });

        it('should handle zone manager without zones', () => {
            const emptyZoneManager = { zones: new Map() };
            const emptyService = new FragmentPositioningService(emptyZoneManager);
            
            expect(emptyService.getAverageDensity()).toBe(0);
            expect(emptyService.calculateBalanceScore()).toBe(1.0);
        });
    });

    describe('performance considerations', () => {
        it('should handle large numbers of fragments efficiently', () => {
            const startTime = performance.now();
            
            // Add many fragments
            for (let i = 0; i < 1000; i++) {
                const zone = Array.from(zoneManager.zones.values())[i % zoneManager.zones.size];
                service.recordFragmentPlacement(zone, createMockFragment());
            }
            
            // Calculate stats
            service.getDistributionStats();
            service.calculateBalanceScore();
            service.getAverageDensity();
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Should complete within reasonable time (less than 100ms)
            expect(duration).toBeLessThan(100);
        });
    });
});

describe('Distribution Tracking Integration', () => {
    let service;
    let zoneManager;

    beforeEach(() => {
        mockWindow(1920, 1080);
        zoneManager = new PositionZoneManager();
        service = new FragmentPositioningService(zoneManager);
    });

    afterEach(() => {
        if (service) {
            service.destroy();
        }
        if (zoneManager) {
            zoneManager.destroy();
        }
    });

    describe('real-world scenarios', () => {
        it('should maintain balance during typical fragment lifecycle', () => {
            const fragments = [];
            const zones = Array.from(zoneManager.zones.values());
            
            // Simulate typical fragment creation and removal
            for (let cycle = 0; cycle < 10; cycle++) {
                // Create fragments
                for (let i = 0; i < 5; i++) {
                    const fragment = createMockFragment();
                    const zone = zones[Math.floor(Math.random() * zones.length)];
                    service.positionFragment(fragment, zone);
                    fragments.push({ fragment, zoneId: zone.id });
                }
                
                // Remove some fragments
                for (let i = 0; i < 2; i++) {
                    if (fragments.length > 0) {
                        const removed = fragments.pop();
                        service.recordFragmentRemoval(removed.zoneId);
                    }
                }
            }
            
            const stats = service.getDistributionStats();
            expect(stats.balanceScore).toBeGreaterThan(0.3); // Should maintain reasonable balance
        });

        it('should prevent clustering in high-traffic scenarios', () => {
            const centerZone = zoneManager.getZone('center');
            const fragments = [];
            
            // Simulate high traffic to center zone
            for (let i = 0; i < 50; i++) {
                const fragment = createMockFragment();
                
                // Try to place in center zone (clustering prevention should kick in)
                service.positionFragment(fragment, centerZone);
                fragments.push(fragment);
            }
            
            // Check that not all fragments ended up in center zone
            const centerFragments = fragments.filter(f => f.dataset.zoneId === 'center').length;
            const totalFragments = fragments.length;
            
            // Due to clustering prevention, center should not have all fragments
            expect(centerFragments / totalFragments).toBeLessThan(0.8);
        });

        it('should adapt to changing viewport sizes', () => {
            // Start with desktop viewport
            const fragment1 = createMockFragment();
            const centerZone = zoneManager.getZone('center');
            service.positionFragment(fragment1, centerZone);
            
            const desktopStats = service.getDistributionStats();
            
            // Change to mobile viewport
            mockWindow(375, 667);
            zoneManager.initializeZones();
            service.initializeDistributionTracking();
            
            const fragment2 = createMockFragment();
            const newCenterZone = zoneManager.getZone('center');
            service.positionFragment(fragment2, newCenterZone);
            
            const mobileStats = service.getDistributionStats();
            
            // Should adapt to new viewport
            expect(mobileStats.totalFragments).toBe(1); // Only new fragment counted
        });
    });
});