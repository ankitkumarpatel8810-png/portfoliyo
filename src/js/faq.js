/**
 * FOUNDERY927 — FAQ Accordion
 * Handles accordion expansion with smooth height transitions via GSAP
 * and manages accessibility (aria) states.
 */

import gsap from 'gsap';

export function initFaq() {
  try {
    const faqSection = document.getElementById('faq');
    if (!faqSection) return;

    const items = faqSection.querySelectorAll('.faq__item');

    items.forEach((item) => {
      const button = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');
      const icon = item.querySelector('.faq__icon');

      if (!button || !answer) return;

      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq__item--active');

        // Close other items
        items.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains('faq__item--active')) {
            const otherButton = otherItem.querySelector('.faq__question');
            const otherAnswer = otherItem.querySelector('.faq__answer');
            const otherIcon = otherItem.querySelector('.faq__icon');

            otherItem.classList.remove('faq__item--active');
            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
            if (otherAnswer) {
              otherAnswer.setAttribute('aria-hidden', 'true');
              gsap.to(otherAnswer, { height: 0, duration: 0.35, ease: 'power2.out' });
            }
            if (otherIcon) {
              gsap.to(otherIcon, { rotate: 0, duration: 0.3, ease: 'power2.out' });
            }
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('faq__item--active');
          button.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
          gsap.to(answer, { height: 0, duration: 0.35, ease: 'power2.out' });
          if (icon) gsap.to(icon, { rotate: 0, duration: 0.3 });
        } else {
          item.classList.add('faq__item--active');
          button.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
          // Animate height to auto
          gsap.fromTo(answer, 
            { height: 0 }, 
            { height: 'auto', duration: 0.45, ease: 'power2.out' }
          );
          if (icon) gsap.to(icon, { rotate: 45, duration: 0.3 });
        }
      });
    });

  } catch (err) {
    // Graceful degradation
  }
}
