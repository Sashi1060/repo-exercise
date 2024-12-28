import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const accessToken = useSelector((state) => state.auth.accessToken);

  // If no accessToken, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (protected component)
  return children;
}
