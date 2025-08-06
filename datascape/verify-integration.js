/**
 * @file verify-integration.js
 * Quick verification script for Archive integration
 * 
 * This script performs basic import and instantiation tests to ensure
 * all modules are properly connected and can work together.
 */

// Test imports and basic functionality
async function verifyIntegration() {
    console.log('🔮 Archive Integration Verification 🔮');
    console.log('Testing module imports and basic functionality...\n');
    
    let allTestsPassed = true;
    
    try {
        // Test 1: Consciousness system import
        console.log('[1/6] Testing consciousness system import...');
        const { consciousness } = await import('../src/consciousness/digital-soul.js');
        
        if (!consciousness) {
            throw new Error('Consciousness not available');
        }
        
        // Test datascape state access
        const datascapeState = consciousness.getState('datascape');
        if (!datascapeState || typeof datascapeState.attachmentScore === 'undefined') {
            throw new Error('Datascape state schema not found');
        }
        
        console.log('✓ Consciousness system loaded with datascape state schema');
        
    } catch (error) {
        console.error('✗ Consciousness system test failed:', error.message);
        allTestsPassed = false;
    }
    
    try {
        // Test 2: Archive interactions import
        console.log('[2/6] Testing archive interactions import...');
        const { ArchiveInteractionSystem } = await import('./archive-interactions.js');
        
        const interactions = new ArchiveInteractionSystem();
        if (!interactions || typeof interactions.init !== 'function') {
            throw new Error('ArchiveInteractionSystem not properly instantiated');
        }
        
        console.log('✓ Archive interactions system loaded');
        
    } catch (error) {
        console.error('✗ Archive interactions test failed:', error.message);
        allTestsPassed = false;
    }
    
    try {
        // Test 3: Peaceful daemon manifestor import
        console.log('[3/6] Testing peaceful daemon manifestor import...');
        const { PeacefulDaemonManifestor } = await import('./peaceful-daemon-manifestor.js');
        
        const manifestor = new PeacefulDaemonManifestor();
        if (!manifestor || typeof manifestor.init !== 'function') {
            throw new Error('PeacefulDaemonManifestor not properly instantiated');
        }
        
        console.log('✓ Peaceful daemon manifestor loaded');
        
    } catch (error) {
        console.error('✗ Peaceful daemon manifestor test failed:', error.message);
        allTestsPassed = false;
    }
    
    try {
        // Test 4: Memory orb field import
        console.log('[4/6] Testing memory orb field import...');
        const { MemoryOrbField } = await import('./memory-orb-field.js');
        
        const orbField = new MemoryOrbField({ performanceTier: 'medium' });
        if (!orbField || typeof orbField.init !== 'function') {
            throw new Error('MemoryOrbField not properly instantiated');
        }
        
        console.log('✓ Memory orb field loaded');
        
    } catch (error) {
        console.error('✗ Memory orb field test failed:', error.message);
        allTestsPassed = false;
    }
    
    try {
        // Test 5: Archive controller import
        console.log('[5/6] Testing archive controller import...');
        const { ArchiveController } = await import('./archive-controller.js');
        
        const controller = new ArchiveController();
        if (!controller || typeof controller.init !== 'function') {
            throw new Error('ArchiveController not properly instantiated');
        }
        
        // Test configuration access
        if (!controller.config || !controller.config.archive) {
            throw new Error('Archive configuration not found');
        }
        
        console.log('✓ Archive controller loaded with configuration');
        
    } catch (error) {
        console.error('✗ Archive controller test failed:', error.message);
        allTestsPassed = false;
    }
    
    try {
        // Test 6: Integration test
        console.log('[6/6] Testing integrated system instantiation...');
        const { consciousness } = await import('../src/consciousness/digital-soul.js');
        const { ArchiveInteractionSystem } = await import('./archive-interactions.js');
        const { PeacefulDaemonManifestor } = await import('./peaceful-daemon-manifestor.js');
        
        // Create integrated system
        const eventBridge = {
            on: () => {},
            emit: () => {},
            off: () => {}
        };
        
        const interactions = new ArchiveInteractionSystem({
            consciousness: consciousness,
            eventBridge: eventBridge
        });
        
        const manifestor = new PeacefulDaemonManifestor({
            consciousness: consciousness,
            eventBridge: eventBridge,
            archiveSystem: interactions
        });
        
        // Test initialization
        interactions.init();
        manifestor.init();
        
        // Test state integration
        consciousness.setState('datascape.attachmentScore', 42);
        const attachmentScore = interactions.getAttachmentScore();
        
        if (attachmentScore !== 42) {
            throw new Error('State integration not working properly');
        }
        
        // Cleanup
        interactions.destroy();
        manifestor.destroy();
        
        console.log('✓ Integrated system test passed');
        
    } catch (error) {
        console.error('✗ Integration test failed:', error.message);
        allTestsPassed = false;
    }
    
    // Final report
    console.log('\n' + '='.repeat(50));
    if (allTestsPassed) {
        console.log('🎉 ALL VERIFICATION TESTS PASSED!');
        console.log('The Archive system is properly integrated and ready.');
        console.log('');
        console.log('Next steps:');
        console.log('- Open http://localhost:8888/datascape/ to test the Archive');
        console.log('- Open http://localhost:8888/datascape/test-archive-integration.html for comprehensive testing');
    } else {
        console.log('⚠️ Some verification tests failed.');
        console.log('Please check the error messages above and fix any issues.');
    }
    console.log('='.repeat(50));
    
    return allTestsPassed;
}

// Run verification if this script is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    verifyIntegration().catch(console.error);
} else {
    // Browser environment
    window.verifyArchiveIntegration = verifyIntegration;
    
    // Auto-run if called with ?verify
    if (window.location.search.includes('verify')) {
        document.addEventListener('DOMContentLoaded', verifyIntegration);
    }
}

export { verifyIntegration };