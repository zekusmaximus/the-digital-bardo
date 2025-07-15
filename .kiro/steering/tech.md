# Technology Stack

## Build System & Framework
- **Vite** - Modern frontend build tool with ES modules support
- **Node.js 18+** - Runtime environment
- **ES6+ Modules** - Modern JavaScript with import/export syntax

## Core Dependencies
- **GSAP (GreenSock)** - Professional animation library for complex animations
- **Three.js** - 3D graphics and WebGL rendering
- **Web Audio API** - Immersive audio experiences with custom audio worklets

## Deployment
- **Netlify** - Static site hosting with custom headers and CSP
- **Custom 404** - Redirects to `/limbo/index.html` as part of narrative

## Development Commands
```bash
# Development server (runs on port 8888)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Deploy to Netlify staging
npm run deploy

# Deploy to Netlify production
npm run deploy:prod
```

## Security Features
- **Content Security Policy (CSP)** - Strict policy with nonce-based development support
- **XSS Protection** - Custom purification utilities in `src/security/`
- **Input Validation** - Karmic validation system for all user data
- **Data Flow Auditing** - Comprehensive logging and monitoring

## Browser Requirements
- **Web Audio API** - Required for full audio experience
- **Intersection Observer** - For performance optimization
- **ES6+ Support** - Modern JavaScript features
- **WebGL** - For Three.js 3D graphics

## Performance Tiers
The application detects device capabilities and adjusts performance settings:
- **High Tier** - Full features for high-end devices
- **Medium Tier** - Reduced complexity for mid-range devices  
- **Low Tier** - Minimal features for low-end devices