/**
 * FOUNDERY927 Admin — Awards CRUD Module
 */

import { getData, updateData, showToast, showModal, hideModal, showConfirm, generateId, escapeHtml, truncate } from './admin-app.js';

export function renderAwards(container) {
  const data = getData();
  if (!data) return;

  const awards = data.awards || [];

  // Add header button
  const headerActions = document.getElementById('page-actions');
  if (headerActions) {
    headerActions.innerHTML = `
      <button class="admin-btn admin-btn--primary" id="btn-add-award">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Add Award</span>
      </button>
    `;
    document.getElementById('btn-add-award').addEventListener('click', () => showAwardForm());
  }

  // Render Table
  container.innerHTML = `
    <div class="admin-card admin-table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Award Title</th>
            <th>Category / Granting Guild</th>
            <th>Year</th>
            <th class="admin-table__align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${awards.length === 0 ? `
            <tr>
              <td colspan="4" class="admin-table__empty">No awards found. Create one to get started.</td>
            </tr>
          ` : awards.map(award => {
            return `
              <tr data-id="${award.id}">
                <td><div class="admin-table__primary-text">${escapeHtml(award.name)}</div></td>
                <td><div class="admin-table__secondary-text">${escapeHtml(award.category)}</div></td>
                <td><code class="admin-badge admin-badge--info">${escapeHtml(award.year)}</code></td>
                <td class="admin-table__align-right">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="admin-btn admin-btn--outline admin-btn--sm btn-edit-award" data-id="${award.id}">Edit</button>
                    <button class="admin-btn admin-btn--danger admin-btn--sm btn-delete-award" data-id="${award.id}">Delete</button>
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
  container.querySelectorAll('.btn-edit-award').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const award = awards.find(a => a.id === id);
      if (award) showAwardForm(award);
    });
  });

  container.querySelectorAll('.btn-delete-award').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const award = awards.find(a => a.id === id);
      if (award) {
        showConfirm(
          'Delete Award',
          `Are you sure you want to delete "${award.name}"?`,
          () => {
            const updated = awards.filter(a => a.id !== id);
            updateData('awards', updated);
            showToast('Award deleted successfully.', 'success');
            renderAwards(container);
          }
        );
      }
    });
  });
}

function showAwardForm(award = null) {
  const isEdit = !!award;
  const titleText = isEdit ? 'Edit Award' : 'Add Award';
  const data = getData();
  const awards = data ? data.awards || [] : [];

  const html = `
    <div class="admin-modal__header">
      <h3 class="admin-modal__title">${titleText}</h3>
      <button class="admin-modal__close" aria-label="Close modal">&times;</button>
    </div>
    <form class="admin-modal__form" id="award-form">
      <div class="admin-form-group">
        <label class="admin-label" for="award-name">Award Title</label>
        <input type="text" class="admin-input" id="award-name" value="${award ? escapeHtml(award.name) : ''}" required placeholder="e.g. TV Journalist of the Year">
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="award-category">Category / Granting Organization</label>
        <input type="text" class="admin-input" id="award-category" value="${award ? escapeHtml(award.category) : ''}" required placeholder="e.g. National Broadcasting Guild">
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="award-year">Year Granted</label>
        <input type="text" class="admin-input" id="award-year" value="${award ? escapeHtml(award.year) : ''}" required placeholder="e.g. 2024">
      </div>

      <div class="admin-modal__footer" style="margin-top: 24px;">
        <button type="button" class="admin-btn admin-btn--outline admin-modal__close">Cancel</button>
        <button type="submit" class="admin-btn admin-btn--primary">Save Award</button>
      </div>
    </form>
  `;

  showModal(html);

  // Handle submit
  document.getElementById('award-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('award-name').value.trim();
    const category = document.getElementById('award-category').value.trim();
    const year = document.getElementById('award-year').value.trim();

    const newAward = {
      id: award ? award.id : generateId('award'),
      name,
      category,
      year,
      icon: 'award'
    };

    let updatedList;
    if (isEdit) {
      updatedList = awards.map(a => a.id === award.id ? newAward : a);
      showToast('Award updated successfully.', 'success');
    } else {
      updatedList = [...awards, newAward];
      showToast('Award created successfully.', 'success');
    }

    updateData('awards', updatedList);
    hideModal();

    // Refresh awards list in UI
    const container = document.getElementById('admin-content');
    if (container) renderAwards(container);
  });
}
