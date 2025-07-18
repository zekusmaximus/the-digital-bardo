import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { BrowserCompatibilityManager } from './browser-compatibility-manager.js';

/**
 * Manages performance optimizations and memory management for zone-based positioning
 */
export class ZoneOptimizationManager {
  constructor(zoneManager) {
    this.zoneManager = zoneManager;
    this.guardian = new ResourceGuardian();
    
    // Initialize browser compatibility manager
    this.compatibilityManager = new BrowserCompatibilityManager();
    
    // Circular buffer for distribution history
    this.distributionBuffer = {
      capacity: 50,
      data: new Array(50),
      head: 0,
      tail: 0,
      size: 0
    };
    
    // Cache for zone calculations
    this.zoneCalculationCache = new Map();
    this.maxCacheSize = 100;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    
    // Performance monitoring
    this.performanceMetrics = {
      lastCleanupTime: Date.now(),
      cleanupInterval: 30000, // 30 seconds
      calculationTimes: [],
      maxCalculationSamples: 20
    };
    
    // Error tracking for fallbacks
    this.errorTracking = {
      positioningErrors: 0,
      pathCalculationErrors: 0,
      lastErrorTime: 0,
      errorThreshold: 5, // Number of errors before applying permanent fallbacks
      errorTimeWindow: 60000 // 1 minute window for error tracking
    };
    
    // Initialize cleanup interval
    this.setupCleanupInterval();
  }
  
  /**
   * Sets up periodic cleanup interval
   */
  setupCleanupInterval() {
    const cleanupInterval = setInterval(() => {
      this.performMemoryCleanup();
    }, this.performanceMetrics.cleanupInterval);
    
    // Register cleanup with guardian
    this.guardian.register(() => {
      clearInterval(cleanupInterval);
    });
  }
  
  /**
   * Adds an entry to the circular distribution history buffer
   */
  addDistributionEntry(entry) {
    // Store entry in circular buffer
    this.distributionBuffer.data[this.distributionBuffer.head] = {
      ...entry,
      timestamp: Date.now()
    };
    
    // Update head pointer
    this.distributionBuffer.head = (this.distributionBuffer.head + 1) % this.distributionBuffer.capacity;
    
    // Update size and tail pointer if needed
    if (this.distributionBuffer.size < this.distributionBuffer.capacity) {
      this.distributionBuffer.size++;
    } else {
      // Buffer is full, move tail pointer
      this.distributionBuffer.tail = (this.distributionBuffer.tail + 1) % this.distributionBuffer.capacity;
    }
  }
  
  /**
   * Gets distribution history entries
   */
  getDistributionHistory(count = null) {
    const result = [];
    const size = count ? Math.min(count, this.distributionBuffer.size) : this.distributionBuffer.size;
    
    for (let i = 0; i < size; i++) {
      const index = (this.distributionBuffer.tail + i) % this.distributionBuffer.capacity;
      if (this.distributionBuffer.data[index]) {
        result.push(this.distributionBuffer.data[index]);
      }
    }
    
    return result;
  }
  
  /**
   * Optimized zone calculation with caching and fallback handling
   */
  calculateZonePosition(zone, distributionData = null) {
    const startTime = performance.now();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    try {
      // Generate cache key
      const cacheKey = this.generateZoneCacheKey(zone, distributionData);
      
      // Check cache first
      if (this.zoneCalculationCache.has(cacheKey)) {
        this.cacheHits++;
        const cachedResult = this.zoneCalculationCache.get(cacheKey);
        
        // Add some randomization to prevent identical positions
        const jitter = 5; // 5px jitter
        cachedResult.x += (Math.random() - 0.5) * jitter;
        cachedResult.y += (Math.random() - 0.5) * jitter;
        
        // Validate position is within viewport bounds
        return this.compatibilityManager.validatePosition({ ...cachedResult }, viewport);
      }
      
      this.cacheMisses++;
      
      // Perform calculation
      let position;
      if (zone && zone.getRandomPosition) {
        // Check if we should use simple positioning based on browser compatibility
        if (this.compatibilityManager.supportsFeature('advancedPositioning')) {
          position = zone.getRandomPosition(0.1); // 10% margin
          
          // Apply distribution-based adjustments if provided
          if (distributionData && distributionData.centerBias && 
              this.compatibilityManager.supportsFeature('centerTraversal')) {
            position = this.applyCenterBias(position, zone, distributionData.centerBias);
          }
        } else {
          // Use simpler positioning algorithm for compatibility
          position = this.getSimpleZonePosition(zone);
        }
        
        // Cache the result
        this.zoneCalculationCache.set(cacheKey, { ...position });
        
        // Manage cache size
        if (this.zoneCalculationCache.size > this.maxCacheSize) {
          // Remove oldest entry
          const oldestKey = this.zoneCalculationCache.keys().next().value;
          this.zoneCalculationCache.delete(oldestKey);
        }
      } else {
        // Use fallback for invalid zone
        throw new Error('Invalid zone provided for position calculation');
      }
      
      // Track calculation time
      const endTime = performance.now();
      this.trackCalculationTime(endTime - startTime);
      
      // Validate position is within viewport bounds
      return this.compatibilityManager.validatePosition(position, viewport);
    } catch (error) {
      // Track positioning error
      this.trackPositioningError();
      
      // Use fallback positioning
      return this.compatibilityManager.getPositioningFallback(error, viewport);
    }
  }
  
  /**
   * Simplified zone position calculation for compatibility mode
   */
  getSimpleZonePosition(zone) {
    if (!zone || !zone.bounds) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
    
    // Simple calculation without complex algorithms
    const x = zone.bounds.x.min + Math.random() * (zone.bounds.x.max - zone.bounds.x.min);
    const y = zone.bounds.y.min + Math.random() * (zone.bounds.y.max - zone.bounds.y.min);
    
    return { x, y };
  }
  
  /**
   * Tracks positioning errors and applies fallbacks if needed
   */
  trackPositioningError() {
    const now = Date.now();
    
    // Reset error count if outside time window
    if (now - this.errorTracking.lastErrorTime > this.errorTracking.errorTimeWindow) {
      this.errorTracking.positioningErrors = 0;
    }
    
    this.errorTracking.lastErrorTime = now;
    this.errorTracking.positioningErrors++;
    
    // Apply permanent fallbacks if error threshold is exceeded
    if (this.errorTracking.positioningErrors >= this.errorTracking.errorThreshold) {
      console.warn(`[ZoneOptimizationManager] Positioning error threshold exceeded (${this.errorTracking.positioningErrors} errors). Applying permanent fallbacks.`);
      
      // Force simple positioning mode
      this.compatibilityManager.fallbackSettings.useSimplePositioning = true;
      
      // Record fallback event
      consciousness.recordEvent('positioning_fallback_permanent', {
        errorCount: this.errorTracking.positioningErrors,
        browser: this.compatibilityManager.browserInfo
      });
    }
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
   * Generates a cache key for zone calculations
   */
  generateZoneCacheKey(zone, distributionData) {
    if (!zone) return 'null-zone';
    
    const zoneId = zone.id || 'unknown';
    const zoneBounds = zone.bounds ? 
      `${Math.round(zone.bounds.x.min)}-${Math.round(zone.bounds.x.max)}-${Math.round(zone.bounds.y.min)}-${Math.round(zone.bounds.y.max)}` : 
      'no-bounds';
    const centerBias = distributionData && distributionData.centerBias ? 
      Math.round(distributionData.centerBias * 10) / 10 : 
      'no-bias';
    
    return `${zoneId}-${zoneBounds}-${centerBias}`;
  }
  
  /**
   * Tracks calculation time for performance monitoring
   */
  trackCalculationTime(time) {
    this.performanceMetrics.calculationTimes.push(time);
    
    // Keep array at max size
    if (this.performanceMetrics.calculationTimes.length > this.performanceMetrics.maxCalculationSamples) {
      this.performanceMetrics.calculationTimes.shift();
    }
  }
  
  /**
   * Gets average calculation time
   */
  getAverageCalculationTime() {
    if (this.performanceMetrics.calculationTimes.length === 0) return 0;
    
    const sum = this.performanceMetrics.calculationTimes.reduce((a, b) => a + b, 0);
    return sum / this.performanceMetrics.calculationTimes.length;
  }
  
  /**
   * Optimized path waypoint generation with object pooling and fallback handling
   */
  generatePathWaypoints(pathType, startPoint, endPoint, options = {}) {
    try {
      // Check if complex paths are supported by the browser
      if (!this.compatibilityManager.supportsFeature('complexAnimations') && pathType !== 'linear') {
        // Fall back to linear paths for browsers with limited animation support
        pathType = 'linear';
      }
      
      // Validate input points
      if (!this.validatePoint(startPoint) || !this.validatePoint(endPoint)) {
        throw new Error('Invalid start or end point for path generation');
      }
      
      // Adjust waypoint count based on browser capabilities
      let waypointCount = options.waypointCount || 3;
      const animSettings = this.compatibilityManager.getAnimationSettings();
      
      // For browsers with limited capabilities, reduce waypoint count
      if (!animSettings.useGPUAcceleration || this.compatibilityManager.fallbackSettings.useBasicAnimations) {
        waypointCount = Math.min(waypointCount, 3);
      }
      
      // Use object pool for waypoints to reduce garbage collection
      const waypoints = this.borrowWaypointArray(waypointCount);
      
      // Generate waypoints based on path type
      switch (pathType) {
        case 'linear':
          this.generateLinearWaypoints(startPoint, endPoint, waypoints);
          break;
        case 'curved':
          this.generateCurvedWaypoints(startPoint, endPoint, waypoints, options);
          break;
        case 'orbital':
          this.generateOrbitalWaypoints(startPoint, endPoint, waypoints, options);
          break;
        default:
          this.generateLinearWaypoints(startPoint, endPoint, waypoints);
      }
      
      // Validate all waypoints are within viewport bounds
      this.validateWaypointsInViewport(waypoints);
      
      return waypoints;
    } catch (error) {
      // Track path calculation error
      this.trackPathCalculationError();
      
      // Use fallback path calculation
      return this.getPathCalculationFallback(startPoint, endPoint, error);
    }
  }
  
  /**
   * Validates that a point is valid
   */
  validatePoint(point) {
    return point && 
           typeof point.x === 'number' && 
           typeof point.y === 'number' && 
           !isNaN(point.x) && 
           !isNaN(point.y);
  }
  
  /**
   * Validates that all waypoints are within viewport bounds
   */
  validateWaypointsInViewport(waypoints) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Add a small margin to avoid edge clipping
    const margin = 5;
    
    for (let i = 0; i < waypoints.length; i++) {
      // Ensure waypoint is within viewport bounds
      waypoints[i].x = Math.max(margin, Math.min(viewport.width - margin, waypoints[i].x));
      waypoints[i].y = Math.max(margin, Math.min(viewport.height - margin, waypoints[i].y));
    }
  }
  
  /**
   * Provides fallback for path calculation failures
   */
  getPathCalculationFallback(startPoint, endPoint, error) {
    // Use browser compatibility manager's fallback
    const fallbackWaypoints = this.compatibilityManager.getPathCalculationFallback(
      error, 
      startPoint, 
      endPoint
    );
    
    // Convert to waypoint array from pool
    const waypoints = this.borrowWaypointArray(fallbackWaypoints.length);
    for (let i = 0; i < fallbackWaypoints.length; i++) {
      waypoints[i].x = fallbackWaypoints[i].x;
      waypoints[i].y = fallbackWaypoints[i].y;
    }
    
    return waypoints;
  }
  
  /**
   * Tracks path calculation errors and applies fallbacks if needed
   */
  trackPathCalculationError() {
    const now = Date.now();
    
    // Reset error count if outside time window
    if (now - this.errorTracking.lastErrorTime > this.errorTracking.errorTimeWindow) {
      this.errorTracking.pathCalculationErrors = 0;
    }
    
    this.errorTracking.lastErrorTime = now;
    this.errorTracking.pathCalculationErrors++;
    
    // Apply permanent fallbacks if error threshold is exceeded
    if (this.errorTracking.pathCalculationErrors >= this.errorTracking.errorThreshold) {
      console.warn(`[ZoneOptimizationManager] Path calculation error threshold exceeded (${this.errorTracking.pathCalculationErrors} errors). Applying permanent fallbacks.`);
      
      // Force basic animations
      this.compatibilityManager.fallbackSettings.useBasicAnimations = true;
      
      // Record fallback event
      consciousness.recordEvent('path_fallback_permanent', {
        errorCount: this.errorTracking.pathCalculationErrors,
        browser: this.compatibilityManager.browserInfo
      });
    }
  }
  
  /**
   * Waypoint object pool
   */
  waypointPool = [];
  waypointArrayPool = [];
  
  /**
   * Borrows a waypoint object from the pool
   */
  borrowWaypoint() {
    if (this.waypointPool.length > 0) {
      return this.waypointPool.pop();
    }
    return { x: 0, y: 0 };
  }
  
  /**
   * Returns a waypoint object to the pool
   */
  returnWaypoint(waypoint) {
    if (this.waypointPool.length < 100) { // Limit pool size
      waypoint.x = 0;
      waypoint.y = 0;
      this.waypointPool.push(waypoint);
    }
  }
  
  /**
   * Borrows an array of waypoints from the pool
   */
  borrowWaypointArray(size) {
    // Try to find an array of appropriate size in the pool
    for (let i = 0; i < this.waypointArrayPool.length; i++) {
      if (this.waypointArrayPool[i].length >= size) {
        const array = this.waypointArrayPool.splice(i, 1)[0];
        // Resize if needed
        array.length = size;
        return array;
      }
    }
    
    // Create new array with waypoints from pool
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      array[i] = this.borrowWaypoint();
    }
    return array;
  }
  
  /**
   * Returns an array of waypoints to the pool
   */
  returnWaypointArray(array) {
    if (this.waypointArrayPool.length < 20) { // Limit pool size
      this.waypointArrayPool.push(array);
    } else {
      // Return individual waypoints to pool
      for (let i = 0; i < array.length; i++) {
        this.returnWaypoint(array[i]);
      }
    }
  }
  
  /**
   * Generates linear waypoints
   */
  generateLinearWaypoints(startPoint, endPoint, waypoints) {
    const count = waypoints.length;
    
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      waypoints[i].x = startPoint.x + (endPoint.x - startPoint.x) * t;
      waypoints[i].y = startPoint.y + (endPoint.y - startPoint.y) * t;
    }
  }
  
  /**
   * Generates curved waypoints
   */
  generateCurvedWaypoints(startPoint, endPoint, waypoints, options) {
    const count = waypoints.length;
    const controlPoint = options.controlPoint || {
      x: (startPoint.x + endPoint.x) / 2 + (Math.random() - 0.5) * 100,
      y: (startPoint.y + endPoint.y) / 2 + (Math.random() - 0.5) * 100
    };
    
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const oneMinusT = 1 - t;
      
      // Quadratic Bezier
      waypoints[i].x = oneMinusT * oneMinusT * startPoint.x + 
                       2 * oneMinusT * t * controlPoint.x + 
                       t * t * endPoint.x;
      waypoints[i].y = oneMinusT * oneMinusT * startPoint.y + 
                       2 * oneMinusT * t * controlPoint.y + 
                       t * t * endPoint.y;
    }
  }
  
  /**
   * Generates orbital waypoints
   */
  generateOrbitalWaypoints(startPoint, endPoint, waypoints, options) {
    const count = waypoints.length;
    const center = options.center || {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2
    };
    
    const radius = options.radius || 
      Math.sqrt(Math.pow(startPoint.x - center.x, 2) + Math.pow(startPoint.y - center.y, 2));
    
    const startAngle = Math.atan2(startPoint.y - center.y, startPoint.x - center.x);
    const endAngle = Math.atan2(endPoint.y - center.y, endPoint.x - center.x);
    
    // Ensure we go the shortest way around the circle
    let angleSpan = endAngle - startAngle;
    if (angleSpan > Math.PI) angleSpan -= Math.PI * 2;
    if (angleSpan < -Math.PI) angleSpan += Math.PI * 2;
    
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const angle = startAngle + angleSpan * t;
      
      waypoints[i].x = center.x + Math.cos(angle) * radius;
      waypoints[i].y = center.y + Math.sin(angle) * radius;
    }
  }
  
  /**
   * Performs memory cleanup for temporary objects
   */
  performMemoryCleanup() {
    const now = Date.now();
    
    // Only clean up if enough time has passed
    if (now - this.performanceMetrics.lastCleanupTime < this.performanceMetrics.cleanupInterval) {
      return;
    }
    
    this.performanceMetrics.lastCleanupTime = now;
    
    // Clean up old cache entries
    if (this.zoneCalculationCache.size > this.maxCacheSize / 2) {
      // Remove oldest entries to keep cache at half capacity
      const entriesToRemove = this.zoneCalculationCache.size - Math.floor(this.maxCacheSize / 2);
      let removed = 0;
      
      for (const key of this.zoneCalculationCache.keys()) {
        this.zoneCalculationCache.delete(key);
        removed++;
        if (removed >= entriesToRemove) break;
      }
      
      console.log(`[ZoneOptimizationManager] Cleaned up ${removed} cache entries`);
    }
    
    // Log performance metrics
    const cacheEfficiency = this.cacheHits / (this.cacheHits + this.cacheMisses || 1);
    const avgCalculationTime = this.getAverageCalculationTime();
    
    console.log(`[ZoneOptimizationManager] Performance metrics:
      - Cache hit rate: ${(cacheEfficiency * 100).toFixed(1)}%
      - Average calculation time: ${avgCalculationTime.toFixed(2)}ms
      - Waypoint pool size: ${this.waypointPool.length}
      - Waypoint array pool size: ${this.waypointArrayPool.length}
    `);
    
    // Record metrics for consciousness tracking
    consciousness.recordEvent('zone_optimization_metrics', {
      cacheSize: this.zoneCalculationCache.size,
      cacheHitRate: cacheEfficiency,
      avgCalculationTime: avgCalculationTime,
      waypointPoolSize: this.waypointPool.length,
      waypointArrayPoolSize: this.waypointArrayPool.length,
      distributionBufferSize: this.distributionBuffer.size
    });
  }
  
  /**
   * Gets performance metrics
   */
  getPerformanceMetrics() {
    return {
      cacheSize: this.zoneCalculationCache.size,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      cacheHitRate: this.cacheHits / (this.cacheHits + this.cacheMisses || 1),
      avgCalculationTime: this.getAverageCalculationTime(),
      waypointPoolSize: this.waypointPool.length,
      waypointArrayPoolSize: this.waypointArrayPool.length,
      distributionBufferSize: this.distributionBuffer.size,
      lastCleanupTime: this.performanceMetrics.lastCleanupTime
    };
  }
  
  /**
   * Destroys the optimization manager and cleans up resources
   */
  destroy() {
    // Clear all caches and pools
    this.zoneCalculationCache.clear();
    this.waypointPool = [];
    this.waypointArrayPool = [];
    this.distributionBuffer.data = [];
    this.performanceMetrics.calculationTimes = [];
    
    // Clean up browser compatibility manager
    if (this.compatibilityManager) {
      this.compatibilityManager.destroy();
    }
    
    // Run guardian cleanup
    this.guardian.cleanup();
    
    console.log('[ZoneOptimizationManager] Resources cleaned up');
  }
}