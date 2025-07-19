/* 
===========================================
SCOUTPLUSE - THEME SERVICE
===========================================

Handles theme management including:
1. Light/Dark/Auto theme switching
2. System preference detection
3. Theme persistence
4. Theme change events
*/

/**
 * Theme Service Class
 * 
 * Manages application themes and provides theme switching functionality.
 */
class ThemeService {
    constructor() {
        this.currentTheme = 'auto';
        this.systemTheme = 'light';
        this.mediaQuery = null;
        
        this.init();
    }

    /**
     * Initialize Theme Service
     */
    init() {
        console.log('🎨 Initializing Theme Service...');
        
        this.detectSystemTheme();
        this.loadTheme();
        this.setupMediaQueryListener();
        
        console.log(`✅ Theme Service initialized - Current: ${this.currentTheme}`);
    }

    /**
     * Detect System Theme Preference
     */
    detectSystemTheme() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemTheme = this.mediaQuery.matches ? 'dark' : 'light';
        
        console.log(`🖥️ System theme detected: ${this.systemTheme}`);
    }

    /**
     * Load Theme from Storage
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('scoutpluse_theme') || 'auto';
        this.setTheme(savedTheme);
    }

    /**
     * Set Theme
     * 
     * @param {string} theme - Theme to set ('light', 'dark', 'auto')
     */
    setTheme(theme) {
        console.log(`🎨 Setting theme to: ${theme}`);
        
        this.currentTheme = theme;
        localStorage.setItem('scoutpluse_theme', theme);
        
        const html = document.documentElement;
        
        // Apply theme to DOM
        if (theme === 'dark') {
            html.classList.add('dark');
        } else if (theme === 'light') {
            html.classList.remove('dark');
        } else if (theme === 'auto') {
            // Auto theme - follow system preference
            if (this.systemTheme === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
        
        const isDark = html.classList.contains('dark');
        console.log(`🎨 Applied theme: ${theme} (${isDark ? 'dark' : 'light'} mode)`);
        
        // Update theme toggle icons
        this.updateThemeIcons(isDark);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { 
                theme, 
                isDark,
                systemTheme: this.systemTheme,
                timestamp: new Date().toISOString()
            } 
        }));
    }

    /**
     * Setup Media Query Listener
     * Listens for system theme changes when in auto mode
     */
    setupMediaQueryListener() {
        if (!this.mediaQuery) return;
        
        this.mediaQuery.addEventListener('change', (e) => {
            this.systemTheme = e.matches ? 'dark' : 'light';
            console.log(`🖥️ System theme changed to: ${this.systemTheme}`);
            
            // Apply auto theme if currently in auto mode
            if (this.currentTheme === 'auto') {
                const html = document.documentElement;
                if (e.matches) {
                    html.classList.add('dark');
                } else {
                    html.classList.remove('dark');
                }
                
                this.updateThemeIcons(e.matches);
                
                // Dispatch theme change event
                window.dispatchEvent(new CustomEvent('themeChanged', { 
                    detail: { 
                        theme: 'auto', 
                        isDark: e.matches,
                        systemTheme: this.systemTheme,
                        timestamp: new Date().toISOString()
                    } 
                }));
            }
        });
        
        console.log('🎧 System theme change listener attached');
    }

    /**
     * Update Theme Toggle Icons
     * 
     * @param {boolean} isDark - Whether dark mode is active
     */
    updateThemeIcons(isDark) {
        const themeToggles = document.querySelectorAll('.theme-toggle, #mobileThemeToggle');
        
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('svg');
            if (!icon) return;
            
            if (isDark) {
                // Moon icon for dark mode
                icon.innerHTML = `
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                `;
            } else {
                // Sun icon for light mode
                icon.innerHTML = `
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                `;
            }
        });
        
        console.log(`🎨 Theme icons updated for ${isDark ? 'dark' : 'light'} mode`);
    }

    /**
     * Toggle Theme
     * Cycles through light → dark → auto
     * 
     * @returns {string} New theme
     */
    toggleTheme() {
        const currentTheme = this.getTheme();
        let newTheme;
        
        if (currentTheme === 'light') {
            newTheme = 'dark';
        } else if (currentTheme === 'dark') {
            newTheme = 'auto';
        } else {
            newTheme = 'light';
        }
        
        console.log(`🔄 Toggling theme: ${currentTheme} → ${newTheme}`);
        this.setTheme(newTheme);
        return newTheme;
    }

    /**
     * Get Current Theme
     * @returns {string} Current theme setting
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Get System Theme
     * @returns {string} System theme preference
     */
    getSystemTheme() {
        return this.systemTheme;
    }

    /**
     * Check if Dark Mode is Active
     * @returns {boolean} Whether dark mode is currently active
     */
    isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    /**
     * Get Theme Info
     * @returns {Object} Complete theme information
     */
    getThemeInfo() {
        return {
            currentTheme: this.currentTheme,
            systemTheme: this.systemTheme,
            isDarkMode: this.isDarkMode(),
            isAutoMode: this.currentTheme === 'auto',
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * Set Theme Programmatically
     * For use by settings or other services
     * 
     * @param {string} theme - Theme to set
     * @returns {boolean} Success status
     */
    applyTheme(theme) {
        const validThemes = ['light', 'dark', 'auto'];
        
        if (!validThemes.includes(theme)) {
            console.warn(`⚠️ Invalid theme: ${theme}. Using 'auto' instead.`);
            theme = 'auto';
        }
        
        this.setTheme(theme);
        return true;
    }

    /**
     * Reset Theme to Default
     */
    resetTheme() {
        console.log('🔄 Resetting theme to default (auto)');
        this.setTheme('auto');
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let themeServiceInstance = null;

/**
 * Get Theme Service Instance
 * @returns {ThemeService} Theme service instance
 */
function getThemeService() {
    if (!themeServiceInstance) {
        themeServiceInstance = new ThemeService();
    }
    return themeServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing Theme Service...');
    window.themeService = getThemeService();
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.ThemeService = ThemeService;
window.getThemeService = getThemeService;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeService, getThemeService };
}

console.log('🎨 Theme service module loaded');