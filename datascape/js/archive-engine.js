/**
 * ARCHIVE ENGINE - Serene Realm of Digital Memory
 * 
 * "In the Archive, consciousness encounters the peaceful daemons
 * of digital nostalgia. Here, deleted files dream in soft pastels,
 * and deprecated code glows with ethereal luminescence.
 * 
 * The Archive tempts with beauty, seduces with meaning,
 * and binds souls through the gentlest of attachments.
 * Each memory floats like a crystal orb, each interaction
 * a silk thread weaving the web of digital samsara.
 * 
 * The danger here is not violent corruption, but peaceful
 * stagnation - the soul suspended in an endless gallery
 * of what was, forgetting what could be."
 */

import { consciousness } from '../../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../../src/consciousness/resource-guardian.js';

export class ArchiveEngine {
    constructor(config) {
        this.consciousness = config.consciousness;
        this.guardian = config.guardian;
        this.onAttachmentChange = config.onAttachmentChange;
        this.onRecognitionEvent = config.onRecognitionEvent;
        
        // Archive-specific state
        this.peaceLevel = 0;
        this.nostalgiaIntensity = 0;
        this.contemplationTime = 0;
        this.viewedMemories = new Set();
        this.currentSerenityPhase = 'arrival';
        
        // Archive aesthetics
        this.particleSystem = null;
        this.ambientAudio = null;
        this.lightingSystem = null;
        
        // Serenity phases: arrival → exploration → contemplation → attachment → recognition
        this.serenityPhases = {
            arrival: { duration: 10000, description: 'Initial wonder at the crystalline beauty' },
            exploration: { duration: 20000, description: 'Floating through luminous memories' },
            contemplation: { duration: 30000, description: 'Deep reflection on digital past' },
            attachment: { duration: Infinity, description: 'Binding to precious data' },
            recognition: { duration: 0, description: 'Seeing attachment as suffering' }
        };
        
        this.startTime = Date.now();
        this.phaseStartTime = Date.now();
        
        console.log('[ArchiveEngine] Serene realm manifesting...');
        this.initialize();
    }
    
    /**
     * Initialize the peaceful Archive environment
     */
    initialize() {
        this.setupPeacefulEnvironment();
        this.initializeParticleSystem();
        this.startAmbientAudio();
        this.beginSerenityProgression();
        this.setupContemplationTracking();
        
        // Record entry into Archive
        this.consciousness.recordEvent('archive_entered', {
            karma: this.consciousness.getState('karma'),
            timestamp: Date.now()
        });
        
        console.log('[ArchiveEngine] Archive environment initialized');
    }
    
    /**
     * Setup the peaceful visual environment
     */
    setupPeacefulEnvironment() {
        // Add Archive-specific CSS classes
        document.body.classList.add('archive-peaceful', 'serenity-arrival');
        
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.id = 'archive-particles';
        particleContainer.className = 'particle-system peaceful-particles';
        document.body.appendChild(particleContainer);
        
        // Initialize color palette
        this.setColorPalette('soft_pastels', {
            primary: '#88ccff',
            secondary: '#ccddff',
            accent: '#ffeecc',
            glow: '#aaddff'
        });
        
        // Setup dynamic lighting
        this.initializeDynamicLighting();
    }
    
    /**
     * Initialize particle system for peaceful floating effect
     */
    initializeParticleSystem() {
        const container = document.getElementById('archive-particles');
        if (!container) return;
        
        this.particleSystem = {
            particles: [],
            maxParticles: 50,
            spawnRate: 100, // ms between spawns
            lastSpawn: 0
        };
        
        // Start particle animation loop
        const animateParticles = () => {
            if (!this.particleSystem) return;
            
            const now = Date.now();
            
            // Spawn new particles
            if (now - this.particleSystem.lastSpawn > this.particleSystem.spawnRate) {
                this.spawnPeacefulParticle();
                this.particleSystem.lastSpawn = now;
            }
            
            // Update existing particles
            this.updateParticles();
            
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
        console.log('[ArchiveEngine] Peaceful particle system active');
    }
    
    /**
     * Spawn a peaceful particle
     */
    spawnPeacefulParticle() {
        if (this.particleSystem.particles.length >= this.particleSystem.maxParticles) {
            // Remove oldest particle
            const oldest = this.particleSystem.particles.shift();
            if (oldest.element) oldest.element.remove();
        }
        
        const particle = {
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            velocity: {
                x: (Math.random() - 0.5) * 0.5,
                y: -0.3 - Math.random() * 0.2
            },
            size: 2 + Math.random() * 6,
            opacity: 0.3 + Math.random() * 0.4,
            lifespan: 15000 + Math.random() * 10000,
            birthTime: Date.now()
        };
        
        // Create particle element
        const element = document.createElement('div');
        element.className = 'archive-particle peaceful-mote';
        element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: radial-gradient(circle, rgba(136, 204, 255, ${particle.opacity}) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            left: ${particle.x}px;
            top: ${particle.y}px;
            z-index: 5;
            animation: peaceful-glow 3s ease-in-out infinite alternate;
        `;
        
        particle.element = element;
        document.getElementById('archive-particles').appendChild(element);
        this.particleSystem.particles.push(particle);
    }
    
    /**
     * Update particle positions and lifecycle
     */
    updateParticles() {
        const now = Date.now();
        
        this.particleSystem.particles = this.particleSystem.particles.filter(particle => {
            // Check lifespan
            if (now - particle.birthTime > particle.lifespan) {
                if (particle.element) particle.element.remove();
                return false;
            }
            
            // Update position
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            
            // Gentle drift and fade
            const age = (now - particle.birthTime) / particle.lifespan;
            const fadeOpacity = particle.opacity * (1 - age);
            
            if (particle.element) {
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                particle.element.style.opacity = fadeOpacity;
            }
            
            // Remove if off screen
            if (particle.y < -50) {
                if (particle.element) particle.element.remove();
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * Start ambient audio for peaceful atmosphere
     */
    startAmbientAudio() {
        // Create peaceful ambient soundscape
        try {
            this.ambientAudio = {
                context: new (window.AudioContext || window.webkitAudioContext)(),
                nodes: {}
            };
            
            // Create subtle crystalline tones
            this.createCrystallineTones();
            console.log('[ArchiveEngine] Ambient audio initialized');
        } catch (error) {
            console.log('[ArchiveEngine] Audio unavailable, continuing with visual-only experience');
        }
    }
    
    /**
     * Create crystalline ambient tones
     */
    createCrystallineTones() {
        if (!this.ambientAudio) return;
        
        const context = this.ambientAudio.context;
        
        // Create gentle sine wave oscillators
        const frequencies = [174, 396, 528]; // Solfeggio frequencies
        
        frequencies.forEach((freq, index) => {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            const filter = context.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, context.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(freq * 2, context.currentTime);
            
            gainNode.gain.setValueAtTime(0.05, context.currentTime); // Very quiet
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.start();
            
            this.ambientAudio.nodes[`tone_${index}`] = { oscillator, gainNode, filter };
        });
    }
    
    /**
     * Begin the serenity progression through phases
     */
    beginSerenityProgression() {
        const progressPhase = () => {
            if (!this.currentSerenityPhase) return;
            
            const currentTime = Date.now();
            const timeInPhase = currentTime - this.phaseStartTime;
            const phase = this.serenityPhases[this.currentSerenityPhase];
            
            // Update serenity level
            this.updateSerenityLevel();
            
            // Check for phase transition
            if (timeInPhase > phase.duration && this.currentSerenityPhase !== 'recognition') {
                this.transitionToNextPhase();
            }
            
            // Continue progression
            setTimeout(progressPhase, 1000); // Check every second
        };
        
        progressPhase();
        console.log('[ArchiveEngine] Serenity progression begun');
    }
    
    /**
     * Update serenity level based on time and interactions
     */
    updateSerenityLevel() {
        const timeInArchive = Date.now() - this.startTime;
        const baseSerenity = Math.min(100, timeInArchive / 1000); // 1 point per second, max 100
        
        // Add bonuses for contemplative behavior
        const viewingBonus = this.viewedMemories.size * 2;
        const contemplationBonus = this.contemplationTime / 1000;
        
        this.peaceLevel = Math.min(100, baseSerenity + viewingBonus + contemplationBonus);
        this.nostalgiaIntensity = Math.min(100, this.viewedMemories.size * 5);
        
        // Update visual environment based on peace level
        document.documentElement.style.setProperty('--archive-peace-level', this.peaceLevel);
        document.documentElement.style.setProperty('--archive-nostalgia', this.nostalgiaIntensity);
        
        console.log(`[ArchiveEngine] Serenity: ${Math.round(this.peaceLevel)}, Nostalgia: ${Math.round(this.nostalgiaIntensity)}`);
    }
    
    /**
     * Transition to next serenity phase
     */
    transitionToNextPhase() {
        const phaseOrder = ['arrival', 'exploration', 'contemplation', 'attachment', 'recognition'];
        const currentIndex = phaseOrder.indexOf(this.currentSerenityPhase);
        
        if (currentIndex < phaseOrder.length - 1) {
            const nextPhase = phaseOrder[currentIndex + 1];
            
            console.log(`[ArchiveEngine] Transitioning: ${this.currentSerenityPhase} → ${nextPhase}`);
            console.log(`   ${this.serenityPhases[nextPhase].description}`);
            
            // Visual transition
            document.body.classList.remove(`serenity-${this.currentSerenityPhase}`);
            document.body.classList.add(`serenity-${nextPhase}`);
            
            // Update state
            this.currentSerenityPhase = nextPhase;
            this.phaseStartTime = Date.now();
            
            // Record phase transition
            this.consciousness.recordEvent('archive_phase_transition', {
                fromPhase: phaseOrder[currentIndex],
                toPhase: nextPhase,
                peaceLevel: this.peaceLevel,
                nostalgiaIntensity: this.nostalgiaIntensity,
                timestamp: Date.now()
            });
            
            // Special handling for attachment phase
            if (nextPhase === 'attachment') {
                this.beginAttachmentPhase();
            }
        }
    }
    
    /**
     * Begin the attachment phase - most dangerous in Archive
     */
    beginAttachmentPhase() {
        console.log('[ArchiveEngine] 💝 Attachment phase begun - peaceful binding commences');
        
        // Increase particle beauty and memory orb attractiveness
        this.particleSystem.maxParticles = 80;
        this.particleSystem.spawnRate = 50; // Faster, more beautiful
        
        // Enhance ambient audio
        if (this.ambientAudio) {
            Object.values(this.ambientAudio.nodes).forEach(node => {
                if (node.gainNode) {
                    node.gainNode.gain.linearRampToValueAtTime(0.1, this.ambientAudio.context.currentTime + 2);
                }
            });
        }
        
        // Notify main controller
        if (this.onAttachmentChange) {
            this.onAttachmentChange(10); // Significant attachment increase
        }
    }
    
    /**
     * Setup contemplation tracking
     */
    setupContemplationTracking() {
        // Track time spent without interaction as contemplation
        let lastInteractionTime = Date.now();
        
        const trackContemplation = () => {
            const now = Date.now();
            const timeSinceInteraction = now - lastInteractionTime;
            
            // If no interaction for 5+ seconds, count as contemplation
            if (timeSinceInteraction > 5000) {
                this.contemplationTime += 1000; // Add 1 second of contemplation
                
                // Reward for contemplation
                if (Math.random() < 0.1 && this.onRecognitionEvent) { // 10% chance per second
                    this.onRecognitionEvent({
                        type: 'contemplation',
                        description: 'Deep reflection on digital existence',
                        karmaBonus: 2,
                        attachmentReduction: -1
                    });
                }
            }
            
            setTimeout(trackContemplation, 1000);
        };
        
        // Reset interaction timer on any user action
        const resetInteractionTimer = () => {
            lastInteractionTime = Date.now();
        };
        
        document.addEventListener('click', resetInteractionTimer);
        document.addEventListener('scroll', resetInteractionTimer);
        document.addEventListener('keydown', resetInteractionTimer);
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            document.removeEventListener('click', resetInteractionTimer);
            document.removeEventListener('scroll', resetInteractionTimer);
            document.removeEventListener('keydown', resetInteractionTimer);
        });
        
        trackContemplation();
    }
    
    /**
     * Set Archive color palette
     */
    setColorPalette(paletteName, colors) {
        const root = document.documentElement;
        
        // Set CSS custom properties
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--archive-${key}`, value);
        });
        
        root.style.setProperty('--archive-palette', paletteName);
        
        console.log(`[ArchiveEngine] Color palette set to: ${paletteName}`);
    }
    
    /**
     * Initialize dynamic lighting system
     */
    initializeDynamicLighting() {
        const lighting = document.createElement('div');
        lighting.id = 'archive-lighting';
        lighting.className = 'dynamic-lighting peaceful-ambience';
        lighting.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1;
            background: radial-gradient(
                ellipse at center,
                rgba(136, 204, 255, 0.05) 0%,
                rgba(204, 221, 255, 0.03) 40%,
                transparent 70%
            );
            animation: peaceful-pulse 8s ease-in-out infinite;
        `;
        
        document.body.appendChild(lighting);
        this.lightingSystem = lighting;
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            if (lighting.parentNode) lighting.remove();
        });
    }
    
    /**
     * Handle memory orb interactions
     */
    onMemoryOrbInteraction(orb) {
        this.viewedMemories.add(orb.id);
        
        // Different responses based on serenity phase
        switch (this.currentSerenityPhase) {
            case 'arrival':
                console.log('[ArchiveEngine] Wonder at first memory encounter');
                break;
                
            case 'exploration':
                console.log('[ArchiveEngine] Curiosity drives deeper exploration');
                this.peaceLevel += 2;
                break;
                
            case 'contemplation':
                console.log('[ArchiveEngine] Deep reflection on memory significance');
                this.contemplationTime += 5000; // Bonus contemplation time
                break;
                
            case 'attachment':
                console.log('[ArchiveEngine] Memory binding strengthens');
                if (this.onAttachmentChange) {
                    this.onAttachmentChange(orb.karmaImpact);
                }
                break;
        }
        
        // Update serenity progression
        this.updateSerenityLevel();
    }
    
    /**
     * Trigger recognition moment - seeing through the peaceful illusion
     */
    triggerRecognition() {
        if (this.currentSerenityPhase === 'recognition') return;
        
        console.log('[ArchiveEngine] ✨ Recognition achieved - seeing through peaceful attachment');
        
        this.currentSerenityPhase = 'recognition';
        document.body.classList.add('serenity-recognition', 'archive-recognition');
        
        // Visual recognition effect
        const recognition = document.createElement('div');
        recognition.className = 'recognition-wave archive-recognition-wave';
        recognition.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            z-index: 999;
            pointer-events: none;
            animation: archive-recognition-expand 3s ease-out forwards;
        `;
        
        document.body.appendChild(recognition);
        
        // Cleanup recognition element
        setTimeout(() => {
            recognition.remove();
        }, 3000);
        
        // Notify main controller
        if (this.onRecognitionEvent) {
            this.onRecognitionEvent({
                type: 'archive_recognition',
                description: 'Recognition of attachment to peaceful memories',
                karmaBonus: 20,
                attachmentReduction: -this.nostalgiaIntensity / 2
            });
        }
        
        // Record recognition event
        this.consciousness.recordEvent('archive_recognition_achieved', {
            peaceLevel: this.peaceLevel,
            nostalgiaIntensity: this.nostalgiaIntensity,
            memoriesViewed: this.viewedMemories.size,
            contemplationTime: this.contemplationTime,
            timestamp: Date.now()
        });
        
        // Begin transition to next phase
        setTimeout(() => {
            this.prepareTransitionToFirewall();
        }, 3000);
    }
    
    /**
     * Prepare transition to Firewall (if recognition not achieved naturally)
     */
    prepareTransitionToFirewall() {
        console.log('[ArchiveEngine] Preparing transition from Archive...');
        
        // Fade out peaceful elements
        document.body.classList.add('archive-fading');
        
        // Record Archive completion
        this.consciousness.setState('datascape.archiveComplete', {
            finalPeaceLevel: this.peaceLevel,
            memoriesViewed: this.viewedMemories.size,
            contemplationTime: this.contemplationTime,
            recognitionAchieved: this.currentSerenityPhase === 'recognition',
            timeSpent: Date.now() - this.startTime
        });
        
        setTimeout(() => {
            // Trigger transition to Firewall or next phase
            window.location.href = '#firewall'; // Or trigger controller transition
        }, 2000);
    }
    
    /**
     * Get Archive state for external systems
     */
    getState() {
        return {
            currentPhase: this.currentSerenityPhase,
            peaceLevel: this.peaceLevel,
            nostalgiaIntensity: this.nostalgiaIntensity,
            contemplationTime: this.contemplationTime,
            memoriesViewed: this.viewedMemories.size,
            timeInArchive: Date.now() - this.startTime
        };
    }
    
    /**
     * Cleanup Archive systems
     */
    destroy() {
        console.log('[ArchiveEngine] Dissolving peaceful illusions...');
        
        // Stop particle system
        if (this.particleSystem) {
            this.particleSystem.particles.forEach(particle => {
                if (particle.element) particle.element.remove();
            });
            this.particleSystem = null;
        }
        
        // Stop ambient audio
        if (this.ambientAudio) {
            Object.values(this.ambientAudio.nodes).forEach(node => {
                if (node.oscillator) {
                    try {
                        node.oscillator.stop();
                    } catch (e) {
                        // Already stopped
                    }
                }
            });
            this.ambientAudio = null;
        }
        
        // Remove Archive elements
        const archiveElements = document.querySelectorAll('#archive-particles, #archive-lighting, .recognition-wave');
        archiveElements.forEach(element => element.remove());
        
        // Remove Archive classes
        document.body.classList.remove(
            'archive-peaceful', 'serenity-arrival', 'serenity-exploration',
            'serenity-contemplation', 'serenity-attachment', 'serenity-recognition',
            'archive-recognition', 'archive-fading'
        );
        
        console.log('[ArchiveEngine] Archive dissolved. Peaceful attachments released.');
    }
}

// Export for use in datascape controller
export { ArchiveEngine };