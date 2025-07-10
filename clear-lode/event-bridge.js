/**
 * @file Implements a simple, centralized event bridge for the Clear Lode experience.
 *
 * This event bus allows decoupled communication between different subsystems,
 * such as the StateManager, TransitionController, and RecognitionHandler.
 * It follows the Publish/Subscribe pattern.
 */

export class ClearLodeEventBridge {
    constructor() {
        /**
         * A map to store event listeners.
         * The key is the event name, and the value is an array of callback functions.
         * @private
         * @type {Map<string, Array<Function>>}
         */
        this.events = new Map();
    }

    /**
     * Subscribes a callback function to a specific event.
     * @param {string} eventName The name of the event to subscribe to.
     * @param {Function} callback The callback function to execute when the event is emitted.
     */
    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(callback);
    }

    /**
     * Unsubscribes a callback function from a specific event.
     * @param {string} eventName The name of the event to unsubscribe from.
     * @param {Function} callback The callback function to remove.
     */
    off(eventName, callback) {
        if (!this.events.has(eventName)) {
            return;
        }

        const listeners = this.events.get(eventName);
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     * Emits an event, calling all subscribed callbacks with the provided data.
     * @param {string} eventName The name of the event to emit.
     * @param {*} [data] Optional data to pass to the event listeners.
     */
    emit(eventName, data) {
        if (!this.events.has(eventName)) {
            return;
        }

        const listeners = this.events.get(eventName);
        // Create a copy of the listeners array to prevent issues if a listener
        // modifies the original array (e.g., by calling off() on itself).
        [...listeners].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for "${eventName}":`, error);
            }
        });
    }

    /**
     * Cleans up all event listeners.
     */
    destroy() {
        this.events.clear();
        console.log('EventBridge destroyed.');
    }
}