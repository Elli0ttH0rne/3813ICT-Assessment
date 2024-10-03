const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController');

router.get('/', groupsController.getAllGroups);
router.get('/:groupName', groupsController.getGroupDetails);
router.post('/', groupsController.createGroup);
router.delete('/:groupName', groupsController.deleteGroup);

module.exports = router;
