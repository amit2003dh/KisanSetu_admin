import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function ProductionVerification() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchProductions();
  }, [navigate, filter]);

  const fetchProductions = async () => {
    try {
      const { data } = await apiCall(() => 
        API.get(`/admin/productions?status=${filter}`)
      );
      if (data) {
        setProductions(data.productions || []);
      }
    } catch (error) {
      console.error("Error fetching productions:", error);
      setError("Failed to fetch production requests");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (productionId, action) => {
    try {
      const { data, error } = await apiCall(() =>
        API.put(`/admin/productions/${productionId}/verify`, { action })
      );

      if (error) {
        setError(error);
      } else {
        setSuccess(`Production ${action}d successfully!`);
        fetchProductions(); // Refresh data
      }
    } catch (error) {
      setError(`Failed to ${action} production`);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner"></div>
          <p>Loading production verification...</p>
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
            <h1>🌾 Production Verification</h1>
            <p>Verify and approve farmer production requests</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: "16px" }}>{success}</div>}

      {/* Filter Tabs */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { id: "pending", label: "⏳ Pending", count: productions.filter(p => p.status === "pending").length },
            { id: "approved", label: "✅ Approved", count: productions.filter(p => p.status === "approved").length },
            { id: "rejected", label: "❌ Rejected", count: productions.filter(p => p.status === "rejected").length }
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

      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>
          Production Requests ({productions.length})
        </h3>
        
        {productions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌾</div>
            <p>No {filter} production requests</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {productions.map((production) => (
              <div key={production._id} style={{
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "16px",
                background: "var(--background)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <h4 style={{ margin: "0" }}>
                        {production.cropType} - {production.quantity}kg
                      </h4>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        background: production.status === "approved" ? "#4caf50" : 
                                   production.status === "rejected" ? "#f44336" : "#ff9800",
                        color: "white"
                      }}>
                        {production.status}
                      </span>
                    </div>
                    
                    <p style={{ margin: "0 0 8px 0", color: "var(--text-secondary)" }}>
                      <strong>Farmer:</strong> {production.farmerId?.name || "Unknown"}
                    </p>
                    
                    <p style={{ margin: "0 0 8px 0", color: "var(--text-secondary)" }}>
                      <strong>Location:</strong> {production.location?.address || "Not specified"}
                    </p>
                    
                    <p style={{ margin: "0 0 8px 0", color: "var(--text-secondary)" }}>
                      <strong>Expected Harvest:</strong> {new Date(production.expectedHarvestDate).toLocaleDateString()}
                    </p>
                    
                    <p style={{ margin: "0 0 8px 0", color: "var(--text-secondary)" }}>
                      <strong>Quality Grade:</strong> {production.qualityGrade || "Not specified"}
                    </p>
                    
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                      {production.description}
                    </p>
                    
                    {production.images && production.images.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <strong>Images:</strong>
                        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                          {production.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Production image ${index + 1}`}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid var(--border-color)"
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                      Submitted: {new Date(production.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  {production.status === "pending" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleVerify(production._id, "approve")}
                        className="btn btn-success"
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleVerify(production._id, "reject")}
                        className="btn btn-danger"
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
