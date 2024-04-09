import React from 'react';
import { Link } from 'react-router-dom';
function IndexPage() {
  return (
    <div>
          <h1>Chào mừng đến với Ứng Dụng Đọc Truyện Chữ Online</h1>
          <p>Đây là trang chính của ứng dụng. Từ đây, bạn có thể truy cập các truyện chữ yêu thích của mình.</p>
          {/* Thêm các nút chuyển hướng */}
          <Link to="/login">Đăng nhập</Link>
          <br />
          <Link to="/register">Đăng ký</Link>
        </div>
  );
}

export default IndexPage;