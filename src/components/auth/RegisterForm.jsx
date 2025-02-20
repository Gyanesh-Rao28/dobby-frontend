// src/components/auth/RegisterForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { User, Mail, Lock } from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Remove confirmPassword as it's not needed for API
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);

      if (result.success) {
        navigate("/login", {
          state: { message: "Registration successful. Please log in." },
        });
      } else {
        setApiError(result.message);
      }
    } catch (error) {
      setApiError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        {apiError && (
          <Alert
            type="error"
            message={apiError}
            onClose={() => setApiError("")}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Username"
              id="username"
              name="username"
              type="text"
              required
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon={<User size={18} />}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail size={18} />}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              required
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={18} />}
            />
          </div>

          <div className="mb-6">
            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={18} />}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
