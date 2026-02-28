# 🌍 Xenohuru Web

> Progressive Web App (PWA) for exploring Tanzania's tourist attractions with interactive maps, real-time weather, and offline support.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8.svg)](manifest.json)
[![OpenStreetMap](https://img.shields.io/badge/Maps-OpenStreetMap-7EBC6F.svg)](https://www.openstreetmap.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Made in Tanzania](https://img.shields.io/badge/Made%20in-Tanzania-green.svg)](#)

**Live App:** https://xenohuru.netlify.app/ | **Backend API:** [xenohuru-api](https://github.com/Xenohuru/xenohuru-api) | **Sponsor Us:** [Ko-fi](https://ko-fi.com/xenohuru)

---

## About

Xenohuru Web is a pure HTML/CSS/JavaScript Progressive Web App that connects to the **Xenohuru REST API** (Django). No build step required — open any `.html` file or serve the folder with any static server.

From Kilimanjaro to Zanzibar — explore Tanzania's wonders completely free and open source.

---

## Project Structure

```
xenohuru-web/
├── index.html           # Home page
├── attractions.html     # Browse attractions
├── attraction.html      # Attraction detail with map & weather
├── regions.html         # Browse regions
├── about.html           # About & contributors
├── sponsor.html         # Sponsor the project
├── css/
│   └── styles.css       # Custom styles
├── js/
│   ├── api.js           # API client
│   ├── home.js          # Home page logic
│   ├── attraction.js    # Attraction detail + OSM map
│   ├── attractions.js   # Attractions listing
│   ├── about.js         # Contributors loader
│   └── scripts.js       # Utilities
├── images/              # Static assets & PWA icons
├── manifest.json        # PWA manifest
└── sw.js                # Service worker
```

---

## Quick Start

```bash
git clone https://github.com/Xenohuru/xenohuru-web.git
cd xenohuru-web

# Serve with any static server (no build needed)
npx serve .
# or
python3 -m http.server 8080
```

**Opens at:** `http://localhost:8080`

> **API:** Configure `js/api.js` to point to your backend API.

---

## Tech Stack

- **Markup:** Semantic HTML5
- **Styles:** Tailwind CSS v4 + custom CSS
- **Scripts:** Vanilla JavaScript (ES2020+)
- **Maps:** OpenStreetMap (no API key)
- **Weather:** Open-Meteo API (free)
- **Gallery:** Splide.js carousel
- **PWA:** Service Worker + Web App Manifest
- **Backend:** Xenohuru REST API (Django)

---

## Features

- Attraction gallery with slideshow
- Real-time weather data
- Interactive OpenStreetMap with GPS pins
- Region browsing & search
- Share attractions (Web Share API)
- PWA — installable & works offline
- Responsive & accessible design

---

## Contributing

We welcome contributions! See [CONTRIBUTORS.md](CONTRIBUTORS.md).

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add feature"`
4. Push & open a Pull Request

---

## License

MIT License — Free to use, modify, and distribute. See [LICENSE](LICENSE).

---

**🌍 Xenohuru Web — Explore Tanzania | 🇹🇿 Made with love | ❤️ Support us on [Ko-fi](https://ko-fi.com/xenohuru)**
