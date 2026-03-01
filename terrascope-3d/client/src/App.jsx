import React from 'react';
import { Box, Paper, Typography, AppBar, Toolbar, IconButton, FormControlLabel, Switch, Button } from '@mui/material';
import { TravelExplore, Analytics } from '@mui/icons-material';
import CesiumViewer from './components/CesiumViewer';
import PropertyPanel from './components/PropertyPanel';
import LayerControls from './components/LayerControls';
import Filters from './components/Filters';
import HeatmapOverlay from './components/HeatmapOverlay';
import InvestorDashboard from './components/InvestorDashboard';
import PerformanceOverlay from './components/PerformanceOverlay';
import DraggablePanel from './components/DraggablePanel';
import useStore from './store/useStore';
import './App.css';

function App() {
  const { selectedProperty, isInvestorMode, setInvestorMode } = useStore();

  const handleCityIntelligence = () => {
    // Custom event to trigger Cesium camera move
    window.dispatchEvent(new CustomEvent('city-overview'));
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'rgba(10, 25, 41, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar variant="dense">
          <IconButton edge="start" color="primary" sx={{ mr: 2 }}>
            <TravelExplore />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
            TERRASCOPE <span style={{ color: '#2196f3' }}>3D</span>
          </Typography>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Analytics />}
            onClick={handleCityIntelligence}
            sx={{ mr: 2, color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            CITY INTELLIGENCE
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={isInvestorMode}
                onChange={(e) => setInvestorMode(e.target.checked)}
                color="primary"
              />
            }
            label={<Typography variant="button" sx={{ color: 'white' }}>INVESTOR MODE</Typography>}
          />
        </Toolbar>
      </AppBar>

      {/* Main Layout */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Cesium Background */}
        <CesiumViewer />

        {/* Overlay Legend */}
        <HeatmapOverlay />

        {/* Draggable Panels */}
        
        {/* Left Side: Filters & Layer Controls */}
        <DraggablePanel 
          id="filters"
          title="Refine Search" 
          initialPos={{ x: 20, y: 70 }}
          width={320}
        >
          <Filters />
        </DraggablePanel>

        <DraggablePanel 
          id="layers"
          title="Visual Layers" 
          initialPos={{ x: 20, y: 400 }}
          width={320}
        >
          <LayerControls />
        </DraggablePanel>

        {/* Investor Dashboard Overlay */}
        {isInvestorMode && (
          <DraggablePanel 
            id="investor"
            title="Enterprise Intelligence" 
            initialPos={{ x: window.innerWidth - 340, y: 70 }}
            width={320}
          >
            <InvestorDashboard />
          </DraggablePanel>
        )}

        {/* Performance & Metrics Overlay */}
        <PerformanceOverlay />

        {/* Sidebar Right: Property Details (Now Draggable) */}
        {selectedProperty && (
          <DraggablePanel 
            id="property"
            title="Property Info" 
            initialPos={{ x: window.innerWidth - 340, y: 350 }}
            width={320}
          >
            <PropertyPanel />
          </DraggablePanel>
        )}

        <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>
                POWERED BY TERRASCOPE SPATIAL INTELLIGENCE ENGINE
            </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
