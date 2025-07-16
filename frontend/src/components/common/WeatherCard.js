import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { useNavigate } from "react-router-dom";

const API_KEY = "2a496ed70c4234605ff47cea15a3bd6a";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.cod !== 200) throw new Error(data.message);
            setWeather(data);
            setLoading(false);
          })
          .catch((err) => {
            setError("Failed to fetch weather");
            setLoading(false);
          });
      },
      (err) => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div style={{ cursor: "pointer" }} onClick={() => navigate("/weather")}> 
      <GlassCard>
        <div className="d-flex align-items-center mb-3">
          <i className="fas fa-cloud-sun fa-2x text-info me-2"></i>
          <h5 className="fw-bold mb-0">Weather</h5>
        </div>
        {loading ? (
          <div className="mb-2 text-muted">Loading...</div>
        ) : error ? (
          <div className="mb-2 text-danger">{error}</div>
        ) : weather ? (
          <>
            <div className="mb-2">
              <span className="fw-bold" style={{ fontSize: 22 }}>{Math.round(weather.main.temp)}&deg;C</span>
              <span className="text-muted ms-2">{weather.weather[0].main} ({weather.weather[0].description})</span>
            </div>
            <div className="text-muted small">
              <i className="fas fa-map-marker-alt me-1"></i>
              {weather.name}, {weather.sys.country}
            </div>
          </>
        ) : (
          <div className="mb-2 text-muted">No data</div>
        )}
      </GlassCard>
    </div>
  );
} 