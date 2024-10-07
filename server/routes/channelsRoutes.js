const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channelsController');

// Route to get all channels by group name
router.get('/group/:groupName', channelsController.getChannelsByGroupName);

// Route to delete a channel by group name and channel name
router.delete('/:groupName/:channelName', channelsController.deleteChannel);

// Route to create a new channel
router.post('/', channelsController.createChannel);

// Route to get all chat messages for a channel
router.get('/:groupName/:channelName/messages', channelsController.getChannelMessages);

// Route to add a new chat message to a channel
router.post('/:groupName/:channelName/messages', channelsController.addChannelMessage);

// Route to delete a specific chat message from a channel
router.delete('/messages/:groupName/:channelName/:messageId', channelsController.deleteChannelMessage);

module.exports = router;
