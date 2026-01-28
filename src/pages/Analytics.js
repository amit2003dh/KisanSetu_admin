import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeUsers: 0
    },
    userGrowth: [],
    revenueData: [],
    topProducts: [],
    orderStats: {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30days"); // 7days, 30days, 90days
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchAnalytics();
  }, [navigate, timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data - replace with actual API calls
      const mockAnalytics = {
        overview: {
          totalUsers: 150,
          totalOrders: 500,
          totalRevenue: 2500000,
          activeUsers: 85
        },
        userGrowth: [
          { date: '2024-01-01', users: 120 },
          { date: '2024-01-07', users: 125 },
          { date: '2024-01-14', users: 130 },
          { date: '2024-01-21', users: 135 },
          { date: '2024-01-28', users: 140 },
          { date: '2024-02-04', users: 145 },
          { date: '2024-02-11', users: 150 }
        ],
        revenueData: [
          { month: 'Jan', revenue: 800000 },
          { month: 'Feb', revenue: 900000 },
          { month: 'Mar', revenue: 800000 }
        ],
        topProducts: [
          { name: 'Wheat', orders: 150, revenue: 450000 },
          { name: 'Rice', orders: 120, revenue: 360000 },
          { name: 'Tomatoes', orders: 80, revenue: 240000 },
          { name: 'Potatoes', orders: 60, revenue: 180000 },
          { name: 'Onions', orders: 40, revenue: 120000 }
        ],
        orderStats: {
          pending: 25,
          processing: 50,
          completed: 400,
          cancelled: 25
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
      <div className="page-header" style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link
              to="/admin/dashboard"
              className="btn btn-outline"
              style={{ fontSize: "14px", padding: "8px 16px" }}
            >
              ← Back to Dashboard
            </Link>
            <h1>📈 Platform Analytics</h1>
            <p>View detailed platform analytics and reports</p>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}

      {/* Overview Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "16px",
        marginBottom: "32px"
      }}>
        <div className="card" style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>👥</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-blue)" }}>
            {analytics.overview.totalUsers}
          </div>
          <div style={{ color: "var(--text-secondary)" }}>Total Users</div>
        </div>
        
        <div className="card" style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📦</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-green)" }}>
            {analytics.overview.totalOrders}
          </div>
          <div style={{ color: "var(--text-secondary)" }}>Total Orders</div>
        </div>
        
        <div className="card" style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>💰</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-orange)" }}>
            ₹{(analytics.overview.totalRevenue / 100000).toFixed(1)}L
          </div>
          <div style={{ color: "var(--text-secondary)" }}>Total Revenue</div>
        </div>
        
        <div className="card" style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-purple)" }}>
            {analytics.overview.activeUsers}
          </div>
          <div style={{ color: "var(--text-secondary)" }}>Active Users</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* User Growth Chart */}
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>📈 User Growth</h3>
          <div style={{ height: "300px", background: "var(--background-alt)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
              <p style={{ color: "var(--text-secondary)" }}>User Growth Chart</p>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                {analytics.userGrowth.length} data points
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>💰 Revenue Trends</h3>
          <div style={{ height: "300px", background: "var(--background-alt)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📈</div>
              <p style={{ color: "var(--text-secondary)" }}>Revenue Chart</p>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                {analytics.revenueData.length} months of data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Order Status Breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>📦 Order Status Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>⏳ Pending</span>
              <span style={{ fontWeight: "bold", color: "#ff9800" }}>{analytics.orderStats.pending}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>⚙️ Processing</span>
              <span style={{ fontWeight: "bold", color: "#2196f3" }}>{analytics.orderStats.processing}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>✅ Completed</span>
              <span style={{ fontWeight: "bold", color: "#4caf50" }}>{analytics.orderStats.completed}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>❌ Cancelled</span>
              <span style={{ fontWeight: "bold", color: "#f44336" }}>{analytics.orderStats.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>🏆 Top Products</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {analytics.topProducts.map((product, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "var(--background-alt)", borderRadius: "4px" }}>
                <div>
                  <div style={{ fontWeight: "600" }}>{product.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {product.orders} orders
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold", color: "var(--primary-green)" }}>
                    ₹{(product.revenue / 1000).toFixed(0)}K
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    Revenue
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>📊 Export Reports</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ fontSize: "14px", padding: "8px 16px" }}>
            📄 Export PDF Report
          </button>
          <button className="btn btn-secondary" style={{ fontSize: "14px", padding: "8px 16px" }}>
            📊 Export Excel Data
          </button>
          <button className="btn btn-secondary" style={{ fontSize: "14px", padding: "8px 16px" }}>
            📈 Export Charts
          </button>
          <button className="btn btn-secondary" style={{ fontSize: "14px", padding: "8px 16px" }}>
            📧 Email Report
          </button>
        </div>
      </div>
    </div>
  );
}
