import React from "react";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import FarmerDashboardHeader from "../../components/Farmer/FarmerDashboardHeader";
import ProfileCard from "../../components/Farmer/ProfileCard";
import WeatherCard from "../../components/Farmer/WeatherCard";
import MarketCard from "../../components/Farmer/MarketCard";
import AlertsCard from "../../components/Farmer/AlertsCard";

export default function FarmerDashboard({ profile }) {
  // Placeholder avatar (could use profile.profile_image if available)
  const avatar = profile.profile_image || "/images/roles/farmer.png";

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
        <FarmerDashboardHeader name={profile.name} />

        {/* Dashboard Widgets */}
        <div className="row g-4 w-100 h-100" style={{ maxWidth: 1200 }}>
          <div className="col-12 col-md-6 col-lg-3">
            <ProfileCard profile={profile} />
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