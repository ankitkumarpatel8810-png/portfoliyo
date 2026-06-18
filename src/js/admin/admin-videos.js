/**
 * FOUNDERY927 Admin — YouTube Video Manager Module
 */
import { getData, updateData, showToast, showModal, hideModal, showConfirm, generateId, escapeHtml, truncate } from './admin-app.js';

export function renderVideos(container) {
  const data = getData();
  if (!data) return;

  const videos = data.videos || [];
  
  // Sort by order asc
  const sortedVideos = [...videos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Add header button
  const headerActions = document.getElementById('page-actions');
  if (headerActions) {
    headerActions.innerHTML = `
      <button class="admin-btn admin-btn--primary" id="btn-add-video">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Add YouTube Video</span>
      </button>
    `;
    document.getElementById('btn-add-video').addEventListener('click', () => showVideoForm());
  }

  container.innerHTML = `
    <div class="admin-card admin-table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Video Info</th>
            <th>YouTube ID</th>
            <th>Category</th>
            <th>Featured</th>
            <th>Status</th>
            <th>Order</th>
            <th class="admin-table__align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sortedVideos.length === 0 ? `
            <tr>
              <td colspan="7" class="admin-table__empty">No videos found. Click Add to create one.</td>
            </tr>
          ` : sortedVideos.map((vid, idx) => {
            const ytId = getYouTubeId(vid.url) || 'invalid';
            const thumbUrl = ytId !== 'invalid' ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';
            const featuredClass = vid.featured ? 'admin-badge admin-badge--success' : 'admin-badge admin-badge--secondary';
            const publishedClass = vid.published ? 'admin-badge admin-badge--primary' : 'admin-badge';
            
            return `
              <tr data-id="${vid.id}">
                <td>
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="width: 64px; height: 40px; background-color: var(--admin-bg-deep); border-radius: var(--admin-radius-xs); border: 1px solid var(--admin-border); overflow: hidden; display: flex; align-items: center; justify-content: center;">
                      ${thumbUrl ? `<img src="${thumbUrl}" style="width: 100%; height: 100%; object-fit: cover;">` : `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                      `}
                    </div>
                    <div>
                      <div class="admin-table__primary-text">${escapeHtml(vid.title)}</div>
                      <div class="admin-table__secondary-text">${escapeHtml(truncate(vid.description, 50))}</div>
                    </div>
                  </div>
                </td>
                <td><code style="font-size: 0.8rem; background: var(--admin-bg-deep); padding: 2px 6px; border-radius: 4px;">${escapeHtml(ytId)}</code></td>
                <td>${escapeHtml(vid.category || 'Interview')}</td>
                <td><span class="${featuredClass}">${vid.featured ? 'Yes' : 'No'}</span></td>
                <td><span class="${publishedClass}">${vid.published ? 'Published' : 'Draft'}</span></td>
                <td>
                  <div style="display: flex; gap: 4px; align-items: center;">
                    <button class="admin-btn admin-btn--outline admin-btn--icon btn-move-up" data-id="${vid.id}" ${idx === 0 ? 'disabled' : ''} style="padding: 4px;">&uarr;</button>
                    <button class="admin-btn admin-btn--outline admin-btn--icon btn-move-down" data-id="${vid.id}" ${idx === sortedVideos.length - 1 ? 'disabled' : ''} style="padding: 4px;">&darr;</button>
                  </div>
                </td>
                <td class="admin-table__align-right">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="admin-btn admin-btn--outline admin-btn--sm btn-edit-video" data-id="${vid.id}">Edit</button>
                    <button class="admin-btn admin-btn--danger admin-btn--sm btn-delete-video" data-id="${vid.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Attach button handlers
  container.querySelectorAll('.btn-edit-video').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const vid = videos.find(v => v.id === id);
      if (vid) showVideoForm(vid);
    });
  });

  container.querySelectorAll('.btn-delete-video').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const vid = videos.find(v => v.id === id);
      if (vid) {
        showConfirm(
          'Delete Video Card',
          `Are you sure you want to delete "${vid.title}"?`,
          () => {
            const updated = videos.filter(v => v.id !== id);
            updateData('videos', updated);
            showToast('Video card deleted successfully.', 'success');
            renderVideos(container);
          }
        );
      }
    });
  });

  container.querySelectorAll('.btn-move-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      moveVideoOrder(id, -1, container);
    });
  });

  container.querySelectorAll('.btn-move-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      moveVideoOrder(id, 1, container);
    });
  });
}

function moveVideoOrder(id, dir, container) {
  const data = getData();
  if (!data) return;

  const videos = data.videos || [];
  const sorted = [...videos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const idx = sorted.findIndex(v => v.id === id);
  if (idx === -1) return;

  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= sorted.length) return;

  // Swap order values
  const temp = sorted[idx].order ?? idx;
  sorted[idx].order = sorted[targetIdx].order ?? targetIdx;
  sorted[targetIdx].order = temp;

  updateData('videos', sorted);
  renderVideos(container);
  showToast('Video order updated.', 'success');
}

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function showVideoForm(video = null) {
  const isEdit = !!video;
  const titleText = isEdit ? 'Edit YouTube Video' : 'Add YouTube Video';
  const data = getData();
  const videos = data ? data.videos || [] : [];

  const html = `
    <div class="admin-modal__header">
      <h3 class="admin-modal__title">${titleText}</h3>
      <button class="admin-modal__close" aria-label="Close modal">&times;</button>
    </div>
    <form class="admin-modal__form" id="video-form">
      <div class="admin-form-group">
        <label class="admin-label" for="vid-title">Video Title</label>
        <input type="text" class="admin-input" id="vid-title" value="${video ? escapeHtml(video.title) : ''}" required placeholder="e.g. Richard Branson scaling companies">
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="vid-url">YouTube Video URL</label>
        <input type="url" class="admin-input" id="vid-url" value="${video ? escapeHtml(video.url) : ''}" required placeholder="e.g. https://www.youtube.com/watch?v=...">
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="vid-desc">Short Description</label>
        <textarea class="admin-input" id="vid-desc" rows="3" required placeholder="Write a short context description...">${video ? escapeHtml(video.description) : ''}</textarea>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="vid-category">Category / Industry</label>
          <input type="text" class="admin-input" id="vid-category" value="${video ? escapeHtml(video.category) : ''}" required placeholder="e.g. Exclusive Interview">
        </div>
        <div class="admin-form-group" style="justify-content: flex-end; padding-bottom: 8px;">
          <div style="display: flex; gap: 20px; align-items: center;">
            <label class="admin-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="vid-featured" ${video?.featured ? 'checked' : ''} style="width: 16px; height: 16px;">
              <span>Featured Toggle</span>
            </label>
            <label class="admin-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="vid-published" ${video ? (video.published ? 'checked' : '') : 'checked'} style="width: 16px; height: 16px;">
              <span>Published</span>
            </label>
          </div>
        </div>
      </div>

      <div class="admin-modal__footer" style="margin-top: 24px;">
        <button type="button" class="admin-btn admin-btn--outline admin-modal__close">Cancel</button>
        <button type="submit" class="admin-btn admin-btn--primary">Save Video</button>
      </div>
    </form>
  `;

  showModal(html);

  document.getElementById('video-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('vid-title').value.trim();
    const url = document.getElementById('vid-url').value.trim();
    const description = document.getElementById('vid-desc').value.trim();
    const category = document.getElementById('vid-category').value.trim();
    const featured = document.getElementById('vid-featured').checked;
    const published = document.getElementById('vid-published').checked;

    const ytId = getYouTubeId(url);
    if (!ytId) {
      showToast('Invalid YouTube URL. Please enter a valid video link.', 'error');
      return;
    }

    const newVideo = {
      id: video ? video.id : generateId('vid'),
      title,
      url,
      description,
      category,
      featured,
      published,
      order: video ? (video.order ?? 0) : videos.length
    };

    let updatedList;
    if (isEdit) {
      updatedList = videos.map(v => v.id === video.id ? newVideo : v);
      showToast('Video details updated.', 'success');
    } else {
      updatedList = [...videos, newVideo];
      showToast('Video added to library.', 'success');
    }

    updateData('videos', updatedList);
    hideModal();

    const container = document.getElementById('admin-content');
    if (container) renderVideos(container);
  });
}
