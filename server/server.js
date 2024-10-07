const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const groupsRoutes = require('./routes/groupsRoutes');
const requestsRoutes = require('./routes/requestsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const channelsRoutes = require('./routes/channelsRoutes');
const migrateChannels = require('./migrateChannels'); 
const { connectDB } = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/groups', groupsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/channels', channelsRoutes);

// Initialize MongoDB connection and migrate channel data if needed
(async function startServer() {
  try {
    await connectDB(); // Connect to the database
    console.log('MongoDB connection established');

    // Run the migration if needed
    await migrateChannels(); 
    console.log('Channel data migration completed');

    // Start the server only after database is connected
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server due to database connection issues:', error);
    process.exit(1); // Exit the process if DB connection fails
  }
})();
