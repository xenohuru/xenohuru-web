/**
 * search.js — Full-text search page for Xenohuru
 *
 * - Reads `?q=` URL parameter on load and auto-searches
 * - Live debounced search on input
 * - Queries both attractions and regions via api.js (with mock fallback)
 * - Updates URL as user types so results are shareable / bookmarkable
 */

import { api } from './api.js';

// ── State ─────────────────────────────────────────────────────────────
let searchTimer = null;
let currentQuery = '';

// ── DOM refs ──────────────────────────────────────────────────────────
const inputEl = () => document.getElementById('main-search-input');
const spinnerEl = () => document.getElementById('search-spinner');
const metaEl = () => document.getElementById('search-meta');
const defaultEl = () => document.getElementById('search-default');
const loadingEl = () => document.getElementById('search-loading');
const resultsEl = () => document.getElementById('search-results');
const emptyEl = () => document.getElementById('search-empty');
const emptyTextEl = () => document.getElementById('search-empty-text');

// ── View helpers ──────────────────────────────────────────────────────

function showState(state) {
    defaultEl()?.classList.toggle('hidden', state !== 'default');
    loadingEl()?.classList.toggle('hidden', state !== 'loading');
    resultsEl()?.classList.toggle('hidden', state !== 'results');
    emptyEl()?.classList.toggle('hidden', state !== 'empty');
}

function setSpinner(on) {
    spinnerEl()?.classList.toggle('hidden', !on);
}

// ── Card builders ─────────────────────────────────────────────────────

function attractionCard(a) {
    const img = a.featured_image || 'images/photo-1547036967-23d11aacaee0.jpg';
    return `
    <a href="attraction.html?slug=${a.slug}"
       class="flex gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4
              hover:shadow-md hover:-translate-y-0.5 transition-all group"
       data-aos="fade-up">
      <div class="w-24 h-20 rounded-xl overflow-hidden shrink-0">
        <img src="${img}" alt="${a.name}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             loading="lazy" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-semibold bg-tz-forest/10 text-tz-forest px-2 py-0.5 rounded-full">Attraction</span>
          <span class="text-xs text-tz-muted font-mono">${a.category_display || ''}</span>
        </div>
        <h3 class="font-display text-base font-bold text-tz-dark truncate">${a.name}</h3>
        <p class="text-tz-muted text-sm mt-0.5 flex items-center gap-1">
          <i data-lucide="map-pin" class="w-3 h-3 shrink-0"></i>${a.region_name}
        </p>
        <p class="text-tz-muted text-xs mt-1 line-clamp-1">${a.short_description || ''}</p>
      </div>
      <i data-lucide="arrow-right" class="w-5 h-5 text-gray-300 group-hover:text-tz-forest transition-colors shrink-0 self-center"></i>
    </a>
  `;
}

function regionCard(r) {
    const img = r.image || 'images/photo-1586348943529-beaae6c28db9.jpg';
    return `
    <a href="regions.html#region-${r.slug}"
       class="flex gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4
              hover:shadow-md hover:-translate-y-0.5 transition-all group"
       data-aos="fade-up">
      <div class="w-24 h-20 rounded-xl overflow-hidden shrink-0">
        <img src="${img}" alt="${r.name}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             loading="lazy" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-semibold bg-tz-savanna/15 text-tz-savanna px-2 py-0.5 rounded-full">Region</span>
        </div>
        <h3 class="font-display text-base font-bold text-tz-dark truncate">${r.name}</h3>
        <p class="text-tz-muted text-xs mt-1 line-clamp-2">${r.description || ''}</p>
      </div>
      <i data-lucide="arrow-right" class="w-5 h-5 text-gray-300 group-hover:text-tz-savanna transition-colors shrink-0 self-center"></i>
    </a>
  `;
}

// ── Search logic ──────────────────────────────────────────────────────

/**
 * Executes a search for `query` against both attractions and regions.
 * @param {string} query - Search query string.
 */
async function doSearch(query) {
    const q = query.trim();
    if (!q) {
        showState('default');
        metaEl() && (metaEl().textContent = '');
        return;
    }

    currentQuery = q;
    showState('loading');
    setSpinner(true);

    // Update URL without page reload so results are shareable
    const url = new URL(window.location);
    url.searchParams.set('q', q);
    window.history.replaceState({}, '', url);

    try {
        const [attractions, regions] = await Promise.all([
            api.searchAttractions(q),
            api.searchRegions(q),
        ]);

        setSpinner(false);

        const totalResults = (attractions?.length || 0) + (regions?.length || 0);

        if (totalResults === 0) {
            emptyTextEl() && (emptyTextEl().textContent = `No results for "${q}". Try a different search.`);
            metaEl() && (metaEl().textContent = `0 results for "${q}"`);
            showState('empty');
            return;
        }

        // Build combined result HTML with section headings
        let html = '';

        if (attractions && attractions.length > 0) {
            html += `<h2 class="font-display text-xl font-bold text-tz-dark mb-3 mt-2">
                 <i data-lucide="binoculars" class="inline w-5 h-5 mr-2 text-tz-forest"></i>
                 Attractions <span class="text-tz-muted text-base font-normal">(${attractions.length})</span>
               </h2>`;
            html += attractions.map(attractionCard).join('');
        }

        if (regions && regions.length > 0) {
            html += `<h2 class="font-display text-xl font-bold text-tz-dark mb-3 mt-8">
                 <i data-lucide="map" class="inline w-5 h-5 mr-2 text-tz-savanna"></i>
                 Regions <span class="text-tz-muted text-base font-normal">(${regions.length})</span>
               </h2>`;
            html += regions.map(regionCard).join('');
        }

        const container = resultsEl();
        if (container) container.innerHTML = html;

        metaEl() && (metaEl().textContent = `${totalResults} result${totalResults !== 1 ? 's' : ''} for "${q}"`);
        showState('results');

        if (typeof lucide !== 'undefined') lucide.createIcons();
        if (typeof AOS !== 'undefined') AOS.refresh();

    } catch (err) {
        console.error('[search] Error:', err);
        setSpinner(false);
        emptyTextEl() && (emptyTextEl().textContent = 'Search failed. Please try again.');
        showState('empty');
    }
}

// ── Debounce ──────────────────────────────────────────────────────────

function debounce(fn, delay) {
    return (...args) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => fn(...args), delay);
    };
}

// ── Init ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const input = inputEl();
    if (!input) return;

    // Auto-search from URL param
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    if (q) {
        input.value = q;
        doSearch(q);
    }

    // Live search with debounce
    const handleInput = debounce(e => doSearch(e.target.value), 350);
    input.addEventListener('input', handleInput);

    // Keyboard shortcut "/" focuses search when not in input
    document.addEventListener('keydown', e => {
        if (e.key === '/' && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
    });

    // Focus the input on page load if no initial query
    if (!q) input.focus();
});
