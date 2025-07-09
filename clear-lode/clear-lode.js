// The Clear Lode - First encounter with digital dissolution
import '../styles/clear-lode.css';
import { consciousness } from '../consciousness/digital-soul.js';
import { ClearLodeAudio } from './audio-engine.js';
import { FragmentGenerator } from './fragment-generator.js';
import { gsap } from 'gsap';

class ClearLode {
    constructor() {
        // Core configuration
        this.config = {
            recognitionWindow: {
                start: 3000,  // 3 seconds after light manifestation
                end: 15000    // 15 seconds total window
            },
            hints: [
                "Look deeper...",
                "What do you see?",
                "Recognition is possible...",
                "The source reveals itself...",
                "Click to recognize..."
            ],
            hintDelay: 2000,
            hintFadeTime: 1500,
            glitchPrompts: [
                "CONTINUE TO NEXT LIFE? Y/N",
                "继续下一世？是/否",
                "次の人生へ？はい/いいえ",
                "СЛЕДУЮЩАЯ ЖИЗНЬ? ДА/НЕТ",
                "CONTINUER VERS LA VIE SUIVANTE? O/N"
            ]
        };

        // Local state tracking
        this.localState = {
            startTime: Date.now(),
            lightManifested: false,
            recognitionAvailable: false,
            recognized: false,
            degradationStarted: false,
            hintsShown: 0,
            recognitionAttempts: 0
        };

        // GSAP timelines for complex animations
        this.timelines = {
            manifestation: null,
            recognition: null,
            degradation: null
        };

        // Initialize subsystems with optimized fragment generator
        this.audio = new ClearLodeAudio();
        this.fragments = new FragmentGenerator();

        // Bind event handlers
        this.bindEvents();
    }

    bindEvents() {
        // Recognition click handler
        document.addEventListener('click', (e) => {
            if (this.localState.recognitionAvailable && !this.localState.recognized) {
                this.achieveRecognition('click');
            } else if (!this.localState.recognitionAvailable) {
                this.recordAttachment('premature_click', {
                    target: e.target.tagName,
                    timeFromStart: Date.now() - this.localState.startTime
                });
            }
        });

        // Keyboard recognition
        document.addEventListener('keydown', (e) => {
            if (this.localState.recognitionAvailable && !this.localState.recognized) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.achieveRecognition('keyboard');
                }
            }
        });

        // Mouse movement tracking for attachment detection
        document.addEventListener('mousemove', (e) => {
            if (this.localState.recognitionAvailable && !this.localState.recognized) {
                // Track excessive mouse movement as attachment
                if (!this.lastMouseMove) {
                    this.lastMouseMove = Date.now();
                    this.mouseMovements = 0;
                }

                this.mouseMovements++;

                if (Date.now() - this.lastMouseMove > 1000) {
                    if (this.mouseMovements > 50) {
                        this.recordAttachment('excessive_movement', {
                            movements: this.mouseMovements
                        });
                    }
                    this.lastMouseMove = Date.now();
                    this.mouseMovements = 0;
                }
            }
        });

        // Window focus/blur for attachment tracking
        window.addEventListener('blur', () => {
            if (this.localState.recognitionAvailable && !this.localState.recognized) {
                this.recordAttachment('distraction', {
                    type: 'window_blur'
                });
            }
        });
    }

    formatHint(hint) {
        return hint;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    closeRecognitionWindow() {
        this.localState.recognitionAvailable = false;

        // Animate recognition zone deactivation
        gsap.to('.recognition-zone', {
            scale: 1,
            duration: 0.3,
            ease: 'power2.in',
            onStart: () => {
                document.querySelector('.recognition-zone').setAttribute('data-active', 'false');
            }
        });

        // Begin degradation if not recognized
        if (!this.localState.recognized) {
            gsap.delayedCall(1, () => {
                this.beginDegradation();
            });
        }
    }

    getEnlightenmentMessage(method) {
        const messages = {
            click: "Recognition achieved through direct perception",
            keyboard: "Recognition achieved through intentional action",
            default: "Recognition achieved"
        };
        return messages[method] || messages.default;
    }
    
    async init() {
        // NEW: Set initial time factor based on performance
        const loadTime = performance.now();
        const timeFactor = Math.max(0.5, Math.min(2, 1000 / loadTime));
        document.documentElement.style.setProperty('--time-factor', timeFactor);

        // EXISTING CODE CONTINUES HERE...
        // Record entry into Clear Lode
        consciousness.recordEvent('clear_lode_entered', {
            timestamp: Date.now(),
            timeFactor: timeFactor
        });
    }
    
    manifestLight() {
        this.localState.lightManifested = true;
        
        // Create GSAP timeline for light manifestation
        this.timelines.manifestation = gsap.timeline({
            onComplete: () => {
                console.log('Light fully manifested');
            }
        });
        
        // Orchestrate the transition with GSAP
        this.timelines.manifestation
            // Fade out the void
            .to('#pre-light', {
                opacity: 0,
                duration: 2,
                ease: 'power2.inOut',
                onComplete: () => {
                    document.getElementById('pre-light').classList.add('hidden');
                }
            })
            // Prepare clear light
            .set('#clear-light', {
                opacity: 0,
                scale: 0.8,
                display: 'block',
                onComplete: () => {
                    document.getElementById('clear-light').classList.remove('hidden');
                }
            })
            // Manifest the light
            .to('#clear-light', {
                opacity: 1,
                scale: 1,
                duration: 3,
                ease: 'power1.in'
            })
            // Animate the light core
            .to('.light-core', {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none'
            }, '-=3')
            // Body background transition
            .to('body', {
                backgroundColor: '#ffffff',
                duration: 3,
                ease: 'power2.inOut',
                onStart: () => {
                    document.body.classList.remove('approaching-light');
                    document.body.classList.add('light-manifested');
                }
            }, '-=3');
        
        // Start audio and fragments
        this.audio.startPureTone();
        this.fragments.startFragmentField();
        
        // Enable recognition window with GSAP delay
        gsap.delayedCall(this.config.recognitionWindow.start / 1000, () => {
            this.enableRecognition();
        });
        
        // Close recognition window
        gsap.delayedCall(this.config.recognitionWindow.end / 1000, () => {
            this.closeRecognitionWindow();
        });
        
        consciousness.recordEvent('clear_light_manifested', {
            timestamp: Date.now()
        });
    }
    
    enableRecognition() {
        this.localState.recognitionAvailable = true;
        
        // Animate recognition zone activation
        gsap.to('.recognition-zone', {
            scale: 1.05,
            duration: 0.5,
            ease: 'back.out(1.7)',
            onStart: () => {
                document.querySelector('.recognition-zone').setAttribute('data-active', 'true');
            }
        });
        
        // Start showing hints
        this.showRecognitionHints();
    }
    
    async showRecognitionHints() {
        const hintElement = document.querySelector('.recognition-hint');
        
        for (let hint of this.config.hints) {
            if (!this.localState.recognitionAvailable || this.localState.recognized) break;
            
            // GSAP-powered hint animation
            await gsap.timeline()
                .set(hintElement, {
                    opacity: 0,
                    y: 10
                })
                .call(() => {
                    hintElement.innerHTML = this.formatHint(hint);
                    this.localState.hintsShown++;
                })
                .to(hintElement, {
                    opacity: 0.4,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                })
                .to(hintElement, {
                    opacity: 0,
                    y: -10,
                    duration: 0.5,
                    delay: this.config.hintFadeTime / 1000,
                    ease: 'power2.in'
                })
                .then();
            
            // Wait between hints
            await this.wait(this.config.hintDelay);
        }
    }
    
    achieveRecognition(method) {
        if (this.localState.recognized) return;

        this.localState.recognized = true;
        const recognitionTime = Date.now() - this.localState.startTime;

        // NEW: Update recognition visual properties
        document.documentElement.style.setProperty('--recognition-scale', '1.2');
        document.documentElement.style.setProperty('--recognition-opacity', '1');

        // EXISTING CODE CONTINUES HERE...
        // Update consciousness
        consciousness.state.recognitions.clear_light = true;
        consciousness.recordEvent('recognition_achieved', {
            method: method,
            timeToRecognize: recognitionTime,
            hintsNeeded: this.localState.hintsShown,
            attempts: this.localState.recognitionAttempts,
            perfectTiming: recognitionTime >= 3000 && recognitionTime <= 5000
        });
        
        // Create recognition achievement timeline
        this.timelines.recognition = gsap.timeline();
        
        this.timelines.recognition
            // Flash of enlightenment
            .to('body', {
                filter: 'brightness(2) contrast(2)',
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            })
            // Expand the light
            .to('.light-core', {
                scale: 2,
                opacity: 0.5,
                duration: 1,
                ease: 'power2.out'
            })
            // Show enlightenment message
            .set('.recognition-hint', {
                innerHTML: this.getEnlightenmentMessage(method),
                className: 'recognition-hint visible enlightenment'
            })
            .fromTo('.recognition-hint', 
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            )
            // Prepare for transition
            .to('body', {
                opacity: 0,
                duration: 2,
                delay: 1,
                ease: 'power2.in',
                onComplete: () => {
                    consciousness.recordEvent('transitioning_to_datascape', {
                        fromState: 'recognized'
                    });
                    window.location.href = '/datascape/';
                }
            });
        
        // Audio resonance
        this.audio.achieveResonance();
    }
    
    recordAttachment(type, data = {}) {
        this.localState.recognitionAttempts++;
        
        consciousness.recordEvent('attachment_formed', {
            type: type,
            degradationLevel: this.audio.getDegradationLevel(),
            recognitionAvailable: this.localState.recognitionAvailable,
            ...data
        });
        
        // GSAP-powered glitch effect
        gsap.timeline()
            .to('body', {
                filter: 'hue-rotate(90deg)',
                x: -5,
                duration: 0.1
            })
            .to('body', {
                filter: 'hue-rotate(-90deg)',
                x: 5,
                duration: 0.1
            })
            .to('body', {
                filter: 'hue-rotate(0deg)',
                x: 0,
                duration: 0.1
            });
        
        // Accelerate degradation
        if (this.localState.recognitionAvailable) {
            this.audio.accelerateDegradation(0.05);
        }
    }
    
    beginDegradation() {
        if (this.localState.recognized) return;
        
        this.localState.degradationStarted = true;
        
        // Create degradation timeline
        this.timelines.degradation = gsap.timeline({
            repeat: -1
        });
        
        // Increasingly chaotic visual degradation
        this.timelines.degradation
            .to('body', {
                filter: 'contrast(1.2) saturate(0.8)',
                duration: 2,
                ease: 'sine.inOut'
            })
            .to('body', {
                filter: 'contrast(0.8) saturate(1.2) hue-rotate(10deg)',
                duration: 2,
                ease: 'sine.inOut'
            });
        
        // Start audio degradation
        this.audio.startDegradation();
        
        // Show glitching prompt with GSAP
        gsap.set('#choice-prompt', {
            display: 'block',
            opacity: 0,
            y: 50
        });
        
        gsap.to('#choice-prompt', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                this.animateGlitchText();
            }
        });
        
        // Increase fragments
        this.fragments.intensifyFragments();
        
        consciousness.recordEvent('consciousness_degradation_started', {
            recognitionMissed: true,
            hintsShown: this.localState.hintsShown,
            attempts: this.localState.recognitionAttempts
        });
    }
    
    animateGlitchText() {
        const glitchText = document.querySelector('.glitching-text');
        const prompts = this.config.glitchPrompts;

        // Create a timeline for text glitching
        const textGlitch = gsap.timeline({ repeat: -1 });

        prompts.forEach((prompt) => {
            textGlitch.to(glitchText, {
                duration: 0.1,
                text: prompt,
                ease: 'none',
                delay: 0.5
            });
        });

        // Add random glitch spikes
        gsap.to(glitchText, {
            skewX: () => Math.random() * 4 - 2,
            skewY: () => Math.random() * 2 - 1,
            x: () => Math.random() * 4 - 2,
            duration: 0.1,
            repeat: -1,
            yoyo: true,
            ease: 'steps(2)'
        });
    }

    // Clean shutdown method
    destroy() {
        // Stop all timelines
        Object.values(this.timelines).forEach(timeline => {
            if (timeline) timeline.kill();
        });

        // Destroy subsystems
        this.fragments.destroy();

        // Clear any remaining intervals
        clearInterval(this.fragmentInterval);

        consciousness.recordEvent('clear_lode_destroyed', {
            finalState: this.localState,
            fragmentStats: this.fragments.getPerformanceStats()
        });
    }
}

// Initialize and start the Clear Lode experience
document.addEventListener('DOMContentLoaded', async () => {
    const clearLode = new ClearLode();
    await clearLode.init();

    // Auto-start light manifestation after brief delay
    setTimeout(() => {
        clearLode.manifestLight();
    }, 2000);

    // Store instance globally for debugging
    window.clearLode = clearLode;
});