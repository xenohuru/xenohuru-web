/**
 * auth.js — JWT authentication module for Xenohuru
 *
 * Manages access/refresh tokens in localStorage and provides
 * helper functions consumed by login, register, and profile pages.
 *
 * Token keys:
 *   xh-access   — JWT access token
 *   xh-refresh  — JWT refresh token
 */

import { api } from './api.js';

const ACCESS_KEY  = 'xh-access';
const REFRESH_KEY = 'xh-refresh';

/** Returns the stored access token, or null. */
export function getToken() {
  return localStorage.getItem(ACCESS_KEY);
}

/** Returns true when an access token is stored. */
export function isLoggedIn() {
  return !!getToken();
}

/**
 * POST credentials to the login endpoint.
 * Stores the returned tokens, then redirects to profile.html.
 * Throws on network / auth error.
 */
export async function login(email, password) {
  const data = await api.login({ email, password });
  localStorage.setItem(ACCESS_KEY,  data.access);
  localStorage.setItem(REFRESH_KEY, data.refresh);
  window.location.href = 'profile.html';
}

/**
 * POST registration data to the register endpoint.
 * If the response includes tokens (auto-login), stores them.
 * Redirects to profile.html on success.
 * Throws on error.
 */
export async function register(data) {
  const res = await api.register(data);
  if (res.access && res.refresh) {
    localStorage.setItem(ACCESS_KEY,  res.access);
    localStorage.setItem(REFRESH_KEY, res.refresh);
    window.location.href = 'profile.html';
  } else {
    // Backend registered but didn't return tokens — manual login needed
    window.location.href = 'login.html?registered=1';
  }
}

/** Clears all auth tokens from storage and redirects to home. */
export function logout() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  window.location.href = 'index.html';
}

/**
 * Fetches the current user's profile using the stored access token.
 * Returns null if no token or the request fails.
 */
export async function getProfile() {
  const token = getToken();
  if (!token) return null;
  try {
    return await api.getProfile(token);
  } catch (_) {
    return null;
  }
}

/**
 * Call on every page load to sync navbar auth state.
 * Shows "Profile" nav link and hides "Login" nav link when authenticated.
 * Also handles mobile nav links (mobile-nav-login-link, mobile-nav-profile-link).
 * Silently skips elements that don't exist on the current page.
 */
export function initAuthState() {
  const loginLink          = document.getElementById('nav-login-link');
  const profileLink        = document.getElementById('nav-profile-link');
  const mobileLoginLink    = document.getElementById('mobile-nav-login-link');
  const mobileProfileLink  = document.getElementById('mobile-nav-profile-link');

  if (isLoggedIn()) {
    loginLink?.classList.add('hidden');
    profileLink?.classList.remove('hidden');
    mobileLoginLink?.classList.add('hidden');
    mobileProfileLink?.classList.remove('hidden');
  } else {
    loginLink?.classList.remove('hidden');
    profileLink?.classList.add('hidden');
    mobileLoginLink?.classList.remove('hidden');
    mobileProfileLink?.classList.add('hidden');
  }
}
