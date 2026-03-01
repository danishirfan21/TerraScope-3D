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
    Alert,
    Button
} from '@mui/material';
import {
    LocationOn,
    AttachMoney,
    Home,
    CalendarToday,
    Person,
    Terrain,
    InfoOutlined,
    TrackChanges
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import useStore from '../store/useStore';

const PropertyPanel = () => {
    const { selectedProperty, isInvestorMode } = useStore();
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

    const handleOrbit = () => {
        window.dispatchEvent(new CustomEvent('orbit-property', { detail: selectedProperty }));
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

                <Typography variant="subtitle2" gutterBottom>
                    {isInvestorMode ? 'INVESTMENT ANALYTICS' : 'MARKET ANALYTICS'}
                </Typography>

                <Box sx={{ width: '100%', height: 220, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {isInvestorMode ? (
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                { subject: 'ROI', A: Math.min(100, (selectedProperty.yield || 0) * 1000), fullMark: 100 },
                                { subject: 'Growth', A: Math.min(100, (selectedProperty.appreciationRate || 0) * 1000), fullMark: 100 },
                                { subject: 'Safety', A: Math.max(0, 100 - (selectedProperty.zoningRisk || 0) * 100), fullMark: 100 },
                                { subject: 'Density', A: Math.min(100, (selectedProperty.height || 0) / 2), fullMark: 100 },
                                { subject: 'Value', A: Math.min(100, (selectedProperty.price || 0) / 50000), fullMark: 100 },
                            ]}>
                                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                                <PolarAngleAxis dataKey="subject" stroke="#90caf9" fontSize={10} />
                                <Radar
                                    name="Asset Score"
                                    dataKey="A"
                                    stroke="#2196f3"
                                    fill="#2196f3"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        ) : (
                            <BarChart data={data}>
                                <XAxis dataKey="name" stroke="#fff" fontSize={12} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#0a1929', border: 'none' }}
                                    itemStyle={{ color: '#2196f3' }}
                                />
                                <Bar dataKey="value" fill="#2196f3" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<TrackChanges />}
                    onClick={handleOrbit}
                    sx={{
                        mt: 2,
                        mb: 2,
                        bgcolor: 'rgba(33, 150, 243, 0.2)',
                        '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.4)' }
                    }}
                >
                    Orbit Asset
                </Button>

                {isInvestorMode && selectedProperty.investmentScore && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1, border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" color="#4caf50">INVESTMENT SCORE</Typography>
                            <Typography variant="h5" color="#4caf50" sx={{ fontWeight: 'bold' }}>
                                {selectedProperty.investmentScore}
                            </Typography>
                         </Box>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default PropertyPanel;
