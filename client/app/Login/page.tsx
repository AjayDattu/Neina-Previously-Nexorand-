// components/Login.tsx
"use client";
import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";


const { Title } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

 const handleLogin = async (values: { username: string; password: string }) => {
  dispatch(loginStart()); // Set loading state to true

  try {
    // Send login request to the backend
    const response = await axios.post("http://localhost:7000/api/auth/v1/login", values);
    const token = response.data.token; // Assuming response includes the token
    const userData = { ...values, token }; // Combining values with token

    // Store user token in localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Dispatch loginSuccess with user data
    dispatch(loginSuccess(userData));

    // Navigate to the main page
    router.push("/");
  } catch (error) {
    // Dispatch loginFailure if there's an error
    dispatch(loginFailure());
    message.error("Invalid username or password.");
  }
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

          <Button type="primary" htmlType="submit" className="w-full mt-4">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
