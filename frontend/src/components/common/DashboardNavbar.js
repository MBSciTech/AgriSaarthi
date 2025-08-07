import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);

  // Navigation links (can be extended)
  const navLinks = [
    { label: "Dashboard", icon: "fa-home", href: "/dashboard" },
    { label: "Profile", icon: "fa-user", href: "/profile" },
    { label: "Weather", icon: "fa-cloud-sun", href: "/weather", isWeather: true },
    { label: "Market", icon: "fa-chart-line", href: "/market" },
    { label: "Alerts", icon: "fa-bell", href: "/Alerts" },
    { label: "Logout", icon: "fa-sign-out-alt", href: "/logout" },
  ];

  return (
    <>
      <style>{`
        .dashboard-navbar-glass {
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 8px 32px 0 rgba(34,139,34,0.12);
          backdrop-filter: blur(12px);
          border-radius: 18px;
          border: 1.5px solid #e6f4ea;
          transition: box-shadow 0.2s, transform 0.2s, width 0.3s;
        }
        .dashboard-navbar-glass:hover {
          box-shadow: 0 12px 40px 0 rgba(34,139,34,0.18);
          transform: translateY(-2px) scale(1.01);
        }
        .dashboard-navbar-link {
          transition: background 0.18s, color 0.18s, transform 0.18s;
        }
        .dashboard-navbar-link:hover, .dashboard-navbar-link.active {
          background: linear-gradient(90deg, #e6f4ea 0%, #d0f5e8 100%);
          color: #218c74 !important;
          transform: scale(1.04);
        }
        .dashboard-navbar-icon {
          filter: drop-shadow(0 1px 2px rgba(34,139,34,0.08));
        }
        .dashboard-navbar-mobile-glass {
          background: rgba(255,255,255,0.92) !important;
          backdrop-filter: blur(10px);
          border-top-left-radius: 18px;
          border-top-right-radius: 18px;
          border-top: 1.5px solid #e6f4ea;
        }
      `}</style>
      {/* Sidebar for desktop/tablet */}
      <nav
        className={`d-none d-lg-flex flex-column align-items-center position-fixed top-0 start-0 h-100 z-2 transition dashboard-navbar-glass`}
        style={{ width: open ? 220 : 56, minHeight: "90vh", borderRadius:'0px 18px 18px 0px', transition: "width 0.3s",marginLeft:'0px' }}
      >
        {/* Hamburger/stack icon always at the top */}
        <button
          className="btn btn-success mt-3 mb-4"
          style={{ borderRadius: 50, width: 40, height: 40, boxShadow: '0 2px 8px rgba(34,139,34,0.08)' }}
          onClick={() => setOpen((o) => !o)}
        >
          <i className="fas fa-bars fa-lg dashboard-navbar-icon"></i>
        </button>
        <ul className="nav flex-column w-100 align-items-center" style={{ flex: 1 }}>
          {navLinks.map((link) => (
            <li className="nav-item mb-2 w-100" key={link.label}>
              {link.isWeather ? (
                <Link
                  className={`nav-link d-flex align-items-center dashboard-navbar-link ${open ? "justify-content-start" : "justify-content-center"} text-dark fw-semibold`}
                  to={link.href}
                  style={{ borderRadius: 12, padding: open ? "10px 16px" : "10px 0", width: "100%" }}
                  title={!open ? link.label : undefined}
                >
                  <span style={{ width: 32, display: "flex", justifyContent: "center" }}>
                    <i className={`fas ${link.icon} dashboard-navbar-icon`} style={{ fontSize: 20 }}></i>
                  </span>
                  {open && <span className="ms-2">{link.label}</span>}
                </Link>
              ) : (
                <a
                  className={`nav-link d-flex align-items-center dashboard-navbar-link ${open ? "justify-content-start" : "justify-content-center"} text-dark fw-semibold`}
                  href={link.href}
                  style={{ borderRadius: 12, padding: open ? "10px 16px" : "10px 0", width: "100%" }}
                  title={!open ? link.label : undefined}
                >
                  <span style={{ width: 32, display: "flex", justifyContent: "center" }}>
                    <i className={`fas ${link.icon} dashboard-navbar-icon`} style={{ fontSize: 20 }}></i>
                  </span>
                  {open && <span className="ms-2">{link.label}</span>}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {/* Hamburger/stack icon for toggling on mobile */}
      <button
        className="btn btn-success d-lg-none position-fixed bottom-0 start-0 mb-2 ms-2 z-3"
        style={{ borderRadius: 50, width: 56, height: 56, boxShadow: '0 2px 8px rgba(34,139,34,0.10)' }}
        onClick={() => setOpen((o) => !o)}
      >
        <i className="fas fa-bars fa-lg dashboard-navbar-icon"></i>
      </button>
      {/* Bottom navbar for mobile */}
      <nav
        className="d-lg-none navbar fixed-bottom navbar-light bg-white shadow-lg border-top z-2 dashboard-navbar-mobile-glass"
        style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
      >
        <div className="container-fluid justify-content-around px-0">
          {navLinks.map((link) => (
            link.isWeather ? (
              <Link
                key={link.label}
                to={link.href}
                className="nav-link text-success text-center px-2 dashboard-navbar-link"
                style={{ fontSize: 18 }}
              >
                <i className={`fas ${link.icon} dashboard-navbar-icon`}></i>
                <div style={{ fontSize: 10 }}>{link.label}</div>
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-success text-center px-2 dashboard-navbar-link"
                style={{ fontSize: 18 }}
              >
                <i className={`fas ${link.icon} dashboard-navbar-icon`}></i>
                <div style={{ fontSize: 10 }}>{link.label}</div>
              </a>
            )
          ))}
        </div>
      </nav>
    </>
  );
} 