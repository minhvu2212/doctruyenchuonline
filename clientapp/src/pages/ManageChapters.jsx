import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { List, Button, Typography, message, Popconfirm, Spin, Empty } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ManageChapters = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/chapters/story/${storyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChapters(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    fetchChapters();
  }, [storyId]);

  const handleDeleteChapter = async (chapterId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/chapters/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Chapter đã được xóa thành công!');
      const updatedChapters = chapters.filter(chapter => chapter._id !== chapterId);
      setChapters(updatedChapters);
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  return (
    <div className="p-4 mx-auto max-w-screen-md">
      <Title level={2}>Quản lý chương</Title>
      <Button type="primary" className="mb-4" onClick={() => navigate(`/story/chapter/add/${storyId}`)}>Thêm chương mới</Button>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        chapters.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={chapters}
            renderItem={chapter => (
              <List.Item
                actions={[
                  <Link to={`/stories/${storyId}/chapters/${chapter._id}/edit`}><EditOutlined /> Chỉnh sửa</Link>,
                  <Popconfirm
                    title="Bạn có chắc muốn xóa chương này không?"
                    onConfirm={() => handleDeleteChapter(chapter._id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <span><DeleteOutlined /> Xóa</span>
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  title={<Link to={`/story/chapter/${chapter._id}`}>{chapter.title}</Link>}
                  description={`Chương ${chapter.order}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Không có chương nào được tìm thấy." />
        )
      )}
    </div>
  );
};

export default ManageChapters;
