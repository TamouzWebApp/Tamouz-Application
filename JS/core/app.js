/* 
===========================================
SCOUTPLUSE - MAIN APPLICATION CONTROLLER
===========================================

This is the main JavaScript file that orchestrates the entire ScoutPluse application.
It handles:
1. Application initialization and setup
2. Authentication state management
3. Navigation between pages
4. Mobile menu functionality
5. Theme management
6. User interface updates
7. Service coordination

The application follows a modular architecture where each major feature
(auth, events, profile, etc.) has its own service class.
*/

/**
 * Main Application Controller Class
 * 
 * This class serves as the central coordinator for the entire application.
 * It manages the overall application state, handles navigation, and
 * coordinates between different services.
 */
class ScoutPluseApp {
    constructor() {
        // Current authenticated user
        this.currentUser = null;
        
        // Current active page
        this.currentPage = 'dashboard';
        
        // Registry of all application services
        this.services = {};
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     * Sets up all core functionality and checks authentication
     */
    init() {
        console.log('🚀 Initializing ScoutPluse Application...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }
    
    /**
     * Initialize App Components
     */
    initializeApp() {
        console.log('🔧 Initializing app components...');
        
        // Check if user is authenticated
        this.checkAuthentication();
        
        // Set up event listeners for UI interactions
        this.setupEventListeners();
        
        // Initialize all application services
        this.initializeServices();
        
        // Set up navigation system
        this.setupNavigation();
        
        // Set up mobile menu functionality
        this.setupMobileMenu();
        
        // Initialize theme system
        this.setupTheme();
        this.setupThemeToggle();
        
        // Set up internationalization
        this.setupTranslations();
        
        // Set up scroll to top
        this.setupScrollToTop();
        
        // تهيئة خدمة الأحداث
        this.initializeEventsService();
        
        console.log('✅ ScoutPluse Application initialized successfully');
    }



    /**
     * Check Authentication Status
     * Determines if user is logged in and shows appropriate interface
     */
    checkAuthentication() {
        console.log('🔐 Checking authentication status...');
        
        // Get current user from AuthService
        if (window.AuthService) {
            this.currentUser = window.AuthService.getCurrentUser();
            console.log('✅ AuthService found and working');
        } else {
            console.error('❌ AuthService not found');
            this.currentUser = null;
        }
        
        if (this.currentUser) {
            console.log(`👤 User authenticated: ${this.currentUser.name} (${this.currentUser.role})`);
            this.showMainApp();
            this.updateUserInterface();
            // Initialize mobile back button for current page
            this.updateMobileBackButton(this.currentPage);
        } else {
            console.log('🔒 No authenticated user found, showing login screen');
            this.showLoginScreen();
        }
    }

    /**
     * Show Login Screen
     * Displays the login screen
     */
    showLoginScreen() {
        console.log('🔐 Showing login screen...');
        
        // Hide main app
        const mainApp = document.getElementById('mainApp');
        if (mainApp) {
            mainApp.style.display = 'none';
        }
        
        // Show login screen
        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            loginScreen.style.display = 'flex';
        }
        
        console.log('✅ Login screen displayed');
    }

    /**
     * Show Main App
     * Displays the main application interface
     */
    showMainApp() {
        console.log('🏠 Showing main application...');
        
        // Hide login screen
        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            loginScreen.style.display = 'none';
        }
        
        // Show main app
        const mainApp = document.getElementById('mainApp');
        if (mainApp) {
            mainApp.style.display = 'block';
        }
        
        console.log('✅ Main application displayed');
    }

    /**
     * Update User Interface
     * Updates UI elements based on current user
     */
    updateUserInterface() {
        if (!this.currentUser) {
            console.warn('⚠️ Cannot update UI: No current user');
            return;
        }
        
        console.log(`👤 Updating UI for user: ${this.currentUser.name}`);
        
        // Update user display
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = this.currentUser.name;
        }
        
        // Update role display
        const roleDisplay = document.getElementById('roleDisplay');
        if (roleDisplay) {
            roleDisplay.textContent = this.capitalizeRole(this.currentUser.role);
        }
        
        // Update navigation
        this.updateNavigationForRole();
        
        console.log('✅ User interface updated');
    }

    /**
     * Update Navigation for Role
     * Updates navigation visibility based on user role
     */
    updateNavigationForRole() {
        if (!this.currentUser) {
            console.warn('⚠️ Cannot update navigation: No current user');
            return;
        }
        
        console.log(`🔐 Updating navigation for role: ${this.currentUser.role}`);
        
        if (window.getNavigationService) {
            const navigationService = window.getNavigationService();
            navigationService.refresh();
        } else {
            console.warn('⚠️ Navigation service not available');
        }
    }

    /**
     * Setup Event Listeners
     * Attaches event handlers for core application functionality
     */
    setupEventListeners() {
        console.log('🎧 Setting up event listeners...');
        
        // Logout button functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
            console.log('🚪 Logout button listener attached');
        }






        
        
        // Mobile back button functionality
        const mobileBackBtn = document.getElementById('mobileBackBtn');
        if (mobileBackBtn) {
            mobileBackBtn.addEventListener('click', this.handleMobileBack.bind(this));
            console.log('⬅️ Mobile back button listener attached');
        }

        // Listen for authentication changes in other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'scoutpluse_user') {
                console.log('🔄 Authentication change detected in another tab');
                this.checkAuthentication();
            }
        });
        
        // Setup troop members modal
        const troopMembersModal = document.getElementById('troopMembersModal');
        const closeTroopMembersModal = document.getElementById('closeTroopMembersModal');
        
        if (closeTroopMembersModal) {
            closeTroopMembersModal.addEventListener('click', () => {
                troopMembersModal.style.display = 'none';
            });
        }
        
        if (troopMembersModal) {
            troopMembersModal.addEventListener('click', (e) => {
                if (e.target === troopMembersModal) {
                    troopMembersModal.style.display = 'none';
                }
            });
        }
        
        console.log('✅ Event listeners setup complete');
    }

    /**
     * Setup Navigation
     * Initializes navigation system
     */
    setupNavigation() {
        console.log('🧭 Setting up navigation...');
        
        if (window.getNavigationService) {
            this.services.navigation = window.getNavigationService();
            console.log('✅ Navigation service initialized');
        } else {
            console.warn('⚠️ Navigation service not available');
        }
    }

    /**
     * Navigate to Page
     * Handles navigation to a specific page
     * 
     * @param {string} page - Target page
     * @param {boolean} updateHistory - Whether to update browser history
     */
    navigateToPage(page, updateHistory = true) {
        console.log(`🚀 Navigating to page: ${page}`);
        
        if (window.getNavigationService) {
            const navigationService = window.getNavigationService();
            navigationService.navigateTo(page, updateHistory);
        } else {
            // Fallback navigation
            if (updateHistory) {
                window.location.hash = `#${page}`;
            }
        }
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
            mobileBackBtn.style.display = 'none';
        } else {
            mobileBackBtn.style.display = 'flex';
        }
        
        console.log(`⬅️ Mobile back button updated for page: ${page}`);
    }
    
    /**
     * Handle Mobile Back
     * Handles mobile back button functionality
     */
    handleMobileBack() {
        console.log('⬅️ Mobile back button clicked');
        
        if (window.getNavigationService) {
            const navigationService = window.getNavigationService();
            navigationService.goBack();
        } else {
            // Fallback to dashboard
            window.location.hash = '#dashboard';
        }
    }

    /**
     * Setup Mobile Menu
     * Initializes mobile menu functionality
     */
    setupMobileMenu() {
        console.log('📱 Setting up mobile menu...');
        
        // Mobile menu toggle functionality
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close mobile menu when clicking outside
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    this.toggleMobileMenu();
                }
            });
            
            console.log('✅ Mobile menu setup complete');
        } else {
            console.warn('⚠️ Mobile menu elements not found');
        }
    }

    /**
     * Setup Theme
     * Initializes theme system
     */
    setupTheme() {
        console.log('🎨 Setting up theme system...');
        
        if (window.ThemeService?.getInstance) {
            this.services.theme = window.ThemeService.getInstance();
            console.log('✅ Theme service initialized');
        } else {
            console.warn('⚠️ Theme service not available');
        }
    }

    /**
     * Setup Theme Toggle
     * Initializes theme toggle functionality
     */
    setupThemeToggle() {
        console.log('🎨 Setting up theme toggle...');
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (window.ThemeService?.getInstance) {
                    const themeService = window.ThemeService.getInstance();
                    themeService.toggleTheme();
                }
            });
            
            console.log('✅ Theme toggle setup complete');
        } else {
            console.warn('⚠️ Theme toggle button not found');
        }
    }

    /**
     * Update Theme Icon
     * Updates the theme toggle icon based on current theme
     * 
     * @param {string} theme - Current theme
     */
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('svg');
        if (!icon) return;
        
        if (theme === 'dark') {
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
        } else {
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
        
        console.log(`🎨 Theme icon updated for: ${theme}`);
    }

    /**
     * Setup Scroll to Top
     * Initializes scroll to top functionality
     */
    setupScrollToTop() {
        console.log('⬆️ Setting up scroll to top...');
        
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            // Show/hide scroll to top button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.style.display = 'flex';
                } else {
                    scrollToTopBtn.style.display = 'none';
                }
            });
            
            // Scroll to top when button is clicked
            scrollToTopBtn.addEventListener('click', () => {
                this.scrollToTop();
            });
            
            console.log('✅ Scroll to top setup complete');
        } else {
            console.warn('⚠️ Scroll to top button not found');
        }
    }

    /**
     * Setup Translations
     * Initializes translation system
     */
    setupTranslations() {
        console.log('🌐 Setting up translations...');
        
        if (window.TranslationService?.getInstance) {
            this.services.translations = window.TranslationService.getInstance();
            console.log('✅ Translation service initialized');
        } else {
            console.warn('⚠️ Translation service not available');
        }
    }

    /**
     * Initialize all application services
     */
    initializeServices() {
        console.log('⚙️ Initializing application services...');
        
        // Services are initialized by their respective files
        // This method can be used to coordinate service initialization
        // and register services in the services registry
        
        console.log('✅ Services initialization complete');
    }

    /**
     * Initialize Events Service
     */
    initializeEventsService() {
        console.log('📅 Initializing Events Service...');
        
        // تأخير قصير للتأكد من تحميل جميع الملفات
        setTimeout(() => {
            if (window.getEventsService) {
                const eventsService = window.getEventsService();
                console.log('✅ Events Service initialized');
                
                // إذا كان المستخدم مصادق عليه، قم بتحديث الخدمة
                if (this.currentUser) {
                    console.log('👤 User is authenticated, refreshing events service...');
                    eventsService.refresh();
                }
            } else {
                console.warn('⚠️ Events Service not available');
            }
        }, 2000);
    }

    /**
     * Refresh Page Content
     * Triggers content refresh for the specified page
     * 
     * @param {string} page - The page to refresh
     */
    refreshPageContent(page) {
        console.log(`🔄 Refreshing content for page: ${page}`);
        
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
                    window.EventsService.getInstance().refresh();
                    console.log('✅ Events content refreshed');
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
    }

    /**
     * Handle Logout
     * Processes user logout and cleans up application state
     */
    handleLogout() {
        console.log('🚪 Logout requested');
        
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            console.log('✅ Logout confirmed');
            
            // Clear authentication
            if (window.AuthService) {
                window.AuthService.logout();
            }
            this.currentUser = null;
            
            // Show login screen
            this.showLoginScreen();
            
            // Clear any cached data
            this.services = {};
            
            // Reset to default page
            this.currentPage = 'dashboard';
            history.replaceState(null, '', '#dashboard');
            
            console.log('✅ Logout completed successfully');
        } else {
            console.log('❌ Logout cancelled');
        }
    }

    /**
     * Capitalize Role
     * Utility function to format role names
     * 
     * @param {string} role - The role to capitalize
     * @returns {string} Capitalized role name
     */
    capitalizeRole(role) {
        const roleMap = {
            'admin': 'مدير',
            'leader': 'قائد',
            'member': 'عضو',
            'guest': 'زائر'
        };
        
        return roleMap[role] || role;
    }

    // ===========================================
    // PUBLIC API METHODS
    // ===========================================
    // These methods provide external access to application state

    /**
     * Get Current User
     * @returns {Object|null} Current authenticated user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get Current Page
     * @returns {string} Current active page
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Get Service
     * @param {string} serviceName - Name of the service to get
     * @returns {Object|null} Service instance
     */
    getService(serviceName) {
        return this.services[serviceName] || null;
    }

    /**
     * Register Service
     * @param {string} serviceName - Name of the service
     * @param {Object} service - Service instance
     */
    registerService(serviceName, service) {
        this.services[serviceName] = service;
        console.log(`📝 Service registered: ${serviceName}`);
    }

    /**
     * Toggle Mobile Menu
     * Shows/hides the mobile navigation menu
     */
    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            const isVisible = mobileMenu.style.display === 'flex';
            mobileMenu.style.display = isVisible ? 'none' : 'flex';
            console.log(`📱 Mobile menu ${isVisible ? 'hidden' : 'shown'}`);
        }
    }

    /**
     * Scroll to Top
     * Smoothly scrolls the page to the top
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        console.log('⬆️ Scrolled to top');
    }
}

// ===========================================
// APPLICATION INITIALIZATION
// ===========================================

/**
 * Global application instance
 * This will be available throughout the application
 */
let scoutPluseApp;

/**
 * Initialize the application when DOM is ready
 * This ensures all HTML elements are available before setup
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM Content Loaded - Starting ScoutPluse...');
    
    // Create and initialize the main application
    scoutPluseApp = new ScoutPluseApp();
    
    // Make application globally accessible
    window.scoutPluseApp = scoutPluseApp;
    
    console.log('🎉 ScoutPluse Application Ready!');
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

// Export the main application class for use in other files
window.ScoutPluseApp = ScoutPluseApp;

// ===========================================
// ERROR HANDLING
// ===========================================

/**
 * Global error handler for unhandled JavaScript errors
 */
window.addEventListener('error', (event) => {
    console.error('💥 Global Error:', event.error);
    
    // In production, you might want to send this to an error reporting service
    // For now, we'll just log it to the console
});

/**
 * Global handler for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Unhandled Promise Rejection:', event.reason);
    
    // Prevent the default browser behavior (logging to console)
    event.preventDefault();
});

console.log('📜 Main application script loaded successfully');