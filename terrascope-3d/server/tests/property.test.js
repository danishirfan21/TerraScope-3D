const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const propertyRoutes = require('../routes/propertyRoutes');

const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

describe('Property API', () => {
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
