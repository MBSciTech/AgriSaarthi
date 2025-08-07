import React from "react";

export default function ExpertAdvisorProfileForm({ profile = {} }) {
  return (
    <div className="p-3">
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-user-graduate text-success me-2"></i>
          <strong>Expertise Area:</strong>
        </div>
        <div className="text-muted">{profile.expertise_area || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-award text-success me-2"></i>
          <strong>Experience:</strong>
        </div>
        <div className="text-muted">{profile.experience_years ? `${profile.experience_years} years` : "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-map-marker-alt text-success me-2"></i>
          <strong>State of Operation:</strong>
        </div>
        <div className="text-muted">{profile.state_of_operation || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-language text-success me-2"></i>
          <strong>Languages:</strong>
        </div>
        <div className="text-muted">{profile.languages_spoken || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-comments text-success me-2"></i>
          <strong>Available for Consult:</strong>
        </div>
        <div className="text-muted">
          {profile.available_for_consult ? "Yes" : "No"}
        </div>
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