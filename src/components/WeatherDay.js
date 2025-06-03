import React from 'react';
import Lottie from 'lottie-react';
import clear from '../animations/clear.json';
import cloudy from '../animations/cloudy.json';
import rain from '../animations/rain.json';
import snow from '../animations/snow.json';
import thunderstorm from '../animations/thunderstorm.json';

const getWeatherAnimation = (main) => {
  switch (main) {
    case 'Clear': return clear;
    case 'Clouds': return cloudy;
    case 'Rain': return rain;
    case 'Snow': return snow;
    case 'Thunderstorm': return thunderstorm;
    default: return clear;
  }
};

const WeatherDay = ({ data }) => {
  const { main, weather, dt_txt } = data;
  const anim = getWeatherAnimation(weather[0].main);
  const date = new Date(dt_txt).toLocaleDateString('es-ES', { weekday: 'long' });

  return (
    <div style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "10px", width: "30%" }}>
      <h3>{date}</h3>
      <Lottie animationData={anim} style={{ height: 150 }} />
      <p>Temperatura: {main.temp} °C</p>
      <p>Sensación térmica: {main.feels_like} °C</p>
      <p>Humedad: {main.humidity}%</p>
      <p>Mínima: {main.temp_min} °C / Máxima: {main.temp_max} °C</p>
    </div>
  );
};

export default WeatherDay;