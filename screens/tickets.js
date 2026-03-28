import { DB } from '../db.js';
import { formatDate, formatTime, isUpcoming } from '../utils.js';

export function renderMyTickets() {
  const user = DB.getCurrentUser();
  const regs = DB.getUserRegistrations(user._id);
  const upcoming = regs.filter(r => isUpcoming(r.event?.date));
  const past = regs.filter(r => !isUpcoming(r.event?.date));

  const ticketCard = (r) => {
    const ev = r.event;
    if (!ev) return '';
    const up = isUpcoming(ev.date);
    return `
    <div class="ticket-card" style="margin-bottom:var(--space-md);">
      <div class="ticket-header" style="background:${ev.gradient};">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;position:relative;z-index:1;">
          <div>
            <div style="font-size:1.5rem;margin-bottom:4px;">${ev.emoji}</div>
            <div style="font-weight:700;font-size:1rem;">${ev.title}</div>
            <div style="font-size:0.8rem;opacity:0.85;margin-top:4px;">📍 ${ev.venue}</div>
          </div>
          <div>
            ${r.checked_in
              ? '<span class="badge badge-emerald">✅ Attended</span>'
              : up
                ? '<span class="badge badge-indigo">🎟 Registered</span>'
                : '<span class="badge badge-rose">🔴 Missed</span>'
            }
          </div>
        </div>
        <div style="display:flex;gap:var(--space-md);margin-top:var(--space-sm);font-size:0.82rem;opacity:0.85;position:relative;z-index:1;">
          <span>📅 ${formatDate(ev.date)}</span>
          <span>⏰ ${formatTime(ev.date)}</span>
        </div>
      </div>
      <div class="ticket-divider">
        <div class="ticket-circle"></div>
        <div style="flex:1;border-top:2px dashed var(--border);margin:0 4px;"></div>
        <div class="ticket-circle"></div>
      </div>
      <div style="padding:var(--space-md) var(--space-lg);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-sm);">
        <div>
          <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:2px;">Ticket ID</div>
          <div style="font-family:'Space Grotesk',monospace;font-size:0.78rem;color:var(--text-secondary);">${r.qr_code.slice(0,28)}...</div>
        </div>
        <button class="btn btn-primary btn-sm view-qr-btn" data-reg="${r._id}" id="ticket-qr-${r._id}">
          📱 Show QR
        </button>
      </div>
      ${r.checked_in ? `
      <div style="padding:8px var(--space-lg);background:rgba(16,185,129,0.08);border-top:1px solid rgba(16,185,129,0.15);font-size:0.78rem;color:#34d399;display:flex;align-items:center;gap:6px;">
        <span>✅</span> Checked in · <span style="color:var(--indigo-light);">+10 credits earned</span>
      </div>` : ''}
    </div>`;
  };

  return `
  <div class="content-wrapper">
    <div class="page-header">
      <h1 class="page-title">🎟 My Tickets</h1>
      <div class="page-subtitle">${regs.length} registration${regs.length !== 1 ? 's' : ''} total</div>
    </div>

    ${regs.length === 0 ? `
    <div class="empty-state">
      <div class="empty-icon">🎟</div>
      <div class="empty-title">No tickets yet</div>
      <div class="empty-desc">Browse events and register to see your tickets here</div>
      <button class="btn btn-primary mt-md" onclick="window.App?.navigate('home')">Explore Events →</button>
    </div>` : ''}

    ${upcoming.length > 0 ? `
    <div style="margin-bottom:var(--space-xl);">
      <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-md);">
        <div style="font-size:1rem;font-weight:700;">🗓 Upcoming (${upcoming.length})</div>
        <span class="badge badge-emerald">Active</span>
      </div>
      ${upcoming.map(ticketCard).join('')}
    </div>` : ''}

    ${past.length > 0 ? `
    <div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:var(--space-md);color:var(--text-secondary);">📂 Past Events (${past.length})</div>
      <div style="opacity:0.7;">${past.map(ticketCard).join('')}</div>
    </div>` : ''}
  </div>`;
}

