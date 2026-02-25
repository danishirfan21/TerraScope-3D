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

        {/* Investor Dashboard Overlay */}
        <InvestorDashboard />

        {/* Performance & Metrics Overlay */}
        <PerformanceOverlay />

        {/* Sidebar Left: Controls & Filters */}
        <Box className="floating-panel left-panel">
          <Paper className="glass-effect" sx={{ mb: 2 }}>
            <Filters />
          </Paper>
          <Paper className="glass-effect" sx={{ mb: 2 }}>
            <LayerControls />
          </Paper>
        </Box>

        {/* Sidebar Right: Property Details */}
        <Box className={`floating-panel right-panel ${selectedProperty ? 'visible' : ''}`} sx={{
          transform: selectedProperty ? 'translateX(0)' : 'translateX(120%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <Paper className="glass-effect" sx={{ width: 320, height: 'max-content', maxHeight: '80vh', overflow: 'hidden' }}>
            <PropertyPanel />
          </Paper>
        </Box>

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
