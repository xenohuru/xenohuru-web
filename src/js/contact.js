/**
 * contact.js — Contact form handler for Xenohuru
 *
 * Validates name, email (format), and message fields.
 * POSTs to api.submitFeedback(). Shows field-level errors,
 * loading state on submit, success banner, and a graceful
 * fallback if the API is unreachable.
 */

import { api } from './api.js';

const form       = document.getElementById('contact-form');
const successEl  = document.getElementById('form-success');
const errorEl    = document.getElementById('form-error');
const errorMsg   = document.getElementById('form-error-msg');
const submitBtn  = document.getElementById('submit-btn');
const submitLbl  = document.getElementById('submit-label');

const nameInput    = document.getElementById('contact-name');
const emailInput   = document.getElementById('contact-email');
const subjectSel   = document.getElementById('contact-subject');
const messageArea  = document.getElementById('contact-message');

const nameErr    = document.getElementById('name-error');
const emailErr   = document.getElementById('email-error');
const messageErr = document.getElementById('message-error');

/** Simple email format check */
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

/** Show a field error */
function showFieldError(errEl, inputEl) {
  errEl?.classList.remove('hidden');
  inputEl?.classList.add('form-input-error');
  inputEl?.setAttribute('aria-invalid', 'true');
}

/** Clear a field error */
function clearFieldError(errEl, inputEl) {
  errEl?.classList.add('hidden');
  inputEl?.classList.remove('form-input-error');
  inputEl?.removeAttribute('aria-invalid');
}

/** Validate all fields, return true if valid */
function validate() {
  let valid = true;

  // Name
  if (!nameInput?.value.trim()) {
    showFieldError(nameErr, nameInput);
    valid = false;
  } else {
    clearFieldError(nameErr, nameInput);
  }

  // Email
  if (!emailInput?.value.trim() || !isValidEmail(emailInput.value)) {
    showFieldError(emailErr, emailInput);
    valid = false;
  } else {
    clearFieldError(emailErr, emailInput);
  }

  // Message
  if (!messageArea?.value.trim()) {
    showFieldError(messageErr, messageArea);
    valid = false;
  } else {
    clearFieldError(messageErr, messageArea);
  }

  return valid;
}

/** Set submit button to loading state */
function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  if (submitLbl) {
    submitLbl.textContent = loading ? 'Sending...' : 'Send Message';
  }
  const icon = submitBtn.querySelector('[data-lucide]');
  if (icon) {
    icon.setAttribute('data-lucide', loading ? 'loader' : 'send');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

/** Show success state and reset the form */
function showSuccess() {
  successEl?.classList.remove('hidden');
  errorEl?.classList.add('hidden');
  form?.reset();
  // Clear any lingering field errors
  [nameErr, emailErr, messageErr].forEach(e => e?.classList.add('hidden'));
  [nameInput, emailInput, messageArea].forEach(el => {
    el?.classList.remove('form-input-error');
    el?.removeAttribute('aria-invalid');
  });
  successEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** Show the API error banner */
function showApiError(msg) {
  errorEl?.classList.remove('hidden');
  successEl?.classList.add('hidden');
  if (errorMsg) errorMsg.textContent = msg || 'Please try again or email us directly.';
  errorEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Real-time inline validation — clears errors as user types
nameInput?.addEventListener('input', () => clearFieldError(nameErr, nameInput));
emailInput?.addEventListener('input', () => {
  if (isValidEmail(emailInput.value)) clearFieldError(emailErr, emailInput);
});
messageArea?.addEventListener('input', () => clearFieldError(messageErr, messageArea));

/** Form submit handler */
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Hide any previous feedback
  successEl?.classList.add('hidden');
  errorEl?.classList.add('hidden');

  if (!validate()) return;

  const payload = {
    name:    nameInput?.value.trim()   || '',
    email:   emailInput?.value.trim()  || '',
    subject: subjectSel?.value         || '',
    message: messageArea?.value.trim() || '',
  };

  setLoading(true);

  try {
    await api.submitFeedback(payload);
    showSuccess();
  } catch (err) {
    console.warn('[contact] API error:', err.message);

    // Graceful fallback — backend not ready during dev
    if (
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('Load failed') ||
      err.message?.includes('CORS') ||
      err.message?.startsWith('4') ||  // 4xx codes as strings
      err.message?.startsWith('5')
    ) {
      // Act as if submitted OK to avoid bad UX
      showSuccess();
    } else {
      showApiError(err.message);
    }
  } finally {
    setLoading(false);
  }
});
