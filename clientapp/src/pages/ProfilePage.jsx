import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Avatar, Button, List } from 'antd';

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
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
  }, [navigate]);

  const handleAddChapter = (storyId) => {
    navigate(`/story/chapter/add/${storyId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded px-8 py-6 mb-8 flex items-center">
        {userData && (
          <>
            <Avatar size={64} src="../public/avatar.jpg" />
            <div className="ml-4">
              <h2 className="text-2xl font-bold">{userData.username}</h2>
              {/* Hiển thị thông tin cá nhân khác nếu có */}
            </div>
          </>
        )}
      </div>

      <div className="bg-white shadow-md rounded px-8 py-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Các truyện đã đăng</h2>
        {userStories.length > 0 ? (
          <div className="flex flex-wrap -mx-4">
            {userStories.map(story => (
              <div key={story._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-4 mb-4">
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={story.cover} style={{ maxWidth: '200px', maxHeight: '200px', width: 'auto', height: 'auto' }}/>}
                    title={<span><strong>{story.title}</strong></span>}
                    description={
                      <Button
                        type="primary"
                        onClick={() => handleAddChapter(story._id)}
                      >
                        Thêm chapter mới
                      </Button>
                    }
                  />
                </List.Item>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có truyện nào được đăng.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
