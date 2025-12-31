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
    alert('一生挚爱');
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

let finalCountdownActive = false;
let finalCountdownValue = 10;
let blessingShown = false;

function updateNewYearCountdown() {
  const now = Date.now();
  let diff = newYear - now;

  // 如果距离新年还有10秒或更少，显示最后10秒倒计时
  if (diff <= 10000 && diff > 0 && !finalCountdownActive) {
    startFinalCountdown();
    return;
  }
  
  // 如果已经在最后10秒倒计时中，不更新正常倒计时
  if (finalCountdownActive) {
    return;
  }

  if (diff <= 0) {
    // 新年到了！
    if (!blessingShown) {
      showNewYearBlessing();
      blessingShown = true;
    }
    
    const countdownSection = document.querySelector('.countdown');
    if (countdownSection && countdownSection.style.display !== 'none') {
      // 隐藏最后10秒倒计时
      const finalCountdown = document.getElementById('finalCountdown');
      if (finalCountdown) {
        finalCountdown.style.display = 'none';
      }
      
      document.querySelector('.time-ring').classList.add('active');
      
      // 触发烟花效果
      if (!hasCelebrated) {
        hasCelebrated = true;
        celebrateNewYear();
      }
    }
    return;
  }

  // 如果不在最后10秒，正常显示倒计时
  if (diff > 10000) {
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

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
}

// 开始最后10秒倒计时
function startFinalCountdown() {
  finalCountdownActive = true;
  const finalCountdown = document.getElementById('finalCountdown');
  const finalCountdownNumber = document.getElementById('finalCountdownNumber');
  const countdownSection = document.querySelector('.countdown');
  
  if (finalCountdown && finalCountdownNumber) {
    // 隐藏正常倒计时
    if (countdownSection) {
      countdownSection.style.opacity = '0';
      setTimeout(() => {
        countdownSection.style.display = 'none';
      }, 500);
    }
    
    // 显示最后10秒倒计时
    finalCountdown.style.display = 'flex';
    
    // 倒计时函数（使用requestAnimationFrame优化性能）
    let lastSecond = -1;
    function updateFinalCountdown() {
      if (!finalCountdown || !finalCountdownNumber) return;
      
      const now = Date.now();
      const diff = newYear - now;
      const seconds = Math.ceil(diff / 1000);
      
      if (seconds > 0 && seconds <= 10) {
        // 只在秒数变化时更新
        if (seconds !== lastSecond) {
          finalCountdownNumber.innerText = seconds;
          // 添加数字变化动画
          finalCountdownNumber.style.animation = 'none';
          requestAnimationFrame(() => {
            finalCountdownNumber.style.animation = 'numberPulse 0.5s ease';
          });
          lastSecond = seconds;
        }
        
        // 继续倒计时（使用更合理的间隔）
        requestAnimationFrame(() => {
          setTimeout(updateFinalCountdown, 50);
        });
      } else if (diff <= 0) {
        // 倒计时结束，显示祝福
        finalCountdown.style.opacity = '0';
        finalCountdown.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          if (finalCountdown) {
            finalCountdown.style.display = 'none';
          }
          showNewYearBlessing();
        }, 500);
      }
    }
    
    // 开始倒计时
    updateFinalCountdown();
  }
}

// 显示新年祝福
function showNewYearBlessing() {
  const blessing = document.getElementById('newYearBlessing');
  if (blessing) {
    blessing.style.display = 'flex';
    blessing.style.opacity = '0';
    blessing.style.animation = 'blessingFadeIn 1.5s ease-out forwards';
    
    // 触发烟花效果
    if (!hasCelebrated) {
      hasCelebrated = true;
      celebrateNewYear();
    }
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

// 使用优化的更新方式
let updateInterval;
if (isMobile) {
  // 移动端使用requestAnimationFrame优化
  let lastUpdateTime = 0;
  const UPDATE_INTERVAL = 1000; // 1秒更新一次
  
  function throttledUpdate() {
    const now = Date.now();
    if (now - lastUpdateTime >= UPDATE_INTERVAL) {
      updateNewYearCountdown();
      updateTimeSystem();
      lastUpdateTime = now;
    }
    requestAnimationFrame(throttledUpdate);
  }
  requestAnimationFrame(throttledUpdate);
} else {
  // 桌面端使用setInterval
  updateInterval = setInterval(() => {
    updateNewYearCountdown();
    updateTimeSystem();
  }, 1000);
}

// 初始化
updateNewYearCountdown();
updateTimeSystem();

/* ===============================
   背景星空
   =============================== */
// 等待DOM加载完成
let canvas, ctx, stars;
let resizeTimeout;

// 根据设备性能调整星星数量
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const starCount = isMobile ? 80 : 150;

function initStars() {
  canvas = document.getElementById('stars');
  if (!canvas) return;
  
  try {
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    resize();
    
    // 初始化星星
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * (canvas.width || window.innerWidth),
      y: Math.random() * (canvas.height || window.innerHeight),
      r: Math.random() * 1.5 + 0.3,
      v: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.5 + 0.5
    }));
    
    animate();
  } catch (e) {
    console.warn('Canvas initialization failed:', e);
  }
}

function resize() {
  if (!canvas || !ctx) return;
  
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  // 重新初始化星星位置
  if (stars) {
    stars.forEach(s => {
      s.x = Math.random() * width;
      s.y = Math.random() * height;
    });
  }
}

// 防抖处理resize
function debounceResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 150);
}

window.addEventListener('resize', debounceResize);
// 处理移动端旋转
window.addEventListener('orientationchange', () => {
  setTimeout(resize, 200);
});

function animate() {
  if (!canvas || !ctx || !stars) return;
  
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
}

// DOM加载完成后初始化
function initAll() {
  try {
    initStars();
    initFireworks();
    initCursorTrail();
  } catch (e) {
    console.warn('Initialization error:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* ===============================
   电子烟花系统
   =============================== */
let fireworksCanvas, fwCtx;
let fireworksResizeTimeout;

function initFireworks() {
  fireworksCanvas = document.getElementById('fireworks');
  if (!fireworksCanvas) return;
  
  try {
    fwCtx = fireworksCanvas.getContext('2d');
    if (!fwCtx) return;
    
    resizeFireworks();
  } catch (e) {
    console.warn('Fireworks canvas initialization failed:', e);
  }
}

function resizeFireworks() {
  if (!fireworksCanvas || !fwCtx) return;
  
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  fireworksCanvas.width = width * dpr;
  fireworksCanvas.height = height * dpr;
  fwCtx.scale(dpr, dpr);
  fireworksCanvas.style.width = width + 'px';
  fireworksCanvas.style.height = height + 'px';
}

function debounceFireworksResize() {
  clearTimeout(fireworksResizeTimeout);
  fireworksResizeTimeout = setTimeout(resizeFireworks, 150);
}

window.addEventListener('resize', debounceFireworksResize);
window.addEventListener('orientationchange', () => {
  setTimeout(resizeFireworks, 200);
});

// DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFireworks);
} else {
  initFireworks();
}

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
    if (!fwCtx) return;
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
  if (!fwCtx || !fireworksCanvas) {
    animationId = null;
    return;
  }
  
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;
  fwCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  fwCtx.fillRect(0, 0, displayWidth, displayHeight);

  fireworks = fireworks.filter(fw => {
    fw.update();
    fw.draw();
    return !fw.isDead();
  });

  if (fireworks.length > 0) {
    animationId = requestAnimationFrame(animateFireworks);
  } else {
    // 清除画布
    fwCtx.clearRect(0, 0, displayWidth, displayHeight);
    animationId = null;
  }
}

function celebrateNewYear() {
  // 清除之前的动画
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  if (!fireworksCanvas || !fwCtx) {
    initFireworks();
  }
  
  fireworks = [];
  
  // 根据设备性能调整烟花数量
  const fireworkCount = isMobile ? 8 : 15;
  const delay = isMobile ? 400 : 300; // 每个烟花之间的延迟（毫秒）
  
  for (let i = 0; i < fireworkCount; i++) {
    setTimeout(() => {
      if (!fireworksCanvas) return;
      const width = fireworksCanvas.width || window.innerWidth;
      const height = fireworksCanvas.height || window.innerHeight;
      const x = Math.random() * width;
      const y = Math.random() * height * 0.6 + height * 0.2;
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

/* ===============================
   手动释放烟花功能
   =============================== */
function releaseFireworks() {
  // 确保canvas已初始化
  if (!fireworksCanvas || !fwCtx) {
    initFireworks();
  }
  
  // 清除之前的动画
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  // 添加按钮点击反馈
  const button = document.querySelector('.firework-button');
  if (button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }
  
  // 创建多个烟花（比自动触发少一些）
  const fireworkCount = isMobile ? 5 : 10;
  const delay = isMobile ? 300 : 200;
  
  for (let i = 0; i < fireworkCount; i++) {
    setTimeout(() => {
      if (!fireworksCanvas) return;
      const width = fireworksCanvas.width || window.innerWidth;
      const height = fireworksCanvas.height || window.innerHeight;
      // 随机位置，但避免在按钮附近
      const x = Math.random() * width;
      const y = Math.random() * height * 0.7 + height * 0.15;
      fireworks.push(new Firework(x, y));
      
      // 如果这是第一个烟花，开始动画循环
      if (i === 0) {
        animateFireworks();
      }
    }, i * delay);
  }
  
  // 添加按钮闪烁效果
  if (button) {
    button.style.animation = 'buttonFlash 0.3s ease';
    setTimeout(() => {
      button.style.animation = '';
    }, 300);
  }
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
   浏览器兼容性检查和优化
   =============================== */
// 检查requestAnimationFrame支持
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 1000 / 60);
  };
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

// 检查padStart支持（IE兼容）
if (!String.prototype.padStart) {
  String.prototype.padStart = function(targetLength, padString) {
    targetLength = targetLength >> 0;
    padString = String(padString || ' ');
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length);
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

/* ===============================
   鼠标跟随粒子效果（桌面端）
   =============================== */
let cursorCanvas, cursorCtx, cursorParticles = [];
let cursorResizeTimeout;
let mouseX = 0, mouseY = 0;

function initCursorTrail() {
  cursorCanvas = document.getElementById('cursor-trail');
  if (!cursorCanvas) return;
  
  // 移动端不启用鼠标跟随效果
  if (isMobile) {
    cursorCanvas.style.display = 'none';
    return;
  }
  
  try {
    cursorCtx = cursorCanvas.getContext('2d');
    if (!cursorCtx) return;
    
    resizeCursorCanvas();
    animateCursor();
    
    // 鼠标移动事件
    document.addEventListener('mousemove', handleMouseMove);
  } catch (e) {
    console.warn('Cursor trail initialization failed:', e);
  }
}

function resizeCursorCanvas() {
  if (!cursorCanvas || !cursorCtx) return;
  
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  cursorCanvas.width = width * dpr;
  cursorCanvas.height = height * dpr;
  cursorCtx.scale(dpr, dpr);
  cursorCanvas.style.width = width + 'px';
  cursorCanvas.style.height = height + 'px';
}

function debounceCursorResize() {
  clearTimeout(cursorResizeTimeout);
  cursorResizeTimeout = setTimeout(resizeCursorCanvas, 150);
}

window.addEventListener('resize', debounceCursorResize);
window.addEventListener('orientationchange', () => {
  setTimeout(resizeCursorCanvas, 200);
});

function handleMouseMove(e) {
  if (isMobile) return;
  
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // 创建跟随粒子（减少数量以提高性能）
  for (let i = 0; i < 2; i++) {
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
  
  // 限制粒子数量
  if (cursorParticles.length > 50) {
    cursorParticles = cursorParticles.slice(-50);
  }
}

function animateCursor() {
  if (!cursorCanvas || !cursorCtx || isMobile) return;
  
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

// DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCursorTrail);
} else {
  initCursorTrail();
}

/* ===============================
   点击涟漪效果（支持触摸）
   =============================== */
function createRipple(x, y) {
  const rippleContainer = document.querySelector('.ripple-container');
  if (rippleContainer) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = ripple.style.height = '20px';
    
    rippleContainer.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 600);
  }
}

// 鼠标点击
document.addEventListener('click', (e) => {
  createRipple(e.clientX, e.clientY);
});

// 触摸事件（移动端）
document.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0];
    createRipple(touch.clientX, touch.clientY);
  }
}, { passive: true });
