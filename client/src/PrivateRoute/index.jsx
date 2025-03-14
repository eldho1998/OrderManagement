import { checkUserId, getRole } from "../utils/localfunction";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = ({ role }) => {
  console.log("PrivateRoute Check:", checkUserId(), "Role:", getRole());
  return checkUserId() && getRole() === role ? (
    <Outlet />
  ) : (
    <Navigate to="/user/login" replace />
  );
};

export default PrivateRoute;
