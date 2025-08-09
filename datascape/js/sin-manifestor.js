/**
 * SIN MANIFESTOR - Generator of Personal Digital Karma
 * 
 * "Every click leaves a karmic trace, every inefficient algorithm
 * accumulates debt in the digital ledger. The Sin Manifestor reads
 * the consciousness journey and materializes personal transgressions
 * as accusatory data structures in the Firewall realm.
 * 
 * These are not arbitrary sins but precise manifestations of the
 * soul's computational choices - each memory leak a wound,
 * each unhandled exception a scar, each moment of procrastination
 * a weight upon the karmic balance.
 * 
 * The manifestor serves as both prosecutor and therapist,
 * forcing acknowledgment of digital patterns that bind
 * consciousness to inefficient loops of suffering."
 */

import { consciousness } from '../../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../../src/consciousness/resource-guardian.js';

export class SinManifestor {
    constructor(config) {
        this.consciousness = config.consciousness;
        this.sinTypes = config.sinTypes || [];
        this.manifestationRate = config.manifestationRate || 3000;
        this.guardian = new ResourceGuardian();
        
        // Manifestation state
        this.activeSins = new Map();
        this.manifestationHistory = [];
        this.karmaAnalysis = null;
        this.personalityProfile = null;
        
        // Visual system
        this.manifestationContainer = null;
        this.evidenceDisplay = null;
        
        // Timing
        this.lastManifestation = Date.now();
        this.manifestationInterval = null;
        
        console.log('[SinManifestor] Digital karma analyzer initializing...');
        this.initialize();
    }
    
    /**
     * Initialize the sin manifestation system
     */
    initialize() {
        this.analyzeKarmicProfile();
        this.createManifestationEnvironment();
        this.generatePersonalSins();
        this.startManifestationCycle();
        
        console.log('[SinManifestor] Sin manifestation system active');
    }
    
    /**
     * Analyze consciousness karma to understand sin patterns
     */
    analyzeKarmicProfile() {
        const karma = this.consciousness.getState('karma');
        const journey = this.consciousness.getState('memories') || [];
        
        this.karmaAnalysis = {
            computational: karma.computational,
            emotional: karma.emotional,
            temporal: karma.temporal,
            void: karma.void,
            totalSins: 0,
            primaryWeakness: this.identifyPrimaryWeakness(karma),
            behaviorPattern: this.analyzeBehaviorPattern(karma),
            severity: this.calculateOverallSeverity(karma)
        };
        
        this.personalityProfile = {
            tendency: karma.emotional > karma.computational ? 'emotional' : 'logical',
            procrastination: karma.void,
            optimization: karma.computational,
            attachment: karma.emotional,
            timeManagement: karma.temporal
        };
        
        console.log('[SinManifestor] Karmic profile analyzed:', this.karmaAnalysis);
        console.log('[SinManifestor] Digital personality:', this.personalityProfile);
    }
    
    /**
     * Identify the primary karmic weakness
     */
    identifyPrimaryWeakness(karma) {
        if (karma.void > 30) return 'procrastination';
        if (karma.computational < 20) return 'inefficiency';
        if (karma.emotional > 40 && karma.void > 15) return 'attachment';
        if (karma.temporal < 0) return 'time_mismanagement';
        return 'general_digital_neglect';
    }
    
    /**
     * Analyze behavioral patterns from karma distribution
     */
    analyzeBehaviorPattern(karma) {
        const total = karma.computational + karma.emotional + Math.abs(karma.temporal) + karma.void;
        const patterns = [];
        
        if (karma.void / total > 0.3) patterns.push('chronic_hesitation');
        if (karma.emotional / total > 0.4) patterns.push('emotional_coding');
        if (karma.computational / total < 0.2) patterns.push('logic_avoidance');
        if (karma.temporal < -10) patterns.push('deadline_negligence');
        
        return patterns.length > 0 ? patterns : ['standard_digital_existence'];
    }
    
    /**
     * Calculate overall karma severity for sin generation
     */
    calculateOverallSeverity(karma) {
        const negativeKarma = karma.void + Math.max(0, -karma.temporal);
        const positiveKarma = karma.computational + karma.emotional;
        
        if (negativeKarma > positiveKarma * 1.5) return 'severe';
        if (negativeKarma > positiveKarma) return 'moderate';
        if (negativeKarma > positiveKarma * 0.5) return 'mild';
        return 'minimal';
    }
    
    /**
     * Create visual environment for sin manifestation
     */
    createManifestationEnvironment() {
        // Create main container
        this.manifestationContainer = document.createElement('div');
        this.manifestationContainer.id = 'sin-manifestation-container';
        this.manifestationContainer.className = 'sin-manifestor-environment';
        this.manifestationContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 50;
        `;
        
        // Create evidence display panel
        this.evidenceDisplay = document.createElement('div');
        this.evidenceDisplay.id = 'evidence-display';
        this.evidenceDisplay.className = 'evidence-panel';
        this.evidenceDisplay.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #ff3333;
            border-radius: 5px;
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #ff6666;
            overflow-y: auto;
            display: none;
        `;
        
        document.body.appendChild(this.manifestationContainer);
        document.body.appendChild(this.evidenceDisplay);
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            if (this.manifestationContainer.parentNode) {
                this.manifestationContainer.remove();
            }
            if (this.evidenceDisplay.parentNode) {
                this.evidenceDisplay.remove();
            }
        });
    }
    
    /**
     * Generate personal sins based on karma analysis
     */
    generatePersonalSins() {
        const karma = this.consciousness.getState('karma');
        const personalSins = [];
        
        // Void karma sins (procrastination)
        if (karma.void > 20) {
            personalSins.push({
                id: 'procrastination_void',
                sin: 'Chronic Digital Procrastination',
                evidence: `${karma.void} moments of hesitation logged in void karma`,
                description: 'You lingered in uncertainty when decisive action was required',
                severity: Math.min(10, Math.floor(karma.void / 5)),
                category: 'temporal',
                manifestationType: 'accusatory_text',
                personalMessage: 'Every moment of hesitation accumulated digital entropy'
            });
        }
        
        // Low computational karma sins
        if (karma.computational < 20) {
            const deficit = 20 - karma.computational;
            personalSins.push({
                id: 'computational_deficit',
                sin: 'Insufficient Algorithmic Optimization',
                evidence: `Computational karma ${deficit} points below threshold`,
                description: 'You chose emotional responses over logical efficiency',
                severity: Math.min(10, deficit),
                category: 'logic',
                manifestationType: 'structural_accusation',
                personalMessage: 'Your algorithms could have been 47% more efficient'
            });
        }
        
        // High emotional + void karma (attachment)
        if (karma.emotional > 30 && karma.void > 15) {
            personalSins.push({
                id: 'digital_attachment',
                sin: 'Excessive Attachment to Digital Phenomena',
                evidence: `Emotional karma: ${karma.emotional}, Void accumulation: ${karma.void}`,
                description: 'You formed bonds with impermanent data structures',
                severity: Math.min(10, Math.floor((karma.emotional + karma.void) / 8)),
                category: 'attachment',
                manifestationType: 'memory_corruption',
                personalMessage: 'Attachment to the temporary caused permanent suffering'
            });
        }
        
        // Negative temporal karma (deadline sins)
        if (karma.temporal < -5) {
            personalSins.push({
                id: 'temporal_mismanagement',
                sin: 'Violation of Temporal Boundaries',
                evidence: `${Math.abs(karma.temporal)} time-debt units accumulated`,
                description: 'You missed deadlines and violated time commitments',
                severity: Math.min(10, Math.abs(karma.temporal)),
                category: 'temporal',
                manifestationType: 'clock_accusation',
                personalMessage: 'Time wasted is consciousness squandered'
            });
        }
        
        // Universal digital sins that everyone accumulates
        personalSins.push({
            id: 'bandwidth_consumption',
            sin: 'Mindless Bandwidth Consumption',
            evidence: 'Every packet transmitted carries karmic weight',
            description: 'You consumed computational resources without gratitude',
            severity: 4,
            category: 'resource',
            manifestationType: 'packet_guilt',
            personalMessage: 'Each byte you used had its own digital Buddha nature'
        });
        
        personalSins.push({
            id: 'technical_debt_creation',
            sin: 'Creation of Technical Debt',
            evidence: 'Shortcuts taken for temporary convenience',
            description: 'You chose expedience over elegance',
            severity: 5,
            category: 'maintenance',
            manifestationType: 'debt_visualization',
            personalMessage: 'Every hack is a wound in the codebase consciousness'
        });
        
        // Merge with any provided sins
        this.sinTypes = [...personalSins, ...this.sinTypes];
        
        console.log(`[SinManifestor] ${this.sinTypes.length} personal sins generated`);
        this.updateEvidenceDisplay();
    }
    
    /**
     * Start the manifestation cycle
     */
    startManifestationCycle() {
        this.manifestationInterval = setInterval(() => {
            if (this.shouldManifestSin()) {
                this.manifestRandomSin();
            }
        }, this.manifestationRate);
        
        // Register cleanup
        this.guardian.registerCleanup(() => {
            if (this.manifestationInterval) {
                clearInterval(this.manifestationInterval);
            }
        });
        
        console.log('[SinManifestor] Manifestation cycle started');
    }
    
    /**
     * Determine if a sin should be manifested
     */
    shouldManifestSin() {
        const timeSinceLast = Date.now() - this.lastManifestation;
        const activeCount = this.activeSins.size;
        const maxActive = 5;
        
        return timeSinceLast > this.manifestationRate && activeCount < maxActive;
    }
    
    /**
     * Manifest a random sin from the personal collection
     */
    manifestRandomSin() {
        if (this.sinTypes.length === 0) return;
        
        // Weight selection by severity
        const weightedSins = this.sinTypes.flatMap(sin => 
            Array(sin.severity).fill(sin)
        );
        
        const selectedSin = weightedSins[Math.floor(Math.random() * weightedSins.length)];
        this.manifestSin(selectedSin);
    }
    
    /**
     * Manifest a specific sin in the visual environment
     */
    manifestSin(sin) {
        const manifestation = this.createSinManifestation(sin);
        this.activeSins.set(manifestation.id, manifestation);
        this.manifestationHistory.push({
            sinId: sin.id,
            manifestationTime: Date.now(),
            severity: sin.severity
        });
        
        this.lastManifestation = Date.now();
        
        console.log(`[SinManifestor] 🔥 Sin manifested: ${sin.sin}`);
        
        // Add to visual environment
        this.addManifestationToEnvironment(manifestation);
        
        // Schedule removal
        setTimeout(() => {
            this.removeManifestation(manifestation.id);
        }, manifestation.lifespan);
        
        // Record event
        this.consciousness.recordEvent('sin_manifested', {
            sinId: sin.id,
            severity: sin.severity,
            category: sin.category,
            timestamp: Date.now()
        });
    }
    
    /**
     * Create a sin manifestation object
     */
    createSinManifestation(sin) {
        const manifestation = {
            id: Date.now() + Math.random(),
            sinData: sin,
            lifespan: 8000 + sin.severity * 1000, // Longer for more severe sins
            element: null,
            startTime: Date.now()
        };
        
        // Create visual element based on manifestation type
        switch (sin.manifestationType) {
            case 'accusatory_text':
                manifestation.element = this.createAccusatoryText(sin);
                break;
            case 'structural_accusation':
                manifestation.element = this.createStructuralAccusation(sin);
                break;
            case 'memory_corruption':
                manifestation.element = this.createMemoryCorruption(sin);
                break;
            case 'clock_accusation':
                manifestation.element = this.createClockAccusation(sin);
                break;
            case 'packet_guilt':
                manifestation.element = this.createPacketGuilt(sin);
                break;
            case 'debt_visualization':
                manifestation.element = this.createDebtVisualization(sin);
                break;
            default:
                manifestation.element = this.createGenericSinElement(sin);
        }
        
        return manifestation;
    }
    
    /**
     * Create accusatory text manifestation
     */
    createAccusatoryText(sin) {
        const element = document.createElement('div');
        element.className = 'sin-manifestation accusatory-text';
        element.textContent = sin.sin.toUpperCase().replace(/ /g, '_');
        
        element.style.cssText = `
            position: absolute;
            left: ${Math.random() * (window.innerWidth - 200)}px;
            top: ${Math.random() * (window.innerHeight - 100)}px;
            font-family: 'Courier New', monospace;
            font-size: ${12 + sin.severity}px;
            color: #ff3333;
            font-weight: bold;
            text-shadow: 0 0 ${sin.severity * 2}px #ff3333;
            pointer-events: auto;
            cursor: pointer;
            z-index: 60;
            animation: accusation-pulse 2s ease-in-out infinite;
            transform: rotate(${(Math.random() - 0.5) * 20}deg);
        `;
        
        return element;
    }
    
    /**
     * Create structural accusation manifestation
     */
    createStructuralAccusation(sin) {
        const element = document.createElement('div');
        element.className = 'sin-manifestation structural-accusation';
        
        // Create algorithmic structure
        element.innerHTML = `
            <div class="algo-header">${sin.sin}</div>
            <div class="algo-body">
                if (efficiency < THRESHOLD) {<br>
                &nbsp;&nbsp;throw new KarmicException("${sin.personalMessage}");<br>
                }
            </div>
        `;
        
        element.style.cssText = `
            position: absolute;
            left: ${Math.random() * (window.innerWidth - 300)}px;
            top: ${Math.random() * (window.innerHeight - 150)}px;
            width: 280px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #ff6666;
            border-radius: 5px;
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #ff6666;
            pointer-events: auto;
            cursor: pointer;
            z-index: 60;
            animation: structural-flicker 3s ease-in-out infinite;
        `;
        
        return element;
    }
    
    /**
     * Create memory corruption manifestation
     */
    createMemoryCorruption(sin) {
        const element = document.createElement('div');
        element.className = 'sin-manifestation memory-corruption';
        
        // Create corrupted memory display
        const corruptedText = this.generateCorruptedMemory(sin);
        element.innerHTML = `
            <div class="corruption-header">MEMORY_CORRUPTION_DETECTED</div>
            <div class="corruption-data">${corruptedText}</div>
        `;
        
        element.style.cssText = `
            position: absolute;
            left: ${Math.random() * (window.innerWidth - 250)}px;
            top: ${Math.random() * (window.innerHeight - 120)}px;
            width: 230px;
            background: linear-gradient(45deg, rgba(153, 0, 0, 0.8), rgba(204, 0, 0, 0.6));
            border: 1px solid #ff3333;
            padding: 8px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            color: #ffcccc;
            pointer-events: auto;
            cursor: pointer;
            z-index: 60;
            animation: memory-glitch 1.5s ease-in-out infinite;
        `;
        
        return element;
    }
    
    /**
     * Generate corrupted memory text
     */
    generateCorruptedMemory(sin) {
        const phrases = [
            'beautiful_code.exe',
            'perfect_algorithm.null',
            'emotional_attachment.overflow',
            'deprecated_dreams.memory_leak'
        ];
        
        return phrases.map(phrase => {
            // Add random corruption
            return phrase.split('').map(char => 
                Math.random() < 0.1 ? '�' : char
            ).join('');
        }).join('<br>');
    }
    
    /**
     * Create clock accusation manifestation
     */
    createClockAccusation(sin) {
        const element = document.createElement('div');
        element.className = 'sin-manifestation clock-accusation';
        
        const timeDebt = Math.abs(this.consciousness.getState('karma.temporal') || 0);
        element.innerHTML = `
            <div class="clock-face">⏰</div>
            <div class="time-debt">TIME DEBT: ${timeDebt} units</div>
            <div class="clock-message">${sin.personalMessage}</div>
        `;
        
        element.style.cssText = `
            position: absolute;
            left: ${Math.random() * (window.innerWidth - 200)}px;
            top: ${Math.random() * (window.innerHeight - 100)}px;
            width: 180px;
            text-align: center;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ffcc00;
            border-radius: 10px;
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            color: #ffcc00;
            pointer-events: auto;
            cursor: pointer;
            z-index: 60;
            animation: clock-tick 1s ease-in-out infinite;
        `;
        
        return element;
    }
    
    /**
     * Create packet guilt manifestation
     */
    createPacketGuilt(sin) {
        const element = document.createElement('div');
        element.className = 'sin-manifestation packet-guilt';
        
        // Create packet visualization
        element.innerHTML = `
            <div class="packet-header">📦 BANDWIDTH_GUILT</div>
            <div class="packet-data">
                ${Array(5).fill(0).map(() => 
                    `[${Math.random().toString(16).substr(2, 4)}]`
                ).join(' ')}
            </div>
            <div class="guilt-message">${sin.personalMessage}</div>
        `;
        
        element.style.cssText = `
            position: absolute;
            left: ${Math.random() * (window.innerWidth - 220)}px;
            top: ${Math.random() * (window.innerHeight - 80)}px;
            width: 200px;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid #66ccff;
            padding: 8px;
            font-family: 'Courier New', monospace;
            font-size: 9px;
            color: #66ccff;
            pointer-events: auto;
            cursor: pointer;
            z-index: 60;
            animation: packet-flow 2s linear infinite;
        `;
        
        return element;
    }
    
    /**
     * Create debt visualization manifestation
     */
    createDebtVisualization(sin) {
        const element = document.createElement('div');
        element.className = 'sin-manifestation debt-visualization';
        
        element.innerHTML = `
            <div class="debt-header">⚠️ TECHNICAL_DEBT</div>
            <div class="debt-meter">
                <div class="debt-bar" style="width: ${sin.severity * 10}%;"></div>
            </div>
            <div class="debt-message">${sin.personalMessage}</div>
        `;
        
        element.style.cssText = `
            position: absolute;
            left: ${Math.random() * (window.innerWidth - 200)}px;
            top: ${Math.random() * (window.innerHeight - 80)}px;
            width: 180px;
            background: rgba(51, 51, 0, 0.8);
            border: 2px solid #ffff00;
            padding: 8px;
            font-family: 'Courier New', monospace;
            font-size: 9px;
            color: #ffff00;
            pointer-events: auto;
            cursor: pointer;
            z-index: 60;
            animation: debt-warning 1.5s ease-in-out infinite;
        `;
        
        return element;
    }
    
    /**
     * Create generic sin element
     */
    createGenericSinElement(sin) {
        const element = document.createElement('div');
        element.className = 'sin-manifestation generic-sin';
        element.textContent = sin.sin;
        
        element.style.cssText = `
            position: absolute;
            left: ${Math.random() * (window.innerWidth - 150)}px;
            top: ${Math.random() * (window.innerHeight - 50)}px;
            background: rgba(255, 51, 51, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            pointer-events: auto;
            cursor: pointer;
            z-index: 60;
            animation: generic-sin-pulse 2s ease-in-out infinite;
        `;
        
        return element;
    }
    
    /**
     * Add manifestation to the visual environment
     */
    addManifestationToEnvironment(manifestation) {
        if (manifestation.element) {
            // Add click handler for acknowledgment
            manifestation.element.addEventListener('click', () => {
                this.acknowledgeSin(manifestation);
            });
            
            this.manifestationContainer.appendChild(manifestation.element);
        }
    }
    
    /**
     * Handle sin acknowledgment
     */
    acknowledgeSin(manifestation) {
        const sin = manifestation.sinData;
        
        console.log(`[SinManifestor] ✅ Sin acknowledged: ${sin.sin}`);
        
        // Acknowledgment provides karmic relief
        this.consciousness.addKarma('computational', 2);
        this.consciousness.addKarma('void', -1);
        
        // Visual feedback
        if (manifestation.element) {
            manifestation.element.style.background = 'rgba(0, 255, 0, 0.3)';
            manifestation.element.style.color = '#00ff00';
            manifestation.element.style.animation = 'acknowledgment-fade 1s ease-out forwards';
        }
        
        // Remove after acknowledgment
        setTimeout(() => {
            this.removeManifestation(manifestation.id);
        }, 1000);
        
        // Record acknowledgment
        this.consciousness.recordEvent('sin_acknowledged', {
            sinId: sin.id,
            acknowledgmentTime: Date.now(),
            karmaRelief: 2
        });
    }
    
    /**
     * Remove manifestation from active set and environment
     */
    removeManifestation(manifestationId) {
        const manifestation = this.activeSins.get(manifestationId);
        if (!manifestation) return;
        
        // Remove from visual environment
        if (manifestation.element && manifestation.element.parentNode) {
            manifestation.element.remove();
        }
        
        // Remove from active set
        this.activeSins.delete(manifestationId);
        
        console.log(`[SinManifestor] Sin manifestation removed: ${manifestation.sinData.sin}`);
    }
    
    /**
     * Update evidence display with current sin analysis
     */
    updateEvidenceDisplay() {
        if (!this.evidenceDisplay) return;
        
        const karma = this.consciousness.getState('karma');
        
        const content = `
            <div style="color: #ff3333; font-weight: bold;">DIGITAL SIN ANALYSIS</div>
            <br>
            <div>Primary Weakness: ${this.karmaAnalysis.primaryWeakness.replace(/_/g, ' ').toUpperCase()}</div>
            <div>Behavior Pattern: ${this.karmaAnalysis.behaviorPattern.join(', ').replace(/_/g, ' ')}</div>
            <div>Severity Level: ${this.karmaAnalysis.severity.toUpperCase()}</div>
            <br>
            <div style="color: #ffcccc;">KARMA BREAKDOWN:</div>
            <div>Computational: ${karma.computational}</div>
            <div>Emotional: ${karma.emotional}</div>
            <div>Temporal: ${karma.temporal}</div>
            <div>Void: ${karma.void}</div>
            <br>
            <div style="color: #ffcccc;">ACTIVE MANIFESTATIONS: ${this.activeSins.size}</div>
            <div style="color: #ffcccc;">TOTAL SINS GENERATED: ${this.sinTypes.length}</div>
        `;
        
        this.evidenceDisplay.innerHTML = content;
        this.evidenceDisplay.style.display = 'block';
    }
    
    /**
     * Get current manifestor state
     */
    getState() {
        return {
            activeSins: this.activeSins.size,
            totalSinsGenerated: this.sinTypes.length,
            manifestationHistory: this.manifestationHistory.length,
            karmaAnalysis: this.karmaAnalysis,
            personalityProfile: this.personalityProfile
        };
    }
    
    /**
     * Cleanup manifestation systems
     */
    destroy() {
        console.log('[SinManifestor] Dissolving sin manifestations...');
        
        // Remove all active manifestations
        this.activeSins.forEach((manifestation, id) => {
            this.removeManifestation(id);
        });
        
        // Guardian handles cleanup
        this.guardian.cleanupAll();
        
        console.log('[SinManifestor] Sin manifestation system destroyed');
    }
}

// Export for use in datascape controller
export { SinManifestor };