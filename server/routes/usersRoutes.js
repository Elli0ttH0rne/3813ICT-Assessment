const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const usersController = require('../controllers/usersController');

const uploadDir = './uploads/profile-pictures';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/profile-pictures');
    },
    filename: (req, file, cb) => {
      console.log('Request body:', req.body); // Check if username is available here
      const fileName = `${req.body.username}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, fileName);
    }
  });

const upload = multer({ storage: storage });

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

// Route to upload profile picture
router.post('/upload-profile-picture', upload.single('image'), usersController.uploadProfilePicture);

// Route to get profile picture URL
router.get('/profile-picture/:username', usersController.getProfilePicture);

module.exports = router;
