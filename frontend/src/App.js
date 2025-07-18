import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RoleSelection from "./pages/RoleSelection";
import Profile from "./pages/Profile";
import Weather from "./pages/Weather";
import Market from "./pages/Market";

function App() {
  // Simulate getting user role from localStorage or API (replace with real logic)
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={token && userRole ? <Dashboard /> : <Navigate to="/select-role" />} />
        <Route path="/select-role" element={token && !userRole ? <RoleSelection /> : <Navigate to="/dashboard" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/market" element={<Market />} />
      </Routes>
    </Router>
  );
}

export default App;
