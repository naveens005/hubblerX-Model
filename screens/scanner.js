export function renderScanner() {
  return `
  <div class="content-wrapper" style="max-width:600px;">
    <div class="page-header">
      <h1 class="page-title">📷 QR Scanner</h1>
      <div class="page-subtitle">Scan student QR codes to mark attendance</div>
    </div>

    <!-- Camera Controls -->
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-lg);margin-bottom:var(--space-xl);">
      <div id="scanner-view" class="hidden" style="width:100%;">
        <div class="scanner-wrap">
          <video id="scanner-video" autoplay playsinline muted></video>
          <div class="scanner-line"></div>
          <div class="scanner-corners">
            <div class="scanner-corner corner-tl"></div>
            <div class="scanner-corner corner-tr"></div>
            <div class="scanner-corner corner-bl"></div>
            <div class="scanner-corner corner-br"></div>
          </div>
        </div>
        <div style="text-align:center;margin-top:var(--space-sm);font-size:0.82rem;color:var(--text-secondary);">
          Point camera at student's QR code
        </div>
      </div>

      <div style="display:flex;gap:var(--space-sm);">
        <button class="btn btn-primary" id="scanner-start">
          📷 Start Camera
        </button>
        <button class="btn btn-danger hidden" id="scanner-stop">
          ⏹ Stop Camera
        </button>
      </div>
    </div>

    <!-- Manual QR Input -->
    <div class="card mb-lg">
      <div class="card-header">
        <div style="font-weight:700;">⌨️ Manual QR Entry</div>
        <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px;">Paste or type the QR code if camera is unavailable</div>
      </div>
      <div class="card-body">
        <div style="display:flex;gap:var(--space-sm);">
          <input class="form-input" id="scanner-manual-input"
            placeholder="e.g. HX-QR-_abc123-evt001-..." style="flex:1;" />
          <button class="btn btn-primary" id="scanner-manual-btn">
            ✅ Check In
          </button>
        </div>
      </div>
    </div>

    <!-- Scan Result -->
    <div id="scan-result" class="hidden"></div>

    <!-- Instructions -->
    <div class="card" style="margin-top:var(--space-lg);">
      <div class="card-body">
        <div style="font-weight:700;margin-bottom:var(--space-sm);">📋 How it works</div>
        <div style="display:flex;flex-direction:column;gap:var(--space-sm);font-size:0.85rem;color:var(--text-secondary);">
          <div style="display:flex;gap:var(--space-sm);align-items:flex-start;">
            <span style="color:var(--indigo-light);font-weight:700;flex-shrink:0;">1.</span>
            Student opens their ticket in the app and shows QR code
          </div>
          <div style="display:flex;gap:var(--space-sm);align-items:flex-start;">
            <span style="color:var(--indigo-light);font-weight:700;flex-shrink:0;">2.</span>
            Admin scans QR with this scanner
          </div>
          <div style="display:flex;gap:var(--space-sm);align-items:flex-start;">
            <span style="color:var(--indigo-light);font-weight:700;flex-shrink:0;">3.</span>
            System validates and marks attendance automatically
          </div>
          <div style="display:flex;gap:var(--space-sm);align-items:flex-start;">
            <span style="color:#fbbf24;font-weight:700;flex-shrink:0;">⚡</span>
            Student receives +10 credits instantly
          </div>
        </div>
      </div>
    </div>

    <!-- Demo hint -->
    <div style="margin-top:var(--space-lg);padding:var(--space-md);background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.2);border-radius:var(--radius-md);font-size:0.82rem;">
      <strong style="color:var(--cyan-light);">💡 Demo Tip:</strong>
      <span style="color:var(--text-secondary);"> Register for an event as a student, then paste the QR code string shown on the ticket into the manual input above to simulate a check-in.</span>
    </div>
  </div>`;
}

