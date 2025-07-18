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
      {/* Sidebar for desktop/tablet */}
      <nav
        className={`d-none d-lg-flex flex-column align-items-center position-fixed top-0 start-0 h-100 z-2 transition bg-white`}
        style={{ width: open ? 220 : 56, minHeight: "100vh", borderRadius: 18, transition: "width 0.3s",marginLeft:'10px'
          
        }}
      >
        {/* Hamburger/stack icon always at the top */}
        <button
          className="btn btn-success mt-3 mb-4"
          style={{ borderRadius: 50, width: 40, height: 40 }}
          onClick={() => setOpen((o) => !o)}
        >
          <i className="fas fa-bars fa-lg"></i>
        </button>
        <ul className="nav flex-column w-100 align-items-center" style={{ flex: 1 }}>
          {navLinks.map((link) => (
            <li className="nav-item mb-2 w-100" key={link.label}>
              {link.isWeather ? (
                <Link
                  className={`nav-link d-flex align-items-center ${open ? "justify-content-start" : "justify-content-center"} text-dark fw-semibold`}
                  to={link.href}
                  style={{ borderRadius: 12, padding: open ? "10px 16px" : "10px 0", width: "100%" }}
                  title={!open ? link.label : undefined}
                >
                  <span style={{ width: 32, display: "flex", justifyContent: "center" }}>
                    <i className={`fas ${link.icon}`} style={{ fontSize: 20 }}></i>
                  </span>
                  {open && <span className="ms-2">{link.label}</span>}
                </Link>
              ) : (
                <a
                  className={`nav-link d-flex align-items-center ${open ? "justify-content-start" : "justify-content-center"} text-dark fw-semibold`}
                  href={link.href}
                  style={{ borderRadius: 12, padding: open ? "10px 16px" : "10px 0", width: "100%" }}
                  title={!open ? link.label : undefined}
                >
                  <span style={{ width: 32, display: "flex", justifyContent: "center" }}>
                    <i className={`fas ${link.icon}`} style={{ fontSize: 20 }}></i>
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
        style={{ borderRadius: 50, width: 56, height: 56 }}
        onClick={() => setOpen((o) => !o)}
      >
        <i className="fas fa-bars fa-lg"></i>
      </button>

      {/* Bottom navbar for mobile */}
      <nav
        className="d-lg-none navbar fixed-bottom navbar-light bg-white shadow-lg border-top z-2"
        style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
      >
        <div className="container-fluid justify-content-around px-0">
          {navLinks.map((link) => (
            link.isWeather ? (
              <Link
                key={link.label}
                to={link.href}
                className="nav-link text-success text-center px-2"
                style={{ fontSize: 18 }}
              >
                <i className={`fas ${link.icon}`}></i>
                <div style={{ fontSize: 10 }}>{link.label}</div>
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-success text-center px-2"
                style={{ fontSize: 18 }}
              >
                <i className={`fas ${link.icon}`}></i>
                <div style={{ fontSize: 10 }}>{link.label}</div>
              </a>
            )
          ))}
        </div>
      </nav>
    </>
  );
} 