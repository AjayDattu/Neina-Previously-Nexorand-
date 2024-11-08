// components/Leaderboard.tsx
"use client";
import { useState, useEffect } from 'react';
import { Tabs, Card, Typography, Spin, Alert, Button, Row, Col, Statistic } from 'antd';
import Monthly from '../Monthly';
import Daily from '../Daily';
import Weekly from '../Yearly';
import { useDispatch } from "react-redux";
import axios, { AxiosError } from "axios";
// Import your logout action

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

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const { token } = storedUser ? JSON.parse(storedUser) : {};

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
       setUserData({ username: "guest", firstName: "Guest", lastName: "User", email: "", Points: 0 });
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
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg w-full flex flex-col p-4">
      <div className="text-4xl font-bold text-center mb-8 text-white bg-black py-4">
        Leaderboard
      </div>

      {/* User Info Section */}
      <div className="mb-6">
        {loading ? (
          <Spin tip="Loading user details..." />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : userData ? (
          <Card>
            <Row gutter={16}>
              <Col span={12}>
                <Title level={4}>{`${userData.firstName} ${userData.lastName}`}</Title>
                <Text>{`@${userData.username}`}</Text>
              </Col>
              <Col span={12} className="text-right">
                <Statistic title="Points" value={userData.Points} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Text type="secondary">{userData.email}</Text>
              </Col>
            </Row>
          </Card>
        ) : (
          <Alert message="No user data available" type="warning" showIcon />
        )}
      </div>

      {/* Leaderboard Tabs */}
      <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
        <Tabs.TabPane tab="Today" key="daily">
          <Daily />
        </Tabs.TabPane>
        <Tabs.TabPane tab="This Week" key="weekly">
          <Weekly />
        </Tabs.TabPane>
        <Tabs.TabPane tab="This Month" key="monthly">
          <Monthly />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
