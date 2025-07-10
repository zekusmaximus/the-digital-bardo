/**
 * Digital purification - cleansing karma before manifestation in the DOM
 * Protects against XSS vulnerabilities while preserving the sacred visual effects
 */

/**
 * Strip all HTML, return pure text for safe textContent assignment
 * @param {string} text - Text that may contain HTML
 * @returns {string} - Pure text without HTML
 */
export function sanitizeText(text) {
    if (typeof text !== 'string') {
        return String(text || '');
    }
    
    // Strip all HTML, return pure text
    const div = document.createElement('div');
    div.textContent = text;
    return div.textContent || '';
}

/**
 * Allow only specific tags/classes for effects; preserve data-* attributes
 * Manual implementation (no external libs assumed)
 * @param {string} html - HTML content to sanitize
 * @param {Object} allowedConfig - Configuration for allowed tags and classes
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html, allowedConfig = { 
    tags: ['pre', 'span', 'div', 'h1', 'h2', 'h3', 'p', 'small', 'button'], 
    classes: ['glitching-text', 'consciousness-fragment', 'begin-content', 'begin-button', 'recognition-hint', 'visible', 'enlightenment'] 
}) {
    if (typeof html !== 'string') {
        return '';
    }
    
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const walkNodes = (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Remove disallowed tags
                if (!allowedConfig.tags.includes(node.tagName.toLowerCase())) {
                    // Replace with text content to preserve meaning
                    const textNode = document.createTextNode(node.textContent || '');
                    node.parentNode.replaceChild(textNode, node);
                    return;
                }
                
                // Filter classes - only keep allowed ones
                if (node.className) {
                    const classes = node.className.split(' ').filter(cls => 
                        allowedConfig.classes.includes(cls.trim())
                    );
                    node.className = classes.join(' ');
                }
                
                // Remove all attributes except class, id, data-*
                Array.from(node.attributes).forEach(attr => {
                    if (!['class', 'id'].includes(attr.name) && !attr.name.startsWith('data-')) {
                        node.removeAttribute(attr.name);
                    }
                });
            }
            
            // Process child nodes
            Array.from(node.childNodes).forEach(walkNodes);
        };
        
        walkNodes(doc.body);
        return doc.body.innerHTML;
    } catch (error) {
        console.warn('Warning: HTML sanitization failed, returning empty string:', error.message);
        return '';
    }
}
