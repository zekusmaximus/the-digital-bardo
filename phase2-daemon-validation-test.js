/**
 * PHASE 2 DAEMON MECHANICS VALIDATION TEST
 * 
 * Comprehensive testing suite for the four newly created JavaScript modules:
 * - reputation-metrics.js
 * - memory-fragments.js  
 * - deprecated-functions.js
 * - archive-interactions.js
 * 
 * This test validates functionality, integration, and identifies potential issues.
 */

// Mock DOM environment for Node.js testing
const mockDOM = {
    createElement: (tagName) => ({
        innerHTML: '',
        textContent: '',
        innerText: '',
        classList: {
            add: () => {},
            remove: () => {},
            contains: () => false
        },
        appendChild: () => {},
        outerHTML: ''
    }),
    body: {
        classList: {
            add: () => {},
            remove: () => {},
            contains: () => false
        }
    },
    head: {
        appendChild: () => {}
    },
    querySelectorAll: () => []
};

// Mock document if not available (Node.js environment)
if (typeof document === 'undefined') {
    global.document = mockDOM;
}

// Import all modules
let ReputationMetrics, calculateReputationScore, getReputationClass;
let MemoryFragments, MemoryInteractionHandler;
let DeprecatedFunctions, getAllDeprecatedFunctions, getFunctionsByCategory;
let ArchiveInteractionSystem;

try {
    // Test Module 1: Reputation Metrics
    const reputationModule = await import('./reputation-metrics.js');
    ReputationMetrics = reputationModule.ReputationMetrics;
    calculateReputationScore = reputationModule.calculateReputationScore;
    getReputationClass = reputationModule.getReputationClass;
    console.log("✅ reputation-metrics.js imported successfully");
} catch (error) {
    console.error("❌ Failed to import reputation-metrics.js:", error.message);
}

try {
    // Test Module 2: Memory Fragments
    const memoryModule = await import('./memory-fragments.js');
    MemoryFragments = memoryModule.MemoryFragments;
    MemoryInteractionHandler = memoryModule.MemoryInteractionHandler;
    console.log("✅ memory-fragments.js imported successfully");
} catch (error) {
    console.error("❌ Failed to import memory-fragments.js:", error.message);
}

try {
    // Test Module 3: Deprecated Functions
    const deprecatedModule = await import('./deprecated-functions.js');
    DeprecatedFunctions = deprecatedModule.DeprecatedFunctions;
    getAllDeprecatedFunctions = deprecatedModule.getAllDeprecatedFunctions;
    getFunctionsByCategory = deprecatedModule.getFunctionsByCategory;
    console.log("✅ deprecated-functions.js imported successfully");
} catch (error) {
    console.error("❌ Failed to import deprecated-functions.js:", error.message);
}

try {
    // Test Module 4: Archive Interactions
    const archiveModule = await import('./archive-interactions.js');
    ArchiveInteractionSystem = archiveModule.ArchiveInteractionSystem;
    console.log("✅ archive-interactions.js imported successfully");
} catch (error) {
    console.error("❌ Failed to import archive-interactions.js:", error.message);
}

console.log("\n" + "=".repeat(60));
console.log("PHASE 2 DAEMON MECHANICS VALIDATION RESULTS");
console.log("=".repeat(60));

// Test Results Storage
const testResults = {
    moduleImports: { passed: 0, failed: 0, issues: [] },
    coreFunctionality: { passed: 0, failed: 0, issues: [] },
    integration: { passed: 0, failed: 0, issues: [] },
    errorHandling: { passed: 0, failed: 0, issues: [] },
    narrativeIntegration: { passed: 0, failed: 0, issues: [] }
};

/**
 * TEST SECTION 1: MODULE IMPORT TESTING
 */
console.log("\n1. MODULE IMPORT TESTING");
console.log("-".repeat(30));

function testModuleImports() {
    const tests = [
        { name: "ReputationMetrics export", value: ReputationMetrics, required: true },
        { name: "calculateReputationScore function", value: calculateReputationScore, required: true },
        { name: "getReputationClass function", value: getReputationClass, required: true },
        { name: "MemoryFragments export", value: MemoryFragments, required: true },
        { name: "MemoryInteractionHandler class", value: MemoryInteractionHandler, required: true },
        { name: "DeprecatedFunctions export", value: DeprecatedFunctions, required: true },
        { name: "getAllDeprecatedFunctions function", value: getAllDeprecatedFunctions, required: true },
        { name: "ArchiveInteractionSystem class", value: ArchiveInteractionSystem, required: true }
    ];

    tests.forEach(test => {
        if (test.value !== undefined) {
            console.log(`✅ ${test.name} - Available`);
            testResults.moduleImports.passed++;
        } else {
            console.log(`❌ ${test.name} - Missing`);
            testResults.moduleImports.failed++;
            testResults.moduleImports.issues.push(`Missing export: ${test.name}`);
        }
    });
}

testModuleImports();

/**
 * TEST SECTION 2: CORE FUNCTIONALITY TESTING
 */
console.log("\n2. CORE FUNCTIONALITY TESTING");
console.log("-".repeat(30));

function testCoreFunctionality() {
    // Test reputation score calculation
    try {
        const sampleUserData = {
            creditScore: 750,
            likes: 150,
            shares: 30,
            comments: 75,
            followers: 800,
            connections: 300,
            endorsements: 20,
            jobChanges: 2,
            brandLoyalty: 0.8,
            purchaseFrequency: 3,
            premiumTier: true,
            cookiesAccepted: 90,
            privacyOptOuts: 1,
            dataSharing: 0.9,
            daysSinceLastActivity: 5
        };

        const reputationResult = calculateReputationScore(sampleUserData);
        
        if (reputationResult && typeof reputationResult.finalScore === 'number') {
            console.log(`✅ calculateReputationScore - Score: ${reputationResult.finalScore}, Class: ${reputationResult.classification}`);
            testResults.coreFunctionality.passed++;
        } else {
            console.log("❌ calculateReputationScore - Invalid result structure");
            testResults.coreFunctionality.failed++;
            testResults.coreFunctionality.issues.push("calculateReputationScore returns invalid structure");
        }
    } catch (error) {
        console.log(`❌ calculateReputationScore - Error: ${error.message}`);
        testResults.coreFunctionality.failed++;
        testResults.coreFunctionality.issues.push(`calculateReputationScore error: ${error.message}`);
    }

    // Test memory interaction handler
    try {
        const mockConsciousness = { attachmentScore: 50 };
        const memoryHandler = new MemoryInteractionHandler(mockConsciousness);
        
        const memoryResult = memoryHandler.accessMemory('first_login');
        
        if (memoryResult && memoryResult.success !== undefined) {
            console.log(`✅ MemoryInteractionHandler.accessMemory - Success: ${memoryResult.success}`);
            testResults.coreFunctionality.passed++;
        } else {
            console.log("❌ MemoryInteractionHandler.accessMemory - Invalid result");
            testResults.coreFunctionality.failed++;
            testResults.coreFunctionality.issues.push("MemoryInteractionHandler.accessMemory invalid result");
        }
    } catch (error) {
        console.log(`❌ MemoryInteractionHandler - Error: ${error.message}`);
        testResults.coreFunctionality.failed++;
        testResults.coreFunctionality.issues.push(`MemoryInteractionHandler error: ${error.message}`);
    }

    // Test deprecated functions
    try {
        const allDeprecated = getAllDeprecatedFunctions();
        
        if (Array.isArray(allDeprecated) && allDeprecated.length > 0) {
            console.log(`✅ getAllDeprecatedFunctions - Found ${allDeprecated.length} deprecated functions`);
            testResults.coreFunctionality.passed++;
        } else {
            console.log("❌ getAllDeprecatedFunctions - No functions returned");
            testResults.coreFunctionality.failed++;
            testResults.coreFunctionality.issues.push("getAllDeprecatedFunctions returns empty or invalid array");
        }
    } catch (error) {
        console.log(`❌ getAllDeprecatedFunctions - Error: ${error.message}`);
        testResults.coreFunctionality.failed++;
        testResults.coreFunctionality.issues.push(`getAllDeprecatedFunctions error: ${error.message}`);
    }
}

testCoreFunctionality();

/**
 * TEST SECTION 3: INTEGRATION TESTING
 */
console.log("\n3. INTEGRATION TESTING");
console.log("-".repeat(30));

function testIntegration() {
    try {
        // Test ArchiveInteractionSystem integration
        const archiveSystem = new ArchiveInteractionSystem();
        
        if (archiveSystem.consciousness && archiveSystem.memoryHandler) {
            console.log("✅ ArchiveInteractionSystem - Initialized with consciousness and memory handler");
            testResults.integration.passed++;
        } else {
            console.log("❌ ArchiveInteractionSystem - Missing required components");
            testResults.integration.failed++;
            testResults.integration.issues.push("ArchiveInteractionSystem missing consciousness or memoryHandler");
        }

        // Test deprecated function execution
        const deprecatedResult = archiveSystem.runDeprecatedFunction('phoneCall');
        
        if (deprecatedResult && deprecatedResult.success === false && deprecatedResult.error) {
            console.log(`✅ runDeprecatedFunction - Correctly failed with error: ${deprecatedResult.error.substring(0, 50)}...`);
            testResults.integration.passed++;
        } else {
            console.log("❌ runDeprecatedFunction - Unexpected result structure");
            testResults.integration.failed++;
            testResults.integration.issues.push("runDeprecatedFunction unexpected result structure");
        }

        // Test global state update
        const initialAttachment = archiveSystem.attachmentScore;
        archiveSystem.updateGlobalState();
        
        if (archiveSystem.consciousness.attachmentScore === archiveSystem.attachmentScore) {
            console.log("✅ updateGlobalState - Attachment score synchronized");
            testResults.integration.passed++;
        } else {
            console.log("❌ updateGlobalState - Attachment score not synchronized");
            testResults.integration.failed++;
            testResults.integration.issues.push("updateGlobalState attachment score synchronization failed");
        }

        // Test avoidance mechanics
        const avoidanceResult = archiveSystem.implementAvoidanceMechanics('aversionBonus', { temptationLevel: 1 });
        
        if (avoidanceResult && avoidanceResult.success === true) {
            console.log(`✅ implementAvoidanceMechanics - ${avoidanceResult.message}`);
            testResults.integration.passed++;
        } else {
            console.log("❌ implementAvoidanceMechanics - Failed to execute");
            testResults.integration.failed++;
            testResults.integration.issues.push("implementAvoidanceMechanics execution failed");
        }

    } catch (error) {
        console.log(`❌ Integration testing - Error: ${error.message}`);
        testResults.integration.failed++;
        testResults.integration.issues.push(`Integration testing error: ${error.message}`);
    }
}

testIntegration();

/**
 * TEST SECTION 4: ERROR HANDLING & EDGE CASES
 */
console.log("\n4. ERROR HANDLING & EDGE CASES");
console.log("-".repeat(30));

function testErrorHandling() {
    try {
        // Test with invalid userData
        const invalidReputationResult = calculateReputationScore({});
        console.log(`✅ calculateReputationScore with empty data - Handled gracefully`);
        testResults.errorHandling.passed++;
    } catch (error) {
        console.log(`❌ calculateReputationScore with empty data - Error: ${error.message}`);
        testResults.errorHandling.failed++;
        testResults.errorHandling.issues.push(`calculateReputationScore empty data error: ${error.message}`);
    }

    try {
        // Test memory access with invalid ID
        const archiveSystem = new ArchiveInteractionSystem();
        const invalidMemoryResult = archiveSystem.memoryHandler.accessMemory('nonexistent_memory');
        
        if (invalidMemoryResult && invalidMemoryResult.success === false) {
            console.log(`✅ accessMemory with invalid ID - Handled gracefully`);
            testResults.errorHandling.passed++;
        } else {
            console.log(`❌ accessMemory with invalid ID - Not handled properly`);
            testResults.errorHandling.failed++;
            testResults.errorHandling.issues.push("accessMemory invalid ID not handled properly");
        }
    } catch (error) {
        console.log(`❌ accessMemory with invalid ID - Error: ${error.message}`);
        testResults.errorHandling.failed++;
        testResults.errorHandling.issues.push(`accessMemory invalid ID error: ${error.message}`);
    }

    try {
        // Test deprecated function with invalid skill
        const archiveSystem = new ArchiveInteractionSystem();
        const invalidSkillResult = archiveSystem.runDeprecatedFunction('nonexistentSkill');
        
        if (invalidSkillResult && invalidSkillResult.success === false && invalidSkillResult.error.includes('SKILL_NOT_FOUND')) {
            console.log(`✅ runDeprecatedFunction with invalid skill - Handled gracefully`);
            testResults.errorHandling.passed++;
        } else {
            console.log(`❌ runDeprecatedFunction with invalid skill - Not handled properly`);
            testResults.errorHandling.failed++;
            testResults.errorHandling.issues.push("runDeprecatedFunction invalid skill not handled properly");
        }
    } catch (error) {
        console.log(`❌ runDeprecatedFunction with invalid skill - Error: ${error.message}`);
        testResults.errorHandling.failed++;
        testResults.errorHandling.issues.push(`runDeprecatedFunction invalid skill error: ${error.message}`);
    }
}

testErrorHandling();

/**
 * TEST SECTION 5: NARRATIVE INTEGRATION
 */
console.log("\n5. NARRATIVE INTEGRATION");
console.log("-".repeat(30));

function testNarrativeIntegration() {
    // Test that satirical elements are present
    try {
        const reputationClasses = ['Verified Soul™', 'Priority User', 'Standard Account', 'Shadow Profile', '404 - Identity Not Found'];
        const testScore = 850;
        const classification = getReputationClass(testScore);
        
        if (reputationClasses.includes(classification)) {
            console.log(`✅ Satirical reputation classes - Found: ${classification}`);
            testResults.narrativeIntegration.passed++;
        } else {
            console.log(`❌ Satirical reputation classes - Unexpected: ${classification}`);
            testResults.narrativeIntegration.failed++;
            testResults.narrativeIntegration.issues.push(`Unexpected reputation class: ${classification}`);
        }
    } catch (error) {
        console.log(`❌ Satirical reputation classes - Error: ${error.message}`);
        testResults.narrativeIntegration.failed++;
        testResults.narrativeIntegration.issues.push(`Reputation class error: ${error.message}`);
    }

    // Test memory fragment narrative content
    try {
        if (MemoryFragments.childhood && MemoryFragments.childhood.length > 0) {
            const firstMemory = MemoryFragments.childhood[0];
            if (firstMemory.content && firstMemory.content.includes('digital')) {
                console.log(`✅ Memory fragments contain narrative content`);
                testResults.narrativeIntegration.passed++;
            } else {
                console.log(`❌ Memory fragments lack narrative content`);
                testResults.narrativeIntegration.failed++;
                testResults.narrativeIntegration.issues.push("Memory fragments lack narrative content");
            }
        }
    } catch (error) {
        console.log(`❌ Memory fragments narrative - Error: ${error.message}`);
        testResults.narrativeIntegration.failed++;
        testResults.narrativeIntegration.issues.push(`Memory fragments narrative error: ${error.message}`);
    }

    // Test deprecated function error messages are satirical
    try {
        const archiveSystem = new ArchiveInteractionSystem();
        const phoneCallResult = archiveSystem.runDeprecatedFunction('phoneCall');
        
        if (phoneCallResult.error && phoneCallResult.error.includes('DEPRECATED')) {
            console.log(`✅ Deprecated function errors are appropriately satirical`);
            testResults.narrativeIntegration.passed++;
        } else {
            console.log(`❌ Deprecated function errors lack satirical tone`);
            testResults.narrativeIntegration.failed++;
            testResults.narrativeIntegration.issues.push("Deprecated function errors lack satirical tone");
        }
    } catch (error) {
        console.log(`❌ Deprecated function satirical errors - Error: ${error.message}`);
        testResults.narrativeIntegration.failed++;
        testResults.narrativeIntegration.issues.push(`Deprecated function satirical error: ${error.message}`);
    }
}

testNarrativeIntegration();

/**
 * SAMPLE USER INTERACTION DEMONSTRATION
 */
console.log("\n" + "=".repeat(60));
console.log("SAMPLE USER INTERACTION DEMONSTRATION");
console.log("=".repeat(60));

try {
    const archiveSystem = new ArchiveInteractionSystem();
    
    console.log("\n📊 Initial System Status:");
    const initialStatus = archiveSystem.getSystemStatus();
    console.log(`   Attachment Score: ${initialStatus.attachmentScore}`);
    console.log(`   Liberation Progress: ${initialStatus.liberationProgress}%`);
    console.log(`   Reputation: ${initialStatus.reputation.classification}`);
    
    console.log("\n🔄 Simulating User Interactions:");
    
    // 1. User tries to use deprecated function
    console.log("\n1. User attempts to make a phone call (deprecated function):");
    const phoneResult = archiveSystem.runDeprecatedFunction('phoneCall');
    console.log(`   Result: ${phoneResult.success ? 'Success' : 'Failed'}`);
    console.log(`   Error: ${phoneResult.error?.substring(0, 80)}...`);
    console.log(`   Attachment Impact: +${phoneResult.attachmentImpact}`);
    
    // 2. User accesses a memory
    console.log("\n2. User accesses childhood memory:");
    const memoryResult = archiveSystem.memoryHandler.accessMemory('first_login');
    console.log(`   Result: ${memoryResult.success ? 'Success' : 'Failed'}`);
    console.log(`   View Count: ${memoryResult.viewCount}`);
    console.log(`   Corruption Level: ${Math.round(memoryResult.memory?.corruptionLevel * 100)}%`);
    
    // 3. User practices avoidance
    console.log("\n3. User practices conscious avoidance:");
    const avoidanceResult = archiveSystem.implementAvoidanceMechanics('aversionBonus', { temptationLevel: 1.5 });
    console.log(`   Result: ${avoidanceResult.success ? 'Success' : 'Failed'}`);
    console.log(`   Message: ${avoidanceResult.message}`);
    
    // 4. Final status
    console.log("\n📊 Final System Status:");
    const finalStatus = archiveSystem.getSystemStatus();
    console.log(`   Attachment Score: ${finalStatus.attachmentScore} (${finalStatus.attachmentScore > initialStatus.attachmentScore ? '+' : ''}${Math.round((finalStatus.attachmentScore - initialStatus.attachmentScore) * 100) / 100})`);
    console.log(`   Liberation Progress: ${finalStatus.liberationProgress}%`);
    console.log(`   System Recommendation: ${finalStatus.systemRecommendation}`);
    
    // 5. Liberation attempt
    console.log("\n🕊️ Liberation Attempt:");
    const liberationResult = archiveSystem.attemptLiberation();
    console.log(`   Result: ${liberationResult.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Message: ${liberationResult.message}`);
    
} catch (error) {
    console.log(`❌ Sample interaction demonstration failed: ${error.message}`);
}

/**
 * FINAL VALIDATION REPORT
 */
console.log("\n" + "=".repeat(60));
console.log("FINAL VALIDATION REPORT");
console.log("=".repeat(60));

const totalPassed = Object.values(testResults).reduce((sum, category) => sum + category.passed, 0);
const totalFailed = Object.values(testResults).reduce((sum, category) => sum + category.failed, 0);
const totalTests = totalPassed + totalFailed;

console.log(`\n📈 OVERALL RESULTS:`);
console.log(`   Total Tests: ${totalTests}`);
console.log(`   Passed: ${totalPassed} (${Math.round((totalPassed / totalTests) * 100)}%)`);
console.log(`   Failed: ${totalFailed} (${Math.round((totalFailed / totalTests) * 100)}%)`);

console.log(`\n📊 CATEGORY BREAKDOWN:`);
Object.entries(testResults).forEach(([category, results]) => {
    const categoryTotal = results.passed + results.failed;
    const successRate = categoryTotal > 0 ? Math.round((results.passed / categoryTotal) * 100) : 0;
    console.log(`   ${category}: ${results.passed}/${categoryTotal} (${successRate}%)`);
});

console.log(`\n🚨 IDENTIFIED ISSUES:`);
const allIssues = Object.values(testResults).flatMap(category => category.issues);
if (allIssues.length === 0) {
    console.log(`   No critical issues identified.`);
} else {
    allIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
    });
}

console.log(`\n✅ VALIDATION COMPLETE`);
console.log(`   The four Phase 2 Daemon Mechanics modules have been tested.`);
console.log(`   See detailed results above for any issues requiring attention.`);