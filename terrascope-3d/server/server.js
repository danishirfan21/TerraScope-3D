const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertyRoutes);

// Connect to MongoDB
const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        if (!uri && process.env.NODE_ENV !== 'production') {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            console.log('Using MongoMemoryServer at:', uri);
        }

        if (uri) {
            await mongoose.connect(uri);
            console.log('MongoDB Connected');

            // Seed if memory server or explicitly requested
            if (!process.env.MONGODB_URI || process.env.SEED_DATA === 'true') {
                const Property = require('./models/Property');
                const count = await Property.countDocuments();
                if (count === 0) {
                    const mockData = [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4194, 37.7749], [-122.4194, 37.7752],
                                    [-122.4191, 37.7752], [-122.4191, 37.7749],
                                    [-122.4194, 37.7749]
                                ]]
                            },
                            properties: {
                                address: '123 Market St',
                                price: 1200000, height: 20, yearBuilt: 1995,
                                owner: 'John Doe', landUse: 'Residential'
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4189, 37.7749], [-122.4189, 37.7752],
                                    [-122.4186, 37.7752], [-122.4186, 37.7749],
                                    [-122.4189, 37.7749]
                                ]]
                            },
                            properties: {
                                address: '125 Market St',
                                price: 2500000, height: 45, yearBuilt: 2010,
                                owner: 'Jane Smith', landUse: 'Commercial'
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4194, 37.7745], [-122.4194, 37.7748],
                                    [-122.4191, 37.7748], [-122.4191, 37.7745],
                                    [-122.4194, 37.7745]
                                ]]
                            },
                            properties: {
                                address: '127 Market St',
                                price: 800000, height: 15, yearBuilt: 1985,
                                owner: 'Alice Brown', landUse: 'Residential'
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4189, 37.7745], [-122.4189, 37.7748],
                                    [-122.4186, 37.7748], [-122.4186, 37.7745],
                                    [-122.4189, 37.7745]
                                ]]
                            },
                            properties: {
                                address: '129 Market St',
                                price: 4200000, height: 65, yearBuilt: 2021,
                                owner: 'Tech Global', landUse: 'Commercial'
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4199, 37.7749], [-122.4199, 37.7752],
                                    [-122.4196, 37.7752], [-122.4196, 37.7749],
                                    [-122.4199, 37.7749]
                                ]]
                            },
                            properties: {
                                address: '121 Market St',
                                price: 1800000, height: 30, yearBuilt: 2005,
                                owner: 'Heritage Group', landUse: 'Residential'
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4204, 37.7749], [-122.4204, 37.7752],
                                    [-122.4201, 37.7752], [-122.4201, 37.7749],
                                    [-122.4204, 37.7749]
                                ]]
                            },
                            properties: {
                                address: '119 Market St',
                                price: null, height: 25, yearBuilt: 1990,
                                owner: 'Unknown', landUse: 'Residential'
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4209, 37.7749], [-122.4209, 37.7752],
                                    [-122.4206, 37.7752], [-122.4206, 37.7749],
                                    [-122.4209, 37.7749]
                                ]]
                            },
                            properties: {
                                address: '117 Market St',
                                price: 1500000, height: null, yearBuilt: null,
                                owner: 'Private Owner', landUse: 'Residential'
                            }
                        }
                    ];
                    await Property.insertMany(mockData);
                    console.log('Database Seeded with extended demo data');
                }
            }
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TerraScope 3D Server is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
