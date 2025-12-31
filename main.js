// Canvas
const bgCanvas = document.getElementById('background-particles');
const fwCanvas = document.getElementById('fireworks');
const bgCtx = bgCanvas.getContext('2d');
const fwCtx = fwCanvas.getContext('2d');

function resize() {
  bgCanvas.width = fwCanvas.width = window.innerWidth;
  bgCanvas.height = fwCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 背景微粒
const particles = [];
const particleCount = 140;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: rand(0, bgCanvas.width),
    y: rand(0, bgCanvas.height),
    r: rand(1, 2.5),
    c: Math.random() > 0.5
      ? 'rgba(245,230,200,0.4)'
      : 'rgba(215,184,255,0.4)',
    vx: rand(-0.15, 0.15),
    vy: rand(-0.1, 0.1)
  });
}

function drawParticles() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  particles.forEach(p => {
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = p.c;
    bgCtx.fill();

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = bgCanvas.width;
    if (p.x > bgCanvas.width) p.x = 0;
    if (p.y < 0) p.y = bgCanvas.height;
    if (p.y > bgCanvas.height) p.y = 0;
  });
}

// 烟花
const fireworks = [];

function hexToRgb(hex) {
  const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : '255,255,255';
}

function createFirework(x, y) {
  const colors = ['#FFD700', '#FF69B4', '#FF4500'];
  for (let i = 0; i < 40; i++) {
    fireworks.push({
      x, y,
      r: rand(1, 3),
      c: colors[Math.floor(rand(0, colors.length))],
      vx: rand(-3, 3),
      vy: rand(-3, 3),
      a: 1,
      d: rand(0.01, 0.02)
    });
  }
}

function drawFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const f = fireworks[i];
    fwCtx.beginPath();
    fwCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    fwCtx.fillStyle = `rgba(${hexToRgb(f.c)},${f.a})`;
    fwCtx.fill();

    f.x += f.vx;
    f.y += f.vy;
    f.a -= f.d;
    if (f.a <= 0) fireworks.splice(i, 1);
  }
}

// 动画
function animate() {
  drawParticles();
  drawFireworks();
  requestAnimationFrame(animate);
}
animate();

// 点击烟花
document.getElementById('firework-button').addEventListener('click', () => {
  createFirework(rand(100, fwCanvas.width - 100), rand(100, fwCanvas.height - 200));
});

// 倒计时（修复时区）
function countdown() {
  const target = new Date('2026-01-01T00:00:00+08:00');
  const now = new Date();
  const diff = target - now;

  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = String(Math.floor(diff / 3600000 % 24)).padStart(2, '0');
  const m = String(Math.floor(diff / 60000 % 60)).padStart(2, '0');
  const s = String(Math.floor(diff / 1000 % 60)).padStart(2, '0');

  days.textContent = d;
  hours.textContent = h;
  minutes.textContent = m;
  seconds.textContent = s;
}

setInterval(countdown, 1000);
countdown();
