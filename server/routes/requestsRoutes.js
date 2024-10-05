const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');

// Route to create a new request
router.post('/', requestsController.createRequest);

// Route to get all requests
router.get('/', requestsController.getAllRequests);

module.exports = router;
