// src/components/PrivateRoute.tsx
import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import {RootState} from "../store";

const PrivateRoute: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
