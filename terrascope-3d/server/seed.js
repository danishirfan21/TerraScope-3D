const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

const properties = [
    {
        type: 'Feature',
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
            address: '125 Market St',
            price: 2500000,
            height: 45,
            yearBuilt: 2010,
            owner: 'Jane Smith',
            landUse: 'Commercial'
        }
    },
    {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [-122.4184, 37.7749],
                [-122.4184, 37.7752],
                [-122.4181, 37.7752],
                [-122.4181, 37.7749],
                [-122.4184, 37.7749]
            ]]
        },
        properties: {
            address: '127 Market St',
            price: 800000,
            height: 10,
            yearBuilt: 1950,
            owner: 'Bob Brown',
            landUse: 'Residential'
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/terrascope');
        await Property.deleteMany({});
        await Property.insertMany(properties);
        console.log('Database Seeded!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
