import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Paper, IconButton, Typography, Collapse } from '@mui/material';
import { DragIndicator, Remove, Add, Close } from '@mui/icons-material';

const DraggablePanel = ({ 
    children, 
    title, 
    initialPos = { x: 20, y: 20 }, 
    width = 320, 
    onClose,
    id
}) => {
    const [position, setPosition] = useState(initialPos);
    const [isDragging, setIsDragging] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        // Only drag from the header
        if (e.target.closest('.drag-handle')) {
            setIsDragging(true);
            const rect = dragRef.current.getBoundingClientRect();
            offsetRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            e.preventDefault();
        }
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        const newX = e.clientX - offsetRef.current.x;
        const newY = e.clientY - offsetRef.current.y;

        // Boundary checks (keep within viewport)
        const maxX = window.innerWidth - (isMinimized ? 200 : width) - 20;
        const maxY = window.innerHeight - 60;

        setPosition({
            x: Math.max(10, Math.min(newX, maxX)),
            y: Math.max(70, Math.min(newY, maxY)) // 70 to stay below header
        });
    }, [isDragging, isMinimized, width]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove]);

    return (
        <Box
            ref={dragRef}
            sx={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: isMinimized ? 200 : width,
                zIndex: 1100,
                transition: isDragging ? 'none' : 'width 0.3s ease-in-out, height 0.3s ease-in-out',
                pointerEvents: 'auto'
            }}
        >
            <Paper 
                className="glass-effect"
                sx={{ 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '85vh',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
                }}
            >
                {/* Header / Drag Handle */}
                <Box 
                    className="drag-handle"
                    onMouseDown={handleMouseDown}
                    sx={{ 
                        p: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        userSelect: 'none'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DragIndicator sx={{ fontSize: 18, mr: 1, color: 'rgba(255,255,255,0.3)' }} />
                        <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'primary.light', lineHeight: 1.2 }}>
                            {title}
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton size="small" onClick={() => setIsMinimized(!isMinimized)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {isMinimized ? <Add fontSize="small" /> : <Remove fontSize="small" />}
                        </IconButton>
                        {onClose && (
                            <IconButton size="small" onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                <Close fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                {/* Content */}
                <Collapse in={!isMinimized}>
                    <Box sx={{ overflowY: 'auto', p: 0 }}>
                        {children}
                    </Box>
                </Collapse>
            </Paper>
        </Box>
    );
};

export default DraggablePanel;
