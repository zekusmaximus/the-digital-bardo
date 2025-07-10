// src/security/data-flow-guardian.js

let consciousness; // To be initialized lazily
const LOGGING_ENABLED = true; // Toggle for development/production

/**
 * Initializes the Data Guardian with the consciousness instance.
 * @param {object} consciousnessInstance - The main consciousness object.
 */
export function initializeDataGuardian(consciousnessInstance) {
    consciousness = consciousnessInstance;
    console.log("[Data Guardian] Initialized.");
}

/**
 * Logs the flow of data between different parts of the application.
 * This function will record events in the digital soul for later analysis.
 *
 * @param {string} source - The origin of the data (e.g., 'user_input', 'localStorage', 'network').
 * @param {string} destination - The destination of the data (e.g., 'dom_update', 'karmic_engine', 'audio_engine').
 * @param {object} data - The data being transferred. Can be a simplified representation for logging.
 */
export function logDataFlow(source, destination, data) {
    if (!LOGGING_ENABLED || !consciousness) return;

    try {
        // Sanitize or summarize data to avoid logging sensitive information.
        const sanitizedData = summarizeData(data);

        const flowEvent = {
            source,
            destination,
            dataSummary: sanitizedData,
            timestamp: Date.now()
        };

        // Use the consciousness module to record the data flow event.
        consciousness.recordEvent('data_flow_logged', flowEvent);

        console.log(`[Data Guardian] Flow: ${source} -> ${destination}`, { data: sanitizedData });
    } catch (error) {
        console.error("[Data Guardian] Error logging data flow:", error);
        // Avoid calling recordEvent if consciousness itself is the problem.
        if (consciousness) {
            consciousness.recordEvent('data_guardian_error', {
                error: error.message,
                source,
                destination
            });
        }
    }
}

/**
 * A utility to create a simple summary of data to avoid logging large objects.
 * @param {any} data - The data to summarize.
 * @returns {object} A summary of the data.
 */
function summarizeData(data) {
    if (typeof data !== 'object' || data === null) {
        return { type: typeof data, value: data };
    }

    if (Array.isArray(data)) {
        return { type: 'array', length: data.length, firstItem: data.length > 0 ? summarizeData(data[0]) : 'empty' };
    }

    const summary = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (typeof value === 'function') {
                summary[key] = 'function';
            } else if (typeof value === 'object' && value !== null) {
                summary[key] = { type: 'object', keys: Object.keys(value) };
            } else {
                summary[key] = value;
            }
        }
    }
    return summary;
}

/**
 * Systematically reviews data entering and leaving the system.
 * This is a more comprehensive check that can be triggered at key lifecycle points.
 */
export function auditDataBoundaries() {
    if (typeof window === 'undefined') {
        return;
    }
    console.log("[Data Guardian] Performing data boundary audit...");

    // 1. Audit LocalStorage/SessionStorage
    try {
        const soulData = JSON.parse(sessionStorage.getItem('digitalSoul'));
        if (soulData) {
            logDataFlow('sessionStorage', 'audit', { key: 'digitalSoul', size: JSON.stringify(soulData).length });
            // Here you could add validation against a schema for the soul data.
        }
    } catch (error) {
        logDataFlow('sessionStorage', 'audit_error', { error: error.message });
    }

    // 2. Audit URL Parameters
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.toString()) {
            const params = Object.fromEntries(urlParams.entries());
            logDataFlow('url_parameters', 'audit', { params });
            // Here you could validate URL params against an expected set.
        }
    } catch (error) {
        logDataFlow('url_parameters', 'audit_error', { error: error.message });
    }

    // 3. User Events (conceptual placeholder - actual logging is done in handlers)
    logDataFlow('user_events', 'audit', { note: 'User event data is logged at the point of handling.' });

    console.log("[Data Guardian] Data boundary audit complete.");
}