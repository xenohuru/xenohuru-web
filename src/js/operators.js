/**
 * operators.js — Tour operators listing page for Xenohuru
 *
 * Loads tour operators from api.getOperators(), renders a card grid,
 * and supports client-side search + tier/category filtering.
 */

import { api } from './api.js';
import { emptyStateHTML, errorStateHTML, imgPlaceholder } from './placeholder.js';

const skeleton    = document.getElementById('operators-skeleton');
const grid        = document.getElementById('operators-grid');
const emptyEl     = document.getElementById('operators-empty');
const errorEl     = document.getElementById('operators-error');
const countEl     = document.getElementById('operators-count');
const searchEl    = document.getElementById('operators-search');
const catEl       = document.getElementById('operators-category');

/** All operators loaded from API */
let allOperators = [];

/** Capitalise first character */
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/** Normalise tier/category label for display */
function tierLabel(tier) {
  const map = {
    'budget':      'Budget',
    'mid-range':   'Mid-Range',
    'midrange':    'Mid-Range',
    'luxury':      'Luxury',
    'specialized': 'Specialized',
  };
  return map[(tier || '').toLowerCase()] || cap(tier);
}

/** Build a single operator card HTML string */
function buildCard(op) {
  const name        = op.name || 'Tour Operator';
  const description = op.description || op.short_description || '';
  const tier        = op.tier || op.type || op.category || '';
  const logo        = op.logo || op.cover_image || op.image || '';
  const location    = op.location || op.region || op.city || '';
  const phone       = op.phone || '';
  const email       = op.email || '';
  const website     = op.website || op.url || '';

  const attractions = Array.isArray(op.attractions) ? op.attractions : [];
  const badgesHtml = attractions.slice(0, 3).map(a =>
    `<span class="text-xs bg-tz-sand text-tz-earth px-2 py-0.5 rounded-full">${a.name || a}</span>`
  ).join('');

  const contactParts = [];
  if (location) contactParts.push(`<span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5" aria-hidden="true"></i>${location}</span>`);
  if (phone)    contactParts.push(`<a href="tel:${phone}" class="flex items-center gap-1 hover:text-tz-forest transition-colors"><i data-lucide="phone" class="w-3.5 h-3.5" aria-hidden="true"></i>${phone}</a>`);
  if (email)    contactParts.push(`<a href="mailto:${email}" class="flex items-center gap-1 hover:text-tz-forest transition-colors"><i data-lucide="mail" class="w-3.5 h-3.5" aria-hidden="true"></i>${email}</a>`);

  const websiteHtml = website
    ? `<a href="${website}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-tz-sky hover:text-tz-sky/80 transition-colors"><i data-lucide="external-link" class="w-3.5 h-3.5" aria-hidden="true"></i>Visit Website</a>`
    : '';

  return `
    <article class="operator-card bg-white rounded-2xl overflow-hidden shadow-sm border border-tz-sand/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col" role="listitem">
      <div class="relative h-40 bg-tz-sand data-grid-placeholder overflow-hidden flex-shrink-0">
        <img src="${imgPlaceholder(name)}" alt="${name}" class="w-full h-full object-cover" loading="lazy" />
      </div>
      <div class="p-5 flex flex-col flex-1">
        <div class="flex items-start justify-between gap-2 mb-3">
          <h3 class="font-display text-lg font-bold text-tz-dark leading-tight">${name}</h3>
          ${tier ? `<span class="text-xs px-2.5 py-1 bg-tz-sand text-tz-earth rounded-full whitespace-nowrap flex-shrink-0 font-medium">${tierLabel(tier)}</span>` : ''}
        </div>
        <p class="text-tz-muted text-sm leading-relaxed line-clamp-3 mb-4 flex-1">${description}</p>
        ${badgesHtml ? `<div class="flex flex-wrap gap-1.5 mb-4">${badgesHtml}</div>` : ''}
        ${websiteHtml}
        ${contactParts.length > 0 ? `
          <div class="flex flex-wrap items-center gap-3 text-xs text-tz-muted pt-3 border-t border-gray-100 mt-3">
            ${contactParts.join('')}
          </div>
        ` : ''}
      </div>
    </article>
  `;
}

/** Render filtered list to the grid */
function renderOperators(ops) {
  if (ops.length === 0) {
    grid.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    emptyEl.innerHTML = emptyStateHTML({
      icon: 'briefcase',
      title: 'No operators listed yet',
      message: 'Be the first to register your tour company!',
    });
    // Add CTA button below
    emptyEl.innerHTML += `
      <div class="mt-4">
        <a href="contact.html" class="inline-flex items-center gap-2 bg-tz-forest text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-tz-forest/90 transition-colors">
          <i data-lucide="plus-circle" class="w-4 h-4" aria-hidden="true"></i> Register Your Company
        </a>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  emptyEl.classList.add('hidden');
  grid.innerHTML = ops.map(buildCard).join('');
  grid.classList.remove('hidden');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/** Apply search + category filters */
function applyFilters() {
  const query = (searchEl?.value || '').trim().toLowerCase();
  const cat   = (catEl?.value || '').toLowerCase();

  const filtered = allOperators.filter(op => {
    const tierVal = (op.tier || op.type || op.category || '').toLowerCase().replace(/\s+/g, '-');
    const matchCat = !cat || tierVal === cat || tierVal.includes(cat);
    const haystack = `${op.name} ${op.description || ''} ${op.short_description || ''} ${op.location || ''} ${op.region || ''}`.toLowerCase();
    const matchQ   = !query || haystack.includes(query);
    return matchCat && matchQ;
  });

  renderOperators(filtered);
}

/** Initial data load */
async function loadOperators() {
  try {
    const data = await api.getOperators();
    allOperators = Array.isArray(data) ? data : (data.results || []);

    skeleton?.classList.add('hidden');

    // Update count display
    if (countEl) countEl.textContent = allOperators.length.toLocaleString();

    renderOperators(allOperators);
  } catch (err) {
    console.error('[operators] Failed to load:', err);
    skeleton?.classList.add('hidden');
    grid.classList.add('hidden');
    emptyEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorEl.innerHTML = errorStateHTML({
      icon: 'wifi-off',
      title: 'Could not load operators',
      message: 'There was a problem fetching tour operators. Please try again.',
      retryId: 'operators-retry',
      retryText: 'Try Again',
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('operators-retry')?.addEventListener('click', () => {
      errorEl.classList.add('hidden');
      skeleton?.classList.remove('hidden');
      loadOperators();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadOperators();

  searchEl?.addEventListener('input', applyFilters);
  catEl?.addEventListener('change', applyFilters);
});
