import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VisualEnhancementIntegration } from '../clear-lode/visual-enhancement-integration.js';

// Mock consciousness module
vi.mock('../src/consciousness/digital-soul.js', () => {
  const mockConsciousness = {
    recordEvent: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    getState: vi.fn().mockReturnValue({
      clearLode: {
        karma: {
          level: 5,
          balance: 0.5
        },
        recognition: {
          recognized: false
        },
        degradation: {
          level: 0.3
        }
      }
    })
  };
  
  // Make it globally available for the test
  global.consciousness = mockConsciousness;
  
  return {
    consciousness: mockConsciousness
  };
});

// Mock ResourceGuardian
vi.mock('../src/consciousness/resource-guardian.js', () => ({
  ResourceGuardian: vi.fn().mockImplementation(() => ({
    register: vi.fn(),
    cleanup: vi.fn()
  }))
}));

// Mock PositionZoneManager
vi.mock('../clear-lode/position-zone-manager.js', () => ({
  PositionZoneManager: vi.fn().mockImplementation(() => ({
    updateDistributionStrategy: vi.fn(),
    updateZoneWeights: vi.fn(),
    updateDistributionChaos: vi.fn(),
    destroy: vi.fn()
  }))
}));

// Mock BrowserCompatibilityManager
vi.mock('../clear-lode/browser-compatibility-manager.js', () => ({
  BrowserCompatibilityManager: vi.fn().mockImplementation(() => ({
    validatePosition: vi.fn(position => position),
    destroy: vi.fn()
  }))
}));

// Mock ZoneOptimizationManager
vi.mock('../clear-lode/zone-optimization-manager.js', () => ({
  ZoneOptimizationManager: vi.fn().mockImplementation(() => ({
    destroy: vi.fn()
  }))
}));

describe('Visual Enhancement Integration', () => {
  let integration;
  let mockFragment;
  let mockZone;
  
  // Mock document and window
  beforeEach(() => {
    // Mock document body and elements
    document.body = document.createElement('body');
    document.documentElement.style.setProperty = vi.fn();
    
    // Mock getComputedStyle
    global.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn().mockReturnValue('2px')
    });
    
    // Mock window dimensions
    global.innerWidth = 1024;
    global.innerHeight = 768;
    
    // Create mock fragment and zone
    mockFragment = document.createElement('div');
    mockFragment.setAttribute('data-birth-time', Date.now().toString());
    mockFragment.textContent = 'Test Fragment';
    
    mockZone = {
      id: 'center',
      type: 'center',
      bounds: {
        x: { min: 400, max: 600 },
        y: { min: 300, max: 500 }
      }
    };
    
    // Create integration instance
    integration = new VisualEnhancementIntegration();
  });
  
  afterEach(() => {
    if (integration) {
      integration.destroy();
      integration = null;
    }
  });
  
  describe('Initialization', () => {
    it('should initialize correctly', () => {
      expect(integration).toBeDefined();
      expect(consciousness.subscribe).toHaveBeenCalled();
    });
    
    it('should detect visual effect elements', () => {
      // Create mock visual effect elements
      const crtScreen = document.createElement('div');
      crtScreen.className = 'crt-screen';
      document.body.appendChild(crtScreen);
      
      const lightManifestation = document.createElement('div');
      lightManifestation.className = 'light-manifestation';
      document.body.appendChild(lightManifestation);
      
      document.body.setAttribute('data-degradation', 'moderate');
      
      const chromaticElement = document.createElement('div');
      chromaticElement.className = 'chromatic-aberration';
      document.body.appendChild(chromaticElement);
      
      // Re-initialize to detect elements
      integration.detectVisualEffectElements();
      
      // Check detection results
      expect(integration.visualEffects.phosphor.enabled).toBe(true);
      expect(integration.visualEffects.light.enabled).toBe(true);
      expect(integration.visualEffects.corruption.enabled).toBe(true);
      expect(integration.visualEffects.corruption.appliedClass).toBe('moderate');
      expect(integration.visualEffects.chromatic.enabled).toBe(true);
    });
  });
  
  describe('Visual Effect Updates', () => {
    it('should update visual effects for karma changes', () => {
      // Set karma level and balance
      integration.recognitionState.karmaLevel = 8;
      integration.recognitionState.karmaBalance = 0.7;
      
      // Update visual effects
      integration.updateVisualEffectsForKarma();
      
      // Check body attribute
      expect(document.body.getAttribute('data-karma')).toBe('high');
      
      // Check that zone manager was updated
      expect(integration.zoneManager.updateDistributionStrategy).toHaveBeenCalled();
    });
    
    it('should update visual effects for recognition state', () => {
      // Set recognition state
      integration.recognitionState.isRecognized = true;
      
      // Update visual effects
      integration.updateVisualEffectsForRecognition();
      
      // Check body classes and attributes
      expect(document.body.classList.contains('recognized')).toBe(true);
      expect(document.body.getAttribute('data-recognition')).toBe('true');
      
      // Check that zone manager was updated
      expect(integration.zoneManager.updateZoneWeights).toHaveBeenCalled();
    });
    
    it('should update corruption effects based on degradation level', () => {
      // Set corruption intensity
      integration.visualEffects.corruption.intensity = 0.7;
      
      // Update corruption effects
      integration.updateCorruptionEffects();
      
      // Check body attribute
      expect(document.body.getAttribute('data-degradation')).toBe('severe');
      expect(integration.visualEffects.corruption.appliedClass).toBe('severe');
      
      // Check that chromatic aberration was updated
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--chromatic-aberration', '6px');
      
      // Check that zone manager was updated
      expect(integration.zoneManager.updateDistributionChaos).toHaveBeenCalled();
    });
  });
  
  describe('Fragment Visual Effects', () => {
    it('should apply visual effects to fragments', () => {
      // Set up visual effect state
      integration.visualEffects.corruption.enabled = true;
      integration.visualEffects.corruption.appliedClass = 'moderate';
      integration.visualEffects.corruption.intensity = 0.4;
      integration.visualEffects.chromatic.enabled = true;
      integration.recognitionState.karmaLevel = 6;
      
      // Apply visual effects
      integration.applyVisualEffectsToFragment(mockFragment, mockZone);
      
      // Check applied classes and attributes
      expect(mockFragment.classList.contains('corrupted-moderate')).toBe(true);
      expect(mockFragment.classList.contains('light-interactive')).toBe(true);
      expect(mockFragment.getAttribute('data-zone-type')).toBe('center');
      
      // Check karma event recording
      expect(consciousness.recordEvent).toHaveBeenCalledWith(
        'fragment_visual_effects_applied',
        expect.objectContaining({
          zoneType: 'center',
          corruption: 'moderate'
        })
      );
    });
    
    it('should apply chromatic aberration for high corruption', () => {
      // Set up visual effect state
      integration.visualEffects.corruption.enabled = true;
      integration.visualEffects.corruption.appliedClass = 'severe';
      integration.visualEffects.corruption.intensity = 0.7;
      integration.visualEffects.chromatic.enabled = true;
      
      // Apply visual effects
      integration.applyVisualEffectsToFragment(mockFragment, mockZone);
      
      // Check chromatic aberration
      expect(mockFragment.classList.contains('chromatic-aberration')).toBe(true);
      expect(mockFragment.getAttribute('data-text')).toBe('Test Fragment');
    });
    
    it('should apply digital noise for edge fragments during corruption', () => {
      // Set up visual effect state
      integration.visualEffects.corruption.enabled = true;
      integration.visualEffects.corruption.intensity = 0.5;
      
      // Create edge zone
      const edgeZone = {
        id: 'edge-top',
        type: 'edge',
        bounds: {
          x: { min: 0, max: 1024 },
          y: { min: 0, max: 50 }
        }
      };
      
      // Apply visual effects
      integration.applyVisualEffectsToFragment(mockFragment, edgeZone);
      
      // Check digital noise
      expect(mockFragment.classList.contains('digital-noise')).toBe(true);
      expect(mockFragment.getAttribute('data-zone-type')).toBe('edge');
    });
  });
  
  describe('Position and Path Validation', () => {
    it('should validate positions for visual effects', () => {
      // Set up visual effect state
      integration.visualEffects.phosphor.enabled = true;
      integration.visualEffects.chromatic.enabled = true;
      integration.visualEffects.chromatic.aberrationLevel = 5;
      
      // Mock compatibility manager with position adjustment
      integration.compatibilityManager.validatePosition = vi.fn(pos => ({
        x: pos.x + 5,
        y: pos.y + 5
      }));
      
      // Test position validation
      const position = { x: 10, y: 10 };
      const validatedPosition = integration.validatePositionForVisualEffects(position, mockZone);
      
      // Check that position was validated
      expect(integration.compatibilityManager.validatePosition).toHaveBeenCalled();
      expect(validatedPosition.x).toBeGreaterThan(position.x);
      expect(validatedPosition.y).toBeGreaterThan(position.y);
    });
    
    it('should validate paths for visual effects', () => {
      // Set up visual effect state
      integration.visualEffects.phosphor.enabled = true;
      integration.visualEffects.chromatic.enabled = true;
      integration.visualEffects.chromatic.aberrationLevel = 5;
      
      // Test path validation with extreme values
      const waypoints = [
        { x: 1, y: 1 },  // Too close to edge
        { x: 100, y: 100 },
        { x: 1030, y: 780 }  // Beyond viewport
      ];
      
      // Create a copy for comparison
      const originalWaypoints = JSON.parse(JSON.stringify(waypoints));
      
      const validatedWaypoints = integration.validatePathForVisualEffects([...waypoints]);
      
      // Check that waypoints were validated
      expect(validatedWaypoints[0].x).toBeGreaterThan(originalWaypoints[0].x);
      expect(validatedWaypoints[0].y).toBeGreaterThan(originalWaypoints[0].y);
      expect(validatedWaypoints[2].x).toBeLessThan(originalWaypoints[2].x);
      expect(validatedWaypoints[2].y).toBeLessThan(originalWaypoints[2].y);
    });
  });
  
  describe('Karma and Recognition Integration', () => {
    it('should record karma events for fragment interactions', () => {
      // Set up fragment with zone type
      mockFragment.setAttribute('data-zone-type', 'center');
      mockFragment.setAttribute('data-birth-time', '12345');
      mockFragment.classList.add('chromatic-aberration');
      
      // Record karma event
      integration.recordFragmentKarmaEvent(mockFragment, 'click');
      
      // Check karma event recording
      expect(consciousness.recordEvent).toHaveBeenCalledWith(
        'fragment_interaction',
        expect.objectContaining({
          interactionType: 'click',
          zoneType: 'center',
          karmaImpact: 0.2,
          fragmentId: '12345'
        })
      );
    });
    
    it('should check fragment compatibility with visual effects', () => {
      // Valid fragment
      expect(integration.isFragmentCompatibleWithVisualEffects(mockFragment)).toBe(true);
      
      // Invalid fragment (missing birth time)
      const invalidFragment = document.createElement('div');
      expect(integration.isFragmentCompatibleWithVisualEffects(invalidFragment)).toBe(false);
      
      // Invalid fragment for chromatic aberration (no text)
      integration.visualEffects.chromatic.enabled = true;
      integration.visualEffects.corruption.intensity = 0.7;
      const emptyFragment = document.createElement('div');
      emptyFragment.setAttribute('data-birth-time', '12345');
      expect(integration.isFragmentCompatibleWithVisualEffects(emptyFragment)).toBe(false);
    });
  });
  
  describe('Cleanup and Resource Management', () => {
    it('should clean up resources on destroy', () => {
      // Check that guardian cleanup is called
      integration.destroy();
      expect(integration.guardian.cleanup).toHaveBeenCalled();
    });
  });
});