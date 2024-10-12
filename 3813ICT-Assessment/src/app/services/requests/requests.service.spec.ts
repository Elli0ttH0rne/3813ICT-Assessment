import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RequestsService } from './requests.service';

describe('RequestsService', () => {
  let service: RequestsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestsService]
    });

    service = TestBed.inject(RequestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createRequest', () => {
    it('should create a join request', () => {
      const mockResponse = { success: true };
      const username = 'testuser';
      const groupName = 'testgroup';
      const typeOfRequest = 'join';

      service.createRequest(username, groupName, typeOfRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, groupName, typeOfRequest });
      req.flush(mockResponse);
    });

    it('should create a report request', () => {
      const mockResponse = { success: true };
      const username = 'testuser';
      const groupName = 'testgroup';
      const typeOfRequest = 'report';
      const reportedUsername = 'reportedUser';
      const reason = 'Inappropriate behavior';

      service.createRequest(username, groupName, typeOfRequest, reportedUsername, reason).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        username,
        groupName,
        typeOfRequest,
        reportedUsername,
        reason
      });
      req.flush(mockResponse);
    });
  });

  describe('#getAllRequests', () => {
    it('should fetch all requests', () => {
      const mockRequests = [{ id: '1', username: 'user1' }];

      service.getAllRequests().subscribe((requests) => {
        expect(requests.length).toBe(1);
        expect(requests).toEqual(mockRequests);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('GET');
      req.flush(mockRequests);
    });
  });

  describe('#getRequestsByType', () => {
    it('should fetch requests by type', () => {
      const mockRequests = [{ id: '1', username: 'user1', type: 'join' }];
      const type = 'join';

      service.getRequestsByType(type).subscribe((requests) => {
        expect(requests.length).toBe(1);
        expect(requests).toEqual(mockRequests);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}?type=${type}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRequests);
    });
  });

  describe('#updateRequestStatus', () => {
    it('should update the request status', () => {
      const mockResponse = { success: true };
      const requestId = '1';
      const status = 'approved';

      service.updateRequestStatus(requestId, status).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${requestId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ status });
      req.flush(mockResponse);
    });
  });

  describe('#deleteRequestByDetails', () => {
    it('should delete a request by details', () => {
      const mockResponse = { success: true };
      const username = 'testuser';
      const groupName = 'testgroup';
      const typeOfRequest = 'join';

      service.deleteRequestByDetails(username, groupName, typeOfRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ username, groupName, typeOfRequest });
      req.flush(mockResponse);
    });
  });

  describe('#getRequestCount', () => {
    it('should return the request count', () => {
      const mockRequests = [{ id: '1' }, { id: '2' }];

      service.getRequestCount().subscribe((count) => {
        expect(count).toBe(2);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('GET');
      req.flush(mockRequests);
    });

    it('should return 0 if the request fails', () => {
      service.getRequestCount().subscribe((count) => {
        expect(count).toBe(0);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});
