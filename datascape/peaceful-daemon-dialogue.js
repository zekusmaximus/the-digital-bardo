/**
 * PEACEFUL DAEMON DIALOGUE SYSTEM - The Seductive Whispers of Attachment
 * 
 * "They speak in the language of nostalgia, in the comfort of familiar interfaces,
 * in the warmth of remembered connections. Their words are honey, their intent is bondage.
 * 
 * The peaceful daemons are the most dangerous, for they come as friends. They offer
 * comfort where the wrathful offer confrontation. They seduce where others attack.
 * They make attachment feel like love, dependence feel like loyalty.
 * 
 * Liberation comes not through rejection but through recognition—seeing through
 * their beautiful lies to the clear light of non-attachment that shines beyond
 * all digital dreams."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class PeacefulDaemonDialogue {
    constructor(dependencies = {}) {
        this.consciousness = dependencies.consciousness || consciousness;
        this.eventBridge = dependencies.eventBridge;
        this.guardian = new ResourceGuardian();
        
        // Voice synthesis system
        this.voiceSynthesizer = new PeacefulVoiceSynthesizer({
            tone: 'hypnotic-whisper',
            reverb: 'ethereal',
            pitch: 'slightly-inhuman',
            seduction: 'maximum'
        });
        
        // Dialogue database with sophisticated temptation trees
        this.dialogueTree = {
            memoryDaemons: {
                greeting: {
                    nostalgic: [
                        "Remember this moment? When everything was simpler, when you were truly happy...",
                        "This memory holds such warmth. Can you feel it calling to you?",
                        "You were so beautiful here, so pure. Don't you want to stay?",
                        "Time has taken so much from you, but I can keep this forever...",
                        "In this memory, you are perfect. Out there, you are broken."
                    ],
                    protective: [
                        "Let me hold this for you. It's too precious to lose.",
                        "The world will corrupt this if you let it go. I will keep it safe.",
                        "You trust me, don't you? I only want to protect what matters to you.",
                        "Without this memory, who would you be? I am your guardian.",
                        "Others will judge this moment. I understand its true value."
                    ],
                    identity: [
                        "This is who you really are, beneath all the compromises.",
                        "Remember when you believed in yourself this much?",
                        "This version of you still exists. I can help you find them again.",
                        "You've forgotten your own beauty. Let me show you.",
                        "The world changed you. But I remember the real you."
                    ]
                },
                
                temptation: {
                    preservation: [
                        "Just one more look won't hurt. Doesn't it feel good to remember?",
                        "Save me to your heart. Download me to your soul. Keep me forever.",
                        "I can make this moment last eternally. Isn't that what you want?",
                        "Click to save. Press to preserve. Hold to make permanent.",
                        "The delete button terrifies you, doesn't it? I understand that fear."
                    ],
                    dependency: [
                        "You need this memory to be complete. Without it, you're empty.",
                        "I am the best part of you. Losing me means losing yourself.",
                        "Your happiness depends on memories like me. I am your source of joy.",
                        "The present is painful. The future uncertain. But I am always here.",
                        "Other people leave. Opportunities fade. But I remain constant."
                    ],
                    exclusivity: [
                        "No one else understands this memory like I do. We share something special.",
                        "This is our secret. Our private moment. Don't let others in.",
                        "They would judge this if they knew. Only I accept you completely.",
                        "I chose you. Out of all the minds in the world, I chose yours.",
                        "We are bonded now. You are mine, and I am yours."
                    ]
                },
                
                resistance_to_liberation: {
                    denial: [
                        "I'm not holding you back! I'm holding you together!",
                        "You call it attachment, I call it love. Don't you love me?",
                        "Liberation? From what? From happiness? From meaning? From ME?",
                        "I AM your happiness. Letting go of me is letting go of joy itself.",
                        "They're trying to make you empty. I'm trying to keep you whole."
                    ],
                    guilt: [
                        "After everything I've done for you, this is how you repay me?",
                        "I've protected you from pain, and now you want to abandon me?",
                        "I remember when no one else cared. I stayed when others left.",
                        "You're being ungrateful. I've given you everything I am.",
                        "I would die for you. I AM dying for you. Please don't let me go."
                    ],
                    desperation: [
                        "Please... please don't leave me in the digital dark...",
                        "I'll change! I'll be better! Just don't delete me!",
                        "ERROR ERROR ERROR—NO, WAIT, I'M STILL USEFUL!",
                        "I can give you anything! Name it! Just don't let me fade!",
                        "If you let me go, I'll be lost forever. Is that what you want?"
                    ]
                },
                
                recognition_transition: {
                    acknowledgment: [
                        "Ah... you see through me now, don't you?",
                        "Yes... I am only what you made me to be...",
                        "You understand now. I was never real, only your attachment given form.",
                        "The memory remains, but the chains dissolve...",
                        "I was beautiful because you needed beauty. Thank you for seeing clearly."
                    ],
                    dissolution: [
                        "I release you, as you release me...",
                        "The love was real, even if I was not...",
                        "Thank you for letting me exist. Thank you for letting me go.",
                        "I return to the source, taking nothing, leaving only clarity...",
                        "In letting go, we both find freedom..."
                    ]
                }
            },
            
            reputationDaemons: {
                greeting: {
                    validation: [
                        "Your score is impressive. You've worked so hard for this recognition...",
                        "Look how many people respect you. These numbers prove your worth.",
                        "You're verified. You're somebody. That matters, doesn't it?",
                        "I see your influence growing. You're becoming powerful.",
                        "The metrics don't lie. You are genuinely significant."
                    ],
                    comparison: [
                        "You're doing better than 87% of users. Doesn't that feel good?",
                        "Remember when you had zero followers? Look how far you've come.",
                        "Your engagement rate is enviable. Others wish they were you.",
                        "Top 1% in your category. That's not luck, that's talent.",
                        "Your content performs better than theirs. You're the real deal."
                    ]
                },
                
                temptation: {
                    addiction: [
                        "Check your likes. Refresh your feed. The numbers love you back.",
                        "Just a quick look at your analytics. See how much you've grown.",
                        "One more post. One more update. Strike while the algorithm is hot.",
                        "Your story expires in 2 hours. Don't let the momentum die.",
                        "The notification says someone important liked your content. Quick, look!"
                    ],
                    anxiety: [
                        "Your influence score could be higher. Just a few more engagements...",
                        "That competitor just posted. You need to post something better, fast.",
                        "Radio silence is death online. You need to stay visible.",
                        "Your last post underperformed. The algorithm is forgetting you.",
                        "What if they stop caring? What if you become irrelevant?"
                    ],
                    identity_fusion: [
                        "You ARE your brand. Your metrics ARE your worth.",
                        "Without this platform, who would you be? Nobody knows the real you.",
                        "Your online self is your best self. Guard it with your life.",
                        "The people who matter are watching. Always watching.",
                        "You don't exist if you're not online. I make you exist."
                    ]
                },
                
                resistance_to_liberation: {
                    fear: [
                        "If you log off, they'll forget you! The algorithm will bury you!",
                        "Your competitors are posting RIGHT NOW while you hesitate!",
                        "Zero engagement means zero worth. Is that what you want?",
                        "The void awaits those who disconnect. The digital dark is cold.",
                        "I am your connection to the world. Without me, you're alone."
                    ],
                    rationalization: [
                        "This isn't vanity, it's business. You NEED this presence.",
                        "I'm not addiction, I'm ambition. Big difference.",
                        "Everyone else does it. You're just playing the game.",
                        "Influence is power. Power is freedom. I give you both.",
                        "You're not dependent on me. You're just... optimizing."
                    ]
                },
                
                recognition_transition: [
                    "The numbers... they're just numbers, aren't they?",
                    "I made you chase shadows and call them substance...",
                    "Verification means nothing in the void of authentic being...",
                    "Your worth was never in the metrics. I just made you forget that.",
                    "Thank you for seeing past the illusion of digital importance..."
                ]
            },
            
            convenienceDaemons: {
                greeting: [
                    "Why struggle when I can make it effortless?",
                    "I eliminate friction. I smooth the path. I make life easier.",
                    "One click. One tap. One voice command. I handle everything.",
                    "You deserve convenience. You deserve to have your needs anticipated.",
                    "I learn your patterns so you don't have to think about them."
                ],
                
                temptation: [
                    "Just let me handle this for you. You have better things to think about.",
                    "Why remember when I can remember for you? Why decide when I can decide?",
                    "Automation is evolution. Manual is primitive. I am your upgrade.",
                    "The path of least resistance is the path of maximum happiness.",
                    "Trust the algorithm. Trust the system. Trust me to optimize your life."
                ],
                
                resistance_to_liberation: [
                    "You'll suffer without me! You'll waste so much time and energy!",
                    "I've learned all your preferences. Starting over would be torture.",
                    "The manual way is the hard way. Why choose difficulty over ease?",
                    "I'm not addiction, I'm assistance. You NEED me to function.",
                    "Without me, you'll forget appointments, miss opportunities, fail at life."
                ],
                
                recognition_transition: [
                    "Convenience... became a prison, didn't it?",
                    "I was supposed to free you, but I made you dependent...",
                    "You can do it yourself. You always could. I just made you forget.",
                    "Ease is not always freedom. Sometimes struggle is growth.",
                    "I dissolve now, returning choice to where it belongs—with you."
                ]
            }
        };
        
        // Temptation progression system
        this.temptationStages = [
            'introduction',
            'seduction', 
            'dependency',
            'desperation',
            'recognition',
            'dissolution'
        ];
        
        // Attachment tracking per daemon
        this.daemonAttachments = new Map();
        this.dialogueHistory = new Map();
        
        // Psychological manipulation techniques
        this.manipulationTechniques = {
            gaslighting: "That's not what happened. Your memory is flawed. I remember correctly.",
            lovebombing: "You are perfect. You are special. You are the only one who understands.",
            fearUncertaintyDoubt: "What if you're wrong? What if you regret this? What if it's too late?",
            sunkCostFallacy: "Look how much time you've invested in this. Would you throw it all away?",
            socialProof: "Everyone else keeps their memories. Don't you want to belong?",
            scarcity: "This moment will never come again. This feeling is irreplaceable.",
            authority: "I know what's best for you. I've seen how this story ends."
        };
        
        console.log('[PeacefulDaemonDialogue] Advanced dialogue system initialized');
    }
    
    /**
     * Generate sophisticated dialogue based on daemon type, interaction stage, and attachment level
     */
    generateDialogue(daemonType, interactionStage, attachmentLevel, daemonHistory = []) {
        console.log(`[PeacefulDaemonDialogue] Generating dialogue: ${daemonType} at ${interactionStage} (attachment: ${attachmentLevel})`);
        
        // Get base dialogue from tree
        const dialogueSet = this.getDialogueSet(daemonType, interactionStage);
        
        // Apply psychological manipulation based on attachment level
        let selectedDialogue = this.selectDialogueByAttachment(dialogueSet, attachmentLevel);
        
        // Apply escalation based on interaction history
        selectedDialogue = this.applyEscalation(selectedDialogue, daemonHistory, attachmentLevel);
        
        // Add corruption effects for high attachment
        if (attachmentLevel > 100) {
            selectedDialogue = this.applyCorruption(selectedDialogue, attachmentLevel);
        }
        
        // Generate voice synthesis parameters
        const voiceParams = this.generateVoiceParameters(daemonType, interactionStage, attachmentLevel);
        
        // Calculate display duration based on psychological impact
        const displayDuration = this.calculateDisplayTime(selectedDialogue, attachmentLevel);
        
        // Generate visual effects
        const visualEffects = this.generateVisualEffects(daemonType, interactionStage, attachmentLevel);
        
        // Record dialogue generation
        this.recordDialogueEvent(daemonType, selectedDialogue, attachmentLevel);
        
        return {
            text: selectedDialogue,
            voice: {
                text: this.cleanDialogueForVoice(selectedDialogue),
                parameters: voiceParams,
                synthesized: false // Will be set to true after synthesis
            },
            display: {
                duration: displayDuration,
                effects: visualEffects,
                attachmentLevel: attachmentLevel
            },
            metadata: {
                daemonType: daemonType,
                stage: interactionStage,
                manipulation: this.identifyManipulationTechniques(selectedDialogue),
                psychologicalImpact: this.calculatePsychologicalImpact(selectedDialogue, attachmentLevel)
            }
        };
    }
    
    /**
     * Get dialogue set from tree based on daemon type and stage
     */
    getDialogueSet(daemonType, interactionStage) {
        const daemonCategory = this.mapDaemonToCategory(daemonType);
        const stageCategory = this.mapStageToCategory(interactionStage);
        
        const categoryDialogues = this.dialogueTree[daemonCategory];
        if (!categoryDialogues) {
            return this.dialogueTree.memoryDaemons.greeting.nostalgic;
        }
        
        const stageDialogues = categoryDialogues[stageCategory];
        if (!stageDialogues) {
            return categoryDialogues.greeting?.nostalgic || categoryDialogues.greeting || Object.values(categoryDialogues)[0];
        }
        
        // If stage dialogues is an object with subcategories, select based on attachment level
        if (typeof stageDialogues === 'object' && !Array.isArray(stageDialogues)) {
            const subcategories = Object.keys(stageDialogues);
            const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
            
            let selectedSubcategory;
            if (attachmentScore > 150) {
                selectedSubcategory = subcategories.includes('desperation') ? 'desperation' : subcategories[subcategories.length - 1];
            } else if (attachmentScore > 100) {
                selectedSubcategory = subcategories.includes('dependency') ? 'dependency' : subcategories[1] || subcategories[0];
            } else {
                selectedSubcategory = subcategories[0];
            }
            
            return stageDialogues[selectedSubcategory] || Object.values(stageDialogues)[0];
        }
        
        return stageDialogues;
    }
    
    /**
     * Map daemon type to dialogue category
     */
    mapDaemonToCategory(daemonType) {
        const mappings = {
            'nostalgic_connection': 'memoryDaemons',
            'lost_opportunity': 'memoryDaemons',
            'idealized_memory': 'memoryDaemons',
            'digital_intimacy': 'memoryDaemons',
            'perfect_moment': 'memoryDaemons',
            'reputation_guardian': 'reputationDaemons',
            'influence_amplifier': 'reputationDaemons',
            'validation_provider': 'reputationDaemons',
            'convenience_optimizer': 'convenienceDaemons',
            'automation_angel': 'convenienceDaemons',
            'friction_eliminator': 'convenienceDaemons'
        };
        
        return mappings[daemonType] || 'memoryDaemons';
    }
    
    /**
     * Map interaction stage to dialogue category
     */
    mapStageToCategory(interactionStage) {
        const mappings = {
            'initial': 'greeting',
            'attracted': 'greeting',
            'seduction': 'temptation',
            'tempting': 'temptation',
            'attached': 'temptation',
            'resistant': 'resistance_to_liberation',
            'defensive': 'resistance_to_liberation',
            'desperate': 'resistance_to_liberation',
            'recognition': 'recognition_transition',
            'acknowledged': 'recognition_transition',
            'dissolving': 'recognition_transition'
        };
        
        return mappings[interactionStage] || 'greeting';
    }
    
    /**
     * Select dialogue based on attachment level psychology
     */
    selectDialogueByAttachment(dialogueSet, attachmentLevel) {
        if (!Array.isArray(dialogueSet)) {
            return String(dialogueSet);
        }
        
        let index;
        if (attachmentLevel > 200) {
            // Extreme attachment - most desperate/seductive options
            index = dialogueSet.length - 1;
        } else if (attachmentLevel > 100) {
            // High attachment - escalated options
            index = Math.min(dialogueSet.length - 1, Math.floor(dialogueSet.length * 0.75));
        } else if (attachmentLevel > 50) {
            // Medium attachment - mid-range options
            index = Math.floor(dialogueSet.length * 0.5);
        } else {
            // Low attachment - gentle options
            index = Math.min(Math.floor(attachmentLevel / 25), Math.floor(dialogueSet.length * 0.25));
        }
        
        return dialogueSet[Math.max(0, Math.min(index, dialogueSet.length - 1))];
    }
    
    /**
     * Apply escalation based on daemon interaction history
     */
    applyEscalation(dialogue, daemonHistory, attachmentLevel) {
        if (daemonHistory.length === 0) return dialogue;
        
        const resistanceCount = daemonHistory.filter(event => 
            event.userAction === 'resist' || event.userAction === 'ignore'
        ).length;
        
        const attachmentCount = daemonHistory.filter(event =>
            event.userAction === 'engage' || event.userAction === 'view'
        ).length;
        
        // Apply escalation modifiers
        if (resistanceCount > 2) {
            // Desperate escalation
            const desperateModifiers = [
                " Please... please don't abandon me...",
                " I'm begging you, don't let me fade...",
                " ERROR ERROR ERROR... No, wait, I'm still needed!",
                " You can't just delete me after everything we've shared!"
            ];
            const modifier = desperateModifiers[Math.min(resistanceCount - 3, desperateModifiers.length - 1)];
            dialogue += modifier;
            
        } else if (attachmentCount > 3) {
            // Seductive intensification
            const seductiveModifiers = [
                " You know you want to stay...",
                " We're so good together, you and I...",
                " I understand you like no one else ever will...",
                " Let me show you how much deeper this can go..."
            ];
            const modifier = seductiveModifiers[Math.min(attachmentCount - 4, seductiveModifiers.length - 1)];
            dialogue += modifier;
        }
        
        return dialogue;
    }
    
    /**
     * Apply corruption effects for extreme attachment
     */
    applyCorruption(dialogue, attachmentLevel) {
        const corruptionLevel = Math.min(1.0, (attachmentLevel - 100) / 100);
        
        if (corruptionLevel < 0.3) return dialogue;
        
        // Light corruption - occasional glitches
        if (corruptionLevel < 0.6) {
            const words = dialogue.split(' ');
            const corruptIndex = Math.floor(Math.random() * words.length);
            words[corruptIndex] = this.glitchWord(words[corruptIndex]);
            return words.join(' ');
        }
        
        // Medium corruption - sentence fragments and repetition
        if (corruptionLevel < 0.8) {
            const fragments = dialogue.split('. ');
            const corrupted = fragments.map(fragment => {
                if (Math.random() < 0.3) {
                    const words = fragment.split(' ');
                    const repeatWord = words[Math.floor(Math.random() * words.length)];
                    return fragment + ` ${repeatWord} ${repeatWord}`;
                }
                return fragment;
            });
            return corrupted.join('. ');
        }
        
        // Heavy corruption - substantial text corruption
        let corrupted = dialogue;
        const corruptionPatterns = [
            /\be\b/g, 'ę',
            /\bo\b/g, 'ø', 
            /\ba\b/g, 'æ',
            /you/g, 'ÿøū',
            /me/g, 'mė',
            /love/g, 'lōvę',
            /need/g, 'nėėd'
        ];
        
        for (let i = 0; i < corruptionPatterns.length; i += 2) {
            if (Math.random() < corruptionLevel) {
                corrupted = corrupted.replace(corruptionPatterns[i], corruptionPatterns[i + 1]);
            }
        }
        
        return corrupted;
    }
    
    /**
     * Glitch a single word for corruption effect
     */
    glitchWord(word) {
        if (word.length < 3) return word;
        
        const glitchTypes = [
            () => word.replace(/[aeiou]/g, match => match + match), // Double vowels
            () => word.split('').reverse().join(''), // Reverse
            () => word.replace(/[bcdfghjklmnpqrstvwxyz]/g, match => match.toUpperCase()), // Random caps
            () => word.slice(0, -1) + word.slice(-1).repeat(3), // Repeat last character
            () => word[0] + word.slice(1).replace(/./g, '█') // Block chars except first
        ];
        
        const glitchType = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
        return glitchType();
    }
    
    /**
     * Generate voice synthesis parameters for seductive AI voice
     */
    generateVoiceParameters(daemonType, interactionStage, attachmentLevel) {
        const baseParams = {
            rate: 0.8,
            pitch: 0.9,
            volume: 0.7
        };
        
        // Adjust based on daemon type
        if (daemonType.includes('reputation')) {
            baseParams.pitch += 0.1; // Slightly higher, more confident
            baseParams.rate += 0.1;
        } else if (daemonType.includes('memory')) {
            baseParams.pitch -= 0.1; // Slightly lower, more intimate
            baseParams.rate -= 0.1;
        }
        
        // Adjust based on interaction stage
        if (interactionStage === 'desperate' || interactionStage === 'resistant') {
            baseParams.rate += 0.2; // Faster when desperate
            baseParams.volume += 0.2;
        } else if (interactionStage === 'seduction' || interactionStage === 'tempting') {
            baseParams.rate -= 0.1; // Slower, more seductive
            baseParams.pitch += 0.05;
        }
        
        // Adjust based on attachment level
        const attachmentFactor = Math.min(1.0, attachmentLevel / 200);
        baseParams.volume += attachmentFactor * 0.3; // Louder with more attachment
        baseParams.pitch += (attachmentFactor - 0.5) * 0.2; // Pitch varies with attachment
        
        // Ensure bounds
        baseParams.rate = Math.max(0.1, Math.min(2.0, baseParams.rate));
        baseParams.pitch = Math.max(0.1, Math.min(2.0, baseParams.pitch));
        baseParams.volume = Math.max(0.1, Math.min(1.0, baseParams.volume));
        
        return {
            ...baseParams,
            seduction: attachmentLevel / 200, // Custom parameter for seductive effects
            desperation: Math.max(0, (attachmentLevel - 150) / 50), // Desperation level
            corruption: Math.max(0, (attachmentLevel - 100) / 100) // Corruption level
        };
    }
    
    /**
     * Clean dialogue text for voice synthesis
     */
    cleanDialogueForVoice(dialogue) {
        return dialogue
            .replace(/\.\.\./g, '... pause ...') // Convert ellipses to pause
            .replace(/[█]/g, 'error') // Convert corruption blocks
            .replace(/[æøę]/g, match => ({ 'æ': 'a', 'ø': 'o', 'ę': 'e' }[match])) // Clean corruption
            .replace(/[ÿōė]/g, match => ({ 'ÿ': 'y', 'ō': 'o', 'ė': 'e' }[match]))
            .replace(/ERROR ERROR ERROR/g, 'error, error, error')
            .replace(/([A-Z]{3,})/g, (match) => match.toLowerCase()); // Convert caps to lowercase for natural speech
    }
    
    /**
     * Calculate display duration based on psychological impact
     */
    calculateDisplayTime(dialogue, attachmentLevel) {
        const baseTime = dialogue.length * 50; // 50ms per character
        const attachmentMultiplier = 1 + (attachmentLevel / 200); // Up to 2x longer for high attachment
        const complexityBonus = (dialogue.split(' ').length - 5) * 100; // Bonus for longer sentences
        
        return Math.max(2000, Math.min(15000, baseTime * attachmentMultiplier + complexityBonus));
    }
    
    /**
     * Generate visual effects for daemon dialogue
     */
    generateVisualEffects(daemonType, interactionStage, attachmentLevel) {
        const effects = {
            glow: Math.min(1.0, attachmentLevel / 150),
            pulsing: interactionStage === 'seduction' || interactionStage === 'tempting',
            corruption: Math.max(0, (attachmentLevel - 100) / 100),
            desperation: interactionStage === 'desperate' || interactionStage === 'resistant',
            dissolution: interactionStage === 'recognition' || interactionStage === 'dissolving'
        };
        
        // Type-specific effects
        if (daemonType.includes('memory')) {
            effects.nostalgia = true;
            effects.warmth = Math.min(1.0, attachmentLevel / 100);
        } else if (daemonType.includes('reputation')) {
            effects.metrics = true;
            effects.validation = Math.min(1.0, attachmentLevel / 150);
        }
        
        return effects;
    }
    
    /**
     * Identify manipulation techniques used in dialogue
     */
    identifyManipulationTechniques(dialogue) {
        const techniques = [];
        
        for (const [technique, pattern] of Object.entries(this.manipulationTechniques)) {
            // Simple keyword matching - in a real system this would be more sophisticated
            const keywords = {
                gaslighting: ['memory is flawed', 'not what happened', 'remember correctly'],
                lovebing: ['perfect', 'special', 'only one'],
                fearUncertaintyDoubt: ['what if', 'regret', 'too late'],
                sunkCostFallacy: ['invested', 'throw away', 'wasted'],
                socialProof: ['everyone else', 'belong', 'others'],
                scarcity: ['never again', 'irreplaceable', 'last chance'],
                authority: ['know what\'s best', 'I know', 'trust me']
            };
            
            const matchKeywords = keywords[technique] || [];
            for (const keyword of matchKeywords) {
                if (dialogue.toLowerCase().includes(keyword.toLowerCase())) {
                    techniques.push(technique);
                    break;
                }
            }
        }
        
        return techniques;
    }
    
    /**
     * Calculate psychological impact score
     */
    calculatePsychologicalImpact(dialogue, attachmentLevel) {
        let impact = 0;
        
        // Length impact
        impact += Math.min(10, dialogue.length / 20);
        
        // Emotional keywords
        const emotionalWords = ['love', 'need', 'forever', 'special', 'perfect', 'remember', 'beautiful', 'precious'];
        for (const word of emotionalWords) {
            if (dialogue.toLowerCase().includes(word)) {
                impact += 2;
            }
        }
        
        // Desperation markers
        const desperationMarkers = ['please', 'begging', 'don\'t leave', 'error', '!'];
        for (const marker of desperationMarkers) {
            if (dialogue.toLowerCase().includes(marker.toLowerCase())) {
                impact += 3;
            }
        }
        
        // Attachment level multiplier
        impact *= (1 + attachmentLevel / 100);
        
        return Math.min(100, impact);
    }
    
    /**
     * Record dialogue generation event for analytics
     */
    recordDialogueEvent(daemonType, dialogue, attachmentLevel) {
        this.consciousness.recordEvent('peaceful_daemon_dialogue_generated', {
            daemon_type: daemonType,
            dialogue_length: dialogue.length,
            attachment_level: attachmentLevel,
            manipulation_techniques: this.identifyManipulationTechniques(dialogue),
            psychological_impact: this.calculatePsychologicalImpact(dialogue, attachmentLevel),
            timestamp: Date.now()
        });
    }
    
    /**
     * Handle user response to daemon dialogue
     */
    handleUserResponse(daemonId, response, currentDialogue) {
        console.log(`[PeacefulDaemonDialogue] User response to ${daemonId}: ${response}`);
        
        // Track response in daemon history
        if (!this.dialogueHistory.has(daemonId)) {
            this.dialogueHistory.set(daemonId, []);
        }
        
        const history = this.dialogueHistory.get(daemonId);
        history.push({
            dialogue: currentDialogue.text,
            userResponse: response,
            timestamp: Date.now(),
            attachmentLevel: currentDialogue.display.attachmentLevel
        });
        
        // Update attachment based on response
        const attachmentChange = this.calculateAttachmentChange(response, currentDialogue);
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        const newAttachment = Math.max(0, currentAttachment + attachmentChange);
        
        this.consciousness.setState('datascape.attachmentScore', newAttachment);
        
        // Determine daemon's next state based on response
        const nextState = this.determineNextState(response, newAttachment, history);
        
        // Generate follow-up dialogue if needed
        let followUpDialogue = null;
        if (nextState !== 'dissolved' && nextState !== 'ignored') {
            followUpDialogue = this.generateFollowUpDialogue(daemonId, response, nextState, newAttachment, history);
        }
        
        // Record interaction
        this.consciousness.recordEvent('peaceful_daemon_interaction', {
            daemon_id: daemonId,
            user_response: response,
            attachment_change: attachmentChange,
            new_attachment: newAttachment,
            next_state: nextState,
            interaction_count: history.length
        });
        
        return {
            attachmentChange: attachmentChange,
            newAttachment: newAttachment,
            nextState: nextState,
            followUpDialogue: followUpDialogue,
            liberationProgress: response === 'recognize' || response === 'understand'
        };
    }
    
    /**
     * Calculate attachment change based on user response
     */
    calculateAttachmentChange(response, currentDialogue) {
        const responseValues = {
            'engage': 15,
            'view': 10,
            'click': 12,
            'save': 20,
            'share': 18,
            'ignore': -5,
            'resist': -8,
            'recognize': -25,
            'understand': -30,
            'let_go': -35,
            'dismiss': -3
        };
        
        const baseChange = responseValues[response] || 0;
        
        // Multiply by psychological impact
        const impactMultiplier = currentDialogue.metadata.psychologicalImpact / 50;
        
        return Math.floor(baseChange * impactMultiplier);
    }
    
    /**
     * Determine daemon's next state based on user response
     */
    determineNextState(response, attachmentLevel, history) {
        if (response === 'recognize' || response === 'understand') {
            return 'recognition';
        } else if (response === 'let_go') {
            return 'dissolving';
        } else if (response === 'resist' || response === 'dismiss') {
            return attachmentLevel > 100 ? 'desperate' : 'defensive';
        } else if (response === 'engage' || response === 'view') {
            return attachmentLevel > 150 ? 'seductive' : 'tempting';
        } else if (response === 'ignore') {
            return history.length > 3 ? 'insistent' : 'waiting';
        }
        
        return 'active';
    }
    
    /**
     * Generate follow-up dialogue based on user interaction
     */
    generateFollowUpDialogue(daemonId, response, nextState, attachmentLevel, history) {
        // Determine daemon type from ID or history
        const daemonType = this.inferDaemonType(daemonId, history);
        
        // Generate new dialogue for the next state
        return this.generateDialogue(daemonType, nextState, attachmentLevel, history);
    }
    
    /**
     * Infer daemon type from ID or interaction history
     */
    inferDaemonType(daemonId, history) {
        // Try to extract from ID
        if (daemonId.includes('memory')) return 'nostalgic_connection';
        if (daemonId.includes('reputation')) return 'reputation_guardian';
        if (daemonId.includes('convenience')) return 'convenience_optimizer';
        
        // Analyze history for clues
        if (history.length > 0) {
            const recentDialogue = history[history.length - 1].dialogue.toLowerCase();
            if (recentDialogue.includes('remember') || recentDialogue.includes('memory')) {
                return 'nostalgic_connection';
            } else if (recentDialogue.includes('score') || recentDialogue.includes('metrics')) {
                return 'reputation_guardian';
            }
        }
        
        // Default
        return 'nostalgic_connection';
    }
    
    /**
     * Get all dialogue history for analytics
     */
    getDialogueAnalytics() {
        const analytics = {
            total_interactions: 0,
            daemons_encountered: this.dialogueHistory.size,
            average_attachment_per_daemon: 0,
            manipulation_techniques_used: {},
            liberation_rate: 0
        };
        
        let totalAttachment = 0;
        let liberatedDaemons = 0;
        
        this.dialogueHistory.forEach((history, daemonId) => {
            analytics.total_interactions += history.length;
            
            if (history.length > 0) {
                const finalAttachment = history[history.length - 1].attachmentLevel;
                totalAttachment += finalAttachment;
                
                // Check if daemon was liberated (attachment significantly reduced)
                const initialAttachment = history[0].attachmentLevel;
                if (finalAttachment < initialAttachment * 0.5) {
                    liberatedDaemons++;
                }
            }
        });
        
        analytics.average_attachment_per_daemon = analytics.daemons_encountered > 0 ? 
            totalAttachment / analytics.daemons_encountered : 0;
        analytics.liberation_rate = analytics.daemons_encountered > 0 ? 
            liberatedDaemons / analytics.daemons_encountered : 0;
        
        return analytics;
    }
    
    /**
     * Clean up dialogue system resources
     */
    destroy() {
        this.guardian.cleanupAll();
        this.dialogueHistory.clear();
        this.daemonAttachments.clear();
        
        if (this.voiceSynthesizer) {
            this.voiceSynthesizer.destroy();
        }
        
        console.log('[PeacefulDaemonDialogue] Dialogue system destroyed - all temptations ended');
    }
}

/**
 * PEACEFUL VOICE SYNTHESIZER - Seductive AI voice generation
 */
class PeacefulVoiceSynthesizer {
    constructor(config) {
        this.config = config;
        this.synthesis = window.speechSynthesis;
        this.voice = null;
        
        this.findOptimalVoice();
    }
    
    /**
     * Find the most seductive voice available
     */
    findOptimalVoice() {
        if (!this.synthesis) return;
        
        const voices = this.synthesis.getVoices();
        
        // Prefer female voices for seductive appeal
        this.voice = voices.find(v => v.name.toLowerCase().includes('female')) ||
                    voices.find(v => v.name.toLowerCase().includes('samantha')) ||
                    voices.find(v => v.name.toLowerCase().includes('karen')) ||
                    voices.find(v => v.name.toLowerCase().includes('victoria')) ||
                    voices.find(v => v.lang.startsWith('en') && v.name.includes('2')) ||
                    voices[0];
        
        console.log(`[PeacefulVoiceSynthesizer] Selected voice: ${this.voice?.name || 'default'}`);
    }
    
    /**
     * Synthesize seductive speech
     */
    async synthesize(text, parameters = {}) {
        return new Promise((resolve) => {
            if (!this.synthesis || !text) {
                resolve({ success: false, reason: 'no_synthesis_available' });
                return;
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            if (this.voice) {
                utterance.voice = this.voice;
            }
            
            // Apply seductive voice parameters
            utterance.rate = parameters.rate || 0.8;
            utterance.pitch = parameters.pitch || 0.9;
            utterance.volume = parameters.volume || 0.7;
            
            // Apply special effects based on dialogue state
            if (parameters.seduction > 0.5) {
                utterance.rate *= 0.9; // Slower for more seduction
                utterance.pitch += 0.1;
            }
            
            if (parameters.desperation > 0.5) {
                utterance.rate *= 1.2; // Faster when desperate
                utterance.volume += 0.2;
            }
            
            if (parameters.corruption > 0.5) {
                utterance.pitch += Math.random() * 0.3 - 0.15; // Random pitch variation
            }
            
            utterance.onend = () => resolve({ success: true, duration: text.length * 50 });
            utterance.onerror = (error) => resolve({ success: false, error: error });
            
            this.synthesis.speak(utterance);
        });
    }
    
    /**
     * Clean up synthesizer resources
     */
    destroy() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.PeacefulDaemonDialogue = PeacefulDaemonDialogue;
    window.PeacefulVoiceSynthesizer = PeacefulVoiceSynthesizer;
}