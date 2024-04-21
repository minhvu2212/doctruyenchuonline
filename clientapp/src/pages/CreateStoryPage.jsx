import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header"; // Import Header component
import Footer from "../Footer"; // Import Footer component

const CreateStoryPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover: "",
    categories: [],
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(""); // State để lưu trữ token

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, categories: selectedCategories });
  };

  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, tags: selectedTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/createStory",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong tiêu đề Authorization
          },
        }
      );
      console.log("New story created:", response.data);
      // Redirect to the newly created story page or do something else
    } catch (error) {
      console.error("Error creating story:", error);
      // Handle error, display error message, etc.
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header /> {/* Thêm header */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Thêm Truyện mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Tên Truyện:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-400 rounded-md py-2 px-4 w-full"
            />
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
              type="text"
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              className="border border-gray-400 rounded-md py-2 px-4 w-full"
            />
          </div>
          <div>
            <label className="block">Thể loại:</label>
            <select
              name="categories"
              value={formData.categories}
              onChange={handleCategoryChange}
              multiple // Allow multiple selections
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
              multiple // Allow multiple selections
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
      <Footer /> {/* Thêm footer */}
    </>
  );
};

export default CreateStoryPage;
