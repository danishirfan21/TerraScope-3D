const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Feature'],
        default: 'Feature'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true
        },
        coordinates: {
            type: [[[Number]]],
            required: true
        }
    },
    properties: {
        address: String,
        price: Number,
        height: Number,
        yearBuilt: Number,
        owner: String,
        landUse: {
            type: String,
            enum: ['Residential', 'Commercial', 'Industrial', 'Mixed-Use', 'Public'],
            default: 'Residential'
        },
        // Investment Intelligence Fields
        yield: Number,           // Annual rental yield (0.02 - 0.08)
        appreciationRate: Number, // Expected annual appreciation (0.01 - 0.12)
        zoningRisk: Number       // Risk factor (0.0 - 1.0)
    },
    investmentScore: Number // Calculated field for performance
});

/**
 * Geospatial Indexing: 2dsphere
 * Vital for production scalability. This allows MongoDB to perform
 * O(log n) spatial queries (BBOX, proximity) rather than O(n) scans
 * over thousands of entities.
 */
propertySchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);
