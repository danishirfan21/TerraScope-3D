const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Feature'],
        required: true
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
        landUse: String
    }
});

module.exports = mongoose.model('Property', propertySchema);
