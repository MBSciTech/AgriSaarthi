import React, { useState } from "react";
import axios from "axios";

export default function DashboardProfileForm({ role, form, setForm, error, setError, success, setSuccess, setSubmitted, requiredFieldsByRole }) {
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
    let payload = form;
    let config = { headers: { Authorization: `Token ${token}` } };
    // If profile_image is a File, use FormData
    if (form.profile_image instanceof File) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "profile_image") {
          if (value) formData.append("profile_image", value);
        } else {
          formData.append(key, value);
        }
      });
      payload = formData;
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      // If profile_image is not a File, do not send it
      const { profile_image, ...rest } = form;
      payload = rest;
    }
    try {
      await axios.put("http://localhost:8000/api/users/profile/", payload, config);
      setSuccess("Profile updated successfully!");
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' ? err.response.data : JSON.stringify(err.response?.data)) ||
        "Failed to update profile. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Field label and icon mapping
  const fieldLabels = {
    name: { label: "Full Name" },
    phone: { label: "Mobile Number" },
    state: { label: "State" },
    district: { label: "District" },
    village: { label: "Village" },
    preferred_language: { label: "Preferred Language" },
    type_of_farming: { label: "Type of Farming" },
    main_crops: { label: "Main Crops Grown" },
    farm_size: { label: "Farm Size (Acres/Hectares)" },
    voice_input_access: { label: "Voice Input Access?" },
    receive_govt_alerts: { label: "Receive Government Scheme Alerts?" },
    expertise_area: { label: "Expertise Area" },
    experience_years: { label: "Experience (Years)" },
    state_of_operation: { label: "State of Operation" },
    languages_spoken: { label: "Languages Spoken" },
    available_for_consult: { label: "Available for Farmer Consultations?" },
    email: { label: "Email" },
    designation: { label: "Designation/Role" },
    region_of_responsibility: { label: "Region of Responsibility" },
    access_level: { label: "Access Level" },
    employee_id: { label: "Employee ID or Code" },
    admin_password: { label: "Password (for dashboard login)" },
    department_name: { label: "Department Name" },
    official_email: { label: "Official Email ID" },
    gov_designation: { label: "Designation" },
    schemes_managed: { label: "Schemes Managed" },
    portal_access_required: { label: "Portal Access Required?" },
    business_name: { label: "Business Name" },
    location: { label: "Location / Market Region" },
    type_of_business: { label: "Type of Business" },
    interested_crops: { label: "Interested Crops" },
    buyer_dashboard_access: { label: "Buyer Dashboard Access?" },
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

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="mb-4 text-success text-center" style={{ fontWeight: 700, letterSpacing: 1 }}>
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
          <label className="form-label fw-semibold">Certificates or ID (optional)</label>
          <input type="file" name="certificates" className="form-control bg-light border-0 shadow-sm" style={{ borderRadius: 14 }} onChange={handleChange} />
        </div>
      )}
      {role === "government_official" && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Government ID / Badge</label>
          <input type="file" name="gov_id_badge" className="form-control bg-light border-0 shadow-sm" style={{ borderRadius: 14 }} onChange={handleChange} />
        </div>
      )}
      {role === "farmer" && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Profile Image (optional)</label>
          <input type="file" name="profile_image" className="form-control bg-light border-0 shadow-sm" style={{ borderRadius: 14 }} onChange={handleChange} />
        </div>
      )}
      {error && <div className="alert alert-danger border-0" style={{ borderRadius: 14, fontSize: 16 }}>{error}</div>}
      {success && <div className="alert alert-success border-0" style={{ borderRadius: 14, fontSize: 16 }}>{success}</div>}
      <button type="submit" className="btn btn-success btn-lg w-100 fw-bold mt-2 shadow-sm" style={{ borderRadius: 14, background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)", border: "none", fontSize: 20 }} disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
} 