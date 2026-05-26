// Plexus Digital FX Technology Background Animation
// Enhanced plexus network with mouse click interactivity - no shooting lights
(function() {
const canvas = document.createElement('canvas');
canvas.id = 'plexus-canvas';
canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:all;';
document.body.insertBefore(canvas, document.body.firstChild);
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

const config = { count: 100, size: 3, lineDist: 180, speed: 0.4, color: '220,200,150', mouseRadius: 250, clickForce: 12, clickRadius: 200 };
let particles = [];
let mouse = { x: -999, y: -999 };
let clicks = [];

function Particle(x, y) {
  this.x = x || Math.random() * W;
  this.y = y || Math.random() * H;
  this.vx = (Math.random() - 0.5) * config.speed;
  this.vy = (Math.random() - 0.5) * config.speed;
  this.alpha = 0.6 + Math.random() * 0.4;
  this.size = 1.5 + Math.random() * 2;
  this.pulsePhase = Math.random() * Math.PI * 2;
}

function init() {
  particles = [];
  for (let i = 0; i < config.count; i++) {
    particles.push(new Particle());
  }
}

function getDist(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dist = getDist(particles[i], particles[j]);
      if (dist < config.lineDist) {
        const opacity = (1 - dist / config.lineDist) * 0.6;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = 'rgba(' + config.color + ',' + opacity + ')';
        ctx.lineWidth = (1 - dist / config.lineDist) * 1.8;
        ctx.stroke();
      }
    }
    // Draw lines to mouse if close enough
    const mouseDist = Math.sqrt((particles[i].x - mouse.x) * (particles[i].x - mouse.x) + (particles[i].y - mouse.y) * (particles[i].y - mouse.y));
    if (mouseDist < config.mouseRadius) {
      const opacity = (1 - mouseDist / config.mouseRadius) * 0.8;
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = 'rgba(255,220,130,' + opacity + ')';
      ctx.lineWidth = (1 - mouseDist / config.mouseRadius) * 2.5;
      ctx.stroke();
    }
  }
}

function drawParticles(time) {
  particles.forEach(function(p) {
    p.pulsePhase += 0.02;
    const pulse = 0.7 + Math.sin(p.pulsePhase) * 0.3;
    const finalAlpha = p.alpha * pulse;
    
    // Draw outer glow
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + config.color + ',' + (finalAlpha * 0.15) + ')';
    ctx.fill();
    
    // Draw core dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + config.color + ',' + finalAlpha + ')';
    ctx.fill();
    
    // Brighter center
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,240,' + (finalAlpha * 0.8) + ')';
    ctx.fill();
  });
}

function drawMouseGlow() {
  if (mouse.x < 0 || mouse.y < 0) return;
  const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
  grad.addColorStop(0, 'rgba(255, 220, 130, 0.12)');
  grad.addColorStop(1, 'rgba(255, 220, 130, 0)');
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

function processClicks() {
  for (let c = clicks.length - 1; c >= 0; c--) {
    const click = clicks[c];
    click.age++;
    click.radius += 4;
    click.alpha = 1 - click.age / click.maxAge;
    
    if (click.alpha <= 0) {
      clicks.splice(c, 1);
      continue;
    }
    
    // Draw expanding ring
    ctx.beginPath();
    ctx.arc(click.x, click.y, click.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 210, 100, ' + (click.alpha * 0.5) + ')';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw inner ring
    ctx.beginPath();
    ctx.arc(click.x, click.y, click.radius * 0.6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 230, 150, ' + (click.alpha * 0.3) + ')';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Push particles away from click
    particles.forEach(function(p) {
      const dx = p.x - click.x;
      const dy = p.y - click.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < config.clickRadius && dist > 0) {
        const force = (1 - dist / config.clickRadius) * config.clickForce * click.alpha;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  
  // Update particles
  particles.forEach(function(p) {
    p.x += p.vx;
    p.y += p.vy;
    
    // Apply friction
    p.vx *= 0.98;
    p.vy *= 0.98;
    
    // Restore base speed if too slow
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed < config.speed * 0.3) {
      p.vx += (Math.random() - 0.5) * 0.05;
      p.vy += (Math.random() - 0.5) * 0.05;
    }
    
    // Bounce off edges
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    
    // Keep in bounds
    p.x = Math.max(0, Math.min(W, p.x));
    p.y = Math.max(0, Math.min(H, p.y));
    
    // Mouse attraction (gentle pull toward mouse)
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < config.mouseRadius && dist > 0) {
      p.vx += (dx / dist) * 0.03;
      p.vy += (dy / dist) * 0.03;
    }
  });
  
  processClicks();
  drawLines();
  drawParticles(Date.now());
  drawMouseGlow();
  requestAnimationFrame(animate);
}

// Mouse events
canvas.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
canvas.addEventListener('mouseleave', function() { mouse.x = -999; mouse.y = -999; });
canvas.addEventListener('click', function(e) {
  clicks.push({ x: e.clientX, y: e.clientY, radius: 0, age: 0, maxAge: 40, alpha: 1 });
  // Spawn new particles at click location
  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    const p = new Particle(e.clientX, e.clientY);
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.alpha = 1;
    p.size = 2 + Math.random() * 1.5;
    particles.push(p);
  }
  // Remove excess particles to keep performance
  while (particles.length > config.count + 30) {
    particles.shift();
  }
});

// Text animation
function initTextAnim() {
  const lines = document.querySelectorAll('.title-line');
  const sub = document.querySelector('.hero-subtitle');
  lines.forEach(function(el, i) { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; el.style.transitionDelay = (i * 0.15) + 's'; });
  if (sub) { sub.style.opacity = '0'; sub.style.transform = 'translateY(20px)'; sub.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; sub.style.transitionDelay = '0.5s'; }
  setTimeout(function() { lines.forEach(function(el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }); if (sub) { sub.style.opacity = '1'; sub.style.transform = 'translateY(0)'; } }, 200);
}

init();
animate();
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initTextAnim); } else { initTextAnim(); }
})();

// ===== Portfolio Templates Tab Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});
