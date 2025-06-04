import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherDay from "./components/WeatherDay";
import { useLang } from "./hooks/useLang";
import "./index.css";

const API_KEY = "00511df8e916a246bbd6ced86495ee44";

function App() {
  const [location, setLocation] = useState(localStorage.getItem("location") || "");
  const [input, setInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState(localStorage.getItem("unit") || "metric");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "es");
  const [darkMode, setDarkMode] = useState(false);

  const t = useLang(lang);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    } else {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );
        const data = await res.json();
        const autoCity = data.name;
        setLocation(autoCity);
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
      });
      localStorage.setItem("location", loc);
    } catch (error) {
      alert("No se pudo obtener el clima. Verifica el nombre del lugar.");
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

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px" }}>
        <button onClick={toggleUnit}>
          {unit === "metric" ? t.change_unit : (lang === "es" ? "Cambiar a °C" : "Switch to °C")}
        </button>
        <button onClick={toggleLang}>
          {lang === "es" ? "EN" : "ES"}
        </button>
        <button onClick={toggleDarkMode}>
          {darkMode ? t.light_mode : t.dark_mode}
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
