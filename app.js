import { DB } from './db.js';
import { renderAuth } from './screens/auth.js';
import { renderHome } from './screens/home.js';
import { renderMyTickets } from './screens/tickets.js';
import { renderProfile } from './screens/profile.js';
import { renderLeaderboard } from './screens/leaderboard.js';
import { renderAdmin } from './screens/admin.js';
import { renderScanner } from './screens/scanner.js';
import { showToast } from './utils.js';

// ── Init DB ──────────────────────────────────────────
DB.init();

// ── App State ────────────────────────────────────────
export const App = {
  currentScreen: 'home',
  currentUser: null,

  navigate(screen, data = {}) {
    this.currentScreen = screen;
    this.currentUser = DB.getCurrentUser();
    render(screen, data);
  },

  requireAuth(screen, data = {}) {
    if (!DB.getCurrentUser()) {
      showToast('Please login first', 'info');
      this.navigate('auth');
      return false;
    }
    this.navigate(screen, data);
    return true;
  },
};

// ── Router ───────────────────────────────────────────
function render(screen, data = {}) {
  const app = document.getElementById('app');
  const user = DB.getCurrentUser();

  // Auth gate
  const gated = ['tickets', 'profile', 'admin', 'scanner'];
  if (gated.includes(screen) && !user) {
    screen = 'auth';
  }

  // Admin gate
  if ((screen === 'admin' || screen === 'scanner') && user && !user.isAdmin) {
    showToast('Admin access only', 'error');
    screen = 'home';
  }

  const navbar = user ? buildNavbar(screen, user) : '';

  let content = '';
  switch (screen) {
    case 'auth':       content = renderAuth(); break;
    case 'home':       content = renderHome(data); break;
    case 'tickets':    content = renderMyTickets(); break;
    case 'profile':    content = renderProfile(); break;
    case 'leaderboard':content = renderLeaderboard(); break;
    case 'admin':      content = renderAdmin(); break;
    case 'scanner':    content = renderScanner(); break;
    default:           content = renderHome(data);
  }

  app.innerHTML = (screen === 'auth') ? content : navbar + content + buildBottomNav(screen);
  attachListeners(screen);
}

// ── Navbar ───────────────────────────────────────────
function buildNavbar(active, user) {
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const adminLinks = user.isAdmin
    ? `<button class="nav-btn ${active === 'admin' ? 'active' : ''}" id="nav-admin" title="Admin Panel">
         <span class="nav-icon">⚙️</span><span>Admin</span>
       </button>
       <button class="nav-btn ${active === 'scanner' ? 'active' : ''}" id="nav-scanner" title="QR Scanner">
         <span class="nav-icon">📷</span><span>Scanner</span>
       </button>`
    : '';
  return `
  <nav class="navbar">
    <div class="navbar-brand" id="nav-home-brand">
      <div class="brand-icon">⚡</div>
      <span class="brand-text">HubblerX</span>
      ${user.isAdmin ? '<span class="admin-tag">Admin</span>' : ''}
    </div>
    <div class="navbar-nav">
      <button class="nav-btn ${active === 'home' ? 'active' : ''}" id="nav-home"><span class="nav-icon">🏠</span><span>Events</span></button>
      <button class="nav-btn ${active === 'tickets' ? 'active' : ''}" id="nav-tickets"><span class="nav-icon">🎟</span><span>My Tickets</span></button>
      <button class="nav-btn ${active === 'leaderboard' ? 'active' : ''}" id="nav-leaderboard"><span class="nav-icon">🏆</span><span>Leaderboard</span></button>
      ${adminLinks}
    </div>
    <div class="nav-avatar" id="nav-profile" title="Profile">${initials}</div>
  </nav>`;
}

function buildBottomNav(active) {
  return `
  <nav class="bottom-nav">
    <div class="bottom-nav-inner">
      <div class="bottom-nav-item ${active === 'home' ? 'active' : ''}" id="bnav-home"><span class="nav-icon">🏠</span><span>Events</span></div>
      <div class="bottom-nav-item ${active === 'tickets' ? 'active' : ''}" id="bnav-tickets"><span class="nav-icon">🎟</span><span>Tickets</span></div>
      <div class="bottom-nav-item ${active === 'leaderboard' ? 'active' : ''}" id="bnav-leaderboard"><span class="nav-icon">🏆</span><span>Ranks</span></div>
      <div class="bottom-nav-item ${active === 'profile' ? 'active' : ''}" id="bnav-profile"><span class="nav-icon">👤</span><span>Profile</span></div>
    </div>
  </nav>`;
}

// ── Event Listeners ───────────────────────────────────
function attachListeners(screen) {
  const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  const nav = (s) => () => App.navigate(s);

  on('nav-home', nav('home')); on('nav-home-brand', nav('home'));
  on('nav-tickets', () => App.requireAuth('tickets'));
  on('nav-leaderboard', nav('leaderboard'));
  on('nav-profile', () => App.requireAuth('profile'));
  on('nav-admin', nav('admin'));
  on('nav-scanner', nav('scanner'));

  on('bnav-home', nav('home'));
  on('bnav-tickets', () => App.requireAuth('tickets'));
  on('bnav-leaderboard', nav('leaderboard'));
  on('bnav-profile', () => App.requireAuth('profile'));

  // Screen-specific listeners
  if (screen === 'auth')        attachAuthListeners();
  if (screen === 'home')        attachHomeListeners();
  if (screen === 'tickets')     attachTicketListeners();
  if (screen === 'profile')     attachProfileListeners();
  if (screen === 'admin')       attachAdminListeners();
  if (screen === 'scanner')     attachScannerListeners();
}

// ── Auth Listeners ────────────────────────────────────
function attachAuthListeners() {
  // Phone step
  const sendBtn = document.getElementById('auth-send-otp');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const phone = document.getElementById('auth-phone')?.value?.trim();
      if (!phone || phone.length < 10) { showToast('Enter a valid phone number', 'error'); return; }
      // Show OTP step
      document.getElementById('step-phone').classList.add('hidden');
      document.getElementById('step-otp').classList.remove('hidden');
      document.getElementById('otp-phone-display').textContent = phone;
      document.getElementById('otp-1').focus();
      showToast('OTP sent! (demo: use 1234)', 'info');
      window._authPhone = phone;
    });
  }

  // OTP auto-advance
  document.querySelectorAll('.otp-input').forEach((inp, i, arr) => {
    inp.addEventListener('input', e => {
      e.target.value = e.target.value.slice(-1);
      if (e.target.value && arr[i + 1]) arr[i + 1].focus();
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !e.target.value && arr[i - 1]) arr[i - 1].focus();
    });
  });

  // Verify OTP
  const verifyBtn = document.getElementById('auth-verify-otp');
  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      const otp = [1,2,3,4].map(n => document.getElementById(`otp-${n}`)?.value).join('');
      if (otp !== '1234') { showToast('Wrong OTP. Demo OTP: 1234', 'error'); return; }
      const phone = window._authPhone;
      const existing = DB.getUserByPhone(phone);
      if (existing) {
        DB.setCurrentUser(existing);
        showToast(`Welcome back, ${existing.name}! 🎉`, 'success');
        App.navigate('home');
      } else {
        // Show register step
        document.getElementById('step-otp').classList.add('hidden');
        document.getElementById('step-register').classList.remove('hidden');
      }
    });
  }

  // Register
  const regBtn = document.getElementById('auth-register');
  if (regBtn) {
    regBtn.addEventListener('click', () => {
      const name = document.getElementById('reg-name')?.value?.trim();
      const college = document.getElementById('reg-college')?.value?.trim();
      const department = document.getElementById('reg-dept')?.value?.trim();
      const year = document.getElementById('reg-year')?.value;
      const email = document.getElementById('reg-email')?.value?.trim();
      if (!name || !college || !department || !year) { showToast('Please fill all required fields', 'error'); return; }
      const user = DB.registerUser({ name, college, department, year, email, phone: window._authPhone });
      DB.setCurrentUser(user);
      showToast(`Welcome to HubblerX, ${name}! 🚀`, 'success');
      App.navigate('home');
    });
  }

  // Admin demo login
  const adminBtn = document.getElementById('auth-admin-demo');
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      const admin = DB.getUserByPhone('+919999999999');
      DB.setCurrentUser(admin);
      showToast('Admin logged in (demo mode)', 'info');
      App.navigate('admin');
    });
  }

  // Back buttons
  document.getElementById('otp-back')?.addEventListener('click', () => {
    document.getElementById('step-otp').classList.add('hidden');
    document.getElementById('step-phone').classList.remove('hidden');
  });
}

// ── Home Listeners ────────────────────────────────────
function attachHomeListeners() {
  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      const grid = document.getElementById('events-grid');
      if (grid) grid.innerHTML = buildEventCards(DB.getEvents(filter === 'All' ? null : filter));
      attachEventCardListeners();
    });
  });

  // Search
  document.getElementById('event-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const all = DB.getEvents();
    const filtered = all.filter(ev => ev.title.toLowerCase().includes(q) || ev.category.toLowerCase().includes(q));
    const grid = document.getElementById('events-grid');
    if (grid) grid.innerHTML = buildEventCards(filtered);
    attachEventCardListeners();
  });

  attachEventCardListeners();
}

function attachEventCardListeners() {
  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      showEventModal(id);
    });
  });
}

// ── Event Modal ───────────────────────────────────────
function showEventModal(eventId) {
  const event = DB.getEvent(eventId);
  if (!event) return;
  const user = DB.getCurrentUser();
  const reg = user ? DB.getRegistration(user._id, eventId) : null;
  const count = DB.getEventRegistrations(eventId).length;
  const spotsLeft = event.max_participants - count;
  const date = new Date(event.date);

  const modal = document.getElementById('event-modal') || createModal('event-modal');
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">${event.emoji} Event Details</h2>
        <button class="modal-close" id="modal-close-ev">✕</button>
      </div>
      <div class="modal-body">
        <div style="height:100px;background:${event.gradient};border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:3rem;margin-bottom:4px;">${event.emoji}</div>
        <h3 style="font-size:1.2rem;font-weight:700;">${event.title}</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;">${event.description}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="stat-card indigo"><div class="stat-icon">📅</div><div class="stat-value" style="font-size:1rem;">${date.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div><div class="stat-label">Date</div></div>
          <div class="stat-card purple"><div class="stat-icon">📍</div><div class="stat-value" style="font-size:0.85rem;">${event.venue}</div><div class="stat-label">Venue</div></div>
          <div class="stat-card emerald"><div class="stat-icon">👥</div><div class="stat-value">${spotsLeft}</div><div class="stat-label">Spots Left</div></div>
          <div class="stat-card amber"><div class="stat-icon">💰</div><div class="stat-value" style="font-size:1.2rem;">${event.price === 0 ? 'FREE' : '₹'+event.price}</div><div class="stat-label">Entry Fee</div></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${event.tags.map(t => `<span class="badge badge-indigo">${t}</span>`).join('')}
        </div>
        ${reg ? `<div style="padding:12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-md);display:flex;align-items:center;gap:10px;"><span style="font-size:1.5rem;">✅</span><div><div style="font-weight:600;color:#34d399;">You're registered!</div><div style="font-size:0.8rem;color:var(--text-secondary);">Check your tickets to view QR code</div></div></div>` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="modal-close-ev2">Cancel</button>
        ${!reg && user ? `<button class="btn btn-primary" id="evt-register-btn" data-id="${eventId}">${event.price > 0 ? '💳 Pay & Register' : '✅ Register Free'}</button>` : ''}
        ${!user ? `<button class="btn btn-primary" id="evt-login-btn">🔐 Login to Register</button>` : ''}
        ${reg ? `<button class="btn btn-secondary" id="view-ticket-btn">🎟 View Ticket</button>` : ''}
      </div>
    </div>`;
  modal.classList.add('open');

  modal.querySelector('#modal-close-ev')?.addEventListener('click', () => modal.classList.remove('open'));
  modal.querySelector('#modal-close-ev2')?.addEventListener('click', () => modal.classList.remove('open'));
  modal.querySelector('#evt-login-btn')?.addEventListener('click', () => { modal.classList.remove('open'); App.navigate('auth'); });
  modal.querySelector('#view-ticket-btn')?.addEventListener('click', () => { modal.classList.remove('open'); App.navigate('tickets'); });
  modal.querySelector('#evt-register-btn')?.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    const result = DB.registerForEvent(user._id, id);
    if (result.success) {
      showToast('🎉 Registered successfully! Check your tickets.', 'success');
      modal.classList.remove('open');
      App.navigate('tickets');
    } else { showToast(result.message, 'error'); }
  });
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

function createModal(id) {
  const el = document.createElement('div');
  el.id = id;
  el.className = 'modal-overlay';
  document.body.appendChild(el);
  return el;
}

// expose showEventModal globally
window.showEventModal = showEventModal;

// ── Ticket Listeners ──────────────────────────────────
function attachTicketListeners() {
  document.querySelectorAll('.view-qr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const regId = btn.dataset.reg;
      showQRModal(regId);
    });
  });
}

function showQRModal(regId) {
  const user = DB.getCurrentUser();
  const regs = DB.getUserRegistrations(user._id);
  const item = regs.find(r => r._id === regId);
  if (!item) return;

  const modal = document.getElementById('qr-modal') || createModal('qr-modal');
  const date = new Date(item.event.date);

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">🎟 Your Ticket</h2>
        <button class="modal-close" id="qr-modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="ticket-card">
          <div class="ticket-header">
            <div style="font-size:2rem;margin-bottom:8px;">${item.event.emoji}</div>
            <div style="font-weight:700;font-size:1.1rem;">${item.event.title}</div>
            <div style="font-size:0.85rem;opacity:0.8;margin-top:4px;">📍 ${item.event.venue} · 📅 ${date.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
            ${item.checked_in ? '<div style="margin-top:8px;padding:4px 14px;background:rgba(16,185,129,0.3);border-radius:999px;display:inline-block;font-size:0.8rem;color:#34d399;font-weight:600;">✅ CHECKED IN</div>' : ''}
          </div>
          <div class="ticket-divider"><div class="ticket-circle"></div><div class="ticket-circle" style="margin-left:auto;"></div></div>
          <div class="ticket-qr">
            <div class="qr-wrapper"><canvas id="qr-canvas"></canvas></div>
            <div class="ticket-id">${item.qr_code}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);text-align:center;">Show this QR at the venue for entry</div>
          </div>
          <div class="card-footer">
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-secondary);">
              <span>👤 ${user.name}</span>
              <span>🆔 ${user.system_id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  modal.classList.add('open');

  // Generate QR
  setTimeout(() => {
    const canvas = document.getElementById('qr-canvas');
    if (canvas && window.QRCode) {
      QRCode.toCanvas(canvas, item.qr_code, { width: 220, margin: 0, color: { dark: '#000', light: '#fff' } }, err => {
        if (err) console.error(err);
      });
    }
  }, 100);

  modal.querySelector('#qr-modal-close')?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

// ── Profile Listeners ─────────────────────────────────
function attachProfileListeners() {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    DB.logout();
    showToast('Logged out successfully', 'info');
    App.navigate('auth');
  });
}

// ── Admin Listeners ───────────────────────────────────
function attachAdminListeners() {
  // Create event
  document.getElementById('create-event-btn')?.addEventListener('click', () => showCreateEventModal());

  // Admin tabs
  document.querySelectorAll('.filter-tab[data-admin-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab[data-admin-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const panel = tab.dataset.adminTab;
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
      document.getElementById(`admin-panel-${panel}`)?.classList.remove('hidden');
    });
  });

  // Mark winner buttons
  document.querySelectorAll('.mark-winner-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.dataset.user;
      const eventId = btn.dataset.event;
      const result = DB.markWinner(userId, eventId);
      showToast(result.success ? '🏆 Winner marked! +100 credits' : result.message, result.success ? 'success' : 'error');
      if (result.success) App.navigate('admin');
    });
  });

  // Registration search
  document.getElementById('admin-reg-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.reg-row').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

function showCreateEventModal() {
  const modal = document.getElementById('create-event-modal') || createModal('create-event-modal');
  const gradients = [
    'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)',
    'linear-gradient(135deg,#f59e0b 0%,#f43f5e 100%)',
    'linear-gradient(135deg,#06b6d4 0%,#6366f1 100%)',
    'linear-gradient(135deg,#10b981 0%,#06b6d4 100%)',
    'linear-gradient(135deg,#a855f7 0%,#f43f5e 100%)',
  ];
  const emojis = ['💻','🎭','🚀','📸','🤖','🎸','⚽','🧪','🎨','🎤'];

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">➕ Create Event</h2>
        <button class="modal-close" id="cev-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Event Title *</label><input class="form-input" id="cev-title" placeholder="e.g. Hackathon 2026" /></div>
        <div class="form-group"><label class="form-label">Description *</label><textarea class="form-input form-textarea" id="cev-desc" placeholder="Describe the event..."></textarea></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Date & Time *</label><input class="form-input" id="cev-date" type="datetime-local" /></div>
          <div class="form-group"><label class="form-label">Price (₹)</label><input class="form-input" id="cev-price" type="number" placeholder="0 = Free" min="0" /></div>
        </div>
        <div class="form-group"><label class="form-label">Venue *</label><input class="form-input" id="cev-venue" placeholder="e.g. Main Auditorium" /></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group"><label class="form-label">Max Participants</label><input class="form-input" id="cev-max" type="number" placeholder="100" min="1" /></div>
          <div class="form-group"><label class="form-label">Category</label>
            <select class="form-select" id="cev-cat"><option>Technical</option><option>Cultural</option><option>Business</option><option>Arts</option><option>Sports</option></select>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Emoji Icon</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;" id="emoji-picker">
            ${emojis.map((e,i) => `<button class="btn btn-secondary btn-icon" style="font-size:1.4rem;" data-emoji="${e}" id="ep-${i}">${e}</button>`).join('')}
          </div>
          <input class="form-input" id="cev-emoji" placeholder="Or type an emoji" value="🎯" style="margin-top:8px;" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cev-close2">Cancel</button>
        <button class="btn btn-primary" id="cev-submit">🚀 Create Event</button>
      </div>
    </div>`;
  modal.classList.add('open');

  modal.querySelectorAll('[data-emoji]').forEach(btn => {
    btn.addEventListener('click', () => { document.getElementById('cev-emoji').value = btn.dataset.emoji; });
  });

  const close = () => modal.classList.remove('open');
  modal.querySelector('#cev-close').addEventListener('click', close);
  modal.querySelector('#cev-close2').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  modal.querySelector('#cev-submit').addEventListener('click', () => {
    const title = document.getElementById('cev-title').value.trim();
    const desc = document.getElementById('cev-desc').value.trim();
    const date = document.getElementById('cev-date').value;
    const venue = document.getElementById('cev-venue').value.trim();
    const price = parseInt(document.getElementById('cev-price').value) || 0;
    const max = parseInt(document.getElementById('cev-max').value) || 100;
    const category = document.getElementById('cev-cat').value;
    const emoji = document.getElementById('cev-emoji').value || '🎯';
    if (!title || !desc || !date || !venue) { showToast('Please fill all required fields', 'error'); return; }
    const gradient = gradients[Math.floor(Math.random() * gradients.length)];
    const user = DB.getCurrentUser();
    DB.createEvent({ title, description: desc, date: new Date(date).toISOString(), venue, price, max_participants: max, category, emoji, gradient, tags: [category] }, user._id);
    showToast('🎉 Event created!', 'success');
    close();
    App.navigate('admin');
  });
}

// ── Scanner Listeners ─────────────────────────────────
function attachScannerListeners() {
  let stream = null;
  let scanning = false;

  const startBtn = document.getElementById('scanner-start');
  const stopBtn = document.getElementById('scanner-stop');
  const manualBtn = document.getElementById('scanner-manual-btn');

  startBtn?.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = document.getElementById('scanner-video');
      video.srcObject = stream;
      video.play();
      scanning = true;
      startBtn.classList.add('hidden');
      stopBtn.classList.remove('hidden');
      document.getElementById('scanner-view').classList.remove('hidden');
      scanFrame();
    } catch (e) {
      showToast('Camera access denied. Use manual QR input instead.', 'error');
    }
  });

  stopBtn?.addEventListener('click', () => {
    scanning = false;
    stream?.getTracks().forEach(t => t.stop());
    document.getElementById('scanner-view').classList.add('hidden');
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
  });

  manualBtn?.addEventListener('click', () => {
    const code = document.getElementById('scanner-manual-input').value.trim();
    if (!code) { showToast('Enter a QR code', 'error'); return; }
    processQR(code);
  });

  function scanFrame() {
    if (!scanning) return;
    const video = document.getElementById('scanner-video');
    if (video.readyState !== video.HAVE_ENOUGH_DATA) { requestAnimationFrame(scanFrame); return; }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    const code = window.jsQR?.(imageData.data, imageData.width, imageData.height);
    if (code) {
      scanning = false;
      processQR(code.data);
      stopBtn?.click();
    } else { requestAnimationFrame(scanFrame); }
  }

  function processQR(qrCode) {
    const result = DB.checkInByQR(qrCode);
    const resultBox = document.getElementById('scan-result');
    if (resultBox) {
      resultBox.classList.remove('hidden');
      if (result.success) {
        resultBox.innerHTML = `
          <div style="padding:var(--space-lg);background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-lg);text-align:center;animation:badgePop 0.5s var(--ease-bounce) both">
            <div style="font-size:3rem;margin-bottom:8px;">✅</div>
            <div style="font-weight:700;color:#34d399;font-size:1.1rem;">Check-in Successful!</div>
            <div style="color:var(--text-secondary);font-size:0.9rem;margin-top:8px;">
              <strong>${result.user?.name}</strong> · ${result.event?.title}<br/>
              <span style="color:var(--indigo-light);">+10 credits awarded 🎉</span>
            </div>
          </div>`;
        showToast(`✅ ${result.user?.name} checked in! +10 credits`, 'success');
      } else if (result.alreadyDone) {
        resultBox.innerHTML = `<div style="padding:var(--space-lg);background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-lg);text-align:center;"><div style="font-size:3rem;">⚠️</div><div style="font-weight:700;color:#fbbf24;">Already Checked In</div><div style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px;">This ticket was already used</div></div>`;
        showToast('Already checked in!', 'warning');
      } else {
        resultBox.innerHTML = `<div style="padding:var(--space-lg);background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.3);border-radius:var(--radius-lg);text-align:center;"><div style="font-size:3rem;">❌</div><div style="font-weight:700;color:var(--rose-light);">${result.message}</div></div>`;
        showToast(result.message, 'error');
      }
    }
    document.getElementById('scanner-manual-input').value = '';
  }
}

// ── Bootstrap ─────────────────────────────────────────
window.App = App;
App.navigate(DB.getCurrentUser() ? 'home' : 'auth');
