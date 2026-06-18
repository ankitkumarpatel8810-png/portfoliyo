/**
 * FOUNDERY927 — Team Cards Interaction
 * Implements a premium 3D tilt/hover parallax effect on team cards.
 * Responds to mouse coordinate rotation angles and resets smoothly on leave.
 */

import gsap from 'gsap';
import { isTouchDevice, prefersReducedMotion } from './utils.js';

export function initTeam() {
  try {
    const teamSection = document.getElementById('team');
    if (!teamSection) return;

    const cards = teamSection.querySelectorAll('.team__card');

    if (isTouchDevice() || prefersReducedMotion()) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Center coordinates of the card
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;

        // Mouse offsets from the center of the card
        const offsetX = (e.clientX - cardX) / (rect.width / 2);
        const offsetY = (e.clientY - cardY) / (rect.height / 2);

        // Calculate rotation angles (max 10 degrees)
        const rotateY = offsetX * 10;
        const rotateX = -offsetY * 10;

        // Apply 3D tilt transform
        gsap.to(card, {
          rotateY: rotateY,
          rotateX: rotateX,
          transformPerspective: 800,
          ease: 'power1.out',
          duration: 0.3,
        });

        // Translate the image wrapper slightly opposite for parallax depth
        const image = card.querySelector('.team__card-image');
        if (image) {
          gsap.to(image, {
            x: -offsetX * 6,
            y: -offsetY * 6,
            duration: 0.3,
            ease: 'power1.out',
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        // Reset card rotation
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
        });

        // Reset image offset
        const image = card.querySelector('.team__card-image');
        if (image) {
          gsap.to(image, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)',
          });
        }
      });
    });

  } catch (err) {
    // Graceful degradation
  }
}
