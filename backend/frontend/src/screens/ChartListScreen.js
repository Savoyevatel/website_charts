import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChartListScreen = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchDashboardData = async () => {
    //         const { data } = await axios.get('/api/dashboard/');
    //         setDashboardData(data);
    //     };
    //     fetchDashboardData();
    // }, []);

    const handleUnitsSoldClick = () => {
        navigate('/admin/productsaleschart');
    };
    const handleIncomeClick = () => {
        navigate('/admin/incomechart');
    };
    const handleCustomerClick = () => {
        navigate('/admin/customerchart');
    };

    const handleCombinedPieClick = () => {
        navigate('/admin/combined');
    };

    return (
        <Container className="mt-5">
            <h1>Dashboard</h1>
            <Row className="mt-4">
                <Col md={3}>
                    <Button variant="primary" block onClick={handleUnitsSoldClick}>
                    Inventory Management
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="primary" block onClick={handleIncomeClick} >
                    Sales Analysis
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="primary" block onClick={handleCustomerClick}>
                    Customer Insights
                    </Button>
                </Col>

                <Col md={3}>
                    <Button variant="primary" block onClick={handleCombinedPieClick}>
                    Customer Lifetime Value Prediction
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ChartListScreen;