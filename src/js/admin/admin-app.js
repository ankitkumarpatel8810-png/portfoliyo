/**
 * FOUNDERY927 Admin — Main Application
 * Handles auth, routing, data seeding, and global utilities.
 */

import { renderDashboard } from './admin-dashboard.js';
import { renderProjects } from './admin-projects.js';
import { renderTestimonials } from './admin-testimonials.js';
import { renderTeam } from './admin-team.js';
import { renderServices } from './admin-services.js';
import { renderLeads } from './admin-leads.js';
import { renderSettings } from './admin-settings.js';
import { renderMedia } from './admin-media.js';
import { renderContent } from './admin-content.js';
import { renderVideos } from './admin-videos.js';
import { renderAwards } from './admin-awards.js';

/* ============================================================
   Constants
   ============================================================ */
const DATA_KEY = 'foundery927_admin';
const SESSION_KEY = 'foundery927_session';
const CREDENTIALS = { username: 'admin', password: 'foundery927' };

/* ============================================================
   Image Optimizer Utility
   ============================================================ */
export function optimizeAndReadImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (dataUrl.length > canvas.toDataURL('image/jpeg', quality).length) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   Default Seed Data
   ============================================================ */
function getDefaultData() {
  return {
    projects: [
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
    ],
    services: [
      { id: 1, title: 'Executive Media Coaching', description: 'Working closely with CXOs and senior leadership to tell their brand story. Custom-tailored to executive strengths and business objectives.', icon: 'figma' },
      { id: 2, title: 'Podcast Curation', description: 'End-to-end podcast production, moderators, original research, and in-house video shooting/editing capabilities.', icon: 'zap' },
      { id: 3, title: 'Hosting Corporate Shows', description: 'Moderated leadership forums, panel discussions, and high-impact business summits with professional prime-time presence.', icon: 'layout' },
      { id: 4, title: 'Exclusive Interviews', description: 'In-depth conversations with global icons (e.g. Richard Branson, Nandan Nilekani) and top policy voices.', icon: 'cpu' },
      { id: 5, title: 'Documentary Storytelling', description: 'Deep economic and business journalism documentaries exploring economic cycles and global shifts.', icon: 'code' },
      { id: 6, title: 'Editorial Strategy', description: 'Robust background research, audience engagement systems, and content structures tailored for corporate media.', icon: 'search' },
      { id: 7, title: 'Moderation & Workshops', description: 'Facilitating leadership roundtables, stakeholder forums, and media preparedness training workshops.', icon: 'hexagon' },
      { id: 8, title: 'Brand Narration', description: 'Unlocking corporate messaging through video logs, professional narration, and PR consulting.', icon: 'trending-up' }
    ],
    team: [
      { id: 1, name: 'Sunanda Jayaseelan', role: 'Founder & Journalist', company: 'FOUNDRY927', social: { twitter: '#', linkedin: 'http://in.linkedin.com/in/sunandajayaseelan' }, image: '', link: 'http://in.linkedin.com/in/sunandajayaseelan', description: 'Founder with 20+ years of news anchoring and media strategy.', published: true, order: 0 },
      { id: 2, name: 'Editorial Lead', role: 'Research Associate', company: 'FOUNDRY927', social: { twitter: '#', linkedin: '#' }, image: '', link: '#', description: 'Directs policy research and content validation protocols.', published: true, order: 1 },
      { id: 3, name: 'Production Lead', role: 'Technical Director', company: 'FOUNDRY927', social: { twitter: '#', linkedin: '#', github: '#' }, image: '', link: '#', description: 'Oversees television-grade multi-cam video shooting & design systems.', published: true, order: 2 },
      { id: 4, name: 'Media Coordinator', role: 'Operations Manager', company: 'FOUNDRY927', social: { twitter: '#', linkedin: '#' }, image: '', link: '#', description: 'Manages stakeholder communications and media syndication lines.', published: true, order: 3 }
    ],
    testimonials: [
      { id: 1, name: 'Sarah Kim', role: 'CEO', company: 'NOVA', quote: "Sunanda didn't just coach our leadership — she helped us discover and project our true brand voice. The confidence of our senior executives during public engagements has soared.", rating: 5, image: '', published: true, order: 0 },
      { id: 2, name: 'David Park', role: 'CTO', company: 'MERIDIAN', quote: "The attention to detail and editorial depth Sunanda brought to our corporate media coaching was stellar. A masterclass in executive branding.", rating: 5, image: '', published: true, order: 1 },
      { id: 3, name: 'Elena Vasquez', role: 'CMO', company: 'APEX', quote: "Working with Sunanda was a game-changer. She moderated our leadership panels with exceptional prime-time energy, keeping the conversation insightful.", rating: 5, image: '', published: true, order: 2 },
      { id: 4, name: 'Thomas Wright', role: 'Founder', company: 'VERTEX AI', quote: "She curated our product podcast end-to-end, making complex technological architectures feel highly approachable for public audiences.", rating: 5, image: '', published: true, order: 3 }
    ],
    awards: [
      { id: 'award_1', name: 'TV Journalist of the Year', category: 'News & Broadcasting Guild', year: '2024', icon: 'award' },
      { id: 'award_2', name: 'Best Business & Economy Show', category: 'Television Journalism Awards', year: '2024', icon: 'award' },
      { id: 'award_3', name: 'Outstanding Economic Documentary', category: 'Media & Documentary Curation', year: '2023', icon: 'award' },
      { id: 'award_4', name: 'Panel Moderation Excellence', category: 'Leadership Forum Recognition', year: '2023', icon: 'award' },
      { id: 'award_5', name: 'Prime Time Anchor Award', category: 'National Broadcast Guild', year: '2022', icon: 'award' },
      { id: 'award_6', name: 'Executive Media Coach of the Year', category: 'Corporate Communications Association', year: '2022', icon: 'award' }
    ],
    leads: [
      { id: 'lead_1', name: 'Alex Morgan', email: 'alex@techstartup.io', phone: '+1 (555) 019-2834', subject: 'Executive Media Coaching', message: "Hi! I'm a tech founder looking for media coaching before our next funding round. Can we schedule a brief discovery call?", date: '2026-06-15T10:30:00', status: 'new', notes: 'Founder from YC batch. Follow up needed.' }
    ],
    media: [
      { id: 'media_1', name: 'hero-bg.jpg', type: 'image/jpeg', size: 245000, url: '/assets/hero-bg.jpg', date: '2026-06-01T10:00:00' }
    ],
    settings: {
      siteName: 'FOUNDRY927',
      tagline: 'Storytelling, Narration & Executive Media Coaching',
      seoTitle: 'FOUNDRY927 — Sunanda Jayaseelan',
      seoDescription: 'Storytelling, Narration, Executive Media Coaching & Prime Time TV Journalism by Sunanda Jayaseelan.',
      seoKeywords: 'television journalist, media coaching, prime time tv, executive coach, public speaking, G20 panel moderator, podcast curator',
      email: 'foundry927@gmail.com',
      phone: '+1 (555) 927-0000',
      address: 'Bangalore, India / New York, NY',
      socials: {
        twitter: 'https://twitter.com/foundery927',
        instagram: 'https://instagram.com/foundery927',
        linkedin: 'http://in.linkedin.com/in/sunandajayaseelan',
        dribbble: 'https://dribbble.com/foundery927',
        youtube: '',
        facebook: '',
        website: '',
        whatsapp: ''
      }
    },
    analytics: {
      visitors: 12847,
      conversions: 342,
      leads: 89,
      projectsCompleted: 107
    },
    about: {
      founderPhoto: '',
      founderName: 'Sunanda Jayaseelan',
      founderBio: 'Hi, I’m Sunanda Jayaseelan. I’ve spent more than 20 years as a television journalist, telling stories that matter — from breaking news moments to features that stay with you long after the camera lights fade.',
      companyStory: 'What drives me is simple: connecting with people, making sense of complex issues, and sharing stories that inspire conversation and understanding. Under FOUNDRY927, I bring that same TV-journalist passion to help ambitious brands and leaders articulate their digital stories.',
      mission: "To ensure every leader's voice is heard with complete clarity through TV-journalist passion and storytelling.",
      vision: 'Connecting with people, making sense of complex issues, and sharing stories that inspire conversation.',
      values: 'Integrity, Precision, Depth, Impact',
      experience: '20+',
      achievements: '12+',
      ctaButtonText: 'Book a Call',
      ctaButtonLink: '#cta-section'
    },
    videos: [
      {
        id: 'vid_1',
        title: 'Sir Richard Branson Interview Highlights',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'An segment exploring venture investment and scaling space travel.',
        category: 'Exclusive Interview',
        featured: true,
        published: true,
        order: 0
      }
    ],
    ctaFollowUps: {
      inquiryReceived: 'Hi, we have received your inquiry. A representative from FOUNDRY927 will get back to you shortly.',
      thankYou: 'Thank you for reaching out! We appreciate your interest in our storytelling and coaching services.',
      coachingFollowUp: "Hi, let's schedule a 15-minute discovery call to discuss our Executive Media Coaching options.",
      speakingInquiryFollowUp: "Thank you for the speaking invitation. We are reviewing Sunanda's calendar availability.",
      collaborationFollowUp: "We would love to explore synergy. Let's discuss partnership opportunities.",
      welcomeMessage: 'Welcome to the FOUNDERY927 newsletter! Stay tuned for monthly insights on executive media strategy.'
    },
    seo: {
      pageTitle: 'FOUNDRY927 — Sunanda Jayaseelan',
      metaDescription: 'Storytelling, Narration, Executive Media Coaching & Prime Time TV Journalism by Sunanda Jayaseelan.',
      keywords: 'television journalist, media coaching, prime time tv, executive coach, public speaking, G20 panel moderator',
      ogImage: '',
      ogTitle: 'FOUNDRY927 — Sunanda Jayaseelan',
      ogDescription: 'Storytelling, Narration, Executive Media Coaching & Prime Time TV Journalism by Sunanda Jayaseelan.'
    },
    pageContent: {
      hero: {
        heading: 'FOUNDERY927',
        subheading: 'Storytelling, Narration & Executive Media Coaching by Sunanda Jayaseelan. Over 20 years of television journalism and economic storytelling.',
        image: '',
        cta1Text: 'View Our Work',
        cta1Link: '#work',
        cta2Text: 'Book a Call',
        cta2Link: '#cta-section'
      },
      featuredInterviews: {
        heading: 'Featured Work',
        subheading: 'Exclusive Conversations',
        paragraph: 'In-depth dialogues where global vision meets editorial precision. High-profile segments broadcasted worldwide.'
      },
      featuredLeaders: {
        heading: 'Meet the Team',
        subheading: 'The People',
        paragraph: 'Broadcast-grade content demands specialized talent. We bring TV-caliber production to corporate storytelling.'
      },
      aboutSection: {
        heading: "We're not a factory.\nWe forge stories.",
        subheading: 'Who We Are',
        paragraph1: 'Hi, I’m Sunanda Jayaseelan. I’ve spent more than 20 years as a television journalist, telling stories that matter — from breaking news moments to features that stay with you long after the camera lights fade.',
        paragraph2: 'What drives me is simple: connecting with people, making sense of complex issues, and sharing stories that inspire conversation and understanding. Under FOUNDRY927, I bring that same TV-journalist passion to help ambitious brands and leaders articulate their digital stories.',
        quote: 'Stories are the ultimate currency of connection. Our mission is to ensure every leader\'s voice is heard with complete clarity.',
        quoteAuthor: '— Sunanda Jayaseelan, Founder'
      },
      foundry927Overview: {
        heading: 'Trusted by leading brands',
        stat1Number: '500',
        stat1Label: 'Shows Hosted',
        stat2Number: '1000',
        stat2Label: 'Interviews Conducted',
        stat3Number: '20',
        stat3Label: 'Years Experience',
        stat4Number: '5',
        stat4Label: 'Networks Anchored'
      },
      services: {
        heading: 'Services',
        subheading: 'What We Do',
        paragraph: 'Journalistic-grade media strategy, executive mentoring, and end-to-end podcast and documentary curation.'
      },
      insights: {
        heading: 'Insights',
        subheading: 'Articles & Curation',
        paragraph: 'Latest articles and thought leadership pieces curated from our network.'
      },
      impact: {
        heading: 'What They Say',
        subheading: 'Client Reviews'
      },
      awards: {
        heading: 'Awards',
        subheading: 'Our work and journalistic excellence have been recognized by leading media guilds and forums.',
        image: ''
      },
      collaborate: {
        heading: 'LET\'S BUILD SOMETHING EXTRAORDINARY.',
        subheading: 'Start a Project'
      },
      newsletter: {
        heading: 'Stay Updated',
        subheading: 'Newsletter Subscriptions',
        paragraph: 'Sign up to receive monthly executive briefing notes and media tips.'
      },
      contact: {
        heading: 'Get In Touch',
        subheading: 'Contact Us',
        paragraph: 'Feel free to reach out via email or phone for collaborative project briefings.'
      },
      footer: {
        description: 'Storytelling, narration, and executive media coaching for leaders, founders, and global organizations.',
        copyright: '© 2024 FOUNDERY927. All rights reserved.'
      }
    }
  };
}

/* ============================================================
   Data Helpers
   ============================================================ */
export function getData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function updateData(key, value) {
  const data = getData();
  if (data) {
    data[key] = value;
    setData(data);
  }
}

function seedDataIfNeeded() {
  const existing = getData();
  if (!existing) {
    setData(getDefaultData());
  } else {
    // Safely merge missing keys from defaults into existing data
    const defaults = getDefaultData();
    let updated = false;
    for (const key in defaults) {
      if (existing[key] === undefined) {
        existing[key] = defaults[key];
        updated = true;
      }
    }
    // Merge settings and nested socials
    if (existing.settings && defaults.settings) {
      for (const skey in defaults.settings) {
        if (existing.settings[skey] === undefined) {
          existing.settings[skey] = defaults.settings[skey];
          updated = true;
        }
      }
      if (existing.settings.socials && defaults.settings.socials) {
        for (const socKey in defaults.settings.socials) {
          if (existing.settings.socials[socKey] === undefined) {
            existing.settings.socials[socKey] = defaults.settings.socials[socKey];
            updated = true;
          }
        }
      }
    }
    // Deep merge pageContent for new sections like awards
    if (existing.pageContent && defaults.pageContent) {
      for (const pKey in defaults.pageContent) {
        if (existing.pageContent[pKey] === undefined) {
          existing.pageContent[pKey] = defaults.pageContent[pKey];
          updated = true;
        }
      }
    }
    if (updated) {
      setData(existing);
    }
  }
}

/* ============================================================
   Auth
   ============================================================ */
function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === 'active';
}

function login(username, password) {
  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    localStorage.setItem(SESSION_KEY, 'active');
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
}

/* ============================================================
   UI Helpers
   ============================================================ */
export function showToast(message, type = 'success') {
  const container = document.getElementById('admin-toasts');
  const iconMap = {
    success: '<svg class="admin-toast__icon admin-toast__icon--success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg class="admin-toast__icon admin-toast__icon--error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg class="admin-toast__icon admin-toast__icon--info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `admin-toast admin-toast--${type}`;
  toast.innerHTML = `${iconMap[type] || iconMap.info}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('admin-toast--out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

export function showModal(html) {
  const modal = document.getElementById('admin-modal');
  const content = document.getElementById('modal-content');
  content.innerHTML = html;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const overlay = document.getElementById('modal-overlay');
  const closeBtn = content.querySelector('.admin-modal__close');

  const close = () => hideModal();
  overlay.addEventListener('click', close, { once: true });
  if (closeBtn) closeBtn.addEventListener('click', close, { once: true });
}

export function hideModal() {
  const modal = document.getElementById('admin-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

export function showConfirm(title, message, onConfirm) {
  const el = document.getElementById('admin-confirm');
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').textContent = message;
  el.style.display = 'flex';

  const cancelBtn = document.getElementById('confirm-cancel');
  const okBtn = document.getElementById('confirm-ok');

  const cleanup = () => {
    el.style.display = 'none';
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    okBtn.replaceWith(okBtn.cloneNode(true));
  };

  document.getElementById('confirm-cancel').addEventListener('click', cleanup, { once: true });
  document.getElementById('confirm-ok').addEventListener('click', () => {
    cleanup();
    onConfirm();
  }, { once: true });
}

export function generateId(prefix = 'item') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function truncate(str, len = 100) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

/* ============================================================
   Routing
   ============================================================ */
const pages = {
  dashboard: { title: 'Dashboard', breadcrumb: 'Overview', render: renderDashboard },
  projects: { title: 'Projects', breadcrumb: 'Content', render: renderProjects },
  content: { title: 'Visual Page Content', breadcrumb: 'Content', render: renderContent },
  videos: { title: 'YouTube Videos', breadcrumb: 'Content', render: renderVideos },
  testimonials: { title: 'Testimonials', breadcrumb: 'Content', render: renderTestimonials },
  team: { title: 'Featured Leaders', breadcrumb: 'Content', render: renderTeam },
  services: { title: 'Services', breadcrumb: 'Content', render: renderServices },
  awards: { title: 'Awards', breadcrumb: 'Content', render: renderAwards },
  leads: { title: 'Leads', breadcrumb: 'Management', render: renderLeads },
  media: { title: 'Media', breadcrumb: 'Management', render: renderMedia },
  settings: { title: 'Settings', breadcrumb: 'Management', render: renderSettings }
};

function getCurrentPage() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  return pages[hash] ? hash : 'dashboard';
}

function navigateTo(page) {
  const config = pages[page];
  if (!config) return;

  // Update header
  document.getElementById('page-title').textContent = config.title;
  document.getElementById('page-breadcrumb').textContent = config.breadcrumb;

  // Update sidebar active state
  document.querySelectorAll('.admin-sidebar__link[data-page]').forEach(link => {
    link.classList.toggle('admin-sidebar__link--active', link.dataset.page === page);
  });

  // Clear header actions
  document.getElementById('page-actions').innerHTML = '';

  // Render content
  const container = document.getElementById('admin-content');
  container.innerHTML = '';
  config.render(container);

  // Close mobile sidebar
  closeMobileSidebar();
}

/* ============================================================
   UI State (Login / Dashboard)
   ============================================================ */
function showLogin() {
  document.getElementById('admin-login').style.display = 'flex';
  document.getElementById('admin-layout').style.display = 'none';
}

function showDashboard() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-layout').style.display = 'flex';
  navigateTo(getCurrentPage());
}

/* ============================================================
   Mobile Sidebar
   ============================================================ */
function closeMobileSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggle = document.getElementById('sidebar-toggle');
  sidebar.classList.remove('admin-sidebar--open');
  overlay.classList.remove('admin-sidebar-overlay--visible');
  if (toggle) toggle.classList.remove('admin-hamburger--active');
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggle = document.getElementById('sidebar-toggle');
  const isOpen = sidebar.classList.toggle('admin-sidebar--open');
  overlay.classList.toggle('admin-sidebar-overlay--visible', isOpen);
  if (toggle) toggle.classList.toggle('admin-hamburger--active', isOpen);
}

/* ============================================================
   Init
   ============================================================ */
function init() {
  seedDataIfNeeded();

  // Login form
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (login(username, password)) {
      showDashboard();
    } else {
      showToast('Invalid credentials. Please try again.', 'error');
    }
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', logout);

  // Global actions: Preview & Publish
  const previewBtn = document.getElementById('btn-global-preview');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      window.open('/?preview=true', '_blank');
    });
  }

  const publishBtn = document.getElementById('btn-global-publish');
  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      showConfirm(
        'Publish Changes',
        'Are you sure you want to publish all changes to the live site? This will update the website for all public visitors.',
        () => {
          const draft = localStorage.getItem('foundery927_admin');
          if (draft) {
            localStorage.setItem('foundery927_published', draft);
            showToast('Website published successfully!', 'success');
          } else {
            showToast('No draft data found to publish.', 'error');
          }
        }
      );
    });
  }

  // Hash routing
  window.addEventListener('hashchange', () => {
    if (isLoggedIn()) navigateTo(getCurrentPage());
  });

  // Sidebar navigation
  document.querySelectorAll('.admin-sidebar__link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      window.location.hash = page;
    });
  });

  // Mobile sidebar
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleMobileSidebar);

  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // Show correct view
  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
}

// Boot
document.addEventListener('DOMContentLoaded', init);
