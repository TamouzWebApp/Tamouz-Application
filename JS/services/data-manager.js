/* 
===========================================
SCOUTPLUSE - DATA MANAGER SERVICE
===========================================

خدمة إدارة البيانات الموحدة
تدير التبديل بين Firebase و PHP API
*/

/**
 * Data Manager Service Class
 * يدير مصادر البيانات المختلفة ويوفر واجهة موحدة
 */
class DataManagerService {
    constructor() {
        this.currentProvider = null;
        this.firebaseService = null;
        this.apiService = null;
        this.isInitialized = false;
        this.realtimeSubscription = null;
        
        this.init();
    }

    /**
     * تهيئة مدير البيانات
     */
    async init() {
        console.log('📊 Initializing Data Manager Service...');
        
        try {
            // تحديد نوع قاعدة البيانات
            const databaseType = window.getDatabaseType();
            console.log(`📊 Database type: ${databaseType}`);
            
            if (databaseType === 'firebase') {
                await this.initializeFirebase();
            } else {
                await this.initializeAPI();
            }
            
            this.setupEventListeners();
            this.isInitialized = true;
            
            console.log(`✅ Data Manager initialized with ${this.currentProvider}`);
            
        } catch (error) {
            console.error('❌ Data Manager initialization failed:', error);
            // التراجع إلى البيانات التجريبية
            this.currentProvider = 'demo';
            this.isInitialized = true;
            console.log('📋 Falling back to demo data');
        }
    }

    /**
     * تهيئة Firebase
     */
    async initializeFirebase() {
        console.log('🔥 Initializing Firebase provider...');
        
        if (window.FirebaseService) {
            this.firebaseService = window.getFirebaseService();
            await this.waitForFirebaseInit();
            this.currentProvider = 'firebase';
            console.log('✅ Firebase provider ready');
        } else {
            throw new Error('Firebase service not available');
        }
    }

    /**
     * تهيئة API
     */
    async initializeAPI() {
        console.log('🔗 Initializing API provider...');
        
        if (window.APIService) {
            this.apiService = window.getAPIService();
            this.currentProvider = 'api';
            console.log('✅ API provider ready');
        } else {
            throw new Error('API service not available');
        }
    }

    /**
     * انتظار تهيئة Firebase
     */
    async waitForFirebaseInit() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Firebase initialization timeout'));
            }, 10000);

            const checkInit = () => {
                if (this.firebaseService && this.firebaseService.isInitialized) {
                    clearTimeout(timeout);
                    resolve();
                } else {
                    setTimeout(checkInit, 100);
                }
            };

            checkInit();
        });
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // الاستماع لتغييرات الشبكة
        window.addEventListener('online', () => {
            console.log('🌐 Data Manager: Network restored');
            this.handleNetworkChange(true);
        });

        window.addEventListener('offline', () => {
            console.log('📡 Data Manager: Network lost');
            this.handleNetworkChange(false);
        });

        // الاستماع لأحداث Firebase
        if (this.currentProvider === 'firebase') {
            window.addEventListener('firebaseeventsRealTimeUpdate', (e) => {
                console.log('🔄 Real-time events update received');
                this.dispatchEvent('eventsLoaded', e.detail);
            });
        }
    }

    /**
     * معالجة تغيير حالة الشبكة
     */
    handleNetworkChange(isOnline) {
        if (isOnline && this.currentProvider === 'firebase') {
            // إعادة تفعيل التحديثات في الوقت الفعلي
            this.enableRealTimeUpdates();
        }
    }

    /**
     * قراءة الأحداث
     */
    async readEvents() {
        console.log(`📥 Reading events using ${this.currentProvider} provider...`);
        
        try {
            let result;
            
            switch (this.currentProvider) {
                case 'firebase':
                    result = await this.firebaseService.readEvents();
                    break;
                    
                case 'api':
                    result = await this.apiService.readEvents();
                    break;
                    
                case 'demo':
                default:
                    result = this.getDemoData();
                    break;
            }
            
            console.log(`✅ Successfully loaded ${result.totalEvents} events`);
            this.dispatchEvent('eventsLoaded', result);
            
            return result;
            
        } catch (error) {
            console.error(`❌ Error reading events with ${this.currentProvider}:`, error);
            
            // محاولة التراجع إلى مصدر آخر
            if (this.currentProvider !== 'demo') {
                console.log('🔄 Falling back to demo data...');
                const demoResult = this.getDemoData();
                this.dispatchEvent('eventsLoaded', demoResult);
                return demoResult;
            }
            
            throw error;
        }
    }

    /**
     * كتابة الأحداث
     */
    async writeEvents(eventsArray) {
        console.log(`📤 Writing events using ${this.currentProvider} provider...`);
        
        try {
            let result;
            
            switch (this.currentProvider) {
                case 'firebase':
                    result = await this.firebaseService.writeEvents(eventsArray);
                    break;
                    
                case 'api':
                    result = await this.apiService.writeEvents(eventsArray);
                    break;
                    
                case 'demo':
                default:
                    // حفظ في localStorage للبيانات التجريبية
                    localStorage.setItem('scoutpluse_demo_events', JSON.stringify(eventsArray));
                    result = {
                        totalEvents: eventsArray.length,
                        lastUpdated: new Date().toISOString(),
                        operation: 'demo_save'
                    };
                    break;
            }
            
            console.log(`✅ Successfully saved ${result.totalEvents} events`);
            this.dispatchEvent('eventsSaved', result);
            
            return result;
            
        } catch (error) {
            console.error(`❌ Error writing events with ${this.currentProvider}:`, error);
            this.dispatchEvent('eventsSaveError', { error: error.message });
            throw error;
        }
    }

    /**
     * إضافة حدث جديد
     */
    async addEvent(eventData) {
        console.log(`➕ Adding event using ${this.currentProvider} provider...`);
        
        try {
            let result;
            
            switch (this.currentProvider) {
                case 'firebase':
                    result = await this.firebaseService.addEvent(eventData);
                    break;
                    
                case 'api':
                    result = await this.apiService.addEvent(eventData);
                    break;
                    
                case 'demo':
                default:
                    // إضافة للبيانات التجريبية
                    const demoEvents = this.getDemoEventsArray();
                    const newEvent = {
                        ...eventData,
                        id: this.generateEventId(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    demoEvents.unshift(newEvent);
                    localStorage.setItem('scoutpluse_demo_events', JSON.stringify(demoEvents));
                    
                    result = {
                        event: newEvent,
                        operation: 'demo_add',
                        timestamp: new Date().toISOString()
                    };
                    break;
            }
            
            console.log(`✅ Successfully added event: ${eventData.title}`);
            this.dispatchEvent('eventAdded', result);
            
            return result;
            
        } catch (error) {
            console.error(`❌ Error adding event with ${this.currentProvider}:`, error);
            this.dispatchEvent('eventAddError', { error: error.message });
            throw error;
        }
    }

    /**
     * حذف حدث
     */
    async deleteEvent(eventId) {
        console.log(`🗑️ Deleting event using ${this.currentProvider} provider...`);
        
        try {
            let result;
            
            switch (this.currentProvider) {
                case 'firebase':
                    result = await this.firebaseService.deleteEvent(eventId);
                    break;
                    
                case 'api':
                    result = await this.apiService.deleteEvent(eventId);
                    break;
                    
                case 'demo':
                default:
                    // حذف من البيانات التجريبية
                    const demoEvents = this.getDemoEventsArray();
                    const filteredEvents = demoEvents.filter(event => event.id !== eventId);
                    localStorage.setItem('scoutpluse_demo_events', JSON.stringify(filteredEvents));
                    
                    result = {
                        eventId: eventId,
                        operation: 'demo_delete',
                        timestamp: new Date().toISOString()
                    };
                    break;
            }
            
            console.log(`✅ Successfully deleted event: ${eventId}`);
            this.dispatchEvent('eventDeleted', result);
            
            return result;
            
        } catch (error) {
            console.error(`❌ Error deleting event with ${this.currentProvider}:`, error);
            this.dispatchEvent('eventDeleteError', { error: error.message });
            throw error;
        }
    }

    /**
     * تفعيل التحديثات في الوقت الفعلي
     */
    enableRealTimeUpdates() {
        if (this.currentProvider === 'firebase' && this.firebaseService) {
            console.log('👂 Enabling real-time updates...');
            
            this.realtimeSubscription = this.firebaseService.subscribeToEvents((events) => {
                console.log(`🔄 Real-time update: ${events.length} events`);
                this.dispatchEvent('eventsRealTimeUpdate', { events });
            });
            
            console.log('✅ Real-time updates enabled');
        }
    }

    /**
     * إيقاف التحديثات في الوقت الفعلي
     */
    disableRealTimeUpdates() {
        if (this.realtimeSubscription) {
            console.log('🔇 Disabling real-time updates...');
            
            if (this.currentProvider === 'firebase' && this.firebaseService) {
                this.firebaseService.unsubscribeFromEvents(this.realtimeSubscription);
            }
            
            this.realtimeSubscription = null;
            console.log('✅ Real-time updates disabled');
        }
    }

    /**
     * اختبار الاتصال
     */
    async testConnection() {
        console.log(`🔍 Testing connection with ${this.currentProvider} provider...`);
        
        try {
            let result;
            
            switch (this.currentProvider) {
                case 'firebase':
                    result = await this.firebaseService.testConnection();
                    break;
                    
                case 'api':
                    result = await this.apiService.testConnection();
                    break;
                    
                case 'demo':
                default:
                    result = {
                        success: true,
                        message: 'Demo data connection successful',
                        eventsCount: this.getDemoEventsArray().length,
                        timestamp: new Date().toISOString(),
                        service: 'Demo Data'
                    };
                    break;
            }
            
            console.log(`✅ Connection test successful with ${this.currentProvider}`);
            this.dispatchEvent('connectionTested', result);
            
            return result;
            
        } catch (error) {
            console.error(`❌ Connection test failed with ${this.currentProvider}:`, error);
            
            const result = {
                success: false,
                message: error.message,
                timestamp: new Date().toISOString(),
                service: this.currentProvider
            };
            
            this.dispatchEvent('connectionTested', result);
            return result;
        }
    }

    /**
     * الحصول على البيانات التجريبية
     */
    getDemoData() {
        const events = this.getDemoEventsArray();
        return {
            events: events,
            totalEvents: events.length,
            lastUpdated: new Date().toISOString(),
            source: 'demo'
        };
    }

    /**
     * الحصول على مصفوفة الأحداث التجريبية
     */
    getDemoEventsArray() {
        // محاولة قراءة من localStorage أولاً
        const stored = localStorage.getItem('scoutpluse_demo_events');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.warn('⚠️ Failed to parse stored demo events');
            }
        }
        
        // التراجع إلى البيانات التجريبية الافتراضية
        return [...(window.DEMO_EVENTS || [])];
    }

    /**
     * توليد معرف حدث فريد
     */
    generateEventId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
            hasRealTimeUpdates: !!this.realtimeSubscription,
            firebaseAvailable: !!this.firebaseService,
            apiAvailable: !!this.apiService,
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * تبديل مزود البيانات
     */
    async switchProvider(newProvider) {
        console.log(`🔄 Switching data provider from ${this.currentProvider} to ${newProvider}`);
        
        try {
            // إيقاف التحديثات الحالية
            this.disableRealTimeUpdates();
            
            // تبديل المزود
            const oldProvider = this.currentProvider;
            
            if (newProvider === 'firebase') {
                await this.initializeFirebase();
            } else if (newProvider === 'api') {
                await this.initializeAPI();
            } else {
                this.currentProvider = 'demo';
            }
            
            console.log(`✅ Successfully switched from ${oldProvider} to ${this.currentProvider}`);
            
            // إرسال حدث التبديل
            this.dispatchEvent('providerSwitched', {
                oldProvider,
                newProvider: this.currentProvider
            });
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to switch provider:', error);
            return false;
        }
    }

    /**
     * الحصول على حالة الاتصال
     */
    getConnectionStatus() {
        const baseStatus = {
            provider: this.currentProvider,
            isInitialized: this.isInitialized,
            lastUpdate: new Date().toISOString()
        };

        switch (this.currentProvider) {
            case 'firebase':
                return {
                    ...baseStatus,
                    ...this.firebaseService?.getConnectionStatus()
                };
                
            case 'api':
                return {
                    ...baseStatus,
                    ...this.apiService?.getConnectionStatus()
                };
                
            default:
                return {
                    ...baseStatus,
                    isOnline: true,
                    isConfigured: true,
                    service: 'Demo Data'
                };
        }
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
    console.log('📊 Initializing Data Manager Service...');
    window.dataManagerService = getDataManagerService();
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.DataManagerService = DataManagerService;
window.getDataManagerService = getDataManagerService;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataManagerService, getDataManagerService };
}

console.log('📊 Data Manager Service module loaded successfully');