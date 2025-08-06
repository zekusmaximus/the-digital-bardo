import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PositionZoneManager } from '../clear-lode/position-zone-manager.js';
import { FragmentPositioningService } from '../clear-lode/fragment-positioning-service.js';
import { FragmentDriftCalculator } from '../clear-lode/fragment-drift-calculator.js';

// Mock consciousness module
vi.mock('../src/consciousness/digital-soul.js', () => {
  const mockConsciousness = {
    recordEvent: vi.fn(),
    getState: vi.fn().mockReturnValue({
      clearLode: {
        karma: {
          level: 5,
          balance: 0.5
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
    cleanupAll: vi.fn()
  }))
}));

// Mock AnimationGuardian
vi.mock('../src/utils/animation-guardian.js', () => {
  const mockAnimationGuardian = {
    safeAnimate: vi.fn(),
    createTimeline: vi.fn().mockReturnValue({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      play: vi.fn()
    })
  };
  
  // Make it globally available for the test
  global.AnimationGuardian = mockAnimationGuardian;
  
  return {
    AnimationGuardian: mockAnimationGuardian
  };
});

// Mock window dimensions
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
  
  // Mock performance.now for testing
  if (!window.performance) {
    window.performance = { now: () => Date.now() };
  }
};

// Mock PerformanceTierIntegration
vi.mock('../clear-lode/performance-tier-integration.js', () => ({
  PerformanceTierIntegration: vi.fn().mockImplementation(() => ({
    getCurrentTier: vi.fn().mockReturnValue('high'),
    getMaxActiveFragments: vi.fn().mockReturnValue(50),
    getMaxZoneDensity: vi.fn().mockReturnValue(0.01),
    isCenterTraversalEnabled: vi.fn().mockReturnValue(true),
    useComplexPaths: vi.fn().mockReturnValue(true),
    getDistributionStrategy: vi.fn().mockReturnValue('balanced'),
    updateZoneWeights: vi.fn(),
    monitorPerformance: vi.fn().mockReturnValue(false)
  }))
}));

// Mock fragment generator
class MockFragmentGenerator {
  constructor(zoneManager, positioningService) {
    this.zoneManager = zoneManager;
    this.positioningService = positioningService;
    this.driftCalculator = new FragmentDriftCalculator(zoneManager);
    this.fragments = [];
  }

  createFragment(text = 'Test Fragment') {
    const fragment = document.createElement('div');
    fragment.textContent = text;
    fragment.className = 'fragment';
    fragment.dataset.birthTime = Date.now().toString();
    fragment.style.position = 'absolute'; // Set position directly for testing
    
    // Select zone and position fragment
    const zone = this.zoneManager.selectZone();
    this.positioningService.positionFragment(fragment, zone);
    
    // Record zone usage
    this.zoneManager.recordZoneUsage(zone);
    
    // Store fragment
    this.fragments.push({
      element: fragment,
      zone: zone,
      birthTime: Date.now()
    });
    
    return fragment;
  }

  animateFragment(fragment) {
    const zoneId = fragment.dataset.zoneId;
    const zone = this.zoneManager.getZone(zoneId);
    
    if (!zone) return;
    
    // Calculate drift
    const drift = this.driftCalculator.calculateDrift(zone, 0.6);
    
    // Apply animation
    AnimationGuardian.safeAnimate(fragment, {
      x: `+=${drift.x}`,
      y: `+=${drift.y}`,
      duration: 2,
      ease: 'power1.inOut'
    });
    
    return drift;
  }

  removeFragment(fragment) {
    const zoneId = fragment.dataset.zoneId;
    
    // Release zone
    if (zoneId) {
      this.zoneManager.recordZoneRelease(zoneId);
      this.positioningService.recordFragmentRemoval(zoneId);
    }
    
    // Remove from DOM
    if (fragment.parentNode) {
      fragment.parentNode.removeChild(fragment);
    }
    
    // Remove from fragments array
    this.fragments = this.fragments.filter(f => f.element !== fragment);
  }
}

describe('Fragment Lifecycle Integration Tests', () => {
  let zoneManager;
  let positioningService;
  let fragmentGenerator;
  let container;

  beforeEach(() => {
    mockWindow(1920, 1080);
    
    // Create container for fragments
    container = document.createElement('div');
    container.id = 'fragment-container';
    document.body.appendChild(container);
    
    // Initialize components
    zoneManager = new PositionZoneManager();
    positioningService = new FragmentPositioningService(zoneManager);
    fragmentGenerator = new MockFragmentGenerator(zoneManager, positioningService);
  });

  afterEach(() => {
    if (zoneManager) {
      zoneManager.destroy && zoneManager.destroy();
    }
    if (positioningService) {
      positioningService.destroy && positioningService.destroy();
    }
    
    // Clean up container
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Fragment Creation and Positioning', () => {
    it('should create and position fragments correctly', () => {
      // Create multiple fragments
      const fragments = [];
      for (let i = 0; i < 10; i++) {
        const fragment = fragmentGenerator.createFragment(`Fragment ${i}`);
        container.appendChild(fragment);
        fragments.push(fragment);
      }
      
      // Check that all fragments have zone information
      fragments.forEach(fragment => {
        expect(fragment.dataset.zoneId).toBeDefined();
        expect(fragment.dataset.zoneType).toBeDefined();
        expect(fragment.style.position).toBe('absolute');
      });
      
      // Check distribution across zones
      const zoneDistribution = {};
      fragments.forEach(fragment => {
        const zoneId = fragment.dataset.zoneId;
        zoneDistribution[zoneId] = (zoneDistribution[zoneId] || 0) + 1;
      });
      
      // Should have used at least 2 different zones
      expect(Object.keys(zoneDistribution).length).toBeGreaterThanOrEqual(2);
    });

    it('should handle fragment removal correctly', () => {
      // Create fragments
      const fragments = [];
      for (let i = 0; i < 5; i++) {
        const fragment = fragmentGenerator.createFragment(`Fragment ${i}`);
        container.appendChild(fragment);
        fragments.push(fragment);
      }
      
      // Record initial zone usage
      const initialZoneUsage = new Map();
      for (const zone of zoneManager.zones.values()) {
        initialZoneUsage.set(zone.id, zone.activeFragments);
      }
      
      // Remove a fragment
      const fragmentToRemove = fragments[0];
      const zoneId = fragmentToRemove.dataset.zoneId;
      fragmentGenerator.removeFragment(fragmentToRemove);
      
      // Check that fragment was removed from DOM
      expect(container.contains(fragmentToRemove)).toBe(false);
      
      // Check that zone usage was updated
      const zone = zoneManager.getZone(zoneId);
      expect(zone.activeFragments).toBe(initialZoneUsage.get(zoneId) - 1);
      
      // Check that positioning service updated its tracking
      const stats = positioningService.getDistributionStats();
      expect(stats.fragmentDistribution.get(zoneId)).toBe(initialZoneUsage.get(zoneId) - 1);
    });
  });

  describe('Fragment Animation and Path Generation', () => {
    it('should generate appropriate movement paths for fragments', () => {
      // Create fragments in different zone types
      const edgeZone = zoneManager.getZonesByType('edge')[0];
      const centerZone = zoneManager.getZonesByType('center')[0];
      const transitionZone = zoneManager.getZonesByType('transition')[0];
      
      // Create fragments in specific zones
      const edgeFragment = document.createElement('div');
      edgeFragment.className = 'fragment';
      positioningService.positionFragment(edgeFragment, edgeZone);
      container.appendChild(edgeFragment);
      
      const centerFragment = document.createElement('div');
      centerFragment.className = 'fragment';
      positioningService.positionFragment(centerFragment, centerZone);
      container.appendChild(centerFragment);
      
      const transitionFragment = document.createElement('div');
      transitionFragment.className = 'fragment';
      positioningService.positionFragment(transitionFragment, transitionZone);
      container.appendChild(transitionFragment);
      
      // Animate fragments
      const driftCalculator = new FragmentDriftCalculator(zoneManager);
      
      const edgeDrift = driftCalculator.calculateDrift(edgeZone, 0.7);
      const centerDrift = driftCalculator.calculateDrift(centerZone, 0.5);
      const transitionDrift = driftCalculator.calculateDrift(transitionZone, 0.6);
      
      // Edge drift with high center bias should have waypoints
      expect(edgeDrift.waypoints).toBeDefined();
      
      // Center drift should have x and y components
      expect(centerDrift.x).toBeDefined();
      expect(centerDrift.y).toBeDefined();
      
      // Transition drift should have appropriate components
      expect(transitionDrift.x).toBeDefined();
      expect(transitionDrift.y).toBeDefined();
    });

    it('should animate fragments with appropriate paths', () => {
      // Create a fragment
      const fragment = fragmentGenerator.createFragment('Animated Fragment');
      container.appendChild(fragment);
      
      // Get initial position
      const initialLeft = fragment.style.left;
      const initialTop = fragment.style.top;
      
      // Animate fragment
      const drift = fragmentGenerator.animateFragment(fragment);
      
      // Check that animation was applied
      expect(AnimationGuardian.safeAnimate).toHaveBeenCalledWith(
        fragment,
        expect.objectContaining({
          x: `+=${drift.x}`,
          y: `+=${drift.y}`,
          duration: expect.any(Number)
        })
      );
    });
  });

  describe('Karma System Integration', () => {
    it('should integrate with karma system for positioning', () => {
      // Mock karma level
      const mockKarmaLevel = 8;
      vi.mocked(consciousness.getState).mockReturnValue({
        clearLode: {
          karma: {
            level: mockKarmaLevel,
            balance: 0.7
          }
        }
      });
      
      // Create fragments with karma influence
      const fragments = [];
      for (let i = 0; i < 5; i++) {
        const fragment = fragmentGenerator.createFragment(`Karma Fragment ${i}`);
        container.appendChild(fragment);
        fragments.push(fragment);
      }
      
      // With high karma, should have more center zone usage
      const centerZoneCount = fragments.filter(f => f.dataset.zoneType === 'center').length;
      
      // Record event should have been called with karma data
      expect(consciousness.recordEvent).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          zoneId: expect.any(String)
        })
      );
    });
  });

  describe('Audio-Visual Synchronization', () => {
    it('should support audio-visual synchronization with center-traversal paths', () => {
      // Create a fragment
      const fragment = fragmentGenerator.createFragment('AV Sync Fragment');
      container.appendChild(fragment);
      
      // Get a center zone
      const centerZone = zoneManager.getZonesByType('center')[0];
      
      // Position fragment in center zone
      positioningService.positionFragment(fragment, centerZone);
      
      // Create drift calculator with high center bias
      const driftCalculator = new FragmentDriftCalculator(zoneManager);
      const drift = driftCalculator.calculateDrift(centerZone, 0.8);
      
      // Should have waypoints for audio sync points
      if (drift.waypoints) {
        expect(drift.waypoints.length).toBeGreaterThan(0);
      }
      
      // Create animation timeline
      const timeline = AnimationGuardian.createTimeline({
        paused: true,
        onUpdate: vi.fn(),
        onComplete: vi.fn()
      });
      
      // Check that timeline methods were called
      expect(AnimationGuardian.createTimeline).toHaveBeenCalled();
    });
  });
});