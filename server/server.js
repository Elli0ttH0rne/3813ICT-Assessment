const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http'); // Import http to use with socket.io
const { Server } = require('socket.io'); // Import socket.io
const groupsRoutes = require('./routes/groupsRoutes');
const requestsRoutes = require('./routes/requestsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const channelsRoutes = require('./routes/channelsRoutes');
const migrateChannels = require('./migrateChannels'); 
const { connectDB } = require('./db');

const app = express();
const PORT = 3000;

const usersByChannel = {};

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/groups', groupsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/channels', channelsRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining a chat
  socket.on('joinChat', ({ username, channelName }) => {
    if (!username || !channelName) {
      console.error('Invalid joinChat event:', { username, channelName });
      return;
    }

    // Add the user to the specific channel
    if (!usersByChannel[channelName]) {
      usersByChannel[channelName] = [];
    }
    usersByChannel[channelName].push({ socketId: socket.id, username });

    const joinMessage = {
      sender: 'System',
      content: `${username} has joined ${channelName}`,
      timestamp: new Date().toISOString()
    };

    // Broadcast join message to the channel and add the user to the room
    socket.join(channelName);
    io.to(channelName).emit('newMessage', joinMessage);

    console.log(`${username} has joined the channel: ${channelName}`);
  });

  // Handle user leaving a chat
  socket.on('leaveChat', ({ username, channelName }) => {
    if (!username || !channelName) {
      console.error('Invalid leaveChat event:', { username, channelName });
      return;
    }

    if (usersByChannel[channelName]) {
      usersByChannel[channelName] = usersByChannel[channelName].filter(user => user.socketId !== socket.id);

      const leaveMessage = {
        sender: 'System',
        content: `${username} has left ${channelName}`,
        timestamp: new Date().toISOString()
      };

      // Broadcast leave message and remove user from the room
      io.to(channelName).emit('newMessage', leaveMessage);
      socket.leave(channelName);

      console.log(`${username} has left the channel: ${channelName}`);
    }
  });

  // Handle sending messages
  socket.on('sendMessage', ({ sender, content, timestamp, channelName }) => {
    if (!sender || !content || !channelName) {
      console.error('Invalid sendMessage event:', { sender, content, channelName });
      return;
    }

    const message = { sender, content, timestamp };
    io.to(channelName).emit('newMessage', message);
    console.log(`Message from ${sender} to ${channelName}: ${content}`);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    for (const channelName in usersByChannel) {
      const userIndex = usersByChannel[channelName].findIndex(user => user.socketId === socket.id);
      if (userIndex !== -1) {
        const user = usersByChannel[channelName][userIndex];

        // Remove user from the channel
        usersByChannel[channelName].splice(userIndex, 1);

        const leaveMessage = {
          sender: 'System',
          content: `${user.username} has disconnected from ${channelName}`,
          timestamp: new Date().toISOString()
        };

        // Broadcast leave message to the channel
        io.to(channelName).emit('newMessage', leaveMessage);
        console.log(`User ${user.username} disconnected from channel ${channelName}`);
      }
    }

    console.log(`A user with socket ID ${socket.id} has disconnected`);
  });
});

// Initialize MongoDB connection and migrate channel data if needed
(async function startServer() {
  try {
    await connectDB(); // Connect to the database
    console.log('MongoDB connection established');

    // Run the migration if needed
    await migrateChannels(); 
    console.log('Channel data migration completed');

    // Start the server with Socket.IO
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server due to database connection issues:', error);
    process.exit(1);
  }
})();
