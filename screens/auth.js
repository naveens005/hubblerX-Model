export function renderAuth() {
  return `
  <div class="auth-screen">
    <div class="auth-bg">
      <div class="auth-orb auth-orb-1"></div>
      <div class="auth-orb auth-orb-2"></div>
      <div class="auth-orb auth-orb-3"></div>
    </div>
    <div class="auth-container">
      <div class="auth-logo-area">
        <div class="auth-logo">⚡</div>
        <div class="auth-title">HubblerX</div>
        <div class="auth-tagline">Your college events, all in one place</div>
      </div>

      <div class="auth-card">

        <!-- Step 1: Phone -->
        <div id="step-phone">
          <div style="margin-bottom:var(--space-lg);">
            <div style="font-size:1.1rem;font-weight:700;margin-bottom:4px;">🔐 Login with OTP</div>
            <div style="font-size:0.85rem;color:var(--text-secondary);">We'll send a one-time password to your phone</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--space-md);">
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <div style="display:flex;gap:8px;">
                <div class="form-input" style="width:60px;flex-shrink:0;text-align:center;color:var(--text-secondary);">+91</div>
                <input id="auth-phone" class="form-input" type="tel" placeholder="9876543210" maxlength="10" style="flex:1;" />
              </div>
            </div>
            <button class="btn btn-primary btn-full" id="auth-send-otp">Send OTP →</button>
            <div class="divider"></div>
            <button class="btn btn-secondary btn-full" id="auth-admin-demo" style="font-size:0.82rem;">
              ⚙️ Demo: Login as Admin
            </button>
          </div>
        </div>

        <!-- Step 2: OTP Verify -->
        <div id="step-otp" class="hidden">
          <div style="margin-bottom:var(--space-lg);">
            <button id="otp-back" style="color:var(--text-secondary);font-size:0.85rem;display:flex;align-items:center;gap:4px;margin-bottom:12px;">← Back</button>
            <div style="font-size:1.1rem;font-weight:700;margin-bottom:4px;">Enter OTP</div>
            <div style="font-size:0.85rem;color:var(--text-secondary);">Sent to +91 <span id="otp-phone-display" style="color:var(--text-primary);font-weight:600;"></span></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--space-md);">
            <div class="otp-inputs">
              <input class="otp-input" id="otp-1" type="number" maxlength="1" min="0" max="9" />
              <input class="otp-input" id="otp-2" type="number" maxlength="1" min="0" max="9" />
              <input class="otp-input" id="otp-3" type="number" maxlength="1" min="0" max="9" />
              <input class="otp-input" id="otp-4" type="number" maxlength="1" min="0" max="9" />
            </div>
            <div style="text-align:center;font-size:0.8rem;color:var(--text-muted);">Demo OTP: <strong style="color:var(--indigo-light);">1234</strong></div>
            <button class="btn btn-primary btn-full" id="auth-verify-otp">Verify & Continue →</button>
          </div>
        </div>

        <!-- Step 3: Register -->
        <div id="step-register" class="hidden">
          <div style="margin-bottom:var(--space-lg);">
            <div style="font-size:1.1rem;font-weight:700;margin-bottom:4px;">👋 Create your Hubbler ID</div>
            <div style="font-size:0.85rem;color:var(--text-secondary);">Fill in your details to get started</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--space-md);">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input id="reg-name" class="form-input" placeholder="Arjun Sharma" />
            </div>
            <div class="form-group">
              <label class="form-label">College *</label>
              <input id="reg-college" class="form-input" placeholder="VIT Chennai" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div class="form-group">
                <label class="form-label">Department *</label>
                <input id="reg-dept" class="form-input" placeholder="CSE" />
              </div>
              <div class="form-group">
                <label class="form-label">Year *</label>
                <select id="reg-year" class="form-select">
                  <option value="">Select</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email (optional)</label>
              <input id="reg-email" class="form-input" type="email" placeholder="you@college.edu" />
            </div>
            <button class="btn btn-primary btn-full" id="auth-register">🚀 Create My Hubbler ID</button>
          </div>
        </div>

      </div>

      <div style="text-align:center;margin-top:var(--space-lg);font-size:0.78rem;color:var(--text-muted);">
        By continuing, you agree to HubblerX Terms & Privacy Policy
      </div>
    </div>
  </div>`;
}

