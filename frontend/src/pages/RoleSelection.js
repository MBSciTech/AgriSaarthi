import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const roles = [
  {
    key: "farmer",
    label: "Farmer",
    image: "/images/roles/farmer.png",
    description: "Grower, cultivator, or producer."
  },
  {
    key: "administrator",
    label: "Administrator",
    image: "/images/roles/administrator.png",
    description: "Platform manager or moderator."
  },
  {
    key: "government_official",
    label: "Government Official",
    image: "/images/roles/government_official.png",
    description: "Scheme manager or outreach."
  },
  {
    key: "expert_advisor",
    label: "Expert Advisor",
    image: "/images/roles/expert_advisor.png",
    description: "Agronomist or agri expert."
  },
  {
    key: "retailer",
    label: "Retailer / Buyer",
    image: "/images/roles/retailer.png",
    description: "Market, buyer, or agri retailer."
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSelect = async (role) => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8000/api/users/profile/",
        { role },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      localStorage.setItem("userRole", role);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Failed to set role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center">
          <h2 className="mb-3 text-success">Select Your Role</h2>
          <p className="lead">Choose your role to continue. This helps us personalize your experience.</p>
        </div>
      </div>
      <div className="row g-4 justify-content-center">
        {roles.map((role) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-2 d-flex align-items-stretch" key={role.key}>
            <div
              className="card shadow-sm text-center p-3 h-100 role-card border-success border-2 hover-shadow"
              style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
              onClick={() => !loading && handleSelect(role.key)}
            >
              <img
                src={role.image}
                alt={role.label}
                className="card-img-top mx-auto mb-3"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: '50%',
                  border: '3px solid var(--bs-success)',
                  boxSizing: 'border-box'
                }}
              />
              <h5 className="card-title text-success fw-bold mb-2">{role.label}</h5>
              <p className="card-text text-secondary small">{role.description}</p>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="alert alert-danger mt-4 text-center">{error}</div>}
    </div>
  );
} 