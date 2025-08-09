/* 
===========================================
SCOUTPLUSE - NAVIGATION SERVICE
===========================================

Handles all navigation functionality including:
1. Page routing and transitions
2. URL management
3. Navigation state updates
4. Permission-based navigation
5. Mobile navigation handling
*/

/**
 * Navigation Service Class
 * 
 * Manages all aspects of application navigation including page transitions,
 * URL routing, and navigation state management.
 */
class NavigationService {
    constructor() {
        this.currentPage = 'dashboard';
        this.previousPage = null;
        this.currentUser = null;
        this.navigationHistory = [];
        
        this.init();
    }

    /**
     * Initialize Navigation Service
     */
    init() {
        console.log('🧭 Initializing Navigation Service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        this.setupEventListeners();
        this.updateNavigationVisibility();
        
        // Set initial page from URL
        const initialPage = this.getPageFromHash();
        this.navigateTo(initialPage, false);
        
        console.log('✅ Navigation Service initialized');
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('[data-page]');
            if (navLink) {
                e.preventDefault();
                const page = navLink.dataset.page;
                console.log(`🔗 Navigation clicked: ${page}`);
                this.navigateTo(page);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || this.getPageFromHash();
            console.log(`⬅️ Browser navigation: ${page}`);
            this.navigateTo(page, false);
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const page = this.getPageFromHash();
            console.log(`🔗 Hash changed: ${page}`);
            this.navigateTo(page, false);
        });

        // Listen for page refresh events
        window.addEventListener('pageRefresh', (e) => {
            const { page } = e.detail;
            console.log(`🔄 Page refresh requested for: ${page}`);
            this.refreshPageContent(page);
        });

        // Listen for navigation events from other services
        window.addEventListener('pageChanged', (e) => {
            const { page } = e.detail;
            console.log(`📄 Page changed event received: ${page}`);
            this.currentPage = page;
            this.updatePageVisibility(page);
            this.updateNavigationStates(page);
        });

        // Handle mobile user avatar click
        document.addEventListener('click', (e) => {
            const mobileUserAvatar = e.target.closest('#mobileUserAvatar');
            if (mobileUserAvatar) {
                e.preventDefault();
                console.log('👤 Mobile user avatar clicked - navigating to profile');
                
                // Add visual feedback
                mobileUserAvatar.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    mobileUserAvatar.style.transform = '';
                }, 150);
                
                // Add haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                
                // Navigate to profile
                this.navigateTo('profile');
            }
        });
        
        console.log('🎧 Navigation event listeners attached');
    }

    /**
     * Get Page from URL Hash
     * @returns {string} Page name from URL hash
     */
    getPageFromHash() {
        const hash = window.location.hash.substring(1);
        return hash || 'dashboard';
    }

    /**
     * Navigate to Page
     * 
     * @param {string} page - Target page
     * @param {boolean} updateHistory - Whether to update browser history
     */
    navigateTo(page, updateHistory = true) {
        console.log(`🚀 Navigating to: ${page}`);
        
        // Validate page access
        if (!this.canAccessPage(page)) {
            console.warn(`⚠️ Access denied to page: ${page}. Redirecting to dashboard.`);
            page = 'dashboard';
        }

        // Store previous page
        this.previousPage = this.currentPage;
        
        // Update current page
        this.currentPage = page;
        
        // Add to navigation history
        this.navigationHistory.push({
            page,
            timestamp: Date.now(),
            from: this.previousPage
        });

        // Update page visibility
        this.updatePageVisibility(page);

        // Update navigation states
        this.updateNavigationStates(page);

        // Update URL
        if (updateHistory) {
            const url = `#${page}`;
            history.pushState({ page }, '', url);
            console.log(`🔗 URL updated: ${url}`);
        }

        // Close mobile menu if open
        this.closeMobileMenu();

        // Update mobile back button
        this.updateMobileBackButton(page);

        // Refresh page content
        this.refreshPageContent(page);

        // Dispatch navigation event
        window.dispatchEvent(new CustomEvent('pageChanged', { 
            detail: { 
                page, 
                previousPage: this.previousPage,
                navigationHistory: this.navigationHistory
            } 
        }));

        console.log(`✅ Navigation complete: ${this.previousPage} → ${page}`);
    }

    /**
     * Update Page Visibility
     * Shows the active page and hides others
     * 
     * @param {string} activePage - The page to show
     */
    updatePageVisibility(activePage) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            const pageId = page.id.replace('Page', '');
            const isActive = pageId === activePage;
            
            page.classList.toggle('active', isActive);
            
            // Add entrance animation for active page
            if (isActive) {
                page.style.animation = 'fadeInUp 0.3s ease';
            }
        });
        
        console.log(`👁️ Page visibility updated: ${activePage} is now active`);
    }

    /**
     * Update Navigation States
     * Updates active states for navigation elements
     * 
     * @param {string} activePage - The currently active page
     */
    updateNavigationStates(activePage) {
        // Update sidebar navigation
        const sidebarLinks = document.querySelectorAll('.nav-link');
        sidebarLinks.forEach(link => {
            const isActive = link.dataset.page === activePage;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });

        // Update bottom navigation
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            const isActive = item.dataset.page === activePage;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        
        console.log(`🎯 Navigation states updated for: ${activePage}`);
    }

    /**
     * Update Navigation Visibility
     * Shows/hides navigation items based on user permissions
     */
    updateNavigationVisibility() {
        if (!this.currentUser) {
            console.warn('⚠️ Cannot update navigation: No current user');
            return;
        }

        const allowedPages = window.ROLE_PERMISSIONS?.[this.currentUser.role] || [];
        
        console.log(`🔐 Updating navigation for role: ${this.currentUser.role}`);
        console.log(`📋 Allowed pages: ${allowedPages.join(', ')}`);
        
        // Update sidebar navigation
        const sidebarItems = document.querySelectorAll('.nav-item');
        sidebarItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const page = link?.dataset.page;
            
            if (page && allowedPages.includes(page)) {
                item.style.display = '';
                console.log(`✅ Showing sidebar item: ${page}`);
            } else {
                item.style.display = 'none';
                console.log(`❌ Hiding sidebar item: ${page}`);
            }
        });

        // Update bottom navigation
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            const page = item.dataset.page;
            
            if (page && allowedPages.includes(page)) {
                item.style.display = '';
                console.log(`✅ Showing bottom nav item: ${page}`);
            } else {
                item.style.display = 'none';
                console.log(`❌ Hiding bottom nav item: ${page}`);
            }
        });
    }

    /**
     * Update Mobile Back Button
     * Shows/hides the mobile back button based on current page
     * 
     * @param {string} page - Current page
     */
    updateMobileBackButton(page) {
        const mobileBackBtn = document.getElementById('mobileBackBtn');
        if (!mobileBackBtn) return;
        
        // Show back button on all pages except dashboard
        if (page === 'dashboard') {
            mobileBackBtn.classList.remove('visible');
        } else {
            mobileBackBtn.classList.add('visible');
        }
        
        console.log(`⬅️ Mobile back button ${page === 'dashboard' ? 'hidden' : 'shown'}`);
    }

    /**
     * Check Page Access Permission
     * 
     * @param {string} page - Page to check
     * @returns {boolean} Whether user can access the page
     */
    canAccessPage(page) {
        // If no user, treat as guest
        const userRole = this.currentUser?.role || 'guest';
        
        const allowedPages = window.ROLE_PERMISSIONS?.[userRole] || [];
        const hasAccess = allowedPages.includes(page);
        
        console.log(`🔐 Access check for ${page} (${userRole}): ${hasAccess ? 'ALLOWED' : 'DENIED'}`);
        return hasAccess;
    }

    /**
     * Close Mobile Menu
     */
    closeMobileMenu() {
        console.log('📱 Mobile menu closed (sidebar removed)');
    }

    /**
     * Refresh Page Content
     * Triggers content refresh for the current page
     * 
     * @param {string} page - Page to refresh
     */
    refreshPageContent(page) {
        console.log(`🔄 Refreshing content for: ${page}`);
        
        // Refresh content based on the current page
        switch (page) {
            case 'dashboard':
                if (window.DashboardService?.getInstance) {
                    window.DashboardService.getInstance().refresh();
                    console.log('✅ Dashboard content refreshed');
                }
                break;
                
            case 'events':
                if (window.EventsService?.getInstance) {
                    const eventsService = window.EventsService.getInstance();
                    eventsService.refresh();
                    eventsService.renderEventsPage();
                    console.log('✅ Events content refreshed');
                } else {
                    console.warn('⚠️ Events Service not available for refresh');
                }
                break;
                
            case 'information':
                if (window.InformationService?.getInstance) {
                    window.InformationService.getInstance().refresh();
                    console.log('✅ Information content refreshed');
                }
                break;
                
            case 'profile':
                if (window.ProfileService?.getInstance) {
                    window.ProfileService.getInstance().refresh();
                    console.log('✅ Profile content refreshed');
                }
                break;
                
            default:
                console.log(`ℹ️ No refresh handler for page: ${page}`);
        }
        
        // Dispatch page refresh event
        window.dispatchEvent(new CustomEvent('pageRefresh', { 
            detail: { page } 
        }));
    }

    /**
     * Go Back
     * Navigate to the previous page or dashboard
     */
    goBack() {
        if (this.previousPage && this.canAccessPage(this.previousPage)) {
            console.log(`⬅️ Going back to: ${this.previousPage}`);
            this.navigateTo(this.previousPage);
        } else {
            console.log('⬅️ Going back to dashboard (default)');
            this.navigateTo('dashboard');
        }
    }

    /**
     * Get Navigation History
     * @returns {Array} Navigation history
     */
    getNavigationHistory() {
        return [...this.navigationHistory];
    }

    /**
     * Clear Navigation History
     */
    clearNavigationHistory() {
        this.navigationHistory = [];
        console.log('🗑️ Navigation history cleared');
    }

    /**
     * Refresh Navigation
     * Updates navigation based on current user
     */
    refresh() {
        console.log('🔄 Refreshing navigation service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        this.updateNavigationVisibility();
        
        console.log('✅ Navigation service refreshed');
    }

    // ===========================================
    // PUBLIC METHODS
    // ===========================================

    /**
     * Get Current Page
     * @returns {string} Current page name
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Get Previous Page
     * @returns {string|null} Previous page name
     */
    getPreviousPage() {
        return this.previousPage;
    }

    /**
     * Check if page is current
     * @param {string} page - Page to check
     * @returns {boolean} Whether page is current
     */
    isCurrentPage(page) {
        return this.currentPage === page;
    }

    /**
     * Show Notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let navigationServiceInstance = null;

/**
 * Get Navigation Service Instance
 * @returns {NavigationService} Navigation service instance
 */
function getNavigationService() {
    if (!navigationServiceInstance) {
        navigationServiceInstance = new NavigationService();
    }
    return navigationServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.AuthService?.isAuthenticated()) {
        console.log('🧭 Initializing Navigation Service...');
        window.navigationService = getNavigationService();
    }
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.NavigationService = NavigationService;
window.getNavigationService = getNavigationService;

// دالة اختبار زر تبديل الوضع
window.testThemeToggle = function() {
    console.log('🎨 Testing theme toggle...');
    
    if (window.themeService) {
        const currentTheme = window.themeService.getTheme();
        console.log(`🎨 Current theme: ${currentTheme}`);
        
        // Toggle theme
        const newTheme = window.themeService.toggleTheme();
        console.log(`🎨 New theme: ${newTheme}`);
        
        // Show theme info
        const themeInfo = window.themeService.getThemeInfo();
        console.log('🎨 Theme info:', themeInfo);
    } else {
        console.error('❌ Theme service not available');
    }
};

console.log('📜 Navigation service module loaded');