/**
 * blog-post.js — Individual blog post page for Xenohuru
 *
 * Reads ?slug= from URL, fetches post via api.getBlog(slug),
 * populates the page and renders related posts.
 */

import { api } from './api.js';
import { emptyStateHTML, errorStateHTML, imgPlaceholder } from './placeholder.js';

const skeleton    = document.getElementById('post-skeleton');
const content     = document.getElementById('post-content');
const errorEl     = document.getElementById('post-error');
const breadcrumb  = document.getElementById('breadcrumb-title');

/** Format ISO date → "3 January 2025" */
function fmtDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
}

/** Capitalise first character */
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/** Build a compact related-post card */
function relatedCard(post) {
  const slug      = post.slug || '';
  const title     = post.title || 'Untitled';
  const excerpt   = post.excerpt || post.short_description || '';
  const category  = post.category || '';
  const date      = fmtDate(post.published_at || post.created_at);
  const imgSrc    = imgPlaceholder(title);

  return `
    <a href="blog-post.html?slug=${encodeURIComponent(slug)}" class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col" aria-label="Read: ${title}">
      <div class="relative aspect-video bg-tz-sand data-grid-placeholder overflow-hidden">
        <img src="${imgSrc}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-fallback="placeholder" loading="lazy" />
        ${category ? `<span class="absolute top-2 left-2 bg-tz-forest text-white text-xs px-2 py-0.5 rounded-full">${cap(category)}</span>` : ''}
      </div>
      <div class="p-4">
        <p class="text-xs text-tz-muted mb-1">${date}</p>
        <h3 class="font-display text-base font-bold text-tz-dark line-clamp-2 leading-snug">${title}</h3>
        <p class="text-tz-muted text-sm mt-1 line-clamp-2">${excerpt}</p>
      </div>
    </a>
  `;
}

/** Populate the article with post data */
function renderPost(post) {
  document.title = `${post.title} -- Xenohuru`;

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${post.title} -- Xenohuru`);

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', post.excerpt || post.short_description || post.title);

  if (breadcrumb) {
    breadcrumb.textContent = post.title;
    breadcrumb.title = post.title;
  }

  const img = document.getElementById('post-hero-img');
  if (img) {
    img.src = imgPlaceholder(post.title || '');
    img.alt = post.title;
  }

  const catEl = document.getElementById('post-category');
  if (catEl) catEl.textContent = cap(post.category || 'Article');

  const titleEl = document.getElementById('post-title');
  if (titleEl) titleEl.textContent = post.title || '';

  const dateEl = document.getElementById('post-date');
  if (dateEl) dateEl.textContent = fmtDate(post.published_at || post.created_at);

  const authorEl = document.getElementById('post-author');
  if (authorEl) authorEl.textContent = post.author || post.author_name || 'Xenohuru';

  const rtEl = document.getElementById('post-read-time');
  if (rtEl) rtEl.textContent = `${post.read_time || post.reading_time || '5'} min read`;

  const bodyEl = document.getElementById('post-body');
  if (bodyEl) {
    bodyEl.innerHTML = post.body || post.content || `<p>${post.excerpt || post.short_description || ''}</p>`;
  }

  // Share buttons
  const shareTwitter = document.getElementById('share-twitter');
  if (shareTwitter) {
    const text = encodeURIComponent(`${post.title} — Xenohuru Tanzania`);
    const url  = encodeURIComponent(window.location.href);
    shareTwitter.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  const shareCopy = document.getElementById('share-copy');
  if (shareCopy) {
    shareCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        shareCopy.innerHTML = '<i data-lucide="check" class="w-4 h-4" aria-hidden="true"></i> Copied!';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => {
          shareCopy.innerHTML = '<i data-lucide="link" class="w-4 h-4" aria-hidden="true"></i> Copy Link';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2000);
      } catch { /* clipboard not available */ }
    });
  }

  // Show content
  skeleton?.classList.add('hidden');
  content?.classList.remove('hidden');

  // Related posts (same category, excluding current)
  if (post._related && post._related.length > 0) {
    const relSection = document.getElementById('related-section');
    const relGrid    = document.getElementById('related-grid');
    if (relSection && relGrid) {
      relGrid.innerHTML = post._related.slice(0, 3).map(relatedCard).join('');
      relSection.classList.remove('hidden');
    }
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/** Show error state */
function showError(msg) {
  skeleton?.classList.add('hidden');
  content?.classList.add('hidden');
  errorEl?.classList.remove('hidden');
  if (breadcrumb) breadcrumb.textContent = 'Not Found';
  console.warn('[blog-post]', msg);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('slug');

  if (!slug) {
    showError('No slug provided in URL.');
    return;
  }

  try {
    const post = await api.getBlog(slug);

    // Attempt to fetch related posts from the same category
    if (post.category) {
      try {
        const all = await api.getBlogs();
        const list = Array.isArray(all) ? all : (all.results || []);
        post._related = list
          .filter(p => p.category === post.category && p.slug !== slug)
          .slice(0, 3);
      } catch { /* related posts are optional */ }
    }

    renderPost(post);
  } catch (err) {
    showError(err.message);
  }
});
