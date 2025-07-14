import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/common/DashboardNavbar";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

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
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8000/api/users/profile/", form, {
        headers: { Authorization: `Token ${token}` },
      });
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      setProfile(form);
    } catch (err) {
      setError("Failed to update profile. Please check your details and try again.");
    } finally {
      setSaving(false);
    }
  };

  // Role-based field configuration
  const roleFieldConfig = {
    farmer: [
      { key: 'phone', label: 'Phone', icon: 'fa-phone' },
      { key: 'region', label: 'Region', icon: 'fa-map-marker-alt' },
      { key: 'village', label: 'Village', icon: 'fa-home' },
      { key: 'main_crops', label: 'Main Crops', icon: 'fa-seedling' },
      { key: 'farm_size', label: 'Farm Size', icon: 'fa-warehouse' },
      { key: 'preferred_language', label: 'Preferred Language', icon: 'fa-language' },
      { key: 'type_of_farming', label: 'Type of Farming', icon: 'fa-tractor' },
    ],
    expert_advisor: [
      { key: 'phone', label: 'Phone', icon: 'fa-phone' },
      { key: 'region', label: 'Region', icon: 'fa-map-marker-alt' },
      { key: 'expertise_area', label: 'Expertise Area', icon: 'fa-user-graduate' },
      { key: 'experience_years', label: 'Experience (Years)', icon: 'fa-award' },
      { key: 'languages_spoken', label: 'Languages Spoken', icon: 'fa-language' },
      { key: 'available_for_consult', label: 'Available for Consult', icon: 'fa-comments' },
    ],
    administrator: [
      { key: 'phone', label: 'Phone', icon: 'fa-phone' },
      { key: 'email', label: 'Email', icon: 'fa-envelope' },
      { key: 'designation', label: 'Designation', icon: 'fa-user-tie' },
      { key: 'region_of_responsibility', label: 'Region of Responsibility', icon: 'fa-map' },
      { key: 'access_level', label: 'Access Level', icon: 'fa-key' },
      { key: 'employee_id', label: 'Employee ID', icon: 'fa-id-badge' },
    ],
    retailer: [
      { key: 'phone', label: 'Phone', icon: 'fa-phone' },
      { key: 'business_name', label: 'Business Name', icon: 'fa-store' },
      { key: 'location', label: 'Location', icon: 'fa-map-marker-alt' },
      { key: 'type_of_business', label: 'Type of Business', icon: 'fa-briefcase' },
      { key: 'interested_crops', label: 'Interested Crops', icon: 'fa-seedling' },
    ],
    government_official: [
      { key: 'phone', label: 'Phone', icon: 'fa-phone' },
      { key: 'email', label: 'Email', icon: 'fa-envelope' },
      { key: 'designation', label: 'Designation', icon: 'fa-user-tie' },
      { key: 'department', label: 'Department', icon: 'fa-building' },
      { key: 'region_of_responsibility', label: 'Region of Responsibility', icon: 'fa-map' },
      { key: 'govt_id', label: 'Govt. ID', icon: 'fa-id-card' },
    ],
  };

  // Role-based profile images
  const roleImage = {
    farmer: '/images/roles/farmer.png',
    administrator: '/images/roles/administrator.png',
    government_official: '/images/roles/government_official.png',
    expert_advisor: '/images/roles/expert_advisor.png',
    retailer: '/images/roles/retailer.png',
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "rgb(3, 98, 76)",
        position: "relative",
      }}
    >
      <DashboardNavbar />
      <div className="container py-3 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div
          className="glass-card position-relative p-4 p-md-5 mb-5 w-100 d-flex flex-column align-items-center"
          style={{
            borderRadius: 32,
            maxWidth: 1080,
            width: "100%",
            boxShadow: "0 8px 32px 0 rgba(34,139,34,0.18)",
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.92)",
          }}
        >
          {/* Avatar, Name, Role */}
          <div className="d-flex flex-row align-items-center w-100 mb-4" style={{gap: 24}}>
            <img
              src={roleImage[profile?.role] || "/images/roles/farmer.png"}
              alt="Profile"
              style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover", border: "4px solid rgb(3, 98, 76)", background: "#fff", boxShadow: "0 2px 8px #0002" }}
            />
            <div>
              <h2 className="mb-1 text-success fw-bold" style={{ fontSize: 28 }}>
                {profile?.name}
              </h2>
              <div className="text-muted" style={{ fontSize: 16 }}>
                <i className="fas fa-user-tag me-2"></i>{profile?.role}
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', width: '110%', marginBottom: 24 }}>
            <div 
              style={{ 
                width: '100%', 
                borderBottom: '2px dashed gray', 
                borderBottomStyle: 'dashed', 
                borderBottomWidth: 2, 
                borderBottomColor: 'gray',
                backgroundImage: 'repeating-linear-gradient(to right, gray 0, gray 40px, transparent 40px, transparent 72px)',
                backgroundPosition: 'bottom',
                backgroundRepeat: 'repeat-x',
                backgroundSize: '72px 2px',
                position: 'relative',
                height: 0
              }} 
            />
            {/* Left notch */}
            <div style={{ position: 'absolute', left: -10, top: -8, width: 20, height: 20, backgroundColor: 'rgb(3, 98, 76)', borderRadius: '50%', zIndex: 2 }} />
            {/* Right notch */}
            <div style={{ position: 'absolute', right: -10, top: -8, width: 20, height: 20, backgroundColor: 'rgb(3, 98, 76)', borderRadius: '50%', zIndex: 2 }} />
          </div>

          {/* Info Grid */}
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : profile ? (
            <>
              {success && <div className="alert alert-success text-center">{success}</div>}
              <div className="row w-100 g-3 mb-2">
                {(roleFieldConfig[profile.role] || Object.keys(profile).map(key => ({ key, label: key, icon: 'fa-info-circle' }))).map(field => (
                  <div className="col-12 col-md-6" key={field.key}>
                    <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 shadow-sm h-100">
                      <i className={`fas ${field.icon} fa-lg text-success me-3`}></i>
                      <div>
                        <div className="fw-semibold text-secondary small">{field.label}</div>
                        <div className="fw-bold">{profile[field.key] || '-'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Debug: Show raw profile JSON for troubleshooting */}
              <details className="mt-4 w-100">
                <summary style={{ cursor: 'pointer', color: '#888', fontSize: 14 }}>Show raw profile JSON (debug)</summary>
                <pre style={{ fontSize: 12, background: '#f8f9fa', borderRadius: 8, padding: 12, marginTop: 8, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(profile, null, 2)}</pre>
              </details>

              {/* Edit Mode Overlay */}
              {editMode && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(255,255,255,0.96)", borderRadius: 32, zIndex: 10 }}>
                  <form onSubmit={handleSave} className="w-100 px-2 px-md-4" style={{ maxWidth: 420 }} autoComplete="off">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-user me-2"></i>Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-lg"
                        value={form.name || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-phone me-2"></i>Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control form-control-lg"
                        value={form.phone || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-map-marker-alt me-2"></i>Region
                      </label>
                      <input
                        type="text"
                        name="region"
                        className="form-control form-control-lg"
                        value={form.region || form.state || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-seedling me-2"></i>Main Crops
                      </label>
                      <input
                        type="text"
                        name="main_crops"
                        className="form-control form-control-lg"
                        value={form.main_crops || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-warehouse me-2"></i>Farm Size
                      </label>
                      <input
                        type="text"
                        name="farm_size"
                        className="form-control form-control-lg"
                        value={form.farm_size || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                      <button
                        type="button"
                        className="btn btn-secondary btn-lg fw-bold"
                        style={{ borderRadius: 16 }}
                        onClick={() => { setEditMode(false); setForm(profile); }}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success btn-lg fw-bold"
                        style={{ borderRadius: 16 }}
                        disabled={saving}
                      >
                        {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-save me-2"></i>}
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Floating Edit Button */}
              {!editMode && (
                <button
                  className="btn btn-success rounded-circle position-absolute"
                  style={{ right: 24, bottom: 24, width: 56, height: 56, zIndex: 5, boxShadow: "0 4px 16px #28a74544" }}
                  onClick={() => setEditMode(true)}
                  title="Edit Profile"
                >
                  <i className="fas fa-edit fa-lg"></i>
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
} 