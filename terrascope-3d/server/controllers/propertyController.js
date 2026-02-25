const Property = require('../models/Property');

exports.getAllProperties = async (req, res) => {
    try {
        let properties = await Property.find();
        const shouldImpute = req.query.impute === 'true';

        if (shouldImpute && properties.length > 0) {
            // Calculate means for numeric fields
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

            // Apply imputation
            properties = properties.map(p => {
                const plainP = p.toObject();
                const props = plainP.properties;
                const imputedFields = [];

                if (props.price == null) {
                    props.price = means.price;
                    imputedFields.push('price');
                }
                if (props.height == null) {
                    props.height = means.height;
                    imputedFields.push('height');
                }
                if (props.yearBuilt == null) {
                    props.yearBuilt = means.yearBuilt;
                    imputedFields.push('yearBuilt');
                }

                if (imputedFields.length > 0) {
                    props._imputedFields = imputedFields;
                }

                return plainP;
            });
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
