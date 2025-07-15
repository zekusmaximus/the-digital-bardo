import { AnimationGuardian } from '../src/utils/animation-guardian.js';

/**
 * Handles fragment positioning using zone-based algorithms
 */
export class FragmentPositioningService {
    constructor(zoneManager) {
        this.zoneManager = zoneManager;
    }

    /**
     * Positions fragment using zone-based positioning
     */
    positionFragment(fragment, zone, distributionData = null) {
        // Zone-based positioning with coordinate conversion
        const position = this.convertZoneToCoordinates(zone, distributionData);
        
        // Apply margin and spacing calculations for center zones
        const adjustedPosition = this.applyZoneMargins(position, zone);
        
        // Set fragment position using absolute coordinates
        AnimationGuardian.safeAnimate(fragment, {
            position: 'absolute',
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
            right: 'auto',
            bottom: 'auto',
            duration: 0 // Instant change
        });
        
        // Store zone information on fragment for tracking
        fragment.dataset.zoneId = zone.id;
        fragment.dataset.zoneType = zone.type;
    }

    /**
     * Converts zone object to pixel coordinates
     */
    convertZoneToCoordinates(zone, distributionData = null) {
        // Get random position within zone bounds
        let position = zone.getRandomPosition(0.1); // 10% margin within zone
        
        // Apply distribution-based adjustments if provided
        if (distributionData && distributionData.centerBias) {
            position = this.applyCenterBias(position, zone, distributionData.centerBias);
        }
        
        return position;
    }

    /**
     * Applies margin and spacing calculations for different zone types
     */
    applyZoneMargins(position, zone) {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // Apply zone-specific margin adjustments
        switch (zone.type) {
            case 'center':
                // Center zones get additional spacing to prevent overcrowding
                return this.applyCenterZoneSpacing(position, zone, viewport);
            case 'edge':
                // Edge zones maintain minimum distance from viewport edges
                return this.applyEdgeZoneMargins(position, zone, viewport);
            case 'transition':
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
            y: (Math.random() - 0.5) * centerSpacing
        };
        
        return {
            x: Math.max(zone.bounds.x.min + centerSpacing, 
                Math.min(zone.bounds.x.max - centerSpacing, position.x + randomOffset.x)),
            y: Math.max(zone.bounds.y.min + centerSpacing, 
                Math.min(zone.bounds.y.max - centerSpacing, position.y + randomOffset.y))
        };
    }

    /**
     * Applies edge zone margins to maintain viewport boundaries
     */
    applyEdgeZoneMargins(position, zone, viewport) {
        const edgeMargin = Math.min(viewport.width, viewport.height) * 0.02; // 2% margin
        
        return {
            x: Math.max(edgeMargin, Math.min(viewport.width - edgeMargin, position.x)),
            y: Math.max(edgeMargin, Math.min(viewport.height - edgeMargin, position.y))
        };
    }

    /**
     * Applies transition zone spacing for balanced distribution
     */
    applyTransitionZoneSpacing(position, zone, viewport) {
        const transitionSpacing = Math.min(viewport.width, viewport.height) * 0.03; // 3% spacing
        
        return {
            x: Math.max(zone.bounds.x.min + transitionSpacing, 
                Math.min(zone.bounds.x.max - transitionSpacing, position.x)),
            y: Math.max(zone.bounds.y.min + transitionSpacing, 
                Math.min(zone.bounds.y.max - transitionSpacing, position.y))
        };
    }

    /**
     * Applies center bias to position based on distribution data
     */
    applyCenterBias(position, zone, centerBias) {
        if (centerBias <= 0) return position;
        
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        const centerPoint = {
            x: viewport.width / 2,
            y: viewport.height / 2
        };
        
        // Apply bias toward center point
        const biasStrength = Math.min(1.0, centerBias);
        
        return {
            x: position.x + (centerPoint.x - position.x) * biasStrength * 0.3,
            y: position.y + (centerPoint.y - position.y) * biasStrength * 0.3
        };
    }

    /**
     * Determines distribution strategy based on performance tier and current state
     */
    getDistributionStrategy(performanceTier) {
        // Base strategy on performance tier
        switch (performanceTier) {
            case 'high':
                return 'organic'; // Most sophisticated distribution
            case 'medium':
                return 'center-weighted'; // Balanced with center bias
            case 'low':
                return 'edge-only'; // Fallback to simple edge positioning
            default:
                return 'balanced';
        }
    }
}