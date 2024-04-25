import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StoryPage = () => {
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { storyId } = useParams();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getStory/${storyId}`);
        setStory(response.data);
      } catch (error) {
        setError(error.response.data.message);
      }
    };

    const fetchChapters = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chapters/story/${storyId}`);
        setChapters(response.data);
      } catch (error) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
    fetchChapters();
  }, [storyId]);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-center mt-4">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {story && (
        <>
          <h1 className="text-3xl font-bold">{story.title}</h1>
          <p className="text-gray-600 mt-2">Tác giả: {story.author && story.author.username}</p>
          <p className="mt-4">Giới thiệu: {story.description}</p>

          <h2 className="text-2xl font-bold mt-8">Danh sách chương</h2>
          <ul className="mt-4">
            {chapters.map((chapter, index) => (
              <li key={chapter._id} className="mb-2">
                <a href={`/chapter/${chapter._id}`} className="text-blue-500 hover:text-blue-700">{`Chap ${index + 1}: ${chapter.title}`}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default StoryPage;
