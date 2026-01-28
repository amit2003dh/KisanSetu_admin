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
  const navigate = useNavigate();

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
      // Mock data for now - replace with actual API call
      const mockOrders = [
        {
          _id: '1',
          orderId: 'ORD-2024-001',
          buyerId: { name: 'John Buyer', email: 'john@example.com' },
          sellerId: { name: 'Jane Seller', email: 'jane@example.com' },
          items: [
            { name: 'Wheat', quantity: 100, price: 2000 },
            { name: 'Rice', quantity: 50, price: 1500 }
          ],
          totalAmount: 3500,
          status: 'pending',
          deliveryAddress: '123 Main St, Delhi',
          orderDate: new Date('2024-01-15'),
          deliveryDate: new Date('2024-01-20'),
          paymentStatus: 'pending'
        },
        {
          _id: '2',
          orderId: 'ORD-2024-002',
          buyerId: { name: 'Alice Buyer', email: 'alice@example.com' },
          sellerId: { name: 'Bob Seller', email: 'bob@example.com' },
          items: [
            { name: 'Tomatoes', quantity: 200, price: 1000 }
          ],
          totalAmount: 1000,
          status: 'processing',
          deliveryAddress: '456 Park Ave, Mumbai',
          orderDate: new Date('2024-01-16'),
          deliveryDate: new Date('2024-01-22'),
          paymentStatus: 'paid'
        }
      ];

      // Filter by status if provided
      const filteredOrders = filter && filter !== 'all' ? 
        mockOrders.filter(o => o.status === filter) : 
        mockOrders;

      setOrders(filteredOrders);
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
      case "pending": return "#ff9800";
      case "processing": return "#2196f3";
      case "completed": return "#4caf50";
      case "cancelled": return "#f44336";
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
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { id: "all", label: "📦 All Orders", count: orders.length },
            { id: "pending", label: "⏳ Pending", count: orders.filter(o => o.status === "pending").length },
            { id: "processing", label: "⚙️ Processing", count: orders.filter(o => o.status === "processing").length },
            { id: "completed", label: "✅ Completed", count: orders.filter(o => o.status === "completed").length },
            { id: "cancelled", label: "❌ Cancelled", count: orders.filter(o => o.status === "cancelled").length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: "8px 16px",
                border: "1px solid var(--border-color)",
                background: filter === tab.id ? "var(--primary-blue)" : "transparent",
                color: filter === tab.id ? "white" : "var(--text-secondary)",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              {tab.label} ({tab.count})
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
                <p>Order ID: {selectedOrder.orderId}</p>
                <p>Status: <span style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span></p>
                <p>Total Amount: ₹{selectedOrder.totalAmount}</p>
                <p>Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                <p>Delivery Date: {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
              </div>

              <div>
                <strong>Customer Information:</strong>
                <p>Name: {selectedOrder.buyerId?.name}</p>
                <p>Email: {selectedOrder.buyerId?.email}</p>
                <p>Delivery Address: {selectedOrder.deliveryAddress}</p>
              </div>

              <div>
                <strong>Seller Information:</strong>
                <p>Name: {selectedOrder.sellerId?.name}</p>
                <p>Email: {selectedOrder.sellerId?.email}</p>
              </div>

              <div>
                <strong>Items:</strong>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} style={{ marginBottom: "8px", padding: "8px", background: "var(--background-alt)", borderRadius: "4px" }}>
                    <p>{item.name} - {item.quantity} units @ ₹{item.price}</p>
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
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
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
