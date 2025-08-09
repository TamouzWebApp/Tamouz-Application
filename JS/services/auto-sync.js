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
            this.pollInterval = 5000; // كل 5 ثواني لضمان التحديث السريع
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
            
            const eventsFilePath = window.getEventsFilePath() || 'JSON/events.json';
            
            // إضافة timestamp لتجنب cache المتصفح
            const url = `${eventsFilePath}?t=${Date.now()}`;
            
            // تحميل المحتوى الجديد مباشرة بدلاً من التحقق من headers
            const response = await fetch(url, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
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
                this.updateSyncStatus('success');
                this.errorCount = 0;
                return;
            }

            // تحديث البيانات
            console.log('🆕 New content detected, updating events...');
            await this.updateEventsData(newEvents);
            
            this.lastHash = newHash;
            this.updateSyncStatus('success');
            this.errorCount = 0;
            
        } catch (error) {
            console.error('❌ Error checking for updates:', error);
            this.handleSyncError(error);
        }
    }

    /**
     * تحديث بيانات الأحداث
     */
    async updateEventsData(newEvents) {
        try {
            // تحديث البيانات المحلية
            const localStorageService = window.getLocalStorageService();
            if (localStorageService) {
                // تحقق من أن البيانات الجديدة ليست فارغة
                if (newEvents && newEvents.length >= 0) {
                    localStorageService.saveEvents(newEvents);
                    console.log(`✅ Updated ${newEvents.length} events in local storage`);
                } else {
                    console.log('⚠️ Received invalid events data, keeping existing data');
                    return;
                }

                // إرسال حدث التحديث
                this.dispatchSyncEvent('dataUpdated', {
                    events: newEvents,
                    eventsCount: newEvents.length,
                    source: 'autoSync',
                    timestamp: new Date().toISOString()
                });
                
                // تحديث واجهة المستخدم فوراً
                this.updateUI(newEvents);
            }
            
        } catch (error) {
            console.error('❌ Error updating events data:', error);
            throw error;
        }
    }

    /**
     * تحديث واجهة المستخدم
     */
    updateUI(newEvents) {
        try {
            // تحديث خدمة الأحداث
            if (window.EventsService?.getInstance) {
                const eventsService = window.EventsService.getInstance();
                eventsService.events = newEvents;
                
                // إذا كان المستخدم في صفحة الأحداث، قم بالتحديث فوراً
                if (window.scoutPluseApp?.getCurrentPage() === 'events') {
                    eventsService.renderEventsPage();
                    console.log('🎨 Events page updated automatically');
                }
            }

            // تحديث خدمة إدارة البيانات
            if (window.dataManagerService) {
                window.dataManagerService.events = newEvents;
            }

            // إرسال حدث عام للتحديث
            window.dispatchEvent(new CustomEvent('eventsUpdated', {
                detail: {
                    events: newEvents,
                    count: newEvents.length,
                    source: 'autoSync',
                    timestamp: new Date().toISOString()
                }
            }));

        } catch (error) {
            console.error('❌ Error updating UI:', error);
        }
    }

    /**
     * جلب وتحديث الأحداث (للتوافق مع الكود القديم)
     */
    async fetchAndUpdateEvents() {
        console.log('🔄 Redirecting to updateEventsData method');
        // هذه الدالة موجودة للتوافق مع الكود القديم
        return this.checkForUpdates();
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
                            console.log('⚠️ Auto sync disabled due to repeated errors');
            
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
        `.trim();
        
        console.log('📊 Sync Details:', details);
    }

    /**
     * عرض رسالة في وحدة التحكم
     */
    logMessage(message, type = 'info') {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        console.log(`${icons[type] || icons.info} ${message}`);
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
        console.log('🔄 Checking for updates...');
        
        try {
            await this.checkForUpdates();
            console.log('✅ Updates check completed successfully');
        } catch (error) {
            console.log('❌ Failed to check for updates');
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