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
            link.classList.toggle('active', link.dataset.page === activePage);
        });

        // Update bottom navigation
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === activePage);
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
        if (!this.currentUser) {
            console.warn('⚠️ No user authenticated');
            return false;
        }
        
        const allowedPages = window.ROLE_PERMISSIONS?.[this.currentUser.role] || [];
        const hasAccess = allowedPages.includes(page);
        
        console.log(`🔐 Access check for ${page}: ${hasAccess ? 'ALLOWED' : 'DENIED'}`);
        return hasAccess;
    }

    /**
     * Close Mobile Menu
     */
    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('📱 Mobile menu closed');
    }

    /**
     * Refresh Page Content
     * Triggers content refresh for the current page
     * 
     * @param {string} page - Page to refresh
     */
    refreshPageContent(page) {
        console.log(`🔄 Refreshing content for: ${page}`);
        
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
    // PUBLIC API
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

console.log('📜 Navigation service module loaded');