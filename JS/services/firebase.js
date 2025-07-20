/* 
===========================================
SCOUTPLUSE - FIREBASE SERVICE
===========================================

خدمة Firebase لإدارة البيانات في الوقت الفعلي
تحل محل نظام PHP السابق
*/

/**
 * Firebase Service Class
 * إدارة جميع عمليات Firebase
 */
class FirebaseService {
    constructor() {
        this.app = null;
        this.database = null;
        this.analytics = null;
        this.isInitialized = false;
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    /**
     * تهيئة Firebase
     */
    async init() {
        console.log('🔥 Initializing Firebase Service...');
        
        try {
            // تكوين Firebase
            const firebaseConfig = {
                apiKey: "AIzaSyCmRC2JPD_nR1kHKU3ksuH6OfnFJutO5_I",
                authDomain: "tamouz-webapp.firebaseapp.com",
                databaseURL: "https://tamouz-webapp-default-rtdb.firebaseio.com",
                projectId: "tamouz-webapp",
                storageBucket: "tamouz-webapp.firebasestorage.app",
                messagingSenderId: "959471265726",
                appId: "1:959471265726:web:faf9d1a7e645d92354fbef",
                measurementId: "G-7WGDJ5B2P5"
            };

            // تحميل Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js');
            const { getDatabase, ref, set, get, push, remove, onValue, off } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js');
            const { getAnalytics } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js');

            // تهيئة Firebase
            this.app = initializeApp(firebaseConfig);
            this.database = getDatabase(this.app);
            this.analytics = getAnalytics(this.app);

            // حفظ Firebase functions للاستخدام لاحقاً
            this.firebaseFunctions = {
                ref, set, get, push, remove, onValue, off
            };

            this.isInitialized = true;
            this.setupNetworkMonitoring();
            
            console.log('✅ Firebase Service initialized successfully');
            
            // إرسال حدث التهيئة
            this.dispatchEvent('firebaseInitialized', { success: true });
            
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            this.dispatchEvent('firebaseInitialized', { success: false, error: error.message });
            throw error;
        }
    }

    /**
     * مراقبة حالة الشبكة
     */
    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Firebase: Network connection restored');
            this.dispatchEvent('networkStatusChanged', { status: 'online' });
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📡 Firebase: Network connection lost');
            this.dispatchEvent('networkStatusChanged', { status: 'offline' });
        });
    }

    /**
     * قراءة جميع الأحداث
     */
    async readEvents() {
        console.log('📥 Reading events from Firebase...');
        
        if (!this.isInitialized) {
            throw new Error('Firebase not initialized');
        }

        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }

        try {
            const { ref, get } = this.firebaseFunctions;
            const eventsRef = ref(this.database, 'events');
            const snapshot = await get(eventsRef);
            
            if (snapshot.exists()) {
                const eventsData = snapshot.val();
                
                // تحويل البيانات إلى مصفوفة
                const events = Object.keys(eventsData).map(key => ({
                    id: key,
                    ...eventsData[key]
                }));

                console.log(`✅ Successfully loaded ${events.length} events from Firebase`);
                
                const result = {
                    events: events,
                    totalEvents: events.length,
                    lastUpdated: new Date().toISOString()
                };

                // إرسال حدث تحميل البيانات
                this.dispatchEvent('eventsLoaded', result);
                
                return result;
            } else {
                console.log('📋 No events found in Firebase');
                
                const result = {
                    events: [],
                    totalEvents: 0,
                    lastUpdated: new Date().toISOString()
                };

                this.dispatchEvent('eventsLoaded', result);
                return result;
            }
            
        } catch (error) {
            console.error('❌ Error reading events from Firebase:', error);
            this.dispatchEvent('eventsLoadError', { error: error.message });
            throw new Error(`Failed to load events: ${error.message}`);
        }
    }

    /**
     * كتابة/تحديث جميع الأحداث
     */
    async writeEvents(eventsArray) {
        console.log('📤 Writing events to Firebase...');
        console.log(`📊 Events to save: ${eventsArray.length}`);
        
        if (!this.isInitialized) {
            throw new Error('Firebase not initialized');
        }

        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }

        try {
            const { ref, set } = this.firebaseFunctions;
            
            // تحويل المصفوفة إلى كائن بمعرفات فريدة
            const eventsObject = {};
            eventsArray.forEach(event => {
                const eventId = event.id || this.generateEventId();
                eventsObject[eventId] = {
                    ...event,
                    id: eventId,
                    updatedAt: new Date().toISOString()
                };
            });

            // حفظ البيانات في Firebase
            const eventsRef = ref(this.database, 'events');
            await set(eventsRef, eventsObject);

            // حفظ metadata
            const metadataRef = ref(this.database, 'metadata');
            await set(metadataRef, {
                lastUpdated: new Date().toISOString(),
                totalEvents: eventsArray.length,
                version: '1.0.0'
            });

            console.log(`✅ Successfully saved ${eventsArray.length} events to Firebase`);
            
            const result = {
                totalEvents: eventsArray.length,
                lastUpdated: new Date().toISOString(),
                operation: 'update'
            };

            // إرسال حدث حفظ البيانات
            this.dispatchEvent('eventsSaved', result);
            
            return result;

        } catch (error) {
            console.error('❌ Error writing events to Firebase:', error);
            this.dispatchEvent('eventsSaveError', { error: error.message });
            throw new Error(`Failed to save events: ${error.message}`);
        }
    }

    /**
     * إضافة حدث جديد
     */
    async addEvent(eventData) {
        console.log('➕ Adding new event to Firebase...');
        
        if (!this.isInitialized) {
            throw new Error('Firebase not initialized');
        }

        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }

        try {
            const { ref, push, set } = this.firebaseFunctions;
            
            // إعداد بيانات الحدث
            const newEvent = {
                ...eventData,
                id: this.generateEventId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // إضافة الحدث إلى Firebase
            const eventsRef = ref(this.database, `events/${newEvent.id}`);
            await set(eventsRef, newEvent);

            // تحديث metadata
            await this.updateMetadata();

            console.log(`✅ Successfully added event: ${newEvent.title}`);
            
            const result = {
                event: newEvent,
                operation: 'add',
                timestamp: new Date().toISOString()
            };

            // إرسال حدث إضافة الحدث
            this.dispatchEvent('eventAdded', result);
            
            return result;

        } catch (error) {
            console.error('❌ Error adding event to Firebase:', error);
            this.dispatchEvent('eventAddError', { error: error.message });
            throw new Error(`Failed to add event: ${error.message}`);
        }
    }

    /**
     * تحديث حدث موجود
     */
    async updateEvent(eventId, eventData) {
        console.log(`📝 Updating event ${eventId} in Firebase...`);
        
        if (!this.isInitialized) {
            throw new Error('Firebase not initialized');
        }

        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }

        try {
            const { ref, set } = this.firebaseFunctions;
            
            // تحديث بيانات الحدث
            const updatedEvent = {
                ...eventData,
                id: eventId,
                updatedAt: new Date().toISOString()
            };

            // تحديث الحدث في Firebase
            const eventRef = ref(this.database, `events/${eventId}`);
            await set(eventRef, updatedEvent);

            console.log(`✅ Successfully updated event: ${eventId}`);
            
            const result = {
                event: updatedEvent,
                operation: 'update',
                timestamp: new Date().toISOString()
            };

            // إرسال حدث تحديث الحدث
            this.dispatchEvent('eventUpdated', result);
            
            return result;

        } catch (error) {
            console.error('❌ Error updating event in Firebase:', error);
            this.dispatchEvent('eventUpdateError', { error: error.message });
            throw new Error(`Failed to update event: ${error.message}`);
        }
    }

    /**
     * حذف حدث
     */
    async deleteEvent(eventId) {
        console.log(`🗑️ Deleting event ${eventId} from Firebase...`);
        
        if (!this.isInitialized) {
            throw new Error('Firebase not initialized');
        }

        if (!this.isOnline) {
            throw new Error('No internet connection available');
        }

        try {
            const { ref, remove } = this.firebaseFunctions;
            
            // حذف الحدث من Firebase
            const eventRef = ref(this.database, `events/${eventId}`);
            await remove(eventRef);

            // تحديث metadata
            await this.updateMetadata();

            console.log(`✅ Successfully deleted event: ${eventId}`);
            
            const result = {
                eventId: eventId,
                operation: 'delete',
                timestamp: new Date().toISOString()
            };

            // إرسال حدث حذف الحدث
            this.dispatchEvent('eventDeleted', result);
            
            return result;

        } catch (error) {
            console.error('❌ Error deleting event from Firebase:', error);
            this.dispatchEvent('eventDeleteError', { error: error.message });
            throw new Error(`Failed to delete event: ${error.message}`);
        }
    }

    /**
     * الاستماع للتغييرات في الوقت الفعلي
     */
    subscribeToEvents(callback) {
        console.log('👂 Subscribing to real-time events updates...');
        
        if (!this.isInitialized) {
            console.warn('⚠️ Firebase not initialized, cannot subscribe');
            return null;
        }

        try {
            const { ref, onValue } = this.firebaseFunctions;
            const eventsRef = ref(this.database, 'events');
            
            const unsubscribe = onValue(eventsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const eventsData = snapshot.val();
                    const events = Object.keys(eventsData).map(key => ({
                        id: key,
                        ...eventsData[key]
                    }));

                    console.log(`🔄 Real-time update: ${events.length} events`);
                    
                    if (callback) {
                        callback(events);
                    }

                    // إرسال حدث التحديث في الوقت الفعلي
                    this.dispatchEvent('eventsRealTimeUpdate', { events });
                } else {
                    console.log('📋 Real-time update: No events');
                    if (callback) {
                        callback([]);
                    }
                    this.dispatchEvent('eventsRealTimeUpdate', { events: [] });
                }
            });

            console.log('✅ Successfully subscribed to real-time updates');
            return unsubscribe;

        } catch (error) {
            console.error('❌ Error subscribing to events:', error);
            return null;
        }
    }

    /**
     * إلغاء الاشتراك في التحديثات
     */
    unsubscribeFromEvents(unsubscribeFunction) {
        if (unsubscribeFunction) {
            unsubscribeFunction();
            console.log('🔇 Unsubscribed from real-time updates');
        }
    }

    /**
     * تحديث metadata
     */
    async updateMetadata() {
        try {
            const { ref, get, set } = this.firebaseFunctions;
            
            // قراءة عدد الأحداث الحالي
            const eventsRef = ref(this.database, 'events');
            const snapshot = await get(eventsRef);
            const totalEvents = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;

            // تحديث metadata
            const metadataRef = ref(this.database, 'metadata');
            await set(metadataRef, {
                lastUpdated: new Date().toISOString(),
                totalEvents: totalEvents,
                version: '1.0.0'
            });

            console.log(`📊 Metadata updated: ${totalEvents} events`);

        } catch (error) {
            console.warn('⚠️ Failed to update metadata:', error);
        }
    }

    /**
     * اختبار الاتصال
     */
    async testConnection() {
        console.log('🔍 Testing Firebase connection...');
        
        try {
            if (!this.isInitialized) {
                throw new Error('Firebase not initialized');
            }

            // اختبار قراءة بسيطة
            const data = await this.readEvents();
            
            const result = {
                success: true,
                message: 'Firebase connection successful',
                eventsCount: data.totalEvents || 0,
                timestamp: new Date().toISOString(),
                service: 'Firebase Realtime Database'
            };

            console.log('✅ Firebase connection test successful');
            this.dispatchEvent('connectionTested', result);
            
            return result;

        } catch (error) {
            console.error('❌ Firebase connection test failed:', error);
            
            const result = {
                success: false,
                message: error.message,
                timestamp: new Date().toISOString(),
                service: 'Firebase Realtime Database'
            };

            this.dispatchEvent('connectionTested', result);
            return result;
        }
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
        window.dispatchEvent(new CustomEvent(`firebase${eventType}`, {
            detail: { ...data, timestamp: new Date().toISOString() }
        }));
    }

    /**
     * الحصول على معلومات Firebase
     */
    getFirebaseInfo() {
        return {
            isInitialized: this.isInitialized,
            isOnline: this.isOnline,
            databaseURL: 'https://tamouz-webapp-default-rtdb.firebaseio.com',
            projectId: 'tamouz-webapp',
            lastCheck: new Date().toISOString()
        };
    }

    /**
     * التحقق من توفر Firebase
     */
    isAvailable() {
        return this.isInitialized && this.isOnline;
    }

    /**
     * الحصول على حالة الاتصال
     */
    getConnectionStatus() {
        return {
            isOnline: this.isOnline,
            isInitialized: this.isInitialized,
            isConfigured: this.isInitialized,
            service: 'Firebase',
            lastUpdate: new Date().toISOString()
        };
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let firebaseServiceInstance = null;

/**
 * Get Firebase Service Instance
 * @returns {FirebaseService} Firebase service instance
 */
function getFirebaseService() {
    if (!firebaseServiceInstance) {
        firebaseServiceInstance = new FirebaseService();
    }
    return firebaseServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔥 Initializing Firebase Service...');
    window.firebaseService = getFirebaseService();
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.FirebaseService = FirebaseService;
window.getFirebaseService = getFirebaseService;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FirebaseService, getFirebaseService };
}

console.log('🔥 Firebase Service module loaded successfully');