/**
 * THE INCARNATION ENGINE - Final Phase Orchestrator
 * 
 * "Where karma meets bureaucracy, where souls meet spreadsheets,
 * where enlightenment meets enterprise software.
 * 
 * This is the DMV of the afterlife, the corporate performance review
 * of the soul, the Terms of Service for existence itself. Every form
 * field is a meditation on choice, every loading bar a lesson in patience,
 * every error message a koan."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { KarmicAccountant } from './karmic-accountant.js';
import { TermsOfIncarnationGenerator } from './terms-generator.js';
import { IncarnationSelector } from './incarnation-selector.js';
import { BureaucraticUI } from './bureaucratic-ui.js';
import { ProceduralIncarnationGenerator } from './procedural-generator.js';
import { IncarnationAudioEngine } from './audio/incarnation-audio.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class IncarnationEngine {
    constructor() {
        this.consciousness = consciousness;
        this.guardian = new ResourceGuardian();
        this.phase = 'initializing';
        
        // Core systems
        this.accountant = null;
        this.termsGenerator = null;
        this.selector = null;
        this.bureaucraticUI = null;
        this.proceduralGenerator = null;
        this.audioEngine = null;
        
        // State tracking
        this.userChoices = {
            formsCompleted: [],
            termsScrolled: false,
            termsAccepted: false,
            incarnationSelected: null,
            waitingTime: 0,
            queuePosition: Math.floor(Math.random() * 999999) + 1,
            ticketNumber: this.generateTicketNumber()
        };
        
        this.journeyData = this.extractJourneyData();
        this.startTime = Date.now();
        
        // Visual systems
        this.visualTheme = 'corporate-purgatory';
        this.currentStep = 0;
        this.totalSteps = 7; // Excessive bureaucratic steps
        
        console.log('[IncarnationEngine] Bureaucratic nightmare initialized');
    }
    
    /**
     * Extract complete journey data from consciousness
     */
    extractJourneyData() {
        return {
            clearLode: {
                recognized: this.consciousness.getState('clearLode.recognized') || false,
                hesitationTime: this.consciousness.getState('clearLode.hesitationTime') || 0,
                recognitionMethod: this.consciousness.getState('clearLode.recognitionMethod') || 'none',
                degradationLevel: this.consciousness.getState('clearLode.degradationLevel') || 0
            },
            datascape: {
                attachmentPeak: this.consciousness.getState('datascape.attachmentScore') || 0,
                daemonsEncountered: this.consciousness.getState('datascape.daemonsEncountered') || 0,
                sinsAcknowledged: this.consciousness.getState('datascape.sinsAcknowledged') || 0,
                realmVisited: this.consciousness.getState('datascape.currentRealm') || 'none',
                chargesPresented: this.consciousness.getState('datascape.chargesPresented') || false
            },
            karma: this.consciousness.getState('karma') || {
                computational: 0,
                emotional: 0,
                temporal: 0,
                void: 0
            },
            totalTime: Date.now() - (this.consciousness.getState('journeyStartTime') || Date.now()),
            memories: this.consciousness.getState('memories') || []
        };
    }
    
    /**
     * Generate bureaucratic ticket number
     */
    generateTicketNumber() {
        const prefix = 'INC';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        const checksum = (parseInt(timestamp) + parseInt(random)) % 97;
        return `${prefix}-${timestamp}-${random}-${checksum.toString().padStart(2, '0')}`;
    }
    
    /**
     * Initialize the bureaucratic nightmare
     */
    async init() {
        try {
            console.log('[IncarnationEngine] Initializing bureaucratic processing...');
            
            // Apply corporate purgatory theme
            await this.applyBureaucraticTheme();
            
            // Initialize core systems
            this.accountant = new KarmicAccountant(this.journeyData);
            this.termsGenerator = new TermsOfIncarnationGenerator();
            this.selector = new IncarnationSelector();
            this.bureaucraticUI = new BureaucraticUI();
            this.proceduralGenerator = new ProceduralIncarnationGenerator();
            this.audioEngine = new IncarnationAudioEngine();
            
            // Initialize audio (eternal hold music)
            await this.audioEngine.init();
            await this.audioEngine.playHoldMusic();
            
            // Display initial bureaucratic interface
            await this.displayProcessingCenter();
            
            // Begin the bureaucratic process
            await this.beginProcessing();
            
            console.log('[IncarnationEngine] Ready for soul processing');
            
        } catch (error) {
            console.error('[IncarnationEngine] Initialization failed:', error);
            this.handleBureaucraticError(error);
        }
    }
    
    /**
     * Apply the corporate purgatory visual theme
     */
    async applyBureaucraticTheme() {
        document.body.className = 'incarnation-engine';
        document.body.setAttribute('data-phase', 'incarnation');
        document.body.setAttribute('data-theme', 'corporate-purgatory');
        
        // Set CSS custom properties
        document.documentElement.style.setProperty('--corporate-beige', '#f4f1e8');
        document.documentElement.style.setProperty('--forms-blue', '#0066cc');
        document.documentElement.style.setProperty('--error-red', '#cc0000');
        document.documentElement.style.setProperty('--disabled-gray', '#999999');
        document.documentElement.style.setProperty('--fluorescent-white', '#fafaf0');
    }
    
    /**
     * Display the main processing center interface
     */
    async displayProcessingCenter() {
        const container = document.createElement('div');
        container.className = 'incarnation-container';
        container.innerHTML = `
            <div class="bureaucratic-header">
                <h1>INCARNATION PROCESSING CENTER</h1>
                <h2>Department of Consciousness Allocation</h2>
                <div class="ticket-info">
                    <div class="ticket-number">
                        Ticket #${this.userChoices.ticketNumber}
                    </div>
                    <div class="queue-status">
                        Now Serving: ∞ | Your Position: ${this.userChoices.queuePosition}
                    </div>
                </div>
            </div>
            
            <div class="processing-area">
                <div class="left-panel">
                    <div class="karma-report-display" id="karma-display">
                        <h3>Loading Karma Report...</h3>
                        <div class="loading-dots">...</div>
                    </div>
                    <div class="queue-info">
                        <h4>Estimated Wait Time</h4>
                        <div class="wait-time" id="wait-time">Calculating...</div>
                    </div>
                </div>
                
                <div class="center-panel">
                    <div class="process-steps">
                        <div class="step-indicator">
                            <div class="step active">1. Karma Review</div>
                            <div class="step">2. Forms Completion</div>
                            <div class="step">3. Terms Acceptance</div>
                            <div class="step">4. Option Selection</div>
                            <div class="step">5. Final Processing</div>
                            <div class="step">6. Quality Assurance</div>
                            <div class="step">7. Deployment</div>
                        </div>
                    </div>
                    <div class="main-content" id="main-content">
                        <!-- Dynamic content will be inserted here -->
                    </div>
                </div>
                
                <div class="right-panel">
                    <div class="help-desk">
                        <h4>Need Help?</h4>
                        <button class="help-button" disabled>Request Support</button>
                        <p class="help-status">Help unavailable (Budget cuts)</p>
                    </div>
                    <div class="system-status">
                        <h4>System Status</h4>
                        <div class="status-item">
                            <span>Karma Database:</span>
                            <span class="status-ok">Operational</span>
                        </div>
                        <div class="status-item">
                            <span>Terms Generator:</span>
                            <span class="status-ok">Functional</span>
                        </div>
                        <div class="status-item">
                            <span>Selection Engine:</span>
                            <span class="status-warning">Degraded</span>
                        </div>
                        <div class="status-item">
                            <span>Hope:</span>
                            <span class="status-error">Not Found</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bureaucratic-footer">
                <div class="copyright">
                    © Beginning of Time - Heat Death of Universe | 
                    The Universe, LLC | All Rights Reserved | 
                    <a href="#" onclick="alert('Legal department is in another dimension')">Legal</a> | 
                    <a href="#" onclick="alert('Privacy is an illusion')">Privacy</a>
                </div>
                <div class="server-info">
                    Server Load: 127% | Karma Processing Delay: ${Math.floor(Math.random() * 5000)}ms
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Start the queue position animation
        this.animateQueuePosition();
    }
    
    /**
     * Begin the bureaucratic processing sequence
     */
    async beginProcessing() {
        // Step 1: Generate and display karma report
        await this.processKarmaEvaluation();
        
        // Step 2: Present required forms
        await this.processRequiredForms();
        
        // Step 3: Terms of Service acceptance
        await this.processTermsAcceptance();
        
        // Step 4: Incarnation selection
        await this.processIncarnationSelection();
        
        // Step 5: Final processing with delays
        await this.processFinalSubmission();
        
        // Step 6: Quality assurance (more delays)
        await this.processQualityAssurance();
        
        // Step 7: Deploy incarnation
        await this.deployIncarnation();
    }
    
    /**
     * Step 1: Process karma evaluation
     */
    async processKarmaEvaluation() {
        this.updateStep(1, 'Karma Review');
        
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="processing-step">
                <h2>🧮 Karmic Performance Evaluation</h2>
                <p>Analyzing your digital life decisions...</p>
                <div class="progress-bar">
                    <div class="progress-fill" id="karma-progress"></div>
                </div>
                <div class="progress-text">Calculating...</div>
            </div>
        `;
        
        // Animate progress bar
        await this.animateProgressBar('karma-progress', 3000);
        
        // Generate comprehensive karma report
        const report = await this.accountant.generateComprehensiveReport();
        
        // Display the report
        await this.displayKarmaReport(report);
        
        // Wait for user to process the existential dread
        await this.waitForUserInput('Continue to Forms', 'karma-continue');
    }
    
    /**
     * Display the karma report with excessive detail
     */
    async displayKarmaReport(report) {
        const karmaDisplay = document.getElementById('karma-display');
        karmaDisplay.innerHTML = `
            <div class="karma-report">
                <h3>FINAL KARMIC ASSESSMENT</h3>
                <div class="report-header">
                    Entity ID: ${this.userChoices.ticketNumber}<br>
                    Evaluation Period: Birth → Digital Death<br>
                    Report Generated: ${new Date().toISOString()}<br>
                    Classification: <span class="classification">${report.classification}</span>
                </div>
                
                <div class="metrics-grid">
                    <div class="metric-item">
                        <h4>Digital Productivity</h4>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${Math.max(0, Math.min(100, report.metrics.digitalProductivity))}%"></div>
                        </div>
                        <div class="metric-value">${report.metrics.digitalProductivity.toFixed(2)}</div>
                    </div>
                    
                    <div class="metric-item">
                        <h4>Meme Propagation Index</h4>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${Math.max(0, Math.min(100, report.metrics.memePropagation))}%"></div>
                        </div>
                        <div class="metric-value">${report.metrics.memePropagation.toFixed(2)}</div>
                    </div>
                    
                    <div class="metric-item">
                        <h4>Emotional Labor Balance</h4>
                        <div class="metric-bar deficit">
                            <div class="metric-fill" style="width: ${Math.max(0, Math.min(100, Math.abs(report.metrics.emotionalLabor)))}%"></div>
                        </div>
                        <div class="metric-value">${report.metrics.emotionalLabor.toFixed(2)} SEU</div>
                    </div>
                    
                    <div class="metric-item">
                        <h4>Carbon Footprint</h4>
                        <div class="metric-bar negative">
                            <div class="metric-fill" style="width: ${Math.max(0, Math.min(100, report.metrics.carbonFootprint))}%"></div>
                        </div>
                        <div class="metric-value">${report.metrics.carbonFootprint.toFixed(2)} tons CO₂</div>
                    </div>
                </div>
                
                <div class="final-score">
                    <h3>FINAL KARMA SCORE</h3>
                    <div class="score-display">${report.finalScore}</div>
                    <div class="score-percentile">Percentile: ${report.percentile}%</div>
                    <div class="score-grade">Grade: ${report.grade}</div>
                </div>
                
                <div class="adjustments">
                    <h4>Applied Adjustments:</h4>
                    <ul>
                        <li>Karma Inflation Rate: -3.0%</li>
                        <li>Server Load Penalty: -${Math.floor(Math.random() * 10)}</li>
                        <li>Cosmic Tax (15%): -${(report.rawScore * 0.15).toFixed(2)}</li>
                        <li>Processing Fee: -5.00</li>
                        <li>Convenience Charge: -3.00</li>
                    </ul>
                </div>
                
                <div class="recommendations">
                    <h4>Recommended Actions:</h4>
                    <p>${report.recommendation}</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Animate progress bar with realistic delays
     */
    async animateProgressBar(elementId, duration) {
        return new Promise(resolve => {
            const progressElement = document.getElementById(elementId);
            let progress = 0;
            const interval = 50;
            const increment = 100 / (duration / interval);
            
            const timer = setInterval(() => {
                progress += increment * (0.5 + Math.random()); // Irregular progress
                
                if (progress >= 95) {
                    // Slow down near the end (bureaucratic realism)
                    progress += 0.1;
                }
                
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(timer);
                    resolve();
                }
                
                progressElement.style.width = `${Math.min(progress, 100)}%`;
            }, interval);
        });
    }
    
    /**
     * Wait for user input with bureaucratic delays
     */
    async waitForUserInput(buttonText, buttonId) {
        return new Promise(resolve => {
            const mainContent = document.getElementById('main-content');
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
            buttonContainer.innerHTML = `
                <button class="continue-button" id="${buttonId}" disabled>
                    ${buttonText}
                </button>
                <div class="wait-message">Please wait while we prepare the next step...</div>
            `;
            mainContent.appendChild(buttonContainer);
            
            // Enable button after bureaucratic delay
            setTimeout(() => {
                const button = document.getElementById(buttonId);
                button.disabled = false;
                button.onclick = () => {
                    buttonContainer.remove();
                    resolve();
                };
                
                const waitMessage = buttonContainer.querySelector('.wait-message');
                waitMessage.textContent = 'You may now proceed.';
            }, 2000 + Math.random() * 3000); // Random delay for realism
        });
    }
    
    /**
     * Update step indicator
     */
    updateStep(stepNumber, stepName) {
        this.currentStep = stepNumber;
        
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index < stepNumber - 1) {
                step.className = 'step completed';
            } else if (index === stepNumber - 1) {
                step.className = 'step active';
            } else {
                step.className = 'step';
            }
        });
        
        console.log(`[IncarnationEngine] Proceeding to Step ${stepNumber}: ${stepName}`);
    }
    
    /**
     * Animate queue position (it never really changes)
     */
    animateQueuePosition() {
        const queueElement = document.querySelector('.queue-status');
        
        setInterval(() => {
            // Queue position occasionally changes but meaninglessly
            if (Math.random() < 0.1) {
                const change = Math.floor(Math.random() * 10) - 5;
                this.userChoices.queuePosition = Math.max(1, this.userChoices.queuePosition + change);
                queueElement.innerHTML = `Now Serving: ∞ | Your Position: ${this.userChoices.queuePosition}`;
            }
        }, 5000);
    }
    
    /**
     * Handle bureaucratic errors with appropriate helplessness
     */
    handleBureaucraticError(error) {
        console.error('[IncarnationEngine] Bureaucratic Error:', error);
        
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'bureaucratic-error';
        errorDisplay.innerHTML = `
            <div class="error-content">
                <h2>🚫 SYSTEM ERROR</h2>
                <p>An error has occurred in the cosmic bureaucracy.</p>
                <div class="error-details">
                    <p>Error Code: ${Math.floor(Math.random() * 99999)}</p>
                    <p>Severity: Existential</p>
                    <p>Resolution: Contact your local deity (Good luck)</p>
                </div>
                <button onclick="location.reload()">File Complaint</button>
                <p class="error-note">Note: Complaints are processed in the order received. Current backlog: 47,283,921 complaints.</p>
            </div>
        `;
        
        document.body.appendChild(errorDisplay);
        
        // Record the error in consciousness
        this.consciousness.recordEvent('incarnation_error', {
            error: error.message,
            timestamp: Date.now(),
            step: this.currentStep
        });
    }
    
    /**
     * Clean up all resources
     */
    destroy() {
        console.log('[IncarnationEngine] Terminating bureaucratic processing...');
        
        if (this.audioEngine) {
            this.audioEngine.destroy();
        }
        
        this.guardian.cleanupAll();
        
        console.log('[IncarnationEngine] Bureaucracy dissolved into digital entropy');
    }
}

// Export for use in main incarnation page
if (typeof window !== 'undefined') {
    window.IncarnationEngine = IncarnationEngine;
    
    // Debug mode exposure
    if (window.location?.search?.includes('debug')) {
        window.incarnation = {
            skipQueue: () => console.log('Access Denied. Nice try.'),
            showTruth: () => console.log('The algorithm has already decided your fate.'),
            reroll: () => console.log('The die has been cast. No rerolls.'),
            enlightenment: () => console.log('Enlightenment.exe not found.')
        };
    }
}