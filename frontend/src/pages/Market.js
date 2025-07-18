import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/common/DashboardNavbar";

const marketImages = {
  // Add more as needed
  "Chittoor": "/images/markets/chittoor.jpg",
  "Anand": "/images/markets/anand.jpg",
  // fallback: use a default image
};

export default function Market() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfileAndPrices = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const resProfile = await axios.get("http://localhost:8000/api/users/profile/", {
          headers: { Authorization: `Token ${token}` },
        });
        setProfile(resProfile.data);
        const mainCrops = (resProfile.data.main_crops || "").split(",").map(c => c.trim().toLowerCase()).filter(Boolean);
        const userState = (resProfile.data.state || "").trim().toLowerCase();
        const userDistrict = (resProfile.data.district || "").trim().toUpperCase();
        const params = new URLSearchParams();
        if (mainCrops[0]) params.append('commodity', mainCrops[0]);
        if (userState) params.append('state', userState);
        if (userDistrict) params.append('district', userDistrict);
        const res = await axios.get(`http://localhost:8000/api/farmers/market-prices/?${params.toString()}`);
        setData(res.data.records || []);
      } catch (err) {
        setError("Failed to fetch market prices");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndPrices();
  }, []);

  // Find the best market (lowest modal price)
  let featured = null;
  let rest = [];
  if (data.length) {
    let minIdx = 0;
    let minPrice = Number.POSITIVE_INFINITY;
    data.forEach((rec, idx) => {
      const modal = parseFloat(rec.modal_price);
      if (!isNaN(modal) && modal < minPrice) {
        minPrice = modal;
        minIdx = idx;
      }
    });
    featured = data[minIdx];
    rest = data.filter((_, idx) => idx !== minIdx);
  }

  return (
    <>
      <DashboardNavbar />
      <div className="container-fluid py-4" style={{ paddingLeft: 70, background: 'rgb(3,98,76)' }}>
        <div className="market-bg min-vh-100 px-2 px-md-5" style={{ background: 'rgb(3,98,76)' }}>
          <div className="text-center mb-5">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <span className="bg-white bg-opacity-75 rounded-circle shadow p-3 mb-2" style={{ display: 'inline-block' }}>
                <i className="fas fa-store-alt fa-2x text-success"></i>
              </span>
              <h2 className="fw-bold text-success mb-1" style={{ fontSize: 32, letterSpacing: 1 }}>Market Prices</h2>
              <div className="text-muted" style={{ fontSize: 18 }}>
                {profile?.main_crops ? `for ${profile.main_crops} in your district` : "in your district"}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-muted py-5">Loading...</div>
          ) : error ? (
            <div className="text-center text-danger py-5">{error}</div>
          ) : data.length ? (
            <>
              {/* Featured Market Card */}
              <div className="d-flex justify-content-center mb-5">
                <div
                  className="glass-market-card shadow-lg position-relative"
                  style={{
                    borderRadius: 36,
                    minWidth: 340,
                    maxWidth: 440,
                    background: 'rgba(255,255,255,0.97)',
                    boxShadow: '0 16px 48px 0 rgba(34,139,34,0.22)',
                    border: '2.5px solid #e6f4ea',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    overflow: 'hidden',
                  }}
                >
                  {/* Market image or icon */}
                  <div style={{ height: 140, background: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {marketImages[featured?.market] ? (
                      <img src={marketImages[featured.market]} alt={featured.market} style={{ height: 110, objectFit: 'cover', borderRadius: 22 }} />
                    ) : (
                      <i className="fas fa-store-alt fa-4x text-success"></i>
                    )}
                  </div>
                  <div className="p-4 d-flex flex-column align-items-center">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="fas fa-map-marker-alt fa-lg text-danger"></i>
                      <span className="fw-bold text-dark" style={{ fontSize: 30 }}>{featured.market}</span>
                    </div>
                    <div className="mb-2">
                      <span className="badge bg-success bg-gradient text-white" style={{ fontSize: 18, letterSpacing: 1 }}>{featured.commodity}</span>
                    </div>
                    <div className="d-flex flex-row gap-4 justify-content-center mb-2 w-100">
                      <div className="text-center flex-fill">
                        <div className="text-muted small">Min</div>
                        <div className="fw-bold text-secondary" style={{ fontSize: 22 }}>₹{featured.min_price}</div>
                      </div>
                      <div className="text-center flex-fill">
                        <div className="text-muted small">Max</div>
                        <div className="fw-bold text-secondary" style={{ fontSize: 22 }}>₹{featured.max_price}</div>
                      </div>
                      <div className="text-center flex-fill">
                        <div className="text-muted small">Modal</div>
                        <div className="fw-bold text-primary bg-light rounded-pill px-4 py-1" style={{ fontSize: 26, boxShadow: '0 2px 8px #218c7444' }}>₹{featured.modal_price}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <i className="fas fa-leaf text-success"></i>
                      <span className="text-muted" style={{ fontSize: 17 }}>{featured.state}</span>
                    </div>
                  </div>
                  <span className="position-absolute top-0 end-0 badge bg-warning text-dark shadow" style={{ fontSize: 17, borderRadius: '0 0 0 18px', padding: '10px 22px', letterSpacing: 1 }}>Best Price</span>
                </div>
              </div>
              {/* Timeline for other markets */}
              {rest.length > 0 && (
                <div className="timeline-market mx-auto" style={{ maxWidth: 700, position: 'relative', paddingLeft: 48 }}>
                  {/* Timeline vertical line */}
                  <div className="position-absolute bg-success" style={{ left: 0, top: 0, bottom: 0, width: 5, borderRadius: 2, opacity: 0.18, zIndex: 1 }}></div>
                  {rest.map((rec, idx) => (
                    <div key={idx} className="d-flex align-items-start mb-5 position-relative">
                      <div className="timeline-dot bg-success position-absolute d-flex align-items-center justify-content-center" style={{ left: -24, top: 24, width: 32, height: 32, borderRadius: '50%', zIndex: 2, border: '4px solid #fff', boxShadow: '0 2px 8px #218c7444' }}>
                        {marketImages[rec.market] ? (
                          <img src={marketImages[rec.market]} alt={rec.market} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                        ) : (
                          <i className="fas fa-store-alt fa-lg text-white"></i>
                        )}
                      </div>
                      <div className="glass-market-card flex-fill shadow-sm ms-4" style={{ borderRadius: 18, background: 'rgba(255,255,255,0.90)', boxShadow: '0 4px 16px 0 rgba(34,139,34,0.10)', border: '1.5px solid #e6f4ea', padding: 22 }}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <i className="fas fa-map-marker-alt text-danger"></i>
                          <span className="fw-bold text-dark" style={{ fontSize: 20 }}>{rec.market}</span>
                          <span className="badge bg-success bg-gradient text-white ms-2" style={{ fontSize: 15 }}>{rec.commodity}</span>
                        </div>
                        <div className="d-flex flex-row gap-4 justify-content-center mb-1 w-100">
                          <div className="text-center flex-fill">
                            <div className="text-muted small">Min</div>
                            <div className="fw-bold text-secondary" style={{ fontSize: 17 }}>₹{rec.min_price}</div>
                          </div>
                          <div className="text-center flex-fill">
                            <div className="text-muted small">Max</div>
                            <div className="fw-bold text-secondary" style={{ fontSize: 17 }}>₹{rec.max_price}</div>
                          </div>
                          <div className="text-center flex-fill">
                            <div className="text-muted small">Modal</div>
                            <div className="fw-bold text-primary bg-light rounded-pill px-3" style={{ fontSize: 19, boxShadow: '0 2px 8px #218c7444' }}>₹{rec.modal_price}</div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <i className="fas fa-leaf text-success"></i>
                          <span className="text-muted" style={{ fontSize: 14 }}>{rec.state}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted py-5">No market price data found for your crop(s) in your district.</div>
          )}
          <style>{`
            .glass-market-card:hover {
              box-shadow: 0 16px 48px 0 rgba(34,139,34,0.22) !important;
              transform: translateY(-4px) scale(1.03) !important;
            }
            .timeline-market { position: relative; }
          `}</style>
        </div>
      </div>
    </>
  );
} 