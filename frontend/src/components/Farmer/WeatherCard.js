import React from "react";
import GlassCard from "../common/GlassCard";

export default function WeatherCard() {
  return (
    <GlassCard>
      <div className="d-flex align-items-center mb-3">
        <i className="fas fa-cloud-sun fa-2x text-info me-2"></i>
        <h5 className="fw-bold mb-0">Weather</h5>
      </div>
      <div className="mb-2">
        <span className="fw-bold">28°C</span> <span className="text-muted">Sunny</span>
      </div>
      <div className="text-muted small">[Weather widget coming soon]</div>
    </GlassCard>
  );
} 