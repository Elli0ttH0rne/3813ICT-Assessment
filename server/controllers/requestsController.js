const path = require('path');
const { readFile, writeFile } = require('../helpers/fileHelper');

const requestsFilePath = path.join(__dirname, '../data/requests.json');

// Get all requests
const getAllRequests = (req, res) => {
  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }
    res.json(requests);
  });
};

// Create a new request
const createRequest = (req, res) => {
  const newRequest = req.body;

  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }

    newRequest.id = Date.now().toString(); // Assign a unique ID for the request
    requests.push(newRequest);

    writeFile(requestsFilePath, requests, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save request.' });
      }
      res.status(201).json({ message: 'Request added successfully.', request: newRequest });
    });
  });
};

module.exports = {
  getAllRequests,
  createRequest,
};
