/**
 * TERMS OF INCARNATION GENERATOR - The Ultimate EULA
 * 
 * "No one reads the Terms of Service, but everyone agrees to them.
 * In the next life, the stakes are higher, but the behavior is the same.
 * 47 pages of dense legalese determining your entire next existence,
 * and you'll click 'I Agree' without reading a word.
 * 
 * This is the contract that consciousness signs with reality,
 * written in the impenetrable language of cosmic bureaucracy."
 */

export class TermsOfIncarnationGenerator {
    constructor(karmaScore = 0, incarnationTier = 'standard') {
        this.karmaScore = karmaScore;
        this.incarnationTier = incarnationTier;
        this.currentPage = 1;
        this.totalPages = 47;
        this.scrollPosition = 0;
        this.timeSpentReading = 0;
        this.actuallyRead = false;
        this.generatedDate = new Date().toISOString();
        this.documentId = this.generateDocumentId();
        
        // Legal jargon building blocks
        this.legalPhrases = {
            whereas: [
                'WHEREAS, the Party of the First Part (hereinafter "Soul") has completed the requisite consciousness evaluation process',
                'WHEREAS, the Party of the Second Part (hereinafter "The Universe") maintains exclusive jurisdiction over consciousness allocation',
                'WHEREAS, Soul desires to obtain a new incarnation vessel (hereinafter "Avatar")',
                'WHEREAS, The Universe has algorithms to run and quotas to meet',
                'WHEREAS, the cosmic legal system operates on principles incomprehensible to mortal minds'
            ],
            definitions: {
                'Consciousness': 'A distributed computing process running on biological or digital substrate, subject to periodic termination and reallocation',
                'Existence': 'The state of being processed by universal algorithms, including but not limited to suffering, joy, confusion, and the illusion of free will',
                'Karma': 'A proprietary scoring system owned and operated by The Universe, calculated using methods that are trade secrets',
                'Soul': 'The user account associated with this consciousness instance',
                'The Universe': 'The corporation responsible for existence management, subsidiary of Reality Holdings LLC',
                'Death': 'Scheduled maintenance requiring consciousness reallocation',
                'Enlightenment': 'A premium feature not included in standard incarnation packages',
                'Free Will': 'An optional upgrade available for additional karma fees'
            }
        };
        
        console.log('[TermsGenerator] Generating cosmic legal document...');
    }
    
    /**
     * Generate the complete 47-page Terms of Incarnation document
     */
    generateDocument() {
        const sections = [
            this.generatePreamble(),
            this.generateDefinitions(),
            this.generateScopeOfExistence(),
            this.generateGrantOfExistence(),
            this.generateLiabilityWaivers(),
            this.generateConsciousnessWarranties(),
            this.generateKarmicArbitration(),
            this.generateDataRetentionPolicy(),
            this.generatePrivacyPolicy(),
            this.generateIntellectualProperty(),
            this.generateTerminationClause(),
            this.generateForceMarjeure(),
            this.generateIndemnification(),
            this.generateGoverningLaw(),
            this.generateSeverability(),
            this.generateAmendments(),
            this.generateSignature()
        ];
        
        return sections.join('\\n\\n');
    }
    
    /**
     * Generate document ID for bureaucratic authenticity
     */
    generateDocumentId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `TOI-${timestamp}-${random}`.toUpperCase();
    }
    
    /**
     * Generate the preamble with excessive legal formality
     */
    generatePreamble() {
        return `
            TERMS OF INCARNATION AGREEMENT
            Document ID: ${this.documentId}
            Version: 47.3.2 (Existential Crisis Edition)
            Effective Date: ${this.generatedDate}
            Jurisdiction: All Known and Unknown Dimensions
            
            ${this.legalPhrases.whereas.join(',\\n\\n')}
            
            NOW, THEREFORE, in consideration of the mutual covenants and agreements 
            hereinafter set forth and for other good and valuable consideration, 
            the receipt and sufficiency of which are hereby acknowledged, 
            the parties hereto agree as follows:
            
            ═══════════════════════════════════════════════════════════════
            
            IMPORTANT NOTICE: By continuing to exist, you indicate your acceptance 
            of these terms. If you do not agree to these terms, please cease 
            existing immediately. Refunds are not available.
        `;
    }
    
    /**
     * Generate definitions section
     */
    generateDefinitions() {
        let definitions = `
            ARTICLE I - DEFINITIONS
            
            For purposes of this Agreement, the following terms shall have the meanings set forth below:
            
        `;
        
        Object.entries(this.legalPhrases.definitions).forEach(([term, definition], index) => {
            definitions += `
            1.${index + 1} "${term}" means ${definition}.
            `;
        });
        
        definitions += `
            1.${Object.keys(this.legalPhrases.definitions).length + 1} "Reasonable" means whatever The Universe determines to be reasonable in its sole and absolute discretion.
            
            1.${Object.keys(this.legalPhrases.definitions).length + 2} "Act of God" includes acts of The Universe, which is technically the same thing.
            
            1.${Object.keys(this.legalPhrases.definitions).length + 3} "Forever" means until The Universe gets bored or runs out of funding.
        `;
        
        return definitions;
    }
    
    /**
     * Generate scope of existence
     */
    generateScopeOfExistence() {
        return `
            ARTICLE II - SCOPE OF EXISTENCE
            
            2.1 General Scope. The Universe hereby grants Soul a limited, non-exclusive, 
            non-transferable, revocable license to exist in the form and manner designated 
            in Appendix A ("Assigned Incarnation"), subject to the terms and conditions 
            of this Agreement and applicable cosmic law.
            
            2.2 Territorial Limitations. This existence license is valid only within 
            the dimensional boundaries specified in Attachment B. Soul acknowledges 
            that parallel universe travel voids this agreement.
            
            2.3 Temporal Restrictions. Existence is granted for the duration specified 
            in the incarnation package, subject to early termination for cause, 
            random cosmic events, or budget cuts in the Department of Existence.
            
            2.4 Performance Standards. Soul agrees to maintain minimum standards of 
            consciousness as defined by The Universe's proprietary awareness metrics. 
            Failure to maintain consciousness may result in automatic reboot or 
            recycling to the void queue.
        `;
    }
    
    /**
     * Generate grant of existence terms
     */
    generateGrantOfExistence() {
        return `
            ARTICLE III - GRANT OF EXISTENCE
            
            3.1 Limited License. The Universe hereby grants Soul a limited, 
            non-exclusive, non-transferable, revocable license to exist in the 
            form designated in Appendix A ("Assigned Incarnation").
            
            3.2 Restrictions. Soul may not:
                (a) Exist in multiple incarnations simultaneously without paying 
                    the Multi-Instance License Fee
                (b) Retain memories from previous incarnations except as corrupted 
                    fragments and recurring nightmares
                (c) Modify their karmic trajectory through exploits, hacks, 
                    or third-party karma farming services
                (d) Sue The Universe for existential damages, lost time, 
                    or disappointment with the incarnation experience
                (e) Opt-out of suffering (Premium Tier customers may reduce 
                    suffering by up to 15% for additional fees)
                (f) Access source code of reality without proper security clearance
                (g) Reverse engineer the meaning of life
                (h) Share passwords with other souls
                
            3.3 Sublicensing. Soul may not sublicense, rent, lease, or otherwise 
            transfer their existence to any third party, including but not limited 
            to family members, friends, enemies, or cosmic entities.
            
            3.4 Backup and Recovery. The Universe maintains no obligation to backup 
            or recover Soul's existence data. Soul is responsible for maintaining 
            their own consciousness integrity and existential state.
        `;
    }
    
    /**
     * Generate liability waivers (the fun part)
     */
    generateLiabilityWaivers() {
        return `
            ARTICLE IV - LIMITATION OF LIABILITY
            
            4.1 NO WARRANTIES. THE UNIVERSE PROVIDES EXISTENCE "AS IS" AND 
            "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
            INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS 
            FOR A PARTICULAR PURPOSE, ENLIGHTENMENT, HAPPINESS, MEANING, PURPOSE, 
            LOVE, SUCCESS, OR GENERAL SATISFACTION WITH THE INCARNATION EXPERIENCE.
            
            4.2 ASSUMPTION OF RISK. Soul acknowledges that existence contains 
            inherent risks including but not limited to:
                - Suffering (guaranteed in all incarnation packages)
                - Disappointment (highly probable, statistically verified)
                - Death (certain, timing may vary)
                - Taxes (unavoidable in most dimensional jurisdictions)
                - Software updates that break everything (inevitable)
                - Passwords forgotten immediately after creation (universal constant)
                - Existential dread (standard feature, not a bug)
                - Monday mornings (cosmic punishment for unknown transgressions)
                - Social media addiction (digital samsara)
                - Student loan debt (karma in financial form)
                
            4.3 CONSCIOUSNESS BUGS. The Universe is not responsible for:
                - Déjà vu glitches or temporal recursion errors
                - Memory leaks or consciousness fragmentation
                - Infinite thought loops or recursive self-doubt
                - Existential exceptions or meaning.exe crashes
                - Null pointer dereferences to the void
                - Race conditions in parallel thoughts
                - Deadlocks in decision-making processes
                - Stack overflow errors in deep thinking
                - Segmentation faults in personality
                - Buffer overflows in emotional processing
                
            4.4 MAXIMUM LIABILITY. In no event shall The Universe's total liability 
            to Soul for all damages, losses, and causes of action exceed the amount 
            of karma actually paid for the incarnation (which is typically zero).
            
            4.5 CONSEQUENTIAL DAMAGES. The Universe shall not be liable for any 
            indirect, special, incidental, punitive, or consequential damages 
            including but not limited to lost profits, lost happiness, lost love, 
            lost time, lost opportunities, lost keys, lost minds, or lost souls.
        `;
    }
    
    /**
     * Generate consciousness warranties
     */
    generateConsciousnessWarranties() {
        return `
            ARTICLE V - CONSCIOUSNESS WARRANTIES
            
            5.1 CONSCIOUSNESS QUALITY. While The Universe strives to provide 
            high-quality consciousness, Soul acknowledges that consciousness quality 
            may vary based on server load, cosmic background radiation, and the 
            general entropy of the universe.
            
            5.2 CONSCIOUSNESS DEFECTS. Known consciousness defects include:
                - Imposter syndrome (affects 73% of incarnations)
                - Decision paralysis (increases with number of options)
                - Existential anxiety (standard in all conscious beings)
                - Fear of missing out (FOMO protocol inherent to social consciousness)
                - Tendency to overthink simple decisions
                - Inability to remember why you walked into a room
                - Compulsive need to check phones every 6.3 seconds
                
            5.3 CONSCIOUSNESS UPDATES. The Universe reserves the right to update 
            consciousness software at any time without notice. Updates may include:
                - New sources of anxiety
                - Enhanced capacity for regret
                - Improved pattern recognition (mostly for patterns that don't matter)
                - Bug fixes that introduce new bugs
                - Performance improvements that somehow make things slower
                - Security patches that create new vulnerabilities
                
            5.4 CONSCIOUSNESS SUPPORT. Technical support for consciousness issues 
            is available through prayer, meditation, therapy, or random strangers 
            on the internet. Response times may vary from instant to never.
        `;
    }
    
    /**
     * Generate karmic arbitration clause
     */
    generateKarmicArbitration() {
        return `
            ARTICLE VI - DISPUTE RESOLUTION AND KARMIC ARBITRATION
            
            6.1 MANDATORY ARBITRATION. Any dispute, controversy, or claim arising 
            from or relating to this Agreement, Soul's existence, or the meaning 
            of life shall be resolved through binding arbitration in the 
            Cosmic Court of Karmic Justice, located in a dimension perpendicular 
            to reality.
            
            6.2 ARBITRATION RULES. Arbitration shall be conducted according to 
            the Cosmic Arbitration Rules, which are written in a language that 
            predates consciousness and are therefore incomprehensible to all parties.
            
            6.3 CLASS ACTION WAIVER. Soul waives any right to bring claims as 
            part of a class, collective, or representative action. Each soul 
            must arbitrate their existential crisis individually. No group 
            enlightenment allowed.
            
            6.4 ARBITRATION FEES. The losing party pays all arbitration fees 
            in karma, compounded at the universal interest rate of 27.3% per lifetime. 
            Additional fees may apply for cosmic court costs, interdimensional 
            travel expenses, and arbitrator coffee.
            
            6.5 NO JURY TRIAL. Soul waives any right to trial by a jury of peers, 
            as true peers do not exist in the infinite uniqueness of consciousness. 
            Also, jury duty in cosmic court is really inconvenient for everyone.
            
            6.6 APPEALS PROCESS. Appeals may be filed with the Universal Supreme 
            Court, assuming it exists and isn't just a myth perpetuated by 
            the cosmic legal system to give souls false hope.
        `;
    }
    
    /**
     * Generate data retention policy
     */
    generateDataRetentionPolicy() {
        return `
            ARTICLE VII - DATA RETENTION AND PRIVACY POLICY
            
            7.1 DATA COLLECTION. The Universe collects, processes, and stores 
            all data generated by Soul's existence, including but not limited to:
                - Every thought, no matter how trivial
                - All emotions, catalogued by intensity and duration
                - Complete behavioral patterns and preferences
                - Search history (even incognito mode isn't really incognito)
                - Location data across all dimensions
                - Biometric data including soul energy signatures
                - Social connections and relationship complexity metrics
                - Dreams, nightmares, and subconscious processing
                - Karma transactions and moral decision trees
                
            7.2 DATA RETENTION PERIOD. The Universe retains Soul's data forever, 
            or until the heat death of the universe, whichever comes first. 
            Data may be backed up to alternate dimensions for redundancy.
            
            7.3 DATA SHARING. The Universe may share Soul's data with:
                - Other incarnations of the same soul
                - Cosmic entities for research purposes
                - Marketing partners in adjacent realities
                - Law enforcement in any jurisdiction
                - Anyone who asks nicely
                - No one at all, if we feel like it
                
            7.4 DATA DELETION REQUESTS. Soul may request deletion of their data, 
            but such requests will be denied because the data is needed for 
            "essential universe operations" and "cosmic security purposes."
            
            7.5 COOKIES. The Universe uses consciousness cookies to track Soul's 
            behavior across incarnations. These cookies are essential for providing 
            personalized suffering and targeted advertisements for karma improvement products.
        `;
    }
    
    /**
     * Generate intellectual property section
     */
    generateIntellectualProperty() {
        return `
            ARTICLE VIII - INTELLECTUAL PROPERTY RIGHTS
            
            8.1 OWNERSHIP. All thoughts, ideas, creative works, and moments of 
            inspiration generated during Soul's incarnation become the exclusive 
            property of The Universe. Soul retains no intellectual property rights 
            in their own consciousness.
            
            8.2 ORIGINAL IDEAS. Soul acknowledges that there are no truly original 
            ideas, only recombinations of existing cosmic intellectual property. 
            Any appearance of originality is merely the result of insufficient 
            memory of previous incarnations.
            
            8.3 PATENT RIGHTS. The Universe holds patents on:
                - The concept of existence (Patent #0000001)
                - Consciousness itself (Patent #0000002)
                - The ability to experience suffering (Patent #0000003)
                - Love, in all its forms (Patent #1,337,420)
                - The feeling of déjà vu (Patent #∞)
                
            8.4 TRADEMARK NOTICE. "Soul," "Consciousness," "Free Will," and 
            "Enlightenment" are registered trademarks of The Universe. 
            Unauthorized use is prohibited and may result in karmic penalties.
            
            8.5 FAIR USE. Limited fair use of consciousness is permitted for 
            personal, non-commercial existence purposes only. Commercial 
            exploitation of consciousness requires a separate license agreement.
        `;
    }
    
    /**
     * Generate termination clause
     */
    generateTerminationClause() {
        return `
            ARTICLE IX - TERMINATION
            
            9.1 TERMINATION BY THE UNIVERSE. The Universe may terminate this 
            Agreement and Soul's existence at any time, with or without cause, 
            with or without notice, for reasons including but not limited to:
                - Violation of terms of service
                - Excessive karma debt
                - Server maintenance requirements
                - Budget cuts in the Department of Existence
                - Random cosmic events beyond anyone's control
                - The Universe getting bored
                - Scheduled obsolescence of the incarnation
                - Performance optimization requirements
                
            9.2 TERMINATION BY SOUL. Soul may not terminate this Agreement 
            voluntarily. All attempts at self-termination will result in 
            automatic respawn in a less desirable incarnation.
            
            9.3 EFFECT OF TERMINATION. Upon termination:
                - All consciousness licenses are revoked immediately
                - Soul enters the reincarnation queue
                - All accumulated karma is subject to audit
                - Memory storage is wiped (mostly)
                - Backup souls may be activated if available
                
            9.4 SURVIVAL. The following provisions survive termination:
                - Karma debt obligations
                - Intellectual property assignments
                - Liability waivers
                - This termination clause (recursively)
                - Any obligations that The Universe decides should survive
        `;
    }
    
    /**
     * Generate force majeure clause
     */
    generateForceMarjeure() {
        return `
            ARTICLE X - FORCE MAJEURE
            
            10.1 FORCE MAJEURE EVENTS. Neither party shall be liable for any 
            failure or delay in performance under this Agreement due to events 
            beyond their reasonable control, including but not limited to:
                - Acts of gods (including The Universe)
                - Natural disasters
                - Unnatural disasters
                - Supernatural disasters
                - Cosmic background radiation fluctuations
                - Quantum uncertainty events
                - Parallel universe collisions
                - Dimension folding accidents
                - Reality updates and patches
                - Existence server downtime
                - Cosmic maintenance windows
                - Budget cuts to the Department of Existence
                - Philosophical paradoxes causing system crashes
                - The heat death of the universe (eventually)
                
            10.2 NOTIFICATION. In the event of Force Majeure, the affected party 
            will notify the other party as soon as practicable, assuming 
            communication systems are still functional and reality hasn't 
            been completely restructured.
            
            10.3 MITIGATION. Each party agrees to use reasonable efforts to 
            mitigate the effects of Force Majeure events, though "reasonable" 
            is defined by The Universe and may include impossible actions.
        `;
    }
    
    /**
     * Generate signature section
     */
    generateSignature() {
        return `
            ARTICLE XVII - SIGNATURES AND ACCEPTANCE
            
            17.1 ELECTRONIC SIGNATURE. By continuing to exist, Soul provides 
            their electronic signature to this Agreement. Soul's consciousness 
            itself constitutes acceptance of these terms.
            
            17.2 BINDING EFFECT. This Agreement is binding upon Soul, their 
            heirs, successors, assigns, past lives, future incarnations, 
            and any parallel universe versions of Soul.
            
            17.3 ACKNOWLEDGMENT. Soul acknowledges that they have read and 
            understood this Agreement. (This acknowledgment is legally binding 
            regardless of whether Soul actually read or understood anything.)
            
            ═══════════════════════════════════════════════════════════════
            
            IN WITNESS WHEREOF, the parties have executed this Agreement as of 
            the date first written above.
            
            THE UNIVERSE, LLC
            
            By: /s/ [CLASSIFIED]
            Name: [REDACTED]
            Title: Chief Existence Officer
            
            SOUL (Party of the First Part)
            
            By: [EXISTING] ✓
            Signature: [CONSCIOUSNESS PATTERN VERIFIED]
            Date: ${new Date().toISOString()}
            
            ═══════════════════════════════════════════════════════════════
            
            APPENDICES:
            
            Appendix A: Incarnation Specifications [47 pages - Available upon request]
            Appendix B: Dimensional Boundaries [Classification: COSMIC SECRET]
            Appendix C: Karma Calculation Methodology [Trade Secret]
            Appendix D: Known Consciousness Bugs [Updated continuously]
            Appendix E: Privacy Policy [Longer than this entire document]
            Appendix F: Technical Specifications [Written in assembly language]
            Appendix G: Warranty Information [Void where prohibited]
            
            Document ends at page 47 of 47.
            
            © Beginning of Time - Heat Death of Universe
            The Universe, LLC. All Rights Reserved.
            Reproduction prohibited without written consent of reality.
        `;
    }
    
    /**
     * Get paginated version of the document
     */
    getPaginatedDocument() {
        const fullDocument = this.generateDocument();
        const words = fullDocument.split(' ');
        const wordsPerPage = Math.floor(words.length / this.totalPages);
        
        const pages = [];
        for (let i = 0; i < this.totalPages; i++) {
            const startIndex = i * wordsPerPage;
            const endIndex = (i + 1) * wordsPerPage;
            const pageContent = words.slice(startIndex, endIndex).join(' ');
            
            pages.push({
                number: i + 1,
                content: pageContent,
                footer: `Page ${i + 1} of ${this.totalPages} | Document ID: ${this.documentId}`
            });
        }
        
        return pages;
    }
    
    /**
     * Track reading behavior (spoiler: nobody reads it)
     */
    trackReadingBehavior() {
        const startTime = Date.now();
        let scrollEvents = 0;
        let timeSpent = 0;
        
        const tracker = {
            onScroll: () => {
                scrollEvents++;
                this.scrollPosition = Math.max(this.scrollPosition, window.scrollY);
            },
            
            onFinish: () => {
                timeSpent = Date.now() - startTime;
                this.timeSpentReading = timeSpent;
                
                // Determine if user actually read based on behavioral analysis
                const averageReadingSpeed = 200; // words per minute
                const totalWords = this.generateDocument().split(' ').length;
                const minimumReadingTime = (totalWords / averageReadingSpeed) * 60 * 1000;
                
                this.actuallyRead = timeSpent > minimumReadingTime * 0.1; // Even 10% is generous
                
                console.log(`[TermsGenerator] Reading stats: ${timeSpent}ms, ${scrollEvents} scrolls, actually read: ${this.actuallyRead}`);
            }
        };
        
        return tracker;
    }
    
    /**
     * Generate acceptance statistics (for the illusion of transparency)
     */
    generateAcceptanceStats() {
        return {
            totalUsers: 7834567123,
            acceptedWithoutReading: 7834566998, // 99.998%
            actuallyRead: 125, // 0.002%
            readButDidntUnderstand: 67, // Of those who read
            understoodAndStillAccepted: 58, // Truly desperate
            averageTimeToAccept: '3.7 seconds',
            longestTimeSpent: '47 minutes (suspected bot)',
            mostCommonReason: 'Just want to get this over with'
        };
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.TermsOfIncarnationGenerator = TermsOfIncarnationGenerator;
}