import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Spin, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Title } = Typography;

const ChapterPage = () => {
  const { storyId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get(`http://localhost:5000/api/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChapter(response.data);
      } catch (error) {
        message.error('Error fetching chapter details');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [storyId, chapterId]);

  const goToNextChapter = () => {
    navigate(`/stories/${storyId}/chapters/${nextChapterId}`);
  };

  const goToPreviousChapter = () => {
    navigate(`/stories/${storyId}/chapters/${previousChapterId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {chapter && (
        <div>
          <Title level={2} style={{ marginBottom: '20px' }}>{chapter.title}</Title>
          <div className="quill-container">
            <ReactQuill
              value={chapter.content}
              readOnly={true}
              theme="snow"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button type="primary" onClick={goToPreviousChapter} style={{ marginRight: '10px' }}>
              Chương Trước
            </Button>
            <Button type="primary" onClick={goToNextChapter}>
              Chương Tiếp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterPage;
