import { useEffect, useRef, useState } from "react";
import "./App.css";
import search_icon from "./img/search.png";
import humidity_icon from "./img/humidity.png";
import wind_icon from "./img/wind.png";
import Loading from "./img/loading.json";
import Lottie from "lottie-react";
import ErrorAnimation from "./img/error_animation.json";
import CloudyBGVid from "./img/cloudsbg.mp4";

function App() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const APIkey = "cba1cbb850d231cad0ffeb46e99c1087";

  const fetchData = async (city) => {
    if (!city) {
      alert("Please enter city name!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
      setError(null);
    } catch (error) {
      console.error(error);
      setError("City Not Found!");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };
  const handleGet = () => {
    fetchData(inputRef.current.value.trim());
  };
  useEffect(() => {
    // Don't fetch data on initial render
  }, []);

  return (
    <div className="main-container">
      <video src={CloudyBGVid} autoPlay loop muted></video>
      <div className="container">
        <div className="form">
          <div className="input">
            <input type="text" placeholder="Enter city" ref={inputRef} />
            <img src={search_icon} alt="Search" onClick={handleGet} />
          </div>

          {loading ? (
            <Lottie animationData={Loading} />
          ) : error ? (
            <>
              <Lottie animationData={ErrorAnimation} />
              <p
                style={{
                  color: "red",
                  background: "#f1f1f1",
                  padding: "10px",
                  borderRadius: "15px",
                  border: "none",
                  outline: "none",
                }}
              >
                {error}
              </p>
            </>
          ) : weatherData ? (
            <>
              <img
                src={weatherData.icon}
                alt="Weather icon"
                className="weather-icon"
              />
              <p className="temperature">{weatherData.temperature} °C</p>
              <p className="location">{weatherData.location}</p>
              <div className="weather-data">
                <div className="col">
                  <img src={humidity_icon} alt="Humidity" />
                  <div>
                    <p>{weatherData.humidity} %</p>
                    <span>Humidity</span>
                  </div>
                </div>
                <div className="col">
                  <img src={wind_icon} alt="Wind" />
                  <div>
                    <p>{weatherData.windSpeed.toFixed(2)} km/h</p>
                    <span>Wind</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
