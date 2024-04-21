import React, { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Layout';
function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      navigate.push('/login');
    } else {
      // Nếu có token, gửi yêu cầu lấy thông tin cá nhân từ backend
      axios.get('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });

      // Gửi yêu cầu lấy danh sách truyện của người dùng từ backend
      axios.get('http://localhost:5000/api/profile/userstories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setUserStories(response.data);
      })
      .catch(error => {
        console.error('Error fetching user stories:', error);
      });
    }
  }, []);

  return (
    <div>
      <h2>Thông tin cá nhân</h2>
      {userData && (
        <div>
          <p><strong>Username:</strong> {userData.username}</p>
          {/* Hiển thị thông tin cá nhân khác nếu có */}
        </div>
      )}

      <h2>Các truyện đã đăng</h2>
      {userStories.length > 0 ? (
        <ul>
          {userStories.map(story => (
            <li key={story.id}>
              <p><strong>Tiêu đề:</strong> {story.title}</p>
              {/* Hiển thị thông tin truyện khác nếu có */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có truyện nào được đăng.</p>
      )}
    </div>
  );
}

export default ProfilePage;
