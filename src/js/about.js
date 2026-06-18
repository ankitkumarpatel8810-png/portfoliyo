/**
 * FOUNDERY927 — About Section Stats Counter
 * Animates numerical indicators (e.g. awards, client retention)
 * in the About section when scrolled into view.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initAbout() {
  try {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const numbers = aboutSection.querySelectorAll('.about__metric-number');
    
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
        duration: 2,
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
