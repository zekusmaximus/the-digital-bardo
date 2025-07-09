# Fragment Rendering Optimization with Viewport Detection

This document describes the optimized fragment rendering system implemented for The Digital Bardo's Clear Lode experience.

## Overview

The fragment rendering system has been enhanced with viewport detection using the IntersectionObserver API to automatically clean up fragments that drift beyond the user's perception, improving performance and memory usage.

## Key Features

### 1. Viewport Detection with IntersectionObserver

```javascript
const fragmentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            // Fragment has drifted beyond perception
            const fragment = entry.target;
            const content = fragment.textContent;
            
            // Record the dissolution event
            consciousness.recordEvent('memory_dissolved', {
                content: content,
                timeVisible: Date.now() - (fragment.dataset.birthTime || Date.now()),
                naturalDissolution: true
            });
            
            // Clean removal
            this.removeFragment(fragment);
        }
    });
}, { 
    rootMargin: '50px',
    threshold: 0
});
```

**Benefits:**
- Automatic cleanup of off-screen fragments
- Reduced memory usage
- Better performance on lower-end devices
- Maintains narrative coherence by tracking "dissolved memories"

### 2. Adaptive Performance Modes

The system automatically adjusts performance based on device capabilities:

- **Normal Mode**: Full fragment creation (up to 10 active fragments)
- **Reduced Mode**: Limited fragments (up to 6 active fragments)  
- **Minimal Mode**: Essential fragments only (up to 3 active fragments)

### 3. Performance Monitoring

Real-time monitoring of:
- Memory pressure (using `performance.memory` when available)
- Frame rate detection
- Fragment lifecycle metrics
- Average fragment lifetime

### 4. Memory Management

```javascript
removeFragment(fragment) {
    // Stop observing
    this.fragmentObserver.unobserve(fragment);
    
    // Remove from active list
    this.activeFragments = this.activeFragments.filter(f => f !== fragment);
    
    // Remove from DOM
    if (fragment.parentNode) {
        fragment.remove();
    }
    
    // Update metrics
    this.performanceMetrics.fragmentsRemoved++;
}
```

## Implementation Details

### Fragment Lifecycle

1. **Creation**: Fragment created with timestamp and positioned at screen edge
2. **Observation**: IntersectionObserver starts monitoring viewport status
3. **Animation**: GSAP handles drift animation toward screen center
4. **Dissolution**: Either by viewport exit (optimized) or animation completion

### Performance Metrics

The system tracks:
- `fragmentsCreated`: Total fragments generated
- `fragmentsRemoved`: Total fragments cleaned up
- `averageLifetime`: Average time fragments remain visible
- `memoryPressure`: Current memory usage ratio

### Consciousness Integration

All fragment events are recorded in the consciousness system:
- `memory_dissolved`: When fragments exit viewport
- `fragment_field_started`: When fragment generation begins
- `fragments_intensified`: When fragment creation accelerates
- `performance_mode_changed`: When performance mode adjusts

## Usage

### Basic Usage

```javascript
import { FragmentGenerator } from './fragment-generator.js';

const fragments = new FragmentGenerator();
fragments.startFragmentField();
```

### Advanced Configuration

```javascript
// Force specific performance mode
fragments.setPerformanceMode('minimal');

// Get performance statistics
const stats = fragments.getPerformanceStats();
console.log('Active fragments:', stats.activeFragments);
console.log('Performance mode:', stats.performanceMode);

// Clean shutdown
fragments.destroy();
```

### Demo and Testing

Include the optimization demo for real-time monitoring:

```javascript
import { FragmentOptimizationDemo } from './fragment-optimization-demo.js';

// Demo automatically initializes and provides UI controls
// Access via window.fragmentOptimizationDemo
```

## Performance Benefits

### Before Optimization
- Fragments accumulated indefinitely
- Memory usage grew continuously
- Performance degraded over time
- No automatic cleanup

### After Optimization
- Automatic viewport-based cleanup
- Adaptive performance scaling
- Memory usage remains stable
- Real-time performance monitoring

## Browser Compatibility

- **IntersectionObserver**: Supported in all modern browsers
- **Performance.memory**: Chrome/Edge only (graceful fallback)
- **GSAP**: Full compatibility maintained
- **Fallback**: Manual cleanup for unsupported browsers

## Configuration Options

### IntersectionObserver Settings
- `rootMargin: '50px'`: Cleanup buffer zone
- `threshold: 0`: Trigger when completely out of view

### Performance Thresholds
- Memory pressure > 80%: Switch to minimal mode
- Memory pressure > 60%: Switch to reduced mode
- FPS < 30: Reduce performance mode
- FPS < 20: Switch to minimal mode

## Debugging

Enable debug mode by adding `?debug` to the URL to see:
- Fragment creation/destruction events
- Performance mode changes
- Memory dissolution tracking
- Real-time statistics

## Future Enhancements

Potential improvements:
- WebGL-based fragment rendering for better performance
- Predictive cleanup based on fragment trajectory
- Dynamic quality adjustment based on device capabilities
- Advanced memory pooling for fragment reuse
