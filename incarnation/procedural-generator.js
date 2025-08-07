/**
 * PROCEDURAL INCARNATION GENERATOR - Algorithmic Fate Assignment
 * 
 * "The universe runs on algorithms, not prayers. Your next life is not
 * a divine choice but a database query, not a cosmic judgment but a
 * calculated recommendation based on your digital exhaust patterns.
 * 
 * This system generates your incarnation with the cold precision of
 * a recommendation engine, the bureaucratic complexity of tax law,
 * and the existential weight of a performance review."
 */

export class ProceduralIncarnationGenerator {
    constructor(karmaScore = 0, userChoices = {}, journeyData = {}) {
        this.karmaScore = karmaScore;
        this.userChoices = userChoices;
        this.journeyData = journeyData;
        this.incarnationSeed = this.generateIncarnationSeed();
        
        // Algorithmic personality assessment parameters
        this.personalityFactors = {
            introversion: 0.5,           // 0 = extrovert, 1 = introvert
            neuroticism: 0.6,            // 0 = stable, 1 = neurotic
            openness: 0.4,               // 0 = conventional, 1 = creative
            conscientiousness: 0.3,      // 0 = disorganized, 1 = disciplined  
            agreeableness: 0.4,          // 0 = competitive, 1 = cooperative
            techProficiency: 0.7,        // 0 = luddite, 1 = cyber-native
            existentialDread: 0.8,       // 0 = blissful, 1 = anxious
            procrastination: 0.9         // 0 = punctual, 1 = procrastinator
        };
        
        // Environmental preference matrices
        this.environmentPrefs = {
            urbanVsRural: 0.8,           // 0 = rural, 1 = urban
            noiseVsQuiet: 0.3,           // 0 = quiet, 1 = noisy
            structureVsChaos: 0.4,       // 0 = chaos, 1 = structure
            socialVsSolo: 0.2,           // 0 = solo, 1 = social
            securityVsAdventure: 0.7,    // 0 = adventure, 1 = security
            traditionalVsProgressive: 0.6 // 0 = traditional, 1 = progressive
        };
        
        // Incarnation attribute templates with procedural variation
        this.attributeTemplates = {
            personality: {
                quirks: [
                    'Compulsively organizes digital files but lives in physical chaos',
                    'Excellent at debugging code, terrible at debugging relationships',
                    'Can explain quantum mechanics but gets confused by social media privacy settings',
                    'Remembers every API endpoint but forgets people\'s names immediately',
                    'Perfectionist about work, slob about everything else',
                    'Night owl who mysteriously becomes productive at 2 AM',
                    'Collects browser bookmarks like digital hoarding',
                    'Speaks fluent sarcasm and broken small talk',
                    'Has strong opinions about text editors and weak opinions about life choices',
                    'Anxiety-driven overachiever with imposter syndrome'
                ],
                strengths: [
                    'Pattern recognition in complex systems',
                    'Ability to focus intensely on interesting problems',
                    'Creative problem-solving through lateral thinking',
                    'Persistence through repetitive, mindless tasks',
                    'Tolerance for ambiguity and uncertainty',
                    'Capacity for deep, obsessive learning',
                    'Humor as a coping mechanism',
                    'Adaptability to rapidly changing technology',
                    'Empathy through shared experiences of confusion',
                    'Appreciation for elegant solutions'
                ],
                flaws: [
                    'Tendency to overthink simple decisions',
                    'Procrastination on important but boring tasks',
                    'Social awkwardness in non-technical contexts',
                    'Perfectionism that prevents completion',
                    'Imposter syndrome despite demonstrable competence',
                    'Addiction to novelty and stimulation',
                    'Difficulty with self-promotion and networking',
                    'Burnout from unsustainable work habits',
                    'Analysis paralysis when faced with too many options',
                    'Tendency to optimize the wrong things'
                ]
            },
            
            circumstances: {
                livingSpaces: [
                    'Studio apartment with more cables than furniture',
                    'Suburban house with a dedicated "computer room"',
                    'Co-living space in a tech hub city',
                    'Converted garage workshop with questionable electrical wiring',
                    'Minimalist space with one perfect workstation',
                    'Cluttered room that somehow has perfect cable management',
                    'Open floor plan that gets reorganized monthly',
                    'Tiny home with maximum technology density',
                    'Shared space with roommates who don\'t understand the home network setup',
                    'Inherited family home with fiber internet as the only upgrade'
                ],
                
                workSituations: [
                    'Remote worker who hasn\'t worn pants to a meeting in years',
                    'Office worker longing for the days of remote work',
                    'Freelancer with feast-or-famine income cycles',
                    'Startup employee with equity that may or may not be worthless',
                    'Corporate developer slowly dying inside but with good health insurance',
                    'Consultant who travels constantly but works from airport lounges',
                    'Academic researcher with brilliant ideas and no funding',
                    'Government contractor navigating bureaucracy and security clearances',
                    'Open source contributor who somehow pays rent',
                    'Entrepreneur whose "unicorn idea" is perpetually six months away'
                ],
                
                relationships: [
                    'Single and debugging life one function at a time',
                    'Partnered with someone who understands why you talk to rubber ducks',
                    'Married to someone who tolerates your keyboard obsession',
                    'In a relationship conducted primarily through Git commits',
                    'Dating someone from a completely non-technical field',
                    'Single parent juggling code sprints and soccer practice',
                    'Long-distance relationship maintained through video calls and shared screens',
                    'Living with parents while saving money and sanity',
                    'Part of a chosen family of fellow digital refugees',
                    'Surrounded by cats who judge your code style'
                ]
            },
            
            challenges: {
                technical: [
                    'Legacy codebase that defies all known laws of software engineering',
                    'Database that should have been migrated years ago but nobody dares touch',
                    'Microservices architecture that has become a distributed monolith',
                    'Security requirements that conflict with usability requirements',
                    'Performance optimization for code written by someone who left the company',
                    'Integration with third-party APIs that change without warning',
                    'Documentation that exists in theory but not in practice',
                    'Testing framework that tests everything except what matters',
                    'Deployment pipeline that works only when Mercury is in retrograde',
                    'Code review process that has become a philosophical debate society'
                ],
                
                existential: [
                    'Wondering if your work actually makes the world better or just more connected',
                    'Imposter syndrome despite years of evidence to the contrary',
                    'Balancing automation of human jobs with need for meaningful work',
                    'Dealing with the ethical implications of data collection and surveillance',
                    'Feeling obsolete every time a new framework gains popularity',
                    'Questioning whether intelligence augmentation leads to wisdom',
                    'Struggling with work-life balance in an always-connected world',
                    'Managing anxiety about AI replacing human creativity',
                    'Navigating the tension between innovation and regulation',
                    'Seeking purpose in a field driven by venture capital and growth metrics'
                ]
            },
            
            opportunities: {
                personal: [
                    'Learning a new programming language that changes how you think',
                    'Contributing to open source projects that align with your values',
                    'Teaching others and rediscovering the joy of beginner\'s mind',
                    'Building something creative that has no commercial purpose',
                    'Developing skills that don\'t involve staring at screens',
                    'Finding communities of practice beyond your immediate work bubble',
                    'Experimenting with new ways of organizing and managing complexity',
                    'Cultivating patience and mindfulness in a culture of perpetual urgency',
                    'Discovering that debugging is a metaphor for life problem-solving',
                    'Embracing the art of saying no to projects that don\'t spark joy'
                ],
                
                professional: [
                    'Working on projects that have meaningful impact on real problems',
                    'Mentoring junior developers and remembering what you wish you had known',
                    'Building systems that are not just functional but elegant and maintainable',
                    'Collaborating with interdisciplinary teams that challenge your assumptions',
                    'Specializing in a domain that combines technical and human understanding',
                    'Leading technical initiatives that balance innovation with stability',
                    'Architecting solutions that will still make sense to future maintainers',
                    'Advocating for technical debt reduction and sustainable development practices',
                    'Bridge-building between technical teams and business stakeholders',
                    'Pioneering ethical approaches to technology development and deployment'
                ]
            }
        };
        
        console.log('[ProceduralGenerator] Algorithmic fate generator initialized');
    }
    
    /**
     * Generate unique incarnation seed from user data
     */
    generateIncarnationSeed() {
        const seedComponents = [
            Date.now() % 10000,
            this.karmaScore * 1000,
            JSON.stringify(this.userChoices).length,
            Math.floor(Math.random() * 1000000)
        ];
        
        return seedComponents.reduce((sum, component) => sum + component, 0) % 999999;
    }
    
    /**
     * Analyze journey data to extract personality factors
     */
    analyzeJourneyForPersonality() {
        const { clearLode, datascape, karma } = this.journeyData;
        
        // Clear Lode analysis - how user handled the light recognition
        if (clearLode) {
            if (clearLode.recognized) {
                this.personalityFactors.openness += 0.2; // Open to transcendent experiences
                this.personalityFactors.conscientiousness += 0.1; // Followed through
            } else {
                this.personalityFactors.neuroticism += 0.2; // Anxious, hesitated
                this.personalityFactors.procrastination += 0.1; // Delayed decision
            }
            
            // Recognition method analysis
            switch (clearLode.recognitionMethod) {
                case 'center_click':
                    this.personalityFactors.introversion -= 0.1; // Intuitive action
                    this.personalityFactors.techProficiency += 0.1; // UI savvy
                    break;
                case 'keyword_typing':
                    this.personalityFactors.conscientiousness += 0.2; // Systematic
                    this.personalityFactors.introversion += 0.1; // Thoughtful
                    break;
                case 'spacebar_hold':
                    this.personalityFactors.agreeableness += 0.1; // Patient
                    this.personalityFactors.existentialDread -= 0.1; // Calm
                    break;
            }
        }
        
        // Datascape analysis - how user handled temptation and attachment
        if (datascape) {
            if (datascape.attachmentPeak > 10) {
                this.personalityFactors.neuroticism += 0.2; // Easily attached
                this.personalityFactors.agreeableness += 0.1; // Emotionally engaged
            }
            
            if (datascape.daemonsEncountered > 0) {
                this.personalityFactors.openness += 0.1; // Explored temptation
                this.personalityFactors.conscientiousness -= 0.1; // Less disciplined
            }
            
            if (datascape.sinsAcknowledged > 0) {
                this.personalityFactors.conscientiousness += 0.2; // Self-aware
                this.personalityFactors.neuroticism += 0.1; // Self-critical
            }
        }
        
        // Karma analysis
        if (karma) {
            this.personalityFactors.techProficiency += karma.computational * 0.01;
            this.personalityFactors.agreeableness += karma.emotional * 0.01;
            this.personalityFactors.conscientiousness += karma.temporal * 0.01;
            this.personalityFactors.existentialDread += karma.void * 0.02;
        }
        
        // Normalize all factors to [0,1] range
        Object.keys(this.personalityFactors).forEach(key => {
            this.personalityFactors[key] = Math.max(0, Math.min(1, this.personalityFactors[key]));
        });
        
        console.log('[ProceduralGenerator] Personality analysis complete:', this.personalityFactors);
    }
    
    /**
     * Generate procedural incarnation description
     */
    generateIncarnation() {
        this.analyzeJourneyForPersonality();
        
        const incarnation = {
            id: `PROC-${this.incarnationSeed}`,
            title: this.generateTitle(),
            subtitle: this.generateSubtitle(),
            description: this.generateDescription(),
            personality: this.generatePersonalityProfile(),
            circumstances: this.generateCircumstances(),
            challenges: this.generateChallenges(),
            opportunities: this.generateOpportunities(),
            quirks: this.generateQuirks(),
            metrics: this.generateMetrics(),
            lifecycle: this.generateLifecycle(),
            disclaimer: this.generateDisclaimer(),
            generated: Date.now(),
            seed: this.incarnationSeed
        };
        
        console.log(`[ProceduralGenerator] Generated incarnation: ${incarnation.title}`);
        return incarnation;
    }
    
    /**
     * Generate incarnation title based on personality and karma
     */
    generateTitle() {
        const titleComponents = {
            adjectives: [
                'Debugging', 'Refactoring', 'Optimizing', 'Architecting',
                'Procrastinating', 'Caffeinated', 'Sleep-deprived', 'Anxious',
                'Perfectionist', 'Pragmatic', 'Idealistic', 'Cynical',
                'Remote', 'Hybrid', 'Distributed', 'Asynchronous'
            ],
            roles: [
                'Code Archaeologist', 'Bug Whisperer', 'API Translator', 
                'Database Therapist', 'Infrastructure Shaman', 'UX Empath',
                'DevOps Alchemist', 'Security Paranoid', 'Performance Optimizer',
                'Legacy Code Survivor', 'Framework Nomad', 'Stack Overflow Oracle'
            ],
            domains: [
                'in the Cloud', 'of the Microservices', 'in Kubernetes',
                'of the Monorepo', 'in Docker Containers', 'of the CI/CD Pipeline',
                'in Production', 'of the Staging Environment', 'in the Terminal',
                'of the IDE', 'in Vim', 'of the Error Logs'
            ]
        };
        
        // Select components based on personality factors
        const adjIndex = Math.floor(this.personalityFactors.neuroticism * titleComponents.adjectives.length);
        const roleIndex = Math.floor(this.personalityFactors.techProficiency * titleComponents.roles.length);
        const domainIndex = Math.floor(this.personalityFactors.conscientiousness * titleComponents.domains.length);
        
        return `${titleComponents.adjectives[adjIndex]} ${titleComponents.roles[roleIndex]} ${titleComponents.domains[domainIndex]}`;
    }
    
    /**
     * Generate incarnation subtitle
     */
    generateSubtitle() {
        const subtitles = [
            'Runtime error: life.exe has encountered an unexpected exception',
            'TODO: Figure out the meaning of existence (priority: low)',
            'Works on my machine, fails in production reality',
            'Stackoverflow reputation > self-esteem',
            'Commit message: "Fixed bug, probably broke something else"',
            'Constantly refactoring personality.js',
            'Debugging relationship issues with console.log statements',
            'Unit tests pass, integration with society fails',
            'Async/await for better tomorrow',
            'try { live(); } catch (existentialCrisis) { coffee(); }'
        ];
        
        const index = Math.floor(this.personalityFactors.existentialDread * subtitles.length);
        return subtitles[index];
    }
    
    /**
     * Generate detailed description
     */
    generateDescription() {
        const templates = [
            `You spend your incarnation ${this.getWorkStyle()} while ${this.getPersonalStruggle()}. Your days are filled with ${this.getDailyActivity()} and your nights with ${this.getNightActivity()}. ${this.getExistentialNote()}`,
            
            `As a ${this.getTechRole()}, you find meaning through ${this.getMeaningSource()} while navigating ${this.getMainChallenge()}. ${this.getWorkEnvironment()} You are known for ${this.getReputation()} and ${this.getQuirk()}.`,
            
            `Your incarnation involves ${this.getPrimaryFocus()} in a world of ${this.getTechLandscape()}. You excel at ${this.getStrength()} but struggle with ${this.getWeakness()}. ${this.getLifePhilosophy()}`
        ];
        
        const templateIndex = this.incarnationSeed % templates.length;
        return templates[templateIndex];
    }
    
    /**
     * Generate personality profile with procedural traits
     */
    generatePersonalityProfile() {
        const profile = {
            primaryTrait: this.selectWeightedAttribute(this.attributeTemplates.personality.strengths),
            secondaryTrait: this.selectWeightedAttribute(this.attributeTemplates.personality.quirks),
            primaryFlaw: this.selectWeightedAttribute(this.attributeTemplates.personality.flaws),
            
            // Big Five personality scores as percentiles
            extraversion: Math.round((1 - this.personalityFactors.introversion) * 100),
            agreeableness: Math.round(this.personalityFactors.agreeableness * 100),
            conscientiousness: Math.round(this.personalityFactors.conscientiousness * 100),
            neuroticism: Math.round(this.personalityFactors.neuroticism * 100),
            openness: Math.round(this.personalityFactors.openness * 100),
            
            // Tech-specific traits
            techProficiency: Math.round(this.personalityFactors.techProficiency * 100),
            procrastinationLevel: Math.round(this.personalityFactors.procrastination * 100),
            existentialDreadIndex: Math.round(this.personalityFactors.existentialDread * 100)
        };
        
        return profile;
    }
    
    /**
     * Generate circumstantial details
     */
    generateCircumstances() {
        return {
            livingSpace: this.selectWeightedAttribute(this.attributeTemplates.circumstances.livingSpaces),
            workSituation: this.selectWeightedAttribute(this.attributeTemplates.circumstances.workSituations),
            relationships: this.selectWeightedAttribute(this.attributeTemplates.circumstances.relationships),
            
            // Environmental preferences
            preferredWorkingHours: this.personalityFactors.introversion > 0.6 ? 'Late night to early morning' : 
                                   this.personalityFactors.conscientiousness > 0.7 ? 'Traditional business hours' :
                                   'Whenever the code is flowing',
            
            idealVacation: this.personalityFactors.techProficiency > 0.8 ? 'Hackathon or tech conference' :
                          this.personalityFactors.neuroticism > 0.7 ? 'Isolated cabin with good WiFi' :
                          'Somewhere with stable internet and no deadlines',
                          
            coffeeConsumption: `${Math.floor(this.personalityFactors.neuroticism * 8 + 2)} cups per day`,
            
            musicWhileCoding: this.personalityFactors.introversion > 0.6 ? 'Lo-fi hip hop' :
                             this.personalityFactors.neuroticism > 0.7 ? 'Heavy metal' :
                             'Whatever drowns out the open office'
        };
    }
    
    /**
     * Generate challenges with appropriate difficulty scaling
     */
    generateChallenges() {
        const technicalChallenge = this.selectWeightedAttribute(this.attributeTemplates.challenges.technical);
        const existentialChallenge = this.selectWeightedAttribute(this.attributeTemplates.challenges.existential);
        
        return {
            primary: technicalChallenge,
            secondary: existentialChallenge,
            dailyStruggle: this.generateDailyStruggle(),
            careerObstacle: this.generateCareerObstacle(),
            personalGrowth: this.generatePersonalGrowthChallenge(),
            
            // Difficulty rating based on karma
            difficultyLevel: this.karmaScore < -25 ? 'Nightmare Mode' :
                            this.karmaScore < 0 ? 'Hard Mode' :
                            this.karmaScore < 25 ? 'Normal Mode' :
                            this.karmaScore < 50 ? 'Easy Mode' :
                            'Creative Mode (but still stressful)',
        };
    }
    
    /**
     * Generate opportunities for growth and success
     */
    generateOpportunities() {
        return {
            personal: this.selectWeightedAttribute(this.attributeTemplates.opportunities.personal),
            professional: this.selectWeightedAttribute(this.attributeTemplates.opportunities.professional),
            
            // Learning opportunities based on personality
            skillDevelopment: this.personalityFactors.openness > 0.6 ? 
                             'Exploring cutting-edge technologies and paradigms' :
                             'Deepening expertise in current technology stack',
                             
            networkingStyle: this.personalityFactors.introversion > 0.6 ? 
                            'One-on-one mentoring and online communities' :
                            'Conference speaking and team leadership',
                            
            // Career trajectory  
            careerPath: this.generateCareerPath(),
            
            // Probability of various outcomes
            successMetrics: {
                jobSatisfaction: Math.max(20, Math.min(80, 50 + this.karmaScore)),
                workLifeBalance: Math.max(10, Math.min(70, 40 + (1 - this.personalityFactors.neuroticism) * 30)),
                technicalGrowth: Math.max(30, Math.min(90, 60 + this.personalityFactors.openness * 30)),
                financialStability: Math.max(25, Math.min(75, 50 + this.personalityFactors.conscientiousness * 25))
            }
        };
    }
    
    /**
     * Generate unique quirks and idiosyncrasies
     */
    generateQuirks() {
        const baseQuirks = this.selectMultipleAttributes(this.attributeTemplates.personality.quirks, 3);
        
        const proceduralQuirks = [
            `Tabs vs spaces preference changes based on mood (currently ${this.personalityFactors.conscientiousness > 0.5 ? 'spaces' : 'tabs'})`,
            `Has ${Math.floor(this.personalityFactors.procrastination * 50 + 5)} unread programming books`,
            `Keyboard collection worth more than ${this.personalityFactors.techProficiency > 0.7 ? '$2000' : 'most people\'s laptops'}`,
            `Commits to git at ${this.personalityFactors.introversion > 0.6 ? '2:47 AM' : 'random hours'} with cryptic messages`,
            `${this.personalityFactors.neuroticism > 0.7 ? 'Anxiety-driven' : 'Curiosity-driven'} learning style`,
            `Explains complex technical concepts using ${this.getMetaphorSource()} analogies`
        ];
        
        return [...baseQuirks, ...proceduralQuirks.slice(0, 2)];
    }
    
    /**
     * Generate performance metrics
     */
    generateMetrics() {
        return {
            linesOfCodeWritten: Math.floor(this.personalityFactors.conscientiousness * 100000 + 50000),
            bugsFixed: Math.floor(this.personalityFactors.techProficiency * 1000 + 100),
            bugsCreated: Math.floor(this.personalityFactors.neuroticism * 800 + 200),
            coffeeToCodeRatio: (this.personalityFactors.neuroticism * 0.5 + 0.2).toFixed(2),
            
            stackOverflowReputation: Math.floor(this.personalityFactors.agreeableness * 50000 + 1000),
            githubStars: Math.floor(this.personalityFactors.openness * 10000 + 100),
            
            productivityScore: Math.round((
                this.personalityFactors.conscientiousness * 0.4 +
                this.personalityFactors.techProficiency * 0.3 +
                (1 - this.personalityFactors.procrastination) * 0.3
            ) * 100),
            
            burnoutRisk: Math.round((
                this.personalityFactors.neuroticism * 0.5 +
                this.personalityFactors.perfectionism * 0.3 +
                (1 - this.personalityFactors.agreeableness) * 0.2
            ) * 100),
            
            jobSatisfactionProjected: Math.max(10, Math.min(90, 
                50 + this.karmaScore + 
                (this.personalityFactors.openness - 0.5) * 40
            ))
        };
    }
    
    /**
     * Generate lifecycle timeline
     */
    generateLifecycle() {
        const phases = [
            {
                phase: 'Junior Developer Phase',
                duration: `${Math.floor(this.personalityFactors.conscientiousness * 3 + 1)}-${Math.floor(this.personalityFactors.conscientiousness * 5 + 2)} years`,
                description: 'Learning fundamentals while fighting imposter syndrome',
                keyChallenge: 'Everything is new and scary',
                keyOpportunity: 'Rapid learning and growth mindset'
            },
            {
                phase: 'Mid-Level Competence Phase', 
                duration: `${Math.floor(this.personalityFactors.techProficiency * 8 + 3)}-${Math.floor(this.personalityFactors.techProficiency * 12 + 5)} years`,
                description: 'Building expertise while questioning career choices',
                keyChallenge: 'Balancing specialization with staying current',
                keyOpportunity: 'Mentoring others and finding your niche'
            },
            {
                phase: 'Senior/Lead Phase',
                duration: 'Until retirement or complete burnout',
                description: 'Architecture decisions and existential dread',
                keyChallenge: 'Managing complexity and people simultaneously',
                keyOpportunity: 'Technical leadership and system design'
            }
        ];
        
        return {
            phases: phases,
            retirementPlan: this.personalityFactors.conscientiousness > 0.7 ? 
                           '401k and side projects' : 
                           'Hoping the startup equity pays off',
            legacyCode: 'Will be maintained by future generations with varying degrees of profanity',
            epitaph: this.generateEpitaph()
        };
    }
    
    /**
     * Helper methods for text generation
     */
    
    getWorkStyle() {
        if (this.personalityFactors.introversion > 0.7) return 'debugging in solitude';
        if (this.personalityFactors.agreeableness > 0.7) return 'collaborating on team projects';
        if (this.personalityFactors.conscientiousness > 0.7) return 'methodically refactoring legacy systems';
        return 'context-switching between seventeen different tasks';
    }
    
    getPersonalStruggle() {
        if (this.personalityFactors.neuroticism > 0.7) return 'battling constant anxiety about code quality';
        if (this.personalityFactors.procrastination > 0.8) return 'procrastinating on important documentation';
        if (this.personalityFactors.existentialDread > 0.7) return 'questioning whether technology truly improves human existence';
        return 'maintaining work-life balance in an always-connected world';
    }
    
    getDailyActivity() {
        const activities = [
            'code reviews that turn into philosophical debates',
            'meetings that could have been emails that could have been avoided',
            'optimizing algorithms that already work fine',
            'explaining why the simple solution is actually the hardest',
            'translating business requirements into technical reality'
        ];
        return activities[this.incarnationSeed % activities.length];
    }
    
    getNightActivity() {
        if (this.personalityFactors.introversion > 0.6) return 'side projects that will never see the light of day';
        if (this.personalityFactors.openness > 0.7) return 'learning new frameworks and immediately regretting it';
        return 'binge-watching tech talks while claiming it\'s professional development';
    }
    
    generateEpitaph() {
        const epitaphs = [
            'Their code compiled on the first try (once)',
            'Wrote documentation that future developers actually read',
            'Debugged the ultimate bug: existence itself',
            'Finally achieved work-life balance (by eliminating life)',
            'Left behind more Stack Overflow answers than questions',
            'Their legacy lives on in production (and technical debt)',
            'Merged into the great repository in the sky',
            'Error 404: Person not found, but their commits remain'
        ];
        return epitaphs[this.incarnationSeed % epitaphs.length];
    }
    
    selectWeightedAttribute(attributes) {
        const randomIndex = Math.floor(Math.random() * attributes.length);
        return attributes[randomIndex];
    }
    
    selectMultipleAttributes(attributes, count) {
        const shuffled = [...attributes].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
    
    generateDailyStruggle() {
        const struggles = [
            'Deciding between fixing technical debt and shipping new features',
            'Explaining why estimates are not deadlines to project managers',
            'Keeping up with framework updates while maintaining legacy systems',
            'Balancing code perfectionism with practical delivery timelines',
            'Managing notification overload from multiple development tools'
        ];
        return struggles[Math.floor(this.personalityFactors.neuroticism * struggles.length)];
    }
    
    generateCareerObstacle() {
        const obstacles = [
            'Imposter syndrome despite years of successful projects',
            'Technology stack becoming obsolete faster than learning can keep up',
            'Open office environments designed by people who have never coded',
            'Agile processes that somehow make everything take longer',
            'The eternal struggle between technical excellence and business timelines'
        ];
        return obstacles[Math.floor(this.personalityFactors.conscientiousness * obstacles.length)];
    }
    
    generatePersonalGrowthChallenge() {
        if (this.personalityFactors.introversion > 0.7) {
            return 'Learning to communicate technical concepts to non-technical stakeholders';
        } else if (this.personalityFactors.agreeableness < 0.4) {
            return 'Developing patience for code reviews and collaborative development';
        } else if (this.personalityFactors.openness < 0.4) {
            return 'Embracing new technologies instead of defaulting to familiar solutions';
        } else {
            return 'Finding the balance between helpful mentoring and enabling dependency';
        }
    }
    
    generateCareerPath() {
        if (this.personalityFactors.agreeableness > 0.7) {
            return 'Technical leadership with emphasis on team development and mentoring';
        } else if (this.personalityFactors.openness > 0.7) {
            return 'Innovation and R&D roles exploring cutting-edge technologies';
        } else if (this.personalityFactors.conscientiousness > 0.7) {
            return 'Architecture and systems design with focus on maintainable solutions';
        } else {
            return 'Specialized expertise in a domain that values deep technical knowledge';
        }
    }
    
    getMetaphorSource() {
        if (this.personalityFactors.openness > 0.7) return 'quantum physics and philosophy';
        if (this.personalityFactors.agreeableness > 0.6) return 'cooking and gardening';
        if (this.personalityFactors.introversion > 0.6) return 'books and movies';
        return 'sports and video games';
    }
    
    /**
     * Generate comprehensive disclaimer
     */
    generateDisclaimer() {
        return `
            INCARNATION DISCLAIMER: This procedurally generated incarnation is provided "as is" 
            without warranty of happiness, fulfillment, or debugging success. Actual results may 
            vary based on market conditions, technology trends, and the inevitable heat death of 
            the universe. Side effects may include: chronic imposter syndrome, keyboard addiction, 
            strong opinions about tabs vs spaces, and the ability to see bugs in your peripheral 
            vision. The Universe assumes no responsibility for career satisfaction, work-life 
            balance, or the psychological impact of legacy code maintenance.
            
            Your incarnation includes standard features like consciousness, mortality, and the 
            ability to convert caffeine into code. Premium features such as enlightenment, 
            perfect work-life balance, and bug-free deployments are not included and cannot be 
            purchased separately.
            
            By existing in this incarnation, you agree to experience the full spectrum of 
            software development emotions, from the joy of solving complex problems to the 
            despair of merge conflicts. You acknowledge that rubber duck debugging is a valid 
            problem-solving technique and that talking to your code is not a sign of mental 
            instability.
            
            Generated using advanced algorithms that are definitely not just random number 
            generators with delusions of grandeur. Seed: ${this.incarnationSeed}
        `;
    }
    
    /**
     * Export incarnation data for integration with other systems
     */
    exportIncarnationData() {
        return {
            incarnation: this.generateIncarnation(),
            personalityFactors: this.personalityFactors,
            environmentPrefs: this.environmentPrefs,
            generationMetadata: {
                seed: this.incarnationSeed,
                karmaScore: this.karmaScore,
                generatedAt: Date.now(),
                version: '1.0.0-bureaucratic'
            }
        };
    }
}

// Export for debugging in development
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.ProceduralIncarnationGenerator = ProceduralIncarnationGenerator;
}