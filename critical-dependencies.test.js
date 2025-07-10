import { createSeededRandom } from './src/utils/seeded-random.js';
import { applyCorruption } from './clear-lode/fragment-generator.js';
import { DataGuardianFactory } from './src/security/data-guardian-factory.js';
import { DigitalConsciousness } from './src/consciousness/digital-soul.js';

function runTest(name, fn) {
    try {
        fn();
        console.log(`✅ [PASS] ${name}`);
    } catch (err) {
        console.error(`❌ [FAIL] ${name}`, err);
    }
}

runTest('SeededRandom deterministic output', () => {
    const r1 = createSeededRandom(42);
    const r2 = createSeededRandom(42);
    for (let i = 0; i < 5; i++) {
        const a = r1.next();
        const b = r2.next();
        if (a !== b) throw new Error('Outputs diverged');
    }
});

runTest('applyCorruption deterministic with same input', () => {
    const text = 'The quick brown fox';
    const level = 0.6;
    const first = applyCorruption(text, level);
    const second = applyCorruption(text, level);
    if (first !== second) throw new Error('Corruption not deterministic');
});

runTest('DataGuardianFactory initializes and logs', () => {
    const guardian = DataGuardianFactory.createGuardian();
    let recorded = false;
    const mock = { recordEvent: () => { recorded = true; } };
    guardian.initializeWithConsciousness(mock);
    guardian.logDataFlow('test', 'dest', { ok: true });
    if (!recorded) throw new Error('recordEvent not called');
});

runTest('DigitalConsciousness attaches guardian without circular import', () => {
    const dc = new DigitalConsciousness(false);
    if (!dc.dataGuardian) throw new Error('dataGuardian missing');
});
