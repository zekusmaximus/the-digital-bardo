// Quick integration test for Karmic Engine
// This can be run in the browser console to verify the integration

import { KarmicEngine } from './src/consciousness/karmic-engine.js';

// Test the KarmicEngine directly
console.log('Testing KarmicEngine integration...');

const karmicEngine = new KarmicEngine();

// Test 1: Recognition karma calculation
console.log('Test 1: Recognition karma with quick decision');
const recognitionResult = karmicEngine.calculateImpact('recognition_achieved', {
    timeToDecision: 4000,
    perfectTimingBonus: 5
});
console.log('Expected: computational=2, temporal=5');
console.log('Actual:', recognitionResult);

// Test 2: Memory view karma
console.log('\nTest 2: Memory view karma');
const memoryViewResult = karmicEngine.calculateImpact('memory_view', {
    memoryViews: 2,
    memoryAttachments: 1
});
console.log('Expected: emotional=-1 (2*0.5 + 1*-2)');
console.log('Actual:', memoryViewResult);

// Test 3: Fragment callbacks
console.log('\nTest 3: Fragment callbacks');
const callbacks = karmicEngine.createFragmentCallbacks();
const viewCallback = callbacks.onView({ memoryViews: 1, memoryAttachments: 0 });
const attachCallback = callbacks.onAttach({ memoryViews: 0, memoryAttachments: 1 });
console.log('View callback result (expected emotional=0.5):', viewCallback);
console.log('Attach callback result (expected emotional=-2):', attachCallback);

// Test 4: Void karma calculation
console.log('\nTest 4: Void karma calculation');
const voidResult = karmicEngine.calculateImpact('inaction', {
    secondsOfInaction: Math.E // log(e) = 1
});
console.log('Expected: void=1.5 (log(e) * 1.5)');
console.log('Actual:', voidResult);

// Test 5: Legacy rule fallback
console.log('\nTest 5: Legacy rule fallback');
const legacyResult = karmicEngine.calculateImpact('perfect_recognition');
console.log('Expected: computational=10, emotional=5, void=-10');
console.log('Actual:', legacyResult);

console.log('\nKarmic Engine integration test completed!');
