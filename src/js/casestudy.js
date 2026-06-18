/**
 * FOUNDERY927 — Cinematic Case Study Modal
 * Dynamically loads project details, handles fullscreen modal reveals
 * with animated clip-path entrance/exit transitions, and populates metrics.
 */

import gsap from 'gsap';
import { prefersReducedMotion } from './utils.js';

// Fallback seed projects in case localStorage is empty
const defaultProjects = [
  {
    id: 'nova',
    title: 'SIR RICHARD BRANSON',
    category: 'Exclusive Interview',
    industry: 'Global Leadership',
    description: 'An in-depth conversation on global scaling, brand disruption, and venture investment.',
    challenge: "Conducting a high-impact, live television interview with one of the world's most iconic and spontaneous global entrepreneurs, requiring rigorous research.",
    strategy: "Structured dynamic editorial prompts shifting between Virgin's expansion strategies, space travel, and early-stage venture mentorship, allowing for spontaneous yet structured insights.",
    results: { viewCount: '1.2M+', syndication: 'Global', retentionRate: '86%', engagement: 'High' },
    color: '#E8D5B7'
  },
  {
    id: 'meridian',
    title: 'NANDAN NILEKANI',
    category: 'Exclusive Interview',
    industry: 'Digital Public Goods',
    description: 'Immersive dialogue about the future of digital identity systems, public goods, and financial technology.',
    challenge: "Unpacking complex national identity architecture (Aadhaar) and UPI payment systems for a broad global business audience without losing technical accuracy.",
    strategy: "Frame the technology through its economic impact on financial inclusion, using structured questioning to highlight public-private partnership models.",
    results: { businessReach: 'Top CXOs', policyImpact: 'High', coverage: 'Prime Time', audience: 'Decision Makers' },
    color: '#7B93DB'
  },
  {
    id: 'apex',
    title: 'NARAYANA MURTHY',
    category: 'Exclusive Interview',
    industry: 'IT Services & Exports',
    description: 'A masterclass in software exports, corporate governance, and early-stage venture scale.',
    challenge: "Eliciting fresh, actionable perspectives on corporate governance and IT scale from a technology pioneer who has been interviewed hundreds of times.",
    strategy: "Focused on future-looking issues including the ethics of AI, early-stage venture dynamics, and mentoring the next generation of digital founders.",
    results: { executiveShares: '50k+', mediaQuotes: '24+', rating: 'Top Tier', audience: 'Global Founders' },
    color: '#C8FF00'
  },
  {
    id: 'lumiere',
    title: 'JOHN CHAMBERS',
    category: 'Exclusive Interview',
    industry: 'Cisco Leadership',
    description: "Discussing Cisco's rapid scaling, crisis management, and investment strategies.",
    challenge: "Summarizing decades of tech scaling experience and venture capitalism into a focused, highly engaging segment.",
    strategy: "Directed the conversation toward transition strategies, managing tech bubbles, and the specific playbooks required for early-stage tech ventures.",
    results: { views: '800k+', shares: 'Top Startup Labs', relevance: '10/10', engagement: '+420%' },
    color: '#FFB347'
  },
  {
    id: 'vertex',
    title: 'G20 SUMMITS',
    category: 'Policy & Global Forums',
    industry: 'International Affairs',
    description: 'Exclusive coverage of ministerial summits and international economic collaborations.',
    challenge: "Translating complex multilateral policy discussions and G20 communiqués into highly engaging business news.",
    strategy: "Conducting rapid-fire interviews with international ministers and trade delegates, focusing on actionable trade and policy trends.",
    results: { delegatesInterviewed: '12+', liveHours: '45+', reach: '30+ Countries', status: 'Featured' },
    color: '#A78BFA'
  },
  {
    id: 'onyx',
    title: 'PRIME TIME JOURNALISM',
    category: 'Media Coverage',
    industry: 'Television Broadcasting',
    description: 'Prime time anchoring and economic documentaries exploring global economic shifts.',
    challenge: "Maintaining peak viewer engagement and journalistic integrity during high-pressure prime-time live news cycles.",
    strategy: "Combining sharp editorial research with real-time teleprompter agility and executive panel moderation.",
    results: { yearsActive: '20+', tvBroadcasts: '5,000+', livePanels: '150+', rating: '#1 Anchored Show' },
    color: '#F0C674'
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

export function openCaseStudy(projectId) {
  try {
    const modal = document.getElementById('case-study');
    if (!modal) return;

    // Load projects list (attempting localStorage CMS first)
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
      // JSON parse error or security blocking, fall back to default
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Populate Fields
    const titleEl = modal.querySelector('.case-study__title');
    const categoryEl = modal.querySelector('.case-study__category');
    const descEl = modal.querySelector('.case-study__description');
    const challengeEl = modal.querySelector('.case-study__challenge');
    const strategyEl = modal.querySelector('.case-study__strategy');
    const metricsEl = modal.querySelector('.case-study__metrics');
    const heroEl = modal.querySelector('.case-study__hero');

    if (titleEl) titleEl.textContent = project.title;
    if (categoryEl) categoryEl.textContent = `${project.category} · ${project.industry || 'Selected Work'}`;
    if (descEl) descEl.textContent = project.description;
    if (challengeEl) challengeEl.textContent = project.challenge || 'Details coming soon.';
    if (strategyEl) strategyEl.textContent = project.strategy || 'Strategy details coming soon.';

    // Color theme on case study hero background
    if (heroEl) {
      heroEl.style.backgroundColor = project.color || 'var(--color-bg-elevated)';
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
      
      // Animate modal content elements coming in
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

    // Trigger cursor / magnetics rebind
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
