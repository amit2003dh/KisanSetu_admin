import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, processing, completed, cancelled
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const navigate = useNavigate();

  // Mobile and orientation detection
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsPortrait(height > width);
    };

    checkMobile();
    checkOrientation();
    
    const handleResize = () => {
      checkMobile();
      checkOrientation();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchOrders();
  }, [navigate, filter]);

  const fetchOrders = async () => {
    try {
      const { data } = await apiCall(() => 
        API.get(`/admin/orders?status=${filter}`)
      );
      if (data) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      // Mock API call - replace with actual API
      setSuccess(`Order ${action}d successfully!`);
      fetchOrders(); // Refresh data
      setSelectedOrder(null); // Close detail view
    } catch (error) {
      setError(`Failed to ${action} order`);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#ff9800";
      case "Confirmed": return "#2196f3";
      case "Picked Up": return "#9c27b0";
      case "In Transit": return "#3f51b5";
      case "Delivered": return "#4caf50";
      case "Cancelled": return "#f44336";
      default: return "#9e9e9e";
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner"></div>
          <p>Loading order management...</p>
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
            <h1>📦 Order Management</h1>
            <p>Monitor and manage all platform orders</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: "16px" }}>{success}</div>}

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ 
        marginBottom: "24px",
        overflowX: isMobile ? "auto" : "visible",
        WebkitOverflowScrolling: isMobile ? "touch" : "auto"
      }}>
        <div className="filter-container" style={{ 
          display: "flex", 
          gap: isMobile ? "6px" : "8px",
          flexDirection: isMobile ? "row" : "row",
          minWidth: isMobile ? "max-content" : "auto",
          paddingBottom: isMobile ? "8px" : "0"
        }}>
          {[
            { id: "all", label: "📦 All", count: orders.length },
            { id: "Pending", label: "⏳ Pending", count: orders.filter(o => o.status === "Pending").length },
            { id: "Confirmed", label: "✅ Confirmed", count: orders.filter(o => o.status === "Confirmed").length },
            { id: "Picked Up", label: "🚚 Picked", count: orders.filter(o => o.status === "Picked Up").length },
            { id: "In Transit", label: "📦 Transit", count: orders.filter(o => o.status === "In Transit").length },
            { id: "Delivered", label: "✅ Delivered", count: orders.filter(o => o.status === "Delivered").length },
            { id: "Cancelled", label: "❌ Cancelled", count: orders.filter(o => o.status === "Cancelled").length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`filter-button ${filter === tab.id ? 'active' : ''}`}
              style={{
                padding: isMobile ? "8px 12px" : "8px 16px",
                border: "1px solid var(--border-color)",
                background: filter === tab.id ? "var(--primary-blue)" : "transparent",
                color: filter === tab.id ? "white" : "var(--text-secondary)",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: isMobile ? "12px" : "14px",
                whiteSpace: "nowrap",
                flexShrink: 0,
                minWidth: isMobile ? "auto" : "fit-content",
                minHeight: isMobile ? "40px" : "auto"
              }}
            >
              {isMobile ? tab.label.split(' ')[0] + ' ' + tab.label.split(' ')[1] : tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "var(--background)",
            borderRadius: "8px",
            padding: "24px",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            margin: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>Order Details - {selectedOrder.orderId}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "var(--text-secondary)"
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <strong>Order Information:</strong>
                <p>Order ID: {selectedOrder._id}</p>
                <p>Status: <span style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span></p>
                <p>Total Amount: ₹{selectedOrder.total}</p>
                <p>Order Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <strong>Customer Information:</strong>
                <p>Name: {selectedOrder.buyerId?.name}</p>
                <p>Email: {selectedOrder.buyerId?.email}</p>
              </div>

              <div>
                <strong>Seller Information:</strong>
                <p>Name: {selectedOrder.sellerId?.name}</p>
                <p>Email: {selectedOrder.sellerId?.email}</p>
              </div>

              <div>
                <strong>Order Items:</strong>
                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                  <div key={index} style={{ marginLeft: "16px", marginTop: "4px" }}>
                    <p style={{ margin: "0" }}>{item.name} - {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}</p>
                  </div>
                ))}
              </div>

              <div>
                <strong>Payment Status:</strong>
                <p>{selectedOrder.paymentStatus}</p>
              </div>

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                {selectedOrder.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleOrderAction(selectedOrder._id, "confirm")}
                      className="btn btn-primary"
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      ✅ Confirm Order
                    </button>
                    <button
                      onClick={() => handleOrderAction(selectedOrder._id, "cancel")}
                      className="btn btn-danger"
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      ❌ Cancel Order
                    </button>
                  </>
                )}
                {selectedOrder.status === "processing" && (
                  <button
                    onClick={() => handleOrderAction(selectedOrder._id, "complete")}
                    className="btn btn-success"
                    style={{ fontSize: "14px", padding: "8px 16px" }}
                  >
                    ✅ Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>
          Orders ({orders.length})
        </h3>
        
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <p>No {filter} orders</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => (
              <div key={order._id} style={{
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "16px",
                background: "var(--background)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0 }}>
                        {order.orderId}
                      </h4>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        background: getStatusColor(order.status),
                        color: "white"
                      }}>
                        {order.status}
                      </span>
                    </div>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Customer:</strong> {order.buyerId?.name}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Seller:</strong> {order.sellerId?.name}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Total:</strong> ₹{order.total}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Payment:</strong> {order.paymentStatus}
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="btn btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      👁️ View Details
                    </button>
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleOrderAction(order._id, "confirm")}
                          className="btn btn-primary"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          ✅ Confirm
                        </button>
                        <button
                          onClick={() => handleOrderAction(order._id, "cancel")}
                          className="btn btn-danger"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
