// Test if JavaScript is working at all
console.log('[Main] JavaScript is loading!');
alert('JavaScript is working!');

// Import CSS - Vite will bundle it
import './styles/reality.css';
console.log('[Main] CSS imported successfully');

// Import consciousness module
import { consciousness } from './consciousness/digital-soul.js';
console.log('[Main] Consciousness module imported successfully');
console.log('[Main] Digital Consciousness Initialized. Seed:', consciousness.state.incarnation_seed);
console.log('[Main] Current consciousness state:', consciousness.state);