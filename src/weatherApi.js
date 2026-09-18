const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_API = "https://air-quality-api.open-meteo.com/v1/air-quality";

export function weatherMain(code) {
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

export async function fetchWeather(latitude, longitude, location, unit) {
    const unitParams = unit === "metric"
        ? "temperature_unit=celsius&wind_speed_unit=kmh"
        : "temperature_unit=fahrenheit&wind_speed_unit=mph";
    const url = `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,visibility,wind_speed_10m,is_day&hourly=temperature_2m,weather_code,precipitation_probability,uv_index,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max,wind_speed_10m_max&${unitParams}&timezone=auto&forecast_days=5`;
    const airUrl = `${AIR_QUALITY_API}?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi,pm2_5,pm10&timezone=auto&forecast_days=1`;
    const [response, airResponse] = await Promise.all([fetch(url), fetch(airUrl)]);
    if (!response.ok) throw new Error("network");
    const data = await response.json();
    const airData = airResponse.ok ? await airResponse.json() : null;
    const timezone = data.utc_offset_seconds;
    const current = {
        name: location.name,
        sys: { country: location.country_code, sunrise: Math.floor(Date.parse(data.daily.sunrise[0]) / 1000) - timezone, sunset: Math.floor(Date.parse(data.daily.sunset[0]) / 1000) - timezone },
        dt: Math.floor(Date.now() / 1000), timezone,
        main: { temp: data.current.temperature_2m, feels_like: data.current.apparent_temperature, humidity: data.current.relative_humidity_2m, pressure: Math.round(data.current.pressure_msl) },
        wind: { speed: data.current.wind_speed_10m }, visibility: data.current.visibility,
        weather: [{ main: weatherMain(data.current.weather_code) }],
        uv: data.daily.uv_index_max[0] ?? 0,
        precipitationProbability: data.daily.precipitation_probability_max[0] ?? 0,
        severe: data.current.weather_code >= 95
    };
    const forecast = {
        city: { timezone },
        list: data.hourly.time.slice(0, 24).map((time, index) => ({ dt: hourlyUnixTime(time, timezone), main: { temp: data.hourly.temperature_2m[index] }, weather: [{ main: weatherMain(data.hourly.weather_code[index]) }], precipitationProbability: data.hourly.precipitation_probability[index] ?? 0, uv: data.hourly.uv_index[index] ?? 0, wind: { speed: data.hourly.wind_speed_10m[index] } })),
        daily: data.daily.time.map((time, index) => ({ dt: unixTime(time, timezone), temp_max: data.daily.temperature_2m_max[index], temp_min: data.daily.temperature_2m_min[index], main: weatherMain(data.daily.weather_code[index]), precipitationProbability: data.daily.precipitation_probability_max[index] ?? 0, uv: data.daily.uv_index_max[index] ?? 0, wind: data.daily.wind_speed_10m_max[index] ?? 0 }))
    };
    return { current, forecast, air: { aqi: airData?.hourly?.us_aqi?.[0] ?? null, pm25: airData?.hourly?.pm2_5?.[0] ?? null, pm10: airData?.hourly?.pm10?.[0] ?? null } };
}

export async function getWeather(city, language, unit) {
    const query = encodeURIComponent(city.trim());
    const response = await fetch(`${GEOCODING_API}?name=${query}&count=1&language=${language}&format=json`);
    if (!response.ok) throw new Error("network");
    const result = await response.json();
    if (!result.results?.length) throw new Error("not-found");
    const location = result.results[0];
    return fetchWeather(location.latitude, location.longitude, location, unit);
}

export async function getWeatherAtLocation(latitude, longitude, unit) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    if (!response.ok) throw new Error("network");
    const location = await response.json();
    const address = location.address || {};
    const city = address.city || address.town || address.village || address.county;
    if (!city) throw new Error("network");
    return fetchWeather(latitude, longitude, { name: city, country_code: address.country_code?.toUpperCase() || "" }, unit);
}
