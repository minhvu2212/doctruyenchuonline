import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Select, Input, Button, Typography, Form, message } from 'antd';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

const { Option } = Select;
const { Title } = Typography;

const AddChapterPage = () => {
  const { storyId } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [chapterCounts, setChapterCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/chapters/story/${storyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const nextOrder = response.data.length + 1;
        setChapterCounts(nextOrder);
      } catch (error) {
        console.error('Error fetching chapter details:', error);
      }
    };

    fetchChapterDetails();
  }, [storyId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/chapters/${storyId}`, {
        title: values.title,
        content: values.content,
        order: chapterCounts,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Chapter đã được thêm thành công!');
      setSuccess(true);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    form.resetFields();
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="p-4 mx-auto max-w-screen-md">
      <Title level={2}>Thêm Chapter mới</Title>
      {success ? (
        <div className="mb-4 text-green-500 font-semibold">Chapter đã được thêm thành công!</div>
      ) : (
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="story" label="Chọn Truyện" initialValue={storyId} hidden>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề Chap" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề chap' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung chap' }]}>
            <ReactQuill className="border rounded" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Gửi
            </Button>
          </Form.Item>
        </Form>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {success && (
        <div className="mt-4 flex justify-end">
          <Button type="primary" onClick={handleContinue}>Tiếp tục thêm chap mới</Button>
        </div>
      )}
    </div>
  );
};

export default AddChapterPage;