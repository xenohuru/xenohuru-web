# XENOHURU WEB — Complete Pattern Guide for New Pages

## 1. FILE STRUCTURE

```
src/
├── index.html                    (Home page - 362 lines)
├── about.html                    (About page - 352 lines)
├── sponsor.html                  (Sponsor page)
├── attractions.html              (Attractions listing)
├── regions.html                  (Regions listing)
├── search.html                   (Search page)
├── weather.html                  (Weather page)
├── contributors.html             (Contributors page)
├── attraction.html               (Single attraction detail)
├── 404.html                      (Error page)
├── css/
│   └── styles.css               (1000+ lines - all custom CSS)
├── js/
│   ├── api.js                   (API service with mock fallback - 305 lines)
│   ├── placeholder.js           (Image placeholders & error handling - 154 lines)
│   ├── scripts.js               (Global shared JS - 241 lines)
│   ├── home.js                  (Home page specific logic)
│   ├── about.js                 (About page specific logic)
│   ├── attractions.js           (Attractions page)
│   ├── regions.js               (Regions page)
│   ├── attraction.js            (Single attraction detail)
│   ├── weather.js               (Weather feature)
│   ├── contributors.js          (Contributors fetch)
│   ├── search.js                (Search functionality)
│   └── mockdata.js              (Mock data for fallback)
├── images/
│   ├── favicons/                (Favicon set)
│   ├── asserts/                 (Image assets - 25 photos)
│   └── xenohuru-logo.svg        (Logo)
├── manifest.json                (PWA manifest)
├── robots.txt                   (SEO)
├── sitemap.xml                  (SEO)
├── sw.js                        (Service Worker)
└── llms.txt                     (LLM context file)
```

---

## 2. EXACT HTML STRUCTURE TEMPLATE FOR ALL PAGES

### HEAD (identical across all pages)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="google-site-verification" content="pHPLMg-WCPRPZmMkRfwwU53xNb28y1Qh-334PcfDW38" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="[PAGE_DESCRIPTION]" />
  <meta name="keywords" content="[PAGE_KEYWORDS]" />
  <meta property="og:title" content="[PAGE_TITLE] — Xenohuru" />
  <meta property="og:description" content="[PAGE_DESCRIPTION]" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="images/[FEATURE_IMAGE]" />
  <link rel="canonical" href="https://xenohuru.netlify.app/[PAGE].html" />
  <title>[PAGE_TITLE] — Xenohuru</title>

  <!-- External CSS & Fonts (Splide carousel optional for home page only) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/css/splide.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=Space+Mono&display=swap" rel="stylesheet" />
  
  <!-- Tailwind CSS Browser (runtime compilation) -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <!-- Tailwind Color Theme (REQUIRED - same on all pages) -->
  <style type="text/tailwindcss">
    @theme {
      --color-tz-forest:  #1A4731;    /* Dark forest green */
      --color-tz-savanna: #C8903A;    /* Golden/savanna tan */
      --color-tz-sky:     #1E6FA8;    /* Sky blue */
      --color-tz-sand:    #F5E6C8;    /* Light sand/beige */
      --color-tz-earth:   #8B5E3C;    /* Brown earth */
      --color-tz-dark:    #111827;    /* Almost black */
      --color-tz-muted:   #6B7280;    /* Gray muted */
      --color-tz-light:   #FAFAF8;    /* Off-white */
      --font-display: "Playfair Display", serif;  /* Headlines */
      --font-body:    "DM Sans", sans-serif;       /* Body text */
      --font-mono:    "Space Mono", monospace;     /* Code/time */
    }
  </style>

  <!-- Custom CSS (supplements Tailwind) -->
  <link rel="stylesheet" href="css/styles.css" />
  
  <!-- PWA & Theme -->
  <link rel="manifest" href="manifest.json" />
  <meta name="theme-color" content="#1A4731" />
  
  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="images/favicons/favicon.svg" />
  <link rel="icon" type="image/png" sizes="96x96" href="images/favicons/favicon-96x96.png" />
  <link rel="shortcut icon" href="images/favicons/favicon.ico" />
  <link rel="apple-touch-icon" href="images/favicons/favicon-96x96.png" />
</head>
```

### BODY STRUCTURE (Global - same across all pages)

```html
<body class="bg-tz-light text-tz-dark font-body">

  <!-- PRELOADER (hidden by scripts.js after page load) -->
  <div class="preloader" aria-hidden="true">
    <div class="preloader-spinner"></div>
  </div>

  <!-- SKIP TO CONTENT (accessibility) - OPTIONAL -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-tz-forest focus:text-white focus:px-4 focus:py-2 focus:rounded">Skip to main content</a>

  <!-- NAVBAR (fixed, top-0, z-50) - UNIVERSAL -->
  <!-- Two variants: home.html has hero navbar (gradient, white text)
                      all other pages use simple navbar -->

  <!-- MOBILE OVERLAY & DRAWER (fixed, z-40/z-50) - UNIVERSAL -->

  <!-- MAIN CONTENT -->
  <main id="main-content">
    <!-- PAGE-SPECIFIC SECTIONS HERE -->
  </main>

  <!-- FOOTER (bg-tz-dark) - UNIVERSAL -->

  <!-- BACK TO TOP BUTTON (fixed, bottom-6, right-6) - UNIVERSAL -->

  <!-- SCRIPTS (defer or module) -->
  <!-- External libraries first -->
  <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4/dist/js/splide.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js" defer></script>
  <script src="https://unpkg.com/lucide@latest" defer></script>
  
  <!-- Global shared script -->
  <script src="js/scripts.js" defer></script>
  
  <!-- Page-specific module -->
  <script type="module" src="js/[page].js"></script>

  <!-- Service Worker registration -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('[SW] Registered:', reg.scope))
          .catch(err => console.warn('[SW] Registration failed:', err));
      });
    }
  </script>
</body>
</html>
```

---

## 3. NAVBAR PATTERNS (TWO VARIANTS)

### VARIANT A: HOME PAGE (index.html) — Hero Navbar
- **Background**: Transparent initially, glassmorphic when scrolled
- **Text color**: White initially, changes to dark when scrolled
- **Logo**: SVG favicon (smaller size)
- **Sticky**: YES, always visible at top

```html
<nav id="main-nav" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" aria-label="Main navigation">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 lg:h-20">
      <!-- Logo (small SVG) -->
      <a href="index.html" class="flex items-center gap-2 h-10 lg:h-12" aria-label="Xenohuru home">
        <img src="images/favicons/favicon.svg" alt="Xenohuru" class="h-full" />
      </a>

      <!-- Desktop Menu (hidden on mobile) -->
      <ul class="hidden lg:flex items-center gap-1" role="list">
        <li><a href="index.html" class="nav-link active-nav px-3 py-2 text-sm font-medium text-white/90 hover:text-tz-savanna transition-colors rounded">Home</a></li>
        <li><a href="attractions.html" class="nav-link px-3 py-2 text-sm font-medium text-white/80 hover:text-tz-savanna transition-colors rounded">Attractions</a></li>
        <li><a href="regions.html" class="nav-link px-3 py-2 text-sm font-medium text-white/80 hover:text-tz-savanna transition-colors rounded">Regions</a></li>
        <li><a href="about.html" class="nav-link px-3 py-2 text-sm font-medium text-white/80 hover:text-tz-savanna transition-colors rounded">About</a></li>
        <li><a href="sponsor.html" class="nav-link px-3 py-2 text-sm font-medium text-white/80 hover:text-tz-savanna transition-colors rounded">Sponsor</a></li>
      </ul>

      <!-- Right side (time, language, CTA button) -->
      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center gap-1.5 text-white/70 text-xs font-mono">
          <i data-lucide="clock" class="w-3.5 h-3.5" aria-hidden="true"></i>
          <span id="nav-time" class="time-display">--:--</span>
          <span class="text-white/40">EAT</span>
        </div>
        <div class="lang-switcher hidden sm:block text-white">
          <select id="lang-switcher" aria-label="Select language">
            <option value="en" selected>EN</option>
            <option value="sw">SW</option>
          </select>
        </div>
        <a href="attractions.html" class="hidden md:inline-flex items-center gap-2 bg-tz-savanna text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-tz-savanna/90 transition-colors">Explore Now</a>
        <!-- Mobile toggle button -->
        <button id="mobile-toggle" class="lg:hidden text-white p-2" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">
          <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
      </div>
    </div>
  </div>
</nav>
```

### VARIANT B: OTHER PAGES (about.html, sponsor.html, etc.) — Simple Navbar
- **Background**: White/light (NOT transparent)
- **Text color**: Dark (tz-dark/tz-forest)
- **Logo**: Text logo with colored circle OR SVG + text
- **Optional**: Swahili quote banner above navbar

```html
<!-- OPTIONAL: Swahili Quote Banner (above navbar) -->
<div class="swahili-quote-banner bg-tz-savanna text-white py-2.5 text-center transition-opacity duration-400">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 text-sm">
    <span class="sq-text font-display font-bold tracking-wider">#HAKUNAMATATA</span>
    <span class="text-white/60">|</span>
    <span class="sq-translation text-white/80 italic">"No worries"</span>
  </div>
</div>

<!-- NAVBAR -->
<nav id="main-nav" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" aria-label="Main navigation">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo (text + icon) -->
      <a href="index.html" class="flex items-center gap-2" aria-label="Xenohuru home">
        <span class="w-8 h-8 rounded-full flex-shrink-0" style="background: linear-gradient(135deg,#1EB53A 33%,#FCD116 33% 66%,#00A3DD 66%);" aria-hidden="true"></span>
        <span class="font-display text-xl font-bold text-tz-forest">Xenohuru</span>
      </a>
      
      <!-- Desktop Menu -->
      <ul class="hidden md:flex items-center gap-8" role="list">
        <li><a href="index.html" class="nav-link font-medium hover:text-tz-forest transition-colors">Home</a></li>
        <li><a href="attractions.html" class="nav-link font-medium hover:text-tz-forest transition-colors">Attractions</a></li>
        <li><a href="regions.html" class="nav-link font-medium hover:text-tz-forest transition-colors">Regions</a></li>
        <li><a href="about.html" class="nav-link font-medium hover:text-tz-forest transition-colors">About</a></li>
        <li><a href="sponsor.html" class="nav-link font-medium hover:text-tz-forest transition-colors">Sponsor</a></li>
      </ul>
      
      <!-- CTA Button -->
      <div class="hidden md:flex items-center gap-3">
        <a href="attractions.html" class="inline-flex items-center gap-2 bg-tz-forest text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-tz-forest/90 transition-colors">Explore Now</a>
      </div>
      
      <!-- Mobile toggle -->
      <button id="mobile-toggle" class="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">
        <i data-lucide="menu" class="w-6 h-6"></i>
      </button>
    </div>
  </div>
</nav>
```

### MOBILE DRAWER & OVERLAY (Same for both)
```html
<!-- Mobile Overlay -->
<div id="mobile-overlay" class="fixed inset-0 z-40 bg-black/50 opacity-0 transition-opacity duration-300" aria-hidden="true"></div>

<!-- Mobile Drawer -->
<aside id="mobile-drawer" class="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300" aria-label="Mobile navigation" aria-hidden="true">
  <div class="flex items-center justify-between p-4 border-b border-gray-100">
    <a href="index.html" class="flex items-center gap-2 h-10" aria-label="Xenohuru home">
      <img src="images/favicons/favicon.svg" alt="Xenohuru" class="h-full" />
    </a>
    <button id="mobile-close" class="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close menu">
      <i data-lucide="x" class="w-5 h-5"></i>
    </button>
  </div>
  <nav class="p-4" aria-label="Mobile navigation links">
    <ul class="flex flex-col gap-1" role="list">
      <li><a href="index.html" class="nav-link active-nav block px-4 py-3 rounded-xl font-medium hover:bg-tz-sand hover:text-tz-forest transition-colors">Home</a></li>
      <li><a href="attractions.html" class="nav-link block px-4 py-3 rounded-xl font-medium hover:bg-tz-sand hover:text-tz-forest transition-colors">Attractions</a></li>
      <li><a href="regions.html" class="nav-link block px-4 py-3 rounded-xl font-medium hover:bg-tz-sand hover:text-tz-forest transition-colors">Regions</a></li>
      <li><a href="about.html" class="nav-link block px-4 py-3 rounded-xl font-medium hover:bg-tz-sand hover:text-tz-forest transition-colors">About</a></li>
      <li><a href="sponsor.html" class="nav-link block px-4 py-3 rounded-xl font-medium hover:bg-tz-sand hover:text-tz-forest transition-colors">Sponsor</a></li>
    </ul>
    <div class="mt-4 px-4">
      <label class="text-xs text-tz-muted font-semibold uppercase tracking-wider">Language</label>
      <select class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" aria-label="Select language (mobile)">
        <option value="en" selected>English</option>
        <option value="sw">Kiswahili</option>
      </select>
    </div>
    <a href="attractions.html" class="mt-6 mx-4 flex items-center justify-center gap-2 bg-tz-forest text-white font-semibold px-5 py-3 rounded-xl hover:bg-tz-forest/90 transition-colors">Explore Now</a>
  </nav>
</aside>
```

---

## 4. FOOTER PATTERN (UNIVERSAL)

```html
<!-- FOOTER -->
<footer class="bg-tz-dark text-white" aria-label="Site footer">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
      <!-- Company Info Column (spans 2 on desktop) -->
      <div class="lg:col-span-2">
        <a href="index.html" class="flex items-center gap-2 mb-4" aria-label="Xenohuru home">
          <span class="w-8 h-8 rounded-full flex-shrink-0" style="background: linear-gradient(135deg,#1EB53A 33%,#FCD116 33% 66%,#00A3DD 66%);" aria-hidden="true"></span>
          <span class="font-display text-lg font-bold">Xenohuru</span>
        </a>
        <p class="text-white/60 text-sm leading-relaxed mb-4">Your open-source guide to the wonders of Tanzania -- built by the community, for the curious. #HakunaMatata</p>
        <div class="flex items-center gap-2 text-white/50 text-xs font-mono">
          <i data-lucide="clock" class="w-3.5 h-3.5" aria-hidden="true"></i>
          <span id="footer-time" class="time-display">--:--:-- EAT</span>
        </div>
      </div>
      
      <!-- Explore Column -->
      <div>
        <h3 class="font-semibold text-white/90 mb-4 uppercase tracking-wider text-xs">Explore</h3>
        <ul class="flex flex-col gap-2 text-sm text-white/60" role="list">
          <li><a href="index.html" class="hover:text-white transition-colors">Home</a></li>
          <li><a href="attractions.html" class="hover:text-white transition-colors">All Attractions</a></li>
          <li><a href="regions.html" class="hover:text-white transition-colors">Regions</a></li>
          <li><a href="about.html" class="hover:text-white transition-colors">About</a></li>
          <li><a href="sponsor.html" class="hover:text-white transition-colors">Sponsor</a></li>
        </ul>
      </div>
      
      <!-- Connect Column -->
      <div>
        <h3 class="font-semibold text-white/90 mb-4 uppercase tracking-wider text-xs">Connect</h3>
        <ul class="flex flex-col gap-2 text-sm text-white/60" role="list">
          <li><a href="https://github.com/xenohuru/xenohuru-web" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white transition-colors"><i data-lucide="github" class="w-4 h-4" aria-hidden="true"></i> GitHub</a></li>
          <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white transition-colors"><i data-lucide="twitter" class="w-4 h-4" aria-hidden="true"></i> Twitter</a></li>
          <li><a href="mailto:hello@tztourism.example" class="flex items-center gap-2 hover:text-white transition-colors"><i data-lucide="mail" class="w-4 h-4" aria-hidden="true"></i> Email</a></li>
        </ul>
      </div>
      
      <!-- Open Source Column -->
      <div>
        <h3 class="font-semibold text-white/90 mb-4 uppercase tracking-wider text-xs">Open Source</h3>
        <ul class="flex flex-col gap-2 text-sm text-white/60" role="list">
          <li><a href="about.html" class="hover:text-white transition-colors">Contributors</a></li>
          <li><a href="sponsor.html" class="hover:text-white transition-colors">Sponsor</a></li>
          <li><a href="https://cf89615f228bb45cc805447510de80.pythonanywhere.com/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">API Docs</a></li>
          <li><a href="https://github.com/xenohuru/xenohuru-web/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">License (MIT)</a></li>
        </ul>
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-sm">
      <p>&copy; <span id="current-year"></span> Xenohuru. Open source under MIT License.</p>
      <p class="swahili-quote text-white/30 text-xs">"Pole pole ndio mwendo" -- Slowly slowly is the way</p>
    </div>
  </div>
</footer>

<!-- BACK TO TOP BUTTON (universal) -->
<button id="back-to-top" class="fixed bottom-6 right-6 z-50 bg-tz-forest text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center opacity-0 pointer-events-none hover:bg-tz-forest/90 transition-all duration-300" aria-label="Back to top">
  <i data-lucide="arrow-up" class="w-5 h-5"></i>
</button>
```

---

## 5. KEY SECTION PATTERNS

### Hero Banner (used on index.html & page detail pages)
```html
<!-- FULL-HEIGHT HERO WITH PARALLAX -->
<section id="hero" class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-grain" aria-label="Hero banner">
  <!-- Background image (with parallax transform applied by JS) -->
  <img src="images/photo-1547036967-23d11aacaee0.jpg" alt="Serengeti savanna at golden hour" 
       class="absolute inset-0 w-full h-full object-cover object-center hero-parallax-img" 
       fetchpriority="high" />
  <!-- Dark overlay gradient -->
  <div class="hero-gradient absolute inset-0"></div>
  
  <!-- Content (relative z-10) -->
  <div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
    <p class="swahili-quote text-tz-savanna text-base sm:text-lg mb-2 opacity-90" data-aos="fade-down" data-aos-delay="50">
      <span>"Hakuna Matata"</span>
    </p>
    <p class="font-mono text-white/60 uppercase tracking-widest text-xs mb-6" data-aos="fade-down" data-aos-delay="100">
      Discover Tanzania
    </p>
    <h1 class="font-display text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.05] mb-6" data-aos="fade-up" data-aos-delay="200">
      Explore the Wild<br class="hidden sm:block" /> Heart of Africa
    </h1>
    <p class="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="300">
      From the snows of Kilimanjaro to the turquoise shores of Zanzibar -- safari, hiking, cultural tours and more.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
      <a href="attractions.html" class="inline-flex items-center justify-center gap-2 bg-tz-savanna text-white font-semibold px-8 py-4 rounded-full hover:bg-tz-savanna/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base">
        <i data-lucide="compass" class="w-5 h-5" aria-hidden="true"></i>
        Browse Attractions
      </a>
      <a href="regions.html" class="inline-flex items-center justify-center gap-2 border-2 border-white/80 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all text-base">
        Explore Regions
        <i data-lucide="arrow-right" class="w-5 h-5" aria-hidden="true"></i>
      </a>
    </div>
  </div>
  
  <!-- Scroll indicator pulse animation -->
  <a href="#stats" class="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors" aria-label="Scroll down">
    <i data-lucide="chevrons-down" class="w-7 h-7"></i>
  </a>
</section>
```

### Page Hero (shorter, used on detail pages like about.html)
```html
<!-- SHORTER PAGE HERO -->
<section class="relative flex flex-col items-center justify-center overflow-hidden" style="height: 280px;" aria-label="Page hero">
  <img src="images/photo-1516026672322-bc52d61a55d5.jpg" alt="Community and culture in Tanzania" 
       class="absolute inset-0 w-full h-full object-cover object-center" fetchpriority="high" />
  <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
  <div class="relative z-10 text-center text-white px-4">
    <p class="font-mono text-tz-savanna uppercase tracking-widest text-sm mb-3">Open Source Project</p>
    <h1 class="font-display text-4xl sm:text-5xl font-black leading-tight mb-3 text-balance">About Xenohuru</h1>
    <p class="text-white/80 text-base sm:text-lg mb-4 text-pretty">Built by the community, for the curious</p>
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb">
      <ol class="flex items-center justify-center gap-1.5 text-sm text-white/60">
        <li><a href="index.html" class="hover:text-white transition-colors">Home</a></li>
        <li aria-hidden="true"><i data-lucide="chevron-right" class="inline w-3 h-3"></i></li>
        <li class="text-white/90" aria-current="page">About</li>
      </ol>
    </nav>
  </div>
</section>
```

### Stats Section (horizontal stat cards)
```html
<!-- STATS BAR -->
<section id="stats" class="bg-tz-forest text-white relative overflow-hidden" aria-label="Key statistics">
  <div class="cta-pattern absolute inset-0"></div>
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <dl class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="stat-item" data-aos="fade-up">
        <dt class="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">Attractions</dt>
        <dd class="stat-number text-4xl sm:text-5xl font-display font-bold" data-count="12">0</dd>
        <span class="text-white/40 text-xs">+</span>
      </div>
      <div class="stat-item" data-aos="fade-up" data-aos-delay="100">
        <dt class="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">Regions</dt>
        <dd class="stat-number text-4xl sm:text-5xl font-display font-bold" data-count="3">0</dd>
      </div>
      <!-- More stats... -->
    </dl>
  </div>
</section>
```

### Text Section with 2-Column Cards
```html
<!-- Mission Section -->
<section class="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up">
  <div class="text-center mb-16">
    <h2 class="font-display text-3xl sm:text-4xl font-bold text-tz-dark mb-6 text-balance">What is Xenohuru?</h2>
    <p class="text-tz-muted text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
      Xenohuru is a free, open-source Progressive Web App (PWA) that showcases all the tourist attractions found in Tanzania.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100" data-aos="fade-up">
      <div class="w-12 h-12 rounded-xl bg-tz-forest/10 flex items-center justify-center mb-4">
        <i data-lucide="target" class="w-6 h-6 text-tz-forest"></i>
      </div>
      <h3 class="font-display text-xl font-bold text-tz-dark mb-3">Our Mission</h3>
      <p class="text-tz-muted leading-relaxed text-pretty">
        To make Tanzania's incredible tourism information freely accessible to everyone.
      </p>
    </div>
    <!-- More cards... -->
  </div>
</section>
```

---

## 6. COLOR VARIABLES & TAILWIND USAGE

### Primary Color Palette
```
tz-forest:  #1A4731  → Primary green (buttons, accents, dark backgrounds)
tz-savanna: #C8903A  → Gold/tan accent (highlights, featured badges)
tz-sky:     #1E6FA8  → Blue secondary
tz-sand:    #F5E6C8  → Light background, light sections
tz-earth:   #8B5E3C  → Brown, secondary accent
tz-dark:    #111827  → Near black, text
tz-muted:   #6B7280  → Gray, secondary text
tz-light:   #FAFAF8  → Off-white, body background
```

### Tailwind Classes Used Throughout
```
Text Colors:
- text-tz-dark       → Headlines
- text-tz-muted      → Secondary text
- text-white/70      → Reduced opacity white
- text-tz-savanna    → Accent text (gold)

Backgrounds:
- bg-tz-light        → Body background
- bg-tz-forest       → Dark sections
- bg-tz-sand/40      → Light background sections
- bg-white           → White cards
- bg-tz-forest/10    → Tinted background (for icons)

Buttons:
- bg-tz-forest text-white                    → Primary CTA
- bg-tz-savanna text-white                   → Featured CTA
- border-2 border-tz-dark text-tz-dark      → Secondary outline

Common Patterns:
- rounded-2xl        → Card corners (16px)
- rounded-full       → Pill buttons
- rounded-xl         → Smaller elements (12px)
- shadow-sm          → Subtle shadow
- shadow-lg          → Bigger shadow
- border border-gray-100                    → Subtle border
```

---

## 7. CSS CLASSES FOR COMMON PATTERNS

From `styles.css`, these are the key custom styles:

### Skeleton Loaders (during loading)
```css
.skeleton-img {
  /* Shimmer animation for image placeholders */
}

.skeleton {
  /* Shimmer for content placeholders */
}
```

### Cards & Hover Effects
```css
.attraction-card {
  /* Hover: translateY(-6px), shadow lift, shimmer shine effect */
}

.contributor-card {
  /* Hover: translateY(-4px) */
}

.operator-card, .partner-card {
  /* Hover: translateY(-4px) */
}
```

### Badges
```css
.featured-badge              /* Gold gradient, white text */
.badge-easy/moderate/etc.    /* Difficulty levels */
.badge-category              /* Blue light background */
.sponsor-badge               /* Gold tinted, hover lift */
.tech-badge                  /* White bg, subtle shadow */
```

### Forms
```css
.form-input:focus {
  /* Border: tz-forest, box-shadow: tz-forest 3px rgba */
}

.form-input-error {
  /* Border: red, box-shadow: red */
}

.feedback-success {
  /* Green gradient bg, slide down animation */
}
```

### Animations
```css
@keyframes shimmer    /* Background position slide - 1.6s */
@keyframes fadeUp     /* Opacity + translateY(20px) */
@keyframes float      /* translateY(-8px) bounce */
@keyframes countUp    /* Counter animation */
```

---

## 8. JAVASCRIPT INTEGRATION

### Global Script (scripts.js)
Runs on EVERY page. Handles:
- Image error fallback (placeholder swap)
- Lucide icons initialization
- AOS (Animate On Scroll) init
- Preloader hide
- Navbar scroll detection (glassmorphism)
- Mobile menu toggle
- Active nav link detection
- Back to top button
- Current year injection
- Tanzania time display (EAT, UTC+3)
- Stat counter animations
- Hero parallax
- Swahili proverb rotation
- Image reveal on scroll
- Language switcher

### Page-Specific Scripts
```javascript
// home.js    → index.html (featured carousel, region grid)
// about.js   → about.html (contributors grid from API)
// attractions.js → attractions.html (filter, grid, search)
// regions.js    → regions.html (region cards)
// attraction.js  → attraction.html (detail page)
// weather.js     → weather.html (live weather)
// search.js      → search.html (search results)
// contributors.js → contributors list
```

### API Service (api.js)
- Tries live Django REST API first
- Falls back to MOCK_DATA if API unreachable
- All endpoints: regions, attractions, weather, blog, operators, partners, feedback, contributors, auth

### Placeholder Service (placeholder.js)
```javascript
imgPlaceholder(label)        → SVG data-URI placeholder
heroBannerPlaceholder(label) → Wider placeholder
skeletonImgHTML(classes)     → <div class="skeleton-img"> HTML
initImageErrorHandling()     → Global error handler
errorStateHTML(config)       → Error card HTML
emptyStateHTML(config)       → Empty state card HTML
```

---

## 9. FORM PATTERNS

### Feedback/Contact Form (used on feedback pages)
```html
<form id="feedback-form" class="max-w-2xl mx-auto space-y-6">
  <div>
    <label for="feedback-name" class="block text-sm font-semibold text-tz-dark mb-2">Your Name</label>
    <input type="text" id="feedback-name" name="name" required 
           class="w-full form-input px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-tz-forest" />
  </div>
  
  <div>
    <label for="feedback-email" class="block text-sm font-semibold text-tz-dark mb-2">Email Address</label>
    <input type="email" id="feedback-email" name="email" required 
           class="w-full form-input px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-tz-forest" />
  </div>
  
  <div>
    <label for="feedback-message" class="block text-sm font-semibold text-tz-dark mb-2">Message</label>
    <textarea id="feedback-message" name="message" rows="5" required 
              class="w-full form-input px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-tz-forest" ></textarea>
  </div>
  
  <button type="submit" class="w-full bg-tz-forest text-white font-semibold py-3 rounded-xl hover:bg-tz-forest/90 transition-colors">
    Send Feedback
  </button>
</form>

<!-- Success message (hidden initially) -->
<div id="feedback-success" class="feedback-success hidden">
  <i data-lucide="check-circle" class="w-5 h-5 text-green-600" aria-hidden="true"></i>
  <div>
    <p class="font-semibold text-green-800">Thank you for your feedback!</p>
    <p class="text-sm text-green-700">We appreciate your input and will review it shortly.</p>
  </div>
</div>
```

---

## 10. DATA ATTRIBUTES FOR ANIMATIONS & INTERACTIVITY

### AOS (Animate On Scroll)
```html
data-aos="fade-up"              <!-- Fade in + slide up -->
data-aos="fade-down"            <!-- Fade in + slide down -->
data-aos-delay="50"             <!-- Stagger timing -->
data-aos-delay="100"
data-aos-delay="200"
...
```

### Dynamic Content
```html
data-count="12"                 <!-- Animated counter -->
data-fallback="placeholder"     <!-- Image error handler -->
data-i18n="hero_title"          <!-- Translation key (future i18n) -->
```

---

## 11. RESPONSIVE BREAKPOINTS

Tailwind v4 used throughout:
```
sm:  640px  (tablets)
md:  768px  (tablets+)
lg:  1024px (desktops)
xl:  1280px (large desktops)
```

Common patterns:
```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block"></div>

<!-- Full width on mobile, grid on desktop -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-8"></div>

<!-- Responsive text sizes -->
<h1 class="text-3xl sm:text-4xl lg:text-5xl"></h1>

<!-- Responsive padding -->
<div class="px-4 sm:px-6 lg:px-8"></div>
```

---

## 12. ACCESSIBILITY (a11y)

Required on all pages:
- `lang="en"` or `lang="sw"` on `<html>`
- `aria-label` on navigation links
- `aria-hidden="true"` on decorative elements
- `aria-current="page"` on active nav
- `aria-expanded="false"` on menu toggle
- `aria-labelledby=""` on sections with headings
- Focus rings: `focus-visible` with blue outline
- Skip to content link (sr-only on home, visible on focus)
- Semantic HTML: `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`
- Icon labels: `aria-hidden="true"` on Lucide icons
- Form labels: associated via `for=""` attribute

---

## 13. PWA & PERFORMANCE

### Service Worker (sw.js)
- Network first, cache fallback strategy
- Offline support
- Icon cache via manifest.json

### Manifest (manifest.json)
```json
{
  "name": "Xenohuru",
  "short_name": "Xenohuru",
  "description": "Explore Tanzania...",
  "icons": [
    { "src": "images/favicons/web-app-manifest-192x192.png", "sizes": "192x192" },
    { "src": "images/favicons/web-app-manifest-512x512.png", "sizes": "512x512" }
  ],
  "theme_color": "#1A4731",
  "background_color": "#FAFAF8",
  "start_url": "index.html",
  "display": "standalone"
}
```

### Meta Tags (on every page)
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="[PAGE]" />
<meta name="keywords" content="[PAGE]" />
<meta property="og:title" content="[PAGE] — Xenohuru" />
<meta property="og:description" content="[PAGE]" />
<meta property="og:image" content="images/[IMAGE]" />
<meta name="theme-color" content="#1A4731" />
```

---

## 14. IMAGE ASSET LOCATIONS

- **Hero images**: `/images/photo-*.jpg` (25 stock photos)
- **Favicon**: `/images/favicons/favicon.svg`, `.ico`, `.png`
- **Web app icons**: `/images/favicons/web-app-manifest-*.png`
- **Apple touch icon**: `/images/favicons/apple-touch-icon.png`
- **Logo**: `/images/xenohuru-logo.svg`

All images use `fetchpriority="high"` on hero images.
All images with data-fallback="placeholder" trigger auto-placeholder on error.

---

## 15. QUICK CHECKLIST FOR NEW PAGES

When creating a new page (`newpage.html`):

- [ ] Copy meta tags from about.html, customize
- [ ] Include all `<head>` styles (Tailwind theme, styles.css, fonts)
- [ ] Add preloader `<div class="preloader">`
- [ ] Add navbar (choose variant: hero or simple)
- [ ] Add mobile drawer & overlay
- [ ] Add `<main id="main-content">` wrapper
- [ ] Add page sections with `data-aos` animations
- [ ] Add footer (copy-paste, just update links if needed)
- [ ] Add back-to-top button
- [ ] Add script imports:
  - `aos.js`, `lucide`, `scripts.js` (defer)
  - Page-specific module: `<script type="module" src="js/newpage.js"></script>`
  - Service worker registration
- [ ] Create `/js/newpage.js` module if page has dynamic content
- [ ] Test on mobile (use responsive design mode)
- [ ] Check a11y (lighthouse, screen reader)
- [ ] Verify images have alt text & data-fallback
- [ ] Verify forms have proper labels & validation
- [ ] Test animations with `data-aos` triggers

---

## SUMMARY

This is a **premium, modern, accessible web application** built with:
- **Tailwind CSS v4** for utility styling + custom CSS overlays
- **JavaScript ES Modules** for code organization
- **PWA** with service worker offline support
- **REST API** backend with mock fallback
- **Glassmorphism** effects and smooth animations
- **Mobile-first responsive design**
- **Full accessibility** compliance
- **Tanzania theme** colors & imagery

All new pages should follow these exact patterns for consistency.
