import { MovementPath } from './movement-path.js';
import { consciousness } from '../src/consciousness/digital-soul.js';

/**
 * Pre-computed path templates for common movement patterns
 */
export class PathTemplates {
    constructor() {
        this.templates = new Map();
        this.templateCache = new Map();
        this.initializeTemplates();
    }

    /**
     * Initializes all path templates
     */
    initializeTemplates() {
        // Edge-to-center traversal patterns
        this.createEdgeToCenterTemplates();
        
        // Center-based movement patterns
        this.createCenterMovementTemplates();
        
        // Transition zone patterns
        this.createTransitionTemplates();
        
        // Complex multi-zone patterns
        this.createComplexTraversalTemplates();
        
        console.log(`[PathTemplates] Initialized ${this.templates.size} path templates`);
        
        consciousness.recordEvent('path_templates_initialized', {
            templateCount: this.templates.size,
            categories: this.getTemplateCategories()
        });
    }

    /**
     * Creates edge-to-center traversal templates
     */
    createEdgeToCenterTemplates() {
        // Top edge to center
        this.addTemplate('edge-top-to-center', {
            pathType: 'edge-to-center',
            centerTraversal: true,
            curveType: 'bezier',
            easing: 'power2.out',
            duration: 18,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const startY = viewport.height * 0.05;
                
                return [
                    { x: centerX * 0.7, y: centerY * 0.4 },
                    { x: centerX, y: centerY },
                    { x: centerX * 1.3, y: centerY * 1.6 }
                ];
            }
        });

        // Right edge to center
        this.addTemplate('edge-right-to-center', {
            pathType: 'edge-to-center',
            centerTraversal: true,
            curveType: 'bezier',
            easing: 'power2.out',
            duration: 18,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                
                return [
                    { x: centerX * 1.6, y: centerY * 0.7 },
                    { x: centerX, y: centerY },
                    { x: centerX * 0.4, y: centerY * 1.3 }
                ];
            }
        });

        // Bottom edge to center
        this.addTemplate('edge-bottom-to-center', {
            pathType: 'edge-to-center',
            centerTraversal: true,
            curveType: 'bezier',
            easing: 'power2.out',
            duration: 18,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                
                return [
                    { x: centerX * 1.3, y: centerY * 1.6 },
                    { x: centerX, y: centerY },
                    { x: centerX * 0.7, y: centerY * 0.4 }
                ];
            }
        });

        // Left edge to center
        this.addTemplate('edge-left-to-center', {
            pathType: 'edge-to-center',
            centerTraversal: true,
            curveType: 'bezier',
            easing: 'power2.out',
            duration: 18,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                
                return [
                    { x: centerX * 0.4, y: centerY * 1.3 },
                    { x: centerX, y: centerY },
                    { x: centerX * 1.6, y: centerY * 0.7 }
                ];
            }
        });
    }

    /**
     * Creates center-based movement templates
     */
    createCenterMovementTemplates() {
        // Radial expansion from center
        this.addTemplate('center-radial-expansion', {
            pathType: 'center-radial',
            centerTraversal: false,
            curveType: 'linear',
            easing: 'power1.out',
            duration: 16,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.min(viewport.width, viewport.height) * 0.3;
                
                return [
                    { x: centerX + Math.cos(angle) * distance * 0.3, y: centerY + Math.sin(angle) * distance * 0.3 },
                    { x: centerX + Math.cos(angle) * distance * 0.7, y: centerY + Math.sin(angle) * distance * 0.7 },
                    { x: centerX + Math.cos(angle) * distance, y: centerY + Math.sin(angle) * distance }
                ];
            }
        });

        // Orbital movement around center
        this.addTemplate('center-orbital', {
            pathType: 'center-orbital',
            centerTraversal: true,
            curveType: 'catmull-rom',
            easing: 'sine.inOut',
            duration: 20,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const radius = Math.min(viewport.width, viewport.height) * 0.2;
                const startAngle = Math.random() * Math.PI * 2;
                const angleSpan = Math.PI * 1.5; // 270 degrees
                const segments = 5;
                
                const waypoints = [];
                for (let i = 0; i <= segments; i++) {
                    const angle = startAngle + (angleSpan * i / segments);
                    waypoints.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius
                    });
                }
                
                return waypoints;
            }
        });

        // Spiral movement from center
        this.addTemplate('center-spiral', {
            pathType: 'center-spiral',
            centerTraversal: true,
            curveType: 'catmull-rom',
            easing: 'power2.inOut',
            duration: 22,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const maxRadius = Math.min(viewport.width, viewport.height) * 0.25;
                const turns = 2.5;
                const segments = 8;
                
                const waypoints = [];
                for (let i = 0; i <= segments; i++) {
                    const progress = i / segments;
                    const angle = progress * turns * Math.PI * 2;
                    const radius = maxRadius * progress;
                    
                    waypoints.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius
                    });
                }
                
                return waypoints;
            }
        });

        // Figure-8 pattern through center
        this.addTemplate('center-figure-eight', {
            pathType: 'center-figure-eight',
            centerTraversal: true,
            curveType: 'catmull-rom',
            easing: 'sine.inOut',
            duration: 24,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const width = Math.min(viewport.width, viewport.height) * 0.15;
                const height = width * 0.6;
                const segments = 8;
                
                const waypoints = [];
                for (let i = 0; i <= segments; i++) {
                    const t = (i / segments) * Math.PI * 2;
                    const x = centerX + width * Math.sin(t);
                    const y = centerY + height * Math.sin(t) * Math.cos(t);
                    
                    waypoints.push({ x, y });
                }
                
                return waypoints;
            }
        });
    }

    /**
     * Creates transition zone movement templates
     */
    createTransitionTemplates() {
        // Diagonal sweep across screen
        this.addTemplate('transition-diagonal-sweep', {
            pathType: 'transition-diagonal',
            centerTraversal: true,
            curveType: 'bezier',
            easing: 'power2.inOut',
            duration: 19,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                
                // Create diagonal path that passes through center
                const startCorner = Math.random() < 0.5 ? 'top-left' : 'bottom-right';
                
                if (startCorner === 'top-left') {
                    return [
                        { x: viewport.width * 0.2, y: viewport.height * 0.2 },
                        { x: centerX, y: centerY },
                        { x: viewport.width * 0.8, y: viewport.height * 0.8 }
                    ];
                } else {
                    return [
                        { x: viewport.width * 0.8, y: viewport.height * 0.8 },
                        { x: centerX, y: centerY },
                        { x: viewport.width * 0.2, y: viewport.height * 0.2 }
                    ];
                }
            }
        });

        // S-curve through center
        this.addTemplate('transition-s-curve', {
            pathType: 'transition-s-curve',
            centerTraversal: true,
            curveType: 'catmull-rom',
            easing: 'power2.inOut',
            duration: 21,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const amplitude = Math.min(viewport.width, viewport.height) * 0.2;
                
                return [
                    { x: centerX - amplitude, y: centerY - amplitude * 0.8 },
                    { x: centerX - amplitude * 0.3, y: centerY - amplitude * 0.3 },
                    { x: centerX, y: centerY },
                    { x: centerX + amplitude * 0.3, y: centerY + amplitude * 0.3 },
                    { x: centerX + amplitude, y: centerY + amplitude * 0.8 }
                ];
            }
        });
    }

    /**
     * Creates complex multi-zone traversal templates
     */
    createComplexTraversalTemplates() {
        // Cross-screen traversal
        this.addTemplate('complex-cross-screen', {
            pathType: 'complex-traversal',
            centerTraversal: true,
            curveType: 'catmull-rom',
            easing: 'power1.inOut',
            duration: 25,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const margin = Math.min(viewport.width, viewport.height) * 0.1;
                
                // Create path that visits multiple zones
                return [
                    { x: margin, y: margin }, // Top-left
                    { x: centerX * 0.7, y: centerY * 0.7 }, // Approach center
                    { x: centerX, y: centerY }, // Center
                    { x: centerX * 1.3, y: centerY * 1.3 }, // Exit center
                    { x: viewport.width - margin, y: viewport.height - margin } // Bottom-right
                ];
            }
        });

        // Zigzag pattern
        this.addTemplate('complex-zigzag', {
            pathType: 'complex-zigzag',
            centerTraversal: true,
            curveType: 'linear',
            easing: 'none',
            duration: 20,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const amplitude = Math.min(viewport.width, viewport.height) * 0.15;
                const segments = 6;
                
                const waypoints = [];
                for (let i = 0; i <= segments; i++) {
                    const progress = i / segments;
                    const x = centerX + (i % 2 === 0 ? -amplitude : amplitude);
                    const y = centerY - amplitude + (progress * amplitude * 2);
                    
                    waypoints.push({ x, y });
                }
                
                return waypoints;
            }
        });

        // Flower petal pattern
        this.addTemplate('complex-flower-petal', {
            pathType: 'complex-flower',
            centerTraversal: true,
            curveType: 'catmull-rom',
            easing: 'sine.inOut',
            duration: 26,
            waypointGenerator: (startZone, viewport) => {
                const centerX = viewport.width / 2;
                const centerY = viewport.height / 2;
                const petalRadius = Math.min(viewport.width, viewport.height) * 0.18;
                const petals = 5;
                const segments = 10;
                
                const waypoints = [];
                for (let i = 0; i <= segments; i++) {
                    const t = (i / segments) * petals * Math.PI * 2;
                    const r = petalRadius * Math.sin(petals * t / 2);
                    const x = centerX + r * Math.cos(t);
                    const y = centerY + r * Math.sin(t);
                    
                    waypoints.push({ x, y });
                }
                
                return waypoints;
            }
        });
    }

    /**
     * Adds a template to the collection
     */
    addTemplate(name, config) {
        this.templates.set(name, {
            name: name,
            ...config,
            createdAt: Date.now()
        });
    }

    /**
     * Gets a template by name
     */
    getTemplate(name) {
        return this.templates.get(name);
    }

    /**
     * Gets all templates of a specific type
     */
    getTemplatesByType(pathType) {
        const templates = [];
        for (const [name, template] of this.templates) {
            if (template.pathType === pathType) {
                templates.push({ name, ...template });
            }
        }
        return templates;
    }

    /**
     * Gets templates suitable for center traversal
     */
    getCenterTraversalTemplates() {
        const templates = [];
        for (const [name, template] of this.templates) {
            if (template.centerTraversal) {
                templates.push({ name, ...template });
            }
        }
        return templates;
    }

    /**
     * Creates a MovementPath instance from a template
     */
    createPathFromTemplate(templateName, startZone, viewport, options = {}) {
        const template = this.getTemplate(templateName);
        if (!template) {
            console.warn(`[PathTemplates] Template '${templateName}' not found`);
            return null;
        }

        // Generate waypoints using the template's generator
        const waypoints = template.waypointGenerator ? 
            template.waypointGenerator(startZone, viewport) : [];

        // Create the path with template configuration
        const path = new MovementPath({
            startZone: startZone,
            waypoints: waypoints,
            duration: options.duration || template.duration,
            easing: options.easing || template.easing,
            centerTraversal: template.centerTraversal,
            pathType: template.pathType,
            curveType: template.curveType,
            metadata: {
                templateName: templateName,
                generatedAt: Date.now(),
                viewport: { width: viewport.width, height: viewport.height },
                ...options.metadata
            }
        });

        // Cache the generated path for potential reuse
        const cacheKey = `${templateName}_${viewport.width}x${viewport.height}_${startZone?.id || 'no-zone'}`;
        this.templateCache.set(cacheKey, path.clone());

        consciousness.recordEvent('path_created_from_template', {
            templateName: templateName,
            pathType: template.pathType,
            waypointCount: waypoints.length,
            centerTraversal: template.centerTraversal,
            duration: path.duration
        });

        return path;
    }

    /**
     * Selects an appropriate template based on zone and strategy
     */
    selectTemplate(startZone, strategy = 'balanced', viewport) {
        let candidateTemplates = [];

        switch (strategy) {
            case 'center-weighted':
                candidateTemplates = this.getCenterTraversalTemplates();
                break;
            case 'edge-only':
                candidateTemplates = this.getTemplatesByType('edge-to-center');
                break;
            case 'organic':
                candidateTemplates = Array.from(this.templates.values());
                break;
            case 'balanced':
            default:
                // Mix of center traversal and other patterns
                const centerTemplates = this.getCenterTraversalTemplates();
                const otherTemplates = Array.from(this.templates.values())
                    .filter(t => !t.centerTraversal);
                candidateTemplates = [...centerTemplates, ...otherTemplates];
                break;
        }

        if (candidateTemplates.length === 0) {
            console.warn(`[PathTemplates] No templates found for strategy '${strategy}'`);
            return null;
        }

        // Filter templates based on zone type if available
        if (startZone && startZone.type) {
            const zoneSpecificTemplates = candidateTemplates.filter(template => {
                if (startZone.type === 'edge') {
                    return template.pathType.includes('edge') || template.centerTraversal;
                } else if (startZone.type === 'center') {
                    return template.pathType.includes('center');
                } else if (startZone.type === 'transition') {
                    return template.pathType.includes('transition') || template.centerTraversal;
                }
                return true;
            });

            if (zoneSpecificTemplates.length > 0) {
                candidateTemplates = zoneSpecificTemplates;
            }
        }

        // Select random template from candidates
        const selectedTemplate = candidateTemplates[Math.floor(Math.random() * candidateTemplates.length)];
        return selectedTemplate.name;
    }

    /**
     * Gets template categories for analytics
     */
    getTemplateCategories() {
        const categories = new Map();
        
        for (const template of this.templates.values()) {
            const type = template.pathType;
            if (!categories.has(type)) {
                categories.set(type, 0);
            }
            categories.set(type, categories.get(type) + 1);
        }
        
        return Object.fromEntries(categories);
    }

    /**
     * Clears the template cache
     */
    clearCache() {
        this.templateCache.clear();
        console.log('[PathTemplates] Template cache cleared');
    }

    /**
     * Gets cache statistics
     */
    getCacheStats() {
        return {
            cacheSize: this.templateCache.size,
            templateCount: this.templates.size,
            categories: this.getTemplateCategories()
        };
    }

    /**
     * Destroys the path templates system
     */
    destroy() {
        this.templates.clear();
        this.templateCache.clear();
        
        consciousness.recordEvent('path_templates_destroyed', {
            finalStats: this.getCacheStats()
        });
    }
}