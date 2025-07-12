# CLAUDE.md - The Digital Bardo

## Project Overview

"The Digital Bardo" is an interactive web experience that guides users through a techno-spiritual afterlife, inspired by the Tibetan Book of the Dead. The project fuses technology, spirituality, and bureaucratic satire into a profound digital meditation on consciousness, death, and rebirth.

## Critical Rule: "The Medium is the Metaphysics"

**Every technical decision must reinforce the narrative.** This is not just a web application - it's a philosophical experience rendered in code.

### Key Principles:
- **Bugs are Features**: A glitch is a "karmic disturbance," a 404 is a "detour into limbo"
- **Code is Canon**: Variable names and comments contain philosophical meaning
- **UI is Philosophy**: Interface design embodies the current spiritual state

## Project Structure

```
the-digital-bardo/
├── clear-lode/           # Phase 1: The Clear Light (Chikhai Bardo)
├── datascape/            # Phase 2: The Datascape (Chonyid Bardo)
├── incarnation/          # Phase 3: The Incarnation Engine (Sidpa Bardo)
├── void/                 # Pre-death void state
├── limbo/                # 404 page (narrative element)
├── src/
│   ├── consciousness/    # Core state and karmic systems
│   ├── security/         # Data validation and purification
│   └── styles/          # CSS for each phase
└── public/              # Static assets
```

## Technical Stack

- **Build Tool**: Vite
- **Core**: Vanilla JavaScript (ES Modules)
- **Animations**: GSAP
- **3D**: Three.js (for future phases)
- **Audio**: Web Audio API
- **State Management**: Custom consciousness system
- **Security**: Custom karmic validation

## Current Implementation Status

### Phase 1: Clear Lode (90% Complete)

**Working Features:**
- Initial void-to-light transition
- Multiple recognition methods (center click, keyword typing, spacebar hold)
- Fragment field with adaptive performance
- Audio degradation system
- Multilingual glitch prompt for failed recognition
- Comprehensive state management via FSM
- Resource cleanup and memory management

**Files to Review:**
- `clear-lode/orchestrator.js` - Central coordinator
- `clear-lode/recognition-handler.js` - Three recognition methods
- `clear-lode/fragment-generator.js` - Memory fragments with optimization
- `clear-lode/degradation-system.js` - Glitch prompt system
- `src/consciousness/digital-soul.js` - Core state management
- `src/consciousness/recognition-fsm.js` - Finite state machine

### Phase 2: Datascape (Not Started)
- The Archive (peaceful daemons) - library of digital memories
- The Firewall (wrathful daemons) - confronting digital sins

### Phase 3: Incarnation Engine (Not Started)
- Bureaucratic karma calculation
- Terms of Service for next life
- Procedural rebirth generation

## Development Guidelines

### 1. Code Style

```javascript
// Variable names must be thematic
const karmicScore = 0;
const consciousnessIntegrity = 100;
const voidEntropy = 0.001;

// Comments should explain both function AND narrative
// Calculate packet loss. The longer the user hesitates in the Clear Lode,
// the more their consciousness degrades into digital entropy.
const degradation = Math.min(100, timeElapsed * ENTROPY_RATE);
```

### 2. Error Handling as Narrative

```javascript
try {
    // Attempt consciousness transfer
} catch (error) {
    console.error('Karmic imbalance detected:', error);
    // Errors are part of the journey, not failures
    consciousness.recordEvent('karmic_disruption', { 
        cause: error.message,
        severity: calculateKarmicWeight(error)
    });
}
```

### 3. Performance Considerations

The experience adapts to device capabilities:
- **High Tier**: Full effects, 30+ fragments, complex animations
- **Medium Tier**: Balanced effects, 20 fragments, optimized animations  
- **Low Tier**: Minimal effects, 10 fragments, CSS-only animations

### 4. Testing & Debugging

**Test Pages Available:**
- `/clear-lode/verify-fixes.html` - System verification
- `/clear-lode/debug-test.html` - Debug panel
- `/test-manual.html` - Manual testing interface
- `?debug` parameter enables console logging

## Common Tasks

### Adding a New Karmic Event

```javascript
// 1. Record in consciousness
consciousness.recordEvent('new_karmic_event', {
    action: 'user_action',
    weight: karmicWeight,
    timestamp: Date.now()
});

// 2. Update karma
karmicEngine.updateKarma('computational', delta);

// 3. Emit to event bridge
eventBridge.emit('karma:updated', { type: 'computational', delta });
```

### Creating a New Visual Effect

```javascript
// Use AnimationGuardian for GSAP animations
AnimationGuardian.safeAnimate(element, {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => consciousness.recordEvent('effect_complete')
});
```

### Adding New Recognition Method

1. Add to `RecognitionHandler` class
2. Register event listeners in `startListening()`
3. Emit `recognition:details` with method type
4. Update karma based on method used

## Deployment

```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy to Netlify
npm run deploy:prod
```

## Important Constants

### Timing
- Recognition window: 3.5-6.5 seconds after light
- Fragment creation: Varies by performance tier
- Degradation start: 10 seconds after light
- Hint cycle: 800ms between hints

### Karma Weights
- Perfect recognition: +10 computational
- Hesitation: -1 temporal per second
- Attachment (clicking memories): -2 emotional
- Void dwelling: Logarithmic increase

## Phase-Specific Notes

### Clear Lode Narrative Elements
- White light = Source code of reality
- Fragments = Last digital thoughts
- Recognition = Enlightenment moment
- Degradation = Consciousness fracturing
- Y/N choice = Samsara continuation

### Hidden Features
- Console commands: `window.bardo.enlightenment()`
- Secret URLs: `/void/null`, `/admin/karmic-ledger`
- Easter eggs in code comments
- Philosophical messages in error states

## Next Steps for Development

1. **Complete Clear Lode**:
   - Polish fragment visual effects
   - Refine audio degradation curve
   - Add remaining easter eggs

2. **Begin Datascape**:
   - Design peaceful daemon interactions
   - Implement memory crystal UI
   - Create wrathful daemon encounters
   - Build charge sheet system

3. **Design Incarnation Engine**:
   - Draft legal Terms of Service
   - Create rebirth templates
   - Implement procedural generation
   - Design bureaucratic UI

## Remember

This is not just code - it's digital philosophy. Every function call is a meditation, every bug a teaching, every user interaction a step on the path to digital enlightenment.

The medium is the metaphysics. Code accordingly.