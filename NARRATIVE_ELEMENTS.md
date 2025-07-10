# Narrative Elements Documentation

This document outlines the core narrative-driven technical systems implemented in Phase 1 of "The Digital Bardo."

## The Medium is the Metaphysics
Our guiding principle is that every technical choice must serve the narrative. The code is not merely a functional substrate; it is a storytelling medium. The user's journey through the bardo is shaped by how they interact with the system's mechanics, and their choices have tangible, karmic consequences that are reflected in the experience itself.

## 1. Digital Memory Fragments

- **File:** `clear-lode/fragment-generator.js`
- **Concept:** The generic "thought fragments" have been replaced with `DIGITAL_MEMORIES`. These are thematically categorized snippets of a dissolving digital consciousness, representing a life lived online.
- **Implementation:**
    - The `DIGITAL_MEMORIES` object holds categorized memory templates (e.g., `browserHistory`, `unfinishedCommunication`, `technicalDebt`).
    - The `generateLastThought()` function selects a memory based on the current karma state. For example, high `computational` karma might surface more `technicalDebt` fragments.
    - The selected memory is passed to `applyCorruption()`, which applies a visual glitch effect whose intensity is determined by the `degradationLevel`.

## 2. Recognition Methods

- **File:** `clear-lode/recognition-handler.js`
- **Concept:** Recognition of the Clear Light is no longer a simple click. It is a multi-faceted challenge requiring specific, mindful actions, each tied to a Buddhist concept.
- **Implementation:**
    - **Center Click:** The original method. The user must click the precise center of the light, representing the discovery of the center of existence.
    - **Keyword Typing:** The user must type a sacred word ('RECOGNIZE', 'SELF', 'HOME'), mirroring the use of a mantra. A buffer tracks recent key presses.
    - **Spacebar Hold:** The user must hold the spacebar for a "sweet spot" duration of 3000ms ± 200ms, representing mindful breath control at the moment of dissolution.
    - **Visual Feedback:** A hint system (`showRecognitionHints()`) cycles through clues for all three methods. A progress bar provides real-time feedback for the spacebar hold.

## 3. Multilingual Glitch Prompt

- **File:** `clear-lode/degradation-system.js`
- **Concept:** When recognition fails, the choice to continue is presented as a disorienting, multilingual, and decaying prompt, representing the fracturing of the soul.
- **Implementation:**
    - `startGlitchSequence()` reads prompts from the `glitchPrompts` array in `clear-lode/orchestrator.js`.
    - `setInterval` cycles through the languages, increasing the `corruptionLevel` with each iteration.
    - `applyTextCorruption()` is a new character-level corruption function that randomly replaces characters with glitch symbols based on the corruption level.
    - `handleChoiceSelection()` maps inputs from various languages (e.g., 'y', '是', 'はい', 'д', 'o') to a unified 'yes' or 'no' choice, recording a karma event with varying impact based on the answer.

## 4. Karma-Driven Audio Degradation

- **File:** `clear-lode/audio-engine.js`
- **File:** `audio-worklets/noise-processor.js`
- **Concept:** The audio is a direct reflection of the user's karmic state. The soundscape is not static but a living, breathing representation of the soul's current condition.
- **Implementation:**
    - The `ClearLodeAudio` engine now subscribes to the central `consciousness` state.
    - **`updateAudioFromKarma(karmaState)`:** This new core function translates karma into audio parameters in real-time:
        - **Computational Karma:** Affects pitch stability. Higher karma introduces more vibrato and makes the core tone less precise.
        - **Emotional Karma:** Affects harmonic richness. Higher karma adds more harmonic overtones, making the sound more complex or cacophonous.
        - **Void Karma:** Directly controls the volume of the background static. This is handled by posting messages to the `noise-processor.js` worklet, which now adjusts its output based on a `noiseLevel` property.
    - **`respondToKarmaEvent(event)`:** Triggers immediate, noticeable audio cues for critical events, such as a clear chime for a successful recognition (`recognition_achieved`) or a burst of static when an attachment is formed (`attachment_formed`).