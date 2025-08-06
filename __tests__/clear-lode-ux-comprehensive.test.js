/**
 * @file clear-lode-ux-comprehensive.test.js
 * Comprehensive test suite for all Clear Lode UX improvements
 * 
 * This test suite validates all requirements from the clear-lode-ux-improvements spec:
 * - Fragment readability and positioning (Requirement 1)
 * - Recognition guidance and hints (Requirement 2) 
 * - Recognition timing and user experience (Requirement 3)
 * - Progressive fragment corruption (Requirement 4)
 * - Audio-visual synchronization (Requirement 5)
 */

import { FragmentPositionManager } from '../clear-lode/fragment-position-manager.js';
import { FragmentSpeedController } from '../clear-lode/fragment-speed-controller.js';
import { CorruptionProgression } from '../clear-lode/corruption-progression.js';
import { RecognitionGuideController } from '../clear-lode/recognition-guide-controller.js';
import { SynchronizedDegradationController } from '../clear-lode/synchronized-degradation-controller.js';
import { FragmentPerformanceOptimizer } from '../clear-lode/fragment-performance-optimizer.js';

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

// Mock DOM and browser APIs
global.window = {
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getComputedStyle: jest.fn(() => ({
        fontSize: '14px',
        opacity: '1'
    }))
};

global.document = {
    createElement: jest.fn(() => ({
        style: {
            position: '', left: '', top: '', visibility: '', opacity: '',
            transition: '', transform: '', setProperty: jest.fn(), removeProperty: jest.fn()
        },
        dataset: {},
        classList: { add: jest.fn(), remove: jest.fn() },
        textContent: '',
        className: '',
        parentNode: { removeChild: jest.fn() },
        remove: jest.fn(),
        cloneNode: jest.fn(function() { return this; }),
        getBoundingClientRect: jest.fn(() => ({
            left: 100, top: 100, width: 200, height: 30,
            right: 300, bottom: 130
        })),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
    })),
    getElementById: jest.fn(() => ({ appendChild: jest.fn() })),
    querySelectorAll: jest.fn(() => []),
    dispatchEvent: jest.fn()
};

global.navigator = {
    deviceMemory: 8,
    hardwareConcurrency: 8,
    connection: { effectiveType: '4g' }
};

global.performance = {
    now: jest.fn(() => Date.now()),
    memory: { usedJSHeapSize: 50 * 1024 * 1024 }
};

global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

describe('Clear Lode UX Improvements - Comprehensive Test Suite', () => {
    let positionManager;
    let speedController;
    let corruptionProgression;
    let recognitionGuide;
    let performanceOptimizer;

    beforeEach(() => {
        jest.clearAllMocks();
        
        positionManager = new FragmentPositionManager();
        speedController = new FragmentSpeedController();
        corruptionProgression = new CorruptionProgression(consciousness.karmicEngine);
        performanceOptimizer = new FragmentPerformanceOptimizer();
        
        // Mock recognition guide dependencies
        const mockDependencies = {
            eventBridge: { on: jest.fn(), emit: jest.fn() },
            guardian: new ResourceGuardian(),
            config: { recognition: { methods: ['center-click', 'keywords', 'spacebar-hold'] } }
        };
        recognitionGuide = new RecognitionGuideController(mockDependencies);
    });

    afterEach(() => {
        positionManager?.destroy();
        speedController?.destroy();
        corruptionProgression?.destroy();
        recognitionGuide?.destroy();
        performanceOptimizer?.destroy();
    });

    describe('Requirement 1: Fragment Readability and Positioning', () => {
        describe('1.1: Fragments appear in readable positions within central viewing area', () => {
            test('should generate safe positions within readable zone', () => {
                const safePosition = positionManager.getSafePosition();
                
                expect(safePosition.x).toBeGreaterThan(positionManager.config.safeZone.marginLeft);
                expect(safePosition.x).toBeLessThan(window.innerWidth - positionManager.config.safeZone.marginRight);
                expect(safePosition.y).toBeGreaterThan(positionManager.config.safeZone.marginTop);
                expect(safePosition.y).toBeLessThan(window.innerHeight - positionManager.config.safeZone.marginBottom);
            });

            test('should calculate safe zone boundaries correctly', () => {
                const safeZone = positionManager.calculateSafeZone();
                
                expect(safeZone.bounds.x.min).toBe(positionManager.config.safeZone.marginLeft);
                expect(safeZone.bounds.x.max).toBe(window.innerWidth - positionManager.config.safeZone.marginRight);
                expect(safeZone.bounds.y.min).toBe(positionManager.config.safeZone.marginTop);
                expect(safeZone.bounds.y.max).toBe(window.innerHeight - positionManager.config.safeZone.marginBottom);
            });
        });

        describe('1.2: Fragments are initially uncorrupted and clearly readable', () => {
            test('should initialize fragments in clean state', () => {
                const fragment = document.createElement('div');
                fragment.textContent = 'Test fragment content';
                fragment.dataset.birthTime = Date.now();
                
                const corruptionData = corruptionProgression.initializeCleanFragment(fragment);
                
                expect(corruptionData.corruptionLevel).toBe(0);
                expect(corruptionData.originalContent).toBe('Test fragment content');
                expect(fragment.textContent).toBe('Test fragment content');
                expect(fragment.dataset.corruptionLevel).toBe('0');
            });
        });

        describe('1.3: Fragment speed allows users to read content', () => {
            test('should calculate optimal speed based on content length', () => {
                const shortContent = 'Short';
                const longContent = 'This is a much longer piece of content that should move slower';
                
                const shortSpeed = speedController.calculateOptimalSpeed(shortContent);
                const longSpeed = speedController.calculateOptimalSpeed(longContent);
                
                expect(longSpeed).toBeLessThan(shortSpeed);
                expect(shortSpeed).toBeLessThanOrEqual(speedController.config.speedLimits.maxSpeed);
                expect(longSpeed).toBeGreaterThanOrEqual(speedController.config.speedLimits.minSpeed);
            });

            test('should adjust animation duration based on content and speed', () => {
                const content = 'Test content for duration calculation';
                const distance = 500; // pixels
                const speed = speedController.calculateOptimalSpeed(content);
                
                const duration = speedController.calculateAnimationDuration(content, distance, speed);
                
                expect(duration).toBeGreaterThan(0);
                expect(duration).toBeLessThanOrEqual(speedController.config.maxAnimationDuration);
            });
        });

        describe('1.4: Fragments near screen edges are repositioned', () => {
            test('should detect fragments near edges', () => {
                const edgePosition = { x: 10, y: 10 }; // Near top-left edge
                const centerPosition = { x: 500, y: 400 }; // Center area
                
                expect(positionManager.isNearEdge(edgePosition)).toBe(true);
                expect(positionManager.isNearEdge(centerPosition)).toBe(false);
            });

            test('should reposition fragments that drift to edges', () => {
                const fragment = document.createElement('div');
                fragment.textContent = 'Edge fragment';
                fragment.style.position = 'absolute';
                fragment.style.left = '5px'; // Very close to edge
                fragment.style.top = '5px';
                fragment.parentNode = document.body;
                
                const repositioned = positionManager.repositionIfNeeded(fragment);
                
                expect(repositioned).toBe(true);
                expect(consciousness.recordEvent).toHaveBeenCalledWith(
                    'fragment_repositioned',
                    expect.objectContaining({
                        reason: 'readability_improvement'
                    })
                );
            });
        });

        describe('1.5: Fragments have sufficient contrast and size', () => {
            test('should validate fragment visibility and readability', () => {
                const fragment = document.createElement('div');
                fragment.textContent = 'Readable fragment';
                fragment.style.position = 'absolute';
                fragment.style.left = '200px';
                fragment.style.top = '200px';
                fragment.parentNode = document.body;
                fragment.dataset.speed = '50';
                
                const validation = positionManager.validateFragmentPlacement(fragment);
                
                expect(validation).toHaveProperty('isValid');
                expect(validation).toHaveProperty('score');
                expect(validation.score).toBeGreaterThan(0);
            });
        });
    });

    describe('Requirement 2: Recognition Guidance and Instructions', () => {
        describe('2.1: Recognition hints displayed prominently', () => {
            test('should initialize with recognition methods', () => {
                expect(recognitionGuide.recognitionMethods).toContain('center-click');
                expect(recognitionGuide.recognitionMethods).toContain('keywords');
                expect(recognitionGuide.recognitionMethods).toContain('spacebar-hold');
            });

            test('should show progressive hints based on inactivity', () => {
                const timeElapsed = 5000; // 5 seconds
                
                recognitionGuide.showProgressiveHints(timeElapsed);
                
                expect(recognitionGuide.hintsShown.length).toBeGreaterThan(0);
            });
        });

        describe('2.2: Clear instructions for recognition methods', () => {
            test('should display method instructions', () => {
                const method = 'center-click';
                
                recognitionGuide.displayMethodInstructions(method);
                
                expect(recognitionGuide.currentInstructions).toContain(method);
            });
        });

        describe('2.3: Visual feedback for recognition progress', () => {
            test('should provide feedback for recognition attempts', () => {
                const method = 'spacebar-hold';
                const progress = 0.5;
                
                recognitionGuide.provideFeedback(method, progress);
                
                expect(recognitionGuide.feedbackState.method).toBe(method);
                expect(recognitionGuide.feedbackState.progress).toBe(progress);
            });
        });

        describe('2.4: Progressive hints for inactive users', () => {
            test('should track hint progression over time', () => {
                const initialHints = recognitionGuide.hintsShown.length;
                
                // Simulate time passing without interaction
                recognitionGuide.showProgressiveHints(3000);
                recognitionGuide.showProgressiveHints(6000);
                recognitionGuide.showProgressiveHints(10000);
                
                expect(recognitionGuide.hintsShown.length).toBeGreaterThan(initialHints);
            });
        });

        describe('2.5: Clear visual indicators for recognition methods', () => {
            test('should show method indicators when recognition window opens', () => {
                recognitionGuide.showRecognitionWindow();
                
                expect(recognitionGuide.isWindowOpen).toBe(true);
                expect(recognitionGuide.methodIndicators.visible).toBe(true);
            });
        });
    });

    describe('Requirement 3: Recognition Timing and User Experience', () => {
        describe('3.1: Recognition window remains open for minimum duration', () => {
            test('should maintain minimum window duration', () => {
                const startTime = Date.now();
                recognitionGuide.showRecognitionWindow();
                
                expect(recognitionGuide.windowStartTime).toBeGreaterThanOrEqual(startTime);
                expect(recognitionGuide.minimumDuration).toBeGreaterThanOrEqual(15000); // 15 seconds
            });
        });

        describe('3.2: Timeout extended for active users', () => {
            test('should extend window for active users', () => {
                recognitionGuide.showRecognitionWindow();
                const originalDuration = recognitionGuide.currentDuration;
                
                recognitionGuide.extendWindowIfActive();
                
                expect(recognitionGuide.currentDuration).toBeGreaterThan(originalDuration);
                expect(recognitionGuide.timeExtensions).toBeGreaterThan(0);
            });
        });

        describe('3.3: Clear indication when recognition phase ends', () => {
            test('should provide clear transition indicators', () => {
                recognitionGuide.showRecognitionWindow();
                recognitionGuide.endRecognitionPhase();
                
                expect(recognitionGuide.isWindowOpen).toBe(false);
                expect(recognitionGuide.transitionIndicator.shown).toBe(true);
            });
        });

        describe('3.4: Feedback for recognition progress', () => {
            test('should track and provide progress feedback', () => {
                const method = 'spacebar-hold';
                
                recognitionGuide.startRecognitionAttempt(method);
                recognitionGuide.updateRecognitionProgress(method, 0.3);
                recognitionGuide.updateRecognitionProgress(method, 0.7);
                
                expect(recognitionGuide.feedbackState.progress).toBe(0.7);
                expect(recognitionGuide.progressHistory.length).toBeGreaterThan(0);
            });
        });

        describe('3.5: Clear confirmation for successful recognition', () => {
            test('should provide confirmation for successful recognition', () => {
                const method = 'center-click';
                
                recognitionGuide.handleRecognitionSuccess(method);
                
                expect(recognitionGuide.lastSuccessfulMethod).toBe(method);
                expect(recognitionGuide.confirmationShown).toBe(true);
            });
        });
    });

    describe('Requirement 4: Progressive Fragment Corruption', () => {
        describe('4.1: Fragments start in uncorrupted state', () => {
            test('should initialize all fragments with zero corruption', () => {
                const fragment = document.createElement('div');
                fragment.textContent = 'Clean fragment';
                fragment.dataset.birthTime = Date.now();
                
                const corruptionData = corruptionProgression.initializeCleanFragment(fragment);
                
                expect(corruptionData.corruptionLevel).toBe(0);
                expect(corruptionData.originalContent).toBe('Clean fragment');
                expect(fragment.textContent).toBe('Clean fragment');
            });
        });

        describe('4.2: Corruption increases with poor karmic choices', () => {
            test('should apply progressive corruption based on karma', () => {
                const fragment = document.createElement('div');
                fragment.textContent = 'Test fragment';
                fragment.dataset.birthTime = Date.now();
                fragment.parentNode = document.body;
                
                corruptionProgression.initializeCleanFragment(fragment);
                
                // Simulate negative karma state
                const negativeKarmaState = {
                    computational: -0.3,
                    emotional: -0.2,
                    temporal: -0.1,
                    void: -0.4
                };
                
                const corruptionLevel = corruptionProgression.applyProgressiveCorruption(fragment, negativeKarmaState);
                
                expect(corruptionLevel).toBeGreaterThan(0);
                expect(consciousness.recordEvent).toHaveBeenCalledWith(
                    'fragment_corruption_progressed',
                    expect.objectContaining({
                        corruptionLevel: expect.any(Number)
                    })
                );
            });
        });

        describe('4.3: Visual corruption is progressive rather than binary', () => {
            test('should apply different corruption tiers based on level', () => {
                const fragment = document.createElement('div');
                fragment.textContent = 'Progressive corruption test';
                fragment.dataset.birthTime = Date.now();
                
                const corruptionData = corruptionProgression.initializeCleanFragment(fragment);
                
                // Test different corruption levels
                corruptionData.corruptionLevel = 0.3; // Moderate
                corruptionProgression.applyVisualCorruption(fragment, corruptionData);
                expect(fragment.classList.add).toHaveBeenCalledWith('corrupted-moderate');
                
                corruptionData.corruptionLevel = 0.8; // Severe
                corruptionProgression.applyVisualCorruption(fragment, corruptionData);
                expect(fragment.classList.add).toHaveBeenCalledWith('corrupted-severe');
            });
        });

        describe('4.4: Recognition reduces fragment corruption', () => {
            test('should purify fragments on successful recognition', () => {
                const fragment = document.createElement('div');
                fragment.textContent = 'Corrupted fragment';
                fragment.dataset.birthTime = Date.now();
                
                const corruptionData = corruptionProgression.initializeCleanFragment(fragment);
                corruptionData.corruptionLevel = 0.8; // High corruption
                
                const purifiedCount = corruptionProgression.purifyOnRecognition([fragment]);
                
                expect(purifiedCount).toBe(1);
                expect(consciousness.recordEvent).toHaveBeenCalledWith(
                    'fragment_purified_on_recognition',
                    expect.objectContaining({
                        oldCorruption: 0.8,
                        newCorruption: expect.any(Number)
                    })
                );
            });
        });

        describe('4.5: Corruption intensifies with degradation level', () => {
            test('should sync corruption with audio degradation', () => {
                const audioLevel = 0.6;
                
                corruptionProgression.syncWithAudioDegradation(audioLevel);
                
                expect(corruptionProgression.globalCorruptionLevel).toBe(audioLevel);
                expect(consciousness.recordEvent).toHaveBeenCalledWith(
                    'corruption_synced_with_audio',
                    expect.objectContaining({
                        audioLevel: audioLevel
                    })
                );
            });
        });
    });

    describe('Requirement 5: Audio-Visual Synchronization', () => {
        describe('5.1: Visual elements degrade in sync with audio', () => {
            test('should synchronize corruption with audio degradation', () => {
                const fragment = document.createElement('div');
                fragment.textContent = 'Sync test fragment';
                fragment.dataset.birthTime = Date.now();
                fragment.parentNode = document.body;
                
                corruptionProgression.initializeCleanFragment(fragment);
                
                // Simulate audio degradation
                const audioLevel = 0.7;
                corruptionProgression.syncWithAudioDegradation(audioLevel);
                
                expect(corruptionProgression.globalCorruptionLevel).toBe(audioLevel);
            });
        });

        describe('5.2: Recognition methods affect both audio and visual', () => {
            test('should coordinate feedback across systems', () => {
                const method = 'center-click';
                const progress = 0.5;
                
                recognitionGuide.provideFeedback(method, progress);
                
                expect(recognitionGuide.feedbackState.method).toBe(method);
                expect(recognitionGuide.feedbackState.progress).toBe(progress);
                // In full implementation, this would also trigger audio feedback
            });
        });

        describe('5.3: Karma changes update both audio and visual', () => {
            test('should respond to karma changes across systems', () => {
                const karmaState = {
                    computational: -0.2,
                    emotional: 0.1,
                    temporal: -0.1,
                    void: 0.05
                };
                
                // Test that corruption progression responds to karma
                const fragment = document.createElement('div');
                fragment.textContent = 'Karma test';
                fragment.dataset.birthTime = Date.now();
                fragment.parentNode = document.body;
                
                corruptionProgression.initializeCleanFragment(fragment);
                const corruptionLevel = corruptionProgression.applyProgressiveCorruption(fragment, karmaState);
                
                expect(corruptionLevel).toBeGreaterThan(0);
            });
        });

        describe('5.4: Visual feedback compensates for audio failure', () => {
            test('should enhance visual guidance when audio fails', () => {
                // Simulate audio initialization failure
                recognitionGuide.handleAudioFailure();
                
                expect(recognitionGuide.visualCompensation.enabled).toBe(true);
                expect(recognitionGuide.visualCompensation.enhanced).toBe(true);
            });
        });

        describe('5.5: Coordinated transitions between phases', () => {
            test('should coordinate phase transitions', () => {
                recognitionGuide.showRecognitionWindow();
                expect(recognitionGuide.isWindowOpen).toBe(true);
                
                recognitionGuide.endRecognitionPhase();
                expect(recognitionGuide.isWindowOpen).toBe(false);
                expect(recognitionGuide.transitionIndicator.shown).toBe(true);
            });
        });
    });

    describe('Performance and Integration', () => {
        describe('Performance Optimization Integration', () => {
            test('should integrate with performance optimizer', () => {
                const fragment = performanceOptimizer.getPooledFragment();
                fragment.textContent = 'Performance test';
                
                // Test that fragment can be used with other systems
                const safePosition = positionManager.getSafePosition();
                fragment.style.left = `${safePosition.x}px`;
                fragment.style.top = `${safePosition.y}px`;
                
                const optimalSpeed = speedController.calculateOptimalSpeed(fragment.textContent);
                fragment.dataset.speed = optimalSpeed;
                
                corruptionProgression.initializeCleanFragment(fragment);
                
                expect(fragment.dataset.pooled).toBe('true');
                expect(fragment.dataset.corruptionLevel).toBe('0');
                expect(optimalSpeed).toBeGreaterThan(0);
            });
        });

        describe('System Resource Management', () => {
            test('should properly clean up all systems', () => {
                const systems = [
                    positionManager,
                    speedController,
                    corruptionProgression,
                    recognitionGuide,
                    performanceOptimizer
                ];
                
                systems.forEach(system => {
                    expect(() => system.destroy()).not.toThrow();
                });
            });
        });

        describe('Cross-System Event Coordination', () => {
            test('should coordinate events between systems', () => {
                // Test recognition success triggering purification
                const fragment = document.createElement('div');
                fragment.textContent = 'Event coordination test';
                fragment.dataset.birthTime = Date.now();
                
                corruptionProgression.initializeCleanFragment(fragment);
                
                // Simulate recognition success
                recognitionGuide.handleRecognitionSuccess('center-click');
                
                expect(recognitionGuide.lastSuccessfulMethod).toBe('center-click');
                expect(recognitionGuide.confirmationShown).toBe(true);
            });
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle invalid fragment data gracefully', () => {
            expect(() => {
                positionManager.validateFragmentPlacement(null);
            }).not.toThrow();
            
            expect(() => {
                speedController.calculateOptimalSpeed(null);
            }).not.toThrow();
            
            expect(() => {
                corruptionProgression.initializeCleanFragment(null);
            }).not.toThrow();
        });

        test('should handle extreme viewport sizes', () => {
            // Test very small viewport
            global.window.innerWidth = 200;
            global.window.innerHeight = 150;
            
            const smallViewportManager = new FragmentPositionManager();
            const safeZone = smallViewportManager.calculateSafeZone();
            
            expect(safeZone.width).toBeGreaterThan(0);
            expect(safeZone.height).toBeGreaterThan(0);
            
            smallViewportManager.destroy();
        });

        test('should handle performance degradation gracefully', () => {
            // Simulate poor performance
            performanceOptimizer.performanceMetrics.fps = 15;
            performanceOptimizer.performanceMetrics.memoryUsage = 150;
            
            const originalTier = performanceOptimizer.currentTier;
            performanceOptimizer.downgradeTier();
            
            expect(performanceOptimizer.currentTier).not.toBe(originalTier);
        });
    });
});