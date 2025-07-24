/* 
===========================================
SCOUTPLUSE - LOCAL DATA MANAGER SERVICE
===========================================

خدمة إدارة البيانات المحلية
تدير البيانات باستخدام localStorage وملفات JSON
*/

/**
 * Local Data Manager Service Class
 * يدير البيانات محلياً بدون الحاجة لخادم
 */
class DataManagerService {
    constructor() {
        this.currentProvider = 'local';
        this.localStorageService = null;
        this.isInitialized = false;
        this.events = [];
        this.users = {};
        
        this.init();
    }

    /**
     * تهيئة مدير البيانات
     */
    async init() {
        console.log('📊 Initializing Local Data Manager Service...');
        
        try {
            // تهيئة خدمة التخزين المحلي
            this.localStorageService = window.getLocalStorageService();
            
            // تحميل البيانات
            await this.loadInitialData();
            
            this.setupEventListeners();
            this.isInitialized = true;
            
            console.log('✅ Local Data Manager initialized successfully');
            
        } catch (error) {
            console.error('❌ Data Manager initialization failed:', error);
            this.isInitialized = true; // استمر حتى لو فشل التحميل
        }
    }

    /**
     * تحميل البيانات الأولية
     */
    async loadInitialData() {
        console.log('📥 Loading initial data...');
        
        // تحميل الأحداث
        this.events = this.localStorageService.getEvents();
        
        // إذا لم توجد أحداث، حاول التحميل من ملف JSON
        if (this.events.length === 0) {
            await this.loadEventsFromJSON();
        }
        
        // تحميل المستخدمين
        this.users = this.localStorageService.getUsers();
        
        console.log(`✅ Loaded ${this.events.length} events and ${Object.keys(this.users).length} users`);
    }

    /**
     * Load events from JSON file
     */
    async loadEventsFromJSON() {
        try {
            const eventsFilePath = window.getEventsFilePath() || '../JSON/events.json';
            const response = await fetch(`${eventsFilePath}?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                this.events = data.events || [];
                this.localStorageService.saveEvents(this.events);
                console.log(`📄 Loaded ${this.events.length} events from JSON file`);
                
                // إرسال حدث تحديث البيانات
                this.dispatchEvent('eventsLoaded', {
                    events: this.events,
                    totalEvents: this.events.length,
                    source: 'jsonFile'
                });
            } else {
                throw new Error('JSON file not found');
            }
        } catch (error) {
            console.error('❌ Failed to load events from JSON file:', error);
            console.log('🔄 Using empty events array - please check JSON/events.json file');
            this.events = [];
            this.localStorageService.saveEvents(this.events);
        }
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // الاستماع لتحديثات التخزين المحلي
        window.addEventListener('localStorageeventsUpdated', (e) => {
            this.events = e.detail.events;
            this.dispatchEvent('eventsLoaded', {
                events: this.events,
                totalEvents: this.events.length,
                source: 'localStorage'
            });
        });

        // الاستماع لتغييرات localStorage من تبويبات أخرى
        window.addEventListener('storage', (e) => {
            if (e.key === this.localStorageService.eventsKey) {
                console.log('🔄 Events updated in another tab');
                this.events = this.localStorageService.getEvents();
                this.dispatchEvent('eventsRealTimeUpdate', {
                    events: this.events
                });
            }
        });
    }

    /**
     * قراءة الأحداث
     */
    async readEvents() {
        console.log('📥 Reading events from local storage...');
        
        try {
            this.events = this.localStorageService.getEvents();
            
            const result = {
                events: this.events,
                totalEvents: this.events.length,
                lastUpdated: new Date().toISOString(),
                source: 'localStorage'
            };
            
            console.log(`✅ Successfully loaded ${this.events.length} events`);
            this.dispatchEvent('eventsLoaded', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Error reading events:', error);
            throw error;
        }
    }

    /**
     * كتابة الأحداث
     */
    async writeEvents(eventsArray) {
        console.log(`📤 Writing ${eventsArray.length} events to local storage...`);
        
        try {
            const success = this.localStorageService.saveEvents(eventsArray);
            
            if (success) {
                this.events = eventsArray;
                
                const result = {
                    totalEvents: eventsArray.length,
                    lastUpdated: new Date().toISOString(),
                    operation: 'update'
                };
                
                console.log(`✅ Successfully saved ${eventsArray.length} events`);
                this.dispatchEvent('eventsSaved', result);
                
                return result;
            } else {
                throw new Error('Failed to save events to localStorage');
            }
            
        } catch (error) {
            console.error('❌ Error writing events:', error);
            this.dispatchEvent('eventsSaveError', { error: error.message });
            throw error;
        }
    }

    /**
     * إضافة حدث جديد
     */
    async addEvent(eventData) {
        console.log('➕ Adding new event to local storage...');
        
        try {
            const newEvent = this.localStorageService.addEvent(eventData);
            this.events = this.localStorageService.getEvents();
            
            const result = {
                event: newEvent,
                operation: 'add',
                timestamp: new Date().toISOString()
            };
            
            console.log(`✅ Successfully added event: ${newEvent.title}`);
            this.dispatchEvent('eventAdded', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Error adding event:', error);
            this.dispatchEvent('eventAddError', { error: error.message });
            throw error;
        }
    }

    /**
     * حذف حدث
     */
    async deleteEvent(eventId) {
        console.log(`🗑️ Deleting event ${eventId} from local storage...`);
        
        try {
            const success = this.localStorageService.deleteEvent(eventId);
            this.events = this.localStorageService.getEvents();
            
            const result = {
                eventId: eventId,
                operation: 'delete',
                timestamp: new Date().toISOString()
            };
            
            console.log(`✅ Successfully deleted event: ${eventId}`);
            this.dispatchEvent('eventDeleted', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Error deleting event:', error);
            this.dispatchEvent('eventDeleteError', { error: error.message });
            throw error;
        }
    }

    /**
     * الانضمام لحدث
     */
    async joinEvent(eventId, userId) {
        console.log(`👥 User ${userId} joining event ${eventId}...`);
        
        try {
            const updatedEvent = this.localStorageService.joinEvent(eventId, userId);
            this.events = this.localStorageService.getEvents();
            
            const result = {
                event: updatedEvent,
                operation: 'join',
                timestamp: new Date().toISOString()
            };
            
            console.log(`✅ User ${userId} successfully joined event: ${eventId}`);
            this.dispatchEvent('eventJoined', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Error joining event:', error);
            throw error;
        }
    }

    /**
     * مغادرة حدث
     */
    async leaveEvent(eventId, userId) {
        console.log(`👥 User ${userId} leaving event ${eventId}...`);
        
        try {
            const updatedEvent = this.localStorageService.leaveEvent(eventId, userId);
            this.events = this.localStorageService.getEvents();
            
            const result = {
                event: updatedEvent,
                operation: 'leave',
                timestamp: new Date().toISOString()
            };
            
            console.log(`✅ User ${userId} successfully left event: ${eventId}`);
            this.dispatchEvent('eventLeft', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Error leaving event:', error);
            throw error;
        }
    }

    /**
     * اختبار الاتصال
     */
    async testConnection() {
        console.log('🔍 Testing local storage connection...');
        
        try {
            const result = this.localStorageService.testStorage();
            
            if (result.success) {
                result.eventsCount = this.events.length;
                result.service = 'Local Storage';
            }
            
            console.log('✅ Local storage connection test completed');
            this.dispatchEvent('connectionTested', result);
            
            return result;
            
        } catch (error) {
            console.error('❌ Connection test failed:', error);
            
            const result = {
                success: false,
                message: error.message,
                timestamp: new Date().toISOString(),
                service: 'Local Storage'
            };
            
            this.dispatchEvent('connectionTested', result);
            return result;
        }
    }

    /**
     * إرسال الأحداث المخصصة
     */
    dispatchEvent(eventType, data) {
        window.dispatchEvent(new CustomEvent(`dataManager${eventType}`, {
            detail: { 
                ...data, 
                provider: this.currentProvider,
                timestamp: new Date().toISOString() 
            }
        }));
    }

    /**
     * الحصول على معلومات مدير البيانات
     */
    getDataManagerInfo() {
        return {
            currentProvider: this.currentProvider,
            isInitialized: this.isInitialized,
            eventsCount: this.events.length,
            usersCount: Object.keys(this.users).length,
            storageStats: this.localStorageService?.getStorageStats(),
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * الحصول على حالة الاتصال
     */
    getConnectionStatus() {
        return {
            provider: this.currentProvider,
            isInitialized: this.isInitialized,
            isOnline: true, // دائماً متصل محلياً
            isConfigured: true,
            service: 'Local Storage',
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * تحديث الخدمة
     */
    async refresh() {
        console.log('🔄 Refreshing local data manager...');
        await this.loadInitialData();
        console.log('✅ Local data manager refreshed');
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let dataManagerInstance = null;

/**
 * Get Data Manager Service Instance
 * @returns {DataManagerService} Data manager service instance
 */
function getDataManagerService() {
    if (!dataManagerInstance) {
        dataManagerInstance = new DataManagerService();
    }
    return dataManagerInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Initializing Local Data Manager Service...');
    window.dataManagerService = getDataManagerService();
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.DataManagerService = DataManagerService;
window.getDataManagerService = getDataManagerService;

console.log('📊 Local Data Manager Service module loaded successfully');