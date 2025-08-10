/* 
===========================================
SCOUTPLUSE - AUTHENTICATION SERVICE
===========================================

This file handles all authentication-related functionality including:
1. User login and logout
2. Session management
3. User data loading
4. Login form handling
5. Demo account functionality

The authentication system uses localStorage for session persistence
and supports multiple user roles with different permissions.
*/

/**
 * Authentication Service Class
 * 
 * Handles all authentication operations including login, logout,
 * and session management. Uses localStorage for persistence.
 */
class AuthService {
    // Storage key for user session data
    static STORAGE_KEY = 'scoutpluse_user';
    
    // Cache for user data
    static users = null;
    
    // Singleton instance
    static instance = null;

    constructor() {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        
        AuthService.instance = this;
        this.init();
    }

    /**
     * Initialize Authentication Service
     */
    init() {
        console.log('🔐 Initializing Authentication Service...');
        
        // Setup login form if it exists
        this.setupLoginForm();
        
        console.log('✅ Authentication Service initialized');
    }

    /**
     * Setup Login Form
     */
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            this.loginHandler = new LoginHandler();
            console.log('📝 Login form handler initialized');
        }
    }

    /**
     * Load Users from JSON File
     * 
     * Attempts to load user data from users.json file.
     * 
     * @returns {Promise<Object>} User data object
     */
    static async loadUsers() {
        // Return cached data if already loaded
        if (this.users) {
            console.log('📋 Using cached user data');
            return this.users;
        }
        
        console.log('📥 Loading user data...');
        
        try {
            // Attempt to load from JSON file
            const usersFilePath = window.getUsersFilePath() || './JSON/users.json';
            const response = await fetch(usersFilePath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.users = {};
            
            // Convert array to object with username as key
            data.users.forEach(user => {
                this.users[user.username] = user;
                console.log(`👤 Loaded user: ${user.username} (${user.role})`);
            });
            
            console.log(`✅ Successfully loaded ${data.users.length} users from JSON`);
            return this.users;
            
        } catch (error) {
            console.error('❌ Failed to load users from JSON file:', error.message);
            console.log('🔄 Using fallback user data');
            
            // Initialize with fallback user data
            this.users = {
                'admin': {
                    id: '1',
                    name: 'Admin',
                    username: 'admin',
                    email: 'admin@scouts.org',
                    password: 'admin',
                    role: 'admin',
                    troop: 'Development',
                    phone: 'None',
                    joinDate: 'None',
                    bio: 'System administrator with full access to all features.'
                },
                'bashar': {
                    id: '2',
                    name: 'Bashar 3kazi',
                    username: 'bashar',
                    email: 'Bashar3kazi@scouts.org',
                    password: 'Bashar',
                    role: 'leader',
                    troop: 'Ramita',
                    badges: [],
                    phone: 'None',
                    joinDate: '2019-09-20',
                    bio: 'Experienced scout leader passionate about youth development and outdoor activities.'
                },
                'kinan': {
                    id: '3',
                    name: 'Kinan Kassab',
                    username: 'kinan',
                    email: 'KinanKassab@scouts.org',
                    password: 'Kinan',
                    role: 'member',
                    troop: 'Ramita',
                    badges: [],
                    phone: '+963 982 175 721',
                    joinDate: '2023-09-20',
                    bio: 'Active scout member interested in camping, hiking, and community service.'
                },
                'guest': {
                    id: '4',
                    name: 'Guest',
                    username: 'guest',
                    email: 'Guest@scout.org',
                    password: 'Guest',
                    role: 'guest',
                    troop: 'None',
                    badges: [],
                    phone: 'None',
                    joinDate: 'None',
                    bio: 'Guest user with limited access to view-only features.'
                }
            };
            
            console.log('✅ Fallback user data loaded successfully');
            return this.users;
        }
    }

    /**
     * User Login
     * 
     * Authenticates a user with username and password.
     * Simulates local authentication with delay for realistic UX.
     * 
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<Object|null>} User object if successful, null if failed
     */
    static async login(username, password) {
        console.log(`🔐 Attempting login for: ${username}`);
        
        // Simulate local authentication delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load user data
        const users = await this.loadUsers();
        
        // Check if users were loaded successfully
        if (!users || Object.keys(users).length === 0) {
            console.error('❌ No users data available');
            throw new Error('User data not available');
        }
        
        console.log(`📋 Available users: ${Object.keys(users).join(', ')}`);
        
        const user = users[username];
        
        // Validate credentials
        if (user && user.password === password) {
            console.log(`✅ Login successful for: ${username}`);
            
            // Store user session
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            
            // Log user details (excluding password)
            const { password: _, ...userInfo } = user;
            console.log('👤 User details:', userInfo);
            
            // Dispatch login event
            window.dispatchEvent(new CustomEvent('userLoggedIn', { 
                detail: { user: userInfo } 
            }));
            
            return user;
        }
        
        console.log(`❌ Login failed for: ${username}`);
        return null;
    }

    /**
     * User Logout
     * 
     * Clears the user session and removes stored data.
     */
    static logout() {
        console.log('🚪 Logging out user');
        
        const currentUser = this.getCurrentUser();
        
        // Remove user session from storage
        localStorage.removeItem(this.STORAGE_KEY);
        
        // Dispatch logout event
        if (currentUser) {
            window.dispatchEvent(new CustomEvent('userLoggedOut', { 
                detail: { user: currentUser } 
            }));
        }
        
        console.log('✅ User logged out successfully');
    }

    /**
     * Get Current User
     * 
     * Retrieves the currently authenticated user from storage.
     * 
     * @returns {Object|null} Current user object or null if not authenticated
     */
    static getCurrentUser() {
        try {
            const storedUser = localStorage.getItem(this.STORAGE_KEY);
            
            if (storedUser) {
                const user = JSON.parse(storedUser);
                return user;
            }
            
            return null;
            
        } catch (error) {
            console.error('❌ Error retrieving current user:', error);
            return null;
        }
    }

    /**
     * Check Authentication Status
     * 
     * Determines if a user is currently authenticated.
     * 
     * @returns {boolean} True if user is authenticated, false otherwise
     */
    static isAuthenticated() {
        const user = this.getCurrentUser();
        const isAuth = user !== null;
        
        return isAuth;
    }

    /**
     * Update User Data
     * 
     * Updates the current user's data in storage.
     * 
     * @param {Object} userData - Updated user data
     */
    static updateUser(userData) {
        console.log('📝 Updating user data');
        
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
            
            // Dispatch user update event
            window.dispatchEvent(new CustomEvent('userUpdated', { 
                detail: { user: userData } 
            }));
            
            console.log('✅ User data updated successfully');
        } catch (error) {
            console.error('❌ Error updating user data:', error);
        }
    }

    /**
     * Get Singleton Instance
     * @returns {AuthService} Authentication service instance
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthService();
        }
        return this.instance;
    }
}

/**
 * Login Form Handler Class
 * 
 * Manages the login form UI, validation, and user interactions.
 * Handles form submission, demo accounts, and visual feedback.
 */
class LoginHandler {
    constructor() {
        console.log('🎨 Initializing login form handler');
        
        // Get form elements
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.loginBtn = document.getElementById('loginBtn');
        this.errorDiv = document.getElementById('loginError');
        this.demoAccounts = document.querySelectorAll('.demo-account');
        
        // Initialize if form exists
        if (this.form) {
            this.init();
            console.log('✅ Login form handler initialized');
        } else {
            console.log('ℹ️ Login form not found, skipping initialization');
        }
    }

    /**
     * Initialize Login Handler
     * 
     * Sets up event listeners and form functionality.
     */
    init() {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Password visibility toggle
        if (this.passwordToggle) {
            this.passwordToggle.addEventListener('click', this.togglePassword.bind(this));
        }
        
        // Demo account buttons
        this.demoAccounts.forEach(account => {
            account.addEventListener('click', this.fillDemoAccount.bind(this));
        });
        
        // Input validation on change
        if (this.usernameInput) {
            this.usernameInput.addEventListener('input', this.validateUsername.bind(this));
        }
        
        if (this.passwordInput) {
            this.passwordInput.addEventListener('input', this.validatePassword.bind(this));
        }
        
        console.log('🎧 Login form event listeners attached');
    }

    /**
     * Handle Form Submission
     * 
     * Processes login form submission with validation and authentication.
     * 
     * @param {Event} e - Form submission event
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        console.log('📝 Login form submitted');
        
        // Get form values
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        
        // Basic validation
        if (!this.validateForm(username, password)) {
            return;
        }
        
        // Show loading state
        this.setLoading(true);
        this.hideError();
        
        try {
            console.log(`🔐 Attempting authentication for: ${username}`);
            
            // Attempt login
            const user = await AuthService.login(username, password);
            
            if (user) {
                console.log('✅ Authentication successful');
                this.logSuccess();
                
                // Redirect after short delay
                setTimeout(() => {
                    console.log('🔄 Redirecting to main application');
                    window.location.reload(); // Reload to show main app
                }, 500);
                
            } else {
                console.log('❌ Authentication failed');
                console.log(`🔍 User not found: ${username}`);
                this.logError('Invalid username or password. Please try again.');
            }
            
        } catch (error) {
            console.error('💥 Login error:', error);
            
            // More specific error messages
            if (error.message.includes('Failed to fetch')) {
                this.logError('Unable to connect to server. Please check your internet connection.');
            } else if (error.message.includes('JSON')) {
                this.logError('Data loading error. Please refresh the page and try again.');
            } else if (error.message.includes('User data not available')) {
                this.logError('User data not available. Please refresh the page and try again.');
            } else {
                this.logError('Login failed. Please try again.');
            }
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Validate Form Data
     * 
     * Performs client-side validation of form inputs.
     * 
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {boolean} True if valid, false otherwise
     */
    validateForm(username, password) {
        // Check for empty fields
        if (!username || !password) {
            this.logError('Please fill in all fields.');
            return false;
        }
        
        // Basic username validation
        if (username.length < 3) {
            this.logError('Username must be at least 3 characters long.');
            return false;
        }
        
        // Username format validation (alphanumeric and underscores only)
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            this.logError('Username can only contain letters, numbers, and underscores.');
            return false;
        }
        
        // Password length check
        if (password.length < 3) {
            this.logError('Password must be at least 3 characters long.');
            return false;
        }
        
        return true;
    }

    /**
     * Validate Username Input
     * 
     * Real-time username validation with visual feedback.
     */
    validateUsername() {
        const username = this.usernameInput.value.trim();
        const inputGroup = this.usernameInput.closest('.input-group');
        const errorDiv = document.getElementById('username-error');
        
        if (username && (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username))) {
            inputGroup.classList.add('error');
            inputGroup.classList.remove('success');
            if (errorDiv) {
                if (username.length < 3) {
                    errorDiv.textContent = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
                } else {
                    errorDiv.textContent = 'اسم المستخدم يمكن أن يحتوي على أحرف وأرقام و _ فقط';
                }
                errorDiv.classList.add('show');
            }
        } else if (username) {
            inputGroup.classList.add('success');
            inputGroup.classList.remove('error');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        } else {
            inputGroup.classList.remove('error', 'success');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        }
    }

    /**
     * Validate Password Input
     * 
     * Real-time password validation with visual feedback.
     */
    validatePassword() {
        const password = this.passwordInput.value;
        const inputGroup = this.passwordInput.closest('.input-group');
        const errorDiv = document.getElementById('password-error');
        
        if (password && password.length < 3) {
            inputGroup.classList.add('error');
            inputGroup.classList.remove('success');
            if (errorDiv) {
                errorDiv.textContent = 'كلمة المرور يجب أن تكون 3 أحرف على الأقل';
                errorDiv.classList.add('show');
            }
        } else if (password) {
            inputGroup.classList.add('success');
            inputGroup.classList.remove('error');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        } else {
            inputGroup.classList.remove('error', 'success');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        }
    }

    /**
     * Toggle Password Visibility
     * 
     * Shows/hides password text with icon update.
     */
    togglePassword() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        
        console.log(`👁️ Password visibility: ${isPassword ? 'shown' : 'hidden'}`);
        
        // Update icon
        const icon = this.passwordToggle.querySelector('svg');
        if (isPassword) {
            // Eye with slash (hidden)
            icon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            // Regular eye (visible)
            icon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    }

    /**
     * Fill Demo Account Credentials
     * 
     * Populates form with demo account information.
     * 
     * @param {Event} e - Click event from demo account button
     */
    fillDemoAccount(e) {
        const username = e.currentTarget.dataset.username;
        
        console.log(`🎭 Demo account selected: ${username}`);
        
        // Fill form fields
        this.usernameInput.value = username;
        
        // تحديد كلمة المرور حسب الحساب
        let password = 'password';
        if (username === 'admin') {
            password = 'admin';
        } else if (username === 'bashar') {
            password = 'Bashar';
        } else if (username === 'kinan') {
            password = 'Kinan';
        } else if (username === 'guest') {
            password = 'Guest';
        } else if (username === 'test') {
            password = 'Test';
        }
        
        this.passwordInput.value = password;
        
        // Clear any validation states
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        // Hide any existing errors
        this.hideError();
        
        // Focus the login button for better UX
        this.loginBtn.focus();
        
        console.log('✅ Demo account credentials filled');
    }

    /**
     * Set Loading State
     * 
     * Shows/hides loading spinner and disables form.
     * 
     * @param {boolean} loading - Whether to show loading state
     */
    setLoading(loading) {
        const spinner = this.loginBtn.querySelector('.loading-spinner');
        const text = this.loginBtn.querySelector('span');
        
        if (loading) {
            console.log('⏳ Showing loading state');
            spinner.style.display = 'block';
            text.style.display = 'none';
            this.loginBtn.disabled = true;
            this.form.classList.add('form-loading');
        } else {
            console.log('✅ Hiding loading state');
            spinner.style.display = 'none';
            text.style.display = 'block';
            this.loginBtn.disabled = false;
            this.form.classList.remove('form-loading');
        }
    }

    /**
     * Log Error Message
     * 
     * Logs error message to console.
     * 
     * @param {string} message - Error message to log
     */
    logError(message) {
        console.log(`❌ Error: ${message}`);
    }

    /**
     * Hide Error Message
     * 
     * Hides any error messages and clears error states.
     */
    hideError() {
        if (this.errorDiv) {
            this.errorDiv.style.display = 'none';
            this.errorDiv.textContent = '';
        }
        
        // Clear error states from input groups
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error');
        });
        
        console.log('✅ Error message hidden');
    }

    /**
     * Show Error Message
     * 
     * Shows error message to user.
     * 
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (this.errorDiv) {
            this.errorDiv.textContent = message;
            this.errorDiv.style.display = 'block';
        }
        
        console.log(`❌ Error displayed: ${message}`);
    }

    /**
     * Log Success Message
     * 
     * Logs success message to console.
     */
    logSuccess() {
        console.log('✅ Login successful');
    }
}

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Initialize Authentication System
 * 
 * Sets up authentication when DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Initializing authentication system');
    
    // Initialize authentication service
    window.authService = AuthService.getInstance();
    
    // Test user data loading
    AuthService.loadUsers().then(users => {
        console.log(`✅ User data loaded successfully: ${Object.keys(users).length} users available`);
        console.log(`📋 Available users: ${Object.keys(users).join(', ')}`);
    }).catch(error => {
        console.error('❌ Failed to load user data:', error);
    });
    
    console.log('✅ Authentication system ready');
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

// Make AuthService globally available
window.AuthService = AuthService;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthService, LoginHandler };
}

console.log('📜 Authentication module loaded successfully');