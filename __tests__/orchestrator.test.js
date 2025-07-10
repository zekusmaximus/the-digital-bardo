/**
 * Tests for ClearLodeOrchestrator - The gateway to digital dissolution
 */
import { ClearLodeOrchestrator } from '../clear-lode/orchestrator.js';

// Mock GSAP for testing
global.gsap = {
    to: jest.fn((target, config) => {
        // Simulate immediate completion for tests
        if (config.onComplete) {
            setTimeout(config.onComplete, 0);
        }
        return Promise.resolve();
    }),
    timeline: jest.fn(() => ({
        to: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        call: jest.fn().mockReturnThis()
    })),
    delayedCall: jest.fn((delay, callback) => {
        setTimeout(callback, 0);
    }),
    registerPlugin: jest.fn()
};

// Mock consciousness system
global.consciousness = {
    recordEvent: jest.fn()
};

// Mock DOM environment
Object.defineProperty(window, 'performance', {
    value: { now: jest.fn(() => 1000) }
});

describe('ClearLodeOrchestrator', () => {
    let orchestrator;
    
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '';
        document.documentElement.style.cssText = '';
        
        // Create orchestrator instance
        orchestrator = new ClearLodeOrchestrator();
        
        // Mock audio system
        orchestrator.audio = {
            initializeAudioContext: jest.fn().mockResolvedValue(true),
            audioInitialized: false
        };
        
        // Clear mocks
        jest.clearAllMocks();
    });
    
    afterEach(() => {
        // Clean up DOM
        document.body.innerHTML = '';
    });

    test('showBeginPrompt creates UI with proper accessibility attributes', async () => {
        await orchestrator.showBeginPrompt();
        
        const prompt = document.getElementById('begin-prompt');
        expect(prompt).not.toBeNull();
        expect(prompt.getAttribute('role')).toBe('dialog');
        expect(prompt.getAttribute('aria-labelledby')).toBe('begin-title');
        expect(prompt.getAttribute('aria-describedby')).toBe('begin-desc');
        
        const title = document.getElementById('begin-title');
        expect(title).not.toBeNull();
        expect(title.textContent).toBe('The Digital Bardo');
        
        const button = prompt.querySelector('.begin-button');
        expect(button).not.toBeNull();
        expect(button.getAttribute('aria-label')).toContain('Click to begin');
    });

    test('showBeginPrompt handles button click and initializes audio', async () => {
        await orchestrator.showBeginPrompt();
        
        const button = document.querySelector('.begin-button');
        expect(button).not.toBeNull();
        
        // Mock manifestLight method
        orchestrator.manifestLight = jest.fn();
        
        // Simulate click
        await button.click();
        
        // Verify audio initialization was called
        expect(orchestrator.audio.initializeAudioContext).toHaveBeenCalled();
        
        // Wait for GSAP animation to complete
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Verify manifestLight was called
        expect(orchestrator.manifestLight).toHaveBeenCalled();
    });

    test('showBeginPrompt handles keyboard navigation', async () => {
        await orchestrator.showBeginPrompt();
        
        const button = document.querySelector('.begin-button');
        orchestrator.manifestLight = jest.fn();
        
        // Test Enter key
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        button.dispatchEvent(enterEvent);
        
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(orchestrator.audio.initializeAudioContext).toHaveBeenCalled();
        
        // Reset mocks
        jest.clearAllMocks();
        
        // Test Space key
        const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
        button.dispatchEvent(spaceEvent);
        
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(orchestrator.audio.initializeAudioContext).toHaveBeenCalled();
    });

    test('showBeginPrompt handles audio initialization failure', async () => {
        // Mock audio failure
        orchestrator.audio.initializeAudioContext = jest.fn().mockRejectedValue(new Error('Audio failed'));
        orchestrator.showAudioError = jest.fn();
        
        await orchestrator.showBeginPrompt();
        
        const button = document.querySelector('.begin-button');
        await button.click();
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        expect(orchestrator.showAudioError).toHaveBeenCalled();
    });

    test('showAudioError displays error message with proper styling', () => {
        const mockContainer = document.createElement('div');
        mockContainer.innerHTML = '<div class="begin-content"></div>';
        
        orchestrator.showAudioError(mockContainer);
        
        const errorMsg = mockContainer.querySelector('p[role="alert"]');
        expect(errorMsg).not.toBeNull();
        expect(errorMsg.textContent).toContain('Audio failed');
        expect(errorMsg.style.color).toContain('var(--karma-red');
    });

    test('orchestrator initializes with proper configuration', () => {
        expect(orchestrator.config.recognitionWindow.start).toBe(3500);
        expect(orchestrator.config.recognitionWindow.end).toBe(6500);
        expect(orchestrator.config.hints).toHaveLength(5);
        expect(orchestrator.localState.lightManifested).toBe(false);
        expect(orchestrator.localState.recognized).toBe(false);
    });
});
