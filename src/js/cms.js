/**
 * FRAMEON — Creative Production Agency Integration Engine
 * Bootstraps on client load to replace static content with agency data.
 */

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Fallback Default Data (FRAMEON Creative Production Agency)
const defaultData = {
  settings: {
    siteName: 'FRAMEON',
    tagline: 'Beyond the Edit.',
    email: 'frameonstudio8810@gmail.com',
    whatsapp: '8810556825',
    phone: '',
    address: '',
    socials: {
      twitter: 'https://twitter.com',
      instagram: 'https://www.instagram.com/frameon.motion',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com'
    }
  },
  pageContent: {
    hero: {
      heading: 'WE CREATE CONTENT THAT HOLDS ATTENTION.',
      subheading: 'FRAMEON helps brands and creators turn ideas into high-quality content through editing, motion, design, and creative direction.',
      image: '',
      cta1Text: 'VIEW OUR WORK',
      cta1Link: '#work',
      cta2Text: 'START A PROJECT',
      cta2Link: '#cta-section'
    },
    featuredInterviews: {
      heading: 'SELECTED WORK',
      subheading: 'Our Portfolio',
      paragraph: 'A curated showcase of short-form systems, long-form edits, performance creatives, and brand visual systems.'
    },
    featuredLeaders: {
      heading: 'THE FRAMEON NETWORK',
      subheading: 'Network',
      paragraph: 'A curated network of editors, designers, and creative specialists.'
    },
    aboutSection: {
      heading: "WE'RE NOT JUST AN EDITING AGENCY.",
      subheading: 'ABOUT FRAMEON',
      paragraph1: 'FRAMEON brings together editors, designers, and creative specialists to help brands and creators turn ideas into content that captures attention and creates impact.',
      paragraph2: '',
      quote: 'WE BUILD CONTENT PEOPLE REMEMBER.',
      quoteAuthor: '— FRAMEON Creative Philosophy'
    },
    foundry927Overview: {
      heading: 'Trusted by leading creators & brands',
      stat1Number: '500',
      stat1Label: 'Videos Delivered',
      stat2Number: '100',
      stat2Label: 'Views Generated (M+)',
      stat3Number: '100',
      stat3Label: 'On-Time Delivery (%)',
      stat4Number: '50',
      stat4Label: 'Brands & Creators'
    },
    services: {
      heading: 'Services',
      subheading: 'Capabilities',
      paragraph: 'Core production disciplines tailored to help modern brands and creators dominate visual channels.'
    },
    impact: {
      heading: 'THE FRAMEON STANDARD',
      subheading: 'Our Commitment'
    },
    awards: {
      heading: 'RECOGNITION & MILESTONES',
      subheading: 'Delivering high-retention content systems trusted by leading digital creators.',
      image: ''
    },
    collaborate: {
      heading: 'READY TO BUILD CONTENT THAT GETS NOTICED?',
      subheading: 'START A PROJECT'
    },
    footer: {
      description: 'Creative production for brands and creators who care about attention.',
      copyright: '© 2026 FRAMEON. Beyond the Edit. All rights reserved.'
    }
  },
  awards: [
    { id: 'award_1', name: '100M+ TOTAL VIEWS', category: 'High-Retention Visual Content Systems Delivered', year: '2026', icon: 'award' },
    { id: 'award_2', name: '99.8% ON-TIME DELIVERY', category: 'Strict Production Milestones & Workflow Standards', year: '2026', icon: 'award' },
    { id: 'award_3', name: 'CREATIVE REVIEW GUARANTEE', category: 'Multi-Stage Internal Quality Control Process', year: '2025', icon: 'award' },
    { id: 'award_4', name: 'SPECIALIZED NETWORK', category: 'Dedicated Video Editors, Motion & Thumbnail Designers', year: '2025', icon: 'award' }
  ]
};

const serviceIconMap = {
  figma: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>',
  zap: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  layout: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  cpu: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
  code: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  search: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  hexagon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  'trending-up': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 12 7.56 18.5"/></svg>'
};

export function applyCMSContent() {
  // 1. Determine Preview Mode & Clear Stale Legacy Cache
  const isPreview = new URLSearchParams(window.location.search).has('preview');
  const storageKey = isPreview ? 'foundery927_admin' : 'foundery927_published';
  
  let cms = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw && (raw.includes('Jayaseelan') || raw.includes('FOUNDERY927') || raw.includes('FOUNDRY927') || raw.includes('Sunanda'))) {
      localStorage.removeItem('foundery927_published');
      localStorage.removeItem('foundery927_admin');
    } else if (raw) {
      cms = JSON.parse(raw);
    }
  } catch (e) {
    // Silent fail
  }
  
  // Final fallback to memory defaults
  if (!cms) {
    cms = defaultData;
  }

  // 2. Ingest schema safety checks
  const settings = cms.settings || defaultData.settings;
  const pageContent = cms.pageContent || defaultData.pageContent;
  const seo = cms.seo || cms.settings || {}; // SEO can fallback to settings
  const socials = cms.socials || settings.socials || {};

  // 3. Inject SEO metadata tags
  if (seo.pageTitle) document.title = seo.pageTitle;
  
  updateMetaTag('description', seo.metaDescription || settings.seoDescription);
  updateMetaTag('keywords', seo.keywords || settings.seoKeywords);
  updateMetaTag('og:title', seo.ogTitle || seo.pageTitle);
  updateMetaTag('og:description', seo.ogDescription || seo.metaDescription);
  updateMetaTag('og:image', seo.ogImage);

  // 4. Inject Visual Hero Section
  const heroSection = document.getElementById('hero');
  if (heroSection && pageContent.hero) {
    const heroCfg = pageContent.hero;
    
    const heroSub = heroSection.querySelector('.hero__sub');
    if (heroSub && heroCfg.subheading) heroSub.textContent = heroCfg.subheading;

    const heroImg = heroSection.querySelector('.hero__founder-img');
    if (heroImg) {
      if (heroCfg.image) {
        heroImg.src = heroCfg.image;
        heroImg.style.objectFit = 'contain'; // full frame protect cropped
      } else {
        heroImg.src = '/founder.png'; // Fallback to default founder image if cleared
      }
    }

    const cta1 = heroSection.querySelector('.hero__buttons a:nth-child(1)');
    if (cta1 && heroCfg.cta1Text) {
      cta1.querySelector('.btn__text').textContent = heroCfg.cta1Text;
      if (heroCfg.cta1Link) cta1.href = heroCfg.cta1Link;
    }

    const cta2 = heroSection.querySelector('.hero__buttons a:nth-child(2)');
    if (cta2 && heroCfg.cta2Text) {
      cta2.querySelector('.btn__text').textContent = heroCfg.cta2Text;
      if (heroCfg.cta2Link) cta2.href = heroCfg.cta2Link;
    }
  }

  // 5. Inject Trust Bar Overview (Foundry927 Overview)
  const trustBarSection = document.getElementById('trust-bar');
  if (trustBarSection && pageContent.foundry927Overview) {
    const ovCfg = pageContent.foundry927Overview;
    
    const marqueeTitle = trustBarSection.querySelector('.trust-bar__marquee');
    if (marqueeTitle && ovCfg.heading) {
      // update marquee header text if needed
    }

    const statsList = trustBarSection.querySelectorAll('.trust-bar__stat');
    if (statsList.length >= 4) {
      const setStat = (el, val, lbl) => {
        const numEl = el.querySelector('.trust-bar__stat-number');
        const lblEl = el.querySelector('.trust-bar__stat-label');
        if (numEl) {
          numEl.setAttribute('data-target', val.replace('+', ''));
          numEl.textContent = val;
        }
        if (lblEl) lblEl.textContent = lbl;
      };

      setStat(statsList[0], ovCfg.stat1Number || '500+', ovCfg.stat1Label || 'Shows Hosted');
      setStat(statsList[1], ovCfg.stat2Number || '1000+', ovCfg.stat2Label || 'Interviews Conducted');
      setStat(statsList[2], ovCfg.stat3Number || '20+', ovCfg.stat3Label || 'Years Experience');
      setStat(statsList[3], ovCfg.stat4Number || '5+', ovCfg.stat4Label || 'Networks Anchored');
    }
  }

  // 6. Inject Services Grid
  const servicesSection = document.getElementById('services');
  if (servicesSection && pageContent.services) {
    const srvCfg = pageContent.services;
    const tag = servicesSection.querySelector('.services__header .tag');
    const title = servicesSection.querySelector('.services__header h2');
    const sub = servicesSection.querySelector('.services__header p');

    if (tag && srvCfg.subheading) tag.textContent = srvCfg.subheading;
    if (title && srvCfg.heading) title.textContent = srvCfg.heading;
    if (sub && srvCfg.paragraph) sub.textContent = srvCfg.paragraph;

    // Dynamically render service cards
    const grid = servicesSection.querySelector('.services__grid');
    const activeServices = cms.services || defaultData.services || [];
    if (grid && activeServices.length > 0) {
      grid.innerHTML = activeServices.map((srv, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        const iconSvg = serviceIconMap[srv.icon] || serviceIconMap.layout;
        return `
          <div class="services__card reveal-up">
            <span class="services__card-number">${num}</span>
            <div class="services__card-icon">${iconSvg}</div>
            <h3 class="services__card-title">${escapeHtml(srv.title)}</h3>
            <p class="services__card-desc">${escapeHtml(srv.description)}</p>
            <div class="services__card-glow" aria-hidden="true"></div>
          </div>
        `;
      }).join('');
    }
  }

  // 7. Inject Work Grid (Featured Interviews + YouTube Videos)
  const workSection = document.getElementById('work');
  if (workSection && pageContent.featuredInterviews) {
    const workCfg = pageContent.featuredInterviews;
    const tag = workSection.querySelector('.work__header .tag');
    const title = workSection.querySelector('.work__header h2');
    const sub = workSection.querySelector('.work__header p');

    if (tag && workCfg.subheading) tag.textContent = workCfg.subheading;
    if (title && workCfg.heading) title.textContent = workCfg.heading;
    if (sub && workCfg.paragraph) sub.textContent = workCfg.paragraph;

    // Merge regular projects and published videos
    const activeProjects = cms.projects || [];
    const activeVideos = (cms.videos || []).filter(v => v.published !== false);
    const grid = workSection.querySelector('.work__grid');

    if (grid) {
      grid.innerHTML = '';
      
      // Render projects
      activeProjects.forEach(proj => {
        const item = document.createElement('div');
        item.className = 'work__card reveal-up';
        item.dataset.project = proj.id;
        item.innerHTML = `
          <div class="work__card-image" style="background-color: ${proj.color || '#E8D5B7'};" aria-label="${escapeHtml(proj.title)} project preview"></div>
          <div class="work__card-overlay"></div>
          <div class="work__card-info">
            <h3 class="work__card-title">${escapeHtml(proj.title)}</h3>
            <span class="work__card-category">${escapeHtml(proj.category)} · ${escapeHtml(proj.industry || 'Leadership')}</span>
          </div>
          <button class="work__card-arrow" aria-label="View ${escapeHtml(proj.title)} case study">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </button>
        `;
        grid.appendChild(item);
      });

      // Render videos
      activeVideos.forEach(vid => {
        const ytId = getYouTubeId(vid.url) || '';
        const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';
        const item = document.createElement('div');
        item.className = 'work__card reveal-up';
        item.dataset.videoUrl = vid.url;
        item.innerHTML = `
          <div class="work__card-image" style="background-image: url('${thumbUrl}'); background-size: cover; background-position: center;" aria-label="${escapeHtml(vid.title)} video preview"></div>
          <div class="work__card-overlay"></div>
          <div class="work__card-info">
            <h3 class="work__card-title">${escapeHtml(vid.title)}</h3>
            <span class="work__card-category">${escapeHtml(vid.category || 'Exclusive Interview')} · Video Curation</span>
          </div>
          <button class="work__card-arrow" aria-label="Play video">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
          </button>
        `;
        grid.appendChild(item);
      });
    }
  }

  // 8. Inject About Section & Founder Photo
  const aboutSection = document.getElementById('about');
  if (aboutSection && pageContent.aboutSection) {
    const abCfg = pageContent.aboutSection;
    const tag = aboutSection.querySelector('.about__text .tag');
    const title = aboutSection.querySelector('.about__text h2');
    const blockquote = aboutSection.querySelector('.about__quote p');
    const cite = aboutSection.querySelector('.about__quote cite');

    if (tag && abCfg.subheading) tag.textContent = abCfg.subheading;
    if (title && abCfg.heading) title.innerHTML = abCfg.heading.replace(/\n/g, '<br>');
    if (blockquote && abCfg.quote) blockquote.textContent = abCfg.quote;
    if (cite && abCfg.quoteAuthor) cite.textContent = abCfg.quoteAuthor;

    // Paragraphs
    const paragraphs = aboutSection.querySelectorAll('.about__text > p:not(.about__quote p)');
    if (paragraphs.length >= 2) {
      if (abCfg.paragraph1) paragraphs[0].textContent = abCfg.paragraph1;
      if (abCfg.paragraph2) paragraphs[1].textContent = abCfg.paragraph2;
    }

    // Image replacement
    const aboutImgBox = aboutSection.querySelector('.about__image');
    if (aboutImgBox) {
      if (abCfg.image) {
        aboutImgBox.innerHTML = `<img src="${abCfg.image}" style="width:100%; height:100%; object-fit: cover; border-radius:12px;" alt="About portrait/landscape image">`;
      } else {
        const aboutData = cms.about || {};
        if (aboutData.founderPhoto) {
          aboutImgBox.innerHTML = `<img src="${aboutData.founderPhoto}" style="width:100%; height:100%; object-fit: cover; border-radius:12px;" alt="${escapeHtml(aboutData.founderName || 'FRAMEON Creative Studio')}">`;
        }
      }
    }
  }

  // 9. Inject Featured Leaders (Team Section)
  const teamSection = document.getElementById('team');
  if (teamSection && pageContent.featuredLeaders) {
    const teamCfg = pageContent.featuredLeaders;
    const tag = teamSection.querySelector('.team__header .tag');
    const title = teamSection.querySelector('.team__header h2');
    const sub = teamSection.querySelector('.team__header p');

    if (tag && teamCfg.subheading) tag.textContent = teamCfg.subheading;
    if (title && teamCfg.heading) title.textContent = teamCfg.heading;
    if (sub && teamCfg.paragraph) sub.textContent = teamCfg.paragraph;

    const grid = teamSection.querySelector('.team__grid');
    const activeTeam = (cms.team || []).filter(t => t.published !== false);
    if (grid && activeTeam.length > 0) {
      grid.innerHTML = activeTeam.map(member => {
        return `
          <div class="team__card reveal-up">
            <div class="team__card-image">
              ${member.image ? `<img src="${member.image}" style="width:100%; height:100%; object-fit: cover; border-radius:8px;" alt="${escapeHtml(member.name)}">` : `
                <div style="width:100%;height:100%;background:linear-gradient(135deg, #C8FF00 0%, #333 100%);border-radius:8px;" aria-label="${escapeHtml(member.name)} portrait"></div>
              `}
            </div>
            <div class="team__card-info">
              <h3 class="team__card-name">
                ${member.link ? `<a href="${member.link}" target="_blank" style="color:inherit; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">${escapeHtml(member.name)} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></a>` : escapeHtml(member.name)}
              </h3>
              <span class="team__card-role">${escapeHtml(member.role)} ${member.company ? `(${escapeHtml(member.company)})` : ''}</span>
              <p style="font-size:0.75rem; color:var(--color-text-muted); margin-top:8px; line-height:1.4;">${escapeHtml(member.description || '')}</p>
              <div class="team__card-social">
                ${member.social?.twitter ? `
                  <a href="${member.social.twitter}" class="team__social-link" aria-label="Twitter">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                ` : ''}
                ${member.social?.linkedin ? `
                  <a href="${member.social.linkedin}" class="team__social-link" aria-label="LinkedIn" target="_blank" rel="noopener">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 10. Inject Testimonials
  const testimonialsSection = document.getElementById('testimonials');
  if (testimonialsSection && pageContent.impact) {
    const tag = testimonialsSection.querySelector('.testimonials__header .tag');
    const title = testimonialsSection.querySelector('.testimonials__header h2');
    
    if (tag && pageContent.impact.subheading) tag.textContent = pageContent.impact.subheading;
    if (title && pageContent.impact.heading) title.textContent = pageContent.impact.heading;

    const track = testimonialsSection.querySelector('.testimonials__track');
    const dotsContainer = testimonialsSection.querySelector('.testimonials__dots');
    const activeTestimonials = (cms.testimonials || []).filter(t => t.published !== false);

    if (track && activeTestimonials.length > 0) {
      track.innerHTML = activeTestimonials.map((t, idx) => {
        const stars = '★'.repeat(t.rating || 5) + '☆'.repeat(5 - (t.rating || 5));
        return `
          <div class="testimonials__slide" data-slide="${idx}">
            <blockquote class="testimonials__quote">
              <div style="color: var(--color-accent); font-size: 1rem; margin-bottom: 12px; letter-spacing: 2px;">${stars}</div>
              <p>"${escapeHtml(t.quote)}"</p>
            </blockquote>
            <div class="testimonials__author">
              <div class="testimonials__author-image" style="${t.image ? `background-image:url('${t.image}'); background-size:cover; background-position:center;` : `background:linear-gradient(135deg,#E8D5B7,#333);`} border-radius:50%;" aria-label="${escapeHtml(t.name)}"></div>
              <div>
                <span class="testimonials__author-name">${escapeHtml(t.name)}</span>
                <span class="testimonials__author-role">${escapeHtml(t.role)}, ${escapeHtml(t.company)}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      if (dotsContainer) {
        dotsContainer.innerHTML = activeTestimonials.map((t, idx) => {
          return `<button class="testimonials__dot ${idx === 0 ? 'testimonials__dot--active' : ''}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}" aria-label="Slide ${idx + 1}" data-slide="${idx}"></button>`;
        }).join('');
      }
    }
  }

  // 10.5 Inject Awards Section Texts & Dynamic List Items
  const awardsSection = document.getElementById('awards');
  if (awardsSection && pageContent.awards) {
    const awCfg = pageContent.awards;
    const title = awardsSection.querySelector('.awards__header h2');
    const sub = awardsSection.querySelector('.awards__header p');

    if (title && awCfg.heading) title.textContent = awCfg.heading;
    if (sub && awCfg.subheading) sub.textContent = awCfg.subheading;

    const wrapper = awardsSection.querySelector('.awards__stack-wrapper');
    const activeAwards = cms.awards || defaultData.awards || [];
    if (wrapper) {
      if (activeAwards.length > 0) {
        wrapper.innerHTML = activeAwards.map((award, index) => {
          return `
            <div class="awards__card" data-index="${index}">
              <div class="awards__card-glow"></div>
              <div class="awards__card-inner" style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; position: relative; z-index: 2;">
                <!-- Card Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                  <div class="awards__card-icon" style="color: var(--color-accent);">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                  </div>
                  <span class="awards__card-year" style="font-family: var(--font-body); font-size: 0.8rem; font-weight: 600; color: var(--color-accent); letter-spacing: 2px;">${escapeHtml(award.year)}</span>
                </div>
                <!-- Card Body -->
                <div style="margin-top: auto; width: 100%; text-align: left;">
                  <h3 class="awards__card-title" style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: #FAFAFA; margin-bottom: 8px; line-height: 1.2; text-transform: uppercase;">${escapeHtml(award.name)}</h3>
                  <p class="awards__card-category" style="font-family: var(--font-body); font-size: 0.85rem; color: #888; margin: 0;">${escapeHtml(award.category)}</p>
                </div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        wrapper.innerHTML = '';
      }
    }
  }

  // 11. Inject Collaborate & Footer
  const ctaSection = document.getElementById('cta-section');
  if (ctaSection && pageContent.collaborate) {
    const ctaHead = ctaSection.querySelector('h2');
    if (ctaHead && pageContent.collaborate.heading) {
      ctaHead.innerHTML = pageContent.collaborate.heading.replace(/\n/g, '<br>');
    }
  }

  const footerSection = document.getElementById('footer');
  if (footerSection && pageContent.footer) {
    const desc = footerSection.querySelector('.footer__col:first-child p');
    const copy = footerSection.querySelector('.footer__copyright');
    if (desc && pageContent.footer.description) desc.textContent = pageContent.footer.description;
    if (copy && pageContent.footer.copyright) copy.textContent = pageContent.footer.copyright;
  }

  // 12. Replace Global Social Coordinates
  if (socials.email) {
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      // Exclude specific discovery links if any, but replace standard mailtos
      const url = new URL(link.href);
      if (url.pathname === settings.email || url.pathname === 'foundry927@gmail.com') {
        link.href = `mailto:${socials.email}`;
        if (link.textContent.trim().includes('@')) {
          link.textContent = socials.email;
        }
      }
    });
  }

  if (socials.phone) {
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.href = `tel:${socials.phone.replace(/[^0-9+]/g, '')}`;
      if (link.textContent.trim().startsWith('+') || link.textContent.trim().startsWith('(')) {
        link.textContent = socials.phone;
      }
    });
  }

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.href.toLowerCase();
    if (href.includes('twitter.com') || href.includes('x.com')) {
      if (socials.twitter) link.href = socials.twitter;
    } else if (href.includes('instagram.com')) {
      if (socials.instagram) link.href = socials.instagram;
    } else if (href.includes('linkedin.com')) {
      if (socials.linkedin) link.href = socials.linkedin;
    } else if (href.includes('dribbble.com')) {
      if (socials.dribbble) link.href = socials.dribbble;
    } else if (href.includes('youtube.com') && !link.closest('.work__card')) {
      if (socials.youtube) link.href = socials.youtube;
    } else if (href.includes('facebook.com')) {
      if (socials.facebook) link.href = socials.facebook;
    }
  });

  // 12.5 Apply background images to other sections if set in CMS pageContent
  const backgroundMapping = {
    featuredInterviews: '#work',
    featuredLeaders: '#team',
    foundry927Overview: '#trust-bar',
    services: '#services',
    impact: '#testimonials',
    awards: '#awards',
    collaborate: '#cta-section',
    footer: '#footer'
  };

  Object.entries(backgroundMapping).forEach(([secKey, selector]) => {
    const el = document.querySelector(selector);
    if (el) {
      const secCfg = pageContent[secKey];
      if (secCfg && secCfg.image) {
        el.style.backgroundImage = `linear-gradient(180deg, rgba(5, 5, 5, 0.85) 0%, rgba(5, 5, 5, 0.85) 100%), url('${secCfg.image}')`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
      } else {
        el.style.backgroundImage = '';
        el.style.backgroundSize = '';
        el.style.backgroundPosition = '';
        el.style.backgroundRepeat = '';
      }
    }
  });

  // 13. Create & Inject YouTube Video Modal & Iframe Player
  injectVideoModal();

  // 14. Create & Inject lead capturing modal contact form
  injectContactFormModal(socials, cms.ctaFollowUps || {});
}

/* ============================================================
   Private Helpers
   ============================================================ */

function updateMetaTag(nameOrProperty, content) {
  if (!content) return;
  const selector = nameOrProperty.startsWith('og:') 
    ? `meta[property="${nameOrProperty}"]` 
    : `meta[name="${nameOrProperty}"]`;
  
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (nameOrProperty.startsWith('og:')) {
      el.setAttribute('property', nameOrProperty);
    } else {
      el.setAttribute('name', nameOrProperty);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function injectVideoModal() {
  if (document.getElementById('cms-video-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'cms-video-modal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
  `;
  modal.innerHTML = `
    <button id="cms-video-close" style="position: absolute; top: 24px; right: 24px; background: none; border: none; color: #fff; font-size: 44px; cursor: pointer; line-height: 1; font-family: sans-serif;">&times;</button>
    <div style="width: 90%; max-width: 960px; aspect-ratio: 16/9; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
      <iframe id="cms-video-iframe" src="" style="width: 100%; height: 100%;" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;
  document.body.appendChild(modal);

  const close = () => {
    modal.style.display = 'none';
    document.getElementById('cms-video-iframe').src = '';
    document.body.style.overflow = '';
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.getElementById('cms-video-close').addEventListener('click', close);

  // Bind clicks on YouTube cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.work__card[data-video-url]');
    if (card) {
      e.preventDefault();
      const url = card.dataset.videoUrl;
      const ytId = getYouTubeId(url);
      if (ytId) {
        document.getElementById('cms-video-iframe').src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }
  });
}

function injectContactFormModal(socials, followUps) {
  if (document.getElementById('cms-contact-modal')) return;

  // Render modal element
  const modal = document.createElement('div');
  modal.id = 'cms-contact-modal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(5, 5, 5, 0.96);
    z-index: 10000;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px);
    overflow-y: auto;
    padding: 24px;
  `;
  
  // Luxury Dark Form UI matching theme
  modal.innerHTML = `
    <div class="cms-contact-card" style="width: 100%; max-width: 540px; background: #0A0A0A; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 32px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.8); margin: auto;">
      <button id="cms-contact-close" style="position: absolute; top: 16px; right: 16px; background: none; border: none; color: #888; font-size: 28px; cursor: pointer; line-height: 1;">&times;</button>
      
      <h3 style="font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 700; color: #FAFAFA; margin-bottom: 8px;">Let's Connect</h3>
      <p style="font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #888; margin-bottom: 24px;">Send a inquiry directly to Sunanda. We will respond within 24 hours.</p>
      
      <form id="cms-contact-form" style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; font-weight:600;">Full Name</label>
          <input type="text" id="lead-name" required placeholder="e.g. Sarah Kim" style="background:#111; border: 1px solid rgba(255,255,255,0.08); padding:10px 14px; border-radius:6px; color:#fff; font-size:0.9rem; outline:none; transition:all 0.2s;" onfocus="this.style.borderColor='#C8FF00'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; font-weight:600;">Email Address</label>
            <input type="email" id="lead-email" required placeholder="name@company.com" style="background:#111; border: 1px solid rgba(255,255,255,0.08); padding:10px 14px; border-radius:6px; color:#fff; font-size:0.9rem; outline:none;" onfocus="this.style.borderColor='#C8FF00'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; font-weight:600;">Phone Number</label>
            <input type="text" id="lead-phone" placeholder="+1 (555) 000-0000" style="background:#111; border: 1px solid rgba(255,255,255,0.08); padding:10px 14px; border-radius:6px; color:#fff; font-size:0.9rem; outline:none;" onfocus="this.style.borderColor='#C8FF00'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; font-weight:600;">Inquiry Type</label>
          <select id="lead-subject" style="background:#111; border: 1px solid rgba(255,255,255,0.08); padding:10px 14px; border-radius:6px; color:#fff; font-size:0.9rem; outline:none;" onfocus="this.style.borderColor='#C8FF00'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
            <option value="Executive Media Coaching">Executive Media Coaching</option>
            <option value="Podcast Curation">Podcast Curation</option>
            <option value="Hosting Corporate Shows">Hosting Corporate Shows</option>
            <option value="Exclusive Interviews">Exclusive Interviews</option>
            <option value="Documentary Storytelling">Documentary Storytelling</option>
            <option value="General Collaboration">General Collaboration</option>
          </select>
        </div>

        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #888; font-weight:600;">Inquiry Message</label>
          <textarea id="lead-message" required rows="4" placeholder="Briefly describe your project details..." style="background:#111; border: 1px solid rgba(255,255,255,0.08); padding:10px 14px; border-radius:6px; color:#fff; font-size:0.9rem; outline:none; resize:none; font-family:inherit; line-height:1.4;" onfocus="this.style.borderColor='#C8FF00'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'"></textarea>
        </div>

        <button type="submit" style="background:#C8FF00; color:#0A0A0A; border:none; padding:12px; font-weight:700; font-size:0.9rem; border-radius:6px; cursor:pointer; font-family:'Syne', sans-serif; letter-spacing:0.5px; text-transform:uppercase; transition:all 0.3s; margin-top:8px;" onmouseover="this.style.backgroundColor='#DEFF66'; this.style.boxShadow='0 0 15px rgba(200,255,0,0.3)'" onmouseout="this.style.backgroundColor='#C8FF00'; this.style.boxShadow='none'">Submit Inquiry</button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);

  const closeForm = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('cms-contact-form').reset();
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeForm();
  });
  document.getElementById('cms-contact-close').addEventListener('click', closeForm);

  // Intercept all contact buttons (any link pointing to mailto: or containing Start a Project text)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href');
      const text = link.textContent.trim().toLowerCase();
      
      const isMailto = href && href.startsWith('mailto:');
      const isContactText = text.includes('start a project') || text.includes('book a call') || text.includes('discovery call');
      
      if (isMailto || isContactText) {
        e.preventDefault();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }
  });

  // Handle Form Submit
  document.getElementById('cms-contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('lead-name').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();
    const subject = document.getElementById('lead-subject').value;
    const message = document.getElementById('lead-message').value.trim();

    // Create lead object
    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      phone,
      subject,
      message,
      date: new Date().toISOString(),
      status: 'new',
      notes: ''
    };

    // Save lead into draft key so admin sees it instantly
    try {
      const activeData = localStorage.getItem('foundery927_admin');
      const parsed = activeData ? JSON.parse(activeData) : defaultData;
      
      parsed.leads = parsed.leads || [];
      parsed.leads.push(newLead);
      
      localStorage.setItem('foundery927_admin', JSON.stringify(parsed));
      
      // Also save to published key if we want to sync
      const pubData = localStorage.getItem('foundery927_published');
      if (pubData) {
        const pubParsed = JSON.parse(pubData);
        pubParsed.leads = pubParsed.leads || [];
        pubParsed.leads.push(newLead);
        localStorage.setItem('foundery927_published', JSON.stringify(pubParsed));
      }
    } catch (err) {
      // Fail silent
    }

    // Success response alert
    alert(followUps.thankYou || 'Thank you for reaching out! We will get back to you shortly.');
    closeForm();
  });
}
