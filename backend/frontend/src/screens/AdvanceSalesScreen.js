import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Nav, Dropdown } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom';


function AdvanceSalesScreen() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('sales_per_week');
    const [subType, setSubType] = useState(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const { data } = await axios.get('/api/charts/chart/');
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
        if (chartType === 'total_and_not_sold') {
            return chartData.map(item => {
                const totalSold = item.sales_per_year.reduce((sum, year) => sum + year.Units, 0);
                const notSold = item.Units - totalSold;
                return {
                    name: item.name,
                    "Total Sold": item.Units,
                    "Paid": totalSold,
                    "Not yet Paid": notSold
                };
            });
        }

        return chartData.map(item => {
            if (chartType === 'sales_per_week' && subType) {
                const weekData = item.sales_per_week.find(week => week.week === subType);
                return {
                    name: item.name,
                    Units: weekData ? weekData.Units : 0
                };
            }
            if (chartType === 'sales_per_month' && subType) {
                const monthData = item.sales_per_month.find(month => month.month === subType);
                return {
                    name: item.name,
                    Units: monthData ? monthData.Units : 0
                };
            }
            if (chartType === 'sales_per_year' && subType) {
                const yearData = item.sales_per_year.find(year => year.year === subType);
                return {
                    name: item.name,
                    Units: yearData ? yearData.Units : 0
                };
            }
            return {
                name: item.name,
                Units: item.Units
            };
        });
    };

    const renderChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getProcessedData()} barGap={10}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {chartType === 'total_and_not_sold' ? (
                    <>
                        <Bar dataKey="Total Sold" fill="#8884d8" />
                        <Bar dataKey="Paid" fill="#82ca9d" />
                        <Bar dataKey="Not yet Paid" fill="#ff7f50" />
                    </>
                ) : (
                    <Bar 
                        dataKey="Units" 
                        fill={chartType === 'sales_per_week' ? "#8884d8" : 
                              chartType === 'sales_per_month' ? "#82ca9d" : 
                              chartType === 'sales_per_year' ? "#ffc658" : "#82ca9d"} 
                    />
                )}
            </BarChart>
        </ResponsiveContainer>
    );

    const renderSubTypeMenu = () => {
        if (chartType === 'sales_per_week') {
            const weeks = [...new Set(chartData.flatMap(item => item.sales_per_week.map(week => week.week)))];
            return weeks.map(week => (
                <Dropdown.Item key={week} onClick={() => setSubType(week)}>
                    Week of {new Date(week).toLocaleDateString()}
                </Dropdown.Item>
            ));
        }
        if (chartType === 'sales_per_month') {
            const months = [...new Set(chartData.flatMap(item => item.sales_per_month.map(month => month.month)))];
            return months.map(month => (
                <Dropdown.Item key={month} onClick={() => setSubType(month)}>
                    {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Dropdown.Item>
            ));
        }
        if (chartType === 'sales_per_year') {
            const years = [...new Set(chartData.flatMap(item => item.sales_per_year.map(year => year.year)))];
            return years.map(year => (
                <Dropdown.Item key={year} onClick={() => setSubType(year)}>
                    Year {new Date(year).getFullYear()}
                </Dropdown.Item>
            ));
        }
        return null;
    };

    return (
        <div>
            <Link to='/admin/charts'>
                Go Back
            </Link>
            <h1>Sold by {
                chartType === 'sales_per_week' ? 'Units per Week' : 
                chartType === 'sales_per_month' ? 'Units per Month' : 
                chartType === 'sales_per_year' ? 'Units per Year' : 
                chartType === 'total_and_not_sold' ? 'Total Units' :
                'Total'
            }</h1>
            <Nav>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select Chart Type
                    </Dropdown.Toggle>
    
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { setChartType('sales_per_week'); setSubType(null); }}>Units per Week</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setChartType('sales_per_month'); setSubType(null); }}>Units per Month</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setChartType('sales_per_year'); setSubType(null); }}>Units per Year</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setChartType('total_and_not_sold'); setSubType(null); }}>Total Units</Dropdown.Item>
                        {(chartType === 'sales_per_week' || chartType === 'sales_per_month' || chartType === 'sales_per_year') && (
                            <>
                                <Dropdown.Divider />
                                {renderSubTypeMenu()}
                            </>
                        )}
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

export default AdvanceSalesScreen;