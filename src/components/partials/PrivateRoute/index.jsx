import useAuthenticationState from "@/hooks/state/useAuthenticationState";
import { Navigate, useLocation } from "react-router-dom";
import RootLoading from "../RootLoading.jsx";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthenticationState();
  const location = useLocation();

  if (loading) {
    return <RootLoading />;
  }

  if (user) {
    return children;
  }

  return (
    <Navigate to="/authentication/sign-in" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
