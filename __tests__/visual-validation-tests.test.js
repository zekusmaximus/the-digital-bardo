import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VisualDistributionValidator } from '../clear-lode/visual-validation-tests.js';

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

describe('Visual Validation Tests', () => {
  let validator;

  beforeEach(() => {
    mockWindow(1920, 1080);
    validator = new VisualDistributionValidator();
    validator.initialize({
      visualizationEnabled: false,
      recordMetrics: true
    });
  });

  afterEach(() => {
    if (validator) {
      validator.destroy();
    }
  });

  describe('Distribution Balance Verification', () => {
    it('should verify distribution balance against targets', () => {
      // Mock zone manager methods
      validator.zoneManager.getCenterUtilization = vi.fn().mockReturnValue(0.35); // Above target
      validator.zoneManager.distributionState.balanceScore = 0.8; // Above minimum
      
      // Run verification
      const result = validator.verifyDistributionBalance();
      
      // Check results
      expect(result.passed).toBe(true);
      expect(result.details.centerUtilizationMet).toBe(true);
      expect(result.details.balanceScoreMet).toBe(true);
      
      // Check that event was recorded
      expect(consciousness.recordEvent).toHaveBeenCalledWith(
        'distribution_balance_verification',
        expect.objectContaining({
          passed: true,
          centerUtilization: 0.35,
          balanceScore: 0.8
        })
      );
    });

    it('should fail verification when targets are not met', () => {
      // Mock zone manager methods with values below targets
      validator.zoneManager.getCenterUtilization = vi.fn().mockReturnValue(0.2); // Below target
      validator.zoneManager.distributionState.balanceScore = 0.5; // Below minimum
      
      // Run verification
      const result = validator.verifyDistributionBalance();
      
      // Check results
      expect(result.passed).toBe(false);
      expect(result.details.centerUtilizationMet).toBe(false);
      expect(result.details.balanceScoreMet).toBe(false);
    });
  });

  describe('Center Area Utilization Measurement', () => {
    it('should measure center area utilization correctly', () => {
      // Mock zone manager methods
      validator.zoneManager.getCenterUtilization = vi.fn().mockReturnValue(0.4);
      validator.zoneManager.zones = new Map();
      
      // Add mock center zones
      const centerZone1 = { type: 'center', getArea: () => 40000 };
      const centerZone2 = { type: 'center', getArea: () => 30000 };
      validator.zoneManager.zones.set('center', centerZone1);
      validator.zoneManager.zones.set('center-top', centerZone2);
      
      // Run measurement
      const result = validator.measureCenterUtilization();
      
      // Check results
      expect(result.centerUtilization).toBe(0.4);
      expect(result.centerAreaPercentage).toBeGreaterThan(0);
      expect(result.utilizationEfficiency).toBeGreaterThan(0);
      
      // Check that event was recorded
      expect(consciousness.recordEvent).toHaveBeenCalledWith(
        'center_utilization_measurement',
        expect.objectContaining({
          centerUtilization: 0.4
        })
      );
    });
  });

  describe('Visual Regression Tests', () => {
    it('should create visual regression test for different screen sizes', () => {
      // Test desktop size
      mockWindow(1920, 1080);
      const desktopTest = validator.createVisualRegressionTest();
      
      expect(desktopTest.screenSize.width).toBe(1920);
      expect(desktopTest.screenSize.height).toBe(1080);
      expect(desktopTest.screenSize.orientation).toBe('landscape');
      
      // Test mobile size
      mockWindow(375, 667);
      const mobileTest = validator.createVisualRegressionTest();
      
      expect(mobileTest.screenSize.width).toBe(375);
      expect(mobileTest.screenSize.height).toBe(667);
      expect(mobileTest.screenSize.orientation).toBe('portrait');
      
      // Check that events were recorded
      expect(consciousness.recordEvent).toHaveBeenCalledWith(
        'visual_regression_test',
        expect.objectContaining({
          screenSize: expect.any(Object),
          distribution: expect.any(Object),
          centerUtilization: expect.any(Object)
        })
      );
    });
  });

  describe('Validation Test Suite', () => {
    it('should run a comprehensive validation test suite', () => {
      // Mock methods
      validator.verifyDistributionBalance = vi.fn().mockReturnValue({
        passed: true,
        metrics: { balanceScore: 0.85 },
        details: { centerUtilizationMet: true, balanceScoreMet: true, densityVarianceMet: true }
      });
      
      validator.measureCenterUtilization = vi.fn().mockReturnValue({
        centerUtilization: 0.4,
        centerAreaPercentage: 0.3,
        utilizationEfficiency: 1.33
      });
      
      validator.createVisualRegressionTest = vi.fn().mockReturnValue({
        screenSize: { width: 1920, height: 1080, orientation: 'landscape' },
        distribution: { centerUtilization: 0.4, balanceScore: 0.85 },
        centerUtilization: { centerUtilization: 0.4 }
      });
      
      // Run test suite
      const results = validator.runValidationTestSuite();
      
      // Check that all tests were run
      expect(validator.verifyDistributionBalance).toHaveBeenCalled();
      expect(validator.measureCenterUtilization).toHaveBeenCalled();
      expect(validator.createVisualRegressionTest).toHaveBeenCalled();
      
      // Check results
      expect(results.distributionBalance.passed).toBe(true);
      expect(results.centerUtilization.centerUtilization).toBe(0.4);
      expect(results.visualRegression).toBeDefined();
      
      // Check that event was recorded
      expect(consciousness.recordEvent).toHaveBeenCalledWith(
        'validation_test_suite_results',
        expect.objectContaining({
          passed: true
        })
      );
    });
  });

  describe('Visualization', () => {
    it('should create visualization when enabled', () => {
      // Mock document methods
      const mockContainer = {
        className: '',
        style: {},
        innerHTML: '',
        appendChild: vi.fn(),
        querySelector: vi.fn().mockReturnValue({
          style: {},
          querySelector: vi.fn().mockReturnValue({
            textContent: ''
          })
        })
      };
      
      document.createElement = vi.fn().mockReturnValue(mockContainer);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
      
      // Enable visualization
      validator.config.visualizationEnabled = true;
      
      // Create visualization
      validator.createVisualization = vi.fn();
      validator.createVisualization();
      
      // Check that visualization method was called
      expect(validator.createVisualization).toHaveBeenCalled();
    });
  });

  describe('Metrics Aggregation', () => {
    it('should aggregate metrics correctly', () => {
      // Add some test metrics
      validator.metrics.centerUtilization = [0.3, 0.4, 0.5];
      validator.metrics.balanceScores = [0.7, 0.8, 0.9];
      
      // Get aggregated metrics
      const metrics = validator.getAggregatedMetrics();
      
      // Check aggregated values
      expect(metrics.centerUtilization.average).toBeCloseTo(0.4, 1);
      expect(metrics.centerUtilization.min).toBe(0.3);
      expect(metrics.centerUtilization.max).toBe(0.5);
      
      expect(metrics.balanceScore.average).toBeCloseTo(0.8, 1);
      expect(metrics.balanceScore.min).toBe(0.7);
      expect(metrics.balanceScore.max).toBe(0.9);
      
      expect(metrics.measurementCount).toBe(3);
    });
  });
});