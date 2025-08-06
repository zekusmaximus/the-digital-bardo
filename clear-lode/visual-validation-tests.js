/**
 * Visual validation tests for dynamic text positioning
 * 
 * This module provides tools for visual validation of the dynamic text positioning system,
 * including distribution balance verification, center area utilization measurement,
 * and visual regression tests for different screen sizes.
 */

import { PositionZoneManager } from './position-zone-manager.js';
import { FragmentPositioningService } from './fragment-positioning-service.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

/**
 * Class for visual validation of fragment distribution
 */
export class VisualDistributionValidator {
  constructor() {
    this.zoneManager = new PositionZoneManager();
    this.positioningService = new FragmentPositioningService(this.zoneManager);
    
    // Visualization container
    this.container = null;
    
    // Metrics tracking
    this.metrics = {
      centerUtilization: [],
      balanceScores: [],
      zoneDensities: new Map(),
      screenSizes: []
    };
    
    // Configuration
    this.config = {
      visualizationEnabled: false,
      recordMetrics: true,
      screenshotMode: false,
      targetCenterUtilization: 0.3, // Target 30% center utilization
      minBalanceScore: 0.7, // Minimum acceptable balance score
      maxDensityVariance: 0.5 // Maximum acceptable density variance
    };
  }

  /**
   * Initializes the validator with optional configuration
   */
  initialize(config = {}) {
    // Apply configuration
    this.config = { ...this.config, ...config };
    
    // Create visualization if enabled
    if (this.config.visualizationEnabled) {
      this.createVisualization();
    }
    
    console.log('[VisualDistributionValidator] Initialized with config:', this.config);
    
    return this;
  }

  /**
   * Creates visualization overlay for visual debugging
   */
  createVisualization() {
    // Remove existing container if any
    if (this.container) {
      document.body.removeChild(this.container);
    }
    
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'distribution-visualization';
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.pointerEvents = 'none';
    this.container.style.zIndex = '9999';
    
    document.body.appendChild(this.container);
    
    // Visualize zones
    this.visualizeZones();
    
    console.log('[VisualDistributionValidator] Visualization created');
  }

  /**
   * Visualizes zones with colored overlays
   */
  visualizeZones() {
    if (!this.container) return;
    
    // Clear existing visualizations
    this.container.innerHTML = '';
    
    // Create zone visualizations
    for (const zone of this.zoneManager.zones.values()) {
      const zoneElement = document.createElement('div');
      zoneElement.className = `zone-visualization zone-${zone.id}`;
      zoneElement.style.position = 'absolute';
      zoneElement.style.left = `${zone.bounds.x.min}px`;
      zoneElement.style.top = `${zone.bounds.y.min}px`;
      zoneElement.style.width = `${zone.bounds.x.max - zone.bounds.x.min}px`;
      zoneElement.style.height = `${zone.bounds.y.max - zone.bounds.y.min}px`;
      
      // Color based on zone type
      let backgroundColor;
      switch (zone.type) {
        case 'center':
          backgroundColor = 'rgba(0, 255, 0, 0.1)';
          break;
        case 'edge':
          backgroundColor = 'rgba(255, 0, 0, 0.1)';
          break;
        case 'transition':
          backgroundColor = 'rgba(0, 0, 255, 0.1)';
          break;
        default:
          backgroundColor = 'rgba(128, 128, 128, 0.1)';
      }
      
      zoneElement.style.backgroundColor = backgroundColor;
      zoneElement.style.border = '1px dashed rgba(255, 255, 255, 0.3)';
      zoneElement.style.boxSizing = 'border-box';
      
      // Add label
      const label = document.createElement('div');
      label.textContent = zone.id;
      label.style.position = 'absolute';
      label.style.top = '5px';
      label.style.left = '5px';
      label.style.fontSize = '10px';
      label.style.color = 'white';
      label.style.textShadow = '1px 1px 1px black';
      
      zoneElement.appendChild(label);
      this.container.appendChild(zoneElement);
    }
  }

  /**
   * Updates zone visualization with density information
   */
  updateZoneVisualization() {
    if (!this.container || !this.config.visualizationEnabled) return;
    
    // Update zone visualizations with density information
    for (const zone of this.zoneManager.zones.values()) {
      const zoneElement = this.container.querySelector(`.zone-${zone.id}`);
      if (!zoneElement) continue;
      
      // Get density
      const density = this.zoneManager.distributionState.zoneDensity.get(zone.id) || 0;
      
      // Update opacity based on density
      const maxDensity = this.zoneManager.getMaxDensity();
      const opacity = Math.min(0.8, Math.max(0.1, density / maxDensity * 0.8));
      
      // Update visualization
      switch (zone.type) {
        case 'center':
          zoneElement.style.backgroundColor = `rgba(0, 255, 0, ${opacity})`;
          break;
        case 'edge':
          zoneElement.style.backgroundColor = `rgba(255, 0, 0, ${opacity})`;
          break;
        case 'transition':
          zoneElement.style.backgroundColor = `rgba(0, 0, 255, ${opacity})`;
          break;
      }
      
      // Update label with density information
      const label = zoneElement.querySelector('div');
      if (label) {
        label.textContent = `${zone.id} (${zone.activeFragments}, ${density.toFixed(5)})`;
      }
    }
  }

  /**
   * Measures distribution metrics
   */
  measureDistribution() {
    // Get current metrics
    const centerUtilization = this.zoneManager.getCenterUtilization();
    const balanceScore = this.zoneManager.distributionState.balanceScore;
    const zoneDensities = new Map();
    
    // Record zone densities
    for (const [zoneId, zone] of this.zoneManager.zones) {
      zoneDensities.set(zoneId, zone.getDensity());
    }
    
    // Record metrics if enabled
    if (this.config.recordMetrics) {
      this.metrics.centerUtilization.push(centerUtilization);
      this.metrics.balanceScores.push(balanceScore);
      
      // Keep only last 100 measurements
      if (this.metrics.centerUtilization.length > 100) {
        this.metrics.centerUtilization.shift();
        this.metrics.balanceScores.shift();
      }
      
      // Update zone densities
      this.metrics.zoneDensities = zoneDensities;
    }
    
    // Update visualization
    this.updateZoneVisualization();
    
    return {
      centerUtilization,
      balanceScore,
      zoneDensities,
      timestamp: Date.now()
    };
  }

  /**
   * Verifies distribution balance against targets
   */
  verifyDistributionBalance() {
    const metrics = this.measureDistribution();
    
    // Check center utilization
    const centerUtilizationMet = metrics.centerUtilization >= this.config.targetCenterUtilization;
    
    // Check balance score
    const balanceScoreMet = metrics.balanceScore >= this.config.minBalanceScore;
    
    // Check density variance
    const densities = Array.from(metrics.zoneDensities.values());
    const avgDensity = densities.reduce((sum, d) => sum + d, 0) / densities.length;
    const maxDensity = Math.max(...densities);
    const densityVariance = avgDensity > 0 ? (maxDensity - avgDensity) / avgDensity : 0;
    const densityVarianceMet = densityVariance <= this.config.maxDensityVariance;
    
    // Overall verification result
    const passed = centerUtilizationMet && balanceScoreMet && densityVarianceMet;
    
    // Record verification result
    consciousness.recordEvent('distribution_balance_verification', {
      passed,
      centerUtilization: metrics.centerUtilization,
      targetCenterUtilization: this.config.targetCenterUtilization,
      centerUtilizationMet,
      balanceScore: metrics.balanceScore,
      minBalanceScore: this.config.minBalanceScore,
      balanceScoreMet,
      densityVariance,
      maxDensityVariance: this.config.maxDensityVariance,
      densityVarianceMet
    });
    
    console.log(`[VisualDistributionValidator] Balance verification: ${passed ? 'PASSED' : 'FAILED'}`, {
      centerUtilization: `${(metrics.centerUtilization * 100).toFixed(1)}% (target: ${(this.config.targetCenterUtilization * 100).toFixed(1)}%)`,
      balanceScore: `${metrics.balanceScore.toFixed(2)} (min: ${this.config.minBalanceScore})`,
      densityVariance: `${densityVariance.toFixed(2)} (max: ${this.config.maxDensityVariance})`
    });
    
    return {
      passed,
      metrics,
      details: {
        centerUtilizationMet,
        balanceScoreMet,
        densityVarianceMet
      }
    };
  }

  /**
   * Measures center area utilization
   */
  measureCenterUtilization() {
    const centerUtilization = this.zoneManager.getCenterUtilization();
    const centerZones = Array.from(this.zoneManager.zones.values()).filter(zone => zone.type === 'center');
    const totalCenterArea = centerZones.reduce((sum, zone) => sum + zone.getArea(), 0);
    const totalScreenArea = window.innerWidth * window.innerHeight;
    const centerAreaPercentage = totalCenterArea / totalScreenArea;
    
    // Calculate efficiency (utilization relative to area)
    const utilizationEfficiency = centerAreaPercentage > 0 ? 
      centerUtilization / centerAreaPercentage : 0;
    
    // Record measurement
    consciousness.recordEvent('center_utilization_measurement', {
      centerUtilization,
      centerAreaPercentage,
      utilizationEfficiency,
      centerZoneCount: centerZones.length,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
    
    console.log('[VisualDistributionValidator] Center utilization:', {
      utilization: `${(centerUtilization * 100).toFixed(1)}%`,
      areaPercentage: `${(centerAreaPercentage * 100).toFixed(1)}%`,
      efficiency: utilizationEfficiency.toFixed(2)
    });
    
    return {
      centerUtilization,
      centerAreaPercentage,
      utilizationEfficiency
    };
  }

  /**
   * Creates a visual regression test for the current screen size
   */
  createVisualRegressionTest() {
    // Record current screen size
    const screenSize = {
      width: window.innerWidth,
      height: window.innerHeight,
      aspectRatio: window.innerWidth / window.innerHeight,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      timestamp: Date.now()
    };
    
    // Add to metrics
    this.metrics.screenSizes.push(screenSize);
    
    // Take measurements
    const distribution = this.measureDistribution();
    const centerUtilization = this.measureCenterUtilization();
    
    // Create regression test data
    const regressionData = {
      screenSize,
      distribution,
      centerUtilization,
      zoneCount: this.zoneManager.zones.size,
      zoneTypes: {
        center: Array.from(this.zoneManager.zones.values()).filter(zone => zone.type === 'center').length,
        edge: Array.from(this.zoneManager.zones.values()).filter(zone => zone.type === 'edge').length,
        transition: Array.from(this.zoneManager.zones.values()).filter(zone => zone.type === 'transition').length
      }
    };
    
    // Record regression test
    consciousness.recordEvent('visual_regression_test', regressionData);
    
    console.log('[VisualDistributionValidator] Visual regression test created for', screenSize);
    
    return regressionData;
  }

  /**
   * Runs a comprehensive visual validation test suite
   */
  runValidationTestSuite() {
    console.log('[VisualDistributionValidator] Running validation test suite...');
    
    // Enable visualization for test suite
    const originalVisualizationSetting = this.config.visualizationEnabled;
    this.config.visualizationEnabled = true;
    
    if (!this.container) {
      this.createVisualization();
    }
    
    // Run tests
    const results = {
      distributionBalance: this.verifyDistributionBalance(),
      centerUtilization: this.measureCenterUtilization(),
      visualRegression: this.createVisualRegressionTest(),
      timestamp: Date.now()
    };
    
    // Restore original visualization setting
    this.config.visualizationEnabled = originalVisualizationSetting;
    
    // If not visualization enabled, remove container
    if (!originalVisualizationSetting && this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
    
    // Record overall results
    consciousness.recordEvent('validation_test_suite_results', {
      passed: results.distributionBalance.passed,
      timestamp: results.timestamp,
      metrics: {
        centerUtilization: results.centerUtilization.centerUtilization,
        balanceScore: results.distributionBalance.metrics.balanceScore
      }
    });
    
    console.log('[VisualDistributionValidator] Test suite completed:', 
      results.distributionBalance.passed ? 'PASSED' : 'FAILED');
    
    return results;
  }

  /**
   * Gets aggregated metrics from recorded measurements
   */
  getAggregatedMetrics() {
    // Calculate average center utilization
    const avgCenterUtilization = this.metrics.centerUtilization.length > 0 ?
      this.metrics.centerUtilization.reduce((sum, val) => sum + val, 0) / this.metrics.centerUtilization.length : 0;
    
    // Calculate average balance score
    const avgBalanceScore = this.metrics.balanceScores.length > 0 ?
      this.metrics.balanceScores.reduce((sum, val) => sum + val, 0) / this.metrics.balanceScores.length : 0;
    
    // Calculate min/max values
    const minCenterUtilization = Math.min(...this.metrics.centerUtilization);
    const maxCenterUtilization = Math.max(...this.metrics.centerUtilization);
    const minBalanceScore = Math.min(...this.metrics.balanceScores);
    const maxBalanceScore = Math.max(...this.metrics.balanceScores);
    
    return {
      centerUtilization: {
        average: avgCenterUtilization,
        min: minCenterUtilization,
        max: maxCenterUtilization,
        current: this.metrics.centerUtilization[this.metrics.centerUtilization.length - 1] || 0
      },
      balanceScore: {
        average: avgBalanceScore,
        min: minBalanceScore,
        max: maxBalanceScore,
        current: this.metrics.balanceScores[this.metrics.balanceScores.length - 1] || 0
      },
      screenSizes: this.metrics.screenSizes,
      measurementCount: this.metrics.centerUtilization.length
    };
  }

  /**
   * Destroys the validator and cleans up resources
   */
  destroy() {
    // Remove visualization container
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
    
    // Clean up resources
    if (this.zoneManager) {
      this.zoneManager.destroy && this.zoneManager.destroy();
      this.zoneManager = null;
    }
    
    if (this.positioningService) {
      this.positioningService.destroy && this.positioningService.destroy();
      this.positioningService = null;
    }
    
    console.log('[VisualDistributionValidator] Destroyed');
  }
}

// Export singleton instance
export const visualDistributionValidator = new VisualDistributionValidator();