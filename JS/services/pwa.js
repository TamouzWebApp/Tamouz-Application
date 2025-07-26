/* 
===========================================
SCOUTPLUSE - PWA SERVICE
===========================================

خدمة Progressive Web App تدير:
1. تسجيل Service Worker
2. تحديثات التطبيق
3. التثبيت على الجهاز
4. الوضع بدون اتصال
5. إشعارات الدفع
*/

/**
 * PWA Service Class
 * يدير جميع وظائف Progressive Web App
 */
class PWAService {
    constructor() {
        this.swRegistration = null;
        this.isOnline = navigator.onLine;
        this.installPrompt = null;
        this.isInstalled = false;
        this.updateAvailable = false;
        
        this.init();
    }

    /**
     * تهيئة خدمة PWA
     */
    async init() {
        console.log('📱 Initializing PWA Service...');
        
        // تحقق من دعم Service Worker
        if (!('serviceWorker' in navigator)) {
            console.warn('⚠️ Service Worker not supported');
            return;
        }
        
        try {
            await this.registerServiceWorker();
            this.setupEventListeners();
            this.checkInstallation();
            this.setupInstallPrompt();
            this.checkForUpdates();
            
            console.log('✅ PWA Service initialized successfully');
        } catch (error) {
            console.error('❌ PWA Service initialization failed:', error);
        }
    }

    /**
     * تسجيل Service Worker
     */
    async registerServiceWorker() {
        try {
            console.log('🔧 Registering Service Worker...');
            
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('✅ Service Worker registered:', this.swRegistration.scope);
            
            // الاستماع لتحديثات Service Worker
            this.swRegistration.addEventListener('updatefound', () => {
                console.log('🔄 Service Worker update found');
                this.handleServiceWorkerUpdate();
            });
            
            return this.swRegistration;
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
            throw error;
        }
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // مراقبة حالة الاتصال
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored');
            this.isOnline = true;
            this.showConnectionStatus('متصل', 'success');
            this.syncWhenOnline();
        });

        window.addEventListener('offline', () => {
            console.log('📡 Connection lost');
            this.isOnline = false;
            this.showConnectionStatus('غير متصل - يعمل بدون اتصال', 'warning');
        });

        // الاستماع لرسائل Service Worker
        navigator.serviceWorker.addEventListener('message', event => {
            this.handleServiceWorkerMessage(event.data);
        });

        // مراقبة تغييرات Service Worker
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker controller changed');
            window.location.reload();
        });
    }

    /**
     * التحقق من حالة التثبيت
     */
    checkInstallation() {
        // تحقق من وضع standalone
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('📱 App is running in standalone mode');
        }
        
        // تحقق من iOS standalone
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('📱 App is running in iOS standalone mode');
        }
        
        // إخفاء شريط العنوان إذا كان مثبتاً
        if (this.isInstalled) {
            document.body.classList.add('pwa-installed');
        }
    }

    /**
     * إعداد مطالبة التثبيت
     */
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', event => {
            console.log('📥 Install prompt available');
            
            // منع المطالبة التلقائية
            event.preventDefault();
            this.installPrompt = event;
            
            // إظهار زر التثبيت المخصص
            this.showInstallButton();
        });

        // الاستماع لحدث التثبيت
        window.addEventListener('appinstalled', () => {
            console.log('🎉 App installed successfully');
            this.isInstalled = true;
            this.installPrompt = null;
            this.hideInstallButton();
            this.showNotification('تم تثبيت التطبيق بنجاح!', 'success');
        });
    }

    /**
     * إظهار زر التثبيت
     */
    showInstallButton() {
        // إنشاء زر التثبيت إذا لم يكن موجوداً
        let installBtn = document.getElementById('pwa-install-btn');
        
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'pwa-install-btn';
            installBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                تثبيت التطبيق
            `;
            
            // إضافة الأنماط
            this.addInstallButtonStyles();
            
            // إضافة الزر للصفحة
            document.body.appendChild(installBtn);
            
            // إضافة مستمع النقر
            installBtn.addEventListener('click', () => {
                this.promptInstall();
            });
        }
        
        installBtn.style.display = 'flex';
        console.log('📥 Install button shown');
    }

    /**
     * إخفاء زر التثبيت
     */
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    /**
     * مطالبة التثبيت
     */
    async promptInstall() {
        if (!this.installPrompt) {
            console.warn('⚠️ Install prompt not available');
            return;
        }

        try {
            console.log('📥 Showing install prompt...');
            
            // إظهار مطالبة التثبيت
            this.installPrompt.prompt();
            
            // انتظار اختيار المستخدم
            const result = await this.installPrompt.userChoice;
            
            if (result.outcome === 'accepted') {
                console.log('✅ User accepted install prompt');
            } else {
                console.log('❌ User dismissed install prompt');
            }
            
            this.installPrompt = null;
        } catch (error) {
            console.error('❌ Install prompt failed:', error);
        }
    }

    /**
     * إضافة أنماط زر التثبيت
     */
    addInstallButtonStyles() {
        if (document.getElementById('pwa-install-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'pwa-install-styles';
        styles.textContent = `
            .pwa-install-btn {
                position: fixed;
                bottom: calc(var(--bottom-nav-height, 72px) + 80px);
                right: 16px;
                background: linear-gradient(135deg, var(--primary-600), var(--secondary-600));
                color: white;
                border: none;
                border-radius: 24px;
                padding: 12px 20px;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                box-shadow: var(--shadow-lg);
                z-index: var(--z-toast);
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                animation: slideInUp 0.5s ease;
            }
            
            @media (min-width: 1024px) {
                .pwa-install-btn {
                    bottom: 20px;
                }
            }
            
            .pwa-install-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-xl);
            }
            
            .pwa-install-btn:active {
                transform: translateY(0);
            }
            
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .pwa-installed .pwa-install-btn {
                display: none !important;
            }
            
            @media (max-width: 480px) {
                .pwa-install-btn {
                    right: 8px;
                    bottom: calc(var(--bottom-nav-height, 72px) + 60px);
                    padding: 10px 16px;
                    font-size: 13px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * التحقق من التحديثات
     */
    async checkForUpdates() {
        if (!this.swRegistration) return;
        
        try {
            console.log('🔄 Checking for app updates...');
            await this.swRegistration.update();
        } catch (error) {
            console.error('❌ Update check failed:', error);
        }
    }

    /**
     * معالجة تحديث Service Worker
     */
    handleServiceWorkerUpdate() {
        const newWorker = this.swRegistration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🆕 New version available');
                this.updateAvailable = true;
                this.showUpdateNotification();
            }
        });
    }

    /**
     * إظهار إشعار التحديث
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <div class="update-icon">🆕</div>
                <div class="update-text">
                    <strong>تحديث جديد متاح!</strong>
                    <p>إصدار محسن من التطبيق جاهز للتثبيت</p>
                </div>
                <div class="update-actions">
                    <button class="btn-update" onclick="window.pwaService.applyUpdate()">
                        تحديث الآن
                    </button>
                    <button class="btn-dismiss" onclick="this.parentElement.parentElement.parentElement.remove()">
                        لاحقاً
                    </button>
                </div>
            </div>
        `;
        
        // إضافة الأنماط
        this.addUpdateNotificationStyles();
        
        document.body.appendChild(notification);
        
        // إزالة تلقائية بعد 10 ثوان
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * تطبيق التحديث
     */
    async applyUpdate() {
        if (!this.swRegistration || !this.updateAvailable) return;
        
        try {
            console.log('🔄 Applying update...');
            
            // إرسال رسالة لـ Service Worker للتخطي
            if (this.swRegistration.waiting) {
                this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            
            // إزالة إشعار التحديث
            const notification = document.querySelector('.pwa-update-notification');
            if (notification) {
                notification.remove();
            }
            
            this.showNotification('جاري تطبيق التحديث...', 'info');
            
        } catch (error) {
            console.error('❌ Update failed:', error);
            this.showNotification('فشل في تطبيق التحديث', 'error');
        }
    }

    /**
     * إضافة أنماط إشعار التحديث
     */
    addUpdateNotificationStyles() {
        if (document.getElementById('pwa-update-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'pwa-update-styles';
        styles.textContent = `
            .pwa-update-notification {
                position: fixed;
                top: calc(var(--mobile-header-height, 64px) + 16px);
                left: 16px;
                right: 16px;
                background: var(--bg-primary);
                border: 2px solid var(--primary-500);
                border-radius: 16px;
                box-shadow: var(--shadow-2xl);
                z-index: var(--z-toast);
                animation: slideInDown 0.5s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            @media (min-width: 768px) {
                .pwa-update-notification {
                    top: 16px;
                    left: auto;
                    right: 16px;
                    max-width: 400px;
                }
            }
            
            .update-content {
                padding: 16px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            
            .update-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .update-text {
                flex: 1;
            }
            
            .update-text strong {
                color: var(--text-primary);
                font-size: 16px;
                display: block;
                margin-bottom: 4px;
            }
            
            .update-text p {
                color: var(--text-secondary);
                font-size: 14px;
                margin: 0;
                line-height: 1.4;
            }
            
            .update-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 12px;
            }
            
            .btn-update {
                background: var(--primary-600);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .btn-update:hover {
                background: var(--primary-700);
                transform: translateY(-1px);
            }
            
            .btn-dismiss {
                background: transparent;
                color: var(--text-muted);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .btn-dismiss:hover {
                background: var(--gray-100);
                color: var(--text-primary);
            }
            
            .dark .btn-dismiss:hover {
                background: var(--gray-700);
            }
            
            @keyframes slideInDown {
                from {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .update-content {
                    padding: 12px;
                    flex-direction: column;
                    text-align: center;
                }
                
                .update-actions {
                    flex-direction: row;
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * مزامنة عند الاتصال
     */
    async syncWhenOnline() {
        if (!this.swRegistration || !this.isOnline) return;
        
        try {
            console.log('🔄 Syncing data when online...');
            
            // طلب مزامنة خلفية
            await this.swRegistration.sync.register('sync-events');
            
            console.log('✅ Background sync registered');
        } catch (error) {
            console.error('❌ Background sync failed:', error);
        }
    }

    /**
     * معالجة رسائل Service Worker
     */
    handleServiceWorkerMessage(data) {
        console.log('💬 Message from Service Worker:', data);
        
        switch (data.type) {
            case 'EVENTS_UPDATED':
                this.showNotification(data.data, 'success');
                // تحديث واجهة المستخدم
                if (window.EventsService?.getInstance) {
                    window.EventsService.getInstance().refresh();
                }
                break;
                
            case 'CACHE_UPDATED':
                console.log('📦 Cache updated');
                break;
                
            default:
                console.log('📨 Unknown message type:', data.type);
        }
    }

    /**
     * طلب إذن الإشعارات
     */
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.warn('⚠️ Notifications not supported');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            console.log('✅ Notification permission already granted');
            return true;
        }
        
        if (Notification.permission === 'denied') {
            console.warn('❌ Notification permission denied');
            return false;
        }
        
        try {
            console.log('🔔 Requesting notification permission...');
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
                this.showNotification('تم تفعيل الإشعارات بنجاح!', 'success');
                return true;
            } else {
                console.log('❌ Notification permission denied');
                return false;
            }
        } catch (error) {
            console.error('❌ Notification permission request failed:', error);
            return false;
        }
    }

    /**
     * إرسال إشعار محلي
     */
    showLocalNotification(title, options = {}) {
        if (Notification.permission !== 'granted') {
            console.warn('⚠️ Notification permission not granted');
            return;
        }
        
        const defaultOptions = {
            body: 'إشعار من ScoutPluse',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            vibrate: [200, 100, 200],
            requireInteraction: false,
            silent: false
        };
        
        const notification = new Notification(title, { ...defaultOptions, ...options });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        // إغلاق تلقائي بعد 5 ثوان
        setTimeout(() => {
            notification.close();
        }, 5000);
    }

    /**
     * عرض حالة الاتصال
     */
    showConnectionStatus(message, type) {
        // إزالة الإشعار السابق
        const existing = document.querySelector('.connection-status-notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `connection-status-notification status-${type}`;
        notification.innerHTML = `
            <div class="status-icon">
                ${type === 'success' ? '🌐' : '📡'}
            </div>
            <span>${message}</span>
        `;
        
        // إضافة الأنماط
        this.addConnectionStatusStyles();
        
        document.body.appendChild(notification);
        
        // إزالة بعد 3 ثوان للنجاح، 5 ثوان للتحذير
        const timeout = type === 'success' ? 3000 : 5000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, timeout);
    }

    /**
     * إضافة أنماط حالة الاتصال
     */
    addConnectionStatusStyles() {
        if (document.getElementById('connection-status-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'connection-status-styles';
        styles.textContent = `
            .connection-status-notification {
                position: fixed;
                top: calc(var(--mobile-header-height, 64px) + 16px);
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 24px;
                padding: 8px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: var(--shadow-lg);
                z-index: var(--z-toast);
                animation: slideInDown 0.3s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            @media (min-width: 1024px) {
                .connection-status-notification {
                    top: 16px;
                }
            }
            
            .status-success {
                border-color: var(--green-300);
                background: var(--green-50);
                color: var(--green-800);
            }
            
            .status-warning {
                border-color: var(--amber-300);
                background: var(--amber-50);
                color: var(--amber-800);
            }
            
            .dark .status-success {
                border-color: var(--green-700);
                background: var(--green-900);
                color: var(--green-300);
            }
            
            .dark .status-warning {
                border-color: var(--amber-700);
                background: var(--amber-900);
                color: var(--amber-300);
            }
            
            .status-icon {
                font-size: 16px;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * عرض إشعار عام
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `pwa-notification pwa-notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-text">${message}</span>
        `;
        
        // إضافة الأنماط
        this.addNotificationStyles();
        
        document.body.appendChild(notification);
        
        // إزالة بعد 4 ثوان
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    /**
     * إضافة أنماط الإشعارات
     */
    addNotificationStyles() {
        if (document.getElementById('pwa-notification-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'pwa-notification-styles';
        styles.textContent = `
            .pwa-notification {
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
                .pwa-notification {
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
            
            .pwa-notification-success {
                border-color: var(--green-200);
                background: var(--green-50);
                color: var(--green-800);
            }
            
            .pwa-notification-error {
                border-color: var(--red-200);
                background: var(--red-50);
                color: var(--red-800);
            }
            
            .pwa-notification-info {
                border-color: var(--blue-200);
                background: var(--blue-50);
                color: var(--blue-800);
            }
            
            .pwa-notification-warning {
                border-color: var(--amber-200);
                background: var(--amber-50);
                color: var(--amber-800);
            }
            
            .dark .pwa-notification-success {
                border-color: var(--green-700);
                background: var(--green-900);
                color: var(--green-300);
            }
            
            .dark .pwa-notification-error {
                border-color: var(--red-700);
                background: var(--red-900);
                color: var(--red-300);
            }
            
            .dark .pwa-notification-info {
                border-color: var(--blue-700);
                background: var(--blue-900);
                color: var(--blue-300);
            }
            
            .dark .pwa-notification-warning {
                border-color: var(--amber-700);
                background: var(--amber-900);
                color: var(--amber-300);
            }
            
            .notification-icon {
                flex-shrink: 0;
            }
            
            .notification-text {
                flex: 1;
                line-height: 1.4;
            }
            
            @media (max-width: 480px) {
                .pwa-notification {
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
     * تنظيف التخزين المؤقت
     */
    async clearCache() {
        try {
            console.log('🗑️ Clearing cache...');
            
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            
            console.log('✅ Cache cleared successfully');
            this.showNotification('تم مسح التخزين المؤقت', 'success');
            
            // إعادة تحميل الصفحة
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Cache clear failed:', error);
            this.showNotification('فشل في مسح التخزين المؤقت', 'error');
        }
    }

    /**
     * الحصول على معلومات PWA
     */
    getPWAInfo() {
        return {
            isServiceWorkerSupported: 'serviceWorker' in navigator,
            isServiceWorkerRegistered: !!this.swRegistration,
            isOnline: this.isOnline,
            isInstalled: this.isInstalled,
            canInstall: !!this.installPrompt,
            updateAvailable: this.updateAvailable,
            notificationPermission: Notification.permission,
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * فرض التحديث
     */
    async forceUpdate() {
        if (this.swRegistration) {
            await this.swRegistration.update();
            window.location.reload();
        }
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let pwaServiceInstance = null;

/**
 * Get PWA Service Instance
 * @returns {PWAService} PWA service instance
 */
function getPWAService() {
    if (!pwaServiceInstance) {
        pwaServiceInstance = new PWAService();
    }
    return pwaServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 Initializing PWA Service...');
    window.pwaService = getPWAService();
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.PWAService = PWAService;
window.getPWAService = getPWAService;

console.log('📱 PWA Service module loaded');