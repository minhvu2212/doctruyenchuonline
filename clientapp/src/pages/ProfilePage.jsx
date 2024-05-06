import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Avatar, Button, Card, Empty, Row, Col, Spin, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [chapterCounts, setChapterCounts] = useState({});
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user stories:', error);
        setLoading(false);
      });
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (userStories.length > 0) {
      const promises = userStories.map(story => {
        return axios.get(`http://localhost:5000/api/chapters/story/${story._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      });
      Promise.all(promises)
        .then(responses => {
          const counts = {};
          responses.forEach((response, index) => {
            counts[userStories[index]._id] = response.data.length;
          });
          setChapterCounts(counts);
        })
        .catch(error => {
          console.error('Error fetching chapter counts:', error);
        });
    }
  }, [userStories]);

  const handleAddChapter = (storyId) => {
    navigate(`/story/chapter/add/${storyId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        {userData && (
          <Avatar size={100} src="../public/avatar.jpg" />
        )}
        <div className="ml-4">
          {userData && (
            <Title level={2}>{userData.username}</Title>
          )}
          {/* Hiển thị thông tin cá nhân khác nếu có */}
        </div>
      </div>

      <div className="bg-white shadow-md rounded p-8 mb-8">
        <Title level={2}>Các truyện đã đăng</Title>
        {loading ? (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {userStories.length > 0 ? (
              <Row gutter={[16, 16]}>
                {userStories.map((story, index) => (
                  <Col key={story._id} xs={24} sm={12} md={8} lg={6} xl={4}>
                    <Card
                      hoverable
                      cover={<img alt={story.title} src={story.cover} style={{ maxHeight: '200px', objectFit: 'cover' }} />}
                      actions={[
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => handleAddChapter(story._id)}
                        >
                          Thêm chapter mới
                        </Button>
                      ]}
                    >
                      <Link to={`/stories/${story._id}`}>
                        <Title level={4} ellipsis={{ rows: 2 }}>{story.title}</Title>
                      </Link>
                      <Text>{chapterCounts[story._id] || 0} chương</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="Không có truyện nào được đăng." />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
