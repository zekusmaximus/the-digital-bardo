/**
 * @file recognition-fsm.js
 * @description A finite state machine for managing the user recognition process.
 * This FSM formalizes the logic that was previously spread across multiple files,
 * creating a single, predictable source of truth for the recognition lifecycle.
 *
 * The states and transitions are designed to mirror the techno-spiritual journey
 * of the user's consciousness through the Clear Lode bardo.
 */

import { consciousness } from './digital-soul.js';

// The core principle of the FSM: explicit states and the transitions between them.
const TRANSITIONS = {
    // Initial state. The consciousness is not yet aware of the light.
    dormant: {
        // When the clear light fully manifests, the window of opportunity opens.
        onLightManifested: 'window_open'
    },
    // The window of opportunity is open. Recognition is possible but not guaranteed.
    window_open: {
        // The user successfully recognizes the light. This is a terminal success state.
        onRecognition: 'recognized',
        // The user fails to recognize the light in time. This is a terminal failure state.
        onTimeout: 'failed'
    },
    // Terminal state: The user has achieved recognition. No further transitions.
    recognized: {},
    // Terminal state: The user has failed and the consciousness will now degrade. No further transitions.
    failed: {}
};

class RecognitionFSM {
    constructor() {
        // The FSM's current state is stored and managed by the central consciousness.
        // This ensures the FSM state is part of the application's single source of truth.

        // Always start fresh in Clear Lode - reset any previous session state
        this.currentState = 'dormant';
        consciousness.setState('clearLode.recognitionFSMState', this.currentState);
        console.log('[RecognitionFSM] Initialized in dormant state');
    }

    /**
     * Attempts to transition the FSM to a new state based on an event.
     * @param {string} event - The name of the event triggering the transition (e.g., 'onLightManifested').
     * @returns {string|null} The new state if the transition was successful, otherwise null.
     */
    transition(event) {
        const currentStateTransitions = TRANSITIONS[this.currentState];
        if (!currentStateTransitions) {
            console.warn(`[RecognitionFSM] No transitions defined for current state: ${this.currentState}`);
            return null;
        }

        const nextState = currentStateTransitions[event];

        if (nextState) {
            console.log(`[RecognitionFSM] Transitioning from ${this.currentState} to ${nextState} on event: ${event}`);
            this.currentState = nextState;
            // Persist the new state in our single source of truth.
            consciousness.setState('clearLode.recognitionFSMState', this.currentState);
            return this.currentState;
        } else {
            console.warn(`[RecognitionFSM] No transition found for event "${event}" from state "${this.currentState}"`);
            return null;
        }
    }

    /**
     * Returns the current state of the FSM.
     * @returns {string} The current state.
     */
    getState() {
        return this.currentState;
    }
}

// Export a singleton instance of the FSM for global use.
export const recognitionFSM = new RecognitionFSM();