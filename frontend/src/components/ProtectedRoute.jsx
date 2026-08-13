import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // No token → Login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token is there → Page open
  return children;
}

export default ProtectedRoute;