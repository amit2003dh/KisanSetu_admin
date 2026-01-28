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
        console.log('Frontend received partners data:', data.partners[0]); // Debug log
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
      // Debug: Log the partnerId to see what's being sent
      console.log('Attempting to verify delivery partner:', { partnerId, action });
      
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

  const viewPartnerDetails = async (partner) => {
    try {
      // Fetch detailed delivery partner data
      const { data, error } = await apiCall(() =>
        API.get(`/admin/delivery-partners/${partner._id}/details`)
      );

      if (error) {
        setError(error);
      } else {
        // Combine basic partner info with detailed info
        setSelectedPartner({
          ...partner,
          ...data.partner
        });
      }
    } catch (error) {
      console.error("Error fetching partner details:", error);
      setError("Failed to fetch delivery partner details");
    }
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
            { id: "pending", label: "⏳ Pending", count: partners.filter(p => p.isApproved === 'pending').length },
            { id: "approved", label: "✅ Approved", count: partners.filter(p => p.isApproved === 'approved').length },
            { id: "rejected", label: "❌ Rejected", count: partners.filter(p => p.isApproved === 'rejected').length }
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
                <p>Address: {selectedPartner.address || 'Not provided'}</p>
              </div>

              <div>
                <strong>Vehicle Information:</strong>
                <p>Type: {selectedPartner.vehicle?.type || 'Not provided'}</p>
                <p>Number: {selectedPartner.vehicle?.number || 'Not provided'}</p>
                <p>Capacity: {selectedPartner.vehicle?.capacity || 0}kg</p>
              </div>

              <div>
                <strong>Service Area:</strong>
                <p>Max Distance: {selectedPartner.serviceArea?.maxDistance || 50}km</p>
                {selectedPartner.serviceArea?.cities && selectedPartner.serviceArea.cities.length > 0 ? (
                  <p>Cities: {selectedPartner.serviceArea.cities.join(", ")}</p>
                ) : (
                  <p>Cities: Not specified</p>
                )}
              </div>

              <div>
                <strong>Documents:</strong>
                {selectedPartner.documents?.drivingLicense ? (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <a href={selectedPartner.documents.drivingLicense} target="_blank" rel="noopener noreferrer">
                      <button className="btn btn-secondary" style={{ fontSize: "12px" }}>
                        📄 Driving License
                      </button>
                    </a>
                  </div>
                ) : (
                  <p style={{ color: "var(--text-secondary)" }}>No documents uploaded</p>
                )}
              </div>

              <div>
                <strong>Bank Details:</strong>
                <p>Account Number: {selectedPartner.bankDetails?.accountNumber ? 
                  `****${selectedPartner.bankDetails.accountNumber.slice(-4)}` : 'Not provided'}</p>
                <p>IFSC: {selectedPartner.bankDetails?.ifscCode || 'Not provided'}</p>
                <p>Account Holder: {selectedPartner.bankDetails?.accountHolderName || 'Not provided'}</p>
              </div>

              {selectedPartner.isApproved === 'pending' && (
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
                        background: partner.isApproved === 'approved' ? "#4caf50" : 
                                   partner.isApproved === 'rejected' ? "#f44336" : 
                                   partner.isApproved === 'not_applied' ? "#9e9e9e" : "#ff9800",
                        color: "white"
                      }}>
                        {partner.isApproved === 'approved' ? '✅ Approved' : 
                         partner.isApproved === 'rejected' ? '❌ Rejected' : 
                         partner.isApproved === 'not_applied' ? '📝 Not Applied' : '⏳ Pending'}
                      </span>
                    </div>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Email:</strong> {partner.email}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Phone:</strong> {partner.phone}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Applied:</strong> {new Date(partner.applicationDate || partner.createdAt).toLocaleString()}
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
                    {partner.isApproved === 'pending' && (
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
