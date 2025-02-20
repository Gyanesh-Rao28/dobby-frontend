// src/pages/auth/LoginPage.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import Alert from "../../components/ui/Alert";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notification, setNotification] = React.useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Show notification if redirected from another page
  useEffect(() => {
    if (location.state?.message) {
      setNotification(location.state.message);
    }
  }, [location]);

  return (
    <AuthLayout>
      {notification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <Alert
            type="success"
            message={notification}
            onClose={() => setNotification("")}
          />
        </div>
      )}
      <LoginForm />
    </AuthLayout>
  );
}
