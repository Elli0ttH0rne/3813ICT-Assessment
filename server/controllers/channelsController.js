const { getDB } = require('../db');


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

const createChannel = async (req, res) => {
    const { groupName, name, description } = req.body;
  
    if (!groupName || !name || !description) {
      return res.status(400).json({ error: 'Group name, channel name, and description are required.' });
    }
  
    try {
      const db = getDB();
      const channelData = { groupName, name, description };
      await db.collection('channels').insertOne(channelData);
      res.status(201).json({ message: 'Channel created successfully.' });
    } catch (error) {
      console.error('Failed to create channel:', error);
      res.status(500).json({ error: 'Failed to create channel.' });
    }
  };

  const deleteChannel = async (req, res) => {
    const { groupName, channelName } = req.params;
  
    if (!groupName || !channelName) {
      return res.status(400).json({ error: 'Group name and channel name are required.' });
    }
  
    try {
      const db = getDB();
      const result = await db.collection('channels').deleteOne({ groupName, name: channelName });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Channel not found.' });
      }
  
      res.status(200).json({ message: 'Channel deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete channel:', error);
      res.status(500).json({ error: 'Failed to delete channel.' });
    }
  };
  
module.exports = {
  getChannelsByGroupName,
  createChannel,
  deleteChannel
};
