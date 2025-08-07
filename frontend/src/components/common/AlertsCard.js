import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { useNavigate } from "react-router-dom";

export default function AlertsCard() {
  const navigate = useNavigate();
  const [latestScheme, setLatestScheme] = useState(null);
  const [schemeCount, setSchemeCount] = useState(0);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/farmers/schemes/");
        if (!response.ok) throw new Error("Failed to fetch schemes");
        const data = await response.json();
        setSchemeCount(data.length);
        setLatestScheme(data[0]);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <div
      onClick={() => navigate("/Alerts")}
      style={{ textDecoration: "none" }}
    >
      <GlassCard
        className="alerts-card-hover"
        style={{
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.3s",
        }}
      >
        <div className="d-flex align-items-center mb-3">
          <i className="fas fa-bell fa-2x text-danger me-2"></i>
          <h5 className="fw-bold mb-0">Govt. Schemes</h5>
        </div>

        {latestScheme ? (
          <>
            <div className="mb-2">
              <span className="fw-bold">{schemeCount} New</span>{" "}
              <span className="text-muted">Schemes</span>
            </div>
            <div className="text-muted small">
              <i className="fas fa-bolt me-1 text-warning"></i>
              {latestScheme.name}
            </div>
            <div className="text-muted small pt-2">
              <i className="fas fa-bolt me-1 text-warning"></i>
              {latestScheme.benefit.slice(0,55)}...
            </div>
            
          </>
        ) : (
          <div className="text-muted small">No recent schemes</div>
        )}

        <style>{`
          .alerts-card-hover:hover {
            box-shadow: 0 12px 40px 0 rgba(220,53,69,0.18);
            transform: translateY(-2px) scale(1.01);
          }
        `}</style>
      </GlassCard>
    </div>
  );
}
