import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ phone: "", name: "", region: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="text-center mb-4">{isLogin ? "Farmer Login" : "Farmer Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          {!isLogin && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="region"
                  placeholder="Region"
                  value={form.region}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </>
          )}
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}
          <button type="submit" className="btn btn-success w-100">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
} 