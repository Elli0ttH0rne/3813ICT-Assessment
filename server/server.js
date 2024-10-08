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

const users = {};

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
// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for join events and store the username
  socket.on('joinChat', (username) => {
    users[socket.id] = username; 
    const joinMessage = {
      sender: 'System',
      content: `${username} has joined the chat`,
      timestamp: new Date().toISOString()
    };

    io.emit('newMessage', joinMessage);
    console.log(`${username} has joined the chat`);
  });

  // Listen for a 'leaveChat' event when the user navigates away and emit a leave message
  socket.on('leaveChat', (username) => {
    const leaveMessage = {
      sender: 'System',
      content: `${username} has left the chat`,
      timestamp: new Date().toISOString()
    };

    io.emit('newMessage', leaveMessage);
    console.log(`${username} has left the chat`);
  });

  // Listen for a 'message' event from the client and broadcast it
  socket.on('sendMessage', (message) => {
    io.emit('newMessage', message);
  });

  // Listen for user disconnect and send a leave message
  socket.on('disconnect', () => {
    const username = users[socket.id] || 'A user';
    const leaveMessage = {
      sender: 'System',
      content: `${username} has left the chat`,
      timestamp: new Date().toISOString()
    };

    io.emit('newMessage', leaveMessage);
    delete users[socket.id];
    console.log(`${username} disconnected`);
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
