/**
 * FOUNDERY927 Admin — Team & Featured Leaders CRUD Module
 */
import { getData, updateData, showToast, showModal, hideModal, showConfirm, generateId, escapeHtml, optimizeAndReadImage } from './admin-app.js';

export function renderTeam(container) {
  const data = getData();
  if (!data) return;

  const team = data.team || [];
  
  // Sort by order asc
  const sortedTeam = [...team].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Add header button
  const headerActions = document.getElementById('page-actions');
  if (headerActions) {
    headerActions.innerHTML = `
      <button class="admin-btn admin-btn--primary" id="btn-add-team">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Add Leader / Member</span>
      </button>
    `;
    document.getElementById('btn-add-team').addEventListener('click', () => showTeamForm());
  }

  // Render Table
  container.innerHTML = `
    <div class="admin-card admin-table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Leader / Member</th>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Order</th>
            <th class="admin-table__align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sortedTeam.length === 0 ? `
            <tr>
              <td colspan="6" class="admin-table__empty">No members found. Create one to get started.</td>
            </tr>
          ` : sortedTeam.map((member, idx) => {
            const statusClass = member.published ? 'admin-badge admin-badge--primary' : 'admin-badge';
            
            return `
              <tr data-id="${member.id}">
                <td>
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="width: 40px; height: 40px; border-radius: var(--admin-radius-sm); border: 1px solid var(--admin-border); background-color: var(--admin-bg-deep); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                      ${member.image ? `<img src="${member.image}" style="width:100%; height:100%; object-fit: cover;">` : `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--admin-text-secondary);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      `}
                    </div>
                    <div>
                      <div class="admin-table__primary-text">${escapeHtml(member.name)}</div>
                    </div>
                  </div>
                </td>
                <td><div class="admin-table__primary-text">${escapeHtml(member.company || 'FOUNDRY927')}</div></td>
                <td><div class="admin-table__primary-text">${escapeHtml(member.role)}</div></td>
                <td><span class="${statusClass}">${member.published ? 'Published' : 'Draft'}</span></td>
                <td>
                  <div style="display: flex; gap: 4px; align-items: center;">
                    <button class="admin-btn admin-btn--outline admin-btn--icon btn-move-team-up" data-id="${member.id}" ${idx === 0 ? 'disabled' : ''} style="padding: 4px;">&uarr;</button>
                    <button class="admin-btn admin-btn--outline admin-btn--icon btn-move-team-down" data-id="${member.id}" ${idx === sortedTeam.length - 1 ? 'disabled' : ''} style="padding: 4px;">&darr;</button>
                  </div>
                </td>
                <td class="admin-table__align-right">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="admin-btn admin-btn--outline admin-btn--sm btn-edit-team" data-id="${member.id}">Edit</button>
                    <button class="admin-btn admin-btn--danger admin-btn--sm btn-delete-team" data-id="${member.id}">Delete</button>
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
  container.querySelectorAll('.btn-edit-team').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      const member = team.find(t => t.id === id);
      if (member) showTeamForm(member);
    });
  });

  container.querySelectorAll('.btn-delete-team').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      const member = team.find(t => t.id === id);
      if (member) {
        showConfirm(
          'Delete Team Member',
          `Are you sure you want to delete "${member.name}"?`,
          () => {
            const updated = team.filter(t => t.id !== id);
            updateData('team', updated);
            showToast('Team member deleted successfully.', 'success');
            renderTeam(container);
          }
        );
      }
    });
  });

  container.querySelectorAll('.btn-move-team-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      moveTeamOrder(id, -1, container);
    });
  });

  container.querySelectorAll('.btn-move-team-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      moveTeamOrder(id, 1, container);
    });
  });
}

function moveTeamOrder(id, dir, container) {
  const data = getData();
  if (!data) return;

  const team = data.team || [];
  const sorted = [...team].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const idx = sorted.findIndex(t => t.id === id);
  if (idx === -1) return;

  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= sorted.length) return;

  // Swap order values
  const temp = sorted[idx].order ?? idx;
  sorted[idx].order = sorted[targetIdx].order ?? targetIdx;
  sorted[targetIdx].order = temp;

  updateData('team', sorted);
  renderTeam(container);
  showToast('Member order updated.', 'success');
}

function showTeamForm(member = null) {
  const isEdit = !!member;
  const titleText = isEdit ? 'Edit Leader Details' : 'Add Leader / Member';
  const data = getData();
  const team = data ? data.team || [] : [];

  const html = `
    <div class="admin-modal__header">
      <h3 class="admin-modal__title">${titleText}</h3>
      <button class="admin-modal__close" aria-label="Close modal">&times;</button>
    </div>
    <form class="admin-modal__form" id="team-form">
      <div style="display: grid; grid-template-columns: 100px 1fr; gap: 20px; align-items: start; margin-bottom: 16px;">
        <div id="modal-img-preview-box" style="width: 100px; height: 100px; border-radius: var(--admin-radius-sm); border: 1px solid var(--admin-border); background-color: var(--admin-bg-deep); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
          ${member?.image ? `<img id="leader-img-preview" src="${member.image}" data-src="${member.image}" style="width: 100%; height: 100%; object-fit: cover;">` : `
            <span id="leader-img-placeholder" style="font-size: 0.7rem; color: var(--admin-text-muted);">No Image</span>
          `}
        </div>
        <div style="flex: 1;">
          <div id="modal-leader-dropzone" style="border: 2px dashed var(--admin-border); border-radius: var(--admin-radius-sm); padding: 16px; text-align: center; cursor: pointer;" class="admin-dropzone">
            <span style="font-size: 0.8rem; color: var(--admin-text-secondary);">Drag & drop or click to upload photo</span>
            <input type="file" id="leader-file-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
          </div>
          ${member?.image ? `
            <button type="button" class="admin-btn admin-btn--outline admin-btn--sm" id="btn-remove-leader-img" style="margin-top: 8px; padding: 4px 10px;">Remove Image</button>
          ` : ''}
        </div>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="member-name">Name</label>
          <input type="text" class="admin-input" id="member-name" value="${member ? escapeHtml(member.name) : ''}" required placeholder="e.g. Sofia Rodriguez">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="member-role">Designation / Role</label>
          <input type="text" class="admin-input" id="member-role" value="${member ? escapeHtml(member.role) : ''}" required placeholder="e.g. Design Lead">
        </div>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="member-company">Company</label>
          <input type="text" class="admin-input" id="member-company" value="${member ? escapeHtml(member.company || 'FOUNDRY927') : 'FOUNDRY927'}" placeholder="e.g. FOUNDRY927">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="member-link">YouTube / Interview Link</label>
          <input type="url" class="admin-input" id="member-link" value="${member ? escapeHtml(member.link || '') : ''}" placeholder="e.g. https://youtube.com/...">
        </div>
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="member-desc">Short Biography / Description</label>
        <textarea class="admin-input" id="member-desc" rows="3" placeholder="Write a short description...">${member ? escapeHtml(member.description || '') : ''}</textarea>
      </div>

      <div class="admin-sidebar__section-label" style="margin: 16px 0 8px 0; padding: 0;">Social Coordinates</div>
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="member-twitter">Twitter / X URL</label>
          <input type="text" class="admin-input" id="member-twitter" value="${member?.social?.twitter || ''}" placeholder="e.g. # or URL">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="member-linkedin">LinkedIn URL</label>
          <input type="text" class="admin-input" id="member-linkedin" value="${member?.social?.linkedin || ''}" placeholder="e.g. # or URL">
        </div>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="member-dribbble">Dribbble URL (Optional)</label>
          <input type="text" class="admin-input" id="member-dribbble" value="${member?.social?.dribbble || ''}" placeholder="e.g. #">
        </div>
        <div class="admin-form-group" style="justify-content: flex-end; padding-bottom: 8px;">
          <label class="admin-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="member-published" ${member ? (member.published ? 'checked' : '') : 'checked'} style="width: 16px; height: 16px;">
            <span>Publish Card (Visible on Live Site)</span>
          </label>
        </div>
      </div>

      <div class="admin-modal__footer" style="margin-top: 24px;">
        <button type="button" class="admin-btn admin-btn--outline admin-modal__close">Cancel</button>
        <button type="submit" class="admin-btn admin-btn--primary">Save Member</button>
      </div>
    </form>
  `;

  showModal(html);

  // Upload handlers inside modal
  const dropzone = document.getElementById('modal-leader-dropzone');
  const fileInput = document.getElementById('leader-file-input');
  const previewBox = document.getElementById('modal-img-preview-box');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) handleLeaderImageFile(file, previewBox, dropzone);
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
      if (file) handleLeaderImageFile(file, previewBox, dropzone);
    });
  }

  // Remove image button
  const removeBtn = document.getElementById('btn-remove-leader-img');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      previewBox.innerHTML = `<span id="leader-img-placeholder" style="font-size: 0.7rem; color: var(--admin-text-muted);">No Image</span>`;
      removeBtn.remove();
    });
  }

  // Handle submit
  document.getElementById('team-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('member-name').value.trim();
    const role = document.getElementById('member-role').value.trim();
    const company = document.getElementById('member-company').value.trim();
    const link = document.getElementById('member-link').value.trim();
    const description = document.getElementById('member-desc').value.trim();
    const published = document.getElementById('member-published').checked;
    
    // Get portrait base64
    const previewImg = document.getElementById('leader-img-preview');
    const image = previewImg ? previewImg.dataset.src || '' : '';

    const social = {};
    const twitter = document.getElementById('member-twitter').value.trim();
    const linkedin = document.getElementById('member-linkedin').value.trim();
    const dribbble = document.getElementById('member-dribbble').value.trim();

    if (twitter) social.twitter = twitter;
    if (linkedin) social.linkedin = linkedin;
    if (dribbble) social.dribbble = dribbble;

    const newMember = {
      id: member ? member.id : generateId('member'),
      name,
      role,
      company,
      link,
      description,
      image,
      social,
      published,
      order: member ? (member.order ?? 0) : team.length
    };

    let updatedList;
    if (isEdit) {
      updatedList = team.map(t => t.id === member.id ? newMember : t);
      showToast('Leader details updated successfully.', 'success');
    } else {
      updatedList = [...team, newMember];
      showToast('Leader created successfully.', 'success');
    }

    updateData('team', updatedList);
    hideModal();

    const container = document.getElementById('admin-content');
    if (container) renderTeam(container);
  });
}

async function handleLeaderImageFile(file, previewBox, dropzone) {
  try {
    dropzone.querySelector('span').textContent = 'Optimizing...';
    const optimized = await optimizeAndReadImage(file);
    
    previewBox.innerHTML = `<img id="leader-img-preview" src="${optimized}" data-src="${optimized}" style="width: 100%; height: 100%; object-fit: cover;">`;
    dropzone.querySelector('span').textContent = 'Drag & drop or click to upload photo';
    
    // Add remove button if not exists
    if (!document.getElementById('btn-remove-leader-img')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'admin-btn admin-btn--outline admin-btn--sm';
      btn.id = 'btn-remove-leader-img';
      btn.style.marginTop = '8px';
      btn.style.padding = '4px 10px';
      btn.textContent = 'Remove Image';
      dropzone.parentNode.appendChild(btn);
      
      btn.addEventListener('click', () => {
        previewBox.innerHTML = `<span id="leader-img-placeholder" style="font-size: 0.7rem; color: var(--admin-text-muted);">No Image</span>`;
        btn.remove();
      });
    }
    showToast('Portrait image uploaded.', 'success');
  } catch (err) {
    dropzone.querySelector('span').textContent = 'Upload failed. Click to retry';
    showToast(`Upload failed: ${err.message}`, 'error');
  }
}
