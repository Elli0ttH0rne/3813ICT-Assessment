const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const groupsRoutes = require('./routes/groupsRoutes');
const requestsRoutes = require('./routes/requestsRoutes');
const usersRoutes = require('./routes/usersRoutes'); // Import user routes

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/groups', groupsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/users', usersRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
