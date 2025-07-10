# System Architecture: The Digital Bardo

## Core Principle: The Medium is the Metaphysics

The architecture of "The Digital Bardo" is designed to reflect its narrative themes. All architectural decisions, from naming conventions to data flow, are intended to reinforce the project's techno-spiritual concepts.

## 1. Unified State Management

### 1.1. Single Source of Truth: `digital-soul.js`

To maintain a coherent and predictable application state, all state is centralized in the `DigitalConsciousness` class within `src/consciousness/digital-soul.js`. This module is the single source of truth for the entire application, eliminating fragmented and inconsistent state management.

The state's shape is defined by the `STATE_SCHEMA`, which provides a clear and enforceable structure.

### 1.2. State Management API

All interactions with the application state are managed through a dedicated API, ensuring that all state changes are predictable and traceable.

- **`consciousness.getState(path)`**: Safely retrieves nested state values using a dot-notation path (e.g., `'clearLode.degradationLevel'`).
- **`consciousness.setState(path, value)`**: Updates a state value at the given path. This method is responsible for triggering notifications to all subscribed modules.
- **`consciousness.subscribe(path, callback)`**: Allows modules to subscribe to changes in specific parts of the state. When a state value is updated, all relevant subscribers are notified, enabling reactive and decoupled components.

## 2. Recognition Finite State Machine (FSM)

The user recognition logic is managed by a formal Finite State Machine (FSM) defined in `src/consciousness/recognition-fsm.js`. This approach replaces complex, event-driven logic with a predictable and easily debugged state management system.

### 2.1. States

The FSM has the following states:

- **`dormant`**: The initial state, before the recognition window opens.
- **`window_open`**: The recognition window is active, and the user can interact.
- **`recognized`**: A terminal state indicating successful recognition.
- **`failed`**: A terminal state indicating that the recognition window has closed without user interaction.

### 2.2. Transitions

Transitions between states are triggered by explicit events:

- `onLightManifested`: `dormant` -> `window_open`
- `onRecognition`: `window_open` -> `recognized`
- `onTimeout`: `window_open` -> `failed`

Modules now react to FSM state changes rather than direct user events, creating a more robust and predictable system.

## 3. Resource Management: The Resource Guardian

To prevent memory leaks and ensure system stability, a `ResourceGuardian` utility is implemented in `src/consciousness/resource-guardian.js`.

### 3.1. `destroy()` Method

All major classes now implement a `destroy()` method, which is responsible for cleaning up all resources created by the class.

### 3.2. Registration and Cleanup

- The `ResourceGuardian` is instantiated within each class's constructor.
- All resources (e.g., GSAP timelines, event listeners, IntersectionObservers) are registered with the guardian using the `register()` method, which pairs the resource with its corresponding cleanup function.
- The `destroy()` method in each class calls `this.guardian.cleanupAll()`, which iterates through all registered resources and executes their cleanup functions.

This pattern ensures that all resources are properly disposed of, preventing memory leaks and promoting a more resilient and maintainable architecture.