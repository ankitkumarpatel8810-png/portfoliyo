/**
 * FOUNDERY927 — Navigation
 *
 * Handles:
 * 1. Scroll-aware show/hide + glassmorphic state
 * 2. Smooth-scroll to section anchors via Lenis
 * 3. Mobile hamburger menu with GSAP transitions
 * 4. Active link highlighting via ScrollTrigger
 * 5. Magnetic hover effect on desktop nav links
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isTouchDevice, lerp } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initNavigation() {
  try {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const hamburger = nav.querySelector('.hamburger');
    const overlay = document.querySelector('.nav-mobile__overlay');
    const mobileLinks = overlay ? overlay.querySelectorAll('.nav-mobile__link') : [];
    const navLinks = nav.querySelectorAll('.nav__link');
    const allAnchors = document.querySelectorAll('.nav__link, .nav-mobile__link, .nav__logo, .nav__cta, .footer__link, .footer__logo, .footer__back-to-top');

    let lastScrollY = 0;
    let mobileOpen = false;

    /* ─── 1. Scroll-Aware Nav ──────────────────── */
    ScrollTrigger.create({
      start: 'top -100',
      end: 99999,
      onUpdate: (self) => {
        const scrollY = self.scroll();
        const direction = self.direction; // 1 = down, -1 = up

        /* Glassmorphic background when past threshold */
        nav.classList.toggle('nav--scrolled', scrollY > 100);

        /* Hide on scroll down, show on scroll up (don't hide when mobile menu is open) */
        if (!mobileOpen) {
          if (direction === 1 && scrollY > 200) {
            nav.classList.add('nav--hidden');
          } else {
            nav.classList.remove('nav--hidden');
          }
        }

        lastScrollY = scrollY;
      },
    });

    /* ─── 2. Smooth Scroll to Sections ─────────── */
    allAnchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        /* Close mobile nav first if open */
        if (mobileOpen) closeMobileNav();

        /* Use Lenis for buttery smooth scroll */
        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
          window.lenis.scrollTo(target, { offset: 0, duration: 1.5 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ─── 3. Mobile Hamburger Menu ─────────────── */
    function openMobileNav() {
      mobileOpen = true;
      hamburger.classList.add('hamburger--active');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.setAttribute('aria-hidden', 'false');
      overlay.classList.add('nav-mobile__overlay--active');
      nav.classList.remove('nav--hidden');

      /* Lock scroll */
      if (window.lenis && typeof window.lenis.stop === 'function') window.lenis.stop();
      document.body.style.overflow = 'hidden';

      /* Animate overlay in */
      gsap.to(overlay, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.6,
        ease: 'power3.inOut',
      });

      /* Stagger links */
      gsap.from(mobileLinks, {
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.3,
      });
    }

    function closeMobileNav() {
      mobileOpen = false;
      hamburger.classList.remove('hamburger--active');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('nav-mobile__overlay--active');

      gsap.to(overlay, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          overlay.setAttribute('aria-hidden', 'true');
          /* Unlock scroll */
          document.body.style.overflow = '';
          if (window.lenis && typeof window.lenis.start === 'function') window.lenis.start();
        },
      });
    }

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        mobileOpen ? closeMobileNav() : openMobileNav();
      });
    }

    /* ─── 4. Active Link Highlighting ──────────── */
    const sections = ['hero', 'work', 'services', 'process', 'about', 'testimonials', 'faq'];
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => setActiveLink(id),
        onEnterBack: () => setActiveLink(id),
      });
    });

    function setActiveLink(id) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('nav__link--active', href === `#${id}`);
      });
    }

    /* ─── 5. Magnetic Effect on Desktop ────────── */
    if (!isTouchDevice() && !prefersReducedMotion()) {
      const magneticEls = nav.querySelectorAll('.magnetic');

      magneticEls.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: 'power2.out',
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1.2, 0.4)',
          });
        });
      });
    }
  } catch {
    /* Navigation still works without JS enhancements */
  }
}
