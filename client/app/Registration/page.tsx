"use client";
import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title } = Typography;

interface RegisterValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRegister = async (values: RegisterValues) => {
    setLoading(true);

    try {
      // Register API call
      await axios.post('http://localhost:7000/api/auth/v1/register', values);
      message.success('Registration successful!');
      handleLogin({ username: values.username, password: values.password });
    } catch (error) {
      console.error('Registration failed:', error);
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials: { username: string; password: string }) => {
    dispatch(loginStart());

    try {
      // Login API call
      const response = await axios.post("http://localhost:7000/api/auth/v1/login", credentials);
      const token = response.data.token;
      const userData = { ...credentials, token };
      
      toast.success(`✅ Welcome back, ${credentials.username}!`);
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch(loginSuccess(userData));
      router.push("/");
    } catch (error) {
      dispatch(loginFailure());
      toast.error("Login failed. Invalid username or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <Card className="p-6 max-w-md w-full shadow-lg">
        <Title level={2} className="text-center mb-4">Register</Title>
        <Form onFinish={handleRegister} layout="vertical">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} className="w-full mt-4">
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
}
