import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Loader from '../components/Loader';
import Message from '../components/Message';

Chart.register(ArcElement, Tooltip, Legend);

function SentimentAnalysisScreen() {
    const { id: productId } = useParams();
    const [sentimentData, setSentimentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSentimentData = async () => {
            try {
                const { data } = await axios.get(`/api/ml/analyze-sentiment/${productId}/`);
                setSentimentData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchSentimentData();
    }, [productId]);

    const generateChartData = () => {
        const positiveReviews = sentimentData.filter(item => item.sentiment > 0).length;
        const negativeReviews = sentimentData.filter(item => item.sentiment < 0).length;
        const neutralReviews = sentimentData.filter(item => item.sentiment === 0).length;

        return {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [
                {
                    data: [positiveReviews, negativeReviews, neutralReviews],
                    backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56'],
                    hoverBackgroundColor: ['#36a2eb', '#ff6384', '#ffcd56'],
                },
            ],
        };
    };

    return (
        <div>
            <Link to='/admin/productlist'>
                Go Back
            </Link>
            
            <Row className='align-items-center'>
                <Col>
                    <h1>Sentiment Analysis</h1>
                </Col>
            </Row>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <Pie data={generateChartData()} />
                </div>
            )}
        </div>
    );
}

export default SentimentAnalysisScreen;
