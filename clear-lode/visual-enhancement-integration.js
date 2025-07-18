/**
 * Visual Enhancement Integration for Dynamic Text Positioning
 * 
 * This module ensures compatibility between the dynamic text positioning system
 * and visual enhancement systems including corruption effects, phosphor effects,
 * chromatic aberration, and light manifestation.
 * 
 * It also verifies proper interaction with the recognition system and karma tracking.
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { PositionZoneManager } from './position-zone-manager.js';
import { BrowserCompatibilityManager } from './browser-compatibility-manager.js';
import { ZoneOptimizationManager } from './zone-optimization-manager.js';

export class VisualEnhancementIntegration {
  constructor() {
    this.guardian = new ResourceGuardian();
    
    // Initialize managers
    this.compatibilityManager = new BrowserCompatibilityManager();
    this.zoneManager = null;
    this.optimizationManager = null;
    
    // Visual effect state
    this.visualEffects = {
      corruption: {
        enabled: true,
        intensity: 0,
        appliedClass: '',
        compatibilityIssues: false
      },
      phosphor: {
        enabled: true,
        intensity: 0,
        appliedClass: '',
        compatibilityIssues: false
      },
      chromatic: {
        enabled: true,
        aberrationLevel: 0,
        compatibilityIssues: false
      },
      light: {
        enabled: true,
        intensity: 0,
        recognitionLevel: 0,
        compatibilityIssues: false
      }
    };
    
    // Recognition and karma state
    this.recognitionState = {
      isRecognized: false,
      karmaLevel: 0,
      karmaBalance: 0.5
    };
    
    // Initialize
    this.initialize();
  }
  
  /**
   * Initializes the integration module
   */
  initialize() {
    // Create zone manager if needed
    if (!this.zoneManager) {
      this.zoneManager = new PositionZoneManager();
      this.optimizationManager = new ZoneOptimizationManager(this.zoneManager);
    }
    
    // Subscribe to consciousness state changes
    this.subscribeToConsciousnessEvents();
    
    // Check for existing visual effect elements
    this.detectVisualEffectElements();
    
    // Log initialization
    console.log('[VisualEnhancementIntegration] Initialized');
  }
  
  /**
   * Subscribes to consciousness state changes
   */
  subscribeToConsciousnessEvents() {
    // Subscribe to karma changes
    consciousness.subscribe('clearLode.karma.level', (value) => {
      this.recognitionState.karmaLevel = value;
      this.updateVisualEffectsForKarma();
    });
    
    consciousness.subscribe('clearLode.karma.balance', (value) => {
      this.recognitionState.karmaBalance = value;
      this.updateVisualEffectsForKarma();
    });
    
    // Subscribe to recognition state
    consciousness.subscribe('clearLode.recognition.recognized', (value) => {
      this.recognitionState.isRecognized = value;
      this.updateVisualEffectsForRecognition();
    });
    
    // Subscribe to degradation level
    consciousness.subscribe('clearLode.degradation.level', (value) => {
      this.visualEffects.corruption.intensity = value;
      this.updateCorruptionEffects();
    });
    
    // Register cleanup with guardian
    this.guardian.register(() => {
      consciousness.unsubscribe('clearLode.karma.level');
      consciousness.unsubscribe('clearLode.karma.balance');
      consciousness.unsubscribe('clearLode.recognition.recognized');
      consciousness.unsubscribe('clearLode.degradation.level');
    });
  }
  
  /**
   * Detects existing visual effect elements in the DOM
   */
  detectVisualEffectElements() {
    // Check for phosphor effects
    const crtScreen = document.querySelector('.crt-screen');
    if (crtScreen) {
      this.visualEffects.phosphor.enabled = true;
      console.log('[VisualEnhancementIntegration] Detected phosphor effects');
    } else {
      this.visualEffects.phosphor.enabled = false;
    }
    
    // Check for light manifestation
    const lightManifestation = document.querySelector('.light-manifestation');
    if (lightManifestation) {
      this.visualEffects.light.enabled = true;
      console.log('[VisualEnhancementIntegration] Detected light manifestation');
    } else {
      this.visualEffects.light.enabled = false;
    }
    
    // Check for corruption effects by looking at body data attributes
    if (document.body.hasAttribute('data-degradation')) {
      this.visualEffects.corruption.enabled = true;
      this.visualEffects.corruption.appliedClass = document.body.getAttribute('data-degradation');
      console.log('[VisualEnhancementIntegration] Detected corruption effects');
    } else {
      this.visualEffects.corruption.enabled = false;
    }
    
    // Check for chromatic aberration
    const chromaticElements = document.querySelectorAll('.chromatic-aberration');
    if (chromaticElements.length > 0) {
      this.visualEffects.chromatic.enabled = true;
      console.log('[VisualEnhancementIntegration] Detected chromatic aberration');
    } else {
      this.visualEffects.chromatic.enabled = false;
    }
  }
  
  /**
   * Updates visual effects based on karma state
   */
  updateVisualEffectsForKarma() {
    // Map karma level to body data attribute
    let karmaClass = 'medium';
    if (this.recognitionState.karmaLevel <= 3) {
      karmaClass = 'low';
    } else if (this.recognitionState.karmaLevel >= 7) {
      karmaClass = 'high';
    }
    
    // Apply karma class to body
    if (document.body.getAttribute('data-karma') !== karmaClass) {
      document.body.setAttribute('data-karma', karmaClass);
      console.log(`[VisualEnhancementIntegration] Updated karma visual state: ${karmaClass}`);
    }
    
    // Update zone distribution based on karma
    if (this.zoneManager) {
      // Higher karma = more center-weighted distribution
      const centerBias = this.mapKarmaToDistribution();
      this.zoneManager.updateDistributionStrategy({
        centerBias: centerBias,
        balancePriority: this.recognitionState.karmaBalance
      });
      
      console.log(`[VisualEnhancementIntegration] Updated zone distribution for karma: centerBias=${centerBias.toFixed(2)}`);
    }
  }
  
  /**
   * Maps karma level to distribution parameters
   */
  mapKarmaToDistribution() {
    // Map karma level (0-10) to center bias (0-1)
    // Higher karma = more center-weighted distribution
    const baseBias = this.recognitionState.karmaLevel / 10;
    
    // Adjust based on karma balance (0-1)
    // Higher balance = more even distribution
    const balanceAdjustment = (this.recognitionState.karmaBalance - 0.5) * 0.4;
    
    // Calculate final center bias
    return Math.max(0, Math.min(1, baseBias - balanceAdjustment));
  }
  
  /**
   * Updates visual effects based on recognition state
   */
  updateVisualEffectsForRecognition() {
    // Toggle recognized class on body
    if (this.recognitionState.isRecognized) {
      document.body.classList.add('recognized');
      document.body.setAttribute('data-recognition', 'true');
      console.log('[VisualEnhancementIntegration] Applied recognition visual state');
    } else {
      document.body.classList.remove('recognized');
      document.body.removeAttribute('data-recognition');
    }
    
    // Update zone distribution for recognition state
    if (this.zoneManager && this.recognitionState.isRecognized) {
      // Recognition increases center zone usage
      this.zoneManager.updateZoneWeights({
        center: 2.0,
        transition: 1.5,
        edge: 0.8
      });
      
      console.log('[VisualEnhancementIntegration] Updated zone weights for recognition state');
    }
  }
  
  /**
   * Updates corruption effects based on degradation level
   */
  updateCorruptionEffects() {
    // Map corruption intensity to degradation class
    let degradationClass = 'minimal';
    const intensity = this.visualEffects.corruption.intensity;
    
    if (intensity >= 0.8) {
      degradationClass = 'complete';
    } else if (intensity >= 0.6) {
      degradationClass = 'severe';
    } else if (intensity >= 0.3) {
      degradationClass = 'moderate';
    }
    
    // Apply degradation class to body
    if (document.body.getAttribute('data-degradation') !== degradationClass) {
      document.body.setAttribute('data-degradation', degradationClass);
      this.visualEffects.corruption.appliedClass = degradationClass;
      console.log(`[VisualEnhancementIntegration] Updated corruption visual state: ${degradationClass}`);
    }
    
    // Update chromatic aberration
    this.updateChromaticAberration(intensity);
    
    // Update zone distribution for corruption level
    if (this.zoneManager) {
      // Higher corruption = more chaotic distribution
      const chaosLevel = Math.min(1, intensity * 1.5);
      this.zoneManager.updateDistributionChaos(chaosLevel);
      
      console.log(`[VisualEnhancementIntegration] Updated zone distribution chaos: ${chaosLevel.toFixed(2)}`);
    }
  }
  
  /**
   * Updates chromatic aberration effect
   */
  updateChromaticAberration(intensity) {
    // Calculate aberration level in pixels
    const maxAberration = 8; // Maximum pixel offset
    const aberrationPx = Math.round(intensity * maxAberration);
    
    // Update CSS variable
    document.documentElement.style.setProperty('--chromatic-aberration', `${aberrationPx}px`);
    this.visualEffects.chromatic.aberrationLevel = aberrationPx;
    
    console.log(`[VisualEnhancementIntegration] Updated chromatic aberration: ${aberrationPx}px`);
  }
  
  /**
   * Applies visual effects to a fragment
   * @param {HTMLElement} fragment - The fragment element
   * @param {Object} zone - The zone where the fragment is positioned
   */
  applyVisualEffectsToFragment(fragment, zone) {
    if (!fragment) return;
    
    try {
      // Apply corruption class based on current state
      if (this.visualEffects.corruption.enabled && this.visualEffects.corruption.appliedClass) {
        const corruptionClass = `corrupted-${this.visualEffects.corruption.appliedClass}`;
        fragment.classList.add(corruptionClass);
      }
      
      // Apply chromatic aberration for severe corruption
      if (this.visualEffects.chromatic.enabled && this.visualEffects.corruption.intensity >= 0.6) {
        fragment.classList.add('chromatic-aberration');
        
        // Store original text for aberration effect
        if (!fragment.hasAttribute('data-text') && fragment.textContent) {
          fragment.setAttribute('data-text', fragment.textContent);
        }
      }
      
      // Apply zone-specific visual effects
      if (zone && zone.type) {
        // Center zones get special effects
        if (zone.type === 'center' && this.recognitionState.karmaLevel >= 5) {
          // Add light interaction for center fragments
          fragment.classList.add('light-interactive');
          
          // Higher opacity for center fragments
          fragment.style.opacity = '0.95';
        }
        
        // Edge zones get different effects
        if (zone.type === 'edge' && this.visualEffects.corruption.intensity >= 0.4) {
          // Add digital noise for edge fragments during corruption
          fragment.classList.add('digital-noise');
        }
        
        // Add zone type as data attribute for CSS targeting
        fragment.setAttribute('data-zone-type', zone.type);
      }
      
      // Record visual effect application
      consciousness.recordEvent('fragment_visual_effects_applied', {
        zoneType: zone ? zone.type : 'unknown',
        corruption: this.visualEffects.corruption.appliedClass,
        chromaticAberration: this.visualEffects.chromatic.enabled && this.visualEffects.corruption.intensity >= 0.6,
        karmaLevel: this.recognitionState.karmaLevel
      });
    } catch (error) {
      console.error('[VisualEnhancementIntegration] Error applying visual effects:', error);
    }
  }
  
  /**
   * Validates that a fragment's position is compatible with visual effects
   * @param {Object} position - The position {x, y} to validate
   * @param {Object} zone - The zone where the fragment will be positioned
   * @returns {Object} Validated position
   */
  validatePositionForVisualEffects(position, zone) {
    if (!position) return position;
    
    try {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Get validated position from compatibility manager
      let validatedPosition = this.compatibilityManager.validatePosition(position, viewport);
      
      // Additional validation for visual effects
      if (this.visualEffects.phosphor.enabled) {
        // Ensure position accounts for phosphor glow
        const phosphorGlow = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--phosphor-glow').trim() || '2px');
        
        // Add margin for phosphor glow
        const margin = Math.max(5, phosphorGlow);
        validatedPosition.x = Math.max(margin, Math.min(viewport.width - margin, validatedPosition.x));
        validatedPosition.y = Math.max(margin, Math.min(viewport.height - margin, validatedPosition.y));
      }
      
      // Adjust for chromatic aberration
      if (this.visualEffects.chromatic.enabled && this.visualEffects.chromatic.aberrationLevel > 0) {
        // Add margin for chromatic aberration
        const aberrationMargin = this.visualEffects.chromatic.aberrationLevel + 2;
        validatedPosition.x = Math.max(aberrationMargin, Math.min(viewport.width - aberrationMargin, validatedPosition.x));
        validatedPosition.y = Math.max(aberrationMargin, Math.min(viewport.height - aberrationMargin, validatedPosition.y));
      }
      
      return validatedPosition;
    } catch (error) {
      console.error('[VisualEnhancementIntegration] Error validating position:', error);
      return position; // Return original position if validation fails
    }
  }
  
  /**
   * Validates that a movement path is compatible with visual effects
   * @param {Array} waypoints - The path waypoints to validate
   * @returns {Array} Validated waypoints
   */
  validatePathForVisualEffects(waypoints) {
    if (!waypoints || !Array.isArray(waypoints)) return waypoints;
    
    try {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Calculate margins based on visual effects
      let margin = 5; // Base margin
      
      // Add margin for phosphor glow
      if (this.visualEffects.phosphor.enabled) {
        const phosphorGlow = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--phosphor-glow').trim() || '2px');
        margin = Math.max(margin, phosphorGlow);
      }
      
      // Add margin for chromatic aberration
      if (this.visualEffects.chromatic.enabled && this.visualEffects.chromatic.aberrationLevel > 0) {
        margin = Math.max(margin, this.visualEffects.chromatic.aberrationLevel + 2);
      }
      
      // Validate each waypoint
      for (let i = 0; i < waypoints.length; i++) {
        waypoints[i].x = Math.max(margin, Math.min(viewport.width - margin, waypoints[i].x));
        waypoints[i].y = Math.max(margin, Math.min(viewport.height - margin, waypoints[i].y));
      }
      
      return waypoints;
    } catch (error) {
      console.error('[VisualEnhancementIntegration] Error validating path:', error);
      return waypoints; // Return original waypoints if validation fails
    }
  }
  
  /**
   * Checks if a fragment is compatible with the current visual effects
   * @param {HTMLElement} fragment - The fragment element to check
   * @returns {boolean} Whether the fragment is compatible
   */
  isFragmentCompatibleWithVisualEffects(fragment) {
    if (!fragment) return false;
    
    try {
      // Check for required attributes
      if (!fragment.hasAttribute('data-birth-time')) {
        console.warn('[VisualEnhancementIntegration] Fragment missing data-birth-time attribute');
        return false;
      }
      
      // Check for compatibility with chromatic aberration
      if (this.visualEffects.chromatic.enabled && 
          this.visualEffects.corruption.intensity >= 0.6 && 
          !fragment.textContent) {
        console.warn('[VisualEnhancementIntegration] Fragment not compatible with chromatic aberration (no text content)');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[VisualEnhancementIntegration] Error checking fragment compatibility:', error);
      return false;
    }
  }
  
  /**
   * Records a karma event for fragment interaction
   * @param {HTMLElement} fragment - The fragment that was interacted with
   * @param {string} interactionType - The type of interaction
   */
  recordFragmentKarmaEvent(fragment, interactionType) {
    if (!fragment) return;
    
    try {
      // Get fragment zone type
      const zoneType = fragment.getAttribute('data-zone-type') || 'unknown';
      
      // Calculate karma impact based on zone type and interaction
      let karmaImpact = 0.1; // Base impact
      
      // Center zones have higher karma impact
      if (zoneType === 'center') {
        karmaImpact = 0.2;
      }
      
      // Record karma event
      consciousness.recordEvent('fragment_interaction', {
        interactionType,
        zoneType,
        karmaImpact,
        fragmentId: fragment.getAttribute('data-birth-time') || Date.now().toString(),
        visualState: {
          corruption: this.visualEffects.corruption.appliedClass,
          hasChromatic: fragment.classList.contains('chromatic-aberration'),
          hasDigitalNoise: fragment.classList.contains('digital-noise')
        }
      });
      
      console.log(`[VisualEnhancementIntegration] Recorded karma event for fragment interaction: ${interactionType}, impact: ${karmaImpact}`);
    } catch (error) {
      console.error('[VisualEnhancementIntegration] Error recording karma event:', error);
    }
  }
  
  /**
   * Gets the current visual effect state
   * @returns {Object} Current visual effect state
   */
  getVisualEffectState() {
    return {
      corruption: { ...this.visualEffects.corruption },
      phosphor: { ...this.visualEffects.phosphor },
      chromatic: { ...this.visualEffects.chromatic },
      light: { ...this.visualEffects.light },
      recognition: { ...this.recognitionState }
    };
  }
  
  /**
   * Destroys the integration module and cleans up resources
   */
  destroy() {
    // Clean up managers
    if (this.optimizationManager) {
      this.optimizationManager.destroy();
      this.optimizationManager = null;
    }
    
    // Run guardian cleanup
    this.guardian.cleanup();
    
    console.log('[VisualEnhancementIntegration] Resources cleaned up');
  }
}

// Export singleton instance
export const visualEnhancementIntegration = new VisualEnhancementIntegration();