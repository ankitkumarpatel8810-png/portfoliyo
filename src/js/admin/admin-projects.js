/**
 * FOUNDERY927 Admin — Projects CRUD Module
 */

import { getData, updateData, showToast, showModal, hideModal, showConfirm, generateId, escapeHtml, truncate } from './admin-app.js';

export function renderProjects(container) {
  const data = getData();
  if (!data) return;

  const { projects } = data;

  // Add header button
  const headerActions = document.getElementById('page-actions');
  if (headerActions) {
    headerActions.innerHTML = `
      <button class="admin-btn admin-btn--primary" id="btn-add-project">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Add Project</span>
      </button>
    `;
    document.getElementById('btn-add-project').addEventListener('click', () => showProjectForm());
  }

  // Render Table
  container.innerHTML = `
    <div class="admin-card admin-table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Category</th>
            <th>Industry</th>
            <th>Results Overview</th>
            <th class="admin-table__align-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${projects.length === 0 ? `
            <tr>
              <td colspan="5" class="admin-table__empty">No projects found. Create one to get started.</td>
            </tr>
          ` : projects.map(proj => {
            const resultsText = Object.entries(proj.results || {})
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');

            return `
              <tr data-id="${proj.id}">
                <td>
                  <div class="admin-table__primary-text" style="display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${proj.color || '#C8FF00'}; border: 1px solid rgba(255,255,255,0.1)"></span>
                    ${escapeHtml(proj.title)}
                  </div>
                  <div class="admin-table__secondary-text">${escapeHtml(truncate(proj.description, 60))}</div>
                </td>
                <td>${escapeHtml(proj.category)}</td>
                <td>${escapeHtml(proj.industry)}</td>
                <td><div class="admin-table__secondary-text">${escapeHtml(truncate(resultsText, 60))}</div></td>
                <td class="admin-table__align-right">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="admin-btn admin-btn--outline admin-btn--sm btn-edit-proj" data-id="${proj.id}">Edit</button>
                    <button class="admin-btn admin-btn--danger admin-btn--sm btn-delete-proj" data-id="${proj.id}">Delete</button>
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
  container.querySelectorAll('.btn-edit-proj').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const proj = projects.find(p => p.id === id);
      if (proj) showProjectForm(proj);
    });
  });

  container.querySelectorAll('.btn-delete-proj').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const proj = projects.find(p => p.id === id);
      if (proj) {
        showConfirm(
          'Delete Project',
          `Are you sure you want to delete "${proj.title}"? This will remove it from the public portfolio.`,
          () => {
            const updated = projects.filter(p => p.id !== id);
            updateData('projects', updated);
            showToast('Project deleted successfully.', 'success');
            renderProjects(container);
          }
        );
      }
    });
  });
}

function showProjectForm(project = null) {
  const isEdit = !!project;
  const titleText = isEdit ? 'Edit Project' : 'Add New Project';
  const data = getData();
  const projects = data ? data.projects : [];

  // Helper for metrics fields
  const results = project?.results || { revenue: '', engagement: '', conversion: '', time: '' };
  // Find other potential keys
  const keys = Object.keys(results);
  const metric1Key = keys[0] || 'revenue';
  const metric1Val = results[metric1Key] || '';
  const metric2Key = keys[1] || 'engagement';
  const metric2Val = results[metric2Key] || '';
  const metric3Key = keys[2] || 'conversion';
  const metric3Val = results[metric3Key] || '';
  const metric4Key = keys[3] || 'time';
  const metric4Val = results[metric4Key] || '';

  const html = `
    <div class="admin-modal__header">
      <h3 class="admin-modal__title">${titleText}</h3>
      <button class="admin-modal__close" aria-label="Close modal">&times;</button>
    </div>
    <form class="admin-modal__form" id="project-form">
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="proj-title">Project Title</label>
          <input type="text" class="admin-input" id="proj-title" value="${project ? escapeHtml(project.title) : ''}" required placeholder="e.g. NOVA">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="proj-color">Accent Color</label>
          <div style="display: flex; gap: 8px;">
            <input type="color" class="admin-input" id="proj-color-picker" value="${project?.color || '#C8FF00'}" style="width: 42px; padding: 2px; height: 38px;">
            <input type="text" class="admin-input" id="proj-color" value="${project?.color || '#C8FF00'}" required placeholder="#C8FF00">
          </div>
        </div>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="proj-category">Category</label>
          <input type="text" class="admin-input" id="proj-category" value="${project ? escapeHtml(project.category) : ''}" required placeholder="e.g. E-Commerce & Branding">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="proj-industry">Industry</label>
          <input type="text" class="admin-input" id="proj-industry" value="${project ? escapeHtml(project.industry) : ''}" required placeholder="e.g. Luxury Fashion">
        </div>
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="proj-desc">Description</label>
        <textarea class="admin-input" id="proj-desc" rows="3" required placeholder="A brief description of the project...">${project ? escapeHtml(project.description) : ''}</textarea>
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="proj-challenge">The Challenge</label>
        <textarea class="admin-input" id="proj-challenge" rows="3" placeholder="Describe the challenges faced...">${project ? escapeHtml(project.challenge || '') : ''}</textarea>
      </div>

      <div class="admin-form-group">
        <label class="admin-label" for="proj-strategy">The Strategy</label>
        <textarea class="admin-input" id="proj-strategy" rows="3" placeholder="Describe your strategy...">${project ? escapeHtml(project.strategy || '') : ''}</textarea>
      </div>

      <div class="admin-sidebar__section-label" style="margin: 16px 0 8px 0; padding: 0;">Project Results (4 Metrics)</div>
      
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="proj-m1-key">Metric 1 Label</label>
          <input type="text" class="admin-input" id="proj-m1-key" value="${escapeHtml(metric1Key)}" required placeholder="e.g. revenue">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="proj-m1-val">Metric 1 Value</label>
          <input type="text" class="admin-input" id="proj-m1-val" value="${escapeHtml(metric1Val)}" required placeholder="e.g. +340%">
        </div>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="proj-m2-key">Metric 2 Label</label>
          <input type="text" class="admin-input" id="proj-m2-key" value="${escapeHtml(metric2Key)}" required placeholder="e.g. engagement">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="proj-m2-val">Metric 2 Value</label>
          <input type="text" class="admin-input" id="proj-m2-val" value="${escapeHtml(metric2Val)}" required placeholder="e.g. +520%">
        </div>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="proj-m3-key">Metric 3 Label</label>
          <input type="text" class="admin-input" id="proj-m3-key" value="${escapeHtml(metric3Key)}" required placeholder="e.g. conversion">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="proj-m3-val">Metric 3 Value</label>
          <input type="text" class="admin-input" id="proj-m3-val" value="${escapeHtml(metric3Val)}" required placeholder="e.g. 4.8%">
        </div>
      </div>

      <div class="admin-form-row">
        <div class="admin-form-group">
          <label class="admin-label" for="proj-m4-key">Metric 4 Label</label>
          <input type="text" class="admin-input" id="proj-m4-key" value="${escapeHtml(metric4Key)}" required placeholder="e.g. time">
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="proj-m4-val">Metric 4 Value</label>
          <input type="text" class="admin-input" id="proj-m4-val" value="${escapeHtml(metric4Val)}" required placeholder="e.g. 8 weeks">
        </div>
      </div>

      <div class="admin-modal__footer" style="margin-top: 24px;">
        <button type="button" class="admin-btn admin-btn--outline admin-modal__close">Cancel</button>
        <button type="submit" class="admin-btn admin-btn--primary">Save Project</button>
      </div>
    </form>
  `;

  showModal(html);

  // Sync color picker with input box
  const picker = document.getElementById('proj-color-picker');
  const txt = document.getElementById('proj-color');
  if (picker && txt) {
    picker.addEventListener('input', (e) => txt.value = e.target.value);
    txt.addEventListener('change', (e) => picker.value = e.target.value);
  }

  // Handle submit
  document.getElementById('project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('proj-title').value.trim();
    const color = document.getElementById('proj-color').value.trim();
    const category = document.getElementById('proj-category').value.trim();
    const industry = document.getElementById('proj-industry').value.trim();
    const description = document.getElementById('proj-desc').value.trim();
    const challenge = document.getElementById('proj-challenge').value.trim();
    const strategy = document.getElementById('proj-strategy').value.trim();

    // Construct metrics object
    const resultsObj = {};
    const m1K = document.getElementById('proj-m1-key').value.trim();
    const m1V = document.getElementById('proj-m1-val').value.trim();
    const m2K = document.getElementById('proj-m2-key').value.trim();
    const m2V = document.getElementById('proj-m2-val').value.trim();
    const m3K = document.getElementById('proj-m3-key').value.trim();
    const m3V = document.getElementById('proj-m3-val').value.trim();
    const m4K = document.getElementById('proj-m4-key').value.trim();
    const m4V = document.getElementById('proj-m4-val').value.trim();

    if (m1K) resultsObj[m1K] = m1V;
    if (m2K) resultsObj[m2K] = m2V;
    if (m3K) resultsObj[m3K] = m3V;
    if (m4K) resultsObj[m4K] = m4V;

    const newProj = {
      id: project ? project.id : generateId('project'),
      title,
      color,
      category,
      industry,
      description,
      challenge,
      strategy,
      results: resultsObj
    };

    let updatedList;
    if (isEdit) {
      updatedList = projects.map(p => p.id === project.id ? newProj : p);
      showToast('Project updated successfully.', 'success');
    } else {
      updatedList = [...projects, newProj];
      showToast('Project created successfully.', 'success');
    }

    updateData('projects', updatedList);
    hideModal();

    // Refresh projects list in UI
    const container = document.getElementById('admin-content');
    if (container) renderProjects(container);
  });
}
