import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      <h1 className="text-3xl font-bold mb-4">Danh Sách Truyện</h1>
      {stories.length > 0 ? (
        <ul>
          {stories.map(story => (
            <li key={story._id} className="border-b border-gray-200 py-4">
              <Link to={`/stories/${story._id}`} className="text-blue-500 hover:text-blue-700">{story.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No approved stories found.</p>
      )}
    </div>
  );
}

export default IndexPage;
