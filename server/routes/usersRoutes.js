const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Route to get all users
router.get('/', usersController.getAllUsers);

// Route to add a new user
router.post('/', usersController.addUser);

// Route to save updated list of users
router.put('/save', usersController.saveUsers);

// Delete user by username
router.delete('/username/:username', usersController.deleteUserByUsername);

// Route to get all super admins
router.get('/superAdmins', usersController.getSuperAdmins);

// Route to promote a user to group admin
router.post('/promote/groupAdmin', usersController.promoteToGroupAdmin);

// Route to promote a user to super admin
router.post('/promote/superAdmin', usersController.promoteToSuperAdmin);

module.exports = router;
