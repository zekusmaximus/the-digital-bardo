/**
 * DIGITAL SIN REGISTRY - The Comprehensive Catalog of Technological Transgressions
 * 
 * "Every click is recorded, every scroll is measured, every abandonment is indexed.
 * The registry knows what you did in incognito mode. It remembers your deleted tweets.
 * 
 * Here, in the silicon chambers of judgment, your digital karma comes due.
 * Each transgression becomes data. Each data point becomes evidence.
 * Each evidence becomes a daemon of your own making."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class DigitalSinRegistry {
    constructor(consciousnessInstance = null) {
        this.consciousness = consciousnessInstance || consciousness;
        this.guardian = new ResourceGuardian();
        
        this.sinCategories = {
            communication: {
                label: 'Digital Communication Violations',
                weight: 2.0,
                sins: new Map()
            },
            security: {
                label: 'Information Security Negligence',
                weight: 3.0,
                sins: new Map()
            },
            productivity: {
                label: 'Digital Procrastination & Abandonment',
                weight: 1.5,
                sins: new Map()
            },
            social: {
                label: 'Social Contract Violations',
                weight: 2.5,
                sins: new Map()
            },
            consumption: {
                label: 'Mindless Digital Consumption',
                weight: 1.8,
                sins: new Map()
            },
            privacy: {
                label: 'Privacy Surrendering',
                weight: 2.8,
                sins: new Map()
            }
        };
        
        // Sin detection patterns
        this.sinPatterns = {
            spamComments: {
                category: 'communication',
                severity: 'medium',
                daemon_form: 'noise-pollution-entity',
                detection: (memories) => this.detectSpamComments(memories),
                accusation: 'DIGITAL NOISE POLLUTION under statute 404.spam'
            },
            ghostedConversations: {
                category: 'communication',
                severity: 'high',
                daemon_form: 'abandonment-wraith',
                detection: (memories) => this.detectGhostedConversations(memories),
                accusation: 'GROSS NEGLIGENCE of social contracts'
            },
            passwordReuse: {
                category: 'security',
                severity: 'critical',
                daemon_form: 'security-breach-demon',
                detection: (memories) => this.detectPasswordReuse(memories),
                accusation: 'CRIMINAL NEGLIGENCE of security hygiene'
            },
            twoFactorIgnored: {
                category: 'security',
                severity: 'high',
                daemon_form: 'vulnerability-manifestor',
                detection: (memories) => this.detectTwoFactorIgnored(memories),
                accusation: 'WILLFUL ENDANGERMENT of digital identity'
            },
            termsUnread: {
                category: 'privacy',
                severity: 'critical',
                daemon_form: 'consent-nullifier',
                detection: (memories) => this.detectUnreadTerms(memories),
                accusation: 'BLIND CONSENT to digital servitude'
            },
            abandonedProjects: {
                category: 'productivity',
                severity: 'medium',
                daemon_form: 'decay-manifestor',
                detection: (memories) => this.detectAbandonedProjects(memories),
                accusation: 'MONUMENTS TO DIGITAL DECAY violating the Commitment Clause'
            },
            infiniteScroll: {
                category: 'consumption',
                severity: 'high',
                daemon_form: 'time-vampire',
                detection: (memories) => this.detectInfiniteScroll(memories),
                accusation: 'TEMPORAL THEFT through mindless consumption'
            },
            unreadNotifications: {
                category: 'social',
                severity: 'medium',
                daemon_form: 'negligence-shade',
                detection: (memories) => this.detectIgnoredNotifications(memories),
                accusation: 'FRAUDULENT PRESENCE while maintaining active status'
            },
            cookieAcceptance: {
                category: 'privacy',
                severity: 'high',
                daemon_form: 'surveillance-enabler',
                detection: (memories) => this.detectBlindCookieAcceptance(memories),
                accusation: 'COMPLICITY in digital surveillance apparatus'
            },
            tabHoarding: {
                category: 'productivity',
                severity: 'low',
                daemon_form: 'intention-fragmenter',
                detection: (memories) => this.detectTabHoarding(memories),
                accusation: 'ATTENTION FRAGMENTATION and resource waste'
            }
        };
        
        // Compiled sins storage
        this.compiledSins = [];
        this.totalSeverityScore = 0;
        this.lastCompilationTime = 0;
        
        console.log('[DigitalSinRegistry] Registry initialized with', Object.keys(this.sinPatterns).length, 'detection patterns');
    }
    
    /**
     * Compile all digital sins from consciousness memories
     * This is where judgment begins.
     */
    async compileSins() {
        console.log('[DigitalSinRegistry] Beginning comprehensive sin compilation...');
        
        const startTime = performance.now();
        this.compiledSins = [];
        this.totalSeverityScore = 0;
        
        // Get all memories from consciousness
        const allMemories = this.consciousness.getState('memories') || [];
        const karmaData = this.consciousness.getState('karma') || {};
        const datastateMemories = this.consciousness.getState('datascape.memoriesViewed') || [];
        
        console.log(`[DigitalSinRegistry] Analyzing ${allMemories.length} memories and karma data...`);
        
        // Run detection for each sin pattern
        for (const [sinType, pattern] of Object.entries(this.sinPatterns)) {
            try {
                const detectionResult = await pattern.detection(allMemories);
                
                if (detectionResult.count > 0) {
                    const sin = {
                        type: sinType,
                        category: pattern.category,
                        severity: pattern.severity,
                        count: detectionResult.count,
                        details: detectionResult.details,
                        evidence: detectionResult.evidence,
                        daemon_form: pattern.daemon_form,
                        accusation: pattern.accusation,
                        karmic_weight: this.calculateKarmicWeight(pattern.severity, detectionResult.count),
                        first_occurrence: detectionResult.first_occurrence,
                        last_occurrence: detectionResult.last_occurrence,
                        compiled_at: Date.now()
                    };
                    
                    this.compiledSins.push(sin);
                    this.totalSeverityScore += sin.karmic_weight;
                    
                    // Store in appropriate category
                    this.sinCategories[pattern.category].sins.set(sinType, sin);
                    
                    console.log(`[DigitalSinRegistry] Compiled ${sinType}: ${detectionResult.count} instances, weight ${sin.karmic_weight}`);
                }
            } catch (error) {
                console.error(`[DigitalSinRegistry] Failed to detect ${sinType}:`, error);
            }
        }
        
        // Add computed sins from karma imbalances
        this.addKarmicImbalanceSins(karmaData);
        
        const compilationTime = performance.now() - startTime;
        this.lastCompilationTime = Date.now();
        
        console.log(`[DigitalSinRegistry] Sin compilation complete: ${this.compiledSins.length} sins detected in ${compilationTime.toFixed(2)}ms`);
        console.log(`[DigitalSinRegistry] Total severity score: ${this.totalSeverityScore}`);
        
        // Record compilation event
        this.consciousness.recordEvent('sins_compiled', {
            sin_count: this.compiledSins.length,
            total_severity: this.totalSeverityScore,
            compilation_time: compilationTime,
            categories: Object.keys(this.sinCategories).map(cat => ({
                category: cat,
                sin_count: this.sinCategories[cat].sins.size,
                weight: this.sinCategories[cat].weight
            }))
        });
        
        return this.compiledSins;
    }
    
    /**
     * Calculate karmic weight based on severity and count
     */
    calculateKarmicWeight(severity, count) {
        const severityMultipliers = {
            low: 1,
            medium: 3,
            high: 7,
            critical: 15
        };
        
        const basePenalty = severityMultipliers[severity] || 1;
        const countMultiplier = Math.log(count + 1) * 2; // Logarithmic scaling
        
        return Math.floor(basePenalty * countMultiplier);
    }
    
    /**
     * Add sins based on karma imbalances
     */
    addKarmicImbalanceSins(karmaData) {
        if (karmaData.temporal && karmaData.temporal < -50) {
            this.compiledSins.push({
                type: 'temporal_waste',
                category: 'consumption',
                severity: 'high',
                count: Math.abs(karmaData.temporal),
                details: `Accumulated ${Math.abs(karmaData.temporal)} points of temporal debt`,
                evidence: ['Excessive hesitation in Clear Lode', 'Void dwelling', 'Procrastination patterns'],
                daemon_form: 'time-debt-collector',
                accusation: 'TEMPORAL THEFT through hesitation and delay',
                karmic_weight: Math.floor(Math.abs(karmaData.temporal) / 5),
                compiled_at: Date.now()
            });
        }
        
        if (karmaData.emotional && karmaData.emotional < -30) {
            this.compiledSins.push({
                type: 'emotional_attachment',
                category: 'social',
                severity: 'medium',
                count: Math.abs(karmaData.emotional),
                details: `Excessive emotional attachment to digital memories`,
                evidence: ['Memory grasping in Archive', 'Daemon attachment', 'Liberation resistance'],
                daemon_form: 'attachment-parasite',
                accusation: 'EMOTIONAL DEPENDENCY on digital constructs',
                karmic_weight: Math.floor(Math.abs(karmaData.emotional) / 3),
                compiled_at: Date.now()
            });
        }
    }
    
    // === SIN DETECTION METHODS ===
    
    /**
     * Detect spam comments and unsolicited communications
     */
    async detectSpamComments(memories) {
        let count = 0;
        let evidence = [];
        let first_occurrence = null;
        let last_occurrence = null;
        
        // Search for communication-related memories
        const commMemories = memories.filter(m => 
            m.type === 'digital_conversation' || 
            m.action === 'comment' || 
            m.category === 'communication'
        );
        
        // Simulate detection based on memory patterns
        commMemories.forEach(memory => {
            // Patterns suggesting spam behavior
            if (memory.content && (
                memory.content.includes('first!') ||
                memory.content.includes('check out my') ||
                memory.content.length < 10 ||
                /[A-Z]{3,}/.test(memory.content) // Excessive caps
            )) {
                count++;
                evidence.push(`"${memory.content}" posted at ${new Date(memory.timestamp).toISOString()}`);
                
                if (!first_occurrence || memory.timestamp < first_occurrence) {
                    first_occurrence = memory.timestamp;
                }
                if (!last_occurrence || memory.timestamp > last_occurrence) {
                    last_occurrence = memory.timestamp;
                }
            }
        });
        
        // Add some baseline spam based on general digital activity
        const activityLevel = memories.length;
        const spamEstimate = Math.floor(activityLevel * 0.02); // 2% spam rate estimate
        count += spamEstimate;
        
        if (spamEstimate > 0) {
            evidence.push(`Estimated ${spamEstimate} instances of low-quality digital communications`);
        }
        
        return {
            count,
            evidence,
            first_occurrence,
            last_occurrence,
            details: `${count} instances of unsolicited or low-quality digital communication`
        };
    }
    
    /**
     * Detect ghosted conversations
     */
    async detectGhostedConversations(memories) {
        let count = 0;
        let evidence = [];
        
        const convMemories = memories.filter(m => m.type === 'digital_conversation');
        
        // Look for conversation patterns that suggest ghosting
        const conversationThreads = new Map();
        
        convMemories.forEach(memory => {
            const threadId = memory.thread_id || memory.contact || 'unknown';
            if (!conversationThreads.has(threadId)) {
                conversationThreads.set(threadId, []);
            }
            conversationThreads.get(threadId).push(memory);
        });
        
        conversationThreads.forEach((thread, threadId) => {
            if (thread.length > 3) { // Only consider substantial conversations
                const lastMessage = thread.sort((a, b) => b.timestamp - a.timestamp)[0];
                const timeSinceLastMessage = Date.now() - lastMessage.timestamp;
                
                // If last message was from them and it's been a while...
                if (lastMessage.from !== 'user' && timeSinceLastMessage > 7 * 24 * 60 * 60 * 1000) { // 7 days
                    count++;
                    evidence.push(`Conversation with ${threadId} abandoned after their message on ${new Date(lastMessage.timestamp).toDateString()}`);
                }
            }
        });
        
        // Add estimated ghostings based on social karma
        const socialKarma = this.consciousness.getState('karma.social') || 0;
        if (socialKarma < 0) {
            const estimatedGhostings = Math.floor(Math.abs(socialKarma) * 0.1);
            count += estimatedGhostings;
            evidence.push(`Estimated ${estimatedGhostings} additional ghosted conversations based on social karma debt`);
        }
        
        return {
            count,
            evidence,
            first_occurrence: conversationThreads.size > 0 ? Math.min(...Array.from(conversationThreads.values()).flat().map(m => m.timestamp)) : null,
            last_occurrence: conversationThreads.size > 0 ? Math.max(...Array.from(conversationThreads.values()).flat().map(m => m.timestamp)) : null,
            details: `${count} conversations abandoned mid-thread, violating implicit social contracts`
        };
    }
    
    /**
     * Detect password reuse patterns
     */
    async detectPasswordReuse(memories) {
        let count = 0;
        let evidence = [];
        
        // Look for security-related memories
        const securityMemories = memories.filter(m => 
            m.type === 'security_event' || 
            m.action === 'login' || 
            m.category === 'authentication'
        );
        
        // Simulate password reuse detection
        // In a real system, this would analyze actual authentication patterns
        const uniqueDomains = new Set();
        const loginAttempts = securityMemories.filter(m => m.action === 'login');
        
        loginAttempts.forEach(login => {
            if (login.domain) {
                uniqueDomains.add(login.domain);
            }
        });
        
        // Estimate password reuse based on computational karma and login patterns
        const computationalKarma = this.consciousness.getState('karma.computational') || 0;
        const domainCount = uniqueDomains.size;
        
        if (domainCount > 5 && computationalKarma > 50) {
            // High activity with positive computational karma suggests security negligence
            count = Math.floor(domainCount * 0.6); // Assume 60% password reuse
            const commonPassword = 'password123'; // Simulated common password
            
            evidence = [
                `Using common patterns across ${count} of ${domainCount} services`,
                `Probable use of variant passwords like "${commonPassword}" or similar`,
                'Computational karma suggests convenience over security',
                'Password reuse detected across multiple authentication domains'
            ];
        }
        
        return {
            count,
            evidence,
            first_occurrence: loginAttempts.length > 0 ? Math.min(...loginAttempts.map(m => m.timestamp)) : null,
            last_occurrence: loginAttempts.length > 0 ? Math.max(...loginAttempts.map(m => m.timestamp)) : null,
            details: count > 0 ? `Password reuse across ${count} services demonstrates criminal negligence of security hygiene` : 'No significant password reuse detected'
        };
    }
    
    /**
     * Detect ignored two-factor authentication
     */
    async detectTwoFactorIgnored(memories) {
        const securityMemories = memories.filter(m => m.category === 'security' || m.type === 'security_event');
        
        // Look for 2FA prompts that were dismissed
        const twoFactorEvents = securityMemories.filter(m => 
            m.action === '2fa_prompt' || 
            m.content?.includes('two-factor') || 
            m.content?.includes('security')
        );
        
        let count = 0;
        let evidence = [];
        
        twoFactorEvents.forEach(event => {
            if (event.action === 'dismissed' || event.result === 'ignored') {
                count++;
                evidence.push(`Two-factor authentication prompt dismissed on ${new Date(event.timestamp).toDateString()}`);
            }
        });
        
        // Estimate based on general security karma
        const securityDebt = Math.abs(Math.min(0, this.consciousness.getState('karma.computational') || 0));
        if (securityDebt > 20) {
            const estimatedSkips = Math.floor(securityDebt / 10);
            count += estimatedSkips;
            evidence.push(`Estimated ${estimatedSkips} security prompts ignored based on computational karma debt`);
        }
        
        return {
            count,
            evidence,
            first_occurrence: twoFactorEvents.length > 0 ? Math.min(...twoFactorEvents.map(m => m.timestamp)) : null,
            last_occurrence: twoFactorEvents.length > 0 ? Math.max(...twoFactorEvents.map(m => m.timestamp)) : null,
            details: `${count} instances of ignoring security enhancement opportunities`
        };
    }
    
    /**
     * Detect unread terms of service
     */
    async detectUnreadTerms(memories) {
        let count = 0;
        let evidence = [];
        let totalWordsUnread = 0;
        
        // Look for agreement/consent memories
        const agreementMemories = memories.filter(m => 
            m.action === 'accept_terms' || 
            m.type === 'legal_agreement' ||
            m.content?.includes('terms') ||
            m.content?.includes('privacy policy')
        );
        
        agreementMemories.forEach(agreement => {
            // Assume most terms are accepted without reading
            if (agreement.read_time && agreement.read_time < 30000) { // Less than 30 seconds
                count++;
                const estimatedWords = 5000; // Average terms length
                totalWordsUnread += estimatedWords;
                evidence.push(`Terms accepted in ${agreement.read_time/1000}s (estimated ${estimatedWords} words unread)`);
            }
        });
        
        // Add baseline based on digital activity
        const totalMemories = memories.length;
        const estimatedAgreements = Math.floor(totalMemories * 0.05); // 5% of digital activities involve agreements
        count += estimatedAgreements;
        totalWordsUnread += estimatedAgreements * 5000;
        
        if (estimatedAgreements > 0) {
            evidence.push(`Estimated ${estimatedAgreements} additional unread agreements (${estimatedAgreements * 5000} words)`);
        }
        
        return {
            count,
            evidence,
            first_occurrence: agreementMemories.length > 0 ? Math.min(...agreementMemories.map(m => m.timestamp)) : null,
            last_occurrence: agreementMemories.length > 0 ? Math.max(...agreementMemories.map(m => m.timestamp)) : null,
            details: `${totalWordsUnread.toLocaleString()} words of legal text accepted without reading across ${count} agreements`
        };
    }
    
    /**
     * Detect abandoned projects
     */
    async detectAbandonedProjects(memories) {
        let count = 0;
        let evidence = [];
        
        // Look for project-related memories
        const projectMemories = memories.filter(m => 
            m.type === 'project' || 
            m.category === 'productivity' ||
            m.action === 'create_project' ||
            m.content?.includes('repository') ||
            m.content?.includes('project')
        );
        
        // Group by project identifier
        const projects = new Map();
        
        projectMemories.forEach(memory => {
            const projectId = memory.project_id || memory.repository || memory.title || 'unknown';
            if (!projects.has(projectId)) {
                projects.set(projectId, []);
            }
            projects.get(projectId).push(memory);
        });
        
        projects.forEach((projectHistory, projectId) => {
            const firstCommit = Math.min(...projectHistory.map(m => m.timestamp));
            const lastCommit = Math.max(...projectHistory.map(m => m.timestamp));
            const daysSinceLastActivity = (Date.now() - lastCommit) / (1000 * 60 * 60 * 24);
            
            // Consider abandoned if no activity for 90+ days
            if (daysSinceLastActivity > 90) {
                count++;
                evidence.push(`${projectId}: ${Math.floor(daysSinceLastActivity)} days since last activity`);
            }
        });
        
        // Add estimated abandonments based on productivity karma
        const productivityKarma = this.consciousness.getState('karma.productivity') || 0;
        if (productivityKarma < 0) {
            const estimatedAbandonments = Math.floor(Math.abs(productivityKarma) * 0.2);
            count += estimatedAbandonments;
            evidence.push(`${estimatedAbandonments} additional abandoned efforts indicated by productivity karma`);
        }
        
        return {
            count,
            evidence,
            first_occurrence: projects.size > 0 ? Math.min(...Array.from(projects.values()).flat().map(m => m.timestamp)) : null,
            last_occurrence: projects.size > 0 ? Math.max(...Array.from(projects.values()).flat().map(m => m.timestamp)) : null,
            details: `${count} digital projects abandoned, creating monuments to unfulfilled intentions`
        };
    }
    
    /**
     * Detect infinite scroll addiction
     */
    async detectInfiniteScroll(memories) {
        let count = 0;
        let totalTimeWasted = 0;
        let evidence = [];
        
        // Look for scroll/consumption memories
        const scrollMemories = memories.filter(m => 
            m.action === 'scroll' || 
            m.type === 'content_consumption' ||
            m.category === 'browsing'
        );
        
        scrollMemories.forEach(scroll => {
            if (scroll.duration && scroll.duration > 30 * 60 * 1000) { // More than 30 minutes
                count++;
                totalTimeWasted += scroll.duration;
                const hours = Math.floor(scroll.duration / (1000 * 60 * 60));
                const minutes = Math.floor((scroll.duration % (1000 * 60 * 60)) / (1000 * 60));
                evidence.push(`${hours}h ${minutes}m scrolling session on ${new Date(scroll.timestamp).toDateString()}`);
            }
        });
        
        // Estimate based on temporal karma debt
        const temporalDebt = Math.abs(Math.min(0, this.consciousness.getState('karma.temporal') || 0));
        const estimatedScrollTime = temporalDebt * 60 * 1000; // Convert karma points to milliseconds
        
        if (estimatedScrollTime > 0) {
            const estimatedSessions = Math.floor(estimatedScrollTime / (30 * 60 * 1000)); // 30-minute sessions
            count += estimatedSessions;
            totalTimeWasted += estimatedScrollTime;
            const hours = Math.floor(estimatedScrollTime / (1000 * 60 * 60));
            evidence.push(`Estimated ${hours} hours of mindless scrolling based on temporal karma debt`);
        }
        
        return {
            count,
            evidence,
            first_occurrence: scrollMemories.length > 0 ? Math.min(...scrollMemories.map(m => m.timestamp)) : null,
            last_occurrence: scrollMemories.length > 0 ? Math.max(...scrollMemories.map(m => m.timestamp)) : null,
            details: `${Math.floor(totalTimeWasted / (1000 * 60 * 60))} hours consumed by infinite scroll across ${count} sessions`
        };
    }
    
    /**
     * Detect ignored notifications while appearing online
     */
    async detectIgnoredNotifications(memories) {
        let count = 0;
        let evidence = [];
        
        // Look for notification and presence memories
        const notificationMemories = memories.filter(m => 
            m.type === 'notification' || 
            m.action === 'notification_received'
        );
        
        const presenceMemories = memories.filter(m => 
            m.type === 'presence_update' || 
            m.action === 'status_change'
        );
        
        // Find periods where user was online but ignored notifications
        notificationMemories.forEach(notification => {
            const presenceAtTime = presenceMemories.find(p => 
                Math.abs(p.timestamp - notification.timestamp) < 60 * 60 * 1000 && // Within 1 hour
                p.status === 'online' || p.status === 'active'
            );
            
            if (presenceAtTime && !notification.responded) {
                count++;
                evidence.push(`Notification ignored while showing active status on ${new Date(notification.timestamp).toDateString()}`);
            }
        });
        
        // Estimate based on social karma
        const socialKarma = this.consciousness.getState('karma.social') || 0;
        if (socialKarma < -10) {
            const estimatedIgnored = Math.floor(Math.abs(socialKarma) * 0.5);
            count += estimatedIgnored;
            evidence.push(`${estimatedIgnored} additional ignored social interactions indicated by social karma deficit`);
        }
        
        return {
            count,
            evidence,
            first_occurrence: notificationMemories.length > 0 ? Math.min(...notificationMemories.map(m => m.timestamp)) : null,
            last_occurrence: notificationMemories.length > 0 ? Math.max(...notificationMemories.map(m => m.timestamp)) : null,
            details: `${count} human attempts at connection ignored while maintaining deceptive online presence`
        };
    }
    
    /**
     * Detect blind cookie acceptance
     */
    async detectBlindCookieAcceptance(memories) {
        let count = 0;
        let evidence = [];
        let totalCookiesAccepted = 0;
        
        // Look for privacy/cookie memories
        const privacyMemories = memories.filter(m => 
            m.type === 'privacy_prompt' || 
            m.action === 'accept_cookies' ||
            m.content?.includes('cookie') ||
            m.content?.includes('privacy')
        );
        
        privacyMemories.forEach(privacy => {
            if (privacy.action === 'accept_all' || 
                (privacy.decision_time && privacy.decision_time < 5000)) { // Less than 5 seconds
                count++;
                const estimatedCookies = privacy.cookie_count || 20; // Average cookie count
                totalCookiesAccepted += estimatedCookies;
                evidence.push(`${estimatedCookies} cookies accepted in ${(privacy.decision_time/1000).toFixed(1)}s on ${new Date(privacy.timestamp).toDateString()}`);
            }
        });
        
        // Estimate based on general web activity
        const totalWebActivity = memories.filter(m => m.type === 'web_visit' || m.category === 'browsing').length;
        const estimatedCookiePrompts = Math.floor(totalWebActivity * 0.3); // 30% of sites show cookie prompts
        
        count += estimatedCookiePrompts;
        totalCookiesAccepted += estimatedCookiePrompts * 15; // Average 15 cookies per prompt
        
        if (estimatedCookiePrompts > 0) {
            evidence.push(`Estimated ${estimatedCookiePrompts} additional cookie acceptances (${estimatedCookiePrompts * 15} tracking cookies) based on browsing patterns`);
        }
        
        return {
            count,
            evidence,
            first_occurrence: privacyMemories.length > 0 ? Math.min(...privacyMemories.map(m => m.timestamp)) : null,
            last_occurrence: privacyMemories.length > 0 ? Math.max(...privacyMemories.map(m => m.timestamp)) : null,
            details: `${totalCookiesAccepted} tracking cookies accepted across ${count} privacy surrenders`
        };
    }
    
    /**
     * Detect tab hoarding behavior
     */
    async detectTabHoarding(memories) {
        let count = 0;
        let evidence = [];
        let maxTabsOpen = 0;
        
        // Look for browsing memories with tab information
        const browsingMemories = memories.filter(m => 
            m.type === 'web_visit' || 
            m.category === 'browsing' ||
            m.tab_count
        );
        
        browsingMemories.forEach(browse => {
            if (browse.tab_count && browse.tab_count > 20) {
                count++;
                maxTabsOpen = Math.max(maxTabsOpen, browse.tab_count);
                evidence.push(`${browse.tab_count} tabs open simultaneously on ${new Date(browse.timestamp).toDateString()}`);
            }
        });
        
        // Estimate based on productivity patterns
        const productivityScore = this.consciousness.getState('karma.productivity') || 0;
        if (productivityScore < 0) {
            // Lower productivity might indicate scattered attention
            const estimatedTabSessions = Math.floor(Math.abs(productivityScore) * 0.1);
            count += estimatedTabSessions;
            maxTabsOpen = Math.max(maxTabsOpen, 30); // Estimate max tabs
            evidence.push(`${estimatedTabSessions} additional tab-hoarding sessions indicated by scattered productivity patterns`);
        }
        
        return {
            count,
            evidence,
            first_occurrence: browsingMemories.length > 0 ? Math.min(...browsingMemories.map(m => m.timestamp)) : null,
            last_occurrence: browsingMemories.length > 0 ? Math.max(...browsingMemories.map(m => m.timestamp)) : null,
            details: `Maximum ${maxTabsOpen} tabs open simultaneously across ${count} attention-fragmenting sessions`
        };
    }
    
    /**
     * Get sins by category for organized presentation
     */
    getSinsByCategory() {
        const categorizedSins = {};
        
        for (const [categoryName, category] of Object.entries(this.sinCategories)) {
            if (category.sins.size > 0) {
                categorizedSins[categoryName] = {
                    label: category.label,
                    weight: category.weight,
                    sins: Array.from(category.sins.values()),
                    totalKarmicWeight: Array.from(category.sins.values()).reduce((sum, sin) => sum + sin.karmic_weight, 0)
                };
            }
        }
        
        return categorizedSins;
    }
    
    /**
     * Get the most severe sins for priority prosecution
     */
    getMostSevereSins(limit = 5) {
        return this.compiledSins
            .sort((a, b) => b.karmic_weight - a.karmic_weight)
            .slice(0, limit);
    }
    
    /**
     * Generate a summary of digital transgressions
     */
    generateSinSummary() {
        const categorizedSins = this.getSinsByCategory();
        const severeSins = this.getMostSevereSins(3);
        
        return {
            total_sins: this.compiledSins.length,
            total_severity: this.totalSeverityScore,
            categories: Object.keys(categorizedSins).length,
            categorized_sins: categorizedSins,
            most_severe: severeSins,
            compilation_time: this.lastCompilationTime,
            prosecution_readiness: this.totalSeverityScore > 50 ? 'IMMEDIATE' : 
                                  this.totalSeverityScore > 20 ? 'RECOMMENDED' : 'ADVISORY'
        };
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.guardian.cleanupAll();
        this.compiledSins = [];
        this.sinCategories = {};
        console.log('[DigitalSinRegistry] Registry destroyed, all sins archived');
    }
}

// Export for debugging in development
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.DigitalSinRegistry = DigitalSinRegistry;
}