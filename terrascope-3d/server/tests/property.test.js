const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Property = require('../models/Property');
const propertyRoutes = require('../routes/propertyRoutes');

const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

describe('Property API', () => {
    let mongod;

    before(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);

        // Seed test data
        await Property.create({
            _id: '642b5a1f4b3d1c2d8c8e1234', // Explicit ID for testing
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[ [0,0], [0,1], [1,1], [1,0], [0,0] ]] },
            properties: { address: 'Test 1', price: 100, height: 10, yearBuilt: 2000 }
        });
    });

    after(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });

    it('should GET all properties', async () => {
        const res = await request(app).get('/api/properties');
        expect(res.statusCode).to.equal(200);
        expect(res.body.type).to.equal('FeatureCollection');
        expect(res.body.features).to.be.an('array');
    });

    it('should GET a property by id', async () => {
        const res = await request(app).get('/api/properties/642b5a1f4b3d1c2d8c8e1234');
        expect(res.statusCode).to.equal(200);
        expect(res.body.properties.address).to.equal('Test 1');
    });

    it('should return 404 for non-existent property', async () => {
        const res = await request(app).get('/api/properties/642b5a1f4b3d1c2d8c8effff');
        expect(res.statusCode).to.equal(404);
    });
});
