// components/Leaderboard.tsx
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Avatar, Badge, Skeleton,message,Modal } from 'antd';
import { TrophyOutlined, UserOutlined } from '@ant-design/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'


type User = {
  Points: number;
  _id: string;
  name: string;
  email: string;
  password: string;
};

const Leaderboard: React.FC = () => {
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

    // Assuming `userHistory` is an array and you want to append the new data
    const updatedHistory = [...userHistory, ...newUserHistory];

    // Sort the updated history by pointsAwarded in descending order
    const sortedHistory = updatedHistory.sort((a: { pointsAwarded: number }, b: { pointsAwarded: number }) => {
        return b.pointsAwarded - a.pointsAwarded;
    });

    setUserHistory(sortedHistory); // Set the fetched and sorted history to the state
    setSelectedUser(username);
} catch (error) {
    console.error('Error fetching user history:', error);
    message.error('Error fetching history. Please try again.');
}
  };
   const claimRewards = async (username: string) => {
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
      const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/user/v1/get-users');
        console.log('Full API Response:', response);

        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        if (!Array.isArray(usersData)) {
          throw new Error("Expected an array of users, but received a different format.");
        }

        const sortedUsers = usersData.sort((a, b) => b.Points - a.Points);
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    } catch (error) {
      console.error('Error claiming rewards:', error);
      message.error('Error claiming points. Please try again.');
    }
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/user/v1/get-users');
        console.log('Full API Response:', response);

        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        if (!Array.isArray(usersData)) {
          throw new Error("Expected an array of users, but received a different format.");
        }

        const sortedUsers = usersData.sort((a, b) => b.Points - a.Points);
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
    return <div className="flex justify-center items-center p-6"><Skeleton active /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg w-full flex flex-col">
  
     

      <div className="text-4xl font-bold text-center mb-8 text-white bg-[#0284c7]">Leaderboard</div>
   
     <div className="flex flex-col md:flex-row justify-center gap-4">
        {users.slice(0, 3).map((user, index) => (
          <Badge.Ribbon
            key={user._id}
            text={index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            color={index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}
          >
            <Card
              className="transform hover:scale-105 gap-10 transition-transform duration-300 ease-in-out shadow-lg rounded-xl relative"
              hoverable
              style={{ width: '100%'}}
              bodyStyle={{ padding: '16px' }}
            >
              <div className="flex flex-row items-center justify-between gap-10">
                
                <div className="text-left">
                  <span className="text-sm flex flex-row text-[green]">Points:{user.Points}</span>
                </div>
                <div className="text-center font-bold text-xl text-green">Rank:{index + 1}</div>
                <Avatar icon={<UserOutlined/>} size={64} className="ml-4 bg-white text-black" />
              </div>
              <div className="text-center mt-2 bg-[#0284c7]">
                <span className="font-semibold text-lg text-white">{user.username}</span>
              </div>
            </Card>
          </Badge.Ribbon>
        ))}
      </div>

      <h2 className="text-3xl font-semibold text-center mb-4 text-gray-700">Other Users</h2>
      
      <div className="flex flex-col w-full gap-3">
        {users.map((user,index) => (
          <Card
            key={user._id}
            className="transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg rounded-xl w-full"
            hoverable
            style={{ width: '100%'}}
            bodyStyle={{ padding: '16px' }}
            onClick={() => claimRewards(user.username)}
          >
            <Card.Meta
              avatar={<Avatar icon={<TrophyOutlined />} size={64} />}
              title={<div className="font-semibold text-lg text-gray-800"  onClick={() => fetchHistory(user.username)}>{user.username}</div>}
              description={<span className="text-sm text-gray-500">Points: {user.Points}</span>}
            />

          </Card>
        ))}
      </div>
      <Modal title="test's-History" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={{ maxWidth: '80vw' }}>
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

export default Leaderboard;
