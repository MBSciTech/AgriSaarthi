import React, { useState, useEffect } from "react";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import GovernmentOfficialProfileForm from "../../components/GovernmentOfficial/GovernmentOfficialProfileForm";
import ProfileCard from "../../components/common/ProfileCard";
import WeatherCard from "../../components/common/WeatherCard";
import MarketCard from "../../components/common/MarketCard";
import AlertsCard from "../../components/common/AlertsCard";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function GovernmentOfficialDashboardHeader({ name }) {
  return (
    <div className="glass-card py-3 px-3 d-flex flex-row align-items-center w-100 mb-4" style={{ maxWidth: 1080 }}>
      <span className="fw-bold" style={{ fontSize: 22 }}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 10 }}>
          <a href="/profile" title="View Profile">
            <img src="/images/roles/government_official.png" alt="Profile" style={{
              width: 38, height: 38, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid rgb(9, 98, 76)', background: '#fff', cursor: 'pointer'
            }} />
          </a>
        </span>
        Namaste {name ? `, ${name}` : ""}!
      </span>
    </div>
  );
}

export default function GovernmentOfficialDashboard({ profile = {} }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentScheme, setCurrentScheme] = useState({});

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:8000/api/farmers/schemes/");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSchemes(data);
      } catch (err) {
        setError("Failed to fetch government schemes.");
        console.error("Error fetching schemes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const openModal = (scheme) => {
    setCurrentScheme(scheme);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentScheme({ ...currentScheme, [name]: value });
  };

  const handleUpdateScheme = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/farmers/schemes/${currentScheme.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(currentScheme),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setSchemes(schemes.map(s => s.id === updated.id ? updated : s));
      closeModal();
    } catch (error) {
      console.error("Failed to update scheme:", error);
      alert("Failed to update scheme.");
    }
  };

  const schemesStyle = {
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.73)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
    },
    cardHover: {
      transform: 'translateY(-5px) scale(1.02)',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
    },
    heading: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#074836',
      marginBottom: '10px',
      borderBottom: '2px solid #236547',
      paddingBottom: '8px',
    },
    text: {
      fontSize: '16px',
      color: '#444',
      marginBottom: '8px',
      lineHeight: '1.6',
    },
    label: {
      fontWeight: '700',
      color: '#111',
      marginRight: '8px',
      minWidth: '100px',
      display: 'inline-block',
    },
    detailRow: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '8px',
    },
    button: {
      marginTop: '20px',
      padding: '12px 24px',
      backgroundColor: '#236547',
      color: '#fff',
      border: 'none',
      borderRadius: '50px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#164531',
      transform: 'translateY(-2px)',
    },
  };

  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '30px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    },
  };

  return (
    <div id="root" style={{ minHeight: "100vh", background: "rgb(3, 98, 76)", overflowX: "hidden" }}>
      <DashboardNavbar />
      <div className="container py-3 px-2 px-md-4 d-flex flex-column align-items-center">
        <GovernmentOfficialDashboardHeader name={profile.name} />

        <div className="row g-4 w-100 h-100" style={{ maxWidth: 1200 }}>
          <div className="col-12 col-md-6 col-lg-3"><ProfileCard profile={profile} /></div>
          <div className="col-12 col-md-6 col-lg-3"><WeatherCard /></div>
          <div className="col-12 col-md-6 col-lg-3"><MarketCard /></div>
          <div className="col-12 col-md-6 col-lg-3"><AlertsCard /></div>
        </div>

        <div className="row g-4 w-100 mt-4" style={{ maxWidth: 1200 }}>
          <div className="col-12">
            <h4 className="text-white mb-3">Government Schemes</h4>
            {loading ? <p className="text-light">Loading schemes...</p> :
              error ? <p className="text-danger">{error}</p> :
                schemes.length === 0 ? <p className="text-light">No schemes available at the moment.</p> :
                  schemes.map((scheme, index) => (
                    <div key={index}
                      style={schemesStyle.card}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, schemesStyle.cardHover)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, schemesStyle.card)}
                    >
                      <h5 style={schemesStyle.heading}>{scheme.name}</h5>
                      <div style={schemesStyle.detailRow}>
                        <span style={schemesStyle.label}>Benefit:</span>
                        <span style={schemesStyle.text}>{scheme.benefit}</span>
                      </div>
                      <div style={schemesStyle.detailRow}>
                        <span style={schemesStyle.label}>Eligibility:</span>
                        <span style={schemesStyle.text}>{scheme.eligibility}</span>
                      </div>
                      <div style={schemesStyle.detailRow}>
                        <span style={schemesStyle.label}>Documents:</span>
                        <span style={schemesStyle.text}>{scheme.docs}</span>
                      </div>
                      <button
                        onClick={() => openModal(scheme)}
                        style={schemesStyle.button}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, schemesStyle.buttonHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, schemesStyle.button)}
                      >
                        Edit Scheme
                      </button>
                    </div>
                  ))
            }
          </div>
        </div>
      </div>

      {/* Modal for Editing */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
        <h2 style={{ color: '#074836', marginBottom: '20px' }}>Edit Scheme</h2>
        <form onSubmit={handleUpdateScheme}>
          {['name', 'benefit', 'eligibility', 'docs', 'apply_url'].map(field => (
            <div key={field} style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                {field === 'apply_url' ? 'Application URL' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field === 'benefit' || field === 'eligibility' ? (
                <textarea name={field} value={currentScheme[field] || ''} onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
              ) : (
                <input type="text" name={field} value={currentScheme[field] || ''} onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={closeModal} style={{
              padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer'
            }}>Cancel</button>
            <button type="submit" style={{
              padding: '10px 20px', borderRadius: '8px', border: 'none',
              backgroundColor: '#236547', color: '#fff', cursor: 'pointer'
            }}>Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
