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

            // Seed if memory server
            if (!process.env.MONGODB_URI) {
                const Property = require('./models/Property');
                const count = await Property.countDocuments();
                if (count === 0) {
                    const mockData = [
                        {
                            type: 'Feature',
                            id: 'prop1',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4194, 37.7749],
                                    [-122.4194, 37.7752],
                                    [-122.4191, 37.7752],
                                    [-122.4191, 37.7749],
                                    [-122.4194, 37.7749]
                                ]]
                            },
                            properties: {
                                id: 'prop1',
                                address: '123 Market St',
                                price: 1200000,
                                height: 20,
                                yearBuilt: 1995,
                                owner: 'John Doe',
                                landUse: 'Residential'
                            }
                        },
                        {
                            type: 'Feature',
                            id: 'prop2',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [-122.4189, 37.7749],
                                    [-122.4189, 37.7752],
                                    [-122.4186, 37.7752],
                                    [-122.4186, 37.7749],
                                    [-122.4189, 37.7749]
                                ]]
                            },
                            properties: {
                                id: 'prop2',
                                address: '125 Market St',
                                price: 2500000,
                                height: 45,
                                yearBuilt: 2010,
                                owner: 'Jane Smith',
                                landUse: 'Commercial'
                            }
                        }
                    ];
                    await Property.insertMany(mockData);
                    console.log('Memory DB Seeded');
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
