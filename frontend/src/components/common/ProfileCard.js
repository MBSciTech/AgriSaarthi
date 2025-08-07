import React from "react";
import GlassCard from "./GlassCard";

export default function ProfileCard({ profile }) {
  const isGov = profile.role === "government_official";
  const isExpert = profile.role === "expert_advisor";

  return (
    <a href="/profile" style={{ textDecoration: 'none', color: 'black' }}>
      <GlassCard className="profile-card-hover">
        <div className="d-flex align-items-center mb-3">
          <i className="fas fa-user-circle fa-2x text-success me-2"></i>
          <h5 className="fw-bold mb-0">Profile</h5>
        </div>

        <ul className="list-unstyled mb-0">
          {isGov ? (
            <>
              <li><b>Name:</b> {profile.name}</li>
              <li><b>Department:</b> {profile.department_name || '-'}</li>
              <li><b>Designation:</b> {profile.gov_designation || '-'}</li>
              <li><b>Email:</b> {profile.official_email || '-'}</li>
            </>
          ) : isExpert ? (
            <>
              <li><b>Name:</b> {profile.name}</li>
              <li><b>Expertise:</b> {profile.expertise_area || '-'}</li>
              <li><b>Language:</b> {profile.preferred_language || '-'}</li>
              <li><b>Location:</b> {profile.village || '-'}</li>
            </>
          ) : (
            <>
              <li><b>Phone:</b> {profile.phone}</li>
              <li><b>Language:</b> {profile.preferred_language || '-'}</li>
              <li><b>Type:</b> {profile.type_of_farming || '-'}</li>
              <li><b>Village/City:</b> {profile.village || '-'}</li>
            </>
          )}
        </ul>
      </GlassCard>

      <style>{`
        .profile-card-hover {
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .profile-card-hover:hover {
          box-shadow: 0 16px 48px 0 rgba(34,139,34,0.22);
          transform: translateY(-6px) scale(1.04);
        }
      `}</style>
    </a>
  );
}
