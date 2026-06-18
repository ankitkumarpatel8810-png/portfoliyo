/**
 * FOUNDERY927 Admin — Services CRUD Module
 */

import { getData, updateData, showToast, showModal, hideModal, showConfirm, generateId, escapeHtml, truncate } from './admin-app.js';

export function renderServices(container) {
  const data = getData();
  if (!data) return;

  const { services } = data;

  // Add header button
  const headerActions = document.getElementById('page-actions');
  if (headerActions) {
    headerActions.innerHTML = `
      <button class="admin-btn admin-btn--primary" id="btn-add-service">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Add Service</span>
      </button>
    `;
    document.getElementById('btn-add-service').addEventListener('click', () => showServiceForm());
  }

  // Render Table
  container.innerHTML = `
    <div class="admin-card admin-table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Service Title</th>
            <th>Icon</th>
            <th>Description</th>
            <th class="admin-table__align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${services.length === 0 ? `
            <tr>
              <td colspan="4" class="admin-table__empty">No services found. Create one to get started.</td>
            </tr>
          ` : services.map(service => {
            return `
              <tr data-id="${service.id}">
                <td><div class="admin-table__primary-text">${escapeHtml(service.title)}</div></td>
                <td><code class="admin-badge admin-badge--info">${escapeHtml(service.icon)}</code></td>
                <td><div class="admin-table__secondary-text">${escapeHtml(truncate(service.description, 100))}</div></td>
                <td class="admin-table__align-right">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="admin-btn admin-btn--outline admin-btn--sm btn-edit-service" data-id="${service.id}">Edit</button>
                    <button class="admin-btn admin-btn--danger admin-btn--sm btn-delete-service" data-id="${service.id}">Delete</button>
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
  container.querySelectorAll('.btn-edit-service').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      const service = services.find(s => s.id === id);
      if (service) showServiceForm(service);
    });
  });

  container.querySelectorAll('.btn-delete-service').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id) || e.currentTarget.dataset.id;
      const service = services.find(s => s.id === id);
      if (service) {
        showConfirm(
          'Delete Service',
          `Are you sure you want to delete "${service.title}"?`,
          () => {
            const updated = services.filter(s => s.id !== id);
            updateData('services', updated);
            showToast('Service deleted successfully.', 'success');
            renderServices(container);
          }
        );
      }
    });
  });
}

function showServiceForm(service = null) {
  const isEdit = !!service;
  const titleText = isEdit ? 'Edit Service' : 'Add Service';
  const data = getData();
  const services = data ? data.services : [];

  const icons = ['layout', 'code', 'hexagon', 'figma', 'search', 'trending-up', 'zap', 'cpu', 'globe', 'compass'];

  const html = `
    <div class="admin-modal__header">
      <h3 class="admin-modal__title">${titleText}</h3>
      <button class="admin-modal__close" aria-label="Close modal">&times;</button>
    </div>
    <form class="admin-modal__form" id="service-form">
      <div class="admin-form-group">
        <label class="admin-label" for="service-title">Service Title</label>
        <input type="text" class="admin-input" id="service-title" value="${service ? escapeHtml(service.title) : ''}" required placeholder="e.g. AI Integration">
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="service-icon">Icon Identifier</label>
        <select class="admin-input" id="service-icon" required>
          ${icons.map(icon => `<option value="${icon}" ${service?.icon === icon ? 'selected' : ''}>${icon}</option>`).join('')}
        </select>
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="service-desc">Description</label>
        <textarea class="admin-input" id="service-desc" rows="4" required placeholder="Describe what this service entails...">${service ? escapeHtml(service.description) : ''}</textarea>
      </div>

      <div class="admin-modal__footer" style="margin-top: 24px;">
        <button type="button" class="admin-btn admin-btn--outline admin-modal__close">Cancel</button>
        <button type="submit" class="admin-btn admin-btn--primary">Save Service</button>
      </div>
    </form>
  `;

  showModal(html);

  // Handle submit
  document.getElementById('service-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('service-title').value.trim();
    const icon = document.getElementById('service-icon').value;
    const description = document.getElementById('service-desc').value.trim();

    const newService = {
      id: service ? service.id : generateId('service'),
      title,
      icon,
      description
    };

    let updatedList;
    if (isEdit) {
      updatedList = services.map(s => s.id === service.id ? newService : s);
      showToast('Service updated successfully.', 'success');
    } else {
      updatedList = [...services, newService];
      showToast('Service created successfully.', 'success');
    }

    updateData('services', updatedList);
    hideModal();

    // Refresh services list in UI
    const container = document.getElementById('admin-content');
    if (container) renderServices(container);
  });
}
