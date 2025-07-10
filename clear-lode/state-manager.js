/**
 * @file Manages the state of the Clear Lode experience.
 *
 * This class listens to the core Recognition FSM (Finite State Machine) and
 * translates its state changes into high-level application events, which are
 * broadcast via the event bridge. This decouples the rest of the application
 * from the implementation details of the FSM.
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { recognitionFSM } from '../src/consciousness/recognition-fsm.js';

export class ClearLodeStateManager {
    /**
     * @param {object} dependencies
     * @param {import('./event-bridge.js').ClearLodeEventBridge} dependencies.eventBridge
     * @param {import('../src/consciousness/resource-guardian.js').ResourceGuardian} dependencies.guardian
     */
    constructor({ eventBridge, guardian }) {
        if (!eventBridge || !guardian) {
            throw new Error('StateManager requires an eventBridge and a guardian.');
        }
        /** @private */
        this.eventBridge = eventBridge;
        /** @private */
        this.guardian = guardian;
        /** @private */
        this.isDestroyed = false;
    }

    /**
     * Initializes the state manager by subscribing to the FSM.
     */
    init() {
        console.log('StateManager initializing...');
        const unsubscribe = consciousness.subscribe(
            'clearLode.recognitionFSMState',
            (newState) => this.handleFSMStateChange(newState)
        );

        // Register the unsubscribe function for cleanup when destroy() is called
        this.guardian.registerCleanup(unsubscribe);
        console.log('StateManager initialized and subscribed to FSM.');
    }

    /**
     * Handles state changes from the FSM and emits corresponding events.
     * @private
     * @param {string} newState The new state from the FSM.
     */
    handleFSMStateChange(newState) {
        if (this.isDestroyed) return;

        console.log(`[StateManager] FSM transitioned to: ${newState}. Emitting event.`);
        switch (newState) {
            case 'window_open':
                consciousness.setState('clearLode.recognitionActive', true);
                this.eventBridge.emit('state:recognitionWindowOpened');
                break;
            case 'recognized':
                // The actual recognition data is handled by another system.
                // This just signals that the state transition occurred.
                this.eventBridge.emit('state:recognitionSucceeded');
                break;
            case 'failed':
                consciousness.setState('clearLode.recognitionActive', false);
                this.eventBridge.emit('state:recognitionFailed');
                break;
            default:
                // No action for 'dormant' or other states.
                break;
        }
    }

    /**
     * Triggers the initial FSM transition to start the experience.
     */
    startExperience() {
        console.log('[StateManager] Triggering FSM start...');
        recognitionFSM.transition('onLightManifested');
    }

    /**
     * Triggers the FSM timeout transition.
     */
    triggerTimeout() {
         if (recognitionFSM.getState() === 'window_open') {
            console.log('[StateManager] Triggering FSM timeout...');
            recognitionFSM.transition('onTimeout');
        }
    }


    /**
     * Cleans up resources.
     * The actual cleanup is handled by the ResourceGuardian, this is for consistency.
     */
    destroy() {
        this.isDestroyed = true;
        console.log('StateManager destroyed.');
        // The guardian passed in the constructor will handle the actual cleanup.
    }
}