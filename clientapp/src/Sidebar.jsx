import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { List, Typography } from 'antd';
import { Layout, Menu } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Sider } = Layout;

function Sidebar() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/getStories')
      .then(response => {
        const approvedStories = response.data.filter(story => story.approved === true);
        setStories(approvedStories);
      })
      .catch(error => {
        console.error('Error fetching stories:', error);
      });
  }, []);

  return (
    <Sider width={400} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<BookOutlined />}>
          Danh Sách Truyện
        </Menu.Item>
        {stories.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={stories}
            renderItem={story => (
              <List.Item>
                <List.Item.Meta
                  avatar={<img src={story.cover} alt={story.title} style={{ width: '40px', height: '70px' }} />}
                  title={<Link to={`/stories/${story._id}`}>{story.title}</Link>}
                  description={story.category}
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">Không có truyện được chấp nhận.</Text>
        )}
      </Menu>
    </Sider>
  );
}

export default Sidebar;
