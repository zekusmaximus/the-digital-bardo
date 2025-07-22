/**
 * @file Unit tests for SynchronizedDegradationController
 * 
 * Tests the synchronized audio-visual degradation system including:
 * - Audio-visual synchronization
 * - Karma-responsive visual updates
 * - Recognition feedback coordination
 * - Audio fallback mode
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SynchronizedDegradationController } from '../clear-lode/synchronized-degradation-controller.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

// Mock dependencies
const mockEventBridge = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

const mockGuardian = {
    registerCleanup: vi.fn(),
    registerTimer: vi.fn(),
    cleanupAll: vi.fn()
};

const mockConfig = {
    syncThreshold: 0.05,
    syncInterval: 100
};

const mockAudioEngine = {
    isInitialized: true,
    getDegradationLevel: vi.fn(() => 0.5),
    createGlitchBurst: vi.fn(),
    achieveResonance: vi.fn(),
    accelerateDegradation: vi.fn()
};

const mockCorruptionProgression = {
    syncWithAudioDegradation: vi.fn(),
    purifyOnRecognition: vi.fn(),
    getCorruptionStats: vi.fn(() => ({
        totalFragments: 5,
        averageCorruption: 0.3,
        maxCorruption: 0.8,
        minCorruption: 0.1,
        globalLevel: 0.4
    }))
};

describe('SynchronizedDegradationController', () => {
    let controller;
    let dependencies;

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();
        
        // Mock DOM elements
        document.body.innerHTML = `
            <div class="consciousness-fragment" data-birth-time="123">Test fragment 1</div>
            <div class="consciousness-fragment" data-birth-time="124">Test fragment 2</div>
        `;
        
        // Mock document.documentElement.style
        document.documentElement.style = {
            setProperty: vi.fn(),
            removeProperty: vi.fn()
        };
        
        // Mock consciousness
        vi.spyOn(consciousness, 'subscribe').mockImplementation(() => {});
        vi.spyOn(consciousness, 'recordEvent').mockImplementation(() => {});
        vi.spyOn(consciousness, 'getState').mockReturnValue({
            computational: 10,
            emotional: 20,
            void: 30,
            temporal: 15
        });

        dependencies = {
            eventBridge: mockEventBridge,
            guardian: mockGuardian,
            config: mockConfig,
            audioEngine: mockAudioEngine,
            corruptionProgression: mockCorruptionProgression
        };

        controller = new SynchronizedDegradationController(dependencies);
    });

    afterEach(() => {
        if (controller) {
            controller.destroy();
        }
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    describe('Initialization', () => {
        it('should initialize with required dependencies', () => {
            expect(controller).toBeDefined();
            expect(controller.eventBridge).toBe(mockEventBridge);
            expect(controller.guardian).toBe(mockGuardian);
            expect(controller.config).toBe(mockConfig);
        });

        it('should throw error if missing required dependencies', () => {
            expect(() => {
                new SynchronizedDegradationController({});
            }).toThrow('SynchronizedDegradationController requires eventBridge, guardian, and config');
        });

        it('should set up event listeners on init', () => {
            controller.init();
            
            expect(mockEventBridge.on).toHaveBeenCalledWith('audio:degradationChanged', expect.any(Function));
            expect(mockEventBridge.on).toHaveBeenCalledWith('audio:karmaParametersUpdated', expect.any(Function));
            expect(mockEventBridge.on).toHaveBeenCalledWith('recognition:attempt', expect.any(Function));
            expect(mockEventBridge.on).toHaveBeenCalledWith('state:recognitionSucceeded', expect.any(Function));
            expect(mockEventBridge.on).toHaveBeenCalledWith('state:recognitionFailed', expect.any(Function));
        });

        it('should subscribe to consciousness state changes', () => {
            controller.init();
            
            expect(consciousness.subscribe).toHaveBeenCalledWith('karma', expect.any(Function));
        });
    });

    describe('Audio-Visual Synchronization', () => {
        beforeEach(() => {
            controller.init();
        });

        it('should synchronize visual corruption with audio level changes', () => {
            const audioData = { level: 0.7, source: 'karma_update' };
            
            // Simulate audio degradation change
            const audioHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'audio:degradationChanged'
            )[1];
            
            audioHandler(audioData);
            
            expect(mockCorruptionProgression.syncWithAudioDegradation).toHaveBeenCalledWith(0.7);
            expect(controller.syncState.audioLevel).toBe(0.7);
            expect(consciousness.recordEvent).toHaveBeenCalledWith('audio_visual_sync', expect.objectContaining({
                audioLevel: 0.7,
                numericLevel: 0.7,
                source: 'karma_update'
            }));
        });

        it('should handle string audio levels', () => {
            const audioData = { level: 'severe', source: 'test' };
            
            const audioHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'audio:degradationChanged'
            )[1];
            
            audioHandler(audioData);
            
            expect(mockCorruptionProgression.syncWithAudioDegradation).toHaveBeenCalledWith(0.8);
            expect(controller.syncState.audioLevel).toBe(0.8);
        });

        it('should update visual effects based on audio karma parameters', () => {
            const karmaParams = {
                noiseLevel: 0.6,
                pitchInstability: 10,
                harmonicJitter: 0.08,
                timeDissolution: 0.15,
                allTypesInteraction: 0.4
            };
            
            const karmaData = {
                parameters: karmaParams,
                karmaState: { computational: 50, emotional: 30, void: 60, temporal: 20 }
            };
            
            const karmaHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'audio:karmaParametersUpdated'
            )[1];
            
            karmaHandler(karmaData);
            
            expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--visual-jitter', expect.any(Number));
            expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--corruption-intensity', 0.6);
            expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--chromatic-aberration', expect.stringContaining('px'));
        });
    });

    describe('Karma-Responsive Updates', () => {
        beforeEach(() => {
            controller.init();
        });

        it('should update visual effects based on karma state changes', () => {
            const karmaState = {
                computational: 80,
                emotional: 40,
                void: 20,
                temporal: 60
            };
            
            // Simulate karma state change
            const karmaSubscriber = consciousness.subscribe.mock.calls.find(
                call => call[0] === 'karma'
            )[1];
            
            karmaSubscriber(karmaState);
            
            expect(document.body.classList.contains('karma-computational')).toBe(true);
            expect(document.body.getAttribute('data-karma-intensity')).toBeTruthy();
        });

        it('should apply correct karma visual classes based on dominant type', () => {
            const emotionalDominantKarma = {
                computational: 20,
                emotional: 90,
                void: 10,
                temporal: 30
            };
            
            const karmaSubscriber = consciousness.subscribe.mock.calls.find(
                call => call[0] === 'karma'
            )[1];
            
            karmaSubscriber(emotionalDominantKarma);
            
            expect(document.body.classList.contains('karma-emotional')).toBe(true);
            expect(document.body.classList.contains('karma-computational')).toBe(false);
        });

        it('should update fragment visual effects based on karma', () => {
            const karmaState = {
                computational: 70,
                emotional: 30,
                void: 50,
                temporal: 40
            };
            
            const karmaSubscriber = consciousness.subscribe.mock.calls.find(
                call => call[0] === 'karma'
            )[1];
            
            karmaSubscriber(karmaState);
            
            const fragments = document.querySelectorAll('.consciousness-fragment');
            fragments.forEach(fragment => {
                // Check if karma effects are applied based on thresholds
                if (karmaState.computational > 60) {
                    expect(fragment.classList.contains('karma-jitter')).toBe(true);
                }
            });
        });
    });

    describe('Recognition Feedback', () => {
        beforeEach(() => {
            controller.init();
        });

        it('should handle recognition attempts with synchronized feedback', () => {
            const attemptData = { method: 'spacebar', progress: 0.6 };
            
            const attemptHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'recognition:attempt'
            )[1];
            
            attemptHandler(attemptData);
            
            expect(mockAudioEngine.createGlitchBurst).toHaveBeenCalled();
            expect(consciousness.recordEvent).toHaveBeenCalledWith('synchronized_recognition_feedback', expect.objectContaining({
                method: 'spacebar',
                type: 'attempt',
                progress: 0.6
            }));
        });

        it('should handle recognition success with celebration effects', () => {
            const successData = { 
                method: 'center_click', 
                karmaImpact: { computational: 5, emotional: 3, void: -2, temporal: 1 }
            };
            
            const successHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'state:recognitionSucceeded'
            )[1];
            
            successHandler(successData);
            
            expect(mockAudioEngine.achieveResonance).toHaveBeenCalled();
            expect(mockCorruptionProgression.purifyOnRecognition).toHaveBeenCalled();
            expect(document.body.classList.contains('purification-active')).toBe(true);
        });

        it('should handle recognition failure with degradation effects', () => {
            const failureData = {};
            
            const failureHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'state:recognitionFailed'
            )[1];
            
            failureHandler(failureData);
            
            expect(mockAudioEngine.accelerateDegradation).toHaveBeenCalled();
            expect(document.body.classList.contains('corruption-surge')).toBe(true);
        });
    });

    describe('Audio Fallback Mode', () => {
        beforeEach(() => {
            controller.init();
        });

        it('should activate fallback mode on audio initialization failure', () => {
            const error = new Error('Audio initialization failed');
            
            const failureHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'audio:initializationFailed'
            )[1];
            
            failureHandler(error);
            
            expect(controller.audioFallback.isActive).toBe(true);
            expect(document.body.classList.contains('audio-fallback-mode')).toBe(true);
            expect(document.getElementById('visual-audio-indicator')).toBeTruthy();
            expect(consciousness.recordEvent).toHaveBeenCalledWith('audio_fallback_activated', expect.objectContaining({
                reason: error
            }));
        });

        it('should deactivate fallback mode on audio restoration', () => {
            // First activate fallback
            controller.activateAudioFallback('test');
            expect(controller.audioFallback.isActive).toBe(true);
            
            // Then restore audio
            const resumeHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'audio:contextResumed'
            )[1];
            
            resumeHandler();
            
            expect(controller.audioFallback.isActive).toBe(false);
            expect(document.body.classList.contains('audio-fallback-mode')).toBe(false);
            expect(consciousness.recordEvent).toHaveBeenCalledWith('audio_fallback_deactivated', expect.any(Object));
        });

        it('should enhance visual guidance in fallback mode', () => {
            controller.activateAudioFallback('test');
            
            expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--visual-feedback-intensity', '1.5');
            expect(document.getElementById('visual-audio-indicator')).toBeTruthy();
            expect(document.getElementById('visual-rhythm-indicator')).toBeTruthy();
        });
    });

    describe('Synchronization Health', () => {
        beforeEach(() => {
            controller.init();
        });

        it('should return synchronization status', () => {
            const status = controller.getSynchronizationStatus();
            
            expect(status).toHaveProperty('syncState');
            expect(status).toHaveProperty('audioFallback');
            expect(status).toHaveProperty('performanceMetrics');
            expect(status).toHaveProperty('isHealthy');
            expect(typeof status.isHealthy).toBe('boolean');
        });

        it('should detect sync drift and correct it', () => {
            // Set up sync drift scenario
            controller.syncState.audioLevel = 0.8;
            controller.syncState.visualLevel = 0.3;
            controller.syncState.lastSync = Date.now() - 2000; // 2 seconds ago
            
            // Mock the audio engine to return current level
            mockAudioEngine.getDegradationLevel.mockReturnValue(0.8);
            
            controller.performSyncHealthCheck();
            
            expect(controller.performanceMetrics.missedSyncs).toBeGreaterThan(0);
            expect(mockCorruptionProgression.syncWithAudioDegradation).toHaveBeenCalledWith(0.8);
        });
    });

    describe('Parameter Mapping', () => {
        it('should correctly map audio parameters to visual parameters', () => {
            const audioParams = {
                pitchInstability: 7.5,
                harmonicCount: 8,
                noiseLevel: 0.6,
                timeStretch: 0.8,
                harmonicJitter: 0.05,
                granularSize: 0.05
            };
            
            const visualParams = controller.mapAudioToVisualParameters(audioParams);
            
            expect(visualParams.visualJitter).toBe(0.5); // 7.5 / 15
            expect(visualParams.visualComplexity).toBe(0.5); // 8 / 16
            expect(visualParams.corruptionIntensity).toBe(0.6);
            expect(visualParams.animationSpeed).toBe(0.8);
            expect(visualParams.chromaticAberration).toBe(0.5); // 0.05 * 10
            expect(visualParams.visualGrain).toBe(5); // 0.05 * 100
        });

        it('should parse different audio level formats', () => {
            expect(controller.parseAudioLevel(0.7)).toBe(0.7);
            expect(controller.parseAudioLevel('minimal')).toBe(0.2);
            expect(controller.parseAudioLevel('moderate')).toBe(0.5);
            expect(controller.parseAudioLevel('severe')).toBe(0.8);
            expect(controller.parseAudioLevel('complete')).toBe(1.0);
            expect(controller.parseAudioLevel('unknown')).toBe(0.2);
        });
    });

    describe('Cleanup', () => {
        it('should clean up resources on destroy', () => {
            controller.init();
            controller.activateAudioFallback('test');
            
            controller.destroy();
            
            expect(controller.audioFallback.isActive).toBe(false);
            expect(controller.audioFallback.fallbackEffects.size).toBe(0);
            expect(mockGuardian.cleanupAll).toHaveBeenCalled();
        });
    });
});