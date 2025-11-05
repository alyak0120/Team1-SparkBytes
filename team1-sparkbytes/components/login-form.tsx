"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Input, Button, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Form validation
  // -----------------------------
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Please input your email!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (!formData.email.endsWith("@bu.edu")) {
      newErrors.email = "Enter a valid BU email address (@bu.edu)";
    }

    if (!formData.password) {
      newErrors.password = "Please input your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Handle form submission
  // -----------------------------
  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        message.success("Welcome back to SparkBytes!");
        setLoading(false);

        // Store login state in localStorage (if needed)
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", formData.email);

        // Navigate to dashboard or homepage
        router.push("/");
      }, 500);
    }
  };

  // -----------------------------
  // Navigation helpers
  // -----------------------------
  const handleNavigateToSignUp = () => {
    router.push("/auth/sign-up");
  };

  const handleNavigateToForgotPassword = () => {
    router.push("/auth/update-password");
  };

  const handleNavigateToAbout = () => {
    router.push("/about");
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xlg" style={{ padding: "1rem" }}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center">
            <img 
              src="https://content.sportslogos.net/logos/30/619/full/boston_university_terriers_logo_secondary_2005_sportslogosnet-9216.png"
              alt="Boston University Logo">
            </img>
          </div>
        </div>

        <h1 className="text-center text-red-600 mb-2">Welcome Back!</h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to find free food at BU
        </p>

        {/* Form fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-1.5">BU Email</label>
            <Input
              size="large"
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="example@bu.edu"
              value={formData.email}
              status={errors.email ? "error" : ""}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: "" });
              }}
              onPressEnter={handleSubmit}
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1.5">Password</label>
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              value={formData.password}
              status={errors.password ? "error" : ""}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrors({ ...errors, password: "" });
              }}
              onPressEnter={handleSubmit}
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {errors.password}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              checked={formData.remember}
              onChange={(e) =>
                setFormData({ ...formData, remember: e.target.checked })
              }
            >
              Remember me
            </Checkbox>
            <a
              onClick={handleNavigateToForgotPassword}
              className="text-red-600 hover:text-red-700 cursor-pointer"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700"
          >
            Sign In
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              onClick={handleNavigateToSignUp}
              className="text-red-600 hover:text-red-700 cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
