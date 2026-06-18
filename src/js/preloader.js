/**
 * FOUNDERY927 — Preloader
 *
 * Animates a loading counter from 0–100%, fills the progress bar,
 * then reveals the page with a cinematic exit animation.
 * Returns a Promise so main.js can await it before starting scroll.
 */

import gsap from 'gsap';
import { prefersReducedMotion } from './utils.js';

export function initPreloader() {
  return new Promise((resolve) => {
    try {
      const preloader = document.getElementById('preloader');
      if (!preloader) { resolve(); return; }

      const logo = preloader.querySelector('.preloader__logo');
      const counter = preloader.querySelector('.preloader__counter');
      const barFill = preloader.querySelector('.preloader__bar-fill');

      /* For users who prefer reduced motion, skip the show entirely */
      if (prefersReducedMotion()) {
        preloader.remove();
        resolve();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          preloader.remove();
          resolve();
        },
      });

      /* Phase 1 — Count from 0 to 100 and fill the bar (≈1.8s) */
      const counterObj = { value: 0 };
      tl.to(counterObj, {
        value: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        snap: { value: 1 },              // integer steps only
        onUpdate: () => {
          counter.textContent = `${Math.round(counterObj.value)}%`;
        },
      }, 0);

      tl.to(barFill, {
        scaleX: 1,
        duration: 1.8,
        ease: 'power2.inOut',
        transformOrigin: 'left center',
      }, 0);

      /* Phase 2 — Pause briefly so the user registers 100% */
      tl.to({}, { duration: 0.3 });

      /* Phase 3 — Exit: fade logo & counter upward, then wipe out background */
      tl.to([logo, counter, barFill.parentElement], {
        y: -30,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        stagger: 0.05,
      });

      tl.to(preloader, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.8,
        ease: 'power4.inOut',
      }, '-=0.2');

    } catch {
      /* If anything fails, remove the preloader so the site is still usable */
      const el = document.getElementById('preloader');
      if (el) el.remove();
      resolve();
    }
  });
}
