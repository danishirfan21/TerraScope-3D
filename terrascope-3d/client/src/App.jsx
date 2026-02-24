import React from 'react';
import { Box, Paper, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { TravelExplore } from '@mui/icons-material';
import CesiumViewer from './components/CesiumViewer';
import PropertyPanel from './components/PropertyPanel';
import LayerControls from './components/LayerControls';
import Filters from './components/Filters';
import HeatmapOverlay from './components/HeatmapOverlay';
import StatsPanel from './components/StatsPanel';
import useStore from './store/useStore';
import './App.css';

function App() {
  const { selectedProperty } = useStore();

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
        </Toolbar>
      </AppBar>

      {/* Main Layout */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Cesium Background */}
        <CesiumViewer />

        {/* Overlay Legend */}
        <HeatmapOverlay />

        {/* Sidebar Left: Controls & Filters */}
        <Box className="floating-panel left-panel">
          <Paper className="glass-effect" sx={{ mb: 2 }}>
            <Filters />
          </Paper>
          <Paper className="glass-effect" sx={{ mb: 2 }}>
            <LayerControls />
          </Paper>
          <StatsPanel />
        </Box>

        {/* Sidebar Right: Property Details */}
        <Box className="floating-panel right-panel">
          <Paper className="glass-effect" sx={{ height: '100%' }}>
            <PropertyPanel selectedProperty={selectedProperty} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
