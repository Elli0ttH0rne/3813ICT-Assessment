const path = require('path');
const { readFile, writeFile } = require('../helpers/fileHelper');
const fs = require('fs');
const { getDB } = require('../db')

const usersFilePath = path.join(__dirname, '../data/users.json');
const uploadsDir = path.join(__dirname, '../uploads/profile-pictures');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get all users
const getAllUsers = (req, res) => {
  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }
    res.json(users);
  });
};

// Add a new user
const addUser = (req, res) => {
  const newUser = req.body;

  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    // Check for existing username
    if (users.some(user => user.username === newUser.username)) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    users.push(newUser);

    writeFile(usersFilePath, users, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save user.' });
      }
      res.status(201).json({ message: 'User created successfully.' });
    });
  });
};

// Save updated list of users
const saveUsers = (req, res) => {
  const users = req.body;

  writeFile(usersFilePath, users, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save users.' });
    }
    res.status(200).json({ message: 'Users saved successfully.' });
  });
};

// Delete a user by username
const deleteUserByUsername = (req, res) => {
  const { username } = req.params;

  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    users.splice(userIndex, 1);

    writeFile(usersFilePath, users, (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Failed to delete user.' });
      }

      res.status(200).json({ message: 'User deleted successfully.' });
    });
  });
};

// Get all super admins
const getSuperAdmins = (req, res) => {
  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    const superAdmins = users.filter(user => user.roles.includes('superAdmin')).map(user => ({
      userId: user.userId,
      username: user.username,
      role: 'superAdmin'
    }));

    res.json(superAdmins);
  });
};

// Promote user to Group Admin
const promoteToGroupAdmin = (req, res) => {
  const { username } = req.params;

  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.roles.includes('groupAdmin')) {
      user.roles.push('groupAdmin');
    }

    writeFile(usersFilePath, users, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update user roles.' });
      }
      res.status(200).json({ message: 'User promoted to Group Admin successfully.' });
    });
  });
};

// Promote user to Super Admin
const promoteToSuperAdmin = (req, res) => {
  const { username } = req.params;

  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.roles.includes('superAdmin')) {
      user.roles.push('superAdmin');
    }

    writeFile(usersFilePath, users, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update user roles.' });
      }
      res.status(200).json({ message: 'User promoted to Super Admin successfully.' });
    });
  });
};

// Upload profile picture and update the user's profile picture in MongoDB
const uploadProfilePicture = async (req, res) => {
  const { username } = req.body;
  const imageUrl = `http://localhost:3000/uploads/profile-pictures/${req.file.filename}`; 

  try {
    const db = getDB(); 
    const profilePicturesCollection = db.collection('profilePictures');
    
    // Check if there is an existing entry for the user
    const existingEntry = await profilePicturesCollection.findOne({ username });

    if (existingEntry) {
      // If an entry exists, delete the previous profile picture file
      const existingImagePath = existingEntry.profilePicture.replace('http://localhost:3000', '');
      fs.unlinkSync(`.${existingImagePath}`); // Delete the file from the filesystem
      console.log(`Deleted existing profile picture file for ${username} at path: ${existingImagePath}`);

      // Delete the previous entry in MongoDB
      await profilePicturesCollection.deleteOne({ username });
    }

    // Insert the new profile picture
    await profilePicturesCollection.insertOne({ username, profilePicture: imageUrl });

    res.status(200).json({ imageUrl, message: 'Profile picture uploaded successfully.' });
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    res.status(500).send('Error uploading profile picture.');
  }
};

// Get the user's profile picture from MongoDB
const getProfilePicture = async (req, res) => {
  const { username } = req.params;

  try {
    const db = getDB();
    const profilePicturesCollection = db.collection('profilePictures');

    const userProfile = await profilePicturesCollection.findOne({ username });

    if (!userProfile || !userProfile.profilePicture) {
      return res.status(404).json({ imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg' });
    }

    res.status(200).json({ imageUrl: userProfile.profilePicture });
  } catch (error) {
    console.error('Failed to get profile picture:', error);
    res.status(500).send('Error retrieving profile picture.');
  }
};


module.exports = {
  getAllUsers,
  addUser,
  saveUsers,
  deleteUserByUsername,
  getSuperAdmins,
  promoteToGroupAdmin,
  promoteToSuperAdmin,
  uploadProfilePicture,
  getProfilePicture
};
