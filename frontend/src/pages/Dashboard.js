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
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #003c14 0%, #a8e063 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="w-100 mt-5" style={{ maxWidth: 700 }}>
          <div
            className="card border-0 shadow-lg p-4"
            style={{
              background: "rgba(255,255,255,0.55)",
              borderRadius: 28,
              backdropFilter: "blur(18px)",
              boxShadow: "0 8px 32px 0 rgba(34,139,34,0.18)",
              border: "1.5px solid #e6f4ea"
            }}
          >
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
          </div>
        </div>
      </div>
    );
  }

  // If complete, show dashboard
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #003c14 0%, #a8e063 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="w-100 mt-5" style={{ maxWidth: 700 }}>
        <div
          className="card border-0 shadow-lg p-4 text-center"
          style={{
            background: "rgba(255,255,255,0.92)",
            borderRadius: 28,
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px 0 rgba(34,139,34,0.18)",
            border: "1.5px solid #e6f4ea"
          }}
        >
          <h2 className="mb-3 text-success">Welcome, {profile.name}!</h2>
          <p className="lead">Your role: <b>{role.replace(/_/g, " ")}</b></p>
          <p className="mb-0">Your profile is complete. You can now access all features of AgriSaarthi.</p>
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

  // Field label and icon mapping
  const fieldLabels = {
    name: { label: "Full Name", icon: "fa-user" },
    phone: { label: "Mobile Number", icon: "fa-phone" },
    state: { label: "State", icon: "fa-map-marker-alt" },
    district: { label: "District", icon: "fa-map-pin" },
    village: { label: "Village", icon: "fa-home" },
    preferred_language: { label: "Preferred Language", icon: "fa-language" },
    type_of_farming: { label: "Type of Farming", icon: "fa-seedling" },
    main_crops: { label: "Main Crops Grown", icon: "fa-leaf" },
    farm_size: { label: "Farm Size (Acres/Hectares)", icon: "fa-ruler-combined" },
    voice_input_access: { label: "Voice Input Access?", icon: "fa-microphone" },
    receive_govt_alerts: { label: "Receive Government Scheme Alerts?", icon: "fa-bell" },
    expertise_area: { label: "Expertise Area", icon: "fa-lightbulb" },
    experience_years: { label: "Experience (Years)", icon: "fa-briefcase" },
    state_of_operation: { label: "State of Operation", icon: "fa-map" },
    languages_spoken: { label: "Languages Spoken", icon: "fa-language" },
    available_for_consult: { label: "Available for Farmer Consultations?", icon: "fa-comments" },
    email: { label: "Email", icon: "fa-envelope" },
    designation: { label: "Designation/Role", icon: "fa-user-tie" },
    region_of_responsibility: { label: "Region of Responsibility", icon: "fa-globe" },
    access_level: { label: "Access Level", icon: "fa-unlock-alt" },
    employee_id: { label: "Employee ID or Code", icon: "fa-id-badge" },
    admin_password: { label: "Password (for dashboard login)", icon: "fa-lock" },
    department_name: { label: "Department Name", icon: "fa-building" },
    official_email: { label: "Official Email ID", icon: "fa-envelope" },
    gov_designation: { label: "Designation", icon: "fa-user-shield" },
    schemes_managed: { label: "Schemes Managed", icon: "fa-list-alt" },
    portal_access_required: { label: "Portal Access Required?", icon: "fa-key" },
    business_name: { label: "Business Name", icon: "fa-store" },
    location: { label: "Location / Market Region", icon: "fa-map-marker-alt" },
    type_of_business: { label: "Type of Business", icon: "fa-briefcase" },
    interested_crops: { label: "Interested Crops", icon: "fa-leaf" },
    buyer_dashboard_access: { label: "Buyer Dashboard Access?", icon: "fa-user-check" },
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

  // Responsive: two columns for long forms on desktop, single column on mobile
  const isTwoColumn = requiredFields.length > 8;

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="mb-4 text-success text-center" style={{ fontWeight: 700, letterSpacing: 1 }}>
        <i className="fas fa-tractor me-2"></i>
        Complete Your {role.replace(/_/g, " ")} Profile
      </h2>
      <div className="row">
        <div className="col-12 col-md-6">
          {requiredFields.slice(0, Math.ceil(requiredFields.length / 2)).map((field) => (
            <div className="mb-3" key={field}>
              {booleanFields.includes(field) ? (
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={field}
                    name={field}
                    checked={!!form[field]}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor={field}>
                    {fieldLabels[field]?.label || field}
                  </label>
                </div>
              ) : field === "access_level" ? (
                <>
                  <label className="form-label fw-semibold">{fieldLabels[field]?.label || field}</label>
                  <select
                    className="form-select form-select-lg bg-light border-0 shadow-sm"
                    style={{ borderRadius: 14, fontSize: 18 }}
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {accessLevelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </>
              ) : field === "type_of_business" ? (
                <>
                  <label className="form-label fw-semibold">{fieldLabels[field]?.label || field}</label>
                  <select
                    className="form-select form-select-lg bg-light border-0 shadow-sm"
                    style={{ borderRadius: 14, fontSize: 18 }}
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {typeOfBusinessOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label className="form-label fw-semibold">{fieldLabels[field]?.label || field}</label>
                  <input
                    type={field.toLowerCase().includes("password") ? "password" : "text"}
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                    className="form-control form-control-lg bg-light border-0 shadow-sm"
                    style={{ borderRadius: 14, fontSize: 18 }}
                    required
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <div className="col-12 col-md-6">
          {requiredFields.slice(Math.ceil(requiredFields.length / 2)).map((field) => (
            <div className="mb-3" key={field}>
              {booleanFields.includes(field) ? (
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={field}
                    name={field}
                    checked={!!form[field]}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor={field}>
                    {fieldLabels[field]?.label || field}
                  </label>
                </div>
              ) : field === "access_level" ? (
                <>
                  <label className="form-label fw-semibold">{fieldLabels[field]?.label || field}</label>
                  <select
                    className="form-select form-select-lg bg-light border-0 shadow-sm"
                    style={{ borderRadius: 14, fontSize: 18 }}
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {accessLevelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </>
              ) : field === "type_of_business" ? (
                <>
                  <label className="form-label fw-semibold">{fieldLabels[field]?.label || field}</label>
                  <select
                    className="form-select form-select-lg bg-light border-0 shadow-sm"
                    style={{ borderRadius: 14, fontSize: 18 }}
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {typeOfBusinessOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label className="form-label fw-semibold">{fieldLabels[field]?.label || field}</label>
                  <input
                    type={field.toLowerCase().includes("password") ? "password" : "text"}
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                    className="form-control form-control-lg bg-light border-0 shadow-sm"
                    style={{ borderRadius: 14, fontSize: 18 }}
                    required
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Special file fields */}
      {role === "expert_advisor" && (
        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="fas fa-id-card me-2"></i>Certificates or ID (optional)
          </label>
          <input type="file" name="certificates" className="form-control bg-light border-0 shadow-sm" style={{ borderRadius: 14 }} onChange={handleChange} />
        </div>
      )}
      {role === "government_official" && (
        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="fas fa-id-badge me-2"></i>Government ID / Badge
          </label>
          <input type="file" name="gov_id_badge" className="form-control bg-light border-0 shadow-sm" style={{ borderRadius: 14 }} onChange={handleChange} />
        </div>
      )}
      {role === "farmer" && (
        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="fas fa-image me-2"></i>Profile Image (optional)
          </label>
          <input type="file" name="profile_image" className="form-control bg-light border-0 shadow-sm" style={{ borderRadius: 14 }} onChange={handleChange} />
        </div>
      )}
      {error && <div className="alert alert-danger border-0" style={{ borderRadius: 14, fontSize: 16 }}><i className="fas fa-exclamation-triangle me-2"></i>{error}</div>}
      {success && <div className="alert alert-success border-0" style={{ borderRadius: 14, fontSize: 16 }}><i className="fas fa-check-circle me-2"></i>{success}</div>}
      <button type="submit" className="btn btn-success btn-lg w-100 fw-bold mt-2 shadow-sm" style={{ borderRadius: 14, background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)", border: "none", fontSize: 20 }} disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
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

function FormFieldUI({ field, form, handleChange, fieldLabels, booleanFields, accessLevelOptions, typeOfBusinessOptions }) {
  if (booleanFields.includes(field)) {
    return (
      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={field}
            name={field}
            checked={!!form[field]}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor={field}>
            <i className={`fas ${fieldLabels[field]?.icon || "fa-question"} me-2`}></i>
            {fieldLabels[field]?.label || field}
          </label>
        </div>
      </div>
    );
  } else if (field === "access_level") {
    return (
      <div className="mb-3">
        <label className="form-label fw-semibold">
          <i className={`fas ${fieldLabels[field]?.icon || "fa-question"} me-2`}></i>
          {fieldLabels[field]?.label || field}
        </label>
        <select
          className="form-select form-select-lg bg-light border-0 shadow-sm"
          style={{ borderRadius: 14, fontSize: 18 }}
          name={field}
          value={form[field] || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          {accessLevelOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  } else if (field === "type_of_business") {
    return (
      <div className="mb-3">
        <label className="form-label fw-semibold">
          <i className={`fas ${fieldLabels[field]?.icon || "fa-question"} me-2`}></i>
          {fieldLabels[field]?.label || field}
        </label>
        <select
          className="form-select form-select-lg bg-light border-0 shadow-sm"
          style={{ borderRadius: 14, fontSize: 18 }}
          name={field}
          value={form[field] || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          {typeOfBusinessOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  } else {
    return (
      <div className="mb-3">
        <label className="form-label fw-semibold">
          <i className={`fas ${fieldLabels[field]?.icon || "fa-question"} me-2`}></i>
          {fieldLabels[field]?.label || field}
        </label>
        <input
          type={field.toLowerCase().includes("password") ? "password" : "text"}
          name={field}
          value={form[field] || ""}
          onChange={handleChange}
          className="form-control form-control-lg bg-light border-0 shadow-sm"
          style={{ borderRadius: 14, fontSize: 18 }}
          required
        />
      </div>
    );
  }
} 