/* 
===========================================
SCOUTPLUSE - TRANSLATION SERVICE
===========================================

Handles internationalization including:
1. Multi-language support
2. RTL/LTR text direction
3. Dynamic language switching
4. Translation management
*/

/**
 * Translation Service Class
 * 
 * Manages application translations and language switching.
 */
class TranslationService {
    constructor() {
        this.currentLanguage = 'ar';
        this.translations = {};
        this.isRTL = true;
        
        this.init();
    }

    /**
     * Initialize Translation Service
     */
    init() {
        console.log('🌐 Initializing Translation Service...');
        
        this.loadTranslations();
        this.loadLanguage();
        
        console.log(`✅ Translation Service initialized - Language: ${this.currentLanguage}`);
    }

    /**
     * Load Translation Data
     */
    loadTranslations() {
        this.translations = {
            en: {
                // Navigation
                'nav.dashboard': 'Dashboard',
                'nav.events': 'Events',
                'nav.information': 'Information',
                'nav.members': 'Members',
                'nav.profile': 'Profile',
                'nav.settings': 'Settings',
                
                // Dashboard
                'dashboard.welcome': 'Welcome back',
                'dashboard.subtitle': "Here's what's happening with your troop today.",
                'dashboard.upcoming_events': 'Upcoming Events',
                'dashboard.active_members': 'Active Members',
                'dashboard.information_items': 'Information Items',
                'dashboard.recent_events': 'Recent Events',
                
                // Events
                'events.title': 'Events',
                'events.create': 'Create Event',
                'events.upcoming': 'Upcoming',
                'events.past': 'Past',
                'events.join': 'Join Event',
                'events.search_placeholder': 'Search events by title, description, or location...',
                'events.all_events': 'All Events',
                
                // Information
                'information.title': 'Information',
                'information.subtitle': 'Scouting knowledge and resources',
                
                // Members
                'members.title': 'Members',
                'members.add': 'Add Member',
                
                // Profile
                'profile.title': 'Profile',
                'profile.subtitle': 'Manage your personal information and preferences',
                
                // Settings
                'settings.title': 'Settings',
                'settings.subtitle': 'Customize your experience and manage preferences',
                
                // Common
                'common.filter': 'Filter',
                'common.search': 'Search',
                'common.view': 'View',
                'common.edit': 'Edit',
                'common.delete': 'Delete',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.success': 'Success',
                'common.join': 'Join',
                'common.joined': 'Joined',
                'common.full': 'Full'
            },
            ar: {
                // Navigation
                'nav.dashboard': 'لوحة التحكم',
                'nav.events': 'الفعاليات',
                'nav.information': 'المعلومات',
                'nav.members': 'الأعضاء',
                'nav.profile': 'الملف الشخصي',
                'nav.settings': 'الإعدادات',
                
                // Dashboard
                'dashboard.welcome': 'مرحباً بعودتك',
                'dashboard.subtitle': 'إليك ما يحدث مع فرقتك اليوم.',
                'dashboard.upcoming_events': 'الفعاليات القادمة',
                'dashboard.active_members': 'الأعضاء النشطون',
                'dashboard.information_items': 'عناصر المعلومات',
                'dashboard.recent_events': 'الفعاليات الأخيرة',
                
                // Events
                'events.title': 'الفعاليات',
                'events.create': 'إنشاء فعالية',
                'events.upcoming': 'القادمة',
                'events.past': 'السابقة',
                'events.join': 'انضم للفعالية',
                'events.search_placeholder': 'البحث في الأحداث بالعنوان أو الوصف أو المكان...',
                'events.all_events': 'جميع الأحداث',
                
                // Information
                'information.title': 'المعلومات',
                'information.subtitle': 'معرفة ومصادر الكشافة',
                
                // Members
                'members.title': 'الأعضاء',
                'members.add': 'إضافة عضو',
                
                // Profile
                'profile.title': 'الملف الشخصي',
                'profile.subtitle': 'إدارة معلوماتك الشخصية وتفضيلاتك',
                
                // Settings
                'settings.title': 'الإعدادات',
                'settings.subtitle': 'تخصيص تجربتك وإدارة التفضيلات',
                
                // Common
                'common.filter': 'تصفية',
                'common.search': 'بحث',
                'common.view': 'عرض',
                'common.edit': 'تعديل',
                'common.delete': 'حذف',
                'common.save': 'حفظ',
                'common.cancel': 'إلغاء',
                'common.loading': 'جاري التحميل...',
                'common.error': 'خطأ',
                'common.success': 'نجح',
                'common.join': 'انضم',
                'common.joined': 'منضم',
                'common.full': 'ممتلئ'
            }
        };
        
        console.log('📚 Translation data loaded');
    }

    /**
     * Load Language from Storage
     */
    loadLanguage() {
        const savedLanguage = localStorage.getItem('scoutpluse_language') || 'en';
        this.setLanguage(savedLanguage);
    }

    /**
     * Set Language
     * 
     * @param {string} language - Language code to set
     */
    setLanguage(language) {
        if (!this.translations[language]) {
            console.warn(`⚠️ Language ${language} not supported, falling back to Arabic`);
            language = 'ar';
        }
        
        console.log(`🌐 Setting language to: ${language}`);
        
        this.currentLanguage = language;
        this.isRTL = language === 'ar';
        
        // Save to storage
        localStorage.setItem('scoutpluse_language', language);
        
        // Update HTML attributes
        this.updateHTMLAttributes();
        
        // Update all translated elements
        this.updateTranslatedElements();
        
        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { 
                language, 
                isRTL: this.isRTL,
                timestamp: new Date().toISOString()
            } 
        }));
        
        console.log(`✅ Language set to: ${language} (${this.isRTL ? 'RTL' : 'LTR'})`);
    }

    /**
     * Update HTML Attributes
     */
    updateHTMLAttributes() {
        const html = document.documentElement;
        
        // Update lang attribute
        html.lang = this.currentLanguage;
        
        // Update dir attribute for RTL languages
        if (this.isRTL) {
            html.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            html.dir = 'ltr';
            document.body.classList.remove('rtl');
        }
        
        console.log(`📝 HTML attributes updated: lang=${this.currentLanguage}, dir=${html.dir}`);
    }

    /**
     * Update All Translated Elements
     */
    updateTranslatedElements() {
        const elements = document.querySelectorAll('[data-translate]');
        let updatedCount = 0;
        
        elements.forEach(element => {
            const key = element.dataset.translate;
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
            
            updatedCount++;
        });
        
        console.log(`🔄 Updated ${updatedCount} translated elements`);
    }

    /**
     * Translate Text
     * 
     * @param {string} key - Translation key
     * @param {Object} params - Parameters for interpolation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                          this.translations['en']?.[key] || 
                          key;
        
        // Simple parameter replacement
        return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return params[param] || match;
        });
    }

    /**
     * Get Current Language
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Check if Current Language is RTL
     * @returns {boolean} Whether current language is RTL
     */
    isRTLLanguage() {
        return this.isRTL;
    }

    /**
     * Get Supported Languages
     * @returns {Array} Array of supported language codes
     */
    getSupportedLanguages() {
        return Object.keys(this.translations);
    }

    /**
     * Get Language Info
     * @returns {Object} Complete language information
     */
    getLanguageInfo() {
        return {
            currentLanguage: this.currentLanguage,
            isRTL: this.isRTL,
            supportedLanguages: this.getSupportedLanguages(),
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * Add Translations
     * 
     * @param {string} language - Language code
     * @param {Object} translations - Translation object
     */
    addTranslations(language, translations) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }
        
        Object.assign(this.translations[language], translations);
        
        console.log(`📚 Added translations for ${language}:`, Object.keys(translations));
        
        // Update elements if this is the current language
        if (language === this.currentLanguage) {
            this.updateTranslatedElements();
        }
    }

    /**
     * Get All Translations for Language
     * 
     * @param {string} language - Language code
     * @returns {Object} All translations for the language
     */
    getTranslations(language = null) {
        const lang = language || this.currentLanguage;
        return this.translations[lang] || {};
    }

    /**
     * Check if Translation Exists
     * 
     * @param {string} key - Translation key
     * @param {string} language - Language code (optional)
     * @returns {boolean} Whether translation exists
     */
    hasTranslation(key, language = null) {
        const lang = language || this.currentLanguage;
        return !!(this.translations[lang] && this.translations[lang][key]);
    }

    /**
     * Format Number for Current Language
     * 
     * @param {number} number - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(number) {
        try {
            return new Intl.NumberFormat(this.currentLanguage).format(number);
        } catch (error) {
            console.warn('⚠️ Number formatting failed, using default');
            return number.toString();
        }
    }

    /**
     * Format Date for Current Language
     * 
     * @param {Date|string} date - Date to format
     * @param {Object} options - Formatting options
     * @returns {string} Formatted date
     */
    formatDate(date, options = {}) {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
<<<<<<< HEAD
            const defaultOptions = {
                calendar: 'gregory',
                ...options
            };
            return new Intl.DateTimeFormat(this.currentLanguage, defaultOptions).format(dateObj);
=======
            return new Intl.DateTimeFormat(this.currentLanguage, options).format(dateObj);
>>>>>>> 412d59bb4c7d071bf3929587c37cfb7a636b9e1b
        } catch (error) {
            console.warn('⚠️ Date formatting failed, using default');
            return date.toString();
        }
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let translationServiceInstance = null;

/**
 * Get Translation Service Instance
 * @returns {TranslationService} Translation service instance
 */
function getTranslationService() {
    if (!translationServiceInstance) {
        translationServiceInstance = new TranslationService();
    }
    return translationServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Initializing Translation Service...');
    window.translationService = getTranslationService();
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.TranslationService = TranslationService;
window.getTranslationService = getTranslationService;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TranslationService, getTranslationService };
}

console.log('🌐 Translation service module loaded');