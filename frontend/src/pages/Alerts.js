import React, { useEffect, useState } from "react";
import DashboardNavbar from "../components/common/DashboardNavbar";

export default function Alerts() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:8000/api/farmers/schemes/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.benefit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LoadingCard = () => (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 border-0 shadow-lg" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px'
      }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div className="placeholder-glow">
              <span className="placeholder bg-success rounded-circle" style={{ width: '50px', height: '50px' }}></span>
            </div>
            <div className="ms-3 flex-grow-1">
              <div className="placeholder-glow">
                <span className="placeholder bg-secondary col-8"></span>
                <span className="placeholder bg-secondary col-6"></span>
              </div>
            </div>
          </div>
          <div className="placeholder-glow">
            <span className="placeholder bg-secondary col-12 mb-2"></span>
            <span className="placeholder bg-secondary col-8 mb-3"></span>
            <span className="placeholder bg-secondary col-10"></span>
          </div>
          <div className="d-flex gap-2 mt-3">
            <span className="placeholder bg-secondary col-6" style={{ height: '40px', borderRadius: '10px' }}></span>
            <span className="placeholder bg-secondary col-6" style={{ height: '40px', borderRadius: '10px' }}></span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleModalClose = () => {
    setSelected(null);
  };

  const handleViewDetails = (scheme) => {
    setSelected(scheme);
  };

  return (
    <>
      <div style={{ zIndex: 100, position: 'relative', }}>
        <DashboardNavbar />
      </div>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'rgb(3, 98, 76)',
        position: 'relative'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'rgba(187, 247, 208, 0.6)',
            borderRadius: '50%',
            top: '25%',
            left: '25%',
            filter: 'blur(40px)',
            animation: 'floatAnimation 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'rgba(167, 243, 208, 0.6)',
            borderRadius: '50%',
            bottom: '25%',
            right: '25%',
            filter: 'blur(40px)',
            animation: 'floatAnimation 6s ease-in-out infinite 2s'
          }}></div>
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'rgba(153, 246, 228, 0.6)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(40px)',
            animation: 'floatAnimation 6s ease-in-out infinite 4s'
          }}></div>
        </div>

        <div className="container-fluid py-5" style={{ position: 'relative', zIndex: 10 }}>
          <div className="container">
            {/* Header Section */}
            <div className="text-center mb-5">
              <div className="d-inline-flex align-items-center justify-content-center mb-4" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                borderRadius: '50%',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.3s ease'
              }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                 onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                <i className="fas fa-bell text-white" style={{ fontSize: '2rem', animation: 'bounce 2s infinite' }}></i>
              </div>
              
              <h1 className="display-3 fw-bold mb-3" style={{
                // background: 'linear-gradient(135deg, #059669, #0d9488)',
                WebkitBackgroundClip: 'text',
                // WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color:'rgba(255, 255, 255, 0.84)'
              }}>
                Government Schemes & Alerts
              </h1>
              <p className="lead text-muted mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                Discover and apply for the latest government schemes designed to support farmers
              </p>

              {/* Search Bar */}
              <div className="row justify-content-center mb-4">
                <div className="col-lg-4 col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Search schemes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        borderRadius: '15px 0 0 15px',
                        border: '2px solid #e5e7eb',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <span className="input-group-text" style={{
                      borderRadius: '0 15px 15px 0',
                      border: '2px solid #e5e7eb',
                      borderLeft: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      <i className="fas fa-search text-muted"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="row">
                {[1, 2, 3].map(i => <LoadingCard key={i} />)}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="alert alert-danger text-center rounded-4 shadow" style={{ borderRadius: '20px' }}>
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                </div>
              </div>
            )}

            {/* Schemes Grid */}
            {!loading && !error && filteredSchemes.length > 0 && (
              <div className="row">
                {filteredSchemes.map((scheme, idx) => (
                  <div key={idx} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 border-0 shadow-lg scheme-card" style={{
                      borderRadius: '25px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.4s ease',
                      cursor: 'pointer'
                    }}>
                      <div className="card-body p-4">
                        {/* Card Header */}
                        <div className="d-flex align-items-start mb-3">
                          <div className="flex-shrink-0 me-3">
                            <div style={{
                              width: '50px',
                              height: '50px',
                              background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                              borderRadius: '15px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 5px 15px rgba(16, 185, 129, 0.3)',
                              transition: 'transform 0.3s ease'
                            }}>
                              <i className="fas fa-certificate text-white"></i>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="card-title fw-bold text-dark mb-2" style={{ 
                              fontSize: '1.2rem',
                              lineHeight: '1.3',
                              transition: 'color 0.3s ease'
                            }}>
                              {scheme.name}
                            </h5>
                            {/* Additional info if available from backend */}
                            {(scheme.beneficiaries || scheme.deadline) && (
                              <div className="d-flex flex-wrap gap-2 mb-2">
                                {scheme.beneficiaries && (
                                  <small className="text-muted">
                                    <i className="fas fa-users me-1"></i>
                                    {scheme.beneficiaries}
                                  </small>
                                )}
                                {scheme.deadline && (
                                  <small className="text-muted">
                                    <i className="fas fa-calendar me-1"></i>
                                    Until {new Date(scheme.deadline).toLocaleDateString()}
                                  </small>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Benefit */}
                        <div className="mb-3 p-3" style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: '15px',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-check-circle text-success me-2"></i>
                            <small className="fw-bold text-success">Benefit</small>
                          </div>
                          <p className="mb-0 text-dark fw-medium" style={{ fontSize: '0.9rem' }}>
                            {scheme.benefit}
                          </p>
                        </div>

                        {/* Eligibility */}
                        <div className="mb-4">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-file-text text-muted me-2"></i>
                            <small className="fw-bold text-muted">Eligibility</small>
                          </div>
                          <p className="text-muted mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                            {scheme.eligibility.length > 80 ? scheme.eligibility.slice(0, 80) + '...' : scheme.eligibility}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleViewDetails(scheme)}
                            className="btn flex-fill"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              border: '2px solid #10b981',
                              color: '#10b981',
                              borderRadius: '12px',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#f0fdf4';
                              e.target.style.borderColor = '#059669';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                              e.target.style.borderColor = '#10b981';
                            }}
                          >
                            <i className="fas fa-eye me-2"></i>
                            View Details
                          </button>
                          <a
                            href={scheme.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success flex-fill"
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                              border: 'none',
                              borderRadius: '12px',
                              fontWeight: '600',
                              transition: 'all 0.3s ease',
                              textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #059669, #0f766e)';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #10b981, #14b8a6)';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            <i className="fas fa-external-link-alt me-2"></i>
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredSchemes.length === 0 && (
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="text-center p-5" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '25px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}>
                    <i className="fas fa-bell text-muted mb-3" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                    <h3 className="fw-bold text-muted mb-2">No Schemes Found</h3>
                    <p className="text-muted">
                      {searchTerm ? `No schemes match "${searchTerm}"` : "No government schemes available at the moment."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Modal */}
        {selected && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0" style={{ borderRadius: '25px', overflow: 'hidden' }}>
                {/* Modal Header */}
                <div className="modal-header text-white position-relative" style={{
                  background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                  border: 'none',
                  padding: '2rem'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}></div>
                  <div className="d-flex align-items-start w-100 position-relative">
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="me-3" style={{
                        width: '50px',
                        height: '50px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className="fas fa-certificate text-white"></i>
                      </div>
                      <div>
                        <h4 className="modal-title fw-bold mb-1">{selected.name}</h4>
                        <div className="d-flex gap-3 small text-white-50">
                          {selected.beneficiaries && (
                            <span>
                              <i className="fas fa-users me-1"></i>
                              {selected.beneficiaries}
                            </span>
                          )}
                          {selected.deadline && (
                            <span>
                              <i className="fas fa-calendar me-1"></i>
                              Until {new Date(selected.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={handleModalClose}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px'
                      }}
                    ></button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="modal-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  <div className="row g-4">
                    {/* Benefit */}
                    <div className="col-12">
                      <div className="p-4" style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '15px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div className="d-flex align-items-center mb-3">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          <h6 className="fw-bold text-success mb-0">Benefit</h6>
                        </div>
                        <p className="text-dark mb-0 fw-medium">{selected.benefit}</p>
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div className="col-12">
                      <div className="p-4" style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '15px',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <div className="d-flex align-items-center mb-3">
                          <i className="fas fa-users text-primary me-2"></i>
                          <h6 className="fw-bold text-primary mb-0">Eligibility</h6>
                        </div>
                        <p className="text-dark mb-0">{selected.eligibility}</p>
                      </div>
                    </div>

                    {/* Required Documents */}
                    {selected.docs && (
                      <div className="col-12">
                        <div className="p-4" style={{
                          background: 'rgba(245, 158, 11, 0.1)',
                          borderRadius: '15px',
                          border: '1px solid rgba(245, 158, 11, 0.2)'
                        }}>
                          <div className="d-flex align-items-center mb-3">
                            <i className="fas fa-file-text text-warning me-2"></i>
                            <h6 className="fw-bold text-warning mb-0">Required Documents</h6>
                          </div>
                          <p className="text-dark mb-0">{selected.docs}</p>
                        </div>
                      </div>
                    )}

                    {/* Apply Link */}
                    <div className="col-12">
                      <div className="p-4" style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '15px',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                      }}>
                        <div className="d-flex align-items-center mb-3">
                          <i className="fas fa-external-link-alt text-purple me-2" style={{ color: '#8b5cf6' }}></i>
                          <h6 className="fw-bold mb-0" style={{ color: '#8b5cf6' }}>Application Link</h6>
                        </div>
                        <a 
                          href={selected.apply_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-decoration-none fw-medium"
                          style={{ color: '#8b5cf6', wordBreak: 'break-all' }}
                        >
                          {selected.apply_url}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-light border-0 p-4">
                  <div className="d-flex gap-3 w-100">
                    <button
                      onClick={handleModalClose}
                      className="btn btn-outline-secondary flex-fill"
                      style={{ borderRadius: '12px', fontWeight: '600' }}
                    >
                      Close
                    </button>
                    <a
                      href={selected.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success flex-fill text-decoration-none"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600'
                      }}
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
            40%, 43% { transform: translateY(-10px); }
            70% { transform: translateY(-5px); }
          }

          @keyframes floatAnimation {
            0%, 100% { 
              opacity: 0.4; 
              transform: translateY(0px) scale(1); 
            }
            50% { 
              opacity: 0.6; 
              transform: translateY(-20px) scale(1.1); 
            }
          }

          .scheme-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2) !important;
          }

          .scheme-card:hover .card-title {
            color: #10b981 !important;
          }

          .scheme-card:hover div[style*="linear-gradient"] {
            transform: scale(1.1);
          }

          .placeholder {
            display: inline-block;
            min-height: 1em;
            vertical-align: middle;
            cursor: wait;
            background-color: currentColor;
            opacity: 0.5;
          }

          .placeholder.col-6 { width: 50%; }
          .placeholder.col-8 { width: 66.666667%; }
          .placeholder.col-10 { width: 83.333333%; }
          .placeholder.col-12 { width: 100%; }

          .placeholder-glow .placeholder {
            animation: placeholder-glow 2s ease-in-out infinite alternate;
          }

          @keyframes placeholder-glow {
            50% { opacity: 0.2; }
          }
        `}</style>
      </div>
    </>
  );
}