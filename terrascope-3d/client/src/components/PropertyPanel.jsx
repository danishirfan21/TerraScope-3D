import React from 'react';

const PropertyPanel = ({ selectedEntity }) => {
    if (!selectedEntity) {
        return (
            <div className="property-panel empty">
                <h3>Selection</h3>
                <p>Select an entity to view properties.</p>
            </div>
        );
    }

    return (
        <div className="property-panel">
            <h3>Entity Details</h3>
            <div className="property-list">
                {Object.entries(selectedEntity.properties || {}).map(([key, value]) => (
                    <div key={key} className="property-item">
                        <span className="label">{key}:</span>
                        <span className="value">{String(value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyPanel;
