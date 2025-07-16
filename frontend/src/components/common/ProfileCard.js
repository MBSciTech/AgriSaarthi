import React from "react";
import GlassCard from "./GlassCard";

export default function ProfileCard({ profile }) {
  return (
    <a href="/profile" style={{ textDecoration: 'none',color:'black' }}>
      <GlassCard className="profile-card-hover">
        <div className="d-flex align-items-center mb-3">
          <i className="fas fa-user-circle fa-2x text-success me-2"></i>
          <h5 className="fw-bold mb-0">Profile</h5>
        </div>
        <ul className="list-unstyled mb-0">
          <li><b>Phone:</b> {profile.phone}</li>
          <li><b>Language:</b> {profile.preferred_language || "-"}</li>
          <li><b>Type:</b> {profile.type_of_farming || "-"}</li>
        </ul>
      </GlassCard>
      <style>{`
        .profile-card-hover { cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
        .profile-card-hover:hover { box-shadow: 0 16px 48px 0 rgba(34,139,34,0.22); transform: translateY(-6px) scale(1.04); }
      `}</style>
    </a>
  );
} 