import React, { useState, useEffect } from "react";
import axios from "axios";
import FarmerDashboard from "./Farmer/FarmerDashboard";
import AdministratorDashboard from "./Administrator/AdministratorDashboard";
import GovernmentOfficialDashboard from "./GovernmentOfficial/GovernmentOfficialDashboard";
import ExpertAdvisorDashboard from "./ExpertAdvisor/ExpertAdvisorDashboard";
import RetailerDashboard from "./Retailer/RetailerDashboard";
import DashboardProfileForm from "../components/Farmer/DashboardProfileForm";

const requiredFieldsByRole = {
  farmer: ["name", "phone", "state", "district", "village", "preferred_language", "type_of_farming", "main_crops", "farm_size", "voice_input_access", "receive_govt_alerts"],
  expert_advisor: ["name", "phone", "expertise_area", "experience_years", "state_of_operation", "languages_spoken", "available_for_consult"],
  administrator: ["name", "email", "designation", "region_of_responsibility", "access_level", "employee_id"],
  retailer: ["name", "business_name", "phone", "location", "type_of_business", "interested_crops"], // removed buyer_dashboard_access as required
  government_official: ["name", "official_email", "gov_designation", "department_name", "region_of_responsibility"],
};

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
        setForm(res.data);
        setLoading(false);
        // Debug log: profile and required fields
        const role = res.data.role;
        const requiredFields = requiredFieldsByRole[role] || [];
        console.log("[DEBUG] Profile object:", res.data);
        console.log("[DEBUG] Required fields for role:", requiredFields);
        requiredFields.forEach(f => {
          if (res.data[f] === null || res.data[f] === undefined || res.data[f] === "") {
            console.warn(`[DEBUG] Missing or empty field: ${f}`);
          }
        });
              } catch (err) {
          console.error("Error loading profile:", err);
          if (err.response?.status === 401) {
            setError("Authentication failed. Please login again.");
            // Redirect to login if token is invalid
            localStorage.removeItem("token");
            window.location.href = "/login";
          } else if (err.response?.status === 400) {
            setError("Bad request. Please check your data and try again.");
            console.error("400 Error details:", err.response?.data);
          } else if (err.response?.status === 500) {
            setError("Server error. Please try again later.");
          } else {
            setError("Failed to load profile: " + (err.response?.data?.error || err.message));
          }
          setLoading(false);
        }
    };
    fetchProfile();
  }, [submitted]);

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5" style={{ maxWidth: 600 }}>
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle fa-3x text-danger"></i>
          </div>
          <h4 className="text-danger mb-3">Error Loading Profile</h4>
          <p className="text-muted mb-4">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-refresh me-2"></i>Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  // Check if profile is complete for the user's role
  const role = profile.role;
  const requiredFields = requiredFieldsByRole[role] || [];
  
  // Debug logging
  console.log("Profile:", profile);
  console.log("Role:", role);
  console.log("Required fields:", requiredFields);
  
  const booleanFields = [
    "voice_input_access",
    "receive_govt_alerts",
    "available_for_consult",
    "portal_access_required",
    "buyer_dashboard_access"
  ];

  const isProfileComplete = requiredFields.every((field) => {
    const value = profile[field];
    if (booleanFields.includes(field)) {
      // Only require boolean fields to be not null/undefined
      return value !== null && value !== undefined;
    }
    return value !== null && value !== "" && value !== undefined;
  });
  
  console.log("Is profile complete:", isProfileComplete);

  // If not complete, show the form
  if (!isProfileComplete && !submitted) {
    if (role === "farmer" || role === "government_official" || role === "expert_advisor" || role === "administrator" || role === "retailer") {
      return (
        <div
          className="min-vh-100 d-flex align-items-center justify-content-center"
          style={{
            background: "#003c14",
            minHeight: "100vh",
          }}
        >
          <div className="w-100 mt-5" style={{ maxWidth: 700 }}>
            <DashboardProfileForm
              role={role}
              form={form}
              setForm={setForm}
              error={error}
              setError={setError}
              success={success}
              setSuccess={setSuccess}
              setSubmitted={setSubmitted}
              requiredFieldsByRole={requiredFieldsByRole}
            />
          </div>
        </div>
      );
    }
    // For other roles, show a placeholder for now
    return (
      <div className="container py-5 text-center">
        <h2>Profile completion form coming soon for your role!</h2>
      </div>
    );
  }

  // If complete, show dashboard for each role
  switch (role) {
    case "farmer":
      return <FarmerDashboard profile={profile} />;
    case "administrator":
      return <AdministratorDashboard profile={profile} />;
    case "government_official":
      return <GovernmentOfficialDashboard profile={profile} />;
    case "expert_advisor":
      return <ExpertAdvisorDashboard profile={profile} />;
    case "retailer":
      return <RetailerDashboard profile={profile} />;
    default:
      return (
        <div className="container py-5 text-center">
          <h2>Dashboard coming soon for your role!</h2>
        </div>
      );
  }
}