import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FragmentPositionManager } from '../clear-lode/fragment-position-manager.js';

// Mock consciousness module
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        recordEvent: vi.fn()
    }
}));

// Mock ResourceGuardian
vi.mock('../src/consciousness/resource-guardian.js', () => ({
    ResourceGuardian: class {
        constructor() {
            this.cleanupFunctions = [];
        }
        registerCleanup(fn) {
            this.cleanupFunctions.push(fn);
        }
        cleanupAll() {
            this.cleanupFunctions.forEach(fn => fn());
            this.cleanupFunctions = [];
        }
    }
}));

describe('FragmentPositionManager', () => {
    let positionManager;
    let mockViewport;

    beforeEach(() => {
        // Mock window dimensions
        mockViewport = { width: 1024, height: 768 };
        Object.defineProperty(window, 'innerWidth', { value: mockViewport.width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: mockViewport.height, configurable: true });
        
        positionManager = new FragmentPositionManager();
    });

    afterEach(() => {
        if (positionManager) {
            positionManager.destroy();
        }
    });

    describe('Safe Zone Calculations', () => {
        it('should calculate safe zone boundaries correctly', () => {
            const safeZone = positionManager.calculateSafeZone();
            
            expect(safeZone.bounds.x.min).toBe(40); // marginLeft
            expect(safeZone.bounds.x.max).toBe(984); // width - marginRight
            expect(safeZone.bounds.y.min).toBe(60); // marginTop
            expect(safeZone.bounds.y.max).toBe(708); // height - marginBottom
        });

        it('should ensure minimum safe zone size', () => {
            // Test with very small viewport
            const smallViewport = { width: 300, height: 200 };
            const smallManager = new FragmentPositionManager(smallViewport);
            
            const safeZone = smallManager.calculateSafeZone();
            
            expect(safeZone.width).toBeGreaterThanOrEqual(200);
            expect(safeZone.height).toBeGreaterThanOrEqual(150);
            
            smallManager.destroy();
        });

        it('should calculate center point correctly', () => {
            const safeZone = positionManager.calculateSafeZone();
            
            expect(safeZone.center.x).toBe(512); // (40 + 984) / 2
            expect(safeZone.center.y).toBe(384); // (60 + 708) / 2
        });
    });

    describe('Speed Calculations', () => {
        it('should calculate optimal speed based on content length', () => {
            const shortText = 'Hi';
            const longText = 'This is a much longer piece of text that should move slower for readability';
            
            const shortSpeed = positionManager.calculateOptimalSpeed(shortText);
            const longSpeed = positionManager.calculateOptimalSpeed(longText);
            
            expect(longSpeed).toBeLessThan(shortSpeed);
            expect(shortSpeed).toBeLessThanOrEqual(120); // maxSpeed
            expect(longSpeed).toBeGreaterThanOrEqual(20); // minSpeed
        });

        it('should handle empty or invalid content', () => {
            expect(positionManager.calculateOptimalSpeed('')).toBe(20);
            expect(positionManager.calculateOptimalSpeed(null)).toBe(20);
            expect(positionManager.calculateOptimalSpeed(undefined)).toBe(20);
        });
    });

    describe('Readability Scoring', () => {
        let mockFragment;

        beforeEach(() => {
            mockFragment = {
                textContent: 'Test fragment content',
                parentNode: document.body,
                getBoundingClientRect: () => ({ left: 100, top: 100 })
            };
            
            // Mock getComputedStyle
            window.getComputedStyle = vi.fn(() => ({
                fontSize: '16px',
                opacity: '1'
            }));
        });

        it('should calculate readability score for fragments in safe zone', () => {
            const safePosition = { x: 500, y: 300 }; // Within safe zone
            const speed = 60;
            
            const score = positionManager.calculateReadabilityScore(mockFragment, safePosition, speed);
            
            expect(score).toBeGreaterThan(0.5);
            expect(score).toBeLessThanOrEqual(1.0);
        });

        it('should penalize fragments outside safe zone', () => {
            const unsafePosition = { x: 10, y: 10 }; // Outside safe zone
            const speed = 60;
            
            const score = positionManager.calculateReadabilityScore(mockFragment, unsafePosition, speed);
            
            expect(score).toBeLessThan(0.8); // Should be penalized
        });

        it('should penalize fragments with inappropriate speed', () => {
            const safePosition = { x: 500, y: 300 };
            const tooFastSpeed = 200; // Much faster than optimal
            
            const score = positionManager.calculateReadabilityScore(mockFragment, safePosition, tooFastSpeed);
            
            expect(score).toBeLessThan(0.9); // Should be penalized for speed
        });
    });

    describe('Fragment Validation', () => {
        let mockFragment;

        beforeEach(() => {
            mockFragment = {
                textContent: 'Test fragment',
                parentNode: document.body,
                getBoundingClientRect: () => ({ left: 500, top: 300 }),
                dataset: { speed: '60' }
            };
        });

        it('should validate fragments correctly', () => {
            const validation = positionManager.validateFragmentPlacement(mockFragment);
            
            expect(validation).toHaveProperty('isValid');
            expect(validation).toHaveProperty('score');
            expect(validation).toHaveProperty('issues');
            expect(validation).toHaveProperty('position');
            expect(validation).toHaveProperty('speed');
        });

        it('should identify fragments outside safe zone', () => {
            mockFragment.getBoundingClientRect = () => ({ left: 10, top: 10 });
            
            const validation = positionManager.validateFragmentPlacement(mockFragment);
            
            expect(validation.issues).toContain('Outside safe zone');
        });

        it('should identify fragments moving too fast', () => {
            mockFragment.dataset.speed = '300'; // Very fast
            
            const validation = positionManager.validateFragmentPlacement(mockFragment);
            
            expect(validation.issues).toContain('Moving too fast for content length');
        });
    });

    describe('Safe Position Generation', () => {
        it('should generate positions within safe zone', () => {
            for (let i = 0; i < 10; i++) {
                const position = positionManager.getSafePosition();
                
                expect(positionManager.isInSafeZone(position)).toBe(true);
            }
        });

        it('should respect preferred position if safe', () => {
            const preferredPosition = { x: 500, y: 300 }; // Safe position
            const position = positionManager.getSafePosition(preferredPosition);
            
            expect(position).toEqual(preferredPosition);
        });

        it('should adjust unsafe preferred positions', () => {
            const unsafePosition = { x: 10, y: 10 }; // Outside safe zone
            const position = positionManager.getSafePosition(unsafePosition);
            
            expect(positionManager.isInSafeZone(position)).toBe(true);
            expect(position).not.toEqual(unsafePosition);
        });
    });

    describe('Edge Detection', () => {
        it('should detect positions near viewport edges', () => {
            const nearLeftEdge = { x: 30, y: 300 };
            const nearTopEdge = { x: 500, y: 30 };
            const centerPosition = { x: 500, y: 300 };
            
            expect(positionManager.isNearEdge(nearLeftEdge)).toBe(true);
            expect(positionManager.isNearEdge(nearTopEdge)).toBe(true);
            expect(positionManager.isNearEdge(centerPosition)).toBe(false);
        });
    });

    describe('Performance Metrics', () => {
        it('should track performance statistics', () => {
            const stats = positionManager.getPerformanceStats();
            
            expect(stats).toHaveProperty('repositionCount');
            expect(stats).toHaveProperty('readabilityScores');
            expect(stats).toHaveProperty('averageReadability');
            expect(stats).toHaveProperty('safeZoneArea');
            expect(stats).toHaveProperty('viewportArea');
            expect(stats).toHaveProperty('safeZoneRatio');
        });

        it('should update readability metrics', () => {
            positionManager.updateReadabilityMetrics(0.8);
            positionManager.updateReadabilityMetrics(0.9);
            
            const stats = positionManager.getPerformanceStats();
            
            expect(stats.readabilityScores).toHaveLength(2);
            expect(stats.averageReadability).toBeCloseTo(0.85, 2);
        });
    });
});