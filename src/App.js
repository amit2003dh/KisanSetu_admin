import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import ProductionVerification from "./pages/ProductionVerification";
import DeliveryPartnerVerification from "./pages/DeliveryPartnerVerification";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import Analytics from "./pages/Analytics";
import AdminNavbar from "./components/AdminNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    // Hide navbar on login and signup pages
    const currentPath = window.location.pathname;
    if (currentPath === "/admin/login" || currentPath === "/admin/signup") {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, []);

  return (
    <BrowserRouter>
      {showNavbar && <AdminNavbar />}
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/production-verification" element={<ProtectedRoute><ProductionVerification /></ProtectedRoute>} />
        <Route path="/admin/delivery-verification" element={<ProtectedRoute><DeliveryPartnerVerification /></ProtectedRoute>} />
        <Route path="/admin/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/order-management" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        
        {/* Redirect root to admin login */}
        <Route path="/" element={<AdminLogin />} />
        
        {/* Catch all route - redirect to admin login */}
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
