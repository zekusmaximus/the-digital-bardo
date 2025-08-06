# Project Structure

## Root Level Organization
- **Multiple Entry Points** - Each bardo has its own `index.html` (void, clear-lode, datascape, incarnation, limbo)
- **Vite Multi-Page Setup** - Configured in `vite.config.js` with separate build targets
- **Shared Resources** - Common utilities and consciousness system in `/src/`

## Core Directories

### `/src/` - Shared Core System
- **`main.js`** - Bootstrap entry point with error handling
- **`consciousness/`** - Central state management and core systems
  - `digital-soul.js` - Single source of truth for application state
  - `karmic-engine.js` - Tracks user interactions and karma
  - `recognition-fsm.js` - Finite state machine for user recognition
  - `resource-guardian.js` - Memory leak prevention and cleanup
- **`security/`** - Security utilities integrated as narrative elements
  - `consciousness-purification.js` - XSS protection utilities
  - `karmic-validation.js` - Input validation schemas
  - `data-flow-guardian.js` - Data auditing and logging
- **`audio/`** - Audio system components
- **`utils/`** - Shared utilities and compatibility checks
- **`styles/`** - CSS modules for different effects and bardos

### Bardo Modules (e.g., `/clear-lode/`)
Each bardo follows a consistent structure:
- **`index.html`** - Entry point for the bardo experience
- **`[bardo-name].js`** - Main initialization script
- **`orchestrator.js`** - Coordinates all bardo systems
- **`audio-engine.js`** - Bardo-specific audio implementation
- **`fragment-generator.js`** - Visual element management
- **Specialized modules** - Recognition handlers, degradation systems, etc.

### `/audio-worklets/` - Web Audio Processors
- Custom audio worklet processors for real-time audio manipulation
- Karma-driven audio effects and degradation

### `/__tests__/` - Test Suite
- Unit tests for core systems
- Performance test suites
- Integration tests for karmic engine

## Architecture Patterns

### State Management
- **Centralized State** - All state in `DigitalConsciousness` class
- **Reactive Updates** - Subscribe/notify pattern for state changes
- **Dot Notation Paths** - Access nested state with strings like `'clearLode.degradationLevel'`

### Resource Management
- **Guardian Pattern** - All classes implement `destroy()` method
- **Registration System** - Resources registered with cleanup functions
- **Automatic Cleanup** - Prevents memory leaks in long-running experiences

### Security Integration
- **Narrative Security** - Security measures are part of the story
- **Purification Utilities** - Safe DOM manipulation without innerHTML
- **Validation Schemas** - All user data validated through karmic system

### Performance Optimization
- **Adaptive Monitoring** - Dynamic adjustment based on device capabilities
- **Fragment Optimization** - IntersectionObserver for off-screen management
- **Tier-Based Performance** - Different settings for device capabilities

## Naming Conventions
- **Thematic Naming** - Technical concepts use spiritual/consciousness terminology
- **Class Names** - PascalCase with descriptive, narrative-driven names
- **File Names** - kebab-case with clear purpose indication
- **State Paths** - camelCase dot notation for nested access