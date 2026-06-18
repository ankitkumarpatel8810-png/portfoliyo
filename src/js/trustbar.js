/**
 * FOUNDERY927 — Trust Bar & Stats Counter
 * Animates the infinite brand marquee and triggers the numerical count-up
 * on statistical items when scrolled into viewport using GSAP.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initTrustBar() {
  try {
    const trustBar = document.getElementById('trust-bar');
    if (!trustBar) return;

    /* ── 1. Infinite Logo Marquee ── */
    const track = trustBar.querySelector('.trust-bar__track');
    if (track && !prefersReducedMotion()) {
      // Loop the track infinitely using GSAP
      // Calculate half width since it's duplicated
      const trackWidth = track.scrollWidth / 2;
      
      gsap.to(track, {
        x: -trackWidth,
        duration: 35, // Adjust speed
        ease: 'none',
        repeat: -1,
      });
    }

    /* ── 2. Scroll-Triggered Stats Counter ── */
    const numbers = trustBar.querySelectorAll('.trust-bar__stat-number');
    
    if (prefersReducedMotion()) {
      numbers.forEach((num) => {
        const target = num.dataset.target || '0';
        const suffix = num.dataset.suffix || '';
        num.textContent = `${target}${suffix}`;
      });
      return;
    }

    numbers.forEach((num) => {
      const targetVal = parseFloat(num.dataset.target) || 0;
      const suffix = num.dataset.suffix || '';
      
      const countObj = { value: 0 };
      
      gsap.to(countObj, {
        value: targetVal,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: num,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          num.textContent = `${Math.floor(countObj.value)}${suffix}`;
        },
        onComplete: () => {
          num.textContent = `${targetVal}${suffix}`;
        }
      });
    });

  } catch (err) {
    // Graceful degradation
  }
}
