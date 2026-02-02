// Navigation scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});


// Mobile products dropdown toggle
document.getElementById('mobile-products-btn').addEventListener('click', function() {
    const productsMenu = document.getElementById('mobile-products-menu');
    const productsIcon = document.getElementById('mobile-products-icon');
    
    productsMenu.classList.toggle('hidden');
    productsIcon.classList.toggle('rotate-180');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.getElementById('mobile-menu').classList.add('hidden');
        }
    });
});

// Modal functions
function openModal() {
    document.getElementById('supportModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('supportModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on outside click
document.getElementById('supportModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Intersection Observer for fade-in animations (only for main page)
if (document.querySelectorAll('.fade-in').length > 0) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Cookie Consent Banner
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        setTimeout(() => {
            document.getElementById('cookieBanner').classList.add('show');
        }, 1000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieBanner();
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    hideCookieBanner();
}

function hideCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    banner.classList.remove('show');
    banner.classList.add('hide');
    window.location.reload();
}

// Check cookie consent on page load
checkCookieConsent();

// Console message for developers
console.log('%c🔐 Open Identity Platform', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to the Open Identity Platform ecosystem!', 'color: #8b5cf6; font-size: 14px;');
console.log('%cCheck out our projects: https://github.com/OpenIdentityPlatform', 'color: #94a3b8; font-size: 12px;');