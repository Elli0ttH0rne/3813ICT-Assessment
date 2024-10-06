const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');

// Route to create a new request
router.post('/', requestsController.createRequest);

// Route to get all requests
router.get('/', requestsController.getAllRequests);

// Route to get requests by type
router.get('/type', requestsController.getRequestsByType);

// Route to update request status by ID
router.patch('/:id', requestsController.updateRequestStatus);

// Route to delete a request by details (username, groupName, typeOfRequest)
router.delete('/', requestsController.deleteRequest);

// Route to remove pending requests by group
router.delete('/group/:groupName', requestsController.removePendingRequestsByGroup);

// Route to remove pending requests by username
router.delete('/user/:username', requestsController.removePendingRequestsByUsername);

module.exports = router;
