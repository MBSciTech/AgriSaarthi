import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove token and any other user data
    localStorage.removeItem("token");
    // Optionally clear more user data here
    // Redirect after 1.5 seconds
    const timer = setTimeout(() => {
      navigate("/auth", { replace: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ borderRadius: 24, maxWidth: 400 }}>
        <div className="text-center mb-3">
          <i className="fas fa-sign-out-alt fa-3x text-success mb-2"></i>
          <h2 className="fw-bold mb-2">Logging Out...</h2>
        </div>
        <div className="text-center text-muted mb-2">
          You have been logged out successfully.<br />Redirecting to login page...
        </div>
        <div className="progress mt-3" style={{ height: 6 }}>
          <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: "100%" }}></div>
        </div>
      </div>
    </div>
  );
} 