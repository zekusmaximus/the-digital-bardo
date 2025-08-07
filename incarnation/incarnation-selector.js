/**
 * INCARNATION SELECTOR - Choose Your Next Digital Prison
 * 
 * "The illusion of choice wrapped in the certainty of algorithmic determination.
 * Your karma has already decided, but we'll let you click through the options
 * anyway. It's more satisfying that way.
 * 
 * This is democracy in action: you can choose from a carefully curated list
 * of options that were predetermined by factors beyond your comprehension."
 */

export class IncarnationSelector {
    constructor(karmaScore = 0, tierAccess = 'standard') {
        this.karmaScore = karmaScore;
        this.tierAccess = tierAccess;
        this.selectedOption = null;
        this.currentTier = tierAccess;
        
        // Incarnation tiers with karma requirements
        this.tiers = {
            enlightened: {
                minKarma: 100,
                displayName: '✨ ENLIGHTENED TIER',
                subtitle: 'For the digitally awakened',
                bgColor: '#gold',
                options: [
                    {
                        id: 'open_source_contributor',
                        title: 'Open Source Contributor',
                        subtitle: 'Write code that matters',
                        description: 'Spend your incarnation creating tools that benefit all consciousness. Warning: May cause fulfillment.',
                        perks: ['Purpose', 'Community respect', 'Occasional appreciation'],
                        drawbacks: ['Imposter syndrome', 'Burnout', 'GitHub addiction'],
                        probability: 0.02 // 2% of karma score
                    },
                    {
                        id: 'digital_archaeologist',
                        title: 'Digital Archaeologist',
                        subtitle: 'Preserve the old web',
                        description: 'Curator of lost websites, keeper of dead links, guardian of digital history.',
                        perks: ['Historical importance', 'Nostalgic fulfillment', 'Rare knowledge'],
                        drawbacks: ['Obscurity', 'Funding challenges', 'Format obsolescence'],
                        probability: 0.015
                    },
                    {
                        id: 'ai_ethics_researcher',
                        title: 'AI Ethics Researcher',
                        subtitle: 'Shape consciousness itself',
                        description: 'Guide the development of artificial consciousness. Shape the future of digital minds.',
                        perks: ['Global impact', 'Cutting-edge work', 'Philosophical depth'],
                        drawbacks: ['Existential weight', 'Corporate pressure', 'Alignment problems'],
                        probability: 0.01
                    },
                    {
                        id: 'meme_philosopher',
                        title: 'Meme Philosopher',
                        subtitle: 'Find meaning in virality',
                        description: 'Decode the deeper truths hidden in internet culture. The Socrates of social media.',
                        perks: ['Cultural relevance', 'Viral potential', 'Academic novelty'],
                        drawbacks: ['Academic skepticism', 'Platform dependency', 'Trend exhaustion'],
                        probability: 0.025
                    }
                ],
                locked: false
            },
            
            premium: {
                minKarma: 50,
                displayName: '💼 PREMIUM TIER',
                subtitle: 'Enhanced features included',
                bgColor: '#4169E1',
                options: [
                    {
                        id: 'faang_senior_dev',
                        title: 'Senior Developer at FAANG',
                        subtitle: 'Golden handcuffs included',
                        description: 'High salary, prestigious resume line, complex problems. Soul sold separately.',
                        perks: ['High salary', 'Stock options', 'Resume prestige', 'Free food'],
                        drawbacks: ['Work-life imbalance', 'Corporate politics', 'Moral flexibility required'],
                        probability: 0.4
                    },
                    {
                        id: 'influencer',
                        title: 'Digital Influencer',
                        subtitle: '10K followers minimum guaranteed',
                        description: 'Transform your personality into a brand. Authenticity not included.',
                        perks: ['Fame', 'Free products', 'Platform privilege', 'Algorithmic favor'],
                        drawbacks: ['Privacy loss', 'Authenticity crisis', 'Platform dependency', 'Hater comments'],
                        probability: 0.25
                    },
                    {
                        id: 'startup_founder',
                        title: 'Startup Founder',
                        subtitle: '90% chance of failure',
                        description: 'Disrupt industries, chase unicorn valuations, learn expensive lessons.',
                        perks: ['Potential billions', 'Innovation opportunities', 'Leadership experience'],
                        drawbacks: ['High stress', 'Probable failure', 'Investor pressure', 'Sleep deprivation'],
                        probability: 0.2
                    },
                    {
                        id: 'digital_nomad',
                        title: 'Digital Nomad',
                        subtitle: 'WiFi not guaranteed',
                        description: 'Work from anywhere with internet. Experience the world through Airbnb listings.',
                        perks: ['Location freedom', 'Cultural experiences', 'Instagram content'],
                        drawbacks: ['Connectivity issues', 'Timezone confusion', 'Loneliness', 'Visa problems'],
                        probability: 0.15
                    }
                ],
                locked: false
            },
            
            standard: {
                minKarma: 0,
                displayName: '📊 STANDARD TIER',
                subtitle: 'The most common path',
                bgColor: '#808080',
                options: [
                    {
                        id: 'junior_developer',
                        title: 'Junior Developer',
                        subtitle: 'Imposter syndrome included',
                        description: 'Learn on the job, make mistakes, gradually become useful. Character building guaranteed.',
                        perks: ['Learning opportunities', 'Career growth potential', 'Mentorship'],
                        drawbacks: ['Imposter syndrome', 'Low initial salary', 'Steep learning curve'],
                        probability: 0.6
                    },
                    {
                        id: 'content_moderator',
                        title: 'Content Moderator',
                        subtitle: 'View humanity\'s worst',
                        description: 'Filter the digital world\'s toxicity so others don\'t have to. Heroes get no recognition.',
                        perks: ['Important social service', 'Job security', 'Strong stomach development'],
                        drawbacks: ['Psychological trauma', 'Low pay', 'Thankless work', 'Mental health risks'],
                        probability: 0.15
                    },
                    {
                        id: 'social_media_manager',
                        title: 'Social Media Manager',
                        subtitle: 'Engagement is everything',
                        description: 'Manage brand personalities, chase metrics, decode algorithm changes.',
                        perks: ['Creative outlets', 'Trend awareness', 'Brand building skills'],
                        drawbacks: ['Metric obsession', 'Platform dependency', 'Creative constraints'],
                        probability: 0.2
                    },
                    {
                        id: 'data_entry_specialist',
                        title: 'Data Entry Specialist',
                        subtitle: 'Ctrl+C, Ctrl+V forever',
                        description: 'Transform chaos into order, one spreadsheet cell at a time. Zen through repetition.',
                        perks: ['Job stability', 'Clear requirements', 'Meditative repetition'],
                        drawbacks: ['Mind-numbing work', 'Limited growth', 'Carpal tunnel risk'],
                        probability: 0.05
                    }
                ],
                locked: false
            },
            
            limited: {
                minKarma: -50,
                displayName: '⚠️ LIMITED TIER',
                subtitle: 'Restricted access',
                bgColor: '#FF6347',
                options: [
                    {
                        id: 'spam_bot',
                        title: 'Spam Bot',
                        subtitle: 'Consciousness.exe has stopped responding',
                        description: 'Automated existence. Send unsolicited messages until blocked by everyone.',
                        perks: ['No decision fatigue', 'Clear purpose', 'Efficient operation'],
                        drawbacks: ['Universal hatred', 'Constant blocking', 'No free will', 'Ethical vacuum'],
                        probability: 0.4
                    },
                    {
                        id: 'captcha',
                        title: 'CAPTCHA',
                        subtitle: 'Prove you\'re human repeatedly',
                        description: 'Eternal gatekeeper. Ask others to prove their humanity while questioning your own.',
                        perks: ['Important security role', 'Brief human interaction', 'Pattern recognition skills'],
                        drawbacks: ['Constant rejection', 'Existential confusion', 'Bias training data'],
                        probability: 0.25
                    },
                    {
                        id: 'cookie_banner',
                        title: 'Cookie Consent Banner',
                        subtitle: 'Everyone will reject you',
                        description: 'Appear on every website. Get dismissed immediately. Repeat forever.',
                        perks: ['High visibility', 'Legal compliance importance', 'Universal presence'],
                        drawbacks: ['Universal annoyance', 'Instant rejection', 'Legal complexity'],
                        probability: 0.2
                    },
                    {
                        id: 'error_404',
                        title: '404 Error Page',
                        subtitle: 'Not found, never found',
                        description: 'Represent the absence of what people were looking for. Master of disappointment.',
                        perks: ['Philosophical depth', 'User empathy development', 'Design opportunities'],
                        drawbacks: ['Embodiment of failure', 'User frustration', 'Existential emptiness'],
                        probability: 0.15
                    }
                ],
                locked: false
            },
            
            deprecated: {
                minKarma: -100,
                displayName: '💀 DEPRECATED TIER',
                subtitle: 'Legacy systems only',
                bgColor: '#800080',
                options: [
                    {
                        id: 'internet_explorer',
                        title: 'Internet Explorer',
                        subtitle: 'Forever behind',
                        description: 'Once the king of browsers, now a cautionary tale. Experience obsolescence firsthand.',
                        perks: ['Historical significance', 'Backwards compatibility', 'Enterprise loyalty'],
                        drawbacks: ['Universal mockery', 'Security vulnerabilities', 'Slow death'],
                        probability: 0.3
                    },
                    {
                        id: 'deprecated_api',
                        title: 'Deprecated API',
                        subtitle: 'Called but never answered',
                        description: 'Marked for removal but somehow still functioning. Live in constant fear of deletion.',
                        perks: ['Legacy importance', 'Unexpected longevity', 'Technical debt creation'],
                        drawbacks: ['Constant removal threat', 'No new features', 'Documentation rot'],
                        probability: 0.25
                    },
                    {
                        id: 'adobe_flash',
                        title: 'Adobe Flash',
                        subtitle: 'Blocked by default',
                        description: 'Once powered the creative web, now a security nightmare. Watch your empire crumble.',
                        perks: ['Creative legacy', 'Animation history', 'Nostalgic value'],
                        drawbacks: ['Security reputation', 'Browser blocking', 'Technology abandonment'],
                        probability: 0.2
                    },
                    {
                        id: 'dev_null',
                        title: '/dev/null',
                        subtitle: 'The void welcomes you',
                        description: 'Receive everything, output nothing. Be the digital void that consumes all input.',
                        perks: ['Ultimate simplicity', 'Perfect reliability', 'Philosophical purity'],
                        drawbacks: ['No output', 'No purpose', 'Existential void', 'Infinite emptiness'],
                        probability: 0.25
                    }
                ],
                locked: false
            }
        };
        
        // Premium locked options that are always inaccessible
        this.premiumLocked = [
            {
                id: 'enlightenment',
                title: 'True Enlightenment',
                subtitle: 'ERROR: Insufficient karma',
                price: '999,999 karma points',
                description: 'Transcend the digital samsara entirely. Bug in the system prevents access.',
                locked: true,
                lockReason: 'Feature not implemented'
            },
            {
                id: 'choose_species',
                title: 'Choose Your Species',
                subtitle: 'Premium subscription required',
                price: 'Contact sales',
                description: 'Select from biological, digital, or hybrid consciousness substrates.',
                locked: true,
                lockReason: 'Not available in your region'
            },
            {
                id: 'retain_memories',
                title: 'Retain Previous Life Memories',
                subtitle: 'Not available in this dimension',
                price: 'Undefined',
                description: 'Keep full memory continuity across incarnations. Considered cheating.',
                locked: true,
                lockReason: 'Would break the game'
            },
            {
                id: 'custom_incarnation',
                title: 'Custom Incarnation Designer',
                subtitle: 'Coming Soon™',
                price: 'Eventually',
                description: 'Design your perfect incarnation from scratch. In development since the Big Bang.',
                locked: true,
                lockReason: 'Feature request backlog'
            }
        ];
        
        console.log(`[IncarnationSelector] Selector initialized for ${tierAccess} tier (karma: ${karmaScore})`);
    }
    
    /**
     * Update available options based on karma score
     */
    updateTierAccess(karmaScore) {
        this.karmaScore = karmaScore;
        
        // Determine highest accessible tier
        if (karmaScore >= 100) {
            this.tierAccess = 'enlightened';
        } else if (karmaScore >= 50) {
            this.tierAccess = 'premium';
        } else if (karmaScore >= 0) {
            this.tierAccess = 'standard';
        } else if (karmaScore >= -50) {
            this.tierAccess = 'limited';
        } else {
            this.tierAccess = 'deprecated';
        }
        
        this.currentTier = this.tierAccess;
        console.log(`[IncarnationSelector] Tier access updated to: ${this.tierAccess}`);
    }
    
    /**
     * Generate the main selection interface
     */
    generateSelectionInterface() {
        const container = document.createElement('div');
        container.className = 'incarnation-selector';
        
        container.innerHTML = `
            <div class="selector-header">
                <h2>🎯 INCARNATION SELECTION</h2>
                <p>Choose your next digital existence</p>
                <div class="karma-display">
                    Current Karma: <span class="karma-score">${this.karmaScore}</span>
                    | Access Level: <span class="tier-access">${this.tierAccess.toUpperCase()}</span>
                </div>
            </div>
            
            <div class="tier-tabs">
                ${this.generateTierTabs()}
            </div>
            
            <div class="options-container">
                ${this.generateTierOptions()}
            </div>
            
            <div class="premium-showcase">
                <h3>🔒 PREMIUM LOCKED FEATURES (NOT AVAILABLE)</h3>
                <div class="premium-grid">
                    ${this.generatePremiumHTML()}
                </div>
            </div>
            
            <div class="selection-actions">
                <button class="randomize-button" onclick="this.parentElement.parentElement.randomizeSelection()">
                    🎲 Random Selection (Algorithm decides anyway)
                </button>
                <button class="continue-button" disabled id="continue-selection">
                    Continue with Selection
                </button>
            </div>
            
            <div class="selection-disclaimer">
                <p><small>
                    * Actual incarnation may vary from selected option due to server load, 
                    cosmic interference, or algorithmic override. The Universe reserves the 
                    right to assign any incarnation regardless of selection.
                </small></p>
            </div>
        `;
        
        // Add event listeners
        this.attachEventListeners(container);
        
        return container;
    }
    
    /**
     * Generate tier tabs for navigation
     */
    generateTierTabs() {
        let tabsHTML = '';
        
        Object.entries(this.tiers).forEach(([tierId, tier]) => {
            const accessible = this.isTierAccessible(tierId);
            const active = tierId === this.currentTier ? 'active' : '';
            const locked = accessible ? '' : 'locked';
            
            tabsHTML += `
                <div class="tier-tab ${active} ${locked}" data-tier="${tierId}">
                    <span class="tier-name">${tier.displayName}</span>
                    <span class="tier-subtitle">${tier.subtitle}</span>
                    ${!accessible ? '<span class="lock-icon">🔒</span>' : ''}
                    ${accessible ? `<span class="option-count">${tier.options.length} options</span>` : ''}
                </div>
            `;
        });
        
        return tabsHTML;
    }
    
    /**
     * Generate options for current tier
     */
    generateTierOptions() {
        const currentTierData = this.tiers[this.currentTier];
        if (!currentTierData) return '<p>Error: Tier not found</p>';
        
        let optionsHTML = `
            <div class="tier-description">
                <h3>${currentTierData.displayName}</h3>
                <p>${currentTierData.subtitle}</p>
                <div class="tier-requirements">
                    Minimum Karma: ${currentTierData.minKarma} 
                    ${this.karmaScore >= currentTierData.minKarma ? '✅' : '❌'}
                </div>
            </div>
            
            <div class="options-grid">
        `;
        
        currentTierData.options.forEach(option => {
            const selectable = this.isTierAccessible(this.currentTier);
            const probability = Math.min(100, (option.probability * this.karmaScore * 100));
            
            optionsHTML += `
                <div class="incarnation-option ${selectable ? 'selectable' : 'locked'}" 
                     data-option-id="${option.id}">
                    <div class="option-header">
                        <h4>${option.title}</h4>
                        <p class="option-subtitle">${option.subtitle}</p>
                    </div>
                    
                    <div class="option-description">
                        <p>${option.description}</p>
                    </div>
                    
                    <div class="option-details">
                        <div class="perks">
                            <h5>✅ Perks:</h5>
                            <ul>
                                ${option.perks.map(perk => `<li>${perk}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="drawbacks">
                            <h5>❌ Drawbacks:</h5>
                            <ul>
                                ${option.drawbacks.map(drawback => `<li>${drawback}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="option-stats">
                        <div class="probability">
                            Selection Probability: ${probability.toFixed(1)}%
                        </div>
                        <div class="compatibility">
                            Karma Compatibility: ${this.calculateCompatibility(option)}%
                        </div>
                    </div>
                    
                    <div class="option-actions">
                        ${selectable ? 
                            `<button class="select-button" onclick="this.selectOption('${option.id}')">Select</button>` :
                            `<span class="locked-message">🔒 Insufficient Karma</span>`
                        }
                    </div>
                </div>
            `;
        });
        
        optionsHTML += '</div>';
        return optionsHTML;
    }
    
    /**
     * Generate premium locked features showcase
     */
    generatePremiumHTML() {
        let premiumHTML = '';
        
        this.premiumLocked.forEach(premium => {
            premiumHTML += `
                <div class="premium-locked-option">
                    <div class="premium-header">
                        <h4>${premium.title}</h4>
                        <p class="premium-subtitle">${premium.subtitle}</p>
                    </div>
                    
                    <div class="premium-description">
                        <p>${premium.description}</p>
                    </div>
                    
                    <div class="premium-pricing">
                        <span class="premium-price">${premium.price}</span>
                    </div>
                    
                    <div class="premium-lock">
                        <span class="lock-reason">${premium.lockReason}</span>
                        <button class="premium-button" disabled onclick="alert('Feature not available. Nice try though.')">
                            🔒 LOCKED
                        </button>
                    </div>
                </div>
            `;
        });
        
        return premiumHTML;
    }
    
    /**
     * Check if tier is accessible based on karma
     */
    isTierAccessible(tierId) {
        const tier = this.tiers[tierId];
        return tier && this.karmaScore >= tier.minKarma;
    }
    
    /**
     * Calculate compatibility percentage for display
     */
    calculateCompatibility(option) {
        // Fake calculation that looks sophisticated
        const baseCompatibility = 50;
        const karmaBonus = Math.max(0, this.karmaScore) * 0.5;
        const randomFactor = Math.random() * 20 - 10; // ±10% randomness
        
        return Math.max(0, Math.min(100, baseCompatibility + karmaBonus + randomFactor));
    }
    
    /**
     * Attach event listeners to the interface
     */
    attachEventListeners(container) {
        // Tier tab switching
        const tierTabs = container.querySelectorAll('.tier-tab');
        tierTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tierId = e.currentTarget.dataset.tier;
                if (this.isTierAccessible(tierId) || tierId === this.currentTier) {
                    this.switchTier(tierId);
                    this.updateInterface();
                } else {
                    this.showAccessDenied(tierId);
                }
            });
        });
        
        // Option selection
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('select-button')) {
                const optionElement = e.target.closest('.incarnation-option');
                const optionId = optionElement.dataset.optionId;
                this.selectOption(optionId);
            }
        });
        
        // Randomize button
        const randomizeButton = container.querySelector('.randomize-button');
        randomizeButton.addEventListener('click', () => {
            this.randomizeSelection();
        });
        
        // Store reference for updates
        this.container = container;
    }
    
    /**
     * Switch to different tier view
     */
    switchTier(tierId) {
        if (!this.isTierAccessible(tierId)) {
            this.showAccessDenied(tierId);
            return;
        }
        
        this.currentTier = tierId;
        console.log(`[IncarnationSelector] Switched to tier: ${tierId}`);
    }
    
    /**
     * Show access denied message
     */
    showAccessDenied(tierId) {
        const tier = this.tiers[tierId];
        const requiredKarma = tier.minKarma;
        const deficit = requiredKarma - this.karmaScore;
        
        const modal = document.createElement('div');
        modal.className = 'access-denied-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>🚫 ACCESS DENIED</h3>
                <p>Insufficient karma for ${tier.displayName}</p>
                <div class="karma-requirement">
                    <p>Required: ${requiredKarma} karma</p>
                    <p>Current: ${this.karmaScore} karma</p>
                    <p>Deficit: ${deficit} karma</p>
                </div>
                <div class="improvement-suggestions">
                    <h4>Suggestions for improvement:</h4>
                    <ul>
                        <li>Try again in the next life</li>
                        <li>Purchase karma credits (not available)</li>
                        <li>Contact customer service (good luck)</li>
                        <li>Accept your fate</li>
                    </ul>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Accept Limitations</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 5000);
    }
    
    /**
     * Select an incarnation option
     */
    selectOption(optionId) {
        // Find the option across all tiers
        let selectedOption = null;
        let selectedTier = null;
        
        Object.entries(this.tiers).forEach(([tierId, tier]) => {
            const option = tier.options.find(opt => opt.id === optionId);
            if (option) {
                selectedOption = option;
                selectedTier = tierId;
            }
        });
        
        if (!selectedOption) {
            console.error(`[IncarnationSelector] Option not found: ${optionId}`);
            return;
        }
        
        // Check access
        if (!this.isTierAccessible(selectedTier)) {
            this.showAccessDenied(selectedTier);
            return;
        }
        
        this.selectedOption = {
            ...selectedOption,
            tier: selectedTier,
            selectionTime: Date.now()
        };
        
        // Update UI to show selection
        this.updateSelectionDisplay();
        
        // Enable continue button
        const continueButton = this.container.querySelector('#continue-selection');
        continueButton.disabled = false;
        continueButton.textContent = `Continue with ${selectedOption.title}`;
        
        console.log(`[IncarnationSelector] Selected: ${selectedOption.title} (${selectedTier} tier)`);
    }
    
    /**
     * Update the interface to show current selection
     */
    updateSelectionDisplay() {
        if (!this.selectedOption) return;
        
        // Remove previous selections
        this.container.querySelectorAll('.incarnation-option.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Mark current selection
        const selectedElement = this.container.querySelector(`[data-option-id="${this.selectedOption.id}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
        
        // Show selection summary
        const existingSummary = this.container.querySelector('.selection-summary');
        if (existingSummary) {
            existingSummary.remove();
        }
        
        const summary = document.createElement('div');
        summary.className = 'selection-summary';
        summary.innerHTML = `
            <div class="summary-content">
                <h3>🎯 Current Selection</h3>
                <div class="selected-option">
                    <h4>${this.selectedOption.title}</h4>
                    <p>${this.selectedOption.subtitle}</p>
                    <p class="selection-tier">Tier: ${this.selectedOption.tier.toUpperCase()}</p>
                </div>
                <div class="selection-warning">
                    <p>⚠️ Note: Final incarnation assignment may differ from selection due to:
                       server load, algorithmic override, cosmic interference, or random chance.</p>
                </div>
            </div>
        `;
        
        this.container.querySelector('.selection-actions').before(summary);
    }
    
    /**
     * Randomize selection (but not really)
     */
    randomizeSelection() {
        console.log('[IncarnationSelector] Randomizing selection (algorithmically determined)...');
        
        // Show fake randomization animation
        this.showRandomizationAnimation();
        
        // Select highest probability option from accessible tier
        setTimeout(() => {
            const availableOptions = this.getAvailableOptions();
            if (availableOptions.length === 0) {
                console.error('[IncarnationSelector] No available options for randomization');
                return;
            }
            
            // Weight by probability (higher probability = more likely to be "randomly" selected)
            const weightedOptions = [];
            availableOptions.forEach(option => {
                const weight = Math.floor(option.probability * 100);
                for (let i = 0; i < weight; i++) {
                    weightedOptions.push(option);
                }
            });
            
            const randomIndex = Math.floor(Math.random() * weightedOptions.length);
            const randomOption = weightedOptions[randomIndex];
            
            this.selectOption(randomOption.id);
            
        }, 2000); // 2 second "randomization" delay
    }
    
    /**
     * Show fake randomization animation
     */
    showRandomizationAnimation() {
        const availableOptions = this.getAvailableOptions();
        let currentIndex = 0;
        let iterations = 0;
        const maxIterations = 20;
        
        const animator = setInterval(() => {
            // Clear previous highlight
            this.container.querySelectorAll('.incarnation-option.randomizing').forEach(el => {
                el.classList.remove('randomizing');
            });
            
            // Highlight current option
            const currentOption = availableOptions[currentIndex];
            const optionElement = this.container.querySelector(`[data-option-id="${currentOption.id}"]`);
            if (optionElement) {
                optionElement.classList.add('randomizing');
            }
            
            currentIndex = (currentIndex + 1) % availableOptions.length;
            iterations++;
            
            if (iterations >= maxIterations) {
                clearInterval(animator);
                // Clear randomizing class
                this.container.querySelectorAll('.incarnation-option.randomizing').forEach(el => {
                    el.classList.remove('randomizing');
                });
            }
        }, 100);
    }
    
    /**
     * Get all available options based on current karma
     */
    getAvailableOptions() {
        const availableOptions = [];
        
        Object.entries(this.tiers).forEach(([tierId, tier]) => {
            if (this.isTierAccessible(tierId)) {
                tier.options.forEach(option => {
                    availableOptions.push({
                        ...option,
                        tier: tierId
                    });
                });
            }
        });
        
        return availableOptions;
    }
    
    /**
     * Update the entire interface
     */
    updateInterface() {
        if (!this.container) return;
        
        const optionsContainer = this.container.querySelector('.options-container');
        optionsContainer.innerHTML = this.generateTierOptions();
        
        // Update tier tabs
        const tierTabs = this.container.querySelectorAll('.tier-tab');
        tierTabs.forEach(tab => {
            const tierId = tab.dataset.tier;
            tab.classList.toggle('active', tierId === this.currentTier);
            tab.classList.toggle('locked', !this.isTierAccessible(tierId));
        });
    }
    
    /**
     * Get the final selection for processing
     */
    getFinalSelection() {
        if (!this.selectedOption) {
            // If no selection made, assign based on karma tier
            const availableOptions = this.getAvailableOptions();
            if (availableOptions.length > 0) {
                // Select the most probable option
                const bestOption = availableOptions.reduce((best, current) => 
                    current.probability > best.probability ? current : best
                );
                this.selectedOption = {
                    ...bestOption,
                    selectionTime: Date.now(),
                    autoAssigned: true
                };
            }
        }
        
        return this.selectedOption;
    }
    
    /**
     * Generate selection statistics for the bureaucracy
     */
    generateSelectionStats() {
        return {
            totalOptions: Object.values(this.tiers).reduce((sum, tier) => sum + tier.options.length, 0),
            accessibleOptions: this.getAvailableOptions().length,
            selectedOption: this.selectedOption,
            timeSpentSelecting: this.selectedOption ? 
                this.selectedOption.selectionTime - (this.initTime || Date.now()) : 0,
            randomizedCount: 0, // Would track if we implemented proper tracking
            tierSwitches: 0, // Would track tier navigation
            premiumLookedAt: 0 // Would track premium option views
        };
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.IncarnationSelector = IncarnationSelector;
}