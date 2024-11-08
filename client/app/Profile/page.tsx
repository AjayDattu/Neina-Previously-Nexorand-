"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Typography, Spin, Alert, Button, Row, Col, Statistic } from "antd";
import axios, { AxiosError } from "axios";
import { logout } from "../store/authSlice"; // Import your logout action

const { Title, Text } = Typography;

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  Points: number;
}

interface ErrorResponse {
  message: string;
}

function Page() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const { token } = storedUser ? JSON.parse(storedUser) : {};

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError("Token is missing or invalid.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Using token:", token);

        const response = await axios.post(
          "http://localhost:7000/api/user/v1/get-users-info",
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );
         
        setUserData(response.data.data); // Assuming the response has a 'data' field with user info
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<ErrorResponse>;

          if (axiosError.response?.status === 401) {
            setError("Authentication failed. Please log in again.");
            dispatch(logout());
            localStorage.removeItem("user");
          } else {
            setError(axiosError.response?.data.message || "Failed to fetch user data. Please try again.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <Spin tip="Loading user data..." />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Card className="p-6 max-w-3xl w-full shadow-lg">
          <Title level={2} className="text-center mb-4">
            Welcome, {userData?.firstName || "User"}
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card className="shadow-md p-4">
                <Title level={4}>User Information</Title>
                <Text strong>Username: </Text> {userData?.username}
                <br />
                <Text strong>Email: </Text> {userData?.email}
                <br />
                <Text strong>Full Name: </Text> {userData?.firstName} {userData?.lastName}
              </Card>
            </Col>
            <Col span={12}>
              <Card className="shadow-md p-4">
                <Title level={4}>Account Details</Title>
                <Statistic
                  title="Points"
                  value={userData?.Points}
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}

export default Page;
