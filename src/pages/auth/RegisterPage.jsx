// src/pages/auth/RegisterPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
