import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('location-select');
    const loading = document.getElementById('weather-loading');
    const errorEl = document.getElementById('weather-error');
    const content = document.getElementById('weather-content');
    const retryBtn = document.getElementById('retry-btn');

    const forecastGrid = document.getElementById('forecast-grid');
    const seasonalGrid = document.getElementById('seasonal-grid');
    const locationLabel = document.getElementById('forecast-location-label');

    let currentSlug = 'all';

    // Map WMO Weather codes to Lucide icons + colors
    const weatherIcons = {
        0: { icon: 'sun', color: 'text-yellow-500' }, // Clear
        1: { icon: 'sun', color: 'text-yellow-500' }, // Mainly clear
        2: { icon: 'cloud-sun', color: 'text-gray-500' }, // Partly cloudy
        3: { icon: 'cloud', color: 'text-gray-500' }, // Overcast
        45: { icon: 'cloud-fog', color: 'text-gray-400' }, // Fog
        51: { icon: 'cloud-drizzle', color: 'text-blue-400' }, // Drizzle
        53: { icon: 'cloud-drizzle', color: 'text-blue-400' },
        61: { icon: 'cloud-rain', color: 'text-blue-500' }, // Rain
        63: { icon: 'cloud-rain', color: 'text-blue-500' },
        65: { icon: 'cloud-lightning', color: 'text-indigo-600' }, // Heavy rain
        80: { icon: 'cloud-showers-heavy', color: 'text-blue-500' },
        81: { icon: 'cloud-showers-heavy', color: 'text-blue-500' },
        95: { icon: 'cloud-lightning', color: 'text-indigo-600' } // Thunderstorm
    };

    const codeToDesc = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Foggy", 51: "Light drizzle", 53: "Moderate drizzle",
        61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        80: "Slight rain showers", 81: "Moderate rain showers",
        95: "Thunderstorm"
    };

    const getDayName = (dateStr, index) => {
        if (index === 0) return 'Today';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getMonthName = (m) => {
        const d = new Date();
        d.setMonth(m - 1);
        return d.toLocaleDateString('en-US', { month: 'long' });
    };

    // Populate drop-down
    async function loadLocations() {
        try {
            const regionsRes = await api.getRegions();
            const regions = regionsRes.status === 'fulfilled' ? regionsRes.value : [];

            const attractionsRes = await api.getAttractions();
            const attractions = attractionsRes.status === 'fulfilled' ? attractionsRes.value : [];

            const regionGroup = document.createElement('optgroup');
            regionGroup.label = "Regions";
            regions.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r.slug;
                opt.textContent = r.name;
                regionGroup.appendChild(opt);
            });

            const attractionGroup = document.createElement('optgroup');
            attractionGroup.label = "Attractions";
            attractions.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.slug;
                opt.textContent = a.name;
                attractionGroup.appendChild(opt);
            });

            select.appendChild(regionGroup);
            select.appendChild(attractionGroup);
        } catch (e) {
            console.warn("Could not load locations for dropdown", e);
        }
    }

    // Fetch & Render Weather
    async function loadWeather() {
        loading.classList.remove('hidden');
        errorEl.classList.add('hidden');
        content.classList.add('hidden');

        try {
            let forecast, seasonal;

            if (currentSlug === 'all') {
                // Fallback for general overview using the mock implementation via api.js
                // Even if we fetch a general pattern, we use the fallback forecast for demonstration
                forecast = await api.getWeatherForecast('');
                seasonal = await api.getGeneralSeasonalPatterns();
            } else {
                forecast = await api.getWeatherForecast(currentSlug);
                seasonal = await api.getSeasonalPatterns(currentSlug);
            }

            if (forecast.status === 'rejected' || seasonal.status === 'rejected') {
                throw new Error("Weather API Error");
            }

            renderForecast(forecast.value);
            renderSeasonal(seasonal.value);

            // Change label
            const optionText = select.options[select.selectedIndex].text;
            locationLabel.textContent = `Showing weather for ${optionText}`;

            loading.classList.add('hidden');
            content.classList.remove('hidden');
            if (window.lucide) window.lucide.createIcons();
        } catch (err) {
            console.error(err);
            loading.classList.add('hidden');
            errorEl.classList.remove('hidden');
        }
    }

    function renderForecast(data) {
        if (!data || !data.dates) {
            forecastGrid.innerHTML = `<p class="col-span-full text-center text-tz-muted py-8">No forecast data available.</p>`;
            return;
        }

        // Clear existing
        forecastGrid.innerHTML = '';

        for (let i = 0; i < data.dates.length; i++) {
            const date = data.dates[i];
            const maxT = data.temperature_max[i];
            const minT = data.temperature_min[i];
            const precip = data.precipitation[i];
            const code = data.weather_codes[i];

            const dayName = getDayName(date, i);
            const iconDef = weatherIcons[code] || { icon: 'cloud', color: 'text-gray-400' };
            const desc = codeToDesc[code] || "Unknown";

            const card = document.createElement('div');
            card.className = `bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 ${i === 0 ? 'ring-2 ring-tz-savanna bg-tz-savanna/5' : ''}`;

            card.innerHTML = `
            <span class="text-sm font-bold text-tz-dark uppercase tracking-wider mb-3">${dayName}</span>
            <i data-lucide="${iconDef.icon}" class="w-10 h-10 ${iconDef.color} mb-3" aria-hidden="true" title="${desc}"></i>
            <div class="flex items-center gap-3 mb-3">
                <span class="font-display font-bold text-lg text-tz-dark">${Math.round(maxT)}°</span>
                <span class="text-tz-muted text-sm font-medium">${Math.round(minT)}°</span>
            </div>
            <div class="flex items-center gap-1 mb-1 mt-auto">
                <i data-lucide="droplets" class="w-3 h-3 text-blue-400"></i>
                <span class="text-xs text-tz-muted font-medium">${precip} mm</span>
            </div>
            <span class="text-[10px] text-tz-muted/80 uppercase font-bold mt-2" title="${desc}">${desc.length > 15 ? desc.substring(0, 12) + '...' : desc}</span>
        `;
            forecastGrid.appendChild(card);
        }
    }

    function renderSeasonal(patterns) {
        if (!patterns || !patterns.length) {
            seasonalGrid.innerHTML = `<p class="col-span-full text-center text-tz-muted py-8">No seasonal data available.</p>`;
            return;
        }

        seasonalGrid.innerHTML = '';

        const themeMap = {
            'dry': { icon: 'sun', bg: 'bg-tz-savanna/10', color: 'text-tz-savanna' },
            'short_rain': { icon: 'cloud-drizzle', bg: 'bg-blue-50', color: 'text-blue-500' },
            'long_rain': { icon: 'cloud-rain', bg: 'bg-indigo-50', color: 'text-indigo-600' }
        };

        patterns.forEach((s) => {
            const theme = themeMap[s.season_type] || { icon: 'calendar', bg: 'bg-gray-100', color: 'text-gray-600' };

            const card = document.createElement('div');
            card.className = "bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow";

            card.innerHTML = `
            <div class="flex items-start justify-between mb-6">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center ${theme.bg} ${theme.color}">
                    <i data-lucide="${theme.icon}" class="w-6 h-6"></i>
                </div>
                <span class="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-tz-dark mt-1">
                    ${getMonthName(s.start_month)} – ${getMonthName(s.end_month)}
                </span>
            </div>
            <h3 class="font-display text-xl font-bold text-tz-dark mb-3">${s.season_display}</h3>
            <p class="text-tz-muted text-sm leading-relaxed flex-grow mb-6 text-pretty">${s.description}</p>
            
            <div class="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-100">
                <div>
                    <span class="text-xs text-tz-muted uppercase tracking-wider font-semibold block mb-1">Avg Temp</span>
                    <span class="font-display font-medium text-tz-dark">${s.avg_temperature}°C</span>
                </div>
                <div>
                    <span class="text-xs text-tz-muted uppercase tracking-wider font-semibold block mb-1">Avg Rainfall</span>
                    <span class="font-display font-medium text-tz-dark">${s.avg_rainfall} mm</span>
                </div>
            </div>
          `;
            seasonalGrid.appendChild(card);
        });
    }

    // Event Listeners
    select.addEventListener('change', (e) => {
        currentSlug = e.target.value;
        loadWeather();
    });

    retryBtn.addEventListener('click', loadWeather);

    // Initialize
    loadLocations().then(() => loadWeather());

});
