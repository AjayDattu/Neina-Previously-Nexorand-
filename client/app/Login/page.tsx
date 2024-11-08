"use client";
import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch } from "react-redux";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";

import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (values: { username: string; password: string }) => {
    dispatch(loginStart());

    try {
      const response = await axios.post("http://localhost:7000/api/auth/v1/login", values);
      const token = response.data.token;
      const userData = { ...values, token };
      toast(`✅ Welcome back, ${values.username}!`);
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch(loginSuccess(userData));
      router.push("/");
    } catch (error) {
      dispatch(loginFailure());
      toast.error("Invalid username or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
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
