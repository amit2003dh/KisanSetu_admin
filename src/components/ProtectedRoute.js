import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const adminToken = localStorage.getItem("adminToken");
      
      if (!adminToken) {
        navigate("/admin/login");
        return;
      }

      try {
        // Verify token with backend
        const response = await API.get("/auth/admin/profile");
        if (response.data) {
          setAuthorized(true);
        } else {
          // Token invalid, redirect to login
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminData");
          navigate("/admin/login");
        }
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column"
      }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "16px", color: "#666" }}>Authenticating...</p>
      </div>
    );
  }

  return authorized ? children : null;
}
