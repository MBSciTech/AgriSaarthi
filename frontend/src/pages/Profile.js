import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/common/DashboardNavbar";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/users/profile/", {
          headers: { Authorization: `Token ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #003c14 0%, #a8e063 100%)",
        position: "relative",
      }}
    >
      <DashboardNavbar />
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div
          className="shadow-lg border-0 p-4 p-md-5 mb-5"
          style={{
            background: "rgba(255,255,255,0.85)",
            borderRadius: 32,
            maxWidth: 600,
            width: "100%",
            boxShadow: "0 8px 32px 0 rgba(34,139,34,0.18)",
            backdropFilter: "blur(8px)",
          }}
        >
          <h2 className="mb-4 text-success fw-bold text-center">
            <i className="fas fa-user-circle me-2"></i>My Profile
          </h2>
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : profile ? (
            <>
              <div className="row g-4 align-items-center">
                <div className="col-12 col-md-4 text-center">
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "#e6f4ea",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 60,
                      color: "#28a745",
                    }}
                  >
                    <i className="fas fa-user"></i>
                  </div>
                </div>
                <div className="col-12 col-md-8">
                  <ul className="list-group list-group-flush mb-0">
                    <li className="list-group-item bg-transparent px-0 py-2">
                      <b>Name:</b> {profile.name}
                    </li>
                    <li className="list-group-item bg-transparent px-0 py-2">
                      <b>Phone:</b> {profile.phone}
                    </li>
                    <li className="list-group-item bg-transparent px-0 py-2">
                      <b>Region:</b> {profile.region || profile.state || "-"}
                    </li>
                    <li className="list-group-item bg-transparent px-0 py-2">
                      <b>Main Crops:</b> {profile.main_crops || "-"}
                    </li>
                    <li className="list-group-item bg-transparent px-0 py-2">
                      <b>Farm Size:</b> {profile.farm_size || "-"}
                    </li>
                    <li className="list-group-item bg-transparent px-0 py-2">
                      <b>Role:</b> {profile.role}
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
} 