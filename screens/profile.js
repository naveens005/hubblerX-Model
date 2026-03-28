import { DB } from '../db.js';
import { avatarColor, initials, formatDate, timeAgo } from '../utils.js';

export function renderProfile() {
  const user = DB.getCurrentUser();
  const regs = DB.getUserRegistrations(user._id);
  const logs = DB.getUserCreditsLog(user._id);
  const attended = regs.filter(r => r.checked_in).length;
  const wins = logs.filter(l => l.type === 'winner').length;
  const av = avatarColor(user.name);
  const ini = initials(user.name);

  const logRow = (log) => {
    const isWin = log.type === 'winner';
    return `
    <div class="timeline-item">
      <div class="timeline-dot-wrap">
        <div class="timeline-dot" style="background:${isWin ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)'};border-color:${isWin ? 'rgba(245,158,11,0.4)' : 'rgba(99,102,241,0.3)'};">
          ${isWin ? '🏆' : '✅'}
        </div>
        <div class="timeline-line"></div>
      </div>
      <div class="timeline-content">
        <div class="timeline-title">${log.event?.title || 'Event'}</div>
        <div class="timeline-sub">${isWin ? 'Winner' : 'Participation'} · ${timeAgo(log.created_at)}</div>
        <div class="timeline-pts">+${log.points} credits</div>
      </div>
    </div>`;
  };

  return `
  <div class="content-wrapper" style="max-width:720px;">

    <!-- Hero -->
    <div class="profile-hero">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar" style="background:${av};">${ini}</div>
      </div>
      <h1 style="font-size:1.5rem;font-weight:800;">${user.name}</h1>
      <div class="hubbler-id-badge">⚡ ${user.system_id}</div>
      <div style="margin-top:var(--space-sm);color:var(--text-secondary);font-size:0.85rem;">${user.handle}</div>
      <div style="margin-top:4px;font-size:0.82rem;color:var(--text-muted);">${user.department} · ${user.college} · Year ${user.year}</div>
    </div>

    <!-- Stats -->
    <div class="stat-grid mb-xl">
      <div class="stat-card indigo">
        <div class="stat-icon">⚡</div>
        <div class="stat-value grad-text">${user.credits}</div>
        <div class="stat-label">Total Credits</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">🎟</div>
        <div class="stat-value">${regs.length}</div>
        <div class="stat-label">Registered</div>
      </div>
      <div class="stat-card emerald">
        <div class="stat-icon">✅</div>
        <div class="stat-value">${attended}</div>
        <div class="stat-label">Attended</div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon">🏆</div>
        <div class="stat-value">${wins}</div>
        <div class="stat-label">Wins</div>
      </div>
    </div>

    <!-- Hubbler ID Card -->
    <div class="card mb-xl" style="background:var(--grad-glow);border-color:var(--border-accent);overflow:hidden;">
      <div style="padding:var(--space-lg);position:relative;">
        <div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.05);"></div>
        <div style="position:absolute;bottom:-30px;left:30px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.03);"></div>
        <div style="position:relative;z-index:1;">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-md);">
            <div>
              <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;opacity:0.6;margin-bottom:4px;">Hubbler ID</div>
              <div style="font-family:'Space Grotesk',monospace;font-size:1.1rem;font-weight:700;">${user.system_id}</div>
              <div style="font-size:0.82rem;opacity:0.7;margin-top:4px;">${user.name} · ${user.college}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;opacity:0.6;margin-bottom:4px;">Member Since</div>
              <div style="font-weight:600;">${formatDate(user.created_at)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Credits Log -->
    ${logs.length > 0 ? `
    <div class="card mb-xl">
      <div class="card-header">
        <div style="font-weight:700;">⚡ Credits History</div>
      </div>
      <div class="card-body">
        <div class="timeline">
          ${logs.slice(0, 10).map(logRow).join('')}
        </div>
        ${logs.length > 10 ? `<div style="text-align:center;margin-top:var(--space-md);font-size:0.82rem;color:var(--text-muted);">+${logs.length-10} more entries</div>` : ''}
      </div>
    </div>` : `
    <div class="card mb-xl">
      <div class="card-body">
        <div class="empty-state" style="padding:var(--space-xl) 0;">
          <div class="empty-icon">⚡</div>
          <div class="empty-title">No credits yet</div>
          <div class="empty-desc">Attend events to start earning credits and climb the leaderboard</div>
        </div>
      </div>
    </div>`}

    <!-- Settings -->
    <div class="card">
      <div class="card-body" style="display:flex;flex-direction:column;gap:0;">
        <div style="padding:var(--space-md) 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:var(--space-sm);font-weight:500;">📱 Phone</div>
          <div style="color:var(--text-secondary);font-size:0.88rem;">${user.phone}</div>
        </div>
        <div style="padding:var(--space-md) 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:var(--space-sm);font-weight:500;">✉️ Email</div>
          <div style="color:var(--text-secondary);font-size:0.88rem;">${user.email || 'Not added'}</div>
        </div>
        <div style="padding:var(--space-md) 0;display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:var(--space-sm);font-weight:500;">🎓 Department</div>
          <div style="color:var(--text-secondary);font-size:0.88rem;">${user.department}, Year ${user.year}</div>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-danger btn-sm" id="logout-btn">🚪 Logout</button>
      </div>
    </div>

  </div>`;
}

