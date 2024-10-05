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

// Promote user to Group Admin
router.patch('/promote/groupAdmin/:username', usersController.promoteToGroupAdmin);

// Promote user to Super Admin
router.patch('/promote/superAdmin/:username', usersController.promoteToSuperAdmin);


module.exports = router;
