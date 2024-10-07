const path = require('path');
const fs = require('fs').promises;
const { readFile, writeFile } = require('../helpers/fileHelper');
const { getDB } = require('../db');

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

  // Read and update groups.json
  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      console.error('Failed to read groups.json:', err);
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

    writeFile(groupsFilePath, groups, (writeErr) => {
      if (writeErr) {
        console.error('Failed to save new group to groups.json:', writeErr);
        return res.status(500).json({ error: 'Failed to save new group.' });
      }

      // Read and update users.json
      readFile(usersFilePath, (userErr, users) => {
        if (userErr) {
          console.error('Failed to read users.json:', userErr);
          return res.status(500).json({ error: 'Failed to read users data.' });
        }

        // Find the user and update their groups array
        const userIndex = users.findIndex(u => u.userId === creatorId);
        if (userIndex !== -1) {
          if (!users[userIndex].groups) {
            users[userIndex].groups = [];
          }
          users[userIndex].groups.push(groupName);

          // Write the updated users data back to users.json
          writeFile(usersFilePath, users, (userWriteErr) => {
            if (userWriteErr) {
              console.error('Failed to update user data in users.json:', userWriteErr);
              return res.status(500).json({ error: 'Failed to update user data.' });
            }

            console.log(`User ${creatorId} successfully updated with new group ${groupName}.`);
            res.status(201).json({ message: 'New group created successfully.' });
          });
        } else {
          console.error('User not found in users.json:', creatorId);
          return res.status(404).json({ error: 'User not found.' });
        }
      });
    });
  });
};

// Add a group to the users groups 
const addGroupToUser = (req, res) => {
  const { username } = req.params;
  const { groupName } = req.body;

  if (!username || !groupName) {
    return res.status(400).json({ error: 'Username and group name are required.' });
  }

  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read user data.' });
    }

    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!users[userIndex].groups) {
      users[userIndex].groups = [];
    }

    if (!users[userIndex].groups.includes(groupName)) {
      users[userIndex].groups.push(groupName);
    } else {
      return res.status(400).json({ error: 'User is already in this group.' });
    }

    writeFile(usersFilePath, users, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add group to user.' });
      }
      res.status(200).json({ message: 'Group added to user successfully.' });
    });
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


// Delete a group and its associated channels and messages
const deleteGroup = async (req, res) => {
  try {
    const { groupName } = req.params;
    const { currentUserId, isSuperAdmin } = req.body;

    // Read the groups file
    const groupsData = await fs.readFile(groupsFilePath, 'utf8');
    const groups = JSON.parse(groupsData);

    // Find the group by name
    const groupIndex = groups.findIndex(g => g.name === groupName);
    if (groupIndex === -1) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    const group = groups[groupIndex];

    // Check if the current user is authorized to delete the group
    if (group.creatorId !== currentUserId && !isSuperAdmin) {
      return res.status(403).json({ error: 'Unauthorized to delete group.' });
    }

    // Remove the group from groups.json
    groups.splice(groupIndex, 1);
    await fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2));

    // Now remove the group from all users' groups array in users.json
    const usersData = await fs.readFile(usersFilePath, 'utf8');
    const users = JSON.parse(usersData);

    // Update each user to remove the deleted group from their groups array
    users.forEach(user => {
      user.groups = user.groups.filter(group => group !== groupName);
    });

    // Write the updated users data back to users.json
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    // Remove the channels and their messages from MongoDB
    const db = getDB();
    const channels = await db.collection('channels').find({ groupName }).toArray();

    if (channels.length > 0) {
      const channelNames = channels.map(channel => channel.name);

      // Delete the channels
      await db.collection('channels').deleteMany({ groupName });

      // Delete all messages related to those channels
      await db.collection('messages').deleteMany({ channelName: { $in: channelNames } });
    }

    // Send a success response after everything is deleted successfully
    res.status(200).json({ message: `Group "${groupName}", all associated channels, and messages deleted successfully.` });

  } catch (err) {
    console.error('Error while deleting group:', err);
    res.status(500).json({ error: 'An error occurred while deleting the group.' });
  }
};



// Get users in a specific group
const getUsersInGroup = (req, res) => {
  const { groupName } = req.params;

  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    // Filter users who belong to the specified group
    const usersInGroup = users.filter(user => user.groups.includes(groupName));

    // Return the list of users in the group
    res.json(usersInGroup.map(user => ({ userId: user.userId, username: user.username })));
  });
};

// Get admins of a specific group
const getGroupAdmins = (req, res) => {
  const { groupName } = req.params;

  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }

    // Find the group by name
    const group = groups.find(g => g.name === groupName);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    // Return the list of admins for the group
    res.json(group.admins);
  });
};

// Function to remove a user from a group and update users.json
const removeUserFromGroup = (req, res) => {
  const { groupName, username } = req.params;

  readFile(usersFilePath, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }

    // Find the user by username and remove the group from the groups array
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.groups = user.groups.filter(group => group !== groupName);

    writeFile(usersFilePath, users, (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Failed to update user data.' });
      }

      res.status(200).json({ message: 'User removed from group successfully.' });
    });
  });
};




module.exports = {
  getAllGroups,
  getGroupDetails,
  getUsersInGroup,
  getGroupAdmins,
  createGroup,
  leaveGroup,
  deleteGroup,
  removeUserFromGroup,
  addGroupToUser
};
