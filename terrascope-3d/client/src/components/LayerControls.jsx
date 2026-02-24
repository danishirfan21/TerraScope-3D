import React from 'react';
import {
    Box,
    Typography,
    FormControlLabel,
    Switch,
    FormGroup
} from '@mui/material';
import {
    Layers,
    Public,
    Business,
    Map,
    Label,
    Terrain,
    Streetview
} from '@mui/icons-material';
import useStore from '../store/useStore';

const LayerControls = () => {
    const { layers, toggleLayer } = useStore();

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Layers sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Map Layers
                </Typography>
            </Box>

            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={layers.satellite}
                            onChange={() => toggleLayer('satellite')}
                            color="primary"
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Public sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">Satellite Imagery</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={layers.buildings}
                            onChange={() => toggleLayer('buildings')}
                            color="primary"
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Business sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">3D Properties</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={layers.heatmap}
                            onChange={() => toggleLayer('heatmap')}
                            color="primary"
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Map sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">Price Heatmap</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={layers.osmBuildings}
                            onChange={() => toggleLayer('osmBuildings')}
                            color="primary"
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Business sx={{ fontSize: 18, mr: 1, color: 'text.secondary', opacity: 0.7 }} />
                            <Typography variant="body2">OSM Buildings</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={layers.labels}
                            onChange={() => toggleLayer('labels')}
                            color="primary"
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Label sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">Street Labels</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={layers.terrain}
                            onChange={() => toggleLayer('terrain')}
                            color="primary"
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Terrain sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">3D Terrain</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={layers.street}
                            onChange={() => toggleLayer('street')}
                            color="primary"
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Streetview sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">Street Map</Typography>
                        </Box>
                    }
                />
            </FormGroup>
        </Box>
    );
};

export default LayerControls;
