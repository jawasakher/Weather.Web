const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const state = {
    unit: localStorage.getItem("weather-unit") || "metric",
    language: localStorage.getItem("weather-language") || "en",
    city: localStorage.getItem("weather-city") || "London",
    data: null
};

const elements = {
    form: document.querySelector("#search-form"),
    input: document.querySelector("#city-input"),
    locationButton: document.querySelector("#location-button"),
    unitButton: document.querySelector("#unit-button"),
    languageButton: document.querySelector("#language-button"),
    favoritesButton: document.querySelector("#favorites-button"),
    favoritesPanel: document.querySelector("#favorites-panel"),
    favoritesList: document.querySelector("#favorites-list"),
    status: document.querySelector("#status-message"),
    dashboard: document.querySelector("#dashboard")
};

const translations = {
    en: {
        eyebrow: "Live weather intelligence",
        title: "Weather, made clear.",
        subtitle: "Know what the sky has planned for your day.",
        searchPlaceholder: "Search for a city...",
        search: "Search",
        useLocation: "Use my location",
        feelsLike: "Feels like",
        humidity: "Humidity",
        wind: "Wind",
        pressure: "Pressure",
        visibility: "Visibility",
        sunrise: "Sunrise",
        sunset: "Sunset",
        hourly: "Hourly forecast",
        daily: "5-day outlook",
        favorites: "Saved places",
        noFavorites: "Save a city to see it here.",
        loading: "Reading the sky...",
        invalid: "Please enter a city name.",
        notFound: "We could not find that city.",
        network: "Weather data is temporarily unavailable.",
        addFavorite: "Save place",
        removeFavorite: "Remove saved place",
        clear: "Clear",
        clouds: "Clouds",
        clearSky: "Clear sky",
        rain: "Rain",
        drizzle: "Drizzle",
        snow: "Snow",
        mist: "Mist",
        day: "Day",
        night: "Night"
    },
    ar: {
        eyebrow: "معلومات الطقس المباشرة",
        title: "الطقس بوضوح.",
        subtitle: "اعرف ما يخبئه لك الجو خلال يومك.",
        searchPlaceholder: "ابحث عن مدينة...",
        search: "بحث",
        useLocation: "استخدم موقعي",
        feelsLike: "المحسوسة",
        humidity: "الرطوبة",
        wind: "الرياح",
        pressure: "الضغط",
        visibility: "الرؤية",
        sunrise: "الشروق",
        sunset: "الغروب",
        hourly: "توقعات الساعات",
        daily: "توقعات 5 أيام",
        favorites: "الأماكن المحفوظة",
        noFavorites: "احفظ مدينة لتظهر هنا.",
        loading: "نقرأ حالة السماء...",
        invalid: "أدخل اسم مدينة صحيحًا.",
        notFound: "لم نعثر على هذه المدينة.",
        network: "بيانات الطقس غير متاحة مؤقتًا.",
        addFavorite: "حفظ المكان",
        removeFavorite: "إزالة المكان",
        clear: "صافٍ",
        clouds: "غائم",
        clearSky: "سماء صافية",
        rain: "ممطر",
        drizzle: "رذاذ",
        snow: "ثلوج",
        mist: "ضباب",
        day: "نهار",
        night: "ليل"
    }
};

function t(key) {
    return translations[state.language][key] || key;
}

function unitSymbol() {
    return state.unit === "metric" ? "°C" : "°F";
}

function speedUnit() {
    return state.unit === "metric" ? "km/h" : "mph";
}

function formatTemperature(value) {
    return `${Math.round(value)}${unitSymbol()}`;
}

function formatTime(timestamp, timezone) {
    return new Intl.DateTimeFormat(state.language, {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC"
    }).format(new Date((timestamp + timezone) * 1000));
}

function formatDay(timestamp, timezone) {
    return new Intl.DateTimeFormat(state.language, {
        weekday: "short",
        timeZone: "UTC"
    }).format(new Date((timestamp + timezone) * 1000));
}

function weatherLabel(main) {
    const labels = {
        Clear: "clearSky", Clouds: "clouds", Rain: "rain", Drizzle: "drizzle",
        Snow: "snow", Mist: "mist", Haze: "mist", Fog: "mist"
    };
    return t(labels[main] || "clouds");
}

function weatherIcon(main, isNight = false) {
    const icons = {
        Clear: isNight ? "clear.png" : "clear.png",
        Clouds: "clouds.png",
        Rain: "rain.png",
        Drizzle: "drizzle.png",
        Snow: "snow.png",
        Mist: "mist.png",
        Haze: "mist.png",
        Fog: "mist.png"
    };
    return icons[main] || "clouds.png";
}

function weatherMain(code) {
    if (code === 0 || code === 1) return "Clear";
    if (code === 2 || code === 3) return "Clouds";
    if (code >= 45 && code <= 48) return "Mist";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain";
    if (code >= 95) return "Rain";
    return "Clouds";
}

function unixTime(localDate, timezone) {
    return Math.floor(Date.parse(`${localDate}T12:00:00Z`) / 1000) - timezone;
}

function hourlyUnixTime(localDateTime, timezone) {
    return Math.floor(Date.parse(`${localDateTime}:00Z`) / 1000) - timezone;
}

async function fetchWeather(latitude, longitude, location) {
    const unitParams = state.unit === "metric"
        ? "temperature_unit=celsius&wind_speed_unit=kmh"
        : "temperature_unit=fahrenheit&wind_speed_unit=mph";
    const url = `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,visibility,wind_speed_10m,is_day&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&${unitParams}&timezone=auto&forecast_days=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("network");
    const data = await response.json();
    const timezone = data.utc_offset_seconds;
    const current = {
        name: location.name,
        sys: { country: location.country_code, sunrise: Math.floor(Date.parse(data.daily.sunrise[0]) / 1000) - timezone, sunset: Math.floor(Date.parse(data.daily.sunset[0]) / 1000) - timezone },
        dt: Math.floor(Date.now() / 1000),
        timezone,
        main: { temp: data.current.temperature_2m, feels_like: data.current.apparent_temperature, humidity: data.current.relative_humidity_2m, pressure: Math.round(data.current.pressure_msl) },
        wind: { speed: data.current.wind_speed_10m },
        visibility: data.current.visibility,
        weather: [{ main: weatherMain(data.current.weather_code) }]
    };
    const forecast = {
        city: { timezone },
        list: data.hourly.time.slice(0, 24).map((time, index) => ({ dt: hourlyUnixTime(time, timezone), main: { temp: data.hourly.temperature_2m[index] }, weather: [{ main: weatherMain(data.hourly.weather_code[index]) }] })),
        daily: data.daily.time.map((time, index) => ({ dt: unixTime(time, timezone), temp_max: data.daily.temperature_2m_max[index], temp_min: data.daily.temperature_2m_min[index], main: weatherMain(data.daily.weather_code[index]) }))
    };
    return { current, forecast };
}

async function getWeather(city) {
    const query = encodeURIComponent(city.trim());
    const response = await fetch(`${GEOCODING_API}?name=${query}&count=1&language=${state.language}&format=json`);
    if (!response.ok) throw new Error("network");
    const result = await response.json();
    if (!result.results?.length) throw new Error("not-found");
    const location = result.results[0];
    return fetchWeather(location.latitude, location.longitude, location);
}

function setStatus(message, type = "info") {
    elements.status.textContent = message;
    elements.status.className = `status ${type}`;
    elements.status.hidden = !message;
}

function renderCurrent(current) {
    const main = current.weather[0].main;
    const isNight = current.dt < current.sys.sunrise || current.dt > current.sys.sunset;
    document.querySelector("#weather-icon").src = weatherIcon(main, isNight);
    document.querySelector("#weather-icon").alt = weatherLabel(main);
    document.querySelector("#condition").textContent = weatherLabel(main);
    document.querySelector("#temperature").textContent = formatTemperature(current.main.temp);
    document.querySelector("#feels-like").textContent = `${t("feelsLike")} ${formatTemperature(current.main.feels_like)}`;
    document.querySelector("#city-name").textContent = current.name;
    document.querySelector("#country-name").textContent = current.sys.country;
    document.querySelector("#humidity").textContent = `${current.main.humidity}%`;
    document.querySelector("#wind").textContent = `${Math.round(current.wind.speed * (state.unit === "metric" ? 3.6 : 1))} ${speedUnit()}`;
    document.querySelector("#pressure").textContent = `${current.main.pressure} hPa`;
    document.querySelector("#visibility").textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.querySelector("#sunrise").textContent = formatTime(current.sys.sunrise, current.timezone);
    document.querySelector("#sunset").textContent = formatTime(current.sys.sunset, current.timezone);
    document.querySelector("#updated").textContent = `${t("day")} · ${formatTime(current.dt, current.timezone)}`;
}

function renderForecast(forecast) {
    const hourly = forecast.list.slice(0, 8);
    document.querySelector("#hourly-list").innerHTML = hourly.map(item => `
        <article class="hour-item">
            <time>${formatTime(item.dt, forecast.city.timezone)}</time>
            <img src="${weatherIcon(item.weather[0].main)}" alt="${weatherLabel(item.weather[0].main)}">
            <strong>${formatTemperature(item.main.temp)}</strong>
            <span>${weatherLabel(item.weather[0].main)}</span>
        </article>
    `).join("");

    document.querySelector("#daily-list").innerHTML = forecast.daily.map(item => `
        <article class="day-item">
            <time>${formatDay(item.dt, forecast.city.timezone)}</time>
            <img src="${weatherIcon(item.main)}" alt="${weatherLabel(item.main)}">
            <div><strong>${formatTemperature(item.temp_max)}</strong><span>${formatTemperature(item.temp_min)}</span></div>
            <span>${weatherLabel(item.main)}</span>
        </article>
    `).join("");
}

function favorites() {
    return JSON.parse(localStorage.getItem("weather-favorites") || "[]");
}

function renderFavorites() {
    const saved = favorites();
    elements.favoritesList.innerHTML = saved.length ? saved.map(city => `
        <button class="favorite-item" type="button" data-city="${city}">${city}</button>
    `).join("") : `<p class="empty-favorites">${t("noFavorites")}</p>`;
    elements.favoritesList.querySelectorAll("[data-city]").forEach(button => {
        button.addEventListener("click", () => loadCity(button.dataset.city));
    });
}

function saveFavorite() {
    const saved = favorites();
    if (!saved.includes(state.city)) {
        localStorage.setItem("weather-favorites", JSON.stringify([state.city, ...saved].slice(0, 6)));
        renderFavorites();
        setStatus(`${state.city} · ${t("addFavorite")}`, "success");
    }
}

async function loadCity(city) {
    const cleanCity = city.trim();
    if (!cleanCity) {
        setStatus(t("invalid"), "error");
        return;
    }
    setStatus(t("loading"), "loading");
    elements.dashboard.setAttribute("aria-busy", "true");
    try {
        const data = await getWeather(cleanCity);
        state.city = data.current.name;
        state.data = data;
        localStorage.setItem("weather-city", state.city);
        elements.input.value = state.city;
        renderCurrent(data.current);
        renderForecast(data.forecast);
        renderFavorites();
        setStatus("");
    } catch (error) {
        setStatus(error.message === "not-found" ? t("notFound") : t("network"), "error");
    } finally {
        elements.dashboard.setAttribute("aria-busy", "false");
    }
}

function updateLanguage() {
    document.documentElement.lang = state.language;
    document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });
    elements.input.placeholder = t("searchPlaceholder");
    elements.languageButton.textContent = state.language === "en" ? "عربي" : "EN";
    if (state.data) {
        renderCurrent(state.data.current);
        renderForecast(state.data.forecast);
    }
    renderFavorites();
}

elements.form.addEventListener("submit", event => {
    event.preventDefault();
    loadCity(elements.input.value);
});

elements.unitButton.addEventListener("click", () => {
    state.unit = state.unit === "metric" ? "imperial" : "metric";
    localStorage.setItem("weather-unit", state.unit);
    elements.unitButton.textContent = state.unit === "metric" ? "°C" : "°F";
    loadCity(state.city);
});

elements.languageButton.addEventListener("click", () => {
    state.language = state.language === "en" ? "ar" : "en";
    localStorage.setItem("weather-language", state.language);
    updateLanguage();
});

elements.favoritesButton.addEventListener("click", () => {
    const isHidden = elements.favoritesPanel.hidden;
    elements.favoritesPanel.hidden = !isHidden;
    elements.favoritesButton.setAttribute("aria-expanded", String(isHidden));
});

elements.locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        setStatus(t("network"), "error");
        return;
    }
    setStatus(t("loading"), "loading");
    navigator.geolocation.getCurrentPosition(
        position => loadCoordinates(position.coords.latitude, position.coords.longitude),
        () => setStatus(t("network"), "error")
    );
});

async function loadCoordinates(latitude, longitude) {
    setStatus(t("loading"), "loading");
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        if (!response.ok) throw new Error("network");
        const location = await response.json();
        const address = location.address || {};
        const city = address.city || address.town || address.village || address.county;
        if (!city) throw new Error("network");
        const data = await fetchWeather(latitude, longitude, { name: city, country_code: address.country_code?.toUpperCase() || "" });
        state.city = data.current.name;
        state.data = data;
        localStorage.setItem("weather-city", state.city);
        elements.input.value = state.city;
        renderCurrent(data.current);
        renderForecast(data.forecast);
        renderFavorites();
        setStatus("");
    } catch {
        setStatus(t("network"), "error");
    }
}

document.querySelector("#save-button").addEventListener("click", saveFavorite);

elements.unitButton.textContent = state.unit === "metric" ? "°C" : "°F";
updateLanguage();
loadCity(state.city);
