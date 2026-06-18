/**
 * FOUNDERY927 — Portfolio / Selected Work
 * Handles selection transitions and triggers the immersive case study modal.
 */

import { openCaseStudy } from './casestudy.js';

export function initWork() {
  try {
    const workSection = document.getElementById('work');
    if (!workSection) return;

    const cards = workSection.querySelectorAll('.work__card');

    cards.forEach((card) => {
      const projectId = card.dataset.project;
      if (!projectId) return;

      // Handle card click to open fullscreen case study modal
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openCaseStudy(projectId);
      });
    });

  } catch (err) {
    // Graceful degradation
  }
}
