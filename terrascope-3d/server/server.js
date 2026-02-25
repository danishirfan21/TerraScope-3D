const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();
const PORT = process.env.PORT || 3001; // Changed to match client expectation or 5000

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

            // High-Density City Seeding (1200+ Buildings)
            const Property = require('./models/Property');
            const count = await Property.countDocuments();

            if (count < 1000) {
                console.log('🏗️  Generating High-Density City Dataset (San Francisco Grid)...');
                await Property.deleteMany({}); // Fresh start for demo

                const properties = [];
                const startLat = 37.770;
                const startLng = -122.430;
                const gridSize = 35; // 35x35 = 1225 buildings
                const spacing = 0.0008;

                for (let i = 0; i < gridSize; i++) {
                    for (let j = 0; j < gridSize; j++) {
                        const lat = startLat + (i * spacing);
                        const lng = startLng + (j * spacing);
                        const size = 0.0003;

                        const height = Math.floor(Math.random() * 80) + 10;
                        const landUse = ['Residential', 'Commercial', 'Mixed-Use', 'Industrial'][Math.floor(Math.random() * 4)];
                        const yield = 0.03 + (Math.random() * 0.05);
                        const appreciation = 0.02 + (Math.random() * 0.10);
                        const risk = Math.random() * 0.3;

                        properties.push({
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [lng, lat], [lng + size, lat],
                                    [lng + size, lat + size], [lng, lat + size],
                                    [lng, lat]
                                ]]
                            },
                            properties: {
                                address: `${Math.floor(Math.random() * 900) + 100} SF Intel St`,
                                price: Math.round((height * 100000) + (Math.random() * 500000)),
                                height,
                                yearBuilt: Math.floor(Math.random() * (2023 - 1920)) + 1920,
                                owner: 'Enterprise Assets LLC',
                                landUse,
                                yield,
                                appreciationRate: appreciation,
                                zoningRisk: risk
                            },
                            investmentScore: Math.round((yield * 400) + (appreciation * 400) + ((1 - risk) * 20))
                        });
                    }
                }
                await Property.insertMany(properties);
                console.log(`✅ Scalable Dataset Initialized: ${properties.length} properties seeded.`);
            }
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TerraScope 3D Enterprise Server is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
