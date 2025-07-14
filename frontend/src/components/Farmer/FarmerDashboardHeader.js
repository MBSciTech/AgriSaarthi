import React from "react";

export default function FarmerDashboardHeader({ name }) {
  return (
    <div className="glass-card py-3 px-3 d-flex flex-row align-items-center w-100 mb-4" style={{ maxWidth: 1080, minHeight: 0 }}>
      <span className="fw-bold" style={{ fontSize:22, letterSpacing: 1, lineHeight: 1.1, marginBottom: 0 }}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 10 }}>
          <a href="/profile" title="View Profile" style={{ display: 'inline-block' }}>
            <img src="/images/roles/farmer.png" alt="Profile" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgb(9, 98, 76)', background: '#fff', cursor: 'pointer' }} />
          </a>
        </span>
        Namaste {name}!
      </span>
    </div>
  );
} 