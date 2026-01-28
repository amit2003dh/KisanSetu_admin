import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeUsers: 0,
      totalCrops: 0,
      totalProducts: 0
    },
    userGrowth: [],
    revenueData: [],
    topProducts: [],
    topCrops: [],
    orderStats: {
      Pending: 0,
      Confirmed: 0,
      'Picked Up': 0,
      'In Transit': 0,
      Delivered: 0,
      Cancelled: 0
    },
    usersByRole: {
      farmer: 0,
      buyer: 0,
      seller: 0,
      delivery_partner: 0
    },
    productionStats: {
      approved: 0,
      pending: 0
    },
    revenueBreakdown: {
      byUserType: [],
      byCategory: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30days"); // 7days, 30days, 90days
  const [userType, setUserType] = useState("all"); // all, farmer, buyer, seller, delivery_partner
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchAnalytics();
  }, [navigate, timeRange, userType]);

  const fetchAnalytics = async () => {
    try {
      const { data } = await apiCall(() => 
        API.get(`/admin/analytics?timeRange=${timeRange}&userType=${userType}`)
      );
      if (data) {
        setAnalytics(data);
      }
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
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            >
              <option value="all">All Users</option>
              <option value="farmer">Farmers</option>
              <option value="buyer">Buyers</option>
              <option value="seller">Sellers</option>
              <option value="delivery_partner">Delivery Partners</option>
            </select>
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
        
        <div className="card" style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌾</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-teal)" }}>
            {analytics.overview.totalCrops}
          </div>
          <div style={{ color: "var(--text-secondary)" }}>Total Crops</div>
        </div>
        
        <div className="card" style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛍️</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary-pink)" }}>
            {analytics.overview.totalProducts}
          </div>
          <div style={{ color: "var(--text-secondary)" }}>Total Products</div>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Order Status Breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>📦 Order Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>⏳ Pending</span>
              <span style={{ fontWeight: "bold", color: "#ff9800" }}>{analytics.orderStats.Pending}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>✅ Confirmed</span>
              <span style={{ fontWeight: "bold", color: "#2196f3" }}>{analytics.orderStats.Confirmed}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>🚚 Picked Up</span>
              <span style={{ fontWeight: "bold", color: "#9c27b0" }}>{analytics.orderStats['Picked Up']}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📦 In Transit</span>
              <span style={{ fontWeight: "bold", color: "#3f51b5" }}>{analytics.orderStats['In Transit']}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>✅ Delivered</span>
              <span style={{ fontWeight: "bold", color: "#4caf50" }}>{analytics.orderStats.Delivered}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>❌ Cancelled</span>
              <span style={{ fontWeight: "bold", color: "#f44336" }}>{analytics.orderStats.Cancelled}</span>
            </div>
          </div>
        </div>

        {/* Revenue by User Type */}
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>💰 Revenue by User Type</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {analytics.revenueBreakdown.byUserType.length > 0 ? (
              analytics.revenueBreakdown.byUserType.map((userType) => (
                <div key={userType._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>
                    {userType._id === 'farmer' ? '👨‍🌾 Farmers' :
                     userType._id === 'buyer' ? '🛒 Buyers' :
                     userType._id === 'seller' ? '🏪 Sellers' :
                     userType._id === 'delivery_partner' ? '🚚 Delivery Partners' : userType._id}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", color: "var(--primary-green)" }}>
                      ₹{(userType.revenue / 100000).toFixed(1)}L
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {userType.orders} orders
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                No revenue data available
              </div>
            )}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>📊 Revenue by Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {analytics.revenueBreakdown.byCategory.length > 0 ? (
              analytics.revenueBreakdown.byCategory.map((category) => (
                <div key={category._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>
                    {category._id === 'crop' ? '🌾 Crops' :
                     category._id === 'product' ? '🛍️ Products' : '❓ Unknown'}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", color: "var(--primary-orange)" }}>
                      ₹{(category.revenue / 100000).toFixed(1)}L
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {category.quantity} units • {category.orderCount} orders
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                No revenue data available
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Top Products */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>🏆 Top Products</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {analytics.topProducts.map((product, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "var(--background-alt)", borderRadius: "4px" }}>
                <div>
                  <div style={{ fontWeight: "600" }}>{product.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {product.totalSold} sold
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold", color: "var(--primary-green)" }}>
                    ₹{(product.revenue / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>🌾 Top Crops</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {analytics.topCrops.map((crop, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "var(--background-alt)", borderRadius: "4px" }}>
                <div>
                  <div style={{ fontWeight: "600" }}>{crop.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {crop.totalSold} sold
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold", color: "var(--primary-orange)" }}>
                    ₹{(crop.revenue / 1000).toFixed(0)}K
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
