import React from "react";
import GlassCard from "./GlassCard";

export default function AlertsCard() {
  return (
    <GlassCard>
      <div className="d-flex align-items-center mb-3">
        <i className="fas fa-bell fa-2x text-danger me-2"></i>
        <h5 className="fw-bold mb-0">Govt. Alerts</h5>
      </div>
      <div className="mb-2">
        <span className="fw-bold">2 New</span> <span className="text-muted">Scheme Updates</span>
      </div>
      <div className="text-muted small">[Government alerts widget coming soon]</div>
    </GlassCard>
  );
} 