/* 
===========================================
SCOUTPLUSE - APPLICATION CONFIGURATION
===========================================

Application configuration file
*/

// Database type configuration
window.DATABASE_TYPE = 'local';

// Application configuration
window.APP_CONFIG = {
    // App info
    appName: 'ScoutPluse',
    version: '1.0.0',
    baseUrl: window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/'),
    
    // API settings
    api: {
        eventsFile: '../../JSON/events.json',
        usersFile: 'https://tamouzwebapp.github.io/Tamouz-Application/JSON/users.json',
        useLocalStorage: true
    },
    
    // UI settings
    ui: {
        theme: 'auto',
        language: 'en',
        animations: true
    },
    
    // Storage settings
    storage: {
        prefix: 'scoutpluse_',
        expiry: 30 * 24 * 60 * 60 * 1000 // 30 days
    },
    
    // Performance settings
    performance: {
        debounceDelay: 300,
        throttleDelay: 100,
        cacheTimeout: 5 * 60 * 1000 // 5 minutes
    },
    
    // Security settings
    security: {
        maxLoginAttempts: 5,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        requireStrongPassword: false
    }
};

// Navigation permissions by role
window.ROLE_PERMISSIONS = {
    guest: ['events'],
    member: ['dashboard', 'events', 'information', 'profile'],
    leader: ['dashboard', 'events', 'information', 'profile', 'settings'],
    admin: ['dashboard', 'events', 'information', 'profile', 'settings']
};

// Event permissions by role
window.EVENT_PERMISSIONS = {
    guest: ['view'],
    member: ['view', 'join'],
    leader: ['view', 'join', 'create', 'manage'],
    admin: ['view', 'join', 'create', 'manage', 'delete']
};

// Event Categories
window.EVENT_CATEGORIES = [
    { id: 'ramita', name: 'رميتا', color: '#10b981', icon: '🌲' },
    { id: 'ma3lola', name: 'معلولا', color: '#3b82f6', icon: '🤝' },
    { id: 'sergila', name: 'سرجيلا', color: '#f59e0b', icon: '📚' },
    { id: 'bousra', name: 'بوسرا', color: '#ef4444', icon: '🏆' }
];

// Get database type
window.getDatabaseType = function() {
    return window.DATABASE_TYPE || 'local';
};

// Get configuration value
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

// Set configuration value
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

// Get events file path
window.getEventsFilePath = function() {
    return window.APP_CONFIG.api.eventsFile;
};

// Get users file path
window.getUsersFilePath = function() {
    return window.APP_CONFIG.api.usersFile;
};

// Utility functions for permissions
window.getRolePermissions = function(role) {
    return window.ROLE_PERMISSIONS[role] || [];
};

window.getEventPermissions = function(role) {
    return window.EVENT_PERMISSIONS[role] || [];
};

window.canUserAccessPage = function(role, page) {
    const permissions = window.getRolePermissions(role);
    return permissions.includes(page);
};

window.canUserPerformEventAction = function(role, action) {
    const permissions = window.getEventPermissions(role);
    return permissions.includes(action);
};

window.getCategoryById = function(categoryId) {
    return window.EVENT_CATEGORIES.find(cat => cat.id === categoryId) || null;
};

console.log('⚙️ Configuration loaded successfully');
console.log(`📁 Database type: ${window.getDatabaseType()}`);
console.log(`📄 Events file: ${window.getEventsFilePath()}`);
console.log(`👥 Users file: ${window.getUsersFilePath()}`);