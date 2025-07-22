# Design Document

## Overview

This design addresses critical UX issues in the clear-lode experience by improving fragment readability, extending recognition timing, enhancing user guidance, and creating progressive corruption effects. The solution maintains the spiritual/karmic narrative while making the experience more accessible and engaging.

## Architecture

### Fragment Positioning System
The fragment positioning will be enhanced with a new `FragmentPositionManager` that ensures fragments appear in readable locations and move at appropriate speeds.

**Key Components:**
- `ReadableZone` calculation system that defines safe viewing areas
- `SpeedController` that adjusts fragment movement based on content length
- `CorruptionProgression` system that starts fragments clean and applies corruption over time

### Recognition Guidance System
A new `RecognitionGuideController` will provide progressive hints and clear instructions without breaking immersion.

**Key Components:**
- `HintProgression` system that reveals recognition methods gradually
- `VisualFeedback` system for recognition attempts
- `TimeExtension` logic that gives users adequate time to engage

### Synchronized Degradation System
The existing degradation system will be enhanced to provide coordinated audio-visual corruption that responds to karma in real-time.

## Components and Interfaces

### FragmentPositionManager
```javascript
class FragmentPositionManager {
    constructor(viewportDimensions, readabilityConfig) {}
    
    // Calculates safe zones for fragment placement
    calculateReadableZone() {}
    
    // Adjusts fragment speed based on content length
    calculateOptimalSpeed(fragmentContent) {}
    
    // Repositions fragments that drift to screen edges
    repositionIfNeeded(fragment) {}
    
    // Validates fragment visibility and readability
    validateFragmentPlacement(fragment) {}
}
```

### RecognitionGuideController
```javascript
class RecognitionGuideController {
    constructor(recognitionMethods, timingConfig) {}
    
    // Shows progressive hints based on user inactivity
    showProgressiveHints(timeElapsed) {}
    
    // Provides visual feedback for recognition attempts
    provideFeedback(method, progress) {}
    
    // Extends recognition window for active users
    extendWindowIfActive() {}
    
    // Displays clear instructions for each method
    displayMethodInstructions(method) {}
}
```

### CorruptionProgression
```javascript
class CorruptionProgression {
    constructor(karmaEngine, degradationConfig) {}
    
    // Applies progressive corruption based on karma
    applyProgressiveCorruption(fragment, karmaState) {}
    
    // Starts fragments in clean state
    initializeCleanFragment(fragment) {}
    
    // Synchronizes corruption with audio degradation
    syncWithAudioDegradation(audioLevel) {}
    
    // Purifies fragments on successful recognition
    purifyOnRecognition(fragments) {}
}
```

## Data Models

### FragmentState
```javascript
const FragmentState = {
    id: String,
    content: String,
    position: { x: Number, y: Number },
    velocity: { x: Number, y: Number },
    corruptionLevel: Number, // 0-1, starts at 0
    readabilityScore: Number, // 0-1, based on position and speed
    karmaInfluence: Object, // tracks which karma types affect this fragment
    lastCorruptionUpdate: Number // timestamp
}
```

### RecognitionSession
```javascript
const RecognitionSession = {
    startTime: Number,
    windowDuration: Number, // base duration, can be extended
    hintsShown: Array, // track which hints have been displayed
    attemptsCount: Number,
    activeMethod: String, // current recognition method being attempted
    progressFeedback: Object, // visual feedback state
    timeExtensions: Number // how many extensions granted
}
```

### ReadabilityConfig
```javascript
const ReadabilityConfig = {
    safeZone: {
        marginTop: Number, // pixels from top
        marginBottom: Number,
        marginLeft: Number,
        marginRight: Number
    },
    speedLimits: {
        maxSpeed: Number, // pixels per second
        minSpeed: Number,
        speedByContentLength: Function // calculates speed based on text length
    },
    visibility: {
        minContrast: Number,
        minFontSize: Number,
        maxOpacity: Number
    }
}
```

## Error Handling

### Fragment Positioning Errors
- **Edge Detection**: If fragments move outside readable zones, they are smoothly repositioned
- **Speed Validation**: Fragments moving too fast are automatically slowed down
- **Overlap Prevention**: System prevents fragments from overlapping in unreadable ways

### Recognition Timing Errors
- **Timeout Grace Period**: Users get warning before timeout and opportunity to extend
- **Method Conflict**: If multiple recognition methods are attempted simultaneously, clear feedback guides user
- **Audio Failure Compensation**: If audio doesn't initialize, visual guidance is enhanced

### Corruption Synchronization Errors
- **Karma State Mismatch**: If karma and corruption get out of sync, system rebalances gradually
- **Performance Degradation**: If corruption effects impact performance, system reduces complexity
- **Visual Artifact Prevention**: Corruption effects are bounded to prevent unreadable states

## Testing Strategy

### Fragment Readability Testing
- **Position Validation**: Automated tests ensure fragments stay within readable zones
- **Speed Testing**: Verify fragments move at speeds that allow reading based on content length
- **Corruption Progression**: Test that fragments start clean and corrupt progressively

### Recognition Flow Testing
- **Timing Tests**: Verify recognition window stays open for minimum duration
- **Hint Progression**: Test that hints appear at appropriate intervals
- **Method Feedback**: Validate visual feedback for each recognition method

### Integration Testing
- **Audio-Visual Sync**: Test that audio and visual degradation stay coordinated
- **Karma Response**: Verify that karma changes trigger appropriate visual updates
- **Performance Impact**: Ensure improvements don't negatively impact performance

### User Experience Testing
- **Readability Metrics**: Measure fragment readability scores across different devices
- **Recognition Success Rates**: Track whether users can successfully engage with recognition methods
- **Time-to-Understanding**: Measure how quickly users understand what they're supposed to do

## Performance Considerations

### Fragment Optimization
- Use IntersectionObserver to manage off-screen fragments efficiently
- Implement fragment pooling to reduce garbage collection
- Optimize corruption effects to minimize GPU usage

### Recognition System Optimization
- Cache hint animations to reduce rendering overhead
- Use requestAnimationFrame for smooth visual feedback
- Implement debouncing for rapid user inputs

### Memory Management
- Properly dispose of fragment elements when they leave the screen
- Clean up event listeners for recognition methods
- Use ResourceGuardian pattern for all new components