/* 
===========================================
SCOUTPLUSE - EVENTS PAGE SERVICE
===========================================

نظام شامل لإدارة الأحداث مبني بالكامل في JavaScript
يدعم إنشاء وعرض وإدارة الأحداث مع واجهة مستخدم متقدمة
*/

/**
 * Events Service Class
 * خدمة إدارة الأحداث
 */
class EventsService {
    constructor() {
        this.events = [];
        this.currentUser = null;
        this.selectedCategory = 'all';
        this.searchQuery = '';
        this.isLoading = false;
        this.lastSync = null;
        
        // نظام الفئات
        this.categories = [
            { id: 'ramita', name: '🌲 فرقة رميتا', color: '#10b981', icon: '🌲' },
            { id: 'ma3lola', name: '🤝 فرقة معلولا', color: '#3b82f6', icon: '🤝' },
            { id: 'sergila', name: '📚 فرقة سرجيلا', color: '#f59e0b', icon: '📚' },
            { id: 'bousra', name: '🏆 فرقة بوسرا', color: '#ef4444', icon: '🏆' }
        ];
        
        this.init();
    }

    /**
     * تهيئة الخدمة
     */
    async init() {
        console.log('🚀 تهيئة خدمة الأحداث...');
        
        // تأكد من إخفاء النافذة المنبثقة عند التهيئة
        this.ensureModalHidden();
        
        this.currentUser = window.AuthService?.getCurrentUser();
        console.log(`👤 Current user: ${this.currentUser?.name || 'Guest'} (${this.currentUser?.role || 'guest'})`);
        
        // تحميل الأحداث أولاً
        await this.loadEvents();
        
        // إعداد مستمعي الأحداث
        this.setupEventListeners();
        
        // إعداد مستمعي واجهة المستخدم
        this.setupUIEventListeners();
        
        // عرض الأحداث فوراً إذا كانت الصفحة نشطة
        if (window.scoutPluseApp?.getCurrentPage() === 'events') {
            console.log('📅 Events page is active, rendering immediately...');
            this.renderEventsPage();
        }
        
        // إضافة مستمع لحدث تغيير الصفحة
        window.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'events') {
                console.log('📅 Events page activated via pageChanged event');
                setTimeout(() => {
                    this.renderEventsPage();
                }, 100);
            }
        });
        
        // إضافة مستمع لحدث تحديث البيانات المحلية
        window.addEventListener('localStorageeventsUpdated', (e) => {
            console.log('📅 Local storage events updated, refreshing...');
            this.events = e.detail.events || [];
            this.renderEventsPage();
            console.log('✅ تم تهيئة خدمة الأحداث بنجاح');
        });
    }

    /**
     * تحويل اسم الفرقة إلى المعرف الأساسي
     * Convert troop name to canonical ID for consistent comparison
     */
    getCanonicalTroopId(troopName) {
        if (!troopName) return null;
        
        // Remove common prefixes and normalize
        const normalized = troopName
            .toLowerCase()
            .replace(/^فرقة\s*/i, '') // Remove "فرقة" prefix
            .replace(/^troop\s*/i, '') // Remove "Troop" prefix
            .trim();
        
        // Map to canonical IDs
        const troopMapping = {
            'ramita': 'ramita',
            'رميتا': 'ramita',
            'ma3lola': 'ma3lola', 
            'معلولا': 'ma3lola',
            'sergila': 'sergila',
            'سرجيلا': 'sergila',
            'bousra': 'bousra',
            'بوسرا': 'bousra'
        };
        
        const canonicalId = troopMapping[normalized];
        console.log(`🔄 Troop name normalization: "${troopName}" -> "${normalized}" -> "${canonicalId}"`);
        
        return canonicalId;
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Listen for page changes
        window.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'events') {
                console.log('📅 Events page activated, rendering content...');
                // تأخير قصير للتأكد من تحميل البيانات
                setTimeout(() => {
                    this.renderEventsPage();
                }, 100);
            }
        });

        // Listen for navigation changes
        window.addEventListener('popstate', () => {
            const currentPage = window.location.hash.slice(1) || 'dashboard';
            if (currentPage === 'events') {
                console.log('📅 Events page navigated to, rendering content...');
                setTimeout(() => {
                    this.renderEventsPage();
                }, 100);
            }
        });

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            const currentPage = window.location.hash.slice(1) || 'dashboard';
            if (currentPage === 'events') {
                console.log('📅 Events page hash changed, rendering content...');
                setTimeout(() => {
                    this.renderEventsPage();
                }, 100);
            }
        });

        // Listen for page load
        window.addEventListener('load', () => {
            const currentPage = window.location.hash.slice(1) || 'dashboard';
            if (currentPage === 'events') {
                console.log('📅 Events page loaded, rendering content...');
                setTimeout(() => {
                    this.renderEventsPage();
                }, 100);
            }
        });

        // Listen for DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            const currentPage = window.location.hash.slice(1) || 'dashboard';
            if (currentPage === 'events') {
                console.log('📅 Events page DOM loaded, rendering content...');
                setTimeout(() => {
                    this.renderEventsPage();
                }, 100);
            }
        });

        // Listen for user login
        window.addEventListener('userLoggedIn', (e) => {
            console.log('👤 User logged in, updating events service...');
            this.currentUser = e.detail.user;
            console.log(`👤 User details: ${this.currentUser.name} (${this.currentUser.role})`);
            this.init();
        });

        // Listen for user logout
        window.addEventListener('userLoggedOut', (e) => {
            console.log('👤 User logged out, updating events service...');
            this.currentUser = null;
            this.init();
        });

        // Listen for local storage events
        window.addEventListener('dataManagereventsLoaded', (e) => {
            this.events = e.detail.events || [];
            console.log(`📥 Received ${this.events.length} events from data manager`);
            this.renderEventsPage();
        });

        // Listen for localStorage events
        window.addEventListener('localStorageeventsUpdated', (e) => {
            this.events = e.detail.events || [];
            console.log(`📥 Received ${this.events.length} events from localStorage`);
            this.renderEventsPage();
        });
        window.addEventListener('dataManagereventsSaved', (e) => {
            this.lastSync = new Date().toISOString();
            console.log('✅ Events saved successfully');
        });

        // Listen for local storage updates
        window.addEventListener('dataManagereventsRealTimeUpdate', (e) => {
            console.log('🔄 Real-time events update received');
            this.events = e.detail.events || [];
            this.renderEventsPage();
            console.log('ℹ️ Events updated in real-time');
        });

        // Listen for auto sync updates
        window.addEventListener('autoSyncdataUpdated', (e) => {
            console.log('🔄 Auto sync update received');
            const newEvents = e.detail.events || [];
            // تحديث البيانات دائماً حتى لو كانت فارغة
            this.events = newEvents;
            this.renderEventsPage();
            console.log(`✅ Updated events display with ${newEvents.length} events from auto sync`);
        });

        // Listen for general events updates
        window.addEventListener('eventsUpdated', (e) => {
            console.log('🔄 Events update received');
            const newEvents = e.detail.events || [];
                this.events = newEvents;
                this.renderEventsPage();
                console.log(`✅ Updated events display with ${newEvents.length} events`);
        });

        // Listen for auto sync events
        window.addEventListener('autoSyncsyncEnabled', () => {
            console.log('✅ Auto sync enabled for events');
        });

        window.addEventListener('autoSyncsyncDisabled', () => {
            console.log('ℹ️ Auto sync disabled for events');
        });

        // Setup UI event listeners
        this.setupUIEventListeners();
        
        console.log('🎧 Events service event listeners attached');
    }

    /**
     * Setup UI Event Listeners
     */
    setupUIEventListeners() {
        // زر إنشاء حدث
        const createEventBtn = document.getElementById('createEventBtn');
        if (createEventBtn) {
            if (this.canCreateEvents()) {
                createEventBtn.addEventListener('click', this.showCreateEventModal.bind(this));
                createEventBtn.style.display = 'flex';
                console.log('✅ Create event button enabled');
            } else {
                createEventBtn.style.display = 'none';
                console.log('❌ Create event button disabled - insufficient permissions');
            }
        }

        // البحث
        const searchInput = document.getElementById('eventsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderEventsPage();
            });
        }

        // فلاتر الفئات
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                this.selectedCategory = e.target.dataset.category;
                this.updateCategoryFilters();
                this.renderEventsPage();
            });
        });

        // إعداد النافذة المنبثقة
        this.setupModalListeners();
    }

    /**
     * تحميل الأحداث
     */
    async loadEvents() {
        this.setLoading(true);
        
        try {
            console.log('📥 تحميل الأحداث...');
            
            // محاولة التحميل من الخادم أولاً
            const serverLoaded = await this.loadEventsFromServer();
            
            if (serverLoaded && this.events.length > 0) {
                console.log('✅ تم تحميل الأحداث من الخادم بنجاح');
                this.renderEventsPage();
                return;
            }
            
            // إذا فشل التحميل من الخادم، استخدم localStorage
            const localStorageService = window.getLocalStorageService();
            if (localStorageService) {
                this.events = localStorageService.getEvents();
                console.log(`📋 تم تحميل ${this.events.length} حدث من localStorage`);
                
                if (this.events.length > 0) {
                    console.log('✅ Events loaded from localStorage, rendering...');
                    this.renderEventsPage();
                }
            } else {
                console.warn('⚠️ LocalStorage service not available');
                this.events = [];
            }
            
            // إذا كانت فارغة، حاول التحميل من JSON
            if (this.events.length === 0) {
                console.log('📄 No events in localStorage, loading from JSON...');
                try {
                    const eventsFilePath = window.getEventsFilePath() || 'JSON/events.json';
                    console.log(`📄 Attempting to load from: ${eventsFilePath}`);
                    const response = await fetch(`${eventsFilePath}?t=${Date.now()}`);
                    if (response.ok) {
                        const data = await response.json();
                        this.events = data.events || [];
                        console.log(`✅ تم تحميل ${this.events.length} حدث من ملف JSON`);
                        
                        // حفظ في localStorage
                        if (localStorageService) {
                            localStorageService.saveEvents(this.events);
                            console.log('💾 Events saved to localStorage');
                        }
                    } else {
                        throw new Error(`Failed to load JSON file: ${response.status}`);
                    }
                } catch (jsonError) {
                    console.error('❌ فشل تحميل ملف JSON:', jsonError);
                    // استخدام بيانات تجريبية
                    this.events = this.getDemoEvents();
                    console.log(`📋 استخدام البيانات التجريبية: ${this.events.length} حدث`);
                    
                    // حفظ البيانات التجريبية في localStorage
                    if (localStorageService) {
                        localStorageService.saveEvents(this.events);
                        console.log('💾 Demo events saved to localStorage');
                    }
                }
            }
            
            this.lastSync = new Date().toISOString();
            
            console.log(`✅ تم تحميل ${this.events.length} حدث محلياً`);
            
            // تأكد من عرض الأحداث بعد التحميل
            this.renderEventsPage();
            
            if (this.events.length > 0) {
                console.log(`✅ Loaded ${this.events.length} events successfully`);
            } else {
                console.log('⚠️ No events available');
            }
            
        } catch (error) {
            console.error('❌ فشل تحميل البيانات:', error.message);
            
            // Use demo data if loading fails
            this.events = this.getDemoEvents();
            console.log(`📋 Using demo events data: ${this.events.length} events`);
            this.renderEventsPage();
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * تحميل الأحداث من الخادم
     */
    async loadEventsFromServer() {
        try {
            console.log('🌐 تحميل الأحداث من الخادم...');
            
            const response = await fetch('events-manager.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.events = result.events || [];
                    console.log(`✅ تم تحميل ${this.events.length} حدث من الخادم`);
                    
                    // حفظ في localStorage
                    const localStorageService = window.getLocalStorageService();
                    if (localStorageService) {
                        localStorageService.saveEvents(this.events);
                        console.log('💾 Events saved to localStorage');
                    }
                    
                    return true;
                } else {
                    console.error('❌ فشل تحميل الأحداث من الخادم:', result.message);
                    return false;
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ خطأ في الاتصال بالخادم:', error);
            return false;
        }
    }

    /**
     * حفظ الأحداث
     */
    async saveEvents() {
        try {
            console.log('💾 حفظ الأحداث...');
            
            const localStorageService = window.getLocalStorageService();
            const result = localStorageService.saveEvents(this.events);
            this.lastSync = new Date().toISOString();
            
            console.log('✅ تم حفظ الأحداث محلياً');
            console.log('✅ Events saved locally');
            return true;
            
        } catch (error) {
            console.error('❌ فشل حفظ الأحداث:', error);
            console.log(`❌ Save failed: ${error.message}`);
            return false;
        }
    }

    /**
     * إضافة حدث جديد
     */
    async addEvent(eventData) {
        if (!this.currentUser) {
            console.log('❌ Must be logged in to create events');
            return false;
        }
        
        if (!this.canCreateEvents()) {
            this.showNotification('🚫 عذراً، ليس لديك صلاحية لإنشاء الأحداث. فقط القادة والمدراء يمكنهم إنشاء الأحداث الجديدة.', 'error');
            return false;
        }
        
        try {
            console.log('➕ إضافة حدث جديد...');
            
            // إعداد بيانات الحدث للخادم
            const newEvent = {
                ...eventData,
                attendees: [],
                status: 'upcoming',
                troop: this.currentUser.troop || 'Troop 101',
                createdBy: this.currentUser.id
            };

            // إنشاء الحدث محلياً أولاً
                const localEvent = {
                    ...newEvent,
                    id: this.generateEventId(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
            
            // إضافة للقائمة المحلية
                this.events.unshift(localEvent);
            
            // محاولة الإرسال للخادم
            const serverEvent = await this.addEventToServer(localEvent);
            
            if (serverEvent) {
                // تحديث معرف الحدث من الخادم إذا تغير
                if (serverEvent.id !== localEvent.id) {
                    const eventIndex = this.events.findIndex(e => e.id === localEvent.id);
                    if (eventIndex !== -1) {
                        this.events[eventIndex] = serverEvent;
                    }
                }
                console.log(`✅ Event "${serverEvent.title}" created successfully on server`);
                this.showNotification('تم إضافة الحدث بنجاح!', 'success');
            } else {
                console.log(`ℹ️ Event "${localEvent.title}" created locally only`);
                this.showNotification('تم إضافة الحدث محلياً (لا يمكن الوصول للخادم)', 'warning');
            }
            
            // حفظ في التخزين المحلي
            await this.saveEvents();

            return true;
            
        } catch (error) {
            console.error('❌ خطأ في إضافة الحدث:', error);
            console.log(`❌ Failed to create event: ${error.message}`);
            this.showNotification('فشل في إضافة الحدث', 'error');
            return false;
        }
    }

    /**
     * إضافة حدث إلى الخادم
     */
    async addEventToServer(eventData) {
        try {
            console.log('📤 إرسال الحدث إلى الخادم...');
            
            const response = await fetch('events-manager.php?action=add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('✅ تم إضافة الحدث إلى الخادم بنجاح');
                    return result.event;
                } else {
                    console.error('❌ فشل إضافة الحدث إلى الخادم:', result.message);
                    return null;
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ خطأ في الاتصال بالخادم:', error);
            return null;
        }
    }

    /**
     * الانضمام لحدث
     */
    async joinEvent(eventId) {
        if (!this.currentUser) {
            console.log('❌ Must be logged in to join events');
            this.showNotification('🔑 يرجى تسجيل الدخول أولاً للتمكن من الانضمام للأحداث الكشفية.', 'error');
            return false;
        }
        
        if (!this.canJoinEvents()) {
            console.log('❌ No permission to join events');
            this.showNotification('🚫 عذراً، ليس لديك صلاحية للانضمام للأحداث. فقط الأعضاء والقادة يمكنهم الانضمام.', 'error');
            return false;
        }

        const event = this.findEvent(eventId);
        if (!event) {
            console.log('❌ Event not found');
            this.showNotification('❓ عذراً، لم يتم العثور على هذا الحدث. ربما تم حذفه.', 'error');
            return false;
        }

        if (event.attendees?.includes(this.currentUser.id)) {
            console.log('❌ Already joined this event');
            this.showNotification('✅ أنت منضم لهذا الحدث بالفعل! يمكنك مراجعة تفاصيل الحدث في أي وقت.', 'warning');
            return false;
        }

        if ((event.attendees?.length || 0) >= (event.maxAttendees || 0)) {
            console.log('❌ Event is full');
            this.showNotification('😔 عذراً، الحدث ممتلئ بالكامل! لا توجد أماكن متاحة للانضمام.', 'warning');
            return false;
        }

        try {
            console.log(`👥 User ${this.currentUser.id} joining event ${eventId}...`);
            
            // تحديث الحدث محلياً
            if (!event.attendees) event.attendees = [];
            event.attendees.push(this.currentUser.id);
            event.updatedAt = new Date().toISOString();

            // تحديث بيانات المستخدم
            if (!this.currentUser.joinedEvents) {
                this.currentUser.joinedEvents = [];
            }
            this.currentUser.joinedEvents.push(eventId);
            window.AuthService?.updateUser(this.currentUser);

            // حفظ في التخزين المحلي أولاً
            const saved = await this.saveEvents();
            
            // محاولة تحديث الخادم
            await this.updateEventOnServer(eventId, { attendees: event.attendees });
            
            // عرض رسالة نجاح
            this.showNotification(`🎉 تم انضمامك للحدث "${event.title}" بنجاح! سنراك هناك.`, 'success');
            
            console.log(`✅ Joined "${event.title}" successfully`);
            this.renderEventsPage();
            
            // تحديث لوحة التحكم إذا كانت متوفرة
            if (window.DashboardService?.getInstance) {
                window.DashboardService.getInstance().refresh();
            }

            return true;
            
        } catch (error) {
            // التراجع عن التغييرات في حالة الخطأ
            event.attendees = event.attendees.filter(id => id !== this.currentUser.id);
            this.currentUser.joinedEvents = this.currentUser.joinedEvents.filter(id => id !== eventId);
            window.AuthService?.updateUser(this.currentUser);
            
            console.error('❌ خطأ في الانضمام للحدث:', error);
            this.showNotification('فشل الانضمام للحدث. حاول مرة أخرى.', 'error');
            return false;
        }
    }

    /**
     * تحديث حدث على الخادم
     */
    async updateEventOnServer(eventId, updateData) {
        try {
            console.log('📤 تحديث الحدث على الخادم...');
            
            const response = await fetch(`events-manager.php?action=update&id=${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('✅ تم تحديث الحدث على الخادم بنجاح');
                    return true;
                } else {
                    console.warn('⚠️ فشل تحديث الحدث على الخادم:', result.message);
                    return false;
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.warn('⚠️ لا يمكن الوصول للخادم، سيتم الحفظ محلياً فقط:', error);
            return false;
        }
    }

    /**
     * عرض صفحة الأحداث
     */
    renderEventsPage() {
        console.log('🎨 Rendering events page...');
        
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) {
            console.error('❌ Events grid element not found!');
            console.log('🔍 Available elements with "events" in ID:');
            document.querySelectorAll('[id*="events"]').forEach(el => {
                console.log(`  - ${el.id}: ${el.tagName}`);
            });
            return;
        }

        console.log(`📊 Current events count: ${this.events.length}`);
        console.log(`🔄 Loading state: ${this.isLoading}`);

        if (this.isLoading) {
            console.log('⏳ Showing loading state...');
            eventsGrid.innerHTML = this.getLoadingHTML();
            return;
        }

        const filteredEvents = this.getFilteredEvents();
        console.log(`📊 Rendering ${filteredEvents.length} filtered events out of ${this.events.length} total`);

        if (filteredEvents.length === 0) {
            console.log('📭 No events to display, showing empty state');
            eventsGrid.innerHTML = this.getEmptyStateHTML();
            return;
        }

        console.log('🎨 Generating event cards HTML...');
        const eventsHTML = filteredEvents
            .map(event => this.getEventCardHTML(event))
            .join('');
        
        console.log(`📝 Generated HTML length: ${eventsHTML.length} characters`);
        eventsGrid.innerHTML = eventsHTML;

        console.log('🔗 Setting up event card listeners...');
        this.setupEventCardListeners();
        
        console.log(`✅ Successfully rendered ${filteredEvents.length} events on page`);
    }

    /**
     * الحصول على الأحداث المفلترة
     */
    getFilteredEvents() {
        console.log(`🔍 Filtering ${this.events.length} events...`);
        console.log(`📂 Selected category: ${this.selectedCategory}`);
        console.log(`🔎 Search query: "${this.searchQuery}"`);
        console.log(`👤 Current user role: ${this.currentUser?.role || 'guest'}`);
        console.log(`👤 Current user troop: ${this.currentUser?.troop || 'none'}`);
        
        // Show troop normalization for current user
        if (this.currentUser?.troop) {
            const userTroopId = this.getCanonicalTroopId(this.currentUser.troop);
            console.log(`🔄 User troop normalization: "${this.currentUser.troop}" -> "${userTroopId}"`);
        }
        
        let filtered = this.events.filter(event => {
            console.log(`🔍 Checking event: ${event.id} - ${event.title}`);
            
            // فلترة حسب الفئة
            if (this.selectedCategory !== 'all' && event.category !== this.selectedCategory) {
                console.log(`❌ Event ${event.id} filtered out by category: ${event.category} !== ${this.selectedCategory}`);
                return false;
            }
            
            // فلترة حسب البحث
            if (this.searchQuery) {
                const searchFields = [
                    event.title,
                    event.description,
                    event.location,
                    event.category
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(this.searchQuery.toLowerCase())) {
                    console.log(`❌ Event ${event.id} filtered out by search: "${this.searchQuery}" not in "${searchFields}"`);
                    return false;
                }
            }
            
            // عرض جميع الأحداث للجميع - الفلترة تتم من خلال الشريط فقط
            // إذا لم يكن هناك مستخدم مصادق عليه، اعرض جميع الأحداث
            if (!this.currentUser) {
                console.log(`✅ Guest can see all events - Event ${event.id} passed filters`);
                return true;
            }
            
            // المدير يرى جميع الأحداث بدون فلترة
            if (this.currentUser.role === 'admin') {
                console.log(`✅ Admin can see all events - Event ${event.id} passed filters`);
                return true;
            }
            
            // جميع المستخدمين يرون جميع الأحداث - الفلترة تتم من خلال الشريط
            console.log(`✅ User can see all events - Event ${event.id} passed filters`);
            return true;
            
            console.log(`✅ Event ${event.id} passed all filters`);
            return true;
        });

        // ترتيب حسب التاريخ (القادمة أولاً)
        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        
        console.log(`🔍 Filtered events: ${sorted.length} out of ${this.events.length} total events`);
        return sorted;
    }

    /**
     * HTML بطاقة الحدث
     */
    getEventCardHTML(event) {
        const attendancePercentage = Math.round((event.attendees?.length || 0) / (event.maxAttendees || 1) * 100);
        const hasJoined = this.currentUser ? event.attendees?.includes(this.currentUser.id) : false;
        const isUpcoming = event.status === 'upcoming';
        const isFull = (event.attendees?.length || 0) >= (event.maxAttendees || 0);
        const category = this.categories.find(cat => cat.id === event.category);

        return `
            <article class="event-card" data-event-id="${event.id}" role="article" tabindex="0" aria-labelledby="event-title-${event.id}">
                <div class="event-image">
                    <img src="${event.image || this.getDefaultEventImage()}" alt="صورة الحدث: ${event.title}" loading="lazy" decoding="async">
                    <div class="event-category-badge" style="background-color: ${category?.color || '#6b7280'}">
                        ${category?.icon || '📅'} ${category?.name || event.category}
                    </div>
                    ${event.status ? `<div class="event-status-badge status-${event.status}">${this.getStatusDisplayName(event.status)}</div>` : ''}
                    ${hasJoined ? '<div class="joined-badge">منضم</div>' : ''}
                </div>
                <div class="event-content">
                    <h3 class="event-title" id="event-title-${event.id}">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    
                    <div class="event-details">
                        <div class="event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <time datetime="${event.date}">${this.formatDate(event.date)}</time>
                        </div>
                        <div class="event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                            <time datetime="${event.time}">${event.time}</time>
                        </div>
                        <div class="event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${event.location}
                        </div>
                    </div>

                    <div class="attendance-section">
                        <div class="attendance-info">
                            <span>👥 عدد المشاركين</span>
                            <span class="attendance-count">${event.attendees?.length || 0} من أصل ${event.maxAttendees || 0}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${attendancePercentage}%"></div>
                        </div>
                        <div class="attendance-percentage">
                            نسبة الإشغال: ${attendancePercentage}%
                        </div>
                    </div>

                    <div class="event-actions">
                        ${this.getEventActionsHTML(event, isUpcoming, isFull, hasJoined)}
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * HTML أزرار الحدث
     */
    getEventActionsHTML(event, isUpcoming, isFull, hasJoined) {
        // الزوار يمكنهم العرض فقط
        if (!this.currentUser || this.currentUser.role === 'guest') {
            return `
                <button class="btn btn-outline event-view-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    👁️ مشاهدة تفاصيل الحدث
                </button>
            `;
        }

        let actions = [];

        // زر العرض (متوفر دائماً)
        actions.push(`
            <button class="btn btn-outline event-view-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                👁️ عرض التفاصيل
            </button>
        `);

        // أزرار التحرير والحذف للمدير وجميع القادة
        
        const canManageEvent = this.currentUser && ['admin', 'leader'].includes(this.currentUser.role);
        
        if (canManageEvent) {
            actions.push(`
                <button class="btn btn-warning event-edit-btn" title="تحرير الحدث">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    ✏️ تحرير
                </button>
            `);
            
            actions.push(`
                <button class="btn btn-danger event-delete-btn" title="حذف الحدث">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    🗑️ حذف
                </button>
            `);
        }

        // زر الانضمام/المغادرة للأحداث القادمة (فقط للأعضاء والقادة)
        if (isUpcoming && this.canJoinEvents()) {
            if (hasJoined) {
                actions.push(`
                    <button class="btn btn-success" disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        ✅ منضم بالفعل
                    </button>
                `);
            } else if (isFull) {
                actions.push(`
                    <button class="btn btn-outline" disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        ❌ الحدث ممتلئ
                    </button>
                `);
            } else {
                actions.push(`
                    <button class="btn btn-primary event-join-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        🤝 انضم للحدث
                    </button>
                `);
            }
        }

        return actions.join('');
    }

    /**
     * إعداد مستمعي بطاقات الأحداث
     */
    setupEventCardListeners() {
        const eventCards = document.querySelectorAll('.event-card');
        eventCards.forEach(card => {
            const eventId = card.dataset.eventId;
            const event = this.findEvent(eventId);
            
            if (!event) return;

            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showEventDetailsModal(event);
                }
            });
            // زر العرض
            const viewBtn = card.querySelector('.event-view-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showEventDetailsModal(event);
                });
            }

            // زر الانضمام
            const joinBtn = card.querySelector('.event-join-btn');
            if (joinBtn) {
                joinBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.joinEvent(eventId);
                });
            }

            // زر التحرير
            const editBtn = card.querySelector('.event-edit-btn');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showEditEventModal(event);
                });
            }

            // زر الحذف
            const deleteBtn = card.querySelector('.event-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.confirmDeleteEvent(event);
                });
            }

            // النقر على البطاقة (عرض التفاصيل)
            card.addEventListener('click', () => {
                this.showEventDetailsModal(event);
            });
        });
    }

    /**
     * عرض نافذة تفاصيل الحدث
     */
    showEventDetailsModal(event) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = event.title;
            modalBody.innerHTML = this.getEventDetailsHTML(event);
            modal.style.display = 'flex';
        }
    }

    /**
     * HTML تفاصيل الحدث
     */
    getEventDetailsHTML(event) {
        const hasJoined = this.currentUser ? event.attendees?.includes(this.currentUser.id) : false;
        const isFull = (event.attendees?.length || 0) >= (event.maxAttendees || 0);
        const isUpcoming = event.status === 'upcoming';
        const category = this.categories.find(cat => cat.id === event.category);

        return `
            <div class="event-details">
                <img src="${event.image || this.getDefaultEventImage()}" 
                     alt="${event.title}" 
                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">
                
                <p style="margin-bottom: 16px; color: var(--text-secondary); line-height: 1.6;">${event.description}</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div>
                        <strong style="color: var(--text-primary);">التاريخ:</strong> 
                        <span style="color: var(--text-secondary);">${this.formatDate(event.date)}</span>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary);">الوقت:</strong> 
                        <span style="color: var(--text-secondary);">${event.time}</span>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary);">المكان:</strong> 
                        <span style="color: var(--text-secondary);">${event.location}</span>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary);">الفئة:</strong> 
                        <span style="color: var(--text-secondary);">${category?.icon || '📅'} ${category?.name || event.category}</span>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary);">الحضور:</strong> 
                        <span style="color: var(--text-secondary);">${event.attendees?.length || 0}/${event.maxAttendees || 0}</span>
                    </div>
                    <div>
                        <strong style="color: var(--text-primary);">الحالة:</strong> 
                        <span style="color: var(--text-secondary);">${this.getStatusDisplayName(event.status)}</span>
                    </div>
                </div>
                
                ${this.getModalActionsHTML(event, isUpcoming, isFull, hasJoined)}
            </div>
        `;
    }

    /**
     * HTML أزرار النافذة المنبثقة
     */
    getModalActionsHTML(event, isUpcoming, isFull, hasJoined) {
        if (!this.currentUser || this.currentUser.role === 'guest') {
            return '';
        }

        if (isUpcoming && !hasJoined && !isFull && this.canJoinEvents()) {
            return `
                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                    <button class="btn btn-primary" onclick="window.EventsService.getInstance().joinEventFromModal('${event.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        انضم للحدث
                    </button>
                </div>
            `;
        }
        
        return '';
    }

    /**
     * الانضمام للحدث من النافذة المنبثقة
     */
    joinEventFromModal(eventId) {
        this.joinEvent(eventId);
        this.closeModal();
    }

    /**
     * عرض نافذة تحرير الحدث
     */
    showEditEventModal(event) {
        const canManageEvent = this.currentUser && ['admin', 'leader'].includes(this.currentUser.role);
        
        if (!canManageEvent) {
            this.showNotification('ليس لديك صلاحية لتحرير الأحداث. فقط المدير والقادة يمكنهم تحرير الأحداث.', 'error');
            return;
        }

        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = 'تحرير الحدث';
            modalBody.innerHTML = this.getEditEventFormHTML(event);
            modal.style.display = 'flex';
            
            this.setupEditEventForm(event);
        }
    }

    /**
     * HTML نموذج تحرير الحدث
     */
    getEditEventFormHTML(event) {
        const categoryOptions = this.categories
            .map(cat => `<option value="${cat.id}" ${cat.id === event.category ? 'selected' : ''}>${cat.icon} ${cat.name}</option>`)
            .join('');

        return `
            <form id="editEventForm" class="event-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editEventTitle">📝 عنوان الحدث *</label>
                        <input type="text" id="editEventTitle" required placeholder="أدخل عنوان الحدث" value="${event.title}" inputmode="text">
                    </div>
                    <div class="form-group">
                        <label for="editEventCategory">🏷️ الفرقة الكشفية *</label>
                        <select id="editEventCategory" required>
                            ${categoryOptions}
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="editEventDescription">📄 وصف الحدث *</label>
                    <textarea id="editEventDescription" required placeholder="اكتب وصفاً مفصلاً عن الحدث..." rows="4" inputmode="text">${event.description}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editEventDate">📅 تاريخ الحدث *</label>
                        <input type="date" id="editEventDate" required value="${event.date}">
                    </div>
                    <div class="form-group">
                        <label for="editEventTime">🕐 وقت بداية الحدث *</label>
                        <input type="time" id="editEventTime" required value="${event.time}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editEventLocation">📍 مكان إقامة الحدث *</label>
                        <input type="text" id="editEventLocation" required placeholder="مكان الحدث" value="${event.location}" inputmode="text">
                    </div>
                    <div class="form-group">
                        <label for="editEventMaxAttendees">👥 العدد الأقصى للمشاركين *</label>
                        <input type="number" id="editEventMaxAttendees" required min="1" max="100" value="${event.maxAttendees}" inputmode="numeric">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="window.EventsService.getInstance().closeModal()">
                        ❌ إلغاء التعديل
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                        💾 حفظ التعديلات
                    </button>
                </div>
            </form>
        `;
    }

    /**
     * إعداد نموذج تحرير الحدث
     */
    setupEditEventForm(event) {
        const form = document.getElementById('editEventForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleEditEvent(e, event));
        }
    }

    /**
     * معالجة تحرير الحدث
     */
    async handleEditEvent(e, event) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('editEventTitle').value.trim(),
            description: document.getElementById('editEventDescription').value.trim(),
            date: document.getElementById('editEventDate').value,
            time: document.getElementById('editEventTime').value,
            location: document.getElementById('editEventLocation').value.trim(),
            category: document.getElementById('editEventCategory').value,
            maxAttendees: parseInt(document.getElementById('editEventMaxAttendees').value)
        };
        
        // التحقق من صحة البيانات
        if (!this.validateEventForm(formData)) {
            return;
        }

        try {
            // إظهار حالة التحميل
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading-spinner"></div> جاري الحفظ...';
            submitBtn.disabled = true;

            // تحديث الحدث
            const success = await this.updateEvent(event.id, formData);
            
            if (success) {
                this.closeModal();
                this.renderEventsPage();
                this.showNotification('تم تحديث الحدث بنجاح!', 'success');
            }

        } catch (error) {
            console.error('❌ خطأ في تحديث الحدث:', error);
            this.showNotification('فشل تحديث الحدث. حاول مرة أخرى.', 'error');
        } finally {
            // إعادة تعيين حالة الزر
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    حفظ التعديلات
                `;
                submitBtn.disabled = false;
            }
        }
    }

    /**
     * تأكيد حذف الحدث
     */
    confirmDeleteEvent(event) {
        const canManageEvent = this.currentUser && ['admin', 'leader'].includes(this.currentUser.role);
        
        if (!canManageEvent) {
            this.showNotification('ليس لديك صلاحية لحذف الأحداث. فقط المدير والقادة يمكنهم حذف الأحداث.', 'error');
            return;
        }

        const confirmMessage = `🗑️ تأكيد حذف الحدث\n\nهل أنت متأكد من حذف الحدث "${event.title}"؟\n\n⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع بيانات الحدث والمشاركين.`;
        
        if (confirm(confirmMessage)) {
            this.deleteEvent(event.id);
        }
    }

    /**
     * تحديث حدث
     */
    async updateEvent(eventId, updateData) {
        try {
            console.log('📝 تحديث الحدث...');
            
            // البحث عن الحدث وتحديثه
            const eventIndex = this.events.findIndex(event => event.id === eventId);
            if (eventIndex === -1) {
                throw new Error('الحدث غير موجود');
            }

            // حفظ البيانات القديمة للتراجع
            const originalEvent = { ...this.events[eventIndex] };

            // تحديث البيانات
            this.events[eventIndex] = {
                ...this.events[eventIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            // حفظ في التخزين المحلي
            await this.saveEvents();
            
            // محاولة تحديث الخادم
            const serverUpdated = await this.updateEventOnServer(eventId, updateData);
            
            if (!serverUpdated) {
                console.warn('⚠️ تم التحديث محلياً فقط - لا يمكن الوصول للخادم');
            }
            
            console.log(`✅ تم تحديث الحدث "${updateData.title}" بنجاح`);
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في تحديث الحدث:', error);
            return false;
        }
    }

    /**
     * حذف حدث
     */
    async deleteEvent(eventId) {
        try {
            console.log('🗑️ حذف الحدث...');
            
            // البحث عن الحدث
            const eventIndex = this.events.findIndex(event => event.id === eventId);
            if (eventIndex === -1) {
                throw new Error('الحدث غير موجود');
            }

            const eventTitle = this.events[eventIndex].title;
            const deletedEvent = { ...this.events[eventIndex] }; // حفظ للتراجع إذا فشل
            
            // حذف الحدث
            this.events.splice(eventIndex, 1);

            // حفظ في التخزين المحلي
            await this.saveEvents();
            
            // محاولة حذف من الخادم
            const serverDeleted = await this.deleteEventOnServer(eventId);
            
            if (!serverDeleted) {
                console.warn('⚠️ تم الحذف محلياً فقط - لا يمكن الوصول للخادم');
            }
            
            // تحديث العرض
            this.renderEventsPage();
            
            console.log(`✅ تم حذف الحدث "${eventTitle}" بنجاح`);
            this.showNotification(`🗑️ تم حذف الحدث "${eventTitle}" بنجاح من النظام.`, 'success');
            
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في حذف الحدث:', error);
            this.showNotification('فشل حذف الحدث. حاول مرة أخرى.', 'error');
            return false;
        }
    }

    /**
     * حذف حدث من الخادم
     */
    async deleteEventOnServer(eventId) {
        try {
            console.log('📤 حذف الحدث من الخادم...');
            
            const response = await fetch(`events-manager.php?id=${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('✅ تم حذف الحدث من الخادم بنجاح');
                    return true;
                } else {
                    console.warn('⚠️ فشل حذف الحدث من الخادم:', result.message);
                    return false;
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.warn('⚠️ لا يمكن الوصول للخادم، سيتم الحذف محلياً فقط:', error);
            return false;
        }
    }

    /**
     * عرض نافذة إنشاء حدث
     */
    showCreateEventModal() {
        if (!this.currentUser) {
            console.log('❌ Must be logged in to create events');
            return;
        }
        
        if (!this.canCreateEvents()) {
            this.showNotification('ليس لديك صلاحية لإنشاء الأحداث', 'error');
            return;
        }

        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = 'إنشاء حدث جديد';
            modalBody.innerHTML = this.getCreateEventFormHTML();
            modal.style.display = 'flex';
            
            this.setupCreateEventForm();
        }
    }

    /**
     * HTML نموذج إنشاء الحدث
     */
    getCreateEventFormHTML() {
        const categoryOptions = this.categories
            .map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`)
            .join('');

        return `
            <form id="createEventForm" class="event-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventTitle">📝 عنوان الحدث *</label>
                        <input type="text" id="eventTitle" required placeholder="مثال: رحلة تخييم نهاية الأسبوع" inputmode="text">
                    </div>
                    <div class="form-group">
                        <label for="eventCategory">🏷️ الفرقة الكشفية *</label>
                        <select id="eventCategory" required>
                            <option value="">اختر الفرقة المنظمة</option>
                            ${categoryOptions}
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="eventDescription">📄 وصف الحدث *</label>
                    <textarea id="eventDescription" required placeholder="اكتب وصفاً مفصلاً عن الحدث وأهدافه والأنشطة المتوقعة..." rows="4" inputmode="text"></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventDate">📅 تاريخ الحدث *</label>
                        <input type="date" id="eventDate" required>
                    </div>
                    <div class="form-group">
                        <label for="eventTime">🕐 وقت بداية الحدث *</label>
                        <input type="time" id="eventTime" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventLocation">📍 مكان إقامة الحدث *</label>
                        <input type="text" id="eventLocation" required placeholder="مثال: مخيم الكشافة الرئيسي" inputmode="text">
                    </div>
                    <div class="form-group">
                        <label for="eventMaxAttendees">👥 العدد الأقصى للمشاركين *</label>
                        <input type="number" id="eventMaxAttendees" required min="1" max="100" placeholder="25" inputmode="numeric">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="window.EventsService.getInstance().closeModal()">
                        ❌ إلغاء
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        ✅ إنشاء الحدث
                    </button>
                </div>
            </form>
        `;
    }

    /**
     * إعداد نموذج إنشاء الحدث
     */
    setupCreateEventForm() {
        const form = document.getElementById('createEventForm');
        if (form) {
            form.addEventListener('submit', this.handleCreateEvent.bind(this));
        }
        
        // تعيين التاريخ الافتراضي لليوم
        const dateInput = document.getElementById('eventDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        // تعيين الوقت الافتراضي
        const timeInput = document.getElementById('eventTime');
        if (timeInput) {
            timeInput.value = '10:00';
        }
    }

    /**
     * معالجة إنشاء الحدث
     */
    async handleCreateEvent(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('eventTitle').value.trim(),
            description: document.getElementById('eventDescription').value.trim(),
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value.trim(),
            category: document.getElementById('eventCategory').value,
            maxAttendees: parseInt(document.getElementById('eventMaxAttendees').value)
        };
        
        // التحقق من صحة البيانات
        if (!this.validateEventForm(formData)) {
            return;
        }

        try {
            // إظهار حالة التحميل
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading-spinner"></div> جاري الإنشاء...';
            submitBtn.disabled = true;

            // إضافة الحدث
            const success = await this.addEvent(formData);
            
            if (success) {
                this.closeModal();
                this.renderEventsPage();
                
                // تحديث لوحة التحكم إذا كانت متوفرة
                if (window.DashboardService?.getInstance) {
                    window.DashboardService.getInstance().refresh();
                }
            }

        } catch (error) {
            console.error('❌ خطأ في إنشاء الحدث:', error);
            this.showNotification('فشل إنشاء الحدث. حاول مرة أخرى.', 'error');
        } finally {
            // إعادة تعيين حالة الزر
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    إنشاء الحدث
                `;
                submitBtn.disabled = false;
            }
        }
    }

    /**
     * التحقق من صحة نموذج الحدث
     */
    validateEventForm(formData) {
        const requiredFields = ['title', 'description', 'date', 'time', 'location', 'category'];
        
        for (const field of requiredFields) {
            if (!formData[field]) {
                this.showNotification(`يرجى ملء حقل ${this.getFieldDisplayName(field)}`, 'error');
                return false;
            }
        }
        
        if (!formData.maxAttendees || formData.maxAttendees < 1) {
            this.showNotification('الحد الأقصى للحضور يجب أن يكون 1 على الأقل', 'error');
            return false;
        }
        
        // التحقق من أن التاريخ في المستقبل
        const eventDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
            this.showNotification('تاريخ الحدث يجب أن يكون في المستقبل', 'error');
            return false;
        }
        
        return true;
    }

    /**
     * إعداد مستمعي النافذة المنبثقة
     */
    setupModalListeners() {
        const eventModal = document.getElementById('eventModal');
        const eventModalClose = document.getElementById('closeModal');
        
        if (eventModalClose) {
            eventModalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (eventModal) {
            eventModal.addEventListener('click', (e) => {
                if (e.target === eventModal) {
                    this.closeModal();
                }
            });
        }
    }

    /**
     * تحديث فلاتر الفئات
     */
    updateCategoryFilters() {
        const filters = document.querySelectorAll('.category-filter');
        filters.forEach(filter => {
            filter.classList.toggle('active', filter.dataset.category === this.selectedCategory);
        });
    }

    /**
     * إغلاق النافذة المنبثقة
     */
    closeModal() {
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            
            // إزالة أي محتوى من النافذة لتجنب المشاكل
            const modalBody = document.getElementById('modalBody');
            if (modalBody) {
                modalBody.innerHTML = '';
            }
            
            // إعادة تعيين العنوان الافتراضي
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) {
                modalTitle.textContent = 'عنوان النافذة';
            }
        }
    }

    /**
     * التأكد من إخفاء النافذة المنبثقة
     */
    ensureModalHidden() {
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            
            // تنظيف المحتوى
            const modalBody = document.getElementById('modalBody');
            if (modalBody) {
                modalBody.innerHTML = '';
            }
            
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) {
                modalTitle.textContent = 'عنوان النافذة';
            }
            
            console.log('✅ تم التأكد من إخفاء النافذة المنبثقة');
        }
    }

    /**
     * تعيين حالة التحميل
     */
    setLoading(loading) {
        this.isLoading = loading;
    }

    /**
     * HTML حالة فارغة
     */
    getEmptyStateHTML() {
        const title = this.searchQuery || this.selectedCategory !== 'all' 
            ? '🔍 لم نجد أي أحداث مطابقة!' 
            : '📅 لا توجد أحداث متاحة حالياً';
        
        let description = this.searchQuery || this.selectedCategory !== 'all'
            ? 'جرب تعديل كلمات البحث أو اختيار فرقة مختلفة للعثور على الأحداث المناسبة.'
            : 'لا توجد أحداث كشفية متاحة في الوقت الحالي. تابعنا للحصول على آخر التحديثات!';

        const actionText = this.canCreateEvents() ? 
            '<br><br>💡 يمكنك إنشاء حدث جديد بالنقر على زر "إنشاء حدث" أعلاه.' : '';

        return `
            <div class="events-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h3>${title}</h3>
                <p>${description}${actionText}</p>
            </div>
        `;
    }

    /**
     * HTML حالة التحميل
     */
    getLoadingHTML() {
        return `
            <div class="events-loading">
                <svg class="loading-spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                <span>📱 جاري تحميل الأحداث الكشفية...</span>
                <small style="margin-top: 8px; color: var(--text-muted);">يرجى الانتظار بينما نحضر لك أحدث الأحداث</small>
            </div>
        `;
    }

    /**
     * الحصول على بيانات تجريبية
     */
    getDemoEvents() {
        return [
            {
                id: "demo_1",
                title: "رحلة تخييم نهاية الأسبوع",
                description: "مغامرة تخييم لثلاثة أيام مع أنشطة المشي والنار. تعلم مهارات البقاء في الهواء الطلق واستمتع بالطبيعة.",
                date: "2025-01-20",
                time: "09:00",
                location: "موقع التخييم الجبلي",
                attendees: [],
                maxAttendees: 25,
                category: "ramita",
                image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                status: "upcoming",
                troop: "Troop 101",
                createdBy: "1",
                createdAt: "2025-01-15T10:00:00Z",
                updatedAt: "2025-01-15T10:00:00Z"
            },
            {
                id: "demo_2",
                title: "مشروع خدمة المجتمع",
                description: "ساعد في تنظيف الحديقة المحلية وزراعة أشجار جديدة. اصنع تأثيراً إيجابياً في مجتمعنا.",
                date: "2025-01-25",
                time: "14:00",
                location: "الحديقة المركزية",
                attendees: [],
                maxAttendees: 20,
                category: "ma3lola",
                image: "https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                status: "upcoming",
                troop: "Troop 101",
                createdBy: "2",
                createdAt: "2025-01-14T15:30:00Z",
                updatedAt: "2025-01-14T15:30:00Z"
            },
            {
                id: "demo_3",
                title: "ورشة الإسعافات الأولية",
                description: "تعلم مهارات الإسعافات الأولية الأساسية. مدربون معتمدون سيرشدونك خلال التمارين العملية.",
                date: "2025-01-28",
                time: "10:00",
                location: "قاعة الكشافة",
                attendees: [],
                maxAttendees: 15,
                category: "sergila",
                image: "https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                status: "upcoming",
                troop: "Troop 101",
                createdBy: "1",
                createdAt: "2025-01-13T09:15:00Z",
                updatedAt: "2025-01-13T09:15:00Z"
            }
        ];
    }

    // ===========================================
    // دوال مساعدة
    // ===========================================

    /**
     * البحث عن حدث
     */
    findEvent(eventId) {
        return this.events.find(event => event.id == eventId);
    }

    /**
     * التحقق من صلاحية إنشاء الأحداث
     */
    canCreateEvents() {
        return this.currentUser && ['leader', 'admin'].includes(this.currentUser.role);
    }

    /**
     * التحقق من صلاحية الانضمام للأحداث
     */
    canJoinEvents() {
        // المدير لا يمكنه الانضمام للأحداث - فقط الأعضاء والقادة
        return this.currentUser && ['member', 'leader'].includes(this.currentUser.role);
    }

    /**
     * توليد معرف حدث فريد
     */
    generateEventId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * تنسيق التاريخ
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            calendar: 'gregory'
        });
    }

    /**
     * الحصول على اسم عرض الحالة
     */
    getStatusDisplayName(status) {
        const statusMap = {
            'upcoming': '🟢 قادم',
            'past': '⚪ منتهي',
            'cancelled': '🔴 ملغي',
            'active': '🟡 نشط',
            'pending': '🟠 في الانتظار'
        };
        return statusMap[status] || '❓ غير محدد';
    }

    /**
     * الحصول على اسم عرض الحقل
     */
    getFieldDisplayName(field) {
        const fieldMap = {
            'title': '📝 العنوان',
            'description': '📄 الوصف',
            'date': '📅 التاريخ',
            'time': '🕐 الوقت',
            'location': '📍 المكان',
            'category': '🏷️ الفئة',
            'maxAttendees': '👥 الحد الأقصى للحضور',
            'attendees': '👥 المشاركون',
            'troop': '🏕️ الفرقة',
            'status': '📊 الحالة'
        };
        return fieldMap[field] || field;
    }

    /**
     * الحصول على صورة افتراضية للحدث
     */
    getDefaultEventImage() {
        const defaultImages = [
            'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        ];
        return defaultImages[Math.floor(Math.random() * defaultImages.length)];
    }

    /**
     * عرض إشعار
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
        }, 4000);
    }

    /**
     * الحصول على أيقونة الإشعار
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

    // ===========================================
            // دوال عامة
    // ===========================================

    /**
     * تحديث الخدمة
     */
    async refresh() {
        console.log('🔄 Refreshing events service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        console.log(`👤 Current user: ${this.currentUser?.name || 'Guest'} (${this.currentUser?.role || 'guest'})`);
        
        this.setupUIEventListeners();
        await this.loadEvents();
        this.renderEventsPage();
        
        console.log('✅ Events service refreshed');
    }

    /**
     * الحصول على الأحداث
     */
    getEvents() {
        return this.events;
    }

    /**
     * الحصول على الأحداث المفلترة (عامة)
     */
    getFilteredEventsPublic() {
        return this.getFilteredEvents();
    }

    /**
     * دالة مساعدة لاختبار عرض الأحداث
     */
    debugEventsDisplay() {
        console.log('🔍 === DEBUG EVENTS DISPLAY ===');
        console.log(`📊 Total events: ${this.events.length}`);
        console.log(`👤 Current user:`, this.currentUser);
        
        // Show troop normalization
        if (this.currentUser?.troop) {
            const userTroopId = this.getCanonicalTroopId(this.currentUser.troop);
            console.log(`🔄 User troop normalization: "${this.currentUser.troop}" -> "${userTroopId}"`);
        }
        
        console.log(`📂 Selected category: ${this.selectedCategory}`);
        console.log(`🔎 Search query: "${this.searchQuery}"`);
        
        // Show troop information for first few events
        console.log('📋 Sample events troop info:');
        this.events.slice(0, 3).forEach(event => {
            const eventTroopId = this.getCanonicalTroopId(event.troop);
            console.log(`  - Event ${event.id}: "${event.troop}" -> "${eventTroopId}"`);
        });
        
        const eventsGrid = document.getElementById('eventsGrid');
        console.log(`🎯 Events grid element:`, eventsGrid);
        
        if (eventsGrid) {
            console.log(`📝 Current grid HTML length: ${eventsGrid.innerHTML.length}`);
            console.log(`📝 Current grid HTML:`, eventsGrid.innerHTML.substring(0, 200) + '...');
        }
        
        const filteredEvents = this.getFilteredEvents();
        console.log(`🔍 Filtered events: ${filteredEvents.length}`);
        
        console.log('🔍 === END DEBUG ===');
    }

    /**
     * دالة إجبارية لعرض الأحداث
     */
    forceRenderEvents() {
        console.log('🚀 Force rendering events...');
        
        // إعادة تحميل البيانات
        this.loadEvents().then(() => {
            console.log('✅ Data reloaded, rendering events...');
            this.renderEventsPage();
        }).catch(error => {
            console.error('❌ Error in force render:', error);
        });
    }
}

// ===========================================
// SINGLETON PATTERN
// ===========================================

let eventsServiceInstance = null;

/**
 * Get Events Service Instance
 * @returns {EventsService} Events service instance
 */
function getEventsService() {
    if (!eventsServiceInstance) {
        eventsServiceInstance = new EventsService();
    }
    return eventsServiceInstance;
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // التأكد من إخفاء النافذة المنبثقة فور تحميل الصفحة
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        console.log('✅ تم إخفاء النافذة المنبثقة عند تحميل الصفحة');
    }
    
    // تهيئة خدمة الأحداث فور تحميل الصفحة
    console.log('📅 Initializing Events Service on page load...');
    window.eventsService = getEventsService();
    
    // إذا كان المستخدم مصادق عليه، قم بتحديث الخدمة
    if (window.AuthService?.isAuthenticated()) {
        console.log('👤 User is authenticated, updating events service...');
        setTimeout(() => {
            window.eventsService.refresh();
        }, 1000);
    }
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.EventsService = EventsService;
window.getEventsService = getEventsService;

// إضافة دالة getInstance للتوافق مع النظام الحالي
window.EventsService.getInstance = getEventsService;

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventsService, getEventsService };
}

console.log('📅 Events service module loaded');

// ===========================================
// دوال مساعدة للاختبار والتصحيح
// ===========================================

// دالة اختبار عرض الأحداث
window.debugEvents = function() {
    if (window.eventsService) {
        window.eventsService.debugEventsDisplay();
    } else {
        console.error('❌ Events service not available');
    }
};

// دالة إجبارية لعرض الأحداث
window.forceRenderEvents = function() {
    if (window.eventsService) {
        window.eventsService.forceRenderEvents();
    } else {
        console.error('❌ Events service not available');
    }
};

// دالة اختبار تحميل البيانات
window.testEventsData = function() {
    console.log('🧪 Testing events data...');
    
    const localStorageService = window.getLocalStorageService();
    if (localStorageService) {
        const events = localStorageService.getEvents();
        console.log(`📊 Events in localStorage: ${events.length}`);
        console.log('📋 Events data:', events);
    } else {
        console.error('❌ LocalStorage service not available');
    }
};

// دالة اختبار تطبيع أسماء الفرق
window.testTroopNormalization = function() {
    console.log('🔄 Testing troop name normalization...');
    
    if (window.eventsService) {
        const testCases = [
            'فرقة رميتا',
            'Ramita',
            'رميتا',
            'Troop 101',
            'فرقة معلولا',
            'Ma3lola',
            'معلولا',
            'فرقة سرجيلا',
            'Sergila',
            'سرجيلا',
            'فرقة بوسرا',
            'Bousra',
            'بوسرا'
        ];
        
        testCases.forEach(troopName => {
            const canonicalId = window.eventsService.getCanonicalTroopId(troopName);
            console.log(`"${troopName}" -> "${canonicalId}"`);
        });
    } else {
        console.error('❌ Events service not available');
    }
};

// دالة اختبار عرض جميع الأحداث
window.testAllEvents = function() {
    console.log('📋 Testing display of all events...');
    
    if (window.eventsService) {
        console.log(`📊 Total events available: ${window.eventsService.events.length}`);
        console.log('📋 All events:');
        window.eventsService.events.forEach(event => {
            console.log(`  - ${event.id}: ${event.title} (${event.troop || 'No troop'})`);
        });
        
        // Force render with all events
        window.eventsService.selectedCategory = 'all';
        window.eventsService.searchQuery = '';
        window.eventsService.renderEventsPage();
    } else {
        console.error('❌ Events service not available');
    }
};

// ===========================================
// دالة تحميل صفحة الأحداث (للتوافق مع النظام الحالي)
// ===========================================

function loadEventsPage() {
    console.log('📅 تحميل صفحة الأحداث...');
    
    if (window.EventsService?.getInstance) {
        window.EventsService.getInstance().refresh();
    } else {
        console.warn('⚠️ خدمة الأحداث غير متوفرة');
    }
}

// جعل الدالة متاحة عالمياً
window.loadEventsPage = loadEventsPage;