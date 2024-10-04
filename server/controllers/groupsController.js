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
  const { groupName } = req.params;
  const { userId } = req.body;

  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }

    const groupIndex = groups.findIndex(g => g.name === groupName);
    if (groupIndex === -1) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    const group = groups[groupIndex];

    if (!group.members.includes(userId)) {
      return res.status(400).json({ error: 'User is not a member of this group.' });
    }

    // Remove the user from the group members
    group.members = group.members.filter(memberId => memberId !== userId);

    writeFile(groupsFilePath, groups, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update groups data.' });
      }
      res.status(200).json({ message: 'User left the group successfully.' });
    });
  });
};




const joinGroup = (req, res) => {
  const { groupName } = req.params;
  const { userId } = req.body;

  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }

    const group = groups.find(g => g.name === groupName);
    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    if (!group.members) {
      group.members = [];
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
    } else {
      return res.status(400).json({ error: 'User is already a member of this group.' });
    }

    writeFile(groupsFilePath, groups, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update group data.' });
      }
      res.status(200).json({ message: 'User added to group successfully.' });
    });
  });
};

// Get groups for a specific user by userId
const getGroupsByUserId = (req, res) => {
  const { userId } = req.params;

  readFile(groupsFilePath, (err, groups) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read groups data.' });
    }

    // Filter the groups to only include those where the user is a member
    const userGroups = groups.filter(group => group.members && group.members.includes(userId));

    res.json(userGroups);
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
  joinGroup,
  getGroupChannels,
  deleteGroup,
  getGroupsByUserId,
  leaveGroup
};
