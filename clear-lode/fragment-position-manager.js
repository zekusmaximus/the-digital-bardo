import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

/**
 * FragmentPositionManager - Ensures fragments are positioned for optimal readability
 * 
 * This class implements the requirements for readable fragment placement:
 * - Safe zone calculations to keep fragments in readable areas
 * - Readability scoring based on position and speed
 * - Automatic repositioning for edge-drifting fragments
 * 
 * Requirements addressed: 1.1, 1.4, 1.5
 */
export class FragmentPositionManager {
    constructor(viewportDimensions = null, readabilityConfig = null) {
        this.guardian = new ResourceGuardian();
        
        // Viewport tracking
        this.viewport = viewportDimensions || this.getViewportDimensions();
        
        // Readability configuration
        this.config = {
            safeZone: {
                marginTop: 60,        // pixels from top (avoid browser UI)
                marginBottom: 60,     // pixels from bottom
                marginLeft: 40,       // pixels from left
                marginRight: 40,      // pixels from right
                centerBias: 0.3       // bias toward center for readability
            },
            speedLimits: {
                maxSpeed: 120,        // pixels per second maximum
                minSpeed: 20,         // pixels per second minimum
                baseSpeedFactor: 0.8, // base speed multiplier
                lengthSpeedRatio: 2   // characters per pixel/second
            },
            visibility: {
                minContrast: 0.7,     // minimum contrast ratio
                minFontSize: 14,      // minimum font size in pixels
                maxOpacity: 1.0,      // maximum opacity
                readabilityThreshold: 0.6 // minimum readability score
            },
            repositioning: {
                edgeThreshold: 0.1,   // 10% from edge triggers repositioning
                repositionSpeed: 200, // pixels per second for repositioning
                smoothTransition: true // use smooth transitions
            }
        };
        
        // Override with provided config
        if (readabilityConfig) {
            this.config = { ...this.config, ...readabilityConfig };
        }
        
        // Safe zone boundaries (calculated from viewport and margins)
        this.safeZone = this.calculateSafeZone();
        
        // Fragment tracking for repositioning
        this.trackedFragments = new Map();
        
        // Performance monitoring
        this.performanceMetrics = {
            repositionCount: 0,
            readabilityScores: [],
            averageReadability: 0
        };
        
        // Setup viewport change monitoring
        this.setupViewportMonitoring();
        
        console.log('[FragmentPositionManager] Initialized with safe zone:', this.safeZone);
    }

    /**
     * Calculates the safe zone boundaries for readable fragment placement
     * Requirements: 1.1, 1.4
     */
    calculateSafeZone() {
        const { width, height } = this.viewport;
        const { safeZone } = this.config;
        
        const safeZoneBounds = {
            x: {
                min: safeZone.marginLeft,
                max: width - safeZone.marginRight
            },
            y: {
                min: safeZone.marginTop,
                max: height - safeZone.marginBottom
            }
        };
        
        // Ensure minimum safe zone size
        const minWidth = 200;
        const minHeight = 150;
        
        if (safeZoneBounds.x.max - safeZoneBounds.x.min < minWidth) {
            const center = width / 2;
            safeZoneBounds.x.min = center - minWidth / 2;
            safeZoneBounds.x.max = center + minWidth / 2;
        }
        
        if (safeZoneBounds.y.max - safeZoneBounds.y.min < minHeight) {
            const center = height / 2;
            safeZoneBounds.y.min = center - minHeight / 2;
            safeZoneBounds.y.max = center + minHeight / 2;
        }
        
        return {
            bounds: safeZoneBounds,
            center: {
                x: (safeZoneBounds.x.min + safeZoneBounds.x.max) / 2,
                y: (safeZoneBounds.y.min + safeZoneBounds.y.max) / 2
            },
            width: safeZoneBounds.x.max - safeZoneBounds.x.min,
            height: safeZoneBounds.y.max - safeZoneBounds.y.min
        };
    }

    /**
     * Calculates optimal speed for a fragment based on content length
     * Requirements: 1.3 (referenced from task details)
     */
    calculateOptimalSpeed(fragmentContent) {
        if (!fragmentContent || typeof fragmentContent !== 'string') {
            return this.config.speedLimits.minSpeed;
        }
        
        const contentLength = fragmentContent.length;
        const { speedLimits } = this.config;
        
        // Base calculation: longer content should move slower for readability
        const baseSpeed = Math.max(
            speedLimits.minSpeed,
            speedLimits.maxSpeed - (contentLength * speedLimits.lengthSpeedRatio)
        );
        
        // Apply speed factor
        const adjustedSpeed = baseSpeed * speedLimits.baseSpeedFactor;
        
        // Ensure within limits
        const finalSpeed = Math.max(
            speedLimits.minSpeed,
            Math.min(speedLimits.maxSpeed, adjustedSpeed)
        );
        
        return finalSpeed;
    }

    /**
     * Calculates readability score based on position and speed
     * Requirements: 1.1, 1.4, 1.5
     */
    calculateReadabilityScore(fragment, position, speed) {
        let score = 1.0;
        
        // Position-based scoring
        const positionScore = this.calculatePositionScore(position);
        score *= positionScore;
        
        // Speed-based scoring
        const speedScore = this.calculateSpeedScore(speed, fragment.textContent);
        score *= speedScore;
        
        // Visibility-based scoring
        const visibilityScore = this.calculateVisibilityScore(fragment);
        score *= visibilityScore;
        
        // Distance from center scoring (center bias)
        const centerScore = this.calculateCenterScore(position);
        score *= (1 - this.config.safeZone.centerBias) + (centerScore * this.config.safeZone.centerBias);
        
        return Math.max(0, Math.min(1, score));
    }

    /**
     * Calculates position-based readability score
     */
    calculatePositionScore(position) {
        const { bounds } = this.safeZone;
        
        // Check if position is within safe zone
        const inSafeZone = position.x >= bounds.x.min && position.x <= bounds.x.max &&
                          position.y >= bounds.y.min && position.y <= bounds.y.max;
        
        if (!inSafeZone) {
            // Calculate distance from safe zone
            const distanceFromSafeZone = this.calculateDistanceFromSafeZone(position);
            const maxDistance = Math.max(this.viewport.width, this.viewport.height) * 0.2;
            return Math.max(0.1, 1 - (distanceFromSafeZone / maxDistance));
        }
        
        return 1.0;
    }

    /**
     * Calculates speed-based readability score
     */
    calculateSpeedScore(speed, content) {
        const optimalSpeed = this.calculateOptimalSpeed(content);
        const speedDifference = Math.abs(speed - optimalSpeed);
        const maxSpeedDifference = this.config.speedLimits.maxSpeed - this.config.speedLimits.minSpeed;
        
        return Math.max(0.2, 1 - (speedDifference / maxSpeedDifference));
    }

    /**
     * Calculates visibility-based readability score
     */
    calculateVisibilityScore(fragment) {
        let score = 1.0;
        
        // Check computed styles if fragment is in DOM
        if (fragment.parentNode) {
            const styles = window.getComputedStyle(fragment);
            
            // Font size check
            const fontSize = parseFloat(styles.fontSize);
            if (fontSize < this.config.visibility.minFontSize) {
                score *= 0.5;
            }
            
            // Opacity check
            const opacity = parseFloat(styles.opacity);
            if (opacity < 0.7) {
                score *= opacity;
            }
        }
        
        return score;
    }

    /**
     * Calculates center-based readability score
     */
    calculateCenterScore(position) {
        const { center } = this.safeZone;
        const distance = Math.sqrt(
            Math.pow(position.x - center.x, 2) + 
            Math.pow(position.y - center.y, 2)
        );
        
        const maxDistance = Math.sqrt(
            Math.pow(this.safeZone.width / 2, 2) + 
            Math.pow(this.safeZone.height / 2, 2)
        );
        
        return Math.max(0, 1 - (distance / maxDistance));
    }

    /**
     * Calculates distance from safe zone boundaries
     */
    calculateDistanceFromSafeZone(position) {
        const { bounds } = this.safeZone;
        
        let distance = 0;
        
        if (position.x < bounds.x.min) {
            distance += bounds.x.min - position.x;
        } else if (position.x > bounds.x.max) {
            distance += position.x - bounds.x.max;
        }
        
        if (position.y < bounds.y.min) {
            distance += bounds.y.min - position.y;
        } else if (position.y > bounds.y.max) {
            distance += position.y - bounds.y.max;
        }
        
        return distance;
    }

    /**
     * Validates fragment placement and returns readability assessment
     * Requirements: 1.1, 1.4, 1.5
     */
    validateFragmentPlacement(fragment) {
        if (!fragment || !fragment.parentNode) {
            return { isValid: false, score: 0, issues: ['Fragment not in DOM'] };
        }
        
        const rect = fragment.getBoundingClientRect();
        const position = { x: rect.left, y: rect.top };
        
        // Get current speed from fragment data or calculate default
        const speed = parseFloat(fragment.dataset.speed) || this.config.speedLimits.minSpeed;
        
        // Calculate readability score
        const score = this.calculateReadabilityScore(fragment, position, speed);
        
        // Identify issues
        const issues = [];
        
        if (!this.isInSafeZone(position)) {
            issues.push('Outside safe zone');
        }
        
        if (speed > this.calculateOptimalSpeed(fragment.textContent) * 1.5) {
            issues.push('Moving too fast for content length');
        }
        
        if (this.isNearEdge(position)) {
            issues.push('Too close to viewport edge');
        }
        
        const isValid = score >= this.config.visibility.readabilityThreshold;
        
        return {
            isValid,
            score,
            issues,
            position,
            speed,
            recommendedPosition: isValid ? null : this.getRecommendedPosition(fragment)
        };
    }

    /**
     * Checks if position is within safe zone
     */
    isInSafeZone(position) {
        const { bounds } = this.safeZone;
        return position.x >= bounds.x.min && position.x <= bounds.x.max &&
               position.y >= bounds.y.min && position.y <= bounds.y.max;
    }

    /**
     * Checks if position is near viewport edges
     */
    isNearEdge(position) {
        const threshold = this.config.repositioning.edgeThreshold;
        const edgeDistance = Math.min(this.viewport.width, this.viewport.height) * threshold;
        
        return position.x < edgeDistance || 
               position.x > this.viewport.width - edgeDistance ||
               position.y < edgeDistance || 
               position.y > this.viewport.height - edgeDistance;
    }

    /**
     * Gets recommended position for better readability
     */
    getRecommendedPosition(fragment) {
        const { center } = this.safeZone;
        const { centerBias } = this.config.safeZone;
        
        // Generate position with center bias
        const randomOffset = {
            x: (Math.random() - 0.5) * this.safeZone.width * (1 - centerBias),
            y: (Math.random() - 0.5) * this.safeZone.height * (1 - centerBias)
        };
        
        return {
            x: center.x + randomOffset.x,
            y: center.y + randomOffset.y
        };
    }

    /**
     * Repositions fragment if it's drifting to edges or outside safe zone
     * Requirements: 1.4, 1.5
     */
    repositionIfNeeded(fragment) {
        const validation = this.validateFragmentPlacement(fragment);
        
        if (!validation.isValid && validation.recommendedPosition) {
            this.repositionFragment(fragment, validation.recommendedPosition);
            return true;
        }
        
        return false;
    }

    /**
     * Repositions a fragment to a new position with smooth transition
     */
    repositionFragment(fragment, newPosition) {
        if (!fragment || !fragment.parentNode) return;
        
        const currentRect = fragment.getBoundingClientRect();
        const currentPosition = { x: currentRect.left, y: currentRect.top };
        
        // Track repositioning
        this.performanceMetrics.repositionCount++;
        
        // Store fragment tracking data
        this.trackedFragments.set(fragment, {
            originalPosition: currentPosition,
            targetPosition: newPosition,
            repositionTime: Date.now()
        });
        
        if (this.config.repositioning.smoothTransition) {
            // Use smooth CSS transition
            fragment.style.transition = 'left 0.5s ease-out, top 0.5s ease-out';
            fragment.style.left = `${newPosition.x}px`;
            fragment.style.top = `${newPosition.y}px`;
            
            // Remove transition after completion
            setTimeout(() => {
                if (fragment.parentNode) {
                    fragment.style.transition = '';
                }
            }, 500);
        } else {
            // Immediate repositioning
            fragment.style.left = `${newPosition.x}px`;
            fragment.style.top = `${newPosition.y}px`;
        }
        
        // Record repositioning event
        consciousness.recordEvent('fragment_repositioned', {
            fragmentId: fragment.dataset.birthTime || 'unknown',
            fromPosition: currentPosition,
            toPosition: newPosition,
            reason: 'readability_improvement',
            readabilityScore: this.calculateReadabilityScore(fragment, newPosition, 
                parseFloat(fragment.dataset.speed) || this.config.speedLimits.minSpeed)
        });
        
        console.log('[FragmentPositionManager] Repositioned fragment for better readability');
    }

    /**
     * Gets a safe position within the readable zone
     * Requirements: 1.1, 1.4
     */
    getSafePosition(preferredPosition = null) {
        const { bounds, center } = this.safeZone;
        const { centerBias } = this.config.safeZone;
        
        let position;
        
        if (preferredPosition && this.isInSafeZone(preferredPosition)) {
            position = preferredPosition;
        } else {
            // Generate random position within safe zone with center bias
            const randomX = bounds.x.min + Math.random() * (bounds.x.max - bounds.x.min);
            const randomY = bounds.y.min + Math.random() * (bounds.y.max - bounds.y.min);
            
            // Apply center bias
            position = {
                x: randomX + (center.x - randomX) * centerBias,
                y: randomY + (center.y - randomY) * centerBias
            };
        }
        
        // Ensure position is within bounds
        position.x = Math.max(bounds.x.min, Math.min(bounds.x.max, position.x));
        position.y = Math.max(bounds.y.min, Math.min(bounds.y.max, position.y));
        
        return position;
    }

    /**
     * Updates readability metrics
     */
    updateReadabilityMetrics(score) {
        this.performanceMetrics.readabilityScores.push(score);
        
        // Keep only last 50 scores
        if (this.performanceMetrics.readabilityScores.length > 50) {
            this.performanceMetrics.readabilityScores.shift();
        }
        
        // Calculate average
        this.performanceMetrics.averageReadability = 
            this.performanceMetrics.readabilityScores.reduce((sum, s) => sum + s, 0) / 
            this.performanceMetrics.readabilityScores.length;
    }

    /**
     * Gets current viewport dimensions
     */
    getViewportDimensions() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            aspectRatio: window.innerWidth / window.innerHeight,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        };
    }

    /**
     * Sets up viewport change monitoring
     */
    setupViewportMonitoring() {
        let resizeTimeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newViewport = this.getViewportDimensions();
                
                // Check if viewport changed significantly
                const widthChange = Math.abs(newViewport.width - this.viewport.width) / this.viewport.width;
                const heightChange = Math.abs(newViewport.height - this.viewport.height) / this.viewport.height;
                
                if (widthChange > 0.1 || heightChange > 0.1 || 
                    newViewport.orientation !== this.viewport.orientation) {
                    
                    console.log('[FragmentPositionManager] Viewport changed, recalculating safe zone');
                    this.viewport = newViewport;
                    this.safeZone = this.calculateSafeZone();
                    
                    // Reposition tracked fragments if needed
                    this.repositionTrackedFragments();
                }
            }, 250);
        };
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100); // Delay for orientation change
        });
        
        this.guardian.registerCleanup(() => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        });
    }

    /**
     * Repositions all tracked fragments after viewport changes
     */
    repositionTrackedFragments() {
        for (const [fragment, trackingData] of this.trackedFragments) {
            if (fragment.parentNode) {
                const validation = this.validateFragmentPlacement(fragment);
                if (!validation.isValid && validation.recommendedPosition) {
                    this.repositionFragment(fragment, validation.recommendedPosition);
                }
            } else {
                // Remove tracking for fragments no longer in DOM
                this.trackedFragments.delete(fragment);
            }
        }
    }

    /**
     * Gets performance statistics
     */
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            safeZoneArea: this.safeZone.width * this.safeZone.height,
            viewportArea: this.viewport.width * this.viewport.height,
            safeZoneRatio: (this.safeZone.width * this.safeZone.height) / (this.viewport.width * this.viewport.height),
            trackedFragments: this.trackedFragments.size
        };
    }

    /**
     * Destroys the position manager and cleans up resources
     */
    destroy() {
        console.log('[FragmentPositionManager] Destroying position manager');
        
        this.guardian.cleanupAll();
        this.trackedFragments.clear();
        
        consciousness.recordEvent('fragment_position_manager_destroyed', {
            finalStats: this.getPerformanceStats()
        });
    }
}