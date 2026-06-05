import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardSkeleton from "./components/DashboardSkeleton";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return <ErrorBoundary><Suspense fallback={<div className="mx-auto max-w-7xl p-6"><DashboardSkeleton /></div>}><Routes>
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="/unauthorized" element={<ErrorPage type="unauthorized" />} />
    <Route path="/server-error" element={<ErrorPage type="server" />} />
    <Route element={<ProtectedRoute />}><Route path="/dashboard" element={<DashboardPage />} /><Route path="/profile" element={<ProfilePage />} /></Route>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense></ErrorBoundary>;
}
