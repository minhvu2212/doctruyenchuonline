import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ChapterPage = () => {
  const { storyId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Sử dụng hook useNavigate thay cho useHistory

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get(`http://localhost:5000/api/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChapter(response.data);
      } catch (error) {
        setError('Error fetching chapter details');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [storyId, chapterId]);

  const goToNextChapter = () => {
    // Điều hướng đến chương kế tiếp
    navigate(`/stories/${storyId}/chapters/${nextChapterId}`);
  };

  const goToPreviousChapter = () => {
    // Điều hướng đến chương trước đó
    navigate(`/stories/${storyId}/chapters/${previousChapterId}`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {chapter && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
          <p className="mb-4">{chapter.content}</p>
          {/* Các nút điều hướng */}
          <div className="flex justify-between">
            <button onClick={goToPreviousChapter} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Chương Trước
            </button>
            <button onClick={goToNextChapter} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Chương Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterPage;
