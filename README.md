# Skyline Weather

A responsive weather dashboard built with React and Vite.

## Features

- Current weather for any searched city
- 24-hour forecast and 5-day outlook
- Geolocation weather lookup
- Celsius/Fahrenheit toggle
- English and Arabic translations with RTL support
- Saved cities stored in the browser
- Responsive layout for desktop and mobile
- Loading, error, and empty states
- Smart weather advice based on rain, wind, temperature, and sky conditions

## Run locally

Install dependencies with `npm.cmd install`, then run `npm.cmd run dev`. Geolocation requires `localhost` or HTTPS.

## Data sources

- Open-Meteo Geocoding API for city search
- Open-Meteo Forecast API for weather data
- OpenStreetMap Nominatim for reverse geocoding

No weather API key is required in the frontend.

## Project structure

```text
src/main.jsx       # React entry point
src/App.jsx        # UI, state, translations, and smart advice
src/weatherApi.js  # Open-Meteo and geolocation services
style.css          # Responsive visual system
```
