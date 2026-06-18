/**
 * FOUNDERY927 — Services Section
 * Handles interactive radial card lighting effects on hover,
 * dynamically positioning a neon spotlight gradient relative to mouse coordinates.
 */

import { isTouchDevice } from './utils.js';

export function initServices() {
  try {
    const servicesSection = document.getElementById('services');
    if (!servicesSection) return;

    const cards = servicesSection.querySelectorAll('.services__card');

    cards.forEach((card) => {
      const glow = card.querySelector('.services__card-glow');
      if (!glow || isTouchDevice()) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        // Mouse coordinate relative to the card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Reposition radial gradient focal point
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(200, 255, 0, 0.08) 0%, transparent 60%)`;
      });

      card.addEventListener('mouseleave', () => {
        // Reset to top-center when mouse leaves
        glow.style.background = `radial-gradient(circle at 50% 0%, rgba(200, 255, 0, 0.05) 0%, transparent 60%)`;
      });
    });

  } catch (err) {
    // Graceful degradation
  }
}
