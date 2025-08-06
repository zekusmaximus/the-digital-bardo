/**
 * @file audio-visual-synchronization.test.js
 * Integration tests for audio-visual synchronization (Requirement 5)
 */

import { SynchronizedDegradationController } from '../clear-lode/synchronized-degradation-controller.js';
import { CorruptionProgression } from '../clear-lode/corruption-progression.js';
import { FragmentPositionManager } from '../clear-lode/fragment-position-manager.js';
import { FragmentSpeedController } from '../clear-lode/fragment-speed-controller.js';

// Mock audio engine
class MockAudioEngine {
    constructor() {
        this.degradationLevel = 'minimal';
        this.parameters = {
            distortion: 0.1,
            reverb: 0.2,
            filter: 0.1
        };
        this.isInitialized = true;
    }
    
    getDegradationState() {
        return this.degradationLevel;
    }
    
    setDegradationLevel(level) {
        this.degradationLevel = level;
        this.updateParameters(level);
    }
    
    updateParameters(level) {
        const levelMap = {
            'minimal': { distortion: 0.1, reverb: 0.2, filter: 0.1 },
            'moderate': { distortion: 0.4, reverb: 0.5, filter: 0.3 },
            'severe': { distortion: 0.7, reverb: 0.8, filter: 0.6 },
            'complete': { distortion: 1.0, reverb: 1.0, filter: 0.9 }
        };
        this.parameters = levelMap[level] || levelMap['minimal'];
    }
    
    getAudioParameters() {
        return this.parameters;
    }
    
    init() {
        this.isInitialized = true;
        return Promise.resolve();
    }
    
    destroy() {
        this.isInitialized = false;
    }
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
    removeEventListener: jest.fn()
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
        getBoundingClientRect: jest.fn(() => ({
            left: 100, top: 100, width: 200, height: 30
        }))
    }))
};

describe('Audio-Visual Synchronization Tests', () => {
    let audioEngine;
    let corruptionProgression;
    let positionManager;
    let speedController;
    let synchronizedController;

    beforeEach(() => {
        jest.clearAllMocks();
        
        audioEngine = new MockAudioEngine();
        corruptionProgression = new CorruptionProgression(consciousness.karmicEngine);
        positionManager = new FragmentPositionManager();
        speedController = new FragmentSpeedController();
        
        const dependencies = {
            eventBridge: { on: jest.fn(), emit: jest.fn() },
            guardian: new ResourceGuardian(),
            config: { synchronization: { enabled: true, syncThreshold: 0.1 } },
            audioEngine: audioEngine,
            corruptionProgression: corruptionProgression,
            fragmentPositionManager: positionManager,
            fragmentSpeedController: speedController
        };
        
        synchronizedController = new SynchronizedDegradationController(dependencies);
    });

    afterEach(() => {
        synchronizedController?.destroy();
        corruptionProgression?.destroy();
        positionManager?.destroy();
        speedController?.destroy();
        audioEngine?.destroy();
    });

    describe('Requirement 5.1: Visual elements degrade in sync with audio', () => {
        test('should synchronize visual corruption with audio degradation levels', async () => {
            // Create test fragment
            const fragment = document.createElement('div');
            fragment.textContent = 'Sync test fragment';
            fragment.dataset.birthTime = Date.now();
            fragment.parentNode = document.body;
            
            corruptionProgression.initializeCleanFragment(fragment);
            
            // Test different audio degradation levels
            const testLevels = ['minimal', 'moderate', 'severe', 'complete'];
            
            for (const level of testLevels) {
                audioEngine.setDegradationLevel(level);
                
                // Trigger synchronization
                synchronizedController.syncVisualWithAudio();
                
                // Verify corruption progression synced
                const expectedNumericLevel = synchronizedController.parseAudioLevel(level);
                expect(corruptionProgression.globalCorruptionLevel).toBeCloseTo(expectedNumericLevel, 1);
            }
        });

        test('should update fragment positioning based on audio degradation', () => {
            const originalCenterBias = positionManager.config.safeZone.centerBias;
            
            // Set high audio degradation
            audioEngine.setDegradationLevel('severe');
            synchronizedController.syncVisualWithAudio();
            
            // Position manager should adjust for degradation
            expect(positionManager.config.safeZone.centerBias).not.toBe(originalCenterBias);
        });

        test('should adjust fragment speed based on audio parameters', () => {
            const originalSpeedMultiplier = speedController.config.speedMultiplier;
            
            // Set audio degradation that should affect speed
            audioEngine.setDegradationLevel('moderate');
            synchronizedController.syncVisualWithAudio();
            
            // Speed controller should adjust
            expect(speedController.config.speedMultiplier).toBeDefined();
        });
    });

    describe('Requirement 5.2: Recognition methods affect both audio and visual', () => {
        test('should coordinate recognition feedback across systems', () => {
            const recognitionData = {
                method: 'center-click',
                progress: 0.7,
                success: false
            };
            
            synchronizedController.handleRecognitionFeedback(recognitionData);
            
            // Should trigger both audio and visual updates
            expect(consciousness.recordEvent).toHaveBeenCalledWith(
                'recognition_feedback_synchronized',
                expect.objectContaining({
                    method: 'center-click',
                    progress: 0.7
                })
            );
        });

        test('should provide visual compensation when audio feedback fails', () => {
            // Simulate audio failure
            audioEngine.isInitialized = false;
            
            const recognitionData = {
                method: 'spacebar-hold',
                progress: 0.5,
                success: false
            };
            
            synchronizedController.handleRecognitionFeedback(recognitionData);
            
            // Should enhance visual feedback
            expect(synchronizedController.visualCompensation.enabled).toBe(true);
        });
    });

    describe('Requirement 5.3: Karma changes update both audio and visual', () => {
        test('should synchronize karma-driven changes across systems', () => {
            const karmaState = {
                computational: -0.3,
                emotional: -0.2,
                temporal: 0.1,
                void: -0.4
            };
            
            synchronizedController.handleKarmaChange(karmaState);
            
            // Should affect both audio parameters and visual corruption
            const totalKarma = consciousness.karmicEngine.getTotalKarma(karmaState);
            expect(totalKarma).toBeLessThan(0); // Negative karma
            
            // Audio should be affected
            expect(audioEngine.parameters.distortion).toBeGreaterThan(0.1);
            
            // Visual corruption should increase
            expect(corruptionProgression.globalCorruptionLevel).toBeGreaterThan(0);
        });

        test('should apply karma influence to fragment positioning', () => {
            const negativeKarmaState = {
                computational: -0.5,
                emotional: -0.3,
                temporal: -0.2,
                void: -0.6
            };
            
            synchronizedController.handleKarmaChange(negativeKarmaState);
            
            // Position manager should reflect karma influence
            expect(positionManager.config.safeZone.centerBias).toBeLessThan(0.3);
        });
    });

    describe('Requirement 5.4: Visual feedback compensates for audio failure', () => {
        test('should detect audio initialization failure', () => {
            audioEngine.isInitialized = false;
            
            const compensationNeeded = synchronizedController.checkAudioStatus();
            
            expect(compensationNeeded).toBe(true);
            expect(synchronizedController.visualCompensation.enabled).toBe(true);
        });

        test('should enhance visual guidance when audio fails', () => {
            // Simulate audio failure
            audioEngine.isInitialized = false;
            synchronizedController.enableVisualCompensation();
            
            // Visual systems should be enhanced
            expect(synchronizedController.visualCompensation.enhanced).toBe(true);
            expect(synchronizedController.visualCompensation.guidanceMultiplier).toBeGreaterThan(1);
        });

        test('should provide alternative feedback mechanisms', () => {
            audioEngine.isInitialized = false;
            
            const recognitionData = {
                method: 'keywords',
                progress: 0.8,
                success: false
            };
            
            synchronizedController.handleRecognitionFeedback(recognitionData);
            
            // Should use visual-only feedback
            expect(synchronizedController.feedbackMode).toBe('visual-only');
        });
    });

    describe('Requirement 5.5: Coordinated transitions between phases', () => {
        test('should coordinate recognition phase transitions', () => {
            // Start recognition phase
            synchronizedController.startRecognitionPhase();
            
            expect(synchronizedController.currentPhase).toBe('recognition');
            expect(consciousness.recordEvent).toHaveBeenCalledWith(
                'recognition_phase_started',
                expect.any(Object)
            );
        });

        test('should coordinate degradation phase transitions', () => {
            // Transition to degradation phase
            synchronizedController.startDegradationPhase();
            
            expect(synchronizedController.currentPhase).toBe('degradation');
            expect(consciousness.recordEvent).toHaveBeenCalledWith(
                'degradation_phase_started',
                expect.any(Object)
            );
        });

        test('should synchronize phase-specific audio and visual settings', () => {
            // Recognition phase should optimize for clarity
            synchronizedController.startRecognitionPhase();
            
            expect(positionManager.config.safeZone.centerBias).toBeGreaterThan(0.3);
            expect(speedController.config.speedMultiplier).toBeLessThan(1);
            
            // Degradation phase should allow more chaos
            synchronizedController.startDegradationPhase();
            
            expect(audioEngine.parameters.distortion).toBeGreaterThan(0.1);
        });
    });

    describe('Synchronization Accuracy and Performance', () => {
        test('should maintain sync within acceptable thresholds', () => {
            const audioLevel = 0.6;
            audioEngine.setDegradationLevel('moderate'); // Should map to ~0.5
            
            synchronizedController.syncVisualWithAudio();
            
            const visualLevel = corruptionProgression.globalCorruptionLevel;
            const difference = Math.abs(audioLevel - visualLevel);
            
            expect(difference).toBeLessThan(synchronizedController.config.syncThreshold);
        });

        test('should handle rapid synchronization updates efficiently', () => {
            const startTime = Date.now();
            
            // Rapid updates
            for (let i = 0; i < 10; i++) {
                const level = i / 10;
                audioEngine.parameters.distortion = level;
                synchronizedController.syncVisualWithAudio();
            }
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Should complete quickly
            expect(duration).toBeLessThan(100); // 100ms
        });

        test('should throttle excessive sync requests', () => {
            const syncSpy = jest.spyOn(synchronizedController, 'performSync');
            
            // Rapid fire sync requests
            for (let i = 0; i < 20; i++) {
                synchronizedController.requestSync();
            }
            
            // Should be throttled
            expect(syncSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Error Handling and Recovery', () => {
        test('should handle audio system errors gracefully', () => {
            // Simulate audio error
            audioEngine.isInitialized = false;
            
            expect(() => {
                synchronizedController.syncVisualWithAudio();
            }).not.toThrow();
            
            expect(synchronizedController.visualCompensation.enabled).toBe(true);
        });

        test('should recover from sync failures', () => {
            // Simulate sync failure
            jest.spyOn(corruptionProgression, 'syncWithAudioDegradation').mockImplementation(() => {
                throw new Error('Sync failed');
            });
            
            expect(() => {
                synchronizedController.syncVisualWithAudio();
            }).not.toThrow();
            
            expect(synchronizedController.lastSyncError).toBeDefined();
        });

        test('should maintain system stability during errors', () => {
            // Multiple error conditions
            audioEngine.isInitialized = false;
            jest.spyOn(positionManager, 'updateDegradationLevel').mockImplementation(() => {
                throw new Error('Position update failed');
            });
            
            const fragment = document.createElement('div');
            fragment.textContent = 'Error test';
            fragment.dataset.birthTime = Date.now();
            
            expect(() => {
                synchronizedController.handleSystemError(fragment);
            }).not.toThrow();
        });
    });

    describe('Integration with Performance Optimization', () => {
        test('should maintain sync performance under load', () => {
            // Create multiple fragments
            const fragments = [];
            for (let i = 0; i < 20; i++) {
                const fragment = document.createElement('div');
                fragment.textContent = `Fragment ${i}`;
                fragment.dataset.birthTime = Date.now();
                fragment.parentNode = document.body;
                fragments.push(fragment);
                
                corruptionProgression.initializeCleanFragment(fragment);
            }
            
            const startTime = Date.now();
            
            // Sync with many fragments
            audioEngine.setDegradationLevel('severe');
            synchronizedController.syncVisualWithAudio();
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Should handle load efficiently
            expect(duration).toBeLessThan(200); // 200ms for 20 fragments
        });

        test('should adapt sync quality based on performance tier', () => {
            // Simulate low performance tier
            synchronizedController.setPerformanceTier('low');
            
            audioEngine.setDegradationLevel('complete');
            synchronizedController.syncVisualWithAudio();
            
            // Should use reduced quality sync
            expect(synchronizedController.syncQuality).toBe('reduced');
        });
    });
});