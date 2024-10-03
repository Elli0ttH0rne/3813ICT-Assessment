const fs = require('fs');
const path = require('path');

// Helper function to read JSON file
const readFile = (filePath, callback) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    callback(null, JSON.parse(data));
  });
};

// Helper function to write JSON file
const writeFile = (filePath, data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', err => {
    if (err) {
      return callback(err);
    }
    callback();
  });
};

module.exports = {
  readFile,
  writeFile,
};
