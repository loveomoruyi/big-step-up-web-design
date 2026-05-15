// Plexus Digital FX Technology Background Animation
// Simple, calm plexus with gentle streaming highlights
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'plexus-canvas';
  Object.assign(canvas.style, {position:'fixed',top:'0',left:'0',width:'100%',height:'100%',zIndex:'0',pointerEvents:'none'});
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], streams = [], mouse = {x: -999, y: -999};
  const config = {count:80, size:2, lineDist:150, speed:0.5, color:'200,180,130'};

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function Particle(x, y) {
    this.x = x || Math.random() * W;
    this.y = y || Math.random() * H;
    this.vx = (Math.random() - 0.5) * config.speed;
    this.vy = (Math.random() - 0.5) * config.speed;
    this.alpha = 0.3 + Math.random() * 0.4;
    this.breathPhase = Math.random() * Math.PI * 2;
  }

  function createStream() {
    return {
      fromIdx: Math.floor(Math.random() * config.count),
      toIdx: Math.floor(Math.random() * config.count),
      progress: 0,
      speed: 0.004 + Math.random() * 0.006,
      active: false,
      delay: Math.random() * 300
    };
  }

  function init() {
    particles = [];
    streams = [];
    for (let i = 0; i < config.count; i++) particles.push(new Particle());
    for (let i = 0; i < 5; i++) streams.push(createStream());
  }

  function getDist(a, b) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }

  function drawLines(breathAlpha) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = getDist(particles[i], particles[j]);
        if (d < config.lineDist) {
          const alpha = (1 - d / config.lineDist) * 0.15 * breathAlpha;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${config.color},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawStreamingHighlights() {
    streams.forEach(function(stream) {
      if (stream.delay > 0) { stream.delay--; return; }
      if (!stream.active) { stream.active = true; }
      stream.progress += stream.speed;
      if (stream.progress >= 1) {
        stream.progress = 0;
        stream.fromIdx = Math.floor(Math.random() * config.count);
        stream.toIdx = Math.floor(Math.random() * config.count);
        stream.speed = 0.004 + Math.random() * 0.006;
        stream.delay = Math.random() * 200;
        stream.active = false;
        return;
      }
      const from = particles[stream.fromIdx];
      const to = particles[stream.toIdx];
      if (!from || !to) return;
      const x = from.x + (to.x - from.x) * stream.progress;
      const y = from.y + (to.y - from.y) * stream.progress;
      const streamAlpha = Math.sin(stream.progress * Math.PI) * 0.5;
      // Simple glow point (no trail)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 15);
      grad.addColorStop(0, `rgba(255, 200, 80, ${streamAlpha})`);
      grad.addColorStop(1, 'rgba(255, 180, 60, 0)');
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // Simple line segment
      const segLen = 0.12;
      const startP = Math.max(0, stream.progress - segLen);
      const sx = from.x + (to.x - from.x) * startP;
      const sy = from.y + (to.y - from.y) * startP;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(x, y);
      const lineGrad = ctx.createLinearGradient(sx, sy, x, y);
      lineGrad.addColorStop(0, 'rgba(255, 200, 80, 0)');
      lineGrad.addColorStop(1, `rgba(255, 200, 80, ${streamAlpha * 0.6})`);
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  function drawAmbientGlow() {
    // Only 2 subtle ambient glow points
    for (let i = 0; i < 2; i++) {
      const p = particles[Math.floor(particles.length / 3) * (i + 1)];
      if (!p) continue;
      const glowAlpha = 0.03 + Math.sin(Date.now() * 0.001 + i * 2) * 0.02;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 40);
      grad.addColorStop(0, `rgba(255, 200, 100, ${glowAlpha})`);
      grad.addColorStop(1, 'rgba(255, 180, 60, 0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  let breathCycle = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    breathCycle += 0.01;
    const breathAlpha = 0.85 + Math.sin(breathCycle) * 0.15;
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) { p.x -= dx * 0.01; p.y -= dy * 0.01; }
      p.breathPhase += 0.02;
      const dotAlpha = p.alpha * (0.7 + Math.sin(p.breathPhase) * 0.3) * breathAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, config.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${config.color},${dotAlpha})`;
      ctx.fill();
    });
    drawLines(breathAlpha);
    drawStreamingHighlights();
    drawAmbientGlow();
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  canvas.addEventListener('mouseleave', function() { mouse.x = -999; mouse.y = -999; });

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
