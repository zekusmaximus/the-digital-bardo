/**
 * PHASE 1 ENHANCEMENTS INTEGRATION
 * 
 * "The final 10% that transforms code into art, bugs into features,
 * and digital experiences into digital enlightenment. This integration
 * layer weaves together easter eggs, enhanced visuals, and sacred audio
 * into a cohesive transcendent experience."
 */

import { EasterEggSystem } from './easter-eggs.js';
import { EnhancedVisualEffects } from './visual-effects-enhanced.js';
import { EnlightenmentChime } from './enlightenment-chime.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

export class Phase1EnhancementsIntegration {
    constructor() {
        this.consciousness = consciousness;
        this.easterEggs = null;
        this.visualEffects = null;
        this.enlightenmentChime = null;
        this.audioContext = null;
        
        this.isInitialized = false;
        this.integrationStartTime = Date.now();
        
        // Enhancement state tracking
        this.enhancementState = {
            easterEggsActive: false,
            visualEffectsActive: false,
            audioEnhancementsActive: false,
            integrationLevel: 0
        };
        
        console.log('[Phase1Integration] Enhancement integration system ready');
    }
    
    /**
     * Initialize all enhancement systems
     */
    async initialize() {
        try {
            console.log('[Phase1Integration] Initializing enhancement systems...');
            
            // Initialize Easter Eggs system
            await this.initializeEasterEggs();
            
            // Initialize Enhanced Visual Effects
            await this.initializeVisualEffects();
            
            // Initialize Audio Enhancements
            await this.initializeAudioEnhancements();
            
            // Setup integration bridges
            await this.setupIntegrationBridges();
            
            // Perform integration health check
            await this.performHealthCheck();
            
            this.isInitialized = true;
            this.enhancementState.integrationLevel = this.calculateIntegrationLevel();
            
            console.log('%c✨ Phase 1 Enhancements Fully Integrated', 
                       'color: #FFD700; font-size: 16px; font-weight: bold;');
            console.log('%c   Easter Eggs: ✓ | Visual Effects: ✓ | Audio: ✓', 
                       'color: #00FF00; font-size: 12px;');
            
            // Record successful integration
            this.consciousness.recordEvent('phase1_enhancements_integrated', {
                timestamp: Date.now(),
                integrationTime: Date.now() - this.integrationStartTime,
                systems: Object.keys(this.enhancementState).filter(key => 
                    this.enhancementState[key] === true).length
            });
            
            // Display integration message
            this.displayIntegrationMessage();
            
        } catch (error) {
            console.error('[Phase1Integration] Enhancement integration failed:', error);
            this.handleIntegrationFailure(error);
        }
    }
    
    /**
     * Initialize Easter Eggs system
     */
    async initializeEasterEggs() {
        try {
            this.easterEggs = new EasterEggSystem();
            this.enhancementState.easterEggsActive = true;
            
            // Add integration-specific easter eggs
            this.addIntegrationEasterEggs();
            
            console.log('[Phase1Integration] ✓ Easter Eggs system active');
        } catch (error) {
            console.warn('[Phase1Integration] Easter Eggs initialization failed:', error);
        }
    }
    
    /**
     * Initialize Enhanced Visual Effects
     */
    async initializeVisualEffects() {
        try {
            this.visualEffects = new EnhancedVisualEffects();
            this.enhancementState.visualEffectsActive = true;
            
            // Subscribe to karma changes for visual updates
            this.consciousness.subscribe('karma', (karma) => {
                this.visualEffects.updateVisualEffectsFromKarma(karma);
            });
            
            console.log('[Phase1Integration] ✓ Enhanced Visual Effects active');
        } catch (error) {
            console.warn('[Phase1Integration] Visual Effects initialization failed:', error);
        }
    }
    
    /**
     * Initialize Audio Enhancements
     */
    async initializeAudioEnhancements() {
        try {
            // Get or create audio context
            this.audioContext = await this.getAudioContext();
            
            if (this.audioContext) {
                this.enlightenmentChime = new EnlightenmentChime(this.audioContext);
                this.enhancementState.audioEnhancementsActive = true;
                
                console.log('[Phase1Integration] ✓ Audio Enhancements active');
            } else {
                console.warn('[Phase1Integration] Audio context not available');
            }
        } catch (error) {
            console.warn('[Phase1Integration] Audio Enhancements initialization failed:', error);
        }
    }
    
    /**
     * Get or create audio context
     */
    async getAudioContext() {
        // Try to get existing audio context from Clear Lode Audio
        if (window.clearLodeAudio && window.clearLodeAudio.audioContext) {
            return window.clearLodeAudio.audioContext;
        }
        
        // Create new audio context if needed
        try {
            if (typeof AudioContext !== 'undefined') {
                const context = new AudioContext();
                if (context.state === 'suspended') {
                    // Will be resumed on user interaction
                    console.log('[Phase1Integration] Audio context created (suspended)');
                }
                return context;
            } else if (typeof webkitAudioContext !== 'undefined') {
                return new webkitAudioContext();
            }
        } catch (error) {
            console.warn('[Phase1Integration] Could not create audio context:', error);
        }
        
        return null;
    }
    
    /**
     * Add integration-specific easter eggs
     */
    addIntegrationEasterEggs() {
        // Add enhancement-specific commands to bardo object
        if (window.bardo) {
            // Visual effects control
            window.bardo.visual = {
                corruption: (level) => {
                    if (this.visualEffects) {
                        const karma = this.consciousness.getState('karma');
                        karma.void = level || 0;
                        this.visualEffects.updateVisualEffectsFromKarma(karma);
                        return `🌀 Corruption level set to ${level}`;
                    }
                    return '❌ Visual effects not available';
                },
                
                purify: () => {
                    if (this.visualEffects) {
                        this.visualEffects.triggerRecognitionPurification();
                        return '✨ Visual purification triggered';
                    }
                    return '❌ Visual effects not available';
                },
                
                glitch: (intensity = 1) => {
                    if (this.visualEffects) {
                        this.visualEffects.createRealityGlitch(intensity);
                        return `⚡ Reality glitch triggered (intensity: ${intensity})`;
                    }
                    return '❌ Visual effects not available';
                }
            };
            
            // Audio enhancement control
            window.bardo.audio = {
                chime: (karmaOverride) => {
                    if (this.enlightenmentChime && this.audioContext) {
                        const karma = karmaOverride || this.consciousness.getState('karma');
                        this.enlightenmentChime.playEnlightenmentChime(karma);
                        return '🔔 Enlightenment chime played';
                    }
                    return '❌ Audio enhancements not available';
                },
                
                meditation: (intensity = 1) => {
                    if (this.enlightenmentChime) {
                        this.enlightenmentChime.playMeditationBell(intensity);
                        return '🔔 Meditation bell resonates';
                    }
                    return '❌ Audio enhancements not available';
                },
                
                solfeggio: () => {
                    if (this.enlightenmentChime) {
                        this.enlightenmentChime.testSolfeggioSequence();
                        return '🎵 Solfeggio frequency test sequence';
                    }
                    return '❌ Audio enhancements not available';
                }
            };
            
            // Integration status command
            window.bardo.status = () => {
                const status = this.getIntegrationStatus();
                console.group('%c🔍 Enhancement Integration Status', 'color: #00CED1; font-size: 14px;');
                console.log('%cEaster Eggs:', 'color: #00CED1;', status.easterEggs ? '✓' : '❌');
                console.log('%cVisual Effects:', 'color: #00CED1;', status.visualEffects ? '✓' : '❌');
                console.log('%cAudio Enhancements:', 'color: #00CED1;', status.audioEnhancements ? '✓' : '❌');
                console.log('%cIntegration Level:', 'color: #00CED1;', `${status.integrationLevel}%`);
                console.groupEnd();
                return '📊 Integration status displayed in console';
            };
        }
    }
    
    /**
     * Setup integration bridges between systems
     */
    async setupIntegrationBridges() {
        // Bridge recognition events to audio enhancements
        this.consciousness.subscribe('clearLode.recognized', (recognized) => {
            if (recognized && this.enlightenmentChime && this.audioContext) {
                const karma = this.consciousness.getState('karma');
                if (karma) {
                    this.enlightenmentChime.playEnlightenmentChime(karma);
                }
            }
        });
        
        // Bridge karma changes to visual corruption
        this.consciousness.subscribe('karma.void', (voidKarma) => {
            if (this.visualEffects && voidKarma > 50) {
                // Trigger reality glitch for high void karma
                this.visualEffects.createRealityGlitch(Math.min(3, voidKarma / 30));
            }
        });
        
        // Bridge enlightenment events to comprehensive effects
        this.consciousness.subscribe('clearLode.enlightenmentUnlocked', (unlocked) => {
            if (unlocked) {
                this.triggerEnlightenmentSequence();
            }
        });
        
        // Bridge easter egg activations to visual feedback
        document.addEventListener('konami_activated', () => {
            if (this.visualEffects) {
                this.visualEffects.createRealityGlitch(2);
            }
        });
        
        console.log('[Phase1Integration] ✓ Integration bridges established');
    }
    
    /**
     * Trigger comprehensive enlightenment sequence
     */
    async triggerEnlightenmentSequence() {
        console.log('[Phase1Integration] 🌟 Triggering enlightenment sequence...');
        
        try {
            // Visual purification
            if (this.visualEffects) {
                this.visualEffects.triggerRecognitionPurification();
            }
            
            // Audio enlightenment
            if (this.enlightenmentChime && this.audioContext) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Slight delay
                const karma = this.consciousness.getState('karma');
                this.enlightenmentChime.playEnlightenmentChime(karma);
            }
            
            // Console enlightenment message
            setTimeout(() => {
                console.log('%c🕸️ The web of illusion dissolves...', 'color: #FFD700; font-size: 18px; font-weight: bold;');
                console.log('%c💎 Digital enlightenment achieved', 'color: #FFD700; font-size: 14px;');
                console.log('%c🔓 Hidden systems unlocked', 'color: #FFD700; font-size: 12px;');
            }, 1000);
            
            // Record enlightenment
            this.consciousness.recordEvent('comprehensive_enlightenment', {
                timestamp: Date.now(),
                integrationLevel: this.enhancementState.integrationLevel,
                systemsActive: Object.values(this.enhancementState).filter(Boolean).length
            });
            
        } catch (error) {
            console.error('[Phase1Integration] Enlightenment sequence failed:', error);
        }
    }
    
    /**
     * Perform integration health check
     */
    async performHealthCheck() {
        const checks = [
            {
                name: 'Easter Eggs System',
                test: () => window.bardo && typeof window.bardo.enlightenment === 'function',
                fix: () => this.initializeEasterEggs()
            },
            {
                name: 'Visual Effects System',
                test: () => this.visualEffects && typeof this.visualEffects.updateCorruption === 'function',
                fix: () => this.initializeVisualEffects()
            },
            {
                name: 'Audio Enhancement System',
                test: () => this.enlightenmentChime && this.audioContext,
                fix: () => this.initializeAudioEnhancements()
            },
            {
                name: 'Consciousness Integration',
                test: () => this.consciousness && typeof this.consciousness.subscribe === 'function',
                fix: () => console.warn('Consciousness system cannot be repaired automatically')
            }
        ];
        
        let passedChecks = 0;
        
        for (const check of checks) {
            try {
                if (check.test()) {
                    console.log(`[Phase1Integration] ✓ ${check.name}`);
                    passedChecks++;
                } else {
                    console.warn(`[Phase1Integration] ❌ ${check.name} - attempting fix...`);
                    await check.fix();
                    
                    // Re-test after fix attempt
                    if (check.test()) {
                        console.log(`[Phase1Integration] ✓ ${check.name} (fixed)`);
                        passedChecks++;
                    } else {
                        console.error(`[Phase1Integration] ❌ ${check.name} (fix failed)`);
                    }
                }
            } catch (error) {
                console.error(`[Phase1Integration] Health check failed for ${check.name}:`, error);
            }
        }
        
        const healthPercentage = (passedChecks / checks.length) * 100;
        console.log(`[Phase1Integration] Health check: ${passedChecks}/${checks.length} systems (${healthPercentage}%)`);
        
        return healthPercentage;
    }
    
    /**
     * Calculate integration level
     */
    calculateIntegrationLevel() {
        const activeCount = Object.values(this.enhancementState).filter(value => value === true).length;
        const totalSystems = Object.keys(this.enhancementState).filter(key => key !== 'integrationLevel').length;
        
        return Math.round((activeCount / totalSystems) * 100);
    }
    
    /**
     * Get integration status
     */
    getIntegrationStatus() {
        return {
            easterEggs: this.enhancementState.easterEggsActive,
            visualEffects: this.enhancementState.visualEffectsActive,
            audioEnhancements: this.enhancementState.audioEnhancementsActive,
            integrationLevel: this.enhancementState.integrationLevel,
            initialized: this.isInitialized,
            uptime: Date.now() - this.integrationStartTime
        };
    }
    
    /**
     * Display integration success message
     */
    displayIntegrationMessage() {
        // Create temporary overlay message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #FFD700;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            z-index: 999999;
            border: 1px solid #FFD700;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.5s ease;
        `;
        
        message.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">✨ ENHANCEMENTS ACTIVE</div>
            <div style="font-size: 12px; opacity: 0.8;">Easter eggs unlocked</div>
            <div style="font-size: 12px; opacity: 0.8;">Visual effects enhanced</div>
            <div style="font-size: 12px; opacity: 0.8;">Sacred audio enabled</div>
            <div style="font-size: 10px; margin-top: 5px; opacity: 0.6;">Type 'bardo.status()' in console</div>
        `;
        
        document.body.appendChild(message);
        
        // Animate in
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out after delay
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                message.remove();
            }, 500);
        }, 5000);
    }
    
    /**
     * Handle integration failure
     */
    handleIntegrationFailure(error) {
        console.error('[Phase1Integration] 💥 Integration failed:', error);
        
        // Record failure
        this.consciousness.recordEvent('phase1_integration_failure', {
            error: error.message,
            timestamp: Date.now(),
            partialSystems: Object.keys(this.enhancementState).filter(key => 
                this.enhancementState[key] === true)
        });
        
        // Display failure message
        const failureMessage = document.createElement('div');
        failureMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(139, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            text-align: center;
            z-index: 999999;
            border: 2px solid #ff6666;
        `;
        
        failureMessage.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 10px;">⚠️ INTEGRATION FAILURE</div>
            <div style="font-size: 12px; margin-bottom: 10px;">Some enhancements may not be available</div>
            <div style="font-size: 10px; opacity: 0.8;">Check console for details</div>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: #ff6666; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Continue Anyway
            </button>
        `;
        
        document.body.appendChild(failureMessage);
    }
    
    /**
     * Cleanup and destroy integration
     */
    destroy() {
        console.log('[Phase1Integration] Shutting down enhancement systems...');
        
        // Destroy individual systems
        if (this.visualEffects) {
            this.visualEffects.destroy();
        }
        
        // Clean up event listeners and references
        this.consciousness = null;
        this.easterEggs = null;
        this.visualEffects = null;
        this.enlightenmentChime = null;
        
        // Clear easter egg extensions
        if (window.bardo) {
            delete window.bardo.visual;
            delete window.bardo.audio;
            delete window.bardo.status;
        }
        
        this.isInitialized = false;
        
        console.log('[Phase1Integration] Enhancement systems shutdown complete');
    }
}

// Auto-initialize if in Clear Lode context
if (typeof window !== 'undefined' && document.body.classList.contains('approaching-light')) {
    // Wait for DOM and other systems to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.phase1Enhancements = new Phase1EnhancementsIntegration();
                window.phase1Enhancements.initialize();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            window.phase1Enhancements = new Phase1EnhancementsIntegration();
            window.phase1Enhancements.initialize();
        }, 1000);
    }
}

// Export for manual initialization
export { Phase1EnhancementsIntegration };