const path = require('path');
const { readFile, writeFile } = require('../helpers/fileHelper');

const requestsFilePath = path.join(__dirname, '../data/requests.json');

const createRequest = (req, res) => {
  const { username, groupName, typeOfRequest, reportedUsername, reason } = req.body;

  if (!username || !groupName || !typeOfRequest) {
    return res.status(400).json({ error: 'Username, group name, and type of request are required.' });
  }

  if (!['join', 'report', 'promotion'].includes(typeOfRequest)) {
    return res.status(400).json({ error: 'Invalid type of request. Must be "join", "report", or "promotion".' });
  }

  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }

    // Check for duplicate requests, considering 'reportedUsername' if it's a 'report' request
    const isDuplicate = requests.some(request => 
      request.username === username &&
      request.groupName === groupName &&
      request.typeOfRequest === typeOfRequest &&
      (typeOfRequest !== 'report' || request.reportedUsername === reportedUsername)
    );

    if (isDuplicate) {
      return res.status(400).json({ error: 'Duplicate request already exists.' });
    }

    // Add additional data for report requests
    const newRequest = { username, groupName, typeOfRequest };
    if (typeOfRequest === 'report') {
      newRequest.reportedUsername = reportedUsername;
      newRequest.reason = reason;
    }

    requests.push(newRequest);

    writeFile(requestsFilePath, requests, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save request.' });
      }
      res.status(201).json({ message: 'Request created successfully.' });
    });
  });
};


// Get all requests
const getAllRequests = (req, res) => {
  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }
    res.json(requests);
  });
};

module.exports = {
  createRequest,
  getAllRequests,
};
