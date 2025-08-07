import React from "react";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import FarmerDashboardHeader from "../../components/Farmer/FarmerDashboardHeader";
import ProfileCard from "../../components/common/ProfileCard";
import WeatherCard from "../../components/common/WeatherCard";
import MarketCard from "../../components/common/MarketCard";
import AlertsCard from "../../components/common/AlertsCard";
// import BlogFeed from '../../components/BlogFeed';
import { BlogFeed, CreatePostBox } from '../../components/BlogFeed';



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
        <div className="d-flex w-100 justify-content-center" style={{ maxWidth: 1200, gap: 24 }}>
          <div className="d-flex flex-column align-items-stretch" style={{ minWidth: 0, width: 260 }}>
            <ProfileCard profile={profile} className="h-100 w-100" style={{ minHeight: 220 }} />
          </div>
          <div className="d-flex flex-column align-items-stretch" style={{ minWidth: 0, width: 260 }}>
            <WeatherCard className="h-100 w-100" style={{ minHeight: 220 }} />
          </div>
          <div className="d-flex flex-column align-items-stretch" style={{ minWidth: 0, width: 260 }}>
            <MarketCard profile={profile} className="h-100 w-100" style={{ minHeight: 220 }} />
          </div>
          <div className="d-flex flex-column align-items-stretch" style={{ minWidth: 0, width: 260 }}>
            <AlertsCard className="h-100 w-100" style={{ minHeight: 220 }} />
          </div>
        </div>
      </div>
      {profile?.role !== 'government_official' && (
        
      <>
        <BlogFeed/>
        <CreatePostBox profile={profile}/>
        
      </>

      )}
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