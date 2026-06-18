/**
 * FOUNDERY927 — Custom Interactive Cursor
 * Handles smooth dual-element follow, viewport leave/enter,
 * hover states (links, buttons, action items), and magnetic force pull.
 */

import gsap from 'gsap';
import { isTouchDevice, prefersReducedMotion } from './utils.js';

export function initCursor() {
  try {
    /* Disable custom cursor on touch devices or if reduced motion is requested */
    if (isTouchDevice() || prefersReducedMotion()) {
      document.body.classList.add('no-custom-cursor');
      return;
    }

    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    const dot = cursor.querySelector('.cursor__dot');
    const ring = cursor.querySelector('.cursor__ring');

    let mouse = { x: 0, y: 0 };
    let ringPos = { x: 0, y: 0 };

    // Set initial position off-screen
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    cursor.classList.add('cursor--hidden');

    const updateMousePos = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cursor.classList.remove('cursor--hidden');
      
      // Instantly position the central dot
      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.05,
        ease: 'none',
      });
    };

    window.addEventListener('mousemove', updateMousePos);

    // Fade out when leaving the window
    document.addEventListener('mouseleave', () => {
      cursor.classList.add('cursor--hidden');
    });

    document.addEventListener('mouseenter', () => {
      cursor.classList.remove('cursor--hidden');
    });

    // Lerp/Tick function for smooth ring lag
    const tick = () => {
      // Lerp ring position (slower lag factor)
      ringPos.x += (mouse.x - ringPos.x) * 0.15;
      ringPos.y += (mouse.y - ringPos.y) * 0.15;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y,
      });

      requestAnimationFrame(tick);
    };
    tick();

    /* ── 3. Hover Interactions (Links, Buttons, Magnetic Elements) ── */
    const updateHoverStates = () => {
      const links = document.querySelectorAll('a, button, .btn, .magnetic, [data-cursor]');
      
      links.forEach((link) => {
        link.addEventListener('mouseenter', () => {
          cursor.classList.add('cursor--link');
          if (link.classList.contains('btn--primary') || link.dataset.cursor === 'action') {
            cursor.classList.add('cursor--action');
          }
        });

        link.addEventListener('mouseleave', () => {
          cursor.classList.remove('cursor--link', 'cursor--action');
        });
      });
    };
    updateHoverStates();

    // Re-bind when content is dynamically updated (e.g. in case study modal)
    document.addEventListener('contentUpdated', updateHoverStates);

    /* ── 4. Magnetic Hover Effect ── */
    const initMagnetics = () => {
      const magnetics = document.querySelectorAll('.magnetic');

      magnetics.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          // Find distance from mouse to center of the element
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const distanceX = e.clientX - centerX;
          const distanceY = e.clientY - centerY;

          // Pull strength factor
          const strength = el.dataset.magneticStrength || 25;

          gsap.to(el, {
            x: distanceX * (strength / 100),
            y: distanceY * (strength / 100),
            duration: 0.3,
            ease: 'power2.out',
          });

          // Extra pull on the cursor ring
          gsap.to(ring, {
            scale: 1.5,
            duration: 0.3,
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)',
          });

          gsap.to(ring, {
            scale: 1,
            duration: 0.4,
          });
        });
      });
    };
    initMagnetics();
    document.addEventListener('contentUpdated', initMagnetics);

  } catch (err) {
    // Graceful degradation
  }
}
