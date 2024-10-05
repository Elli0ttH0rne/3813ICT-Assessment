const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController');

// Route to get all groups
router.get('/', groupsController.getAllGroups);

// Route to get details of a specific group by its name
router.get('/:groupName', groupsController.getGroupDetails);

// Route to get the channels of a group
router.get('/:groupName/channels', groupsController.getGroupChannels);

// Route to create a new group
router.post('/', groupsController.createGroup);

// Route to leave a group
router.post('/:groupName/leave', groupsController.leaveGroup);

// Route to delete a specific group by its name
router.delete('/:groupName', groupsController.deleteGroup);

module.exports = router;
