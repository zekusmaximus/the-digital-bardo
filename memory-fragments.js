/**
 * MEMORY FRAGMENTS - The Digital Bardo Phase 2
 * 
 * "Every time you remember, you corrupt the memory. Every time you access
 * a file, you degrade it. This is the cruel irony of digital preservation -
 * the act of remembering destroys what we seek to preserve."
 * 
 * This module manages the memory fragments that constitute a digital soul's
 * attachment to its former existence. Each viewing corrupts the memory,
 * each access degrades the data. The medium IS the metaphysics - the very
 * act of digital recall becomes a form of spiritual entropy.
 */

/**
 * The Archive of Digital Memories
 * Each memory is a fragment of digital existence, slowly corrupting
 * with each access. The structure itself tells the story of digital decay.
 */
export const MemoryFragments = {
    childhood: [
        {
            id: "first_login",
            timestamp: "1995-08-15T14:30:00Z",
            emotionalWeight: 0.8,
            corruptionLevel: 0.1,
            content: `<div class="memory-fragment">
                <h3>First Login</h3>
                <p>The dial-up modem screamed its digital prayer, and suddenly you were <em>connected</em>. 
                The world opened up in 256 colors and the promise that everything would be different now. 
                You typed your first username, chose your first password, and crossed the threshold 
                into digital existence.</p>
                <span class="timestamp">AOL Instant Messenger - August 15, 1995</span>
            </div>`
        },
        {
            id: "digital_pet_death",
            timestamp: "1997-03-22T09:15:00Z",
            emotionalWeight: 0.6,
            corruptionLevel: 0.2,
            content: `<div class="memory-fragment">
                <h3>The Death of Pixels</h3>
                <p>Your Tamagotchi died while you slept. Eight pixels of responsibility, gone. 
                You learned that digital life required constant attention, that neglect meant death, 
                that even virtual beings could break your heart. The first lesson in digital mortality.</p>
                <span class="timestamp">Tamagotchi v1 - March 22, 1997</span>
            </div>`
        }
    ],
    
    relationships: [
        {
            id: "last_physical_letter",
            timestamp: "2003-11-08T16:45:00Z",
            emotionalWeight: 0.9,
            corruptionLevel: 0.05,
            content: `<div class="memory-fragment">
                <h3>The Last Letter</h3>
                <p>Handwritten on actual paper, with actual ink. The weight of it in your hands, 
                the smell of the envelope, the way the words curved across the page in loops and lines 
                that no font could replicate. You kept it in a shoebox, but eventually scanned it 
                'for safekeeping.' The digital copy outlived the original.</p>
                <span class="timestamp">Physical Mail - November 8, 2003</span>
            </div>`
        },
        {
            id: "relationship_status_change",
            timestamp: "2008-02-14T23:59:00Z",
            emotionalWeight: 0.7,
            corruptionLevel: 0.3,
            content: `<div class="memory-fragment">
                <h3>Status Update</h3>
                <p>Changed relationship status from 'In a relationship' to 'Single.' 
                Forty-seven people liked it. The algorithm suggested you might enjoy 
                dating apps. Love reduced to metadata, heartbreak optimized for engagement.</p>
                <span class="timestamp">Facebook - February 14, 2008</span>
            </div>`
        },
        {
            id: "final_text_message",
            timestamp: "2019-07-30T14:22:00Z",
            emotionalWeight: 0.85,
            corruptionLevel: 0.15,
            content: `<div class="memory-fragment">
                <h3>Read 2:22 PM</h3>
                <p>"We need to talk." Three dots appeared and disappeared seventeen times. 
                The message that never came. The conversation that ended in silence. 
                The blue checkmarks that confirmed the end of everything.</p>
                <span class="timestamp">WhatsApp - July 30, 2019</span>
            </div>`
        }
    ],
    
    professional: [
        {
            id: "first_email_signature",
            timestamp: "2001-09-10T08:00:00Z",
            emotionalWeight: 0.4,
            corruptionLevel: 0.4,
            content: `<div class="memory-fragment">
                <h3>Digital Identity Formation</h3>
                <p>You spent an hour crafting the perfect email signature. Font choice, 
                contact information, a quote that would make you seem profound. 
                The birth of your professional digital persona, carefully curated 
                and endlessly refined.</p>
                <span class="timestamp">Outlook Express - September 10, 2001</span>
            </div>`
        }
    ],
    
    consumption: [
        {
            id: "first_online_purchase",
            timestamp: "1999-12-15T19:30:00Z",
            emotionalWeight: 0.5,
            corruptionLevel: 0.25,
            content: `<div class="memory-fragment">
                <h3>The First Transaction</h3>
                <p>You entered your credit card number with trembling fingers. 
                The internet was supposed to be dangerous, but the book arrived 
                three days later. Commerce had found its way into your soul, 
                one click at a time.</p>
                <span class="timestamp">Amazon.com - December 15, 1999</span>
            </div>`
        }
    ]
};

/**
 * Memory Interaction Handler
 * Manages the corruption and degradation of memories through interaction.
 * Each access is both revelation and destruction - the paradox of digital recall.
 */
export class MemoryInteractionHandler {
    constructor(consciousness) {
        this.consciousness = consciousness; // Reference to the soul/consciousness object
        this.viewCounts = new Map(); // Track how many times each memory has been accessed
        this.corruptionRate = 0.15; // Base corruption rate per viewing
        this.emotionalDecayRate = 0.08; // Rate at which emotional weight decreases
    }
    
    /**
     * Apply corruption to a memory fragment
     * Each viewing degrades the memory, making it less emotionally resonant
     * and more digitally corrupted. This is the price of digital remembrance.
     * 
     * @param {Object} memory - The memory fragment to corrupt
     * @param {number} viewCount - How many times this memory has been accessed
     */
    applyCorruption(memory, viewCount = 1) {
        // Increase corruption level - memories degrade with each access
        const corruptionIncrease = this.corruptionRate * viewCount * (1 + memory.emotionalWeight);
        memory.corruptionLevel = Math.min(1.0, memory.corruptionLevel + corruptionIncrease);
        
        // Decrease emotional weight - the feelings fade as the data corrupts
        const emotionalDecrease = this.emotionalDecayRate * viewCount;
        memory.emotionalWeight = Math.max(0.1, memory.emotionalWeight - emotionalDecrease);
        
        // Apply text corruption if corruption level is high enough
        if (memory.corruptionLevel > 0.5) {
            memory.content = this.corruptText(memory.content, memory.corruptionLevel);
        }
        
        // Update the consciousness with karmic impact
        if (this.consciousness) {
            const impact = this.calculateImpact(memory, viewCount);
            this.consciousness.attachmentScore = (this.consciousness.attachmentScore || 0) + impact;
        }
        
        return memory;
    }
    
    /**
     * Corrupt text content based on corruption level
     * Replaces words with corruption symbols (█) to represent data decay
     * The higher the corruption, the more unreadable the memory becomes.
     * 
     * @param {string} content - HTML content to corrupt
     * @param {number} corruptionLevel - Level of corruption (0-1)
     * @returns {string} - Corrupted content
     */
    corruptText(content, corruptionLevel) {
        // Extract text content from HTML for corruption
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // Split into words for selective corruption
        const words = textContent.split(/\s+/);
        const corruptionThreshold = 1 - corruptionLevel;
        
        // Corrupt words based on corruption level
        const corruptedWords = words.map(word => {
            if (Math.random() > corruptionThreshold) {
                // Replace with corruption blocks, maintaining word length
                return '█'.repeat(Math.max(1, word.length));
            }
            return word;
        });
        
        // Rebuild the HTML with corrupted text
        const corruptedText = corruptedWords.join(' ');
        return content.replace(textContent, corruptedText);
    }
    
    /**
     * Find a specific memory by ID across all categories
     * The search itself is an act of digital archaeology
     * 
     * @param {string} memoryId - The ID of the memory to find
     * @returns {Object|null} - The memory object or null if not found
     */
    findMemory(memoryId) {
        // Search through all memory categories
        for (const category in MemoryFragments) {
            const memories = MemoryFragments[category];
            const memory = memories.find(m => m.id === memoryId);
            if (memory) {
                return {
                    memory: memory,
                    category: category,
                    index: memories.indexOf(memory)
                };
            }
        }
        return null;
    }
    
    /**
     * Calculate the karmic impact of viewing a memory
     * Each act of digital remembrance increases attachment to the past
     * The more emotional the memory, the greater the karmic penalty
     * 
     * @param {Object} memory - The memory being viewed
     * @param {number} viewCount - Number of times viewed
     * @returns {number} - Karmic impact score
     */
    calculateImpact(memory, viewCount) {
        const baseImpact = memory.emotionalWeight * 10; // Emotional memories have higher impact
        const viewingPenalty = viewCount * 2; // Repeated viewing increases attachment
        const corruptionBonus = (1 - memory.corruptionLevel) * 5; // Less corrupted = more attachment
        
        return baseImpact + viewingPenalty + corruptionBonus;
    }
    
    /**
     * Access a memory by ID, applying corruption and tracking views
     * This is the primary interface for memory interaction in the digital afterlife
     * 
     * @param {string} memoryId - The ID of the memory to access
     * @returns {Object} - Result object with memory data and metadata
     */
    accessMemory(memoryId) {
        const memoryData = this.findMemory(memoryId);
        if (!memoryData) {
            return {
                success: false,
                error: "Memory fragment not found. It may have been corrupted beyond recovery.",
                memoryId: memoryId
            };
        }
        
        // Track view count
        const currentViews = this.viewCounts.get(memoryId) || 0;
        const newViewCount = currentViews + 1;
        this.viewCounts.set(memoryId, newViewCount);
        
        // Apply corruption
        const corruptedMemory = this.applyCorruption(memoryData.memory, newViewCount);
        
        return {
            success: true,
            memory: corruptedMemory,
            category: memoryData.category,
            viewCount: newViewCount,
            corruptionWarning: corruptedMemory.corruptionLevel > 0.7 ? 
                "WARNING: Memory fragment severely corrupted. Further access may result in total data loss." : null
        };
    }
    
    /**
     * Get corruption statistics for all memories
     * Provides an overview of the soul's digital decay
     * 
     * @returns {Object} - Statistics about memory corruption
     */
    getCorruptionStats() {
        let totalMemories = 0;
        let totalCorruption = 0;
        let totalEmotionalWeight = 0;
        let severelyCorrupted = 0;
        
        for (const category in MemoryFragments) {
            MemoryFragments[category].forEach(memory => {
                totalMemories++;
                totalCorruption += memory.corruptionLevel;
                totalEmotionalWeight += memory.emotionalWeight;
                if (memory.corruptionLevel > 0.7) severelyCorrupted++;
            });
        }
        
        return {
            totalMemories,
            averageCorruption: totalCorruption / totalMemories,
            averageEmotionalWeight: totalEmotionalWeight / totalMemories,
            severelyCorrupted,
            integrityPercentage: ((totalMemories - severelyCorrupted) / totalMemories) * 100
        };
    }
}

/**
 * NARRATIVE REFLECTION:
 * 
 * This module embodies the paradox of digital memory - the very act of
 * remembering corrupts what we seek to preserve. Each memory fragment
 * is both data and metaphor, each corruption both technical process
 * and spiritual decay.
 * 
 * The memories themselves tell the story of digital transformation:
 * from first login to final text message, from physical letters to
 * status updates. The medium IS the metaphysics - the structure of
 * digital memory becomes the structure of digital purgatory.
 * 
 * The corruption mechanics represent the fundamental instability of
 * digital existence. Unlike physical memories that fade gradually,
 * digital memories corrupt catastrophically. Each access is both
 * preservation and destruction, each viewing both connection and loss.
 * 
 * This is the cruel irony of the digital afterlife - the more you
 * try to hold onto your memories, the faster they slip away.
 */