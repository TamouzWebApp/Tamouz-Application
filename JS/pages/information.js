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
        this.currentCategory = 'history';
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
                id: 'history',
                name: 'تاريخ الكشفية',
                icon: 'book',
                description: 'تاريخ نشأة الحركة الكشفية وتطورها'
            },
            {
                id: 'founder',
                name: 'المؤسس',
                icon: 'user',
                description: 'اللورد روبرت بادن باول مؤسس الحركة الكشفية'
            },
            {
                id: 'syria',
                name: 'الكشفية في سورية',
                icon: 'flag',
                description: 'تاريخ الحركة الكشفية في سورية والقوانين'
            },
            {
                id: 'principles',
                name: 'أسس الحركة',
                icon: 'compass',
                description: 'المبادئ والأسس التي تقوم عليها الحركة الكشفية'
            },
            {
                id: 'symbols',
                name: 'الشارات والرموز',
                icon: 'star',
                description: 'الشارات الكشفية والرموز ومعانيها'
            },
            {
                id: 'traditions',
                name: 'التقاليد الكشفية',
                icon: 'heart',
                description: 'التقاليد والطقوس الكشفية المختلفة'
            },
            {
                id: 'camping',
                name: 'مهارات التخييم',
                icon: 'tent',
                description: 'المهارات الأساسية للتخييم والحياة في الطبيعة'
            },
            {
                id: 'skills',
                name: 'المهارات الكشفية',
                icon: 'tool',
                description: 'المهارات العملية والفنية للكشاف'
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
            <div class="information-page">
                <div class="information-header">
                    <h1>مركز المعلومات الكشفية</h1>
                    <p>المعرفة والمهارات الكشفية الأساسية لكل مغامرة</p>
                </div>
                
                <div class="information-categories">
                    ${this.categories.map(category => this.getCategoryButtonHTML(category)).join('')}
                </div>
                
                <div class="information-content-area">
                    <div id="categoryContent" class="category-content">
                        <!-- Category content will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get Information Page HTML (Old method - keeping for compatibility)
     */
    getInformationHTMLOld() {
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
            book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
            user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
            flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>',
            compass: '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>',
            star: '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>',
            heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"></path>',
            tent: '<path d="M3 20h18l-9-15z"></path><path d="M12 5v15"></path>',
            tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>'
        };
        return icons[iconType] || icons.book;
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
            history: {
                title: 'ولادة فكرة التأسيس للحركة الكشفية',
                description: 'تاريخ نشأة الحركة الكشفية وتطورها عبر العالم',
                items: [
                    {
                        name: 'بداية الفكرة في كندا',
                        difficulty: 'تاريخي',
                        uses: 'فهم جذور الحركة الكشفية',
                        steps: [
                            'رأى ضابط إنكليزي يدعى روبرت بادن باول أحد مدربي الأطفال في غابات كندا',
                            'لاحظ كيف يعلم الأطفال الاختفاء بين الأدغال والغوص في الأنهار',
                            'رأى كيف قويت أجسامهم وأصبح باستطاعتهم مقاومة الطبيعة',
                            'تفتحت فكرة مغمضة في نفسه وهو بادن باول',
                            'سافر إلى إفريقيا ليستلم وظيفته كضابط في حرس مدينة مافكينغ'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'حصار مافكينغ والتجربة العملية',
                        difficulty: 'تاريخي',
                        uses: 'التطبيق العملي للفكرة الكشفية',
                        steps: [
                            'هاجم البوير مدينة مافكينغ مهاجمة عنيفة مفاجئة',
                            'قتلوا عدداً كبيراً من حاميتها وكادوا أن يستولوا عليها',
                            'اضطر القائد اللورد سيسيل لكبح جماح خوفه',
                            'أنشأ من الفتيان الأحداث فرقة منظمة قامت مقام من فقد من الجند',
                            'سهلت المواصلة على دراجاتها بين الحامية والمدينة ومراكز الدفاع',
                            'نجح اللورد في دفاعه عن المدينة نجاحاً باهراً واسعاً'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            founder: {
                title: 'اللورد روبرت بادن باول مؤسس الحركة الكشفية',
                description: 'سيرة حياة مؤسس الحركة الكشفية وإنجازاته',
                items: [
                    {
                        name: 'النشأة والطفولة (1857)',
                        difficulty: 'سيرة ذاتية',
                        uses: 'فهم شخصية المؤسس',
                        steps: [
                            'ولد سنة 1857 من عائلة أرستقراطية كثيرة الأولاد',
                            'كان له أربعة إخوة وأخت واحدة وله إخوة آخرون من والده',
                            'كان والده أستاذاً في جامعة أكسفورد بدرجة بروفيسور',
                            'أمه هنرية ابنة أمرال البحرية',
                            'لم يكن ذلك التلميذ العبقري أثناء دراسته الابتدائية',
                            'كان يحب الرحلات والمغامرات منذ نشأته'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'الحياة العسكرية وحرب البوير (1876-1899)',
                        difficulty: 'سيرة ذاتية',
                        uses: 'فهم تكوين شخصية القائد',
                        steps: [
                            'في سنة 1876 التحق بالجيش وأصبح ضابطاً في الفوج الثالث عشر',
                            'في حرب البوير 1899 حوصر بادن باول ورجاله في قلعة مافكينغ',
                            'دام حصاره 217 يوماً واعتبرته إنجلترا نذير شؤم',
                            'فكر بادن باول بالاستعانة بالشباب لفك الحصار',
                            'وزع عليهم أعمال الخدمات العسكرية كالحراسة والتبليغ ونقل الرسائل',
                            'تمكن من فك الحصار بعد 217 يوماً وأصبح بطلاً وطنياً عظيماً'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'تأسيس الحركة الكشفية (1907)',
                        difficulty: 'تاريخي',
                        uses: 'فهم بداية الحركة الكشفية',
                        steps: [
                            'في تموز 1907 كون دورة تجريبية من عشرين فتى لمدة أسبوع',
                            'وضع رئيساً لكل دورية حتى ينمي فيهم خلق الألعاب والحياة اليومية',
                            'نشر بعد ذلك كتاباً للكشافة وبدأ بالتفكير بتكوين الحركة الكشفية',
                            'طلب منه الملك إدوارد الثامن ملك إنجلترا بترك الجندية',
                            'أعطاها شعار "كن مستعداً" وهذا شعار الكشاف ومن حكمته',
                            'أصبح بادن باول رئيساً للحركة الكشفية وأخذ ينشر المسابقات الثقافية'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'الإنجازات والوفاة (1920-1941)',
                        difficulty: 'تاريخي',
                        uses: 'فهم إرث المؤسس',
                        steps: [
                            'في عام 1920 تحقق الحلم الأكبر لبادن باول',
                            'تجمع في قصر الكريستال في لندن حوالي 11 ألف كشاف وقائد',
                            'سمي هذا اللقاء (جمبوري) ونُصب بادن باول كرئيس لكشافة العالم',
                            'فرضت عليه هذه الرتبة أن يقوم بجولة حول العالم رغم كبر سنه',
                            'كان يدير كل سنة لقاءً له في بلد مختلف وكان آخر لقاء له في النرويج',
                            'توفي بادن باول عام 1941 بعد أن أنجز رسالته الخيرة'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            syria: {
                title: 'تاريخ الحركة الكشفية في سورية',
                description: 'نشأة وتطور الحركة الكشفية في سورية والقوانين المنظمة لها',
                items: [
                    {
                        name: 'أول فرقة كشفية في سورية (1912)',
                        difficulty: 'تاريخي',
                        uses: 'فهم بدايات الكشفية في سورية',
                        steps: [
                            'تأسست بسورية أول فرقة كشفية في بيروت عام 1912',
                            'باسم جمعية الكشاف العثماني (الكشاف المسلم)',
                            'أسسها السيد عبد الجبار خيري وهو من أصل هندي آسيوي',
                            'بدعم من الشيخ اللبناني توفيق الهبري',
                            'قامت هذه الفرقة بزيارة إلى دمشق على الأقدام',
                            'على أثر هذه الزيارة تأسست في دمشق أول فرقة كشفية'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'التوسع والانتشار (1913)',
                        difficulty: 'تاريخي',
                        uses: 'فهم نمو الحركة الكشفية',
                        steps: [
                            'تأسست فرقة كشفية باسم كشافة مدرسة الكلية العلمية الوطنية',
                            'ثم تأسست فرقة كشفية ثانية باسم كشافة مدرسة عنبر (التجهيز) عام 1913',
                            'كانت سورية في ذلك التاريخ تضم من الغرب بيروت حتى البحر المتوسط',
                            'ومن الشرق الموصل ومن الشمال لواء اسكندرون حتى جبال طوروس',
                            'ومن الجنوب بحيرة طبريا',
                            'بدأت الحركة تخرج من المدارس إلى الأندية الرياضية والكشفية'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'القوانين والمراسيم الحكومية',
                        difficulty: 'قانوني',
                        uses: 'فهم الإطار القانوني للكشفية',
                        steps: [
                            'في عام 1944 أقر المجلس النيابي قانون حماية الحركة الكشفية رقم 86',
                            'اعتبرت الحركة الكشفية منظمة أهلية تربوية اجتماعية ذات نفع عام',
                            'صدر المرسوم الجمهوري رقم 46 بتاريخ 5/1/1947 بالنظام الأساسي',
                            'صدر المرسوم الجمهوري رقم 197 بتاريخ 2/7/1948 بشأن الاعتناء بالنشاط المدرسي',
                            'في تاريخ 8/4/1952 صدر المرسوم التشريعي رقم 199 مؤيداً ومدعماً لهذه الحركة',
                            'أصبحت الحركة الكشفية شرعية ومحمية بمرسوم جمهوري'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            principles: {
                title: 'أسس الحركة الكشفية',
                description: 'المبادئ والأسس التي تقوم عليها الحركة الكشفية العالمية',
                items: [
                    {
                        name: 'تعريف الحركة الكشفية',
                        difficulty: 'أساسي',
                        uses: 'فهم طبيعة الحركة الكشفية',
                        steps: [
                            'هي حركة تربوية تطوعية غير سياسية',
                            'مفتوحة للجميع دون تمييز في الأصل أو الجنس أو العقيدة',
                            'وفقاً للهدف والمبادئ والطريقة التي عبر عنها مؤسسها',
                            'تهدف للمساهمة في تربية وتنمية الفتية والشباب',
                            'لتحقيق أقصى ارتقاء لقدراتهم الروحية والعقلية والاجتماعية والبدنية',
                            'كأفراد ومواطنين مسئولين في مجتمعاتهم المحلية والقومية والعالمية'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'المبادئ الأساسية',
                        difficulty: 'أساسي',
                        uses: 'فهم مبادئ الكشفية',
                        steps: [
                            'الواجب نحو الله والوطن',
                            'الواجب نحو الآخرين',
                            'الواجب نحو الذات',
                            'هذه المبادئ الثلاثة تشكل أساس الحركة الكشفية',
                            'تنعكس في الوعد والقانون الكشفي',
                            'تطبق من خلال الطريقة الكشفية'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'الوعد والقانون الكشفي',
                        difficulty: 'أساسي',
                        uses: 'فهم التزامات الكشاف',
                        steps: [
                            'الوعد الكشفي: أعاهد بشرفي أن أبذل قصارى جهدي في أن:',
                            '1. أقوم بواجبي نحو الله والوطن',
                            '2. أساعد الناس في كل حين',
                            '3. أعمل بقانون الكشاف',
                            'القانون يتضمن عشرة بنود تحدد سلوك الكشاف',
                            'من أهمها: شرف الكشاف يوثق به، الكشاف مخلص، الكشاف نافع'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            symbols: {
                title: 'الشارات والرموز الكشفية',
                description: 'الشارات الكشفية العالمية والسورية ومعانيها الرمزية',
                items: [
                    {
                        name: 'الشارة الكشفية العالمية',
                        difficulty: 'رمزي',
                        uses: 'فهم رموز الكشفية العالمية',
                        steps: [
                            'قام بتصميم الشارة الكشفية العالمية السيد بادن باول',
                            'تمثل هذه الشارة زهرة الزنبق وتشير إلى التزام الكشافين والثقة بهم',
                            'تمثل الثلاث بتلات بالشارة الواجبات الثلاث: نحو الله والوطن، نحو الآخرين، نحو الذات',
                            'النجمتان الموجودتان بالشارة تمثلان الصدق والمعرفة',
                            'العشر نقاط للنجمتين تمثل أيضاً العشرة للقانون الكشفي',
                            'لونها أبيض وخلفية بنفسجية - الأبيض للنقاء والبنفسجي لتحمل المسئولية'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'الشارة السورية',
                        difficulty: 'رمزي',
                        uses: 'فهم رموز الكشفية السورية',
                        steps: [
                            'اللون الخمري المائل للأحمر يوهج بداية المئوية الثانية للحركة الكشفية في سورية',
                            'اللون البنفسجي وهو المعتمد دولياً كلون للحكمة والتي يتمثل بها الكشاف',
                            'اللون الذهبي يرمز إلى أصالة الكشفية',
                            'العقاب السوري وهو رمز من الرموز التاريخية لسورية بأنفته وعنفوانه',
                            'البتلات الثلاث ترمز الأولى إلى مبادئ الحركة الكشفية',
                            'الحبل حول الزنبقة يرمز لوحدة الحركة الكشفية والأخوة حول العالم'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            traditions: {
                title: 'التقاليد الكشفية',
                description: 'التقاليد والطقوس الكشفية المختلفة وأهميتها',
                items: [
                    {
                        name: 'التحية الكشفية',
                        difficulty: 'تقليدي',
                        uses: 'فهم آداب التحية الكشفية',
                        steps: [
                            'تؤدى التحية الكشفية برفع اليد اليمنى بثلاث أصابع (البنصر-الوسطى-السبابة)',
                            'تذكرنا دائماً بالوعد الذي يتضمن ثلاث نقاط أساسية: إخلاص-مساعدة-طاعة',
                            'وضع الإبهام فوق الخنصر يهدف إلى رعاية الكبير للصغير واحترام الصغير للكبير',
                            'تؤدى عند رفع وإنزال العلم الوطني',
                            'عند عزف السلام الجمهوري أو الوطني',
                            'عند تحية من هم أعلى رتبة من المفوضين والقادة والمساعدين'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'عصا الكشاف',
                        difficulty: 'تقليدي',
                        uses: 'فهم أهمية عصا الكشاف',
                        steps: [
                            'يصطحب الكشاف معه عصاه أثناء جولاته الخارجية والمخيمات والرحلات',
                            'هي دليله في الظلام وعكازه وسلاحه',
                            'تعتبر من الأدوات الضرورية للكشاف إذ لا يمكنه الاستغناء عنها',
                            'يجب أن تكون العصا قوية ولها طول يتناسب مع طول الكشاف',
                            'يجب على الكشاف أن يقسمها تقسيماً مترياً لتساعده على قياس الأبعاد الثلاثية',
                            'يجب أن تكون من خشب الدردار إن أمكن ذلك'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'حفلة وعد الكشاف',
                        difficulty: 'تقليدي',
                        uses: 'فهم طقوس أداء الوعد',
                        steps: [
                            'لا يسمح للفتى أن يرتدي ملابس الكشافة إلا بعد أن يجتاز الشارات المقررة',
                            'يقف الكشافون على شكل حدوة حول العلم وهم بملابسهم الكشفية الكاملة',
                            'ينادي العريف الأول على الكشاف الذي سيؤدي الوعد',
                            'يحضره عريف طليعته أمام القائد وبعد أن يؤدي الكشاف التحية للقائد',
                            'يدور بينهما حوار تقليدي ينتهي بأداء الوعد الكشفي',
                            'يسلمه القائد عصاه ويساعده على ارتداء منديل الكشافة ويقلده شارة الكشاف المبتدئ'
                        ],
                        image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            camping: {
                title: 'مهارات التخييم والحياة في الطبيعة',
                description: 'المهارات الأساسية للتخييم والمعيشة في البيئة الطبيعية',
                items: [
                    {
                        name: 'اختيار الموقع المناسب للتخييم',
                        difficulty: 'أساسي',
                        uses: 'إقامة مخيم آمن وصحي',
                        steps: [
                            'ألا يكون موقع وأرض المخيم في مكان منخفض',
                            'أن تكون الأرض مستوية السطح ما أمكن ذلك',
                            'ألا تكون الأرض صخرية صلبة أو رملية طرية فتحدث غباراً بالاستمرار',
                            'ألا تكون الأرض رطبة ومبللة بالاستمرار',
                            'أن تكون الأرض والموقع بعيدة عن المساكن والسكان المجاورين',
                            'أن تكون بعيدة عن الشواطئ والأنهار والوديان لمسافة تزيد عن 500 متر'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'المخيم مدرسة في الطبيعة',
                        difficulty: 'فلسفي',
                        uses: 'فهم أهمية المخيم التربوية',
                        steps: [
                            'المخيم ركن رئيسي في الكشفية والطبيعة جوهر الرسالة الكشفية',
                            'المخيم هو خبرة ذاتية يهدف إلى جذب الأفراد وتربيتهم الاعتماد على النفس',
                            'المخيم هو تربية من خلال العمل يقوم القائد بإثارة أفكار جديدة',
                            'المخيم هو خبرة روحية تتكلم حياة المخيم لغة الله الرمزية',
                            'المخيم خبرة اجتماعية يكتشف الفرد فيه ذاته والآخر والطبيعة',
                            'المخيم هو خبرة تضامن عند الوصول يبدأ الأفراد بتحضير الخيم والمكان'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'تقاليد الخروج إلى الطبيعة',
                        difficulty: 'بيئي',
                        uses: 'المحافظة على البيئة',
                        steps: [
                            'عدم ترك أي نفايات وأخذ مخلفات نزهتك وغيرها من النفايات معك إلى البيت',
                            'لا تلوث الماء فهو ثمين وحيوي ولا تغسل الأطباق أو تستحم في ماء يستقي منه آخرون',
                            'اطمر كل الحفر والخنادق التي حفرتها أثناء مخيمك الخلوي',
                            'أعد العشب الذي اقتلعته إلى مكانه ورطبه بالماء حتى يعاود نموه',
                            'لا تضرم النار أبداً بالقرب من الأشجار أو الأعشاب الجافة أو الهشيم',
                            'تجنب إحداث حرائق في البرية'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }
                ]
            },
            skills: {
                title: 'المهارات الكشفية العملية',
                description: 'المهارات العملية والفنية التي يحتاجها كل كشاف',
                items: [
                    {
                        name: 'الحبال والعقد',
                        difficulty: 'عملي',
                        uses: 'مهارات الربط والتثبيت',
                        steps: [
                            'يتكون الحبل من نمرين فأكثر ويتكون النمر من مجموعة خيوط',
                            'العقدة الأفقية (البسيطة أو المسطحة) تستعمل لوصل حبلين متساويين في الثخانة',
                            'عقدة الصياد (السمكة) تستعمل لوصل حبلين يستعملان للشد المعاكس',
                            'الخية: وهي ربط الحبل بنفسه',
                            'العقدة: وهي التي تستعمل لربط حبلين ببعضهما أو ربط طرف الحبل في أصله',
                            'الربطة: وتستعمل في ربط حبل في شيء ثابت (عمود، شجرة، حائط)'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'الصافرات الكشفية',
                        difficulty: 'إشاري',
                        uses: 'التواصل والتنظيم',
                        steps: [
                            'تعد الصافرات الكشفية نوع من أنواع المخاطبة',
                            'يستعملها الكشاف كثيراً ليسهل عليه التجمع وأشكاله',
                            'الصفرة الطويلة (ــــــ) تمثل انتباه',
                            'النقطة (.) تمثل صفرة قصيرة وتعني استعد',
                            'نقطتان (..) تعني تفتيش',
                            'صفرة طويلة ونقطة (ــــــ .) تعني أمام سر أو وقوف قف'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
                    },
                    {
                        name: 'تتبع الأثر',
                        difficulty: 'متقدم',
                        uses: 'التوجه والاستكشاف',
                        steps: [
                            'يستعمل الكشاف إشارات خاصة أثناء رحلته لإرشاد من يتأخر عنه',
                            'أو عند تكليفه بمهام من قبل قائد الفرقة أو عند إجراء بعض التمارين الكشفية',
                            'لتكن الإشارات ظاهرة ومرئية',
                            'لا تترك أثراً ولا تدع رؤيتها',
                            'احترم الإشارات الخاصة بالمنطقة التي أنت فيها',
                            'ضع الإشارة على يمين الطريق بصورة واضحة'
                        ],
                        image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=400'
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
                    <h4>الموضوع:</h4>
                    <ol class="detailed-steps">
                        ${item.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
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