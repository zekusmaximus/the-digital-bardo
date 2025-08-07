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
            attachmentLevel: { value: 0 },
            mouse: { value: new THREE.Vector2(0, 0) }
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
     * Create various orb materials for different states with complete shader uniforms
     */
    createOrbMaterials() {
        // Base crystal material with all shader uniforms
        const baseMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: this.shaderUniforms.time,
                corruption: { value: 0.0 },
                attachmentLevel: { value: 0.0 },
                opacity: { value: 0.8 },
                memoryColor: { value: new THREE.Color(0x88ccff) },
                mouse: this.shaderUniforms.mouse
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.orbMaterials.set('base', baseMaterial);
        
        // Create material variants for different memory types
        const memoryTypes = {
            nostalgic: new THREE.Color(0xffb3d9), // Warm pink
            achievement: new THREE.Color(0xffd700), // Gold
            connection: new THREE.Color(0x87ceeb), // Sky blue
            creative: new THREE.Color(0x98fb98), // Pale green
            painful: new THREE.Color(0xdda0dd), // Plum
            lost_opportunity: new THREE.Color(0xff6347) // Tomato
        };
        
        Object.entries(memoryTypes).forEach(([type, color]) => {
            const material = baseMaterial.clone();
            material.uniforms.memoryColor = { value: color };
            this.orbMaterials.set(type, material);
        });
        
        // Corrupted material variants with progressive degradation
        for (let i = 1; i <= this.config.orbs.corruptionStages; i++) {
            const corruptionLevel = i / this.config.orbs.corruptionStages;
            const corruptedMaterial = baseMaterial.clone();
            corruptedMaterial.uniforms.corruption = { value: corruptionLevel };
            // Corrupted orbs pulse red
            corruptedMaterial.uniforms.memoryColor = { value: new THREE.Color().setHSL(0, 1, 0.3 + corruptionLevel * 0.4) };
            this.orbMaterials.set(`corrupted_${i}`, corruptedMaterial);
        }
        
        // Liberated/purified material with white glow
        const liberatedMaterial = baseMaterial.clone();
        liberatedMaterial.uniforms.corruption = { value: -0.5 }; // Negative for purification
        liberatedMaterial.uniforms.memoryColor = { value: new THREE.Color(0xffffff) };
        liberatedMaterial.uniforms.opacity = { value: 0.9 };
        this.orbMaterials.set('liberated', liberatedMaterial);
        
        // Attachment-heavy material with golden seduction
        const attachmentMaterial = baseMaterial.clone();
        attachmentMaterial.uniforms.attachmentLevel = { value: 1.0 };
        attachmentMaterial.uniforms.memoryColor = { value: new THREE.Color(0xffd700) };
        attachmentMaterial.uniforms.opacity = { value: 1.0 };
        this.orbMaterials.set('attached', attachmentMaterial);
    }

    /**
     * Get vertex shader for orb materials with complete crystalline effects
     */
    getVertexShader() {
        return `
            uniform float time;
            uniform float corruption;
            uniform float attachmentLevel;
            uniform vec2 mouse;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vColor;
            varying vec3 vViewPosition;
            varying float vDistortion;
            attribute vec3 color;
            
            void main() {
                vColor = color;
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                
                // Gentle floating animation with attachment influence
                vec3 pos = position;
                float floatIntensity = 1.0 + attachmentLevel * 0.5;
                pos.y += sin(time * 0.5 + position.x * 0.1) * 2.0 * floatIntensity;
                pos.x += cos(time * 0.3 + position.y * 0.1) * 1.5 * floatIntensity;
                pos.z += sin(time * 0.2 + position.z * 0.1) * 0.8 * floatIntensity;
                
                // Mouse interaction - orbs lean toward cursor when attachment is high
                if (attachmentLevel > 0.3) {
                    vec2 mouseInfluence = mouse * 0.02 * attachmentLevel;
                    pos.xy += mouseInfluence;
                }
                
                // Corruption distortion - becomes chaotic at high levels
                if (corruption > 0.0) {
                    float distortionFreq = 2.0 + corruption * 8.0;
                    float distortionAmp = corruption * 3.0;
                    float chaosX = sin(time * distortionFreq + position.x * 0.2);
                    float chaosY = cos(time * distortionFreq + position.y * 0.3);
                    float chaosZ = sin(time * distortionFreq + position.z * 0.4);
                    
                    vec3 chaos = vec3(chaosX, chaosY, chaosZ) * distortionAmp;
                    pos += normal * chaos.x + cross(normal, vec3(0.0, 1.0, 0.0)) * chaos.y;
                    
                    vDistortion = length(chaos);
                } else {
                    vDistortion = 0.0;
                }
                
                // Calculate view position for fresnel effect
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                vViewPosition = -mvPosition.xyz;
                
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
    }

    /**
     * Get fragment shader for orb materials with sophisticated crystalline refraction
     */
    getFragmentShader() {
        return `
            uniform float time;
            uniform float corruption;
            uniform float attachmentLevel;
            uniform float opacity;
            uniform vec3 memoryColor;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vColor;
            varying vec3 vViewPosition;
            varying float vDistortion;
            
            void main() {
                // Calculate view direction for effects
                vec3 viewDirection = normalize(vViewPosition);
                
                // Base crystal color with memory influence
                vec3 baseColor = mix(vec3(0.8, 0.9, 1.0), memoryColor, 0.3);
                
                // Fresnel effect for crystal edges - stronger with attachment
                float fresnelPower = 2.0 + attachmentLevel;
                float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), fresnelPower);
                
                // Refraction simulation - base crystal interior
                vec3 refractedColor = baseColor * (1.0 - fresnel * 0.8);
                
                // Reflection simulation - crystal surface highlights
                vec3 reflectedColor = vec3(1.0, 1.0, 1.0) * fresnel;
                
                // Combine refraction and reflection
                vec3 finalColor = refractedColor + reflectedColor * 0.6;
                
                // Inner memory glow that pulses
                float pulse = sin(time * 2.0) * 0.5 + 0.5;
                float memoryGlow = (1.0 - corruption) * pulse * 0.3;
                finalColor += memoryColor * memoryGlow;
                
                // Attachment creates golden seductive glow
                if (attachmentLevel > 0.2) {
                    vec3 attachmentGlow = vec3(1.0, 0.8, 0.3) * attachmentLevel * 0.4;
                    float attachmentPulse = sin(time * 3.0 + vPosition.x) * 0.5 + 0.5;
                    finalColor += attachmentGlow * attachmentPulse;
                }
                
                // Corruption effects - progressive degradation
                if (corruption > 0.0) {
                    // Color shift toward sickly red/purple
                    vec3 corruptionColor = vec3(0.8, 0.2, 0.4);
                    finalColor = mix(finalColor, corruptionColor, corruption * 0.7);
                    
                    // Add chaotic flickering
                    if (corruption > 0.5) {
                        float flicker = step(0.7, sin(time * 20.0 + vPosition.y * 10.0));
                        finalColor = mix(finalColor, vec3(1.0, 0.0, 0.0), flicker * corruption * 0.5);
                    }
                    
                    // Distortion artifact coloring
                    if (vDistortion > 0.1) {
                        finalColor += vec3(vDistortion * 0.3, 0.0, vDistortion * 0.2);
                    }
                }
                
                // Liberation purification effect (negative corruption)
                if (corruption < 0.0) {
                    vec3 purificationColor = vec3(1.0, 1.0, 1.0);
                    float purificationIntensity = abs(corruption) * 2.0;
                    finalColor = mix(finalColor, purificationColor, purificationIntensity);
                    
                    // Add liberation sparkle
                    float sparkle = step(0.95, sin(time * 10.0 + vPosition.x * 5.0) * 
                                                cos(time * 8.0 + vPosition.y * 4.0));
                    finalColor += vec3(sparkle * purificationIntensity);
                }
                
                // Edge enhancement for crystal definition
                float edgeGlow = pow(fresnel, 0.5) * 0.2;
                finalColor += vec3(edgeGlow);
                
                // Apply vertex colors for individual orb variation
                finalColor *= vColor;
                
                // Dynamic opacity based on viewing angle and attachment
                float dynamicOpacity = opacity * (0.7 + fresnel * 0.3);
                dynamicOpacity *= (0.8 + attachmentLevel * 0.2); // More opaque when attached
                
                gl_FragColor = vec4(finalColor, dynamicOpacity);
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
     * Create a new memory orb with sophisticated material selection and attachment tracking
     */
    createMemoryOrb(memoryData) {
        if (this.orbs.size >= this.config.rendering.maxOrbs) {
            console.warn('[MemoryOrbField] Maximum orb count reached, skipping creation');
            return null;
        }

        // Determine memory type and select appropriate material
        const memoryType = this.classifyMemory(memoryData);
        const materialName = this.orbMaterials.has(memoryType) ? memoryType : 'base';
        const material = this.orbMaterials.get(materialName).clone();
        
        // Set memory-specific color if not already set
        if (memoryData.color) {
            material.uniforms.memoryColor.value = new THREE.Color(memoryData.color);
        }
        
        // Create geometry with size variation
        const radius = this.config.orbs.baseRadius + 
                      (Math.random() - 0.5) * this.config.orbs.radiusVariance;
        
        const geometry = this.orbGeometry.clone();
        const scale = radius / this.config.orbs.baseRadius;
        geometry.scale(scale, scale, scale);
        
        const orb = new THREE.Mesh(geometry, material);
        
        // Position orb in 3D space around the camera
        const angle = Math.random() * Math.PI * 2;
        const elevation = (Math.random() - 0.5) * Math.PI * 0.5;
        const distance = 150 + Math.random() * 100;
        
        orb.position.set(
            Math.cos(angle) * Math.cos(elevation) * distance,
            Math.sin(elevation) * distance,
            Math.sin(angle) * Math.cos(elevation) * distance
        );
        
        // Set initial rotation
        orb.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Store comprehensive data
        orb.userData = {
            memoryId: memoryData.id,
            memoryData: memoryData,
            memoryType: memoryType,
            createdAt: performance.now(),
            baseRadius: radius,
            corruptionLevel: 0,
            attachmentLevel: 0,
            viewCount: 0,
            totalViewTime: 0,
            lastInteraction: 0,
            attachmentAccumulated: 0,
            animationPhase: Math.random() * Math.PI * 2,
            orbitCenter: orb.position.clone(),
            orbitRadius: 20 + Math.random() * 30,
            orbitSpeed: 0.1 + Math.random() * 0.2,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        
        // Add to scene and tracking
        this.scene.add(orb);
        this.orbs.set(memoryData.id, orb);
        
        // Create DOM element for interaction
        this.createOrbDOMElement(orb, memoryData);
        
        // Animate entrance
        this.animateOrbEntrance(orb);
        
        console.log(`[MemoryOrbField] Created ${memoryType} orb for memory: ${memoryData.id}`);
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
     * Highlight memory orb with attachment tracking
     */
    highlightMemoryOrb(memoryId, isHighlighted) {
        const orb = this.orbs.get(memoryId);
        if (!orb) return;
        
        if (isHighlighted) {
            // Start interaction tracking
            orb.userData.lastInteraction = Date.now();
            orb.userData.viewCount++;
            
            // Visual highlighting
            orb.material.uniforms.opacity.value = 1.0;
            const highlightScale = 1.2 + Math.min(orb.userData.viewCount * 0.05, 0.3);
            orb.scale.setScalar(highlightScale);
            
            // Accumulate attachment - more views = more attachment
            const attachmentIncrease = 0.1 * (1 + orb.userData.viewCount * 0.1);
            orb.userData.attachmentAccumulated += attachmentIncrease;
            orb.userData.attachmentLevel = Math.min(1.0, orb.userData.attachmentAccumulated / 10);
            
            // Update global attachment score
            const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
            this.consciousness.setState('datascape.attachmentScore', currentAttachment + attachmentIncrease);
            
            // Record the viewing event
            this.consciousness.recordEvent('memory_orb_viewed', {
                memoryId: memoryId,
                viewCount: orb.userData.viewCount,
                attachmentIncrease: attachmentIncrease,
                totalAttachment: orb.userData.attachmentAccumulated,
                memoryType: orb.userData.memoryType,
                timestamp: Date.now()
            });
            
            // Emit viewing event
            if (this.eventBridge) {
                this.eventBridge.emit('orb:viewed', {
                    memoryId,
                    attachmentIncrease,
                    viewCount: orb.userData.viewCount,
                    memoryType: orb.userData.memoryType
                });
            }
            
            console.log(`[MemoryOrbField] Orb ${memoryId} viewed (count: ${orb.userData.viewCount}, attachment: ${orb.userData.attachmentLevel.toFixed(2)})`);
            
        } else {
            // Calculate view time
            const viewTime = Date.now() - orb.userData.lastInteraction;
            orb.userData.totalViewTime += viewTime;
            
            // Return to normal state
            orb.material.uniforms.opacity.value = 0.8;
            const normalScale = 1.0 + Math.min(orb.userData.attachmentLevel * 0.2, 0.2);
            orb.scale.setScalar(normalScale);
            
            // Long viewing increases corruption
            if (viewTime > 3000) { // 3 seconds
                const corruptionIncrease = Math.min(0.05, viewTime / 60000); // Max 0.05 per minute
                orb.userData.corruptionLevel += corruptionIncrease;
                this.applyCorruptionToOrb(memoryId, orb.userData.corruptionLevel);
            }
        }
    }

    /**
     * Apply corruption effect to orb with visual feedback
     */
    applyCorruptionToOrb(memoryId, corruptionLevel) {
        const orb = this.orbs.get(memoryId);
        if (!orb) return;
        
        orb.userData.corruptionLevel = Math.min(1.0, corruptionLevel);
        orb.material.uniforms.corruption.value = orb.userData.corruptionLevel;
        
        // Progressive corruption effects
        if (corruptionLevel > 0.7) {
            // Heavy corruption - chaotic movement
            orb.userData.rotationSpeed.x *= 1.5;
            orb.userData.rotationSpeed.y *= 1.5;
            orb.userData.orbitSpeed *= 1.8;
            
            // Change material to corrupted variant
            const corruptedMaterial = this.orbMaterials.get('corrupted_5');
            if (corruptedMaterial) {
                orb.material = corruptedMaterial.clone();
                orb.material.uniforms.corruption.value = corruptionLevel;
                orb.material.uniforms.attachmentLevel.value = orb.userData.attachmentLevel;
            }
        } else if (corruptionLevel > 0.3) {
            // Medium corruption - unstable glow
            const stage = Math.ceil(corruptionLevel * this.config.orbs.corruptionStages);
            const corruptedMaterial = this.orbMaterials.get(`corrupted_${stage}`);
            if (corruptedMaterial) {
                orb.material = corruptedMaterial.clone();
                orb.material.uniforms.corruption.value = corruptionLevel;
                orb.material.uniforms.attachmentLevel.value = orb.userData.attachmentLevel;
            }
        }
        
        // Update vertex colors for corruption
        const colors = orb.geometry.attributes.color;
        const corruptionColor = new THREE.Color().setHSL(0.0, 0.8, 0.3 + corruptionLevel * 0.4);
        const baseColor = new THREE.Color(1, 1, 1);
        
        for (let i = 0; i < colors.count; i++) {
            const mixedColor = baseColor.clone().lerp(corruptionColor, corruptionLevel);
            colors.setXYZ(i, mixedColor.r, mixedColor.g, mixedColor.b);
        }
        colors.needsUpdate = true;
        
        console.log(`[MemoryOrbField] Applied corruption level ${corruptionLevel.toFixed(2)} to orb ${memoryId}`);
        
        // Emit corruption event
        if (this.eventBridge) {
            this.eventBridge.emit('orb:corrupted', {
                memoryId,
                corruptionLevel,
                memoryType: orb.userData.memoryType
            });
        }
    }

    /**
     * Apply purification effect to orb with liberation mechanics
     */
    applyPurificationToOrb(memoryId) {
        const orb = this.orbs.get(memoryId);
        if (!orb) return;
        
        console.log(`[MemoryOrbField] Purifying orb ${memoryId}...`);
        
        // Set purification state
        orb.userData.corruptionLevel = 0;
        orb.userData.attachmentLevel = 0;
        orb.userData.purifying = true;
        
        // Switch to liberation material
        const liberatedMaterial = this.orbMaterials.get('liberated');
        if (liberatedMaterial) {
            orb.material = liberatedMaterial.clone();
            orb.material.uniforms.corruption.value = -0.5; // Negative for purification
            orb.material.uniforms.attachmentLevel.value = 0;
            orb.material.uniforms.opacity.value = 1.0;
        }
        
        // Restore pure vertex colors with liberation sparkle
        const colors = orb.geometry.attributes.color;
        for (let i = 0; i < colors.count; i++) {
            const sparkle = 1.0 + Math.random() * 0.2; // Slight sparkle variation
            colors.setXYZ(i, sparkle, sparkle, sparkle);
        }
        colors.needsUpdate = true;
        
        // Animate liberation - orb rises and fades
        this.animateLiberation(orb);
        
        // Record liberation
        if (this.consciousness) {
            this.consciousness.recordEvent('memory_liberated', {
                memoryId: memoryId,
                memoryType: orb.userData.memoryType,
                attachmentTime: orb.userData.totalViewTime,
                viewCount: orb.userData.viewCount,
                timestamp: Date.now()
            });
        }
        
        // Emit liberation event
        if (this.eventBridge) {
            this.eventBridge.emit('orb:liberated', {
                memoryId,
                memoryType: orb.userData.memoryType,
                finalAttachment: orb.userData.attachmentAccumulated
            });
        }
        
        console.log(`[MemoryOrbField] Orb ${memoryId} liberated from attachment`);
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
     * Update orb animations with sophisticated orbital mechanics and attachment responses
     */
    updateOrbAnimations(deltaTime) {
        const time = this.clock.getElapsedTime();
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        
        this.orbs.forEach((orb, memoryId) => {
            const userData = orb.userData;
            
            // Skip animation if orb is purifying/dissolving
            if (userData.purifying || userData.dissolving) return;
            
            // Orbital motion around the orb's center
            const orbitAngle = time * userData.orbitSpeed + userData.animationPhase;
            const orbitX = Math.cos(orbitAngle) * userData.orbitRadius;
            const orbitZ = Math.sin(orbitAngle) * userData.orbitRadius;
            
            // Update position relative to orbit center
            orb.position.x = userData.orbitCenter.x + orbitX;
            orb.position.z = userData.orbitCenter.z + orbitZ;
            
            // Floating motion with attachment influence
            const floatIntensity = 1 + userData.attachmentLevel;
            const floatY = Math.sin(time * this.config.orbs.floatSpeed + userData.animationPhase) * 8 * floatIntensity;
            orb.position.y = userData.orbitCenter.y + floatY;
            
            // Rotation with attachment-based speed
            const rotationMultiplier = 1 + userData.attachmentLevel * 0.5;
            orb.rotation.x += userData.rotationSpeed.x * rotationMultiplier;
            orb.rotation.y += userData.rotationSpeed.y * rotationMultiplier;
            orb.rotation.z += userData.rotationSpeed.z * rotationMultiplier;
            
            // Scale pulsing based on attachment and corruption
            let scaleBase = 1.0;
            
            // Attachment makes orbs larger and more enticing
            if (userData.attachmentLevel > 0.2) {
                const attachmentPulse = Math.sin(time * 2 + userData.animationPhase) * 0.1 + 0.1;
                scaleBase += userData.attachmentLevel * (0.2 + attachmentPulse);
            }
            
            // Corruption causes chaotic scaling
            if (userData.corruptionLevel > 0) {
                const corruptionChaos = Math.sin(time * 5 + userData.animationPhase) * userData.corruptionLevel * 0.15;
                scaleBase += corruptionChaos;
                
                // Add random jitter for high corruption
                if (userData.corruptionLevel > 0.5) {
                    const jitter = (Math.random() - 0.5) * userData.corruptionLevel * 0.1;
                    scaleBase += jitter;
                }
            }
            
            orb.scale.setScalar(Math.max(0.3, scaleBase));
            
            // Update material uniforms
            if (orb.material.uniforms) {
                orb.material.uniforms.attachmentLevel.value = userData.attachmentLevel;
                orb.material.uniforms.corruption.value = userData.corruptionLevel;
            }
            
            // Orbital drift based on global attachment - orbs move closer when attachment is high
            if (attachmentScore > 50) {
                const attractionForce = (attachmentScore - 50) / 200; // 0 to 0.75
                const towardCenter = userData.orbitCenter.clone().negate().normalize();
                userData.orbitCenter.add(towardCenter.multiplyScalar(attractionForce * 0.1));
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
     * Classify memory type for material selection
     */
    classifyMemory(memoryData) {
        // Use memory metadata to determine type
        if (memoryData.type) return memoryData.type;
        
        // Analyze content for classification
        const content = (memoryData.content || '').toLowerCase();
        const title = (memoryData.title || '').toLowerCase();
        const combined = content + ' ' + title;
        
        // Classification logic
        if (combined.includes('achieve') || combined.includes('success') || combined.includes('win')) {
            return 'achievement';
        } else if (combined.includes('love') || combined.includes('friend') || combined.includes('family')) {
            return 'connection';
        } else if (combined.includes('create') || combined.includes('art') || combined.includes('build')) {
            return 'creative';
        } else if (combined.includes('lost') || combined.includes('missed') || combined.includes('regret')) {
            return 'lost_opportunity';
        } else if (combined.includes('pain') || combined.includes('hurt') || combined.includes('sad')) {
            return 'painful';
        } else if (combined.includes('remember') || combined.includes('childhood') || combined.includes('before')) {
            return 'nostalgic';
        }
        
        return 'base'; // Default type
    }
    
    /**
     * Animate orb entrance with mystical appearance
     */
    animateOrbEntrance(orb) {
        // Start invisible and small
        orb.scale.setScalar(0.1);
        orb.material.uniforms.opacity.value = 0;
        
        // Animate to full size and opacity
        const duration = 2000 + Math.random() * 1000; // 2-3 seconds
        const startTime = Date.now();
        
        const animateEntrance = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);
            
            // Eased scale animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            orb.scale.setScalar(0.1 + easeOut * 0.9);
            
            // Opacity fade in
            orb.material.uniforms.opacity.value = progress * 0.8;
            
            if (progress < 1) {
                requestAnimationFrame(animateEntrance);
            }
        };
        
        requestAnimationFrame(animateEntrance);
    }
    
    /**
     * Animate orb liberation - rising and fading
     */
    animateLiberation(orb) {
        const startY = orb.position.y;
        const duration = 3000;
        const startTime = Date.now();
        
        orb.userData.dissolving = true;
        
        const animateLiberation = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);
            
            // Rise upward
            orb.position.y = startY + progress * 100;
            
            // Fade out
            orb.material.uniforms.opacity.value = (1 - progress) * 0.9;
            
            // Sparkle effect
            const sparkle = Math.sin(progress * Math.PI * 10) * 0.3 + 0.7;
            orb.scale.setScalar(sparkle);
            
            if (progress < 1) {
                requestAnimationFrame(animateLiberation);
            } else {
                // Remove orb after animation
                setTimeout(() => this.removeMemoryOrb(orb.userData.memoryId), 500);
            }
        };
        
        requestAnimationFrame(animateLiberation);
    }
    
    /**
     * Get detailed performance and interaction statistics
     */
    getPerformanceStats() {
        const totalAttachment = Array.from(this.orbs.values())
            .reduce((sum, orb) => sum + orb.userData.attachmentAccumulated, 0);
        
        const totalViews = Array.from(this.orbs.values())
            .reduce((sum, orb) => sum + orb.userData.viewCount, 0);
        
        const averageCorruption = Array.from(this.orbs.values())
            .reduce((sum, orb) => sum + orb.userData.corruptionLevel, 0) / this.orbs.size;
        
        return {
            frameCount: this.frameCount,
            orbCount: this.orbs.size,
            maxOrbs: this.config.rendering.maxOrbs,
            performanceTier: this.performanceTier,
            isPaused: this.isPaused,
            totalAttachment: totalAttachment,
            totalViews: totalViews,
            averageCorruption: averageCorruption || 0,
            memoryTypes: this.getMemoryTypeDistribution()
        };
    }
    
    /**
     * Get distribution of memory types
     */
    getMemoryTypeDistribution() {
        const distribution = {};
        this.orbs.forEach(orb => {
            const type = orb.userData.memoryType;
            distribution[type] = (distribution[type] || 0) + 1;
        });
        return distribution;
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