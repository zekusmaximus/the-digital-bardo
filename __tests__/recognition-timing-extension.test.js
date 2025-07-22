/**
 * @file Tests for recognition timing and extension system
 * @description Verifies that the recognition window timing, timeout warnings,
 * and extension logic work correctly according to requirements.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RecognitionGuideController } from '../clear-lode/recognition-guide-controller.js';
import { ClearLodeEventBridge } from '../clear-lode/event-bridge.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

// Mock consciousness
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        recordEvent: vi.fn(),
        getState: vi.fn(),
        setState: vi.fn()
    }
}));

// Mock DOM methods
global.window = global.window || {};
global.window.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));

global.document = {
    body: {
        appendChild: vi.fn(),
        removeChild: vi.fn()
    },
    head: {
        appendChild: vi.fn()
    },
    createElement: vi.fn(() => ({
        appendChild: vi.fn(),
        remove: vi.fn(),
        addEventListener: vi.fn(),
        style: {},
        textContent: '',
        innerHTML: '',
        parentNode: true,
        querySelector: vi.fn(),
        querySelectorAll: vi.fn(() => [])
    })),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => [])
};

describe('Recognition Timing and Extension System', () => {
    let eventBridge;
    let guardian;
    let guideController;
    let config;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.clearAllTimers();
        vi.useFakeTimers();

        eventBridge = new ClearLodeEventBridge();
        guardian = new ResourceGuardian();
        
        config = {
            recognitionWindow: {
                baseWindowDuration: 15000,  // 15 seconds
                extensionDuration: 5000,    // 5 seconds per extension
                maxExtensions: 2,           // Maximum extensions
                warningThreshold: 0.75      // Warning at 75% elapsed
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
        vi.useRealTimers();
        if (guideController) {
            guideController.destroy();
        }
        if (guardian) {
            guardian.cleanupAll();
        }
    });

    describe('Minimum Recognition Window Duration', () => {
        it('should set minimum window duration to 15 seconds', () => {
            expect(guideController.baseWindowDuration).toBe(15000);
        });

        it('should use configuration values for timing', () => {
            expect(guideController.baseWindowDuration).toBe(config.recognitionWindow.baseWindowDuration);
            expect(guideController.extensionDuration).toBe(config.recognitionWindow.extensionDuration);
            expect(guideController.maxTimeExtensions).toBe(config.recognitionWindow.maxExtensions);
            expect(guideController.warningThreshold).toBe(config.recognitionWindow.warningThreshold);
        });
    });

    describe('Timeout Warning System', () => {
        it('should show timeout warning at 75% of window duration', () => {
            const showTimeoutWarningSpy = vi.spyOn(guideController, 'showTimeoutWarning');
            
            // Start guidance
            guideController.startGuidance();
            
            // Fast-forward to warning time (75% of 15 seconds = 11.25 seconds)
            vi.advanceTimersByTime(11250);
            
            expect(showTimeoutWarningSpy).toHaveBeenCalled();
        });

        it('should show countdown in timeout warning', () => {
            guideController.startGuidance();
            
            // Fast-forward to warning time
            vi.advanceTimersByTime(11250);
            
            // Verify countdown animation was started
            const startCountdownSpy = vi.spyOn(guideController, 'startCountdownAnimation');
            guideController.showTimeoutWarning();
            
            expect(startCountdownSpy).toHaveBeenCalled();
        });

        it('should handle timeout after full window duration', () => {
            const handleTimeoutSpy = vi.spyOn(guideController, 'handleTimeout');
            
            guideController.startGuidance();
            
            // Fast-forward to full timeout (15 seconds)
            vi.advanceTimersByTime(15000);
            
            expect(handleTimeoutSpy).toHaveBeenCalled();
        });
    });

    describe('Time Extension Logic', () => {
        it('should extend window when user is active', () => {
            const extendWindowSpy = vi.spyOn(guideController, 'extendRecognitionWindow');
            
            guideController.startGuidance();
            
            // Mark user as active
            guideController.isUserActive = true;
            guideController.lastActivityTime = Date.now();
            
            // Fast-forward to timeout
            vi.advanceTimersByTime(15000);
            
            expect(extendWindowSpy).toHaveBeenCalled();
        });

        it('should not extend beyond maximum extensions', () => {
            guideController.startGuidance();
            guideController.timeExtensions = 2; // Already at max
            
            const result = guideController.extendRecognitionWindow();
            
            expect(guideController.timeExtensions).toBe(2); // Should not increase
        });

        it('should extend window on high-progress recognition attempts', () => {
            const extendWindowSpy = vi.spyOn(guideController, 'extendRecognitionWindow');
            
            guideController.startGuidance();
            
            // Fast-forward to near timeout
            vi.advanceTimersByTime(14000);
            
            // Simulate high-progress attempt
            guideController.handleRecognitionAttempt({
                method: 'spacebar-hold',
                progress: 0.8,
                timestamp: Date.now()
            });
            
            expect(extendWindowSpy).toHaveBeenCalled();
        });

        it('should not extend on low-progress attempts', () => {
            const extendWindowSpy = vi.spyOn(guideController, 'extendRecognitionWindow');
            
            guideController.startGuidance();
            
            // Fast-forward to near timeout
            vi.advanceTimersByTime(14000);
            
            // Simulate low-progress attempt
            guideController.handleRecognitionAttempt({
                method: 'center-click',
                progress: 0.1,
                timestamp: Date.now()
            });
            
            expect(extendWindowSpy).not.toHaveBeenCalled();
        });
    });

    describe('Extension Notifications', () => {
        it('should show extension notification when window is extended', () => {
            const showExtensionSpy = vi.spyOn(guideController, 'showExtensionNotification');
            
            guideController.startGuidance();
            guideController.extendRecognitionWindow();
            
            expect(showExtensionSpy).toHaveBeenCalled();
        });

        it('should update progress bar when window is extended', () => {
            const updateProgressSpy = vi.spyOn(guideController, 'updateProgressBar');
            
            guideController.startGuidance();
            guideController.extendRecognitionWindow();
            
            expect(updateProgressSpy).toHaveBeenCalled();
        });

        it('should reschedule timeout warning after extension', () => {
            const scheduleWarningSpy = vi.spyOn(guideController, 'scheduleTimeoutWarning');
            
            guideController.startGuidance();
            scheduleWarningSpy.mockClear(); // Clear initial call
            
            guideController.extendRecognitionWindow();
            
            expect(scheduleWarningSpy).toHaveBeenCalled();
        });
    });

    describe('Transition Indicators', () => {
        it('should show transition indicator when recognition phase ends', () => {
            const showTransitionSpy = vi.spyOn(guideController, 'showTransitionIndicator');
            
            guideController.startGuidance();
            guideController.timeExtensions = 2; // Max extensions used
            
            // Fast-forward to timeout
            vi.advanceTimersByTime(15000);
            
            expect(showTransitionSpy).toHaveBeenCalled();
        });

        it('should emit timeout event after showing transition', () => {
            const emitSpy = vi.spyOn(eventBridge, 'emit');
            
            guideController.startGuidance();
            guideController.timeExtensions = 2; // Max extensions used
            
            // Fast-forward to timeout
            vi.advanceTimersByTime(15000);
            
            // Fast-forward through transition delay
            vi.advanceTimersByTime(2000);
            
            expect(emitSpy).toHaveBeenCalledWith('recognition:timeout');
        });

        it('should show final chance warning for inactive users', () => {
            const showFinalChanceSpy = vi.spyOn(guideController, 'showFinalChanceWarning');
            
            guideController.startGuidance();
            guideController.isUserActive = false; // User not active
            
            // Fast-forward to timeout
            vi.advanceTimersByTime(15000);
            
            expect(showFinalChanceSpy).toHaveBeenCalled();
        });
    });

    describe('Activity Tracking', () => {
        it('should track user activity through recognition attempts', () => {
            guideController.startGuidance();
            
            expect(guideController.isUserActive).toBe(false);
            
            guideController.handleRecognitionAttempt({
                method: 'center-click',
                progress: 0.5,
                timestamp: Date.now()
            });
            
            expect(guideController.isUserActive).toBe(true);
            expect(guideController.lastActivityTime).toBeTruthy();
        });

        it('should reset activity flag after inactivity period', () => {
            guideController.startGuidance();
            guideController.isUserActive = true;
            guideController.lastActivityTime = Date.now() - 3000; // 3 seconds ago
            
            // Fast-forward to trigger activity reset
            vi.advanceTimersByTime(1000);
            
            expect(guideController.isUserActive).toBe(false);
        });
    });

    describe('Configuration Integration', () => {
        it('should use custom configuration values', () => {
            const customConfig = {
                recognitionWindow: {
                    baseWindowDuration: 20000,
                    extensionDuration: 3000,
                    maxExtensions: 3,
                    warningThreshold: 0.8
                }
            };

            const customController = new RecognitionGuideController({
                eventBridge,
                guardian,
                config: customConfig
            });

            expect(customController.baseWindowDuration).toBe(20000);
            expect(customController.extensionDuration).toBe(3000);
            expect(customController.maxTimeExtensions).toBe(3);
            expect(customController.warningThreshold).toBe(0.8);

            customController.destroy();
        });

        it('should fall back to defaults if config is incomplete', () => {
            const incompleteConfig = {
                recognitionWindow: {
                    baseWindowDuration: 10000
                    // Missing other properties
                }
            };

            const fallbackController = new RecognitionGuideController({
                eventBridge,
                guardian,
                config: incompleteConfig
            });

            expect(fallbackController.baseWindowDuration).toBe(10000);
            expect(fallbackController.extensionDuration).toBe(5000); // Default
            expect(fallbackController.maxTimeExtensions).toBe(2); // Default
            expect(fallbackController.warningThreshold).toBe(0.75); // Default

            fallbackController.destroy();
        });
    });
});