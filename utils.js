// ── Toast Notifications ───────────────────────────────
export function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Format Helpers ─────────────────────────────────────
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function isUpcoming(dateStr) {
  return new Date(dateStr) > new Date();
}

// ── Avatar Colors ──────────────────────────────────────
const AVATAR_COLORS = [
  'linear-gradient(135deg,#6366f1,#a855f7)',
  'linear-gradient(135deg,#06b6d4,#6366f1)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#f43f5e)',
  'linear-gradient(135deg,#a855f7,#f43f5e)',
  'linear-gradient(135deg,#f43f5e,#f59e0b)',
];

export function avatarColor(name = '') {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

export function initials(name = '') {
  return name.split(' ').map(n => n[0]?.toUpperCase()).join('').slice(0, 2);
}

// ── Build Event Cards HTML ─────────────────────────────
export function buildEventCards(events) {
  if (!events.length) {
    return `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🔍</div>
      <div class="empty-title">No events found</div>
      <div class="empty-desc">Try a different filter or check back soon</div>
    </div>`;
  }
  return events.map(ev => {
    const date = new Date(ev.date);
    const upcoming = isUpcoming(ev.date);
    const regCount = 0; // would query DB in real app
    return `
    <div class="event-card" data-id="${ev._id}" id="ecard-${ev._id}">
      <div class="event-banner" style="background:${ev.gradient};">
        <span style="position:relative;z-index:1;">${ev.emoji}</span>
        <div class="event-badge">
          <span class="badge ${upcoming ? 'badge-emerald' : 'badge-rose'}">${upcoming ? '🟢 Upcoming' : '🔴 Past'}</span>
        </div>
      </div>
      <div class="event-content">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
          <div class="event-title">${ev.title}</div>
          <span class="badge badge-indigo">${ev.category}</span>
        </div>
        <div class="event-meta">
          <div class="event-meta-item">📅 ${date.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
          <div class="event-meta-item">⏰ ${date.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
          <div class="event-meta-item">📍 ${ev.venue.split(',')[0]}</div>
        </div>
        <p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${ev.description}</p>
      </div>
      <div class="event-footer">
        <div class="event-price ${ev.price === 0 ? 'free' : ''}">${ev.price === 0 ? '🆓 Free' : '₹' + ev.price}</div>
        <button class="btn btn-primary btn-sm" onclick="window.showEventModal('${ev._id}')">View Details →</button>
      </div>
    </div>`;
  }).join('');
}
