import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Nav, Dropdown } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom';

function CustomerScreen() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('weekly');

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const { data } = await axios.get('/api/charts/register_stat/');
                setChartData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    const getProcessedData = () => {
        return chartData[chartType].map(item => ({
            date: item.week || item.month || item.year,
            count: item.count
        }));
    };

    const renderChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getProcessedData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );

    return (
        <div>
            <Link to='/admin/charts'>
                Go Back
            </Link>
            <h1>User Growth per {
                chartType === 'weekly' ? 'Week' : 
                chartType === 'monthly' ? 'Month' : 
                chartType === 'yearly' ? 'Year' : 
                'Period'
            }</h1>
            <Nav>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select Chart Type
                    </Dropdown.Toggle>
    
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setChartType('weekly')}>Users per Week</Dropdown.Item>
                        <Dropdown.Item onClick={() => setChartType('monthly')}>Users per Month</Dropdown.Item>
                        <Dropdown.Item onClick={() => setChartType('yearly')}>Users per Year</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Nav>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                renderChart()
            )}
        </div>
    );
}

export default CustomerScreen;
