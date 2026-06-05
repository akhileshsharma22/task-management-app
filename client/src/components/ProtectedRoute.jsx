import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSkeleton from "./DashboardSkeleton";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="mx-auto max-w-7xl p-6"><DashboardSkeleton /></div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
