import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, IconButton, Tooltip, CircularProgress, List, ListItem, ListItemText, Button } from '@mui/material';
import { Stars, Explore, InfoOutlined } from '@mui/icons-material';
import useStore from '../store/useStore';

const InvestorDashboard = () => {
    const {
        cityStats,
        marketMomentum,
        topOpportunities,
        setSelectedProperty,
        isInvestorMode,
        properties
    } = useStore();

    if (!isInvestorMode) return null;

    return (
        <Box className="investor-dashboard fade-in" sx={{ width: '100%' }}>
            {/* KPI Section */}
            <Paper className="glass-effect" sx={{ p: 2, mb: 1, border: 'none', background: 'transparent !important', boxShadow: 'none !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0 }}>
                    <Box>
                        <Typography variant="h4" color="white" data-testid="property-count">
                            <CountUp val={cityStats.propertyCount || properties.length} />
                        </Typography>
                        <Typography variant="caption" color="gray">Property Count</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h4" color="#4caf50" data-testid="market-value">
                            $<CountUp val={Math.round((cityStats.totalMarketValue || 1250000000) / 1000000)} />M
                        </Typography>
                        <Typography variant="caption" color="gray">Market Value</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Momentum Gauge */}
            <Paper className="glass-effect" sx={{ p: 2, mb: 1, textAlign: 'center', border: 'none', background: 'transparent !important', boxShadow: 'none !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="white">MARKET MOMENTUM</Typography>
                    <Tooltip title="Derived from avg appreciation, transaction volume, and density growth.">
                        <InfoOutlined sx={{ fontSize: 14, ml: 1, color: 'gray' }} />
                    </Tooltip>
                </Box>

                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        variant="determinate"
                        value={marketMomentum}
                        size={60}
                        thickness={5}
                        sx={{ color: marketMomentum > 70 ? '#4caf50' : marketMomentum > 40 ? '#ff9800' : '#f44336' }}
                    />
                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" component="div" color="white" sx={{ fontSize: '0.9rem' }}>{marketMomentum}</Typography>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1, color: marketMomentum > 70 ? '#4caf50' : 'gray', fontSize: '0.8rem' }}>
                    {marketMomentum > 70 ? 'High Growth Phase' : 'Steady Market'}
                </Typography>
            </Paper>

            {/* Top 5 Opportunities */}
            <Paper className="glass-effect" sx={{ p: 2, border: 'none', background: 'transparent !important', boxShadow: 'none !important' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#ffeb3b', fontSize: '0.8rem' }}>
                    <Stars sx={{ mr: 1, fontSize: 16 }} /> TOP OPPORTUNITIES
                </Typography>
                <Divider sx={{ mb: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

                <List dense sx={{ maxHeight: 150, overflowY: 'auto' }}>
                    {topOpportunities.map((op, idx) => (
                        <ListItem
                            key={idx}
                            className="opportunity-item"
                            sx={{ px: 0, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                            secondaryAction={
                                <IconButton edge="end" size="small" color="primary" onClick={() => setSelectedProperty(op)}>
                                    <Explore sx={{ fontSize: 16 }} />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={op.address}
                                secondary={`ROI: ${((op.yield || 0) * 100).toFixed(1)}% | Score: ${Math.round(op.investmentScore)}`}
                                primaryTypographyProps={{ color: 'white', variant: 'caption', noWrap: true }}
                                secondaryTypographyProps={{ color: 'gray', variant: 'caption', sx: { fontSize: '0.7rem' } }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

const CountUp = ({ val }) => {
    const [displayVal, setDisplayVal] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = val;
        if (start === end) {
            setDisplayVal(end);
            return;
        }
        let timer = setInterval(() => {
            start += Math.ceil(end / 20);
            if (start >= end) {
                setDisplayVal(end);
                clearInterval(timer);
            } else {
                setDisplayVal(start);
            }
        }, 50);
        return () => clearInterval(timer);
    }, [val]);
    return <span>{displayVal.toLocaleString()}</span>;
};

export default InvestorDashboard;
