/* 
===========================================
SCOUTPLUSE - STATUS INDICATOR COMPONENT
===========================================

مؤشر حالة التطبيق المحلي
*/

/**
 * Status Indicator Component
 * مؤشر حالة التطبيق المحلي
 */
class StatusIndicator {
    constructor() {
        this.element = null;
        this.isConnected = false;
        this.isAuthenticated = false;
        
        this.init();
    }

    /**
     * تهيئة مؤشر الحالة
     */
    init() {
        console.log('📡 Initializing Status Indicator...');
        this.createIndicator();
        this.setupEventListeners();
        console.log('✅ Status Indicator initialized');
    }

    /**
     * إنشاء مؤشر الحالة
     */
    createIndicator() {
        this.element = document.createElement('div');
        this.element.id = 'local-status';
        this.element.className = 'local-status';
        this.element.innerHTML = `
            <div class="status-dot connected"></div>
        `;
        
        // إضافة الأنماط
        this.addStyles();
        
        // إضافة المؤشر للصفحة
        document.body.appendChild(this.element);
    }

    /**
     * إضافة الأنماط
     */
    addStyles() {
        const styles = `
            .local-status {
                position: fixed;
                top: 10px;
                right: 10px;
                display: flex;
                align-items: center;
                padding: 8px;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid #e5e7eb;
                border-radius: 50%;
                backdrop-filter: blur(10px);
                z-index: 1000;
                transition: all 0.3s ease;
            }

            .dark .local-status {
                background: rgba(31, 41, 55, 0.9);
                border-color: #4b5563;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                transition: background-color 0.3s ease;
            }

            .status-dot.connected {
                background-color: #10b981;
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
            }

            .status-dot.disconnected {
                background-color: #ef4444;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
            }

            .status-dot.connecting {
                background-color: #f59e0b;
                box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .local-status:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .dark .local-status:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            @media (max-width: 768px) {
                .local-status {
                    top: 5px;
                    right: 5px;
                    padding: 6px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * إعداد مستمعي الأحداث
     */
    setupEventListeners() {
        // الاستماع لتغييرات الاتصال
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
        });

        window.addEventListener('offline', () => {
            this.updateConnectionStatus(false);
        });
    }

    /**
     * تحديث حالة الاتصال
     */
    updateConnectionStatus(isOnline) {
        if (!this.element) return;
        
        const statusDot = this.element.querySelector('.status-dot');
        
        if (isOnline) {
            statusDot.className = 'status-dot connected';
        } else {
            statusDot.className = 'status-dot disconnected';
        }
    }

    /**
     * تحديث حالة التطبيق
     */
    updateStatus(status) {
        if (!this.element) return;

        const statusDot = this.element.querySelector('.status-dot');
        
        statusDot.className = 'status-dot connected';
        this.element.title = 'التطبيق يعمل';
        
        this.isConnected = true;
        this.isAuthenticated = true;
    }

    /**
     * إظهار حالة الاتصال
     */
    show() {
        if (this.element) {
            this.element.style.display = 'flex';
        }
    }

    /**
     * إخفاء مؤشر الحالة
     */
    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    /**
     * الحصول على حالة الاتصال
     */
    getStatus() {
        return {
            connected: this.isConnected,
            authenticated: this.isAuthenticated
        };
    }

    /**
     * تدمير المؤشر
     */
    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}

// إنشاء نسخة عامة
window.StatusIndicator = StatusIndicator;

console.log('📡 Status Indicator component loaded');