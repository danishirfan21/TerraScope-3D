const Property = require('../models/Property');

exports.getAllProperties = async (req, res) => {
    try {
        const { bbox, minPrice, maxPrice, search } = req.query;
        let query = {};

        /**
         * 1. Spatial Filtering (BBOX Strategy)
         * Instead of loading the entire city, we use a Bounding Box query.
         * This leverages the MongoDB 2dsphere index to filter thousands
         * of buildings down to just the visible region, significantly
         * reducing payload size and client-side processing.
         */
        if (bbox) {
            const [west, south, east, north] = bbox.split(',').map(Number);
            // GeoJSON Polygon for search
            query.geometry = {
                $geoWithin: {
                    $geometry: {
                        type: "Polygon",
                        coordinates: [[
                            [west, south],
                            [east, south],
                            [east, north],
                            [west, north],
                            [west, south]
                        ]]
                    }
                }
            };
        }

        // 2. Attribute Filtering
        if (minPrice || maxPrice) {
            query['properties.price'] = {};
            if (minPrice) query['properties.price'].$gte = Number(minPrice);
            if (maxPrice) query['properties.price'].$lte = Number(maxPrice);
        }

        if (search) {
            query['properties.address'] = { $regex: search, $options: 'i' };
        }

        let properties = await Property.find(query).limit(2000);

        // 3. Imputation logic
        if (req.query.impute === 'true') {
            properties = imputeData(properties);
        }

        res.json({ type: 'FeatureCollection', features: properties });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCityAnalytics = async (req, res) => {
    try {
        const stats = await Property.aggregate([
            {
                $group: {
                    _id: null,
                    totalMarketValue: { $sum: "$properties.price" },
                    avgROI: { $avg: "$properties.yield" },
                    propertyCount: { $sum: 1 },
                    avgPrice: { $avg: "$properties.price" }
                }
            }
        ]);

        res.json(stats[0] || { totalMarketValue: 0, avgROI: 0, propertyCount: 0, avgPrice: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function imputeData(properties) {
    const sums = { price: 0, height: 0, yearBuilt: 0 };
    const counts = { price: 0, height: 0, yearBuilt: 0 };

    properties.forEach(p => {
        const props = p.properties;
        if (props.price != null) { sums.price += props.price; counts.price++; }
        if (props.height != null) { sums.height += props.height; counts.height++; }
        if (props.yearBuilt != null) { sums.yearBuilt += props.yearBuilt; counts.yearBuilt++; }
    });

    const means = {
        price: counts.price > 0 ? Math.round(sums.price / counts.price) : 0,
        height: counts.height > 0 ? Math.round(sums.height / counts.height) : 10,
        yearBuilt: counts.yearBuilt > 0 ? Math.round(sums.yearBuilt / counts.yearBuilt) : 2000
    };

    return properties.map(p => {
        const plainP = p.toObject();
        const props = plainP.properties;
        if (props.price == null) props.price = means.price;
        if (props.height == null) props.height = means.height;
        if (props.yearBuilt == null) props.yearBuilt = means.yearBuilt;
        return plainP;
    });
}
