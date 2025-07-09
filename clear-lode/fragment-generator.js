import { gsap } from 'gsap';

export class FragmentGenerator {
    // ... existing constructor and methods ...
    
    createEdgeFragment() {
        const fragment = document.createElement('div');
        fragment.className = 'consciousness-fragment';
        fragment.textContent = this.generateLastThoughts()[0];
        
        // Random position along screen edge
        const edge = Math.floor(Math.random() * 4);
        const offset = Math.random() * 100;
        
        // Position fragment
        this.positionFragment(fragment, edge, offset);
        
        // Add to DOM
        document.getElementById('fragment-field').appendChild(fragment);
        this.activeFragments.push(fragment);
        
        // Animate with GSAP
        const drift = this.calculateDrift(edge);
        
        gsap.timeline()
            .fromTo(fragment, 
                { 
                    opacity: 0,
                    scale: 0.8
                },
                { 
                    opacity: 0.3,
                    scale: 1,
                    duration: 1,
                    ease: 'power2.out'
                }
            )
            .to(fragment, {
                x: drift.x,
                y: drift.y,
                opacity: 0,
                duration: 8,
                ease: 'none',
                onComplete: () => {
                    fragment.remove();
                    this.activeFragments = this.activeFragments.filter(f => f !== fragment);
                }
            }, '-=0.5');
    }
    
    positionFragment(fragment, edge, offset) {
        gsap.set(fragment, {
            position: 'absolute',
            top: edge === 0 ? '0' : edge === 2 ? 'auto' : `${offset}%`,
            bottom: edge === 2 ? '0' : 'auto',
            left: edge === 3 ? '0' : edge === 1 ? 'auto' : `${offset}%`,
            right: edge === 1 ? '0' : 'auto'
        });
    }
    
    calculateDrift(edge) {
        const distance = 50 + Math.random() * 50;
        const spread = (Math.random() - 0.5) * 100;
        
        switch(edge) {
            case 0: // Top
                return { x: spread, y: distance };
            case 1: // Right
                return { x: -distance, y: spread };
            case 2: // Bottom
                return { x: spread, y: -distance };
            case 3: // Left
                return { x: distance, y: spread };
        }
    }
    
    intensifyFragments() {
        // Clear existing interval
        clearInterval(this.fragmentInterval);
        
        // Create fragments more rapidly with GSAP stagger
        const createBurst = () => {
            const fragmentCount = 2 + Math.floor(Math.random() * 3);
            
            for (let i = 0; i < fragmentCount; i++) {
                gsap.delayedCall(i * 0.1, () => {
                    this.createEdgeFragment();
                });
            }
        };
        
        // Create bursts of fragments
        this.fragmentInterval = setInterval(createBurst, 500);
    }
}