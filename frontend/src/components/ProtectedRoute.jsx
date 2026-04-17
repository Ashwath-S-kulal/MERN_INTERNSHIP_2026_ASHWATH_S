import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../components/auth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((store) => store.user);
  const token = localStorage.getItem("accessToken");

  // ❗ main fix
  if (!user || !token || isTokenExpired(token)) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}