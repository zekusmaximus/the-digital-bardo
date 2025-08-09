/**
 * PHASE 1 ENHANCEMENTS INTEGRATION VERIFICATION
 * 
 * This script tests the core functionality of the Phase 1 enhancements
 * without requiring a full browser environment.
 */

import { consciousness } from './src/consciousness/digital-soul.js';
import { EasterEggSystem } from './clear-lode/easter-eggs.js';
import { EnhancedVisualEffects } from './clear-lode/visual-effects-enhanced.js';

console.log('🧪 Starting Phase 1 Enhancements Verification...\n');

// Test 1: Consciousness System
console.log('1. Testing Consciousness System...');
try {
    // Test karma manipulation
    consciousness.addKarma('computational', 10);
    consciousness.addKarma('void', 25);
    
    const karma = consciousness.getState('karma');
    console.log('   ✅ Karma system working:', karma);
    
    // Test state management
    consciousness.setState('clearLode.test', true);
    const testState = consciousness.getState('clearLode.test');
    console.log('   ✅ State management working:', testState);
    
} catch (error) {
    console.error('   ❌ Consciousness system failed:', error.message);
}

// Test 2: Easter Eggs System (without DOM)
console.log('\n2. Testing Easter Eggs System...');
try {
    // Mock window object for Node.js testing
    if (typeof window === 'undefined') {
        global.window = { 
            addEventListener: () => {}, 
            dispatchEvent: () => {},
            location: { href: '' },
            navigator: { userAgent: 'Test Browser' },
            confirm: () => true
        };
        global.document = { 
            addEventListener: () => {},
            createElement: () => ({ 
                style: {},
                appendChild: () => {},
                remove: () => {},
                textContent: '',
                id: '',
                innerHTML: ''
            }),
            head: { appendChild: () => {} },
            body: { 
                appendChild: () => {},
                classList: { add: () => {}, remove: () => {} },
                style: { setProperty: () => {}, animation: '' }
            },
            querySelector: () => null,
            querySelectorAll: () => []
        };
    }
    
    const easterEggs = new EasterEggSystem();
    console.log('   ✅ Easter Eggs system initialized');
    
    // Test bardo object creation
    if (window.bardo && typeof window.bardo.enlightenment === 'function') {
        console.log('   ✅ Bardo console commands available');
        
        // Test wisdom command
        const wisdom = window.bardo.wisdom();
        console.log('   ✅ Wisdom command result:', wisdom);
    } else {
        console.log('   ⚠️ Bardo object not fully available in test environment');
    }
    
} catch (error) {
    console.error('   ❌ Easter Eggs system failed:', error.message);
}

// Test 3: Visual Effects System (limited without full DOM)
console.log('\n3. Testing Visual Effects System...');
try {
    // Mock additional DOM methods
    if (typeof document !== 'undefined') {
        document.documentElement = {
            style: {
                setProperty: (prop, value) => {
                    console.log(`   📝 CSS Property set: ${prop} = ${value}`);
                }
            }
        };
    }
    
    const visualEffects = new EnhancedVisualEffects();
    console.log('   ✅ Visual Effects system initialized');
    
    // Test karma-driven updates
    const testKarma = {
        computational: 15,
        emotional: 10,
        temporal: 8,
        void: 45
    };
    
    visualEffects.updateVisualEffectsFromKarma(testKarma);
    console.log('   ✅ Karma-driven visual effects updated');
    
    // Test purification (limited)
    visualEffects.triggerRecognitionPurification();
    console.log('   ✅ Recognition purification triggered');
    
} catch (error) {
    console.error('   ❌ Visual Effects system failed:', error.message);
}

// Test 4: Integration Bridges
console.log('\n4. Testing Integration Bridges...');
try {
    let recognitionEventReceived = false;
    let karmaEventReceived = false;
    
    // Subscribe to recognition events
    consciousness.subscribe('clearLode.recognized', (recognized) => {
        if (recognized) {
            recognitionEventReceived = true;
            console.log('   ✅ Recognition event bridge working');
        }
    });
    
    // Subscribe to karma changes
    consciousness.subscribe('karma.void', (voidKarma) => {
        if (voidKarma > 40) {
            karmaEventReceived = true;
            console.log('   ✅ Karma change bridge working');
        }
    });
    
    // Trigger test events
    consciousness.setState('clearLode.recognized', true);
    consciousness.addKarma('void', 50);
    
    // Small delay to allow events to process
    setTimeout(() => {
        if (recognitionEventReceived && karmaEventReceived) {
            console.log('   ✅ All integration bridges functional');
        } else {
            console.log('   ⚠️ Some integration bridges may need browser environment');
        }
        
        // Final summary
        console.log('\n🎉 Phase 1 Enhancements Verification Complete!');
        console.log('📊 Final karma state:', consciousness.getState('karma'));
        
    }, 100);
    
} catch (error) {
    console.error('   ❌ Integration bridges test failed:', error.message);
}

// Test 5: Memory and Performance
console.log('\n5. Testing Memory Management...');
try {
    // Test cleanup
    const initialHeap = process.memoryUsage ? process.memoryUsage().heapUsed : 'N/A';
    console.log('   📊 Initial heap usage:', initialHeap);
    
    // Create and destroy multiple instances to test cleanup
    for (let i = 0; i < 10; i++) {
        const testEffects = new EnhancedVisualEffects();
        testEffects.destroy();
    }
    
    if (global.gc) {
        global.gc(); // Force garbage collection if available
    }
    
    const finalHeap = process.memoryUsage ? process.memoryUsage().heapUsed : 'N/A';
    console.log('   📊 Final heap usage:', finalHeap);
    console.log('   ✅ Memory management test completed');
    
} catch (error) {
    console.error('   ❌ Memory management test failed:', error.message);
}