import React from 'react';
import {
    Box,
    Typography,
    Slider,
    TextField,
    InputAdornment,
    Paper
} from '@mui/material';
import { Search } from '@mui/icons-material';
import useStore from '../store/useStore';

const Filters = () => {
    const { filters, updateFilters } = useStore();

    const handlePriceChange = (event, newValue) => {
        updateFilters({ minPrice: newValue[0], maxPrice: newValue[1] });
    };

    const handleSearchChange = (event) => {
        updateFilters({ searchQuery: event.target.value });
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Refine Search
            </Typography>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search address..."
                    value={filters.searchQuery}
                    onChange={handleSearchChange}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                        }
                    }}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Price Range ($)
                </Typography>
                <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5000000}
                    step={100000}
                    sx={{ color: 'primary.main' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="textSecondary">
                        ${(filters.minPrice / 1000).toLocaleString()}k
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        ${(filters.maxPrice / 1000000).toLocaleString()}M
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Filters;
