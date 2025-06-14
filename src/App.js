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
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button onClick={toggleUnit}>
          {unit === "metric" ? t.change_unit : (lang === "es" ? "Cambiar a °C" : "Switch to °C")}
        </button>
        <button onClick={toggleLang}>
          {lang === "es" ? "EN" : "ES"}
        </button>
        <button onClick={toggleDarkMode}>
          {darkMode ? t.light_mode : t.dark_mode}
        </button>
        <button onClick={handleGeolocation}>
          {t.go_to_my_location}
        </button>
        <button onClick={() => setSoundEnabled(prev => !prev)}>
          {soundEnabled ? t.disable_sound : t.enable_sound}
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ textAlign: "center", margin: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.search_placeholder}
        />
        <button type="submit">{lang === "es" ? "Buscar" : "Search"}</button>
      </form>

      {weatherData && <h1>{(lang === "es" ? "Clima en" : "Weather in")} {weatherData.city}</h1>}

      {weatherData && weatherData.forecast && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {weatherData.forecast.map((data, i) => (
            <WeatherDay key={i} data={data} unit={unit} t={t} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
