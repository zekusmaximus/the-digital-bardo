/**
 * Linear Congruential Generator for reproducible randomness
 * Essential for testing and karma-consistent fragment generation
 */
export class SeededRandom {
    constructor(seed = Date.now()) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }

    next() {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    between(min, max) {
        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new Error('SeededRandom.between expects numeric bounds');
        }
        return min + this.next() * (max - min);
    }

    choice(array) {
        if (!Array.isArray(array) || array.length === 0) {
            throw new Error('SeededRandom.choice expects a non-empty array');
        }
        return array[Math.floor(this.next() * array.length)];
    }

    boolean(probability = 0.5) {
        if (probability < 0 || probability > 1) {
            throw new Error('SeededRandom.boolean probability must be between 0 and 1');
        }
        return this.next() < probability;
    }
}

export function createSeededRandom(seed) {
    return new SeededRandom(seed);
}
