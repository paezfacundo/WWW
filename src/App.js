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
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=${lang}`
          );
          const data = await res.json();
          const autoCity = data.name;
          setLocation(autoCity);
        })
        .catch((error) => {
          console.error("Error de geolocalización:", error);
          alert(lang === "es"
            ? "No se pudo obtener tu ubicación automáticamente."
            : "Could not detect your location automatically.");
        });
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
  }, [location, unit, lang]);

  const fetchWeather = async (loc) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&units=${unit}&cnt=24&lang=${lang}&appid=${API_KEY}`
      );
      const list = response.data.list;
      const forecast = [list[0], list[8], list[16]];
      setWeatherData({
        city: response.data.city.name + ", " + response.data.city.country,
        forecast,
        weatherMain: forecast[0].weather[0].main,
      });      
      localStorage.setItem("location", loc);
    } catch (error) {
      alert(lang === "es"
        ? "No se pudo obtener el clima. Verifica el nombre del lugar."
        : "Couldn't fetch the weather. Check the location name.");
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
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          const data = await res.json();
          const autoCity = data.name;
          setLocation(autoCity);
        } catch (error) {
          alert(lang === "es"
            ? "No se pudo obtener tu ubicación actual."
            : "Could not fetch your current location.");
        }
      },
      () => {
        alert(lang === "es"
          ? "No se pudo acceder a tu ubicación."
          : "Could not access your location.");
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
