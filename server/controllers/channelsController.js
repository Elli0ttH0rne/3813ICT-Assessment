const { getDB } = require('../db');

// Add a new channel
const addChannel = async (req, res) => {
  const { groupName, name, description } = req.body;

  if (!groupName || !name || !description) {
    return res.status(400).json({ error: 'Group name, channel name, and description are required.' });
  }

  try {
    const db = getDB();
    const result = await db.collection('channels').insertOne({ groupName, name, description });
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add channel.' });
  }
};

// Get all channels by group name
const getChannelsByGroupName = async (req, res) => {
  const { groupName } = req.params;

  try {
    const db = getDB();
    const channels = await db.collection('channels').find({ groupName }).toArray();
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get channels.' });
  }
};

module.exports = {
  addChannel,
  getChannelsByGroupName,
};
