// src/security/security-test-suite.js

import { manifestElement, purifyAndSetText } from './consciousness-purification.js';
import { createKarmicValidator, thoughtFragmentSchema, karmaEventSchema, audioParamsSchema, mouseEventSchema, keyboardEventSchema } from './karmic-validation.js';

// Mock DOM for testing
document.body.innerHTML = `
    <div id="test-container"></div>
    <div id="fragment-field"></div>
    <div class="light-core"></div>
`;

function runTest(name, testFn) {
    try {
        testFn();
        console.log(`✅ [PASS] ${name}`);
        return true;
    } catch (error) {
        console.error(`❌ [FAIL] ${name}`, error);
        return false;
    }
}

console.log("--- Running Security Test Suite ---");

// --- Task 1: XSS Vulnerability Tests ---
runTest("purifyAndSetText should prevent HTML injection", () => {
    const el = document.getElementById('test-container');
    const maliciousText = 'Hello <script>alert("XSS")</script> World';
    purifyAndSetText(el, maliciousText);
    if (el.textContent !== maliciousText || el.innerHTML.includes('<script>')) {
        throw new Error("textContent was not set correctly or script tag was found.");
    }
});

runTest("manifestElement should create a safe element without innerHTML", () => {
    const el = manifestElement('div', {
        attributes: { id: 'test-div', class: 'test-class' },
        textContent: 'Safe Text'
    });
    if (el.tagName !== 'DIV' || el.id !== 'test-div' || el.textContent !== 'Safe Text') {
        throw new Error("Element was not manifested correctly.");
    }
});

// --- Task 2: Input Validation Tests ---
runTest("thoughtFragmentSchema should validate correct fragments", () => {
    const validator = createKarmicValidator(thoughtFragmentSchema);
    if (!validator({ content: "This is a valid thought." })) {
        throw new Error("Valid thought fragment failed validation.");
    }
});

runTest("thoughtFragmentSchema should invalidate fragments with HTML", () => {
    const validator = createKarmicValidator(thoughtFragmentSchema);
    if (validator({ content: "This is a <p>malicious</p> thought." })) {
        throw new Error("Thought fragment with HTML passed validation.");
    }
});


runTest("karmaEventSchema should validate correct karma events", () => {
    const validator = createKarmicValidator(karmaEventSchema);
    const validEvent = { action: 'recognition_achieved', context: { timeToDecision: 4000 } };
    if (!validator(validEvent)) {
        throw new Error("Valid karma event failed validation.");
    }
});

runTest("audioParamsSchema should validate correct audio parameters", () => {
    const validator = createKarmicValidator(audioParamsSchema);
    if (!validator({ frequency: 440, gain: 0.5 })) {
        throw new Error("Valid audio parameters failed validation.");
    }
});

runTest("audioParamsSchema should invalidate out-of-range audio parameters", () => {
    const validator = createKarmicValidator(audioParamsSchema);
    if (validator({ frequency: 30000, gain: 1.1 })) {
        throw new Error("Invalid audio parameters passed validation.");
    }
});

runTest("mouseEventSchema should validate correct mouse events", () => {
    const validator = createKarmicValidator(mouseEventSchema);
    if(!validator({ clientX: 100, clientY: 200 })) {
        throw new Error("Valid mouse event failed validation.")
    }
});

runTest("keyboardEventSchema should validate correct keyboard events", () => {
    const validator = createKarmicValidator(keyboardEventSchema);
    if(!validator({ key: 'a' })) {
        throw new Error("Valid keyboard event failed validation.")
    }
});


console.log("--- Security Test Suite Complete ---");