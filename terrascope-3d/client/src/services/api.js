import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Enterprise Service Layer for Spatial Data Fetching
 *
 * This module abstracts all backend communication.
 * Performance Note: We use Axios for robust interceptor support and
 * automatic JSON parsing.
 */
const api = {
    /**
     * Fetches properties with spatial (BBOX) and attribute filtering.
     * @param {Object} params - { bbox, minPrice, maxPrice, search, impute }
     * BBOX optimization: Fetches only features within the current viewport
     * to prevent browser memory saturation with large datasets.
     */
    getProperties: async (params = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/properties`, {
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    },
    getPropertyById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching property ${id}:`, error);
            throw error;
        }
    },
    getCityAnalytics: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/properties/analytics/city`);
            return response.data;
        } catch (error) {
            console.error('Error fetching city analytics:', error);
            throw error;
        }
    }
};

export default api;
