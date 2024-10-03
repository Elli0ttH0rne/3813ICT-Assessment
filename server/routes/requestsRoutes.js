const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');

router.get('/', requestsController.getAllRequests);
router.post('/', requestsController.createRequest);

module.exports = router;
