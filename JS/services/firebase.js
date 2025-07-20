/* 
===========================================
SCOUTPLUSE - FIREBASE SERVICE
===========================================

خدمة Firebase لإدارة البيانات في الوقت الفعلي
تحل محل نظام PHP السابق
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  push, 
  remove, 
  onValue, 
  off,
  connectDatabaseEmulator
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

class FirebaseService {
  constructor() {
    this.database = database;
    this.auth = auth;
    this.isConnected = false;
    this.isAuthenticated = false;
    this.listeners = new Map();
    this.connectionListeners = new Set();
    
    this.initializeConnection();
    this.initializeAuth();
  }

  async initializeAuth() {
    try {
      // تسجيل دخول مجهول
      await signInAnonymously(this.auth);
      console.log('✅ تم تسجيل الدخول بنجاح');
      
      // مراقبة حالة المصادقة
      onAuthStateChanged(this.auth, (user) => {
        this.isAuthenticated = !!user;
        if (user) {
          console.log('✅ المستخدم مصادق:', user.uid);
        } else {
          console.log('❌ المستخدم غير مصادق');
        }
        this.notifyConnectionListeners();
      });
    } catch (error) {
      console.error('❌ خطأ في المصادقة:', error);
      this.isAuthenticated = false;
    }
  }

  initializeConnection() {
    // مراقبة حالة الاتصال
    const connectedRef = ref(this.database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      this.isConnected = snapshot.val() === true;
      console.log(this.isConnected ? '✅ متصل بـ Firebase' : '❌ غير متصل بـ Firebase');
      this.notifyConnectionListeners();
    });
  }

  notifyConnectionListeners() {
    const status = { 
      connected: this.isConnected,
      authenticated: this.isAuthenticated 
    };
    this.connectionListeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('خطأ في استدعاء مستمع الاتصال:', error);
      }
    });
  }

  onConnectionChange(callback) {
    this.connectionListeners.add(callback);
    // استدعاء فوري بالحالة الحالية
    callback({ connected: this.isConnected });
    
    // إرجاع دالة لإلغاء الاشتراك
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  async readEvents() {
    if (!this.isConnected) {
      throw new Error('غير متصل بـ Firebase');
    }

    try {
      const eventsRef = ref(this.database, 'events');
      const snapshot = await get(eventsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        // تحويل الكائن إلى مصفوفة
        const events = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        console.log(`✅ تم تحميل ${events.length} حدث من Firebase`);
        return {
          events: events,
          totalEvents: events.length,
          lastUpdated: new Date().toISOString()
        };
      } else {
        console.log('📋 لا توجد أحداث في Firebase');
        return {
          events: [],
          totalEvents: 0,
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('❌ خطأ في قراءة الأحداث:', error);
      throw new Error(`فشل في تحميل الأحداث: ${error.message}`);
    }
  }

  async writeEvents(events) {
    if (!this.isAuthenticated) {
      throw new Error('المستخدم غير مصادق. يرجى المحاولة مرة أخرى.');
    }
    
    if (!this.isConnected) {
      throw new Error('غير متصل بـ Firebase');
    }

    try {
      // تحويل المصفوفة إلى كائن
      const eventsObject = {};
      events.forEach(event => {
        const eventId = event.id || this.generateEventId();
        eventsObject[eventId] = {
          ...event,
          id: eventId,
          updatedAt: new Date().toISOString()
        };
      });

      const eventsRef = ref(this.database, 'events');
      await set(eventsRef, eventsObject);

      // تحديث metadata
      const metadataRef = ref(this.database, 'metadata');
      await set(metadataRef, {
        lastUpdated: new Date().toISOString(),
        totalEvents: events.length,
        version: '1.0.0'
      });

      console.log(`✅ تم حفظ ${events.length} حدث في Firebase`);
      return {
        totalEvents: events.length,
        lastUpdated: new Date().toISOString(),
        operation: 'update'
      };
    } catch (error) {
      console.error('❌ خطأ في كتابة الأحداث:', error);
      throw new Error(`فشل في حفظ الأحداث: ${error.message}`);
    }
  }

  async addEvent(event) {
    if (!this.isAuthenticated) {
      throw new Error('المستخدم غير مصادق. يرجى المحاولة مرة أخرى.');
    }
    
    if (!this.isConnected) {
      throw new Error('غير متصل بـ Firebase');
    }

    try {
      const eventId = this.generateEventId();
      const newEvent = {
        ...event,
        id: eventId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const eventRef = ref(this.database, `events/${eventId}`);
      await set(eventRef, newEvent);

      console.log(`✅ تم إضافة الحدث: ${newEvent.title}`);
      return {
        event: newEvent,
        operation: 'add',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ خطأ في إضافة الحدث:', error);
      throw new Error(`فشل في إضافة الحدث: ${error.message}`);
    }
  }

  async updateEvent(eventId, updates) {
    if (!this.isAuthenticated) {
      throw new Error('المستخدم غير مصادق. يرجى المحاولة مرة أخرى.');
    }
    
    if (!this.isConnected) {
      throw new Error('غير متصل بـ Firebase');
    }

    try {
      const updatedEvent = {
        ...updates,
        id: eventId,
        updatedAt: new Date().toISOString()
      };

      const eventRef = ref(this.database, `events/${eventId}`);
      await set(eventRef, updatedEvent);

      console.log(`✅ تم تحديث الحدث: ${eventId}`);
      return {
        event: updatedEvent,
        operation: 'update',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ خطأ في تحديث الحدث:', error);
      throw new Error(`فشل في تحديث الحدث: ${error.message}`);
    }
  }

  async deleteEvent(eventId) {
    if (!this.isAuthenticated) {
      throw new Error('المستخدم غير مصادق. يرجى المحاولة مرة أخرى.');
    }
    
    if (!this.isConnected) {
      throw new Error('غير متصل بـ Firebase');
    }

    try {
      const eventRef = ref(this.database, `events/${eventId}`);
      await remove(eventRef);

      console.log(`✅ تم حذف الحدث: ${eventId}`);
      return {
        eventId: eventId,
        operation: 'delete',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ خطأ في حذف الحدث:', error);
      throw new Error(`فشل في حذف الحدث: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      const testRef = ref(this.database, '.info/serverTimeOffset');
      const snapshot = await get(testRef);
      
      return {
        success: true,
        message: 'الاتصال بـ Firebase ناجح',
        timestamp: new Date().toISOString(),
        serverTimeOffset: snapshot.val()
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      authenticated: this.isAuthenticated,
      provider: 'firebase'
    };
  }

  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  enableRealTimeUpdates() {
    if (!this.isAuthenticated) {
      console.warn('⚠️ لا يمكن تفعيل التحديثات في الوقت الفعلي: المستخدم غير مصادق');
      return;
    }
    
    if (this.listeners.has('events')) {
      console.log('🔄 التحديثات في الوقت الفعلي مفعلة بالفعل');
      return;
    }

    const eventsRef = ref(this.database, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const events = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        console.log(`🔄 تحديث في الوقت الفعلي: ${events.length} حدث`);
        
        // إرسال حدث مخصص
        window.dispatchEvent(new CustomEvent('firebaseEventsUpdated', {
          detail: { events, timestamp: new Date().toISOString() }
        }));
      }
    });

    this.listeners.set('events', unsubscribe);
    console.log('✅ تم تفعيل التحديثات في الوقت الفعلي');
  }

  disableRealTimeUpdates() {
    const unsubscribe = this.listeners.get('events');
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete('events');
      console.log('🔇 تم إيقاف التحديثات في الوقت الفعلي');
    }
  }
}

// إنشاء مثيل واحد من الخدمة
window.firebaseService = new FirebaseService();

// تصدير للاستخدام في ملفات أخرى
window.FirebaseService = FirebaseService;

console.log('🔥 تم تحميل خدمة Firebase بنجاح');