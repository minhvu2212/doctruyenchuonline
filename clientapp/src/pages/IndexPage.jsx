// Import các thư viện và component cần thiết
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Typography, Card, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

function IndexPage() {
  // Khai báo state và useEffect
  const [topViewStories, setTopViewStories] = useState([]);
  const [storiesByCategories, setStoriesByCategories] = useState([]);

  useEffect(() => {
    // Hàm fetchTopViewStories: lấy danh sách truyện theo lượt xem
    async function fetchTopViewStories() {
      try {
        const response = await axios.get('http://localhost:5000/api/getStories');
        const stories = response.data.filter(story => story.approved === true);
        
        const storiesWithReadTime = await Promise.all(stories.map(async story => {
          const chapterResponse = await axios.get(`http://localhost:5000/api/chapters/story/${story._id}`);
          const chapters = chapterResponse.data;
          const totalReadTime = chapters.reduce((acc, chapter) => acc + chapter.readTime, 0);
          return { ...story, totalReadTime };
        }));

        const sortedStories = storiesWithReadTime.sort((a, b) => b.totalReadTime - a.totalReadTime);
        setTopViewStories(sortedStories);
      } catch (error) {
        console.error('Error fetching top view stories:', error);
      }
    }

    // Hàm fetchStoriesByCategories: lấy danh sách truyện theo thể loại
    async function fetchStoriesByCategories() {
      try {
        const response = await axios.get('http://localhost:5000/api/getStories');
        const stories = response.data.filter(story => story.approved === true);
        const promises = stories.map(story => {
          return axios.get(`http://localhost:5000/api/chapters/story/${story._id}`);
        });
        Promise.all(promises)
          .then(chapterResponses => {
            const storiesWithTotalReadTime = stories.map((story, index) => {
              const chapters = chapterResponses[index].data;
              const totalReadTime = chapters.reduce((acc, chapter) => acc + chapter.readTime, 0);
              return { ...story, totalReadTime };
            });
            setStoriesByCategories(groupStoriesByCategories(storiesWithTotalReadTime));
          })
          .catch(error => {
            console.error('Error fetching chapters:', error);
          });
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    }

    fetchTopViewStories();
    fetchStoriesByCategories();
  }, []);

  // Hàm nhóm truyện theo thể loại
  const groupStoriesByCategories = (stories) => {
    const groupedStories = {};
    stories.forEach(story => {
      story.categories.forEach(category => {
        if (!groupedStories[category]) {
          groupedStories[category] = [];
        }
        groupedStories[category].push(story);
      });
    });
    return groupedStories;
  };

  // Hàm viết hoa chữ cái đầu của một chuỗi
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Trả về giao diện của trang
  return (
    <div className="w-3/4 mx-auto px-4 py-8">
      <Title level={3}>Danh Sách Truyện</Title>
      
      {/* Hiển thị danh sách các truyện theo lượt xem */}
      <Title level={4}>Xem Nhiều Nhất</Title>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 5,
          xl: 8,
          xxl: 12
        }}
        dataSource={topViewStories}
        renderItem={story => (
          <List.Item>
            <Tooltip title={story.title}>
              {/* Sử dụng Link component để tạo liên kết đến trang chi tiết truyện */}
              <Link to={`/stories/${story._id}`}>
                <Card
                  hoverable
                  cover={<img alt={story.title} src={story.cover} style={{ height: '200px', objectFit: 'cover' }} />}
                >
                  <Card.Meta title={story.title} />
                  <div>Lượt xem: {story.totalReadTime}</div>
                </Card>
              </Link>
            </Tooltip>
          </List.Item>
        )}capitalizeFirstLetter
      />
      
      {/* Hiển thị danh sách các truyện theo từng thể loại */}
      {Object.keys(storiesByCategories).length > 0 && (
        Object.keys(storiesByCategories).map(category => (
          <div key={category} className="category-wrapper">
            <Title level={4}>{capitalizeFirstLetter(category)}</Title>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 5,
                xl: 8,
                xxl: 12
              }}
              dataSource={storiesByCategories[category]}
              renderItem={story => (
                <List.Item>
                  <Tooltip title={story.title}>
                    {/* Sử dụng Link component để tạo liên kết đến trang chi tiết truyện */}
                    <Link to={`/stories/${story._id}`}>
                      <Card
                        hoverable
                        cover={<img alt={story.title} src={story.cover} style={{ height: '200px', objectFit: 'cover' }} />}
                      >
                        <Card.Meta
                          title={<span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{story.title}</span>}
                        />
                        <div>Lượt xem: {story.totalReadTime}</div>
                      </Card>
                    </Link>
                  </Tooltip>
                </List.Item>
              )}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default IndexPage;
