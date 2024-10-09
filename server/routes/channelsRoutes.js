const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channelsController');
const multer = require('multer');
const path = require('path');

// Multer configuration for storing message images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/messages'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
  
const upload = multer({ storage });

// Route to get all channels by group name
router.get('/group/:groupName', channelsController.getChannelsByGroupName);

// Route to delete a channel by group name and channel name
router.delete('/:groupName/:channelName', channelsController.deleteChannel);

// Route to create a new channel
router.post('/', channelsController.createChannel);

// Route to get all chat messages for a channel
router.get('/:groupName/:channelName/messages', channelsController.getChannelMessages);

// Route to handle adding a message (with optional image)
router.post('/:groupName/:channelName/messages', upload.single('image'), channelsController.addChannelMessage);

// Route to delete a specific chat message from a channel
router.delete('/messages/:groupName/:channelName/:messageId', channelsController.deleteChannelMessage);

module.exports = router;
