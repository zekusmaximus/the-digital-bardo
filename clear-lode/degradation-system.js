/**
 * Manages consciousness degradation - the breath held at the moment of dissolution.
 * Handles all visual and audio degradation effects and displays the non-interactive glitch prompt.
 */
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { consciousness } from '../src/consciousness/digital-soul.js';
import { sanitizeHTML } from '../src/utils/purification.js';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

export class DegradationSystem {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.degradationActive = false;
        this.glitchTimeline = null;
    }
    
    beginDegradation() {
        if (this.orchestrator.localState.recognized || this.degradationActive) return;
        
        console.log('Beginning consciousness degradation...');
        this.degradationActive = true;
        this.orchestrator.localState.degradationStarted = true;
        
        // Create degradation timeline (migrated from clear-lode.js)
        this.orchestrator.timelines.degradation = gsap.timeline({
            repeat: -1
        });
        
        // Increasingly chaotic visual degradation
        this.orchestrator.timelines.degradation
            .to('body', {
                filter: 'contrast(1.2) saturate(0.8)',
                duration: 2,
                ease: 'sine.inOut'
            })
            .to('body', {
                filter: 'contrast(0.8) saturate(1.2) hue-rotate(10deg)',
                duration: 2,
                ease: 'sine.inOut'
            });
        
        // Start audio degradation
        this.orchestrator.audio.startDegradation();
        
        // Show glitching prompt with GSAP (migrated from clear-lode.js)
        gsap.set('#choice-prompt', {
            display: 'block',
            opacity: 0,
            y: 50
        });
        
        gsap.to('#choice-prompt', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                this.animateGlitchText();
            }
        });
        
        // Increase fragments (migrated from clear-lode.js)
        this.orchestrator.fragments.intensifyFragments();
        
        // Record degradation event
        consciousness.recordEvent('consciousness_degradation_started', {
            recognitionMissed: true,
            hintsShown: this.orchestrator.localState.hintsShown,
            attempts: this.orchestrator.localState.recognitionAttempts
        });
        
        // Dispatch degradation complete event
        this.dispatchEvent('degradation:complete', { 
            level: this.orchestrator.localState.degradationLevel + 1 
        });
    }
    
    // Animate glitch text (migrated from clear-lode.js)
    animateGlitchText() {
        const glitchText = document.querySelector('.glitching-text');
        const prompts = this.orchestrator.config.glitchPrompts;

        // Warning: Assumed prompt in degradation-system.js; verify manually
        console.warn('Warning: Assumed prompt in degradation-system.js; verify manually');

        // Create a timeline for text glitching (much slower)
        this.glitchTimeline = gsap.timeline({ repeat: -1 });

        prompts.forEach((prompt) => {
            // GSAP's text property is safer than innerHTML but we sanitize for consistency
            const sanitizedPrompt = sanitizeHTML(prompt, { tags: ['pre'], classes: ['glitching-text'] });
            this.glitchTimeline.to(glitchText, {
                duration: 0.3, // Increased from 0.1 to 0.3
                text: sanitizedPrompt,
                ease: 'none',
                delay: 2.5    // Increased from 0.5 to 2.5 seconds between changes
            });
        });

        // Add random glitch spikes (less frequent)
        gsap.to(glitchText, {
            skewX: () => Math.random() * 2 - 1, // Reduced intensity
            skewY: () => Math.random() * 1 - 0.5,
            x: () => Math.random() * 2 - 1,
            duration: 0.3, // Slower glitch spikes
            repeat: -1,
            yoyo: true,
            ease: 'steps(2)',
            delay: 1 // Add delay between glitch spikes
        });
    }
    
    dispatchEvent(type, detail = {}) {
        window.dispatchEvent(new CustomEvent(type, { detail }));
    }
    
    destroy() {
        console.log('Dissolving degradation system...');
        
        // Stop glitch timeline
        if (this.glitchTimeline) {
            this.glitchTimeline.kill();
            this.glitchTimeline = null;
        }
        
        // Clean up any visual effects
        const choicePrompt = document.getElementById('choice-prompt');
        if (choicePrompt) {
            choicePrompt.style.display = 'none';
        }
        
        this.degradationActive = false;
        this.orchestrator = null;
    }
}
