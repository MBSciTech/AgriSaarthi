import React from "react";

export default function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`glass-card h-100 d-flex flex-column align-items-start justify-content-between p-4 ${className}`}
      style={style}
    >
      {children}
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