import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    farmers: 0,
    buyers: 0,
    sellers: 0,
    deliveryPartners: 0,
    pendingVerifications: 0,
    approvedVerifications: 0,
    rejectedVerifications: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCrops: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname;
    if (path === "/admin/dashboard") {
      setActiveTab("overview");
    } else if (path === "/admin/production-verification") {
      setActiveTab("production");
    } else if (path === "/admin/delivery-verification") {
      setActiveTab("delivery");
    } else if (path === "/admin/user-management") {
      setActiveTab("users");
    } else if (path === "/admin/order-management") {
      setActiveTab("orders");
    } else if (path === "/admin/analytics") {
      setActiveTab("analytics");
    }

    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchDashboardData();
  }, [navigate, location.pathname]);

  const fetchDashboardData = async () => {
    try {
      const { data } = await apiCall(() => API.get("/admin/dashboard-stats"));
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
      <div className="page-header" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>🛡️ Admin Dashboard</h1>
            <p>KisanSetu Administration Portal</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)" }}>
              Welcome, Admin
            </span>
            {/* <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ fontSize: "14px", padding: "8px 16px" }}
            >
              🚪 Logout
            </button> */}
          </div>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}

      {/* Tab Navigation */}
      <div style={{ 
        borderBottom: "2px solid var(--border-color)", 
        marginBottom: "32px" 
      }}>
        <div style={{ display: "flex", gap: "0", overflowX: "auto" }}>
          {[
            { id: "overview", label: "📊 Overview", icon: "📊", path: "/admin/dashboard" },
            { id: "production", label: "🌾 Production", icon: "🌾", path: "/admin/production-verification" },
            { id: "delivery", label: "🚚 Delivery Partners", icon: "🚚", path: "/admin/delivery-verification" },
            { id: "users", label: "👥 Users", icon: "👥", path: "/admin/user-management" },
            { id: "orders", label: "📦 Orders", icon: "📦", path: "/admin/order-management" },
            { id: "analytics", label: "📈 Analytics", icon: "📈", path: "/admin/analytics" }
          ].map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              style={{
                padding: "12px 24px",
                border: "none",
                background: activeTab === tab.id ? "var(--primary-blue)" : "transparent",
                color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                borderBottom: activeTab === tab.id ? "3px solid var(--primary-blue)" : "3px solid transparent",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                textDecoration: "none"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = "var(--background-alt)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = "transparent";
                }
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <>
          {/* Stats Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "16px",
            marginBottom: "32px"
          }}>
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>👥</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-blue)" }}>
                {stats.totalUsers}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Total Users</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌾</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-green)" }}>
                {stats.farmers}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Farmers</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛒</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-orange)" }}>
                {stats.buyers}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Buyers</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏪</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-purple)" }}>
                {stats.sellers}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Sellers</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🚚</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-blue)" }}>
                {stats.deliveryPartners}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Delivery Partners</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏳</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff9800" }}>
                {stats.pendingVerifications}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Pending Verifications</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4caf50" }}>
                {stats.approvedVerifications}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Approved Verifications</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>❌</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f44336" }}>
                {stats.rejectedVerifications}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Rejected Verifications</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📦</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-green)" }}>
                {stats.totalOrders}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Total Orders</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>💰</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-green)" }}>
                ₹{stats.totalRevenue}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Total Revenue</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌾</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-orange)" }}>
                {stats.totalCrops}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Total Crops</div>
            </div>
            
            <div className="card" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📦</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-purple)" }}>
                {stats.totalProducts}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>Total Products</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ marginBottom: "16px" }}>🚀 Quick Actions</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                to="/admin/production-verification"
                className="btn btn-primary"
                style={{ fontSize: "14px", padding: "10px 20px" }}
              >
                🌾 Production Verification
              </Link>
              <Link
                to="/admin/delivery-verification"
                className="btn btn-primary"
                style={{ fontSize: "14px", padding: "10px 20px" }}
              >
                🚚 Delivery Partner Verification
              </Link>
              <Link
                to="/admin/user-management"
                className="btn btn-secondary"
                style={{ fontSize: "14px", padding: "10px 20px" }}
              >
                👥 User Management
              </Link>
              <Link
                to="/admin/order-management"
                className="btn btn-secondary"
                style={{ fontSize: "14px", padding: "10px 20px" }}
              >
                📦 Order Management
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
