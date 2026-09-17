# Weather Web Application

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Vite](https://img.shields.io/badge/Build-Vite-purple?logo=vite)
![API](https://img.shields.io/badge/API-External-blueviolet)
![Status](https://img.shields.io/badge/Status-Production--Ready-success)
![License](https://img.shields.io/badge/License-MIT-green)

<p align="center">
  <img src="weather-preview.jpg" alt="Weather App Preview" width="850"/>
</p>

## Project Overview

A responsive web application that fetches and displays weather information for any city.  
Built with React and modern frontend practices, the application demonstrates async API integration, dynamic UI updates, error handling, and responsive layout.

Intended as a real-world weather dashboard experience.

---

## Core Features

- Search for weather by city name
- Display current weather conditions
- Display temperature, humidity, wind speed
- Error handling for invalid or missing input
- Mobile-friendly and responsive UI

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React |
| Build Tool | Vite |
| API | OpenWeatherMap (or any weather API) |
| Styling | CSS / Tailwind (if used) |
| Dev Tools | ESLint |

---

## Architecture

weather.web/
│
├── public/
│   └── weather-preview.png
│
├── src/
│   ├── components/
│   │   └── WeatherCard.jsx
│   ├── api/
│   │   └── weatherService.js
│   ├── App.jsx
│   └── styles.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
---

## Installation

1. Clone the repository

git clone https://github.com/jawasakher/weather.web.git
2. Install dependencies

npm install
3. Run the development server

npm run dev
Local server runs at:

http://localhost:5173
---

## API Configuration

This project uses an external weather API (like OpenWeatherMap).  
1. Register for an API key  
2. Create a .env file in the root:

VITE_WEATHER_API_KEY=24041d143f71b730b6b3c8d1ccd92691
3. Restart the dev server

---

## UI Features

- Loading state feedback
- User input validation
- City not found / error messages
- Clean and accessible UI

---

## Future Enhancements

- Add 5-day forecast
- Unit toggle (°C / °F)
- Geolocation weather
- Offline caching
- Animations and UX improvements

---

## About the Developer

Jawa Sakher  
Frontend Engineer focused on scalable UI, API integration, and performance optimization.

GitHub: https://github.com/jawasakher

---

## License

This project is licensed under the MIT License.
