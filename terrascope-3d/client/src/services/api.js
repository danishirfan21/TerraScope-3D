import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
    getProperties: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/properties`);
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
    }
};

export default api;
