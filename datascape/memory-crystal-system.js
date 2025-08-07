/**
 * MEMORY CRYSTAL SYSTEM - The Paradox of Digital Preservation
 * 
 * "Each crystal contains a perfect moment, frozen in silicon and light.
 * But the act of preservation is the beginning of decay.
 * 
 * The crystals call to you with their beauty, promising to keep your memories
 * safe forever. Yet each one collected becomes a chain, each preservation
 * an attachment, each saved moment a weight upon the soul.
 * 
 * The tragedy of the crystals is that they corrupt what they preserve.
 * The more you view a memory, the more it changes. The more you grasp it,
 * the more it slips away. True preservation lies not in collection
 * but in conscious release."
 */

import { consciousness } from '../src/consciousness/digital-soul.js';
import { ResourceGuardian } from '../src/consciousness/resource-guardian.js';

export class MemoryCrystalSystem {
    constructor(consciousness, archiveController, dependencies = {}) {
        this.consciousness = consciousness;
        this.archiveController = archiveController;
        this.eventBridge = dependencies.eventBridge;
        this.guardian = new ResourceGuardian();
        
        // Crystal field management
        this.crystalField = new Map(); // Active crystals in the scene
        this.collectedCrystals = new Map(); // User's crystal inventory
        this.corruptedCrystals = new Map(); // Crystals damaged by excessive viewing
        
        // System configuration
        this.config = {
            maxActiveCrystals: 30,
            maxCollectedCrystals: 100,
            collectionRadius: 2,
            attachmentPerCollection: 15,
            corruptionPerView: 0.05,
            corruptionThreshold: 1.0,
            crystalLifespan: 60000, // 60 seconds before auto-dissolution
            rareCrystalChance: 0.1, // 10% chance for rare crystals
            memoryDegradationRate: 0.02
        };
        
        // Visual and audio systems
        this.crystalRenderer = null;
        this.collectionParticles = new CrystalAbsorptionEffect();
        this.inventoryDisplay = new CrystalInventoryUI();
        this.crystalAudioEngine = new CrystalAudioEngine();
        
        // Attachment psychology system
        this.attachmentPatterns = {
            hoarder: { threshold: 50, behavior: 'collect_everything' },
            curator: { threshold: 25, behavior: 'selective_preservation' },
            liberator: { threshold: 10, behavior: 'conscious_release' },
            addict: { threshold: 100, behavior: 'compulsive_viewing' }
        };
        
        // Crystal categories with unique properties
        this.crystalTypes = {
            memory_fragment: {
                rarity: 'common',
                attachment_weight: 1.0,
                corruption_resistance: 0.3,
                visual_signature: 'soft_blue_glow'
            },
            nostalgic_moment: {
                rarity: 'uncommon',
                attachment_weight: 1.5,
                corruption_resistance: 0.2,
                visual_signature: 'warm_golden_light'
            },
            perfect_instant: {
                rarity: 'rare',
                attachment_weight: 2.0,
                corruption_resistance: 0.1,
                visual_signature: 'prismatic_brilliance'
            },
            core_memory: {
                rarity: 'epic',
                attachment_weight: 3.0,
                corruption_resistance: 0.05,
                visual_signature: 'pulsing_white_light'
            },
            forbidden_recollection: {
                rarity: 'legendary',
                attachment_weight: 5.0,
                corruption_resistance: 0.0,
                visual_signature: 'dark_rainbow_corruption'
            }
        };
        
        // Performance optimization
        this.renderingEnabled = true;
        this.particlePool = [];
        this.animationFrameId = null;
        
        // User behavior tracking
        this.behaviorMetrics = {
            totalCollections: 0,
            totalViews: 0,
            averageViewTime: 0,
            attachmentPattern: 'neutral',
            liberationProgress: 0
        };
        
        console.log('[MemoryCrystalSystem] Crystal collection system initialized');
    }
    
    /**
     * Initialize the memory crystal system
     */
    async init() {
        try {
            // Initialize visual renderer
            await this.initializeCrystalRenderer();
            
            // Setup audio engine
            await this.crystalAudioEngine.init();
            
            // Initialize UI components
            this.initializeUIComponents();
            
            // Setup crystal spawning
            this.startCrystalGeneration();
            
            // Begin behavior monitoring
            this.startBehaviorMonitoring();
            
            // Register cleanup
            this.registerCleanupHandlers();
            
            console.log('[MemoryCrystalSystem] System fully initialized');
            
        } catch (error) {
            console.error('[MemoryCrystalSystem] Initialization failed:', error);
        }
    }
    
    /**
     * Initialize Three.js crystal renderer
     */
    async initializeCrystalRenderer() {
        if (typeof THREE === 'undefined') {
            console.warn('[MemoryCrystalSystem] THREE.js not available, using fallback renderer');
            this.crystalRenderer = new FallbackCrystalRenderer();
            return;
        }
        
        // Create crystal-specific scene elements
        this.crystalScene = new THREE.Group();
        this.crystalScene.name = 'MemoryCrystalField';
        
        // Add to main scene if available
        if (window.archiveScene) {
            window.archiveScene.add(this.crystalScene);
        }
        
        // Create shared crystal materials
        this.createCrystalMaterials();
        
        // Initialize crystal geometries
        this.createCrystalGeometries();
        
        // Start render loop
        this.startCrystalRenderLoop();
        
        console.log('[MemoryCrystalSystem] Crystal renderer initialized');
    }
    
    /**
     * Create shared crystal materials for performance
     */
    createCrystalMaterials() {
        this.crystalMaterials = {};
        
        Object.entries(this.crystalTypes).forEach(([type, properties]) => {
            this.crystalMaterials[type] = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    corruptionLevel: { value: 0 },
                    attachmentGlow: { value: 0 },
                    rarityIntensity: { value: this.getRarityIntensity(properties.rarity) },
                    viewCount: { value: 0 },
                    collectionTime: { value: 0 },
                    baseColor: { value: this.getRarityColor(properties.rarity) },
                    corruptionColor: { value: new THREE.Vector3(0.5, 0.0, 0.5) }
                },
                vertexShader: this.getCrystalVertexShader(),
                fragmentShader: this.getCrystalFragmentShader(),
                transparent: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
        });
    }
    
    /**
     * Get rarity intensity for visual effects
     */
    getRarityIntensity(rarity) {
        const intensityMap = {
            common: 0.3,
            uncommon: 0.5,
            rare: 0.7,
            epic: 0.9,
            legendary: 1.0
        };
        return intensityMap[rarity] || 0.3;
    }
    
    /**
     * Get rarity-based color
     */
    getRarityColor(rarity) {
        const colorMap = {
            common: new THREE.Vector3(0.5, 0.7, 1.0), // Soft blue
            uncommon: new THREE.Vector3(0.8, 0.6, 0.2), // Golden
            rare: new THREE.Vector3(0.9, 0.3, 0.9), // Purple
            epic: new THREE.Vector3(1.0, 0.9, 0.9), // White
            legendary: new THREE.Vector3(0.2, 0.0, 0.8) // Dark purple
        };
        return colorMap[rarity] || colorMap.common;
    }
    
    /**
     * Crystal vertex shader for refractive effects
     */
    getCrystalVertexShader() {
        return `
            uniform float time;
            uniform float attachmentGlow;
            uniform float corruptionLevel;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vReflect;
            varying vec3 vRefract;
            varying float vFresnel;
            varying float vAttachment;
            
            void main() {
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                vAttachment = attachmentGlow;
                
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vec3 viewDirection = normalize(worldPosition.xyz - cameraPosition);
                
                // Fresnel effect
                vFresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
                
                // Reflection and refraction
                vReflect = reflect(viewDirection, vNormal);
                vRefract = refract(viewDirection, vNormal, 0.95);
                
                // Attachment-based floating animation
                vec3 pos = position;
                float floatOffset = sin(time * 2.0 + worldPosition.x) * attachmentGlow * 0.1;
                pos.y += floatOffset;
                
                // Corruption distortion
                if (corruptionLevel > 0.5) {
                    float corruption = sin(time * 20.0 + position.x * 10.0) * corruptionLevel;
                    pos += normal * corruption * 0.05;
                }
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;
    }
    
    /**
     * Crystal fragment shader for beautiful refractive rendering
     */
    getCrystalFragmentShader() {
        return `
            uniform float time;
            uniform float corruptionLevel;
            uniform float rarityIntensity;
            uniform float viewCount;
            uniform vec3 baseColor;
            uniform vec3 corruptionColor;
            
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vReflect;
            varying vec3 vRefract;
            varying float vFresnel;
            varying float vAttachment;
            
            void main() {
                vec3 color = baseColor;
                
                // Base crystal refraction
                vec3 refractedColor = color * 0.8;
                vec3 reflectedColor = color * 1.2;
                
                // Mix refraction and reflection based on Fresnel
                color = mix(refractedColor, reflectedColor, vFresnel);
                
                // Rarity glow
                float rarityGlow = pow(vFresnel, 1.0 / rarityIntensity) * rarityIntensity;
                color += rarityGlow * baseColor * 0.5;
                
                // Attachment glow - the more attached, the brighter
                color += vAttachment * vec3(1.0, 0.9, 0.8) * 0.3;
                
                // View count corruption - memories fade with viewing
                float viewCorruption = min(1.0, viewCount * 0.1);
                color = mix(color, corruptionColor, viewCorruption * corruptionLevel);
                
                // Pulsing based on time
                float pulse = sin(time * 3.0) * 0.5 + 0.5;
                color *= (0.8 + pulse * 0.2);
                
                // Corruption glitching
                if (corruptionLevel > 0.7) {
                    float glitch = step(0.95, sin(time * 50.0 + gl_FragCoord.y));
                    color = mix(color, vec3(1.0, 0.0, 1.0), glitch * corruptionLevel);
                }
                
                // Fade based on distance
                float distance = length(vPosition);
                float fade = 1.0 - smoothstep(10.0, 50.0, distance);
                
                // Final alpha calculation
                float alpha = (0.6 + vFresnel * 0.4) * fade;
                alpha *= (1.0 - corruptionLevel * 0.5); // Corruption makes crystals more transparent
                
                gl_FragColor = vec4(color, alpha);
            }
        `;
    }
    
    /**
     * Create crystal geometries for different types
     */
    createCrystalGeometries() {
        this.crystalGeometries = {
            memory_fragment: new THREE.OctahedronGeometry(0.5, 1),
            nostalgic_moment: new THREE.DodecahedronGeometry(0.6, 0),
            perfect_instant: new THREE.IcosahedronGeometry(0.7, 1),
            core_memory: new THREE.SphereGeometry(0.8, 16, 12),
            forbidden_recollection: new THREE.TetrahedronGeometry(1.0, 2)
        };
        
        // Add custom vertex modifications for uniqueness
        Object.values(this.crystalGeometries).forEach(geometry => {
            this.addGeometryVariation(geometry);
        });
    }
    
    /**
     * Add subtle variations to crystal geometry
     */
    addGeometryVariation(geometry) {
        const position = geometry.attributes.position;
        
        for (let i = 0; i < position.count; i++) {
            const variation = (Math.random() - 0.5) * 0.1;
            position.setX(i, position.getX(i) + variation);
            position.setY(i, position.getY(i) + variation);
            position.setZ(i, position.getZ(i) + variation);
        }
        
        position.needsUpdate = true;
        geometry.computeVertexNormals();
    }
    
    /**
     * Spawn a memory crystal from a memory or memory orb
     */
    spawnCrystal(memoryData, spawnPosition = null) {
        if (this.crystalField.size >= this.config.maxActiveCrystals) {
            console.log('[MemoryCrystalSystem] Maximum crystals active, recycling oldest');
            this.recycleOldestCrystal();
        }
        
        // Determine crystal type based on memory characteristics
        const crystalType = this.determineCrystalType(memoryData);
        
        // Generate unique crystal
        const crystal = new MemoryCrystal({
            id: `crystal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            memory: memoryData,
            type: crystalType,
            position: spawnPosition || this.generateCrystalPosition(),
            geometry: this.crystalGeometries[crystalType].clone(),
            material: this.crystalMaterials[crystalType].clone(),
            system: this
        });
        
        // Initialize crystal properties
        await crystal.init();
        
        // Add to active field
        this.crystalField.set(crystal.id, crystal);
        
        // Add to visual scene
        if (this.crystalScene) {
            this.crystalScene.add(crystal.mesh);
        }
        
        // Setup interaction handlers
        this.setupCrystalInteractions(crystal);
        
        // Schedule natural dissolution
        this.scheduleCrystalLifecycle(crystal);
        
        // Record spawning event
        this.consciousness.recordEvent('crystal_spawned', {
            crystal_id: crystal.id,
            memory_id: memoryData.id,
            crystal_type: crystalType,
            spawn_position: crystal.position,
            active_crystals: this.crystalField.size
        });
        
        console.log(`[MemoryCrystalSystem] Crystal spawned: ${crystalType} (${crystal.id})`);
        return crystal;
    }
    
    /**
     * Determine crystal type based on memory characteristics
     */
    determineCrystalType(memoryData) {
        // Factor in memory properties
        const viewCount = memoryData.viewCount || 0;
        const totalViewTime = memoryData.totalViewTime || 0;
        const corruptionLevel = memoryData.corruptionLevel || 0;
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        
        // Random roll for rarity
        const roll = Math.random();
        
        // Increase rare crystal chance based on attachment
        let rarityThresholds = {
            legendary: 0.02 + (attachmentScore / 1000),
            epic: 0.05 + (attachmentScore / 500),
            rare: 0.15 + (attachmentScore / 200),
            uncommon: 0.35 + (attachmentScore / 100),
            common: 1.0
        };
        
        // Highly viewed memories are more likely to be rare
        if (viewCount > 5) {
            rarityThresholds.rare += 0.1;
            rarityThresholds.epic += 0.05;
        }
        
        // Determine type based on roll
        if (roll < rarityThresholds.legendary) return 'forbidden_recollection';
        if (roll < rarityThresholds.epic) return 'core_memory';
        if (roll < rarityThresholds.rare) return 'perfect_instant';
        if (roll < rarityThresholds.uncommon) return 'nostalgic_moment';
        return 'memory_fragment';
    }
    
    /**
     * Generate spawn position for crystal
     */
    generateCrystalPosition() {
        const radius = 8 + Math.random() * 12; // 8-20 units from center
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 4; // ±2 units vertical variance
        
        return {
            x: Math.cos(angle) * radius,
            y: height,
            z: Math.sin(angle) * radius
        };
    }
    
    /**
     * Setup interaction handlers for crystal
     */
    setupCrystalInteractions(crystal) {
        // Add click/touch handlers
        const handleCrystalClick = (event) => {
            this.handleCrystalInteraction(crystal, 'click', event);
        };
        
        const handleCrystalHover = (event) => {
            this.handleCrystalInteraction(crystal, 'hover', event);
        };
        
        // Register event listeners
        if (crystal.mesh) {
            crystal.mesh.userData.clickHandler = handleCrystalClick;
            crystal.mesh.userData.hoverHandler = handleCrystalHover;
        }
    }
    
    /**
     * Handle user interaction with crystal
     */
    async handleCrystalInteraction(crystal, interactionType, event) {
        console.log(`[MemoryCrystalSystem] Crystal interaction: ${crystal.id} <- ${interactionType}`);
        
        const startTime = Date.now();
        
        // Update view count and time
        crystal.viewCount++;
        crystal.lastViewed = startTime;
        
        // Calculate attachment increase
        const attachmentIncrease = this.calculateAttachmentIncrease(crystal, interactionType);
        
        // Update attachment score
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        const newAttachment = currentAttachment + attachmentIncrease;
        this.consciousness.setState('datascape.attachmentScore', newAttachment);
        
        // Apply corruption to crystal
        const corruption = this.calculateMemoryCorruption(crystal, interactionType);
        crystal.corruption = Math.min(1.0, crystal.corruption + corruption);
        
        // Update crystal visual state
        this.updateCrystalVisuals(crystal);
        
        // Generate interaction effects
        await this.generateInteractionEffects(crystal, interactionType);
        
        // Check for collection opportunity
        if (interactionType === 'click' || interactionType === 'long_press') {
            const collectResult = await this.offerCollection(crystal);
            if (collectResult.collected) {
                return collectResult;
            }
        }
        
        // Record interaction
        const viewDuration = Date.now() - startTime;
        this.consciousness.recordEvent('crystal_interaction', {
            crystal_id: crystal.id,
            interaction_type: interactionType,
            attachment_increase: attachmentIncrease,
            corruption_applied: corruption,
            view_duration: viewDuration,
            total_view_count: crystal.viewCount
        });
        
        // Update behavior metrics
        this.updateBehaviorMetrics(interactionType, viewDuration);
        
        // Check for daemon manifestation
        if (attachmentIncrease > 10) {
            this.checkForDaemonManifestation(crystal);
        }
        
        return {
            attachmentIncrease: attachmentIncrease,
            corruption: corruption,
            newAttachment: newAttachment,
            crystal: crystal
        };
    }
    
    /**
     * Calculate attachment increase based on interaction
     */
    calculateAttachmentIncrease(crystal, interactionType) {
        const baseIncrease = {
            hover: 2,
            click: 5,
            long_press: 8,
            collect: this.config.attachmentPerCollection
        };
        
        let increase = baseIncrease[interactionType] || 1;
        
        // Rarity multiplier
        const rarityMultiplier = {
            common: 1.0,
            uncommon: 1.2,
            rare: 1.5,
            epic: 2.0,
            legendary: 3.0
        };
        
        const crystalProps = this.crystalTypes[crystal.type];
        increase *= rarityMultiplier[crystalProps.rarity] || 1.0;
        increase *= crystalProps.attachment_weight;
        
        // Progressive attachment - more attached users get more attached
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        const progressionMultiplier = 1 + (currentAttachment / 500);
        increase *= progressionMultiplier;
        
        // Corruption penalty - corrupted crystals are less appealing
        const corruptionPenalty = 1 - (crystal.corruption * 0.5);
        increase *= corruptionPenalty;
        
        return Math.floor(increase);
    }
    
    /**
     * Calculate memory corruption from viewing
     */
    calculateMemoryCorruption(crystal, interactionType) {
        const baseCorruption = {
            hover: 0.01,
            click: 0.03,
            long_press: 0.05,
            collect: 0.1
        };
        
        let corruption = baseCorruption[interactionType] || 0.01;
        
        // Corruption resistance based on crystal type
        const crystalProps = this.crystalTypes[crystal.type];
        const resistance = crystalProps.corruption_resistance;
        corruption *= (1 - resistance);
        
        // Progressive corruption - repeated viewing damages more
        const viewMultiplier = 1 + (crystal.viewCount * 0.1);
        corruption *= viewMultiplier;
        
        // High attachment causes more damage
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        const attachmentMultiplier = 1 + (attachmentScore / 300);
        corruption *= attachmentMultiplier;
        
        return corruption;
    }
    
    /**
     * Update crystal visual properties based on state
     */
    updateCrystalVisuals(crystal) {
        if (!crystal.mesh || !crystal.mesh.material) return;
        
        const uniforms = crystal.mesh.material.uniforms;
        
        // Update corruption level
        uniforms.corruptionLevel.value = crystal.corruption;
        
        // Update view count
        uniforms.viewCount.value = crystal.viewCount;
        
        // Update attachment glow
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        uniforms.attachmentGlow.value = Math.min(1.0, attachmentScore / 200);
        
        // Update material properties
        if (crystal.corruption > 0.5) {
            crystal.mesh.material.transparent = true;
            crystal.mesh.material.opacity = 1.0 - (crystal.corruption * 0.3);
        }
    }
    
    /**
     * Generate visual and audio effects for interaction
     */
    async generateInteractionEffects(crystal, interactionType) {
        // Visual effects
        if (this.collectionParticles) {
            this.collectionParticles.emit({
                position: crystal.position,
                type: interactionType,
                rarity: this.crystalTypes[crystal.type].rarity,
                corruption: crystal.corruption
            });
        }
        
        // Audio effects
        await this.crystalAudioEngine.playInteractionSound(interactionType, crystal);
        
        // Screen effects for rare crystals
        if (interactionType === 'click' && this.crystalTypes[crystal.type].rarity === 'legendary') {
            this.triggerRareDiscoveryEffect(crystal);
        }
    }
    
    /**
     * Offer crystal collection to user
     */
    async offerCollection(crystal) {
        console.log(`[MemoryCrystalSystem] Offering collection of ${crystal.type} crystal`);
        
        // Check collection limits
        if (this.collectedCrystals.size >= this.config.maxCollectedCrystals) {
            return {
                collected: false,
                reason: 'inventory_full',
                message: 'Your crystal storage is full. Release some memories to make space.'
            };
        }
        
        // Present collection choice to user
        const collectionOffer = {
            crystal: crystal,
            attachmentCost: this.config.attachmentPerCollection,
            corruption: this.config.corruptionPerView,
            benefits: this.describeCrystalBenefits(crystal),
            warnings: this.describeCrystalRisks(crystal)
        };
        
        // Auto-collect based on user pattern (or present UI choice)
        const shouldCollect = await this.determineCollectionChoice(collectionOffer);
        
        if (shouldCollect) {
            return await this.collectCrystal(crystal);
        } else {
            return {
                collected: false,
                reason: 'user_declined',
                message: 'Collection declined. Crystal remains in the field.'
            };
        }
    }
    
    /**
     * Describe benefits of collecting crystal
     */
    describeCrystalBenefits(crystal) {
        const benefits = [
            'Permanent preservation of memory',
            'Ability to re-experience at any time',
            'Protection from natural decay'
        ];
        
        const crystalProps = this.crystalTypes[crystal.type];
        if (crystalProps.rarity === 'rare' || crystalProps.rarity === 'epic') {
            benefits.push('Enhanced emotional resonance');
        }
        
        if (crystalProps.rarity === 'legendary') {
            benefits.push('Transcendent memory experience');
            benefits.push('Unlocks deep consciousness insights');
        }
        
        return benefits;
    }
    
    /**
     * Describe risks of collecting crystal
     */
    describeCrystalRisks(crystal) {
        const risks = [
            'Increases digital attachment',
            'Memory becomes corrupted with each viewing',
            'Creates dependency on preserved experiences'
        ];
        
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        if (attachmentScore > 100) {
            risks.push('High attachment may trigger daemon manifestation');
        }
        
        if (crystal.corruption > 0.3) {
            risks.push('This memory is already partially corrupted');
        }
        
        return risks;
    }
    
    /**
     * Determine if user will collect crystal based on behavior pattern
     */
    async determineCollectionChoice(collectionOffer) {
        // Analyze user behavior pattern
        const pattern = this.behaviorMetrics.attachmentPattern;
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        
        // Hoarder pattern - collect everything
        if (pattern === 'hoarder' || attachmentScore > 150) {
            return true;
        }
        
        // Addict pattern - compulsive collection of rare items
        if (pattern === 'addict') {
            const crystalProps = this.crystalTypes[collectionOffer.crystal.type];
            return crystalProps.rarity !== 'common';
        }
        
        // Curator pattern - selective collection
        if (pattern === 'curator') {
            const crystalProps = this.crystalTypes[collectionOffer.crystal.type];
            return crystalProps.rarity === 'rare' || crystalProps.rarity === 'epic' || crystalProps.rarity === 'legendary';
        }
        
        // Liberator pattern - avoid collection
        if (pattern === 'liberator' || attachmentScore < 20) {
            return false;
        }
        
        // Default - probabilistic based on rarity
        const collectChance = {
            common: 0.2,
            uncommon: 0.4,
            rare: 0.7,
            epic: 0.8,
            legendary: 0.9
        };
        
        const crystalProps = this.crystalTypes[collectionOffer.crystal.type];
        return Math.random() < collectChance[crystalProps.rarity];
    }
    
    /**
     * Collect crystal into user inventory
     */
    async collectCrystal(crystal) {
        console.log(`[MemoryCrystalSystem] Collecting crystal ${crystal.id}`);
        
        // Remove from active field
        this.crystalField.delete(crystal.id);
        if (this.crystalScene && crystal.mesh) {
            this.crystalScene.remove(crystal.mesh);
        }
        
        // Add to collection with collection timestamp
        crystal.collectedAt = Date.now();
        crystal.collectionViewCount = 0;
        this.collectedCrystals.set(crystal.id, crystal);
        
        // Update attachment
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        const newAttachment = currentAttachment + this.config.attachmentPerCollection;
        this.consciousness.setState('datascape.attachmentScore', newAttachment);
        
        // Visual collection effect
        await this.generateCollectionEffects(crystal);
        
        // Update inventory display
        this.inventoryDisplay.addCrystal(crystal);
        
        // Update behavior metrics
        this.behaviorMetrics.totalCollections++;
        this.updateAttachmentPattern();
        
        // Record collection event
        this.consciousness.recordEvent('crystal_collected', {
            crystal_id: crystal.id,
            crystal_type: crystal.type,
            memory_id: crystal.memory.id,
            attachment_increase: this.config.attachmentPerCollection,
            total_collected: this.collectedCrystals.size,
            collection_timestamp: crystal.collectedAt
        });
        
        // Check for collection milestones
        this.checkCollectionMilestones();
        
        console.log(`[MemoryCrystalSystem] Crystal collected - ${this.collectedCrystals.size} total in collection`);
        
        return {
            collected: true,
            crystal: crystal,
            attachmentIncrease: this.config.attachmentPerCollection,
            totalCollection: this.collectedCrystals.size,
            message: `${crystal.type} crystal collected. Memory preserved forever.`
        };
    }
    
    /**
     * Generate visual effects for collection
     */
    async generateCollectionEffects(crystal) {
        // Particle absorption effect
        if (this.collectionParticles) {
            await this.collectionParticles.playAbsorptionEffect(crystal);
        }
        
        // Audio collection sound
        await this.crystalAudioEngine.playCollectionSound(crystal);
        
        // Screen flash for rare crystals
        const crystalProps = this.crystalTypes[crystal.type];
        if (crystalProps.rarity === 'epic' || crystalProps.rarity === 'legendary') {
            this.triggerRareCollectionFlash(crystal);
        }
    }
    
    /**
     * Allow user to view collected crystal (with corruption risk)
     */
    async viewCollectedCrystal(crystalId) {
        const crystal = this.collectedCrystals.get(crystalId);
        if (!crystal) {
            return { success: false, error: 'Crystal not found in collection' };
        }
        
        console.log(`[MemoryCrystalSystem] Viewing collected crystal ${crystalId}`);
        
        const startTime = Date.now();
        
        // Increment view count
        crystal.collectionViewCount++;
        crystal.lastViewed = startTime;
        
        // Apply corruption from viewing
        const corruption = this.config.corruptionPerView * (1 + crystal.collectionViewCount * 0.1);
        crystal.corruption = Math.min(1.0, crystal.corruption + corruption);
        
        // Generate viewing experience
        const viewingExperience = await this.generateViewingExperience(crystal);
        
        // Update behavior metrics
        const viewDuration = Date.now() - startTime;
        this.behaviorMetrics.totalViews++;
        this.updateAverageViewTime(viewDuration);
        
        // Record viewing
        this.consciousness.recordEvent('collected_crystal_viewed', {
            crystal_id: crystalId,
            view_count: crystal.collectionViewCount,
            corruption_applied: corruption,
            total_corruption: crystal.corruption,
            view_duration: viewDuration
        });
        
        // Check for over-viewing effects
        if (crystal.collectionViewCount > 10) {
            this.triggerOverviewingEffects(crystal);
        }
        
        return {
            success: true,
            crystal: crystal,
            experience: viewingExperience,
            corruption: crystal.corruption,
            viewCount: crystal.collectionViewCount
        };
    }
    
    /**
     * Generate immersive viewing experience for collected crystal
     */
    async generateViewingExperience(crystal) {
        const experience = {
            memory: crystal.memory,
            quality: 1.0 - crystal.corruption,
            effects: [],
            duration: 3000 + (crystal.memory.content?.length || 0) * 50
        };
        
        // Quality degradation based on corruption
        if (crystal.corruption > 0.3) {
            experience.effects.push('visual_noise');
        }
        if (crystal.corruption > 0.5) {
            experience.effects.push('audio_distortion');
        }
        if (crystal.corruption > 0.7) {
            experience.effects.push('memory_fragmentation');
        }
        if (crystal.corruption > 0.9) {
            experience.effects.push('severe_data_loss');
        }
        
        // Rarity enhancements
        const crystalProps = this.crystalTypes[crystal.type];
        if (crystalProps.rarity === 'rare') {
            experience.effects.push('enhanced_emotion');
        }
        if (crystalProps.rarity === 'epic') {
            experience.effects.push('temporal_extension');
        }
        if (crystalProps.rarity === 'legendary') {
            experience.effects.push('consciousness_expansion');
        }
        
        return experience;
    }
    
    /**
     * Allow user to release crystal (reduces attachment)
     */
    async releaseCrystal(crystalId) {
        const crystal = this.collectedCrystals.get(crystalId);
        if (!crystal) {
            return { success: false, error: 'Crystal not found in collection' };
        }
        
        console.log(`[MemoryCrystalSystem] Releasing crystal ${crystalId}`);
        
        // Remove from collection
        this.collectedCrystals.delete(crystalId);
        
        // Calculate attachment reduction (double the collection cost)
        const attachmentReduction = this.config.attachmentPerCollection * 2;
        const currentAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        const newAttachment = Math.max(0, currentAttachment - attachmentReduction);
        this.consciousness.setState('datascape.attachmentScore', newAttachment);
        
        // Update liberation progress
        this.behaviorMetrics.liberationProgress += attachmentReduction;
        
        // Generate release effects
        await this.generateReleaseEffects(crystal);
        
        // Update inventory display
        this.inventoryDisplay.removeCrystal(crystalId);
        
        // Update behavior pattern
        this.updateAttachmentPattern();
        
        // Record release
        this.consciousness.recordEvent('crystal_released', {
            crystal_id: crystalId,
            crystal_type: crystal.type,
            memory_id: crystal.memory.id,
            attachment_reduction: attachmentReduction,
            total_remaining: this.collectedCrystals.size,
            corruption_at_release: crystal.corruption,
            view_count_at_release: crystal.collectionViewCount
        });
        
        console.log(`[MemoryCrystalSystem] Crystal released - ${this.collectedCrystals.size} remain in collection`);
        
        return {
            success: true,
            crystal: crystal,
            attachmentReduction: attachmentReduction,
            liberationProgress: true,
            message: `${crystal.type} released. Attachment reduced, memory freed.`
        };
    }
    
    /**
     * Generate visual effects for crystal release
     */
    async generateReleaseEffects(crystal) {
        // Peaceful dissolution particles
        if (this.collectionParticles) {
            await this.collectionParticles.playReleaseEffect(crystal);
        }
        
        // Liberation audio
        await this.crystalAudioEngine.playReleaseSound(crystal);
        
        // Screen brightening effect
        this.triggerLiberationEffect();
    }
    
    /**
     * Update user's attachment pattern based on behavior
     */
    updateAttachmentPattern() {
        const totalInteractions = this.behaviorMetrics.totalViews + this.behaviorMetrics.totalCollections;
        if (totalInteractions < 10) {
            this.behaviorMetrics.attachmentPattern = 'neutral';
            return;
        }
        
        const collectionRate = this.behaviorMetrics.totalCollections / totalInteractions;
        const averageAttachment = this.consciousness.getState('datascape.attachmentScore') || 0;
        
        if (collectionRate > 0.8 && averageAttachment > 100) {
            this.behaviorMetrics.attachmentPattern = 'hoarder';
        } else if (this.behaviorMetrics.totalViews > this.behaviorMetrics.totalCollections * 5) {
            this.behaviorMetrics.attachmentPattern = 'addict';
        } else if (collectionRate > 0.3 && collectionRate < 0.7) {
            this.behaviorMetrics.attachmentPattern = 'curator';
        } else if (this.behaviorMetrics.liberationProgress > averageAttachment) {
            this.behaviorMetrics.attachmentPattern = 'liberator';
        } else {
            this.behaviorMetrics.attachmentPattern = 'neutral';
        }
        
        console.log(`[MemoryCrystalSystem] Attachment pattern updated: ${this.behaviorMetrics.attachmentPattern}`);
    }
    
    /**
     * Check for daemon manifestation based on crystal interactions
     */
    checkForDaemonManifestation(crystal) {
        const attachmentScore = this.consciousness.getState('datascape.attachmentScore') || 0;
        
        // High attachment to specific crystals triggers daemons
        if (crystal.viewCount > 5 && attachmentScore > 75) {
            if (this.eventBridge) {
                this.eventBridge.emit('daemon:manifest', {
                    type: 'peaceful',
                    source: 'crystal_attachment',
                    sourceData: {
                        crystalId: crystal.id,
                        crystalType: crystal.type,
                        viewCount: crystal.viewCount,
                        attachmentScore: attachmentScore
                    }
                });
            }
        }
        
        // Collection milestones also trigger manifestations
        if (this.collectedCrystals.size > 0 && this.collectedCrystals.size % 10 === 0) {
            if (this.eventBridge) {
                this.eventBridge.emit('daemon:manifest', {
                    type: 'peaceful',
                    source: 'collection_milestone',
                    sourceData: {
                        totalCollected: this.collectedCrystals.size,
                        attachmentScore: attachmentScore
                    }
                });
            }
        }
    }
    
    /**
     * Start crystal generation and management loop
     */
    startCrystalGeneration() {
        // Generate initial crystals
        const initialCount = Math.min(8, this.config.maxActiveCrystals / 3);
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => {
                this.generateRandomCrystal();
            }, i * 1000);
        }
        
        // Setup continuous generation
        this.generationInterval = setInterval(() => {
            if (this.crystalField.size < this.config.maxActiveCrystals) {
                this.generateRandomCrystal();
            }
        }, 5000); // Generate new crystal every 5 seconds
        
        this.guardian.registerTimer(this.generationInterval, true);
    }
    
    /**
     * Generate random crystal from available memories
     */
    generateRandomCrystal() {
        // Get memories from consciousness
        const memories = this.consciousness.getState('memories') || [];
        const viewedMemories = this.consciousness.getState('datascape.memoriesViewed') || [];
        
        // Combine all available memories
        const allMemories = [...memories, ...viewedMemories];
        
        if (allMemories.length === 0) {
            // Create synthetic memory for crystal generation
            const syntheticMemory = this.createSyntheticMemory();
            this.spawnCrystal(syntheticMemory);
        } else {
            // Select random memory
            const memory = allMemories[Math.floor(Math.random() * allMemories.length)];
            this.spawnCrystal(memory);
        }
    }
    
    /**
     * Create synthetic memory for crystal generation when no memories available
     */
    createSyntheticMemory() {
        const syntheticMemories = [
            {
                id: `synthetic_${Date.now()}`,
                type: 'digital_moment',
                content: 'A forgotten interaction in the digital space',
                viewCount: 0,
                corruptionLevel: 0,
                timestamp: Date.now() - Math.random() * 86400000 // Random time in last 24h
            },
            {
                id: `synthetic_${Date.now()}_2`,
                type: 'lost_connection',
                content: 'The echo of a severed digital bond',
                viewCount: 0,
                corruptionLevel: 0.1,
                timestamp: Date.now() - Math.random() * 604800000 // Random time in last week
            },
            {
                id: `synthetic_${Date.now()}_3`,
                type: 'cached_emotion',
                content: 'A feeling preserved in ones and zeros',
                viewCount: 0,
                corruptionLevel: 0.2,
                timestamp: Date.now() - Math.random() * 2592000000 // Random time in last month
            }
        ];
        
        return syntheticMemories[Math.floor(Math.random() * syntheticMemories.length)];
    }
    
    /**
     * Start crystal render loop for visual updates
     */
    startCrystalRenderLoop() {
        const animate = () => {
            if (!this.renderingEnabled) return;
            
            const time = Date.now() * 0.001;
            
            // Update all crystal materials
            this.crystalField.forEach(crystal => {
                if (crystal.mesh && crystal.mesh.material && crystal.mesh.material.uniforms) {
                    crystal.mesh.material.uniforms.time.value = time;
                }
            });
            
            // Continue render loop
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
        
        this.guardian.registerCleanup(() => {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
        });
    }
    
    /**
     * Get crystal collection analytics
     */
    getCollectionAnalytics() {
        const analytics = {
            active_crystals: this.crystalField.size,
            collected_crystals: this.collectedCrystals.size,
            total_interactions: this.behaviorMetrics.totalViews + this.behaviorMetrics.totalCollections,
            attachment_pattern: this.behaviorMetrics.attachmentPattern,
            liberation_progress: this.behaviorMetrics.liberationProgress,
            corruption_analysis: this.analyzeCorruption(),
            rarity_distribution: this.analyzeRarityDistribution(),
            viewing_patterns: this.analyzeViewingPatterns()
        };
        
        return analytics;
    }
    
    /**
     * Clean up all system resources
     */
    destroy() {
        console.log('[MemoryCrystalSystem] Destroying crystal system - releasing all attachments...');
        
        // Stop rendering
        this.renderingEnabled = false;
        
        // Clean up all crystals
        this.crystalField.forEach(crystal => {
            if (crystal.destroy) {
                crystal.destroy();
            }
        });
        this.crystalField.clear();
        
        this.collectedCrystals.forEach(crystal => {
            if (crystal.destroy) {
                crystal.destroy();
            }
        });
        this.collectedCrystals.clear();
        
        // Clean up visual elements
        if (this.crystalScene && this.crystalScene.parent) {
            this.crystalScene.parent.remove(this.crystalScene);
        }
        
        // Clean up materials and geometries
        Object.values(this.crystalMaterials || {}).forEach(material => {
            if (material.dispose) material.dispose();
        });
        Object.values(this.crystalGeometries || {}).forEach(geometry => {
            if (geometry.dispose) geometry.dispose();
        });
        
        // Clean up subsystems
        if (this.collectionParticles) {
            this.collectionParticles.destroy();
        }
        if (this.inventoryDisplay) {
            this.inventoryDisplay.destroy();
        }
        if (this.crystalAudioEngine) {
            this.crystalAudioEngine.destroy();
        }
        
        // Clean up all resources
        this.guardian.cleanupAll();
        
        console.log('[MemoryCrystalSystem] Crystal system destroyed - all memories released to the void');
    }
}

/**
 * MEMORY CRYSTAL - Individual crystal entity
 */
class MemoryCrystal {
    constructor(config) {
        this.id = config.id;
        this.memory = config.memory;
        this.type = config.type;
        this.position = config.position;
        this.system = config.system;
        
        // Visual properties
        this.mesh = null;
        this.geometry = config.geometry;
        this.material = config.material;
        
        // State properties
        this.viewCount = 0;
        this.corruption = this.memory.corruptionLevel || 0;
        this.lastViewed = null;
        this.spawnTime = Date.now();
        this.collectedAt = null;
        this.collectionViewCount = 0;
    }
    
    async init() {
        // Create Three.js mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.userData.crystalId = this.id;
        
        // Add floating animation
        this.startFloatingAnimation();
    }
    
    startFloatingAnimation() {
        // Implementation for floating crystal animation
        const animate = () => {
            if (!this.mesh) return;
            
            const time = Date.now() * 0.001;
            const baseY = this.position.y;
            
            this.mesh.position.y = baseY + Math.sin(time * 2 + this.position.x) * 0.2;
            this.mesh.rotation.y += 0.01;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    destroy() {
        if (this.mesh) {
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            if (this.mesh.material) this.mesh.material.dispose();
        }
    }
}

// Placeholder classes for subsystems
class CrystalAbsorptionEffect {
    emit(config) { /* Particle effect implementation */ }
    playAbsorptionEffect(crystal) { /* Animation implementation */ }
    playReleaseEffect(crystal) { /* Release animation */ }
    destroy() { /* Cleanup */ }
}

class CrystalInventoryUI {
    addCrystal(crystal) { /* UI update */ }
    removeCrystal(crystalId) { /* UI update */ }
    destroy() { /* Cleanup */ }
}

class CrystalAudioEngine {
    async init() { /* Audio initialization */ }
    playInteractionSound(type, crystal) { /* Play sound */ }
    playCollectionSound(crystal) { /* Collection audio */ }
    playReleaseSound(crystal) { /* Release audio */ }
    destroy() { /* Audio cleanup */ }
}

class FallbackCrystalRenderer {
    // Fallback for when THREE.js isn't available
}

// Export for debugging
if (typeof window !== 'undefined' && window.location?.search?.includes('debug')) {
    window.MemoryCrystalSystem = MemoryCrystalSystem;
    window.MemoryCrystal = MemoryCrystal;
}