import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Chip,
    Paper
} from '@mui/material';
import {
    LocationOn,
    AttachMoney,
    Home,
    CalendarToday,
    Person,
    Terrain
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const PropertyPanel = ({ selectedProperty }) => {
    if (!selectedProperty) {
        return (
            <Box sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    Select a property on the map to view details
                </Typography>
            </Box>
        );
    }

    const data = [
        { name: 'Height', value: selectedProperty.height },
        { name: 'Age', value: 2024 - selectedProperty.yearBuilt },
        { name: 'Price ($M)', value: selectedProperty.price / 1000000 }
    ];

    return (
        <Paper elevation={0} sx={{
            height: '100%',
            overflowY: 'auto',
            background: 'transparent',
            color: 'white'
        }}>
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Property Info
                </Typography>
                <Chip
                    label={selectedProperty.landUse}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">{selectedProperty.address}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6">${selectedProperty.price?.toLocaleString()}</Typography>
                </Box>

                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Height</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Terrain sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">{selectedProperty.height}m</Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Year Built</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">{selectedProperty.yearBuilt}</Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Owner</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">{selectedProperty.owner}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Typography variant="subtitle2" gutterBottom>Market Analytics</Typography>
                <Box sx={{ width: '100%', height: 200, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#fff" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0a1929', border: 'none' }}
                                itemStyle={{ color: '#2196f3' }}
                            />
                            <Bar dataKey="value" fill="#2196f3" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Paper>
    );
};

export default PropertyPanel;
