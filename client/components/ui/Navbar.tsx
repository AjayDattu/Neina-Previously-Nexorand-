"use client";
import Link from "next/link";
import { Button, Menu, Dropdown, Avatar } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { logout } from "@/app/store/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
const handleLogout = () => {
  dispatch(logout());
  localStorage.removeItem("user");

  // Redirect to the home page
  window.location.href = "/";
};


  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link href="/Profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="shadow shadow-gray-300 w-full px-8 md:px-auto">
      <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        
        {/* Navigation Links */}
        <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
          <Menu mode="horizontal" className="font-semibold" selectable={false}>
            <Menu.Item key="dashboard">
              <Link href="/">Dashboard</Link>
            </Menu.Item>
            {!isAuthenticated && (
              <div>
                <Menu.Item key="register">
                  <Link href="/Registration">Register</Link>
                </Menu.Item>
                <Menu.Item key="login">
                  <Link href="/Login">Login</Link>
                </Menu.Item>
              </div>
            )}
            <Menu.Item key="about">
              <Link href="/About">About</Link>
            </Menu.Item>
            <Menu.Item key="contact">
              <Link href="#">Contact</Link>
            </Menu.Item>
          </Menu>
        </div>

        {/* Login/Logout or Avatar with Dropdown */}
        <div className="order-2 md:order-3">
          {isAuthenticated ? (
            <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
              <Avatar size="large" icon={<UserOutlined />} style={{ cursor: "pointer" }} />
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              className="flex items-center gap-2"
            >
              <Link href="/Login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
