import React from 'react';

const LayerControls = ({ layers, onToggleLayer }) => {
    return (
        <div className="layer-controls">
            <h3>Layers</h3>
            <ul>
                {layers?.map(layer => (
                    <li key={layer.id}>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={layer.visible} 
                                onChange={() => onToggleLayer(layer.id)} 
                            />
                            {layer.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LayerControls;
