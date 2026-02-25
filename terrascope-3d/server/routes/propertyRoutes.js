const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.get('/', propertyController.getAllProperties);
router.get('/analytics/city', propertyController.getCityAnalytics);
router.get('/:id', propertyController.getPropertyById);

module.exports = router;
