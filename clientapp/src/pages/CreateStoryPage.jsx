import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Form, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const { Option } = Select;
const { TextArea } = Input;

const CreateStoryPage = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  const handleSubmit = async (values) => {
    const { title, description, cover, categories, tags } = values;
    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('description', description);
    if (cover && cover[0]) {
      formDataToSend.append('cover', cover[0].originFileObj);
    }
    categories.forEach(category => {
      formDataToSend.append('categories', category);
    });
    tags.forEach(tag => {
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
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error creating story:', error);
      message.error('Failed to create story.');
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Thêm Truyện mới</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        encType="multipart/form-data"
      >
        <Form.Item
          label="Tên Truyện:"
          name="title"
          rules={[{ required: true, message: 'Please input the title of the story!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô Tả:"
          name="description"
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Bìa:"
          name="cover"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Drag and drop an image file for the cover"
        >
          <Upload name="cover" listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Thể loại:"
          name="categories"
        >
          <Select
            mode="multiple"
            placeholder="Select categories"
          >
            {categories.map(category => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Tags:"
          name="tags"
        >
          <Select
            mode="multiple"
            placeholder="Select tags"
          >
            {tags.map(tag => (
              <Option key={tag._id} value={tag._id}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo Truyện
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateStoryPage;
