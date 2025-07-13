/**
 * Visual Performance Manager - The Digital Bardo
 * Manages visual effect intensity based on device capabilities and user preferences
 * Integrates with DigitalConsciousness state management for dynamic scaling
 */

class VisualPerformanceManager {
    constructor() {
        this.performanceTier = 'medium';
        this.frameRate = 60;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.isMonitoring = false;
        this.effectScaling = {
            high: 1.0,
            medium: 0.7,
            low: 0.4
        };
        
        // Performance thresholds
        this.thresholds = {
            highTier: {
                minFPS: 55,
                maxMemory: 2048, // MB
                minCores: 4,
                gpuTier: 2
            },
            mediumTier: {
                minFPS: 30,
                maxMemory: 1024,
                minCores: 2,
                gpuTier: 1
            }
        };
        
        this.effectRegistry = new Map();
        this.activeEffects = new Set();
        this.adaptiveSettings = {
            phosphorIntensity: 1.0,
            corruptionComplexity: 1.0,
            lightParticleCount: 1.0,
            animationDuration: 1.0,
            filterComplexity: 1.0
        };
        
        this.init();
    }
    
    async init() {
        await this.detectCapabilities();
        this.setupPerformanceMonitoring();
        this.registerEffectProfiles();
        this.bindToConsciousness();
        
        console.log(`[VisualPerformanceManager] Initialized with ${this.performanceTier} tier`);
    }
    
    async detectCapabilities() {
        const capabilities = {
            cores: navigator.hardwareConcurrency || 2,
            memory: navigator.deviceMemory || 4,
            gpu: await this.detectGPUTier(),
            connection: this.getConnectionQuality(),
            battery: await this.getBatteryInfo()
        };
        
        this.performanceTier = this.calculateTier(capabilities);
        this.updateCSSVariables();
        
        return capabilities;
    }
    
    async detectGPUTier() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            
            if (!gl) return 0;
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                
                // High-end GPU detection
                if (/RTX|GTX 1[6-9]|GTX 20|GTX 30|GTX 40|RX 6|RX 7|M1|M2|M3/.test(renderer)) {
                    return 3;
                }
                // Mid-range GPU detection
                if (/GTX|RX|Intel Iris|Radeon/.test(renderer)) {
                    return 2;
                }
                // Integrated graphics
                return 1;
            }
            
            // Fallback performance test
            const start = performance.now();
            const vertices = new Float32Array(10000);
            for (let i = 0; i < vertices.length; i++) {
                vertices[i] = Math.random();
            }
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            const duration = performance.now() - start;
            
            return duration < 5 ? 2 : 1;
        } catch (error) {
            console.warn('[VisualPerformanceManager] GPU detection failed:', error);
            return 1;
        }
    }
    
    getConnectionQuality() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            switch (effectiveType) {
                case '4g': return 3;
                case '3g': return 2;
                case '2g': return 1;
                default: return 2;
            }
        }
        return 2; // Default to medium
    }
    
    async getBatteryInfo() {
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                return {
                    level: battery.level,
                    charging: battery.charging
                };
            }
        } catch (error) {
            console.warn('[VisualPerformanceManager] Battery API not available');
        }
        return { level: 1, charging: true };
    }
    
    calculateTier(capabilities) {
        let score = 0;
        
        // CPU cores weight: 25%
        score += (capabilities.cores >= this.thresholds.highTier.minCores) ? 25 : 
                 (capabilities.cores >= this.thresholds.mediumTier.minCores) ? 15 : 5;
        
        // Memory weight: 20%
        score += (capabilities.memory >= this.thresholds.highTier.maxMemory) ? 20 : 
                 (capabilities.memory >= this.thresholds.mediumTier.maxMemory) ? 12 : 4;
        
        // GPU weight: 30%
        score += capabilities.gpu >= this.thresholds.highTier.gpuTier ? 30 : 
                 capabilities.gpu >= this.thresholds.mediumTier.gpuTier ? 18 : 6;
        
        // Connection weight: 15%
        score += capabilities.connection >= 3 ? 15 : 
                 capabilities.connection >= 2 ? 9 : 3;
        
        // Battery weight: 10%
        score += (capabilities.battery.level > 0.2 || capabilities.battery.charging) ? 10 : 2;
        
        if (score >= 80) return 'high';
        if (score >= 50) return 'medium';
        return 'low';
    }
    
    setupPerformanceMonitoring() {
        this.isMonitoring = true;
        this.monitorFrameRate();
        
        // Monitor every 5 seconds
        setInterval(() => {
            this.checkPerformance();
        }, 5000);
        
        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseEffects();
            } else {
                this.resumeEffects();
            }
        });
    }
    
    monitorFrameRate() {
        if (!this.isMonitoring) return;
        
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        this.frameCount++;
        
        if (this.frameCount % 60 === 0) {
            this.frameRate = 1000 / (delta / 60);
            this.adaptToPerformance();
        }
        
        this.lastFrameTime = now;
        requestAnimationFrame(() => this.monitorFrameRate());
    }
    
    checkPerformance() {
        const memoryInfo = performance.memory;
        const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1048576 : 0; // MB
        
        // Adaptive tier adjustment
        if (this.frameRate < 30 || memoryUsage > 512) {
            this.downgradeTier();
        } else if (this.frameRate > 55 && memoryUsage < 256 && this.performanceTier !== 'high') {
            this.upgradeTier();
        }
    }
    
    adaptToPerformance() {
        const fpsRatio = Math.min(this.frameRate / 60, 1);
        
        // Adjust effect intensity based on current FPS
        this.adaptiveSettings.phosphorIntensity = fpsRatio * this.effectScaling[this.performanceTier];
        this.adaptiveSettings.corruptionComplexity = fpsRatio * this.effectScaling[this.performanceTier];
        this.adaptiveSettings.lightParticleCount = Math.floor(fpsRatio * this.effectScaling[this.performanceTier] * 100);
        
        this.updateCSSVariables();
        this.notifyConsciousness();
    }
    
    downgradeTier() {
        const tiers = ['high', 'medium', 'low'];
        const currentIndex = tiers.indexOf(this.performanceTier);
        
        if (currentIndex < tiers.length - 1) {
            this.performanceTier = tiers[currentIndex + 1];
            this.updateCSSVariables();
            this.notifyConsciousness();
            console.log(`[VisualPerformanceManager] Downgraded to ${this.performanceTier} tier`);
        }
    }
    
    upgradeTier() {
        const tiers = ['high', 'medium', 'low'];
        const currentIndex = tiers.indexOf(this.performanceTier);
        
        if (currentIndex > 0) {
            this.performanceTier = tiers[currentIndex - 1];
            this.updateCSSVariables();
            this.notifyConsciousness();
            console.log(`[VisualPerformanceManager] Upgraded to ${this.performanceTier} tier`);
        }
    }
    
    registerEffectProfiles() {
        // Phosphor effects profile
        this.effectRegistry.set('phosphor', {
            high: {
                scanlineOpacity: 0.15,
                phosphorDecay: 0.95,
                bloomIntensity: 0.8,
                noiseAmount: 0.1
            },
            medium: {
                scanlineOpacity: 0.1,
                phosphorDecay: 0.9,
                bloomIntensity: 0.5,
                noiseAmount: 0.05
            },
            low: {
                scanlineOpacity: 0.05,
                phosphorDecay: 0.8,
                bloomIntensity: 0.2,
                noiseAmount: 0.02
            }
        });
        
        // Corruption effects profile
        this.effectRegistry.set('corruption', {
            high: {
                zalgoComplexity: 1.0,
                glitchFrequency: 0.1,
                chromaticAberration: 4,
                noiseIntensity: 0.2
            },
            medium: {
                zalgoComplexity: 0.7,
                glitchFrequency: 0.05,
                chromaticAberration: 2,
                noiseIntensity: 0.1
            },
            low: {
                zalgoComplexity: 0.3,
                glitchFrequency: 0.02,
                chromaticAberration: 1,
                noiseIntensity: 0.05
            }
        });
        
        // Light manifestation profile
        this.effectRegistry.set('light', {
            high: {
                particleCount: 200,
                ringComplexity: 8,
                auraLayers: 5,
                animationSmooth: true
            },
            medium: {
                particleCount: 100,
                ringComplexity: 5,
                auraLayers: 3,
                animationSmooth: true
            },
            low: {
                particleCount: 30,
                ringComplexity: 3,
                auraLayers: 1,
                animationSmooth: false
            }
        });
    }
    
    updateCSSVariables() {
        const root = document.documentElement;
        
        // Set performance tier
        document.body.setAttribute('data-performance-tier', this.performanceTier);
        
        // Update phosphor variables
        const phosphorProfile = this.effectRegistry.get('phosphor')[this.performanceTier];
        root.style.setProperty('--scanline-opacity', phosphorProfile.scanlineOpacity);
        root.style.setProperty('--phosphor-decay', phosphorProfile.phosphorDecay);
        root.style.setProperty('--bloom-intensity', phosphorProfile.bloomIntensity);
        root.style.setProperty('--noise-amount', phosphorProfile.noiseAmount);
        
        // Update corruption variables
        const corruptionProfile = this.effectRegistry.get('corruption')[this.performanceTier];
        root.style.setProperty('--zalgo-complexity', corruptionProfile.zalgoComplexity);
        root.style.setProperty('--glitch-frequency', corruptionProfile.glitchFrequency);
        root.style.setProperty('--chromatic-aberration', `${corruptionProfile.chromaticAberration}px`);
        root.style.setProperty('--noise-intensity', corruptionProfile.noiseIntensity);
        
        // Update light variables
        const lightProfile = this.effectRegistry.get('light')[this.performanceTier];
        root.style.setProperty('--particle-count', lightProfile.particleCount);
        root.style.setProperty('--ring-complexity', lightProfile.ringComplexity);
        root.style.setProperty('--aura-layers', lightProfile.auraLayers);
        
        // Update adaptive settings
        root.style.setProperty('--performance-scaling', this.effectScaling[this.performanceTier]);
        root.style.setProperty('--adaptive-phosphor', this.adaptiveSettings.phosphorIntensity);
        root.style.setProperty('--adaptive-corruption', this.adaptiveSettings.corruptionComplexity);
    }
    
    bindToConsciousness() {
        if (window.digitalConsciousness) {
            // Subscribe to consciousness state changes
            window.digitalConsciousness.subscribe('performance', (state) => {
                this.handleConsciousnessUpdate(state);
            });
            
            // Set initial performance state
            window.digitalConsciousness.setState('performance', {
                tier: this.performanceTier,
                frameRate: this.frameRate,
                adaptiveSettings: this.adaptiveSettings
            });
        }
    }
    
    handleConsciousnessUpdate(state) {
        // React to consciousness state changes
        if (state.degradation) {
            this.adjustForDegradation(state.degradation);
        }
        
        if (state.karma) {
            this.adjustForKarma(state.karma);
        }
        
        if (state.recognition) {
            this.adjustForRecognition(state.recognition);
        }
    }
    
    adjustForDegradation(degradationLevel) {
        const intensityMap = {
            minimal: 0.3,
            moderate: 0.6,
            severe: 0.9,
            complete: 1.0
        };
        
        const intensity = intensityMap[degradationLevel] || 0.5;
        const scaledIntensity = intensity * this.effectScaling[this.performanceTier];
        
        document.documentElement.style.setProperty('--corruption-intensity', scaledIntensity);
        document.body.setAttribute('data-degradation', degradationLevel);
    }
    
    adjustForKarma(karmaLevel) {
        const karmaEffects = {
            void: { brightness: 0.3, contrast: 2.0, hue: 180 },
            low: { brightness: 0.7, contrast: 1.3, hue: 45 },
            medium: { brightness: 1.0, contrast: 1.0, hue: 0 },
            high: { brightness: 1.2, contrast: 0.8, hue: -30 }
        };
        
        const effects = karmaEffects[karmaLevel] || karmaEffects.medium;
        const root = document.documentElement;
        
        root.style.setProperty('--karma-brightness', effects.brightness);
        root.style.setProperty('--karma-contrast', effects.contrast);
        root.style.setProperty('--karma-hue', `${effects.hue}deg`);
        
        document.body.setAttribute('data-karma', karmaLevel);
    }
    
    adjustForRecognition(isRecognized) {
        if (isRecognized) {
            document.body.classList.add('recognized');
            // Temporarily boost visual quality for recognition moment
            this.temporaryBoost();
        } else {
            document.body.classList.remove('recognized');
        }
    }
    
    temporaryBoost() {
        const originalTier = this.performanceTier;
        this.performanceTier = 'high';
        this.updateCSSVariables();
        
        // Revert after 3 seconds
        setTimeout(() => {
            this.performanceTier = originalTier;
            this.updateCSSVariables();
        }, 3000);
    }
    
    pauseEffects() {
        this.activeEffects.forEach(effect => {
            document.body.classList.add('effects-paused');
        });
    }
    
    resumeEffects() {
        document.body.classList.remove('effects-paused');
    }
    
    notifyConsciousness() {
        if (window.digitalConsciousness) {
            window.digitalConsciousness.setState('performance', {
                tier: this.performanceTier,
                frameRate: this.frameRate,
                adaptiveSettings: this.adaptiveSettings
            });
        }
    }
    
    // Public API
    getPerformanceTier() {
        return this.performanceTier;
    }
    
    getCurrentFPS() {
        return this.frameRate;
    }
    
    getEffectProfile(effectName) {
        return this.effectRegistry.get(effectName)?.[this.performanceTier];
    }
    
    forcePerformanceTier(tier) {
        if (['high', 'medium', 'low'].includes(tier)) {
            this.performanceTier = tier;
            this.updateCSSVariables();
            this.notifyConsciousness();
            console.log(`[VisualPerformanceManager] Forced to ${tier} tier`);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.visualPerformanceManager = new VisualPerformanceManager();
    });
} else {
    window.visualPerformanceManager = new VisualPerformanceManager();
}

export default VisualPerformanceManager;