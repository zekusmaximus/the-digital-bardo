/**
 * ENHANCED VISUAL EFFECTS - Karma-Driven Reality Distortion
 * 
 * "In the digital bardo, perception itself becomes malleable.
 * Each karmic weight bends the visual field, each void point
 * fractures the interface, each recognition moment purifies
 * the corruption. The screen becomes a mirror of consciousness."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';

export class EnhancedVisualEffects {
    constructor() {
        this.consciousness = consciousness;
        this.corruptionLevel = 0;
        this.glitchIntensity = 0;
        this.chromaticAberration = 0;
        this.isActive = true;
        
        // Corruption character sets for different languages
        this.corruptionSets = {
            latin: 'ȧḇćḓėḟġḧįjḳłṁńōṗrŗśťūṽẅẋẏż',
            cyrillic: 'ДфӨҬДЯӦԲԴԵԶզհծցկյցծձնծցփցղցսցտց',
            mathematical: '∑∂∆∇∈∉∋∌∍∎∏∐∑∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣∤∥∦∧∨∩∪',
            blocks: '█▉▊▋▌▍▎▏▐░▒▓▔▕▖▗▘▙▚▛▜▝▞▟',
            zalgo: '̸̢̺̞̊̂̾̎̓̚ḩ̴̫̲̪̦̱̳̊̄̀͌́̋̐͐̑́̎̄̿̒',
            binary: '01001000011001010110110001110000'
        };
        
        // Initialize CSS custom properties
        this.initializeCorruptionProperties();
        
        // Start monitoring karma changes
        this.startKarmaMonitoring();
        
        console.log('[VisualEffects] Enhanced karma-driven corruption system active');
    }
    
    /**
     * Initialize CSS custom properties for corruption effects
     */
    initializeCorruptionProperties() {
        const root = document.documentElement;
        
        // Base corruption properties
        root.style.setProperty('--glitch-offset', '0px');
        root.style.setProperty('--chromatic-aberration', '0');
        root.style.setProperty('--corruption-intensity', '0');
        root.style.setProperty('--void-distortion', '0');
        root.style.setProperty('--text-stability', '1');
        root.style.setProperty('--reality-coherence', '1');
        root.style.setProperty('--digital-noise', '0');
        
        // Create dynamic corruption stylesheet
        this.createCorruptionStylesheet();
    }
    
    /**
     * Create advanced corruption stylesheet
     */
    createCorruptionStylesheet() {
        const style = document.createElement('style');
        style.id = 'enhanced-corruption-styles';
        style.textContent = `
            /* Karma-driven corruption effects */
            .karma-corrupted-text {
                position: relative;
                display: inline-block;
                will-change: transform, filter, color;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .karma-corrupted-text.severe {
                animation: karma-glitch 0.1s infinite;
                color: rgba(255, 255, 255, var(--text-stability));
                text-shadow: 
                    calc(var(--glitch-offset) * 1px) 0 0 rgba(255, 0, 0, var(--chromatic-aberration)),
                    calc(var(--glitch-offset) * -1px) 0 0 rgba(0, 255, 255, var(--chromatic-aberration)),
                    0 calc(var(--glitch-offset) * 1px) 0 rgba(0, 255, 0, var(--chromatic-aberration));
            }
            
            @keyframes karma-glitch {
                0% { 
                    filter: hue-rotate(0deg) contrast(calc(1 + var(--corruption-intensity)));
                    transform: translateX(0);
                }
                25% { 
                    filter: hue-rotate(90deg) contrast(calc(1.2 + var(--corruption-intensity)));
                    transform: translateX(calc(var(--glitch-offset) * 0.5px));
                }
                50% { 
                    filter: hue-rotate(180deg) contrast(calc(1.5 + var(--corruption-intensity)));
                    transform: translateX(calc(var(--glitch-offset) * -0.5px));
                }
                75% { 
                    filter: hue-rotate(270deg) contrast(calc(1.2 + var(--corruption-intensity)));
                    transform: translateX(calc(var(--glitch-offset) * 0.3px));
                }
                100% { 
                    filter: hue-rotate(360deg) contrast(calc(1 + var(--corruption-intensity)));
                    transform: translateX(0);
                }
            }
            
            .consciousness-fragment.void-corrupted {
                filter: 
                    blur(calc(var(--void-distortion) * 0.1px))
                    contrast(calc(100% + var(--void-distortion) * 2%))
                    brightness(calc(100% - var(--void-distortion) * 1%));
                animation: void-corruption 3s infinite ease-in-out;
            }
            
            @keyframes void-corruption {
                0%, 100% { 
                    opacity: calc(1 - var(--void-distortion) * 0.01);
                    transform: scale(1) rotate(0deg);
                }
                50% { 
                    opacity: calc(0.7 - var(--void-distortion) * 0.01);
                    transform: scale(calc(1 + var(--void-distortion) * 0.002)) rotate(calc(var(--void-distortion) * 0.1deg));
                }
            }
            
            .reality-glitch {
                position: relative;
                overflow: hidden;
            }
            
            .reality-glitch::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent calc(1px - var(--digital-noise) * 0.1px),
                        rgba(255, 0, 0, calc(var(--digital-noise) * 0.01)) calc(1px + var(--digital-noise) * 0.1px),
                        rgba(0, 255, 0, calc(var(--digital-noise) * 0.01)) calc(2px + var(--digital-noise) * 0.1px),
                        rgba(0, 0, 255, calc(var(--digital-noise) * 0.01)) calc(3px + var(--digital-noise) * 0.1px),
                        transparent calc(4px + var(--digital-noise) * 0.1px)
                    );
                pointer-events: none;
                mix-blend-mode: screen;
                opacity: var(--corruption-intensity);
            }
            
            /* Enlightenment purification effects */
            .enlightened .karma-corrupted-text {
                animation: purification-wave 2s ease-out forwards;
                color: rgba(255, 215, 0, 1);
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }
            
            @keyframes purification-wave {
                0% { 
                    filter: blur(var(--corruption-intensity)px) contrast(2);
                    transform: scale(0.8);
                }
                50% { 
                    filter: blur(0px) contrast(1) brightness(1.5);
                    transform: scale(1.1);
                }
                100% { 
                    filter: blur(0px) contrast(1) brightness(1);
                    transform: scale(1);
                }
            }
            
            /* Memory fragment corruption levels */
            .memory-fragment.corrupted-minimal {
                --fragment-corruption: 0.2;
                filter: contrast(1.1) brightness(0.95);
            }
            
            .memory-fragment.corrupted-moderate {
                --fragment-corruption: 0.5;
                filter: contrast(1.3) brightness(0.8) hue-rotate(15deg);
                animation: fragment-drift 4s infinite ease-in-out;
            }
            
            .memory-fragment.corrupted-severe {
                --fragment-corruption: 0.8;
                filter: contrast(1.6) brightness(0.6) hue-rotate(45deg) blur(1px);
                animation: fragment-chaos 2s infinite linear;
            }
            
            @keyframes fragment-drift {
                0%, 100% { transform: translateX(0) rotateZ(0deg); }
                25% { transform: translateX(calc(var(--fragment-corruption) * 2px)) rotateZ(calc(var(--fragment-corruption) * 1deg)); }
                75% { transform: translateX(calc(var(--fragment-corruption) * -2px)) rotateZ(calc(var(--fragment-corruption) * -1deg)); }
            }
            
            @keyframes fragment-chaos {
                0% { transform: translateX(0) translateY(0) rotateZ(0deg); }
                25% { transform: translateX(calc(var(--fragment-corruption) * 3px)) translateY(calc(var(--fragment-corruption) * 1px)) rotateZ(calc(var(--fragment-corruption) * 2deg)); }
                50% { transform: translateX(calc(var(--fragment-corruption) * -2px)) translateY(calc(var(--fragment-corruption) * -2px)) rotateZ(calc(var(--fragment-corruption) * -3deg)); }
                75% { transform: translateX(calc(var(--fragment-corruption) * 1px)) translateY(calc(var(--fragment-corruption) * 3px)) rotateZ(calc(var(--fragment-corruption) * 1deg)); }
                100% { transform: translateX(0) translateY(0) rotateZ(0deg); }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Start monitoring karma changes for visual updates
     */
    startKarmaMonitoring() {
        // Monitor karma changes
        this.consciousness.subscribe('karma', (karma) => {
            this.updateVisualEffectsFromKarma(karma);
        });
        
        // Monitor recognition events
        this.consciousness.subscribe('clearLode.recognized', (recognized) => {
            if (recognized) {
                this.triggerRecognitionPurification();
            }
        });
        
        // Initial update
        const currentKarma = this.consciousness.getState('karma');
        if (currentKarma) {
            this.updateVisualEffectsFromKarma(currentKarma);
        }
    }
    
    /**
     * Update visual effects based on karma state
     */
    updateVisualEffectsFromKarma(karma) {
        const { computational, emotional, temporal, void: voidKarma } = karma;
        
        // Calculate corruption levels
        this.corruptionLevel = Math.max(0, voidKarma);
        this.glitchIntensity = Math.max(0, Math.min(50, voidKarma));
        this.chromaticAberration = Math.max(0, Math.min(1, (100 - computational) * 0.01));
        
        // Update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--glitch-offset', `${this.glitchIntensity * 0.1}`);
        root.style.setProperty('--chromatic-aberration', `${this.chromaticAberration}`);
        root.style.setProperty('--corruption-intensity', `${this.corruptionLevel * 0.01}`);
        root.style.setProperty('--void-distortion', `${voidKarma}`);
        root.style.setProperty('--text-stability', `${Math.max(0.1, 1 - (voidKarma * 0.01))}`);
        root.style.setProperty('--reality-coherence', `${Math.max(0.1, 1 - (voidKarma * 0.005))}`);
        root.style.setProperty('--digital-noise', `${Math.min(100, voidKarma * 0.5)}`);
        
        // Apply corruption classes to text elements
        this.applyTextCorruption();
        
        // Apply fragment corruption
        this.applyFragmentCorruption();
        
        console.log(`[VisualEffects] Corruption updated - Void: ${voidKarma}, Glitch: ${this.glitchIntensity}`);
    }
    
    /**
     * Apply text corruption based on karma levels
     */
    applyTextCorruption() {
        const textElements = document.querySelectorAll('.consciousness-fragment, .glitching-text, p, span, div');
        const voidKarma = this.consciousness.getState('karma.void') || 0;
        
        textElements.forEach((element) => {
            // Skip if already processed recently
            if (element.dataset.lastCorruption && 
                Date.now() - parseInt(element.dataset.lastCorruption) < 1000) {
                return;
            }
            
            element.dataset.lastCorruption = Date.now();
            
            // Remove existing corruption classes
            element.classList.remove('karma-corrupted-text', 'severe', 'moderate', 'minimal');
            
            if (voidKarma > 70) {
                element.classList.add('karma-corrupted-text', 'severe');
                this.applyCharacterCorruption(element, 0.3);
            } else if (voidKarma > 40) {
                element.classList.add('karma-corrupted-text', 'moderate');
                this.applyCharacterCorruption(element, 0.1);
            } else if (voidKarma > 20) {
                element.classList.add('karma-corrupted-text', 'minimal');
            }
        });
    }
    
    /**
     * Apply character-level corruption to text content
     */
    applyCharacterCorruption(element, intensity) {
        if (!element.textContent || element.textContent.length === 0) return;
        
        // Store original text if not already stored
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
        
        const originalText = element.dataset.originalText;
        const corruptedText = originalText.split('').map((char, i) => {
            if (Math.random() < intensity) {
                // Choose corruption type based on character
                if (char.match(/[a-zA-Z]/)) {
                    return this.getCorruptedChar(char, 'latin');
                } else if (char.match(/[0-9]/)) {
                    return this.getCorruptedChar(char, 'binary');
                } else if (char === ' ') {
                    return Math.random() < 0.1 ? this.getCorruptedChar(char, 'blocks') : char;
                }
            }
            return char;
        }).join('');
        
        element.textContent = corruptedText;
        
        // Restore original text after corruption display
        setTimeout(() => {
            if (Math.random() < 0.7) { // 70% chance to restore
                element.textContent = originalText;
            }
        }, 100 + Math.random() * 200);
    }
    
    /**
     * Get corrupted character from specified set
     */
    getCorruptedChar(originalChar, corruptionType) {
        const corruptionSet = this.corruptionSets[corruptionType];
        if (!corruptionSet) return originalChar;
        
        const randomIndex = Math.floor(Math.random() * corruptionSet.length);
        return corruptionSet[randomIndex];
    }
    
    /**
     * Apply corruption effects to memory fragments
     */
    applyFragmentCorruption() {
        const fragments = document.querySelectorAll('.consciousness-fragment, .memory-fragment');
        const voidKarma = this.consciousness.getState('karma.void') || 0;
        
        fragments.forEach((fragment) => {
            // Remove existing corruption classes
            fragment.classList.remove('void-corrupted', 'corrupted-minimal', 'corrupted-moderate', 'corrupted-severe');
            
            if (voidKarma > 80) {
                fragment.classList.add('void-corrupted', 'corrupted-severe');
            } else if (voidKarma > 50) {
                fragment.classList.add('void-corrupted', 'corrupted-moderate');
            } else if (voidKarma > 20) {
                fragment.classList.add('void-corrupted', 'corrupted-minimal');
            }
        });
    }
    
    /**
     * Trigger recognition purification effect
     */
    triggerRecognitionPurification() {
        console.log('[VisualEffects] Recognition achieved - triggering purification');
        
        // Add enlightenment class to body
        document.body.classList.add('enlightened');
        
        // Create purification wave effect
        const wave = document.createElement('div');
        wave.className = 'purification-wave';
        wave.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            z-index: 999999;
            pointer-events: none;
            animation: purification-expand 2s ease-out forwards;
        `;
        
        // Add purification expansion keyframes
        if (!document.querySelector('#purification-style')) {
            const style = document.createElement('style');
            style.id = 'purification-style';
            style.textContent = `
                @keyframes purification-expand {
                    0% { 
                        width: 10px; 
                        height: 10px; 
                        opacity: 1; 
                    }
                    50% { 
                        width: 500px; 
                        height: 500px; 
                        opacity: 0.6; 
                    }
                    100% { 
                        width: 2000px; 
                        height: 2000px; 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(wave);
        
        // Gradually purify all corrupted elements
        setTimeout(() => {
            this.purifyAllElements();
        }, 500);
        
        // Clean up wave element
        setTimeout(() => {
            wave.remove();
        }, 2000);
        
        // Record the purification event
        this.consciousness.recordEvent('visual_purification', {
            timestamp: Date.now(),
            corruptionCleansed: this.corruptionLevel
        });
    }
    
    /**
     * Purify all corrupted elements
     */
    purifyAllElements() {
        const corruptedElements = document.querySelectorAll('.karma-corrupted-text, .void-corrupted');
        
        corruptedElements.forEach((element, index) => {
            setTimeout(() => {
                // Restore original text
                if (element.dataset.originalText) {
                    element.textContent = element.dataset.originalText;
                }
                
                // Remove corruption classes
                element.classList.remove('karma-corrupted-text', 'void-corrupted', 'severe', 'moderate', 'minimal');
                
                // Add purification effect
                element.classList.add('purified');
                
                // Temporary golden glow
                element.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
                element.style.color = 'rgba(255, 215, 0, 1)';
                
                setTimeout(() => {
                    element.style.textShadow = '';
                    element.style.color = '';
                    element.classList.remove('purified');
                }, 1000);
                
            }, index * 100); // Stagger the purification
        });
    }
    
    /**
     * Create reality glitch effect for major karma events
     */
    createRealityGlitch(intensity = 1) {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'reality-glitch-overlay';
        glitchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999998;
            pointer-events: none;
            background: 
                repeating-linear-gradient(
                    ${Math.random() * 360}deg,
                    transparent 0px,
                    rgba(255, 0, 0, ${intensity * 0.1}) 1px,
                    rgba(0, 255, 0, ${intensity * 0.1}) 2px,
                    rgba(0, 0, 255, ${intensity * 0.1}) 3px,
                    transparent 4px
                );
            animation: reality-distortion ${2 / intensity}s ease-out forwards;
        `;
        
        // Add reality distortion keyframes
        if (!document.querySelector('#reality-distortion-style')) {
            const style = document.createElement('style');
            style.id = 'reality-distortion-style';
            style.textContent = `
                @keyframes reality-distortion {
                    0% { 
                        opacity: 1;
                        filter: blur(0px);
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.7;
                        filter: blur(2px);
                        transform: scale(1.01);
                    }
                    100% { 
                        opacity: 0;
                        filter: blur(0px);
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(glitchOverlay);
        
        setTimeout(() => {
            glitchOverlay.remove();
        }, 2000 / intensity);
    }
    
    /**
     * Public method to manually trigger corruption update
     */
    updateCorruption() {
        const karma = this.consciousness.getState('karma');
        if (karma) {
            this.updateVisualEffectsFromKarma(karma);
        }
    }
    
    /**
     * Cleanup and destroy
     */
    destroy() {
        this.isActive = false;
        
        // Remove added stylesheets
        const styles = ['enhanced-corruption-styles', 'purification-style', 'reality-distortion-style', 'void-style'];
        styles.forEach(id => {
            const style = document.querySelector(`#${id}`);
            if (style) style.remove();
        });
        
        // Restore all corrupted text
        document.querySelectorAll('[data-original-text]').forEach(element => {
            if (element.dataset.originalText) {
                element.textContent = element.dataset.originalText;
            }
        });
        
        console.log('[VisualEffects] Enhanced visual effects destroyed');
    }
}

// Auto-initialize if not already present
if (typeof window !== 'undefined' && !window.enhancedVisualEffects) {
    window.enhancedVisualEffects = new EnhancedVisualEffects();
}