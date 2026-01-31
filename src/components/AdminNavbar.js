import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const [adminData, setAdminData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const admin = localStorage.getItem("adminData");
    if (admin) {
      setAdminData(JSON.parse(admin));
    }

    // Check if mobile device
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      console.log('Checking mobile - width:', width, 'isMobile:', isMobileDevice);
      setIsMobile(isMobileDevice);
      if (width >= 768) {
        setShowMobileMenu(false);
      }
    };

    // Check device orientation
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortraitMode = height > width;
      console.log('Checking orientation - width:', width, 'height:', height, 'isPortrait:', isPortraitMode);
      setIsPortrait(isPortraitMode);
    };

    checkMobile();
    checkOrientation();
    
    // Add event listeners with proper cleanup
    const handleResize = () => {
      checkMobile();
      checkOrientation();
    };
    
    const handleOrientationChange = () => {
      setTimeout(() => {
        checkMobile();
        checkOrientation();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleMobileNavClick = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  return (
    <nav style={{
      background: "var(--primary-blue)",
      color: "white",
      padding: "0 20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      position: "relative"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "60px"
      }}>
        {/* Logo and Brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/admin/dashboard" style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span className="logo-icon" style={{ fontSize: "24px" }}>🛡️</span>
            <span className="logo-text" style={{ fontSize: "18px", fontWeight: "bold" }}>KisanSetu Admin</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links" style={{ 
          display: isMobile ? "none" : "flex", 
          alignItems: "center", 
          gap: "16px" 
        }}>
          <Link 
            to="/admin/dashboard" 
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/dashboard") ? "rgba(255,255,255,0.2)" : "transparent",
              transition: "background-color 0.2s ease"
            }}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/production-verification" 
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/production-verification") ? "rgba(255,255,255,0.2)" : "transparent",
              transition: "background-color 0.2s ease"
            }}
          >
            Production
          </Link>
          <Link 
            to="/admin/delivery-verification" 
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/delivery-verification") ? "rgba(255,255,255,0.2)" : "transparent",
              transition: "background-color 0.2s ease"
            }}
          >
            Delivery
          </Link>
          <Link 
            to="/admin/user-management" 
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/user-management") ? "rgba(255,255,255,0.2)" : "transparent",
              transition: "background-color 0.2s ease"
            }}
          >
            Users
          </Link>
          <Link 
            to="/admin/order-management" 
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/order-management") ? "rgba(255,255,255,0.2)" : "transparent",
              transition: "background-color 0.2s ease"
            }}
          >
            Orders
          </Link>
          <Link 
            to="/admin/analytics" 
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/analytics") ? "rgba(255,255,255,0.2)" : "transparent",
              transition: "background-color 0.2s ease"
            }}
          >
            Analytics
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          style={{
            display: isMobile ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
            padding: "10px",
            borderRadius: "6px",
            transition: "all 0.2s ease",
            minWidth: "44px",
            minHeight: "44px"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
            e.target.style.borderColor = "rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
            e.target.style.borderColor = "rgba(255,255,255,0.2)";
          }}
        >
          {showMobileMenu ? "✕" : "☰"}
        </button>

        {/* User Profile Dropdown */}
        <div className="user-profile-dropdown" style={{ position: "relative", display: isMobile ? "none" : "block" }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>👤</span>
            <span>{adminData?.name || "Admin"}</span>
            <span>▼</span>
          </button>

          {showDropdown && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: "0",
              background: "white",
              border: "1px solid var(--border-color)",
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              minWidth: "200px",
              zIndex: 1000
            }}>
              <div style={{ padding: "8px 0" }}>
                <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border-color)" }}>
                  <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                    {adminData?.name || "Admin"}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {adminData?.email || "admin@kisansetu.com"}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    background: "none",
                    color: "var(--text-primary)",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu" style={{
          display: isMobile ? "flex" : "none",
          flexDirection: "column",
          padding: "12px",
          background: "var(--primary-blue)",
          position: "absolute",
          top: "100%",
          left: "0",
          right: "0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}>
          <button
            onClick={() => handleMobileNavClick("/admin/dashboard")}
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/dashboard") ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "4px"
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => handleMobileNavClick("/admin/production-verification")}
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/production-verification") ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "4px"
            }}
          >
            🌾 Production
          </button>
          <button
            onClick={() => handleMobileNavClick("/admin/delivery-verification")}
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/delivery-verification") ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "4px"
            }}
          >
            🚚 Delivery
          </button>
          <button
            onClick={() => handleMobileNavClick("/admin/user-management")}
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/user-management") ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "4px"
            }}
          >
            � Users
          </button>
          <button
            onClick={() => handleMobileNavClick("/admin/order-management")}
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/order-management") ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "4px"
            }}
          >
            📦 Orders
          </button>
          <button
            onClick={() => handleMobileNavClick("/admin/analytics")}
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "4px",
              backgroundColor: isActive("/admin/analytics") ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "4px"
            }}
          >
            📈 Analytics
          </button>
          
          {/* Mobile User Profile */}
          <div style={{ 
            borderTop: "1px solid rgba(255,255,255,0.2)", 
            marginTop: "8px", 
            paddingTop: "12px" 
          }}>
            <div style={{ 
              padding: "8px 16px", 
              color: "rgba(255,255,255,0.8)",
              fontSize: "14px",
              marginBottom: "8px"
            }}>
              <div style={{ fontWeight: "600", color: "white" }}>
                {adminData?.name || "Admin"}
              </div>
              <div style={{ fontSize: "12px" }}>
                {adminData?.email || "admin@kisansetu.com"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "16px",
                borderRadius: "4px"
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
}
