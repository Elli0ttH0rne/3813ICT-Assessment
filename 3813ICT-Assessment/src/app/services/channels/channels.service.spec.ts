import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChannelsService } from './channels.service';
import { HttpClient } from '@angular/common/http';

describe('ChannelsService', () => {
  let service: ChannelsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChannelsService]
    });

    service = TestBed.inject(ChannelsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getChannelsByGroupName', () => {
    it('should fetch channels by group name', () => {
      const mockChannels = [{ name: 'general', description: 'General discussion' }];
      const groupName = 'testgroup';

      service.getChannelsByGroupName(groupName).subscribe((channels) => {
        expect(channels.length).toBe(1);
        expect(channels).toEqual(mockChannels);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/group/${groupName}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockChannels); 
    });
  });

  describe('#createChannel', () => {
    it('should create a new channel', () => {
      const mockResponse = { success: true };
      const groupName = 'testgroup';
      const name = 'new-channel';
      const description = 'A new channel';

      service.createChannel(groupName, name, description).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ groupName, name, description });
      req.flush(mockResponse);
    });
  });

  describe('#deleteChannel', () => {
    it('should delete a channel', () => {
      const mockResponse = { success: true };
      const groupName = 'testgroup';
      const channelName = 'general';

      service.deleteChannel(groupName, channelName).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${groupName}/${channelName}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('#addChannelMessage', () => {
    it('should add a message to a channel', () => {
      const mockResponse = { success: true };
      const groupName = 'testgroup';
      const channelName = 'general';
      const formData = new FormData();
      formData.append('message', 'Hello world!');

      service.addChannelMessage(groupName, channelName, formData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${groupName}/${channelName}/messages`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('#getChannelMessages', () => {
    it('should fetch messages for a channel', () => {
      const mockMessages = [{ id: '1', content: 'Hello' }];
      const groupName = 'testgroup';
      const channelName = 'general';

      service.getChannelMessages(groupName, channelName).subscribe((messages) => {
        expect(messages.length).toBe(1);
        expect(messages).toEqual(mockMessages);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${groupName}/${channelName}/messages`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMessages);
    });
  });

  describe('#deleteChannelMessage', () => {
    it('should delete a message from a channel', () => {
      const mockResponse = { success: true };
      const groupName = 'testgroup';
      const channelName = 'general';
      const messageId = '123';

      service.deleteChannelMessage(groupName, channelName, messageId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/messages/${groupName}/${channelName}/${messageId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
