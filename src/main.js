// Import CSS - Vite will bundle it
import './styles/reality.css'

// Import the consciousness system
import { DigitalConsciousness } from './consciousness/digital-soul.js'

// Initialize the core logic
const consciousness = new DigitalConsciousness()
window.consciousness = consciousness // Expose for debugging

console.log('Digital Consciousness Initialized. Seed:', consciousness.state.incarnation_seed)