import { AnimationGuardian } from "../src/utils/animation-guardian.js";
import { consciousness } from '../src/consciousness/digital-soul.js';

/**
 * Handles fragment positioning using zone-based algorithms with distribution tracking
 */
export class FragmentPositioningService {
  constructor(zoneManager) {
    this.zoneManager = zoneManager;
    
    // Distribution tracking state
    this.distributionState = {
      fragmentDistribution: new Map(), // Track fragments per zone
      clusteringPrevention: {
        enabled: true,
        maxDensityThreshold: 3.0, // Maximum density ratio between zones
        rebalanceInterval: 5000, // 5 seconds
        lastRebalance: 0
      },
      balanceMonitoring: {
        enabled: true,
        targetBalance: 0.7, // Target balance score (0-1)
        monitoringInterval: 2000, // 2 seconds
        lastCheck: 0
      },
      recentPlacements: [], // Track recent fragment placements
      maxHistorySize: 20 // Maximum placement history to maintain
    };

    // Initialize distribution tracking for all zones
    this.initializeDistributionTracking();
    
    // Start monitoring processes
    this.startDistributionMonitoring();
  }

  /**
   * Initializes distribution tracking for all zones
   */
  initializeDistributionTracking() {
    if (!this.zoneManager || !this.zoneManager.zones) return;
    
    // Initialize fragment count for each zone
    for (const [zoneId, zone] of this.zoneManager.zones) {
      this.distributionState.fragmentDistribution.set(zoneId, 0);
    }
    
    console.log('[FragmentPositioningService] Distribution tracking initialized for', this.distributionState.fragmentDistribution.size, 'zones');
  }

  /**
   * Starts distribution monitoring processes
   */
  startDistributionMonitoring() {
    // Start balance monitoring
    if (this.distributionState.balanceMonitoring.enabled) {
      setInterval(() => {
        this.monitorDistributionBalance();
      }, this.distributionState.balanceMonitoring.monitoringInterval);
    }

    // Start clustering prevention
    if (this.distributionState.clusteringPrevention.enabled) {
      setInterval(() => {
        this.preventClustering();
      }, this.distributionState.clusteringPrevention.rebalanceInterval);
    }
  }

  /**
   * Positions fragment using zone-based positioning with distribution tracking
   */
  positionFragment(fragment, zone, distributionData = null) {
    // Apply clustering prevention before positioning
    const adjustedZone = this.applyClusteringPrevention(zone);
    
    // Zone-based positioning with coordinate conversion
    const position = this.convertZoneToCoordinates(adjustedZone, distributionData);

    // Apply margin and spacing calculations for center zones
    const adjustedPosition = this.applyZoneMargins(position, adjustedZone);

    // Set fragment position using absolute coordinates
    AnimationGuardian.safeAnimate(fragment, {
      position: "absolute",
      left: `${adjustedPosition.x}px`,
      top: `${adjustedPosition.y}px`,
      right: "auto",
      bottom: "auto",
      duration: 0, // Instant change
    });

    // Store zone information on fragment for tracking
    fragment.dataset.zoneId = adjustedZone.id;
    fragment.dataset.zoneType = adjustedZone.type;
    
    // Record fragment placement for distribution tracking
    this.recordFragmentPlacement(adjustedZone, fragment);
  }

  /**
   * Records fragment placement for distribution tracking
   */
  recordFragmentPlacement(zone, fragment) {
    // Update fragment count for this zone
    const currentCount = this.distributionState.fragmentDistribution.get(zone.id) || 0;
    this.distributionState.fragmentDistribution.set(zone.id, currentCount + 1);
    
    // Add to recent placements history
    this.distributionState.recentPlacements.push({
      zoneId: zone.id,
      zoneType: zone.type,
      timestamp: Date.now(),
      fragmentId: fragment.dataset.birthTime || Date.now()
    });
    
    // Maintain history size
    if (this.distributionState.recentPlacements.length > this.distributionState.maxHistorySize) {
      this.distributionState.recentPlacements.shift();
    }
    
    // Record event for consciousness tracking
    consciousness.recordEvent('fragment_placed_with_distribution_tracking', {
      zoneId: zone.id,
      zoneType: zone.type,
      currentZoneCount: this.distributionState.fragmentDistribution.get(zone.id),
      totalFragments: Array.from(this.distributionState.fragmentDistribution.values()).reduce((sum, count) => sum + count, 0)
    });
  }

  /**
   * Records when a fragment is removed from a zone
   */
  recordFragmentRemoval(zoneId) {
    if (!zoneId) return;
    
    const currentCount = this.distributionState.fragmentDistribution.get(zoneId) || 0;
    this.distributionState.fragmentDistribution.set(zoneId, Math.max(0, currentCount - 1));
    
    consciousness.recordEvent('fragment_removed_from_distribution_tracking', {
      zoneId: zoneId,
      remainingCount: this.distributionState.fragmentDistribution.get(zoneId)
    });
  }

  /**
   * Converts zone object to pixel coordinates
   */
  convertZoneToCoordinates(zone, distributionData = null) {
    // Get random position within zone bounds
    let position = zone.getRandomPosition(0.1); // 10% margin within zone

    // Apply distribution-based adjustments if provided
    if (distributionData && distributionData.centerBias) {
      position = this.applyCenterBias(
        position,
        zone,
        distributionData.centerBias
      );
    }

    return position;
  }

  /**
   * Applies margin and spacing calculations for different zone types
   */
  applyZoneMargins(position, zone) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Apply zone-specific margin adjustments
    switch (zone.type) {
      case "center":
        // Center zones get additional spacing to prevent overcrowding
        return this.applyCenterZoneSpacing(position, zone, viewport);
      case "edge":
        // Edge zones maintain minimum distance from viewport edges
        return this.applyEdgeZoneMargins(position, zone, viewport);
      case "transition":
        // Transition zones use balanced spacing
        return this.applyTransitionZoneSpacing(position, zone, viewport);
      default:
        return position;
    }
  }

  /**
   * Applies center zone spacing to prevent overcrowding
   */
  applyCenterZoneSpacing(position, zone, viewport) {
    const centerSpacing = Math.min(viewport.width, viewport.height) * 0.05; // 5% spacing

    // Add slight randomization to prevent grid-like appearance
    const randomOffset = {
      x: (Math.random() - 0.5) * centerSpacing,
      y: (Math.random() - 0.5) * centerSpacing,
    };

    return {
      x: Math.max(
        zone.bounds.x.min + centerSpacing,
        Math.min(zone.bounds.x.max - centerSpacing, position.x + randomOffset.x)
      ),
      y: Math.max(
        zone.bounds.y.min + centerSpacing,
        Math.min(zone.bounds.y.max - centerSpacing, position.y + randomOffset.y)
      ),
    };
  }

  /**
   * Applies edge zone margins to maintain viewport boundaries
   */
  applyEdgeZoneMargins(position, zone, viewport) {
    const edgeMargin = Math.min(viewport.width, viewport.height) * 0.02; // 2% margin

    return {
      x: Math.max(
        edgeMargin,
        Math.min(viewport.width - edgeMargin, position.x)
      ),
      y: Math.max(
        edgeMargin,
        Math.min(viewport.height - edgeMargin, position.y)
      ),
    };
  }

  /**
   * Applies transition zone spacing for balanced distribution
   */
  applyTransitionZoneSpacing(position, zone, viewport) {
    const transitionSpacing = Math.min(viewport.width, viewport.height) * 0.03; // 3% spacing

    return {
      x: Math.max(
        zone.bounds.x.min + transitionSpacing,
        Math.min(zone.bounds.x.max - transitionSpacing, position.x)
      ),
      y: Math.max(
        zone.bounds.y.min + transitionSpacing,
        Math.min(zone.bounds.y.max - transitionSpacing, position.y)
      ),
    };
  }

  /**
   * Applies center bias to position based on distribution data
   */
  applyCenterBias(position, zone, centerBias) {
    if (centerBias <= 0) return position;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const centerPoint = {
      x: viewport.width / 2,
      y: viewport.height / 2,
    };

    // Apply bias toward center point
    const biasStrength = Math.min(1.0, centerBias);

    return {
      x: position.x + (centerPoint.x - position.x) * biasStrength * 0.3,
      y: position.y + (centerPoint.y - position.y) * biasStrength * 0.3,
    };
  }

  /**
   * Applies clustering prevention logic before positioning
   */
  applyClusteringPrevention(originalZone) {
    if (!this.distributionState.clusteringPrevention.enabled) {
      return originalZone;
    }

    const currentDensity = this.getZoneDensity(originalZone.id);
    const averageDensity = this.getAverageDensity();
    const densityRatio = averageDensity > 0 ? currentDensity / averageDensity : 0;

    // If zone is too dense, try to find alternative
    if (densityRatio > this.distributionState.clusteringPrevention.maxDensityThreshold) {
      console.log(`[FragmentPositioningService] Clustering detected in zone ${originalZone.id}, density ratio: ${densityRatio.toFixed(2)}`);
      
      const alternativeZone = this.findAlternativeZone(originalZone);
      if (alternativeZone) {
        consciousness.recordEvent('clustering_prevention_applied', {
          originalZone: originalZone.id,
          alternativeZone: alternativeZone.id,
          densityRatio: densityRatio
        });
        return alternativeZone;
      }
    }

    return originalZone;
  }

  /**
   * Finds an alternative zone with lower density
   */
  findAlternativeZone(originalZone) {
    if (!this.zoneManager || !this.zoneManager.zones) return null;

    const zones = Array.from(this.zoneManager.zones.values());
    const sameTypeZones = zones.filter(zone => zone.type === originalZone.type);
    const allZones = sameTypeZones.length > 0 ? sameTypeZones : zones;

    // Find zone with lowest density
    let bestZone = null;
    let lowestDensity = Infinity;

    for (const zone of allZones) {
      if (zone.id === originalZone.id) continue;
      
      const density = this.getZoneDensity(zone.id);
      if (density < lowestDensity) {
        lowestDensity = density;
        bestZone = zone;
      }
    }

    return bestZone;
  }

  /**
   * Monitors distribution balance and triggers rebalancing if needed
   */
  monitorDistributionBalance() {
    const now = Date.now();
    if (now - this.distributionState.balanceMonitoring.lastCheck < this.distributionState.balanceMonitoring.monitoringInterval) {
      return;
    }

    this.distributionState.balanceMonitoring.lastCheck = now;

    const balanceScore = this.calculateBalanceScore();
    
    if (balanceScore < this.distributionState.balanceMonitoring.targetBalance) {
      console.log(`[FragmentPositioningService] Distribution balance below target: ${balanceScore.toFixed(2)}`);
      this.triggerRebalancing();
    }

    consciousness.recordEvent('distribution_balance_monitored', {
      balanceScore: balanceScore,
      targetBalance: this.distributionState.balanceMonitoring.targetBalance,
      rebalancingTriggered: balanceScore < this.distributionState.balanceMonitoring.targetBalance
    });
  }

  /**
   * Prevents clustering by monitoring zone densities
   */
  preventClustering() {
    const now = Date.now();
    if (now - this.distributionState.clusteringPrevention.lastRebalance < this.distributionState.clusteringPrevention.rebalanceInterval) {
      return;
    }

    this.distributionState.clusteringPrevention.lastRebalance = now;

    const averageDensity = this.getAverageDensity();
    const maxAllowedDensity = averageDensity * this.distributionState.clusteringPrevention.maxDensityThreshold;
    
    let clusteringDetected = false;

    for (const [zoneId, fragmentCount] of this.distributionState.fragmentDistribution) {
      const density = this.getZoneDensity(zoneId);
      
      if (density > maxAllowedDensity && fragmentCount > 0) {
        console.log(`[FragmentPositioningService] Clustering prevention: Zone ${zoneId} density ${density.toFixed(3)} exceeds threshold`);
        clusteringDetected = true;
        
        // Reduce zone weight in zone manager to discourage future placements
        const zone = this.zoneManager.getZone(zoneId);
        if (zone) {
          zone.weight *= 0.7; // Reduce weight by 30%
        }
      }
    }

    if (clusteringDetected) {
      consciousness.recordEvent('clustering_prevention_triggered', {
        averageDensity: averageDensity,
        maxAllowedDensity: maxAllowedDensity,
        affectedZones: Array.from(this.distributionState.fragmentDistribution.entries())
          .filter(([zoneId, count]) => this.getZoneDensity(zoneId) > maxAllowedDensity && count > 0)
          .map(([zoneId]) => zoneId)
      });
    }
  }

  /**
   * Calculates the density of fragments in a specific zone
   */
  getZoneDensity(zoneId) {
    const fragmentCount = this.distributionState.fragmentDistribution.get(zoneId) || 0;
    const zone = this.zoneManager.getZone(zoneId);
    
    if (!zone) return 0;
    
    const area = zone.getArea();
    return area > 0 ? fragmentCount / area : 0;
  }

  /**
   * Calculates average density across all zones
   */
  getAverageDensity() {
    if (!this.zoneManager || !this.zoneManager.zones) return 0;

    const zones = Array.from(this.zoneManager.zones.values());
    const totalDensity = zones.reduce((sum, zone) => {
      return sum + this.getZoneDensity(zone.id);
    }, 0);

    return zones.length > 0 ? totalDensity / zones.length : 0;
  }

  /**
   * Calculates distribution balance score (0-1, where 1 is perfectly balanced)
   */
  calculateBalanceScore() {
    if (!this.zoneManager || !this.zoneManager.zones) return 1.0;

    const zones = Array.from(this.zoneManager.zones.values());
    if (zones.length === 0) return 1.0;

    const densities = zones.map(zone => this.getZoneDensity(zone.id));
    const avgDensity = densities.reduce((sum, d) => sum + d, 0) / densities.length;

    if (avgDensity === 0) return 1.0;

    // Calculate coefficient of variation (lower is more balanced)
    const variance = densities.reduce((sum, d) => sum + Math.pow(d - avgDensity, 2), 0) / densities.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgDensity;

    // Convert to balance score (0-1, where 1 is perfectly balanced)
    return Math.max(0, 1 - coefficientOfVariation);
  }

  /**
   * Triggers rebalancing when distribution becomes uneven
   */
  triggerRebalancing() {
    console.log('[FragmentPositioningService] Triggering distribution rebalancing');

    if (!this.zoneManager || !this.zoneManager.zones) return;

    const averageDensity = this.getAverageDensity();

    // Adjust zone weights based on current density
    for (const zone of this.zoneManager.zones.values()) {
      const density = this.getZoneDensity(zone.id);
      
      if (density < averageDensity * 0.5) {
        // Boost underutilized zones
        zone.weight *= 1.5;
      } else if (density > averageDensity * 2) {
        // Reduce overutilized zones
        zone.weight *= 0.6;
      }
    }

    consciousness.recordEvent('distribution_rebalancing_triggered', {
      averageDensity: averageDensity,
      balanceScore: this.calculateBalanceScore(),
      zoneAdjustments: Array.from(this.zoneManager.zones.values()).map(zone => ({
        zoneId: zone.id,
        density: this.getZoneDensity(zone.id),
        weight: zone.weight
      }))
    });

    // Reset weights after a delay to prevent permanent bias
    setTimeout(() => {
      this.resetZoneWeights();
    }, 15000); // 15 seconds
  }

  /**
   * Resets zone weights to their original values
   */
  resetZoneWeights() {
    if (!this.zoneManager || !this.zoneManager.zones) return;

    for (const zone of this.zoneManager.zones.values()) {
      // Reset to original weights based on zone type
      switch (zone.type) {
        case 'center':
          zone.weight = zone.id === 'center' ? 1.5 : 1.2;
          break;
        case 'edge':
          zone.weight = 0.8;
          break;
        case 'transition':
          zone.weight = 1.0;
          break;
        default:
          zone.weight = 1.0;
      }
    }

    console.log('[FragmentPositioningService] Zone weights reset to defaults');
  }

  /**
   * Gets current distribution statistics
   */
  getDistributionStats() {
    return {
      fragmentDistribution: new Map(this.distributionState.fragmentDistribution),
      recentPlacements: [...this.distributionState.recentPlacements],
      balanceScore: this.calculateBalanceScore(),
      averageDensity: this.getAverageDensity(),
      totalFragments: Array.from(this.distributionState.fragmentDistribution.values()).reduce((sum, count) => sum + count, 0),
      clusteringPrevention: {
        enabled: this.distributionState.clusteringPrevention.enabled,
        maxDensityThreshold: this.distributionState.clusteringPrevention.maxDensityThreshold
      },
      balanceMonitoring: {
        enabled: this.distributionState.balanceMonitoring.enabled,
        targetBalance: this.distributionState.balanceMonitoring.targetBalance
      }
    };
  }

  /**
   * Determines distribution strategy based on performance tier and current state
   */
  getDistributionStrategy(performanceTier) {
    // Consider current balance when determining strategy
    const balanceScore = this.calculateBalanceScore();
    
    // If balance is poor, prefer more aggressive distribution strategies
    if (balanceScore < 0.5) {
      switch (performanceTier) {
        case "high":
          return "organic"; // Most sophisticated distribution
        case "medium":
          return "center-weighted"; // Balanced with center bias
        case "low":
          return "balanced"; // Upgrade from edge-only when rebalancing needed
        default:
          return "balanced";
      }
    }

    // Base strategy on performance tier
    switch (performanceTier) {
      case "high":
        return "organic"; // Most sophisticated distribution
      case "medium":
        return "center-weighted"; // Balanced with center bias
      case "low":
        return "edge-only"; // Fallback to simple edge positioning
      default:
        return "balanced";
    }
  }

  /**
   * Destroys the positioning service and cleans up resources
   */
  destroy() {
    console.log('[FragmentPositioningService] Destroying positioning service');
    
    // Clear distribution state
    this.distributionState.fragmentDistribution.clear();
    this.distributionState.recentPlacements = [];
    
    consciousness.recordEvent('fragment_positioning_service_destroyed', {
      finalStats: this.getDistributionStats()
    });
  }
}
