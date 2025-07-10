// src/security/karmic-validation.js

/**
 * A simple schema validator.
 * @param {object} data The data to validate.
 * @param {object} schema The validation schema.
 * @returns {boolean} True if the data is valid, false otherwise.
 */
function validate(data, schema) {
    for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
            const rule = schema[key];
            const value = data[key];

            // Check for presence if required
            if (rule.required && (value === undefined || value === null)) {
                console.error(`Validation failed: ${key} is required.`);
                return false;
            }

            // Skip validation for non-required, empty fields
            if (!rule.required && (value === undefined || value === null)) {
                continue;
            }

            // Check type
            if (rule.type && typeof value !== rule.type) {
                console.error(`Validation failed: ${key} must be of type ${rule.type}, but was ${typeof value}.`);
                return false;
            }

            // Check min and max length for strings
            if (rule.type === 'string') {
                if (rule.maxLength && value.length > rule.maxLength) {
                    console.error(`Validation failed: ${key} must be no more than ${rule.maxLength} characters.`);
                    return false;
                }
                if (rule.minLength && value.length < rule.minLength) {
                    console.error(`Validation failed: ${key} must be at least ${rule.minLength} characters.`);
                    return false;
                }
                // A simple check for any HTML-like tags.
                if (rule.noHTML && /<[a-z][\s\S]*>/i.test(value)) {
                     console.error(`Validation failed: ${key} must not contain HTML.`);
                     return false;
                }
            }
            
            // Check min and max for numbers
            if (rule.type === 'number') {
                if (rule.min !== undefined && value < rule.min) {
                    console.error(`Validation failed: ${key} must be at least ${rule.min}.`);
                    return false;
                }
                if (rule.max !== undefined && value > rule.max) {
                    console.error(`Validation failed: ${key} must be no more than ${rule.max}.`);
                    return false;
                }
            }

            // For objects, we can have nested schemas.
            if(rule.type === 'object' && rule.schema) {
                if(!validate(value, rule.schema)) {
                    return false;
                }
            }
        }
    }
    return true;
}


export const thoughtFragmentSchema = {
    content: {
        type: 'string',
        required: true,
        maxLength: 256,
        noHTML: true
    }
};

export const karmaEventSchema = {
    action: {
        type: 'string',
        required: true,
        // Could be an enum of allowed actions from karmic-engine
    },
    context: {
        type: 'object',
        required: true,
        schema: {
            timeToDecision: { type: 'number', required: false, min: 0 },
            perfectTimingBonus: { type: 'number', required: false, min: 0 },
            memoryViews: { type: 'number', required: false, min: 0 },
            memoryAttachments: { type: 'number', required: false, min: 0 },
            secondsOfInaction: { type: 'number', required: false, min: 0 },
            degradationLevel: { type: 'number', required: false, min: 0, max: 1 }
        }
    }
};

export const audioParamsSchema = {
    frequency: {
        type: 'number',
        required: true,
        min: 20,
        max: 20000
    },
    gain: {
        type: 'number',
        required: true,
        min: 0,
        max: 1 // Assuming gain is between 0 and 1
    }
};

export const mouseEventSchema = {
    clientX: { type: 'number', required: true },
    clientY: { type: 'number', required: true }
};

export const keyboardEventSchema = {
    key: { type: 'string', required: true, maxLength: 20 }, // Increased length for keys like 'Space', 'Enter'
    code: { type: 'string', required: false }
};

export const touchEventSchema = {
    touches: {
        type: 'object',
        required: true,
        schema: {
            '0': {
                type: 'object',
                required: true,
                schema: {
                    clientX: { type: 'number', required: true },
                    clientY: { type: 'number', required: true }
                }
            }
        }
    }
};


/**
 * Higher-order function to create a validation wrapper.
 * @param {object} schema - The validation schema.
 * @returns {function(object): boolean} - A function that takes data and returns true if valid, false otherwise.
 */
export function createKarmicValidator(schema) {
    return function(data) {
        return validate(data, schema);
    }
}