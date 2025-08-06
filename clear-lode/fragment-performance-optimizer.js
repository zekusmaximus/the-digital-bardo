/**
 * @file FragmentPerformanceOptimizer - Performance optimization system for enhanced UX features
 * 
 * This class implements performance optimizations for the clear-lode UX improvements:
 * - Fragment pooling to reduce garbage collection from repositioning
 * - Corruption effect optimization for smooth performance
 * - Performance monitoring for visual feedback systems
 * - Tier-based feature scaling for different device capabilities
 * 
 * Requirements addressed: Task 9 - Performance optimization for enhanced UX features
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

/**
 * Performance optimization system for fragment-based UX enhancements
 */
export class FragmentPerformanceOptimizer {
    constructor(config = {}) {
        this.guardian = new ResourceGuardian();
        
        // Performance configuration
        this.config = {
            // Fragment pooling settings
            pooling: {
                enabled: true,
                maxPoolSize: 50,
                preAllocateCount: 10,
                cleanupInterval: 30000 // 30 seconds
            },
            
            // Corruption effect optimization
            corruption: {
                batchSize: 5, // Process corruption in batches
                throttleMs: 16, // ~60fps throttling
                useRequestAnimationFrame: true,
                maxConcurrentEffects: 10
            },
            
            // Performance monitoring
            monitoring: {
                enabled: true,
                sampleInterval: 1000, // 1 second
                performanceThresholds: {
                    fps: 30, // Minimum acceptable FPS
                    memoryMB: 100, // Maximum memory usage in MB
                    fragmentCount: 20 // Maximum concurrent fragments
                }
            },
            
            // Tier-based scaling
            tiers: {
                high: {
                    maxFragments: 20,
                    corruptionQuality: 'high',
                    animationComplexity: 'full',
                    effectsEnabled: true
                },
                medium: {
                    maxFragments: 12,
                    corruptionQuality: 'medium',
                    animationComplexity: 'reduced',
                    effectsEnabled: true
                },
                low: {
                    maxFragments: 6,
                    corruptionQuality: 'low',
                    animationComplexity: 'minimal',
                    effectsEnabled: false
                }
            },
            
            ...config
        };
        
        // Fragment pool for reuse
        this.fragmentPool = {
            available: [],
            inUse: new Set(),
            totalCreated: 0,
            totalReused: 0
        };
        
        // Corruption effect batching
        this.corruptionQueue = [];
        this.corruptionBatchTimeout = null;
        this.activeCorruptionEffects = new Set();
        
        // Performance monitoring state
        this.performanceMetrics = {
            fps: 60,
            memoryUsage: 0,
            fragmentCount: 0,
            corruptionEffectsActive: 0,
            lastFrameTime: performance.now(),
            frameCount: 0,
            averageFrameTime: 16.67 // Target 60fps
        };
        
        // Current performance tier
        this.currentTier = this.detectPerformanceTier();
        
        // Initialize systems
        this.initializeFragmentPool();
        this.initializePerformanceMonitoring();
        this.initializeCorruptionOptimization();
        
        console.log('[FragmentPerformanceOptimizer] Initialized with tier:', this.currentTier);
    }
    
    /**
     * Detects the current device performance tier
     */
    detectPerformanceTier() {
        const deviceMemory = navigator.deviceMemory || 2;
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const connection = navigator.connection;
        
        // Check for performance indicators
        let score = 0;
        
        // Memory scoring
        if (deviceMemory >= 8) score += 3;
        else if (deviceMemory >= 4) score += 2;
        else score += 1;
        
        // CPU scoring
        if (hardwareConcurrency >= 8) score += 3;
        else if (hardwareConcurrency >= 4) score += 2;
        else score += 1;
        
        // Connection scoring (if available)
        if (connection) {
            if (connection.effectiveType === '4g') score += 2;
            else if (connection.effectiveType === '3g') score += 1;
        }
        
        // Determine tier
        if (score >= 7) return 'high';
        if (score >= 4) return 'medium';
        return 'low';
    }
    
    /**
     * Initializes the fragment pooling system
     */
    initializeFragmentPool() {
        if (!this.config.pooling.enabled) return;
        
        // Pre-allocate fragments
        for (let i = 0; i < this.config.pooling.preAllocateCount; i++) {
            const fragment = this.createPooledFragment();
            this.fragmentPool.available.push(fragment);
        }
        
        // Set up periodic cleanup
        const cleanupInterval = setInterval(() => {
            this.cleanupFragmentPool();
        }, this.config.pooling.cleanupInterval);
        
        this.guardian.register(cleanupInterval, (id) => clearInterval(id));
        
        console.log(`[FragmentPerformanceOptimizer] Fragment pool initialized with ${this.config.pooling.preAllocateCount} fragments`);
    }
    
    /**
     * Creates a pooled fragment element
     */
    createPooledFragment() {
        const fragment = document.createElement('div');
        fragment.className = 'consciousness-fragment pooled';
        fragment.style.position = 'absolute';
        fragment.style.visibility = 'hidden';
        fragment.dataset.pooled = 'true';
        fragment.dataset.poolId = Date.now() + Math.random().toString(36).substr(2, 9);
        
        this.fragmentPool.totalCreated++;
        return fragment;
    }
    
    /**
     * Gets a fragment from the pool or creates a new one
     */
    getPooledFragment() {
        if (!this.config.pooling.enabled) {
            return this.createPooledFragment();
        }
        
        let fragment;
        
        if (this.fragmentPool.available.length > 0) {
            fragment = this.fragmentPool.available.pop();
            this.fragmentPool.totalReused++;
        } else {
            fragment = this.createPooledFragment();
        }
        
        // Reset fragment state
        this.resetFragmentState(fragment);
        this.fragmentPool.inUse.add(fragment);
        
        return fragment;
    }
    
    /**
     * Returns a fragment to the pool
     */
    returnFragmentToPool(fragment) {
        if (!this.config.pooling.enabled || !fragment.dataset.pooled) {
            if (fragment.parentNode) {
                fragment.remove();
            }
            return;
        }
        
        // Remove from in-use set
        this.fragmentPool.inUse.delete(fragment);
        
        // Reset and hide fragment
        this.resetFragmentState(fragment);
        fragment.style.visibility = 'hidden';
        
        // Return to pool if under limit
        if (this.fragmentPool.available.length < this.config.pooling.maxPoolSize) {
            this.fragmentPool.available.push(fragment);
        } else {
            // Pool is full, remove from DOM
            if (fragment.parentNode) {
                fragment.remove();
            }
        }
    }
    
    /**
     * Resets fragment state for reuse
     */
    resetFragmentState(fragment) {
        // Clear content and styles
        fragment.textContent = '';
        fragment.className = 'consciousness-fragment pooled';
        fragment.style.visibility = 'visible';
        fragment.style.opacity = '1';
        fragment.style.transform = '';
        fragment.style.transition = '';
        
        // Clear data attributes except pool-related ones
        const poolId = fragment.dataset.poolId;
        const pooled = fragment.dataset.pooled;
        
        // Clear all data attributes
        Object.keys(fragment.dataset).forEach(key => {
            if (key !== 'poolId' && key !== 'pooled') {
                delete fragment.dataset[key];
            }
        });
        
        // Restore pool attributes
        fragment.dataset.poolId = poolId;
        fragment.dataset.pooled = pooled;
        
        // Remove event listeners by cloning
        const newFragment = fragment.cloneNode(false);
        if (fragment.parentNode) {
            fragment.parentNode.replaceChild(newFragment, fragment);
        }
        
        return newFragment;
    }
    
    /**
     * Cleans up the fragment pool
     */
    cleanupFragmentPool() {
        const maxAge = 60000; // 1 minute
        const now = Date.now();
        
        // Remove old unused fragments
        this.fragmentPool.available = this.fragmentPool.available.filter(fragment => {
            const age = now - parseInt(fragment.dataset.poolId.split('.')[0]);
            if (age > maxAge) {
                if (fragment.parentNode) {
                    fragment.remove();
                }
                return false;
            }
            return true;
        });
        
        console.log(`[FragmentPerformanceOptimizer] Pool cleanup: ${this.fragmentPool.available.length} available, ${this.fragmentPool.inUse.size} in use`);
    }
    
    /**
     * Initializes corruption effect optimization
     */
    initializeCorruptionOptimization() {
        // Set up batched corruption processing
        this.processCorruptionBatch = this.processCorruptionBatch.bind(this);
        
        console.log('[FragmentPerformanceOptimizer] Corruption optimization initialized');
    }
    
    /**
     * Optimizes corruption effect application
     */
    optimizeCorruptionEffect(fragment, corruptionData, priority = 'normal') {
        if (!this.config.corruption.useRequestAnimationFrame) {
            this.applyCorruptionImmediate(fragment, corruptionData);
            return;
        }
        
        // Add to corruption queue for batched processing
        this.corruptionQueue.push({
            fragment,
            corruptionData,
            priority,
            timestamp: performance.now()
        });
        
        // Schedule batch processing
        if (!this.corruptionBatchTimeout) {
            this.corruptionBatchTimeout = requestAnimationFrame(this.processCorruptionBatch);
        }
    }
    
    /**
     * Processes corruption effects in batches
     */
    processCorruptionBatch() {
        const startTime = performance.now();
        const maxBatchTime = this.config.corruption.throttleMs;
        const batchSize = this.config.corruption.batchSize;
        
        let processed = 0;
        
        while (this.corruptionQueue.length > 0 && processed < batchSize) {
            const item = this.corruptionQueue.shift();
            
            // Check if fragment is still valid
            if (item.fragment.parentNode) {
                this.applyCorruptionImmediate(item.fragment, item.corruptionData);
                processed++;
            }
            
            // Check time limit
            if (performance.now() - startTime > maxBatchTime) {
                break;
            }
        }
        
        // Schedule next batch if queue not empty
        this.corruptionBatchTimeout = null;
        if (this.corruptionQueue.length > 0) {
            this.corruptionBatchTimeout = requestAnimationFrame(this.processCorruptionBatch);
        }
        
        // Update metrics
        this.performanceMetrics.corruptionEffectsActive = this.activeCorruptionEffects.size;
    }
    
    /**
     * Applies corruption effect immediately
     */
    applyCorruptionImmediate(fragment, corruptionData) {
        if (this.activeCorruptionEffects.size >= this.config.corruption.maxConcurrentEffects) {
            return; // Skip if too many concurrent effects
        }
        
        const effectId = fragment.dataset.poolId || fragment.dataset.fragmentId;
        this.activeCorruptionEffects.add(effectId);
        
        try {
            // Apply corruption based on current tier
            const tierConfig = this.config.tiers[this.currentTier];
            this.applyTieredCorruption(fragment, corruptionData, tierConfig);
            
        } catch (error) {
            console.warn('[FragmentPerformanceOptimizer] Corruption effect error:', error);
        } finally {
            // Clean up after a delay
            setTimeout(() => {
                this.activeCorruptionEffects.delete(effectId);
            }, 1000);
        }
    }
    
    /**
     * Applies corruption effects based on performance tier
     */
    applyTieredCorruption(fragment, corruptionData, tierConfig) {
        const corruptionLevel = corruptionData.corruptionLevel || 0;
        
        switch (tierConfig.corruptionQuality) {
            case 'high':
                this.applyHighQualityCorruption(fragment, corruptionLevel);
                break;
            case 'medium':
                this.applyMediumQualityCorruption(fragment, corruptionLevel);
                break;
            case 'low':
                this.applyLowQualityCorruption(fragment, corruptionLevel);
                break;
        }
        
        // Apply tier-specific effects
        if (tierConfig.effectsEnabled) {
            this.applyVisualEffects(fragment, corruptionLevel, tierConfig.animationComplexity);
        }
    }
    
    /**
     * Applies high-quality corruption effects
     */
    applyHighQualityCorruption(fragment, level) {
        // Full corruption with all effects
        fragment.style.setProperty('--corruption-intensity', level);
        fragment.style.setProperty('--corruption-level', level);
        
        if (level > 0.3) fragment.classList.add('corrupted-text');
        if (level > 0.5) fragment.classList.add('chromatic-aberration');
        if (level > 0.7) fragment.classList.add('zalgo');
        if (level > 0.9) fragment.classList.add('digital-noise');
    }
    
    /**
     * Applies medium-quality corruption effects
     */
    applyMediumQualityCorruption(fragment, level) {
        // Reduced corruption effects
        fragment.style.setProperty('--corruption-intensity', level * 0.8);
        fragment.style.setProperty('--corruption-level', level);
        
        if (level > 0.4) fragment.classList.add('corrupted-text');
        if (level > 0.7) fragment.classList.add('chromatic-aberration');
    }
    
    /**
     * Applies low-quality corruption effects
     */
    applyLowQualityCorruption(fragment, level) {
        // Minimal corruption effects
        fragment.style.setProperty('--corruption-intensity', level * 0.5);
        fragment.style.setProperty('--corruption-level', level);
        
        if (level > 0.6) fragment.classList.add('corrupted-text');
    }
    
    /**
     * Applies visual effects based on animation complexity
     */
    applyVisualEffects(fragment, level, complexity) {
        switch (complexity) {
            case 'full':
                // All animations enabled
                fragment.style.transition = 'all 0.3s ease-out';
                break;
            case 'reduced':
                // Limited animations
                fragment.style.transition = 'opacity 0.2s ease-out';
                break;
            case 'minimal':
                // No animations
                fragment.style.transition = 'none';
                break;
        }
    }
    
    /**
     * Initializes performance monitoring
     */
    initializePerformanceMonitoring() {
        if (!this.config.monitoring.enabled) return;
        
        // Set up FPS monitoring
        this.startFPSMonitoring();
        
        // Set up memory monitoring
        this.startMemoryMonitoring();
        
        // Set up performance adjustment
        this.startPerformanceAdjustment();
        
        console.log('[FragmentPerformanceOptimizer] Performance monitoring initialized');
    }
    
    /**
     * Starts FPS monitoring
     */
    startFPSMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            const currentTime = performance.now();
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.fps = frameCount;
                this.performanceMetrics.averageFrameTime = 1000 / frameCount;
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    /**
     * Starts memory monitoring
     */
    startMemoryMonitoring() {
        const monitorMemory = () => {
            if (performance.memory) {
                this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024); // MB
            }
            
            // Update fragment count
            this.performanceMetrics.fragmentCount = document.querySelectorAll('.consciousness-fragment').length;
        };
        
        const memoryInterval = setInterval(monitorMemory, this.config.monitoring.sampleInterval);
        this.guardian.register(memoryInterval, (id) => clearInterval(id));
    }
    
    /**
     * Starts automatic performance adjustment
     */
    startPerformanceAdjustment() {
        const adjustPerformance = () => {
            const metrics = this.performanceMetrics;
            const thresholds = this.config.monitoring.performanceThresholds;
            
            let shouldDowngrade = false;
            let shouldUpgrade = true;
            
            // Check performance thresholds
            if (metrics.fps < thresholds.fps) {
                shouldDowngrade = true;
                shouldUpgrade = false;
            }
            
            if (metrics.memoryUsage > thresholds.memoryMB) {
                shouldDowngrade = true;
                shouldUpgrade = false;
            }
            
            if (metrics.fragmentCount > thresholds.fragmentCount) {
                shouldDowngrade = true;
                shouldUpgrade = false;
            }
            
            // Adjust tier if needed
            if (shouldDowngrade && this.currentTier !== 'low') {
                this.downgradeTier();
            } else if (shouldUpgrade && this.currentTier !== 'high' && this.canUpgradeTier()) {
                this.upgradeTier();
            }
        };
        
        const adjustmentInterval = setInterval(adjustPerformance, this.config.monitoring.sampleInterval * 5);
        this.guardian.register(adjustmentInterval, (id) => clearInterval(id));
    }
    
    /**
     * Downgrades performance tier
     */
    downgradeTier() {
        const tiers = ['high', 'medium', 'low'];
        const currentIndex = tiers.indexOf(this.currentTier);
        
        if (currentIndex < tiers.length - 1) {
            this.currentTier = tiers[currentIndex + 1];
            this.applyTierSettings();
            
            consciousness.recordEvent('performance_tier_downgraded', {
                newTier: this.currentTier,
                metrics: { ...this.performanceMetrics },
                timestamp: Date.now()
            });
            
            console.log(`[FragmentPerformanceOptimizer] Performance tier downgraded to: ${this.currentTier}`);
        }
    }
    
    /**
     * Upgrades performance tier
     */
    upgradeTier() {
        const tiers = ['high', 'medium', 'low'];
        const currentIndex = tiers.indexOf(this.currentTier);
        
        if (currentIndex > 0) {
            this.currentTier = tiers[currentIndex - 1];
            this.applyTierSettings();
            
            consciousness.recordEvent('performance_tier_upgraded', {
                newTier: this.currentTier,
                metrics: { ...this.performanceMetrics },
                timestamp: Date.now()
            });
            
            console.log(`[FragmentPerformanceOptimizer] Performance tier upgraded to: ${this.currentTier}`);
        }
    }
    
    /**
     * Checks if tier can be upgraded
     */
    canUpgradeTier() {
        const metrics = this.performanceMetrics;
        const thresholds = this.config.monitoring.performanceThresholds;
        
        return metrics.fps > thresholds.fps * 1.2 &&
               metrics.memoryUsage < thresholds.memoryMB * 0.8 &&
               metrics.fragmentCount < thresholds.fragmentCount * 0.8;
    }
    
    /**
     * Applies current tier settings
     */
    applyTierSettings() {
        const tierConfig = this.config.tiers[this.currentTier];
        
        // Notify other systems of tier change
        document.dispatchEvent(new CustomEvent('performance-tier-changed', {
            detail: {
                tier: this.currentTier,
                config: tierConfig
            }
        }));
    }
    
    /**
     * Gets current performance statistics
     */
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            currentTier: this.currentTier,
            fragmentPool: {
                available: this.fragmentPool.available.length,
                inUse: this.fragmentPool.inUse.size,
                totalCreated: this.fragmentPool.totalCreated,
                totalReused: this.fragmentPool.totalReused,
                reuseRatio: this.fragmentPool.totalReused / Math.max(1, this.fragmentPool.totalCreated)
            },
            corruptionQueue: {
                pending: this.corruptionQueue.length,
                active: this.activeCorruptionEffects.size
            }
        };
    }
    
    /**
     * Optimizes fragment positioning for performance
     */
    optimizeFragmentPositioning(fragments) {
        if (!Array.isArray(fragments)) return;
        
        const tierConfig = this.config.tiers[this.currentTier];
        
        // Limit fragment count based on tier
        if (fragments.length > tierConfig.maxFragments) {
            const excessFragments = fragments.slice(tierConfig.maxFragments);
            excessFragments.forEach(fragment => {
                this.returnFragmentToPool(fragment);
            });
        }
        
        // Optimize positioning calculations
        fragments.slice(0, tierConfig.maxFragments).forEach(fragment => {
            this.optimizeFragmentCalculations(fragment);
        });
    }
    
    /**
     * Optimizes calculations for a single fragment
     */
    optimizeFragmentCalculations(fragment) {
        // Cache expensive calculations
        if (!fragment.dataset.cachedBounds) {
            const rect = fragment.getBoundingClientRect();
            fragment.dataset.cachedBounds = JSON.stringify({
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                timestamp: performance.now()
            });
        }
        
        // Use cached bounds if recent (within 100ms)
        const cached = JSON.parse(fragment.dataset.cachedBounds);
        if (performance.now() - cached.timestamp > 100) {
            delete fragment.dataset.cachedBounds;
        }
    }
    
    /**
     * Destroys the performance optimizer
     */
    destroy() {
        console.log('[FragmentPerformanceOptimizer] Destroying performance optimizer...');
        
        // Clear corruption queue
        this.corruptionQueue = [];
        if (this.corruptionBatchTimeout) {
            cancelAnimationFrame(this.corruptionBatchTimeout);
        }
        
        // Clean up fragment pool
        this.fragmentPool.available.forEach(fragment => {
            if (fragment.parentNode) {
                fragment.remove();
            }
        });
        this.fragmentPool.available = [];
        this.fragmentPool.inUse.clear();
        
        // Clean up resources
        this.guardian.cleanupAll();
        
        consciousness.recordEvent('fragment_performance_optimizer_destroyed', {
            finalStats: this.getPerformanceStats()
        });
        
        console.log('[FragmentPerformanceOptimizer] Destroyed');
    }
}