import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header'; // Import Header component
import Footer from '../Footer'; // Import Footer component
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
      <Header /> {/* Thêm Header vào đây */}
    <div>
      <h1 className="text-2xl font-bold mb-4">Truyện Cần Duyệt</h1>
      <ul>
        {pendingStories.map(story => (
          <li key={story._id} className="mb-4">
            <div className="border border-gray-200 p-4 rounded">
              <p className="font-bold">Tên: {story.title}</p>
              <p className="text-gray-700">Người đăng: {story.author}</p>
              {/* You can truncate content if it's too long */}
              <p className="text-gray-700 truncate">{story.content}</p>
              <div className="flex mt-2">
                <button onClick={() => approveStory(story._id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">Approve</button>
                <button onClick={() => viewStoryDetails(story._id)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">View Details</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedStory && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <span className="text-gray-600 text-xl absolute top-2 right-4 cursor-pointer" onClick={closeStoryDetails}>&times;</span>
            <h2 className="text-2xl font-bold mb-4">Story Details</h2>
            <p><strong>Tên:</strong> {selectedStory.title}</p>
            <p><strong>Người đăng:</strong> {selectedStory.author}</p>
            <p><strong>Content:</strong> {selectedStory.content}</p>
            {/* Add more details as needed */}
          </div>
        </div>
      )}
    </div>
    <Footer /> {/* Thêm Footer vào đây */}
    </div>
  );
};

export default AdminPage;
