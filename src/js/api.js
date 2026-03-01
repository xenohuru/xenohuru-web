/**
 * api.js — Xenohuru API service
 *
 * Tries the live Django REST API first.
 * Falls back to MOCK_DATA if API is unreachable (offline / not deployed).
 *
 * Live API: https://cf89615f228bb45cc805447510de80.pythonanywhere.com/
 * Toggle: set USE_MOCK = true to always use mock data during development.
 */

import { MOCK_DATA } from './mockdata.js';

const API_BASE = 'https://cf89615f228bb45cc805447510de80.pythonanywhere.com';

// Set to false to use the live API; true forces mock data
export const USE_MOCK = false;

/** Generic fetch with mock fallback and timeout */
async function apiFetch(path, mockFallback) {
  if (USE_MOCK) return mockFallback();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn(`[api] Falling back to mock data for ${path}:`, err.message);
    return mockFallback();
  }
}

export const api = {
  /** GET /regions/ */
  getRegions: () => apiFetch('/regions/', () => MOCK_DATA.regions),

  /** GET /attractions/ */
  getAttractions: () => apiFetch('/attractions/', () => MOCK_DATA.attractions),

  /** GET /attractions/featured/ */
  getFeaturedAttractions: () =>
    apiFetch('/attractions/featured/', () =>
      MOCK_DATA.attractions.filter(a => a.is_featured)
    ),

  /** GET /attractions/:slug/ */
  getAttraction: (slug) =>
    apiFetch(`/attractions/${slug}/`, () => {
      const detail = MOCK_DATA.attractionDetails[slug];
      if (!detail) throw new Error(`Attraction "${slug}" not found in mock data`);
      return detail;
    }),

  /** GET /weather/current/?attraction=:slug */
  getWeather: (slug) =>
    apiFetch(`/weather/current/?attraction=${slug}`, () => MOCK_DATA.weather.current_weather),

  /** GET /weather/forecast/?attraction=:slug */
  getWeatherForecast: (slug) =>
    apiFetch(`/weather/forecast/?attraction=${slug}`, () => MOCK_DATA.weather.forecast),

  /** GET /weather/seasonal/?attraction=:slug */
  getSeasonalPatterns: (slug) =>
    apiFetch(`/weather/seasonal/?attraction=${slug}`, () => MOCK_DATA.weather.seasonal_patterns),

  /** GET /weather/seasonal/ (no slug — general Tanzania overview) */
  getGeneralSeasonalPatterns: () =>
    apiFetch('/weather/seasonal/', () => MOCK_DATA.weather.seasonal_patterns),

  /** GET /weather/forecast/ (Tanzania general forecast) */
  getGeneralForecast: () =>
    apiFetch('/weather/forecast/', () => MOCK_DATA.weather.forecast),

  /**
   * GET /attractions/by_category/?category=:cat
   * Pass no argument to get all grouped by category.
   */
  getAttractionsByCategory: (category) => {
    const path = category
      ? `/attractions/by_category/?category=${encodeURIComponent(category)}`
      : '/attractions/by_category/';
    return apiFetch(path, () => {
      if (category) return MOCK_DATA.attractions.filter(a => a.category === category);
      return MOCK_DATA.attractions.reduce((acc, a) => {
        (acc[a.category] = acc[a.category] || []).push(a);
        return acc;
      }, {});
    });
  },

  /**
   * GET /attractions/by_region/?region=:region
   * Pass no argument to get all grouped by region.
   */
  getAttractionsByRegion: (region) => {
    const path = region
      ? `/attractions/by_region/?region=${encodeURIComponent(region)}`
      : '/attractions/by_region/';
    return apiFetch(path, () => {
      if (region) return MOCK_DATA.attractions.filter(a => a.region_name === region);
      return MOCK_DATA.attractions.reduce((acc, a) => {
        (acc[a.region_name] = acc[a.region_name] || []).push(a);
        return acc;
      }, {});
    });
  },

  /**
   * GET /attractions/?search=:q
   * Full-text search across attractions.
   */
  searchAttractions: (q) =>
    apiFetch(`/attractions/?search=${encodeURIComponent(q)}`, () => {
      const query = q.trim().toLowerCase();
      return MOCK_DATA.attractions.filter(a =>
        a.name.toLowerCase().includes(query) ||
        (a.short_description || '').toLowerCase().includes(query) ||
        (a.region_name || '').toLowerCase().includes(query) ||
        (a.category_display || '').toLowerCase().includes(query)
      );
    }),

  /**
   * GET /regions/?search=:q
   * Search across regions.
   */
  searchRegions: (q) =>
    apiFetch(`/regions/?search=${encodeURIComponent(q)}`, () => {
      const query = q.trim().toLowerCase();
      return MOCK_DATA.regions.filter(r =>
        r.name.toLowerCase().includes(query) ||
        (r.description || '').toLowerCase().includes(query)
      );
    }),

  /**
   * Fetches live attraction and region counts for the homepage stats bar.
   * Falls back gracefully to mock data lengths.
   */
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
