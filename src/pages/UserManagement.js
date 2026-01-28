import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all"); // all, farmer, buyer, seller, delivery_partner
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive, suspended
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchUsers();
  }, [navigate, filter, statusFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("role", filter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const { data } = await apiCall(() => 
        API.get(`/admin/users?${params.toString()}`)
      );
      if (data) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const { data, error } = await apiCall(() =>
        API.put(`/admin/users/${userId}/${action}`)
      );

      if (error) {
        setError(error);
      } else {
        setSuccess(`User ${action}d successfully!`);
        fetchUsers(); // Refresh data
        setSelectedUser(null); // Close detail view
      }
    } catch (error) {
      setError(`Failed to ${action} user`);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "farmer": return "🌾";
      case "buyer": return "🛒";
      case "seller": return "🏪";
      case "delivery_partner": return "🚚";
      default: return "👤";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "#4caf50";
      case "inactive": return "#ff9800";
      case "suspended": return "#f44336";
      default: return "#9e9e9e";
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner"></div>
          <p>Loading user management...</p>
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
            <h1>👥 User Management</h1>
            <p>Manage all platform users and their permissions</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: "16px" }}>{success}</div>}

      {/* Filters and Search */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            >
              <option value="all">All Roles</option>
              <option value="farmer">🌾 Farmers</option>
              <option value="buyer">🛒 Buyers</option>
              <option value="seller">🏪 Sellers</option>
              <option value="delivery_partner">🚚 Delivery Partners</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            >
              <option value="all">All Status</option>
              <option value="active">✅ Active</option>
              <option value="inactive">⏸️ Inactive</option>
              <option value="suspended">❌ Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
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
              <h3 style={{ margin: 0 }}>
                {getRoleIcon(selectedUser.role)} {selectedUser.name}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
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
                <strong>Basic Information:</strong>
                <p>Name: {selectedUser.name}</p>
                <p>Email: {selectedUser.email}</p>
                <p>Phone: {selectedUser.phone}</p>
                <p>Role: {getRoleIcon(selectedUser.role)} {selectedUser.role}</p>
                <p>Status: <span style={{ color: getStatusColor(selectedUser.status) }}>{selectedUser.status}</span></p>
                <p>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                <p>Last Active: {selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleDateString() : "Never"}</p>
              </div>

              {selectedUser.address && (
                <div>
                  <strong>Address:</strong>
                  <p>{selectedUser.address.street}</p>
                  <p>{selectedUser.address.city}, {selectedUser.address.state}</p>
                  <p>{selectedUser.address.pincode}</p>
                </div>
              )}

              {selectedUser.role === "farmer" && (
                <div>
                  <strong>Farmer Details:</strong>
                  <p>Farm Size: {selectedUser.farmDetails?.size || "Not specified"}</p>
                  <p>Farm Location: {selectedUser.farmDetails?.location || "Not specified"}</p>
                  <p>Crops Grown: {selectedUser.farmDetails?.crops?.join(", ") || "Not specified"}</p>
                </div>
              )}

              {selectedUser.role === "delivery_partner" && (
                <div>
                  <strong>Delivery Partner Details:</strong>
                  <p>Vehicle: {selectedUser.deliveryPartnerDetails?.vehicle?.type || "Not specified"}</p>
                  <p>Capacity: {selectedUser.deliveryPartnerDetails?.vehicle?.capacity || "Not specified"}kg</p>
                  <p>Service Area: {selectedUser.deliveryPartnerDetails?.serviceArea?.maxDistance || "Not specified"}km</p>
                  <p>Application Status: {selectedUser.deliveryPartnerRegistration?.applicationStatus || "Not applied"}</p>
                </div>
              )}

              <div>
                <strong>Account Statistics:</strong>
                <p>Total Orders: {selectedUser.stats?.totalOrders || 0}</p>
                <p>Total Revenue: ₹{selectedUser.stats?.totalRevenue || 0}</p>
                <p>Success Rate: {selectedUser.stats?.successRate || 0}%</p>
              </div>

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                {selectedUser.status === "active" && (
                  <>
                    <button
                      onClick={() => handleUserAction(selectedUser._id, "suspend")}
                      className="btn btn-warning"
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      ⏸️ Suspend
                    </button>
                    <button
                      onClick={() => handleUserAction(selectedUser._id, "deactivate")}
                      className="btn btn-secondary"
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      ⏸️ Deactivate
                    </button>
                  </>
                )}
                {selectedUser.status === "inactive" && (
                  <button
                    onClick={() => handleUserAction(selectedUser._id, "activate")}
                    className="btn btn-success"
                    style={{ fontSize: "14px", padding: "8px 16px" }}
                  >
                    ✅ Activate
                  </button>
                )}
                {selectedUser.status === "suspended" && (
                  <button
                    onClick={() => handleUserAction(selectedUser._id, "reactivate")}
                    className="btn btn-success"
                    style={{ fontSize: "14px", padding: "8px 16px" }}
                  >
                    ✅ Reactivate
                  </button>
                )}
                <button
                  onClick={() => handleUserAction(selectedUser._id, "delete")}
                  className="btn btn-danger"
                  style={{ fontSize: "14px", padding: "8px 16px" }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>
          Users ({users.length})
        </h3>
        
        {users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
            <p>No users found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>User</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Joined</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Last Active</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "12px" }}>
                      <div>
                        <div style={{ fontWeight: "600" }}>{user.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {user.email}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: "16px" }}>
                        {getRoleIcon(user.role)} {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        background: getStatusColor(user.status),
                        color: "white"
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : "Never"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={() => viewUserDetails(user)}
                          className="btn btn-secondary"
                          style={{ fontSize: "11px", padding: "4px 8px" }}
                        >
                          👁️ View
                        </button>
                        {user.status === "active" && (
                          <button
                            onClick={() => handleUserAction(user._id, "suspend")}
                            className="btn btn-warning"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                          >
                            ⏸️ Suspend
                          </button>
                        )}
                        {user.status === "inactive" && (
                          <button
                            onClick={() => handleUserAction(user._id, "activate")}
                            className="btn btn-success"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                          >
                            ✅ Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
