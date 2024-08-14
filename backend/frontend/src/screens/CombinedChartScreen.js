import React, { useState } from 'react';
import PieCustomerScreen from './PieCustomerScreen';
import PieChartScreen from './PieChartScreen';
import HeatmapScreen from './HeatmapScreen';
import { Link } from 'react-router-dom';

function CombinedPieChartScreen() {
    const [selectedChart, setSelectedChart] = useState('customer');

    const handleChartChange = (event) => {
        setSelectedChart(event.target.value);
    };

    return (
        <div>
            <Link to='/admin/charts'>
                Go Back
            </Link>
            <h1>Charts</h1>
            <div>
                <label htmlFor="chart-select">Select Chart: </label>
                <select id="chart-select" value={selectedChart} onChange={handleChartChange}>
                    <option value="customer">Customer Value Prediction</option>
                    <option value="category">Income by Product Category</option>
                    <option value="heatmap">Product Performance by Sales Volume</option>
                </select>
            </div>
            {selectedChart === 'customer' && <PieCustomerScreen />}
            {selectedChart === 'category' && <PieChartScreen />}
            {selectedChart === 'heatmap' && <HeatmapScreen />}
        </div>
    );
}

export default CombinedPieChartScreen;
