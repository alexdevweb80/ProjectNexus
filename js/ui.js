/**
 * ui.js — UI Interactions & Animations
 * ----------------------------------------
 * Handles:
 *  - Mobile nav hamburger toggle
 *  - Hacker typing effect in the hero
 *  - Scroll-based fade-in (IntersectionObserver)
 *  - Skill bar progress animation
 *  - Parallax shift on project cards
 */


/* ================================================================
   0. INITIALIZATION
   ================================================================ */
window.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});


/* ================================================================
   1. MOBILE NAV TOGGLE
   ================================================================ */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  // Open / close the nav drawer
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Auto-close the drawer when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();


/* ================================================================
   2. HACKER TYPING EFFECT
   ================================================================ */
(function () {
  const phrases = [
    'Développeur Front-End',
    'Passionné de Cybersécurité',
    'Hacker Éthique',
    "Builder d'interfaces futuristes",
    'CTF Player',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;

  const el = document.getElementById('typing-text');

  function type() {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      // Typing forward
      el.textContent = phrase.slice(0, ++charIndex);

      if (charIndex === phrase.length) {
        // Pause at end before deleting
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      // Deleting backward
      el.textContent = phrase.slice(0, --charIndex);

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    // Deleting is faster than typing
    const delay = deleting ? 55 : 90;
    setTimeout(type, delay);
  }

  type();
})();


/* ================================================================
   3. SCROLL ANIMATIONS — IntersectionObserver
   Adds `.visible` class when cards enter the viewport,
   triggering CSS fade-up transitions and skill bar widths.
   ================================================================ */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('visible');
      });
    },
    { threshold: 0.15 }
  );

  // Observe all skill and project cards
  document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    observer.observe(el);
  });
})();


/* ================================================================
   4. PARALLAX — Project Cards
   Applies a subtle vertical offset to each card based on
   its distance from the viewport center.
   Uses requestAnimationFrame for smooth, performant rendering.
   Touch-safe: uses `passive: true` on the scroll listener.
   ================================================================ */
(function () {
  let ticking = false;

  function applyParallax() {
    document.querySelectorAll('.project-card').forEach((card, i) => {
      // Only apply once the card is visible (avoids layout jump on load)
      if (!card.classList.contains('visible')) return;

      const rect   = card.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;

      // Alternate direction for odd/even cards
      const direction = i % 2 === 0 ? 1 : -1;
      const offset    = center * 0.05 * direction;

      // Apply as CSS custom property (can be used in CSS if needed)
      card.style.setProperty('--parallax-y', offset + 'px');
    });

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    },
    { passive: true } // Safe for mobile touch scroll
  );
})();
