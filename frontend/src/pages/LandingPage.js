import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LandingPage() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold fs-3">
            <span role="img" aria-label="plant">🌱</span> AgriSaarthi
          </span>
          <div>
            <Link to="/auth" className="btn btn-outline-light fw-semibold">
              Login / Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center py-5 bg-success bg-gradient text-white">
        <h1 className="display-2 fw-bold mb-3">AgriSaarthi</h1>
        <p className="lead mb-4 fs-4">
          Empowering farmers with <span className="fw-bold text-warning">real-time crop prices</span>, <span className="fw-bold text-info">AI-powered predictions</span>, and the <span className="fw-bold text-warning">latest government schemes</span>.<br />
          Your digital assistant for smarter agriculture.
        </p>
        <Link to="/auth" className="btn btn-warning btn-lg px-5 py-3 fw-bold shadow">
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-success text-center fw-bold mb-5 fs-1">Platform Features</h2>
          <div className="row g-4">
            <FeatureCard
              icon="💹"
              title="Real-Time Crop Prices"
              desc="Access up-to-date market prices for your crops, anytime."
              color="primary"
            />
            <FeatureCard
              icon="🤖"
              title="AI Price Predictions"
              desc="See tomorrow’s prices with advanced AI and data science."
              color="info"
            />
            <FeatureCard
              icon="📜"
              title="Govt. Schemes"
              desc="Discover the latest government schemes tailored for you."
              color="warning"
            />
            <FeatureCard
              icon="🧑‍🌾"
              title="Digital Assistant"
              desc="Personalized insights and support for every farmer."
              color="success"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5 bg-success bg-opacity-10">
        <div className="container text-center">
          <h3 className="fw-bold text-success mb-3 fs-2">Our Mission</h3>
          <p className="fs-5 text-success">
            AgriSaarthi bridges the gap between technology and agriculture, helping farmers make informed decisions, reduce losses, and thrive in a digital world.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-3 text-center text-success bg-white border-top mt-auto">
        &copy; {new Date().getFullYear()} AgriSaarthi. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="col-12 col-md-6 col-lg-3">
      <div className={`card border-0 shadow h-100 bg-${color} bg-opacity-10`}>
        <div className="card-body text-center">
          <div className={`display-3 mb-3`}>{icon}</div>
          <h5 className={`card-title fw-bold text-${color}`}>{title}</h5>
          <p className="card-text text-secondary">{desc}</p>
        </div>
      </div>
    </div>
  );
} 