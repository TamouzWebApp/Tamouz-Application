/* 
===========================================
SCOUTPLUSE - LOCAL CONFIGURATION
===========================================

ملف الإعدادات العام للتطبيق - نظام محلي
*/

// إعداد نوع قاعدة البيانات
window.DATABASE_TYPE = 'local'; // نظام محلي فقط

// إعدادات أخرى
window.APP_CONFIG = {
    // إعدادات التطبيق
    appName: 'ScoutPluse',
    version: '1.0.0',
    
    // إعدادات الـ API
    api: {
        eventsFile: '../JS/events.json', // مسار ملف الأحداث
        usersFile: '../HTML/users.json', // مسار ملف المستخدمين
        useLocalStorage: true // استخدام localStorage للحفظ
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

// دالة للحصول على نوع قاعدة البيانات
window.getDatabaseType = function() {
    return window.DATABASE_TYPE || 'local';
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

// دالة للحصول على مسار ملف الأحداث
window.getEventsFilePath = function() {
    return window.APP_CONFIG.api.eventsFile;
};

console.log('⚙️ Configuration loaded successfully');
console.log(`📁 Database type: ${window.getDatabaseType()}`);
console.log(`📄 Events file: ${window.getEventsFilePath()}`);