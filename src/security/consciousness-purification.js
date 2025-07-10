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
    
    // This is a robust way to strip HTML tags.
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
}

/**
 * Safely sets the text content of a DOM element, preventing XSS.
 * @param {HTMLElement} element - The DOM element to modify.
 * @param {string} text - The pure text to set.
 */
export function purifyAndSetText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

/**
 * Securely creates a new DOM element, sets its attributes, and adds text content.
 * This function avoids innerHTML to prevent XSS.
 * @param {string} tag - The HTML tag for the new element.
 * @param {object} [options] - Optional parameters.
 * @param {object} [options.attributes={}] - A key-value map of attributes to set (e.g., { class: 'my-class', 'data-id': '123' }).
 * @param {string} [options.textContent=''] - The text content to add to the element.
 * @returns {HTMLElement} The newly created and secured DOM element.
 */
export function manifestElement(tag, { attributes = {}, textContent = '' } = {}) {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }

    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}

/**
 * Creates a new DOM element from a <template> tag and populates it with data.
 * This is a secure alternative to string-based templating with innerHTML.
 * @param {string} templateId - The ID of the <template> element.
 * @param {object} data - A key-value map where keys are `data-` attributes in the template
 *                        and values are the text content to insert.
 * @returns {DocumentFragment | null} The cloned and populated DOM fragment, or null if the template is not found.
 */
export function manifestTemplate(templateId, data) {
    const template = document.getElementById(templateId);
    if (!template || template.tagName !== 'TEMPLATE') {
        console.error(`Consciousness-Purification Error: Template with ID "${templateId}" not found.`);
        return null;
    }

    const clone = template.content.cloneNode(true);

    for (const [key, value] of Object.entries(data)) {
        const target = clone.querySelector(`[data-template-key="${key}"]`);
        if (target) {
            purifyAndSetText(target, value);
        }
    }

    return clone;
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

        if (!doc || !doc.body) {
            console.warn('Warning: DOMParser failed to create valid document');
            return '';
        }

        const walkNodes = (node) => {
            if (!node || !node.nodeType) return;

            if (node.nodeType === Node.ELEMENT_NODE) {
                if (!allowedConfig.tags.includes(node.tagName.toLowerCase())) {
                    const textNode = document.createTextNode(node.textContent || '');
                    if (node.parentNode) {
                        node.parentNode.replaceChild(textNode, node);
                    }
                    return;
                }

                if (node.className) {
                    const classes = node.className.split(' ').filter(cls =>
                        allowedConfig.classes.includes(cls.trim())
                    );
                    node.className = classes.join(' ');
                }

                Array.from(node.attributes || []).forEach(attr => {
                    if (!['class', 'id'].includes(attr.name) && !attr.name.startsWith('data-')) {
                        node.removeAttribute(attr.name);
                    }
                });
            }

            if (node.childNodes) {
                Array.from(node.childNodes).forEach(walkNodes);
            }
        };

        walkNodes(doc.body);
        return doc.body.innerHTML || '';
    } catch (error) {
        console.warn('Warning: HTML sanitization failed, returning empty string:', error.message);
        return '';
    }
}