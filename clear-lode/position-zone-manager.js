import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

/**
 * Represents a positioning zone on the screen with boundaries and distribution tracking
 */
export class PositionZone {
    constructor(id, type, bounds, weight = 1.0) {
        this.id = id;
        this.type = type; // 'edge', 'center', 'transition'
        this.bounds = bounds; // { x: { min, max }, y: { min, max } }
        this.weight = weight; // Distribution probability weight
        this.activeFragments = 0;
        this.lastUsed = 0;
        this.totalUsage = 0;
        this.createdAt = Date.now();
    }

    /**
     * Gets the center point of this zone
     */
    getCenter() {
        return {
            x: (this.bounds.x.min + this.bounds.x.max) / 2,
            y: (this.bounds.y.min + this.bounds.y.max) / 2
        };
    }

    /**
     * Gets a random position within this zone with optional margin
     */
    getRandomPosition(margin = 0) {
        const marginX = (this.bounds.x.max - this.bounds.x.min) * margin;
        const marginY = (this.bounds.y.max - this.bounds.y.min) * margin;

        return {
            x: this.bounds.x.min + marginX + Math.random() * (this.bounds.x.max - this.bounds.x.min - 2 * marginX),
            y: this.bounds.y.min + marginY + Math.random() * (this.bounds.y.max - this.bounds.y.min - 2 * marginY)
        };
    }

    /**
     * Checks if a point is within this zone
     */
    containsPoint(x, y) {
        return x >= this.bounds.x.min && x <= this.bounds.x.max &&
               y >= this.bounds.y.min && y <= this.bounds.y.max;
    }

    /**
     * Gets the area of this zone in square pixels
     */
    getArea() {
        return (this.bounds.x.max - this.bounds.x.min) * (this.bounds.y.max - this.bounds.y.min);
    }

    /**
     * Updates zone usage statistics
     */
    recordUsage() {
        this.lastUsed = Date.now();
        this.totalUsage++;
        this.activeFragments++;
    }

    /**
     * Decrements active fragment count
     */
    releaseFragment() {
        this.activeFragments = Math.max(0, this.activeFragments - 1);
    }

    /**
     * Gets current density (fragments per unit area)
     */
    getDensity() {
        const area = this.getArea();
        return area > 0 ? this.activeFragments / area : 0;
    }
}

/**
 * Manages screen zones for dynamic text positioning
 */
export class PositionZoneManager {
    constructor() {
        this.zones = new Map();
        this.distributionHistory = [];
        this.maxHistorySize = 50;
        this.guardian = new ResourceGuardian();
        
        // Distribution tracking
        this.distributionState = {
            zoneDensity: new Map(),
            recentPlacements: [],
            centerUtilization: 0,
            balanceScore: 1.0
        };

        // Viewport tracking
        this.lastViewport = {
            width: 0,
            height: 0,
            orientation: 'landscape'
        };

        // Configuration
        this.config = {
            edgeMargin: 0.05, // 5% margin from screen edges
            centerZoneSize: 0.4, // 40% of screen for center zone
            transitionZoneWidth: 0.15, // 15% width for transition zones
            maxDensityRatio: 2.0, // Maximum density ratio between zones
            rebalanceThreshold: 0.3, // Trigger rebalancing when balance score drops below this
            resizeDebounceTime: 250, // Debounce time for resize events in ms
            orientationChangeDelay: 300, // Additional delay for orientation changes in ms
            minZoneSize: 40, // Minimum zone size in pixels
            aspectRatioThreshold: 0.2 // Threshold for significant aspect ratio changes
        };

        this.initializeZones();
        this.setupResizeHandler();
    }

    /**
     * Initializes screen zones based on current viewport
     */
    initializeZones() {
        const viewport = this.getViewportDimensions();
        this.zones.clear();
        
        // Store current viewport for change detection
        this.lastViewport = { ...viewport };
        
        // Adjust configuration based on viewport characteristics
        this.adjustConfigForViewport(viewport);
        
        // Calculate zone boundaries
        const edgeMargin = viewport.width * this.config.edgeMargin;
        const centerSize = Math.min(viewport.width, viewport.height) * this.config.centerZoneSize;
        const transitionWidth = Math.min(viewport.width, viewport.height) * this.config.transitionZoneWidth;

        // Center zones
        const centerX = viewport.width / 2;
        const centerY = viewport.height / 2;
        const halfCenter = centerSize / 2;

        // Main center zone
        this.addZone('center', 'center', {
            x: { min: centerX - halfCenter, max: centerX + halfCenter },
            y: { min: centerY - halfCenter, max: centerY + halfCenter }
        }, 1.5); // Higher weight for center

        // Center sub-zones
        this.addZone('center-top', 'center', {
            x: { min: centerX - halfCenter, max: centerX + halfCenter },
            y: { min: edgeMargin, max: centerY - halfCenter }
        }, 1.2);

        this.addZone('center-bottom', 'center', {
            x: { min: centerX - halfCenter, max: centerX + halfCenter },
            y: { min: centerY + halfCenter, max: viewport.height - edgeMargin }
        }, 1.2);

        this.addZone('center-left', 'center', {
            x: { min: edgeMargin, max: centerX - halfCenter },
            y: { min: centerY - halfCenter, max: centerY + halfCenter }
        }, 1.2);

        this.addZone('center-right', 'center', {
            x: { min: centerX + halfCenter, max: viewport.width - edgeMargin },
            y: { min: centerY - halfCenter, max: centerY + halfCenter }
        }, 1.2);

        // Edge zones (traditional positioning areas)
        this.addZone('edge-top', 'edge', {
            x: { min: edgeMargin, max: viewport.width - edgeMargin },
            y: { min: 0, max: edgeMargin }
        }, 0.8);

        this.addZone('edge-right', 'edge', {
            x: { min: viewport.width - edgeMargin, max: viewport.width },
            y: { min: edgeMargin, max: viewport.height - edgeMargin }
        }, 0.8);

        this.addZone('edge-bottom', 'edge', {
            x: { min: edgeMargin, max: viewport.width - edgeMargin },
            y: { min: viewport.height - edgeMargin, max: viewport.height }
        }, 0.8);

        this.addZone('edge-left', 'edge', {
            x: { min: 0, max: edgeMargin },
            y: { min: edgeMargin, max: viewport.height - edgeMargin }
        }, 0.8);

        // Transition zones (between edge and center)
        this.addZone('transition-top-left', 'transition', {
            x: { min: edgeMargin, max: centerX - halfCenter },
            y: { min: edgeMargin, max: centerY - halfCenter }
        }, 1.0);

        this.addZone('transition-top-right', 'transition', {
            x: { min: centerX + halfCenter, max: viewport.width - edgeMargin },
            y: { min: edgeMargin, max: centerY - halfCenter }
        }, 1.0);

        this.addZone('transition-bottom-left', 'transition', {
            x: { min: edgeMargin, max: centerX - halfCenter },
            y: { min: centerY + halfCenter, max: viewport.height - edgeMargin }
        }, 1.0);

        this.addZone('transition-bottom-right', 'transition', {
            x: { min: centerX + halfCenter, max: viewport.width - edgeMargin },
            y: { min: centerY + halfCenter, max: viewport.height - edgeMargin }
        }, 1.0);

        console.log(`[PositionZoneManager] Initialized ${this.zones.size} zones for ${viewport.width}x${viewport.height} viewport`);
        
        // Record zone initialization event
        consciousness.recordEvent('zones_initialized', {
            zoneCount: this.zones.size,
            viewport: viewport,
            centerUtilization: this.getCenterUtilization()
        });
    }

    /**
     * Adds a zone to the manager
     */
    addZone(id, type, bounds, weight = 1.0) {
        const zone = new PositionZone(id, type, bounds, weight);
        this.zones.set(id, zone);
        this.distributionState.zoneDensity.set(id, 0);
        return zone;
    }

    /**
     * Gets viewport dimensions accounting for different screen sizes and orientations
     */
    getViewportDimensions() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspectRatio = width / height;
        const orientation = width > height ? 'landscape' : 'portrait';
        
        return {
            width,
            height,
            aspectRatio,
            orientation,
            isSmall: Math.min(width, height) < 600,
            isLarge: Math.min(width, height) >= 1200,
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }
    
    /**
     * Determines if viewport has changed significantly enough to require zone recalculation
     */
    hasViewportChangedSignificantly(newViewport) {
        // Always recalculate on first run
        if (this.lastViewport.width === 0) return true;
        
        // Check for orientation change
        const orientationChanged = this.lastViewport.orientation !== newViewport.orientation;
        
        // Check for significant size change (more than 10% in either dimension)
        const widthChangePct = Math.abs(newViewport.width - this.lastViewport.width) / this.lastViewport.width;
        const heightChangePct = Math.abs(newViewport.height - this.lastViewport.height) / this.lastViewport.height;
        const sizeChanged = widthChangePct > 0.1 || heightChangePct > 0.1;
        
        // Check for significant aspect ratio change
        const aspectRatioChange = Math.abs(newViewport.aspectRatio - this.lastViewport.aspectRatio);
        const aspectRatioChanged = aspectRatioChange > this.config.aspectRatioThreshold;
        
        return orientationChanged || sizeChanged || aspectRatioChanged;
    }

    /**
     * Selects an optimal zone for fragment placement using distribution algorithms
     */
    selectZone(distributionStrategy = 'balanced') {
        const availableZones = Array.from(this.zones.values());
        
        switch (distributionStrategy) {
            case 'center-weighted':
                return this.selectCenterWeightedZone(availableZones);
            case 'edge-only':
                return this.selectEdgeZone(availableZones);
            case 'organic':
                return this.selectOrganicZone(availableZones);
            default:
                return this.selectBalancedZone(availableZones);
        }
    }

    /**
     * Selects zone using balanced distribution algorithm
     */
    selectBalancedZone(zones) {
        // Calculate selection weights based on current distribution
        const weightedZones = zones.map(zone => {
            let adjustedWeight = zone.weight;
            
            // Reduce weight for high-density zones
            const density = zone.getDensity();
            const avgDensity = this.getAverageDensity();
            if (density > avgDensity * this.config.maxDensityRatio) {
                adjustedWeight *= 0.3;
            }
            
            // Boost weight for underutilized zones
            const timeSinceLastUse = Date.now() - zone.lastUsed;
            if (timeSinceLastUse > 5000) { // 5 seconds
                adjustedWeight *= 1.5;
            }
            
            // Boost center zones if underutilized
            if (zone.type === 'center' && this.getCenterUtilization() < 0.3) {
                adjustedWeight *= 2.0;
            }
            
            return { zone, weight: adjustedWeight };
        });

        // Weighted random selection
        const totalWeight = weightedZones.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of weightedZones) {
            random -= item.weight;
            if (random <= 0) {
                return item.zone;
            }
        }
        
        // Fallback to first zone
        return zones[0];
    }

    /**
     * Selects zone with center bias
     */
    selectCenterWeightedZone(zones) {
        const centerZones = zones.filter(zone => zone.type === 'center');
        const otherZones = zones.filter(zone => zone.type !== 'center');
        
        // 70% chance for center zones, 30% for others
        if (Math.random() < 0.7 && centerZones.length > 0) {
            return this.selectBalancedZone(centerZones);
        } else {
            return this.selectBalancedZone(otherZones.length > 0 ? otherZones : zones);
        }
    }

    /**
     * Selects only edge zones (fallback for low performance)
     */
    selectEdgeZone(zones) {
        const edgeZones = zones.filter(zone => zone.type === 'edge');
        return edgeZones.length > 0 ? 
            this.selectBalancedZone(edgeZones) : 
            this.selectBalancedZone(zones);
    }

    /**
     * Selects zone using organic flow patterns
     */
    selectOrganicZone(zones) {
        // Consider recent placement patterns for organic flow
        const recentZones = this.distributionHistory.slice(-5);
        const recentTypes = recentZones.map(entry => entry.zone.type);
        
        // If recent placements were all edges, bias toward center
        if (recentTypes.every(type => type === 'edge')) {
            return this.selectCenterWeightedZone(zones);
        }
        
        // If recent placements were all center, bias toward transitions
        if (recentTypes.every(type => type === 'center')) {
            const transitionZones = zones.filter(zone => zone.type === 'transition');
            return transitionZones.length > 0 ? 
                this.selectBalancedZone(transitionZones) : 
                this.selectBalancedZone(zones);
        }
        
        // Default to balanced selection
        return this.selectBalancedZone(zones);
    }

    /**
     * Records zone usage and updates distribution tracking
     */
    recordZoneUsage(zone) {
        zone.recordUsage();
        
        // Update distribution history
        this.distributionHistory.push({
            zone: zone,
            timestamp: Date.now(),
            type: zone.type
        });
        
        // Maintain history size
        if (this.distributionHistory.length > this.maxHistorySize) {
            this.distributionHistory.shift();
        }
        
        // Update distribution state
        this.updateDistributionState();
        
        // Check if rebalancing is needed
        if (this.distributionState.balanceScore < this.config.rebalanceThreshold) {
            this.triggerRebalancing();
        }
    }

    /**
     * Records when a fragment is removed from a zone
     */
    recordZoneRelease(zoneId) {
        const zone = this.zones.get(zoneId);
        if (zone) {
            zone.releaseFragment();
            this.updateDistributionState();
        }
    }

    /**
     * Updates distribution state metrics
     */
    updateDistributionState() {
        // Update zone density map
        for (const [id, zone] of this.zones) {
            this.distributionState.zoneDensity.set(id, zone.getDensity());
        }
        
        // Calculate center utilization
        this.distributionState.centerUtilization = this.getCenterUtilization();
        
        // Calculate balance score
        this.distributionState.balanceScore = this.calculateBalanceScore();
        
        // Update recent placements
        this.distributionState.recentPlacements = this.distributionHistory
            .slice(-10)
            .map(entry => ({
                zone: entry.zone.id,
                timestamp: entry.timestamp
            }));
    }

    /**
     * Calculates center zone utilization percentage
     */
    getCenterUtilization() {
        const centerZones = Array.from(this.zones.values()).filter(zone => zone.type === 'center');
        const totalCenterFragments = centerZones.reduce((sum, zone) => sum + zone.activeFragments, 0);
        const totalFragments = Array.from(this.zones.values()).reduce((sum, zone) => sum + zone.activeFragments, 0);
        
        return totalFragments > 0 ? totalCenterFragments / totalFragments : 0;
    }

    /**
     * Calculates average density across all zones
     */
    getAverageDensity() {
        const zones = Array.from(this.zones.values());
        const totalDensity = zones.reduce((sum, zone) => sum + zone.getDensity(), 0);
        return zones.length > 0 ? totalDensity / zones.length : 0;
    }

    /**
     * Calculates distribution balance score (0-1, where 1 is perfectly balanced)
     */
    calculateBalanceScore() {
        const zones = Array.from(this.zones.values());
        if (zones.length === 0) return 1.0;
        
        const densities = zones.map(zone => zone.getDensity());
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
        console.log('[PositionZoneManager] Triggering distribution rebalancing');
        
        // Temporarily boost weights for underutilized zones
        const avgDensity = this.getAverageDensity();
        
        for (const zone of this.zones.values()) {
            if (zone.getDensity() < avgDensity * 0.5) {
                // Boost underutilized zones
                zone.weight *= 1.5;
            } else if (zone.getDensity() > avgDensity * 2) {
                // Reduce overutilized zones
                zone.weight *= 0.7;
            }
        }
        
        // Record rebalancing event
        consciousness.recordEvent('zone_rebalancing_triggered', {
            balanceScore: this.distributionState.balanceScore,
            centerUtilization: this.distributionState.centerUtilization,
            avgDensity: avgDensity
        });
        
        // Reset weights after a delay
        setTimeout(() => {
            this.resetZoneWeights();
        }, 10000); // 10 seconds
    }

    /**
     * Resets zone weights to their original values
     */
    resetZoneWeights() {
        // Reset to original weights based on zone type
        for (const zone of this.zones.values()) {
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
            }
        }
    }

    /**
     * Gets zone by ID
     */
    getZone(id) {
        return this.zones.get(id);
    }

    /**
     * Gets all zones of a specific type
     */
    getZonesByType(type) {
        return Array.from(this.zones.values()).filter(zone => zone.type === type);
    }

    /**
     * Gets current distribution statistics
     */
    getDistributionStats() {
        return {
            ...this.distributionState,
            totalZones: this.zones.size,
            zoneTypes: {
                edge: this.getZonesByType('edge').length,
                center: this.getZonesByType('center').length,
                transition: this.getZonesByType('transition').length
            },
            averageDensity: this.getAverageDensity()
        };
    }

    /**
     * Sets up window resize handler for responsive zone recalculation
     */
    setupResizeHandler() {
        let resizeTimeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            
            const newViewport = this.getViewportDimensions();
            const isOrientationChange = this.lastViewport.orientation !== newViewport.orientation;
            
            // Use longer delay for orientation changes to allow browser UI adjustments
            const delay = isOrientationChange ? 
                this.config.resizeDebounceTime + this.config.orientationChangeDelay : 
                this.config.resizeDebounceTime;
            
            resizeTimeout = setTimeout(() => {
                // Only recalculate if viewport changed significantly
                if (this.hasViewportChangedSignificantly(newViewport)) {
                    console.log(`[PositionZoneManager] Significant viewport change detected: ${this.lastViewport.width}x${this.lastViewport.height} (${this.lastViewport.orientation}) -> ${newViewport.width}x${newViewport.height} (${newViewport.orientation})`);
                    
                    // Store current fragment positions for smooth transition
                    const fragmentPositions = this.captureCurrentFragmentPositions();
                    
                    // Recalculate zones
                    this.recalculateZonesForViewport(newViewport);
                    
                    // Redistribute fragments if needed
                    if (fragmentPositions.length > 0) {
                        this.redistributeFragments(fragmentPositions);
                    }
                    
                    // Update viewport tracking
                    this.lastViewport = { ...newViewport };
                    
                    consciousness.recordEvent('zones_recalculated', {
                        reason: isOrientationChange ? 'orientation_change' : 'viewport_resize',
                        newDimensions: newViewport,
                        fragmentsRedistributed: fragmentPositions.length
                    });
                }
            }, delay);
        };
        
        // Initial viewport capture
        this.lastViewport = this.getViewportDimensions();
        
        // Set up event listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        
        // Handle visibility changes (tab switching, etc.)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // Check for viewport changes when tab becomes visible again
                handleResize();
            }
        });
        
        this.guardian.register(() => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            document.removeEventListener('visibilitychange', handleResize);
            clearTimeout(resizeTimeout);
        });
    }
    
    /**
     * Recalculates zones based on new viewport dimensions
     */
    recalculateZonesForViewport(viewport) {
        console.log(`[PositionZoneManager] Recalculating zones for ${viewport.width}x${viewport.height} viewport (${viewport.orientation})`);
        
        // Store active fragments count by zone type for redistribution
        const fragmentsByType = {
            edge: 0,
            center: 0,
            transition: 0
        };
        
        // Count fragments by zone type
        for (const zone of this.zones.values()) {
            fragmentsByType[zone.type] += zone.activeFragments;
        }
        
        // Clear existing zones
        this.zones.clear();
        
        // Adjust configuration based on viewport characteristics
        this.adjustConfigForViewport(viewport);
        
        // Initialize new zones
        this.initializeZones();
        
        console.log(`[PositionZoneManager] Zone recalculation complete. Active fragments: ${Object.values(fragmentsByType).reduce((a, b) => a + b, 0)}`);
    }
    
    /**
     * Adjusts zone configuration based on viewport characteristics
     */
    adjustConfigForViewport(viewport) {
        // Adjust edge margin for different screen sizes
        if (viewport.isSmall) {
            // Smaller margins on small screens to maximize usable space
            this.config.edgeMargin = 0.03; // 3% margin
            this.config.centerZoneSize = 0.5; // 50% for center zone
        } else if (viewport.isLarge) {
            // Larger margins on big screens for better aesthetics
            this.config.edgeMargin = 0.06; // 6% margin
            this.config.centerZoneSize = 0.35; // 35% for center zone
        } else {
            // Default values for medium screens
            this.config.edgeMargin = 0.05; // 5% margin
            this.config.centerZoneSize = 0.4; // 40% for center zone
        }
        
        // Adjust for extreme aspect ratios
        const aspectRatio = viewport.aspectRatio;
        if (aspectRatio > 2.0) {
            // Very wide screen - adjust horizontal distribution
            this.config.centerZoneSize = Math.min(this.config.centerZoneSize, 0.3);
            this.config.transitionZoneWidth = 0.2;
        } else if (aspectRatio < 0.5) {
            // Very tall screen - adjust vertical distribution
            this.config.centerZoneSize = Math.min(this.config.centerZoneSize, 0.3);
            this.config.transitionZoneWidth = 0.2;
        }
        
        // Ensure minimum zone size in pixels
        const minDimension = Math.min(viewport.width, viewport.height);
        const minZonePercentage = this.config.minZoneSize / minDimension;
        
        this.config.edgeMargin = Math.max(this.config.edgeMargin, minZonePercentage);
        this.config.centerZoneSize = Math.max(this.config.centerZoneSize, minZonePercentage * 4);
        this.config.transitionZoneWidth = Math.max(this.config.transitionZoneWidth, minZonePercentage * 2);
        
        // Orientation-specific adjustments
        if (viewport.orientation === 'portrait') {
            // In portrait mode, make center zone slightly taller
            this.config.centerZoneSize *= 1.1;
        }
    }
    
    /**
     * Captures current fragment positions for smooth transition during viewport changes
     * Returns array of {id, element, zoneId, position} objects
     */
    captureCurrentFragmentPositions() {
        // This is a placeholder - in a real implementation, this would interact with the DOM
        // to find all active fragments and their current positions
        const positions = [];
        
        // In a real implementation, we would do something like:
        // document.querySelectorAll('.fragment').forEach(element => {
        //     const id = element.dataset.fragmentId;
        //     const zoneId = element.dataset.zoneId;
        //     const rect = element.getBoundingClientRect();
        //     positions.push({
        //         id,
        //         element,
        //         zoneId,
        //         position: { x: rect.left, y: rect.top }
        //     });
        // });
        
        return positions;
    }
    
    /**
     * Redistributes fragments after zone recalculation
     */
    redistributeFragments(fragmentPositions) {
        // This is a placeholder - in a real implementation, this would update fragment positions
        // based on the new zone layout
        console.log(`[PositionZoneManager] Redistributing ${fragmentPositions.length} fragments after zone recalculation`);
        
        // In a real implementation, we would:
        // 1. Find appropriate new zones for each fragment
        // 2. Update their positions with animations
        // 3. Update zone tracking data
        
        // For now, we'll just log that this would happen
        consciousness.recordEvent('fragments_redistributed', {
            count: fragmentPositions.length
        });
    }

    /**
     * Destroys the zone manager and cleans up resources
     */
    destroy() {
        console.log('[PositionZoneManager] Destroying zone manager');
        
        this.guardian.cleanupAll();
        this.zones.clear();
        this.distributionHistory = [];
        
        consciousness.recordEvent('zone_manager_destroyed', {
            finalStats: this.getDistributionStats()
        });
    }
}