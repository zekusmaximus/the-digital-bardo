/**
 * Manages cross-browser compatibility and fallback mechanisms for the positioning system
 * Provides detection for browser capabilities and implements fallbacks for edge cases
 * Enhanced with improved error handling for viewport edge cases and extreme aspect ratios
 */
import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class BrowserCompatibilityManager {
  constructor() {
    this.guardian = new ResourceGuardian();
    
    // Browser detection
    this.browserInfo = this.detectBrowser();
    
    // Viewport capabilities
    this.viewportCapabilities = this.detectViewportCapabilities();
    
    // Animation capabilities
    this.animationCapabilities = this.detectAnimationCapabilities();
    
    // Fallback settings
    this.fallbackSettings = {
      useSimplePositioning: false,
      useBasicAnimations: false,
      disableCenterTraversal: false,
      forceEdgeOnly: false,
      usePolyfills: false,
      adaptForExtremeAspectRatio: false,
      adaptForSmallViewport: false,
      useReducedAnimations: false,
      useEdgePositioningOnly: false
    };
    
    // Error tracking for fallback activation
    this.errorTracking = {
      positioningErrors: 0,
      pathCalculationErrors: 0,
      viewportErrors: 0,
      lastErrorTime: Date.now(),
      errorTimeWindow: 60000, // 1 minute window for error tracking
      errorThreshold: 5 // Number of errors before applying permanent fallbacks
    };
    
    // Apply browser-specific optimizations
    this.applyBrowserSpecificOptimizations();
    
    // Log browser detection
    console.log(`[BrowserCompatibilityManager] Detected browser: ${this.browserInfo.name} ${this.browserInfo.version} on ${this.browserInfo.os}`);
    console.log(`[BrowserCompatibilityManager] Viewport capabilities:`, this.viewportCapabilities);
    
    // Record browser detection event
    consciousness.recordEvent('browser_detected', {
      browser: this.browserInfo,
      viewport: this.viewportCapabilities,
      animation: this.animationCapabilities,
      fallbacks: this.fallbackSettings
    });
  }
  
  /**
   * Detects browser name, version and operating system
   */
  detectBrowser() {
    const userAgent = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';
    let os = 'Unknown';
    
    // Detect browser name and version
    if (userAgent.indexOf('Edge') > -1) {
      name = 'Microsoft Edge (Legacy)';
      version = userAgent.substring(userAgent.indexOf('Edge') + 5);
    } else if (userAgent.indexOf('Edg') > -1) {
      name = 'Microsoft Edge (Chromium)';
      version = userAgent.substring(userAgent.indexOf('Edg') + 4);
    } else if (userAgent.indexOf('Chrome') > -1) {
      name = 'Chrome';
      version = userAgent.substring(userAgent.indexOf('Chrome') + 7);
      version = version.substring(0, version.indexOf(' '));
    } else if (userAgent.indexOf('Firefox') > -1) {
      name = 'Firefox';
      version = userAgent.substring(userAgent.indexOf('Firefox') + 8);
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      name = 'Safari';
      version = userAgent.substring(userAgent.indexOf('Version') + 8);
      version = version.substring(0, version.indexOf(' '));
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
      name = 'Internet Explorer';
      if (userAgent.indexOf('MSIE') > -1) {
        version = userAgent.substring(userAgent.indexOf('MSIE') + 5);
        version = version.substring(0, version.indexOf(';'));
      } else {
        version = '11.0';
      }
    }
    
    // Clean up version string
    version = version.split(';')[0].trim();
    version = version.split(' ')[0].trim();
    
    // Detect operating system
    if (userAgent.indexOf('Windows') > -1) {
      os = 'Windows';
      if (userAgent.indexOf('Windows NT 10.0') > -1) os = 'Windows 10';
      else if (userAgent.indexOf('Windows NT 6.3') > -1) os = 'Windows 8.1';
      else if (userAgent.indexOf('Windows NT 6.2') > -1) os = 'Windows 8';
      else if (userAgent.indexOf('Windows NT 6.1') > -1) os = 'Windows 7';
    } else if (userAgent.indexOf('Mac') > -1) {
      os = 'macOS';
    } else if (userAgent.indexOf('Android') > -1) {
      os = 'Android';
    } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
      os = 'iOS';
    } else if (userAgent.indexOf('Linux') > -1) {
      os = 'Linux';
    }
    
    return { name, version, os };
  }
  
  /**
   * Detects viewport capabilities and limitations
   */
  detectViewportCapabilities() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Detect extreme aspect ratios
    const isExtremeAspectRatio = aspectRatio < 0.5 || aspectRatio > 3.0;
    
    // Detect very small viewports
    const isVerySmall = Math.min(width, height) < 300;
    
    // Detect very large viewports
    const isVeryLarge = Math.min(width, height) > 2000;
    
    // Detect high pixel density displays
    const isHighDensity = pixelRatio > 2;
    
    // Check for orientation lock support
    const hasOrientationLock = 'orientation' in screen && 'lock' in screen.orientation;
    
    // Check for resize observer support
    const hasResizeObserver = 'ResizeObserver' in window;
    
    // Check for intersection observer support
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    
    return {
      width,
      height,
      aspectRatio,
      pixelRatio,
      isExtremeAspectRatio,
      isVerySmall,
      isVeryLarge,
      isHighDensity,
      hasOrientationLock,
      hasResizeObserver,
      hasIntersectionObserver
    };
  }
  
  /**
   * Detects animation capabilities of the browser
   */
  detectAnimationCapabilities() {
    // Check for requestAnimationFrame support
    const hasRAF = 'requestAnimationFrame' in window;
    
    // Check for Web Animations API support
    const hasWebAnimations = 'animate' in document.createElement('div');
    
    // Check for transform support
    const hasTransform = 'transform' in document.createElement('div').style;
    
    // Check for CSS transitions support
    const hasTransitions = 'transition' in document.createElement('div').style;
    
    // Check for GPU acceleration support (approximate detection)
    const hasGPUAcceleration = hasTransform && 'perspective' in document.createElement('div').style;
    
    // Check for passive event listener support
    let hasPassiveEvents = false;
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: function() {
          hasPassiveEvents = true;
          return true;
        }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      hasPassiveEvents = false;
    }
    
    return {
      hasRAF,
      hasWebAnimations,
      hasTransform,
      hasTransitions,
      hasGPUAcceleration,
      hasPassiveEvents
    };
  }
  
  /**
   * Applies browser-specific optimizations and fallbacks
   */
  applyBrowserSpecificOptimizations() {
    // Internet Explorer fallbacks
    if (this.browserInfo.name.includes('Internet Explorer')) {
      this.fallbackSettings.useSimplePositioning = true;
      this.fallbackSettings.useBasicAnimations = true;
      this.fallbackSettings.disableCenterTraversal = true;
      this.fallbackSettings.usePolyfills = true;
      console.log('[BrowserCompatibilityManager] Applied Internet Explorer fallbacks');
    }
    
    // Safari-specific optimizations
    if (this.browserInfo.name === 'Safari') {
      // Safari has some issues with complex animations, use simpler ones
      if (parseFloat(this.browserInfo.version) < 14) {
        this.fallbackSettings.useBasicAnimations = true;
        console.log('[BrowserCompatibilityManager] Applied Safari animation fallbacks');
      }
    }
    
    // Firefox-specific optimizations
    if (this.browserInfo.name === 'Firefox') {
      // Firefox handles animations differently, adjust accordingly
      console.log('[BrowserCompatibilityManager] Applied Firefox optimizations');
    }
    
    // Handle extreme aspect ratios
    if (this.viewportCapabilities.isExtremeAspectRatio) {
      this.fallbackSettings.disableCenterTraversal = true;
      console.log('[BrowserCompatibilityManager] Applied extreme aspect ratio fallbacks');
    }
    
    // Handle very small viewports
    if (this.viewportCapabilities.isVerySmall) {
      this.fallbackSettings.useSimplePositioning = true;
      this.fallbackSettings.forceEdgeOnly = true;
      console.log('[BrowserCompatibilityManager] Applied small viewport fallbacks');
    }
    
    // Handle missing animation capabilities
    if (!this.animationCapabilities.hasRAF || !this.animationCapabilities.hasTransform) {
      this.fallbackSettings.useBasicAnimations = true;
      console.log('[BrowserCompatibilityManager] Applied animation capability fallbacks');
    }
    
    // Apply polyfills if needed
    if (this.fallbackSettings.usePolyfills) {
      this.applyPolyfills();
    }
  }
  
  /**
   * Applies necessary polyfills for older browsers
   */
  applyPolyfills() {
    // ResizeObserver polyfill
    if (!this.viewportCapabilities.hasResizeObserver) {
      console.log('[BrowserCompatibilityManager] ResizeObserver not supported, using fallback');
      // Simple resize event based fallback is implemented in handleViewportChanges
    }
    
    // IntersectionObserver polyfill
    if (!this.viewportCapabilities.hasIntersectionObserver) {
      console.log('[BrowserCompatibilityManager] IntersectionObserver not supported, using fallback');
      // Fallback is implemented in isElementVisible method
    }
    
    // requestAnimationFrame polyfill
    if (!this.animationCapabilities.hasRAF) {
      console.log('[BrowserCompatibilityManager] requestAnimationFrame not supported, using fallback');
      window.requestAnimationFrame = function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  }
  
  /**
   * Handles viewport changes with fallbacks for browsers without ResizeObserver
   * @param {Function} callback - Function to call when viewport changes
   * @returns {Function} Cleanup function
   */
  handleViewportChanges(callback) {
    let resizeObserver;
    let resizeTimeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
          aspectRatio: window.innerWidth / window.innerHeight
        };
        callback(viewport);
      }, 250); // Debounce resize events
    };
    
    if (this.viewportCapabilities.hasResizeObserver) {
      // Use ResizeObserver for more efficient resize detection
      resizeObserver = new ResizeObserver(entries => {
        handleResize();
      });
      resizeObserver.observe(document.documentElement);
    } else {
      // Fallback to window resize event
      window.addEventListener('resize', handleResize);
    }
    
    // Also handle orientation change events
    window.addEventListener('orientationchange', () => {
      // Use longer timeout for orientation changes
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
          aspectRatio: window.innerWidth / window.innerHeight
        };
        callback(viewport);
      }, 500); // Longer timeout for orientation changes
    });
    
    // Return cleanup function
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimeout);
    };
  }
  
  /**
   * Checks if an element is visible in the viewport with fallback for browsers without IntersectionObserver
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} Whether element is visible
   */
  isElementVisible(element) {
    if (this.viewportCapabilities.hasIntersectionObserver) {
      // Use IntersectionObserver API
      return new Promise(resolve => {
        const observer = new IntersectionObserver(entries => {
          resolve(entries[0].isIntersecting);
          observer.disconnect();
        });
        observer.observe(element);
      });
    } else {
      // Fallback to getBoundingClientRect
      return new Promise(resolve => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const isVisible = 
          rect.top <= windowHeight &&
          rect.left <= windowWidth &&
          rect.bottom >= 0 &&
          rect.right >= 0;
        
        resolve(isVisible);
      });
    }
  }
  
  /**
   * Provides fallback positioning for extreme aspect ratios
   * @param {Object} viewport - Current viewport dimensions
   * @returns {Object} Adjusted zone configuration
   */
  getExtremeAspectRatioFallback(viewport) {
    const aspectRatio = viewport.width / viewport.height;
    let config = {
      edgeMargin: 0.05,
      centerZoneSize: 0.4,
      transitionZoneWidth: 0.15
    };
    
    // Very wide viewport (ultrawide monitors, landscape mobile)
    if (aspectRatio > 2.5) {
      config = {
        edgeMargin: 0.03,
        centerZoneSize: 0.3,
        transitionZoneWidth: 0.2
      };
    }
    // Very tall viewport (portrait mobile)
    else if (aspectRatio < 0.5) {
      config = {
        edgeMargin: 0.04,
        centerZoneSize: 0.5,
        transitionZoneWidth: 0.1
      };
    }
    
    return config;
  }
  
  /**
   * Provides fallback for positioning calculation failures
   * @param {Error} error - The error that occurred
   * @param {Object} viewport - Current viewport dimensions
   * @returns {Object} Fallback position
   */
  getPositioningFallback(error, viewport) {
    console.warn('[BrowserCompatibilityManager] Positioning calculation failed:', error);
    
    // Log the error to consciousness
    consciousness.recordEvent('positioning_fallback_used', {
      error: error.message,
      viewport: {
        width: viewport.width,
        height: viewport.height,
        aspectRatio: viewport.width / viewport.height
      },
      browser: this.browserInfo
    });
    
    // Generate a safe fallback position
    const margin = Math.min(viewport.width, viewport.height) * 0.1;
    return {
      x: margin + Math.random() * (viewport.width - margin * 2),
      y: margin + Math.random() * (viewport.height - margin * 2)
    };
  }
  
  /**
   * Provides fallback for path calculation failures
   * @param {Error} error - The error that occurred
   * @param {Object} startPoint - Starting point
   * @param {Object} endPoint - Ending point
   * @returns {Array} Fallback waypoints
   */
  getPathCalculationFallback(error, startPoint, endPoint) {
    console.warn('[BrowserCompatibilityManager] Path calculation failed:', error);
    
    // Log the error to consciousness
    consciousness.recordEvent('path_fallback_used', {
      error: error.message,
      startPoint,
      endPoint,
      browser: this.browserInfo
    });
    
    // Generate a simple linear path as fallback
    return [
      { x: startPoint.x, y: startPoint.y },
      { x: (startPoint.x + endPoint.x) / 2, y: (startPoint.y + endPoint.y) / 2 },
      { x: endPoint.x, y: endPoint.y }
    ];
  }
  
  /**
   * Checks if the browser supports a specific feature
   * @param {string} feature - Feature to check
   * @returns {boolean} Whether the feature is supported
   */
  supportsFeature(feature) {
    switch (feature) {
      case 'centerTraversal':
        return !this.fallbackSettings.disableCenterTraversal;
      case 'complexAnimations':
        return !this.fallbackSettings.useBasicAnimations;
      case 'advancedPositioning':
        return !this.fallbackSettings.useSimplePositioning;
      case 'edgeOnly':
        return this.fallbackSettings.forceEdgeOnly;
      default:
        return true;
    }
  }
  
  /**
   * Gets browser-specific animation settings
   * @returns {Object} Animation settings
   */
  getAnimationSettings() {
    const settings = {
      useGPUAcceleration: this.animationCapabilities.hasGPUAcceleration,
      useTransforms: this.animationCapabilities.hasTransform,
      useTransitions: this.animationCapabilities.hasTransitions,
      useWebAnimations: this.animationCapabilities.hasWebAnimations && !this.fallbackSettings.useBasicAnimations,
      durationMultiplier: 1.0
    };
    
    // Adjust settings based on browser
    if (this.browserInfo.name === 'Safari') {
      settings.durationMultiplier = 1.1; // Safari needs slightly longer animations
    } else if (this.browserInfo.name.includes('Internet Explorer')) {
      settings.durationMultiplier = 0.8; // IE needs shorter animations
      settings.useGPUAcceleration = false;
    } else if (this.browserInfo.name === 'Firefox') {
      settings.useWebAnimations = false; // Firefox has issues with Web Animations API
    }
    
    return settings;
  }
  
  /**
   * Validates a position is within viewport bounds
   * @param {Object} position - Position to validate
   * @param {Object} viewport - Current viewport dimensions
   * @returns {Object} Validated position
   */
  validatePosition(position, viewport) {
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
      return this.getPositioningFallback(new Error('Invalid position'), viewport);
    }
    
    // Ensure position is within viewport bounds with margin
    const margin = 10;
    const x = Math.max(margin, Math.min(viewport.width - margin, position.x));
    const y = Math.max(margin, Math.min(viewport.height - margin, position.y));
    
    return { x, y };
  }
  
  /**
   * Tracks viewport-related errors and applies fallbacks if needed
   * @param {Error} error - The error that occurred
   * @param {Object} viewport - Current viewport dimensions
   */
  trackViewportError(error, viewport) {
    const now = Date.now();
    
    // Reset error count if outside time window
    if (now - this.errorTracking.lastErrorTime > this.errorTracking.errorTimeWindow) {
      this.errorTracking.viewportErrors = 0;
    }
    
    this.errorTracking.lastErrorTime = now;
    this.errorTracking.viewportErrors++;
    
    // Log the error
    console.warn(`[BrowserCompatibilityManager] Viewport error: ${error.message}`, viewport);
    
    // Apply permanent fallbacks if error threshold is exceeded
    if (this.errorTracking.viewportErrors >= this.errorTracking.errorThreshold) {
      console.warn(`[BrowserCompatibilityManager] Viewport error threshold exceeded (${this.errorTracking.viewportErrors} errors). Applying permanent fallbacks.`);
      
      // Apply appropriate fallbacks based on viewport characteristics
      if (viewport.aspectRatio < 0.5 || viewport.aspectRatio > 2.5) {
        this.fallbackSettings.adaptForExtremeAspectRatio = true;
        this.fallbackSettings.disableCenterTraversal = true;
      }
      
      if (Math.min(viewport.width, viewport.height) < 400) {
        this.fallbackSettings.adaptForSmallViewport = true;
        this.fallbackSettings.useSimplePositioning = true;
      }
      
      // Record fallback event
      consciousness.recordEvent('viewport_fallback_permanent', {
        errorCount: this.errorTracking.viewportErrors,
        viewport: {
          width: viewport.width,
          height: viewport.height,
          aspectRatio: viewport.aspectRatio
        },
        browser: this.browserInfo
      });
    }
    
    return this.getViewportFallbackConfig(viewport);
  }
  
  /**
   * Provides fallback configuration for problematic viewports
   * @param {Object} viewport - Current viewport dimensions
   * @returns {Object} Fallback configuration
   */
  getViewportFallbackConfig(viewport) {
    // Default safe configuration
    const fallbackConfig = {
      edgeMargin: 0.05,
      centerZoneSize: 0.3,
      transitionZoneWidth: 0.1,
      useEdgeOnly: Math.min(viewport.width, viewport.height) < 350,
      reducedWaypoints: true,
      simplifiedAnimations: true
    };
    
    // Record fallback usage
    consciousness.recordEvent('viewport_fallback_used', {
      viewport: {
        width: viewport.width,
        height: viewport.height,
        aspectRatio: viewport.aspectRatio
      },
      fallbackConfig: fallbackConfig,
      browser: this.browserInfo
    });
    
    return fallbackConfig;
  }
  
  /**
   * Handles extreme aspect ratios with adaptive zone configurations
   * @param {Object} viewport - Current viewport dimensions
   * @returns {Object} Optimized zone configuration for the aspect ratio
   */
  getAdaptiveZoneConfig(viewport) {
    const aspectRatio = viewport.width / viewport.height;
    let config = {
      edgeMargin: 0.05,
      centerZoneSize: 0.4,
      transitionZoneWidth: 0.15,
      zoneWeights: {
        center: 1.5,
        edge: 1.0,
        transition: 1.2
      }
    };
    
    try {
      // Very wide viewport (ultrawide monitors, landscape mobile)
      if (aspectRatio > 2.5) {
        config = {
          edgeMargin: 0.03,
          centerZoneSize: 0.3,
          transitionZoneWidth: 0.2,
          zoneWeights: {
            center: 1.2,
            edge: 1.3,
            transition: 1.5 // Favor transition zones in wide viewports
          }
        };
      }
      // Wide viewport
      else if (aspectRatio > 1.8) {
        config = {
          edgeMargin: 0.04,
          centerZoneSize: 0.35,
          transitionZoneWidth: 0.18,
          zoneWeights: {
            center: 1.3,
            edge: 1.2,
            transition: 1.4
          }
        };
      }
      // Square-ish viewport
      else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
        config = {
          edgeMargin: 0.05,
          centerZoneSize: 0.45,
          transitionZoneWidth: 0.12,
          zoneWeights: {
            center: 1.6,
            edge: 0.9,
            transition: 1.1
          }
        };
      }
      // Tall viewport
      else if (aspectRatio < 0.8 && aspectRatio >= 0.5) {
        config = {
          edgeMargin: 0.04,
          centerZoneSize: 0.42,
          transitionZoneWidth: 0.12,
          zoneWeights: {
            center: 1.4,
            edge: 1.1,
            transition: 1.3
          }
        };
      }
      // Very tall viewport (portrait mobile)
      else if (aspectRatio < 0.5) {
        config = {
          edgeMargin: 0.04,
          centerZoneSize: 0.5,
          transitionZoneWidth: 0.1,
          zoneWeights: {
            center: 1.2,
            edge: 1.4,
            transition: 1.1 // Less emphasis on transition zones in tall viewports
          }
        };
      }
      
      // Adjust for small viewports
      if (Math.min(viewport.width, viewport.height) < 400) {
        config.edgeMargin = Math.max(0.06, config.edgeMargin);
        config.centerZoneSize = Math.min(0.35, config.centerZoneSize);
        config.zoneWeights.edge += 0.2; // Favor edge positioning in small viewports
      }
      
      return config;
    } catch (error) {
      // If anything goes wrong, track the error and return fallback config
      return this.trackViewportError(error, viewport);
    }
  }
  
  /**
   * Validates and adjusts zone boundaries to ensure they're within viewport
   * @param {Object} zone - Zone with boundaries to validate
   * @param {Object} viewport - Current viewport dimensions
   * @returns {Object} Validated zone
   */
  validateZoneBoundaries(zone, viewport) {
    if (!zone || !zone.bounds) {
      console.warn('[BrowserCompatibilityManager] Invalid zone provided for validation');
      return null;
    }
    
    try {
      const margin = 5; // Minimum margin from viewport edge
      const minZoneSize = 30; // Minimum zone size in pixels
      
      // Create a copy of the zone to avoid modifying the original
      const validatedZone = {
        ...zone,
        bounds: {
          x: { ...zone.bounds.x },
          y: { ...zone.bounds.y }
        }
      };
      
      // Ensure minimum and maximum values are in correct order
      if (validatedZone.bounds.x.min > validatedZone.bounds.x.max) {
        [validatedZone.bounds.x.min, validatedZone.bounds.x.max] = 
          [validatedZone.bounds.x.max, validatedZone.bounds.x.min];
      }
      
      if (validatedZone.bounds.y.min > validatedZone.bounds.y.max) {
        [validatedZone.bounds.y.min, validatedZone.bounds.y.max] = 
          [validatedZone.bounds.y.max, validatedZone.bounds.y.min];
      }
      
      // Ensure zone is within viewport bounds
      validatedZone.bounds.x.min = Math.max(margin, Math.min(viewport.width - margin - minZoneSize, validatedZone.bounds.x.min));
      validatedZone.bounds.x.max = Math.max(validatedZone.bounds.x.min + minZoneSize, Math.min(viewport.width - margin, validatedZone.bounds.x.max));
      
      validatedZone.bounds.y.min = Math.max(margin, Math.min(viewport.height - margin - minZoneSize, validatedZone.bounds.y.min));
      validatedZone.bounds.y.max = Math.max(validatedZone.bounds.y.min + minZoneSize, Math.min(viewport.height - margin, validatedZone.bounds.y.max));
      
      return validatedZone;
    } catch (error) {
      console.warn('[BrowserCompatibilityManager] Error validating zone boundaries:', error);
      
      // Create a safe fallback zone in the center of the viewport
      const centerX = viewport.width / 2;
      const centerY = viewport.height / 2;
      const size = Math.min(100, Math.min(viewport.width, viewport.height) / 4);
      
      return {
        ...zone,
        bounds: {
          x: { min: centerX - size, max: centerX + size },
          y: { min: centerY - size, max: centerY + size }
        }
      };
    }
  }
  
  /**
   * Provides browser-specific path generation settings
   * @returns {Object} Path generation settings
   */
  getPathGenerationSettings() {
    const settings = {
      maxWaypoints: 5,
      useComplexPaths: !this.fallbackSettings.useBasicAnimations,
      useCurvedPaths: !this.fallbackSettings.useBasicAnimations,
      useOrbitals: !this.fallbackSettings.useBasicAnimations && this.animationCapabilities.hasGPUAcceleration,
      pathVariety: 1.0, // 0.0 to 1.0, higher means more variety
      waypointSpacing: 'adaptive' // 'even', 'adaptive', or 'clustered'
    };
    
    // Adjust settings based on browser and device capabilities
    if (this.browserInfo.name === 'Safari') {
      settings.maxWaypoints = 4;
      settings.useOrbitals = false; // Safari struggles with orbital animations
    } else if (this.browserInfo.name.includes('Internet Explorer')) {
      settings.maxWaypoints = 3;
      settings.useComplexPaths = false;
      settings.useCurvedPaths = false;
      settings.pathVariety = 0.3;
    } else if (this.browserInfo.name === 'Firefox') {
      settings.pathVariety = 0.8; // Slightly less variety for Firefox
    }
    
    // Adjust for mobile devices
    if (this.browserInfo.os === 'Android' || this.browserInfo.os === 'iOS') {
      settings.maxWaypoints = Math.min(settings.maxWaypoints, 4);
      settings.useOrbitals = false; // Disable orbitals on mobile for performance
      settings.pathVariety = 0.7; // Reduce variety on mobile
    }
    
    // Adjust for viewport size
    if (this.viewportCapabilities.isVerySmall) {
      settings.maxWaypoints = 3;
      settings.useComplexPaths = false;
      settings.pathVariety = 0.5;
    }
    
    // Adjust for extreme aspect ratios
    if (this.viewportCapabilities.isExtremeAspectRatio) {
      settings.useCurvedPaths = false; // Use simpler paths for extreme aspect ratios
    }
    
    return settings;
  }
  
  /**
   * Handles browser-specific touch events and interactions
   * @returns {Object} Touch interaction settings
   */
  getTouchInteractionSettings() {
    const settings = {
      useTouchEvents: 'ontouchstart' in window,
      usePointerEvents: 'PointerEvent' in window,
      touchZoneSize: 44, // Minimum touch target size in pixels (Apple's recommendation)
      usePassiveListeners: this.animationCapabilities.hasPassiveEvents,
      preventDefaultForScrolling: true
    };
    
    // Adjust for specific browsers
    if (this.browserInfo.name === 'Safari' && this.browserInfo.os === 'iOS') {
      settings.preventDefaultForScrolling = false; // iOS Safari has specific scrolling behavior
    }
    
    // Adjust for Android
    if (this.browserInfo.os === 'Android') {
      settings.touchZoneSize = 48; // Android's recommended touch target size
    }
    
    return settings;
  }
  
  /**
   * Provides fallback for animation timing issues
   * @param {number} duration - Original animation duration in ms
   * @param {string} type - Animation type ('movement', 'fade', 'transform')
   * @returns {number} Adjusted duration
   */
  getAdjustedAnimationDuration(duration, type = 'movement') {
    let adjustedDuration = duration;
    
    // Apply browser-specific duration adjustments
    const settings = this.getAnimationSettings();
    adjustedDuration *= settings.durationMultiplier;
    
    // Apply animation type specific adjustments
    switch (type) {
      case 'fade':
        // Fade animations often need to be quicker
        adjustedDuration *= 0.8;
        break;
      case 'transform':
        // Transform animations might need more time
        adjustedDuration *= 1.1;
        break;
    }
    
    // Ensure minimum and maximum durations
    const minDuration = 100; // ms
    const maxDuration = 5000; // ms
    
    return Math.max(minDuration, Math.min(maxDuration, adjustedDuration));
  }
  
  /**
   * Detects if reduced motion is preferred by the user
   * @returns {boolean} Whether reduced motion is preferred
   */
  isReducedMotionPreferred() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Gets accessibility settings for animations and positioning
   * @returns {Object} Accessibility settings
   */
  getAccessibilitySettings() {
    return {
      reduceMotion: this.isReducedMotionPreferred(),
      highContrast: window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches,
      reduceTransparency: window.matchMedia && window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
      useSimpleAnimations: this.isReducedMotionPreferred() || this.fallbackSettings.useBasicAnimations,
      minContrastRatio: 4.5 // WCAG AA standard
    };
  }
  
  /**
   * Destroys the manager and cleans up resources
   */
  destroy() {
    this.guardian.cleanup();
    console.log('[BrowserCompatibilityManager] Resources cleaned up');
  }
}