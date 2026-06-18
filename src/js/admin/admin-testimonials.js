/**
 * FOUNDERY927 Admin — Testimonials & Reviews CRUD Module
 */
import { getData, updateData, showToast, showModal, hideModal, showConfirm, generateId, escapeHtml, truncate, optimizeAndReadImage } from './admin-app.js';

export function renderTestimonials(container) {
  const data = getData();
  if (!data) return;

  const testimonials = data.testimonials || [];
  
  // Sort by order asc
  const sortedTestimonials = [...testimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Add header button
  const headerActions = document.getElementById('page-actions');
  if (headerActions) {
    headerActions.innerHTML = `
      <button class="admin-btn admin-btn--primary" id="btn-add-testimonial">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Add Testimonial</span>
      </button>
    `;
    document.getElementById('btn-add-testimonial').addEventListener('click', () => showTestimonialForm());
  }

  // Render Table
  container.innerHTML = `
    <div class="admin-card admin-table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Author</th>
            <th>Company</th>
            <th>Quote</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Order</th>
            <th class="admin-table__align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sortedTestimonials.length === 0 ? `
            <tr>
              <td colspan="7" class="admin-table__empty">No testimonials found. Create one to get started.</td>
            </tr>
          ` : sortedTestimonials.map((test, idx) => {
            const statusClass = test.published ? 'admin-badge admin-badge--primary' : 'admin-badge';
            const stars = '★'.repeat(test.rating || 5) + '☆'.repeat(5 - (test.rating || 5));
            
            return `
              <tr data-id="${test.id}">
                <td>
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--admin-border); background-color: var(--admin-bg-deep); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                      ${test.image ? `<img src="${test.image}" style="width:100%; height:100%; object-fit: cover;">` : `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--admin-text-secondary);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      `}
                    </div>
                    <div>
                      <div class="admin-table__primary-text">${escapeHtml(test.name)}</div>
                      <div class="admin-table__secondary-text">${escapeHtml(test.role)}</div>
                    </div>
                  </div>
                </td>
                <td>${escapeHtml(test.company)}</td>
                <td><div class="admin-table__secondary-text">“${escapeHtml(truncate(test.quote, 60))}”</div></td>
                <td><span style="color: var(--admin-accent); font-size: 0.95rem;">${stars}</span></td>
                <td><span class="${statusClass}">${test.published ? 'Published' : 'Draft'}</span></td>
                <td>
                  <div style="display: flex; gap: 4px; align-items: center;">
                    <button class="admin-btn admin-btn--outline admin-btn--icon btn-move-test-up" data-id="${test.id}" ${idx === 0 ? 'disabled' : ''} style="padding: 4px;">&uarr;</button>
                    <button class="admin-btn admin-btn--outline admin-btn--icon btn-move-test-down" data-id="${test.id}" ${idx === sortedTestimonials.length - 1 ? 'disabled' : ''} style="padding: 4px;">&darr;</button>
                  </div>
                </td>
                <td class="admin-table__align-right">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="admin-btn admin-btn--outline admin-btn--sm btn-edit-test" data-id="${test.id}">Edit</button>
                    <button class="admin-btn admin-btn--danger admin-btn--sm btn-delete-test" data-id="${test.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Attach button listeners
  container.querySelectorAll('.btn-edit-test').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      const test = testimonials.find(t => t.id === id);
      if (test) showTestimonialForm(test);
    });
  });

  container.querySelectorAll('.btn-delete-test').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      const test = testimonials.find(t => t.id === id);
      if (test) {
        showConfirm(
          'Delete Testimonial',
          `Are you sure you want to delete the testimonial from "${test.name}"?`,
          () => {
            const updated = testimonials.filter(t => t.id !== id);
            updateData('testimonials', updated);
            showToast('Testimonial deleted successfully.', 'success');
            renderTestimonials(container);
          }
        );
      }
    });
  });

  container.querySelectorAll('.btn-move-test-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      moveTestimonialOrder(id, -1, container);
    });
  });

  container.querySelectorAll('.btn-move-test-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      moveTestimonialOrder(id, 1, container);
    });
  });
}

function moveTestimonialOrder(id, dir, container) {
  const data = getData();
  if (!data) return;

  const testimonials = data.testimonials || [];
  const sorted = [...testimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const idx = sorted.findIndex(t => t.id === id);
  if (idx === -1) return;

  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= sorted.length) return;

  // Swap order
  const temp = sorted[idx].order ?? idx;
  sorted[idx].order = sorted[targetIdx].order ?? targetIdx;
  sorted[targetIdx].order = temp;

  updateData('testimonials', sorted);
  renderTestimonials(container);
  showToast('Testimonial order updated.', 'success');
}

function showTestimonialForm(testimonial = null) {
  const isEdit = !!testimonial;
  const titleText = isEdit ? 'Edit Testimonial' : 'Add Testimonial';
  const data = getData();
  const testimonials = data ? data.testimonials || [] : [];

  const html = `
    <div class="admin-modal__header">
      <h3 class="admin-modal__title">${titleText}</h3>
      <button class="admin-modal__close" aria-label="Close modal">&times;</button>
    </div>
    <form class="admin-modal__form" id="testimonial-form">
      <div style="display: grid; grid-template-columns: 80px 1fr; gap: 16px; align-items: start; margin-bottom: 16px;">
        <div id="modal-client-preview-box" style="width: 80px; height: 80px; border-radius: 50%; border: 1px solid var(--admin-border); background-color: var(--admin-bg-deep); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
          ${testimonial?.image ? `<img id="client-img-preview" src="${testimonial.image}" data-src="${testimonial.image}" style="width: 100%; height: 100%; object-fit: cover;">` : `
            <span id="client-img-placeholder" style="font-size: 0.65rem; color: var(--admin-text-muted);">Avatar</span>
          `}
        </div>
        <div style="flex: 1;">
          <div id="modal-client-dropzone" style="border: 2px dashed var(--admin-border); border-radius: var(--admin-radius-sm); padding: 12px; text-align: center; cursor: pointer;" class="admin-dropzone">
            <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">Drag & drop or click to upload photo</span>
            <input type="file" id="client-file-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
          </div>
          ${testimonial?.image ? `
            <button type="button" class="admin-btn admin-btn--outline admin-btn--sm" id="btn-remove-client-img" style="margin-top: 8px; padding: 4px 10px;">Remove Image</button>
          ` : ''}
        </div>
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="test-name">Author Name</label>
        <input type="text" class="admin-input" id="test-name" value="${testimonial ? escapeHtml(testimonial.name) : ''}" required placeholder="e.g. Sarah Kim">
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="test-role">Designation / Role</label>
          <input type="text" class="admin-input" id="test-role" value="${testimonial ? escapeHtml(testimonial.role) : ''}" required placeholder="e.g. CEO">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="test-company">Company</label>
          <input type="text" class="admin-input" id="test-company" value="${testimonial ? escapeHtml(testimonial.company) : ''}" required placeholder="e.g. NOVA">
        </div>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="test-rating">Rating Score</label>
          <select class="admin-input" id="test-rating">
            <option value="5" ${testimonial?.rating === 5 ? 'selected' : ''}>5 Stars (Excellent)</option>
            <option value="4" ${testimonial?.rating === 4 ? 'selected' : ''}>4 Stars (Good)</option>
            <option value="3" ${testimonial?.rating === 3 ? 'selected' : ''}>3 Stars (Average)</option>
            <option value="2" ${testimonial?.rating === 2 ? 'selected' : ''}>2 Stars (Poor)</option>
            <option value="1" ${testimonial?.rating === 1 ? 'selected' : ''}>1 Star (Unacceptable)</option>
          </select>
        </div>
        <div class="admin-form-group" style="justify-content: flex-end; padding-bottom: 8px;">
          <label class="admin-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="test-published" ${testimonial ? (testimonial.published ? 'checked' : '') : 'checked'} style="width: 16px; height: 16px;">
            <span>Publish Testimonial</span>
          </label>
        </div>
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="test-quote">Quote / Review Content</label>
        <textarea class="admin-input" id="test-quote" rows="4" required placeholder="Write the client's quote here...">${testimonial ? escapeHtml(testimonial.quote) : ''}</textarea>
      </div>

      <div class="admin-modal__footer" style="margin-top: 24px;">
        <button type="button" class="admin-btn admin-btn--outline admin-modal__close">Cancel</button>
        <button type="submit" class="admin-btn admin-btn--primary">Save Testimonial</button>
      </div>
    </form>
  `;

  showModal(html);

  // Upload handlers
  const dropzone = document.getElementById('modal-client-dropzone');
  const fileInput = document.getElementById('client-file-input');
  const previewBox = document.getElementById('modal-client-preview-box');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) handleClientImageFile(file, previewBox, dropzone);
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
      if (file) handleClientImageFile(file, previewBox, dropzone);
    });
  }

  // Remove image button
  const removeBtn = document.getElementById('btn-remove-client-img');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      previewBox.innerHTML = `<span id="client-img-placeholder" style="font-size: 0.65rem; color: var(--admin-text-muted);">Avatar</span>`;
      removeBtn.remove();
    });
  }

  // Handle submit
  document.getElementById('testimonial-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('test-name').value.trim();
    const role = document.getElementById('test-role').value.trim();
    const company = document.getElementById('test-company').value.trim();
    const quote = document.getElementById('test-quote').value.trim();
    const rating = parseInt(document.getElementById('test-rating').value) || 5;
    const published = document.getElementById('test-published').checked;

    // Get Avatar Image base64
    const previewImg = document.getElementById('client-img-preview');
    const image = previewImg ? previewImg.dataset.src || '' : '';

    const newTest = {
      id: testimonial ? testimonial.id : generateId('test'),
      name,
      role,
      company,
      quote,
      rating,
      image,
      published,
      order: testimonial ? (testimonial.order ?? 0) : testimonials.length
    };

    let updatedList;
    if (isEdit) {
      updatedList = testimonials.map(t => t.id === testimonial.id ? newTest : t);
      showToast('Testimonial updated successfully.', 'success');
    } else {
      updatedList = [...testimonials, newTest];
      showToast('Testimonial created successfully.', 'success');
    }

    updateData('testimonials', updatedList);
    hideModal();

    const container = document.getElementById('admin-content');
    if (container) renderTestimonials(container);
  });
}

async function handleClientImageFile(file, previewBox, dropzone) {
  try {
    dropzone.querySelector('span').textContent = 'Optimizing...';
    const optimized = await optimizeAndReadImage(file);
    
    previewBox.innerHTML = `<img id="client-img-preview" src="${optimized}" data-src="${optimized}" style="width: 100%; height: 100%; object-fit: cover;">`;
    dropzone.querySelector('span').textContent = 'Drag & drop or click to upload photo';
    
    // Add remove button if not exists
    if (!document.getElementById('btn-remove-client-img')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'admin-btn admin-btn--outline admin-btn--sm';
      btn.id = 'btn-remove-client-img';
      btn.style.marginTop = '8px';
      btn.style.padding = '4px 10px';
      btn.textContent = 'Remove Image';
      dropzone.parentNode.appendChild(btn);
      
      btn.addEventListener('click', () => {
        previewBox.innerHTML = `<span id="client-img-placeholder" style="font-size: 0.65rem; color: var(--admin-text-muted);">Avatar</span>`;
        btn.remove();
      });
    }
    showToast('Client avatar uploaded.', 'success');
  } catch (err) {
    dropzone.querySelector('span').textContent = 'Upload failed. Click to retry';
    showToast(`Upload failed: ${err.message}`, 'error');
  }
}
