import React from "react";
import GlassCard from "../common/GlassCard";

export default function GovernmentOfficialProfileForm({ profile }) {
  return (
    <GlassCard className="mb-2">
      <div className="d-flex align-items-center mb-3">
        <i className="fas fa-user-tie fa-2x text-secondary me-2"></i>
        <h5 className="fw-bold mb-0">Government Official Profile</h5>
      </div>
      <ul className="list-unstyled mb-0">
        <li><b>Name:</b> {profile.name}</li>
        <li><b>Department:</b> {profile.department_name || '-'}</li>
        <li><b>Designation:</b> {profile.gov_designation || '-'}</li>
        <li><b>Email:</b> {profile.official_email || '-'}</li>
        <li><b>Schemes Managed:</b> {profile.schemes_managed || '-'}</li>
        <li><b>Govt. ID Badge:</b> {profile.gov_id_badge ? (
          <a href={profile.gov_id_badge} target="_blank" rel="noopener noreferrer">View</a>
        ) : '-'}
        </li>
      </ul>
    </GlassCard>
  );
} 