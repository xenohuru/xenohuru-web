# XENOHURU WEB CODEBASE — COMPLETE EXPLORATION SUMMARY

## 1. DIRECTORY STRUCTURE

### Full File Listing
```
src/
├── HTML Pages (18 total)
│   ├── index.html              (Home - with hero navbar)
│   ├── about.html              (About/Contributors)
│   ├── sponsor.html            (Sponsorship CTA)
│   ├── attractions.html        (All attractions - filterable)
│   ├── attraction.html         (Single attraction detail - 520 lines)
│   ├── regions.html            (Tanzania regions grid)
│   ├── blog.html               (Blog listing)
│   ├── blog-post.html          (Single blog article)
│   ├── weather.html            (Weather widget page)
│   ├── search.html             (Search results)
│   ├── operators.html          (Tour operators)
│   ├── partners.html           (Partners)
│   ├── contributors.html       (Contributors list)
│   ├── contact.html            (Contact/feedback form)
│   └── 404.html                (Error page)
│
├── JS (17 files)
│   ├── api.js                  (305 lines - API service + auth endpoints)
│   ├── scripts.js              (241 lines - Global shared JS)
│   ├── placeholder.js          (154 lines - Image placeholders)
│   ├── attraction.js           (520 lines - Attraction detail page logic)
│   ├── home.js                 (Featured carousel, stats, regions)
│   ├── attractions.js          (Filter, search, grid)
│   ├── about.js                (Contributors grid)
│   ├── regions.js              (Region cards)
│   ├── blog.js                 (Blog card grid)
│   ├── blog-post.js            (Single blog article)
│   ├── weather.js              (Live weather widget)
│   ├── search.js               (Search functionality)
│   ├── contact.js              (Contact form)
│   ├── operators.js            (Operators grid)
│   ├── partners.js             (Partners grid)
│   ├── contributors.js         (Contributors fetch)
│   └── mockdata.js             (62 KB - Full mock data)
│
├── CSS
│   └── styles.css              (811 lines - Custom CSS + animations)
│
├── Images
│   ├── favicons/               (favicon.svg, .ico, .png, .jpg)
│   ├── photo-*.jpg             (25+ stock images)
│   └── xenohuru-logo.svg
│
├── Config
│   ├── manifest.json           (PWA manifest)
│   ├── robots.txt              (SEO)
│   ├── sitemap.xml             (SEO)
│   ├── sw.js                   (Service Worker)
│   └── llms.txt                (LLM context)
│
└── Documentation
    └── XENOHURU_PATTERN_GUIDE.md  (36 KB pattern guide)
```

---

## 2. API ENDPOINTS & AUTH

### API Service (api.js - 305 lines)
**Backend:** Django REST API at `https://cf89615f228bb45cc805447510de80.pythonanywhere.com/`
**Fallback:** Mock data in mockdata.js (offline support)

#### Auth Endpoints (Lines 265-286)
```javascript
// POST /api/v1/auth/register/
api.register(data)

// POST /api/v1/auth/login/ → returns { access, refresh }
api.login(data)

// POST /api/v1/auth/token/refresh/
api.refreshToken(refresh)

// GET /api/v1/auth/profile/ (requires Bearer token)
api.getProfile(token)

// PATCH /api/v1/auth/profile/
api.updateProfile(data, token)
```

#### Other Key Endpoints
- **Attractions**: getAttractions(), getAttraction(slug), getFeaturedAttractions(), getAttractionsByCategory(), getAttractionsByRegion(), getNearbyAttractions(), searchAttractions()
- **Regions**: getRegions(), getRegion(slug), searchRegions()
- **Weather**: getWeather(slug), getWeatherForecast(slug), getSeasonalPatterns(slug), getGeneralForecast()
- **Blog**: getBlogs(params), getBlog(slug)
- **Operators**: getOperators(params), getOperator(slug), getOperatorsByAttraction(slug)
- **Partners**: getPartners(params), getPartner(slug)
- **Feedback**: submitFeedback(data)
- **Contributors**: getContributors()

---

## 3. NAVBAR & FOOTER PATTERNS

### NAVBAR — Two Variants

#### Variant A: Home Page (index.html) — Hero Navbar
```html
<nav id="main-nav" class="fixed top-0 left-0 right-0 z-50">
  <!-- Logo (SVG favicon, small) -->
  <a href="index.html" class="flex items-center gap-2 h-10 lg:h-12">
    <img src="images/favicons/favicon.svg" alt="Xenohuru" class="h-full" />
  </a>
  
  <!-- Desktop Menu (lg:flex, hidden on md) -->
  <ul class="hidden lg:flex items-center gap-1">
    <li><a href="index.html" class="nav-link active-nav">Home</a></li>
    <li><a href="attractions.html" class="nav-link">Attractions</a></li>
    <li><a href="regions.html" class="nav-link">Regions</a></li>
    <li><a href="blog.html" class="nav-link">Blog</a></li>
    <li><a href="operators.html" class="nav-link">Operators</a></li>
    <li><a href="about.html" class="nav-link">About</a></li>
    <li><a href="sponsor.html" class="nav-link">Sponsor</a></li>
  </ul>
  
  <!-- Right side: Time + Language Switcher + CTA -->
  <div class="flex items-center gap-3">
    <!-- Tanzania Time (EAT) -->
    <div class="hidden md:flex items-center gap-1.5 text-white/70 text-xs font-mono">
      <i data-lucide="clock" class="w-3.5 h-3.5"></i>
      <span id="nav-time" class="time-display">--:--</span>
      <span class="text-white/40">EAT</span>
    </div>
    
    <!-- Language Switcher -->
    <div class="lang-switcher hidden sm:block text-white">
      <select id="lang-switcher" aria-label="Select language">
        <option value="en" selected>EN</option>
        <option value="sw">SW</option>
      </select>
    </div>
    
    <!-- CTA Button -->
    <a href="attractions.html" class="hidden md:inline-flex bg-tz-savanna text-white px-5 py-2.5 rounded-full">
      Explore Now
    </a>
    
    <!-- Mobile Menu Toggle -->
    <button id="mobile-toggle" class="lg:hidden" aria-expanded="false">
      <i data-lucide="menu" class="w-6 h-6"></i>
    </button>
  </div>
</nav>
```

#### Scroll Effect (scripts.js, lines 29-52)
When user scrolls > 60px:
- **Background**: Changes from transparent → glassmorphic white (rgba 0.82) with blur(16px)
- **Text**: White text → dark text
- **Logo text**: Hidden (only icon shown)
- **Links**: White/80 → dark/70
- **Active link**: White/90 → tz-savanna (#C8903A)
- **Box shadow**: Subtle shadow added

#### Variant B: All Other Pages (about, attractions, etc.)
```html
<nav id="main-nav" class="fixed top-0 left-0 right-0 z-50">
  <!-- Same structure, but navbar is NOT hero-based (background is already light) -->
</nav>
```

### MOBILE DRAWER (All Pages)
```html
<!-- Overlay (z-40) -->
<div id="mobile-overlay" class="fixed inset-0 z-40 bg-black/50 opacity-0"></div>

<!-- Drawer (z-50) -->
<aside id="mobile-drawer" class="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl">
  <!-- Close button -->
  <button id="mobile-close"><i data-lucide="x"></i></button>
  
  <!-- Nav links (vertical) -->
  <nav class="p-4">
    <ul class="flex flex-col gap-1">
      <li><a href="index.html" class="nav-link">Home</a></li>
      <li><a href="attractions.html" class="nav-link">Attractions</a></li>
      <!-- ... -->
    </ul>
  </nav>
  
  <!-- Language selector (mobile) -->
  <div class="mt-4 px-4">
    <select class="w-full border rounded-xl"></select>
  </div>
  
  <!-- CTA button -->
  <a href="attractions.html" class="mt-6 bg-tz-forest">Explore Now</a>
</aside>
```

**Mobile Menu Behavior** (scripts.js, lines 54-86):
- Click menu icon → drawer slides in from left, overlay fades in
- Click close button or overlay → drawer slides out
- Press Escape key → drawer closes
- Body overflow hidden while open

### FOOTER (All Pages) — Identical Structure
```html
<footer class="bg-tz-dark text-white" aria-label="Site footer">
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-10">
      
      <!-- Column 1: Branding (md:col-span-2) -->
      <div class="md:col-span-2">
        <a href="index.html" class="flex items-center gap-2 mb-4">
          <!-- Flag gradient logo -->
          <span class="w-8 h-8 rounded-full" style="background: linear-gradient(135deg,#1EB53A 33%,#FCD116 33% 66%,#00A3DD 66%);"></span>
          <span class="font-display text-lg font-bold">Xenohuru</span>
        </a>
        <p class="text-white/60 text-sm mb-4">Your open-source guide to the wonders of Tanzania...</p>
        
        <!-- Tanzania Time (with .tz-time-value and .tz-date-value classes) -->
        <div class="tz-time flex items-center gap-2 text-xs font-mono text-white/40">
          <i data-lucide="clock" class="w-3 h-3"></i>
          <span class="tz-time-value">--:--:--</span>
          <span class="tz-date-value">---</span>
          <span class="text-tz-savanna">EAT</span>
        </div>
      </div>
      
      <!-- Column 2: Explore -->
      <div>
        <h3 class="font-semibold text-white/90 mb-4 uppercase tracking-wider text-xs">Explore</h3>
        <ul class="space-y-2 text-sm text-white/60" role="list">
          <li><a href="index.html">Home</a></li>
          <li><a href="attractions.html">All Attractions</a></li>
          <li><a href="regions.html">Regions</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="sponsor.html">Sponsor</a></li>
        </ul>
      </div>
      
      <!-- Column 3: Project / Connect / Open Source (varies per page) -->
      <!-- ... -->
    </div>
    
    <!-- Footer bottom -->
    <div class="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-sm">
      <p>&copy; <span id="current-year"></span> Xenohuru. Open source under MIT License.</p>
      <p class="swahili-quote text-white/30 text-xs">"Pole pole ndio mwendo" -- Slowly slowly is the way</p>
    </div>
  </div>
</footer>
```

**Footer Notes:**
- All pages use `.current-year` or `#current-year` → scripts.js injects current year
- Tanzania time uses `.tz-time-value` and `.tz-date-value` classes
- Updated every 1 second via scripts.js (lines 112-132)

---

## 4. KEY SCRIPTS & GLOBAL BEHAVIOR

### scripts.js (241 lines) — Runs on Every Page
Lines 8-240 execute on `DOMContentLoaded`:

1. **Image Error Handling** (lines 10-11)
   - Calls `initImageErrorHandling()` from placeholder.js
   - All images with `data-fallback="placeholder"` auto-swap to SVG on error

2. **Lucide Icons** (line 14)
   - `lucide.createIcons()` renders all `<i data-lucide="...">` elements

3. **AOS (Animate On Scroll)** (lines 17-19)
   - 700ms duration, easing: ease-out-cubic, once: true
   - Elements with `data-aos="fade-up"` animate on scroll

4. **Preloader Hide** (lines 22-27)
   - `.preloader` hidden after page load or 3s timeout

5. **Navbar Scroll Effect** (lines 29-52)
   - Detects scroll > 60px
   - Swaps navbar from transparent→glassmorphic
   - Text: white→dark, active link color changes

6. **Mobile Menu Toggle** (lines 54-86)
   - `#mobile-toggle` opens drawer
   - `#mobile-close` closes drawer
   - `#mobile-overlay` click closes drawer
   - Escape key closes drawer

7. **Active Nav Link** (lines 88-95)
   - Detects current page, adds `.active-nav` class to matching link

8. **Back to Top Button** (lines 97-104)
   - `#back-to-top` visible when scrollY > 400px
   - Smooth scroll to top on click

9. **Current Year** (lines 106-109)
   - `.current-year` and `#current-year` updated with `new Date().getFullYear()`

10. **Tanzania Time (EAT = UTC+3)** (lines 111-132)
    - Updates every 1 second
    - `#nav-time` gets HH:MM
    - `.tz-time-value` gets HH:MM:SS
    - `.tz-date-value` gets "Wed, 09 Mar 2024"

11. **Stat Counter Animation** (lines 134-154)
    - Elements with `data-count="123"` animate from 0→123 over 2s
    - Uses IntersectionObserver (animates when visible)

12. **Hero Parallax** (lines 156-163)
    - `.hero-parallax-img` translates on scroll (30% effect)

13. **Proverb Rotation** (lines 165-200)
    - 10 Swahili proverbs rotate every 6s
    - `#proverb-sw`, `#proverb-en`, `#proverb-dots`

14. **Language Switcher** (lines 230-238)
    - `#lang-switcher` persists to localStorage
    - Sets `document.documentElement.lang`

### api.js (305 lines) — API Service
- `const USE_MOCK = false` (set to true to force mock data)
- Auto-fallback if API unreachable
- 8-second timeout per request
- POST/PATCH requests throw on error (no mock fallback)

### placeholder.js (154 lines) — Image & Error Utilities

Functions:
```javascript
imgPlaceholder(label)         // → SVG data-URI placeholder (400×300)
heroBannerPlaceholder(label)  // → SVG data-URI hero placeholder (1200×500)
skeletonImgHTML(classes)      // → <div class="skeleton-img"> HTML
initImageErrorHandling()      // → Attach error handler to all <img>
errorStateHTML(config)        // → Error card HTML (wifi-off icon, etc.)
emptyStateHTML(config)        // → Empty state card HTML (inbox icon, etc.)
```

---

## 5. ATTRACTION DETAIL PAGE STRUCTURE (attraction.html + attraction.js)

### HTML Structure
```html
<main>
  <!-- Hero / Image Gallery -->
  <section id="gallery-section" class="relative min-h-screen">
    <div id="gallery-splide" class="splide">
      <ul id="gallery-list" class="splide__list"></ul>
    </div>
    
    <!-- Overlay gradient & info -->
    <div class="absolute bottom-0 left-0 right-0">
      <div id="attraction-category-badge"></div>
      <h1 id="attraction-name"></h1>
      <p id="attraction-region"><i data-lucide="map-pin"></i> <span>Loading...</span></p>
      
      <!-- Breadcrumb -->
      <ol class="flex items-center gap-1.5">
        <li><a href="index.html">Home</a></li>
        <li id="breadcrumb-name">...</li>
      </ol>
      
      <span id="attraction-difficulty"></span>
    </div>
  </section>

  <!-- Main Content — 2-column layout -->
  <div class="max-w-7xl mx-auto px-4 py-14">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <!-- LEFT: Main content (lg:col-span-2) -->
      <div class="lg:col-span-2 space-y-12">
        <!-- Overview section -->
        <section aria-labelledby="section-overview">
          <h2 id="section-overview" class="font-display text-2xl font-bold">Overview</h2>
          <div id="attraction-description" class="prose prose-lg"></div>
        </section>
        
        <!-- Key Info Table -->
        <section>
          <h2 class="font-display text-2xl font-bold">Key Information</h2>
          <table class="key-info-table w-full">
            <tr>
              <td class="font-semibold">Altitude</td>
              <td id="info-altitude">—</td>
            </tr>
            <tr>
              <td class="font-semibold">Difficulty</td>
              <td id="info-difficulty"></td>
            </tr>
            <tr>
              <td class="font-semibold">Duration</td>
              <td id="info-duration">—</td>
            </tr>
            <tr>
              <td class="font-semibold">Entrance Fee</td>
              <td id="info-fee">Free</td>
            </tr>
            <tr>
              <td class="font-semibold">Guide Required</td>
              <td id="info-guide"></td>
            </tr>
            <tr>
              <td class="font-semibold">Permit Required</td>
              <td id="info-permit"></td>
            </tr>
            <tr>
              <td class="font-semibold">Nearest Airport</td>
              <td id="info-airport">—</td>
            </tr>
            <tr>
              <td class="font-semibold">Distance from Airport</td>
              <td id="info-distance">—</td>
            </tr>
          </table>
        </section>
        
        <!-- Weather Widget -->
        <section class="weather-widget rounded-2xl p-8">
          <h2 class="font-semibold text-white mb-6">Current Weather</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <i id="weather-icon" data-lucide="cloud" class="w-12 h-12"></i>
              <p id="weather-desc" class="text-white/80 text-sm mt-2">—</p>
            </div>
            <div>
              <p class="text-white/70 text-xs font-semibold mb-1">Temperature</p>
              <p id="weather-temp" class="text-2xl font-bold text-white">—</p>
            </div>
            <div>
              <p class="text-white/70 text-xs font-semibold mb-1">Wind</p>
              <p id="weather-wind" class="text-2xl font-bold text-white">—</p>
            </div>
            <div>
              <p class="text-white/70 text-xs font-semibold mb-1">Humidity</p>
              <p id="weather-humidity" class="text-2xl font-bold text-white">—</p>
            </div>
          </div>
        </section>
        
        <!-- Traveller Tips -->
        <section>
          <h2 class="font-display text-2xl font-bold">Traveller Tips</h2>
          <ul id="tips-list" class="space-y-4">
            <!-- Rendered by JS, each tip gets a numbered circle -->
          </ul>
        </section>
        
        <!-- Map Section -->
        <section id="osm-map-wrap" style="display: none;">
          <h2 class="font-display text-2xl font-bold">Location Map</h2>
          <iframe id="osm-map" src="" class="w-full h-96 rounded-2xl border-0"></iframe>
          <a id="osm-link" href="" target="_blank" rel="noopener noreferrer" class="text-tz-forest">
            <i data-lucide="external-link"></i> View on OpenStreetMap
          </a>
        </section>
      </div>
      
      <!-- RIGHT: Sidebar (lg:col-span-1) -->
      <aside class="sticky-sidebar space-y-6">
        <!-- Quick Facts Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="font-semibold mb-4">Quick Facts</h3>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-tz-muted font-semibold mb-1">REGION</p>
              <p id="fact-region" class="text-tz-dark font-semibold">—</p>
            </div>
            <div>
              <p class="text-xs text-tz-muted font-semibold mb-1">CATEGORY</p>
              <p id="fact-category"></p>
            </div>
            <div>
              <p class="text-xs text-tz-muted font-semibold mb-1">FEATURED</p>
              <p id="fact-featured"></p>
            </div>
          </div>
        </div>
        
        <!-- Access Info Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="font-semibold mb-3">Access Information</h3>
          <p id="attraction-access" class="text-tz-muted text-sm">—</p>
        </div>
        
        <!-- Seasonal Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="font-semibold mb-3">Seasonal Availability</h3>
          <p id="attraction-seasonal" class="text-tz-muted text-sm">—</p>
        </div>
        
        <!-- Best Time Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="font-semibold mb-3">Best Time to Visit</h3>
          <p id="info-best-time" class="text-tz-muted text-sm">—</p>
        </div>
        
        <!-- Coordinates Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="font-semibold mb-3">GPS Coordinates</h3>
          <p id="info-coords" class="text-tz-muted text-sm font-mono">—</p>
        </div>
        
        <!-- Share Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h3 class="font-semibold mb-3">Share This Attraction</h3>
          <button id="share-btn" class="w-full flex items-center justify-center gap-2 bg-tz-forest text-white px-5 py-3 rounded-xl">
            <i data-lucide="share-2"></i> Share
          </button>
          <p id="share-feedback" class="hidden text-center text-xs text-tz-muted mt-2">Link copied!</p>
        </div>
      </aside>
    </div>
  </div>

  <!-- Similar Attractions -->
  <section class="bg-white border-t border-gray-100 py-16">
    <div class="max-w-7xl mx-auto px-4">
      <h2 id="section-similar" class="font-display text-3xl font-bold mb-2">Similar Attractions</h2>
      <p class="text-tz-muted mb-8">More to explore in the same region</p>
      <div id="similar-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Rendered by JS -->
      </div>
    </div>
  </section>
</main>
```

### attraction.js Logic (520 lines)

**Main Functions:**

1. **getSlug()** (lines 87-89)
   - Reads `?slug=` from URL query parameters

2. **initGallery(images)** (lines 102-132)
   - Injects `<li class="splide__slide">` elements
   - Mounts Splide carousel with:
     - type: 'loop'
     - heightRatio: 0.6
     - cover: true (object-cover)
     - autoplay: true (5s interval)
     - pagination & arrows enabled

3. **populateDetail(attraction)** (lines 142-270)
   - Sets all element IDs from API data
   - Renders category badge, difficulty badge
   - Splits description by newlines → separate `<p>` tags
   - Renders Key Info table (altitude, duration, fees, etc.)
   - Renders Tips list (sorted by order, numbered circles)
   - Renders GPS map iframe + coordinates
   - Renders sidebar cards (Quick Facts, Access, Seasonal, Best Time)
   - Re-runs `lucide.createIcons()` for injected icons

4. **weatherCodeToIcon(code)** (lines 281-291)
   - Maps WMO weather codes to Lucide icon names

5. **populateWeather(weather)** (lines 299-320)
   - Sets weather widget: temp, description, wind, humidity
   - Swaps weather icon based on code

6. **loadSimilar(currentSlug, regionName)** (lines 325-407)
   - Fetches all attractions
   - Filters to same region (excluding current)
   - Takes first 3, renders into `#similar-grid`
   - Each card is a compact attraction card with hover effects
   - Triggers AOS refresh on new elements

7. **initShare(attraction)** (lines 412-465)
   - Wires `#share-btn` click handler
   - Uses `navigator.share()` if available (mobile)
   - Falls back to `navigator.clipboard.writeText()`
   - Shows brief feedback message

8. **init()** (lines 470-517)
   - Main entry point (called on DOMContentLoaded)
   - Gets slug, exits if not provided
   - Fetches attraction detail + weather concurrently
   - Calls populateDetail, initGallery, populateWeather, loadSimilar, initShare
   - Updates document.title
   - Handles errors gracefully

---

## 6. COLOR PALETTE & TAILWIND THEME

**All pages include this `<style type="text/tailwindcss">` block:**

```javascript
@theme {
  --color-tz-forest:  #1A4731;    /* Dark forest green — primary */
  --color-tz-savanna: #C8903A;    /* Golden/tan — accent */
  --color-tz-sky:     #1E6FA8;    /* Sky blue — secondary */
  --color-tz-sand:    #F5E6C8;    /* Light sand/beige — light bg */
  --color-tz-earth:   #8B5E3C;    /* Brown earth */
  --color-tz-dark:    #111827;    /* Almost black — text */
  --color-tz-muted:   #6B7280;    /* Gray — secondary text */
  --color-tz-light:   #FAFAF8;    /* Off-white — page bg */
  
  /* Fonts */
  --font-display: "Playfair Display", serif;    /* Headlines (700, 800, 900) */
  --font-body:    "DM Sans", sans-serif;        /* Body (400, 500, 600) */
  --font-mono:    "Space Mono", monospace;      /* Code/time */
}
```

**Usage:**
- `bg-tz-forest`, `text-tz-savanna`, `border-tz-sky`, etc.
- `font-display`, `font-body`, `font-mono`

---

## 7. CSS ANIMATIONS & EFFECTS (styles.css, 811 lines)

### Key Classes

**Navigation:**
- `.nav-link::after` — underline animation on hover/active
- `.navbar-scrolled` — glassmorphic background

**Cards:**
- `.attraction-card` — hover: translateY(-6px) + shadow lift + shimmer
- `.attraction-card::before` — shimmer shine effect on hover

**Badges:**
- `.badge-easy` / `.badge-moderate` / `.badge-challenging` / `.badge-difficult` / `.badge-extreme`
- `.badge-category` — blue light background with blur
- `.featured-badge` — gold gradient

**Forms:**
- `.form-input:focus` — border-tz-forest + box-shadow

**Animations:**
- `@keyframes spinGradient` — preloader spinner
- `@keyframes heroGradientShift` — hero background animation
- `@keyframes scrollPulse` — scroll indicator bounce
- `@keyframes shimmer` — card shine effect

**Special Effects:**
- `.hero-grain::before` — SVG noise texture overlay (opacity 3.5%)
- `.hero-parallax-img` — JS-driven parallax transform
- `.splide__arrow` — glassmorphic carousel buttons

---

## 8. ACCESSIBILITY (a11y)

**Every page includes:**
- `lang="en"` on `<html>`
- `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`
- `aria-label` on navigation, buttons, links
- `aria-hidden="true"` on decorative elements
- `aria-expanded="false"` on menu toggle
- `aria-current="page"` on active nav (future)
- `aria-labelledby=""` on sections with headings
- `role="list"` and `role="presentation"` on lists
- Focus rings: `focus-visible:outline-2 focus-visible:outline-tz-forest`
- Form labels with `for=""` attribute (when applicable)

---

## 9. RESPONSIVE DESIGN

**Tailwind Breakpoints:**
```
Mobile:    < 640px   (default)
Tablet:    sm: 640px
Tablet+:   md: 768px
Desktop:   lg: 1024px
Wide:      xl: 1280px
```

**Common Patterns:**
```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block"></div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-8"></div>

<!-- Responsive text sizes -->
<h1 class="text-3xl sm:text-4xl lg:text-5xl"></h1>

<!-- Responsive padding -->
<div class="px-4 sm:px-6 lg:px-8"></div>
```

---

## 10. LIBRARIES & EXTERNAL DEPENDENCIES

**CDN:**
- Tailwind CSS v4 (browser@4) — runtime compilation
- Splide v4 — carousel (on home, attraction pages)
- AOS v2.3.4 — scroll animations
- Lucide Icons — SVG icons (latest)

**Fonts:**
- Google Fonts: Playfair Display, DM Sans, Space Mono

**Scripts:**
- Service Worker (sw.js) — offline support, caching

**Module System:**
- ES6 modules (type="module" script tags)

---

## 11. PATTERNS FOR NEW AUTH PAGES

### Required Elements

**login.html / register.html should include:**

1. **Head** (copy from about.html, customize meta tags)
2. **Navbar** (simple variant, not hero)
3. **Mobile drawer**
4. **Main content** with:
   - Centered form container (max-w-md)
   - Form fields with labels
   - Submit button
   - Link to other auth page
   - Optional: password strength indicator
5. **Footer**
6. **Back to top button**

**Example Form:**
```html
<main id="main-content" class="min-h-screen flex items-center justify-center px-4 py-16">
  <div class="max-w-md w-full">
    <div class="text-center mb-8">
      <h1 class="font-display text-3xl font-bold text-tz-dark mb-2">Login to Xenohuru</h1>
      <p class="text-tz-muted">Your gateway to Tanzania adventures</p>
    </div>
    
    <form id="login-form" class="space-y-5">
      <div>
        <label for="email" class="block text-sm font-semibold text-tz-dark mb-2">Email Address</label>
        <input type="email" id="email" name="email" required 
               class="w-full form-input px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-tz-forest" />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-semibold text-tz-dark mb-2">Password</label>
        <input type="password" id="password" name="password" required 
               class="w-full form-input px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-tz-forest" />
      </div>
      
      <button type="submit" class="w-full bg-tz-forest text-white font-semibold py-3 rounded-xl hover:bg-tz-forest/90 transition-colors">
        Login
      </button>
    </form>
    
    <p class="mt-6 text-center text-tz-muted">
      Don't have an account? <a href="register.html" class="text-tz-forest font-semibold hover:underline">Sign up</a>
    </p>
  </div>
</main>
```

**JS Pattern (login.js):**
```javascript
import { api } from './api.js';

async function init() {
  const form = document.getElementById('login-form');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await api.login({ email, password });
      // response = { access: "...", refresh: "..." }
      
      // Save tokens to localStorage or sessionStorage
      localStorage.setItem('authToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      // Redirect to dashboard or home
      window.location.href = '/attractions.html';
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
```

---

## 12. UPDATING ATTRACTION.HTML FOR NEW FEATURES

### Current Content Sections (in order):
1. Gallery (Splide carousel)
2. Hero overlay with title, region, breadcrumb
3. Overview (description)
4. Key Information table
5. Weather widget
6. Traveller Tips
7. Location Map (OpenStreetMap iframe)
8. Similar Attractions
9. Sidebar:
   - Quick Facts
   - Access Information
   - Seasonal Availability
   - Best Time to Visit
   - GPS Coordinates
   - Share button

### To Add New Section:
1. Add HTML element with unique `id=""` in template
2. Add setter function in `populateDetail()` using `setText()` or `setHTML()`
3. Ensure API response contains the data field
4. Test with mock data in mockdata.js

**Example: Adding "Endemic Species" section:**

**HTML:**
```html
<section aria-labelledby="section-endemic">
  <h2 id="section-endemic" class="font-display text-2xl font-bold mb-5">Endemic Species</h2>
  <div id="endemic-species-list" class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Rendered by JS -->
  </div>
</section>
```

**JS:**
```javascript
// In attraction.js, inside populateDetail()
const endemicEl = document.getElementById('endemic-species-list');
if (endemicEl && a.endemic_species?.length) {
  endemicEl.innerHTML = a.endemic_species.map(species => `
    <div class="bg-white rounded-2xl p-5 border border-gray-100">
      <h4 class="font-semibold text-tz-dark mb-2">${species.name}</h4>
      <p class="text-tz-muted text-sm">${species.description}</p>
    </div>
  `).join('');
} else {
  endemicEl.innerHTML = `<p class="text-tz-muted col-span-full text-sm">No endemic species data available.</p>`;
}
```

**API Call (in init()):**
```javascript
// Fetch endemic species
const endemic = await api.getEndemicSpecies(slug);  // Already defined in api.js line 147
```

---

## 13. QUICK CHECKLIST FOR AUTH PAGES

When creating `/src/login.html` and `/src/register.html`:

- [ ] Copy `<head>` from about.html, customize title/description
- [ ] Include all fonts, Tailwind theme, styles.css
- [ ] Navbar (simple variant, NOT hero)
- [ ] Mobile drawer & overlay
- [ ] Centered form card (max-w-md)
- [ ] Form fields with labels:
  - [ ] Email (type="email", required)
  - [ ] Password (type="password", required)
  - [ ] Confirm Password (register only)
  - [ ] Optional: Name, Terms checkbox
- [ ] Submit button with loading state
- [ ] Error message display (red text or alert)
- [ ] Link to other auth page ("Sign up?" / "Already have account?")
- [ ] Footer
- [ ] Back to top button
- [ ] Scripts:
  - [ ] aos.js, lucide, scripts.js (defer)
  - [ ] `<script type="module" src="js/login.js"></script>`
  - [ ] Service worker registration
- [ ] Create `/src/js/login.js` module
  - [ ] Import api.js
  - [ ] Wire form submit → api.login() or api.register()
  - [ ] Handle response (save tokens)
  - [ ] Handle errors (show message)
  - [ ] Redirect on success
- [ ] Test on mobile

---

## 14. SUMMARY TABLE

| Item | Location | Details |
|------|----------|---------|
| **HTML Pages** | `/src/*.html` | 18 pages, all follow same template |
| **JS Scripts** | `/src/js/` | 17 files, ES6 modules, global + page-specific |
| **CSS** | `/src/css/styles.css` | 811 lines, custom + Tailwind v4 |
| **API** | `/src/js/api.js` | 305 lines, Django REST backend + mock fallback |
| **Colors** | Tailwind theme | 8 custom colors (forest, savanna, sky, sand, earth, dark, muted, light) |
| **Fonts** | Google Fonts | Playfair Display (display), DM Sans (body), Space Mono (mono) |
| **Navbar** | 2 variants | Hero (index.html) + Simple (others) |
| **Footer** | Universal | Identical on all pages, 5-column grid |
| **Mobile Menu** | Universal | Drawer + overlay, toggle + close buttons |
| **Animations** | styles.css | @keyframes, hover effects, scroll triggers (AOS) |
| **Accessibility** | All pages | ARIA labels, focus rings, semantic HTML |
| **Auth** | api.js | register, login, refreshToken, getProfile, updateProfile |

---

## READY FOR AUTH PAGES & ATTRACTION UPDATES ✅

You now have:
1. ✅ Full directory structure
2. ✅ All JavaScript patterns
3. ✅ HTML/CSS/navbar/footer patterns
4. ✅ API integration (including auth endpoints)
5. ✅ Attraction detail page logic (520 lines)
6. ✅ Responsive design patterns
7. ✅ Accessibility guidelines
8. ✅ Animation & effects reference

**Next steps:**
- Create `/src/login.html` and `/src/register.html`
- Create `/src/js/login.js` and `/src/js/register.js`
- Update attraction.html with new sections (endemic species, reviews, etc.)
- Update attraction.js to populate new sections
