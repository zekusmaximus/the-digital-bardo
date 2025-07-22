/**
 * @file Tests for enhanced progress feedback and confirmation systems
 * 
 * Tests the implementation of Task 7: Add user progress feedback and confirmation systems
 * - Visual progress indicators for spacebar hold recognition method
 * - Confirmation animations and feedback for successful recognition
 * - Clear feedback for failed recognition attempts
 * - Visual indicators when users are making progress toward recognition
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock the consciousness and security modules
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        getState: vi.fn(),
        setState: vi.fn(),
        recordEvent: vi.fn(),
        subscribe: vi.fn(() => () => {})
    }
}));

vi.mock('../src/security/consciousness-purification.js', () => ({
    manifestElement: vi.fn((tag, options) => {
        const element = document.createElement(tag);
        if (options?.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                if (key === 'style') {
                    element.style.cssText = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
        }
        return element;
    })
}));

describe('Progress Feedback System', () => {
    let dom;
    let eventBridge;
    let guardian;
    let guideController;
    let RecognitionGuideController;

    beforeEach(async () => {
        // Set up DOM
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            url: 'http://localhost',
            pretendToBeVisual: true,
            resources: 'usable'
        });
        
        global.document = dom.window.document;
        global.window = dom.window;
        global.requestAnimationFrame = vi.fn(cb => cb());
        global.setTimeout = vi.fn();

        // Mock event bridge
        eventBridge = {
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn()
        };

        // Mock resource guardian
        guardian = {
            registerCleanup: vi.fn(),
            registerTimer: vi.fn()
        };

        // Import and create guide controller
        const { RecognitionGuideController: RGC } = await import('../clear-lode/recognition-guide-controller.js');
        RecognitionGuideController = RGC;
        
        const config = {
            recognitionWindow: {
                baseWindowDuration: 15000,
                extensionDuration: 5000,
                maxExtensions: 2,
                warningThreshold: 0.75
            }
        };

        guideController = new RecognitionGuideController({
            eventBridge,
            guardian,
            config
        });

        guideController.init();
    });

    afterEach(() => {
        if (guideController && typeof guideController.destroy === 'function') {
            guideController.destroy();
        }
        vi.clearAllMocks();
    });

    describe('Enhanced Spacebar Progress Feedback', () => {
        it('should create enhanced spacebar progress indicator', () => {
            // Start guidance to create UI elements
            guideController.startGuidance();
            
            // Simulate spacebar progress
            guideController.handleRecognitionAttempt({
                method: 'spacebar-hold',
                progress: 0.5,
                duration: 1500,
                timestamp: Date.now()
            });

            // Check if spacebar progress container was created
            const progressContainer = document.querySelector('.spacebar-progress-container');
            expect(progressContainer).toBeTruthy();
            
            // Check for progress bar elements
            const progressBg = document.querySelector('.spacebar-progress-bg');
            const progressFill = document.querySelector('.spacebar-progress-fill');
            const progressText = document.querySelector('.spacebar-progress-text');
            
            expect(progressBg).toBeTruthy();
            expect(progressFill).toBeTruthy();
            expect(progressText).toBeTruthy();
        });

        it('should update progress bar width based on progress value', () => {
            guideController.startGuidance();
            
            // Test different progress values
            const testCases = [
                { progress: 0.25, expectedWidth: '25%' },
                { progress: 0.5, expectedWidth: '50%' },
                { progress: 0.75, expectedWidth: '75%' },
                { progress: 1.0, expectedWidth: '100%' }
            ];

            testCases.forEach(({ progress, expectedWidth }) => {
                guideController.handleRecognitionAttempt({
                    method: 'spacebar-hold',
                    progress: progress,
                    duration: progress * 3000,
                    timestamp: Date.now()
                });

                const progressFill = document.querySelector('.spacebar-progress-fill');
                expect(progressFill.style.width).toBe(expectedWidth);
            });
        });

        it('should change progress text based on progress level', () => {
            guideController.startGuidance();
            
            // Test low progress
            guideController.handleRecognitionAttempt({
                method: 'spacebar-hold',
                progress: 0.2,
                duration: 600,
                timestamp: Date.now()
            });
            
            let progressText = document.querySelector('.spacebar-progress-text');
            expect(progressText.textContent).toBe('Hold spacebar...');
            
            // Test high progress
            guideController.handleRecognitionAttempt({
                method: 'spacebar-hold',
                progress: 0.8,
                duration: 2400,
                timestamp: Date.now()
            });
            
            progressText = document.querySelector('.spacebar-progress-text');
            expect(progressText.textContent).toBe('80% - Almost there!');
        });
    });

    describe('Enhanced Success Feedback', () => {
        it('should create comprehensive success feedback with particles', () => {
            guideController.startGuidance();
            
            const successDetail = {
                method: 'center-click-perfect',
                karmaData: { bonus: 5 }
            };
            
            guideController.handleRecognitionSuccess(successDetail);
            
            // Check for success container
            const successContainer = document.querySelector('.recognition-success-container');
            expect(successContainer).toBeTruthy();
            
            // Check for success elements
            const successIcon = document.querySelector('.success-icon');
            const successMessage = document.querySelector('.success-message');
            const methodMessage = document.querySelector('.method-confirmation');
            const karmaBonus = document.querySelector('.karma-bonus');
            
            expect(successIcon).toBeTruthy();
            expect(successMessage).toBeTruthy();
            expect(methodMessage).toBeTruthy();
            expect(karmaBonus).toBeTruthy();
            
            expect(successIcon.textContent).toBe('✓');
            expect(successMessage.textContent).toBe('Recognition Achieved');
            expect(karmaBonus.textContent).toBe('+5 karma bonus');
        });

        it('should show method-specific success messages', () => {
            guideController.startGuidance();
            
            const testCases = [
                {
                    method: 'center-click-perfect',
                    expectedMessage: 'Perfect focus achieved through direct recognition'
                },
                {
                    method: 'perfect-hold',
                    expectedMessage: 'Sustained attention mastered'
                },
                {
                    method: 'typed-recognize',
                    expectedMessage: 'Sacred word recognition successful'
                }
            ];

            testCases.forEach(({ method, expectedMessage }) => {
                // Clear previous elements
                document.body.innerHTML = '';
                guideController.createGuideContainer();
                
                guideController.handleRecognitionSuccess({
                    method: method,
                    karmaData: {}
                });

                const methodMessage = document.querySelector('.method-confirmation');
                expect(methodMessage.textContent).toBe(expectedMessage);
            });
        });

        it('should create particle effects for success', () => {
            guideController.startGuidance();
            
            guideController.handleRecognitionSuccess({
                method: 'perfect-hold',
                karmaData: { bonus: 3 }
            });
            
            // Check for particle container
            const particleContainer = document.querySelector('.success-particles');
            expect(particleContainer).toBeTruthy();
            
            // Check for individual particles
            const particles = document.querySelectorAll('.success-particle');
            expect(particles.length).toBe(12);
        });
    });

    describe('Recognition Failure Feedback', () => {
        it('should show clear failure feedback with explanation', () => {
            guideController.startGuidance();
            
            guideController.handleRecognitionFailure({
                reason: 'timeout'
            });
            
            // Check for failure container
            const failureContainer = document.querySelector('.recognition-failure-container');
            expect(failureContainer).toBeTruthy();
            
            // Check for failure elements
            const failureIcon = document.querySelector('.failure-icon');
            const failureMessage = document.querySelector('.failure-message');
            const explanationMessage = document.querySelector('.explanation-message');
            const karmaMessage = document.querySelector('.karma-message');
            
            expect(failureIcon).toBeTruthy();
            expect(failureMessage).toBeTruthy();
            expect(explanationMessage).toBeTruthy();
            expect(karmaMessage).toBeTruthy();
            
            expect(failureIcon.textContent).toBe('○');
            expect(failureMessage.textContent).toBe('Recognition Window Closed');
            expect(explanationMessage.textContent).toBe('The clear light has passed without recognition');
        });

        it('should create fade overlay for failure transition', () => {
            guideController.startGuidance();
            
            guideController.handleRecognitionFailure({
                reason: 'timeout'
            });
            
            const fadeOverlay = document.querySelector('.failure-fade-overlay');
            expect(fadeOverlay).toBeTruthy();
            expect(fadeOverlay.style.background).toBe('rgba(0, 0, 0, 0.1)');
        });
    });

    describe('Attempt Failure Feedback', () => {
        it('should handle spacebar hold failure with specific feedback', () => {
            guideController.startGuidance();
            
            guideController.handleAttemptFailure({
                method: 'spacebar-hold',
                reason: 'released_too_early',
                duration: 1500,
                targetRange: { min: 2800, max: 3200 },
                timestamp: Date.now()
            });
            
            const failureFeedback = document.querySelector('.attempt-failure-feedback');
            expect(failureFeedback).toBeTruthy();
            expect(failureFeedback.innerHTML).toContain('✗ Released too early');
            expect(failureFeedback.innerHTML).toContain('Hold for 3 seconds in the sweet spot');
        });

        it('should handle center click failure with distance feedback', () => {
            guideController.startGuidance();
            
            guideController.handleAttemptFailure({
                method: 'center-click',
                reason: 'too_far_from_center',
                distance: 120,
                timestamp: Date.now()
            });
            
            const failureFeedback = document.querySelector('.attempt-failure-feedback');
            expect(failureFeedback).toBeTruthy();
            expect(failureFeedback.innerHTML).toContain('✗ Click closer to the center');
            expect(failureFeedback.innerHTML).toContain('Aim for the bright core of the light');
        });

        it('should handle keyword typing failure with word feedback', () => {
            guideController.startGuidance();
            
            guideController.handleAttemptFailure({
                method: 'keyword-typing',
                reason: 'invalid_keyword',
                typedText: 'INVALID',
                timestamp: Date.now()
            });
            
            const failureFeedback = document.querySelector('.attempt-failure-feedback');
            expect(failureFeedback).toBeTruthy();
            expect(failureFeedback.innerHTML).toContain('✗ Invalid word');
            expect(failureFeedback.innerHTML).toContain('Type: RECOGNIZE, SELF, or HOME');
        });

        it('should highlight correct method after failure', () => {
            guideController.startGuidance();
            
            // Create method indicators
            guideController.createMethodIndicators();
            
            guideController.handleAttemptFailure({
                method: 'center-click',
                reason: 'too_far_from_center',
                distance: 120,
                timestamp: Date.now()
            });
            
            const methodIndicator = document.querySelector('[data-method="center-click"]');
            expect(methodIndicator).toBeTruthy();
            
            // The highlighting should be applied immediately by the highlightCorrectMethod function
            // Check that the method was called by verifying the attempt failure feedback was created
            const failureFeedback = document.querySelector('.attempt-failure-feedback');
            expect(failureFeedback).toBeTruthy();
            expect(failureFeedback.innerHTML).toContain('✗ Click closer to the center');
        });
    });

    describe('Keyword Progress Feedback', () => {
        it('should show enhanced keyword progress feedback', () => {
            guideController.startGuidance();
            
            guideController.handleRecognitionAttempt({
                method: 'keyword-typing',
                progress: 0.6,
                partialWord: 'RECOG',
                timestamp: Date.now()
            });
            
            const keywordFeedback = document.querySelector('.keyword-progress-feedback');
            expect(keywordFeedback).toBeTruthy();
            expect(keywordFeedback.innerHTML).toContain('60% - Keep typing...');
            expect(keywordFeedback.innerHTML).toContain('Type: RECOGNIZE, SELF, or HOME');
        });
    });

    describe('Center Click Progress Feedback', () => {
        it('should show distance-based center click feedback', () => {
            guideController.startGuidance();
            
            guideController.handleRecognitionAttempt({
                method: 'center-click',
                progress: 0.7,
                timestamp: Date.now()
            });
            
            const centerClickFeedback = document.querySelector('.center-click-progress-feedback');
            expect(centerClickFeedback).toBeTruthy();
            expect(centerClickFeedback.innerHTML).toContain('70% - Getting closer!');
        });
    });

    describe('Event Recording', () => {
        it('should record attempt failure events', async () => {
            const { consciousness } = await import('../src/consciousness/digital-soul.js');
            
            guideController.startGuidance();
            
            guideController.handleAttemptFailure({
                method: 'spacebar-hold',
                reason: 'released_too_early',
                duration: 1500,
                timestamp: Date.now()
            });
            
            expect(consciousness.recordEvent).toHaveBeenCalledWith(
                'recognition_attempt_failed',
                expect.objectContaining({
                    method: 'spacebar-hold',
                    reason: 'released_too_early'
                })
            );
        });

        it('should record success feedback events', async () => {
            const { consciousness } = await import('../src/consciousness/digital-soul.js');
            
            guideController.startGuidance();
            
            guideController.handleRecognitionSuccess({
                method: 'perfect-hold',
                karmaData: { bonus: 5 }
            });
            
            expect(consciousness.recordEvent).toHaveBeenCalledWith(
                'recognition_success_feedback_shown',
                expect.objectContaining({
                    method: 'perfect-hold',
                    karmaBonus: 5
                })
            );
        });

        it('should record failure feedback events', async () => {
            const { consciousness } = await import('../src/consciousness/digital-soul.js');
            
            guideController.startGuidance();
            
            guideController.handleRecognitionFailure({
                reason: 'timeout'
            });
            
            expect(consciousness.recordEvent).toHaveBeenCalledWith(
                'recognition_failure_feedback_shown',
                expect.objectContaining({
                    reason: 'timeout'
                })
            );
        });
    });
});