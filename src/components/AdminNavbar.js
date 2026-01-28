import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const [adminData, setAdminData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const admin = localStorage.getItem("adminData");
    if (admin) {
      setAdminData(JSON.parse(admin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={{
      background: "var(--primary-blue)",
      color: "white",
      padding: "0 20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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
            <span style={{ fontSize: "24px" }}>🛡️</span>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>KisanSetu Admin</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link
            to="/admin/dashboard"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              background: isActive("/admin/dashboard") ? "rgba(255,255,255,0.2)" : "transparent",
              fontSize: "14px"
            }}
          >
            📊 Dashboard
          </Link>
          
          <Link
            to="/admin/production-verification"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              background: isActive("/admin/production-verification") ? "rgba(255,255,255,0.2)" : "transparent",
              fontSize: "14px"
            }}
          >
            🌾 Production
          </Link>
          
          <Link
            to="/admin/delivery-verification"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              background: isActive("/admin/delivery-verification") ? "rgba(255,255,255,0.2)" : "transparent",
              fontSize: "14px"
            }}
          >
            🚚 Delivery
          </Link>
          
          <Link
            to="/admin/user-management"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              background: isActive("/admin/user-management") ? "rgba(255,255,255,0.2)" : "transparent",
              fontSize: "14px"
            }}
          >
            👥 Users
          </Link>
        </div>

        {/* Admin Profile Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px"
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
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              minWidth: "200px",
              zIndex: 1000
            }}>
              <div style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                <div style={{ fontWeight: "bold", color: "#333" }}>{adminData?.name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{adminData?.email}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>Role: {adminData?.role}</div>
              </div>
              
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Add profile management if needed
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333"
                }}
              >
                ⚙️ Settings
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#dc3545"
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

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
