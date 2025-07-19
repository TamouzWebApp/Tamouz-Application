/* 
===========================================
SCOUTPLUSE - CONFIGURATION
===========================================

ملف الإعدادات العام للتطبيق
يمكن تخصيص الـ base URL من هنا
*/

// إعداد الـ Base URL للـ API
// يمكن تغيير هذا المتغير حسب البيئة
window.API_BASE_URL = './api'; // استخدام مجلد API المحلي

// إعدادات أخرى
window.APP_CONFIG = {
    // إعدادات التطبيق
    appName: 'ScoutPluse',
    version: '1.0.0',
    
    // إعدادات الـ API
    api: {
        timeout: 10000, // 10 ثواني
        retryAttempts: 3,
        securityToken: 'ScoutPlus(WebApp)'
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

// دالة لتحديث الـ base URL
window.setAPIBaseURL = function(url) {
    window.API_BASE_URL = url;
    console.log(`🔗 API Base URL updated to: ${url || 'same domain'}`);
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

console.log('⚙️ Configuration loaded successfully');