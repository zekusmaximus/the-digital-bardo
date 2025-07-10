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
        end: 6500     // ms after light manifestation starts (3-second window)
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
     */
    glitchPrompts: [
        "CONTINUE TO NEXT LIFE? Y/N",
        "继续下一世？是/否",
        "次の人生へ？はい/いいえ",
        "СЛЕДУЮЩАЯ ЖИЗНЬ? ДА/НЕТ",
        "CONTINUER VERS LA VIE SUIVANTE? O/N"
    ]
};