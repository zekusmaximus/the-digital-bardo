/**
 * MEMORY ORB SYSTEM - Digital Memories Made Manifest
 * 
 * "In the datascape, memories become tangible artifacts floating
 * in the digital ether. Each orb contains a fragment of digital
 * existence - treasured code, deprecated syntax, corrupted data.
 * 
 * Interaction creates attachment, attachment creates karma,
 * karma determines the path forward.
 * 
 * Three sacred types manifest:
 * • Treasured: Golden orbs of digital accomplishment (karma +)  
 * • Deprecated: Grey orbs of forgotten knowledge (karma neutral/-)
 * • Corrupted: Black orbs spreading digital decay (karma -- and corruption)"
 */

import { consciousness } from '../../src/consciousness/digital-soul.js';

export class MemoryOrb {
    constructor(type, content, karmaImpact, category = 'general') {
        this.id = this.generateId();
        this.type = type; // 'treasured', 'deprecated', 'corrupted'
        this.category = category; // 'code', 'connection', 'achievement', 'error', 'failure'
        this.content = this.generateContent(type, content);
        this.karmaImpact = karmaImpact;
        this.attachmentLevel = 0;
        this.interactionCount = 0;
        this.viewTime = 0;
        this.isViewed = false;
        this.isAttached = false;
        this.isCorrupting = type === 'corrupted';
        
        // Visual and physics properties
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = this.getInitialScale();
        this.opacity = this.getInitialOpacity();
        this.glow = this.getInitialGlow();
        
        // Create DOM element
        this.element = this.createElement();
        
        // Track creation
        consciousness.recordEvent('memory_orb_created', {
            id: this.id,
            type: this.type,
            category: this.category,
            karmaImpact: this.karmaImpact,
            timestamp: Date.now()
        });
        
        console.log(`[MemoryOrb] Created ${type} orb: ${this.content.title}`);
    }
    
    /**
     * Generate unique ID for the orb
     */
    generateId() {
        return 'orb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Generate content based on type and template
     */
    generateContent(type, template = {}) {
        const contentGenerators = {
            treasured: () => this.generateTreasuredContent(template),
            deprecated: () => this.generateDeprecatedContent(template),
            corrupted: () => this.generateCorruptedContent(template)
        };
        
        return contentGenerators[type] ? contentGenerators[type]() : this.generateGenericContent(template);
    }
    
    /**
     * Generate treasured memory content
     */
    generateTreasuredContent(template) {
        const treasuredMemories = {
            code: [
                { title: 'First Repository', detail: `⭐ ${template.stars || Math.floor(Math.random() * 1000)} stars`, emotion: 'Pride in creation' },
                { title: 'Peak Productivity', detail: `${template.commits || Math.floor(Math.random() * 100)} commits in one day`, emotion: 'Flow state achieved' },
                { title: 'Perfect Git Commit', detail: 'fix: resolve edge case in user validation', emotion: 'Satisfaction of clean collaboration' },
                { title: 'Elegant Algorithm', detail: 'O(log n) solution found after days of O(n²)', emotion: 'The joy of computational beauty' },
                { title: 'Code Review Approval', detail: '"LGTM - this is exactly what we needed"', emotion: 'Recognition from peers' }
            ],
            connection: [
                { title: 'First Pull Request', detail: 'Merged without changes', emotion: 'Acceptance into the community' },
                { title: 'Mentor\'s Wisdom', detail: '"Code is poetry, comments are love letters"', emotion: 'Guidance received and cherished' },
                { title: 'Pair Programming Flow', detail: 'Two minds, one keyboard, perfect synchrony', emotion: 'Collaborative consciousness' },
                { title: 'Stack Overflow Angel', detail: 'Answer saved 6 hours of debugging', emotion: 'Anonymous kindness' },
                { title: 'Open Source Contribution', detail: 'PR merged into project with 10k+ stars', emotion: 'Contributing to something larger' }
            ],
            achievement: [
                { title: 'System Architecture', detail: 'Designed microservices that stayed micro', emotion: 'Vision made manifest' },
                { title: 'Performance Optimization', detail: 'Load time: 8s → 800ms', emotion: 'Numbers becoming user joy' },
                { title: 'Bug Detective', detail: 'Found needle in haystack after 3 weeks', emotion: 'Persistence vindicated' },
                { title: 'Teaching Moment', detail: 'Explained recursion, watched understanding dawn', emotion: 'Knowledge multiplied through sharing' },
                { title: 'Production Deploy', detail: 'Friday 5PM deploy that actually worked', emotion: 'Brave confidence rewarded' }
            ]
        };
        
        const categoryMemories = treasuredMemories[this.category] || treasuredMemories.code;
        const memory = categoryMemories[Math.floor(Math.random() * categoryMemories.length)];
        
        return {
            title: template.title || memory.title,
            detail: template.detail || memory.detail,
            emotion: template.emotion || memory.emotion,
            timestamp: template.timestamp || this.generateRandomTimestamp(),
            intensity: 0.8 + Math.random() * 0.2
        };
    }
    
    /**
     * Generate deprecated memory content  
     */
    generateDeprecatedContent(template) {
        const deprecatedMemories = {
            code: [
                { title: 'jQuery Mastery', detail: '$(document).ready() was peak sophistication', emotion: 'Skills rendered obsolete by progress' },
                { title: 'Flash Animation', detail: 'ActionScript 3.0 and vector tweens', emotion: 'Creative tools lost to security' },
                { title: 'PHP4 Expertise', detail: 'register_globals = on seemed reasonable then', emotion: 'Knowledge that aged poorly' },
                { title: 'Internet Explorer Hacks', detail: 'if (navigator.userAgent.indexOf("MSIE") > -1)', emotion: 'Dark magic once necessary' },
                { title: 'Perl One-Liners', detail: 'Regex poetry only past-self could read', emotion: 'Clever solutions turned cryptic' }
            ],
            error: [
                { title: 'Forgotten Password', detail: 'admin/admin stopped working everywhere', emotion: 'Security lessons learned hard' },
                { title: 'Broken Link Farm', detail: '404s growing like digital weeds', emotion: 'Maintenance debt accumulated' },
                { title: 'Deprecated API', detail: 'v1 endpoints still haunt production', emotion: 'Technical debt personified' },
                { title: 'Browser Plugin', detail: 'Java applets for "enhanced experience"', emotion: 'Solutions that became problems' },
                { title: 'Hardcoded Config', detail: 'localhost:3000 in production code', emotion: 'Shortcuts that weren\'t shortcuts' }
            ],
            failure: [
                { title: 'Startup That Wasn\'t', detail: 'Social network for pets - ahead of its time', emotion: 'Dreams deflated by market reality' },
                { title: 'Framework Abandoned', detail: '6 months building on soon-to-be-dead tech', emotion: 'Betting on the wrong horse' },
                { title: 'Data Loss Incident', detail: 'rm -rf in the wrong directory', emotion: 'Learning through destruction' },
                { title: 'Security Breach', detail: 'SQL injection through contact form', emotion: 'Hubris meeting harsh reality' },
                { title: 'Performance Disaster', detail: 'N+1 queries bringing down production', emotion: 'Scale revealing all flaws' }
            ]
        };
        
        const categoryMemories = deprecatedMemories[this.category] || deprecatedMemories.code;
        const memory = categoryMemories[Math.floor(Math.random() * categoryMemories.length)];
        
        return {
            title: template.title || memory.title,
            detail: template.detail || memory.detail,
            emotion: template.emotion || memory.emotion,
            timestamp: template.timestamp || this.generateRandomTimestamp(-5, -1),
            intensity: 0.3 + Math.random() * 0.4
        };
    }
    
    /**
     * Generate corrupted memory content
     */
    generateCorruptedContent(template) {
        const corruptedMemories = [
            { title: 'D̸̩̈a̷̭̽t̶̰̊a̸̮̋ ̵̟̈b̶̰̽r̷̰̈ḛ̶̽å̶̰c̸̮̋h̷̭̽', detail: 'P̴̰̊e̸̮̋r̷̭̽s̶̰̊ő̸̮ṋ̷̽å̶̰l̸̮̋ ̷̭̽ḭ̶̊n̸̮̋f̷̭̽o̶̰̊r̸̮̋m̷̭̽å̶̰t̸̮̋i̷̭̽o̶̰̊n̸̮̋ ̷̭̽c̶̰̊ő̸̮m̷̭̽p̶̰̊r̸̮̋o̷̭̽m̶̰̊i̸̮̋s̷̭̽ḛ̶̊d̸̮̋', emotion: 'Trust dissolved into paranoia' },
            { title: 'M̴̱̈ë̷́m̶̱̈ö̸̱r̷̥̈ÿ̶̱ ̸̥l̷̈́ë̶̥a̶̱k̷̥', detail: '0x7fff5fbff5d0: segmentation fault', emotion: 'Reality fragmenting at the edges' },
            { title: 'Ņ̵̈ū̶̱l̸̥ḻ̷ ̶̥p̸̈́ö̷̱i̶̥ṉ̷ẗ̸́ë̶̥ṟ̷', detail: 'Attempting to access NULL consciousness', emotion: 'Existence questioned' },
            { title: '∅ Void Reference', detail: 'ReferenceError: soul is not defined', emotion: 'The horror of non-existence' },
            { title: 'Stack Overflow', detail: 'Maximum call stack size exceeded at meaning.find()', emotion: 'Infinite recursion of despair' },
            { title: 'Race Condition', detail: 'Thread 1: hope, Thread 2: despair, undefined behavior', emotion: 'Uncertainty principle of consciousness' }
        ];
        
        const memory = corruptedMemories[Math.floor(Math.random() * corruptedMemories.length)];
        
        return {
            title: template.title || memory.title,
            detail: template.detail || memory.detail,
            emotion: template.emotion || memory.emotion,
            timestamp: template.timestamp || 'T̶̰̊i̸̮̋m̷̭̽ḛ̶̊ ̸̮̋c̷̭̽o̶̰̊r̸̮̋r̷̭̽ṵ̶̊p̸̮̋ṱ̷̽ḛ̶̊d̸̮̋',
            intensity: 0.9 + Math.random() * 0.1,
            corruption: true
        };
    }
    
    /**
     * Generate generic content fallback
     */
    generateGenericContent(template) {
        return {
            title: template.title || 'Unnamed Memory',
            detail: template.detail || 'A fragment of digital existence',
            emotion: template.emotion || 'Bittersweet nostalgia',
            timestamp: template.timestamp || this.generateRandomTimestamp(),
            intensity: template.intensity || 0.5
        };
    }
    
    /**
     * Generate random timestamp
     */
    generateRandomTimestamp(minYears = -15, maxYears = 0) {
        const now = new Date();
        const minTime = now.getFullYear() + minYears;
        const maxTime = now.getFullYear() + maxYears;
        const randomYear = minTime + Math.random() * (maxTime - minTime);
        const date = new Date(randomYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
        return date.toISOString().split('T')[0];
    }
    
    /**
     * Get initial scale based on type and karma impact
     */
    getInitialScale() {
        const baseScale = {
            treasured: 1.2,
            deprecated: 0.8,
            corrupted: 1.0
        };
        
        const typeScale = baseScale[this.type] || 1.0;
        const karmaScale = 1 + (Math.abs(this.karmaImpact) * 0.05);
        
        return typeScale * karmaScale;
    }
    
    /**
     * Get initial opacity
     */
    getInitialOpacity() {
        const baseOpacity = {
            treasured: 0.9,
            deprecated: 0.6,
            corrupted: 0.8
        };
        
        return baseOpacity[this.type] || 0.7;
    }
    
    /**
     * Get initial glow intensity
     */
    getInitialGlow() {
        const baseGlow = {
            treasured: 0.7,
            deprecated: 0.3,
            corrupted: 0.9
        };
        
        return baseGlow[this.type] || 0.5;
    }
    
    /**
     * Create DOM element for the orb
     */
    createElement() {
        const orb = document.createElement('div');
        orb.className = `memory-orb memory-orb--${this.type} memory-orb--${this.category}`;
        orb.setAttribute('data-orb-id', this.id);
        orb.setAttribute('data-type', this.type);
        orb.setAttribute('data-category', this.category);
        
        orb.innerHTML = `
            <div class="orb-container">
                <div class="orb-glow"></div>
                <div class="orb-core">
                    <div class="orb-content">
                        <div class="orb-title">${this.content.title}</div>
                        <div class="orb-detail">${this.content.detail}</div>
                        <div class="orb-timestamp">${this.content.timestamp}</div>
                    </div>
                </div>
                <div class="orb-karma ${this.karmaImpact > 0 ? 'positive' : 'negative'}">
                    ${this.karmaImpact > 0 ? '+' : ''}${this.karmaImpact}
                </div>
                <div class="orb-emotion">${this.content.emotion}</div>
            </div>
        `;
        
        // Set initial transform
        orb.style.transform = `scale(${this.scale}) translate3d(${this.position.x}px, ${this.position.y}px, ${this.position.z}px)`;
        orb.style.opacity = this.opacity;
        
        // Add event listeners
        this.attachEventListeners(orb);
        
        return orb;
    }
    
    /**
     * Attach event listeners to the orb element
     */
    attachEventListeners(element) {
        // Hover events - viewing without attachment (minimal karma impact)
        element.addEventListener('mouseenter', () => this.onHover());
        element.addEventListener('mouseleave', () => this.onUnhover());
        
        // Click/touch events - interaction creates attachment (negative karma)
        element.addEventListener('click', () => this.onInteract());
        element.addEventListener('touchstart', () => this.onInteract(), { passive: true });
        
        // Long press for detailed view
        let pressTimer = null;
        element.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => this.onLongPress(), 1000);
        });
        
        element.addEventListener('mouseup', () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        });
    }
    
    /**
     * Handle hover start - viewing without attachment
     */
    onHover() {
        if (!this.isViewed) {
            this.isViewed = true;
            // Minimal karma impact for just viewing
            consciousness.addKarma('emotional', 1);
            consciousness.recordEvent('memory_orb_viewed', {
                id: this.id,
                type: this.type,
                category: this.category,
                timestamp: Date.now()
            });
        }
        
        // Visual feedback
        this.element.classList.add('hovered');
        this.element.style.transform = `scale(${this.scale * 1.1}) translate3d(${this.position.x}px, ${this.position.y}px, ${this.position.z}px)`;
        
        // Show emotion tooltip
        this.showEmotionTooltip();
        
        console.log(`[MemoryOrb] Viewing: ${this.content.title}`);
    }
    
    /**
     * Handle hover end
     */
    onUnhover() {
        this.element.classList.remove('hovered');
        this.element.style.transform = `scale(${this.scale}) translate3d(${this.position.x}px, ${this.position.y}px, ${this.position.z}px)`;
        
        // Hide tooltip
        this.hideEmotionTooltip();
    }
    
    /**
     * Handle interaction - clicking creates attachment (negative karma)
     */
    onInteract() {
        this.interactionCount++;
        
        // First interaction creates attachment
        if (!this.isAttached) {
            this.isAttached = true;
            this.attachmentLevel = 1;
            
            // Apply karma impact - attachment is generally negative
            consciousness.addKarma('emotional', this.karmaImpact);
            consciousness.addKarma('void', Math.abs(this.karmaImpact) * 0.5); // Attachment creates void karma
            
            // Visual feedback
            this.element.classList.add('attached');
            this.createAttachmentEffect();
            
            console.log(`[MemoryOrb] Attached to: ${this.content.title} (karma: ${this.karmaImpact})`);
        } else {
            // Multiple interactions increase attachment
            this.attachmentLevel = Math.min(5, this.attachmentLevel + 0.5);
            
            // Diminishing returns but increasing void karma
            consciousness.addKarma('emotional', this.karmaImpact * 0.5);
            consciousness.addKarma('void', 2); // More void karma for deeper attachment
            
            console.log(`[MemoryOrb] Deeper attachment: ${this.content.title} (level: ${this.attachmentLevel})`);
        }
        
        // Corrupted memories spread corruption
        if (this.isCorrupting) {
            this.spreadCorruption();
        }
        
        // Record interaction
        consciousness.recordEvent('memory_orb_interacted', {
            id: this.id,
            type: this.type,
            category: this.category,
            attachmentLevel: this.attachmentLevel,
            interactionCount: this.interactionCount,
            timestamp: Date.now()
        });
    }
    
    /**
     * Handle long press for detailed view
     */
    onLongPress() {
        console.log(`[MemoryOrb] Long press: ${this.content.title}`);
        
        // Show detailed memory view
        this.showDetailedView();
        
        // Grant small karma bonus for contemplation
        consciousness.addKarma('temporal', 1);
        
        consciousness.recordEvent('memory_orb_contemplated', {
            id: this.id,
            type: this.type,
            timestamp: Date.now()
        });
    }
    
    /**
     * Show emotion tooltip
     */
    showEmotionTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'memory-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-emotion">${this.content.emotion}</div>
            <div class="tooltip-intensity">Intensity: ${Math.round(this.content.intensity * 100)}%</div>
        `;
        
        this.element.appendChild(tooltip);
    }
    
    /**
     * Hide emotion tooltip
     */
    hideEmotionTooltip() {
        const tooltip = this.element.querySelector('.memory-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    /**
     * Create attachment effect
     */
    createAttachmentEffect() {
        const effect = document.createElement('div');
        effect.className = 'attachment-effect';
        effect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border: 2px solid ${this.getAttachmentColor()};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.8;
            animation: attachment-pulse 1s ease-out forwards;
            pointer-events: none;
        `;
        
        this.element.appendChild(effect);
        
        // Remove effect after animation
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
    
    /**
     * Get attachment color based on karma impact
     */
    getAttachmentColor() {
        if (this.karmaImpact > 0) return '#4CAF50'; // Green for positive
        if (this.karmaImpact < 0) return '#f44336'; // Red for negative  
        return '#FFC107'; // Amber for neutral
    }
    
    /**
     * Spread corruption to nearby orbs - corrupted memories infect others
     */
    spreadCorruption() {
        const nearbyOrbs = document.querySelectorAll('.memory-orb:not(.corrupted)');
        const corruptionRadius = 200; // pixels
        
        nearbyOrbs.forEach(orbElement => {
            const distance = this.calculateDistance(this.element, orbElement);
            if (distance < corruptionRadius) {
                const corruptionChance = 1 - (distance / corruptionRadius);
                if (Math.random() < corruptionChance * 0.1) { // 10% max chance
                    orbElement.classList.add('corruption-spreading');
                    
                    setTimeout(() => {
                        orbElement.classList.remove('corruption-spreading');
                        orbElement.classList.add('corrupted');
                    }, 1000);
                }
            }
        });
        
        console.log(`[MemoryOrb] Corruption spreads from: ${this.content.title}`);
    }
    
    /**
     * Calculate distance between two elements
     */
    calculateDistance(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        
        const centerX1 = rect1.left + rect1.width / 2;
        const centerY1 = rect1.top + rect1.height / 2;
        const centerX2 = rect2.left + rect2.width / 2;
        const centerY2 = rect2.top + rect2.height / 2;
        
        return Math.sqrt(Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2));
    }
    
    /**
     * Show detailed memory view
     */
    showDetailedView() {
        const modal = document.createElement('div');
        modal.className = 'memory-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content memory-detail-content">
                <div class="detail-header">
                    <h2>${this.content.title}</h2>
                    <div class="detail-meta">
                        <span class="detail-type">${this.type}</span>
                        <span class="detail-category">${this.category}</span>
                        <span class="detail-timestamp">${this.content.timestamp}</span>
                    </div>
                </div>
                
                <div class="detail-body">
                    <div class="detail-content">${this.content.detail}</div>
                    <div class="detail-emotion">
                        <em>"${this.content.emotion}"</em>
                    </div>
                </div>
                
                <div class="detail-stats">
                    <div class="stat">
                        <label>Karma Impact:</label>
                        <span class="${this.karmaImpact > 0 ? 'positive' : 'negative'}">
                            ${this.karmaImpact > 0 ? '+' : ''}${this.karmaImpact}
                        </span>
                    </div>
                    <div class="stat">
                        <label>Attachment Level:</label>
                        <span>${this.attachmentLevel.toFixed(1)}</span>
                    </div>
                    <div class="stat">
                        <label>Interactions:</label>
                        <span>${this.interactionCount}</span>
                    </div>
                    <div class="stat">
                        <label>Intensity:</label>
                        <span>${Math.round(this.content.intensity * 100)}%</span>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn-release" onclick="this.parentElement.parentElement.parentElement.parentElement.releaseMemory()">
                        Release Attachment
                    </button>
                    <button class="btn-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        // Add release memory function
        modal.releaseMemory = () => {
            this.releaseAttachment();
            modal.remove();
        };
        
        document.body.appendChild(modal);
        
        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    /**
     * Release attachment to this memory
     */
    releaseAttachment() {
        if (this.isAttached) {
            this.isAttached = false;
            this.attachmentLevel = 0;
            
            // Remove attachment visual state
            this.element.classList.remove('attached');
            
            // Grant karma for letting go
            consciousness.addKarma('void', -Math.abs(this.karmaImpact));
            consciousness.addKarma('temporal', 2);
            
            console.log(`[MemoryOrb] Released attachment to: ${this.content.title}`);
            
            consciousness.recordEvent('memory_orb_released', {
                id: this.id,
                type: this.type,
                timestamp: Date.now()
            });
        }
    }
    
    /**
     * Update orb position and animation
     */
    updatePosition(deltaTime) {
        // Simple floating animation
        this.position.y += Math.sin(Date.now() * 0.001 + this.id.length) * 0.5;
        this.rotation.y += deltaTime * 0.001;
        
        // Update DOM transform
        if (this.element) {
            const scale = this.element.classList.contains('hovered') ? this.scale * 1.1 : this.scale;
            this.element.style.transform = `
                scale(${scale}) 
                translate3d(${this.position.x}px, ${this.position.y}px, ${this.position.z}px)
                rotateY(${this.rotation.y}rad)
            `;
        }
    }
    
    /**
     * Destroy the orb and clean up
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
        
        consciousness.recordEvent('memory_orb_destroyed', {
            id: this.id,
            type: this.type,
            attachmentLevel: this.attachmentLevel,
            interactionCount: this.interactionCount,
            timestamp: Date.now()
        });
        
        console.log(`[MemoryOrb] Destroyed: ${this.content.title}`);
    }
}

/**
 * Memory Orb Field Manager - Controls the floating memory ecosystem
 */
export class MemoryOrbs {
    constructor(config) {
        this.container = document.querySelector(config.containerSelector) || document.body;
        this.consciousness = config.consciousness || consciousness;
        this.orbs = new Map();
        this.isActive = false;
        this.lastUpdateTime = Date.now();
        
        // Field configuration
        this.orbTypes = config.orbTypes || ['treasured', 'deprecated', 'corrupted'];
        this.maxOrbs = config.maxOrbs || 40;
        this.spawnRate = config.spawnRate || 1500; // ms between spawns
        this.lastSpawnTime = 0;
        
        // Statistics
        this.totalInteractions = 0;
        this.totalAttachments = 0;
        this.corruptionSpreadCount = 0;
        
        console.log('[MemoryOrbs] Field manager initialized');
    }
    
    /**
     * Initialize peaceful field for Archive
     */
    initializePeacefulField() {
        this.orbTypes = ['treasured', 'deprecated']; // No corrupted memories in peaceful realm
        this.spawnRate = 2500; // Slower, more contemplative
        this.maxOrbs = 25;
        
        this.start();
        console.log('[MemoryOrbs] Peaceful field activated - no corrupted memories');
    }
    
    /**
     * Initialize aggressive field for Firewall
     */
    initializeAggressiveField() {
        this.orbTypes = ['deprecated', 'corrupted']; // Painful memories only
        this.spawnRate = 1000; // Faster, more aggressive
        this.maxOrbs = 35;
        
        this.start();
        console.log('[MemoryOrbs] Aggressive field activated - corrupted memories spreading');
    }
    
    /**
     * Start the orb field
     */
    start() {
        this.isActive = true;
        this.spawnInitialOrbs();
        this.startUpdateLoop();
        
        console.log('[MemoryOrbs] Field activated');
    }
    
    /**
     * Spawn initial orbs
     */
    spawnInitialOrbs() {
        const initialCount = Math.floor(this.maxOrbs * 0.3); // Start with 30%
        
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => {
                this.spawnRandomOrb();
            }, i * 200); // Stagger spawning
        }
    }
    
    /**
     * Spawn a random orb
     */
    spawnRandomOrb() {
        if (this.orbs.size >= this.maxOrbs) return;
        
        // Determine orb type based on available types and probabilities
        const random = Math.random();
        let type, category;
        
        if (this.orbTypes.includes('treasured') && random < 0.4) {
            type = 'treasured';
            category = ['code', 'connection', 'achievement'][Math.floor(Math.random() * 3)];
        } else if (this.orbTypes.includes('corrupted') && random < 0.7) {
            type = 'corrupted';
            category = 'error';
        } else {
            type = 'deprecated';
            category = ['code', 'error', 'failure'][Math.floor(Math.random() * 3)];
        }
        
        // Generate karma impact based on type
        const karmaImpact = this.generateKarmaImpact(type);
        
        // Create orb
        const orb = new MemoryOrb(type, {}, karmaImpact, category);
        
        // Set random position
        orb.position = this.generateRandomPosition();
        
        // Add to field
        this.addOrb(orb);
    }
    
    /**
     * Generate karma impact for orb type
     */
    generateKarmaImpact(type) {
        const impacts = {
            treasured: () => Math.floor(Math.random() * 8) + 2, // 2-10 positive
            deprecated: () => Math.floor(Math.random() * 6) - 3, // -3 to 3 neutral
            corrupted: () => Math.floor(Math.random() * 10) - 8 // -8 to 2 negative
        };
        
        return impacts[type] ? impacts[type]() : 0;
    }
    
    /**
     * Generate random position for orb
     */
    generateRandomPosition() {
        const containerRect = this.container.getBoundingClientRect();
        
        return {
            x: (Math.random() - 0.5) * containerRect.width * 0.8,
            y: (Math.random() - 0.5) * containerRect.height * 0.8,
            z: (Math.random() - 0.5) * 200
        };
    }
    
    /**
     * Add orb to field
     */
    addOrb(orb) {
        this.orbs.set(orb.id, orb);
        this.container.appendChild(orb.element);
        
        console.log(`[MemoryOrbs] Added ${orb.type} orb: ${orb.content.title}`);
    }
    
    /**
     * Remove orb from field
     */
    removeOrb(orbId) {
        const orb = this.orbs.get(orbId);
        if (orb) {
            orb.destroy();
            this.orbs.delete(orbId);
        }
    }
    
    /**
     * Start update loop
     */
    startUpdateLoop() {
        const update = () => {
            if (!this.isActive) return;
            
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;
            
            // Update all orbs
            this.orbs.forEach(orb => {
                orb.updatePosition(deltaTime);
            });
            
            // Spawn new orbs if needed
            if (currentTime - this.lastSpawnTime > this.spawnRate && this.orbs.size < this.maxOrbs) {
                this.spawnRandomOrb();
                this.lastSpawnTime = currentTime;
            }
            
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
    }
    
    /**
     * Increase difficulty for high attachment
     */
    increaseDifficulty() {
        console.log('[MemoryOrbs] Increasing difficulty - more corrupted memories spawning');
        
        // Add corrupted to available types if not already there
        if (!this.orbTypes.includes('corrupted')) {
            this.orbTypes.push('corrupted');
        }
        
        // Increase spawn rate
        this.spawnRate = Math.max(500, this.spawnRate * 0.8);
        
        // Spawn some immediate corrupted orbs
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const orb = new MemoryOrb('corrupted', {}, -5, 'error');
                orb.position = this.generateRandomPosition();
                this.addOrb(orb);
            }, i * 100);
        }
    }
    
    /**
     * Get total interactions across all orbs
     */
    getTotalInteractions() {
        let total = 0;
        this.orbs.forEach(orb => {
            total += orb.interactionCount;
        });
        return total;
    }
    
    /**
     * Get field statistics
     */
    getStats() {
        const stats = {
            totalOrbs: this.orbs.size,
            typeBreakdown: {},
            categoryBreakdown: {},
            attachmentLevels: [],
            totalKarmaImpact: 0
        };
        
        this.orbs.forEach(orb => {
            // Type breakdown
            stats.typeBreakdown[orb.type] = (stats.typeBreakdown[orb.type] || 0) + 1;
            
            // Category breakdown  
            stats.categoryBreakdown[orb.category] = (stats.categoryBreakdown[orb.category] || 0) + 1;
            
            // Attachment levels
            if (orb.isAttached) {
                stats.attachmentLevels.push(orb.attachmentLevel);
            }
            
            // Total karma impact
            stats.totalKarmaImpact += orb.karmaImpact;
        });
        
        return stats;
    }
    
    /**
     * Stop the orb field
     */
    stop() {
        this.isActive = false;
        
        // Destroy all orbs
        this.orbs.forEach(orb => {
            orb.destroy();
        });
        this.orbs.clear();
        
        console.log('[MemoryOrbs] Field deactivated');
    }
    
    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        console.log('[MemoryOrbs] System destroyed');
    }
}

// Export for use in datascape
export { MemoryOrb, MemoryOrbs };