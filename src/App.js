import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

function AppContent() {
  const location = useLocation();
  
  // Check if current page should show navbar
  const shouldShowNavbar = location.pathname !== "/admin/login" && 
                         location.pathname !== "/admin/signup" &&
                         location.pathname !== "/";

  return (
    <>
      {shouldShowNavbar && <AdminNavbar />}
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
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
