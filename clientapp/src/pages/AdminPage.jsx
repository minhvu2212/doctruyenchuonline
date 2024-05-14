import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Spin, Typography, Row, Col } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Title, Text } = Typography;

const AdminPage = () => {
  const [pendingStories, setPendingStories] = useState([]);
  const [pendingChapters, setPendingChapters] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingStories();
    fetchPendingChapters();
  }, []);

  const fetchPendingStories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/getStories?approved=false', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingStories(response.data);
    } catch (error) {
      console.error('Error fetching pending stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingChapters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/getChapters?approved=false', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingChapters(response.data);
    } catch (error) {
      console.error('Error fetching pending chapters:', error);
    } finally {
      setLoading(false);
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
      fetchPendingStories();
    } catch (error) {
      console.error('Error approving story:', error);
    }
  };

  const approveChapter = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/chapters/${id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchPendingChapters();
    } catch (error) {
      console.error('Error approving chapter:', error);
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

  const viewChapterDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/getChapter/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedChapter(response.data);
    } catch (error) {
      console.error('Error fetching chapter details:', error);
    }
  };

  const closeStoryDetails = () => {
    setSelectedStory(null);
  };

  const closeChapterDetails = () => {
    setSelectedChapter(null);
  };

  const censorSensitiveWords = (text) => {
    const sensitiveWords = [
        'đan thần', 
        'tặc', 
        'đam mỹ', 
        'chống phá nhà nước', 
        '18+', 
        'đồi trụy', 
        'nô lệ tình dục',
        'mại dâm',
        'tội ác',
        'tệ nạn',
        'bạo lực',
        'cưỡng bức',
        'ngáo đá',
        'rượu bia',
        'ma túy',
        'hủy hoại',
        'phản động',
        'gian lận',
        'ăn cắp',
        'tác hại',
        'thuốc lắc',
        'giết người',
        'hành hung',
        'trộm cắp',
        'buôn bán người',
        'bạo hành',
        'xâm hại',
        'nợ nần',
        'thuê bao'
        // Thêm các từ nhạy cảm khác ở đây
    ]; 
    let censoredText = text;
    let count = 0;
    sensitiveWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        censoredText = censoredText.replace(regex, match => {
            count++;
            return `<span style="color: red;">${match}</span>`;
        });
    });
    return { censoredText, count };
  };

  const handleApproveStoryConfirm = (id) => {
    confirm({
      title: 'Xác nhận duyệt truyện',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn duyệt truyện này?',
      onOk() {
        approveStory(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleApproveChapterConfirm = (id) => {
    confirm({
      title: 'Xác nhận duyệt chương',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn duyệt chương này?',
      onOk() {
        approveChapter(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Row gutter={16}>
        <Col span={12}>
          <Title level={2}>Truyện Cần Duyệt</Title>
          <Spin spinning={loading}>
            {pendingStories.map(story => (
              story.approved === false && (
                <div key={story._id} className="border border-gray-200 p-4 rounded mb-4">
                  <div className="flex items-center mb-2">
                    <img src={story.cover} alt="Cover" style={{ width: 100, height: 'auto', marginRight: 16 }} />
                    <div>
                      <Title level={4} className="mb-2">Tên: {story.title}</Title>
                      <Text className="text-gray-700 block mb-2">Mô tả: <span dangerouslySetInnerHTML={{ __html: censorSensitiveWords(story.description).censoredText }}></span></Text>
                      <Text type="danger">Từ nhạy cảm: {censorSensitiveWords(story.description).count}</Text>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button type="primary" className="mr-2" onClick={() => handleApproveStoryConfirm(story._id)}>Duyệt</Button>
                    <Button onClick={() => viewStoryDetails(story._id)}>Xem chi tiết</Button>
                  </div>
                </div>
              )
            ))}
          </Spin>

          {selectedStory && (
            <Modal
              visible={!!selectedStory}
              onCancel={closeStoryDetails}
              footer={null}
              destroyOnClose
            >
              <Title level={3} className="mb-4">Chi tiết Truyện</Title>
              <div>
                <p><strong>Tên:</strong> <span dangerouslySetInnerHTML={{ __html: censorSensitiveWords(selectedStory.title).censoredText }}></span></p>
                <p><strong>Người đăng:</strong> {selectedStory.author.username}</p>
                <p><strong>Mô tả:</strong> <span dangerouslySetInnerHTML={{ __html: censorSensitiveWords(selectedStory.description).censoredText }}></span></p>
                <Text type="danger">Từ nhạy cảm: {censorSensitiveWords(selectedStory.description).count}</Text>
              </div>
              <div className="mt-4">
                <Button type="primary" onClick={() => approveStory(selectedStory._id)}>Duyệt</Button>
              </div>
            </Modal>
          )}
        </Col>

        <Col span={12}>
          <Title level={2}>Chương Cần Duyệt</Title>
          <Spin spinning={loading}>
            {pendingChapters.map(chapter => (
              chapter.approved === false && (
                <div key={chapter._id} className="border border-gray-200 p-4 rounded mb-4">
                  <Title level={4} className="mb-2">Tên chương: {chapter.title}</Title>
                  <Text className="text-gray-700 block mb-2">Nội dung: <span dangerouslySetInnerHTML={{ __html: censorSensitiveWords(chapter.content).censoredText }}></span></Text>
                  <Text type="danger">Từ nhạy cảm: {censorSensitiveWords(chapter.content).count}</Text>
                  <div className="flex items-center mt-2">
                    <Button type="primary" className="mr-2" onClick={() => handleApproveChapterConfirm(chapter._id)}>Duyệt</Button>
                    <Button onClick={() => viewChapterDetails(chapter._id)}>Xem chi tiết</Button>
                  </div>
                </div>
              )
            ))}
          </Spin>

          {selectedChapter && (
            <Modal
              visible={!!selectedChapter}
              onCancel={closeChapterDetails}
              footer={null}
              destroyOnClose
            >
              <Title level={3} className="mb-4">Chi tiết Chương</Title>
              <div>
                <p><strong>Tên chương:</strong> <span dangerouslySetInnerHTML={{ __html: censorSensitiveWords(selectedChapter.title).censoredText }}></span></p>
                <p><strong>Nội dung:</strong> <span dangerouslySetInnerHTML={{ __html: censorSensitiveWords(selectedChapter.content).censoredText }}></span></p>
                <Text type="danger">Từ nhạy cảm: {censorSensitiveWords(selectedChapter.content).count}</Text>
              </div>
              <div className="mt-4">
                <Button type="primary" onClick={() => approveChapter(selectedChapter._id)}>Duyệt</Button>
              </div>
            </Modal>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AdminPage;
