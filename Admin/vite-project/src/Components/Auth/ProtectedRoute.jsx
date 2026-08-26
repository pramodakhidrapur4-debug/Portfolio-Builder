import { Navigate } from "react-router-dom";

/**
 * Route guard — redirects to /login if admin not authenticated.
 * Checks sessionStorage so auth persists within the browser tab session.
 */
const ProtectedRoute = ({ children }) => {
  const isAuth = !!sessionStorage.getItem("adminAuth");

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
