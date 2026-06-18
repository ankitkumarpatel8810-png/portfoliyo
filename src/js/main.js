/**
 * FOUNDERY927 — Main Script Entry Point
 * Handles smooth scrolling configuration, imports styles, and coordinates page boots.
 */

// Stylesheets
import '../styles/base.css';
import '../styles/typography.css';
import '../styles/layout.css';
import '../styles/components.css';
import '../styles/animations.css';
import '../styles/sections.css';
import 'lenis/dist/lenis.css';

// Libraries
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Modules
import { initPreloader } from './preloader.js';
import { initNavigation } from './navigation.js';
import { initHero } from './hero.js';
import { initCursor } from './cursor.js';
import { initTrustBar } from './trustbar.js';
import { initWork } from './work.js';
import { initCaseStudy } from './casestudy.js';
import { initServices } from './services.js';
import { initProcess } from './process.js';
import { initAbout } from './about.js';
import { initTeam } from './team.js';
import { initTestimonials } from './testimonials.js';
import { initAwards } from './awards.js';
import { initFaq } from './faq.js';
import { initAnimations } from './animations.js';
import { prefersReducedMotion } from './utils.js';
import { applyCMSContent } from './cms.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Apply CMS draft/published overrides before animations register
  applyCMSContent();

  let lenisInstance = null;

  // Initialize Lenis Smooth Scroll (skipped if prefersReducedMotion is active)
  if (false && !prefersReducedMotion()) {
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
    });

    window.lenis = lenisInstance;

    // Synchronize Lenis scroll positions with GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Start Preloader Counter
  initPreloader().then(() => {
    try {
      // Reveal main page & Enable Scroll interactions
      const mainWrapper = document.querySelector('main');
      if (mainWrapper) {
        mainWrapper.style.visibility = 'visible';
      }

      // Initialize all custom components & scroll animations
      initNavigation();
      initHero();
      initCursor();
      initTrustBar();
      initWork();
      initCaseStudy();
      initServices();
      initProcess();
      initAbout();
      initTeam();
      initTestimonials();
      initAwards();
      initFaq();
      
      // Global reveal classes (ScrollTrigger transitions)
      initAnimations();

      // Trigger updates to calculate sizes correctly after preloader leaves
      setTimeout(() => {
        ScrollTrigger.refresh();
        if (lenisInstance) lenisInstance.resize();
      }, 150);
    } catch (err) {
      alert("Error inside main initializers:\n" + err.message + "\nStack:\n" + err.stack);
    }
  });
});
