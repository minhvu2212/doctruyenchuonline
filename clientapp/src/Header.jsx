import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có token trong localStorage không
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // Xóa token khỏi localStorage khi đăng xuất
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Cập nhật lại trạng thái isLoggedIn thành false
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg">Ứng Dụng Đọc Truyện Chữ Online</h1>
        <nav>
          <ul className="flex space-x-4">
            {isLoggedIn ? (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/story/create">Thêm Truyện mới</Link></li>
                <li><button onClick={handleLogout}>Đăng Xuất</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Đăng Nhập</Link></li>
                <li><Link to="/register">Đăng Ký</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
