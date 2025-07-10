# Performance and Reliability

This document outlines the performance strategy for "The Digital Bardo," focusing on graceful degradation, performance tiers, and robust error handling.

## Browser Support Strategy

The experience is designed to be fully functional on modern, evergreen browsers. For older browsers, a graceful degradation strategy is in place to ensure that users are presented with a clear message rather than a broken experience.

### Critical Features

The following features are required for the full experience:

-   **Web Audio API**: For the immersive audio experience.
-   **Intersection Observer**: For efficient off-screen resource management.
-   **ES6+**: For modern JavaScript features.

If any of these features are unavailable, a fallback UI will be displayed.

## Performance Tiers

To ensure a stable experience across a wide range of devices, the application uses a tier-based performance system. The performance tier is detected at startup based on device memory and CPU core count.

The following tiers are defined:

-   **High**: For high-end devices.
-   **Medium**: For mid-range devices.
-   **Low**: For low-end devices.

Each tier has its own settings for fragment count, creation interval, and animation duration.

## Error Handling

All GSAP animations are wrapped in an `AnimationGuardian` to prevent silent failures and application crashes. This utility catches errors in GSAP animations and provides a simple CSS transition fallback if GSAP is unavailable.

## Resource Cleanup

A `ResourceGuardian` is used to track and clean up all resources, including event listeners, timers, observers, and audio contexts. This ensures that resources are properly disposed of when they are no longer needed, preventing memory leaks.