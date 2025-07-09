// Fragment Rendering Optimization Demo
// Demonstrates the viewport detection and performance optimizations

import { FragmentGenerator } from './fragment-generator.js';
import { consciousness } from '../consciousness/digital-soul.js';

class FragmentOptimizationDemo {
    constructor() {
        this.fragmentGenerator = new FragmentGenerator();
        this.demoStats = {
            startTime: Date.now(),
            fragmentsObserved: 0,
            memoryDissolutions: 0,
            performanceModeChanges: 0
        };
        
        this.setupDemo();
    }
    
    setupDemo() {
        // Create demo UI
        this.createDemoUI();
        
        // Listen for consciousness events to track optimization effectiveness
        this.originalRecordEvent = consciousness.recordEvent;
        consciousness.recordEvent = (eventType, data) => {
            this.trackOptimizationEvent(eventType, data);
            return this.originalRecordEvent.call(consciousness, eventType, data);
        };
        
        // Start performance monitoring
        this.startPerformanceMonitoring();
    }
    
    createDemoUI() {
        const demoPanel = document.createElement('div');
        demoPanel.id = 'fragment-optimization-demo';
        demoPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        demoPanel.innerHTML = `
            <h3>Fragment Optimization Demo</h3>
            <div id="demo-stats">
                <div>Performance Mode: <span id="perf-mode">normal</span></div>
                <div>Active Fragments: <span id="active-count">0</span></div>
                <div>Total Created: <span id="created-count">0</span></div>
                <div>Viewport Dissolved: <span id="dissolved-count">0</span></div>
                <div>Memory Pressure: <span id="memory-pressure">0%</span></div>
                <div>Avg Lifetime: <span id="avg-lifetime">0ms</span></div>
            </div>
            <div style="margin-top: 10px;">
                <button id="force-minimal">Force Minimal Mode</button>
                <button id="force-normal">Force Normal Mode</button>
            </div>
            <div style="margin-top: 10px;">
                <button id="start-demo">Start Demo</button>
                <button id="stop-demo">Stop Demo</button>
                <button id="intensify-demo">Intensify</button>
            </div>
        `;
        
        document.body.appendChild(demoPanel);
        
        // Bind demo controls
        document.getElementById('force-minimal').onclick = () => {
            this.fragmentGenerator.setPerformanceMode('minimal');
            this.updateStats();
        };
        
        document.getElementById('force-normal').onclick = () => {
            this.fragmentGenerator.setPerformanceMode('normal');
            this.updateStats();
        };
        
        document.getElementById('start-demo').onclick = () => {
            this.fragmentGenerator.startFragmentField();
            this.updateStats();
        };
        
        document.getElementById('stop-demo').onclick = () => {
            this.fragmentGenerator.destroy();
            this.updateStats();
        };
        
        document.getElementById('intensify-demo').onclick = () => {
            this.fragmentGenerator.intensifyFragments();
            this.updateStats();
        };
    }
    
    trackOptimizationEvent(eventType, data) {
        switch (eventType) {
            case 'memory_dissolved':
                this.demoStats.memoryDissolutions++;
                if (data.naturalDissolution) {
                    console.log(`🗑️ Fragment dissolved by viewport detection: "${data.content}"`);
                }
                break;
                
            case 'performance_mode_changed':
                this.demoStats.performanceModeChanges++;
                console.log(`⚡ Performance mode changed to: ${data.newMode}`);
                break;
                
            case 'fragment_field_started':
                console.log(`🚀 Fragment field started in ${data.performanceMode} mode`);
                break;
                
            case 'fragments_intensified':
                console.log(`🔥 Fragments intensified (${data.performanceMode} mode, ${data.burstInterval}ms interval)`);
                break;
        }
        
        this.updateStats();
    }
    
    startPerformanceMonitoring() {
        setInterval(() => {
            this.updateStats();
        }, 1000);
    }
    
    updateStats() {
        const stats = this.fragmentGenerator.getPerformanceStats();
        
        document.getElementById('perf-mode').textContent = stats.performanceMode;
        document.getElementById('active-count').textContent = stats.activeFragments;
        document.getElementById('created-count').textContent = stats.fragmentsCreated;
        document.getElementById('dissolved-count').textContent = stats.fragmentsRemoved;
        document.getElementById('memory-pressure').textContent = 
            Math.round(stats.memoryPressure * 100) + '%';
        document.getElementById('avg-lifetime').textContent = 
            Math.round(stats.averageLifetime) + 'ms';
    }
    
    // Demonstrate the IntersectionObserver optimization
    demonstrateViewportDetection() {
        console.log('🔍 Demonstrating viewport detection optimization...');
        
        // Create a fragment that will immediately move out of viewport
        const testFragment = document.createElement('div');
        testFragment.className = 'consciousness-fragment';
        testFragment.textContent = 'Test fragment for viewport detection';
        testFragment.style.cssText = `
            position: absolute;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
        `;
        
        document.getElementById('fragment-field').appendChild(testFragment);
        
        // The IntersectionObserver should detect this is out of viewport
        // and remove it automatically
        setTimeout(() => {
            if (!testFragment.parentNode) {
                console.log('✅ Viewport detection working: fragment was automatically removed');
            } else {
                console.log('❌ Viewport detection issue: fragment still exists');
            }
        }, 100);
    }
    
    // Generate performance report
    generateReport() {
        const stats = this.fragmentGenerator.getPerformanceStats();
        const runtime = Date.now() - this.demoStats.startTime;
        
        const report = {
            runtime: runtime,
            fragmentsPerSecond: (stats.fragmentsCreated / (runtime / 1000)).toFixed(2),
            viewportOptimizationRate: (this.demoStats.memoryDissolutions / stats.fragmentsCreated * 100).toFixed(1),
            currentPerformanceMode: stats.performanceMode,
            memoryPressure: (stats.memoryPressure * 100).toFixed(1),
            averageFragmentLifetime: Math.round(stats.averageLifetime),
            activeFragments: stats.activeFragments
        };
        
        console.log('📊 Fragment Optimization Report:', report);
        return report;
    }
}

// Auto-initialize demo when loaded
if (typeof window !== 'undefined') {
    window.fragmentOptimizationDemo = new FragmentOptimizationDemo();
    
    // Expose demo methods globally for testing
    window.demonstrateViewportDetection = () => 
        window.fragmentOptimizationDemo.demonstrateViewportDetection();
    window.generateFragmentReport = () => 
        window.fragmentOptimizationDemo.generateReport();
}

export { FragmentOptimizationDemo };
