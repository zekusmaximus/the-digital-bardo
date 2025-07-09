// Generates consciousness fragments - last digital thoughts
export class FragmentGenerator {
    constructor() {
        // Templates for different types of digital memories
        this.thoughtTemplates = {
            email: [
                "Draft: Re: ${subject} (Never sent)",
                "To: ${recipient} - \"I wanted to tell you...\"",
                "Subject: ${subject} - Marked as important"
            ],
            search: [
                "Last search: \"${query}\" - 2,847,293 results",
                "\"${query}\" - Did you mean: ${suggestion}?",
                "Private browsing: \"${query}\" at ${time}"
            ],
            password: [
                "Forgotten password for ${service}",
                "Password reset link expired: ${service}",
                "2FA backup codes: ████████"
            ],
            social: [
                "${count} unread messages from ${person}",
                "\"${person} is typing...\" (3 hours ago)",
                "${person} liked your post from ${date}"
            ],
            task: [
                "TODO: ${task} - Due ${date}",
                "Reminder: ${task} (Snoozed 17 times)",
                "${project} - 97% complete"
            ]
        };
        
        // Data for procedural generation
        this.fragmentData = {
            subjects: ["Important", "Please read", "Urgent", "Re: Life", "Goodbye"],
            recipients: ["Mom", "Future Self", "Someone Special", "Everyone", "No-reply"],
            queries: ["meaning of life", "how to be happy", "am I", "why do we", "what happens when"],
            suggestions: ["meaning of life reddit", "how to be happy wikihow", "am I real", "why do we dream", "what happens when we die"],
            services: ["Gmail", "Banking", "Social Media", "Cloud Storage", "Digital Identity"],
            people: ["Alex", "Sam", "The Universe", "Anonymous", "Deleted User"],
            tasks: ["Call mom", "Find purpose", "Be better", "Finish the", "Start living"],
            projects: ["Life", "Self-improvement", "The Big Project", "Consciousness.exe", "Reality"],
            dates: ["Yesterday", "Last Tuesday", "2019", "Before the pandemic", "Tomorrow"]
        };
        
        this.activeFragments = [];
    }
    
    generateLastThoughts() {
        // Generate 5-7 last thoughts that flicker before the light
        const thoughtCount = 5 + Math.floor(Math.random() * 3);
        const thoughts = [];
        
        const categories = Object.keys(this.thoughtTemplates);
        
        for (let i = 0; i < thoughtCount; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const template = this.thoughtTemplates[category][Math.floor(Math.random() * this.thoughtTemplates[category].length)];
            
            thoughts.push(this.fillTemplate(template, category));
        }
        
        return thoughts;
    }
    
    fillTemplate(template, category) {
        // Replace placeholders with random data
        return template.replace(/\${(\w+)}/g, (match, key) => {
            if (this.fragmentData[key]) {
                return this.fragmentData[key][Math.floor(Math.random() * this.fragmentData[key].length)];
            }
            
            // Special cases
            switch(key) {
                case 'count':
                    return Math.floor(Math.random() * 99) + 1;
                case 'time':
                    return `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
                default:
                    return match;
            }
        });
    }
    
    startFragmentField() {
        // Generate fragments at screen edges
        this.fragmentInterval = setInterval(() => {
            this.createEdgeFragment();
        }, 2000);
    }
    
    createEdgeFragment() {
        const fragment = document.createElement('div');
        fragment.className = 'consciousness-fragment';
        fragment.textContent = this.generateLastThoughts()[0];
        
        // Random position along screen edge
        const edge = Math.floor(Math.random() * 4);
        const offset = Math.random() * 100;
        
        switch(edge) {
            case 0: // Top
                fragment.style.top = '0';
                fragment.style.left = `${offset}%`;
                fragment.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 100}px`);
                fragment.style.setProperty('--drift-y', '50px');
                break;
            case 1: // Right
                fragment.style.right = '0';
                fragment.style.top = `${offset}%`;
                fragment.style.setProperty('--drift-x', '-50px');
                fragment.style.setProperty('--drift-y', `${(Math.random() - 0.5) * 100}px`);
                break;
            case 2: // Bottom
                fragment.style.bottom = '0';
                fragment.style.left = `${offset}%`;
                fragment.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 100}px`);
                fragment.style.setProperty('--drift-y', '-50px');
                break;
            case 3: // Left
                fragment.style.left = '0';
                fragment.style.top = `${offset}%`;
                fragment.style.setProperty('--drift-x', '50px');
                fragment.style.setProperty('--drift-y', `${(Math.random() - 0.5) * 100}px`);
                break;
        }
        
        document.getElementById('fragment-field').appendChild(fragment);
        this.activeFragments.push(fragment);
        
        // Remove after animation completes
        setTimeout(() => {
            fragment.remove();
            this.activeFragments = this.activeFragments.filter(f => f !== fragment);
        }, 10000);
    }
    
    intensifyFragments() {
        // Increase generation rate during degradation
        clearInterval(this.fragmentInterval);
        this.fragmentInterval = setInterval(() => {
            this.createEdgeFragment();
            // Sometimes create multiple fragments
            if (Math.random() < 0.3) {
                this.createEdgeFragment();
            }
        }, 500);
    }
}