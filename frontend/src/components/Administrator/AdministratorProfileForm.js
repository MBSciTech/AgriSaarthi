import React from "react";

export default function AdministratorProfileForm({ profile = {} }) {
  return (
    <div className="p-3">
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-user-tie text-success me-2"></i>
          <strong>Designation:</strong>
        </div>
        <div className="text-muted">{profile.designation || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-map text-success me-2"></i>
          <strong>Region of Responsibility:</strong>
        </div>
        <div className="text-muted">{profile.region_of_responsibility || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-key text-success me-2"></i>
          <strong>Access Level:</strong>
        </div>
        <div className="text-muted">{profile.access_level || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-id-badge text-success me-2"></i>
          <strong>Employee ID:</strong>
        </div>
        <div className="text-muted">{profile.employee_id || "Not specified"}</div>
      </div>
      
      <div className="text-center mt-3">
        <a href="/profile" className="btn btn-outline-success btn-sm">
          <i className="fas fa-edit me-1"></i>
          Edit Profile
        </a>
      </div>
    </div>
  );
} 