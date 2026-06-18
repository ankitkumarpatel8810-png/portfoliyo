/**
 * FOUNDERY927 Admin — Dashboard Module
 * Renders statistical cards and recent contact leads.
 */

import { getData, formatDate, escapeHtml, truncate } from './admin-app.js';

export function renderDashboard(container) {
  const data = getData();
  if (!data) return;

  const { analytics, leads } = data;
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const conversionRate = analytics.visitors > 0 
    ? ((analytics.conversions / analytics.visitors) * 100).toFixed(1) 
    : '0';

  container.innerHTML = `
    <!-- Stats Grid -->
    <div class="admin-grid admin-grid--4">
      <div class="admin-card admin-stat-card">
        <div class="admin-stat-card__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="admin-stat-card__content">
          <p class="admin-stat-card__label">Total Visitors</p>
          <h3 class="admin-stat-card__value">${analytics.visitors.toLocaleString()}</h3>
          <p class="admin-stat-card__trend admin-stat-card__trend--up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            <span>+12.4% vs last month</span>
          </p>
        </div>
      </div>

      <div class="admin-card admin-stat-card">
        <div class="admin-stat-card__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="admin-stat-card__content">
          <p class="admin-stat-card__label">Conversions</p>
          <h3 class="admin-stat-card__value">${analytics.conversions}</h3>
          <p class="admin-stat-card__trend admin-stat-card__trend--up">
            <span>${conversionRate}% conversion rate</span>
          </p>
        </div>
      </div>

      <div class="admin-card admin-stat-card">
        <div class="admin-stat-card__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
        </div>
        <div class="admin-stat-card__content">
          <p class="admin-stat-card__label">Active Leads</p>
          <h3 class="admin-stat-card__value">${leads.length}</h3>
          <p class="admin-stat-card__trend">
            <span>${leads.filter(l => l.status === 'new').length} unread leads</span>
          </p>
        </div>
      </div>

      <div class="admin-card admin-stat-card">
        <div class="admin-stat-card__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="admin-stat-card__content">
          <p class="admin-stat-card__label">Projects Completed</p>
          <h3 class="admin-stat-card__value">${analytics.projectsCompleted}</h3>
          <p class="admin-stat-card__trend">
            <span>Across 6 industries</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Leads Section -->
    <div class="admin-section">
      <div class="admin-section__header">
        <h4 class="admin-section__title">Recent Leads</h4>
        <a href="#leads" class="admin-btn admin-btn--outline admin-btn--sm">View All Leads</a>
      </div>
      <div class="admin-card admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th class="admin-table__align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${recentLeads.length === 0 ? `
              <tr>
                <td colspan="5" class="admin-table__empty">No leads found.</td>
              </tr>
            ` : recentLeads.map(lead => {
              const statusClass = `admin-badge admin-badge--${lead.status || 'new'}`;
              return `
                <tr>
                  <td>
                    <div class="admin-table__primary-text">${escapeHtml(lead.name)}</div>
                    <div class="admin-table__secondary-text">${escapeHtml(lead.email)}</div>
                  </td>
                  <td>
                    <div class="admin-table__primary-text">${escapeHtml(lead.subject)}</div>
                    <div class="admin-table__secondary-text">${escapeHtml(truncate(lead.message, 60))}</div>
                  </td>
                  <td>${formatDate(lead.date)}</td>
                  <td><span class="${statusClass}">${lead.status}</span></td>
                  <td class="admin-table__align-right">
                    <a href="#leads" class="admin-btn admin-btn--outline admin-btn--sm">View Details</a>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
