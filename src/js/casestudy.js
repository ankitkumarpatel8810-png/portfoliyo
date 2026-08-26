/**
 * FRAMEON — Cinematic Case Study Modal
 * Dynamically loads project details, populates hero image covers, and handles fullscreen modal reveals.
 */

import gsap from 'gsap';
import { prefersReducedMotion } from './utils.js';

// Map project IDs to default cover image paths
const projectImageMap = {
  'personal-brand': '/video-editing-cover.jpg',
  'youtube-creator': '/yt-doc-cover.jpg',
  'ecommerce': '/brand-creative-spotify.jpg',
  'podcast': '/reel-cover.jpg',
  'startup': '/brand-creative-poster.jpg'
};

// Fallback seed projects for FRAMEON creative portfolio
const defaultProjects = [
  {
    id: 'personal-brand',
    title: 'PERSONAL BRAND',
    category: 'Short-Form Content System',
    industry: 'Executive & Creator Personal Brands',
    description: 'High-retention short-form video ecosystem designed to capture attention across Reels, Shorts, and TikTok.',
    challenge: "Creating a consistent visual identity and fast-paced editing rhythm while maintaining message clarity and brand authority.",
    strategy: "Engineered a custom motion graphic template system, kinetic captions, precise sound design, and hook-focused framing.",
    results: { totalViews: '25M+', retentionBoost: '+45%', uploadFrequency: 'Daily', viralReels: '18+' },
    color: '#0A0A0A'
  },
  {
    id: 'youtube-creator',
    title: 'YOUTUBE CREATOR',
    category: 'Long-Form Editing + Thumbnail',
    industry: 'Digital Content Creators',
    description: 'End-to-end long-form YouTube editing combined with click-optimised thumbnail design.',
    challenge: "Maintaining viewer retention over 15+ minute long-form videos while standing out in competitive YouTube recommendations.",
    strategy: "Implemented pattern interrupts, custom b-roll pacing, cinematic color grading, and high-CTR visual thumbnail packaging.",
    results: { avgWatchTime: '11m 40s', ctrIncrease: '+6.8%', totalViews: '15M+', subscribers: '+120k' },
    color: '#0A0A0A'
  },
  {
    id: 'ecommerce',
    title: 'E-COMMERCE BRAND',
    category: 'Performance Creative',
    industry: 'Direct-to-Consumer Brands',
    description: 'High-converting video ads and social performance creatives built for paid social campaigns.',
    challenge: "Developing visual ad creatives that stop scrolling within the first 2 seconds and drive measurable ROAS.",
    strategy: "Combined hook-testing frameworks, dynamic product callouts, customer reaction cuts, and clear motion CTAs.",
    results: { roasIncrease: '3.4x', hookRate: '58%', adSpendManaged: '$500k+', conversions: 'High' },
    color: '#0A0A0A'
  },
  {
    id: 'podcast',
    title: 'PODCAST',
    category: 'Content Repurposing',
    industry: 'Podcasts & Broadcast Shows',
    description: 'Transforming full-length audio and video podcast episodes into multi-platform content assets.',
    challenge: "Maximising reach from single podcast episodes across all major digital channels with minimal client effort.",
    strategy: "Extracted high-impact quotes, generated audiograms, engineered viral short clips, and created promotional thumbnail suites.",
    results: { assetsPerEpisode: '15+', channelGrowth: '+210%', monthlyReach: '5M+', turnAround: '48 Hours' },
    color: '#0A0A0A'
  },
  {
    id: 'startup',
    title: 'STARTUP',
    category: 'Motion & Brand Visuals',
    industry: 'Tech & SaaS Startups',
    description: 'Product demo videos, kinetic motion design, and launch visual packaging for modern startups.',
    challenge: "Communicating complex technical software features in a sleek, visually engaging 60-second launch video.",
    strategy: "Designed 3D/2D UI product animations, smooth vector transitions, and high-energy motion typography.",
    results: { launchViews: '2M+', signupsGenerated: '15k+', featureInclusions: 'Top Tech Media', qualityScore: '10/10' },
    color: '#0A0A0A'
  }
];

export function initCaseStudy() {
  try {
    const modal = document.getElementById('case-study');
    if (!modal) return;

    const closeBtn = modal.querySelector('.case-study__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCaseStudy);
    }

    // Close on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeCaseStudy();
      }
    });

  } catch (err) {
    // Graceful degradation
  }
}

export function openCaseStudy(projectId, customImageSrc = null) {
  try {
    const modal = document.getElementById('case-study');
    if (!modal) return;

    // Load projects list
    let projects = defaultProjects;
    try {
      const cmsData = localStorage.getItem('foundery927_admin');
      if (cmsData) {
        const parsed = JSON.parse(cmsData);
        if (parsed.projects && parsed.projects.length > 0) {
          projects = parsed.projects;
        }
      }
    } catch (e) {
      // Graceful fallback
    }

    const project = projects.find(p => p.id === projectId) || defaultProjects[0];

    // Populate Fields
    const titleEl = modal.querySelector('.case-study__title');
    const categoryEl = modal.querySelector('.case-study__category');
    const descEl = modal.querySelector('.case-study__description');
    const challengeEl = modal.querySelector('.case-study__challenge');
    const strategyEl = modal.querySelector('.case-study__strategy');
    const metricsEl = modal.querySelector('.case-study__metrics');
    const heroEl = modal.querySelector('.case-study__hero');
    const heroImgEl = modal.querySelector('.case-study__hero-img');

    if (titleEl) titleEl.textContent = project.title;
    if (categoryEl) categoryEl.textContent = `${project.category} · ${project.industry || 'Selected Work'}`;
    if (descEl) descEl.textContent = project.description;
    if (challengeEl) challengeEl.textContent = project.challenge || 'Details coming soon.';
    if (strategyEl) strategyEl.textContent = project.strategy || 'Strategy details coming soon.';

    // Populate Hero Image Cover
    if (heroImgEl) {
      const coverSrc = customImageSrc || projectImageMap[projectId] || '/reel-cover.jpg';
      heroImgEl.src = coverSrc;
    }

    if (heroEl) {
      heroEl.style.backgroundColor = '#0A0A0A';
    }

    // Populate metrics
    if (metricsEl) {
      metricsEl.innerHTML = '';
      if (project.results) {
        Object.entries(project.results).forEach(([label, val]) => {
          const item = document.createElement('div');
          item.className = 'case-study__metric';
          item.innerHTML = `
            <span class="case-study__metric-number">${val}</span>
            <span class="case-study__metric-label">${label.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
          `;
          metricsEl.appendChild(item);
        });
      }
    }

    // Update accessibility attributes & block body scroll
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.classList.add('case-study__overlay--active');

    // Cinematic clip-path entrance reveal
    if (!prefersReducedMotion()) {
      gsap.set(modal, { display: 'block' });
      gsap.fromTo(modal, 
        { clipPath: 'inset(100% 0 0 0)' },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          duration: 0.85, 
          ease: 'power4.inOut' 
        }
      );
      
      const contentEl = modal.querySelector('.case-study__content');
      if (contentEl) {
        gsap.fromTo(contentEl.children,
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.08, 
            ease: 'power3.out',
            delay: 0.45 
          }
        );
      }
    } else {
      modal.style.display = 'block';
    }

    document.dispatchEvent(new CustomEvent('contentUpdated'));

  } catch (err) {
    // Graceful degradation
  }
}

export function closeCaseStudy() {
  try {
    const modal = document.getElementById('case-study');
    if (!modal) return;

    const cleanup = () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.style.overflow = '';
      modal.classList.remove('case-study__overlay--active');
    };

    if (!prefersReducedMotion()) {
      gsap.to(modal, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.75,
        ease: 'power4.inOut',
        onComplete: cleanup
      });
    } else {
      cleanup();
    }

  } catch (err) {
    // Graceful degradation
  }
}
