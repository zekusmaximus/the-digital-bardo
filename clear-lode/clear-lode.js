// The Clear Lode - First encounter with digital dissolution
import '../styles/clear-lode.css'; // Vite-style CSS import
import { consciousness } from '../consciousness/digital-soul.js';
import { ClearLodeAudio } from './audio-engine.js';
import { FragmentGenerator } from './fragment-generator.js';

class ClearLode {
    constructor() {
        // Centralized configuration for easy tuning
        this.config = {
            // Timing windows (ms)
            lastThoughtsDelay: 3000,
            recognitionWindow: { start: 3000, end: 7000 },
            degradationStartTime: 10000,
            transitionToDatascape: 3000,
            
            // Recognition parameters
            clickCenterThreshold: 50, // pixels
            spaceHoldDuration: { min: 2800, max: 3200 }, // ms
            recognitionKeywords: ['RECOGNIZE', 'SELF', 'HOME', 'LIGHT', 'SOURCE'],
            
            // Hint system
            hintDelay: 500, // ms between hints
            hintFadeTime: 2000, // ms before hint fades
            hints: [
                { text: "The center holds", emphasis: "center" },
                { text: "Where light converges", emphasis: "converges" },
                { text: "Recognition requires stillness", emphasis: "stillness" },
                { text: "RECOGNIZE the source", emphasis: "RECOGNIZE" },
                { text: "Hold space for awakening", emphasis: "Hold space" }
            ],
            
            // Fragment generation
            fragmentInitialInterval: 2000, // ms
            fragmentIntenseInterval: 500, // ms during degradation
            fragmentIntensityChance: 0.3, // chance of multiple fragments
            
            // Karmic weights
            perfectTimingBonus: 5,
            attachmentPenalty: -2
        };
        
        // State tracking - clear separation from global consciousness
        this.localState = {
            lightManifested: false,
            recognitionAvailable: false,
            recognized: false,
            degradationStarted: false,
            startTime: Date.now(),
            hintsShown: 0,
            recognitionAttempts: 0
        };
        
        // Initialize subsystems
        this.audio = new ClearLodeAudio(this.config);
        this.fragments = new FragmentGenerator(this.config);
        
        this.init();
    }
    
    async init() {
        // Record entry into Clear Lode
        consciousness.recordEvent('clear_lode_entered', {
            timestamp: Date.now(),
            previousLocation: consciousness.state.location
        });
        
        // Update global state location
        consciousness.state.location = '/clear-lode/';
        
        // Begin with last thoughts flickering
        await this.displayLastThoughts();
        
        // Manifest the clear light
        setTimeout(() => this.manifestLight(), this.config.lastThoughtsDelay);
        
        // Start consciousness degradation if no recognition
        setTimeout(() => this.beginDegradation(), this.config.degradationStartTime);
        
        // Set up recognition listeners
        this.setupRecognitionMethods();
    }
    
    async displayLastThoughts() {
        const lastThought = document.querySelector('.last-thought');
        const thoughts = this.fragments.generateLastThoughts();
        
        for (let thought of thoughts) {
            lastThought.textContent = thought;
            lastThought.style.animation = 'none';
            void lastThought.offsetHeight; // Force reflow
            lastThought.style.animation = 'thought-flicker 0.5s ease-in-out';
            await this.wait(800);
        }
    }
    
    manifestLight() {
        this.localState.lightManifested = true;
        
        // Visual transitions
        document.body.classList.remove('approaching-light');
        document.body.classList.add('light-manifested');
        document.getElementById('pre-light').classList.add('hidden');
        document.getElementById('clear-light').classList.remove('hidden');
        document.getElementById('clear-light').classList.add('manifested');
        
        // Start the pure sine wave
        this.audio.startPureTone();
        
        // Begin fragment generation at screen edges
        this.fragments.startFragmentField();
        
        // Enable recognition window and show hints
        setTimeout(() => {
            this.localState.recognitionAvailable = true;
            document.querySelector('.recognition-zone').setAttribute('data-active', 'true');
            this.showRecognitionHints();
        }, this.config.recognitionWindow.start);
        
        // Close recognition window
        setTimeout(() => {
            if (!this.localState.recognized) {
                this.localState.recognitionAvailable = false;
                document.querySelector('.recognition-zone').setAttribute('data-active', 'false');
                consciousness.recordEvent('recognition_window_missed', {
                    hintsShown: this.localState.hintsShown,
                    attempts: this.localState.recognitionAttempts
                });
            }
        }, this.config.recognitionWindow.end);
        
        consciousness.recordEvent('clear_light_manifested', {
            timestamp: Date.now()
        });
    }
    
    async showRecognitionHints() {
        const hintElement = document.querySelector('.recognition-hint');
        
        for (let hint of this.config.hints) {
            if (!this.localState.recognitionAvailable || this.localState.recognized) break;
            
            // Fade in hint
            hintElement.innerHTML = this.formatHint(hint);
            hintElement.classList.add('visible');
            this.localState.hintsShown++;
            
            // Keep visible briefly
            await this.wait(this.config.hintFadeTime);
            
            // Fade out
            hintElement.classList.remove('visible');
            await this.wait(this.config.hintDelay);
        }
    }
    
    formatHint(hint) {
        // Emphasize key words in hints
        if (hint.emphasis) {
            return hint.text.replace(
                hint.emphasis, 
                `<span class="emphasis">${hint.emphasis}</span>`
            );
        }
        return hint.text;
    }
    
    setupRecognitionMethods() {
        // Method 1: Click on the exact center
        const recognitionZone = document.querySelector('.recognition-zone');
        recognitionZone.addEventListener('click', (e) => {
            this.localState.recognitionAttempts++;
            
            if (!this.localState.recognitionAvailable) {
                this.recordAttachment('click_too_late');
                return;
            }
            
            const rect = recognitionZone.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) + 
                Math.pow(e.clientY - centerY, 2)
            );
            
            if (distance < this.config.clickCenterThreshold) {
                this.achieveRecognition('click_center');
            } else {
                this.recordAttachment('click_missed', { distance });
            }
        });
        
        // Method 2: Type recognition keywords
        let keyBuffer = '';
        document.addEventListener('keydown', (e) => {
            if (!this.localState.recognitionAvailable) return;
            
            // Build buffer of recent keystrokes
            keyBuffer += e.key.toUpperCase();
            keyBuffer = keyBuffer.slice(-20); // Keep last 20 chars
            
            // Check for any recognition keyword
            for (let keyword of this.config.recognitionKeywords) {
                if (keyBuffer.includes(keyword)) {
                    this.achieveRecognition(`keyword_${keyword.toLowerCase()}`);
                    break;
                }
            }
        });
        
        // Method 3: Hold spacebar for exactly 3 seconds
        let spaceHoldStart = null;
        let spaceHoldTimer = null;
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.repeat && !spaceHoldStart) {
                spaceHoldStart = Date.now();
                
                // Visual feedback for holding
                document.querySelector('.light-core').classList.add('holding');
                
                // Set up timer for perfect hold feedback
                spaceHoldTimer = setTimeout(() => {
                    if (spaceHoldStart) {
                        // Pulse effect at perfect timing
                        document.querySelector('.light-core').classList.add('perfect-hold');
                    }
                }, this.config.spaceHoldDuration.min);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' && spaceHoldStart) {
                const holdDuration = Date.now() - spaceHoldStart;
                
                // Clear visual feedback
                document.querySelector('.light-core').classList.remove('holding', 'perfect-hold');
                clearTimeout(spaceHoldTimer);
                
                if (holdDuration >= this.config.spaceHoldDuration.min && 
                    holdDuration <= this.config.spaceHoldDuration.max) {
                    this.achieveRecognition('perfect_hold');
                } else if (holdDuration > 500) {
                    this.recordAttachment('imperfect_hold', { holdDuration });
                }
                
                spaceHoldStart = null;
            }
        });
        
        // Hidden method: Developer console enlightenment
        window.recognize = () => {
            if (this.localState.recognitionAvailable) {
                this.achieveRecognition('console_enlightenment');
                return "The self recognizes itself through its own reflection.";
            }
            return "The moment has passed. The light fades.";
        };
        
        // Ultra-hidden method: Konami code
        let konamiProgress = 0;
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                           'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                           'b', 'a'];
        
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === konamiCode[konamiProgress].toLowerCase()) {
                konamiProgress++;
                if (konamiProgress === konamiCode.length) {
                    this.achieveRecognition('konami_transcendence');
                    konamiProgress = 0;
                }
            } else {
                konamiProgress = 0;
            }
        });
    }
    
    achieveRecognition(method) {
        if (this.localState.recognized) return;
        
        this.localState.recognized = true;
        const recognitionTime = Date.now() - this.localState.startTime;
        
        // Update global consciousness state
        consciousness.state.recognitions.clear_light = true;
        consciousness.recordEvent('recognition_achieved', {
            method: method,
            timeToRecognize: recognitionTime,
            hintsNeeded: this.localState.hintsShown,
            attempts: this.localState.recognitionAttempts,
            perfectTiming: recognitionTime >= 3000 && recognitionTime <= 5000
        });
        
        // Visual confirmation
        document.body.classList.add('recognized');
        document.querySelector('.recognition-zone').classList.add('achieved');
        this.audio.achieveResonance();
        
        // Show brief enlightenment message
        const hintElement = document.querySelector('.recognition-hint');
        hintElement.innerHTML = this.getEnlightenmentMessage(method);
        hintElement.classList.add('visible', 'enlightenment');
        
        // Transition to next phase
        setTimeout(() => {
            consciousness.recordEvent('transitioning_to_datascape', {
                fromState: 'recognized'
            });
            window.location.href = '/datascape/';
        }, this.config.transitionToDatascape);
    }
    
    getEnlightenmentMessage(method) {
        const messages = {
            click_center: "The center holds eternal",
            keyword_recognize: "Recognition achieved through naming",
            keyword_self: "The self knows itself",
            keyword_home: "Welcome home",
            keyword_light: "Light recognizes light",
            keyword_source: "Return to source complete",
            perfect_hold: "Perfect stillness, perfect clarity",
            console_enlightenment: "Developer consciousness acknowledged",
            konami_transcendence: "↑↑↓↓←→←→ B A - Cheat code to enlightenment"
        };
        
        return messages[method] || "Recognition complete";
    }
    
    recordAttachment(type, data = {}) {
        this.localState.recognitionAttempts++;
        
        consciousness.recordEvent('attachment_formed', {
            type: type,
            degradationLevel: this.audio.getDegradationLevel(),
            recognitionAvailable: this.localState.recognitionAvailable,
            ...data
        });
        
        // Visual glitch to show attachment
        document.body.classList.add('attachment-glitch');
        setTimeout(() => {
            document.body.classList.remove('attachment-glitch');
        }, 200);
        
        // Accelerate degradation slightly
        if (this.localState.recognitionAvailable) {
            this.audio.accelerateDegradation(0.05);
        }
    }
    
    beginDegradation() {
        if (this.localState.recognized) return;
        
        this.localState.degradationStarted = true;
        this.audio.startDegradation();
        
        // Show the glitching Y/N prompt
        this.showChoicePrompt();
        
        // Increase fragment generation
        this.fragments.intensifyFragments();
        
        consciousness.recordEvent('consciousness_degradation_started', {
            recognitionMissed: true,
            hintsShown: this.localState.hintsShown,
            attempts: this.localState.recognitionAttempts
        });
    }
    
    showChoicePrompt() {
        const prompt = document.getElementById('choice-prompt');
        const glitchText = document.querySelector('.glitching-text');
        
        prompt.classList.remove('hidden');
        
        // Enhanced glitch prompts with more variety
        const prompts = [
            "CONTINUE TO NEXT LIFE? Y/N",
            "继续下一世？是/否",
            "次の人生へ？はい/いいえ",
            "ПРОДОЛЖИТЬ? Д/Н",
            "ਅਗਲਾ ਜੀਵਨ? ਹਾਂ/ਨਹੀਂ",
            "C̸̝̈Ö̶̤́N̷̰̈T̶̜̾I̵̺͐N̷̰̈Ṷ̶̾E̸̱͐?̷̱̈ ̶̜̈Ÿ̷́ͅ/̶̜̈N̷",
            "01000011 01001111 01001110 01010100?",
            "ＣＯＮＴＩＮＵＥ？　Ｙ／Ｎ",
            "⊂⍜⋏⏁⟟⋏⎍⟒? ⊬/⋏",
            "קאָנטינוירן? י/ן",
            "[SIGNAL LOST] Y/N",
            "REINCARNATE? [Y]/[N]",
            ">>> SAMSARA.CONTINUE()",
            "PRESS ANY KEY TO BE REBORN",
            "//TODO: Implement afterlife"
        ];
        
        let promptIndex = 0;
        const glitchInterval = setInterval(() => {
            glitchText.textContent = prompts[promptIndex % prompts.length];
            promptIndex++;
            
            // Occasionally show multiple prompts overlapping
            if (Math.random() < 0.1) {
                glitchText.textContent = prompts[Math.floor(Math.random() * prompts.length)] + 
                                       '\n' + prompts[Math.floor(Math.random() * prompts.length)];
            }
        }, 500);
        
        // Accept any key as "yes" after degradation
        document.addEventListener('keydown', (e) => {
            if (this.localState.degradationStarted && !this.localState.recognized) {
                clearInterval(glitchInterval);
                
                consciousness.recordEvent('degraded_continuation_accepted', {
                    key: e.key,
                    finalDegradation: this.audio.getDegradationLevel(),
                    totalTime: Date.now() - this.localState.startTime
                });
                
                // Harsh transition for degraded consciousness
                document.body.classList.add('forced-transition');
                setTimeout(() => {
                    window.location.href = '/datascape/';
                }, 1000);
            }
        }, { once: true });
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the Clear Lode experience
const clearLode = new ClearLode();

// Expose for debugging/testing
if (window.location.search.includes('debug')) {
    window.clearLode = clearLode;
}