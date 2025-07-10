// Factory pattern to break circular dependency
export class DataGuardianFactory {
    static createGuardian() {
        let consciousness = null;
        const LOGGING_ENABLED = true;

        const summarizeData = (data) => {
            if (typeof data !== 'object' || data === null) {
                return { type: typeof data, value: data };
            }
            if (Array.isArray(data)) {
                return {
                    type: 'array',
                    length: data.length,
                    firstItem: data.length > 0 ? summarizeData(data[0]) : 'empty'
                };
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
        };

        return {
            logDataFlow(source, destination, data) {
                if (!LOGGING_ENABLED || !consciousness) return;
                try {
                    const sanitizedData = summarizeData(data);
                    const flowEvent = {
                        source,
                        destination,
                        dataSummary: sanitizedData,
                        timestamp: Date.now()
                    };
                    consciousness.recordEvent('data_flow_logged', flowEvent);
                    console.log(`[Data Guardian] Flow: ${source} -> ${destination}`,
                        { data: sanitizedData });
                } catch (error) {
                    console.error('[Data Guardian] Error logging data flow:', error);
                    if (consciousness) {
                        consciousness.recordEvent('data_guardian_error', {
                            error: error.message,
                            source,
                            destination
                        });
                    }
                }
            },
            auditDataBoundaries() {
                if (typeof window === 'undefined') return;
                console.log('[Data Guardian] Performing data boundary audit...');
                try {
                    const soulData = JSON.parse(sessionStorage.getItem('digitalSoul'));
                    if (soulData) {
                        this.logDataFlow('sessionStorage', 'audit', {
                            key: 'digitalSoul',
                            size: JSON.stringify(soulData).length
                        });
                    }
                } catch (error) {
                    this.logDataFlow('sessionStorage', 'audit_error', { error: error.message });
                }
                try {
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.toString()) {
                        const params = Object.fromEntries(urlParams.entries());
                        this.logDataFlow('url_parameters', 'audit', { params });
                    }
                } catch (error) {
                    this.logDataFlow('url_parameters', 'audit_error', { error: error.message });
                }
                this.logDataFlow('user_events', 'audit', { note: 'User event data is logged at the point of handling.' });
                console.log('[Data Guardian] Data boundary audit complete.');
            },
            initializeWithConsciousness(consciousnessInstance) {
                consciousness = consciousnessInstance;
                console.log('[Data Guardian] Initialized via factory.');
            }
        };
    }
}
