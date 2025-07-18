import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrowserCompatibilityManager } from '../clear-lode/browser-compatibility-manager.js';

// Mock consciousness module
vi.mock('../src/consciousness/digital-soul.js', () => ({
  consciousness: {
    recordEvent: vi.fn()
  }
}));

// Mock ResourceGuardian
vi.mock('../src/consciousness/resource-guardian.js', () => ({
  ResourceGuardian: vi.fn().mockImplementation(() => ({
    register: vi.fn(),
    cleanup: vi.fn()
  }))
}));

describe('BrowserCompatibilityManager', () => {
  let compatibilityManager;
  
  // Mock window properties
  const mockWindow = (width = 1920, height = 1080) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: 1,
    });
  };
  
  // Mock user agent
  const mockUserAgent = (userAgent) => {
    const originalUserAgent = navigator.userAgent;
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      configurable: true,
      value: userAgent,
    });
    return () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent
      });
    };
  };

  beforeEach(() => {
    // Reset mocks
    mockWindow();
    
    // Default to Chrome on Windows
    const restoreUserAgent = mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Create compatibility manager
    compatibilityManager = new BrowserCompatibilityManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
    if (compatibilityManager) {
      compatibilityManager.destroy();
    }
  });

  test('should detect browser information correctly', () => {
    // Chrome on Windows
    let restoreUserAgent = mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.browserInfo.name).toBe('Chrome');
    expect(compatibilityManager.browserInfo.os).toBe('Windows 10');
    restoreUserAgent();
    
    // Firefox on macOS
    restoreUserAgent = mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0');
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.browserInfo.name).toBe('Firefox');
    expect(compatibilityManager.browserInfo.os).toBe('macOS');
    restoreUserAgent();
    
    // Safari on iOS
    restoreUserAgent = mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.browserInfo.name).toBe('Safari');
    expect(compatibilityManager.browserInfo.os).toBe('iOS');
    restoreUserAgent();
    
    // Edge on Windows
    restoreUserAgent = mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59');
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.browserInfo.name).toBe('Microsoft Edge (Chromium)');
    expect(compatibilityManager.browserInfo.os).toBe('Windows 10');
    restoreUserAgent();
  });

  test('should detect viewport capabilities correctly', () => {
    // Standard viewport
    mockWindow(1920, 1080);
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.viewportCapabilities.width).toBe(1920);
    expect(compatibilityManager.viewportCapabilities.height).toBe(1080);
    expect(compatibilityManager.viewportCapabilities.aspectRatio).toBeCloseTo(1.78, 2);
    expect(compatibilityManager.viewportCapabilities.isExtremeAspectRatio).toBe(false);
    
    // Extreme wide viewport
    mockWindow(3840, 1080);
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.viewportCapabilities.aspectRatio).toBeCloseTo(3.56, 2);
    expect(compatibilityManager.viewportCapabilities.isExtremeAspectRatio).toBe(true);
    
    // Extreme tall viewport
    mockWindow(414, 896);
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.viewportCapabilities.aspectRatio).toBeCloseTo(0.46, 2);
    expect(compatibilityManager.viewportCapabilities.isExtremeAspectRatio).toBe(true);
    
    // Very small viewport
    mockWindow(280, 280);
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.viewportCapabilities.isVerySmall).toBe(true);
  });

  test('should apply browser-specific optimizations', () => {
    // Internet Explorer
    const restoreUserAgent = mockUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko');
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.fallbackSettings.useSimplePositioning).toBe(true);
    expect(compatibilityManager.fallbackSettings.useBasicAnimations).toBe(true);
    expect(compatibilityManager.fallbackSettings.disableCenterTraversal).toBe(true);
    restoreUserAgent();
    
    // Extreme aspect ratio
    mockWindow(3840, 1080);
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.fallbackSettings.disableCenterTraversal).toBe(true);
    
    // Very small viewport
    mockWindow(280, 280);
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.fallbackSettings.useSimplePositioning).toBe(true);
    expect(compatibilityManager.fallbackSettings.forceEdgeOnly).toBe(true);
  });

  test('should provide fallback for extreme aspect ratios', () => {
    // Wide viewport
    mockWindow(3840, 1080);
    compatibilityManager = new BrowserCompatibilityManager();
    const wideConfig = compatibilityManager.getExtremeAspectRatioFallback({
      width: 3840,
      height: 1080,
      aspectRatio: 3.56
    });
    expect(wideConfig.centerZoneSize).toBe(0.3);
    expect(wideConfig.transitionZoneWidth).toBe(0.2);
    
    // Tall viewport
    mockWindow(414, 896);
    compatibilityManager = new BrowserCompatibilityManager();
    const tallConfig = compatibilityManager.getExtremeAspectRatioFallback({
      width: 414,
      height: 896,
      aspectRatio: 0.46
    });
    expect(tallConfig.centerZoneSize).toBe(0.5);
    expect(tallConfig.transitionZoneWidth).toBe(0.1);
  });

  test('should provide positioning fallback', () => {
    mockWindow(1920, 1080);
    compatibilityManager = new BrowserCompatibilityManager();
    
    const fallbackPosition = compatibilityManager.getPositioningFallback(
      new Error('Test error'),
      { width: 1920, height: 1080 }
    );
    
    expect(fallbackPosition.x).toBeGreaterThanOrEqual(192); // 10% margin
    expect(fallbackPosition.x).toBeLessThanOrEqual(1728); // 10% margin
    expect(fallbackPosition.y).toBeGreaterThanOrEqual(108); // 10% margin
    expect(fallbackPosition.y).toBeLessThanOrEqual(972); // 10% margin
  });

  test('should provide path calculation fallback', () => {
    compatibilityManager = new BrowserCompatibilityManager();
    
    const startPoint = { x: 100, y: 100 };
    const endPoint = { x: 500, y: 300 };
    
    const fallbackPath = compatibilityManager.getPathCalculationFallback(
      new Error('Test error'),
      startPoint,
      endPoint
    );
    
    expect(fallbackPath.length).toBe(3);
    expect(fallbackPath[0]).toEqual(startPoint);
    expect(fallbackPath[1]).toEqual({ x: 300, y: 200 });
    expect(fallbackPath[2]).toEqual(endPoint);
  });

  test('should validate positions within viewport bounds', () => {
    mockWindow(1000, 800);
    compatibilityManager = new BrowserCompatibilityManager();
    
    // Valid position
    const validPosition = compatibilityManager.validatePosition(
      { x: 500, y: 400 },
      { width: 1000, height: 800 }
    );
    expect(validPosition).toEqual({ x: 500, y: 400 });
    
    // Position outside bounds
    const outsidePosition = compatibilityManager.validatePosition(
      { x: 1100, y: 900 },
      { width: 1000, height: 800 }
    );
    expect(outsidePosition.x).toBe(990); // 10px margin
    expect(outsidePosition.y).toBe(790); // 10px margin
    
    // Invalid position
    const invalidPosition = compatibilityManager.validatePosition(
      null,
      { width: 1000, height: 800 }
    );
    expect(invalidPosition.x).toBeGreaterThanOrEqual(10);
    expect(invalidPosition.x).toBeLessThanOrEqual(990);
  });

  test('should check feature support based on fallback settings', () => {
    // Default settings
    compatibilityManager = new BrowserCompatibilityManager();
    expect(compatibilityManager.supportsFeature('centerTraversal')).toBe(true);
    expect(compatibilityManager.supportsFeature('complexAnimations')).toBe(true);
    
    // With fallbacks enabled
    compatibilityManager.fallbackSettings.disableCenterTraversal = true;
    compatibilityManager.fallbackSettings.useBasicAnimations = true;
    
    expect(compatibilityManager.supportsFeature('centerTraversal')).toBe(false);
    expect(compatibilityManager.supportsFeature('complexAnimations')).toBe(false);
  });

  test('should get browser-specific animation settings', () => {
    // Chrome (default)
    let restoreUserAgent = mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    compatibilityManager = new BrowserCompatibilityManager();
    let settings = compatibilityManager.getAnimationSettings();
    expect(settings.durationMultiplier).toBe(1.0);
    restoreUserAgent();
    
    // Safari
    restoreUserAgent = mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15');
    compatibilityManager = new BrowserCompatibilityManager();
    settings = compatibilityManager.getAnimationSettings();
    expect(settings.durationMultiplier).toBe(1.1);
    restoreUserAgent();
    
    // Internet Explorer
    restoreUserAgent = mockUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko');
    compatibilityManager = new BrowserCompatibilityManager();
    settings = compatibilityManager.getAnimationSettings();
    expect(settings.durationMultiplier).toBe(0.8);
    expect(settings.useGPUAcceleration).toBe(false);
    restoreUserAgent();
  });
});