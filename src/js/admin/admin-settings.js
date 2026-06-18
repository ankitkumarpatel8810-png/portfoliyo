/**
 * FOUNDERY927 Admin — Settings & Tab Modules
 */
import { getData, updateData, showToast, escapeHtml, optimizeAndReadImage } from './admin-app.js';

let activeTab = 'general'; // general, seo, socials, followups

export function renderSettings(container) {
  const data = getData();
  if (!data) return;

  const { settings, seo, socials, ctaFollowUps } = data;

  container.innerHTML = `
    <!-- Settings Tabs -->
    <div style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--admin-border); padding-bottom: 12px;">
      <button class="admin-btn btn-settings-tab" data-tab="general" style="${activeTab === 'general' ? 'background: var(--admin-accent); color: #0A0A0A;' : 'background:transparent; color:var(--admin-text-secondary);'}">General</button>
      <button class="admin-btn btn-settings-tab" data-tab="seo" style="${activeTab === 'seo' ? 'background: var(--admin-accent); color: #0A0A0A;' : 'background:transparent; color:var(--admin-text-secondary);'}">SEO Manager</button>
      <button class="admin-btn btn-settings-tab" data-tab="socials" style="${activeTab === 'socials' ? 'background: var(--admin-accent); color: #0A0A0A;' : 'background:transparent; color:var(--admin-text-secondary);'}">Social Links</button>
      <button class="admin-btn btn-settings-tab" data-tab="followups" style="${activeTab === 'followups' ? 'background: var(--admin-accent); color: #0A0A0A;' : 'background:transparent; color:var(--admin-text-secondary);'}">Follow-Up Content</button>
    </div>

    <!-- Form Container -->
    <div class="admin-card" style="max-width: 800px; padding: 24px;">
      <form id="settings-tab-form">
        <!-- Render Active Tab Content -->
        ${renderActiveTabContent(settings, seo, socials, ctaFollowUps)}
      </form>
    </div>
  `;

  // Attach tab handlers
  container.querySelectorAll('.btn-settings-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTab = e.currentTarget.dataset.tab;
      renderSettings(container);
    });
  });

  // Attach image uploader handlers if on SEO tab
  if (activeTab === 'seo') {
    const dropzone = container.querySelector('#dropzone-seo-og');
    const fileInput = container.querySelector('#file-input-seo-og');
    const previewBox = container.querySelector('#img-preview-box-seo-og');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) handleSeoOgImage(file, previewBox, dropzone);
      });

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--admin-accent)';
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--admin-border)';
      });

      dropzone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--admin-border)';
        const file = e.dataTransfer.files[0];
        if (file) handleSeoOgImage(file, previewBox, dropzone);
      });
    }

    const removeBtn = container.querySelector('#btn-remove-seo-og-img');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        previewBox.innerHTML = `<span style="font-size: 0.75rem; color: var(--admin-text-muted);">No Image</span>`;
        removeBtn.remove();
      });
    }
  }

  // Handle submit
  container.querySelector('#settings-tab-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (activeTab === 'general') {
      const siteName = document.getElementById('set-site-name').value.trim();
      const tagline = document.getElementById('set-tagline').value.trim();
      const email = document.getElementById('set-email').value.trim();
      const phone = document.getElementById('set-phone').value.trim();
      const address = document.getElementById('set-address').value.trim();

      const updatedSettings = {
        ...settings,
        siteName,
        tagline,
        email,
        phone,
        address
      };
      updateData('settings', updatedSettings);
      showToast('General settings saved.', 'success');
    }

    else if (activeTab === 'seo') {
      const pageTitle = document.getElementById('seo-title').value.trim();
      const metaDescription = document.getElementById('seo-desc').value.trim();
      const keywords = document.getElementById('seo-keywords').value.trim();
      const ogTitle = document.getElementById('seo-og-title').value.trim();
      const ogDescription = document.getElementById('seo-og-desc').value.trim();

      const previewImg = document.getElementById('seo-og-preview');
      const ogImage = previewImg ? previewImg.dataset.src || '' : '';

      const updatedSeo = {
        pageTitle,
        metaDescription,
        keywords,
        ogTitle,
        ogDescription,
        ogImage
      };
      updateData('seo', updatedSeo);
      showToast('SEO settings saved.', 'success');
    }

    else if (activeTab === 'socials') {
      const twitter = document.getElementById('soc-twitter').value.trim();
      const instagram = document.getElementById('soc-instagram').value.trim();
      const linkedin = document.getElementById('soc-linkedin').value.trim();
      const dribbble = document.getElementById('soc-dribbble').value.trim();
      const youtube = document.getElementById('soc-youtube').value.trim();
      const facebook = document.getElementById('soc-facebook').value.trim();
      const website = document.getElementById('soc-website').value.trim();
      const email = document.getElementById('soc-email').value.trim();
      const phone = document.getElementById('soc-phone').value.trim();
      const whatsapp = document.getElementById('soc-whatsapp').value.trim();

      const updatedSocials = {
        twitter,
        instagram,
        linkedin,
        dribbble,
        youtube,
        facebook,
        website,
        email,
        phone,
        whatsapp
      };

      // Sync settings.socials (for backward compatibility) and data.socials
      const currentData = getData();
      if (currentData) {
        currentData.settings.socials = updatedSocials;
        currentData.settings.email = email;
        currentData.settings.phone = phone;
        currentData.socials = updatedSocials;
        updateData('settings', currentData.settings);
        updateData('socials', updatedSocials);
      }
      showToast('Social links saved successfully.', 'success');
    }

    else if (activeTab === 'followups') {
      const inquiryReceived = document.getElementById('fu-inquiry').value.trim();
      const thankYou = document.getElementById('fu-thankyou').value.trim();
      const coachingFollowUp = document.getElementById('fu-coaching').value.trim();
      const speakingInquiryFollowUp = document.getElementById('fu-speaking').value.trim();
      const collaborationFollowUp = document.getElementById('fu-collab').value.trim();
      const newsletterWelcome = document.getElementById('fu-newsletter').value.trim();

      const updatedFollowUps = {
        inquiryReceived,
        thankYou,
        coachingFollowUp,
        speakingInquiryFollowUp,
        collaborationFollowUp,
        welcomeMessage: newsletterWelcome
      };
      updateData('ctaFollowUps', updatedFollowUps);
      showToast('Follow-up message templates saved.', 'success');
    }

    renderSettings(container);
  });
}

function renderActiveTabContent(settings, seo, socialsData, ctaFollowUps) {
  // If socialsData is undefined, fall back to settings.socials
  const socials = socialsData || settings.socials || {};

  if (activeTab === 'general') {
    return `
      <h4 class="admin-sidebar__section-label" style="margin-top: 0; padding-left: 0;">General Site Settings</h4>
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="set-site-name">Agency Name</label>
          <input type="text" class="admin-input" id="set-site-name" value="${escapeHtml(settings.siteName || 'FOUNDERY927')}" required>
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="set-tagline">Tagline</label>
          <input type="text" class="admin-input" id="set-tagline" value="${escapeHtml(settings.tagline || '')}" required>
        </div>
      </div>
      <div class="admin-form-row" style="margin-top: 16px;">
        <div class="admin-form-group">
          <label class="admin-label" for="set-email">Email Address</label>
          <input type="email" class="admin-input" id="set-email" value="${escapeHtml(settings.email || '')}" required>
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="set-phone">Phone Number</label>
          <input type="text" class="admin-input" id="set-phone" value="${escapeHtml(settings.phone || '')}">
        </div>
      </div>
      <div class="admin-form-group" style="margin-top: 16px;">
        <label class="admin-label" for="set-address">Office Address</label>
        <input type="text" class="admin-input" id="set-address" value="${escapeHtml(settings.address || '')}">
      </div>
      <div style="margin-top: 32px; display: flex; justify-content: flex-end;">
        <button type="submit" class="admin-btn admin-btn--primary">Save General Settings</button>
      </div>
    `;
  }

  if (activeTab === 'seo') {
    return `
      <h4 class="admin-sidebar__section-label" style="margin-top: 0; padding-left: 0;">SEO Metadata Manager</h4>
      
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="seo-title">Page Title Tag</label>
          <input type="text" class="admin-input" id="seo-title" value="${escapeHtml(seo?.pageTitle || '')}" required>
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="seo-keywords">Keywords (comma-separated)</label>
          <input type="text" class="admin-input" id="seo-keywords" value="${escapeHtml(seo?.keywords || '')}">
        </div>
      </div>

      <div class="admin-form-group" style="margin-top: 16px;">
        <label class="admin-label" for="seo-desc">Meta Description</label>
        <textarea class="admin-input" id="seo-desc" rows="3" required>${escapeHtml(seo?.metaDescription || '')}</textarea>
      </div>

      <h4 class="admin-sidebar__section-label" style="margin-top: 24px; padding-left: 0;">Open Graph & Social Sharing</h4>
      
      <div style="display: grid; grid-template-columns: 140px 1fr; gap: 20px; align-items: start; margin-top: 16px;">
        <div id="img-preview-box-seo-og" style="width: 140px; height: 90px; border-radius: var(--admin-radius-sm); border: 1px solid var(--admin-border); background-color: var(--admin-bg-deep); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
          ${seo?.ogImage ? `<img id="seo-og-preview" src="${seo.ogImage}" data-src="${seo.ogImage}" style="width: 100%; height: 100%; object-fit: contain;">` : `
            <span style="font-size: 0.75rem; color: var(--admin-text-muted);">No Image</span>
          `}
        </div>
        <div style="flex: 1;">
          <div id="dropzone-seo-og" style="border: 2px dashed var(--admin-border); border-radius: var(--admin-radius-sm); padding: 16px; text-align: center; cursor: pointer;" class="admin-dropzone">
            <span style="font-size: 0.8rem; color: var(--admin-text-secondary);">Drag & drop or click to upload OG Share Image</span>
            <input type="file" id="file-input-seo-og" accept="image/png, image/jpeg, image/webp" style="display: none;">
          </div>
          ${seo?.ogImage ? `
            <button type="button" class="admin-btn admin-btn--outline admin-btn--sm" id="btn-remove-seo-og-img" style="margin-top: 8px; padding: 4px 10px;">Remove Image</button>
          ` : ''}
        </div>
      </div>

      <div class="admin-form-row" style="margin-top: 16px;">
        <div class="admin-form-group">
          <label class="admin-label" for="seo-og-title">Social Share Title</label>
          <input type="text" class="admin-input" id="seo-og-title" value="${escapeHtml(seo?.ogTitle || '')}" placeholder="Open Graph Title">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="seo-og-desc">Social Share Description</label>
          <input type="text" class="admin-input" id="seo-og-desc" value="${escapeHtml(seo?.ogDescription || '')}" placeholder="Open Graph Description">
        </div>
      </div>

      <div style="margin-top: 32px; display: flex; justify-content: flex-end;">
        <button type="submit" class="admin-btn admin-btn--primary">Save SEO Settings</button>
      </div>
    `;
  }

  if (activeTab === 'socials') {
    return `
      <h4 class="admin-sidebar__section-label" style="margin-top: 0; padding-left: 0;">Social Links Manager</h4>
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="soc-instagram">Instagram URL</label>
          <input type="url" class="admin-input" id="soc-instagram" value="${escapeHtml(socials.instagram || '')}" placeholder="https://instagram.com/...">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="soc-linkedin">LinkedIn URL</label>
          <input type="url" class="admin-input" id="soc-linkedin" value="${escapeHtml(socials.linkedin || '')}" placeholder="https://linkedin.com/in/...">
        </div>
      </div>

      <div class="admin-form-row" style="margin-top: 16px;">
        <div class="admin-form-group">
          <label class="admin-label" for="soc-youtube">YouTube URL</label>
          <input type="url" class="admin-input" id="soc-youtube" value="${escapeHtml(socials.youtube || '')}" placeholder="https://youtube.com/...">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="soc-twitter">Twitter / X URL</label>
          <input type="url" class="admin-input" id="soc-twitter" value="${escapeHtml(socials.twitter || '')}" placeholder="https://x.com/...">
        </div>
      </div>

      <div class="admin-form-row" style="margin-top: 16px;">
        <div class="admin-form-group">
          <label class="admin-label" for="soc-facebook">Facebook URL</label>
          <input type="url" class="admin-input" id="soc-facebook" value="${escapeHtml(socials.facebook || '')}" placeholder="https://facebook.com/...">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="soc-website">Website URL</label>
          <input type="url" class="admin-input" id="soc-website" value="${escapeHtml(socials.website || '')}" placeholder="https://...">
        </div>
      </div>

      <div class="admin-form-row" style="margin-top: 16px;">
        <div class="admin-form-group">
          <label class="admin-label" for="soc-email">Email Coordinate</label>
          <input type="email" class="admin-input" id="soc-email" value="${escapeHtml(socials.email || settings.email || '')}" placeholder="email@address.com">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="soc-phone">Phone Coordinate</label>
          <input type="text" class="admin-input" id="soc-phone" value="${escapeHtml(socials.phone || settings.phone || '')}" placeholder="+1 (555) ...">
        </div>
      </div>

      <div class="admin-form-group" style="margin-top: 16px;">
        <label class="admin-label" for="soc-whatsapp">WhatsApp Link / Number</label>
        <input type="text" class="admin-input" id="soc-whatsapp" value="${escapeHtml(socials.whatsapp || '')}" placeholder="e.g. WhatsApp URL or Phone number">
      </div>

      <div style="margin-top: 32px; display: flex; justify-content: flex-end;">
        <button type="submit" class="admin-btn admin-btn--primary">Save Social Links</button>
      </div>
    `;
  }

  if (activeTab === 'followups') {
    return `
      <h4 class="admin-sidebar__section-label" style="margin-top: 0; padding-left: 0;">Auto-Reply & Follow-up Texts</h4>
      <p style="font-size: 0.8rem; color: var(--admin-text-secondary); margin-bottom: 20px;">Edit follow-up and auto-welcome message templates sent to leads.</p>

      <div class="admin-form-group">
        <label class="admin-label" for="fu-inquiry">Inquiry Received Message</label>
        <textarea class="admin-input" id="fu-inquiry" rows="3" required>${escapeHtml(ctaFollowUps?.inquiryReceived || '')}</textarea>
      </div>

      <div class="admin-form-group" style="margin-top: 16px;">
        <label class="admin-label" for="fu-thankyou">Thank You Message</label>
        <textarea class="admin-input" id="fu-thankyou" rows="3" required>${escapeHtml(ctaFollowUps?.thankYou || '')}</textarea>
      </div>

      <div class="admin-form-group" style="margin-top: 16px;">
        <label class="admin-label" for="fu-coaching">Coaching Inquiry Follow-up</label>
        <textarea class="admin-input" id="fu-coaching" rows="3" required>${escapeHtml(ctaFollowUps?.coachingFollowUp || '')}</textarea>
      </div>

      <div class="admin-form-group" style="margin-top: 16px;">
        <label class="admin-label" for="fu-speaking">Speaking Inquiry Follow-up</label>
        <textarea class="admin-input" id="fu-speaking" rows="3" required>${escapeHtml(ctaFollowUps?.speakingInquiryFollowUp || '')}</textarea>
      </div>

      <div class="admin-form-group" style="margin-top: 16px;">
        <label class="admin-label" for="fu-collab">Collaboration Follow-up</label>
        <textarea class="admin-input" id="fu-collab" rows="3" required>${escapeHtml(ctaFollowUps?.collaborationFollowUp || '')}</textarea>
      </div>

      <div class="admin-form-group" style="margin-top: 16px;">
        <label class="admin-label" for="fu-newsletter">Newsletter Welcome Message</label>
        <textarea class="admin-input" id="fu-newsletter" rows="3" required>${escapeHtml(ctaFollowUps?.welcomeMessage || '')}</textarea>
      </div>

      <div style="margin-top: 32px; display: flex; justify-content: flex-end;">
        <button type="submit" class="admin-btn admin-btn--primary">Save Follow-up Templates</button>
      </div>
    `;
  }

  return '';
}

async function handleSeoOgImage(file, previewBox, dropzone) {
  try {
    dropzone.querySelector('span').textContent = 'Optimizing...';
    const optimized = await optimizeAndReadImage(file);
    
    previewBox.innerHTML = `<img id="seo-og-preview" src="${optimized}" data-src="${optimized}" style="width: 100%; height: 100%; object-fit: contain;">`;
    dropzone.querySelector('span').textContent = 'Drag & drop or click to upload OG Share Image';

    if (!document.getElementById('btn-remove-seo-og-img')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'admin-btn admin-btn--outline admin-btn--sm';
      btn.id = 'btn-remove-seo-og-img';
      btn.style.marginTop = '8px';
      btn.style.padding = '4px 10px';
      btn.textContent = 'Remove Image';
      dropzone.parentNode.appendChild(btn);

      btn.addEventListener('click', () => {
        previewBox.innerHTML = `<span style="font-size: 0.75rem; color: var(--admin-text-muted);">No Image</span>`;
        btn.remove();
      });
    }
    showToast('SEO sharing image uploaded.', 'success');
  } catch (err) {
    dropzone.querySelector('span').textContent = 'Upload failed. Click to retry';
    showToast(`Upload failed: ${err.message}`, 'error');
  }
}
