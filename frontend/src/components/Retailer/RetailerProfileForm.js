import React from "react";

export default function RetailerProfileForm({ profile = {} }) {
  return (
    <div className="p-3">
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-store text-success me-2"></i>
          <strong>Business Name:</strong>
        </div>
        <div className="text-muted">{profile.business_name || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-map-marker-alt text-success me-2"></i>
          <strong>Location:</strong>
        </div>
        <div className="text-muted">{profile.location || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-briefcase text-success me-2"></i>
          <strong>Type of Business:</strong>
        </div>
        <div className="text-muted">{profile.type_of_business || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-seedling text-success me-2"></i>
          <strong>Interested Crops:</strong>
        </div>
        <div className="text-muted">{profile.interested_crops || "Not specified"}</div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-shopping-cart text-success me-2"></i>
          <strong>Buyer Dashboard Access:</strong>
        </div>
        <div className="text-muted">
          {profile.buyer_dashboard_access ? "Yes" : "No"}
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