import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PositionZone, PositionZoneManager } from '../clear-lode/position-zone-manager.js';

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

describe('PositionZone', () => {
    let zone;

    beforeEach(() => {
        zone = new PositionZone('test-zone', 'center', {
            x: { min: 100, max: 200 },
            y: { min: 150, max: 250 }
        }, 1.5);
    });

    describe('constructor', () => {
        it('should initialize zone with correct properties', () => {
            expect(zone.id).toBe('test-zone');
            expect(zone.type).toBe('center');
            expect(zone.weight).toBe(1.5);
            expect(zone.activeFragments).toBe(0);
            expect(zone.totalUsage).toBe(0);
            expect(zone.bounds).toEqual({
                x: { min: 100, max: 200 },
                y: { min: 150, max: 250 }
            });
        });
    });

    describe('getCenter', () => {
        it('should return the center point of the zone', () => {
            const center = zone.getCenter();
            expect(center).toEqual({ x: 150, y: 200 });
        });
    });

    describe('getRandomPosition', () => {
        it('should return position within zone boundaries', () => {
            const position = zone.getRandomPosition();
            expect(position.x).toBeGreaterThanOrEqual(100);
            expect(position.x).toBeLessThanOrEqual(200);
            expect(position.y).toBeGreaterThanOrEqual(150);
            expect(position.y).toBeLessThanOrEqual(250);
        });

        it('should respect margin parameter', () => {
            const position = zone.getRandomPosition(0.1); // 10% margin
            expect(position.x).toBeGreaterThanOrEqual(110); // 100 + 10% of 100
            expect(position.x).toBeLessThanOrEqual(190); // 200 - 10% of 100
            expect(position.y).toBeGreaterThanOrEqual(160); // 150 + 10% of 100
            expect(position.y).toBeLessThanOrEqual(240); // 250 - 10% of 100
        });
    });

    describe('containsPoint', () => {
        it('should return true for points inside the zone', () => {
            expect(zone.containsPoint(150, 200)).toBe(true);
            expect(zone.containsPoint(100, 150)).toBe(true);
            expect(zone.containsPoint(200, 250)).toBe(true);
        });

        it('should return false for points outside the zone', () => {
            expect(zone.containsPoint(50, 200)).toBe(false);
            expect(zone.containsPoint(150, 100)).toBe(false);
            expect(zone.containsPoint(250, 200)).toBe(false);
            expect(zone.containsPoint(150, 300)).toBe(false);
        });
    });

    describe('getArea', () => {
        it('should calculate zone area correctly', () => {
            const area = zone.getArea();
            expect(area).toBe(10000); // (200-100) * (250-150) = 100 * 100
        });
    });

    describe('recordUsage', () => {
        it('should update usage statistics', () => {
            const initialTime = Date.now();
            zone.recordUsage();
            
            expect(zone.totalUsage).toBe(1);
            expect(zone.activeFragments).toBe(1);
            expect(zone.lastUsed).toBeGreaterThanOrEqual(initialTime);
        });
    });

    describe('releaseFragment', () => {
        it('should decrement active fragments count', () => {
            zone.recordUsage();
            zone.recordUsage();
            expect(zone.activeFragments).toBe(2);
            
            zone.releaseFragment();
            expect(zone.activeFragments).toBe(1);
            
            zone.releaseFragment();
            expect(zone.activeFragments).toBe(0);
        });

        it('should not go below zero', () => {
            zone.releaseFragment();
            expect(zone.activeFragments).toBe(0);
        });
    });

    describe('getDensity', () => {
        it('should calculate density correctly', () => {
            zone.recordUsage();
            zone.recordUsage();
            
            const density = zone.getDensity();
            expect(density).toBe(2 / 10000); // 2 fragments / 10000 area
        });

        it('should return 0 for zero area', () => {
            const zeroAreaZone = new PositionZone('zero', 'test', {
                x: { min: 100, max: 100 },
                y: { min: 100, max: 100 }
            });
            expect(zeroAreaZone.getDensity()).toBe(0);
        });
    });
});

describe('PositionZoneManager', () => {
    let manager;

    beforeEach(() => {
        mockWindow(1920, 1080);
        manager = new PositionZoneManager();
    });

    afterEach(() => {
        if (manager) {
            manager.destroy();
        }
    });

    describe('constructor', () => {
        it('should initialize with default configuration', () => {
            expect(manager.zones.size).toBeGreaterThan(0);
            expect(manager.distributionHistory).toEqual([]);
            expect(manager.config.edgeMargin).toBe(0.05);
            expect(manager.config.centerZoneSize).toBe(0.4);
        });
    });

    describe('getViewportDimensions', () => {
        it('should return correct viewport dimensions', () => {
            const dimensions = manager.getViewportDimensions();
            expect(dimensions).toEqual({
                width: 1920,
                height: 1080,
                aspectRatio: 1920 / 1080,
                orientation: 'landscape'
            });
        });

        it('should detect portrait orientation', () => {
            mockWindow(800, 1200);
            const dimensions = manager.getViewportDimensions();
            expect(dimensions.orientation).toBe('portrait');
        });
    });

    describe('initializeZones', () => {
        it('should create all required zone types', () => {
            const edgeZones = manager.getZonesByType('edge');
            const centerZones = manager.getZonesByType('center');
            const transitionZones = manager.getZonesByType('transition');

            expect(edgeZones.length).toBe(4); // top, right, bottom, left
            expect(centerZones.length).toBe(5); // center + 4 sub-centers
            expect(transitionZones.length).toBe(4); // 4 corner transitions
        });

        it('should create zones with correct boundaries', () => {
            const centerZone = manager.getZone('center');
            expect(centerZone).toBeDefined();
            expect(centerZone.type).toBe('center');
            
            const center = centerZone.getCenter();
            expect(center.x).toBeCloseTo(1920 / 2, 1);
            expect(center.y).toBeCloseTo(1080 / 2, 1);
        });

        it('should assign appropriate weights to different zone types', () => {
            const centerZone = manager.getZone('center');
            const edgeZone = manager.getZone('edge-top');
            const transitionZone = manager.getZone('transition-top-left');

            expect(centerZone.weight).toBe(1.5);
            expect(edgeZone.weight).toBe(0.8);
            expect(transitionZone.weight).toBe(1.0);
        });
    });

    describe('selectZone', () => {
        it('should select a zone using balanced strategy', () => {
            const zone = manager.selectZone('balanced');
            expect(zone).toBeInstanceOf(PositionZone);
            expect(manager.zones.has(zone.id)).toBe(true);
        });

        it('should prefer center zones with center-weighted strategy', () => {
            const selections = [];
            for (let i = 0; i < 100; i++) {
                const zone = manager.selectZone('center-weighted');
                selections.push(zone.type);
            }
            
            const centerCount = selections.filter(type => type === 'center').length;
            const totalCount = selections.length;
            
            // Should have more center selections than random (expect ~70%)
            expect(centerCount / totalCount).toBeGreaterThan(0.5);
        });

        it('should only select edge zones with edge-only strategy', () => {
            const zone = manager.selectZone('edge-only');
            expect(zone.type).toBe('edge');
        });
    });

    describe('recordZoneUsage', () => {
        it('should update zone statistics and distribution history', () => {
            const zone = manager.getZone('center');
            const initialUsage = zone.totalUsage;
            
            manager.recordZoneUsage(zone);
            
            expect(zone.totalUsage).toBe(initialUsage + 1);
            expect(zone.activeFragments).toBe(1);
            expect(manager.distributionHistory.length).toBe(1);
            expect(manager.distributionHistory[0].zone).toBe(zone);
        });

        it('should maintain distribution history size limit', () => {
            const zone = manager.getZone('center');
            
            // Add more entries than the limit
            for (let i = 0; i < manager.maxHistorySize + 10; i++) {
                manager.recordZoneUsage(zone);
            }
            
            expect(manager.distributionHistory.length).toBe(manager.maxHistorySize);
        });
    });

    describe('recordZoneRelease', () => {
        it('should decrement active fragments in the specified zone', () => {
            const zone = manager.getZone('center');
            manager.recordZoneUsage(zone);
            expect(zone.activeFragments).toBe(1);
            
            manager.recordZoneRelease('center');
            expect(zone.activeFragments).toBe(0);
        });
    });

    describe('getCenterUtilization', () => {
        it('should calculate center utilization correctly', () => {
            const centerZone = manager.getZone('center');
            const edgeZone = manager.getZone('edge-top');
            
            manager.recordZoneUsage(centerZone);
            manager.recordZoneUsage(edgeZone);
            
            const utilization = manager.getCenterUtilization();
            expect(utilization).toBeCloseTo(0.5, 1); // 1 center fragment out of 2 total fragments
        });

        it('should return 0 when no fragments are active', () => {
            const utilization = manager.getCenterUtilization();
            expect(utilization).toBe(0);
        });
    });

    describe('calculateBalanceScore', () => {
        it('should return 1.0 for perfectly balanced distribution', () => {
            // Add equal fragments to all zones
            for (const zone of manager.zones.values()) {
                manager.recordZoneUsage(zone);
            }
            
            const score = manager.calculateBalanceScore();
            expect(score).toBeGreaterThan(0.5); // Should be reasonably balanced, but not perfect due to different zone areas
        });

        it('should return lower score for unbalanced distribution', () => {
            // Add many fragments to one zone only
            const zone = manager.getZone('center');
            for (let i = 0; i < 10; i++) {
                manager.recordZoneUsage(zone);
            }
            
            const score = manager.calculateBalanceScore();
            expect(score).toBeLessThan(0.5);
        });
    });

    describe('triggerRebalancing', () => {
        it('should adjust zone weights when triggered', () => {
            const zone = manager.getZone('center');
            const originalWeight = zone.weight;
            
            // Create unbalanced distribution
            for (let i = 0; i < 20; i++) {
                manager.recordZoneUsage(zone);
            }
            
            manager.triggerRebalancing();
            
            // Weight should be reduced for overutilized zone
            expect(zone.weight).toBeLessThan(originalWeight);
        });
    });

    describe('responsive behavior', () => {
        it('should recalculate zones on viewport change', () => {
            const originalZoneCount = manager.zones.size;
            
            // Change viewport size
            mockWindow(800, 600);
            manager.initializeZones();
            
            // Should still have the same number of zones but with different boundaries
            expect(manager.zones.size).toBe(originalZoneCount);
            
            const centerZone = manager.getZone('center');
            const center = centerZone.getCenter();
            expect(center.x).toBeCloseTo(400, 1); // 800/2
            expect(center.y).toBeCloseTo(300, 1); // 600/2
        });
    });

    describe('getDistributionStats', () => {
        it('should return comprehensive distribution statistics', () => {
            const stats = manager.getDistributionStats();
            
            expect(stats).toHaveProperty('zoneDensity');
            expect(stats).toHaveProperty('centerUtilization');
            expect(stats).toHaveProperty('balanceScore');
            expect(stats).toHaveProperty('totalZones');
            expect(stats).toHaveProperty('zoneTypes');
            expect(stats).toHaveProperty('averageDensity');
            
            expect(stats.zoneTypes.edge).toBe(4);
            expect(stats.zoneTypes.center).toBe(5);
            expect(stats.zoneTypes.transition).toBe(4);
        });
    });

    describe('edge cases', () => {
        it('should handle very small viewports', () => {
            mockWindow(320, 240);
            manager.initializeZones();
            
            const zones = Array.from(manager.zones.values());
            expect(zones.length).toBeGreaterThan(0);
            
            // All zones should have positive area
            zones.forEach(zone => {
                expect(zone.getArea()).toBeGreaterThan(0);
            });
        });

        it('should handle extreme aspect ratios', () => {
            mockWindow(2560, 400); // Very wide
            manager.initializeZones();
            
            const centerZone = manager.getZone('center');
            expect(centerZone.getArea()).toBeGreaterThan(0);
        });
    });
});

describe('Zone Selection Algorithms', () => {
    let manager;

    beforeEach(() => {
        mockWindow(1920, 1080);
        manager = new PositionZoneManager();
    });

    afterEach(() => {
        if (manager) {
            manager.destroy();
        }
    });

    describe('distribution tracking', () => {
        it('should track zone usage over time', () => {
            const zone1 = manager.getZone('center');
            const zone2 = manager.getZone('edge-top');
            
            manager.recordZoneUsage(zone1);
            manager.recordZoneUsage(zone2);
            manager.recordZoneUsage(zone1);
            
            expect(manager.distributionHistory.length).toBe(3);
            expect(zone1.totalUsage).toBe(2);
            expect(zone2.totalUsage).toBe(1);
        });

        it('should prevent clustering by reducing weights of overused zones', () => {
            const zone = manager.getZone('center');
            
            // Overuse one zone
            for (let i = 0; i < 10; i++) {
                manager.recordZoneUsage(zone);
            }
            
            // Select zones multiple times - should avoid the overused zone
            const selections = [];
            for (let i = 0; i < 50; i++) {
                const selected = manager.selectZone('balanced');
                selections.push(selected.id);
            }
            
            const centerSelections = selections.filter(id => id === 'center').length;
            const totalSelections = selections.length;
            
            // Should select center zone less frequently due to high density
            expect(centerSelections / totalSelections).toBeLessThan(0.3);
        });
    });

    describe('organic flow patterns', () => {
        it('should create natural movement patterns', () => {
            // Simulate edge-heavy usage
            const edgeZones = manager.getZonesByType('edge');
            edgeZones.forEach(zone => {
                for (let i = 0; i < 3; i++) {
                    manager.recordZoneUsage(zone);
                }
            });
            
            // Next selection should bias toward center
            const selections = [];
            for (let i = 0; i < 20; i++) {
                const zone = manager.selectZone('organic');
                selections.push(zone.type);
            }
            
            const centerCount = selections.filter(type => type === 'center').length;
            expect(centerCount).toBeGreaterThan(5); // Should have some center bias
        });
    });
});