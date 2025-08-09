# دليل نشر مشروع ScoutPluse

## خطوات التحضير قبل النشر

### 1. فحص الملفات المطلوبة
- ✅ index.html
- ✅ events-manager.php
- ✅ JSON/events.json
- ✅ JSON/users.json
- ✅ جميع ملفات CSS/
- ✅ جميع ملفات JS/
- ✅ Logo.png
- ✅ manifest.json
- ✅ sw.js

### 2. إعداد قاعدة البيانات (اختياري)
إذا كنت تريد استخدام قاعدة بيانات MySQL بدلاً من JSON:

```sql
CREATE DATABASE scoutpluse;

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255),
    attendees JSON,
    maxAttendees INT DEFAULT 50,
    category VARCHAR(100),
    image VARCHAR(500),
    status ENUM('upcoming', 'past', 'cancelled') DEFAULT 'upcoming',
    troop VARCHAR(100),
    createdBy INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('member', 'leader', 'manager') DEFAULT 'member',
    troop VARCHAR(100),
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    avatar VARCHAR(500),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. تحديث إعدادات PHP
في ملف events-manager.php، تأكد من أن المسارات صحيحة:

```php
private $eventsFile = 'JSON/events.json';
private $usersFile = 'JSON/users.json';
```

### 4. فحص الصلاحيات
تأكد من أن مجلد JSON قابل للكتابة:
```bash
chmod 755 JSON/
chmod 644 JSON/events.json
chmod 644 JSON/users.json
```

## خطوات الرفع

### الطريقة 1: رفع عبر FileManager
1. اضغط ملف ZIP للمشروع
2. ادخل لوحة تحكم الاستضافة
3. افتح File Manager
4. ارفع ملف ZIP إلى public_html
5. استخرج الملفات

### الطريقة 2: رفع عبر FTP
1. حمل برنامج FileZilla
2. اتصل بالخادم باستخدام بيانات FTP
3. ارفع جميع الملفات إلى public_html

### الطريقة 3: رفع عبر Git (للخوادم المتقدمة)
```bash
git clone your-repository
cd your-project
# رفع الملفات
```

## إعدادات مهمة بعد الرفع

### 1. إعداد SSL
- فعل شهادة SSL من لوحة التحكم
- تأكد من أن الموقع يعمل على https://

### 2. إعداد Cache
- فعل ضغط Gzip
- إعداد Browser Caching
- تحسين الصور

### 3. النسخ الاحتياطي
- إعداد نسخ احتياطية تلقائية
- تصدير قاعدة البيانات

### 4. المراقبة
- إعداد Google Analytics
- مراقبة الأخطاء
- فحص الأداء

## استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ 500:** تحقق من صلاحيات الملفات
2. **ملفات JSON لا تتحدث:** تحقق من صلاحيات الكتابة
3. **PHP لا يعمل:** تأكد من أن الاستضافة تدعم PHP
4. **Service Worker لا يعمل:** تأكد من أن الموقع على HTTPS

## التحسينات المستقبلية
- [ ] إضافة نظام إشعارات
- [ ] تحسين الأمان
- [ ] إضافة API متقدم
- [ ] دعم متعدد اللغات
- [ ] تطبيق جوال

---
تم إنشاء هذا الدليل لمشروع ScoutPluse
التاريخ: أغسطس 2025
