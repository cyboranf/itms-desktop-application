import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { DataContext } from "../../context/data-context";
import { ROLES } from "../../context/data-context";

type ProtectedRouteProps = {
  children: JSX.Element;
  requiredRoles?: ROLES[];
};

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { currentUser } = useContext(DataContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
    return <Navigate to="/login" />; // Możesz przekierować na stronę błędu autoryzacji
  }

  return children;
};

export default ProtectedRoute;
