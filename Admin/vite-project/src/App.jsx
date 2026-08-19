import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Auth/Login";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import DashboardLayout from "./Components/Layout/DashboardLayout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Users from "./Components/Users/Users";
import Payments from "./Components/Payments/Payments";
import Portfolios from "./Components/Portfolios/Portfolios";
import Discussions from "./Components/Discussions/Discussions";
import Enquiries from "./Components/Enquiries/Enquiries";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/portfolios" element={<Portfolios />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/enquiries" element={<Enquiries />} />
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;