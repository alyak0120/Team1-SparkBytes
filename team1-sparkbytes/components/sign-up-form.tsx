"use client";

import { useState } from 'react';
import { Card, Input, Button, Checkbox, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Sparkles } from 'lucide-react';

interface SignUpProps {
  onSignUp: () => void;
  onNavigate?: (path: string) => void;
}

export default function SignUpForm({ onSignUp, onNavigate }: SignUpProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Please input your name!';
    }

    if (!formData.email) {
      newErrors.email = 'Please input your email!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email!';
    } else if (!formData.email.endsWith('@bu.edu')) {
      newErrors.email = 'Enter a valid BU email address (@bu.edu)';
    }

    if (!formData.password) {
      newErrors.password = 'Please input your password!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters!';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password!';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
    }

    if (!formData.agreement) {
      newErrors.agreement = 'Please accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        message.success('Account created successfully!');
        setLoading(false);
        onSignUp();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg" style={{ padding: '2rem' }}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center">
              <img 
              src="https://content.sportslogos.net/logos/30/619/full/boston_university_terriers_logo_secondary_2005_sportslogosnet-9216.png"
              alt="Boston University Logo">
              </img>
          </div>
        </div>
        
        <h1 className="text-center text-red-600 mb-2">Join SparkBytes!</h1>
        <p className="text-center text-gray-600 mb-8">
          Help reduce food waste at BU
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-1.5">Full Name</label>
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Your Name"
              value={formData.name}
              status={errors.name ? 'error' : ''}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
            />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm mb-1.5">BU Email</label>
            <Input
              size="large"
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="example@bu.edu"
              value={formData.email}
              status={errors.email ? 'error' : ''}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: '' });
              }}
            />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>

          <div>
            <label className="block text-sm mb-1.5">Password</label>
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              value={formData.password}
              status={errors.password ? 'error' : ''}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrors({ ...errors, password: '' });
              }}
            />
            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
          </div>

          <div>
            <label className="block text-sm mb-1.5">Confirm Password</label>
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              value={formData.confirmPassword}
              status={errors.confirmPassword ? 'error' : ''}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setErrors({ ...errors, confirmPassword: '' });
              }}
            />
            {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
          </div>

          <div>
            <Checkbox
              checked={formData.agreement}
              onChange={(e) => {
                setFormData({ ...formData, agreement: e.target.checked });
                setErrors({ ...errors, agreement: '' });
              }}
            >
              <span className={errors.agreement ? 'text-red-500' : ''}>
                I understand that SparkBytes is available for BU students only
              </span>
            </Checkbox>
            {errors.agreement && <div className="text-red-500 text-sm mt-1">{errors.agreement}</div>}
          </div>

          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700"
          >
            Create Account
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              onClick={() => handleNavigate('login')}
              className="text-red-600 hover:text-red-700 cursor-pointer"
            >
              Sign in
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
