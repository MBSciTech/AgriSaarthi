import React from "react";

export default function WeatherDetailsCard({ weather, formatTime, loading, error }) {
  return (
    <div
      className="glass-card shadow-lg p-4 w-100 d-flex flex-column justify-content-center"
      style={{
        borderRadius: 32,
        background: "rgba(255,255,255,0.96)",
        boxShadow: "0 8px 32px 0 rgba(34,139,34,0.12)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid #e6f4ea",
      }}
    >
      <h5 className="fw-bold text-success mb-3 text-center">
        <i className="fas fa-info-circle me-2"></i>Weather Details
      </h5>
      {loading || error || !weather ? (
        <div className="text-muted text-center w-100 my-auto">{loading ? "Loading..." : error || "No data"}</div>
      ) : (
        <>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-tint fa-lg text-primary me-3"></i>
            <div>
              <div className="fw-semibold">{weather.main.humidity}%</div>
              <div className="text-muted small">Humidity</div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-wind fa-lg text-secondary me-3"></i>
            <div>
              <div className="fw-semibold">{weather.wind.speed} m/s</div>
              <div className="text-muted small">Wind</div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-tachometer-alt fa-lg text-warning me-3"></i>
            <div>
              <div className="fw-semibold">{weather.main.pressure} hPa</div>
              <div className="text-muted small">Pressure</div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-sun fa-lg text-warning me-3"></i>
            <div>
              <div className="fw-semibold">{formatTime(weather.sys.sunrise)}</div>
              <div className="text-muted small">Sunrise</div>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <i className="fas fa-moon fa-lg text-info me-3"></i>
            <div>
              <div className="fw-semibold">{formatTime(weather.sys.sunset)}</div>
              <div className="text-muted small">Sunset</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 