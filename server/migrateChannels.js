const { getDB } = require('./db');
const fs = require('fs');
const path = require('path');

const migrateChannels = async () => {
  try {
    const db = getDB();
    const channelsCollection = db.collection('channels');

    // Check if channels collection is empty
    const count = await channelsCollection.countDocuments();
    if (count === 0) {
      console.log('Migrating channel data to MongoDB...');
      
      // Read channels data from groupsWithChannels.json
      const groupsWithChannelsPath = path.join(__dirname, 'data', 'groupsWithChannels.json');
      const groupsData = JSON.parse(fs.readFileSync(groupsWithChannelsPath, 'utf8'));
      
      // Extract and prepare channels data
      const channelsData = groupsData.flatMap(group => group.channels.map(channel => ({
        groupName: group.name,
        ...channel
      })));

      // Insert channel data into MongoDB
      await channelsCollection.insertMany(channelsData);
      console.log('Channel data migration completed successfully.');
    } else {
      console.log('Channel data already exists in MongoDB. Skipping migration.');
    }
  } catch (err) {
    console.error('Failed to migrate channels:', err);
    throw err;
  }
};

module.exports = migrateChannels;
