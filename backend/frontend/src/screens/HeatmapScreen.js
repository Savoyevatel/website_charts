import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from "react-plotly.js";
import Loader from '../components/Loader';
import Message from '../components/Message';

function HeatmapScreen() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/charts/user_spend/');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const prepareHeatmapData = () => {
        const locationData = {};
        data.forEach(item => {
            if (locationData[item.location]) {
                locationData[item.location] += item.total_spent;
            } else {
                locationData[item.location] = item.total_spent;
            }
        });

        const locations = Object.keys(locationData);
        const totalSpent = Object.values(locationData);

        return {
            z: [totalSpent],
            x: locations,
            y: ['Total Spent'],
            type: 'heatmap',
            colorscale: 'Viridis'
        };
    };

    return (
        <div>
            <h1>Total Spend by Location (Postal Code)</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Plot
                        data={[prepareHeatmapData()]}
                        layout={{
                            width: 800,
                            height: 400,
                            title: 'Total Spend by Location (Postal Code)',
                            xaxis: { title: 'Postal Code' },
                            yaxis: { title: '' }
                        }}
                    />
                    <div style={{ width: '45%' }}>
                        <h2>Location Details</h2>
                        <ul>
                            {data.map((item, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                    <strong>{item.location}:</strong> ${item.total_spent.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HeatmapScreen;