import { DB } from '../db.js';
import { avatarColor, initials } from '../utils.js';

export function renderLeaderboard() {
  const board = DB.getLeaderboard();
  const currentUser = DB.getCurrentUser();
  const myRank = currentUser ? board.findIndex(u => u._id === currentUser._id) + 1 : 0;

  const medals = ['🥇', '🥈', '🥉'];
  const rankClasses = ['rank-1', 'rank-2', 'rank-3'];

  const podium = board.slice(0, 3);
  const rest = board.slice(3);

  const podiumHTML = podium.length >= 1 ? `
  <div style="display:flex;align-items:flex-end;justify-content:center;gap:var(--space-md);margin-bottom:var(--space-xl);padding:0 var(--space-sm);">
    ${podium[1] ? `
    <div style="flex:1;text-align:center;">
      <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">${medals[1]} 2nd</div>
      <div style="width:64px;height:64px;border-radius:50%;background:${avatarColor(podium[1].name)};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;margin:0 auto 6px;border:3px solid #94a3b8;box-shadow:0 0 16px rgba(148,163,184,0.3);">${initials(podium[1].name)}</div>
      <div style="font-weight:600;font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${podium[1].name.split(' ')[0]}</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;color:#94a3b8;">${podium[1].totalCredits}</div>
      <div style="height:80px;background:rgba(148,163,184,0.1);border:1px solid rgba(148,163,184,0.2);border-radius:8px 8px 0 0;margin-top:8px;"></div>
    </div>` : ''}
    ${podium[0] ? `
    <div style="flex:1;text-align:center;">
      <div style="font-size:0.72rem;color:#fbbf24;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">${medals[0]} Champion</div>
      <div style="width:80px;height:80px;border-radius:50%;background:${avatarColor(podium[0].name)};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.5rem;margin:0 auto 6px;border:4px solid #fbbf24;box-shadow:0 0 24px rgba(251,191,36,0.4);">${initials(podium[0].name)}</div>
      <div style="font-weight:700;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${podium[0].name.split(' ')[0]}</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;color:#fbbf24;text-shadow:0 0 10px rgba(251,191,36,0.5);">${podium[0].totalCredits}</div>
      <div style="height:110px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:8px 8px 0 0;margin-top:8px;"></div>
    </div>` : ''}
    ${podium[2] ? `
    <div style="flex:1;text-align:center;">
      <div style="font-size:0.72rem;color:#cd7c2a;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">${medals[2]} 3rd</div>
      <div style="width:56px;height:56px;border-radius:50%;background:${avatarColor(podium[2].name)};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;margin:0 auto 6px;border:3px solid #cd7c2a;box-shadow:0 0 16px rgba(205,124,42,0.3);">${initials(podium[2].name)}</div>
      <div style="font-weight:600;font-size:0.78rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${podium[2].name.split(' ')[0]}</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:700;color:#cd7c2a;">${podium[2].totalCredits}</div>
      <div style="height:60px;background:rgba(205,124,42,0.08);border:1px solid rgba(205,124,42,0.2);border-radius:8px 8px 0 0;margin-top:8px;"></div>
    </div>` : ''}
  </div>` : '';

  const itemHTML = (user, index) => {
    const rank = index + 1;
    const isMe = currentUser && user._id === currentUser._id;
    const rankClass = rankClasses[rank - 1] || 'rank-other';
    const rankLabel = rank <= 3 ? medals[rank - 1] : `#${rank}`;
    const maxCred = board[0]?.totalCredits || 1;
    const pct = Math.round((user.totalCredits / maxCred) * 100);

    return `
    <div class="leaderboard-item${isMe ? '" style="border-color:var(--border-accent);background:rgba(99,102,241,0.08);' : '"'}">
      <div class="leaderboard-rank ${rankClass}">${rankLabel}</div>
      <div class="leaderboard-avatar" style="background:${avatarColor(user.name)};">${initials(user.name)}</div>
      <div class="leaderboard-info">
        <div class="leaderboard-name">${user.name}${isMe ? ' <span style="font-size:0.7rem;color:var(--indigo-light);">(You)</span>' : ''}</div>
        <div class="leaderboard-college">${user.college} · ${user.department}</div>
        <div style="margin-top:6px;height:4px;background:var(--bg-secondary);border-radius:2px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${rank===1?'var(--grad-amber)':'var(--grad-primary)'};border-radius:2px;transition:width 1s ease;"></div>
        </div>
      </div>
      <div class="leaderboard-credits">
        <div class="credits-value">${user.totalCredits}</div>
        <div class="credits-label">pts</div>
      </div>
    </div>`;
  };

  return `
  <div class="content-wrapper" style="max-width:760px;">
    <div class="page-header">
      <h1 class="page-title">🏆 Leaderboard</h1>
      <div class="page-subtitle">Top students ranked by credits earned</div>
    </div>

    ${currentUser && myRank > 0 ? `
    <div style="background:rgba(99,102,241,0.1);border:1px solid var(--border-accent);border-radius:var(--radius-lg);padding:var(--space-md) var(--space-lg);margin-bottom:var(--space-xl);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-sm);">
      <div style="display:flex;align-items:center;gap:var(--space-sm);">
        <span style="font-size:1.2rem;">🎯</span>
        <span style="font-weight:600;">Your Rank: <span class="grad-text" style="font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:800;">#${myRank}</span></span>
      </div>
      <div style="font-size:0.85rem;color:var(--text-secondary);">
        <span style="color:var(--indigo-light);font-weight:600;">${currentUser.credits} pts</span>
        ${myRank > 1 ? ` · ${board[myRank-2]?.totalCredits - currentUser.credits} pts behind #${myRank-1}` : ' · 🏅 You\'re #1!'}
      </div>
    </div>` : ''}

    <!-- Podium -->
    ${podiumHTML}

    <!-- Full List -->
    <div class="leaderboard-list">
      ${board.map((u, i) => itemHTML(u, i)).join('')}
    </div>

    ${board.length === 0 ? `
    <div class="empty-state">
      <div class="empty-icon">🏆</div>
      <div class="empty-title">No rankings yet</div>
      <div class="empty-desc">Be the first to attend an event and earn credits!</div>
    </div>` : ''}

    <div style="margin-top:var(--space-xl);padding:var(--space-lg);background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);">
      <div style="font-weight:700;margin-bottom:var(--space-sm);">⚡ How Credits Work</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-sm);font-size:0.85rem;color:var(--text-secondary);">
        <div style="display:flex;gap:var(--space-sm);align-items:center;"><span style="color:var(--indigo-light);font-weight:700;min-width:50px;">+10 pts</span> Attend any event (QR check-in)</div>
        <div style="display:flex;gap:var(--space-sm);align-items:center;"><span style="color:#fbbf24;font-weight:700;min-width:50px;">+100 pts</span> Win an event competition</div>
      </div>
    </div>
  </div>`;
}

