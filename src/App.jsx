import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import dayImage from './assets/dayImage.png'
import nightImage from './assets/nightImage.jpeg'
import clearDay from '/clear-sky.jpg';
import clearNight from '/clear-night-sky.jpg';
import cloudyDay from '/cloudy-day.jpg';
import cloudyNight from '/cloudy-night.jpg';
import rainyDay from '/rainy-day.jpg';
import rainyNight from '/rainy-night.jpg';
import snowyDay from '/snowy-day.jpg';
import snowyNight from '/snowy-night.jpg';
import foggyDay from '/foggy-day.jpg';
import foggyNight from '/foggy-night.jpg';
import thunderstormDay from '/thunderstorm-day.jpg';
import thunderstormNight from '/thunderstorm-night.jpg';
import defaultImage from '/default.jpg';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;


const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (error) {
      console.error("Gabim në marrjen e të dhënave të motit", error);
    }
  };

  const getBackgroundImage = (weather, isDayTime) => {
    if (!weather || !weather.weather) return defaultImage;
  
    const condition = weather.weather[0].main;
  
    const backgrounds = {
      Clear: isDayTime ? clearDay : clearNight,
      Clouds: isDayTime ? cloudyDay : cloudyNight,
      Rain: isDayTime ? rainyDay : rainyNight,
      Snow: isDayTime ? snowyDay : snowyNight,
      Fog: isDayTime ? foggyDay : foggyNight,
      Mist: isDayTime ? foggyDay : foggyNight,
      Thunderstorm: isDayTime ? thunderstormDay : thunderstormNight,
    };
  
    return backgrounds[condition] || defaultImage;
  };
  
  const onClearCity = () => setCity('');
  const currentTime = new Date().getTime() / 1000;
  const sunrise = weather?.sys?.sunrise;
  const sunset = weather?.sys?.sunset;
  const isDayTime = currentTime > sunrise && currentTime < sunset;

  const backgroundClass = isDayTime ? dayImage : nightImage;
  const convertTimestampToHour = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${getBackgroundImage(weather)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={`bg-white bg-opacity-20 rounded-lg shadow-lg p-8 flex flex-col items-center ${isDayTime ? 'text-white' : 'black-text'}`}>
        <h1 className="text-3xl font-bold mb-8">Weather App</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search the city..."
          className="p-2 rounded text-black mb-4"
        />
        <button onClick={onClearCity}>X</button>
        <button
          onClick={() => fetchWeather(city)}
          className="px-4 py-2 bg-white text-indigo-600 rounded shadow-lg hover:bg-gray-200"
        >
          Search
        </button>

        {weather?.weather?.[0].main && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-white bg-opacity-20 rounded-lg shadow-lg flex flex-col items-center"
          >
            {getBackgroundImage(weather.weather[0].main)}
            <h2 className="text-2xl font-semibold mt-2">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-xl">
              Actual Temperature: <b>{Math.round(weather.main.temp)}°C</b>
            </p>
            <p className="text-xl">
              Feels Like: <b>{Math.round(weather.main.feels_like)}°C</b>
            </p>
            <p className="text-xl">
              Pressure: <b>{Math.round(weather.main.pressure)}</b>
            </p>
            <p className="text-md">
              Description: <b>{weather.weather[0].main}</b>
            </p>
            <p className="text-md">
              Visibility: <b>{weather.visibility / 1000} km</b>
            </p>
            <p className="text-md">
              Sunrise: <b>{convertTimestampToHour(weather.sys.sunrise)} AM</b>
            </p>
            <p className="text-md">
              Sunset: <b>{convertTimestampToHour(weather.sys.sunset)} PM</b>
            </p>
            <p className="text-md">
              Humidity: <b>{weather.main.humidity}%</b>
            </p>
            <p className="text-md">
              Wind Speed: <b>{weather.wind.speed} km/h</b>
            </p>
          </motion.div>
        )}
      </div>
    </div>

  );
};

export default WeatherApp;
