/**
 * FOUNDERY927 — Horizontal Process Timeline
 * Implements a premium horizontal timeline: desktop scrolls vertically
 * but pins the viewport, translating the timeline cards horizontally.
 * Degrades to native swipe/scroll on touch/mobile devices.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isTouchDevice } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initProcess() {
  try {
    const processSection = document.getElementById('process');
    if (!processSection) return;

    const track = processSection.querySelector('.process__track');
    const progressFill = processSection.querySelector('.process__progress-fill');
    
    if (!track) return;

    if (prefersReducedMotion() || isTouchDevice()) {
      // Mobile / Reduced Motion: Let native CSS overflow scroll handle it
      track.style.overflowX = 'auto';
      track.style.cursor = 'grab';
      
      // Basic drag-to-scroll implementation for desktop non-animation users
      let isDown = false;
      let startX;
      let scrollLeft;

      track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });
      track.addEventListener('mouseleave', () => { isDown = false; });
      track.addEventListener('mouseup', () => { isDown = false; });
      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
      });
      return;
    }

    /* ── Horizontal Scroll Pin (Desktop) ── */
    const getScrollAmount = () => {
      let trackWidth = track.scrollWidth;
      let windowWidth = window.innerWidth;
      // We want to translate by the difference
      return -(trackWidth - windowWidth + clamp(20, windowWidth * 0.05, 80));
    };

    const scrollAmount = getScrollAmount();

    // Horizontal Translate Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: processSection,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + 300}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true, // handles resize
      }
    });

    tl.to(track, {
      x: () => getScrollAmount(),
      ease: 'none',
    });

    // Update progress bar
    if (progressFill) {
      ScrollTrigger.create({
        trigger: processSection,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + 300}`,
        scrub: true,
        onUpdate: (self) => {
          gsap.to(progressFill, {
            width: `${self.progress * 100}%`,
            duration: 0.1,
            ease: 'none',
          });
        }
      });
    }

  } catch (err) {
    // Graceful degradation
  }
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
