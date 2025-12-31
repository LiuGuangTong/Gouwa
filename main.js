/* ===============================
   Frontend Password Gate + Light Animation
   =============================== */
function unlock() {
  const input = document.getElementById('pw').value;
  if (input === '201605') { // 正确密码
    const gate = document.getElementById('gate');
    
    // 1️⃣ 移除密码门
    gate.remove();
    
    // 2️⃣ 触发光环淡入 + 呼吸动画
    const ring = document.querySelector('.time-ring');
    ring.classList.add('active');

  } else {
    alert('Incorrect. Remember the date you met.');
  }
}

/* ===============================
   Time System
   =============================== */
const systemStart = new Date('2016-05-01T00:00:00');
const newYear = new Date('2026-01-01T00:00:00');

function updateNewYearCountdown() {
  const now = Date.now();
  let diff = newYear - now;

  if (diff <= 0) {
    document.querySelector('.countdown').style.display = 'none';
    document.querySelector('.time-ring').classList.add('active');
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  document.getElementById('days').innerText = d;
  document.getElementById('hours').innerText = h;
  document.getElementById('minutes').innerText = m;
  document.getElementById('seconds').innerText = s;
}

function updateTimeSystem() {
  let diff = Math.floor((Date.now() - systemStart) / 1000);

  document.getElementById('ts-days').innerText = Math.floor(diff / 86400);
  diff %= 86400;
  document.getElementById('ts-hours').innerText = Math.floor(diff / 3600);
  diff %= 3600;
  document.getElementById('ts-minutes').innerText = Math.floor(diff / 60);
  document.getElementById('ts-seconds').innerText = diff % 60;
}

setInterval(() => {
  updateNewYearCountdown();
  updateTimeSystem();
}, 1000);

/* ===============================
   Background Stars
   =============================== */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.2 + 0.2,
  v: Math.random() * 0.15 + 0.05
}));

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(180,220,255,0.6)';
  stars.forEach(s => {
    s.y -= s.v;
    if (s.y < 0) s.y = canvas.height;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
})();

// System online since May 2016. No shutdown planned.
