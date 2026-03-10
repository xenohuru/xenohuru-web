/**
 * api.js — Xenohuru API service
 *
 * Tries the live Django REST API first.
 * Falls back to MOCK_DATA if API is unreachable (offline / not deployed).
 *
 * Live API:  http://159.65.119.182
 * Local dev: http://localhost:8002
 * Toggle: set USE_MOCK = true to always use mock data during development.
 */

import { MOCK_DATA } from './mockdata.js';

// Prefer local backend when running locally, fall back to production
const LOCAL_API  = 'http://localhost:8002';
const PROD_API   = 'http://159.65.119.182';
const API_BASE   = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? LOCAL_API
  : PROD_API;

// Set to false to use the live API; true forces mock data
export const USE_MOCK = false;

/** Generic fetch with mock fallback and timeout */
async function apiFetch(path, mockFallback, options = {}) {
  if (USE_MOCK) return mockFallback();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal, ...options });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn(`[api] Falling back to mock data for ${path}:`, err.message);
    return mockFallback();
  }
}

/** POST / PUT / PATCH with JSON body — throws on error (no mock fallback) */
async function apiMutate(path, method = 'POST', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = `${res.status}`;
    try { const d = await res.json(); detail = d.detail || JSON.stringify(d); } catch (_) {}
    throw new Error(detail);
  }
  return res.json();
}

export const api = {

  /* ═══════════════════════════════════════════════════
     REGIONS
     ═══════════════════════════════════════════════════ */

  /** GET /api/v1/regions/ */
  getRegions: () => apiFetch('/api/v1/regions/', () => MOCK_DATA.regions),

  /** GET /api/v1/regions/:slug/ */
  getRegion: (slug) =>
    apiFetch(`/api/v1/regions/${slug}/`, () =>
      MOCK_DATA.regions.find(r => r.slug === slug) || null
    ),

  /* ═══════════════════════════════════════════════════
     ATTRACTIONS
     ═══════════════════════════════════════════════════ */

  /** GET /api/v1/attractions/ */
  getAttractions: () => apiFetch('/api/v1/attractions/', () => MOCK_DATA.attractions),

  /** GET /api/v1/attractions/featured/ */
  getFeaturedAttractions: () =>
    apiFetch('/api/v1/attractions/featured/', () =>
      MOCK_DATA.attractions.filter(a => a.is_featured)
    ),

  /** GET /api/v1/attractions/:slug/ */
  getAttraction: (slug) =>
    apiFetch(`/api/v1/attractions/${slug}/`, () => {
      const detail = MOCK_DATA.attractionDetails[slug];
      if (!detail) throw new Error(`Attraction "${slug}" not found in mock data`);
      return detail;
    }),

  /** GET /api/v1/attractions/by_category/?category=:cat */
  getAttractionsByCategory: (category) => {
    const path = category
      ? `/api/v1/attractions/by_category/?category=${encodeURIComponent(category)}`
      : '/api/v1/attractions/by_category/';
    return apiFetch(path, () => {
      if (category) return MOCK_DATA.attractions.filter(a => a.category === category);
      return MOCK_DATA.attractions.reduce((acc, a) => {
        (acc[a.category] = acc[a.category] || []).push(a);
        return acc;
      }, {});
    });
  },

  /** GET /api/v1/attractions/by_region/?region=:region */
  getAttractionsByRegion: (region) => {
    const path = region
      ? `/api/v1/attractions/by_region/?region=${encodeURIComponent(region)}`
      : '/api/v1/attractions/by_region/';
    return apiFetch(path, () => {
      if (region) return MOCK_DATA.attractions.filter(a => a.region_name === region);
      return MOCK_DATA.attractions.reduce((acc, a) => {
        (acc[a.region_name] = acc[a.region_name] || []).push(a);
        return acc;
      }, {});
    });
  },

  /** GET /api/v1/attractions/nearby/?lat=&lng=&radius= */
  getNearbyAttractions: ({ lat, lng, radius = 50 } = {}) => {
    if (!lat || !lng) return Promise.resolve([]);
    return apiFetch(
      `/api/v1/attractions/nearby/?lat=${lat}&lng=${lng}&radius=${radius}`,
      () => MOCK_DATA.attractions.slice(0, 3)
    );
  },

  /** GET /api/v1/attractions/?search=:q */
  searchAttractions: (q) =>
    apiFetch(`/api/v1/attractions/?search=${encodeURIComponent(q)}`, () => {
      const query = q.trim().toLowerCase();
      return MOCK_DATA.attractions.filter(a =>
        a.name.toLowerCase().includes(query) ||
        (a.short_description || '').toLowerCase().includes(query) ||
        (a.region_name || '').toLowerCase().includes(query) ||
        (a.category_display || '').toLowerCase().includes(query)
      );
    }),

  /** GET /api/v1/attractions/:slug/reviews/ */
  getAttractionReviews: (slug) =>
    apiFetch(`/api/v1/attractions/${slug}/reviews/`, () => []),

  /** GET /api/v1/attractions/:slug/endemic-species/ */
  getEndemicSpecies: (slug) =>
    apiFetch(`/api/v1/attractions/${slug}/endemic-species/`, () => []),

  /* ═══════════════════════════════════════════════════
     REGIONS SEARCH
     ═══════════════════════════════════════════════════ */

  /** GET /api/v1/regions/?search=:q */
  searchRegions: (q) =>
    apiFetch(`/api/v1/regions/?search=${encodeURIComponent(q)}`, () => {
      const query = q.trim().toLowerCase();
      return MOCK_DATA.regions.filter(r =>
        r.name.toLowerCase().includes(query) ||
        (r.description || '').toLowerCase().includes(query)
      );
    }),

  /* ═══════════════════════════════════════════════════
     WEATHER
     ═══════════════════════════════════════════════════ */

  /** GET /api/v1/weather/current/?attraction=:slug */
  getWeather: (slug) =>
    apiFetch(`/api/v1/weather/current/?attraction=${slug}`, () => MOCK_DATA.weather.current_weather),

  /** GET /api/v1/weather/forecast/?attraction=:slug */
  getWeatherForecast: (slug) =>
    apiFetch(`/api/v1/weather/forecast/?attraction=${slug}`, () => MOCK_DATA.weather.forecast),

  /** GET /api/v1/weather/seasonal/?attraction=:slug */
  getSeasonalPatterns: (slug) =>
    apiFetch(`/api/v1/weather/seasonal/?attraction=${slug}`, () => MOCK_DATA.weather.seasonal_patterns),

  /** GET /api/v1/weather/seasonal/ (Tanzania general) */
  getGeneralSeasonalPatterns: () =>
    apiFetch('/api/v1/weather/seasonal/', () => MOCK_DATA.weather.seasonal_patterns),

  /** GET /api/v1/weather/forecast/ (Tanzania general) */
  getGeneralForecast: () =>
    apiFetch('/api/v1/weather/forecast/', () => MOCK_DATA.weather.forecast),

  /* ═══════════════════════════════════════════════════
     BLOG
     ═══════════════════════════════════════════════════ */

  /** GET /api/v1/blog/ */
  getBlogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/v1/blog/${qs ? '?' + qs : ''}`, () => MOCK_DATA.blog || []);
  },

  /** GET /api/v1/blog/:slug/ */
  getBlog: (slug) =>
    apiFetch(`/api/v1/blog/${slug}/`, () => {
      const found = (MOCK_DATA.blog || []).find(b => b.slug === slug);
      if (!found) throw new Error(`Blog post "${slug}" not found`);
      return found;
    }),

  /* ═══════════════════════════════════════════════════
     TOUR OPERATORS
     ═══════════════════════════════════════════════════ */

  /** GET /api/v1/operators/ */
  getOperators: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/v1/operators/${qs ? '?' + qs : ''}`, () => MOCK_DATA.operators || []);
  },

  /** GET /api/v1/operators/:slug/ */
  getOperator: (slug) =>
    apiFetch(`/api/v1/operators/${slug}/`, () => {
      const found = (MOCK_DATA.operators || []).find(o => o.slug === slug);
      if (!found) throw new Error(`Operator "${slug}" not found`);
      return found;
    }),

  /** GET /api/v1/operators/by_attraction/?attraction=:slug */
  getOperatorsByAttraction: (attractionSlug) =>
    apiFetch(
      `/api/v1/operators/by_attraction/?attraction=${encodeURIComponent(attractionSlug)}`,
      () => []
    ),

  /* ═══════════════════════════════════════════════════
     PARTNERS
     ═══════════════════════════════════════════════════ */

  /** GET /api/v1/partners/ */
  getPartners: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/v1/partners/${qs ? '?' + qs : ''}`, () => MOCK_DATA.partners || []);
  },

  /** GET /api/v1/partners/:slug/ */
  getPartner: (slug) =>
    apiFetch(`/api/v1/partners/${slug}/`, () => {
      const found = (MOCK_DATA.partners || []).find(p => p.slug === slug);
      if (!found) throw new Error(`Partner "${slug}" not found`);
      return found;
    }),

  /* ═══════════════════════════════════════════════════
     FEEDBACK & REVIEWS
     ═══════════════════════════════════════════════════ */

  /** POST /api/v1/feedback/submit/ */
  submitFeedback: (data) => apiMutate('/api/v1/feedback/submit/', 'POST', data),

  /* ═══════════════════════════════════════════════════
     CONTRIBUTORS
     ═══════════════════════════════════════════════════ */

  /** GET /api/v1/contributors/ */
  getContributors: () =>
    apiFetch('/api/v1/contributors/', () => MOCK_DATA.contributors || []),

  /* ═══════════════════════════════════════════════════
     AUTH
     ═══════════════════════════════════════════════════ */

  /** POST /api/v1/auth/register/ */
  register: (data) => apiMutate('/api/v1/auth/register/', 'POST', data),

  /** POST /api/v1/auth/login/ → { access, refresh } */
  login: (data) => apiMutate('/api/v1/auth/login/', 'POST', data),

  /** POST /api/v1/auth/token/refresh/ */
  refreshToken: (refresh) => apiMutate('/api/v1/auth/token/refresh/', 'POST', { refresh }),

  /** GET /api/v1/auth/profile/ (requires token) */
  getProfile: (token) =>
    apiFetch('/api/v1/auth/profile/', () => null,
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  /** PATCH /api/v1/auth/profile/ */
  updateProfile: (data, token) =>
    apiMutate('/api/v1/auth/profile/', 'PATCH', data, token),

  /* ═══════════════════════════════════════════════════
     STATS (homepage)
     ═══════════════════════════════════════════════════ */

  async getStats() {
    const [attractions, regions] = await Promise.allSettled([
      this.getAttractions(),
      this.getRegions(),
    ]);
    const attractionList = attractions.status === 'fulfilled' ? attractions.value : MOCK_DATA.attractions;
    const regionList     = regions.status     === 'fulfilled' ? regions.value     : MOCK_DATA.regions;
    return {
      attractionCount: Array.isArray(attractionList) ? attractionList.length : MOCK_DATA.attractions.length,
      regionCount:     Array.isArray(regionList)     ? regionList.length     : MOCK_DATA.regions.length,
    };
  },
};

