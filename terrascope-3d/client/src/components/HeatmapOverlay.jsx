import React from 'react';

const HeatmapOverlay = ({ active }) => {
    if (!active) return null;

    return (
        <div className="heatmap-overlay-legend">
            <h4>Heatmap Intensity</h4>
            <div className="gradient-bar"></div>
            <div className="labels">
                <span>Low</span>
                <span>High</span>
            </div>
        </div>
    );
};

export default HeatmapOverlay;
