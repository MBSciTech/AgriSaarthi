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
  administrator: ["name", "email", "designation", "region_of_responsibility", "access_level", "employee_id", "admin_password"],
  retailer: ["name", "business_name", "phone", "location", "type_of_business", "interested_crops", "buyer_dashboard_access"],
  government_official: ["name", "email", "designation", "department", "region_of_responsibility", "govt_id"],
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
        setError("Failed to load profile.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [submitted]);

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container py-5 text-center text-danger">{error}</div>;
  }

  if (!profile) {
    return null;
  }

  // Check if profile is complete for the user's role
  const role = profile.role;
  const requiredFields = requiredFieldsByRole[role] || [];
  const isProfileComplete = requiredFields.every(
    (field) => profile[field] !== null && profile[field] !== "" && profile[field] !== undefined
  );

  // If not complete, show the form (for Farmer only for now)
  if (!isProfileComplete && !submitted) {
    if (role === "farmer") {
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