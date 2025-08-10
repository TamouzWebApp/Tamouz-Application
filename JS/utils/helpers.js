/* 
===========================================
SCOUTPLUSE - UTILITY HELPERS
===========================================

Common utility functions used throughout the application.
*/

/**
 * Utility Helper Functions
 */
class UtilityHelpers {
    /**
     * Format Date
     * @param {string|Date} date - Date to format
     * @param {Object} options - Formatting options
     * @returns {string} Formatted date
     */
    static formatDate(date, options = {}) {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            const defaultOptions = {
                year: 'numeric',
<<<<<<< HEAD
                month: 'long',
                day: 'numeric',
                calendar: 'gregory'
            };
            
            return dateObj.toLocaleDateString('ar', { ...defaultOptions, ...options });
=======
                month: 'short',
                day: 'numeric'
            };
            
            return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
>>>>>>> 412d59bb4c7d071bf3929587c37cfb7a636b9e1b
        } catch (error) {
            console.warn('⚠️ Date formatting failed:', error);
            return date.toString();
        }
    }

    /**
     * Format Time
     * @param {string} time - Time string (HH:MM)
     * @returns {string} Formatted time
     */
    static formatTime(time) {
        try {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
        } catch (error) {
            console.warn('⚠️ Time formatting failed:', error);
            return time;
        }
    }

    /**
     * Generate Unique ID
     * @param {string} prefix - ID prefix
     * @returns {string} Unique ID
     */
    static generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Debounce Function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle Function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Deep Clone Object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    /**
     * Validate Email
     * @param {string} email - Email to validate
     * @returns {boolean} Whether email is valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate Phone Number
     * @param {string} phone - Phone number to validate
     * @returns {boolean} Whether phone is valid
     */
    static isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    /**
     * Sanitize HTML
     * @param {string} html - HTML to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Escape HTML
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHTML(text) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    /**
     * Get Initials from Name
     * @param {string} name - Full name
     * @returns {string} Initials
     */
    static getInitials(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    /**
     * Capitalize First Letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    /**
     * Convert to Slug
     * @param {string} text - Text to convert
     * @returns {string} Slug
     */
    static toSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Calculate Days Between Dates
     * @param {Date|string} date1 - First date
     * @param {Date|string} date2 - Second date
     * @returns {number} Days difference
     */
    static daysBetween(date1, date2) {
        const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
        const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Check if Date is Today
     * @param {Date|string} date - Date to check
     * @returns {boolean} Whether date is today
     */
    static isToday(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        return d.toDateString() === today.toDateString();
    }

    /**
     * Check if Date is in Future
     * @param {Date|string} date - Date to check
     * @returns {boolean} Whether date is in future
     */
    static isFuture(date) {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d > new Date();
    }

    /**
     * Format File Size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Get Random Color
     * @returns {string} Random hex color
     */
    static getRandomColor() {
        const colors = [
            '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Copy to Clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('⚠️ Clipboard API failed, using fallback');
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            text.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (fallbackError) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }

    /**
     * Download JSON Data
     * @param {Object} data - Data to download
     * @param {string} filename - File name
     */
    static downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Get Browser Info
     * @returns {Object} Browser information
     */
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        
        return {
            browser,
            userAgent: ua,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    /**
     * Check if Mobile Device
     * @returns {boolean} Whether device is mobile
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Check if Touch Device
     * @returns {boolean} Whether device supports touch
     */
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Get Screen Size Category
     * @returns {string} Screen size category
     */
    static getScreenSize() {
        const width = window.innerWidth;
        if (width < 480) return 'mobile';
        if (width < 768) return 'mobile-large';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    /**
     * Smooth Scroll to Element
     * @param {string|Element} target - Target element or selector
     * @param {number} offset - Offset from top
     */
    static scrollToElement(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;
        
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Wait for Element
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<Element>} Element when found
     */
    static waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    /**
     * Local Storage with Expiry
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @param {number} ttl - Time to live in milliseconds
     */
    static setWithExpiry(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    /**
     * Get from Local Storage with Expiry Check
     * @param {string} key - Storage key
     * @returns {any} Stored value or null if expired
     */
    static getWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        try {
            const item = JSON.parse(itemStr);
            const now = new Date();
            
            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            
            return item.value;
        } catch (error) {
            localStorage.removeItem(key);
            return null;
        }
    }
}

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.UtilityHelpers = UtilityHelpers;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UtilityHelpers };
}

console.log('🛠️ Utility helpers loaded');