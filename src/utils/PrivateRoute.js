import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Show a loading indicator while checking auth state

  return isLoggedIn ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;