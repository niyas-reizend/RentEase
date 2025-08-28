
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Unauthorized from "./Pages/Unauthorized";
import ProtectedRoute from "./Components/ProtectedRoutes";
import DashboardLayout from "./Layouts/DashboardLayout";
import TenantDashboard from "./Pages/Tenant/TenantDashboard";
import OwnerDashboard from "./Pages/Owner/OwnerDashboard";
import MyProperties from "./Pages/Owner/MyProperties";
import TenantProfile from "./Pages/Tenant/TenantProfile";
import MyEnquiry from "./Pages/Tenant/MyEnquiry";
import MyBooking from "./Pages/Tenant/MyBooking";
import Enquiries from "./Pages/Owner/Enquiries";
import OwnerBookings from "./Pages/Owner/OwnerBookings";
import OwnAgreements from "./Pages/Owner/OwnAgreements";
import TenantAgreement from "./Pages/Tenant/TenantAgreement";
import AgentProperties from "./Pages/Agent/AgentProperties";
import AgentCommissions from "./Pages/Agent/AgentCommissions";
import UserList from "./Pages/Admin/UserList";
import Agreements from "./Pages/Admin/Agreements";
import TenantVerification from "./Pages/Admin/TenantVerification";
import Properties from "./Pages/Admin/Properties";
import VerifyProperty from "./Pages/Admin/VerifyProperty";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

  

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Dashboard Routes */}

        {/* Tenant routes  */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["tenant"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/tenant-dashboard" element={<TenantDashboard />} />
          <Route path="/tenantprofile" element={<TenantProfile />} />
          <Route path="/enquiries" element={<MyEnquiry />} />
          <Route path="/bookings" element={<MyBooking />} />
          <Route path="/tenantAgreements" element={<TenantAgreement />} />
        </Route>
        {/* Admin Routes  */}
        <Route
          element={
            <ProtectedRoute  allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/properties" element={<Properties />} />
          <Route path="/admin/verifyproperties" element={<VerifyProperty />} />
          <Route
            path="/admin/tenant-verification"
            element={<TenantVerification />}
          />
          <Route path="/admin/agreements" element={<Agreements />} />
        </Route>
        {/* Owner Routes  */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/properties" element={<MyProperties />} />
          <Route path="/owner/enquiries" element={<Enquiries />} />
          <Route path="/owner/bookings" element={<OwnerBookings />} />
          <Route path="/owner/agreements" element={<OwnAgreements />} />
        </Route>
        {/* Agent Routes  */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["agent"]} >
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route path="/agent-dashboard" element={<h1>agent dashboard</h1>} /> */}
          <Route path="/agent/properties" element={<AgentProperties />} />
          <Route path="/agent/commissions" element={<AgentCommissions />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
