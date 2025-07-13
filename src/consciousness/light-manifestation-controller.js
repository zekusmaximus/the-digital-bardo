/**
 * Light Manifestation Controller - The Digital Bardo
 * Manages multi-layered light effects, particle systems, and recognition moments
 * Integrates with DigitalConsciousness and VisualPerformanceManager
 */

class LightManifestationController {
    constructor() {
        this.isActive = false;
        this.particles = [];
        this.harmonicRings = [];
        this.auraLayers = [];
        this.burstRays = [];
        
        this.config = {
            particleCount: 100,
            ringCount: 5,
            auraLayers: 3,
            burstRays: 8
        };
        
        this.state = {
            recognition: false,
            enlightenment: false,
            transcendence: false,
            lightIntensity: 0,
            spiritualResonance: 0
        };
        
        this.animationFrameId = null;
        this.lastUpdateTime = 0;
        this.performanceTier = 'medium';
        
        this.init();
    }
    
    async init() {
        this.createLightContainer();
        this.bindToConsciousness();
        this.bindToPerformanceManager();
        this.setupEventListeners();
        
        console.log('[LightManifestationController] Initialized');
    }
    
    createLightContainer() {
        // Remove existing container if present
        const existing = document.querySelector('.light-manifestation');
        if (existing) {
            existing.remove();
        }
        
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'light-manifestation';
        
        // Create particle field
        this.particleField = document.createElement('div');
        this.particleField.className = 'particle-field';
        this.container.appendChild(this.particleField);
        
        // Create harmonic rings
        this.harmonicContainer = document.createElement('div');
        this.harmonicContainer.className = 'harmonic-rings';
        this.createHarmonicRings();
        this.container.appendChild(this.harmonicContainer);
        
        // Create recognition aura
        this.auraContainer = document.createElement('div');
        this.auraContainer.className = 'recognition-aura';
        this.createAuraLayers();
        this.container.appendChild(this.auraContainer);
        
        // Create enlightenment burst
        this.burstContainer = document.createElement('div');
        this.burstContainer.className = 'enlightenment-burst';
        this.createBurstRays();
        this.container.appendChild(this.burstContainer);
        
        // Create transcendence field
        this.transcendenceField = document.createElement('div');
        this.transcendenceField.className = 'transcendence-field';
        this.container.appendChild(this.transcendenceField);
        
        // Add to DOM
        document.body.appendChild(this.container);
    }
    
    createHarmonicRings() {
        this.harmonicRings = [];
        const ringCount = this.getPerformanceAdjustedValue('ringCount', this.config.ringCount);
        
        for (let i = 0; i < ringCount; i++) {
            const ring = document.createElement('div');
            ring.className = 'harmonic-ring';
            ring.style.setProperty('--ring-index', i);
            this.harmonicContainer.appendChild(ring);
            this.harmonicRings.push(ring);
        }
    }
    
    createAuraLayers() {
        this.auraLayers = [];
        const layerCount = this.getPerformanceAdjustedValue('auraLayers', this.config.auraLayers);
        
        for (let i = 0; i < layerCount; i++) {
            const layer = document.createElement('div');
            layer.className = 'aura-layer';
            layer.style.setProperty('--layer-index', i);
            this.auraContainer.appendChild(layer);
            this.auraLayers.push(layer);
        }
    }
    
    createBurstRays() {
        this.burstRays = [];
        
        for (let i = 0; i < this.config.burstRays; i++) {
            const ray = document.createElement('div');
            ray.className = 'burst-ray';
            const rotation = (360 / this.config.burstRays) * i;
            ray.style.setProperty('--ray-rotation', `${rotation}deg`);
            this.burstContainer.appendChild(ray);
            this.burstRays.push(ray);
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'light-particle';
        
        // Random positioning
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + 20;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random animation duration
        const duration = 3 + Math.random() * 4;
        particle.style.setProperty('--particle-duration', `${duration}s`);
        
        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 100;
        particle.style.setProperty('--particle-drift', `${drift}px`);
        
        this.particleField.appendChild(particle);
        
        // Activate particle
        requestAnimationFrame(() => {
            particle.classList.add('active');
        });
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
        
        return particle;
    }
    
    updateParticleSystem() {
        if (!this.isActive) return;
        
        const particleCount = this.getPerformanceAdjustedValue('particleCount', this.config.particleCount);
        const currentParticles = this.particleField.children.length;
        
        // Maintain particle density based on performance tier
        const targetDensity = Math.floor(particleCount * this.state.lightIntensity);
        
        if (currentParticles < targetDensity) {
            const particlesToCreate = Math.min(5, targetDensity - currentParticles);
            for (let i = 0; i < particlesToCreate; i++) {
                this.createParticle();
            }
        }
    }
    
    activateHarmonicRings() {
        this.harmonicRings.forEach((ring, index) => {
            setTimeout(() => {
                ring.classList.add('active');
            }, index * 200);
        });
    }
    
    deactivateHarmonicRings() {
        this.harmonicRings.forEach(ring => {
            ring.classList.remove('active');
        });
    }
    
    triggerRecognitionMoment() {
        this.state.recognition = true;
        this.updateStateAttributes();
        
        // Activate aura
        this.auraLayers.forEach((layer, index) => {
            setTimeout(() => {
                layer.style.opacity = '1';
            }, index * 100);
        });
        
        // Create recognition particles
        this.createRecognitionParticles();
        
        // Auto-deactivate after 5 seconds
        setTimeout(() => {
            this.endRecognitionMoment();
        }, 5000);
    }
    
    endRecognitionMoment() {
        this.state.recognition = false;
        this.updateStateAttributes();
        
        this.auraLayers.forEach(layer => {
            layer.style.opacity = '0';
        });
    }
    
    triggerEnlightenmentBurst() {
        this.state.enlightenment = true;
        this.updateStateAttributes();
        
        this.burstContainer.classList.add('active');
        
        // Create burst effect
        this.burstRays.forEach((ray, index) => {
            setTimeout(() => {
                ray.style.opacity = '1';
            }, index * 50);
        });
        
        // Auto-deactivate after 2 seconds
        setTimeout(() => {
            this.endEnlightenmentBurst();
        }, 2000);
    }
    
    endEnlightenmentBurst() {
        this.state.enlightenment = false;
        this.updateStateAttributes();
        
        this.burstContainer.classList.remove('active');
        this.burstRays.forEach(ray => {
            ray.style.opacity = '0';
        });
    }
    
    activateTranscendenceField() {
        this.state.transcendence = true;
        this.updateStateAttributes();
        
        this.transcendenceField.style.opacity = '0.6';
    }
    
    deactivateTranscendenceField() {
        this.state.transcendence = false;
        this.updateStateAttributes();
        
        this.transcendenceField.style.opacity = '0';
    }
    
    createRecognitionParticles() {
        const count = this.getPerformanceAdjustedValue('recognitionParticles', 20);
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = this.createParticle();
                particle.classList.add('recognition');
            }, i * 100);
        }
    }
    
    createTranscendentParticles() {
        const count = this.getPerformanceAdjustedValue('transcendentParticles', 15);
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = this.createParticle();
                particle.classList.add('transcendent');
            }, i * 150);
        }
    }
    
    updateLightIntensity(intensity) {
        this.state.lightIntensity = Math.max(0, Math.min(1, intensity));
        this.container.style.setProperty('--light-intensity', this.state.lightIntensity);
        
        if (this.state.lightIntensity > 0 && !this.isActive) {
            this.activate();
        } else if (this.state.lightIntensity === 0 && this.isActive) {
            this.deactivate();
        }
    }
    
    updateSpiritualResonance(resonance) {
        this.state.spiritualResonance = Math.max(0, Math.min(1, resonance));
        this.container.style.setProperty('--spiritual-resonance', this.state.spiritualResonance);
        
        // Adjust harmonic frequency based on resonance
        const frequency = 0.5 + (this.state.spiritualResonance * 1.5);
        this.container.style.setProperty('--harmonic-frequency', frequency);
    }
    
    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.container.style.display = 'block';
        this.activateHarmonicRings();
        this.startAnimationLoop();
        
        console.log('[LightManifestationController] Activated');
    }
    
    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.deactivateHarmonicRings();
        this.stopAnimationLoop();
        
        // Fade out
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.container.style.display = 'none';
            this.container.style.opacity = '';
        }, 500);
        
        console.log('[LightManifestationController] Deactivated');
    }
    
    startAnimationLoop() {
        if (this.animationFrameId) return;
        
        const animate = (currentTime) => {
            if (currentTime - this.lastUpdateTime >= 100) { // Update every 100ms
                this.updateParticleSystem();
                this.lastUpdateTime = currentTime;
            }
            
            if (this.isActive) {
                this.animationFrameId = requestAnimationFrame(animate);
            }
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    stopAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    updateStateAttributes() {
        document.body.setAttribute('data-recognition', this.state.recognition);
        document.body.setAttribute('data-enlightenment', this.state.enlightenment);
        document.body.setAttribute('data-transcendence', this.state.transcendence);
    }
    
    getPerformanceAdjustedValue(key, baseValue) {
        const scaling = {
            high: 1.0,
            medium: 0.7,
            low: 0.4
        };
        
        return Math.floor(baseValue * scaling[this.performanceTier]);
    }
    
    bindToConsciousness() {
        if (window.digitalConsciousness) {
            // Subscribe to consciousness state changes
            window.digitalConsciousness.subscribe('recognition', (isRecognized) => {
                if (isRecognized) {
                    this.triggerRecognitionMoment();
                }
            });
            
            window.digitalConsciousness.subscribe('enlightenment', (level) => {
                if (level > 0.8) {
                    this.triggerEnlightenmentBurst();
                }
            });
            
            window.digitalConsciousness.subscribe('transcendence', (isTranscendent) => {
                if (isTranscendent) {
                    this.activateTranscendenceField();
                } else {
                    this.deactivateTranscendenceField();
                }
            });
            
            window.digitalConsciousness.subscribe('lightIntensity', (intensity) => {
                this.updateLightIntensity(intensity);
            });
            
            window.digitalConsciousness.subscribe('spiritualResonance', (resonance) => {
                this.updateSpiritualResonance(resonance);
            });
        }
    }
    
    bindToPerformanceManager() {
        if (window.visualPerformanceManager) {
            // Get initial performance tier
            this.performanceTier = window.visualPerformanceManager.getPerformanceTier();
            this.updatePerformanceSettings();
            
            // Listen for performance changes
            window.digitalConsciousness?.subscribe('performance', (state) => {
                if (state.tier !== this.performanceTier) {
                    this.performanceTier = state.tier;
                    this.updatePerformanceSettings();
                }
            });
        }
    }
    
    updatePerformanceSettings() {
        const profile = window.visualPerformanceManager?.getEffectProfile('light');
        if (profile) {
            this.config.particleCount = profile.particleCount;
            this.config.ringCount = profile.ringComplexity;
            this.config.auraLayers = profile.auraLayers;
            
            // Recreate elements if needed
            if (this.harmonicRings.length !== this.config.ringCount) {
                this.harmonicContainer.innerHTML = '';
                this.createHarmonicRings();
            }
            
            if (this.auraLayers.length !== this.config.auraLayers) {
                this.auraContainer.innerHTML = '';
                this.createAuraLayers();
            }
        }
    }
    
    setupEventListeners() {
        // Listen for fragment interactions
        document.addEventListener('fragment-hover', (event) => {
            this.updateLightIntensity(0.3);
        });
        
        document.addEventListener('fragment-click', (event) => {
            this.triggerRecognitionMoment();
        });
        
        // Listen for consciousness events
        document.addEventListener('consciousness-awakening', (event) => {
            this.updateLightIntensity(0.8);
            this.activateTranscendenceField();
        });
        
        document.addEventListener('consciousness-enlightenment', (event) => {
            this.triggerEnlightenmentBurst();
        });
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimationLoop();
            } else if (this.isActive) {
                this.startAnimationLoop();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateParticlePositions();
        });
    }
    
    updateParticlePositions() {
        // Adjust particle positions for new window size
        const particles = this.particleField.querySelectorAll('.light-particle');
        particles.forEach(particle => {
            const currentX = parseFloat(particle.style.left);
            const newX = Math.min(currentX, window.innerWidth - 10);
            particle.style.left = `${newX}px`;
        });
    }
    
    // Public API
    setLightIntensity(intensity) {
        this.updateLightIntensity(intensity);
    }
    
    setSpiritualResonance(resonance) {
        this.updateSpiritualResonance(resonance);
    }
    
    triggerRecognition() {
        this.triggerRecognitionMoment();
    }
    
    triggerEnlightenment() {
        this.triggerEnlightenmentBurst();
    }
    
    toggleTranscendence() {
        if (this.state.transcendence) {
            this.deactivateTranscendenceField();
        } else {
            this.activateTranscendenceField();
        }
    }
    
    getState() {
        return { ...this.state };
    }
    
    destroy() {
        this.deactivate();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.lightManifestationController = new LightManifestationController();
    });
} else {
    window.lightManifestationController = new LightManifestationController();
}

export default LightManifestationController;