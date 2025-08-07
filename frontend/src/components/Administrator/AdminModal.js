import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminModal({ isOpen, onClose, type, editingItem, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data when editing
  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({});
    }
  }, [editingItem, isOpen]);

  const token = localStorage.getItem("token");
  const config = { 
    headers: { 
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    } 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let url = "";
      let data = { ...formData };
      let method = "post";

      if (editingItem) {
        // Update existing item
        switch (type) {
          case "user":
            url = `http://localhost:8000/api/admin/users/${editingItem.id}/`;
            method = "patch";
            break;
          case "blog":
            url = `http://localhost:8000/api/admin/blogs/${editingItem.id}/`;
            method = "patch";
            break;
          case "scheme":
            url = `http://localhost:8000/api/admin/schemes/${editingItem.id}/`;
            method = "patch";
            break;
          default:
            throw new Error("Invalid type");
        }
      } else {
        // Create new item
        switch (type) {
          case "user":
            url = "http://localhost:8000/api/users/register/";
            break;
          case "blog":
            url = "http://localhost:8000/api/users/blogs/create/";
            break;
          case "scheme":
            url = "http://localhost:8000/api/users/schemes/";
            break;
          default:
            throw new Error("Invalid type");
        }
      }

      if (method === "post") {
        await axios.post(url, data, config);
      } else {
        await axios.patch(url, data, config);
      }
      
      setFormData({});
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Modal submission error:", err);
      setError(err.response?.data?.error || err.response?.data || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const renderUserForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name *</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone *</label>
        <input
          type="text"
          name="phone"
          className="form-control"
          value={formData.phone || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password *</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={formData.password || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Role *</label>
        <select
          name="role"
          className="form-select"
          value={formData.role || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="farmer">Farmer</option>
          <option value="expert_advisor">Expert Advisor</option>
          <option value="government_official">Government Official</option>
          <option value="retailer">Retailer</option>
          <option value="administrator">Administrator</option>
        </select>
      </div>
    </form>
  );

  const renderBlogForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Content *</label>
        <textarea
          name="content"
          className="form-control"
          rows="4"
          value={formData.content || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Visibility</label>
        <select
          name="visibility"
          className="form-select"
          value={formData.visibility || "public"}
          onChange={handleChange}
        >
          <option value="public">Public</option>
          <option value="followers">Followers Only</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          className="form-control"
          value={formData.tags || ""}
          onChange={handleChange}
        />
      </div>
    </form>
  );

  const renderSchemeForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Scheme Name *</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Benefits *</label>
        <textarea
          name="benefit"
          className="form-control"
          rows="3"
          value={formData.benefit || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Eligibility *</label>
        <textarea
          name="eligibility"
          className="form-control"
          rows="3"
          value={formData.eligibility || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Required Documents *</label>
        <textarea
          name="docs"
          className="form-control"
          rows="2"
          value={formData.docs || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Application URL *</label>
        <input
          type="url"
          name="apply_url"
          className="form-control"
          value={formData.apply_url || ""}
          onChange={handleChange}
          required
        />
      </div>
    </form>
  );

  const getTitle = () => {
    const action = editingItem ? "Edit" : "Add New";
    switch (type) {
      case "user": return `${action} User`;
      case "blog": return `${action} Blog`;
      case "scheme": return `${action} Scheme`;
      default: return `${action} Item`;
    }
  };

  const renderForm = () => {
    switch (type) {
      case "user": return renderUserForm();
      case "blog": return renderBlogForm();
      case "scheme": return renderSchemeForm();
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block' }} 
      tabIndex="-1"
      onClick={handleBackdropClick}
      onKeyDown={handleEscapeKey}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content" style={{ borderRadius: 16 }}>
          <div className="modal-header" style={{ borderBottom: '1px solid #e6f4ea' }}>
            <h5 className="modal-title fw-bold">{getTitle()}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {renderForm()}
          </div>
          <div className="modal-footer" style={{ borderTop: '1px solid #e6f4ea' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : (editingItem ? "Update" : "Create")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 