/**
 * Test suite for the enhanced RecognitionHandler with three recognition methods
 */
import { RecognitionHandler } from '../clear-lode/recognition-handler.js';

// Mock GSAP for testing
global.gsap = {
    fromTo: jest.fn().mockReturnValue({
        kill: jest.fn()
    })
};

// Mock DOM methods
global.document = {
    createElement: jest.fn().mockReturnValue({
        style: {},
        setAttribute: jest.fn(),
        addEventListener: jest.fn(),
        remove: jest.fn(),
        appendChild: jest.fn()
    }),
    createElementNS: jest.fn().mockReturnValue({
        setAttribute: jest.fn(),
        getAttribute: jest.fn().mockReturnValue('1256.64'),
        appendChild: jest.fn()
    }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    querySelector: jest.fn().mockReturnValue({
        appendChild: jest.fn()
    }),
    getElementById: jest.fn().mockReturnValue(null),
    body: {
        appendChild: jest.fn()
    }
};

global.window = {
    innerWidth: 1920,
    innerHeight: 1080,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
};

global.requestAnimationFrame = jest.fn(cb => cb());
global.setTimeout = jest.fn();
global.clearTimeout = jest.fn();

describe('RecognitionHandler Enhanced Methods', () => {
    let handler;
    let mockOrchestrator;

    beforeEach(() => {
        mockOrchestrator = {
            localState: {
                recognitionAvailable: true,
                recognized: false,
                startTime: Date.now()
            }
        };
        
        handler = new RecognitionHandler(mockOrchestrator);
        
        // Reset mocks
        jest.clearAllMocks();
        global.window.dispatchEvent.mockClear();
    });

    test('constructor initializes new recognition state', () => {
        expect(handler.recognitionWindowActive).toBe(false);
        expect(handler.methodsEnabled).toBe(true);
        expect(handler.recognitionAchieved).toBe(false);
        expect(handler.centerPoint).toEqual({ x: 960, y: 540 });
        expect(handler.typedBuffer).toBe('');
        expect(handler.spacebarDownTime).toBe(null);
    });

    test('achieveRecognition dispatches with karma data', () => {
        handler.windowStartTime = Date.now() - 4000; // In window
        const karmaData = { distance: 5, bonus: 5 };
        
        handler.achieveRecognition('center-click-perfect', karmaData);
        
        expect(handler.recognitionAchieved).toBe(true);
        expect(global.window.dispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'recognition:success',
                detail: expect.objectContaining({
                    method: 'center-click-perfect',
                    karmaData: expect.objectContaining({
                        distance: 5,
                        bonus: 5,
                        elapsedTime: expect.any(Number),
                        perfectTimingBonus: expect.any(Number)
                    })
                })
            })
        );
    });

    test('isInWindow returns correct timing', () => {
        handler.windowStartTime = Date.now() - 4000; // 4 seconds ago
        expect(handler.isInWindow()).toBe(true);
        
        handler.windowStartTime = Date.now() - 1000; // 1 second ago
        expect(handler.isInWindow()).toBe(false);
        
        handler.windowStartTime = Date.now() - 8000; // 8 seconds ago
        expect(handler.isInWindow()).toBe(false);
    });

    test('updateCenterPoint calculates correct center', () => {
        global.window.innerWidth = 1600;
        global.window.innerHeight = 900;
        
        handler.updateCenterPoint();
        
        expect(handler.centerPoint).toEqual({ x: 800, y: 450 });
    });

    test('debounce function works correctly', () => {
        const mockFn = jest.fn();
        const debouncedFn = handler.debounce(mockFn, 100);
        
        debouncedFn();
        debouncedFn();
        debouncedFn();
        
        expect(mockFn).not.toHaveBeenCalled();
        
        // Fast-forward time
        jest.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('cleanupUI removes created elements', () => {
        const mockTypingElement = { remove: jest.fn() };
        const mockProgressElement = { remove: jest.fn() };
        
        global.document.getElementById
            .mockReturnValueOnce(mockTypingElement)
            .mockReturnValueOnce(mockProgressElement);
        
        handler.cleanupUI();
        
        expect(mockTypingElement.remove).toHaveBeenCalled();
        expect(mockProgressElement.remove).toHaveBeenCalled();
    });

    test('startListening sets up recognition window and methods', () => {
        handler.startListening();
        
        expect(handler.isListening).toBe(true);
        expect(handler.recognitionWindowActive).toBe(true);
        expect(handler.windowStartTime).toBeTruthy();
        expect(global.document.addEventListener).toHaveBeenCalled();
        expect(global.window.addEventListener).toHaveBeenCalled();
    });

    test('stopListening cleans up properly', () => {
        handler.listeners = [
            { type: 'click', handler: jest.fn() },
            { type: 'keydown', handler: jest.fn(), element: global.window }
        ];
        handler.progressAnimation = { kill: jest.fn() };
        
        handler.stopListening();
        
        expect(handler.isListening).toBe(false);
        expect(handler.recognitionWindowActive).toBe(false);
        expect(handler.listeners).toEqual([]);
        expect(handler.progressAnimation.kill).toHaveBeenCalled();
    });
});
