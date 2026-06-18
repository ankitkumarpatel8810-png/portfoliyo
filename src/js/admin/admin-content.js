/**
 * FOUNDERY927 Admin — Visual Content Manager Module
 */
import { getData, updateData, showToast, escapeHtml, optimizeAndReadImage } from './admin-app.js';

let currentSection = 'hero';

const sectionsConfig = {
  hero: {
    label: 'Hero Section',
    fields: [
      { name: 'heading', label: 'Heading / Title', type: 'text' },
      { name: 'subheading', label: 'Subheading / Tagline', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Founder Image', type: 'image' },
      { name: 'cta1Text', label: 'Primary CTA Button Text', type: 'text' },
      { name: 'cta1Link', label: 'Primary CTA Button Link', type: 'text' },
      { name: 'cta2Text', label: 'Secondary CTA Button Text', type: 'text' },
      { name: 'cta2Link', label: 'Secondary CTA Button Link', type: 'text' }
    ]
  },
  featuredInterviews: {
    label: 'Featured Interviews (Work)',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'text' },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'paragraph', label: 'Description Paragraph', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  featuredLeaders: {
    label: 'Featured Leaders (Team)',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'text' },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'paragraph', label: 'Description Paragraph', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  aboutSection: {
    label: 'About Section',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'textarea', rows: 2 },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'paragraph1', label: 'Biography Paragraph 1', type: 'textarea', rows: 4 },
      { name: 'paragraph2', label: 'Biography Paragraph 2', type: 'textarea', rows: 4 },
      { name: 'quote', label: 'Founder Signature Quote', type: 'textarea', rows: 3 },
      { name: 'quoteAuthor', label: 'Quote Attribution', type: 'text' },
      { name: 'image', label: 'About Portrait/Landscape Image', type: 'image' }
    ]
  },
  foundry927Overview: {
    label: 'Overview & Metrics',
    fields: [
      { name: 'heading', label: 'Trusted Marquee Header', type: 'text' },
      { name: 'stat1Number', label: 'Stat 1 Value', type: 'text' },
      { name: 'stat1Label', label: 'Stat 1 Label', type: 'text' },
      { name: 'stat2Number', label: 'Stat 2 Value', type: 'text' },
      { name: 'stat2Label', label: 'Stat 2 Label', type: 'text' },
      { name: 'stat3Number', label: 'Stat 3 Value', type: 'text' },
      { name: 'stat3Label', label: 'Stat 3 Label', type: 'text' },
      { name: 'stat4Number', label: 'Stat 4 Value', type: 'text' },
      { name: 'stat4Label', label: 'Stat 4 Label', type: 'text' },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  services: {
    label: 'Services / What We Do',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'text' },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'paragraph', label: 'Description Paragraph', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  insights: {
    label: 'Insights Section',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'text' },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'paragraph', label: 'Description Paragraph', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  impact: {
    label: 'Impact & Testimonials',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'text' },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  awards: {
    label: 'Awards Section',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'text' },
      { name: 'subheading', label: 'Section Subheading', type: 'textarea', rows: 2 },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  collaborate: {
    label: 'Collaborate (Let\'s Build)',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'textarea', rows: 2 },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  newsletter: {
    label: 'Newsletter Section',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'text' },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'paragraph', label: 'Description Paragraph', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  contact: {
    label: 'Contact Section',
    fields: [
      { name: 'heading', label: 'Section Heading', type: 'text' },
      { name: 'subheading', label: 'Section Subheading', type: 'text' },
      { name: 'paragraph', label: 'Description Paragraph', type: 'textarea', rows: 3 },
      { name: 'image', label: 'Section Background Image', type: 'image' }
    ]
  },
  footer: {
    label: 'Footer Content',
    fields: [
      { name: 'description', label: 'Agency Description', type: 'textarea', rows: 3 },
      { name: 'copyright', label: 'Copyright Notice', type: 'text' },
      { name: 'image', label: 'Footer Logo / Background Image', type: 'image' }
    ]
  }
};

export function renderContent(container) {
  const data = getData();
  if (!data) return;

  const pageContent = data.pageContent || {};

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 240px 1fr; gap: 24px; min-height: calc(100vh - 200px);">
      <!-- Sidebar Selector -->
      <div class="admin-card" style="padding: 12px; display: flex; flex-direction: column; gap: 4px;">
        <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--admin-text-muted); margin-bottom: 8px; font-weight: 600; padding: 4px 8px;">Select Section</h4>
        ${Object.entries(sectionsConfig).map(([key, cfg]) => {
          const activeClass = key === currentSection ? 'background-color: var(--admin-border); color: var(--admin-text); font-weight: 500;' : 'color: var(--admin-text-secondary);';
          return `
            <button class="admin-btn-section-selector" data-section="${key}" style="text-align: left; background: none; border: none; padding: 8px 12px; border-radius: var(--admin-radius-sm); font-size: 0.85rem; cursor: pointer; transition: all 0.2s; ${activeClass}">
              ${escapeHtml(cfg.label)}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Editor Card -->
      <div class="admin-card" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
        <form id="section-editor-form">
          <div style="border-bottom: 1px solid var(--admin-border); padding-bottom: 12px; margin-bottom: 24px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="font-family: var(--admin-font-display); font-size: 1.25rem; font-weight: 600;">Edit ${escapeHtml(sectionsConfig[currentSection].label)}</h3>
              <p style="font-size: 0.8rem; color: var(--admin-text-secondary); margin-top: 4px;">Update copy and visual resources for this page area.</p>
            </div>
            <button type="button" class="admin-btn admin-btn--outline admin-btn--sm" id="btn-preview-section">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview
            </button>
          </div>

          <div id="section-fields-container" style="display: flex; flex-direction: column; gap: 16px;">
            <!-- Fields Rendered Dynamically -->
          </div>

          <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--admin-border); padding-top: 20px;">
            <button type="button" class="admin-btn admin-btn--outline" id="btn-reset-fields">Discard Draft</button>
            <button type="submit" class="admin-btn admin-btn--primary">Save Draft</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Selector handlers
  container.querySelectorAll('.admin-btn-section-selector').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentSection = e.currentTarget.dataset.section;
      renderContent(container);
    });
  });

  // Render Section fields
  renderFields(container, pageContent[currentSection] || {});

  // Reset handler
  document.getElementById('btn-reset-fields').addEventListener('click', () => {
    renderContent(container);
    showToast('Draft changes discarded.', 'info');
  });

  // Preview handler
  document.getElementById('btn-preview-section').addEventListener('click', () => {
    window.open(`/?preview=true#${currentSection}`, '_blank');
  });

  // Form submit handler
  document.getElementById('section-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const config = sectionsConfig[currentSection];
    const sectionData = pageContent[currentSection] || {};
    
    config.fields.forEach(field => {
      if (field.type === 'image') {
        const previewImg = document.getElementById(`img-preview-${field.name}`);
        sectionData[field.name] = previewImg ? previewImg.dataset.src || '' : '';
      } else {
        const input = document.getElementById(`field-${field.name}`);
        if (input) {
          sectionData[field.name] = input.value;
        }
      }
    });

    pageContent[currentSection] = sectionData;
    updateData('pageContent', pageContent);
    showToast('Draft section contents saved.', 'success');
  });
}

function renderFields(container, activeData) {
  const fieldsContainer = container.querySelector('#section-fields-container');
  if (!fieldsContainer) return;

  const config = sectionsConfig[currentSection];
  
  fieldsContainer.innerHTML = config.fields.map(field => {
    const value = activeData[field.name] || '';
    
    if (field.type === 'text') {
      return `
        <div class="admin-form-group">
          <label class="admin-label" for="field-${field.name}">${escapeHtml(field.label)}</label>
          <input type="text" class="admin-input" id="field-${field.name}" value="${escapeHtml(value)}">
        </div>
      `;
    }
    
    if (field.type === 'textarea') {
      return `
        <div class="admin-form-group">
          <label class="admin-label" for="field-${field.name}">${escapeHtml(field.label)}</label>
          <textarea class="admin-input" id="field-${field.name}" rows="${field.rows || 3}">${escapeHtml(value)}</textarea>
        </div>
      `;
    }

    if (field.type === 'image') {
      return `
        <div class="admin-form-group">
          <label class="admin-label">${escapeHtml(field.label)}</label>
          <div style="display: flex; gap: 16px; align-items: flex-start;">
            <div id="img-preview-box-${field.name}" style="width: 120px; height: 120px; border-radius: var(--admin-radius-sm); border: 1px solid var(--admin-border); background-color: var(--admin-bg-deep); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
              ${value ? `<img id="img-preview-${field.name}" src="${value}" data-src="${value}" style="width: 100%; height: 100%; object-fit: contain;">` : `
                <span id="img-placeholder-${field.name}" style="font-size: 0.75rem; color: var(--admin-text-muted);">No Image</span>
              `}
            </div>
            <div style="flex: 1;">
              <div id="dropzone-${field.name}" style="border: 2px dashed var(--admin-border); border-radius: var(--admin-radius-sm); padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s;" class="admin-dropzone">
                <span style="font-size: 0.85rem; color: var(--admin-text-secondary);">Drag & drop image here or click to browse</span>
                <input type="file" id="file-input-${field.name}" accept="image/png, image/jpeg, image/webp" style="display: none;">
              </div>
              <p style="font-size: 0.75rem; color: var(--admin-text-muted); margin-top: 8px;">Supports JPG, PNG, WEBP. Keeps layout aspect ratio intact.</p>
              <button type="button" class="admin-btn admin-btn--outline admin-btn--sm btn-remove-section-img" id="btn-remove-section-img-${field.name}" data-field="${field.name}" style="margin-top: 8px; padding: 4px 10px; display: ${value ? 'inline-block' : 'none'};">
                Remove Image
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }).join('');

  // Wire up uploader dropzones
  config.fields.forEach(field => {
    if (field.type === 'image') {
      const dropzone = fieldsContainer.querySelector(`#dropzone-${field.name}`);
      const fileInput = fieldsContainer.querySelector(`#file-input-${field.name}`);
      const previewBox = fieldsContainer.querySelector(`#img-preview-box-${field.name}`);

      if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());

        // File Select
        fileInput.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (file) handleImageFile(file, field.name, previewBox, dropzone);
        });

        // Drag/Drop events
        dropzone.addEventListener('dragover', (e) => {
          e.preventDefault();
          dropzone.style.borderColor = 'var(--admin-accent)';
          dropzone.style.backgroundColor = 'rgba(200, 255, 0, 0.02)';
        });

        const resetDropzoneStyle = () => {
          dropzone.style.borderColor = 'var(--admin-border)';
          dropzone.style.backgroundColor = 'transparent';
        };

        dropzone.addEventListener('dragleave', resetDropzoneStyle);
        dropzone.addEventListener('drop', async (e) => {
          e.preventDefault();
          resetDropzoneStyle();
          const file = e.dataTransfer.files[0];
          if (file) handleImageFile(file, field.name, previewBox, dropzone);
        });
      }

      // Remove Image handler
      const removeBtn = fieldsContainer.querySelector(`#btn-remove-section-img-${field.name}`);
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          previewBox.innerHTML = `<span id="img-placeholder-${field.name}" style="font-size: 0.75rem; color: var(--admin-text-muted);">No Image</span>`;
          removeBtn.style.display = 'none';
          showToast('Image cleared. Save changes to apply.', 'info');
        });
      }
    }
  });
}

async function handleImageFile(file, fieldName, previewBox, dropzone) {
  try {
    dropzone.querySelector('span').textContent = 'Optimizing & loading...';
    const optimizedBase64 = await optimizeAndReadImage(file);
    
    // Update preview box
    previewBox.innerHTML = `<img id="img-preview-${fieldName}" src="${optimizedBase64}" data-src="${optimizedBase64}" style="width: 100%; height: 100%; object-fit: contain;">`;
    
    // Show remove button immediately
    const removeBtn = document.getElementById(`btn-remove-section-img-${fieldName}`);
    if (removeBtn) {
      removeBtn.style.display = 'inline-block';
    }
    
    dropzone.querySelector('span').textContent = 'Drag & drop image here or click to browse';
    showToast('Image uploaded and optimized successfully.', 'success');
  } catch (err) {
    dropzone.querySelector('span').textContent = 'Upload failed. Click to retry';
    showToast(`Upload failed: ${err.message}`, 'error');
  }
}
