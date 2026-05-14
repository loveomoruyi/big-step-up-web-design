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


// ============================================
// GALAXY PARTICLE SYSTEM - 3D Star Field
// ============================================
function initGalaxyCanvas() {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, stars = [], mouseX = 0, mouseY = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        const count = Math.min(200, Math.floor((width * height) / 8000));
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * 3 + 0.5,
                size: Math.random() * 1.5 + 0.3,
                color: Math.random() > 0.6 ? 'purple' : Math.random() > 0.4 ? 'gold' : 'white',
                speedX: (Math.random() - 0.5) * 0.15,
                speedY: (Math.random() - 0.5) * 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.005
            });
        }
    }

    function getColor(star) {
        var a = 0.3 + Math.sin(star.pulse) * 0.2;
        if (star.color === 'purple') return 'rgba(139,92,246,' + a + ')';
        if (star.color === 'gold') return 'rgba(201,169,110,' + a + ')';
        return 'rgba(255,255,255,' + (a * 0.7) + ')';
    }

    function drawStars() {
        ctx.clearRect(0, 0, width, height);
        var grd1 = ctx.createRadialGradient(width*0.2, height*0.3, 0, width*0.2, height*0.3, width*0.3);
        grd1.addColorStop(0, 'rgba(139,92,246,0.02)');
        grd1.addColorStop(1, 'transparent');
        ctx.fillStyle = grd1;
        ctx.fillRect(0, 0, width, height);
        var grd2 = ctx.createRadialGradient(width*0.8, height*0.7, 0, width*0.8, height*0.7, width*0.25);
        grd2.addColorStop(0, 'rgba(201,169,110,0.015)');
        grd2.addColorStop(1, 'transparent');
        ctx.fillStyle = grd2;
        ctx.fillRect(0, 0, width, height);

        for (var i = 0; i < stars.length; i++) {
            var star = stars[i];
            var parallaxX = (mouseX - width/2) * star.z * 0.005;
            var parallaxY = (mouseY - height/2) * star.z * 0.005;
            star.x += star.speedX;
            star.y += star.speedY;
            star.pulse += star.pulseSpeed;
            if (star.x < -10) star.x = width + 10;
            if (star.x > width + 10) star.x = -10;
            if (star.y < -10) star.y = height + 10;
            if (star.y > height + 10) star.y = -10;
            var dx = star.x + parallaxX;
            var dy = star.y + parallaxY;
            var ps = star.size * (1 + Math.sin(star.pulse) * 0.3);
            ctx.beginPath();
            ctx.arc(dx, dy, ps, 0, Math.PI * 2);
            ctx.fillStyle = getColor(star);
            ctx.fill();
            if (star.size > 1) {
                ctx.beginPath();
                ctx.arc(dx, dy, ps * 3, 0, Math.PI * 2);
                var g = ctx.createRadialGradient(dx, dy, 0, dx, dy, ps * 3);
                g.addColorStop(0, getColor(star).replace(/[\d.]+\)$/, '0.1)'));
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.fill();
            }
        }
        // Connect nearby stars
        for (var i = 0; i < stars.length; i++) {
            for (var j = i + 1; j < stars.length; j++) {
                var ddx = stars[i].x - stars[j].x;
                var ddy = stars[i].y - stars[j].y;
                var dist = Math.sqrt(ddx*ddx + ddy*ddy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.strokeStyle = 'rgba(139,92,246,' + (0.04*(1-dist/120)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', function() { resize(); createStars(); });
    document.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });
    resize();
    createStars();
    drawStars();
}

// ============================================
// FLOATING PARTICLES
// ============================================
function initFloatingParticles() {
    var container = document.getElementById('floating-particles');
    if (!container) return;
    var count = window.innerWidth < 768 ? 0 : 25;
    for (var i = 0; i < count; i++) {
        var p = document.createElement('div');
        p.className = 'floating-particle';
        var size = Math.random() * 4 + 2;
        var isGold = Math.random() > 0.5;
        var color = isGold ? 'rgba(201,169,110,0.6)' : 'rgba(139,92,246,0.5)';
        var glow = isGold ? 'rgba(201,169,110,0.3)' : 'rgba(139,92,246,0.3)';
        p.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+Math.random()*100+'%;background:'+color+';box-shadow:0 0 '+(size*2)+'px '+glow+';animation-duration:'+(Math.random()*20+15)+'s;animation-delay:'+(Math.random()*20)+'s;';
        container.appendChild(p);
    }
}

// ============================================
// TEMPLATE PLAYGROUND
// ============================================
function initPlayground() {
    var card = document.getElementById('preview-card');
    if (!card) return;

    document.querySelectorAll('.color-swatches').forEach(function(group) {
        var target = group.dataset.target;
        group.querySelectorAll('.swatch').forEach(function(swatch) {
            swatch.addEventListener('click', function() {
                group.querySelectorAll('.swatch').forEach(function(s) { s.classList.remove('active'); });
                swatch.classList.add('active');
                var c = swatch.dataset.color;
                if (target === 'bg') {
                    card.style.background = c === '#ffffff' ? 'rgba(255,255,255,0.95)' : c === '#0a0a0a' ? 'rgba(255,255,255,0.03)' : c;
                    var isLight = c === '#ffffff';
                    card.querySelector('.preview-title').style.color = isLight ? '#1a1a2e' : 'white';
                    card.querySelector('.preview-text').style.color = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
                } else if (target === 'accent') {
                    card.querySelector('.preview-badge').style.background = 'linear-gradient(135deg,'+c+','+c+'88)';
                    card.querySelector('.preview-btn').style.background = 'linear-gradient(135deg,'+c+','+c+'88)';
                    card.querySelectorAll('.dot')[0].style.background = c;
                }
            });
        });
    });

    document.querySelectorAll('.font-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.font-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            card.querySelector('.preview-title').style.fontFamily = btn.dataset.font;
            card.querySelector('.preview-text').style.fontFamily = btn.dataset.font;
        });
    });

    document.querySelectorAll('.style-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.style-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            card.className = 'preview-card style-' + btn.dataset.style;
        });
    });
}

// Initialize enhanced effects
document.addEventListener('DOMContentLoaded', function() {
    initGalaxyCanvas();
    initFloatingParticles();
    initPlayground();
});


// ============================================
// ANIMATED WIREFRAME GRID - Title Backdrop
// ============================================
function initGridCanvas() {
    var canvas = document.getElementById('grid-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h, time = 0;
    var cols = 20, rows = 15;

    function resize() {
        w = canvas.width = canvas.parentElement.offsetWidth;
        h = canvas.height = canvas.parentElement.offsetHeight;
    }

    function draw() {
        time += 0.008;
        ctx.clearRect(0, 0, w, h);

        var cx = w / 2, cy = h / 2;
        var cellW = w / cols, cellH = h / rows;

        // Draw perspective grid lines
        for (var i = 0; i <= cols; i++) {
            var x = i * cellW;
            var distFromCenter = Math.abs(x - cx) / cx;
            var wave = Math.sin(time * 2 + i * 0.3) * 3;
            var alpha = 0.35 * (1 - distFromCenter * 0.4);
            var hue = Math.sin(time + i * 0.2) > 0 ? '139,92,246' : '201,169,110';

            ctx.beginPath();
            ctx.moveTo(x + wave, 0);
            ctx.lineTo(x - wave, h);
            ctx.strokeStyle = 'rgba(' + hue + ',' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        for (var j = 0; j <= rows; j++) {
            var y = j * cellH;
            var distFromCenterY = Math.abs(y - cy) / cy;
            var wave2 = Math.sin(time * 1.5 + j * 0.4) * 2;
            var alpha2 = 0.3 * (1 - distFromCenterY * 0.4);
            var hue2 = Math.sin(time + j * 0.3) > 0 ? '168,85,247' : '251,191,36';

            ctx.beginPath();
            ctx.moveTo(0, y + wave2);
            ctx.lineTo(w, y - wave2);
            ctx.strokeStyle = 'rgba(' + hue2 + ',' + alpha2 + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Draw glowing intersection nodes
        for (var ni = 0; ni <= cols; ni += 4) {
            for (var nj = 0; nj <= rows; nj += 3) {
                var nx = ni * cellW;
                var ny = nj * cellH;
                var pulse = Math.sin(time * 3 + ni + nj) * 0.5 + 0.5;
                var nodeAlpha = 0.4 + pulse * 0.3;
                var nodeSize = 1.5 + pulse * 1.5;
                var dist = Math.sqrt(Math.pow(nx - cx, 2) + Math.pow(ny - cy, 2));
                var maxDist = Math.sqrt(cx * cx + cy * cy);
                var falloff = 1 - (dist / maxDist);

                ctx.beginPath();
                ctx.arc(nx, ny, nodeSize * falloff, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(139,92,246,' + (nodeAlpha * falloff) + ')';
                ctx.fill();

                // Glow
                if (falloff > 0.5) {
                    ctx.beginPath();
                    ctx.arc(nx, ny, nodeSize * 4 * falloff, 0, Math.PI * 2);
                    var g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nodeSize * 4 * falloff);
                    g.addColorStop(0, 'rgba(139,92,246,' + (nodeAlpha * 0.3 * falloff) + ')');
                    g.addColorStop(1, 'transparent');
                    ctx.fillStyle = g;
                    ctx.fill();
                }
            }
        }

        // Center energy core
        var coreSize = 120 + Math.sin(time * 2) * 40;
        var coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize);
        coreGrad.addColorStop(0, 'rgba(139,92,246,0.2)');
        coreGrad.addColorStop(0.5, 'rgba(201,169,110,0.1)');
        coreGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
}

// Initialize grid on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGridCanvas);
} else {
    initGridCanvas();
}

// === FRAMER & SHOWIT INSPIRED DYNAMIC BACKGROUND ANIMATIONS ===

// Gradient Mesh Canvas Animation
class GradientMesh {
    constructor() {
        this.canvas = document.getElementById('gradient-mesh-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.time = 0;
        this.resize();
        this.initPoints();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    initPoints() {
        const colors = [
            {r:139,g:92,b:246}, {r:6,g:182,b:212},
            {r:236,g:72,b:153}, {r:99,g:102,b:241},
            {r:249,g:115,b:22}, {r:16,g:185,b:129}
        ];
        for (let i = 0; i < 8; i++) {
            this.points.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: 200 + Math.random() * 300,
                color: colors[i % colors.length],
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    animate() {
        this.time += 0.005;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.points.forEach((p, i) => {
            p.x += p.vx + Math.sin(this.time + p.phase) * 0.5;
            p.y += p.vy + Math.cos(this.time + p.phase) * 0.5;
            if (p.x < -100) p.x = this.canvas.width + 100;
            if (p.x > this.canvas.width + 100) p.x = -100;
            if (p.y < -100) p.y = this.canvas.height + 100;
            if (p.y > this.canvas.height + 100) p.y = -100;
            const pulse = Math.sin(this.time * 2 + p.phase) * 0.3 + 0.7;
            const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * pulse);
            grad.addColorStop(0, 'rgba('+p.color.r+','+p.color.g+','+p.color.b+',0.15)');
            grad.addColorStop(0.5, 'rgba('+p.color.r+','+p.color.g+','+p.color.b+',0.05)');
            grad.addColorStop(1, 'rgba('+p.color.r+','+p.color.g+','+p.color.b+',0)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });
        requestAnimationFrame(() => this.animate());
    }
}

// Interactive Parallax on Mouse Move
class ParallaxController {
    constructor() {
        this.layers = document.querySelectorAll('.parallax-layer');
        this.blobs = document.querySelectorAll('.morph-blob');
        this.shapes = document.querySelectorAll('.float-shape');
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        document.addEventListener('mousemove', (e) => {
            this.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        this.animate();
    }
    animate() {
        this.mouseX += (this.targetX - this.mouseX) * 0.05;
        this.mouseY += (this.targetY - this.mouseY) * 0.05;
        this.layers.forEach((layer, i) => {
            const depth = (i + 1) * 15;
            const tx = this.mouseX * depth;
            const ty = this.mouseY * depth;
            layer.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
        });
        this.blobs.forEach((blob, i) => {
            const depth = (i + 1) * 8;
            blob.style.marginLeft = (this.mouseX * depth) + 'px';
            blob.style.marginTop = (this.mouseY * depth) + 'px';
        });
        requestAnimationFrame(() => this.animate());
    }
}

// Scroll-triggered intensity boost
class ScrollAnimator {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.blobContainer = document.querySelector('.blob-container');
        this.streaks = document.querySelector('.light-streaks');
        window.addEventListener('scroll', () => this.onScroll());
    }
    onScroll() {
        if (!this.hero) return;
        const rect = this.hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        if (this.blobContainer) {
            this.blobContainer.style.opacity = 1 - progress * 0.5;
            this.blobContainer.style.transform = 'scale(' + (1 + progress * 0.2) + ')';
        }
        if (this.streaks) {
            this.streaks.style.opacity = 1 - progress * 0.7;
        }
    }
}

// Initialize all enhanced animations
document.addEventListener('DOMContentLoaded', function() {
    new GradientMesh();
    new ParallaxController();
    new ScrollAnimator();
});
