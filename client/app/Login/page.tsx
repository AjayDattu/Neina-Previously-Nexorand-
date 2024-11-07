"use client"
import { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    console.log("Login form values:", values);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-6 max-w-md w-full shadow-lg">
        <Title level={2} className="text-center mb-4">Login</Title>
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            label="Username or Email"
            name="username"
            rules={[{ required: true, message: "Please enter your username or email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your username or email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} className="w-full mt-4">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
