import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ZoneOptimizationManager } from '../clear-lode/zone-optimization-manager.js';
import { PositionZone } from '../clear-lode/position-zone-manager.js';

// Mock consciousness for testing
vi.mock('../src/consciousness/digital-soul.js', () => ({
  consciousness: {
    recordEvent: vi.fn()
  }
}));

// Mock ResourceGuardian for testing
vi.mock('../src/consciousness/resource-guardian.js', () => ({
  ResourceGuardian: vi.fn().mockImplementation(() => ({
    register: vi.fn(),
    cleanup: vi.fn()
  }))
}));

describe('ZoneOptimizationManager', () => {
  let mockZoneManager;
  let optimizationManager;
  let mockZone;

  beforeEach(() => {
    // Create mock zone manager
    mockZoneManager = {
      zones: new Map(),
      getZone: vi.fn()
    };
    
    // Create mock zone
    mockZone = new PositionZone('test-zone', 'center', {
      x: { min: 100, max: 200 },
      y: { min: 100, max: 200 }
    });
    
    // Add mock zone to zone manager
    mockZoneManager.zones.set('test-zone', mockZone);
    mockZoneManager.getZone.mockImplementation(id => mockZoneManager.zones.get(id));
    
    // Create optimization manager
    optimizationManager = new ZoneOptimizationManager(mockZoneManager);
    
    // Mock performance.now
    global.performance = {
      now: vi.fn().mockReturnValue(1000)
    };
    
    // Mock window dimensions
    global.window = {
      innerWidth: 1024,
      innerHeight: 768
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should initialize with default values', () => {
    expect(optimizationManager.distributionBuffer.capacity).toBe(50);
    expect(optimizationManager.distributionBuffer.size).toBe(0);
    expect(optimizationManager.zoneCalculationCache.size).toBe(0);
    expect(optimizationManager.cacheHits).toBe(0);
    expect(optimizationManager.cacheMisses).toBe(0);
  });

  test('should add and retrieve distribution entries using circular buffer', () => {
    // Add test entries
    optimizationManager.addDistributionEntry({ zone: mockZone, type: 'center' });
    optimizationManager.addDistributionEntry({ zone: mockZone, type: 'center' });
    
    // Check buffer state
    expect(optimizationManager.distributionBuffer.size).toBe(2);
    expect(optimizationManager.distributionBuffer.head).toBe(2);
    expect(optimizationManager.distributionBuffer.tail).toBe(0);
    
    // Get history entries
    const history = optimizationManager.getDistributionHistory();
    expect(history.length).toBe(2);
    expect(history[0].zone).toBe(mockZone);
    expect(history[1].zone).toBe(mockZone);
  });

  test('should cache zone position calculations', () => {
    // First calculation should miss cache
    const position1 = optimizationManager.calculateZonePosition(mockZone);
    expect(optimizationManager.cacheMisses).toBe(1);
    expect(optimizationManager.cacheHits).toBe(0);
    
    // Second calculation with same zone should hit cache
    const position2 = optimizationManager.calculateZonePosition(mockZone);
    expect(optimizationManager.cacheMisses).toBe(1);
    expect(optimizationManager.cacheHits).toBe(1);
    
    // Positions should be similar but not identical due to jitter
    expect(Math.abs(position1.x - position2.x)).toBeLessThan(10);
    expect(Math.abs(position1.y - position2.y)).toBeLessThan(10);
  });

  test('should generate waypoints using object pool', () => {
    // Generate waypoints
    const startPoint = { x: 100, y: 100 };
    const endPoint = { x: 200, y: 200 };
    
    const waypoints = optimizationManager.generatePathWaypoints('linear', startPoint, endPoint, { waypointCount: 5 });
    
    // Check waypoints
    expect(waypoints.length).toBe(5);
    expect(waypoints[0].x).toBe(100);
    expect(waypoints[0].y).toBe(100);
    expect(waypoints[4].x).toBe(200);
    expect(waypoints[4].y).toBe(200);
    
    // Check waypoint pool
    expect(optimizationManager.waypointPool.length).toBe(0);
    
    // Return waypoints to pool
    optimizationManager.returnWaypointArray(waypoints);
    
    // Check pool state
    expect(optimizationManager.waypointArrayPool.length).toBe(1);
  });

  test('should perform memory cleanup', () => {
    // Fill cache with entries
    for (let i = 0; i < 60; i++) {
      const mockZone = new PositionZone(`zone-${i}`, 'center', {
        x: { min: i * 10, max: (i + 1) * 10 },
        y: { min: i * 10, max: (i + 1) * 10 }
      });
      optimizationManager.calculateZonePosition(mockZone);
    }
    
    // Cache should be full
    expect(optimizationManager.zoneCalculationCache.size).toBe(60);
    
    // Set last cleanup time to trigger cleanup
    optimizationManager.performanceMetrics.lastCleanupTime = 0;
    
    // Perform cleanup
    optimizationManager.performMemoryCleanup();
    
    // Cache should be reduced
    expect(optimizationManager.zoneCalculationCache.size).toBeLessThan(60);
  });

  test('should generate different waypoint patterns', () => {
    // Test linear waypoints
    const linearWaypoints = optimizationManager.generatePathWaypoints(
      'linear',
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { waypointCount: 3 }
    );
    expect(linearWaypoints.length).toBe(3);
    expect(linearWaypoints[0].x).toBe(0);
    expect(linearWaypoints[2].x).toBe(100);
    
    // Test curved waypoints
    const curvedWaypoints = optimizationManager.generatePathWaypoints(
      'curved',
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { waypointCount: 3, controlPoint: { x: 50, y: 20 } }
    );
    expect(curvedWaypoints.length).toBe(3);
    
    // Test orbital waypoints
    const orbitalWaypoints = optimizationManager.generatePathWaypoints(
      'orbital',
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { waypointCount: 5, center: { x: 50, y: 50 }, radius: 50 }
    );
    expect(orbitalWaypoints.length).toBe(5);
  });

  test('should destroy and clean up resources', () => {
    // Add some data to caches and pools
    optimizationManager.addDistributionEntry({ zone: mockZone, type: 'center' });
    optimizationManager.calculateZonePosition(mockZone);
    const waypoints = optimizationManager.generatePathWaypoints('linear', { x: 0, y: 0 }, { x: 100, y: 100 }, { waypointCount: 3 });
    optimizationManager.returnWaypointArray(waypoints);
    
    // Destroy manager
    optimizationManager.destroy();
    
    // Check that resources are cleaned up
    expect(optimizationManager.zoneCalculationCache.size).toBe(0);
    expect(optimizationManager.waypointPool.length).toBe(0);
    expect(optimizationManager.waypointArrayPool.length).toBe(0);
    expect(optimizationManager.distributionBuffer.data.length).toBe(0);
  });
});