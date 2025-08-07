import React, { useEffect, useState } from "react";
import DashboardNavbar from "../components/common/DashboardNavbar";
import GlassCard from "../components/common/GlassCard";

export default function Market() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("modal_price");
  const [filterCommodity, setFilterCommodity] = useState("all");
  const [viewMode, setViewMode] = useState("cards"); // cards or table

  useEffect(() => {
    const fetchProfileAndPrices = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        
        // Fetch profile
        const profileResponse = await fetch("http://localhost:8000/api/users/profile/", {
          headers: { Authorization: `Token ${token}` }
        });
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Prepare market data request
        const mainCrops = (profileData.main_crops || "").split(",").map(c => c.trim().toLowerCase()).filter(Boolean);
        const userState = (profileData.state || "").trim().toLowerCase();
        const userDistrict = (profileData.district || "").trim().toUpperCase();
        
        const params = new URLSearchParams();
        if (mainCrops[0]) params.append('commodity', mainCrops[0]);
        if (userState) params.append('state', userState);
        if (userDistrict) params.append('district', userDistrict);

        // Fetch market prices
        const marketResponse = await fetch(`http://localhost:8000/api/farmers/market-prices/?${params.toString()}`);
        if (!marketResponse.ok) throw new Error("Failed to fetch market prices");
        const marketData = await marketResponse.json();
        setData(marketData.records || []);
      } catch (err) {
        setError("Failed to fetch market prices");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndPrices();
  }, []);

  // Filtered and sorted data
  const filteredData = data
    .filter(rec => {
      const matchesSearch = 
        rec.commodity.toLowerCase().includes(search.toLowerCase()) ||
        rec.market.toLowerCase().includes(search.toLowerCase()) ||
        rec.state.toLowerCase().includes(search.toLowerCase());
      
      const matchesCommodity = filterCommodity === "all" || 
        rec.commodity.toLowerCase() === filterCommodity.toLowerCase();
      
      return matchesSearch && matchesCommodity;
    })
    .sort((a, b) => {
      const aVal = parseFloat(a[sortBy]) || 0;
      const bVal = parseFloat(b[sortBy]) || 0;
      return sortBy === "market" ? a.market.localeCompare(b.market) : aVal - bVal;
    });

  // Get unique commodities for filter
  const uniqueCommodities = [...new Set(data.map(rec => rec.commodity))];

  // Calculate statistics
  const stats = {
    totalMarkets: filteredData.length,
    avgModal: filteredData.length > 0 ? 
      (filteredData.reduce((sum, rec) => sum + parseFloat(rec.modal_price || 0), 0) / filteredData.length).toFixed(2) : 0,
    bestPrice: filteredData.length > 0 ? Math.max(...filteredData.map(rec => parseFloat(rec.modal_price))) : 0,
    lowestPrice: filteredData.length > 0 ? Math.min(...filteredData.map(rec => parseFloat(rec.modal_price))) : 0,
    bestMarket: filteredData.length > 0 ? 
      filteredData.reduce((max, rec) => parseFloat(rec.modal_price) > parseFloat(max.modal_price) ? rec : max, filteredData[0]) : null,
    cheapestMarket: filteredData.length > 0 ? 
      filteredData.reduce((min, rec) => parseFloat(rec.modal_price) < parseFloat(min.modal_price) ? rec : min, filteredData[0]) : null
  };

  const LoadingCard = () => (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <div className="card-body p-4">
          <div className="placeholder-glow">
            <div className="placeholder bg-success rounded-3 mb-3" style={{ height: '80px', width: '100%' }}></div>
            <div className="placeholder bg-secondary col-8 mb-2"></div>
            <div className="placeholder bg-secondary col-6 mb-3"></div>
            <div className="d-flex justify-content-between">
              <div className="placeholder bg-secondary col-3"></div>
              <div className="placeholder bg-secondary col-3"></div>
              <div className="placeholder bg-secondary col-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PriceCard = ({ record, index }) => {
    const modalPrice = parseFloat(record.modal_price);
    const minPrice = parseFloat(record.min_price);
    const maxPrice = parseFloat(record.max_price);
    const priceRange = maxPrice - minPrice;
    const isHighPrice = modalPrice >= stats.avgModal * 1.1;
    const isLowPrice = modalPrice <= stats.avgModal * 0.9;

    return (
      <div className="col-lg-3 col-md-4 col-sm-6 mb-5">
        <div className="card h-100 border-0 shadow-lg market-card" style={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.4s ease',
          cursor: 'pointer',
          position: 'relative'
        }}>
          {/* Price indicator badge */}
          {isHighPrice && (
            <div className="position-absolute top-0 end-0 m-2">
              <span className="badge" style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)', borderRadius: '10px' }}>
                High Price
              </span>
            </div>
          )}
          {isLowPrice && (
            <div className="position-absolute top-0 end-0 m-2">
              <span className="badge" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', borderRadius: '10px' }}>
                Good Deal
              </span>
            </div>
          )}

          <div className="card-body p-4">
            {/* Market Header */}
            <div className="text-center mb-3">
              <div className="d-inline-flex align-items-center justify-content-center mb-2" style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(40, 167, 69, 0.3)'
              }}>
                <i className="fas fa-store-alt text-white" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <h5 className="card-title fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>
                {record.market}
              </h5>
              <span className="badge" style={{
                background: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
                color: 'white',
                borderRadius: '15px',
                fontSize: '0.8rem',
                padding: '6px 12px'
              }}>
                {record.commodity}
              </span>
            </div>

            {/* Price Information */}
            <div className="row g-2 mb-3">
              <div className="col-4 text-center">
                <div className="p-2" style={{ background: 'rgba(220, 53, 69, 0.1)', borderRadius: '10px' }}>
                  <div className="text-muted small">Min</div>
                  <div className="fw-bold text-danger">₹{record.min_price}</div>
                </div>
              </div>
              <div className="col-4 text-center">
                <div className="p-2" style={{ background: 'rgba(255, 193, 7, 0.1)', borderRadius: '10px' }}>
                  <div className="text-muted small">Max</div>
                  <div className="fw-bold text-warning">₹{record.max_price}</div>
                </div>
              </div>
              <div className="col-4 text-center">
                <div className="p-2" style={{ background: 'rgba(40, 167, 69, 0.1)', borderRadius: '10px' }}>
                  <div className="text-muted small">Modal</div>
                  <div className="fw-bold text-success">₹{record.modal_price}</div>
                </div>
              </div>
            </div>

            {/* Price Range Visualization */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Price Range</small>
                <small className="text-muted">₹{priceRange.toFixed(0)} spread</small>
              </div>
              <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: priceRange > 0 ? `${((modalPrice - minPrice) / priceRange) * 100}%` : '50%' }}
                ></div>
              </div>
            </div>

            {/* Location and Additional Info */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="fas fa-map-marker-alt text-muted me-1"></i>
                <small className="text-muted">{record.state}</small>
              </div>
              {record.arrival_date && (
                <small className="text-muted">
                  <i className="fas fa-calendar me-1"></i>
                  {new Date(record.arrival_date).toLocaleDateString()}
                </small>
              )}
            </div>

            {/* Compare with average indicator */}
            <div className="mt-2">
              {modalPrice > stats.avgModal * 1.1 ? (
                <small className="text-danger">
                  <i className="fas fa-arrow-up me-1"></i>
                  {(((modalPrice - stats.avgModal) / stats.avgModal) * 100).toFixed(1)}% above average
                </small>
              ) : modalPrice < stats.avgModal * 0.9 ? (
                <small className="text-success">
                  <i className="fas fa-arrow-down me-1"></i>
                  {(((stats.avgModal - modalPrice) / stats.avgModal) * 100).toFixed(1)}% below average
                </small>
              ) : (
                <small className="text-muted">
                  <i className="fas fa-minus me-1"></i>
                  Near average price
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DashboardNavbar />
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'rgb(3, 98, 76)',
        position: 'relative',
        marginLeft:'60px'
      }}>
        


        <div className="container-fluid py-4" style={{ position: 'relative', zIndex: 10 }}>
          <div className="container">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                borderRadius: '50%',
                boxShadow: '0 15px 35px rgba(40, 167, 69, 0.3)'
              }}>
                <i className="fas fa-store-alt text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h1 className="display-4 fw-bold mb-3" style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Market Prices
              </h1>
              <p className="lead text-muted">
                {profile?.main_crops ? 
                  `Live prices for ${profile.main_crops} in your district` : 
                  "Live market prices in your district"
                }
              </p>
            </div>

            {/* Statistics Cards */}
            {!loading && !error && filteredData.length > 0 && (
              <div className="row g-4 mb-5">
                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    color: 'white'
                  }}>
                    <div className="card-body text-center p-4">
                      <i className="fas fa-store fa-2x mb-3 opacity-75"></i>
                      <h3 className="fw-bold mb-1">{stats.totalMarkets}</h3>
                      <p className="mb-0 opacity-75">Markets Found</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #007bff, #6f42c1)',
                    color: 'white'
                  }}>
                    <div className="card-body text-center p-4">
                      <i className="fas fa-chart-line fa-2x mb-3 opacity-75"></i>
                      <h3 className="fw-bold mb-1">₹{stats.avgModal}</h3>
                      <p className="mb-0 opacity-75">Average Price</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #fd7e14, #e83e8c)',
                    color: 'white'
                  }}>
                    <div className="card-body text-center p-4">
                      <i className="fas fa-arrow-up fa-2x mb-3 opacity-75"></i>
                      <h3 className="fw-bold mb-1">₹{stats.bestPrice}</h3>
                      <p className="mb-0 opacity-75">Highest Price</p>
                      <small className="opacity-75">{stats.bestMarket?.market}</small>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-lg h-100" style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #dc3545, #fd7e14)',
                    color: 'white'
                  }}>
                    <div className="card-body text-center p-4">
                      <i className="fas fa-arrow-down fa-2x mb-3 opacity-75"></i>
                      <h3 className="fw-bold mb-1">₹{stats.lowestPrice}</h3>
                      <p className="mb-0 opacity-75">Lowest Price</p>
                      <small className="opacity-75">{stats.cheapestMarket?.market}</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="row g-3 mb-4">
              <div className="col-lg-6">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search by commodity, market, or state..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      borderRadius: '15px',
                      paddingLeft: '50px',
                      border: '2px solid #e9ecef',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                    <i className="fas fa-search text-muted"></i>
                  </div>
                  {search && (
                    <button
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3"
                      onClick={() => setSearch("")}
                      style={{ color: '#6c757d' }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <select
                  className="form-select form-select-lg"
                  value={filterCommodity}
                  onChange={e => setFilterCommodity(e.target.value)}
                  style={{
                    borderRadius: '15px',
                    border: '2px solid #e9ecef',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <option value="all">All Commodities</option>
                  {uniqueCommodities.map(commodity => (
                    <option key={commodity} value={commodity}>{commodity}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-3 col-md-6">
                <select
                  className="form-select form-select-lg"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    borderRadius: '15px',
                    border: '2px solid #e9ecef',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <option value="modal_price">Sort by Modal Price</option>
                  <option value="min_price">Sort by Min Price</option>
                  <option value="max_price">Sort by Max Price</option>
                  <option value="market">Sort by Market Name</option>
                </select>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="row">
                {[1, 2, 3, 4, 5, 6].map(i => <LoadingCard key={i} />)}
              </div>
            ) : error ? (
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="alert alert-danger text-center rounded-4 p-4" style={{ borderRadius: '20px' }}>
                    <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <h5>Error Loading Data</h5>
                    <p className="mb-0">{error}</p>
                  </div>
                </div>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="row">
                {filteredData.map((record, index) => 
                  <PriceCard key={index} record={record} index={index} />
                )}
              </div>
            ) : (
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="text-center p-5" style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                  }}>
                    <i className="fas fa-search fa-4x text-muted mb-4 opacity-50"></i>
                    <h3 className="text-muted mb-3">No Market Data Found</h3>
                    <p className="text-muted">
                      {search || filterCommodity !== "all" ? 
                        "Try adjusting your search or filter criteria." :
                        "No market price data available for your crop(s) in your district."
                      }
                    </p>
                    {(search || filterCommodity !== "all") && (
                      <button 
                        className="btn btn-outline-success"
                        onClick={() => {
                          setSearch("");
                          setFilterCommodity("all");
                        }}
                        style={{ borderRadius: '15px' }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          }

          .market-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
          }

          .placeholder {
            display: inline-block;
            min-height: 1em;
            vertical-align: middle;
            cursor: wait;
            background-color: currentColor;
            opacity: 0.5;
          }

          .placeholder.col-3 { width: 25%; }
          .placeholder.col-6 { width: 50%; }
          .placeholder.col-8 { width: 66.666667%; }

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