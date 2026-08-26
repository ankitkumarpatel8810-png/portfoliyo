/**
 * FRAMEON — Portfolio / Selected Work Category Engine
 * Handles smooth section scrolling between categories and case study triggers.
 */

import { openCaseStudy } from './casestudy.js';

export function initWork() {
  try {
    const workSection = document.getElementById('work');
    if (!workSection) return;

    // Attach case study triggers to project cards (except direct anchor links)
    const cards = workSection.querySelectorAll('.work__card');
    cards.forEach((card) => {
      if (card.tagName.toLowerCase() === 'a' && card.hasAttribute('href')) return;
      
      const projectId = card.dataset.project;
      if (!projectId) return;

      card.addEventListener('click', (e) => {
        e.preventDefault();
        openCaseStudy(projectId);
      });
    });

    // Handle Category Navigation Smooth Scroll & Active Pill Switching
    const navItems = workSection.querySelectorAll('.work__nav-item');
    navItems.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        if (!targetId) return;

        // Update active state
        navItems.forEach(item => item.classList.remove('active'));
        btn.classList.add('active');

        // Smooth scroll to target category section
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

  } catch (err) {
    // Graceful degradation
  }
}
