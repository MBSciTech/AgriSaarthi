import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ phone: "", name: "", region: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const fetchAndStoreUserRole = async (token) => {
    try {
      const res = await axios.get("http://localhost:8000/api/users/profile/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data.role) {
        localStorage.setItem("userRole", res.data.role);
        window.location.href = "/dashboard";
      } else {
        localStorage.removeItem("userRole");
        window.location.href = "/select-role";
      }
    } catch (err) {
      navigate("/select-role");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (isLogin) {
        // Login
        const res = await axios.post("http://localhost:8000/api/users/login/", {
          phone: form.phone,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        setSuccess("Login successful!");
        await fetchAndStoreUserRole(res.data.token);
      } else {
        // Register
        const res = await axios.post("http://localhost:8000/api/users/register/", {
          phone: form.phone,
          name: form.name,
          region: form.region,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        setSuccess("Registration successful!");
        await fetchAndStoreUserRole(res.data.token);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        Object.values(err.response?.data || {}).join(" ") ||
        "Something went wrong."
      );
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column flex-lg-row" style={{ backgroundColor: "#003c14" }}>
      {/* Left Side - Agriculture Image & Branding */}
      <div
        className="d-none d-lg-flex col-lg-6 align-items-center justify-content-center position-relative"
        style={{
          backgroundImage: `url('/images/logInSignUp_template/backgroud_image.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh"
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "rgba(0,60,20,0.7)" }}></div>
        <div className="position-relative z-1 text-white text-center p-5" style={{ zIndex: 2 }}>
          <h1 className="display-3 fw-bold mb-3" style={{ textShadow: "0 2px 8px #0006" }}>
            <i className="fas fa-seedling me-2"></i>AgriSaarthi
          </h1>
          <p className="lead mb-4" style={{ textShadow: "0 2px 8px #0006" }}>
            Empowering Farmers with Smart Agricultural Solutions
          </p>
          <div className="d-flex justify-content-center gap-4 mt-4">
            <div>
              <i className="fas fa-leaf fa-2x mb-2"></i>
              <p className="small">Smart Farming</p>
            </div>
            <div>
              <i className="fas fa-chart-line fa-2x mb-2"></i>
              <p className="small">Market Insights</p>
            </div>
            <div>
              <i className="fas fa-users fa-2x mb-2"></i>
              <p className="small">Community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #003c14 0%, #0e4426 100%)" }}>
        <div className="w-100" style={{ maxWidth: 430 }}>
          <div
            className="card border-0 shadow-lg p-4"
            style={{
              background: "rgba(255,255,255,0.92)",
              borderRadius: 22,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px 0 rgba(34,139,34,0.18)",
              border: "1.5px solid #e6f4ea"
            }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold text-success mb-2">
                <i className="fas fa-seedling me-2"></i>
                {isLogin ? "Welcome Back!" : "Join AgriSaarthi"}
              </h2>
              <p className="text-muted mb-0">
                {isLogin ? "Sign in to your farming dashboard" : "Create your account to get started"}
              </p>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-3">
                <label className="form-label text-success fw-semibold">
                  <i className="fas fa-phone me-2"></i>Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control form-control-lg bg-light border-0 shadow-sm"
                  style={{ borderRadius: 14, fontSize: 18 }}
                  required
                />
              </div>
              {!isLogin && (
                <>
                  <div className="mb-3">
                    <label className="form-label text-success fw-semibold">
                      <i className="fas fa-user me-2"></i>Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      className="form-control form-control-lg bg-light border-0 shadow-sm"
                      style={{ borderRadius: 14, fontSize: 18 }}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-success fw-semibold">
                      <i className="fas fa-map-marker-alt me-2"></i>Region
                    </label>
                    <input
                      type="text"
                      name="region"
                      placeholder="Enter your region"
                      value={form.region}
                      onChange={handleChange}
                      className="form-control form-control-lg bg-light border-0 shadow-sm"
                      style={{ borderRadius: 14, fontSize: 18 }}
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-3">
                <label className="form-label text-success fw-semibold">
                  <i className="fas fa-lock me-2"></i>Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="form-control form-control-lg bg-light border-0 shadow-sm"
                    style={{ borderRadius: 14, fontSize: 18 }}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    tabIndex={-1}
                    style={{ borderTopRightRadius: 14, borderBottomRightRadius: 14 }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
              {error && (
                <div className="alert alert-danger border-0" style={{ borderRadius: 14, fontSize: 16 }}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success border-0" style={{ borderRadius: 14, fontSize: 16 }}>
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-success btn-lg w-100 fw-bold mt-2 shadow-sm"
                style={{ borderRadius: 14, background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)", border: "none", fontSize: 20 }}
              >
                <i className={`fas ${isLogin ? "fa-sign-in-alt" : "fa-user-plus"} me-2`}></i>
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
            <div className="text-center mt-4">
              <button
                className="btn btn-link text-success fw-semibold text-decoration-none"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                }}
                style={{ fontSize: 16 }}
              >
                <i className={`fas ${isLogin ? "fa-user-plus" : "fa-sign-in-alt"} me-2`}></i>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-muted small mb-0">
                <i className="fas fa-shield-alt me-1"></i>
                Your data is secure with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 