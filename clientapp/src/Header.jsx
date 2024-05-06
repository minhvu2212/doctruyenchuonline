import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Button, Menu, Dropdown } from 'antd';
import axios from 'axios';

const { Header: AntHeader } = Layout;

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      checkAdmin(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const checkAdmin = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/isAdmin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      checkAdmin(localStorage.getItem('token'));
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const menu = (
    <Menu>
      {isLoggedIn && (
        <>
          <Menu.Item key="profile">
          <Link to="/profile">Profile & Quản Lý Truyện</Link>

          </Menu.Item>
          <Menu.Item key="create-story">
            <Link to="/story/create">Thêm Truyện mới</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="admin">
              <Link to="/admin">Admin Page</Link>
            </Menu.Item>
          )}
          <Menu.Item key="logout" className="text-black" onClick={handleLogout}>
            Đăng Xuất
          </Menu.Item>
        </>
      )}
      {!isLoggedIn && (
        <>
          <Menu.Item key="login">
            <Link to="/login">Đăng Nhập</Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/register">Đăng Ký</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <AntHeader className="bg-gradient-to-t from-rgba(25, 38, 62, 0.9960784314) to-purple-700 text-white p-4    ">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg text-white">Vdocx - Nền tảng Truyện Tranh Online Demo</Link>
        <div className="flex items-center">
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <Button type="text" className="text-white">Menu</Button>
          </Dropdown>
          <div className="ml-4">
            <img src="../public/avatar.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>
    </AntHeader>
  );
}

export default Header;
