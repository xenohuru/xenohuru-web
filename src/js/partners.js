/**
 * partners.js — Partners listing page for Xenohuru
 *
 * Loads partners from api.getPartners(), renders a logo-style card grid,
 * and handles empty/error states gracefully.
 */

import { api } from './api.js';
import { emptyStateHTML, errorStateHTML, imgPlaceholder } from './placeholder.js';

const skeleton = document.getElementById('partners-skeleton');
const grid     = document.getElementById('partners-grid');
const emptyEl  = document.getElementById('partners-empty');
const errorEl  = document.getElementById('partners-error');

/** Capitalise first character */
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/** Build a single partner card HTML string */
function buildCard(partner) {
  const name        = partner.name || 'Partner';
  const type        = partner.type || partner.category || '';
  const description = (partner.description || partner.short_description || '').slice(0, 120);
  const logo        = partner.logo || partner.image || '';
  const website     = partner.website || partner.url || '';

  const websiteHtml = website
    ? `<a href="${website}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs text-tz-sky hover:text-tz-sky/80 transition-colors font-medium mt-1">
        <i data-lucide="external-link" class="w-3 h-3" aria-hidden="true"></i> Visit Website
       </a>`
    : '';

  return `
    <div class="partner-card bg-white rounded-2xl p-6 shadow-sm border border-tz-sand/50 flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300" role="listitem">
      <div class="w-20 h-20 rounded-full bg-tz-sand data-grid-placeholder flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src="${imgPlaceholder(name)}" alt="${name} logo" class="w-full h-full object-contain" loading="lazy" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <h3 class="font-semibold text-tz-dark text-base leading-tight">${name}</h3>
        ${type ? `<span class="text-xs text-tz-muted bg-tz-sand/60 px-2.5 py-0.5 rounded-full">${cap(type)}</span>` : ''}
      </div>
      ${description ? `<p class="text-xs text-tz-muted leading-relaxed">${description}${partner.description?.length > 120 ? '...' : ''}</p>` : ''}
      ${websiteHtml}
    </div>
  `;
}

/** Render partners to the grid */
function renderPartners(partners) {
  if (partners.length === 0) {
    grid.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    emptyEl.innerHTML = emptyStateHTML({
      icon: 'handshake',
      title: 'Partnerships coming soon',
      message: 'Want to partner with us? Get in touch!',
    });
    emptyEl.innerHTML += `
      <div class="mt-4">
        <a href="/contact" class="inline-flex items-center gap-2 bg-tz-sky text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-tz-sky/90 transition-colors">
          <i data-lucide="message-circle" class="w-4 h-4" aria-hidden="true"></i> Get in Touch
        </a>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  emptyEl.classList.add('hidden');
  grid.innerHTML = partners.map(buildCard).join('');
  grid.classList.remove('hidden');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/** Initial data load */
async function loadPartners() {
  try {
    const data = await api.getPartners();
    const partners = Array.isArray(data) ? data : (data.results || []);

    skeleton?.classList.add('hidden');
    renderPartners(partners);
  } catch (err) {
    console.error('[partners] Failed to load:', err);
    skeleton?.classList.add('hidden');
    grid.classList.add('hidden');
    emptyEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorEl.innerHTML = errorStateHTML({
      icon: 'wifi-off',
      title: 'Could not load partners',
      message: 'There was a problem fetching partner information. Please try again.',
      retryId: 'partners-retry',
      retryText: 'Try Again',
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('partners-retry')?.addEventListener('click', () => {
      errorEl.classList.add('hidden');
      skeleton?.classList.remove('hidden');
      loadPartners();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartners();
});
