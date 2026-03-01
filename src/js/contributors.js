/**
 * contributors.js — GitHub-API-powered contributors page
 *
 * Fetches contributors from the GitHub REST API and renders a card grid.
 * Falls back to a static list if GitHub rate-limits or is unreachable.
 */

const GITHUB_REPO = 'xenohuru/xenohuru-web';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contributors?per_page=100&anon=true`;

/** Hardcoded fallback list shown when GitHub API is unavailable */
const FALLBACK_CONTRIBUTORS = [
    { login: 'xenohuru', avatar_url: 'https://github.com/xenohuru.png', html_url: 'https://github.com/xenohuru', contributions: 1 },
];

// ── Render ─────────────────────────────────────────────────────────────

/**
 * Renders a contributor card for each contributor in the array.
 * @param {Array} contributors - Array of GitHub contributor objects.
 */
function renderContributors(contributors) {
    const loading = document.getElementById('contributors-loading');
    const grid = document.getElementById('contributors-grid');
    const error = document.getElementById('contributors-error');

    if (!grid) return;

    loading?.classList.add('hidden');
    error?.classList.add('hidden');

    if (!contributors || contributors.length === 0) {
        showError();
        return;
    }

    grid.innerHTML = contributors.map(c => `
    <a href="${c.html_url}"
       target="_blank"
       rel="noopener noreferrer"
       class="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center
              hover:shadow-md hover:-translate-y-1 transition-all duration-300"
       data-aos="fade-up"
       aria-label="View ${c.login}'s GitHub profile">

      <!-- Avatar -->
      <div class="w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 ring-tz-forest/20 group-hover:ring-tz-forest/50 transition-all">
        <img src="${c.avatar_url}&s=160"
             alt="${c.login}'s avatar"
             class="w-full h-full object-cover"
             loading="lazy"
             onerror="this.src='https://github.com/ghost.png'" />
      </div>

      <!-- Username -->
      <h3 class="font-display text-sm font-bold text-tz-dark mb-1 truncate w-full">${c.login}</h3>

      <!-- Contribution count -->
      <p class="text-tz-muted text-xs font-mono">
        ${c.contributions} commit${c.contributions !== 1 ? 's' : ''}
      </p>

      <!-- GitHub icon -->
      <i data-lucide="github" class="w-4 h-4 text-gray-400 group-hover:text-tz-dark mt-3 transition-colors" aria-hidden="true"></i>
    </a>
  `).join('');

    grid.classList.remove('hidden');

    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof AOS !== 'undefined') AOS.refresh();
}

/** Shows the error state */
function showError() {
    document.getElementById('contributors-loading')?.classList.add('hidden');
    document.getElementById('contributors-grid')?.classList.add('hidden');
    document.getElementById('contributors-error')?.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Stats ──────────────────────────────────────────────────────────────

/**
 * Updates the stats bar with real contributor/commit counts.
 * @param {Array} contributors - GitHub contributor objects.
 */
function updateStats(contributors) {
    const totalCommits = contributors.reduce((sum, c) => sum + (c.contributions || 0), 0);
    const contribEl = document.getElementById('stat-contributors');
    const commitsEl = document.getElementById('stat-commits');
    if (contribEl) contribEl.textContent = contributors.length;
    if (commitsEl) commitsEl.textContent = totalCommits > 999 ? `${(totalCommits / 1000).toFixed(1)}k` : totalCommits;
}

// ── Fetch ──────────────────────────────────────────────────────────────

/**
 * Fetches contributors from GitHub API with an 8-second timeout.
 * Falls back to FALLBACK_CONTRIBUTORS if the request fails or rate limit hit.
 */
async function loadContributors() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(GITHUB_API, {
            signal: controller.signal,
            headers: { Accept: 'application/vnd.github.v3+json' },
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            // GitHub rate limit returns 403 — show fallback silently
            throw new Error(`GitHub API error: ${res.status}`);
        }

        const contributors = await res.json();
        updateStats(contributors);
        renderContributors(contributors);
    } catch (err) {
        console.warn('[contributors] Falling back to static list:', err.message);
        // If we get any data (partial), use fallback
        updateStats(FALLBACK_CONTRIBUTORS);
        renderContributors(FALLBACK_CONTRIBUTORS);
    }
}

// ── Init ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    loadContributors();
});
