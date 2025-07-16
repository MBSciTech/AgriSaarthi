import React from "react";
import { Line } from "react-chartjs-2";

export default function TemperatureTrendCard({ forecastChartData, loading }) {
  return (
    <div
      className="glass-card shadow-lg p-4 mx-auto h-100"
      style={{
        borderRadius: 32,
        background: `linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.82)), url('/images/weather/weather_farm_background.jpg') center/cover no-repeat`,
        boxShadow: "0 8px 32px 0 rgba(34,139,34,0.12)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid #e6f4ea",
        maxWidth: 900,
      }}
    >
      <h4 className="fw-bold text-success mb-3 text-center">
        <i className="fas fa-chart-line me-2"></i>Temperature Trend (Next 5 Days)
      </h4>
      {loading ? (
        <div className="text-muted text-center">Loading graph...</div>
      ) : forecastChartData ? (
        <Line
          data={forecastChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: { display: true, title: { display: false } },
              y: { display: true, title: { display: true, text: '°C' } },
            },
          }}
          height={120}
        />
      ) : (
        <div className="text-muted text-center">No data</div>
      )}
    </div>
  );
} 