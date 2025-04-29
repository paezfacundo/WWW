// Variables globales
const openWeatherMapApiKey = '00511df8e916a246bbd6ced86495ee44';
const youtubeApiKey = 'AIzaSyDckWGAQjKWRO1ujKTnSQK5n9IFtutlYlE';
const searchButton = document.getElementById('searchButton');
const locationInput = document.getElementById('locationInput');
const weatherInfo = document.getElementById('weatherInfo');
const locationElement = document.getElementById('location');
const maxTempElement = document.getElementById('maxTemp');
const minTempElement = document.getElementById('minTemp');
const humidityElement = document.getElementById('humidity');
const feelsLikeElement = document.getElementById('feelsLike');
const pressureElement = document.getElementById('pressure');
const windSpeedElement = document.getElementById('windSpeed');
const weatherIcon = document.getElementById('weatherIcon');
let player;

// Obtener el clima actual al hacer clic en el botón de búsqueda
searchButton.addEventListener('click', () => {
  const location = locationInput.value;
  if (location) {
    getWeatherByLocation(location);
  }
});

// Obtener el clima actual al presionar Enter en el campo de búsqueda
locationInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const location = locationInput.value;
    if (location) {
      getWeatherByLocation(location);
    }
  }
});

// Obtener el clima actual por ubicación utilizando la API de Open Weather Map
function getWeatherByLocation(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openWeatherMapApiKey}&units=metric`;

  // Realizar la solicitud a la API
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Mostrar los datos del clima en la interfaz
      displayWeatherData(data);
      // Obtener el video de YouTube correspondiente al clima actual
      getYouTubeVideoByWeather(data.weather[0].main);
      // Mostrar el ícono de clima correspondiente
      displayWeatherIcon(data.weather[0].main);
    })
    .catch((error) => {
      console.log('Error al obtener el clima:', error);
    });
}

// Mostrar el ícono de clima correspondiente
function displayWeatherIcon(weather) {
  const weatherIconElement = document.getElementById('weatherIcon');
  let iconName = '';

  if (weather === 'Clear') {
    iconName = 'soleado.png';
  } else if (weather === 'Clouds') {
    iconName = 'nublado.png';
  } else if (weather === 'Snow') {
    iconName = 'nevado.png';
  } else if (weather === 'Rain') {
    iconName = 'lluvioso.png';
  } else if (weather === 'Windy') {
    iconName = 'ventoso.png';
  } else if (weather === 'Thunderstorm') {
    iconName = 'tormenta.png';
  }

  weatherIconElement.style.backgroundImage = `url(icons/${iconName})`;
  weatherIconElement.style.display = 'block'; // Mostrar el contenedor
}

// Mostrar los datos del clima en la interfaz
function displayWeatherData(data) {
  locationElement.textContent = data.name;
  maxTempElement.textContent = data.main.temp_max.toFixed(1);
  minTempElement.textContent = data.main.temp_min.toFixed(1);
  humidityElement.textContent = data.main.humidity;
  feelsLikeElement.textContent = data.main.feels_like.toFixed(1);
  pressureElement.textContent = data.main.pressure;
  windSpeedElement.textContent = data.wind.speed.toFixed(1);
  }
  
  // Obtener el video de YouTube correspondiente al clima actual
  function getYouTubeVideoByWeather(weather) {
  let videoId = '';
  
  if (weather === 'Clear') {
  videoId = 'FFFR3jvoUPY';
  } else if (weather === 'Clouds') {
  videoId = 'Ln7zxnl4Pbc';
  } else if (weather === 'Snow') {
  videoId = '-SMKVJO_wGo';
  } else if (weather === 'Rain') {
  videoId = 'mPZkdNFkNps';
  } else if (weather === 'Windy') {
  videoId = 'akpLkQd8WnE';
  } else if (weather === 'Thunderstorm') {
  videoId = 'gVKEM4K8J8A';
  }
  
  // Eliminar el reproductor de YouTube existente si hay alguno
  if (player) {
  player.destroy();
  }
  
  // Insertar el reproductor de YouTube con el video correspondiente
  insertYouTubePlayer(videoId);
  }
  
  // Insertar el reproductor de YouTube con el video correspondiente
  function insertYouTubePlayer(videoId) {
  const playerDiv = document.createElement('div');
  playerDiv.id = 'player';
  weatherInfo.appendChild(playerDiv);
  
  // Cargar el reproductor de YouTube
  player = new YT.Player('player', {
  height: '360',
  width: '640',
  videoId: videoId,
  playerVars: {
  autoplay: 1,
  controls: 0,
  showinfo: 0,
  modestbranding: 1,
  loop: 1,
  playlist: videoId
  }
  });
  }

// Fondo
window.addEventListener('DOMContentLoaded', function() {
  var date = new Date();
  var hour = date.getHours();

  var backgroundElement = document.getElementById('background');

  if (hour >= 6 && hour < 18) {
    backgroundElement.classList.add('background-day');
  } else if (hour >= 18 && hour < 21) {
    backgroundElement.classList.add('background-evening');
  } else {
    backgroundElement.classList.add('background-night');
  }
});