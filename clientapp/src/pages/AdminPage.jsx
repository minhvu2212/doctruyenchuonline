import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [pendingStories, setPendingStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchPendingStories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/getStories?approved=false', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPendingStories(response.data);
      } catch (error) {
        console.error('Error fetching pending stories:', error);
      }
    };

    fetchPendingStories();
  }, []);

  const approveStory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/approveStory', { storyIds: [id] }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh the list of pending stories after approval
      const response = await axios.get('http://localhost:5000/api/getStories?approved=false', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingStories(response.data);
    } catch (error) {
      console.error('Error approving story:', error);
    }
  };

  const viewStoryDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/getStory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedStory(response.data);
    } catch (error) {
      console.error('Error fetching story details:', error);
    }
  };

  const closeStoryDetails = () => {
    setSelectedStory(null);
  };

  return (
    <div>
      <h1>Pending Stories</h1>
      <ul>
        {pendingStories.map(story => (
          <li key={story._id}>
            <div>Title: {story.title}</div>
            <div>Author: {story.author}</div>
            <div>Content: {story.content}</div>
            <button onClick={() => approveStory(story._id)}>Approve</button>
            <button onClick={() => viewStoryDetails(story._id)}>View Details</button>
          </li>
        ))}
      </ul>

      {selectedStory && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeStoryDetails}>&times;</span>
            <h2>Story Details</h2>
            <p>Title: {selectedStory.title}</p>
            <p>Author: {selectedStory.author}</p>
            <p>Content: {selectedStory.content}</p>
            {/* Add more details as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
