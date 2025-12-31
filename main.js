window.addEventListener('DOMContentLoaded', () => {
  /* ===== Canvas & Resize ===== */
  const bgCanvas = document.getElementById('background-particles');
  const fwCanvas = document.getElementById('fireworks');
  const bgCtx = bgCanvas.getContext('2d');
  const fwCtx = fwCanvas.getContext('2d');

  function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    bgCanvas.width = fwCanvas.width = w;
    bgCanvas.height = fwCanvas.height = h;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  /* ===== 背景微粒 ===== */
  const particles = [];
  const PARTICLE_COUNT = Math.max(80, Math.floor(window.innerWidth / 10));

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: rand(0, bgCanvas.width),
        y: rand(0, bgCanvas.height),
        r: rand(0.6, 2.4),
        color: Math.random() > 0.5 ? 'rgba(245,230,200,0.28)' : 'rgba(215,184,255,0.28)',
        vx: rand(-0.15, 0.15),
        vy: rand(-0.08, 0.08)
      });
    }
  }
  initParticles();

  function drawParticles() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    particles.forEach(p => {
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bgCtx.fillStyle = p.color;
      bgCtx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = bgCanvas.width + 10;
      if (p.x > bgCanvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = bgCanvas.height + 10;
      if (p.y > bgCanvas.height + 10) p.y = -10;
    });
  }

  /* ===== 烟花 ===== */
  const fireworks = [];

  function hexToRgb(hex) {
    const s = hex.replace('#','');
    const r = parseInt(s.substring(0,2),16);
    const g = parseInt(s.substring(2,4),16);
    const b = parseInt(s.substring(4,6),16);
    return `${r},${g},${b}`;
  }

  function createFirework(x, y) {
    const colors = ['#FFD700','#DA70D6','#FF4500'];
    const count = 40 + Math.floor(Math.random()*20);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(1.5, 4.0);
      fireworks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: rand(0.8, 2.4),
        color: colors[Math.floor(rand(0, colors.length))],
        a: rand(0.9, 1),
        decay: rand(0.005, 0.018)
      });
    }
  }

  function drawFireworks() {
    fwCtx.clearRect(0,0,fwCanvas.width,fwCanvas.height);
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const p = fireworks[i];
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      fwCtx.fillStyle = `rgba(${hexToRgb(p.color)},${p.a})`;
      fwCtx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // gravity
      p.a -= p.decay;
      if (p.a <= 0.02) fireworks.splice(i, 1);
    }
  }

  /* ===== 动画循环 ===== */
  function animate() {
    drawParticles();
    drawFireworks();
    requestAnimationFrame(animate);
  }
  animate();

  /* ===== 交互：按钮与任意点击触发烟花 ===== */
  const fireBtn = document.getElementById('firework-button');
  fireBtn.addEventListener('click', () => {
    createFirework(rand(100, fwCanvas.width - 100), rand(80, fwCanvas.height - 180));
  });

  document.addEventListener('click', (e) => {
    const rect = fireBtn.getBoundingClientRect();
    const inBtn = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inBtn) createFirework(e.clientX, e.clientY);
  }, { passive: true });

  /* ===== 本地实时时间（显示年月日 + 中文年月日+星期 + HH:MM:SS） ===== */
  const elDateISO = document.getElementById('currentDate');
  const elDateCN = document.getElementById('currentDateCN');
  const elTime = document.getElementById('currentTime');

  const weekMap = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];

  function pad(n){ return String(n).padStart(2,'0'); }

  function updateClock() {
    const now = new Date();
    const Y = now.getFullYear();
    const M = pad(now.getMonth() + 1);
    const D = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    const w = weekMap[now.getDay()];

    elDateISO.textContent = `${Y}-${M}-${D}`;
    elDateCN.textContent = `${Y}年${M}月${D}日 ${w}`;
    elTime.textContent = `${hh}:${mm}:${ss}`;

    // 在下一个整秒再刷新，保持秒数稳定
    const msToNext = 1000 - now.getMilliseconds();
    setTimeout(updateClock, msToNext);
  }
  updateClock();

  /* ===== resize 后重置微粒密度（可选） ===== */
  window.addEventListener('resize', () => {
    initParticles();
  });
});
