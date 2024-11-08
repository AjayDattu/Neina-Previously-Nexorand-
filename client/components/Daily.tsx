// components/Leaderboard.tsx
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Avatar, Badge, Skeleton, message, Modal } from 'antd';
import { TrophyOutlined, UserOutlined } from '@ant-design/icons';

  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

type User = {
  Points: number;
  _id: string;
  username: string;
  email: string;
  password: string;
};

const Daily: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchHistory = async (username: string) => {
    try {
      console.log(username);
      const response = await axios.post('http://localhost:7000/api/user/v1/your-history', {
        username,
      });
      const newUserHistory = response.data.data;
      console.log(newUserHistory);

      showModal();

      // Update the user history state with sorted data
      const sortedHistory = newUserHistory.sort(
        (a: { pointsAwarded: number }, b: { pointsAwarded: number }) => b.pointsAwarded - a.pointsAwarded
      );
      setUserHistory(sortedHistory);
      setSelectedUser(username);
    } catch (error) {
      console.error('Error fetching user history:', error);
      message.error('Error fetching history. Please try again.');
    }
  };

  const claimRewards = async (username: string) => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/user/v1/your-Daily-history');
        console.log('Full API Response:', response);

        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        if (!Array.isArray(usersData)) {
          throw new Error("Expected an array of users, but received a different format.");
        }

        const sortedUsers = usersData.sort((a, b) => b.totalPointsAwarded - a.totalPointsAwarded);
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    try {
      const response = await axios.patch('http://localhost:7000/api/user/v1/claim-points', {
        username,
      });
      message.success(response.data.message || 'Points claimed successfully!');
      
      // Update user points locally after successful claim
      const updatedUsers = users.map((user) =>
        user.username === username ? { ...user, Points: response.data.data.Points } : user
      );
      setUsers(updatedUsers);
      toast(" ✅ "+username+" Claim Reward successfully");
    } catch (error) {
      console.error('Error claiming rewards:', error);
      message.error('Error claiming points. Please try again.');
    }
    fetchUsers();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/user/v1/your-Daily-history');
        console.log('Full API Response:', response);

        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        if (!Array.isArray(usersData)) {
          throw new Error("Expected an array of users, but received a different format.");
        }

        const sortedUsers = usersData.sort((a, b) => b.totalPointsAwarded - a.totalPointsAwarded);
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Skeleton active />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-4">
         <ToastContainer/>
        {users.slice(0, 3).map((user, index) => (
          <Badge.Ribbon
            key={user._id}
            text={index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            color={index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}
          >
            <Card
              className="transform hover:scale-105 gap-10 transition-transform duration-300 ease-in-out shadow-lg rounded-xl"
              hoverable
              style={{ width: '100%' }}
              bodyStyle={{ padding: '16px' }}
            >
              <div className="flex flex-row items-center justify-between gap-10">
                <div className="text-left">
                  <span className="text-sm flex flex-row text-[green]">Points: {user.totalPointsAwarded}</span>
                </div>
                <div className="text-center font-bold text-xl text-green">
                  Rank: {index + 1}
                </div>
                <Avatar icon={<UserOutlined />} size={64} className="ml-4 bg-white text-black" />
              </div>
              <div className="text-center mt-2 bg-black">
                <span className="font-semibold text-lg text-white">{user._id}</span>
              </div>
            </Card>
          </Badge.Ribbon>
        ))}
      </div>

      <h2 className="text-3xl font-semibold text-center mb-4 text-gray-700">Other Users</h2>

      <div className="flex flex-col w-full">
        {users.map((user,rank) => (
         <Card
  key={user._id}
  className=" hover:bg-[#E4E0E1] duration-300 ease-in-out w-full"
  hoverable
  style={{ width: '100%' }}
  bodyStyle={{ padding: '16px' }}
  onClick={() => claimRewards(user._id)}
>
  <Card.Meta
    avatar={
      <Avatar
        icon={<UserOutlined />}
        size={30}
        className = "text-2xl h-full bg-black mt-3"
      />
    }
    title={
      <div className="flex flex-col">
        <div onClick={(e) => {
                    e.stopPropagation();
                    fetchHistory(user._id);
                  }}>{user._id}</div>
        <div className="flex justify-between items-center font-semibold text-lg text-black">
          <span
            onClick={(e) => {
              e.stopPropagation();
              fetchHistory(user._id);
            }}
            className='text-xl'
          >
            Rank {rank + 1}
          </span>
          <span className="text-sm text-green-500">
            Points: {user.totalPointsAwarded}
          </span>
        </div>
      </div>
    }
  />
</Card>


        ))}
      </div>

      <Modal
        title={`${selectedUser}'s History`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ maxWidth: '80vw' }}
      >
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {userHistory.map((entry, index) => (
            <div key={index} className="flex flex-col mb-2 align-text-left border-b border-gray-300 pb-2">
              <span className="text-gray-500">Date: {entry.date}</span>
              <span className="text-gray-700">Points: {entry.pointsAwarded}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Daily;
