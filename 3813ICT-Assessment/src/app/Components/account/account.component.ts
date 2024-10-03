import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestsService } from '../../services/requests/requests.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  // User information
  username: string = '';
  roles: string[] = [];
  email: string = '';
  userId: string = '';
  requestCount: number = 0;

  constructor(
    private router: Router, 
    private requestsService: RequestsService, 
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    // Retrieve currentUser information from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = storedUser.username || '';
    this.roles = storedUser.roles || [];
    this.email = storedUser.email || '';
    this.userId = storedUser.userId || '';

    if (this.isGroupAdminOrSuperAdmin()) {
      // Subscribe to the observable to get the request count value
      this.requestsService.getRequestCount().subscribe({
        next: (count) => {
          this.requestCount = count;
        },
        error: (err) => {
          console.error('Failed to get request count:', err);
        }
      });
    }
  }

  //******************************Checks******************************
  isGroupAdminOrSuperAdmin(): boolean {
    return this.roles.includes('groupAdmin') || this.roles.includes('superAdmin');
  }

  //******************************Button Methods******************************
  logout(): void {
    localStorage.removeItem('currentUser');
    console.log('User logged out');
    this.router.navigate(['/']);
  }

  deleteAccount(): void {
    if (this.isGroupAdminOrSuperAdmin()) {
      alert('Group Admins and Super Admins cannot delete their accounts.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmed) {
      this.usersService.deleteUser(this.username).subscribe({
        next: () => {
          // Remove pending requests after user deletion
          this.requestsService.removePendingRequests(this.username).subscribe({
            next: () => {
              console.log(`Pending requests for ${this.username} removed.`);
            },
            error: (err) => {
              console.error('Failed to remove pending requests:', err);
            }
          });

          localStorage.removeItem('currentUser');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to delete user:', err);
        }
      });
    } else {
      console.log('Account deletion cancelled');
    }
  }

  //******************************Component Navigation******************************
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  navigateToUserGroup(): void {
    this.router.navigate(['/user-group']);
  }
}
