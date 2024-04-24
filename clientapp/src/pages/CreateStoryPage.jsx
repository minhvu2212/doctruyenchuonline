import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateStoryPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover: null,
    categories: [],
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [duplicateTitleError, setDuplicateTitleError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State để điều khiển hiển thị thông báo thành công

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const categoriesResponse = await axios.get("http://localhost:5000/api/categories");
        setCategories(categoriesResponse.data);
        const tagsResponse = await axios.get("http://localhost:5000/api/tags");
        setTags(tagsResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Error loading categories and tags");
        setLoading(false);
      }
    };

    fetchCategoriesAndTags();
  }, []);

  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };

    fetchToken();
  }, []);

  const checkDuplicateTitle = async (title) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getStories?title=${encodeURIComponent(title)}`);
      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking duplicate title:', error);
      return false;
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'title') {
      try {
        const isDuplicate = await checkDuplicateTitle(value);
        if (isDuplicate) {
          setDuplicateTitleError("Tiêu đề đã tồn tại, vui lòng chọn một tiêu đề khác.");
        } else {
          setDuplicateTitleError("");
        }
      } catch (error) {
        console.error('Error handling title change:', error);
      }
    }
  };


  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, categories: selectedCategories });
  };

  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, tags: selectedTags });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, cover: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('cover', formData.cover);
    formData.categories.forEach((category) => {
      formDataToSend.append('categories', category);
    });
    formData.tags.forEach((tag) => {
      formDataToSend.append('tags', tag);
    });

    try {
      const response = await axios.post(
        'http://localhost:5000/api/createStory',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('New story created:', response.data);
      setShowSuccessMessage(true); // Hiển thị thông báo thành công
      // Redirect to the newly created story page or do something else
    } catch (error) {
      console.error('Error creating story:', error);
      // Handle error, display error message, etc.
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (showSuccessMessage) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Thêm Truyện mới</h2>
        <div className="text-green-500">Truyện của bạn đã được tạo thành công và đang chờ duyệt!</div>
        {/* Add a button or a link to go back to the homepage */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Thêm Truyện mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block">Tên Truyện:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-400 rounded-md py-2 px-4 w-full"
          />
          {duplicateTitleError && <div className="text-red-500">{duplicateTitleError}</div>}
        </div>
        <div>
          <label className="block">Mô Tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-400 rounded-md py-2 px-4 w-full"
          />
        </div>
        <div>
          <label className="block">Bìa:</label>
          <input
            type="file"
            name="cover"
            onChange={handleFileChange}
            className="border border-gray-400 rounded-md py-2 px-4 w-full"
          />
        </div>
        <div>
          <label className="block">Thể loại:</label>
          <select
            name="categories"
            value={formData.categories}
            onChange={handleCategoryChange}
            multiple
            className="border border-gray-400 rounded-md py-2 px-4 w-full"
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Tags:</label>
          <select
            name="tags"
            value={formData.tags}
            onChange={handleTagChange}
            multiple
            className="border border-gray-400 rounded-md py-2 px-4 w-full"
          >
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Tạo Truyện
        </button>
      </form>
    </div>
  );
};

export default CreateStoryPage;
