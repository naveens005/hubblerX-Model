import { DB } from '../db.js';
import { buildEventCards } from '../utils.js';

export function renderHome(data = {}) {
  const events = DB.getEvents();
  const categories = ['All', 'Technical', 'Cultural', 'Business', 'Arts', 'Sports'];
  const user = DB.getCurrentUser();

  const heroBanner = user ? `
    <div style="background:linear-gradient(135deg,rgba(99,102,241,0.15) 0%,rgba(168,85,247,0.1) 100%);border:1px solid var(--border-accent);border-radius:var(--radius-xl);padding:var(--space-lg) var(--space-xl);margin-bottom:var(--space-xl);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-md);">
      <div>
        <div style="font-size:0.82rem;color:var(--text-secondary);">Welcome back 👋</div>
        <div style="font-size:1.3rem;font-weight:700;margin:2px 0;">${user.name.split(' ')[0]}</div>
        <div style="font-family:'Space Grotesk',monospace;font-size:0.78rem;color:var(--indigo-light);">⚡ ${user.system_id}</div>
      </div>
      <div style="display:flex;gap:var(--space-md);align-items:center;">
        <div style="text-align:center;">
          <div style="font-family:'Space Grotesk',sans-serif;font-size:1.5rem;font-weight:800;background:var(--grad-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${user.credits}</div>
          <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Credits</div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:'Space Grotesk',sans-serif;font-size:1.5rem;font-weight:800;color:var(--cyan-light);">${DB.getUserRegistrations(user._id).length}</div>
          <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Events</div>
        </div>
      </div>
    </div>` : `
    <div style="background:var(--grad-glow);border-radius:var(--radius-xl);padding:var(--space-xl);margin-bottom:var(--space-xl);text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;opacity:0.05;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><circle cx=%2230%22 cy=%2230%22 r=%2228%22 fill=%22none%22 stroke=%22white%22 stroke-width=%221%22/></svg>') repeat;"></div>
      <div style="position:relative;z-index:1;">
        <div style="font-size:2.5rem;margin-bottom:var(--space-sm);">⚡</div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:800;margin-bottom:6px;">Discover Campus Events</div>
        <div style="color:rgba(255,255,255,0.7);margin-bottom:var(--space-lg);font-size:0.9rem;">Register. Attend. Earn Credits. Rise to the top.</div>
        <button class="btn" style="background:white;color:#4f46e5;font-weight:700;" onclick="document.getElementById('nav-login-cta')?.click()">Get Started Free →</button>
      </div>
    </div>`;

  return `
  <div class="content-wrapper">
    ${heroBanner}
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h1 class="page-title">🗓 Upcoming Events</h1>
        <div class="page-subtitle">${events.length} events available across campus</div>
      </div>
    </div>

    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input class="search-input" id="event-search" placeholder="Search events, categories..." />
    </div>

    <div class="filter-tabs mb-lg">
      ${categories.map((c, i) => `<button class="filter-tab ${i === 0 ? 'active' : ''}" data-filter="${c}">${c}</button>`).join('')}
    </div>

    <div class="events-grid" id="events-grid">
      ${buildEventCards(events)}
    </div>
  </div>`;
}

