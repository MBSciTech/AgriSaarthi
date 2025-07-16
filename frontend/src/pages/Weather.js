import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardNavbar from "../components/common/DashboardNavbar";
import SunPath from "../components/common/SunPath";
import WeatherDetailsCard from "../components/common/WeatherDetailsCard";
import TemperatureTrendCard from "../components/common/TemperatureTrendCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const weatherEmoji = {
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Rain: "🌧️",
  Snow: "❄️",
  Clear: "☀️",
  Clouds: "☁️",
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  Dust: "🌫️",
  Fog: "🌫️",
  Sand: "🌫️",
  Ash: "🌫️",
  Squall: "🌬️",
  Tornado: "🌪️",
};

// Helper to get rain prediction for next 24h
function getRainPrediction(forecast) {
  if (!forecast || !forecast.list) return null;
  const now = Date.now() / 1000;
  const next24h = forecast.list.filter(item => item.dt > now && item.dt < now + 24 * 3600);
  if (!next24h.length) return null;
  let maxPop = 0;
  let maxRain = 0;
  let time = null;
  next24h.forEach(item => {
    if (item.pop > maxPop) {
      maxPop = item.pop;
      time = item.dt;
    }
    if (item.rain && item.rain["3h"] && item.rain["3h"] > maxRain) {
      maxRain = item.rain["3h"];
    }
  });
  return { maxPop, maxRain, time };
}

// Helper to get rain prediction for a given day offset (0=today, 1=tomorrow, 2=day after)
function getRainPredictionByDay(forecast, offset) {
  if (!forecast || !forecast.list) return null;
  const now = new Date();
  const target = new Date(now);
  target.setDate(now.getDate() + offset);
  target.setHours(0, 0, 0, 0);
  const start = target.getTime() / 1000;
  const end = start + 24 * 3600;
  const dayItems = forecast.list.filter(item => item.dt >= start && item.dt < end);
  if (!dayItems.length) return null;
  let maxPop = 0;
  let maxRain = 0;
  let time = null;
  dayItems.forEach(item => {
    if (item.pop > maxPop) {
      maxPop = item.pop;
      time = item.dt;
    }
    if (item.rain && item.rain["3h"] && item.rain["3h"] > maxRain) {
      maxRain = item.rain["3h"];
    }
  });
  return { maxPop, maxRain, time };
}

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState(null);
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    // Update currentTime every hour
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 60 * 60 * 1000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const token = localStorage.getItem("token");
          // Current weather
          const res = await axios.get(
            `http://localhost:8000/api/users/weather/?lat=${latitude}&lon=${longitude}`,
            { headers: { Authorization: `Token ${token}` } }
          );
          setWeather(res.data);
          // Forecast from backend
          const forecastRes = await axios.get(
            `http://localhost:8000/api/users/weather-forecast/?lat=${latitude}&lon=${longitude}`,
            { headers: { Authorization: `Token ${token}` } }
          );
          setForecast(forecastRes.data);
          setLoading(false);
        } catch (err) {
          setError(
            err.response?.data?.error || "Failed to fetch weather"
          );
          setLoading(false);
        }
      },
      (err) => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  }, []);

  function formatTime(unix) {
    if (!unix) return "-";
    return new Date(unix * 1000).toLocaleTimeString();
  }

  // Prepare forecast chart data
  let forecastChartData = null;
  if (forecast) {
    forecastChartData = {
      labels: forecast.list.map((item) =>
        new Date(item.dt * 1000).toLocaleString("en-IN", { hour: "2-digit", day: "2-digit", month: "short" })
      ),
      datasets: [
        {
          label: "Forecast Temp (°C)",
          data: forecast.list.map((item) => item.main.temp),
          fill: false,
          borderColor: "#218c74",
          backgroundColor: "#b2dfdb",
          tension: 0.3,
        },
      ],
    };
  }

  const rainPrediction = getRainPrediction(forecast);
  const rainToday = getRainPredictionByDay(forecast, 0);
  const rainTomorrow = getRainPredictionByDay(forecast, 1);
  const rainDayAfter = getRainPredictionByDay(forecast, 2);

  return (
    <div
      className="weather-bg min-vh-100 d-flex"
      style={{
        background:
          "rgb(7, 98, 76) no-repeat center center fixed",
        minHeight: "100vh",
        padding: 0,
      }}
    >
      <DashboardNavbar />
      <div className="container-fluid py-4" style={{ marginLeft: 70 }}>
        <div className="row g-4 align-items-stretch" style={{ minHeight: "60vh" }}>
          <div className="d-flex flex-column flex-lg-row w-100 gap-4" style={{alignItems:'stretch'}}>
            {/* Current Weather Card */}
            <div className="flex-fill d-flex" style={{ minWidth: 0 }}>
              <div
                className="glass-card shadow-lg p-4 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                style={{
                  borderRadius: 32,
                  background: `linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.82)), url('/images/weather/current_weather_background.jpg') center/cover no-repeat`,
                  boxShadow: "0 8px 32px 0 rgba(34,139,34,0.12)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid #e6f4ea",
                  minHeight: 340,
                  minWidth: 260,
                  maxWidth: 400,
                }}
              >
                <h3 className="fw-bold mb-3 text-success text-center">
                  <i className="fas fa-cloud-sun me-2"></i>Current Weather
                </h3>
                {loading ? (
                  <div className="text-muted text-center py-5">Loading...</div>
                ) : error ? (
                  <div className="text-danger text-center py-5">{error}</div>
                ) : weather ? (
                  <>
                    <span
                      role="img"
                      aria-label={weather.weather[0].main}
                      style={{
                        fontSize: 60,
                        textShadow: '0 0 16px #218c74, 0 2px 8px #218c74, 0 0 32px #fff',
                        filter: 'brightness(1.1)',
                        marginBottom: 4,
                        display: 'inline-block',
                      }}
                    >
                      {weatherEmoji[weather.weather[0].main] || "❔"}
                    </span>
                    <div className="fw-bold mt-2" style={{ fontSize: 48, color: '#218c74' }}>
                      {Math.round(weather.main.temp)}&deg;C
                    </div>
                    <div className="text-muted" style={{ fontSize: 22 }}>
                      {weather.weather[0].main} ({weather.weather[0].description})
                    </div>
                    <div className="fw-semibold mt-2" style={{ fontSize: 20 }}>
                      {weather.name}, {weather.sys.country}
                    </div>
                  </>
                ) : (
                  <div className="text-muted text-center py-5">No data</div>
                )}
              </div>
            </div>
            {/* SunPath Card */}
            <div className="flex-fill d-flex" style={{ minWidth: 0 }}>
              <div className="glass-card shadow-lg p-4 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{
                  borderRadius: 32,
                  background: "rgba(255,255,255,0.90)",
                  boxShadow: "0 8px 32px 0 rgba(34,139,34,0.12)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid #e6f4ea",
                  minHeight: 340,
                  minWidth: 260,
                  maxWidth: 400,
                }}
              >
                {loading || error || !weather ? (
                  <div className="text-muted text-center py-5">{loading ? "Loading..." : error || "No data"}</div>
                ) : (
                  <SunPath
                    sunrise={weather.sys.sunrise}
                    sunset={weather.sys.sunset}
                    current={currentTime}
                  />
                )}
              </div>
            </div>
            {/* Rain Prediction Card */}
            <div className="flex-fill d-flex" style={{ minWidth: 0 }}>
              <div
                className="glass-card shadow-lg p-4 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                style={{
                  borderRadius: 32,
                  background: `linear-gradient(rgba(30,40,60,0.68), rgba(30,40,60,0.68)), url('/images/weather/rain_farm_background.jpg') center/cover no-repeat`,
                  border: '1.5px solid #b3e0ff',
                  minHeight: 340,
                  minWidth: 260,
                  maxWidth: 400,
                }}
              >
                <h3 className="fw-bold mb-3 text-primary text-center" style={{color:'#fff', textShadow:'0 2px 8px #222'}}>
                  <span role="img" aria-label="Rain" style={{ fontSize: 36, marginRight: 8, textShadow: '0 0 8px #2196f3, 0 2px 8px #222' }}>🌧️</span>
                  Rain Prediction
                </h3>
                {loading ? (
                  <div className="text-muted text-center py-5" style={{color:'#fff', textShadow:'0 2px 8px #222'}}>Loading...</div>
                ) : error ? (
                  <div className="text-danger text-center py-5" style={{color:'#fff', textShadow:'0 2px 8px #222'}}>{error}</div>
                ) : (
                  <div className="w-100 d-flex flex-column align-items-center justify-content-between" style={{height:'100%'}}>
                    {/* Top: Today */}
                    <div className="w-100 mb-3 text-center">
                      <div className="fw-semibold text-primary" style={{fontSize:18, color:'#fff', textShadow:'0 2px 8px #222'}}>Today</div>
                      {rainToday ? (
                        <>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: 28, marginBottom: 2, textShadow:'0 2px 8px #222' }}>
                            {Math.round(rainToday.maxPop * 100)}% chance
                          </div>
                          <div style={{ color: '#fff', fontSize: 16, textShadow:'0 2px 8px #222' }}>
                            {rainToday.maxRain > 0 ? `${rainToday.maxRain.toFixed(1)} mm expected` : 'No heavy rain'}
                          </div>
                        </>
                      ) : <div className="text-muted" style={{color:'#fff', textShadow:'0 2px 8px #222'}}>No data</div>}
                    </div>
                    {/* Bottom: Tomorrow & Day After */}
                    <div className="w-100 d-flex flex-row align-items-stretch justify-content-between gap-2">
                      {/* Tomorrow */}
                      <div className="flex-fill text-center border-end pe-2" style={{borderColor:'#b3e0ff', borderWidth:1, borderStyle:'solid', borderTop:'none', borderBottom:'none', borderLeft:'none'}}>
                        <div className="fw-semibold text-primary" style={{fontSize:16, color:'#fff', textShadow:'0 2px 8px #222'}}>Tomorrow</div>
                        {rainTomorrow ? (
                          <>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: 22, marginBottom: 2, textShadow:'0 2px 8px #222' }}>
                              {Math.round(rainTomorrow.maxPop * 100)}%
                            </div>
                            <div style={{ color: '#fff', fontSize: 14, textShadow:'0 2px 8px #222' }}>
                              {rainTomorrow.maxRain > 0 ? `${rainTomorrow.maxRain.toFixed(1)} mm` : 'No heavy rain'}
                            </div>
                          </>
                        ) : <div className="text-muted" style={{color:'#fff', textShadow:'0 2px 8px #222'}}>No data</div>}
                      </div>
                      {/* Day After Tomorrow */}
                      <div className="flex-fill text-center ps-2">
                        <div className="fw-semibold text-primary" style={{fontSize:16, color:'#fff', textShadow:'0 2px 8px #222'}}>Day After</div>
                        {rainDayAfter ? (
                          <>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: 22, marginBottom: 2, textShadow:'0 2px 8px #222' }}>
                              {Math.round(rainDayAfter.maxPop * 100)}%
                            </div>
                            <div style={{ color: '#fff', fontSize: 14, textShadow:'0 2px 8px #222' }}>
                              {rainDayAfter.maxRain > 0 ? `${rainDayAfter.maxRain.toFixed(1)} mm` : 'No heavy rain'}
                            </div>
                          </>
                        ) : <div className="text-muted" style={{color:'#fff', textShadow:'0 2px 8px #222'}}>No data</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom: Weather Graph and Details */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="row g-0 align-items-stretch">
              {/* Left: Temperature Trend Graph */}
              <div className="col-12 col-lg-8">
                <TemperatureTrendCard forecastChartData={forecastChartData} loading={loading} />
              </div>
              {/* Right: Weather Details in a single glass card */}
              <div className="col-12 col-lg-4 ps-lg-4 mt-4 mt-lg-0 d-flex align-items-stretch">
                <WeatherDetailsCard weather={weather} formatTime={formatTime} loading={loading} error={error} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.85);
          border-radius: 32px;
          box-shadow: 0 8px 32px 0 rgba(34,139,34,0.12);
          backdrop-filter: blur(12px);
          border: 1.5px solid #e6f4ea;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .glass-card:hover {
          box-shadow: 0 12px 40px 0 rgba(34,139,34,0.18);
          transform: translateY(-4px) scale(1.03);
        }
        .weather-info-card {
          background: rgba(255,255,255,0.92);
          border-radius: 18px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .weather-info-card:hover {
          box-shadow: 0 8px 24px 0 rgba(34,139,34,0.10);
          transform: translateY(-2px) scale(1.03);
        }
      `}</style>
    </div>
  );
} 