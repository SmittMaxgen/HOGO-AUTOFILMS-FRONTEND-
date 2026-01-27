// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = () => {
//   const { isAuthenticated, loading } = useSelector((state) => state.auth);

//   // 🔑 Fallback for page refresh
//   const token = localStorage.getItem("token");

//   // ⏳ Wait while auth is resolving
//   if (loading) {
//     return <div>Checking authentication...</div>;
//   }

//   // ❌ Not authenticated AND no token
//   if (!isAuthenticated && !token) {
//     return <Navigate to="/login" replace />;
//   }

//   // ✅ Authenticated
//   return <Outlet />;
// };

// export default ProtectedRoute;
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <div>Checking authentication...</div>;

  if (!isAuthenticated) {
    if (location.pathname === "/login") return null;

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
