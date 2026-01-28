import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { apiCall } from "../api/api";

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await apiCall(() =>
        API.post("/auth/admin/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          secretKey: formData.secretKey
        })
      );

      if (error) {
        setError(error);
      } else {
        setSuccess("Admin account created successfully! Redirecting to dashboard...");
        
        // Store admin token and data
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to create admin account. Please check your secret key and try again.");
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
        maxWidth: "450px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
          <h1 style={{ margin: "0 0 8px 0", color: "#333" }}>
            Admin Signup
          </h1>
          <p style={{ margin: "0", color: "#666" }}>
            Create new admin account
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
        
        {success && (
          <div style={{
            background: "#e8f5e8",
            border: "1px solid #c3e6c3",
            color: "#2e7d32",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "16px",
            fontSize: "14px",
            textAlign: "center"
          }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              placeholder="John Doe"
            />
          </div>

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

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
              placeholder="Min 6 characters"
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
              placeholder="Re-enter password"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
              Secret Key 🔑
            </label>
            <input
              type="password"
              name="secretKey"
              value={formData.secretKey}
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
              placeholder="Enter admin secret key"
            />
            <p style={{ 
              margin: "8px 0 0 0", 
              fontSize: "12px", 
              color: "#666" 
            }}>
              🔒 Secret key is required for admin registration
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
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
            Already have an admin account?
          </p>
          <button
            onClick={() => navigate("/admin/login")}
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
            Sign In
          </button>
        </div>

        <div style={{ 
          marginTop: "16px", 
          padding: "12px", 
          background: "#fff3cd", 
          border: "1px solid #ffeaa7",
          borderRadius: "8px"
        }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#856404", textAlign: "center" }}>
            ⚠️ Admin registration requires valid secret key. Contact system administrator for access.
          </p>
        </div>
      </div>
    </div>
  );
}
