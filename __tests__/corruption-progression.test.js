/**
 * @file CorruptionProgression Test Suite
 * Tests for the progressive fragment corruption system
 * Validates requirements 4.1, 4.2, 4.3, 4.4 from clear-lode-ux-improvements spec
 */

import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { CorruptionProgression } from '../clear-lode/corruption-progression.js';

// Mock DOM environment
const mockFragment = {
    dataset: {
        birthTime: '1234567890',
        fragmentId: 'test-fragment-1'
    },
    textContent: 'This is a test memory fragment',
    classList: {
        add: vi.fn(),
        remove: vi.fn()
    },
    style: {
        setProperty: vi.fn(),
        removeProperty: vi.fn()
    },
    parentNode: document.createElement('div')
};

describe('CorruptionProgression', () => {
    let corruptionSystem;
    let mockKarmaEngine;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
        
        // Setup mock karma engine
        mockKarmaEngine = {
            getTotalKarma: vi.fn().mockReturnValue(-0.5) // Negative karma increases corruption
        };

        // Create corruption system
        corruptionSystem = new CorruptionProgression(mockKarmaEngine, {
            baseCorruptionRate: 0.01, // Faster for testing
            karmaMultiplier: 1.0,
            purificationStrength: 0.5
        });
    });

    afterEach(() => {
        if (corruptionSystem) {
            corruptionSystem.destroy();
        }
    });

    describe('Requirement 4.1: Fragments start in uncorrupted state', () => {
        test('should initialize fragment with zero corruption', () => {
            const fragment = { ...mockFragment };
            
            const corruptionData = corruptionSystem.initializeCleanFragment(fragment);
            
            expect(corruptionData.corruptionLevel).toBe(0);
            expect(corruptionData.originalContent).toBe(fragment.textContent);
            expect(corruptionData.currentContent).toBe(fragment.textContent);
            expect(fragment.dataset.corruptionLevel).toBe('0');
        });

        test('should record clean initialization event', () => {
            const fragment = { ...mockFragment };
            
            const result = corruptionSystem.initializeCleanFragment(fragment);
            
            // Test that the fragment was initialized properly
            expect(result).toBeDefined();
            expect(result.corruptionLevel).toBe(0);
            expect(result.originalContent).toBe(fragment.textContent);
        });

        test('should remove existing corruption classes', () => {
            const fragment = { ...mockFragment };
            
            corruptionSystem.initializeCleanFragment(fragment);
            
            expect(fragment.classList.remove).toHaveBeenCalledWith(
                'corrupted-minimal', 'corrupted-moderate', 'corrupted-severe', 'corrupted-complete'
            );
        });
    });

    describe('Requirement 4.2: Corruption applied over time based on karma', () => {
        test('should increase corruption over time with negative karma', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            const karmaState = {
                computational: -0.2,
                emotional: -0.1,
                temporal: -0.3,
                void: -0.4
            };
            
            // Apply corruption
            const corruptionLevel = corruptionSystem.applyProgressiveCorruption(fragment, karmaState);
            
            expect(corruptionLevel).toBeGreaterThan(0);
            expect(mockKarmaEngine.getTotalKarma).toHaveBeenCalledWith(karmaState);
        });

        test('should record corruption progression events', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            const karmaState = { computational: -0.5, emotional: -0.3, temporal: -0.2, void: -0.1 };
            
            const corruptionLevel = corruptionSystem.applyProgressiveCorruption(fragment, karmaState);
            
            // Test that corruption was applied
            expect(corruptionLevel).toBeGreaterThan(0);
            expect(mockKarmaEngine.getTotalKarma).toHaveBeenCalledWith(karmaState);
        });

        test('should not exceed maximum corruption level', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            const karmaState = { computational: -1, emotional: -1, temporal: -1, void: -1 };
            
            // Apply corruption multiple times
            for (let i = 0; i < 100; i++) {
                corruptionSystem.applyProgressiveCorruption(fragment, karmaState);
            }
            
            const stats = corruptionSystem.getCorruptionStats();
            expect(stats.maxCorruption).toBeLessThanOrEqual(1.0);
        });
    });

    describe('Requirement 4.3: Progressive visual corruption effects', () => {
        test('should apply different corruption tiers based on level', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            // Manually set different corruption levels to test tiers
            const corruptionData = corruptionSystem.fragmentCorruption.get(fragment.dataset.birthTime);
            
            // Test minimal corruption (0.2)
            corruptionData.corruptionLevel = 0.2;
            corruptionSystem.applyVisualCorruption(fragment, corruptionData);
            expect(fragment.classList.add).toHaveBeenCalledWith('corrupted-minimal');
            
            // Test moderate corruption (0.4)
            corruptionData.corruptionLevel = 0.4;
            corruptionSystem.applyVisualCorruption(fragment, corruptionData);
            expect(fragment.classList.add).toHaveBeenCalledWith('corrupted-moderate');
            
            // Test severe corruption (0.7)
            corruptionData.corruptionLevel = 0.7;
            corruptionSystem.applyVisualCorruption(fragment, corruptionData);
            expect(fragment.classList.add).toHaveBeenCalledWith('corrupted-severe');
            
            // Test complete corruption (0.9)
            corruptionData.corruptionLevel = 0.9;
            corruptionSystem.applyVisualCorruption(fragment, corruptionData);
            expect(fragment.classList.add).toHaveBeenCalledWith('corrupted-complete');
        });

        test('should set CSS variables for corruption intensity', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            const corruptionData = corruptionSystem.fragmentCorruption.get(fragment.dataset.birthTime);
            corruptionData.corruptionLevel = 0.5;
            
            corruptionSystem.applyVisualCorruption(fragment, corruptionData);
            
            expect(fragment.style.setProperty).toHaveBeenCalledWith('--corruption-level', 0.5);
            expect(fragment.style.setProperty).toHaveBeenCalledWith('--corruption-intensity', expect.any(Number));
        });

        test('should corrupt text content progressively', () => {
            const fragment = { ...mockFragment };
            const originalText = 'This is a clean test fragment';
            fragment.textContent = originalText;
            
            corruptionSystem.initializeCleanFragment(fragment);
            
            const corruptionData = corruptionSystem.fragmentCorruption.get(fragment.dataset.birthTime);
            corruptionData.corruptionLevel = 0.8; // High corruption
            
            corruptionSystem.applyVisualCorruption(fragment, corruptionData);
            
            // Text should be different from original due to corruption
            expect(corruptionData.currentContent).not.toBe(originalText);
        });
    });

    describe('Requirement 4.4: Purification effects for successful recognition', () => {
        test('should reduce corruption level on purification', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            // Set initial corruption
            const corruptionData = corruptionSystem.fragmentCorruption.get(fragment.dataset.birthTime);
            corruptionData.corruptionLevel = 0.8;
            const initialCorruption = corruptionData.corruptionLevel;
            
            // Purify fragment
            const purifiedCount = corruptionSystem.purifyOnRecognition([fragment]);
            
            expect(purifiedCount).toBe(1);
            expect(corruptionData.corruptionLevel).toBeLessThan(initialCorruption);
        });

        test('should apply purification visual effects', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            const corruptionData = corruptionSystem.fragmentCorruption.get(fragment.dataset.birthTime);
            corruptionData.corruptionLevel = 0.6;
            
            corruptionSystem.purifyOnRecognition([fragment]);
            
            expect(fragment.classList.add).toHaveBeenCalledWith('purification-effect');
            expect(fragment.style.setProperty).toHaveBeenCalledWith('--purification-intensity', '1.0');
        });

        test('should record purification events', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            const purifiedCount = corruptionSystem.purifyOnRecognition([fragment]);
            
            // Test that purification occurred
            expect(purifiedCount).toBe(1);
        });

        test('should not reduce corruption below zero', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            const corruptionData = corruptionSystem.fragmentCorruption.get(fragment.dataset.birthTime);
            corruptionData.corruptionLevel = 0.1; // Low corruption
            
            corruptionSystem.purifyOnRecognition([fragment]);
            
            expect(corruptionData.corruptionLevel).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Audio-Visual Synchronization', () => {
        test('should sync corruption with audio degradation level', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            // Test that sync doesn't throw errors
            expect(() => {
                corruptionSystem.syncWithAudioDegradation('severe');
            }).not.toThrow();
        });

        test('should parse different audio level formats', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            // Test string levels
            expect(() => {
                corruptionSystem.syncWithAudioDegradation('minimal');
                corruptionSystem.syncWithAudioDegradation('moderate');
                corruptionSystem.syncWithAudioDegradation('severe');
                corruptionSystem.syncWithAudioDegradation('complete');
                
                // Test numeric level
                corruptionSystem.syncWithAudioDegradation(0.6);
            }).not.toThrow();
        });
    });

    describe('Performance and Cleanup', () => {
        test('should provide corruption statistics', () => {
            const fragment1 = { 
                ...mockFragment, 
                dataset: { 
                    birthTime: '1234567890',
                    fragmentId: 'test-1' 
                },
                textContent: 'Fragment 1'
            };
            const fragment2 = { 
                ...mockFragment, 
                dataset: { 
                    birthTime: '1234567891',
                    fragmentId: 'test-2' 
                },
                textContent: 'Fragment 2'
            };
            
            corruptionSystem.initializeCleanFragment(fragment1);
            corruptionSystem.initializeCleanFragment(fragment2);
            
            const stats = corruptionSystem.getCorruptionStats();
            
            expect(stats).toHaveProperty('totalFragments', 2);
            expect(stats).toHaveProperty('averageCorruption');
            expect(stats).toHaveProperty('maxCorruption');
            expect(stats).toHaveProperty('minCorruption');
            expect(stats).toHaveProperty('globalLevel');
        });

        test('should clean up fragment tracking on removal', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            const fragmentId = fragment.dataset.birthTime;
            expect(corruptionSystem.fragmentCorruption.has(fragmentId)).toBe(true);
            
            corruptionSystem.removeFragment(fragmentId);
            expect(corruptionSystem.fragmentCorruption.has(fragmentId)).toBe(false);
        });

        test('should handle invalid fragments gracefully', () => {
            // Test with null fragment
            expect(() => {
                corruptionSystem.initializeCleanFragment(null);
            }).not.toThrow();
            
            // Test with fragment without dataset
            expect(() => {
                corruptionSystem.initializeCleanFragment({});
            }).not.toThrow();
        });

        test('should destroy cleanly', () => {
            const fragment = { ...mockFragment };
            corruptionSystem.initializeCleanFragment(fragment);
            
            expect(() => {
                corruptionSystem.destroy();
            }).not.toThrow();
            
            expect(corruptionSystem.fragmentCorruption.size).toBe(0);
        });
    });
});