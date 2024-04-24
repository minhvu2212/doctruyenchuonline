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

  const approveStory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/approveStory', { storyIds: [id] }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh the list of pending stories after approval
      fetchPendingStories();
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
  const censorSensitiveWords = (text) => {
    const sensitiveWords = ['đan thần', 'tặc', 'đam mỹ']; 
    let censoredText = text;
    sensitiveWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      censoredText = censoredText.replace(regex, match => `<span style="color: red;">${match}</span>`);
    });
    return censoredText;
  };
  
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Truyện Cần Duyệt</h1>
      <ul>
        {pendingStories.map(story => (
          story.approved === false && (
            <li key={story._id} className="mb-4">
              <div className="border border-gray-200 p-4 rounded">
                <p className="font-bold">Tên: {story.title}</p>
          {/*      <p className="text-gray-700">Người đăng: {story.author.username}</p>*/}
                <p className="text-gray-700 truncate">{story.description}</p>
                <div className="flex mt-2">
                  <button onClick={() => approveStory(story._id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">Duyệt</button>
                  <button onClick={() => viewStoryDetails(story._id)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Xem chi tiết</button>
                </div>
              </div>
            </li>
          )
        ))}
      </ul>

      {selectedStory && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50" onClick={closeStoryDetails}>
    <div className="bg-white p-8 rounded shadow-lg" onClick={(e) => e.stopPropagation()} style={{ margin: '0 auto', maxWidth: '600px', width: '90%' }}>
      <span className="text-white text-3xl absolute top-2 right-2 cursor-pointer" onClick={closeStoryDetails}>&times;</span>
      <h2 className="text-2xl font-bold mb-4">Chi tiết Truyện</h2>
      <p><strong>Tên:</strong> <span dangerouslySetInnerHTML={{ __html: censorSensitiveWords(selectedStory.title) }}></span></p>
      <p><strong>Người đăng:</strong> {selectedStory.author.username}</p>
      <p><strong>Mô tả:</strong> <span dangerouslySetInnerHTML={{ __html: censorSensitiveWords(selectedStory.description) }}></span></p>

      {/* Hiển thị các thông tin khác của câu chuyện tại đây */}
      
      {/* Nút duyệt */}
      <button onClick={() => approveStory(selectedStory._id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4">Duyệt</button>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminPage;
