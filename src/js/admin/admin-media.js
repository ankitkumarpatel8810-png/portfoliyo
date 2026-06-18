/**
 * FOUNDERY927 Admin — Media Module
 */

import { getData, updateData, showToast, showModal, hideModal, showConfirm, generateId, formatFileSize, escapeHtml } from './admin-app.js';

export function renderMedia(container) {
  const data = getData();
  if (!data) return;

  const { media } = data;

  // Add header button
  const headerActions = document.getElementById('page-actions');
  if (headerActions) {
    headerActions.innerHTML = `
      <button class="admin-btn admin-btn--primary" id="btn-upload-media">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <span>Upload File</span>
      </button>
    `;
    document.getElementById('btn-upload-media').addEventListener('click', () => showUploadModal());
  }

  function renderGrid() {
    const mediaContainer = container.querySelector('#media-grid-container');
    if (!mediaContainer) return;

    mediaContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px;">
        ${media.length === 0 ? `
          <div style="grid-column: 1/-1; text-align: center; color: var(--admin-text-secondary); padding: 48px 0;">No media items found.</div>
        ` : media.map(item => {
          const isImg = item.type.startsWith('image/');
          return `
            <div class="admin-card" style="padding: 12px; display: flex; flex-direction: column; justify-content: space-between;" data-id="${item.id}">
              <div style="height: 120px; background-color: var(--admin-bg-deep); border-radius: var(--admin-radius-sm); border: 1px solid var(--admin-border); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                ${isImg ? `
                  <!-- Grayscale hover preview -->
                  <div style="width:100%; height:100%; background: linear-gradient(135deg, rgba(200, 255, 0, 0.1) 0%, rgba(5,5,5,0.4) 100%); display:flex; align-items:center; justify-content:center; font-family: var(--admin-font-display); font-size: 0.85rem; color: var(--admin-accent); font-weight:600;">
                    ${escapeHtml(item.name.split('.').pop().toUpperCase())}
                  </div>
                ` : `
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--admin-text-secondary);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                `}
                
                <button class="admin-btn admin-btn--danger btn-delete-media" data-id="${item.id}" style="position: absolute; top: 4px; right: 4px; padding: 4px; width: 24px; height: 24px; border-radius: 50%; min-width: auto; line-height: 1; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                  &times;
                </button>
              </div>

              <div style="margin-top: 8px;">
                <div style="font-weight: 500; font-size: 0.85rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; color: var(--admin-text);" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                <div style="font-size: 0.75rem; color: var(--admin-text-secondary); margin-top: 4px; display: flex; justify-content: space-between;">
                  <span>${escapeHtml(item.name.split('.').pop().toUpperCase())}</span>
                  <span>${formatFileSize(item.size)}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach deletion handlers
    mediaContainer.querySelectorAll('.btn-delete-media').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        const item = media.find(m => m.id === id);
        if (item) {
          showConfirm(
            'Delete Media Asset',
            `Are you sure you want to delete "${item.name}"?`,
            () => {
              const updated = media.filter(m => m.id !== id);
              updateData('media', updated);
              showToast('Media file deleted.', 'success');
              renderMedia(container);
            }
          );
        }
      });
    });
  }

  container.innerHTML = `
    <!-- Search / Filter -->
    <div class="admin-card" style="padding: 16px; margin-bottom: 24px;">
      <div class="admin-form-group" style="margin-bottom: 0;">
        <input type="text" class="admin-input" id="media-search" placeholder="Search media assets by name...">
      </div>
    </div>

    <!-- Grid Container -->
    <div id="media-grid-container"></div>
  `;

  // Filter functionality
  container.querySelector('#media-search').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    const cards = container.querySelectorAll('[data-id]');
    cards.forEach(card => {
      const id = card.dataset.id;
      const item = media.find(m => m.id === id);
      if (item) {
        const matches = item.name.toLowerCase().includes(val);
        card.style.display = matches ? 'flex' : 'none';
      }
    });
  });

  renderGrid();

  function showUploadModal() {
    const html = `
      <div class="admin-modal__header">
        <h3 class="admin-modal__title">Upload Media File</h3>
        <button class="admin-modal__close" aria-label="Close modal">&times;</button>
      </div>
      <form class="admin-modal__form" id="media-upload-form">
        <div class="admin-form-group">
          <label class="admin-label" for="media-file-name">File Name</label>
          <input type="text" class="admin-input" id="media-file-name" required placeholder="e.g. project-showcase.jpg">
        </div>

        <div class="admin-form-row">
          <div class="admin-form-group">
            <label class="admin-label" for="media-file-type">File Type</label>
            <select class="admin-input" id="media-file-type" required>
              <option value="image/jpeg">JPEG Image</option>
              <option value="image/png">PNG Image</option>
              <option value="image/svg+xml">SVG Graphics</option>
              <option value="video/mp4">MP4 Video</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-label" for="media-file-size">File Size (KB)</label>
            <input type="number" class="admin-input" id="media-file-size" required placeholder="e.g. 150" min="1">
          </div>
        </div>

        <div class="admin-modal__footer" style="margin-top: 24px;">
          <button type="button" class="admin-btn admin-btn--outline admin-modal__close">Cancel</button>
          <button type="submit" class="admin-btn admin-btn--primary">Add to Library</button>
        </div>
      </form>
    `;

    showModal(html);

    document.getElementById('media-upload-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('media-file-name').value.trim();
      const type = document.getElementById('media-file-type').value;
      const sizeKb = parseInt(document.getElementById('media-file-size').value) || 50;

      const newMedia = {
        id: generateId('media'),
        name,
        type,
        size: sizeKb * 1024,
        url: `/assets/${name}`,
        date: new Date().toISOString()
      };

      const updated = [...media, newMedia];
      updateData('media', updated);
      showToast('Media file uploaded successfully.', 'success');
      hideModal();

      renderMedia(container);
    });
  }
}
