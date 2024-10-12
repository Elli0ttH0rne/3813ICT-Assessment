const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const { setDB, getDB } = require('../db');
const express = require('express');
const router = require('../routes/channelsRoutes'); // Adjust to your correct route path

const expect = chai.expect;
chai.use(chaiHttp);

let mongoServer;
let app;
let db;

// Set up an in-memory MongoDB server before running the tests
before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory MongoDB instance
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db();
  setDB(db); // Set the in-memory DB for the tests

  app = express();
  app.use(express.json());
  app.use('/api/channels', router); // Use the router for channels
});

// Stop the in-memory MongoDB after the tests
after(async () => {
  await mongoServer.stop();
});

// Test suite for channels
describe('Channel Routes', () => {
  describe('GET /api/channels/group/:groupName', () => {
    it('should return all channels for a given group name', async () => {
      // Insert test data
      await db.collection('channels').insertOne({ groupName: 'Test Group', name: 'Test Channel', description: 'A test channel' });

      // Make the request
      const res = await chai.request(app)
        .get('/api/channels/group/Test Group');

      // Assertions
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
      expect(res.body[0].name).to.equal('Test Channel');
    });
  });

  describe('POST /api/channels', () => {
    it('should create a new channel', async () => {
      const channelData = {
        groupName: 'Test Group',
        name: 'New Channel',
        description: 'This is a new channel',
      };

      const res = await chai.request(app)
        .post('/api/channels')
        .send(channelData);

      // Assertions
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'Channel created successfully.');

      // Check if the channel was inserted into the database
      const channel = await db.collection('channels').findOne({ name: 'New Channel' });
      expect(channel).to.not.be.null;
      expect(channel.name).to.equal('New Channel');
    });
  });

  describe('DELETE /api/channels/:groupName/:channelName', () => {
    it('should delete a channel and its messages', async () => {
      // Insert test data
      await db.collection('channels').insertOne({ groupName: 'Test Group', name: 'Delete Channel', description: 'To be deleted' });
      await db.collection('messages').insertMany([
        { channelName: 'Delete Channel', content: 'Test message 1' },
        { channelName: 'Delete Channel', content: 'Test message 2' }
      ]);

      const res = await chai.request(app)
        .delete('/api/channels/Test Group/Delete Channel');

      // Assertions
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Channel and its messages deleted successfully.');

      // Check if the channel and messages were deleted
      const channel = await db.collection('channels').findOne({ name: 'Delete Channel' });
      const messages = await db.collection('messages').find({ channelName: 'Delete Channel' }).toArray();
      expect(channel).to.be.null;
      expect(messages.length).to.equal(0);
    });
  });

  describe('GET /api/channels/:groupName/:channelName/messages', () => {
    it('should return all messages for a given channel', async () => {
      // Insert test data
      await db.collection('messages').insertMany([
        { groupName: 'Test Group', channelName: 'Test Channel', content: 'First message' },
        { groupName: 'Test Group', channelName: 'Test Channel', content: 'Second message' }
      ]);

      const res = await chai.request(app)
        .get('/api/channels/Test Group/Test Channel/messages');

      // Assertions
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
    });
  });

  describe('POST /api/channels/:groupName/:channelName/messages', () => {
    it('should add a new message to the channel', async () => {
      const messageData = {
        sender: 'User1',
        content: 'This is a new message'
      };

      const res = await chai.request(app)
        .post('/api/channels/Test Group/Test Channel/messages')
        .send(messageData);

      // Assertions
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'Message added successfully.');

      // Check if the message was inserted into the database
      const message = await db.collection('messages').findOne({ content: 'This is a new message' });
      expect(message).to.not.be.null;
      expect(message.content).to.equal('This is a new message');
    });
  });

  describe('DELETE /api/channels/messages/:groupName/:channelName/:messageId', () => {
    it('should delete a specific message by messageId', async () => {
      // Insert test message
      const message = await db.collection('messages').insertOne({ groupName: 'Test Group', channelName: 'Test Channel', content: 'Test message' });
      
      const messageId = message.insertedId;

      const res = await chai.request(app)
        .delete(`/api/channels/messages/Test Group/Test Channel/${messageId}`);

      // Assertions
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Message deleted successfully.');

      // Check if the message was deleted from the database
      const deletedMessage = await db.collection('messages').findOne({ _id: messageId });
      expect(deletedMessage).to.be.null;
    });
  });
});
