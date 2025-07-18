/**
 * Handles fragment drift calculations and waypoint generation
 */
export class FragmentDriftCalculator {
    constructor(zoneManager) {
        this.zoneManager = zoneManager;
        // Use optimization manager if available
        this.optimizationManager = zoneManager.optimizationManager;
    }

    /**
     * Calculates drift for a fragment based on zone and center bias
     */
    calculateDrift(zone, centerBias = null) {
        // Zone-based drift calculation with center traversal support
        const baseDistance = 80;
        const distance = baseDistance + Math.random() * 50;
        
        // Get zone center and viewport center for drift calculations
        const zoneCenter = zone.getCenter();
        const viewportCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
        
        // Calculate center bias based on current fragment distribution
        const calculatedCenterBias = centerBias || this.calculateCenterBias();
        
        // Calculate drift direction based on zone type and position
        switch (zone.type) {
            case 'edge':
                return this.calculateEdgeDriftWithTraversal(zone, distance, calculatedCenterBias);
            case 'center':
                return this.calculateCenterDriftWithPaths(zone, distance, viewportCenter, calculatedCenterBias);
            case 'transition':
                return this.calculateTransitionDriftWithTraversal(zone, distance, viewportCenter, calculatedCenterBias);
            default:
                // Fallback to simple drift toward center
                return this.createSimpleDriftPath(zone, viewportCenter, distance);
        }
    }

    /**
     * Calculates center bias based on current fragment distribution
     */
    calculateCenterBias() {
        if (!this.zoneManager) return 0.5;
        
        const centerUtilization = this.zoneManager.getCenterUtilization();
        const balanceScore = this.zoneManager.distributionState.balanceScore;
        
        // Increase center bias when center is underutilized
        let bias = 0.5;
        
        if (centerUtilization < 0.3) {
            bias = 0.8; // Strong center bias
        } else if (centerUtilization < 0.5) {
            bias = 0.6; // Moderate center bias
        } else if (centerUtilization > 0.7) {
            bias = 0.2; // Reduce center bias when overcrowded
        }
        
        // Adjust based on balance score
        bias *= balanceScore;
        
        return Math.max(0.1, Math.min(0.9, bias));
    }

    /**
     * Calculates drift for edge zones with center traversal support
     */
    calculateEdgeDriftWithTraversal(zone, distance, centerBias) {
        const spread = (Math.random() - 0.5) * 40;
        const zoneCenter = zone.getCenter();
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const viewportCenter = { x: viewport.width / 2, y: viewport.height / 2 };
        
        // Base drift calculation (traditional behavior)
        let baseDrift = { x: 0, y: 0 };
        
        // Determine edge type based on zone position
        if (zoneCenter.y < viewport.height * 0.1) {
            // Top edge - drift toward center and down
            baseDrift = { x: spread, y: distance };
        } else if (zoneCenter.x > viewport.width * 0.9) {
            // Right edge - drift toward center and left
            baseDrift = { x: -distance, y: spread };
        } else if (zoneCenter.y > viewport.height * 0.9) {
            // Bottom edge - drift toward center and up
            baseDrift = { x: spread, y: -distance };
        } else {
            // Left edge - drift toward center and right
            baseDrift = { x: distance, y: spread };
        }
        
        // Apply center traversal bias
        if (centerBias > 0.5) {
            const centerAttraction = this.generateCenterTraversalPath(zoneCenter, viewportCenter, distance);
            return {
                x: baseDrift.x * (1 - centerBias) + centerAttraction.x * centerBias,
                y: baseDrift.y * (1 - centerBias) + centerAttraction.y * centerBias,
                waypoints: centerAttraction.waypoints
            };
        }
        
        return baseDrift;
    }

    /**
     * Calculates drift for center zones with varied movement patterns and waypoints
     */
    calculateCenterDriftWithPaths(zone, distance, viewportCenter, centerBias) {
        const patterns = ['radial', 'orbital', 'linear', 'curved'];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        switch (pattern) {
            case 'radial':
                return this.generateRadialPath(zone, distance, viewportCenter);
            case 'orbital':
                return this.generateOrbitalPath(zone, distance, viewportCenter);
            case 'curved':
                return this.generateCurvedPath(zone, distance, viewportCenter, centerBias);
            case 'linear':
            default:
                return this.generateLinearPath(zone, distance, viewportCenter);
        }
    }

    /**
     * Calculates drift for transition zones with center-biased movement and waypoints
     */
    calculateTransitionDriftWithTraversal(zone, distance, viewportCenter, centerBias) {
        const zoneCenter = zone.getCenter();
        
        // Generate path that traverses through center area
        if (centerBias > 0.6 && Math.random() < 0.7) {
            return this.generateCenterTraversalPath(zoneCenter, viewportCenter, distance);
        }
        
        // Standard transition drift with center bias
        const centerBiasStrength = 0.6;
        const randomFactor = 0.4;
        
        const toCenterX = (viewportCenter.x - zoneCenter.x) * centerBiasStrength;
        const toCenterY = (viewportCenter.y - zoneCenter.y) * centerBiasStrength;
        
        const randomX = (Math.random() - 0.5) * distance * randomFactor;
        const randomY = (Math.random() - 0.5) * distance * randomFactor;
        
        return {
            x: toCenterX + randomX,
            y: toCenterY + randomY
        };
    }

    /**
     * Generates center traversal path with waypoints for curved movement
     */
    generateCenterTraversalPath(startPoint, centerPoint, distance) {
        // Use optimization manager if available for object pooling
        if (this.optimizationManager) {
            const numWaypoints = 2 + Math.floor(Math.random() * 3); // 2-4 waypoints
            const options = {
                waypointCount: numWaypoints,
                center: centerPoint,
                radius: distance * 0.3
            };
            
            // Generate waypoints using object pool
            const waypoints = this.optimizationManager.generatePathWaypoints(
                'orbital', 
                startPoint, 
                {
                    x: centerPoint.x + Math.cos(Math.random() * Math.PI * 2) * distance * 0.6,
                    y: centerPoint.y + Math.sin(Math.random() * Math.PI * 2) * distance * 0.6
                },
                options
            );
            
            // Final destination
            const finalAngle = Math.random() * Math.PI * 2;
            const finalDistance = distance * (0.6 + Math.random() * 0.4);
            
            return {
                x: centerPoint.x + Math.cos(finalAngle) * finalDistance,
                y: centerPoint.y + Math.sin(finalAngle) * finalDistance,
                waypoints: waypoints
            };
        }
        
        // Fallback to original implementation if optimization manager not available
        const waypoints = [];
        const numWaypoints = 2 + Math.floor(Math.random() * 3); // 2-4 waypoints
        
        // Calculate path that goes through or near center
        const pathRadius = distance * 0.3;
        const angleStep = (Math.PI * 2) / numWaypoints;
        const startAngle = Math.random() * Math.PI * 2;
        
        for (let i = 0; i < numWaypoints; i++) {
            const angle = startAngle + (angleStep * i);
            const waypointDistance = pathRadius * (0.5 + Math.random() * 0.5);
            
            waypoints.push({
                x: centerPoint.x + Math.cos(angle) * waypointDistance,
                y: centerPoint.y + Math.sin(angle) * waypointDistance
            });
        }
        
        // Final destination
        const finalAngle = Math.random() * Math.PI * 2;
        const finalDistance = distance * (0.6 + Math.random() * 0.4);
        
        return {
            x: centerPoint.x + Math.cos(finalAngle) * finalDistance,
            y: centerPoint.y + Math.sin(finalAngle) * finalDistance,
            waypoints: waypoints
        };
    }

    /**
     * Generates radial movement path from center outward
     */
    generateRadialPath(zone, distance, viewportCenter) {
        const zoneCenter = zone.getCenter();
        const angle = Math.random() * Math.PI * 2;
        const radialDistance = distance * 0.6;
        
        return {
            x: Math.cos(angle) * radialDistance,
            y: Math.sin(angle) * radialDistance,
            waypoints: [{
                x: zoneCenter.x + Math.cos(angle) * radialDistance * 0.5,
                y: zoneCenter.y + Math.sin(angle) * radialDistance * 0.5
            }]
        };
    }

    /**
     * Generates orbital movement path around center
     */
    generateOrbitalPath(zone, distance, viewportCenter) {
        const zoneCenter = zone.getCenter();
        const orbitalRadius = distance * 0.4;
        const startAngle = Math.random() * Math.PI * 2;
        const angleSpan = Math.PI * 0.5 + Math.random() * Math.PI; // 90-270 degrees
        
        const waypoints = [];
        const numSegments = 3;
        
        for (let i = 1; i <= numSegments; i++) {
            const angle = startAngle + (angleSpan * i / numSegments);
            waypoints.push({
                x: viewportCenter.x + Math.cos(angle) * orbitalRadius,
                y: viewportCenter.y + Math.sin(angle) * orbitalRadius
            });
        }
        
        const finalAngle = startAngle + angleSpan;
        return {
            x: Math.cos(finalAngle) * orbitalRadius,
            y: Math.sin(finalAngle) * orbitalRadius,
            waypoints: waypoints
        };
    }

    /**
     * Generates curved diagonal movement path
     */
    generateCurvedPath(zone, distance, viewportCenter, centerBias) {
        const zoneCenter = zone.getCenter();
        
        // Create curved path with control points
        const controlPoint1 = {
            x: zoneCenter.x + (Math.random() - 0.5) * distance * 0.8,
            y: zoneCenter.y + (Math.random() - 0.5) * distance * 0.8
        };
        
        const controlPoint2 = {
            x: viewportCenter.x + (Math.random() - 0.5) * distance * 0.6,
            y: viewportCenter.y + (Math.random() - 0.5) * distance * 0.6
        };
        
        const finalPoint = {
            x: zoneCenter.x + (Math.random() - 0.5) * distance,
            y: zoneCenter.y + (Math.random() - 0.5) * distance
        };
        
        return {
            x: finalPoint.x - zoneCenter.x,
            y: finalPoint.y - zoneCenter.y,
            waypoints: [controlPoint1, controlPoint2],
            curveType: 'bezier'
        };
    }

    /**
     * Generates linear movement path with optional center bias
     */
    generateLinearPath(zone, distance, viewportCenter) {
        const angle = Math.random() * Math.PI * 2;
        const linearDistance = distance * 0.5;
        
        return {
            x: Math.cos(angle) * linearDistance,
            y: Math.sin(angle) * linearDistance
        };
    }

    /**
     * Creates simple drift path as fallback
     */
    createSimpleDriftPath(zone, viewportCenter, distance) {
        const zoneCenter = zone.getCenter();
        const toCenterX = (viewportCenter.x - zoneCenter.x) * 0.3;
        const toCenterY = (viewportCenter.y - zoneCenter.y) * 0.3;
        
        return {
            x: toCenterX + (Math.random() - 0.5) * distance * 0.4,
            y: toCenterY + (Math.random() - 0.5) * distance * 0.4
        };
    }
}