import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherDay from "./components/WeatherDay";
import { useLang } from "./hooks/useLang";
import { getUserLocation } from "./utils/getLocation";
import { useWeatherSound } from "./hooks/useWeatherSound";
import "./index.css";

const API_KEY = "00511df8e916a246bbd6ced86495ee44";

function App() {
  const [location, setLocation] = useState(localStorage.getItem("location") || "");
  const [input, setInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState(localStorage.getItem("unit") || "metric");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "es");
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const t = useLang(lang);
  useWeatherSound(soundEnabled ? weatherData?.weatherMain : null);


  useEffect(() => {
    if (location) {
      fetchWeather(location);
    } else {
      getUserLocation()
        .then(async ({ lat, lon }) => {
          fetchWeather({ lat, lon });
        })
        .catch((error) => {
          console.error("Error de geolocalización:", error);
          alert(
            lang === "es"
              ? "No se pudo obtener tu ubicación automáticamente."
              : "Could not detect your location automatically."
          );
        });
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
  }, [location, unit, lang]);

  const fetchWeather = async (params) => {
    try {
      let lat, lon;
      let cityName = "";
      let stateName = "";
      let countryName = "";
  
      if (params.lat && params.lon) {
        // Si ya vienen coordenadas
        lat = params.lat;
        lon = params.lon;
  
        // Reverse geocoding para obtener detalles
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        );
  
        const geoData = await geoRes.json();
        const place = geoData[0];
  
        cityName = place.name;
        stateName = place.state || "";
        countryName = place.country;
      } else {
        // Si viene nombre de ciudad (buscador)
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${params}&limit=1&appid=${API_KEY}`
        );
  
        const geoData = await geoRes.json();
  
        if (!geoData.length) {
          throw new Error("Lugar no encontrado");
        }
  
        const place = geoData[0];
  
        lat = place.lat;
        lon = place.lon;
        cityName = place.name;
        stateName = place.state || "";
        countryName = place.country;
  
        localStorage.setItem("location", params);
      }
  
      // Ahora pedimos clima SIEMPRE por coordenadas
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&cnt=24&lang=${lang}&appid=${API_KEY}`
      );
  
      const list = response.data.list;
      const forecast = [list[0], list[8], list[16]];
  
      setWeatherData({
        city: `${cityName}${stateName ? ", " + stateName : ""}, ${countryName}`,
        forecast,
        weatherMain: forecast[0].weather[0].main,
      });
  
    } catch (error) {
      alert(
        lang === "es"
          ? "No se pudo obtener el clima. Verifica el nombre del lugar."
          : "Couldn't fetch the weather. Check the location name."
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLocation(input);
    setInput("");
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    localStorage.setItem("unit", newUnit);
  };

  const toggleLang = () => {
    const newLang = lang === "es" ? "en" : "es";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          // 1️⃣ Reverse Geocoding
          const geoRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
          );
  
          const geoData = await geoRes.json();
          const place = geoData[0];
  
          // 2️⃣ Fetch clima usando SIEMPRE coordenadas
          await fetchWeather({ lat: latitude, lon: longitude });
  
          // 3️⃣ Guardamos ubicación detallada
          setWeatherData((prev) => ({
            ...prev,
            city: `${place.name}${place.state ? ", " + place.state : ""}, ${place.country}`,
          }));
        } catch (error) {
          alert(
            lang === "es"
              ? "No se pudo obtener tu ubicación actual."
              : "Could not fetch your current location."
          );
        }
      },
      () => {
        alert(
          lang === "es"
            ? "No se pudo acceder a tu ubicación."
            : "Could not access your location."
        );
      }
    );
  };

  const getBackgroundClass = () => {
    if (!weatherData) return "default-bg";
    const weather = weatherData.weatherMain.toLowerCase();
    if (weather.includes("cloud")) return "cloudy-bg";
    if (weather.includes("rain") || weather.includes("drizzle")) return "rainy-bg";
    if (weather.includes("thunderstorm")) return "stormy-bg";
    if (weather.includes("snow")) return "snowy-bg";
    if (weather.includes("clear")) return "sunny-bg";
    return "default-bg";
  };  

  return (
<div className={`App ${darkMode ? "dark" : ""} ${getBackgroundClass()}`}>

<div className="app-container">

  {/* SETTINGS */}
  <div className="settings-wrapper">
    <button 
      className={`settings-button ${showSettings ? "rotate" : ""}`}
      onClick={() => setShowSettings(prev => !prev)}
    >
      ⚙️
    </button>

    {showSettings && (
      <div className="settings-menu">
        <div className="toggle-group">
          <span>°C</span>
          <div 
            className={`toggle-switch ${unit === "imperial" ? "active" : ""}`}
            onClick={toggleUnit}
          >
            <div className="toggle-circle"></div>
          </div>
          <span>°F</span>
        </div>

        <div className="toggle-group">
          <span>ES</span>
          <div 
            className={`toggle-switch ${lang === "en" ? "active" : ""}`}
            onClick={toggleLang}
          >
            <div className="toggle-circle"></div>
          </div>
          <span>EN</span>
        </div>

        <div className="toggle-group">
          <span>☀️</span>
          <div 
            className={`toggle-switch ${darkMode ? "active" : ""}`}
            onClick={toggleDarkMode}
          >
            <div className="toggle-circle"></div>
          </div>
          <span>🌙</span>
        </div>

        <div className="toggle-group">
          <span>🔇</span>
          <div 
            className={`toggle-switch ${soundEnabled ? "active" : ""}`}
            onClick={() => setSoundEnabled(prev => !prev)}
          >
            <div className="toggle-circle"></div>
          </div>
          <span>🔊</span>
        </div>

        <button className="location-btn" onClick={handleGeolocation}>
          <span className="location-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              viewBox="0 0 24 24"
              width="18"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 
              9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 
              6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 
              11.5 12 11.5z"/>
            </svg>
          </span>
          <span className="location-text">
            {lang === "es" ? "Mi ubicación" : "My location"}
          </span>
        </button>

      </div>
    )}
  </div>

  {/* BUSCADOR */}
  <form onSubmit={handleSearch} className="search-box">
    <input
      type="text"
      className="search-txt"
      placeholder={t.search_placeholder}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <button type="submit" className="search-btn">
      🔍
    </button>
  </form>

  {/* TÍTULO */}
  {weatherData && (
    <h1>
      {(lang === "es" ? "Clima en" : "Weather in")} {weatherData.city}
    </h1>
  )}

  {/* CARDS */}
  {weatherData?.forecast && (
    <div className="weather-cards">
      {weatherData.forecast.map((data, i) => (
        <WeatherDay
          key={i}
          data={data}
          unit={unit}
          t={t}
          lang={lang}
        />
      ))}
    </div>
  )}

</div>
</div>
  );
}

export default App;
