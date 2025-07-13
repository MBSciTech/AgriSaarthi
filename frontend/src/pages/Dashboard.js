import React, { useState, useEffect } from "react";
import axios from "axios";

const requiredFieldsByRole = {
  farmer: ["name", "phone", "state", "district", "village", "preferred_language", "type_of_farming", "main_crops", "farm_size", "voice_input_access", "receive_govt_alerts"],
  expert_advisor: ["name", "phone", "expertise_area", "experience_years", "state_of_operation", "languages_spoken", "available_for_consult"],
  administrator: ["name", "email", "designation", "region_of_responsibility", "access_level", "employee_id", "admin_password"],
  government_official: ["name", "department_name", "official_email", "state", "gov_designation", "schemes_managed", "gov_id_badge", "portal_access_required"],
  retailer: ["name", "business_name", "phone", "location", "type_of_business", "interested_crops", "buyer_dashboard_access"],
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

  // If not complete, show the form
  if (!isProfileComplete && !submitted) {
    return (
      <ProfileCompletionForm
        role={role}
        form={form}
        setForm={setForm}
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
        setSubmitted={setSubmitted}
      />
    );
  }

  // If complete, show dashboard
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow p-4 text-center">
            <h2 className="mb-3 text-success">Welcome, {profile.name}!</h2>
            <p className="lead">Your role: <b>{role.replace(/_/g, " ")}</b></p>
            <p className="mb-0">Your profile is complete. You can now access all features of AgriSaarthi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileCompletionForm({ role, form, setForm, error, setError, success, setSuccess, setSubmitted }) {
  const [loading, setLoading] = useState(false);
  const requiredFields = requiredFieldsByRole[role] || [];

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    requiredFields.forEach((field) => {
      if (form[field] !== undefined) {
        formData.append(field, form[field]);
      }
    });
    // Add files if present
    if (form.profile_image) formData.append("profile_image", form.profile_image);
    if (form.certificates) formData.append("certificates", form.certificates);
    if (form.gov_id_badge) formData.append("gov_id_badge", form.gov_id_badge);
    try {
      await axios.put("http://localhost:8000/api/users/profile/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Profile updated successfully!");
      setSubmitted(true);
    } catch (err) {
      setError("Failed to update profile. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow p-4">
            <h2 className="mb-3 text-success">Complete Your {role.replace(/_/g, " ")} Profile</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {requiredFields.map((field) => (
                <FormField
                  key={field}
                  field={field}
                  value={form[field] || ""}
                  onChange={handleChange}
                  role={role}
                />
              ))}
              {/* Special file fields */}
              {role === "expert_advisor" && (
                <div className="mb-3">
                  <label className="form-label">Certificates or ID (optional)</label>
                  <input type="file" name="certificates" className="form-control" onChange={handleChange} />
                </div>
              )}
              {role === "government_official" && (
                <div className="mb-3">
                  <label className="form-label">Government ID / Badge</label>
                  <input type="file" name="gov_id_badge" className="form-control" onChange={handleChange} />
                </div>
              )}
              {role === "farmer" && (
                <div className="mb-3">
                  <label className="form-label">Profile Image (optional)</label>
                  <input type="file" name="profile_image" className="form-control" onChange={handleChange} />
                </div>
              )}
              {error && <div className="alert alert-danger py-2">{error}</div>}
              {success && <div className="alert alert-success py-2">{success}</div>}
              <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ field, value, onChange, role }) {
  // Customize labels and input types for each field
  const fieldLabels = {
    name: "Full Name",
    phone: "Mobile Number",
    state: "State",
    district: "District",
    village: "Village",
    preferred_language: "Preferred Language",
    type_of_farming: "Type of Farming",
    main_crops: "Main Crops Grown",
    farm_size: "Farm Size (Acres/Hectares)",
    voice_input_access: "Voice Input Access?",
    receive_govt_alerts: "Receive Government Scheme Alerts?",
    expertise_area: "Expertise Area",
    experience_years: "Experience (Years)",
    state_of_operation: "State of Operation",
    languages_spoken: "Languages Spoken",
    available_for_consult: "Available for Farmer Consultations?",
    email: "Email",
    designation: "Designation/Role",
    region_of_responsibility: "Region of Responsibility",
    access_level: "Access Level",
    employee_id: "Employee ID or Code",
    admin_password: "Password (for dashboard login)",
    department_name: "Department Name",
    official_email: "Official Email ID",
    gov_designation: "Designation",
    schemes_managed: "Schemes Managed",
    portal_access_required: "Portal Access Required?",
    business_name: "Business Name",
    location: "Location / Market Region",
    type_of_business: "Type of Business",
    interested_crops: "Interested Crops",
    buyer_dashboard_access: "Buyer Dashboard Access?",
  };

  // Boolean fields
  const booleanFields = [
    "voice_input_access",
    "receive_govt_alerts",
    "available_for_consult",
    "portal_access_required",
    "buyer_dashboard_access",
  ];

  // Dropdown fields
  const accessLevelOptions = [
    { value: "full", label: "Full" },
    { value: "partial", label: "Partial" },
    { value: "content_only", label: "Content Only" },
  ];
  const typeOfBusinessOptions = [
    { value: "wholesaler", label: "Wholesaler" },
    { value: "local_buyer", label: "Local Buyer" },
    { value: "agri_retailer", label: "Agri Retailer" },
  ];

  if (booleanFields.includes(field)) {
    return (
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id={field}
          name={field}
          checked={!!value}
          onChange={onChange}
        />
        <label className="form-check-label" htmlFor={field}>
          {fieldLabels[field] || field}
        </label>
      </div>
    );
  }

  if (field === "access_level") {
    return (
      <div className="mb-3">
        <label className="form-label">{fieldLabels[field]}</label>
        <select
          className="form-select"
          name={field}
          value={value}
          onChange={onChange}
        >
          <option value="">Select</option>
          {accessLevelOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field === "type_of_business") {
    return (
      <div className="mb-3">
        <label className="form-label">{fieldLabels[field]}</label>
        <select
          className="form-select"
          name={field}
          value={value}
          onChange={onChange}
        >
          <option value="">Select</option>
          {typeOfBusinessOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  // Default: text input
  return (
    <div className="mb-3">
      <label className="form-label">{fieldLabels[field] || field}</label>
      <input
        type={field.includes("email") ? "email" : field.includes("password") ? "password" : "text"}
        name={field}
        className="form-control"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
} 