// 等 DOM 完全加载后再初始化，保证在 GitHub Pages 上也可靠
window.addEventListener('DOMContentLoaded', () => {
  /* ===== Canvas & Resizing ===== */
  const bgCanvas = document.getElementById('background-particles');
  const fwCanvas = document.getElementById('fireworks');
  const bgCtx = bgCanvas.getContext('2d');
  const fwCtx = fwCanvas.getContext('2d');

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    bgCanvas.width = fwCanvas.width = w;
    bgCanvas.height = fwCanvas.height = h;
  }
  window.addEventListener('resize', resize);
  resize();

  /* ===== 背景微粒（淡金色 & 淡紫色） ===== */
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
        // 50% 淡金色，50% 淡紫色
        color: Math.random() > 0.5 ? 'rgba(245,230,200,0.28)' : 'rgba(215,184,255,0.28)',
        vx: rand(-0.15, 0.15),
        vy: rand(-0.08, 0.08)
      });
    }
  }
  initParticles();

  function drawParticles() {
    // 清掉背景画布
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
    const m = hex.replace('#','');
    const r = parseInt(m.substring(0,2),16);
    const g = parseInt(m.substring(2,4),16);
    const b = parseInt(m.substring(4,6),16);
    return `${r},${g},${b}`;
  }

  function createFirework(x, y) {
    // 颜色与微粒呼应：亮金、粉紫、橙红
    const colors = ['#FFD700','#DA70D6','#FF4500'];
    const count = 40 + Math.floor(Math.random()*20);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(1.5, 4.5);
      fireworks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: rand(0.8, 2.6),
        color: colors[Math.floor(rand(0, colors.length))],
        alpha: rand(0.9,1),
        decay: rand(0.005, 0.018)
      });
    }
  }

  function drawFireworks() {
    // 采用清空整画布（fireworks 层单独存在，不会影响微粒层）
    fwCtx.clearRect(0,0,fwCanvas.width,fwCanvas.height);
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const p = fireworks[i];
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      fwCtx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
      fwCtx.fill();
      // 物理移动
      p.x += p.vx;
      p.y += p.vy;
      // 模拟重力效果（轻微）
      p.vy += 0.02;
      p.alpha -= p.decay;
      // 移除透明度较低的粒子
      if (p.alpha <= 0.02) fireworks.splice(i,1);
    }
  }

  /* ===== 动画主循环 ===== */
  function animate() {
    drawParticles();
    drawFireworks();
    requestAnimationFrame(animate);
  }
  animate();

  /* ===== 点击触发烟花（按钮 & 鼠标任意点） ===== */
  const fireBtn = document.getElementById('firework-button');
  fireBtn.addEventListener('click', () => {
    createFirework(rand(100, fwCanvas.width-100), rand(80, fwCanvas.height-180));
  });

  // 鼠标点击任意位置也触发（桌面体验）
  document.addEventListener('click', (e) => {
    // 如果点击在按钮上已经触发了，不重复触发
    const rect = fireBtn.getBoundingClientRect();
    const inBtn = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inBtn) createFirework(e.clientX, e.clientY);
  }, { passive: true });

  /* ===== 实时本地时间显示（替代倒计时） ===== */
  const elDate = document.getElementById('currentDate');
  const elTime = document.getElementById('currentTime');

  function pad(n) { return String(n).padStart(2,'0'); }

  function updateClock() {
    const now = new Date();
    // 格式：YYYY-MM-DD（本地）
    const Y = now.getFullYear();
    const M = pad(now.getMonth()+1);
    const D = pad(now.getDate());
    // 时间：HH:MM:SS 本地时间（浏览器）
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());

    elDate.textContent = `${Y}-${M}-${D}`;
    elTime.textContent = `${hh}:${mm}:${ss}`;
    // 下一次在下一个整秒刷新以保持秒显示精准
    const msToNextSecond = 1000 - now.getMilliseconds();
    setTimeout(updateClock, msToNextSecond);
  }
  updateClock();

  /* ===== 画布在 resize 后重置微粒密度 ===== */
  window.addEventListener('resize', () => {
    // 重置粒子数量或位置以适配新尺寸
    initParticles();
  });
});
