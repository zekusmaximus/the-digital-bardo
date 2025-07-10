// src/security/data-flow-guardian.js
import { DataGuardianFactory } from './data-guardian-factory.js';

const guardian = DataGuardianFactory.createGuardian();

export function initializeDataGuardian(consciousnessInstance) {
    guardian.initializeWithConsciousness(consciousnessInstance);
}

export function logDataFlow(source, destination, data) {
    guardian.logDataFlow(source, destination, data);
}

export function auditDataBoundaries() {
    guardian.auditDataBoundaries();
}

export { guardian as dataGuardian };
