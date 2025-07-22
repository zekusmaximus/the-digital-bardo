/**
 * @file Centralized configuration for the Clear Lode experience.
 *
 * This file externalizes magic numbers and settings to improve maintainability
 * and allow for easier tuning of the experience.
 */

export const CLEAR_LODE_CONFIG = {
    /**
     * Defines the time window for user recognition.
     */
    recognitionWindow: {
        start: 3500,  // ms after light manifestation starts
        end: 18500,   // ms after light manifestation starts (15-second minimum window)
        baseWindowDuration: 15000,  // 15 seconds minimum duration
        extensionDuration: 5000,    // 5 seconds per extension
        maxExtensions: 2,           // Maximum number of extensions allowed
        warningThreshold: 0.75      // Show warning at 75% of time elapsed
    },

    /**
     * Hints displayed to the user to guide them toward recognition.
     */
    hints: [
        "Look deeper...",
        "What do you see?",
        "Recognition is possible...",
        "The source reveals itself...",
        "Click to recognize..."
    ],

    /**
     * Timing for the hint display cycle.
     */
    hintDisplay: {
        delay: 800,       // ms between hints
        fadeDuration: 600 // ms for hint fade-out animation
    },

    /**
     * Multilingual prompts for the degradation sequence choice.
     * These cycle as consciousness fractures across linguistic boundaries.
     */
    glitchPrompts: [
        'Do you wish to continue? [Y/N]',            // English
        '¿Deseas continuar? [S/N]',                  // Spanish
        'Voulez-vous continuer? [O/N]',              // French
        'Möchten Sie fortfahren? [J/N]',             // German
        '続けますか？[はい/いいえ]',                   // Japanese
        'Хотите продолжить? [Д/Н]',                 // Russian
        'هل تريد المتابعة؟ [ن/ل]',                    // Arabic
        '01000011 01101111 01101110 01110100 01101001 01101110 01110101 01100101 00111111', // Binary
        'D○ ¥◊u w∆nt t◊ ¢◊nt∆nu€? [¥/N]'            // Corrupted English
    ]
};