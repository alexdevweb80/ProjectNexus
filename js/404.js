/**
 * 404.js — Page 404 / Site en construction
 * ------------------------------------------
 * Matrix rain canvas + glitch scan line effect
 * specific to the 404 page.
 */

/* ── Matrix Rain (same engine as background.js) ── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ0123456789<>{}[]|/\\!@#$%';
  const FONT_SIZE = 13;

  let W, H, cols, drops;

  function resize() {
    W     = canvas.width  = window.innerWidth;
    H     = canvas.height = window.innerHeight;
    cols  = Math.floor(W / FONT_SIZE);
    drops = Array(cols).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(5, 10, 19, 0.07)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = FONT_SIZE + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char     = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x        = i * FONT_SIZE;
      const progress = drops[i] / (H / FONT_SIZE);

      if (drops[i] * FONT_SIZE < H && Math.random() > 0.95) {
        ctx.fillStyle = '#00ffe7';
      } else {
        const g = Math.floor((1 - progress) * 80);
        ctx.fillStyle = `rgba(0, ${g + 80}, ${g + 100}, ${0.15 + (1 - progress) * 0.3})`;
      }

      ctx.fillText(char, x, drops[i] * FONT_SIZE);

      if (drops[i] * FONT_SIZE > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
})();

/* ── Horizontal glitch scan line that sweeps periodically ── */
(function () {
  let lastGlitch = 0;

  function scheduleGlitch() {
    // Random interval between 3s and 8s
    const delay = 3000 + Math.random() * 5000;
    setTimeout(runGlitch, delay);
  }

  function runGlitch() {
    const el = document.querySelector('.error-code');
    if (el) {
      el.classList.add('glitch-active');
      setTimeout(() => {
        el.classList.remove('glitch-active');
        scheduleGlitch();
      }, 600);
    }
  }

  scheduleGlitch();
})();

/* ── Typing countdown in the terminal block ── */
(function () {
  const cursor = document.getElementById('t-cursor');
  if (!cursor) return;

  const messages = [
    'Lancement imminent...',
    'Chargement des modules...',
    'Initialisation système...',
  ];

  let idx = 0;
  function cycle() {
    cursor.textContent = messages[idx % messages.length];
    idx++;
    setTimeout(cycle, 2800);
  }
  setTimeout(cycle, 3200);
})();
