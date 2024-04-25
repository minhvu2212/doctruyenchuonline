import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

const AddChapterPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState('');
  const [nextChapterOrder, setNextChapterOrder] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile/userstories', {
          headers: {
            Authorization: `Bearer ${token}`,
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
    } catch (error) {
      console.error('Error fetching chapter details:', error);
    }
  };

  useEffect(() => {
    if (selectedStory) {
      fetchChapterDetails();
    }
  }, [selectedStory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/chapters/${selectedStory}`, {
        title,
        content,
        order: nextChapterOrder,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Chapter created:', response.data);
      setSuccess(true);
      fetchChapterDetails();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setTitle('');
    setContent('');
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="p-4 mx-auto max-w-screen-md">
      <h2 className="text-xl font-bold mb-4">Thêm Chapter mới</h2>
      {success ? (
        <div className="mb-4 text-green-500 font-semibold">Chapter đã được thêm thành công!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="story" className="block mb-2">Chọn Truyện:</label>
            <select id="story" value={selectedStory} onChange={(e) => setSelectedStory(e.target.value)} required className="w-full p-2 border rounded">
              <option value="">Chọn một truyện</option>
              {userStories.map(story => (
                <option key={story._id} value={story._id}>{story.title}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Tiêu đề Chap:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2">Nội dung:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
              {loading ? 'Đang gửi...' : 'Gửi'}
            </button>
          </div>
        </form>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {success && (
        <div className="mt-4 flex justify-end">
          <button onClick={handleContinue} className="bg-green-500 text-white px-4 py-2 rounded">Tiếp tục thêm chap mới</button>
        </div>
      )}
    </div>
  );
};

export default AddChapterPage;
