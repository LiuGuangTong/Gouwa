window.addEventListener('DOMContentLoaded', () => { 
    // ================= Canvas 设置 =================
    const bgCanvas = document.getElementById('background-particles');
    const fwCanvas = document.getElementById('fireworks');
    const bgCtx = bgCanvas.getContext('2d');
    const fwCtx = fwCanvas.getContext('2d');

    function resizeCanvas() {
        bgCanvas.width = fwCanvas.width = window.innerWidth;
        bgCanvas.height = fwCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ================= 背景微粒 =================
    let particles = [];
    const particleCount = 120;

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: random(0, bgCanvas.width),
                y: random(0, bgCanvas.height),
                radius: random(1, 3),
                color: Math.random() > 0.5 
                    ? 'rgba(245,230,200,0.4)' 
                    : 'rgba(215,184,255,0.4)',
                speedX: random(-0.2, 0.2),
                speedY: random(-0.1, 0.1)
            });
        }
    }
    initParticles();

    function drawParticles() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        particles.forEach(p => {
            bgCtx.beginPath();
            bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            bgCtx.fillStyle = p.color;
            bgCtx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = bgCanvas.width;
            if (p.x > bgCanvas.width) p.x = 0;
            if (p.y < 0) p.y = bgCanvas.height;
            if (p.y > bgCanvas.height) p.y = 0;
        });
    }

    // ================= 烟花 =================
    let fireworks = [];

    function hexToRgb(hex) {
        let m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        return m 
            ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` 
            : '255,255,255';
    }

    function createFirework(x, y) {
        const colors = ['#FFD700', '#FF69B4', '#FF4500'];
        for (let i = 0; i < 40; i++) {
            fireworks.push({
                x,
                y,
                radius: random(1, 3),
                color: colors[Math.floor(random(0, colors.length))],
                speedX: random(-3, 3),
                speedY: random(-3, 3),
                alpha: 1,
                decay: random(0.003, 0.008)
            });
        }
    }

    function drawFireworks() {
        fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const p = fireworks[i];
            fwCtx.beginPath();
            fwCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            fwCtx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
            fwCtx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= p.decay;
            if (p.alpha <= 0) fireworks.splice(i, 1);
        }
    }

    // ================= 动画循环 =================
    function animate() {
        drawParticles();
        drawFireworks();
        requestAnimationFrame(animate);
    }
    animate();

    // ================= 点击触发烟花 =================
    document.getElementById('firework-button').addEventListener('click', () => {
        createFirework(
            random(100, fwCanvas.width - 100), 
            random(100, fwCanvas.height - 100)
        );
    });

    // ================= 当前时间显示（新的一年 · 共赴山海） =================
    function updateCurrentTime() {
        const now = new Date();

        const year  = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day   = String(now.getDate()).padStart(2, '0');
        const hour  = String(now.getHours()).padStart(2, '0');
        const min   = String(now.getMinutes()).padStart(2, '0');
        const sec   = String(now.getSeconds()).padStart(2, '0');

        // 复用原有 DOM，不破坏结构
        document.getElementById('days').textContent    = `${year}-${month}-${day}`;
        document.getElementById('hours').textContent   = hour;
        document.getElementById('minutes').textContent = min;
        document.getElementById('seconds').textContent = sec;
    }

    setInterval(updateCurrentTime, 1000);
    updateCurrentTime();
});
