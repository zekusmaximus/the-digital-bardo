// src/security/data-flow-guardian.js
// Provides the DataFlowGuardian class (instantiated by DataGuardianFactory)
// and a thin functional wrapper that the rest of the codebase already uses.
//
// Motivation:
// 1. DataGuardianFactory expects a named export `DataFlowGuardian` from this
//    module (`import { DataFlowGuardian } from './data-flow-guardian.js'`).
//    Without it the module graph fails to instantiate and **no JavaScript
//    executes**, producing the blank screen the user experienced.
// 2. We also expose the old convenience functions (`initializeDataGuardian`,
//    `logDataFlow`, etc.) so that existing imports continue to work.
//
// The class implementation below is deliberately lightweight – the project's
// real data-audit logic can be filled in later without breaking the import
// contract.
class DataFlowGuardian {
  constructor() {
    console.log('[DataFlowGuardian] Constructor called');
    this.consciousness = null;
    this.isLogging = false; // Flag to prevent circular logging
  }

  initializeWithConsciousness(consciousnessInstance) {
    console.log('[DataFlowGuardian] Initializing with consciousness...');
    this.consciousness = consciousnessInstance;
    console.log('[DataFlowGuardian] Initialized successfully');
  }

  logDataFlow(source, destination, data) {
    // Prevent circular logging
    if (this.isLogging) return;
    
    this.isLogging = true;
    console.log('[DataFlowGuardian] logDataFlow called', { source, destination, data: data ?? '(no data)' });
    
    if (!this.consciousness) {
      console.warn('[DataFlowGuardian] Not initialized yet');
      this.isLogging = false;
      return; // not initialized yet
    }
    
    if (window.location.search.includes('debug')) {
      console.debug(
        `[DataFlowGuardian] ${source} ➜ ${destination}`,
        data ?? '(no data)'
      );
    }
    
    this.isLogging = false;
  }

  auditDataBoundaries() {
    console.log('[DataFlowGuardian] auditDataBoundaries called');
    if (!this.consciousness) {
      console.warn('[DataFlowGuardian] Not initialized yet');
      return;
    }
    console.info('[DataFlowGuardian] auditDataBoundaries() not implemented');
  }
}

// Lazily instantiated singleton to avoid eager circular-dependency errors.
let guardianInstance = null;
function getGuardian() {
  if (!guardianInstance) {
    console.log('[DataFlowGuardian] Creating new DataFlowGuardian instance');
    guardianInstance = new DataFlowGuardian();
  }
  return guardianInstance;
}

// Legacy functional API used throughout the codebase
export function initializeDataGuardian(consciousnessInstance) {
  console.log('[DataFlowGuardian] initializeDataGuardian called with:', consciousnessInstance);
  const guardian = getGuardian();
  if (guardian && guardian.initializeWithConsciousness) {
    guardian.initializeWithConsciousness(consciousnessInstance);
  } else {
    console.error('[DataFlowGuardian] Guardian does not have initializeWithConsciousness method');
  }
}

export function logDataFlow(source, destination, data) {
  const guardian = getGuardian();
  if (guardian && guardian.logDataFlow) {
    guardian.logDataFlow(source, destination, data);
  } else {
    console.error('[DataFlowGuardian] Guardian does not have logDataFlow method');
  }
}

export function auditDataBoundaries() {
  const guardian = getGuardian();
  if (guardian && guardian.auditDataBoundaries) {
    guardian.auditDataBoundaries();
  } else {
    console.error('[DataFlowGuardian] Guardian does not have auditDataBoundaries method');
  }
}

// Export the class so DataGuardianFactory can `import { DataFlowGuardian } …`
export { DataFlowGuardian };

// For direct access in debugging
export { guardianInstance as dataGuardian };