import React, { useState } from 'react';
import CesiumViewer from './components/CesiumViewer';
import PropertyPanel from './components/PropertyPanel';
import LayerControls from './components/LayerControls';
import Filters from './components/Filters';
import HeatmapOverlay from './components/HeatmapOverlay';
import './App.css';

function App() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [layers, setLayers] = useState([
    { id: '1', name: 'Terrain', visible: true },
    { id: '2', name: 'Buildings', visible: true },
    { id: '3', name: 'Roads', visible: false },
  ]);

  const handleToggleLayer = (id) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>TerraScope 3D</h1>
      </header>
      
      <main className="viewer-layout">
        <aside className="sidebar left">
          <Filters />
          <LayerControls layers={layers} onToggleLayer={handleToggleLayer} />
        </aside>

        <section className="viewer-container">
          <CesiumViewer />
          <HeatmapOverlay active={true} />
        </section>

        <aside className="sidebar right">
          <PropertyPanel selectedEntity={selectedEntity} />
        </aside>
      </main>
    </div>
  );
}

export default App;
