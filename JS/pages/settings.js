/* 
===========================================
SCOUTPLUSE - SETTINGS PAGE SERVICE
===========================================

Handles settings management functionality including:
1. Application preferences
2. Theme and language settings
3. Privacy settings
4. Admin controls
5. Data management
*/

/**
 * Settings Service Class
 * 
 * Manages the settings page content and functionality.
 */
class SettingsService {
    constructor() {
        this.currentUser = null;
        this.settings = this.getDefaultSettings();
        
        this.init();
    }

    /**
     * Initialize Settings Service
     */
    init() {
        console.log('⚙️ Initializing Settings Service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        if (!this.currentUser) {
            console.error('❌ No authenticated user found');
            return;
        }
        
        this.loadSettings();
        this.loadSettingsPage();
        this.setupEventListeners();
        
        console.log('✅ Settings Service initialized');
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Listen for page changes
        window.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'settings') {
                this.refresh();
            }
        });

        // Listen for theme changes
        window.addEventListener('themeChanged', (e) => {
            this.settings.theme = e.detail.theme;
            this.saveSettings();
        });

        // Listen for language changes
        window.addEventListener('languageChanged', (e) => {
            this.settings.language = e.detail.language;
            this.saveSettings();
        });
        
        console.log('🎧 Settings service event listeners attached');
    }

    /**
     * Get Default Settings
     */
    getDefaultSettings() {
        return {
            theme: 'auto',
            language: 'en',
            privacy: {
                profileVisible: true,
                showEmail: false,
                showPhone: false
            },
            notifications: {
                email: true,
                browser: true,
                events: true,
                reminders: true
            },
            preferences: {
                autoJoinEvents: false,
                emailDigest: 'weekly',
                timezone: 'America/New_York',
                animations: true
            }
        };
    }

    /**
     * Load Settings from Storage
     */
    loadSettings() {
        const stored = localStorage.getItem('scoutpluse_settings');
        if (stored) {
            try {
                this.settings = { ...this.getDefaultSettings(), ...JSON.parse(stored) };
                console.log('📋 Settings loaded from storage');
            } catch (e) {
                console.warn('⚠️ Failed to load settings from localStorage');
                this.settings = this.getDefaultSettings();
            }
        } else {
            console.log('📋 Using default settings');
        }
    }

    /**
     * Save Settings to Storage
     */
    saveSettings() {
        try {
            localStorage.setItem('scoutpluse_settings', JSON.stringify(this.settings));
            console.log('💾 Settings saved to storage');
            
            // Dispatch settings change event
            window.dispatchEvent(new CustomEvent('settingsChanged', {
                detail: { settings: this.settings }
            }));
            
        } catch (error) {
            console.error('❌ Failed to save settings:', error);
        }
    }

    /**
     * Load Settings Page
     */
    loadSettingsPage() {
        const settingsContent = document.getElementById('settingsContent');
        if (!settingsContent || !this.currentUser) return;

        console.log('⚙️ Loading settings content...');

        settingsContent.innerHTML = this.getSettingsHTML();
        this.setupUIEventListeners();
        
        console.log('✅ Settings content loaded');
    }

    /**
     * Get Settings HTML
     */
    getSettingsHTML() {
        return `
            <div class="settings-section">
                <h3>Appearance</h3>
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Theme</h4>
                        <p>Choose your preferred color scheme</p>
                    </div>
                    <select id="themeSelect" class="settings-select">
                        <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                        <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        <option value="auto" ${this.settings.theme === 'auto' ? 'selected' : ''}>Auto (System)</option>
                    </select>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Language</h4>
                        <p>Select your preferred language</p>
                    </div>
                    <select id="languageSelect" class="settings-select">
                        <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="ar" ${this.settings.language === 'ar' ? 'selected' : ''}>العربية (Arabic)</option>
                    </select>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Animations</h4>
                        <p>Enable or disable interface animations</p>
                    </div>
                    <div class="toggle-switch ${this.settings.preferences.animations ? 'active' : ''}" data-setting="preferences.animations"></div>
                </div>
            </div>

            <div class="settings-section">
                <h3>Privacy</h3>
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Profile Visibility</h4>
                        <p>Make your profile visible to other troop members</p>
                    </div>
                    <div class="toggle-switch ${this.settings.privacy.profileVisible ? 'active' : ''}" data-setting="privacy.profileVisible"></div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Show Email</h4>
                        <p>Display your email address on your profile</p>
                    </div>
                    <div class="toggle-switch ${this.settings.privacy.showEmail ? 'active' : ''}" data-setting="privacy.showEmail"></div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Show Phone</h4>
                        <p>Display your phone number on your profile</p>
                    </div>
                    <div class="toggle-switch ${this.settings.privacy.showPhone ? 'active' : ''}" data-setting="privacy.showPhone"></div>
                </div>
            </div>

            <div class="settings-section">
                <h3>Notifications</h3>
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Email Notifications</h4>
                        <p>Receive notifications via email</p>
                    </div>
                    <div class="toggle-switch ${this.settings.notifications.email ? 'active' : ''}" data-setting="notifications.email"></div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Browser Notifications</h4>
                        <p>Show notifications in your browser</p>
                    </div>
                    <div class="toggle-switch ${this.settings.notifications.browser ? 'active' : ''}" data-setting="notifications.browser"></div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Event Notifications</h4>
                        <p>Get notified about new events and updates</p>
                    </div>
                    <div class="toggle-switch ${this.settings.notifications.events ? 'active' : ''}" data-setting="notifications.events"></div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Email Digest</h4>
                        <p>How often to receive email summaries</p>
                    </div>
                    <select id="emailDigestSelect" class="settings-select">
                        <option value="daily" ${this.settings.preferences.emailDigest === 'daily' ? 'selected' : ''}>Daily</option>
                        <option value="weekly" ${this.settings.preferences.emailDigest === 'weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="monthly" ${this.settings.preferences.emailDigest === 'monthly' ? 'selected' : ''}>Monthly</option>
                        <option value="never" ${this.settings.preferences.emailDigest === 'never' ? 'selected' : ''}>Never</option>
                    </select>
                </div>
            </div>

            ${this.currentUser.role === 'admin' ? this.getAdminSettingsHTML() : ''}

            <div class="settings-section">
                <h3>Account</h3>
                <div class="settings-actions">
                    <button class="btn btn-outline" onclick="window.SettingsService.getInstance().exportData()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7,10 12,15 17,10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export Data
                    </button>
                    
                    <button class="btn btn-outline" onclick="window.SettingsService.getInstance().resetSettings()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="1,4 1,10 7,10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                        Reset Settings
                    </button>
                    
                    <button class="btn btn-outline" style="color: var(--red-600); border-color: var(--red-600);" onclick="window.SettingsService.getInstance().deleteAccount()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete Account
                    </button>
                </div>
            </div>

            <div class="settings-section">
                <div style="text-align: center; padding: var(--spacing-4); background: var(--bg-secondary); border-radius: var(--radius-xl);">
                    <h4 style="margin-bottom: var(--spacing-2);">ScoutPluse</h4>
                    <p style="color: var(--text-muted); font-size: var(--font-size-sm);">Version 1.0.0</p>
                    <p style="color: var(--text-muted); font-size: var(--font-size-xs); margin-top: var(--spacing-2);">
                        Built with ❤️ for the scouting community
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Get Admin Settings HTML
     */
    getAdminSettingsHTML() {
        return `
            <div class="settings-section">
                <h3>Administration</h3>
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Troop Management</h4>
                        <p>Manage troop settings and member permissions</p>
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="window.SettingsService.getInstance().manageTroop()">
                        Manage
                    </button>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>System Backup</h4>
                        <p>Create and manage system backups</p>
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="window.SettingsService.getInstance().createBackup()">
                        Backup
                    </button>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>User Reports</h4>
                        <p>Generate reports on user activity and engagement</p>
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="window.SettingsService.getInstance().generateReports()">
                        Reports
                    </button>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Local Storage Test</h4>
                        <p>Test the local storage functionality</p>
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="window.SettingsService.getInstance().testLocalStorage()">
                        Test Storage
                    </button>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Storage Info</h4>
                        <p>View local storage usage and statistics</p>
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="window.SettingsService.getInstance().showStorageInfo()">
                        View Info
                    </button>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Clear Local Data</h4>
                        <p>Clear all locally stored events and settings</p>
                    </div>
                    <button class="btn btn-outline btn-sm" style="color: var(--red-600); border-color: var(--red-600);" onclick="window.SettingsService.getInstance().clearLocalData()">
                        Clear Data
                    </button>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Auto Sync</h4>
                        <p>Automatically check for updates to events.json file (Always enabled)</p>
                    </div>
                    <div class="toggle-switch active" style="opacity: 0.6; pointer-events: none;" title="Auto sync is always enabled">
                        <span style="font-size: 12px; color: var(--text-muted);">Always On</span>
                    </div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Sync Interval</h4>
                        <p>How often to check for updates (in seconds)</p>
                    </div>
                    <select id="syncIntervalSelect" class="settings-select">
                        <option value="15000" ${this.getAutoSyncInterval() === 15000 ? 'selected' : ''}>15 seconds</option>
                        <option value="30000" ${this.getAutoSyncInterval() === 30000 ? 'selected' : ''}>30 seconds</option>
                        <option value="60000" ${this.getAutoSyncInterval() === 60000 ? 'selected' : ''}>1 minute</option>
                        <option value="300000" ${this.getAutoSyncInterval() === 300000 ? 'selected' : ''}>5 minutes</option>
                    </select>
                </div>
                
                <div class="settings-item">
                    <div class="settings-item-info">
                        <h4>Manual Sync</h4>
                        <p>Force check for updates right now</p>
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="window.SettingsService.getInstance().triggerManualSync()">
                        Sync Now
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Setup UI Event Listeners
     */
    setupUIEventListeners() {
        // Toggle switches
        const toggles = document.querySelectorAll('.toggle-switch[data-setting]');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', this.handleToggle.bind(this));
        });

        // Select dropdowns
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', this.handleThemeChange.bind(this));
        }

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', this.handleLanguageChange.bind(this));
        }

        const emailDigestSelect = document.getElementById('emailDigestSelect');
        if (emailDigestSelect) {
            emailDigestSelect.addEventListener('change', this.handleEmailDigestChange.bind(this));
        }

        const syncIntervalSelect = document.getElementById('syncIntervalSelect');
        if (syncIntervalSelect) {
            syncIntervalSelect.addEventListener('change', this.handleSyncIntervalChange.bind(this));
        }
    }

    /**
     * Handle Toggle Switch
     */
    handleToggle(e) {
        const toggle = e.currentTarget;
        const settingPath = toggle.dataset.setting;
        
        toggle.classList.toggle('active');
        const isActive = toggle.classList.contains('active');
        
        console.log(`🔄 Toggle setting: ${settingPath} = ${isActive}`);
        
        this.setSetting(settingPath, isActive);
        this.saveSettings();
        
        // معالجة خاصة لإعداد Auto Sync
        if (settingPath === 'autoSync') {
            this.handleAutoSyncToggle(isActive);
        }
        
        this.showNotification(`${this.getSettingDisplayName(settingPath)} ${isActive ? 'enabled' : 'disabled'}`, 'info');
    }

    /**
     * Handle Theme Change
     */
    handleThemeChange(e) {
        const theme = e.target.value;
        console.log(`🎨 Theme changed to: ${theme}`);
        
        this.settings.theme = theme;
        this.saveSettings();
        
        // Apply theme immediately
        if (window.ThemeService?.getInstance) {
            const themeService = window.ThemeService.getInstance();
            themeService.applyTheme(theme);
        }
    }

    /**
     * Handle Language Change
     */
    handleLanguageChange(e) {
        const language = e.target.value;
        console.log(`🌐 Language changed to: ${language}`);
        
        this.settings.language = language;
        this.saveSettings();
        
        // Apply language immediately
        if (window.TranslationService?.getInstance) {
            const translationService = window.TranslationService.getInstance();
            translationService.setLanguage(language);
        }
    }

    /**
     * Handle Email Digest Change
     */
    handleEmailDigestChange(e) {
        const digest = e.target.value;
        console.log(`📧 Email digest changed to: ${digest}`);
        
        this.settings.preferences.emailDigest = digest;
        this.saveSettings();
        
        this.showNotification(`Email digest set to ${digest}`, 'info');
    }

    /**
     * Handle Auto Sync Toggle
     */
    handleAutoSyncToggle(enabled) {
        console.log(`🔄 Auto sync ${enabled ? 'enabled' : 'disabled'}`);
        
        const autoSyncService = window.getAutoSyncService?.();
        if (autoSyncService) {
            if (enabled) {
                autoSyncService.enableSync();
            } else {
                autoSyncService.disableSync();
            }
        }
    }

    /**
     * Handle Sync Interval Change
     */
    handleSyncIntervalChange(e) {
        const interval = parseInt(e.target.value);
        console.log(`⏰ Sync interval changed to: ${interval}ms`);
        
        const autoSyncService = window.getAutoSyncService?.();
        if (autoSyncService) {
            autoSyncService.setPollingInterval(interval);
        }
        
        this.showNotification(`Sync interval set to ${interval / 1000} seconds`, 'info');
    }

    /**
     * Get Auto Sync Enabled Status
     */
    getAutoSyncEnabled() {
        const autoSyncService = window.getAutoSyncService?.();
        return autoSyncService ? autoSyncService.getSyncInfo().isEnabled : false;
    }

    /**
     * Get Auto Sync Interval
     */
    getAutoSyncInterval() {
        const autoSyncService = window.getAutoSyncService?.();
        return autoSyncService ? autoSyncService.getSyncInfo().pollInterval : 30000;
    }

    /**
     * Trigger Manual Sync
     */
    async triggerManualSync() {
        console.log('🔄 Manual sync triggered from settings');
        
        const autoSyncService = window.getAutoSyncService?.();
        if (autoSyncService) {
            await autoSyncService.syncNow();
        } else {
            this.showNotification('Auto sync service not available', 'error');
        }
    }

    /**
     * Set Setting Value
     */
    setSetting(path, value) {
        const keys = path.split('.');
        let current = this.settings;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    }

    /**
     * Get Setting Display Name
     */
    getSettingDisplayName(settingPath) {
        const names = {
            'privacy.profileVisible': 'Profile Visibility',
            'privacy.showEmail': 'Email Visibility',
            'privacy.showPhone': 'Phone Visibility',
            'notifications.email': 'Email Notifications',
            'notifications.browser': 'Browser Notifications',
            'notifications.events': 'Event Notifications',
            'preferences.animations': 'Animations',
            'autoSync': 'Auto Sync'
        };
        return names[settingPath] || settingPath;
    }

    // ===========================================
    // ADMIN FUNCTIONS
    // ===========================================

    /**
     * Manage Troop
     */
    manageTroop() {
        console.log('👥 Opening troop management...');
        this.showNotification('Troop Management feature coming soon!', 'info');
    }

    /**
     * Create Backup
     */
    createBackup() {
        console.log('💾 Creating system backup...');
        this.showNotification('System Backup feature coming soon!', 'info');
    }

    /**
     * Generate Reports
     */
    generateReports() {
        console.log('📊 Generating user reports...');
        this.showNotification('User Reports feature coming soon!', 'info');
    }

    /**
     * Test Local Storage
     */
    async testLocalStorage() {
        console.log('🔍 Testing local storage...');
        
        if (!window.getDataManagerService) {
            this.showNotification('Data Manager not available', 'error');
            return;
        }

        try {
            const dataManager = window.getDataManagerService();
            const result = await dataManager.testConnection();
            
            if (result.success) {
                this.showNotification(`Local storage test successful! Found ${result.eventsCount || 0} events.`, 'success');
            } else {
                this.showNotification(`Local storage test failed: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error('❌ Storage test failed:', error);
            this.showNotification(`Storage test failed: ${error.message}`, 'error');
        }
    }

    /**
     * Show Storage Info
     */
    showStorageInfo() {
        console.log('📊 Showing storage info...');
        
        if (!window.getLocalStorageService) {
            this.showNotification('Local Storage Service not available', 'error');
            return;
        }

        try {
            const localStorageService = window.getLocalStorageService();
            const stats = localStorageService.getStorageStats();
            
            const message = `Storage Info:
Events: ${stats.totalEvents}
Users: ${stats.totalUsers}
Storage Used: ${stats.storageUsed.kb} KB`;
            
            alert(message);
            
        } catch (error) {
            console.error('❌ Failed to get storage info:', error);
            this.showNotification('Failed to get storage info', 'error');
        }
    }

    /**
     * Clear Local Data
     */
    clearLocalData() {
        console.log('🗑️ Clearing local data...');
        
        if (confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
            try {
                const localStorageService = window.getLocalStorageService();
                localStorageService.clearAllData();
                
                this.showNotification('Local data cleared successfully. Reloading...', 'info');
                
                // إعادة تحميل الصفحة بعد تأخير قصير
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            } catch (error) {
                console.error('❌ Failed to clear data:', error);
                this.showNotification('Failed to clear local data', 'error');
            }
        } else {
            console.log('❌ Clear data cancelled');
        }
    }

    // ===========================================
    // ACCOUNT FUNCTIONS
    // ===========================================

    /**
     * Export Data
     */
    exportData() {
        console.log('📤 Exporting user data...');
        
        const data = {
            user: this.currentUser,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scoutpluse-data-${this.currentUser.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
        
        console.log('✅ User data exported');
    }

    /**
     * Reset Settings
     */
    resetSettings() {
        console.log('🔄 Resetting settings...');
        
        if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
            this.settings = this.getDefaultSettings();
            this.saveSettings();
            this.loadSettingsPage();
            this.showNotification('Settings reset to default', 'info');
            
            console.log('✅ Settings reset to default');
        } else {
            console.log('❌ Settings reset cancelled');
        }
    }

    /**
     * Delete Account
     */
    deleteAccount() {
        console.log('🗑️ Account deletion requested...');
        
        const confirmation = prompt('This will permanently delete your account and all associated data. Type "DELETE" to confirm:');
        if (confirmation === 'DELETE') {
            this.showNotification('Account deletion feature coming soon!', 'info');
            console.log('⚠️ Account deletion feature not implemented');
        } else {
            console.log('❌ Account deletion cancelled');
        }
    }

    /**
     * Show Notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Get Notification Icon
     */
    getNotificationIcon(type) {
        const icons = {
            success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>',
            error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
            warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        };
        return icons[type] || icons.info;
    }

    /**
     * Refresh Settings Service
     */
    refresh() {
        console.log('🔄 Refreshing settings service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        if (!this.currentUser) {
            console.warn('⚠️ No authenticated user for settings refresh');
            return;
        }
        
        this.loadSettingsPage();
        
        console.log('✅ Settings service refreshed');
    }

    /**
     * Get Settings
     */
    getSettings() {
        return this.settings;
    }

    /**
     * Get Setting Value
     */
    getSetting(path) {
        const keys = path.split('.');
        let current = this.settings;
        
        for (const key of keys) {
            if (current[key] === undefined) {
                return undefined;
            }
            current = current[key];
        }
        
        return current;
    }

    /**
     * Get Settings Data
     */
    getSettingsData() {
        return {
            settings: this.settings,
            currentUser: this.currentUser,
            lastUpdate: new Date().toISOString()
        };
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let settingsServiceInstance = null;

/**
 * Get Settings Service Instance
 * @returns {SettingsService} Settings service instance
 */
function getSettingsService() {
    if (!settingsServiceInstance) {
        settingsServiceInstance = new SettingsService();
    }
    return settingsServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.AuthService?.isAuthenticated()) {
        console.log('⚙️ Initializing Settings Service...');
        window.settingsService = getSettingsService();
    }
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.SettingsService = SettingsService;
window.getSettingsService = getSettingsService;

console.log('⚙️ Settings service module loaded');