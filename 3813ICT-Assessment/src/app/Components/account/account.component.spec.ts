import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AccountComponent } from './account.component';
import { RequestsService } from '../../services/requests/requests.service';
import { UsersService } from '../../services/users/users.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let requestsServiceSpy: jasmine.SpyObj<RequestsService>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    const mockRequestsService = jasmine.createSpyObj('RequestsService', ['getRequestCount', 'removePendingRequests']);
    const mockUsersService = jasmine.createSpyObj('UsersService', ['getUserProfilePicture', 'deleteUserByUsername']);
    const mockHttpClient = jasmine.createSpyObj('HttpClient', ['post']);

    await TestBed.configureTestingModule({
      imports: [
        AccountComponent, 
        HttpClientTestingModule, 
        RouterTestingModule
      ],
      providers: [
        { provide: RequestsService, useValue: mockRequestsService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    requestsServiceSpy = TestBed.inject(RequestsService) as jasmine.SpyObj<RequestsService>;
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;

    // Mock localStorage
    const mockLocalStorageData = JSON.stringify({
      username: 'testuser',
      roles: ['groupAdmin'],
      email: 'testuser@example.com',
      userId: '123'
    });
    spyOn(localStorage, 'getItem').and.callFake((key) => key === 'currentUser' ? mockLocalStorageData : null);
    spyOn(localStorage, 'removeItem');
    spyOn(window, 'alert');
  });

  it('should create the AccountComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('Profile Picture Upload', () => {
    it('should alert if no file is selected during profile picture upload', () => {
      component.selectedFile = null;
      component.uploadProfilePicture();
      expect(window.alert).toHaveBeenCalledWith('Please select a file to upload.');
    });

    it('should upload profile picture and update the component state on success', () => {
      const mockFile = new File([''], 'mock-image.png', { type: 'image/png' });
      component.selectedFile = mockFile;

      const mockResponse = { imageUrl: 'http://mockurl.com/new-profile.png' };
      httpClientSpy.post.and.returnValue(of(mockResponse));  // Spy on the HttpClient post method

      component.uploadProfilePicture();

      expect(httpClientSpy.post).toHaveBeenCalled();
      expect(component.profilePicture).toBe(mockResponse.imageUrl);
    });

    it('should handle error during profile picture upload', () => {
      const mockFile = new File([''], 'mock-image.png', { type: 'image/png' });
      component.selectedFile = mockFile;

      httpClientSpy.post.and.returnValue(throwError(() => new Error('Upload failed')));  // Simulate an error

      component.uploadProfilePicture();

      expect(window.alert).toHaveBeenCalledWith('Failed to upload profile picture.');
    });
  });
});
