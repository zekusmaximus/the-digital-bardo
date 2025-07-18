# The Digital Bardo
An interactive, web-based exploration of consciousness, life, and the afterlife, inspired by the concept of the Bardo Thödol (the "Tibetan Book of the Dead"). This project, created by speculative fiction author Jeffrey A. Zyjeski, translates the liminal states of the bardo into a series of digital experiences.

Live Demo: https://bardo.zyjeski.com

## About The Project
"The Digital Bardo" is a creative coding project that uses web technologies to create immersive and thought-provoking interactive art. Each "bardo" is a unique module that explores different facets of existence, from the sensory chaos of "Clear Lode" to the introspective journey of "Seeing Reality."

The project leverages JavaScript, GSAP for animation, Three.js for 3D visuals, and the Web Audio API for dynamic soundscapes to guide the user through a digital reincarnation.

## Key Features
- **Interactive "Bardo" States**: Explore multiple unique, self-contained experiences.
- **Dynamic Animations**: Built with the powerful GreenSock Animation Platform (GSAP) for fluid and complex animations.
- **Immersive Audio**: Features a custom audio engine using the Web Audio API, with fallbacks for wider browser compatibility.
- **Performance Optimized**: Includes advanced performance features like:
  - **Adaptive Monitoring**: Dynamically adjusts monitoring frequency to conserve resources, ensuring a smooth experience.
  - **Fragment Optimization**: Uses an IntersectionObserver to manage the rendering of off-screen elements efficiently.
- **Karmic Engine**: A system that tracks user interactions and events, influencing the journey through the bardos.

## Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have Node.js and npm installed on your machine.
```
npm install npm@latest -g
```

### Installation
1. Clone the repo
   ```
   git clone https://github.com/zekusmaximus/the-digital-bardo.git
   ```
2. Install NPM packages
   ```
   npm install
   ```

### Usage
To run the project in a development environment, use the following command. This will start a local server and open the project in your default browser.
```
npm run dev
```

## Project Structure
The project is organized into several key directories:
- **/clear-lode/**: The "Clear Lode" bardo experience module.
    - `audio-engine.js`
    - `clear-lode.js`: Main logic for this bardo.
    - `fragment-generator.js`: Manages visual fragments.
- **/src/**: Core source files.
    - **/consciousness/**: Logic for player state and karma.
        - `digital-soul.js`
        - `karmic-engine.js`
    - `main.js`: Main entry point of the application.
    - `style.css`: Main stylesheet.
- **/seeing-reality/**: The "Seeing Reality" bardo experience module.
- `package.json`: Project dependencies and scripts.
- `README.md`: This file.

## Security

This project incorporates several security measures to protect the experience and its users, aligning with the core principle that "The Medium is the Metaphysics." Security is not just a technical feature but a part of the narrative, representing the purification and integrity of the digital soul.

### 1. Consciousness Purification (XSS Remediation)

To prevent Cross-Site Scripting (XSS) vulnerabilities, all direct DOM manipulations using `innerHTML` have been refactored. The `src/security/consciousness-purification.js` module provides a suite of secure utilities:

-   `purifyAndSetText(element, text)`: Safely sets text content, stripping any potential HTML.
-   `manifestElement(tag, { attributes, textContent })`: Securely creates and configures new DOM elements without parsing HTML strings.
-   `manifestTemplate(templateId, data)`: A simple, secure templating function for creating complex HTML structures from trusted templates.

These utilities ensure that all dynamic content is treated as text, not executable code, thereby preserving the integrity of the user's "consciousness."

### 2. Karmic Validation (Input Validation)

All user-controlled data is rigorously validated to prevent data corruption and injection attacks. The `src/security/karmic-validation.js` module establishes validation schemas for all critical data structures, including:

-   **Thought Fragments**: Ensured to be within length limits and free of HTML.
-   **Karmic Events**: Validated for correct structure and data types.
-   **Audio Parameters**: Clamped to safe ranges to prevent abuse of the Web Audio API.

This "karmic validation" ensures that only pure, well-formed data affects the user's journey through the bardo.

### 3. Content Security Policy (CSP)

A strict Content Security Policy (CSP) has been implemented via the `netlify.toml` file to mitigate code injection and data exfiltration risks. The policy restricts resource loading to trusted sources:

-   `default-src 'self'`: Restricts all resources to the same origin by default.
-   `script-src 'self' https://cdnjs.cloudflare.com`: Allows scripts from the origin and the GSAP CDN.
-   `style-src 'self' 'unsafe-inline'`: Allows inline styles for GSAP compatibility.
-   `img-src 'self' data:`: Allows images from the origin and data URIs.

For development, a nonce-based CSP is dynamically injected via a custom Vite plugin to maintain security while allowing Vite's hot-reloading features.

### 4. Data Flow Guardian (Data Auditing)

A comprehensive data flow auditing system has been implemented in `src/security/data-flow-guardian.js`. This "guardian" logs and audits the flow of data between different parts of the application, ensuring that data crossing boundaries (e.g., from `sessionStorage`, URL parameters, or user events) is monitored.

-   `logDataFlow(source, destination, data)`: Logs key data transfers to the `digital-soul` for traceability.
-   `auditDataBoundaries()`: Performs a systematic review of data entering and leaving the system's core.

This audit trail provides a clear understanding of how information shapes the digital soul, reinforcing the project's thematic depth.

## Dependencies
This project relies on the following key dependencies:
- **gsap**: A professional-grade JavaScript animation library for the modern web.
- **three**: A cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser.
- **vite**: A modern frontend build tool that provides a faster and leaner development experience.

## Author
Jeffrey A. Zyjeski - Speculative Fiction Author & Developer
- Website: www.zyjeski.com
- Newsletter: Future Law Insider

## License
This project is licensed under the ISC License - see the LICENSE for details.