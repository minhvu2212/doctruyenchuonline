import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChapterPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState('');
  const [nextChapterOrder, setNextChapterOrder] = useState(1);

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        const response = await axios.get('http://localhost:5000/api/profile/userstories', {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào tiêu đề Authorization
          },
        });
        setUserStories(response.data);
      } catch (error) {
        console.error('Error fetching user stories:', error);
      }
    };

    fetchUserStories();
  }, []);

  const fetchChapterDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/chapters/story/${selectedStory}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nextOrder = response.data.length + 1;
        setNextChapterOrder(nextOrder);
      // Cập nhật state hoặc thực hiện hành động cần thiết với dữ liệu mới
      console.log('Chapter details:', response.data);
    } catch (error) {
      console.error('Error fetching chapter details:', error);
    }
  };
  
  // Đảm bảo rằng fetchChapterDetails được gọi khi component được mount hoặc khi selectedStory thay đổi
  useEffect(() => {
    if (selectedStory) {
      fetchChapterDetails();
    }
  }, [selectedStory]);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      // Gửi yêu cầu POST để upload chương mới
      const response = await axios.post(`http://localhost:5000/api/chapters/${selectedStory}`, {
        title,
        content,
        order: nextChapterOrder,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào tiêu đề Authorization
        },
      });
  
      console.log('Chapter created:', response.data);
      // Sau khi upload thành công, gọi lại hàm fetch để lấy dữ liệu mới nhất
      fetchChapterDetails();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Post a New Chapter</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="story">Choose a Story:</label>
          <select id="story" value={selectedStory} onChange={(e) => setSelectedStory(e.target.value)} required>
            <option value="">Select a story</option>
            {userStories.map(story => (
              <option key={story._id} value={story._id}>{story.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default ChapterPage;
