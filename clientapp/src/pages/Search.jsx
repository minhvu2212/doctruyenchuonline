import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import thêm Link từ react-router-dom
import axios from 'axios';
import { Card, Typography, Spin } from 'antd';

const { Title, Text } = Typography;

const SearchResults = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');

        const fetchStories = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/getStories?title=${encodeURIComponent(query)}`);
                setStories(response.data);
            } catch (error) {
                console.error("Error fetching stories:", error);
            }
            setLoading(false);
        };

        if (query) {
            fetchStories();
        }
    }, [location.search]);

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Search Results</Title>
            {loading && <Spin size="large" />}
            {!loading && stories.length === 0 && <Text>No results found</Text>}
            {!loading && stories.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {stories.map(story => (
                        <Link to={`/stories/${story._id}`} key={story._id}> {/* Sử dụng Link để tạo liên kết */}
                            <Card
                                hoverable
                                cover={<img alt={story.title} src={story.cover} />}
                                style={{ marginBottom: '20px' }}
                            >
                                <Card.Meta title={story.title} description={story.description} />
                                <Text strong style={{ marginTop: '10px' }}>Categories: {story.categories.join(', ')}</Text>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
