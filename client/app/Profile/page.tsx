"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store"; // Adjust path as needed
import { Card, Typography, Spin, Alert } from "antd";
import axios from "axios";
import { logout } from "../store/authSlice"; // Import your logout action

const { Title, Text } = Typography;

function Page() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Access the token and user info from Redux state
  const { username, password ,token} = JSON.parse(localStorage.getItem("user") || "{}");;

  useEffect(() => {
  const fetchUserData = async () => {
    if (!token) return;

   try {
  setLoading(true);
  console.log("Token:", token);
  
  // Send an empty body and set token in headers for authentication
  const response = await axios.post(
    "http://localhost:7000/api/user/v1/get-users-info",
    {},
    { headers: { Authorization: {token} } }
  );
 const response = await axios.post('http://localhost:7000/api/user/v1/get-users-info', null, {
        headers: {
          'Content-Type': 'application/json', // Optional if not sending a body
          'Authorization': `Bearer ${token}`, // Add token or other headers if needed
        },
      });

  // Handle response
  setUserData(response.data);
} catch (err) {
  console.error("Error fetching user data:", err.response ? err.response.data : err.message);
  setError(err.response ? err.response.data.message : "Failed to fetch user data. Please try again.");
} finally {
  setLoading(false);
}

  };

  fetchUserData();
}, [token]);


  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <Spin tip="Loading user data..." />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Card className="p-6 max-w-md w-full shadow-lg">
          <Title level={2} className="text-center mb-4">
            Welcome, {userData?.name || "User"}
          </Title>
          <Text>Email: {userData?.email}</Text>
          <br />
          <Text>Status: {userData?.isAuthenticated ? "Authenticated" : "Guest"}</Text>
          <br />
          <Button type="primary" onClick={handleLogout} className="mt-4">
            Logout
          </Button>
        </Card>
      )}
    </div>
  );
}

export default Page;
