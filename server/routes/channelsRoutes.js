const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channelsController');

// Route to get all channels by group name
router.get('/group/:groupName', channelsController.getChannelsByGroupName);

// Route to delete a channel by group name and channel name
router.delete('/:groupName/:channelName', channelsController.deleteChannel);

// Route to create a new channel
router.post('/', channelsController.createChannel);

module.exports = router;
