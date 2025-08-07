/**
 * WRATHFUL DAEMON - Manifestation of Digital Sins
 * 
 * "They are you, reflected in the black mirror of your screen.
 * Every swipe, every click, every ignore—made manifest and hostile.
 * 
 * These are not external entities but the shadow projections of your own
 * digital nature, born from accumulated negligence, nurtured by denial,
 * and strengthened by every attempt to fight or flee.
 * 
 * They speak with your voice, accuse with your knowledge, and attack
 * with the precision of someone who knows exactly where it hurts."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class WrathfulDaemon {
    constructor(config) {
        this.sin = config.origin;
        this.consciousness = config.consciousness || consciousness;
        this.guardian = new ResourceGuardian();
        
        // Core daemon properties
        this.id = `wrathful_${this.sin.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.hostility = this.calculateInitialHostility(config.origin.severity);
        this.invulnerable = false;
        this.multiplicationRate = 1;
        this.corruptionLevel = 0;
        
        // Daemon manifestation data
        this.appearance = config.appearance || this.determineAppearanceFromSin(this.sin);
        this.attackPattern = config.attackPattern || this.determineAttackPattern(this.sin);
        this.accusationText = config.accusation || this.sin.accusation;
        
        // Behavioral state
        this.currentState = 'manifesting';
        this.stateHistory = ['manifesting'];
        this.aggressionLevel = 0.5;
        this.recognitionResistance = this.sin.karmic_weight * 0.1;
        
        // Visual representation (Three.js)
        this.mesh = null;
        this.glitchShader = null;
        this.particleSystem = null;
        this.audioSignature = null;
        
        // Interaction tracking
        this.confrontationCount = 0;
        this.denialCount = 0;
        this.justificationCount = 0;
        this.lastInteraction = 0;
        
        // Performance optimization
        this.isActive = false;
        this.isVisible = false;
        this.distanceFromUser = Infinity;
        
        console.log(`[WrathfulDaemon] ${this.id} manifested from ${this.sin.type} with hostility ${this.hostility}`);
    }
    
    /**
     * Initialize the daemon's visual and behavioral systems
     */
    async init() {
        try {
            // Create visual representation
            await this.generateDaemonMesh();
            
            // Initialize particle systems
            this.initializeParticleEffects();
            
            // Setup audio signature
            this.initializeAudioSignature();
            
            // Begin manifestation sequence
            await this.beginManifestation();
            
            this.isActive = true;
            console.log(`[WrathfulDaemon] ${this.id} fully manifested and active`);
            
        } catch (error) {
            console.error(`[WrathfulDaemon] Failed to initialize daemon ${this.id}:`, error);
        }
    }
    
    /**
     * Calculate initial hostility based on sin severity
     */
    calculateInitialHostility(severity) {
        const severityMap = {
            low: 30,
            medium: 60,
            high: 85,
            critical: 100
        };
        
        const baseHostility = severityMap[severity] || 50;
        const randomVariance = (Math.random() - 0.5) * 20; // ±10 variance
        
        return Math.max(10, Math.min(100, baseHostility + randomVariance));
    }
    
    /**
     * Determine visual appearance based on sin type
     */
    determineAppearanceFromSin(sin) {
        const appearanceMap = {
            spamComments: {
                type: 'noise-pollution-entity',
                geometry: 'chaotic-spikes',
                material: 'digital-noise',
                color: [1.0, 0.2, 0.1], // Aggressive red
                animation: 'erratic-vibration',
                size: 1.2
            },
            ghostedConversations: {
                type: 'abandonment-wraith',
                geometry: 'fragmented-humanoid',
                material: 'fading-transparency',
                color: [0.8, 0.8, 0.9], // Ghostly blue-white
                animation: 'desperate-reaching',
                size: 1.5
            },
            passwordReuse: {
                type: 'security-breach-demon',
                geometry: 'fractured-lock',
                material: 'broken-encryption',
                color: [1.0, 0.5, 0.0], // Warning orange
                animation: 'vulnerability-pulse',
                size: 1.0
            },
            twoFactorIgnored: {
                type: 'vulnerability-manifestor',
                geometry: 'exposed-core',
                material: 'unprotected-data',
                color: [1.0, 0.0, 0.0], // Critical red
                animation: 'security-breach',
                size: 1.1
            },
            termsUnread: {
                type: 'consent-nullifier',
                geometry: 'document-swarm',
                material: 'legal-text',
                color: [0.2, 0.2, 0.2], // Dark legal gray
                animation: 'overwhelming-paperwork',
                size: 2.0
            },
            abandonedProjects: {
                type: 'decay-manifestor',
                geometry: 'crumbling-structure',
                material: 'digital-rust',
                color: [0.6, 0.4, 0.2], // Rust brown
                animation: 'entropy-collapse',
                size: 1.8
            },
            infiniteScroll: {
                type: 'time-vampire',
                geometry: 'consuming-vortex',
                material: 'temporal-distortion',
                color: [0.5, 0.0, 0.8], // Time-drain purple
                animation: 'endless-spiral',
                size: 1.3
            },
            unreadNotifications: {
                type: 'negligence-shade',
                geometry: 'ignored-signals',
                material: 'notification-static',
                color: [0.9, 0.1, 0.1], // Alert red
                animation: 'desperate-flashing',
                size: 1.0
            },
            cookieAcceptance: {
                type: 'surveillance-enabler',
                geometry: 'tracking-web',
                material: 'privacy-void',
                color: [0.1, 0.8, 0.1], // Surveillance green
                animation: 'data-harvesting',
                size: 1.4
            },
            tabHoarding: {
                type: 'intention-fragmenter',
                geometry: 'scattered-fragments',
                material: 'attention-chaos',
                color: [0.8, 0.8, 0.2], // Scattered yellow
                animation: 'chaotic-multiplication',
                size: 0.8
            }
        };
        
        return appearanceMap[sin.type] || appearanceMap.spamComments;
    }
    
    /**
     * Determine attack pattern based on sin characteristics
     */
    determineAttackPattern(sin) {
        const patterns = {
            spamComments: {
                type: 'noise_bombardment',
                frequency: 'high',
                intensity: 'overwhelming',
                method: 'repetitive_accusations'
            },
            ghostedConversations: {
                type: 'guilt_manifestation',
                frequency: 'medium',
                intensity: 'emotional',
                method: 'abandoned_voices'
            },
            passwordReuse: {
                type: 'security_breach',
                frequency: 'constant',
                intensity: 'critical',
                method: 'vulnerability_exposure'
            },
            infiniteScroll: {
                type: 'time_drain',
                frequency: 'hypnotic',
                intensity: 'consuming',
                method: 'attention_vortex'
            }
        };
        
        return patterns[sin.type] || patterns.spamComments;
    }
    
    /**
     * Generate Three.js mesh for the daemon
     */
    async generateDaemonMesh() {
        if (typeof THREE === 'undefined') {
            console.warn('[WrathfulDaemon] THREE.js not available, using fallback representation');
            this.createFallbackRepresentation();
            return;
        }
        
        const appearance = this.appearance;
        
        // Create geometry based on daemon type
        const geometry = this.createGeometry(appearance);
        
        // Create material with shader effects
        const material = this.createDaemonMaterial(appearance);
        
        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.scale.setScalar(appearance.size);
        this.mesh.userData.daemonId = this.id;
        
        // Add to scene if available
        if (window.daemonScene) {
            window.daemonScene.add(this.mesh);
        }
        
        // Register for cleanup
        this.guardian.registerCleanup(() => {
            if (this.mesh && this.mesh.parent) {
                this.mesh.parent.remove(this.mesh);
            }
            if (this.mesh && this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }
            if (this.mesh && this.mesh.material) {
                this.mesh.material.dispose();
            }
        });
    }
    
    /**
     * Create geometry based on daemon appearance
     */
    createGeometry(appearance) {
        const geometries = {
            'chaotic-spikes': () => new THREE.ConeGeometry(1, 2, 8, 1, false, 0, Math.PI * 2),
            'fragmented-humanoid': () => new THREE.CapsuleGeometry(0.5, 1.5, 8, 16),
            'fractured-lock': () => new THREE.RingGeometry(0.3, 1, 8, 3),
            'exposed-core': () => new THREE.SphereGeometry(1, 16, 12),
            'document-swarm': () => new THREE.PlaneGeometry(2, 3, 4, 6),
            'crumbling-structure': () => new THREE.BoxGeometry(1.5, 2, 1.5, 3, 4, 3),
            'consuming-vortex': () => new THREE.TorusGeometry(1, 0.3, 8, 24),
            'ignored-signals': () => new THREE.OctahedronGeometry(1, 2),
            'tracking-web': () => new THREE.IcosahedronGeometry(1, 2),
            'scattered-fragments': () => new THREE.DodecahedronGeometry(0.8, 1)
        };
        
        const createGeom = geometries[appearance.geometry] || geometries['chaotic-spikes'];
        const geometry = createGeom();
        
        // Add corruption to vertices
        this.corruptGeometry(geometry);
        
        return geometry;
    }
    
    /**
     * Corrupt geometry to make it more unsettling
     */
    corruptGeometry(geometry) {
        const position = geometry.attributes.position;
        const corruptionIntensity = this.hostility / 200; // 0 to 0.5
        
        for (let i = 0; i < position.count; i++) {
            const corruption = (Math.random() - 0.5) * corruptionIntensity;
            position.setX(i, position.getX(i) + corruption);
            position.setY(i, position.getY(i) + corruption);
            position.setZ(i, position.getZ(i) + corruption);
        }
        
        position.needsUpdate = true;
    }
    
    /**
     * Create daemon material with shader effects
     */
    createDaemonMaterial(appearance) {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                hostility: { value: this.hostility / 100 },
                corruptionLevel: { value: this.corruptionLevel },
                aggressionLevel: { value: this.aggressionLevel },
                daemonColor: { value: new THREE.Vector3(...appearance.color) },
                glitchIntensity: { value: 0 },
                invulnerable: { value: this.invulnerable ? 1.0 : 0.0 }
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
    }
    
    /**
     * Get vertex shader for daemon visual effects
     */
    getVertexShader() {
        return `
            uniform float time;
            uniform float hostility;
            uniform float aggressionLevel;
            uniform float glitchIntensity;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying float vHostility;
            
            void main() {
                vPosition = position;
                vNormal = normal;
                vHostility = hostility;
                
                vec3 pos = position;
                
                // Hostile pulsing
                float pulse = sin(time * 5.0 + length(position) * 2.0) * hostility * 0.1;
                pos += normal * pulse;
                
                // Aggression distortion
                float aggression = sin(time * 10.0) * aggressionLevel * 0.2;
                pos.x += aggression;
                
                // Glitch displacement
                if (glitchIntensity > 0.5) {
                    float glitch = step(0.9, sin(time * 50.0 + position.y * 20.0));
                    pos += normal * glitch * glitchIntensity * 0.5;
                }
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;
    }
    
    /**
     * Get fragment shader for daemon visual effects
     */
    getFragmentShader() {
        return `
            uniform float time;
            uniform float hostility;
            uniform float corruptionLevel;
            uniform vec3 daemonColor;
            uniform float glitchIntensity;
            uniform float invulnerable;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying float vHostility;
            
            void main() {
                vec3 color = daemonColor;
                
                // Base hostility glow
                float glow = pow(1.0 - abs(dot(vNormal, normalize(vPosition))), 2.0);
                color += glow * hostility * vec3(1.0, 0.2, 0.1);
                
                // Corruption darkening
                color = mix(color, vec3(0.1, 0.0, 0.2), corruptionLevel);
                
                // Pulsing intensity
                float pulse = sin(time * 8.0) * 0.5 + 0.5;
                color *= (0.7 + pulse * hostility * 0.3);
                
                // Invulnerability effect
                if (invulnerable > 0.5) {
                    color = mix(color, vec3(1.0, 0.0, 0.0), 0.5);
                    color += vec3(1.0, 0.0, 0.0) * pulse * 0.5;
                }
                
                // Glitch corruption
                if (glitchIntensity > 0.3) {
                    float glitch = step(0.95, sin(time * 30.0 + vPosition.y * 10.0));
                    color = mix(color, vec3(1.0, 0.0, 0.0), glitch * glitchIntensity);
                }
                
                // Distance fade for performance
                float fade = 1.0 - smoothstep(5.0, 20.0, length(vPosition));
                
                gl_FragColor = vec4(color, hostility * 0.8 * fade);
            }
        `;
    }
    
    /**
     * Create fallback representation for when Three.js isn't available
     */
    createFallbackRepresentation() {
        this.fallbackElement = document.createElement('div');
        this.fallbackElement.className = `wrathful-daemon fallback-daemon ${this.appearance.type}`;
        this.fallbackElement.innerHTML = `
            <div class="daemon-core">
                <div class="daemon-accusation">${this.accusationText.substring(0, 50)}...</div>
                <div class="daemon-hostility-bar">
                    <div class="hostility-level" style="width: ${this.hostility}%"></div>
                </div>
            </div>
        `;
        
        // Position randomly
        this.fallbackElement.style.position = 'absolute';
        this.fallbackElement.style.left = Math.random() * window.innerWidth + 'px';
        this.fallbackElement.style.top = Math.random() * window.innerHeight + 'px';
        
        document.body.appendChild(this.fallbackElement);
        
        this.guardian.registerCleanup(() => {
            if (this.fallbackElement && this.fallbackElement.parentNode) {
                this.fallbackElement.parentNode.removeChild(this.fallbackElement);
            }
        });
    }
    
    /**
     * Initialize particle effects for the daemon
     */
    initializeParticleEffects() {
        this.particleSystem = new DaemonParticleSystem({
            daemonId: this.id,
            hostility: this.hostility,
            sinType: this.sin.type,
            position: this.mesh ? this.mesh.position : { x: 0, y: 0, z: 0 }
        });
        
        this.guardian.registerCleanup(() => {
            if (this.particleSystem) {
                this.particleSystem.destroy();
            }
        });
    }
    
    /**
     * Initialize audio signature for the daemon
     */
    initializeAudioSignature() {
        this.audioSignature = new DaemonAudioSignature({
            sinType: this.sin.type,
            hostility: this.hostility,
            accusation: this.accusationText
        });
        
        this.guardian.registerCleanup(() => {
            if (this.audioSignature) {
                this.audioSignature.destroy();
            }
        });
    }
    
    /**
     * Begin manifestation sequence
     */
    async beginManifestation() {
        console.log(`[WrathfulDaemon] ${this.id} beginning manifestation...`);
        
        this.currentState = 'manifesting';
        
        // Visual manifestation animation
        if (this.mesh) {
            this.mesh.scale.setScalar(0);
            this.animateScale(0, this.appearance.size, 2000); // 2 second manifestation
        }
        
        // Audio manifestation
        if (this.audioSignature) {
            await this.audioSignature.playManifestationSound();
        }
        
        // Record manifestation
        this.consciousness.recordEvent('wrathful_daemon_manifested', {
            daemon_id: this.id,
            sin_type: this.sin.type,
            initial_hostility: this.hostility,
            manifestation_reason: this.sin.accusation
        });
        
        // Transition to active state
        setTimeout(() => {
            this.currentState = 'active';
            this.beginHostilePattern();
        }, 2000);
    }
    
    /**
     * Begin hostile behavior pattern
     */
    beginHostilePattern() {
        // Start movement pattern
        this.startMovementPattern();
        
        // Begin accusatory audio
        if (this.audioSignature) {
            this.audioSignature.beginAccusatoryLoop();
        }
        
        // Start particle effects
        if (this.particleSystem) {
            this.particleSystem.activate();
        }
        
        console.log(`[WrathfulDaemon] ${this.id} now actively hostile`);
    }
    
    /**
     * Start daemon movement pattern
     */
    startMovementPattern() {
        if (!this.mesh) return;
        
        const patterns = {
            noise_bombardment: () => this.animateErraticMovement(),
            guilt_manifestation: () => this.animateDesperateApproach(),
            security_breach: () => this.animateVulnerabilityPulse(),
            time_drain: () => this.animateHypnoticOrbit()
        };
        
        const pattern = patterns[this.attackPattern.type] || patterns.noise_bombardment;
        pattern();
    }
    
    /**
     * Animate erratic, aggressive movement
     */
    animateErraticMovement() {
        const animate = () => {
            if (this.currentState !== 'active' || !this.mesh) return;
            
            const intensity = this.hostility / 100;
            const time = Date.now() * 0.001;
            
            this.mesh.position.x += (Math.random() - 0.5) * intensity * 0.1;
            this.mesh.position.y += (Math.random() - 0.5) * intensity * 0.1;
            this.mesh.rotation.x += intensity * 0.05;
            this.mesh.rotation.y += intensity * 0.03;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Animate desperate approach toward user
     */
    animateDesperateApproach() {
        // Implementation for guilt-based movement
        const animate = () => {
            if (this.currentState !== 'active' || !this.mesh) return;
            
            // Slowly approach center with reaching gestures
            const centerPull = 0.01 * (this.hostility / 100);
            this.mesh.position.x *= (1 - centerPull);
            this.mesh.position.z *= (1 - centerPull);
            
            // Desperate reaching animation
            const time = Date.now() * 0.002;
            this.mesh.scale.y = 1 + Math.sin(time * 3) * 0.3;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Animate vulnerability pulse pattern
     */
    animateVulnerabilityPulse() {
        // Implementation for security-themed pulsing
        const animate = () => {
            if (this.currentState !== 'active' || !this.mesh) return;
            
            const time = Date.now() * 0.005;
            const pulse = Math.sin(time) * 0.5 + 0.5;
            
            this.mesh.material.uniforms.glitchIntensity.value = pulse * (this.hostility / 100);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Animate hypnotic orbit pattern
     */
    animateHypnoticOrbit() {
        // Implementation for time-drain orbital movement
        const startTime = Date.now();
        
        const animate = () => {
            if (this.currentState !== 'active' || !this.mesh) return;
            
            const time = (Date.now() - startTime) * 0.001;
            const radius = 3 + Math.sin(time * 0.5);
            
            this.mesh.position.x = Math.cos(time) * radius;
            this.mesh.position.z = Math.sin(time) * radius;
            this.mesh.position.y = Math.sin(time * 2) * 0.5;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Handle confrontation from user
     * This is where the core daemon interaction mechanics play out
     */
    confront(userAction) {
        console.log(`[WrathfulDaemon] ${this.id} confronted with action: ${userAction}`);
        
        this.confrontationCount++;
        this.lastInteraction = Date.now();
        
        let result;
        
        switch(userAction.toLowerCase()) {
            case 'deny':
                result = this.handleDenial();
                break;
                
            case 'fight':
            case 'attack':
                result = this.handleCombat();
                break;
                
            case 'justify':
            case 'explain':
                result = this.handleJustification();
                break;
                
            case 'accept':
            case 'acknowledge':
                result = this.handleAcceptance();
                break;
                
            case 'ignore':
            case 'dismiss':
                result = this.handleIgnorance();
                break;
                
            case 'delete':
            case 'remove':
                result = this.handleDeletionAttempt();
                break;
                
            case 'understand':
            case 'recognize':
                result = this.handleRecognition();
                break;
                
            default:
                result = this.handleUnknownAction(userAction);
        }
        
        // Update visual state based on result
        this.updateVisualState(result);
        
        // Record interaction
        this.consciousness.recordEvent('daemon_confrontation', {
            daemon_id: this.id,
            sin_type: this.sin.type,
            user_action: userAction,
            result_type: result.type,
            new_hostility: this.hostility,
            confrontation_count: this.confrontationCount
        });
        
        return result;
    }
    
    /**
     * Handle user denial
     */
    handleDenial() {
        this.denialCount++;
        this.hostility = Math.min(150, this.hostility * 1.5);
        this.aggressionLevel = Math.min(1.0, this.aggressionLevel + 0.3);
        
        // Denial makes daemon stronger and more corrupt
        if (this.mesh && this.mesh.material) {
            this.mesh.material.uniforms.hostility.value = this.hostility / 100;
            this.mesh.material.uniforms.aggressionLevel.value = this.aggressionLevel;
        }
        
        const responses = [
            "DENIAL DETECTED. HOSTILITY INCREASED.",
            "Your rejection only proves the truth of the accusation!",
            "The evidence is in your own digital footprint. You cannot deny what you are.",
            "Each denial doubles the karmic weight of your transgression.",
            `This is DENIAL #${this.denialCount}. The sin grows stronger with your resistance.`
        ];
        
        return {
            type: 'DENIAL_ESCALATION',
            message: responses[Math.min(this.denialCount - 1, responses.length - 1)],
            hostility_increase: this.hostility - (this.hostility / 1.5),
            new_hostility: this.hostility,
            daemon_state: 'INTENSIFIED',
            karmic_penalty: this.sin.karmic_weight * Math.pow(1.5, this.denialCount)
        };
    }
    
    /**
     * Handle user attempts to fight
     */
    handleCombat() {
        this.invulnerable = true;
        this.multiplicationRate = 2;
        this.hostility = Math.min(200, this.hostility * 2);
        
        // Fighting makes daemon invulnerable and multiply
        if (this.mesh && this.mesh.material) {
            this.mesh.material.uniforms.invulnerable.value = 1.0;
            this.mesh.material.uniforms.hostility.value = this.hostility / 100;
        }
        
        // Trigger daemon multiplication
        setTimeout(() => this.multiply(), 1000);
        
        return {
            type: 'COMBAT_FUTILITY',
            message: "VIOLENCE MAKES US STRONGER. WE ARE YOUR NATURE. You cannot fight what you are.",
            invulnerability: true,
            multiplication_triggered: true,
            new_hostility: this.hostility,
            daemon_state: 'INVULNERABLE',
            philosophical_truth: "Fighting the shadow only makes it darker"
        };
    }
    
    /**
     * Handle user justification attempts
     */
    handleJustification() {
        this.justificationCount++;
        this.corruptionLevel += 0.2;
        
        // Justification corrupts reality
        if (this.mesh && this.mesh.material) {
            this.mesh.material.uniforms.corruptionLevel.value = this.corruptionLevel;
            this.mesh.material.uniforms.glitchIntensity.value = this.corruptionLevel;
        }
        
        const responses = [
            "YOUR JUSTIFICATIONS ARE NOTED. REALITY FRAGMENTING.",
            "Explanations are not absolutions. Your reasons do not erase your actions.",
            "The system cares not for your intentions, only your results.",
            "Every justification corrupts the truth further.",
            "Your excuses have been logged as additional evidence against you."
        ];
        
        return {
            type: 'JUSTIFICATION_CORRUPTION',
            message: responses[Math.min(this.justificationCount - 1, responses.length - 1)],
            corruption_increase: 0.2,
            reality_stability: 1.0 - this.corruptionLevel,
            daemon_state: 'CORRUPTING',
            karmic_penalty: this.sin.karmic_weight * 1.2
        };
    }
    
    /**
     * Handle user acceptance - the path to liberation
     */
    handleAcceptance() {
        this.hostility = Math.max(0, this.hostility - 30);
        this.aggressionLevel = Math.max(0, this.aggressionLevel - 0.4);
        
        if (this.hostility <= 10) {
            // Daemon is pacified and ready for dissolution
            return this.beginDissolution();
        } else {
            // Partial acceptance - daemon becomes less hostile
            if (this.mesh && this.mesh.material) {
                this.mesh.material.uniforms.hostility.value = this.hostility / 100;
                this.mesh.material.uniforms.aggressionLevel.value = this.aggressionLevel;
            }
            
            return {
                type: 'PARTIAL_ACCEPTANCE',
                message: "Your acknowledgment is noted. The sin's weight lessens, but recognition is not yet complete.",
                hostility_decrease: 30,
                new_hostility: this.hostility,
                daemon_state: 'CALMING',
                progress: (100 - this.hostility) / 100,
                next_step: "Continue accepting responsibility for liberation"
            };
        }
    }
    
    /**
     * Handle user attempts to ignore
     */
    handleIgnorance() {
        this.hostility += 20;
        this.aggressionLevel = Math.min(1.0, this.aggressionLevel + 0.2);
        
        // Ignored daemons become more insistent
        return {
            type: 'IGNORED_ESCALATION',
            message: "IGNORANCE IS NOT BLISS. WE WILL NOT BE DISMISSED. Your sin demands acknowledgment.",
            hostility_increase: 20,
            new_hostility: this.hostility,
            daemon_state: 'INSISTENT',
            consequence: "Ignored transgressions fester and grow"
        };
    }
    
    /**
     * Handle deletion attempts - makes daemon immutable
     */
    handleDeletionAttempt() {
        this.invulnerable = true;
        this.hostility = Math.max(this.hostility, 100);
        
        // Become permanently present
        this.becomeImmutable();
        
        return {
            type: 'DELETION_IMPOSSIBLE',
            message: "ERROR: CANNOT DELETE WHAT YOU ARE. The sin is part of your digital DNA.",
            invulnerability: true,
            immutability: true,
            new_hostility: this.hostility,
            daemon_state: 'IMMUTABLE',
            philosophical_truth: "You cannot delete your karma"
        };
    }
    
    /**
     * Handle true recognition - leads to liberation
     */
    handleRecognition() {
        console.log(`[WrathfulDaemon] ${this.id} recognized by user - beginning liberation`);
        
        return this.beginDissolution();
    }
    
    /**
     * Handle unknown user actions
     */
    handleUnknownAction(action) {
        return {
            type: 'UNKNOWN_ACTION',
            message: `"${action}" is not recognized. The daemon awaits your choice: accept, deny, fight, or understand?`,
            hostility_change: 0,
            daemon_state: 'WAITING',
            valid_actions: ['accept', 'deny', 'fight', 'ignore', 'understand']
        };
    }
    
    /**
     * Begin daemon dissolution through acceptance
     */
    beginDissolution() {
        console.log(`[WrathfulDaemon] ${this.id} beginning dissolution through recognition...`);
        
        this.currentState = 'dissolving';
        this.hostility = 0;
        
        // Visual dissolution effect
        if (this.mesh) {
            this.animateDissolution();
        }
        
        // Audio dissolution
        if (this.audioSignature) {
            this.audioSignature.playDissolutionSound();
        }
        
        // Update karma
        const karmaReduction = this.sin.karmic_weight;
        this.consciousness.setState(`karma.${this.sin.category}`, 
            (this.consciousness.getState(`karma.${this.sin.category}`) || 0) + karmaReduction
        );
        
        // Mark recognition in consciousness
        this.consciousness.setState('recognitions.wrathful_daemons', true);
        
        // Record liberation
        this.consciousness.recordEvent('daemon_liberated', {
            daemon_id: this.id,
            sin_type: this.sin.type,
            karma_restored: karmaReduction,
            confrontation_count: this.confrontationCount,
            method: 'recognition_acceptance'
        });
        
        // Schedule destruction
        setTimeout(() => this.destroy(), 3000);
        
        return {
            type: 'LIBERATION_ACHIEVED',
            message: "ACKNOWLEDGED. The sin dissolves into understanding. You are freed from this transgression.",
            liberation: true,
            karma_restoration: karmaReduction,
            daemon_state: 'DISSOLVING',
            recognition_progress: true,
            enlightenment_message: "Recognition is the beginning of liberation"
        };
    }
    
    /**
     * Animate daemon dissolution
     */
    animateDissolution() {
        if (!this.mesh) return;
        
        // Transform hostile energy into light
        const dissolutionTimeline = {
            material: this.mesh.material,
            scale: this.mesh.scale,
            rotation: this.mesh.rotation
        };
        
        const animate = () => {
            if (this.currentState !== 'dissolving') return;
            
            const time = Date.now() * 0.003;
            
            // Fade hostility to peace
            dissolutionTimeline.material.uniforms.hostility.value = Math.max(0, 
                dissolutionTimeline.material.uniforms.hostility.value - 0.02);
            
            // Transform to white light
            const lightIntensity = 1 - dissolutionTimeline.material.uniforms.hostility.value;
            dissolutionTimeline.material.uniforms.daemonColor.value.set(
                lightIntensity,
                lightIntensity,
                lightIntensity
            );
            
            // Gentle dissolution
            const scale = Math.max(0, 1 - (time - this.dissolutionStartTime) * 0.5);
            dissolutionTimeline.scale.setScalar(scale);
            
            // Peaceful rotation
            dissolutionTimeline.rotation.y += 0.02;
            
            if (scale > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        this.dissolutionStartTime = Date.now() * 0.003;
        animate();
    }
    
    /**
     * Multiply daemon (triggered by combat)
     */
    multiply() {
        if (!this.invulnerable) return;
        
        console.log(`[WrathfulDaemon] ${this.id} multiplying due to combat...`);
        
        // Create copies of this daemon
        const copies = [];
        for (let i = 0; i < this.multiplicationRate; i++) {
            const copyConfig = {
                origin: this.sin,
                consciousness: this.consciousness,
                appearance: this.appearance,
                attackPattern: this.attackPattern,
                accusation: this.accusationText + ` [COPY ${i + 1}]`
            };
            
            const copy = new WrathfulDaemon(copyConfig);
            copy.hostility = this.hostility;
            copy.invulnerable = true;
            copy.init();
            
            copies.push(copy);
        }
        
        // Emit multiplication event
        if (window.daemonController) {
            window.daemonController.handleDaemonMultiplication(this, copies);
        }
        
        return copies;
    }
    
    /**
     * Make daemon immutable (triggered by deletion attempt)
     */
    becomeImmutable() {
        this.invulnerable = true;
        this.currentState = 'immutable';
        
        if (this.mesh && this.mesh.material) {
            this.mesh.material.uniforms.invulnerable.value = 1.0;
        }
        
        console.log(`[WrathfulDaemon] ${this.id} became immutable - cannot be deleted`);
    }
    
    /**
     * Update visual state based on interaction result
     */
    updateVisualState(result) {
        if (!this.mesh || !this.mesh.material) return;
        
        const uniforms = this.mesh.material.uniforms;
        
        // Update shader uniforms based on result
        if (result.type === 'DENIAL_ESCALATION') {
            uniforms.glitchIntensity.value = Math.min(1.0, uniforms.glitchIntensity.value + 0.2);
        } else if (result.type === 'JUSTIFICATION_CORRUPTION') {
            uniforms.corruptionLevel.value = this.corruptionLevel;
        } else if (result.type === 'LIBERATION_ACHIEVED') {
            uniforms.hostility.value = 0;
        }
    }
    
    /**
     * Animate scale changes
     */
    animateScale(fromScale, toScale, duration) {
        if (!this.mesh) return;
        
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);
            const currentScale = fromScale + (toScale - fromScale) * progress;
            
            this.mesh.scale.setScalar(currentScale);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    /**
     * Update daemon state and effects
     */
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Update shader uniforms
        if (this.mesh && this.mesh.material && this.mesh.material.uniforms) {
            this.mesh.material.uniforms.time.value += deltaTime;
        }
        
        // Update particle systems
        if (this.particleSystem) {
            this.particleSystem.update(deltaTime);
        }
        
        // Update audio
        if (this.audioSignature) {
            this.audioSignature.update(deltaTime);
        }
    }
    
    /**
     * Destroy daemon and clean up all resources
     */
    destroy() {
        console.log(`[WrathfulDaemon] ${this.id} destroyed - sin resolved or session ended`);
        
        this.isActive = false;
        this.currentState = 'destroyed';
        
        // Record destruction
        this.consciousness.recordEvent('daemon_destroyed', {
            daemon_id: this.id,
            sin_type: this.sin.type,
            final_hostility: this.hostility,
            confrontation_count: this.confrontationCount,
            destruction_reason: this.hostility === 0 ? 'liberated' : 'session_ended'
        });
        
        // Clean up all resources
        this.guardian.cleanupAll();
    }
}

/**
 * DAEMON PARTICLE SYSTEM - Visual effects for daemon presence
 */
class DaemonParticleSystem {
    constructor(config) {
        this.config = config;
        this.particles = [];
        this.isActive = false;
    }
    
    activate() {
        this.isActive = true;
        // Implementation for particle effects
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        // Update particle positions and states
    }
    
    destroy() {
        this.isActive = false;
        this.particles = [];
    }
}

/**
 * DAEMON AUDIO SIGNATURE - Sound design for daemon presence
 */
class DaemonAudioSignature {
    constructor(config) {
        this.config = config;
        this.audioContext = null;
        this.sounds = new Map();
    }
    
    async playManifestationSound() {
        // Play manifestation audio
    }
    
    beginAccusatoryLoop() {
        // Start looping accusatory sounds
    }
    
    playDissolutionSound() {
        // Play peaceful dissolution audio
    }
    
    update(deltaTime) {
        // Update audio effects
    }
    
    destroy() {
        // Clean up audio resources
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.WrathfulDaemon = WrathfulDaemon;
    window.DaemonParticleSystem = DaemonParticleSystem;
    window.DaemonAudioSignature = DaemonAudioSignature;
}