import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: any;
  allowedRoles: Array<"admin" | "tenant" | "agent" | "owner">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // role stored after login

  const role = JSON.parse(userRole!);


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(role as "admin" | "tenant" | "agent" | "owner")
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
