/**
 * HubblerX - Data Store (In-memory database simulation)
 * Simulates MongoDB collections with localStorage persistence
 */

export const DB = {
  _store: {
    users: [],
    events: [],
    registrations: [],
    creditsLog: [],
    currentUser: null,
  },

  _save() {
    try {
      localStorage.setItem('hubblerx_db', JSON.stringify(this._store));
    } catch (e) { console.warn('Storage full', e); }
  },

  _load() {
    try {
      const raw = localStorage.getItem('hubblerx_db');
      if (raw) {
        const parsed = JSON.parse(raw);
        this._store = { ...this._store, ...parsed };
      }
    } catch (e) { console.warn('Load error', e); }
  },

  _id() {
    return '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  },

  init() {
    this._load();
    if (this._store.events.length === 0) this._seed();
    return this;
  },

  _seed() {
    // Seed admin user
    const admin = {
      _id: 'admin001',
      name: 'Admin User',
      email: 'admin@hubblerx.in',
      phone: '+919999999999',
      college: 'HubblerX HQ',
      department: 'Platform',
      year: '4',
      handle: '@admin',
      system_id: 'HX-0000-ADMIN',
      credits: 999,
      isAdmin: true,
      created_at: new Date().toISOString(),
    };

    // Seed demo events
    const events = [
      {
        _id: 'evt001',
        title: 'TechFest 2026 — Hackathon',
        description: 'A 24-hour coding marathon. Build something insane, win big prizes. Open for all branches. Free food provided!',
        date: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        venue: 'Main Auditorium, Block A',
        price: 0,
        max_participants: 200,
        created_by: 'admin001',
        created_at: new Date().toISOString(),
        emoji: '💻',
        category: 'Technical',
        tags: ['Coding', 'Hackathon', 'Prizes'],
        gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      },
      {
        _id: 'evt002',
        title: 'Cultural Nite 2026',
        description: 'A spectacular evening of music, dance, and drama. Multiple stages, guest performances, and a grand finale. Tickets selling fast!',
        date: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
        venue: 'Open Air Theatre',
        price: 150,
        max_participants: 500,
        created_by: 'admin001',
        created_at: new Date().toISOString(),
        emoji: '🎭',
        category: 'Cultural',
        tags: ['Music', 'Dance', 'Drama'],
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)',
      },
      {
        _id: 'evt003',
        title: 'Startup Pitch Competition',
        description: "Got an idea? Pitch it to a panel of investors and mentors. Top 3 teams win seed funding and mentorship. Don't miss this opportunity!",
        date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
        venue: 'Seminar Hall 2',
        price: 100,
        max_participants: 60,
        created_by: 'admin001',
        created_at: new Date().toISOString(),
        emoji: '🚀',
        category: 'Business',
        tags: ['Startup', 'Pitch', 'Funding'],
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
      },
      {
        _id: 'evt004',
        title: 'Photography Walk',
        description: 'Explore the campus through your lens. Session with a professional photographer, photo critique, and exhibition of best shots.',
        date: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
        venue: 'Campus Gardens',
        price: 0,
        max_participants: 40,
        created_by: 'admin001',
        created_at: new Date().toISOString(),
        emoji: '📸',
        category: 'Arts',
        tags: ['Photography', 'Art', 'Exhibition'],
        gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      },
      {
        _id: 'evt005',
        title: 'ML & AI Summit',
        description: 'Industry leaders talking about the future of AI. Live demos, Q&A, and networking session. Certificate of participation provided.',
        date: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
        venue: 'Conference Hall, Block B',
        price: 200,
        max_participants: 150,
        created_by: 'admin001',
        created_at: new Date().toISOString(),
        emoji: '🤖',
        category: 'Technical',
        tags: ['AI', 'ML', 'Summit', 'Networking'],
        gradient: 'linear-gradient(135deg, #a855f7 0%, #f43f5e 100%)',
      },
      {
        _id: 'evt006',
        title: 'Battle of Bands',
        description: 'Calling all musicians! Form your band and battle it out on stage. Prizes worth ₹50,000. Electrifying performances guaranteed!',
        date: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString(),
        venue: 'Open Air Amphitheatre',
        price: 50,
        max_participants: 80,
        created_by: 'admin001',
        created_at: new Date().toISOString(),
        emoji: '🎸',
        category: 'Cultural',
        tags: ['Music', 'Band', 'Competition'],
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
      },
    ];

    // Seed leaderboard users
    const leaderUsers = [
      { _id: 'u001', name: 'Arjun Sharma', college: 'VIT Chennai', department: 'CSE', year: '3', handle: '@arjuns', system_id: 'HX-1001-ARJN', credits: 0, email: '', phone: '+919876543210', created_at: new Date().toISOString() },
      { _id: 'u002', name: 'Priya Nair', college: 'SSN College', department: 'ECE', year: '2', handle: '@priyan', system_id: 'HX-1002-PRYA', credits: 0, email: '', phone: '+919876543211', created_at: new Date().toISOString() },
      { _id: 'u003', name: 'Karthik Raj', college: 'CEG Anna Univ', department: 'IT', year: '4', handle: '@karthikr', system_id: 'HX-1003-KRTH', credits: 0, email: '', phone: '+919876543212', created_at: new Date().toISOString() },
      { _id: 'u004', name: 'Sneha Balaji', college: 'SRM University', department: 'CS', year: '1', handle: '@snehab', system_id: 'HX-1004-SNHB', credits: 0, email: '', phone: '+919876543213', created_at: new Date().toISOString() },
      { _id: 'u005', name: 'Dev Patel', college: 'Manipal IT', department: 'AIML', year: '3', handle: '@devp', system_id: 'HX-1005-DEVP', credits: 0, email: '', phone: '+919876543214', created_at: new Date().toISOString() },
    ];

    // Seed credits log (makes fake leaderboard)
    const credLogs = [
      { _id: DB._id(), user_id: 'u001', event_id: 'evt001', type: 'winner', points: 100, created_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u001', event_id: 'evt003', type: 'participation', points: 10, created_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u002', event_id: 'evt002', type: 'winner', points: 100, created_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u002', event_id: 'evt004', type: 'participation', points: 10, created_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u003', event_id: 'evt001', type: 'participation', points: 10, created_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u003', event_id: 'evt005', type: 'participation', points: 10, created_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u004', event_id: 'evt003', type: 'participation', points: 10, created_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u005', event_id: 'evt002', type: 'participation', points: 10, created_at: new Date().toISOString() },
    ];

    // Seed registrations (so leaderboard users have tickets)
    const regs = [
      { _id: DB._id(), user_id: 'u001', event_id: 'evt001', qr_code: 'QR-u001-evt001', checked_in: true, checked_in_at: new Date().toISOString(), registered_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u002', event_id: 'evt002', qr_code: 'QR-u002-evt002', checked_in: true, checked_in_at: new Date().toISOString(), registered_at: new Date().toISOString() },
      { _id: DB._id(), user_id: 'u003', event_id: 'evt001', qr_code: 'QR-u003-evt001', checked_in: true, checked_in_at: new Date().toISOString(), registered_at: new Date().toISOString() },
    ];

    this._store.users = [admin, ...leaderUsers];
    this._store.events = events;
    this._store.registrations = regs;
    this._store.creditsLog = credLogs;

    // Update user credits from logs
    leaderUsers.forEach(u => {
      u.credits = credLogs.filter(c => c.user_id === u._id).reduce((s, c) => s + c.points, 0);
    });
    this._store.users = [admin, ...leaderUsers];
    this._save();
  },

  // ---- AUTH ----
  getCurrentUser() { return this._store.currentUser; },
  setCurrentUser(user) { this._store.currentUser = user; this._save(); },
  logout() { this._store.currentUser = null; this._save(); },

  getUserByPhone(phone) {
    return this._store.users.find(u => u.phone === phone);
  },

  registerUser(data) {
    const existing = this.getUserByPhone(data.phone);
    if (existing) return existing;
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const initials = data.name.split(' ').map(n => n[0].toUpperCase()).join('').slice(0, 4);
    const user = {
      _id: this._id(),
      name: data.name,
      email: data.email || '',
      phone: data.phone,
      college: data.college,
      department: data.department,
      year: data.year,
      handle: '@' + data.name.toLowerCase().replace(/\s+/g, '') + rand,
      system_id: `HX-${year}-${initials}${rand}`,
      credits: 0,
      isAdmin: false,
      created_at: new Date().toISOString(),
    };
    this._store.users.push(user);
    this._save();
    return user;
  },

  // ---- EVENTS ----
  getEvents(filter) {
    let evts = [...this._store.events].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (filter && filter !== 'All') evts = evts.filter(e => e.category === filter);
    return evts;
  },

  getEvent(id) { return this._store.events.find(e => e._id === id); },

  createEvent(data, adminId) {
    const evt = {
      _id: this._id(),
      ...data,
      created_by: adminId,
      created_at: new Date().toISOString(),
      emoji: data.emoji || '📅',
      gradient: data.gradient || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    };
    this._store.events.push(evt);
    this._save();
    return evt;
  },

  // ---- REGISTRATIONS ----
  getRegistration(userId, eventId) {
    return this._store.registrations.find(r => r.user_id === userId && r.event_id === eventId);
  },

  getUserRegistrations(userId) {
    return this._store.registrations
      .filter(r => r.user_id === userId)
      .map(r => ({ ...r, event: this.getEvent(r.event_id) }))
      .filter(r => r.event)
      .sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at));
  },

  getEventRegistrations(eventId) {
    return this._store.registrations
      .filter(r => r.event_id === eventId)
      .map(r => ({ ...r, user: this._store.users.find(u => u._id === r.user_id) }));
  },

  registerForEvent(userId, eventId) {
    const existing = this.getRegistration(userId, eventId);
    if (existing) return { success: false, message: 'Already registered', reg: existing };
    const event = this.getEvent(eventId);
    if (!event) return { success: false, message: 'Event not found' };
    const count = this._store.registrations.filter(r => r.event_id === eventId).length;
    if (count >= event.max_participants) return { success: false, message: 'Event is full' };
    const reg = {
      _id: this._id(),
      user_id: userId,
      event_id: eventId,
      qr_code: `HX-QR-${userId}-${eventId}-${Date.now()}`,
      checked_in: false,
      checked_in_at: null,
      registered_at: new Date().toISOString(),
    };
    this._store.registrations.push(reg);
    this._save();
    return { success: true, reg };
  },

  checkInByQR(qrCode) {
    const reg = this._store.registrations.find(r => r.qr_code === qrCode);
    if (!reg) return { success: false, message: 'Invalid QR Code — Not found in system' };
    if (reg.checked_in) return { success: false, message: 'Already checked in!', reg, alreadyDone: true };
    reg.checked_in = true;
    reg.checked_in_at = new Date().toISOString();
    // Add credits
    this.addCredits(reg.user_id, reg.event_id, 'participation', 10);
    this._save();
    const user = this._store.users.find(u => u._id === reg.user_id);
    const event = this.getEvent(reg.event_id);
    return { success: true, reg, user, event };
  },

  // ---- CREDITS ----
  addCredits(userId, eventId, type, points) {
    const log = {
      _id: this._id(),
      user_id: userId,
      event_id: eventId,
      type,
      points,
      created_at: new Date().toISOString(),
    };
    this._store.creditsLog.push(log);
    const user = this._store.users.find(u => u._id === userId);
    if (user) {
      user.credits = (user.credits || 0) + points;
      if (this._store.currentUser && this._store.currentUser._id === userId) {
        this._store.currentUser.credits = user.credits;
      }
    }
    this._save();
    return log;
  },

  markWinner(userId, eventId) {
    const existing = this._store.creditsLog.find(c => c.user_id === userId && c.event_id === eventId && c.type === 'winner');
    if (existing) return { success: false, message: 'Already marked as winner' };
    const log = this.addCredits(userId, eventId, 'winner', 100);
    return { success: true, log };
  },

  getUserCreditsLog(userId) {
    return this._store.creditsLog
      .filter(c => c.user_id === userId)
      .map(c => ({ ...c, event: this.getEvent(c.event_id) }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // ---- LEADERBOARD ----
  getLeaderboard() {
    const creditMap = {};
    this._store.creditsLog.forEach(c => {
      creditMap[c.user_id] = (creditMap[c.user_id] || 0) + c.points;
    });
    return this._store.users
      .filter(u => !u.isAdmin)
      .map(u => ({ ...u, totalCredits: creditMap[u._id] || u.credits || 0 }))
      .sort((a, b) => b.totalCredits - a.totalCredits);
  },

  // ---- ADMIN ----
  getAllUsers() { return this._store.users.filter(u => !u.isAdmin); },
  getEventCount() { return this._store.events.length; },
  getTotalRegistrations() { return this._store.registrations.length; },
  getTotalCheckins() { return this._store.registrations.filter(r => r.checked_in).length; },
};
