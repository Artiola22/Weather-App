import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WiDaySunny, WiRain, WiCloudy } from "react-icons/wi";
import axios from "axios";
import dayImage from './assets/dayImage.png'
import nightImage from './assets/nightImage.jpeg'


const Weather_API_KEY = "ec013a24e043386d271dc0ea1517259e";

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Tirana");

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Weather_API_KEY}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (error) {
      console.error("Gabim në marrjen e të dhënave të motit", error);
    }
  };

  const getBackgroundImage = (weather) => {
    if (!weather || !weather.weather) return "";
    switch (weather?.weather?.[0].main) {
      case "Clear":
        return "/sunny.jpg";
      case "Rain":
        return "/rainy.jpg";
      case "Clouds":
        return "/cloudy.jpg";
      case "Snow":
        return "/snowy.jpg";
      default:
        return "/default.jpg";
    }
  };

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


      {weather?.weather[0].main === "Rain" && (
        <div className="rain-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="raindrop"></div>
          ))}
        </div>
      )}


      <div className="bg-white bg-opacity-20 rounded-lg shadow-lg p-8 flex flex-col items-center text-white">
        <h1 className="text-3xl font-bold mb-8">Weather App</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search the city..."
          className="p-2 rounded text-black mb-4"
        />
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
