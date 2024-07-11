import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChartListScreen = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data } = await axios.get('/api/dashboard/');
            setDashboardData(data);
        };
        fetchDashboardData();
    }, []);

    const handleUnitsSoldClick = () => {
        navigate('/admin/productsaleschart');
    };

    return (
        <Container className="mt-5">
            <h1>Dashboard</h1>
            <Row className="mt-4">
                <Col md={3}>
                    <Button variant="primary" block onClick={handleUnitsSoldClick}>
                        Units Sold: {dashboardData ? dashboardData.units_sold : 'Loading...'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="primary" block>
                        Income: ${dashboardData ? dashboardData.income.toFixed(2) : 'Loading...'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="primary" block>
                        Customers: {dashboardData ? dashboardData.customers : 'Loading...'}
                    </Button>
                </Col>
                <Col md={3}>
                    <Button variant="primary" block>
                        Inventory: {dashboardData ? dashboardData.inventory : 'Loading...'}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ChartListScreen;