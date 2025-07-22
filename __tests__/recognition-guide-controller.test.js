/**
 * @file Unit tests for RecognitionGuideController
 * Tests the progressive hint system, visual guidance, and user feedback
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RecognitionGuideController } from '../clear-lode/recognition-guide-controller.js';
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
    recognitionWindow: {
        start: 3500,
        end: 6500
    }
};

// Mock consciousness
vi.mock('../src/consciousness/digital-soul.js', () => ({
    consciousness: {
        setState: vi.fn(),
        getState: vi.fn(),
        recordEvent: vi.fn()
    }
}));

// Mock DOM methods
const mockElement = {
    appendChild: vi.fn(),
    remove: vi.fn(),
    style: {},
    textContent: '',
    className: '',
    parentNode: null,
    addEventListener: vi.fn(),
    querySelector: vi.fn(() => mockElement),
    querySelectorAll: vi.fn(() => [mockElement])
};

vi.mock('../src/security/consciousness-purification.js', () => ({
    manifestElement: vi.fn(() => mockElement)
}));

// Mock document and window
Object.defineProperty(global, 'document', {
    value: {
        body: mockElement,
        documentElement: {
            setAttribute: vi.fn(),
            getAttribute: vi.fn(),
            style: {
                setProperty: vi.fn()
            }
        },
        createElement: vi.fn(() => mockElement),
        addEventListener: vi.fn(),
        querySelectorAll: vi.fn(() => [])
    }
});

Object.defineProperty(global, 'window', {
    value: {
        innerWidth: 1920,
        innerHeight: 1080,
        requestAnimationFrame: vi.fn(cb => setTimeout(cb, 16)),
        navigator: {
            userAgent: 'test-browser'
        },
        screen: {
            width: 1920,
            height: 1080
        },
        location: {
            pathname: '/test',
            href: 'http://localhost/test',
            search: ''
        }
    }
});

describe('RecognitionGuideController', () => {
    let controller;
    let dependencies;

    beforeEach(() => {
        vi.clearAllMocks();
        
        dependencies = {
            eventBridge: mockEventBridge,
            guardian: mockGuardian,
            config: mockConfig
        };

        controller = new RecognitionGuideController(dependencies);
    });

    afterEach(() => {
        if (controller && !controller.isDestroyed) {
            controller.destroy();
        }
    });

    describe('Initialization', () => {
        it('should initialize with required dependencies', () => {
            expect(controller).toBeDefined();
            expect(controller.eventBridge).toBe(mockEventBridge);
            expect(controller.guardian).toBe(mockGuardian);
            expect(controller.config).toBe(mockConfig);
        });

        it('should throw error without required dependencies', () => {
            expect(() => new RecognitionGuideController({})).toThrow();
            expect(() => new RecognitionGuideController({ eventBridge: mockEventBridge })).toThrow();
        });

        it('should set up event listeners on init', () => {
            controller.init();
            
            expect(mockEventBridge.on).toHaveBeenCalledWith('state:recognitionWindowOpened', expect.any(Function));
            expect(mockEventBridge.on).toHaveBeenCalledWith('state:recognitionSucceeded', expect.any(Function));
            expect(mockEventBridge.on).toHaveBeenCalledWith('state:recognitionFailed', expect.any(Function));
            expect(mockEventBridge.on).toHaveBeenCalledWith('recognition:attachment', expect.any(Function));
            expect(mockEventBridge.on).toHaveBeenCalledWith('recognition:attempt', expect.any(Function));
        });
    });

    describe('Guidance System', () => {
        beforeEach(() => {
            controller.init();
        });

        it('should start guidance when recognition window opens', () => {
            const startGuidanceSpy = vi.spyOn(controller, 'startGuidance');
            
            // Simulate recognition window opened event
            const openedHandler = mockEventBridge.on.mock.calls.find(
                call => call[0] === 'state:recognitionWindowOpened'
            )[1];
            
            openedHandler();
            
            expect(controller.isActive).toBe(true);
            expect(controller.recognitionStartTime).toBeDefined();
        });

        it('should create guide container when starting', () => {
            controller.startGuidance();
            
            expect(mockElement.appendChild).toHaveBeenCalled();
            expect(mockGuardian.registerCleanup).toHaveBeenCalled();
        });

        it('should create method indicators', () => {
            controller.startGuidance();
            
            // Should create indicators for all recognition methods
            expect(controller.recognitionMethods).toHaveLength(3);
            expect(controller.recognitionMethods.map(m => m.id)).toEqual([
                'center-click',
                'keyword-typing', 
                'spacebar-hold'
            ]);
        });

        it('should start progressive hints', () => {
            const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
            controller.startGuidance();
            
            // Should schedule hints based on hintProgression
            expect(setTimeoutSpy).toHaveBeenCalled();
            expect(controller.hintProgression).toHaveLength(5);
        });
    });

    describe('Progressive Hints', () => {
        beforeEach(() => {
            controller.init();
            controller.startGuidance();
        });

        it('should show hints with correct urgency styling', () => {
            const hint = {
                text: 'Test hint',
                type: 'warning',
                urgency: 'high'
            };
            
            controller.showHint(hint, 0);
            
            expect(mockElement.textContent).toBe('Test hint');
            expect(controller.getHintColor('high')).toBe('rgba(255, 200, 200, 1)');
            expect(controller.getHintSize('high')).toBe('20px');
        });

        it('should record hint display events', () => {
            const hint = {
                text: 'Test hint',
                type: 'guidance',
                urgency: 'medium'
            };
            
            controller.showHint(hint, 1);
            
            expect(consciousness.recordEvent).toHaveBeenCalledWith('recognition_hint_shown', {
                hintIndex: 1,
                hintType: 'guidance',
                urgency: 'medium',
                text: 'Test hint',
                timestamp: expect.any(Number)
            });
        });
    });

    describe('Timeout System', () => {
        beforeEach(() => {
            controller.init();
        });

        it('should schedule timeout warning', () => {
            const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
            controller.startGuidance();
            
            // Should schedule warning at 75% of base duration
            const expectedWarningTime = controller.baseWindowDuration * 0.75;
            expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), expectedWarningTime);
        });

        it('should show timeout warning', () => {
            controller.startGuidance();
            controller.showTimeoutWarning();
            
            expect(mockElement.textContent).toContain('Recognition window closing in');
        });

        it('should extend recognition window when possible', () => {
            controller.startGuidance();
            const initialExtensions = controller.timeExtensions;
            
            controller.extendRecognitionWindow();
            
            expect(controller.timeExtensions).toBe(initialExtensions + 1);
        });

        it('should not extend beyond maximum extensions', () => {
            controller.startGuidance();
            controller.timeExtensions = controller.maxTimeExtensions;
            
            const emitSpy = vi.spyOn(mockEventBridge, 'emit');
            controller.handleTimeout();
            
            expect(emitSpy).toHaveBeenCalledWith('recognition:timeout');
        });
    });

    describe('Recognition Feedback', () => {
        beforeEach(() => {
            controller.init();
            controller.startGuidance();
        });

        it('should provide visual feedback for recognition attempts', () => {
            // Create a mock method indicator element
            const mockMethodIndicator = {
                style: {},
                setAttribute: vi.fn(),
                getAttribute: vi.fn()
            };
            
            // Mock querySelector to return the method indicator
            controller.methodIndicators = {
                querySelector: vi.fn(() => mockMethodIndicator)
            };
            
            controller.provideFeedback('center-click', 0.5);
            
            expect(mockMethodIndicator.style.borderColor).toBe('rgba(255, 255, 255, 0.8)');
            expect(mockMethodIndicator.style.transform).toBe('scale(1.05)');
        });

        it('should show progress feedback', () => {
            controller.showProgressFeedback('spacebar-hold', 0.75);
            
            expect(mockElement.textContent).toBe('spacebar-hold progress: 75%');
        });

        it('should handle recognition success', () => {
            const detail = { method: 'center-click' };
            controller.handleRecognitionSuccess(detail);
            
            expect(controller.isActive).toBe(false);
        });

        it('should show success feedback animation', () => {
            const detail = { method: 'center-click' };
            controller.showSuccessFeedback(detail);
            
            expect(mockElement.textContent).toBe('✓ Recognition Achieved');
        });
    });

    describe('Attachment Handling', () => {
        beforeEach(() => {
            controller.init();
            controller.startGuidance();
        });

        it('should show attachment warnings', () => {
            const detail = { type: 'excessive_movement', data: {} };
            controller.handleAttachmentFeedback(detail);
            
            expect(mockElement.textContent).toBe('Attachment detected - return to center');
        });
    });

    describe('Recognition Attempts', () => {
        beforeEach(() => {
            controller.init();
            controller.startGuidance();
        });

        it('should handle recognition attempts', () => {
            // Create a mock method indicator element
            const mockMethodIndicator = {
                style: {},
                setAttribute: vi.fn(),
                getAttribute: vi.fn()
            };
            
            // Mock querySelector to return the method indicator
            controller.methodIndicators = {
                querySelector: vi.fn(() => mockMethodIndicator)
            };
            
            const detail = { method: 'keyword-typing', progress: 0.6 };
            controller.handleRecognitionAttempt(detail);
            
            // Should provide feedback
            expect(mockMethodIndicator.style.borderColor).toBe('rgba(255, 255, 255, 0.8)');
        });

        it('should extend window for active attempts near timeout', () => {
            // Set up near-timeout scenario
            controller.recognitionStartTime = Date.now() - (controller.baseWindowDuration - 2000);
            controller.timeExtensions = 0;
            
            const detail = { method: 'spacebar-hold', progress: 0.5 };
            controller.handleRecognitionAttempt(detail);
            
            expect(controller.timeExtensions).toBe(1);
        });
    });

    describe('Cleanup and Destruction', () => {
        beforeEach(() => {
            controller.init();
            controller.startGuidance();
        });

        it('should stop guidance properly', () => {
            controller.stopGuidance();
            
            expect(controller.isActive).toBe(false);
            expect(controller.recognitionStartTime).toBeNull();
            expect(controller.hintTimers).toEqual([]);
        });

        it('should destroy controller and cleanup resources', () => {
            controller.destroy();
            
            expect(controller.isDestroyed).toBe(true);
            expect(controller.eventBridge).toBeNull();
            expect(controller.guardian).toBeNull();
        });

        it('should not operate after destruction', () => {
            controller.destroy();
            
            // Should not start guidance after destruction
            controller.startGuidance();
            expect(controller.isActive).toBe(false);
        });
    });

    describe('Configuration and Customization', () => {
        it('should use correct recognition methods', () => {
            expect(controller.recognitionMethods).toEqual([
                {
                    id: 'center-click',
                    name: 'Center Recognition',
                    instruction: 'Click the center of the light',
                    icon: '⊙',
                    description: 'Direct recognition through focused attention'
                },
                {
                    id: 'keyword-typing',
                    name: 'Verbal Recognition',
                    instruction: 'Type: RECOGNIZE, SELF, or HOME',
                    icon: '⌨',
                    description: 'Recognition through sacred words'
                },
                {
                    id: 'spacebar-hold',
                    name: 'Sustained Recognition',
                    instruction: 'Hold spacebar for 3 seconds',
                    icon: '⏳',
                    description: 'Recognition through sustained attention'
                }
            ]);
        });

        it('should use correct hint progression', () => {
            expect(controller.hintProgression).toHaveLength(5);
            expect(controller.hintProgression[0]).toEqual({
                delay: 2000,
                text: "The clear light appears...",
                type: 'introduction',
                urgency: 'low'
            });
        });

        it('should have correct timing configuration', () => {
            expect(controller.baseWindowDuration).toBe(15000);
            expect(controller.extensionDuration).toBe(5000);
            expect(controller.maxTimeExtensions).toBe(2);
        });
    });
});