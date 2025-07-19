# 🏕️ ScoutPluse - منصة إدارة الكشافة

> منصة ويب حديثة ومتجاوبة لإدارة الفرق الكشفية والأحداث والأعضاء

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-repo/scoutpluse)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)](https://github.com/your-repo/scoutpluse)

---

## 📋 جدول المحتوي

- [🌟 المميزات](#-المميزات)
- [🚀 البدء السريع](#-البدء-السريع)
- [📁 هيكل المشروع](#-هيكل-المشروع)
- [⚙️ التثبيت والنشر](#️-التثبيت-والنشر)
- [🔧 الإعدادات](#-الإعدادات)
- [👥 الحسابات التجريبية](#-الحسابات-التجريبية)
- [🎨 النظام التصميمي](#-النظام-التصميمي)
- [📱 التصميم المتجاوب](#-التصميم-المتجاوب)
- [🔐 نظام المصادقة](#-نظام-المصادقة)
- [📊 إدارة الأحداث](#-إدارة-الأحداث)
- [🌐 الدعم متعدد اللغات](#-الدعم-متعدد-اللغات)
- [♿ إمكانية الوصول](#-إمكانية-الوصول)
- [🐛 استكشاف الأخطاء](#-استكشاف-الأخطاء)
- [🤝 المساهمة](#-المساهمة)
- [📄 الترخيص](#-الترخيص)

---

## 🌟 المميزات

### 🔐 نظام المصادقة المتقدم
- **أدوار متعددة**: مدير، قائد، عضو، زائر
- **حسابات تجريبية**: وصول سريع لاختبار الأدوار المختلفة
- **إدارة الجلسات**: مصادقة آمنة باستخدام localStorage
- **إظهار/إخفاء كلمة المرور**: تحسين تجربة المستخدم

### 📊 لوحة التحكم الذكية
- **محتوى مخصص**: لوحة تحكم مخصصة حسب صلاحيات المستخدم
- **الأحداث الأخيرة**: نظرة سريعة على الأنشطة القادمة
- **إجراءات سريعة**: أزرار إجراءات حساسة للسياق
- **نظرة عامة على الفرقة**: إحصائيات ومعلومات الأعضاء
- **المواعيد النهائية**: تواريخ مهمة وتذكيرات

### 📅 إدارة الأحداث الشاملة
- **إنشاء الأحداث**: القادة والمديرون يمكنهم إنشاء أحداث جديدة
- **فئات الأحداث**: رميتا، معلولا، سرجيلا، بوسرا
- **تتبع الحضور**: أشرطة تقدم بصرية وعدد الأعضاء
- **تفاصيل الأحداث**: معلومات شاملة مع الصور
- **الانضمام/المغادرة**: إدارة تفاعلية للمشاركة
- **تكامل PHP API**: حفظ البيانات على الخادم

### 📚 مركز المعلومات التعليمي
- **محتوى تعليمي**: معرفة ومصادر كشفية
- **نظام الفئات**: منظم حسب المواضيع (العقد، إشعال النار، الملاحة، إلخ)
- **أدلة خطوة بخطوة**: تعليمات مفصلة مع الصور
- **مستويات الصعوبة**: مبتدئ، متوسط، متقدم
- **تعلم تفاعلي**: محتوى قابل للتوسيع مع عروض مفصلة

### 👤 إدارة الملف الشخصي
- **المعلومات الشخصية**: ملفات شخصية قابلة للتحرير
- **إحصائيات النشاط**: الأحداث المنضمة وسجلات الحضور
- **عرض الدور**: إشارة واضحة لصلاحيات المستخدم
- **نظام الصور الرمزية**: صور رمزية تلقائية بناءً على الأحرف الأولى

### ⚙️ الإعدادات المتقدمة
- **التحكم في المظهر**: مظاهر فاتح، داكن، وتلقائي (النظام)
- **دعم اللغات**: الإنجليزية والعربية (دعم RTL)
- **أدوات المدير**: إدارة الفرقة وضوابط النظام
- **تصدير البيانات**: وظيفة تحميل البيانات الشخصية

---

## 🚀 البدء السريع

### 📦 التحميل والتشغيل

```bash
# 1. تحميل المشروع
git clone https://github.com/your-repo/scoutpluse.git
cd scoutpluse

# 2. فتح في المتصفح
# افتح public/index.html في متصفحك المفضل

# 3. أو استخدم خادم محلي
python -m http.server 8000
# ثم اذهب إلى: http://localhost:8000/public/index.html
```

### 🌐 النشر على 000webhost

```bash
# 1. إنشاء حساب على 000webhost.com
# 2. رفع جميع الملفات إلى public_html/
# 3. تحديث الـ base URL في config/app.js:

window.API_BASE_URL = 'https://yoursite.000webhostapp.com';

# 4. تشغيل الإعداد:
# https://yoursite.000webhostapp.com/api/setup.php

# 5. اختبار التطبيق:
# https://yoursite.000webhostapp.com/public/index.html
```

---

## 📁 هيكل المشروع الجديد

```
ScoutPluse/
├── 📄 README.md                     # هذا الملف
├── 📄 package.json                  # إعدادات المشروع
├── 📄 .gitignore                    # ملفات Git المتجاهلة
│
├── 📁 src/                          # مصدر التطبيق
│   ├── 📁 styles/                   # ملفات التصميم
│   │   ├── 📄 main.css             # الأنماط الأساسية
│   │   ├── 📄 components.css       # أنماط المكونات
│   │   ├── 📄 auth.css             # أنماط المصادقة
│   │   ├── 📄 events.css           # أنماط الأحداث
│   │   ├── 📄 responsive.css       # التصميم المتجاوب
│   │   └── 📄 api-enhancements.css # تحسينات API
│   │
│   ├── 📁 services/                 # خدمات التطبيق
│   │   ├── 📄 auth.js              # خدمة المصادقة
│   │   ├── 📄 api.js               # خدمة API
│   │   ├── 📄 theme.js             # إدارة المظاهر
│   │   └── 📄 translations.js      # الترجمة والتدويل
│   │
│   ├── 📁 pages/                    # صفحات التطبيق
│   │   ├── 📄 dashboard.js         # لوحة التحكم
│   │   ├── 📄 events.js            # إدارة الأحداث
│   │   ├── 📄 information.js       # مركز المعلومات
│   │   ├── 📄 profile.js           # الملف الشخصي
│   │   └── 📄 settings.js          # الإعدادات
│   │
│   ├── 📁 components/               # مكونات قابلة للإعادة
│   │   └── 📄 navigation.js        # نظام التنقل
│   │
│   ├── 📁 utils/                    # أدوات مساعدة
│   │   └── 📄 helpers.js           # دوال مساعدة
│   │
│   └── 📄 app.js                   # تحكم التطبيق الرئيسي
│
├── 📁 public/                       # الملفات العامة
│   ├── 📄 index.html               # الصفحة الرئيسية
│   │
│   ├── 📁 data/                    # ملفات البيانات
│   │   ├── 📄 events.json          # بيانات الأحداث
│   │   └── 📄 users.json           # بيانات المستخدمين
│   │
│   └── 📁 api/                     # ملفات الخادم
│       ├── 📄 read.php             # API قراءة البيانات
│       ├── 📄 write.php            # API كتابة البيانات
│       ├── 📄 data.json            # قاعدة بيانات الأحداث
│       ├── 📄 setup.php            # إعداد أولي
│       ├── 📄 test-connection.php  # اختبار الاتصال
│       └── 📄 .htaccess            # إعدادات الخادم
│
├── 📁 config/                       # ملفات الإعدادات
│   ├── 📄 app.js                   # إعدادات التطبيق
│   └── 📄 demo-data.js             # البيانات التجريبية
│
└── 📁 docs/                         # الوثائق
    └── 📄 deployment-guide.md      # دليل النشر
```

---

## ⚙️ التثبيت والنشر

### 🏠 التشغيل المحلي

#### الطريقة 1: فتح مباشر
```bash
# افتح public/index.html في المتصفح مباشرة
open public/index.html  # macOS
start public/index.html # Windows
xdg-open public/index.html # Linux
```

#### الطريقة 2: خادم محلي
```bash
# Python
python -m http.server 8000
# ثم: http://localhost:8000/public/index.html

# Node.js
npx serve .
# ثم: http://localhost:3000/public/index.html

# PHP
php -S localhost:8000
# ثم: http://localhost:8000/public/index.html
```

### 🌐 النشر على 000webhost

#### خطوة 1: إنشاء الموقع
1. 🌐 اذهب إلى [000webhost.com](https://www.000webhost.com)
2. 📝 سجل حساب جديد
3. ➕ اضغط "Create Website"
4. 🏷️ اختر اسم النطاق الفرعي (مثل: `scoutplus`)

#### خطوة 2: رفع الملفات
```
public_html/
├── 📄 index.html              # من public/
├── 📁 src/                    # مجلد src كاملاً
├── 📁 config/                 # مجلد config كاملاً
├── 📁 api/                    # من public/api/
├── 📁 data/                   # من public/data/
└── 📁 backups/                # مجلد فارغ للنسخ الاحتياطية
```

#### خطوة 3: ضبط الصلاحيات
```bash
# الملفات (.php, .json, .html, .css, .js)
chmod 644

# المجلدات (src/, config/, api/, data/, backups/)
chmod 755
```

#### خطوة 4: تحديث الإعدادات
```javascript
// في config/app.js
window.API_BASE_URL = 'https://yoursite.000webhostapp.com';
```

#### خطوة 5: تشغيل الإعداد
```
🔗 https://yoursite.000webhostapp.com/api/setup.php
✅ تأكد من ظهور جميع الاختبارات بنجاح
```

#### خطوة 6: اختبار التطبيق
```
🔗 https://yoursite.000webhostapp.com/
🔗 https://yoursite.000webhostapp.com/public/index.html
```

---

## 🔧 الإعدادات

### 📝 ملف الإعدادات الرئيسي (`config/app.js`)

```javascript
// 🌐 إعداد الـ Base URL للـ API
window.API_BASE_URL = ''; // فارغ = نفس النطاق

// ⚙️ إعدادات التطبيق
window.APP_CONFIG = {
    // معلومات التطبيق
    appName: 'ScoutPluse',
    version: '1.0.0',
    
    // إعدادات الـ API
    api: {
        timeout: 10000,           // 10 ثواني
        retryAttempts: 3,         // 3 محاولات
        securityToken: 'ScoutPlus(WebApp)'
    },
    
    // إعدادات الواجهة
    ui: {
        theme: 'auto',            // light, dark, auto
        language: 'en',           // en, ar
        animations: true
    }
};
```

---

## 👥 الحسابات التجريبية

### 🔑 بيانات الدخول

| الدور | البريد الإلكتروني | كلمة المرور | الصلاحيات |
|-------|------------------|-------------|-----------|
| 👑 **مدير** | `admin@scouts.org` | `admin` | جميع الصلاحيات |
| 🎖️ **قائد** | `leader@scouts.org` | `Bashar` | إدارة الأحداث والأعضاء |
| 🏕️ **عضو** | `scout@scouts.org` | `scout123` | عرض والانضمام للأحداث |
| 👤 **زائر** | `guest@scouts.org` | `password` | عرض فقط |

---

## 🎨 النظام التصميمي

### 🎨 لوحة الألوان

#### الألوان الأساسية
```css
--primary-500: #10b981    /* 🟢 أخضر كشفي */
--secondary-500: #0ea5e9  /* 🔵 أزرق مكمل */
--accent-500: #f59e0b     /* 🟡 أصفر تمييز */
```

#### الألوان الدلالية
```css
--red-500: #ef4444        /* 🔴 خطأ */
--green-500: #22c55e      /* 🟢 نجاح */
--blue-500: #3b82f6       /* 🔵 معلومات */
--amber-500: #f59e0b      /* 🟡 تحذير */
```

### 📏 نظام المسافات

```css
/* نظام شبكة 8px */
--spacing-1: 0.25rem      /* 4px */
--spacing-2: 0.5rem       /* 8px */
--spacing-3: 0.75rem      /* 12px */
--spacing-4: 1rem         /* 16px */
--spacing-6: 1.5rem       /* 24px */
--spacing-8: 2rem         /* 32px */
```

---

## 📱 التصميم المتجاوب

### 📐 نقاط الكسر

| الجهاز | العرض | الوصف |
|--------|-------|--------|
| 📱 **موبايل** | `< 480px` | هواتف صغيرة |
| 📱 **موبايل كبير** | `481px - 768px` | هواتف كبيرة |
| 📟 **تابلت** | `769px - 1024px` | أجهزة لوحية |
| 💻 **ديسكتوب** | `> 1024px` | أجهزة مكتبية |

### 📱 مميزات الموبايل

#### التنقل السفلي
- 🏠 لوحة التحكم
- 📅 الأحداث  
- 📚 المعلومات
- 👤 الملف الشخصي

#### الشريط العلوي
- 🍔 قائمة الهامبرغر
- 🏷️ شعار التطبيق
- 🌙 تبديل المظهر
- 👤 صورة المستخدم

---

## 🔐 نظام المصادقة

### 🔑 آلية المصادقة

```javascript
// تسجيل الدخول
const user = await AuthService.login(email, password);

// التحقق من المصادقة
const isAuth = AuthService.isAuthenticated();

// الحصول على المستخدم الحالي
const currentUser = AuthService.getCurrentUser();

// تسجيل الخروج
AuthService.logout();
```

### 🛡️ الأمان

#### حماية البيانات
- 🔒 تشفير localStorage
- 🛡️ التحقق من الصلاحيات
- 🚫 منع الوصول غير المصرح
- 🔐 رموز الأمان للـ API

---

## 📊 إدارة الأحداث

### 📅 أنواع الأحداث

| الفئة | الوصف | اللون |
|------|-------|-------|
| 🌲 **رميتا** | أنشطة خارجية ومغامرات | 🟢 أخضر |
| 🤝 **معلولا** | خدمة المجتمع والتطوع | 🔵 أزرق |
| 📚 **سرجيلا** | تعليم ومهارات | 🟡 أصفر |
| 🏆 **بوسرا** | مسابقات وتحديات | 🔴 أحمر |

### ⚙️ وظائف الأحداث

#### إنشاء الأحداث
```javascript
// القادة والمديرون فقط
const eventData = {
    title: 'رحلة تخييم نهاية الأسبوع',
    description: 'مغامرة تخييم لثلاثة أيام...',
    date: '2025-01-20',
    time: '09:00',
    location: 'موقع التخييم الجبلي',
    category: 'ramita',
    maxAttendees: 25
};

await eventsService.addEvent(eventData);
```

#### الانضمام للأحداث
```javascript
// الأعضاء والقادة والمديرون
await eventsService.joinEvent(eventId);
```

---

## 🌐 الدعم متعدد اللغات

### 🗣️ اللغات المدعومة

| اللغة | الكود | الاتجاه | الحالة |
|-------|------|---------|--------|
| 🇺🇸 **الإنجليزية** | `en` | LTR | ✅ مكتمل |
| 🇸🇦 **العربية** | `ar` | RTL | ✅ مكتمل |

### 🔄 تبديل اللغة

```javascript
// تغيير اللغة
translationService.setLanguage('ar');

// الحصول على ترجمة
const text = translationService.t('dashboard.welcome');
```

---

## ♿ إمكانية الوصول

### 🎯 معايير WCAG

#### مستوى AA
- ✅ **تباين الألوان**: نسبة 4.5:1 للنص العادي
- ✅ **التنقل بلوحة المفاتيح**: وصول كامل بلوحة المفاتيح
- ✅ **قارئ الشاشة**: تسميات ARIA مناسبة
- ✅ **إدارة التركيز**: مؤشرات تركيز واضحة

### ⌨️ اختصارات لوحة المفاتيح

| الاختصار | الوظيفة |
|----------|---------|
| `Tab` | التنقل للأمام |
| `Shift + Tab` | التنقل للخلف |
| `Enter` | تفعيل العنصر |
| `Escape` | إغلاق النوافذ المنبثقة |
| `Space` | تفعيل الأزرار |

---

## 🐛 استكشاف الأخطاء

### ❌ مشاكل شائعة وحلولها

#### 🔌 "API Connection Failed"
```bash
# الأسباب المحتملة:
❌ ملفات PHP غير مرفوعة
❌ base URL خاطئ في config/app.js
❌ مشاكل CORS

# الحلول:
✅ تحقق من رفع public/api/read.php و write.php
✅ تأكد من صحة API_BASE_URL
✅ شغل api/test-connection.php
```

#### 🔐 "Permission Denied"
```bash
# الأسباب:
❌ صلاحيات ملفات خاطئة
❌ مجلد backups غير موجود

# الحلول:
✅ اضبط صلاحيات الملفات على 644
✅ اضبط صلاحيات المجلدات على 755
✅ أنشئ مجلد api/backups/
```

### 🔍 أدوات التشخيص

#### اختبار الاتصال
```
🔗 https://yoursite.com/api/test-connection.php
📊 يعرض حالة جميع المكونات
```

#### إعداد النظام
```
🔗 https://yoursite.com/api/setup.php
⚙️ يتحقق من المتطلبات ويعد النظام
```

---

## 🔧 التطوير والتخصيص

### 🛠️ إضافة مميزات جديدة

#### إنشاء صفحة جديدة
```javascript
// 1. أضف الصفحة في public/index.html
<div id="newPage" class="page">
    <!-- محتوى الصفحة -->
</div>

// 2. أضف التنقل
<a href="#new" class="nav-link" data-page="new">
    صفحة جديدة
</a>

// 3. أضف الصلاحيات في config/demo-data.js
const ROLE_PERMISSIONS = {
    admin: ['dashboard', 'events', 'new'],
    // ...
};
```

#### إنشاء خدمة جديدة
```javascript
// في src/services/new-service.js
class NewService {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🚀 New Service initialized');
    }
    
    // وظائف الخدمة...
}

// تهيئة الخدمة
document.addEventListener('DOMContentLoaded', () => {
    if (AuthService.isAuthenticated()) {
        window.newService = new NewService();
    }
});
```

### 🎨 تخصيص التصميم

#### تغيير الألوان
```css
/* في src/styles/main.css */
:root {
    --primary-500: #your-color;    /* لونك المفضل */
    --secondary-500: #your-color;  /* لون مكمل */
}
```

---

## 🧪 الاختبار

### ✅ اختبارات يدوية

#### اختبار المصادقة
- [ ] تسجيل دخول بحسابات مختلفة
- [ ] التحقق من الصلاحيات
- [ ] تسجيل الخروج

#### اختبار الأحداث
- [ ] إنشاء حدث جديد
- [ ] الانضمام لحدث
- [ ] البحث والتصفية

#### اختبار التجاوب
- [ ] عرض على موبايل
- [ ] عرض على تابلت
- [ ] عرض على ديسكتوب

---

## 🤝 المساهمة

### 🎯 كيفية المساهمة

#### 1. Fork المشروع
```bash
git clone https://github.com/your-username/scoutpluse.git
cd scoutpluse
```

#### 2. إنشاء فرع جديد
```bash
git checkout -b feature/amazing-feature
```

#### 3. إجراء التغييرات
```bash
# اكتب كودك الرائع
git add .
git commit -m "Add amazing feature"
```

#### 4. رفع التغييرات
```bash
git push origin feature/amazing-feature
```

#### 5. إنشاء Pull Request
- 📝 اكتب وصف واضح للتغييرات
- 🧪 تأكد من اختبار التغييرات
- 📚 حدث الوثائق إذا لزم الأمر

---

## 📈 خارطة الطريق

### 🚀 الإصدار 1.1.0 (قريباً)
- [ ] 📱 تطبيق موبايل أصلي
- [ ] 🔔 إشعارات فورية
- [ ] 📊 تقارير متقدمة
- [ ] 🌐 دعم لغات إضافية

### 🎯 الإصدار 1.2.0 (مستقبلي)
- [ ] 🤖 ذكاء اصطناعي للتوصيات
- [ ] 📍 تكامل الخرائط
- [ ] 💬 نظام رسائل
- [ ] 🎮 نظام الشارات والإنجازات

---

## 📞 الدعم والمساعدة

### 🆘 الحصول على المساعدة

#### 📚 الوثائق
- 📖 [دليل المستخدم](docs/USER-GUIDE.md)
- 🔧 [دليل المطور](docs/DEVELOPER-GUIDE.md)
- 🚀 [دليل النشر](docs/deployment-guide.md)

#### 🐛 الإبلاغ عن المشاكل
- 🔗 [GitHub Issues](https://github.com/your-repo/scoutpluse/issues)
- 📧 [البريد الإلكتروني](mailto:support@scoutpluse.com)

### ❓ أسئلة شائعة

#### س: كيف أغير لغة التطبيق؟
ج: اذهب إلى الإعدادات → اللغة → اختر العربية أو الإنجليزية

#### س: كيف أنشئ حدث جديد؟
ج: يجب أن تكون قائد أو مدير، ثم اذهب إلى الأحداث → إنشاء حدث

#### س: لماذا لا أستطيع رؤية بعض الصفحات؟
ج: الصفحات تظهر حسب دورك. الزوار يرون الأحداث فقط.

#### س: كيف أحفظ البيانات على الخادم؟
ج: ارفع ملفات public/api/ واضبط API_BASE_URL في config/app.js

---

## 📄 الترخيص

### 📜 ترخيص MIT

```
MIT License

Copyright (c) 2025 ScoutPluse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 شكر وتقدير

### 💝 شكر خاص لـ

- 🏕️ **المنظمات الكشفية** حول العالم للإلهام
- 🌐 **مجتمع المصادر المفتوحة** للأدوات والمكتبات
- 👥 **المساهمين والمختبرين** للملاحظات والتحسينات
- 🎨 **مجتمع التصميم** للإلهام البصري

### 🌟 تقنيات مستخدمة

- 🌐 **HTML5** - هيكل التطبيق
- 🎨 **CSS3** - التصميم والتنسيق
- ⚡ **Vanilla JavaScript** - المنطق والتفاعل
- 🐘 **PHP** - الخادم والـ API
- 📄 **JSON** - تخزين البيانات
- 🖼️ **Pexels** - الصور المجانية

---

## 📊 إحصائيات المشروع

| المقياس | القيمة |
|---------|--------|
| 📁 **إجمالي الملفات** | 30+ ملف |
| 📝 **أسطر الكود** | 12,000+ سطر |
| 🎨 **ملفات CSS** | 6 ملفات |
| ⚡ **ملفات JavaScript** | 12 ملف |
| 🐘 **ملفات PHP** | 4 ملفات |
| 🌐 **صفحات HTML** | 1 صفحة |
| 📱 **دعم الأجهزة** | جميع الأحجام |
| 🌍 **اللغات** | الإنجليزية والعربية |

---

<div align="center">

## 🎉 مبروك! أنت جاهز لاستخدام ScoutPluse

### 🚀 ابدأ رحلتك الكشفية الرقمية الآن

[![Demo](https://img.shields.io/badge/🌐_عرض_تجريبي-أزرق?style=for-the-badge)](https://scoutplus.000webhostapp.com)
[![Download](https://img.shields.io/badge/📥_تحميل-أخضر?style=for-the-badge)](https://github.com/your-repo/scoutpluse/archive/main.zip)
[![Docs](https://img.shields.io/badge/📚_الوثائق-برتقالي?style=for-the-badge)](docs/)

---

**صُنع بـ ❤️ للمجتمع الكشفي**

*تمكين الفرق الكشفية بالتكنولوجيا الحديثة مع الحفاظ على القيم التقليدية*

</div>