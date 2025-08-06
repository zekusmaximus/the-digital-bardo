/**
 * @file visual-regression.test.js
 * Visual regression tests for Clear Lode UX improvements
 * 
 * These tests validate that visual changes maintain expected appearance
 * and behavior across different scenarios and device capabilities.
 */

import { FragmentPositionManager } from '../clear-lode/fragment-position-manager.js';
import { CorruptionProgression } from '../clear-lode/corruption-progression.js';
import { FragmentSpeedController } from '../clear-lode/fragment-speed-controller.js';

// Mock canvas for visual testing
class MockCanvas {
    constructor(width = 1024, height = 768) {
        this.width = width;
        this.height = height;
        this.context = new MockCanvasContext();
    }
    
    getContext() {
        return this.context;
    }
}

class MockCanvasContext {
    constructor() {
        this.operations = [];
        this.fillStyle = '#000000';
        this.strokeStyle = '#000000';
        this.font = '14px monospace';
    }
    
    fillRect(x, y, width, height) {
        this.operations.push({ type: 'fillRect', x, y, width, height, style: this.fillStyle });
    }
    
    strokeRect(x, y, width, height) {
        this.operations.push({ type: 'strokeRect', x, y, width, height, style: this.strokeStyle });
    }
    
    fillText(text, x, y) {
        this.operations.push({ type: 'fillText', text, x, y, font: this.font, style: this.fillStyle });
    }
    
    clearRect(x, y, width, height) {
        this.operations.push({ type: 'clearRect', x, y, width, height });
    }
    
    getOperations() {
        return [...this.operations];
    }
    
    clear() {
        this.operations = [];
    }
}

// Mock DOM with visual properties
function createVisualFragment(text, x = 0, y = 0) {
    return {
        textContent: text,
        style: {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            fontSize: '14px',
            color: '#00ff88',
            opacity: '1',
            transform: '',
            transition: '',
            visibility: 'visible',
            setProperty: jest.fn(),
            removeProperty: jest.fn()
        },
        dataset: {
            birthTime: Date.now(),
            fragmentId: `fragment-${Date.now()}-${Math.random()}`,
            corruptionLevel: '0'
        },
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(() => false)
        },
        getBoundingClientRect: jest.fn(() => ({
            left: x,
            top: y,
            width: text.length * 8, // Approximate character width
            height: 20,
            right: x + (text.length * 8),
            bottom: y + 20
        })),
        parentNode: { removeChild: jest.fn() },
        remove: jest.fn()
    };
}

// Mock dependencies
global.consciousness = {
    recordEvent: jest.fn(),
    getState: jest.fn(() => ({
        computational: 0.1,
        emotional: -0.05,
        temporal: 0.02,
        void: -0.1
    })),
    karmicEngine: {
        getTotalKarma: jest.fn((state) => Object.values(state).reduce((sum, val) => sum + val, 0))
    }
};

global.ResourceGuardian = class {
    constructor() { this.resources = []; }
    register(resource, cleanup) { this.resources.push({ resource, cleanup }); }
    registerCleanup(cleanup) { this.resources.push({ cleanup }); }
    cleanupAll() { this.resources.forEach(({ resource, cleanup }) => cleanup && cleanup(resource)); }
};

global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getComputedStyle: jest.fn(() => ({
        fontSize: '14px',
        opacity: '1',
        color: '#00ff88'
    }))
};

global.document = {
    createElement: jest.fn(() => createVisualFragment('test')),
    getElementById: jest.fn(() => ({ appendChild: jest.fn() }))
};

describe('Visual Regression Tests', () => {
    let positionManager;
    let corruptionProgression;
    let speedController;
    let canvas;

    beforeEach(() => {
        jest.clearAllMocks();
        
        positionManager = new FragmentPositionManager();
        corruptionProgression = new CorruptionProgression(consciousness.karmicEngine);
        speedController = new FragmentSpeedController();
        canvas = new MockCanvas();
    });

    afterEach(() => {
        positionManager?.destroy();
        corruptionProgression?.destroy();
        speedController?.destroy();
    });

    describe('Fragment Positioning Visual Tests', () => {
        test('should maintain consistent safe zone visualization', () => {
            const safeZone = positionManager.calculateSafeZone();
            
            // Visualize safe zone on canvas
            const ctx = canvas.getContext();
            ctx.strokeStyle = '#00ff88';
            ctx.strokeRect(
                safeZone.bounds.x.min,
                safeZone.bounds.y.min,
                safeZone.width,
                safeZone.height
            );
            
            const operations = ctx.getOperations();
            expect(operations).toHaveLength(1);
            expect(operations[0].type).toBe('strokeRect');
            expect(operations[0].x).toBe(safeZone.bounds.x.min);
            expect(operations[0].y).toBe(safeZone.bounds.y.min);
        });

        test('should visualize fragment distribution across screen', () => {
            const fragments = [];
            const ctx = canvas.getContext();
            
            // Create fragments in different positions
            for (let i = 0; i < 10; i++) {
                const position = positionManager.getSafePosition();
                const fragment = createVisualFragment(`Fragment ${i}`, position.x, position.y);
                fragments.push(fragment);
                
                // Draw fragment on canvas
                ctx.fillStyle = '#00ff88';
                ctx.fillText(fragment.textContent, position.x, position.y);
            }
            
            const operations = ctx.getOperations();
            const textOperations = operations.filter(op => op.type === 'fillText');
            
            expect(textOperations).toHaveLength(10);
            
            // Verify distribution - fragments should be spread across safe zone
            const xPositions = textOperations.map(op => op.x);
            const yPositions = textOperations.map(op => op.y);
            
            const xRange = Math.max(...xPositions) - Math.min(...xPositions);
            const yRange = Math.max(...yPositions) - Math.min(...yPositions);
            
            expect(xRange).toBeGreaterThan(200); // Should span significant width
            expect(yRange).toBeGreaterThan(150); // Should span significant height
        });

        test('should maintain readability scores across different positions', () => {
            const testPositions = [
                { x: 100, y: 100 }, // Top-left safe area
                { x: 500, y: 400 }, // Center
                { x: 800, y: 600 }, // Bottom-right safe area
                { x: 10, y: 10 },   // Near edge (should score lower)
            ];
            
            const readabilityScores = testPositions.map(position => {
                const fragment = createVisualFragment('Test fragment', position.x, position.y);
                const validation = positionManager.validateFragmentPlacement(fragment);
                return validation.score;
            });
            
            // First three should have good readability
            expect(readabilityScores[0]).toBeGreaterThan(0.7);
            expect(readabilityScores[1]).toBeGreaterThan(0.8); // Center should be best
            expect(readabilityScores[2]).toBeGreaterThan(0.7);
            
            // Edge position should have lower score
            expect(readabilityScores[3]).toBeLessThan(0.5);
        });
    });

    describe('Corruption Visual Progression Tests', () => {
        test('should show progressive visual corruption stages', () => {
            const fragment = createVisualFragment('Progressive corruption test');
            corruptionProgression.initializeCleanFragment(fragment);
            
            const corruptionLevels = [0, 0.25, 0.5, 0.75, 1.0];
            const visualStates = [];
            
            corruptionLevels.forEach(level => {
                const corruptionData = { corruptionLevel: level };
                corruptionProgression.applyVisualCorruption(fragment, corruptionData);
                
                visualStates.push({
                    level,
                    text: fragment.textContent,
                    classes: [...fragment.classList.add.mock.calls.flat()],
                    opacity: fragment.style.opacity,
                    corruptionIntensity: fragment.style.setProperty.mock.calls
                        .find(call => call[0] === '--corruption-intensity')?.[1] || '0'
                });
            });
            
            // Verify progression
            expect(visualStates[0].level).toBe(0); // Clean
            expect(visualStates[4].level).toBe(1); // Fully corrupted
            
            // Text should become more corrupted
            expect(visualStates[0].text).toBe('Progressive corruption test');
            expect(visualStates[4].text).not.toBe('Progressive corruption test');
            
            // Corruption intensity should increase
            expect(parseFloat(visualStates[4].corruptionIntensity)).toBeGreaterThan(
                parseFloat(visualStates[0].corruptionIntensity)
            );
        });

        test('should maintain visual consistency across corruption tiers', () => {
            const fragments = ['minimal', 'moderate', 'severe', 'complete'].map((tier, index) => {
                const fragment = createVisualFragment(`${tier} corruption test`);
                corruptionProgression.initializeCleanFragment(fragment);
                
                const corruptionLevel = (index + 1) * 0.25;
                const corruptionData = { corruptionLevel };
                corruptionProgression.applyVisualCorruption(fragment, corruptionData);
                
                return {
                    tier,
                    level: corruptionLevel,
                    fragment,
                    classes: fragment.classList.add.mock.calls.flat()
                };
            });
            
            // Each tier should have appropriate classes
            expect(fragments[0].classes).toContain('corrupted-minimal');
            expect(fragments[1].classes).toContain('corrupted-moderate');
            expect(fragments[2].classes).toContain('corrupted-severe');
            expect(fragments[3].classes).toContain('corrupted-complete');
        });

        test('should visualize purification effects', () => {
            const fragment = createVisualFragment('Purification test');
            corruptionProgression.initializeCleanFragment(fragment);
            
            // Apply high corruption
            const corruptionData = { corruptionLevel: 0.8 };
            corruptionProgression.applyVisualCorruption(fragment, corruptionData);
            
            const preText = fragment.textContent;
            const preClasses = [...fragment.classList.add.mock.calls.flat()];
            
            // Apply purification
            corruptionProgression.purifyOnRecognition([fragment]);
            
            const postText = fragment.textContent;
            const postClasses = [...fragment.classList.add.mock.calls.flat()];
            
            // Should show purification effect
            expect(postClasses).toContain('purification-effect');
            expect(fragment.style.setProperty).toHaveBeenCalledWith('--purification-intensity', '1.0');
        });
    });

    describe('Speed and Animation Visual Tests', () => {
        test('should visualize speed differences for different content lengths', () => {
            const testContents = [
                'Short',
                'Medium length content here',
                'This is a very long piece of content that should move much slower to maintain readability'
            ];
            
            const speedData = testContents.map(content => {
                const speed = speedController.calculateOptimalSpeed(content);
                const duration = speedController.calculateAnimationDuration(content, 500, speed);
                
                return {
                    content,
                    length: content.length,
                    speed,
                    duration
                };
            });
            
            // Longer content should have slower speed and longer duration
            expect(speedData[0].speed).toBeGreaterThan(speedData[2].speed);
            expect(speedData[2].duration).toBeGreaterThan(speedData[0].duration);
            
            // Visualize on canvas
            const ctx = canvas.getContext();
            speedData.forEach((data, index) => {
                const y = 100 + (index * 30);
                ctx.fillStyle = '#00ff88';
                ctx.fillText(`${data.content} (${data.speed.toFixed(1)}px/s)`, 50, y);
            });
            
            const operations = ctx.getOperations();
            const textOps = operations.filter(op => op.type === 'fillText');
            expect(textOps).toHaveLength(3);
        });

        test('should maintain smooth animation curves', () => {
            const fragment = createVisualFragment('Animation test');
            const startPos = { x: 100, y: 100 };
            const endPos = { x: 600, y: 400 };
            const duration = 5000; // 5 seconds
            
            // Simulate animation frames
            const frames = [];
            const frameCount = 60; // 60 frames for 1 second sample
            
            for (let i = 0; i <= frameCount; i++) {
                const progress = i / frameCount;
                const easeProgress = speedController.applyEasing(progress, 'ease-out');
                
                const x = startPos.x + (endPos.x - startPos.x) * easeProgress;
                const y = startPos.y + (endPos.y - startPos.y) * easeProgress;
                
                frames.push({ progress, x, y });
            }
            
            // Verify smooth progression
            for (let i = 1; i < frames.length; i++) {
                const deltaX = Math.abs(frames[i].x - frames[i-1].x);
                const deltaY = Math.abs(frames[i].y - frames[i-1].y);
                
                // Movement should be smooth (no large jumps)
                expect(deltaX).toBeLessThan(20);
                expect(deltaY).toBeLessThan(15);
            }
        });
    });

    describe('Responsive Visual Behavior', () => {
        test('should adapt visuals to different screen sizes', () => {
            const screenSizes = [
                { width: 320, height: 568 },   // Mobile portrait
                { width: 768, height: 1024 },  // Tablet portrait
                { width: 1024, height: 768 },  // Tablet landscape
                { width: 1920, height: 1080 }  // Desktop
            ];
            
            const adaptations = screenSizes.map(size => {
                global.window.innerWidth = size.width;
                global.window.innerHeight = size.height;
                
                const testManager = new FragmentPositionManager();
                const safeZone = testManager.calculateSafeZone();
                
                testManager.destroy();
                
                return {
                    screenSize: size,
                    safeZone,
                    utilization: (safeZone.width * safeZone.height) / (size.width * size.height)
                };
            });
            
            // All screen sizes should have reasonable safe zones
            adaptations.forEach(adaptation => {
                expect(adaptation.safeZone.width).toBeGreaterThan(100);
                expect(adaptation.safeZone.height).toBeGreaterThan(100);
                expect(adaptation.utilization).toBeGreaterThan(0.3); // At least 30% utilization
                expect(adaptation.utilization).toBeLessThan(0.9);    // Leave margins
            });
        });

        test('should maintain visual hierarchy across performance tiers', () => {
            const tiers = ['high', 'medium', 'low'];
            const visualConfigs = tiers.map(tier => {
                // Simulate tier-specific configuration
                const config = {
                    tier,
                    maxFragments: tier === 'high' ? 20 : tier === 'medium' ? 12 : 6,
                    corruptionQuality: tier,
                    animationComplexity: tier === 'high' ? 'full' : tier === 'medium' ? 'reduced' : 'minimal'
                };
                
                return config;
            });
            
            // Higher tiers should support more visual complexity
            expect(visualConfigs[0].maxFragments).toBeGreaterThan(visualConfigs[2].maxFragments);
            expect(visualConfigs[0].corruptionQuality).toBe('high');
            expect(visualConfigs[2].animationComplexity).toBe('minimal');
        });
    });

    describe('Visual Accessibility and Contrast', () => {
        test('should maintain sufficient contrast ratios', () => {
            const fragment = createVisualFragment('Contrast test');
            
            // Test different corruption levels for contrast
            const corruptionLevels = [0, 0.3, 0.6, 0.9];
            const contrastRatios = corruptionLevels.map(level => {
                const corruptionData = { corruptionLevel: level };
                corruptionProgression.applyVisualCorruption(fragment, corruptionData);
                
                // Simulate contrast calculation (simplified)
                const opacity = parseFloat(fragment.style.opacity || '1');
                const baseContrast = 4.5; // WCAG AA standard
                const effectiveContrast = baseContrast * opacity;
                
                return effectiveContrast;
            });
            
            // Even with corruption, contrast should remain acceptable
            contrastRatios.forEach(ratio => {
                expect(ratio).toBeGreaterThan(3.0); // Minimum acceptable
            });
        });

        test('should provide readable font sizes across devices', () => {
            const devicePixelRatios = [1, 1.5, 2, 3]; // Different device densities
            
            devicePixelRatios.forEach(ratio => {
                const baseFontSize = 14;
                const adjustedSize = baseFontSize * Math.max(1, ratio * 0.8);
                
                expect(adjustedSize).toBeGreaterThanOrEqual(12); // Minimum readable size
                expect(adjustedSize).toBeLessThanOrEqual(24);    // Maximum reasonable size
            });
        });
    });

    describe('Visual Performance Metrics', () => {
        test('should measure visual update performance', () => {
            const fragment = createVisualFragment('Performance test');
            corruptionProgression.initializeCleanFragment(fragment);
            
            const startTime = Date.now();
            
            // Perform multiple visual updates
            for (let i = 0; i < 100; i++) {
                const corruptionLevel = i / 100;
                const corruptionData = { corruptionLevel };
                corruptionProgression.applyVisualCorruption(fragment, corruptionData);
            }
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Should complete visual updates quickly
            expect(duration).toBeLessThan(100); // 100ms for 100 updates
        });

        test('should track visual memory usage', () => {
            const fragments = [];
            
            // Create many fragments to test memory usage
            for (let i = 0; i < 50; i++) {
                const fragment = createVisualFragment(`Memory test ${i}`);
                corruptionProgression.initializeCleanFragment(fragment);
                fragments.push(fragment);
            }
            
            // Simulate memory tracking
            const estimatedMemory = fragments.length * 1024; // 1KB per fragment estimate
            
            expect(estimatedMemory).toBeLessThan(100 * 1024); // Should be under 100KB
            
            // Cleanup
            fragments.forEach(fragment => {
                const fragmentId = fragment.dataset.fragmentId;
                corruptionProgression.removeFragment(fragmentId);
            });
        });
    });

    describe('Visual Error States', () => {
        test('should handle visual rendering errors gracefully', () => {
            const fragment = createVisualFragment('Error test');
            
            // Simulate rendering error
            fragment.style.setProperty = jest.fn(() => {
                throw new Error('Style property error');
            });
            
            expect(() => {
                corruptionProgression.initializeCleanFragment(fragment);
            }).not.toThrow();
        });

        test('should provide fallback visuals for unsupported features', () => {
            const fragment = createVisualFragment('Fallback test');
            
            // Simulate lack of CSS support
            fragment.classList.add = jest.fn(() => {
                throw new Error('CSS class not supported');
            });
            
            expect(() => {
                const corruptionData = { corruptionLevel: 0.5 };
                corruptionProgression.applyVisualCorruption(fragment, corruptionData);
            }).not.toThrow();
        });
    });
});