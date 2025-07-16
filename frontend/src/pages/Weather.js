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
          {/* Top Left: Current Weather */}
          <div className="col-12 col-lg-5 d-flex flex-column justify-content-between">
            <div
              className="glass-card shadow-lg p-4 mb-4 mb-lg-0 h-100"
              style={{
                borderRadius: 32,
                background: "rgba(255,255,255,0.90)",
                boxShadow: "0 8px 32px 0 rgba(34,139,34,0.12)",
                backdropFilter: "blur(12px)",
                border: "1.5px solid #e6f4ea",
                minHeight: 320,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
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
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].main}
                    style={{ width: 120, height: 120 }}
                  />
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
          {/* Top Right: Weather Details */}
          <div className="col-12 col-lg-7 d-flex flex-column justify-content-between">
            {loading || error || !weather ? (
              <div className="text-muted text-center py-5">{loading ? "Loading..." : error || "No data"}</div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 p-0 m-0">
                <SunPath
                  sunrise={weather.sys.sunrise}
                  sunset={weather.sys.sunset}
                  current={currentTime}
                />
              </div>
            )}
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