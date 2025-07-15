/**
 * Handles fragment drift calculations with center traversal support
 */
export class FragmentDrift {
    constructor(zoneManager) {
        this.zoneManager = zoneManager;
    }

    /**
     * Calculates drift path for a fragment based on its zone
     */
    calculateDrift(zone) {
        const baseDistance = 80;
        const distance = baseDistance + Math.random() * 50;
        
        const zoneCenter = zone.getCenter();
        const viewportCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
        
        const centerBias = this.calculateCenterBias();
        
        switch (zone.type) {
            case 'edge':
                return this.calculateEdgeDrift(zone, distance, centerBias);
            case 'center':
                return this.calculateCenterDrift(zone, distance, viewportCenter);
            case 'transition':
                return this.calculateTransitionDrift(zone, distance, viewportCenter, centerBias);
            default:
                return this.createSimpleDrift(zoneCenter, viewportCenter, distance);
        }
    }

    /**
     * Calculates center bias based on current fragment distribution
     */
    calculateCenterBias() {
        if (!this.zoneManager) return 0.5;
        
        const centerUtilization = this.zoneManager.getCenterUtilization();
        let bias = 0.5;
        
        if (centerUtilization < 0.3) {
            bias = 0.8; // Strong center bias
        } else if (centerUtilization < 0.5) {
            bias = 0.6; // Moderate center bias
        } else if (centerUtilization > 0.7) {
            bias = 0.2; // Reduce center bias when overcrowded
        }
        
        return Math.max(0.1, Math.min(0.9, bias));
    }

    /**
     * Calculates drift for edge zones
     */
    calculateEdgeDrift(zone, distance, centerBias) {
        const spread = (Math.random() - 0.5) * 40;
        const zoneCenter = zone.getCenter();
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        
        let baseDrift = { x: 0, y: 0 };
        
        // Determine edge type and drift direction
        if (zoneCenter.y < viewport.height * 0.1) {
            baseDrift = { x: spread, y: distance }; // Top edge
        } else if (zoneCenter.x > viewport.width * 0.9) {
            baseDrift = { x: -distance, y: spread }; // Right edge
        } else if (zoneCenter.y > viewport.height * 0.9) {
            baseDrift = { x: spread, y: -distance }; // Bottom edge
        } else {
            baseDrift = { x: distance, y: spread }; // Left edge
        }
        
        // Apply center traversal if high center bias
        if (centerBias > 0.6) {
            const centerPath = this.generateCenterTraversalPath(zoneCenter, distance);
            return {
                x: baseDrift.x * (1 - centerBias) + centerPath.x * centerBias,
                y: baseDrift.y * (1 - centerBias) + centerPath.y * centerBias,
                waypoints: centerPath.waypoints
            };
        }
        
        return baseDrift;
    }

    /**
     * Calculates drift for center zones with varied patterns
     */
    calculateCenterDrift(zone, distance, viewportCenter) {
        const patterns = ['radial', 'orbital', 'linear'];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        switch (pattern) {
            case 'radial':
                return this.generateRadialPath(distance);
            case 'orbital':
                return this.generateOrbitalPath(distance, viewportCenter);
            case 'linear':
            default:
                return this.generateLinearPath(distance);
        }
    }

    /**
     * Calculates drift for transition zones
     */
    calculateTransitionDrift(zone, distance, viewportCenter, centerBias) {
        const zoneCenter = zone.getCenter();
        
        // Generate center traversal path if high center bias
        if (centerBias > 0.6 && Math.random() < 0.7) {
            return this.generateCenterTraversalPath(zoneCenter, distance);
        }
        
        // Standard transition drift with center bias
        const toCenterX = (viewportCenter.x - zoneCenter.x) * 0.6;
        const toCenterY = (viewportCenter.y - zoneCenter.y) * 0.6;
        
        const randomX = (Math.random() - 0.5) * distance * 0.4;
        const randomY = (Math.random() - 0.5) * distance * 0.4;
        
        return {
            x: toCenterX + randomX,
            y: toCenterY + randomY
        };
    }

    /**
     * Generates center traversal path with waypoints
     */
    generateCenterTraversalPath(startPoint, distance) {
        const viewportCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
        
        const waypoints = [];
        const numWaypoints = 2 + Math.floor(Math.random() * 2); // 2-3 waypoints
        
        const pathRadius = distance * 0.3;
        const angleStep = (Math.PI * 2) / numWaypoints;
        const startAngle = Math.random() * Math.PI * 2;
        
        for (let i = 0; i < numWaypoints; i++) {
            const angle = startAngle + (angleStep * i);
            const waypointDistance = pathRadius * (0.5 + Math.random() * 0.5);
            
            waypoints.push({
                x: viewportCenter.x + Math.cos(angle) * waypointDistance,
                y: viewportCenter.y + Math.sin(angle) * waypointDistance
            });
        }
        
        const finalAngle = Math.random() * Math.PI * 2;
        const finalDistance = distance * (0.6 + Math.random() * 0.4);
        
        return {
            x: viewportCenter.x + Math.cos(finalAngle) * finalDistance,
            y: viewportCenter.y + Math.sin(finalAngle) * finalDistance,
            waypoints: waypoints
        };
    }

    /**
     * Generates radial movement path
     */
    generateRadialPath(distance) {
        const angle = Math.random() * Math.PI * 2;
        const radialDistance = distance * 0.6;
        
        return {
            x: Math.cos(angle) * radialDistance,
            y: Math.sin(angle) * radialDistance
        };
    }

    /**
     * Generates orbital movement path
     */
    generateOrbitalPath(distance, viewportCenter) {
        const orbitalRadius = distance * 0.4;
        const startAngle = Math.random() * Math.PI * 2;
        const angleSpan = Math.PI * 0.5 + Math.random() * Math.PI;
        
        const waypoints = [];
        for (let i = 1; i <= 2; i++) {
            const angle = startAngle + (angleSpan * i / 2);
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
     * Generates linear movement path
     */
    generateLinearPath(distance) {
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
    createSimpleDrift(zoneCenter, viewportCenter, distance) {
        const toCenterX = (viewportCenter.x - zoneCenter.x) * 0.3;
        const toCenterY = (viewportCenter.y - zoneCenter.y) * 0.3;
        
        return {
            x: toCenterX + (Math.random() - 0.5) * distance * 0.4,
            y: toCenterY + (Math.random() - 0.5) * distance * 0.4
        };
    }
}