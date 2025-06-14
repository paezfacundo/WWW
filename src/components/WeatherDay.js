// WeatherDay.js
import React from 'react';
import Lottie from 'lottie-react';
import clear from '../animations/clear.json';
import cloudy from '../animations/cloudy.json';
import rain from '../animations/rain.json';
import snow from '../animations/snow.json';
import thunderstorm from '../animations/thunderstorm.json';
import { useLang } from '../hooks/useLang';

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

const WeatherDay = ({ data, unit, lang }) => {
  const translations = useLang(lang);
  const t = (key) => translations[key];

  const { main, weather, dt_txt } = data;
  const anim = getWeatherAnimation(weather[0].main);

  const date = new Date(dt_txt).toLocaleDateString(
    lang === "en" ? "en-US" : "es-ES",
    { weekday: "long" }
  );

  return (
    <div style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "10px", width: "30%" }}>
      <h3>{date}</h3>
      <Lottie animationData={anim} loop={true} style={{ height: 100 }} />
      <p>{t("temperature")}: {main.temp}°{unit === "metric" ? "C" : "F"}</p>
      <p>{t("feels_like")}: {data.main.feels_like.toFixed(1)}°{unit === "metric" ? "C" : "F"}</p>
      <p>{t("max_temp")}: {data.main.temp_max.toFixed(1)}°{unit === "metric" ? "C" : "F"}</p>
      <p>{t("min_temp")}: {data.main.temp_min.toFixed(1)}°{unit === "metric" ? "C" : "F"}</p>
      <p>{t("humidity")}: {main.humidity}%</p>
    </div>
  );
};

export default WeatherDay;

