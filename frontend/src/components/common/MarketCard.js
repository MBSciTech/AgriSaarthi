import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MarketCard({ profile }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allRecords, setAllRecords] = useState([]);
  const navigate = useNavigate();

  // Get main crops from profile (support comma-separated list)
  const mainCrops = (profile?.main_crops || "").split(",").map(c => c.trim().toLowerCase()).filter(Boolean);
  const userState = (profile?.state || "").trim().toLowerCase();
  // Use district for city comparison
  const userDistrict = (profile?.district || "").trim().toUpperCase();

  useEffect(() => {
    if (!mainCrops.length || !userState || !userDistrict) {
      setLoading(false);
      return;
    }
    const fetchMarketPrices = async () => {
      setLoading(true);
      setError("");
      try {
        // Use the first crop, state, and city for API-side filtering
        const params = new URLSearchParams();
        if (mainCrops[0]) params.append('commodity', mainCrops[0]);
        if (userState) params.append('state', userState);
        if (userDistrict) params.append('district', userDistrict);
        const res = await axios.get(`http://localhost:8000/api/farmers/market-prices/?${params.toString()}`);
        const allRecords = res.data.records || [];
        setAllRecords(allRecords);
        // Filter records by main crops, state, and city (case-insensitive, partial match)
        const filtered = allRecords.filter(rec => {
          const cropMatch = mainCrops.some(crop => rec.commodity?.toLowerCase().includes(crop));
          const stateMatch = rec.state?.toLowerCase().trim().includes(userState);
          // Compare user's district to API's district (both uppercased)
          const districtMatch = rec.district?.toUpperCase().includes(userDistrict);
          return cropMatch && stateMatch && districtMatch;
        });
        setData(filtered);
      } catch (err) {
        setError("Failed to fetch market prices");
      } finally {
        setLoading(false);
      }
    };
    fetchMarketPrices();
    // eslint-disable-next-line
  }, [profile?.main_crops, profile?.state, profile?.district]);

  return (
    <div style={{ cursor: "pointer" }} onClick={() => navigate("/market")}>
      <GlassCard>
        <div className="d-flex align-items-center mb-3">
          <i className="fas fa-chart-line fa-2x text-warning me-2"></i>
          <h5 className="fw-bold mb-0">Market Prices</h5>
        </div>
        {/* Debug output for filter logic */}
        {!mainCrops.length || !userState || !userDistrict ? (
          <div className="mb-2 text-muted">Set your main crop(s), state, and city in your profile to see market prices.</div>
        ) : loading ? (
          <div className="mb-2 text-muted">Loading...</div>
        ) : error ? (
          <div className="mb-2 text-danger">{error}</div>
        ) : data.length ? (
          (() => {
            // Find the record with the minimum modal price
            let minIdx = 0;
            let minPrice = Number.POSITIVE_INFINITY;
            data.forEach((rec, idx) => {
              const modal = parseFloat(rec.modal_price);
              if (!isNaN(modal) && modal < minPrice) {
                minPrice = modal;
                minIdx = idx;
              }
            });
            const rec = data[minIdx];
            return (
              <>
                <div className="text-center mb-1">
                  <span className="fw-bold text-success" style={{ fontSize: 20 }}>
                    {rec.commodity}
                  </span>
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center gap-2 mb-1">
                  <div className="text-center">
                    <div className="text-muted small">Min</div>
                    <div className="fw-bold text-secondary" style={{ fontSize: 15 }}>₹{rec.min_price}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted small">Max</div>
                    <div className="fw-bold text-secondary" style={{ fontSize: 15 }}>₹{rec.max_price}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted small">Modal</div>
                    <div className="fw-bold text-primary" style={{ fontSize: 16 }}>₹{rec.modal_price}</div>
                  </div>
                </div>
                <div className="text-center text-muted" style={{ fontSize: 13, letterSpacing: 1, marginBottom: 0 }}>
                  {rec.market}
                </div>
              </>
            );
          })()
        ) : (
          <div className="mb-2 text-muted">No market price data found for your crop(s) in your city/state.</div>
        )}
      </GlassCard>
    </div>
  );
} 