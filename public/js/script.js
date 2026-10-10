/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * Client-Side JavaScript Engine: Advanced Server-Side (Job Queue, Server Cache, Audit Logs, Auth, CRUD & External APIs)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DOM ELEMENT REFERENCES
  // --------------------------------------------------------------------------

  // Registration Application Form (Task 4/5/6)
  const registrationForm = document.getElementById('registration-form') || document.querySelector('form.needs-validation');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const ageInput = document.getElementById('age');
  const courseInput = document.getElementById('course');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('terms');

  // Interactive buttons & toggles
  const togglePasswordBtn = document.getElementById('toggle-password');
  const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');

  // Character counter & password strength/checklist
  const strengthBar = document.getElementById('password-strength-bar');
  const strengthText = document.getElementById('password-strength-text');
  const reqLength = document.getElementById('req-length');
  const reqUpper = document.getElementById('req-uppercase');
  const reqLower = document.getElementById('req-lowercase');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');

  // Live preview elements
  const previewName = document.getElementById('preview-name');
  const previewEmail = document.getElementById('preview-email');
  const previewPhone = document.getElementById('preview-phone');
  const previewCourse = document.getElementById('preview-course');
  const previewStrength = document.getElementById('preview-strength');
  const previewTerms = document.getElementById('preview-terms');

  // Auth DOM Elements
  const loginForm = document.getElementById('login-form');
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const toggleLoginPasswordBtn = document.getElementById('toggle-login-password');
  const loginSubmitBtn = document.getElementById('login-submit-btn');

  const userRegisterForm = document.getElementById('user-register-form');
  const regAccNameInput = document.getElementById('reg-acc-name');
  const regAccEmailInput = document.getElementById('reg-acc-email');
  const regAccPasswordInput = document.getElementById('reg-acc-password');
  const toggleRegAccPasswordBtn = document.getElementById('toggle-reg-acc-password');
  const regAccSubmitBtn = document.getElementById('reg-acc-submit-btn');

  // Navbar Auth UI elements
  const navAuthGuest = document.getElementById('nav-auth-guest');
  const navAuthUser = document.getElementById('nav-auth-user');
  const navUserName = document.getElementById('nav-user-name');
  const btnLogoutNav = document.getElementById('btn-logout-nav');

  // Router views & containers
  const mainPortalContent = document.getElementById('main-portal-content');
  const jobsSection = document.getElementById('jobs-section');
  const serverCacheSection = document.getElementById('server-cache-section');
  const externalApiSection = document.getElementById('external-api-section');
  const oauthDemoSection = document.getElementById('oauth-demo-section');
  const loginSection = document.getElementById('login-section');
  const userRegisterSection = document.getElementById('user-register-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const successSection = document.getElementById('success-section');
  const notFoundSection = document.getElementById('not-found-section');

  // Dashboard DOM Elements
  const dashboardTableBody = document.getElementById('dashboard-table-body');
  const dashboardLoading = document.getElementById('dashboard-loading');
  const dashboardEmpty = document.getElementById('dashboard-empty');
  const dashboardError = document.getElementById('dashboard-error');
  const dashboardErrorMessage = document.getElementById('dashboard-error-message');
  const dashboardSearch = document.getElementById('dashboard-search');
  const btnRefreshDashboard = document.getElementById('btn-refresh-dashboard');
  const dashboardTotalCount = document.getElementById('dashboard-total-count');

  // Edit Modal Elements
  const editModalEl = document.getElementById('editRegistrationModal');
  const editForm = document.getElementById('edit-registration-form');
  const editIdInput = document.getElementById('edit-id');
  const editNameInput = document.getElementById('edit-name');
  const editEmailInput = document.getElementById('edit-email');
  const editPhoneInput = document.getElementById('edit-phone');
  const editAgeInput = document.getElementById('edit-age');
  const editCourseInput = document.getElementById('edit-course');
  const editSaveBtn = document.getElementById('edit-save-btn');

  // Delete Modal Elements
  const deleteModalEl = document.getElementById('deleteRegistrationModal');
  const deleteConfirmName = document.getElementById('delete-confirm-name');
  const deleteConfirmBtn = document.getElementById('delete-confirm-btn');

  // Alert Container
  const apiNotificationAlert = document.getElementById('api-notification-alert');

  // Task 8 Background Job Queue DOM Elements
  const jobsActiveWorkers = document.getElementById('jobs-active-workers');
  const jobsPendingCount = document.getElementById('jobs-pending-count');
  const jobsCompletedCount = document.getElementById('jobs-completed-count');
  const jobsTotalCount = document.getElementById('jobs-total-count');
  const jobsTableBody = document.getElementById('jobs-table-body');
  const btnRefreshJobs = document.getElementById('btn-refresh-jobs');
  const btnClearJobs = document.getElementById('btn-clear-jobs');
  const btnEnqueueActions = document.querySelectorAll('.btn-enqueue-action');

  const jobDetailsModalEl = document.getElementById('jobDetailsModal');
  const modalJobId = document.getElementById('modal-job-id');
  const modalJobType = document.getElementById('modal-job-type');
  const modalJobResult = document.getElementById('modal-job-result');
  const modalJobLogs = document.getElementById('modal-job-logs');

  // Task 8 Server-Side Cache & Logs DOM Elements
  const heroCacheHitRatio = document.getElementById('hero-cache-hit-ratio');
  const heroCacheProgressBar = document.getElementById('hero-cache-progress-bar');
  const cacheHitRatioBig = document.getElementById('cache-hit-ratio-big');
  const cacheHitProgressBar = document.getElementById('cache-hit-progress-bar');
  const cacheTotalHits = document.getElementById('cache-total-hits');
  const cacheTotalMisses = document.getElementById('cache-total-misses');
  const cacheTotalKeys = document.getElementById('cache-total-keys');
  const cacheKeysCountBadge = document.getElementById('cache-keys-count-badge');
  const cacheKeysTableBody = document.getElementById('cache-keys-table-body');
  const btnRefreshCacheData = document.getElementById('btn-refresh-cache-data');
  const btnFlushServerCache = document.getElementById('btn-flush-server-cache');

  const serverLogsTableBody = document.getElementById('server-logs-table-body');
  const btnClearLogs = document.getElementById('btn-clear-logs');

  // Task 7 External API Elements
  const weatherCitySelect = document.getElementById('weather-city-select');
  const btnFetchWeather = document.getElementById('btn-fetch-weather');
  const weatherLoading = document.getElementById('weather-loading');
  const weatherDisplay = document.getElementById('weather-display');
  const weatherCityName = document.getElementById('weather-city-name');
  const weatherState = document.getElementById('weather-state');
  const weatherTemp = document.getElementById('weather-temp');
  const weatherCondition = document.getElementById('weather-condition');
  const weatherWind = document.getElementById('weather-wind');
  const weatherHumidity = document.getElementById('weather-humidity');
  const weatherLatency = document.getElementById('weather-latency');
  const weatherStatus = document.getElementById('weather-status');
  const weatherCacheBadge = document.getElementById('weather-cache-badge');
  const btnClearApiCache = document.getElementById('btn-clear-api-cache');

  const rateLimitRemainingText = document.getElementById('rate-limit-remaining-text');
  const rateLimitProgressBar = document.getElementById('rate-limit-progress-bar');
  const btnCheckRateLimit = document.getElementById('btn-check-rate-limit');
  const btnTestRateLimitBurst = document.getElementById('btn-test-rate-limit-burst');

  const reposLoading = document.getElementById('repos-loading');
  const reposGrid = document.getElementById('repos-grid');
  const repoTopicBtns = document.querySelectorAll('.repo-topic-btn');

  // Task 7 OAuth 2.0 Elements
  const oauthStep1Box = document.getElementById('oauth-step1-box');
  const oauthStep2Box = document.getElementById('oauth-step2-box');
  const oauthStep3Box = document.getElementById('oauth-step3-box');
  const oauthClientId = document.getElementById('oauth-client-id');
  const oauthRedirectUri = document.getElementById('oauth-redirect-uri');
  const oauthScope = document.getElementById('oauth-scope');
  const oauthState = document.getElementById('oauth-state');
  const oauthClientSecret = document.getElementById('oauth-client-secret');
  const oauthCodeDisplay = document.getElementById('oauth-code-display');
  const oauthAccessTokenDisplay = document.getElementById('oauth-access-token-display');
  const btnOauthStep1 = document.getElementById('btn-oauth-step1');
  const btnOauthStep2 = document.getElementById('btn-oauth-step2');
  const btnOauthStep3 = document.getElementById('btn-oauth-step3');
  const btnOauthReset = document.getElementById('btn-oauth-reset');
  const oauthInspectorOutput = document.getElementById('oauth-inspector-output');
  const oauthProgressBar = document.getElementById('oauth-progress-bar');

  // Success view elements
  const successName = document.getElementById('success-name');
  const successDetailName = document.getElementById('success-detail-name');
  const successDetailEmail = document.getElementById('success-detail-email');
  const successDetailCourse = document.getElementById('success-detail-course');
  const successTimestamp = document.getElementById('success-timestamp');

  // State
  let registrationsList = [];
  let isRegistrationComplete = false;
  let targetDeleteId = null;
  let bootstrapEditModal = null;
  let bootstrapDeleteModal = null;
  let bootstrapJobDetailsModal = null;
  let jobPollingTimer = null;

  let currentAuthCode = null;
  let currentOAuthToken = null;
  let activeRepoTopic = 'web-development';

  if (typeof bootstrap !== 'undefined') {
    if (editModalEl) bootstrapEditModal = new bootstrap.Modal(editModalEl);
    if (deleteModalEl) bootstrapDeleteModal = new bootstrap.Modal(deleteModalEl);
    if (jobDetailsModalEl) bootstrapJobDetailsModal = new bootstrap.Modal(jobDetailsModalEl);
  }

  // Auth State
  let authToken = localStorage.getItem('task8_token') || localStorage.getItem('task7_token') || null;
  let currentUser = JSON.parse(localStorage.getItem('task8_user') || localStorage.getItem('task7_user') || 'null');

  // --------------------------------------------------------------------------
  // 2. AUTHENTICATION & SESSION MANAGEMENT
  // --------------------------------------------------------------------------

  function getAuthHeader() {
    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
  }

  function updateAuthUI() {
    if (authToken && currentUser) {
      if (navAuthGuest) navAuthGuest.style.display = 'none';
      if (navAuthUser) navAuthUser.style.display = 'flex';
      if (navUserName) navUserName.textContent = currentUser.name || currentUser.email;
    } else {
      if (navAuthGuest) navAuthGuest.style.display = 'flex';
      if (navAuthUser) navAuthUser.style.display = 'none';
      if (navUserName) navUserName.textContent = '';
    }
  }

  function saveAuthSession(token, user) {
    authToken = token;
    currentUser = user;
    localStorage.setItem('task8_token', token);
    localStorage.setItem('task8_user', JSON.stringify(user));
    updateAuthUI();
  }

  function logoutUser() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('task8_token');
    localStorage.removeItem('task8_user');
    updateAuthUI();
    showToastNotification('Logged out successfully.', 'success');
    window.location.hash = '#home';
  }

  if (btnLogoutNav) {
    btnLogoutNav.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // --------------------------------------------------------------------------
  // 3. VALIDATION UTILITY FUNCTIONS
  // --------------------------------------------------------------------------

  function validateName(value) {
    const trimmed = value.trim();
    if (!trimmed) return { isValid: false, message: 'Full name is required.' };
    if (trimmed.length < 2) return { isValid: false, message: 'Name must be at least 2 characters long.' };
    if (/^\d+$/.test(trimmed)) return { isValid: false, message: 'Name cannot contain only numbers.' };
    return { isValid: true, message: 'Valid name.' };
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) return { isValid: false, message: 'Email address is required.' };
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return { isValid: false, message: 'Please enter a valid email address.' };
    return { isValid: true, message: 'Valid email.' };
  }

  function validatePhone(value) {
    const trimmed = value.trim();
    if (!trimmed) return { isValid: false, message: 'Phone number is required.' };
    if (/[^\d]/.test(trimmed)) return { isValid: false, message: 'Phone number must contain digits only.' };
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(trimmed)) return { isValid: false, message: 'Valid 10-digit mobile number required (starts with 6-9).' };
    return { isValid: true, message: 'Valid 10-digit phone number.' };
  }

  function validateAge(value) {
    const trimmed = value.trim();
    if (!trimmed) return { isValid: false, message: 'Age is required.' };
    const ageNum = parseInt(trimmed, 10);
    if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) return { isValid: false, message: 'Age must be between 16 and 100.' };
    return { isValid: true, message: 'Valid age.' };
  }

  function validateCourse(value) {
    if (!value || value === '') return { isValid: false, message: 'Please select an engineering course.' };
    return { isValid: true, message: 'Course selected.' };
  }

  function checkPasswordCriteria(password) {
    return {
      hasMinLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  }

  function validatePassword(value) {
    if (!value) return { isValid: false, message: 'Password is required.', score: 0 };
    const criteria = checkPasswordCriteria(value);
    const score = Object.values(criteria).filter(Boolean).length;
    if (!criteria.hasMinLength) return { isValid: false, message: 'Password must be at least 8 characters long.', score, criteria };
    if (!criteria.hasUpper) return { isValid: false, message: 'Must contain an uppercase letter.', score, criteria };
    if (!criteria.hasLower) return { isValid: false, message: 'Must contain a lowercase letter.', score, criteria };
    if (!criteria.hasNumber) return { isValid: false, message: 'Must contain a number.', score, criteria };
    if (!criteria.hasSpecial) return { isValid: false, message: 'Must contain a special character (!@#$%^&*).', score, criteria };
    return { isValid: true, message: 'Strong password meeting all requirements.', score, criteria };
  }

  function validateConfirmPassword(confirmValue, passwordValue) {
    if (!confirmValue) return { isValid: false, message: 'Please confirm your password.' };
    if (confirmValue !== passwordValue) return { isValid: false, message: 'Passwords do not match.' };
    return { isValid: true, message: 'Passwords match.' };
  }

  function validateTerms(isChecked) {
    if (!isChecked) return { isValid: false, message: 'You must accept the Terms and Conditions.' };
    return { isValid: true, message: 'Terms accepted.' };
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToastNotification(message, type = 'info') {
    if (!apiNotificationAlert) return;
    const alertClass = type === 'danger' || type === 'error' ? 'alert-danger' : (type === 'success' ? 'alert-success' : 'alert-info');
    const icon = type === 'danger' || type === 'error' ? 'bi-exclamation-octagon-fill' : (type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill');
    
    apiNotificationAlert.className = `alert ${alertClass} alert-dismissible fade show shadow-sm mb-3`;
    apiNotificationAlert.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi ${icon} fs-5 me-2"></i>
        <div>${escapeHtml(message)}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    apiNotificationAlert.style.display = 'block';

    setTimeout(() => {
      if (apiNotificationAlert) apiNotificationAlert.style.display = 'none';
    }, 6000);
  }

  function setFieldState(inputElement, errorId, result) {
    if (!inputElement) return;
    const errorElement = document.getElementById(errorId);
    if (result.isValid) {
      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    } else {
      inputElement.classList.remove('is-valid');
      inputElement.classList.add('is-invalid');
      if (errorElement) {
        errorElement.textContent = result.message;
        errorElement.style.display = 'block';
      }
    }
  }

  function clearFieldState(inputElement, errorId) {
    if (!inputElement) return;
    const errorElement = document.getElementById(errorId);
    inputElement.classList.remove('is-valid', 'is-invalid');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  // --------------------------------------------------------------------------
  // 4. REAL-TIME DOM MANIPULATION & INTERACTION HANDLERS
  // --------------------------------------------------------------------------

  function updatePasswordChecklist(criteria) {
    function updateItem(el, isPassed) {
      if (!el) return;
      if (isPassed) {
        el.className = 'text-success fw-semibold d-flex align-items-center gap-1.5 py-0.5';
        el.querySelector('i').className = 'bi bi-check-circle-fill text-success';
      } else {
        el.className = 'text-muted d-flex align-items-center gap-1.5 py-0.5';
        el.querySelector('i').className = 'bi bi-circle text-muted';
      }
    }
    const c = criteria || { hasMinLength: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false };
    updateItem(reqLength, c.hasMinLength);
    updateItem(reqUpper, c.hasUpper);
    updateItem(reqLower, c.hasLower);
    updateItem(reqNumber, c.hasNumber);
    updateItem(reqSpecial, c.hasSpecial);
  }

  function updatePasswordStrengthMeter(password) {
    if (!strengthBar || !strengthText) return;
    if (!password) {
      strengthBar.style.width = '0%';
      strengthBar.className = 'progress-bar bg-secondary';
      strengthText.textContent = 'None';
      strengthText.className = 'badge bg-secondary';
      updatePasswordChecklist(null);
      return;
    }

    const res = validatePassword(password);
    updatePasswordChecklist(res.criteria);

    const score = res.score || 0;
    if (score <= 2) {
      strengthBar.style.width = '33%';
      strengthBar.className = 'progress-bar bg-danger';
      strengthText.textContent = 'Weak';
      strengthText.className = 'badge bg-danger';
    } else if (score === 3 || score === 4) {
      strengthBar.style.width = '66%';
      strengthBar.className = 'progress-bar bg-warning';
      strengthText.textContent = 'Medium';
      strengthText.className = 'badge bg-warning text-dark';
    } else if (score === 5) {
      strengthBar.style.width = '100%';
      strengthBar.className = 'progress-bar bg-success';
      strengthText.textContent = 'Strong';
      strengthText.className = 'badge bg-success';
    }
  }

  function updateLivePreview() {
    if (previewName && nameInput) previewName.textContent = nameInput.value.trim() || 'Not entered';
    if (previewEmail && emailInput) previewEmail.textContent = emailInput.value.trim() || 'Not entered';
    if (previewPhone && phoneInput) previewPhone.textContent = phoneInput.value.trim() ? `+91 ${phoneInput.value.trim()}` : 'Not entered';
    if (previewCourse && courseInput) previewCourse.textContent = courseInput.value || 'Not selected';

    if (previewStrength && passwordInput) {
      const pwd = passwordInput.value;
      if (!pwd) {
        previewStrength.textContent = 'Not set';
        previewStrength.className = 'badge bg-secondary';
      } else {
        const score = validatePassword(pwd).score;
        if (score <= 2) {
          previewStrength.textContent = 'Weak';
          previewStrength.className = 'badge bg-danger';
        } else if (score <= 4) {
          previewStrength.textContent = 'Medium';
          previewStrength.className = 'badge bg-warning text-dark';
        } else {
          previewStrength.textContent = 'Strong';
          previewStrength.className = 'badge bg-success';
        }
      }
    }

    if (previewTerms && termsCheckbox) {
      if (termsCheckbox.checked) {
        previewTerms.textContent = 'Accepted';
        previewTerms.className = 'badge bg-success';
      } else {
        previewTerms.textContent = 'Pending';
        previewTerms.className = 'badge bg-warning-light text-warning fw-bold';
      }
    }
  }

  // Registration Form Input Listeners
  if (nameInput) {
    nameInput.addEventListener('input', () => { setFieldState(nameInput, 'name-error', validateName(nameInput.value)); updateLivePreview(); });
    nameInput.addEventListener('blur', () => { setFieldState(nameInput, 'name-error', validateName(nameInput.value)); });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => { setFieldState(emailInput, 'email-error', validateEmail(emailInput.value)); updateLivePreview(); });
    emailInput.addEventListener('blur', () => { setFieldState(emailInput, 'email-error', validateEmail(emailInput.value)); });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^\d]/g, '');
      setFieldState(phoneInput, 'phone-error', validatePhone(phoneInput.value));
      updateLivePreview();
    });
    phoneInput.addEventListener('blur', () => { setFieldState(phoneInput, 'phone-error', validatePhone(phoneInput.value)); });
  }

  if (ageInput) {
    ageInput.addEventListener('input', () => { setFieldState(ageInput, 'age-error', validateAge(ageInput.value)); });
    ageInput.addEventListener('blur', () => { setFieldState(ageInput, 'age-error', validateAge(ageInput.value)); });
  }

  if (courseInput) {
    courseInput.addEventListener('change', () => { setFieldState(courseInput, 'course-error', validateCourse(courseInput.value)); updateLivePreview(); });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      updatePasswordStrengthMeter(val);
      setFieldState(passwordInput, 'password-error', validatePassword(val));
      if (confirmPasswordInput && confirmPasswordInput.value) {
        setFieldState(confirmPasswordInput, 'confirmPassword-error', validateConfirmPassword(confirmPasswordInput.value, val));
      }
      updateLivePreview();
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      setFieldState(confirmPasswordInput, 'confirmPassword-error', validateConfirmPassword(confirmPasswordInput.value, passwordInput ? passwordInput.value : ''));
    });
  }

  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => { setFieldState(termsCheckbox, 'terms-error', validateTerms(termsCheckbox.checked)); updateLivePreview(); });
  }

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPwd = passwordInput.type === 'password';
      passwordInput.type = isPwd ? 'text' : 'password';
      togglePasswordBtn.innerHTML = isPwd ? '<i class="bi bi-eye-slash-fill"></i>' : '<i class="bi bi-eye-fill"></i>';
    });
  }

  if (toggleConfirmPasswordBtn && confirmPasswordInput) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
      const isPwd = confirmPasswordInput.type === 'password';
      confirmPasswordInput.type = isPwd ? 'text' : 'password';
      toggleConfirmPasswordBtn.innerHTML = isPwd ? '<i class="bi bi-eye-slash-fill"></i>' : '<i class="bi bi-eye-fill"></i>';
    });
  }

  // --------------------------------------------------------------------------
  // 5. USER AUTHENTICATION & LOGIN/REGISTER FORM HANDLERS
  // --------------------------------------------------------------------------

  if (toggleLoginPasswordBtn && loginPasswordInput) {
    toggleLoginPasswordBtn.addEventListener('click', () => {
      const isPwd = loginPasswordInput.type === 'password';
      loginPasswordInput.type = isPwd ? 'text' : 'password';
      toggleLoginPasswordBtn.innerHTML = isPwd ? '<i class="bi bi-eye-slash-fill"></i>' : '<i class="bi bi-eye-fill"></i>';
    });
  }

  if (toggleRegAccPasswordBtn && regAccPasswordInput) {
    toggleRegAccPasswordBtn.addEventListener('click', () => {
      const isPwd = regAccPasswordInput.type === 'password';
      regAccPasswordInput.type = isPwd ? 'text' : 'password';
      toggleRegAccPasswordBtn.innerHTML = isPwd ? '<i class="bi bi-eye-slash-fill"></i>' : '<i class="bi bi-eye-fill"></i>';
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginEmailInput ? loginEmailInput.value.trim() : '';
      const password = loginPasswordInput ? loginPasswordInput.value : '';

      if (!email || !password) {
        showToastNotification('Please enter both email and password.', 'danger');
        return;
      }

      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Logging in...';
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();

        if (response.ok && result.success) {
          saveAuthSession(result.token, result.user);
          showToastNotification(`Welcome back, ${result.user.name || result.user.email}! Login successful.`, 'success');
          loginForm.reset();
          window.location.hash = '#dashboard';
        } else {
          showToastNotification(result.message || 'Login failed.', 'danger');
        }
      } catch (err) {
        showToastNotification('Network error while attempting user login.', 'danger');
      } finally {
        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Log In';
        }
      }
    });
  }

  // User Registration Form Submission
  if (userRegisterForm) {
    userRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = regAccNameInput ? regAccNameInput.value.trim() : '';
      const email = regAccEmailInput ? regAccEmailInput.value.trim() : '';
      const password = regAccPasswordInput ? regAccPasswordInput.value : '';

      if (!name || name.length < 2) {
        setFieldState(regAccNameInput, 'reg-acc-name-error', { isValid: false, message: 'Name must be at least 2 characters.' });
        return;
      }
      if (!email || !validateEmail(email).isValid) {
        setFieldState(regAccEmailInput, 'reg-acc-email-error', { isValid: false, message: 'Enter a valid email.' });
        return;
      }
      if (!password || password.length < 8) {
        setFieldState(regAccPasswordInput, 'reg-acc-password-error', { isValid: false, message: 'Password must be at least 8 characters.' });
        return;
      }

      if (regAccSubmitBtn) {
        regAccSubmitBtn.disabled = true;
        regAccSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Creating Account...';
      }

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();

        if (response.ok && result.success) {
          saveAuthSession(result.token, result.user);
          showToastNotification(`Account created successfully! Welcome, ${result.user.name}.`, 'success');
          userRegisterForm.reset();
          window.location.hash = '#dashboard';
        } else {
          showToastNotification(result.message || 'Account registration failed.', 'danger');
        }
      } catch (err) {
        showToastNotification('Network error while registering account.', 'danger');
      } finally {
        if (regAccSubmitBtn) {
          regAccSubmitBtn.disabled = false;
          regAccSubmitBtn.innerHTML = '<i class="bi bi-person-plus-fill me-1"></i> Register Account';
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. CACHED & PROTECTED REGISTRATION REST API CRUD
  // --------------------------------------------------------------------------

  async function fetchRegistrations() {
    if (dashboardLoading) dashboardLoading.style.display = 'block';
    if (dashboardEmpty) dashboardEmpty.style.display = 'none';
    if (dashboardError) dashboardError.style.display = 'none';
    if (dashboardTableBody) dashboardTableBody.innerHTML = '';

    try {
      const response = await fetch('/api/registrations', {
        headers: {
          'Accept': 'application/json',
          ...getAuthHeader()
        }
      });
      const result = await response.json();

      if (response.ok && result.success) {
        registrationsList = result.data || [];
        renderDashboardTable(registrationsList);
      } else {
        throw new Error(result.message || 'Failed to fetch registrations.');
      }
    } catch (err) {
      if (dashboardLoading) dashboardLoading.style.display = 'none';
      if (dashboardError) dashboardError.style.display = 'block';
      if (dashboardErrorMessage) dashboardErrorMessage.textContent = err.message;
    }
  }

  function renderDashboardTable(data) {
    if (dashboardLoading) dashboardLoading.style.display = 'none';
    
    if (dashboardTotalCount) {
      dashboardTotalCount.textContent = `${data.length} Total Records`;
    }

    if (!data || data.length === 0) {
      if (dashboardEmpty) dashboardEmpty.style.display = 'block';
      if (dashboardTableBody) dashboardTableBody.innerHTML = '';
      return;
    }

    if (dashboardEmpty) dashboardEmpty.style.display = 'none';
    if (!dashboardTableBody) return;

    let html = '';
    data.forEach((item, index) => {
      const createdDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }) : 'N/A';

      html += `
        <tr>
          <td class="fw-bold font-mono text-muted">${index + 1}</td>
          <td>
            <div class="fw-bold text-dark">${escapeHtml(item.name)}</div>
            <small class="text-muted font-mono" style="font-size: 0.75rem;">ID: ${escapeHtml(item.id)}</small>
          </td>
          <td class="font-mono text-dark">${escapeHtml(item.email)}</td>
          <td class="font-mono">${escapeHtml(item.phone || '9876543210')}</td>
          <td><span class="badge bg-light text-dark border font-mono">${escapeHtml(String(item.age))} yrs</span></td>
          <td><span class="badge bg-primary-light text-primary fw-medium">${escapeHtml(item.course)}</span></td>
          <td class="font-mono text-muted small">${createdDate}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm" role="group">
              <button class="btn btn-outline-primary btn-edit-reg" data-id="${item.id}" title="Edit Registration">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-outline-danger btn-delete-reg" data-id="${item.id}" data-name="${escapeHtml(item.name)}" title="Delete Registration">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    dashboardTableBody.innerHTML = html;

    document.querySelectorAll('.btn-edit-reg').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-delete-reg').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.getAttribute('data-id'), btn.getAttribute('data-name')));
    });
  }

  // Search Filter
  if (dashboardSearch) {
    dashboardSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = registrationsList.filter(item => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          (item.phone && item.phone.includes(query)) ||
          item.course.toLowerCase().includes(query)
        );
      });
      renderDashboardTable(filtered);
    });
  }

  if (btnRefreshDashboard) {
    btnRefreshDashboard.addEventListener('click', () => fetchRegistrations());
  }

  function openEditModal(id) {
    if (!authToken) {
      showToastNotification('Authentication required to edit records. Please log in first.', 'danger');
      window.location.hash = '#login';
      return;
    }

    const record = registrationsList.find(r => r.id === id);
    if (!record) return;

    if (editIdInput) editIdInput.value = record.id;
    if (editNameInput) editNameInput.value = record.name;
    if (editEmailInput) editEmailInput.value = record.email;
    if (editPhoneInput) editPhoneInput.value = record.phone || '9876543210';
    if (editAgeInput) editAgeInput.value = record.age;
    if (editCourseInput) editCourseInput.value = record.course;

    if (bootstrapEditModal) bootstrapEditModal.show();
  }

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = editIdInput ? editIdInput.value : '';
      const payload = {
        name: editNameInput ? editNameInput.value.trim() : '',
        email: editEmailInput ? editEmailInput.value.trim() : '',
        phone: editPhoneInput ? editPhoneInput.value.trim() : '',
        age: editAgeInput ? editAgeInput.value.trim() : '',
        course: editCourseInput ? editCourseInput.value : ''
      };

      if (editSaveBtn) {
        editSaveBtn.disabled = true;
        editSaveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Saving...';
      }

      try {
        const response = await fetch(`/api/registrations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (response.ok && result.success) {
          showToastNotification('Registration record updated! Cache automatically evicted.', 'success');
          if (bootstrapEditModal) bootstrapEditModal.hide();
          fetchRegistrations();
        } else {
          showToastNotification(result.message || 'Failed to update record.', 'danger');
        }
      } catch (err) {
        showToastNotification('Server error while updating registration record.', 'danger');
      } finally {
        if (editSaveBtn) {
          editSaveBtn.disabled = false;
          editSaveBtn.innerHTML = 'Save Changes';
        }
      }
    });
  }

  function openDeleteModal(id, name) {
    if (!authToken) {
      showToastNotification('Authentication required to delete records. Please log in first.', 'danger');
      window.location.hash = '#login';
      return;
    }

    targetDeleteId = id;
    if (deleteConfirmName) deleteConfirmName.textContent = name;
    if (bootstrapDeleteModal) bootstrapDeleteModal.show();
  }

  if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener('click', async () => {
      if (!targetDeleteId) return;

      deleteConfirmBtn.disabled = true;
      deleteConfirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Deleting...';

      try {
        const response = await fetch(`/api/registrations/${targetDeleteId}`, {
          method: 'DELETE',
          headers: { ...getAuthHeader() }
        });
        const result = await response.json();

        if (response.ok && result.success) {
          showToastNotification('Registration deleted! Cache evicted.', 'success');
          if (bootstrapDeleteModal) bootstrapDeleteModal.hide();
          fetchRegistrations();
        } else {
          showToastNotification(result.message || 'Failed to delete record.', 'danger');
        }
      } catch (err) {
        showToastNotification('Server error while deleting record.', 'danger');
      } finally {
        deleteConfirmBtn.disabled = false;
        deleteConfirmBtn.innerHTML = 'Confirm Delete';
        targetDeleteId = null;
      }
    });
  }

  // Registration Application Submit
  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameRes = validateName(nameInput ? nameInput.value : '');
      const emailRes = validateEmail(emailInput ? emailInput.value : '');
      const phoneRes = validatePhone(phoneInput ? phoneInput.value : '');
      const ageRes = validateAge(ageInput ? ageInput.value : '');
      const courseRes = validateCourse(courseInput ? courseInput.value : '');
      const passwordRes = validatePassword(passwordInput ? passwordInput.value : '');
      const confirmPassRes = validateConfirmPassword(
        confirmPasswordInput ? confirmPasswordInput.value : '',
        passwordInput ? passwordInput.value : ''
      );
      const termsRes = validateTerms(termsCheckbox ? termsCheckbox.checked : false);

      setFieldState(nameInput, 'name-error', nameRes);
      setFieldState(emailInput, 'email-error', emailRes);
      setFieldState(phoneInput, 'phone-error', phoneRes);
      setFieldState(ageInput, 'age-error', ageRes);
      setFieldState(courseInput, 'course-error', courseRes);
      setFieldState(passwordInput, 'password-error', passwordRes);
      setFieldState(confirmPasswordInput, 'confirmPassword-error', confirmPassRes);
      setFieldState(termsCheckbox, 'terms-error', termsRes);

      const allValid = nameRes.isValid && emailRes.isValid && phoneRes.isValid &&
                       ageRes.isValid && courseRes.isValid && passwordRes.isValid &&
                       confirmPassRes.isValid && termsRes.isValid;

      if (!allValid) return;

      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        age: ageInput.value.trim(),
        course: courseInput.value,
        password: passwordInput.value
      };

      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Submitting Application...';
      }

      try {
        const response = await fetch('/api/registrations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (response.ok && result.success) {
          isRegistrationComplete = true;
          const createdData = result.data;

          if (successName) successName.textContent = createdData.name;
          if (successDetailName) successDetailName.textContent = createdData.name;
          if (successDetailEmail) successDetailEmail.textContent = createdData.email;
          if (successDetailCourse) successDetailCourse.textContent = createdData.course;
          if (successTimestamp) successTimestamp.textContent = new Date(createdData.createdAt).toLocaleString();

          registrationForm.reset();
          clearFieldState(nameInput, 'name-error');
          clearFieldState(emailInput, 'email-error');
          clearFieldState(phoneInput, 'phone-error');
          clearFieldState(ageInput, 'age-error');
          clearFieldState(courseInput, 'course-error');
          clearFieldState(passwordInput, 'password-error');
          clearFieldState(confirmPasswordInput, 'confirmPassword-error');
          clearFieldState(termsCheckbox, 'terms-error');
          updateLivePreview();
          updatePasswordStrengthMeter('');

          window.location.hash = '#success';
        } else {
          showToastNotification(result.message || 'Submission failed.', 'danger');
        }
      } catch (err) {
        showToastNotification('Server error submitting registration.', 'danger');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-send-check-fill me-1"></i> Submit Registration Application';
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. TASK 8: ASYNCHRONOUS BACKGROUND TASK QUEUE CONTROLLER
  // --------------------------------------------------------------------------

  async function fetchJobsList() {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();

      if (data.success) {
        const { stats, jobs } = data;

        // Update Telemetry Counters
        if (jobsActiveWorkers) jobsActiveWorkers.textContent = `${stats.activeWorkers} / ${stats.concurrencyLimit}`;
        if (jobsPendingCount) jobsPendingCount.textContent = stats.counts.pending;
        if (jobsCompletedCount) jobsCompletedCount.textContent = stats.counts.completed;
        if (jobsTotalCount) jobsTotalCount.textContent = stats.lifetimeStats.totalEnqueued;

        // Render Table
        renderJobsTable(jobs);
      }
    } catch (err) {
      console.warn("Error fetching background jobs:", err);
    }
  }

  function renderJobsTable(jobs) {
    if (!jobsTableBody) return;

    if (!jobs || jobs.length === 0) {
      jobsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="bi bi-inbox fs-4 d-block mb-1"></i> No background jobs enqueued yet. Dispatch a task above!
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    jobs.forEach(job => {
      let statusBadge = '';
      let progressClass = 'bg-primary';

      if (job.status === 'pending') {
        statusBadge = '<span class="badge bg-warning text-dark font-mono">Pending</span>';
        progressClass = 'bg-warning';
      } else if (job.status === 'processing') {
        statusBadge = '<span class="badge bg-primary font-mono"><span class="spinner-border spinner-border-sm me-1" style="width: 0.65rem; height: 0.65rem;"></span>Processing</span>';
        progressClass = 'bg-primary progress-bar-striped progress-bar-animated';
      } else if (job.status === 'completed') {
        statusBadge = '<span class="badge bg-success font-mono"><i class="bi bi-check-lg me-1"></i>Completed</span>';
        progressClass = 'bg-success';
      } else {
        statusBadge = '<span class="badge bg-danger font-mono"><i class="bi bi-x-lg me-1"></i>Failed</span>';
        progressClass = 'bg-danger';
      }

      const createdTime = new Date(job.createdAt).toLocaleTimeString();

      html += `
        <tr>
          <td><code class="text-dark fw-bold">${job.id}</code></td>
          <td>
            <div class="fw-bold text-dark">${job.type}</div>
            <small class="text-muted font-mono" style="font-size: 0.72rem;">Priority: ${job.priority}</small>
          </td>
          <td style="min-width: 140px;">
            <div class="d-flex justify-content-between text-muted small mb-1 font-mono" style="font-size: 0.72rem;">
              <span>Progress</span>
              <span>${job.progress}%</span>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar ${progressClass}" role="progressbar" style="width: ${job.progress}%;"></div>
            </div>
          </td>
          <td>${statusBadge}</td>
          <td class="font-mono text-muted small">${createdTime}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-dark btn-view-job py-0.5 px-2" data-id="${job.id}">
              <i class="bi bi-eye-fill"></i> View
            </button>
          </td>
        </tr>
      `;
    });

    jobsTableBody.innerHTML = html;

    // Attach View handlers
    document.querySelectorAll('.btn-view-job').forEach(btn => {
      btn.addEventListener('click', () => viewJobDetails(btn.getAttribute('data-id')));
    });
  }

  async function enqueueBackgroundJob(type) {
    try {
      const response = await fetch('/api/jobs/enqueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type,
          payload: { initiatedBy: currentUser ? currentUser.email : 'System Admin', timestamp: new Date().toISOString() },
          priority: 'normal'
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showToastNotification(`Background job '${type}' successfully enqueued!`, 'success');
        fetchJobsList();
      } else {
        showToastNotification(data.message || 'Failed to enqueue job.', 'danger');
      }
    } catch (err) {
      showToastNotification('Network error while enqueueing background task.', 'danger');
    }
  }

  async function viewJobDetails(id) {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();
      if (data.success && data.job) {
        const job = data.job;
        if (modalJobId) modalJobId.textContent = job.id;
        if (modalJobType) modalJobType.textContent = `${job.type} (${job.status.toUpperCase()})`;
        if (modalJobResult) modalJobResult.textContent = JSON.stringify(job.result || job.error || { message: "In progress..." }, null, 2);
        if (modalJobLogs) modalJobLogs.textContent = (job.logs || []).join('\n');

        if (bootstrapJobDetailsModal) bootstrapJobDetailsModal.show();
      }
    } catch (e) {
      showToastNotification('Error loading job details.', 'danger');
    }
  }

  btnEnqueueActions.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      enqueueBackgroundJob(type);
    });
  });

  if (btnRefreshJobs) {
    btnRefreshJobs.addEventListener('click', fetchJobsList);
  }

  if (btnClearJobs) {
    btnClearJobs.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/jobs/clear', { method: 'POST' });
        const data = await res.json();
        showToastNotification(data.message, 'info');
        fetchJobsList();
      } catch (e) {
        showToastNotification('Error clearing jobs.', 'danger');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. TASK 8: SERVER-SIDE CACHING & AUDIT LOG CONTROLLER
  // --------------------------------------------------------------------------

  async function fetchCacheData() {
    try {
      const [statsRes, keysRes] = await Promise.all([
        fetch('/api/cache/stats'),
        fetch('/api/cache/keys')
      ]);

      const statsData = await statsRes.json();
      const keysData = await keysRes.json();

      if (statsData.success) {
        const stats = statsData.stats;
        if (cacheHitRatioBig) cacheHitRatioBig.textContent = `${stats.hitRatioPercent}%`;
        if (cacheHitProgressBar) {
          cacheHitProgressBar.style.width = `${stats.hitRatioPercent}%`;
        }
        if (heroCacheHitRatio) heroCacheHitRatio.textContent = `${stats.hitRatioPercent}% Optimized`;
        if (heroCacheProgressBar) heroCacheProgressBar.style.width = `${stats.hitRatioPercent}%`;
        if (cacheTotalHits) cacheTotalHits.textContent = stats.hits;
        if (cacheTotalMisses) cacheTotalMisses.textContent = stats.misses;
        if (cacheTotalKeys) cacheTotalKeys.textContent = stats.activeKeysCount;
      }

      if (keysData.success) {
        renderCacheKeysTable(keysData.keys);
      }
    } catch (e) {
      console.warn("Error fetching cache telemetry:", e);
    }
  }

  function renderCacheKeysTable(keys) {
    if (!cacheKeysTableBody) return;
    if (cacheKeysCountBadge) cacheKeysCountBadge.textContent = `${keys.length} Active Keys`;

    if (!keys || keys.length === 0) {
      cacheKeysTableBody.innerHTML = `
        <tr><td colspan="4" class="text-center text-muted py-3">No active keys in server cache.</td></tr>
      `;
      return;
    }

    let html = '';
    keys.forEach(k => {
      html += `
        <tr>
          <td><code class="text-primary">${escapeHtml(k.key)}</code></td>
          <td><span class="badge bg-light text-dark border font-mono">${k.remainingTtlSeconds}s</span></td>
          <td>${(k.sizeBytes / 1024).toFixed(1)} KB</td>
          <td class="text-end">
            <button class="btn btn-xs btn-outline-danger btn-evict-key py-0.5 px-2" data-key="${escapeHtml(k.key)}">
              Evict
            </button>
          </td>
        </tr>
      `;
    });

    cacheKeysTableBody.innerHTML = html;

    document.querySelectorAll('.btn-evict-key').forEach(btn => {
      btn.addEventListener('click', async () => {
        const key = btn.getAttribute('data-key');
        await fetch(`/api/cache/${encodeURIComponent(key)}`, { method: 'DELETE' });
        showToastNotification(`Cache key '${key}' purged.`, 'info');
        fetchCacheData();
      });
    });
  }

  async function fetchServerLogs() {
    try {
      const res = await fetch('/api/logs?limit=30');
      const data = await res.json();

      if (data.success && serverLogsTableBody) {
        if (!data.logs || data.logs.length === 0) {
          serverLogsTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No server logs captured yet.</td></tr>`;
          return;
        }

        let html = '';
        data.logs.forEach(log => {
          const statusClass = log.statusCode >= 500 ? 'text-danger fw-bold' : (log.statusCode >= 400 ? 'text-warning fw-bold' : 'text-success fw-bold');
          const cacheBadge = log.cached === 'HIT' ? '<span class="badge bg-success">HIT (&lt;1ms)</span>' : (log.cached === 'MISS' ? '<span class="badge bg-secondary">MISS</span>' : '<span class="text-muted">-</span>');

          html += `
            <tr>
              <td><code>${log.id}</code></td>
              <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
              <td><span class="badge bg-dark">${log.method}</span> ${escapeHtml(log.url)}</td>
              <td class="${statusClass}">${log.statusCode}</td>
              <td>${log.durationMs} ms</td>
              <td>${cacheBadge}</td>
              <td class="text-muted">${log.clientIp}</td>
            </tr>
          `;
        });

        serverLogsTableBody.innerHTML = html;
      }
    } catch (e) {
      console.warn("Error fetching server logs:", e);
    }
  }

  if (btnRefreshCacheData) {
    btnRefreshCacheData.addEventListener('click', () => {
      fetchCacheData();
      fetchServerLogs();
      showToastNotification('Cache and audit logs refreshed.', 'info');
    });
  }

  if (btnFlushServerCache) {
    btnFlushServerCache.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/cache', { method: 'DELETE' });
        const data = await res.json();
        showToastNotification(`Server cache flushed (${data.clearedKeysCount} keys cleared).`, 'warning');
        fetchCacheData();
      } catch (e) {
        showToastNotification('Error flushing cache.', 'danger');
      }
    });
  }

  if (btnClearLogs) {
    btnClearLogs.addEventListener('click', async () => {
      try {
        await fetch('/api/logs', { method: 'DELETE' });
        showToastNotification('Request audit logs cleared.', 'info');
        fetchServerLogs();
      } catch (e) {
        showToastNotification('Error clearing logs.', 'danger');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. TASK 7 CONTROLLERS (Weather, Repos, OAuth)
  // --------------------------------------------------------------------------

  async function fetchWeatherData(city = 'Chennai') {
    if (weatherLoading) weatherLoading.classList.remove('d-none');
    if (weatherDisplay) weatherDisplay.classList.add('d-none');

    try {
      const response = await fetch(`/api/external/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (weatherLoading) weatherLoading.classList.add('d-none');
      if (weatherDisplay) weatherDisplay.classList.remove('d-none');

      if (data.success) {
        if (weatherCityName) weatherCityName.textContent = `${data.city} Campus`;
        if (weatherState) weatherState.textContent = `${data.state}, ${data.country}`;
        if (weatherTemp) weatherTemp.textContent = `${data.temperature}${data.temperatureUnit || '°C'}`;
        if (weatherCondition) weatherCondition.textContent = data.weatherCondition;
        if (weatherWind) weatherWind.textContent = `${data.windspeed} ${data.windspeedUnit || 'km/h'}`;
        if (weatherHumidity) weatherHumidity.textContent = `${data.humidity}%`;
        if (weatherLatency) weatherLatency.textContent = `${data.latencyMs || 10} ms`;
        if (weatherStatus) weatherStatus.textContent = data.isFallback ? 'Resilient Fallback' : 'HTTP 200 OK';

        if (weatherCacheBadge) {
          if (data.cached) {
            weatherCacheBadge.className = 'badge bg-success font-mono';
            weatherCacheBadge.textContent = `Cached (${data.cacheAgeSeconds}s ago)`;
          } else {
            weatherCacheBadge.className = 'badge bg-primary font-mono';
            weatherCacheBadge.textContent = 'Live Response';
          }
        }
      }
    } catch (err) {
      if (weatherLoading) weatherLoading.classList.add('d-none');
      if (weatherDisplay) weatherDisplay.classList.remove('d-none');
    }
  }

  async function fetchReposData(topic = 'web-development') {
    activeRepoTopic = topic;
    if (reposLoading) reposLoading.classList.remove('d-none');
    if (reposGrid) reposGrid.classList.add('d-none');

    try {
      const response = await fetch(`/api/external/repos?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();

      if (reposLoading) reposLoading.classList.add('d-none');
      if (reposGrid) reposGrid.classList.remove('d-none');

      if (data.success && data.repositories) {
        let html = '';
        data.repositories.forEach(repo => {
          html += `
            <div class="col-md-6 col-lg-3">
              <div class="card h-100 border rounded-3 p-3 bg-light">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="fw-bold text-dark text-truncate small">${escapeHtml(repo.name)}</span>
                  <span class="badge bg-primary-light text-primary font-mono" style="font-size: 0.65rem;">${escapeHtml(repo.language)}</span>
                </div>
                <p class="text-muted small mb-2 text-truncate-2" style="font-size: 0.75rem;">${escapeHtml(repo.description)}</p>
                <div class="d-flex justify-content-between small text-muted font-mono" style="font-size: 0.7rem;">
                  <span><i class="bi bi-star-fill text-warning me-1"></i>${repo.stars}</span>
                  <a href="${escapeHtml(repo.htmlUrl)}" target="_blank" class="text-primary text-decoration-none">View &rarr;</a>
                </div>
              </div>
            </div>
          `;
        });
        reposGrid.innerHTML = html;
      }
    } catch (err) {
      if (reposLoading) reposLoading.classList.add('d-none');
      if (reposGrid) reposGrid.classList.remove('d-none');
    }
  }

  if (btnFetchWeather && weatherCitySelect) {
    btnFetchWeather.addEventListener('click', () => fetchWeatherData(weatherCitySelect.value));
  }

  repoTopicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      repoTopicBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      fetchReposData(btn.getAttribute('data-topic'));
    });
  });

  if (btnCheckRateLimit) {
    btnCheckRateLimit.addEventListener('click', async () => {
      const res = await fetch('/api/rate-limit-status');
      const rem = res.headers.get('ratelimit-remaining') || '15';
      if (rateLimitRemainingText) rateLimitRemainingText.textContent = `${rem} / 15 Requests`;
      showToastNotification(`Telemetry status: ${rem} requests remaining.`, 'info');
    });
  }

  // OAuth 2.0 Simulator Handlers
  function logOauth(title, req, res) {
    if (!oauthInspectorOutput) return;
    const txt = `\n[${new Date().toLocaleTimeString()}] === ${title} ===\n> ${req.method} ${req.url}\n< STATUS ${res.status}: ${JSON.stringify(res.data, null, 2)}\n`;
    oauthInspectorOutput.textContent = txt + oauthInspectorOutput.textContent;
  }

  if (btnOauthStep1) {
    btnOauthStep1.addEventListener('click', async () => {
      const url = `/api/oauth/authorize?client_id=cognifyz_app_2026&redirect_uri=http://localhost:3000/#oauth-demo&scope=read:profile`;
      const res = await fetch(url);
      const data = await res.json();
      logOauth('STEP 1: Authorize', { method: 'GET', url }, { status: res.status, data });
      if (res.ok && data.success) {
        currentAuthCode = data.authorizationCode;
        if (oauthCodeDisplay) oauthCodeDisplay.textContent = currentAuthCode;
        if (oauthStep1Box) oauthStep1Box.classList.add('d-none');
        if (oauthStep2Box) oauthStep2Box.classList.remove('d-none');
        if (oauthProgressBar) oauthProgressBar.style.width = '50%';
        showToastNotification('Authorization Code Granted!', 'success');
      }
    });
  }

  if (btnOauthStep2) {
    btnOauthStep2.addEventListener('click', async () => {
      const payload = {
        grant_type: 'authorization_code',
        client_id: 'cognifyz_app_2026',
        client_secret: oauthClientSecret ? oauthClientSecret.value : 'secret_key_cognifyz_99',
        code: currentAuthCode,
        redirect_uri: 'http://localhost:3000/#oauth-demo'
      };
      const res = await fetch('/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      logOauth('STEP 2: Token Exchange', { method: 'POST', url: '/api/oauth/token' }, { status: res.status, data });
      if (res.ok && data.success) {
        currentOAuthToken = data.access_token;
        if (oauthAccessTokenDisplay) oauthAccessTokenDisplay.textContent = currentOAuthToken;
        if (oauthStep2Box) oauthStep2Box.classList.add('d-none');
        if (oauthStep3Box) oauthStep3Box.classList.remove('d-none');
        if (oauthProgressBar) oauthProgressBar.style.width = '75%';
        showToastNotification('OAuth Access Token Issued!', 'success');
      }
    });
  }

  if (btnOauthStep3) {
    btnOauthStep3.addEventListener('click', async () => {
      const res = await fetch('/api/oauth/resource', {
        headers: { 'Authorization': `Bearer ${currentOAuthToken}` }
      });
      const data = await res.json();
      logOauth('STEP 3: Protected Resource', { method: 'GET', url: '/api/oauth/resource' }, { status: res.status, data });
      if (res.ok && data.success) {
        if (oauthProgressBar) oauthProgressBar.style.width = '100%';
        showToastNotification('Protected OAuth Resource Accessed!', 'success');
      }
    });
  }

  if (btnOauthReset) {
    btnOauthReset.addEventListener('click', () => {
      currentAuthCode = null;
      currentOAuthToken = null;
      if (oauthStep1Box) oauthStep1Box.classList.remove('d-none');
      if (oauthStep2Box) oauthStep2Box.classList.add('d-none');
      if (oauthStep3Box) oauthStep3Box.classList.add('d-none');
      if (oauthProgressBar) oauthProgressBar.style.width = '25%';
    });
  }

  // --------------------------------------------------------------------------
  // 10. CLIENT-SIDE ROUTING (SPA Hash Router)
  // --------------------------------------------------------------------------

  const validRoutes = [
    '#home', '#about', '#features', '#courses', 
    '#jobs', '#server-cache', '#external-api', '#oauth-demo',
    '#register', '#dashboard', '#login', '#user-register', 
    '#success', '#contact'
  ];

  function handleRouting() {
    let rawHash = window.location.hash || '#home';
    let cleanHash = rawHash.split('?')[0].toLowerCase().trim();
    if (cleanHash.length > 1 && cleanHash.endsWith('/')) {
      cleanHash = cleanHash.slice(0, -1);
    }

    if (cleanHash === '#success' && !isRegistrationComplete) {
      window.location.hash = '#register';
      return;
    }

    // Stop background polling timer if leaving #jobs
    if (cleanHash !== '#jobs' && jobPollingTimer) {
      clearInterval(jobPollingTimer);
      jobPollingTimer = null;
    }

    const targetElement = cleanHash.startsWith('#') ? document.querySelector(cleanHash) : null;
    const isKnownRoute = validRoutes.includes(cleanHash) || cleanHash === '' || targetElement !== null;

    if (isKnownRoute) {
      if (notFoundSection) notFoundSection.style.display = 'none';

      // Hide all SPA route views
      if (mainPortalContent) mainPortalContent.style.display = 'none';
      if (jobsSection) jobsSection.style.display = 'none';
      if (serverCacheSection) serverCacheSection.style.display = 'none';
      if (externalApiSection) externalApiSection.style.display = 'none';
      if (oauthDemoSection) oauthDemoSection.style.display = 'none';
      if (loginSection) loginSection.style.display = 'none';
      if (userRegisterSection) userRegisterSection.style.display = 'none';
      if (dashboardSection) dashboardSection.style.display = 'none';
      if (successSection) successSection.style.display = 'none';

      if (cleanHash === '#jobs') {
        if (jobsSection) jobsSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchJobsList();
        // Start polling for live worker progress
        if (!jobPollingTimer) {
          jobPollingTimer = setInterval(fetchJobsList, 2000);
        }
      } else if (cleanHash === '#server-cache') {
        if (serverCacheSection) serverCacheSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchCacheData();
        fetchServerLogs();
      } else if (cleanHash === '#external-api') {
        if (externalApiSection) externalApiSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchWeatherData(weatherCitySelect ? weatherCitySelect.value : 'Chennai');
        fetchReposData(activeRepoTopic);
      } else if (cleanHash === '#oauth-demo') {
        if (oauthDemoSection) oauthDemoSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (cleanHash === '#login') {
        if (loginSection) loginSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (cleanHash === '#user-register') {
        if (userRegisterSection) userRegisterSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (cleanHash === '#success') {
        if (successSection) successSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (cleanHash === '#dashboard') {
        if (dashboardSection) dashboardSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchRegistrations();
      } else {
        if (mainPortalContent) mainPortalContent.style.display = 'block';
        if (targetElement && cleanHash !== '#home') {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } else {
      if (mainPortalContent) mainPortalContent.style.display = 'none';
      if (jobsSection) jobsSection.style.display = 'none';
      if (serverCacheSection) serverCacheSection.style.display = 'none';
      if (externalApiSection) externalApiSection.style.display = 'none';
      if (oauthDemoSection) oauthDemoSection.style.display = 'none';
      if (loginSection) loginSection.style.display = 'none';
      if (userRegisterSection) userRegisterSection.style.display = 'none';
      if (dashboardSection) dashboardSection.style.display = 'none';
      if (successSection) successSection.style.display = 'none';
      if (notFoundSection) notFoundSection.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Active nav link highlight
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === cleanHash) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  window.addEventListener('hashchange', handleRouting);

  // Initial load
  updateAuthUI();
  updateLivePreview();
  fetchCacheData();
  handleRouting();
});
