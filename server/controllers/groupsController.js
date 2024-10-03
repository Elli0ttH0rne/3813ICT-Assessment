const path = require('path');
const { readFile, writeFile } = require('../helpers/fileHelper');

const groupsFilePath = path.join(__dirname, '../data/groups.json');

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
      return res.status(404).json({ error: 'Group not found.' });
    }

    res.json(group);
  });
};

// Create a new group
const createGroup = (req, res) => {
  const { groupName, creatorUsername, creatorId } = req.body;

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
  deleteGroup,
};
