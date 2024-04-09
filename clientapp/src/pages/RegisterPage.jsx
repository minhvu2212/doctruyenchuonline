import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate(); // Gọi useNavigate để lấy hàm navigate
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Kiểm tra nếu token đã tồn tại thì chuyển hướng người dùng về trang chủ
  useEffect(() => {
    if (token) {
      navigate('/'); // Chuyển hướng về trang chủ
    }
  }, [token, navigate]);
  const handleRegister = async (e) => {
    e.preventDefault(); // Ngăn chặn việc gửi yêu cầu mặc định

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password });
      setSuccessMessage(response.data.message);
      setError(null); // Đặt lỗi về null nếu thành công
      // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng ký thành công
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
