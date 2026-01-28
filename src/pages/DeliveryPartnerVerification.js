import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function DeliveryPartnerVerification() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected
  const [selectedPartner, setSelectedPartner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchPartners();
  }, [navigate, filter]);

  const fetchPartners = async () => {
    try {
      const { data } = await apiCall(() => 
        API.get(`/admin/delivery-partners?status=${filter}`)
      );
      if (data) {
        setPartners(data.partners || []);
      }
    } catch (error) {
      console.error("Error fetching delivery partners:", error);
      setError("Failed to fetch delivery partner applications");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (partnerId, action) => {
    try {
      const { data, error } = await apiCall(() =>
        API.put(`/admin/delivery-partners/${partnerId}/verify`, { action })
      );

      if (error) {
        setError(error);
      } else {
        setSuccess(`Delivery partner application ${action}d successfully!`);
        fetchPartners(); // Refresh data
        setSelectedPartner(null); // Close detail view
      }
    } catch (error) {
      setError(`Failed to ${action} delivery partner application`);
    }
  };

  const viewPartnerDetails = (partner) => {
    setSelectedPartner(partner);
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loading-spinner"></div>
          <p>Loading delivery partner verification...</p>
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
            <h1>🚚 Delivery Partner Verification</h1>
            <p>Review and approve delivery partner applications</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}
      {success && <div className="success-message" style={{ marginBottom: "16px" }}>{success}</div>}

      {/* Filter Tabs */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { id: "pending", label: "⏳ Pending", count: partners.filter(p => p.status === "pending").length },
            { id: "approved", label: "✅ Approved", count: partners.filter(p => p.status === "approved").length },
            { id: "rejected", label: "❌ Rejected", count: partners.filter(p => p.status === "rejected").length }
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

      {/* Partner Detail Modal */}
      {selectedPartner && (
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
              <h3 style={{ margin: 0 }}>Delivery Partner Details</h3>
              <button
                onClick={() => setSelectedPartner(null)}
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
                <strong>Personal Information:</strong>
                <p>Name: {selectedPartner.name}</p>
                <p>Email: {selectedPartner.email}</p>
                <p>Phone: {selectedPartner.phone}</p>
                <p>Address: {selectedPartner.address}</p>
              </div>

              <div>
                <strong>Vehicle Information:</strong>
                <p>Type: {selectedPartner.vehicle?.type}</p>
                <p>Number: {selectedPartner.vehicle?.number}</p>
                <p>Capacity: {selectedPartner.vehicle?.capacity}kg</p>
              </div>

              <div>
                <strong>Service Area:</strong>
                <p>Max Distance: {selectedPartner.serviceArea?.maxDistance || 50}km</p>
                {selectedPartner.serviceArea?.cities && (
                  <p>Cities: {selectedPartner.serviceArea.cities.join(", ")}</p>
                )}
              </div>

              <div>
                <strong>Documents:</strong>
                {selectedPartner.documents && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {selectedPartner.documents.drivingLicense && (
                      <a href={selectedPartner.documents.drivingLicense} target="_blank" rel="noopener noreferrer">
                        <button className="btn btn-secondary" style={{ fontSize: "12px" }}>
                          📄 Driving License
                        </button>
                      </a>
                    )}
                    {selectedPartner.documents.vehicleRC && (
                      <a href={selectedPartner.documents.vehicleRC} target="_blank" rel="noopener noreferrer">
                        <button className="btn btn-secondary" style={{ fontSize: "12px" }}>
                          📄 Vehicle RC
                        </button>
                      </a>
                    )}
                    {selectedPartner.documents.aadharCard && (
                      <a href={selectedPartner.documents.aadharCard} target="_blank" rel="noopener noreferrer">
                        <button className="btn btn-secondary" style={{ fontSize: "12px" }}>
                          📄 Aadhar Card
                        </button>
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div>
                <strong>Bank Details:</strong>
                <p>Account Number: ****{selectedPartner.bankDetails?.accountNumber?.slice(-4)}</p>
                <p>IFSC: {selectedPartner.bankDetails?.ifsc}</p>
              </div>

              {selectedPartner.status === "pending" && (
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleVerify(selectedPartner._id, "reject")}
                    className="btn btn-danger"
                    style={{ fontSize: "14px", padding: "8px 16px" }}
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => handleVerify(selectedPartner._id, "approve")}
                    className="btn btn-success"
                    style={{ fontSize: "14px", padding: "8px 16px" }}
                  >
                    ✅ Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>
          Delivery Partner Applications ({partners.length})
        </h3>
        
        {partners.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚚</div>
            <p>No {filter} delivery partner applications</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {partners.map((partner) => (
              <div key={partner._id} style={{
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "16px",
                background: "var(--background)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0 }}>
                        {partner.name}
                      </h4>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        background: partner.status === "approved" ? "#4caf50" : 
                                   partner.status === "rejected" ? "#f44336" : "#ff9800",
                        color: "white"
                      }}>
                        {partner.status}
                      </span>
                    </div>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Email:</strong> {partner.email}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Phone:</strong> {partner.phone}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Vehicle:</strong> {partner.vehicle?.type} ({partner.vehicle?.capacity}kg)
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Service Area:</strong> {partner.serviceArea?.maxDistance || 50}km
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Applied:</strong> {new Date(partner.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => viewPartnerDetails(partner)}
                      className="btn btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      👁️ View Details
                    </button>
                    {partner.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleVerify(partner._id, "approve")}
                          className="btn btn-success"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleVerify(partner._id, "reject")}
                          className="btn btn-danger"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                          ❌ Reject
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
