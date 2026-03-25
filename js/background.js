/**
 * background.js — Matrix Rain Canvas Animation
 * -----------------------------------------------
 * Renders an animated matrix-style character rain on a
 * full-screen fixed canvas element (#bg-canvas).
 * Uses neon cyan gradient tones to match the cyberpunk theme.
 */

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  // Characters used in the rain (latin + katakana + symbols)
  const CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ0123456789<>{}[]|/\\!@#$%';
  const FONT_SIZE = 13; // px

  let W, H, cols, drops;

  /**
   * Resize canvas to fill the viewport.
   * Resets column drop positions.
   */
  function resize() {
    W    = canvas.width  = window.innerWidth;
    H    = canvas.height = window.innerHeight;
    cols  = Math.floor(W / FONT_SIZE);
    drops = Array(cols).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  /**
   * Draw one frame of the matrix rain.
   * Called every 50ms via setInterval.
   */
  function draw() {
    // Semi-transparent overlay creates the fade/trail effect
    ctx.fillStyle = 'rgba(5, 10, 19, 0.07)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = FONT_SIZE + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char     = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x        = i * FONT_SIZE;
      const progress = drops[i] / (H / FONT_SIZE);

      // Lead character: bright cyan flash (5% chance)
      if (drops[i] * FONT_SIZE < H && Math.random() > 0.95) {
        ctx.fillStyle = '#00ffe7';
      } else {
        // Tail: fade from bright to dark as progress goes down
        const g = Math.floor((1 - progress) * 80);
        ctx.fillStyle = `rgba(0, ${g + 80}, ${g + 100}, ${0.15 + (1 - progress) * 0.3})`;
      }

      ctx.fillText(char, x, drops[i] * FONT_SIZE);

      // Reset drop to top after leaving screen (with randomness)
      if (drops[i] * FONT_SIZE > H && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  // Run at ~20fps for a subtle, non-distracting effect
  setInterval(draw, 50);
})();
