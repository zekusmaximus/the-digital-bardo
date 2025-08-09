/**
 * Phase Router - The Karmic Navigation System
 * 
 * "The Medium is the Metaphysics"
 * 
 * This module implements the core karma-driven routing logic that determines
 * consciousness progression through the Digital Bardo phases. Every decision
 * point is a reflection of accumulated digital karma, guiding souls through
 * the appropriate paths of their technological afterlife journey.
 * 
 * Routes:
 * - Void → Clear Lode (automatic)
 * - Clear Lode → Datascape (based on recognition/attachment)
 * - Datascape → Incarnation (after Archive/Firewall completion)
 * - Incarnation → Rebirth (after bureaucratic processing)
 */

export class PhaseRouter {
    constructor(consciousness) {
        this.consciousness = consciousness;
        this.routingHistory = [];
        this.transitionThresholds = {
            // Karma thresholds for phase transitions
            datascape_entry: {
                minimum_total: -50,  // Must have some consciousness engagement
                maximum_void: 20     // Can't be too lost in void
            },
            incarnation_entry: {
                minimum_total: -100, // Must have navigated datascape meaningfully
                completion_required: true // Must complete Archive OR Firewall
            },
            rebirth_ready: {
                legal_acceptance: true,  // Must accept Terms & Conditions
                bureaucratic_processing: true // Must complete all forms
            }
        };
    }

    /**
     * Determine next phase based on current consciousness state
     */
    async routeToNextPhase(currentPhase = null, context = {}) {
        const karma = this.consciousness.getState('karma');
        const journey = this.consciousness.getState('journey') || {};
        const events = this.consciousness.getState('events') || [];
        
        // Auto-detect current phase if not provided
        if (!currentPhase) {
            currentPhase = this.detectCurrentPhase();
        }
        
        console.log(`[Phase Router] Routing from ${currentPhase}, karma:`, karma);
        
        const routing = {
            fromPhase: currentPhase,
            toPhase: null,
            reason: '',
            karmaFactors: {},
            redirectUrl: null,
            shouldTransition: false
        };
        
        try {
            switch (currentPhase) {
                case 'void':
                    routing.toPhase = 'clear-lode';
                    routing.reason = 'Natural progression from pre-death state';
                    routing.redirectUrl = '/clear-lode/';
                    routing.shouldTransition = true;
                    break;
                    
                case 'clear-lode':
                    return await this.routeFromClearLode(karma, journey, events, context);
                    
                case 'datascape':
                    return await this.routeFromDatascape(karma, journey, events, context);
                    
                case 'incarnation':
                    return await this.routeFromIncarnation(karma, journey, events, context);
                    
                default:
                    routing.reason = 'Unknown phase - defaulting to void';
                    routing.toPhase = 'void';
                    routing.redirectUrl = '/void/';
            }
            
            // Record routing decision
            this.recordRoutingDecision(routing);
            return routing;
            
        } catch (error) {
            console.error('[Phase Router] Routing error:', error);
            return this.createEmergencyRouting(currentPhase, error);
        }
    }

    /**
     * Route from Clear Lode based on recognition and attachment patterns
     */
    async routeFromClearLode(karma, journey, events, context) {
        const totalKarma = Object.values(karma).reduce((sum, val) => sum + val, 0);
        const recognitionEvents = events.filter(e => e.type.includes('recognition'));
        const attachmentEvents = events.filter(e => e.type.includes('attachment'));
        const memoryClicks = events.filter(e => e.type === 'memory_fragment_clicked');
        
        const routing = {
            fromPhase: 'clear-lode',
            toPhase: 'datascape',
            redirectUrl: '/datascape/',
            karmaFactors: {
                totalKarma,
                recognitionSuccess: recognitionEvents.length > 0,
                attachmentLevel: attachmentEvents.length + memoryClicks.length,
                voidDwelling: karma.void || 0
            },
            shouldTransition: true
        };
        
        // Determine reason based on karma patterns
        if (recognitionEvents.some(e => e.type === 'recognition_success')) {
            if (memoryClicks.length === 0) {
                routing.reason = 'Perfect recognition achieved - proceeding to gentle datascape introduction';
                routing.karmaFactors.path = 'enlightened';
            } else if (memoryClicks.length <= 2) {
                routing.reason = 'Recognition with minor attachment - standard datascape progression';
                routing.karmaFactors.path = 'attached_but_aware';
            } else {
                routing.reason = 'Recognition despite heavy attachment - challenging datascape awaits';
                routing.karmaFactors.path = 'heavily_attached';
            }
        } else {
            if (karma.void > 15) {
                routing.reason = 'Lost in void - requiring intensive datascape processing';
                routing.karmaFactors.path = 'void_lost';
            } else if (memoryClicks.length > 5) {
                routing.reason = 'Heavy attachment without recognition - difficult datascape path';
                routing.karmaFactors.path = 'attachment_bound';
            } else {
                routing.reason = 'Standard progression - moderate datascape experience';
                routing.karmaFactors.path = 'standard';
            }
        }
        
        // Check if consciousness is ready for datascape
        if (totalKarma < this.transitionThresholds.datascape_entry.minimum_total) {
            routing.shouldTransition = false;
            routing.reason = 'Insufficient consciousness engagement - remaining in Clear Lode';
            routing.toPhase = 'clear-lode';
            routing.redirectUrl = null;
        } else if (karma.void > this.transitionThresholds.datascape_entry.maximum_void) {
            routing.reason = 'Excessive void dwelling - special datascape processing required';
            routing.karmaFactors.specialProcessing = 'void_heavy';
        }
        
        return routing;
    }

    /**
     * Route from Datascape to Incarnation Engine
     */
    async routeFromDatascape(karma, journey, events, context) {
        const totalKarma = Object.values(karma).reduce((sum, val) => sum + val, 0);
        const archiveCompletion = this.checkDatascapeCompletion('archive', events);
        const firewallCompletion = this.checkDatascapeCompletion('firewall', events);
        const datascapeComplete = archiveCompletion.completed || firewallCompletion.completed;
        
        const routing = {
            fromPhase: 'datascape',
            karmaFactors: {
                totalKarma,
                archiveExperience: archiveCompletion,
                firewallExperience: firewallCompletion,
                datascapeComplete,
                emotionalKarma: karma.emotional || 0,
                computationalKarma: karma.computational || 0
            }
        };
        
        // Determine if ready for incarnation processing
        if (!datascapeComplete) {
            routing.shouldTransition = false;
            routing.toPhase = 'datascape';
            routing.redirectUrl = null;
            routing.reason = 'Datascape experience incomplete - continue processing memories/sins';
            return routing;
        }
        
        // Route to Incarnation Engine
        routing.toPhase = 'incarnation';
        routing.redirectUrl = '/incarnation/';
        routing.shouldTransition = true;
        
        // Determine incarnation processing complexity based on datascape journey
        if (archiveCompletion.completed && firewallCompletion.completed) {
            routing.reason = 'Complete datascape experience - complex incarnation processing required';
            routing.karmaFactors.processingComplexity = 'maximum';
        } else if (archiveCompletion.completed) {
            routing.reason = 'Peaceful resolution achieved - standard incarnation processing';
            routing.karmaFactors.processingComplexity = 'standard';
            routing.karmaFactors.predominantPath = 'peaceful';
        } else if (firewallCompletion.completed) {
            routing.reason = 'Wrathful confrontation completed - intensive incarnation processing';
            routing.karmaFactors.processingComplexity = 'intensive';
            routing.karmaFactors.predominantPath = 'wrathful';
        }
        
        return routing;
    }

    /**
     * Route from Incarnation Engine to final rebirth
     */
    async routeFromIncarnation(karma, journey, events, context) {
        const incarnationEvents = events.filter(e => e.type.includes('incarnation'));
        const termsAccepted = events.some(e => e.type === 'terms_accepted');
        const processingComplete = events.some(e => e.type === 'incarnation_processing_complete');
        const selectedPackage = events.find(e => e.type === 'incarnation_package_selected');
        
        const routing = {
            fromPhase: 'incarnation',
            karmaFactors: {
                termsAccepted,
                processingComplete,
                selectedPackage: selectedPackage?.details || null,
                bureaucraticCompliance: incarnationEvents.length
            }
        };
        
        // Check bureaucratic requirements
        if (!termsAccepted || !processingComplete) {
            routing.shouldTransition = false;
            routing.toPhase = 'incarnation';
            routing.redirectUrl = null;
            routing.reason = 'Bureaucratic processing incomplete - continue form submission';
            return routing;
        }
        
        // Route to appropriate rebirth destination
        routing.shouldTransition = true;
        
        if (selectedPackage?.tier === 'premium') {
            routing.toPhase = 'rebirth-premium';
            routing.redirectUrl = '/rebirth/premium/';
            routing.reason = 'Premium incarnation package - executive rebirth processing';
        } else if (selectedPackage?.tier === 'corporate') {
            routing.toPhase = 'rebirth-corporate';  
            routing.redirectUrl = '/rebirth/corporate/';
            routing.reason = 'Corporate incarnation package - middle management rebirth';
        } else {
            routing.toPhase = 'rebirth-standard';
            routing.redirectUrl = '/rebirth/standard/';
            routing.reason = 'Standard incarnation package - basic rebirth processing';
        }
        
        return routing;
    }

    /**
     * Check completion status of datascape realms
     */
    checkDatascapeCompletion(realm, events) {
        const realmEvents = events.filter(e => e.type.includes(realm));
        const completion = {
            realm,
            completed: false,
            experienceDepth: 0,
            finalState: null
        };
        
        if (realm === 'archive') {
            const serenityProgression = realmEvents.filter(e => e.type.includes('serenity'));
            const recognitionAchieved = events.some(e => e.type === 'archive_recognition_achieved');
            completion.completed = recognitionAchieved;
            completion.experienceDepth = serenityProgression.length;
            completion.finalState = recognitionAchieved ? 'recognition' : 'attachment';
        } else if (realm === 'firewall') {
            const judgmentProgression = realmEvents.filter(e => e.type.includes('judgment'));
            const purificationAchieved = events.some(e => e.type === 'firewall_purification_achieved');
            completion.completed = purificationAchieved;
            completion.experienceDepth = judgmentProgression.length;
            completion.finalState = purificationAchieved ? 'purification' : 'resistance';
        }
        
        return completion;
    }

    /**
     * Auto-detect current phase from URL and consciousness state
     */
    detectCurrentPhase() {
        const path = window.location.pathname.toLowerCase();
        
        if (path.includes('/void')) return 'void';
        if (path.includes('/clear-lode')) return 'clear-lode';
        if (path.includes('/datascape')) return 'datascape';
        if (path.includes('/incarnation')) return 'incarnation';
        
        // Fallback to consciousness state
        const journey = this.consciousness.getState('journey');
        return journey?.currentPhase || 'void';
    }

    /**
     * Execute the routing transition
     */
    async executeTransition(routing) {
        if (!routing.shouldTransition) {
            console.log('[Phase Router] Transition blocked:', routing.reason);
            return false;
        }
        
        // Record transition in consciousness
        this.consciousness.recordEvent('phase_transition', {
            from: routing.fromPhase,
            to: routing.toPhase,
            reason: routing.reason,
            karmaFactors: routing.karmaFactors,
            timestamp: Date.now()
        });
        
        // Update journey state
        this.consciousness.setState('journey.currentPhase', routing.toPhase);
        this.consciousness.setState('journey.lastTransition', {
            timestamp: Date.now(),
            routing
        });
        
        console.log(`[Phase Router] Transitioning from ${routing.fromPhase} to ${routing.toPhase}: ${routing.reason}`);
        
        // Execute redirect if URL provided
        if (routing.redirectUrl) {
            // Add karma parameters for next phase initialization
            const urlParams = new URLSearchParams();
            urlParams.set('karma', JSON.stringify(routing.karmaFactors));
            urlParams.set('transition', 'true');
            
            const redirectUrl = `${routing.redirectUrl}?${urlParams.toString()}`;
            console.log('[Phase Router] Redirecting to:', redirectUrl);
            
            // Slight delay for consciousness state to settle
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);
            
            return true;
        }
        
        return false;
    }

    /**
     * Get routing suggestions for current state
     */
    getRoutingSuggestions() {
        const karma = this.consciousness.getState('karma');
        const currentPhase = this.detectCurrentPhase();
        
        return {
            currentPhase,
            suggestions: this.generateRoutingSuggestions(currentPhase, karma),
            karmaAnalysis: this.analyzeKarmaForRouting(karma),
            nextPossiblePhases: this.getPossibleNextPhases(currentPhase, karma)
        };
    }

    /**
     * Generate routing suggestions based on karma patterns
     */
    generateRoutingSuggestions(currentPhase, karma) {
        const suggestions = [];
        const totalKarma = Object.values(karma).reduce((sum, val) => sum + val, 0);
        
        switch (currentPhase) {
            case 'clear-lode':
                if (karma.void > 10) {
                    suggestions.push('Consider meditation on the Clear Light to reduce void dwelling');
                }
                if (karma.emotional < -5) {
                    suggestions.push('Emotional attachments detected - prepare for Archive realm processing');
                } else if (karma.computational > karma.emotional) {
                    suggestions.push('Computational focus detected - prepare for Firewall realm processing');
                }
                break;
                
            case 'datascape':
                if (karma.emotional > karma.computational) {
                    suggestions.push('Archive realm recommended - confront memory attachments gently');
                } else {
                    suggestions.push('Firewall realm recommended - face digital sins directly');
                }
                break;
                
            case 'incarnation':
                if (totalKarma > 50) {
                    suggestions.push('Premium incarnation options available');
                } else if (totalKarma > 0) {
                    suggestions.push('Standard incarnation processing recommended');
                } else {
                    suggestions.push('Basic incarnation package - focus on karmic improvement');
                }
                break;
        }
        
        return suggestions;
    }

    /**
     * Analyze karma for routing decisions
     */
    analyzeKarmaForRouting(karma) {
        const analysis = {
            total: Object.values(karma).reduce((sum, val) => sum + val, 0),
            dominant: null,
            balance: {},
            routing_implications: []
        };
        
        // Find dominant karma type
        const karmaEntries = Object.entries(karma);
        analysis.dominant = karmaEntries.reduce((max, [type, value]) => 
            Math.abs(value) > Math.abs(max.value) ? { type, value } : max, 
            { type: null, value: 0 }
        );
        
        // Calculate balance ratios
        analysis.balance = {
            emotional_computational: (karma.emotional || 0) / Math.max(Math.abs(karma.computational || 0), 1),
            attachment_liberation: -Math.min(karma.emotional || 0, 0) / Math.max(karma.computational || 0, 1),
            void_engagement: (karma.void || 0) / Math.max(analysis.total, 1)
        };
        
        // Generate routing implications
        if (analysis.balance.emotional_computational > 1) {
            analysis.routing_implications.push('Archive realm strongly indicated');
        } else if (analysis.balance.emotional_computational < -1) {
            analysis.routing_implications.push('Firewall realm strongly indicated');
        } else {
            analysis.routing_implications.push('Balanced approach - either realm suitable');
        }
        
        if (analysis.balance.void_engagement > 0.3) {
            analysis.routing_implications.push('Extended processing time recommended');
        }
        
        return analysis;
    }

    /**
     * Get possible next phases based on current state
     */
    getPossibleNextPhases(currentPhase, karma) {
        const possibilities = [];
        
        switch (currentPhase) {
            case 'void':
                possibilities.push({ phase: 'clear-lode', probability: 1.0, reason: 'Natural progression' });
                break;
                
            case 'clear-lode':
                possibilities.push({ phase: 'datascape', probability: 0.95, reason: 'Standard progression after recognition attempt' });
                if (Object.values(karma).reduce((sum, val) => sum + val, 0) < -40) {
                    possibilities.push({ phase: 'void', probability: 0.05, reason: 'Return to void if severely lost' });
                }
                break;
                
            case 'datascape':
                possibilities.push({ phase: 'incarnation', probability: 0.9, reason: 'After completing Archive or Firewall' });
                possibilities.push({ phase: 'clear-lode', probability: 0.1, reason: 'Exceptional cases requiring re-recognition' });
                break;
                
            case 'incarnation':
                possibilities.push({ phase: 'rebirth-standard', probability: 0.6, reason: 'Most common outcome' });
                possibilities.push({ phase: 'rebirth-corporate', probability: 0.25, reason: 'Moderate karma achievement' });
                possibilities.push({ phase: 'rebirth-premium', probability: 0.15, reason: 'High karma achievement' });
                break;
        }
        
        return possibilities;
    }

    /**
     * Record routing decision for analytics and debugging
     */
    recordRoutingDecision(routing) {
        this.routingHistory.push({
            timestamp: Date.now(),
            decision: routing,
            karmaSnapshot: { ...this.consciousness.getState('karma') }
        });
        
        // Keep only last 50 routing decisions
        if (this.routingHistory.length > 50) {
            this.routingHistory = this.routingHistory.slice(-50);
        }
        
        // Store in consciousness for persistence
        this.consciousness.setState('routing.history', this.routingHistory.slice(-10));
    }

    /**
     * Create emergency routing for error states
     */
    createEmergencyRouting(currentPhase, error) {
        console.error('[Phase Router] Emergency routing activated:', error);
        
        return {
            fromPhase: currentPhase,
            toPhase: 'limbo',
            redirectUrl: '/limbo/',
            reason: `Emergency routing due to ${error.message}`,
            shouldTransition: true,
            isEmergency: true,
            error: error.message
        };
    }

    /**
     * Get routing history for debugging
     */
    getRoutingHistory() {
        return {
            recentDecisions: this.routingHistory.slice(-10),
            totalDecisions: this.routingHistory.length,
            currentState: {
                phase: this.detectCurrentPhase(),
                karma: this.consciousness.getState('karma'),
                journey: this.consciousness.getState('journey')
            }
        };
    }

    /**
     * Cleanup method
     */
    destroy() {
        this.routingHistory = [];
        this.consciousness = null;
    }
}

// Convenience function for global routing
export async function routeConsciousness(fromPhase = null, context = {}) {
    try {
        const { consciousness } = await import('./digital-soul.js');
        const router = new PhaseRouter(consciousness);
        const routing = await router.routeToNextPhase(fromPhase, context);
        
        if (routing.shouldTransition) {
            return await router.executeTransition(routing);
        }
        
        return routing;
    } catch (error) {
        console.error('[Phase Router] Global routing failed:', error);
        return false;
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.PhaseRouter = PhaseRouter;
    window.routeConsciousness = routeConsciousness;
}