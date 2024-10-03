const path = require('path');
const { readFile, writeFile } = require('../helpers/fileHelper');

const usersFilePath = path.join(__dirname, '../data/users.json');

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

    // Check if the username already exists
    if (users.find(user => user.username === newUser.username)) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    users.push(newUser);

    writeFile(usersFilePath, users, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add user.' });
      }
      res.status(201).json({ message: 'User added successfully.' });
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
const deleteUser = (req, res) => {
  const { username } = req.params;

  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    const updatedUsers = users.filter(user => user.username !== username);

    if (users.length === updatedUsers.length) {
      return res.status(404).json({ error: 'User not found.' });
    }

    writeFile(usersFilePath, updatedUsers, (err) => {
      if (err) {
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

// Promote a user to group admin
const promoteToGroupAdmin = (req, res) => {
  const { username } = req.body;

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
        return res.status(500).json({ error: 'Failed to update users data.' });
      }
      res.status(200).json({ message: 'User promoted to group admin.' });
    });
  });
};

// Promote a user to super admin
const promoteToSuperAdmin = (req, res) => {
  const { username } = req.body;

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
        return res.status(500).json({ error: 'Failed to update users data.' });
      }
      res.status(200).json({ message: 'User promoted to super admin.' });
    });
  });
};

module.exports = {
  getAllUsers,
  addUser,
  saveUsers,
  deleteUser,
  getSuperAdmins,
  promoteToGroupAdmin,
  promoteToSuperAdmin
};
