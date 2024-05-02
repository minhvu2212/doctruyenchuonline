import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { List, Typography } from 'antd';

const { Title, Text } = Typography;

function IndexPage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/getStories')
      .then(response => {
        // Lọc các câu chuyện có trạng thái approved là true
        const approvedStories = response.data.filter(story => story.approved === true);
        setStories(approvedStories);
      })
      .catch(error => {
        console.error('Error fetching stories:', error);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Title level={3}>Danh Sách Truyện</Title>
      {stories.length > 0 ? (
        <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }} // Thay đổi số cột lg, xl, xxl thành 4
        dataSource={stories}
        renderItem={story => (
          <List.Item>
            <div>
              {story.cover && (
                <img
                  src={story.cover}
                  alt={story.title}
                  style={{ maxWidth: '200px', maxHeight: '200px', width: 'auto', height: 'auto' }}
                />
              )}
              <Link to={`/stories/${story._id}`} className="text-blue-500 hover:text-blue-700">
                <Title level={4}>{story.title}</Title>
              </Link>
              <Text>{story.category}</Text>
            </div>
          </List.Item>
        )}
      />
      
      ) : (
        <Text type="secondary">Không có truyện được chấp nhận.</Text>
      )}
    </div>
  );
}

export default IndexPage;
