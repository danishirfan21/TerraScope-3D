import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import useStore from '../store/useStore';

const HeatmapOverlay = () => {
    const { layers } = useStore();

    if (!layers.heatmap) return null;

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'absolute',
                bottom: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                p: 1.5,
                borderRadius: 2,
                background: 'rgba(10, 25, 41, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                zIndex: 1000,
                width: 300
            }}
        >
            <Typography variant="caption" display="block" align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
                Property Value Intensity ($)
            </Typography>
            <Box
                sx={{
                    height: 10,
                    width: '100%',
                    background: 'linear-gradient(to right, #4caf50, #ff9800, #f44336)',
                    borderRadius: 5,
                    mb: 0.5
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">&lt; $1M</Typography>
                <Typography variant="caption" color="textSecondary">$1M - $2M</Typography>
                <Typography variant="caption" color="textSecondary">&gt; $2M</Typography>
            </Box>
        </Paper>
    );
};

export default HeatmapOverlay;
