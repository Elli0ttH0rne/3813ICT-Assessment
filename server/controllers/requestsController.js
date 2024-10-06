const path = require('path');
const { readFile, writeFile } = require('../helpers/fileHelper');

const requestsFilePath = path.join(__dirname, '../data/requests.json');

const createRequest = (req, res) => {
  const { username, groupName, typeOfRequest, reportedUsername, reason, promotionUser } = req.body;

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

    // Check for duplicate requests, considering 'reportedUsername' or 'promotionUser' if applicable
    const isDuplicate = requests.some(request => 
      request.username === username &&
      request.groupName === groupName &&
      request.typeOfRequest === typeOfRequest &&
      (typeOfRequest !== 'report' || request.reportedUsername === reportedUsername) &&
      (typeOfRequest !== 'promotion' || request.promotionUser === promotionUser)
    );

    if (isDuplicate) {
      return res.status(400).json({ error: 'Duplicate request already exists.' });
    }

    // Add additional data for report or promotion requests
    const newRequest = { username, groupName, typeOfRequest };
    if (typeOfRequest === 'report') {
      newRequest.reportedUsername = reportedUsername;
      newRequest.reason = reason;
    } else if (typeOfRequest === 'promotion') {
      newRequest.promotionUser = promotionUser;
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
    console.log("Requests being sent to frontend: ", requests);
    res.json(requests);
  });
};


// Get request by a specific type (join, report, promotion)
const getRequestsByType = (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: 'Request type is required.' });
  }

  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }

    const filteredRequests = requests.filter(request => request.typeOfRequest === type);
    res.json(filteredRequests);
  });
};

const updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }

    const requestIndex = requests.findIndex(req => req.id === id);
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    requests[requestIndex].status = status;

    writeFile(requestsFilePath, requests, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update request.' });
      }
      res.status(200).json({ message: 'Request status updated successfully.' });
    });
  });
};

const deleteRequest = (req, res) => {
  const { id } = req.params;

  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }

    const updatedRequests = requests.filter(req => req.id !== id);

    if (updatedRequests.length === requests.length) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    writeFile(requestsFilePath, updatedRequests, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete request.' });
      }
      res.status(200).json({ message: 'Request deleted successfully.' });
    });
  });
};

const removePendingRequestsByGroup = (req, res) => {
  const { groupName } = req.params;

  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }

    const updatedRequests = requests.filter(req => req.groupName !== groupName);

    if (updatedRequests.length === requests.length) {
      return res.status(404).json({ error: 'No pending requests found for the specified group.' });
    }

    writeFile(requestsFilePath, updatedRequests, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to remove pending requests.' });
      }
      res.status(200).json({ message: 'Pending requests removed successfully.' });
    });
  });
};

const removePendingRequestsByUsername = (req, res) => {
  const { username } = req.params;

  readFile(requestsFilePath, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read requests data.' });
    }

    const updatedRequests = requests.filter(req => req.username !== username);

    if (updatedRequests.length === requests.length) {
      return res.status(404).json({ error: 'No pending requests found for the specified user.' });
    }

    writeFile(requestsFilePath, updatedRequests, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to remove pending requests.' });
      }
      res.status(200).json({ message: 'Pending requests for the user removed successfully.' });
    });
  });
};

module.exports = {
  createRequest,
  getAllRequests,
  removePendingRequestsByGroup,
  deleteRequest,
  updateRequestStatus,
  getRequestsByType,
  removePendingRequestsByUsername
};
