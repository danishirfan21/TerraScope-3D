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
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [[ [0,0], [0,1], [1,1], [1,0], [0,0] ]] },
            properties: { id: 'prop1', address: 'Test 1', price: 100, height: 10, yearBuilt: 2000 }
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
        const res = await request(app).get('/api/properties/prop1');
        expect(res.statusCode).to.equal(200);
        expect(res.body.properties.id).to.equal('prop1');
    });

    it('should return 404 for non-existent property', async () => {
        const res = await request(app).get('/api/properties/nonexistent');
        expect(res.statusCode).to.equal(404);
    });
});
