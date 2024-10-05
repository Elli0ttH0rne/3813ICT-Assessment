const path = require('path');
const { readFile, writeFile } = require('../helpers/fileHelper');

const groupsFilePath = path.join(__dirname, '../data/groups.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Get all groups
const getAllGroups = (req, res) => {
  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }
    res.json(groups);
  });
};

// Get details of a specific group
const getGroupDetails = (req, res) => {
  const { groupName } = req.params;

  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }

    const group = groups.find(g => g.name === groupName);

    if (!group) {
      return res.status(404).json({ error: `Group with name "${groupName}" not found.` });
    }

    res.json(group);
  });
};

// Create a new group
const createGroup = (req, res) => {
  const { groupName, creatorUsername, creatorId } = req.body;

  if (!groupName || !creatorUsername || !creatorId) {
    return res.status(400).json({ error: 'Group name, creator username, and creator ID are required.' });
  }

  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }

    if (groups.find(g => g.name === groupName)) {
      return res.status(400).json({ error: 'Group already exists.' });
    }

    const newGroup = {
      name: groupName,
      channels: [],
      admins: [{ userId: creatorId, username: creatorUsername, role: 'creator' }],
      creatorId
    };

    groups.push(newGroup);

    writeFile(groupsFilePath, groups, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save new group.' });
      }
      res.status(201).json({ message: 'New group created successfully.' });
    });
  });
};

// Get channels for a specific group
const getGroupChannels = (req, res) => {
  const { groupName } = req.params;

  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }

    const group = groups.find(g => g.name === groupName);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    res.json(group.channels); 
  });
};

// Leave a group
const leaveGroup = (req, res) => {
  const { userId } = req.body;
  const { groupName } = req.params;

  // Read users.json
  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    // Find the user by userId
    const userIndex = users.findIndex(user => user.userId === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Remove the group from the user's groups array
    const user = users[userIndex];
    user.groups = user.groups.filter(group => group !== groupName);

    // Write the updated users data back to users.json
    writeFile(usersFilePath, users, (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Failed to update user data.' });
      }

      res.status(200).json({ message: `Successfully left the group "${groupName}".` });
    });
  });
};


// Delete a group
const deleteGroup = (req, res) => {
  const { groupName } = req.params;
  const { currentUsername, isSuperAdmin } = req.body;

  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }

    const groupIndex = groups.findIndex(g => g.name === groupName);
    if (groupIndex === -1) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    const group = groups[groupIndex];
    if (group.creatorId !== currentUsername && !isSuperAdmin) {
      return res.status(403).json({ error: 'Unauthorized to delete group.' });
    }

    groups.splice(groupIndex, 1);

    writeFile(groupsFilePath, groups, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete group.' });
      }
      res.status(200).json({ message: 'Group deleted successfully.' });
    });
  });
};

module.exports = {
  getAllGroups,
  getGroupDetails,
  createGroup,
  getGroupChannels,
  deleteGroup,
  leaveGroup
};
