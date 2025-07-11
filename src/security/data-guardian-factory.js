// Factory pattern to break circular dependency
console.log('[DataGuardianFactory] Module loading...');
import { DataFlowGuardian } from './data-flow-guardian.js';
console.log('[DataGuardianFactory] DataFlowGuardian imported');

export class DataGuardianFactory {
    static createGuardian() {
        console.log('[DataGuardianFactory] Creating guardian...');
        const guardian = new DataFlowGuardian();
        console.log('[DataGuardianFactory] Guardian created from DataFlowGuardian class');
        return guardian;
    }
}
