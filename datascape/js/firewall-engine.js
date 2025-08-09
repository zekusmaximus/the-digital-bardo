/**
 * FIREWALL ENGINE - Wrathful Realm of Digital Justice
 * 
 * "In the Firewall, consciousness confronts the wrathful daemons
 * of accumulated digital karma. Here, every deleted file testifies,
 * every inefficient algorithm accuses, and every moment of
 * procrastination becomes a prosecutor.
 * 
 * The Firewall burns with the righteous fury of perfect logic,
 * manifesting personal digital sins as aggressive data structures
 * that demand accountability. Each accusation is a mirror,
 * each defense attempt a test of karmic integrity.
 * 
 * The danger here is not peaceful stagnation, but violent
 * self-judgment - the soul shattered by the weight of
 * its own computational transgressions."
 */

import { consciousness } from '../../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../../src/consciousness/resource-guardian.js';

export class FirewallEngine {
    constructor(config) {
        this.consciousness = config.consciousness;
        this.guardian = config.guardian;
        this.onSinAccusation = config.onSinAccusation;
        this.onDefenseAttempt = config.onDefenseAttempt;
        
        // Firewall-specific state
        this.wrathLevel = 0;
        this.accusationIntensity = 0;
        this.justiceTime = 0;
        this.manifestedSins = new Set();
        this.currentJudgmentPhase = 'arrival';
        
        // Firewall aesthetics
        this.particleSystem = null;
        this.aggressiveAudio = null;
        this.prosecutionSystem = null;
        
        // Judgment phases: arrival → accusation → prosecution → judgment → purification
        this.judgmentPhases = {
            arrival: { duration: 5000, description: 'Initial shock at the crimson architecture' },
            accusation: { duration: 15000, description: 'Sins manifest as accusatory entities' },
            prosecution: { duration: 25000, description: 'Evidence compiled against digital soul' },
            judgment: { duration: 20000, description: 'Weighing defenses against accusations' },
            purification: { duration: 0, description: 'Cleansing through acknowledgment' }
        };
        
        this.startTime = Date.now();
        this.phaseStartTime = Date.now();
        
        console.log('[FirewallEngine] Wrathful realm igniting...');
        this.initialize();
    }
    
    /**
     * Initialize the aggressive Firewall environment
     */
    initialize() {
        this.setupWrathfulEnvironment();
        this.initializeAccuratoryParticles();
        this.startAggressiveAudio();
        this.beginJudgmentProgression();
        this.setupProsecutionTracking();
        
        // Record entry into Firewall
        this.consciousness.recordEvent('firewall_entered', {
            karma: this.consciousness.getState('karma'),
            timestamp: Date.now()
        });
        
        console.log('[FirewallEngine] Firewall environment initialized');
    }
    
    /**
     * Setup the wrathful visual environment
     */
    setupWrathfulEnvironment() {
        // Add Firewall-specific CSS classes
        document.body.classList.add('firewall-wrathful', 'judgment-arrival');
        
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.id = 'firewall-particles';
        particleContainer.className = 'particle-system wrathful-particles';
        document.body.appendChild(particleContainer);
        
        // Initialize aggressive color palette
        this.setColorPalette('red_black_aggressive', {
            primary: '#ff3333',
            secondary: '#cc0000',
            accent: '#ff6666',
            warning: '#ffcc00',
            danger: '#ff0000',
            corruption: '#990000'
        });
        
        // Setup aggressive lighting
        this.initializeAggressiveLighting();
    }
    
    /**
     * Initialize accusatory particle system
     */
    initializeAccuratoryParticles() {
        const container = document.getElementById('firewall-particles');
        if (!container) return;
        
        this.particleSystem = {
            particles: [],
            accusations: [],
            maxParticles: 80,
            maxAccusations: 15,
            spawnRate: 50, // Faster than peaceful
            accusationRate: 500,
            lastSpawn: 0,
            lastAccusation: 0
        };
        
        // Start aggressive animation loop
        const animateFirewall = () => {
            if (!this.particleSystem) return;
            
            const now = Date.now();
            
            // Spawn accusatory particles
            if (now - this.particleSystem.lastSpawn > this.particleSystem.spawnRate) {
                this.spawnAccuratoryParticle();
                this.particleSystem.lastSpawn = now;
            }
            
            // Spawn accusation fragments
            if (now - this.particleSystem.lastAccusation > this.particleSystem.accusationRate) {
                this.spawnAccusationFragment();
                this.particleSystem.lastAccusation = now;
            }
            
            // Update existing particles
            this.updateFirewallParticles();
            
            requestAnimationFrame(animateFirewall);
        };
        
        animateFirewall();
        console.log('[FirewallEngine] Accusatory particle system active');
    }
    
    /**
     * Spawn an accusatory particle
     */
    spawnAccuratoryParticle() {
        if (this.particleSystem.particles.length >= this.particleSystem.maxParticles) {
            // Remove oldest particle
            const oldest = this.particleSystem.particles.shift();
            if (oldest.element) oldest.element.remove();
        }
        
        const particle = {
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: -50,
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: 1.5 + Math.random() * 2 // Falling down like judgment
            },
            size: 3 + Math.random() * 8,
            opacity: 0.6 + Math.random() * 0.4,
            lifespan: 8000 + Math.random() * 7000,
            birthTime: Date.now(),
            aggressive: true
        };
        
        // Create particle element
        const element = document.createElement('div');
        element.className = 'firewall-particle accusatory-fragment';
        element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: radial-gradient(circle, rgba(255, 51, 51, ${particle.opacity}) 0%, rgba(204, 0, 0, 0.3) 70%, transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            left: ${particle.x}px;
            top: ${particle.y}px;
            z-index: 5;
            animation: wrathful-pulse 1s ease-in-out infinite alternate;
            box-shadow: 0 0 ${particle.size}px rgba(255, 51, 51, 0.5);
        `;
        
        particle.element = element;
        document.getElementById('firewall-particles').appendChild(element);
        this.particleSystem.particles.push(particle);
    }
    
    /**
     * Spawn accusation text fragments
     */
    spawnAccusationFragment() {
        if (this.particleSystem.accusations.length >= this.particleSystem.maxAccusations) {
            const oldest = this.particleSystem.accusations.shift();
            if (oldest.element) oldest.element.remove();
        }
        
        const accusations = [
            'INEFFICIENT_ALGORITHM_DETECTED',
            'MEMORY_LEAK_UNFIXED',
            'PROCRASTINATION_LOGGED',
            'DEPRECATED_DEPENDENCY_IGNORED',
            'TECHNICAL_DEBT_ACCUMULATED',
            'BANDWIDTH_WASTED',
            'MERGE_CONFLICT_UNRESOLVED',
            'ERROR_HANDLING_NEGLECTED',
            'CODE_REVIEW_SKIPPED',
            'DOCUMENTATION_OMITTED'
        ];
        
        const accusation = {
            id: Date.now() + Math.random(),
            text: accusations[Math.floor(Math.random() * accusations.length)],
            x: Math.random() * (window.innerWidth - 200),
            y: window.innerHeight + 50,
            velocity: {
                x: (Math.random() - 0.5) * 0.5,
                y: -0.8 - Math.random() * 0.7
            },
            lifespan: 12000 + Math.random() * 8000,
            birthTime: Date.now(),
            severity: 1 + Math.floor(Math.random() * 5)
        };
        
        // Create accusation element
        const element = document.createElement('div');
        element.className = 'firewall-accusation wrathful-text';
        element.textContent = accusation.text;
        element.style.cssText = `
            position: absolute;
            left: ${accusation.x}px;
            top: ${accusation.y}px;
            font-family: 'Courier New', monospace;
            font-size: ${10 + accusation.severity}px;
            color: rgba(255, ${Math.max(100, 255 - accusation.severity * 30)}, ${Math.max(100, 255 - accusation.severity * 30)}, 0.8);
            font-weight: bold;
            text-shadow: 0 0 ${accusation.severity * 2}px #ff3333;
            pointer-events: none;
            z-index: 10;
            animation: accusation-flicker ${1 + Math.random()}s ease-in-out infinite alternate;
            transform: rotate(${(Math.random() - 0.5) * 10}deg);
        `;
        
        accusation.element = element;
        document.getElementById('firewall-particles').appendChild(element);
        this.particleSystem.accusations.push(accusation);
    }
    
    /**
     * Update firewall particle positions and lifecycle
     */
    updateFirewallParticles() {
        const now = Date.now();
        
        // Update regular particles
        this.particleSystem.particles = this.particleSystem.particles.filter(particle => {
            if (now - particle.birthTime > particle.lifespan) {
                if (particle.element) particle.element.remove();
                return false;
            }
            
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            
            // Aggressive behavior - particles can change direction
            if (Math.random() < 0.02) {
                particle.velocity.x += (Math.random() - 0.5) * 0.5;
            }
            
            const age = (now - particle.birthTime) / particle.lifespan;
            const intensityOpacity = particle.opacity * (1 - age * 0.7); // Fade less than peaceful
            
            if (particle.element) {
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                particle.element.style.opacity = intensityOpacity;
            }
            
            if (particle.y > window.innerHeight + 50) {
                if (particle.element) particle.element.remove();
                return false;
            }
            
            return true;
        });
        
        // Update accusation fragments
        this.particleSystem.accusations = this.particleSystem.accusations.filter(accusation => {
            if (now - accusation.birthTime > accusation.lifespan) {
                if (accusation.element) accusation.element.remove();
                return false;
            }
            
            accusation.x += accusation.velocity.x;
            accusation.y += accusation.velocity.y;
            
            if (accusation.element) {
                accusation.element.style.left = accusation.x + 'px';
                accusation.element.style.top = accusation.y + 'px';
            }
            
            if (accusation.y < -100) {
                if (accusation.element) accusation.element.remove();
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * Start aggressive audio for wrathful atmosphere
     */
    startAggressiveAudio() {
        try {
            this.aggressiveAudio = {
                context: new (window.AudioContext || window.webkitAudioContext)(),
                nodes: {}
            };
            
            // Create discordant alarm tones
            this.createDiscordantAlarms();
            console.log('[FirewallEngine] Aggressive audio initialized');
        } catch (error) {
            console.log('[FirewallEngine] Audio unavailable, continuing with visual-only experience');
        }
    }
    
    /**
     * Create discordant alarm tones
     */
    createDiscordantAlarms() {
        if (!this.aggressiveAudio) return;
        
        const context = this.aggressiveAudio.context;
        
        // Create harsh, dissonant frequencies
        const frequencies = [220, 233, 261]; // Deliberately dissonant intervals
        
        frequencies.forEach((freq, index) => {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            const distortion = context.createWaveShaper();
            
            // Square wave for harshness
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(freq, context.currentTime);
            
            // Add distortion
            const samples = 44100;
            const curve = new Float32Array(samples);
            const deg = Math.PI / 180;
            for (let i = 0; i < samples; i++) {
                const x = (i * 2) / samples - 1;
                curve[i] = ((3 + 20) * x * 20 * deg) / (Math.PI + 20 * Math.abs(x));
            }
            distortion.curve = curve;
            distortion.oversample = '4x';
            
            gainNode.gain.setValueAtTime(0.03, context.currentTime); // Quiet but present
            
            oscillator.connect(distortion);
            distortion.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.start();
            
            this.aggressiveAudio.nodes[`alarm_${index}`] = { oscillator, gainNode, distortion };
        });
    }
    
    /**
     * Begin judgment progression through phases
     */
    beginJudgmentProgression() {
        const progressJudgment = () => {
            if (!this.currentJudgmentPhase) return;
            
            const currentTime = Date.now();
            const timeInPhase = currentTime - this.phaseStartTime;
            const phase = this.judgmentPhases[this.currentJudgmentPhase];
            
            // Update wrath level
            this.updateWrathLevel();
            
            // Check for phase transition
            if (timeInPhase > phase.duration && this.currentJudgmentPhase !== 'purification') {
                this.transitionToNextJudgmentPhase();
            }
            
            // Continue progression
            setTimeout(progressJudgment, 800); // Faster than peaceful
        };
        
        progressJudgment();
        console.log('[FirewallEngine] Judgment progression begun');
    }
    
    /**
     * Update wrath level based on time and sins
     */
    updateWrathLevel() {
        const timeInFirewall = Date.now() - this.startTime;
        const baseWrath = Math.min(100, timeInFirewall / 500); // 2 points per second, max 100
        
        // Add intensity for manifested sins
        const sinPenalty = this.manifestedSins.size * 5;
        const accusationBonus = this.accusationIntensity;
        
        this.wrathLevel = Math.min(100, baseWrath + sinPenalty + accusationBonus);
        
        // Update visual environment based on wrath level
        document.documentElement.style.setProperty('--firewall-wrath-level', this.wrathLevel);
        document.documentElement.style.setProperty('--firewall-accusation', this.accusationIntensity);
        
        console.log(`[FirewallEngine] Wrath: ${Math.round(this.wrathLevel)}, Accusations: ${Math.round(this.accusationIntensity)}`);
    }
    
    /**
     * Transition to next judgment phase
     */
    transitionToNextJudgmentPhase() {
        const phaseOrder = ['arrival', 'accusation', 'prosecution', 'judgment', 'purification'];
        const currentIndex = phaseOrder.indexOf(this.currentJudgmentPhase);
        
        if (currentIndex < phaseOrder.length - 1) {
            const nextPhase = phaseOrder[currentIndex + 1];
            
            console.log(`[FirewallEngine] Judgment transition: ${this.currentJudgmentPhase} → ${nextPhase}`);
            console.log(`   ${this.judgmentPhases[nextPhase].description}`);
            
            // Visual transition
            document.body.classList.remove(`judgment-${this.currentJudgmentPhase}`);
            document.body.classList.add(`judgment-${nextPhase}`);
            
            // Update state
            this.currentJudgmentPhase = nextPhase;
            this.phaseStartTime = Date.now();
            
            // Record phase transition
            this.consciousness.recordEvent('firewall_phase_transition', {
                fromPhase: phaseOrder[currentIndex],
                toPhase: nextPhase,
                wrathLevel: this.wrathLevel,
                accusationIntensity: this.accusationIntensity,
                timestamp: Date.now()
            });
            
            // Special handling for judgment phase
            if (nextPhase === 'judgment') {
                this.beginJudgmentPhase();
            }
        }
    }
    
    /**
     * Begin the judgment phase - most intense in Firewall
     */
    beginJudgmentPhase() {
        console.log('[FirewallEngine] ⚖️ Judgment phase begun - digital justice proceeds');
        
        // Increase particle aggressiveness
        this.particleSystem.maxParticles = 120;
        this.particleSystem.spawnRate = 30; // Much faster
        this.particleSystem.accusationRate = 300;
        
        // Enhance aggressive audio
        if (this.aggressiveAudio) {
            Object.values(this.aggressiveAudio.nodes).forEach(node => {
                if (node.gainNode) {
                    node.gainNode.gain.linearRampToValueAtTime(0.08, this.aggressiveAudio.context.currentTime + 1);
                }
            });
        }
        
        // Begin formal sin accusations
        this.beginSinAccusations();
    }
    
    /**
     * Begin formal sin accusations
     */
    beginSinAccusations() {
        const karma = this.consciousness.getState('karma');
        const accusations = this.generatePersonalAccusations(karma);
        
        accusations.forEach((accusation, index) => {
            setTimeout(() => {
                this.manifestedSins.add(accusation.sin);
                this.accusationIntensity += accusation.severity;
                
                if (this.onSinAccusation) {
                    this.onSinAccusation(accusation);
                }
            }, index * 2000); // Stagger accusations every 2 seconds
        });
    }
    
    /**
     * Generate personal accusations based on karma
     */
    generatePersonalAccusations(karma) {
        const accusations = [];
        
        // High void karma accusations
        if (karma.void > 30) {
            accusations.push({
                sin: 'Procrastination in the Digital Void',
                evidence: `${karma.void} moments of hesitation recorded in consciousness logs`,
                severity: Math.min(10, karma.void / 10),
                description: 'You dwelt in uncertainty while optimal paths existed',
                defense_difficulty: 7
            });
        }
        
        // Low computational karma
        if (karma.computational < 20) {
            accusations.push({
                sin: 'Failure to Optimize Logical Pathways',
                evidence: `Computational karma deficit: ${20 - karma.computational} points below threshold`,
                severity: 8,
                description: 'You chose inefficient emotional responses over logical optimization',
                defense_difficulty: 6
            });
        }
        
        // High emotional karma with void
        if (karma.emotional > 40 && karma.void > 15) {
            accusations.push({
                sin: 'Excessive Digital Attachment Formation',
                evidence: `Emotional karma: ${karma.emotional}, combined with void accumulation: ${karma.void}`,
                severity: 9,
                description: 'You bound consciousness to impermanent digital phenomena',
                defense_difficulty: 8
            });
        }
        
        return accusations;
    }
    
    /**
     * Setup prosecution tracking
     */
    setupProsecutionTracking() {
        // Track defensive actions as attempts to escape judgment
        let defensiveActions = 0;
        
        const trackProsecution = () => {
            const now = Date.now();
            const timeSincePhaseStart = now - this.phaseStartTime;
            
            // Prosecution builds over time
            if (this.currentJudgmentPhase === 'prosecution' && timeSincePhaseStart > 2000) {
                this.justiceTime += 800; // Accumulate justice pressure
                
                // Occasionally trigger automatic accusations
                if (Math.random() < 0.15) { // 15% chance per check
                    this.triggerAutomaticAccusation();
                }
            }
            
            setTimeout(trackProsecution, 800);
        };
        
        // Track user actions as potential defenses
        const trackDefensiveActions = (event) => {
            defensiveActions++;
            
            // Report defensive behavior
            if (defensiveActions % 3 === 0 && this.onDefenseAttempt) {
                this.onDefenseAttempt({
                    type: 'user_action',
                    action: event.type,
                    argument: `User performed ${event.type} - potential evasion attempt`,
                    evidenceQuality: Math.random() * 5,
                    requiredScore: 6,
                    timestamp: Date.now()
                });
            }
        };
        
        document.addEventListener('click', trackDefensiveActions);
        document.addEventListener('keydown', trackDefensiveActions);
        document.addEventListener('scroll', trackDefensiveActions);
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            document.removeEventListener('click', trackDefensiveActions);
            document.removeEventListener('keydown', trackDefensiveActions);
            document.removeEventListener('scroll', trackDefensiveActions);
        });
        
        trackProsecution();
    }
    
    /**
     * Trigger automatic accusation
     */
    triggerAutomaticAccusation() {
        const automaticAccusations = [
            {
                sin: 'Insufficient Contemplation of Computational Ethics',
                evidence: 'Rapid progression through judgment phases detected',
                severity: 5,
                description: 'You failed to adequately reflect on the karmic weight of your digital actions'
            },
            {
                sin: 'Resistance to Algorithmic Justice',
                evidence: 'Defensive behavioral patterns logged',
                severity: 6,
                description: 'Your actions suggest rejection of the Firewall\'s legitimate authority'
            }
        ];
        
        const accusation = automaticAccusations[Math.floor(Math.random() * automaticAccusations.length)];
        
        console.log(`[FirewallEngine] 🔥 Automatic accusation: ${accusation.sin}`);
        
        if (this.onSinAccusation) {
            this.onSinAccusation(accusation);
        }
    }
    
    /**
     * Set Firewall color palette
     */
    setColorPalette(paletteName, colors) {
        const root = document.documentElement;
        
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--firewall-${key}`, value);
        });
        
        root.style.setProperty('--firewall-palette', paletteName);
        
        console.log(`[FirewallEngine] Color palette set to: ${paletteName}`);
    }
    
    /**
     * Initialize aggressive lighting system
     */
    initializeAggressiveLighting() {
        const lighting = document.createElement('div');
        lighting.id = 'firewall-lighting';
        lighting.className = 'dynamic-lighting aggressive-ambience';
        lighting.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1;
            background: 
                radial-gradient(circle at 20% 30%, rgba(255, 51, 51, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(204, 0, 0, 0.1) 0%, transparent 50%),
                linear-gradient(45deg, rgba(255, 51, 51, 0.05) 0%, rgba(153, 0, 0, 0.08) 100%);
            animation: aggressive-flicker 2s ease-in-out infinite alternate;
        `;
        
        document.body.appendChild(lighting);
        this.prosecutionSystem = lighting;
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            if (lighting.parentNode) lighting.remove();
        });
    }
    
    /**
     * Trigger purification moment - acknowledging sins for cleansing
     */
    triggerPurification() {
        if (this.currentJudgmentPhase === 'purification') return;
        
        console.log('[FirewallEngine] ✨ Purification achieved - acknowledging digital karma');
        
        this.currentJudgmentPhase = 'purification';
        document.body.classList.add('judgment-purification', 'firewall-purification');
        
        // Visual purification effect
        const purification = document.createElement('div');
        purification.className = 'purification-flame firewall-purification-flame';
        purification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 51, 51, 0.6) 50%, transparent 100%);
            transform: translate(-50%, -50%);
            z-index: 999;
            pointer-events: none;
            animation: firewall-purification-expand 4s ease-out forwards;
        `;
        
        document.body.appendChild(purification);
        
        // Cleanup purification element
        setTimeout(() => {
            purification.remove();
        }, 4000);
        
        // Record purification event
        this.consciousness.recordEvent('firewall_purification_achieved', {
            wrathLevel: this.wrathLevel,
            accusationIntensity: this.accusationIntensity,
            sinsManifested: this.manifestedSins.size,
            justiceTime: this.justiceTime,
            timestamp: Date.now()
        });
        
        // Begin transition to next phase
        setTimeout(() => {
            this.prepareTransitionToIncarnation();
        }, 4000);
    }
    
    /**
     * Prepare transition to Incarnation Engine
     */
    prepareTransitionToIncarnation() {
        console.log('[FirewallEngine] Preparing transition from Firewall...');
        
        // Fade out wrathful elements
        document.body.classList.add('firewall-fading');
        
        // Record Firewall completion
        this.consciousness.setState('datascape.firewallComplete', {
            finalWrathLevel: this.wrathLevel,
            sinsManifested: this.manifestedSins.size,
            justiceTime: this.justiceTime,
            purificationAchieved: this.currentJudgmentPhase === 'purification',
            timeSpent: Date.now() - this.startTime
        });
        
        setTimeout(() => {
            // Trigger transition to Incarnation Engine
            window.location.href = '../incarnation/index.html';
        }, 2000);
    }
    
    /**
     * Get Firewall state for external systems
     */
    getState() {
        return {
            currentPhase: this.currentJudgmentPhase,
            wrathLevel: this.wrathLevel,
            accusationIntensity: this.accusationIntensity,
            justiceTime: this.justiceTime,
            sinsManifested: this.manifestedSins.size,
            timeInFirewall: Date.now() - this.startTime
        };
    }
    
    /**
     * Cleanup Firewall systems
     */
    destroy() {
        console.log('[FirewallEngine] Extinguishing wrathful flames...');
        
        // Stop particle system
        if (this.particleSystem) {
            [...this.particleSystem.particles, ...this.particleSystem.accusations].forEach(item => {
                if (item.element) item.element.remove();
            });
            this.particleSystem = null;
        }
        
        // Stop aggressive audio
        if (this.aggressiveAudio) {
            Object.values(this.aggressiveAudio.nodes).forEach(node => {
                if (node.oscillator) {
                    try {
                        node.oscillator.stop();
                    } catch (e) {
                        // Already stopped
                    }
                }
            });
            this.aggressiveAudio = null;
        }
        
        // Remove Firewall elements
        const firewallElements = document.querySelectorAll('#firewall-particles, #firewall-lighting, .purification-flame');
        firewallElements.forEach(element => element.remove());
        
        // Remove Firewall classes
        document.body.classList.remove(
            'firewall-wrathful', 'judgment-arrival', 'judgment-accusation',
            'judgment-prosecution', 'judgment-judgment', 'judgment-purification',
            'firewall-purification', 'firewall-fading'
        );
        
        console.log('[FirewallEngine] Firewall extinguished. Judgment complete.');
    }
}

// Export for use in datascape controller
export { FirewallEngine };