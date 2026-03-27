import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProviderRoute({ children }) {
  const { user } = useSelector((store) => store.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "provider") {
    return <Navigate to="/" />;
  }

  return children;
}