/**
 * @file CorruptionProgression - Progressive fragment corruption system
 * 
 * This class manages the progressive corruption of fragments based on karma state,
 * starting fragments in clean state and applying corruption over time.
 * Implements requirements 4.1, 4.2, 4.3, 4.4 from the UX improvements spec.
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';
import { createSeededRandom } from '../src/utils/seeded-random.js';

/**
 * Manages progressive corruption of fragments based on karma and time
 */
export class CorruptionProgression {
    constructor(karmaEngine, degradationConfig = {}) {
        this.karmaEngine = karmaEngine;
        this.guardian = new ResourceGuardian();
        
        // Configuration for corruption progression
        this.config = {
            baseCorruptionRate: 0.001, // Base corruption per second
            karmaMultiplier: 0.5, // How much karma affects corruption rate
            maxCorruptionLevel: 1.0,
            purificationStrength: 0.3, // How much recognition reduces corruption
            syncThreshold: 0.1, // Threshold for audio-visual sync
            ...degradationConfig
        };
        
        // Corruption state tracking
        this.fragmentCorruption = new Map(); // fragmentId -> corruption data
        this.globalCorruptionLevel = 0;
        this.lastAudioDegradationLevel = 0;
        
        // Visual corruption effects configuration
        this.corruptionEffects = {
            minimal: {
                charReplace: 0.05,
                truncation: 0.05,
                entity: 0.01,
                visualIntensity: 0.2
            },
            moderate: {
                charReplace: 0.20,
                truncation: 0.25,
                entity: 0.05,
                visualIntensity: 0.5
            },
            severe: {
                charReplace: 0.40,
                truncation: 0.50,
                entity: 0.15,
                visualIntensity: 0.8
            },
            complete: {
                charReplace: 1.0,
                truncation: 1.0,
                entity: 0.50,
                visualIntensity: 1.0
            }
        };
        
        // Glitch characters for corruption
        this.glitchChars = ['▓', '▒', '░', '█', '◆', '◇', '◊', '○', '●', '∆', '¥', '€', '¢'];
        
        // Start corruption progression timer
        this.startCorruptionTimer();
        
        console.log('[CorruptionProgression] Initialized with config:', this.config);
    }
    
    /**
     * Initializes a fragment in clean, uncorrupted state
     * Requirement 4.1: Fragments start in uncorrupted state
     */
    initializeCleanFragment(fragment) {
        if (!fragment || !fragment.dataset) {
            console.warn('[CorruptionProgression] Invalid fragment provided to initializeCleanFragment');
            return;
        }
        
        const fragmentId = fragment.dataset.birthTime || Date.now().toString();
        const originalContent = fragment.textContent || fragment.dataset.text || '';
        
        // Initialize fragment corruption data
        const corruptionData = {
            id: fragmentId,
            originalContent: originalContent,
            currentContent: originalContent,
            corruptionLevel: 0, // Start at 0 corruption
            lastUpdate: Date.now(),
            karmaInfluence: {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            },
            element: fragment
        };
        
        this.fragmentCorruption.set(fragmentId, corruptionData);
        
        // Set fragment to clean state
        fragment.textContent = originalContent;
        fragment.dataset.corruptionLevel = '0';
        fragment.classList.remove('corrupted-minimal', 'corrupted-moderate', 'corrupted-severe', 'corrupted-complete');
        
        // Record clean initialization
        consciousness.recordEvent('fragment_initialized_clean', {
            fragmentId: fragmentId,
            originalContent: originalContent,
            timestamp: Date.now()
        });
        
        console.log(`[CorruptionProgression] Fragment ${fragmentId} initialized in clean state`);
        
        return corruptionData;
    }
    
    /**
     * Applies progressive corruption to a fragment based on karma state
     * Requirement 4.2: Corruption applied over time based on karma
     */
    applyProgressiveCorruption(fragment, karmaState) {
        if (!fragment || !fragment.dataset) {
            return;
        }
        
        const fragmentId = fragment.dataset.birthTime || fragment.dataset.fragmentId;
        const corruptionData = this.fragmentCorruption.get(fragmentId);
        
        if (!corruptionData) {
            console.warn(`[CorruptionProgression] No corruption data found for fragment ${fragmentId}`);
            return;
        }
        
        const now = Date.now();
        const timeDelta = (now - corruptionData.lastUpdate) / 1000; // Convert to seconds
        
        // Calculate karma influence on corruption rate
        const totalKarma = this.karmaEngine.getTotalKarma(karmaState);
        const karmaInfluence = Math.max(0, -totalKarma * this.config.karmaMultiplier); // Negative karma increases corruption
        
        // Calculate corruption increase
        const baseIncrease = this.config.baseCorruptionRate * timeDelta;
        const karmaIncrease = karmaInfluence * timeDelta * 0.001; // Scale karma influence
        const totalIncrease = baseIncrease + karmaIncrease;
        
        // Apply corruption increase
        corruptionData.corruptionLevel = Math.min(
            this.config.maxCorruptionLevel,
            corruptionData.corruptionLevel + totalIncrease
        );
        
        // Update karma influence tracking
        corruptionData.karmaInfluence = { ...karmaState };
        corruptionData.lastUpdate = now;
        
        // Apply visual corruption effects
        this.applyVisualCorruption(fragment, corruptionData);
        
        // Update fragment dataset
        fragment.dataset.corruptionLevel = corruptionData.corruptionLevel.toString();
        
        // Notify performance optimizer if available
        if (window.clearLodeOrchestrator?.fragmentPerformanceOptimizer) {
            window.clearLodeOrchestrator.fragmentPerformanceOptimizer.optimizeCorruptionEffect(fragment, corruptionData);
        }
        
        // Record corruption progression
        if (totalIncrease > 0) {
            consciousness.recordEvent('fragment_corruption_progressed', {
                fragmentId: fragmentId,
                corruptionLevel: corruptionData.corruptionLevel,
                karmaInfluence: totalKarma,
                timeDelta: timeDelta,
                timestamp: now
            });
        }
        
        return corruptionData.corruptionLevel;
    }
    
    /**
     * Applies visual corruption effects that are progressive rather than binary
     * Requirement 4.3: Progressive visual corruption effects
     */
    applyVisualCorruption(fragment, corruptionData) {
        const corruptionLevel = corruptionData.corruptionLevel;
        const originalContent = corruptionData.originalContent;
        
        // Determine corruption tier
        let corruptionTier = 'minimal';
        if (corruptionLevel >= 0.75) {
            corruptionTier = 'complete';
        } else if (corruptionLevel >= 0.5) {
            corruptionTier = 'severe';
        } else if (corruptionLevel >= 0.25) {
            corruptionTier = 'moderate';
        }
        
        const effects = this.corruptionEffects[corruptionTier];
        
        // Apply text corruption
        const corruptedText = this.applyTextCorruption(originalContent, corruptionLevel, effects);
        corruptionData.currentContent = corruptedText;
        fragment.textContent = corruptedText;
        
        // Apply CSS corruption classes
        this.applyCorruptionClasses(fragment, corruptionTier, effects.visualIntensity);
        
        // Update CSS variables for smooth transitions
        fragment.style.setProperty('--corruption-intensity', effects.visualIntensity);
        fragment.style.setProperty('--corruption-level', corruptionLevel);
        
        console.log(`[CorruptionProgression] Applied ${corruptionTier} corruption (${corruptionLevel.toFixed(3)}) to fragment`);
    }
    
    /**
     * Applies character-level text corruption
     * @private
     */
    applyTextCorruption(text, corruptionLevel, effects) {
        if (corruptionLevel <= 0) return text;
        
        const rng = createSeededRandom(text.length + Math.floor(corruptionLevel * 1000));
        let corrupted = text;
        
        // Character replacement corruption
        if (rng.next() < effects.charReplace) {
            const replaceCount = Math.floor(text.length * effects.charReplace * corruptionLevel);
            for (let i = 0; i < replaceCount; i++) {
                const pos = Math.floor(rng.next() * corrupted.length);
                const glitchChar = this.glitchChars[Math.floor(rng.next() * this.glitchChars.length)];
                corrupted = corrupted.substring(0, pos) + glitchChar + corrupted.substring(pos + 1);
            }
        }
        
        // Truncation corruption
        if (corruptionLevel > 0.3 && rng.next() < effects.truncation) {
            const truncateAt = Math.floor(corrupted.length * (0.4 + rng.next() * 0.4));
            corrupted = corrupted.substring(0, truncateAt) + '...';
        }
        
        // Entity corruption
        if (rng.next() < effects.entity) {
            const entities = ['&#x2620;', '&#x2622;', '&#x26A0;', '&#x2639;'];
            const entity = entities[Math.floor(rng.next() * entities.length)];
            const insertAt = Math.floor(rng.next() * corrupted.length);
            corrupted = corrupted.substring(0, insertAt) + entity + corrupted.substring(insertAt);
        }
        
        return corrupted;
    }
    
    /**
     * Applies CSS corruption classes for visual effects
     * @private
     */
    applyCorruptionClasses(fragment, tier, intensity) {
        // Remove existing corruption classes
        fragment.classList.remove('corrupted-minimal', 'corrupted-moderate', 'corrupted-severe', 'corrupted-complete');
        fragment.classList.remove('corrupted-text', 'zalgo', 'chromatic-aberration', 'digital-noise');
        
        // Add tier-specific class
        fragment.classList.add(`corrupted-${tier}`);
        
        // Add progressive effect classes
        if (intensity >= 0.3) {
            fragment.classList.add('corrupted-text');
        }
        
        if (intensity >= 0.5) {
            fragment.classList.add('chromatic-aberration');
        }
        
        if (intensity >= 0.7) {
            fragment.classList.add('zalgo');
        }
        
        if (intensity >= 0.9) {
            fragment.classList.add('digital-noise');
        }
    }
    
    /**
     * Purifies fragments on successful recognition
     * Requirement 4.4: Purification effects for successful recognition
     */
    purifyOnRecognition(fragments) {
        if (!Array.isArray(fragments)) {
            fragments = [fragments];
        }
        
        let purifiedCount = 0;
        
        fragments.forEach(fragment => {
            if (!fragment || !fragment.dataset) return;
            
            const fragmentId = fragment.dataset.birthTime || fragment.dataset.fragmentId;
            const corruptionData = this.fragmentCorruption.get(fragmentId);
            
            if (!corruptionData) return;
            
            // Apply purification
            const purificationAmount = this.config.purificationStrength;
            const oldCorruption = corruptionData.corruptionLevel;
            
            corruptionData.corruptionLevel = Math.max(0, corruptionData.corruptionLevel - purificationAmount);
            corruptionData.lastUpdate = Date.now();
            
            // Apply purification visual effects
            this.applyPurificationEffects(fragment, corruptionData);
            
            // Update visual corruption
            this.applyVisualCorruption(fragment, corruptionData);
            
            purifiedCount++;
            
            // Record purification event
            consciousness.recordEvent('fragment_purified_on_recognition', {
                fragmentId: fragmentId,
                oldCorruption: oldCorruption,
                newCorruption: corruptionData.corruptionLevel,
                purificationAmount: purificationAmount,
                timestamp: Date.now()
            });
            
            console.log(`[CorruptionProgression] Fragment ${fragmentId} purified: ${oldCorruption.toFixed(3)} -> ${corruptionData.corruptionLevel.toFixed(3)}`);
        });
        
        // Record overall purification event
        consciousness.recordEvent('recognition_purification_complete', {
            fragmentsPurified: purifiedCount,
            totalFragments: fragments.length,
            timestamp: Date.now()
        });
        
        return purifiedCount;
    }
    
    /**
     * Applies visual purification effects
     * @private
     */
    applyPurificationEffects(fragment, corruptionData) {
        // Add purification animation class
        fragment.classList.add('purification-effect');
        
        // Set up purification animation
        fragment.style.setProperty('--purification-intensity', '1.0');
        
        // Remove purification effect after animation
        setTimeout(() => {
            fragment.classList.remove('purification-effect');
            fragment.style.removeProperty('--purification-intensity');
        }, 2000);
        
        // Restore some original content if heavily corrupted
        if (corruptionData.corruptionLevel < 0.3 && corruptionData.originalContent !== corruptionData.currentContent) {
            // Gradually restore original content
            const restorationRatio = 1 - (corruptionData.corruptionLevel / 0.3);
            const originalLength = corruptionData.originalContent.length;
            const restoreLength = Math.floor(originalLength * restorationRatio);
            
            if (restoreLength > corruptionData.currentContent.length) {
                corruptionData.currentContent = corruptionData.originalContent.substring(0, restoreLength);
                fragment.textContent = corruptionData.currentContent;
            }
        }
    }
    
    /**
     * Synchronizes corruption with audio degradation level
     * Requirement 5.1: Synchronized audio-visual degradation
     */
    syncWithAudioDegradation(audioLevel) {
        const numericAudioLevel = this.parseAudioLevel(audioLevel);
        
        // Check if sync is needed
        const levelDifference = Math.abs(numericAudioLevel - this.lastAudioDegradationLevel);
        if (levelDifference < this.config.syncThreshold) {
            return; // No significant change
        }
        
        this.lastAudioDegradationLevel = numericAudioLevel;
        
        // Update global corruption level to match audio
        this.globalCorruptionLevel = numericAudioLevel;
        
        // Apply sync to all active fragments
        this.fragmentCorruption.forEach((corruptionData, fragmentId) => {
            if (!corruptionData.element || !corruptionData.element.parentNode) {
                // Fragment no longer exists, clean up
                this.fragmentCorruption.delete(fragmentId);
                return;
            }
            
            // Adjust fragment corruption to sync with audio
            const targetCorruption = numericAudioLevel;
            const currentCorruption = corruptionData.corruptionLevel;
            
            // Smooth transition towards target
            const syncRate = 0.1; // How quickly to sync
            const newCorruption = currentCorruption + (targetCorruption - currentCorruption) * syncRate;
            
            corruptionData.corruptionLevel = Math.max(0, Math.min(1, newCorruption));
            corruptionData.lastUpdate = Date.now();
            
            // Apply updated visual corruption
            this.applyVisualCorruption(corruptionData.element, corruptionData);
        });
        
        // Record sync event
        consciousness.recordEvent('corruption_synced_with_audio', {
            audioLevel: audioLevel,
            numericLevel: numericAudioLevel,
            fragmentsUpdated: this.fragmentCorruption.size,
            timestamp: Date.now()
        });
        
        console.log(`[CorruptionProgression] Synced corruption with audio level: ${audioLevel} (${numericAudioLevel.toFixed(3)})`);
    }
    
    /**
     * Parses audio degradation level to numeric value
     * @private
     */
    parseAudioLevel(audioLevel) {
        if (typeof audioLevel === 'number') {
            return Math.max(0, Math.min(1, audioLevel));
        }
        
        const levelMap = {
            'minimal': 0.2,
            'moderate': 0.5,
            'severe': 0.8,
            'complete': 1.0
        };
        
        return levelMap[audioLevel] || 0.2;
    }
    
    /**
     * Starts the corruption progression timer
     * @private
     */
    startCorruptionTimer() {
        const updateInterval = 1000; // Update every second
        
        const corruptionTimer = setInterval(() => {
            if (this.fragmentCorruption.size === 0) {
                return; // No fragments to update
            }
            
            // Get current karma state
            const karmaState = consciousness.getState('karma') || {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            };
            
            // Update all active fragments
            this.fragmentCorruption.forEach((corruptionData, fragmentId) => {
                if (!corruptionData.element || !corruptionData.element.parentNode) {
                    // Fragment no longer exists, clean up
                    this.fragmentCorruption.delete(fragmentId);
                    return;
                }
                
                this.applyProgressiveCorruption(corruptionData.element, karmaState);
            });
            
        }, updateInterval);
        
        // Register for cleanup
        this.guardian.register(corruptionTimer, (timer) => clearInterval(timer));
        
        console.log('[CorruptionProgression] Corruption timer started');
    }
    
    /**
     * Removes fragment from corruption tracking
     */
    removeFragment(fragmentId) {
        if (this.fragmentCorruption.has(fragmentId)) {
            this.fragmentCorruption.delete(fragmentId);
            console.log(`[CorruptionProgression] Removed fragment ${fragmentId} from corruption tracking`);
        }
    }
    
    /**
     * Gets corruption statistics
     */
    getCorruptionStats() {
        const fragments = Array.from(this.fragmentCorruption.values());
        
        if (fragments.length === 0) {
            return {
                totalFragments: 0,
                averageCorruption: 0,
                maxCorruption: 0,
                minCorruption: 0,
                globalLevel: this.globalCorruptionLevel
            };
        }
        
        const corruptionLevels = fragments.map(f => f.corruptionLevel);
        
        return {
            totalFragments: fragments.length,
            averageCorruption: corruptionLevels.reduce((a, b) => a + b, 0) / corruptionLevels.length,
            maxCorruption: Math.max(...corruptionLevels),
            minCorruption: Math.min(...corruptionLevels),
            globalLevel: this.globalCorruptionLevel
        };
    }
    
    /**
     * Cleanup method
     */
    destroy() {
        console.log('[CorruptionProgression] Destroying corruption progression system...');
        
        // Clear all fragment corruption data
        this.fragmentCorruption.clear();
        
        // Cleanup resources
        this.guardian.cleanupAll();
        
        console.log('[CorruptionProgression] Destroyed');
    }
}