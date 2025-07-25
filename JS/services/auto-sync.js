/* 
===========================================
SCOUTPLUSE - AUTO SYNC SERVICE
===========================================

خدمة المزامنة التلقائية للبيانات
تراقب تغييرات ملف events.json وتحدث البيانات المحلية تلقائياً
*/

/**
 * Auto Sync Service Class
 * خدمة المزامنة التلقائية
 */
class AutoSyncService {
    constructor() {
        this.isEnabled = true;
        this.pollInterval = 30000; // 30 ثانية
        this.intervalId = null;
        this.lastModified = null;
        this.lastHash = null;
        this.isPolling = false;
        this.syncStatus = 'idle'; // idle, syncing, error, success
        this.errorCount = 0;
        this.maxErrors = 5;
        
        this.init();
    }

    /**
     * تهيئة خدمة المزامنة التلقائية
     */
    init() {
        console.log('🔄 Initializing Auto Sync Service...');
        
        // تحميل الإعدادات من localStorage
        this.loadSettings();
        
        // إعداد مستمعي الأحداث
        this.setupEventListeners();
        
        // بدء المزامنة التلقائية إذا كانت مفعلة
        if (this.isEnabled) {
            this.startPolling();
        }
        
        // إضافة مؤشر الحالة للواجهة
        this.createStatusIndicator();
        
        console.log('✅ Auto Sync Service initialized');
    }

    /**
     * تحميل إعدادات المزامنة
     */
    loadSettings() {
        const settings = localStorage.getItem('scoutpluse_sync_settings');
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                this.isEnabled = true; // دائماً مفعل
                this.pollInterval = parsed.interval || 30000;
                console.log(`⚙️ Sync settings loaded: enabled=${this.isEnabled}, interval=${this.pollInterval}ms`);
            } catch (error) {
                console.warn('⚠️ Failed to load sync settings, using defaults');
            }
        } else {
            // إعدادات افتراضية - المزامنة مفعلة دائماً
            this.isEnabled = true;
            this.pollInterval = 15000; // كل 15 ثانية
        }
    }

    /**
     * حفظ إعدادات المزامنة
     */
    saveSettings() {
        const settings = {
            enabled: this.isEnabled,
            interval: this.pollInterval,
            lastUpdate: new Date().toISOString()
        };
        
        localStorage.setItem('scoutpluse_sync_settings', JSON.stringify(settings));
        console.log('💾 Sync settings saved');
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // الاستماع لتغييرات الصفحة
        window.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'events') {
                // تحقق فوري عند دخول صفحة الأحداث
                this.checkForUpdates();
            }
        });

        // الاستماع لتغييرات الرؤية (عندما يعود المستخدم للتبويب)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isEnabled) {
                console.log('👁️ Tab became visible, checking for updates...');
                this.checkForUpdates();
            }
        });

        // الاستماع لأحداث الشبكة (عودة الاتصال)
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored, resuming sync...');
            if (this.isEnabled && !this.isPolling) {
                this.startPolling();
            }
        });

        window.addEventListener('offline', () => {
            console.log('📡 Connection lost, pausing sync...');
            this.pausePolling();
        });
    }

    /**
     * بدء المزامنة التلقائية
     */
    startPolling() {
        if (this.intervalId) {
            console.log('⚠️ Polling already running');
            return;
        }

        console.log(`🔄 Starting auto sync polling every ${this.pollInterval / 1000} seconds`);
        
        this.isPolling = true;
        this.updateSyncStatus('syncing');
        
        // تحقق فوري أولاً
        this.checkForUpdates();
        
        // ثم بدء الاستعلام الدوري
        this.intervalId = setInterval(() => {
            this.checkForUpdates();
        }, this.pollInterval);
        
        this.dispatchSyncEvent('pollStarted', {
            interval: this.pollInterval,
            enabled: this.isEnabled
        });
    }

    /**
     * إيقاف المزامنة التلقائية
     */
    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isPolling = false;
            this.updateSyncStatus('idle');
            
            console.log('⏹️ Auto sync polling stopped');
            
            this.dispatchSyncEvent('pollStopped', {
                reason: 'manual'
            });
        }
    }

    /**
     * إيقاف مؤقت للمزامنة
     */
    pausePolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isPolling = false;
            this.updateSyncStatus('paused');
            
            console.log('⏸️ Auto sync polling paused');
        }
    }

    /**
     * التحقق من التحديثات
     */
    async checkForUpdates() {
        if (!this.isEnabled || !navigator.onLine) {
            return;
        }

        try {
            console.log('🔍 Checking for events file updates...');
            
            const eventsFilePath = window.getEventsFilePath() || 'https://tamouzwebapp.github.io/Tamouz-Application/JSON/events.json';
            
            // إضافة timestamp لتجنب cache المتصفح
            const url = `${eventsFilePath}?t=${Date.now()}`;
            
            const response = await fetch(url, {
                method: 'HEAD', // نحتاج فقط للـ headers
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // التحقق من Last-Modified header
            const lastModified = response.headers.get('Last-Modified');
            
            if (lastModified && this.lastModified && lastModified === this.lastModified) {
                console.log('📄 No changes detected in events file');
                this.updateSyncStatus('success');
                this.errorCount = 0;
                return;
            }

            // إذا تغير الملف، قم بتحميل المحتوى الجديد
            console.log('🆕 Changes detected in events file, fetching new data...');
            await this.fetchAndUpdateEvents();
            
            this.lastModified = lastModified;
            this.updateSyncStatus('success');
            this.errorCount = 0;
            
        } catch (error) {
            console.error('❌ Error checking for updates:', error);
            this.handleSyncError(error);
        }
    }

    /**
     * جلب وتحديث الأحداث
     */
    async fetchAndUpdateEvents() {
        try {
            const eventsFilePath = window.getEventsFilePath() || 'https://tamouzwebapp.github.io/Tamouz-Application/JSON/events.json';
            const url = `${eventsFilePath}?t=${Date.now()}`;
            
            const response = await fetch(url, {
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const newEvents = data.events || [];
            
            // حساب hash للمحتوى الجديد
            const newHash = this.calculateHash(JSON.stringify(newEvents));
            
            // مقارنة مع الـ hash المحفوظ
            if (this.lastHash && newHash === this.lastHash) {
                console.log('📄 Content unchanged (same hash)');
                return;
            }

            // تحديث البيانات المحلية
            const localStorageService = window.getLocalStorageService();
            if (localStorageService) {
                // تحقق من أن البيانات الجديدة ليست فارغة
                if (newEvents && newEvents.length > 0) {
                    localStorageService.saveEvents(newEvents);
                    console.log(`✅ Updated ${newEvents.length} events from server`);
                    
                    // إشعار المستخدم
                    this.showSyncNotification(`تم تحديث ${newEvents.length} حدث من الخادم`, 'success');
                } else {
                    console.log('⚠️ Received empty events array, keeping existing data');
                    return; // لا تحديث إذا كانت البيانات فارغة
                }
                
                this.lastHash = newHash;

                // إرسال حدث التحديث
                this.dispatchSyncEvent('dataUpdated', {
                    eventsCount: newEvents.length,
                    source: 'server',
                    timestamp: new Date().toISOString()
                });
                
                // تحديث واجهة المستخدم إذا كان المستخدم في صفحة الأحداث
                if (window.scoutPluseApp?.getCurrentPage() === 'events') {
                    if (window.EventsService?.getInstance) {
                        window.EventsService.getInstance().refresh();
                    }
                }
            }
            
        } catch (error) {
            console.error('❌ Error fetching events:', error);
            throw error;
        }
    }

    /**
     * معالجة أخطاء المزامنة
     */
    handleSyncError(error) {
        this.errorCount++;
        this.updateSyncStatus('error');
        
        console.error(`❌ Sync error ${this.errorCount}/${this.maxErrors}:`, error.message);
        
        // إذا تجاوز عدد الأخطاء الحد الأقصى، أوقف المزامنة
        if (this.errorCount >= this.maxErrors) {
            console.error('🚫 Too many sync errors, stopping auto sync');
            this.stopPolling();
            this.showSyncNotification('تم إيقاف المزامنة التلقائية بسبب أخطاء متكررة', 'error');
            
            this.dispatchSyncEvent('syncDisabled', {
                reason: 'tooManyErrors',
                errorCount: this.errorCount
            });
        } else {
            // زيادة فترة الاستعلام مؤقتاً عند حدوث خطأ
            const tempInterval = this.pollInterval * 2;
            console.log(`⏰ Increasing poll interval temporarily to ${tempInterval / 1000}s due to error`);
            
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = setInterval(() => {
                    this.checkForUpdates();
                }, tempInterval);
            }
        }
        
        this.dispatchSyncEvent('syncError', {
            error: error.message,
            errorCount: this.errorCount
        });
    }

    /**
     * حساب hash للمحتوى
     */
    calculateHash(content) {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    /**
     * تحديث حالة المزامنة
     */
    updateSyncStatus(status) {
        this.syncStatus = status;
        this.updateStatusIndicator();
    }

    /**
     * إنشاء مؤشر الحالة
     */
    createStatusIndicator() {
        // إزالة المؤشر القديم إذا كان موجوداً
        const existingIndicator = document.getElementById('autoSyncIndicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        console.log('📊 Auto sync running in background (no UI indicator)');
    }

    /**
     * إضافة أنماط المؤشر
     */
    addIndicatorStyles() {
        if (document.getElementById('autoSyncStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'autoSyncStyles';
        styles.textContent = `
            .auto-sync-indicator {
                position: fixed;
                bottom: calc(var(--bottom-nav-height, 72px) + 16px);
                right: 16px;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 24px;
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: var(--text-muted);
                box-shadow: var(--shadow-sm);
                z-index: var(--z-fixed);
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            @media (min-width: 1024px) {
                .auto-sync-indicator {
                    bottom: 16px;
                }
            }
            
            .auto-sync-indicator:hover {
                box-shadow: var(--shadow-md);
                transform: translateY(-2px);
            }
            
            .sync-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--gray-400);
                transition: all 0.3s ease;
            }
            
            .sync-dot.idle {
                background: var(--gray-400);
            }
            
            .sync-dot.syncing {
                background: var(--blue-500);
                animation: pulse 1.5s infinite;
            }
            
            .sync-dot.success {
                background: var(--green-500);
            }
            
            .sync-dot.error {
                background: var(--red-500);
                animation: blink 1s infinite;
            }
            
            .sync-dot.paused {
                background: var(--amber-500);
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.2); }
            }
            
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            
            .sync-text {
                font-weight: 500;
                white-space: nowrap;
            }
            
            .sync-toggle {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .sync-toggle:hover {
                background: var(--gray-100);
                color: var(--text-primary);
            }
            
            .dark .sync-toggle:hover {
                background: var(--gray-700);
            }
            
            .sync-toggle.disabled {
                opacity: 0.5;
            }
            
            /* إخفاء على الشاشات الصغيرة جداً */
            @media (max-width: 480px) {
                .auto-sync-indicator {
                    right: 8px;
                    bottom: calc(var(--bottom-nav-height, 72px) + 8px);
                    padding: 6px 8px;
                    font-size: 11px;
                }
                
                .sync-text {
                    display: none;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * إعداد مستمعي مؤشر الحالة
     */
    setupIndicatorListeners() {
        // لا حاجة لمستمعي الأحداث - المزامنة تعمل تلقائياً
        console.log('📊 Auto sync running without UI controls');
    }

    /**
     * تحديث مؤشر الحالة
     */
    updateStatusIndicator() {
        // تسجيل الحالة في وحدة التحكم فقط
        console.log(`🔄 Auto sync status: ${this.syncStatus}`);
    }

    /**
     * تبديل حالة المزامنة
     */
    toggleSync() {
        console.log('⚠️ Auto sync toggle disabled - always enabled');
        // لا نسمح بتبديل المزامنة
    }

    /**
     * تفعيل المزامنة
     */
    enableSync() {
        console.log('✅ Enabling auto sync');
        
        this.isEnabled = true;
        this.errorCount = 0;
        this.saveSettings();
        this.startPolling();
        
        console.log('✅ Auto sync enabled automatically');
        
        this.dispatchSyncEvent('syncEnabled', {
            interval: this.pollInterval
        });
    }

    /**
     * تعطيل المزامنة
     */
    disableSync() {
        console.log('⚠️ Auto sync cannot be disabled - always enabled');
        // لا نسمح بتعطيل المزامنة
    }

    /**
     * عرض تفاصيل المزامنة
     */
    showSyncDetails() {
        const details = `
📊 تفاصيل المزامنة التلقائية:

🔄 الحالة: ${this.isEnabled ? 'مفعلة' : 'معطلة'}
⏰ فترة التحقق: ${this.pollInterval / 1000} ثانية
📡 حالة الشبكة: ${navigator.onLine ? 'متصل' : 'غير متصل'}
❌ عدد الأخطاء: ${this.errorCount}/${this.maxErrors}
📅 آخر تحديث: ${this.lastModified || 'غير محدد'}

💡 نصيحة: يمكنك تعطيل/تفعيل المزامنة بالنقر على زر التبديل
        `.trim();
        
        alert(details);
    }

    /**
     * عرض إشعار المزامنة
     */
    showSyncNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `sync-notification sync-notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        notification.innerHTML = `
            <span class="sync-notification-icon">${icons[type] || icons.info}</span>
            <span class="sync-notification-text">${message}</span>
        `;
        
        // إضافة الأنماط إذا لم تكن موجودة
        this.addNotificationStyles();
        
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 4 ثوان
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    /**
     * إضافة أنماط الإشعارات
     */
    addNotificationStyles() {
        if (document.getElementById('syncNotificationStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'syncNotificationStyles';
        styles.textContent = `
            .sync-notification {
                position: fixed;
                top: calc(var(--mobile-header-height, 64px) + 16px);
                right: 16px;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                box-shadow: var(--shadow-lg);
                z-index: var(--z-toast);
                animation: slideInRight 0.3s ease;
                max-width: 300px;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            @media (min-width: 1024px) {
                .sync-notification {
                    top: 16px;
                }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .sync-notification-success {
                border-color: var(--green-200);
                background: var(--green-50);
                color: var(--green-800);
            }
            
            .sync-notification-error {
                border-color: var(--red-200);
                background: var(--red-50);
                color: var(--red-800);
            }
            
            .sync-notification-info {
                border-color: var(--blue-200);
                background: var(--blue-50);
                color: var(--blue-800);
            }
            
            .sync-notification-warning {
                border-color: var(--amber-200);
                background: var(--amber-50);
                color: var(--amber-800);
            }
            
            .dark .sync-notification-success {
                border-color: var(--green-700);
                background: var(--green-900);
                color: var(--green-300);
            }
            
            .dark .sync-notification-error {
                border-color: var(--red-700);
                background: var(--red-900);
                color: var(--red-300);
            }
            
            .dark .sync-notification-info {
                border-color: var(--blue-700);
                background: var(--blue-900);
                color: var(--blue-300);
            }
            
            .dark .sync-notification-warning {
                border-color: var(--amber-700);
                background: var(--amber-900);
                color: var(--amber-300);
            }
            
            .sync-notification-icon {
                flex-shrink: 0;
            }
            
            .sync-notification-text {
                flex: 1;
                line-height: 1.4;
            }
            
            @media (max-width: 480px) {
                .sync-notification {
                    right: 8px;
                    left: 8px;
                    max-width: none;
                    font-size: 13px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * إرسال أحداث المزامنة
     */
    dispatchSyncEvent(eventType, data) {
        window.dispatchEvent(new CustomEvent(`autoSync${eventType}`, {
            detail: {
                ...data,
                syncStatus: this.syncStatus,
                isEnabled: this.isEnabled,
                errorCount: this.errorCount,
                timestamp: new Date().toISOString()
            }
        }));
    }

    /**
     * تغيير فترة الاستعلام
     */
    setPollingInterval(interval) {
        if (interval < 5000) {
            console.warn('⚠️ Minimum polling interval is 5 seconds');
            interval = 5000;
        }
        
        console.log(`⏰ Changing polling interval from ${this.pollInterval}ms to ${interval}ms`);
        
        this.pollInterval = interval;
        this.saveSettings();
        
        // إعادة تشغيل المزامنة بالفترة الجديدة
        if (this.isPolling) {
            this.stopPolling();
            this.startPolling();
        }
        
        this.dispatchSyncEvent('intervalChanged', {
            newInterval: interval,
            oldInterval: this.pollInterval
        });
    }

    /**
     * مزامنة يدوية فورية
     */
    async syncNow() {
        console.log('🔄 Manual sync triggered');
        
        this.updateSyncStatus('syncing');
        this.showSyncNotification('جاري التحقق من التحديثات...', 'info');
        
        try {
            await this.checkForUpdates();
            this.showSyncNotification('تم التحقق من التحديثات بنجاح', 'success');
        } catch (error) {
            this.showSyncNotification('فشل في التحقق من التحديثات', 'error');
        }
        
        this.dispatchSyncEvent('manualSync', {
            success: this.syncStatus === 'success'
        });
    }

    /**
     * الحصول على معلومات المزامنة
     */
    getSyncInfo() {
        return {
            isEnabled: this.isEnabled,
            isPolling: this.isPolling,
            pollInterval: this.pollInterval,
            syncStatus: this.syncStatus,
            errorCount: this.errorCount,
            maxErrors: this.maxErrors,
            lastModified: this.lastModified,
            lastHash: this.lastHash,
            isOnline: navigator.onLine,
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * إعادة تعيين عداد الأخطاء
     */
    resetErrorCount() {
        console.log('🔄 Resetting error count');
        this.errorCount = 0;
        
        if (!this.isPolling && this.isEnabled) {
            this.startPolling();
        }
    }

    /**
     * تدمير الخدمة
     */
    destroy() {
        console.log('🗑️ Destroying Auto Sync Service');
        
        this.stopPolling();
        
        const indicator = document.getElementById('autoSyncIndicator');
        if (indicator) {
            indicator.remove();
        }
        
        const styles = document.getElementById('autoSyncStyles');
        if (styles) {
            styles.remove();
        }
        
        const notificationStyles = document.getElementById('syncNotificationStyles');
        if (notificationStyles) {
            notificationStyles.remove();
        }
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let autoSyncServiceInstance = null;

/**
 * Get Auto Sync Service Instance
 * @returns {AutoSyncService} Auto sync service instance
 */
function getAutoSyncService() {
    if (!autoSyncServiceInstance) {
        autoSyncServiceInstance = new AutoSyncService();
    }
    return autoSyncServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // تأخير قصير للتأكد من تحميل الخدمات الأخرى
    setTimeout(() => {
        if (window.AuthService?.isAuthenticated()) {
            console.log('🔄 Initializing Auto Sync Service...');
            window.autoSyncService = getAutoSyncService();
        }
    }, 1000);
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.AutoSyncService = AutoSyncService;
window.getAutoSyncService = getAutoSyncService;

console.log('🔄 Auto Sync Service module loaded');