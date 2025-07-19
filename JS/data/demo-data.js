/* 
===========================================
SCOUTPLUSE - DEMO DATA
===========================================

Demo data for testing and development purposes.
*/

// Demo Users Data
const DEMO_USERS = {
    'admin@scouts.org': {
        id: '1',
        name: 'admin',
        email: 'admin@scouts.org',
        password: 'admin',
        role: 'admin',
        troop: 'Development',
        phone: '+1 (555) 123-4567',
        joinDate: '2010-08-16',
        bio: 'Dedicated to leading our scout troop and fostering growth in young minds.',
        badges: ['Leadership', 'Camping', 'Hiking', 'First Aid', 'Navigation']
    },
    'leader@scouts.org': {
        id: '2',
        name: 'Bashar',
        email: 'leader@scouts.org',
        password: 'Bashar',
        role: 'leader',
        troop: 'Ramita',
        phone: '+1 (555) 234-5678',
        joinDate: '2021-03-15',
        bio: 'Passionate about guiding scouts on their journey of discovery and adventure.',
        badges: ['Leadership', 'Camping', 'Hiking', 'First Aid']
    },
    'scout@scouts.org': {
        id: '3',
        name: 'Scout Member',
        email: 'scout@scouts.org',
        password: 'scout123',
        role: 'member',
        troop: 'Troop 101',
        phone: '+1 (555) 345-6789',
        joinDate: '2022-09-20',
        bio: 'Excited to learn new skills and make lasting friendships through scouting.',
        badges: ['Camping', 'Hiking', 'First Aid']
    },
    'guest@scouts.org': {
        id: '4',
        name: 'Guest User',
        email: 'guest@scouts.org',
        password: 'password',
        role: 'guest',
        troop: 'Visitor',
        joinDate: '2023-06-01',
        phone: '+1 (555) 999-0000',
        bio: 'Exploring the world of scouting and learning about outdoor adventures.'
    }
};

// Demo Events Data
const DEMO_EVENTS = [
    {
        id: '1',
        title: 'Weekend Camping Trip',
        description: 'Three-day camping adventure with hiking and campfire activities. Learn outdoor survival skills and enjoy nature.',
        date: '2025-01-20',
        time: '09:00',
        location: 'Mountain View Campsite',
        attendees: ['1', '2'],
        maxAttendees: 25,
        category: 'ramita',
        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        status: 'upcoming',
        troop: 'Ramita',
        createdBy: '1',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
    },
    {
        id: '2',
        title: 'Community Service Project',
        description: 'Help clean up the local park and plant new trees. Make a positive impact in our community.',
        date: '2025-01-25',
        time: '14:00',
        location: 'Central Park',
        attendees: ['2', '3'],
        maxAttendees: 20,
        category: 'ma3lola',
        image: 'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        status: 'upcoming',
        troop: 'Ma3lola',
        createdBy: '2',
        createdAt: '2025-01-14T15:30:00Z',
        updatedAt: '2025-01-14T15:30:00Z'
    },
    {
        id: '3',
        title: 'First Aid Workshop',
        description: 'Learn essential first aid skills. Certified instructors will guide you through practical exercises.',
        date: '2025-01-28',
        time: '10:00',
        location: 'Scout Hall',
        attendees: ['1', '2', '3'],
        maxAttendees: 15,
        category: 'sergila',
        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        status: 'upcoming',
        troop: 'Sergila',
        createdBy: '1',
        createdAt: '2025-01-13T09:15:00Z',
        updatedAt: '2025-01-13T09:15:00Z'
    },
    {
        id: '4',
        title: 'Annual Scout Games',
        description: 'Traditional games and competitions between troops. Show your skills and team spirit.',
        date: '2025-01-10',
        time: '09:00',
        location: 'Sports Complex',
        attendees: ['1', '2', '3'],
        maxAttendees: 50,
        category: 'bousra',
        image: 'https://images.pexels.com/photos/163403/box-sport-men-training-163403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        status: 'past',
        troop: 'Bousra',
        createdBy: '1',
        createdAt: '2025-01-05T12:00:00Z',
        updatedAt: '2025-01-10T18:00:00Z'
    }
];

// Navigation permissions by role
const ROLE_PERMISSIONS = {
    guest: ['events'],
    member: ['dashboard', 'events', 'information', 'profile'],
    leader: ['dashboard', 'events', 'information', 'profile', 'settings'],
    admin: ['dashboard', 'events', 'information', 'profile', 'settings']
};

// Event permissions by role
const EVENT_PERMISSIONS = {
    guest: ['view'],
    member: ['view', 'join'],
    leader: ['view', 'join', 'create', 'manage'],
    admin: ['view', 'join', 'create', 'manage', 'delete']
};

// Event Categories
const EVENT_CATEGORIES = [
    { id: 'ramita', name: 'رميتا', color: '#10b981', icon: '🌲' },
    { id: 'ma3lola', name: 'معلولا', color: '#3b82f6', icon: '🤝' },
    { id: 'sergila', name: 'سرجيلا', color: '#f59e0b', icon: '📚' },
    { id: 'bousra', name: 'بوسرا', color: '#ef4444', icon: '🏆' }
];

// Information Categories
const INFORMATION_CATEGORIES = [
    { id: 'knots', name: 'Knots & Lashings', icon: 'rope' },
    { id: 'fire', name: 'Fire Building', icon: 'flame' },
    { id: 'navigation', name: 'Navigation', icon: 'compass' },
    { id: 'first-aid', name: 'First Aid', icon: 'heart' },
    { id: 'camping', name: 'Camping Skills', icon: 'tent' },
    { id: 'nature', name: 'Nature Study', icon: 'leaf' }
];

// Notification Types
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Theme Options
const THEME_OPTIONS = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
};

// Language Options
const LANGUAGE_OPTIONS = {
    ENGLISH: 'en',
    ARABIC: 'ar'
};

// Default Images
const DEFAULT_IMAGES = {
    EVENT: [
        'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/163403/box-sport-men-training-163403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    AVATAR: [
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
};

// Status Options
const STATUS_OPTIONS = {
    UPCOMING: 'upcoming',
    PAST: 'past',
    CANCELLED: 'cancelled',
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Get Random Demo Event
 * @returns {Object} Random demo event
 */
function getRandomDemoEvent() {
    return DEMO_EVENTS[Math.floor(Math.random() * DEMO_EVENTS.length)];
}

/**
 * Get Random Demo User
 * @returns {Object} Random demo user
 */
function getRandomDemoUser() {
    const users = Object.values(DEMO_USERS);
    return users[Math.floor(Math.random() * users.length)];
}

/**
 * Get Random Default Image
 * @param {string} type - Image type (event, avatar)
 * @returns {string} Random image URL
 */
function getRandomDefaultImage(type = 'event') {
    const images = DEFAULT_IMAGES[type.toUpperCase()] || DEFAULT_IMAGES.EVENT;
    return images[Math.floor(Math.random() * images.length)];
}

/**
 * Get Category by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category object
 */
function getCategoryById(categoryId) {
    return EVENT_CATEGORIES.find(cat => cat.id === categoryId) || null;
}

/**
 * Get Role Permissions
 * @param {string} role - User role
 * @returns {Array} Array of allowed pages
 */
function getRolePermissions(role) {
    return ROLE_PERMISSIONS[role] || [];
}

/**
 * Get Event Permissions
 * @param {string} role - User role
 * @returns {Array} Array of allowed event actions
 */
function getEventPermissions(role) {
    return EVENT_PERMISSIONS[role] || [];
}

/**
 * Check if User Can Access Page
 * @param {string} role - User role
 * @param {string} page - Page name
 * @returns {boolean} Whether user can access page
 */
function canUserAccessPage(role, page) {
    const permissions = getRolePermissions(role);
    return permissions.includes(page);
}

/**
 * Check if User Can Perform Event Action
 * @param {string} role - User role
 * @param {string} action - Event action
 * @returns {boolean} Whether user can perform action
 */
function canUserPerformEventAction(role, action) {
    const permissions = getEventPermissions(role);
    return permissions.includes(action);
}

// ===========================================
// GLOBAL EXPORTS
// ===========================================

// Export demo data
window.DEMO_USERS = DEMO_USERS;
window.DEMO_EVENTS = DEMO_EVENTS;

// Export permissions
window.ROLE_PERMISSIONS = ROLE_PERMISSIONS;
window.EVENT_PERMISSIONS = EVENT_PERMISSIONS;

// Export categories
window.EVENT_CATEGORIES = EVENT_CATEGORIES;
window.INFORMATION_CATEGORIES = INFORMATION_CATEGORIES;

// Export constants
window.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
window.THEME_OPTIONS = THEME_OPTIONS;
window.LANGUAGE_OPTIONS = LANGUAGE_OPTIONS;
window.DEFAULT_IMAGES = DEFAULT_IMAGES;
window.STATUS_OPTIONS = STATUS_OPTIONS;

// Export utility functions
window.getRandomDemoEvent = getRandomDemoEvent;
window.getRandomDemoUser = getRandomDemoUser;
window.getRandomDefaultImage = getRandomDefaultImage;
window.getCategoryById = getCategoryById;
window.getRolePermissions = getRolePermissions;
window.getEventPermissions = getEventPermissions;
window.canUserAccessPage = canUserAccessPage;
window.canUserPerformEventAction = canUserPerformEventAction;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEMO_USERS,
        DEMO_EVENTS,
        ROLE_PERMISSIONS,
        EVENT_PERMISSIONS,
        EVENT_CATEGORIES,
        INFORMATION_CATEGORIES,
        NOTIFICATION_TYPES,
        THEME_OPTIONS,
        LANGUAGE_OPTIONS,
        DEFAULT_IMAGES,
        STATUS_OPTIONS,
        getRandomDemoEvent,
        getRandomDemoUser,
        getRandomDefaultImage,
        getCategoryById,
        getRolePermissions,
        getEventPermissions,
        canUserAccessPage,
        canUserPerformEventAction
    };
}

console.log('📊 Demo data and constants loaded');