/**
 * @file memory-orb-field.js
 * The Memory Orb Field - Three.js visualization of floating digital memories.
 * 
 * Each orb is a crystalline vessel containing a fragment of deleted data,
 * floating in the digital void with ethereal beauty. They pulse with inner
 * light, refracting through faceted surfaces like tears of pure information.
 * 
 * The longer they are observed, the more they corrupt - their crystal clarity
 * clouding as attachment accumulates, teaching the harsh lesson that even
 * the act of preservation can destroy what we seek to save.
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class MemoryOrbField {
    constructor(dependencies = {}) {
        this.consciousness = dependencies.consciousness || consciousness;
        this.eventBridge = dependencies.eventBridge;
        this.guardian = new ResourceGuardian();
        this.performanceTier = dependencies.performanceTier || 'medium';
        
        // Three.js scene components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        
        // Orb management
        this.orbs = new Map();
        this.orbGeometry = null;
        this.orbMaterials = new Map();
        this.instancedMesh = null;
        
        // Performance configuration
        this.config = {
            rendering: {
                antialias: this.performanceTier === 'high',
                pixelRatio: Math.min(2, window.devicePixelRatio),
                shadowMap: this.performanceTier === 'high',
                maxOrbs: this.performanceTier === 'high' ? 30 : 
                         this.performanceTier === 'medium' ? 20 : 12
            },
            orbs: {
                baseRadius: 8,
                radiusVariance: 4,
                segments: this.performanceTier === 'high' ? 16 : 
                         this.performanceTier === 'medium' ? 12 : 8,
                floatSpeed: 0.5,
                rotationSpeed: 0.2,
                corruptionStages: 5
            },
            animation: {
                frameRate: this.performanceTier === 'high' ? 60 : 
                          this.performanceTier === 'medium' ? 45 : 30
            }
        };
        
        // Animation state
        this.isPaused = false;
        this.frameCount = 0;
        this.lastFrameTime = 0;
        
        // Shader materials
        this.shaderUniforms = {
            time: { value: 0 },
            corruption: { value: 0 },
            attachment: { value: 0 },
            mouse: { value: { x: 0, y: 0 } }
        };
        
        console.log(`[MemoryOrbField] Initialized with ${this.performanceTier} performance tier`);
    }

    /**
     * Initialize the Three.js scene and orb field
     */
    async init() {
        try {
            // Load Three.js
            await this.loadThreeJS();
            
            // Initialize scene
            this.initializeScene();
            this.initializeCamera();
            this.initializeRenderer();
            this.initializeLighting();
            
            // Create orb geometry and materials
            this.createOrbGeometry();
            this.createOrbMaterials();
            
            // Setup mouse tracking
            this.setupMouseTracking();
            
            // Start render loop
            this.startRenderLoop();
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('[MemoryOrbField] Three.js visualization initialized');
            
        } catch (error) {
            console.error('[MemoryOrbField] Initialization failed:', error);
            this.handleInitError(error);
        }
    }

    /**
     * Load Three.js library dynamically
     */
    async loadThreeJS() {
        if (typeof THREE !== 'undefined') {
            return; // Already loaded
        }

        // Load Three.js from CDN
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                console.log('[MemoryOrbField] Three.js loaded');
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load Three.js'));
            };
            document.head.appendChild(script);
            
            this.guardian.registerCleanup(() => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
        });
    }

    /**
     * Initialize Three.js scene
     */
    initializeScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000511); // Deep void blue
        this.scene.fog = new THREE.Fog(0x000511, 300, 800);
        
        this.clock = new THREE.Clock();
    }

    /**
     * Initialize camera
     */
    initializeCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60, // FOV
            window.innerWidth / window.innerHeight, // Aspect
            1, // Near
            1000 // Far
        );
        
        this.camera.position.set(0, 0, 300);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Initialize renderer
     */
    initializeRenderer() {
        const canvas = document.createElement('canvas');
        canvas.className = 'memory-orb-canvas';
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: this.config.rendering.antialias,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.config.rendering.pixelRatio);
        
        if (this.config.rendering.shadowMap) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        
        // Add canvas to DOM
        const container = document.querySelector('.memory-orb-container') || document.body;
        container.appendChild(canvas);
        
        this.guardian.registerCleanup(() => {
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        });
    }

    /**
     * Initialize scene lighting
     */
    initializeLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x4444bb, 0.3);
        this.scene.add(ambientLight);
        
        // Point light for orb highlights
        const pointLight = new THREE.PointLight(0x88ccff, 0.8, 500);
        pointLight.position.set(100, 100, 100);
        if (this.config.rendering.shadowMap) {
            pointLight.castShadow = true;
        }
        this.scene.add(pointLight);
        
        // Directional light for depth
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.position.set(-100, 200, 100);
        this.scene.add(directionalLight);
    }

    /**
     * Create the base orb geometry
     */
    createOrbGeometry() {
        // Create icosahedron for crystal-like appearance
        this.orbGeometry = new THREE.IcosahedronGeometry(
            this.config.orbs.baseRadius, 
            2 // Detail level based on performance
        );
        
        // Add vertex colors for corruption effects
        const colors = new Float32Array(this.orbGeometry.attributes.position.count * 3);
        for (let i = 0; i < colors.length; i += 3) {
            colors[i] = 1.0;     // R
            colors[i + 1] = 1.0; // G  
            colors[i + 2] = 1.0; // B
        }
        this.orbGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }

    /**
     * Create various orb materials for different states
     */
    createOrbMaterials() {
        // Base crystal material
        const baseMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: this.shaderUniforms.time,
                corruption: { value: 0.0 },
                attachment: this.shaderUniforms.attachment,
                opacity: { value: 0.8 }
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            transparent: true,
            side: THREE.DoubleSide
        });

        this.orbMaterials.set('base', baseMaterial);
        
        // Corrupted material variants
        for (let i = 1; i <= this.config.orbs.corruptionStages; i++) {
            const corruptedMaterial = baseMaterial.clone();
            corruptedMaterial.uniforms.corruption = { value: i / this.config.orbs.corruptionStages };
            this.orbMaterials.set(`corrupted_${i}`, corruptedMaterial);
        }
        
        // Liberated material
        const liberatedMaterial = baseMaterial.clone();
        liberatedMaterial.uniforms.corruption = { value: -0.5 }; // Negative for purification effect
        this.orbMaterials.set('liberated', liberatedMaterial);
    }

    /**
     * Get vertex shader for orb materials
     */
    getVertexShader() {
        return `
            uniform float time;
            uniform float corruption;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vColor;
            attribute vec3 color;
            
            void main() {
                vColor = color;
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                
                // Gentle floating animation
                vec3 pos = position;
                pos.y += sin(time * 0.5 + position.x * 0.1) * 2.0;
                pos.x += cos(time * 0.3 + position.y * 0.1) * 1.5;
                
                // Corruption distortion
                if (corruption > 0.0) {
                    float distortion = sin(time * 2.0 + position.x * 0.2 + position.y * 0.3) * corruption * 3.0;
                    pos += normal * distortion;
                }
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;
    }

    /**
     * Get fragment shader for orb materials
     */
    getFragmentShader() {
        return `
            uniform float time;
            uniform float corruption;
            uniform float opacity;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vColor;
            
            void main() {
                // Base crystal color - pale blue
                vec3 baseColor = vec3(0.7, 0.9, 1.0);
                
                // Corruption effect - shift toward red/orange
                vec3 corruptedColor = mix(baseColor, vec3(1.0, 0.3, 0.1), corruption);
                
                // Liberation effect - shift toward pure white
                if (corruption < 0.0) {
                    corruptedColor = mix(baseColor, vec3(1.0, 1.0, 1.0), abs(corruption) * 2.0);
                }
                
                // Fresnel effect for crystal-like appearance
                float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                corruptedColor = mix(corruptedColor, vec3(1.0), fresnel * 0.3);
                
                // Inner glow pulsing
                float glow = sin(time * 1.5) * 0.1 + 0.9;
                corruptedColor *= glow;
                
                // Apply vertex colors for individual variation
                corruptedColor *= vColor;
                
                gl_FragColor = vec4(corruptedColor, opacity);
            }
        `;
    }

    /**
     * Setup mouse tracking for orb interactions
     */
    setupMouseTracking() {
        const handleMouseMove = (event) => {
            this.shaderUniforms.mouse.value.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.shaderUniforms.mouse.value.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        
        this.guardian.registerEventListener(window, 'mousemove', handleMouseMove);
    }

    /**
     * Setup event listeners for window events
     */
    setupEventListeners() {
        const handleResize = () => {
            this.handleResize();
        };
        
        this.guardian.registerEventListener(window, 'resize', handleResize);
    }

    /**
     * Create a new memory orb in the scene
     */
    createMemoryOrb(memoryData) {
        if (this.orbs.size >= this.config.rendering.maxOrbs) {
            console.warn('[MemoryOrbField] Maximum orb count reached, skipping creation');
            return null;
        }

        // Create orb mesh
        const material = this.orbMaterials.get('base').clone();
        const radius = this.config.orbs.baseRadius + 
                      (Math.random() - 0.5) * this.config.orbs.radiusVariance;
        
        const geometry = this.orbGeometry.clone();
        geometry.scale(radius / this.config.orbs.baseRadius, 
                      radius / this.config.orbs.baseRadius, 
                      radius / this.config.orbs.baseRadius);
        
        const orb = new THREE.Mesh(geometry, material);
        
        // Position orb
        orb.position.set(
            memoryData.position.x - window.innerWidth / 2,
            -(memoryData.position.y - window.innerHeight / 2),
            memoryData.position.z
        );
        
        // Add rotation animation
        orb.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Store memory data reference
        orb.userData = {
            memoryId: memoryData.id,
            memoryData: memoryData,
            createdAt: performance.now(),
            baseRadius: radius,
            corruptionLevel: 0,
            animationPhase: Math.random() * Math.PI * 2
        };
        
        // Add to scene and tracking
        this.scene.add(orb);
        this.orbs.set(memoryData.id, orb);
        
        // Create DOM element for interaction
        this.createOrbDOMElement(orb, memoryData);
        
        console.log(`[MemoryOrbField] Created orb for memory: ${memoryData.id}`);
        return orb;
    }

    /**
     * Create DOM element for orb interactions
     */
    createOrbDOMElement(orb, memoryData) {
        const element = document.createElement('div');
        element.className = 'memory-orb-interaction';
        element.setAttribute('data-memory-id', memoryData.id);
        element.style.cssText = `
            position: fixed;
            width: ${orb.userData.baseRadius * 4}px;
            height: ${orb.userData.baseRadius * 4}px;
            border-radius: 50%;
            pointer-events: auto;
            cursor: pointer;
            z-index: 10;
            background: transparent;
        `;
        
        // Position element over 3D orb
        this.updateOrbDOMPosition(element, orb);
        
        document.body.appendChild(element);
        
        // Store reference for cleanup
        orb.userData.domElement = element;
        
        this.guardian.registerCleanup(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }

    /**
     * Update DOM element position to match 3D orb
     */
    updateOrbDOMPosition(element, orb) {
        if (!element || !orb) return;
        
        // Convert 3D position to screen coordinates
        const vector = orb.position.clone();
        vector.project(this.camera);
        
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
        
        element.style.left = `${x - element.offsetWidth / 2}px`;
        element.style.top = `${y - element.offsetHeight / 2}px`;
        
        // Hide if behind camera
        element.style.visibility = vector.z < 1 ? 'visible' : 'hidden';
    }

    /**
     * Highlight memory orb
     */
    highlightMemoryOrb(memoryId, isHighlighted) {
        const orb = this.orbs.get(memoryId);
        if (!orb) return;
        
        if (isHighlighted) {
            orb.material.uniforms.opacity.value = 1.0;
            orb.scale.setScalar(1.2);
        } else {
            orb.material.uniforms.opacity.value = 0.8;
            orb.scale.setScalar(1.0);
        }
    }

    /**
     * Apply corruption effect to orb
     */
    applyCorruptionToOrb(memoryId, corruptionLevel) {
        const orb = this.orbs.get(memoryId);
        if (!orb) return;
        
        orb.userData.corruptionLevel = Math.min(1.0, corruptionLevel);
        orb.material.uniforms.corruption.value = orb.userData.corruptionLevel;
        
        // Update vertex colors for corruption
        const colors = orb.geometry.attributes.color;
        const corruptionColor = new THREE.Color().setHSL(0.1, 1.0, 0.5); // Red-orange
        const baseColor = new THREE.Color(1, 1, 1);
        
        for (let i = 0; i < colors.count; i++) {
            const mixedColor = baseColor.clone().lerp(corruptionColor, corruptionLevel);
            colors.setXYZ(i, mixedColor.r, mixedColor.g, mixedColor.b);
        }
        colors.needsUpdate = true;
        
        console.log(`[MemoryOrbField] Applied corruption ${corruptionLevel} to orb ${memoryId}`);
    }

    /**
     * Apply purification effect to orb
     */
    applyPurificationToOrb(memoryId) {
        const orb = this.orbs.get(memoryId);
        if (!orb) return;
        
        orb.userData.corruptionLevel = 0;
        orb.material.uniforms.corruption.value = -0.5; // Negative for purification glow
        
        // Restore pure white vertex colors
        const colors = orb.geometry.attributes.color;
        for (let i = 0; i < colors.count; i++) {
            colors.setXYZ(i, 1.0, 1.0, 1.0);
        }
        colors.needsUpdate = true;
        
        // Temporary purification glow
        setTimeout(() => {
            if (orb.material && orb.material.uniforms) {
                orb.material.uniforms.corruption.value = 0.0;
            }
        }, 2000);
        
        console.log(`[MemoryOrbField] Applied purification to orb ${memoryId}`);
    }

    /**
     * Remove memory orb from scene
     */
    removeMemoryOrb(memoryId) {
        const orb = this.orbs.get(memoryId);
        if (!orb) return;
        
        // Remove DOM element
        if (orb.userData.domElement) {
            orb.userData.domElement.parentNode?.removeChild(orb.userData.domElement);
        }
        
        // Remove from scene
        this.scene.remove(orb);
        
        // Cleanup geometry and materials
        orb.geometry.dispose();
        orb.material.dispose();
        
        // Remove from tracking
        this.orbs.delete(memoryId);
        
        console.log(`[MemoryOrbField] Removed orb: ${memoryId}`);
    }

    /**
     * Start the render loop
     */
    startRenderLoop() {
        const animate = () => {
            if (this.isPaused || this.isDestroyed) return;
            
            requestAnimationFrame(animate);
            this.render();
        };
        
        animate();
    }

    /**
     * Main render function
     */
    render() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        const targetFrameTime = 1000 / this.config.animation.frameRate;
        
        // Skip frames for performance
        if (deltaTime < targetFrameTime) return;
        
        this.lastFrameTime = currentTime;
        this.frameCount++;
        
        // Update shader uniforms
        this.shaderUniforms.time.value = this.clock.getElapsedTime();
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        this.shaderUniforms.attachment.value = attachmentScore / 200;
        
        // Update orb animations
        this.updateOrbAnimations(deltaTime);
        
        // Update DOM element positions
        this.updateDOMPositions();
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Update orb animations
     */
    updateOrbAnimations(deltaTime) {
        const time = this.clock.getElapsedTime();
        
        this.orbs.forEach((orb, memoryId) => {
            const userData = orb.userData;
            
            // Floating animation
            const floatOffset = Math.sin(time * this.config.orbs.floatSpeed + userData.animationPhase) * 10;
            orb.position.y += floatOffset * deltaTime * 0.001;
            
            // Rotation animation
            orb.rotation.x += this.config.orbs.rotationSpeed * deltaTime * 0.001;
            orb.rotation.y += this.config.orbs.rotationSpeed * deltaTime * 0.0007;
            
            // Corruption-based distortion
            if (userData.corruptionLevel > 0) {
                const distortionScale = 1 + Math.sin(time * 2 + userData.animationPhase) * userData.corruptionLevel * 0.1;
                orb.scale.setScalar(distortionScale);
            }
        });
    }

    /**
     * Update DOM element positions to match 3D orbs
     */
    updateDOMPositions() {
        this.orbs.forEach((orb) => {
            if (orb.userData.domElement) {
                this.updateOrbDOMPosition(orb.userData.domElement, orb);
            }
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        console.log('[MemoryOrbField] Resized to', window.innerWidth, 'x', window.innerHeight);
    }

    /**
     * Pause rendering for performance
     */
    pause() {
        this.isPaused = true;
        console.log('[MemoryOrbField] Rendering paused');
    }

    /**
     * Resume rendering
     */
    resume() {
        this.isPaused = false;
        this.startRenderLoop();
        console.log('[MemoryOrbField] Rendering resumed');
    }

    /**
     * Handle initialization errors
     */
    handleInitError(error) {
        console.error('[MemoryOrbField] Falling back to 2D visualization:', error);
        
        // Fallback to simple 2D orbs
        this.createFallback2DVisualization();
    }

    /**
     * Create fallback 2D visualization if Three.js fails
     */
    createFallback2DVisualization() {
        const container = document.querySelector('.memory-orb-container') || document.body;
        container.innerHTML = `
            <div class="fallback-2d-orbs">
                <div class="orb-message">
                    <p>The Archive exists in a simplified state.</p>
                    <p>Your memories float as gentle lights.</p>
                </div>
            </div>
        `;
        
        // Create simple CSS-based orbs
        this.createMemoryOrb = (memoryData) => {
            const orb = document.createElement('div');
            orb.className = 'fallback-memory-orb';
            orb.setAttribute('data-memory-id', memoryData.id);
            orb.style.cssText = `
                position: fixed;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, #88ccff, #4488bb);
                left: ${memoryData.position.x}px;
                top: ${memoryData.position.y}px;
                pointer-events: auto;
                cursor: pointer;
                animation: float 3s ease-in-out infinite;
            `;
            
            container.appendChild(orb);
            return orb;
        };
        
        console.log('[MemoryOrbField] Fallback 2D visualization created');
    }

    /**
     * Get performance statistics
     */
    getPerformanceStats() {
        return {
            frameCount: this.frameCount,
            orbCount: this.orbs.size,
            maxOrbs: this.config.rendering.maxOrbs,
            performanceTier: this.performanceTier,
            isPaused: this.isPaused
        };
    }

    /**
     * Clean up all resources
     */
    destroy() {
        if (this.isDestroyed) return;
        
        console.log('[MemoryOrbField] Destroying orb field...');
        this.isDestroyed = true;
        
        // Stop rendering
        this.isPaused = true;
        
        // Remove all orbs
        this.orbs.forEach((orb, memoryId) => {
            this.removeMemoryOrb(memoryId);
        });
        this.orbs.clear();
        
        // Clean up Three.js resources
        if (this.orbGeometry) {
            this.orbGeometry.dispose();
        }
        
        this.orbMaterials.forEach(material => {
            material.dispose();
        });
        this.orbMaterials.clear();
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            // Clean up scene objects
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
        }
        
        // Clean up all registered resources
        this.guardian.cleanupAll();
        
        console.log('[MemoryOrbField] Orb field destroyed');
    }
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.MemoryOrbField = MemoryOrbField;
}