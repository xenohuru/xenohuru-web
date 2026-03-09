/**
 * blog.js — Blog listing page for Xenohuru
 *
 * Loads posts from api.getBlogs(), renders a responsive card grid,
 * and supports client-side category + text search filtering.
 */

import { api } from './api.js';
import { emptyStateHTML, errorStateHTML, imgPlaceholder } from './placeholder.js';

const skeleton  = document.getElementById('blog-skeleton');
const grid      = document.getElementById('blog-grid');
const emptyEl   = document.getElementById('blog-empty');
const errorEl   = document.getElementById('blog-error');
const countEl   = document.getElementById('blog-count');
const searchEl  = document.getElementById('blog-search');
const catEl     = document.getElementById('blog-category');

/** All posts loaded from API — reference for filtering */
let allPosts = [];

/** Format ISO date string → "3 Jan 2025" */
function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

/** Capitalise first character */
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/** Build a single blog card HTML string */
function buildCard(post) {
  const slug      = post.slug || '';
  const title     = post.title || 'Untitled';
  const excerpt   = post.excerpt || post.short_description || '';
  const category  = post.category || '';
  const author    = post.author || post.author_name || 'Xenohuru';
  const date      = fmtDate(post.published_at || post.created_at);
  const readTime  = post.read_time || post.reading_time || '5';
  const imgSrc    = imgPlaceholder(title);

  return `
    <article class="blog-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col" role="listitem">
      <div class="relative overflow-hidden aspect-video bg-tz-sand data-grid-placeholder flex-shrink-0">
        <img
          src="${imgSrc}"
          alt="${title}"
          class="blog-card-img w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          data-fallback="placeholder"
          loading="lazy"
        />
        ${category ? `<span class="absolute top-3 left-3 bg-tz-forest text-white text-xs px-2.5 py-1 rounded-full font-medium">${cap(category)}</span>` : ''}
      </div>
      <div class="p-5 flex flex-col flex-1">
        <div class="flex flex-wrap items-center gap-3 text-xs text-tz-muted mb-3">
          <span class="flex items-center gap-1">
            <i data-lucide="calendar" class="w-3.5 h-3.5" aria-hidden="true"></i>
            ${date}
          </span>
          <span class="flex items-center gap-1">
            <i data-lucide="user" class="w-3.5 h-3.5" aria-hidden="true"></i>
            ${author}
          </span>
          <span class="flex items-center gap-1">
            <i data-lucide="clock" class="w-3.5 h-3.5" aria-hidden="true"></i>
            ${readTime} min read
          </span>
        </div>
        <h2 class="font-display text-xl font-bold text-tz-dark mb-2 line-clamp-2 leading-snug">${title}</h2>
        <p class="text-tz-muted text-sm leading-relaxed line-clamp-3 mb-4 flex-1">${excerpt}</p>
        <a href="blog-post.html?slug=${encodeURIComponent(slug)}" class="inline-flex items-center gap-1.5 text-tz-forest font-semibold text-sm hover:text-tz-savanna transition-colors mt-auto" aria-label="Read more about ${title}">
          Read More <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
        </a>
      </div>
    </article>
  `;
}

/** Render filtered list of posts to the grid */
function renderPosts(posts) {
  if (posts.length === 0) {
    grid.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    emptyEl.innerHTML = emptyStateHTML({
      icon: 'camera',
      title: 'Coming Soon',
      message: 'Our writers are crafting amazing stories about Tanzania. Check back soon!',
    });
    if (countEl) { countEl.textContent = '0 posts'; countEl.classList.remove('sr-only'); }
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  emptyEl.classList.add('hidden');
  grid.innerHTML = posts.map(buildCard).join('');
  grid.classList.remove('hidden');

  if (countEl) {
    countEl.textContent = `${posts.length} post${posts.length === 1 ? '' : 's'}`;
    countEl.classList.remove('sr-only');
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/** Apply current search + category filters and re-render */
function applyFilters() {
  const query = (searchEl?.value || '').trim().toLowerCase();
  const cat   = catEl?.value || '';

  const filtered = allPosts.filter(p => {
    const matchCat = !cat || (p.category || '').toLowerCase() === cat;
    const haystack = `${p.title} ${p.excerpt || ''} ${p.short_description || ''} ${p.author || ''} ${p.author_name || ''}`.toLowerCase();
    const matchQ   = !query || haystack.includes(query);
    return matchCat && matchQ;
  });

  renderPosts(filtered);
}

/** Initial data load */
async function loadBlogs() {
  try {
    const data = await api.getBlogs();
    allPosts = Array.isArray(data) ? data : (data.results || []);

    // Hide skeleton, show grid area
    skeleton?.classList.add('hidden');

    if (allPosts.length === 0) {
      renderPosts([]);
    } else {
      renderPosts(allPosts);
    }
  } catch (err) {
    console.error('[blog] Failed to load posts:', err);
    skeleton?.classList.add('hidden');
    grid.classList.add('hidden');
    emptyEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorEl.innerHTML = errorStateHTML({
      icon: 'wifi-off',
      title: 'Could not load posts',
      message: 'There was a problem fetching blog posts. Please try again.',
      retryId: 'blog-retry',
      retryText: 'Try Again',
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('blog-retry')?.addEventListener('click', () => {
      errorEl.classList.add('hidden');
      skeleton?.classList.remove('hidden');
      loadBlogs();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBlogs();

  searchEl?.addEventListener('input', applyFilters);
  catEl?.addEventListener('change', applyFilters);
});
