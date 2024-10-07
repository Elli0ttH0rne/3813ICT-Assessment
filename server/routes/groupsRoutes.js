const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController');

// Route to get all groups
router.get('/', groupsController.getAllGroups);

// Route to get details of a specific group by its name
router.get('/:groupName', groupsController.getGroupDetails);

// Route to create a new group
router.post('/', groupsController.createGroup);

// Route to delete a specific group by its name
router.delete('/:groupName', groupsController.deleteGroup);


// Route to add a group to a user's group array
router.patch('/add-group-to-user/:username', groupsController.addGroupToUser);

// Route to leave a group
router.post('/:groupName/leave', groupsController.leaveGroup);

// Route to get users in a specific group
router.get('/:groupName/users', groupsController.getUsersInGroup);

// Route to get admins of a specific group
router.get('/:groupName/admins', groupsController.getGroupAdmins);

// Route to remove a user from a group
router.delete('/groups/:groupName/users/:username', groupsController.removeUserFromGroup);

module.exports = router;
