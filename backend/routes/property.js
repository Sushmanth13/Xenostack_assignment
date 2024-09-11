const express = require('express');
const Property = require('../models/Property');
const isAuthenticated = require('../middleware/auth.js');  // Import the middleware

const router = express.Router();

// Apply the middleware to all property routes
router.get('/', isAuthenticated, async (req, res) => {
    const properties = await Property.find();
    res.json(properties);
});

// Route to add new properties (protected)
router.post('/add', isAuthenticated, async (req, res) => {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json(newProperty);
});

module.exports = router;
