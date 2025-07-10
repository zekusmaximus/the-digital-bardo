/**
 * @file architecture-test-suite.js
 * @description A test suite for verifying the new architectural patterns.
 * This suite includes tests for the new state machine's logic and the resource guardian's cleanup effectiveness.
 */

// Mocking the consciousness module
const mockConsciousness = {
    state: {
        clearLode: {
            recognitionFSMState: 'dormant'
        }
    },
    getState: jest.fn(path => {
        return path.split('.').reduce((acc, part) => acc && acc[part], mockConsciousness.state);
    }),
    setState: jest.fn((path, value) => {
        const parts = path.split('.');
        const last = parts.pop();
        let current = mockConsciousness.state;
        parts.forEach(part => {
            current = current[part] = current[part] || {};
        });
        current[last] = value;
    }),
    subscribe: jest.fn(() => () => {}),
};

jest.mock('./src/consciousness/digital-soul.js', () => ({
    consciousness: mockConsciousness
}));

const { recognitionFSM } = require('./src/consciousness/recognition-fsm.js');
const { ResourceGuardian } = require('./src/consciousness/resource-guardian.js');

describe('Architectural Refactoring Verification', () => {

    describe('Recognition Finite State Machine (FSM)', () => {

        beforeEach(() => {
            // Reset the FSM state before each test
            mockConsciousness.state.clearLode.recognitionFSMState = 'dormant';
        });

        it('should start in the "dormant" state', () => {
            expect(recognitionFSM.getState()).toBe('dormant');
        });

        it('should transition from "dormant" to "window_open" on onLightManifested', () => {
            recognitionFSM.transition('onLightManifested');
            expect(recognitionFSM.getState()).toBe('window_open');
        });

        it('should transition from "window_open" to "recognized" on onRecognition', () => {
            recognitionFSM.transition('onLightManifested');
            recognitionFSM.transition('onRecognition');
            expect(recognitionFSM.getState()).toBe('recognized');
        });

        it('should transition from "window_open" to "failed" on onTimeout', () => {
            recognitionFSM.transition('onLightManifested');
            recognitionFSM.transition('onTimeout');
            expect(recognitionFSM.getState()).toBe('failed');
        });

        it('should not transition from a terminal "recognized" state', () => {
            recognitionFSM.transition('onLightManifested');
            recognitionFSM.transition('onRecognition');
            recognitionFSM.transition('onTimeout');
            expect(recognitionFSM.getState()).toBe('recognized');
        });

        it('should not transition from a terminal "failed" state', () => {
            recognitionFSM.transition('onLightManifested');
            recognitionFSM.transition('onTimeout');
            recognitionFSM.transition('onRecognition');
            expect(recognitionFSM.getState()).toBe('failed');
        });

        it('should warn on an invalid transition', () => {
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
            recognitionFSM.transition('onRecognition');
            expect(recognitionFSM.getState()).toBe('dormant');
            expect(consoleWarnSpy).toHaveBeenCalledWith('[RecognitionFSM] No transition found for event "onRecognition" from state "dormant"');
            consoleWarnSpy.mockRestore();
        });

    });

    describe('Resource Guardian', () => {

        it('should register and clean up a single resource', () => {
            const guardian = new ResourceGuardian();
            const cleanupFn = jest.fn();
            const resource = { id: 1 };

            guardian.register(resource, cleanupFn);
            guardian.cleanupAll();

            expect(cleanupFn).toHaveBeenCalledWith(resource);
            expect(cleanupFn).toHaveBeenCalledTimes(1);
        });

        it('should register and clean up multiple resources', () => {
            const guardian = new ResourceGuardian();
            const cleanupFn1 = jest.fn();
            const cleanupFn2 = jest.fn();
            const resource1 = { id: 1 };
            const resource2 = { id: 2 };

            guardian.register(resource1, cleanupFn1);
            guardian.register(resource2, cleanupFn2);
            guardian.cleanupAll();

            expect(cleanupFn1).toHaveBeenCalledWith(resource1);
            expect(cleanupFn2).toHaveBeenCalledWith(resource2);
            expect(cleanupFn1).toHaveBeenCalledTimes(1);
            expect(cleanupFn2).toHaveBeenCalledTimes(1);
        });

        it('should not allow registration after being destroyed', () => {
            const guardian = new ResourceGuardian();
            const cleanupFn = jest.fn();
            const resource = { id: 1 };

            guardian.cleanupAll();
            guardian.register(resource, cleanupFn);

            expect(cleanupFn).toHaveBeenCalledWith(resource);
        });
        
        it('should be idempotent and only clean up once', () => {
            const guardian = new ResourceGuardian();
            const cleanupFn = jest.fn();
            const resource = { id: 1 };

            guardian.register(resource, cleanupFn);
            guardian.cleanupAll();
            guardian.cleanupAll();

            expect(cleanupFn).toHaveBeenCalledTimes(1);
        });
    });
});