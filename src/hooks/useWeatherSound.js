import { useEffect, useRef } from "react";

const weatherToSound = {
  Clear: "/sounds/clear.wav",
  Clouds: "/sounds/cloudy.mp3",
  Rain: "/sounds/rain.wav",
  Drizzle: "/sounds/rain.wav",
  Thunderstorm: "/sounds/storm.wav",
  Snow: "/sounds/snow.mp3",
};

export const useWeatherSound = (weatherMain) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (weatherMain) {
      const soundFile = weatherToSound[weatherMain] || null;
      if (soundFile) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(soundFile);
        audio.loop = true;
        audio.volume = 0.3;
        audio.play();
        audioRef.current = audio;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [weatherMain]);
};
