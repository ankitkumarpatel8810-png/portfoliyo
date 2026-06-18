/**
 * FOUNDERY927 Admin — Leads Management Module
 */
import { getData, updateData, showToast, showModal, hideModal, showConfirm, formatDate, escapeHtml, truncate } from './admin-app.js';

export function renderLeads(container) {
  const data = getData();
  if (!data) return;

  const { leads } = data;
  let currentFilter = 'all';

  function filterAndRenderTable() {
    const filteredLeads = leads.filter(lead => {
      if (currentFilter === 'all') return true;
      
      // Standardize status comparisons
      const status = (lead.status || 'new').toLowerCase();
      if (currentFilter === 'new') return status === 'new';
      if (currentFilter === 'contacted') return status === 'contacted';
      if (currentFilter === 'followup') return status === 'follow-up required' || status === 'followup';
      if (currentFilter === 'closed') return status === 'closed';
      
      return false;
    });

    const tableContainer = container.querySelector('#leads-table-container');
    if (!tableContainer) return;

    tableContainer.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Inquiry Type / Subject</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Status</th>
            <th class="admin-table__align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filteredLeads.length === 0 ? `
            <tr>
              <td colspan="6" class="admin-table__empty">No leads found in this filter.</td>
            </tr>
          ` : filteredLeads.map(lead => {
            const statusLabel = getStatusLabel(lead.status || 'new');
            const statusClass = `admin-badge admin-badge--${getStatusClassKey(lead.status || 'new')}`;
            return `
              <tr data-id="${lead.id}">
                <td>
                  <div class="admin-table__primary-text">${escapeHtml(lead.name)}</div>
                  <div class="admin-table__secondary-text">${escapeHtml(lead.email)}</div>
                </td>
                <td>
                  <div class="admin-table__primary-text">${escapeHtml(lead.subject || 'Coaching Inquiry')}</div>
                  <div class="admin-table__secondary-text">${escapeHtml(truncate(lead.message, 50))}</div>
                </td>
                <td><div class="admin-table__primary-text">${escapeHtml(lead.phone || '—')}</div></td>
                <td>${formatDate(lead.date)}</td>
                <td><span class="${statusClass}">${escapeHtml(statusLabel)}</span></td>
                <td class="admin-table__align-right">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="admin-btn admin-btn--outline admin-btn--sm btn-view-lead" data-id="${lead.id}">View</button>
                    <button class="admin-btn admin-btn--danger admin-btn--sm btn-delete-lead" data-id="${lead.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // Attach row listeners
    tableContainer.querySelectorAll('.btn-view-lead').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const lead = leads.find(l => l.id === id);
        if (lead) viewLeadDetails(lead);
      });
    });

    tableContainer.querySelectorAll('.btn-delete-lead').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const lead = leads.find(l => l.id === id);
        if (lead) {
          showConfirm(
            'Delete Lead Submission',
            `Are you sure you want to delete the lead from "${lead.name}"?`,
            () => {
              const updated = leads.filter(l => l.id !== id);
              updateData('leads', updated);
              showToast('Lead submission deleted successfully.', 'success');
              renderLeads(container);
            }
          );
        }
      });
    });
  }

  // Initial structure with upgraded filters
  container.innerHTML = `
    <!-- Status Filters -->
    <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
      <button class="admin-btn admin-btn--primary btn-filter" data-filter="all">All Leads</button>
      <button class="admin-btn admin-btn--outline btn-filter" data-filter="new">New</button>
      <button class="admin-btn admin-btn--outline btn-filter" data-filter="contacted">Contacted</button>
      <button class="admin-btn admin-btn--outline btn-filter" data-filter="followup">Follow-up Required</button>
      <button class="admin-btn admin-btn--outline btn-filter" data-filter="closed">Closed</button>
    </div>

    <!-- Table Container -->
    <div class="admin-card admin-table-card" id="leads-table-container"></div>
  `;

  // Attach filter listeners
  container.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentFilter = e.currentTarget.dataset.filter;
      
      container.querySelectorAll('.btn-filter').forEach(b => {
        b.classList.replace('admin-btn--primary', 'admin-btn--outline');
      });
      e.currentTarget.classList.replace('admin-btn--outline', 'admin-btn--primary');

      filterAndRenderTable();
    });
  });

  filterAndRenderTable();

  function viewLeadDetails(lead) {
    const html = `
      <div class="admin-modal__header">
        <h3 class="admin-modal__title">Inquiry Details</h3>
        <button class="admin-modal__close" aria-label="Close modal">&times;</button>
      </div>
      <div style="margin-top: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border-bottom: 1px solid var(--admin-border); padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <h4 style="font-family: var(--admin-font-display); font-size: 1.15rem; font-weight:600;">${escapeHtml(lead.name)}</h4>
            <p style="color: var(--admin-text-secondary); margin-top: 4px;">
              Email: <a href="mailto:${lead.email}" style="color: var(--admin-accent); text-decoration: none;">${escapeHtml(lead.email)}</a>
            </p>
            <p style="color: var(--admin-text-secondary); margin-top: 2px;">
              Phone: <span style="color: var(--admin-text);">${escapeHtml(lead.phone || '—')}</span>
            </p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 0.8rem; color: var(--admin-text-secondary);">${formatDate(lead.date)}</p>
            <div style="margin-top: 8px;">
              <label class="admin-label" style="display:inline; margin-right:8px;">Status:</label>
              <select class="admin-input" id="lead-status-select" style="display: inline-block; width: auto; padding: 4px 8px; font-size: 0.8rem;">
                <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
                <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                <option value="follow-up required" ${lead.status === 'follow-up required' || lead.status === 'followup' ? 'selected' : ''}>Follow-up Required</option>
                <option value="closed" ${lead.status === 'closed' ? 'selected' : ''}>Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h5 style="color: var(--admin-text-secondary); font-size: 0.8rem; margin-bottom: 6px;">Inquiry Type / Subject</h5>
          <p style="font-weight: 500; font-size: 0.9rem;">${escapeHtml(lead.subject || 'Coaching Inquiry')}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h5 style="color: var(--admin-text-secondary); font-size: 0.8rem; margin-bottom: 6px;">Message Body</h5>
          <div style="background-color: var(--admin-bg-deep); border: 1px solid var(--admin-border); padding: 12px 16px; border-radius: var(--admin-radius-sm); white-space: pre-wrap; font-family: inherit; font-size: 0.88rem; line-height: 1.5; color: var(--admin-text);">${escapeHtml(lead.message)}</div>
        </div>

        <!-- Notes Field -->
        <div style="border-top: 1px solid var(--admin-border); padding-top: 16px; margin-bottom: 24px;">
          <h5 style="color: var(--admin-text-secondary); font-size: 0.8rem; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>Internal Notes & Remarks</span>
            <button class="admin-btn admin-btn--outline admin-btn--sm" id="btn-save-lead-notes" style="padding: 2px 8px; font-size: 0.75rem;">Save Notes</button>
          </h5>
          <textarea class="admin-input" id="lead-notes-area" rows="3" placeholder="Write internal notes about this lead..." style="font-size: 0.85rem;">${escapeHtml(lead.notes || '')}</textarea>
        </div>

        <div class="admin-modal__footer">
          <button class="admin-btn admin-btn--outline admin-modal__close">Close</button>
          <a href="mailto:${lead.email}?subject=RE: ${encodeURIComponent(lead.subject || 'Inquiry')}" id="btn-reply-email" class="admin-btn admin-btn--primary">Reply via Email</a>
        </div>
      </div>
    `;

    showModal(html);

    // Status select change
    document.getElementById('lead-status-select').addEventListener('change', (e) => {
      const newStatus = e.target.value;
      lead.status = newStatus;
      const updated = leads.map(l => l.id === lead.id ? lead : l);
      updateData('leads', updated);
      showToast(`Lead marked as ${getStatusLabel(newStatus)}.`, 'success');
      filterAndRenderTable();
    });

    // Save notes
    document.getElementById('btn-save-lead-notes').addEventListener('click', () => {
      const notesVal = document.getElementById('lead-notes-area').value.trim();
      lead.notes = notesVal;
      const updated = leads.map(l => l.id === lead.id ? lead : l);
      updateData('leads', updated);
      showToast('Lead notes saved successfully.', 'success');
    });

    // Email reply marker
    document.getElementById('btn-reply-email').addEventListener('click', () => {
      if (lead.status === 'new') {
        lead.status = 'contacted';
        const updated = leads.map(l => l.id === lead.id ? lead : l);
        updateData('leads', updated);
        filterAndRenderTable();
      }
      hideModal();
    });
  }
}

function getStatusLabel(status = 'new') {
  const s = status.toLowerCase();
  if (s === 'new') return 'New';
  if (s === 'contacted') return 'Contacted';
  if (s === 'follow-up required' || s === 'followup') return 'Follow-up Required';
  if (s === 'closed') return 'Closed';
  return status;
}

function getStatusClassKey(status = 'new') {
  const s = status.toLowerCase();
  if (s === 'new') return 'new';
  if (s === 'contacted') return 'info';
  if (s === 'follow-up required' || s === 'followup') return 'error'; // Red/error badge for follow-up required
  if (s === 'closed') return 'success';
  return 'new';
}
