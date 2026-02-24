import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { Analytics, TrendingUp, HomeWork } from '@mui/icons-material';
import useStore from '../store/useStore';

const StatsPanel = () => {
    const { properties, filters } = useStore();

    if (!properties || properties.length === 0) return null;

    // Apply same filtering logic as CesiumViewer
    const filteredProperties = properties.filter(p => {
        const props = p.properties;
        return props.price >= filters.minPrice &&
               props.price <= filters.maxPrice &&
               (filters.searchQuery === '' ||
                props.address.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    });

    if (filteredProperties.length === 0) {
        return (
            <Paper
                elevation={0}
                className="glass-effect"
                sx={{ p: 2, color: 'white', width: '100%' }}
            >
                <Typography variant="body2" color="textSecondary">
                    No properties match the current filters.
                </Typography>
            </Paper>
        );
    }

    const totalProperties = filteredProperties.length;
    const avgPrice = filteredProperties.reduce((acc, curr) => acc + curr.properties.price, 0) / totalProperties;
    const avgHeight = filteredProperties.reduce((acc, curr) => acc + curr.properties.height, 0) / totalProperties;

    return (
        <Paper
            elevation={0}
            className="glass-effect"
            sx={{
                p: 2,
                color: 'white',
                width: '100%'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Analytics sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Market Overview
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeWork sx={{ fontSize: 16, mr: 0.5, opacity: 0.7 }} />
                    <Typography variant="body2" color="textSecondary">Total Properties</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{totalProperties}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5, opacity: 0.7 }} />
                    <Typography variant="body2" color="textSecondary">Avg. Price</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ${Math.round(avgPrice).toLocaleString()}
                </Typography>
            </Box>

            <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />

            <Typography variant="caption" color="textSecondary">
                Data based on current map selection and active filters.
            </Typography>
        </Paper>
    );
};

export default StatsPanel;
