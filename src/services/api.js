/* 
===========================================
SCOUTPLUSE - API SERVICE
===========================================

This service handles all API communications with the PHP backend
for reading and writing event data to the JSON file.
*/

/**
 * API Configuration
 * Update these values to match your hosting setup
 */
const API_CONFIG = {
    baseUrl: window.API_BASE_URL || '', // سيتم تحديده من المتغير العام أو نفس النطاق
    securityToken: 'ScoutPlus(WebApp)',
    endpoints: {
        read: '/read.php',
        write: '/write.php'
    },
    timeout: 10000 // 10 seconds timeout
};

/**
 * API Service Class
 * Handles all communication with the PHP backend
 */
class APIService {
    constructor() {
        this.baseUrl = window.API_BASE_URL || API_CONFIG.baseUrl || '';
        this.token = API_CONFIG.securityToken;
        this.endpoints = API_CONFIG.endpoints;
        this.timeout = API_CONFIG.timeout;
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    /**
     * Initialize API Service
     */
    init() {
        console.log('📡 Initializing API Service...');
        
        // Monitor online/offline status
        this.setupNetworkMonitoring();
        
        console.log(`🔗 API Base URL: ${this.baseUrl || 'same domain'}`);
        console.log(`🔑 Security Token: ${this.token ? 'Present' : 'Missing'}`);
        console.log('✅ API Service initialized');
    }

    /**
     * Setup Network Monitoring
     */
    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Network connection restored');
            this.dispatchConnectionEvent('online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📡 Network connection lost');
            this.dispatchConnectionEvent('offline');
        });
    }

    /**
     * Dispatch Connection Event
     * @param {string} status - Connection status
     */
    dispatchConnectionEvent(status) {
        window.dispatchEvent(new CustomEvent('networkStatusChanged', {
            detail: { status, isOnline: this.isOnline }
        }));
    }

    /**
     * Create fetch request with timeout
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            // Build the full URL properly
            let fullUrl;
            if (url.startsWith('http')) {
                fullUrl = url;
            } else if (this.baseUrl) {
                // Remove leading slash from url if baseUrl doesn't end with slash
                const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
                fullUrl = this.baseUrl.endsWith('/') ? `${this.baseUrl}${cleanUrl}` : `${this.baseUrl}/${cleanUrl}`;
            } else {
                fullUrl = url.startsWith('/') ? `./api${url}` : `./api/${url}`;
            }
            
            console.log(`🔗 Making request to: ${fullUrl}`);
            
            const response = await fetch(fullUrl, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please check your connection');
            }
            throw error;
        }
    }

    /**
     * Read all events from the server
     */
    async readEvents() {
        console.log('📥 Reading events from API...');
        console.log(`🔗 Base URL: ${this.baseUrl}`);
        console.log(`🔗 Full endpoint: ${this.baseUrl}/read.php`);
        
        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }
        
        try {
            const url = this.endpoints.read;
            
            // Build the full URL properly
            let fullUrl;
            if (url.startsWith('http')) {
                fullUrl = url;
            } else if (this.baseUrl) {
                const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
                fullUrl = this.baseUrl.endsWith('/') ? `${this.baseUrl}${cleanUrl}` : `${this.baseUrl}/${cleanUrl}`;
            } else {
                fullUrl = `./api${url}`;
            }
            
            console.log(`🔗 Final API URL: ${fullUrl}`);
            
            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
                console.error(`❌ Response URL: ${response.url}`);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                console.error(`❌ API Error: ${result.error}`);
                throw new Error(result.error || 'Failed to read events');
            }

            console.log(`✅ Successfully loaded ${result.data.totalEvents} events`);
            
            // Dispatch data loaded event
            this.dispatchDataEvent('eventsLoaded', result.data);
            
            return result.data;

        } catch (error) {
            console.error('❌ Error reading events:', error.message);
            console.error('❌ Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack?.split('\n')[0]
            });
            
            // Dispatch error event
            this.dispatchDataEvent('eventsLoadError', { error: error.message });
            
            throw new Error(`Failed to load events: ${error.message}`);
        }
    }

    /**
     * Write/Update all events to the server
     */
    async writeEvents(eventsData) {
        console.log('📤 Writing events to API...');
        console.log(`📊 Events to save: ${eventsData.length}`);
        
        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }
        
        try {
            const url = this.endpoints.write;
            
            const requestData = {
                token: this.token,
                operation: 'update',
                data: {
                    events: eventsData,
                    lastUpdated: new Date().toISOString()
                }
            };
            
            console.log('📤 Request data:', {
                token: this.token,
                operation: 'update',
                eventsCount: eventsData.length
            });

            const response = await this.fetchWithTimeout(url, {
                method: 'POST',
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ HTTP Error Response:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const responseText = await response.text();
            console.log('📥 Raw response:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
            }
            
            if (!result.success) {
                console.error('❌ API Error:', result.error);
                throw new Error(result.error || 'Failed to write events');
            }

            console.log(`✅ Successfully saved ${result.data.totalEvents} events`);
            
            // Dispatch data saved event
            this.dispatchDataEvent('eventsSaved', result.data);
            
            return result.data;

        } catch (error) {
            console.error('❌ Error writing events:', error);
            
            // Dispatch error event
            this.dispatchDataEvent('eventsSaveError', { error: error.message });
            
            throw new Error(`Failed to save events: ${error.message}`);
        }
    }

    /**
     * Add a new event
     */
    async addEvent(eventData) {
        console.log('➕ Adding new event to API...');
        
        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }
        
        try {
            const url = this.endpoints.write;
            
            // إضافة معرف فريد إذا لم يكن موجود
            if (!eventData.id) {
                eventData.id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            
            // إضافة الطوابع الزمنية
            eventData.createdAt = eventData.createdAt || new Date().toISOString();
            eventData.updatedAt = new Date().toISOString();
            
            const requestData = {
                token: this.token,
                operation: 'add',
                data: eventData
            };

            const response = await this.fetchWithTimeout(url, {
                method: 'POST',
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const responseText = await response.text();
            console.log('📥 Add event response:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
            }
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to add event');
            }

            console.log(`✅ Successfully added event: ${eventData.title}`);
            
            // Dispatch event added
            this.dispatchDataEvent('eventAdded', { event: eventData, result: result.data });
            
            return result.data;

        } catch (error) {
            console.error('❌ Error adding event:', error);
            
            // Dispatch error event
            this.dispatchDataEvent('eventAddError', { error: error.message });
            
            throw new Error(`Failed to add event: ${error.message}`);
        }
    }

    /**
     * Delete an event
     */
    async deleteEvent(eventId) {
        console.log(`🗑️ Deleting event ${eventId} from API...`);
        
        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }
        
        try {
            const url = this.endpoints.write;
            
            const requestData = {
                token: this.token,
                operation: 'delete',
                data: { id: eventId }
            };

            const response = await this.fetchWithTimeout(url, {
                method: 'POST',
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete event');
            }

            console.log(`✅ Successfully deleted event ${eventId}`);
            
            // Dispatch event deleted
            this.dispatchDataEvent('eventDeleted', { eventId, result: result.data });
            
            return result.data;

        } catch (error) {
            console.error('❌ Error deleting event:', error);
            
            // Dispatch error event
            this.dispatchDataEvent('eventDeleteError', { error: error.message });
            
            throw new Error(`Failed to delete event: ${error.message}`);
        }
    }

    /**
     * Test API connection
     */
    async testConnection() {
        console.log('🔍 Testing API connection...');
        console.log(`🔗 Base URL: ${this.baseUrl || 'same domain'}`);
        console.log(`🔑 Token: ${this.token ? 'Present' : 'Missing'}`);
        
        try {
            const data = await this.readEvents();
            console.log('✅ API connection successful');
            
            const result = {
                success: true,
                message: 'API connection successful',
                eventsCount: data.totalEvents || 0,
                timestamp: new Date().toISOString()
            };
            
            // Dispatch connection test result
            this.dispatchDataEvent('connectionTested', result);
            
            return result;
        } catch (error) {
            console.error('❌ API connection failed:', error);
            
            const result = {
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            };
            
            // Dispatch connection test result
            this.dispatchDataEvent('connectionTested', result);
            
            return result;
        }
    }

    /**
     * Dispatch Data Event
     * @param {string} eventType - Type of event
     * @param {Object} data - Event data
     */
    dispatchDataEvent(eventType, data) {
        window.dispatchEvent(new CustomEvent(`api${eventType}`, {
            detail: { ...data, timestamp: new Date().toISOString() }
        }));
    }

    /**
     * Get API status and information
     */
    getAPIInfo() {
        return {
            baseUrl: this.baseUrl,
            endpoints: this.endpoints,
            hasToken: !!this.token,
            timeout: this.timeout,
            isOnline: this.isOnline,
            lastCheck: new Date().toISOString()
        };
    }

    /**
     * Check if API is available
     * @returns {boolean} Whether API is available
     */
    isAvailable() {
        return this.isOnline && !!this.baseUrl;
    }

    /**
     * Get Connection Status
     * @returns {Object} Connection status information
     */
    getConnectionStatus() {
        return {
            isOnline: this.isOnline,
            hasBaseUrl: !!this.baseUrl,
            hasToken: !!this.token,
            isConfigured: !!(this.baseUrl && this.token),
            lastUpdate: new Date().toISOString()
        };
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let apiServiceInstance = null;

/**
 * Get API Service Instance
 * @returns {APIService} API service instance
 */
function getAPIService() {
    if (!apiServiceInstance) {
        apiServiceInstance = new APIService();
    }
    return apiServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📡 Initializing API Service...');
    window.apiService = getAPIService();
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.APIService = APIService;
window.getAPIService = getAPIService;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIService, getAPIService };
}

console.log('📡 API Service module loaded successfully');