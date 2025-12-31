/* ===============================
   前端密码门 + 光效动画
   =============================== */
function unlock() {
  const input = document.getElementById('pw').value;
  if (input === '201605') { // 正确密码
    const gate = document.getElementById('gate');
    
    // 1️⃣ 移除密码门
    gate.style.opacity = '0';
    gate.style.transition = 'opacity 1s ease-out';
    setTimeout(() => {
      gate.remove();
    }, 1000);
    
    // 2️⃣ 触发光环淡入 + 呼吸动画
    const ring = document.querySelector('.time-ring');
    ring.classList.add('active');

  } else {
    alert('密码错误。请记住你们相遇的日期。');
  }
}

// 回车键解锁
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && document.getElementById('gate')) {
    unlock();
  }
});

/* ===============================
   时间系统
   =============================== */
const systemStart = new Date('2016-05-01T00:00:00');
const newYear = new Date('2026-01-01T00:00:00');
let hasCelebrated = false;

// 数字变化追踪变量
let lastDays = 0, lastHours = 0, lastMinutes = 0, lastSeconds = 0;
let lastTsDays = 0, lastTsHours = 0, lastTsMinutes = 0, lastTsSeconds = 0;

// 添加数字变化动画
function addNumberAnimation(element, className) {
  if (element) {
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, 500);
  }
}

function updateNewYearCountdown() {
  const now = Date.now();
  let diff = newYear - now;

  if (diff <= 0) {
    // 新年到了！
    const countdownSection = document.querySelector('.countdown');
    if (countdownSection && countdownSection.style.display !== 'none') {
      countdownSection.style.display = 'none';
      document.querySelector('.time-ring').classList.add('active');
      
      // 触发烟花效果
      if (!hasCelebrated) {
        hasCelebrated = true;
        celebrateNewYear();
      }
    }
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 6000) / 1000);

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (d !== lastDays && daysEl) {
    daysEl.innerText = String(d).padStart(2, '0');
    addNumberAnimation(daysEl, 'number-change');
    lastDays = d;
  }
  if (h !== lastHours && hoursEl) {
    hoursEl.innerText = String(h).padStart(2, '0');
    addNumberAnimation(hoursEl, 'number-change');
    lastHours = h;
  }
  if (m !== lastMinutes && minutesEl) {
    minutesEl.innerText = String(m).padStart(2, '0');
    addNumberAnimation(minutesEl, 'number-change');
    lastMinutes = m;
  }
  if (s !== lastSeconds && secondsEl) {
    secondsEl.innerText = String(s).padStart(2, '0');
    addNumberAnimation(secondsEl, 'number-change');
    lastSeconds = s;
  }
}

function updateTimeSystem() {
  let diff = Math.floor((Date.now() - systemStart) / 1000);

  const days = Math.floor(diff / 86400);
  diff %= 86400;
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  const tsDaysEl = document.getElementById('ts-days');
  const tsHoursEl = document.getElementById('ts-hours');
  const tsMinutesEl = document.getElementById('ts-minutes');
  const tsSecondsEl = document.getElementById('ts-seconds');

  if (days !== lastTsDays && tsDaysEl) {
    tsDaysEl.innerText = String(days).padStart(6, '0');
    addNumberAnimation(tsDaysEl, 'value-change');
    lastTsDays = days;
  }
  if (hours !== lastTsHours && tsHoursEl) {
    tsHoursEl.innerText = String(hours).padStart(2, '0');
    addNumberAnimation(tsHoursEl, 'value-change');
    lastTsHours = hours;
  }
  if (minutes !== lastTsMinutes && tsMinutesEl) {
    tsMinutesEl.innerText = String(minutes).padStart(2, '0');
    addNumberAnimation(tsMinutesEl, 'value-change');
    lastTsMinutes = minutes;
  }
  if (seconds !== lastTsSeconds && tsSecondsEl) {
    tsSecondsEl.innerText = String(seconds).padStart(2, '0');
    addNumberAnimation(tsSecondsEl, 'value-change');
    lastTsSeconds = seconds;
  }
}

setInterval(() => {
  updateNewYearCountdown();
  updateTimeSystem();
}, 1000);

// 初始化
updateNewYearCountdown();
updateTimeSystem();

/* ===============================
   背景星空
   =============================== */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}
resize();
window.addEventListener('resize', resize);
// 处理移动端旋转
window.addEventListener('orientationchange', () => {
  setTimeout(resize, 100);
});

// 根据设备性能调整星星数量
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const starCount = isMobile ? 80 : 150;

const stars = Array.from({ length: starCount }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.3,
  v: Math.random() * 0.2 + 0.05,
  opacity: Math.random() * 0.5 + 0.5
}));

(function animate() {
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.fillStyle = 'rgba(255,215,0,0.8)';
  stars.forEach(s => {
    s.y -= s.v;
    if (s.y < 0) {
      s.y = displayHeight;
      s.x = Math.random() * displayWidth;
    }
    ctx.globalAlpha = s.opacity;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
})();

/* ===============================
   电子烟花系统
   =============================== */
const fireworksCanvas = document.getElementById('fireworks');
const fwCtx = fireworksCanvas.getContext('2d');

function resizeFireworks() {
  const dpr = window.devicePixelRatio || 1;
  fireworksCanvas.width = window.innerWidth * dpr;
  fireworksCanvas.height = window.innerHeight * dpr;
  fwCtx.scale(dpr, dpr);
  fireworksCanvas.style.width = window.innerWidth + 'px';
  fireworksCanvas.style.height = window.innerHeight + 'px';
}
resizeFireworks();
window.addEventListener('resize', resizeFireworks);
// 处理移动端旋转
window.addEventListener('orientationchange', () => {
  setTimeout(resizeFireworks, 100);
});

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.color = color;
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.015;
    this.size = Math.random() * 3 + 2;
    this.gravity = 0.05;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
    this.vx *= 0.98;
    this.vy *= 0.98;
  }

  draw() {
    fwCtx.save();
    fwCtx.globalAlpha = this.life;
    fwCtx.fillStyle = this.color;
    fwCtx.shadowBlur = 10;
    fwCtx.shadowColor = this.color;
    fwCtx.beginPath();
    fwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.colors = [
      '#FFD700', // 金色
      '#FF6B9D', // 粉红
      '#9FDCFF', // 天蓝
      '#FFA500', // 橙色
      '#FF1493', // 深粉
      '#00CED1', // 青色
      '#FF69B4', // 热粉
      '#87CEEB'  // 天蓝
    ];
    
    // 根据设备性能调整粒子数量
    const particleCount = isMobile ? 50 : 80;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 5 + 3;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      
      const particle = new Particle(x, y, color);
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      this.particles.push(particle);
    }
  }

  update() {
    this.particles = this.particles.filter(p => {
      p.update();
      return !p.isDead();
    });
  }

  draw() {
    this.particles.forEach(p => p.draw());
  }

  isDead() {
    return this.particles.length === 0;
  }
}

let fireworks = [];
let animationId = null;

function animateFireworks() {
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;
  fwCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  fwCtx.fillRect(0, 0, displayWidth, displayHeight);

  fireworks = fireworks.filter(fw => {
    fw.update();
    fw.draw();
    return !fw.isDead();
  });

  if (fireworks.length > 0 || !hasCelebrated) {
    animationId = requestAnimationFrame(animateFireworks);
  } else {
    // 清除画布
    fwCtx.clearRect(0, 0, displayWidth, displayHeight);
  }
}

function celebrateNewYear() {
  // 清除之前的动画
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  fireworks = [];
  
  // 根据设备性能调整烟花数量
  const fireworkCount = isMobile ? 8 : 15;
  const delay = isMobile ? 400 : 300; // 每个烟花之间的延迟（毫秒）
  
  for (let i = 0; i < fireworkCount; i++) {
    setTimeout(() => {
      const x = Math.random() * fireworksCanvas.width;
      const y = Math.random() * fireworksCanvas.height * 0.6 + fireworksCanvas.height * 0.2;
      fireworks.push(new Firework(x, y));
      
      // 如果这是第一个烟花，开始动画循环
      if (i === 0) {
        animateFireworks();
      }
    }, i * delay);
  }
  
  // 添加页面庆祝动画
  const container = document.querySelector('.container');
  container.classList.add('new-year-celebration');
  setTimeout(() => {
    container.classList.remove('new-year-celebration');
  }, 500);
  
  // 显示新年祝福
  setTimeout(() => {
    showNewYearMessage();
  }, 2000);
}

function showNewYearMessage() {
  const message = document.createElement('div');
  const isMobileDevice = window.innerWidth <= 768;
  const fontSize = isMobileDevice ? '1.5rem' : '2rem';
  const padding = isMobileDevice ? '30px 40px' : '40px 60px';
  const emojiSize = isMobileDevice ? '2.5rem' : '3rem';
  const subFontSize = isMobileDevice ? '1rem' : '1.2rem';
  
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(159,220,255,0.2));
    border: 2px solid #ffd700;
    border-radius: 20px;
    padding: ${padding};
    text-align: center;
    color: #ffd700;
    font-size: ${fontSize};
    font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    font-weight: 700;
    box-shadow: 0 0 50px rgba(255,215,0,0.5);
    animation: fadeInOut 3s ease-in-out;
    pointer-events: none;
    max-width: 90%;
    margin: 0 auto;
  `;
  message.innerHTML = `
    <div style="font-size: ${emojiSize}; margin-bottom: 20px;">🎆</div>
    <div>新年快乐！</div>
    <div style="font-size: ${subFontSize}; margin-top: 15px; color: #9fdcff;">Happy New Year!</div>
  `;
  
  // 添加淡入淡出动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
    style.remove();
  }, 3000);
}

// 系统自2016年5月起运行，从未停止
console.log('⏱ Time System Online Since May 2016. No shutdown planned. ❤️');

/* ===============================
   鼠标跟随粒子效果
   =============================== */
const cursorCanvas = document.getElementById('cursor-trail');
if (cursorCanvas) {
  const cursorCtx = cursorCanvas.getContext('2d');

  function resizeCursorCanvas() {
    const dpr = window.devicePixelRatio || 1;
    cursorCanvas.width = window.innerWidth * dpr;
    cursorCanvas.height = window.innerHeight * dpr;
    cursorCtx.scale(dpr, dpr);
    cursorCanvas.style.width = window.innerWidth + 'px';
    cursorCanvas.style.height = window.innerHeight + 'px';
  }
  resizeCursorCanvas();
  window.addEventListener('resize', resizeCursorCanvas);

  const cursorParticles = [];
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // 创建跟随粒子
    for (let i = 0; i < 3; i++) {
      cursorParticles.push({
        x: mouseX + (Math.random() - 0.5) * 20,
        y: mouseY + (Math.random() - 0.5) * 20,
        size: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.01,
        color: `hsl(${Math.random() * 60 + 40}, 100%, ${Math.random() * 30 + 60}%)`
      });
    }
  });

  function animateCursor() {
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    
    cursorCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    cursorCtx.fillRect(0, 0, displayWidth, displayHeight);
    
    cursorParticles.forEach((p, index) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= p.decay;
      p.size *= 0.98;
      
      cursorCtx.save();
      cursorCtx.globalAlpha = p.life;
      cursorCtx.fillStyle = p.color;
      cursorCtx.shadowBlur = 10;
      cursorCtx.shadowColor = p.color;
      cursorCtx.beginPath();
      cursorCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      cursorCtx.fill();
      cursorCtx.restore();
      
      if (p.life <= 0 || p.size < 0.5) {
        cursorParticles.splice(index, 1);
      }
    });
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* ===============================
   点击涟漪效果
   =============================== */
document.addEventListener('click', (e) => {
  const rippleContainer = document.querySelector('.ripple-container');
  if (rippleContainer) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.width = ripple.style.height = '20px';
    
    rippleContainer.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});
