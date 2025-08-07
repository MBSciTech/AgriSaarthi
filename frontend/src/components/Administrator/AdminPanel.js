import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminModal from "./AdminModal";

export default function AdminPanel({ profile }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalSchemes: 0,
    usersByRole: {}
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const token = localStorage.getItem("token");
  const config = { 
    headers: { 
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    } 
  };

  // Check if user is authenticated and has admin role
  const checkAuth = () => {
    if (!token) {
      setError("No authentication token found. Please login again.");
      return false;
    }
    if (!profile || profile.role !== 'administrator') {
      setError("Admin access required. You don't have administrator privileges.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!checkAuth()) return;
    
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "blogs") {
      fetchBlogs();
    } else if (activeTab === "schemes") {
      fetchSchemes();
    } else if (activeTab === "dashboard") {
      fetchStats();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8000/api/admin/users/", config);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to fetch users: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8000/api/admin/blogs/", config);
      setBlogs(response.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to fetch blogs: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSchemes = async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8000/api/admin/schemes/", config);
      setSchemes(response.data);
    } catch (err) {
      console.error("Error fetching schemes:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to fetch schemes: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8000/api/admin/stats/", config);
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to fetch statistics: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    if (!checkAuth()) return;
    
    try {
      if (action === "delete") {
        await axios.delete(`http://localhost:8000/api/admin/users/${userId}/`, config);
        setSuccess("User deleted successfully");
      } else if (action === "toggle_active") {
        await axios.patch(`http://localhost:8000/api/admin/users/${userId}/`, 
          { is_active: !users.find(u => u.id === userId)?.is_active }, config);
        setSuccess("User status updated");
      }
      fetchUsers();
    } catch (err) {
      console.error("Error performing user action:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to perform action: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleBlogAction = async (blogId, action) => {
    if (!checkAuth()) return;
    
    try {
      if (action === "delete") {
        await axios.delete(`http://localhost:8000/api/admin/blogs/${blogId}/`, config);
        setSuccess("Blog deleted successfully");
      }
      fetchBlogs();
    } catch (err) {
      console.error("Error performing blog action:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to perform action: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleSchemeAction = async (schemeId, action) => {
    if (!checkAuth()) return;
    
    try {
      if (action === "delete") {
        await axios.delete(`http://localhost:8000/api/admin/schemes/${schemeId}/`, config);
        setSuccess("Scheme deleted successfully");
      }
      fetchSchemes();
    } catch (err) {
      console.error("Error performing scheme action:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to perform action: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleAddItem = (type) => {
    if (!checkAuth()) return;
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditItem = (type, item) => {
    if (!checkAuth()) return;
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    if (modalType === "user") {
      fetchUsers();
    } else if (modalType === "blog") {
      fetchBlogs();
    } else if (modalType === "scheme") {
      fetchSchemes();
    }
    setSuccess(`${modalType} created successfully`);
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear success after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Check if user has admin access
  if (!profile || profile.role !== 'administrator') {
    return (
      <div className="glass-card p-5 text-center">
        <div className="mb-4">
          <i className="fas fa-shield-alt fa-3x text-warning"></i>
        </div>
        <h4 className="text-warning mb-3">Access Denied</h4>
        <p className="text-muted">
          You need administrator privileges to access this panel.
          <br />
          Current role: {profile?.role || 'Unknown'}
        </p>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="row g-4">
      <div className="col-12 col-md-6 col-lg-3">
        <div className="glass-card p-4 text-center">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" 
               style={{ width: 60, height: 60, background: "linear-gradient(135deg, #10b981, #14b8a6)", borderRadius: 15 }}>
            <i className="fas fa-users text-white" style={{ fontSize: 24 }}></i>
          </div>
          <h3 className="fw-bold text-success mb-1">{stats.totalUsers}</h3>
          <p className="text-muted mb-0">Total Users</p>
        </div>
      </div>
      
      <div className="col-12 col-md-6 col-lg-3">
        <div className="glass-card p-4 text-center">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" 
               style={{ width: 60, height: 60, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", borderRadius: 15 }}>
            <i className="fas fa-blog text-white" style={{ fontSize: 24 }}></i>
          </div>
          <h3 className="fw-bold text-primary mb-1">{stats.totalBlogs}</h3>
          <p className="text-muted mb-0">Total Blogs</p>
        </div>
      </div>
      
      <div className="col-12 col-md-6 col-lg-3">
        <div className="glass-card p-4 text-center">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" 
               style={{ width: 60, height: 60, background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: 15 }}>
            <i className="fas fa-file-contract text-white" style={{ fontSize: 24 }}></i>
          </div>
          <h3 className="fw-bold text-warning mb-1">{stats.totalSchemes}</h3>
          <p className="text-muted mb-0">Government Schemes</p>
        </div>
      </div>
      
      <div className="col-12 col-md-6 col-lg-3">
        <div className="glass-card p-4 text-center">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" 
               style={{ width: 60, height: 60, background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", borderRadius: 15 }}>
            <i className="fas fa-chart-line text-white" style={{ fontSize: 24 }}></i>
          </div>
          <h3 className="fw-bold text-purple mb-1">{Object.keys(stats.usersByRole || {}).length}</h3>
          <p className="text-muted mb-0">User Roles</p>
        </div>
      </div>

      <div className="col-12">
        <div className="glass-card p-4">
          <h5 className="fw-bold mb-3">Users by Role</h5>
          <div className="row g-3">
            {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
              <div key={role} className="col-12 col-md-6 col-lg-3">
                <div className="d-flex align-items-center p-3" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10 }}>
                  <div className="me-3">
                    <i className={`fas fa-user-${role === 'farmer' ? 'tractor' : role === 'expert_advisor' ? 'graduation-cap' : role === 'government_official' ? 'landmark' : role === 'retailer' ? 'store' : 'shield'} text-success`}></i>
                  </div>
                  <div>
                    <div className="fw-bold">{role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <div className="text-muted">{count} users</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="glass-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">User Management</h5>
        <button className="btn btn-success btn-sm" onClick={() => handleAddItem("user")}>
          <i className="fas fa-plus me-1"></i>Add User
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img src={user.profile_image || "/images/roles/default.png"} 
                           alt="Profile" className="rounded-circle me-2" 
                           style={{ width: 32, height: 32, objectFit: "cover" }} />
                      {user.name}
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`badge bg-${user.role === 'farmer' ? 'success' : user.role === 'expert_advisor' ? 'info' : user.role === 'government_official' ? 'warning' : user.role === 'retailer' ? 'primary' : 'secondary'}`}>
                      {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${user.is_active ? 'success' : 'danger'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td>
                                      <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm" 
                            onClick={() => handleEditItem("user", user)} title="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-outline-warning btn-sm" 
                            onClick={() => handleUserAction(user.id, "toggle_active")} title="Toggle Status">
                      <i className="fas fa-toggle-on"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm" 
                            onClick={() => handleUserAction(user.id, "delete")} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderBlogs = () => (
    <div className="glass-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Blog Management</h5>
        <button className="btn btn-success btn-sm" onClick={() => handleAddItem("blog")}>
          <i className="fas fa-plus me-1"></i>Add Blog
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {blogs.map(blog => (
            <div key={blog.id} className="col-12 col-md-6 col-lg-4">
              <div className="glass-card p-3 h-100">
                {blog.image && (
                  <img src={blog.image} alt="Blog" className="w-100 mb-3" 
                       style={{ height: 150, objectFit: "cover", borderRadius: 10 }} />
                )}
                <h6 className="fw-bold mb-2">{blog.content.substring(0, 100)}...</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">By {blog.author_name}</small>
                  <small className="text-muted">{new Date(blog.created_at).toLocaleDateString()}</small>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-success me-1">
                      <i className="fas fa-heart me-1"></i>{blog.likes_count}
                    </span>
                    <span className="badge bg-info">
                      <i className="fas fa-comment me-1"></i>{blog.comments_count || 0}
                    </span>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm" 
                            onClick={() => handleEditItem("blog", blog)} title="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm" 
                            onClick={() => handleBlogAction(blog.id, "delete")} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSchemes = () => (
    <div className="glass-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Government Schemes</h5>
        <button className="btn btn-success btn-sm" onClick={() => handleAddItem("scheme")}>
          <i className="fas fa-plus me-1"></i>Add Scheme
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {schemes.map(scheme => (
            <div key={scheme.id} className="col-12 col-md-6 col-lg-4">
              <div className="glass-card p-3 h-100">
                <h6 className="fw-bold mb-2">{scheme.name}</h6>
                <p className="text-muted mb-3">{scheme.benefit.substring(0, 100)}...</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Eligibility: {scheme.eligibility.substring(0, 50)}...</small>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm" 
                            onClick={() => handleEditItem("scheme", scheme)} title="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm" 
                            onClick={() => handleSchemeAction(scheme.id, "delete")} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-panel">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {/* Tab Navigation */}
      <div className="glass-card p-3 mb-4">
        <div className="nav nav-pills nav-fill">
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}>
            <i className="fas fa-tachometer-alt me-2"></i>Dashboard
          </button>
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}>
            <i className="fas fa-users me-2"></i>Users
          </button>
          <button className={`nav-link ${activeTab === 'blogs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('blogs')}>
            <i className="fas fa-blog me-2"></i>Blogs
          </button>
          <button className={`nav-link ${activeTab === 'schemes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('schemes')}>
            <i className="fas fa-file-contract me-2"></i>Schemes
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'blogs' && renderBlogs()}
      {activeTab === 'schemes' && renderSchemes()}

      {/* Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        editingItem={editingItem}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
} 