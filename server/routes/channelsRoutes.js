const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channelsController');

// Route to add a new channel
router.post('/', channelsController.addChannel);

// Route to get all channels by group name
router.get('/group/:groupName', channelsController.getChannelsByGroupName);

module.exports = router;
