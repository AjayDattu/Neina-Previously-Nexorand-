"use client";
import Link from 'next/link';
import { Button, Menu } from 'antd';
import { useState } from 'react';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

const Navbar = () => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Toggle login state (simulating login/logout functionality)
  const handleAuthToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav className=" shadow shadow-gray-300 w-full px-8 md:px-auto">
      <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        
        {/* Navigation Links */}
        <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
          <Menu mode="horizontal" className="font-semibold" selectable={false}>
            <Menu.Item key="dashboard">
              <Link href="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link href="/Registration">Register</Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link href="/Login">Login</Link>
            </Menu.Item>
            <Menu.Item key="about">
              <Link href="#">About</Link>
            </Menu.Item>
            <Menu.Item key="contact">
              <Link href="#">Contact</Link>
            </Menu.Item>
          </Menu>
        </div>
        
        {/* Login/Logout Button */}
        <div className="order-2 md:order-3">
          <Button
            type="primary"
            icon={isLoggedIn ? <LogoutOutlined /> : <LoginOutlined />}
            onClick={handleAuthToggle}
            className="flex items-center gap-2"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
