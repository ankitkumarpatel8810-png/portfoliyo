/**
 * FOUNDERY927 — Global Scroll-Triggered Animations
 *
 * Finds elements with reveal classes and animates them into view
 * using GSAP ScrollTrigger. Respects prefers-reduced-motion.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText, prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  try {
    /* Skip all fancy animations when the user requests reduced motion */
    if (prefersReducedMotion()) {
      document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .split-text, .parallax')
        .forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      return;
    }

    /* ── Reveal Up ───────────────────────────────── */
    gsap.utils.toArray('.reveal-up').forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      const duration = parseFloat(el.dataset.duration) || 1;

      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        },
      });
    });

    /* ── Reveal Left ─────────────────────────────── */
    gsap.utils.toArray('.reveal-left').forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      const duration = parseFloat(el.dataset.duration) || 1;

      gsap.from(el, {
        x: -80,
        opacity: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

    /* ── Reveal Right ────────────────────────────── */
    gsap.utils.toArray('.reveal-right').forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      const duration = parseFloat(el.dataset.duration) || 1;

      gsap.from(el, {
        x: 80,
        opacity: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

    /* ── Reveal Scale ────────────────────────────── */
    gsap.utils.toArray('.reveal-scale').forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      const duration = parseFloat(el.dataset.duration) || 1.2;

      gsap.from(el, {
        scale: 0.85,
        opacity: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

    /* ── Split-Text Reveal ───────────────────────── */
    gsap.utils.toArray('.split-text').forEach((el) => {
      /* Only split elements that haven't already been split by another module */
      if (!el.querySelector('.char')) {
        const { chars } = splitText(el);
        gsap.from(chars, {
          y: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    });

    /* ── Parallax ────────────────────────────────── */
    gsap.utils.toArray('.parallax').forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.3;

      gsap.to(el, {
        y: () => -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  } catch (err) {
    /* Graceful degradation — the page remains usable without animations */
  }
}
