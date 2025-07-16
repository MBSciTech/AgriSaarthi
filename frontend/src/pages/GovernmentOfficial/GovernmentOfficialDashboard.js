import React from "react";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import GovernmentOfficialProfileForm from "../../components/GovernmentOfficial/GovernmentOfficialProfileForm";
import GlassCard from "../../components/common/GlassCard";
import ProfileCard from "../../components/common/ProfileCard";
import WeatherCard from "../../components/common/WeatherCard";
import MarketCard from "../../components/common/MarketCard";
import AlertsCard from "../../components/common/AlertsCard";

function GovernmentOfficialDashboardHeader({ name }) {
  return (
    <div className="glass-card py-3 px-3 d-flex flex-row align-items-center w-100 mb-4" style={{ maxWidth: 1080, minHeight: 0 }}>
      <span className="fw-bold" style={{ fontSize:22, letterSpacing: 1, lineHeight: 1.1, marginBottom: 0 }}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 10 }}>
          <a href="/profile" title="View Profile" style={{ display: 'inline-block' }}>
            <img src="/images/roles/government_official.png" alt="Profile" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgb(9, 98, 76)', background: '#fff', cursor: 'pointer' }} />
          </a>
        </span>
        Welcome Government Official{name ? `, ${name}` : ""}!
      </span>
    </div>
  );
}

export default function GovernmentOfficialDashboard({ profile = {} }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "rgb(3, 98, 76)",
        position: "relative",
        overflowX: "hidden"
      }}
    >
      <DashboardNavbar />
      <div className="container py-3 px-2 px-md-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "5vh" }}>
        {/* Header */}
        <GovernmentOfficialDashboardHeader name={profile.name} />
        {/* Dashboard Widgets */}
        <div className="row g-4 w-100 h-100" style={{ maxWidth: 1200 }}>
          <div className="col-12 col-md-6 col-lg-3">
            <GlassCard>
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-user-tie fa-2x text-secondary me-2"></i>
                <h5 className="fw-bold mb-0">Profile</h5>
              </div>
              <GovernmentOfficialProfileForm profile={profile} />
            </GlassCard>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <WeatherCard />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <MarketCard />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <AlertsCard />
          </div>
        </div>
      </div>
    </div>
  );
} 