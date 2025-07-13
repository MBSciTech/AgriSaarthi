import React from "react";
import DashboardNavbar from "../../components/common/DashboardNavbar";

export default function FarmerDashboard({ profile }) {
  // Placeholder avatar (could use profile.profile_image if available)
  const avatar = profile.profile_image || "/images/roles/farmer.png";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8e063 0%, #56ab2f 50%, #b7986b 100%)",
        position: "relative",
        overflowX: "hidden"
      }}
    >
      <DashboardNavbar />
      <div className="container py-5 px-2 px-md-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        {/* Header */}
        <div className="w-100 d-flex flex-column flex-md-row align-items-center justify-content-between mb-5" style={{ maxWidth: 1200 }}>
          <div className="d-flex align-items-center gap-4 mb-4 mb-md-0">
            <img
              src={avatar}
              alt="Avatar"
              style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 24px #0002", border: "4px solid #fff" }}
            />
            <div>
              <h2 className="mb-1 fw-bold text-success" style={{ fontSize: 34, letterSpacing: 1 }}>
                <i className="fas fa-tractor me-2"></i>
                Welcome, {profile.name}!
              </h2>
              <div className="text-muted mb-1" style={{ fontSize: 18 }}>Your role: <b>Farmer</b></div>
              <div className="d-flex gap-3 flex-wrap">
                <span className="badge bg-success bg-gradient fs-6 px-3 py-2 shadow-sm">Region: {profile.region || profile.state || "-"}</span>
                <span className="badge bg-warning text-dark fs-6 px-3 py-2 shadow-sm">Main Crops: {profile.main_crops || "-"}</span>
                <span className="badge bg-info text-dark fs-6 px-3 py-2 shadow-sm">Farm Size: {profile.farm_size || "-"}</span>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end gap-2">
            <button className="btn btn-outline-success btn-lg shadow-sm px-4 fw-bold" style={{ borderRadius: 16 }}>
              <i className="fas fa-edit me-2"></i>Edit Profile
            </button>
            <span className="text-muted small">Last login: {profile.last_login ? new Date(profile.last_login).toLocaleString() : "-"}</span>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="row g-4 w-100" style={{ maxWidth: 1200 }}>
          {/* Profile Summary */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="glass-card h-100 p-4 d-flex flex-column align-items-start justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-user-circle fa-2x text-success me-2"></i>
                <h5 className="fw-bold mb-0">Profile</h5>
              </div>
              <ul className="list-unstyled mb-0">
                <li><b>Phone:</b> {profile.phone}</li>
                <li><b>Language:</b> {profile.preferred_language || "-"}</li>
                <li><b>Type:</b> {profile.type_of_farming || "-"}</li>
              </ul>
            </div>
          </div>
          {/* Weather */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="glass-card h-100 p-4 d-flex flex-column align-items-start justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-cloud-sun fa-2x text-info me-2"></i>
                <h5 className="fw-bold mb-0">Weather</h5>
              </div>
              <div className="mb-2">
                <span className="fw-bold">28°C</span> <span className="text-muted">Sunny</span>
              </div>
              <div className="text-muted small">[Weather widget coming soon]</div>
            </div>
          </div>
          {/* Market Prices */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="glass-card h-100 p-4 d-flex flex-column align-items-start justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-chart-line fa-2x text-warning me-2"></i>
                <h5 className="fw-bold mb-0">Market</h5>
              </div>
              <div className="mb-2">
                <span className="fw-bold">₹2,100/qtl</span> <span className="text-muted">(Wheat)</span>
              </div>
              <div className="text-muted small">[Market prices widget coming soon]</div>
            </div>
          </div>
          {/* Govt. Alerts */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="glass-card h-100 p-4 d-flex flex-column align-items-start justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-bell fa-2x text-danger me-2"></i>
                <h5 className="fw-bold mb-0">Govt. Alerts</h5>
              </div>
              <div className="mb-2">
                <span className="fw-bold">2 New</span> <span className="text-muted">Scheme Updates</span>
              </div>
              <div className="text-muted small">[Government alerts widget coming soon]</div>
            </div>
          </div>
        </div>
      </div>
      {/* Glassmorphism card style */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.85);
          border-radius: 28px;
          box-shadow: 0 8px 32px 0 rgba(34,139,34,0.12);
          backdrop-filter: blur(10px);
          border: 1.5px solid #e6f4ea;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .glass-card:hover {
          box-shadow: 0 12px 40px 0 rgba(34,139,34,0.18);
          transform: translateY(-4px) scale(1.03);
        }
      `}</style>
    </div>
  );
} 