import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, message, Popconfirm, Typography } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Title } = Typography;

function EditChapter() {
  const { storyId } = useParams();
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChapter(response.data);
        setUpdatedTitle(response.data.title);
        setUpdatedContent(response.data.content);
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };

    fetchChapter();
  }, [chapterId]);

  const handleDeleteChapter = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/chapters/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Chapter đã được xóa thành công!');
      navigate(`/stories/${storyId}/manage-chapters`);
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const handleUpdateChapter = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Lấy thông tin chương từ API
      const responseChapter = await axios.get(`http://localhost:5000/api/chapters/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const chapter = responseChapter.data;
  
      // Cập nhật chương
      await axios.put(`http://localhost:5000/api/chapters/${chapterId}`, {
        title: updatedTitle,
        content: updatedContent,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Nếu chương đã được phê duyệt (approved === true), cập nhật lại thành false
      if (chapter.approved) {
        await axios.put(`http://localhost:5000/api/chapters/${chapterId}`, {
          approved: false,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      message.success('Chapter đã được cập nhật thành công!');
      navigate(`/stories/${storyId}/manage-chapters`);
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };
  
  return (
    <div className="p-4 mx-auto max-w-screen-md">
      {chapter && (
        <div>
          <Title level={2}>{chapter.title}</Title>
          <Input
            className="mb-4"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <ReactQuill
            className="mb-4"
            value={updatedContent}
            onChange={setUpdatedContent}
          />
          <div className="flex justify-between">
            <Button type="primary" icon={<SaveOutlined />} onClick={handleUpdateChapter}>
              Lưu thay đổi
            </Button>
            <Popconfirm
              title="Bạn có chắc muốn xóa chương này không?"
              onConfirm={handleDeleteChapter}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="danger" icon={<DeleteOutlined />}>
                Xóa chương
              </Button>
            </Popconfirm>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditChapter;
