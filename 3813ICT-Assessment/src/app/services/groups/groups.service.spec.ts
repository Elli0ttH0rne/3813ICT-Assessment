import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GroupsService, Group } from './groups.service';

describe('GroupsService', () => {
  let service: GroupsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupsService]
    });

    service = TestBed.inject(GroupsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAllGroups', () => {
    it('should fetch all groups', () => {
      const mockGroups: Group[] = [
        { name: 'Group1', admins: [], creatorId: '123' },
        { name: 'Group2', admins: [], creatorId: '456' }
      ];

      service.getAllGroups().subscribe((groups) => {
        expect(groups.length).toBe(2);
        expect(groups).toEqual(mockGroups);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('GET');
      req.flush(mockGroups);
    });
  });

  describe('#getGroupCreator', () => {
    it('should fetch the group creator', () => {
      const groupName = 'Group1';
      const mockGroup: Group = { name: 'Group1', admins: [], creatorId: '123' };

      service.getGroupCreator(groupName).subscribe((creatorId) => {
        expect(creatorId).toBe('123');
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${groupName}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGroup);
    });
  });

  describe('#createGroup', () => {
    it('should create a new group', () => {
      const mockResponse = { success: true };
      const groupName = 'NewGroup';
      const creatorUsername = 'admin';
      const creatorId = '123';

      service.createGroup(groupName, creatorUsername, creatorId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ groupName, creatorUsername, creatorId });
      req.flush(mockResponse);
    });
  });

  describe('#deleteGroup', () => {
    it('should delete a group', () => {
      const mockResponse = { success: true };
      const groupName = 'Group1';
      const currentUserId = '123';
      const isSuperAdmin = true;

      service.deleteGroup(groupName, currentUserId, isSuperAdmin).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${groupName}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ currentUserId, isSuperAdmin });
      req.flush(mockResponse);
    });
  });

  describe('#getUsersInGroup', () => {
    it('should fetch users in a group', () => {
      const mockUsers = [{ userId: '1', username: 'User1' }];
      const groupName = 'Group1';

      service.getUsersInGroup(groupName).subscribe((users) => {
        expect(users.length).toBe(1);
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${groupName}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('#getGroupAdmins', () => {
    it('should fetch admins of a group', () => {
      const mockAdmins = [{ userId: '1', username: 'Admin1', role: 'admin' }];
      const groupName = 'Group1';

      service.getGroupAdmins(groupName).subscribe((admins) => {
        expect(admins.length).toBe(1);
        expect(admins).toEqual(mockAdmins);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${groupName}/admins`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAdmins);
    });
  });

  describe('#addGroupToUser', () => {
    it('should add a group to a user', () => {
      const mockResponse = { success: true };
      const username = 'user1';
      const groupName = 'Group1';

      service.addGroupToUser(username, groupName).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/add-group-to-user/${username}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ groupName });
      req.flush(mockResponse);
    });   
  });

  describe('#leaveGroup', () => {
    it('should leave a group', () => {
      const mockResponse = { success: true };
      const groupName = 'Group1';
      const userId = '123';

      service.leaveGroup(groupName, userId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/${groupName}/leave`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId });
      req.flush(mockResponse);
    });
  });

  describe('#kickUserFromGroup', () => {
    it('should kick a user from a group', () => {
      const mockResponse = { success: true };
      const groupName = 'Group1';
      const username = 'user1';

      service.kickUserFromGroup(groupName, username).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/groups/${groupName}/users/${username}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
