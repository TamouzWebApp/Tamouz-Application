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
            { id: 'ramita', name: 'رميتا', color: '#10b981', icon: '🌲' },
            { id: 'ma3lola', name: 'معلولا', color: '#3b82f6', icon: '🤝' },
            { id: 'sergila', name: 'سرجيلا', color: '#f59e0b', icon: '📚' },
            { id: 'bousra', name: 'بوسرا', color: '#ef4444', icon: '🏆' }
        ];
        
        this.init();
    }

    /**
     * تهيئة الخدمة
     */
    async init() {
        console.log('🚀 تهيئة خدمة الأحداث...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
        if (!this.currentUser) {
            console.error('❌ لا يوجد مستخدم مصادق');
            return;
        }
        
        await this.loadEvents();
        this.setupEventListeners();
        this.renderEventsPage();
        
        console.log('✅ تم تهيئة خدمة الأحداث بنجاح');
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Listen for page changes
        window.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'events') {
                this.renderEventsPage();
            }
        });

        // Listen for API events
        window.addEventListener('apiEventsLoaded', (e) => {
            this.events = e.detail.events || [];
            this.renderEventsPage();
        });

        window.addEventListener('apiEventsSaved', (e) => {
            this.lastSync = new Date().toISOString();
            this.showNotification('تم حفظ الأحداث بنجاح!', 'success');
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
            } else {
                createEventBtn.style.display = 'none';
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
            
            // محاولة تحميل من API أولاً
            if (window.APIService?.getInstance) {
                try {
                    const apiService = window.APIService.getInstance();
                    const apiData = await apiService.readEvents();
                    this.events = apiData.events || [];
                    this.lastSync = new Date().toISOString();
                    
                    console.log(`✅ تم تحميل ${this.events.length} حدث من API`);
                    this.showNotification(`تم تحميل ${this.events.length} حدث من الخادم`, 'success');
                    
                } catch (apiError) {
                    console.warn('⚠️ فشل API، محاولة التحميل من JSON:', apiError.message);
                    throw apiError;
                }
            } else {
                throw new Error('API service غير متوفر');
            }
            
        } catch (error) {
            console.warn('⚠️ فشل API، محاولة التحميل من JSON:', error.message);
            
            try {
                // محاولة تحميل من ملف JSON
                const response = await fetch('./events.json');
                if (response.ok) {
                    const jsonData = await response.json();
                    this.events = jsonData.events || [];
                    console.log(`📋 تم تحميل ${this.events.length} حدث من JSON`);
                    this.showNotification('تم تحميل الأحداث من الملف المحلي', 'info');
                } else {
                    throw new Error('ملف JSON غير متاح');
                }
            } catch (jsonError) {
                console.warn('⚠️ فشل JSON، استخدام البيانات التجريبية:', jsonError.message);
                
                // استخدام البيانات التجريبية كحل أخير
                this.events = [...(window.DEMO_EVENTS || [])];
                console.log(`📋 تم تحميل ${this.events.length} حدث من البيانات التجريبية`);
                this.showNotification('استخدام البيانات التجريبية - API غير متوفر', 'warning');
            }
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * حفظ الأحداث
     */
    async saveEvents() {
        if (!window.APIService?.getInstance) {
            console.warn('⚠️ خدمة API غير متوفرة');
            return false;
        }

        try {
            console.log('💾 حفظ الأحداث...');
            
            const apiService = window.APIService.getInstance();
            const result = await apiService.writeEvents(this.events);
            this.lastSync = new Date().toISOString();
            
            console.log('✅ تم حفظ الأحداث بنجاح');
            this.showNotification('تم حفظ الأحداث بنجاح!', 'success');
            return true;
            
        } catch (error) {
            console.error('❌ فشل حفظ الأحداث:', error);
            this.showNotification(`فشل الحفظ: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * إضافة حدث جديد
     */
    async addEvent(eventData) {
        try {
            console.log('➕ إضافة حدث جديد...');
            
            // إعداد بيانات الحدث
            const newEvent = {
                ...eventData,
                id: this.generateEventId(),
                attendees: [],
                status: 'upcoming',
                troop: this.currentUser.troop,
                createdBy: this.currentUser.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // إضافة محلياً
            this.events.unshift(newEvent);
            
            // محاولة الحفظ في API
            const saved = await this.saveEvents();
            
            if (saved) {
                this.showNotification(`تم إنشاء الحدث "${newEvent.title}" بنجاح!`, 'success');
            } else {
                this.showNotification(`تم إنشاء الحدث محلياً - سيتم المزامنة لاحقاً`, 'warning');
            }

            return true;
            
        } catch (error) {
            console.error('❌ خطأ في إضافة الحدث:', error);
            this.showNotification(`فشل إنشاء الحدث: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * الانضمام لحدث
     */
    async joinEvent(eventId) {
        if (!this.canJoinEvents()) {
            this.showNotification('ليس لديك صلاحية للانضمام للأحداث', 'error');
            return false;
        }

        const event = this.findEvent(eventId);
        if (!event) {
            this.showNotification('الحدث غير موجود', 'error');
            return false;
        }

        if (event.attendees?.includes(this.currentUser.id)) {
            this.showNotification('أنت منضم لهذا الحدث بالفعل!', 'error');
            return false;
        }

        if ((event.attendees?.length || 0) >= (event.maxAttendees || 0)) {
            this.showNotification('الحدث ممتلئ!', 'error');
            return false;
        }

        try {
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

            // محاولة المزامنة مع API
            const saved = await this.saveEvents();
            
            if (saved) {
                this.showNotification(`تم الانضمام لـ "${event.title}" بنجاح!`, 'success');
            } else {
                this.showNotification(`تم الانضمام لـ "${event.title}" - سيتم المزامنة لاحقاً`, 'warning');
            }

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
     * عرض صفحة الأحداث
     */
    renderEventsPage() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;

        if (this.isLoading) {
            eventsGrid.innerHTML = this.getLoadingHTML();
            return;
        }

        const filteredEvents = this.getFilteredEvents();

        if (filteredEvents.length === 0) {
            eventsGrid.innerHTML = this.getEmptyStateHTML();
            return;
        }

        eventsGrid.innerHTML = filteredEvents
            .map(event => this.getEventCardHTML(event))
            .join('');

        this.setupEventCardListeners();
    }

    /**
     * الحصول على الأحداث المفلترة
     */
    getFilteredEvents() {
        let filtered = this.events.filter(event => {
            // فلترة حسب الفرقة (إذا لم يكن مدير)
            if (this.currentUser.role !== 'admin' && event.troop !== this.currentUser.troop) {
                return false;
            }
            
            // فلترة حسب الفئة
            if (this.selectedCategory !== 'all' && event.category !== this.selectedCategory) {
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
                
                if (!searchFields.includes(this.searchQuery)) {
                    return false;
                }
            }
            
            return true;
        });

        // ترتيب حسب التاريخ (القادمة أولاً)
        return filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
    }

    /**
     * HTML بطاقة الحدث
     */
    getEventCardHTML(event) {
        const attendancePercentage = Math.round((event.attendees?.length || 0) / (event.maxAttendees || 1) * 100);
        const hasJoined = event.attendees?.includes(this.currentUser.id);
        const isUpcoming = event.status === 'upcoming';
        const isFull = (event.attendees?.length || 0) >= (event.maxAttendees || 0);
        const category = this.categories.find(cat => cat.id === event.category);

        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${event.image || this.getDefaultEventImage()}" alt="${event.title}" loading="lazy">
                    <div class="event-category-badge" style="background-color: ${category?.color || '#6b7280'}">
                        ${category?.icon || '📅'} ${category?.name || event.category}
                    </div>
                    ${event.status ? `<div class="event-status-badge status-${event.status}">${this.getStatusDisplayName(event.status)}</div>` : ''}
                    ${hasJoined ? '<div class="joined-badge">منضم</div>' : ''}
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    
                    <div class="event-details">
                        <div class="event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            ${this.formatDate(event.date)}
                        </div>
                        <div class="event-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                            ${event.time}
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
                            <span>الحضور</span>
                            <span class="attendance-count">${event.attendees?.length || 0}/${event.maxAttendees || 0}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${attendancePercentage}%"></div>
                        </div>
                    </div>

                    <div class="event-actions">
                        ${this.getEventActionsHTML(event, isUpcoming, isFull, hasJoined)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * HTML أزرار الحدث
     */
    getEventActionsHTML(event, isUpcoming, isFull, hasJoined) {
        // الزوار يمكنهم العرض فقط
        if (this.currentUser.role === 'guest') {
            return `
                <button class="btn btn-outline event-view-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    عرض التفاصيل
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
                عرض
            </button>
        `);

        // زر الانضمام/المغادرة للأحداث القادمة
        if (isUpcoming && this.canJoinEvents()) {
            if (hasJoined) {
                actions.push(`
                    <button class="btn btn-success" disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        منضم
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
                        ممتلئ
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
                        انضم
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
        const hasJoined = event.attendees?.includes(this.currentUser.id);
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
        if (this.currentUser.role === 'guest') {
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
     * عرض نافذة إنشاء حدث
     */
    showCreateEventModal() {
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
                        <label for="eventTitle">عنوان الحدث *</label>
                        <input type="text" id="eventTitle" required placeholder="أدخل عنوان الحدث">
                    </div>
                    <div class="form-group">
                        <label for="eventCategory">الفئة *</label>
                        <select id="eventCategory" required>
                            <option value="">اختر الفئة</option>
                            ${categoryOptions}
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="eventDescription">الوصف *</label>
                    <textarea id="eventDescription" required placeholder="وصف الحدث..." rows="3"></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventDate">التاريخ *</label>
                        <input type="date" id="eventDate" required>
                    </div>
                    <div class="form-group">
                        <label for="eventTime">الوقت *</label>
                        <input type="time" id="eventTime" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventLocation">المكان *</label>
                        <input type="text" id="eventLocation" required placeholder="مكان الحدث">
                    </div>
                    <div class="form-group">
                        <label for="eventMaxAttendees">الحد الأقصى للحضور *</label>
                        <input type="number" id="eventMaxAttendees" required min="1" placeholder="25">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="window.EventsService.getInstance().closeModal()">
                        إلغاء
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        إنشاء الحدث
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
            ? 'لا توجد أحداث' 
            : 'لا توجد أحداث متاحة';
        
        const description = this.searchQuery || this.selectedCategory !== 'all'
            ? 'جرب تعديل معايير البحث أو الفلترة'
            : 'لا توجد أحداث متاحة لفرقتك حتى الآن.';

        return `
            <div class="events-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h3>${title}</h3>
                <p>${description}</p>
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
                <span>جاري تحميل الأحداث...</span>
            </div>
        `;
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
        return this.currentUser && ['member', 'leader', 'admin'].includes(this.currentUser.role);
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
        return date.toLocaleDateString('ar-SA', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * الحصول على اسم عرض الحالة
     */
    getStatusDisplayName(status) {
        const statusMap = {
            'upcoming': 'قادم',
            'past': 'منتهي',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    }

    /**
     * الحصول على اسم عرض الحقل
     */
    getFieldDisplayName(field) {
        const fieldMap = {
            'title': 'العنوان',
            'description': 'الوصف',
            'date': 'التاريخ',
            'time': 'الوقت',
            'location': 'المكان',
            'category': 'الفئة'
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
    // API عامة
    // ===========================================

    /**
     * تحديث الخدمة
     */
    async refresh() {
        console.log('🔄 Refreshing events service...');
        
        this.currentUser = window.AuthService?.getCurrentUser();
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
    if (window.AuthService?.isAuthenticated()) {
        console.log('📅 Initializing Events Service...');
        window.eventsService = getEventsService();
    }
});

// ===========================================
// GLOBAL EXPORTS
// ===========================================

window.EventsService = EventsService;
window.getEventsService = getEventsService;

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventsService, getEventsService };
}

console.log('📅 Events service module loaded');

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