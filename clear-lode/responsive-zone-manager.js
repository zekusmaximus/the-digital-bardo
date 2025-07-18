import { PositionZoneManager } from './position-zone-manager.js';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { AnimationGuardian } from '../src/utils/animation-guardian.js';

/**
 * Extends PositionZoneManager with mobile-specific optimizations for touch interactions,
 * battery conservation, and responsive positioning.
 */
export class ResponsiveZoneManager extends PositionZoneManager {
    constructor() {
        super();
        
        // Mobile-specific configuration
        this.mobileConfig = {
            // Touch interaction settings
            touchZoneSize: 0.15,         // 15% of screen size for touch zones
            minTouchZoneSize: 44,        // Minimum touch zone size in pixels (accessibility standard)
            touchSafeMargin: 10,         // Margin around touch zones in pixels
            
            // Battery conservation settings
            batteryAwareAnimations: true,  // Enable battery-conscious animations
            reducedMotionCheck: true,      // Check for prefers-reduced-motion
            batteryLevelThreshold: 0.2,    // Threshold for low battery optimizations (20%)
            
            // Mobile viewport settings
            mobileBreakpoint: 768,         // Max width to consider as mobile device
            tabletBreakpoint: 1024,        // Max width to consider as tablet device
            smallScreenThreshold: 360,     // Very small screen threshold
            
            // Animation settings for mobile
            animationDurationMultiplier: 0.8,  // Reduce animation duration on mobile
            maxWaypointsOnMobile: 4,           // Maximum waypoints for mobile animations
            centerEffectsOnMobile: false       // Disable center effects on low-end mobile
        };
        
        // Initialize mobile detection and settings
        this.isMobileDevice = this.detectMobileDevice();
        this.batteryStatus = { level: 1.0, charging: true };
        this.reducedMotionEnabled = this.checkReducedMotion();
        
        // Set up additional mobile-specific event listeners
        this.setupMobileEventListeners();
        
        // Apply mobile-specific optimizations if on mobile device
        if (this.isMobileDevice) {
            this.applyMobileOptimizations();
            this.requestBatteryStatus();
        }
        
        console.log(`[ResponsiveZoneManager] Initialized with mobile detection: ${this.isMobileDevice ? 'Mobile device' : 'Desktop device'}`);
    }
    
    /**
     * Detects if the current device is a mobile device
     */
    detectMobileDevice() {
        // Check viewport size
        const viewport = this.getViewportDimensions();
        const isMobileViewport = viewport.width <= this.mobileConfig.mobileBreakpoint;
        
        // Check for mobile user agent (fallback method)
        const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check for touch capability
        const hasTouchCapability = 'ontouchstart' in window || 
                                  navigator.maxTouchPoints > 0 || 
                                  navigator.msMaxTouchPoints > 0;
        
        // Consider a device mobile if it has a mobile viewport size AND either a mobile user agent or touch capability
        return isMobileViewport && (userAgentCheck || hasTouchCapability);
    }
    
    /**
     * Checks if the user has requested reduced motion
     */
    checkReducedMotion() {
        if (this.mobileConfig.reducedMotionCheck && window.matchMedia) {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        return false;
    }
    
    /**
     * Sets up mobile-specific event listeners
     */
    setupMobileEventListeners() {
        // Listen for orientation changes specifically
        window.addEventListener('orientationchange', () => {
            console.log('[ResponsiveZoneManager] Orientation change detected');
            // Force zone recalculation after orientation change with a delay
            setTimeout(() => {
                const newViewport = this.getViewportDimensions();
                this.recalculateZonesForViewport(newViewport);
                
                // Re-apply mobile optimizations after orientation change
                if (this.isMobileDevice) {
                    this.applyMobileOptimizations();
                }
            }, this.config.orientationChangeDelay + 100);
        });
        
        // Listen for reduced motion preference changes
        if (window.matchMedia) {
            const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (motionMediaQuery.addEventListener) {
                motionMediaQuery.addEventListener('change', () => {
                    this.reducedMotionEnabled = motionMediaQuery.matches;
                    this.updateAnimationSettings();
                });
            }
        }
        
        // Register cleanup with guardian if available
        if (this.guardian && typeof this.guardian.register === 'function') {
            this.guardian.register(() => {
                if (window.matchMedia) {
                    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                    if (motionMediaQuery.removeEventListener) {
                        motionMediaQuery.removeEventListener('change', () => {});
                    }
                }
            });
        }
    }
    
    /**
     * Requests battery status information if available
     */
    requestBatteryStatus() {
        // Check if Battery API is available
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                // Initial battery status
                this.updateBatteryStatus(battery);
                
                // Listen for battery status changes
                battery.addEventListener('levelchange', () => this.updateBatteryStatus(battery));
                battery.addEventListener('chargingchange', () => this.updateBatteryStatus(battery));
                
                // Register cleanup with guardian if available
                if (this.guardian && typeof this.guardian.register === 'function') {
                    this.guardian.register(() => {
                        battery.removeEventListener('levelchange', () => {});
                        battery.removeEventListener('chargingchange', () => {});
                    });
                }
            }).catch(error => {
                console.warn('[ResponsiveZoneManager] Battery API error:', error);
            });
        } else {
            console.log('[ResponsiveZoneManager] Battery API not available');
        }
    }
    
    /**
     * Updates battery status and applies optimizations if needed
     */
    updateBatteryStatus(battery) {
        const previousLevel = this.batteryStatus.level;
        const previousCharging = this.batteryStatus.charging;
        
        this.batteryStatus = {
            level: battery.level,
            charging: battery.charging
        };
        
        // Log significant battery changes
        if (Math.abs(previousLevel - battery.level) > 0.1 || previousCharging !== battery.charging) {
            console.log(`[ResponsiveZoneManager] Battery status updated: ${Math.round(battery.level * 100)}% ${battery.charging ? '(charging)' : '(discharging)'}`);
        }
        
        // Apply battery-conscious optimizations if level is low and not charging
        if (this.mobileConfig.batteryAwareAnimations && 
            battery.level <= this.mobileConfig.batteryLevelThreshold && 
            !battery.charging) {
            this.applyLowBatteryOptimizations();
        }
    }
    
    /**
     * Applies mobile-specific optimizations to zones and animations
     */
    applyMobileOptimizations() {
        console.log('[ResponsiveZoneManager] Applying mobile-specific optimizations');
        
        const viewport = this.getViewportDimensions();
        
        // Adjust zone configuration for mobile
        this.adjustMobileZoneConfig(viewport);
        
        // Update animation settings for mobile
        this.updateAnimationSettings();
        
        // Record mobile optimization event
        consciousness.recordEvent('mobile_optimizations_applied', {
            viewport: viewport,
            isMobile: this.isMobileDevice,
            batteryStatus: this.batteryStatus,
            reducedMotion: this.reducedMotionEnabled
        });
    }
    
    /**
     * Adjusts zone configuration specifically for mobile devices
     */
    adjustMobileZoneConfig(viewport) {
        // Calculate touch-friendly zone sizes
        const minDimension = Math.min(viewport.width, viewport.height);
        const touchZoneSize = Math.max(
            minDimension * this.mobileConfig.touchZoneSize,
            this.mobileConfig.minTouchZoneSize
        );
        
        // Adjust edge margin to accommodate touch zones
        this.config.edgeMargin = Math.max(
            this.config.edgeMargin,
            touchZoneSize / minDimension
        );
        
        // For very small screens, increase center zone size for better visibility
        if (viewport.width <= this.mobileConfig.smallScreenThreshold) {
            this.config.centerZoneSize = 0.6; // 60% of screen for center zone
        } else {
            // For normal mobile screens, use larger center zone than desktop
            this.config.centerZoneSize = 0.5; // 50% of screen for center zone
        }
        
        // Adjust transition zones to be larger on mobile for easier touch
        this.config.transitionZoneWidth = 0.2; // 20% width for transition zones
        
        // Recalculate zones with new configuration
        this.recalculateZonesForViewport(viewport);
        
        // Adjust zone weights for mobile - prioritize center zones for better visibility
        for (const zone of this.zones.values()) {
            if (zone.type === 'center') {
                zone.weight *= 1.5; // Increase weight for center zones
            } else if (zone.type === 'edge') {
                zone.weight *= 0.7; // Decrease weight for edge zones
            }
        }
    }
    
    /**
     * Updates animation settings based on device capabilities and preferences
     */
    updateAnimationSettings() {
        // Create custom performance tier settings for mobile
        const mobileTierSettings = {
            durationMultiplier: this.mobileConfig.animationDurationMultiplier,
            complexityLevel: 'reduced',
            maxWaypoints: this.mobileConfig.maxWaypointsOnMobile
        };
        
        // Apply reduced motion settings if enabled
        if (this.reducedMotionEnabled) {
            mobileTierSettings.durationMultiplier *= 0.5; // 50% shorter animations
            mobileTierSettings.complexityLevel = 'minimal';
            mobileTierSettings.maxWaypoints = 2;
        }
        
        // Apply mobile-specific animation settings to AnimationGuardian
        if (AnimationGuardian.performanceTiers) {
            // Store original settings if not already stored
            if (!AnimationGuardian._originalTiers) {
                AnimationGuardian._originalTiers = JSON.parse(JSON.stringify(AnimationGuardian.performanceTiers));
            }
            
            // Update mobile-specific performance tiers
            if (this.isMobileDevice) {
                // Apply mobile settings to medium and low tiers
                AnimationGuardian.performanceTiers.medium.durationMultiplier = mobileTierSettings.durationMultiplier;
                AnimationGuardian.performanceTiers.medium.complexityLevel = mobileTierSettings.complexityLevel;
                AnimationGuardian.performanceTiers.low.durationMultiplier = mobileTierSettings.durationMultiplier * 0.8;
                AnimationGuardian.performanceTiers.low.complexityLevel = 'minimal';
                
                // Add mobile-specific settings
                AnimationGuardian.performanceTiers.medium.maxWaypoints = mobileTierSettings.maxWaypoints;
                AnimationGuardian.performanceTiers.low.maxWaypoints = 2;
                AnimationGuardian.performanceTiers.medium.centerEffects = this.mobileConfig.centerEffectsOnMobile;
                AnimationGuardian.performanceTiers.low.centerEffects = false;
            } else {
                // Restore original settings if not mobile
                if (AnimationGuardian._originalTiers) {
                    AnimationGuardian.performanceTiers = JSON.parse(JSON.stringify(AnimationGuardian._originalTiers));
                }
            }
        }
    }
    
    /**
     * Applies optimizations for low battery situations
     */
    applyLowBatteryOptimizations() {
        console.log('[ResponsiveZoneManager] Applying low battery optimizations');
        
        // Further reduce animation duration
        if (AnimationGuardian.performanceTiers) {
            AnimationGuardian.performanceTiers.medium.durationMultiplier *= 0.7;
            AnimationGuardian.performanceTiers.low.durationMultiplier *= 0.7;
            AnimationGuardian.performanceTiers.high.durationMultiplier *= 0.8;
        }
        
        // Disable center effects completely
        if (AnimationGuardian.performanceTiers) {
            AnimationGuardian.performanceTiers.medium.centerEffects = false;
            AnimationGuardian.performanceTiers.high.centerEffects = false;
        }
        
        // Reduce waypoint count even further
        if (AnimationGuardian.performanceTiers) {
            AnimationGuardian.performanceTiers.medium.maxWaypoints = 2;
            AnimationGuardian.performanceTiers.high.maxWaypoints = 3;
        }
        
        // Adjust zone weights to favor edge zones (less movement across screen)
        for (const zone of this.zones.values()) {
            if (zone.type === 'edge') {
                zone.weight *= 1.5; // Increase weight for edge zones
            } else if (zone.type === 'center') {
                zone.weight *= 0.6; // Decrease weight for center zones
            }
        }
        
        // Record low battery optimization event
        consciousness.recordEvent('low_battery_optimizations_applied', {
            batteryLevel: this.batteryStatus.level,
            batteryCharging: this.batteryStatus.charging
        });
    }
    
    /**
     * Overrides the selectZone method to implement touch-friendly zone selection
     */
    selectZone(distributionStrategy = 'balanced') {
        // If not mobile, use the parent implementation
        if (!this.isMobileDevice) {
            return super.selectZone(distributionStrategy);
        }
        
        // For mobile devices, implement touch-friendly zone selection
        const availableZones = Array.from(this.zones.values());
        
        // If battery is low and not charging, favor edge zones
        if (this.batteryStatus.level <= this.mobileConfig.batteryLevelThreshold && 
            !this.batteryStatus.charging) {
            return this.selectEdgeZone(availableZones);
        }
        
        // For reduced motion preference, use simpler distribution
        if (this.reducedMotionEnabled) {
            return this.selectBalancedZone(availableZones);
        }
        
        // Otherwise use the requested strategy with mobile weights
        switch (distributionStrategy) {
            case 'center-weighted':
                return this.selectMobileCenterWeightedZone(availableZones);
            case 'edge-only':
                return this.selectEdgeZone(availableZones);
            case 'organic':
                return this.selectMobileOrganicZone(availableZones);
            default:
                return this.selectMobileBalancedZone(availableZones);
        }
    }
    
    /**
     * Mobile-optimized balanced zone selection
     */
    selectMobileBalancedZone(zones) {
        // Calculate selection weights based on current distribution and touch-friendliness
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
            
            // For mobile, favor center zones for better visibility
            if (zone.type === 'center') {
                adjustedWeight *= 1.3;
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
     * Mobile-optimized center-weighted zone selection
     */
    selectMobileCenterWeightedZone(zones) {
        const centerZones = zones.filter(zone => zone.type === 'center');
        const otherZones = zones.filter(zone => zone.type !== 'center');
        
        // 80% chance for center zones on mobile (higher than desktop)
        if (Math.random() < 0.8 && centerZones.length > 0) {
            return this.selectMobileBalancedZone(centerZones);
        } else {
            return this.selectMobileBalancedZone(otherZones.length > 0 ? otherZones : zones);
        }
    }
    
    /**
     * Mobile-optimized organic flow zone selection
     */
    selectMobileOrganicZone(zones) {
        // Consider recent placement patterns for organic flow
        const recentZones = this.distributionHistory.slice(-5);
        const recentTypes = recentZones.map(entry => entry.zone.type);
        
        // If recent placements were all edges, bias toward center
        if (recentTypes.every(type => type === 'edge')) {
            return this.selectMobileCenterWeightedZone(zones);
        }
        
        // If recent placements were all center, bias toward transitions
        if (recentTypes.every(type => type === 'center')) {
            const transitionZones = zones.filter(zone => zone.type === 'transition');
            return transitionZones.length > 0 ? 
                this.selectMobileBalancedZone(transitionZones) : 
                this.selectMobileBalancedZone(zones);
        }
        
        // Default to mobile balanced selection
        return this.selectMobileBalancedZone(zones);
    }
    
    /**
     * Overrides adjustConfigForViewport to add mobile-specific adjustments
     */
    adjustConfigForViewport(viewport) {
        // Call parent implementation first
        super.adjustConfigForViewport(viewport);
        
        // Additional mobile-specific adjustments
        if (this.isMobileDevice) {
            // For very small screens, increase center zone size for better visibility
            if (viewport.width <= this.mobileConfig.smallScreenThreshold) {
                this.config.centerZoneSize = 0.6; // 60% of screen for center zone
            } else {
                // For normal mobile screens, use larger center zone than desktop
                this.config.centerZoneSize = 0.5; // 50% of screen for center zone
            }
            
            // Adjust transition zones to be larger on mobile for easier touch
            this.config.transitionZoneWidth = 0.2; // 20% width for transition zones
            
            // Ensure minimum touch zone size
            const minDimension = Math.min(viewport.width, viewport.height);
            const minTouchZonePercentage = this.mobileConfig.minTouchZoneSize / minDimension;
            this.config.edgeMargin = Math.max(this.config.edgeMargin, minTouchZonePercentage);
        }
    }
    
    /**
     * Gets current device and optimization status
     */
    getMobileStatus() {
        return {
            isMobileDevice: this.isMobileDevice,
            batteryStatus: this.batteryStatus,
            reducedMotionEnabled: this.reducedMotionEnabled,
            viewport: this.getViewportDimensions(),
            optimizationsApplied: {
                touchFriendly: this.isMobileDevice,
                batteryConscious: this.mobileConfig.batteryAwareAnimations && this.isMobileDevice,
                lowBatteryMode: this.batteryStatus.level <= this.mobileConfig.batteryLevelThreshold && !this.batteryStatus.charging,
                reducedMotion: this.reducedMotionEnabled
            }
        };
    }
}