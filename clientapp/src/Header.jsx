import React from 'react';
import { Link } from 'react-router-dom'; // Đảm bảo bạn đã cài đặt react-router-dom

function Header() {
  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg">Ứng Dụng Đọc Truyện Chữ Online</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/">Trang Chủ</Link></li>
            <li><Link to="/register">Đăng Ký</Link></li>
            <li><Link to="/login">Đăng Nhập</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;