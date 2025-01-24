import { Navigate, useLocation, Outlet } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  if (isAuthenticated) {
    if (
      location.pathname.includes("login") ||
      location.pathname.includes("signup")
    )
      return <Navigate to="/notes" />;

    if (location.pathname.includes("admin")) {
      if (user?.role === "user") return <Navigate to="/notes" />;
    }
  }

  if (!isAuthenticated) {
    if (
      location.pathname.includes("admin") ||
      location.pathname.includes("notes") ||
      location.pathname.includes("profile")
    ) {
      return <Navigate to="/login" />;
    }
  }

  return <Outlet/>
};

export default CheckAuth;
