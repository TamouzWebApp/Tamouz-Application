# 🏕️ ScoutPluse - منصة إدارة الكشافة

> Progressive Web App حديث ومتجاوب لإدارة الفرق الكشفية والأحداث والأعضاء - Created by KinanKassab

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-repo/scoutpluse)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)](https://github.com/your-repo/scoutpluse)
[![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)](https://web.dev/progressive-web-apps/)

---

## 📋 جدول المحتويات

- [🌟 المميزات](#-المميزات)
- [🚀 البدء السريع](#-البدء-السريع)
- [📁 هيكل المشروع](#-هيكل-المشروع)
- [📱 مميزات PWA](#-مميزات-pwa)
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

### 📱 Progressive Web App (PWA)
- **تثبيت على الجهاز**: يعمل كتطبيق أصلي على جميع الأجهزة
- **العمل بدون اتصال**: وصول كامل للبيانات بدون إنترنت
- **تحديثات تلقائية**: تحديث التطبيق في الخلفية
- **إشعارات الدفع**: تنبيهات فورية للأحداث المهمة
- **تخزين مؤقت ذكي**: تحميل سريع وأداء محسن
- **مزامنة خلفية**: تحديث البيانات عند عودة الاتصال

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
- **تخزين محلي**: حفظ البيانات في المتصفح باستخدام localStorage

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
# افتح HTML/index.html في متصفحك المفضل

# 3. أو استخدم خادم محلي
python -m http.server 8000
# ثم اذهب إلى: http://localhost:8000/HTML/index.html
```

### 🌐 النشر على 000webhost

```bash
# 1. إنشاء حساب على GitHub
# 2. رفع جميع الملفات إلى repository
# 3. تفعيل GitHub Pages
# 4. الموقع سيكون متاح على:
# https://kinankassab.github.io/Tamouz-Application/
```

---

## 📁 هيكل المشروع

```
ScoutPluse/
├── 📄 index.html                    # صفحة التحويل الرئيسية
├── 📄 README.md                     # هذا الملف
├── 📄 LICENSE                       # ترخيص MIT
├── 📄 manifest.json                 # PWA Manifest
├── 📄 sw.js                         # Service Worker
│
├── 📁 HTML/                         # صفحات التطبيق
│   ├── 📄 index.html               # التطبيق الرئيسي
│   ├── 📄 events-new.html          # صفحة الأحداث الجديدة
│   └── 📄 events-enhanced.html     # صفحة الأحداث المحسنة
│
├── 📁 CSS/                          # ملفات التصميم
│   ├── 📄 main.css                 # الأنماط الأساسية والمتغيرات
│   ├── 📄 components.css           # أنماط المكونات
│   ├── 📄 responsive.css           # التصميم المتجاوب
│   ├── 📄 auth.css                 # أنماط المصادقة
│   ├── 📄 pwa.css                  # أنماط PWA
│   ├── 📄 events-new.css           # أنماط الأحداث الجديدة
│   └── 📄 api-enhancements.css     # تحسينات API
│
├── 📁 JS/                           # ملفات JavaScript
│   ├── 📄 config.js                # إعدادات التطبيق
│   ├── 📄 main.js                  # تحكم التطبيق الرئيسي
│   ├── 📄 auth.js                  # خدمة المصادقة
│   ├── 📄 events.js                # إدارة الأحداث
│   ├── 📄 events-enhanced.js       # نظام الأحداث المحسن
│   ├── 📄 api-service.js           # خدمة API
│   ├── 📄 dashboard.js             # وظائف لوحة التحكم
│   ├── 📄 information.js           # مركز المعلومات
│   ├── 📄 profile.js               # إدارة الملف الشخصي
│   ├── 📄 settings.js              # إدارة الإعدادات
│   ├── 📄 navigation.js            # نظام التنقل
│   ├── 📄 theme.js                 # إدارة المظاهر
│   ├── 📄 translations.js          # الترجمة والتدويل
│   ├── 📄 data.js                  # البيانات التجريبية
│   ├── 📄 pwa.js                   # خدمة PWA
│   └── 📄 users.json               # قاعدة بيانات المستخدمين
│
├── 📁 icons/                        # أيقونات PWA
│   ├── 📄 icon-72x72.png           # أيقونات بأحجام مختلفة
│   ├── 📄 icon-192x192.png         # للتثبيت والشاشة الرئيسية
│   ├── 📄 icon-512x512.png         # وشاشة البداية
│   └── 📄 generate-icons.html      # مولد الأيقونات
│
├── 📁 PHP/                          # ملفات الخادم
│   ├── 📄 read.php                 # API قراءة البيانات
│   ├── 📄 write.php                # API كتابة البيانات
│   ├── 📄 data.json                # قاعدة بيانات الأحداث
│   ├── 📄 setup.php                # إعداد أولي
│   ├── 📄 test-connection.php      # اختبار الاتصال
│   └── 📄 .htaccess                # إعدادات الخادم
│
└── 📁 docs/                         # الوثائق
    ├── 📄 DEPLOYMENT-GUIDE-*.md    # أدلة النشر
    ├── 📄 QUICK-SETUP-*.md         # الإعداد السريع
    └── 📄 README-*.md              # أدلة متخصصة
```

---

## 📱 مميزات PWA

### 🚀 التثبيت والاستخدام

#### تثبيت التطبيق
```bash
# على Android Chrome:
1. افتح الموقع في Chrome
2. اضغط على "إضافة إلى الشاشة الرئيسية"
3. أو اضغط على زر "تثبيت التطبيق" في الموقع

# على iOS Safari:
1. افتح الموقع في Safari
2. اضغط على زر المشاركة
3. اختر "إضافة إلى الشاشة الرئيسية"

# على Windows/Mac:
1. افتح الموقع في Chrome/Edge
2. اضغط على أيقونة التثبيت في شريط العنوان
3. أو اضغط على زر "تثبيت التطبيق"
```

#### مميزات التطبيق المثبت
- 🖥️ **نافذة منفصلة**: يعمل في نافذة منفصلة بدون شريط المتصفح
- ⚡ **بداية سريعة**: تحميل فوري من الشاشة الرئيسية
- 🔄 **تحديثات تلقائية**: يحدث نفسه في الخلفية
- 📱 **تجربة أصلية**: يبدو ويعمل كتطبيق أصلي
- 🌐 **عمل بدون اتصال**: وصول كامل للبيانات المحفوظة

### 💾 التخزين المؤقت الذكي

#### استراتيجيات التخزين
```javascript
// Cache First - للملفات الثابتة
CSS, JS, HTML → التخزين المؤقت أولاً

// Network First - لطلبات API
JSON, PHP → الشبكة أولاً، ثم التخزين المؤقت

// Stale While Revalidate - للصور
Images → عرض المخزن وتحديث في الخلفية
```

#### إدارة التخزين المؤقت
- 📦 **تخزين تلقائي**: حفظ تلقائي للملفات المهمة
- 🔄 **تحديث ذكي**: تحديث عند توفر إصدار جديد
- 🗑️ **تنظيف تلقائي**: إزالة الملفات القديمة
- 📊 **مراقبة الحجم**: تتبع استخدام التخزين

### 🔔 الإشعارات والمزامنة

#### إشعارات الدفع
```javascript
// طلب إذن الإشعارات
await pwaService.requestNotificationPermission();

// إرسال إشعار محلي
pwaService.showLocalNotification('حدث جديد!', {
    body: 'تم إضافة رحلة تخييم جديدة',
    icon: '/icons/icon-192x192.png'
});
```

#### المزامنة الخلفية
- 🔄 **مزامنة تلقائية**: تحديث البيانات عند عودة الاتصال
- 📤 **رفع مؤجل**: حفظ التغييرات عند انقطاع الاتصال
- 🔍 **تحقق دوري**: فحص التحديثات في الخلفية
- ⚡ **مزامنة فورية**: تحديث فوري عند الاتصال

### 🛠️ أدوات المطور

#### تشخيص PWA
```javascript
// معلومات PWA
const pwaInfo = pwaService.getPWAInfo();
console.log('PWA Info:', pwaInfo);

// تنظيف التخزين المؤقت
await pwaService.clearCache();

// فرض التحديث
await pwaService.forceUpdate();
```

#### أدوات Chrome DevTools
- 🔍 **Application Tab**: فحص Service Worker والتخزين المؤقت
- 📊 **Lighthouse**: تقييم جودة PWA
- 🌐 **Network Tab**: مراقبة طلبات الشبكة
- 💾 **Storage Tab**: فحص localStorage والتخزين المؤقت

---

## ⚙️ التثبيت والنشر

### 🏠 التشغيل المحلي

#### الطريقة 1: فتح مباشر
```bash
# افتح HTML/index.html في المتصفح مباشرة
open HTML/index.html  # macOS
start HTML/index.html # Windows
xdg-open HTML/index.html # Linux
```

#### الطريقة 2: خادم محلي
```bash
# Python
python -m http.server 8000
# ثم: http://localhost:8000/HTML/index.html

# Node.js
npx serve .
# ثم: http://localhost:3000/HTML/index.html

# PHP
php -S localhost:8000
# ثم: http://localhost:8000/HTML/index.html
```

### 🌐 النشر على 000webhost

#### خطوة 1: إنشاء الموقع
1. 🌐 اذهب إلى أي خدمة استضافة ثابتة
2. 📝 ارفع ملفات HTML, CSS, JS
3. 🏷️ لا حاجة لدعم PHP أو قواعد البيانات

#### خطوة 2: رفع الملفات
```
موقعك/
├── 📄 index.html                    # صفحة التحويل
├── 📄 manifest.json                 # PWA Manifest
├── 📄 sw.js                         # Service Worker
├── 📁 HTML/                        # صفحات التطبيق
├── 📁 CSS/                         # ملفات التصميم
├── 📁 icons/                       # أيقونات PWA
└── 📁 JS/                          # ملفات JavaScript
```

#### خطوة 3: اختبار التطبيق
```
🔗 https://kinankassab.github.io/Tamouz-Application/
🔗 https://kinankassab.github.io/Tamouz-Application/HTML/index.html
📱 قابل للتثبيت كـ PWA من المتصفح
```

### 🚀 النشر على خوادم أخرى

#### Netlify
```bash
# 1. ارفع المشروع كاملاً
# 2. تأكد من وجود manifest.json و sw.js في الجذر
# 3. PWA سيعمل تلقائياً
```

#### Vercel
```bash
# 1. ارفع المشروع كاملاً
# 2. تأكد من رفع جميع ملفات PWA
# 3. التطبيق سيكون قابل للتثبيت
```

#### GitHub Pages
```bash
# 1. المشروع مرفوع على GitHub
# 2. GitHub Pages مفعل
# 3. الموقع متاح على: https://kinankassab.github.io/Tamouz-Application/
# 4. PWA يعمل تلقائياً ويمكن تثبيته
```

---

## 🔧 الإعدادات

### 📝 ملف الإعدادات الرئيسي (`JS/config.js`)

```javascript
// 🌐 إعداد الـ Base URL للـ API
// لا حاجة لـ API - النظام محلي بالكامل

// ⚙️ إعدادات التطبيق
window.APP_CONFIG = {
    // معلومات التطبيق
    appName: 'ScoutPluse',
    version: '1.0.0',
    
    // إعدادات الـ API
    api: {
        eventsFile: 'https://tamouzwebapp.github.io/Tamouz-Application/JSON/events.json',  // ملف الأحداث
        usersFile: 'https://tamouzwebapp.github.io/Tamouz-Application/JSON/users.json',  // ملف المستخدمين
        useLocalStorage: true             // استخدام localStorage
    },
    
    // إعدادات الواجهة
    ui: {
        theme: 'auto',            // light, dark, auto
        language: 'en',           // en, ar
        animations: true
    },
    
    // إعدادات التخزين
    storage: {
        prefix: 'scoutpluse_',
        expiry: 30 * 24 * 60 * 60 * 1000 // 30 يوم
    },
    
    // إعدادات PWA
    pwa: {
        enableInstallPrompt: true,        // تفعيل مطالبة التثبيت
        enableOfflineMode: true,          // تفعيل الوضع بدون اتصال
        enablePushNotifications: true,    // تفعيل الإشعارات
        enableBackgroundSync: true,       // تفعيل المزامنة الخلفية
        cacheStrategy: 'cacheFirst',      // استراتيجية التخزين المؤقت
        updateCheckInterval: 60000,       // فترة فحص التحديثات (1 دقيقة)
        maxCacheAge: 7 * 24 * 60 * 60 * 1000 // عمر التخزين المؤقت (7 أيام)
    }
};
```

### 📱 إعداد PWA

#### ملف Manifest (`manifest.json`)
```json
{
  "name": "ScoutPluse - منصة إدارة الكشافة",
  "short_name": "ScoutPluse",
  "start_url": "/HTML/index.html",
  "display": "standalone",
  "background_color": "#10b981",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

#### Service Worker (`sw.js`)
- 📦 **تخزين مؤقت للملفات الثابتة**
- 🌐 **استراتيجيات شبكة مختلفة**
- 🔄 **مزامنة خلفية للبيانات**
- 🔔 **دعم إشعارات الدفع**

### 💾 التخزين المحلي
- 📁 **ملف الأحداث**: `JSON/events.json` (للبيانات الأولية)
- 💾 **localStorage**: لحفظ التغييرات والإضافات
- 📦 **Cache API**: للتخزين المؤقت المتقدم
- 🔄 **مزامنة التبويبات**: تحديث تلقائي بين التبويبات
- 📤 **تصدير البيانات**: تحميل البيانات كملف JSON

---

## 👥 الحسابات التجريبية

### 🔑 بيانات الدخول

| الدور | البريد الإلكتروني | كلمة المرور | الصلاحيات |
|-------|------------------|-------------|-----------|
| 👑 **مدير** | `admin@scouts.org` | `admin` | جميع الصلاحيات |
| 🎖️ **قائد** | `leader@scouts.org` | `Bashar` | إدارة الأحداث والأعضاء |
| 🏕️ **عضو** | `scout@scouts.org` | `scout123` | عرض والانضمام للأحداث |
| 👤 **زائر** | `guest@scouts.org` | `password` | عرض فقط |

### 🎭 أدوار المستخدمين

#### 👑 المدير (Admin)
- ✅ إنشاء وإدارة الأحداث
- ✅ إدارة جميع الفرق
- ✅ الوصول لجميع الإعدادات
- ✅ تصدير البيانات والتقارير
- ✅ إدارة المستخدمين

#### 🎖️ القائد (Leader)
- ✅ إنشاء وإدارة أحداث فرقته
- ✅ عرض أعضاء فرقته
- ✅ الوصول للمعلومات التعليمية
- ✅ إدارة ملفه الشخصي
- ❌ إعدادات النظام

#### 🏕️ العضو (Member)
- ✅ عرض والانضمام للأحداث
- ✅ الوصول للمعلومات التعليمية
- ✅ إدارة ملفه الشخصي
- ❌ إنشاء الأحداث
- ❌ الإعدادات

#### 👤 الزائر (Guest)
- ✅ عرض الأحداث فقط
- ❌ الانضمام للأحداث
- ❌ الوصول للمعلومات
- ❌ إدارة الملف الشخصي

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

#### الألوان المحايدة
```css
--gray-50: #f9fafb        /* خلفية فاتحة */
--gray-500: #6b7280       /* نص متوسط */
--gray-900: #111827       /* نص داكن */
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

### 🔤 نظام الخطوط

```css
/* أحجام الخطوط */
--font-size-xs: 0.75rem   /* 12px */
--font-size-sm: 0.875rem  /* 14px */
--font-size-base: 1rem    /* 16px */
--font-size-lg: 1.125rem  /* 18px */
--font-size-xl: 1.25rem   /* 20px */
--font-size-2xl: 1.5rem   /* 24px */

/* أوزان الخطوط */
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### 🔘 نظام الحدود

```css
/* نصف أقطار الحدود */
--radius-sm: 0.125rem     /* 2px */
--radius-md: 0.375rem     /* 6px */
--radius-lg: 0.5rem       /* 8px */
--radius-xl: 0.75rem      /* 12px */
--radius-2xl: 1rem        /* 16px */
--radius-full: 9999px     /* دائري كامل */
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

#### الشريط الجانبي المنزلق
- 📱 يظهر من اليسار
- 🎯 تنقل كامل
- 👤 معلومات المستخدم
- 🚪 زر تسجيل الخروج

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

#### إدارة الجلسات
- ⏰ انتهاء صلاحية تلقائي
- 🔄 تحديث الجلسة
- 📱 مزامنة بين التبويبات
- 🚪 تسجيل خروج آمن

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

#### البحث والتصفية
- 🔍 البحث بالعنوان والوصف والموقع
- 🏷️ التصفية حسب الفئة
- 📅 ترتيب حسب التاريخ
- 👥 تصفية حسب الفرقة

### 🔄 تكامل PHP API

#### قراءة البيانات
```javascript
// قراءة من localStorage
const events = localStorageService.getEvents();
```

#### كتابة البيانات
```javascript
// حفظ في localStorage
localStorageService.saveEvents(events);
```

#### التخزين المحلي
- 💾 حفظ فوري في localStorage
- 🔄 مزامنة بين التبويبات
- 📤 تصدير واستيراد البيانات

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

// ترجمة مع معاملات
const welcome = translationService.t('welcome.message', { name: 'أحمد' });
```

### 📝 إضافة ترجمات جديدة

```javascript
// في translations.js
const translations = {
    ar: {
        'nav.dashboard': 'لوحة التحكم',
        'nav.events': 'الفعاليات',
        'dashboard.welcome': 'مرحباً بعودتك'
    }
};
```

### 🔄 دعم RTL

```css
/* تلقائي للعربية */
.rtl {
    direction: rtl;
}

.rtl .sidebar {
    right: 0;
    left: auto;
}
```

---

## ♿ إمكانية الوصول

### 🎯 معايير WCAG

#### مستوى AA
- ✅ **تباين الألوان**: نسبة 4.5:1 للنص العادي
- ✅ **التنقل بلوحة المفاتيح**: وصول كامل بلوحة المفاتيح
- ✅ **قارئ الشاشة**: تسميات ARIA مناسبة
- ✅ **إدارة التركيز**: مؤشرات تركيز واضحة

#### مميزات إضافية
- 🔍 **وضع التباين العالي**: رؤية محسنة
- 🎭 **إدارة التركيز**: حبس التركيز في النوافذ المنبثقة
- 📖 **HTML دلالي**: تسلسل عناوين مناسب ومعالم
- 🖼️ **نص بديل**: نص بديل وصفي للصور

### ⌨️ اختصارات لوحة المفاتيح

| الاختصار | الوظيفة |
|----------|---------|
| `Tab` | التنقل للأمام |
| `Shift + Tab` | التنقل للخلف |
| `Enter` | تفعيل العنصر |
| `Escape` | إغلاق النوافذ المنبثقة |
| `Space` | تفعيل الأزرار |

### 🎨 تفضيلات المستخدم

```css
/* احترام تفضيلات الحركة */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* دعم وضع التباين العالي */
@media (prefers-contrast: high) {
    .btn {
        border-width: 2px;
    }
}
```

---

## 🐛 استكشاف الأخطاء

### ❌ مشاكل شائعة وحلولها

#### 📱 "PWA Not Installing"
```bash
# الأسباب المحتملة:
❌ manifest.json غير صحيح
❌ Service Worker لا يعمل
❌ HTTPS غير مفعل

# الحلول:
✅ تحقق من manifest.json في DevTools
✅ تأكد من تسجيل Service Worker
✅ استخدم HTTPS أو localhost للتطوير
✅ تحقق من Lighthouse PWA audit
```

#### 🔄 "Service Worker Not Updating"
```bash
# الأسباب:
❌ التخزين المؤقت للمتصفح
❌ Service Worker قديم عالق

# الحلول:
✅ امسح التخزين المؤقت من DevTools
✅ استخدم "Update on reload" في DevTools
✅ غير اسم Service Worker في manifest
✅ استخدم versioning في أسماء الملفات
```

#### 💾 "Local Storage Full"
```bash
# الأسباب المحتملة:
❌ امتلاء التخزين المحلي
❌ التخزين المؤقت ممتلئ
❌ بيانات كثيرة محفوظة

# الحلول:
✅ امسح البيانات القديمة من الإعدادات
✅ امسح التخزين المؤقت من PWA settings
✅ صدر البيانات قبل المسح
✅ استخدم وضع التصفح الخاص لاختبار نظيف
```

#### 📄 "Events Not Loading"
```bash
# الأسباب:
❌ ملف events.json غير موجود
❌ مشاكل في localStorage

# الحلول:
✅ تأكد من وجود JSON/events.json
✅ امسح localStorage وأعد التحميل
✅ تحقق من وحدة تحكم المطور للأخطاء
```

#### 🔄 "Data Not Syncing"
```bash
# الأسباب:
❌ تبويبات متعددة مفتوحة
❌ localStorage معطل

# الحلول:
✅ أعد تحميل جميع التبويبات
✅ تحقق من إعدادات المتصفح
✅ جرب متصفح آخر
```

### 🔍 أدوات التشخيص

#### فحص PWA
- 🔍 Chrome DevTools → Application → Service Workers
- 📊 Lighthouse → PWA audit
- 📱 Chrome DevTools → Application → Manifest
- 💾 Chrome DevTools → Application → Storage

#### اختبار التخزين المحلي
- ⚙️ اذهب إلى الإعدادات → Administration → Test Storage
- 📊 عرض معلومات التخزين والإحصائيات
- 📱 فحص PWA info من console

#### وحدة تحكم المتصفح
```javascript
// افتح أدوات المطور (F12)
// تحقق من:
console.log('📱 PWA Info:', pwaService.getPWAInfo());
console.log('🔍 JavaScript errors');
console.log('💾 localStorage data');
console.log('📊 Storage usage');
console.log('🔧 Service Worker status');
```

### 📊 مراقبة الأداء

#### إحصائيات الاستخدام
```javascript
// في JavaScript
console.log(`📱 PWA installed: ${pwaService.isInstalled}`);
console.log(`🌐 Online status: ${navigator.onLine}`);
console.log(`✅ Loaded ${events.length} events`);
console.log(`👤 User: ${user.name} (${user.role})`);
```

---

## 🔧 التطوير والتخصيص

### 🛠️ إضافة مميزات جديدة

#### إنشاء صفحة جديدة
```javascript
// 1. أضف الصفحة في HTML
<div id="newPage" class="page">
    <!-- محتوى الصفحة -->
</div>

// 2. أضف التنقل
<a href="#new" class="nav-link" data-page="new">
    صفحة جديدة
</a>

// 3. أضف الصلاحيات في data.js
const ROLE_PERMISSIONS = {
    admin: ['dashboard', 'events', 'new'],
    // ...
};
```

#### إنشاء خدمة جديدة
```javascript
// في JS/new-service.js
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
/* في CSS/main.css */
:root {
    --primary-500: #your-color;    /* لونك المفضل */
    --secondary-500: #your-color;  /* لون مكمل */
}
```

#### إضافة مظهر جديد
```javascript
// في JS/theme.js
const themes = {
    light: { /* ألوان فاتحة */ },
    dark: { /* ألوان داكنة */ },
    custom: { /* مظهرك المخصص */ }
};
```

### 🔌 تكامل APIs خارجية

#### إضافة API جديد
```javascript
// في JS/services/local-storage.js
class ExternalAPIService {
    async saveToExternalAPI(data) {
        // حفظ في خدمة خارجية (اختياري)
        console.log('Saving to external API:', data);
    }
}
```

---

## 🧪 الاختبار

### ✅ اختبارات يدوية

#### اختبار PWA
- [ ] تثبيت التطبيق على الجهاز
- [ ] العمل بدون اتصال
- [ ] تحديث التطبيق
- [ ] الإشعارات
- [ ] شاشة البداية

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

### 🔍 اختبار الأداء

#### PWA Performance
```javascript
// قياس أداء PWA
console.log('Service Worker:', navigator.serviceWorker.controller);
console.log('Cache Storage:', await caches.keys());
console.log('Install Prompt:', pwaService.installPrompt);
```

#### سرعة التحميل
```javascript
// قياس وقت التحميل
console.time('Page Load');
window.addEventListener('load', () => {
    console.timeEnd('Page Load');
});
```

#### استهلاك الذاكرة
```javascript
// مراقبة الذاكرة
console.log('Memory:', performance.memory);
```

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

### 📋 إرشادات المساهمة

#### معايير الكود
- 📏 **المسافات**: استخدم مسافتين للإزاحة
- 📝 **التعليقات**: اكتب تعليقات واضحة
- 🏷️ **التسمية**: استخدم أسماء وصفية
- 🛡️ **معالجة الأخطاء**: استخدم try-catch مناسبة

#### أفضل الممارسات
- 🎯 **فصل الاهتمامات**: فصل HTML, CSS, JS
- 🔄 **مبدأ DRY**: لا تكرر نفسك
- 📈 **التحسين التدريجي**: الوظائف الأساسية أولاً
- ♿ **إمكانية الوصول**: مميزات إمكانية الوصول مدمجة

### 🐛 الإبلاغ عن الأخطاء

#### قالب تقرير الخطأ
```markdown
## 🐛 وصف الخطأ
وصف واضح ومختصر للخطأ.

## 🔄 خطوات إعادة الإنتاج
1. اذهب إلى '...'
2. اضغط على '...'
3. انتقل إلى '...'
4. شاهد الخطأ

## ✅ السلوك المتوقع
وصف واضح لما كان متوقعاً أن يحدث.

## 📱 البيئة
- المتصفح: [مثل Chrome, Safari]
- الإصدار: [مثل 22]
- نظام التشغيل: [مثل iOS]
```

---

## 📈 خارطة الطريق

### 🚀 الإصدار 1.1.0 (قريباً)
- [ ] 📱 تطبيق موبايل أصلي
- [ ] 🔔 إشعارات فورية
- [ ] 🔄 مزامنة خلفية محسنة
- [ ] 📊 تقارير متقدمة
- [ ] 🌐 دعم لغات إضافية

### 🎯 الإصدار 1.2.0 (مستقبلي)
- [ ] 🤖 ذكاء اصطناعي للتوصيات
- [ ] 📍 تكامل الخرائط
- [ ] 📱 تطبيق أصلي للموبايل
- [ ] 💬 نظام رسائل
- [ ] 🎮 نظام الشارات والإنجازات

### 🔮 الإصدار 2.0.0 (رؤية)
- [ ] ☁️ نظام سحابي كامل
- [ ] 🔗 تكامل مع منصات أخرى
- [ ] 📈 تحليلات متقدمة
- [ ] 🌍 دعم متعدد المنظمات

---

## 📞 الدعم والمساعدة

### 🆘 الحصول على المساعدة

#### 📚 الوثائق
- 📖 [دليل المستخدم](docs/USER-GUIDE.md)
- 🔧 [دليل المطور](docs/DEVELOPER-GUIDE.md)
- 🚀 [دليل النشر](docs/DEPLOYMENT-GUIDE.md)

#### 💬 المجتمع
- 💬 [Discord Server](https://discord.gg/scoutpluse)
- 📱 [Telegram Group](https://t.me/scoutpluse)
- 🐦 [Twitter](https://twitter.com/scoutpluse)

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
ج: ارفع ملفات PHP واضبط API_BASE_URL في config.js

#### س: كيف أثبت التطبيق على جهازي؟
ج: افتح الموقع في Chrome أو Safari واضغط على "إضافة إلى الشاشة الرئيسية"

#### س: هل يعمل التطبيق بدون إنترنت؟
ج: نعم، بعد التحميل الأول يعمل بالكامل بدون اتصال

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
- 📱 **PWA** - Progressive Web App
- 🔧 **Service Worker** - العمل بدون اتصال
- 📄 **Web App Manifest** - معلومات التطبيق
- 🎨 **CSS3** - التصميم والتنسيق
- ⚡ **Vanilla JavaScript** - المنطق والتفاعل
- 💾 **localStorage** - تخزين البيانات محلياً
- 📦 **Cache API** - التخزين المؤقت المتقدم
- 📄 **JSON** - تنسيق البيانات
- 🖼️ **Pexels** - الصور المجانية

---

## 📊 إحصائيات المشروع

| المقياس | القيمة |
|---------|--------|
| 📁 **إجمالي الملفات** | 35+ ملف |
| 📝 **أسطر الكود** | 15,000+ سطر |
| 🎨 **ملفات CSS** | 7 ملفات |
| ⚡ **ملفات JavaScript** | 15 ملف |
| 💾 **ملفات JSON** | 2 ملف |
| 🌐 **صفحات HTML** | 4 صفحات |
| 📱 **PWA Features** | مكتملة 100% |
| 📱 **دعم الأجهزة** | جميع الأحجام |
| 🌍 **اللغات** | الإنجليزية والعربية |
| 🔧 **Service Worker** | مفعل |
| 📦 **Cache API** | مفعل |

---

<div align="center">

## 🎉 مبروك! أنت جاهز لاستخدام ScoutPluse PWA

### 📱 ثبت التطبيق واستمتع بتجربة أصلية

[![Demo](https://img.shields.io/badge/🌐_عرض_تجريبي-أزرق?style=for-the-badge)](https://scoutplus.000webhostapp.com)
[![Download](https://img.shields.io/badge/📥_تحميل-أخضر?style=for-the-badge)](https://github.com/kinankassab/Tamouz-Application/archive/main.zip)
[![Live Demo](https://img.shields.io/badge/🚀_موقع_مباشر-أحمر?style=for-the-badge)](https://kinankassab.github.io/Tamouz-Application/)
[![Install PWA](https://img.shields.io/badge/📱_ثبت_التطبيق-بنفسجي?style=for-the-badge)](https://kinankassab.github.io/Tamouz-Application/)

---

**صُنع بـ ❤️ للمجتمع الكشفي - Progressive Web App محلي بالكامل**

*تمكين الفرق الكشفية بتكنولوجيا PWA حديثة وفعالة بدون تعقيدات الخوادم - Developed by KinanKassab*

</div>