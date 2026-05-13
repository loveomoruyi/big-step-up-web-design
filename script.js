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

// Hero Canvas Particle Animation
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    class Particle {
        constructor() { this.reset(); }
        reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 2 + 0.5; this.speedX = (Math.random() - 0.5) * 0.3; this.speedY = (Math.random() - 0.5) * 0.3; this.opacity = Math.random() * 0.5 + 0.1; this.fadeDir = Math.random() > 0.5 ? 1 : -1; this.fadeSpd = Math.random() * 0.005 + 0.002; }
        update() { this.x += this.speedX; this.y += this.speedY; this.opacity += this.fadeDir * this.fadeSpd; if (this.opacity >= 0.6) this.fadeDir = -1; if (this.opacity <= 0.05) this.fadeDir = 1; if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset(); }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = 'rgba(201, 169, 110, ' + this.opacity + ')'; ctx.fill(); }
    }
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
    function drawConnections() { for (let i = 0; i < particles.length; i++) { for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < 150) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = 'rgba(201, 169, 110, ' + ((1 - dist / 150) * 0.15) + ')'; ctx.lineWidth = 0.5; ctx.stroke(); } } } }
    function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); drawConnections(); animationId = requestAnimationFrame(animate); }
    const hero = document.querySelector('.hero');
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { animate(); } else { cancelAnimationFrame(animationId); } }); }, { threshold: 0.1 });
    obs.observe(hero);
    animate();
}

function initSectionLabelAnimations() { const labels = document.querySelectorAll('.section-label'); const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.5 }); labels.forEach(l => obs.observe(l)); }

document.addEventListener('DOMContentLoaded', function() { initHeroCanvas(); initSectionLabelAnimations(); });
