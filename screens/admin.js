import { DB } from '../db.js';
import { formatDate } from '../utils.js';

export function renderAdmin() {
  const events = DB.getEvents();
  const allRegs = DB.getTotalRegistrations();
  const checkins = DB.getTotalCheckins();
  const users = DB.getAllUsers();
  const allRegsFull = events.flatMap(e => DB.getEventRegistrations(e._id).map(r => ({ ...r, event: e })));

  return `
  <div class="content-wrapper">
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-md);">
      <div>
        <h1 class="page-title">⚙️ Admin Panel</h1>
        <div class="page-subtitle">Manage events, check-ins, and winners</div>
      </div>
      <button class="btn btn-primary" id="create-event-btn">➕ Create Event</button>
    </div>

    <!-- Stats -->
    <div class="stat-grid mb-xl">
      <div class="stat-card indigo"><div class="stat-icon">📅</div><div class="stat-value">${events.length}</div><div class="stat-label">Total Events</div></div>
      <div class="stat-card purple"><div class="stat-icon">👥</div><div class="stat-value">${users.length}</div><div class="stat-label">Students</div></div>
      <div class="stat-card emerald"><div class="stat-icon">🎟</div><div class="stat-value">${allRegs}</div><div class="stat-label">Registrations</div></div>
      <div class="stat-card amber"><div class="stat-icon">✅</div><div class="stat-value">${checkins}</div><div class="stat-label">Check-ins</div></div>
    </div>

    <!-- Tabs -->
    <div class="filter-tabs mb-lg">
      <button class="filter-tab active" data-admin-tab="events">📅 Events</button>
      <button class="filter-tab" data-admin-tab="registrations">🎟 Registrations</button>
      <button class="filter-tab" data-admin-tab="winners">🏆 Mark Winners</button>
    </div>

    <!-- Events Panel -->
    <div id="admin-panel-events" class="admin-panel">
      <div style="display:flex;flex-direction:column;gap:var(--space-md);">
        ${events.map(ev => {
          const regs = DB.getEventRegistrations(ev._id);
          const checkedIn = regs.filter(r => r.checked_in).length;
          return `
          <div class="card">
            <div class="card-body" style="display:flex;align-items:center;gap:var(--space-md);flex-wrap:wrap;">
              <div style="width:48px;height:48px;border-radius:var(--radius-md);background:${ev.gradient};display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;">${ev.emoji}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:0.95rem;">${ev.title}</div>
                <div style="font-size:0.8rem;color:var(--text-secondary);">📅 ${formatDate(ev.date)} · 📍 ${ev.venue}</div>
              </div>
              <div style="display:flex;gap:var(--space-sm);align-items:center;flex-wrap:wrap;">
                <span class="badge badge-indigo">👥 ${regs.length}/${ev.max_participants}</span>
                <span class="badge badge-emerald">✅ ${checkedIn} in</span>
                <span class="badge badge-amber">${ev.price === 0 ? 'Free' : '₹'+ev.price}</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Registrations Panel -->
    <div id="admin-panel-registrations" class="admin-panel hidden">
      <div class="search-bar mb-lg">
        <span class="search-icon">🔍</span>
        <input class="search-input" id="admin-reg-search" placeholder="Search by name or event..." />
      </div>
      <div class="card">
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
            <thead>
              <tr style="border-bottom:1px solid var(--border);">
                <th style="padding:12px 16px;text-align:left;color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Student</th>
                <th style="padding:12px 16px;text-align:left;color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Event</th>
                <th style="padding:12px 16px;text-align:left;color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${allRegsFull.length === 0 ? `<tr><td colspan="3" style="padding:32px;text-align:center;color:var(--text-muted);">No registrations yet</td></tr>` :
                allRegsFull.map(r => `
                <tr class="reg-row" style="border-bottom:1px solid var(--border);">
                  <td style="padding:12px 16px;">
                    <div style="font-weight:600;">${r.user?.name || 'Unknown'}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${r.user?.college || ''}</div>
                  </td>
                  <td style="padding:12px 16px;">
                    <div>${r.event?.title || ''}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${formatDate(r.event?.date)}</div>
                  </td>
                  <td style="padding:12px 16px;">
                    ${r.checked_in
                      ? '<span class="badge badge-emerald">✅ Checked In</span>'
                      : '<span class="badge badge-rose">⏳ Pending</span>'}
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Winners Panel -->
    <div id="admin-panel-winners" class="admin-panel hidden">
      <div style="margin-bottom:var(--space-md);padding:var(--space-md);background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:var(--radius-md);font-size:0.85rem;color:#fbbf24;">
        🏆 Marking a winner awards <strong>+100 credits</strong>. Only checked-in participants can be marked.
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-md);">
        ${events.map(ev => {
          const regs = DB.getEventRegistrations(ev._id).filter(r => r.checked_in);
          if (regs.length === 0) return '';
          return `
          <div class="card">
            <div class="card-header">
              <div style="font-weight:700;">${ev.emoji} ${ev.title}</div>
            </div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:var(--space-sm);">
              ${regs.map(r => `
              <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-sm);">
                <div>
                  <div style="font-weight:600;font-size:0.9rem;">${r.user?.name || 'Unknown'}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);">${r.user?.system_id || ''}</div>
                </div>
                <button class="btn btn-sm mark-winner-btn"
                  data-user="${r.user_id}" data-event="${ev._id}"
                  style="background:var(--grad-amber);color:white;">
                  🏆 Mark Winner
                </button>
              </div>`).join('<div class="divider"></div>')}
            </div>
          </div>`;
        }).join('')}
        ${events.every(ev => DB.getEventRegistrations(ev._id).filter(r => r.checked_in).length === 0)
          ? `<div class="empty-state"><div class="empty-icon">🏆</div><div class="empty-title">No check-ins yet</div><div class="empty-desc">Check-in participants via the QR scanner first</div></div>`
          : ''}
      </div>
    </div>
  </div>`;
}

