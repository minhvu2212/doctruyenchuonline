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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{story.title}</h1>
      <p>{story.description}</p>

      <h2>Chapters</h2>
      <ul>
        {chapters.map(chapter => (
          <li key={chapter._id}>
            <a href={`/chapters/${chapter._id}`}>{chapter.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryPage;
