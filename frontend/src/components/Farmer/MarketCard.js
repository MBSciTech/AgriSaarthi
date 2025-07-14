import React from "react";
import GlassCard from "../common/GlassCard";

export default function MarketCard() {
  return (
    <GlassCard>
      <div className="d-flex align-items-center mb-3">
        <i className="fas fa-chart-line fa-2x text-warning me-2"></i>
        <h5 className="fw-bold mb-0">Market</h5>
      </div>
      <div className="mb-2">
        <span className="fw-bold"> 92,100/qtl</span> <span className="text-muted">(Wheat)</span>
      </div>
      <div className="text-muted small">[Market prices widget coming soon]</div>
    </GlassCard>
  );
} 