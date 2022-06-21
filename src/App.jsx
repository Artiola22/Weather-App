import { useEffect, useState } from 'react'
import './App.css'


function App() {

  const apiKey = "a9b6b10cacc2cfa7b5d6d8dc693deea4"
  const [weather, setWeather] = useState({});
  const [background, setBackground] = useState("")
  const [city, setCity] = useState('')
  const getWeather = (event) => {
    // console.log(event)
    if (event.key == "Enter") {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`)
        .then(response => response.json()).then(
          data => {
            setWeather(data)
            setBackground(data.weather[0].main)
            console.log(data.weather[0].main)
            setCity('')
          }
        )
    }
  }
  
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Diecember"];
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
  const fahrenheitToCelsius = fahrenheit => (fahrenheit - 32) * 5 / 9;
  const myDate = new Date(new Date().getTime());
  return (
    <div className={`${background}`} >
      <main className='App-main'>
        <div className="search-box">
          <input type="text" className='search-bar' placeholder='Search...'
            onChange={e => setCity(e.target.value)}
            value={city}
            onKeyPress={getWeather}
          />
        </div>
        {
          typeof weather.main !== 'undefined' ? (
            <div>
              <div className="location-box">
                <div className="location">{weather.name}, {weather.sys.country}</div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temp">{Math.floor(fahrenheitToCelsius(weather.main.temp))}˚C</div>
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          ): ('')
        }


      </main>
    </div>
  )
}

export default App
