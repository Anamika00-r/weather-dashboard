// App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = "6c809027f2eeca990f28d06f75d0be69";

  const getWeather = async (cityName = city) => {
    if (!cityName) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!currentRes.ok) throw new Error("City not found");

      const currentData = await currentRes.json();
      setWeather(currentData);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastRes.json();

      const dailyForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(dailyForecast);

      setSearchHistory((prev) => {
        const updated = [cityName, ...prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase())];
        return updated.slice(0, 5);
      });

      setCity("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") getWeather();
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleRefresh = () => {
    if (weather) {
      getWeather(weather.name);
    }
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <h1>🌤️ Weather Dashboard</h1>

      <button onClick={toggleTheme} className="theme-toggle">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={() => getWeather()}>Search</button>

      {weather && (
        <button onClick={handleRefresh} style={{ marginLeft: "10px" }}>
          🔄 Refresh
        </button>
      )}

      {loading && <div className="loader"></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>🌡 Temp: {weather.main.temp}°C</p>
          <p>☁ Condition: {weather.weather[0].main}</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬 Wind: {weather.wind.speed} km/h</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-cards">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="forecast icon"
                />
                <p>{day.main.temp}°C</p>
                <p>{day.weather[0].main}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchHistory.length > 0 && (
        <div className="history">
          <h3>Recent Searches</h3>
          <ul>
            {searchHistory.map((item, idx) => (
              <li key={idx}>
                <button onClick={() => getWeather(item)}>{item}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
