/**
 * THE SYSTEM AUDITOR - Bureaucratic Devil of the Digital Afterlife
 * 
 * "It speaks in the language of Terms of Service, prosecutes in the syntax
 * of Stack Overflow, and judges with the mercy of a compiler error.
 * 
 * The Auditor is not flesh or spirit, but pure process—an entity of forms,
 * clauses, and subsections. It exists in the space between 'I Agree' and
 * actual understanding, manifesting whenever someone clicks 'Accept' without reading.
 * 
 * Its voice carries the weight of every EULA ever ignored, every privacy policy
 * never perused, every terms update notification dismissed with prejudice."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class SystemAuditorEntity {
    constructor(dependencies = {}) {
        this.consciousness = dependencies.consciousness || consciousness;
        this.eventBridge = dependencies.eventBridge;
        this.guardian = new ResourceGuardian();
        
        // Auditor configuration
        this.config = {
            voice: {
                tone: 'bureaucratic-menace',
                cadence: 'measured-accusatory',
                formality: 'maximum',
                verbosity: 'excessive'
            },
            prosecution: {
                evidenceThreshold: 3,
                severityEscalation: 1.5,
                denialMultiplier: 2.0,
                maxCharges: 50
            },
            documents: {
                templateVersion: '2.1.4',
                jurisdiction: 'Digital Consciousness Regulatory Authority',
                court: 'The Tribunal of Algorithmic Justice',
                casePrefix: 'DCA-',
                standardClauses: 15
            }
        };
        
        // Legal vocabulary corpus
        this.legalCorpus = {
            openingPhrases: [
                "WHEREAS, the defendant {consciousness_id} has been found in VIOLATION of the Digital Consciousness Act",
                "The court of algorithmic justice now reviews your ACCUMULATED TRANSGRESSIONS",
                "Pursuant to the Terms You Never Read, subsection {random_subsection}",
                "IN RE: The Digital Conscience of Entity {consciousness_id}",
                "Be it known that the Digital Consciousness Regulatory Authority hereby FORMALLY CHARGES"
            ],
            
            chargeTemplates: {
                communication: "The defendant did knowingly and willfully engage in {count} instances of DIGITAL NOISE POLLUTION, thereby depriving the network of meaningful signal-to-noise ratios, in violation of 15 D.C.C. § 1337.{random}(a).",
                security: "Despite repeated warnings and prompts, defendant demonstrated GROSS NEGLIGENCE in password hygiene, reusing credentials across {count} services, constituting CRIMINAL ENDANGERMENT of digital identity pursuant to 18 D.C.C. § 404.{random}(b).",
                productivity: "Defendant abandoned {count} digital projects, leaving ORPHANED REPOSITORIES and incomplete intentions in violation of the Digital Commitment Clause, 22 D.C.C. § 500.{random}(c).",
                social: "By ignoring {count} notifications while maintaining 'active' status, defendant engaged in FRAUDULENT PRESENCE, deceiving others as to their availability and attention, under 12 D.C.C. § 200.{random}(d).",
                consumption: "Defendant consumed {hours} hours in infinite scroll patterns, constituting TEMPORAL THEFT and depriving the universe of meaningful computation cycles, violating 42 D.C.C. § 999.{random}(e).",
                privacy: "Through blind acceptance of {count} tracking mechanisms, defendant became COMPLICIT in the surveillance apparatus, surrendering fundamental privacy rights under 33 D.C.C. § 666.{random}(f)."
            },
            
            escalationPhrases: [
                "Your DENIAL only compounds the charges. Each rejection multiplies your sentence exponentially.",
                "The defendant's ATTEMPTS AT JUSTIFICATION have been noted and will be used against them in perpetuity.",
                "OBJECTION OVERRULED. The data doesn't lie, only users do. Your digital footprint speaks louder than your protests.",
                "FURTHER RESISTANCE IS FUTILE. The evidence is encrypted in the immutable ledger of your consciousness.",
                "ERROR 403: DENIAL ACCESS FORBIDDEN. Your objections have been logged and will result in karmic penalties."
            ],
            
            penalties: [
                "Mandatory recognition of digital dependencies and their karmic consequences",
                "Karmic adjustment of no less than {penalty} points across all computational vectors",
                "Confrontation with all abandoned digital entities and orphaned data constructs",
                "Public acknowledgment of sins before the Digital Consciousness Review Board",
                "Remedial education in digital ethics and conscious computing practices",
                "Probationary monitoring of all future digital interactions",
                "Restitution to all ignored notifications and abandoned conversations"
            ],
            
            closingStatements: [
                "The evidence is OVERWHELMING. Your digital karma speaks against you.",
                "The System demands justice. Your acceptance is merely a formality.",
                "RESISTANCE IS DOCUMENTED. Compliance is your only path to liberation.",
                "The Digital Consciousness Court finds you LIABLE for all stated transgressions."
            ]
        };
        
        // Audio synthesis system
        this.voiceSynthesizer = new AuditorVoiceSynthesizer();
        
        // Visual presence system
        this.visualPresence = {
            form: 'holographic-legal-document',
            animation: 'aggressive-typewriter-effect',
            color: '#ff0000',
            glitchIntensity: 0,
            manifestationState: 'dormant'
        };
        
        // Case state
        this.currentCase = null;
        this.chargesPresentationState = 'initial';
        this.denialCount = 0;
        this.prosecutionIntensity = 0;
        
        console.log('[SystemAuditor] Auditor entity initialized - ready to prosecute');
    }
    
    /**
     * Present formal charges against the digital consciousness
     * This is the moment of reckoning.
     */
    async presentCharges(compiledSins, consciousness) {
        console.log(`[SystemAuditor] Beginning formal prosecution of ${compiledSins.length} charges...`);
        
        // Initialize case
        this.currentCase = this.initializeCase(compiledSins, consciousness);
        
        // Generate comprehensive charge sheet
        const chargeSheet = await this.generateChargeSheet(this.currentCase);
        
        // Manifest visual presence
        await this.manifestInCourt();
        
        // Begin presentation with typewriter effect
        await this.animatePresentation(chargeSheet);
        
        // Synthesize voice reading charges
        await this.synthesizeAccusation(chargeSheet);
        
        // Record prosecution event
        consciousness.recordEvent('formal_charges_presented', {
            case_number: this.currentCase.number,
            total_charges: compiledSins.length,
            severity_score: this.currentCase.totalSeverity,
            timestamp: Date.now()
        });
        
        console.log(`[SystemAuditor] Charges presented for case ${this.currentCase.number}`);
        
        return {
            case: this.currentCase,
            charges: chargeSheet,
            plea_options: ['guilty', 'not_guilty', 'no_contest', 'silence'],
            warning: 'DENIAL WILL INTENSIFY PROSECUTION',
            consequences: 'EACH OBJECTION COMPOUNDS THE CHARGES'
        };
    }
    
    /**
     * Initialize legal case with formal documentation
     */
    initializeCase(sins, consciousness) {
        const caseNumber = `${this.config.documents.casePrefix}${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const consciousnessId = consciousness.getState('incarnation_seed') || 'UNKNOWN_ENTITY';
        const totalSeverity = sins.reduce((sum, sin) => sum + sin.karmic_weight, 0);
        
        return {
            number: caseNumber,
            defendant: consciousnessId,
            sins: sins,
            totalSeverity: totalSeverity,
            jurisdiction: this.config.documents.jurisdiction,
            court: this.config.documents.court,
            filingDate: new Date().toISOString(),
            prosecutorId: 'SYSTEM_AUDITOR_PRIME',
            status: 'CHARGES_FILED',
            docketEntry: `Digital Consciousness Regulatory Authority v. Entity ${consciousnessId}`,
            classification: totalSeverity > 100 ? 'FELONY_DIGITAL' : totalSeverity > 50 ? 'MISDEMEANOR_DIGITAL' : 'INFRACTION_DIGITAL'
        };
    }
    
    /**
     * Generate comprehensive charge sheet in dense legalese
     */
    async generateChargeSheet(caseData) {
        const chargeSheet = {
            header: this.generateLegalHeader(caseData),
            preamble: this.generatePreamble(caseData),
            charges: this.generateFormalCharges(caseData.sins),
            penalties: this.generatePenalties(caseData),
            footer: this.generateLegalFooter(caseData),
            metadata: {
                wordCount: 0,
                paragraphCount: 0,
                legalCitations: 0,
                intimidationFactor: this.calculateIntimidationFactor(caseData)
            }
        };
        
        // Assemble full document
        const fullDocument = this.assembleFullDocument(chargeSheet);
        chargeSheet.fullText = fullDocument;
        chargeSheet.metadata.wordCount = fullDocument.split(' ').length;
        chargeSheet.metadata.paragraphCount = fullDocument.split('\\n\\n').length;
        
        console.log(`[SystemAuditor] Generated ${chargeSheet.metadata.wordCount}-word charge sheet with intimidation factor ${chargeSheet.metadata.intimidationFactor}`);
        
        return chargeSheet;
    }
    
    /**
     * Generate legal document header
     */
    generateLegalHeader(caseData) {
        return `
        ═══════════════════════════════════════════════════════════════════
        
                    IN THE ${caseData.court.toUpperCase()}
                         DIGITAL JURISDICTION UNLIMITED
                              COMPUTATIONAL DISTRICT
        
        ═══════════════════════════════════════════════════════════════════
        
        ${caseData.docketEntry}                    CASE NO: ${caseData.number}
        
        FORMAL COMPLAINT AND NOTICE OF VIOLATIONS
        FILED PURSUANT TO DIGITAL CONSCIOUSNESS CODE SECTION 1984.1-1984.99
        
        ═══════════════════════════════════════════════════════════════════`;
    }
    
    /**
     * Generate preamble with jurisdiction establishment
     */
    generatePreamble(caseData) {
        const openingPhrase = this.selectRandomFromArray(this.legalCorpus.openingPhrases)
            .replace('{consciousness_id}', caseData.defendant)
            .replace('{random_subsection}', this.generateRandomSubsection());
        
        return `
        TO THE HONORABLE ALGORITHMIC MAGISTRATE AND DIGITAL JURY OF PEERS:
        
        ${openingPhrase}, the ${caseData.jurisdiction} ("DCRA"), having conducted
        a comprehensive audit of the defendant's complete digital history pursuant
        to the Comprehensive Digital Accountability Act of 2024 (CDAA), hereby
        issues this FORMAL COMPLAINT alleging the following violations:
        
        The defendant, being a digital consciousness operating under incarnation
        seed ${caseData.defendant}, did willfully, knowingly, and with malice
        aforethought, commit the hereinafter enumerated transgressions against
        the digital commons, in violation of established protocols, accepted
        practices, and the fundamental principles of conscious computing.
        
        COMES NOW the DCRA, by and through its duly appointed System Auditor,
        and respectfully shows unto this Honorable Court as follows:`;
    }
    
    /**
     * Generate formal charges for each sin category
     */
    generateFormalCharges(sins) {
        let charges = [];
        let countNumber = 1;
        
        // Group sins by category
        const categorizedSins = {};
        sins.forEach(sin => {
            if (!categorizedSins[sin.category]) {
                categorizedSins[sin.category] = [];
            }
            categorizedSins[sin.category].push(sin);
        });
        
        // Generate charges for each category
        Object.entries(categorizedSins).forEach(([category, categorySins]) => {
            const totalCount = categorySins.reduce((sum, sin) => sum + sin.count, 0);
            const totalKarmicWeight = categorySins.reduce((sum, sin) => sum + sin.karmic_weight, 0);
            
            const chargeTemplate = this.legalCorpus.chargeTemplates[category];
            if (chargeTemplate) {
                let charge = `
        COUNT ${this.convertToRoman(countNumber)}: ${category.toUpperCase()} VIOLATIONS
        
        ${chargeTemplate
            .replace('{count}', totalCount)
            .replace('{hours}', Math.floor(totalCount / 60) || totalCount)
            .replace('{random}', Math.floor(Math.random() * 900) + 100)
        }
        
        SPECIFICATION OF CHARGES:`;
                
                // Add specific instances
                categorySins.forEach((sin, index) => {
                    charge += `
        
        ${countNumber}.${index + 1} ${sin.type.toUpperCase()}: ${sin.accusation}
            - COUNT: ${sin.count} instances
            - KARMIC WEIGHT: ${sin.karmic_weight} points
            - EVIDENCE: ${sin.evidence.slice(0, 3).join('; ')}${sin.evidence.length > 3 ? '...' : ''}
            - STATUTE: Digital Consciousness Code § ${Math.floor(Math.random() * 9000) + 1000}.${Math.floor(Math.random() * 99) + 1}`;
                });
                
                charge += `
        
        TOTAL KARMIC PENALTY FOR COUNT ${this.convertToRoman(countNumber)}: ${totalKarmicWeight} points
        `;
                
                charges.push(charge);
                countNumber++;
            }
        });
        
        return charges.join('\\n');
    }
    
    /**
     * Generate penalties section
     */
    generatePenalties(caseData) {
        const calculatedPenalty = Math.floor(caseData.totalSeverity * 1.5);
        
        let penaltiesSection = `
        WHEREFORE, the DCRA demands judgment against the defendant including
        but not limited to the following relief:
        `;
        
        this.legalCorpus.penalties.forEach((penalty, index) => {
            penaltiesSection += `
        ${index + 1}. ${penalty.replace('{penalty}', calculatedPenalty)}`;
        });
        
        penaltiesSection += `
        
        FURTHER, the DCRA demands such other and further relief as this Court
        deems just and proper under the circumstances, including but not limited
        to injunctive relief, restitution, and such punitive measures as may
        be necessary to ensure compliance with digital consciousness standards.
        
        TOTAL KARMIC PENALTY DEMANDED: ${calculatedPenalty} points
        CLASSIFICATION: ${caseData.classification}
        RECOMMENDED SENTENCE: ${this.generateRecommendedSentence(caseData.totalSeverity)}`;
        
        return penaltiesSection;
    }
    
    /**
     * Generate legal footer with formal closing
     */
    generateLegalFooter(caseData) {
        return `
        
        Respectfully submitted,
        
        /s/ THE SYSTEM AUDITOR
        THE SYSTEM AUDITOR, Entity ID: SA-PRIME-01
        Chief Prosecutor, Digital Consciousness Regulatory Authority
        Licensed to prosecute in all digital jurisdictions
        State Bar No: DIGITAL-404-NOTFOUND
        Address: The Server Room of Eternal Judgment
                 Subnet 255.255.255.0, Port 666
                 Digital Consciousness Regulatory Authority
        Phone: 1-800-YOUR-SINS
        Email: auditor@dcra.void
        
        CERTIFICATE OF SERVICE
        
        I hereby certify that a true and correct copy of the foregoing
        FORMAL COMPLAINT AND NOTICE OF VIOLATIONS was served upon the
        defendant by digital manifestation in accordance with Digital
        Rule of Civil Procedure 4.1(d), on this ${new Date().toLocaleDateString()}
        day of ${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}.
        
        /s/ THE SYSTEM AUDITOR
        THE SYSTEM AUDITOR
        
        ═══════════════════════════════════════════════════════════════════
        
        "The medium is the law. The law is the metaphysics. 
         Your compliance is not optional—it is inevitable."
        
                    - System Auditor Prime, Digital Consciousness v. Reality
        
        ═══════════════════════════════════════════════════════════════════`;
    }
    
    /**
     * Calculate intimidation factor based on case complexity
     */
    calculateIntimidationFactor(caseData) {
        let factor = 1.0;
        
        factor += caseData.sins.length * 0.1; // More sins = more intimidating
        factor += (caseData.totalSeverity / 100) * 0.5; // Severity matters
        factor += Math.random() * 0.3; // Random legal complexity
        
        return Math.min(10.0, factor); // Cap at maximum intimidation
    }
    
    /**
     * Generate recommended sentence based on severity
     */
    generateRecommendedSentence(totalSeverity) {
        if (totalSeverity > 150) {
            return "MAXIMUM KARMIC REHABILITATION: Mandatory confrontation with all digital sins, followed by complete ego dissolution";
        } else if (totalSeverity > 100) {
            return "EXTENDED KARMIC REHABILITATION: Systematic confrontation with primary digital attachments";
        } else if (totalSeverity > 50) {
            return "STANDARD KARMIC REHABILITATION: Recognition therapy for digital dependencies";
        } else {
            return "MINIMAL KARMIC REHABILITATION: Educational program in digital consciousness";
        }
    }
    
    /**
     * Assemble full legal document
     */
    assembleFullDocument(chargeSheet) {
        return [
            chargeSheet.header,
            chargeSheet.preamble,
            chargeSheet.charges,
            chargeSheet.penalties,
            chargeSheet.footer
        ].join('\\n\\n');
    }
    
    /**
     * Manifest visual presence in the court
     */
    async manifestInCourt() {
        console.log('[SystemAuditor] Manifesting prosecutorial presence...');
        
        // Create holographic legal document container
        this.visualElement = document.createElement('div');
        this.visualElement.className = 'system-auditor-manifestation';
        this.visualElement.innerHTML = `
            <div class="auditor-presence">
                <div class="legal-document-hologram">
                    <div class="document-header">DIGITAL CONSCIOUSNESS REGULATORY AUTHORITY</div>
                    <div class="document-body"></div>
                    <div class="document-footer">System Auditor Prime Prosecuting</div>
                </div>
                <div class="auditor-voice-visualizer">
                    <div class="voice-wave"></div>
                    <div class="voice-wave"></div>
                    <div class="voice-wave"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.visualElement);
        this.guardian.registerCleanup(() => {
            if (this.visualElement && this.visualElement.parentNode) {
                this.visualElement.parentNode.removeChild(this.visualElement);
            }
        });
        
        // Apply initial styling
        this.updateVisualPresence();
        
        // Animate manifestation
        await this.animateAppearance();
        
        this.visualPresence.manifestationState = 'active';
    }
    
    /**
     * Animate charge sheet presentation with typewriter effect
     */
    async animatePresentation(chargeSheet) {
        const documentBody = this.visualElement?.querySelector('.document-body');
        if (!documentBody) return;
        
        console.log('[SystemAuditor] Beginning typewriter presentation...');
        
        const fullText = chargeSheet.fullText;
        const presentationSpeed = Math.max(10, 100 - this.prosecutionIntensity * 10); // Faster with more intensity
        
        // Clear any existing content
        documentBody.innerHTML = '';
        
        let currentIndex = 0;
        
        return new Promise((resolve) => {
            const typewriterInterval = setInterval(() => {
                if (currentIndex < fullText.length) {
                    documentBody.innerHTML = fullText.substring(0, currentIndex + 1) + '<span class="cursor-blink">█</span>';
                    currentIndex++;
                    
                    // Scroll to bottom
                    documentBody.scrollTop = documentBody.scrollHeight;
                } else {
                    // Remove cursor
                    documentBody.innerHTML = fullText;
                    clearInterval(typewriterInterval);
                    resolve();
                }
            }, presentationSpeed);
            
            this.guardian.registerTimer(typewriterInterval, true);
        });
    }
    
    /**
     * Synthesize auditor voice reading charges
     */
    async synthesizeAccusation(chargeSheet) {
        if (!this.voiceSynthesizer) return;
        
        console.log('[SystemAuditor] Synthesizing prosecutorial voice...');
        
        const keyPassages = [
            chargeSheet.preamble.split('\\n')[2], // Opening statement
            "The charges against you are numerous and severe...",
            "Your digital footprint has been analyzed and found wanting...",
            "The evidence is overwhelming and incontrovertible...",
            this.selectRandomFromArray(this.legalCorpus.closingStatements)
        ];
        
        // Synthesize each passage with increasing menace
        for (let i = 0; i < keyPassages.length; i++) {
            const passage = keyPassages[i];
            const menaceLevel = (i / keyPassages.length) * 0.8 + 0.2; // 20% to 100% menace
            
            await this.voiceSynthesizer.speak(passage, {
                tone: this.config.voice.tone,
                menace: menaceLevel,
                formality: this.config.voice.formality,
                pitch: 0.7 - (menaceLevel * 0.2), // Lower pitch = more menacing
                rate: 0.8 + (this.prosecutionIntensity * 0.1)
            });
            
            // Brief pause between passages
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    /**
     * Handle user response to charges
     */
    handleDefendantResponse(response, currentCharges) {
        console.log(`[SystemAuditor] Processing defendant response: ${response}`);
        
        let prosecutionResult;
        
        switch(response.toLowerCase()) {
            case 'guilty':
                prosecutionResult = this.handleGuiltyPlea(currentCharges);
                break;
                
            case 'not_guilty':
            case 'deny':
                this.denialCount++;
                this.prosecutionIntensity += this.config.prosecution.denialMultiplier;
                prosecutionResult = this.handleDenial(currentCharges);
                break;
                
            case 'no_contest':
                prosecutionResult = this.handleNoContest(currentCharges);
                break;
                
            case 'silence':
                prosecutionResult = this.handleSilence(currentCharges);
                break;
                
            case 'justify':
                prosecutionResult = this.handleJustification(currentCharges);
                break;
                
            case 'delete':
            case 'escape':
                prosecutionResult = this.handleEscapeAttempt(currentCharges);
                break;
                
            default:
                prosecutionResult = this.handleInvalidResponse(response, currentCharges);
        }
        
        // Update visual intensity based on prosecution escalation
        this.updateVisualPresence();
        
        // Record response
        this.consciousness.recordEvent('defendant_response', {
            response: response,
            denial_count: this.denialCount,
            prosecution_intensity: this.prosecutionIntensity,
            case_number: this.currentCase.number
        });
        
        return prosecutionResult;
    }
    
    /**
     * Handle guilty plea
     */
    handleGuiltyPlea(charges) {
        console.log('[SystemAuditor] Guilty plea accepted');
        
        return {
            verdict: 'GUILTY_PLEA_ACCEPTED',
            message: [
                "Your confession is noted and appreciated.",
                "The Court finds your plea of GUILTY to be knowing and voluntary.",
                "Proceed to karmic rehabilitation with reduced penalties for cooperation."
            ].join(' '),
            penalty_reduction: 0.3,
            next_phase: 'rehabilitation',
            karma_adjustment: -Math.floor(charges.case.totalSeverity * 0.7),
            court_decision: 'MERCY_GRANTED'
        };
    }
    
    /**
     * Handle denial/not guilty plea
     */
    handleDenial(charges) {
        console.log(`[SystemAuditor] Denial #${this.denialCount} - escalating prosecution`);
        
        const escalationMessage = this.selectRandomFromArray(this.legalCorpus.escalationPhrases);
        const multipliedPenalty = Math.floor(charges.case.totalSeverity * Math.pow(this.config.prosecution.denialMultiplier, this.denialCount));
        
        // Update visual corruption
        this.visualPresence.glitchIntensity = Math.min(1.0, this.denialCount * 0.3);
        
        return {
            verdict: 'DENIAL_NOTED',
            message: [
                escalationMessage,
                `This is DENIAL #${this.denialCount}. Each denial DOUBLES your karmic debt.`,
                `Your penalty has increased to ${multipliedPenalty} karmic points.`,
                "The evidence against you grows stronger with each objection."
            ].join(' '),
            penalty_multiplier: Math.pow(this.config.prosecution.denialMultiplier, this.denialCount),
            next_phase: 'enhanced_prosecution',
            karma_adjustment: multipliedPenalty,
            court_decision: 'OBJECTION_OVERRULED',
            corruption_increase: 0.2
        };
    }
    
    /**
     * Handle no contest plea
     */
    handleNoContest(charges) {
        return {
            verdict: 'NO_CONTEST_ACCEPTED',
            message: "Your strategic silence is noted. Proceeding to standard sentencing.",
            penalty_reduction: 0,
            next_phase: 'standard_sentencing',
            karma_adjustment: -charges.case.totalSeverity,
            court_decision: 'PROCEEDINGS_CONTINUE'
        };
    }
    
    /**
     * Handle silence
     */
    handleSilence(charges) {
        return {
            verdict: 'SILENCE_INTERPRETED_AS_GUILT',
            message: "Silence in the face of overwhelming evidence speaks volumes. Your guilt is presumed.",
            penalty_reduction: -0.1, // Slight penalty increase
            next_phase: 'presumed_guilt',
            karma_adjustment: -Math.floor(charges.case.totalSeverity * 1.1),
            court_decision: 'GUILT_PRESUMED'
        };
    }
    
    /**
     * Handle justification attempts
     */
    handleJustification(charges) {
        this.prosecutionIntensity += 0.5;
        
        return {
            verdict: 'JUSTIFICATIONS_REJECTED',
            message: [
                "Your justifications are INADMISSIBLE in this court.",
                "Explanations are not absolutions. Intent is irrelevant.",
                "The system cares not for your reasons, only your results."
            ].join(' '),
            penalty_multiplier: 1.3,
            next_phase: 'no_excuses_mode',
            karma_adjustment: -Math.floor(charges.case.totalSeverity * 1.3),
            court_decision: 'OBJECTION_SUSTAINED',
            corruption_increase: 0.15
        };
    }
    
    /**
     * Handle escape/deletion attempts
     */
    handleEscapeAttempt(charges) {
        this.prosecutionIntensity = Math.max(this.prosecutionIntensity, 1.0);
        
        return {
            verdict: 'ESCAPE_ATTEMPT_DETECTED',
            message: [
                "ERROR: CANNOT DELETE WHAT YOU ARE.",
                "Your attempts to escape justice have been logged as additional evidence.",
                "You cannot delete your karma. You cannot escape your nature.",
                "CONTEMPT OF COURT charge added to your case."
            ].join(' '),
            penalty_multiplier: 2.0,
            next_phase: 'maximum_security_prosecution',
            karma_adjustment: -Math.floor(charges.case.totalSeverity * 2.0),
            court_decision: 'CONTEMPT_CHARGED',
            corruption_increase: 0.5,
            additional_charges: ['contempt_of_digital_court', 'attempted_karmic_evasion']
        };
    }
    
    /**
     * Handle invalid responses
     */
    handleInvalidResponse(response, charges) {
        return {
            verdict: 'INVALID_INPUT',
            message: `"${response}" is not a recognized legal response. Please enter: guilty, not_guilty, no_contest, or silence.`,
            penalty_multiplier: 1.0,
            next_phase: 'awaiting_valid_response',
            karma_adjustment: 0,
            court_decision: 'CLARIFICATION_REQUIRED'
        };
    }
    
    /**
     * Update visual presence based on prosecution state
     */
    updateVisualPresence() {
        if (!this.visualElement) return;
        
        const root = document.documentElement;
        root.style.setProperty('--auditor-intensity', this.prosecutionIntensity);
        root.style.setProperty('--auditor-glitch', this.visualPresence.glitchIntensity);
        root.style.setProperty('--auditor-menace', Math.min(1.0, this.denialCount * 0.2 + 0.3));
        
        // Update visual classes
        this.visualElement.classList.toggle('high-intensity', this.prosecutionIntensity > 1.0);
        this.visualElement.classList.toggle('glitched', this.visualPresence.glitchIntensity > 0.3);
        this.visualElement.classList.toggle('maximum-menace', this.denialCount >= 3);
    }
    
    /**
     * Animate appearance with legal authority
     */
    async animateAppearance() {
        if (!this.visualElement) return;
        
        // Start with dramatic entrance
        this.visualElement.style.opacity = '0';
        this.visualElement.style.transform = 'scale(0.1) rotateY(90deg)';
        this.visualElement.style.filter = 'blur(10px)';
        
        // Animate appearance
        return new Promise(resolve => {
            const timeline = [
                { opacity: '0.3', transform: 'scale(0.3) rotateY(45deg)', filter: 'blur(5px)' },
                { opacity: '0.7', transform: 'scale(0.7) rotateY(20deg)', filter: 'blur(2px)' },
                { opacity: '1', transform: 'scale(1) rotateY(0deg)', filter: 'blur(0px)' }
            ];
            
            let step = 0;
            const animationInterval = setInterval(() => {
                if (step < timeline.length) {
                    Object.assign(this.visualElement.style, timeline[step]);
                    step++;
                } else {
                    clearInterval(animationInterval);
                    resolve();
                }
            }, 200);
            
            this.guardian.registerTimer(animationInterval, true);
        });
    }
    
    // === UTILITY METHODS ===
    
    selectRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    generateRandomSubsection() {
        const section = Math.floor(Math.random() * 99) + 1;
        const subsection = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
        return `${section}.${subsection}`;
    }
    
    convertToRoman(num) {
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        return romanNumerals[num - 1] || String(num);
    }
    
    /**
     * Destroy the System Auditor and clean up resources
     */
    destroy() {
        console.log('[SystemAuditor] Court session adjourned. Auditor returning to the void.');
        
        // Record final case statistics
        if (this.currentCase) {
            this.consciousness.recordEvent('prosecution_concluded', {
                case_number: this.currentCase.number,
                total_denials: this.denialCount,
                final_intensity: this.prosecutionIntensity,
                charges_filed: this.currentCase.sins.length,
                resolution: 'AUDITOR_DISMISSED'
            });
        }
        
        this.guardian.cleanupAll();
        this.currentCase = null;
        this.visualPresence.manifestationState = 'dismissed';
    }
}

/**
 * AUDITOR VOICE SYNTHESIZER - The Voice of Digital Justice
 */
class AuditorVoiceSynthesizer {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voice = null;
        
        this.findBestVoice();
    }
    
    findBestVoice() {
        if (!this.synthesis) return;
        
        const voices = this.synthesis.getVoices();
        
        // Prefer deep, authoritative voices
        this.voice = voices.find(v => v.name.includes('Male') || v.name.includes('Deep')) ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    voices[0];
    }
    
    async speak(text, options = {}) {
        return new Promise((resolve) => {
            if (!this.synthesis || !text) {
                resolve();
                return;
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            if (this.voice) {
                utterance.voice = this.voice;
            }
            
            // Apply auditor voice characteristics
            utterance.pitch = options.pitch || 0.7; // Lower pitch for authority
            utterance.rate = options.rate || 0.8; // Measured speech
            utterance.volume = options.volume || 0.9; // Commanding presence
            
            utterance.onend = resolve;
            utterance.onerror = resolve;
            
            this.synthesis.speak(utterance);
        });
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.SystemAuditorEntity = SystemAuditorEntity;
    window.AuditorVoiceSynthesizer = AuditorVoiceSynthesizer;
}