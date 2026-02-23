import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
    return (
        <div className="filters-container">
            <h3>Filters</h3>
            <div className="filter-group">
                <label>Search Area:</label>
                <input type="text" placeholder="Location..." />
            </div>
            <div className="filter-group">
                <label>Date Range:</label>
                <input type="date" />
            </div>
        </div>
    );
};

export default Filters;
