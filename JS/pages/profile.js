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
    init() {
        console.log('👤 Initializing Profile Service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        if (!this.currentUser) {
            console.error('❌ No authenticated user found');
            return;
        }
        
        this.loadProfile();
        this.setupEventListeners();
        
        console.log('✅ Profile Service initialized');
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
                        <input type="text" id="fullName" value="${this.currentUser.name}" required ${this.isEditing ? '' : 'readonly'}>
                    </div>
                    
                    <div class="profile-field">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" value="${this.currentUser.email}" required ${this.isEditing ? '' : 'readonly'}>
                    </div>
                    
                    <div class="profile-field">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" value="${this.currentUser.phone || ''}" placeholder="Enter your phone number" ${this.isEditing ? '' : 'readonly'}>
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
                        <textarea id="bio" placeholder="Tell us about yourself..." ${this.isEditing ? '' : 'readonly'}>${this.currentUser.bio || this.getDefaultBio()}</textarea>
                    </div>
                    
                        <div class="profile-actions">
                        ${this.getFormActionsHTML()}
                    </div>
                    </form>
                </div>

                ${this.currentUser.badges?.length > 0 ? this.getBadgesHTML() : ''}
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
        this.showNotification('Changes discarded', 'info');
        
        console.log('✅ Profile editing cancelled');
    }

    /**
     * Handle Profile Update
     */
    handleProfileUpdate(e) {
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
        
        this.showNotification('Profile updated successfully!', 'success');
        
        console.log('✅ Profile updated successfully');
    }

    /**
     * Validate Profile Data
     */
    validateProfileData(data) {
        if (!data.name || data.name.length < 2) {
            this.showNotification('Name must be at least 2 characters long', 'error');
            return false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        if (data.phone && !this.isValidPhone(data.phone)) {
            this.showNotification('Please enter a valid phone number', 'error');
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