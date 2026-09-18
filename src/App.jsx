"use client";

import React, { useEffect, useState } from "react";
import { getWeather, getWeatherAtLocation } from "./weatherApi";
import clearIcon from "./assets/clear.png";
import cloudsIcon from "./assets/clouds.png";
import drizzleIcon from "./assets/drizzle.png";
import mistIcon from "./assets/mist.png";
import rainIcon from "./assets/rain.png";
import searchIcon from "./assets/search.png";
import snowIcon from "./assets/snow.png";

const translations = {
    en: { eyebrow: "Live weather intelligence", title: "Weather, made clear.", subtitle: "Know what the sky has planned for your day.", searchPlaceholder: "Search for a city...", search: "Search", useLocation: "Use my location", feelsLike: "Feels like", humidity: "Humidity", wind: "Wind", pressure: "Pressure", visibility: "Visibility", sunrise: "Sunrise", sunset: "Sunset", hourly: "Hourly forecast", daily: "5-day outlook", windChart: "Wind trend", interactiveMap: "Interactive map", reorderHint: "Drag to reorder", smartEyebrow: "Smart weather advice", smartLoading: "Planning your day...", smartLoadingCopy: "We are reading the forecast to give you a useful recommendation.", rainAdviceTitle: "Keep an umbrella close", rainAdviceCopy: "Rain is likely soon. Outdoor plans are better with a little cover.", windAdviceTitle: "A breezy day ahead", windAdviceCopy: "Strong wind is expected. Choose a sheltered route for outdoor plans.", hotAdviceTitle: "Plan around the heat", hotAdviceCopy: "Temperatures are high. Schedule activity earlier or later and keep water nearby.", coldAdviceTitle: "Wrap up for the outdoors", coldAdviceCopy: "It is a cold day. A warm layer will make time outside more comfortable.", clearAdviceTitle: "Great day to get outside", clearAdviceCopy: "Conditions look comfortable. It is a good window for walking or outdoor plans.", moderateAdviceTitle: "A changeable day", moderateAdviceCopy: "Conditions are mixed. Check the hourly forecast before heading out.", airQuality: "Air quality", uvIndex: "UV index", rainAlert: "Weather alert", outdoorWindow: "Best time outside", temperatureChart: "Temperature trend", aqiGood: "Good", aqiFair: "Fair", aqiPoor: "Poor", noRain: "No significant rain expected", severeAlert: "Severe weather possible", outdoorGood: "Best window for outdoor plans", outdoorAvoid: "Consider staying indoors", favorites: "Saved places", noFavorites: "Save a city to see it here.", loading: "Reading the sky...", invalid: "Please enter a city name.", notFound: "We could not find that city.", network: "Weather data is temporarily unavailable.", addFavorite: "Save place", clear: "Clear", clouds: "Clouds", clearSky: "Clear sky", rain: "Rain", drizzle: "Drizzle", snow: "Snow", mist: "Mist", day: "Day" },
    ar: { eyebrow: "معلومات الطقس المباشرة", title: "الطقس بوضوح.", subtitle: "اعرف ما يخبئه لك الجو خلال يومك.", searchPlaceholder: "ابحث عن مدينة...", search: "بحث", useLocation: "استخدم موقعي", feelsLike: "المحسوسة", humidity: "الرطوبة", wind: "الرياح", pressure: "الضغط", visibility: "الرؤية", sunrise: "الشروق", sunset: "الغروب", hourly: "توقعات الساعات", daily: "توقعات 5 أيام", windChart: "منحنى الرياح", interactiveMap: "الخريطة التفاعلية", reorderHint: "اسحب لإعادة الترتيب", smartEyebrow: "نصيحة الطقس الذكية", smartLoading: "نخطط ليومك...", smartLoadingCopy: "نقرأ التوقعات لنقدم لك توصية مفيدة.", rainAdviceTitle: "ضع مظلة بقربك", rainAdviceCopy: "من المتوقع هطول المطر قريبًا. خططك الخارجية أفضل مع مظلة.", windAdviceTitle: "يوم عاصف قادم", windAdviceCopy: "الرياح قوية نسبيًا. اختر طريقًا محميًا عند الخروج.", hotAdviceTitle: "خطط حول ارتفاع الحرارة", hotAdviceCopy: "الحرارة مرتفعة. مارس نشاطك في الصباح أو المساء واشرب الماء.", coldAdviceTitle: "ارتدِ طبقة دافئة", coldAdviceCopy: "الجو بارد اليوم. الملابس الدافئة ستجعل وقتك في الخارج أكثر راحة.", clearAdviceTitle: "يوم رائع للخروج", clearAdviceCopy: "الظروف مريحة. الوقت مناسب للمشي أو للنشاطات الخارجية.", moderateAdviceTitle: "يوم متقلب", moderateAdviceCopy: "الظروف متغيرة. راجع توقعات الساعات قبل الخروج.", airQuality: "جودة الهواء", uvIndex: "مؤشر الأشعة فوق البنفسجية", rainAlert: "تنبيه الطقس", outdoorWindow: "أفضل وقت للخروج", temperatureChart: "منحنى الحرارة", aqiGood: "جيدة", aqiFair: "متوسطة", aqiPoor: "ضعيفة", noRain: "لا يتوقع هطول مهم", severeAlert: "احتمال طقس قاسٍ", outdoorGood: "هذا أفضل وقت للنشاط الخارجي", outdoorAvoid: "يفضل البقاء في الداخل", favorites: "الأماكن المحفوظة", noFavorites: "احفظ مدينة لتظهر هنا.", loading: "نقرأ حالة السماء...", invalid: "أدخل اسم مدينة صحيحًا.", notFound: "لم نعثر على هذه المدينة.", network: "بيانات الطقس غير متاحة مؤقتًا.", addFavorite: "حفظ المكان", clear: "صافٍ", clouds: "غائم", clearSky: "سماء صافية", rain: "ممطر", drizzle: "رذاذ", snow: "ثلوج", mist: "ضباب", day: "نهار" }
};

const iconMap = { Clear: clearIcon.src, Clouds: cloudsIcon.src, Rain: rainIcon.src, Drizzle: drizzleIcon.src, Snow: snowIcon.src, Mist: mistIcon.src };
const labels = { Clear: "clearSky", Clouds: "clouds", Rain: "rain", Drizzle: "drizzle", Snow: "snow", Mist: "mist" };

function App() {
    const [unit, setUnit] = useState("metric");
    const [language, setLanguage] = useState("en");
    const [city, setCity] = useState("London");
    const [input, setInput] = useState("");
    const [data, setData] = useState(null);
    const [status, setStatus] = useState({ message: "", type: "info" });
    const [favoritesOpen, setFavoritesOpen] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [hydrated, setHydrated] = useState(false);
    const [draggedFavorite, setDraggedFavorite] = useState(null);

    const t = key => translations[language][key] || key;
    const temp = value => `${Math.round(value)}${unit === "metric" ? "°C" : "°F"}`;
    const formatTime = (timestamp, timezone) => new Intl.DateTimeFormat(language, { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date((timestamp + timezone) * 1000));
    const formatDay = (timestamp, timezone) => new Intl.DateTimeFormat(language, { weekday: "short", timeZone: "UTC" }).format(new Date((timestamp + timezone) * 1000));
    const weatherLabel = main => t(labels[main] || "clouds");
    const weatherIcon = main => iconMap[main] || cloudsIcon.src;

    async function loadCity(nextCity, options = {}) {
        const cleanCity = nextCity.trim();
        if (!cleanCity) return setStatus({ message: t("invalid"), type: "error" });
        setStatus({ message: t("loading"), type: "loading" });
        try {
            const result = await getWeather(cleanCity, language, unit);
            setData(result); setCity(result.current.name);
            if (!options.clearInput) setInput(result.current.name);
            setStatus({ message: "", type: "info" });
        } catch (error) { setStatus({ message: error.message === "not-found" ? t("notFound") : t("network"), type: "error" }); }
    }

    useEffect(() => {
        const savedUnit = localStorage.getItem("weather-unit");
        const savedLanguage = localStorage.getItem("weather-language");
        const savedFavorites = JSON.parse(localStorage.getItem("weather-favorites") || "[]");
        if (savedUnit) setUnit(savedUnit);
        if (savedLanguage) setLanguage(savedLanguage);
        setFavorites(savedFavorites);
        setHydrated(true);
    }, []);

    useEffect(() => {
        if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }, []);

    useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; }, [language]);
    useEffect(() => { if (hydrated) loadCity(city, { clearInput: true }); }, [hydrated]);

    function toggleLanguage() { const next = language === "en" ? "ar" : "en"; setLanguage(next); localStorage.setItem("weather-language", next); }
    function toggleUnit() { const next = unit === "metric" ? "imperial" : "metric"; setUnit(next); localStorage.setItem("weather-unit", next); loadCity(city); }
    function saveFavorite() { const next = [city, ...favorites.filter(item => item !== city)].slice(0, 6); setFavorites(next); localStorage.setItem("weather-favorites", JSON.stringify(next)); }
    function reorderFavorites(target) { if (!draggedFavorite || draggedFavorite === target) return; const next = [...favorites]; const from = next.indexOf(draggedFavorite); const to = next.indexOf(target); next.splice(from, 1); next.splice(to, 0, draggedFavorite); setFavorites(next); localStorage.setItem("weather-favorites", JSON.stringify(next)); setDraggedFavorite(null); }
    function useLocation() { navigator.geolocation?.getCurrentPosition(async ({ coords }) => { setStatus({ message: t("loading"), type: "loading" }); try { const result = await getWeatherAtLocation(coords.latitude, coords.longitude, unit); setData(result); setCity(result.current.name); setInput(result.current.name); setStatus({ message: "", type: "info" }); } catch { setStatus({ message: t("network"), type: "error" }); } }, () => setStatus({ message: t("network"), type: "error" })); }

    const current = data?.current;
    const forecast = data?.forecast;
    const smart = current && forecast ? getSmartAdvice(current, forecast, unit, t) : null;
    const outdoor = current && forecast ? getOutdoorWindow(forecast, unit, t, formatTime) : null;
    const backgroundWeather = current?.weather[0].main || "map";

    return <>
        <WeatherBackground weather={backgroundWeather} />
        <main className="app-shell">
        <header className="topbar"><a className="brand" href="./" aria-label="Skyline Weather home"><span className="brand-mark">S</span><span>Skyline</span></a><div className="top-actions"><button className="text-button" onClick={toggleLanguage}>{language === "en" ? "عربي" : "EN"}</button><button className="icon-button" onClick={toggleUnit}>{unit === "metric" ? "°C" : "°F"}</button><button className="icon-button" onClick={() => setFavoritesOpen(!favoritesOpen)} aria-expanded={favoritesOpen}>♡</button></div></header>
        <section className="intro"><div><p className="eyebrow">{t("eyebrow")}</p><h1>{t("title")}</h1><p className="intro-copy">{t("subtitle")}</p></div><form className="search-form" onSubmit={event => { event.preventDefault(); loadCity(input); }}><label className="sr-only" htmlFor="city-input">City name</label><input id="city-input" value={input} onChange={event => setInput(event.target.value)} placeholder={t("searchPlaceholder")} /><button className="search-button"><img src={searchIcon.src} alt="" /><span>{t("search")}</span></button></form></section>
        {status.message && <p className={`status ${status.type}`} role="status">{status.message}</p>}
        <section className="dashboard" aria-busy={status.type === "loading"}>
            {current && <><article className="hero-card"><div className="hero-heading"><div><p className="eyebrow">{t("day")} · {formatTime(current.dt, current.timezone)}</p><h2>{current.name}</h2><p className="country">{current.sys.country}</p></div><button className="save-button" onClick={saveFavorite}>{t("addFavorite")}</button></div><div className="current-weather"><img src={weatherIcon(current.weather[0].main)} alt={weatherLabel(current.weather[0].main)} /><div><p className="condition condition--large">{weatherLabel(current.weather[0].main)}</p><p className="temperature">{temp(current.main.temp)}</p><p className="feels-like">{t("feelsLike")} {temp(current.main.feels_like)}</p></div></div><div className="sun-times"><div><span className="sun-dot sunrise" /><span>{t("sunrise")}</span><strong>{formatTime(current.sys.sunrise, current.timezone)}</strong></div><div><span className="sun-dot sunset" /><span>{t("sunset")}</span><strong>{formatTime(current.sys.sunset, current.timezone)}</strong></div></div></article>
            <div className="metrics-grid"><Metric icon="◌" label={t("humidity")} value={`${current.main.humidity}%`} /><Metric icon="⌁" label={t("wind")} value={`${Math.round(current.wind.speed)} ${unit === "metric" ? "km/h" : "mph"}`} /><Metric icon="◉" label={t("pressure")} value={`${current.main.pressure} hPa`} /><Metric icon="⊙" label={t("visibility")} value={`${(current.visibility / 1000).toFixed(1)} km`} /></div>
            <div className="insight-grid"><InsightCard icon="◎" title={t("airQuality")} value={data.air.aqi === null ? "--" : `${data.air.aqi} · ${getAqiLabel(data.air.aqi, t)}`} detail={data.air.pm25 === null ? "" : `PM2.5 ${Math.round(data.air.pm25)} µg/m³`} /><InsightCard icon="☼" title={t("uvIndex")} value={current.uv.toFixed(1)} detail={current.uv >= 6 ? t("outdoorAvoid") : t("outdoorGood")} /><InsightCard icon="⚠" title={t("rainAlert")} value={current.severe ? t("severeAlert") : current.precipitationProbability > 40 ? `${current.precipitationProbability}%` : t("noRain")} detail={current.severe ? t("severeAlert") : t("rainAdviceCopy")} /></div>
            {smart && <article className="smart-card"><div className="smart-symbol">✦</div><div><p className="eyebrow">{t("smartEyebrow")}</p><h2>{smart.title}</h2><p>{smart.copy}</p></div></article>}
            {outdoor && <><article className="outdoor-card"><div><p className="eyebrow">{t("outdoorWindow")}</p><h2>{outdoor.good ? t("outdoorGood") : t("outdoorAvoid")}</h2></div><strong>{outdoor.time}</strong></article><TemperatureChart forecast={forecast} temp={temp} title={t("temperatureChart")} /><WindChart forecast={forecast} title={t("windChart")} /></>}
            <InteractiveMap current={current} title={t("interactiveMap")} />
            <Forecast forecast={forecast} temp={temp} formatTime={formatTime} formatDay={formatDay} weatherIcon={weatherIcon} weatherLabel={weatherLabel} t={t} onLocation={useLocation} /></>}
        </section>
        {favoritesOpen && <aside className="favorites-panel"><div className="section-heading"><h2>{t("favorites")}</h2><button className="close-button" onClick={() => setFavoritesOpen(false)}>×</button></div><p className="favorites-hint">{t("reorderHint")}</p>{favorites.length ? favorites.map(item => <button className="favorite-item" draggable key={item} onDragStart={() => setDraggedFavorite(item)} onDragOver={event => event.preventDefault()} onDrop={() => reorderFavorites(item)} onClick={() => { setInput(item); loadCity(item); }}>{item}</button>) : <p className="empty-favorites">{t("noFavorites")}</p>}</aside>}
        </main>
    </>;
}

function WeatherBackground({ weather }) {
    return <div className={`weather-background weather-background--${weather.toLowerCase()}`} aria-hidden="true">
        {weather === "map" ? <div className="map-scene"><span className="map-road map-road--one" /><span className="map-road map-road--two" /><span className="map-road map-road--three" /><span className="map-route" /><span className="map-pin" /><span className="map-label map-label--one">CITY</span><span className="map-label map-label--two">NORTH</span></div> : <div className="weather-scene"><span className="weather-sun" /><span className="weather-cloud weather-cloud--one" /><span className="weather-cloud weather-cloud--two" /><span className="weather-rain" /><span className="weather-snow" /></div>}
    </div>;
}

function Metric({ icon, label, value }) { return <article className="metric-card"><span className="metric-icon">{icon}</span><p>{label}</p><strong>{value}</strong></article>; }
function InsightCard({ icon, title, value, detail }) { return <article className="insight-card"><span className="metric-icon">{icon}</span><p>{title}</p><strong>{value}</strong><small>{detail}</small></article>; }
function TemperatureChart({ forecast, temp, title }) { const points = forecast.list.slice(0, 8); const values = points.map(item => item.main.temp); const minimum = Math.min(...values); const maximum = Math.max(...values); const range = maximum - minimum || 1; return <article className="chart-card"><div className="section-heading"><h2>{title}</h2><span>{temp(minimum)} – {temp(maximum)}</span></div><div className="temperature-chart">{points.map(item => <div className="chart-column" key={item.dt}><span style={{ height: `${Math.max(12, ((item.main.temp - minimum) / range) * 82)}%` }} /><time>{new Date(item.dt * 1000).toLocaleTimeString([], { hour: "numeric" })}</time></div>)}</div></article>; }
function WindChart({ forecast, title }) { const points = forecast.list.slice(0, 8); const maximum = Math.max(...points.map(item => item.wind.speed), 1); return <article className="chart-card"><div className="section-heading"><h2>{title}</h2><span>{Math.round(maximum)} km/h max</span></div><div className="temperature-chart wind-chart">{points.map(item => <div className="chart-column" key={item.dt}><span style={{ height: `${Math.max(12, (item.wind.speed / maximum) * 82)}%` }} /><time>{new Date(item.dt * 1000).toLocaleTimeString([], { hour: "numeric" })}</time></div>)}</div></article>; }
function InteractiveMap({ current, title }) { const { latitude, longitude } = current.coordinates; const delta = 0.12; const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}&layer=mapnik&marker=${latitude}%2C${longitude}`; return <article className="map-card"><div className="section-heading"><h2>{title}</h2><span>{current.name}</span></div><iframe title={title} src={src} loading="lazy" /></article>; }
function Forecast({ forecast, temp, formatTime, formatDay, weatherIcon, weatherLabel, t, onLocation }) { return <><section className="forecast-section"><div className="section-heading"><h2>{t("hourly")}</h2><button className="location-button" onClick={onLocation}>{t("useLocation")}</button></div><div className="hourly-list">{forecast.list.slice(0, 8).map(item => <article className="hour-item" key={item.dt}><time>{formatTime(item.dt, forecast.city.timezone)}</time><img src={weatherIcon(item.weather[0].main)} alt={weatherLabel(item.weather[0].main)} /><strong>{temp(item.main.temp)}</strong><span>{weatherLabel(item.weather[0].main)}</span></article>)}</div></section><section className="forecast-section daily-section"><div className="section-heading"><h2>{t("daily")}</h2></div><div className="daily-list">{forecast.daily.map(item => <article className="day-item" key={item.dt}><time>{formatDay(item.dt, forecast.city.timezone)}</time><img src={weatherIcon(item.main)} alt={weatherLabel(item.main)} /><div><strong>{temp(item.temp_max)}</strong><span>{temp(item.temp_min)}</span></div><span>{weatherLabel(item.main)}</span></article>)}</div></section></>; }
function getSmartAdvice(current, forecast, unit, t) { const nextHours = forecast.list.slice(0, 8); const hasRain = nextHours.some(item => ["Rain", "Drizzle", "Snow"].includes(item.weather[0].main)); const maxWind = Math.max(current.wind.speed, ...nextHours.map(item => item.wind?.speed || 0)); const temperature = current.main.temp; let title = "moderateAdviceTitle"; let copy = "moderateAdviceCopy"; if (hasRain) [title, copy] = ["rainAdviceTitle", "rainAdviceCopy"]; else if (maxWind >= (unit === "metric" ? 30 : 18)) [title, copy] = ["windAdviceTitle", "windAdviceCopy"]; else if (temperature >= (unit === "metric" ? 30 : 86)) [title, copy] = ["hotAdviceTitle", "hotAdviceCopy"]; else if (temperature <= (unit === "metric" ? 8 : 46)) [title, copy] = ["coldAdviceTitle", "coldAdviceCopy"]; else if (current.weather[0].main === "Clear") [title, copy] = ["clearAdviceTitle", "clearAdviceCopy"]; return { title: t(title), copy: t(copy) }; }
function getAqiLabel(aqi, t) { if (aqi <= 50) return t("aqiGood"); if (aqi <= 100) return t("aqiFair"); return t("aqiPoor"); }
function getOutdoorWindow(forecast, unit, t, formatTime) { const candidate = forecast.list.slice(0, 8).find(item => item.precipitationProbability < 25 && item.wind.speed < (unit === "metric" ? 28 : 17) && item.main.temp > (unit === "metric" ? 8 : 46) && item.main.temp < (unit === "metric" ? 30 : 86)); return candidate ? { good: true, time: formatTime(candidate.dt, forecast.city.timezone) } : { good: false, time: t("outdoorAvoid") }; }

export default App;
