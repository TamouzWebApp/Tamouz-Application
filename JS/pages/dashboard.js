/* 
===========================================
SCOUTPLUSE - DASHBOARD PAGE SERVICE
===========================================

Handles dashboard functionality including:
1. Recent events display
2. Quick actions
3. Troop overview
4. User statistics
5. Upcoming deadlines
*/

/**
 * Dashboard Service Class
 * 
 * Manages the dashboard page content and functionality.
 */
class DashboardService {
    constructor() {
        this.currentUser = null;
        this.events = [];
        this.isLoading = false;
        
        this.init();
    }

    /**
     * Initialize Dashboard Service
     */
    init() {
        console.log('📊 Initializing Dashboard Service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        if (!this.currentUser) {
            console.error('❌ No authenticated user found');
            return;
        }
        
        this.loadDashboard();
        this.setupEventListeners();
        
        console.log('✅ Dashboard Service initialized');
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Listen for page changes
        window.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'dashboard') {
                this.refresh();
            }
        });

        // Listen for events data changes
        window.addEventListener('dataManagereventsLoaded', (e) => {
            this.events = e.detail.events || [];
            this.loadRecentEvents();
        });

        // Listen for real-time updates
        window.addEventListener('dataManagereventsRealTimeUpdate', (e) => {
            this.events = e.detail.events || [];
            this.loadRecentEvents();
        });

        // Listen for auto sync updates
        window.addEventListener('autoSyncdataUpdated', (e) => {
            console.log('🔄 Auto sync update received in dashboard');
            this.events = e.detail.events || [];
            this.loadRecentEvents();
        });

        // Listen for user updates
        window.addEventListener('userUpdated', (e) => {
            this.currentUser = e.detail.user;
            this.refresh();
        });
        
        console.log('🎧 Dashboard event listeners attached');
    }

    /**
     * Load Dashboard Content
     */
    loadDashboard() {
        console.log('📊 Loading dashboard content...');
        
        this.loadRecentEvents();
        this.loadQuickActions();
        this.loadTroopOverview();
        
        console.log('✅ Dashboard content loaded');
    }

    /**
     * Load Recent Events
     */
    async loadRecentEvents() {
        const recentEventsContainer = document.getElementById('recentEvents');
        if (!recentEventsContainer) return;

        console.log('📅 Loading recent events...');

        // Get events from localStorage
        try {
            const localStorageService = window.getLocalStorageService();
            this.events = localStorageService.getEvents();
            
            // إذا كانت فارغة، استخدم البيانات التجريبية
            if (this.events.length === 0) {
                this.events = this.getDemoEvents();
                localStorageService.saveEvents(this.events);
            }
        } catch (error) {
            console.warn('⚠️ Failed to load events:', error);
            this.events = this.getDemoEvents();
        }

        // Filter events by user's troop and status
        const troopEvents = this.events.filter(event => {
            // Admin can see all events
            if (this.currentUser.role === 'admin') return true;
            
            // Others see only their troop's events
            return event.troop === this.currentUser.troop && event.status === 'upcoming';
        }).slice(0, 1); // Show only the most recent event

        if (troopEvents.length === 0) {
            recentEventsContainer.innerHTML = this.getEmptyEventsHTML();
            return;
        }

        recentEventsContainer.innerHTML = troopEvents
            .map(event => this.getRecentEventHTML(event))
            .join('');

        // Add event listeners
        this.setupRecentEventListeners();
        
        console.log(`✅ Loaded the most recent event`);
    }

    /**
     * الحصول على بيانات تجريبية
     */
    getDemoEvents() {
        return [
            {
                id: "demo_1",
                title: "رحلة تخييم نهاية الأسبوع",
                description: "مغامرة تخييم لثلاثة أيام مع أنشطة المشي والنار.",
                date: "2025-01-20",
                time: "09:00",
                location: "موقع التخييم الجبلي",
                attendees: [],
                maxAttendees: 25,
                category: "ramita",
                image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                status: "upcoming",
                troop: "Ramita",
                createdBy: "1",
                createdAt: "2025-01-15T10:00:00Z",
                updatedAt: "2025-01-15T10:00:00Z"
            },
            {
                id: "demo_2",
                title: "مشروع خدمة المجتمع",
                description: "ساعد في تنظيف الحديقة المحلية وزراعة أشجار جديدة.",
                date: "2025-01-25",
                time: "14:00",
                location: "الحديقة المركزية",
                attendees: [],
                maxAttendees: 20,
                category: "ma3lola",
                image: "https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                status: "upcoming",
                troop: "Ma3lola",
                createdBy: "2",
                createdAt: "2025-01-14T15:30:00Z",
                updatedAt: "2025-01-14T15:30:00Z"
            }
        ];
    }

    /**
     * Load Quick Actions
     */
    loadQuickActions() {
        const quickActionsContainer = document.getElementById('quickActions');
        if (!quickActionsContainer) return;

        console.log('⚡ Loading quick actions...');

        const actions = this.getQuickActionsForRole();
        quickActionsContainer.innerHTML = actions
            .map(action => this.getQuickActionHTML(action))
            .join('');

        this.setupQuickActionListeners();
        
        console.log(`✅ Loaded ${actions.length} quick actions`);
    }

    /**
     * Load Troop Overview
     */
    loadTroopOverview() {
        const troopOverviewContainer = document.getElementById('troopOverview');
        if (!troopOverviewContainer) return;

        console.log('👥 Loading troop overview...');

        const troopData = this.getTroopData();
        troopOverviewContainer.innerHTML = this.getTroopOverviewHTML(troopData);
        
        // Setup click handlers for stats
        this.setupTroopOverviewListeners();
        
        console.log('✅ Troop overview loaded');
    }

    /**
     * Get Recent Event HTML
     */
    getRecentEventHTML(event) {
        const attendancePercentage = Math.round((event.attendees?.length || 0) / (event.maxAttendees || 1) * 100);
        const hasJoined = event.attendees?.includes(this.currentUser.id);

        return `
            <div class="recent-event clickable-event" data-event-id="${event.id}">
                <div class="recent-event-image">
                    <img src="${event.image}" alt="${event.title}" loading="lazy">
                    <div class="event-category category-${event.category?.toLowerCase()}">
                        ${event.category}
                    </div>
                    ${hasJoined ? '<div class="joined-badge">Joined</div>' : ''}
                </div>
                <div class="recent-event-content">
                    <h3 class="recent-event-title">${event.title}</h3>
                    <p class="recent-event-description">${event.description}</p>
                    
                    <div class="recent-event-details">
                        <div class="recent-event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            ${this.formatDate(event.date)}
                        </div>
                        <div class="recent-event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                            ${event.time}
                        </div>
                        <div class="recent-event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${event.location}
                        </div>
                    </div>

                    <div class="attendance-progress">
                        <div class="attendance-info">
                            <span>Attendance</span>
                            <span>${attendancePercentage}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${attendancePercentage}%"></div>
                        </div>
                    </div>
                    
                    <div class="recent-event-action">
                        <button class="btn btn-outline view-all-events-btn">
                            View All Events
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get Quick Actions for User Role
     */
    getQuickActionsForRole() {
        const baseActions = [
            {
                id: 'view-events',
                title: 'View All Events',
                description: 'Browse upcoming activities',
                icon: 'calendar',
                action: () => window.scoutPluseApp?.navigateToPage('events')
            },
            {
                id: 'view-profile',
                title: 'My Profile',
                description: 'Update your information',
                icon: 'user',
                action: () => window.scoutPluseApp?.navigateToPage('profile')
            }
        ];

        if (['leader', 'admin'].includes(this.currentUser.role)) {
            baseActions.unshift({
                id: 'create-event',
                title: 'Create Event',
                description: 'Plan a new activity',
                icon: 'plus',
                action: () => {
                    window.scoutPluseApp?.navigateToPage('events');
                    setTimeout(() => {
                        if (window.EventsService?.getInstance) {
                            window.EventsService.getInstance().showCreateEventModal();
                        }
                    }, 100);
                }
            });
        }

        if (this.currentUser.role === 'admin') {
            baseActions.push({
                id: 'settings',
                title: 'Settings',
                description: 'Manage preferences',
                icon: 'settings',
                action: () => window.scoutPluseApp?.navigateToPage('settings')
            });
        }

        return baseActions;
    }

    /**
     * Get Quick Action HTML
     */
    getQuickActionHTML(action) {
        const icons = {
            calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
            plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
            user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
            settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>'
        };

        return `
            <div class="quick-action" data-action="${action.id}">
                <div class="quick-action-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${icons[action.icon]}
                    </svg>
                </div>
                <div class="quick-action-content">
                    <h4 class="quick-action-title">${action.title}</h4>
                    <p class="quick-action-description">${action.description}</p>
                </div>
                <div class="quick-action-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                </div>
            </div>
        `;
    }

    /**
     * Get Troop Data
     */
    async getTroopData() {
        try {
            // Get users data from AuthService
            const users = await window.AuthService.loadUsers();
            const troopMembers = Object.values(users).filter(user => 
                user.troop === this.currentUser.troop
            );
            
            const troopEvents = this.events.filter(event => 
                event.troop === this.currentUser.troop
            );
            
            return {
                name: this.currentUser.troop,
                totalMembers: troopMembers.length,
                activeMembers: troopMembers.filter(user => user.role !== 'guest').length,
                upcomingEvents: troopEvents.filter(event => event.status === 'upcoming').length,
                completedEvents: troopEvents.filter(event => event.status === 'past').length
            };
        } catch (error) {
            console.error('❌ Error loading troop data:', error);
            return {
                name: this.currentUser.troop,
                totalMembers: 0,
                activeMembers: 0,
                upcomingEvents: 0,
                completedEvents: 0
            };
        }
    }

    /**
     * Load Troop Overview
     */
    async loadTroopOverview() {
        const troopOverviewContainer = document.getElementById('troopOverview');
        if (!troopOverviewContainer) return;

        console.log('👥 Loading troop overview...');

        const troopData = await this.getTroopData();
        troopOverviewContainer.innerHTML = this.getTroopOverviewHTML(troopData);
        
        // Setup click handlers for stats
        this.setupTroopOverviewListeners();
        
        console.log('✅ Troop overview loaded');
    }

    /**
     * Get Troop Overview HTML
     */
    getTroopOverviewHTML(troopData) {
        return `
            <div class="troop-overview-header">
                <h3>Troop ${troopData.name}</h3>
                <p>Your troop at a glance</p>
            </div>
            <div class="troop-stats">
                <div class="troop-stat clickable-stat" data-action="show-members">
                    <div class="troop-stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div class="troop-stat-content">
                        <div class="troop-stat-value">${troopData.totalMembers}</div>
                        <div class="troop-stat-label">Total Members</div>
                    </div>
                </div>
                <div class="troop-stat">
                    <div class="troop-stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div class="troop-stat-content">
                        <div class="troop-stat-value">${troopData.upcomingEvents}</div>
                        <div class="troop-stat-label">Upcoming Events</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get Empty Events HTML
     */
    getEmptyEventsHTML() {
        return `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h3>No recent events</h3>
                <p>No recent activities to display. Check the Events page for all upcoming activities.</p>
            </div>
        `;
    }

    /**
     * Setup Recent Event Listeners
     */
    setupRecentEventListeners() {
        const recentEvents = document.querySelectorAll('.clickable-event');
        recentEvents.forEach(eventElement => {
            eventElement.addEventListener('click', () => {
                // Navigate to events page
                window.scoutPluseApp?.navigateToPage('events');
            });
        });
        
        // View all events buttons
        const viewAllBtns = document.querySelectorAll('.view-all-events-btn');
        viewAllBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.scoutPluseApp?.navigateToPage('events');
            });
        });
    }

    /**
     * Setup Quick Action Listeners
     */
    setupQuickActionListeners() {
        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(actionElement => {
            actionElement.addEventListener('click', () => {
                const actionId = actionElement.dataset.action;
                const action = this.getQuickActionsForRole().find(a => a.id === actionId);
                if (action && action.action) {
                }
            }
            )
        }
        )
    }
    /**
     * Show Troop Members Modal
     */
    async showTroopMembers() {
        console.log('👥 Loading troop members...');
        
        try {
            // Load users data
            const users = await window.AuthService?.loadUsers() || {};
            
            // Filter members by current user's troop
            const troopMembers = Object.values(users).filter(user => 
                user.troop === this.currentUser.troop && user.id !== this.currentUser.id
            );
            
            console.log(`👥 Found ${troopMembers.length} troop members`);
            
            // Show modal
            const modal = document.getElementById('troopMembersModal');
            const title = document.getElementById('troopMembersTitle');
            const membersList = document.getElementById('troopMembersList');
            
            if (modal && title && membersList) {
                title.textContent = `Troop ${this.currentUser.troop} Members`;
                membersList.innerHTML = this.getTroopMembersHTML(troopMembers);
                modal.style.display = 'flex';
            }
            
        } catch (error) {
            console.error('❌ Error loading troop members:', error);
            this.showNotification('Failed to load troop members', 'error');
        }
    }

    /**
     * Get Troop Members HTML
     */
    getTroopMembersHTML(members) {
        if (members.length === 0) {
            return `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <h3>No other members</h3>
                    <p>You are the only member in this troop</p>
                </div>
            `;
        }
        
        return members.map(member => {
            const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
            return `
                <div class="troop-member-item">
                    <div class="troop-member-avatar">${initials}</div>
                    <div class="troop-member-info">
                        <div class="troop-member-name">${member.name}</div>
                        <div class="troop-member-role">${member.role}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Show Notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Format Date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Get Days Until Date
     */
    getDaysUntilDate(dateString) {
        const today = new Date();
        const targetDate = new Date(dateString);
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    /**
     * Refresh Dashboard
     */
    refresh() {
        console.log('🔄 Refreshing dashboard...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        if (!this.currentUser) {
            console.warn('⚠️ No authenticated user for dashboard refresh');
            return;
        }
        
        this.loadDashboard();
        
        console.log('✅ Dashboard refreshed');
    }

    /**
     * Get Dashboard Data
     */
    getDashboardData() {
        return {
            currentUser: this.currentUser,
            events: this.events,
            troopData: this.getTroopData(),
            lastUpdate: new Date().toISOString()
        };
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let dashboardServiceInstance = null;

/**
 * Get Dashboard Service Instance
 * @returns {DashboardService} Dashboard service instance
 */
function getDashboardService() {
    if (!dashboardServiceInstance) {
        dashboardServiceInstance = new DashboardService();
    }
    return dashboardServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.AuthService?.isAuthenticated()) {
        console.log('📊 Initializing Dashboard Service...');
        window.dashboardService = getDashboardService();
    }
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.DashboardService = DashboardService;
window.getDashboardService = getDashboardService;

console.log('📊 Dashboard service module loaded');