import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function ProductionVerification() {
  const [productions, setProductions] = useState([]);
  const [categories, setCategories] = useState({ crops: 0, products: 0 });
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [categoryFilter, setCategoryFilter] = useState("all"); // all, crops, products
  const [selectedProduction, setSelectedProduction] = useState(null);
  const navigate = useNavigate();

  const fetchProductions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter && filter !== 'all') params.append('status', filter);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
      
      console.log('Fetching productions with params:', params.toString());
      
      const { data } = await apiCall(() => 
        API.get(`/admin/productions?${params.toString()}`)
      );
      
      if (data) {
        console.log('Received productions data:', data.productions?.length, 'items');
        console.log('Sample production:', data.productions?.[0]);
        setProductions(data.productions || []);
        setCategories(data.categories || { crops: 0, products: 0 });
        // Store counts from backend response
        setCounts({
          total: data.total || 0,
          pending: data.pending || 0,
          approved: data.approved || 0,
          rejected: data.rejected || 0
        });
      }
    } catch (error) {
      console.error("Error fetching productions:", error);
      setError("Failed to fetch productions");
    } finally {
      setLoading(false);
    }
  }, [filter, categoryFilter]);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchProductions();
  }, [navigate, fetchProductions]);

  const viewDetails = (production) => {
    setSelectedProduction(production);
  };

  const handleVerify = async (productionId, action) => {
    try {
      const { data, error } = await apiCall(() =>
        API.put(`/admin/productions/${productionId}/verify`, { action })
      );

      if (error) {
        setError(error);
      } else {
        setSuccess(`${data.message || `Production ${action}d successfully!`}`);
        // Close modal if open
        if (selectedProduction) {
          setSelectedProduction(null);
        }
        // Refresh the productions list
        await fetchProductions();
      }
    } catch (error) {
      console.error("Error verifying production:", error);
      setError("Failed to verify production");
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
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Status Filter */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h4 style={{ marginBottom: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>Status Filter:</h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { id: "all", label: "📋 All Items", count: counts.total },
                { id: "pending", label: "⏳ Pending", count: counts.pending },
                { id: "approved", label: "✅ Approved", count: counts.approved },
                { id: "rejected", label: "❌ Rejected", count: counts.rejected }
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

          {/* Category Filter */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h4 style={{ marginBottom: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>Category Filter:</h4>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { id: "all", label: "📦 All Categories", count: productions.length },
                { id: "crops", label: "🌾 Crops", count: categories.crops },
                { id: "products", label: "📦 Products", count: categories.products }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid var(--border-color)",
                    background: categoryFilter === tab.id ? "var(--primary-green)" : "transparent",
                    color: categoryFilter === tab.id ? "white" : "var(--text-secondary)",
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
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "16px" }}>
          Production Requests ({productions.length})
        </h3>
        
        {productions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              {categoryFilter === 'products' ? '📦' : categoryFilter === 'crops' ? '🌾' : '📋'}
            </div>
            <p>No {filter} {categoryFilter === 'products' ? 'products' : categoryFilter === 'crops' ? 'crops' : 'items'} found</p>
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
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        background: production.type === 'crop' ? "#4caf50" : "#2196f3",
                        color: "white"
                      }}>
                        {production.type === 'crop' ? '🌾 Crop' : '📦 Product'}
                      </span>
                      <h4 style={{ margin: "0" }}>
                        {production.name} - {production.quantity}{production.type === 'crop' ? 'kg' : ' units'}
                      </h4>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        background: production.isApproved === 'approved' ? "#4caf50" : 
                                   production.isApproved === 'rejected' ? "#f44336" : "#ff9800",
                        color: "white"
                      }}>
                        {production.isApproved === 'approved' ? "✅ Approved" : 
                         production.isApproved === 'rejected' ? "❌ Rejected" : "⏳ Pending"}
                      </span>
                    </div>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Seller:</strong> {production.seller?.name}
                    </p>
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Price:</strong> ₹{production.price}
                    </p>
                    
                    {production.type === 'crop' && production.harvestDate && (
                      <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                        <strong>Harvest Date:</strong> {new Date(production.harvestDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    {production.type === 'product' && production.stock !== undefined && (
                      <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                        <strong>Stock:</strong> {production.stock} units
                      </p>
                    )}
                    
                    <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                      <strong>Category:</strong> {production.category || 'N/A'}
                    </p>
                    
                    {production.description && (
                      <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                        <strong>Description:</strong> {production.description}
                      </p>
                    )}
                    
                    {production.location && (
                      <p style={{ margin: "0 0 4px 0", color: "var(--text-secondary)" }}>
                        <strong>Location:</strong> {production.location.address || production.location}
                      </p>
                    )}
                    
                    <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                      Submitted: {new Date(production.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => viewDetails(production)}
                      className="btn btn-secondary"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      👁️ View Details
                    </button>
                    {!production.isApproved || production.isApproved === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleVerify(production._id, "approve")}
                          className="btn btn-primary"
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
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Production Details Modal */}
      {selectedProduction && (
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
                {selectedProduction.type === 'crop' ? '🌾 Crop Details' : '📦 Product Details'}
              </h3>
              <button
                onClick={() => setSelectedProduction(null)}
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
                <p>Name: {selectedProduction.name}</p>
                <p>Type: {selectedProduction.type === 'crop' ? 'Crop' : 'Product'}</p>
                <p>Category: {selectedProduction.category || 'N/A'}</p>
                <p>Quantity: {selectedProduction.quantity}{selectedProduction.type === 'crop' ? 'kg' : ' units'}</p>
                <p>Price: ₹{selectedProduction.price}</p>
                <p>Status: {selectedProduction.isApproved === 'approved' ? '✅ Approved' : 
               selectedProduction.isApproved === 'rejected' ? '❌ Rejected' : '⏳ Pending'}</p>
              </div>

              <div>
                <strong>Seller Information:</strong>
                <p>Name: {selectedProduction.seller?.name}</p>
                <p>Email: {selectedProduction.seller?.email}</p>
                <p>Phone: {selectedProduction.seller?.phone}</p>
              </div>

              {selectedProduction.type === 'crop' && (
                <div>
                  <strong>Crop Specific:</strong>
                  <p>Harvest Date: {selectedProduction.harvestDate ? new Date(selectedProduction.harvestDate).toLocaleDateString() : 'N/A'}</p>
                  <p>Quality Grade: {selectedProduction.qualityGrade || 'N/A'}</p>
                </div>
              )}

              {selectedProduction.type === 'product' && selectedProduction.stock !== undefined && (
                <div>
                  <strong>Product Specific:</strong>
                  <p>Stock: {selectedProduction.stock} units</p>
                </div>
              )}

              <div>
                <strong>Description:</strong>
                <p>{selectedProduction.description || 'No description provided'}</p>
              </div>

              <div>
                <strong>Location:</strong>
                <p>{selectedProduction.location?.address || selectedProduction.location || 'N/A'}</p>
              </div>

              <div>
                <strong>Submission Details:</strong>
                <p>Submitted: {new Date(selectedProduction.createdAt).toLocaleString()}</p>
              </div>

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                {(!selectedProduction.isApproved || selectedProduction.isApproved === 'pending') && (
                  <>
                    <button
                      onClick={() => handleVerify(selectedProduction._id, "approve")}
                      className="btn btn-primary"
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleVerify(selectedProduction._id, "reject")}
                      className="btn btn-danger"
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedProduction(null)}
                  className="btn btn-secondary"
                  style={{ fontSize: "14px", padding: "8px 16px" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
