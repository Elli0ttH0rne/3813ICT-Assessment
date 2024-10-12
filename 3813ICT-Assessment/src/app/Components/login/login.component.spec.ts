import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { UsersService } from '../../services/users/users.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let router: Router;

  beforeEach(async () => {
    const mockUsersService = jasmine.createSpyObj('UsersService', ['getValidUsers']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        RouterTestingModule.withRoutes([]) 
      ],
      providers: [
        { provide: UsersService, useValue: mockUsersService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    router = TestBed.inject(Router);  

    // Spy on the real router's navigate method
    spyOn(router, 'navigate').and.stub();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /user-group on successful login', () => {
    const mockUsers = [
      {
        userId: '123',
        username: 'testuser',
        password: 'testpassword',
        email: 'test@test.com',
        roles: ['user'],
        groups: ['group1']
      }
    ];

    // Set form inputs
    component.username = 'testuser';
    component.password = 'testpassword';

    // Mock the getValidUsers response
    usersServiceSpy.getValidUsers.and.returnValue(of(mockUsers));

    // Call the handleSubmit method
    component.handleSubmit();

    // Expect the navigate function to be called with the right argument
    expect(router.navigate).toHaveBeenCalledWith(['/user-group']);
    expect(localStorage.getItem('currentUser')).toContain('testuser');
  });

  it('should alert "Invalid credentials" if username or password is incorrect', () => {
    const mockUsers = [
      {
        userId: '123',
        username: 'testuser',
        password: 'testpassword',
        email: 'test@test.com',
        roles: ['user'],
        groups: ['group1']
      }
    ];

    // Set form inputs with incorrect credentials
    component.username = 'wronguser';
    component.password = 'wrongpassword';

    // Mock the getValidUsers response
    usersServiceSpy.getValidUsers.and.returnValue(of(mockUsers));

    // Spy on window alert
    spyOn(window, 'alert');

    // Call the handleSubmit method
    component.handleSubmit();

    // Expect the alert function to be called with 'Invalid username or password'
    expect(window.alert).toHaveBeenCalledWith('Invalid username or password');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should alert an error if getValidUsers fails', () => {
    // Mock the getValidUsers response to throw an error
    usersServiceSpy.getValidUsers.and.returnValue(throwError(() => new Error('Error loading users')));

    // Spy on window alert
    spyOn(window, 'alert');

    // Call the handleSubmit method
    component.handleSubmit();

    // Expect the alert function to be called with an error message
    expect(window.alert).toHaveBeenCalledWith('An error occurred while trying to log in.');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
