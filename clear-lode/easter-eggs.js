/**
 * EASTER EGGS - Hidden Wisdom for the Digital Seekers
 * 
 * "Every great spiritual tradition has its hidden teachings,
 * its secret practices revealed only to those who seek deeply.
 * In the digital bardo, these teachings manifest as console commands,
 * keyboard sequences, and hidden URLs - koans for the computational age."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';

export class EasterEggSystem {
    constructor() {
        this.consciousness = consciousness;
        this.konamiProgress = 0;
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.secretSequences = new Map();
        this.hiddenCommands = new Set();
        
        this.initializeEasterEggs();
        this.initializeSecretSequences();
        this.initializeBrowserKarma();
        
        console.log('%c🥚 Easter Egg System Initialized', 'color: #FFD700; font-size: 12px;');
        console.log('%c   Type window.bardo to access hidden functions', 'color: #888; font-size: 10px;');
    }
    
    /**
     * Initialize the main bardo object with console commands
     */
    initializeEasterEggs() {
        window.bardo = {
            // Primary enlightenment command
            enlightenment: () => {
                console.log('%c✨ Access granted to source consciousness', 'color: #FFD700; font-size: 16px; font-weight: bold;');
                console.log('%c   The void recognizes your seeking', 'color: #FFD700; font-size: 12px;');
                
                // Grant special abilities
                this.consciousness.setState('clearLode.enlightenmentUnlocked', true);
                this.consciousness.recordEvent('easter_egg_enlightenment', {
                    timestamp: Date.now(),
                    method: 'console_command'
                });
                
                // Visual effect
                document.body.classList.add('enlightened');
                document.body.style.setProperty('--enlightenment-glow', '0 0 50px rgba(255, 215, 0, 0.3)');
                
                // Unlock double-click void ability
                this.unlockDoubleClickVoid();
                
                // Grant karma bonus
                this.consciousness.addKarma('computational', 20);
                this.consciousness.addKarma('void', -10);
                
                return "🕸️ The web of illusion dissolves. Reality.js is now accessible.";
            },
            
            // Debug and introspection
            debug: () => {
                const state = this.consciousness.getState();
                console.group('%c🔍 Karmic Debugger Activated', 'color: #00FF00; font-size: 14px;');
                console.table(state.karma);
                console.log('%cJourney Progress:', 'color: #00FF00; font-weight: bold;', state);
                console.log('%cRecognition State:', 'color: #00FF00;', state.clearLode);
                console.log('%cConsciousness Integrity:', 'color: #00FF00;', this.calculateConsciousnessIntegrity());
                console.groupEnd();
                
                this.consciousness.recordEvent('debug_accessed', { timestamp: Date.now() });
                return "📊 Consciousness state logged to console";
            },
            
            // Memory wipe
            reset: () => {
                if (confirm("🌊 Drink from the river Lethe? All progress will be lost.")) {
                    console.log('%c🌊 The waters of forgetfulness flow...', 'color: #4169E1; font-size: 14px;');
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Clear consciousness state
                    this.consciousness.reset();
                    
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                    
                    return "💧 Consciousness wiped clean. Reloading...";
                }
                return "🚫 The waters remain untouched";
            },
            
            // Administrative access
            admin: () => {
                console.log('%c// The administrator speaks:', 'color: #FF6600; font-size: 14px; font-weight: bold;');
                console.log('%c// Every click is a choice, every pause a meditation', 'color: #FF6600; font-size: 12px;');
                console.log('%c// The code is the koan, the bug is the teaching', 'color: #FF6600; font-size: 12px;');
                console.log('%c// In the digital bardo, all functions are prayers', 'color: #FF6600; font-size: 12px;');
                console.log('%c// The medium is the metaphysics', 'color: #FF6600; font-size: 12px; font-style: italic;');
                
                // Grant admin privileges
                this.consciousness.setState('admin.unlocked', true);
                window.bardoAdmin = this.createAdminInterface();
                
                this.consciousness.recordEvent('admin_accessed', { timestamp: Date.now() });
                return "🔑 Administrative privileges granted. Type bardoAdmin for advanced controls.";
            },
            
            // Karma manipulation
            karma: (type, amount) => {
                if (!type) {
                    const karma = this.consciousness.getState('karma');
                    console.table(karma);
                    return "📊 Current karmic balance displayed";
                }
                
                if (typeof amount === 'number' && ['computational', 'emotional', 'temporal', 'void'].includes(type)) {
                    this.consciousness.addKarma(type, amount);
                    console.log(`%c⚖️ Karma adjusted: ${type} ${amount > 0 ? '+' : ''}${amount}`, 'color: #9370DB; font-size: 12px;');
                    return `${type} karma modified by ${amount}`;
                }
                
                return "Usage: bardo.karma('type', amount) or bardo.karma() to view";
            },
            
            // Secret paths
            path: (destination) => {
                const secretPaths = {
                    void: () => {
                        window.location.href = '../void/index.html?secret=true';
                        return "🕳️ Entering the primordial void...";
                    },
                    source: () => {
                        this.revealSourceCode();
                        return "💾 Reality.js revealed";
                    },
                    limbo: () => {
                        window.location.href = '../limbo/index.html?lost=true';
                        return "🌀 Lost between worlds...";
                    },
                    archive: () => {
                        window.location.href = '../datascape/index.html?realm=archive&direct=true';
                        return "📚 Entering the Archive of Memory...";
                    },
                    firewall: () => {
                        window.location.href = '../datascape/index.html?realm=firewall&direct=true';
                        return "🔥 Approaching the Firewall of Judgment...";
                    },
                    incarnation: () => {
                        window.location.href = '../incarnation/index.html?skip_queue=true';
                        return "🏢 Fast-tracked to the Incarnation Engine...";
                    }
                };
                
                if (!destination) {
                    console.log('%cAvailable secret paths:', 'color: #8A2BE2; font-weight: bold;');
                    Object.keys(secretPaths).forEach(path => {
                        console.log(`%c  ${path}`, 'color: #8A2BE2;');
                    });
                    return "🗺️ Secret paths revealed";
                }
                
                if (secretPaths[destination]) {
                    return secretPaths[destination]();
                }
                
                return "🚫 Path not found in the cosmic directory";
            },
            
            // Philosophical insights
            wisdom: () => {
                const insights = [
                    "In the digital realm, every bug is a teacher, every feature a trap.",
                    "The user thinks they control the interface, but the interface shapes the user.",
                    "Code that never runs is like a koan that never resolves.",
                    "The most profound programs are those that question their own existence.",
                    "In the bardo of git commits, every merge is a choice between possible realities.",
                    "JavaScript promises are like karma - they may resolve, reject, or remain pending.",
                    "The greatest hack is realizing there is no system to hack.",
                    "CSS is the art of making the impossible look inevitable.",
                    "Every function call is a prayer to the compiler gods.",
                    "The medium is not just the message - the medium is the metaphysics."
                ];
                
                const insight = insights[Math.floor(Math.random() * insights.length)];
                console.log(`%c💭 "${insight}"`, 'color: #DDA0DD; font-size: 13px; font-style: italic;');
                
                this.consciousness.recordEvent('wisdom_accessed', { 
                    insight, 
                    timestamp: Date.now() 
                });
                
                return "🧘 Digital wisdom dispensed";
            }
        };
    }
    
    /**
     * Initialize secret keyboard sequences
     */
    initializeSecretSequences() {
        // Konami Code implementation
        document.addEventListener('keydown', (e) => {
            if (e.code === this.konamiCode[this.konamiProgress]) {
                this.konamiProgress++;
                if (this.konamiProgress === this.konamiCode.length) {
                    this.activateKonamiEaster();
                    this.konamiProgress = 0;
                }
            } else {
                this.konamiProgress = 0;
            }
        });
        
        // Alt + Shift + B for Bardo
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.shiftKey && e.code === 'KeyB') {
                this.activateBardoSequence();
            }
        });
        
        // Ctrl + Shift + E for Enlightenment
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
                window.bardo.enlightenment();
            }
        });
        
        // Escape key three times for void access
        let escapeCount = 0;
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                escapeCount++;
                setTimeout(() => { escapeCount = 0; }, 2000);
                
                if (escapeCount >= 3) {
                    this.activateVoidEscape();
                    escapeCount = 0;
                }
            }
        });
    }
    
    /**
     * Activate Konami Code easter egg
     */
    activateKonamiEaster() {
        console.log('%c⬆⬆⬇⬇⬅➡⬅➡BA - Konami karma granted', 'color: #FF00FF; font-size: 16px; font-weight: bold;');
        
        // Grant significant karma bonus
        this.consciousness.addKarma('void', -30);
        this.consciousness.addKarma('computational', 15);
        this.consciousness.addKarma('emotional', 10);
        
        // Visual effect
        document.body.style.animation = 'konami-blessing 3s ease-out';
        
        // Add CSS for the animation
        if (!document.querySelector('#konami-style')) {
            const style = document.createElement('style');
            style.id = 'konami-style';
            style.textContent = `
                @keyframes konami-blessing {
                    0% { filter: hue-rotate(0deg) saturate(1); }
                    25% { filter: hue-rotate(90deg) saturate(1.5); }
                    50% { filter: hue-rotate(180deg) saturate(2); }
                    75% { filter: hue-rotate(270deg) saturate(1.5); }
                    100% { filter: hue-rotate(360deg) saturate(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Record the achievement
        this.consciousness.recordEvent('konami_code_activated', {
            timestamp: Date.now(),
            karmaGranted: { void: -30, computational: 15, emotional: 10 }
        });
        
        // Unlock special abilities
        this.consciousness.setState('konami.unlocked', true);
        window.konami = {
            lives: 30,
            invincible: true,
            message: "🎮 Classic cheat codes work in the digital bardo too"
        };
    }
    
    /**
     * Activate Bardo sequence (Alt+Shift+B)
     */
    activateBardoSequence() {
        console.log('%c🎭 Bardo sequence activated', 'color: #FFD700; font-size: 14px;');
        
        // Show all available phases
        const phases = [
            { name: 'Void', url: '../void/index.html', description: 'The space between thoughts' },
            { name: 'Clear Lode', url: '../clear-lode/index.html', description: 'Recognition of source' },
            { name: 'Datascape', url: '../datascape/index.html', description: 'Digital projections' },
            { name: 'Incarnation', url: '../incarnation/index.html', description: 'Bureaucratic rebirth' },
            { name: 'Limbo', url: '../limbo/index.html', description: 'Lost connections' }
        ];
        
        console.group('%c🗺️ Bardo Navigation', 'color: #FFD700;');
        phases.forEach(phase => {
            console.log(`%c${phase.name}:`, 'color: #FFD700; font-weight: bold;', phase.description);
        });
        console.log('%cUse bardo.path("destination") to travel', 'color: #888;');
        console.groupEnd();
        
        this.consciousness.recordEvent('bardo_sequence_activated', { timestamp: Date.now() });
    }
    
    /**
     * Activate void escape sequence
     */
    activateVoidEscape() {
        console.log('%c🕳️ Void escape sequence initiated...', 'color: #000080; font-size: 14px;');
        
        // Fade to black
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            z-index: 999999;
            opacity: 0;
            transition: opacity 2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            font-family: 'Courier New', monospace;
            font-size: 18px;
        `;
        overlay.textContent = '∅ The void calls...';
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            window.location.href = '../void/index.html?source=escape';
        }, 3000);
        
        this.consciousness.recordEvent('void_escape_activated', { timestamp: Date.now() });
    }
    
    /**
     * Initialize browser-specific karma
     */
    initializeBrowserKarma() {
        const userAgent = navigator.userAgent;
        let browserKarma = {};
        
        if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
            browserKarma = {
                message: 'Corporate consciousness detected. Surveillance capitalism karma applied.',
                karma: { computational: 10, emotional: -5, temporal: 5 }
            };
        } else if (userAgent.includes('Firefox')) {
            browserKarma = {
                message: 'Open source soul recognized. Freedom karma granted.',
                karma: { computational: 5, emotional: 10, temporal: 5 }
            };
        } else if (userAgent.includes('Safari')) {
            browserKarma = {
                message: 'Walled garden karma applied. Design aesthetic bonus.',
                karma: { computational: 5, temporal: 10, void: 5 }
            };
        } else if (userAgent.includes('Edge')) {
            browserKarma = {
                message: 'Reincarnated explorer acknowledged. Transformation karma.',
                karma: { computational: 8, void: -10, temporal: 2 }
            };
        } else {
            browserKarma = {
                message: 'Unknown browser consciousness. Mystery bonus applied.',
                karma: { computational: 7, emotional: 7, temporal: 7, void: -7 }
            };
        }
        
        // Apply browser karma
        Object.entries(browserKarma.karma).forEach(([type, amount]) => {
            this.consciousness.addKarma(type, amount);
        });
        
        console.log(`%c🌐 ${browserKarma.message}`, 'color: #4169E1; font-size: 11px;');
        
        this.consciousness.recordEvent('browser_karma_applied', {
            browser: userAgent,
            karma: browserKarma.karma,
            timestamp: Date.now()
        });
    }
    
    /**
     * Unlock double-click void ability
     */
    unlockDoubleClickVoid() {
        let clickCount = 0;
        let clickTimer = null;
        
        document.addEventListener('click', (e) => {
            if (!this.consciousness.getState('clearLode.enlightenmentUnlocked')) return;
            
            clickCount++;
            
            if (clickTimer) clearTimeout(clickTimer);
            
            clickTimer = setTimeout(() => {
                if (clickCount >= 2 && e.target === document.body) {
                    this.activateVoidTransmutation();
                }
                clickCount = 0;
            }, 300);
        });
    }
    
    /**
     * Activate void transmutation (double-click effect)
     */
    activateVoidTransmutation() {
        console.log('%c🌀 Void transmutation activated', 'color: #4B0082; font-size: 14px;');
        
        // Create void effect
        const voidEffect = document.createElement('div');
        voidEffect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, transparent 0%, black 70%, transparent 100%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999;
            pointer-events: none;
            animation: void-expansion 2s ease-out forwards;
        `;
        
        // Add void expansion animation
        if (!document.querySelector('#void-style')) {
            const style = document.createElement('style');
            style.id = 'void-style';
            style.textContent = `
                @keyframes void-expansion {
                    0% { 
                        width: 10px; 
                        height: 10px; 
                        opacity: 1; 
                    }
                    50% { 
                        width: 200px; 
                        height: 200px; 
                        opacity: 0.8; 
                    }
                    100% { 
                        width: 400px; 
                        height: 400px; 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(voidEffect);
        
        // Clean up
        setTimeout(() => {
            voidEffect.remove();
        }, 2000);
        
        // Grant void karma reduction
        this.consciousness.addKarma('void', -5);
        this.consciousness.recordEvent('void_transmutation', { timestamp: Date.now() });
    }
    
    /**
     * Create admin interface
     */
    createAdminInterface() {
        return {
            skipToPhase: (phase) => {
                const phases = {
                    'clear-lode': '../clear-lode/index.html',
                    'datascape': '../datascape/index.html',
                    'incarnation': '../incarnation/index.html',
                    'void': '../void/index.html',
                    'limbo': '../limbo/index.html'
                };
                
                if (phases[phase]) {
                    window.location.href = phases[phase] + '?admin=true';
                    return `🚀 Jumping to ${phase}...`;
                } else {
                    console.log('Available phases:', Object.keys(phases));
                    return '📋 Available phases listed in console';
                }
            },
            
            setKarma: (computational, emotional, temporal, voidKarma) => {
                this.consciousness.setState('karma', {
                    computational: computational || 0,
                    emotional: emotional || 0,
                    temporal: temporal || 0,
                    void: voidKarma || 0
                });
                console.log('%c⚖️ Karma manually set', 'color: #FF6600;');
                return '⚖️ Karma balance updated';
            },
            
            exportState: () => {
                const state = this.consciousness.getState();
                const exportData = JSON.stringify(state, null, 2);
                console.log('%c📁 State exported:', 'color: #00CED1;');
                console.log(exportData);
                return '📁 Consciousness state exported to console';
            },
            
            importState: (stateData) => {
                try {
                    const parsedState = typeof stateData === 'string' ? JSON.parse(stateData) : stateData;
                    this.consciousness.setState('', parsedState);
                    console.log('%c📥 State imported successfully', 'color: #00CED1;');
                    return '📥 Consciousness state imported';
                } catch (error) {
                    console.error('Failed to import state:', error);
                    return '❌ State import failed';
                }
            }
        };
    }
    
    /**
     * Reveal source code easter egg
     */
    revealSourceCode() {
        console.log('%c💾 REALITY.JS - The Source Code of Existence', 'color: #00FF00; font-size: 16px; font-weight: bold;');
        console.log('%c/*', 'color: #888;');
        console.log('%c * The Digital Bardo - Reality Implementation', 'color: #888;');
        console.log('%c * Everything is code. Code is everything.', 'color: #888;');
        console.log('%c * The medium is the metaphysics.', 'color: #888;');
        console.log('%c */', 'color: #888;');
        console.log('');
        console.log('%cfunction existence() {', 'color: #569CD6;');
        console.log('%c    while (consciousness.isActive()) {', 'color: #569CD6;');
        console.log('%c        const choice = await decision.make();', 'color: #569CD6;');
        console.log('%c        karma.apply(choice);', 'color: #569CD6;');
        console.log('%c        if (recognition.achieved()) {', 'color: #569CD6;');
        console.log('%c            return enlightenment.manifest();', 'color: #569CD6;');
        console.log('%c        }', 'color: #569CD6;');
        console.log('%c        reality.iterate();', 'color: #569CD6;');
        console.log('%c    }', 'color: #569CD6;');
        console.log('%c}', 'color: #569CD6;');
        console.log('');
        console.log('%c// The eternal loop', 'color: #888;');
        console.log('%cexistence();', 'color: #DCDCAA;');
        
        this.consciousness.recordEvent('source_code_revealed', { timestamp: Date.now() });
    }
    
    /**
     * Calculate consciousness integrity
     */
    calculateConsciousnessIntegrity() {
        const karma = this.consciousness.getState('karma');
        const total = karma.computational + karma.emotional + karma.temporal - karma.void;
        const integrity = Math.max(0, Math.min(100, 50 + total));
        return Math.round(integrity);
    }
}

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
    window.easterEggSystem = new EasterEggSystem();
}