/* 
===========================================
SCOUTPLUSE - LOCAL STORAGE SERVICE
===========================================

خدمة التخزين المحلي لإدارة البيانات بدون خادم
*/

/**
 * Local Storage Service Class
 * يدير حفظ وقراءة البيانات محلياً
 */
class LocalStorageService {
    constructor() {
        this.storagePrefix = 'scoutpluse_';
        this.eventsKey = this.storagePrefix + 'events';
        this.usersKey = this.storagePrefix + 'users';
        this.settingsKey = this.storagePrefix + 'settings';
        
        this.init();
    }

    /**
     * تهيئة الخدمة
     */
    init() {
        console.log('💾 Initializing Local Storage Service...');
        
        // تحميل البيانات الأولية إذا لم تكن موجودة
        this.initializeDefaultData();
        
        console.log('✅ Local Storage Service initialized');
    }

    /**
     * تهيئة البيانات الافتراضية
     */
    async initializeDefaultData() {
        // تحقق من وجود الأحداث في localStorage
        const existingEvents = this.getEvents();
        if (!existingEvents || existingEvents.length === 0) {
            console.log('📥 Loading initial events from JSON file...');
            await this.loadInitialEvents();
        } else {
            console.log(`📋 Found ${existingEvents.length} existing events in localStorage`);
            
            // إرسال حدث تحديث البيانات حتى لو كانت البيانات موجودة
            window.dispatchEvent(new CustomEvent('localStorageeventsUpdated', {
                detail: { events: existingEvents, source: 'localStorage' }
            }));
        }
        
        // تحقق من وجود المستخدمين
        const existingUsers = this.getUsers();
        if (!existingUsers || Object.keys(existingUsers).length === 0) {
            console.log('👥 Loading initial users from demo data...');
            await this.loadInitialUsers();
        } else {
            console.log(`👥 Found ${Object.keys(existingUsers).length} existing users in localStorage`);
        }
    }

    /**
     * Load initial events from JSON file
     */
    async loadInitialEvents() {
        try {
            const eventsFilePath = window.getEventsFilePath() || 'https://tamouzwebapp.github.io/Tamouz-Application/JSON/events.json';
            const response = await fetch(`${eventsFilePath}?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                const events = data.events || [];
                this.saveEvents(events);
                console.log(`✅ Loaded ${data.events.length} initial events`);
                
                // إرسال إشعار للمستخدم
                if (window.EventsService?.getInstance) {
                    setTimeout(() => {
                        const eventsService = window.EventsService.getInstance();
                        eventsService.showNotification(`تم تحميل ${data.events.length} حدث من ملف JSON`, 'success');
                    }, 1000);
                }
            } else {
                throw new Error('Failed to load JSON/events.json');
            }
        } catch (error) {
            console.error('❌ Failed to load JSON/events.json:', error);
            console.log('🔄 Using empty events array - please check JSON/events.json file');
            
            // استخدام بيانات تجريبية
            const demoEvents = [
                {
                    id: "demo_1",
                    title: "رحلة تخييم نهاية الأسبوع",
                    description: "مغامرة تخييم لثلاثة أيام مع أنشطة المشي والنار. تعلم مهارات البقاء في الهواء الطلق واستمتع بالطبيعة.",
                    date: "2025-01-20",
                    time: "09:00",
                    location: "موقع التخييم الجبلي",
                    attendees: [],
                    maxAttendees: 25,
                    category: "ramita",
                    image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                    status: "upcoming",
                    troop: "Troop 101",
                    createdBy: "1",
                    createdAt: "2025-01-15T10:00:00Z",
                    updatedAt: "2025-01-15T10:00:00Z"
                },
                {
                    id: "demo_2",
                    title: "مشروع خدمة المجتمع",
                    description: "ساعد في تنظيف الحديقة المحلية وزراعة أشجار جديدة. اصنع تأثيراً إيجابياً في مجتمعنا.",
                    date: "2025-01-25",
                    time: "14:00",
                    location: "الحديقة المركزية",
                    attendees: [],
                    maxAttendees: 20,
                    category: "ma3lola",
                    image: "https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                    status: "upcoming",
                    troop: "Troop 101",
                    createdBy: "2",
                    createdAt: "2025-01-14T15:30:00Z",
                    updatedAt: "2025-01-14T15:30:00Z"
                },
                {
                    id: "demo_3",
                    title: "ورشة الإسعافات الأولية",
                    description: "تعلم مهارات الإسعافات الأولية الأساسية. مدربون معتمدون سيرشدونك خلال التمارين العملية.",
                    date: "2025-01-28",
                    time: "10:00",
                    location: "قاعة الكشافة",
                    attendees: [],
                    maxAttendees: 15,
                    category: "sergila",
                    image: "https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                    status: "upcoming",
                    troop: "Troop 101",
                    createdBy: "1",
                    createdAt: "2025-01-13T09:15:00Z",
                    updatedAt: "2025-01-13T09:15:00Z"
                }
            ];
            
            this.saveEvents(demoEvents);
            
            // إرسال إشعار خطأ للمستخدم
            if (window.EventsService?.getInstance) {
                setTimeout(() => {
                    const eventsService = window.EventsService.getInstance();
                    eventsService.showNotification('تم تحميل البيانات التجريبية - تحقق من JSON/events.json', 'warning');
                }, 1000);
            }
        }
    }

    /**
     * Load initial users
     */
    async loadInitialUsers() {
        try {
            const usersFilePath = window.getUsersFilePath() || 'https://tamouzwebapp.github.io/Tamouz-Application/JSON/users.json';
            const response = await fetch(usersFilePath);
            if (response.ok) {
                const data = await response.json();
                const usersObject = {};
                data.users.forEach(user => {
                    usersObject[user.email] = user;
                });
                this.saveUsers(usersObject);
                console.log(`✅ Loaded ${data.users.length} initial users`);
            } else {
                throw new Error('Failed to load JSON/users.json');
            }
        } catch (error) {
            console.error('❌ Failed to load JSON/users.json:', error);
            console.log('🔄 Using empty users object - please check JSON/users.json file');
            this.saveUsers({});
        }
    }

    /**
     * حفظ الأحداث
     */
    saveEvents(events) {
        // تحقق من صحة البيانات
        if (!Array.isArray(events)) {
            console.error('❌ Events must be an array');
            return false;
        }
        
        try {
            const data = {
                events: events,
                lastUpdated: new Date().toISOString(),
                totalEvents: events.length
            };
            
            localStorage.setItem(this.eventsKey, JSON.stringify(data));
            console.log(`💾 Saved ${events.length} events to localStorage`);
            
            // إرسال حدث التحديث
            window.dispatchEvent(new CustomEvent('localStorageeventsUpdated', {
                detail: { events, source: 'localStorage' }
            }));
            
            return true;
        } catch (error) {
            console.error('❌ Failed to save events:', error);
            return false;
        }
    }

    /**
     * قراءة الأحداث
     */
    getEvents() {
        try {
            const stored = localStorage.getItem(this.eventsKey);
            if (stored) {
                const data = JSON.parse(stored);
                const events = data.events || [];
                console.log(`📋 Retrieved ${events.length} events from localStorage`);
                return events;
            }
            console.log('📋 No events found in localStorage');
            return [];
        } catch (error) {
            console.error('❌ Failed to load events:', error);
            return [];
        }
    }

    /**
     * إضافة حدث جديد
     */
    addEvent(eventData) {
        const events = this.getEvents();
        
        const newEvent = {
            ...eventData,
            id: this.generateEventId(),
            attendees: [],
            status: 'upcoming',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        events.unshift(newEvent);
        
        if (this.saveEvents(events)) {
            console.log(`✅ Added new event: ${newEvent.title}`);
            return newEvent;
        } else {
            throw new Error('Failed to save new event');
        }
    }

    /**
     * تحديث حدث
     */
    updateEvent(eventId, updates) {
        const events = this.getEvents();
        const eventIndex = events.findIndex(event => event.id === eventId);
        
        if (eventIndex === -1) {
            throw new Error('Event not found');
        }
        
        events[eventIndex] = {
            ...events[eventIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        if (this.saveEvents(events)) {
            console.log(`✅ Updated event: ${eventId}`);
            return events[eventIndex];
        } else {
            throw new Error('Failed to update event');
        }
    }

    /**
     * حذف حدث
     */
    deleteEvent(eventId) {
        const events = this.getEvents();
        const filteredEvents = events.filter(event => event.id !== eventId);
        
        if (filteredEvents.length === events.length) {
            throw new Error('Event not found');
        }
        
        if (this.saveEvents(filteredEvents)) {
            console.log(`✅ Deleted event: ${eventId}`);
            return true;
        } else {
            throw new Error('Failed to delete event');
        }
    }

    /**
     * الانضمام لحدث
     */
    joinEvent(eventId, userId) {
        const events = this.getEvents();
        const event = events.find(e => e.id === eventId);
        
        if (!event) {
            throw new Error('Event not found');
        }
        
        if (event.attendees.includes(userId)) {
            throw new Error('User already joined this event');
        }
        
        if (event.attendees.length >= event.maxAttendees) {
            throw new Error('Event is full');
        }
        
        event.attendees.push(userId);
        event.updatedAt = new Date().toISOString();
        
        if (this.saveEvents(events)) {
            console.log(`✅ User ${userId} joined event: ${eventId}`);
            return event;
        } else {
            throw new Error('Failed to join event');
        }
    }

    /**
     * مغادرة حدث
     */
    leaveEvent(eventId, userId) {
        const events = this.getEvents();
        const event = events.find(e => e.id === eventId);
        
        if (!event) {
            throw new Error('Event not found');
        }
        
        const attendeeIndex = event.attendees.indexOf(userId);
        if (attendeeIndex === -1) {
            throw new Error('User not joined to this event');
        }
        
        event.attendees.splice(attendeeIndex, 1);
        event.updatedAt = new Date().toISOString();
        
        if (this.saveEvents(events)) {
            console.log(`✅ User ${userId} left event: ${eventId}`);
            return event;
        } else {
            throw new Error('Failed to leave event');
        }
    }

    /**
     * حفظ المستخدمين
     */
    saveUsers(users) {
        try {
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            console.log(`💾 Saved ${Object.keys(users).length} users to localStorage`);
            return true;
        } catch (error) {
            console.error('❌ Failed to save users:', error);
            return false;
        }
    }

    /**
     * قراءة المستخدمين
     */
    getUsers() {
        try {
            const stored = localStorage.getItem(this.usersKey);
            if (stored) {
                return JSON.parse(stored);
            }
            return {};
        } catch (error) {
            console.error('❌ Failed to load users:', error);
            return {};
        }
    }

    /**
     * حفظ الإعدادات
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            console.log('💾 Settings saved to localStorage');
            return true;
        } catch (error) {
            console.error('❌ Failed to save settings:', error);
            return false;
        }
    }

    /**
     * قراءة الإعدادات
     */
    getSettings() {
        try {
            const stored = localStorage.getItem(this.settingsKey);
            if (stored) {
                return JSON.parse(stored);
            }
            return {};
        } catch (error) {
            console.error('❌ Failed to load settings:', error);
            return {};
        }
    }

    /**
     * مسح جميع البيانات
     */
    clearAllData() {
        try {
            localStorage.removeItem(this.eventsKey);
            localStorage.removeItem(this.usersKey);
            localStorage.removeItem(this.settingsKey);
            console.log('🗑️ All local data cleared');
            return true;
        } catch (error) {
            console.error('❌ Failed to clear data:', error);
            return false;
        }
    }

    /**
     * تصدير البيانات
     */
    exportData() {
        const data = {
            events: this.getEvents(),
            users: this.getUsers(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        return data;
    }

    /**
     * استيراد البيانات
     */
    importData(data) {
        try {
            if (data.events) {
                this.saveEvents(data.events);
            }
            if (data.users) {
                this.saveUsers(data.users);
            }
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            
            console.log('✅ Data imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to import data:', error);
            return false;
        }
    }

    /**
     * توليد معرف حدث فريد
     */
    generateEventId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * الحصول على إحصائيات التخزين
     */
    getStorageStats() {
        const events = this.getEvents();
        const users = this.getUsers();
        const settings = this.getSettings();
        
        return {
            totalEvents: events.length,
            totalUsers: Object.keys(users).length,
            hasSettings: Object.keys(settings).length > 0,
            storageUsed: this.calculateStorageUsage(),
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * حساب استخدام التخزين
     */
    calculateStorageUsage() {
        let totalSize = 0;
        
        for (let key in localStorage) {
            if (key.startsWith(this.storagePrefix)) {
                totalSize += localStorage[key].length;
            }
        }
        
        return {
            bytes: totalSize,
            kb: Math.round(totalSize / 1024 * 100) / 100,
            mb: Math.round(totalSize / (1024 * 1024) * 100) / 100
        };
    }

    /**
     * اختبار التخزين المحلي
     */
    testStorage() {
        try {
            const testKey = this.storagePrefix + 'test';
            const testData = { test: true, timestamp: Date.now() };
            
            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            localStorage.removeItem(testKey);
            
            return {
                success: retrieved.test === true,
                message: 'Local storage is working properly',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let localStorageServiceInstance = null;

/**
 * Get Local Storage Service Instance
 * @returns {LocalStorageService} Local storage service instance
 */
function getLocalStorageService() {
    if (!localStorageServiceInstance) {
        localStorageServiceInstance = new LocalStorageService();
    }
    return localStorageServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('💾 Initializing Local Storage Service...');
    window.localStorageService = getLocalStorageService();
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.LocalStorageService = LocalStorageService;
window.getLocalStorageService = getLocalStorageService;

console.log('💾 Local Storage Service module loaded');