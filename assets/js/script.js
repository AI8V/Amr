/**
 * script.js - الملف الرئيسي للتفاعلات في موقع عمرو عبدالسلام الشخصي
 * تاريخ الإنشاء: 6 أبريل 2025
 */

// التأكد من تحميل DOM بالكامل قبل تنفيذ أي كود
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع العناصر التفاعلية في صفحة واحدة
    initializeWebsite();
});

/**
 * تهيئة كافة العناصر والتفاعلات في الموقع
 */
function initializeWebsite() {
    // تهيئة مكونات Bootstrap
    initBootstrapComponents();
    
    // إضافة سلوك التمرير السلس للروابط الداخلية
    initSmoothScrolling();
    
    // تفعيل التحقق من الفورم
    initFormValidation();
    
    // تهيئة الأزرار والتفاعلات المخصصة
    initCustomInteractions();
    
    // تهيئة المتابعة البصرية للقائمة الرئيسية
    initActiveNavTracking();
    
    // إضافة تأثيرات الظهور عند التمرير
    initScrollAnimations();
}

/**
 * تهيئة مكونات Bootstrap 5
 */
function initBootstrapComponents() {
    // تهيئة جميع Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // تهيئة جميع Popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // تهيئة عناصر Toasts إن وجدت
    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
}

/**
 * تفعيل التمرير السلس عند النقر على روابط داخلية
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // تجاهل الروابط الفارغة والروابط التي لا تشير إلى معرفات
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // تمرير سلس إلى العنصر المستهدف
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // إغلاق القائمة المنسدلة في الهواتف المحمولة بعد النقر
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    new bootstrap.Collapse(navbarCollapse).hide();
                }
            }
        });
    });
}

/**
 * تفعيل التحقق من نموذج الاتصال
 */
function initFormValidation() {
    const contactForm = document.querySelector('#contact form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة الحقول
            if (validateContactForm(this)) {
                // محاكاة إرسال النموذج (يمكن استبدالها بطلب AJAX حقيقي)
                showFormMessage('success', 'تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا!');
                this.reset();
            }
        });
        
        // إضافة تحقق مباشر للحقول عند تغيير القيمة
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                validateField(this);
            });
        });
    }
}

/**
 * التحقق من صحة نموذج الاتصال بالكامل
 * @param {HTMLFormElement} form - نموذج الاتصال
 * @returns {boolean} صحة النموذج
 */
function validateContactForm(form) {
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const subjectField = form.querySelector('#subject');
    const messageField = form.querySelector('#message');
    
    let isValid = true;
    
    // التحقق من كل حقل
    isValid = validateField(nameField) && isValid;
    isValid = validateField(emailField) && isValid;
    isValid = validateField(subjectField) && isValid;
    isValid = validateField(messageField) && isValid;
    
    return isValid;
}

/**
 * التحقق من صحة حقل فردي
 * @param {HTMLInputElement|HTMLTextAreaElement} field - الحقل المراد التحقق منه
 * @returns {boolean} صحة الحقل
 */
function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    // إزالة رسائل الخطأ السابقة
    removeFieldError(field);
    
    // التحقق من الحقل غير فارغ
    if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    } 
    // التحقق من صحة البريد الإلكتروني
    else if (field.id === 'email' && !validateEmail(field.value)) {
        isValid = false;
        errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    
    // إضافة فئة التحقق المناسبة
    if (isValid) {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
    } else {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        // إضافة رسالة خطأ
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'invalid-feedback';
        feedbackDiv.textContent = errorMessage;
        field.parentNode.appendChild(feedbackDiv);
    }
    
    return isValid;
}

/**
 * إزالة رسائل الخطأ من الحقل
 * @param {HTMLInputElement|HTMLTextAreaElement} field - الحقل المراد تنظيفه
 */
function removeFieldError(field) {
    // إزالة أي عناصر تغذية راجعة سابقة
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني للتحقق
 * @returns {boolean} صحة البريد الإلكتروني
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * عرض رسالة بعد إرسال النموذج
 * @param {string} type - نوع الرسالة (success/error)
 * @param {string} message - نص الرسالة
 */
function showFormMessage(type, message) {
    const contactForm = document.querySelector('#contact form');
    
    // إزالة أي رسائل سابقة
    const existingAlert = document.querySelector('#form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // إنشاء عنصر تنبيه جديد
    const alertDiv = document.createElement('div');
    alertDiv.id = 'form-alert';
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    alertDiv.role = 'alert';
    alertDiv.textContent = message;
    
    // إضافة زر إغلاق
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'إغلاق');
    alertDiv.appendChild(closeButton);
    
    // إضافة التنبيه بعد النموذج
    contactForm.parentNode.insertBefore(alertDiv, contactForm.nextSibling);
    
    // إعداد تنبيه Bootstrap
    new bootstrap.Alert(alertDiv);
    
    // إزالة التنبيه تلقائيًا بعد 5 ثوان
    if (type === 'success') {
        setTimeout(() => {
            const alert = bootstrap.Alert.getInstance(alertDiv);
            if (alert) {
                alert.close();
            }
        }, 5000);
    }
}

/**
 * تهيئة التفاعلات المخصصة مثل تأثيرات البطاقات
 */
function initCustomInteractions() {
    // تأثير التحويم على بطاقات المهارات (إضافة للتأثيرات الموجودة في CSS)
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.text-info');
            if (icon) {
                // تأثير نبض للأيقونة عند التحويم
                icon.style.transition = 'transform 0.3s';
                icon.style.transform = 'scale(1.2)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.text-info');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    // تهيئة زر تحميل السيرة الذاتية
const resumeBtn = document.querySelector('.navbar .btn-outline-light');
if (resumeBtn) {
    resumeBtn.addEventListener('click', function() {
        console.log('تم النقر على زر تحميل السيرة الذاتية');
    });
}
    
    // تفعيل انتقال أكثر سلاسة للصورة الشخصية
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
        window.addEventListener('load', function() {
            heroImg.style.transition = 'all 0.5s ease-in-out';
            heroImg.style.opacity = '1';
        });
    }
}

/**
 * تهيئة تتبع القسم النشط في القائمة العلوية أثناء التمرير
 */
function initActiveNavTracking() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100; // إضافة تعويض للعنوان اللاصق
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * تهيئة تأثيرات ظهور العناصر عند التمرير
 */
function initScrollAnimations() {
    // الحصول على كل العناصر المراد تحريكها
    const elementsToAnimate = document.querySelectorAll('.section-title, .card, .skill-card, .project-card');
    
    // ضبط خيارات Intersection Observer
    const options = {
        root: null, // استخدام viewport
        rootMargin: '0px',
        threshold: 0.1 // تفعيل عندما يكون 10% من العنصر مرئيًا
    };
    
    // إنشاء Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // إضافة فئة التحريك عند ظهور العنصر
                entry.target.classList.add('animate-in');
                
                // إيقاف مراقبة العنصر بعد ظهوره
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // إضافة العناصر للمراقبة
    elementsToAnimate.forEach(element => {
        // إضافة فئة البداية وتحديد خصائص التحريك
        element.classList.add('animate-prepare');
        observer.observe(element);
    });
    
    // إضافة أنماط CSS لتأثيرات الحركة في الصفحة
    addAnimationStyles();
}

/**
 * إضافة أنماط CSS للتحريكات
 */
function addAnimationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .animate-prepare {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleElement);
}

/**
 * كود لاظهار اشعار ترحيبي يظهر مرة واحدة للزائر
 */
function showWelcomeMessage() {
    // التحقق من عدم عرض الرسالة سابقًا (باستخدام localStorage)
    if (!localStorage.getItem('welcomeShown')) {
        // إنشاء عنصر التنبيه
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-alert alert alert-info alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
        welcomeDiv.role = 'alert';
        welcomeDiv.innerHTML = `
            <h5>أهلاً بك في موقعي الشخصي!</h5>
            <p>شكراً لزيارتك، يمكنك التواصل معي عبر نموذج الاتصال.</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        `;
        
        // إضافة التنبيه إلى الصفحة
        document.body.appendChild(welcomeDiv);
        
        // إعداد تنبيه Bootstrap
        const alert = new bootstrap.Alert(welcomeDiv);
        
        // تخزين حالة العرض
        localStorage.setItem('welcomeShown', 'true');
        
        // إغلاق التنبيه تلقائيًا بعد 8 ثوان
        setTimeout(() => {
            alert.close();
        }, 8000);
    }
}

// استدعاء دالة الترحيب بعد تأخير قصير
setTimeout(showWelcomeMessage, 1500);