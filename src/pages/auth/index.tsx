"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, Checkbox, Typography, Space } from "antd";
import { signIn } from "next-auth/react";

const { Title, Text } = Typography;

const LoginForm = ({
  onForgot,
  onFinish,
}: {
  onForgot: () => void;
  onFinish: (values: { email: string; password: string }) => void;
}) => {
  return (
    <>
      <Title level={2} style={{ marginBottom: 0 }}>
        Welcome back
      </Title>
      <Text type="secondary">Please enter your details</Text>
      <Form
        name="login"
        initialValues={{ remember: true, username: "", password: "" }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        style={{ marginTop: 32 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input size="large" placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember for 30 days</Checkbox>
          </Form.Item>
          <Button type="link" onClick={onForgot}>
            Forgot password
          </Button>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => {
  return (
    <>
      <Title level={2} style={{ marginBottom: 0 }}>
        Forgot Password
      </Title>
      <Text type="secondary">Enter your email to reset your password</Text>
      <Form layout="vertical" style={{ marginTop: 32 }}>
        <Form.Item
          label="Email address"
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input size="large" placeholder="Email address" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Send Reset Link
          </Button>
        </Form.Item>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button type="link" onClick={onBack}>
            Back to Sign in
          </Button>
        </div>
      </Form>
    </>
  );
};

const AuthPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = searchParams?.get("form");
  const callbackUrl = searchParams?.get("callbackUrl");

  const showForgot = () => {
    return router.replace("?form=forgot");
  };
  const showLogin = () => {
    return router.replace("?");
  };

  const onFinish = async (values: { email: string; password: string }) => {
    await signIn("credentials", {
      redirect: true,
      email: values.email,
      password: values.password,
      callbackUrl: (callbackUrl as string) || "/app",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        transition: "flex-direction 0.3s",
      }}
    >
      {/* Left (or Right) - Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
          transition: "background 0.3s",
        }}
      >
        {/* Logo and Brand */}
        <div style={{ width: "100%", maxWidth: 400, marginBottom: 40 }}>
          <Space align="center" size={12}>
            <div
              style={{
                width: 40,
                height: 40,
                background: "#7C3AED",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* HR/People Analytics inspired logo */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="9" r="5" fill="#fff" />
                <ellipse cx="14" cy="21" rx="9" ry="5" fill="#fff" />
                <circle cx="14" cy="9" r="3" fill="#7C3AED" />
                <ellipse cx="14" cy="21" rx="5" ry="3" fill="#A78BFA" />
              </svg>
            </div>
            <Title
              level={2}
              style={{ margin: 0, color: "#fff", letterSpacing: 1 }}
            >
              ARICA-HRIS
            </Title>
          </Space>
        </div>
        {/* Form Section */}
        <div style={{ width: "100%", maxWidth: 400 }}>
          {formType === "forgot" ? (
            <ForgotPasswordForm onBack={showLogin} />
          ) : (
            <LoginForm onFinish={onFinish} onForgot={showForgot} />
          )}
        </div>
      </div>
      {/* Right (or Left) - Illustration */}
      <div
        style={{
          flex: 1,
          background: "#E9D8FD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "background 0.3s",
        }}
      >
        {/* Creative HR/People Togetherness Illustration */}
        <svg
          width="420"
          height="420"
          viewBox="0 0 420 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="420" height="420" rx="24" fill="#A78BFA" />
          {/* Group of people */}
          <g>
            {/* Person 1 - Center */}
            <ellipse
              cx="210"
              cy="180"
              rx="38"
              ry="44"
              fill="#fff"
              fillOpacity="0.95"
            />
            <circle cx="210" cy="140" r="22" fill="#7C3AED" />
            <ellipse
              cx="210"
              cy="220"
              rx="32"
              ry="12"
              fill="#A78BFA"
              fillOpacity="0.7"
            />
            {/* Person 2 - Left */}
            <ellipse
              cx="140"
              cy="200"
              rx="28"
              ry="36"
              fill="#fff"
              fillOpacity="0.9"
            />
            <circle cx="140" cy="170" r="16" fill="#A78BFA" />
            <ellipse
              cx="140"
              cy="230"
              rx="20"
              ry="8"
              fill="#7C3AED"
              fillOpacity="0.5"
            />
            {/* Person 3 - Right */}
            <ellipse
              cx="280"
              cy="200"
              rx="28"
              ry="36"
              fill="#fff"
              fillOpacity="0.9"
            />
            <circle cx="280" cy="170" r="16" fill="#A78BFA" />
            <ellipse
              cx="280"
              cy="230"
              rx="20"
              ry="8"
              fill="#7C3AED"
              fillOpacity="0.5"
            />
            {/* Person 4 - Far Left */}
            <ellipse
              cx="90"
              cy="240"
              rx="18"
              ry="24"
              fill="#fff"
              fillOpacity="0.8"
            />
            <circle cx="90" cy="220" r="10" fill="#A78BFA" />
          </g>
          {/* Company/HR elements */}
          <g opacity="0.7">
            {/* Laptop in front of center person */}
            <rect
              x="185"
              y="250"
              width="50"
              height="18"
              rx="4"
              fill="#fff"
              fillOpacity="0.9"
            />
            <rect x="200" y="255" width="20" height="6" rx="2" fill="#A78BFA" />
            {/* Chat bubble left */}
            <rect
              x="110"
              y="120"
              width="36"
              height="18"
              rx="8"
              fill="#fff"
              fillOpacity="0.8"
            />
            <circle cx="120" cy="129" r="2" fill="#A78BFA" />
            <rect x="125" y="127" width="14" height="4" rx="2" fill="#A78BFA" />
            {/* Chat bubble right */}
            <rect
              x="274"
              y="120"
              width="36"
              height="18"
              rx="8"
              fill="#fff"
              fillOpacity="0.8"
            />
            <circle cx="300" cy="129" r="2" fill="#A78BFA" />
            <rect x="305" y="127" width="14" height="4" rx="2" fill="#A78BFA" />
            {/* Bar chart */}
            <rect x="360" y="320" width="8" height="28" rx="3" fill="#fff" />
            <rect x="375" y="330" width="8" height="18" rx="3" fill="#fff" />
            <rect x="390" y="340" width="8" height="8" rx="3" fill="#fff" />
            {/* Pie chart */}
            <path
              d="M210 370 a30 30 0 1 0 30-30"
              stroke="#fff"
              strokeWidth="6"
              fill="none"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default AuthPage;
