# 🌤️ Skyline Weather

A modern, responsive weather dashboard built with **Next.js** and **React**. Skyline Weather allows users to search for cities, view current conditions, explore hourly and daily forecasts, detect weather using their location, and receive practical weather advice through a clean, responsive interface.

## 🌐 Live Demo

🚀 **Try Skyline Weather:** https://weather-web.jawasakher.workers.dev/

## 🖥️ Preview

<p align="center">
  <img src="docs/skyline-weather-preview.jpg" alt="Skyline Weather preview" width="100%" />
</p>

## ✨ Features

- 🔎 Search for current weather by city
- 🌡️ View current temperature and weather conditions
- 🕒 24-hour hourly forecast
- 📅 5-day weather outlook
- 📍 Weather lookup using the user's geolocation
- 🌍 English and Arabic language support
- ↔️ Right-to-left (RTL) layout support for Arabic
- 🌡️ Celsius and Fahrenheit temperature units
- ⭐ Save favorite cities in the browser
- 💡 Smart weather advice based on temperature, rain, wind, and sky conditions
- 📱 Responsive design for desktop, tablet, and mobile devices
- ⏳ Loading, error, and empty states for a better user experience

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **React DOM**
- **JavaScript (ES Modules)**
- **CSS** for responsive styling
- **Open-Meteo APIs** for geocoding and weather forecasts
- **OpenStreetMap Nominatim** for reverse geocoding

## 🌐 Data Sources

Skyline Weather uses the following public services:

- **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)** — city and location search
- **[Open-Meteo Forecast API](https://open-meteo.com/en/docs)** — current weather, hourly forecasts, and daily forecasts
- **[OpenStreetMap Nominatim](https://nominatim.org/)** — reverse geocoding for location-based weather lookup

> No weather API key is required for the frontend.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/jawasakher/Weather.Web.git
cd Weather.Web
npm install
```

### Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

> Geolocation generally requires a secure context, such as `localhost` during development or an HTTPS deployment.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm run start
```

## 📁 Project Structure

```text
Weather.Web/
├── app/                # Next.js application routes and layout
├── public/             # Public assets
├── src/
│   ├── main.jsx        # Application entry point or client-side entry
│   ├── App.jsx         # Main UI, state, translations, and weather advice
│   └── weatherApi.js   # Weather, geocoding, and location services
├── style.css            # Responsive visual styles
├── package.json         # Project scripts and dependencies
└── README.md            # Project documentation
```

## 📸 Application Highlights

Skyline Weather focuses on a simple and accessible weather experience with:

- Clear weather information at a glance
- Fast city search and location detection
- Localized Arabic and English interfaces
- Responsive layouts for different screen sizes
- Practical recommendations based on current weather conditions

## 🔐 Privacy & API Notes

- Saved cities are stored locally in the user's browser.
- The application does not require a private weather API key.
- Location access is requested through the browser only when the user chooses to use geolocation.
- API availability and usage policies are controlled by the respective third-party services.

## 📄 License

This project is available for educational and portfolio purposes. Add a specific license if you plan to distribute or reuse the project under defined terms.

## 👩‍💻 Author

**Jawa Sakher**

- GitHub: [@jawasakher](https://github.com/jawasakher)
- Portfolio: [Jawa Sakher Portfolio](https://jawasakher-portfolio.jawasakher.workers.dev/)
