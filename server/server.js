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

  // Listen for a 'message' event from the client
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);

    // Emit the message to all connected clients
    io.emit('newMessage', message);
  });

  // Handle user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
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
