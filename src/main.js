/* Bootstrap check */
console.log('[Main] JavaScript is loading!', new Date().toISOString());

// Import CSS - Vite will bundle it
import './styles/reality.css';
console.log('[Main] CSS imported successfully');

// Import consciousness module
import { consciousness } from './consciousness/digital-soul.js';
console.log('[Main] Consciousness module imported successfully');
console.log('[Main] Digital Consciousness Initialized. Seed:', consciousness.state.incarnation_seed);
console.log('[Main] Current consciousness state:', consciousness.state);

// Additional error handling
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Main] Unhandled rejection:', event.reason);
  alert('Unhandled rejection: ' + event.reason);
});

window.addEventListener('error', (event) => {
  console.error('[Main] Uncaught error:', event.error);
  alert('Uncaught error: ' + event.message);
});