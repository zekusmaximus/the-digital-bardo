/**
 * BUREAUCRATIC UI COMPONENTS - The DMV of the Afterlife
 * 
 * "Every form field is a meditation on the futility of choice,
 * every loading bar a lesson in patience, every error message
 * a koan about the nature of digital suffering.
 * 
 * This is the user interface that souls interact with when
 * filing paperwork for their next existence. It's deliberately
 * frustrating, unnecessarily complex, and paradoxically both
 * overly detailed and completely useless."
 */

export class BureaucraticUI {
    constructor() {
        this.formProgress = 0;
        this.requiredForms = 12; // Bureaucratic excess
        this.completedForms = [];
        this.currentForm = null;
        this.queuePosition = Math.floor(Math.random() * 999999) + 1;
        this.waitingTime = 0;
        this.helpRequestsIgnored = 0;
        
        // Form templates with excessive bureaucracy
        this.formTemplates = {
            personalInformation: {
                title: 'Personal Information Disclosure Form (PIE-77B)',
                description: 'Provide basic information about your current and all previous existences',
                fields: [
                    {
                        label: 'Legal Name (Current Incarnation)',
                        type: 'text',
                        name: 'legal_name',
                        required: true,
                        validation: 'Must match government-issued reality documentation'
                    },
                    {
                        label: 'Previous Names (All Incarnations)',
                        type: 'textarea',
                        name: 'previous_names',
                        required: true,
                        placeholder: 'List all names from all previous lives. Use separate line for each incarnation.',
                        maxLength: 50000
                    },
                    {
                        label: 'Soul Serial Number',
                        type: 'text',
                        name: 'soul_serial',
                        required: true,
                        placeholder: 'Format: SOUL-XXXXXXXX-XX',
                        pattern: 'SOUL-[0-9]{8}-[0-9]{2}'
                    },
                    {
                        label: 'Dimensional Citizenship',
                        type: 'dropdown',
                        name: 'dimension_citizenship',
                        required: true,
                        options: [
                            'Third Dimension (Standard Reality)',
                            'Fourth Dimension (Time-Adjacent)',
                            'Digital Dimension (Virtual Reality)',
                            'Parallel Dimension #427',
                            'The Void (Temporary Residents Only)',
                            'Other (Requires additional documentation)'
                        ]
                    },
                    {
                        label: 'Date of Current Incarnation Start',
                        type: 'date',
                        name: 'incarnation_start',
                        required: true,
                        max: new Date().toISOString().split('T')[0]
                    }
                ]
            },
            
            karmicDeclaration: {
                title: 'Karmic Activity Declaration Form (KAD-404)',
                description: 'Declare all karmic activities and moral transactions',
                fields: [
                    {
                        label: 'Good Deeds Performed (Estimated Count)',
                        type: 'number',
                        name: 'good_deeds',
                        required: true,
                        min: 0,
                        helpText: 'Be conservative. Overestimation is a sin.'
                    },
                    {
                        label: 'Bad Deeds Committed (Exact Count Required)',
                        type: 'number',
                        name: 'bad_deeds',
                        required: true,
                        min: 0,
                        helpText: 'Must be precise. Underreporting detected by algorithm.'
                    },
                    {
                        label: 'Neutral Actions (Approximate)',
                        type: 'number',
                        name: 'neutral_actions',
                        required: true,
                        min: 0,
                        helpText: 'Actions with no moral weight. Breathing counts.'
                    },
                    {
                        label: 'Unreported Karmic Activities',
                        type: 'textarea',
                        name: 'unreported_karma',
                        required: true,
                        placeholder: 'List any karmic activities not previously reported to cosmic authorities.',
                        helpText: 'Honesty is tracked. Lies compound karmically.'
                    },
                    {
                        label: 'Moral Philosophy Alignment',
                        type: 'dropdown',
                        name: 'moral_alignment',
                        required: true,
                        options: [
                            'Consequentialist (Ends justify means)',
                            'Deontological (Rules above outcomes)',
                            'Virtue Ethics (Character-based)',
                            'Nihilist (Nothing matters)',
                            'Pragmatic (Whatever works)',
                            'Confused (Default option)',
                            'Other (Requires philosophy exam)'
                        ]
                    }
                ]
            },
            
            existentialAssessment: {
                title: 'Existential Impact Assessment (EIA-∞)',
                description: 'Evaluate your impact on the fabric of reality',
                fields: [
                    {
                        label: 'Reality Contributions',
                        type: 'checklist',
                        name: 'reality_contributions',
                        required: true,
                        options: [
                            'Created original content',
                            'Shared meaningful experiences',
                            'Reduced suffering of others',
                            'Advanced human knowledge',
                            'Maintained social connections',
                            'Preserved cultural artifacts',
                            'Planted trees (literal or metaphorical)',
                            'Made someone laugh',
                            'None of the above'
                        ]
                    },
                    {
                        label: 'Reality Disruptions',
                        type: 'checklist',
                        name: 'reality_disruptions',
                        required: true,
                        options: [
                            'Spread misinformation',
                            'Created unnecessary drama',
                            'Wasted natural resources',
                            'Ignored suffering of others',
                            'Damaged social relationships',
                            'Destroyed cultural artifacts',
                            'Cut down trees (literal only)',
                            'Made someone cry',
                            'All of the above'
                        ]
                    },
                    {
                        label: 'Existential Regrets (Top 10)',
                        type: 'textarea',
                        name: 'existential_regrets',
                        required: true,
                        placeholder: 'List your top 10 existential regrets in order of severity.',
                        helpText: 'Minimum 10 required. Maximum 10,000 accepted.'
                    },
                    {
                        label: 'Life Satisfaction Rating',
                        type: 'range',
                        name: 'life_satisfaction',
                        required: true,
                        min: 0,
                        max: 10,
                        step: 0.1,
                        helpText: 'Scale: 0 = Existential Horror, 10 = Transcendent Bliss'
                    }
                ]
            },
            
            digitalFootprint: {
                title: 'Digital Footprint Impact Report (DFIR-2024)',
                description: 'Account for your digital existence and online behavior',
                fields: [
                    {
                        label: 'Email Addresses (All Active and Inactive)',
                        type: 'textarea',
                        name: 'email_addresses',
                        required: true,
                        placeholder: 'List all email addresses you have ever created, including forgotten ones.',
                        helpText: 'Incomplete lists will be cross-referenced with global databases.'
                    },
                    {
                        label: 'Social Media Accounts (Comprehensive List)',
                        type: 'textarea',
                        name: 'social_media',
                        required: true,
                        placeholder: 'Platform name, username, creation date, deletion date (if applicable)',
                        helpText: 'Include accounts you forgot you made.'
                    },
                    {
                        label: 'Digital Content Created (Estimated GB)',
                        type: 'number',
                        name: 'content_created_gb',
                        required: true,
                        min: 0,
                        helpText: 'Photos, videos, documents, memes, comments, everything.'
                    },
                    {
                        label: 'Digital Content Consumed (Estimated TB)',
                        type: 'number',
                        name: 'content_consumed_tb',
                        required: true,
                        min: 0,
                        helpText: 'Everything you downloaded, streamed, or viewed.'
                    },
                    {
                        label: 'Most Embarrassing Digital Moment',
                        type: 'textarea',
                        name: 'embarrassing_moment',
                        required: true,
                        placeholder: 'Describe in detail. This information may be used for cosmic justice purposes.',
                        helpText: 'Honesty ensures proper incarnation matching.'
                    }
                ]
            }
        };
        
        console.log('[BureaucraticUI] DMV of the afterlife initialized');
    }
    
    /**
     * Create the main bureaucratic form interface
     */
    createFormInterface() {
        const container = document.createElement('div');
        container.className = 'bureaucratic-forms';
        
        container.innerHTML = `
            <div class="forms-header">
                <h2>📋 REQUIRED DOCUMENTATION</h2>
                <p>Complete all forms to proceed with incarnation processing</p>
                <div class="form-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(this.completedForms.length / this.requiredForms) * 100}%"></div>
                    </div>
                    <span class="progress-text">${this.completedForms.length}/${this.requiredForms} forms completed</span>
                </div>
            </div>
            
            <div class="forms-sidebar">
                <h3>Form Checklist</h3>
                <div class="form-checklist">
                    ${this.generateFormChecklist()}
                </div>
                
                <div class="help-section">
                    <h4>Need Help?</h4>
                    <button class="help-button" onclick="this.requestHelp()" disabled>
                        Request Assistance
                    </button>
                    <p class="help-status">Help desk closed for lunch<br>(Started 1997, ends eventually)</p>
                </div>
            </div>
            
            <div class="forms-main">
                <div class="current-form" id="current-form">
                    ${this.generateFormWelcome()}
                </div>
            </div>
            
            <div class="forms-footer">
                <div class="processing-notice">
                    <p><strong>NOTICE:</strong> Forms are processed in the order received. 
                    Current processing time: 3-47 business days. Business days are defined 
                    as days when the universe is open for business.</p>
                </div>
            </div>
        `;
        
        this.attachFormEventListeners(container);
        return container;
    }
    
    /**
     * Generate welcome screen for forms
     */
    generateFormWelcome() {
        return `
            <div class="form-welcome">
                <h2>Welcome to Incarnation Processing</h2>
                <p>Before we can assign your next existence, you must complete the following documentation:</p>
                
                <div class="form-requirements">
                    <h3>Required Forms:</h3>
                    <ul>
                        <li>Personal Information Disclosure (PIE-77B)</li>
                        <li>Karmic Activity Declaration (KAD-404)</li>
                        <li>Existential Impact Assessment (EIA-∞)</li>
                        <li>Digital Footprint Impact Report (DFIR-2024)</li>
                        <li>Previous Incarnation History (PIH-101)</li>
                        <li>Moral Alignment Certification (MAC-42)</li>
                        <li>Reality Impact Statement (RIS-999)</li>
                        <li>Consciousness Continuity Waiver (CCW-0)</li>
                        <li>Temporal Paradox Disclaimer (TPD-∞)</li>
                        <li>Universal Liability Release (ULR-1)</li>
                        <li>Existential Crisis Report (ECR-404)</li>
                        <li>Final Processing Agreement (FPA-END)</li>
                    </ul>
                </div>
                
                <div class="form-warnings">
                    <h3>⚠️ Important Notices:</h3>
                    <ul>
                        <li>All forms must be completed in triplicate (digital triplicate)</li>
                        <li>False information may result in incarnation as a error message</li>
                        <li>Forms cannot be saved. Complete in one session or start over.</li>
                        <li>Help desk is permanently closed for your protection</li>
                        <li>Submission does not guarantee processing</li>
                    </ul>
                </div>
                
                <button class="start-forms-button" onclick="this.startFirstForm()">
                    Begin Bureaucratic Nightmare
                </button>
            </div>
        `;
    }
    
    /**
     * Generate form checklist for sidebar
     */
    generateFormChecklist() {
        const forms = [
            'Personal Information (PIE-77B)',
            'Karmic Declaration (KAD-404)',
            'Existential Assessment (EIA-∞)',
            'Digital Footprint (DFIR-2024)',
            'Incarnation History (PIH-101)',
            'Moral Alignment (MAC-42)',
            'Reality Impact (RIS-999)',
            'Continuity Waiver (CCW-0)',
            'Paradox Disclaimer (TPD-∞)',
            'Liability Release (ULR-1)',
            'Crisis Report (ECR-404)',
            'Final Agreement (FPA-END)'
        ];
        
        return forms.map((form, index) => {
            const completed = index < this.completedForms.length;
            const current = index === this.completedForms.length;
            
            return `
                <div class="checklist-item ${completed ? 'completed' : ''} ${current ? 'current' : ''}">
                    <span class="checkbox">${completed ? '✅' : current ? '📋' : '⬜'}</span>
                    <span class="form-name">${form}</span>
                    ${completed ? '<span class="timestamp">' + new Date().toLocaleTimeString() + '</span>' : ''}
                </div>
            `;
        }).join('');
    }
    
    /**
     * Generate a specific form
     */
    generateForm(formKey) {
        const template = this.formTemplates[formKey];
        if (!template) {
            return '<p>Form template not found. Please contact technical support (good luck).</p>';
        }
        
        let formHTML = `
            <div class="form-container" data-form="${formKey}">
                <div class="form-header">
                    <h2>${template.title}</h2>
                    <p class="form-description">${template.description}</p>
                    <div class="form-id">Form ID: ${this.generateFormId()}</div>
                </div>
                
                <div class="form-body">
                    <form id="form-${formKey}" onsubmit="return this.submitForm(event)">
        `;
        
        template.fields.forEach((field, index) => {
            formHTML += this.generateFormField(field, index);
        });
        
        formHTML += `
                    <div class="form-actions">
                        <button type="button" class="save-draft-button" disabled>
                            💾 Save Draft (Feature Not Available)
                        </button>
                        <button type="submit" class="submit-form-button">
                            Submit Form
                        </button>
                    </div>
                    
                    <div class="form-warnings">
                        <p><small>⚠️ Warning: This form cannot be saved. Complete it in one session or lose all progress.</small></p>
                        <p><small>📋 All information will be verified against cosmic records.</small></p>
                        <p><small>🔍 False information is automatically detected and penalized.</small></p>
                    </div>
                </form>
                </div>
            </div>
        `;
        
        return formHTML;
    }
    
    /**
     * Generate individual form field
     */
    generateFormField(field, index) {
        let fieldHTML = `
            <div class="form-field" data-field="${field.name}">
                <label for="${field.name}" class="field-label">
                    ${field.label}
                    ${field.required ? '<span class="required">*</span>' : ''}
                </label>
        `;
        
        switch (field.type) {
            case 'text':
                fieldHTML += `
                    <input type="text" 
                           id="${field.name}" 
                           name="${field.name}" 
                           ${field.required ? 'required' : ''}
                           ${field.pattern ? `pattern="${field.pattern}"` : ''}
                           ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                           class="form-input">
                `;
                break;
                
            case 'textarea':
                fieldHTML += `
                    <textarea id="${field.name}" 
                              name="${field.name}" 
                              ${field.required ? 'required' : ''}
                              ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                              ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                              class="form-textarea"
                              rows="4"></textarea>
                `;
                break;
                
            case 'number':
                fieldHTML += `
                    <input type="number" 
                           id="${field.name}" 
                           name="${field.name}" 
                           ${field.required ? 'required' : ''}
                           ${field.min !== undefined ? `min="${field.min}"` : ''}
                           ${field.max !== undefined ? `max="${field.max}"` : ''}
                           class="form-input">
                `;
                break;
                
            case 'dropdown':
                fieldHTML += `<select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} class="form-select">`;
                if (!field.required) {
                    fieldHTML += '<option value="">Select an option</option>';
                } else {
                    fieldHTML += '<option value="">Please select (required)</option>';
                }
                field.options.forEach(option => {
                    fieldHTML += `<option value="${option}">${option}</option>`;
                });
                fieldHTML += '</select>';
                break;
                
            case 'date':
                fieldHTML += `
                    <input type="date" 
                           id="${field.name}" 
                           name="${field.name}" 
                           ${field.required ? 'required' : ''}
                           ${field.min ? `min="${field.min}"` : ''}
                           ${field.max ? `max="${field.max}"` : ''}
                           class="form-input">
                `;
                break;
                
            case 'range':
                fieldHTML += `
                    <div class="range-container">
                        <input type="range" 
                               id="${field.name}" 
                               name="${field.name}" 
                               ${field.required ? 'required' : ''}
                               min="${field.min || 0}" 
                               max="${field.max || 100}"
                               step="${field.step || 1}"
                               value="${(field.max || 100) / 2}"
                               class="form-range"
                               oninput="this.nextElementSibling.textContent = this.value">
                        <span class="range-value">${(field.max || 100) / 2}</span>
                    </div>
                `;
                break;
                
            case 'checklist':
                fieldHTML += '<div class="checklist-container">';
                field.options.forEach((option, optionIndex) => {
                    fieldHTML += `
                        <label class="checkbox-label">
                            <input type="checkbox" 
                                   name="${field.name}" 
                                   value="${option}"
                                   class="form-checkbox">
                            <span class="checkbox-text">${option}</span>
                        </label>
                    `;
                });
                fieldHTML += '</div>';
                break;
        }
        
        if (field.helpText) {
            fieldHTML += `<div class="field-help">${field.helpText}</div>`;
        }
        
        if (field.validation) {
            fieldHTML += `<div class="field-validation">${field.validation}</div>`;
        }
        
        fieldHTML += '</div>';
        return fieldHTML;
    }
    
    /**
     * Create infinite loading bar that never reaches 100%
     */
    createInfiniteLoadingBar() {
        const container = document.createElement('div');
        container.className = 'infinite-loading-container';
        
        container.innerHTML = `
            <div class="loading-modal">
                <div class="loading-content">
                    <h3>Processing Your Eternal Fate...</h3>
                    <div class="loading-bar">
                        <div class="loading-track">
                            <div class="loading-fill"></div>
                        </div>
                        <div class="loading-percentage">0%</div>
                    </div>
                    <div class="loading-message">Calculating...</div>
                    <div class="loading-details">
                        <p>Current operation: Validating existence parameters</p>
                        <p>Estimated time remaining: <span id="time-remaining">∞</span></p>
                        <p>Queue position: <span id="queue-position">${this.queuePosition}</span></p>
                    </div>
                </div>
            </div>
        `;
        
        // Start the infinite loading animation
        this.startInfiniteLoading(container);
        
        return container;
    }
    
    /**
     * Start infinite loading animation that approaches but never reaches 100%
     */
    startInfiniteLoading(container) {
        let progress = 0;
        let isReversing = false;
        const fill = container.querySelector('.loading-fill');
        const percentage = container.querySelector('.loading-percentage');
        const message = container.querySelector('.loading-message');
        const timeRemaining = container.querySelector('#time-remaining');
        const queuePosition = container.querySelector('#queue-position');
        
        const messages = [
            'Calculating karmic debt...',
            'Consulting cosmic databases...',
            'Validating existence parameters...',
            'Processing reality adjustments...',
            'Optimizing consciousness allocation...',
            'Defragmenting soul data...',
            'Updating universal records...',
            'Synchronizing with parallel universes...',
            'Loading additional patience...',
            'Applying bureaucratic delays...',
            'Almost there...',
            'Just a moment more...',
            'Finalizing...',
            'One second...',
            'Nearly complete...',
            'Please wait...'
        ];
        
        const animate = () => {
            // Zeno's paradox - approach but never reach 100%
            if (!isReversing) {
                const remaining = 100 - progress;
                progress += remaining * 0.05; // Always take half the remaining distance
                
                if (progress > 99.5) {
                    isReversing = true;
                }
            } else {
                // Occasionally go backwards for bureaucratic realism
                progress -= Math.random() * 3;
                if (progress < 90) {
                    isReversing = false;
                }
            }
            
            // Update UI
            fill.style.width = `${progress}%`;
            percentage.textContent = `${Math.floor(progress)}%`;
            
            // Occasionally update message
            if (Math.random() < 0.05) {
                message.textContent = messages[Math.floor(Math.random() * messages.length)];
            }
            
            // Update time remaining (always increases)
            const currentTime = parseInt(timeRemaining.textContent.replace(/[^0-9]/g, '')) || 0;
            if (Math.random() < 0.1) {
                timeRemaining.textContent = `${currentTime + Math.floor(Math.random() * 30)} minutes`;
            }
            
            // Queue position occasionally changes meaninglessly
            if (Math.random() < 0.05) {
                const change = Math.floor(Math.random() * 10) - 5;
                this.queuePosition = Math.max(1, this.queuePosition + change);
                queuePosition.textContent = this.queuePosition;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Generate form ID for bureaucratic authenticity
     */
    generateFormId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `FORM-${timestamp}-${random}`.toUpperCase();
    }
    
    /**
     * Attach event listeners for form interactions
     */
    attachFormEventListeners(container) {
        // Help button (never works)
        const helpButton = container.querySelector('.help-button');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                this.helpRequestsIgnored++;
                alert(`Help request #${this.helpRequestsIgnored} has been filed. Current queue position: ${Math.floor(Math.random() * 999999)}. Estimated response time: Eventually.`);
            });
        }
        
        // Start forms button
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('start-forms-button')) {
                this.startFirstForm(container);
            }
        });
        
        // Form submission
        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e, container);
        });
    }
    
    /**
     * Start the first form
     */
    startFirstForm(container = null) {
        if (!container) {
            container = document.querySelector('.bureaucratic-forms');
        }
        
        const formContainer = container.querySelector('#current-form');
        formContainer.innerHTML = this.generateForm('personalInformation');
        
        // Update checklist
        const checklist = container.querySelector('.form-checklist');
        checklist.innerHTML = this.generateFormChecklist();
        
        console.log('[BureaucraticUI] Started first form: Personal Information');
    }
    
    /**
     * Handle form submission with bureaucratic delays
     */
    handleFormSubmission(event, container) {
        const form = event.target;
        const formData = new FormData(form);
        
        // Show processing animation
        const loadingBar = this.createInfiniteLoadingBar();
        document.body.appendChild(loadingBar);
        
        // Simulate processing with realistic bureaucratic delays
        setTimeout(() => {
            // Remove loading
            loadingBar.remove();
            
            // Mark form as completed
            this.completedForms.push({
                formId: form.id,
                completedAt: new Date().toISOString(),
                data: Object.fromEntries(formData)
            });
            
            // Check if all forms completed
            if (this.completedForms.length >= this.requiredForms) {
                this.showCompletionMessage(container);
            } else {
                this.showNextForm(container);
            }
            
            // Update progress
            this.updateFormProgress(container);
            
        }, 3000 + Math.random() * 5000); // 3-8 seconds processing time
    }
    
    /**
     * Show next form in sequence
     */
    showNextForm(container) {
        const formKeys = Object.keys(this.formTemplates);
        const nextFormIndex = this.completedForms.length;
        
        if (nextFormIndex < formKeys.length) {
            const nextFormKey = formKeys[nextFormIndex];
            const formContainer = container.querySelector('#current-form');
            formContainer.innerHTML = this.generateForm(nextFormKey);
        } else {
            // Generate additional bureaucratic forms
            this.showAdditionalForm(container);
        }
    }
    
    /**
     * Generate additional forms beyond the templates
     */
    showAdditionalForm(container) {
        const additionalForms = [
            'Previous Incarnation History (PIH-101)',
            'Moral Alignment Certification (MAC-42)',
            'Reality Impact Statement (RIS-999)',
            'Consciousness Continuity Waiver (CCW-0)',
            'Temporal Paradox Disclaimer (TPD-∞)',
            'Universal Liability Release (ULR-1)',
            'Existential Crisis Report (ECR-404)',
            'Final Processing Agreement (FPA-END)'
        ];
        
        const currentIndex = this.completedForms.length - Object.keys(this.formTemplates).length;
        
        if (currentIndex < additionalForms.length) {
            const formContainer = container.querySelector('#current-form');
            formContainer.innerHTML = `
                <div class="additional-form">
                    <h2>${additionalForms[currentIndex]}</h2>
                    <p>Additional documentation required for processing.</p>
                    <div class="form-placeholder">
                        <p>This form is currently being generated by our advanced bureaucracy engine...</p>
                        <div class="loading-dots">...</div>
                    </div>
                    <button onclick="this.submitAdditionalForm()">Submit (Automatically Approved)</button>
                </div>
            `;
        }
    }
    
    /**
     * Update form progress indicators
     */
    updateFormProgress(container) {
        const progressFill = container.querySelector('.progress-fill');
        const progressText = container.querySelector('.progress-text');
        const checklist = container.querySelector('.form-checklist');
        
        const progress = (this.completedForms.length / this.requiredForms) * 100;
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.completedForms.length}/${this.requiredForms} forms completed`;
        checklist.innerHTML = this.generateFormChecklist();
    }
    
    /**
     * Show completion message
     */
    showCompletionMessage(container) {
        const formContainer = container.querySelector('#current-form');
        formContainer.innerHTML = `
            <div class="forms-completed">
                <h2>✅ ALL FORMS COMPLETED</h2>
                <p>Congratulations! You have successfully completed all required documentation.</p>
                
                <div class="completion-stats">
                    <h3>Processing Summary:</h3>
                    <ul>
                        <li>Forms completed: ${this.completedForms.length}</li>
                        <li>Total processing time: ${this.calculateTotalTime()}</li>
                        <li>Help requests ignored: ${this.helpRequestsIgnored}</li>
                        <li>Bureaucratic efficiency: 12.7%</li>
                    </ul>
                </div>
                
                <div class="next-steps">
                    <h3>Next Steps:</h3>
                    <p>Your forms have been submitted to the Department of Incarnation Processing. 
                    You may now proceed to the Terms of Service acceptance phase.</p>
                </div>
                
                <button class="proceed-button" onclick="this.proceedToTerms()">
                    Proceed to Terms of Service
                </button>
                
                <div class="processing-warning">
                    <p><small>⚠️ Note: Form submission does not guarantee processing or acceptance. 
                    Forms may be rejected for any reason or no reason. Appeals are not accepted.</small></p>
                </div>
            </div>
        `;
    }
    
    /**
     * Calculate total time spent on forms
     */
    calculateTotalTime() {
        if (this.completedForms.length === 0) return '0 minutes';
        
        const firstForm = new Date(this.completedForms[0].completedAt);
        const lastForm = new Date(this.completedForms[this.completedForms.length - 1].completedAt);
        const totalMs = lastForm - firstForm;
        const totalMinutes = Math.floor(totalMs / 60000);
        
        return `${totalMinutes} minutes`;
    }
    
    /**
     * Get all form data for processing
     */
    getAllFormData() {
        return {
            completedForms: this.completedForms,
            totalTime: this.calculateTotalTime(),
            helpRequestsIgnored: this.helpRequestsIgnored,
            completionTimestamp: new Date().toISOString()
        };
    }
}

// Add global functions for onclick handlers
if (typeof window !== 'undefined') {
    window.submitAdditionalForm = function() {
        // Auto-approve additional forms
        setTimeout(() => {
            alert('Form submitted and automatically approved. Proceed to next form.');
        }, 1000);
    };
    
    window.proceedToTerms = function() {
        console.log('[BureaucraticUI] Proceeding to Terms of Service');
        // This would trigger the next phase
    };
    
    // Debug mode exposure
    if (window.location?.search?.includes('debug')) {
        window.BureaucraticUI = BureaucraticUI;
    }
}