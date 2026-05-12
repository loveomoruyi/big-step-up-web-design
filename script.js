/* ============================================
   Big Step Up Web Design - Premium Interactions
   Smooth animations, scroll effects, and transitions
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initSmoothScroll();
    initCustomCursor();
    initParallax();
    initNavToggle();
});

/* Navigation */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* Mobile Nav Toggle */
function initNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

/* Scroll Animations with Intersection Observer */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children if they exist
                const staggerChildren = entry.target.querySelectorAll('.stagger');
                staggerChildren.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('visible');
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const animateElements = document.querySelectorAll('.fade-in');
    animateElements.forEach(el => observer.observe(el));

    // Also observe section headers, about content, etc.
    const additionalElements = document.querySelectorAll(
        '.section-header, .about-text, .about-stats, .contact-content, .service-card'
    );
    additionalElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/* Smooth Scroll for Anchor Links */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
                const navHeight = document.querySelector('.navbar').offsetHeight;

                window.scrollTo({
                    top: offsetTop - navHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* Custom Cursor */
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    // Only show on desktop
    if (window.innerWidth < 768) return;

    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        cursorDot.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
    });

    // Smooth follow for outline
    function animateOutline() {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        cursorOutline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`;
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Scale up on hover over links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform += ' scale(1.5)';
            cursorOutline.style.borderColor = 'rgba(201, 169, 110, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.borderColor = 'rgba(201, 169, 110, 0.5)';
        });
    });
}

/* Parallax Effects */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroBgText = document.querySelector('.hero-bg-text');

    if (!hero || !heroBgText) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            // Parallax for background text
            heroBgText.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.3}px)`;
            
            // Fade out hero content on scroll
            const opacity = 1 - (scrolled / heroHeight) * 1.5;
            hero.querySelector('.hero-content').style.opacity = Math.max(0, opacity);
        }
    }, { passive: true });
}

/* Console Branding */
console.log(
    '%c Big Step Up Web Design ',
    'background: linear-gradient(135deg, #c9a96e, #8b6914); color: white; font-size: 16px; padding: 10px 20px; border-radius: 4px; font-weight: bold;'
);
console.log(
    '%c Crafting Premium Digital Experiences ',
    'color: #c9a96e; font-size: 12px; padding: 5px 0;'
);
