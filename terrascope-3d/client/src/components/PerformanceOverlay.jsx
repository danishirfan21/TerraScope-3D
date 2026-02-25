import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import useStore from '../store/useStore';

const PerformanceOverlay = () => {
    const { properties } = useStore();
    const [fps, setFps] = useState(0);
    const [show, setShow] = useState(false);

    // Use refs for frame counting to avoid triggering React re-renders on every single frame.
    const framesRef = React.useRef(0);
    const lastTimeRef = React.useRef(performance.now());

    useEffect(() => {
        // Only show if debug param is present
        if (window.location.search.includes('debug=true')) {
            setShow(true);
        }

        let frameId;
        const tick = () => {
            framesRef.current++;
            const now = performance.now();

            // Update the display state only once per second
            if (now >= lastTimeRef.current + 1000) {
                setFps(Math.round((framesRef.current * 1000) / (now - lastTimeRef.current)));
                lastTimeRef.current = now;
                framesRef.current = 0;
            }
            frameId = requestAnimationFrame(tick);
        };

        if (show || window.location.search.includes('debug=true')) {
            frameId = requestAnimationFrame(tick);
        }

        return () => cancelAnimationFrame(frameId);
    }, [show]);

    if (!show) return null;

    return (
        <Paper
            sx={{
                position: 'absolute',
                bottom: 100,
                left: 20,
                p: 1.5,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#00ff00',
                fontFamily: 'monospace',
                zIndex: 2000,
                border: '1px solid #00ff00'
            }}
        >
            <Typography variant="caption" display="block">SYSTEM PERFORMANCE</Typography>
            <Divider sx={{ my: 0.5, borderColor: '#00ff00' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 150 }}>
                <Typography variant="caption">FPS:</Typography>
                <Typography variant="caption">{fps}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">ENTITIES:</Typography>
                <Typography variant="caption">{properties.length}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">RENDER MODE:</Typography>
                <Typography variant="caption">EXPLICIT</Typography>
            </Box>
        </Paper>
    );
};

const Divider = ({ sx, ...props }) => <Box sx={{ borderBottom: '1px solid', ...sx }} {...props} />;

export default PerformanceOverlay;
