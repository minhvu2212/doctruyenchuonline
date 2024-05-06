import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Spin, message, Dropdown, Menu, Input } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Title } = Typography;
const { TextArea } = Input;

const ChapterPage = () => {
  const { storyId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allChapters, setAllChapters] = useState([]);
  const [showChapterList, setShowChapterList] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const [chapterResponse, chaptersResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/chapters/${chapterId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:5000/api/chapters/story/${storyId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:5000/api/stories/${storyId}/chapters/${chapterId}/comments`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);
        setChapter(chapterResponse.data);
        const sortedChapters = chaptersResponse.data.sort((a, b) => a.order - b.order);
        setAllChapters(sortedChapters);
        setComments(commentsResponse.data);
      } catch (error) {
        message.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId, chapterId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  const goToChapter = (index) => {
    const nextChapterId = allChapters[index]._id;
    navigate(`/stories/${storyId}/chapter/${nextChapterId}`);
  };

  const handleMenuClick = (e) => {
    const index = e.key;
    goToChapter(index);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {allChapters.map((c, index) => (
        <Menu.Item key={index}>
          {`Chương ${index + 1}: ${c.title}`}
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.post(`http://localhost:5000/api/stories/${storyId}/chapters/${chapterId}/comments`, {
        content: commentContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newComment = response.data;
      setComments([...comments, newComment]);
      setCommentContent('');
    } catch (error) {
      message.error('Error submitting comment');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={2}>{`Chương ${allChapters.findIndex(c => c._id === chapterId) + 1}: ${chapter && chapter.title}`}</Title>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button type="primary" onClick={() => goToChapter(allChapters.findIndex(c => c._id === chapterId) - 1)} disabled={allChapters.findIndex(c => c._id === chapterId) === 0}>
          Chương Trước
        </Button>
        <Dropdown overlay={menu} placement="bottomLeft">
          <Button type="primary">Danh sách Chương</Button>
        </Dropdown>
        <Button type="primary" onClick={() => goToChapter(allChapters.findIndex(c => c._id === chapterId) + 1)} disabled={allChapters.findIndex(c => c._id === chapterId) === allChapters.length - 1}>
          Chương Tiếp
        </Button>
      </div>
      {chapter && (
        <div>
          <div className="quill-container" dangerouslySetInnerHTML={{ __html: chapter.content }} />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button type="primary" onClick={() => goToChapter(allChapters.findIndex(c => c._id === chapterId) - 1)} disabled={allChapters.findIndex(c => c._id === chapterId) === 0}>
          Chương Trước
        </Button>
        <Dropdown overlay={menu} placement="bottomLeft">
          <Button type="primary">Danh sách Chương</Button>
        </Dropdown>
        <Button type="primary" onClick={() => goToChapter(allChapters.findIndex(c => c._id === chapterId) + 1)} disabled={allChapters.findIndex(c => c._id === chapterId) === allChapters.length - 1}>
          Chương Tiếp
        </Button>
      </div>
      {/* Comment Section */}
      <div style={{ marginTop: '30px' }}>
        <Title level={3}>Bình luận</Title>
        <TextArea rows={4} value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
        <Button type="primary" onClick={handleCommentSubmit}>Gửi</Button>
        {comments.map((comment) => (
          <div key={comment._id} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <p><strong>{comment.author.username}</strong></p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
      {/* End of Comment Section */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default ChapterPage;
