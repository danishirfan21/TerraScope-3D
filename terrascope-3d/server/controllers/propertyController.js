const Property = require('../models/Property');

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.json({ type: 'FeatureCollection', features: properties });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findOne({ 'properties.id': req.params.id });
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
