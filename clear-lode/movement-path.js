import { consciousness } from '../src/consciousness/digital-soul.js';

/**
 * Represents a movement path with waypoints and timing information
 */
export class MovementPath {
    constructor(options = {}) {
        this.id = options.id || this.generateId();
        this.startZone = options.startZone || null;
        this.endZone = options.endZone || null;
        this.waypoints = options.waypoints || [];
        this.duration = options.duration || 15; // seconds
        this.easing = options.easing || 'none';
        this.centerTraversal = options.centerTraversal || false;
        this.pathType = options.pathType || 'linear';
        this.curveType = options.curveType || null;
        this.metadata = options.metadata || {};
        this.createdAt = Date.now();
    }

    /**
     * Generates a unique ID for the path
     */
    generateId() {
        return `path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Adds a waypoint to the path
     */
    addWaypoint(x, y, timing = null) {
        const waypoint = {
            x: x,
            y: y,
            timing: timing || this.waypoints.length / (this.waypoints.length + 1),
            index: this.waypoints.length
        };
        
        this.waypoints.push(waypoint);
        return waypoint;
    }

    /**
     * Removes a waypoint by index
     */
    removeWaypoint(index) {
        if (index >= 0 && index < this.waypoints.length) {
            return this.waypoints.splice(index, 1)[0];
        }
        return null;
    }

    /**
     * Gets waypoint at specific index
     */
    getWaypoint(index) {
        return this.waypoints[index] || null;
    }

    /**
     * Gets all waypoints
     */
    getWaypoints() {
        return [...this.waypoints];
    }

    /**
     * Calculates total path length in pixels
     */
    getTotalLength() {
        if (this.waypoints.length === 0) return 0;
        
        let totalLength = 0;
        let previousPoint = { x: 0, y: 0 }; // Assume start at origin
        
        for (const waypoint of this.waypoints) {
            const dx = waypoint.x - previousPoint.x;
            const dy = waypoint.y - previousPoint.y;
            totalLength += Math.sqrt(dx * dx + dy * dy);
            previousPoint = waypoint;
        }
        
        return totalLength;
    }

    /**
     * Interpolates position at given time (0-1)
     */
    interpolatePosition(t) {
        if (this.waypoints.length === 0) {
            return { x: 0, y: 0 };
        }
        
        if (this.waypoints.length === 1) {
            return { x: this.waypoints[0].x, y: this.waypoints[0].y };
        }
        
        // Clamp t to valid range
        t = Math.max(0, Math.min(1, t));
        
        // Find the segment we're in
        const segmentIndex = Math.floor(t * (this.waypoints.length - 1));
        const nextIndex = Math.min(segmentIndex + 1, this.waypoints.length - 1);
        
        // Calculate local t within the segment
        const segmentT = (t * (this.waypoints.length - 1)) - segmentIndex;
        
        const current = this.waypoints[segmentIndex];
        const next = this.waypoints[nextIndex];
        
        // Linear interpolation between waypoints
        return {
            x: current.x + (next.x - current.x) * segmentT,
            y: current.y + (next.y - current.y) * segmentT
        };
    }

    /**
     * Applies smooth interpolation based on curve type
     */
    smoothInterpolatePosition(t) {
        if (this.curveType === 'bezier' && this.waypoints.length >= 2) {
            return this.bezierInterpolation(t);
        } else if (this.curveType === 'catmull-rom' && this.waypoints.length >= 4) {
            return this.catmullRomInterpolation(t);
        } else {
            return this.interpolatePosition(t);
        }
    }

    /**
     * Bezier curve interpolation for smooth paths
     */
    bezierInterpolation(t) {
        if (this.waypoints.length < 2) return this.interpolatePosition(t);
        
        // Simple quadratic Bezier for 2 points, cubic for 3+
        if (this.waypoints.length === 2) {
            const p0 = this.waypoints[0];
            const p1 = this.waypoints[1];
            
            return {
                x: p0.x + (p1.x - p0.x) * t,
                y: p0.y + (p1.y - p0.y) * t
            };
        } else if (this.waypoints.length === 3) {
            // Quadratic Bezier
            const p0 = this.waypoints[0];
            const p1 = this.waypoints[1];
            const p2 = this.waypoints[2];
            
            const oneMinusT = 1 - t;
            
            return {
                x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
                y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y
            };
        } else {
            // Cubic Bezier using first 4 points
            const p0 = this.waypoints[0];
            const p1 = this.waypoints[1];
            const p2 = this.waypoints[2];
            const p3 = this.waypoints[3];
            
            const oneMinusT = 1 - t;
            const oneMinusT2 = oneMinusT * oneMinusT;
            const oneMinusT3 = oneMinusT2 * oneMinusT;
            const t2 = t * t;
            const t3 = t2 * t;
            
            return {
                x: oneMinusT3 * p0.x + 3 * oneMinusT2 * t * p1.x + 3 * oneMinusT * t2 * p2.x + t3 * p3.x,
                y: oneMinusT3 * p0.y + 3 * oneMinusT2 * t * p1.y + 3 * oneMinusT * t2 * p2.y + t3 * p3.y
            };
        }
    }

    /**
     * Catmull-Rom spline interpolation for smooth curves through all points
     */
    catmullRomInterpolation(t) {
        if (this.waypoints.length < 4) return this.interpolatePosition(t);
        
        // Scale t to the number of segments
        const scaledT = t * (this.waypoints.length - 3);
        const segmentIndex = Math.floor(scaledT);
        const localT = scaledT - segmentIndex;
        
        // Get the 4 control points for this segment
        const p0 = this.waypoints[segmentIndex];
        const p1 = this.waypoints[segmentIndex + 1];
        const p2 = this.waypoints[segmentIndex + 2];
        const p3 = this.waypoints[segmentIndex + 3];
        
        // Catmull-Rom formula
        const t2 = localT * localT;
        const t3 = t2 * localT;
        
        return {
            x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * localT + 
                     (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + 
                     (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
            y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * localT + 
                     (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + 
                     (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
        };
    }

    /**
     * Validates the path for correctness
     */
    validate() {
        const errors = [];
        
        if (this.waypoints.length === 0) {
            errors.push('Path must have at least one waypoint');
        }
        
        if (this.duration <= 0) {
            errors.push('Duration must be positive');
        }
        
        // Check waypoint validity
        for (let i = 0; i < this.waypoints.length; i++) {
            const waypoint = this.waypoints[i];
            if (typeof waypoint.x !== 'number' || typeof waypoint.y !== 'number') {
                errors.push(`Waypoint ${i} has invalid coordinates`);
            }
            if (isNaN(waypoint.x) || isNaN(waypoint.y)) {
                errors.push(`Waypoint ${i} has NaN coordinates`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Clones the path with optional modifications
     */
    clone(modifications = {}) {
        const cloned = new MovementPath({
            startZone: this.startZone,
            endZone: this.endZone,
            waypoints: this.waypoints.map(wp => ({ ...wp })),
            duration: this.duration,
            easing: this.easing,
            centerTraversal: this.centerTraversal,
            pathType: this.pathType,
            curveType: this.curveType,
            metadata: { ...this.metadata },
            ...modifications
        });
        
        return cloned;
    }

    /**
     * Converts path to serializable object
     */
    toJSON() {
        return {
            id: this.id,
            startZone: this.startZone ? this.startZone.id : null,
            endZone: this.endZone ? this.endZone.id : null,
            waypoints: this.waypoints,
            duration: this.duration,
            easing: this.easing,
            centerTraversal: this.centerTraversal,
            pathType: this.pathType,
            curveType: this.curveType,
            metadata: this.metadata,
            createdAt: this.createdAt,
            totalLength: this.getTotalLength()
        };
    }

    /**
     * Creates path from JSON data
     */
    static fromJSON(data, zoneManager = null) {
        const path = new MovementPath({
            id: data.id,
            waypoints: data.waypoints || [],
            duration: data.duration || 15,
            easing: data.easing || 'none',
            centerTraversal: data.centerTraversal || false,
            pathType: data.pathType || 'linear',
            curveType: data.curveType || null,
            metadata: data.metadata || {}
        });
        
        // Restore zone references if zone manager is provided
        if (zoneManager) {
            if (data.startZone) {
                path.startZone = zoneManager.getZone(data.startZone);
            }
            if (data.endZone) {
                path.endZone = zoneManager.getZone(data.endZone);
            }
        }
        
        return path;
    }

    /**
     * Records path usage for analytics
     */
    recordUsage(fragment = null) {
        consciousness.recordEvent('movement_path_used', {
            pathId: this.id,
            pathType: this.pathType,
            curveType: this.curveType,
            waypointCount: this.waypoints.length,
            duration: this.duration,
            centerTraversal: this.centerTraversal,
            totalLength: this.getTotalLength(),
            fragmentId: fragment ? fragment.dataset.birthTime : null
        });
    }
}