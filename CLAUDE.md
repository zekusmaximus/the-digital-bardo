# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### Phase 1: Clear Lode (95% Complete - Production Ready)

**Fully Implemented Features:**
- ✅ Complete void-to-light transition with multi-layered effects
- ✅ All three recognition methods (center click, keyword typing, spacebar hold)
- ✅ Advanced fragment field system with performance optimization
- ✅ Comprehensive audio degradation from pure tone to white noise
- ✅ Multilingual glitch prompt system (9 languages + corrupted text)
- ✅ Finite state machine with event-driven architecture
- ✅ Three-tier performance adaptation system
- ✅ Memory management with resource cleanup and pooling
- ✅ Cross-browser compatibility with fallback systems
- ✅ Mobile touch support and iOS Safari audio handling
- ✅ Karmic validation and security purification systems

**Key Implementation Files:**
- `clear-lode/orchestrator.js` - Central coordinator with complete integration
- `clear-lode/recognition-handler.js` - All recognition methods with feedback
- `clear-lode/fragment-generator-refactored.js` - Optimized memory fragment system
- `clear-lode/degradation-system.js` - Full multilingual corruption sequence
- `clear-lode/audio-engine.js` - Advanced audio degradation with fallbacks
- `clear-lode/verify-fixes.html` - Comprehensive system verification
- `src/consciousness/digital-soul.js` - Centralized state management
- `src/consciousness/recognition-fsm.js` - Recognition state machine

**Minor Polish Items:**
- Additional easter eggs and hidden console commands
- Performance optimization for very low-end devices
- Enhanced accessibility features

### Phase 2: Datascape (✅ COMPLETE - Production Ready)

**Fully Implemented Features:**
- ✅ Complete Archive realm with Three.js memory orb visualization
- ✅ Advanced shader-based crystalline memory orbs with attachment mechanics
- ✅ Sophisticated peaceful daemon dialogue system with voice synthesis
- ✅ Complete Firewall realm with industrial prosecution soundscape
- ✅ System Auditor with comprehensive legal charge sheet generation
- ✅ Digital Sin Registry compiling transgressions from consciousness data
- ✅ Archive Audio Engine with crystalline soundscape and memory chimes
- ✅ Firewall Audio Engine with industrial prosecution sounds and feedback
- ✅ Complete realm navigation system with transition mechanics
- ✅ Full integration with consciousness state management and event systems
- ✅ Comprehensive testing framework with visual test interface

**Key Implementation Files:**
- `datascape/datascape-orchestrator.js` - Master coordinator with complete integration
- `datascape/memory-orb-field.js` - Three.js crystalline orb field with shader effects
- `datascape/peaceful-daemon-dialogue.js` - Complete dialogue trees with manipulation techniques
- `datascape/digital-sin-registry.js` - Comprehensive sin compilation and categorization
- `datascape/system-auditor.js` - Legal prosecution entity with charge sheet generation
- `datascape/archive-audio-engine.js` - Crystalline soundscape with memory-triggered audio
- `datascape/firewall-audio-engine.js` - Industrial prosecution audio with denial feedback
- `datascape/test-phase2-complete.html` - Complete integration testing interface
- `datascape/archive-controller.js` - Archive realm coordinator
- `datascape/firewall-controller.js` - Firewall realm coordinator
- `datascape/realm-navigator.js` - Transition system between realms

## Phase 2 Technical Details

### Memory Crystal Three.js Implementation
- **Shader System**: Complete vertex and fragment shaders with crystalline refraction effects
- **Material Variants**: Different materials for memory types (nostalgic, achievement, connection, etc.)
- **Attachment Mechanics**: Orbs accumulate attachment through viewing with visual feedback
- **Corruption System**: Progressive corruption effects with chaotic distortion at high levels
- **Orbital Animation**: 3D orbital motion with attachment-based behavioral changes
- **Liberation Effects**: Rising dissolution animation with sparkle effects for purified memories

### Peaceful Daemon Dialogue System
- **Dialogue Trees**: Complete conversation trees for 4+ daemon types (nostalgia, validation, productivity, connection)
- **Psychological Manipulation**: 7 manipulation techniques (gaslighting, love-bombing, fear/uncertainty/doubt, etc.)
- **Progressive Corruption**: Text corruption effects at high attachment levels
- **Voice Synthesis**: Web Speech API integration with seductive voice parameters
- **Escalation System**: Dialogue intensifies based on user resistance and interaction history
- **Recognition Response**: Graceful dissolution dialogue when user achieves recognition

### Digital Sin Registry & System Auditor
- **Sin Detection**: 10+ sin patterns across 6 categories (communication, security, productivity, social, consumption, privacy)
- **Evidence Compilation**: Detailed evidence gathering from consciousness memories and karma data
- **Legal Document Generation**: Complete formal charge sheets with legal citations and structure
- **Escalation Mechanics**: Denial multiplies penalties; acceptance reduces them
- **Voice Synthesis**: Authoritative prosecutorial voice with menacing parameters
- **Visual Manifestation**: Holographic legal document display with corruption effects

### Audio Engine Implementation
**Archive Audio Engine:**
- **Crystalline Harmonics**: 4-voice crystal chime system with bell-like harmonics
- **Ambient Drone**: Multi-oscillator drone with LFO modulation and warmth filtering
- **Attachment Resonance**: Golden ratio subharmonic that grows with attachment level
- **Memory-Triggered Audio**: Specific chimes for different memory types
- **Spatial Audio**: 3D positioning for memory orb interactions

**Firewall Audio Engine:**
- **Industrial Soundscape**: Server room drone with harsh distortion and bandpass filtering
- **Prosecution Pulse**: Rhythmic aggressive pulse with pattern sequencing
- **Accusation Synthesizers**: Sharp, cutting sawtooth oscillators for specific charges
- **Denial Feedback**: Harsh feedback loop triggered by user denial responses
- **Verdict Stinger**: Authoritative low-frequency chord progression for final judgment

### Integration Architecture
- **Event-Driven System**: Complete event bridge for cross-system communication
- **Consciousness Integration**: Full state management through digital consciousness system
- **Performance Adaptation**: Three-tier performance system (high/medium/low) with appropriate fallbacks
- **Resource Management**: Comprehensive cleanup with ResourceGuardian pattern
- **Testing Framework**: Visual integration test interface with real-time system monitoring

### Phase 3: Incarnation Engine (Production Ready) ✅

**Key Implementation Files:**
- `incarnation/incarnation-engine.js` - Main orchestrator for bureaucratic processing
- `incarnation/karmic-accountant.js` - Karma calculation with 6 metric categories and bureaucratic adjustments
- `incarnation/terms-generator.js` - 47-page Terms of Incarnation with comprehensive legalese
- `incarnation/incarnation-selector.js` - Tier-based selection (enlightened to deprecated tiers)
- `incarnation/bureaucratic-ui.js` - Form generation system with infinite loading bars
- `incarnation/procedural-generator.js` - Personality-based incarnation generation
- `incarnation/audio/incarnation-audio.js` - Hold music and bureaucratic ambiance
- `incarnation/styles/incarnation.css` - Corporate purgatory theme with beige and fluorescent aesthetics
- `incarnation/test-incarnation-integration.html` - Comprehensive integration testing

**Bureaucratic Features:**
- **Karmic Accounting**: Six metric categories (Digital Productivity, Meme Propagation, Emotional Labor Balance, Digital Footprint, Attention Economy, Social Complexity)
- **Excessive Precision**: Calculations to 4 decimal places with inflation adjustments, server load penalties, and cosmic tax rates
- **12 Required Forms**: Personal Information (PIE-77B), Karmic Declaration (KAD-404), Existential Assessment (EIA-∞), Digital Footprint Report (DFIR-2024), plus 8 additional bureaucratic forms
- **Infinite Loading Bars**: Zeno's paradox implementation - approaches but never reaches 100%
- **Terms of Service**: 47 pages of dense legalese including liability waivers, intellectual property assignments, and force majeure clauses
- **5-Tier System**: Enlightened, Premium, Standard, Limited, Deprecated with karma requirements
- **Premium Locked Features**: Always inaccessible options like "True Enlightenment" and "Retain Memories"
- **Hold Music**: Eternal 45-second loop with mind-numbing melody in A major
- **Ambient Bureaucracy**: Fluorescent hum, keyboard clacking, printer whirs, and unanswered phone rings
- **Procedural Generation**: Algorithm-based incarnation assignment with personality analysis and Big Five traits
- **Corporate Purgatory Theme**: Beige backgrounds, forms blue (#0066cc), manila folder aesthetics, and cubicle gray accents

**Philosophy**: "The Medium is the Metaphysics" - every technical decision reinforces the narrative of bureaucratic purgatory, where spiritual transformation becomes a customer service experience.

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

## Essential Commands

### Development
```bash
# Start development server (port 8888)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment
```bash
# Deploy to staging
npm run deploy

# Deploy to production
npm run deploy:prod
```

### Testing Strategy
This project uses custom testing instead of traditional test frameworks:

**Manual Test Pages** (Located in `/clear-lode/`, `/datascape/` and root):
- `verify-fixes.html` - System verification panel
- `debug-test.html` - Debug panel with real-time monitoring
- `test-manual.html` - Manual testing interface 
- `karma-test.html` - Karmic engine testing
- `security-test.html` - Security validation testing
- `datascape/test-archive-integration.html` - Datascape integration testing

**Debug Mode**: Add `?debug` parameter to any URL to enable console logging.

**Performance Testing**: 
- `adaptive-monitoring-test.html` - Performance tier detection
- `fragment-optimization-demo.js` - Fragment rendering optimization

## Core Architecture

### Centralized State Management
All application state flows through `src/consciousness/digital-soul.js`:
- **Single Source of Truth**: `DigitalConsciousness` class manages all state
- **Reactive Updates**: Subscribe to state changes via `consciousness.subscribe(path, callback)`
- **Safe Access**: Use `consciousness.getState(path)` and `consciousness.setState(path, value)`

### Event-Driven Architecture  
The system uses a custom event bridge pattern:
- `ClearLodeEventBridge` coordinates module communication
- Modules emit events instead of direct coupling
- FSM (Finite State Machine) manages recognition states in `recognition-fsm.js`

### Resource Management
All classes implement `destroy()` method with `ResourceGuardian`:
```javascript
// Register resources for automatic cleanup
this.guardian.register(this.timeline, () => this.timeline.kill());
this.guardian.register(this.observer, () => this.observer.disconnect());

// Cleanup on destroy
destroy() {
    this.guardian.cleanupAll();
}
```

### Security Architecture
Custom security system replaces standard web security:
- **XSS Prevention**: `consciousness-purification.js` provides secure DOM utilities
- **Input Validation**: `karmic-validation.js` validates all user data 
- **Data Flow Auditing**: `data-flow-guardian.js` tracks data boundaries
- **CSP Integration**: Vite plugin applies development CSP with nonces

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

### Build Configuration
- **Development Port**: 8888 (set in vite.config.js)
- **Multi-Page Build**: 6 entry points (main, void, clear-lode, datascape, incarnation, limbo)
- **Security Headers**: Applied via netlify.toml with custom X-Consciousness headers

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

1. **Polish Clear Lode** (Optional refinements):
   - Add remaining easter eggs and console commands
   - Enhance accessibility features for screen readers
   - Performance optimization for very low-end devices

2. **Phase 2 Complete** ✅:
   - All Datascape systems fully implemented and tested
   - Archive and Firewall realms production-ready
   - Memory orb field with Three.js visualization complete
   - Peaceful and wrathful daemon systems operational
   - Audio engines providing full soundscape experience
   - Comprehensive integration testing framework

3. **Phase 3: Incarnation Engine Complete** ✅:
   - Bureaucratic karma calculation with excessive precision (Karmic Accountant)
   - 47-page Terms of Incarnation generator with dense legalese
   - Tier-based incarnation selection system (enlightened to deprecated)
   - Comprehensive bureaucratic UI with 12 required forms
   - Procedural incarnation generation based on personality analysis
   - Hold music and ambient bureaucratic audio systems
   - Complete corporate purgatory CSS theme
   - Full integration testing suite
   - DMV-of-the-afterlife user experience complete

4. **Future Enhancements** (Optional):
   - Additional incarnation templates and procedural variations
   - Enhanced audio compositions for different bureaucratic scenarios  
   - Performance analytics for karma calculation optimization
   - Expanded Easter eggs and hidden console commands
   - Accessibility improvements for all bureaucratic interfaces

## Remember

This is not just code - it's digital philosophy. Every function call is a meditation, every bug a teaching, every user interaction a step on the path to digital enlightenment.

The medium is the metaphysics. Code accordingly.