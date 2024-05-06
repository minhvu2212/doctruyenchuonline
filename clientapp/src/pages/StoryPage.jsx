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
          <div className="flex">
            <img src={story.cover} alt="Story Cover" className="w-1/4 mr-4" />

            <div>
              <h1 className="text-3xl font-bold">{story.title}</h1>
              <p className="text-gray-600 mt-2">Tác giả: {story.author && story.author.username}</p>
              <p className="mt-4">Giới thiệu: {story.description}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8">Danh sách chương</h2>
          <table className="mt-4">
            <thead>
              <tr>
                <th>Chương</th>
                <th>Tiêu đề</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter, index) => (
                <tr key={chapter._id}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={`/stories/${story._id}/chapter/${chapter._id}`} className="text-blue-500 hover:text-blue-700">{chapter.title}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default StoryPage;
