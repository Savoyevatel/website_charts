import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Nav, Dropdown } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom';

function IncomeScreen() {
    const [chartData, setChartData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0); // State to store total income
    const [totalPaid, setTotalPaid] = useState(0); // State to store total paid
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('income_per_week');
    const [subType, setSubType] = useState(null);

    useEffect(() => {    
        const fetchChartData = async () => {
            try {
                const { data } = await axios.get('/api/charts/income/');
                setChartData(data);

                // Compute total income
                const total = data.reduce((sum, item) => sum + item.TotalIncome, 0);
                setTotalIncome(total);

                // Compute total paid
                const paid = data.reduce((sum, item) => {
                    const totalPaidForItem = item.income_per_year.reduce((yearSum, year) => yearSum + year.Income, 0);
                    return sum + totalPaidForItem;
                }, 0);
                setTotalPaid(paid);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    const getProcessedData = () => {
        if (chartType === 'total_and_not_paid') {
            return chartData.map(item => {
                const totalIncome = item.income_per_year.reduce((sum, year) => sum + year.Income, 0);
                const notPaid = item.TotalIncome - totalIncome;
                return {
                    name: item.name,
                    "Total Income": item.TotalIncome,
                    "Paid": totalIncome,
                    "Not yet Paid": notPaid
                };
            });
        }

        return chartData.map(item => {
            if (chartType === 'income_per_week' && subType) {
                const weekData = item.income_per_week.find(week => week.week === subType);
                return {
                    name: item.name,
                    Income: weekData ? weekData.Income : 0
                };
            }
            if (chartType === 'income_per_month' && subType) {
                const monthData = item.income_per_month.find(month => month.month === subType);
                return {
                    name: item.name,
                    Income: monthData ? monthData.Income : 0
                };
            }
            if (chartType === 'income_per_year' && subType) {
                const yearData = item.income_per_year.find(year => year.year === subType);
                return {
                    name: item.name,
                    Income: yearData ? yearData.Income : 0
                };
            }
            return {
                name: item.name,
                Income: item.TotalIncome
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
                {chartType === 'total_and_not_paid' ? (
                    <>
                        <Bar dataKey="Total Income" fill="#8884d8" />
                        <Bar dataKey="Paid" fill="#82ca9d" />
                        <Bar dataKey="Not yet Paid" fill="#ff7f50" />
                    </>
                ) : (
                    <Bar 
                        dataKey="Income" 
                        fill={chartType === 'income_per_week' ? "#8884d8" : 
                              chartType === 'income_per_month' ? "#82ca9d" : 
                              chartType === 'income_per_year' ? "#ffc658" : "#82ca9d"} 
                    />
                )}
            </BarChart>
        </ResponsiveContainer>
    );

    const renderSubTypeMenu = () => {
        if (chartType === 'income_per_week') {
            const weeks = [...new Set(chartData.flatMap(item => item.income_per_week.map(week => week.week)))];
            return weeks.map(week => (
                <Dropdown.Item key={week} onClick={() => setSubType(week)}>
                    Week of {new Date(week).toLocaleDateString()}
                </Dropdown.Item>
            ));
        }
        if (chartType === 'income_per_month') {
            const months = [...new Set(chartData.flatMap(item => item.income_per_month.map(month => month.month)))];
            return months.map(month => (
                <Dropdown.Item key={month} onClick={() => setSubType(month)}>
                    {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Dropdown.Item>
            ));
        }
        if (chartType === 'income_per_year') {
            const years = [...new Set(chartData.flatMap(item => item.income_per_year.map(year => year.year)))];
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
            <h1>Income by {
                chartType === 'income_per_week' ? 'Week' : 
                chartType === 'income_per_month' ? 'Month' : 
                chartType === 'income_per_year' ? 'Year' : 
                chartType === 'total_and_not_paid' ? 'Total' :
                'Total'
            }</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <h2 style={{ color: 'blue' }}>Gross: ${totalIncome.toFixed(2)}</h2>
                <h2 style={{ color: 'green' }}>Net: ${totalPaid.toFixed(2)}</h2>
            </div>
            <Nav>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select Chart Type
                    </Dropdown.Toggle>
    
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { setChartType('income_per_week'); setSubType(null); }}>Income per Week</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setChartType('income_per_month'); setSubType(null); }}>Income per Month</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setChartType('income_per_year'); setSubType(null); }}>Income per Year</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setChartType('total_and_not_paid'); setSubType(null); }}>Total Income</Dropdown.Item>
                        {(chartType === 'income_per_week' || chartType === 'income_per_month' || chartType === 'income_per_year') && (
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

export default IncomeScreen;
