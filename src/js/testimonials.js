/**
 * FOUNDERY927 — Testimonials Carousel
 * Animates slide transitions using GSAP. Supports automatic rotation,
 * dot navigation, and hover pauses.
 */

import gsap from 'gsap';
import { prefersReducedMotion } from './utils.js';

export function initTestimonials() {
  try {
    const section = document.getElementById('testimonials');
    if (!section) return;

    const track = section.querySelector('.testimonials__track');
    const slides = section.querySelectorAll('.testimonials__slide');
    const dots = section.querySelectorAll('.testimonials__dot');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    let autoplayTimer;
    const intervalTime = 6000; // 6 seconds per slide

    const goToSlide = (index) => {
      if (index === currentSlide) return;

      const prevSlide = slides[currentSlide];
      const nextSlide = slides[index];

      // Fade out previous slide elements
      if (!prefersReducedMotion()) {
        const prevQuote = prevSlide.querySelector('.testimonials__quote');
        const prevAuthor = prevSlide.querySelector('.testimonials__author');

        gsap.to([prevQuote, prevAuthor], {
          y: -20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.in',
        });

        // Translate track
        gsap.to(track, {
          x: `-${index * 100}%`,
          duration: 0.85,
          ease: 'power3.inOut',
          delay: 0.15,
          onComplete: () => {
            // Animate next slide elements in
            const nextQuote = nextSlide.querySelector('.testimonials__quote');
            const nextAuthor = nextSlide.querySelector('.testimonials__author');
            
            gsap.set([nextQuote, nextAuthor], { y: 20, opacity: 0 });
            gsap.to([nextQuote, nextAuthor], {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power3.out',
            });
          }
        });
      } else {
        // Flat instant jump
        track.style.transform = `translateX(-${index * 100}%)`;
      }

      // Update dot active states
      dots.forEach((dot) => {
        const active = parseInt(dot.dataset.slide) === index;
        dot.classList.toggle('testimonials__dot--active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      currentSlide = index;
    };

    // Dot click triggers
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.slide);
        goToSlide(index);
        resetAutoplay();
      });
    });

    // Autoplay functions
    const startAutoplay = () => {
      autoplayTimer = setInterval(() => {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
      }, intervalTime);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      startAutoplay();
    };

    // Pause autoplay on hover
    section.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    section.addEventListener('mouseleave', startAutoplay);

    // Initial setup: position slides side-by-side
    track.style.display = 'flex';
    slides.forEach(slide => {
      slide.style.flexShrink = '0';
    });

    startAutoplay();

  } catch (err) {
    // Graceful degradation
  }
}
