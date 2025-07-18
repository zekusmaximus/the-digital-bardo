import { consciousness } from '../src/consciousness/digital-soul.js';

/**
 * Path interpolation utilities for smooth transitions between waypoints
 */
export class PathInterpolation {
    /**
     * Linear interpolation between two points
     */
    static linear(p1, p2, t) {
        return {
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
        };
    }

    /**
     * Quadratic Bezier interpolation with one control point
     */
    static quadraticBezier(p0, p1, p2, t) {
        const oneMinusT = 1 - t;
        
        return {
            x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
            y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y
        };
    }

    /**
     * Cubic Bezier interpolation with two control points
     */
    static cubicBezier(p0, p1, p2, p3, t) {
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

    /**
     * Catmull-Rom spline interpolation for smooth curves through all points
     */
    static catmullRom(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        
        return {
            x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + 
                     (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + 
                     (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
            y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + 
                     (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + 
                     (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
        };
    }

    /**
     * Hermite spline interpolation with tangent control
     */
    static hermite(p0, p1, t0, t1, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        
        const h00 = 2 * t3 - 3 * t2 + 1;
        const h10 = t3 - 2 * t2 + t;
        const h01 = -2 * t3 + 3 * t2;
        const h11 = t3 - t2;
        
        return {
            x: h00 * p0.x + h10 * t0.x + h01 * p1.x + h11 * t1.x,
            y: h00 * p0.y + h10 * t0.y + h01 * p1.y + h11 * t1.y
        };
    }

    /**
     * B-spline interpolation for smooth curves
     */
    static bSpline(points, t, degree = 3) {
        if (points.length < degree + 1) {
            return this.linear(points[0] || {x: 0, y: 0}, points[1] || {x: 0, y: 0}, t);
        }

        const n = points.length - 1;
        const knots = this.generateKnotVector(n, degree);
        
        return this.deBoor(points, knots, degree, t);
    }

    /**
     * De Boor's algorithm for B-spline evaluation
     */
    static deBoor(controlPoints, knots, degree, t) {
        const n = controlPoints.length - 1;
        
        // Find the knot span
        let k = degree;
        while (k <= n && knots[k] <= t) {
            k++;
        }
        k--;
        
        // Initialize the points array
        const points = [];
        for (let i = 0; i <= degree; i++) {
            const idx = Math.max(0, Math.min(n, k - degree + i));
            points[i] = { ...controlPoints[idx] };
        }
        
        // De Boor's algorithm
        for (let r = 1; r <= degree; r++) {
            for (let i = degree; i >= r; i--) {
                const alpha = (t - knots[k - degree + i]) / (knots[k + i - r] - knots[k - degree + i]);
                points[i].x = (1 - alpha) * points[i - 1].x + alpha * points[i].x;
                points[i].y = (1 - alpha) * points[i - 1].y + alpha * points[i].y;
            }
        }
        
        return points[degree];
    }

    /**
     * Generates a uniform knot vector for B-splines
     */
    static generateKnotVector(n, degree) {
        const knots = [];
        const m = n + degree + 1;
        
        for (let i = 0; i <= m; i++) {
            if (i <= degree) {
                knots[i] = 0;
            } else if (i >= m - degree) {
                knots[i] = 1;
            } else {
                knots[i] = (i - degree) / (m - 2 * degree);
            }
        }
        
        return knots;
    }

    /**
     * Smooth step interpolation with easing
     */
    static smoothStep(p1, p2, t) {
        // Smooth step function: 3t² - 2t³
        const smoothT = t * t * (3 - 2 * t);
        return this.linear(p1, p2, smoothT);
    }

    /**
     * Smoother step interpolation with better easing
     */
    static smootherStep(p1, p2, t) {
        // Smoother step function: 6t⁵ - 15t⁴ + 10t³
        const smoothT = t * t * t * (t * (t * 6 - 15) + 10);
        return this.linear(p1, p2, smoothT);
    }

    /**
     * Interpolates along a path with multiple waypoints
     */
    static interpolateAlongPath(waypoints, t, method = 'linear') {
        if (waypoints.length === 0) {
            return { x: 0, y: 0 };
        }
        
        if (waypoints.length === 1) {
            return { ...waypoints[0] };
        }
        
        // Clamp t to valid range
        t = Math.max(0, Math.min(1, t));
        
        // Find the segment we're in
        const segmentCount = waypoints.length - 1;
        const segmentIndex = Math.floor(t * segmentCount);
        const nextIndex = Math.min(segmentIndex + 1, waypoints.length - 1);
        
        // Calculate local t within the segment
        const localT = (t * segmentCount) - segmentIndex;
        
        const current = waypoints[segmentIndex];
        const next = waypoints[nextIndex];
        
        switch (method) {
            case 'smoothStep':
                return this.smoothStep(current, next, localT);
            case 'smootherStep':
                return this.smootherStep(current, next, localT);
            case 'quadraticBezier':
                if (waypoints.length >= 3) {
                    const control = waypoints[Math.min(segmentIndex + 2, waypoints.length - 1)];
                    return this.quadraticBezier(current, control, next, localT);
                }
                return this.linear(current, next, localT);
            case 'catmullRom':
                if (waypoints.length >= 4) {
                    const p0 = waypoints[Math.max(0, segmentIndex - 1)];
                    const p1 = current;
                    const p2 = next;
                    const p3 = waypoints[Math.min(waypoints.length - 1, segmentIndex + 2)];
                    return this.catmullRom(p0, p1, p2, p3, localT);
                }
                return this.linear(current, next, localT);
            case 'bSpline':
                return this.bSpline(waypoints, t);
            case 'linear':
            default:
                return this.linear(current, next, localT);
        }
    }

    /**
     * Calculates the tangent vector at a given point on the path
     */
    static calculateTangent(waypoints, t, method = 'linear') {
        const epsilon = 0.001;
        const t1 = Math.max(0, t - epsilon);
        const t2 = Math.min(1, t + epsilon);
        
        const p1 = this.interpolateAlongPath(waypoints, t1, method);
        const p2 = this.interpolateAlongPath(waypoints, t2, method);
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        return length > 0 ? { x: dx / length, y: dy / length } : { x: 1, y: 0 };
    }

    /**
     * Calculates the normal vector at a given point on the path
     */
    static calculateNormal(waypoints, t, method = 'linear') {
        const tangent = this.calculateTangent(waypoints, t, method);
        return { x: -tangent.y, y: tangent.x };
    }

    /**
     * Calculates the curvature at a given point on the path
     */
    static calculateCurvature(waypoints, t, method = 'linear') {
        const epsilon = 0.001;
        const t1 = Math.max(0, t - epsilon);
        const t2 = Math.min(1, t + epsilon);
        
        const tangent1 = this.calculateTangent(waypoints, t1, method);
        const tangent2 = this.calculateTangent(waypoints, t2, method);
        
        const dTangentX = tangent2.x - tangent1.x;
        const dTangentY = tangent2.y - tangent1.y;
        
        return Math.sqrt(dTangentX * dTangentX + dTangentY * dTangentY) / (2 * epsilon);
    }

    /**
     * Adaptive sampling for smooth path rendering
     */
    static adaptiveSample(waypoints, method = 'linear', maxError = 1.0, maxDepth = 8) {
        const samples = [{ t: 0, point: this.interpolateAlongPath(waypoints, 0, method) }];
        
        this.adaptiveSampleRecursive(waypoints, method, 0, 1, maxError, maxDepth, 0, samples);
        
        samples.push({ t: 1, point: this.interpolateAlongPath(waypoints, 1, method) });
        
        return samples;
    }

    /**
     * Recursive helper for adaptive sampling
     */
    static adaptiveSampleRecursive(waypoints, method, t1, t2, maxError, maxDepth, depth, samples) {
        if (depth >= maxDepth) return;
        
        const tMid = (t1 + t2) / 2;
        const p1 = this.interpolateAlongPath(waypoints, t1, method);
        const p2 = this.interpolateAlongPath(waypoints, t2, method);
        const pMid = this.interpolateAlongPath(waypoints, tMid, method);
        
        // Calculate the expected midpoint using linear interpolation
        const expectedMid = this.linear(p1, p2, 0.5);
        
        // Calculate the error
        const error = Math.sqrt(
            Math.pow(pMid.x - expectedMid.x, 2) + 
            Math.pow(pMid.y - expectedMid.y, 2)
        );
        
        if (error > maxError) {
            // Subdivide further
            this.adaptiveSampleRecursive(waypoints, method, t1, tMid, maxError, maxDepth, depth + 1, samples);
            samples.push({ t: tMid, point: pMid });
            this.adaptiveSampleRecursive(waypoints, method, tMid, t2, maxError, maxDepth, depth + 1, samples);
        }
    }

    /**
     * Calculates the total arc length of a path
     */
    static calculateArcLength(waypoints, method = 'linear', samples = 100) {
        let totalLength = 0;
        let previousPoint = this.interpolateAlongPath(waypoints, 0, method);
        
        for (let i = 1; i <= samples; i++) {
            const t = i / samples;
            const currentPoint = this.interpolateAlongPath(waypoints, t, method);
            
            const dx = currentPoint.x - previousPoint.x;
            const dy = currentPoint.y - previousPoint.y;
            totalLength += Math.sqrt(dx * dx + dy * dy);
            
            previousPoint = currentPoint;
        }
        
        return totalLength;
    }

    /**
     * Reparameterizes a path by arc length for uniform speed
     */
    static reparameterizeByArcLength(waypoints, method = 'linear', samples = 100) {
        const arcLengths = [0];
        let totalLength = 0;
        let previousPoint = this.interpolateAlongPath(waypoints, 0, method);
        
        // Calculate cumulative arc lengths
        for (let i = 1; i <= samples; i++) {
            const t = i / samples;
            const currentPoint = this.interpolateAlongPath(waypoints, t, method);
            
            const dx = currentPoint.x - previousPoint.x;
            const dy = currentPoint.y - previousPoint.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);
            
            totalLength += segmentLength;
            arcLengths.push(totalLength);
            
            previousPoint = currentPoint;
        }
        
        // Create lookup function for arc length to parameter mapping
        return {
            totalLength: totalLength,
            getParameterFromArcLength: (arcLength) => {
                if (arcLength <= 0) return 0;
                if (arcLength >= totalLength) return 1;
                
                // Binary search for the correct segment
                let low = 0;
                let high = arcLengths.length - 1;
                
                while (low < high - 1) {
                    const mid = Math.floor((low + high) / 2);
                    if (arcLengths[mid] <= arcLength) {
                        low = mid;
                    } else {
                        high = mid;
                    }
                }
                
                // Linear interpolation within the segment
                const segmentStart = arcLengths[low];
                const segmentEnd = arcLengths[high];
                const segmentProgress = (arcLength - segmentStart) / (segmentEnd - segmentStart);
                
                return (low + segmentProgress) / samples;
            }
        };
    }

    /**
     * Records interpolation usage for performance monitoring
     */
    static recordUsage(method, waypointCount, computationTime) {
        consciousness.recordEvent('path_interpolation_used', {
            method: method,
            waypointCount: waypointCount,
            computationTime: computationTime,
            timestamp: Date.now()
        });
    }
}