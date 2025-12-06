"use client";

import { useState } from 'react';
import { Card, Input, Button, Checkbox, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { createClient } from "@/lib/supabase/client";

const supabase = createClient(); // Supabase client

interface SignUpProps {
  onSignUp: () => void;
  onNavigate?: (path: string) => void;
}

export default function SignUpForm({ onSignUp, onNavigate }: SignUpProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreement: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Please input your name!";
    if (!formData.email) {
      newErrors.email = "Please input your BU email!";
    } else if (!formData.email.endsWith("@bu.edu")) {
      newErrors.email = "Email must be a BU address (@bu.edu)";
    }

    if (!formData.password) {
      newErrors.password = "Please input your password!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    if (!formData.agreement)
      newErrors.agreement = "You must accept the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validateForm()) return;

  setLoading(true);

  // IMPORTANT: DO NOT include redirect_to when confirm email is OFF
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: undefined,  // <-- FIX
      data: { name: formData.name },
    },
  });

  if (error) {
    message.error(error.message);
    setLoading(false);
    return;
  }

    // 2️⃣ Send welcome email (does not block user)
    fetch("/api/email/welcome", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: formData.email,
      name: formData.name,
    }),
  });
    // 3️⃣ Handle incomplete sign-ups (Supabase email confirmation)
    if (!data.session) {
      message.success("Account created! Check your BU email to confirm.");
    } else {
      message.success("Account created successfully!");
      onSignUp();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg" style={{ padding: "2rem" }}>
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center">
            <img 
              src="https://content.sportslogos.net/logos/30/619/full/boston_university_terriers_logo_secondary_2005_sportslogosnet-9216.png"
              alt="Boston University Logo"
            />
          </div>
        </div>

        <h1 className="text-center text-red-600 mb-2">Join SparkBytes!</h1>
        <p className="text-center text-gray-600 mb-8">
          Help reduce food waste at BU.
        </p>

        {/* FORM */}
        <div className="space-y-5">

          <div>
            <label className="block text-sm mb-1.5">Full Name</label>
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Your Name"
              value={formData.name}
              status={errors.name ? "error" : ""}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1.5">BU Email</label>
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="example@bu.edu"
              value={formData.email}
              status={errors.email ? "error" : ""}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1.5">Password</label>
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              value={formData.password}
              status={errors.password ? "error" : ""}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1.5">Confirm Password</label>
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              value={formData.confirmPassword}
              status={errors.confirmPassword ? "error" : ""}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setErrors({ ...errors, confirmPassword: "" });
              }}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <Checkbox
            checked={formData.agreement}
            onChange={(e) => {
              setFormData({ ...formData, agreement: e.target.checked });
              setErrors({ ...errors, agreement: "" });
            }}
          >
            <span className={errors.agreement ? "text-red-500" : ""}>
              I understand SparkBytes is for BU students only.
            </span>
          </Checkbox>

          {errors.agreement && (
            <p className="text-red-500 text-sm">{errors.agreement}</p>
          )}

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleSubmit}
            className="bg-red-600"
          >
            Create Account
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a
              onClick={() => onNavigate?.("login")}
              className="text-red-600 cursor-pointer"
            >
              Sign in
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
