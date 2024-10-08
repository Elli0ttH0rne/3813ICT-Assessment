const { getDB } = require('../db');
const { ObjectId } = require('bson');
const fs = require('fs');
const path = require('path');

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

  // Delete a channel and its associated messages
  const deleteChannel = async (req, res) => {
    const { groupName, channelName } = req.params;
  
    if (!groupName || !channelName) {
      return res.status(400).json({ error: 'Group name and channel name are required.' });
    }
  
    try {
      const db = getDB();
  
      // Delete the channel
      const result = await db.collection('channels').deleteOne({ groupName, name: channelName });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Channel not found.' });
      }
  
      // Delete all messages associated with the deleted channel
      await db.collection('messages').deleteMany({ channelName });
  
      res.status(200).json({ message: 'Channel and its messages deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete channel:', error);
      res.status(500).json({ error: 'Failed to delete channel.' });
    }
  };
  
  
  // Get all chat messages for a channel
const getChannelMessages = async (req, res) => {
    const { groupName, channelName } = req.params;
  
    try {
      const db = getDB();
      const messages = await db.collection('messages').find({ groupName, channelName }).toArray();
      res.status(200).json(messages);
    } catch (error) {
      console.error('Failed to get messages:', error);
      res.status(500).json({ error: 'Failed to get messages.' });
    }
  };
  
// Add a new chat message to a channel
const addChannelMessage = async (req, res) => {
  const { groupName, channelName } = req.params;
  const { sender, content } = req.body;
  const imageUrl = req.file ? `http://localhost:3000/uploads/messages/${req.file.filename}` : null;

  if (!groupName || !channelName || !sender || (!content && !imageUrl)) {
    return res.status(400).json({ error: 'Group name, channel name, sender, and content or image URL are required.' });
  }

  try {
    const db = getDB();
    const messageData = {
      groupName,
      channelName,
      sender,
      content,
      imageUrl, 
      timestamp: new Date(),
    };

    // Save the message to MongoDB
    const result = await db.collection('messages').insertOne(messageData);

    // Emit the message with the correct URL to Socket.IO
    const fullMessage = { ...messageData, _id: result.insertedId };
    
    // Use req.io to emit the message through Socket.IO
    req.io.to(channelName).emit('newMessage', fullMessage);

    res.status(201).json({ message: 'Message added successfully.' });
  } catch (error) {
    console.error('Failed to add message:', error);
    res.status(500).json({ error: 'Failed to add message.' });
  }
};
  
  // Delete a chat message from a channel
  const deleteChannelMessage = async (req, res) => {
    const { groupName, channelName, messageId } = req.params;
  
    // Validate messageId
    if (!ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }
  
    try {
      const db = getDB();
      const result = await db.collection('messages').deleteOne({ _id: new ObjectId(messageId) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Failed to delete message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  };
  

module.exports = {
  getChannelsByGroupName,
  createChannel,
  deleteChannel,
  getChannelMessages,
  addChannelMessage,
  deleteChannelMessage
};
