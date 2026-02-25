import React from 'react';
import {
    Box,
    Typography,
    FormControlLabel,
    Switch,
    FormGroup,
    Divider
} from '@mui/material';
import {
    Layers,
    Public,
    Business,
    Map,
    Label,
    Terrain,
    FilterHdr,
    Domain,
    BarChart,
    Insights
} from '@mui/icons-material';
import useStore from '../store/useStore';

const LayerControls = () => {
    const { layers, toggleLayer } = useStore();

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Layers sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Visual Layers
                </Typography>
            </Box>

            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={layers.buildings} onChange={() => toggleLayer('buildings')} size="small" />}
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Domain sx={{ fontSize: 16, mr: 1, color: 'gray' }} />
                            <Typography variant="body2">3D Properties</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={<Switch checked={layers.satellite} onChange={() => toggleLayer('satellite')} size="small" />}
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Public sx={{ fontSize: 16, mr: 1, color: 'gray' }} />
                            <Typography variant="body2">Satellite View</Typography>
                        </Box>
                    }
                />

                <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.05)' }} />

                <FormControlLabel
                    control={<Switch checked={layers.heatmap} onChange={() => toggleLayer('heatmap')} size="small" />}
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Map sx={{ fontSize: 16, mr: 1, color: 'gray' }} />
                            <Typography variant="body2">Price Heatmap</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={<Switch checked={layers.zoning} onChange={() => toggleLayer('zoning')} size="small" />}
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BarChart sx={{ fontSize: 16, mr: 1, color: 'orange' }} />
                            <Typography variant="body2">Zoning Overlay</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={<Switch checked={layers.density} onChange={() => toggleLayer('density')} size="small" />}
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FilterHdr sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                            <Typography variant="body2">Density Growth</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={<Switch checked={layers.investmentScore} onChange={() => toggleLayer('investmentScore')} size="small" />}
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Insights sx={{ fontSize: 16, mr: 1, color: 'gold' }} />
                            <Typography variant="body2">Investment Score</Typography>
                        </Box>
                    }
                />
                <FormControlLabel
                    control={<Switch checked={layers.terrain} onChange={() => toggleLayer('terrain')} size="small" />}
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Terrain sx={{ fontSize: 16, mr: 1, color: 'gray' }} />
                            <Typography variant="body2">3D Terrain</Typography>
                        </Box>
                    }
                />
            </FormGroup>
        </Box>
    );
};

export default LayerControls;
