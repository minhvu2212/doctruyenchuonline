import React, { useState } from 'react';
import axios from 'axios';

const CreateStoryPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [rating, setRating] = useState('');
  const [language, setLanguage] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleCreateStory = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/createStory', {
        title,
        description,
        cover,
        categories: categories.split(','), // Chuyển chuỗi thành mảng
        tags: tags.split(','), // Chuyển chuỗi thành mảng
        rating,
        language,
        targetAudience,
      });
      setSuccessMessage('Story created successfully');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <div>
      <h2>Create Story</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleCreateStory}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Cover:</label>
          <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} />
        </div>
        <div>
          <label>Categories:</label>
          <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} />
        </div>
        <div>
          <label>Tags:</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <label>Rating:</label>
          <input type="text" value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <div>
          <label>Language:</label>
          <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />
        </div>
        <div>
          <label>Target Audience:</label>
          <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
        </div>
        <button type="submit">Create Story</button>
      </form>
    </div>
  );
};

export default CreateStoryPage;
