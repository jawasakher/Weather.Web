# Skyline Weather

A responsive, dependency-free weather dashboard built with HTML, CSS, and JavaScript.

## Features

- Current weather for any searched city
- 24-hour forecast and 5-day outlook
- Geolocation weather lookup
- Celsius/Fahrenheit toggle
- English and Arabic translations with RTL support
- Saved cities stored in the browser
- Responsive layout for desktop and mobile
- Loading, error, and empty states

## Run locally

Serve the folder with any static web server. VS Code Live Server works well. Geolocation requires `localhost` or HTTPS.

## Data sources

- Open-Meteo Geocoding API for city search
- Open-Meteo Forecast API for weather data
- OpenStreetMap Nominatim for reverse geocoding

No weather API key is required in the frontend.

## Project files

```text
index.html  # Application structure
style.css   # Responsive visual system
app.js      # API calls, state, translations, and rendering
```
