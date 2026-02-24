import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Chip,
    Paper,
    Tooltip,
    Alert
} from '@mui/material';
import {
    LocationOn,
    AttachMoney,
    Home,
    CalendarToday,
    Person,
    Terrain,
    InfoOutlined
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';

const PropertyPanel = ({ selectedProperty }) => {
    const isImputed = (field) => {
        return selectedProperty?.['_imputedFields']?.includes(field);
    };

    const renderValue = (field, value, formatter = (v) => v) => {
        const imputed = isImputed(field);
        if (value == null && !imputed) return 'N/A';

        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontStyle: imputed ? 'italic' : 'normal', color: imputed ? 'primary.light' : 'inherit' }}>
                    {formatter(value)}
                </Typography>
                {imputed && (
                    <Tooltip title="This value was missing and has been estimated (imputed) based on dataset averages.">
                        <InfoOutlined sx={{ fontSize: 14, ml: 0.5, color: 'primary.light' }} />
                    </Tooltip>
                )}
            </Box>
        );
    };

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
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                        <Typography variant="h6">
                            {selectedProperty.price != null || isImputed('price')
                                ? `$${selectedProperty.price?.toLocaleString()}`
                                : 'Price N/A'}
                        </Typography>
                        {isImputed('price') && (
                            <Tooltip title="Estimated Price">
                                <InfoOutlined sx={{ fontSize: 16, ml: 1, color: 'primary.light' }} />
                            </Tooltip>
                        )}
                    </Box>
                </Box>

                {selectedProperty['_imputedFields']?.length > 0 && (
                    <Alert severity="info" sx={{ py: 0, px: 1, mb: 2, background: 'rgba(33, 150, 243, 0.1)', color: '#90caf9', '& .MuiAlert-icon': { color: '#90caf9' } }}>
                        Contains estimated data
                    </Alert>
                )}

                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Height</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Terrain sx={{ fontSize: 16, mr: 0.5, opacity: 0.7 }} />
                            {renderValue('height', selectedProperty.height, (v) => `${v}m`)}
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Year Built</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ fontSize: 16, mr: 0.5, opacity: 0.7 }} />
                            {renderValue('yearBuilt', selectedProperty.yearBuilt)}
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
                            <RechartsTooltip
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
