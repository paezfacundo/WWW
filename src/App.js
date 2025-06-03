import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherDay from './components/WeatherDay';

const API_KEY = "00511df8e916a246bbd6ced86495ee44";

function App() {
  const [location, setLocation] = useState(localStorage.getItem("location") || "");
  const [input, setInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
  }, [location]);

  const fetchWeather = async (loc) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${loc}&units=metric&cnt=24&appid=${API_KEY}`);
      const list = response.data.list;
      const forecast = [list[0], list[8], list[16]];
      setWeatherData({ city: response.data.city.name + ", " + response.data.city.country, forecast });
      localStorage.setItem("location", loc);
    } catch (error) {
      alert("No se pudo obtener el clima. Verifica el nombre del lugar.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLocation(input);
  };

  return (
    <div className="App">
      <form onSubmit={handleSearch} style={{ textAlign: "center", margin: "20px" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ej: Roma, Italia" />
        <button type="submit">Buscar</button>
      </form>
      {weatherData && <h1>Clima en {weatherData.city}</h1>}
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {weatherData?.forecast.map((data, i) => (
          <WeatherDay key={i} data={data} />
        ))}
      </div>
    </div>
  );
}

export default App;