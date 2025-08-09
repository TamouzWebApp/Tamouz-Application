/* 
===========================================
SCOUTPLUSE - PROFILE PAGE SERVICE
===========================================

Handles profile management functionality including:
1. Personal information display and editing
2. User statistics
3. Profile settings
4. Badge management
*/

/**
 * Profile Service Class
 * 
 * Manages the profile page content and functionality.
 */
class ProfileService {
    constructor() {
        this.currentUser = null;
        this.isEditing = false;
        this.originalData = null;
        
        this.init();
    }

    /**
     * Initialize Profile Service
     */
    async init() {
        console.log('👤 Initializing Profile Service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        if (!this.currentUser) {
            console.error('❌ No authenticated user found');
            return;
        }
        
        // Load user data from users.json
        await this.loadUserDataFromFile();
        
        this.loadProfile();
        this.setupEventListeners();
        
        console.log('✅ Profile Service initialized');
    }

    /**
     * Load user data from users.json file
     */
    async loadUserDataFromFile() {
        try {
            // First try to load from localStorage backup
            const backupData = localStorage.getItem('scoutpluse_users_backup');
            if (backupData) {
                const data = JSON.parse(backupData);
                const userFromBackup = data.users.find(user => user.id === this.currentUser.id);
                if (userFromBackup) {
                    this.mergeUserData(userFromBackup);
                    console.log('✅ User data loaded from localStorage backup');
                    return;
                }
            }
            
            // If no backup, load from users.json file
            const response = await fetch('JSON/users.json');
            const data = await response.json();
            
            // Find current user in the file
            const userFromFile = data.users.find(user => user.id === this.currentUser.id);
            if (userFromFile) {
                this.mergeUserData(userFromFile);
                console.log('✅ User data loaded from users.json');
            }
        } catch (error) {
            console.warn('⚠️ Could not load user data from users.json:', error);
            // Continue with current user data if file loading fails
        }
    }

    /**
     * Merge user data from file with current user data
     */
    mergeUserData(userData) {
        this.currentUser = {
            ...this.currentUser,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || this.currentUser.phone,
            bio: userData.bio || this.currentUser.bio,
            joinDate: userData.joinDate || this.currentUser.joinDate
        };
        
        // Update localStorage with merged data
        window.AuthService?.updateUser(this.currentUser);
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Listen for page changes
        window.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'profile') {
                this.refresh();
            }
        });

        // Listen for user updates
        window.addEventListener('userUpdated', (e) => {
            this.currentUser = e.detail.user;
            this.loadProfile();
        });
        
        console.log('🎧 Profile service event listeners attached');
    }

    /**
     * Load Profile Page
     */
    loadProfile() {
        const profileContent = document.getElementById('profileContent');
        if (!profileContent || !this.currentUser) return;

        console.log('👤 Loading profile content...');

        profileContent.innerHTML = this.getProfileHTML();
        this.setupUIEventListeners();
        
        console.log('✅ Profile content loaded');
    }

    /**
     * Get Profile HTML
     */
    getProfileHTML() {
        const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const joinDate = this.formatDate(this.currentUser.joinDate || '2022-01-15');

        return `
            <div class="profile-page">
                <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${initials}
                    </div>
                    <div class="profile-info">
                        <h2>${this.currentUser.name}</h2>
                        <p>${this.capitalizeRole(this.currentUser.role)} • ${this.currentUser.troop}</p>
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="profile-stat">
                        <div class="profile-stat-value">${this.currentUser.joinedEvents?.length || 0}</div>
                        <div class="profile-stat-label">Events Joined</div>
                    </div>
                    <div class="profile-stat">
                        <div class="profile-stat-value">${this.calculateYearsActive()}</div>
                        <div class="profile-stat-label">Years Active</div>
                    </div>
                    <div class="profile-stat">
                        <div class="profile-stat-value">${this.currentUser.badges?.length || 0}</div>
                        <div class="profile-stat-label">Badges Earned</div>
                    </div>
                </div>
                </div>

                <div class="profile-card">
                    <h3>Personal Information</h3>
                    <form id="profileForm">
                    <div class="profile-field">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" value="${this.currentUser.name}" required ${this.isEditing ? '' : 'readonly'} inputmode="text">
                    </div>
                    
                    <div class="profile-field">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" value="${this.currentUser.email}" required ${this.isEditing ? '' : 'readonly'} inputmode="email">
                    </div>
                    
                    <div class="profile-field">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" value="${this.currentUser.phone || ''}" placeholder="Enter your phone number" ${this.isEditing ? '' : 'readonly'} inputmode="tel">
                    </div>
                    
                    <div class="profile-field">
                        <label for="troop">Troop</label>
                        <input type="text" id="troop" value="${this.currentUser.troop || 'Troop 101'}" readonly>
                    </div>
                    
                    <div class="profile-field">
                        <label for="role">Role</label>
                        <input type="text" id="role" value="${this.capitalizeRole(this.currentUser.role)}" readonly>
                    </div>
                    
                    <div class="profile-field">
                        <label for="joinDate">Join Date</label>
                        <input type="text" id="joinDate" value="${joinDate}" readonly>
                    </div>
                    
                    <div class="profile-field">
                        <label for="bio">Bio</label>
                        <textarea id="bio" placeholder="Tell us about yourself..." ${this.isEditing ? '' : 'readonly'} inputmode="text">${this.currentUser.bio || this.getDefaultBio()}</textarea>
                    </div>
                    
                        <div class="profile-actions">
                        ${this.getFormActionsHTML()}
                    </div>
                    </form>
                </div>

                ${this.currentUser.badges?.length > 0 ? this.getBadgesHTML() : ''}
                
                <!-- Logout Section -->
                <div class="profile-card logout-section">
                    <h3>Account Settings</h3>
                    <div class="logout-content">
                        <div class="logout-info">
                            <div class="logout-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16,17 21,12 16,7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                            </div>
                            <div class="logout-text">
                                <h4>تسجيل الخروج</h4>
                                <p>قم بتسجيل الخروج من حسابك الحالي</p>
                            </div>
                        </div>
                        <button class="btn btn-danger logout-btn" id="logoutBtn" aria-label="تسجيل الخروج">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16,17 21,12 16,7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get Form Actions HTML
     */
    getFormActionsHTML() {
        if (this.isEditing) {
            return `
                <button type="button" class="btn btn-outline" id="cancelBtn">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            `;
        } else {
            return `
                <button type="button" class="btn btn-primary" id="editBtn">Edit Profile</button>
            `;
        }
    }

    /**
     * Get Badges HTML
     */
    getBadgesHTML() {
        if (!this.currentUser.badges || this.currentUser.badges.length === 0) {
            return '';
        }

        return `
            <div class="profile-card">
                <h3>Badges Earned</h3>
                <div class="profile-badges">
                    ${this.currentUser.badges.map(badge => this.getBadgeHTML(badge)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Get Badge HTML
     */
    getBadgeHTML(badge) {
        return `
            <div class="profile-badge">
                <div class="profile-badge-icon">
                    🏆
                </div>
                <div class="profile-badge-name">${badge}</div>
            </div>
        `;
    }

    /**
     * Setup UI Event Listeners
     */
    setupUIEventListeners() {
        // Profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', this.handleProfileUpdate.bind(this));
        }

        // Edit button
        const editBtn = document.getElementById('editBtn');
        if (editBtn) {
            editBtn.addEventListener('click', this.enableEditing.bind(this));
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', this.cancelEditing.bind(this));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }
    }

    /**
     * Enable Editing Mode
     */
    enableEditing() {
        console.log('✏️ Enabling profile editing...');
        
        this.isEditing = true;
        this.originalData = { ...this.currentUser };
        this.loadProfile();
        
        console.log('✅ Profile editing enabled');
    }

    /**
     * Cancel Editing Mode
     */
    cancelEditing() {
        console.log('❌ Cancelling profile editing...');
        
        this.isEditing = false;
        this.currentUser = { ...this.originalData };
        this.originalData = null;
        this.loadProfile();
                    console.log('ℹ️ Changes discarded');
        
        console.log('✅ Profile editing cancelled');
    }

    /**
     * Handle Logout
     */
    handleLogout() {
        console.log('🚪 User logging out...');
        
        // Show confirmation dialog
        if (confirm('هل أنت متأكد من أنك تريد تسجيل الخروج؟')) {
            // Call AuthService logout
            if (window.AuthService) {
                window.AuthService.logout();
            }
            
                    // Log logout
        console.log('✅ Logout successful');
            
            console.log('✅ User logged out successfully');
        }
    }

    /**
     * Handle Profile Update
     */
    async handleProfileUpdate(e) {
        e.preventDefault();
        
        console.log('💾 Updating profile...');
        
        const formData = new FormData(e.target);
        const updatedData = {
            ...this.currentUser,
            name: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            bio: document.getElementById('bio').value.trim()
        };

        // Validate data
        if (!this.validateProfileData(updatedData)) {
            return;
        }

        try {
            // Update users.json file
            await this.updateUsersFile(updatedData);
            
            // Update current user data
            this.currentUser = updatedData;
            
            // Update localStorage
            window.AuthService?.updateUser(this.currentUser);
            
            // Update UI elements that display user name
            this.updateUserDisplayName();
            
            // Exit editing mode
            this.isEditing = false;
            this.originalData = null;
            this.loadProfile();
            
            console.log('✅ Profile updated successfully');
            
            console.log('✅ Profile updated successfully');
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            console.log('❌ Failed to update profile');
        }
    }

    /**
     * Update users.json file
     */
    async updateUsersFile(updatedUser) {
        try {
            // Load current users data
            const response = await fetch('JSON/users.json');
            const data = await response.json();
            
            // Find and update the user
            const userIndex = data.users.findIndex(user => user.id === updatedUser.id);
            if (userIndex !== -1) {
                data.users[userIndex] = {
                    ...data.users[userIndex],
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    bio: updatedUser.bio
                };
                
                // Save updated data back to file
                await this.saveUsersFile(data);
                console.log('✅ Users file updated successfully');
            } else {
                throw new Error('User not found in users.json');
            }
        } catch (error) {
            console.error('❌ Error updating users file:', error);
            throw error;
        }
    }

    /**
     * Save users.json file
     */
    async saveUsersFile(data) {
        try {
            // Since we can't directly write to files in the browser,
            // we'll store the updated data in localStorage as a backup
            localStorage.setItem('scoutpluse_users_backup', JSON.stringify(data));
            
            // Data is saved locally
            // For now, we'll simulate the save operation
            console.log('💾 Users data saved to localStorage backup');
            
            // Dispatch event to notify other services
            window.dispatchEvent(new CustomEvent('usersFileUpdated', {
                detail: { users: data.users, timestamp: new Date().toISOString() }
            }));
        } catch (error) {
            console.error('❌ Error saving users file:', error);
            throw error;
        }
    }

    /**
     * Validate Profile Data
     */
    validateProfileData(data) {
        if (!data.name || data.name.length < 2) {
            console.log('❌ Name must be at least 2 characters long');
            return false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            console.log('❌ Please enter a valid email address');
            return false;
        }

        if (data.phone && !this.isValidPhone(data.phone)) {
            console.log('❌ Please enter a valid phone number');
            return false;
        }

        return true;
    }

    /**
     * Validate Email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate Phone
     */
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    /**
     * Update User Display Name
     */
    updateUserDisplayName() {
        // Update user avatar and welcome message
        const userAvatars = document.querySelectorAll('#userAvatar, #mobileUserAvatar');
        userAvatars.forEach(avatar => {
            avatar.textContent = this.currentUser.name.charAt(0).toUpperCase();
        });

        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = this.currentUser.name;
        }

        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${this.currentUser.name}!`;
        }
        
        console.log('🔄 User display name updated');
    }

    /**
     * Get Default Bio
     */
    getDefaultBio() {
        const bios = {
            admin: 'Dedicated to leading our scout troop and fostering growth in young minds.',
            leader: 'Passionate about guiding scouts on their journey of discovery and adventure.',
            member: 'Excited to learn new skills and make lasting friendships through scouting.',
            guest: 'Exploring the world of scouting and learning about outdoor adventures.'
        };
        return bios[this.currentUser.role] || '';
    }

    /**
     * Calculate Years Active
     */
    calculateYearsActive() {
        if (!this.currentUser.joinDate) return 0;
        
        const joinDate = new Date(this.currentUser.joinDate);
        const now = new Date();
        const diffTime = Math.abs(now - joinDate);
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        
        return diffYears;
    }

    /**
     * Capitalize Role
     */
    capitalizeRole(role) {
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    /**
     * Format Date
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * Log Message
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
     * Refresh Profile Service
     */
    refresh() {
        console.log('🔄 Refreshing profile service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        if (!this.currentUser) {
            console.warn('⚠️ No authenticated user for profile refresh');
            return;
        }
        
        this.loadProfile();
        
        console.log('✅ Profile service refreshed');
    }

    /**
     * Get Current User
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get Profile Data
     */
    getProfileData() {
        return {
            currentUser: this.currentUser,
            isEditing: this.isEditing,
            yearsActive: this.calculateYearsActive(),
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * Check if Editing
     */
    isEditingProfile() {
        return this.isEditing;
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let profileServiceInstance = null;

/**
 * Get Profile Service Instance
 * @returns {ProfileService} Profile service instance
 */
function getProfileService() {
    if (!profileServiceInstance) {
        profileServiceInstance = new ProfileService();
    }
    return profileServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.AuthService?.isAuthenticated()) {
        console.log('👤 Initializing Profile Service...');
        window.profileService = getProfileService();
    }
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.ProfileService = ProfileService;
window.getProfileService = getProfileService;

console.log('👤 Profile service module loaded');