# Adaptive Performance Monitoring

## Overview

The Fragment Generator now includes an adaptive performance monitoring system that dynamically adjusts monitoring frequency based on system performance and stability. This reduces monitoring overhead during stable periods while increasing responsiveness during performance-critical situations.

## How It Works

### Traditional Fixed Monitoring
Previously, the system used a fixed 2-second interval for memory monitoring:
```javascript
setInterval(() => {
    // Monitor memory pressure
}, 2000); // Fixed 2-second interval
```

### Adaptive Monitoring
The new system adjusts monitoring frequency based on:
- **Memory pressure changes**: Rapid changes trigger more frequent monitoring
- **Performance mode transitions**: Mode changes indicate system stress
- **Frame rate fluctuations**: Low FPS triggers increased monitoring
- **Stability periods**: Consistent performance allows reduced monitoring

## Configuration

### Monitoring Intervals
- **Minimum Interval**: 500ms (high-frequency monitoring during critical periods)
- **Maximum Interval**: 10,000ms (low-frequency monitoring during stable periods)
- **Default Start**: 2,000ms (balanced starting point)

### Sensitivity Levels
The system supports four sensitivity presets:

#### Low Sensitivity
```javascript
{
    minInterval: 1000,    // 1 second minimum
    maxInterval: 30000,   // 30 seconds maximum
    stabilityThreshold: 10 // Requires 10 stable readings
}
```
- Best for: Low-end devices, battery conservation
- Trade-off: Slower response to performance issues

#### Normal Sensitivity (Default)
```javascript
{
    minInterval: 500,     // 0.5 seconds minimum
    maxInterval: 10000,   // 10 seconds maximum
    stabilityThreshold: 5 // Requires 5 stable readings
}
```
- Best for: Most applications, balanced performance
- Trade-off: Good balance of responsiveness and efficiency

#### High Sensitivity
```javascript
{
    minInterval: 250,     // 0.25 seconds minimum
    maxInterval: 5000,    // 5 seconds maximum
    stabilityThreshold: 3 // Requires 3 stable readings
}
```
- Best for: Performance-critical applications
- Trade-off: Higher monitoring overhead

#### Realtime Sensitivity
```javascript
{
    minInterval: 100,     // 0.1 seconds minimum
    maxInterval: 2000,    // 2 seconds maximum
    stabilityThreshold: 2 // Requires 2 stable readings
}
```
- Best for: Development, debugging, real-time applications
- Trade-off: Highest monitoring overhead

## Adaptive Logic

### Frequency Increase Triggers
Monitoring frequency increases (interval decreases) when:
- Memory pressure > 70%
- Memory pressure change > 5%
- Performance mode changes
- Frame rate < 30 FPS

### Frequency Decrease Triggers
Monitoring frequency decreases (interval increases) when:
- Memory pressure change < 1%
- No performance mode changes
- Frame rate > 50 FPS
- Stability counter reaches threshold

### Adjustment Algorithm
```javascript
// Increase frequency (30% reduction in interval)
newInterval = currentInterval * 0.7

// Decrease frequency (50% increase in interval)
newInterval = currentInterval * 1.5
```

## API Usage

### Basic Usage
```javascript
const fragmentGenerator = new FragmentGenerator();
fragmentGenerator.startFragmentField();
```

### Configure Sensitivity
```javascript
// Set monitoring sensitivity
fragmentGenerator.setMonitoringSensitivity('high');

// Available options: 'low', 'normal', 'high', 'realtime'
```

### Get Monitoring Stats
```javascript
const stats = fragmentGenerator.getPerformanceStats();
console.log(stats.adaptiveMonitoring);
// Output:
// {
//     currentInterval: 1500,
//     stabilityCounter: 3,
//     monitoringEfficiency: 0.75
// }
```

### Manual Performance Mode
```javascript
// Force specific performance mode (bypasses adaptive logic)
fragmentGenerator.setPerformanceMode('minimal');
```

## Monitoring Efficiency

The system calculates monitoring efficiency as a score from 0 to 1:
- **0.0**: Maximum monitoring frequency (minimum interval)
- **1.0**: Minimum monitoring frequency (maximum interval)
- **0.5**: Balanced monitoring (mid-range interval)

Higher efficiency scores indicate the system is confident in performance stability and has reduced monitoring overhead.

## Benefits

### Performance Benefits
1. **Reduced CPU Usage**: Less frequent monitoring during stable periods
2. **Faster Response**: More frequent monitoring during performance issues
3. **Battery Conservation**: Lower monitoring overhead on mobile devices
4. **Scalability**: Adapts to different device capabilities

### Development Benefits
1. **Automatic Optimization**: No manual tuning required
2. **Debugging Support**: Real-time monitoring for development
3. **Performance Insights**: Detailed monitoring statistics
4. **Flexible Configuration**: Multiple sensitivity presets

## Testing

### Interactive Test Page
Use `adaptive-monitoring-test.html` to:
- Visualize monitoring frequency changes
- Simulate different load conditions
- Test sensitivity configurations
- Monitor system behavior in real-time

### Load Simulation
```javascript
// Simulate high load
simulateHighLoad();

// Simulate stable conditions
simulateStableLoad();

// Simulate memory pressure
simulateMemoryPressure();
```

## Console Logging

The system provides detailed console logging:
```
🔍 Increased monitoring frequency: 1400ms (memory)
😌 Decreased monitoring frequency: 2100ms (stable performance)
🎛️ Monitoring sensitivity set to: high
```

## Integration with Fragment Optimization Demo

The demo UI now includes adaptive monitoring metrics:
- **Monitor Interval**: Current monitoring frequency
- **Efficiency**: Monitoring efficiency percentage
- **Stability**: Current stability counter

## Best Practices

1. **Use Default Settings**: Normal sensitivity works well for most applications
2. **Monitor Efficiency**: Aim for efficiency scores between 0.3-0.7 for optimal balance
3. **Test Different Loads**: Verify adaptive behavior under various conditions
4. **Consider Device Constraints**: Use lower sensitivity on resource-constrained devices
5. **Debug with High Sensitivity**: Use realtime sensitivity for development and debugging

## Future Enhancements

Potential improvements for the adaptive monitoring system:
- Machine learning-based prediction of performance issues
- User behavior pattern recognition
- Network condition awareness
- Battery level consideration
- Thermal throttling detection
