/* 
===========================================
SCOUTPLUSE - INFORMATION PAGE SERVICE
===========================================

Handles information/knowledge center functionality including:
1. Educational content display
2. Category management
3. Skill tutorials
4. Resource organization
*/

/**
 * Information Service Class
 * 
 * Manages the information/knowledge center page content and functionality.
 */
class InformationService {
    constructor() {
        this.currentUser = null;
        this.currentCategory = 'knots';
        this.categories = this.getCategories();
        
        this.init();
    }

    /**
     * Initialize Information Service
     */
    init() {
        console.log('📚 Initializing Information Service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        this.loadInformation();
        this.setupEventListeners();
        
        console.log('✅ Information Service initialized');
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Listen for page changes
        window.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'information') {
                this.loadInformation();
            }
        });

        // Listen for language changes
        window.addEventListener('languageChanged', (e) => {
            this.loadInformation();
        });
        
        console.log('🎧 Information service event listeners attached');
    }

    /**
     * Get Categories
     */
    getCategories() {
        return [
            {
                id: 'knots',
                name: 'Knots & Lashings',
                icon: 'plus',
                description: 'Essential knots and lashing techniques'
            },
            {
                id: 'fire',
                name: 'Fire Building',
                icon: 'flame',
                description: 'Safe and effective fire building techniques'
            },
            {
                id: 'navigation',
                name: 'Navigation',
                icon: 'compass',
                description: 'Essential navigation skills for outdoor adventures'
            },
            {
                id: 'first-aid',
                name: 'First Aid',
                icon: 'heart',
                description: 'Basic first aid skills for emergency situations'
            },
            {
                id: 'camping',
                name: 'Camping Skills',
                icon: 'tent',
                description: 'Essential skills for successful camping experiences'
            },
            {
                id: 'nature',
                name: 'Nature Study',
                icon: 'leaf',
                description: 'Understanding and appreciating the natural world'
            }
        ];
    }

    /**
     * Load Information Page
     */
    loadInformation() {
        const informationContent = document.getElementById('informationContent');
        if (!informationContent || !this.currentUser) return;

        console.log('📚 Loading information content...');

        informationContent.innerHTML = this.getInformationHTML();
        this.setupUIEventListeners();
        this.loadCategoryContent();
        
        console.log('✅ Information content loaded');
    }

    /**
     * Get Information Page HTML
     */
    getInformationHTML() {
        return `
            <div class="information-categories">
                ${this.categories.map(category => this.getCategoryButtonHTML(category)).join('')}
            </div>
            
            <div class="information-content-area">
                <div id="categoryContent" class="category-content">
                    <!-- Category content will be loaded here -->
                </div>
            </div>
        `;
    }

    /**
     * Get Category Button HTML
     */
    getCategoryButtonHTML(category) {
        const isActive = category.id === this.currentCategory;
        const iconSVG = this.getCategoryIconSVG(category.icon);
        
        return `
            <button class="category-btn ${isActive ? 'active' : ''}" data-category="${category.id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${iconSVG}
                </svg>
                ${category.name}
            </button>
        `;
    }

    /**
     * Get Category Icon SVG
     */
    getCategoryIconSVG(iconType) {
        const icons = {
            plus: '<path d="M8 12h8"></path><path d="M12 8v8"></path><circle cx="12" cy="12" r="10"></circle>',
            flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>',
            compass: '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>',
            heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"></path>',
            tent: '<path d="M3 20h18l-9-15z"></path><path d="M12 5v15"></path>',
            leaf: '<path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'
        };
        return icons[iconType] || icons.plus;
    }

    /**
     * Setup UI Event Listeners
     */
    setupUIEventListeners() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                console.log(`📂 Category selected: ${category}`);
                this.switchCategory(category);
            });
        });
    }

    /**
     * Switch Category
     */
    switchCategory(category) {
        this.currentCategory = category;
        
        // Update button states
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Load category content
        this.loadCategoryContent();
        
        console.log(`📂 Switched to category: ${category}`);
    }

    /**
     * Load Category Content
     */
    loadCategoryContent() {
        const categoryContent = document.getElementById('categoryContent');
        if (!categoryContent) return;

        console.log(`📖 Loading content for category: ${this.currentCategory}`);

        const content = this.getCategoryData(this.currentCategory);
        categoryContent.innerHTML = this.getCategoryContentHTML(content);
        this.setupContentListeners();
        
        console.log(`✅ Category content loaded: ${this.currentCategory}`);
    }

    /**
     * Get Category Data
     */
    getCategoryData(category) {
        const data = {
            knots: {
                title: 'Knots & Lashings',
                description: 'Essential knots and lashing techniques for scouting activities',
                items: [
                    {
                        name: 'Square Knot (Reef Knot)',
                        difficulty: 'Beginner',
                        uses: 'Joining two ropes of equal thickness',
                        steps: [
                            'Cross the right rope over the left rope',
                            'Bring the right rope under and through',
                            'Cross the left rope over the right rope',
                            'Bring the left rope under and through',
                            'Tighten both ends'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Bowline Knot',
                        difficulty: 'Intermediate',
                        uses: 'Creating a fixed loop that won\'t slip',
                        steps: [
                            'Create a small loop in the rope',
                            'Pass the working end up through the loop',
                            'Wrap around the standing line',
                            'Pass back down through the original loop',
                            'Tighten the knot'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Clove Hitch',
                        difficulty: 'Beginner',
                        uses: 'Securing rope to a post or pole',
                        steps: [
                            'Wrap the rope around the post',
                            'Cross over and wrap around again',
                            'Tuck the end under the last wrap',
                            'Tighten the knot'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Square Lashing',
                        difficulty: 'Advanced',
                        uses: 'Joining two poles at right angles',
                        steps: [
                            'Start with a clove hitch on the vertical pole',
                            'Wrap around both poles in a square pattern',
                            'Make 3-4 complete wraps',
                            'Add frapping turns between the poles',
                            'Finish with a clove hitch'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            fire: {
                title: 'Fire Building',
                description: 'Safe and effective fire building techniques for outdoor activities',
                items: [
                    {
                        name: 'Teepee Fire',
                        difficulty: 'Beginner',
                        uses: 'Quick lighting and cooking',
                        steps: [
                            'Create a tinder nest in the center',
                            'Build a small teepee of kindling around tinder',
                            'Add larger sticks in teepee formation',
                            'Light the tinder from multiple sides',
                            'Add fuel as the fire grows'
                        ],
                        image: 'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Log Cabin Fire',
                        difficulty: 'Intermediate',
                        uses: 'Long-burning fires and cooking',
                        steps: [
                            'Place two logs parallel to each other',
                            'Place two more logs perpendicular on top',
                            'Continue alternating layers',
                            'Fill center with tinder and kindling',
                            'Light from the top center'
                        ],
                        image: 'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Star Fire',
                        difficulty: 'Beginner',
                        uses: 'Conserving fuel and easy maintenance',
                        steps: [
                            'Start with a small fire in the center',
                            'Place 5-8 logs like spokes of a wheel',
                            'Push logs toward center as they burn',
                            'Maintain by feeding logs inward',
                            'Easy to control heat output'
                        ],
                        image: 'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            navigation: {
                title: 'Navigation',
                description: 'Essential navigation skills for outdoor adventures',
                items: [
                    {
                        name: 'Using a Compass',
                        difficulty: 'Beginner',
                        uses: 'Finding direction and navigation',
                        steps: [
                            'Hold compass level and steady',
                            'Turn until red needle points to N',
                            'Read bearing at direction of travel arrow',
                            'Follow the bearing to your destination'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Reading Topographic Maps',
                        difficulty: 'Intermediate',
                        uses: 'Understanding terrain and elevation',
                        steps: [
                            'Identify contour lines for elevation',
                            'Locate key landmarks and features',
                            'Understand map symbols and scale',
                            'Orient map with compass bearing'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            'first-aid': {
                title: 'First Aid',
                description: 'Basic first aid skills for emergency situations',
                items: [
                    {
                        name: 'Treating Cuts and Scrapes',
                        difficulty: 'Beginner',
                        uses: 'Minor wound care',
                        steps: [
                            'Clean your hands thoroughly',
                            'Stop any bleeding with direct pressure',
                            'Clean the wound with water',
                            'Apply antibiotic ointment if available',
                            'Cover with sterile bandage'
                        ],
                        image: 'https://images.pexels.com/photos/163403/box-sport-men-training-163403.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Treating Burns',
                        difficulty: 'Intermediate',
                        uses: 'Burn injury care',
                        steps: [
                            'Remove from heat source immediately',
                            'Cool with running water for 10-20 minutes',
                            'Remove jewelry before swelling occurs',
                            'Cover with sterile, non-adhesive bandage',
                            'Seek medical attention for severe burns'
                        ],
                        image: 'https://images.pexels.com/photos/163403/box-sport-men-training-163403.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            camping: {
                title: 'Camping Skills',
                description: 'Essential skills for successful camping experiences',
                items: [
                    {
                        name: 'Setting Up a Tent',
                        difficulty: 'Beginner',
                        uses: 'Shelter setup',
                        steps: [
                            'Choose level, dry ground away from hazards',
                            'Lay out tent footprint or groundsheet',
                            'Assemble tent poles according to instructions',
                            'Attach tent body to poles',
                            'Stake out guy lines for stability'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Leave No Trace Principles',
                        difficulty: 'Beginner',
                        uses: 'Environmental responsibility',
                        steps: [
                            'Plan ahead and prepare',
                            'Travel and camp on durable surfaces',
                            'Dispose of waste properly',
                            'Leave what you find',
                            'Minimize campfire impacts',
                            'Respect wildlife',
                            'Be considerate of other visitors'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            nature: {
                title: 'Nature Study',
                description: 'Understanding and appreciating the natural world',
                items: [
                    {
                        name: 'Tree Identification',
                        difficulty: 'Beginner',
                        uses: 'Understanding forest ecosystems',
                        steps: [
                            'Observe leaf shape and arrangement',
                            'Note bark texture and color',
                            'Check for flowers, fruits, or seeds',
                            'Measure tree height and trunk diameter',
                            'Use field guide for identification'
                        ],
                        image: 'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'Animal Tracking',
                        difficulty: 'Intermediate',
                        uses: 'Wildlife observation and study',
                        steps: [
                            'Look for clear tracks in mud or sand',
                            'Measure track size and spacing',
                            'Note number of toes and claw marks',
                            'Follow track patterns and gait',
                            'Look for other signs like scat or feeding marks'
                        ],
                        image: 'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            }
        };

        return data[category] || data.knots;
    }

    /**
     * Get Category Content HTML
     */
    getCategoryContentHTML(content) {
        return `
            <div class="category-header">
                <h2>${content.title}</h2>
                <p>${content.description}</p>
            </div>
            
            <div class="information-grid">
                ${content.items.map(item => this.getInformationItemHTML(item)).join('')}
            </div>
        `;
    }

    /**
     * Get Information Item HTML
     */
    getInformationItemHTML(item) {
        const difficultyClass = item.difficulty.toLowerCase();
        
        return `
            <div class="information-item" data-item="${item.name}">
                <div class="information-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="difficulty-badge difficulty-${difficultyClass}">
                        ${item.difficulty}
                    </div>
                </div>
                <div class="information-item-content">
                    <h3 class="information-item-title">${item.name}</h3>
                    <p class="information-item-uses">${item.uses}</p>
                    <div class="information-item-steps">
                        <h4>Steps:</h4>
                        <ol>
                            ${item.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    <button class="btn btn-outline btn-sm view-details-btn">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Setup Content Listeners
     */
    setupContentListeners() {
        const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemElement = btn.closest('.information-item');
                const itemName = itemElement.dataset.item;
                this.showItemDetails(itemName);
            });
        });

        const informationItems = document.querySelectorAll('.information-item');
        informationItems.forEach(item => {
            item.addEventListener('click', () => {
                const itemName = item.dataset.item;
                this.showItemDetails(itemName);
            });
        });
    }

    /**
     * Show Item Details Modal
     */
    showItemDetails(itemName) {
        const content = this.getCategoryData(this.currentCategory);
        const item = content.items.find(i => i.name === itemName);
        
        if (!item) return;

        console.log(`📖 Showing details for: ${itemName}`);

        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = item.name;
            modalBody.innerHTML = this.getItemDetailsHTML(item);
            modal.style.display = 'flex';
        }
    }

    /**
     * Get Item Details HTML
     */
    getItemDetailsHTML(item) {
        return `
            <div class="information-details">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">
                
                <div class="detail-section">
                    <h4>Difficulty Level</h4>
                    <span class="difficulty-badge difficulty-${item.difficulty.toLowerCase()}">${item.difficulty}</span>
                </div>
                
                <div class="detail-section">
                    <h4>Primary Uses</h4>
                    <p>${item.uses}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Step-by-Step Instructions</h4>
                    <ol class="detailed-steps">
                        ${item.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="detail-section">
                    <h4>Tips for Success</h4>
                    <ul class="tips-list">
                        <li>Practice regularly to build muscle memory</li>
                        <li>Start with quality materials and proper tools</li>
                        <li>Take your time - accuracy is more important than speed</li>
                        <li>Ask experienced scouts or leaders for guidance</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Refresh Information Service
     */
    refresh() {
        console.log('🔄 Refreshing information service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        this.loadInformation();
        
        console.log('✅ Information service refreshed');
    }

    /**
     * Get Current Category
     */
    getCurrentCategory() {
        return this.currentCategory;
    }

    /**
     * Get Categories
     */
    getAvailableCategories() {
        return this.categories;
    }

    /**
     * Get Information Data
     */
    getInformationData() {
        return {
            currentCategory: this.currentCategory,
            categories: this.categories,
            currentUser: this.currentUser,
            lastUpdate: new Date().toISOString()
        };
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let informationServiceInstance = null;

/**
 * Get Information Service Instance
 * @returns {InformationService} Information service instance
 */
function getInformationService() {
    if (!informationServiceInstance) {
        informationServiceInstance = new InformationService();
    }
    return informationServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.AuthService?.isAuthenticated()) {
        console.log('📚 Initializing Information Service...');
        window.informationService = getInformationService();
    }
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.InformationService = InformationService;
window.getInformationService = getInformationService;

console.log('📚 Information service module loaded');