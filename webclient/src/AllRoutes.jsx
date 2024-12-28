import React from "react";
import AuthForm from "./components/auth/AuthForm";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/user/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileView from "./components/user/profile/ProfileView";

export default function AllRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<AuthForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
