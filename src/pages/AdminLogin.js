import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await apiCall(() =>
        API.post("/auth/admin/login", formData)
      );

      if (error) {
        setError(error);
      } else {
        // Store admin token and data
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        
        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛡️</div>
          <h1 style={{ margin: "0 0 8px 0", color: "#333" }}>
            Admin Login
          </h1>
          <p style={{ margin: "0", color: "#666" }}>
            KisanSetu Administration Portal
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fee",
            border: "1px solid #fcc",
            color: "#c33",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
              placeholder="admin@kisansetu.com"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ 
          marginTop: "24px", 
          padding: "16px", 
          background: "#f8f9fa", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>
            Admin Access Only
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#666" }}>
            For assistance, contact system administrator
          </p>
          <button
            onClick={() => navigate("/admin/signup")}
            style={{
              background: "transparent",
              border: "1px solid #007bff",
              color: "#007bff",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            🔑 Create Admin Account
          </button>
        </div>
      </div>
    </div>
  );
}
