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
        }
        
        // تحقق من وجود المستخدمين
        const existingUsers = this.getUsers();
        if (!existingUsers || Object.keys(existingUsers).length === 0) {
            console.log('👥 Loading initial users from demo data...');
            this.loadInitialUsers();
        }
    }

    /**
     * تحميل الأحداث الأولية من ملف JSON
     */
    async loadInitialEvents() {
        try {
            const response = await fetch('../JSON/events.json');
            if (response.ok) {
                const data = await response.json();
                this.saveEvents(data.events);
                console.log(`✅ Loaded ${data.events.length} initial events`);
            } else {
                throw new Error('Failed to load JSON/events.json');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load JSON/events.json, using demo data:', error);
            this.saveEvents(window.DEMO_EVENTS || []);
        }
    }

    /**
     * تحميل المستخدمين الأوليين
     */
    loadInitialUsers() {
        const users = window.DEMO_USERS || {};
        this.saveUsers(users);
        console.log(`✅ Loaded ${Object.keys(users).length} initial users`);
    }

    /**
     * حفظ الأحداث
     */
    saveEvents(events) {
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
                return data.events || [];
            }
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