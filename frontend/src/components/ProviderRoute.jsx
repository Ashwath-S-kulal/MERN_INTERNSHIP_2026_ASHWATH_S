import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../components/auth";

export default function ProviderRoute({ children }) {
  const { user } = useSelector((store) => store.user);
  const token = localStorage.getItem("accessToken");

  // ❗ main fix
  if (!user || !token || isTokenExpired(token)) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "provider") {
    return <Navigate to="/" replace />;
  }

  return children;
}