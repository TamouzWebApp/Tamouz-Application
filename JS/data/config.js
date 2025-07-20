/* 
===========================================
SCOUTPLUSE - CONFIGURATION
===========================================

ملف الإعدادات العام للتطبيق - محدث لـ Firebase
*/

// إعداد نوع قاعدة البيانات
window.DATABASE_TYPE = 'firebase'; // 'firebase' أو 'php'

// إعداد Firebase (سيتم استخدامه في firebase.js)
window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyCmRC2JPD_nR1kHKU3ksuH6OfnFJutO5_I",
    authDomain: "tamouz-webapp.firebaseapp.com",
    databaseURL: "https://tamouz-webapp-default-rtdb.firebaseio.com",
    projectId: "tamouz-webapp",
    storageBucket: "tamouz-webapp.firebasestorage.app",
    messagingSenderId: "959471265726",
    appId: "1:959471265726:web:faf9d1a7e645d92354fbef",
    measurementId: "G-7WGDJ5B2P5"
};

// إعداد الـ Base URL للـ API (للتوافق مع النظام القديم)
window.API_BASE_URL = ''; // لن يتم استخدامه مع Firebase

// إعدادات أخرى
window.APP_CONFIG = {
    // إعدادات التطبيق
    appName: 'ScoutPluse',
    version: '1.0.0',
    
    // إعدادات الـ API
    api: {
        timeout: 15000, // 15 ثانية للـ Firebase
        retryAttempts: 3,
        securityToken: 'ScoutPlus(WebApp)',
        useFirebase: true
    },
    
    // إعدادات Firebase
    firebase: {
        enableOffline: true,
        enableRealTime: true,
        enableAnalytics: true,
        cacheSize: 10 * 1024 * 1024 // 10MB
    },
    
    // إعدادات الواجهة
    ui: {
        theme: 'auto', // light, dark, auto
        language: 'en', // en, ar
        animations: true
    },
    
    // إعدادات التخزين
    storage: {
        prefix: 'scoutpluse_',
        expiry: 30 * 24 * 60 * 60 * 1000 // 30 يوم
    },
    
    // إعدادات الأداء
    performance: {
        debounceDelay: 300,
        throttleDelay: 100,
        cacheTimeout: 5 * 60 * 1000 // 5 دقائق
    },
    
    // إعدادات الأمان
    security: {
        maxLoginAttempts: 5,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 ساعة
        requireStrongPassword: false
    }
};

// دالة لتحديث نوع قاعدة البيانات
window.setDatabaseType = function(type) {
    window.DATABASE_TYPE = type;
    console.log(`🔄 Database type updated to: ${type}`);
};

// دالة للحصول على نوع قاعدة البيانات
window.getDatabaseType = function() {
    return window.DATABASE_TYPE || 'firebase';
};

// دالة لتحديث الـ base URL (للتوافق مع النظام القديم)
window.setAPIBaseURL = function(url) {
    window.API_BASE_URL = url;
    console.log(`🔗 API Base URL updated to: ${url || 'same domain'} (Note: Firebase is now primary)`);
};

// دالة للحصول على الـ base URL الحالي
window.getAPIBaseURL = function() {
    return window.API_BASE_URL || '';
};

// دالة للحصول على إعداد معين
window.getConfig = function(path) {
    const keys = path.split('.');
    let current = window.APP_CONFIG;
    
    for (const key of keys) {
        if (current[key] === undefined) {
            return undefined;
        }
        current = current[key];
    }
    
    return current;
};

// دالة لتحديث إعداد معين
window.setConfig = function(path, value) {
    const keys = path.split('.');
    let current = window.APP_CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    console.log(`⚙️ Config updated: ${path} = ${value}`);
};

// دالة للحصول على إعدادات Firebase
window.getFirebaseConfig = function() {
    return window.FIREBASE_CONFIG;
};

// دالة لتحديث إعدادات Firebase
window.setFirebaseConfig = function(config) {
    window.FIREBASE_CONFIG = { ...window.FIREBASE_CONFIG, ...config };
    console.log('🔥 Firebase config updated');
};

// دالة للتحقق من توفر Firebase
window.isFirebaseEnabled = function() {
    return window.getDatabaseType() === 'firebase' && !!window.FIREBASE_CONFIG;
};

console.log('⚙️ Configuration loaded successfully');
console.log(`🔥 Database type: ${window.getDatabaseType()}`);
console.log(`🔥 Firebase enabled: ${window.isFirebaseEnabled()}`);