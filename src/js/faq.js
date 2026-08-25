/**
 * FRAMEON — FAQ Accordion
 * Manages accordion toggle, smooth expansion, and accessibility aria states.
 */

export function initFaq() {
  try {
    const faqSection = document.getElementById('faq');
    if (!faqSection) return;

    const items = faqSection.querySelectorAll('.faq__item');

    items.forEach((item) => {
      const button = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');

      if (!button || !answer) return;

      button.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('faq__item--active');

        // Close other accordion items
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('faq__item--active');
            const otherBtn = otherItem.querySelector('.faq__question');
            const otherAns = otherItem.querySelector('.faq__answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle clicked accordion item
        if (isOpen) {
          item.classList.remove('faq__item--active');
          button.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('faq__item--active');
          button.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });

  } catch (err) {
    // Graceful degradation
  }
}
